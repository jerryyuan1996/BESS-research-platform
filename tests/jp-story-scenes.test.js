import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

class El{
  constructor(tag){this.tag=tag;this.nodeType=1;this.attrs=new Map();this.children=[];this.listeners={};this.style={};}
  setAttribute(k,v){this.attrs.set(k,String(v));}
  getAttribute(k){return this.attrs.get(k)??null;}
  removeAttribute(k){this.attrs.delete(k);}
  hasAttribute(k){return this.attrs.has(k);}
  set className(v){this.attrs.set('class',String(v));}
  get className(){return this.attrs.get('class')||'';}
  append(...kids){this.children.push(...kids);}
  prepend(...kids){this.children.unshift(...kids);}
  replaceChildren(...kids){this.children=[...kids];}
  addEventListener(type,fn){(this.listeners[type]||=[]).push(fn);}
  click(){for(const fn of this.listeners.click||[])fn({target:this,preventDefault(){}});}
}
globalThis.document={createElement:tag=>new El(tag),createElementNS:(_,tag)=>new El(tag),createTextNode:text=>({nodeType:3,text:String(text)})};
let reduced=false;
globalThis.matchMedia=()=>({matches:reduced});
const walk=(node,visit)=>{visit(node);for(const child of node.children||[])walk(child,visit);};
const all=(node,predicate)=>{const out=[];walk(node,n=>{if(predicate(n))out.push(n);});return out;};
const textOf=node=>all(node,n=>n.nodeType===3).map(n=>n.text).join(' ');
const tagged=(node,tag)=>all(node,n=>n.tag===tag);
const cls=(node,name)=>(node.getAttribute?.('class')||'').split(/\s+/).includes(name);
const data=(node,key,value)=>all(node,n=>n.getAttribute?.('data-'+key)===value);
const buttons=node=>tagged(node,'button').filter(n=>cls(n,'k-toggle'));

const {app}=await import('../src/app/state.js');
const {composeStory,JP_TIMELINE}=await import('../src/markets/jp/story.js');
const {storyValues,chartRows}=await import('../src/markets/jp/storyBindings.js');
const {scenes,fadeSeries}=await import('../src/markets/jp/story/scenes.js');
const {priceChart,priceTableRows}=await import('../src/markets/jp/story/chart.js');
const {JP_GEO_META,JP_AREAS}=await import('../src/markets/jp/story/geo.js');
const {JP_STORY_VALUES:V}=await import('../src/markets/jp/data/storyEvidenceValues.js');
const {opportunities,CALLS,returnPct}=await import('../src/experience/model.js');
const {marginText}=await import('../src/experience/decision.js');
const rows=opportunities('infraFund').filter(r=>r.id.startsWith('jp_'));
const ui={CALLS,returnPct,marginText};
const shots=story=>[story.opening,...story.chapters.flatMap(c=>c.shots)];
const context=row=>({row,values:storyValues(row,ui)});
const build=(row,shot)=>scenes[shot.scene](shot,context(row));

