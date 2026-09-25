import { deflateSync } from "node:zlib";

/**
 * Just enough PDF to lay out a printable table: the two built-in Helvetica
 * faces (never embedded, so every reader already has them), filled
 * rectangles, rules and link annotations. Coordinates are in points from the
 * top-left corner, which is how the layouts in spec-sheet.ts read, and are
 * flipped to PDF's bottom-left origin on the way out.
 */

export type Rgb = readonly [number, number, number];
export type FontFace = "regular" | "bold";

type TextOptions = { size?: number; font?: FontFace; color?: Rgb; align?: "left" | "right" };

/** Helvetica advance widths (per 1000 em) for ASCII 32–126, from the Adobe AFM. */
const HELVETICA = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556,
  556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667,
  611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667,
  667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500,
  222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];

/** WinAnsi positions for the typographic characters outside Latin-1. */
const WIN_ANSI: Record<string, [code: number, width: number]> = {
  "–": [0x96, 556],
  "—": [0x97, 1000],
  "…": [0x85, 1000],
  "•": [0x95, 350],
  "‘": [0x91, 222],
  "’": [0x92, 222],
  "“": [0x93, 333],
  "”": [0x94, 333],
};

function glyph(ch: string): [code: number, width: number] {
  const code = ch.charCodeAt(0);
  if (code >= 32 && code <= 126) return [code, HELVETICA[code - 32]];
  if (WIN_ANSI[ch]) return WIN_ANSI[ch];
  if (code >= 160 && code <= 255) return [code, 556];
  return [63, 556]; // "?" — the standard fonts have no glyph for it
}

/** Bold is approximated as a touch wider than regular; close enough for truncation. */
export function textWidth(text: string, size: number, font: FontFace = "regular"): number {
  let units = 0;
  for (const ch of text) units += glyph(ch)[1];
  return ((units * size) / 1000) * (font === "bold" ? 1.07 : 1);
}

/** Truncates with an ellipsis so a long fancy-colour name can't overrun its column. */
export function fit(text: string, maxWidth: number, size: number, font: FontFace = "regular") {
  if (textWidth(text, size, font) <= maxWidth) return text;
  const chars = [...text];
  while (chars.length && textWidth(`${chars.join("")}…`, size, font) > maxWidth) chars.pop();
  return `${chars.join("").trimEnd()}…`;
}

export function wrap(text: string, maxWidth: number, size: number, font: FontFace = "regular") {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && textWidth(next, size, font) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function literal(text: string): string {
  let out = "(";
  for (const ch of text) {
    const code = glyph(ch)[0];
    if (code === 0x28 || code === 0x29 || code === 0x5c) out += "\\";
    out += String.fromCharCode(code);
  }
  return `${out})`;
}

const num = (v: number) => Number(v.toFixed(2)).toString();
const rgb = ([r, g, b]: Rgb) => `${num(r)} ${num(g)} ${num(b)}`;
const ref = (id: number) => `${id} 0 R`;

export class PdfDocument {
  private pages: { ops: string[]; links: string[] }[] = [];

  constructor(
    readonly width: number,
    readonly height: number,
  ) {}

  addPage() {
    this.pages.push({ ops: [], links: [] });
  }

  private get page() {
    const page = this.pages[this.pages.length - 1];
    if (!page) throw new Error("PdfDocument: call addPage() before drawing");
    return page;
  }

  text(x: number, y: number, value: string, options: TextOptions = {}) {
    const { size = 9, font = "regular", color = [0, 0, 0], align = "left" } = options;
    const left = align === "right" ? x - textWidth(value, size, font) : x;
    this.page.ops.push(
      `${rgb(color)} rg BT /${font === "bold" ? "F2" : "F1"} ${num(size)} Tf ${num(left)} ${num(this.height - y)} Td ${literal(value)} Tj ET`,
    );
  }

  rule(x1: number, y1: number, x2: number, y2: number, color: Rgb, width = 0.5) {
    this.page.ops.push(
      `${rgb(color)} RG ${num(width)} w ${num(x1)} ${num(this.height - y1)} m ${num(x2)} ${num(this.height - y2)} l S`,
    );
  }

  fill(x: number, y: number, w: number, h: number, color: Rgb) {
    this.page.ops.push(
      `${rgb(color)} rg ${num(x)} ${num(this.height - y - h)} ${num(w)} ${num(h)} re f`,
    );
  }

  link(x: number, y: number, w: number, h: number, url: string) {
    this.page.links.push(
      `<< /Type /Annot /Subtype /Link /Rect [${num(x)} ${num(this.height - y - h)} ${num(x + w)} ${num(this.height - y)}] /Border [0 0 0] /A << /S /URI /URI ${literal(url)} >> >>`,
    );
  }

  toBuffer(meta: { title: string; author: string }): Buffer {
    // Fixed ids 1–5; pages, their content streams and link annotations follow.
    const objects: (string | Buffer)[] = [];
    const set = (id: number, body: string | Buffer) => {
      objects[id - 1] = body;
    };

    const kids: number[] = [];
    let next = 6;
    for (const page of this.pages) {
      const pageId = next++;
      const contentId = next++;
      const annotIds = page.links.map((link) => {
        const id = next++;
        set(id, link);
        return id;
      });
      kids.push(pageId);

      const annots = annotIds.length ? ` /Annots [${annotIds.map(ref).join(" ")}]` : "";
      set(
        pageId,
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(this.width)} ${num(this.height)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${ref(contentId)}${annots} >>`,
      );

      const data = deflateSync(Buffer.from(page.ops.join("\n"), "latin1"));
      set(
        contentId,
        Buffer.concat([
          Buffer.from(`<< /Length ${data.length} /Filter /FlateDecode >>\nstream\n`, "latin1"),
          data,
          Buffer.from("\nendstream", "latin1"),
        ]),
      );
    }

    const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
    set(1, "<< /Type /Catalog /Pages 2 0 R >>");
    set(2, `<< /Type /Pages /Kids [${kids.map(ref).join(" ")}] /Count ${kids.length} >>`);
    set(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    set(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    set(
      5,
      `<< /Title ${literal(meta.title)} /Author ${literal(meta.author)} /CreationDate (D:${stamp}Z) >>`,
    );

    const chunks: Buffer[] = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "latin1")];
    let offset = chunks[0].length;
    const offsets: number[] = [];
    for (let i = 0; i < objects.length; i++) {
      const body = objects[i];
      const chunk = Buffer.concat([
        Buffer.from(`${i + 1} 0 obj\n`, "latin1"),
        typeof body === "string" ? Buffer.from(body, "latin1") : body,
        Buffer.from("\nendobj\n", "latin1"),
      ]);
      offsets.push(offset);
      offset += chunk.length;
      chunks.push(chunk);
    }

    const xref = [
      `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`,
      ...offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`),
      `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${offset}\n%%EOF\n`,
    ].join("");
    chunks.push(Buffer.from(xref, "latin1"));
    return Buffer.concat(chunks);
  }
}
