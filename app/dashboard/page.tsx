export default function DashboardPage() {
  return (
    <>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <p className="muted">
        Start building your SaaS here: navigation, billing, settings, and your
        app’s core views.
      </p>

      <section className="grid" style={{ marginTop: 18 }}>
        <div className="card">
          <strong>Overview</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            KPIs, charts, and recent activity.
          </div>
        </div>
        <div className="card">
          <strong>Settings</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Profile, team, and workspace configuration.
          </div>
        </div>
        <div className="card">
          <strong>Billing</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Plans, invoices, and payment methods.
          </div>
        </div>
      </section>
    </>
  );
}

