import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardRecommendationsPage() {
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

