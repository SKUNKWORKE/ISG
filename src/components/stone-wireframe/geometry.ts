import { BufferGeometry, EdgesGeometry, Float32BufferAttribute } from "three";
import type { WireframeShape } from "@/lib/wireframe-shapes";

/** A face-up outline point in the girdle plane. y is up; the table faces +y. */
type Point = readonly [x: number, z: number];

const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Indexed triangle soup with consistent winding. Every helper keeps the same
 * rule — a ring ordered counter-clockwise from +x toward +z, upper ring first —
 * so EdgesGeometry sees coplanar neighbours as coplanar and draws only true
 * facet boundaries.
 */
class Solid {
  positions: number[] = [];
  indices: number[] = [];

  vertex(x: number, y: number, z: number) {
    this.positions.push(x, y, z);
    return this.positions.length / 3 - 1;
  }

  ring(outline: readonly Point[], scale: number, y: number) {
    return outline.map(([x, z]) => this.vertex(x * scale, y, z * scale));
  }

  tri(a: number, b: number, c: number) {
    this.indices.push(a, b, c);
  }

  strip(upper: number[], lower: number[]) {
    const n = upper.length;
    for (let k = 0; k < n; k++) {
      const k1 = (k + 1) % n;
      this.tri(upper[k], upper[k1], lower[k1]);
      this.tri(upper[k], lower[k1], lower[k]);
    }
  }

  fanUp(ring: number[], centre: number) {
    for (let k = 0; k < ring.length; k++) this.tri(ring[(k + 1) % ring.length], ring[k], centre);
  }

  fanDown(ring: number[], apex: number) {
    for (let k = 0; k < ring.length; k++) this.tri(ring[k], ring[(k + 1) % ring.length], apex);
  }

  toGeometry() {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(this.positions, 3));
    geometry.setIndex(this.indices);
    geometry.center();
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere?.radius ?? 1;
    geometry.scale(1 / r, 1 / r, 1 / r);
    geometry.computeBoundingSphere();
    return geometry;
  }
}

/** Centres the outline, sets the shorter half-extent to 1, and makes it counter-clockwise. */
function normalise(points: Point[]): Point[] {
  const xs = points.map((p) => p[0]);
  const zs = points.map((p) => p[1]);
  const [minX, maxX, minZ, maxZ] = [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)];
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const half = Math.min(maxX - minX, maxZ - minZ) / 2;
  const out = points.map(([x, z]) => [(x - cx) / half, (z - cz) / half] as const);
  const area = out.reduce((sum, [x, z], i) => {
    const [x2, z2] = out[(i + 1) % out.length];
    return sum + x * z2 - x2 * z;
  }, 0);
  // Reverse around index 0 so a point placed there on purpose (a pear's tip,
  // a heart's cleft) stays at an even index, where the table vertices sit.
  return area < 0 ? [out[0], ...out.slice(1).reverse()] : out;
}

const sampleCurve = (n: number, f: (t: number) => Point): Point[] =>
  Array.from({ length: n }, (_, i) => f((i / n) * TAU));

/** Resamples a polygon to n points, keeping every corner and spacing by edge length. */
function samplePolygon(vertices: Point[], n: number): Point[] {
  const edges = vertices.map((v, i) => {
    const w = vertices[(i + 1) % vertices.length];
    return Math.hypot(w[0] - v[0], w[1] - v[1]);
  });
  const total = edges.reduce((a, b) => a + b, 0);
  const counts = edges.map((l) => Math.max(1, Math.round((l / total) * n)));
  let diff = n - counts.reduce((a, b) => a + b, 0);
  while (diff !== 0) {
    const i = edges.indexOf(Math.max(...edges.filter((_, j) => diff > 0 || counts[j] > 1)));
    counts[i] += Math.sign(diff);
    diff -= Math.sign(diff);
  }
  return vertices.flatMap((v, i) => {
    const w = vertices[(i + 1) % vertices.length];
    return Array.from(
      { length: counts[i] },
      (_, j) => [lerp(v[0], w[0], j / counts[i]), lerp(v[1], w[1], j / counts[i])] as const,
    );
  });
}

