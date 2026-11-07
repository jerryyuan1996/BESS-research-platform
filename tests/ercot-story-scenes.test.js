/* ERCOT story scenes on a minimal DOM: every shot draws, the signature chart
   is the unscaled Example while both gates are closed, and no toll price or
   gated value appears on any drawn surface. */
import test from 'node:test';
import assert from 'node:assert/strict';
class El {
  constructor(tag) { this.tag = tag; this.nodeType = 1; this.attrs = new Map(); this.children = []; this.listeners = {}; }
  setAttribute(k, v) { this.attrs.set(k, String(v)); }
  getAttribute(k) { return this.attrs.get(k) ?? null; }
  set className(v) { this.setAttribute('class', v); } get className() { return this.getAttribute('class') || ''; }
  get value() { return this._value ?? this.getAttribute('value') ?? ''; } set value(v) { this._value = String(v); }
  get open() { return this.attrs.has('open'); } set open(v) { if (v) this.attrs.set('open', ''); else this.attrs.delete('open'); }
  get hidden() { return this.attrs.has('hidden'); } set hidden(v) { if (v) this.attrs.set('hidden', ''); else this.attrs.delete('hidden'); }
  get dataset() { return Object.fromEntries([...this.attrs].filter(([k]) => k.startsWith('data-')).map(([k, v]) => [k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v])); }
  append(...kids) { for (const kid of kids) { if (kid == null) continue; const node = kid.nodeType ? kid : { nodeType: 3, text: String(kid) }; node.parentNode = this; this.children.push(node); } }
  /* As in a browser, replaceChildren prints null and undefined as text. */
  replaceChildren(...kids) { this.children = []; this.append(...kids.map(k => k == null ? String(k) : k)); }
  get firstChild() { return this.children[0] ?? null; }
  set textContent(s) { this.replaceChildren({ nodeType: 3, text: String(s) }); } get textContent() { return content(this); }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  emit(type) { const ev = { target: this, preventDefault() {} }; for (const fn of this.listeners[type] || []) fn(ev); this[`on${type}`]?.(ev); }
  click() { this.emit('click'); }
  closest(selector) { for (let node = this; node; node = node.parentNode) if (matches(node, selector)) return node; return null; }
  querySelector(selector) { return find(this, (n) => n !== this && matches(n, selector.split(' ').at(-1)))[0] || null; }
  querySelectorAll(selector) { return find(this, (n) => n !== this && matches(n, selector.split(' ').at(-1))); }
}

const walk = (node, fn) => { fn(node); for (const child of node.children || []) walk(child, fn); };
const find = (node, pred) => { const out = []; walk(node, (n) => { if (pred(n)) out.push(n); }); return out; };
const content = (node) => find(node, (n) => n.nodeType === 3).map((n) => n.text).join('');
const classes = (n) => (n.getAttribute?.('class') || '').split(/\s+/);
const matches = (n, s) => (s.startsWith('.') ? classes(n).includes(s.slice(1)) : n.tag === s);
const surface = (node) => find(node, (n) => n.nodeType === 3).map((n) => n.text)
  .concat(find(node, (n) => n.attrs).flatMap((n) => [...n.attrs.values()]));

globalThis.document = {
  createElement: (tag) => new El(tag),
  createElementNS: (_, tag) => new El(tag),
  createTextNode: (text) => ({ nodeType: 3, text: String(text) }),
  querySelector: () => null,
};


globalThis.matchMedia ||= () => ({ matches: false });

const { scenes, openingThumbnail } = await import('../src/markets/ercot/story/scenes.js');
const { chartMode } = await import('../src/markets/ercot/story/chart.js');
const { shotRecords, recordLines, locatorBlock } = await import('../src/markets/ercot/story/evidence.js');
const { story } = await import('../src/markets/ercot/story.js');
const { storyValues } = await import('../src/markets/ercot/storyBindings.js');
const { ERCOT_STORY_RECORDS: R } = await import('../src/markets/ercot/data/storyEvidence.js');
const { opportunities, CALLS, returnPct } = await import('../src/experience/model.js');
const { marginText } = await import('../src/experience/decision.js');

const row = opportunities('infraFund').find(r => r.id === 'ercot');
const values = storyValues(row, { CALLS, returnPct, marginText });
const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const draw = id => scenes[id](shots.find(s => s.id === id), { values, row });
const byAttr = (node, k, v) => find(node, n => n.getAttribute?.(k) === v);
const buttons = node => find(node, n => n.tag === 'button');
const press = (node, label) => buttons(node).find(b => content(b) === label).click();

