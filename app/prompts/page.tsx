import type { AiPromptTemplateRow } from "@/types/ai";
import { getPromptTemplates } from "@/lib/prompts/getPromptTemplates";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const prompts: AiPromptTemplateRow[] = await getPromptTemplates();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Prompts</h1>
      <p className="mt-2 text-sm text-slate-600">
        Active prompt templates are used by `/api/ai/run-visibility`.
      </p>

      <div className="mt-6 space-y-3">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold">{prompt.name}</div>
              <div className="text-xs text-slate-600">
                {prompt.is_active ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-600">{prompt.intent}</div>
          </div>
        ))}
      </div>
    </>
  );
}
