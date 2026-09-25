/**
 * Recovering the visitor's real IP from behind proxies and CDNs.
 *
 * The socket address is the last proxy, not the visitor, so the address has to
 * come from a forwarding header. Those headers are attacker-controlled unless
 * something trusted overwrote them, which is why the order below matters: the
 * single-value CDN headers are checked first because a CDN sets them itself and
 * ignores whatever the client sent, whereas `X-Forwarded-For` is a list that a
 * client can prepend entries to.
 *
 * For a cosmetic flag a spoofed IP costs nothing, so this deliberately does not
 * try to be a security boundary. It is documented rather than hardened.
 */

/**
 * Single-value headers written by a CDN or load balancer.
 *
 * Each of these is set by the edge itself rather than passed through, so where
 * one is present it is the most reliable address available.
 */
const TRUSTED_SINGLE_IP_HEADERS = [
  "cf-connecting-ip", // Cloudflare
  "true-client-ip", // Cloudflare Enterprise, Akamai
  "x-vercel-forwarded-for", // Vercel, set from its own edge
  "fastly-client-ip", // Fastly
  "x-azure-clientip", // Azure Front Door
  "x-real-ip", // nginx convention
] as const;

/** Trailing port on an IPv4 address, or the brackets IPv6 is wrapped in. */
function stripPort(value: string): string {
  const trimmed = value.trim();
  const bracketed = /^\[(.+)\](?::\d+)?$/.exec(trimmed);
  if (bracketed) return bracketed[1];
  // Only strip a port from IPv4; a bare IPv6 address is full of colons itself.
  const withPort = /^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/.exec(trimmed);
  return withPort ? withPort[1] : trimmed;
}

const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;

function isPublicIp(ip: string): boolean {
  if (!ip) return false;
  const value = ip.toLowerCase();

  if (value === "::1" || value === "localhost") return false;
  // IPv4-mapped IPv6 ("::ffff:203.0.113.5") carries a v4 address to test instead.
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(value);
  const candidate = mapped ? mapped[1] : value;

  if (IPV4.test(candidate)) {
    const parts = candidate.split(".").map(Number);
    if (parts.some((n) => Number.isNaN(n) || n > 255)) return false;
    const [a, b] = parts;
    if (a === 10 || a === 127 || a === 0) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 169 && b === 254) return false; // link-local
    if (a === 100 && b >= 64 && b <= 127) return false; // carrier-grade NAT
    return true;
  }

  // IPv6 private and link-local ranges.
  if (value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80")) return false;
  return value.includes(":");
}

/** Minimal shape so this works with Request, NextRequest, or a plain header map. */
export type HeaderSource = { get(name: string): string | null };

/**
 * The visitor's public IP, or null when only private addresses are visible.
 *
 * Returning null matters: in local development every candidate is a loopback
 * address, and a lookup on one of those would either fail or, worse, silently
 * resolve to the host's own country and look like it worked.
 */
export function extractClientIp(headers: HeaderSource): string | null {
  for (const name of TRUSTED_SINGLE_IP_HEADERS) {
    const value = headers.get(name);
    if (!value) continue;
    const ip = stripPort(value.split(",")[0]);
    if (isPublicIp(ip)) return ip;
  }

  // X-Forwarded-For is "client, proxy1, proxy2". The client is leftmost, but a
  // client can forge entries there, so take the first *public* address rather
  // than the first address.
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    for (const part of forwarded.split(",")) {
      const ip = stripPort(part);
      if (isPublicIp(ip)) return ip;
    }
  }

  // RFC 7239: Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43
  const rfc7239 = headers.get("forwarded");
  if (rfc7239) {
    for (const match of rfc7239.matchAll(/for=("?\[?[^;,"\]]+\]?"?)/gi)) {
      const ip = stripPort(match[1].replace(/"/g, ""));
      if (isPublicIp(ip)) return ip;
    }
  }

  return null;
}
