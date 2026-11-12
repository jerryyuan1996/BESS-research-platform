/* ---------------------------------------------------------------------------
   System-level symbols for the explanatory scenes: who operates the system,
   who pays, and where the network runs out of room.

   The same 2:1 projection and three-tone materials as the rest of the kit
   (iso.js, symbols.js), and the same rules: generic symbols drawn in-house,
   not site drawings; no words; a symbol is `(x, y, opts, ctx) => <g>` anchored
   on the ground at world (x, y), with lit windows pushed to `ctx.lights`.

   A module of its own, on purpose. symbols.js, iso.js and svg.js are shared
   with every market's investor story and are budgeted with them; nothing here
   is used by those stories, so nothing here is charged to them and none of
   them draws differently because this file exists.

   One light, from the upper left: tops are lightest, the face toward the
   viewer's left is mid, the face toward the right is darkest, and a ground
   shadow falls to the right of what casts it.
   --------------------------------------------------------------------------- */
import { s, n2 } from './svg.js';
import { box, plane, gable, isoLine, at, points } from './iso.js';

const group = (id, cls, ...kids) => s('g', { 'data-component': id, class: `public-equipment ${cls}`.trim(), 'aria-hidden': 'true' }, ...kids);

/** A soft shadow on the ground, cast to the right of a w × d footprint of height h. */
export function groundShadow(x, y, w, d, height){
  const reach = Math.min(1.6, height * 0.45);
  return s('polygon', { class: 'public-shadow', points: points([
    [x + w, y, 0.01], [x + w + reach, y + reach * 0.35, 0.01], [x + w + reach, y + d + reach * 0.35, 0.01], [x + w, y + d, 0.01],
  ]) });
}

/* ---- the operator --------------------------------------------------------- */
/** The system operator's control room: a low hall, a glazed band, a mast and dish. */
export function controlRoom(x, y, opts = {}, ctx){
  const [dx, dy] = at(x + 2.56, y + 0.56, 3.25);
  ctx?.lights?.push(s('polygon', { class: 'k-glow', points: points([
    [x + 0.3, y + 2.42, 0.6], [x + 2.9, y + 2.42, 0.6], [x + 2.9, y + 2.42, 1.15], [x + 0.3, y + 2.42, 1.15]]) }));
  return group('control', 'public-control',
    groundShadow(x, y, 3.2, 2.4, 1.6),
    plane(x - 0.3, y - 0.3, 0.02, 3.8, 3.0, { cls: 'public-pad' }),
    box(x, y, 0.05, 3.2, 2.4, 1.5, { cls: 'public-control-hall' }),
    box(x + 0.25, y + 2.4, 0.55, 2.7, 0.04, 0.62, { cls: 'public-control-glass' }),
    ...[0.95, 1.6, 2.25].map(px => isoLine([[x + px, y + 2.45, 0.56], [x + px, y + 2.45, 1.16]], { cls: 'public-mullion' })),
    box(x - 0.1, y - 0.1, 1.55, 3.4, 2.6, 0.14, { cls: 'public-control-roof' }),
    box(x + 2.5, y + 0.5, 1.69, 0.12, 0.12, 1.5, { cls: 'public-mast' }),
    s('path', { class: 'public-dish', d: `M${n2(dx - 6)},${n2(dy - 3)} A7,7 0 0 0 ${n2(dx + 6)},${n2(dy + 3)} Z` }),
    s('circle', { class: 'public-dish-feed', cx: n2(dx + 2.5), cy: n2(dy - 2.5), r: 1.3 }));
}

/* ---- the payer ------------------------------------------------------------ */
/** The institution that pays: a hall on a plinth with a colonnade and a pediment. */
export function marketHall(x, y, opts = {}, ctx){
  ctx?.lights?.push(s('polygon', { class: 'k-glow', points: points([
    [x + 1.35, y + 2.12, 0.4], [x + 2.05, y + 2.12, 0.4], [x + 2.05, y + 2.12, 1.45], [x + 1.35, y + 2.12, 1.45]]) }));
  return group('payer', 'public-hall',
    groundShadow(x - 0.2, y - 0.2, 3.8, 3.0, 2.6),
    box(x - 0.2, y - 0.2, 0, 3.8, 3.0, 0.25, { cls: 'public-hall-plinth' }),
    box(x + 0.25, y + 0.2, 0.25, 2.9, 1.9, 1.7, { cls: 'public-hall-wall' }),
    box(x + 1.35, y + 2.1, 0.25, 0.7, 0.03, 1.25, { cls: 'public-hall-door' }),
    ...[0, 1, 2, 3].map(i => box(x + 0.22 + i * 0.92, y + 2.3, 0.25, 0.22, 0.22, 1.7, { cls: 'public-hall-column' })),
    box(x, y, 1.95, 3.4, 2.6, 0.18, { cls: 'public-hall-plinth' }),
    gable(x, y, 2.13, 3.4, 2.6, 0.75, { cls: 'public-hall-roof' }).node);
}

