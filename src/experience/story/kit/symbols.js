/* ---------------------------------------------------------------------------
   The isometric symbol kit (immersive-experience plan, WP-06).

   Generic symbols, drawn in-house, for every market's scenes: they are not
   site drawings, equipment lists or engineering layouts, and they carry no
   words. Each symbol is `(x, y, opts, ctx) => <g>`, anchored on the ground at
   world (x, y). Windows and lamps go to `ctx.lights`, which the stage paints
   above the dusk and night tint so they glow. `opts.future` draws a symbol
   dashed and pale: a plan or scenario, never shown as built.

   isoStage() composes a scene: symbols in painter's order, then the tint, the
   lights and the labels. Labels are SVG text from [en, zh] pairs, so screen
   readers, translation and printing see real words.
   --------------------------------------------------------------------------- */
import { L } from '../../../app/i18n.js';
import { s, n2, uid } from './svg.js';
import { box, plane, tilted, gable, isoLine, at, depth, project, UNIT } from './iso.js';

const g = (cls, opts, ...kids) => s('g', {
  class: `k-sym ${cls}${opts?.future ? ' k-future' : ''}${opts?.highlight ? ' k-hi' : ''}`,
  'aria-hidden': 'true',
}, ...kids);

const windowsOn = (ctx, x, y, z, w, d, count) => {
  // small lit windows on the left (y + d) face
  for (let i = 0; i < count; i++){
    const wx = x + (w / (count + 1)) * (i + 1) - 0.15;
    ctx?.lights?.push(s('polygon', { class: 'k-glow', points:
      [[wx, y + d, z], [wx + 0.3, y + d, z], [wx + 0.3, y + d, z + 0.35], [wx, y + d, z + 0.35]]
        .map(([a, b, c]) => project(a, b, c).map(n2).join(',')).join(' ') }));
  }
};

/* ---- the land ------------------------------------------------------------ */
const ground = (x, y, { w = 20, d = 14 } = {}) => g('k-ground-sym', null, plane(x, y, 0, w, d, { cls: 'k-ground' }));
const pad = (x, y, { w = 3, d = 3 } = {}) => g('k-pad-sym', null, plane(x, y, 0.02, w, d, { cls: 'k-pad' }));
const tree = (x, y, opts = {}) => g('k-tree', opts,
  box(x + 0.35, y + 0.35, 0, 0.3, 0.3, 0.7, { cls: 'k-trunk' }),
  box(x, y, 0.6, 1, 1, 1, { cls: 'k-leaf' }));

/* ---- demand -------------------------------------------------------------- */
function home(x, y, opts = {}, ctx){
  const roof = gable(x, y, 1.2, 2, 2, 0.9);
  const kids = [box(x, y, 0, 2, 2, 1.2, { cls: 'k-house' }), roof.node];
  if (opts.solar){
    // a panel inset on the front slope
    const [a, b, c, d2] = roof.front;
    const lerp = (p, q, t) => p.map((v, i) => v + (q[i] - v) * t);
    const p1 = lerp(lerp(a, d2, 0.25), lerp(b, c, 0.25), 0.15);
    const p2 = lerp(lerp(a, d2, 0.25), lerp(b, c, 0.25), 0.85);
    const p3 = lerp(lerp(a, d2, 0.8), lerp(b, c, 0.8), 0.85);
    const p4 = lerp(lerp(a, d2, 0.8), lerp(b, c, 0.8), 0.15);
    kids.push(s('polygon', { class: 'k-panel', points: [p1, p2, p3, p4].map(([px, py, pz]) => project(px, py, pz).map(n2).join(',')).join(' ') }));
  }
  windowsOn(ctx, x, y, 0.35, 2, 2, 2);
  return g('k-home', opts, ...kids);
}
const homeSolar = (x, y, opts = {}, ctx) => home(x, y, { ...opts, solar: true }, ctx);

