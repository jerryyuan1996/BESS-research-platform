/* Investment Case: the investment-view revision. The content is the shared
   component, which reads this market's view and ledger as its dashboard
   registered them (nem/dashboard.js). */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  return () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
    { t: 'p', text: ['A deep financing and resale market and a fifteen-year tender contract for the projects that win one, around a reference project whose modelled return is 3.1%.', '融资与转售市场成熟，中标项目可获得十五年期招标合同；但参考项目的模型回报仅为3.1%。'] },
    { t: 'investment-case', marketId: 'nem' },
  ] });
}
