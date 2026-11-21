import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newsTextPair,hasNewsTranslation} from '../src/news/localization.js';
import {newsItems,filterNews} from '../src/policy/intelligence.js';
import {policySourceTitle} from '../src/policy/source-titles.zh.js';
import {NEWS_ZH} from '../src/news/translations.zh.js';
// Original RSS fields from a reviewed article that can age out of the daily feed.
const reviewedArticle={
  t:'2026-11-12T08:53:07.000Z',
  source:'Energy-Storage.news',
  url:'https://www.energy-storage.news/alinta-energys-200mwh-wagerup-bess-online-in-western-australia-after-significant-redesign/',
  title:'Alinta Energy’s 200MWh Wagerup BESS online in Western Australia after ‘significant redesign’',
  summary:"Alinta Energy's 100MW/200MWh BESS at its Wagerup thermal power plant in Western Australia has been operating commercially since September.",
};
test('every reviewed news title and non-empty summary has a source-bound Chinese translation',()=>{
  // Check the reviewed translation corpus without blocking future daily RSS
  // updates merely because they introduce new, not-yet-translated items.
  for(const [url,record] of Object.entries(NEWS_ZH))for(const field of ['title','summary']){
    const item={url,title:record.title[0],summary:record.summary[0]};
    assert.equal(hasNewsTranslation(item,field),true,`${item.url}: ${field}`);
    const pair=newsTextPair(item,field);assert.equal(pair[0],item[field]);
    if(item[field])assert.match(pair[1],/[\u3400-\u9fff]/);
  }
});
test('changed or unknown source text cannot inherit an old translation',()=>{
  const item=reviewedArticle;
  assert.deepEqual(newsTextPair({...item,title:'Updated headline'}),['Updated headline','Updated headline']);
  assert.deepEqual(newsTextPair({...item,summary:'Updated summary'},'summary'),['Updated summary','Updated summary']);
  assert.deepEqual(newsTextPair({...item,url:'https://example.org/new'}),[item.title,item.title]);
  assert.equal(newsTextPair({url:item.url,title:item.title})[1],newsTextPair(item)[1]);
});
test('Chinese search finds translated headlines without changing geographic tags',()=>{
  const other={...reviewedArticle,url:'https://example.org/update',title:'Western Australia storage update',summary:''};
  const items=newsItems({series:[reviewedArticle,other]});
  const found=filterNews(items,new URLSearchParams({q:'西澳 Wagerup 200MWh'}));
  assert.deepEqual(found.map(item=>item.url),[reviewedArticle.url]);
  assert.deepEqual(found[0].jurisdictions,['AU-WA']);
});
test('current policy titles, subtitles and official evidence labels all support Chinese',()=>{
  const index=JSON.parse(readFileSync(new URL('../public/data/public/policy/index.json',import.meta.url)));
  const file='366275d243854a017d6b8ef54ac5fc94d58a5d06e10406d469622fac21091a8b.json';
  const p=JSON.parse(readFileSync(new URL('../public/data/public/policy/snapshots/'+file,import.meta.url)));
  for(const item of [...p.instruments,...p.events,...p.stories])for(const field of ['title','summary','subtitle'])if(item[field])assert.match(item[field][1]||item[field].zh,/[\u3400-\u9fff]/);
  for(const source of p.sources){assert.equal(policySourceTitle(source)[0],source.title);assert.match(policySourceTitle(source)[1],/[\u3400-\u9fff]/);}
  assert.ok(index);
});