/* ---- the network ---------------------------------------------------------- */
/**
 * A converter station on a link between two systems that cannot simply be
 * joined: a valve hall, wall bushings and the converter mark on its face.
 */
export function converterStation(x, y){
  const [mx, my] = at(x + 1.3, y + 2.04, 1.25);
  return group('network', 'public-converter',
    groundShadow(x, y, 2.6, 2.0, 2.4),
    plane(x - 0.3, y - 0.3, 0.02, 3.6, 2.9, { cls: 'public-pad' }),
    box(x, y, 0.05, 2.6, 2.0, 2.3, { cls: 'public-valve-hall' }),
    box(x - 0.08, y - 0.08, 2.35, 2.76, 2.16, 0.12, { cls: 'public-control-roof' }),
    ...[0.5, 1.3, 2.1].map(px => s('g', {},
      box(x + px - 0.08, y - 0.5, 1.5, 0.16, 0.5, 0.16, { cls: 'public-insulator' }),
      box(x + px - 0.08, y - 0.62, 0.5, 0.16, 0.16, 1.16, { cls: 'public-insulator' }))),
    /* alternating current on one side of the mark, direct current on the other */
    s('g', { class: 'public-converter-mark', transform: `translate(${mx},${my})` },
      s('rect', { x: -11, y: -7, width: 22, height: 14, rx: 2 }),
      s('path', { d: 'M-8,0 q2,-5 4,0 t4,0' }),
      s('path', { d: 'M3,-2.5 h6 M3,2.5 h6' })));
}

/** Where a line or a link has run out of room: a pinch mark at a screen point. */
export function congestionMark(px, py){
  return s('g', { class: 'public-congestion', transform: `translate(${n2(px)},${n2(py)})`, 'aria-hidden': 'true' },
    s('circle', { r: 10 }),
    s('path', { d: 'M-7,-4.5 L-1.5,0 L-7,4.5 Z M7,-4.5 L1.5,0 L7,4.5 Z' }));
}

/** Output being held back: a pause mark at a screen point, over a dimmed generator. */
export function curtailedMark(px, py){
  return s('g', { class: 'public-curtailed-mark', transform: `translate(${n2(px)},${n2(py)})`, 'aria-hidden': 'true' },
    s('circle', { r: 10 }),
    s('path', { d: 'M-3.5,-4.5 V4.5 M3.5,-4.5 V4.5' }));
}

/** A switch in a line that is open: the gap and the raised blade. */
export function openMark(px, py){
  return s('g', { class: 'public-open-mark', transform: `translate(${n2(px)},${n2(py)})`, 'aria-hidden': 'true' },
    s('circle', { r: 10 }),
    s('path', { d: 'M-7,3 H-2 M2,3 H7 M-2,3 L4,-4.5' }));
}

/* ---- the sky -------------------------------------------------------------- */
/** Sun and moon in screen space. The stage shows one or the other through data-time. */
export function skyMarks(cx, cy){
  return [
    s('g', { class: 'k-sun', 'aria-hidden': 'true' },
      s('circle', { cx, cy, r: 13 }),
      [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
        const r = a * Math.PI / 180;
        return s('line', { x1: n2(cx + Math.cos(r) * 18), y1: n2(cy + Math.sin(r) * 18), x2: n2(cx + Math.cos(r) * 23), y2: n2(cy + Math.sin(r) * 23) });
      })),
    s('path', { class: 'k-moon', 'aria-hidden': 'true',
      d: `M${cx + 5},${cy - 12} A13,13 0 1,0 ${cx + 5},${cy + 12} A10,10 0 1,1 ${cx + 5},${cy - 12} Z` }),
  ];
}
