import { pdfResponse, renderStoneSheet } from "@/lib/spec-sheet";
import { findStone } from "@/lib/stones";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ sku: string }> }) {
  const stone = findStone((await params).sku);
  if (!stone) return new Response("Not found", { status: 404 });

  const preparedAt = new Date();
  return pdfResponse(renderStoneSheet(stone, preparedAt), `imperial-star-gems-${stone.sku}`, preparedAt);
}
