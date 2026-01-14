import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getCitationsReport } from "@/lib/citations/getCitationsReport";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const auditId = url.searchParams.get("audit_id");

  const dashboard = await getDashboardData({ auditId });
  const report = await getCitationsReport({
    auditId: dashboard.audit.auditId,
    brandName: dashboard.audit.brandName
  });

  return Response.json({ audit: dashboard.audit, report });
}

