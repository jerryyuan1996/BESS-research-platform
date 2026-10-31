/* ---------------------------------------------------------------------------
   Isometric projection on a 2:1 grid, and the solids every symbol is built of.

   World units: x runs down to the right, y down to the left, z up. The viewer
   sits at large x + y, so the visible faces of a box are its top, the face at
   y + d (drawn on the left, class k-l) and the face at x + w (on the right,
   class k-r). Each face takes its fill from the material's three tones in
   src/styles/story.css, so time of day and theme are colour, not geometry.

   This draws a fixed view only: no camera, no rotation, no animation loop.
   --------------------------------------------------------------------------- */
import { s, n2 } from './svg.js';

/** Pixels per world unit. Scenes scale with the SVG viewBox, not with this. */
export const UNIT = 16;

/** World point to screen point. */
export function project(x, y, z = 0, u = UNIT){
  return [(x - y) * u, (x + y) * u / 2 - z * u];
}

/** A polygon's points attribute from world points. */
export function points(list, u = UNIT){
  return list.map(([x, y, z]) => project(x, y, z, u).map(n2).join(',')).join(' ');
}

const face = (cls, list, u) => s('polygon', { class: cls, points: points(list, u) });

/** A box: three visible faces, painted back to front. */
export function box(x, y, z, w, d, h, { cls = '', u = UNIT } = {}){
  return s('g', { class: `k-box ${cls}`.trim() },
    face('k-l', [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], u),
    face('k-r', [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], u),
    face('k-t', [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], u));
}

/** A flat quad at height z: ground, pads, panels laid flat. */
export function plane(x, y, z, w, d, { cls = '', u = UNIT } = {}){
  return face(cls || 'k-t', [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]], u);
}

/** A tilted panel: its back edge raised by `rise`. Solar rows and roof panels. */
export function tilted(x, y, z, w, d, rise, { cls = 'k-panel', u = UNIT } = {}){
  return face(cls, [[x, y, z + rise], [x + w, y, z + rise], [x + w, y + d, z], [x, y + d, z]], u);
}

/**
 * A gable roof over a w × d footprint at height z, ridge along x, peak height h.
 * Returns the group and the front slope's corners, so a symbol can lay solar
 * panels on it.
 */
export function gable(x, y, z, w, d, h, { cls = 'k-roof', u = UNIT } = {}){
  const ridge = y + d / 2;
  const front = [[x, y + d, z], [x + w, y + d, z], [x + w, ridge, z + h], [x, ridge, z + h]];
  const g = s('g', { class: `k-box ${cls}` },
    face('k-r', [[x, y, z], [x + w, y, z], [x + w, ridge, z + h], [x, ridge, z + h]], u),
    face('k-r', [[x + w, y, z], [x + w, y + d, z], [x + w, ridge, z + h]], u),
    face('k-t', front, u));
  return { node: g, front };
}

/** A line through world points, as a polyline. */
export function isoLine(list, { cls = 'k-wire', u = UNIT } = {}){
  return s('polyline', { class: cls, points: points(list, u) });
}

/** Screen-space point for a world point, for labels and overlays. */
export const at = (x, y, z = 0, u = UNIT) => project(x, y, z, u).map(n2);

/** Painter's order: further back (smaller x + y) first. */
export const depth = (item) => (item.at?.[0] ?? 0) + (item.at?.[1] ?? 0) + (item.depthBias ?? 0);
