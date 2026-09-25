import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JewelryGallery } from "@/components/jewelry-gallery";
import { JewelryEnquireButton } from "@/components/jewelry-enquire-button";
import {
  CATEGORY_NAME,
  CATEGORY_PLURAL,
  jewelSpecs,
  metalsLine,
  originWord,
  toSummary,
  type Jewel,
} from "@/lib/jewelry";
import { ALL_JEWELRY, findJewel } from "@/lib/real-jewelry";
import { isSettingDesign } from "@/lib/ring-builder";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs } from "@/lib/structured-data";
import { SITE_URL as BASE } from "@/lib/stone-specs";

type Props = { params: Promise<{ sku: string }> };

function jewelFor(sku: string): Jewel {
  const jewel = findJewel(sku);
  if (!jewel) notFound();
  return jewel;
}

export function generateStaticParams() {
  return ALL_JEWELRY.map((jewel) => ({ sku: jewel.sku }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const jewel = jewelFor((await params).sku);
  const cover = jewel.images[0];
  return {
    title: jewel.name,
    description: `${CATEGORY_NAME[jewel.category]} set with ${jewel.carat.toFixed(2)} carats of ${originWord(jewel)} diamonds, made in ${metalsLine(jewel).toLowerCase()} (${jewel.purities.join(", ")}). SKU ${jewel.sku}. Price on enquiry.`,
    alternates: { canonical: `/jewelry/${jewel.sku}` },
    openGraph: cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height }] } : undefined,
  };
}

export default async function JewelPage({ params }: Props) {
  const jewel = jewelFor((await params).sku);
  const summary = toSummary(jewel);
  const specs = jewelSpecs(summary);

  // No Offer: pricing is enquiry-only by design; see lib/structured-data.ts.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${BASE}/jewelry/${jewel.sku}#product`,
      name: jewel.name,
      sku: jewel.sku,
      mpn: jewel.sku,
      url: `${BASE}/jewelry/${jewel.sku}`,
      mainEntityOfPage: `${BASE}/jewelry/${jewel.sku}`,
      image: jewel.images.slice(0, 6).map((img) => `${BASE}${img.src}`),
      category: `Diamond jewelry > ${CATEGORY_PLURAL[jewel.category]}`,
      material: `${metalsLine(jewel)}, ${originWord(jewel)} diamond`,
      description: `${jewel.name}. ${jewel.carat.toFixed(2)} carats total weight, ${originWord(jewel)} diamonds.`,
      weight: { "@type": "QuantitativeValue", value: jewel.carat, unitCode: "CTM" },
      additionalProperty: specs.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
    },
    breadcrumbs([
      { name: "Diamond jewelry", path: "/jewelry" },
      { name: `Diamond ${CATEGORY_PLURAL[jewel.category].toLowerCase()}`, path: `/jewelry?type=${jewel.category}` },
      { name: jewel.name, path: `/jewelry/${jewel.sku}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="mx-auto w-full max-w-[520px] lg:sticky lg:top-[96px] lg:h-fit">
          <JewelryGallery images={jewel.images} name={jewel.name} shape={jewel.shapes[0] ?? "round"} />
        </div>

        <div>
          <Link
            href={`/jewelry?type=${jewel.category}`}
            className="text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
          >
            Diamond {CATEGORY_PLURAL[jewel.category].toLowerCase()}
          </Link>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">
            {jewel.name}
          </h1>
          <p className="mt-3 text-ink-muted">
            {jewel.carat.toFixed(2)} ct total
            {jewel.color ? `, ${jewel.color} colour` : ""}
            {jewel.clarity ? `, ${jewel.clarity} clarity` : ""}, {originWord(jewel)}
          </p>
          <p className="mt-2 text-[13px] tabular-nums text-ink-muted">SKU {jewel.sku}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-hairline pt-6 sm:grid-cols-3">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className={label === "Ring size" || label === "Certificate" ? "col-span-2" : undefined}
              >
                <dt className="text-[12px] text-ink-muted">{label}</dt>
                <dd className="mt-0.5 text-[15px]">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 max-w-[420px]">
            <JewelryEnquireButton jewel={summary} />
            {isSettingDesign(jewel) ? (
              <Link
                href={`/build-a-ring?setting=${encodeURIComponent(jewel.sku)}`}
                className="mt-3 block w-full rounded-full border border-hairline px-7 py-3 text-center text-[15px] transition-colors duration-200 hover:border-ink"
              >
                Use this design with your own stone
              </Link>
            ) : null}
            <p className="mt-3 text-[13px] text-ink-muted">
              Price, lead time and the diamond certificate are confirmed on enquiry.
              {jewel.category === "ring" ? (
                <>
                  {" "}
                  <Link href="/ring-size-guide" className="underline underline-offset-4 hover:text-ink">
                    Find your ring size
                  </Link>
                  .
                </>
              ) : null}
            </p>
            <a
              href={`/jewelry/${encodeURIComponent(jewel.sku)}/spec-sheet`}
              download
              className="mt-2 inline-block text-[13px] text-ink-muted underline underline-offset-4 transition-colors duration-200 hover:text-ink"
            >
              Download spec sheet (PDF)
            </a>
          </div>

          {jewel.sections.length ? (
            <div className="mt-14 border-t border-hairline pt-8">
              <h2 className="font-display text-3xl">Full specification</h2>
              {jewel.sections.map((section, s) => (
                <section key={`${section.title}-${s}`} className="mt-8">
                  <h3 className="text-[13px] text-ink-muted">{section.title}</h3>
                  {section.rows.length ? (
                    <dl className="mt-3 divide-y divide-hairline border-y border-hairline">
                      {section.rows.map(([label, value], i) => (
                        <div
                          key={`${label}-${i}`}
                          className="grid gap-1 py-2.5 text-[14px] sm:grid-cols-[200px_1fr] sm:gap-6"
                        >
                          <dt className="text-ink-muted">{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {section.notes.length ? (
                    <ul className="measure mt-3 list-disc space-y-1.5 pl-5 text-[14px] marker:text-metal">
                      {section.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          ) : null}

          {jewel.shapes[0] ? (
            <p className="mt-10 border-t border-hairline pt-6 text-[14px] text-ink-muted">
              Choosing a loose stone instead?{" "}
              <Link
                href={`/shapes/${jewel.shapes[0]}`}
                className="underline underline-offset-4 transition-colors duration-200 hover:text-ink"
              >
                What to look for in this shape
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
