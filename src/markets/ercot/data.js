/* ---------------------------------------------------------------------------
   ERCOT — market dataset.

   Same shape as the PJM/NEM/DE datasets in this lineage: official snapshot
   values, scorecards, bands, duration curves, the project pipeline, lab defaults
   and the per-tab narrative inputs.

   FIVE THINGS ABOUT THIS PARTICULAR DATASET.

   1. THE ARCHETYPE IS TWO HOURS. Every other market on this platform is modelled
      at four or more. ERCOT is two because two is what ERCOT builds: the fleet
      averages about 1.6 hours and roughly 97% of the storage in ERCOT's own 2026
      planning scenario is one- and two-hour systems. Every capex, spread and
      duration figure below is on a two-hour basis, and the duration tab carries
      the transition to four hours as the live question it is.

   2. `deratingCurve` is flat at 1 and `capPrice` is zero, which is the same
      declaration Romania and the NEM make. ERCOT has no capacity mechanism at
      all — not one this asset is excluded from, as in Germany, but none in
      existence. Scarcity is priced inside the energy price through the ORDC and
      is therefore already in the merchant line.

   3. The lab seed reproduces src/markets/ercot/comparison.js rather than
      restating it. capexKWh 187.04 + capexKW 587.84 is NREL's $334/kWh four-hour
      benchmark decomposed on the platform's stack shares and re-assembled at two
      hours, reconciling to $961,920/MW exactly. spread 19.5 at 1.4 cycles a day
      reproduces the $18,155 arbitrage seed to within 0.1%. servicesKW 4.94 is the
      $4,939 forward ancillary seed.

   4. `codCases` carries a high case roughly five times the central one, and that
      is not a modelling flourish. The published two-hour toll value of
      $7.52/kW-month implies about $97/MWh through the same cycle count that puts
      the realised 2025 index at about $19/MWh. Those two numbers describe the
      same asset and cannot both be right.

   5. Where a figure is not published — any ERCOT toll price, the duration split
      of the revenue index, US fixed opex, Texas sales-tax treatment — this file
      does not invent one. Those gaps are in `notPublished` and render on the
      Data & Methodology tab.
   --------------------------------------------------------------------------- */

