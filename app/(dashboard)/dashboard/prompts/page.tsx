import { BrandVsCompetitors } from "@/components/dashboard/brand-vs-competitors";
import { getDemoBrandVsCompetitorsData } from "@/lib/demo/demo-brand-vs-competitors";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  if (isDemo) {
    return <BrandVsCompetitors data={getDemoBrandVsCompetitorsData()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Brand vs Competitors</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Competitive benchmarking will be added once competitor inputs are modeled.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            TODO: competitor lists, side-by-side prompt breakdowns, and share-of-voice metrics.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
