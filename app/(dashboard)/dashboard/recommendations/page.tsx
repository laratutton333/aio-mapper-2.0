import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationsBoard } from "@/components/dashboard/recommendations-board";
import { getDemoRecommendationsData } from "@/lib/demo/demo-recommendations";
import { requireUser } from "@/lib/auth/requireUser";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getRecommendationsBoardData } from "@/lib/recommendations/getRecommendationsBoardData";

type SearchParams = Record<string, string | string[] | undefined>;

// TODO(nextjs): Revert searchParams typing to `{ searchParams: SearchParams }`
// once Next.js PageProps no longer requires Promise-wrapped searchParams.
// This is a temporary workaround for a Next.js 15.x typing regression.
export default async function DashboardRecommendationsPage({
  searchParams
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const isDemo = resolvedSearchParams.demo === "true";
  const auditIdParam =
    typeof resolvedSearchParams.audit_id === "string" ? resolvedSearchParams.audit_id : null;

  if (isDemo) {
    return <RecommendationsBoard data={getDemoRecommendationsData()} demoMode />;
  }

  const user = await requireUser();
  const dashboard = await getDashboardData({ auditId: auditIdParam, userId: user.id });

  if (!dashboard.audit.auditId || !dashboard.audit.brandName) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Recommendations</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Run an audit to generate actionable recommendations.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>No audit data</CardTitle>
              <CardDescription>Run an audit from the Overview page to populate this view.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const data = await getRecommendationsBoardData({
    auditId: dashboard.audit.auditId,
    brandName: dashboard.audit.brandName
  });

  return <RecommendationsBoard data={data} />;
}
