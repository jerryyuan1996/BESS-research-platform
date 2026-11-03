import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {story,FIELD_BINDINGS} from '../src/markets/pjm/story.js';
import {storyValues,nextPublishedAuction,storyMatches,WATCHED_TRIGGERS} from '../src/markets/pjm/storyBindings.js';
import {PJM_STORY_EVIDENCE as E} from '../src/markets/pjm/data/storyEvidence.js';
import {validateStory,fillPair,tokensIn} from '../src/experience/story/contract.js';
import {opportunities,CALLS,returnPct} from '../src/experience/model.js';
import {HOME_BRIEFING as B} from '../src/briefing/homeData.js';
const row=opportunities('infraFund').find(r=>r.id==='pjm');
const values=storyValues(row,{CALLS,returnPct});
const shots=[story.opening,...story.chapters.flatMap(c=>c.shots)];
const md=readFileSync(new URL('../docs/immersive-experience-plan/pjm-storyboard.md',import.meta.url),'utf8');
const normal=s=>s.replace(/\d{4}年\d{1,2}月\d{1,2}日|\d{1,2} (?:September|October) \d{4}/g,'<value>')
  .replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}|\d+(?:-\d+)?/g,'<value>').trim();

test('PJM has all thirteen complete bilingual shots and the unchanged reviewed tuple',()=>{
  assert.deepEqual(validateStory(story),{ok:true,complete:true,problems:[]});
  assert.deepEqual(shots.map(s=>s.id),Array.from({length:13},(_,i)=>`pjm-${String(i).padStart(2,'0')}`));
  assert.deepEqual(story.reviewedAgainst,{playRef:'pjm-cap-4h',hours:4,call:'wait',on:'2026-10-31'});
  assert.equal(storyMatches(story,row),true);
  for(const changed of [{...row,call:'avoid'},{...row,play:{...row.play,hours:6}},{...row,play:{...row.play,id:'other'}}])assert.equal(storyMatches(story,changed),false);
  assert.equal(storyMatches(story,row,'strategic'),false);
});

