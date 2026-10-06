# NetOps One

NetOps One is a portfolio-grade network operations dashboard for monitoring and automating multi-vendor infrastructure.

## V0.1 scope

- React + TypeScript dashboard
- FastAPI backend
- Simulated Cisco, MikroTik and FortiGate devices
- Device health, alerts, jobs and backup status
- Safe automation workflow model: pre-check → backup → change → verify → rollback

## Architecture

```text
Frontend (React + TypeScript)
        |
        | REST API
        v
Backend (FastAPI)
        |
        +-- Simulated devices
        +-- Jobs
        +-- Alerts
        +-- Backups
```

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Portfolio value

This project demonstrates:
- IT/network operations thinking
- REST API design
- React/TypeScript UI development
- Python/FastAPI development
- Multi-vendor network automation architecture
- Safe change-control concepts including verification and rollback

## Roadmap

- PostgreSQL persistence
- Redis/Celery background jobs
- WebSockets for live progress
- Netmiko/Nornir drivers
- VMware integration
- Role-based access control
- Lab validation in EVE-NG/GNS3/CML
