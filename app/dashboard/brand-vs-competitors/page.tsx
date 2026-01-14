import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function BrandVsCompetitorsPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Brand vs Competitors</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Competitive benchmarking will land next once competitor inputs are modeled.
        </p>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Phase 2 will add competitor lists, side-by-side prompt breakdowns, and share-of-voice
              metrics.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}

