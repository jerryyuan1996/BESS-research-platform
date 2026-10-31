/* The WA story's scenes (immersive-experience plan, WP-07), built against a
   minimal document: every shot finds its scene, every scene reads in both
   languages within the node budget, and every control is a labelled toggle
   that changes the scene's own teaching state and never the case. The built
   dialog is exercised in e2e/story.spec.js. */
import test from 'node:test';
import assert from 'node:assert/strict';

/* ---- a minimal document: elements, attributes, children, events -------- */
class El {
  constructor(tag){ this.tag = tag; this.attrs = new Map(); this.children = []; this.nodeType = 1; this.listeners = {}; }
  setAttribute(k, v){ this.attrs.set(k, String(v)); }
  getAttribute(k){ return this.attrs.get(k) ?? null; }
  set className(v){ this.attrs.set('class', String(v)); }
  get className(){ return this.attrs.get('class') || ''; }
  append(...c){ this.children.push(...c); }
  replaceChildren(...c){ this.children = [...c]; }
  get firstChild(){ return this.children[0] ?? null; }
  addEventListener(type, fn){ (this.listeners[type] ||= []).push(fn); }
  click(){ for (const fn of this.listeners.click || []) fn({ target: this }); }
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
const cls = (n) => (n.getAttribute?.('class') || '').split(/\s+/);
/* Everything a reader or a screen reader gets: text and attribute values. */
const surface = (node) => [...texts(node), ...elements(node).flatMap(e => [...e.attrs.values()])];

const { app } = await import('../src/app/state.js');
const { scenes } = await import('../src/markets/wa/story/scenes.js');
const { story } = await import('../src/markets/wa/story.js');
const { storyValues } = await import('../src/markets/wa/storyBindings.js');
const { opportunities } = await import('../src/experience/model.js');

const row = opportunities('infraFund').find(r => r.id === 'wa');
const values = storyValues(row);
const shots = story.chapters.flatMap(c => c.shots);
const build = (shot, lang = 'en') => { app.lang = lang; return scenes[shot.scene](shot, { values, row }); };
const controlsOf = (node) => byTag(node, 'button').filter(b => cls(b).includes('k-toggle'));

test('every chapter shot has a scene, and every scene is used', () => {
  for (const shot of shots) assert.equal(typeof scenes[shot.scene], 'function', `${shot.id}: ${shot.scene}`);
  const used = new Set(shots.map(s => s.scene));
  for (const id of Object.keys(scenes)) assert.ok(used.has(id), `scene ${id} has no shot`);
});

test('every scene reads in both languages with no gaps', () => {
  for (const lang of ['en', 'zh']){
    for (const shot of shots){
      const node = build(shot, lang);
      for (const v of surface(node)) assert.ok(!/NaN|undefined|\[object|\{[a-zA-Z]+\}/.test(v), `${shot.id} ${lang}: ${v}`);
      const words = texts(node).filter(t => /[A-Za-z一-鿿]/.test(t));
      assert.ok(words.length > 0, `${shot.id} ${lang} has words`);
      if (lang === 'zh') assert.ok(words.some(t => /[一-鿿]/.test(t)), `${shot.id} reads in Chinese`);
    }
  }
  app.lang = 'en';
});

test('every scene stays within the 1,500-node budget', () => {
  for (const shot of shots){
    const n = all(build(shot), () => true).length;
    assert.ok(n <= 1500, `${shot.id}: ${n} nodes`);
  }
});

test('every drawing is a named image', () => {
  for (const shot of shots){
    for (const svg of byTag(build(shot), 'svg').filter(s => s.getAttribute('role') === 'img')){
      const title = byTag(svg, 'title')[0];
      assert.ok(title && texts(title).join('').trim(), `${shot.id}: the image has a title`);
      assert.ok(svg.getAttribute('aria-labelledby'), `${shot.id}: the image is labelled`);
    }
  }
});

test('controls are labelled toggle groups with one state each', () => {
  for (const shot of shots){
    const node = build(shot);
    for (const g of all(node, n => n.getAttribute?.('role') === 'group')) assert.ok(g.getAttribute('aria-label'), `${shot.id}: group label`);
    for (const b of controlsOf(node)){
      assert.equal(b.getAttribute('type'), 'button');
      assert.ok(['true', 'false'].includes(b.getAttribute('aria-pressed')), `${shot.id}: aria-pressed`);
      assert.ok(texts(b).join('').trim(), `${shot.id}: the button has words`);
    }
  }
});

test('a scene has toggles where the script gives its shot controls', () => {
  // wa-14's controls name its risk factors, which the shell lists beside the scene
  const expected = shots.filter(s => s.controls?.length && s.id !== 'wa-14').map(s => s.id);
  assert.deepEqual(shots.filter(s => controlsOf(build(s)).length).map(s => s.id), expected);
});

test('every control changes the scene, and never the case', () => {
  const before = JSON.stringify({ row, values });
  for (const shot of shots){
    const node = build(shot);
    // every choice not already showing; pressing the current choice again is a no-op
    for (const b of controlsOf(node)){
      if (b.getAttribute('aria-pressed') === 'true') continue;
      const was = JSON.stringify(surface(node));
      b.click();
      assert.notEqual(JSON.stringify(surface(node)), was, `${shot.id}: "${texts(b).join('')}" changes nothing`);
    }
  }
  assert.equal(JSON.stringify({ row, values }), before, 'controls left the row and its values as they were');
});

test('a single-choice group keeps exactly one choice pressed', () => {
  const shot = shots.find(s => s.id === 'wa-08');
  const node = build(shot);
  const [sizes] = all(node, n => n.getAttribute?.('role') === 'group');
  const buttons = byTag(sizes, 'button');
  for (const b of buttons){
    b.click();
    assert.deepEqual(buttons.map(x => x.getAttribute('aria-pressed')), buttons.map(x => String(x === b)));
  }
});

test('teaching numbers are tagged Example where they are read out', () => {
  for (const id of ['wa-08', 'wa-11']){
    const node = build(shots.find(s => s.id === id));
    const tag = all(node, n => cls(n).includes('k-tag'))[0];
    assert.ok(tag && /Example/.test(texts(tag).join('')), `${id} tags its teaching unit`);
  }
});

test('the allocation board flags the evening conflict and clears it when services stop', () => {
  const node = build(shots.find(s => s.id === 'wa-11'));
  const conflict = () => all(node, n => cls(n).includes('k-conflict')).length;
  assert.equal(conflict(), 1, 'capacity plus services exceeds the battery in the window');
  const services = controlsOf(node).find(b => cls(b) && /services/i.test(texts(b).join('')));
  services.click();
  assert.equal(conflict(), 0);
});
