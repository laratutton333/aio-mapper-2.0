import type { DashboardResponse } from "@/types/dashboard";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getRecommendationsFromDashboard } from "@/lib/recommendations/getRecommendations";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const dashboard: DashboardResponse = await getDashboardData();
  const recommendations = getRecommendationsFromDashboard(dashboard);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Recommendations</h1>
      <p className="mt-2 text-sm text-slate-600">
        Structured suggestions derived from the dashboard contract.
      </p>

      <div className="mt-6 space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.title}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="text-sm font-semibold">{rec.title}</div>
            <div className="mt-1 text-sm text-slate-600">{rec.rationale}</div>
          </div>
        ))}
      </div>
    </>
  );
}
