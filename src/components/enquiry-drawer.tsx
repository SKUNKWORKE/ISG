"use client";

import { StoneModel } from "./stone-model";
import { EnquiryActions, EnquiryDialog, EnquiryRow as Row } from "./enquiry-dialog";
import type { Stone } from "@/lib/stones";
import { mailtoHref, stoneDescriptor, whatsappHref } from "@/lib/contact";

export function EnquiryDrawer({ stone, onClose }: { stone: Stone | null; onClose: () => void }) {
  return (
    <EnquiryDialog open={Boolean(stone)} reference={stone?.sku ?? ""} onClose={onClose}>
      {stone ? (
        <>
          <h2 id="enquiry-title" className="font-display text-[32px] leading-tight">
            {stone.shapeName} {stone.carat.toFixed(2)} ct
          </h2>
          <p className="mt-1.5 text-[15px] text-ink-muted">
            {stone.color} colour, {stone.clarity} clarity,{" "}
            {stone.origin === "natural" ? "natural" : "lab-grown"}
          </p>

          <div className="mx-auto mt-6 w-1/2">
            <StoneModel
              stone={stone}
              label={`the ${stone.shapeName} ${stone.carat.toFixed(2)} carat diamond`}
            />
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-hairline pt-6">
            <Row label="Shape" value={stone.shapeName} />
            <Row label="Carat" value={stone.carat.toFixed(2)} />
            <Row label="Colour" value={stone.color} />
            <Row label="Clarity" value={stone.clarity} />
            {stone.cut ? <Row label="Cut" value={stone.cut} /> : null}
            <Row label="Polish" value={stone.polish} />
            <Row label="Symmetry" value={stone.symmetry} />
            <Row label="Fluorescence" value={stone.fluorescence} />
            <Row label="Table" value={`${stone.tablePercent}%`} />
            <Row label="Depth" value={`${stone.depthPercent}%`} />
            <Row label="Measurements" value={stone.measurements} wide />
            <Row
              label="Certificate"
              value={`${stone.lab}. Report number supplied on enquiry.`}
              wide
            />
          </dl>

          <EnquiryActions
            heading="Enquire on this stone"
            whatsapp={whatsappHref(stone)}
            mailto={mailtoHref(stone)}
            reference={`${stone.sku} (${stoneDescriptor(stone)})`}
          />
        </>
      ) : null}
    </EnquiryDialog>
  );
}
