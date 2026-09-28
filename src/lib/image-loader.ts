import widths from "@/data/image-widths.json";

/**
 * next/image loader for the jewelry photographs.
 *
 * Each photo is resized ahead of time by scripts/build-images.mjs (it runs
 * before every build) to the widths in src/data/image-widths.json, and served
 * as a plain static file: "/jewelry/IMPSG-17053/01.webp" at 640px is
 * "/_img/jewelry/IMPSG-17053/01-640.webp". There is no image server at run
 * time, so photos load straight from the CDN on any host, and the deployed
 * server needs no image-processing library.
 *
 * next.config.ts sets the same widths as next/image's sizes, so every width
 * asked for here is one that exists; anything else rounds up, then caps at the
 * largest.
 *
 * `next dev` doesn't run the prebuild step that makes the sizes, so in
 * development the original photo is used as it is. (The ?w= is ignored by the
 * file server; it keeps next/image's check that a loader uses the width quiet.)
 */
const WIDTHS = [...widths].sort((a, b) => a - b);

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/jewelry/")) return src;
  if (process.env.NODE_ENV === "development") return `${src}?w=${width}`;
  const size = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/_img${src.replace(/\.\w+$/, "")}-${size}.webp`;
}
