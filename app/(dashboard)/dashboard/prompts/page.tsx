import { BrandVsCompetitors } from "@/components/dashboard/brand-vs-competitors";
import { getDemoBrandVsCompetitorsData } from "@/lib/demo/demo-brand-vs-competitors";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/requireUser";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getBrandVsCompetitorsData } from "@/lib/competitors/getBrandVsCompetitorsData";

type SearchParams = Record<string, string | string[] | undefined>;

// TODO(nextjs): Revert searchParams typing to `{ searchParams: SearchParams }`
// once Next.js PageProps no longer requires Promise-wrapped searchParams.
// This is a temporary workaround for a Next.js 15.x typing regression.
export default async function DashboardPromptsPage({
  searchParams
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const isDemo = resolvedSearchParams.demo === "true";
  const auditIdParam =
    typeof resolvedSearchParams.audit_id === "string" ? resolvedSearchParams.audit_id : null;

  if (isDemo) {
    return <BrandVsCompetitors data={getDemoBrandVsCompetitorsData()} demoMode />;
  }

  const user = await requireUser();
  const dashboard = await getDashboardData({ auditId: auditIdParam, userId: user.id });

  if (!dashboard.audit.auditId || !dashboard.audit.brandName) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Brand vs Competitors</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Run an audit to compare your brand to competitors mentioned in AI answers.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>No audit data</CardTitle>
            <CardDescription>Run an audit from the Overview page to populate this view.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const data = await getBrandVsCompetitorsData({ auditId: dashboard.audit.auditId, userId: user.id });
  if (!data) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Brand vs Competitors</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Run an audit to compare your brand to competitors mentioned in AI answers.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>No audit data</CardTitle>
            <CardDescription>Run an audit from the Overview page to populate this view.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <BrandVsCompetitors data={data} />;
}
