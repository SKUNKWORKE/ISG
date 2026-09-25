"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { STAGES, frameCount, frameUrl, stageAt, tiersFor } from "@/lib/sequence";
import { useViewportWidth } from "@/hooks/use-device-type";

/** Parallel requests while preloading. */
const LANES = 8;
/** The cutting sequence, rough to finished stone. */
const INTRO_MS = 16_000;
/** One full turn of the finished stone. */
const TURN_MS = 7_000;
/** Playback keeps this much of the intro loaded ahead of itself before moving on. */
const BUFFER_MS = 1_000;
/** Frames decoded ahead of the playhead, off the main thread. */
const DECODE_AHEAD = 10;
/** Decodes running at once. */
const DECODE_LANES = 3;

/**
 * Loaded frames plus a small sliding window of decoded bitmaps around the
 * playhead. Drawing an undecoded image forces a synchronous decode on the main
 * thread, which is what made playback stutter; bitmaps are decoded ahead, in
 * the background, and released once the playhead has passed them.
 */
class FrameStore {
  images: (HTMLImageElement | null)[];
  private bitmaps = new Map<number, ImageBitmap>();
  private pending = new Set<number>();
  private closed = false;

  constructor(
    readonly count: number,
    private readonly wraps: boolean,
  ) {
    this.images = new Array(count).fill(null);
  }

  private index(i: number) {
    return this.wraps ? ((i % this.count) + this.count) % this.count : i;
  }

  /** The best drawable for frame i: its bitmap, its image, or null. */
  get(i: number): CanvasImageSource | null {
    const k = this.index(i);
    return this.bitmaps.get(k) ?? this.images[k] ?? null;
  }

  /** Keep [from - 1, from + DECODE_AHEAD] decoded; release everything else. */
  prepare(from: number) {
    if (this.closed || typeof createImageBitmap !== "function") return;
    const keep = new Set<number>();
    for (let d = -1; d <= DECODE_AHEAD; d++) {
      const k = this.index(from + d);
      if (k >= 0 && k < this.count) keep.add(k);
    }
    for (const [k, bitmap] of this.bitmaps) {
      if (!keep.has(k)) {
        bitmap.close();
        this.bitmaps.delete(k);
      }
    }
    for (const k of keep) {
      if (this.pending.size >= DECODE_LANES) break;
      const img = this.images[k];
      if (!img || this.bitmaps.has(k) || this.pending.has(k)) continue;
      this.pending.add(k);
      createImageBitmap(img)
        .then((bitmap) => {
          if (this.closed) bitmap.close();
          else this.bitmaps.set(k, bitmap);
        })
        .catch(() => {})
        .finally(() => this.pending.delete(k));
    }
  }

  close() {
    this.closed = true;
    for (const bitmap of this.bitmaps.values()) bitmap.close();
    this.bitmaps.clear();
  }
}

/**
 * The homepage hero: one crystal cut from rough to finished stone.
 *
 * Plays on its own, on a clock. The cutting sequence runs once, the caption
 * follows it stage by stage, and on the last frame playback hands over to the
 * 360° turn of the finished stone, which then loops indefinitely. The two are
 * rendered from the same camera, so the handover is seamless. Frames are
 * cross-faded, so motion stays smooth at the stored frame rate.
 *
 * The clock only runs while the hero is on screen and the tab is visible, and
 * it holds rather than skips when the network has not delivered the frames
 * ahead of it. The pause button satisfies WCAG 2.2.2 for motion that starts on
 * its own; there is still no prefers-reduced-motion branch, because Windows
 * Server, RDP sessions and many power-saving setups report reduced motion by
 * default, and visitors on those machines would only ever see a still.
 */
