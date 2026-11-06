import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JP_STORY_VALUES as V} from '../src/markets/jp/data/storyEvidenceValues.js';
import {JP_STORY_PROVENANCE as P} from '../src/markets/jp/data/storyEvidenceProvenance.js';
import {JP_STORY_SOURCES as S} from '../src/markets/jp/data/storyEvidenceSources.js';
import {JP_REGIONS} from '../src/markets/jp/regions.js';

const at=(object,path)=>path.split('.').reduce((o,key)=>o?.[key],object);
const regions=['tokyo','kyushu','hokkaido'];

test('Japan fixed-vintage records have per-value primary locators, dates, units and reuse bases',()=>{
  assert.ok(Object.keys(P).length>=70);
  for(const [path,p] of Object.entries(P)){
    assert.notEqual(at(V,path),undefined,path);
    for(const key of ['sourceRef','url','locator','unit','dateSemantics','checkedOn','statementType','publicReuseBasis','arithmetic'])assert.ok(typeof p[key]==='string'&&p[key].trim(),`${path}: ${key}`);
    assert.ok(S[p.sourceRef],`${path}: source exists`);
    assert.match(p.url,/^(https:\/\/|\/markets\/)/);
    assert.equal(p.checkedOn,'2026-11-05');
    assert.ok(['observed','official-plan','rule','interpretation'].includes(p.statementType));
  }
  const visit=(value,path)=>{
    if(P[path])return;
    assert.ok(value&&typeof value==='object',`unregistered leaf ${path}`);
    for(const [key,child] of Object.entries(value))visit(child,path?path+'.'+key:key);
  };
  for(const key of ['national','regional','history'])visit(V[key],key);
});

test('no fixed-vintage number is zero or NaN in place of missing',()=>{
  const visit=value=>{
    if(typeof value==='number')assert.ok(Number.isFinite(value)&&value>0);
    else if(Array.isArray(value))value.forEach(visit);
    else if(value&&typeof value==='object')Object.values(value).forEach(visit);
  };
  visit(V.national);visit(V.regional);visit(V.history);
  assert.deepEqual(V.national.clawbackShare,['nine-tenths','九成']);
  assert.equal(V.gaps.buildCost,true);
  assert.equal(V.gaps.chargingWindows,true);
});

test('official duration and term records independently equal every area model; no side adjusts',async()=>{
  for(const region of regions){
    const {default:m}=await import(`../src/markets/jp-${region}/index.js`);
    assert.equal(m.comparison.economics.ltda.minDurationHours,V.national.obligationHours,region);
    assert.equal(m.comparison.economics.ltda.years,V.national.awardTerm,region);
    const view=JSON.parse(await readFile(new URL(`../view/markets/jp_${region}.json`,import.meta.url),'utf8'));
    const trigger=view.triggers.find(t=>t.id===`jp-${region}-ltda-round-4-bids`);
    assert.equal(trigger.expected,V.national.bidCloseDate);
  }
});

test('each area retains exactly its anchored monthly days and its own observation window',()=>{
  for(const region of regions){
    const record=V.regional[region].outputControl;
    assert.equal(record.months.length,3);
    assert.deepEqual(record.months.map(m=>m.days),JP_REGIONS[region].curtailment.verified.map(m=>m.days));
    assert.deepEqual(record.window,[record.months[0].month,record.months.at(-1).month]);
    for(let i=0;i<record.months.length;i++)assert.match(P[`regional.${region}.outputControl.months.${i}.days`].locator,/Section 1/);
  }
  assert.notDeepEqual(V.regional.kyushu.outputControl.window,V.regional.tokyo.outputControl.window);
  assert.notDeepEqual(V.regional.kyushu.outputControl.window,V.regional.hokkaido.outputControl.window);
  assert.equal(Object.keys(V).some(key=>/rank|score/i.test(key)),false);
});

test('history precision, fiscal plans and source boundaries survive the fixed-vintage split',()=>{
  for(const id of ['H-JP-01','H-JP-02','H-JP-03','H-JP-04','H-JP-05','H-JP-06','H-JP-TK-01','H-JP-KY-01','H-JP-KY-02','H-JP-HK-01','H-JP-HK-02'])assert.ok(V.history[id],id);
  assert.equal(P['national.converterYear'].statementType,'official-plan');
  assert.match(P['national.linkYear'].dateSemantics,/March 2028/);
  assert.equal(P['history.H-JP-HK-01.blackoutDate'].sourceRef,'SRC-JP-07');
  assert.equal(P['history.H-JP-HK-01.newLinkDate'].sourceRef,'SRC-JP-15');
  assert.equal(S['SRC-JP-02'],undefined);
  assert.equal(S['SRC-JP-16'],undefined);
  assert.equal(Object.keys(P).some(path=>/supplier|bidder|holder|company|site|project/i.test(path)),false);
});

test('story data never imports the source catalogue, raw zone notes, ETL or a model result',async()=>{
  for(const name of ['storyEvidenceValues.js','storyEvidenceProvenance.js','storyEvidenceSources.js']){
    const text=await readFile(new URL('../src/markets/jp/data/'+name,import.meta.url),'utf8');
    assert.doesNotMatch(text,/\bimport\s|SRC-JP-02|SRC-JP-16|NaN|datasets\.js|local-data|jp-zones\.json/);
  }
});
