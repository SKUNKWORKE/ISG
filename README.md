# Imperial Star Gems

A multi-page storefront for loose natural and lab-grown diamonds. There is no cart
and no price anywhere on the site — every stone ends in an enquiry.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP ScrollTrigger · Framer Motion

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in the contact details
npm run dev                    # http://localhost:3000
```

The converted frames are already in `public/sequence`, so the app runs without
re-running the conversion step.

| Command | What it does |
|---|---|
| `npm run build` | Production build (resizes jewelry photos first) |
| `npm run build:amplify` | Production build packaged for AWS Amplify, in `.amplify-hosting/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run sequence:convert` | Rebuilds `public/sequence` from the raw PNGs, then packs it |
| `npm run sequence:pack` | Packs the frames for the players (also runs before every build and `dev`) |

---

## The two image sequences

The site runs two frame sequences. They are **fully independent** — separate
folders, separate components, separate canvases, separate frame caches, separate
playback drivers. Neither reads or writes the other's state.

| | Scroll-driven hero | 360° rotation loop |
|---|---|---|
| Component | [`hero-sequence.tsx`](src/components/hero-sequence.tsx) | [`diamond-rotation.tsx`](src/components/diamond-rotation.tsx) |
| Frames | `scroll/00001.webp` – `00700.webp` | `rotate/00001.webp` – `00NNN.webp` |
| Driven by | Scroll position (GSAP ScrollTrigger) | `requestAnimationFrame` at 30 fps |
| Direction | Scroll down plays forward, scroll up plays in reverse | Loops forward; drag or arrow keys turn it either way |
| Used on | Home page hero | Home page, and inside every stone's enquiry drawer |

### File naming

Every folder is numbered **from `00001`**, five digits, `.webp`. The components
work in 0-based indices internally; the `+1` happens in exactly one place,
`frameUrl()` in [`src/lib/sequence.ts`](src/lib/sequence.ts) — index 0 is
`00001.webp`, index 699 is `00700.webp`. Frame counts come from
`src/data/sequence-manifest.json`, which the conversion script writes, so no
component hard-codes a count.

### Sources

| Input folder (gitignored) | Contents | Used for |
|---|---|---|
| `assets/sequence/raw-700/` | 700 PNGs, rough crystal to finished radiant, from `github.com/Murali2011/sequenceimages` | `scroll/`, `scroll-mobile/` |
| `assets/sequence/raw-360/` | **Not yet supplied.** The dedicated 333-frame turntable render | `rotate/` |

The raw GitHub repos are one-time build inputs. **The live site never references
GitHub** in development or production.

An earlier build used `Murali2011/update-sequence` instead. It has four
never-published indices, four zero-byte files and four truncated PNGs; the
`sequenceimages` repo is the same render with all 700 frames intact, so it
replaced it.

### The 360° frames are a stand-in until the real render arrives

No 333-frame turntable exists in any of the `Murali2011` repositories — every
longer render there is another rough-to-polished sequence. Until the real frames
are supplied, `rotate/` is built from the end of the 700-frame render: source
frames 630–699, where the finished stone turns from a three-quarter view to face
up, played forward and then back so the loop has no jump. That is **138 frames,
and a partial turn rather than a full 360°.** The manifest records this in
`tiers.rotate.source`.

To ship the real rotation:

1. Put the 333 PNGs in `assets/sequence/raw-360/` (any 5-digit numbering).
2. Run `npm run sequence:convert`.

The script detects the folder, uses those frames one for one, writes
`rotate/00001.webp` – `00333.webp`, updates the manifest, and warns if the count
is not 333. No code changes.

### What gets built

`npm run sequence:convert` validates every source frame with a full decode (a
header read does not catch a truncated PNG), drops anything empty or
undecodable, then writes:

| Folder | Frames | Width | Size |
|---|---|---|---|
| `scroll/` | 351 (every 2nd) | 1200px | 10.5 MB |
| `scroll-mobile/` | 351 | 720px | 6.2 MB |
| `rotate/` | 167 | 1200px | 4.8 MB |
| `rotate-mobile/` | 167 | 720px | 2.7 MB |

The desktop tiers were 1440px until September 2026; at 1200px the hero canvas
(about 1,440 device pixels at most) stretches them by 1.2× at worst, and the
home page downloads about 10 MB less.

Frames are flattened onto the porcelain background (`#FAFAFA`) rather than
keeping an alpha channel — they render on that ground everywhere.

