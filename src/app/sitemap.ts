import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/guides";
import { insightDate, listInsights } from "@/lib/insights";
import { SHAPES } from "@/lib/shapes";
import { ALL_STONES } from "@/lib/stones";
import { ALL_JEWELRY } from "@/lib/real-jewelry";

const BASE = "https://www.imperialstargems.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Articles report their real dates, so search engines can tell new notes from old ones.
  const insights = listInsights({ includeDrafts: false });
  const latest = insights[0];

  const routes: { path: string; priority: number; lastModified?: Date }[] = [
    { path: "/", priority: 1 },
    { path: "/natural-diamonds", priority: 0.9 },
    { path: "/lab-grown-diamonds", priority: 0.9 },
    { path: "/shapes", priority: 0.8 },
    ...SHAPES.map((s) => ({ path: `/shapes/${s.slug}`, priority: 0.7 })),
    ...ALL_STONES.map((s) => ({ path: `/stones/${s.sku}`, priority: 0.5 })),
    { path: "/jewelry", priority: 0.9 },
    ...ALL_JEWELRY.map((j) => ({ path: `/jewelry/${j.sku}`, priority: 0.5 })),
    { path: "/build-a-ring", priority: 0.8 },
    { path: "/ring-size-guide", priority: 0.8 },
    { path: "/diamond-4cs-calculator", priority: 0.8 },
    { path: "/carat-guide", priority: 0.8 },
    { path: "/color-guide", priority: 0.8 },
    { path: "/cut-guide", priority: 0.8 },
    { path: "/clarity-guide", priority: 0.8 },
    { path: "/glossary", priority: 0.8 },
    { path: "/guides", priority: 0.8 },
    ...GUIDES.map((g) => ({ path: `/guides/${g.slug}`, priority: 0.7 })),
    { path: "/craftsmanship", priority: 0.7 },
    {
      path: "/insights",
      priority: 0.8,
      lastModified: latest ? insightDate(latest.updated ?? latest.published) : undefined,
    },
    ...insights.map((p) => ({
      path: `/insights/${p.slug}`,
      priority: 0.7,
      lastModified: insightDate(p.updated ?? p.published),
    })),
    { path: "/contact", priority: 0.6 },
  ];

  return routes.map(({ path, priority, lastModified }) => ({
    url: `${BASE}${path}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}
