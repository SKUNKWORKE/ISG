import type { MetadataRoute } from "next";
import { stoneSitemapCount } from "@/lib/stones";

const BASE = "https://www.imperialstargems.com";

/**
 * What crawlers may fetch.
 *
 * Every page a crawler should index stays open. What is closed is the part of
 * the site that is rendered on the server per request and has, for practical
 * purposes, no end to it:
 *
 *  - Query-string variants of the catalogues, jewelry, the ring builder and the
 *    contact form. Each filter, sort and builder step is a new URL; the ring
 *    builder alone pages through every stone in stock and links each one to a
 *    further page. The bare pages remain crawlable, and every stone and jewel
 *    has its own page and sitemap entry, so nothing indexable is lost.
 *  - The PDF spec sheets, which are generated on request and marked noindex.
 *  - The API.
 *
 * `?` matches literally in robots.txt and rules match by prefix, so
 * "/jewelry?" closes /jewelry?type=ring but leaves /jewelry and /jewelry/<sku>
 * open. `*` is understood by every major crawler.
 */
const CLOSED = [
  "/api/",
  "/spec-sheet/",
  "/stones/*/spec-sheet",
  "/jewelry/*/spec-sheet",
  "/natural-diamonds?",
  "/lab-grown-diamonds?",
  "/jewelry?",
  "/build-a-ring?",
  "/contact?",
];

/**
 * SEO-tool crawlers that read the whole site on their own schedule. They are
 * welcome, but slowed down: each fetch of a stone page they request costs a
 * server render. Google ignores Crawl-delay and is not listed.
 */
const THROTTLED = [
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "DataForSeoBot",
  "PetalBot",
  "SeznamBot",
  "barkrowler",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: CLOSED },
      { userAgent: THROTTLED, allow: "/", disallow: CLOSED, crawlDelay: 10 },
    ],
    sitemap: [
      `${BASE}/sitemap.xml`,
      ...Array.from({ length: stoneSitemapCount() }, (_, id) => `${BASE}/stones/sitemap/${id}.xml`),
    ],
  };
}
