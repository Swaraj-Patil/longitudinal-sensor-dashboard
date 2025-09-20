# normalization and storage helper (keeps pandas to_sql for speed on ingest)

import io
import os
import numpy as np
import pandas as pd
from sqlalchemy import text
from .database import engine
from .crud import get_or_create_participant, insert_daily_summaries_bulk
from . import models
from sqlalchemy.orm import Session
from datetime import timezone

def normalize_and_store(subject_id: str, source: str, df: pd.DataFrame):
    """
    1. Parse timestamp column -> 'ts' (UTC aware)
    2. Resample to 1S and interpolate numeric cols
    3. Upsert participant, bulk insert timeseries (pandas.to_sql)
    4. Compute daily summary and insert
    Returns number of rows inserted (approx)
    """
    # 1) timestamps
    if 'timestamp' in df.columns:
        df['ts'] = pd.to_datetime(df['timestamp'], utc=True)
    elif 'ts' in df.columns:
        df['ts'] = pd.to_datetime(df['ts'], utc=True)
    else:
        raise ValueError("CSV missing 'timestamp' or 'ts' column")

    # 2) set index and resample
    df = df.set_index('ts').sort_index()
    numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
    if not numeric_cols and 'value' not in df.columns:
        raise ValueError("No numeric columns found (x/y/z/value)")

    # keep x,y,z,value,label if present
    keep_cols = []
    for c in ['x', 'y', 'z', 'value', 'label']:
        if c in df.columns:
            keep_cols.append(c)

    # build resampled numeric frame
    df_numeric = df[numeric_cols] if numeric_cols else pd.DataFrame(index=df.index)
    # resample to 1-second intervals (developer can change to 1S or 1T)
    df_resampled = df_numeric.resample('1S').mean().interpolate(limit_direction='both')

    # re-attach non-numeric columns where possible using ffill/nearest
    for c in keep_cols:
        if c not in df_resampled.columns and c in df.columns:
            # forward-fill at second resolution
            df_resampled[c] = df[c].resample('1S').ffill()

    df_resampled = df_resampled.reset_index().rename(columns={'index': 'ts'})

    # 3) insert participant & timeseries
    with Session(engine) as db:
        participant = get_or_create_participant(db, subject_id)
        pid = participant.id

    # attach participant id and source
    df_resampled['participant_id'] = pid
    df_resampled['source'] = source

    # Ensure column order matches DB table: participant_id, ts, source, x,y,z,value,label
    cols = ['participant_id', 'ts', 'source', 'x', 'y', 'z', 'value', 'label']
    # ensure all cols exist
    for c in cols:
        if c not in df_resampled.columns:
            df_resampled[c] = None
    df_out = df_resampled[cols]

    # Use pandas to_sql for bulk insert (append)
    df_out.to_sql('timeseries', engine, if_exists='append', index=False, method='multi', chunksize=5000)

    # 4) compute daily summary
    # choose activity column: mag (if x,y,z) else value
    if set(['x','y','z']).issubset(df_out.columns):
        df_out['mag'] = np.sqrt((df_out['x'].fillna(0)**2 + df_out['y'].fillna(0)**2 + df_out['z'].fillna(0)**2))
        activity_col = 'mag'
    elif 'value' in df_out.columns:
        activity_col = 'value'
    else:
        activity_col = None

    daily_rows = []
    if activity_col:
        df_out['day'] = pd.to_datetime(df_out['ts']).dt.date
        daily = df_out.groupby('day').agg(
            total_seconds=('ts', 'count'),
            avg_activity=(activity_col, 'mean')
        ).reset_index()
        for _, r in daily.iterrows():
            daily_rows.append({
                "participant_id": int(pid),
                "day": r['day'],
                "total_seconds": int(r['total_seconds']),
                "avg_activity": float(r['avg_activity']) if not pd.isna(r['avg_activity']) else None,
                "anomaly_flag": False
            })
        if daily_rows:
            with Session(engine) as db:
                insert_daily_summaries_bulk(db, daily_rows)

    return len(df_out)
