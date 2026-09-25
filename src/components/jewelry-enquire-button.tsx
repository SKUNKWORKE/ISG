"use client";

import { useState } from "react";
import { JewelryEnquiryDrawer } from "./jewelry-enquiry-drawer";
import type { JewelSummary } from "@/lib/jewelry";

export function JewelryEnquireButton({ jewel }: { jewel: JewelSummary }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
      >
        Enquire on this piece
      </button>
      <JewelryEnquiryDrawer jewel={open ? jewel : null} onClose={() => setOpen(false)} />
    </>
  );
}
