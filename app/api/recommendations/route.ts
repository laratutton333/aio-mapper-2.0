import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getRecommendationsFromDashboard } from "@/lib/recommendations/getRecommendations";

export const runtime = "nodejs";

export async function GET() {
  const dashboard = await getDashboardData();
  return Response.json(getRecommendationsFromDashboard(dashboard));
}

