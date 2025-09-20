# assemble the app and include routers

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models
from .routers import upload, participants, timeseries, summaries

app = FastAPI(title="Longitudinal Sensor ETL API")

# Create DB tables at startup (dev convenience). In production, use Alembic migrations.
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# Get allowed origins from environment variable or default to local development
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173"  # Added Vite's default port
).split(",")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(upload.router)
app.include_router(participants.router)
app.include_router(timeseries.router)
app.include_router(summaries.router)

@app.get("/health")
def health():
    return {"status": "ok"}
