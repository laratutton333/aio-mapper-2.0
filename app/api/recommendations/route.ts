import { requireUser } from "@/lib/auth/requireUser";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { getRecommendationsBoardData } from "@/lib/recommendations/getRecommendationsBoardData";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const auditIdParam = url.searchParams.get("audit_id");

  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dashboard = await getDashboardData({ auditId: auditIdParam, userId });
  if (!dashboard.audit.auditId || !dashboard.audit.brandName) {
    return Response.json({ brandName: null, total: 0, counts: { Pending: 0, "In Progress": 0, Completed: 0 }, items: [] });
  }

  const data = await getRecommendationsBoardData({
    auditId: dashboard.audit.auditId,
    brandName: dashboard.audit.brandName
  });

  return Response.json(data);
}

export async function PATCH(req: Request) {
  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { id?: string; status?: "pending" | "in_progress" | "completed" };
  if (!body.id || !body.status) {
    return Response.json({ error: "id and status are required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: rec, error: recError } = await supabase
    .from("ai_recommendations")
    .select("id,audit_id")
    .eq("id", body.id)
    .maybeSingle();

  if (recError) return Response.json({ error: recError.message }, { status: 500 });
  if (!rec) return Response.json({ error: "Not found" }, { status: 404 });

  const { data: audit, error: auditError } = await supabase
    .from("ai_audits")
    .select("id,user_id")
    .eq("id", rec.audit_id as string)
    .maybeSingle();

  if (auditError) return Response.json({ error: auditError.message }, { status: 500 });
  if (!audit || (audit.user_id as string) !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: updateError } = await supabase
    .from("ai_recommendations")
    .update({ status: body.status })
    .eq("id", body.id);

  if (updateError) return Response.json({ error: updateError.message }, { status: 500 });
  return Response.json({ success: true });
}
