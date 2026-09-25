"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { UPDATE_TOPICS, updatesWhatsappHref, type UpdateTopic } from "@/lib/contact";

/**
 * Footer sign-up for the WhatsApp updates list. Nothing is stored or sent from
 * the site: the button opens WhatsApp with the request written out, and the
 * buyer presses send.
 */
export function FooterUpdates() {
  const [topics, setTopics] = useState<UpdateTopic[]>(UPDATE_TOPICS.map((t) => t.id));
  const [name, setName] = useState("");
  const [buyer, setBuyer] = useState<"private" | "trade" | undefined>(undefined);
  const [warn, setWarn] = useState(false);
  const id = useId();

  const toggle = (topic: UpdateTopic) => {
    setWarn(false);
    setTopics((current) =>
      current.includes(topic) ? current.filter((t) => t !== topic) : [...current, topic],
    );
  };

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="mt-16 grid gap-8 border-t border-hairline pt-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16"
    >
      <div>
        <h2 id={`${id}-heading`} className="font-display text-[28px] leading-tight">
          Updates on WhatsApp
        </h2>
        <p className="measure mt-3 text-[15px] text-ink-muted-panel">
          New stock as it arrives and our market notes, sent now and then. Choose what you want and
          we will open WhatsApp with the request written out; nothing is sent until you press send.
        </p>
        <p className="mt-3 text-[13px] text-ink-muted-panel">
          Prefer a feed?{" "}
          <Link href="/insights/feed.xml" className="underline underline-offset-4 hover:text-ink">
            Market insights by RSS
          </Link>
          .
        </p>
      </div>

      <div>
        <fieldset>
          <legend className="text-[13px] text-ink-muted-panel">Send me</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {UPDATE_TOPICS.map((t) => {
              const on = topics.includes(t.id);
              return (
                <label
                  key={t.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[14px] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                    on ? "border-ink bg-porcelain" : "border-hairline hover:border-ink"
                  }`}
                >
                  <input type="checkbox" checked={on} onChange={() => toggle(t.id)} className="sr-only" />
                  <span
                    aria-hidden
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border ${
                      on ? "border-ink bg-ink" : "border-metal"
                    }`}
                  >
                    {on ? (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white">
                        <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    ) : null}
                  </span>
                  {t.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-[13px] text-ink-muted-panel">
            Name (optional)
            <input
              type="text"
              value={name}
              maxLength={80}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-input border border-hairline bg-porcelain px-3 py-2 text-[15px] text-ink"
            />
          </label>
          <fieldset>
            <legend className="text-[13px] text-ink-muted-panel">
              Buying as (optional)
            </legend>
            <div className="mt-1.5 flex rounded-input border border-hairline bg-porcelain p-1">
              {(
                [
                  ["private", "Private buyer"],
                  ["trade", "Trade"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={buyer === value}
                  onClick={() => setBuyer((b) => (b === value ? undefined : value))}
                  className={`flex-1 rounded-[8px] px-3 py-1.5 text-[14px] transition-colors duration-200 ${
                    buyer === value ? "bg-ink text-white" : "hover:bg-panel"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href={updatesWhatsappHref({ topics, name, buyer })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (topics.length) return;
              e.preventDefault();
              setWarn(true);
            }}
            className="rounded-full bg-ink px-6 py-2.5 text-[14px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            Sign up on WhatsApp
          </a>
          <p aria-live="polite" className="text-[13px] text-ink-muted-panel">
            {warn
              ? "Choose at least one update to sign up for."
              : "For one particular stone, use Enquire on its page instead."}
          </p>
        </div>
      </div>
    </section>
  );
}
