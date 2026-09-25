"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useHydrated } from "@/hooks/use-shortlist";
import { useSavedBuilds } from "@/hooks/use-saved-builds";
import { builderHref } from "@/lib/ring-builder";
import { normaliseBuildCode, savedBuildHref } from "@/lib/saved-builds";

/**
 * Rings saved on this device, and the box for picking up a ring saved on
 * another one. Between them they are the whole "come back to it later" story:
 * the browser remembers, and the short code travels — in a WhatsApp message, or
 * read out over the phone to the desk.
 *
 * Renders nothing until the browser has hydrated and there is something to
 * show, so it never flashes empty state at a first-time visitor.
 */
export function SavedBuilds() {
  const hydrated = useHydrated();
  const { entries, remove } = useSavedBuilds();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const router = useRouter();
  const codeId = useId();

  if (!hydrated) return null;

  const resume = (event: React.FormEvent) => {
    event.preventDefault();
    const valid = normaliseBuildCode(code);
    if (!valid) {
      setError("That code should be eight letters and numbers, as in 7K2M9XQD.");
      return;
    }
    setError(undefined);
    router.push(savedBuildHref(valid));
  };

  if (!entries.length && !open) {
    return (
      <p className="mt-8 text-[13px] text-ink-muted">
        Started a ring somewhere else?{" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
        >
          Enter your saved code
        </button>
        .
      </p>
    );
  }

  return (
    <section aria-labelledby="saved-rings" className="mt-10 rounded-[22px] border border-hairline p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="saved-rings" className="font-display text-[22px] leading-none">
          {entries.length ? "Your saved rings" : "Pick up a saved ring"}
        </h2>
        <p className="text-[13px] text-ink-muted">Kept on this device. Use the code anywhere else.</p>
      </div>

      {entries.length ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-start justify-between gap-3 rounded-[16px] bg-panel px-4 py-3">
              <div className="min-w-0">
                <Link
                  href={entry.code ? savedBuildHref(entry.code) : builderHref(entry.build)}
                  className="block truncate text-[15px] underline-offset-4 hover:underline"
                >
                  {entry.label}
                </Link>
                <p className="mt-0.5 text-[12px] text-ink-muted-panel">
                  {entry.code ? (
                    <>
                      Code <span className="tabular-nums tracking-[0.08em]">{entry.code}</span>
                    </>
                  ) : (
                    "Saved on this device only"
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                className="shrink-0 text-[12px] text-ink-muted-panel underline underline-offset-4 transition-colors duration-200 hover:text-ink"
              >
                Remove<span className="sr-only"> {entry.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <form onSubmit={resume} className="mt-5 flex flex-wrap items-end gap-3 border-t border-hairline pt-5">
        <label htmlFor={codeId} className="text-[13px] text-ink-muted">
          Saved code
          <input
            id={codeId}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            maxLength={12}
            placeholder="7K2M9XQD"
            aria-describedby={error ? `${codeId}-error` : undefined}
            className="mt-1.5 block w-[190px] rounded-input border border-hairline bg-porcelain px-3 py-2 text-[15px] uppercase tracking-[0.12em] placeholder:tracking-normal placeholder:text-ink-muted"
          />
        </label>
        <button
          type="submit"
          className="rounded-full border border-ink px-5 py-2.5 text-[14px] transition-colors duration-200 hover:bg-ink hover:text-white"
        >
          Open it
        </button>
        {error ? (
          <p id={`${codeId}-error`} role="alert" className="basis-full text-[13px] text-ink">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
