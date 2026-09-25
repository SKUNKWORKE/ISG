import { TOPICS, insightDate, listInsights } from "@/lib/insights";
import { SITE_URL } from "@/lib/stone-specs";

// Built once per deploy; a new article means a new deploy anyway.
export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = listInsights({ includeDrafts: false }).slice(0, 30);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/insights/${post.slug}`;
      return [
        "<item>",
        `<title>${escape(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${insightDate(post.published).toUTCString()}</pubDate>`,
        `<category>${escape(TOPICS[post.topic])}</category>`,
        `<description>${escape(post.description)}</description>`,
        "</item>",
      ].join("");
    })
    .join("\n");

  const lastBuild = posts[0]
    ? `<lastBuildDate>${insightDate(posts[0].updated ?? posts[0].published).toUTCString()}</lastBuildDate>`
    : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Imperial Star Gems — Market insights</title>
<link>${SITE_URL}/insights</link>
<atom:link href="${SITE_URL}/insights/feed.xml" rel="self" type="application/rss+xml" />
<description>Trade desk commentary on natural and lab-grown diamond pricing.</description>
<language>en-gb</language>
${lastBuild}
${items}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
