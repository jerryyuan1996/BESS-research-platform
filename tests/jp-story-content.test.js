import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {composeStory,SHARED_SHOTS,JP_TIMELINE,REGIONAL_SENTENCES} from '../src/markets/jp/story.js';
import {storyValues,storyMatches,reviewed,chartRows,storyWithAvailableValues,datePair} from '../src/markets/jp/storyBindings.js';
import {validateStory,tokensIn,fillTokens} from '../src/experience/story/contract.js';
import {HOME_BRIEFING as B} from '../src/briefing/homeData.js';
import {expandReferences} from '../src/acquisition/projection.js';
import {opportunities,CALLS,returnPct} from '../src/experience/model.js';
import {marginText} from '../src/experience/decision.js';
import {playTitle} from '../src/governance/playTitle.js';
import {JP_LTDA_MERCHANT_RETENTION} from '../src/markets/jp/regions.js';

const regions=['tokyo','kyushu','hokkaido'];
const stories=regions.map(composeStory);
const shots=story=>[story.opening,...story.chapters.flatMap(c=>c.shots)];
const rows=opportunities('infraFund').filter(r=>r.id.startsWith('jp_'));
const ui={CALLS,returnPct,marginText,playTitle};
const signed=await readFile(new URL('../docs/immersive-experience-plan/japan-storyboard.md',import.meta.url),'utf8');
const tables={};let active;
for(const line of signed.split(/\r?\n/)){
  const match=/^#{3,4} (jp-(?:[a-z]+-)?\d\d) —/.exec(line);
  if(match){active=match[1];tables[active]={};continue;}
  if(/^#{1,4} /.test(line))active=null;
  if(active&&/^\| (Question|Copy|Meaning|Marker|Controls|Labels|Caption) \|/.test(line)){
    const [key,en,zh]=line.split('|').slice(1,-1).map(s=>s.trim());tables[active][key]=[en,zh];
  }
}
const plainSigned=s=>s.replace(/‹bound: [^›]+›/g,'@').replaceAll('**','').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1');
const plainBuilt=s=>s.replace(/\{[a-zA-Z][a-zA-Z0-9]*\}/g,'@');

test('all three Japan compositions validate as complete ordinary fourteen-shot stories',()=>{
  for(const story of stories){assert.deepEqual(validateStory(story),{ok:true,complete:true,problems:[]});assert.equal(shots(story).length,14);}
  assert.equal(composeStory('jp_unknown'),null);
  assert.equal(composeStory('other'),null);
});

test('eleven shared shot objects and their serialized bytes are identical across areas',()=>{
  assert.equal(Object.keys(SHARED_SHOTS).length,11);
  for(const [id,shared] of Object.entries(SHARED_SHOTS))for(const story of stories){
    const actual=shots(story).find(s=>s.id===id);assert.equal(actual,shared);assert.equal(JSON.stringify(actual),JSON.stringify(shared));
  }
});

test('each area has only its own three regional slots in the approved chapter positions',()=>{
  for(const story of stories){
    const region=story.marketId.slice(3),ids=shots(story).map(s=>s.id);
    assert.deepEqual(ids.filter(id=>!/^jp-\d\d$/.test(id)),[`jp-${region}-07`,`jp-${region}-10`,`jp-${region}-13`]);
    assert.deepEqual(story.chapters.find(c=>c.id==='tensions').shots.map(s=>s.id),['jp-06',`jp-${region}-07`,'jp-08']);
    assert.deepEqual(story.chapters.find(c=>c.id==='battery').shots.map(s=>s.id),['jp-09',`jp-${region}-10`]);
    assert.equal(story.chapters.at(-1).shots[0].id,`jp-${region}-13`);
    assert.ok(ids.every(id=>/^[a-z]{2,}(-[a-z]+)?-\d\d$/.test(id)));
  }
});

test('every approved page-text word is transcribed exactly in both languages',()=>{
  const all={...SHARED_SHOTS};for(const story of stories)for(const shot of shots(story))all[shot.id]=shot;
  assert.equal(Object.keys(all).length,20);assert.equal(Object.keys(tables).length,20);
  for(const [id,table] of Object.entries(tables)){
    const shot=all[id];
    for(const [from,to] of [['Question','question'],['Copy','copy'],['Meaning','meaning'],['Caption','caption']])if(table[from])
      assert.deepEqual(shot[to].map(plainBuilt),table[from].map(plainSigned),`${id} ${from}`);
    for(const [from,parts] of [['Controls',shot.controls],['Labels',Object.values(shot.labels)]])if(table[from]){
      for(let lang=0;lang<2;lang++)assert.equal(parts.map(p=>plainBuilt(p[lang])).join(' · '),plainSigned(table[from][lang]),`${id} ${from} ${lang}`);
    }
    if(id!=='jp-00'){
      const change=table.Marker.map((s,i)=>i?s.replace(/^证据(?:充分|尚可|单薄)。会改变判断的证据：/,''):s.replace(/^(Strong|Fair|Thin) evidence\. What would change it: /,''));
      assert.deepEqual(shot.marker.change.map(plainBuilt),change.map(plainSigned),`${id} marker`);
    }
  }
});

test('the reviewed tuples and all marker levels retain G-1 decisions',()=>{
  const strong=new Set(['jp-03','jp-04','jp-05','jp-06','jp-kyushu-07']);
  for(const story of stories){
    assert.deepEqual(story.reviewedAgainst,{playRef:story.playRef,hours:9,call:'opportunistic',lens:'infraFund',route:'ltda',stage:'operating',on:'2026-11-05',commit:'13dacf0e1e3874bd888452f694fc7c90240a97aa'});
    for(const shot of shots(story))assert.equal(shot.marker.level,shot.id==='jp-00'?'play':strong.has(shot.id)?'strong':'fair');
    assert.equal(story.claims['CL-JP-18'].type,'interpretation');assert.equal(story.claims['CL-JP-28'].type,'interpretation');
    assert.equal(story.claims['CL-JP-26'],undefined);assert.equal(story.sources['SRC-JP-02'],undefined);assert.equal(story.sources['SRC-JP-16'],undefined);
  }
});

test('every page token is declared and English/Chinese parity includes captions and links',()=>{
  const visit=(value,declared)=>{
    if(Array.isArray(value)&&value.length===2&&value.every(s=>typeof s==='string')){
      assert.deepEqual(tokensIn(value[0]).sort(),tokensIn(value[1]).sort());
      for(const side of value)for(const token of tokensIn(side))assert.ok(declared.has(token),token);
    }else if(Array.isArray(value))value.forEach(v=>visit(v,declared));
    else if(value&&typeof value==='object')Object.values(value).forEach(v=>visit(v,declared));
  };
  for(const story of stories)visit(shots(story),new Set(story.tokens));
});

test('each composition links only to its own market sections',()=>{
  for(const row of rows){
    const story=composeStory(row.id),values=storyValues(row,ui);
    for(const shot of shots(story))for(const link of shot.links||[])assert.ok(fillTokens(link.href,values).startsWith('/markets/'+row.market.manifest.slug+'#'));
    assert.deepEqual(story.chapters.at(-1).shots[0].extra.exits.map(e=>e.anchor),['bankable','revenue','execution','downside']);
    assert.deepEqual(values.regionalSentence,REGIONAL_SENTENCES[row.id]);
  }
});

test('financial tokens retain the page, model and acquisition owners rather than legacy row metrics',()=>{
  for(const row of rows){
    const values=storyValues(row,ui),econ=B.plays[row.id+'/'+row.play.id].econ;
    assert.deepEqual(values.call,CALLS[row.call]);assert.deepEqual(values.playName,playTitle(row.play,row.stage));
    assert.ok(values.cardFigures[0].startsWith(returnPct(row.investment.holdIRR)));
    assert.ok(values.cardFigures[0].includes(marginText(row)[0]));
    assert.deepEqual(values.nextAction,row.play.action.text);assert.deepEqual(values.areaName,row.market.manifest.name);
    assert.equal(values.playDuration,String(row.play.hours));assert.equal(values.obligationHours,String(row.market.comparison.economics.ltda.minDurationHours));
    assert.equal(values.awardTerm,String(row.market.comparison.economics.ltda.years));
    assert.equal(values.retainedShare,(JP_LTDA_MERCHANT_RETENTION*100).toFixed(1)+'%');
    assert.equal(values.securedShare,(econ.secured*100).toFixed(1)+'%');assert.equal(values.securedYears,String(econ.securedYears));
    assert.deepEqual(values.bidCloseDate,datePair(B.triggers[row.next].expected));
    assert.equal(values.buildCostPerMW,null);
  }
});

test('chart cases decode every market/play reference without currency conversion or cross-case targets',()=>{
  const owners=expandReferences(B.acquisitions.infraFund,B.acquisitionReferenceData);
  for(const chart of chartRows()){
    const owner=owners.find(r=>r.market===chart.marketId&&r.playId===`jp-${chart.region}-ltda-6h`);
    assert.equal(chart.currency,'JPY');assert.equal(chart.buildCostPerMW,null);
    assert.equal(chart.designValueUSD,B.plays[`${chart.marketId}/${owner.playId}`].econ.value);
    for(const point of chart.cases){const own=owner.referenceCases.find(c=>c.key===point.key);assert.equal(point.pricePerMW,own.pricePerMW);assert.equal(point.targetReturn,own.targetReturn);assert.equal(point.returnBasis,own.returnBasis);}
  }
});

test('an unavailable compact-reference pool withholds all prices without crashing or inserting zeros',()=>{
  for(const area of chartRows({...B,acquisitionReferenceData:null}))for(const point of area.cases){assert.equal(point.pricePerMW,null);assert.equal(point.targetReturn,null);}
});

test('missing build cost hides its sentence, retains signed available sentences and validates',()=>{
  for(const row of rows){
    const composed=composeStory(row.id),values=storyValues(row,ui),available=storyWithAvailableValues(composed,values);
    assert.deepEqual(validateStory(available),{ok:true,complete:true,problems:[]});
    const copy=available.chapters.find(c=>c.id==='tensions').shots.find(s=>s.id==='jp-08').copy;
    assert.ok(copy[0].includes('{designValue}'));assert.ok(copy[1].includes('{designValue}'));
    assert.ok(!copy.some(s=>s.includes('{buildCostPerMW}')||s.includes('{purchaseCeiling}')));
    assert.ok(copy[0].endsWith(composed.text['Missing financial binding'][0]));
    assert.ok(copy[1].endsWith(composed.text['Missing financial binding'][1]));
    assert.ok(!copy.some(s=>s.includes('—')));
  }
});

test('row, lens, route, stage, duration and stale checks apply independently to each area',()=>{
  for(const row of rows){
    const story=composeStory(row.id);assert.ok(reviewed({row,ui}));
    for(const other of rows.filter(r=>r.id!==row.id))assert.equal(storyMatches(story,other),false);
    for(const changed of [{...row,call:'wait'},{...row,stage:'ready-to-build'},{...row,play:{...row.play,hours:6}},{...row,play:{...row.play,route:'mer'}}])assert.equal(reviewed({row:changed,ui}),null);
    assert.equal(reviewed({row,lens:'developer',ui}),null);
    assert.ok(rows.filter(r=>r.id!==row.id).every(r=>reviewed({row:r,ui})));
  }
});

test('the shared timeline retains all bilingual fields and identifies the three own-area nodes',()=>{
  assert.equal(JP_TIMELINE.length,9);
  assert.deepEqual(JP_TIMELINE.filter(n=>n.region).map(n=>n.region),['kyushu','hokkaido','tokyo']);
  assert.equal(JP_TIMELINE.find(n=>n.dateToken==='bidCloseDate').style,'planned');
  for(const node of JP_TIMELINE)for(const pair of Object.values(node.fields))assert.ok(pair[0]&&pair[1]);
});
