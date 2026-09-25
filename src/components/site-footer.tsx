import Link from "next/link";
import { FooterUpdates } from "./footer-updates";
import { PaymentBadge } from "./payment-badge";
import { ShapeGlyph } from "./shape-glyph";
import { GLYPHS } from "@/lib/glyphs";
import { SALES_EMAIL, SALES_PHONE, SALES_PHONE_ALT, generalWhatsappHref } from "@/lib/contact";

const COLUMNS = [
  {
    heading: "Diamonds",
    links: [
      { href: "/natural-diamonds", label: "Natural diamonds" },
      { href: "/lab-grown-diamonds", label: "Lab-grown diamonds" },
      { href: "/jewelry", label: "Diamond jewelry" },
      { href: "/build-a-ring", label: "Build a ring" },
      { href: "/shapes", label: "Shapes" },
      { href: "/carat-guide", label: "Carat guide" },
      { href: "/color-guide", label: "Colour guide" },
      { href: "/cut-guide", label: "Cut guide" },
      { href: "/clarity-guide", label: "Clarity guide" },
      { href: "/ring-size-guide", label: "Ring size guide" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/guides", label: "Buying guides" },
      { href: "/diamond-4cs-calculator", label: "4Cs calculator" },
      { href: "/glossary", label: "Glossary" },
      { href: "/craftsmanship", label: "Craftsmanship" },
      { href: "/insights", label: "Market insights" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-panel">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <ShapeGlyph
                geometry={GLYPHS.radiant}
                frozen
                className="h-8 w-8 [&_.glyph-facet]:stroke-metal [&_.glyph-outline]:stroke-ink"
              />
              <span className="font-display text-[22px] leading-none">Imperial Star Gems</span>
            </div>
            <p className="measure mt-5 text-[15px] text-ink-muted-panel">
              Loose natural and lab-grown diamonds, supplied to trade and private buyers. Every
              stone is sold individually and graded by an independent laboratory.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-display text-lg">{col.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-ink-muted-panel underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="font-display text-lg">Enquiries</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <a
                  href={`mailto:${SALES_EMAIL}`}
                  className="text-ink-muted-panel underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
                >
                  {SALES_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SALES_PHONE.replace(/\s/g, "")}`}
                  className="text-ink-muted-panel underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
                >
                  {SALES_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SALES_PHONE_ALT.replace(/\s/g, "")}`}
                  className="text-ink-muted-panel underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
                >
                  {SALES_PHONE_ALT}
                </a>
              </li>
              <li>
                <a
                  href={generalWhatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-muted-panel underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
                >
                  WhatsApp
                </a>
              </li>
              <li className="pt-2">
                <PaymentBadge />
              </li>
            </ul>
          </div>
        </div>

        <FooterUpdates />

        <div className="mt-16 flex flex-col gap-3 border-t border-hairline pt-7 text-[13px] text-ink-muted-panel sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Imperial Star Gems. All rights reserved.</p>
          <p>Grading by GIA and IGI. Prices quoted on enquiry.</p>
        </div>
      </div>
    </footer>
  );
}
