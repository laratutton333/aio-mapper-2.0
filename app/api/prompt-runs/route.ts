import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const auditId = url.searchParams.get("audit_id");

  const dashboard = await getDashboardData({ auditId });
  return Response.json({
    audit: dashboard.audit,
    prompts: dashboard.prompts
  });
}

