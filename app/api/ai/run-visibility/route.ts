export const runtime = "nodejs";

export async function POST(req: Request) {
  void req;
  return Response.json(
    {
      success: false,
      error: "Deprecated endpoint. Use POST /api/audits/run instead."
    },
    { status: 410 }
  );
}
