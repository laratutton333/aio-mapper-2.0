import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-300">
        Pricing is a placeholder during UI porting. Wire billing to your existing backend when
        ready.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { name: "Starter", desc: "For individual audits and experiments." },
          { name: "Team", desc: "For repeatable tracking and collaboration." },
          { name: "Enterprise", desc: "For scale, governance, and custom reporting." }
        ].map((tier) => (
          <div key={tier.name} className="rounded-xl border border-slate-800 bg-slate-950 p-6">
            <div className="text-sm font-semibold">{tier.name}</div>
            <div className="mt-2 text-sm text-slate-300">{tier.desc}</div>
            <div className="mt-6 text-sm text-slate-400">TODO: connect billing</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/dashboard" className="text-sm text-blue-400 hover:underline">
          Go to dashboard →
        </Link>
      </div>
    </div>
  );
}