function city(x, y, opts = {}, ctx){
  windowsOn(ctx, x + 1.6, y, 3, 1.2, 1.2, 2);
  windowsOn(ctx, x, y + 1.6, 1.6, 1.4, 1.4, 2);
  return g('k-city', opts,
    box(x, y, 0, 1.4, 1.4, 4.2, { cls: 'k-tower' }),
    box(x + 1.6, y, 0, 1.2, 1.2, 6, { cls: 'k-tower k-tower-2' }),
    box(x, y + 1.6, 0, 1.4, 1.4, 2.8, { cls: 'k-tower' }));
}

function industry(x, y, opts = {}, ctx){
  const kids = [box(x, y, 0, 4, 3, 1.6, { cls: 'k-shed' })];
  for (let i = 0; i < 3; i++){
    kids.push(tilted(x + i * (4 / 3), y, 1.6, 4 / 3, 3, 0.7, { cls: 'k-shed-roof' }));
  }
  windowsOn(ctx, x, y, 0.4, 4, 3, 3);
  return g('k-industry', opts, ...kids);
}

/* ---- supply -------------------------------------------------------------- */
function plant(x, y, opts = {}, ctx){
  windowsOn(ctx, x, y, 0.8, 4, 3, 2);
  return g('k-plant', opts,
    box(x, y, 0, 4, 3, 2.4, { cls: 'k-hall' }),
    box(x + 0.6, y - 2.2, 0, 2, 2, 3.4, { cls: 'k-boiler' }),
    box(x + 3.2, y - 1.8, 0, 0.7, 0.7, 6.2, { cls: 'k-stack' }));
}

function wind(x, y, opts = {}){
  const [bx, by] = at(x, y, 0);
  const [hx, hy] = at(x, y, 7);
  const blade = (deg) => {
    const r = deg * Math.PI / 180, len = 3.2 * UNIT;
    return s('line', { class: 'k-blade', x1: hx, y1: hy, x2: n2(hx + Math.cos(r) * len), y2: n2(hy + Math.sin(r) * len) });
  };
  return g('k-wind', opts,
    s('polygon', { class: 'k-mast', points: `${n2(bx - 3)},${by} ${n2(bx + 3)},${by} ${n2(hx + 1)},${hy} ${n2(hx - 1)},${hy}` }),
    blade(-90), blade(30), blade(150),
    s('circle', { class: 'k-hub', cx: hx, cy: hy, r: 2.2 }));
}

function solarFarm(x, y, opts = {}){
  const { rows = 4, w = 5 } = opts;
  const kids = [];
  for (let i = 0; i < rows; i++) kids.push(tilted(x, y + i * 1.3, 0.25, w, 0.8, 0.5));
  return g('k-solarfarm', opts, ...kids);
}

/* ---- network ------------------------------------------------------------- */
function pylon(x, y, opts = {}){
  const [bx, by] = at(x, y, 0);
  const [tx, ty] = at(x, y, 5);
  const [ax, ay] = at(x, y, 4.6);
  return g('k-pylon', opts,
    s('polyline', { class: 'k-lattice', points: `${n2(bx - 5)},${by} ${tx},${ty} ${n2(bx + 5)},${by}` }),
    s('line', { class: 'k-lattice', x1: n2(ax - 9), y1: n2(ay + 2), x2: n2(ax + 9), y2: n2(ay - 2) }));
}
/** The wire between two pylons, sagging a little. Points are world (x, y). */
export function wire(a, b, { z = 4.6, sag = 0.5, cls = 'k-wire' } = {}){
  const [x1, y1] = at(a[0], a[1], z), [x2, y2] = at(b[0], b[1], z);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag * UNIT;
  return s('path', { class: cls, d: `M${x1},${y1} Q${n2(mx)},${n2(my)} ${x2},${y2}`, 'aria-hidden': 'true' });
}

