"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ShapeGlyph } from "./shape-glyph";
import { SIZE_MODELS, faceUpSize, formatFaceUp } from "@/lib/carat-size";
import {
  CALC_CLARITIES,
  CALC_COLORS,
  CALC_CUTS,
  CARAT_MAX,
  CARAT_MIN,
  MILESTONES,
  REFERENCE,
  priceIndex,
  rarity,
  type Spec,
  type StockCube,
} from "@/lib/fourcs-model";
import { SHAPES, SHAPE_BY_SLUG, type ShapeSlug } from "@/lib/shapes";
import type { ClarityGrade, ColorGrade, CutGrade, Origin } from "@/lib/stones";

type State = Spec & { shape: ShapeSlug; origin: Origin };

// Lab-grown by default: it is where our D–J stock is, so the rarity panel has something to count.
const DEFAULT: State = { ...REFERENCE, shape: "round", origin: "lab" };

/** Log scale for the index bar: 10 to 10,000 across the track. */
const LOG_MIN = 1;
const LOG_MAX = 4;
const barPercent = (index: number) =>
  Math.min(100, Math.max(0, ((Math.log10(index) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100));

/** "16% lower on the index" */
const change = (n: number) => `${Math.abs(Math.round(n * 100))}% ${n < 0 ? "lower" : "higher"} on the index`;

function readUrl(): Partial<State> {
  const p = new URLSearchParams(window.location.search);
  const out: Partial<State> = {};
  const carat = Number.parseFloat(p.get("carat") ?? "");
  if (carat >= CARAT_MIN && carat <= CARAT_MAX) out.carat = Math.round(carat * 100) / 100;
  const color = p.get("color") as ColorGrade;
  if (CALC_COLORS.includes(color)) out.color = color;
  const clarity = p.get("clarity") as ClarityGrade;
  if (CALC_CLARITIES.includes(clarity)) out.clarity = clarity;
  const cut = CALC_CUTS.find((c) => c.toLowerCase() === p.get("cut")?.toLowerCase());
  if (cut) out.cut = cut;
  const shape = p.get("shape") as ShapeSlug;
  if (SHAPE_BY_SLUG[shape]) out.shape = shape;
  const origin = p.get("origin");
  if (origin === "natural" || origin === "lab") out.origin = origin;
  return out;
}

export function FourCsCalculator({ cube }: { cube: StockCube }) {
  const [state, setState] = useState<State>(DEFAULT);
  const set = (changes: Partial<State>) => setState((s) => ({ ...s, ...changes }));

  useEffect(() => setState((s) => ({ ...s, ...readUrl() })), []);

  // Shareable without a navigation: the URL follows the sliders.
  useEffect(() => {
    const p = new URLSearchParams({
      shape: state.shape,
      origin: state.origin,
      carat: state.carat.toFixed(2),
      color: state.color,
      clarity: state.clarity,
    });
    if (state.shape === "round" && state.cut) p.set("cut", state.cut);
    window.history.replaceState(null, "", `?${p}`);
  }, [state]);

  const round = state.shape === "round";
  const spec: Spec = { ...state, cut: round ? (state.cut ?? "Excellent") : undefined };
  const result = priceIndex(spec);
  const reference = priceIndex(REFERENCE);
  const multiple = result.index / reference.index;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
      {/* Controls */}
      <div className="rounded-panel border border-hairline p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Segmented
            label="Origin"
            value={state.origin}
            options={[
              { value: "natural", label: "Natural" },
              { value: "lab", label: "Lab-grown" },
            ]}
            onChange={(origin) => set({ origin })}
          />
          <label className="block text-[13px] text-ink-muted">
            Shape
            <select
              value={state.shape}
              onChange={(e) => set({ shape: e.target.value as ShapeSlug })}
              className="mt-1.5 w-full rounded-input border border-hairline bg-porcelain px-3 py-2 text-[15px] text-ink"
            >
              {SHAPES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <CaratSlider value={state.carat} onChange={(carat) => set({ carat })} />

        <StepSlider
          label="Colour"
          hint="D is colourless; each step down shows a little more warmth."
          steps={CALC_COLORS}
          value={state.color}
          onChange={(color) => set({ color })}
          guide="/color-guide"
        />
        <StepSlider
          label="Clarity"
          hint="FL has no inclusions under 10× magnification; I2 has obvious ones."
          steps={CALC_CLARITIES}
          value={state.clarity}
          onChange={(clarity) => set({ clarity })}
          guide="/clarity-guide"
        />
        <StepSlider
          label="Cut"
          hint={
            round
              ? "How well the facets return light. It does the most for sparkle."
              : `Laboratories do not grade cut on ${SHAPE_BY_SLUG[state.shape].name.toLowerCase()} stones, so it is left out here.`
          }
          steps={CALC_CUTS}
          value={spec.cut ?? "Excellent"}
          onChange={(cut) => set({ cut })}
          disabled={!round}
          guide="/cut-guide"
        />

        <button
          type="button"
          onClick={() => setState(DEFAULT)}
          className="mt-8 text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          Reset to the reference stone
        </button>
      </div>

      {/* Read-out */}
      <div className="space-y-5 lg:sticky lg:top-[96px] lg:h-fit">
        <section className="rounded-panel bg-panel p-6 sm:p-8">
          <p className="text-[13px] text-ink-muted-panel">Relative price index</p>
          <p className="mt-2 flex items-baseline gap-3" aria-live="polite" aria-atomic="true">
            <span className="font-display text-[64px] leading-none tabular-nums">
              {Math.round(result.index).toLocaleString("en-GB")}
            </span>
            <span className="text-[15px] text-ink-muted-panel">
              {multiple >= 0.995 && multiple <= 1.005
                ? "the reference stone"
                : `${multiple >= 10 ? Math.round(multiple) : multiple.toFixed(multiple < 1 ? 2 : 1)}× the reference`}
            </span>
          </p>

          <div className="relative mt-6 h-2 rounded-full bg-porcelain" aria-hidden>
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-300"
              style={{ width: `${barPercent(result.index)}%` }}
            />
            <div
              className="absolute -top-1.5 h-5 w-px bg-ink-muted-panel"
              style={{ left: `${barPercent(100)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-ink-muted-panel" aria-hidden>
            <span>Less</span>
            <span>Reference = 100</span>
            <span>More (log scale)</span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-hairline pt-5 sm:grid-cols-4">
            <Factor label="Carat" value={`×${result.carat.toFixed(2)}`} />
            <Factor label="Colour" value={`×${result.color.toFixed(2)}`} />
            <Factor label="Clarity" value={`×${result.clarity.toFixed(2)}`} />
            <Factor label="Cut" value={round ? `×${result.cut.toFixed(2)}` : "n/a"} />
          </dl>

          <p className="mt-5 text-[12px] leading-relaxed text-ink-muted-panel">
            Educational, not a quote. The index models how natural diamond prices typically move with
            each C, relative to a 1.00 ct, G, VS2, Excellent round (100).
            {state.origin === "lab"
              ? " Lab-grown prices follow a similar pattern but at a far lower level and a much flatter curve between grades."
              : ""}{" "}
            Fluorescence, proportions and the market all move real prices.
          </p>
        </section>

        <Tips state={state} spec={spec} />

        <Rarity cube={cube[state.origin]} state={state} spec={spec} onShowLab={() => set({ origin: "lab" })} />

        <SizeCompare shape={state.shape} carat={state.carat} />

        <Link
          href={`/contact?${new URLSearchParams({
            shape: state.shape,
            carat: state.carat.toFixed(2),
            color: state.color,
            clarity: state.clarity,
            ...(spec.cut ? { cut: spec.cut } : {}),
          })}#enquiry`}
          className="block rounded-full bg-ink px-6 py-3 text-center text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          Ask for a real quote on this specification
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ controls */

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-[13px] text-ink-muted">{label}</p>
      <div role="group" aria-label={label} className="mt-1.5 flex rounded-input border border-hairline p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`flex-1 rounded-[8px] px-3 py-1.5 text-[14px] transition-colors duration-200 ${
              value === o.value ? "bg-ink text-white" : "hover:bg-panel"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CaratSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const id = useId();
  const pos = (c: number) => ((c - CARAT_MIN) / (CARAT_MAX - CARAT_MIN)) * 100;
  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] text-ink-muted">
          Carat{" "}
          <Link href="/carat-guide" className="underline underline-offset-4 hover:text-ink">
            guide
          </Link>
        </label>
        <input
          type="number"
          aria-label="Carat weight"
          min={CARAT_MIN}
          max={CARAT_MAX}
          step={0.01}
          value={value.toFixed(2)}
          onChange={(e) => {
            const n = Number.parseFloat(e.target.value);
            if (Number.isFinite(n)) onChange(Math.min(CARAT_MAX, Math.max(CARAT_MIN, n)));
          }}
          className="w-24 rounded-input border border-hairline bg-porcelain px-2 py-1 text-right font-display text-[22px] tabular-nums"
        />
      </div>
      <input
        id={id}
        type="range"
        min={CARAT_MIN}
        max={CARAT_MAX}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value.toFixed(2)} carats`}
        className="mt-3 w-full accent-ink"
      />
      {/* Milestone ticks: where the price per carat steps up. */}
      <div className="relative mt-1 h-4" aria-hidden>
        {MILESTONES.map((m) => (
          <span
            key={m}
            className={`absolute -translate-x-1/2 text-[10px] tabular-nums text-ink-muted ${m === 0.7 || m === 4 ? "max-sm:hidden" : ""}`}
            style={{ left: `${pos(m)}%` }}
          >
            {m}
          </span>
        ))}
      </div>
      <p className="mt-1 text-[12px] text-ink-muted">Ticks mark weights where prices step up.</p>
    </div>
  );
}

function StepSlider<T extends string>({
  label,
  hint,
  steps,
  value,
  onChange,
  disabled = false,
  guide,
}: {
  label: string;
  hint: string;
  steps: T[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
  guide: string;
}) {
  const id = useId();
  const index = Math.max(0, steps.indexOf(value));
  // Best grade on the right, so "further right" always means "costs more".
  const reversed = [...steps].reverse();
  const position = steps.length - 1 - index;
  return (
    <div className={`mt-8 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] text-ink-muted">
          {label}{" "}
          <Link href={guide} className="underline underline-offset-4 hover:text-ink">
            guide
          </Link>
        </label>
        <span className="font-display text-[22px] leading-none">{disabled ? "—" : value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={position}
        disabled={disabled}
        onChange={(e) => onChange(reversed[Number(e.target.value)])}
        aria-valuetext={value}
        className="mt-3 w-full accent-ink disabled:cursor-not-allowed"
      />
      <div className="mt-1 flex justify-between text-[10px] text-ink-muted" aria-hidden>
        {reversed.map((s) => (
          <span key={s} className={s === value && !disabled ? "text-ink" : undefined}>
            {s.replace("Very Good", "VG")}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-ink-muted">{hint}</p>
    </div>
  );
}

function Factor({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-ink-muted-panel">{label}</dt>
      <dd className="mt-0.5 text-[15px] tabular-nums">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------ read-outs */

/** Where the same budget, or the same look, can be had for less. */
function Tips({ state, spec }: { state: State; spec: Spec }) {
  const base = priceIndex(spec).index;
  const saving = (changes: Partial<Spec>) => priceIndex({ ...spec, ...changes }).index / base - 1;
  const tips: string[] = [];

  const milestone = [...MILESTONES].reverse().find((m) => state.carat >= m && state.carat < m + 0.1);
  if (milestone && milestone > 0.5) {
    const under = Math.round((milestone - 0.05) * 100) / 100;
    const size = (c: number) => faceUpSize(state.shape, c).width;
    const smaller = 1 - size(under) / size(state.carat);
    tips.push(
      `${state.carat === milestone ? "Right on" : "Just over"} the ${milestone.toFixed(2)} ct milestone. A ${under.toFixed(2)} ct stone comes out ${change(
        saving({ carat: under }),
      )} and is only about ${Math.max(1, Math.round(smaller * 100))}% narrower face-up, which few people can see.`,
    );
  }
  const ci = CALC_COLORS.indexOf(state.color);
  if (ci <= 2) {
    tips.push(
      `In a setting, G or H usually looks colourless to most eyes. G comes out ${change(saving({ color: "G" }))}.`,
    );
  }
  const qi = CALC_CLARITIES.indexOf(state.clarity);
  if (qi < CALC_CLARITIES.indexOf("VS2")) {
    tips.push(
      `Inclusions at VS2 are normally invisible without magnification. VS2 comes out ${change(
        saving({ clarity: "VS2" }),
      )}; ask for a video to confirm a stone is eye-clean.`,
    );
  }
  if (spec.cut && spec.cut !== "Excellent") {
    tips.push(
      `Cut does the most for sparkle. Excellent comes out ${change(saving({ cut: "Excellent" }))}, often the best-spent step.`,
    );
  }
  if (!tips.length) return null;

  return (
    <section className="rounded-[22px] border border-hairline p-6">
      <h3 className="font-display text-[22px] leading-tight">Where the money goes</h3>
      <ul className="mt-3 space-y-2.5 text-[14px] text-ink-muted">
        {tips.map((t) => (
          <li key={t} className="flex gap-2">
            <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-ink-muted" />
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Rarity({
  cube,
  state,
  spec,
  onShowLab,
}: {
  cube: Record<string, number>;
  state: State;
  spec: Spec;
  onShowLab: () => void;
}) {
  if (!Object.keys(cube).length) {
    return (
      <section className="rounded-[22px] border border-hairline p-6">
        <h3 className="font-display text-[22px] leading-tight">Rarity in our stock</h3>
        <p className="mt-3 text-[14px] text-ink-muted">
          Our natural stock is currently fancy-coloured, which sits outside the D–J scale, so there
          is nothing here to count.{" "}
          <Link href="/natural-diamonds?color=Fancy" className="underline underline-offset-4 hover:text-ink">
            See the fancy colours
          </Link>{" "}
          or{" "}
          <button type="button" onClick={onShowLab} className="underline underline-offset-4 hover:text-ink">
            count lab-grown stock instead
          </button>
          .
        </p>
      </section>
    );
  }

  const { matching, pool } = rarity(cube, spec, state.shape);
  const shape = SHAPE_BY_SLUG[state.shape].name.toLowerCase();
  const originWord = state.origin === "natural" ? "natural" : "lab-grown";
  const share = pool ? matching / pool : 0;
  const colors = CALC_COLORS.slice(0, CALC_COLORS.indexOf(state.color) + 1);
  const clarities = CALC_CLARITIES.slice(0, CALC_CLARITIES.indexOf(state.clarity) + 1);
  const href = `/${state.origin === "natural" ? "natural-diamonds" : "lab-grown-diamonds"}?${new URLSearchParams({
    shape: state.shape,
    color: colors.join(","),
    clarity: clarities.join(","),
    cmin: state.carat.toFixed(2),
  })}`;

  return (
    <section className="rounded-[22px] border border-hairline p-6">
      <h3 className="font-display text-[22px] leading-tight">Rarity in our stock</h3>
      {pool ? (
        <>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-panel" aria-hidden>
            <div className="bg-ink transition-[width] duration-300" style={{ width: `${Math.max(share * 100, matching ? 1 : 0)}%` }} />
          </div>
          <p className="mt-3 text-[14px] text-ink-muted">
            <span className="tabular-nums text-ink">{matching}</span> of our{" "}
            <span className="tabular-nums">{pool}</span> {originWord} {shape} stones (D–J) are this size
            band, colour and clarity or better
            {matching ? (
              <>
                {" "}
                — about <span className="tabular-nums text-ink">{share >= 0.1 ? `${Math.round(share * 100)}%` : `1 in ${Math.round(1 / share)}`}</span>
              </>
            ) : null}
            . Stock is a snapshot, not the whole market, but the pattern is the same: every step up
            thins the field.
          </p>
          {matching ? (
            <Link href={href} className="mt-4 inline-block text-[14px] underline underline-offset-4 hover:text-ink-muted">
              See {matching === 1 ? "this stone" : `these ${matching} stones`}
            </Link>
          ) : (
            <Link href={`/contact?${new URLSearchParams({ shape: state.shape, carat: state.carat.toFixed(2), color: state.color, clarity: state.clarity })}#enquiry`} className="mt-4 inline-block text-[14px] underline underline-offset-4 hover:text-ink-muted">
              None in stock right now. Ask us to source one
            </Link>
          )}
        </>
      ) : (
        <p className="mt-3 text-[14px] text-ink-muted">
          We have no {originWord} {shape} stones on the D–J scale in stock right now.
        </p>
      )}
    </section>
  );
}

function SizeCompare({ shape, carat }: { shape: ShapeSlug; carat: number }) {
  const [x, y, w, h] = SIZE_MODELS[shape].box;
  const geometry = SHAPE_BY_SLUG[shape].geometry;
  const items = [
    { label: "1.00 ct round", size: faceUpSize("round", 1), glyph: SHAPE_BY_SLUG.round.geometry, box: SIZE_MODELS.round.box, lit: false },
    { label: `${carat.toFixed(2)} ct ${SHAPE_BY_SLUG[shape].name.toLowerCase()}`, size: faceUpSize(shape, carat), glyph: geometry, box: [x, y, w, h] as const, lit: true },
  ];
  return (
    <section className="rounded-[22px] border border-hairline p-6">
      <h3 className="font-display text-[22px] leading-tight">Face-up size, to scale</h3>
      <div className="mt-4 flex items-end justify-around gap-4 [--mm:6px] sm:[--mm:8px]">
        {items.map((item) => (
          <figure key={item.label} className="flex flex-col items-center">
            <div
              style={{
                width: `calc(var(--mm) * ${item.size.width.toFixed(2)})`,
                height: `calc(var(--mm) * ${item.size.length.toFixed(2)})`,
              }}
            >
              <ShapeGlyph
                geometry={item.glyph}
                frozen={!item.lit}
                lit={item.lit}
                viewBox={item.box.join(" ")}
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
              />
            </div>
            <figcaption className="mt-3 text-center text-[12px] text-ink-muted">
              {item.label}
              <span className="block tabular-nums text-ink">{formatFaceUp(item.size)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-[12px] text-ink-muted">Approximate, at typical proportions.</p>
    </section>
  );
}
