from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Optional
from datetime import datetime
from ..schemas import TimeSeriesPoint
from ..crud import query_timeseries
from ..database import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter(prefix="/timeseries", tags=["timeseries"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[TimeSeriesPoint])
def get_timeseries(participant_id: int, start_ts: Optional[datetime] = None, end_ts: Optional[datetime] = None,
                   source: Optional[str] = None, limit: int = Query(10000), db: Session = Depends(get_db)):
    rows = query_timeseries(db, participant_id=participant_id, start_ts=start_ts, end_ts=end_ts, source=source, limit=limit)
    # convert ORM TimeSeries -> TimeSeriesPoint via Pydantic (orm_mode)
    return rows
