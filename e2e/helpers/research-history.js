import {expect} from '@playwright/test';
import {createFormat} from '../../src/markets/_shared/format.js';
export const historySlugs={wa:'western-australia',nem:'nem',gb:'great-britain',de:'germany',it:'italy',ie:'ireland',ro:'romania',pl:'poland',jp_tokyo:'japan-tokyo',jp_kyushu:'japan-kyushu',jp_hokkaido:'japan-hokkaido',pjm:'pjm',ercot:'ercot',caiso:'caiso',fi:'finland',ca_on:'ontario',sa:'saudi-arabia',es:'spain'};
export const historyInvestors=['infraFund','strategic','foreignFirstTimer','developer'];
const cache=new Map();
export async function expectedHistory(id){
  const owner=id.startsWith('jp_')?'jp':id;
  if(!cache.has(owner))cache.set(owner,(async()=>{
    const {researchHistory}=await import(`../../src/markets/${owner}/history.js`);
    let api;
    if(owner==='wa')api=await import('../../src/markets/wa/ui.js');
    else{
      const [{M},{MKT},{SRC}]=await Promise.all(['data','mkt','sources'].map(name=>import(`../../src/markets/${owner}/${name}.js`)));
      api={M,SRC,...createFormat(MKT)};
    }
    return researchHistory(api);
  })());
  return cache.get(owner);
}
export async function expectCompleteHistory(page,id,locale){
  const expected=await expectedHistory(id),lang=locale==='en'?0:1;
  const history=page.locator('.public-full-history');await expect(history).toBeVisible();
  const actual=await history.locator('[data-history-node]').evaluateAll(elements=>elements.map(node=>Object.fromEntries(['y','t','p','i'].map(key=>[key,node.querySelector(`[data-history-field=${key}]`)?.textContent]))));
  const nodes=expected.cards.flatMap(c=>c.blocks.filter(b=>b.t==='timeline').flatMap(b=>b.items));
  expect(actual).toEqual(nodes.map(node=>Object.fromEntries(['y','t','p','i'].map(key=>[key,key==='y'?node.y:node[key][lang]]))));
  const full=await history.textContent();
  function check(block){
    for(const key of ['head','cap','title','b','text','sig'])if(Array.isArray(block[key])&&block[key].length===2&&block[key].every(v=>typeof v==='string'))expect(full).toContain(block[key][lang]);
    (block.blocks||block.cards||[]).forEach(check);
  }
  check(expected);expected.cards.forEach(check);
  await expect(history.locator('.public-history-provenance a')).toHaveCount(2);
  return actual;
}
