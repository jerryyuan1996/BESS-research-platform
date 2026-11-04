/* Great Britain — the `energy` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

SEC_B.energy = function (){
  const cod = +state.codYear, ci = M.buildYears.indexOf(String(cod));
  const compC = M.compression2h.CENTRAL[ci >= 0 ? ci : 4], compH = M.compression2h.HIGH[ci >= 0 ? ci : 4], compL = M.compression2h.LOW[ci >= 0 ? ci : 4];
  return {
  head: ['Wholesale & Balancing Mechanism — what spread is actually realised, not modelled?','批发与平衡机制 — 实际可实现的价差是多少，而非模型值？'],
  cap: ['This is the largest revenue line and the least contractible. Two independent haircuts apply: the gap between theoretical and realised revenue (execution), and the gap between today and your COD year (saturation).',
        '这是最大且最难合同化的收入项。存在两道相互独立的折减：理论收入与实际收入之间的差距（执行），以及当前与投运年度之间的差距（饱和）。'],
  blocks: [
    { t:'card', mt:false, title:['Realised revenue by duration — trailing twelve months','按时长的实际收入 — 过去十二个月'], badges:['tp'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['1h realised','1小时实际'], v:fmtCk(M.bmRevenueByDur[1]) + '<small>/MW/yr</small>', b:['tp'] },
        { l:['2h realised','2小时实际'], v:fmtCk(M.bmRevenueByDur[2]) + '<small>/MW/yr</small>', d:['+' + fmtPct((M.bmRevenueByDur[2] / M.bmRevenueByDur[1] - 1) * 100, 0) + ' vs 1h','较1小时+' + fmtPct((M.bmRevenueByDur[2] / M.bmRevenueByDur[1] - 1) * 100, 0)], b:['tp'] },
        { l:['4h realised','4小时实际'], v:fmtCk(M.bmRevenueByDur[4]) + '<small>/MW/yr</small>', d:['+' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0) + ' vs 2h','较2小时+' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0)], b:['tp'] },
        { l:['8h realised','8小时实际'], v:fmtCk(M.bmRevenueByDur[8]) + '<small>/MW/yr</small>', d:['+' + fmtPct((M.bmRevenueByDur[8] / M.bmRevenueByDur[4] - 1) * 100, 0) + ' vs 4h','较4小时+' + fmtPct((M.bmRevenueByDur[8] / M.bmRevenueByDur[4] - 1) * 100, 0)], b:['tp'] },
      ] },
      { t:'line', cfg:{ xs:['1h','2h','4h','6h','8h'], yfmt: v => fmtCk(v), ymin: 0, h: 230,
        series:[{ name:['Realised revenue by duration','按时长的实际收入'], color:'var(--s1)', vals:[M.bmRevenueByDur[1], M.bmRevenueByDur[2], M.bmRevenueByDur[4], M.bmRevenueByDur[6], M.bmRevenueByDur[8]] }] } },
      { t:'why', text:['Merchant revenue is strongly concave in duration. Doubling from 2h to 4h costs roughly double the energy capex but adds only ' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0) + ' of merchant revenue; 4h to 8h adds ' + fmtPct((M.bmRevenueByDur[8] / M.bmRevenueByDur[4] - 1) * 100, 0) + '. On merchant grounds alone GB storage should be short. The reason to build longer is entirely on the capacity and resilience side — which is why the duration decision must be made on combined incremental NPV and never on the trading case alone.',
        '市场化收入对时长呈显著凹性。由2小时增至4小时，能量段造价约翻倍，但市场化收入仅增加' + fmtPct((M.bmRevenueByDur[4] / M.bmRevenueByDur[2] - 1) * 100, 0) + '；由4小时增至8小时仅增加' + fmtPct((M.bmRevenueByDur[8] / M.bmRevenueByDur[4] - 1) * 100, 0) + '。仅从市场化角度看，英国储能应当做短。做长的理由完全来自容量与韧性一侧 — 因此时长决策必须基于合并的增量NPV，绝不可仅凭交易逻辑。'],
        sig:['Merchant says short; capacity says long','市场化指向短时；容量指向长时'] },
      { t:'src', src: SRC.vendor, use:['Realised revenue per MW by duration; vendor and vintage must be recorded before transaction use','按时长的每MW实际收入；交易使用前须记录供应商与数据版本'] },
    ] },

    { t:'card', title:['Revenue composition — where the money is actually earned','收入构成 — 收益的实际来源'], badges:['tp'], live:true, blocks:[
      { t:'bar', cfg:{ xs: M.revShare.map(s => L(s.n)), bw: 56, rotX: true, yfmt: v => v + '%', labels: true, h: 240,
        series:[{ name:['Share of merchant revenue','占市场化收入比重'], color:'var(--s1)', vals: M.revShare.map(s => s.pct) }] } },
      { t:'why', text:['The Balancing Mechanism is now the largest single component at 39%, ahead of day-ahead at 38%. That matters because BM revenue is not a price you can hedge — it is a dispatch outcome you have to earn, instruction by instruction, against a ' + fmtPct(M.skipRate * 100, 0) + ' skip rate. A GB battery is therefore only partly a trading asset; roughly two-fifths of its income depends on being visible, flexible and correctly parameterised inside the system operator’s despatch stack.',
        '平衡机制目前是最大的单一收入项，占39%，高于日前市场的38%。其意义在于：平衡机制收入不是可对冲的价格，而是须逐条指令去争取的调度结果，且面对' + fmtPct(M.skipRate * 100, 0) + '的跳过率。因此英国电池只是部分意义上的交易资产；约五分之二的收入取决于其在系统运营方调度体系中是否可见、灵活且参数设置正确。'],
        sig:['Two-fifths is dispatch, not trading','五分之二靠调度而非交易'] },
    ] },

    { t:'card', title:['Theoretical → realised bridge (2h asset, £/MWh of spread value)','理论至实际桥（2小时资产，价差价值£/MWh）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => '£' + fmtN(v), h: 280, steps: M.spreadBridge } },
      { t:'why', text:['Roughly ' + fmtPct((1 - 65 / 112) * 100, 0) + ' of theoretical spread value never reaches the P&L, and the three largest deductions — forecast error, skip rate and network charges — are not efficiency losses that better equipment fixes. Two are execution and one is policy. This is why a GB base case built from a perfect-foresight backtest is not conservative but simply wrong, and why the optimiser contract deserves more diligence than the battery supply agreement.',
        '理论价差价值中约' + fmtPct((1 - 65 / 112) * 100, 0) + '从未进入损益表，且三项最大扣减 — 预测误差、跳过率与网络费用 — 均非更好的设备所能解决的效率损失。其中两项属执行，一项属政策。这正是为何以完全预见回测构建的英国基准情景不是审慎而是根本错误，也是为何优化商合同比电池供货协议更值得尽调。'],
        sig:['Backtests are not base cases','回测不等于基准情景'] },
    ] },

    { t:'card', title:['Buildout paths and spread compression to your COD year','投产路径与至投运年度的价差压缩'], badges:['forecast','illus'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.buildYears, yfmt: v => fmt1(v) + ' GW', ymin: 0, h: 250,
        series:[
          { name:['Low buildout (revenue upside)','低投产（收益上行）'], color:'var(--s2)', vals: M.buildLow },
          { name:['Central buildout','中性投产'], color:'var(--s1)', vals: M.buildCentral },
          { name:['High buildout (revenue downside)','高投产（收益下行）'], color:'var(--s6)', vals: M.buildHigh },
        ] } },
      { t:'line', cfg:{ xs: M.buildYears, yfmt: v => fmtPct(v * 100, 0), h: 230,
        series:[
          { name:['2h revenue index — low buildout','2小时收入指数 — 低投产'], color:'var(--s2)', vals: M.compression2h.LOW },
          { name:['2h revenue index — central','2小时收入指数 — 中性'], color:'var(--s1)', vals: M.compression2h.CENTRAL },
          { name:['2h revenue index — high buildout','2小时收入指数 — 高投产'], color:'var(--s6)', vals: M.compression2h.HIGH },
        ] } },
      { t:'cmp', items:[
        { h:['At COD ' + state.codYear + ' — central case','投运年' + state.codYear + ' — 中性情景'], v: fmtPct(compC * 100, 0),
          s:['of today’s per-MW merchant revenue for a 2h asset','相当于当前2小时资产每MW市场化收入的比例'] },
        { h:['At COD ' + state.codYear + ' — high buildout','投运年' + state.codYear + ' — 高投产'], v: fmtPct(compH * 100, 0),
          s:['low-buildout case ' + fmtPct(compL * 100, 0) + ' — the spread between cases is the real risk','低投产情景' + fmtPct(compL * 100, 0) + ' — 情景间差距才是真实风险'] },
      ] },
      { t:'note', text:['The pipeline-to-spread transmission model and the fundamental price curve are calibrated to the same third-party source. They are not independent confirmation of each other, and a base case should not treat agreement between them as corroboration.',
        '管线至价差的传导模型与基本面价格曲线校准于同一第三方来源。两者并非相互独立的验证，基准情景不应将其一致性视为佐证。'] },
      { t:'why', text:['For a ' + state.codYear + ' COD the central case already removes ' + fmtPct((1 - compC) * 100, 0) + ' of today’s per-MW merchant revenue, and the high case removes ' + fmtPct((1 - compH) * 100, 0) + '. The gap between the two — ' + fmtPct((compC - compH) * 100, 0) + ' points — is what a sponsor is actually taking a view on, and it is decided by other people’s connection dates. That is the argument for contracting a floor: not because the central case fails, but because the sponsor has no influence over which case occurs.',
        '对' + state.codYear + '投运的项目，中性情景已抹去当前每MW市场化收入的' + fmtPct((1 - compC) * 100, 0) + '，高投产情景则抹去' + fmtPct((1 - compH) * 100, 0) + '。两者之间' + fmtPct((compC - compH) * 100, 0) + '个百分点的差距，才是发起人真正在下注的对象，而它由他人的并网日期决定。这正是签订保底安排的理由 — 并非因为中性情景不成立，而是因为发起人无法影响哪一种情景会发生。'],
        sig:['You are betting on other people’s CODs','你押注的是他人的投运时点'] },
      { t:'src', src: SRC.tec, use:['Probability-weighted TEC / ECR / REPD pipeline underlying the buildout cases','支撑投产情景的概率加权TEC/ECR/REPD管线'] },
    ] },
  ] };
};

// ============================== SYSTEM SERVICES ==============================

  return SEC_B.energy;
}
