# creates engine and session local

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_URL = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or "postgresql+psycopg2://postgres:postgres@db:5432/sensors"

# Using synchronous SQLAlchemy engine for simplicity in this tutorial
engine = create_engine(DB_URL, pool_pre_ping=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
