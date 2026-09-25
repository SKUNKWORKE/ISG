import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { ShapeGlyph } from "@/components/shape-glyph";
import { GLYPHS } from "@/lib/glyphs";
import { SHAPES } from "@/lib/shapes";
import { CUT_GRADES } from "@/lib/stones";
import { FULL_SCALE } from "@/lib/clarity-grades";
import { SALES_EMAIL, SALES_PHONE, SALES_PHONE_ALT, generalWhatsappHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Enquire about loose natural or lab-grown diamonds. Reach Imperial Star Gems by email, phone or WhatsApp, or send a specification and we will source to it.",
};

type SpecParams = {
  shape?: string | string[];
  carat?: string | string[];
  color?: string | string[];
  cut?: string | string[];
  clarity?: string | string[];
};

/**
 * "?shape=oval&carat=1.50&color=F" from the carat and colour guides becomes a
 * pre-written message. Any subset works; anything unrecognised is ignored.
 */
function specificationFor(params: SpecParams) {
  const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const shape = SHAPES.find((s) => s.slug === first(params.shape));
  const weight = Number.parseFloat(first(params.carat) ?? "");
  const carat = Number.isFinite(weight) && weight > 0 && weight <= 30 ? weight : undefined;
  const letter = first(params.color)?.trim().toUpperCase();
  const color = letter && /^[D-Z]$/.test(letter) ? letter : undefined;
  const cutParam = first(params.cut)?.trim().toLowerCase();
  const cut = CUT_GRADES.find((g) => g.toLowerCase() === cutParam);
  const clarityParam = first(params.clarity)?.trim().toUpperCase();
  const clarity = FULL_SCALE.find((g) => g === clarityParam);
  if (!shape && carat === undefined && !color && !cut && !clarity) return undefined;

  const label = [
    [shape?.name, carat !== undefined ? `${carat.toFixed(2)} ct` : undefined].filter(Boolean).join(" "),
    color ? `${color} colour` : undefined,
    cut ? `${cut} cut` : undefined,
    clarity ? `${clarity} clarity` : undefined,
  ]
    .filter(Boolean)
    .join(", ");
  const subject = shape
    ? `${/^[aeiou]/i.test(shape.name) ? "an" : "a"} ${shape.name.toLowerCase()} diamond`
    : "a diamond";
  const detail = [
    carat !== undefined ? `about ${carat.toFixed(2)} ct` : "",
    color ? `${color} colour` : "",
    cut ? `${cut} cut` : "",
    clarity ? `${clarity} clarity` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    label,
    message: `Hi, I'm looking for ${subject}${detail ? `, ${detail}` : ""}. Please share what you have available, with reports.`,
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SpecParams>;
}) {
  const specification = specificationFor(await searchParams);

  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Tell us what you are looking for
          </h1>
          <p className="measure mt-5 text-ink-muted">
            A shape, a weight range and the grades you are working to is enough to start. If you
            already have a SKU from the catalogue, include it and we will send the report and
            images straight back.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
          <div id="enquiry" className="scroll-mt-[96px]">
            <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)]">
              {specification ? `Enquire about ${specification.label}` : "Send an enquiry"}
            </h2>
            <p className="measure mt-3 text-[15px] text-ink-muted">
              We answer every enquiry ourselves, usually within one working day.
            </p>
            <div className="mt-8 max-w-[640px]">
              <EnquiryForm defaultMessage={specification?.message} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-[96px] lg:h-fit">
            <div className="rounded-[36px] border border-hairline bg-panel p-8">
              <ShapeGlyph
                geometry={GLYPHS.round}
                frozen
                className="h-10 w-10 [&_.glyph-facet]:stroke-metal [&_.glyph-outline]:stroke-ink"
              />
              <h2 className="mt-6 font-display text-[26px] leading-tight">Reach us directly</h2>
              <p className="measure mt-3 text-[14px] text-ink-muted-panel">
                For anything time-sensitive, WhatsApp reaches us quickest.
              </p>

              <dl className="mt-7 space-y-5 border-t border-hairline pt-6">
                <div>
                  <dt className="text-[12px] text-ink-muted-panel">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${SALES_EMAIL}`}
                      className="text-[15px] underline-offset-4 hover:underline"
                    >
                      {SALES_EMAIL}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[12px] text-ink-muted-panel">Telephone</dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${SALES_PHONE.replace(/\s/g, "")}`}
                      className="text-[15px] tabular-nums underline-offset-4 hover:underline"
                    >
                      {SALES_PHONE}
                    </a>
                  </dd>
                  <dd className="mt-1">
                    <a
                      href={`tel:${SALES_PHONE_ALT.replace(/\s/g, "")}`}
                      className="text-[15px] tabular-nums underline-offset-4 hover:underline"
                    >
                      {SALES_PHONE_ALT}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[12px] text-ink-muted-panel">Hours</dt>
                  <dd className="mt-1 text-[15px]">Monday to Saturday, 10:00 to 19:00 IST</dd>
                </div>
              </dl>

              <a
                href={generalWhatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block rounded-full bg-ink px-6 py-3 text-center text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
              >
                Open WhatsApp
              </a>
            </div>

            <div className="mt-5 rounded-[22px] border border-hairline p-6">
              <h3 className="font-display text-lg">Trade accounts</h3>
              <p className="mt-2 text-[14px] text-ink-muted">
                Memo terms, parcel enquiries and standing requirements are handled separately.
                Mention your company in the message and we will route it accordingly.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
