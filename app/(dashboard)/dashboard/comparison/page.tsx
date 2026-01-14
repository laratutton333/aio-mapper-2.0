import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardComparisonPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Comparison</h1>
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

