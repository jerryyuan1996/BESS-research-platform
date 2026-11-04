/* Entry: what it costs before the first dollar of revenue. There is no build
   pathway for this market yet, so the section is the ledger. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  return () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
    { t: 'p', text: ['Connection charges and tender security are known to exist and none is sourced, so nothing here is totalled.', '已知存在并网费用与招标担保，但均无来源，因此此处不作合计。'] },
    { t: 'entry-ledger', marketId: 'nem' },
  ] });
}