function substation(x, y, opts = {}){
  return g('k-substation', opts,
    plane(x, y, 0.02, 3, 3, { cls: 'k-pad' }),
    box(x + 0.4, y + 0.4, 0, 1, 0.8, 1, { cls: 'k-xfmr' }),
    box(x + 1.7, y + 0.4, 0, 1, 0.8, 1, { cls: 'k-xfmr' }),
    box(x + 0.3, y + 2.1, 0, 0.15, 0.15, 1.8, { cls: 'k-post' }),
    box(x + 1.4, y + 2.1, 0, 0.15, 0.15, 1.8, { cls: 'k-post' }),
    box(x + 2.5, y + 2.1, 0, 0.15, 0.15, 1.8, { cls: 'k-post' }));
}

/** The link that is not there: a dashed run that stops at a break mark. */
function noLink(x, y, opts = {}){
  const { length = 6 } = opts;
  const [ex, ey] = at(x + length, y, 0.4);
  return g('k-nolink', opts,
    isoLine([[x, y, 0.4], [x + length, y, 0.4]], { cls: 'k-link-missing' }),
    s('path', { class: 'k-break', d: `M${n2(ex - 5)},${n2(ey - 5)} L${n2(ex + 5)},${n2(ey + 5)} M${n2(ex + 5)},${n2(ey - 5)} L${n2(ex - 5)},${n2(ey + 5)}` }));
}

/** Schematic flow chevrons along a line between world points. Not a measured flow. */
function flow(x, y, opts = {}){
  const { to = [x + 4, y], z = 0.5, count = 3, reverse = false } = opts;
  const a = at(x, y, z), b = at(to[0], to[1], z);
  const [p, q] = reverse ? [b, a] : [a, b];
  const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
  const kids = [];
  for (let i = 1; i <= count; i++){
    const t = i / (count + 1);
    const cx = n2(p[0] + (q[0] - p[0]) * t), cy = n2(p[1] + (q[1] - p[1]) * t);
    kids.push(s('path', { class: 'k-chevron', d: 'M-4,-4 L2,0 L-4,4', transform: `translate(${cx},${cy}) rotate(${n2(ang)})` }));
  }
  return g('k-flow', opts, ...kids);
}

/* ---- the battery station and its parts ------------------------------------ */
function battery(x, y, opts = {}){
  const { count = 3 } = opts;
  const kids = [];
  for (let i = 0; i < count; i++) kids.push(box(x, y + i * 1.4, 0, 2.6, 1, 1.1, { cls: 'k-container' }));
  return g('k-battery', opts, ...kids);
}
const pcs = (x, y, opts = {}) => g('k-pcs', opts, box(x, y, 0, 0.9, 0.9, 1.1, { cls: 'k-cabinet' }));
function transformer(x, y, opts = {}){
  return g('k-transformer', opts,
    box(x, y, 0, 1.3, 1, 1.2, { cls: 'k-xfmr' }),
    box(x + 0.2, y + 0.4, 1.2, 0.15, 0.15, 0.6, { cls: 'k-bushing' }),
    box(x + 0.6, y + 0.4, 1.2, 0.15, 0.15, 0.6, { cls: 'k-bushing' }),
    box(x + 1.0, y + 0.4, 1.2, 0.15, 0.15, 0.6, { cls: 'k-bushing' }));
}
function controls(x, y, opts = {}, ctx){
  ctx?.lights?.push(plane(x + 0.15, y + 0.6, 0.55, 0.5, 0.01, { cls: 'k-glow' }));
  return g('k-controls', opts, box(x, y, 0, 0.9, 0.6, 0.9, { cls: 'k-cabinet' }));
}
const meter = (x, y, opts = {}) => g('k-meter', opts, box(x, y, 0, 0.4, 0.3, 0.6, { cls: 'k-cabinet' }));

/* ---- sky ------------------------------------------------------------------ */
/* Screen-space, placed by the stage. The stage shows the sun by day and dusk
   and the moon at night, through CSS on data-time. */
const sun = (cx, cy) => s('g', { class: 'k-sun', 'aria-hidden': 'true' },
  s('circle', { cx, cy, r: 14 }),
  [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
    const r = a * Math.PI / 180;
    return s('line', { x1: n2(cx + Math.cos(r) * 19), y1: n2(cy + Math.sin(r) * 19), x2: n2(cx + Math.cos(r) * 25), y2: n2(cy + Math.sin(r) * 25) });
  }));
