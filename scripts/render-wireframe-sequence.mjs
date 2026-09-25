/**
 * Renders the rough-to-polished sequence as a technical wireframe, frame for
 * frame against the 700-frame photographic render it replaces.
 *
 * The geometry is modelled here, not recovered from the original scene, so the
 * match is by timeline and framing (positions and sizes were measured from the
 * original frames), not pixel for pixel.
 *
 *   node scripts/render-wireframe-sequence.mjs                 all 700 frames
 *   node scripts/render-wireframe-sequence.mjs --frames=0,350  selected frames
 *
 *   node scripts/render-wireframe-sequence.mjs --turntable     seamless 360° loop
 *
 * Output: assets/sequence/wire-700/_00000.png – _00699.png, 2160px, transparent;
 * the turntable goes to assets/sequence/wire-360/_00000.png – _00332.png.
 * Feed both to the site with:
 *   SEQUENCE_SOURCE=wire-700 ROTATE_SOURCE=wire-360 node scripts/convert-sequence.mjs
 */

import { createRequire } from "node:module";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { getStoneGeometry } from "../src/components/stone-wireframe/geometry.ts";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets", "sequence", "wire-700");
const FRAMES = 700;
const OUT_TURNTABLE = path.join(ROOT, "assets", "sequence", "wire-360");
/** Frames in one full turn of the finished stone; at 30 fps, about eleven seconds. */
const TURNTABLE = 333;
const SIZE = 2160;
/** Output pixels per pixel of the 1080px original, which all framing numbers are measured in. */
const U = SIZE / 1080;
/** Pixels (in 1080 space) per world unit before stage zoom. */
const K = 228;
/** Camera distance in world units; long enough for a mild, CAD-like perspective. */
const CAMERA = 9;

const COLOR = {
  graphite: [62, 68, 75],
  mesh: [140, 149, 158],
  ice: [150, 166, 182],
  red: [214, 72, 30],
  blue: [48, 102, 214],
  green: [44, 156, 40],
  laser: [36, 206, 58],
  dust: [120, 128, 136],
};

/* ------------------------------------------------------------ timing helpers */

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const smooth = (t) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
/** 0 before a, 1 after b. */
const ramp = (f, a, b) => smooth((f - a) / (b - a));
/** Fades in over a–b, out over c–d. */
const span = (f, a, b, c, d) => ramp(f, a, b) * (1 - ramp(f, c, d));

function keys(f, points, ease = smooth) {
  if (f <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [f0, v0] = points[i];
    const [f1, v1] = points[i + 1];
    if (f <= f1) return v0 + (v1 - v0) * ease((f - f0) / (f1 - f0));
  }
  return points[points.length - 1][1];
}
const linear = (f, points) => keys(f, points, clamp01);

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

