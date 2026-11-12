/* The story kit (immersive-experience plan, WP-06): the isometric symbols, the
   stage, the day chart and the WA day profile, rendered against a minimal
   SVG document so the structure can be checked without a browser. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';

/* ---- a minimal document: elements, attributes, children, text ---------- */
class El {
  constructor(tag){ this.tag = tag; this.attrs = new Map(); this.children = []; this.nodeType = 1; }
  setAttribute(k, v){ this.attrs.set(k, String(v)); }
  getAttribute(k){ return this.attrs.get(k) ?? null; }
  append(...c){ this.children.push(...c); }
}
globalThis.document = {
  createElementNS: (_, tag) => new El(tag),
  createElement: (tag) => new El(tag),
  createTextNode: (text) => ({ nodeType: 3, text }),
};
const walk = (node, visit) => { visit(node); for (const c of node.children || []) walk(c, visit); };
const all = (node, pred) => { const out = []; walk(node, n => { if (pred(n)) out.push(n); }); return out; };
const elements = (node) => all(node, n => n.nodeType === 1);
const texts = (node) => all(node, n => n.nodeType === 3).map(n => n.text);
const byTag = (node, tag) => all(node, n => n.tag === tag);
const cls = (n) => (n.getAttribute?.('class') || '').split(/\s+/);

const { project, box, UNIT } = await import('../src/experience/story/kit/iso.js');
const { SYMBOLS, isoStage, setTime } = await import('../src/experience/story/kit/symbols.js');
const { dayChart, intervalIndex } = await import('../src/experience/story/kit/chart.js');
const { WA_STORY_DAY, WA_OBLIGATION_WINDOW } = await import('../src/markets/wa/data/storyDay.js');
const { app } = await import('../src/app/state.js');

test('the projection is a 2:1 isometric grid', () => {
  assert.deepEqual(project(1, 0, 0), [UNIT, UNIT / 2]);
  assert.deepEqual(project(0, 1, 0), [-UNIT, UNIT / 2]);
  assert.deepEqual(project(0, 0, 1), [0, -UNIT]);
});

test('a box paints its left, right and top faces, in that order', () => {
  const g = box(0, 0, 0, 1, 1, 1);
  assert.deepEqual(g.children.map(c => cls(c)[0]), ['k-l', 'k-r', 'k-t']);
  for (const f of g.children) assert.equal(f.getAttribute('points').split(' ').length, 4);
});

test('every symbol renders as a decorative group with no words in it', () => {
  assert.ok(Object.keys(SYMBOLS).length >= 19, 'about twenty symbols');
  for (const [name, make] of Object.entries(SYMBOLS)){
    const ctx = { lights: [] };
    const node = make(0, 0, {}, ctx);
    assert.equal(node.getAttribute('aria-hidden'), 'true', `${name} is decorative`);
    assert.equal(texts(node).length, 0, `${name} carries no text`);
    for (const el of elements(node)) for (const v of el.attrs.values()) assert.ok(!/NaN|undefined/.test(v), `${name}: ${v}`);
  }
});

test('a symbol marked future is drawn as a plan, not as built', () => {
  assert.ok(cls(SYMBOLS.plant(0, 0, { future: true })).includes('k-future'));
  assert.ok(!cls(SYMBOLS.plant(0, 0, {})).includes('k-future'));
});

const scene = (extra = {}) => isoStage({
  title: ['A schematic grid', '电网示意'], desc: ['Generic symbols, not a map', '通用符号，非地图'],
  items: [
    { symbol: 'ground', at: [-2, -2] },
    { symbol: 'battery', at: [8, 8] }, { symbol: 'home', at: [2, 2] }, { symbol: 'plant', at: [0, 0] },
  ],
  labels: [{ at: [8, 8, 1], text: ['Battery', '电池'] }],
  ...extra,
});

