import { requireUser } from "@/lib/auth/requireUser";
import { runAudit } from "@/lib/audits/runAudit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    audit_id?: string;
    brand_name?: string;
    category?: string | null;
    primary_domain?: string | null;
  };

  const brandName = (body.brand_name ?? "").trim();
  if (!brandName) {
    return Response.json({ error: "brand_name is required" }, { status: 400 });
  }

  try {
    const result = await runAudit({
      userId,
      auditId: body.audit_id ?? null,
      brandName,
      category: body.category ?? null,
      primaryDomain: body.primary_domain ?? null
    });
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to run audit";
    return Response.json({ error: message }, { status: 500 });
  }
}
