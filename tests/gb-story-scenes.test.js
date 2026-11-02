import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

class El{
  constructor(tag){this.tag=tag;this.attrs=new Map();this.children=[];this.nodeType=1;this.listeners={};}
  setAttribute(k,v){this.attrs.set(k,String(v));}getAttribute(k){return this.attrs.get(k)??null;}
  set className(v){this.setAttribute('class',v);}get className(){return this.getAttribute('class')||'';}
  append(...kids){this.children.push(...kids.flat().filter(k=>k!==null&&k!==undefined));}
  replaceChildren(...kids){this.children=[];this.append(...kids);}
  addEventListener(k,v){this.listeners[k]=v;}
  set textContent(v){this.children=[{nodeType:3,textContent:String(v)}];}
  get textContent(){return this.children.map(k=>k?.textContent??String(k)).join('');}
}
globalThis.document={createElement:t=>new El(t),createElementNS:(_,t)=>new El(t),createTextNode:t=>({nodeType:3,textContent:String(t)})};
const {scenes}=await import('../src/markets/gb/story/scenes.js');
const {chartSvg,segments}=await import('../src/markets/gb/story/chart.js');
const {validSummary,loadResponseData,loadSummary}=await import('../src/markets/gb/story/data.js');
const {story}=await import('../src/markets/gb/story.js');
const {storyBindings}=await import('../src/markets/gb/storyBindings.js');
const {opportunities}=await import('../src/experience/model.js');
const {app}=await import('../src/app/state.js');
const row=opportunities('infraFund').find(r=>r.id==='gb'),bindings=storyBindings(row);
const shots=[story.opening,...story.chapters.flatMap(c=>c.shots)];
const sources=['gb-dynamic-response','gb-eac-response'].map(id=>JSON.parse(readFileSync(new URL('../public/data/public/'+id+'.summary.json',import.meta.url),'utf8')));
const data={sources,rows:sources.flatMap(d=>d.monthly.map(r=>({...r,platform:d.datasetId==='gb-dynamic-response'?'dynamic':'eac'})))};
const ctx={...bindings,row,data};
const walk=node=>[node,...(node.children||[]).flatMap(walk)];
const elements=node=>walk(node).filter(e=>e.nodeType===1);

