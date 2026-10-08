import { useEffect, useMemo, useState } from "react";
import "./styles.css";

type Summary = { sites:number; devices:number; healthy:number; warnings:number; open_alerts:number; running_jobs:number };
type Device = { id:number; name:string; vendor:string; site:string; ip:string; status:string; cpu:number; memory:number };
type Alert = { id:number; severity:string; device:string; message:string; status:string };
type Job = { id:number; type:string; target:string; stage:string; status:string; progress:number };
type Backup = { device:string; last_backup:string; status:string };

const API = "http://127.0.0.1:8000";

const fallback = {
  summary: { sites:20, devices:143, healthy:139, warnings:3, open_alerts:3, running_jobs:1 },
  devices: [
    {id:1,name:"HQ-FW01",vendor:"FortiGate",site:"HQ - Mashhad",ip:"10.10.0.1",status:"healthy",cpu:24,memory:41},
    {id:2,name:"CORE-SW01",vendor:"Cisco",site:"HQ - Mashhad",ip:"10.10.0.10",status:"healthy",cpu:18,memory:36},
    {id:3,name:"BR-01-RTR",vendor:"MikroTik",site:"Branch-01",ip:"10.20.0.1",status:"healthy",cpu:22,memory:33},
    {id:4,name:"Factory-FW01",vendor:"FortiGate",site:"Factory-01",ip:"10.30.0.1",status:"warning",cpu:92,memory:74},
  ],
  alerts: [
    {id:1,severity:"critical",device:"PTP650-01",message:"Packet loss 18%",status:"open"},
    {id:2,severity:"warning",device:"Factory-FW01",message:"High CPU 92%",status:"open"},
    {id:3,severity:"warning",device:"CORE-SW01",message:"Port Gi1/0/24 Down",status:"acknowledged"},
    {id:4,severity:"warning",device:"BR-05-RTR",message:"VPN Disconnected",status:"open"},
    {id:5,severity:"warning",device:"ESXi-01",message:"Datastore Low Space",status:"open"},
  ],
  jobs: [
    {id:8192,type:"Backup All Configs",target:"56 Devices",stage:"Verify",status:"running",progress:81},
    {id:8191,type:"Change DNS",target:"21 Routers",stage:"Complete",status:"success",progress:100},
    {id:8190,type:"Restart Service",target:"3 Servers",stage:"Complete",status:"success",progress:100},
    {id:8189,type:"Backup Firewall",target:"HQ-FW01",stage:"Failed",status:"failed",progress:100},
  ],
  backups: [
    {device:"HQ-FW01",last_backup:"2026-10-08 14:00",status:"success"},
    {device:"CORE-SW01",last_backup:"2026-10-08 13:55",status:"success"},
    {device:"BR-01-RTR",last_backup:"2026-10-08 13:50",status:"success"},
    {device:"Factory-FW01",last_backup:"2026-10-08 13:48",status:"failed"},
    {device:"ESXi-01",last_backup:"2026-10-08 13:40",status:"success"},
  ]
};

const nav = ["Dashboard","Sites","Devices","Automation","Backups","Servers","VMware","Network","Monitoring","Logs & Audit","Users & Access","Reports","Settings"];
const icons = ["▦","⌖","▣","⌘","◫","▤","◈","⌘","◩","☷","♙","◰","⚙"];

const siteRows = [
  ["HQ - Mashhad","24/24","Online","99.99%"],
  ["Factory-01","18/20","Degraded","98.12%"],
  ["Branch-01","12/12","Online","99.98%"],
  ["Branch-02","11/11","Online","99.95%"],
  ["Branch-03","10/10","Online","99.97%"],
  ["Branch-04","9/9","Online","99.96%"],
  ["Branch-05","8/8","Online","99.99%"],
  ["Branch-06","7/7","Online","99.99%"],
];

const quick = [
  ["◉","Backup All","Network Devices"],["◎","Change DNS","All Routers"],["↻","Restart VPN","MikroTik/FortiGate"],
  ["⚡","PoE Reset","Selected Ports"],["⌘","Deploy VLAN","To Switches"],["⊘","Block IP","All Firewalls"],
  ["⚙","Restart Service","Linux/Windows"],["⏻","Reboot Server","Selected Servers"],["◈","Restart VM","VMware"],
  ["◉","Snapshot VM","Create Snapshot"],["▣","Run Script","Custom Playbook"],["⚠","Emergency Mode","Isolate Site"],
];

