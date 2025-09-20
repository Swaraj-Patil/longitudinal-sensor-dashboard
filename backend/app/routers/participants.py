from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from .. import schemas, models
from ..database import SessionLocal, engine
from ..crud import list_participants
from sqlalchemy.orm import Session

router = APIRouter(prefix="/participants", tags=["participants"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.ParticipantOut])
def read_participants(limit: int = Query(100), offset: int = Query(0), db: Session = Depends(get_db)):
    return list_participants(db, limit=limit, offset=offset)
