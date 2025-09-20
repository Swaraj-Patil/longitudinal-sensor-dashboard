# handles CSV upload

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
import pandas as pd
import io
from ..etl import normalize_and_store
from ..schemas import UploadResponse
from ..database import SessionLocal

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/csv/", response_model=UploadResponse)
async def upload_csv(subject_id: str = Form(...), source: str = Form(...), file: UploadFile = File(...)):
    # read file content into pandas
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV or read error: {e}")

    try:
        loaded = normalize_and_store(subject_id, source, df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ETL error: {e}")

    return {"status": "ok", "loaded": loaded}
