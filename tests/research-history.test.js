import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {parseAst} from 'rollup/parseAst';
import {marketIds} from '../src/markets/registry.js';
import {PUBLIC_STORY_IDS,HISTORY_ONLY_IDS,publicReadingFor,publicStoryFor} from '../src/experience/story/registry.js';
import {PUBLIC_READING_CATALOG} from '../src/experience/story/public/historyCatalog.js';
import {loadPublicContent} from '../src/experience/story/public/content.js';
import {createFormat} from '../src/markets/_shared/format.js';
import {app} from '../src/app/state.js';
import {renderResearchHistory} from '../src/experience/story/public/historyChapter.js';
import {badge} from '../src/components/badge.js';

const contract=JSON.parse(await readFile(new URL('./contracts/research-history-source.json',import.meta.url)));
const source=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const hash=s=>createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
const property=(n,key)=>n?.properties?.find(p=>(p.key?.name||p.key?.value)===key)?.value;
function walk(n,fn){if(!n||typeof n!=='object')return;fn(n);Object.values(n).forEach(v=>Array.isArray(v)?v.forEach(x=>walk(x,fn)):walk(v,fn));}
async function historyFor(owner){
  const {researchHistory}=await import(`../src/markets/${owner}/history.js`);
  if(owner==='wa')return researchHistory(await import('../src/markets/wa/ui.js'));
  const [{M},{MKT},{SRC}]=await Promise.all(['data','mkt','sources'].map(name=>import(`../src/markets/${owner}/${name}.js`)));
  return researchHistory({M,SRC,...createFormat(MKT)});
}
const nodes=h=>h.cards.flatMap(c=>c.blocks.filter(b=>b.t==='timeline').flatMap(b=>b.items));

/* Keep the frozen relocation contract unchanged. The analyst-authorised factual
   correction is the only exception, asserted separately below against AEMO:
   https://www.aemo.com.au/initiatives/major-programs/nem-reform-program/nem-reform-program-initiatives/fast-frequency-response
   Reversing these exact edits for the old hash check still protects every other
   original character, rather than regenerating a baseline around changed copy. */
function beforeApprovedNemCorrection(text){
  const edits=[
    ["y:'2017–2023'", "y:'2017–2021'"],
    ['The first large NEM batteries earned most of their revenue in FCAS as synchronous plant retired and inertia thinned. The AEMC made the final rule for very fast raise and lower FCAS on 15 July 2021; AEMO opened those markets on 9 October 2023.', 'The first large NEM batteries earned most of their revenue in FCAS, and AEMO introduced very fast raise and lower markets in 2021 as synchronous plant retired and inertia thinned.'],
    ['随着同步机组退役、惯量下降，NEM首批大型电池的收入主要来自FCAS。AEMC于2021年7月15日制定极快速上调与下调FCAS的最终规则；AEMO于2023年10月9日启动这两个市场。', 'NEM首批大型电池的收入主要来自FCAS；随着同步机组退役、惯量下降，AEMO于2021年设立了极快速上调与下调市场。'],
    ["        { t:'src', src: SRC.fastFrequencyResponse, use:['Very Fast FCAS final rule on 15 July 2021 and market commencement on 9 October 2023','极快速FCAS最终规则制定于2021年7月15日，市场启动于2023年10月9日'] },\n", ''],
  ];
  for(const [corrected,original]of edits){
    assert.equal(text.split(corrected).length,2,'only the exact reviewed NEM correction is exempt from the original hash');
    text=text.replace(corrected,original);
  }
  return text;
}

