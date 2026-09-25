"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  DIAMETER_MAX,
  DIAMETER_MIN,
  ORDER_SIZES,
  circumferenceForUk,
  formatUs,
  sizeFromCircumference,
  sizeFromDiameter,
  sizeFromUs,
  type RingSize,
} from "@/lib/ring-sizes";

/** ISO/IEC 7810 ID-1: every bank card's short edge. */
const CARD_SHORT_MM = 53.98;
const CARD_LONG_MM = 85.6;
const CALIBRATION_KEY = "isg:px-per-mm";
/** CSS defines 96px per inch; real screens rarely honour it, hence calibration. */
const CSS_PX_PER_MM = 96 / 25.4;

type Method = "ring" | "finger" | "convert";

const METHODS: { id: Method; label: string }[] = [
  { id: "ring", label: "Measure a ring you own" },
  { id: "finger", label: "Measure your finger" },
  { id: "convert", label: "Convert a size" },
];

function readCalibration(): number | null {
  try {
    const n = Number(window.localStorage.getItem(CALIBRATION_KEY));
    return n > 1 && n < 30 ? n : null;
  } catch {
    return null;
  }
}

export function RingSizer() {
  const [method, setMethod] = useState<Method>("ring");
  const [result, setResult] = useState<RingSize | null>(null);

  return (
    <div className="rounded-panel border border-hairline bg-porcelain p-6 sm:p-10">
      <div role="tablist" aria-label="Sizing method" className="flex flex-wrap gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            id={`sizer-tab-${m.id}`}
            aria-selected={method === m.id}
            aria-controls={`sizer-panel-${m.id}`}
            onClick={() => {
              setMethod(m.id);
              setResult(null);
            }}
            className={`rounded-full border px-4 py-2 text-[14px] transition-colors duration-200 ${
              method === m.id ? "border-ink bg-ink text-white" : "border-hairline hover:border-ink"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        <div role="tabpanel" id={`sizer-panel-${method}`} aria-labelledby={`sizer-tab-${method}`}>
          {method === "ring" ? <RingMethod onResult={setResult} /> : null}
          {method === "finger" ? <FingerMethod onResult={setResult} /> : null}
          {method === "convert" ? <ConvertMethod onResult={setResult} /> : null}
        </div>
        <SizeResult size={result} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ ring on screen */

function RingMethod({ onResult }: { onResult: (s: RingSize | null) => void }) {
  const [pxPerMm, setPxPerMm] = useState<number | null>(null);
  const [calibrating, setCalibrating] = useState(false);
  const [draft, setDraft] = useState(CSS_PX_PER_MM);
  const [diameter, setDiameter] = useState(17.3);
  const sliderId = useId();

  useEffect(() => {
    const saved = readCalibration();
    setPxPerMm(saved);
    setCalibrating(saved === null);
    if (saved) setDraft(saved);
  }, []);

  useEffect(() => {
    onResult(pxPerMm && !calibrating ? sizeFromDiameter(diameter) : null);
  }, [pxPerMm, calibrating, diameter, onResult]);

  if (calibrating) {
    return (
      <div>
        <h3 className="font-display text-[26px] leading-tight">Step 1: match your screen</h3>
        <p className="measure mt-2 text-[15px] text-ink-muted">
          Screens differ in size, so hold any bank or ID card upright against the screen and move
          the slider until the box is exactly as wide as the card&apos;s short edge. Any standard card
          works; nothing is read from it.
        </p>
        <div className="mt-6 flex justify-center">
          <div
            aria-hidden
            className="rounded-[10px] border border-dashed border-ink bg-panel"
            style={{ width: draft * CARD_SHORT_MM, height: draft * CARD_LONG_MM }}
          />
        </div>
        <label className="mt-6 block text-[13px] text-ink-muted" htmlFor={`${sliderId}-cal`}>
          Box width
        </label>
        <input
          id={`${sliderId}-cal`}
          type="range"
          min={2}
          max={12}
          step={0.01}
          value={draft}
          onChange={(e) => setDraft(Number(e.target.value))}
          className="mt-2 w-full accent-ink"
        />
        <button
          type="button"
          onClick={() => {
            try {
              window.localStorage.setItem(CALIBRATION_KEY, String(draft));
            } catch {
              // Calibration still applies for this visit.
            }
            setPxPerMm(draft);
            setCalibrating(false);
          }}
          className="mt-6 rounded-full bg-ink px-6 py-2.5 text-[14px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          The box matches my card
        </button>
      </div>
    );
  }

  if (!pxPerMm) return null;
  const px = diameter * pxPerMm;

  return (
    <div>
      <h3 className="font-display text-[26px] leading-tight">Step 2: match your ring</h3>
      <p className="measure mt-2 text-[15px] text-ink-muted">
        Lay a ring that fits the intended finger flat on the circle and adjust the slider until the
        circle meets the <em>inside</em> edge of the band, with no screen showing through.
      </p>
      <div className="mt-6 flex h-[220px] items-center justify-center rounded-[16px] bg-panel">
        <div
          aria-hidden
          className="rounded-full border-2 border-ink"
          style={{ width: px, height: px }}
        />
      </div>
      <label className="mt-6 flex justify-between text-[13px] text-ink-muted" htmlFor={sliderId}>
        <span>Inside diameter</span>
        <span className="tabular-nums text-ink">{diameter.toFixed(1)} mm</span>
      </label>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          aria-label="Smaller by 0.1 mm"
          onClick={() => setDiameter((d) => Math.max(DIAMETER_MIN, +(d - 0.1).toFixed(1)))}
          className="h-9 w-9 shrink-0 rounded-full border border-hairline text-[18px] hover:border-ink"
        >
          −
        </button>
        <input
          id={sliderId}
          type="range"
          min={DIAMETER_MIN}
          max={DIAMETER_MAX}
          step={0.1}
          value={diameter}
          onChange={(e) => setDiameter(Number(e.target.value))}
          className="w-full accent-ink"
        />
        <button
          type="button"
          aria-label="Larger by 0.1 mm"
          onClick={() => setDiameter((d) => Math.min(DIAMETER_MAX, +(d + 0.1).toFixed(1)))}
          className="h-9 w-9 shrink-0 rounded-full border border-hairline text-[18px] hover:border-ink"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => setCalibrating(true)}
        className="mt-5 text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        Recalibrate screen
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ string / paper */

function FingerMethod({ onResult }: { onResult: (s: RingSize | null) => void }) {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"mm" | "in">("mm");
  const inputId = useId();

  useEffect(() => {
    const n = Number.parseFloat(value);
    const mm = unit === "in" ? n * 25.4 : n;
    // 40–75 mm covers every size on the chart with room either side.
    onResult(Number.isFinite(mm) && mm >= 40 && mm <= 75 ? sizeFromCircumference(mm) : null);
  }, [value, unit, onResult]);

  return (
    <div>
      <h3 className="font-display text-[26px] leading-tight">String or paper method</h3>
      <ol className="measure mt-3 list-decimal space-y-1.5 pl-5 text-[15px] text-ink-muted marker:text-ink-muted">
        <li>Wrap a strip of paper or non-stretch string around the base of the finger.</li>
        <li>It should be snug but still slide over the knuckle. Mark where it overlaps.</li>
        <li>Lay it flat against a ruler and measure to the mark.</li>
        <li>Measure two or three times, at the end of the day when fingers are largest.</li>
      </ol>
      <label htmlFor={inputId} className="mt-6 block text-[13px] text-ink-muted">
        Measured length
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          min={unit === "mm" ? 40 : 1.6}
          max={unit === "mm" ? 75 : 3}
          step={unit === "mm" ? 0.5 : 0.02}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={unit === "mm" ? "e.g. 54" : "e.g. 2.14"}
          className="w-full rounded-input border border-hairline bg-porcelain px-4 py-2.5 text-[15px] tabular-nums focus:border-ink"
        />
        <div role="group" aria-label="Unit" className="flex shrink-0 rounded-input border border-hairline p-1">
          {(["mm", "in"] as const).map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className={`rounded-[8px] px-3 text-[14px] ${unit === u ? "bg-ink text-white" : ""}`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[13px] text-ink-muted">
        String can stretch and paper can slip, so treat this as a guide. If you land between two
        sizes, take the larger.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ conversion */

const SYSTEMS = [
  { id: "us", label: "US / Canada" },
  { id: "uk", label: "UK / Australia" },
  { id: "eu", label: "Europe (ISO)" },
] as const;

type System = (typeof SYSTEMS)[number]["id"];

/**
 * Option values: a US size for the US list, otherwise the size's own
 * circumference, so a UK letter or ISO size reports its exact measurements
 * rather than those of the nearest US quarter size.
 */
const optionsFor = (system: System): { value: string; label: string }[] => {
  const all = ORDER_SIZES.map((us) => sizeFromUs(us));
  if (system === "us") return all.map((s) => ({ value: String(s.us), label: formatUs(s.us) }));
  // Several quarter sizes share a letter or a whole-mm ISO size; list each once.
  const labels = [...new Set(all.map((s) => (system === "uk" ? s.uk : String(s.eu))))];
  return labels.map((label) => ({
    label,
    value: String(system === "uk" ? circumferenceForUk(label) : Number(label)),
  }));
};

function ConvertMethod({ onResult }: { onResult: (s: RingSize | null) => void }) {
  const [system, setSystem] = useState<System>("uk");
  const [value, setValue] = useState("");
  const selectId = useId();

  useEffect(() => {
    const n = Number(value);
    if (!value || !Number.isFinite(n)) onResult(null);
    else onResult(system === "us" ? sizeFromUs(n) : sizeFromCircumference(n));
  }, [system, value, onResult]);

  return (
    <div>
      <h3 className="font-display text-[26px] leading-tight">Already know a size?</h3>
      <p className="measure mt-2 text-[15px] text-ink-muted">
        Choose the system your size is in to see it in the others and in millimetres.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={system === s.id}
            onClick={() => {
              setSystem(s.id);
              setValue("");
            }}
            className={`rounded-full border px-4 py-1.5 text-[14px] ${
              system === s.id ? "border-ink" : "border-hairline hover:border-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <label htmlFor={selectId} className="mt-6 block text-[13px] text-ink-muted">
        Size
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full rounded-input border border-hairline bg-porcelain px-4 py-2.5 text-[15px]"
      >
        <option value="">Select a size</option>
        {optionsFor(system).map((o) => (
          <option key={o.label} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------ result */

function SizeResult({ size }: { size: RingSize | null }) {
  return (
    <aside
      aria-live="polite"
      className="h-fit rounded-[22px] bg-panel p-6 sm:p-8 lg:sticky lg:top-[96px]"
    >
      <p className="text-[13px] text-ink-muted-panel">Your size</p>
      {size ? (
        <>
          <p className="mt-2 font-display text-[56px] leading-none">
            US {formatUs(size.us)}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-hairline pt-5">
            <Row label="UK / Australia" value={size.uk} />
            <Row label="Europe (ISO)" value={String(size.eu)} />
            <Row label="Inside diameter" value={`${size.diameter.toFixed(1)} mm`} />
            <Row label="Circumference" value={`${size.circumference.toFixed(1)} mm`} />
          </dl>
          <Link
            href={`/build-a-ring?size=${size.us}`}
            className="mt-6 block rounded-full bg-ink px-6 py-2.5 text-center text-[14px] text-white transition-opacity duration-200 hover:opacity-85"
          >
            Build a ring in this size
          </Link>
          <p className="mt-3 text-[12px] text-ink-muted-panel">
            We confirm the size with you before anything is made.
          </p>
        </>
      ) : (
        <p className="mt-3 text-[15px] text-ink-muted-panel">
          Follow the steps and your size appears here, in every system.
        </p>
      )}
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] text-ink-muted-panel">{label}</dt>
      <dd className="mt-0.5 text-[16px] tabular-nums">{value}</dd>
    </div>
  );
}
