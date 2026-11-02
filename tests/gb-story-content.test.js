import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {story} from '../src/markets/gb/story.js';
import {storyBindings,storyWithAvailableValues} from '../src/markets/gb/storyBindings.js';
import {validateStory,isStale,fillPair,tokensIn} from '../src/experience/story/contract.js';
import {opportunities,CALLS,share} from '../src/experience/model.js';
import {operatingPrice} from '../src/experience/projectFacts.js';
import {playTitle} from '../src/governance/playTitle.js';
const row=opportunities('infraFund').find(r=>r.id==='gb');
const shots=[story.opening,...story.chapters.flatMap(c=>c.shots)];
const bound=storyBindings(row,{CALLS});
const doc=readFileSync(new URL('../docs/immersive-experience-plan/great-britain-storyboard.md',import.meta.url),'utf8');
const headings=[...doc.matchAll(/^### (gb-\d{2}) — (.+)$/gm)];
const tables=Object.fromEntries(headings.map((m,i)=>{
  const section=doc.slice(m.index,headings[i+1]?.index??doc.indexOf('## 9.'));
  const table=section.match(/^\| Page text \|[\s\S]*?(?=\n\r?\n)/m)[0];
  return [m[1],Object.fromEntries(table.split(/\r?\n/).slice(2).map(l=>{const c=l.split('|').slice(1,-1).map(s=>s.trim());return [c[0],c.slice(1)];}))];
}));
const clean=s=>s.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/\*\*/g,'');
const normal=s=>clean(s).replace(/‹bound: [^›]+›/g,'<bound>').replace(/Gate 2|T-4|3B|\{[a-zA-Z][a-zA-Z0-9]*\}/g,'<bound>');
const labels=(id,p)=>p.map(s=>s.split(' · ').filter(x=>id==='gb-11'?!x.includes('reference secured share'):id==='gb-05'?!x.includes('H-GB-03 date'):true).join(' · '));

test('GB has all thirteen complete shots and the reviewed live fund/operating anchor',()=>{
  assert.deepEqual(validateStory(story),{ok:true,complete:true,problems:[]});
  assert.deepEqual(shots.map(s=>s.id),Array.from({length:13},(_,i)=>'gb-'+String(i).padStart(2,'0')));
  assert.equal(isStale(story,row),false);assert.equal(story.reviewedAgainst.lens,'infraFund');
  assert.equal(row.stage,story.reviewedAgainst.stage);assert.equal(row.play.route,story.reviewedAgainst.route);
  assert.equal(story.opening.marker.level,'play');assert.equal(shots.find(s=>s.id==='gb-06').marker.level,'thin');
  assert.ok(shots.slice(1).filter(s=>s.id!=='gb-06').every(s=>s.marker.level==='fair'));
});

test('questions, copy, meanings, captions, controls and markers preserve both signed-off tables',()=>{
  for(const shot of shots){
    const d=tables[shot.id];
    assert.deepEqual(shot.question.map(normal),d.Question.map(normal),shot.id+' question');
    if(shot===story.opening){
      assert.equal(shot.copy[0],d.Copy[0].match(/Beneath it: "(.*)"\.?$/)[1]);
      assert.equal(shot.copy[1],d.Copy[1].match(/卡片下方一行：“(.*)”/)[1]);
      assert.equal(shot.meaning,null);
    }else{
      for(const field of ['copy','meaning'])assert.deepEqual(shot[field].map(normal),d[field[0].toUpperCase()+field.slice(1)].map(normal),shot.id+' '+field);
      assert.deepEqual(shot.marker.change.map(normal),d.Marker.map((s,i)=>normal(s.replace(i?/^证据(?:尚可|充分|单薄)。会改变判断的证据：/:/^(?:Fair|Strong|Thin) evidence\. What would change it: /,''))),shot.id+' change');
    }
    assert.deepEqual(shot.extra.controlText.map(normal),d.Controls.map(normal),shot.id+' controls');
    if(d.Labels)assert.deepEqual(shot.labels.all.map(normal),labels(shot.id,d.Labels).map(normal),shot.id+' labels');
    if(d.Caption)assert.deepEqual(shot.caption.map(normal),d.Caption.map(normal),shot.id+' caption');
  }
});

test('financial bindings read the card fields, including the operating purchase test, without repricing',()=>{
  assert.deepEqual(bound.values.call,CALLS[row.call]);assert.deepEqual(bound.values.playName,playTitle(row.play,row.stage));
  assert.equal(bound.values.playDuration,String(row.play.hours));assert.equal(bound.values.securedShare,share(row.investment.secured));
  assert.equal(bound.values.securedTenor,String(row.investment.securedYears));
  assert.deepEqual(bound.values.operatingPrice,operatingPrice(row.investment));assert.deepEqual(bound.values.nextAction,row.play.action.text);
  assert.equal(bound.values.tollQuotedHours,String(row.market.comparison.durationResponse.routeRules.toll.quotedHours));
  assert.deepEqual(bound.duration.cells.map(c=>c.factor),row.market.comparison.durationResponse.capacityDerating);
  for(const token of story.tokens.filter(t=>!['efrDate','serviceSeries'].includes(t)))assert.notEqual(bound.values[token],null,token);
  assert.equal('referenceSecuredShare' in bound.values,false);
  const source=readFileSync(new URL('../src/markets/gb/storyBindings.js',import.meta.url),'utf8');
  assert.doesNotMatch(source,/runCase|runBaseCase|caseFor|comparison\/engine/);
});

test('copy has no typed figures and every used token resolves in both languages',()=>{
  for(const s of shots)for(const p of [s.question,s.copy,s.meaning,s.marker.change,...Object.values(s.labels)].filter(Boolean)){
    for(const text of p){assert.doesNotMatch(text.replace(/\{[a-zA-Z][a-zA-Z0-9]*\}/g,''),/\d/,s.id);for(const t of tokensIn(text))assert.notEqual(bound.values[t],null,s.id+' '+t);}
    for(const text of fillPair(p,bound.values))assert.doesNotMatch(text,/undefined|NaN|\{[a-zA-Z]/);
  }
});

test('missing case values remove the complete affected sentence and never invent a zero',()=>{
  const values=storyBindings({...row,investment:null}).values;
  assert.equal(values.operatingPrice,null);assert.equal(values.securedShare,null);
  const available=storyWithAvailableValues(story,values);
  const closing=available.chapters.at(-1).shots[0];
  assert.doesNotMatch(closing.copy[0],/The card states the entry test/);
  assert.doesNotMatch(closing.copy[1],/方案卡列明进入条件/);
  assert.equal(validateStory(available).ok,true);
  assert.equal(JSON.stringify(story).includes('The card states the entry test'),true,'original content was preserved');
});

test('bindings and teaching data cannot mutate the investment row',()=>{
  const before=JSON.stringify(row);const local=storyBindings(row);
  local.values.nextAction[0]='Example';local.duration.cells[0].factor=0;local.model.hours=0;
  assert.equal(JSON.stringify(row),before);
});

test('EFR figures and the reference financial comparison stay absent, and content imports no renderer',()=>{
  assert.equal(bound.values.efrDate,null);assert.equal(bound.values.serviceSeries,null);
  assert.doesNotMatch(JSON.stringify(story),/reference secured share|referenceSecuredShare/);
  for(const id of ['SRC-GB-05','SRC-GB-06'])assert.match(story.sources[id].locator,/withheld/);
  const plain=readFileSync(new URL('../src/markets/gb/story.js',import.meta.url),'utf8');
  assert.doesNotMatch(plain,/^\s*import\s/m);
});
