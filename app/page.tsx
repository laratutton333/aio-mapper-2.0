import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-200">
          Vercel-native · App Router · Route Handlers
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">AIO Mapper</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Measure whether a brand appears, is recommended, and is cited in AI answers — with
          deterministic prompts, logged outputs, and structured evidence.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <Link
            className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:bg-slate-900"
            href="/dashboard"
          >
            <div className="text-sm font-semibold">AI Visibility Overview</div>
            <div className="mt-1 text-sm text-slate-300">
              Summary metrics, trends, and recent prompt runs.
            </div>
          </Link>

          <Link
            className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:bg-slate-900"
            href="/dashboard/prompt-explorer"
          >
            <div className="text-sm font-semibold">Prompt Explorer</div>
            <div className="mt-1 text-sm text-slate-300">
              Explore answers, mentions, and citations per prompt.
            </div>
          </Link>

          <Link
            className="rounded-xl border border-slate-800 bg-slate-950 p-4 hover:bg-slate-900"
            href="/dashboard/citations"
          >
            <div className="text-sm font-semibold">Citations</div>
            <div className="mt-1 text-sm text-slate-300">
              Source breakdown, authority signals, and missing-citation opportunities.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
