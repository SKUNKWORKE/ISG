import { NextResponse, type NextRequest } from "next/server";
import { encodeGeoCookie, GEO_COOKIE, GEO_COOKIE_OPTIONS, decodeGeoCookie } from "@/lib/geo/cookie";
import { resolveVisitorCountry } from "@/lib/geo/resolve";
import { getSeasonalTheme } from "@/lib/geo/season";

/**
 * Seeds the visitor's country before the page renders.
 *
 * This runs ahead of every document request and writes the resolved country to
 * a cookie, which the pre-paint script in the layout reads to pick a theme
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

  // A current cookie means the work is already done. Re-writing it on every
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
   * Document requests only.
   *
   * Without a matcher this would run on every asset fetch — CSS, JS chunks,
   * images, the flag SVGs themselves — which would add a geo lookup to
   * hundreds of requests per page load to no purpose. The negative lookahead
   * excludes build output, the API (which does its own resolution), and
   * anything that looks like a static file.
   */
  matcher: ["/((?!api|_next/static|_next/image|sequence/|flags/|.*\\.[\\w]+$).*)"],
};