### Frame packs

The players don't fetch frames one by one. Before every build (and `npm run
dev`), [`scripts/pack-sequence.mjs`](scripts/pack-sequence.mjs) copies each
tier's frames, byte for byte, into packs of 24 under
`public/sequence/packs/<tier>-<hash>/` (generated, not committed), and records
them in `src/data/sequence-packs.json` (committed). The hash covers the frames,
so a new render gets new pack URLs and the immutable cache can't serve an old
one.

[`src/lib/frame-packs.ts`](src/lib/frame-packs.ts) loads a tier as: the first
frame on its own, so something shows at once; then the packs, three at a time
and in order, so the hero is fed from the front. Each tier is downloaded once
per visit and shared: the hero's turn and the rotation section further down
draw the same frames. A pack that fails twice, or a tier with no packs, falls
back to the individual frame files, so a missing pack degrades to the old
behaviour rather than a blank canvas.

A home page visit makes 24 sequence requests instead of 518.

### Serving from a CDN

Upload `public/sequence/` to an asset CDN (Cloudflare R2, Bunny, Vercel Blob,
S3+CloudFront) and set:

```
NEXT_PUBLIC_SEQUENCE_BASE_URL=https://cdn.imperialstargems.com/sequence
```

Every frame and pack URL goes through `frameUrl()` and `packUrl()`, so that one
variable moves both sequences. Upload the folder after a build, so it includes
`packs/`; the CDN must also send CORS headers for this site, since packs are
read with `fetch()`. Without the packs or the CORS headers the players fall
back to single frames, which still work. Unset, it falls back to the local
`/sequence` folder.
`next.config.ts` sets a one-year immutable cache header on that path.

### Scroll-driven hero

- A `<canvas>` draws one frame at a time. ScrollTrigger pins the hero and scrubs
  across six further viewport heights (seven in total).
- Scroll progress maps to `Math.round(progress * (count - 1))`, and `drawImage`
  runs only when that index actually changes.
- Frames load as packs (see *Frame packs*), started by an
  `IntersectionObserver`. Frame 1 loads first and draws immediately; scrubbing
  ahead of the loader holds the nearest loaded frame rather than blanking, and the
  frame under the playhead always jumps the queue.
- Narrow screens (≤ 900px) load `scroll-mobile/` instead.
- GSAP is loaded with a dynamic `import()`, so it stays out of other routes'
  bundles.

**There is no `prefers-reduced-motion` fallback on the hero, deliberately.** The
sequence only moves while the visitor is scrolling and stops the instant they
stop — it is direct manipulation, not autoplaying motion. It previously swapped
in a single static poster under reduced motion, and Windows Server, RDP sessions
and many power-saving configurations report reduced motion by default, so on
those machines the hero was one image that never changed.

### 360° rotation loop

- Autoplays at 30 fps once every frame is loaded, looping continuously.
- **Drag** turns the stone by hand — one full-width drag is one full turn — and
  autoplay does not fight the pointer while the button is held. **Arrow keys**
  step one frame (Shift for larger steps); Home and End jump to the ends.
- Autoplay resumes 1.8 s after the visitor lets go. Hovering does not pause it.
- A visible **Pause / Play** button is always present.
- It stops drawing entirely when scrolled off screen or when the tab is hidden.
- With `prefers-reduced-motion` it **starts paused**; Play starts it. Unlike the
  hero, this one does move on its own, so the preference applies.
- A vertical swipe on the viewer still scrolls the page on touch screens
  (`touch-action: pan-y`); only horizontal movement turns the stone.
- The slider's `aria-valuenow` / `aria-valuetext` track the frame actually on
  screen, including during autoplay.

### How this was verified

In headless Chrome against the running app, under both `prefers-reduced-motion`
settings, by reading canvas pixels and wrapping `drawImage` to log which frame
each canvas drew:

- **Hero:** six scroll positions produce six different frames; scrolling back up
  reproduces the exact earlier frame (reverse playback). Identical results with
  and without reduced motion.
- **Rotation:** about 90 sequential frames drawn per 3 s of autoplay, each exactly
  one frame after the last, all from `rotate/`; zero draws while paused; drag and
  keys change the frame; reduced motion starts paused and Play starts it.
- **Independence:** across a full session, zero draws of a `rotate/` frame onto
  the hero canvas or a `scroll/` frame onto the rotation canvas, with the hero
  scrubbing while the loop was live.

---

## Design system

Tokens live in [`src/app/globals.css`](src/app/globals.css) under `@theme`.
Tailwind's default palette is **cleared wholesale** (`--color-*: initial`) so a
stray `text-gray-500` fails loudly instead of quietly going off-brand.

| Token | Hex | Use |
|---|---|---|
| `porcelain` | `#FAFAFA` | Page background |
| `panel` | `#EFEDEA` | Alternating section bands |
| `ink` | `#17181B` | Primary text |
| `ink-muted` | `#6E6D69` | Secondary text **on porcelain only** |
| `ink-muted-panel` | `#63625E` | Secondary text on panel bands |
| `hairline` | `#D8D6D1` | Borders, dividers |
| `metal` | `#B9B6AE` | Icon strokes and rules — **never text** |
| `facet` | `#DCEAF0` | Hover and active states only |