export function HeroSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(false);
  const redrawRef = useRef<() => void>(() => {});

  const [ready, setReady] = useState(false);
  const [stageId, setStageId] = useState(STAGES[0].id);
  const [paused, setPaused] = useState(false);

  const viewportWidth = useViewportWidth();
  const hydrated = viewportWidth !== null;

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      redrawRef.current();
    }
  }, []);

  useEffect(() => {
    // Wait for the real width so a phone never starts loading the desktop tiers.
    if (viewportWidth === null) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Sampled once per mount: resizing afterwards doesn't swap tiers mid-play.
    const tiers = tiersFor(viewportWidth);
    const intro = new FrameStore(frameCount(tiers.intro), false);
    const loop = new FrameStore(frameCount(tiers.loop), true);
    let cancelled = false;
    /** Intro frames 0..contiguous-1 are all loaded. */
    let contiguous = 0;
    let loopReady = false;

    /** Playhead: ms into the intro, then ms into the turn. */
    let introMs = 0;
    let turnMs = 0;
    let inLoop = false;
    let lastStage = "";

    /* -- drawing */

    const paint = (source: CanvasImageSource, alpha: number) => {
      const w = (source as { width: number }).width;
      const h = (source as { height: number }).height;
      const scale = Math.min(canvas.width / w, canvas.height / h);
      const dw = w * scale;
      const dh = h * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(source, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    };

    /** Frame `position` of `store`, cross-fading into the next when between two. */
    const drawAt = (store: FrameStore, position: number) => {
      const base = Math.floor(position);
      const frac = position - base;
      store.prepare(base);
      const a = store.get(base) ?? nearest(store, base);
      if (!a) return false;
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      paint(a, 1);
      const b = frac > 0.02 ? store.get(base + 1) : null;
      if (b) paint(b, frac);
      ctx.globalAlpha = 1;
      return true;
    };

    const nearest = (store: FrameStore, i: number) => {
      for (let step = 1; step < store.count; step++) {
        const found = store.get(i - step) ?? store.get(i + step);
        if (found) return found;
      }
      return null;
    };

    const redraw = () => {
      if (inLoop && loopReady) {
        drawAt(loop, (turnMs / TURN_MS) * loop.count);
      } else {
        // Until the turn is in memory, the intro's last frame stands in for it:
        // the same face-up view as the turn's first frame.
        const last = intro.count - 1;
        drawAt(intro, inLoop ? last : Math.min(last, (introMs / INTRO_MS) * last));
      }
    };
    redrawRef.current = redraw;

    /* -- loading */

    const fetchFrame = (url: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      });

    const fetchAll = async (store: FrameStore, tier: typeof tiers.intro, first: number, onEach?: () => void) => {
      const queue = Array.from({ length: store.count - first }, (_, k) => k + first);
      await Promise.all(
        Array.from({ length: LANES }, async () => {
          while (queue.length && !cancelled) {
            const i = queue.shift() as number;
            // One retry: a gap holds intro playback until loading finishes.
            store.images[i] = (await fetchFrame(frameUrl(tier, i))) ?? (await fetchFrame(frameUrl(tier, i)));
            onEach?.();
          }
        }),
      );
      // Frames that failed twice borrow a neighbour, so playback can pass them.
      store.images = store.images.map((img, i, all) => img ?? all[i - 1] ?? all.find(Boolean) ?? null);
    };

    const load = async () => {
      const first = await fetchFrame(frameUrl(tiers.intro, 0));
      if (cancelled) return;
      intro.images[0] = first;
      contiguous = first ? 1 : 0;
      redraw();
      setReady(true);
      await fetchAll(intro, tiers.intro, 1, () => {
        while (contiguous < intro.count && intro.images[contiguous]) contiguous++;
      });
      if (cancelled) return;
      if (intro.images.every(Boolean)) contiguous = intro.count;
      // The turn comes second, well before the intro reaches it on any
      // reasonable connection.
      await fetchAll(loop, tiers.loop, 0);
      if (cancelled) return;
      // Play only once every frame is in; a half-loaded turn reads as stutter.
      loopReady = loop.images.every(Boolean);
    };

    /* -- the clock */

    let raf = 0;
    let last = 0;
    let onScreen = false;

    const tick = (now: number) => {
      raf = 0;
      if (!onScreen || document.visibilityState !== "visible") return;
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;

      if (!pausedRef.current) {
        if (!inLoop) {
          // Hold, rather than skip ahead, until the next second of frames is in.
          const next = introMs + dt;
          const needed = Math.min(intro.count, Math.ceil(((next + BUFFER_MS) / INTRO_MS) * intro.count));
          if (contiguous >= needed) introMs = next;
          if (introMs >= INTRO_MS) {
            introMs = INTRO_MS;
            inLoop = true;
          }
          const stage = stageAt(Math.min(introMs / INTRO_MS, 1));
          if (stage.id !== lastStage) {
            lastStage = stage.id;
            setStageId(stage.id);
          }
        } else if (loopReady) {
          turnMs = (turnMs + dt) % TURN_MS;
          // The intro's frames are no longer needed once the turn is playing.
          intro.close();
        }
        redraw();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !onScreen || document.visibilityState !== "visible") return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => (document.visibilityState === "visible" ? start() : stop());
    document.addEventListener("visibilitychange", onVisibility);

    let loading = false;
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen && !loading) {
          loading = true;
          void load();
        }
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(section);

    // The pause button restarts the clock without waiting for another observer callback.
    section.addEventListener("hero:resume", start);

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("hero:resume", start);
      intro.close();
      loop.close();
      redrawRef.current = () => {};
    };
    // `hydrated`, not the width: the tiers are chosen once, on the first real measurement.
  }, [hydrated, resizeCanvas]);

  const togglePaused = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    if (!pausedRef.current) sectionRef.current?.dispatchEvent(new Event("hero:resume"));
  };

  const activeStage = STAGES.find((s) => s.id === stageId) ?? STAGES[0];

  return (
    <section ref={sectionRef} className="relative border-b border-hairline" aria-labelledby="hero-heading">
      <div className="flex min-h-[calc(100svh-72px)] items-center py-10">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-6 px-5 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
          <div className="order-2 lg:order-1">
            <HeroTitle />

            <div className="mt-8 hidden lg:block">
              <StageCaption stage={activeStage} />
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-[min(76vh,720px)] overflow-hidden rounded-[36px] border border-hairline bg-porcelain">
              <canvas
                ref={canvasRef}
                className="h-full w-full"
                role="img"
                aria-label={`Diamond cutting sequence, playing automatically. Now showing ${activeStage.title}: ${activeStage.stillAlt}`}
              />
              {!ready ? (
                <div
                  aria-hidden
                  className="absolute inset-0 animate-pulse rounded-[36px] bg-gradient-to-br from-panel via-porcelain to-panel"
                />
              ) : null}
              <button
                type="button"
                onClick={togglePaused}
                aria-pressed={paused}
                className="absolute bottom-3 right-3 rounded-full border border-hairline bg-porcelain/85 px-3.5 py-1.5 text-[12px] text-ink-muted backdrop-blur-sm transition-colors duration-200 hover:border-ink hover:text-ink max-md:min-h-11"
              >
                {paused ? "Play" : "Pause"}
                <span className="sr-only"> the diamond animation</span>
              </button>
            </div>
          </div>

          <div className="order-3 lg:hidden">
            <StageCaption stage={activeStage} compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTitle() {
  return (
    <div>
      <h1
        id="hero-heading"
        className="font-display text-[clamp(2.4rem,6.4vw,4.6rem)] leading-[1.02]"
      >
        Every diamond begins as rough.
      </h1>
      <p className="measure mt-5 text-[15px] text-ink-muted sm:text-base">
        Imperial Star Gems supplies loose natural and lab-grown stones to trade and private
        buyers. Follow one crystal from the ground to its certificate.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link
          href="/natural-diamonds"
          className="rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          Natural diamonds
        </Link>
        <Link
          href="/lab-grown-diamonds"
          className="rounded-full border border-hairline px-7 py-3 text-[15px] transition-colors duration-200 hover:border-ink"
        >
          Lab-grown diamonds
        </Link>
      </div>
    </div>
  );
}

/** The current stage's title and description. No stage number or counter. */
function StageCaption({
  stage,
  compact = false,
}: {
  stage: (typeof STAGES)[number];
  compact?: boolean;
}) {
  return (
    // Polite live region on the stable wrapper: the caption changes on its own,
    // and a region inserted fresh with each stage would often go unannounced.
    <div className={compact ? "pt-4" : "border-t border-hairline pt-6"} aria-live="polite">
      {/*
        Cross-fade: keyed on the stage id, so React swaps the node and the CSS
        animation replays on every stage change.
      */}
      <div key={stage.id} className="animate-[fadeIn_520ms_ease-out]">
        <h2 className="font-display text-[clamp(1.4rem,2.4vw,2rem)]">{stage.title}</h2>
        <p
          className={`measure mt-2 text-ink-muted ${compact ? "line-clamp-3 text-[14px]" : "text-[15px]"}`}
        >
          {stage.body}
        </p>
      </div>
    </div>
  );
}
