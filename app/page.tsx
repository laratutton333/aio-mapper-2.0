import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
        Vercel-native · App Router · Route Handlers
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        AIO Mapper
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Structured, server-only AI visibility checks with Supabase persistence
        and a dashboard contract the UI can render without parsing model text.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Link
          className="rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
          href="/dashboard"
        >
          <div className="text-sm font-semibold">Dashboard</div>
          <div className="mt-1 text-sm text-slate-600">
            Run checks and view summary metrics.
          </div>
        </Link>

        <Link
          className="rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
          href="/prompts"
        >
          <div className="text-sm font-semibold">Prompts</div>
          <div className="mt-1 text-sm text-slate-600">
            Manage active prompt templates.
          </div>
        </Link>

        <Link
          className="rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
          href="/recommendations"
        >
          <div className="text-sm font-semibold">Recommendations</div>
          <div className="mt-1 text-sm text-slate-600">
            Actionable next steps based on results.
          </div>
        </Link>
      </div>
    </>
  );
}
