import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The small Markdown subset articles need: ## and ### headings, paragraphs,
 * bulleted and numbered lists, > pull quotes, **bold**, *italic* and [links](/path).
 * Output is React elements, never raw HTML, so article text can't inject markup.
 */

type Block =
  | { kind: "h2" | "h3" | "p" | "quote"; text: string }
  | { kind: "ul" | "ol"; items: string[] };

const BULLET = /^[-*]\s+/;
const NUMBERED = /^\d+\.\s+/;
const QUOTE = /^>\s?/;
const HEADING = /^(#{1,3})\s+(.*)$/;

function parseBlocks(source: string): Block[] {
  const lines = source.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const collect = (pattern: RegExp) => {
    const items: string[] = [];
    while (i < lines.length && pattern.test(lines[i])) {
      items.push(lines[i].replace(pattern, "").trim());
      i++;
    }
    return items;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) {
      // A single # would compete with the article title, so it reads as ##.
      blocks.push({ kind: heading[1].length === 3 ? "h3" : "h2", text: heading[2] });
      i++;
    } else if (BULLET.test(line)) {
      blocks.push({ kind: "ul", items: collect(BULLET) });
    } else if (NUMBERED.test(line)) {
      blocks.push({ kind: "ol", items: collect(NUMBERED) });
    } else if (QUOTE.test(line)) {
      blocks.push({ kind: "quote", text: collect(QUOTE).join(" ") });
    } else {
      const parts: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        ![HEADING, BULLET, NUMBERED, QUOTE].some((p) => p.test(lines[i]))
      ) {
        parts.push(lines[i].trim());
        i++;
      }
      blocks.push({ kind: "p", text: parts.join(" ") });
    }
  }
  return blocks;
}

const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
const SAFE_HREF = /^(\/|#|https?:\/\/|mailto:)/;
const LINK_CLASS =
  "text-ink underline decoration-metal underline-offset-4 transition-colors duration-200 hover:decoration-ink";

function inline(text: string, keyPrefix = ""): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const index = m.index ?? 0;
    if (index > last) out.push(text.slice(last, index));
    const key = `${keyPrefix}${index}`;
    if (m[1] !== undefined) {
      out.push(
        <strong key={key} className="font-semibold text-ink">
          {inline(m[1], `${key}-`)}
        </strong>,
      );
    } else if (m[2] !== undefined) {
      out.push(<em key={key}>{inline(m[2], `${key}-`)}</em>);
    } else {
      const [label, href] = [m[3], m[4]];
      const children = inline(label, `${key}-`);
      if (!SAFE_HREF.test(href)) {
        out.push(...children);
      } else if (href.startsWith("/") || href.startsWith("#")) {
        out.push(
          <Link key={key} href={href} className={LINK_CLASS}>
            {children}
          </Link>,
        );
      } else {
        out.push(
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {children}
          </a>,
        );
      }
    }
    last = index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="text-[17px] leading-[1.75] [&>*:first-child]:mt-0">
      {parseBlocks(source).map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2 key={i} className="mt-14 font-display text-[clamp(1.7rem,3.2vw,2.2rem)]">
                {inline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-10 font-display text-[1.5rem]">
                {inline(block.text)}
              </h3>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="mt-10 border-l border-ink pl-6 font-display text-[1.6rem] leading-snug"
              >
                {inline(block.text)}
              </blockquote>
            );
          case "ul":
          case "ol": {
            const List = block.kind;
            return (
              <List
                key={i}
                className={`mt-5 space-y-2 pl-5 marker:text-ink-muted ${block.kind === "ul" ? "list-disc" : "list-decimal"}`}
              >
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    {inline(item)}
                  </li>
                ))}
              </List>
            );
          }
          default:
            return (
              <p key={i} className="mt-5">
                {inline(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
