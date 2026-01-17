import "server-only";

import type { UserCompetitorConfig } from "@/types/user-config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

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

export async function getSavedCompetitorsForUser(userId: string): Promise<UserCompetitorConfig[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error) return [];

  const aioConfig = (data.user?.user_metadata as { aio_config?: unknown } | null)?.aio_config as
    | { competitors?: unknown }
    | null
    | undefined;

  return normalizeCompetitors(aioConfig?.competitors);
}

