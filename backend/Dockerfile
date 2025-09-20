
# Use official Python slim image
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# system deps for psycopg2 and pandas
RUN apt-get update \
  && apt-get install -y --no-install-recommends gcc libpq-dev build-essential \
  && rm -rf /var/lib/apt/lists/*

# copy and install python deps
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip \
  && pip install --no-cache-dir -r /app/requirements.txt

# copy app
COPY app /app/app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
