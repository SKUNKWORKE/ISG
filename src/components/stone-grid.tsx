"use client";

import { useState } from "react";
import { StoneCard } from "./stone-card";
import { EnquiryDrawer } from "./enquiry-drawer";
import type { Stone } from "@/lib/stones";

/** Renders stones and owns the one enquiry drawer they all open. */
export function StoneGrid({ stones, className }: { stones: Stone[]; className?: string }) {
  const [active, setActive] = useState<Stone | null>(null);

  return (
    <>
      <div
        className={
          className ??
          "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {stones.map((stone) => (
          <StoneCard key={stone.sku} stone={stone} onEnquire={setActive} />
        ))}
      </div>

      <EnquiryDrawer stone={active} onClose={() => setActive(null)} />
    </>
  );
}
