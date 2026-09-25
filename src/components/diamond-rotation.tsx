"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MOBILE_TIER_MAX_WIDTH, frameCount, frameUrl, type SequenceTier } from "@/lib/sequence";

/** Playback rate. At 24 fps the 167-frame turn takes about seven seconds, as in the hero. */
const FPS = 24;
/** Parallel image requests while preloading. */
const LANES = 6;
/** After a drag or key scrub, wait this long before autoplay picks back up. */
const RESUME_AFTER_MS = 1800;

const wrap = (n: number, count: number) => ((n % count) + count) % count;

/**
 * A looping 360° turn of the finished stone.
 *
 * Autoplays continuously while it is on screen, and can be dragged (or scrubbed
 * with the arrow keys) to turn it by hand; autoplay resumes shortly after the
 * visitor lets go. Hovering does not pause it — on touch screens there is no
 * hover to take back.
 *
 * Fully independent of the scroll-driven hero: its own canvas, its own frame
 * cache, its own requestAnimationFrame loop. Nothing here reads or writes
 * scroll position, so the two can share a page without one stalling the other.
 *
 * With prefers-reduced-motion it starts paused on the first frame, and the
 * Play button starts it on request.
 */
export function DiamondRotation({ label, className }: { label: string; className?: string }) {
  const count = frameCount("rotate");
  // Both turntable tiers hold the same frames; narrow screens fetch the smaller one.
  const tierRef = useRef<SequenceTier>("rotate");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const indexRef = useRef(0);
  const drawnRef = useRef(-1);
  const holdUntilRef = useRef(0);
  const dragRef = useRef<{ startX: number; startIndex: number } | null>(null);

  const [settled, setSettled] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  /* ------------------------------------------------------------- drawing */

  const draw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.width || !canvas.height) return;

      // Nearest loaded frame, searching both ways round the loop, so a frame
      // that has not arrived yet never blanks the canvas.
      const images = imagesRef.current;
      let img = images[index] ?? null;
      for (let step = 1; !img && step < count; step++) {
        img = images[wrap(index - step, count)] ?? images[wrap(index + step, count)] ?? null;
      }
      if (!img) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      drawnRef.current = index;

      // Keep the slider's reported value on the frame actually showing — during
      // autoplay as well as drags. Written straight to the DOM: routing it
      // through React state would re-render the component thirty times a
      // second for an attribute.
      const slider = sliderRef.current;
      if (slider) {
        slider.setAttribute("aria-valuenow", String(index + 1));
        slider.setAttribute("aria-valuetext", `Turned ${Math.round((index / count) * 360)} degrees`);
      }
    },
    [count],
  );

  /* ---------------------------------------------- reduced motion, sizing */

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);

    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    const canvas = canvasRef.current;
    const ro = new ResizeObserver(() => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        draw(indexRef.current);
      }
    });
    if (canvas) ro.observe(canvas);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
    };
  }, [draw]);

  /* ----------------------------------------------------------- preloading */

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    imagesRef.current = new Array(count).fill(null);
    tierRef.current = window.innerWidth <= MOBILE_TIER_MAX_WIDTH ? "rotate-mobile" : "rotate";
    let cancelled = false;
    let started = false;
    let done = 0;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        const finish = () => {
          done++;
          // Re-render in steps, not once per frame.
          if (!cancelled && (done % 12 === 0 || done === count)) setSettled(done);
          resolve();
        };
        img.onload = () => {
          if (!cancelled) {
            imagesRef.current[i] = img;
            if (drawnRef.current < 0 || i === indexRef.current) draw(indexRef.current);
          }
          finish();
        };
        img.onerror = finish;
        img.src = frameUrl(tierRef.current, i);
      });

    const preload = async () => {
      await load(0);
      const queue = Array.from({ length: count - 1 }, (_, k) => k + 1);
      await Promise.all(
        Array.from({ length: LANES }, async () => {
          while (queue.length && !cancelled) {
            const next = queue.shift();
            if (next !== undefined) await load(next);
          }
        }),
      );
    };

    // Doubles as the on-screen signal that gates the playback loop.
    const io = new IntersectionObserver(
      (entries) => {
        // Read the LAST record, not the first. When the viewer mounts inside the
        // enquiry drawer it starts off screen and slides in, and the browser can
        // deliver both the "not visible" and the "visible" record for this one
        // target in a single batch. Taking entries[0] acted on the stale record,
        // and since nothing changed afterwards no later callback ever came — the
        // drawer's rotation never started loading.
        const entry = entries[entries.length - 1];
        setOnScreen(entry.isIntersecting);
        if (entry.isIntersecting && !started) {
          started = true;
          void preload();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(root);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [count, draw]);

  /* --------------------------------------------------------- the loop */

  const allLoaded = settled >= count;

  useEffect(() => {
    // Only spin once every frame is in memory; spinning through a half-loaded
    // set reads as stutter, not rotation. Off screen or in a background tab the
    // loop stops entirely rather than drawing frames nobody can see.
    if (!playing || !onScreen || !pageVisible || !allLoaded) return;

    const step = 1000 / FPS;
    let raf = 0;
    let last = performance.now();
    let carry = 0;

    const tick = (now: number) => {
      const elapsed = now - last;
      last = now;
      if (now >= holdUntilRef.current && !dragRef.current) {
        carry += elapsed;
        if (carry >= step) {
          // Cap catch-up so a dropped burst of frames does not lurch the stone.
          const advance = Math.min(Math.floor(carry / step), 3);
          carry -= advance * step;
          indexRef.current = wrap(indexRef.current + advance, count);
          if (indexRef.current !== drawnRef.current) draw(indexRef.current);
        }
      } else {
        carry = 0;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, onScreen, pageVisible, allLoaded, count, draw]);

  /* ---------------------------------------------------------- input */

  const scrubTo = (next: number) => {
    const i = wrap(next, count);
    indexRef.current = i;
    if (i !== drawnRef.current) draw(i);
    holdUntilRef.current = performance.now() + RESUME_AFTER_MS;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startIndex: indexRef.current };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    // One drag across the full width turns the stone once.
    const width = e.currentTarget.clientWidth || 1;
    const delta = Math.round(((e.clientX - drag.startX) / width) * count);
    scrubTo(drag.startIndex - delta);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    holdUntilRef.current = performance.now() + RESUME_AFTER_MS;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const big = Math.max(1, Math.round(count / 24));
    const moves: Record<string, number | undefined> = {
      ArrowRight: e.shiftKey ? big : 1,
      ArrowLeft: e.shiftKey ? -big : -1,
    };
    if (e.key === "Home") {
      e.preventDefault();
      scrubTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrubTo(count - 1);
    } else if (moves[e.key] !== undefined) {
      e.preventDefault();
      scrubTo(indexRef.current + (moves[e.key] as number));
    }
  };

  const togglePlaying = () => {
    setPlaying((p) => !p);
    holdUntilRef.current = 0;
  };

  const percent = Math.round((Math.min(settled, count) / count) * 100);

  return (
    <div ref={rootRef} className={className}>
      <div
        ref={sliderRef}
        role="slider"
        tabIndex={0}
        aria-label={`Turn ${label}`}
        aria-valuemin={1}
        aria-valuemax={count}
        // Initial values only. These props never change between renders, so
        // React never rewrites them, and draw() keeps the live DOM attributes
        // in step with the frame on screen.
        aria-valuenow={1}
        aria-valuetext="Turned 0 degrees"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        data-rotation-viewer=""
        // pan-y: a vertical swipe still scrolls the page on touch screens;
        // only horizontal movement turns the stone.
        className="relative aspect-square w-full touch-pan-y select-none overflow-hidden rounded-[22px] border border-hairline bg-porcelain"
        style={{ cursor: "grab" }}
      >
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden />

        {!allLoaded ? (
          <div className="absolute inset-x-6 bottom-5" aria-live="polite">
            <div className="h-px w-full bg-hairline">
              <div
                className="h-px bg-ink transition-[width] duration-200"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-center text-[11px] tabular-nums text-ink-muted">
              Loading rotation {percent}%
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={togglePlaying}
          aria-pressed={!playing}
          className="rounded-full border border-hairline px-4 py-1.5 text-[13px] transition-colors duration-200 hover:border-ink max-md:min-h-11 max-md:px-5"
        >
          {playing ? "Pause rotation" : "Play rotation"}
        </button>
        <p className="text-[12px] text-ink-muted">Drag to turn the stone</p>
      </div>
    </div>
  );
}
