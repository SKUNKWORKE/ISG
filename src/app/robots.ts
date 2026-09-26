import type { MetadataRoute } from "next";
import { stoneSitemapCount } from "@/lib/stones";

const BASE = "https://www.imperialstargems.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: [
      `${BASE}/sitemap.xml`,
      ...Array.from({ length: stoneSitemapCount() }, (_, id) => `${BASE}/stones/sitemap/${id}.xml`),
    ],
  };
}
