/* Poland — the `energy` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.energy = function (){
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2029];
  return {
  head: ['Wholesale & Intraday — how much of the spread is executable?','批发与日内市场 — 价差中有多少可执行？'],
  cap: ['Merchant revenue sits on top of the capacity contract and is what determines equity returns rather than debt capacity. Two haircuts apply: the gap between published and executable spread, and the gap between today and the arrival of the contracted storage cohort.',
        '市场化收入叠加于容量合同之上，决定的是股权回报而非债务容量。存在两道折减：公布价差与可执行价差之间的差距，以及当前与已签约储能批次到场之间的差距。'],
  blocks: [
    { t:'card', mt:false, title:['Price level, spread and negative-price intervals','价格水平、价差与负电价时段'], badges:['illus'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Day-ahead average (Q2 2026)','日前均价（2026年第二季度）'], v:fmtC(M.damSeries[5]) + '<small>/MWh</small>', d:['2025 average ' + fmtC(O.dam2025Eur) + ', PSE','2025年均值' + fmtC(O.dam2025Eur) + '，PSE'], b:['official'] },
        { l:['Average daily four-hour spread','日均四小时价差'], v:fmtC(M.spreadSeries[5]) + '<small>/MWh</small>', d:['widening as solar deepens the trough; PSE','随光伏加深低谷而扩大；PSE'], b:['official'] },
        { l:['Executable net margin','可执行净价差'], v:fmtC(60) + '<small>/MWh</small>', d:[fmtPct((1 - 60 / 88) * 100, 0) + ' of the published spread is not capturable','公布价差中' + fmtPct((1 - 60 / 88) * 100, 0) + '无法捕获'], cls:'down', b:['calc'] },
        { l:['Negative-price hours (2025, seed)','负电价小时数（2025，种子）'], v:'~' + fmtN(O.negHours) + '<small> h</small>', d:['the charging opportunity','充电机会'], b:['illus'] },
      ] },
      { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtC(v), h: 240, ymin: 0,
        series:[
          { name:['Day-ahead average','日前均价'], color:'var(--s1)', vals: M.damSeries },
          { name:['Average daily spread','日均价差'], color:'var(--s3)', vals: M.spreadSeries },
        ] } },
      { t:'why', text:['Note that the two lines move in opposite directions: average price falls as solar grows, while the daily spread widens. That is the storage business model in one chart — a battery does not care about the level, it cares about the shape. It also explains why a merchant thesis built on high average prices is the wrong thesis here: the price level will fall as coal retires and solar grows, and the spread is what pays.',
        '须注意两条线方向相反：随光伏增长平均电价下降，而日内价差扩大。这一张图即是储能商业模式 — 电池关心的不是电价水平而是价格形态。它同时解释了为何以高平均电价构建的市场化逻辑在此地是错误的：随着煤电退役与光伏增长，电价水平将下降，而付费的是价差。'],
        sig:['Shape pays, not level','付费的是形态，而非水平'] },
      { t:'src', src: SRC.tge, use:['Day-ahead and intraday price levels, spreads and negative-price intervals','日前与日内价格水平、价差及负电价时段'] },
    ] },

    { t:'card', title:['Published → executable margin bridge (€/MWh discharged)','公布至可执行价差桥（€/MWh放电）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtC(v), h: 290, steps: M.spreadBridge } },
      { t:'why', text:['About ' + fmtPct((1 - 60 / 88) * 100, 0) + '% of the published spread is lost before it reaches the P&L. The deductions are ordinary — liquidity, efficiency, availability, charges and fees — rather than structural, because Poland is a self-dispatch market with no binding system-penetration limit standing between the price signal and the trade. The 15-minute settlement introduced in the balancing reform slightly improves the intraday re-trade uplift, which is the one line that moves in the sponsor’s favour.',
        '公布价差中约' + fmtPct((1 - 60 / 88) * 100, 0) + '%在进入损益表前即已损失。扣减项属常规性 — 流动性、效率、可用率、网络费用与其他费用 — 而非结构性，因为波兰是自调度市场，价格信号与实际交易之间不存在硬性的系统渗透率上限。平衡市场改革引入的15分钟结算略微提升了日内再交易增益，这是唯一对发起人有利的一项。'],
        sig:['Ordinary haircuts, one favourable line','折减属常规，仅一项有利'] },
    ] },

    { t:'card', title:['Captured spread by COD year — the contracted cohort arrives','按投运年度的捕获价差 — 已签约批次到场'], badges:['forecast','illus'], live:true, blocks:[
      { t:'band', cfg:{ xs: Object.keys(M.codCases), yfmt: v => fmtC(v), h: 260,
        low: Object.values(M.codCases).map(c => c.low),
        base: Object.values(M.codCases).map(c => c.central),
        high: Object.values(M.codCases).map(c => c.high) } },
      { t:'cmp', items:[
        { h:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '/MWh',
          s:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high) + ' — the case spread is the real risk','低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high) + ' — 情景间差距才是真实风险'] },
        { h:['Contracted storage already awarded','已中标的签约储能'], v:fmt1(O.cmAwardedBessGW) + ' GW',
          s:['this cohort is contracted to connect regardless of what the spread does','无论价差如何变化，该批次均已签约并网'] },
      ] },
      { t:'why', text:['The Polish saturation risk is unusually predictable because the competing capacity is already contracted: ' + fmt1(O.cmAwardedBessGW) + ' GW of storage holds capacity agreements that oblige it to connect. Unlike a merchant pipeline that may or may not arrive, this cohort has a contractual reason to be built. Model the central-to-high range rather than the central case alone, and remember that your own capacity contract is the hedge against exactly this — which is the argument for entering the auction rather than staying merchant.',
        '波兰的饱和风险异常可预测，因为竞争性容量已经签约：' + fmt1(O.cmAwardedBessGW) + 'GW储能持有容量协议，负有并网义务。与可能到场也可能不到场的市场化管线不同，该批次有合同上的建设理由。应对中性至高情景区间建模，而非仅取中性情景；并须记住你自身的容量合同正是对此的对冲 — 这也是应参与拍卖而非停留于市场化的理由。'],
        sig:['Competitors are contracted to arrive','竞争者已签约必将到场'] },
    ] },
  ] };
};

// ============================== BALANCING & RESERVES ==============================

  return SEC_B.energy;
}
