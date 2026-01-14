import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getDemoDashboardData } from "@/lib/demo/demo-dashboard";
import { requireUser } from "@/lib/auth/requireUser";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const auditId = url.searchParams.get("audit_id");
  const isDemo =
    url.searchParams.get("demo") === "true" || req.headers.get("x-demo-mode") === "true";

  if (isDemo) {
    return Response.json(getDemoDashboardData());
  }

  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getDashboardData({ auditId, userId });
  return Response.json(data);
}
