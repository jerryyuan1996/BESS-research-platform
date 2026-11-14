import test from 'node:test';
import assert from 'node:assert/strict';
import {marketIds} from '../src/markets/registry.js';
import {SYSTEMS,ROUTES,physicalState} from '../src/experience/story/public/marketLogicContent.js';
import {LOGIC_SOURCES} from '../src/experience/story/public/logicSources.js';
import {loadPublicContent} from '../src/experience/story/public/content.js';
import {INTEGRATED_CHAPTER} from '../src/experience/story/public/integrationModel.js';
const pair=p=>assert.ok(Array.isArray(p)&&p.length===2&&p.every(s=>typeof s==='string'&&s.length>0)&&(/[\u3400-\u9fff]/.test(p[1])||p[0]===p[1]));
test('every market has a bilingual causal chain with resolvable source evidence',async()=>{
 assert.deepEqual(Object.keys(SYSTEMS).sort(),marketIds().filter(id=>id!=='it').sort());
 for(const [id,s] of Object.entries(SYSTEMS)){
  pair(s.title);assert.equal(s.steps.length,3);pair(s.condition.try);pair(s.condition.alert);pair(s.condition.check);
  for(const step of s.steps)for(const k of ['label','title','body','takeaway'])pair(step[k]);
  const data=await loadPublicContent(id),sources={...data.sources,...LOGIC_SOURCES[id]};
  for(const key of s.sources)assert.match(sources[key]?.url||'',/^https:/,id+'/'+key);
  for(const route of Object.values(ROUTES[id])){
   for(const k of ['label','counterparty','promise','right','pay','net','check'])pair(route[k]);
   for(const key of route.sources)assert.match(sources[key]?.url||'',/^https:/,id+'/'+key);
  }
  assert.equal(physicalState(s,2,true),'constrained');assert.notEqual(physicalState(s,2,false),'constrained');
 }
 assert.equal(new Set(Object.values(SYSTEMS).map(s=>s.title[1])).size,17);
});
test('mechanisms preserve the differences that change investment logic',()=>{
 assert.equal(SYSTEMS.fi.kind,'response');assert.equal(SYSTEMS.pjm.kind,'adequacy');assert.equal(SYSTEMS.jp_hokkaido.kind,'connection');
 assert.notEqual(SYSTEMS.jp_kyushu.kind,SYSTEMS.jp_tokyo.kind);
 assert.equal(ROUTES.ercot.capacity,undefined);assert.equal(ROUTES.ca_on.capacity.label[0],'LT2 capacity contract');
 assert.equal(ROUTES.nem.cis.kind,'underwriting');assert.equal(ROUTES.jp_tokyo.ltda.kind,'clawback');
 assert.equal(ROUTES.pl.grant.kind,'grant');assert.match(ROUTES.sa.ssa.check[0],/N\/M/);
 assert.match(ROUTES.es.capacity.pay[0],/after/);assert.match(ROUTES.ie.capacity.net[0],/difference payments/);
});
test('all original story content is assigned exactly once in the integrated reader',async()=>{
 let count=0;
 for(const id of marketIds().filter(id=>!['sa','es','ca_on'].includes(id))){
  const owner=id.startsWith('jp_')?'jp':id,m=await import('../src/markets/'+owner+'/story.js');
  const story=m.story||m.composeStory(id),shots=[story.opening,...story.chapters.flatMap(c=>c.shots)];
  assert.equal(new Set(shots.map(s=>s.id)).size,shots.length);
  for(const shot of shots){assert.ok(INTEGRATED_CHAPTER[shot.chapter],id+'/'+shot.id);count++;}
 }
 assert.ok(count>190,'all original openings and six chapters are retained');
});
