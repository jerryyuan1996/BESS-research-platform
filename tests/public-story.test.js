import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {PUBLIC_CATALOG,PUBLIC_MARKET_IDS,PUBLIC_STATUS,PUBLIC_VERSION} from '../src/experience/story/public/catalog.js';
import {PUBLIC_STORY_IDS,publicStoryFor,STORIES} from '../src/experience/story/registry.js';
import {loadPublicContent,CHAPTERS,publicPlace,readPublicPlace,publicEvidenceState} from '../src/experience/story/public/content.js';
import {parseRoute,STORY_PARAMS} from '../src/app/router.js';
import {placeSearch} from '../src/experience/story/place.js';
import {composeStory,SHARED_SHOTS,JP_CLAIMS} from '../src/markets/jp/story.js';

test('the authorised fifteen share public scope; three unapproved additions stay outside it',()=>{
  assert.deepEqual(PUBLIC_MARKET_IDS,PUBLIC_STORY_IDS);
  for(const id of ['ca_on','sa','es']){assert.equal(publicStoryFor(id),null);assert.equal(PUBLIC_CATALOG[id],undefined);}
  assert.equal(STORIES.ercot,undefined,'G-1 does not release an original G-2 story');
  assert.equal(Object.values(STORIES).filter(x=>x.released).length,14,'original release decisions preserved');
});

test('every public summary is bilingual, explicitly pending, and free of financial bindings',()=>{
  for(const [id,c] of Object.entries(PUBLIC_CATALOG)){
    assert.equal(c.status,PUBLIC_STATUS,id);assert.equal(c.status,'pending-public-review');assert.equal(c.version,PUBLIC_VERSION);
    assert.match(c.reviewedOn,/^2026-\d{2}-\d{2}$/);
    for(const key of ['history','logic','condition']){assert.equal(c[key].length,2,id+'/'+key);assert.ok(c[key].every(x=>typeof x==='string'&&x.length>20));assert.doesNotMatch(c[key].join(' '),/[{}]|\bIRR\b|\btarget return\b/);}
    assert.match(c.history[1],/[\u3400-\u9fff]/);
  }
});

