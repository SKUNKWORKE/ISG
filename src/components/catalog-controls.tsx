"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ShapeGlyph } from "./shape-glyph";
import { SHAPES, type ShapeSlug } from "@/lib/shapes";

/** Filter controls shared by the stone and jewelry catalogues. */

const INPUT =
  "w-full rounded-[12px] border border-hairline bg-porcelain px-3 py-2 text-[15px] tabular-nums transition-colors duration-200 focus:border-ink";

export function ShapeFilter({
  selected,
  counts,
  onToggle,
}: {
  selected: ShapeSlug[];
  counts: Partial<Record<string, number>>;
  onToggle: (slug: ShapeSlug) => void;
}) {
  return (
    <fieldset className="mt-6 border-t border-hairline pt-5">
      <legend className="sr-only">Shape</legend>
      <p className="text-[13px] text-ink-muted">Shape</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {SHAPES.map((shape) => {
          const on = selected.includes(shape.slug);
          const available = counts[shape.slug] ?? 0;
          return (
            <button
              key={shape.slug}
              type="button"
              onClick={() => onToggle(shape.slug)}
              aria-pressed={on}
              disabled={available === 0 && !on}
              title={`${shape.name} (${available})`}
              className={`flex flex-col items-center gap-1 rounded-[12px] border px-1 py-2 transition-colors duration-200 disabled:opacity-35 ${
                on ? "border-ink bg-facet" : "border-hairline hover:border-metal"
              }`}
            >
              <ShapeGlyph
                geometry={shape.geometry}
                frozen
                className={`h-7 w-7 ${
                  on
                    ? "[&_.glyph-facet]:stroke-ink [&_.glyph-outline]:stroke-ink"
                    : "[&_.glyph-facet]:stroke-metal [&_.glyph-outline]:stroke-metal"
                }`}
              />
              <span className="text-[10px] leading-none">{shape.name}</span>
              <span className="text-[9px] leading-none tabular-nums text-ink-muted">{available}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * A min/max pair. Partial entries ("0.", or a value outside the bounds) are held
 * locally and clamped when the field loses focus or Enter is pressed.
 */
export function NumberRange({
  label,
  bounds: [min, max],
  value: [low, high],
  step = 0.05,
  unit,
  onChange,
}: {
  label: string;
  bounds: [number, number];
  value: [number, number];
  step?: number;
  unit?: string;
  onChange: (value: [number, number]) => void;
}) {
  const active = low !== min || high !== max;
  return (
    <fieldset className="mt-6 border-t border-hairline pt-5">
      <legend className="sr-only">{label} range</legend>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] text-ink-muted">
          {label}
          {unit ? <span className="text-[11px]"> ({unit})</span> : null}
        </p>
        {active ? (
          <button
            type="button"
            onClick={() => onChange([min, max])}
            className="text-[12px] text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Reset
          </button>
        ) : (
          <span className="text-[11px] tabular-nums text-ink-muted">
            {min}–{max}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <NumberField
          label={`Minimum ${label.toLowerCase()}`}
          value={low}
          step={step}
          min={min}
          max={high}
          onCommit={(v) => onChange([Math.min(v, high), high])}
        />
        <span aria-hidden className="h-px w-3 bg-hairline" />
        <NumberField
          label={`Maximum ${label.toLowerCase()}`}
          value={high}
          step={step}
          min={low}
          max={max}
          onCommit={(v) => onChange([low, Math.max(v, low)])}
        />
      </div>
    </fieldset>
  );
}

function NumberField({
  label,
  value,
  step,
  min,
  max,
  onCommit,
}: {
  label: string;
  value: number;
  step: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  function commit() {
    const n = Number.parseFloat(draft);
    if (!Number.isFinite(n)) return setDraft(String(value));
    const clamped = Math.min(max, Math.max(min, n));
    setDraft(String(clamped));
    if (clamped !== value) onCommit(clamped);
  }

  return (
    <label className="flex-1">
      <span className="sr-only">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        max={max}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          // Complete in-range numbers apply straight away (spinner, arrows); the rest waits for blur.
          const n = Number(e.target.value);
          if (/^\d*\.?\d+$/.test(e.target.value) && n >= min && n <= max && n !== value) onCommit(n);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
        }}
        className={INPUT}
      />
    </label>
  );
}

export function ChipSet<T extends string>({
  label,
  options,
  selected,
  onToggle,
  optionLabel,
  counts,
  hint,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  /** Display text per option; defaults to the value itself. */
  optionLabel?: (value: T) => string;
  /** When given, options with no matching items are disabled and each chip shows its count. */
  counts?: Partial<Record<T, number>>;
  hint?: string;
}) {
  return (
    <fieldset className="mt-6 border-t border-hairline pt-5">
      <legend className="sr-only">{label}</legend>
      <p className="text-[13px] text-ink-muted">{label}</p>
      {hint ? <p className="mt-1 text-[11px] text-ink-muted">{hint}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option);
          const available = counts ? (counts[option] ?? 0) : undefined;
          const text = optionLabel?.(option) ?? option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={on}
              disabled={available === 0 && !on}
              title={available === undefined ? undefined : `${text} (${available})`}
              className={`rounded-[10px] border px-3 py-1.5 text-[13px] transition-colors duration-200 disabled:opacity-35 ${
                on ? "border-ink bg-facet" : "border-hairline hover:border-metal"
              }`}
            >
              {text}
              {available !== undefined ? (
                <span className="ml-1.5 text-[11px] tabular-nums text-ink-muted">{available}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SearchBox({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  // Debounced so a 2,000-stone list isn't refiltered on every keystroke.
  useEffect(() => {
    if (draft === value) return;
    const id = setTimeout(() => onChange(draft), 200);
    return () => clearTimeout(id);
  }, [draft, value, onChange]);

  return (
    <label className="mt-5 block">
      <span className="sr-only">Search</span>
      <input
        type="search"
        value={draft}
        maxLength={80}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        className={INPUT}
      />
    </label>
  );
}

export function QuickPicks({
  presets,
}: {
  presets: { label: string; active: boolean; onToggle: () => void }[];
}) {
  return (
    <fieldset className="mt-6 border-t border-hairline pt-5">
      <legend className="sr-only">Quick picks</legend>
      <p className="text-[13px] text-ink-muted">Quick picks</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={p.onToggle}
            aria-pressed={p.active}
            className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors duration-200 ${
              p.active ? "border-ink bg-ink text-white" : "border-hairline hover:border-metal"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Secondary filters, folded away until wanted; opens itself when one of them is in use. */
export function MoreFilters({ activeCount, children }: { activeCount: number; children: ReactNode }) {
  const [open, setOpen] = useState(activeCount > 0);
  return (
    <div className="mt-6 border-t border-hairline pt-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-baseline justify-between text-[13px] text-ink"
      >
        <span>
          More filters
          {activeCount > 0 ? <span className="text-ink-muted"> · {activeCount} on</span> : null}
        </span>
        <span aria-hidden className="text-ink-muted">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <div className="[&>fieldset:first-child]:mt-2">{children}</div> : null}
    </div>
  );
}

export type SortOption<S extends string> = { label: string; sorts: S[] };

export function SortSelect<S extends string>({
  value,
  labels,
  groups,
  onChange,
}: {
  value: S;
  labels: Record<S, string>;
  groups: SortOption<S>[];
  onChange: (value: S) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-ink-muted">
      Sort
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as S)}
        className="rounded-[12px] border border-hairline bg-porcelain px-3 py-2 text-[15px] text-ink transition-colors duration-200 focus:border-ink"
      >
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.sorts.map((key) => (
              <option key={key} value={key}>
                {labels[key]}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

export function ActiveFilters({
  items,
  onRemove,
  onClear,
}: {
  items: { id: string; label: string }[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (!items.length) return null;
  return (
    <ul className="mt-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="group flex items-center gap-1.5 rounded-full border border-hairline bg-panel px-3 py-1 text-[12px] transition-colors duration-200 hover:border-ink"
          >
            {item.label}
            <span aria-hidden className="text-ink-muted group-hover:text-ink">
              ×
            </span>
            <span className="sr-only">(remove)</span>
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onClear}
          className="px-1 text-[12px] text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}

/** On small screens the filter column folds behind a button so results stay in view. */
export function FilterPanel({ activeCount, children }: { activeCount: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="lg:sticky lg:top-[96px] lg:max-h-[calc(100vh-112px)] lg:overflow-y-auto lg:pr-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-full border border-ink px-5 py-2.5 text-[14px] lg:hidden"
      >
        <span>Filters{activeCount > 0 ? ` (${activeCount})` : ""}</span>
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>
      <div className={`${open ? "mt-6 block" : "hidden"} lg:mt-0 lg:block`}>{children}</div>
    </aside>
  );
}