### Contrast

```
ink             on porcelain   17.1 : 1   pass
ink             on panel       15.2 : 1   pass
ink-muted       on porcelain    4.96: 1   pass
ink-muted       on panel        4.43: 1   FAILS AA
ink-muted-panel on panel        5.23: 1   pass
metal           on porcelain    1.94: 1   decoration only
```

`--ink-muted` at the briefed `#6E6D69` clears AA on porcelain but lands just under
it on the panel ground, so `--ink-muted-panel` exists for panel sections.

### Type and shape

- Display: **Instrument Serif**. Body: **DM Sans**. Both via `next/font`,
  self-hosted at build time — the build needs network access for the initial
  font fetch.
- Body copy is capped by a `measure` utility at 62ch.
- Radii scale by element size: pill CTAs, 22px cards, 36px panels, 10–12px chips
  and inputs.

### Motion

Two sequences carry the motion: the scroll-driven hero and the rotation loop.
There is no fade-slide-up on scroll anywhere else — every other transition
answers a user action: hover, focus, opening the drawer, changing a filter.

---

## The shape system

Eleven cuts drawn as hairline plotting diagrams in
[`src/lib/glyphs.ts`](src/lib/glyphs.ts), serving as catalogue navigation, card
imagery and the brand's technical mark. Strokes use
`vector-effect: non-scaling-stroke`. On hover or keyboard focus the outline fills
with the cool glint and the facet lines draw in from the girdle, staggered —
pure CSS on `pathLength="1"`. Clicking a glyph filters the catalogue via
`?shape=<slug>`.

---

## Enquiry flow

No price exists anywhere — not on a card, not in a data attribute, not in the
serialized props.

`Enquire` opens a drawer ([`enquiry-drawer.tsx`](src/components/enquiry-drawer.tsx))
with the SKU, its own instance of the rotation loop, the full specification, and
three contact paths:

1. **WhatsApp** — `https://wa.me/<number>?text=<url-encoded message>`
2. **Email** — `mailto:` with subject and body pre-filled
3. **In-page form** — posts to `/api/enquiry`, because `mailto:` silently does
   nothing for anyone without a configured mail client

The drawer traps focus, closes on Escape, locks body scroll without shifting the
layout, and restores focus to the button that opened it.

`POST /api/enquiry` validates, requires an email **or** a phone, runs a honeypot,
and rate-limits to 5/minute per IP. Set `ENQUIRY_WEBHOOK_URL` to deliver
somewhere; without it the route accepts and logs a warning.

> The in-memory rate limiter does not survive a restart and is not shared between
> serverless instances. Put a real limiter or a WAF rule in front of it before
> launch.

---

## Stock

SKUs are the supplier's own references (`TP-280626-3329`, `SSD228811`
lab-grown; `OM-1026` natural). Stock comes from two places:

| Source | Contents |
|---|---|
| [`src/lib/real-stones.ts`](src/lib/real-stones.ts), [`real-natural-stones.ts`](src/lib/real-natural-stones.ts) | The first stock lists, kept by hand |
| `src/data/stones/<prefix>.json` | Supplier workbooks, one file per supplier, read by [`supplier-stones.ts`](src/lib/supplier-stones.ts) |

To load a supplier's new list:

```bash
pip install openpyxl
python3 scripts/import-stones.py path/to/SSD_All_Stones.xlsx
```

