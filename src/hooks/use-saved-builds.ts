"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { SavedBuild } from "@/lib/saved-builds";

/**
 * Rings this browser has saved, kept in localStorage so a configuration
 * survives a reload without an account — the same bargain the shortlist makes.
 *
 * Each entry keeps the choices themselves, so the list works offline and
 * without the database, plus the short code when the ring was also saved to
 * the server. The code is what makes it resumable on another device.
 */

const STORAGE_KEY = "isg:ring-builds:v1";
export const SAVED_BUILDS_LIMIT = 12;
const EMPTY: SavedRingEntry[] = [];

export type SavedRingEntry = {
  /** Local identity, so an unsaved-to-server ring can still be removed. */
  id: string;
  /** Present once the ring has a short code on the server. */
  code?: string;
  /** "Oval 1.20 ct · Halo · 18K white gold" — built when the ring is saved. */
  label: string;
  savedAt: string;
  build: SavedBuild;
};

let cache: SavedRingEntry[] | null = null;
const listeners = new Set<() => void>();

function read(): SavedRingEntry[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed
      .filter(
        (e): e is SavedRingEntry =>
          typeof e === "object" &&
          e !== null &&
          typeof e.id === "string" &&
          typeof e.label === "string" &&
          typeof e.build === "object" &&
          e.build !== null &&
          typeof e.build.stone === "string",
      )
      .slice(0, SAVED_BUILDS_LIMIT);
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): SavedRingEntry[] {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): SavedRingEntry[] {
  return EMPTY;
}

function write(next: SavedRingEntry[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or full storage: the ring still works for this page view.
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

/** Two builds are the same ring when every choice matches. */
function sameBuild(a: SavedBuild, b: SavedBuild): boolean {
  return (
    a.stone === b.stone &&
    a.setting === b.setting &&
    a.metal === b.metal &&
    a.purity === b.purity &&
    a.size === b.size &&
    a.engraving === b.engraving
  );
}

export function useSavedBuilds() {
  const entries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Saves the ring, newest first. Re-saving the same ring updates the entry in
   * place — with its code, once the server has given one — rather than
   * stacking duplicates every time the buyer presses the button.
   */
  const save = useCallback((entry: Omit<SavedRingEntry, "id" | "savedAt">): SavedRingEntry => {
    const current = getSnapshot();
    const existing = current.find((e) => sameBuild(e.build, entry.build));
    const saved: SavedRingEntry = {
      id: existing?.id ?? crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      ...entry,
      code: entry.code ?? existing?.code,
    };
    write([saved, ...current.filter((e) => e.id !== saved.id)].slice(0, SAVED_BUILDS_LIMIT));
    return saved;
  }, []);

  const remove = useCallback((id: string) => {
    write(getSnapshot().filter((e) => e.id !== id));
  }, []);

  const clear = useCallback(() => write(EMPTY), []);

  return { entries, save, remove, clear };
}