const octagon = (halfW: number, halfL: number, cut: number): Point[] => [
  [halfW - cut, halfL],
  [-(halfW - cut), halfL],
  [-halfW, halfL - cut],
  [-halfW, -(halfL - cut)],
  [-(halfW - cut), -halfL],
  [halfW - cut, -halfL],
  [halfW, -(halfL - cut)],
  [halfW, halfL - cut],
];

type Proportions = { table: number; crown: number; pavilion: number; girdle?: number };

/**
 * Brilliant pattern over any outline with an even point count: table, star and
 * upper-girdle facets on the crown; mains and lower-girdle facets meeting at a
 * pointed culet on the pavilion.
 */
function brilliant(points: Point[], { table, crown, pavilion, girdle = 0.03 }: Proportions) {
  const outline = normalise(points);
  const s = new Solid();
  const n = outline.length;
  const m = n / 2;
  const top = girdle + crown;
  const bottom = -girdle - pavilion;

  const gt = s.ring(outline, 1, girdle);
  const gb = s.ring(outline, 1, -girdle);
  s.strip(gt, gb);

  const tableRing = Array.from({ length: m }, (_, k) => {
    const [x, z] = outline[2 * k];
    return s.vertex(x * table, top, z * table);
  });
  s.fanUp(tableRing, s.vertex(0, top, 0));

  const g = (i: number) => gt[(i + n) % n];
  for (let k = 0; k < m; k++) {
    const t0 = tableRing[k];
    s.tri(t0, tableRing[(k + 1) % m], g(2 * k + 1));
    s.tri(t0, g(2 * k + 1), g(2 * k));
    s.tri(t0, g(2 * k), g(2 * k - 1));
  }

  const culet = s.vertex(0, bottom, 0);
  const reach = 0.55;
  for (let k = 0; k < m; k++) {
    const [x, z] = outline[2 * k + 1];
    const lower = s.vertex(x * (1 - reach), lerp(-girdle, bottom, reach), z * (1 - reach));
    const b0 = gb[2 * k];
    const b1 = gb[2 * k + 1];
    const b2 = gb[(2 * k + 2) % n];
    s.tri(b0, b1, lower);
    s.tri(b1, b2, lower);
    s.tri(b0, lower, culet);
    s.tri(lower, b2, culet);
  }

  return s.toGeometry();
}

/**
 * Step cut: concentric rings on crown and pavilion. Each step is
 * [how far toward the table/culet, how far up/down], and consecutive steps need
 * different slopes or their facets merge into one.
 */
function stepCut(
  points: Point[],
  { table, crown, pavilion, girdle = 0.03 }: Proportions,
  crownSteps: Array<[number, number]>,
  pavilionSteps: Array<[number, number]>,
) {
  const outline = normalise(points);
  const s = new Solid();
  const top = girdle + crown;
  const bottom = -girdle - pavilion;

  const gt = s.ring(outline, 1, girdle);
  const gb = s.ring(outline, 1, -girdle);
  s.strip(gt, gb);

  let below = gt;
  for (const [inward, rise] of crownSteps) {
    const ring = s.ring(outline, lerp(1, table, inward), lerp(girdle, top, rise));
    s.strip(ring, below);
    below = ring;
  }
  const tableRing = s.ring(outline, table, top);
  s.strip(tableRing, below);
  s.fanUp(tableRing, s.vertex(0, top, 0));

  let above = gb;
  for (const [inward, fall] of pavilionSteps) {
    const ring = s.ring(outline, 1 - inward, lerp(-girdle, bottom, fall));
    s.strip(above, ring);
    above = ring;
  }
  s.fanDown(above, s.vertex(0, bottom, 0));

  return s.toGeometry();
}

const sgn = (v: number, p: number) => Math.sign(v) * Math.abs(v) ** p;

