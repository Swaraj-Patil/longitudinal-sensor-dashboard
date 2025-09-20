import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import make_url

logger = logging.getLogger("uvicorn.error")
Base = declarative_base()

DB_URL = os.getenv("DATABASE_URL")
if DB_URL:
    # convert legacy "postgres://" to SQLAlchemy driver url if needed
    if DB_URL.startswith("postgres://"):
        DB_URL = DB_URL.replace("postgres://", "postgresql+psycopg2://", 1)
else:
    # local development fallback (only used when DATABASE_URL is missing)
    DB_URL = "postgresql+psycopg2://postgres:postgres@db:5432/sensors"

# Parse and log host/port/db (mask credentials) so we can debug env problems quickly
try:
    parsed = make_url(DB_URL)
    logger.info("Using DB host=%s port=%s name=%s (driver=%s)", parsed.host, parsed.port, parsed.database, parsed.drivername)
except Exception as e:
    logger.exception("Failed to parse DATABASE_URL: %s", e)

# create engine
engine = create_engine(DB_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
