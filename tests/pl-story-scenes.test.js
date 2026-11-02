/* ---------------------------------------------------------------------------
   Poland's scenes, built against a minimal document: every shot finds its
   scene, every scene reads in both languages, every control is a labelled
   toggle that changes the drawing and never the case, and the signature chart
   takes its numbers only from the registered records — and only once the gate
   is open.

   The built dialog is exercised in e2e/story.spec.js.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

class El {
  constructor(tag){ this.tag = tag; this.attrs = new Map(); this.children = []; this.nodeType = 1; this.listeners = {}; this.hidden = false; this.style = {}; }
  setAttribute(k, v){ this.attrs.set(k, String(v)); }
  getAttribute(k){ return this.attrs.get(k) ?? null; }
  removeAttribute(k){ this.attrs.delete(k); }
  hasAttribute(k){ return this.attrs.has(k); }
  set className(v){ this.attrs.set('class', String(v)); }
  get className(){ return this.attrs.get('class') || ''; }
  append(...c){ this.children.push(...c); }
  replaceChildren(...c){ this.children = [...c]; }
  get firstChild(){ return this.children[0] ?? null; }
  get parentNode(){ return null; }
  addEventListener(type, fn){ (this.listeners[type] ||= []).push(fn); }
  click(){ for (const fn of this.listeners.click || []) fn({ target: this }); }
  closest(){ return null; }
}
globalThis.document = {
  createElementNS: (_, tag) => new El(tag),
  createElement: (tag) => new El(tag),
  createTextNode: (text) => ({ nodeType: 3, text: String(text) }),
};

const walk = (node, visit) => { visit(node); for (const c of node.children || []) walk(c, visit); };
const all = (node, pred) => { const out = []; walk(node, n => { if (pred(n)) out.push(n); }); return out; };
const elements = (node) => all(node, n => n.nodeType === 1);
const texts = (node) => all(node, n => n.nodeType === 3).map(n => n.text);
const byTag = (node, tag) => all(node, n => n.tag === tag);
const cls = (n) => (n.getAttribute?.('class') || '').split(/\s+/).filter(Boolean);
const surface = (node) => [...texts(node), ...elements(node).flatMap(e => [...e.attrs.values()])];
const series = (node, name) => all(node, n => n.getAttribute?.('data-series') === name);

const { app } = await import('../src/app/state.js');
const { scenes } = await import('../src/markets/pl/story/scenes.js');
const { story } = await import('../src/markets/pl/story.js');
const { storyValues } = await import('../src/markets/pl/storyBindings.js');
const { opportunities, CALLS, returnPct } = await import('../src/experience/model.js');
const { marginText } = await import('../src/experience/decision.js');
const { auctionChart, exampleAuctionChart, signatureChart, auctionTable } = await import('../src/markets/pl/story/chart.js');
const { PL_AUCTIONS, PL_CHART, PL_SUCCESSOR, auctionSeries } = await import('../src/markets/pl/data/capacityAuctions.js');

const row = opportunities('infraFund').find(r => r.id === 'pl');
const values = storyValues(row, { CALLS, returnPct, marginText });
const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const build = (shot, lang = 'en') => { app.lang = lang; return scenes[shot.scene](shot, { values, row }); };
const controlsOf = (node) => byTag(node, 'button').filter(b => cls(b).includes('k-toggle'));

test('every shot has a scene and every scene is used', () => {
  for (const shot of shots) assert.equal(typeof scenes[shot.scene], 'function', `${shot.id}: ${shot.scene}`);
  const used = new Set(shots.map(s => s.scene));
  for (const id of Object.keys(scenes)) assert.ok(used.has(id), `scene ${id} has no shot`);
  assert.equal(Object.keys(scenes).length, 13);
});

test('every scene reads in both languages with no gap', () => {
  for (const lang of ['en', 'zh']){
    for (const shot of shots){
      const node = build(shot, lang);
      for (const value of surface(node)) assert.ok(!/NaN|undefined|\[object|\{[a-zA-Z]+\}/.test(value), `${shot.id} ${lang}: ${value}`);
      const words = texts(node).filter(text => /[A-Za-z一-鿿]/.test(text));
      assert.ok(words.length > 0, `${shot.id} ${lang} has words`);
      if (lang === 'zh') assert.ok(words.some(text => /[一-鿿]/.test(text)), `${shot.id} reads in Chinese`);
    }
  }
  app.lang = 'en';
});

test('every scene stays inside the node budget', () => {
  for (const shot of shots) assert.ok(all(build(shot), () => true).length <= 1500, `${shot.id}`);
});

test('every drawing is a named image', () => {
  for (const shot of shots){
    for (const svg of byTag(build(shot), 'svg').filter(node => node.getAttribute('role') === 'img')){
      const title = byTag(svg, 'title')[0];
      assert.ok(title && texts(title).join('').trim(), `${shot.id}: the image has a title`);
      assert.ok(svg.getAttribute('aria-labelledby'), `${shot.id}: the image is labelled`);
    }
  }
});

test('controls are labelled groups of pressed toggles', () => {
  for (const shot of shots){
    const node = build(shot);
    for (const group of all(node, n => n.getAttribute?.('role') === 'group')) assert.ok(group.getAttribute('aria-label'), `${shot.id}: group label`);
    for (const button of controlsOf(node)){
      assert.equal(button.getAttribute('type'), 'button');
      assert.ok(['true', 'false'].includes(button.getAttribute('aria-pressed')), `${shot.id}: aria-pressed`);
      assert.ok(texts(button).join('').trim(), `${shot.id}: the button has words`);
    }
  }
});

test('every control changes the drawing, and never the case', () => {
  const before = JSON.stringify({ row, values });
  for (const shot of shots){
    const node = build(shot);
    for (const button of controlsOf(node).filter(b => b.getAttribute('aria-pressed') !== 'true')){
      const was = JSON.stringify(surface(node));
      button.click();
      assert.notEqual(JSON.stringify(surface(node)), was, `${shot.id}: "${texts(button).join('')}" changes nothing`);
    }
  }
  assert.equal(JSON.stringify({ row, values }), before, 'controls left the row and its values as they were');
});

/* ---- the signature chart ------------------------------------------------ */

