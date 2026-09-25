import type { Metadata } from "next";
import Link from "next/link";
import { JewelryCatalog } from "@/components/jewelry-catalog";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, collectionPage } from "@/lib/structured-data";
import { toQueryString } from "@/lib/catalog-filter";
import { JEWELRY_SUMMARIES } from "@/lib/real-jewelry";
import { INVENTORY_NOTICE } from "@/lib/stones";

const DESCRIPTION =
  "Diamond rings, earrings, bracelets and necklaces in 9K to 18K yellow, white and rose gold. Filter by type, shape, carat, centre stone, metal and purity, then enquire on any piece.";

export const metadata: Metadata = {
  title: "Diamond jewelry",
  description: DESCRIPTION,
  alternates: { canonical: "/jewelry" },
};

export default async function JewelryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initialQuery = toQueryString(await searchParams);

  const jsonLd = [
    collectionPage({
      name: "Diamond jewelry",
      description: DESCRIPTION,
      path: "/jewelry",
      total: JEWELRY_SUMMARIES.length,
      items: JEWELRY_SUMMARIES.map((j) => ({ path: `/jewelry/${j.sku}`, name: j.name })),
    }),
    breadcrumbs([{ name: "Diamond jewelry", path: "/jewelry" }]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
          <h1 className="max-w-[880px] font-display text-[clamp(2.4rem,5.6vw,4.2rem)]">
            Diamond jewelry
          </h1>
          <p className="measure mt-5 text-ink-muted">
            Rings, earrings, bracelets and necklaces, each set with matched diamonds and made to
            order in solid gold. Filter down to the piece you need and enquire — we will send
            photographs, the certificate and a quote in the metal and purity you choose.
          </p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            <Link href="/build-a-ring" className="underline underline-offset-4 hover:text-ink-muted">
              Build a ring with your own stone
            </Link>
            <Link href="/ring-size-guide" className="underline underline-offset-4 hover:text-ink-muted">
              Ring size guide
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16">
        <JewelryCatalog
          items={JEWELRY_SUMMARIES}
          initialQuery={initialQuery}
          notice={INVENTORY_NOTICE}
        />
      </section>
    </>
  );
}
