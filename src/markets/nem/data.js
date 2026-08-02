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
  nextMilestone: ['Next milestone: Capacity Investment Scheme Tender 10 bids close 18 August 2026 — reported to be the final dispatchable tender before the scheme winds up in 2027',
                  '下一里程碑：容量投资计划第10轮招标于2026年8月18日截标 — 据报为该计划2027年结束前最后一轮可调度电源招标'],
  footerNote: ['Public and official sources collected 1 August 2026; Western Australian data is held in a separate peer namespace and excluded from NEM scoring. No CIS floor, ceiling or payment cap has been published for any project, and no Australian BESS toll price has ever been disclosed — every contracted figure in this build is a derived bracket, not a quotation.',
               '公开及官方来源于2026年8月1日采集；西澳数据保存在独立同业命名空间，不计入NEM评分。任何项目的CIS保底价、上限与支付上限均未公布，澳大利亚亦从未披露过储能租赁价格 — 本版本中所有合同类数值均为推导区间，而非报价。'],
  seedWarn: ['Every value on this page is a NEM_SEED_V1 snapshot or an illustrative placeholder. No KPI is production-complete until its live ingestion, validation and source-health check are operational. A CIS agreement is a collar, not a fixed payment; an awarded megawatt is never a financial-investment decision; a connection application is never a connection; and a marginal loss factor is a live annual variable, not a discount agreed at financial close.',
             '本页所有数值均为NEM_SEED_V1种子快照或示例占位数据。在实时抓取、校验及源健康检测上线前，任何KPI均不可用于生产决策。CIS协议是双向保底—分成结构，而非固定付费；中标兆瓦绝不等于最终投资决策；并网申请绝不等于并网；边际损耗系数是逐年变动的活变量，而非融资交割时锁定的折扣。'],

  /* ---- official / sourced snapshot -------------------------------------
     Only values that come from a named publication sit here. Illustrative
     series live further down and are badged as such wherever they render. */
  official: {
    // market design
    reviewDate: '16 Dec 2025', esemPilot: 'late 2026', esemStart: 'early 2027',

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
    pecEnergised: 'June 2026', pecKm: 900, pecMW: 800,
    humelinkKm: 365, humelinkKV: 500, humelinkYear: 2027, humelinkUnlockGW: 3, snowyMW: 2200,
    cwoNetworkGW: 4.5, cwoConnectGW: 7.7, cwoYear: 2028,
    vniWestGW: 3.5, vniWestAbn: 7.6, vniWestYear: 2030, vniWestWasYear: 2028,
    marinusMW: 750, marinusYear: 2030,
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

  overall: { statusL: ['Selective', '选择性投资'], chipCls: 'warn', confidence: 64, codWindow: '2028–2030',
    rationale: ['The deepest storage build in the comparison set and the thinnest contracted revenue to underwrite it. There is no capacity market and there will not be one, so certainty has to be bought — through a CIS floor whose level nobody publishes, or a virtual toll whose price nobody discloses. Capital should be committed against a contracted structure and a diligenced connection point, not against a spread forecast.',
                '本对比样本中储能建设规模最深，而可用于承销的合同化收入最薄。这里没有容量市场，未来也不会有，因此确定性必须购买 — 或通过无人公布水平的CIS保底价，或通过无人披露价格的虚拟租赁。资本应基于合同结构与已尽调的并网点投入，而非基于价差预测。'] },

  /* Weights sum to 100; the weighted composite is 58, which is the figure
     src/markets/nem/comparison.js carries as `score.composite`. */
  components: [
    { n: ['Merchant spread outlook', '市场化价差前景'], w: 25, s: 46 },
    { n: ['Contracted revenue availability (CIS / LTESA / tolls)', '合同化收入可得性（CIS/LTESA/租赁）'], w: 20, s: 72 },
    { n: ['Grid access, loss factors & curtailment', '并网、损耗系数与限电'], w: 15, s: 50 },
    { n: ['Pipeline saturation against the ISP requirement', '相对ISP需求的管线饱和度'], w: 15, s: 38 },
    { n: ['Storage-duration fit & capex trajectory', '储能时长匹配度与造价轨迹'], w: 10, s: 88 },
    { n: ['FCAS depth', 'FCAS市场深度'], w: 5, s: 30 },
    { n: ['Financing & delivery execution', '融资与交付执行'], w: 10, s: 90 },
  ],

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

  /* ---- named transmission, from the 2026 ISP and the delivery bodies -----
     Carried here rather than only in the congestion register because the grid
     tab reads commissioning years as a schedule, not as a constraint list. */
  reinforcements: [
    { n: ['Project EnergyConnect', 'Project EnergyConnect互联工程'], operator: 'ElectraNet / Transgrid',
      scope: ['900 km SA–NSW interconnector, 800 MW of transfer capability', '900公里南澳—新南威尔士互联线，800MW输送能力'],
      year: 2026, status: ['Fully energised June 2026', '2026年6月全面送电'], c: 'good' },
    { n: ['HumeLink', 'HumeLink输电工程'], operator: 'Transgrid',
      scope: ['365 km of 500 kV, unlocking 3 GW including 2,200 MW of Snowy 2.0', '365公里500千伏线路，释放3GW，其中含雪山2.0的2,200MW'],
      year: 2027, status: ['Under construction, completion late 2027', '在建，2027年底完工'], c: 'warn' },
    { n: ['Central-West Orana REZ', '中西部奥拉纳可再生能源区'], operator: 'EnergyCo NSW',
      scope: ['4.5 GW of network capacity for 7.7 GW of wind and solar', '4.5GW网络容量，服务7.7GW风电与光伏'],
      year: 2028, status: ['Under construction, commissioning 2028', '在建，2028年投运'], c: 'warn' },
    { n: ['Marinus Link Stage 1', 'Marinus Link一期'], operator: 'Marinus Link Pty Ltd',
      scope: ['750 MW HVDC, Tasmania to Victoria', '750MW高压直流，塔斯马尼亚至维多利亚'],
      year: 2030, status: ['FID August 2025, services late 2030', '2025年8月最终投资决策，2030年底投运'], c: 'serious' },
    { n: ['VNI West', 'VNI West输电工程'], operator: 'Iberdrola (selected Nov 2025)',
      scope: ['Up to 3.5 GW bidirectional, A$7.6bn', '最高3.5GW双向输送，A$76亿'],
      year: 2030, status: ['Completion moved from 2028 to late 2030', '完工时间由2028年推迟至2030年底'], c: 'critical' },
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