const moon = (cx, cy) => s('path', { class: 'k-moon', 'aria-hidden': 'true',
  d: `M${cx + 6},${cy - 13} A14,14 0 1,0 ${cx + 6},${cy + 13} A11,11 0 1,1 ${cx + 6},${cy - 13} Z` });

/** Every symbol by id: the kit sheet and the scene layouts refer to these. */
export const SYMBOLS = {
  ground, pad, tree, home, homeSolar, city, industry, plant, wind, solarFarm,
  pylon, substation, noLink, flow, battery, pcs, transformer, controls, meter,
};

/* ---- the stage ------------------------------------------------------------ */

/**
 * One fixed-view isometric scene.
 *
 *   viewBox   [width, height] in screen units; the SVG scales to its container
 *   origin    screen offset of world (0, 0)
 *   time      'day' | 'dusk' | 'night'; change it later with setTime()
 *   title     [en, zh] short name; desc: [en, zh] what the scene shows
 *   items     [{ symbol, at: [x, y], opts }], painted back to front
 *   wires     [[ax, ay], [bx, by]] pairs, or { from, to, ...opts }
 *   labels    [{ at: [x, y, z], text: [en, zh], dx, dy, anchor }]
 *   sky       false to leave out the sun and moon (a kit sheet, a cutaway)
 */
export function isoStage({ viewBox = [640, 400], origin = [320, 120], time = 'day', title, desc, items = [], wires = [], labels = [], className = '', sky = true }){
  const [w, h] = viewBox;
  const ids = { title: uid('k-title'), desc: uid('k-desc') };
  const ctx = { lights: [] };
  const world = [...items].sort((a, b) => depth(a) - depth(b)).map(item => {
    const make = SYMBOLS[item.symbol];
    if (!make) throw new Error(`Unknown symbol "${item.symbol}"`);
    return make(item.at[0], item.at[1], item.opts || {}, ctx);
  });
  const wireNodes = wires.map(wr => Array.isArray(wr) ? wire(wr[0], wr[1]) : wire(wr.from, wr.to, wr));
  const labelNodes = labels.map(lb => {
    const [lx, ly] = at(lb.at[0], lb.at[1], lb.at[2] || 0);
    return s('g', { class: `k-label-g${lb.future ? ' k-future' : ''}` },
      s('circle', { class: 'k-label-dot', cx: lx, cy: ly, r: 2 }),
      s('text', { class: 'k-label', x: n2(lx + (lb.dx ?? 6)), y: n2(ly + (lb.dy ?? -6)), 'text-anchor': lb.anchor || 'start' }, L(lb.text)));
  });
  return s('svg', {
    class: `k-stage ${className}`.trim(), viewBox: `0 0 ${w} ${h}`, 'data-time': time,
    role: 'img', 'aria-labelledby': `${ids.title} ${ids.desc}`, preserveAspectRatio: 'xMidYMid meet',
  },
    s('title', { id: ids.title }, title ? L(title) : ''),
    s('desc', { id: ids.desc }, desc ? L(desc) : ''),
    s('rect', { class: 'k-sky', x: 0, y: 0, width: w, height: h }),
    sky ? [sun(w - 56, 46), moon(w - 56, 46)] : null,
    s('g', { class: 'k-world', transform: `translate(${origin[0]},${origin[1]})` }, world, wireNodes),
    s('rect', { class: 'k-tint', x: 0, y: 0, width: w, height: h }),
    s('g', { class: 'k-lights', transform: `translate(${origin[0]},${origin[1]})`, 'aria-hidden': 'true' }, ctx.lights),
    s('g', { class: 'k-labels', transform: `translate(${origin[0]},${origin[1]})` }, labelNodes));
}

/** Change a stage's time of day in place: colour only, no rebuild. */
export function setTime(stage, time){
  stage.setAttribute('data-time', time);
}
