# creates engine and session local

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Get the environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Set database URL based on environment
if ENVIRONMENT == "development":
    # Local development with Docker Compose
    DB_URL = "postgresql+psycopg2://postgres:postgres@db:5432/sensors"
elif ENVIRONMENT == "production":
    # Production environment (Railway)
    DB_URL = os.getenv("DATABASE_URL")
    if not DB_URL:
        raise ValueError("DATABASE_URL environment variable is not set in production environment")
else:
    raise ValueError(f"Unknown environment: {ENVIRONMENT}")

# Using synchronous SQLAlchemy engine for simplicity in this tutorial
engine = create_engine(DB_URL, pool_pre_ping=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