test('every shot has a scene, and every scene draws without an unresolved value', () => {
  for (const shot of shots) {
    assert.equal(typeof scenes[shot.scene], 'function', shot.id);
    const text = surface(draw(shot.id)).join(' ');
    assert.doesNotMatch(text, /undefined|NaN|\bnull\b|\{[A-Za-z]/, shot.id);
  }
  assert.ok(openingThumbnail());
});

test('the Texas schematic draws the outline, four DC ties and no ERCOT footprint', () => {
  const map = draw('ercot-01');
  assert.equal(byAttr(map, 'data-kind', 'texas-outline').length, 1);
  assert.equal(byAttr(map, 'data-kind', 'dc-tie').length, 4);
  assert.deepEqual(byAttr(map, 'data-kind', 'dc-tie').map(n => n.getAttribute('data-group')).sort(), ['mexico', 'mexico', 'spp', 'spp']);
  assert.equal(find(map, n => /footprint|ercot-area/.test(n.getAttribute?.('data-kind') || '')).length, 0);
  press(map, 'Links to neighbours');
  const text = content(map);
  assert.ok(text.includes(values.dcTieCapacity));
  assert.ok(text.includes(`${R.dcTies.spp.transferMW} MW`) && text.includes(`${R.dcTies.mexico.transferMW} MW`));
  assert.ok(text.includes('Transfer capability, not flow'));
});

test('Chart-ERCOT-AS is the unscaled Example: no numeric axis, value or year tick while both gates are closed', () => {
  assert.equal(chartMode(R), 'example');
  assert.equal(chartMode({ ...R, fleet: { ...R.fleet, publicationReady: true } }), 'example', 'one gate alone does not clear the chart');
  for (const id of ['ercot-05', 'ercot-06']) {
    const scene = draw(id);
    const chart = byAttr(scene, 'data-chart', 'Chart-ERCOT-AS')[0];
    assert.ok(chart, id);
    assert.equal(chart.getAttribute('data-mode'), 'example');
    const svgText = find(chart, n => n.tag === 'svg').flatMap(svg => find(svg, n => n.nodeType === 3).map(n => n.text)).join(' ');
    assert.doesNotMatch(svgText, /\d/, `${id}: a digit inside the chart drawing`);
    assert.equal(byAttr(chart, 'data-kind', 'observed').length, 0);
    assert.ok(byAttr(chart, 'data-kind', 'example').length > 0);
    assert.ok(content(chart).includes('Example'));
  }
  const six = draw('ercot-06');
  assert.deepEqual(find(six, n => n.getAttribute?.('data-panel')).map(n => n.getAttribute('data-panel')), ['fleet', 'price']);
  press(six, 'How measured');
  assert.ok(content(six).includes('per MW held ready, per hour'));
});

test('no toll price, fee band or range is drawn, and the modelled toll is labelled an assumption', () => {
  const eleven = draw('ercot-11');
  const text = surface(eleven).join(' ');
  assert.ok(text.includes('Modelled toll (assumption)'));
  assert.ok(text.includes('Contract price unverified'));
  assert.doesNotMatch(content(eleven), /\$|USD|美元|\/MW|\/kW/);
  assert.ok(content(eleven).includes(`${row.investment.securedYears} years`));
  for (const id of ['ercot-09', 'ercot-10', 'ercot-12']) assert.doesNotMatch(content(draw(id)), /toll price|toll fee of|\/kW-/i, id);
});

test('the design grid shows the toll at the play duration as least value lost, and other tolls as not priced', () => {
  const grid = draw('ercot-09');
  const toll = byAttr(grid, 'data-route', 'toll')[0];
  const cells = find(toll, n => n.tag === 'li');
  const play = cells.find(c => c.getAttribute('data-hours') === String(row.play.hours));
  assert.ok(content(play).includes('Least value lost'));
  for (const c of cells.filter(c => c !== play)) assert.ok(content(c).includes('Not priced'), c.getAttribute('data-hours'));
  assert.ok(content(grid).includes(values.fleetAverageDuration[0]));
});

test('ercot-08 holds energy behind a reserve from the duration records, Example-tagged', () => {
  const eight = draw('ercot-08');
  assert.ok(content(eight).includes('Example'));
  press(eight, 'Hold a reserve');
  press(eight, 'Non-spinning reserve');
  assert.equal(byAttr(eight, 'data-kind', 'beyond').length, R.reserveRules.nonSpin.durationMinutes > row.play.hours * 60 ? 1 : 0);
  press(eight, 'Responsive reserve');
  assert.equal(byAttr(eight, 'data-kind', 'beyond').length, 0);
  assert.equal(content(eight).includes('Regulation down'), false, 'Reg-Down has no accepted duration');
});

test('the closing card binds the live next event; the timeline shows a closed branch for the credit', () => {
  const twelve = draw('ercot-12');
  assert.ok(content(twelve).includes(row.decision.event.label[0]));
  const two = draw('ercot-02');
  press(two, `${['January 2023 – 19 December 2024'][0]} · A reliability credit, adopted then set aside`);
  assert.equal(byAttr(two, 'data-kind', 'closed-branch').length, 1);
  assert.ok(content(two).includes('Adopted, then not taken forward'));
});

test('per-value locators list only reviewed records, never gated series', () => {
  const all = Object.values(shotRecords(R)).flat();
  assert.equal(all.some(r => /^fleet-\d|^as-price-|^monitor-check-/.test(r.id || '')), false);
  for (const r of all) { const [id, text] = recordLines(r, R); assert.ok(id && text.length > 10, id); }
  assert.ok(content(locatorBlock('ercot-01', R)).includes('§II.H'));
  assert.equal(locatorBlock('ercot-05', R), null, 'the gated fleet series lists no locator');
});
