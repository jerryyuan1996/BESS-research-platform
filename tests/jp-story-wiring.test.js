import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {STORIES,storyFor} from '../src/experience/story/registry.js';
import {composeStory} from '../src/markets/jp/story.js';
import {reviewed,storyMatches} from '../src/markets/jp/storyBindings.js';
import {resolvePlace,placeSearch} from '../src/experience/story/place.js';
import {opportunities} from '../src/experience/model.js';

const ids=['jp_tokyo','jp_kyushu','jp_hokkaido'];
const rows=opportunities('infraFund').filter(row=>ids.includes(row.id));

test('three released Japan ids share one loader and open together without preview',()=>{
  assert.equal(new Set(ids.map(id=>STORIES[id].load)).size,1);
  for(const id of ids){
    assert.equal(STORIES[id].released,true);assert.equal(storyFor(id,''),STORIES[id]);
    assert.equal(storyFor(id,'?view=story'),STORIES[id]);assert.equal(storyFor(id,'?story=preview'),STORIES[id]);
    assert.equal(storyFor(id,'?story=preview&region=compare'),STORIES[id]);
  }
  assert.equal(storyFor('jp','?story=preview'),null);
});

test('each composition accepts only its own row and the reviewed fund lens',()=>{
  for(const row of rows){
    const story=composeStory(row.id);assert.ok(reviewed({row}));
    for(const other of rows.filter(r=>r.id!==row.id))assert.equal(reviewed({row:other,regionId:row.id}),null);
    for(const lens of ['strategic','foreignFirstTimer','developer'])assert.equal(storyMatches(story,row,lens),false);
    assert.equal(reviewed({row:{...row,id:'other'}}),null);
    const otherMarket=rows.find(r=>r.id!==row.id).market;
    assert.equal(reviewed({row:{...row,market:otherMarket}}),null);
  }
});

test('one stale call, play, duration or rule cannot block either other area',()=>{
  for(const row of rows){
    const economics=row.market.comparison.economics;
    const changedRule={...row,market:{...row.market,comparison:{...row.market.comparison,economics:{...economics,ltda:{...economics.ltda,years:40}}}}};
    for(const changed of [{...row,call:'wait'},{...row,play:{...row.play,id:'changed'}},{...row,play:{...row.play,hours:6}},changedRule])assert.equal(reviewed({row:changed}),null);
    for(const other of rows.filter(r=>r.id!==row.id))assert.ok(reviewed({row:other}));
  }
});

test('a foreign regional shot falls back to its chapter without interpreting dashboard region state',()=>{
  for(const id of ids){
    const story=composeStory(id),other=ids.find(x=>x!==id).slice(3);
    assert.equal(resolvePlace(story,{chapter:'tensions',shot:`jp-${other}-07`}), 'jp-06');
    assert.equal(resolvePlace(story,{chapter:'battery',shot:`jp-${other}-10`}), 'jp-09');
    assert.equal(resolvePlace(story,{chapter:'investment',shot:`jp-${other}-13`}), `jp-${id.slice(3)}-13`);
    const query=placeSearch('?story=preview&region=compare',{chapter:'tensions',shot:'jp-06'});
    assert.equal(new URLSearchParams(query).get('region'),'compare');
    assert.equal(resolvePlace(story,{chapter:'tensions',shot:'jp-06',region:'compare'}),'jp-06');
  }
});

test('pack resolves the area from its row and uses the ordinary shell with no dashboard parser',async()=>{
  const pack=await readFile(new URL('../src/markets/jp/storyPack.js',import.meta.url),'utf8');
  assert.match(pack,/REGION_IDS\[ctx\.row\?\.id\]/);assert.match(pack,/reviewed\(/);assert.match(pack,/openStory\(/);
  assert.doesNotMatch(pack,/URLSearchParams|region=|setCase|pushState|replaceState/);
  const registry=await readFile(new URL('../src/experience/story/registry.js',import.meta.url),'utf8');
  assert.equal((registry.match(/import\('\.\.\/\.\.\/markets\/jp\/storyPack\.js'\)/g)||[]).length,1);
});

test('built output contains one shared Japan pack and no per-area story packs',async t=>{
  const dir=new URL('../dist/assets/',import.meta.url);
  if(!existsSync(dir)){t.skip('build output absent; required budget checks run after build');return;}
  const files=await readdir(dir);
  assert.equal(files.filter(f=>/^story-jp-[^.]+\.js$/.test(f)).length,1);
  assert.equal(files.filter(f=>/^story-jp-(tokyo|kyushu|hokkaido)-/.test(f)).length,0);
});
