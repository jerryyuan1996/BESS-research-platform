import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ARCHETYPES} from '../src/governance/archetypes.js';
import {HOME_BRIEFING} from '../src/briefing/homeData.js';
import {opportunities,featuredOpportunity,LENSES} from '../src/experience/model.js';
import {PUBLIC_READING_CATALOG} from '../src/experience/story/public/historyCatalog.js';
const source=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
test('home perspective entry stages and audience are projected from canonical archetypes',()=>{
 assert.deepEqual(Object.keys(HOME_BRIEFING.investorPerspectives).sort(),Object.keys(LENSES).sort());
 for(const id of Object.keys(LENSES)){
  assert.deepEqual(HOME_BRIEFING.investorPerspectives[id],{who:ARCHETYPES[id].who,entersAt:ARCHETYPES[id].entersAt});
  assert.ok(featuredOpportunity(opportunities(id),id)?.id);
 }
 assert.ok(!HOME_BRIEFING.investorPerspectives.developer.entersAt.includes('operating'));
});
test('perspective controls reuse current lead and existing state, not separate scores',async()=>{
 const s=await source('src/experience/perspectives.js');
 assert.match(s,/featuredOpportunity\(opportunities\(id\),id\)/);
 assert.match(s,/setLens\(id\);requestRender\(\)/);
 assert.match(s,/aria-pressed/);assert.match(s,/aria-expanded/);assert.match(s,/hub_lens/);assert.match(s,/focus\(/);
 assert.doesNotMatch(s,/from .*archetypes|from .*method|IRR|\bscore\s*:/);
 const css=await source('src/experience/perspectives.css');assert.match(css,/repeat\(4/);assert.match(css,/repeat\(2/);assert.match(css,/focus-visible/);
});
test('each market gets lightweight themed background art and chapter entries',async()=>{
 const art=await source('src/experience/story/public/overviewArt.js');
 for(const c of Object.values(PUBLIC_READING_CATALOG))assert.match(art,new RegExp((c.theme||'history')+':'));
 assert.equal(Object.keys(PUBLIC_READING_CATALOG).length,18);
 assert.doesNotMatch(art,/import |fetch\(|https:\/\//);
 const overview=await source('src/experience/story/public/overview.js');
 assert.match(overview,/open\(button,chapter\)/);assert.match(overview,/historyOnly/);assert.match(overview,/data-public-chapter/);
 assert.doesNotMatch(overview,/G-1|G-2|review pending|待确认|read at your pace/);
 const css=await source('src/experience/story/public/overview.css');assert.match(css,/prefers-reduced-motion/);
});
