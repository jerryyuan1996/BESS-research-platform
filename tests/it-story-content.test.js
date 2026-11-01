import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {story} from '../src/markets/it/story.js';
import {storyValues,storyWithAvailableValues,reviewedRowsMatch,IT_ZONES,IT_HISTORY,historyValues} from '../src/markets/it/storyBindings.js';
import {validateStory,CHAPTERS,isStale,fillPair} from '../src/experience/story/contract.js';
import {opportunities,CALLS,returnPct} from '../src/experience/model.js';
import {HOME_BRIEFING} from '../src/briefing/homeData.js';
import {IT_AUCTION_RESULTS} from '../src/markets/it/data/auctionResults.js';
const row=opportunities('infraFund').find(r=>r.id==='it'),values=storyValues(row,{CALLS,returnPct});
const md=readFileSync(new URL('../docs/immersive-experience-plan/italy-storyboard.md',import.meta.url),'utf8').replaceAll('\r','');
const shots=[story.opening,...story.chapters.flatMap(c=>c.shots)];
const normal=s=>s.replaceAll('**','').replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}/g,'<value>').trim();

test('twelve approved Italy shots are complete under the unchanged contract',()=>{
 assert.deepEqual(validateStory(story),{ok:true,complete:true,problems:[]});
 assert.deepEqual(story.chapters.map(c=>c.id),CHAPTERS);
 assert.deepEqual(shots.map(s=>s.id),Array.from({length:12},(_,i)=>'it-'+String(i).padStart(2,'0')));
 assert.equal(isStale(story,row),false);
 assert.equal(story.reviewedAgainst.lens,'infraFund');
});
test('both languages, markers, labels, controls and captions match the storyboard cells',()=>{
 for(const shot of shots){
  const start=md.indexOf('### '+shot.id+' — '),end=md.indexOf('\n### ',start+1);
  const block=md.slice(start,end<0?md.indexOf('### Shared page vocabulary',start):end);
  const page=Object.fromEntries(block.slice(block.indexOf('| Page text |')).split('\n').filter(l=>l.startsWith('| ')&&!l.startsWith('| ---')).map(l=>l.slice(2,-2).split(' | ')).filter(c=>c.length===3).map(([k,en,zh])=>[k,[en,zh]]));
  for(const [key,label] of [['question','Question'],['copy','Copy'],['meaning','Meaning']])if(shot[key])assert.deepEqual(shot[key].map(normal),page[label].map(normal),shot.id+' '+key);
  const split=p=>p[0].split(' · ').map((en,i)=>[en,p[1].split(' · ')[i]]).map(p=>p.map(normal));
  assert.deepEqual(shot.controls.map(p=>p.map(normal)),split(page.Controls));
  if(page.Labels)assert.deepEqual(Object.values(shot.labels).map(p=>p.map(normal)),split(page.Labels));
  if(page.Caption)assert.deepEqual(shot.caption.map(normal),page.Caption.map(normal));
  if(page['Factor cards'])assert.deepEqual(shot.extra.factorCards.map(p=>p.map(normal)),split(page['Factor cards']));
  if(shot.marker.level!=='play'){
   assert.deepEqual(shot.marker.change.map(normal),[page.Marker[0].split('What would change it: ')[1],page.Marker[1].split('会改变判断的证据：')[1]].map(normal));
   assert.equal(shot.marker.level,page.Marker[0].split(' ')[0].toLowerCase());
  }
 }
});
test('the two return bases bind their own live owners and never rank across them',()=>{
 assert.ok(values.cardFigures[0].includes(returnPct(row.investment.holdIRR)));
 assert.ok(values.cardFigures[0].includes(returnPct(row.investment.leveredIRR)));
 assert.equal(values.capacityDesignHold,returnPct(HOME_BRIEFING.plays['it/it-cap-4h'].econ.hold));
 assert.equal(values.mACSEDesignHold,returnPct(HOME_BRIEFING.plays['it/it-ltda-6h'].econ.hold));
 assert.equal(values.securedShare,Math.round(row.investment.secured*100)+'%');
 assert.equal(values.mACSECall,CALLS.opportunistic);
 const changed=storyValues({...row,investment:{...row.investment,holdIRR:1.234,secured:.123}},{CALLS,returnPct});
 assert.ok(changed.cardFigures[0].includes(returnPct(1.234)));
 assert.equal(changed.capacityDesignHold,values.capacityDesignHold);
 assert.deepEqual(values.nextAction,row.play.action.text);
 assert.deepEqual(values.mACSENextAction,HOME_BRIEFING.plays['it/it-ltda-6h'].action.text);
});
test('unresolved source values use the approved missing state without invented figures',()=>{
 assert.equal(values.mACSETerm,null);
 assert.equal(values.cMDY2028AuctionDate,null);
 assert.equal(values.mACSEAwardedHours,(IT_AUCTION_RESULTS.macseTotals.mwh/IT_AUCTION_RESULTS.macseTotals.mw).toFixed(1));
 const available=storyWithAvailableValues(story,values);
 assert.deepEqual(available.chapters[1].shots[1].copy,story.text['Missing value']);
 assert.equal(IT_ZONES.length,7);
 assert.ok(values.dY2027Derating[0].includes('repository record'));
 assert.deepEqual(historyValues(IT_HISTORY[0]),{historyNode:['November 2019','2019年11月']});
 for(const s of [available.opening,...available.chapters.flatMap(c=>c.shots)])for(const p of [s.question,s.copy,s.meaning,...Object.values(s.labels)].filter(Boolean))for(const text of fillPair(p,values))assert.ok(!/undefined|NaN|\{[A-Za-z]/.test(text));
});
test('either fork or the selected lens changing requires editorial review',()=>{
 const rows=HOME_BRIEFING.lenses.infraFund.rows.filter(r=>r.market==='it').map(r=>({...r,play:HOME_BRIEFING.plays['it/'+r.play]}));
 assert.equal(reviewedRowsMatch(story,row,rows,'infraFund'),true);
 assert.equal(reviewedRowsMatch(story,row,rows,'developer'),false);
 for(const index of [0,1]){
  assert.equal(reviewedRowsMatch(story,row,rows.map((r,i)=>i===index?{...r,call:'wait'}:r),'infraFund'),false);
  assert.equal(reviewedRowsMatch(story,row,rows.map((r,i)=>i===index?{...r,play:{...r.play,hours:r.play.hours+1}}:r),'infraFund'),false);
 }
 assert.equal(reviewedRowsMatch(story,row,rows.slice(0,1),'infraFund'),false);
 assert.equal(/^\s*import\s/m.test(readFileSync(new URL('../src/markets/it/story.js',import.meta.url),'utf8')),false);
});