test('all twenty approved shot ids have local scenes and every composed scene renders in both languages',()=>{
  const used=new Set();
  for(const lang of ['en','zh']){
    app.lang=lang;
    for(const row of rows)for(const shot of shots(composeStory(row.id))){
      used.add(shot.scene);assert.equal(typeof scenes[shot.scene],'function',shot.id);
      const node=build(row,shot),surface=textOf(node);
      assert.doesNotMatch(surface,/NaN|undefined|\[object|\{[a-zA-Z][a-zA-Z0-9]*\}/,shot.id+' '+lang);
      assert.ok(surface.trim(),shot.id);
      if(lang==='zh')assert.match(surface,/[\u3400-\u9fff]/,shot.id);
      for(const svg of tagged(node,'svg').filter(n=>n.getAttribute('role')==='img'))assert.ok(tagged(svg,'title').some(t=>textOf(t).trim()),shot.id+' named image');
    }
  }
  app.lang='en';assert.deepEqual(new Set(Object.keys(scenes)),used);
});

test('every scene and each of its teaching states stays below the SVG/DOM node budget',t=>{
  let largest={id:null,count:0};
  const check=(node,id)=>{const count=all(node,()=>true).length;assert.ok(count<1500,id);if(count>largest.count)largest={id,count};};
  for(const row of rows)for(const shot of shots(composeStory(row.id))){
    const node=build(row,shot);
    check(node,shot.id);
    for(const button of buttons(node)){button.click();check(node,shot.id+' changed state');}
  }
  t.diagnostic(`Japan largest scene including HTML and text nodes: ${largest.id}, ${largest.count} nodes`);
});

test('teaching controls change their local scene without changing a case, URL or history',()=>{
  const location={pathname:'/markets/japan-tokyo',search:'?story=preview'},calls=[];
  globalThis.location=location;globalThis.history={pushState:(...a)=>calls.push(a),replaceState:(...a)=>calls.push(a)};
  for(const row of rows){
    const before=JSON.stringify(row),address=JSON.stringify(location);
    for(const shot of shots(composeStory(row.id))){const node=build(row,shot);for(const button of buttons(node))button.click();}
    assert.equal(JSON.stringify(row),before,row.id);assert.equal(JSON.stringify(location),address);
  }
  assert.deepEqual(calls,[]);
});

test('each timeline node selects its signed fields and a layer without replacing its button',()=>{
  const row=rows[0],shot=shots(composeStory(row.id)).find(s=>s.id==='jp-03'),node=build(row,shot);
  const picks=tagged(node,'button').filter(b=>cls(b,'jp-node-pick'));
  assert.equal(picks.length,JP_TIMELINE.length);
  picks.forEach((button,i)=>{
    button.click();assert.equal(button.getAttribute('aria-pressed'),'true');
    for(const pair of Object.values(JP_TIMELINE[i].fields))assert.ok(textOf(node).includes(pair[0]));
    assert.equal(data(node,'selected-node',String(i)).length,1);
  });
});

test('frequency map uses an approximate band, own-area outline and the recorded source blob',async()=>{
  const bytes=await readFile(new URL('../src/markets/jp/jp-zones.json',import.meta.url));
  const blob=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(blob,JP_GEO_META.gitBlob);assert.equal(JP_AREAS.length,9);
  assert.ok(JP_GEO_META.outputVertices<JP_GEO_META.inputVertices);
  for(const row of rows){
    const shot=shots(composeStory(row.id)).find(s=>s.id==='jp-01'),node=build(row,shot);
    assert.equal(data(node,'frequency-band','approximate')[0].tag,'polygon');
    assert.equal(all(node,n=>cls(n,'jp-map-own')&&n.getAttribute('data-region')===row.id.slice(3)).length,1);
  }
  const geo=await readFile(new URL('../src/markets/jp/story/geo.js',import.meta.url),'utf8');
  assert.doesNotMatch(geo,/highest curtailment|sourceUrl/);
  for(const area of JP_AREAS)assert.deepEqual(Object.keys(area),['id','east','path','center']);
});

test('Example scenes stay tagged and reduced-motion outages stay static',()=>{
  for(const row of rows){
    const story=composeStory(row.id);
    for(const id of ['jp-09',...(row.id==='jp_tokyo'?['jp-tokyo-10']:row.id==='jp_hokkaido'?['jp-hokkaido-10']:[])]){
      const node=build(row,shots(story).find(s=>s.id===id));assert.equal(data(node,'kind','example').length,1,id);
    }
    reduced=true;
    const node=build(row,shots(story).find(s=>s.id==='jp-02'));for(const button of buttons(node))button.click();
    assert.equal(all(node,n=>cls(n,'jp-rotate')).length,0);
    reduced=false;
  }
});

test('fade Example follows only the bound model inputs and cannot fabricate missing values',()=>{
  const line=fadeSeries({hours:9,floor:6,years:20,fade:.02});
  assert.equal(line.length,20);assert.equal(line[0].hours,9);assert.equal(line.at(-1).hours,9*.98**19);
  assert.ok(line.at(-1).hours>=6);
  assert.ok(fadeSeries({hours:6,floor:6,years:20,fade:.02})[1].hours<6);
  assert.deepEqual(fadeSeries({hours:null,floor:6,years:20,fade:.02}),[]);
});

test('price table values equal bound case values; USD never enters the JPY plot or table',()=>{
  const dataRows=chartRows(),expected=priceTableRows(dataRows);
  assert.equal(expected.length,9);
  for(const row of rows){
    const shot=shots(composeStory(row.id)).find(s=>s.id==='jp-08'),ctx=context(row),node=priceChart(shot,ctx,{compare:true});
    assert.equal(data(node,'axis-currency','JPY').length,2);assert.equal(data(node,'currency','USD').length,1);
    const svg=data(node,'axis-currency','JPY')[0],table=data(node,'price-table','true')[0];
    assert.doesNotMatch(textOf(svg),/USD|美元|platform.s yields/);assert.doesNotMatch(textOf(table),/USD|美元|\$/);
    assert.equal(all(node,n=>cls(n,'jp-build-cost')).length,0);assert.equal(all(node,n=>cls(n,'jp-discount-band')).length,0);
    for(const point of expected){
      const area=data(node,'area',point.marketId)[0];
      assert.equal(data(area,'case',point.key)[0].getAttribute('data-jpy-value'),String(point.pricePerMW));
      assert.ok(textOf(table).includes(new Intl.NumberFormat('en-US',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(point.pricePerMW)));
      assert.ok(textOf(table).includes((point.targetReturn*100).toFixed(3)+'%'));
    }
  }
});

test('resolved synthetic chart inputs produce a render-time price difference; missing prices produce no zero ticks',()=>{
  const row=rows[0],shot=shots(composeStory(row.id)).find(s=>s.id==='jp-08'),ctx=context(row);
  const copy=chartRows().map(area=>({...area,buildCostPerMW:300000000,cases:area.cases.map(c=>({...c}))}));
  const area=copy.find(r=>r.marketId===row.id),base=area.cases.find(c=>c.key==='base');
  const node=priceChart(shot,ctx,{data:copy});
  assert.equal(data(node,'discount-jpy',String(300000000-base.pricePerMW)).length,2);
  area.cases[0].pricePerMW=null;const missing=priceChart(shot,ctx,{data:copy});
  assert.equal(data(missing,'case','cautious').length,0);
  assert.equal(priceTableRows([area]).length,2);
});

test('Kyushu keeps physical/revenue panels separate and plots only anchored monthly days with their window',()=>{
  const row=rows.find(r=>r.id==='jp_kyushu'),shot=shots(composeStory(row.id)).find(s=>s.id==='jp-kyushu-10'),node=build(row,shot);
  assert.equal(data(node,'panel','physical').length,1);assert.equal(data(node,'panel','revenue').length,1);
  assert.equal(data(data(node,'panel','physical')[0],'panel','revenue').length,0);
  const monthTable=data(node,'observed-months','kyushu')[0];assert.equal(tagged(monthTable,'tbody')[0].children.length,3);
  assert.deepEqual(tagged(monthTable,'tbody')[0].children.map(tr=>textOf(tr.children[1])),V.regional.kyushu.outputControl.months.map(m=>String(m.days)));
  assert.ok(textOf(node).includes('January 2026'));assert.ok(textOf(node).includes('March 2026'));
});

test('all area revenue bars bind their own secured share; gross profit is a separate strip',()=>{
  for(const row of rows){
    const shot=shots(composeStory(row.id)).find(s=>s.id==='jp-12'),node=build(row,shot);
    buttons(node)[1].click();
    for(const expected of chartRows())assert.equal(data(node,'secured-share',String(expected.securedShare)).length>=1,true,expected.marketId);
    assert.equal(data(node,'base','other-market-profit').length,2);
    assert.equal(data(node,'revenue-table','true').length,1);
  }
});

test('per-value provenance stays behind a disclosure import and Japan styles respect reduced motion',async()=>{
  const ui=await readFile(new URL('../src/markets/jp/story/ui.js',import.meta.url),'utf8');
  assert.ok(ui.includes("import('../data/storyEvidenceProvenance.js')"));assert.doesNotMatch(ui,/^import[^\n]+storyEvidenceProvenance/m);
  const css=await readFile(new URL('../src/markets/jp/story/jp-story.css',import.meta.url),'utf8');
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);assert.match(css,/\.jp-plan[^}]*stroke-dasharray/);
});
