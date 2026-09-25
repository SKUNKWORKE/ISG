"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShapeGlyph } from "./shape-glyph";
import { GLYPHS } from "@/lib/glyphs";
import { useDeviceType } from "@/hooks/use-device-type";
import { useHydrated, useShortlist } from "@/hooks/use-shortlist";

/** "Shortlist (3)" — only once there is something on it, so the nav stays quiet. */
function ShortlistLink({ className }: { className: string }) {
  const { stones } = useShortlist();
  const hydrated = useHydrated();
  const pathname = usePathname();
  if (!hydrated || !stones.length) return null;
  return (
    <Link
      href="/shortlist"
      aria-current={pathname === "/shortlist" ? "page" : undefined}
      className={className}
    >
      Shortlist <span className="tabular-nums">({stones.length})</span>
    </Link>
  );
}

// Eight items plus the Enquire button don't fit beside the wordmark at lg,
// so the full nav appears from xl and the toggle covers everything below it.
const NAV = [
  { href: "/natural-diamonds", label: "Natural" },
  { href: "/lab-grown-diamonds", label: "Lab-Grown" },
  { href: "/jewelry", label: "Jewelry" },
  { href: "/shapes", label: "Shapes" },
  { href: "/guides", label: "Guides" },
  { href: "/craftsmanship", label: "Craftsmanship" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  // Phones get a full-height drawer; tablets keep the existing dropdown.
  const drawer = useDeviceType() === "mobile";

  // A route change should always leave the menu closed.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // The drawer covers the page, so hold the page still and keep Tab inside the
  // header (logo, toggle, drawer links) while it is open.
  useEffect(() => {
    if (!open || !drawer) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      const header = headerRef.current;
      if (e.key !== "Tab" || !header) return;
      const items = Array.from(
        header.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, drawer]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-hairline bg-porcelain/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Imperial Star Gems, home"
        >
          {/* The wireframe radiant doubles as the brand's technical mark. */}
          <ShapeGlyph
            geometry={GLYPHS.radiant}
            frozen
            className="h-7 w-7 shrink-0 [&_.glyph-facet]:stroke-hairline [&_.glyph-outline]:stroke-ink"
          />
          <span className="font-display text-[21px] leading-none tracking-[-0.01em]">
            Imperial Star Gems
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex xl:gap-8" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b py-1 text-[15px] transition-colors duration-200 ${
                  active
                    ? "border-ink text-ink"
                    : "border-transparent text-ink-muted hover:border-hairline hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <ShortlistLink className="border-b border-transparent py-1 text-[15px] text-ink transition-colors duration-200 hover:border-hairline" />
          <Link
            href="/contact"
            className="rounded-full bg-ink px-6 py-2.5 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            Enquire
          </Link>
        </nav>

        <div className="flex items-center gap-4 xl:hidden">
          <ShortlistLink className="text-[14px] text-ink max-[380px]:hidden" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-hairline"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="flex flex-col gap-[5px]">
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && drawer ? (
          <motion.div
            key="mobile-nav-drawer"
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
            // Absolute, not fixed: the header's backdrop-filter would make a
            // fixed child position against the header instead of the viewport.
            className="absolute inset-x-0 top-full flex h-[calc(100dvh-72px)] flex-col overflow-y-auto border-t border-hairline bg-porcelain"
          >
            <nav className="flex flex-col px-5 py-2" aria-label="Primary">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-16 items-center justify-between border-b border-hairline font-display text-[28px] leading-none ${
                      active ? "text-ink" : "text-ink-muted"
                    }`}
                  >
                    {item.label}
                    {active ? <span aria-hidden className="h-px w-6 bg-ink" /> : null}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-ink px-6 py-3.5 text-center text-[15px] text-white"
              >
                Enquire
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {open && !drawer ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden border-t border-hairline bg-porcelain xl:hidden"
          >
            <nav className="flex flex-col px-5 py-3 sm:px-8" aria-label="Primary">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-hairline py-4 font-display text-2xl last:border-b-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
