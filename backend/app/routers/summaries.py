from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from datetime import date
from ..schemas import DailySummaryOut
from ..crud import query_daily_summaries
from ..database import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter(prefix="/summaries", tags=["summaries"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/daily/", response_model=List[DailySummaryOut])
def get_daily_summaries(participant_id: int, start_day: Optional[date] = None, end_day: Optional[date] = None,
                        db: Session = Depends(get_db)):
    return query_daily_summaries(db, participant_id, start_day, end_day)
