import type { Metadata } from "next";
import { ShortlistCompare } from "@/components/shortlist-compare";

export const metadata: Metadata = {
  title: "Your shortlist",
  description: "Compare shortlisted diamonds side by side and send one enquiry for all of them.",
  alternates: { canonical: "/shortlist" },
  // Per-visitor content held in the browser: nothing here for a search engine.
  robots: { index: false, follow: true },
};

export default function ShortlistPage() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20">
      <h1 className="font-display text-[clamp(2.4rem,5.6vw,4.2rem)] leading-none">
        Your shortlist
      </h1>
      <p className="measure mt-5 text-ink-muted">
        Stones side by side, specification by specification. Grades that rank better are set in
        bold. Fluorescence, table and depth are shown but not ranked, since whether they matter
        depends on the individual stone.
      </p>
      <div className="mt-10">
        <ShortlistCompare />
      </div>
    </section>
  );
}
