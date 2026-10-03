import { NextResponse, type NextRequest } from "next/server";
import { encodeGeoCookie, GEO_COOKIE, GEO_COOKIE_OPTIONS, decodeGeoCookie } from "@/lib/geo/cookie";
import { resolveVisitorCountry } from "@/lib/geo/resolve";
import { getSeasonalTheme } from "@/lib/geo/season";

/**
 * Seeds the visitor's country before the page renders.
 *
 * This runs ahead of a visitor's first document request and writes the resolved
 * country to a cookie, which the pre-paint script in the layout reads to pick a theme
 * before the first frame. That is what keeps the theming flash-free without
 * making any page dynamic: the HTML stays static and cacheable, and only the
 * cookie varies per visitor.
 *
 * Two rules keep it cheap enough to sit in front of everything:
 *
 *  - No network. `allowNetwork: false` restricts this to a header read and, if
 *    a database is configured, an in-process lookup. The slow fallback belongs
 *    in /api/geo, which the client calls in the background.
 *  - No work when the answer is already known and current.
 *
 * Proxy runs on the Node.js runtime by default as of Next.js 16, which is what
 * makes the local MaxMind lookup possible here at all — it was not under the
 * edge-only middleware this replaces.
 */
export async function proxy(request: NextRequest) {
  const cached = decodeGeoCookie(request.cookies.get(GEO_COOKIE)?.value);

  // The matcher already skips requests carrying the cookie; this guards hosts
  // that don't apply matcher conditions. Re-writing a current cookie on every
  // request would also keep sliding its expiry, which is not the intent.
  if (cached) return NextResponse.next();

  const country = await resolveVisitorCountry(request, { allowNetwork: false });
  const response = NextResponse.next();

  // Write the cookie even when nothing resolved. An empty result is still an
  // answer, and caching it stops every subsequent page view from retrying a
  // lookup that has already been established to fail for this visitor.
  response.cookies.set(GEO_COOKIE, encodeGeoCookie(country), GEO_COOKIE_OPTIONS);

  // A response that varies by visitor must not be served from a shared cache to
  // the next one. Private allows the browser's own cache to keep it.
  if (country.countryCode) {
    response.headers.set("cache-control", "private, no-store");
    response.headers.set("x-geo-country", country.countryCode);
    response.headers.set("x-geo-theme", getSeasonalTheme(country.hemisphere));
  }

  return response;
}

export const config = {
  /**
   * First-visit document requests only. On Vercel the matcher is evaluated by
   * the router before anything runs, so a request it excludes costs no
   * function invocation at all — and this proxy used to be invoked for every
   * page view and every link prefetch on the site, which was most of the
   * project's function usage.
   *
   * The path pattern skips build output, the API (which does its own
   * resolution), and anything that looks like a static file. Then, of what is
   * left, the proxy is skipped when:
   *
   *  - the geo cookie is already set. The work is done, and the function's own
   *    early return for this case was paying for an invocation to do nothing.
   *    A stale cookie is refreshed by /api/geo, which the client calls when it
   *    reads one (see use-visitor-country.ts).
   *  - the request is a client-side navigation or a prefetch (`rsc`,
   *    `next-router-prefetch`, `purpose: prefetch`). Those only happen after
   *    a document load, which already set the cookie.
   *  - the visitor is a crawler. Crawlers don't keep cookies, so without this
   *    every page a bot fetched paid for a lookup whose only result is a theme
   *    nobody sees.
   *
   * Matcher values must be literals (they are read at build time), so the
   * cookie name is written out here; it is GEO_COOKIE in lib/geo/constants.ts.
   */
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|_next/data|_vercel|sequence/|flags/|_img/|.*\\.[\\w]+$).*)",
      missing: [
        { type: "cookie", key: "isg_geo" },
        { type: "header", key: "rsc" },
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
        {
          type: "header",
          key: "user-agent",
          value:
            ".*(?:[Bb]ot\\b|[Cc]rawl|[Ss]pider|[Ss]lurp|facebookexternalhit|[Hh]eadless|Lighthouse|PageSpeed|curl/|[Ww]get/|python-|[Gg]o-http-client).*",
        },
      ],
    },
  ],
};
