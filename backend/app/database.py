import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

# Use DATABASE_URL if present (Railway/Heroku style), otherwise fall back to local-compose DB
DB_URL = os.getenv("DATABASE_URL")
if DB_URL:
    # SQLAlchemy prefers 'postgresql+psycopg2://' for explicit driver in some setups
    if DB_URL.startswith("postgres://"):
        DB_URL = DB_URL.replace("postgres://", "postgresql+psycopg2://", 1)
else:
    # local development fallback (Docker Compose)
    DB_URL = "postgresql+psycopg2://postgres:postgres@db:5432/sensors"

# create engine
engine = create_engine(DB_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