test('all thirteen local renderers provide accessible visuals and stay within the SVG node budget in both languages',()=>{
  assert.deepEqual(Object.keys(scenes),shots.map(s=>s.id));
  for(const lang of ['en','zh']){
    app.lang=lang;
    for(const shot of shots){
      const node=scenes[shot.scene](shot,ctx),svg=elements(node).filter(e=>e.tag==='svg');
      assert.ok(svg.length||elements(node).some(e=>e.getAttribute('data-payment')!==null),shot.id);
      for(const chart of svg){assert.ok(elements(chart).length<=1500,shot.id+' '+elements(chart).length);assert.equal(chart.getAttribute('role'),'img');}
      assert.doesNotMatch(node.textContent,/undefined|NaN|\{[a-zA-Z]/,shot.id);
    }
  }
  app.lang='en';
});

test('every teaching control changes only its local drawing and preserves the investment row',()=>{
  const before=JSON.stringify(row);
  for(const shot of shots.slice(1)){
    const node=scenes[shot.scene](shot,ctx);
    for(const button of elements(node).filter(e=>e.tag==='button'&&e.getAttribute('aria-pressed')!==null))button.listeners.click();
  }
  assert.equal(JSON.stringify(row),before);
  const battery=scenes['gb-08'](shots[8],ctx);
  const controls=elements(battery).filter(e=>e.tag==='button');
  controls[1].listeners.click();assert.ok(elements(battery).some(e=>e.getAttribute('data-teaching-hours')===String(bindings.duration.shorter)));
  controls[2].listeners.click();assert.ok(elements(battery).some(e=>e.getAttribute('data-teaching-hours')===String(bindings.duration.longer)));
  const teaching=new Map();const first=scenes['gb-08'](shots[8],{...ctx,teaching});
  elements(first).filter(e=>e.tag==='button')[2].listeners.click();
  app.lang='zh';const translated=scenes['gb-08'](shots[8],{...ctx,teaching});
  assert.equal(elements(translated).filter(e=>e.tag==='button')[2].getAttribute('aria-pressed'),'true');
  assert.ok(elements(translated).some(e=>e.getAttribute('data-teaching-hours')===String(bindings.duration.longer)));
  app.lang='en';assert.equal(JSON.stringify(row),before);
});

test('the numeric signature chart preserves negative prices and separate source/method paths',()=>{
  const svg=chartSvg(shots[5],{...ctx,selected:3}),nodes=elements(svg);
  assert.equal(svg.getAttribute('data-mode'),'observed');assert.ok(Number(svg.getAttribute('data-price-min'))<0);
  const paths=nodes.filter(e=>e.getAttribute('class')==='gb-observed-line');
  assert.ok(paths.some(e=>e.getAttribute('data-platform')==='dynamic/accepted-bid'));
  assert.ok(paths.some(e=>e.getAttribute('data-platform')==='eac/clearing'));
  assert.ok(paths.some(e=>e.getAttribute('data-field')==='batteryMW'));
  assert.ok(paths.every(e=>e.getAttribute('stroke-dasharray')===null));
  assert.ok(nodes.some(e=>e.getAttribute('data-event')==='OBP'));
  assert.doesNotMatch(svg.textContent,/£\/MWh|GBP\/MWh|annualised|annualized/);
  const missing=[{month:'2026-01',from:'2026-01-01',service:'DCL',platform:'eac',basis:'clearing',price:1},{month:'2026-03',from:'2026-03-01',service:'DCL',platform:'eac',basis:'clearing',price:2}];
  assert.equal(segments(missing,'price','DCL').length,2,'missing months are not interpolated');
});

test('unavailable observations use the approved unscaled Example, never a numeric price axis',()=>{
  for(const lang of ['en','zh']){
    app.lang=lang;const svg=chartSvg(shots[5],{values:bindings.values});
    assert.equal(svg.getAttribute('data-mode'),'example');assert.match(svg.textContent,lang==='en'?/Example/:/示例/);
    assert.equal(elements(svg).filter(e=>e.getAttribute('class')==='gb-tick').length,0);
    assert.doesNotMatch(svg.textContent,/\d/);
  }
  app.lang='en';
});

test('the monthly table exposes matching price and technology MW with the required attribution',()=>{
  const chart=scenes['gb-05'](shots[5],ctx),all=elements(chart);
  assert.ok(all.some(e=>e.tag==='table'));assert.match(chart.textContent,/Of which battery/);assert.match(chart.textContent,/Other or unlabelled/);
  assert.match(chart.textContent,/Supported by National Energy SO Open Data/);assert.match(chart.textContent,/not battery earnings/);
  assert.equal(all.filter(e=>e.tag==='tbody')[0].children.length,data.rows.length);
});

test('plans and the assumed toll stay dashed, with the fee pending and no reference comparison',()=>{
  const queue=scenes['gb-07'](shots[7],ctx),toll=scenes['gb-11'](shots[11],ctx);
  assert.match(queue.textContent,/Decision pending/);assert.ok(elements(queue).some(e=>e.getAttribute('data-authority')==='official-proposal'));
  assert.match(toll.textContent,/Model assumption, not a signed contract/);assert.doesNotMatch(toll.textContent,/Reference case/);
  const css=readFileSync(new URL('../src/markets/gb/story/story.css',import.meta.url),'utf8');
  assert.match(css,/gb-proposal\s*\{[^}]*border-style:dashed/);assert.match(css,/gb-assumed-toll\s*\{[^}]*stroke-dasharray/);assert.match(css,/gb-merchant-tail\s*\{[^}]*stroke-dasharray/);
  assert.equal(scenes['gb-03'](shots[3],ctx).textContent.includes('201 MW'),false);
});

test('only checksummed, correctly licensed monthly summaries can enable numeric observations',async()=>{
  for(const source of sources)assert.equal(await validSummary(source,source.datasetId),true);
  const bad=structuredClone(sources[0]);bad.monthly[0].price+=1;assert.equal(await validSummary(bad,bad.datasetId),false);
  assert.equal(await validSummary({...sources[0],units:{price:'GBP/MWh'}},sources[0].datasetId),false);
  assert.equal(await validSummary({...sources[0],source:{...sources[0].source,licence:'Unresolved'}},sources[0].datasetId),false);
  let requests=0;
  assert.equal(await loadSummary('unregistered',{fetcher:()=>{requests++;}}),null);assert.equal(requests,0);
  const loaded=await loadResponseData({reload:true,fetcher:async url=>{requests++;const id=url.split('/').at(-1).replace('.summary.json','');return {ok:true,json:async()=>sources.find(s=>s.datasetId===id)};}});
  assert.equal(requests,2);assert.equal(loaded.rows.length,data.rows.length);
});
