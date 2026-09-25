# Visitor country detection and seasonal theming

Written for: developers maintaining or deploying this app.

A visitor's country is detected server-side, shown as a flag badge in the
bottom-right corner, and used to tint the site to the season they are actually
in. A visitor in Seoul in September sees autumn; a visitor in Sydney the same
afternoon sees spring.

Everything is free and open-source. Nothing here requires an account, a key, or
a paid tier — the optional MaxMind database is the only component with a
registration step, and the system runs correctly without it.

## How a request flows

```
request
  │
  ├─ proxy.ts ─────────── cheap sources only, no network
  │    1. CDN country header   (cf-ipcountry, x-vercel-ip-country, …)   high
  │    2. MaxMind GeoLite2     (local .mmdb, in-process)                high
  │    └─ writes the isg_geo cookie
  │
  ├─ inline script in <head> ── reads the cookie, stamps <html data-season>
  │    └─ before first paint, so there is no flash of the wrong theme
  │
  └─ client, after hydration ── useVisitorCountry()
       3. /api/geo              runs 1 and 2 again, plus:
          ipwho.is → ip-api.com (free, keyless, network)              medium
       4. navigator.languages   region subtag                          low
       5. Intl timezone         hemisphere, and country where mapped   low
       └─ nothing worked → neutral theme, no badge
```

Each step is allowed to fail silently. `resolveVisitorCountry` never throws and
never rejects; the worst case is an unknown visitor and a neutral theme.

## Why the theme is not server-rendered into the page

Reading `headers()` or `cookies()` in the root layout would make **every** page
dynamic. This site prerenders 2,600+ pages, and giving all of them up to tint a
background is a bad trade.

Instead the proxy writes a cookie and a small inline script applies the theme
before the first paint. The HTML stays static and CDN-cacheable, and only the
cookie varies per visitor. The result is the same — the correct palette is in
place before anything is drawn — without losing static generation.

Only the first request from a new visitor is uncacheable (`private, no-store`,
because it carries a `Set-Cookie`). Once the cookie exists the proxy does no
work and the page is served from cache as normal.

## Setting up MaxMind GeoLite2 (optional)

Without this, detection still works: CDN headers cover visitors behind
Cloudflare, Vercel, Netlify, Fastly or CloudFront, and everyone else falls
through to the free network services. Add the database if you want
high-confidence detection with no third-party dependency at all.

1. Create a free account at <https://www.maxmind.com/en/geolite2/signup> and
   accept the licence.
2. Generate a licence key and download **GeoLite2 Country** in `.mmdb` format.
3. Put the file somewhere the server can read it, and point the env var at it:

   ```bash
   GEOLITE2_COUNTRY_DB=/var/geoip/GeoLite2-Country.mmdb
   ```

4. Restart. `isMaxmindAvailable()` reports whether it opened.

The database is **not** committed to this repository. MaxMind's licence expects
each user to download it under their own key, so shipping a copy would be
redistributing it on your behalf.

MaxMind publish updates twice weekly. A stale database degrades slowly — country
allocations do not move often — but refresh it periodically with a cron job or
their `geoipupdate` tool.

### Deploying on a platform with no persistent filesystem

On Vercel and similar, either commit the `.mmdb` to a private deployment bundle
and point the env var at it, or leave it unset and rely on the platform's own
country header, which Vercel sets on every request at no cost.

## Files

| Path | What it does |
| --- | --- |
| `src/lib/geo/resolve.ts` | `resolveVisitorCountry(request)` — the server chain |
| `src/lib/geo/season.ts` | `getSeasonalTheme(hemisphere, date)` |
| `src/lib/geo/hemisphere.ts` | Country → northern / southern / equatorial |
| `src/lib/geo/client-ip.ts` | Real IP from `X-Forwarded-For`, `CF-Connecting-IP`, RFC 7239 |
| `src/lib/geo/sources/` | CDN headers, MaxMind, free IP services |
| `src/lib/geo/browser.ts` | Locale and timezone guesses |
| `src/lib/geo/cookie.ts` | `isg_geo` encode/decode, TTLs |
| `src/proxy.ts` | Runs the cheap chain, writes the cookie |
| `src/app/api/geo/route.ts` | Full chain including the network fallback |
| `src/hooks/use-visitor-country.ts` | Client hook, three-phase resolution |
| `src/components/geo-flag-badge.tsx` | The badge |
| `src/components/seasonal-theme.tsx` | Pre-paint script + post-hydration sync |
| `scripts/copy-flags.mjs` | Copies flag-icons SVGs into `public/flags` |

## Seasons

Meteorological, not astronomical — seasons start on the first of a month rather
than on a solstice that drifts by a day or two each year. No ephemeris, no
annual maintenance, and for a background tint nobody notices the three-week
difference.

