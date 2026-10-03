import type { MetadataRoute } from "next";
import { ALL_STONES, STOCK_UPDATED, STONES_PER_SITEMAP, stoneSitemapCount } from "@/lib/stones";

const BASE = "https://www.imperialstargems.com";

/**
 * Every stone page, at /stones/sitemap/<id>.xml. They are kept out of the main
 * /sitemap.xml because there are more of them than one sitemap may hold;
 * robots.ts lists each file.
 */
export async function generateSitemaps() {
  return Array.from({ length: stoneSitemapCount() }, (_, id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const lastModified = STOCK_UPDATED;
  return ALL_STONES.slice(id * STONES_PER_SITEMAP, (id + 1) * STONES_PER_SITEMAP).map((s) => ({
    url: `${BASE}/stones/${s.sku}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
}
