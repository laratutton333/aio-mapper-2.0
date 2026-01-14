import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export const runtime = "nodejs";

export async function GET() {
  const data = await getDashboardData();
  return Response.json(data);
}

