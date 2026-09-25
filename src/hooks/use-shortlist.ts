"use client";

import { useCallback, useSyncExternalStore } from "react";
import { SHORTLIST_LIMIT, type ShortlistStone } from "@/lib/shortlist";
import type { Stone } from "@/lib/stones";

/**
 * The buyer's shortlist, kept in localStorage so it survives a reload without
 * an account. One store for every consumer, synced across tabs.
 */

const STORAGE_KEY = "isg:shortlist:v1";
const EMPTY: ShortlistStone[] = [];

/** Fired to open the floating tray from anywhere, e.g. a toggle on a full list. */
export const OPEN_TRAY_EVENT = "isg:shortlist-open";

let cache: ShortlistStone[] | null = null;
const listeners = new Set<() => void>();

function read(): ShortlistStone[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed
      .filter(
        (s): s is ShortlistStone =>
          typeof s === "object" && s !== null && typeof s.sku === "string" && typeof s.carat === "number",
      )
      .slice(0, SHORTLIST_LIMIT);
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): ShortlistStone[] {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): ShortlistStone[] {
  return EMPTY;
}

function write(next: ShortlistStone[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or full storage: the list still works for this page view.
  }
  listeners.forEach((notify) => notify());
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY && e.key !== null) return;
  cache = null;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function snapshotOf(stone: Stone | ShortlistStone): ShortlistStone {
  return {
    sku: stone.sku,
    shape: stone.shape,
    shapeName: stone.shapeName,
    origin: stone.origin,
    carat: stone.carat,
    color: stone.color,
    clarity: stone.clarity,
    ...(stone.cut ? { cut: stone.cut } : {}),
    polish: stone.polish,
    symmetry: stone.symmetry,
    fluorescence: stone.fluorescence,
    lab: stone.lab,
    measurements: stone.measurements,
    tablePercent: stone.tablePercent,
    depthPercent: stone.depthPercent,
  };
}

export function openShortlistTray() {
  window.dispatchEvent(new Event(OPEN_TRAY_EVENT));
}

export function useShortlist() {
  const stones = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const has = useCallback((sku: string) => stones.some((s) => s.sku === sku), [stones]);

  /** Adds or removes the stone. Returns false when the list is full and nothing changed. */
  const toggle = useCallback((stone: Stone | ShortlistStone): boolean => {
    const current = getSnapshot();
    if (current.some((s) => s.sku === stone.sku)) {
      write(current.filter((s) => s.sku !== stone.sku));
      return true;
    }
    if (current.length >= SHORTLIST_LIMIT) return false;
    write([...current, snapshotOf(stone)]);
    return true;
  }, []);

  const remove = useCallback((sku: string) => {
    write(getSnapshot().filter((s) => s.sku !== sku));
  }, []);

  const clear = useCallback(() => write(EMPTY), []);

  return { stones, has, toggle, remove, clear, full: stones.length >= SHORTLIST_LIMIT };
}

const noop = () => () => {};

/** False during SSR and the hydration pass, so stored state never causes a mismatch flash. */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