test('PJM questions, copy, meanings and markers preserve the table text with only approved reconciliation',()=>{
  for(const shot of shots){
    const start=md.indexOf(`### ${shot.id} — `),rest=md.slice(start+10),next=rest.search(/^## |^### pjm-/m);
    const block=md.slice(start,next<0?undefined:start+10+next);
    const fields=Object.fromEntries(block.split('\n').filter(l=>l.startsWith('| ')).map(l=>l.trim().slice(2,-2).split(' | ')).filter(c=>c.length===3).map(([key,en,zh])=>[key,[en,zh]]));
    for(const [field,title] of [['question','Question'],['copy','Copy'],['meaning','Meaning']]){
      if(shot[field]===null)continue;
      if(shot.id==='pjm-12'&&field==='meaning'){assert.deepEqual(shot[field],['{nextAction}','{nextAction}']);continue;}
      const expected=fields[title].map(s=>shot.id==='pjm-12'?s.replace('Two events','<value> events').replace('两件事','<value>件事'):s);
      assert.deepEqual(shot[field].map(normal),expected.map(normal),`${shot.id}.${field}`);
    }
    if(shot.marker.level!=='play'){
      const expected=[fields.Marker[0].split('What would change it: ')[1],fields.Marker[1].split('会改变判断的证据：')[1]];
      assert.deepEqual(shot.marker.change.map(normal),expected.map(normal),`${shot.id}.marker`);
    }
    if(fields.Caption)assert.deepEqual(shot.caption.map(normal),fields.Caption.map(normal));
    const expected=fields.Controls[0].split(' · ').map((en,i)=>[en,fields.Controls[1].split(' · ')[i]]);
    assert.deepEqual(shot.controls.map(p=>p.map(normal)),expected.map(p=>p.map(normal)));
  }
});

test('PJM figures resolve live case fields and located evidence without typed numeric copy',()=>{
  assert.equal(values.holdReturn,returnPct(row.investment.holdIRR));
  assert.equal(values.targetReturn,returnPct(row.econ.test.target));
  assert.equal(values.securedShare,Math.round(row.investment.secured*100)+'%');
  assert.equal(values.watchedTriggerCount,String(WATCHED_TRIGGERS.length));
  assert.equal(values.nextAuctionRating,'57%');
  assert.equal(values.sourceVintage[0],'4 September 2026');
  assert.equal(FIELD_BINDINGS.sourceVintage.path,'E.years.2030-31.indicativeRatingSourceVintageOn');
  for(const token of story.tokens)assert.ok(values[token]!==null&&values[token]!==undefined,token);
  for(const shot of shots){
    const pairs=[shot.question,shot.copy,shot.meaning,shot.caption,shot.marker.change,...shot.controls,...Object.values(shot.labels||{})].filter(Boolean);
    for(const pair of pairs)for(const s of pair){assert.equal(/\d/.test(s.replace(/\{[A-Za-z][A-Za-z0-9]*\}/g,'')),false,shot.id);for(const t of tokensIn(s))assert.ok(FIELD_BINDINGS[t]);}
    for(const pair of pairs)for(const s of fillPair(pair,values))assert.equal(/undefined|NaN|\{[A-Za-z]/.test(s),false,shot.id);
  }
});

test('PJM next published auction never promotes an indicative rating or carries an old BRA forward',()=>{
  assert.equal(nextPublishedAuction(row.play.hours).deliveryYear,'2029-30');
  const changed=structuredClone(E);changed.years['2029-30'].auctionStatus='cleared';
  assert.equal(nextPublishedAuction(row.play.hours,changed),null);
  assert.equal(nextPublishedAuction(5),null);
  const before=JSON.stringify(row);storyValues(row,{CALLS,returnPct});assert.equal(JSON.stringify(row),before);
});

test('CF-PJM-03 bindings equal the approved credit refresh on every duration and return basis',()=>{
  assert.equal(row.play.hours,4);
  assert.equal(B.grids.pjm.byRoute.cap.best,4);
  assert.deepEqual(B.grids.pjm.hours,[4,6,8,10]);
  assert.equal(row.econ.hold,.02702690163060739);
  assert.equal(row.econ.test.target,.12076053043246304);
  assert.equal(row.econ.hold-row.econ.test.target,-.09373362880185565);
  assert.equal(row.econ.secured,.4671907145269752);
  assert.equal(row.econ.securedYears,1);
  assert.equal(row.econ.levered,.015485315563341318);
  assert.equal(row.econ.lowerOf,-.02328878982780841);
  assert.deepEqual(row.econ.test,{basis:'neither',meets:false,target:.12076053043246304,leveredTarget:.14076053043246303});
  assert.equal(row.investment.leverage.gearing,.2696852284749002);
  const design=B.plays['pjm/pjm-cap-4h'].econ;
  assert.equal(design.hold,-.0031);assert.equal(design.exit,-.0682);
  assert.equal(design.moic,.77);assert.equal(design.payback,null);
  assert.equal(row.market.comparison.economics.securedContracted,69989);
  const expected=[[4,-576796,-.0031],[6,-824133,-.0115],[8,-1129224,-.024],[10,-1412243,-.0302]];
  // Existing model scenario from the authority section 7, never a chart series.
  const scenario=[337.83,500,520,470,430,400,380,380,380,380,380,380,380,380];
  for(const [hours,value,hold] of expected){
    const cell=B.grids.pjm.cells.find(c=>c.route==='cap'&&c.hours===hours);
    assert.equal(cell.value,value);assert.equal(cell.hold,hold);
    const renewal=scenario.map((price,index)=>{
      const start=2029+index,year=E.years[`${start}-${String(start+1).slice(-2)}`];
      const credit=year.auctionRatingByHours[hours]??year.indicativeRatingByHours[hours];
      return Math.round(price*365*credit);
    });
    assert.deepEqual(row.market.comparison.durationResponse.auctionRenewalCurves[hours],renewal);
  }
});