The script replaces that supplier's JSON file outright. **IGI stones are listed
as lab-grown and GIA stones as natural**, except where the workbook itself says
a stone was grown (CVD, HPHT growth, "man-made"): GIA grades grown diamonds too.
Rows from any other lab or with no certificate, rows missing a grade the
catalogue needs, and stones already listed are left out, and the script
prints how many and why. A blank fluorescence is kept and simply not shown.
Report numbers, prices and locations are never copied; the workbook remains the
lookup from SKU to report. It also writes today's date to
`src/data/stock-updated.json`, which the stone sitemaps give as every stone's
`<lastmod>` — commit it with the stock files.

The supplier files are tables rather than lists of objects — a row per stone,
with repeated words (shapes, grades, labs) stored once per file — which keeps
73,602 stones to about 5 MB. They are read from disk once per server process,
not imported: an import compiled them into several server bundles, 23 MB each.

**At this size nothing ships whole to the browser.** The stock module is
`server-only`; client code imports types and grade lists from
[`stone-vocabulary.ts`](src/lib/stone-vocabulary.ts). The catalogue pages are
prerendered with their first twelve unfiltered results, and every filter change
after that — including the filters in a shared or guide link, applied once the
page loads — asks `GET /api/stones` for one page of results plus the filter
counts ([`catalog-search.ts`](src/lib/catalog-search.ts)). Stone pages are built on
their first visit rather than at build time, stone URLs have their own sitemaps
(`/stones/sitemap/<n>.xml`, listed in `robots.txt`), and a catalogue spec sheet
lists at most the first 1,000 matching stones.

---

## Request and render budget

Every request to the site counts against the host's allowances, and a server
render counts several times over: a function invocation, CPU time, origin
transfer and, for stone pages, cache writes. The site holds tens of thousands of
pages, so the defaults that are harmless on a small site added up quickly. What
keeps it in check:

| | What it does | Where |
|---|---|---|
| Proxy only on a first visit | The geo proxy's matcher skips any request carrying the geo cookie, any client-side navigation or prefetch, and crawlers. A skipped request never invokes the function. It used to run on every page view and every prefetch. | [`proxy.ts`](src/proxy.ts) |
| Prefetch on intent | Site links import [`intent-link.tsx`](src/components/intent-link.tsx) rather than `next/link`. It prefetches when a link is hovered, focused or touched, not when it scrolls into view. Previously a page load prefetched 19–35 routes, each one a server request. | every `Link` |
| Static catalogues | `/natural-diamonds`, `/lab-grown-diamonds` and `/jewelry` don't read their query string, so they are prerendered and served from the CDN. Filters in the address are applied in the browser; [`catalog-address-script.tsx`](src/components/catalog-address-script.tsx) dims the list until they are. | catalogue pages |
| Cached search | `/api/stones` answers depend only on the URL, so the CDN keeps them for a day (`s-maxage`); a deploy starts the cache afresh. On the server, recent searches are kept sorted in memory, so "Show more" and the spec sheet don't filter the whole stock again. | [`api/stones`](src/app/api/stones/route.ts), [`catalog-search.ts`](src/lib/catalog-search.ts) |
| Frame packs | 24 requests per home page visit instead of 518. | *Frame packs* above |
| One geo lookup | The theme and the badge share one `/api/geo` request per page load, and the answer is kept for the browser tab, including an empty one. | [`use-visitor-country.ts`](src/hooks/use-visitor-country.ts) |
| Crawl limits | `robots.txt` closes the per-request URLs with no end to them: catalogue, jewelry, builder and contact query strings, and the PDF spec sheets. The ring builder alone paged through every stone in stock. SEO-tool crawlers get a crawl delay, and the ring builder and spec sheet links carry `rel="nofollow"` (the guides' filtered catalogue links rely on `robots.txt` and the catalogues' canonical URL). Every indexable page stays open. | [`robots.ts`](src/app/robots.ts) |
| Honest sitemaps | `<lastmod>` is the stock date, not the build time, so a deploy no longer tells crawlers that all 73,602 stone pages changed. | [`stones/sitemap.ts`](src/app/stones/sitemap.ts), [`sitemap.ts`](src/app/sitemap.ts) |

