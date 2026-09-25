import type { Metadata } from "next";
import { SeasonalLanding } from "@/components/seasonal-landing";
import { occasion, seasonalMetadata } from "@/lib/seasonal";

export const metadata: Metadata = seasonalMetadata("us", "mothers-day");

// The occasion's date is resolved when the page renders, so movable feasts and
// "next occurrence" stay correct without anyone editing a year into the copy.
export const revalidate = 86400;

export default function Page() {
  return <SeasonalLanding occasion={occasion("us", "mothers-day")} />;
}
