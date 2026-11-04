/* Ireland — the `energy` section.
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
  head: ['Wholesale & Balancing — how much of the published spread is executable?','批发与平衡市场 — 公布价差中有多少可执行？'],
  cap: ['Ireland shows wide day-ahead spreads because wind variability on a small system produces large price swings. But central scheduling, the non-synchronous penetration limit and network constraints all sit between the price signal and the trade, so the executable spread is roughly half the published one.',
        '爱尔兰的日前价差较宽，因为小系统上的风电波动会造成大幅价格摆动。但集中调度、非同步渗透率上限与网络约束均横亘在价格信号与实际交易之间，因此可执行价差约为公布价差的一半。'],
  blocks: [
    { t:'card', mt:false, title:['Day-ahead spread — level and trend','日前价差 — 水平与趋势'], badges:['tp'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.spreadLabels, yfmt: v => fmtC(v), h: 230, ymin: 0,
        series:[{ name:['Average daily day-ahead spread (€/MWh)','日均日前价差（€/MWh）'], color:'var(--s1)', vals: M.spreadSeries }],
        refs:[{ y: 59, label:['executable net spread','可执行净价差'], color:'var(--s6)' }] } },
      { t:'why', text:['The published series sits around ' + fmtC(O.daSpread) + '/MWh and the executable line sits at ' + fmtC(59) + ' — the gap is not noise, it is the structural cost of operating inside a centrally scheduled, constrained system. Any Irish model that starts from the published spread and applies only an efficiency haircut will be roughly ' + fmt1(O.daSpread / 59) + '× too optimistic on the merchant line.',
        '公布序列约在' + fmtC(O.daSpread) + '/MWh，而可执行线为' + fmtC(59) + ' — 两者差距并非噪音，而是在集中调度、受约束系统中运行的结构性成本。任何以公布价差为起点、仅施加效率折减的爱尔兰模型，在市场化收入项上将过于乐观约' + fmt1(O.daSpread / 59) + '倍。'],
        sig:['Roughly half the headline is real','表面数字约有一半是真实的'] },
    ] },

    { t:'card', title:['Published → executable spread bridge (€/MWh discharged)','公布至可执行价差桥（€/MWh放电）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtC(v), h: 290, steps: M.spreadBridge } },
      { t:'why', text:['The largest single deduction is dispatch, SNSP and constraint access at €14/MWh — larger than round-trip efficiency and larger than the optimiser fee. This is the distinctively Irish haircut: in a centrally scheduled market with a binding non-synchronous limit, the battery is not always permitted to make the trade the price implies. It is also the deduction that interconnection will reduce, which is one of the few places where Celtic and Greenlink help rather than hurt storage revenue.',
        '最大的单项扣减是调度、SNSP与网络约束准入，达€14/MWh — 高于往返效率损失，也高于优化商费用。这是爱尔兰特有的折减：在集中调度且非同步渗透率存在硬性上限的市场中，电池并不总被允许执行价格所隐含的交易。这也是互联建设将会减少的扣减项，是Celtic与Greenlink对储能收入有助而非有害的少数环节之一。'],
        sig:['Access, not efficiency, is the big loss','最大损失来自准入而非效率'] },
    ] },

    { t:'card', title:['SDP-02 — what proper scheduling integration changed','SDP-02 — 正式调度整合带来的变化'], badges:['official','illus'], live:true, blocks:[
      { t:'bar', cfg:{ xs:[L(['Traded volume index','交易量指数']), L(['Cycles per day','日循环次数']), L(['Round-trip utilisation %','往返利用率%'])],
        mode:'group', bw: 30, yfmt: v => fmt1(v), labels: true, h: 240,
        series:[
          { name:['Before SDP-02','SDP-02之前'], color:'var(--muted)', vals:[M.sdp.before.vol, M.sdp.before.cycles, M.sdp.before.rtt] },
          { name:['After SDP-02','SDP-02之后'], color:'var(--s1)', vals:[M.sdp.after.vol, M.sdp.after.cycles, M.sdp.after.rtt] },
        ] } },
      { t:'why', text:['This is the one place in either dashboard where historical data is too pessimistic rather than too optimistic. Before ' + O.sdp02Live + ' Irish batteries were structurally under-scheduled; after it, traded volume roughly doubled and cycling rose from ' + fmt1(M.sdp.before.cycles) + ' to ' + fmt1(M.sdp.after.cycles) + ' cycles a day. Any backtest that spans the change must be split at that date, and any pre-2026 Irish revenue benchmark understates what a modern asset can achieve.',
        '这是两个看板中唯一一处历史数据过于悲观而非过于乐观的地方。在' + O.sdp02Live + '之前，爱尔兰电池在结构上被调度不足；此后交易量约翻倍，循环次数由每日' + fmt1(M.sdp.before.cycles) + '次升至' + fmt1(M.sdp.after.cycles) + '次。任何跨越该变更的回测都必须在该日期分段，而任何2026年之前的爱尔兰收入基准都低估了现代资产的实际能力。'],
        sig:['Split every backtest at Nov 2025','所有回测须以2025年11月分段'] },
    ] },

    { t:'card', title:['Captured spread by COD year — saturation and coupling','按投运年度的捕获价差 — 饱和与耦合'], badges:['forecast','illus'], live:true, blocks:[
      { t:'band', cfg:{ xs: Object.keys(M.codCases), yfmt: v => fmtC(v), h: 260,
        low: Object.values(M.codCases).map(c => c.low),
        base: Object.values(M.codCases).map(c => c.central),
        high: Object.values(M.codCases).map(c => c.high),
        zones:[{ from: 0, to: 1, label:['Pre-Celtic','Celtic之前'] }, { from: 2, to: 3, label:['Post-Celtic coupling','Celtic耦合之后'] }] } },
      { t:'cmp', items:[
        { h:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '/MWh', s:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high) + ' — the case spread is the real risk','低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high) + ' — 情景间差距才是真实风险'] },
        { h:['Buildout dilution factor','投产稀释系数'], v:fmtPct(dilutionAt(+cod) * 100, 0), s:['relative to a 2028 reference COD','相对于2028年基准投运年'] },
      ] },
      { t:'line', cfg:{ xs: M.fanYears, yfmt: v => fmtN(v), h: 230,
        series:[
          { name:['Merchant revenue index — low buildout','市场化收入指数 — 低投产'], color:'var(--s2)', vals: M.fanLow },
          { name:['Merchant revenue index — central','市场化收入指数 — 中性'], color:'var(--s1)', vals: M.fanCentral },
          { name:['Merchant revenue index — high buildout','市场化收入指数 — 高投产'], color:'var(--s6)', vals: M.fanHigh },
        ] } },
      { t:'why', text:['Two forces compress the merchant line simultaneously and they are not independent: more storage narrows the spread it trades against, and more interconnection narrows the spread for everyone. For a ' + cod + ' COD the central case is ' + fmtC(cc.central) + '/MWh against ' + fmtC(cc.high) + ' in the low-buildout case — a ' + fmtPct((1 - cc.central / cc.high) * 100, 0) + ' difference decided by other people’s connection dates and by a subsea cable commissioning schedule. Size the merchant line as equity, and let capacity carry the debt.',
        '两股力量同时压缩市场化收入线，且二者并非独立：更多储能会收窄其所交易的价差，更多互联则为所有参与者收窄价差。对' + cod + '投运的项目，中性情景为' + fmtC(cc.central) + '/MWh，而低投产情景为' + fmtC(cc.high) + ' — ' + fmtPct((1 - cc.central / cc.high) * 100, 0) + '的差距由他人的并网时点及一条海底电缆的投运进度决定。市场化收入应按股权规模承担，由容量收入支撑债务。'],
        sig:['Merchant is equity; capacity is debt','市场化对应股权，容量对应债务'] },
      { t:'src', src: SRC.celtic, use:['Celtic Interconnector capacity and expected commissioning date','Celtic互联容量与预计投运日期'] },
    ] },
  ] };
};

// ============================== DS3 / FASS / DASSA ==============================

  return SEC_B.energy;
}