test('NEM history separates the Very Fast FCAS final rule from market commencement in both languages',async()=>{
  const h=await historyFor('nem'),event=nodes(h)[0];
  assert.equal(event.y,'2017–2023');
  assert.match(event.p[0],/AEMC made the final rule.*15 July 2021; AEMO opened those markets on 9 October 2023/);
  assert.match(event.p[1],/AEMC于2021年7月15日制定.*最终规则；AEMO于2023年10月9日启动/);
  const source=h.cards[0].blocks.find(b=>b.t==='src'&&b.src.url.endsWith('/fast-frequency-response'));
  assert.ok(source,'the corrected claim links the primary market-commencement record');
  assert.equal(source.src.lastChecked,'2026-11-10');
});

test('all registered histories are covered without asserting three missing original Story approvals',async()=>{
  assert.deepEqual(Object.keys(PUBLIC_READING_CATALOG).sort(),marketIds().sort());
  assert.equal(Object.keys(contract.owners).length,16);
  assert.equal(Object.values(contract.owners).reduce((n,c)=>n+c.nodes.length,0),90);
  assert.equal([...PUBLIC_STORY_IDS,...HISTORY_ONLY_IDS].length,18);
  for(const id of marketIds())assert.ok(publicReadingFor(id),id);
  for(const id of HISTORY_ONLY_IDS){
    assert.equal(publicStoryFor(id),null);
    const data=await loadPublicContent(id);
    assert.equal(data.summary.historyOnly,true);assert.equal(data.approvalRecords,undefined);
    assert.equal(data.summary.logic,undefined);assert.equal(data.summary.g1ApprovedOn,undefined);
  }
});

