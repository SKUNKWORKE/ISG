"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShapeGlyph } from "./shape-glyph";
import { StarIcon } from "./shortlist-toggle";
import { OPEN_TRAY_EVENT, useHydrated, useShortlist } from "@/hooks/use-shortlist";
import { shortlistMailtoHref, shortlistWhatsappHref, stoneDescriptor } from "@/lib/contact";
import { SHORTLIST_LIMIT } from "@/lib/shortlist";
import { SHAPE_BY_SLUG } from "@/lib/shapes";

/**
 * Whether the tray is currently occupying the bottom-right corner.
 *
 * Exported because the geo badge shares that corner and has to sit above the
 * tray when it is showing. Both read this same hook, so the two can't drift
 * into overlapping each other if the condition below ever changes.
 */
export function useShortlistTrayVisible(): boolean {
  const { stones } = useShortlist();
  const hydrated = useHydrated();
  const pathname = usePathname();
  return hydrated && stones.length > 0 && pathname !== "/shortlist";
}

/** Height of the collapsed tab plus its bottom offset, in pixels. */
export const SHORTLIST_TAB_CLEARANCE = 58;

/**
 * A small tab in the bottom-right corner that opens the shortlist. Hidden when
 * the list is empty, and on the compare page, which already shows everything.
 */
export function ShortlistTray() {
  const { stones, remove, clear } = useShortlist();
  const hydrated = useHydrated();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tabRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_TRAY_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_TRAY_EVENT, onOpen);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        tabRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !tabRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Emptying the list from inside the panel closes it.
  useEffect(() => {
    if (!stones.length) setOpen(false);
  }, [stones.length]);

  if (!hydrated || !stones.length || pathname === "/shortlist") return null;

  const full = stones.length >= SHORTLIST_LIMIT;

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:right-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="shortlist-panel"
            role="region"
            aria-label="Your shortlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            className="w-[min(360px,calc(100vw-2rem))] rounded-[22px] border border-hairline bg-porcelain p-5 shadow-[0_18px_60px_-20px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-[24px] leading-none">Your shortlist</h2>
              <p className="text-[12px] tabular-nums text-ink-muted">
                {stones.length} of {SHORTLIST_LIMIT}
              </p>
            </div>
            {full ? (
              <p className="mt-2 text-[13px] text-ink-muted">
                The shortlist holds {SHORTLIST_LIMIT} stones. Remove one to add another.
              </p>
            ) : null}

            <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
              {stones.map((stone) => (
                <li key={stone.sku} className="flex items-center gap-3 py-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-panel">
                    <ShapeGlyph
                      geometry={SHAPE_BY_SLUG[stone.shape].geometry}
                      frozen
                      className="glyph-auto h-8 w-8"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/stones/${stone.sku}`}
                      className="block truncate text-[15px] hover:underline hover:underline-offset-4"
                    >
                      {stoneDescriptor(stone)}
                    </Link>
                    <span className="block truncate text-[12px] tabular-nums text-ink-muted">
                      {stone.origin === "natural" ? "Natural" : "Lab-grown"} · {stone.sku}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(stone.sku)}
                    className="shrink-0 rounded-full px-2 py-1 text-[12px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
                  >
                    Remove<span className="sr-only"> {stone.sku}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-2">
              <Link
                href="/shortlist"
                className="rounded-full bg-ink px-6 py-2.5 text-center text-[14px] text-white transition-opacity duration-200 hover:opacity-85"
              >
                {stones.length > 1 ? `Compare ${stones.length} stones` : "View shortlist"}
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={shortlistWhatsappHref(stones)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ink px-4 py-2.5 text-center text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
                >
                  WhatsApp
                </a>
                <a
                  href={shortlistMailtoHref(stones)}
                  className="rounded-full border border-ink px-4 py-2.5 text-center text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
                >
                  Email
                </a>
              </div>
              <p className="text-center text-[12px] text-ink-muted">
                One enquiry, every SKU attached.
              </p>
            </div>

            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full text-center text-[12px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              Clear shortlist
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        ref={tabRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="shortlist-panel"
        className="flex items-center gap-2 rounded-full border border-hairline bg-porcelain/90 py-2 pl-3 pr-4 text-[14px] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-colors duration-200 hover:border-ink"
      >
        <StarIcon filled className="h-4 w-4" />
        Shortlist <span className="tabular-nums text-ink-muted">{stones.length}</span>
      </button>
    </div>
  );
}
