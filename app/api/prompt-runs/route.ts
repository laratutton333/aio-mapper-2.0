import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { requireUser } from "@/lib/auth/requireUser";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const auditId = url.searchParams.get("audit_id");

  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = await getDashboardData({ auditId, userId });
  return Response.json({
    audit: dashboard.audit,
    prompts: dashboard.prompts
  });
}
