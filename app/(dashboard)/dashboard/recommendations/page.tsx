import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationsBoard } from "@/components/dashboard/recommendations-board";
import { getDemoRecommendationsData } from "@/lib/demo/demo-recommendations";

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

  if (isDemo) {
    return <RecommendationsBoard data={getDemoRecommendationsData()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Recommendations</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          UI-only: recommendations will be derived from real audit results.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>TODO</CardTitle>
            <CardDescription>Render recommendations once data wiring exists.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
