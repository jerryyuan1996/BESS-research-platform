import test from 'node:test';
import assert from 'node:assert/strict';
import { newsItems, newsJurisdictions, filterNews, coverageRows } from '../src/policy/intelligence.js';
const item = (title, url='https://example.org/article') => ({title,url,source:'Synthetic feed',summary:'',t:'2026-11-12T01:00:00Z',category:'grid'});

test('news geography preserves regional ownership and counts a country-wide item once',()=>{
  assert.deepEqual(newsJurisdictions(item('Western Australia battery storage')),['AU-WA']);
  assert.deepEqual(newsJurisdictions(item('Australia NEM electricity market')),['AU-NEM']);
  assert.deepEqual(newsJurisdictions(item('Australia battery auction US$500 million')),['AU-NEM']);
  const news=newsItems({series:[item('Japan battery storage')]});
  assert.equal(news[0].markets.length,3);
  assert.deepEqual(news[0].jurisdictions,['JP']);
  assert.equal(coverageRows([],news,e=>e.jurisdiction).find(r=>r.id==='JP').newsCount,1);
});
test('generic national news has geography without an invented allocation market',()=>{
  const news=newsItems({series:[item('United States electricity policy')]});
  assert.deepEqual(news[0].markets,[]);
  assert.deepEqual(news[0].jurisdictions,['US']);
  assert.equal(filterNews(news,new URLSearchParams('market=ercot')).length,0);
  assert.equal(filterNews(news,new URLSearchParams('jurisdiction=US')).length,1);
  const extra=newsItems({series:[item('Dutch battery storage')]});
  assert.deepEqual(extra[0].markets,[]);assert.deepEqual(extra[0].jurisdictions,['NL']);
});
test('unsafe and malformed feed records are dropped; duplicate items do not inflate map counts',()=>{
  const news=newsItems({series:[item('Italy battery storage'),item('Italy battery storage'),item('X','javascript:alert(1)'),{...item('Undated'),t:'bad'},item('Y','https://user:password@example.org')]});
  assert.equal(news.length,1);
  const rows=coverageRows([{jurisdiction:'IT'}],news,e=>e.jurisdiction);
  assert.deepEqual([rows.find(r=>r.id==='IT').policyCount,rows.find(r=>r.id==='IT').newsCount],[1,1]);
});
test('news filtering does not silently present headlines as verified policy',()=>{
  const news=newsItems({series:[item('Italy battery storage'),item('Global technology','https://example.org/other')]});
  for(const query of ['type=policy','lifecycle=effective','mechanism=grid_access','review=pending']) assert.equal(filterNews(news,new URLSearchParams(query)).length,0);
  assert.equal(filterNews(news,new URLSearchParams('jurisdiction=unmapped')).length,1);
  assert.equal(filterNews(news,new URLSearchParams('q=ITALY')).length,1);
  assert.equal(filterNews(news,new URLSearchParams('period=7'),null,Date.parse('2026-12-01')).length,0);
});
