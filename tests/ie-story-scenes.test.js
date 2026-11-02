/* Ireland: scene coverage, the Example-only chart, local-only controls and the
   node budget. A tiny DOM stands in for the browser, as the Italy scenes test
   does, so this runs in the same suite as everything else. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
  replaceChildren(...kids) { this.children = []; this.append(...kids); }
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

const { app } = await import('../src/app/state.js');
const { scenes, islandThumbnail } = await import('../src/markets/ie/story/scenes.js');
const { story } = await import('../src/markets/ie/story.js');
const { storyValues } = await import('../src/markets/ie/storyBindings.js');
const { opportunities, CALLS, returnPct } = await import('../src/experience/model.js');
const { IE_CRM_AUCTIONS: crm } = await import('../src/markets/ie/data/crmAuctions.js');

const row = opportunities('infraFund').find((r) => r.id === 'ie');
const values = storyValues(row, { CALLS, returnPct });
const shots = [story.opening, ...story.chapters.flatMap((c) => c.shots)];
const build = (shot, lang = 'en') => { app.lang = lang; return scenes[shot.scene](shot, { values, row }); };
const buttons = (node) => find(node, (n) => n.tag === 'button' && classes(n).includes('k-toggle'));

test('every Ireland scene exists for its shot and reads in both languages', () => {
  assert.deepEqual(new Set(Object.keys(scenes)), new Set(shots.map((s) => s.scene)));
  for (const lang of ['en', 'zh']) {
    for (const shot of shots) {
      const node = build(shot, lang);
      assert.ok(find(node, () => true).length <= 1800, `${shot.id} node budget`);
      for (const value of surface(node)) assert.ok(!/NaN|undefined|\[object|\{[A-Za-z][A-Za-z0-9]*\}/.test(value), `${shot.id}: ${value}`);
      for (const svg of find(node, (n) => n.tag === 'svg')) {
        assert.ok(svg.getAttribute('aria-labelledby') || svg.getAttribute('aria-label'), `${shot.id}: svg has no accessible name`);
        assert.ok(find(svg, (n) => n.tag === 'title' || n.tag === 'desc').length > 0 || svg.getAttribute('aria-label'), `${shot.id}: svg has no title or desc`);
      }
      assert.ok(lang === 'en' ? /[A-Za-z]/.test(content(node)) : /[\u4e00-\u9fff]/.test(content(node)), `${shot.id} ${lang}`);
    }
  }
  app.lang = 'en';
});

test('the signature chart is the approved unscaled Example, with no number in the drawing', () => {
  assert.equal(crm.chart.quantitativeReady, false);
  const node = build(shots.find((s) => s.id === 'ie-06'));
  const chart = find(node, (n) => classes(n).includes('ie-crm-chart'))[0];
  assert.equal(chart.getAttribute('data-mode'), 'price');
  const svg = find(node, (n) => n.tag === 'svg' && classes(n).includes('ie-crm-drawing'))[0];
  assert.equal(svg.getAttribute('data-authority'), 'example');
  assert.equal(svg.getAttribute('data-scaled'), 'false');
  const drawn = content(svg);
  assert.ok(!/\d/.test(drawn), `the Example draws a figure: ${drawn}`);
  assert.ok(!/[€%]/.test(drawn), 'the Example draws a currency symbol or percent');
  assert.match(content(chart), /Example|示例/);
});

test('the chart offers prices, credits and the awarded toggle without inventing a series', () => {
  const shot = shots.find((s) => s.id === 'ie-06');
  const node = build(shot);
  const toggles = buttons(node);
  assert.equal(toggles.length, 3);
  for (const button of toggles) {
    button.click();
    const host = find(node, (n) => n.attrs?.has('data-mode'))[0];
    assert.ok(host.getAttribute('data-mode'), 'the mode survives a click');
    for (const value of surface(node)) assert.ok(!/NaN|undefined|\{/.test(value), value);
  }
  const awarded = toggles[2];
  awarded.click();
  const rows = find(node, (n) => n.attrs?.has('data-row'));
  assert.equal(rows.length, 4, 'four recent auctions, no zero-valued older bars');
});

test('controls change the drawing only: no control reaches the row or the case', () => {
  const before = JSON.stringify(row);
  const beforeValues = JSON.stringify(values);
  for (const shot of shots) {
    const node = build(shot);
    for (const button of buttons(node)) { button.click(); button.click(); }
    assert.equal(JSON.stringify(row), before, `${shot.id} changed the row`);
    assert.equal(JSON.stringify(values), beforeValues, `${shot.id} changed a bound value`);
  }
});

test('plans and scenarios are dashed, observed things are not', () => {
  const island = build(shots.find((s) => s.id === 'ie-01'));
  const planned = find(island, (n) => classes(n).includes('ie-planned'))[0];
  assert.ok(planned, 'the planned link is drawn');
  const css = readFileSync(new URL('../src/markets/ie/story/ie-story.css', import.meta.url), 'utf8');
  assert.match(css, /\.ie-dc\.ie-planned\s*\{[^}]*stroke-dasharray/, 'the planned link is dashed in the stylesheet');
  assert.ok(!/\.ie-dc\s*\{[^}]*stroke-dasharray/.test(css), 'a solid link must not inherit the dash');
  const stop = build(shots.find((s) => s.id === 'ie-05'));
  assert.ok(find(stop, (n) => classes(n).includes('ie-marker')).length === 1, 'one dated marker for the long-stop');
  assert.ok(find(stop, (n) => classes(n).includes('ie-planned-band')).length === 1, 'the undated successor is a band');
  const teaching = build(shots.find((s) => s.id === 'ie-07'));
  assert.match(content(teaching), /Example|示例/);
});

test('the thumbnail is the same schematic, with no capacity or route claim', () => {
  const svg = islandThumbnail();
  assert.equal(svg.tag, 'svg');
  assert.ok(!/\d+\s?(MW|GW)/.test(content(svg)));
  assert.ok(find(svg, (n) => classes(n).includes('ie-boundary')).length === 1);
});
