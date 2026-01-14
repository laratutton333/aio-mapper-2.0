export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">How it works</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-300">
        This page is UI-only during the port. Add your real workflow once data wiring is enabled.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
          <div className="text-sm font-semibold">1) Define prompts</div>
          <div className="mt-2 text-sm text-slate-300">
            Use a deterministic prompt library to keep runs comparable.
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
          <div className="text-sm font-semibold">2) Run audits</div>
          <div className="mt-2 text-sm text-slate-300">
            Execute prompts and log raw outputs for later inspection.
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
          <div className="text-sm font-semibold">3) Review evidence</div>
          <div className="mt-2 text-sm text-slate-300">
            Track presence, citations, and recommendations over time.
          </div>
        </div>
      </div>
    </div>
  );
}

