import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {story} from '../src/markets/caiso/story.js';
import {storyValues} from '../src/markets/caiso/storyBindings.js';
import {validateStory,isStale,fillPair} from '../src/experience/story/contract.js';
import {opportunities,CALLS} from '../src/experience/model.js';
const row=opportunities('infraFund').find(r=>r.id==='caiso');
const shots=[story.opening,...story.chapters.flatMap(c=>c.shots)];
const values=storyValues(row,{CALLS},{durationHours:[2,row.play.hours,8]});
const md=readFileSync(new URL('../docs/immersive-experience-plan/caiso-storyboard.md',import.meta.url),'utf8');
const restore=(s,lang)=>s.replace(/\{qcBasisHours\}/g,lang?'四':'four').replace(/\{shortHours\}/g,'2').replace(/\{longHours\}/g,'8').replace(/\{crisisPeriod\}/g,'2000–01').replace(/\{outageDates\}/g,lang?'8月14日和15日':'14 and 15 August').replace(/‹bound: [^›]+›|\{[A-Za-z][A-Za-z0-9]*\}/g,'<value>').trim().toLowerCase();

test('CAISO contains all fourteen bilingual shots and matches the reviewed live identity',()=>{
  assert.deepEqual(validateStory(story),{ok:true,complete:true,problems:[]});
  assert.deepEqual(shots.map(s=>s.id),Array.from({length:14},(_,i)=>'caiso-'+String(i).padStart(2,'0')));
  assert.equal(isStale(story,row),false);
  assert.equal(story.reviewedAgainst.lens,'infraFund');
});

test('CAISO bilingual shot tables retain script parity and exactly one fixed marker each',()=>{
  for(const shot of shots){
    const start=md.indexOf('### '+shot.id+' — '),next=md.indexOf('\n### caiso-',start+1);
    const block=md.slice(start,next<0?md.indexOf('\n## 9.',start):next);
    const fields=Object.fromEntries(block.split('\n').map(l=>l.split('|').map(t=>t.trim())).filter(p=>['Question','Copy','Meaning','Marker','Controls'].includes(p[1])).map(p=>[p[1],[p[2],p[3]]]));
    for(const [key,label] of [['question','Question'],['copy','Copy'],['meaning','Meaning']]){
      if(shot[key]===null)continue;
      if(shot.id==='caiso-03'&&key==='copy'){
        assert.match(shot.copy[0],/Under the CPUC’s \{qcDecisionYear\} decision, effective for the \{qcEffectiveYear\} RA year/);
        assert.match(shot.copy[1],/于\{qcDecisionYear\}年作出、从\{qcEffectiveYear\}年RA年度起生效/);
        continue;
      }
      const expected=fields[label].map((s,lang)=>shot.id==='caiso-05'&&key==='copy'?s.replace(' Since 2020 the midday trough has deepened while the evening peak has held.','').replace('与2020年相比，午间低谷大幅加深，而傍晚峰值基本不变。',''):s);
      assert.deepEqual(shot[key].map(restore),expected.map(restore),shot.id+' '+key);
    }
    const expectedControls=fields.Controls[0].split(' · ').map((s,i)=>[s,fields.Controls[1].split(' · ')[i]]);
    assert.deepEqual(shot.controls.map(p=>p.map(restore)),expectedControls.map(p=>p.map(restore)),shot.id+' controls');
    assert.ok(shot.marker&&!Array.isArray(shot.marker));
    if(shot.id==='caiso-00')assert.equal(shot.marker.level,'play');
    else {
      assert.equal(shot.marker.level,fields.Marker[0].startsWith('Strong')?'strong':'fair');
      assert.deepEqual(shot.marker.change.map(restore),[fields.Marker[0].split('What would change it: ')[1],fields.Marker[1].split('会改变判断的证据：')[1]].map(restore));
    }
  }
});

test('every CAISO figure resolves from its approved live result or evidence owner',()=>{
  for(const token of story.tokens){assert.ok(Object.hasOwn(values,token),token);assert.notEqual(values[token],null,token);}
  /* A missing field renders as a lone em dash; the Chinese dash "——" is two
     U+2014 in a row and legitimate punctuation, so only a single one fails. */
  for(const shot of shots)for(const key of ['question','copy','meaning'])if(shot[key])for(const text of fillPair(shot[key],values))assert.ok(!/(?<!—)—(?!—)/.test(text),shot.id+' '+key);
  assert.equal(values.holdReturn,(row.econ.hold*100).toFixed(1)+'%');
  assert.equal(values.securedShare,Math.round(row.econ.secured*100)+'%');
  assert.equal(values.securedTenor,String(row.econ.securedYears));
  assert.equal(values.playDuration,String(row.play.hours));
  assert.equal(values.qcEffectiveYear,'2015');
  const changed=storyValues({...row,econ:{...row.econ,secured:.41,securedYears:3}},{CALLS},{durationHours:[2,row.play.hours,8]});
  assert.equal(changed.securedShare,'41%');assert.equal(changed.securedTenor,'3');
});
