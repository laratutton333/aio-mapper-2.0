import { requireUser } from "@/lib/auth/requireUser";
import { runAudit } from "@/lib/audits/runAudit";

export const runtime = "nodejs";

function normalizeString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function POST(req: Request) {
  let userId: string;
  let savedBrandName: string | null = null;
  let savedPrimaryDomain: string | null = null;
  try {
    const user = await requireUser();
    userId = user.id;
    const saved = (user.user_metadata as { aio_config?: unknown } | null)?.aio_config as
      | { brand_name?: unknown; primary_domain?: unknown }
      | null
      | undefined;
    savedBrandName = normalizeString(saved?.brand_name);
    savedPrimaryDomain = normalizeString(saved?.primary_domain);
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    audit_id?: string;
    brand_name?: string;
    category?: string | null;
    primary_domain?: string | null;
  };

  const brandName = normalizeString(body.brand_name) ?? savedBrandName ?? "";
  if (!brandName) {
    return Response.json({ error: "brand_name is required" }, { status: 400 });
  }

  try {
    const result = await runAudit({
      userId,
      auditId: body.audit_id ?? null,
      brandName,
      category: normalizeString(body.category) ?? null,
      primaryDomain: normalizeString(body.primary_domain) ?? savedPrimaryDomain ?? null
    });
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to run audit";
    return Response.json({ error: message }, { status: 500 });
  }
}
