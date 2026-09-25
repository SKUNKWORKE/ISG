import { NextResponse } from "next/server";
import { canSaveBuilds, saveBuild } from "@/lib/ring-build-store";
import { parseSavedBuild, savedBuildHref } from "@/lib/saved-builds";

export const runtime = "nodejs";

/**
 * Saves a ring configuration and hands back the short code that reopens it.
 *
 * No contact details and no account: the code is the credential. That keeps the
 * endpoint uninteresting to abuse — the worst a flood achieves is rows of
 * orphaned choices — but it is still rate limited, and the payload is validated
 * down to known SKUs and vocabulary before anything is written.
 */

const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  if (!canSaveBuilds()) {
    // The builder keeps every choice in its own URL, so the client has a link
    // to fall back on. Say so plainly rather than pretending this worked.
    return NextResponse.json(
      { error: "Saved links are not available here. Copy the page link instead." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many saves just now. Try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const build = parseSavedBuild(body);
  if (!build) {
    return NextResponse.json({ error: "That ring is missing its stone." }, { status: 400 });
  }

  try {
    const code = await saveBuild(build);
    return NextResponse.json({ code, href: savedBuildHref(code) });
  } catch (err) {
    console.error("[ring-build] save failed", err);
    return NextResponse.json(
      { error: "We could not save that just now. Copy the page link instead." },
      { status: 500 },
    );
  }
}
