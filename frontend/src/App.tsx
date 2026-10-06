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

const navItems = [
  "Dashboard",
  "Sites",
  "Devices",
  "Automation",
  "Backups",
  "Servers",
  "VMware",
  "Network",
  "Monitoring",
  "Logs & Audit",
  "Users & Access",
  "Reports",
  "Settings",
];

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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div>
            <strong>NetOps One</strong>
            <span>Infrastructure Control Center</span>
          </div>
        </div>

        <nav>
          {navItems.map((item, index) => (
            <button className={index === 0 ? "nav-item active" : "nav-item"} key={item}>
              <span className="nav-dot" />
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="search-box">
            <span>⌕</span>
            <input placeholder="Search devices, sites, IPs, actions..." />
            <kbd>⌘ K</kbd>
          </div>

          <div className="topbar-actions">
            <button className="icon-button">◔</button>
            <button className="icon-button">☼</button>
            <div className="user-pill">
              <div className="avatar">FT</div>
              <div>
                <strong>Fouzia</strong>
                <span>IT Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <main className="content">
          <div className="page-heading">
            <div>
              <p>NETWORK CONTROL CENTER</p>
              <h1>Dashboard</h1>
            </div>
            <span className="lab-badge">Simulated Lab</span>
          </div>

          {error && <div className="error">{error}</div>}

          <section className="stats">
            <article><small>Total Sites</small><strong>{summary?.sites ?? 0}</strong><span>{summary?.sites ?? 0} simulated locations</span></article>
            <article><small>Network Devices</small><strong>{summary?.devices ?? 0}</strong><span>{summary?.healthy ?? 0} healthy</span></article>
            <article><small>Healthy</small><strong>{summary?.healthy ?? 0}</strong><span>Operational</span></article>
            <article><small>Warnings</small><strong>{summary?.warnings ?? 0}</strong><span>Need attention</span></article>
            <article><small>Open Alerts</small><strong>{summary?.open_alerts ?? 0}</strong><span>Across monitored devices</span></article>
            <article><small>Running Jobs</small><strong>{summary?.running_jobs ?? 0}</strong><span>Automation in progress</span></article>
          </section>

          <section className="panel overview-panel">
            <div className="section-heading">
              <div>
                <h2>Infrastructure Overview</h2>
                <p className="section-subtitle">Simulated multi-vendor topology</p>
              </div>
              <div className="overview-controls">
                <span className="mini-pill">All Sites</span>
                <span className="mini-pill active-pill">Live</span>
              </div>
            </div>

            <div className="topology">
              <div className="topology-node internet">
                <div className="node-icon">◎</div>
                <strong>Internet</strong>
                <span>WAN</span>
              </div>

              <div className="connector horizontal c1" />

              <div className="topology-node firewall">
                <div className="node-icon">▦</div>
                <strong>FortiGate</strong>
                <span>fw-01</span>
              </div>

              <div className="connector horizontal c2" />

              <div className="topology-node core">
                <div className="node-icon">▤</div>
                <strong>Core Switch</strong>
                <span>core-sw-01</span>
              </div>

              <div className="connector branch-line servers-line" />
              <div className="connector branch-line vmware-line" />
              <div className="connector branch-line branchsites-line" />

              <div className="topology-node servers">
                <div className="node-icon">▥</div>
                <strong>Servers</strong>
                <span>18 online</span>
              </div>

              <div className="topology-node vmware">
                <div className="node-icon">VM</div>
                <strong>VMware</strong>
                <span>36 VMs</span>
              </div>

              <div className="topology-node branches">
                <div className="node-icon">⌂</div>
                <strong>Branch Sites</strong>
                <span>Cambridge + London</span>
              </div>
            </div>
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
      </div>
    </div>
  );
}
