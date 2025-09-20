# SQLAlchemy ORM models

from sqlalchemy import Column, Integer, BigInteger, String, Text, TIMESTAMP, Float, Date, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class Participant(Base):
    __tablename__ = "participants"
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(String, unique=True, nullable=False, index=True)

    timeseries = relationship("TimeSeries", back_populates="participant")
    summaries = relationship("DailySummary", back_populates="participant")


class TimeSeries(Base):
    __tablename__ = "timeseries"
    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("participants.id", ondelete="CASCADE"), index=True)
    ts = Column(TIMESTAMP(timezone=True), nullable=False, index=True)
    source = Column(String, index=True)
    x = Column(Float, nullable=True)
    y = Column(Float, nullable=True)
    z = Column(Float, nullable=True)
    value = Column(Float, nullable=True)
    label = Column(String, nullable=True)

    participant = relationship("Participant", back_populates="timeseries")


class DailySummary(Base):
    __tablename__ = "daily_summary"
    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("participants.id", ondelete="CASCADE"), index=True)
    day = Column(Date, index=True)
    total_seconds = Column(BigInteger, nullable=True)
    avg_activity = Column(Float, nullable=True)
    anomaly_flag = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    participant = relationship("Participant", back_populates="summaries")
