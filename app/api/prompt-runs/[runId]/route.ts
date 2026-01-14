import { getPromptRunDetail } from "@/lib/promptRuns/getPromptRunDetail";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  const detail = await getPromptRunDetail(runId);
  if (!detail) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(detail);
}

