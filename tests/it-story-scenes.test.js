/* Italy: source gates, local controls, kit-scene accessibility and node budget. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

class El {
  constructor(tag){this.tag=tag;this.nodeType=1;this.attrs=new Map();this.children=[];this.listeners={};}
  setAttribute(k,v){this.attrs.set(k,String(v));}
  getAttribute(k){return this.attrs.get(k)??null;}
  set className(v){this.setAttribute('class',v);} get className(){return this.getAttribute('class')||'';}
  get value(){return this._value??this.getAttribute('value')??'';} set value(v){this._value=String(v);}
  get open(){return this.attrs.has('open');} set open(v){if(v)this.attrs.set('open','');else this.attrs.delete('open');}
  get hidden(){return this.attrs.has('hidden');} set hidden(v){if(v)this.attrs.set('hidden','');else this.attrs.delete('hidden');}
  append(...kids){for(let kid of kids){if(kid==null)continue;if(!kid.nodeType)kid={nodeType:3,text:String(kid)};kid.parentNode=this;this.children.push(kid);}}
  replaceChildren(...kids){this.children=[];this.append(...kids);}
  get firstChild(){return this.children[0]??null;}
  set textContent(s){this.replaceChildren({nodeType:3,text:String(s)});} get textContent(){return content(this);}
  addEventListener(type,fn){(this.listeners[type]||=[]).push(fn);}
  emit(type){const ev={target:this,preventDefault(){}};for(const fn of this.listeners[type]||[])fn(ev);this['on'+type]?.(ev);}
  click(){this.emit('click');}
  closest(selector){for(let node=this;node;node=node.parentNode)if(matches(node,selector))return node;return null;}
  querySelector(selector){return find(this,n=>n!==this&&matches(n,selector.split(' ').at(-1)))[0]||null;}
}
const walk=(node,fn)=>{fn(node);for(const child of node.children||[])walk(child,fn);};
const find=(node,pred)=>{const result=[];walk(node,n=>{if(pred(n))result.push(n);});return result;};
const content=node=>find(node,n=>n.nodeType===3).map(n=>n.text).join('');
const classes=n=>(n.getAttribute?.('class')||'').split(/\s+/);
const matches=(n,s)=>s.startsWith('.')?classes(n).includes(s.slice(1)):n.tag===s;
const surface=node=>find(node,n=>n.nodeType===3).map(n=>n.text).concat(find(node,n=>n.attrs).flatMap(n=>[...n.attrs.values()]));
globalThis.document={createElement:tag=>new El(tag),createElementNS:(_,tag)=>new El(tag),createTextNode:text=>({nodeType:3,text:String(text)})};
const {app}=await import('../src/app/state.js');
const {scenes}=await import('../src/markets/it/story/scenes.js');
const {story}=await import('../src/markets/it/story.js');
const {storyValues}=await import('../src/markets/it/storyBindings.js');
const {opportunities,CALLS,returnPct}=await import('../src/experience/model.js');
const row=JSON.parse(JSON.stringify(opportunities('infraFund').find(r=>r.id==='it'))),values=storyValues(row,{CALLS,returnPct});
const shots=story.chapters.flatMap(c=>c.shots);
const build=(shot,lang='en')=>{app.lang=lang;return scenes[shot.scene](shot,{values,row});};
const buttons=node=>find(node,n=>n.tag==='button'&&classes(n).includes('k-toggle'));

test('every Italian scene reads in both languages through the shared symbols',()=>{
 assert.deepEqual(new Set(Object.keys(scenes)),new Set(shots.map(s=>s.scene)));
 for(const lang of ['en','zh'])for(const shot of shots){
  const node=build(shot,lang);
  assert.ok(find(node,()=>true).length<=1500,shot.id+' node budget');
  for(const value of surface(node))assert.ok(!/NaN|undefined|\[object|\{[A-Za-z][A-Za-z0-9]*\}/.test(value),shot.id+' '+value);
  for(const svg of find(node,n=>n.tag==='svg'))assert.ok(svg.getAttribute('aria-labelledby')&&find(svg,n=>n.tag==='title').some(n=>content(n)),shot.id+' accessible name');
  assert.ok(lang==='en'?/[A-Za-z]/.test(content(node)):/[一-鿿]/.test(content(node)));
 }
 app.lang='en';
});
test('teaching controls never alter either investment case or the live bindings',()=>{
 const before=JSON.stringify({row,values});
 for(const shot of shots){const node=build(shot);for(const button of buttons(node))button.click();}
 assert.equal(JSON.stringify({row,values}),before);
});
test('the blocked chart stays an unscaled Example with no fabricated observations or prices',()=>{
 const node=build(shots.find(s=>s.id==='it-08'));
 const charts=find(node,n=>n.getAttribute?.('data-chart')==='Chart-IT-FORK');
 assert.equal(charts.length,1);
 assert.equal(charts[0].getAttribute('data-scaled'),'false');
 assert.equal(charts[0].getAttribute('data-authority'),'example');
 assert.equal(find(node,n=>n.getAttribute?.('data-authority')==='observed').length,0);
 assert.ok(content(node).includes('Example: two contract shapes'));
 assert.ok(content(node).includes('Never added together'));
 assert.ok(!/47,000|12,137|31,490/.test(content(node)));
 for(const plan of find(node,n=>n.getAttribute?.('data-authority')==='official-plan'))assert.ok(plan.getAttribute('stroke-dasharray'));
});
test('physical zones, the same-basis comparison and the toll watch retain their boundaries',()=>{
 const map=build(shots.find(s=>s.id==='it-01'));
 assert.equal(find(map,n=>n.getAttribute?.('data-zone')).length,7);
 const comparison=build(shots.find(s=>s.id==='it-10'));
 assert.equal(find(comparison,n=>n.getAttribute?.('data-basis')==='design').length,2);
 assert.ok(!content(comparison).includes(values.cardFigures[0]));
 const historic=build(shots.find(s=>s.id==='it-02'));
 assert.ok(content(historic).includes('31 October 2026'),'selected source check date, not the auction-table vintage');
 const end=build(shots.find(s=>s.id==='it-11'));
 assert.equal(find(end,n=>n.getAttribute?.('data-watch')==='toll').length,1);
 for(const plan of find(end,n=>['official-plan','scenario'].includes(n.getAttribute?.('data-authority'))))assert.ok(plan.getAttribute('stroke-dasharray'));
 const macse=build(shots.find(s=>s.id==='it-07'));
 assert.ok(buttons(macse).find(b=>content(b)==='Six hours').getAttribute('aria-pressed')==='true');
});
