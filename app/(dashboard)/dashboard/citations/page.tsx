import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardCitationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Citation Source Breakdown</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          UI-only: hook up citations reporting later.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Total Citations", value: "—", desc: "Across the current audit." },
          { title: "Brand-Owned", value: "—", desc: "Citations that look like your domain." },
          { title: "Authority Score", value: "—", desc: "Average by source type." },
          { title: "Missing Citations", value: "—", desc: "Prompt runs without sources." }
        ].map((metric) => (
          <Card key={metric.title} className={metric.title === "Missing Citations" ? "border-amber-500/40" : undefined}>
            <CardHeader>
              <CardTitle>{metric.title}</CardTitle>
            </CardHeader>
            <div className="mt-4 text-3xl font-semibold">{metric.value}</div>
            <CardDescription className="mt-2">{metric.desc}</CardDescription>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Citation Distribution by Type</CardTitle>
            <CardDescription className="text-xs">UI-only placeholder.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-3">
            {["brand_owned", "wikipedia", "government", "publisher", "unknown"].map((t) => (
              <div key={t} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge>{t}</Badge>
                    <span className="text-slate-600 dark:text-slate-400">— citations</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">—</span>
                </div>
                <Progress value={0} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Source Type Analysis</CardTitle>
            <CardDescription className="text-xs">UI-only placeholder.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-3">
            {["brand_owned", "wikipedia", "government", "publisher", "unknown"].map((t) => (
              <div
                key={t}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <Badge>{t}</Badge>
                  <div className="text-sm text-slate-600 dark:text-slate-400">—</div>
                </div>
                <div className="text-sm font-medium">—</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Citations</CardTitle>
          <CardDescription className="text-xs">TODO: render citation rows.</CardDescription>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-600 dark:text-slate-400">
              <tr className="border-b border-slate-200 dark:border-slate-900">
                <th className="py-2 pr-4">Source URL</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Domain</th>
                <th className="py-2">Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-900">
              <tr>
                <td className="py-4 text-slate-600 dark:text-slate-400" colSpan={4}>
                  No citations loaded.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

