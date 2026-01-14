import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getRecommendationsFromDashboard } from "@/lib/recommendations/getRecommendations";
import { requireUser } from "@/lib/auth/requireUser";

export const runtime = "nodejs";

export async function GET() {
  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = await getDashboardData({ userId });
  return Response.json(getRecommendationsFromDashboard(dashboard));
}
