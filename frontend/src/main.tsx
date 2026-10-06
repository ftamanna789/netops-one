import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  document.body.innerHTML = '<p style="color:white;padding:24px;font-family:system-ui">NetOps One error: root element not found.</p>';
} else {
  root.innerHTML = `
    <main class="page">
      <header class="topbar">
        <div>
          <p>NETWORK CONTROL CENTER</p>
          <h1>NetOps One</h1>
        </div>
        <span class="lab-badge">Frontend running</span>
      </header>
      <section class="panel">
        <h2>Diagnostic screen</h2>
        <p>If you can see this message, Vite and the browser are working correctly.</p>
        <p>Next step: reconnect the full React dashboard.</p>
      </section>
    </main>
  `;
}
