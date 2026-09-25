"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDeviceType } from "@/hooks/use-device-type";

const MODAL_HIDDEN = { opacity: 0, scale: 0.96, y: 12 };
/** Phones: a full-screen sheet that rises from the bottom edge. */
const SHEET_HIDDEN = { opacity: 1, scale: 1, y: "100%" };

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * The enquiry drawer's shell, shared by stones and jewelry: portal, backdrop,
 * focus trap, scroll lock and the SKU header. Callers supply the body, which
 * must contain an element with id="enquiry-title".
 */
export function EnquiryDialog({
  open,
  reference,
  onClose,
  children,
}: {
  open: boolean;
  /** Shown in the sticky header — the SKU. */
  reference: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const hidden = useDeviceType() === "mobile" ? SHEET_HIDDEN : MODAL_HIDDEN;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    // Hold the page still behind the drawer without the layout shifting as the
    // scrollbar disappears.
    const { body } = document;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
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

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the drawer once it exists.
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      restoreFocusRef.current?.focus?.();
    };
  }, [open, reference, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="enquiry"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 max-md:p-0!"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close enquiry"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/25 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-title"
            initial={hidden}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={hidden}
            transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }}
            className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[560px] flex-col overflow-y-auto rounded-[28px] border border-hairline bg-porcelain shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)] sm:max-h-[calc(100dvh-3rem)] max-md:h-dvh max-md:max-h-none! max-md:max-w-none max-md:rounded-none max-md:border-0 max-md:shadow-none"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-porcelain/90 px-6 py-4 backdrop-blur-md">
              <p className="text-[12px] tabular-nums text-ink-muted">{reference}</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-hairline px-4 py-1.5 text-[13px] transition-colors duration-200 hover:border-ink"
              >
                Close
              </button>
            </div>

            <div className="px-6 pb-10 pt-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

/** The WhatsApp / Email block at the foot of every enquiry drawer. */
export function EnquiryActions({
  heading,
  whatsapp,
  mailto,
  reference,
}: {
  heading: string;
  whatsapp: string;
  mailto: string;
  /** "IMPSG-04821 (Ring, 2.57ct, D–F/VVS–VS)" */
  reference: string;
}) {
  return (
    <div className="mt-8 border-t border-hairline pt-6">
      <h3 className="font-display text-xl">{heading}</h3>
      <p className="measure mt-1.5 text-[14px] text-ink-muted">
        Reach us the quickest way for you. Each option arrives with the SKU and specification
        already attached.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-6 py-3 text-center text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          WhatsApp
        </a>
        <a
          href={mailto}
          className="rounded-full border border-ink px-6 py-3 text-center text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white"
        >
          Email
        </a>
      </div>

      <p className="mt-6 text-[12px] text-ink-muted">Reference: {reference}</p>
    </div>
  );
}

export function EnquiryRow({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="text-[12px] text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px]">{value}</dd>
    </div>
  );
}
