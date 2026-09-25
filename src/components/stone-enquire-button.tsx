"use client";

import { useState } from "react";
import { EnquiryDrawer } from "./enquiry-drawer";
import type { Stone } from "@/lib/stones";

export function StoneEnquireButton({ stone }: { stone: Stone }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-ink px-7 py-3 text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
      >
        Enquire on this stone
      </button>
      <EnquiryDrawer stone={open ? stone : null} onClose={() => setOpen(false)} />
    </>
  );
}
