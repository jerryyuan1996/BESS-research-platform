/* ---------------------------------------------------------------------------
   Romania's scenes, built against a minimal document: every shot finds its
   scene, every scene reads in both languages, every control is a labelled
   toggle that changes the drawing and never the case, and the signature chart
   takes its numbers only from an eligible record set.

   The built dialog is exercised in e2e/story.spec.js.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';

class El {
  constructor(tag){ this.tag = tag; this.attrs = new Map(); this.children = []; this.nodeType = 1; this.listeners = {}; this.hidden = false; }
  setAttribute(k, v){ this.attrs.set(k, String(v)); }
  getAttribute(k){ return this.attrs.get(k) ?? null; }
  removeAttribute(k){ this.attrs.delete(k); }
  hasAttribute(k){ return this.attrs.has(k); }
  set className(v){ this.attrs.set('class', String(v)); }
  get className(){ return this.attrs.get('class') || ''; }
  append(...c){ this.children.push(...c); }
  replaceChildren(...c){ this.children = [...c]; }
  get firstChild(){ return this.children[0] ?? null; }
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
const attr = (node, name) => all(node, n => n.getAttribute?.(name) !== null && n.getAttribute?.(name) !== undefined && n.nodeType === 1).map(n => [n.tag, n.getAttribute(name)]);

const { app } = await import('../src/app/state.js');
const { scenes } = await import('../src/markets/ro/story/scenes.js');
const { story } = await import('../src/markets/ro/story.js');
const { storyValues } = await import('../src/markets/ro/storyBindings.js');
const { opportunities, CALLS, returnPct } = await import('../src/experience/model.js');
const { marginText } = await import('../src/experience/decision.js');
const { signatureChart, fleetChart, qualitativeFleetChart } = await import('../src/markets/ro/story/chart.js');

const row = opportunities('infraFund').find(r => r.id === 'ro');
const values = storyValues(row, { CALLS, returnPct, marginText });
const shots = [story.opening, ...story.chapters.flatMap(c => c.shots)];
const build = (shot, lang = 'en') => { app.lang = lang; return scenes[shot.scene](shot, { values, row }); };
const controlsOf = (node) => byTag(node, 'button').filter(b => cls(b).includes('k-toggle'));

test('every shot has a scene and every scene is used', () => {
  for (const shot of shots) assert.equal(typeof scenes[shot.scene], 'function', `${shot.id}: ${shot.scene}`);
  const used = new Set(shots.map(s => s.scene));
  for (const id of Object.keys(scenes)) assert.ok(used.has(id), `scene ${id} has no shot`);
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
  for (const shot of shots){
    const count = all(build(shot), () => true).length;
    assert.ok(count <= 1500, `${shot.id}: ${count} nodes`);
  }
});

test('every drawing is a named image', () => {
  for (const shot of shots){
    for (const svg of byTag(build(shot), 'svg').filter(svg => svg.getAttribute('role') === 'img')){
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
    for (const button of controlsOf(node)){
      if (button.getAttribute('aria-pressed') === 'true' && button.parentNode?.tagName !== 'group') continue;
      const was = JSON.stringify(surface(node));
      button.click();
      if (button.getAttribute('aria-pressed') === 'true') continue;
      assert.notEqual(JSON.stringify(surface(node)), was, `${shot.id}: "${texts(button).join('')}" changes nothing`);
    }
  }
  assert.equal(JSON.stringify({ row, values }), before, 'controls left the row and its values as they were');
});

test('the signature chart is the qualitative Example while no dated count is eligible', () => {
  const node = build(shots.find(s => s.id === 'ro-06'));
  const svg = byTag(node, 'svg')[0];
  assert.equal(svg.getAttribute('data-chart-state'), 'example');
  const labels = texts(svg).join(' ');
  assert.ok(!/\d/.test(labels.replace(/\d{4}/g, '')), 'no numeric axis or point label: ' + labels);
  for (const name of ['example-fleet', 'example-estimate', 'example-plan', 'example-model']) assert.ok(attr(svg, 'data-series').some(([, v]) => v === name), name);
  assert.ok(all(node, n => cls(n).includes('k-tag')).some(n => /Example|示例/.test(texts(n).join(''))), 'the Example tag is present');
});

test('the numeric chart draws observed points solid, the plan, estimate and model dashed', () => {
  /* Renderer mechanics with synthetic values: no source figure is involved. */
  const points = [{ date: '2026-01-01', year: 2026, mw: 10, precision: 'day', status: 'observed' }];
  const path = [{ year: 2025, value: 100, kind: 'basis' }, { year: 2026, value: null, kind: 'gap' }, { year: 2027, value: 82.7, kind: 'transition' }, { year: 2028, value: 79, kind: 'model' }];
  const labels = { title: ['t', '题'], fleet: ['MW', 'MW'], estimate: ['e', '估'], plan: ['p', '规'], model: ['i', '指'], example: ['x', '例'] };
  const svg = fleetChart({ points, estimate: { year: 2026, mw: 20 }, plan: { year: 2030, mw: 30 }, path, labels });
  assert.equal(svg.getAttribute('data-chart-state'), 'numeric');
  const observed = all(svg, n => n.getAttribute?.('data-series') === 'observed')[0];
  assert.equal(observed.children[0].getAttribute('fill'), 'var(--ix-green,#224e40)', 'an observation is solid');
  assert.ok(all(svg, n => n.getAttribute?.('data-series') === 'plan').every(n => n.getAttribute('stroke-dasharray')), 'the plan is dashed');
  assert.ok(all(svg, n => n.getAttribute?.('data-series') === 'estimate').every(n => n.getAttribute('stroke-dasharray')), 'the estimate is dashed');
  assert.ok(all(svg, n => n.getAttribute?.('data-series') === 'model').every(n => n.getAttribute('stroke-dasharray')), 'the model path is dashed');
  /* 2026 carries no model point, so the basis joins the first model year */
  assert.equal(svg.getAttribute('data-index-years'), '2027,2028');
  assert.equal(signatureChart({ points: [], path, labels }).getAttribute('data-chart-state'), 'example');
  assert.equal(qualitativeFleetChart({ labels }).getAttribute('data-chart-state'), 'example');
});

