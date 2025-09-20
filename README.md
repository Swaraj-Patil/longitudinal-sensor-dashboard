# Longitudinal Sensor Dashboard

> A professional, open-source web application for visualizing passive time-series sensor data: activity, sleep proxy, phone usage, and anomalies. Built with a React/Vite frontend and a FastAPI + PostgreSQL backend.  

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Architecture & Tech Stack](#architecture--tech-stack)  
4. [Getting Started](#getting-started)  
   * Prerequisites  
   * Setup (Local Development)  
   * Running with Docker  
5. [Usage](#usage)  
   * API Endpoints  
   * Frontend behavior  
6. [Configuration](#configuration)  
7. [Testing & Quality](#testing--quality)  
8. [Future Work](#future-work)  
9. [License & Acknowledgments](#license--acknowledgments)

---

## Overview

Longitudinal Sensor Dashboard transforms raw passive sensing data (e.g. accelerometer, phone usage, ambient signals) into clinician-friendly visual summaries. Users can upload CSV sensor data, view timelines across multiple signal sources, inspect daily summaries, and see anomalies flagged in their behavior. Designed for clarity, interpretability, and ease of deployment.

---

## Features

- Upload raw CSVs of sensor data (with timestamp, optional fields like x, y, z, or a generic “value”) via REST API.  
- Automatic normalization (timestamp parsing, resampling), storage of high-frequency time-series data.  
- Computation of daily summaries: total active seconds, average activity level, anomaly detection.  
- Multiple signal “lanes” in the UI: e.g. activity, phone usage, sleep proxy, all synchronized on a common time axis.  
- Summary cards showing KPIs (active time, sleep estimate, phone usage, anomaly count) for selected participant/time period.  
- Participant selector (dropdown) for switching between subjects.  
- Responsive frontend with modern, minimalist design (using React + Vite).  
- Dockerized backend + database for easy deployment.

---

## Architecture & Tech Stack

| Layer | Technology |
|---|---|
| Backend API | **FastAPI** (Python) |
| Database / ORM | **PostgreSQL**, **SQLAlchemy** |
| Frontend | **React** with **Vite** |
| Charts & UI Components | Recharts (or similar), dropdowns, timeline lanes |
| Deployment / Containerization | Docker, Docker Compose |
| Data Processing / ETL | Pandas, resampling, bulk inserts, daily summary computation |

---

## Getting Started

### Prerequisites

- Docker & Docker Compose  
- Python 3.10+ (if running backend locally)  
- Node.js + npm / Yarn (for frontend via Vite)  

### Setup for Local Development

1. Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd longitudinal-sensor-dashboard
    ```

2. Backend (local, without Docker):
    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate   # On Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```

3. Frontend:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

By default, frontend may run on http://localhost:3000 (or the port Vite config indicates).

## Running with Docker

From project root:
```bash
docker compose up --build
```

This spins up:
- PostgreSQL database
- FastAPI backend
- (Optionally) frontend, if you’ve added it into the Compose stack

## Usage
### API Endpoints

Here are the primary API routes:
| Endpoint                | Method   | Purpose                                                                                                             |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `GET /participants/`    | **GET**  | List all participants (id + `subject_id`)                                                                           |
| `POST /upload/csv/`     | **POST** | Upload sensor CSV file for a given subject + source                                                                 |
| `GET /timeseries/`      | **GET**  | Fetch time-series points for a participant (with optional `start_ts`, `end_ts`, `source`)                           |
| `GET /summaries/daily/` | **GET**  | Fetch daily summarized metrics (active seconds, average activity, anomaly flag) for a participant over a date range |
| `GET /health`           | **GET**  | Health check for backend API                                                                                        |
(Use subject_id field to display participant name in UI dropdown. If richer metadata is needed in future, backend can be extended.)

### Frontend Behavior
- On page load, frontend fetches participants via /participants/ endpoint to populate dropdown.
- Selecting a participant triggers fetching of summaries and time-series data for that subject.
- Summary cards display key metrics (active time, anomaly counts, etc.).
- Timeline charts show multiple signal lanes aligned with time axis; anomalies highlighted visually.

## Configuration
- Backend uses DATABASE_URL (or POSTGRES_URL) environment variable to connect to PostgreSQL.
- Frontend uses API base URL; configure in your environment or a .env file.
- CORS is enabled in backend for specified frontend origins (update if deploying to other domains).
- Anomaly detection thresholds (e.g. deviation beyond N standard deviations) are coded currently; may be configurable via environment or UI in future.

## Testing & Quality
- All key flows (upload, query participants, time-series query, daily summary) have been developed with validation and error handling.
- Schemas (via Pydantic) ensure strict request/response contracts.
- Modular code structure (routers, models, schemas, ETL) ensures maintainability.
- Dockerization ensures consistent environments.
- Logs and error responses are standard; health endpoint provided.

## Future Work
- Add user authentication & authorization (to restrict access per clinician or subject).
- Support for very large file ingest: streaming / background jobs / async workers.
- Add richer participant metadata (full name, demographics) for display.
- Add date-range presets and custom anomaly thresholds via UI.
- Improve visuals: tooltips, zooming timeline, export charts / download data.
- Add unit tests / integration tests for both frontend and backend (if not already).

## License & Acknowledgments

This project is released under the *MIT License*.

Developed by Swaraj Patil. Built with professionalism and attention to maintainability. Acknowledgements to public datasets & open-source libraries used (FastAPI, React, SQLAlchemy, Recharts, etc.).