/* Match the signed-off page words and keep every figure on its approved owner. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {story} from '../src/markets/fi/story.js';
import {storyValues,storyWithAvailableValues,productValues,priceValues,sourceValues,historyValues,longerTeachingDuration} from '../src/markets/fi/storyBindings.js';
import {FI_HISTORY,FI_RESERVE_PRODUCTS} from '../src/markets/fi/data/storyEvidence.js';
import {validateStory,isStale,fillPair,CHAPTERS} from '../src/experience/story/contract.js';
import {opportunities,CALLS,returnPct} from '../src/experience/model.js';
const row=opportunities('infraFund').find(r=>r.id==='fi');
const ui={CALLS,returnPct},values=storyValues(row,ui);
const shots=[story.opening,...story.chapters.flatMap(c=>c.shots)];
const md=readFileSync(new URL('../docs/immersive-experience-plan/finland-storyboard.md',import.meta.url),'utf8');
const normal=s=>s.replaceAll('**','').replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}|OL3/g,'<value>').trim();

test('the complete Finland script follows the live signed-off play and all source references resolve',()=>{
  assert.deepEqual(validateStory(story),{ok:true,complete:true,problems:[]});
  assert.deepEqual(story.chapters.map(c=>c.id),CHAPTERS);
  assert.deepEqual(shots.map(s=>s.id),Array.from({length:13},(_,i)=>'fi-'+String(i).padStart(2,'0')));
  assert.equal(story.playRef,row.play.id);
  assert.equal(isStale(story,row),false);
  assert.equal(story.reviewedAgainst.on,'2026-10-31');
});
test('every bilingual page sentence and control matches its signed-off Markdown cell',()=>{
  for(const shot of shots){
    const start=md.indexOf('### '+shot.id+' — '),next=md.indexOf('\n### fi-',start+1);
    const block=md.slice(start,next<0?md.indexOf('## 9.'):next);
    const page=block.slice(block.indexOf('| Page text |'));
    const fields=Object.fromEntries(page.split('\n').filter(l=>l.startsWith('| ')&&!l.startsWith('| ---')).map(l=>l.slice(2,-2).split(' | ')).filter(c=>c.length===3).map(([key,en,zh])=>[key,[en,zh]]));
    for(const [field,name] of [['question','Question'],['copy','Copy'],['meaning','Meaning']]){
      if(shot.meaning===null&&field==='meaning')continue;
      assert.deepEqual(shot[field].map(normal),fields[name].map(normal),shot.id+' '+field);
    }
    assert.deepEqual(shot.controls.map(p=>p.map(normal)),fields.Controls[0].split(' · ').map((en,i)=>[en,fields.Controls[1].split(' · ')[i]]).map(p=>p.map(normal)),shot.id+' controls');
    if(shot.marker.level!=='play'){
      assert.equal(shot.marker.level,'fair');
      const change=[fields.Marker[0].slice('Fair evidence. What would change it: '.length),fields.Marker[1].slice('证据尚可。会改变判断的证据：'.length)];
      assert.deepEqual(shot.marker.change.map(normal),change.map(normal));
    }
    if(fields.Labels)assert.deepEqual(Object.values(shot.labels).map(p=>p.map(normal)),fields.Labels[0].split(' · ').map((en,i)=>[en,fields.Labels[1].split(' · ')[i]]).map(p=>p.map(normal)));
    if(fields.Caption)assert.deepEqual(shot.caption.map(normal),fields.Caption.map(normal));
  }
  assert.equal(story.opening.meaning,null);
  assert.equal(story.opening.marker.level,'play');
});
test('financial bindings use the market card rather than the older operating-model denominator',()=>{
  assert.equal(values.playDuration,String(row.play.hours));
  assert.equal(values.securedShare,Math.round(row.investment.secured*100)+'%');
  assert.equal(values.securedTenor,String(row.investment.securedYears));
  assert.equal(values.cardFigures[0].includes(returnPct(row.investment.holdIRR)),true);
  const other={...row,play:{...row.play,econ:{...row.play.econ,secured:.99}}};
  assert.equal(storyValues(other,ui).securedShare,values.securedShare);
  assert.equal(storyValues({...row,investment:null},ui).securedShare,null);
  assert.ok(longerTeachingDuration(row)>row.play.hours);
  assert.equal(storyWithAvailableValues(story,values),story);
  const missing=storyWithAvailableValues(story,{...values,playDuration:null});
  assert.deepEqual(missing.chapters[3].shots[1].copy,story.text['Missing financial binding']);
});
test('dated evidence keeps the selected node, product, source check and price vintage distinct',()=>{
  assert.notDeepEqual(historyValues(FI_HISTORY[1]),historyValues(FI_HISTORY[3]));
  for(const p of FI_RESERVE_PRODUCTS)for(const v of Object.values(productValues(p)))assert.ok(v[0]&&v[1]);
  const price=priceValues({units:{price:'EUR/MW/h'},coverage:{from:'2026-10-30T00:00:00Z',to:'2026-10-30T01:00:00Z'},fetchedAt:'2026-10-29T18:00:00Z'},{label:['FCR-N','FCR-N']});
  assert.ok(price.priceCoverage.every(s=>s.includes('Europe/Helsinki')));
  assert.notDeepEqual(price.priceFetchedAt,sourceValues({checkedOn:'2026-10-31'}).sourceCheckedDate);
  assert.deepEqual(priceValues({units:{price:'EUR/MWh'}},{}),{priceCoverage:null,priceFetchedAt:null});
  for(const p of shots.flatMap(s=>[s.question,s.copy,s.meaning].filter(Boolean)))for(const s of fillPair(p,values))assert.ok(!/undefined|NaN|\{[a-zA-Z]/.test(s));
});
test('content imports no rendering code and no financial figure is typed into the script',()=>{
  const src=readFileSync(new URL('../src/markets/fi/story.js',import.meta.url),'utf8');
  assert.equal(/^\s*import\s/m.test(src),false);
  assert.ok(md.includes('G-1 met'));
});