function hsl(h, s, l) {
  const k = (n) => (n + h * 12) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/* ----------------------------------------------------------------- geometry */

function roughCrystal(seed, { taper = 0.62, width = 0.62, depth = 0.5, count = 90 } = {}) {
  const r = rng(seed);
  const points = [];
  for (let i = 0; i < count; i++) {
    const u = r() * 2 - 1;
    const th = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const y = u;
    const narrow = y < 0 ? 1 + y * taper : 1 - y * 0.18;
    const k = 0.84 + r() * 0.22;
    points.push(new THREE.Vector3(s * Math.cos(th) * width * narrow * k, y * k, s * Math.sin(th) * depth * narrow * k));
  }
  points.push(new THREE.Vector3(0.06, -1.08, 0.02));
  return new ConvexGeometry(points);
}

function featureEdges(geometry, angle) {
  return Array.from(new THREE.EdgesGeometry(geometry, angle).attributes.position.array);
}

function meshEdges(geometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const p = g.attributes.position.array;
  const seen = new Set();
  const out = [];
  for (let i = 0; i < p.length; i += 9) {
    for (const [a, b] of [[0, 3], [3, 6], [6, 0]]) {
      const A = [p[i + a], p[i + a + 1], p[i + a + 2]];
      const B = [p[i + b], p[i + b + 1], p[i + b + 2]];
      const ka = A.map((v) => v.toFixed(4)).join();
      const kb = B.map((v) => v.toFixed(4)).join();
      const key = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(...A, ...B);
    }
  }
  return out;
}

function triangles(geometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  return Array.from(g.attributes.position.array);
}

/** Adds each edge's mirror images across the stone's two outline axes, dropping duplicates. */
function mirrorEdges(edges) {
  const seen = new Set();
  const out = [];
  for (let i = 0; i < edges.length; i += 6) {
    for (const [sx, sz] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const seg = [edges[i] * sx, edges[i + 1], edges[i + 2] * sz, edges[i + 3] * sx, edges[i + 4], edges[i + 5] * sz];
      const a = seg.slice(0, 3).map((v) => v.toFixed(3)).join();
      const b = seg.slice(3).map((v) => v.toFixed(3)).join();
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(...seg);
    }
  }
  return out;
}

function model(geometry, { edgeAngle = 10, mesh = false, symmetric = false } = {}) {
  const edges = featureEdges(geometry, edgeAngle);
  return {
    // The shared builder triangulates corner facets in one rotational direction, so a
    // threshold that keeps real facets also keeps seams on two corners only; mirroring
    // makes that corner detail symmetric, as a real radiant's corner facets are.
    edges: symmetric ? mirrorEdges(edges) : edges,
    mesh: mesh ? meshEdges(geometry) : [],
    tris: triangles(geometry),
  };
}

const MODELS = {
  crystal: model(roughCrystal(20260915, { width: 0.74, depth: 0.56 }), { edgeAngle: 9, mesh: true }),
  shards: Array.from({ length: 9 }, (_, i) =>
    model(roughCrystal(7000 + i * 131, { count: 26, taper: 0.3, width: 0.8, depth: 0.55 }), { edgeAngle: 9, mesh: true }),
  ),
  // Edge angles are raised above the site viewer's 1°: at that threshold, triangulation seams on
  // near-flat facets show as stray diagonals, and small brilliants read as dense fans.
  emerald: model(getStoneGeometry("emerald").solid, { edgeAngle: 3, mesh: true }),
  radiant: model(getStoneGeometry("radiant").solid, { edgeAngle: 6, mesh: true, symmetric: true }),
  pear: model(getStoneGeometry("pear").solid, { edgeAngle: 7 }),
  cushion: model(getStoneGeometry("cushion").solid, { edgeAngle: 7 }),
  oval: model(getStoneGeometry("oval").solid, { edgeAngle: 7 }),
};

const SHARD_DIRS = (() => {
  const r = rng(99);
  return MODELS.shards.map((_, i) => {
    const a = (i / MODELS.shards.length) * Math.PI * 2 + r() * 0.5;
    // Biased up and outward: the original's offcuts spread widest above and to the sides.
    return new THREE.Vector3(Math.cos(a) * 1.15, Math.sin(a) * 0.8 + 0.25, (r() - 0.5) * 0.8).normalize();
  });
})();

const DUST = (() => {
  const r = rng(4242);
  return Array.from({ length: 320 }, () => {
    const a = r() * Math.PI * 2;
    const rad = 0.75 + r() ** 0.6 * 0.95;
    return { x: Math.cos(a) * rad, y: (r() - 0.5) * 1.9, z: Math.sin(a) * rad * 0.45, size: 0.8 + r() * 2.2, drift: 0.15 + r() * 0.35 };
  });
})();

/* --------------------------------------------------------------- the scene */

function node({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, parent } = {}) {
  const o = new THREE.Object3D();
  o.position.set(...position);
  o.rotation.set(...rotation, "YXZ");
  if (Array.isArray(scale)) o.scale.set(...scale);
  else o.scale.setScalar(scale);
  if (parent) parent.add(o);
  return o;
}

/** Everything drawn in frame f, each with its transform, colours and opacities. */
function scene(f, spin = 0) {
  const root = new THREE.Object3D();
  const items = [];
  const add = (item) => items.push(item);
  const HALF = Math.PI / 2;

  const view = {
    // Framing is held constant from 500 on: the hero hands over to the turntable, rendered at
    // frame 699's framing, partway through that range, and any drift would show as a jump.
    cx: keys(f, [[0, 556], [330, 556], [375, 520], [400, 562], [470, 566], [500, 570], [699, 570]]) * U,
    cy: keys(f, [[0, 540], [330, 540], [375, 470], [400, 528], [470, 540], [500, 582], [699, 582]]) * U,
    zoom: keys(f, [[0, 1], [385, 1], [405, 1.22], [480, 1.22], [505, 1.5], [699, 1.5]]),
  };

  /* Rough crystal, 0–350, going translucent while the plan is shown. */
  const crystalVisible = 1 - ramp(f, 336, 346);
  const plan = span(f, 105, 135, 252, 278);
  const crystal = node({
    parent: root,
    // Turns freely while rough, then holds near face-on so the plan reads, as the original does.
    rotation: [0.1 * Math.sin(f / 70), linear(f, [[0, -1.1], [110, 0], [270, 0.45], [345, 1.5]]), 0.06],
  });
  if (crystalVisible > 0) {
    add({
      obj: crystal,
      model: MODELS.crystal,
      line: mix(COLOR.graphite, COLOR.ice, plan),
      lineAlpha: (1 - 0.45 * plan) * crystalVisible,
      meshAlpha: (0.2 - 0.1 * plan) * crystalVisible,
      fill: mix(COLOR.graphite, COLOR.ice, plan),
      fillAlpha: (0.03 - 0.012 * plan) * crystalVisible,
    });
  }

  /* The three candidate stones, mapped inside the rough. */
  if (plan > 0) {
    const candidates = [
      { m: MODELS.cushion, color: COLOR.red, position: [0.04, 0.6, 0.06], rotation: [HALF + 0.35, 0.4, 0], scale: [0.42, 0.24, 0.3] },
      { m: MODELS.radiant, color: COLOR.green, position: [0.22, -0.1, 0.12], rotation: [HALF, 0.15, 0], scale: [0.42, 0.34, 0.5] },
      { m: MODELS.pear, color: COLOR.blue, position: [-0.2, -0.22, -0.05], rotation: [HALF, -0.2, Math.PI], scale: [0.34, 0.32, 0.7] },
    ];
    for (const c of candidates) {
      add({
        obj: node({ parent: crystal, position: c.position, rotation: c.rotation, scale: c.scale }),
        model: c.m,
        line: c.color,
        lineAlpha: 0.95 * plan,
        fill: c.color,
        fillAlpha: 0.1 * plan,
      });
    }
  }

  /* Split: the stone blank, two secondary stones and the offcuts. */
  const pieces = ramp(f, 336, 350);
  if (pieces > 0) {
    // Starts part-open so the offcuts never stack into one tangle while the crystal fades.
    const explode = keys(f, [[338, 0.12], [370, 1]]);
    const offcuts = 1 - ramp(f, 358, 374);
    const tumble = keys(f, [[340, 0], [376, 1.2]]);

    if (offcuts > 0) {
      MODELS.shards.forEach((shard, i) => {
        const dir = SHARD_DIRS[i];
        const reach = 0.62 + explode * (0.7 + (i % 3) * 0.18);
        const obj = node({
          parent: root,
          position: [dir.x * reach, dir.y * reach, dir.z * reach],
          rotation: [tumble * (0.6 + i * 0.1), tumble * (1 - i * 0.15), tumble * 0.4],
          scale: 0.38 + (i % 4) * 0.07,
        });
        const puff = ramp(f, 358, 374);
        add({
          obj,
          model: shard,
          line: COLOR.graphite,
          lineAlpha: pieces * offcuts,
          meshAlpha: 0.2 * pieces * offcuts,
          fill: COLOR.graphite,
          fillAlpha: 0.03 * pieces * offcuts,
          puff: puff > 0 && puff < 1 ? puff : 0,
        });
      });
    }

    const pearFade = 1 - ramp(f, 468, 490);
    if (pearFade > 0) {
      add({
        obj: node({
          parent: root,
          position: [
            keys(f, [[340, 0.3], [370, 0.42], [386, -0.26], [430, -0.22], [470, -0.5]]),
            keys(f, [[340, -0.15], [376, -0.1], [400, -0.08], [470, 0.02]]),
            0.1,
          ],
          rotation: [HALF + keys(f, [[340, 0.2], [376, 0.9], [420, 0.4], [470, 0.7]]), keys(f, [[340, 0.3], [400, -0.4], [470, 0.3]]), Math.PI + 0.25],
          scale: [0.42, 0.4, 0.62],
        }),
        model: MODELS.pear,
        line: COLOR.graphite,
        lineAlpha: pieces * pearFade,
        fill: COLOR.graphite,
        fillAlpha: 0.035 * pieces * pearFade,
      });
    }

    const smallFade = 1 - ramp(f, 462, 488);
    if (smallFade > 0) {
      add({
        obj: node({
          parent: root,
          position: [
            keys(f, [[340, 0], [376, 0.05], [400, 0.02], [440, 0.1], [470, 0.42]]),
            keys(f, [[340, 0.55], [376, 1.0], [400, 0.6], [470, 0.66]]),
            0,
          ],
          rotation: [keys(f, [[340, 0.9], [400, 1.3], [470, 0.6]]), keys(f, [[340, 0], [470, 1.4]]), 0.3],
          scale: 0.27,
        }),
        model: MODELS.oval,
        line: COLOR.graphite,
        lineAlpha: pieces * smallFade,
        fill: COLOR.graphite,
        fillAlpha: 0.035 * pieces * smallFade,
      });
    }

    const emeraldFade = 1 - ramp(f, 560, 576);
    if (emeraldFade > 0) {
      add({
        obj: node({
          parent: root,
          position: [keys(f, [[340, 0.06], [400, 0.14], [470, 0.1], [505, 0]]), keys(f, [[340, -0.1], [400, -0.06], [505, 0]]), 0],
          rotation: [
            HALF + keys(f, [[340, 0.25], [376, 0.5], [420, 0.15], [500, 0]]),
            keys(f, [[340, 0.3], [376, 0.9], [405, 0.28], [445, -0.35], [490, 0], [530, 0.12], [565, 0]]),
            0,
          ],
          scale: keys(f, [[340, 0.6], [405, 0.6], [505, 0.7]]),
        }),
        model: MODELS.emerald,
        line: COLOR.graphite,
        lineAlpha: pieces * emeraldFade,
        // The preform is frosted before it is faceted; the faint triangulation stands in for that surface.
        meshAlpha: (0.08 + 0.2 * span(f, 495, 515, 550, 570)) * pieces * emeraldFade,
        fill: COLOR.graphite,
        fillAlpha: 0.04 * pieces * emeraldFade,
      });
    }
  }

  /* The finished radiant. It holds face up here; the site turns it on the turntable loop. */
  const radiant = ramp(f, 560, 576);
  if (radiant > 0) {
    const s = 0.7;
    add({
      obj: node({
        parent: root,
        rotation: [HALF, spin, 0],
        scale: [0.88 * s, s, s],
      }),
      model: MODELS.radiant,
      line: COLOR.graphite,
      lineAlpha: radiant,
      fill: COLOR.graphite,
      meshAlpha: 0.3 * radiant,
      fillAlpha: 0.035 * radiant,
      dispersion: ramp(f, 576, 600),
    });
  }

  root.updateMatrixWorld(true);

  return {
    view,
    items,
    laser: span(f, 280, 292, 324, 338),
    // Clears by frame 600, so the loop's dust-free first frame follows on without a pop.
    dust: span(f, 562, 574, 590, 600),
  };
}

/* --------------------------------------------------------------- rendering */

const rgb = (c) => `rgb(${c.map((v) => Math.round(Math.max(0, Math.min(255, v)))).join(",")})`;
const n1 = (v) => v.toFixed(1);

function projector(view) {
  const k = K * view.zoom * U;
  const v = new THREE.Vector3();
  return (x, y, z, matrix) => {
    v.set(x, y, z).applyMatrix4(matrix);
    const persp = CAMERA / (CAMERA - v.z);
    return [view.cx + v.x * k * persp, view.cy - v.y * k * persp, v.z];
  };
}

function renderFrame(f, { spin = 0, file } = {}) {
  const { view, items, laser, dust } = scene(f, spin);
  const project = projector(view);
  const fills = [];
  const meshLines = [];
  const lines = [];
  const extras = [];

  for (const item of items) {
    const m = item.obj.matrixWorld;
    const e = item.model.edges;
    const edgeCount = e.length / 6;
    const pts = [];
    let zMin = Infinity;
    let zMax = -Infinity;
    for (let i = 0; i < e.length; i += 3) {
      const p = project(e[i], e[i + 1], e[i + 2], m);
      pts.push(p);
      zMin = Math.min(zMin, p[2]);
      zMax = Math.max(zMax, p[2]);
    }
    const depth = (z) => 0.32 + 0.68 * smooth((z - zMin) / (zMax - zMin || 1));

    for (let j = 0; j < edgeCount; j++) {
      const a = pts[2 * j];
      const b = pts[2 * j + 1];
      const z = (a[2] + b[2]) / 2;
      let color = item.line;
      if (item.dispersion) {
        const hue = ((Math.atan2(b[1] - a[1], b[0] - a[0]) / Math.PI + 1) * 1.7 + z * 0.4) % 1;
        // Only a few edges carry colour, like fire caught at particular facets.
        const fire = (j * 7919) % 6 === 0 ? 0.6 : 0.08;
        color = mix(item.line, hsl((hue + 1) % 1, 0.85, 0.52), item.dispersion * fire);
      }
      lines.push({ z, s: `<line x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}" stroke="${rgb(color)}" stroke-opacity="${(item.lineAlpha * depth(z)).toFixed(3)}" stroke-width="${(1.25 * U).toFixed(2)}"/>` });
    }

    if (item.meshAlpha > 0.005) {
      const me = item.model.mesh;
      for (let i = 0; i < me.length; i += 6) {
        const a = project(me[i], me[i + 1], me[i + 2], m);
        const b = project(me[i + 3], me[i + 4], me[i + 5], m);
        const z = (a[2] + b[2]) / 2;
        meshLines.push(`<line x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}" stroke="${rgb(COLOR.mesh)}" stroke-opacity="${(item.meshAlpha * depth(z)).toFixed(3)}" stroke-width="${(0.55 * U).toFixed(2)}"/>`);
      }
    }

    if (item.fillAlpha > 0.003) {
      const t = item.model.tris;
      for (let i = 0; i < t.length; i += 9) {
        const a = project(t[i], t[i + 1], t[i + 2], m);
        const b = project(t[i + 3], t[i + 4], t[i + 5], m);
        const c = project(t[i + 6], t[i + 7], t[i + 8], m);
        fills.push({ z: (a[2] + b[2] + c[2]) / 3, s: `<polygon points="${n1(a[0])},${n1(a[1])} ${n1(b[0])},${n1(b[1])} ${n1(c[0])},${n1(c[1])}" fill="${rgb(item.fill)}" fill-opacity="${item.fillAlpha.toFixed(3)}"/>` });
      }
    }

    if (item.puff) {
      const centre = project(0, 0, 0, m);
      const r = rng(Math.round(centre[0] * 13 + centre[1]));
      for (let d = 0; d < 26; d++) {
        const a = r() * Math.PI * 2;
        const rad = (0.2 + r()) * (10 + 70 * item.puff) * U;
        extras.push(`<circle cx="${n1(centre[0] + Math.cos(a) * rad)}" cy="${n1(centre[1] + Math.sin(a) * rad)}" r="${n1((0.6 + r() * 1.6) * U)}" fill="${rgb(COLOR.dust)}" fill-opacity="${(0.55 * (1 - item.puff)).toFixed(3)}"/>`);
      }
    }
  }

  if (dust > 0) {
    const m = new THREE.Matrix4().makeRotationY(f * 0.004);
    const t = ramp(f, 562, 600);
    for (const p of DUST) {
      const grow = 1 + t * p.drift;
      const [x, y] = project(p.x * grow * 1.1, p.y * (1 + t * 0.2), p.z * grow, m);
      extras.push(`<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(p.size * U * 0.7)}" fill="${rgb(COLOR.dust)}" fill-opacity="${(0.5 * dust).toFixed(3)}"/>`);
    }
  }

  if (laser > 0) {
    const hit = [keys(f, [[280, 500], [335, 566]]) * U, keys(f, [[280, 448], [335, 520]]) * U];
    for (const from of [[804 * U, 300 * U], [500 * U, 940 * U]]) {
      const seg = `x1="${n1(from[0])}" y1="${n1(from[1])}" x2="${n1(hit[0])}" y2="${n1(hit[1])}"`;
      extras.push(`<line ${seg} stroke="${rgb(COLOR.laser)}" stroke-opacity="${(0.16 * laser).toFixed(3)}" stroke-width="${(5 * U).toFixed(1)}" stroke-linecap="round"/>`);
      extras.push(`<line ${seg} stroke="${rgb(COLOR.laser)}" stroke-opacity="${(0.95 * laser).toFixed(3)}" stroke-width="${(1.1 * U).toFixed(2)}"/>`);
      extras.push(`<circle cx="${n1(from[0])}" cy="${n1(from[1])}" r="${n1(3.2 * U)}" fill="${rgb(COLOR.laser)}" fill-opacity="${laser.toFixed(3)}"/>`);
    }
    extras.push(`<circle cx="${n1(hit[0])}" cy="${n1(hit[1])}" r="${n1(9 * U)}" fill="${rgb(COLOR.laser)}" fill-opacity="${(0.25 * laser).toFixed(3)}"/>`);
  }

  fills.sort((a, b) => a.z - b.z);
  lines.sort((a, b) => a.z - b.z);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">` +
    `<g>${fills.map((x) => x.s).join("")}</g>` +
    `<g stroke-linecap="round">${meshLines.join("")}${lines.map((x) => x.s).join("")}</g>` +
    `<g>${extras.join("")}</g></svg>`;

  return sharp(Buffer.from(svg), { density: 72 })
    .png({ compressionLevel: 7 })
    .toFile(file ?? path.join(OUT, `_${String(f).padStart(5, "0")}.png`));
}

async function main() {
  const turntable = process.argv.includes("--turntable");
  const arg = process.argv.find((a) => a.startsWith("--frames="));
  const out = turntable ? OUT_TURNTABLE : OUT;
  // The turntable is the stone exactly as it stands on the last sequence frame, turned
  // through evenly spaced angles. 360° itself is left out, so the loop repeats no frame.
  const jobs = turntable
    ? Array.from({ length: TURNTABLE }, (_, i) => ({
        f: FRAMES - 1,
        spin: (i / TURNTABLE) * Math.PI * 2,
        file: path.join(OUT_TURNTABLE, `_${String(i).padStart(5, "0")}.png`),
      }))
    : (arg ? arg.slice(9).split(",").map(Number) : Array.from({ length: FRAMES }, (_, i) => i)).map((f) => ({ f }));
  await fsp.mkdir(out, { recursive: true });

  const lanes = Math.max(2, Math.min(8, os.cpus().length));
  let cursor = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: lanes }, async () => {
      while (cursor < jobs.length) {
        const { f, ...options } = jobs[cursor++];
        await renderFrame(f, options);
        done++;
        if (done % 25 === 0 || done === jobs.length) process.stdout.write(`\r  rendered ${done}/${jobs.length}`);
      }
    }),
  );
  process.stdout.write(`\n  output: ${path.relative(ROOT, out)}\n`);
}

await main();
