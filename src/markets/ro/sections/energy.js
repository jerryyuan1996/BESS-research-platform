/* Romania — the `energy` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, eur, fmtRON } = createShared(api);
  const SEC_B = {};

SEC_B.energy = function (){
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2028];
  return {
  head: ['Wholesale & Intraday — how much of the spread is executable?','批发与日内市场 — 价差中有多少可执行？'],
  cap: ['This is the primary revenue line and, absent a capacity mechanism, close to the only one a lender can see. The analysis therefore focuses on the executable margin rather than the published spread, and on the COD year rather than today.',
        '这是主要收入来源；在没有容量机制的情况下，也几乎是贷款人唯一能看到的收入来源。因此分析聚焦于可执行价差而非公布价差，并聚焦于投运年度而非当下。'],
  blocks: [
    { t:'card', mt:false, title:['Price level and volatility','价格水平与波动性'], badges:['official','illus'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['DAM weighted-average 2025','2025年日前加权均价'], v:fmtRON(O.dam2025Wap), d:['≈ ' + fmtC(eur(O.dam2025Wap)) + '/MWh','≈ ' + fmtC(eur(O.dam2025Wap)) + '/MWh'], b:['official'] },
        { l:['IDM weighted-average 2025','2025年日内加权均价'], v:fmtRON(O.idm2025Wap), d:[fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0) + ' below day-ahead','较日前低' + fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0)], b:['official'] },
        { l:['DAM weighted-average Jun 2026','2026年6月日前加权均价'], v:fmtRON(O.damJun2026Wap), d:['≈ ' + fmtC(eur(O.damJun2026Wap)) + '/MWh','≈ ' + fmtC(eur(O.damJun2026Wap)) + '/MWh'], b:['official'] },
        { l:['DAM share of consumption','日前市场占消费比重'], v:O.dam2025SharePct + '<small>%</small>', d:[fmt1(O.dam2025TWh) + ' TWh traded in 2025','2025年成交' + fmt1(O.dam2025TWh) + 'TWh'], b:['official'] },
      ] },
      { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtN(v), h: 240, ymin: 0,
        series:[
          { name:['DAM (RON/MWh)','日前市场（RON/MWh）'], color:'var(--s1)', vals: M.damSeries },
          { name:['IDM (RON/MWh)','日内市场（RON/MWh）'], color:'var(--s3)', vals: M.idmSeries, dash: true },
        ] } },
      { t:'note', text:['Only the 2025 annual weighted averages and the June 2026 monthly figure are official anchors. The intra-year shape is an illustrative seed and the RON/EUR rate used throughout is an illustrative mid-rate of ' + fmt1(M.fx) + ' — replace it with the central-bank series before any transaction use, because a 5% FX move changes euro-denominated returns by more than most operating assumptions do.',
        '只有2025年年度加权均价与2026年6月的月度数值是官方锚点。年内形态为示例种子；全篇所用RON/EUR汇率为示意中间价' + fmt1(M.fx) + ' — 任何交易用途前须以央行序列替换，因为5%的汇率变动对以欧元计价收益的影响，大于多数运营假设。'] },
      { t:'why', text:['Two things matter here. Price levels are high by regional standards and rising — the June 2026 monthly average is ' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + '% above the 2025 annual figure. And the day-ahead market clears only ' + O.dam2025SharePct + '% of consumption, so liquidity outside the peak hours is thinner than the headline volume suggests. Both point the same way: model the executable spread on realistic volumes, not the theoretical maximum on the full curve.',
        '此处有两点关键。按区域标准价格水平偏高且在上升 — 2026年6月月均较2025年年度数值高' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + '%。而日前市场仅出清了消费量的' + O.dam2025SharePct + '%，因此高峰时段以外的流动性比总成交量所显示的更薄。两点指向同一结论：应按现实成交量测算可执行价差，而非按完整曲线上的理论最大值。'],
        sig:['Thin liquidity outside peak hours','高峰时段外流动性偏薄'] },
      { t:'src', src: SRC.opcom, use:['Annual and monthly weighted-average prices, traded volumes and market share','年度与月度加权均价、成交量及市场份额'] },
    ] },

    { t:'card', title:['Published → executable margin bridge (€/MWh discharged)','公布至可执行价差桥（€/MWh放电）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtC(v), h: 290, steps: M.spreadBridge } },
      { t:'why', text:['About ' + fmtPct((1 - 62 / 85) * 100, 0) + '% of the published spread is lost before it reaches the P&L, which is a smaller haircut than Ireland’s and a similar one to GB’s. The Romanian deductions are ordinary — liquidity, efficiency, availability, fees — rather than structural, because there is no central scheduling and no binding system-penetration limit standing between the price signal and the trade. That is the compensating advantage of an energy-only design: what you see is closer to what you can execute.',
        '公布价差中约' + fmtPct((1 - 62 / 85) * 100, 0) + '%在进入损益表前即已损失，折减幅度小于爱尔兰，与英国接近。罗马尼亚的扣减项属常规性 — 流动性、效率、可用率、费用 — 而非结构性，因为价格信号与实际交易之间既无集中调度，也无硬性的系统渗透率上限。这正是单一电能量设计的补偿性优势：所见更接近所能执行。'],
        sig:['Ordinary haircuts, not structural ones','折减属常规而非结构性'] },
    ] },

    { t:'card', title:['Captured spread by COD year — the competition discount','按投运年度的捕获价差 — 竞争折扣'], badges:['forecast','illus'], live:true, blocks:[
      { t:'band', cfg:{ xs: Object.keys(M.codCases), yfmt: v => fmtC(v), h: 260,
        low: Object.values(M.codCases).map(c => c.low),
        base: Object.values(M.codCases).map(c => c.central),
        high: Object.values(M.codCases).map(c => c.high) } },
      { t:'cmp', items:[
        { h:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '/MWh',
          s:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high) + ' — the case spread is the real risk','低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high) + ' — 情景间差距才是真实风险'] },
        { h:['Competition dilution factor','竞争稀释系数'], v:fmtPct(dilutionAt(+cod) * 100, 0), s:['relative to a 2028 reference COD','相对于2028年基准投运年'] },
      ] },
      { t:'why', text:['The central case falls from ' + fmtC(M.codCases[2027].central) + ' to ' + fmtC(M.codCases[2029].central) + '/MWh across three COD years — a ' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '% decline driven entirely by competing storage arriving. With no capacity payment to cushion it, COD year is the single most valuable variable a Romanian sponsor controls. Every month of permitting or connection delay is directly priced into the merchant line, which is why the diligence budget belongs on the connection chain rather than on the price forecast.',
        '中性情景下，三个投运年度之间捕获价差由' + fmtC(M.codCases[2027].central) + '降至' + fmtC(M.codCases[2029].central) + '/MWh — 下降' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '%，其驱动完全来自竞争性储能的到场。由于没有容量付费缓冲，投运年度是罗马尼亚发起人可控的最有价值变量。许可或并网每延迟一个月都会被直接计入市场化收入，这正是尽调预算应投向并网链条而非价格预测的原因。'],
        sig:['Delay is priced directly into revenue','延迟被直接计入收入'] },
    ] },
  ] };
};

// ============================== BALANCING & RESERVES ==============================

  return SEC_B.energy;
}
