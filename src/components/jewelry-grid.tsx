"use client";

import { useState } from "react";
import { JewelryCard } from "./jewelry-card";
import { JewelryEnquiryDrawer } from "./jewelry-enquiry-drawer";
import type { JewelSummary } from "@/lib/jewelry";

/** Renders jewelry and owns the one enquiry drawer the cards all open. */
export function JewelryGrid({ items, className }: { items: JewelSummary[]; className?: string }) {
  const [active, setActive] = useState<JewelSummary | null>(null);

  return (
    <>
      <div
        className={
          className ??
          "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {items.map((jewel) => (
          <JewelryCard key={jewel.sku} jewel={jewel} onEnquire={setActive} />
        ))}
      </div>

      <JewelryEnquiryDrawer jewel={active} onClose={() => setActive(null)} />
    </>
  );
}
