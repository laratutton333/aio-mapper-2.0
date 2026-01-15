import { requireUser } from "@/lib/auth/requireUser";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserBrandConfig, UserCompetitorConfig } from "@/types/user-config";

export const runtime = "nodejs";

function normalizeString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeCompetitors(value: unknown): UserCompetitorConfig[] {
  if (!Array.isArray(value)) return [];
  const rows: UserCompetitorConfig[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const name = normalizeString((item as { name?: unknown }).name);
    if (!name) continue;
    const domain = normalizeString((item as { domain?: unknown }).domain);
    rows.push({ name, domain });
    if (rows.length >= 25) break;
  }

  return rows;
}

function normalizeConfig(value: unknown): UserBrandConfig {
  if (!value || typeof value !== "object") {
    return { brand_name: null, primary_domain: null, competitors: [] };
  }
  const obj = value as { brand_name?: unknown; primary_domain?: unknown; competitors?: unknown };
  return {
    brand_name: normalizeString(obj.brand_name),
    primary_domain: normalizeString(obj.primary_domain),
    competitors: normalizeCompetitors(obj.competitors)
  };
}

export async function GET() {
  try {
    const user = await requireUser();
    const config = normalizeConfig((user.user_metadata as { aio_config?: unknown } | null)?.aio_config);
    return Response.json({ config });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { config?: unknown };
  const config = normalizeConfig(body.config);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ data: { aio_config: config } });
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    return Response.json({ error: "Unable to update configuration" }, { status: 500 });
  }

  return Response.json({ config: normalizeConfig((user.user_metadata as { aio_config?: unknown } | null)?.aio_config) });
}

