import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type AuditStatus = "running" | "completed" | "failed";

export async function getAuditStatus(args: { auditId: string; userId: string }) {
  const supabase = createSupabaseAdminClient();

  const { data: audit, error: auditError } = await supabase
    .from("ai_audits")
    .select("id,user_id,status,created_at")
    .eq("id", args.auditId)
    .maybeSingle();

  if (auditError) {
    if (auditError.message.includes("ai_audits") || auditError.message.includes("relation")) {
      return null;
    }
    throw new Error(auditError.message);
  }

  if (!audit) return null;
  if ((audit.user_id as string) !== args.userId) return null;

  const { count: runCount, error: runCountError } = await supabase
    .from("ai_prompt_runs")
    .select("id", { count: "exact", head: true })
    .eq("audit_id", args.auditId);

  if (runCountError) {
    if (!runCountError.message.includes("ai_prompt_runs") && !runCountError.message.includes("relation")) {
      throw new Error(runCountError.message);
    }
  }

  const status = (audit.status as AuditStatus) ?? "running";

  return {
    auditId: audit.id as string,
    status,
    createdAt: (audit.created_at as string | null) ?? null,
    runCount: runCount ?? 0
  };
}