const M = {
  asOf: '2026-08-04',
  dataDate: 'CY2025 revenue index / Q1 2026 fleet / RTC+B live Dec 2025',
  modelVersion: 'ercot-seed-1.0-energy-only-toll-led-two-hour',
  title: ['ERCOT Battery Investment Dashboard', 'ERCOT储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application. Energy-only market with ORDC scarcity pricing; reference archetype 100 MW / 2h.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。纯电能量市场，通过ORDC实现稀缺定价；参考原型为100MW/2小时。'],
  nextMilestone: ['Next milestone: the first full year of RTC+B settlement. Ancillary services have cleared in real time alongside energy since 5 December 2025, and the duration requirements fell at the same time — ECRS from two hours to one, RRS and Regulation from one hour to thirty minutes.',
                  '下一里程碑：RTC+B机制下的首个完整结算年度。自2025年12月5日起，辅助服务与电能量在实时市场同时出清，且时长要求同步下调 — ECRS由两小时降至一小时，RRS与调频由一小时降至三十分钟。'],
  footerNote: ['Public and official sources collected 4 August 2026. ERCOT publishes its market design in full and its contract prices not at all: no ERCOT toll price has ever been disclosed across ten announced agreements and twelve known tolled batteries. Two independent sources disagree about CY2025 revenue by nearly two times, and the transacted toll market prices this asset at roughly five times what the realised index delivered. Every contracted figure in this build is derived, not quoted.',
               '公开及官方来源于2026年8月4日采集。ERCOT完整公布其市场机制，却完全不公布合同价格：在十份已公布的协议与十二个已知租赁储能项目中，从未披露过任何ERCOT租赁价格。两个独立来源对2025日历年收入的判断相差近两倍，且实际成交的租赁市场对该资产的定价约为已实现指数的五倍。本版本中所有合同类数值均为推导值，而非报价。'],
  seedWarn: ['Every value on this page is an approved base-case snapshot or an illustrative placeholder. No figure is production-complete until its live feed, validation and source-health check are running. Four specific warnings: this archetype is TWO hours and is not directly comparable with the four-hour archetypes elsewhere on this platform; ERCOT has no capacity mechanism, so the contracted route is a private toll whose price has never been disclosed; the realised revenue index and the transacted toll market disagree about this asset by roughly five times; and the §48E investment tax credit is seeded at zero here and is editable in the dedicated Investment Lab page, so returns on this page exclude it.',
             '本页所有数值均为已批准的基准情景快照或示例占位数据。在实时数据接入、校验及来源健康检测上线前，任何指标均不可用于生产决策。四点具体警示：本页原型为两小时，与本平台其他市场的四小时原型不可直接比较；ERCOT没有容量机制，因此合同化路径为价格从未披露的私下租赁；已实现收入指数与实际成交的租赁市场对该资产的判断相差约五倍；§48E投资税收抵免在本页种子值为零、可在首页投资实验室中调整，因此本页收益率不含该抵免。'],

  /* ---- official / sourced snapshot -------------------------------------
     Only values that come from a named publication sit here. */
  official: {
    // ---- market design ----
    rtcbDate: '5 December 2025',
    ecrsHoursBefore: 2, ecrsHoursAfter: 1,
    rrsHoursBefore: 1, rrsHoursAfterMin: 30,
    nonSpinHours: 4,
    rrsPfrMinMW: 1377,
    asMethodYear: 2026, asMethodEffective: '1 January 2026',
    rtcbSavingsBn: 1,

    // ---- fleet and buildout ----
    fleet2024GW: 8.6, fleet2026GW: 14, fleetQ1_2026GW: 14.96,
    fleet2030GW: 40, fleet2023GW: 5.3,
    fleetHours: 1.6, shortSharePct: 97,
    queueApplications: 1470, queueLargeGen: 1354, queueSuccessPct: 28,

    // ---- revenue: two sources, one direction, different levels ----
    idx2023: 193000, idx2024: 56000, idx2025: 29400,
    enverus2023: 149000, enverus2025: 17000,
    asShare2023Pct: 84, asShare2025Pct: 48,
    asFallSince2023Pct: 90,
    energyShareJun25Pct: 76,
    monJan26: 46264, monFeb26: 15306, monApr26: 38145,
    monOct25: 2.00, monNov25: 2.38, monSep25: 3.16, monJul25: 3.63, monJun25: 3.01,
    /* Modo Energy monthly benchmark, USD/kW-month, settled. June 2026 is the
       lowest month Modo has recorded in ERCOT: 43% below June 2025. */
    monMay26: 1.67, monJun26: 1.11, monJul26: 1.42,

    // ---- the capture stack applied in comparison.js ----
    captureDuration: 0.95, fleetHoursBasis: 1.6,

    // ---- tolling ----
    tollsAnnounced: 10, tollsGW: 1.6, tolledKnown: 12,
    tolledOperating: 5, tolledDue2026: 7,
    tollTb2Aug25: 7.52, tollTb2May25: 8.34, tollTb2FallPct: 10,
    tollUs4hLo: 8, tollUs4hHi: 20,
    tollTenorPrecedent: 7, tollTenorLo: 7, tollTenorHi: 20,
    cpsPortfolioMW: 400,

    // ---- interconnection: the structural advantage ----
    interconnectYears: 4.2, pjmInterconnectYears: 8,
    pjmUpgradePerKW: 240, pjmUpgradePriorPerKW: 29,
    ercotAdded2021_22GW: 14.2, pjmAdded2021_22GW: 5.6,
    /* ERCOT, August 2026: more than 1,800 projects and over 474 GW, about 90%
       data centres — double the 238.6 GW / 77.5% of March 2026. Roughly 200 GW of
       it sits in the Batch Zero verification the Governor's 3 August 2026 pause
       triggered. A queue, not a commitment, and now an audited one. */
    largeLoadQueueGW: 474, largeLoadDataCentrePct: 90,
    largeLoadAsOf: 'August 2026', largeLoadPauseDate: '3 August 2026', largeLoadAuditDue: '10 December 2026',
    largeLoadQ1_2026GW: 198, largeLoadUnderReviewGW: 86,

    // ---- capex and tax ----
    nrel4hPerKWh: 334, energySharePct: 56, powerSharePct: 44,
    energyPerKWh: 187.04, powerPerKW: 587.84,
    capex2hPerKWh: 480.96, capexFloor2hPerKWh: 331.2,
    usEpcLo4hPerKWh: 230, usEpcHi4hPerKWh: 320,
    chinaLoPerKWh: 90, chinaHiPerKWh: 130,
    itcPct: 30, itcThroughYear: 2033, itcTransferCents: 93,
    itcCeilingPct: 37, feocFromYear: 2026,
    chapter313Expiry: '31 December 2022',
  },

  /* The gate closures an ERCOT optimiser trades through. Since RTC+B they are
     no longer sequential in the way they were: energy and ancillary services
     clear TOGETHER in real time, which is the single most important structural
     change on this dashboard. */
  gateCloses: [
    { id: 'DAM',        n: ['Day-ahead market — energy and AS', '日前市场 — 电能量与辅助服务'],
      when: ['Bids close 10:00 CPT for the following operating day', '美中时间10:00截标，交易次一运行日'],
      fit: ['Still where most ancillary capacity is committed, but no longer the only place it clears', '仍是多数辅助服务容量的承诺环节，但已不再是其唯一出清场所'] },
    { id: 'RTC',        n: ['Real-time co-optimization (RTC+B)', '实时联合优化（RTC+B）'],
      when: ['Every five minutes, since 5 December 2025', '自2025年12月5日起，每五分钟一次'],
      fit: ['Energy and AS clear together; a battery can move between them intra-hour instead of being locked in day-ahead', '电能量与辅助服务同时出清；储能可在小时内在两者间切换，而非在日前被锁定'] },
    { id: 'ORDC',       n: ['Operating Reserve Demand Curve', '运行备用需求曲线（ORDC）'],
      when: ['Applied continuously to the real-time price', '持续作用于实时价格'],
      fit: ['This is ERCOT\'s capacity mechanism, and it is not one: scarcity is an adder inside the energy price, so it is already in the merchant line', '这就是ERCOT的“容量机制”，但它并非真正的容量机制：稀缺性是电能量价格中的加价项，因此已包含在市场化收入之中'] },
    { id: 'Nodal',      n: ['Nodal settlement and congestion revenue rights', '节点结算与拥塞收入权'],
      when: ['Settlement at the resource node; CRRs auctioned separately', '按资源节点结算；拥塞收入权单独拍卖'],
      fit: ['Basis risk is the asset\'s to manage or hedge; no compensation exists for being constrained', '基差风险由资产自行管理或对冲；受约束停机不存在任何补偿'] },
  ],

  /* ERCOT's four load zones. Used as the pipeline region column and as the frame
     for the nodal energy story. Unlike PJM's LDAs these do not differentiate any
     capacity payment, because there is no capacity payment — they differentiate
     the energy price, which in ERCOT is the whole of it. */
  regions: [
    { id: 'West',    n: ['West — Permian and the wind belt', '西部 — 二叠盆地与风电带'],
      note: ['Where ERCOT congestion concentrates: wind and solar output far from load, plus oilfield electrification demand. The most negative and the most volatile prices in the market.', 'ERCOT拥塞集中之处：风光出力远离负荷，叠加油田电气化需求。该区拥有全市场最负、也最波动的价格。'] },
    { id: 'South',   n: ['South — Rio Grande Valley and the coast', '南部 — 格兰德河谷与沿海'],
      note: ['Solar-heavy and export-constrained toward the Houston and North load centres.', '光伏占比高，向休斯顿与北部负荷中心送出受限。'] },
    { id: 'Houston', n: ['Houston — coastal industrial load', '休斯顿 — 沿海工业负荷'],
      note: ['A dense import-constrained load pocket; the largest concentration of ERCOT battery capacity sits around it.', '密集的受入受限负荷孤岛；ERCOT储能装机最集中的区域即环绕于此。'] },
    { id: 'North',   n: ['North — Dallas–Fort Worth and the data-centre build', '北部 — 达拉斯-沃斯堡与数据中心建设'],
      note: ['Where the large-load queue is growing fastest. ERCOT\'s large-load queue reached about 474 GW by August 2026, about 90% of it data centres.', '大负荷排队增长最快的区域。截至2026年8月，ERCOT大负荷排队量约达474GW，其中约90%为数据中心。'] },
  ],

  overall: { confidence: 58, codWindow: '2028–2030',
    rationale: ['The easiest market in the US to build in and the hardest to get paid in. ERCOT connects a project in about 4.2 years at minimal cost — against eight-plus years and $240/kW of network upgrades in PJM — and then offers no capacity payment whatsoever. The merchant index that has to carry the whole return fell from $193/kW/yr in 2023 to about $29/kW in 2025 as the fleet went from 5.3 GW to 14 GW, and ancillary services, which were 84% of battery revenue in 2023, are 48% and falling. The market\'s answer is the private toll, and no ERCOT toll price has ever been disclosed. Underwrite the toll, the node and the tail after the toll expires. Do not underwrite the index, in either direction — it is the number two credible sources disagree about by nearly two times.',
                '这是美国最容易建设、却最难获得回报的市场。ERCOT约4.2年即可完成项目并网且成本极低 — 相较PJM的八年以上及每kW $240的电网升级费用 — 但完全不提供任何容量收入。须独力支撑全部回报的市场化指数，已随装机由5.3GW增至14GW，从2023年的每kW每年$193跌至2025年的约$29；而2023年占储能收入84%的辅助服务，如今为48%且仍在下降。市场给出的答案是私下租赁，而ERCOT从未披露过任何租赁价格。承销依据应为租赁合约、节点位置以及租赁到期后的敞口期。切勿以该指数为承销依据 — 无论方向如何 — 因为两个可信来源对这一数字的判断相差近两倍。'] },


  // ---- capacity channel: there is none ----
  /* Flat at 1 and paired with `capPrice: 0` in the lab. This is the Romania and
     NEM declaration, not the Germany one: Germany has a mechanism a four-hour
     battery is excluded from, and ERCOT has no mechanism. Scarcity reaches the
     asset through the ORDC adder inside the energy price, which means it is
     already inside `merchGross` and must not be added again here. */
  deratingCurve: { 1: 1, 2: 1, 4: 1, 8: 1 },
  futureCapFactor: 0,

  // ---- revenue ----
  /* The collapse, in the source's own annual numbers. Three bars, and the fleet
     size beside each one is the explanation. */
  idxLabels: ['CY2023', 'CY2024', 'CY2025'],
  idxSeries: [193, 56, 29.4],
  idxFleetGW: [5.3, 8.6, 14],
  /* The second source. Same direction, different level, and the gap is not
     narrowing — CY2023 differs by 30% and CY2025 by 73%. */
  idxAltSeries: [149, null, 17],

  /* Ancillary share of ERCOT battery revenue. The line that fell, and the reason
     the total fell with it. */
  asShareLabels: ['2023', '2025'],
  asShareSeries: [84, 48],

  /* Realised index → executable two-hour arbitrage, $/MW/yr. The ancillary leg
     is stripped out first because it is power-based and is modelled separately;
     the duration step scales from the 1.6-hour fleet the index measures to the
     two-hour archetype. The optimiser fee is deliberately NOT a step — the model
     applies it once, as lab.optFee. */
  spreadBridge: [
    { l: ['ME BESS ERCOT index, CY2025, all revenue', 'ME BESS ERCOT指数，2025日历年，全部收入'], v: 29400, t: 'start' },
    { l: ['Ancillary services stripped out (48% share) — modelled separately', '剔除辅助服务（占比48%） — 单独建模'], v: -14112, t: 'd' },
    { l: ['Duration scaling, 1.6h fleet → 2h archetype (×1.25)', '时长折算，1.6小时机组 → 2小时原型（×1.25）'], v: 3822, t: 'd' },
    { l: ['Capture penalty at longer duration (×0.95)', '更长时长的捕获折减（×0.95）'], v: -955, t: 'd' },
    { l: ['Executable two-hour arbitrage before the optimiser fee', '扣除优化商费用前的可执行两小时套利收入'], v: 18155, t: 'total' },
  ],

  /* Ancillary services, forward. The same construction PJM's Regulation uses:
     a quantity set by system need, divided by a fleet that grows regardless. */
  asBridge: [
    { l: ['Ancillary revenue earned by the fleet, CY2025 (48% of the index)', '机组2025日历年辅助服务收入（指数的48%）'], v: 14112, t: 'start' },
    { l: ['AS quantities are set by system need and do not grow with the fleet', '辅助服务采购量由系统需求确定，不随机组规模增长'], v: 0, t: 'd' },
    { l: ['Competing fleet 14 GW entering 2026 → ~40 GW by end-2030', '竞争机组由2026年初14GW增至2030年底约40GW'], v: -9173, t: 'd' },
    { l: ['Ancillary available to a new entrant', '新进入者可获得的辅助服务收入'], v: 4939, t: 'total' },
  ],

  /* Captured spread by COD year, $/MWh, two-hour basis at 1.4 cycles a day.
     The central path is the lab seed multiplied by the dilution factor below.
     The HIGH case is not an optimistic scenario — it is the published two-hour
     toll value of $7.52/kW-month expressed through the same cycle count. The two
     describe the same asset. */
  codCases: { 2028: { low: 16, central: 20, high: 97 }, 2029: { low: 16, central: 19, high: 93 }, 2030: { low: 15, central: 18, high: 89 } },
  /* A fleet heading from 14 GW to about 40 GW compresses the spread it trades.
     Illustrative — no ERCOT-specific published spread forecast anchors the
     shape, only the direction. */
  dilution: { 2028: 1.00, 2029: 0.96, 2030: 0.92 },

  evidenceLadder: [
    { n: ['1 · ERCOT market design: RTC+B, the AS methodology and the ORDC curve', '1 · ERCOT市场机制：RTC+B、辅助服务方法及ORDC曲线'],
      d: ['Published in full, on time, with the parameters attached. This is the only tier on this ladder that is fact, and ERCOT is unusually strong on it — the market design is better documented here than anywhere else on this platform.', '完整、及时公布，并附具体参数。这是本梯级中唯一属于事实的层级，而ERCOT在此异常可靠 — 其市场机制的公开程度高于本平台任何其他市场。'] },
    { n: ['2 · The executed tolling agreement and its price', '2 · 已签署的租赁协议及其价格'],
      d: ['The only tier that changes the risk profile rather than the estimate, and the only one no ERCOT transaction has ever published. Ten announced agreements, twelve known tolled batteries, zero disclosed prices.', '唯一改变风险结构而非改变估算值的层级，也是ERCOT任何交易均从未公布的一项。十份已公布协议、十二个已知租赁储能项目、零个已披露价格。'] },
    { n: ['3 · Node-level basis and congestion revenue right position', '3 · 节点级基差与拥塞收入权持仓'],
      d: ['ERCOT settles at the resource node and no compensation exists for being constrained off. Basis is the asset\'s to manage; a zonal average does not describe it.', 'ERCOT按资源节点结算，且受约束停机不存在任何补偿。基差风险须由资产自行管理；分区平均值无法反映其情况。'] },
    { n: ['4 · Reproducible optimiser backtest on this node, post-RTC+B', '4 · 该节点在RTC+B之后的可复现优化器回测'],
      d: ['Energy and ancillary services have cleared together only since 5 December 2025. A backtest that predates it is describing a market that no longer exists.', '电能量与辅助服务自2025年12月5日起才开始同时出清。早于该日期的回测所描述的是一个已不复存在的市场。'] },
    { n: ['5 · FEOC material-assistance documentation for the tax credit', '5 · 用于税收抵免的FEOC实质协助合规文件'],
      d: ['Binary and federal. Failing the Material Assistance Cost Ratio voids the credit rather than reducing it, and it applies identically in every US market on this platform.', '非此即彼，且属联邦层面。未通过实质协助成本比率将使抵免完全失效而非减少，该规则在本平台所有美国市场中完全一致。'] },
  ],

  // ---- duration ----
  /* Two hours across all three COD years. The archetype does not move within
     this window even though the market's new build is starting to: named
     four-hour projects arrive in 2026 while the fleet average is still 1.6h. */
  durationPath: { years: ['2028', '2029', '2030'], hours: [2, 2, 2] },
  durConfigs: [1, 2, 4, 8],
  /* Per-MWh capture relative to the two-hour archetype, which is the basis the
     TB2 spread and the toll value are both quoted on. ILLUSTRATIVE — no ERCOT
     TB1/TB4/TB8 series was located, so unlike the revenue index these points are
     a curve shape rather than observations. */
  durSpreadFactor: { 1: 1.22, 2: 1.00, 4: 0.76, 8: 0.55 },
  usableFraction: 0.94,
  /* 2h → 4h, $k per nameplate MW per year, on this dashboard's own seed and on
     the MERCHANT basis. Incremental capex is 2,000 kWh/MW at the $187.04/kWh
     energy-scaling component plus EPC at 13.64% = $425,091/MW, annualised over
     twenty years at 8% (annuity factor 0.101852) ≈ $43k/MW/yr. */
  marginalHour: [
    { l: ['Incremental arbitrage — 2× the energy at 76% of the 2h capture rate', '增量套利 — 电量翻倍，捕获率为2小时的76%'], v: 9, t: 'd' },
    { l: ['Ancillary services — power-based, does not scale with duration', '辅助服务 — 功率型，不随时长增长'], v: 0, t: 'd' },
    { l: ['Optimiser fee on the larger merchant line (5%)', '更大市场化收入对应的优化商费用（5%）'], v: -1, t: 'd' },
    { l: ['Annualised incremental capex ($425k/MW, 20 yr at 8%)', '年化增量资本开支（每MW $425k，20年，8%）'], v: -43, t: 'd' },
    { l: ['Degradation and incremental opex', '衰减与增量运维'], v: -2, t: 'd' },
    { l: ['Net marginal value, hours 3–4, on merchant', '第3–4小时净边际价值（市场化口径）'], v: -37, t: 'total' },
  ],
  durFactors: [
    { n: ['Ancillary services pay nothing for duration, and RTC+B shortened the requirements', '辅助服务完全不为时长付费，且RTC+B缩短了时长要求'], w: 16, s: 0 },
    { n: ['US installed cost after tariffs and domestic-content premium', '计入关税与本土含量溢价后的美国安装成本'], w: 16, s: 1 },
    { n: ['No capacity market rewards duration — none exists', '没有容量市场为时长提供回报 — 该市场并不存在'], w: 14, s: 0 },
    { n: ['Named four-hour builds arriving in 2026 (Ferdinand, Padua 2)', '2026年投运的具名四小时项目（Ferdinand、Padua 2）'], w: 12, s: 2 },
    { n: ['Solar penetration and the depth of the midday trough', '光伏渗透率与午间低谷深度'], w: 12, s: 3 },
    { n: ['Evening net-load ramp after sunset in a solar-heavy stack', '光伏高占比电源结构下的日落后净负荷爬坡'], w: 12, s: 3 },
    { n: ['Fleet duration lengthening from a 1.6h average', '机组平均时长自1.6小时延长'], w: 10, s: 1 },
    { n: ['Spread-capture decay at longer duration', '更长时长的价差捕获衰减'], w: 8, s: 1 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Shallow-shift market', '浅移峰市场'], c: 'info',
      d: ['1–2h suffices; MWh added beyond that is unpaid capital. This is where the ERCOT fleet actually sits.', '1–2小时已足够；超出部分的MWh属无回报资本。ERCOT机组目前正处于此区间。'] },
    { lo: 35, hi: 54, n: ['2h merchant zone', '2小时市场化区间'], c: 'warn',
      d: ['Underwrite 2h. It is the archetype, the basis TB2 and the published toll value are quoted on, and what 97% of the planning-scenario fleet is.', '按2小时测算。它既是本页原型，也是TB2价差与已公布租赁价值的计价基准，更是规划情景中97%机组的实际配置。'] },
    { lo: 55, hi: 69, n: ['Transition to 4h', '向4小时过渡'], c: 'serious',
      d: ['Build 4h only where the marginal-hour NPV clears — on merchant it does not, by about $37k/MW/yr. The four-hour case in ERCOT lives in the toll, and no 2h-versus-4h toll pair is published.', '仅当边际小时NPV为正时才按4小时建设 — 按市场化口径其为负值，约为每MW每年-$37k。ERCOT的四小时投资逻辑存在于租赁之中，而无任何2小时对4小时的租赁价格对照数据公开。'] },
    { lo: 70, hi: 100, n: ['4h+ duration-driven', '4小时以上时长驱动'], c: 'good',
      d: ['Would require either a capacity mechanism that pays for duration or a disclosed four-hour toll premium. ERCOT has neither.', '这需要存在为时长付费的容量机制，或已披露的四小时租赁溢价。ERCOT两者皆无。'] },
  ],
  augItems: [
    ['Land reserved for additional enclosures', '预留新增电池舱用地'],
    ['DC collection and containerised expansion capacity', '直流汇集与集装箱式扩容能力'],
    ['Transformer and switchgear headroom', '变压器与开关设备裕度'],
    ['PCS and EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['Interconnection agreement covers the added MWh without a new study', '并网协议覆盖新增MWh且无需重新研究'],
    ['Resource node basis supports the longer discharge window', '资源节点基差支持更长的放电窗口'],
    ['Tolling counterparty consent to augmentation', '租赁交易对手对增容的同意'],
    ['FEOC material-assistance ratio survives the added equipment', '新增设备后仍满足FEOC实质协助比率'],
    ['Property tax assessment after the added MWh', '新增MWh后的财产税评估'],
    ['OEM warranty continuity across the augmentation', 'OEM质保在增容后延续'],
  ],
  augDefaults: [2, 2, 2, 2, 2, 1, 1, 1, 1, 1],

  // ---- pipeline ----
  /* The step that matters is `toll`. In an energy-only market an executed
     tolling agreement is the ONLY contracted revenue that exists, so it is
     scored higher here than the equivalent step in any other market — above the
     interconnection agreement, because ERCOT interconnection is comparatively
     easy and the offtake is not. */
  stages: [
    { id: 'op',   n: ['Operating and dispatching', '已投运并参与调度'], p: 100 },
    { id: 'comm', n: ['Commissioning / phased energisation', '调试中/分阶段送电'], p: 93 },
    { id: 'con',  n: ['Under construction, financial close reached', '在建，已融资交割'], p: 88 },
    { id: 'toll', n: ['Tolling agreement executed, pre-FID', '已签租赁协议，未作最终投资决策'], p: 70 },
    { id: 'ia',   n: ['Standard generation interconnection agreement signed', '已签署标准发电并网协议'], p: 58 },
    { id: 'sis',  n: ['Full interconnection study complete', '完整并网研究已完成'], p: 40 },
    { id: 'scr',  n: ['Screening study submitted', '已提交筛查研究'], p: 15 },
    { id: 'ann',  n: ['Announced only', '仅公告'], p: 5 },
  ],
  /* Named ERCOT projects are real and publicly announced — unlike PJM, where no
     project-level list was located. Capacities are given only where a source
     states them; the remaining rows are seed examples and are labelled as such.
     Note the durations: the named TOLLED assets are the four-hour ones, which is
     the duration argument stated as a fleet fact. */
  projects: [
    { n: 'Ferdinand (Eolian / CPS Energy)',        owner: 'Eolian',       region: 'South',   mw: 200, h: 4, cod: 2026, st: 'con' },
    { n: 'Padua 2 (Eolian / CPS Energy)',          owner: 'Eolian',       region: 'South',   mw: 150, h: 4, cod: 2026, st: 'con' },
    { n: 'Crossett 1 (Jupiter Power / Equilibrium)', owner: 'Jupiter Power', region: 'West', mw: null, h: null, cod: 2024, st: 'op' },
    { n: 'Cross Trails (Energy Vault / Gridmatic)', owner: 'Energy Vault', region: 'West',    mw: null, h: null, cod: 2025, st: 'op' },
    { n: 'Lower Rio (Ormat / Equilibrium)',        owner: 'Ormat',        region: 'South',   mw: null, h: null, cod: 2025, st: 'op' },
    { n: 'Octopus / Habitat tolled asset',         owner: 'Octopus Energy', region: 'West',  mw: 50,  h: 2, cod: 2025, st: 'op' },
    { n: 'ERCOT seed example A', region: 'Houston', mw: 100, h: 2, cod: 2028, st: 'toll' },
    { n: 'ERCOT seed example B', region: 'West',    mw: 200, h: 2, cod: 2028, st: 'toll' },
    { n: 'ERCOT seed example C', region: 'North',   mw: 150, h: 4, cod: 2029, st: 'ia' },
    { n: 'ERCOT seed example D', region: 'South',   mw: 100, h: 2, cod: 2029, st: 'sis' },
    { n: 'ERCOT seed example E', region: 'North',   mw: 250, h: 4, cod: 2030, st: 'scr' },
    { n: 'ERCOT seed example F', region: 'Houston', mw: 100, h: 2, cod: 2030, st: 'ann' },
  ],


  /* ---- what changes the market, and when -------------------------------
     ERCOT's register is market design rather than transmission, and unlike
     PJM's it is not a list of proposals: RTC+B is live and the AS methodology
     is in force. That is a stronger form of evidence than a proposed reform,
     and weaker than a funded wire with a commissioning date. */
  reinforcements: [
    { n: ['RTC+B — real-time co-optimization', 'RTC+B — 实时联合优化'], operator: 'ERCOT', region: ['Market-wide', '全市场'], gw: null,
      cls: 'design', scope: ['Energy and ancillary services clear together every five minutes. ECRS duration requirement cut from two hours to one; RRS and Regulation from one hour to thirty minutes; Non-Spin unchanged at four hours.', '电能量与辅助服务每五分钟同时出清。ECRS时长要求由两小时降至一小时；RRS与调频由一小时降至三十分钟；非旋转备用维持四小时不变。'],
      year: 2025, status: ['LIVE since 5 December 2025 — not a proposal', '自2025年12月5日起已上线 — 并非提议'], c: 'good' },
    { n: ['2026 Ancillary Service Methodology', '2026年辅助服务方法'], operator: 'ERCOT, endorsed by TAC', region: ['Market-wide', '全市场'], gw: null,
      cls: 'design', scope: ['Probabilistic determination of ECRS and Non-Spin quantities; Regulation and RRS methodology unchanged. RRS primary frequency response minimum 1,377 MW.', '以概率方法确定ECRS与非旋转备用采购量；调频与RRS方法不变。RRS一次调频响应最低1,377MW。'],
      year: 2026, status: ['In force since 1 January 2026', '自2026年1月1日起生效'], c: 'good' },
    { n: ['Large-load interconnection rules', '大负荷并网规则'], operator: 'ERCOT / Public Utility Commission of Texas', region: ['North and West', '北部与西部'], gw: 474,
      cls: 'load', scope: ['A large-load queue of about 474 GW by August 2026, about 90% of it data centres, double the 238.6 GW of March 2026. The PUCT has adopted its large-load interconnection standards. On 3 August 2026 the Governor directed ERCOT and the PUCT to pause data-centre interconnections pending a project-by-project audit; ERCOT postponed its Batch Zero study and expects to file the audit by 10 December 2026.', '截至2026年8月，大负荷排队量约474GW，其中约90%为数据中心，为2026年3月238.6GW的两倍。PUCT已通过大负荷并网标准。2026年8月3日，州长指示ERCOT与PUCT在逐项目审计完成前暂停数据中心并网；ERCOT已推迟Batch Zero研究，预计于2026年12月10日前提交审计报告。'],
      year: 2026, status: ['Paused pending audit — the largest single uncertainty in the ERCOT price forecast', '审计期间暂停 — 这是ERCOT价格预测中最大的单项不确定性'], c: 'serious' },
    { n: ['Connect-and-manage interconnection', '“接入并管理”式并网'], operator: 'ERCOT', region: ['Market-wide', '全市场'], gw: null,
      cls: 'design', scope: ['Generation connects on roughly 4.2-year timelines at minimal cost, against eight-plus years and $240/kW of network upgrades in PJM. ERCOT brought 14.2 GW online in 2021–22 against PJM\'s 5.6 GW.', '发电项目约4.2年即可接入且成本极低，而PJM需八年以上并承担每kW $240的电网升级费用。2021–22年ERCOT新增投运14.2GW，PJM为5.6GW。'],
      year: 2026, status: ['Long-standing and operating; other ISOs are studying it', '长期实行且运行中；其他独立系统运营机构正在研究该模式'], c: 'good' },
  ],

  planClasses: [
    { id: 'design', n: ['Market design, in force', '市场机制，已生效'], c: 'good',
      d: ['A rule that is already operating, with published parameters. Stronger evidence than a proposed reform and different in kind from a transmission project: it changes how revenue is earned rather than how much network exists. RTC+B is the clearest example — it went live on a published date and its duration requirements are numbers, not intentions.', '已在运行且参数公开的规则。其证据力强于提议中的改革，且在性质上不同于输电工程：它改变的是收入的获取方式，而非电网的物理规模。RTC+B是最清晰的例证 — 它在公布的日期上线，且其时长要求是具体数字而非意向。'] },
    { id: 'load', n: ['Demand-side rulemaking', '需求侧规则制定'], c: 'serious',
      d: ['Rules governing how quickly very large loads may connect. Establishes that the demand will arrive, not when or on what terms — and in ERCOT the scale involved is larger than the entire generation fleet.', '规范超大型负荷接入速度的规则。它确立了需求终将到来，但不确立到来的时间与条件 — 而在ERCOT，所涉规模大于整个发电机组总量。'] },
  ],

  /* ---- coverage gaps, rendered verbatim on the Data & Methodology tab ---- */
  notPublished: [
    { item: ['ERCOT toll price, any deal', 'ERCOT租赁价格，任何交易'],
      status: ['Never disclosed, across ten announced agreements', '从未披露，十份已公布协议均无'],
      why: ['Ten tolling agreements covering about 1.6 GW had been announced by September 2025 and twelve tolled batteries are known — Crossett 1, Padua 1 and 2, Ferdinand, Cross Trails, Lower Rio and others. Not one published a price; the market describes ERCOT toll levels as almost universally confidential.',
            '截至2025年9月已公布十份租赁协议，覆盖约1.6GW，且已知十二个租赁储能项目 — Crossett 1、Padua 1与2、Ferdinand、Cross Trails、Lower Rio等。无一公布价格；市场普遍将ERCOT租赁价格描述为几乎完全保密。'],
      instead: ['The published TB2 toll value of $7.52/kW-month in August 2025, $90,240/MW/yr — the only two-hour-specific figure located. The broader US band of $8–20/kW-month is quoted for four-hour systems and is deliberately not used. Tenor comes from Crossett 1\'s disclosed seven years.',
                '采用2025年8月已公布的TB2租赁价值每kW每月$7.52，即每MW每年$90,240 — 这是所找到的唯一两小时口径数据。更宽泛的美国区间每kW每月$8–20系针对四小时系统的报价，此处刻意不予采用。期限取自Crossett 1已披露的七年。'] },
    { item: ['Whether the toll value or the realised index describes this asset', '究竟是租赁价值还是已实现指数反映该资产的真实情况'],
      status: ['Unresolved — the two differ by roughly five times', '未解决 — 两者相差约五倍'],
      why: ['The realised CY2025 index puts an ERCOT battery at about $2.45/kW-month all-in. Published two-hour toll values sat at $7.52/kW-month in the same period. A toll must clear below risk-adjusted expected merchant revenue, so an offtaker signing at $7.52 expects at least that much — which the realised index does not support.',
            '2025日历年已实现指数显示ERCOT储能全口径收入约为每kW每月$2.45。同期已公布的两小时租赁价值为每kW每月$7.52。租赁价格必须低于风险调整后的预期市场化收入，因此以$7.52签约的承购方预期收入至少达到此水平 — 而已实现指数并不支持这一预期。'],
      instead: ['Both, at opposite ends of the merchant band. The seed is the realised index scaled to two hours and the band ceiling is the toll value, so the disagreement is visible rather than averaged away. This is the single largest open question in the ERCOT model.',
                '两者兼采，分置于市场化收入区间的两端。种子值为按两小时折算的已实现指数，区间上限为租赁价值，从而使分歧得以显现而非被平均抹去。这是ERCOT模型中最大的单项未决问题。'] },
    { item: ['CY2025 revenue level', '2025日历年收入水平'],
      status: ['Two credible sources differ by nearly two times', '两个可信来源相差近两倍'],
      why: ['Modo puts the CY2025 fleet index at about $29.4/kW/yr; Enverus puts it at about $17/kW. They also differ on CY2023 — $193/kW against $149/kW. The direction and the mechanism are agreed; the level is not.',
            'Modo测算2025日历年机组指数约为每kW每年$29.4；Enverus测算约为$17。两者对2023日历年的判断亦不同 — $193/kW对$149/kW。方向与成因一致，水平则不一致。'],
      instead: ['Modo\'s figure, because it is the series with the published monthly history and the stated fleet basis. The disagreement is recorded here rather than resolved, and a reader who prefers the Enverus level should move the merchant seed to the band floor.',
                '采用Modo数据，因其为具有公开月度历史且明示机组口径的序列。此处记录而非裁决该分歧；倾向Enverus水平的读者应将市场化收入种子值下调至区间下限。'] },
    { item: ['Duration split of the revenue index', '收入指数的时长拆分'],
      status: ['Not published', '未公布'],
      why: ['The index is a single fleet-average number across a fleet averaging about 1.6 hours. No breakdown by duration band was located, so there is no way to observe what a two-hour asset specifically earned.',
            '该指数是覆盖平均约1.6小时机组的单一均值。未找到按时长分档的拆解数据，因此无法观测两小时资产的具体收入。'],
      instead: ['A stated scaling: the energy leg × (2 / 1.6) × 0.95, the same capture penalty the NEM applies when it scales its own fleet index. Stating the scalar lets a reader who disputes it discount every ERCOT revenue figure at once.',
                '采用明示的折算：电能量部分 × (2 ÷ 1.6) × 0.95，其中捕获折减系数与NEM折算自身机组指数时所用一致。明示该系数可使有异议的读者一次性对所有ERCOT收入数据进行折减。'] },
    { item: ['US fixed opex and Texas property tax', '美国固定运维成本与德州财产税'],
      status: ['No published series', '无公开序列'],
      why: ['No US operator or ISO publishes a fixed opex figure for grid-scale storage. One national-laboratory figure exists: NREL selects 4% of capital cost a year for a four-hour battery, from the high end of published values, because it includes the capacity additions that hold a system at its rating (Cost Projections for Utility-Scale Battery Storage: 2025 Update, page 11). The seed here is the maintenance-only end and is paired with a market line that degrades, so the two are not the same measure. The Texas-specific component is property tax, which changed materially when Chapter 313 school-district value-limitation agreements lapsed on 31 December 2022.',
            '美国没有运营商或独立系统运营机构公布电网级储能的固定运维成本。国家实验室的数字只有一个：NREL针对四小时电池取每年为投资成本的4%，该值取自公开数值的高端，因为它包含了使系统维持额定容量的容量增补（《公用事业级电池储能成本预测：2025年更新》第11页）。此处的种子值属于仅含日常维护的低端，并与逐年衰减的市场化收入配套使用，两者并非同一口径。德州特有的成分是财产税，其在第313章学区估值限制协议于2022年12月31日失效后发生重大变化。'],
      instead: ['$20,000/MW/yr, held equal to PJM and the NEM so that cross-market comparison is not driven by an unobserved input.',
                '采用每MW每年$20,000，与PJM及NEM保持一致，以避免跨市场比较被未观测输入所驱动。'] },
    { item: ['Texas sales tax treatment of standalone storage', '德州对独立储能的销售税处理'],
      status: ['Could not be verified from public sources', '无法通过公开来源核实'],
      why: ['Texas exempts much equipment used in electricity generation from sales tax. Whether standalone storage qualifies on the same terms was not settled in a source this platform could cite.',
            '德州对电力生产所用的多数设备免征销售税。独立储能是否以同等条件适用该免税，未能在本平台可引用的来源中得到确认。'],
      instead: ['`vatPct: 0`, meaning not modelled rather than absent. The field is the same one European VAT uses and behaves as a non-recoverable cost when `vatRecoverable` is false.',
                '设`vatPct: 0`，含义为未建模而非不存在。该字段与欧洲增值税所用字段相同，当`vatRecoverable`为false时按不可退还成本处理。'] },
    { item: ['ERCOT TB1 / TB4 / TB8 spread series', 'ERCOT的TB1/TB4/TB8价差序列'],
      status: ['Not located', '未找到'],
      why: ['TB2 is the published benchmark, which is consistent with two hours being the ERCOT default. No longer- or shorter-duration equivalent was found.',
            'TB2为已公布基准，这与两小时作为ERCOT默认配置相符。未找到更长或更短时长的对应数据。'],
      instead: ['`durSpreadFactor` away from two hours is an illustrative curve shape and is badged as such. The marginal-hour waterfall depends on it and says so.',
                '偏离两小时的`durSpreadFactor`为示意性曲线形态并已如此标注。边际小时瀑布图依赖该曲线，并已明确说明。'] },
    { item: ['Average ERCOT grid-scale project size, MW', 'ERCOT电网级项目平均规模，MW'],
      status: ['Not published', '未公布'],
      why: ['ERCOT publishes the interconnection queue and installed capacity but not a size distribution for operating grid-scale storage.',
            'ERCOT公布并网排队与已装机容量，但不公布在运电网级储能的规模分布。'],
      instead: ['100 MW as a modelling convention, stated as such. The named four-hour builds arriving in 2026 are larger — Ferdinand at 200 MW and Padua 2 at 150 MW — and are carried as named projects rather than as an average.',
                '按建模惯例采用100MW，并明确标示。2026年投运的具名四小时项目规模更大 — Ferdinand为200MW，Padua 2为150MW — 作为具名项目而非平均值使用。'] },
  ],

  lab: {
    /* ERCOT socialises transmission investment rather than allocating network
       upgrade cost to the interconnecting generator, which is the structural
       reason it is the easiest US market here to connect in. Zero here
       is a real zero rather than an unmodelled one. */
    connectionPerMW: 0,
    /* No US VAT; Texas sales-tax treatment of storage unverified. */
    vatPct: 0, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,

    /* 100 MW is a modelling convention. TWO hours is not: it is the ERCOT
       default, the basis TB2 and the published toll value are quoted on, and
       what roughly 97% of the planning-scenario fleet is.

       capexKWh 187.04 + capexKW 587.84 is NREL's $334/kWh four-hour benchmark
       decomposed on the platform's stack shares and re-assembled at two hours:
       2 × 187.04 × 1,000 + 587.84 × 1,000 = $961,920/MW.

       spread 19.5 $/MWh at 1.4 cycles a day reproduces comparison.js's $18,155
       arbitrage seed to within 0.1%: 2h × 0.94 usable × 1.4 × 365 × 0.97 avail =
       932 MWh/MW/yr, × $19.5 = $18,171. It is an executable margin after the
       duration scaling, NOT a raw TB2 spread. */
    mw: 100, hours: 2, capexKWh: 187.04, capexKW: 587.84, opexKW: 20,
    rte: 88, avail: 97, degr: 2.0, cycles: 1.4, spread: 19.5, optFee: 5,

    /* Zero, and a true zero. ERCOT has no capacity mechanism — scarcity reaches
       the asset through the ORDC adder inside the energy price, which is already
       inside the spread above. Adding a capacity line here would count it twice. */
    capPrice: 0, capYrs: 0,

    /* Ancillary services, forward, from comparison.js: $4,939/MW/yr = $4.94/kW/yr.
       NOT the $14.1k the fleet earned in 2025. */
    servicesKW: 4.94,

    /* The §48E ITC, seeded at zero here as it is in comparison.js. The editable
       0–37% range lives on the dedicated Investment Lab page. */
    grantPct: 0,

    /* SOFR 3.65% at the end of July 2026 plus a 225bp senior margin. */
    life: 20, disc: 8, debtPct: 60, rate: 5.9, tenor: 15,
  },

  glossary: [
    ['ERCOT — Electric Reliability Council of Texas', 'ERCOT — 德州电力可靠性委员会'],
    ['Energy-only market — no capacity mechanism of any kind', '纯电能量市场 — 不存在任何形式的容量机制'],
    ['Operating Reserve Demand Curve (ORDC) — how ERCOT prices scarcity', '运行备用需求曲线（ORDC） — ERCOT的稀缺定价方式'],
    ['Real-Time Co-optimization plus Batteries (RTC+B)', '实时联合优化（含储能）（RTC+B）'],
    ['ERCOT Contingency Reserve Service (ECRS)', 'ERCOT事故备用服务（ECRS）'],
    ['Responsive Reserve Service (RRS) and primary frequency response', '响应性备用服务（RRS）与一次调频响应'],
    ['Non-Spinning Reserve (Non-Spin) — still a four-hour product', '非旋转备用（Non-Spin） — 仍为四小时产品'],
    ['Regulation Up / Regulation Down', '上调调频/下调调频'],
    ['Locational Marginal Price (LMP) and resource-node settlement', '节点边际电价（LMP）与资源节点结算'],
    ['Congestion Revenue Rights (CRRs)', '拥塞收入权（CRRs）'],
    ['Load zones — West, South, Houston, North', '负荷区 — 西部、南部、休斯顿、北部'],
    ['Connect-and-manage interconnection', '“接入并管理”式并网'],
    ['Standard Generation Interconnection Agreement (SGIA)', '标准发电并网协议（SGIA）'],
    ['Large-load interconnection queue', '大负荷并网排队'],
    ['TB2 spread — two-hour top-bottom spread benchmark', 'TB2价差 — 两小时高低价差基准'],
    ['Tolling agreement / offtake agreement', '租赁协议/承购协议'],
    ['Chapter 313 — the lapsed Texas school-district value limitation', '第313章 — 已失效的德州学区估值限制'],
    ['§48E investment tax credit — 30% for standalone storage', '§48E投资税收抵免 — 独立储能30%'],
    ['FEOC / Material Assistance Cost Ratio (MACR) — pass or lose the credit', 'FEOC/实质协助成本比率（MACR） — 通过方可保留抵免，否则全额丧失'],
  ],

  kpiExport: [
    ['RTC+B go-live', '5 December 2025', 'date', 'official', 'ERCOT_SEED_V1', 'ERCOT'],
    ['ECRS duration requirement after RTC+B', 1, 'h', 'official', 'ERCOT_SEED_V1', 'ERCOT — cut from 2h'],
    ['RRS and Regulation duration requirement after RTC+B', 30, 'min', 'official', 'ERCOT_SEED_V1', 'ERCOT — cut from 1h'],
    ['RRS primary frequency response minimum', 1377, 'MW', 'official', 'ERCOT_SEED_V1', 'ERCOT 2026 AS Methodology'],
    ['Operational battery capacity entering 2026', 14, 'GW', 'third party', 'ERCOT_SEED_V1', 'Modo Energy'],
    ['Operational battery capacity, Q1 2026', 14.96, 'GW', 'third party', 'ERCOT_SEED_V1', 'Modo Energy'],
    ['Projected operational capacity by end-2030', 40, 'GW', 'third party forecast', 'ERCOT_SEED_V1', 'Modo Energy'],
    ['Fleet average duration', 1.6, 'h', 'third party', 'ERCOT_SEED_V1', 'Modo Energy'],
    ['Share of planning-scenario fleet at 1h or 2h', 97, '%', 'official', 'ERCOT_SEED_V1', 'ERCOT 2026 planning scenario'],
    ['Revenue index, CY2023', 193000, 'USD/MW/yr', 'third party', 'ERCOT_SEED_V1', 'Modo ME BESS ERCOT Index'],
    ['Revenue index, CY2024', 56000, 'USD/MW/yr', 'third party', 'ERCOT_SEED_V1', 'Modo ME BESS ERCOT Index'],
    ['Revenue index, CY2025', 29400, 'USD/MW/yr', 'third party', 'ERCOT_SEED_V1', 'Modo ME BESS ERCOT Index'],
    ['Revenue index, CY2025 — independent estimate', 17000, 'USD/MW/yr', 'third party', 'ERCOT_SEED_V1', 'Enverus — disagrees with Modo by 73%'],
    ['Ancillary share of battery revenue, 2023', 84, '%', 'third party', 'ERCOT_SEED_V1', 'Modo Energy'],
    ['Ancillary share of battery revenue, 2025', 48, '%', 'third party', 'ERCOT_SEED_V1', 'Modo Energy'],
    ['Ancillary revenue change since 2023', -90, '%', 'third party', 'ERCOT_SEED_V1', 'Enverus'],
    ['Executable two-hour arbitrage, modelled', 18155, 'USD/MW/yr', 'calculated', 'ERCOT_SEED_V1', 'dashboard — index energy leg × (2/1.6) × 0.95'],
    ['Ancillary available to a new entrant, modelled', 4939, 'USD/MW/yr', 'calculated', 'ERCOT_SEED_V1', 'dashboard — 14,112 × (14 GW ÷ 40 GW)'],
    ['Ancillary earned by the fleet, CY2025', 14112, 'USD/MW/yr', 'calculated', 'ERCOT_SEED_V1', 'dashboard — 48% of the index, the band ceiling'],
    ['Fleet revenue, June 2026 — record low', 1.11, 'USD/kW-month', 'third party', 'ERCOT_SEED_V1', 'Modo Energy — −43% YoY, −34% on May 2026 (1.67)'],
    ['Fleet revenue, July 2026', 1.42, 'USD/kW-month', 'third party', 'ERCOT_SEED_V1', 'Modo Energy — −30% YoY'],
    ['Published two-hour TB2 toll value, Aug 2025', 7.52, 'USD/kW-month', 'third party', 'ERCOT_SEED_V1', 'down 10% from 8.34 in May 2025'],
    ['Toll value annualised', 90240, 'USD/MW/yr', 'calculated', 'ERCOT_SEED_V1', 'dashboard — the merchant band ceiling'],
    ['Announced tolling agreements', 10, 'count', 'third party', 'ERCOT_SEED_V1', 'Modo Energy — covering ~1.6 GW'],
    ['Known tolled batteries', 12, 'count', 'third party', 'ERCOT_SEED_V1', 'Modo Energy — 5 operating, 7 due by end-2026'],
    ['Toll tenor precedent', 7, 'yr', 'third party', 'ERCOT_SEED_V1', 'Jupiter Power / Equilibrium Energy, Crossett 1'],
    ['Interconnection timeline', 4.2, 'yr', 'third party', 'ERCOT_SEED_V1', 'against 8+ years in PJM'],
    ['Large-load interconnection queue, August 2026', 474, 'GW', 'official', 'ERCOT_SEED_V1', 'ERCOT — about 90% data centres; data-centre interconnections paused 3 Aug 2026 pending audit'],
    ['2h installed capital cost, modelled', 961920, 'USD/MW', 'calculated', 'ERCOT_SEED_V1', 'NREL 4h $334/kWh decomposed and re-assembled at 2h'],
    ['§48E ITC for standalone storage', 30, '%', 'official', 'ERCOT_SEED_V1', 'IRC §48E — seeded at 0 in the model, editable in the Lab'],
    ['ERCOT toll price, any deal', 'not disclosed', '-', 'coverage gap', 'ERCOT_SEED_V1', 'ten announced agreements, zero published prices'],
    ['Duration split of the revenue index', 'not published', '-', 'coverage gap', 'ERCOT_SEED_V1', 'index is a single fleet average at ~1.6h'],
    ['Texas sales tax treatment of standalone storage', 'not verified', '-', 'coverage gap', 'ERCOT_SEED_V1', 'generation exemption scope unconfirmed'],
  ],
};

export { M };
