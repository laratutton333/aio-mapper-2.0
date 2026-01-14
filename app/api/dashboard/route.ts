import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getDemoDashboardData } from "@/lib/demo/demo-dashboard";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const auditId = url.searchParams.get("audit_id");
  const isDemo =
    url.searchParams.get("demo") === "true" || req.headers.get("x-demo-mode") === "true";

  if (isDemo) {
    return Response.json(getDemoDashboardData());
  }

  const data = await getDashboardData({ auditId });
  return Response.json(data);
}
