import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DeviceAttribute } from "@/components/device-attribute";
import { GeoFlagBadge } from "@/components/geo-flag-badge";
import { SeasonalThemeScript } from "@/components/seasonal-theme-script";
import { SeasonalThemeSync } from "@/components/seasonal-theme";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ShortlistTray } from "@/components/shortlist-tray";
import { JsonLd } from "@/components/json-ld";
import { STORE, WEBSITE } from "@/lib/structured-data";
import "./globals.css";

const displaySerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const bodySans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.imperialstargems.com"),
  title: {
    default: "Imperial Star Gems — Loose natural and lab-grown diamonds",
    template: "%s — Imperial Star Gems",
  },
  description:
    "Loose natural and lab-grown diamonds in every standard shape, supplied to trade and private buyers. Browse by shape, carat, colour and clarity, and enquire on any stone.",
  openGraph: {
    type: "website",
    siteName: "Imperial Star Gems",
    title: "Imperial Star Gems — Loose natural and lab-grown diamonds",
    description:
      "Loose natural and lab-grown diamonds in every standard shape, supplied to trade and private buyers.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displaySerif.variable} ${bodySans.variable}`}>
      <head>
        {/* Stamps data-season on <html> before the first paint. */}
        <SeasonalThemeScript />
      </head>
      <body className="bg-porcelain text-ink antialiased">
        <DeviceAttribute />
        <SeasonalThemeSync />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <JsonLd data={[STORE, WEBSITE]} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ShortlistTray />
        <GeoFlagBadge />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
