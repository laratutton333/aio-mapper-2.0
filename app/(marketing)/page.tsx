import Link from "next/link";

export default function MarketingHomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-200">
        Vercel-native · App Router · Supabase
      </div>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        Measure brand visibility in AI answers.
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-slate-300">
        AIO Mapper helps you track whether your brand appears, is recommended, and is cited in AI
        responses — using deterministic prompts, logged outputs, and evidence-ready views.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Open dashboard
        </Link>
        <Link href="/how-it-works" className="text-sm text-slate-300 hover:text-white">
          How it works →
        </Link>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <div className="text-sm font-semibold">Presence</div>
          <div className="mt-2 text-sm text-slate-300">
            Detect whether your brand is mentioned, and how strongly.
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <div className="text-sm font-semibold">Citations</div>
          <div className="mt-2 text-sm text-slate-300">
            Track source URLs and where authority is coming from.
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <div className="text-sm font-semibold">Recommendations</div>
          <div className="mt-2 text-sm text-slate-300">
            Turn results into action items (content, authority, distribution).
          </div>
        </div>
      </div>
    </div>
  );
}

