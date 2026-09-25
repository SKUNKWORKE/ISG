"use client";

import { useSyncExternalStore } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

/** Tailwind's stock `md` and `lg` — globals.css `@theme` defines no custom breakpoints. */
export const TABLET_MIN_WIDTH = 768;
export const DESKTOP_MIN_WIDTH = 1024;

const RESIZE_DEBOUNCE_MS = 120;

/*
  One shared store for every consumer: a single pair of window listeners and a
  single debounce timer, however many components ask.
*/
let width: number | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function measure() {
  const next = window.innerWidth;
  if (next === width) return;
  width = next;
  listeners.forEach((notify) => notify());
}

function scheduleMeasure() {
  clearTimeout(timer);
  timer = setTimeout(measure, RESIZE_DEBOUNCE_MS);
}

function subscribe(notify: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("orientationchange", scheduleMeasure);
  }
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
    if (listeners.size === 0) {
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("orientationchange", scheduleMeasure);
      clearTimeout(timer);
      // Nobody is listening, so the cached value can go stale; re-read next time.
      width = null;
    }
  };
}

function getSnapshot() {
  if (width === null) width = window.innerWidth;
  return width;
}

/** The server has no window. Hydration renders with this, then corrects on the client. */
function getServerSnapshot() {
  return null;
}

export function deviceTypeFor(viewportWidth: number | null): DeviceType {
  if (viewportWidth === null || viewportWidth >= DESKTOP_MIN_WIDTH) return "desktop";
  return viewportWidth >= TABLET_MIN_WIDTH ? "tablet" : "mobile";
}

/**
 * `window.innerWidth`, updated on resize and orientation change (debounced).
 * `null` during server render and the hydration pass, so markup matches the
 * server exactly; components mounted after hydration get the real width on
 * their first render.
 */
export function useViewportWidth(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 'mobile' ≤ 767px, 'tablet' 768–1023px, 'desktop' ≥ 1024px. 'desktop' until hydrated. */
export function useDeviceType(): DeviceType {
  return deviceTypeFor(useViewportWidth());
}