test('a stage is an image with a title and description, and labels as real text', () => {
  app.lang = 'en';
  const svg = scene();
  assert.equal(svg.getAttribute('role'), 'img');
  const [t] = byTag(svg, 'title'), [d] = byTag(svg, 'desc');
  assert.deepEqual(svg.getAttribute('aria-labelledby').split(' '), [t.getAttribute('id'), d.getAttribute('id')]);
  assert.deepEqual(texts(t), ['A schematic grid']);
  assert.ok(texts(svg).includes('Battery'));
  app.lang = 'zh';
  const zh = scene();
  assert.ok(texts(zh).includes('电池') && texts(zh).includes('电网示意'));
  app.lang = 'en';
});

test('symbols are painted back to front, whatever order they are listed in', () => {
  const world = all(scene(), n => cls(n).includes('k-world'))[0];
  const order = world.children.map(c => cls(c).find(k => k.startsWith('k-') && k !== 'k-sym'));
  assert.deepEqual(order, ['k-ground-sym', 'k-plant', 'k-home', 'k-battery']);
});

test('time of day is an attribute, changed without redrawing', () => {
  const svg = scene({ time: 'dusk' });
  assert.equal(svg.getAttribute('data-time'), 'dusk');
  const before = svg.children.length;
  setTime(svg, 'night');
  assert.equal(svg.getAttribute('data-time'), 'night');
  assert.equal(svg.children.length, before);
  assert.equal(all(scene({ sky: false }), n => cls(n).includes('k-sun')).length, 0);
});

test('an unknown symbol is an error, not a blank', () => {
  assert.throws(() => isoStage({ items: [{ symbol: 'nope', at: [0, 0] }] }), /Unknown symbol/);
});

test('a busy scene stays within the 1,500-node budget', () => {
  const items = [{ symbol: 'ground', at: [-2, -2], opts: { w: 30, d: 24 } }];
  for (let i = 0; i < 30; i++) items.push({ symbol: i % 2 ? 'homeSolar' : 'home', at: [(i % 6) * 2.5, Math.floor(i / 6) * 2.5] });
  for (const symbol of Object.keys(SYMBOLS)) items.push({ symbol, at: [18, 2] });
  const svg = isoStage({ items, labels: [{ at: [0, 0, 0], text: ['A', 'A'] }] });
  const count = elements(svg).length;
  assert.ok(count < 1500, `${count} nodes`);
});

const evening = (extra = {}) => dayChart({
  title: ['The long evening', '漫长的傍晚'], desc: ['Evening window', '傍晚时段'],
  series: [{ key: 'grid', values: WA_STORY_DAY.gridMW, kind: 'area', label: ['Grid demand', '电网需求'], className: 'k-s-grid' }],
  window: { first: WA_OBLIGATION_WINDOW.firstInterval, last: WA_OBLIGATION_WINDOW.lastInterval, label: ['Obligation window (AEMO)', '义务时段（AEMO）'] },
  strip: { maxMW: 100, label: ['Example: 100 MW battery', '示例：100MW电池'],
    legend: [{ kind: 'output', label: ['Delivers at full power', '满功率输出'] }, { kind: 'credited', label: ['Credited power', '计入信用的功率'] }],
    rows: [{ label: ['4 hours (Example)', '4小时（示例）'], bars: [
      { first: '15:30', last: '22:00', mw: 400 / 7, kind: 'credited' }, { first: '17:00', last: '20:30', mw: 100, kind: 'output' }] }] },
  ...extra,
});

test('interval indices run on a 30-minute clock', () => {
  assert.equal(intervalIndex('00:00'), 0);
  assert.equal(intervalIndex('15:30'), 31);
  assert.equal(intervalIndex('23:30'), 47);
});

test('the day chart is an image with its words from the pairs it is given', () => {
  const svg = evening();
  assert.equal(svg.getAttribute('role'), 'img');
  const words = texts(svg).filter(t => !/^[\d,:]+$/.test(t));
  assert.deepEqual(new Set(words), new Set(['The long evening', 'Evening window', 'Obligation window (AEMO)', 'MW',
    'Grid demand', 'Example: 100 MW battery', 'Delivers at full power', 'Credited power', '4 hours (Example)']));
  for (const el of elements(svg)) for (const v of el.attrs.values()) assert.ok(!/NaN|undefined/.test(v), v);
});

