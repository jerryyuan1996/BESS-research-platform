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


const {app}=await import('../src/app/state.js');
const {scenes}=await import('../src/markets/pjm/story/scenes.js');
const {story}=await import('../src/markets/pjm/story.js');
const {storyValues}=await import('../src/markets/pjm/storyBindings.js');
const {opportunities,CALLS,returnPct}=await import('../src/experience/model.js');
const row=opportunities('infraFund').find(r=>r.id==='pjm'),values=storyValues(row,{CALLS,returnPct});
const shots=[story.opening,...story.chapters.flatMap(c=>c.shots)];
const build=shot=>scenes[shot.scene](shot,{row,values});
test('all thirteen local renderers are accessible, bilingual, bounded and free of unresolved fields',()=>{
 assert.deepEqual(Object.keys(scenes),shots.map(s=>s.scene));
 for(const lang of ['en','zh']){app.lang=lang;for(const shot of shots){
  const node=build(shot);assert.ok(find(node,()=>true).length<1800,shot.id);
  for(const value of surface(node))assert.equal(/NaN|undefined|\[object|\{[A-Za-z][A-Za-z0-9]*\}/.test(value),false,shot.id);
  for(const svg of find(node,n=>n.tag==='svg'))assert.ok(svg.getAttribute('aria-label')||svg.getAttribute('aria-labelledby'),shot.id);
  assert.ok(lang==='en'?/[A-Za-z]/.test(content(node)):/[\u4e00-\u9fff]/.test(content(node)),shot.id);
 }}app.lang='en';
});
test('every teaching toggle changes only its local scene, preserving the selected investment case',()=>{
 const before=JSON.stringify(row),bound=JSON.stringify(values);
 for(const shot of shots.slice(1)){
  const node=build(shot),controls=find(node,n=>n.tag==='button');assert.ok(controls.length,shot.id);
  for(const button of controls){button.click();assert.equal(JSON.stringify(row),before,shot.id);assert.equal(JSON.stringify(values),bound,shot.id);}
 }
});
test('the price layer stays an unscaled Example while official and indicative credit paths stay separate',()=>{
 const node=build(shots.find(s=>s.id==='pjm-07'));
 const upper=find(node,n=>n.getAttribute?.('data-panel')==='price')[0];
 const bars=find(upper,n=>n.getAttribute?.('data-kind')==='example');assert.equal(bars.length,4);
 assert.equal(new Set(bars.map(b=>b.getAttribute('height'))).size,1);
 assert.equal(/\$|325\.00|337\.83|554\.72/.test(content(upper)),false);
 assert.ok(find(node,n=>n.getAttribute?.('data-kind')==='observed').length);
 assert.ok(find(node,n=>n.getAttribute?.('data-kind')==='indicative-non-binding'&&classes(n).includes('pjm-plan')).length);
 assert.ok(find(node,n=>n.tag==='table').length);
});
