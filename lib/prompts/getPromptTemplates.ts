import type { AiPromptTemplateRow } from "@/types/ai";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function getPromptTemplates(): Promise<AiPromptTemplateRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_prompt_templates")
    .select("id,name,intent,prompt_template,is_active,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    intent: row.intent as string,
    prompt_template: row.prompt_template as string,
    is_active: row.is_active as boolean,
    created_at: (row.created_at as string | null) ?? null
  }));
}

export async function getActivePromptTemplates(): Promise<AiPromptTemplateRow[]> {
  const all = await getPromptTemplates();
  return all.filter((template) => template.is_active);
}