test('public content has source and approval provenance without executing the investor model',async()=>{
  for(const id of PUBLIC_MARKET_IDS){
    const c=await loadPublicContent(id);
    assert.equal(c.marketId,id);assert.equal(c.version,PUBLIC_VERSION);assert.ok(c.legacyVersion);assert.ok(c.legacyScope);assert.ok(c.script.endsWith('-storyboard.md'));
    assert.ok(Object.keys(c.sources).length>2,id);assert.ok(c.timeline.length,id);
    for(const s of Object.values(c.sources)){assert.equal(typeof s.title,'string');assert.match(s.url,/^https:\/\//,id);}
    assert.ok(c.payment.every(t=>t.length>40),id);assert.ok(c.constraint.every(Boolean));assert.ok(c.payer.every(Boolean));
    for(const section of Object.values(c.extracts))for(const excerpt of section){
      const original=await import('../src/markets/'+id+'/story.js');
      const shot=original.story.chapters.flatMap(ch=>ch.shots).find(s=>s.id===excerpt.shotId);
      assert.deepEqual(excerpt.text,shot.copy,'verbatim facts retain their exact signed text');
      assert.deepEqual(excerpt.claimIds,shot.claims);
      for(const key of excerpt.sourceIds)if(!key.startsWith('REPO'))assert.ok(c.sources[key],id+'/'+key);
    }
  }
});

test('Japan shares national background while each region keeps its own constraints and evidence',async()=>{
  const [a,b,c]=await Promise.all(['jp_tokyo','jp_kyushu','jp_hokkaido'].map(loadPublicContent));
  assert.equal(a.background,b.background);assert.equal(b.background,c.background);
  assert.notDeepEqual(a.constraint,b.constraint);assert.notDeepEqual(b.constraint,c.constraint);
  assert.notDeepEqual(a.regionalSourceIds,b.regionalSourceIds);assert.notDeepEqual(b.regionalSourceIds,c.regionalSourceIds);
  assert.equal(a.legacyScope.lens,'infraFund');assert.equal(a.legacyScope.stage,'operating');
  for(const d of [a,b,c]){
    const sourcePool=composeStory(d.marketId).sources;
    const national=[...new Set(['jp-01','jp-02','jp-03','jp-04','jp-05','jp-06','jp-11'].flatMap(id=>SHARED_SHOTS[id].claims).flatMap(id=>JP_CLAIMS[id].sources))].filter(id=>sourcePool[id]?.url?.startsWith('https:'));
    const own=composeStory(d.marketId).chapters.flatMap(ch=>ch.shots).filter(shot=>shot.id.includes(d.marketId.slice(3))).flatMap(s=>s.claims).flatMap(id=>JP_CLAIMS[id].sources).filter(id=>sourcePool[id]?.url?.startsWith('https:'));
    assert.deepEqual(Object.keys(d.sources).sort(),[...new Set([...national,...own])].sort(),'effective final source pool excludes other-region-only evidence');
    assert.deepEqual(d.sourceGroups.map(g=>g.id),['national','regional']);
    assert.ok(d.sourceGroups[1].ids.length);
    assert.ok(Object.keys(d.internalReferences).length,'internal research provenance is retained');
    for(const s of Object.values(d.internalReferences)){assert.doesNotMatch(s.url,/[{}]/);if(s.url.startsWith('/'))assert.ok(s.url.startsWith('/markets/'+{jp_tokyo:'japan-tokyo',jp_kyushu:'japan-kyushu',jp_hokkaido:'japan-hokkaido'}[d.marketId]));}
  }
});

test('public deep links locate chapter, locale and edition using the unchanged router whitelist',()=>{
  assert.deepEqual(STORY_PARAMS,['view','chapter','shot']);
  for(const [chapter] of CHAPTERS)for(const locale of ['en','zh']){
    const p=publicPlace(chapter,locale);assert.ok(p.shot.length<=40,p.shot);
    const url=placeSearch('?region=kyushu',p);const route=parseRoute('/markets/japan-kyushu',url);
    assert.deepEqual(readPublicPlace(route.story),{chapter,locale,version:PUBLIC_VERSION});assert.equal(route.region,'kyushu');
  }
  assert.equal(readPublicPlace({chapter:'<script>',shot:'bad'}).chapter,'history');
  assert.equal(placeSearch('?view=story&chapter=history&shot=public-en-2026-11-06-1-history',null),'');
});

test('public reading imports neither financial models nor investor bindings; full content and SVG are lazy',async()=>{
  const dir=new URL('../src/experience/story/public/',import.meta.url);
  for(const file of (await readdir(dir)).filter(f=>f.endsWith('.js'))){
    const text=await readFile(new URL(file,dir),'utf8');
    assert.doesNotMatch(text,/from ['"].*(?:storyBindings|comparison|briefing|experience\/model|opportunities)/,file);
  }
  const overview=await readFile(new URL('overview.js',dir),'utf8');assert.doesNotMatch(overview,/(?:\.\/content\.js|\.\/scene\.js|kit\/)/);
  const chapter=await readFile(new URL('chapter.js',dir),'utf8');assert.match(chapter,/import\('\.\/scene\.js'\)/);
});

test('evidence updates are distinguished from pending editorial approval without inventing a review date',()=>{
  assert.deepEqual(publicEvidenceState('2026-11-01',{a:{checkedOn:'2026-11-03'}}),{latestSourceOn:'2026-11-03',evidenceUpdated:true});
  assert.deepEqual(publicEvidenceState('2026-11-01',{a:{checkedOn:null}}),{latestSourceOn:'2026-11-01',evidenceUpdated:false});
  assert.equal(PUBLIC_STATUS,'pending-public-review');
});
