import "server-only";

import { normaliseCountryCode } from "../countries";
import type { CountryCode } from "../types";

/**
 * Free IP geolocation services, used only when no local database is configured.
 *
 * Both are keyless and free for this volume, and both are rate-limited, which
 * is exactly why they sit last in the chain rather than first. Two are listed
 * so that one being throttled or down is survivable; if both fail the caller
 * falls back to browser signals.
 *
 * Every call is bounded by a timeout. A geolocation lookup for a decorative
 * badge must never be the reason a page is slow, so the budget is small and
 * exceeding it is treated as a miss rather than an error.
 */

const TIMEOUT_MS = 1200;

type Service = {
  name: string;
  url: (ip: string) => string;
  parse: (body: unknown) => string | null | undefined;
};

const SERVICES: Service[] = [
  {
    // HTTPS on the free tier and no key required, so it goes first.
    name: "ipwho.is",
    url: (ip) => `https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code`,
    parse: (body) => {
      const data = body as { success?: boolean; country_code?: string };
      return data?.success === false ? null : data?.country_code;
    },
  },
  {
    // Free tier is HTTP-only; kept as a second chance rather than a first choice.
    name: "ip-api.com",
    url: (ip) => `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode`,
    parse: (body) => {
      const data = body as { status?: string; countryCode?: string };
      return data?.status === "fail" ? null : data?.countryCode;
    },
  },
];

async function askService(service: Service, ip: string): Promise<CountryCode | null> {
  try {
    const response = await fetch(service.url(ip), {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // The answer is per-IP and short-lived; Next's fetch cache must not
      // remember one visitor's country and serve it to the next.
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!response.ok) return null;
    return normaliseCountryCode(service.parse(await response.json()));
  } catch {
    // Timeout, DNS failure, rate limit, malformed JSON: all the same outcome
    // here, which is that this service didn't answer and the next one might.
    return null;
  }
}

export async function countryFromIpService(ip: string | null): Promise<CountryCode | null> {
  if (!ip) return null;

  for (const service of SERVICES) {
    const code = await askService(service, ip);
    if (code) return code;
  }
  return null;
}