const BUILDERS: Record<WireframeShape, () => BufferGeometry> = {
  round: () =>
    brilliant(sampleCurve(32, (t) => [Math.cos(t), Math.sin(t)]), {
      table: 0.57,
      crown: 0.32,
      pavilion: 0.86,
    }),

  oval: () =>
    brilliant(sampleCurve(32, (t) => [Math.cos(t), 1.4 * Math.sin(t)]), {
      table: 0.56,
      crown: 0.3,
      pavilion: 0.86,
    }),

  // Tip at t = 0 (index 0), rounded end opposite.
  pear: () =>
    brilliant(
      sampleCurve(32, (t) => {
        const s = Math.sin(t);
        const c = Math.cos(t);
        return c > 0 ? [s * Math.abs(s), 1.9 * c] : [s, 1.3 * c];
      }),
      { table: 0.55, crown: 0.3, pavilion: 0.88 },
    ),

  marquise: () =>
    brilliant(
      sampleCurve(32, (t) => [Math.sin(t) * Math.abs(Math.sin(t)), 2 * Math.cos(t)]),
      { table: 0.52, crown: 0.3, pavilion: 0.9 },
    ),

  // Cleft at t = 0, point at t = PI — both land on even indices.
  heart: () =>
    brilliant(
      sampleCurve(48, (t) => [
        16 * Math.sin(t) ** 3,
        -1.1 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
      ]),
      { table: 0.52, crown: 0.28, pavilion: 0.86 },
    ),

  cushion: () =>
    brilliant(sampleCurve(32, (t) => [sgn(Math.cos(t), 0.6), 1.05 * sgn(Math.sin(t), 0.6)]), {
      table: 0.58,
      crown: 0.3,
      pavilion: 0.9,
    }),

  princess: () =>
    brilliant(samplePolygon([[1, 1], [-1, 1], [-1, -1], [1, -1]], 32), {
      table: 0.68,
      crown: 0.22,
      pavilion: 0.95,
    }),

  radiant: () =>
    brilliant(samplePolygon(octagon(1, 1.22, 0.3), 32), {
      table: 0.6,
      crown: 0.28,
      pavilion: 0.9,
    }),

  // Three corners with slightly convex sides, cut shallow.
  trillion: () => {
    const corners = [0, 1, 2].flatMap((i): Point[] => {
      const a = Math.PI / 2 + (i * TAU) / 3;
      const mid = a + Math.PI / 3;
      return [
        [Math.cos(a), Math.sin(a)],
        [0.56 * Math.cos(mid), 0.56 * Math.sin(mid)],
      ];
    });
    return brilliant(samplePolygon(corners, 36), { table: 0.55, crown: 0.2, pavilion: 0.6 });
  },

  // Elongated six-sided outline: flat top and bottom, pointed sides.
  hexagon: () =>
    brilliant(
      samplePolygon(
        [
          [-0.43, -1.05],
          [0.43, -1.05],
          [1, 0],
          [0.43, 1.05],
          [-0.43, 1.05],
          [-1, 0],
        ],
        30,
      ),
      { table: 0.55, crown: 0.28, pavilion: 0.88 },
    ),

  emerald: () =>
    stepCut(
      octagon(1, 1.4, 0.3),
      { table: 0.62, crown: 0.26, pavilion: 0.8 },
      [
        [0.4, 0.55],
        [0.75, 0.88],
      ],
      [
        [0.3, 0.2],
        [0.55, 0.5],
        [0.8, 0.82],
      ],
    ),

  asscher: () =>
    stepCut(
      octagon(1, 1, 0.42),
      { table: 0.55, crown: 0.34, pavilion: 0.85 },
      [
        [0.35, 0.5],
        [0.7, 0.85],
      ],
      [
        [0.3, 0.22],
        [0.55, 0.52],
        [0.8, 0.84],
      ],
    ),
};

export type StoneGeometry = { solid: BufferGeometry; edges: EdgesGeometry };

const cache = new Map<WireframeShape, StoneGeometry>();

/** Built once per shape and shared by every stone of that shape; never disposed. */
export function getStoneGeometry(shape: WireframeShape): StoneGeometry {
  let entry = cache.get(shape);
  if (!entry) {
    const solid = BUILDERS[shape]();
    entry = { solid, edges: new EdgesGeometry(solid, 1) };
    cache.set(shape, entry);
  }
  return entry;
}
