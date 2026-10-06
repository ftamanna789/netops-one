# NetOps One

A full-stack network operations dashboard for monitoring simulated multi-vendor infrastructure and demonstrating safe network automation workflows.

Built as a portfolio project to showcase practical skills in **React, TypeScript, Python, FastAPI, REST APIs, network operations, alerting, backups and automation design**.

## Current V0.1

NetOps One currently includes:

- Dashboard summary cards for sites, devices, health, warnings, alerts and running jobs
- Simulated **Cisco, MikroTik and Fortinet** devices
- Device inventory with IP address, site, CPU, memory and health status
- Recent alerts with **High / Medium / Low** severity
- Configuration backup status
- Automation job progress
- Safe workflow model:
  **Pre-check → Backup → Change → Verify → Rollback**
- React + TypeScript frontend
- Python FastAPI backend
- REST API communication between frontend and backend

> The current device data, alerts and jobs are simulated for demonstration and portfolio purposes. No production network equipment is being modified.

## Dashboard

The current dashboard provides a central view of:

- **2 simulated sites**
- **4 simulated devices**
- Device health and warning status
- Recent network alerts
- Backup results
- Running and completed automation jobs

![NetOps One dashboard](02_48_20%20PM.png)

### Key Features

- Centralised view of sites, devices and health with simulated real-time metrics.
- Safe automation workflow with **Pre-check → Backup → Change → Verify → Rollback**.
- Mock REST API backend ready for future multi-vendor device integration.

## Architecture

```text
┌──────────────────────────────┐
│     React + TypeScript       │
│          Frontend            │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│          FastAPI             │
│          Backend             │
└──────────────┬───────────────┘
               │
     ┌─────────┼─────────┐
     ▼         ▼         ▼
  Devices    Alerts     Jobs
     │                   │
     └──────── Backups ──┘
```

## Example Simulated Devices

| Device | Vendor | Site | Role |
|---|---|---|---|
| core-sw-01 | Cisco | London-HQ | Core switch |
| edge-rtr-01 | MikroTik | London-HQ | Edge router |
| fw-01 | Fortinet | London-HQ | Firewall |
| branch-sw-01 | Cisco | Cambridge | Branch switch |

## API Endpoints

The FastAPI backend currently exposes:

```text
GET /health
GET /devices
GET /alerts
GET /jobs
GET /backups
GET /summary
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/ftamanna789/netops-one.git
cd netops-one
```

### 2. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

### 3. Start the frontend

Open a second Terminal window:

```bash
cd ~/netops-one/frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Technology Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- Python
- FastAPI
- Uvicorn

**Network / Automation Concepts**
- Multi-vendor device management
- Health monitoring
- Incident severity
- Configuration backups
- Change verification
- Rollback design
- REST API integration

## Why I Built This Project

The goal of NetOps One is to demonstrate how network and infrastructure support tasks can be brought into a single operational dashboard.

The project combines my background in IT support, networking and systems troubleshooting with software development and automation concepts.

It is designed to be expanded from simulated devices into a lab environment before any connection to real network infrastructure.

## Portfolio Skills Demonstrated

- Network monitoring concepts
- Troubleshooting and operational visibility
- REST API development
- React/TypeScript frontend development
- Python/FastAPI backend development
- Multi-vendor network architecture
- Alert and incident handling
- Backup and change-management workflows
- Safe automation design

## Roadmap

Planned future improvements:

- Infrastructure topology view
- Quick Actions for Backup All, Health Check and Change DNS
- PostgreSQL persistence
- Redis + Celery background jobs
- WebSocket live job progress
- Netmiko / Nornir device drivers
- VMware integration
- Role-based access control
- Approval workflows
- Dry-run configuration diffs
- EVE-NG / GNS3 / Cisco CML lab validation

## CV Project Entry

**NetOps One — Network Operations & Automation Dashboard**  
*React, TypeScript, Python, FastAPI, REST APIs*

- Developed a full-stack network operations dashboard for monitoring simulated multi-vendor infrastructure.
- Built a React/TypeScript frontend displaying device health, alerts, backup status and automation job progress.
- Developed FastAPI REST endpoints for devices, alerts, jobs, backups and infrastructure summary data.
- Modelled a safe automation workflow using pre-check, backup, change, verification and rollback stages.
- Simulated Cisco, MikroTik and Fortinet devices to demonstrate network operations concepts safely before lab-device integration.

## Repository

GitHub: https://github.com/ftamanna789/netops-one