test('full original source expressions preserve every period, title, paragraph, capital lens and context',async()=>{
  for(const [owner,c]of Object.entries(contract.owners)){
    const current=await source(c.target),text=owner==='nem'?beforeApprovedNemCorrection(current):current,ast=parseAst(text),all=[];walk(ast,n=>{if(n.start!=null)all.push(n);});
    const hashes=new Set(all.map(n=>hash(text.slice(n.start,n.end))));
    const body=all.find(n=>n.type==='ReturnStatement'&&property(n.argument,'cards'))?.argument;
    assert.ok(body,owner);
    for(const key of ['head','cap'])if(c[key+'Hash'])assert.equal(hash(text.slice(property(body,key).start,property(body,key).end)),c[key+'Hash'],owner+'/'+key);
    if(owner!=='wa'){
      assert.deepEqual(property(body,'cards').elements.map(n=>hash(text.slice(n.start,n.end))),c.cardHashes,owner+' complete original cards including all supporting explanations and source blocks');
      if(c.bindingHash)assert.ok(hashes.has(c.bindingHash),owner+' original formatter binding');
    }else{
      for(const digest of c.contextHashes)assert.ok(hashes.has(digest),'WA original introduction, five tails and before/after context');
      const pairs=new Set(all.filter(n=>n.type==='ArrayExpression'&&n.elements.length===2&&n.elements.every(x=>x?.type==='Literal'&&typeof x.value==='string')).map(n=>JSON.stringify(n.elements.map(x=>x.value))));
      for(const pair of c.textPairs)assert.ok(pairs.has(JSON.stringify(pair)),'WA source table, flow, context and source-label text '+pair[0]);
    }
    if(c.dataTimeline){
      const data=await source(c.dataTimeline.target||c.dataTimeline.path),dataAst=parseAst(data);let items;
      walk(dataAst,n=>{if(n.type==='Property'&&(n.key?.name||n.key?.value)===(c.dataTimeline.key||'timeline'))items=n.value;});
      assert.equal(hash(data.slice(items.start,items.end)),c.dataTimeline.hash,owner+' unchanged authoritative data timeline');
      items.elements.forEach(n=>hashes.add(hash(data.slice(n.start,n.end))));
    }
    for(const event of c.nodes)assert.ok(hashes.has(event.hash),`${owner} axis ${event.axis} ${event.period} full y/t/p/i`);
    const h=await historyFor(owner);assert.equal(nodes(h).length,c.nodes.length,owner);
    assert.match(await source(c.original),/researchHistory\(/,owner+' original research reads shared authority');
  }
});

test('chapter-only inputs are verbatim source fields shared back into the complete dataset',async()=>{
  for(const [owner,c]of Object.entries(contract.owners)){
    assert.ok(c.dataBindings,owner);const text=await source(c.dataBindings.target),hashes=new Set();
    walk(parseAst(text),n=>{if(n.start!=null)hashes.add(hash(text.slice(n.start,n.end)));});
    for(const field of c.dataBindings.fields)assert.ok(hashes.has(field.hash),owner+'/'+field.path+' original expression, not a frozen evaluation');
    if(c.formatBindings){
      const [{MKT},{HISTORY_FORMAT}]=await Promise.all([import(`../src/markets/${owner}/mkt.js`),import(`../src/markets/${owner}/historyData.js`)]);
      for(const field of c.formatBindings.fields){assert.ok(hashes.has(field.hash),owner+' original formatter constant '+field.path);assert.equal(MKT[field.path],HISTORY_FORMAT[field.path]);}
    }
    const {readHistory}=await import(`../src/markets/${owner}/historyEntry.js`);
    const full=await historyFor(owner),chapter=readHistory();
    assert.equal(JSON.stringify(chapter.cards),JSON.stringify(full.cards),owner+' full dataset and chapter-only projection render the same complete history');
    if(owner==='wa'){
      const [{SEED},{WEM_MARKET},{HISTORY_SEED,HISTORY_WEM}]=await Promise.all([
        import('../src/markets/wa/data/seed.js'),import('../src/markets/wa/data/wemMarket.js'),import('../src/markets/wa/historyData.js')]);
      for(const key of Object.keys(HISTORY_SEED))assert.deepEqual(SEED[key],HISTORY_SEED[key],'WA/'+key);
      assert.equal(WEM_MARKET.cis,HISTORY_WEM.cis);
      assert.equal(Object.getOwnPropertyDescriptor(SEED,'fleetAvgHours').get.call({fleetMWh:450,fleetMW:100}),4.5,'original getter remains bound to its current caller');
    }else{
      const [{M},{HISTORY_DATA}]=await Promise.all([import(`../src/markets/${owner}/data.js`),import(`../src/markets/${owner}/historyData.js`)]);
      for(const field of c.dataBindings.fields){const parts=field.path.split('.');assert.deepEqual(parts.reduce((n,k)=>n[k],M),parts.reduce((n,k)=>n[k],HISTORY_DATA),owner+'/'+field.path);}
      for(const [field,digest]of Object.entries(c.sharedCopyHashes||{}))assert.equal(hash(JSON.stringify(M[field])),digest,owner+'/'+field+' full original research copy remains byte-equivalent');
    }
    assert.doesNotMatch(await source(`src/markets/${owner}/historyEntry.js`),/from ['"].*(?:dashboard|sections|\/data|engine|finance)\.js/,'chapter adapters do not import complete datasets or dashboards');
  }
});

test('shared histories retain live data owners and original number formatters',async()=>{
  for(const [owner,c]of Object.entries(contract.owners)){
    if(owner==='wa')continue;
    const [{researchHistory},{M},{MKT},{SRC}]=await Promise.all(['history','data','mkt','sources'].map(name=>import(`../src/markets/${owner}/${name}.js`)));
    const api={M,SRC,...createFormat(MKT)},before=researchHistory(api);
    if(c.dataTimeline){assert.equal(before.cards[0].blocks[0].items,M.timeline,owner+' no copied data-owner array');continue;}
    const text=await source(c.target),keys=[...new Set([...text.matchAll(/\bO\.([A-Za-z0-9_]+)/g)].map(m=>m[1]))];
    const key=keys.find(k=>typeof M.official?.[k]==='number');
    if(key){
      const altered={...M,official:{...M.official,[key]:M.official[key]+Math.max(10000,Math.abs(M.official[key])*.13)}};
      assert.notDeepEqual(nodes(researchHistory({...api,M:altered})),nodes(before),owner+'/'+key+' is evaluated from its original owner, not frozen prose');
    }
  }
  const {RCM_HISTORY}=await import('../src/markets/wa/data/rcmHistory.js');
  const wa=await historyFor('wa');assert.equal(wa.cards[0].blocks[1].items,RCM_HISTORY.milestones);
  assert.equal(wa.cards[1].blocks[0].items.filter(n=>n.y==='2025–2026').length,2,'distinct same-period WA nodes are not deduplicated');
  const {WEM_MARKET}=await import('../src/markets/wa/data/wemMarket.js');
  assert.ok(wa.cards[1].blocks[0].items[5].p[0].includes(String(WEM_MARKET.cis.tender2MW)));
});

/* A text-preserving DOM stand-in checks the actual shared renderer, rather than
   just counting arrays. Browser tests exercise native layout and interactions. */
function element(tag){return {nodeType:1,tag,attrs:{},children:[],style:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(){},append(...children){this.children.push(...children);},get textContent(){return this.children.map(x=>x.textContent??String(x)).join('');}};}
function descendants(node,predicate){return [node,...(node.children||[]).flatMap(n=>descendants(n,predicate))].filter(predicate);}
test('actual EN/ZH rendering includes every full field and all original explanations across eighteen routes',async()=>{
  const previous=globalThis.document;
  globalThis.document={createElement:element,createTextNode:text=>({nodeType:3,textContent:String(text)})};
  try{
    for(const lang of ['en','zh']){
      app.lang=lang;let instances=0;
      for(const id of marketIds()){
        const owner=id.startsWith('jp_')?'jp':id,h=await historyFor(owner),index=lang==='en'?0:1;
        const rendered=renderResearchHistory({...h,owner,marketId:id});
        const actual=descendants(rendered,n=>n.attrs?.['data-history-node']);
        const expected=nodes(h);assert.equal(actual.length,expected.length,id+'/'+lang);
        expected.forEach((event,i)=>{
          for(const key of ['y','t','p','i']){
            const field=descendants(actual[i],n=>n.attrs?.['data-history-field']===key);
            assert.equal(field.length,1,id+'/'+key);
            assert.equal(field[0].textContent,key==='y'?event.y:event[key][index],id+'/'+lang+'/'+i+'/'+key+' never truncated');
          }
        });
        function fullText(b){
          for(const key of ['head','cap','title','b','text','sig'])if(Array.isArray(b[key])&&b[key].length===2&&b[key].every(x=>typeof x==='string'))assert.ok(rendered.textContent.includes(b[key][index]),id+'/'+key+' full explanation');
          (b.blocks||b.cards||[]).forEach(fullText);
          if(b.t==='src')for(const key of ['file','date','cy'])if(b.src[key])assert.ok(rendered.textContent.includes(b.src[key]),id+'/source/'+key);
        }
        fullText(h);h.cards.forEach(fullText);instances+=actual.length;
        const authority=[];
        function classifications(block){
          if(block.badges?.length)authority.push(block.badges.map(kind=>badge(kind).textContent).join(''));
          (block.blocks||block.cards||[]).forEach(classifications);
        }
        h.cards.forEach(classifications);
        assert.deepEqual(descendants(rendered,n=>n.className==='public-history-authority').map(n=>n.textContent),authority,
          id+'/'+lang+' source classifications retain their vocabulary, not array-index label overrides');
        if(owner==='jp'){
          assert.equal(expected[2].t[0],'Kyushu output control begins');
          const regions=descendants(rendered,n=>n.className==='public-history-region');assert.equal(regions.length,3);
          assert.equal(regions.filter(n=>n.textContent.includes(lang==='en'?'Current region':'当前地区')).length,1,id);
        }
      }
      assert.equal(instances,104,'Japan national seven shared across three routes');
    }
  }finally{globalThis.document=previous;app.lang='en';}
});
