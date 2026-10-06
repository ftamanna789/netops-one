from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NetOps One API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICES = [
    {"id": 1, "name": "core-sw-01", "vendor": "Cisco", "site": "London-HQ", "ip": "10.10.0.10", "status": "healthy", "cpu": 24, "memory": 41},
    {"id": 2, "name": "edge-rtr-01", "vendor": "MikroTik", "site": "London-HQ", "ip": "10.10.0.1", "status": "healthy", "cpu": 18, "memory": 36},
    {"id": 3, "name": "fw-01", "vendor": "Fortinet", "site": "London-HQ", "ip": "10.10.0.254", "status": "warning", "cpu": 63, "memory": 74},
    {"id": 4, "name": "branch-sw-01", "vendor": "Cisco", "site": "Cambridge", "ip": "10.20.0.10", "status": "healthy", "cpu": 22, "memory": 33},
]

ALERTS = [
    {"id": 1, "severity": "high", "device": "fw-01", "message": "Memory utilisation above 70%", "status": "open"},
    {"id": 2, "severity": "medium", "device": "core-sw-01", "message": "Interface Gi1/0/24 flapped twice", "status": "acknowledged"},
    {"id": 3, "severity": "low", "device": "branch-sw-01", "message": "Configuration backup due", "status": "open"},
]

JOBS = [
    {"id": 101, "type": "Backup All", "target": "All devices", "stage": "Verify", "status": "running", "progress": 80},
    {"id": 102, "type": "Change DNS", "target": "London-HQ", "stage": "Complete", "status": "success", "progress": 100},
    {"id": 103, "type": "Health Check", "target": "Cambridge", "stage": "Complete", "status": "success", "progress": 100},
]

BACKUPS = [
    {"device": "core-sw-01", "last_backup": "2026-10-06 11:30", "status": "success"},
    {"device": "edge-rtr-01", "last_backup": "2026-10-06 11:31", "status": "success"},
    {"device": "fw-01", "last_backup": "2026-10-05 18:20", "status": "warning"},
    {"device": "branch-sw-01", "last_backup": "2026-10-06 09:15", "status": "success"},
]

@app.get("/")
def root():
    return {"name": "NetOps One API", "version": "0.1.0"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/devices")
def get_devices():
    return DEVICES

@app.get("/alerts")
def get_alerts():
    return ALERTS

@app.get("/jobs")
def get_jobs():
    return JOBS

@app.get("/backups")
def get_backups():
    return BACKUPS

@app.get("/summary")
def get_summary():
    return {
        "sites": len({d["site"] for d in DEVICES}),
        "devices": len(DEVICES),
        "healthy": sum(d["status"] == "healthy" for d in DEVICES),
        "warnings": sum(d["status"] == "warning" for d in DEVICES),
        "open_alerts": sum(a["status"] == "open" for a in ALERTS),
        "running_jobs": sum(j["status"] == "running" for j in JOBS),
    }