| Months (UTC) | Northern | Southern |
| --- | --- | --- |
| Mar–May | spring | autumn |
| Jun–Aug | summer | winter |
| Sep–Nov | autumn | spring |
| Dec–Feb | winter | summer |

Countries in the tropical band are marked `equatorial` and get the **neutral**
theme. Singapore does not have an autumn, and showing it one would be wrong
rather than merely imprecise. Undetected visitors get neutral for the same
reason: no location, no season.

The date is read in UTC so that the theme never depends on which region the app
happens to be deployed in.

## Themes

Defined in `src/app/globals.css` as `:root[data-season="…"]` blocks that
override three design tokens: `--color-porcelain`, `--color-panel` and
`--color-facet`. Ink tokens are never touched, because the contrast ratios
documented in that file are measured against them.

Every seasonal ground was chosen to sit within a few hundredths of the base
luminance, so all four themes hold WCAG AA for body text on both grounds:

| Theme | ink/porcelain | ink-muted/porcelain | ink/panel | ink-muted-panel/panel |
| --- | --- | --- | --- | --- |
| base | 17.01 | 4.96 | 15.19 | 5.23 |
| spring | 17.11 | 4.99 | 15.48 | 5.32 |
| summer | 17.12 | 5.00 | 15.41 | 5.30 |
| autumn | 17.01 | 4.96 | 15.22 | 5.24 |
| winter | 16.99 | 4.96 | 15.26 | 5.25 |

**Re-measure before changing any value there.** The tint is meant to be a
whisper: if a visitor notices the colour rather than the season, it has gone too
far.

## The badge

- Renders only for `high` or `medium` confidence. A locale or timezone guess
  still tints the page — a wrong season is invisible — but never puts a country
  name on screen, because a wrong flag is not invisible.
- Shows a skeleton while resolving, and nothing at all if detection fails.
- Dismissible, and stays dismissed (`localStorage`).
- Collapses to the flag alone under 640px.
- Steps up automatically when the shortlist tray occupies the same corner, via
  `useShortlistTrayVisible()`.

Flags come from [flag-icons](https://github.com/lipis/flag-icons) (MIT). The
SVGs are copied into `public/flags` by `scripts/copy-flags.mjs`, which
`npm run build` runs automatically; the folder is generated, not committed.

Taking the SVGs rather than the library's stylesheet is deliberate: the
stylesheet is ~60 KB of class definitions for 270 countries, and every visitor
would download all of it to show one flag. One SVG is about 1 KB. Emoji flags
are not used — they render inconsistently across platforms and not at all on
most Windows builds.

Country names come from
[i18n-iso-countries](https://github.com/michaelwittig/node-i18n-iso-countries)
(MIT). ISO stores several names per country and neither `select` mode is right
alone — the primary gives "People's Republic of China", the first alias gives
"UK" for GB — so `countryName()` reads both, prefers the shorter, and rejects
abbreviations. That lands on the colloquial form without maintaining a parallel
list by hand.

## Privacy

- **Country only.** No city, no coordinates, no region.
- **The IP address is never stored.** It is read from the request, used for a
  lookup, and dropped. It is not logged and not written to the cookie.
- **The cookie holds `CC|hemisphere|source|timestamp`** and nothing else. It is
  not a session, carries no identifier, and is deliberately readable by client
  script because the pre-paint script needs it before any bundle loads.
- **Third parties.** With `GEOLITE2_COUNTRY_DB` set, no visitor data leaves the
  server at all. Without it, the fallback sends the visitor's IP to ipwho.is or
  ip-api.com to ask which country it is in. If that matters for your compliance
  position, configure the local database and the network step never runs.
- **Disclosure.** The badge carries a "?" that explains what is detected and
  why, in one sentence, without blocking anything.

There is no privacy policy page in this app yet. Before launch, add one and say
that country-level location is derived from IP address for localisation, naming
the fallback services if they are enabled.

## Testing it

Spoof a CDN header against a running server:

```bash
# Korean visitor — expect autumn
curl -sD- -o /dev/null localhost:3000/ -H 'cf-ipcountry: KR' | grep x-geo

# Australian visitor, same moment — expect spring
curl -sD- -o /dev/null localhost:3000/ -H 'cf-ipcountry: AU' | grep x-geo

# The full chain, including the network fallback
curl -s 'localhost:3000/api/geo' -H 'x-forwarded-for: 8.8.8.8'

# Force a re-resolve, ignoring the cached cookie
curl -s 'localhost:3000/api/geo?fresh=1' -H 'x-forwarded-for: 8.8.8.8'
```

In local development with no headers set there is no public IP to look up, so
detection returns unknown and the site stays neutral. That is correct behaviour
rather than a fault: the alternative would be reporting the server's own
location as the visitor's.
