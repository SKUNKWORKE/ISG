import fs from "node:fs";
import path from "node:path";

/**
 * Market commentary, one Markdown file per article in content/insights/.
 * The file name is the URL slug. Files starting with "_" (the template) are
 * ignored. Front matter is plain `key: value` lines:
 *
 *   title        required
 *   description  required — the search snippet and the index-page summary
 *   topic        required — one of the keys of TOPICS
 *   published    required — YYYY-MM-DD
 *   updated      optional — YYYY-MM-DD, set when figures are revised
 *   author       optional — defaults to the house byline
 *   draft        optional — "true" keeps it out of the live site, sitemap and feed
 *
 * "TK" marks a figure still to be filled in. A post that isn't a draft fails
 * the build while any TK remains, so a placeholder can't reach Google.
 */

export const TOPICS = {
  natural: "Natural diamonds",
  "lab-grown": "Lab-grown diamonds",
  market: "Market",
} as const;

export type Topic = keyof typeof TOPICS;

export type Insight = {
  slug: string;
  title: string;
  description: string;
  topic: Topic;
  published: string;
  updated?: string;
  author: string;
  draft: boolean;
  body: string;
  readingMinutes: number;
};

const DIR = path.join(process.cwd(), "content", "insights");
const HOUSE_BYLINE = "Imperial Star Gems trade desk";
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const PLACEHOLDER = /\bTK\b/;

function parse(file: string): Insight {
  const fail = (message: string): never => {
    throw new Error(`content/insights/${file}: ${message}`);
  };

  const slug = file.replace(/\.md$/, "");
  if (!SLUG.test(slug)) fail("file name must be lowercase words joined by hyphens");

  const raw = fs.readFileSync(path.join(DIR, file), "utf8").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!match) return fail("missing the --- front matter block at the top");

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    const colon = line.indexOf(":");
    if (colon < 0) fail(`front matter line "${line}" has no colon`);
    meta[line.slice(0, colon).trim()] = line
      .slice(colon + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
  }

  if (!meta.title) fail("title is required");
  if (!meta.description) fail("description is required");
  if (!(Object.keys(TOPICS) as string[]).includes(meta.topic)) {
    fail(`topic must be one of: ${Object.keys(TOPICS).join(", ")}`);
  }
  if (!DATE.test(meta.published ?? "")) fail("published must be a YYYY-MM-DD date");
  if (meta.updated && !DATE.test(meta.updated)) fail("updated must be a YYYY-MM-DD date");

  const draft = meta.draft === "true";
  const body = match[2].trim();
  if (!draft && PLACEHOLDER.test(`${meta.title} ${meta.description} ${body}`)) {
    fail("still contains a TK placeholder — fill it in, or set draft: true");
  }

  return {
    slug,
    title: meta.title,
    description: meta.description,
    topic: meta.topic as Topic,
    published: meta.published,
    updated: meta.updated || undefined,
    author: meta.author || HOUSE_BYLINE,
    draft,
    body,
    readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
  };
}

let cache: Insight[] | undefined;

function loadAll(): Insight[] {
  // Re-read on every call in dev so an edited article shows on refresh.
  if (!cache || process.env.NODE_ENV === "development") {
    const files = fs.existsSync(DIR)
      ? fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      : [];
    cache = files
      .map(parse)
      .sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title));
  }
  return cache;
}

/** Newest first. Drafts appear under `next dev` for previewing, and nowhere else by default. */
export function listInsights({
  includeDrafts = process.env.NODE_ENV === "development",
}: { includeDrafts?: boolean } = {}): Insight[] {
  return loadAll().filter((post) => includeDrafts || !post.draft);
}

export function findInsight(slug: string): Insight | undefined {
  return listInsights().find((post) => post.slug === slug);
}

export function insightDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function formatInsightDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(insightDate(iso));
}