function Gauge({value,label,sub}:{value:number;label:string;sub:string}) {
  return <div className="gauge-wrap">
    <div className="gauge" style={{"--p":`${value*3.6}deg`} as React.CSSProperties}><span>{value}%</span></div>
    <strong>{label}</strong><small>{sub}</small>
  </div>
}

export default function App() {
  const [summary,setSummary] = useState<Summary>(fallback.summary);
  const [devices,setDevices] = useState<Device[]>(fallback.devices);
  const [alerts,setAlerts] = useState<Alert[]>(fallback.alerts);
  const [jobs,setJobs] = useState<Job[]>(fallback.jobs);
  const [backups,setBackups] = useState<Backup[]>(fallback.backups);
  const [live,setLive] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(API+"/summary").then(r=>r.ok?r.json():Promise.reject()),
      fetch(API+"/devices").then(r=>r.ok?r.json():Promise.reject()),
      fetch(API+"/alerts").then(r=>r.ok?r.json():Promise.reject()),
      fetch(API+"/jobs").then(r=>r.ok?r.json():Promise.reject()),
      fetch(API+"/backups").then(r=>r.ok?r.json():Promise.reject()),
    ]).then(([s,d,a,j,b]) => {
      setSummary({...fallback.summary,...s});
      if (d?.length) setDevices(d);
      if (a?.length) setAlerts(a);
      if (j?.length) setJobs(j);
      if (b?.length) setBackups(b);
      setLive(true);
    }).catch(()=>setLive(false));
  },[]);

  const backupPct = useMemo(() => Math.round((backups.filter(b=>b.status==="success").length/Math.max(backups.length,1))*100),[backups]);

  const cards = [
    ["▥","Total Sites",summary.sites,"18 Online  |  2 Offline","↑ 1"],
    ["⌘","Network Devices",summary.devices,"139 Online  |  4 Offline","↑ 2"],
    ["▤","Servers",18,"18 Online  |  0 Offline","↑ 0"],
    ["◈","Virtual Machines",36,"35 Running  |  1 Down","↑ 1"],
    ["⚠","Alerts",summary.open_alerts,"1 Critical  |  2 Warning","↑ 1"],
    ["◉","Backups",backupPct+"%","137 OK  |  6 Failed","↑ 6%"],
  ];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="logo">⬡</div><div><b>NetOps One</b><span>Infrastructure Control Center</span></div></div>
      <nav>{nav.map((n,i)=><button className={i===0?"nav-item active":"nav-item"} key={n}><span>{icons[i]}</span>{n}</button>)}</nav>
    </aside>

    <div className="main-shell">
      <header className="topbar">
        <div className="search">⌕ <input placeholder="Search devices, sites, IP, actions... (Ctrl + K)"/></div>
        <div className="top-actions"><button>♧<i>3</i></button><button>☼</button><div className="profile"><span>FT</span><div><b>Fouzia</b><small>IT Administrator</small></div></div></div>
      </header>

      <main className="dashboard">
        <section className="kpis">
          {cards.map(([ic,t,v,s,tr])=><div className="kpi" key={String(t)}><span className="kpi-icon">{ic}</span><div><small>{t}</small><div className="metric">{v}<em>{tr}</em></div><p>{s}</p></div></div>)}
        </section>

        <section className="hero-grid">
          <div className="panel topology-panel">
            <div className="panel-title"><h2>Infrastructure Overview</h2><div><button>All Sites⌄</button><button className="selected">{live?"Live":"Demo"}</button><button>Map</button></div></div>
            <div className="topology">
              <div className="wire w1"/><div className="wire w2"/><div className="wire w3"/><div className="wire w4"/><div className="wire w5"/>
              <div className="node internet"><span>◎</span><b>Internet</b></div>
              <div className="node firewall"><span>▦</span><b>FortiGate</b><small>HQ-FW01</small></div>
              <div className="node core"><span>▤</span><b>Core Switch</b><small>CORE-SW01</small></div>
              <div className="node servers"><span>▥</span><b>Servers</b><small>18 Online</small></div>
              <div className="node vm"><span>VM</span><b>VMware</b><small>36 VMs</small></div>
              <div className="node branch"><span>▥</span><b>Branch Sites</b><small>19 Sites</small></div>
              <div className="node wifi"><span>◉</span><b>Wireless</b><small>12 Links</small></div>
              <div className="node voip"><span>☎</span><b>VoIP</b><small>UCM6302</small></div>
            </div>
          </div>

          <div className="panel sites">
            <div className="panel-title"><h2>Sites Status</h2><a>View All →</a></div>
            <table><thead><tr><th>Site</th><th>Devices</th><th>Status</th><th>Internet</th><th>Uptime</th></tr></thead>
            <tbody>{siteRows.map((r,i)=><tr key={r[0]}><td>▥ &nbsp;{r[0]}</td><td>{r[1]}</td><td><span className={i===1?"dot bad":"dot"}/>{r[2]}</td><td><span className="dot"/></td><td>{r[3]} &nbsp;›</td></tr>)}</tbody></table>
          </div>
        </section>

        <section className="middle-grid">
          <div className="panel">
            <div className="panel-title"><h2>Device Health</h2><button>Last 24 Hours⌄</button></div>
            <div className="gauges">
              <Gauge value={100} label="Firewalls" sub="8/8"/>
              <Gauge value={95} label="Routers" sub="21/22"/>
              <Gauge value={98} label="Switches" sub="42/43"/>
              <Gauge value={100} label="Wireless" sub="12/12"/>
              <Gauge value={100} label="Servers" sub="18/18"/>
              <Gauge value={97} label="VMware" sub="35/36"/>
            </div>
          </div>

          <div className="panel resources">
            <div className="panel-title"><h2>System Resources <span>(InfraOps Server)</span></h2><button>1h⌄</button></div>
            <div className="resource-rings"><Gauge value={24} label="CPU" sub=""/><Gauge value={52} label="RAM" sub=""/><Gauge value={38} label="Disk" sub=""/><Gauge value={12} label="Network" sub=""/></div>
            <div className="spark"><i/><i/><i/><i/></div>
          </div>

          <div className="panel alerts">
            <div className="panel-title"><h2>Recent Alerts</h2><a>View All →</a></div>
            <table><thead><tr><th>Time</th><th>Device</th><th>Message</th><th>Severity</th></tr></thead>
            <tbody>{alerts.slice(0,5).map((a,i)=><tr key={a.id}><td>{["15:16","14:58","13:42","11:21","09:17"][i]||"09:00"}</td><td>{a.device}</td><td>{a.message}</td><td><span className={"sev "+a.severity}>{a.severity}</span></td></tr>)}</tbody></table>
          </div>
        </section>

        <section className="panel quick-panel">
          <div className="quick-tabs"><h2>Quick Actions</h2>{["Network","Servers","VMware","Backup","Security","Tools"].map((x,i)=><button className={i===0?"selected":""} key={x}>{x}</button>)}</div>
          <div className="quick-grid">{quick.map((q,i)=><button className={i===11?"danger":""} key={q[1]}><span>{q[0]}</span><div><b>{q[1]}</b><small>{q[2]}</small></div></button>)}</div>
        </section>

        <section className="bottom-grid">
          <div className="panel jobs">
            <div className="panel-title"><h2>Running Jobs</h2><a>View All →</a></div>
            <table><thead><tr><th>#</th><th>Action</th><th>Target</th><th>Progress</th><th>Status</th><th>Started</th><th>Duration</th></tr></thead>
            <tbody>{jobs.slice(0,4).map((j,i)=><tr key={j.id}><td>#{j.id}</td><td>{j.type}</td><td>{j.target}</td><td><div className="bar"><span style={{width:j.progress+"%"}}/></div>{j.progress}%</td><td><span className={"status "+j.status}>{j.status}</span></td><td>{["15:21","14:42","13:15","12:30"][i]}</td><td>{["00:12:34","00:03:18","00:01:22","00:00:54"][i]}</td></tr>)}</tbody></table>
          </div>

          <div className="panel backups">
            <div className="panel-title"><h2>Backup Status</h2><a>View All →</a></div>
            <table><thead><tr><th>Device</th><th>Type</th><th>Last Backup</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{backups.slice(0,5).map((b,i)=><tr key={b.device}><td>{b.device}</td><td>{["FortiGate","Cisco","MikroTik","FortiGate","VMware"][i]}</td><td>{b.last_backup.replace("2026-10-08 ","")}</td><td><span className={"status "+b.status}>{b.status}</span></td><td>⇩ &nbsp;⋯</td></tr>)}</tbody></table>
          </div>
        </section>
      </main>
    </div>
  </div>
}
