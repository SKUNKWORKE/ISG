"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SALES_PHONE, SALES_PHONE_ALT } from "@/lib/contact";

/**
 * A compact chip in the footer's enquiries column that opens the payment note.
 * Anchored above the chip from `sm` up; a bottom sheet with a backdrop below that.
 */
export function PaymentBadge() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-[10px] border bg-porcelain px-3 py-1.5 text-[12px] tracking-[0.02em] transition-colors duration-200 hover:border-ink hover:text-ink ${
          open ? "border-ink text-ink" : "border-hairline text-ink-muted-panel"
        }`}
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="h-4 w-4 fill-none stroke-current"
          strokeWidth={1.3}
          strokeLinejoin="round"
        >
          <path d="M3 8 10 3.5 17 8" />
          <path d="M4.5 8.5v6M8 8.5v6M12 8.5v6M15.5 8.5v6" />
          <path d="M3 16.5h14" />
        </svg>
        SWIFT · T/T payment
      </button>

      {open ? (
        <>
          <div aria-hidden onClick={close} className="fixed inset-0 z-40 bg-ink/20 sm:hidden" />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={headingId}
            tabIndex={-1}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-[22px] border border-hairline bg-porcelain p-6 pb-8 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] outline-none sm:absolute sm:inset-x-auto sm:bottom-full sm:left-0 sm:mb-3 sm:w-[340px] sm:rounded-[22px] sm:pb-6 sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 id={headingId} className="font-display text-xl">
                Payment
              </h3>
              <button
                type="button"
                onClick={close}
                aria-label="Close payment information"
                className="-mr-1 px-1 text-[20px] leading-none text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-[14px] text-ink">
              T/T (telegraphic transfer) by SWIFT wire, for confirmed orders.
            </p>
            <ul className="mt-4 space-y-2.5 border-t border-hairline pt-4 text-[13px] text-ink-muted">
              <li>Payment is requested only once a stone is confirmed as reserved for you.</li>
              <li>
                Banking details are confirmed with you directly and never sent unsolicited by
                email. Wire interception is a known risk in the diamond trade.
              </li>
              <li>
                You are welcome to verify our details by phone before transferring, on{" "}
                <a href={tel(SALES_PHONE)} className="whitespace-nowrap text-ink underline underline-offset-4">
                  {SALES_PHONE}
                </a>{" "}
                or{" "}
                <a href={tel(SALES_PHONE_ALT)} className="whitespace-nowrap text-ink underline underline-offset-4">
                  {SALES_PHONE_ALT}
                </a>
                .
              </li>
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