test('the gated chart is the approved Example: two panels, no number anywhere', () => {
  assert.equal(PL_CHART.quantitativeReady, false);
  const shot = shots.find(s => s.id === 'pl-05');
  const node = build(shot);
  const svg = byTag(node, 'svg')[0];
  assert.equal(svg.getAttribute('data-chart-state'), 'example');
  const labels = texts(svg).join(' ');
  assert.equal(/\d/.test(labels), false, `no axis, tick or point label: ${labels}`);
  assert.ok(series(svg, 'example-price').length, 'the price panel is drawn as a teaching shape');
  assert.ok(series(svg, 'example-contract').length, 'the contract panel is drawn as a teaching shape');
  assert.equal(series(svg, 'price').length, 0, 'no observed price mark in this mode');
  assert.equal(series(svg, 'obligation').length, 0, 'no obligation marker in this mode');
  assert.equal(byTag(node, 'table').length, 0, 'no numeric table in this mode');
  assert.ok(all(node, n => cls(n).includes('k-tag')).some(n => /Example|示例/.test(texts(n).join(''))), 'the Example tag is present');
  const title = byTag(svg, 'title')[0];
  assert.match(texts(title).join(''), /Example: auction price × correction factor/);
});

test('the numeric chart uses the records, both panels, and a label rather than a second axis', () => {
  const labels = { l01: ['Delivery year', '交付年'], l02: ['p', '价'], l03: ['f', '系'], l04: ['c', '同'], l07: ['Catch-up auction', '追加拍卖'], l08: ['No main auction scheduled', '无主拍卖排期'] };
  const rows = auctionSeries();
  const svg = auctionChart({ rows, boundary: PL_SUCCESSOR.firstUnscheduledDeliveryYear, labels });
  assert.equal(svg.getAttribute('data-chart-state'), 'numeric');
  assert.equal(svg.getAttribute('data-delivery-years'), '2021,2022,2023,2024,2025,2026,2027,2028,2029,2030');
  /* One solid bar per main auction, no bar for the catch-up product. */
  assert.equal(series(svg, 'price').length, rows.filter(r => r.kind === 'main').length);
  assert.equal(series(svg, 'catch-up').length, 1);
  for (const mark of series(svg, 'price')) assert.equal(mark.children[0].getAttribute('fill'), 'var(--ix-green,#224e40)', 'an observed result is solid');
  /* The factor is printed on the bar, not plotted: no factor axis exists. */
  const printed = texts(svg).join(' ');
  for (const price of ['240.32', '386.03', '62.27']) assert.ok(printed.includes(price), price);
  for (const factor of ['96.11%', '95.00%', '13.39%']) assert.ok(printed.includes(factor), factor);
  /* The boundary is dashed and drawn once, at the first unscheduled year. */
  const boundary = series(svg, 'boundary');
  assert.equal(boundary.length, 1);
  assert.ok(boundary[0].children[0].getAttribute('stroke-dasharray'), 'the boundary is dashed');
  /* Both panels carry their own unit title. */
  const titles = all(svg, n => n.tag === 'text' && cls(n).includes('k-axis-title')).map(n => texts(n).join(''));
  assert.equal(titles.length, 3, 'two units and the shared x axis');
  /* Every plotted contract is the record's own calculated value. */
  const contracts = series(svg, 'contract').map(mark => mark.getAttribute('data-auction'));
  assert.deepEqual(contracts, rows.map(r => r.id));
});

