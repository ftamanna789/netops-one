import { useEffect, useState } from "react";

type Summary = {
  sites: number;
  devices: number;
  healthy: number;
  warnings: number;
  open_alerts: number;
  running_jobs: number;
};

type Device = {
  id: number;
  name: string;
  vendor: string;
  site: string;
  ip: string;
  status: string;
  cpu: number;
  memory: number;
};

type Alert = {
  id: number;
  severity: string;
  device: string;
  message: string;
  status: string;
};

type Job = {
  id: number;
  type: string;
  target: string;
  stage: string;
  status: string;
  progress: number;
};

type Backup = {
  device: string;
  last_backup: string;
  status: string;
};

const API = "http://127.0.0.1:8000";

export default function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(API + "/summary").then((r) => r.json()),
      fetch(API + "/devices").then((r) => r.json()),
      fetch(API + "/alerts").then((r) => r.json()),
      fetch(API + "/jobs").then((r) => r.json()),
      fetch(API + "/backups").then((r) => r.json()),
    ])
      .then(([summaryData, deviceData, alertData, jobData, backupData]) => {
        setSummary(summaryData);
        setDevices(deviceData);
        setAlerts(alertData);
        setJobs(jobData);
        setBackups(backupData);
      })
      .catch(() => setError("Backend unavailable. Start FastAPI on port 8000."));
  }, []);

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p>NETWORK CONTROL CENTER</p>
          <h1>NetOps One</h1>
        </div>
        <span className="lab-badge">Simulated Lab</span>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="stats">
        <article><small>Sites</small><strong>{summary?.sites ?? 0}</strong></article>
        <article><small>Devices</small><strong>{summary?.devices ?? 0}</strong></article>
        <article><small>Healthy</small><strong>{summary?.healthy ?? 0}</strong></article>
        <article><small>Warnings</small><strong>{summary?.warnings ?? 0}</strong></article>
        <article><small>Open Alerts</small><strong>{summary?.open_alerts ?? 0}</strong></article>
        <article><small>Running Jobs</small><strong>{summary?.running_jobs ?? 0}</strong></article>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Devices</h2>
          <span>{devices.length} simulated devices</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Vendor</th><th>Site</th><th>IP Address</th><th>Status</th><th>CPU</th><th>Memory</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.name}</td>
                  <td>{device.vendor}</td>
                  <td>{device.site}</td>
                  <td>{device.ip}</td>
                  <td><span className={"badge " + device.status}>{device.status}</span></td>
                  <td>{device.cpu}%</td>
                  <td>{device.memory}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="section-heading">
            <h2>Recent Alerts</h2>
            <span>{alerts.length} total</span>
          </div>
          <div className="stack">
            {alerts.map((alert) => (
              <div className="list-row" key={alert.id}>
                <span className={"severity " + alert.severity}>{alert.severity}</span>
                <div>
                  <strong>{alert.device}</strong>
                  <p>{alert.message}</p>
                </div>
                <span className="muted">{alert.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <h2>Backups</h2>
            <span>{backups.length} devices</span>
          </div>
          <div className="stack">
            {backups.map((backup) => (
              <div className="list-row" key={backup.device}>
                <div>
                  <strong>{backup.device}</strong>
                  <p>{backup.last_backup}</p>
                </div>
                <span className={"badge " + backup.status}>{backup.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Automation Jobs</h2>
          <span>Pre-check → Backup → Change → Verify → Rollback</span>
        </div>
        <div className="jobs">
          {jobs.map((job) => (
            <div className="job" key={job.id}>
              <div className="job-top">
                <div>
                  <strong>{job.type}</strong>
                  <p>{job.target} · {job.stage}</p>
                </div>
                <span className={"badge " + job.status}>{job.status}</span>
              </div>
              <div className="progress"><span style={{ width: job.progress + "%" }} /></div>
              <small>{job.progress}%</small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