Two settings that live in the Vercel dashboard rather than the repository are
worth turning on as well: **Firewall → Bot Protection** and **AI Bots** (both
free). They stop crawlers that ignore `robots.txt` before they reach a function.

---

## Hosting on AWS Amplify

Amplify's built-in Next.js support stops at Next.js 15, and this site is on 16,
so it deploys through Amplify's framework-neutral **deployment specification**
instead: a Node server on port 3000 plus a folder of static files.
`npm run build:amplify` runs `next build` (with `output: "standalone"`), then
[`scripts/package-amplify.mjs`](scripts/package-amplify.mjs) writes:

```
.amplify-hosting/
  deploy-manifest.json   which paths are files and which go to the server
  compute/default/       the standalone Next.js server (nodejs22.x)
  static/                public/ and .next/static, served by Amplify's CDN
```

[`amplify.yml`](amplify.yml) runs that on Node 22 and deploys the folder. To set
up the app, connect the repository in the Amplify console; it picks up
`amplify.yml` from the repository root. Then:

- **Environment variables.** Set them in the Amplify console as usual. The
  running server only sees the ones `amplify.yml` copies into `.env.production`
  during the build — `imperialstargem_MONGODB_URI`, `MONGODB_DB`,
  `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_FORWARD_EMAIL`, `GEOLITE2_COUNTRY_DB`. A new
  server-side setting needs its name added there. `NEXT_PUBLIC_*` variables are
  read at build time and need nothing extra.
- **Change the branch's framework from "Next.js - SSR".** Amplify sets it
  when it sees `next` in `package.json`, and with it set, Amplify ignores the
  `deploy-manifest.json` and runs its own Next.js step instead, which fails
  after a successful build with *"Can't find required-server-files.json in
  build output directory"*. With any other framework on a `WEB_COMPUTE` app,
  Amplify deploys the manifest. The setting isn't in the repository; change it
  once, from AWS CloudShell (the `>_` icon in the AWS console, in the app's
  region):

  ```bash
  aws amplify list-apps --query "apps[].[name,appId,platform]" --output table
  aws amplify update-branch --app-id <appId> --branch-name main --framework Web
  aws amplify start-job --app-id <appId> --branch-name main --job-type RELEASE
  ```

  The platform column should read `WEB_COMPUTE`; if it doesn't,
  `aws amplify update-app --app-id <appId> --platform WEB_COMPUTE`. Repeat the
  `update-branch` for any other connected branch.

Amplify refuses a server bundle over **220 MB** and a server response over
**5.72 MB**, and the packaging script checks both, failing the build with the
reason rather than leaving it to the deploy. The server bundle is about 125 MB,
down from 275 MB, most of it prerendered pages. What keeps it there:

- **Stone data** is read from disk once (see *Stock*), not compiled into bundles.
- **No image server.** Every jewelry photo is resized before the build by
  [`scripts/build-images.mjs`](scripts/build-images.mjs) to the widths in
  `src/data/image-widths.json`, into `public/_img/` (generated, not
  committed), and [`image-loader.ts`](src/lib/image-loader.ts) points
  `next/image` at those files. The CDN serves photos directly, and the server
  carries no image library. The first build resizes 1,750 photos to six widths
  in about six minutes on a 2-core build machine. The sizes are kept in
  `.next/cache/images/`, which Vercel and `amplify.yml` both restore on the
  next build, so after that only changed photos are redone and the step takes
  seconds. (WebP rather than the AVIF Next's
  optimizer negotiated per browser: static files can't negotiate, and WebP
  works on every browser the site supports.)
- **Stone sitemaps** hold 20,000 URLs each (about 3.5 MB).
- **Pages rendered on demand stay in memory** (`isrFlushToDisk: false`), since
  the server's folder is read-only on Amplify.

Vercel's analytics scripts are only included on a Vercel build (`VERCEL=1`);
elsewhere they would 404.

---

## Build a ring

`/build-a-ring` runs stone → setting → metal, size and engraving. There are no
bare mounts in stock: every engagement ring with a centre stone doubles as a
setting design, and the head is remade to fit the buyer's stone
([`ring-builder.ts`](src/lib/ring-builder.ts)). Every choice lives in the query
string, so any state of the builder is a link someone can send.