test('the chart is numeric only when the gate is open, and the table follows it', () => {
  const labels = { l01: ['Delivery year', '交付年'], l02: ['p', '价'], l03: ['f', '系'], l04: ['c', '同'], l07: ['x', 'x'], l08: ['y', 'y'] };
  const rows = auctionSeries();
  assert.equal(signatureChart({ rows, boundary: 2031, labels, ready: false }).getAttribute('data-chart-state'), 'example');
  assert.equal(signatureChart({ rows, boundary: 2031, labels, ready: true }).getAttribute('data-chart-state'), 'numeric');
  assert.equal(exampleAuctionChart({ labels }).getAttribute('data-chart-state'), 'example');
  assert.equal(auctionTable({ rows, labels, ready: false }), null);
  const table = auctionTable({ rows, labels, ready: true });
  assert.equal(table.cells.length, 11);
  assert.equal(table.cells[8][1], '02/2025', 'the main auction for 2029 keeps its notice number');
  assert.equal(table.cells[9][1], 'Catch-up auction', 'the catch-up row is named, not numbered');
  assert.match(table.cells[6][5], /165 MW/, 'the reported obligation is printed');
  assert.match(table.cells[8][5], /Technology split pending/, 'a pending split says so');
  assert.match(table.cells[0][5], /None reported/, 'a missing split is not a zero');
});

/* ---- scene-level guarantees -------------------------------------------- */

test('pl-03 counts the obligation from certified power, and tags the gauge Example', () => {
  const node = build(shots.find(s => s.id === 'pl-03'));
  const svg = byTag(node, 'svg')[0];
  assert.ok(['2027', '2028'].includes(svg.getAttribute('data-delivery')), 'one delivery year is shown');
  const printed = texts(svg).join(' ');
  assert.match(printed, /95\.00%/, 'the factor is the record’s');
  assert.match(printed, /165|1,734/, 'the bars are the published obligations');
  assert.ok(all(node, n => cls(n).includes('k-tag')).some(n => /Example|示例/.test(texts(n).join(''))), 'the gauge is a teaching readout');
});

test('pl-04 ends the calendar with a dashed boundary and invents no price', () => {
  const node = build(shots.find(s => s.id === 'pl-04'));
  const svg = byTag(node, 'svg')[0];
  const dashed = all(svg, n => n.getAttribute?.('stroke-dasharray')).length;
  assert.ok(dashed >= 2, 'the boundary and its band are dashed');
  assert.equal(/\bPLN\b|\d+\.\d\d/.test(texts(svg).join(' ')), false, 'no price on a calendar');
});

test('pl-09 leaves the hotspots to the shell and draws only the layers', () => {
  const shot = shots.find(s => s.id === 'pl-09');
  const node = build(shot);
  const svg = byTag(node, 'svg')[0];
  assert.equal(series(svg, 'hotspot').length, 0, 'the shell renders the hotspot list');
  assert.equal(shot.extra.hotspots.length, 5);
});

test('pl-11 keeps the combined capacity-plus-grant value unpriced', () => {
  const shot = shots.find(s => s.id === 'pl-11');
  const node = build(shot);
  const both = controlsOf(node).find(b => /also holds|同时持有/i.test(texts(b).join('')));
  assert.ok(both, 'the overlay has a control');
  both.click();
  const printed = texts(node).join(' ');
  assert.match(printed, /Unpriced|尚未定价/, 'MR-5 keeps it unpriced');
  assert.equal(/\bPLN\b/.test(printed), false, 'no combined amount is typed');
});

test('pl-07 and pl-08 read their model figures from the binding, not from the drawing', () => {
  const merchant = build(shots.find(s => s.id === 'pl-07'));
  assert.ok(texts(merchant).join(' ').includes(values.ungrantedMerchantValue), 'the merchant value is bound');
  const certification = build(shots.find(s => s.id === 'pl-08'));
  const readouts = texts(certification).join(' ');
  assert.ok(/MW/.test(readouts), 'the certified readout prints a unit');
  assert.ok(all(certification, n => cls(n).includes('k-tag')).length >= 1, 'the shorter preset is tagged Example');
});

test('no scene reaches the market row or the case', () => {
  for (const shot of shots){
    const node = build(shot);
    for (const value of surface(node)) assert.equal(/investment\.|holdIRR|maxPricePerMW/.test(value), false, `${shot.id}: ${value}`);
  }
  assert.equal(PL_AUCTIONS.length, 11);
});
