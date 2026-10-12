/* ---------------------------------------------------------------------------
   National Electricity Market — market dataset.

   Same shape as the RO/PL datasets in this lineage: official snapshot values,
   scorecards, bands, duration curves, the project pipeline, lab defaults and the
   per-tab narrative inputs. Everything the shared engine draws comes from here.

   THREE THINGS ABOUT THIS PARTICULAR DATASET.

   1. There is no capacity mechanism, so `deratingCurve` is flat at 1 and
      `futureCapFactor` is 0 — the same declaration Romania makes, for the same
      reason. The Nelson Review's final report (16 December 2025) kept the
      energy-only model and every NEM jurisdiction except Queensland had agreed
      the remaining recommendations by March 2026.

   2. The lab seed reproduces src/markets/nem/comparison.js rather than
      restating it. capexKWh 245 + capexKW 560 is GenCost's A$385/kWh four-hour
      point decomposed on the same common power/energy split the comparison
      interface uses; opexKW 20 is its A$20,000/MW/yr; servicesKW 9 is its
      A$9,000/MW/yr FCAS line; grantPct 0 is its `grantPct: 0`.

   3. Where a figure is not published anywhere — CIS floors, toll prices,
      optimiser fees, fixed O&M, regional revenue levels — this file does not
      invent one. Those gaps are carried explicitly in `notPublished` and
      rendered on the Data & Methodology tab.
   --------------------------------------------------------------------------- */

