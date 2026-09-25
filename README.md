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
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run sequence:convert` | Rebuilds `public/sequence` from the raw PNGs |

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
| `scroll/` | 700 | 1080px (source resolution) | 7.4 MB |
| `scroll-mobile/` | 234 (every 3rd) | 900px | 1.7 MB |
| `rotate/` | 138 stand-in, 333 once supplied | 720px | 0.9 MB |

Frames are flattened onto the porcelain background (`#FAFAFA`) rather than
keeping an alpha channel — they render on that ground everywhere.

### Serving from a CDN

Upload `public/sequence/` to an asset CDN (Cloudflare R2, Bunny, Vercel Blob,
S3+CloudFront) and set:

```
NEXT_PUBLIC_SEQUENCE_BASE_URL=https://cdn.imperialstargems.com/sequence
```

Every frame URL goes through `frameUrl()`, so that one variable moves both
sequences. Unset, it falls back to the local `/sequence` folder.
`next.config.ts` sets a one-year immutable cache header on that path.

### Scroll-driven hero

- A `<canvas>` draws one frame at a time. ScrollTrigger pins the hero and scrubs
  across six further viewport heights (seven in total).
- Scroll progress maps to `Math.round(progress * (count - 1))`, and `drawImage`
  runs only when that index actually changes.
- Frames load in batches of 48 across 8 lanes, started by an
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

SKUs are the supplier's own references (`TP-280626-3329` lab-grown, `OM-1026`
natural). Stock lives in `src/lib/real-stones.ts` (lab-grown) and
`src/lib/real-natural-stones.ts` (natural).

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
- **Inventory.** The 121 stones in [`src/lib/stones.ts`](src/lib/stones.ts) are
  generated from a seeded PRNG, not real stock. Replace `buildCatalog` with the
  live feed and delete `INVENTORY_NOTICE` and its two usages.
- **Certificate numbers** are deliberately not generated; wire real report
  numbers in with the real inventory.
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
public/sequence/              scroll/, scroll-mobile/, rotate/
src/app/                      Routes: home, two catalogues, shapes, craftsmanship, contact
src/app/api/enquiry/          Enquiry endpoint
src/app/api/ring-builds/      Saves a ring configuration, returns its short code
src/components/               Hero sequence, rotation loop, catalogue, glyphs, drawer, form
src/lib/                      Shapes, glyph geometry, stones, sequence, contact helpers
src/data/                     Generated frame manifest
```
