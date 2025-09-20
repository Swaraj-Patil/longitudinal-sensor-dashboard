# Pydantic models for requests and responses

from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel

class ParticipantBase(BaseModel):
    subject_id: str

class ParticipantOut(ParticipantBase):
    id: int
    class Config:
        orm_mode = True

class TimeSeriesPoint(BaseModel):
    ts: datetime
    source: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None
    z: Optional[float] = None
    value: Optional[float] = None
    label: Optional[str] = None

    class Config:
        orm_mode = True

class TimeSeriesResponse(BaseModel):
    participant_id: int
    points: List[TimeSeriesPoint]

class DailySummaryOut(BaseModel):
    day: date
    total_seconds: Optional[int] = None
    avg_activity: Optional[float] = None
    anomaly_flag: Optional[bool] = None

    class Config:
        orm_mode = True

class UploadResponse(BaseModel):
    status: str
    loaded: int
