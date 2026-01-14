import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCitationsReport } from "@/lib/citations/getCitationsReport";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export const dynamic = "force-dynamic";

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default async function CitationsPage() {
  const dashboard = await getDashboardData();
  const report = await getCitationsReport({
    auditId: dashboard.audit.auditId,
    brandName: dashboard.audit.brandName
  });

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Citation Source Breakdown</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Understand which sources AI models rely on when answering questions.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Citations</CardTitle>
          </CardHeader>
          <div className="mt-4 text-3xl font-semibold">{report.totalCitations}</div>
          <CardDescription className="mt-2">Across the current audit.</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand-Owned</CardTitle>
          </CardHeader>
          <div className="mt-4 text-3xl font-semibold">{percent(report.brandOwnedRate)}</div>
          <CardDescription className="mt-2">Citations that look like your domain.</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authority Score</CardTitle>
          </CardHeader>
          <div className="mt-4 text-3xl font-semibold">
            {percent(report.averageAuthorityScore)}
          </div>
          <CardDescription className="mt-2">Average by source type.</CardDescription>
        </Card>

        <Card className="border-amber-500/40">
          <CardHeader>
            <CardTitle>Missing Citations</CardTitle>
          </CardHeader>
          <div className="mt-4 text-3xl font-semibold">{report.missingCitationsCount}</div>
          <CardDescription className="mt-2">Prompt runs without sources.</CardDescription>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Citation Distribution by Type</CardTitle>
            <CardDescription className="text-xs">
              Heuristic classification until manual mapping is added.
            </CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-3">
            {report.byType.map((row) => (
              <div key={row.sourceType} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge>{row.sourceType}</Badge>
                    <span className="text-slate-600 dark:text-slate-400">{row.count} citations</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{percent(row.percent)}</span>
                </div>
                <Progress value={row.percent * 100} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Source Type Analysis</CardTitle>
            <CardDescription className="text-xs">Quick summary of where authority comes from.</CardDescription>
          </CardHeader>
          <div className="mt-4 space-y-3">
            {report.byType.map((row) => (
              <div
                key={row.sourceType}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <Badge>{row.sourceType}</Badge>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{row.count}</div>
                </div>
                <div className="text-sm font-medium">{percent(row.percent)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Citations</CardTitle>
          <CardDescription className="text-xs">Newest first.</CardDescription>
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
              {report.all.slice(0, 200).map((row) => (
                <tr key={row.url}>
                  <td className="py-3 pr-4">
                    <a
                      className="text-blue-600 hover:underline dark:text-blue-400"
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.url}
                    </a>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge>{row.sourceType}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">
                    {row.domain ?? "—"}
                  </td>
                  <td className="py-3">
                    <Badge className="bg-blue-600 text-white dark:bg-blue-500">
                      {percent(row.authorityScore)}
                    </Badge>
                  </td>
                </tr>
              ))}
              {report.all.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-600 dark:text-slate-400" colSpan={4}>
                    No citations detected yet. Run an audit first.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      {report.missingCitationsCount > 0 ? (
        <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-sm text-amber-200">
          <div className="font-medium">Missing Citation Opportunities</div>
          <div className="mt-1 text-amber-100/80">
            {report.missingCitationsCount} prompt runs have no detected sources. This can indicate
            opportunities to improve content discoverability or authority signals.
          </div>
        </div>
      ) : null}
    </>
  );
}