test('the window band covers exactly its intervals, in both panels', () => {
  const svg = evening();
  const band = all(svg, n => cls(n).includes('k-window'))[0].children[0];
  const x = (i) => 58 + (i / 48) * (720 - 58 - 18);
  assert.equal(+band.getAttribute('x'), +x(31).toFixed(2));
  assert.equal(+band.getAttribute('width'), +(x(45) - x(31)).toFixed(2), '14 intervals: 15:30 to 22:30');
  const viewH = +svg.getAttribute('viewBox').split(' ')[3];
  assert.ok(+band.getAttribute('y') + +band.getAttribute('height') > viewH - 40, 'reaches down through the strip');
});

test('the series is drawn at 48 interval midpoints', () => {
  const area = all(evening(), n => cls(n).includes('k-area'))[0];
  assert.equal((area.getAttribute('d').match(/[ML]/g) || []).length, 96, '48 along the top, 48 back along the base');
});

test('what a battery delivers is drawn over what it is credited for', () => {
  const bars = all(evening(), n => cls(n).includes('k-bar'));
  assert.deepEqual(bars.map(b => cls(b)[1]), ['k-bar-credited', 'k-bar-output']);
});

test('the compact chart is narrower, for phones', () => {
  assert.equal(evening({ compact: true }).getAttribute('viewBox').split(' ')[2], '400');
  assert.equal(evening().getAttribute('viewBox').split(' ')[2], '720');
});

/* RAISED FROM 60 TO 74 KiB (2026-11-12) for the explanatory scenes: the kit
   gained the step-through player (sequence.js), the four drawing layers and
   their legend (layers.js) and the operator, payer and network symbols
   (network.js), 22.4 KiB of source between them, and powerStation.js grew by
   its opt-in detail. Measured 73,482 bytes, 71.8 KiB. None of the three new
   files is exported from index.js, so no investor story loads them: only the
   market-background scene does, and its shipped size is held by the
   'public-scene' entry in tests/bundle-budget.test.js. */
test('the kit stays under its 74 KiB budget and loads its stylesheet itself', () => {
  const dir = new URL('../src/experience/story/kit/', import.meta.url);
  const files = readdirSync(dir).map(f => statSync(new URL(f, dir)).size);
  const css = statSync(new URL('../src/styles/story.css', import.meta.url)).size;
  const total = files.reduce((a, b) => a + b, 0) + css;
  assert.ok(total < 74 * 1024, `${total} bytes`);
  const index = readFileSync(new URL('index.js', dir), 'utf8');
  for (const file of ['sequence.js', 'layers.js', 'network.js']) assert.ok(!index.includes(file), `${file} must not ride with every investor story`);
  assert.match(readFileSync(new URL('index.js', dir), 'utf8'), /import '\.\.\/\.\.\/\.\.\/styles\/story\.css'/);
});

test('the WA day profile has the shape its record describes', () => {
  const g = WA_STORY_DAY.gridMW, r = WA_STORY_DAY.rooftopMW;
  assert.equal(g.length, 48); assert.equal(r.length, 48);
  for (const v of [...g, ...r]) assert.ok(Number.isFinite(v) && v >= 0 && v < 6000);
  assert.equal(WA_STORY_DAY.days, 82);
  assert.equal(g.indexOf(Math.max(...g)), intervalIndex('18:30'), 'the evening peak');
  assert.equal(g.indexOf(Math.min(...g)), intervalIndex('11:00'), 'the midday trough');
  assert.ok(r[intervalIndex('12:00')] > g[intervalIndex('12:00')], 'rooftops supply more than the grid at noon');
  // The 14 highest intervals are contiguous and sit within one interval of
  // AEMO's printed window (CF-WA-02).
  const top = g.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 14).map(p => p[1]).sort((a, b) => a - b);
  assert.equal(top[13] - top[0], 13, 'contiguous');
  assert.ok(Math.abs(top[0] - intervalIndex(WA_OBLIGATION_WINDOW.firstInterval)) <= 1);
  assert.equal(intervalIndex(WA_OBLIGATION_WINDOW.lastInterval) - intervalIndex(WA_OBLIGATION_WINDOW.firstInterval) + 1, 14, 'seven hours');
});
