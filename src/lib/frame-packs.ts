import { PACKS, frameCount, frameUrl, packUrl, type SequenceTier } from "./sequence";

/**
 * Loads a frame sequence for the players (hero-sequence.tsx,
 * diamond-rotation.tsx), a pack at a time.
 *
 * Each tier is downloaded once per page session and shared: the hero's
 * turntable and the rotation section further down the home page draw the same
 * frames, and a player that mounts later — another visit to the home page, the
 * rotation in a drawer — is handed what is already in memory instead of
 * fetching it again.
 *
 * Order of work, per tier:
 *
 *  1. The first frame on its own, so a player has something to show at once.
 *  2. The packs (scripts/pack-sequence.mjs), PACK_LANES at a time and in
 *     sequence order, so the hero's playhead is fed from the front.
 *  3. Any pack that can't be fetched or read, frame by frame from the
 *     individual files. That is also the whole path when packs are absent —
 *     `next dev` before a build, or an asset CDN that was given the frames
 *     but not the packs.
 *
 * Every frame is reported exactly once: as an image, or as null when it could
 * not be loaded even on a second try. When the last player stops listening,
 * downloads stop; the frames already in are kept for the next one, and the
 * ones that failed are tried again when it attaches.
 */

/** A frame: its image, null when it failed, undefined while still to come. */
type Slot = HTMLImageElement | null | undefined;

type Listener = {
  onFrame: (index: number, image: HTMLImageElement | null) => void;
  finish: () => void;
};

export type FrameStream = {
  /** Resolves once every frame has been reported, or the stream is cancelled. */
  done: Promise<void>;
  /** Stop reporting frames. Downloads stop too once nothing else is listening. */
  cancel: () => void;
};

/** Packs downloading at once. */
const PACK_LANES = 3;
/** Individual frames downloading at once, when falling back to them. */
const FRAME_LANES = 6;
/** "ISGF" read as a little-endian uint32: the first four bytes of every pack. */
const PACK_MAGIC = 0x46475349;
const PACK_FORMAT = 1;

/** Loads an image; undefined if the load was abandoned, null if it failed. */
function loadImage(src: string, signal: AbortSignal): Promise<Slot> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve(undefined);
    const img = new Image();
    img.decoding = "async";
    const abandon = () => {
      img.onload = img.onerror = null;
      img.src = "";
      resolve(undefined);
    };
    signal.addEventListener("abort", abandon, { once: true });
    img.onload = () => {
      signal.removeEventListener("abort", abandon);
      resolve(img);
    };
    img.onerror = () => {
      signal.removeEventListener("abort", abandon);
      resolve(null);
    };
    img.src = src;
  });
}

async function loadBlobImage(blob: Blob, signal: AbortSignal): Promise<Slot> {
  const url = URL.createObjectURL(blob);
  try {
    return await loadImage(url, signal);
  } finally {
    // A loaded image keeps its own data; the URL was only the way in.
    URL.revokeObjectURL(url);
  }
}

/** Splits a pack back into its frames, rejecting anything that isn't one. */
function unpack(buffer: ArrayBuffer, expected: number): Blob[] {
  const view = new DataView(buffer);
  if (
    buffer.byteLength < 12 ||
    view.getUint32(0, true) !== PACK_MAGIC ||
    view.getUint32(4, true) !== PACK_FORMAT ||
    view.getUint32(8, true) !== expected
  ) {
    throw new Error("Not a frame pack for this range");
  }
  let offset = 12 + expected * 4;
  const frames: Blob[] = [];
  for (let i = 0; i < expected; i++) {
    const length = view.getUint32(12 + i * 4, true);
    if (offset + length > buffer.byteLength) throw new Error("Truncated frame pack");
    frames.push(new Blob([new Uint8Array(buffer, offset, length)], { type: "image/webp" }));
    offset += length;
  }
  return frames;
}