**The drawing.** Beside the supplier's photograph is a live drawing of the ring
as configured — [`ring-composite.tsx`](src/components/ring-composite.tsx) over
the geometry in [`ring-render.ts`](src/lib/ring-render.ts). It is millimetre
space throughout: the band at the chosen finger size, the centre stone at the
size on its report, the metal tinted by colour *and* by karat (mixed on actual
fineness, so 9K reads paler than 18K), and the engraving set along the inside of
the shank. The head, halo and side stones are indicative of the style and the UI
says so. The frame is fitted to the ring rather than fixed — stock runs from a
quarter carat to twenty-two, and one frame holding the largest would leave the
ordinary ones as specks — so scale is carried by a labelled bar instead.

This is the one thing a photograph cannot do: it shows *this* stone against
*this* band, where the photograph shows someone else's centre stone. The
photograph stays the default view; the drawing is one click away.

**Saving and resuming.** `Save & get a link` does two independent things. It
keeps the configuration in `localStorage`
([`use-saved-builds.ts`](src/hooks/use-saved-builds.ts), same store pattern as
the shortlist), and it posts to `POST /api/ring-builds` for an eight-character
code — Crockford base 32 without I, L, O and U, so nothing is misread over a
phone call. `/build-a-ring?build=<code>` looks the record up and redirects to the
fully expanded builder URL, which is what makes later edits behave: the link the
buyer now holds is the one they change.

The two halves are independent on purpose. With no database configured the route
answers 503, the local copy is still made, and the builder's own URL already
carries every choice — so there is always a link to send. Saving is never a dead
end. There is no account: whoever holds the code holds the ring, which is what
makes it shareable over WhatsApp and why there is nothing in it worth guessing.
Rate-limited to 10/minute per IP, with the same caveat as `/api/enquiry` above.

Engraving is capped at 30 characters and stripped to what an engraver can cut
(letters in any alphabet, digits, and the marks that turn up in names and dates)
on the way in, in the URL, and again server-side.

---

## Before this goes live

- **The 333-frame 360° render.** `rotate/` is currently a 138-frame stand-in
  showing a partial turn. See *The 360° frames are a stand-in* above.
- **Contact details** — email, phone and WhatsApp are hard-coded in
  [`src/lib/contact.ts`](src/lib/contact.ts). Confirm they are current.
- **Inventory** is a set of static supplier lists (see *Stock* above), so
  availability lags the trade desk until a live feed replaces them; delete
  `INVENTORY_NOTICE` and its usages when one does.
- **Sourcing and ethics copy** on `/craftsmanship` states standard trade
  positions. Confirm each is true of the business before publishing.
- **`metadataBase`** in `src/app/layout.tsx`, plus the domain in `sitemap.ts` and
  `robots.ts`, if the production domain differs.

---

## Not built

- **Draggable per-shape sequences** for the shape grid. They need 36–72 rendered
  frames for each of the eleven shapes, and only the radiant exists. The grid
  ships with the SVG wireframe-to-glint interaction; the drag-a-frame-sequence
  technique is already implemented in `diamond-rotation.tsx`, so per-shape assets
  can be wired in later without new playback code.
- **three.js wireframe gem.** A stretch goal; `react-three-fiber` is not
  installed.

## Layout

```
assets/sequence/raw-700/      700-frame source PNGs, gitignored
assets/sequence/raw-360/      333-frame turntable PNGs, gitignored — to be supplied
scripts/convert-sequence.mjs  PNG -> WebP tiers + manifest
scripts/import-stones.py      Supplier stock workbooks -> src/data/stones/*.json
scripts/build-images.mjs      Jewelry photos -> public/_img/ at fixed widths (every build)
scripts/pack-sequence.mjs     Frame sequences -> public/sequence/packs/ (every build and dev)
scripts/package-amplify.mjs   next build output -> .amplify-hosting/ for AWS Amplify
amplify.yml                   Amplify build settings
public/sequence/              scroll/, scroll-mobile/, rotate/
src/app/                      Routes: home, two catalogues, shapes, craftsmanship, contact
src/app/api/enquiry/          Enquiry endpoint
src/app/api/ring-builds/      Saves a ring configuration, returns its short code
src/app/api/stones/           One page of catalogue results for the browser
src/components/               Hero sequence, rotation loop, catalogue, glyphs, drawer, form
src/lib/                      Shapes, glyph geometry, stones, sequence, contact helpers
src/data/                     Generated frame manifest, jewelry and supplier stone lists
```