const M = {
  asOf: '2026-08-01',
  dataDate: '2025 annual / Q2 2026 quarterly / Jun 2026 monthly',
  modelVersion: 'nem-seed-1.0-energy-only-cis-collar',
  title: ['National Electricity Market Battery Investment Dashboard', '澳大利亚国家电力市场储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application. Reference region NSW1.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。参考区域为NSW1。'],
  nextMilestone: ['Next milestone: Capacity Investment Scheme Tender 10 results — bids closed 18 August 2026; reported to be the final NEM dispatchable tender before the scheme winds up in 2027. The first successor (ESEM) round is indicatively late 2027',
                  '下一里程碑：容量投资计划第10轮招标结果 — 已于2026年8月18日截标；据报为该计划2027年结束前最后一轮NEM可调度电源招标。后继机制（ESEM）首轮采购暂定于2027年底'],
  footerNote: ['Public and official sources collected 1 August 2026; Western Australian data is held in a separate peer namespace and excluded from NEM scoring. No CIS floor, ceiling or payment cap has been published for any project, and no Australian BESS toll price has ever been disclosed — every contracted figure in this build is a derived bracket, not a quotation.',
               '公开及官方来源于2026年8月1日采集；西澳数据保存在独立同业命名空间，不计入NEM评分。任何项目的CIS保底价、上限与支付上限均未公布，澳大利亚亦从未披露过储能租赁价格 — 本版本中所有合同类数值均为推导区间，而非报价。'],
  seedWarn: ['Every value on this page is an approved base-case snapshot or an illustrative placeholder. No figure is production-complete until its live feed, validation and source-health check are running. A CIS agreement is a collar, not a fixed payment; an awarded megawatt is never a financial-investment decision; a connection application is never a connection; and a marginal loss factor is a live annual variable, not a discount agreed at financial close.',
             '本页所有数值均为已批准的基准情景快照或示例占位数据。在实时数据接入、校验及来源健康检测上线前，任何指标均不可用于生产决策。CIS协议是双向保底—分成结构，而非固定付费；中标兆瓦绝不等于最终投资决策；并网申请绝不等于并网；边际损耗系数是逐年变动的活变量，而非融资交割时锁定的折扣。'],

  /* ---- official / sourced snapshot -------------------------------------
     Only values that come from a named publication sit here. Illustrative
     series live further down and are badged as such wherever they render. */
  official: {
    // market design
    /* The Nelson panel urged a pilot in late 2026 and commencement in early 2027.
       The draft regulatory package was only released on 14 September 2026
       (consultation to 13 October; back to energy ministers in December;
       South Australian Parliament in the first half of 2027), and the first
       procurement round is indicatively late 2027. The gap after Tender 10 is
       therefore about a year, not a few months. */
    reviewDate: '16 Dec 2025', esemDraftDate: '14 September 2026', esemStart: 'late 2027',

    // Capacity Investment Scheme — the collar
    cisFloorSharePct: 90, cisCeilingSharePct: 50, cisTermMinYr: 10, cisTermMaxYr: 15,
    // Tender 3, December 2024
    t3MW: 4130, t3MWh: 15370, t3Projects: 16, t3FourHourProjects: 14,
    t3Bids: 124, t3BidMW: 34000, t3BidMWh: 135000, t3TargetMW: 4000,
    // Tender 8, 24 June 2026 — largest storage procurement in CIS history
    t8MW: 4205, t8MWh: 16074, t8Projects: 15,
    // Tender 10 — reported final dispatchable tender
    t10MW: 4000, t10MWh: 16000, t10Close: '18 August 2026', cisWindUp: 2027,
    // delivery risk
    preT3FidPct: 28,

    // NSW LTESA — an option, not a CfD and not a toll
    ltesaR5CapMW: 185000, ltesaR6CapMW: 150000, ltesaMaxYears: 14,
    ltesaClawbackPct: 75, ltesaNoticeMonthsMin: 6, ltesaNoticeMonthsMax: 12,

    // Modo ME BESS AUS NEM index, A$/MW/yr
    idx2023K: 102, idx2024K: 148, idx2025K: 128, idxOctMarK: 73, idxOctMarChangePct: -38,
    monJanK: 121, monFebK: 54, monMayK: 29, monJunK: 35,
    q2SpreadAud: 51, q2SpreadFallPct: 85, arbitrageShareOfLifePct: 95,

    // FCAS
    fcasShareOctMarPct: 9, fcasQ2Am: 4.8, fcasQ2FallPct: 51, fcasQ2SharePct: 8.3,
    battRevQ2Am: 57.5,
    lowerContJulK: 56, lowerContAugK: 126,

    // negative prices
    negVicQ2Pct: 22.4, negSaQ2Pct: 21.9, negSaQ4Pct: 48.4,

    // duration
    fleetMW: 7960, fleetMWh: 18961, fleetHours: 2.38,
    fleetOver2hYear: 2025, fleetOver3hYear: 2029,
    irr4hPct: 9.4, irr2hPct: 5.5, irr4hEarlyLoPct: 10, irr4hEarlyHiPct: 11.5,
    irr2hEarlyLoPct: 6, irr2hEarlyHiPct: 9,
    capturedByFourHourPct: 96, capexPremiumFallLoPct: 20, capexPremiumFallHiPct: 30,
    gencost4h: 385, gencost2h: 525, gencost24h: 266, gencost2h2030: 484, gencost2h2050: 358,

    // pipeline
    installedMW: 9000, addedMW: 4640, addedMWh: 12353, q2AddedMW: 951, q2AddedMWh: 2753,
    pipelineGW: 33.2, gridFormingPct: 74, queueGW: 45, queue2022GW: 3,
    fc2025GW: 4.3, fc2025Abn: 4.8, fc2025GrowthPct: 10,
    cumInvestAbn: 31.4, cumInvestGW: 20.6,
    ispStorage2030GW: 33, ispStorage2050GW: 40, ispShortMedGW: 35, ispLongGW: 5,

    // grid
    mlfCostPerMW: 3200, mlfMultipleLo: 5, mlfMultipleHi: 10, mlfResetDate: '1 April',
    fleetCurtailMWh: 90929, nemCurtailTWh: 7, nemCurtailGrowthPct: 60,
    /* Project EnergyConnect is a two-stage project and only Stage 1 is delivered.
       Appendix A5 gives Stage 2 as November 2027; the proponents report ~July 2027,
       about a year later than the original plan. An earlier version of this file
       carried `pecEnergised: 'June 2026'`, which is wrong and inverted the argument
       the grid tab builds on it. */
    pecKm: 900, pecMW: 800, pecStage1MW: 150, pecStage1Done: 'late 2024',
    pecStage2Year: 'November 2027', pecStage2Proponent: 'mid-2027',
    humelinkKm: 365, humelinkKV: 500, humelinkYear: 2027, humelinkUnlockGW: 3, snowyMW: 2200,
    cwoNetworkGW: 4.5, cwoConnectGW: 7.7, cwoYear: 2028,
    vniWestGW: 3.5, vniWestAbn: 7.6, vniWestYear: 2030, vniWestWasYear: 2028,
    marinusMW: 750, marinusYear: 2030,

    /* ---- 2026 ISP optimal development path, Step Change (Appendix A5) ----
       Planning scale, not project scope. Every figure is A5 §A5.1.1 or the ISP
       explainer; `ispKmPrev` is the 2024 ISP Step Change figure and is carried
       only so the reduction is visible rather than asserted. */
    ispVintage: '2026', ispPublished: '25 June 2026',
    ispExistingKm: 44000, ispExtensionPct: 14,
    ispKm2050: 6046, ispKmPrev: 7483,
    ispKmCommitted: 1312, ispKmAnticipated: 2196, ispKmActionable: 1662, ispKmFuture: 876,
    ispKmDecade: 5000, ispConnectionAssetKm: 1800,
    ispTxCapexAbn: 16, ispTxCapexTo2050Abn: 6, ispConsumerSavingAbn: 30, ispOdpAnnualisedAbn: 106,
    ispWindSolar2050GW: 120, ispGasGW: 17, ispCapacity2050GW: 297, ispCapacityNowGW: 92,
    ispConsumptionNowTWh: 205, ispConsumption2050TWh: 389,
    ispVreCapacityPct: 66, ispVreGenPct: 96, ispRenewableInclHydroPct: 98,
    ispActionableCount: 12, ispFutureCount: 7, ispCommittedAnticipatedCount: 8,
  },

  /* Regional installed energy as reported at Q2 2026. These five figures sum to
     11,322 MWh against a NEM total of about 19,000 MWh, so they are the reported
     regional subset rather than a complete decomposition of the fleet — the
     dashboard says so wherever it draws them. */
  regions: [
    { id: 'NSW1', n: ['New South Wales', '新南威尔士'], mwh: 4865, revChangePct: -51 },
    { id: 'QLD1', n: ['Queensland', '昆士兰'],           mwh: 2570, revChangePct: -73 },
    { id: 'VIC1', n: ['Victoria', '维多利亚'],           mwh: 2508, revChangePct: 0 },
    { id: 'SA1',  n: ['South Australia', '南澳大利亚'],   mwh: 1288, revChangePct: 49 },
    { id: 'TAS1', n: ['Tasmania', '塔斯马尼亚'],         mwh: 91,   revChangePct: null },
  ],

  overall: { confidence: 64, codWindow: '2028–2030',
    rationale: ['The deepest storage build in the comparison set and the thinnest contracted revenue to underwrite it. There is no capacity market and there will not be one, so certainty has to be bought — through a CIS floor whose level nobody publishes, or a virtual toll whose price nobody discloses. Capital should be committed against a contracted structure and a diligenced connection point, not against a spread forecast.',
                '本对比样本中储能建设规模最深，而可用于承销的合同化收入最薄。这里没有容量市场，未来也不会有，因此确定性必须购买 — 或通过无人公布水平的CIS保底价，或通过无人披露价格的虚拟租赁。资本应基于合同结构与已尽调的并网点投入，而非基于价差预测。'] },

  // ---- merchant revenue: the ME BESS AUS NEM index, A$k/MW/yr ----
  idxLabels: ['CY2023', 'CY2024', 'CY2025', 'Oct 25 – Mar 26'],
  idxSeriesK: [102, 148, 128, 73],
  monLabels: ['Jan-26', 'Feb-26', 'Mar-26', 'Apr-26', 'May-26', 'Jun-26'],
  /* Jan, Feb, May and Jun are published points. March was reported as a record
     low at the time and April is an interpolation between the two sourced
     neighbours; both are illustrative and badged as such. */
  monSeriesK: [121, 54, 40, 33, 29, 35],

  /* Published spread → executable margin, A$/MWh discharged. The optimiser fee
     is deliberately NOT a step here: the model applies it once, as lab.optFee,
     and deducting it twice is the most common way this bridge is misread. */
  spreadBridge: [
    { l: ['Modelled charge/discharge spread at COD 2028', '2028年投运的模型充放电价差'], v: 130, t: 'start' },
    { l: ['Cap-contract and volatility premium capture', '价格上限合约与波动性溢价捕获'], v: 9, t: 'd' },
    { l: ['Five-minute dispatch execution and forecast error', '五分钟调度执行与预测误差'], v: -12, t: 'd' },
    { l: ['Round-trip efficiency loss (88%)', '往返效率损失(88%)'], v: -15, t: 'd' },
    { l: ['Availability and outages (96%)', '可用率与停机(96%)'], v: -6, t: 'd' },
    { l: ['Marginal loss factor and uncompensated curtailment (≈5%)', '边际损耗系数与无补偿限电(约5%)'], v: -6, t: 'd' },
    { l: ['Executable margin before the optimiser fee', '扣除优化商费用前的可执行价差'], v: 100, t: 'total' },
  ],
  /* Captured spread by COD year, A$/MWh. The central path is the lab seed
     multiplied by the dilution factor below, so the two never disagree. The
     range is wide because the realised index moved five-fold in two years. */
  codCases: { 2028: { low: 62, central: 100, high: 145 }, 2029: { low: 55, central: 90, high: 132 }, 2030: { low: 48, central: 80, high: 120 } },
  dilution: { 2028: 1.00, 2029: 0.90, 2030: 0.80 },

  // ---- FCAS ----
  /* The eight contingency markets plus regulation, grouped by response speed.
     No per-market A$/MW/yr series is published free of a paywall, so this table
     carries structure and battery fit rather than prices; the one sourced price
     movement is the Lower Contingency spike below. */
  fcasMarkets: [
    { id: 'R1 / L1',       n: ['Very fast raise / lower (1 s)', '极快速上调/下调（1秒）'],
      role: ['Introduced 2021 to replace inertia as synchronous plant retires', '2021年设立，用于在同步机组退役后替代惯量'],
      fit: ['High — inverter response, effectively a battery market', '高 — 逆变器响应，实际上是电池专属市场'] },
    { id: 'R6 / L6',       n: ['Fast contingency (6 s)', '快速事故备用（6秒）'],
      role: ['Arrests frequency immediately after a credible contingency', '在可信事故发生后立即遏制频率偏差'],
      fit: ['High — power-based, no meaningful energy draw', '高 — 功率型，几乎不消耗能量'] },
    { id: 'R60 / L60',     n: ['Slow contingency (60 s)', '慢速事故备用（60秒）'],
      role: ['Stabilises frequency after the fast service has acted', '在快速服务动作后稳定频率'],
      fit: ['High — still power-based', '高 — 仍属功率型'] },
    { id: 'R5 / L5',       n: ['Delayed contingency (5 min)', '延迟事故备用（5分钟）'],
      role: ['Restores frequency and releases the faster services', '恢复频率并释放更快速的服务'],
      fit: ['Moderate — begins to consume energy headroom', '中等 — 开始占用能量裕度'] },
    { id: 'RREG / LREG',   n: ['Regulation raise / lower', '调频上调/下调'],
      role: ['Continuous correction of normal operating deviation', '对正常运行偏差的持续修正'],
      fit: ['High on capability, but the enablement volume is small', '能力匹配度高，但启用量小'] },
  ],
  /* FCAS share of total battery revenue. Oct 2025 – Mar 2026 is the six-month
     Modo figure; Q2 2026 is AEMO's quarterly. Both are published. */
  fcasShareLabels: ['Oct 25 – Mar 26', 'Q2-26'],
  fcasShareSeries: [9, 8.3],
  evidenceLadder: [
    { n: ['1 · AEMO published dispatch and revenue data', '1 · AEMO公布的调度与收入数据'],
      d: ['Quarterly Energy Dynamics and the public dispatch data are observable and complete. This is the only tier that is fact.', '季度市场动态报告与公开调度数据可观察且完整。这是唯一属于事实的层级。'] },
    { n: ['2 · Connection-point outturn, not regional average', '2 · 并网点实际结果，而非区域平均'],
      d: ['A regional average conceals a marginal loss factor and a curtailment history that are specific to the node. Ask for the node.', '区域平均值掩盖了该节点特有的边际损耗系数与限电历史。应索取节点数据。'] },
    { n: ['3 · Reproducible optimiser backtest on this asset', '3 · 针对该资产的可复现优化器回测'],
      d: ['Third-party optimisation covers more than 800 MW of NEM storage, but no Australian fee or performance split is disclosed. Ask for the data, not the conclusion.', '第三方优化服务覆盖NEM超过800MW储能，但澳大利亚未披露任何费率或业绩分成。应索取数据本身而非结论。'] },
    { n: ['4 · Registration and FCAS market participation record', '4 · 注册与FCAS市场参与记录'],
      d: ['Registration is per market and per direction. A unit registered for contingency raise is not thereby registered for regulation.', '注册按市场与方向分别进行。已注册事故上调服务的机组并不因此获得调频服务资格。'] },
    { n: ['5 · Executed CIS agreement or virtual toll', '5 · 已签CIS协议或虚拟租赁'],
      d: ['The only tier that changes the risk profile rather than the estimate — and the only tier whose price is never published.', '唯一改变风险结构而非改变估算值的层级 — 也是唯一价格从不公布的层级。'] },
  ],

  // ---- capacity channel: the NEM has no capacity mechanism ----
  /* Flat at 1 and a zero future factor, exactly as Romania declares. Nothing in
     the NEM pays for de-rated megawatts, so nothing here may scale them. */
  deratingCurve: { 1: 1, 2: 1, 4: 1, 6: 1, 8: 1 },
  futureCapFactor: 0,

  // ---- duration ----
  /* Four hours across all three COD years. CIS Tender 8 was specified
     four-hour-equivalent and Tender 3 awarded fourteen four-hour projects out of
     sixteen; the archetype does not move within this window. */
  durationPath: { years: ['2028', '2029', '2030'], hours: [4, 4, 4] },
  durConfigs: [1, 2, 4, 6, 8],
  /* The 4h point is the measured one: a four-hour unit at Melbourne Renewable
     Energy Hub earned 96% of the A$/MWh of adjacent two-hour units across its
     first four months. comparison.js rounds the same observation to 0.95. The
     1h, 6h and 8h points are illustrative extrapolations. */
  durSpreadFactor: { 1: 1.06, 2: 1.00, 4: 0.96, 6: 0.86, 8: 0.78 },
  /* Usable energy as a fraction of nameplate. Distinct from the 0.91 that
     appears in comparison.js, which strips the FCAS share out of the revenue
     index and is not a state-of-charge window. */
  usableFraction: 0.92,
  /* 2h → 4h, A$k per nameplate MW per year, on this dashboard's own seed.
     Incremental capex is (A$1,540 − A$1,050)/kW = A$490/kW, annualised over a
     20-year life at 8% (annuity factor 0.1019) ≈ A$50k/MW/yr. */
  marginalHour: [
    { l: ['Incremental arbitrage — double the energy at 96% of the 2h capture rate', '增量套利 — 能量翻倍，捕获率为2小时的96%'], v: 83, t: 'd' },
    { l: ['FCAS — power-based, does not scale with duration', 'FCAS — 功率型，不随时长增长'], v: 0, t: 'd' },
    { l: ['Optimiser fee on the larger merchant line', '更大市场化收入对应的优化商费用'], v: -4, t: 'd' },
    { l: ['Capacity payment for duration — none exists in the NEM', '时长的容量付费 — NEM不存在'], v: 0, t: 'd' },
    { l: ['Annualised incremental capex (A$490/kW, 20 yr at 8%)', '年化增量资本开支（A$490/kW，20年，8%）'], v: -50, t: 'd' },
    { l: ['Degradation and incremental opex', '衰减与增量运维'], v: -3, t: 'd' },
    { l: ['Net marginal value, hours 3–4', '第3–4小时净边际价值'], v: 26, t: 'total' },
  ],
  durFactors: [
    { n: ['Solar-driven midday trough and negative-price intervals', '光伏驱动的午间低谷与负电价时段'], w: 20, s: 3 },
    { n: ['Evening ramp length and thermal retirement', '晚间爬坡时长与火电退役'], w: 15, s: 2 },
    { n: ['Realised 4h versus 2h project IRR gap', '4小时与2小时项目实际IRR差距'], w: 15, s: 3 },
    { n: ['4h capex premium over 2h and its trajectory', '4小时相对2小时的造价溢价及其轨迹'], w: 12, s: 2 },
    { n: ['Competing fleet duration lengthening', '竞争机组时长延长'], w: 10, s: 2 },
    { n: ['CIS tender specification (four-hour-equivalent)', 'CIS招标规格（四小时等效）'], w: 10, s: 2 },
    { n: ['FCAS does not pay for duration', 'FCAS不为时长付费'], w: 8, s: 1 },
    { n: ['Spread-capture decay at longer duration', '更长时长的价差捕获衰减'], w: 10, s: 2 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Shallow-shift market', '浅移峰市场'], c: 'info',
      d: ['1–2h suffices; MWh added beyond that is unpaid capital.', '1–2小时已足够；超出部分的MWh属无回报资本。'] },
    { lo: 35, hi: 54, n: ['2h merchant zone', '2小时市场化区间'], c: 'warn',
      d: ['Underwrite 2h; treat the third and fourth hours as option value only.', '按2小时测算；第三、第四小时仅作期权价值。'] },
    { lo: 55, hi: 69, n: ['Transition to 4h', '向4小时过渡'], c: 'serious',
      d: ['Build 4h only where the marginal-hour NPV clears without a contracted line.', '仅当边际小时NPV在无合同化收入的情况下仍为正时，才按4小时建设。'] },
    { lo: 70, hi: 100, n: ['4h+ duration-driven', '4小时以上时长驱动'], c: 'good',
      d: ['4h is the default new-build; test 6h and 8h against the incremental capex, not the headline IRR.', '4小时为新建默认设计；6小时与8小时须对照增量造价而非整体IRR检验。'] },
  ],
  augItems: [
    ['Land reserved for additional enclosures', '预留新增电池舱用地'],
    ['DC collection and containerised expansion capacity', '直流汇集与集装箱式扩容能力'],
    ['Transformer and switchgear headroom', '变压器与开关设备裕度'],
    ['PCS and EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['Connection agreement covers the added MWh without re-study', '并网协议覆盖新增MWh且无需重新研究'],
    ['Generator performance standards unchanged by augmentation', '增容不改变发电机组性能标准'],
    ['Planning and environmental approval headroom', '规划与环评许可裕度'],
    ['OEM / LTSA augmentation rights and warranty continuity', 'OEM/长期服务协议增容权利与质保延续'],
    ['CIS or toll counterparty consent to augmentation', 'CIS或租赁交易对手对增容的同意'],
  ],
  augDefaults: [2, 2, 1, 2, 1, 1, 1, 1, 1],

  // ---- pipeline ----
  /* The probability step that matters is `cis`. Only 28% of battery capacity
     awarded a CIS agreement before Tender 3 had reached a financial-investment
     decision at that time, which is why an executed CIS agreement is scored well
     below construction and not far above a fully permitted project. */
  stages: [
    { id: 'op',   n: ['Operating and dispatching', '已投运并参与调度'], p: 100 },
    { id: 'comm', n: ['Commissioning / hold-point testing', '调试中/节点测试'], p: 92 },
    { id: 'con',  n: ['Under construction, financial close reached', '在建，已融资交割'], p: 88 },
    { id: 'cis',  n: ['CIS agreement executed, pre-FID', '已签CIS协议，未作最终投资决策'], p: 60 },
    { id: 'gps',  n: ['Connection agreement and generator performance standards agreed', '已签并网协议并商定发电机组性能标准'], p: 45 },
    { id: 'app',  n: ['Connection application lodged, in the AEMO queue', '已提交并网申请，处于AEMO排队中'], p: 15 },
    { id: 'ann',  n: ['Announced only', '仅公告'], p: 6 },
  ],
  projects: [
    { n: 'NEM seed example A', region: 'NSW1', mw: 150, h: 2, cod: 2027, st: 'op' },
    { n: 'NEM seed example B', region: 'VIC1', mw: 200, h: 4, cod: 2027, st: 'comm' },
    { n: 'NEM seed example C', region: 'QLD1', mw: 250, h: 4, cod: 2027, st: 'con' },
    { n: 'NEM seed example D', region: 'NSW1', mw: 280, h: 4, cod: 2028, st: 'con' },
    { n: 'NEM seed example E', region: 'NSW1', mw: 300, h: 4, cod: 2028, st: 'cis' },
    { n: 'NEM seed example F', region: 'SA1',  mw: 120, h: 4, cod: 2028, st: 'cis' },
    { n: 'NEM seed example G', region: 'VIC1', mw: 350, h: 4, cod: 2029, st: 'cis' },
    { n: 'NEM seed example H', region: 'QLD1', mw: 400, h: 4, cod: 2029, st: 'gps' },
    { n: 'NEM seed example I', region: 'NSW1', mw: 500, h: 8, cod: 2029, st: 'gps' },
    { n: 'NEM seed example J', region: 'TAS1', mw: 80,  h: 4, cod: 2030, st: 'app' },
    { n: 'NEM seed example K', region: 'VIC1', mw: 600, h: 4, cod: 2030, st: 'app' },
    { n: 'NEM seed example L', region: 'QLD1', mw: 450, h: 2, cod: 2030, st: 'ann' },
  ],

  // ---- connection ----
  /* Higher score = higher risk, as in RO and PL. Weights sum to 100 and the
     weighted score is 46, which is the figure comparison.js carries as
     `score.connectionRisk`. */
  connFactors: [
    { n: ['Connection application lodged and AEMO registration pathway', '已提交并网申请及AEMO注册路径'], w: 10, s: 1 },
    { n: ['Generator performance standards negotiated and accepted', '发电机组性能标准已商定并获接受'], w: 10, s: 2 },
    { n: ['Marginal loss factor history at the connection point', '并网点边际损耗系数历史'], w: 14, s: 2 },
    { n: ['Uncompensated network curtailment exposure', '无补偿网络限电敞口'], w: 15, s: 2 },
    { n: ['REZ access scheme round and allocated MW', '可再生能源区接入机制轮次与分配MW'], w: 10, s: 1 },
    { n: ['System strength and inverter compliance obligations', '系统强度与逆变器合规义务'], w: 10, s: 1 },
    { n: ['Land, planning and environmental approvals', '土地、规划与环评许可'], w: 8, s: 1 },
    { n: ['Commissioning hold points and full-output release', '调试节点与满出力释放'], w: 9, s: 1 },
    { n: ['Market and FCAS registration per market and direction', '按市场与方向分别完成市场及FCAS注册'], w: 9, s: 1 },
    { n: ['Evidence and governance quality', '证据与治理质量'], w: 5, s: 1 },
  ],
  connBands: [
    { lo: 0, hi: 24, n: ['Connection-investable', '可投资并网状态'], c: 'good',
      d: ['Evidence is sufficient to release development consideration.', '证据充分，可支付开发对价。'] },
    { lo: 25, hi: 44, n: ['Conditional — require CPs & holdbacks', '有条件 — 需先决条件与保留款'], c: 'warn',
      d: ['Structure the risk: conditions precedent, holdbacks, long-stop dates.', '以结构应对风险：先决条件、保留款、最终截止日。'] },
    { lo: 45, hi: 64, n: ['Material risk — re-price / defer', '重大风险 — 重新定价或延后'], c: 'serious',
      d: ['Re-price or defer until performance standards are agreed and the loss-factor history is in hand.', '在性能标准商定且取得损耗系数历史之前，重新定价或延后。'] },
    { lo: 65, hi: 100, n: ['Not investment-ready', '不具备投资条件'], c: 'critical',
      d: ['Do not commit capital; the connection chain is unproven.', '不得投入资本；并网链条尚未证实。'] },
  ],

  /* ---- the 2026 ISP optimal development path, project by project ----------
     Transcribed from AEMO's 2026 ISP Appendix A5 "Network Investments" (June
     2026), which is the project-level authority: the ISP body and the explainer
     map show status by colour only.

     `cls` is AEMO's own classification, not a judgement. It is what makes the
     table underwritable — "actionable" is a regulatory instruction to start a
     RIT-T, not a funded project, and the difference is the entire point of the
     register. Five jurisdictional variants exist (actionable ISP, NSW, Qld, Vic)
     and are kept distinct because they proceed under different statutes.

     `year` is the proponent-advised or Step Change in-service year and drives
     sorting; `earliest` is A5's earliest in-service date where it publishes one
     separately, and is null where it does not. `capexAM` is the A5 reported cost
     in A$ million ($2025), null where A5 reports none — committed and anticipated
     projects are outside the ISP cost-benefit analysis and carry no ISP cost. */
  ispProjects: [
    // ---- committed (4) ----
    { n: ['Project EnergyConnect Stage 2', 'Project EnergyConnect二期'], operator: 'ElectraNet / Transgrid', region: 'SA–NSW',
      cls: 'committed', scope: ['900 km SA–NSW interconnector; Stage 2 lifts transfer to 800 MW both ways', '900公里南澳—新南威尔士互联线；二期将输送能力提升至双向800MW'],
      mw: 650, capexAM: null, year: 2027, earliest: null,
      status: ['Stage 1 (150 MW) done late 2024; Stage 2 in service Nov 2027', '一期（150MW）已于2024年底完成；二期2027年11月投运'], c: 'warn' },
    { n: ['HumeLink', 'HumeLink输电工程'], operator: 'Transgrid', region: 'NSW',
      cls: 'committed', scope: ['365 km of 500 kV, Snowy and PEC to Bannaby; unlocks 3 GW incl. 2,200 MW of Snowy 2.0', '365公里500千伏线路，连接雪山与PEC至Bannaby；释放3GW，含雪山2.0的2,200MW'],
      mw: null, capexAM: null, year: 2027, earliest: null,
      status: ['Under construction; completion December 2027', '在建；2027年12月完工'], c: 'warn' },
    { n: ['Hunter-Central Coast REZ Network Infrastructure', '猎人—中央海岸REZ网络基础设施'], operator: 'Ausgrid / EnergyCo NSW', region: 'NSW',
      cls: 'committed', scope: ['132 kV upgrades Kurri to Muswellbrook in three portions; supports up to 1,800 MW of projects', 'Kurri至Muswellbrook的132千伏升级，分三部分；支持最多1,800MW项目'],
      mw: 600, capexAM: null, year: 2028, earliest: null,
      status: ['Actionable NSW in the 2024 ISP; committed for the final 2026 ISP', '2024年ISP中为新州可行动项目；2026年终版ISP中转为已承诺'], c: 'warn' },
    { n: ['Central-West Orana REZ Network Infrastructure', '中西部奥拉纳REZ网络基础设施'], operator: 'ACEREZ / EnergyCo NSW', region: 'NSW',
      cls: 'committed', scope: ['4,500 MW of REZ network capacity; 7.15 GW of access rights awarded against a 7.7 GW maximum', '4,500MW的REZ网络容量；已授出7.15GW接入权，上限7.7GW'],
      mw: 4500, capexAM: null, year: 2028, earliest: null,
      status: ['Construction began June 2025; energisation December 2028', '2025年6月开工；2028年12月送电'], c: 'warn' },

    // ---- anticipated (4) ----
    { n: ['Western Renewables Link', '西部可再生能源联络线'], operator: 'AusNet / VicGrid', region: 'VIC',
      cls: 'anticipated', scope: ['500 kV double-circuit Bulgana to Sydenham; harnesses 1,460 MW after the rescope', 'Bulgana至Sydenham的500千伏双回线；调整范围后可承载1,460MW'],
      mw: null, capexAM: null, year: 2029, earliest: null,
      status: ['Anticipated; expected completion November 2029', '预期项目；预计2029年11月完工'], c: 'warn' },
    { n: ['Project Marinus Stage 1', 'Marinus项目一期'], operator: 'Marinus Link Pty Ltd / TasNetworks', region: 'TAS–VIC',
      cls: 'anticipated', scope: ['750 MW HVDC monopole Burnie to Hazelwood, plus the North West Transmission Developments', 'Burnie至Hazelwood的750MW高压直流单极，以及西北输电工程'],
      mw: 750, capexAM: null, year: 2030, earliest: null,
      status: ['FID 1 August 2025; anticipated, in service December 2030', '2025年8月1日最终投资决策；预期项目，2030年12月投运'], c: 'serious' },
    { n: ['CopperString', 'CopperString'], operator: 'Powerlink / Queensland Government', region: 'QLD',
      cls: 'anticipated', scope: ['~840 km to the North-West Minerals Province; Townsville–Hughenden section modelled, +1,400 MW at Hughenden', '约840公里通往西北矿产区；建模范围为Townsville—Hughenden段，Hughenden增加1,400MW'],
      mw: 1400, capexAM: null, year: 2032, earliest: '2031',
      status: ['Anticipated; in-service date revised from June 2031 to 2032', '预期项目；投运日期由2031年6月修订为2032年'], c: 'serious' },
    { n: ['New England REZ Network Infrastructure', '新英格兰REZ网络基础设施'], operator: 'EnergyCo NSW', region: 'NSW',
      cls: 'anticipated', scope: ['500 kV and 330 kV between central and northern NSW; 6,000 MW both directions', '新州中部至北部的500千伏与330千伏线路；双向6,000MW'],
      mw: 6000, capexAM: null, year: 2034, earliest: null,
      status: ['Actionable in the 2024 ISP; anticipated for 2026, delivery January 2034', '2024年ISP中为可行动项目；2026年转为预期项目，2034年1月交付'], c: 'serious' },

    // ---- actionable (12) ----
    { n: ['Gladstone Project', 'Gladstone项目'], operator: 'Powerlink', region: 'QLD',
      cls: 'actionable-qld', scope: ['CQ–Gladstone Option 2: new Gladstone West 275 kV switching station and Calvale–Calliope River line', '中昆士兰—Gladstone方案2：新建Gladstone West 275千伏开关站及Calvale—Calliope River线路'],
      mw: 2600, capexAM: 2367, year: 2029, earliest: null,
      status: ['Priority Transmission Investment; line March 2029, balance by mid-2030', '优先输电投资；线路2029年3月，其余2030年年中前完成'], c: 'warn' },
    { n: ['Western Victoria Reinforcement', '西维多利亚加强工程'], operator: 'VicGrid', region: 'VIC',
      cls: 'actionable-vic', scope: ['MEL–WNV Option 1; 800 MW of reverse transfer into western and northern Victoria', 'MEL—WNV方案1；向维州西部及北部增加800MW反向输送'],
      mw: 800, capexAM: 128, year: 2029, earliest: null,
      status: ['New actionable project under the Victorian Transmission Investment Framework', '维多利亚输电投资框架下的新增可行动项目'], c: 'warn' },
    { n: ['VNI West — South West NSW REZ', 'VNI West — 新州西南REZ'], operator: 'Transgrid / EnergyCo NSW', region: 'NSW',
      cls: 'actionable-nsw', scope: ['Stage 1: Dinawan–Wagga–Gugaa uprated to 500 kV, Dinawan 500 kV switchyard; +600 MW at N5', '一期：Dinawan—Wagga—Gugaa升压至500千伏，新建Dinawan 500千伏开关站；N5增加600MW'],
      mw: 600, capexAM: 7600, year: 2029, earliest: null,
      status: ['Split from the interconnector in the final ISP; REZ scope August 2029', '终版ISP中与互联线拆分；REZ部分2029年8月'], c: 'warn' },
    { n: ['Sydney Ring North (Hunter Transmission Project)', '悉尼环网北段（猎人输电项目）'], operator: 'EnergyCo NSW / Transgrid', region: 'NSW',
      cls: 'actionable-nsw', scope: ['CNSW–SNW Option 1: 500 kV double-circuit Olney to Bayswater; 5,000 MW forward', '中新州—SNW方案1：Olney至Bayswater的500千伏双回线；正向5,000MW'],
      mw: 5000, capexAM: 1364, year: 2029, earliest: null,
      status: ['Actionable in the 2024 ISP and still actionable; November 2029', '2024年ISP中即为可行动项目并延续；2029年11月'], c: 'warn' },
    { n: ['Tasmania REZ Expansion', '塔斯马尼亚REZ扩容'], operator: 'TasNetworks', region: 'TAS',
      cls: 'actionable', scope: ['Burnie–Hampshire Hills 220 kV double-circuit; 800 MW to support the Tasmanian Renewable Energy Target', 'Burnie—Hampshire Hills 220千伏双回线；800MW，支撑塔州可再生能源目标'],
      mw: 800, capexAM: 245, year: 2030, earliest: null,
      status: ['New actionable ISP project; replaces the Second Tasmania REZ Expansion', '新增可行动ISP项目；取代塔州第二REZ扩容'], c: 'warn' },
    { n: ['Switching Station Near Wondalga', 'Wondalga附近开关站'], operator: 'Transgrid', region: 'NSW',
      cls: 'actionable', scope: ['SNSW–CNSW Option 5: switching station at the Y point of the 3 x 330 kV lines; 450 MW both ways', '新州南部—中部方案5：三回330千伏线路Y点处开关站；双向450MW'],
      mw: 450, capexAM: 220, year: 2031, earliest: '2030',
      status: ['New actionable ISP project; April 2031 against a December 2030 earliest date', '新增可行动ISP项目；2031年4月，最早日期为2030年12月'], c: 'warn' },
    { n: ['Central to North Queensland Reinforcement (Stage 1)', '中昆士兰至北昆士兰加强工程（一期）'], operator: 'Powerlink', region: 'QLD',
      cls: 'actionable', scope: ['CQ–NQ Option 3: second Stanwell–Broadsound 275 kV circuit; 350 MW forward, 500 MW reverse', '中昆—北昆方案3：Stanwell—Broadsound第二回275千伏线路；正向350MW、反向500MW'],
      mw: 350, capexAM: 209, year: 2031, earliest: '2029',
      status: ['New actionable ISP project; replaces the larger Queensland SuperGrid North', '新增可行动ISP项目；取代规模更大的昆士兰超级电网北段'], c: 'warn' },
    { n: ['Gippsland Offshore Wind Transmission', '吉普斯兰海上风电输电工程'], operator: 'VicGrid', region: 'VIC',
      cls: 'actionable-vic', scope: ['500 kV radial lines from a new terminal station near Woodside; +2,000 MW at REZ V8, staged 2031/2033/2038', '自Woodside附近新终端站引出的500千伏放射状线路；V8可再生能源区增加2,000MW，分2031/2033/2038三期'],
      mw: 2000, capexAM: 1500, year: 2031, earliest: null,
      status: ['New actionable Victoria project; first stage July 2031', '维州新增可行动项目；首期2031年7月'], c: 'warn' },
    { n: ['VNI West — Victoria–NSW interconnector', 'VNI West — 维州—新州互联线'], operator: 'VicGrid / Transgrid', region: 'VIC–NSW',
      cls: 'actionable', scope: ['Stage 2: 500 kV Bulgana–Tragowel–Dinawan; 1,890 MW forward, 1,670 MW reverse', '二期：Bulgana—Tragowel—Dinawan的500千伏线路；正向1,890MW、反向1,670MW'],
      mw: 1890, capexAM: 7600, year: 2031, earliest: null,
      status: ['Interconnector scope retains actionable ISP status; November 2031', '互联线部分保留可行动ISP地位；2031年11月'], c: 'serious' },
    { n: ['Brisbane Area 275 kV Reinforcement', '布里斯班地区275千伏加强工程'], operator: 'Powerlink', region: 'QLD',
      cls: 'actionable', scope: ['SQ–CQ Option 7; 685 MW forward from south-east to central Queensland', '南昆—中昆方案7；由昆士兰东南向中部正向输送685MW'],
      mw: 685, capexAM: 63, year: 2032, earliest: null,
      status: ['New actionable ISP project after revised Powerlink advice', 'Powerlink修订意见后新增的可行动ISP项目'], c: 'warn' },
    { n: ['Central-West Orana REZ Expansion', '中西部奥拉纳REZ扩容'], operator: 'EnergyCo NSW', region: 'NSW',
      cls: 'actionable-nsw', scope: ['N3 Option 1; further expansion of the committed CWO REZ network', 'N3方案1；在已承诺的CWO REZ网络基础上进一步扩容'],
      mw: null, capexAM: 855, year: 2033, earliest: null,
      status: ['Progressed from a future project to actionable NSW in the final ISP', '终版ISP中由未来项目升级为新州可行动项目'], c: 'warn' },
    { n: ['Sydney Ring South', '悉尼环网南段'], operator: 'Transgrid', region: 'NSW',
      cls: 'actionable', scope: ['Both options now actionable: power flow control (A$261m) and the 500 kV line, 3,600 MW forward', '两个方案均转为可行动：潮流控制装置（A$2.61亿）与500千伏线路，正向3,600MW'],
      mw: 3600, capexAM: 2360, year: 2033, earliest: null,
      status: ['Modified from the Draft 2026 ISP: the 500 kV option moved from future to actionable', '相较2026年ISP草案有调整：500千伏方案由未来项目转为可行动'], c: 'serious' },
    { n: ['Project Marinus Stage 2', 'Marinus项目二期'], operator: 'Marinus Link Pty Ltd', region: 'TAS–VIC',
      cls: 'actionable', scope: ['TAS–SEV Option 2A: a second 750 MW HVDC monopole Burnie to Hazelwood', 'TAS—SEV方案2A：Burnie至Hazelwood的第二条750MW高压直流单极'],
      mw: 750, capexAM: 2485, year: 2034, earliest: null,
      status: ['Reassessed as actionable for the 2026 ISP; December 2034', '2026年ISP中重新评定为可行动；2034年12月'], c: 'serious' },

    // ---- future ISP projects (7) ----
    { n: ['South West to South East Queensland Reinforcement', '昆士兰西南至东南加强工程'], operator: 'Powerlink', region: 'QLD',
      cls: 'future', scope: ['SWQLD1: transformer replacement at Middle Ridge, or a 300 MW BESS run-back scheme as a virtual transmission line', 'SWQLD1：Middle Ridge变压器更换，或以300MW储能回退方案作为虚拟输电线路'],
      mw: 150, capexAM: 26, year: 2041, earliest: '2028-29',
      status: ['Future ISP project; Step Change 2041-42, earliest 2028-29', '未来ISP项目；阶跃变革情景2041-42年，最早2028-29年'], c: 'serious' },
    { n: ['Eastern Victoria Reinforcement', '东维多利亚加强工程'], operator: 'VicGrid', region: 'VIC',
      cls: 'future', scope: ['SEV–MEL Option 1; 1,000 MW forward into Melbourne after the Yallourn closure', 'SEV—MEL方案1；Yallourn关停后向墨尔本正向输送1,000MW'],
      mw: 1000, capexAM: 70, year: 2033, earliest: '2031-32',
      status: ['Future ISP project; Accelerated Transition 2033-34', '未来ISP项目；加速转型情景2033-34年'], c: 'serious' },
    { n: ['Second Tasmania REZ Expansion', '塔斯马尼亚第二REZ扩容'], operator: 'TasNetworks', region: 'TAS',
      cls: 'future', scope: ['Formerly the Waddamana to Palmerston transfer capability upgrade, in the Central Highlands REZ', '原Waddamana至Palmerston输送能力升级工程，位于中部高地REZ'],
      mw: null, capexAM: null, year: 2034, earliest: null,
      status: ['Was actionable; now a future project needed only under one scenario', '原为可行动项目；现为仅在单一情景下需要的未来项目'], c: 'serious' },
    { n: ['Northern Transmission Project', '北部输电项目'], operator: 'ElectraNet', region: 'SA',
      cls: 'future', scope: ['MN1 Option 2 "South": 275 kV Bundey to near Bolivar/Dry Creek; 1,200 MW', 'MN1方案2“南线”：Bundey至Bolivar/Dry Creek附近的275千伏线路；1,200MW'],
      mw: 1200, capexAM: 1429, year: 2041, earliest: null,
      status: ['Was actionable; deferred to a future project, but the ElectraNet RIT-T should conclude', '原为可行动项目；已推迟为未来项目，但ElectraNet的RIT-T应当完成'], c: 'critical' },
    { n: ['Central to North Queensland Reinforcement (Stage 2)', '中昆士兰至北昆士兰加强工程（二期）'], operator: 'Powerlink', region: 'QLD',
      cls: 'future', scope: ['CQ–NQ Option 4; 500 MW forward, 1,000 MW reverse from northern Queensland', '中昆—北昆方案4；自北昆士兰正向500MW、反向1,000MW'],
      mw: 500, capexAM: 1850, year: 2042, earliest: '2033-34',
      status: ['New future ISP project; Step Change 2042-43, Accelerated Transition 2035-36', '新增未来ISP项目；阶跃变革2042-43年，加速转型2035-36年'], c: 'serious' },
    { n: ['QNI Connect', 'QNI Connect'], operator: 'Powerlink / Transgrid', region: 'QLD–NSW',
      cls: 'future', scope: ['NNSW–SQ Option 2; 1,260 MW forward, connecting into the New England REZ project', '新州北部—南昆方案2；正向1,260MW，接入新英格兰REZ项目'],
      mw: 1260, capexAM: 2989, year: 2041, earliest: '2033-34',
      status: ['Was actionable; identified need deferred almost a decade to the mid-2040s', '原为可行动项目；识别需求推迟近十年至2040年代中期'], c: 'critical' },
    { n: ['South West Victoria Expansion', '西南维多利亚扩容'], operator: 'VicGrid', region: 'VIC',
      cls: 'future', scope: ['MEL–WNV Option 3; 500 kV Moorabool to Truganina to Sydenham; 2,000 MW reverse', 'MEL—WNV方案3；Moorabool—Truganina—Sydenham的500千伏线路；反向2,000MW'],
      mw: 2000, capexAM: 1330, year: 2045, earliest: '2033-34',
      status: ['Future ISP project; Step Change 2045-46', '未来ISP项目；阶跃变革情景2045-46年'], c: 'serious' },

    // ---- distribution projects (2) ----
    { n: ['Hunter-Central Coast REZ Expansion', '猎人—中央海岸REZ扩容'], operator: 'Ausgrid / EnergyCo NSW', region: 'NSW',
      cls: 'distribution', scope: ['N9b Option 2a and N9a Option 2b; 132 kV and 330 kV uplifts around Singleton, Newcastle and Muswellbrook', 'N9b方案2a与N9a方案2b；Singleton、Newcastle及Muswellbrook周边132千伏与330千伏提升'],
      mw: 900, capexAM: 636, year: 2030, earliest: '2030-31',
      status: ['New to the ODP; beneficial in all three scenarios', '新纳入最优发展路径；在三种情景下均有效益'], c: 'warn' },
    { n: ['Dubbo Distribution Project', 'Dubbo配电项目'], operator: 'Essential Energy / Transgrid / EnergyCo NSW', region: 'NSW',
      cls: 'distribution', scope: ['DN1 Option 1; 700 MW of continuous export to the 330 kV system, unlocking 2.4 GW of connections', 'DN1方案1；向330千伏系统持续送出700MW，释放2.4GW并网容量'],
      mw: 700, capexAM: 607, year: 2032, earliest: null,
      status: ['Distribution network development opportunity; Step Change 2032-33', '配电网发展机会；阶跃变革情景2032-33年'], c: 'warn' },
  ],

  /* AEMO's own status vocabulary, defined once so the register's chips and the
     km-by-class chart cannot drift apart. `km` is the A5 §A5.1.1 Step Change
     length by class; `prevKm` is the same figure in the 2024 ISP. */
  ispClasses: [
    { id: 'committed',      n: ['Committed', '已承诺'],            c: 'good',
      d: ['Meets all five criteria on planning, construction, land, contracts and financing. Outside the ISP cost-benefit analysis: assumed to proceed.', '满足规划、施工、土地、合同与融资五项标准。不纳入ISP成本效益分析：假定必然推进。'] },
    { id: 'anticipated',    n: ['Anticipated', '预期'],            c: 'warn',
      d: ['Meets at least three of the five committed criteria. Also assumed to proceed, on one fewer piece of evidence.', '满足五项已承诺标准中的至少三项。同样假定推进，但证据少一项。'] },
    { id: 'actionable',     n: ['Actionable ISP', '可行动ISP'],     c: 'warn',
      d: ['The proponent must start a RIT-T on publication of the final ISP. An instruction to begin a regulatory test, not a funded project.', '发起人须在终版ISP发布时启动RIT-T。这是启动监管测试的指令，而非已获资金的项目。'] },
    { id: 'actionable-nsw', n: ['Actionable NSW', '可行动（新州）'], c: 'warn',
      d: ['Proceeds under the Electricity Infrastructure Investment Act 2020 (NSW) rather than the National Electricity Rules.', '依《2020年电力基础设施投资法》（新州）推进，而非依《国家电力规则》。'] },
    { id: 'actionable-qld', n: ['Actionable Qld', '可行动（昆州）'], c: 'warn',
      d: ['Proceeds under the Energy (Infrastructure Facilitation) Act 2024 (Qld).', '依《2024年能源（基础设施促进）法》（昆州）推进。'] },
    { id: 'actionable-vic', n: ['Actionable Vic', '可行动（维州）'], c: 'warn',
      d: ['Proceeds under the Victorian Transmission Investment Framework.', '依维多利亚输电投资框架推进。'] },
    { id: 'future',         n: ['Future ISP', '未来ISP'],          c: 'serious',
      d: ['On the optimal development path and beneficial under at least one scenario, but not needed until later. No RIT-T required yet.', '属最优发展路径且在至少一种情景下有效益，但短期内并不需要。尚无须启动RIT-T。'] },
    { id: 'distribution',   n: ['Distribution', '配电'],           c: 'info',
      d: ['Delivered in the distribution network to connect utility-scale generation and storage more cheaply than a transmission solution.', '在配电网层面交付，以低于输电方案的成本接入公用事业级发电与储能。'] },
  ],

  /* ---- coverage gaps, rendered verbatim on the Data & Methodology tab ----
     Not a caveat list. Each row is a number this dashboard is asked for and
     cannot supply, with what it uses instead. */
  notPublished: [
    { item: ['CIS floor, ceiling and annual payment cap', 'CIS保底价、上限与年度支付上限'],
      status: ['Never published, for any project', '从未公布，任何项目均无'],
      why: ['All three are bidder-submitted and commercial-in-confidence. The Nelson Review\'s recommendation that the successor ESEM should publish its clearing prices is the clearest confirmation that this scheme does not.',
            '三者均由投标人提交且属商业机密。Nelson评估建议后继的ESEM应公布其出清价格 — 这最清楚地印证了现行计划并不公布。'],
      instead: ['A bracket: a debt-and-opex build-up at one end and the NSW LTESA Round 6 annuity cap at the other. See comparison.js.',
                '采用区间估计：一端为债务与运维成本推算，另一端为新南威尔士LTESA第6轮年金上限。详见comparison.js。'] },
    { item: ['Australian BESS toll prices', '澳大利亚储能租赁价格'],
      status: ['Never disclosed, for any deal', '从未披露，任何交易均无'],
      why: ['Snowy Hydro / Akaysha at Elaine, EnergyAustralia / Akaysha at Orana, Pacific Green / ZEN, Akaysha / Gunvor, AGL at Western Downs and Snowy Hydro / BHP were all announced without a price.',
            'Snowy Hydro与Akaysha的Elaine项目、EnergyAustralia与Akaysha的Orana项目、Pacific Green与ZEN、Akaysha与Gunvor、AGL的Western Downs项目以及Snowy Hydro与BHP的交易，公告时均未披露价格。'],
      instead: ['Tenors are disclosed and are used directly (12 and 15 years). Price is bracketed between a risk-discounted merchant level and the LTESA cap.',
                '期限已披露并直接采用（12年与15年）。价格则在风险折价后的市场化收入水平与LTESA上限之间取区间。'] },
    { item: ['Optimiser fees', '优化商费用'],
      status: ['No Australian disclosure', '澳大利亚无任何披露'],
      why: ['Third-party optimisation covers more than 800 MW of NEM storage and not one fee has been published.',
            '第三方优化服务覆盖NEM超过800MW储能，却无一笔费率被公布。'],
      instead: ['The reported generic revenue-share band of 3–10%, held at its 5% midpoint.',
                '采用公开的通用收益分成区间3–10%，取其中值5%。'] },
    { item: ['Fixed operating cost per MW per year', '每MW每年固定运营成本'],
      status: ['Not extractable from the authoritative source', '无法从权威来源中提取'],
      why: ['GenCost carries fixed O&M in an appendix workbook rather than in extractable report text, so no authoritative NEM figure is in hand.',
            'GenCost将固定运维成本置于附录工作簿而非可提取的报告正文中，因此暂无权威的NEM数据。'],
      instead: ['A$20,000/MW/yr, about 1.3% of capex, covering the long-term service agreement, insurance, land and market fees.',
                '采用A$20,000/MW/年，约为造价的1.3%，涵盖长期服务协议、保险、土地及市场费用。'] },
    { item: ['Regional A$/MW/yr revenue levels', '各区域每MW每年收入水平'],
      status: ['Paywalled', '需付费获取'],
      why: ['Only NEM-wide revenue levels and regional percentage changes are public. The regional levels behind those percentages are not.',
            '仅全NEM收入水平与各区域百分比变化为公开信息，其背后的区域绝对水平并不公开。'],
      instead: ['NEM-wide levels for the model, regional percentage changes for direction — and no regional level is asserted anywhere on this dashboard.',
                '模型采用全NEM水平，方向判断采用各区域百分比变化 — 本看板任何位置均不主张区域绝对水平。'] },
    { item: ['Post-contract re-contracting levels', '合同到期后的续约水平'],
      status: ['No observation exists yet', '尚无任何观测值'],
      why: ['No Australian long-term storage contract has yet expired, so there is no evidence of what a second-term price looks like.',
            '澳大利亚尚无长期储能合同到期，因此不存在关于第二期价格水平的任何证据。'],
      instead: ['comparison.js sets postFactor to 0 and reverts tolled assets to merchant. That is a declaration of ignorance, not a forecast of zero.',
                'comparison.js将postFactor设为0，并使租赁资产回归市场化。这是对未知的声明，而非对零值的预测。'] },
  ],

  lab: {
    /* ---- capital structure. Seeded neutral: nothing here moves a published
       return until it is set. VAT is recoverable, so it costs only timing, and
       the Lab leaves the refund lag to the engine. */
    vatPct: 10, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
    /* 280 MW is the CIS Tender 8 average (4,205 MW across 15 projects), which is
       also comparison.js's archetype. capexKWh 245 + capexKW 560 reproduces
       GenCost's A$385/kWh four-hour point at A$1.54m/MW. */
    mw: 280, hours: 4, capexKWh: 245, capexKW: 560, opexKW: 20,
    rte: 88, avail: 96, degr: 2.0, cycles: 1.4, spread: 100, optFee: 5,
    /* Zero, and structurally so: the NEM has no capacity mechanism. */
    capPrice: 0, capYrs: 0, servicesKW: 9, grantPct: 0,
    life: 20, disc: 8, debtPct: 60, rate: 7.0, tenor: 15,
  },

  /* ---- peer namespace: Western Australia's WEM (context only, never scored) ----
     Held here on the same terms Romania holds Poland. Source values are read
     across from src/markets/wa/comparison.js and src/markets/wa/congestion.js. */
  peer: {
    name: ['Western Australia — Wholesale Electricity Market', '西澳 — 批发电力市场'],
    asOf: 'Aug 2026',
    rcmPricePerMW: 422372, rcmElectionYears: 10,
    archetypeMW: 200, archetypeHours: 7,
    capexPerMW: 3640000, capexPerKWh: 520, opexPerMW: 18000,
    merchGross: 139000, services: 12000, naqFactor: 0.90,
    /* Stated as sourced: WEM capital cost runs about 67% higher per kW than the
       NEM. The two dashboards' own per-kWh figures — A$520 against A$385 — give
       35% on an energy basis, so the bases differ and both are shown. */
    capexPremiumPerKWPct: 67,
    congestionInstrument: ['Network Access Quantities, settled in capacity accreditation',
                           '网络接入量，以容量认定方式结算'],
  },

  glossary: [
    ['National Electricity Market (NEM)', '国家电力市场（NEM）'],
    ['Energy-only market', '单一电能量市场'],
    ['AEMO (market and system operator)', 'AEMO（市场与系统运营方）'],
    ['AEMC (rule maker)', 'AEMC（规则制定机构）'],
    ['AER (economic regulator)', 'AER（经济监管机构）'],
    ['Regional reference price / regional reference node', '区域参考电价/区域参考节点'],
    ['Marginal loss factor (MLF)', '边际损耗系数（MLF）'],
    ['Capacity Investment Scheme (CIS)', '容量投资计划（CIS）'],
    ['CIS revenue floor / ceiling / annual payment cap', 'CIS收入保底价/上限/年度支付上限'],
    ['Electricity Services Entry Mechanism (ESEM)', '电力服务准入机制（ESEM）'],
    ['Long-Term Energy Service Agreement (LTESA)', '长期能源服务协议（LTESA）'],
    ['Annuity cap and net revenue threshold', '年金上限与净收入门槛'],
    ['Virtual toll', '虚拟租赁'],
    ['Cap contract ($300/MWh)', '价格上限合约（$300/MWh）'],
    ['FCAS — contingency and regulation', 'FCAS — 事故备用与调频'],
    ['Grid-forming inverter', '构网型逆变器'],
    ['System strength remediation', '系统强度补救'],
    ['Generator performance standards (GPS)', '发电机组性能标准（GPS）'],
    ['Renewable Energy Zone (REZ) access scheme', '可再生能源区接入机制'],
    ['Constrained off — no compensation, no firm rights', '受约束停机 — 无补偿、无固定权利'],
    ['Congestion Relief Market (not proceeding)', '拥塞缓解市场（不予推行）'],
    ['Integrated System Plan (ISP)', '综合系统规划（ISP）'],
    ['Reserve Capacity Mechanism (WEM peer term)', '备用容量机制（WEM同业术语）'],
  ],

  kpiExport: [
    ['CIS Tender 8 awarded storage power', 4205, 'MW', 'official', 'NEM_SEED_V1', 'DCCEEW'],
    ['CIS Tender 8 awarded storage energy', 16074, 'MWh', 'official', 'NEM_SEED_V1', 'DCCEEW'],
    ['CIS Tender 3 awarded storage power', 4130, 'MW', 'official', 'NEM_SEED_V1', 'DCCEEW'],
    ['CIS floor / ceiling / payment cap', 'not published', '-', 'coverage gap', 'NEM_SEED_V1', 'DCCEEW — commercial-in-confidence'],
    ['CIS shortfall share paid below the floor', 90, '%', 'official', 'NEM_SEED_V1', 'DCCEEW'],
    ['CIS revenue share taken above the ceiling', 50, '%', 'official', 'NEM_SEED_V1', 'DCCEEW'],
    ['NSW LTESA Round 6 average annuity cap', 150000, 'AUD/MW/yr', 'official', 'NEM_SEED_V1', 'NSW Electricity Infrastructure Roadmap'],
    ['NSW LTESA Round 5 average annuity cap', 185000, 'AUD/MW/yr', 'official', 'NEM_SEED_V1', 'NSW Electricity Infrastructure Roadmap'],
    ['BESS revenue index, calendar 2024', 148000, 'AUD/MW/yr', 'third party', 'NEM_SEED_V1', 'Modo ME BESS AUS NEM Index'],
    ['BESS revenue index, calendar 2025', 128000, 'AUD/MW/yr', 'third party', 'NEM_SEED_V1', 'Modo ME BESS AUS NEM Index'],
    ['BESS revenue index, Oct 2025 – Mar 2026', 73000, 'AUD/MW/yr', 'third party', 'NEM_SEED_V1', 'Modo ME BESS AUS NEM Index'],
    ['BESS revenue index, May 2026 (record low)', 29000, 'AUD/MW/yr', 'third party', 'NEM_SEED_V1', 'Modo ME BESS AUS NEM Index'],
    ['NEM-wide charge/discharge spread, Q2 2026', 51, 'AUD/MWh', 'official', 'NEM_SEED_V1', 'AEMO Quarterly Energy Dynamics'],
    ['FCAS share of battery revenue, Q2 2026', 8.3, '%', 'official', 'NEM_SEED_V1', 'AEMO Quarterly Energy Dynamics'],
    ['Net battery revenue, Q2 2026', 57.5, 'AUD m', 'official', 'NEM_SEED_V1', 'AEMO Quarterly Energy Dynamics'],
    ['Installed battery power', 9000, 'MW', 'official', 'NEM_SEED_V1', 'AEMO Quarterly Energy Dynamics Q2 2026'],
    ['Fleet average duration, June 2026', 2.38, 'h', 'calculated', 'NEM_SEED_V1', '18,961 MWh / 7,960 MW'],
    ['Battery connection pipeline', 45, 'GW', 'official', 'NEM_SEED_V1', 'AEMO connection pipeline'],
    ['ISP grid-scale storage requirement by 2030', 33, 'GW', 'official forecast', 'NEM_SEED_V1', 'AEMO 2026 Integrated System Plan'],
    ['4h installed capital cost', 385, 'AUD/kWh', 'official', 'NEM_SEED_V1', 'CSIRO GenCost 2025-26'],
    ['2h installed capital cost', 525, 'AUD/kWh', 'official', 'NEM_SEED_V1', 'CSIRO GenCost 2025-26'],
    ['Average MLF cost to NEM batteries', 3200, 'AUD/MW/yr', 'third party', 'NEM_SEED_V1', 'Modo NEM MLF analysis'],
    ['Network curtailment within the battery fleet', 90929, 'MWh', 'third party', 'NEM_SEED_V1', 'WattClarity 2025 fleet review'],
    ['Compensation for being constrained off', 0, 'AUD', 'official', 'NEM_SEED_V1', 'No firm transmission rights exist in the NEM'],
    ['Executable margin after all haircuts', 100, 'AUD/MWh', 'calculated', 'NEM_SEED_V1', 'dashboard'],
    ['Australian BESS toll price', 'not disclosed', '-', 'coverage gap', 'NEM_SEED_V1', 'no Australian deal has published a price'],
    ['WEM Reserve Capacity Price (peer, context only)', 422372, 'AUD/MW/yr', 'official (peer namespace)', 'CONTEXT_ONLY', 'WA dashboard'],
    ['WEM capacity payment in the NEM (peer, context only)', 0, 'AUD/MW/yr', 'official (peer namespace)', 'CONTEXT_ONLY', 'the NEM has no capacity mechanism'],
  ],
};

export { M };
