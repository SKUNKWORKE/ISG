"use client";

import { useId, useState } from "react";
import { generalMailtoHref, generalWhatsappHref } from "@/lib/contact";

/**
 * No submit, no backend — WhatsApp and mailto already carry the message, so
 * typing here just builds that message. The button hrefs update on every
 * keystroke; tapping one hands off straight to WhatsApp or the mail client
 * with the name, country, email and phone already in the text.
 */
export function EnquiryForm({ defaultMessage }: { defaultMessage?: string }) {
  const id = useId();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const details = [
    name.trim() ? `Name: ${name.trim()}` : undefined,
    country.trim() ? `Country: ${country.trim()}` : undefined,
    email.trim() ? `Email: ${email.trim()}` : undefined,
    phone.trim() ? `Phone: ${phone.trim()}` : undefined,
  ].filter((line): line is string => Boolean(line));

  const base = defaultMessage ?? "Hi, I'd like to enquire about loose diamonds.";
  const message = details.length ? `${base}\n\n${details.join("\n")}` : base;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${id}-name`}
          label="Name"
          value={name}
          onChange={setName}
          autoComplete="name"
        />
        <Field
          id={`${id}-country`}
          label="Country"
          value={country}
          onChange={setCountry}
          autoComplete="country-name"
        />
        <Field
          id={`${id}-email`}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <Field
          id={`${id}-phone`}
          label="Phone number"
          type="tel"
          value={phone}
          onChange={setPhone}
          autoComplete="tel"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={generalWhatsappHref(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-7 py-3 text-center text-[15px] text-white transition-opacity duration-200 hover:opacity-85"
        >
          WhatsApp
        </a>
        <a
          href={generalMailtoHref(message)}
          className="rounded-full border border-ink px-7 py-3 text-center text-[15px] transition-colors duration-200 hover:bg-ink hover:text-white"
        >
          Email
        </a>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-[12px] border border-hairline bg-porcelain px-3.5 py-2.5 text-[15px] transition-colors duration-200 focus:border-ink"
      />
    </div>
  );
}
