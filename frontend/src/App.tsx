import { useEffect, useState } from "react";

type Summary = {
  sites: number;
  devices: number;
  healthy: number;
  warnings: number;
};

export default function App() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/summary")
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  return (
    <main className="page">
      <header>
        <p>NETWORK CONTROL CENTER</p>
        <h1>NetOps One</h1>
        <span>Simulated Lab</span>
      </header>

      <section className="grid">
        <article><small>Sites</small><strong>{summary?.sites ?? 0}</strong></article>
        <article><small>Devices</small><strong>{summary?.devices ?? 0}</strong></article>
        <article><small>Healthy</small><strong>{summary?.healthy ?? 0}</strong></article>
        <article><small>Warnings</small><strong>{summary?.warnings ?? 0}</strong></article>
      </section>

      <section className="panel">
        <h2>V0.1 Dashboard</h2>
        <p>React frontend connected to a FastAPI backend with simulated Cisco, MikroTik and Fortinet devices.</p>
      </section>
    </main>
  );
}
