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
    {"id": 1, "name": "core-sw-01", "vendor": "Cisco", "site": "London-HQ", "ip": "10.10.0.10", "status": "healthy"},
    {"id": 2, "name": "edge-rtr-01", "vendor": "MikroTik", "site": "London-HQ", "ip": "10.10.0.1", "status": "healthy"},
    {"id": 3, "name": "fw-01", "vendor": "Fortinet", "site": "London-HQ", "ip": "10.10.0.254", "status": "warning"},
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

@app.get("/summary")
def get_summary():
    return {
        "sites": len({d["site"] for d in DEVICES}),
        "devices": len(DEVICES),
        "healthy": sum(d["status"] == "healthy" for d in DEVICES),
        "warnings": sum(d["status"] == "warning" for d in DEVICES),
    }
