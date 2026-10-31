/* Finland: source boundaries, local controls and kit-scene accessibility. */
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
const {scenes}=await import('../src/markets/fi/story/scenes.js');
const {segments}=await import('../src/markets/fi/story/chart.js');
const {validSnapshot}=await import('../src/markets/fi/story/data.js');
const {story}=await import('../src/markets/fi/story.js');
const {storyValues}=await import('../src/markets/fi/storyBindings.js');
const {opportunities,CALLS,returnPct}=await import('../src/experience/model.js');
const row=JSON.parse(JSON.stringify(opportunities('infraFund').find(r=>r.id==='fi'))),values=storyValues(row,{CALLS,returnPct});
const shots=story.chapters.flatMap(c=>c.shots);
const fixtures=new Map();
const load=async id=>{if(!fixtures.has(id))fixtures.set(id,JSON.parse(readFileSync(new URL('../public/data/public/'+id+'.json',import.meta.url),'utf8')));return fixtures.get(id);};
const build=(shot,lang='en')=>{app.lang=lang;return scenes[shot.scene](shot,{values,row,load});};
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const buttons=node=>find(node,n=>n.tag==='button'&&classes(n).includes('k-toggle'));
const clickNamed=(node,name)=>{const b=buttons(node).find(b=>content(b)===name);assert.ok(b,name);b.click();};

test('every Finnish scene reads in both languages and stays within the node budget after observations load',async()=>{
  assert.deepEqual(new Set(Object.keys(scenes)),new Set(shots.map(s=>s.scene)));
  for(const lang of ['en','zh'])for(const shot of shots){
    const node=build(shot,lang);await settle();
    for(const value of surface(node))assert.ok(!/NaN|undefined|\[object|\{[A-Za-z][A-Za-z0-9]*\}/.test(value),shot.id+' '+value);
    assert.ok(find(node,()=>true).length<=1500,shot.id+' node budget');
    assert.ok(lang==='en'?/[A-Za-z]/.test(content(node)):/[一-鿿]/.test(content(node)),shot.id+' readable');
    for(const svg of find(node,n=>n.tag==='svg'))assert.ok(svg.getAttribute('aria-labelledby')&&find(svg,n=>n.tag==='title').some(n=>content(n)),shot.id+' named image');
  }
  app.lang='en';
});
test('teaching controls change local scenes and never the market row or bound values',async()=>{
  const before=JSON.stringify({row,values});
  for(const shot of shots){
    const node=build(shot);await settle();
    for(const b of [...buttons(node)]){
      if(b.getAttribute('aria-pressed')==='true')continue;
      b.click();await settle();
    }
  }
  assert.equal(JSON.stringify({row,values}),before);
});
test('the signature chart preserves source gaps and marks only the left-censored observation',async()=>{
  const node=build(shots.find(s=>s.id==='fi-05'));clickNamed(node,'Current scale');await settle();
  assert.equal(find(node,n=>n.getAttribute?.('data-crossing')==='left-censored').length,1);
  const data=await load('fi-storage-capacity');
  const runs=segments(data.series);
  assert.equal(runs.length,7,'six source gaps make seven unjoined runs');
  assert.equal(runs.flat().length,data.series.length,'no point was filled or discarded');
  assert.equal(find(node,n=>n.getAttribute?.('data-series')==='network-model-technical-capacity').length,7);
  clickNamed(node,'Procurement history');
  assert.ok(content(node).includes('Average procured capacity'));
  assert.equal(find(node,n=>n.getAttribute?.('data-crossing')).length,0);
});
test('the future branch replaces the existing marker with one Thin marker',async()=>{
  const article=new El('article'),wrap=new El('p'),pill=new El('span');
  wrap.className='ix-story-marker';pill.className='ix-marker ix-marker-fair';wrap.append(pill);article.append(wrap);
  const node=build(shots.find(s=>s.id==='fi-03'));article.append(node);await settle();
  clickNamed(node,'Future plans');
  assert.ok(pill.className.includes('ix-marker-thin'));
  assert.equal(find(article,n=>classes(n).includes('ix-marker')).length,1);
  clickNamed(node,'History');
  assert.ok(pill.className.includes('ix-marker-fair'));
});
test('payment paths and loaded price units remain separate',async()=>{
  const node=build(shots.find(s=>s.id==='fi-10'));
  clickNamed(node,'Activation energy');
  const paths=find(node,n=>n.getAttribute?.('data-payment-path'));
  assert.equal(paths.filter(p=>!p.hidden).length,1);
  assert.equal(paths.find(p=>!p.hidden).getAttribute('data-payment-path'),'energy');
  assert.ok(content(paths.find(p=>!p.hidden)).includes('EUR/MWh'));
  assert.ok(content(paths.find(p=>!p.hidden)).includes('↔'),'the neutral settlement path is bidirectional');
  assert.ok(content(paths.find(p=>p.getAttribute('data-payment-path')==='capacity')).includes('EUR/MW/h'));
  const p=await load('fi-fcr-n');
  assert.equal(validSnapshot(p,'fi-fcr-n'),true);
  assert.equal(validSnapshot({...p,units:{price:'EUR/MWh'}},'fi-fcr-n'),false);
  assert.equal(validSnapshot({...p,authority:'model'},'fi-fcr-n'),false);
  const capacity=await load('fi-storage-capacity');
  assert.equal(validSnapshot(capacity,'fi-storage-capacity'),true);
  assert.equal(validSnapshot({...capacity,series:[{t:capacity.series[0].t,v:-1}]},'fi-storage-capacity'),false);
});

test('price evidence loads the seven committed capacity-price series with actual product vintages',async()=>{
  const shot=shots.find(s=>s.id==='fi-06'),node=build(shot);
  const drawer=find(node,n=>n.tag==='details')[0];drawer.open=true;drawer.emit('toggle');await settle();
  const select=find(node,n=>n.tag==='select'&&n.getAttribute('aria-label')==='Choose product')[0];
  assert.ok(select);
  for(const id of ['fi-fcr-n','fi-fcr-d-up','fi-fcr-d-down','fi-afrr-up','fi-afrr-down','fi-mfrr-up','fi-mfrr-down']){
    select.value=id;select.emit('change');await settle();
    assert.ok(find(node,n=>n.getAttribute?.('data-series')===id).length,id+' draws its own trace');
    assert.ok(content(node).includes('EUR/MW/h'));
    assert.ok(content(node).includes('Europe/Helsinki'));
    for(const value of surface(node))assert.ok(!/NaN|undefined|\{[A-Za-z][A-Za-z0-9]*\}/.test(value),id+' '+value);
  }
});
