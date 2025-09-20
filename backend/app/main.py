import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models
from .routers import upload, participants, timeseries, summaries

app = FastAPI(title="Longitudinal Sensor ETL API")
logger = logging.getLogger("uvicorn.error")

# Create DB tables at startup (dev convenience). In production, use Alembic migrations.
@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        # log full stacktrace for debugging
        logger.exception("DB initialization failed at startup: %s", e)

# CORS middleware configuration with all origins allowed for debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# include routers
app.include_router(upload.router)
app.include_router(participants.router)
app.include_router(timeseries.router)
app.include_router(summaries.router)

@app.get("/health")
def health():
    return {"status": "ok"}
