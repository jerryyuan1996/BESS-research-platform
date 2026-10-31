import test from 'node:test';
import assert from 'node:assert/strict';

class El {
  constructor(tag) { this.tag = tag; this.attrs = new Map(); this.children = []; this.nodeType = 1; this.listeners = {}; }
  setAttribute(k, v) { this.attrs.set(k, String(v)); }
  getAttribute(k) { return this.attrs.get(k) ?? null; }
  set className(v) { this.attrs.set('class', String(v)); }
  get className() { return this.attrs.get('class') || ''; }
  append(...c) { this.children.push(...c); }
  replaceChildren(...c) { this.children = c.map(v => v?.nodeType ? v : { nodeType: 3, text: String(v) }); }
  get firstChild() { return this.children[0] ?? null; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  click() { for (const fn of this.listeners.click || []) fn({ target: this }); }
}
globalThis.document = { createElementNS: (_, tag) => new El(tag), createElement: tag => new El(tag), createTextNode: text => ({ nodeType: 3, text: String(text) }) };
const walk = (n, fn) => { fn(n); for (const c of n.children || []) walk(c, fn); };
const all = (n, pred) => { const out = []; walk(n, x => { if (pred(x)) out.push(x); }); return out; };
const words = n => all(n, x => x.nodeType === 3).map(x => x.text).join(' ');
const css = (n, c) => (n.getAttribute?.('class') || '').split(/\s+/).includes(c);
const surface = n => JSON.stringify(all(n, () => true).map(x => x.nodeType === 3 ? x.text : [...x.attrs]));

const { app } = await import('../src/app/state.js');
const { story } = await import('../src/markets/de/story.js');
const { scenes } = await import('../src/markets/de/story/scenes.js');
const { storyBindings } = await import('../src/markets/de/storyBindings.js');
const { opportunities, caseFor, CALLS } = await import('../src/experience/model.js');
const row = opportunities('infraFund').find(r => r.id === 'de');
const result = caseFor(row);
const bindings = storyBindings(row, { CALLS, result });
const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const build = (id, lang = 'en') => { app.lang = lang; const shot = shots.find(s => s.id === id); return scenes[shot.scene](shot, { ...bindings, row }); };
const toggles = n => all(n, x => x.tag === 'button' && css(x, 'k-toggle'));

test('every German shot has a named kit scene within its node budget in both languages', () => {
  for (const lang of ['en', 'zh']) for (const shot of shots) {
    const n = build(shot.id, lang);
    assert.ok(all(n, () => true).length < 1500, shot.id);
    assert.ok(!/NaN|undefined|\[object|\{[a-zA-Z]+\}/.test(surface(n)), shot.id);
    assert.ok(!/\bnull\b/.test(words(n)), shot.id + ' null text');
    if (lang === 'zh') assert.match(words(n), /[一-鿿]/);
    for (const svg of all(n, x => x.tag === 'svg')) {
      assert.equal(svg.getAttribute('role'), 'img');
      assert.ok(svg.getAttribute('aria-labelledby'));
      assert.ok(all(svg, x => x.tag === 'title').some(x => words(x).trim()));
    }
  }
  app.lang = 'en';
});

test('teaching controls change drawings and leave all case and binding data untouched', () => {
  const before = JSON.stringify({ row, bindings });
  for (const shot of shots.slice(1)) {
    const count = toggles(build(shot.id)).length;
    for (let index = 0; index < count; index++) {
      const n = build(shot.id), b = toggles(n)[index];
      assert.ok(['true', 'false'].includes(b.getAttribute('aria-pressed')));
      assert.ok(words(b).trim());
      if (b.getAttribute('aria-pressed') === 'true') continue;
      const previous = surface(n); b.click();
      assert.notEqual(surface(n), previous, shot.id + ' ' + words(b));
    }
  }
  assert.equal(JSON.stringify({ row, bindings }), before);
});

test('the approved price Example has no numeric price axis or source fetch', () => {
  for (const id of ['de-09', 'de-10']) {
    const n = build(id);
    const chart = all(n, x => x.getAttribute?.('data-chart') === 'Chart-DE-SPREAD-TOLL')[0];
    assert.equal(chart.getAttribute('data-mode'), 'example');
    assert.equal(Number(chart.getAttribute('data-fee')), result.base.secY[0]);
    assert.match(words(chart), /Example/);
    assert.match(words(chart), /EUR\/MWh/);
    assert.match(words(chart), /USD\/MW\/year/);
    assert.equal(all(chart, x => x.tag === 'text').length, 0, 'no invented numeric axes');
    assert.equal(chart.getAttribute('data-grid-income'), 'none');
  }
});

test('congestion and grid fees are cost layers; only the future line is dashed', () => {
  for (const id of ['de-05', 'de-11']) assert.ok(all(build(id), x => x.getAttribute?.('data-grid-layer') === 'cost').length);
  const congestion = build('de-05');
  assert.ok(all(congestion, x => css(x, 'k-link-missing')).length);
  assert.equal(all(congestion, x => css(x, 'k-pylon') && css(x, 'k-future')).length, 0, 'existing network stays built');
  assert.ok(all(congestion, x => css(x, 'de-cost')).length);
});

test('expiry uses the model entry clock, never a date from the price window', () => {
  const n = build('de-10');
  const clock = all(n, x => css(x, 'de-clock'))[0];
  assert.equal(clock.getAttribute('data-clock'), 'model-entry');
  assert.equal(Number(clock.getAttribute('data-expiry')), result.base.codOffset + result.base.securedYears);
  toggles(n).find(b => words(b) === 'After expiry').click();
  assert.equal(all(n, x => css(x, 'de-clock'))[0].getAttribute('data-tail'), 'true');
});

test('a longer duration adds schematic energy blocks while conversion equipment stays fixed', () => {
  const n = build('de-08');
  const containers = () => all(n, x => css(x, 'k-container')).length;
  const conversion = () => ['k-pcs', 'k-transformer'].map(c => all(n, x => css(x, c)).length);
  const before = { containers: containers(), conversion: conversion() };
  toggles(n)[1].click();
  assert.ok(containers() > before.containers);
  assert.deepEqual(conversion(), before.conversion);
  assert.match(words(n), /MW/);
});
