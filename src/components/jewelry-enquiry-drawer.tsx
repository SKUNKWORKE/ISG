"use client";

import Image from "next/image";
import { EnquiryActions, EnquiryDialog, EnquiryRow as Row } from "./enquiry-dialog";
import { jewelMailtoHref, jewelWhatsappHref } from "@/lib/contact";
import { jewelDescriptor, jewelSpecs, originWord, type JewelSummary } from "@/lib/jewelry";

const WIDE = new Set(["Ring size", "Certificate"]);

export function JewelryEnquiryDrawer({
  jewel,
  onClose,
}: {
  jewel: JewelSummary | null;
  onClose: () => void;
}) {
  const cover = jewel?.images[0];

  return (
    <EnquiryDialog open={Boolean(jewel)} reference={jewel?.sku ?? ""} onClose={onClose}>
      {jewel ? (
        <>
          <h2 id="enquiry-title" className="font-display text-[32px] leading-tight">
            {jewel.name}
          </h2>
          <p className="mt-1.5 text-[15px] text-ink-muted">
            {jewel.carat.toFixed(2)} ct total
            {jewel.color ? `, ${jewel.color} colour` : ""}
            {jewel.clarity ? `, ${jewel.clarity} clarity` : ""}, {originWord(jewel)}
          </p>

          {cover ? (
            <div className="relative mx-auto mt-6 aspect-square w-1/2 overflow-hidden rounded-[22px] border border-hairline bg-panel">
              <Image
                src={cover.src}
                alt={cover.alt || jewel.name}
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
          ) : null}

          <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-hairline pt-6">
            {jewelSpecs(jewel).map(([label, value]) => (
              <Row key={label} label={label} value={value} wide={WIDE.has(label)} />
            ))}
          </dl>

          <EnquiryActions
            heading="Enquire on this piece"
            whatsapp={jewelWhatsappHref(jewel)}
            mailto={jewelMailtoHref(jewel)}
            reference={`${jewel.sku} (${jewelDescriptor(jewel)})`}
          />
        </>
      ) : null}
    </EnquiryDialog>
  );
}
