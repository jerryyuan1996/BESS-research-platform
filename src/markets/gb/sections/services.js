/* Great Britain — the `services` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.services = function (){
  const dc = M.services[0];
  return {
  head: ['System Services — volume share is at its ceiling, value is not','系统服务 — 成交份额已达上限，价值尚未见底'],
  cap: ['Batteries clear almost all dynamic response volume in GB. That is a saturation signal, not a competitive advantage: the price is set by the marginal accredited MW, and accredited supply exceeds requirement several times over in every dynamic product.',
        '在英国，电池已占动态响应类成交量的绝大部分。这是饱和信号而非竞争优势：价格由边际认证MW决定，而各动态类产品的认证供给均数倍于需求。'],
  blocks: [
    { t:'card', mt:false, title:['Auctioned service suite — requirement, supply and price','拍卖服务组合 — 需求、供给与价格'], badges:['official'], live:true, blocks:[
      { t:'table',
        head:[['Service','服务'],['Requirement (MW)','需求(MW)'],['Procured (MW)','成交(MW)'],['Qualified supply (MW)','合格供给(MW)'],['Supply / requirement','供给需求比'],['Clearing (£/MW/h)','出清价(£/MW/h)'],['Battery share','电池份额'],['Unit revenue yoy','单位收入同比']],
        num:[1,2,3,4,5,6,7],
        rows: M.services.map(s => [
          { b: [s.code + ' — ' + s.n[0], s.code + ' — ' + s.n[1]] },
          fmtN(s.reqMW), fmtN(s.procMW), fmtN(s.qualMW),
          fmt1(s.qualMW / s.reqMW) + '×', '£' + fmt1(s.price),
          s.share + '%', s.yoy == null ? '—' : s.yoy + '%',
        ]) },
      { t:'bar', cfg:{ xs: M.services.map(s => s.code), mode:'group', bw: 20, yfmt: v => fmtN(v) + ' MW', h: 250,
        series:[
          { name:['Requirement','需求'], color:'var(--s1)', vals: M.services.map(s => s.reqMW) },
          { name:['Qualified supply','合格供给'], color:'var(--s6)', vals: M.services.map(s => s.qualMW) },
        ] } },
      { t:'why', text:['Qualified supply exceeds requirement in every product, by ' + fmt1(dc.qualMW / dc.reqMW) + '× in Dynamic Containment alone. Where supply is deepest the price falls fastest (DC/DM/DR at −25% to −30% year on year); where supply is thinnest it holds (SR at 1.4× and QR at 1.9×). The forward-looking read is that any product batteries can dominate will be over-supplied within about three years of becoming profitable, so the reserve family is where the remaining value sits — and it is the family that rewards energy, not power.',
        '各产品的合格供给均超过需求，仅动态遏制一项即达' + fmt1(dc.qualMW / dc.reqMW) + '倍。供给最深处价格下跌最快（DC/DM/DR同比−25%至−30%）；供给最薄处价格得以维持（SR为1.4倍、QR为1.9倍）。前瞻性结论是：任何电池能够主导的产品，都会在其变得有利可图后约三年内被过度供给；因此剩余价值集中于备用类产品 — 而该类产品奖励的是能量而非功率。'],
        sig:['Value migrates to energy-based products','价值向能量型产品迁移'] },
      { t:'src', src: SRC.eac, use:['Auction requirements, procured volumes and clearing prices by service','各服务的拍卖需求、成交量与出清价'] },
    ] },

    { t:'card', title:['Price trajectory by product family','各产品族价格轨迹'], badges:['official','calc'], live:true, blocks:[
      { t:'bar', cfg:{ xs: M.services.map(s => s.code), bw: 46, yfmt: v => v + '%', labels: true, h: 230,
        series:[{ name:['Unit revenue change, year on year','单位收入同比变化'], color:'var(--s6)', vals: M.services.map(s => s.yoy == null ? 0 : s.yoy) }] } },
      { t:'cmp', items:[
        { h:['Dynamic family (DC / DM / DR)','动态类（DC/DM/DR）'], v:'−25% to −30%', s:['Power-based, instantaneous response; battery share 97–99%; deepest over-supply','功率型瞬时响应；电池份额97–99%；供给过剩最严重'] },
        { h:['Reserve family (BR / QR / SR)','备用类（BR/QR/SR）'], v:'−8% to −12%', s:['Energy-based sustained response; battery share 55–88%; competition from other technologies','能量型持续响应；电池份额55–88%；面临其他技术竞争'] },
      ] },
      { t:'why', text:['The split between the two families is the most useful forward signal in this tab. Dynamic products are falling roughly three times faster than reserve products, and the difference is entirely structural: instantaneous power is abundant once batteries are built, sustained energy is not. A 1h asset is exposed almost entirely to the falling family; a 4h asset can access both. Underwrite the dynamic line at trailing twelve-month unit revenue with a further decline assumption, and the reserve line flat at best.',
        '两个产品族之间的分化是本页最有价值的前瞻信号。动态类产品的下跌速度约为备用类的三倍，其差异完全是结构性的：电池建成后瞬时功率变得充裕，而持续能量并不会。1小时资产几乎完全暴露于下跌的产品族；4小时资产则可同时进入两类。动态类收入应按过去12个月单位收入并附加进一步下降假设测算，备用类最多按持平测算。'],
        sig:['Power is abundant, energy is not','功率充裕，能量不然'] },
    ] },

    { t:'card', title:['Underwriting rule for the services line','系统服务收入的承销规则'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items:[
        { n:['Cap at trailing twelve months','以过去十二个月封顶'], d:['Never model a services growth rate. The observed base rate is −8% to −30% a year across the suite.','绝不设定服务收入增长率。全套产品的观察基准为每年−8%至−30%。'] },
        { n:['No MWh justified by services','不得以服务收入论证增配MWh'], d:['Dynamic products pay for MW, not MWh. Additional energy is justified by capacity de-rating and arbitrage, not by response.','动态类产品为MW付费而非MWh。增配能量的依据是容量折减系数与套利，而非响应服务。'] },
        { n:['Exclude from debt sizing','排除于债务规模测算之外'], d:['Treat services as equity upside. Lenders in GB size against the capacity agreement and any contracted floor.','将服务收入视为股权上行。英国贷款人以容量协议及任何合同保底安排债务规模。'] },
        { n:['Re-test each auction reform','每次拍卖机制改革后重新检验'], d:['Product definitions and procurement volumes have changed repeatedly; a product can be redesigned out of existence.','产品定义与采购量已多次变更；某项产品可能因重新设计而不复存在。'] },
      ] },
      { t:'why', text:['At ' + fmtCk(M.lab.servicesKW * 1000) + '/MW/yr the services line is roughly ' + fmtPct(M.lab.servicesKW * 1000 / M.bmRevenueByDur[2] * 100, 0) + ' of a 2h asset’s merchant revenue — small enough that removing it entirely should not break the investment case. If it does, the case was never a storage case; it was a bet on an ancillary market that has already been competed away once and is being competed away again.',
        '按' + fmtCk(M.lab.servicesKW * 1000) + '/MW/年计，服务收入约为2小时资产市场化收入的' + fmtPct(M.lab.servicesKW * 1000 / M.bmRevenueByDur[2] * 100, 0) + ' — 其规模小到即使完全剔除也不应影响投资结论。若剔除后投资逻辑不成立，那么它从来就不是储能投资逻辑，而是对一个已被竞争消化过一次、正在被再次消化的辅助服务市场的押注。'],
        sig:['Remove it; if the case breaks, it was never a case','剔除后若逻辑崩塌，说明本无逻辑'] },
    ] },
  ] };
};

// ============================== DURATION & LDES ==============================

  return SEC_B.services;
}
