import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardResponse } from "@/types/dashboard";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export const dynamic = "force-dynamic";

export default async function DashboardRecommendationsPage() {
  const data: DashboardResponse = await getDashboardData();

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Recommendations</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Prescriptive guidance derived from structured results.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {data.recommendations.map((rec) => (
          <Card key={rec.title}>
            <CardHeader>
              <CardTitle>{rec.title}</CardTitle>
              <CardDescription>{rec.rationale}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}

