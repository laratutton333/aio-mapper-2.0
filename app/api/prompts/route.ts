import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { AiPromptTemplateRow } from "@/types/ai";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_prompt_templates")
    .select("id,name,intent,prompt_template,is_active,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const rows: AiPromptTemplateRow[] = (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    intent: row.intent as string,
    prompt_template: row.prompt_template as string,
    is_active: row.is_active as boolean,
    created_at: (row.created_at as string | null) ?? null
  }));

  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    name: string;
    intent: string;
    prompt_template: string;
    is_active: boolean | null;
  };

  if (!body.name || !body.intent || !body.prompt_template) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ai_prompt_templates")
    .insert({
      name: body.name,
      intent: body.intent,
      prompt_template: body.prompt_template,
      is_active: body.is_active ?? true
    })
    .select("id,name,intent,prompt_template,is_active,created_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const row: AiPromptTemplateRow = {
    id: data.id as string,
    name: data.name as string,
    intent: data.intent as string,
    prompt_template: data.prompt_template as string,
    is_active: data.is_active as boolean,
    created_at: (data.created_at as string | null) ?? null
  };

  return Response.json(row, { status: 201 });
}