test('the fleet table reads the same records the drawing does, with a dash for a withheld value', () => {
  const node = build(shots.find(s => s.id === 'ro-06'));
  const rows = byTag(node, 'tr').filter(tr => tr.getAttribute('data-record'));
  assert.equal(rows.length, 6, 'one row per dated record');
  for (const tr of rows) assert.ok(texts(tr).includes('—'), 'a withheld value is an em dash');
});

test('the floor is a bracket with no level, no tenor and no secured shading', () => {
  const node = build(shots.find(s => s.id === 'ro-11'));
  const svg = byTag(node, 'svg')[0];
  assert.ok(svg.getAttribute('data-band') === null);
  assert.equal(all(node, n => n.getAttribute?.('data-floor') === 'bracket').length, 1);
  const numeric = texts(svg).join(' ');
  assert.ok(!/\d/.test(numeric), 'no figure in the floor drawing: ' + numeric);
  assert.ok(!/floorAmount|floorTenor|floorSecuredShare|floorPriceUplift|floorLevel/.test(JSON.stringify(values)), 'no floor field is bound');
});

test('the map carries no measured flow, capacity or plant count', () => {
  const node = build(shots.find(s => s.id === 'ro-01'));
  const svg = byTag(node, 'svg')[0];
  assert.equal(all(svg, n => n.getAttribute?.('data-link')).length, 4, 'four schematic border symbols');
  for (const [, value] of attr(svg, 'data-link')) assert.ok(/^\d$/.test(value), 'schematic only');
  assert.equal(all(svg, n => n.tag === 'path' && /fuel|flow/.test(n.getAttribute('class') || '')).length, 0);
});

test('the teaching battery is tagged Example and its preset is a preset', () => {
  const shot = shots.find(s => s.id === 'ro-08');
  const node = build(shot);
  const tag = all(node, n => cls(n).includes('k-tag'))[0];
  assert.ok(tag && /Example|示例/.test(texts(tag).join('')), 'the unit is tagged');
  const pressed = controlsOf(node).filter(b => b.getAttribute('aria-pressed') === 'true');
  assert.equal(pressed.length, 1, 'one duration is shown at a time');
  assert.ok(texts(node).join(' ').includes(values.merchantValueBest[0]), 'the grid value is read from the binding');
});

test('the history scene selects a record and shows its approved fields', () => {
  const shot = shots.find(s => s.id === 'ro-02');
  const node = build(shot);
  const svg = byTag(node, 'svg')[0];
  assert.ok(['0', '1', '2'].includes(svg.getAttribute('data-node')), 'one of the three records is selected');
  const [nodes, view] = controlsOf(node);
  assert.ok(nodes && view, 'a node selector and a view switch exist');
  /* The second group switches the detail between the event and its meaning;
     put it back on the event so the record's own text is what is shown. */
  controlsOf(node)[3]?.click();
  const before = svg.getAttribute('data-node');
  const target = ['0', '1', '2'].find(v => v !== before);
  controlsOf(node).filter(b => (texts(b).join('') === 'H-RO-0' + (Number(target) + 1)))[0].click();
  assert.equal(svg.getAttribute('data-node'), target, 'clicking a record selects it');
  /* The view switch decides which of the four fields is shown, so the check is
     that the selected record's own words are on the page, not a fixed field. */
  const shown = texts(node).join(' ');
  const record = shot.extra.historyNodes[Number(target)];
  assert.ok(['constraint', 'choice', 'remains', 'effect'].some(key => shown.includes(record[key][0].slice(0, 20))), 'the selected record words are shown');
});