async function fetchPack(url: string, expected: number, signal: AbortSignal): Promise<Blob[]> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Frame pack ${url}: ${response.status}`);
  return unpack(await response.arrayBuffer(), expected);
}

class TierLoader {
  private readonly slots: Slot[];
  private settled = 0;
  private readonly listeners = new Set<Listener>();
  private controller: AbortController | null = null;

  constructor(private readonly tier: SequenceTier) {
    this.slots = new Array<Slot>(frameCount(tier)).fill(undefined);
  }

  private get complete() {
    return this.settled === this.slots.length;
  }

  attach(listener: Listener) {
    // Frames that failed on an earlier visit get another try, rather than
    // leaving every later player blank for the rest of the session after one
    // bad connection. Only while idle: a running load has already reported
    // them to the listeners it has.
    if (!this.controller) {
      this.slots.forEach((slot, i) => {
        if (slot === null) {
          this.slots[i] = undefined;
          this.settled--;
        }
      });
    }
    // Whatever is already in, in order, before anything new arrives.
    this.slots.forEach((slot, i) => {
      if (slot !== undefined) listener.onFrame(i, slot);
    });
    if (this.complete) return listener.finish();
    this.listeners.add(listener);
    this.start();
  }

  detach(listener: Listener) {
    this.listeners.delete(listener);
    if (!this.listeners.size && this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  private settle(index: number, image: HTMLImageElement | null) {
    if (this.slots[index] !== undefined) return;
    this.slots[index] = image;
    this.settled++;
    for (const listener of [...this.listeners]) listener.onFrame(index, image);
    if (this.complete) {
      const finished = [...this.listeners];
      this.listeners.clear();
      this.controller = null;
      finished.forEach((listener) => listener.finish());
    }
  }

  private start() {
    if (this.controller) return;
    const controller = new AbortController();
    this.controller = controller;
    void this.run(controller.signal).then(() => {
      // Every path settles every frame unless abandoned; this only stops a
      // player waiting forever if one somehow didn't.
      if (controller.signal.aborted) return;
      this.slots.forEach((slot, i) => {
        if (slot === undefined) this.settle(i, null);
      });
    });
  }

  private pending(index: number) {
    return this.slots[index] === undefined;
  }

  private async run(signal: AbortSignal) {
    if (this.pending(0)) await this.loadFrame(0, signal);

    const per = PACKS.framesPerPack;
    const queue: { pack: number; from: number; to: number }[] = [];
    for (let pack = 0; pack * per < this.slots.length; pack++) {
      const from = pack * per;
      const to = Math.min(this.slots.length, from + per);
      for (let i = from; i < to; i++) {
        if (this.pending(i)) {
          queue.push({ pack, from, to });
          break;
        }
      }
    }

    await Promise.all(
      Array.from({ length: PACK_LANES }, async () => {
        while (queue.length && !signal.aborted) {
          await this.loadPack(queue.shift()!, signal);
        }
      }),
    );
  }

  /** One frame from its own file, with one retry. */
  private async loadFrame(index: number, signal: AbortSignal) {
    const url = frameUrl(this.tier, index);
    let image = await loadImage(url, signal);
    if (image === null) image = await loadImage(url, signal);
    if (image !== undefined && !signal.aborted) this.settle(index, image);
  }

  private async loadPack({ pack, from, to }: { pack: number; from: number; to: number }, signal: AbortSignal) {
    const url = packUrl(this.tier, pack);
    let frames: Blob[] | null = null;
    for (let attempt = 0; url && !frames && attempt < 2 && !signal.aborted; attempt++) {
      try {
        frames = await fetchPack(url, to - from, signal);
      } catch {
        // Tried once more, then the frames are fetched one by one below.
      }
    }
    if (signal.aborted) return;

    if (frames) {
      await Promise.all(
        frames.map(async (blob, k) => {
          const index = from + k;
          if (!this.pending(index)) return;
          const image = await loadBlobImage(blob, signal);
          if (image === undefined || signal.aborted) return;
          // A frame that won't decode from the pack gets a try from its own file.
          if (image) this.settle(index, image);
          else await this.loadFrame(index, signal);
        }),
      );
      return;
    }

    const left = Array.from({ length: to - from }, (_, k) => from + k).filter((i) => this.pending(i));
    await Promise.all(
      Array.from({ length: FRAME_LANES }, async () => {
        while (left.length && !signal.aborted) await this.loadFrame(left.shift()!, signal);
      }),
    );
  }
}

const LOADERS = new Map<SequenceTier, TierLoader>();

/**
 * Streams every frame of `tier` to `onFrame`, as it arrives: frames already in
 * memory are reported straight away, in order, before this returns.
 */
export function streamFrames(
  tier: SequenceTier,
  onFrame: (index: number, image: HTMLImageElement | null) => void,
): FrameStream {
  const loader = LOADERS.get(tier) ?? new TierLoader(tier);
  LOADERS.set(tier, loader);

  let active = true;
  let resolve = () => {};
  const done = new Promise<void>((r) => (resolve = r));
  const listener: Listener = {
    onFrame: (index, image) => {
      if (active) onFrame(index, image);
    },
    finish: () => resolve(),
  };
  loader.attach(listener);

  return {
    done,
    cancel: () => {
      if (!active) return;
      active = false;
      loader.detach(listener);
      resolve();
    },
  };
}
