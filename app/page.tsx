import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="badge">Vercel-friendly · App Router · TypeScript</div>
      <h1 style={{ marginTop: 16, marginBottom: 8 }}>SaaS Dashboard Starter</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        A clean Next.js foundation with a dashboard route and API routes.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <Link className="card" href="/dashboard" style={{ maxWidth: 420 }}>
          <strong>Go to Dashboard</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Example authenticated area (auth not wired yet).
          </div>
        </Link>

        <a
          className="card"
          href="/api/health"
          style={{ maxWidth: 420 }}
          rel="noreferrer"
        >
          <strong>Health Check</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Returns JSON from an App Router route handler.
          </div>
        </a>
      </div>
    </>
  );
}

