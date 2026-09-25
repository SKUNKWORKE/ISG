import { NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  sku?: string;
  company?: string;
};

/**
 * Naive per-instance rate limit. Enough to blunt a script; it does not survive a
 * restart and is not shared between serverless instances. Put a real limiter
 * (Upstash, Vercel KV, the platform WAF) in front of this before launch.
 */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // The honeypot is invisible to people. Anything that fills it is a bot; answer
  // as though it succeeded so it has nothing to learn.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Try again shortly." },
      { status: 429 },
    );
  }

  const enquiry = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    phone: clean(body.phone, 60),
    message: clean(body.message, 4000),
    sku: clean(body.sku, 40),
    receivedAt: new Date().toISOString(),
  };

  if (!enquiry.name) {
    return NextResponse.json({ error: "Please include your name." }, { status: 400 });
  }
  if (!enquiry.email && !enquiry.phone) {
    return NextResponse.json(
      { error: "Please leave either an email address or a phone number." },
      { status: 400 },
    );
  }
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(enquiry.email)) {
    return NextResponse.json({ error: "That email address looks incomplete." }, { status: 400 });
  }

  // The database is the record of truth: store first, then notify. An enquiry
  // that is safely stored is never reported as a failure to the sender.
  let stored = false;
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      await db.collection("inquiries").insertOne({ ...enquiry, createdAt: new Date() });
      stored = true;
    } catch (err) {
      console.error("[enquiry] database write failed", err);
      return NextResponse.json(
        { error: "We could not save that just now. Please use WhatsApp or email instead." },
        { status: 500 },
      );
    }
  } else {
    console.warn("[enquiry] imperialstargem_MONGODB_URI is not set — enquiry will not be stored.");
  }

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[enquiry] delivery failed", err);
      if (!stored) {
        return NextResponse.json(
          { error: "We could not send that just now. Please use WhatsApp or email instead." },
          { status: 502 },
        );
      }
    }
  } else if (!stored) {
    // Nothing configured at all: record it so a local run is still testable, and
    // make the gap obvious in the logs rather than silently dropping enquiries.
    console.warn("[enquiry] no destination configured — enquiry accepted but not kept:", enquiry);
  }

  return NextResponse.json({ ok: true });
}
