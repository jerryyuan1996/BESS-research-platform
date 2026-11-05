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
const { app } = await import('../src/app/state.js');
const { scenes, makeScenes } = await import('../src/markets/nem/story/scenes.js');
const { story } = await import('../src/markets/nem/story.js');
const { storyValues, storyWithAvailableValues } = await import('../src/markets/nem/storyBindings.js');
const { NEM_STORY_OBSERVED } = await import('../src/markets/nem/data/storyEvidenceObserved.js');
const { opportunities, CALLS, returnPct } = await import('../src/experience/model.js');
const row = opportunities('infraFund').find(r => r.id === 'nem'), values = storyValues(row, { CALLS, returnPct });
const shown = storyWithAvailableValues(story, values);
const shots = [shown.opening, ...shown.chapters.flatMap(c => c.shots)];
const build = (shot, set = scenes) => set[shot.scene](shot, { row, values });
const byId = id => shots.find(s => s.id === id);
const kind = (node, k) => find(node, n => n.getAttribute?.('data-kind') === k);

test('all thirteen scenes render, accessibly and in both languages, with no unresolved field', () => {
  assert.deepEqual(Object.keys(scenes), shots.map(s => s.scene));
  for (const lang of ['en', 'zh']) { app.lang = lang; for (const shot of shots) {
    const node = build(shot);
    assert.ok(find(node, () => true).length < 2500, shot.id);
    for (const value of surface(node)) assert.equal(/NaN|undefined|^null$|\[object|\{[A-Za-z][A-Za-z0-9]*\}/.test(value), false, `${shot.id}: ${value}`);
    for (const n of find(node, n => n.attrs)) assert.notEqual(n.getAttribute('hidden'), 'false', `${shot.id}: hidden="false" hides an element`);
    for (const svg of find(node, n => n.tag === 'svg')) assert.ok(svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby'), shot.id);
    assert.ok(lang === 'en' ? /[A-Za-z]/.test(content(node)) : /[\u4e00-\u9fff]/.test(content(node)), shot.id);
  } }
  app.lang = 'en';
});

test('every teaching control changes only its own scene, never the case or its values', () => {
  const before = JSON.stringify(row), bound = JSON.stringify(values);
  for (const shot of shots.slice(1)) {
    const node = build(shot), buttons = find(node, n => n.tag === 'button');
    assert.ok(buttons.length, shot.id);
    for (const b of buttons) {
      b.click(); assert.equal(JSON.stringify(row), before, shot.id); assert.equal(JSON.stringify(values), bound, shot.id);
      assert.equal(find(node, n => n.nodeType === 3 && /^(null|undefined)$/.test(n.text)).length, 0, `${shot.id}: printed null after a click`);
      for (const n of find(node, n => n.attrs)) assert.notEqual(n.getAttribute('hidden'), 'false', shot.id);
    }
  }
});

test('with the rights switch on (analyst, 5 November 2026), nem-05 to nem-07 draw the observed AEMO layers', () => {
  const spread = build(byId('nem-06'));
  assert.equal(find(spread, n => n.getAttribute?.('data-chart') === 'Chart-NEM-SPREAD')[0].getAttribute('data-mode'), 'observed');
  assert.equal(kind(spread, 'observed').length, 10);
  assert.equal(kind(spread, 'example').length, 0);
  assert.ok(find(spread, n => n.tag === 'table').length, 'table view for phones');
  assert.ok(/\$59/.test(content(spread)));
  const day = build(byId('nem-05'));
  assert.equal(find(day, n => n.getAttribute?.('data-chart') === 'Chart-NEM-DAY')[0].getAttribute('data-mode'), 'observed');
  assert.ok(kind(day, 'observed').length);
  const place = build(byId('nem-07'));
  assert.ok(/\$51\/MWh/.test(content(place)));
});

test('the unscaled Example fallback still works if the switch is turned off', () => {
  const off = makeScenes({ observed: null });
  for (const id of ['nem-05', 'nem-06', 'nem-07']) {
    const node = build(byId(id), off);
    for (const b of find(node, n => n.tag === 'button')) b.click();
    assert.equal(kind(node, 'observed').length, 0, id);
    assert.equal(/\$\d|\d+\/MWh/.test(content(node)), false, id);
  }
  const spread = build(byId('nem-06'), off);
  assert.ok(kind(spread, 'example').length >= 9);
  assert.equal(find(spread, n => n.tag === 'table').length, 0);
});

test('the WA layer toggles on and off in Chart-NEM-SPREAD', () => {
  const node = build(byId('nem-06'));
  const wa = find(node, n => n.tag === 'button' && content(n) === 'WA beside it')[0];
  assert.ok(wa);
  assert.equal(find(node, n => n.getAttribute?.('data-layer') === 'wa').length, 0);
  wa.click();
  assert.equal(find(node, n => n.getAttribute?.('data-chart') === 'Chart-NEM-SPREAD')[0].getAttribute('data-wa'), 'true');
  assert.equal(kind(node, 'wem').length, 2);
  wa.click();
  assert.equal(kind(node, 'wem').length, 0);
});

test('the collar carries no axis values and draws no floor, ceiling or cap at a value', () => {
  const node = build(byId('nem-09'));
  for (const b of find(node, n => n.tag === 'button')) {
    b.click();
    const svg = find(node, n => n.tag === 'svg')[0];
    assert.equal(/\d/.test(content(svg)), false, content(svg));
  }
  assert.ok(kind(node, 'payment-cap').length);
});
