# DB operations used by routers

from sqlalchemy.orm import Session
from sqlalchemy import select, and_, func
from . import models
from datetime import datetime, date

def get_or_create_participant(db: Session, subject_id: str):
    q = db.execute(select(models.Participant).where(models.Participant.subject_id == subject_id))
    participant = q.scalars().first()
    if participant:
        return participant
    participant = models.Participant(subject_id=subject_id)
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant

def list_participants(db: Session, limit: int = 100, offset: int = 0):
    q = db.execute(select(models.Participant).limit(limit).offset(offset))
    return q.scalars().all()

def query_timeseries(db: Session, participant_id: int = None, start_ts: datetime = None, end_ts: datetime = None, source: str = None, limit: int = 10000):
    q = select(models.TimeSeries)
    if participant_id is not None:
        q = q.where(models.TimeSeries.participant_id == participant_id)
    if source:
        q = q.where(models.TimeSeries.source == source)
    if start_ts:
        q = q.where(models.TimeSeries.ts >= start_ts)
    if end_ts:
        q = q.where(models.TimeSeries.ts <= end_ts)
    q = q.order_by(models.TimeSeries.ts).limit(limit)
    res = db.execute(q)
    return res.scalars().all()

def query_daily_summaries(db: Session, participant_id: int, start_day: date = None, end_day: date = None):
    q = select(models.DailySummary).where(models.DailySummary.participant_id == participant_id)
    if start_day:
        q = q.where(models.DailySummary.day >= start_day)
    if end_day:
        q = q.where(models.DailySummary.day <= end_day)
    q = q.order_by(models.DailySummary.day)
    res = db.execute(q)
    return res.scalars().all()

def insert_daily_summaries_bulk(db: Session, rows):
    """
    rows: list of dicts matching DailySummary columns
    """
    db.bulk_insert_mappings(models.DailySummary, rows)
    db.commit()
