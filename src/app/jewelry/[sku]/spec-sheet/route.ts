import { pdfResponse, renderJewelSheet } from "@/lib/spec-sheet";
import { findJewel } from "@/lib/real-jewelry";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ sku: string }> }) {
  const jewel = findJewel((await params).sku);
  if (!jewel) return new Response("Not found", { status: 404 });

  const preparedAt = new Date();
  return pdfResponse(renderJewelSheet(jewel, preparedAt), `imperial-star-gems-${jewel.sku}`, preparedAt);
}
