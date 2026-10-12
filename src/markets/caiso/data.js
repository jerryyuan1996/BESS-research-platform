/* ---------------------------------------------------------------------------
   CAISO — market dataset.

   Same shape as the PJM/ERCOT/NEM datasets in this lineage.

   FIVE THINGS ABOUT THIS PARTICULAR DATASET.

   1. `deratingCurve` is FLAT AT AND ABOVE FOUR HOURS, and that is the single most
      distinctive input in this market. The CPUC tests net qualifying capacity on
      sustained output over four hours and gives no additional RA credit beyond
      it — so unlike PJM, where the ELCC ladder pays nine points from four hours
      to six, a longer Californian battery earns exactly the same contracted
      revenue as a four-hour one. Four hours is a ceiling here, not a floor.

   2. The contracted line is the MAJORITY of revenue, which is true of no other
      market on this platform. RA at $8.77/kW-month against merchant nearer
      $2.5-3 means a Californian battery is substantially a capacity contract
      with a trading option attached.

   3. Both merchant legs are priced at the year-1 vintage and the ancillary
      saturation is carried by `servicesCurve`, per src/comparison/vintage.js.

   4. The lab seed reproduces src/markets/caiso/comparison.js. capexKWh 187.04 +
      capexKW 587.84 is NREL's $334/kWh on the platform's stack shares, the same
      decomposition PJM uses. spread 18.75 at 1.0 cycles a day reproduces the
      $24,960 arbitrage seed exactly. capPrice 105.24 is the RA benchmark in $k.

   5. Where a figure is not published — a specific project's RA price, the
      energy-versus-ancillary split, the RA tenor distribution, the residual in
      the published full stack — this file does not invent one.
   --------------------------------------------------------------------------- */

const M = {
  asOf: '2026-08-04',
  dataDate: 'H1 2025 RA benchmark / CY2025 merchant / Jul 2026 fleet',
  modelVersion: 'caiso-seed-1.0-bilateral-ra-four-hour-nqc-ceiling',
  title: ['CAISO Battery Investment Dashboard', 'CAISO储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application. Bilateral Resource Adequacy; reference archetype 100 MW / 4h.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。双边容量充裕度合约；参考原型为100MW/4小时。'],
  nextMilestone: ['Next milestone: the 2027 Resource Adequacy compliance year under Slice of Day, with storage qualifying capacity now cut for foldback (CPUC D.26-07-008) and unit-specific UCAP following in 2028 — and whether RA prices hold with 16.7 GW online against a queue in which batteries are about 46% of roughly 500 GW.',
                  '下一里程碑：分时段机制下的2027年容量充裕度合规年度 — 储能合格容量自该年度起因出力回落（foldback）被下调（CPUC D.26-07-008），机组级UCAP将于2028年跟进 — 以及在16.7GW在运、而约500GW排队中储能约占46%的背景下，容量充裕度价格能否维持。'],
  footerNote: ['Public and official sources collected 4 August 2026. CAISO publishes the Resource Adequacy framework in full — Slice of Day, the NQC methodology and the NQC values themselves — and no contract price at all, because RA is negotiated bilaterally. Reported RA has ranged $4.29–14.67/kW-month in unconstrained areas. The published full stack of $14.83/kW-month does not reconcile to the RA benchmark plus observed merchant, and the roughly $3/kW-month residual is recorded rather than allocated.',
               '公开及官方来源于2026年8月4日采集。CAISO完整公布容量充裕度制度框架 — 分时段机制、净合格容量方法及净合格容量数值本身 — 但完全不公布合约价格，因为容量充裕度采取双边协商。非受限区域已报告的容量充裕度价格区间为每kW每月$4.29–14.67。已公布的每kW每月$14.83全口径收入无法与容量充裕度基准加已观测市场化收入相调和，约$3/kW每月的残差予以记录而非分摊。'],
  seedWarn: ['Every value on this page is an approved base-case snapshot or an illustrative placeholder. No figure is production-complete until its live feed, validation and source-health check are running. Four specific warnings: Resource Adequacy is a bilateral contract with no clearing price, so the contracted band is the widest on this platform and a specific project\'s outcome depends on its counterparty; net qualifying capacity is tested on four-hour sustained output and pays nothing beyond it, so duration above four hours earns only spread; the published full-stack figure does not reconcile and the residual is unallocated; and the §48E investment tax credit is seeded at zero here and is editable in the dedicated Investment Lab page.',
             '本页所有数值均为已批准的基准情景快照或示例占位数据。在实时数据接入、校验及来源健康检测上线前，任何指标均不可用于生产决策。四点具体警示：容量充裕度是无出清价格的双边合约，因此其合同化区间为本平台最宽，且特定项目的结果取决于其交易对手；净合格容量按四小时持续出力测定，超出部分不予支付，故四小时以上时长仅能获得价差收入；已公布的全口径收入数据无法调和，残差未作分摊；§48E投资税收抵免在本页种子值为零，可在首页投资实验室中调整。'],

  official: {
    // ---- Resource Adequacy ----
    raPerKWMonth: 8.77, raPerMWYr: 105240, raYoYPct: 12, raPeriod: 'H1 2025',
    raRangeLo: 4.29, raRangeHi: 14.67, raTopEarner: 30,
    raAbove100Count: 82, raAbove100Period: '2023–2024',
    raTenorSeed: 10, raTenorLo: 5, raTenorHi: 15,
    ormatTenor: 15, ormatCounterparty: 'City of Riverside',
    nqcTestHours: 4, sodFromYear: 2025, sodSlices: 24,

    // ---- merchant ----
    merchPerKWMonth2025: 2.6, merchPerMWYr2025: 31200,
    merchSep25: 2.54, merchOct25: 2.99, merchJan26: 1.81, merchJun26: 2.55,
    merchJun26YoYPct: -16.9, merchDec25: 'record low',
    fullStackPerKWMonth: 14.83, fullStackResidual: 3,
    energyShareEstimatedPct: 80, asShareEstimatedPct: 20,

    // ---- fleet and queue ----
    fleet2024GW: 11.6, fleet2024GrowthPct: 45, fleet2026GW: 16.7,
    queueTotalGW: 500, queueBatterySharePct: 46,

    // ---- capex and tax ----
    nrelPerKWh: 334, usEpcLoPerKWh: 230, usEpcHiPerKWh: 320,
    itcPct: 30, itcThroughYear: 2033, itcTransferCents: 93,
    itcCeilingPct: 37, feocFromYear: 2026,
  },

  /* What a CAISO battery trades through. Note that the first entry is not a
     market at all — it is a contract signed months or years ahead, and it is
     most of the revenue. */
  gateCloses: [
    { id: 'RA',        n: ['Resource Adequacy contract', '容量充裕度合约'],
      when: ['Negotiated bilaterally, ahead of the compliance year', '在合规年度之前双边协商确定'],
      fit: ['Most of the revenue, and the only leg with a counterparty rather than a market', '收入的主体部分，也是唯一有交易对手而非面向市场的收入项'] },
    { id: 'Day-ahead', n: ['Day-ahead energy and ancillary', '日前电能量与辅助服务'],
      when: ['Bids close 10:00 PPT for the following operating day', '美太平洋时间10:00截标，交易次一运行日'],
      fit: ['Where the midday-to-evening spread is set', '午间至傍晚价差在此形成'] },
    { id: 'RTM',       n: ['Real-time market, 5-minute dispatch', '实时市场，5分钟调度'],
      when: ['Continuous', '连续进行'],
      fit: ['Settlement at the nodal price; the must-offer obligation applies to RA capacity', '按节点价格结算；容量充裕度容量须履行强制报价义务'] },
    { id: 'MOO',       n: ['Must-offer obligation', '强制报价义务'],
      when: ['Applies whenever RA capacity is contracted', '只要签有容量充裕度合约即适用'],
      fit: ['The constraint on the trading option: RA capacity must be offered, which is what the contract buys', '交易期权所受的约束：容量充裕度容量必须报价，这正是合约所购买的内容'] },
  ],

  /* CAISO's price regions. Unlike PJM's LDAs these do differentiate — both the
     nodal energy price and, through local capacity requirements, the RA price a
     project can command. */
  regions: [
    { id: 'SP15', n: ['SP15 — Southern California', 'SP15 — 南加州'],
      note: ['The largest load region and the deepest solar-driven midday trough. Local capacity requirements in the LA basin support RA prices above the unconstrained range.', '最大的负荷区域，也是光伏驱动的午间低谷最深之处。洛杉矶盆地的本地容量需求使容量充裕度价格高于非受限区间。'] },
    { id: 'NP15', n: ['NP15 — Northern California', 'NP15 — 北加州'],
      note: ['Hydro-influenced and less solar-saturated than the south; a different spread shape and a different RA position.', '受水电影响，光伏饱和程度低于南部；价差形态与容量充裕度状况均不同。'] },
    { id: 'ZP26', n: ['ZP26 — Central Valley', 'ZP26 — 中央谷地'],
      note: ['Between the two, and where much of the solar that creates the midday trough is sited.', '介于两者之间，形成午间低谷的大量光伏即位于此。'] },
  ],

  overall: { confidence: 64, codWindow: '2030–2032',
    rationale: ['The only US market where the contracted line is most of the revenue, and the only one on this platform where four hours is a ceiling rather than a floor. Resource Adequacy averaged $8.77/kW-month across H1 2025 against merchant earnings nearer $2.5–3, so a Californian battery is substantially a capacity contract with a trading option attached — and the CPUC tests net qualifying capacity on four-hour sustained output and pays nothing beyond it, so a longer asset earns only spread for its extra hours. The uncertainty is the inverse of everywhere else: the merchant band is narrow and the contracted band is the widest on the platform, because RA is negotiated deal by deal rather than cleared. Underwrite the counterparty, the tenor and the deliverability status. Then underwrite the queue, which has overtaken technology cost as the binding constraint on getting built at all.',
                '这是美国唯一一个合同化收入构成收入主体的市场，也是本平台唯一一个四小时构成上限而非下限的市场。2025年上半年容量充裕度平均为每kW每月$8.77，而市场化收入约为$2.5–3，因此加州储能实质上是一份附带交易期权的容量合约 — 且CPUC按四小时持续出力测定净合格容量，超出部分不予支付，故更长时长的资产其额外小时数仅能获得价差收入。此处的不确定性与其他各处恰恰相反：市场化区间较窄，而合同化区间为本平台最宽，因为容量充裕度是逐笔协商而非集中出清。承销依据应为交易对手、合约期限与可交付性状态。其次应评估并网排队 — 它已取代技术成本，成为项目能否建成的约束性瓶颈。'] },


  // ---- capacity channel: a ceiling at four hours ----
  /* The most distinctive derating curve on the platform. The CPUC tests net
     qualifying capacity on sustained output over FOUR hours and gives no
     additional credit beyond it, so the curve is flat from four hours upward.
     Below four hours it is stated as proportional to duration, which is an
     approximation of how a shorter asset fares across the Slice of Day slices
     rather than a published schedule — see notPublished. */
  deratingCurve: { 2: 0.50, 4: 1.00, 6: 1.00, 8: 1.00 },
  /* What re-contracting is worth after the first RA term — economics.postFactor. */
  futureCapFactor: 0.75,

  // ---- revenue ----
  /* RA against merchant, $/kW-month, on the same axis. This is the chart that
     explains why CAISO is a capacity market wearing a merchant market's clothes. */
  stackLabels: ['Resource Adequacy', 'Merchant (energy + ancillary)'],
  stackSeries: [8.77, 2.6],

  /* The merchant benchmark month by month, $/kW-month. Narrow, and small. */
  merchLabels: ['Sep 25', 'Oct 25', 'Jan 26', 'Jun 26'],
  merchSeries: [2.54, 2.99, 1.81, 2.55],

  /* Published RA dispersion, $/kW-month. The band the model carries, and the
     outliers it deliberately excludes. */
  raLabels: ['Reported low', 'Benchmark', 'Reported high', 'Top earners'],
  raSeries: [4.29, 8.77, 14.67, 30],

  spreadBridge: [
    { l: ['Resource Adequacy contract, H1 2025 benchmark', '容量充裕度合约，2025年上半年基准'], v: 105240, t: 'start' },
    { l: ['Merchant energy arbitrage (80% of the benchmark, estimated split)', '市场化电能量套利（基准的80%，拆分为估算值）'], v: 24960, t: 'd' },
    { l: ['Ancillary services (20% of the benchmark, estimated split)', '辅助服务（基准的20%，拆分为估算值）'], v: 6240, t: 'd' },
    { l: ['Total revenue before the optimiser fee and opex', '扣除优化商费用与运维成本前的总收入'], v: 136440, t: 'total' },
  ],

  evidenceLadder: [
    { n: ['1 · The CPUC Slice of Day framework and the CAISO NQC value for this resource', '1 · CPUC分时段机制框架及该资源的CAISO净合格容量数值'],
      d: ['Published in full and machine-readable. The rules by which a project qualifies are the best-documented part of this market.', '完整公布且可机读。项目取得资格所依据的规则是本市场记录最完善的部分。'] },
    { n: ['2 · The executed RA agreement, its price and its tenor', '2 · 已签署的容量充裕度协议及其价格与期限'],
      d: ['The majority of the revenue, and the only tier no CAISO source publishes. RA is negotiated bilaterally; benchmarks and ranges exist, a clearing price does not.', '收入的主体部分，也是CAISO任何来源均不公布的唯一层级。容量充裕度采取双边协商；存在基准与区间，但不存在出清价格。'] },
    { n: ['3 · Full-capacity deliverability status', '3 · 全容量可交付性状态'],
      d: ['An energy-only interconnection cannot sell Resource Adequacy at all, which removes most of the revenue on this page rather than reducing it.', '仅电能量并网的项目完全无法出售容量充裕度，这将移除本页大部分收入，而非仅使其减少。'] },
    { n: ['4 · Queue position and study timeline', '4 · 排队位置与研究周期'],
      d: ['Interconnection has overtaken technology cost as the binding constraint on CAISO deployment, with roughly 500 GW in the queue and batteries about 46% of it.', '并网已取代技术成本成为CAISO建设的约束性瓶颈，排队量约500GW，其中储能约占46%。'] },
    { n: ['5 · FEOC material-assistance documentation for the tax credit', '5 · 用于税收抵免的FEOC实质协助合规文件'],
      d: ['Binary and federal. Identical to PJM and ERCOT — the one tier that does not distinguish the three US markets.', '非此即彼，且属联邦层面。与PJM及ERCOT完全一致 — 是唯一不区分三个美国市场的层级。'] },
  ],

  // ---- duration ----
  durationPath: { years: ['2030', '2031', '2032'], hours: [4, 4, 4] },
  durConfigs: [2, 4, 6, 8],
  /* Per-MWh capture relative to the four-hour archetype. ILLUSTRATIVE — no CAISO
     TB2/TB6/TB8 series was located, unlike `deratingCurve` above where the
     four-hour ceiling is a published CPUC rule. */
  durSpreadFactor: { 2: 1.30, 4: 1.00, 6: 0.80, 8: 0.65 },
  usableFraction: 0.94,
  /* 4h → 6h, $k per nameplate MW per year. The RA line is ZERO because net
     qualifying capacity is tested on four hours and pays nothing beyond it — the
     single sharpest difference between this market and PJM, where the same step
     is worth nine ELCC points. Incremental capex is 2,000 kWh/MW at $187.04/kWh
     plus EPC, annualised over twenty years at 8%. */
  marginalHour: [
    { l: ['Incremental arbitrage — 1.5× the energy at 80% of the 4h capture rate', '增量套利 — 电量为1.5倍，捕获率为4小时的80%'], v: 5, t: 'd' },
    { l: ['Resource Adequacy — NQC is tested on four hours and pays nothing beyond it', '容量充裕度 — 净合格容量按四小时测定，超出部分不予支付'], v: 0, t: 'd' },
    { l: ['Ancillary services — power-based, does not scale with duration', '辅助服务 — 功率型，不随时长增长'], v: 0, t: 'd' },
    { l: ['Annualised incremental capex ($425k/MW, 20 yr at 8%)', '年化增量资本开支（每MW $425k，20年，8%）'], v: -43, t: 'd' },
    { l: ['Degradation and incremental opex', '衰减与增量运维'], v: -2, t: 'd' },
    { l: ['Net marginal value, hours 5–6', '第5–6小时净边际价值'], v: -40, t: 'total' },
  ],
  durFactors: [
    { n: ['NQC is tested on four hours and pays nothing beyond it', '净合格容量按四小时测定，超出部分不予支付'], w: 20, s: 0 },
    { n: ['Deep solar-driven midday trough and negative prices', '光伏驱动的深度午间低谷与负电价'], w: 16, s: 3 },
    { n: ['Evening net-load ramp after sunset', '日落后的晚间净负荷爬坡'], w: 14, s: 3 },
    { n: ['US installed cost after tariffs and domestic-content premium', '计入关税与本土含量溢价后的美国安装成本'], w: 14, s: 1 },
    { n: ['Degradation threatens the four-hour NQC test itself', '衰减威胁四小时净合格容量测试本身'], w: 12, s: 2 },
    { n: ['Ancillary services do not pay for duration', '辅助服务不为时长付费'], w: 10, s: 0 },
    { n: ['Spread-capture decay at longer duration', '更长时长的价差捕获衰减'], w: 8, s: 1 },
    { n: ['Long-duration procurement outside the RA framework', '容量充裕度框架之外的长时储能采购'], w: 6, s: 1 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Shallow-shift market', '浅移峰市场'], c: 'info',
      d: ['1–2h suffices; MWh beyond that is unpaid capital. Not California — the midday trough is too deep.', '1–2小时已足够；超出部分的MWh属无回报资本。加州并非如此 — 其午间低谷过深。'] },
    { lo: 35, hi: 54, n: ['Transition to 4h', '向4小时过渡'], c: 'warn',
      d: ['Four hours is the RA test and the fleet standard. Build to it.', '四小时是容量充裕度的测定标准，也是行业标准配置。应据此建设。'] },
    { lo: 55, hi: 69, n: ['4h is the ceiling, not the floor', '4小时是上限而非下限'], c: 'serious',
      d: ['This is where CAISO sits. Four hours captures the full RA credit; the fifth hour earns spread only, and the marginal-hour waterfall shows it does not clear.', 'CAISO正处于此区间。四小时可获得全部容量充裕度信用；第五小时仅能获得价差收入，而边际小时瀑布图显示其无法实现盈亏平衡。'] },
    { lo: 70, hi: 100, n: ['Beyond 4h — needs a different buyer', '超过4小时 — 需要不同的买方'], c: 'good',
      d: ['Would require procurement outside the RA framework, because RA itself stops paying at four hours.', '这需要容量充裕度框架之外的采购机制，因为容量充裕度本身在四小时处即停止支付。'] },
  ],
  augItems: [
    ['Land reserved for additional enclosures', '预留新增电池舱用地'],
    ['DC collection and containerised expansion capacity', '直流汇集与集装箱式扩容能力'],
    ['Transformer and switchgear headroom', '变压器与开关设备裕度'],
    ['PCS and EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['Augmentation restores the four-hour NQC test as the asset degrades', '增容可在资产衰减后恢复四小时净合格容量测试结果'],
    ['Full-capacity deliverability survives the change', '变更后仍保留全容量可交付性'],
    ['RA counterparty consent to the augmentation', '容量充裕度交易对手对增容的同意'],
    ['FEOC material-assistance ratio survives the added equipment', '新增设备后仍满足FEOC实质协助比率'],
    ['CEQA and local permitting headroom', 'CEQA与地方许可裕度'],
    ['OEM warranty continuity across the augmentation', 'OEM质保在增容后延续'],
  ],
  /* Note the fifth row scores high by default: in CAISO augmentation is not about
     adding hours, it is about keeping the four-hour NQC test passable as the
     battery fades. That is a different reason from every other market here. */
  augDefaults: [2, 2, 2, 2, 3, 2, 1, 1, 1, 1],

  // ---- pipeline ----
  stages: [
    { id: 'op',   n: ['Operating and dispatching', '已投运并参与调度'], p: 100 },
    { id: 'comm', n: ['Commissioning / phased energisation', '调试中/分阶段送电'], p: 93 },
    { id: 'con',  n: ['Under construction, financial close reached', '在建，已融资交割'], p: 88 },
    { id: 'ra',   n: ['RA agreement executed with an LSE', '已与负荷服务实体签署容量充裕度协议'], p: 72 },
    { id: 'fcds', n: ['Full-capacity deliverability status awarded', '已取得全容量可交付性资格'], p: 55 },
    { id: 'gia',  n: ['Generator interconnection agreement signed', '已签署发电并网协议'], p: 44 },
    { id: 'que',  n: ['In the interconnection queue', '在并网排队中'], p: 8 },
    { id: 'ann',  n: ['Announced only', '仅公告'], p: 4 },
  ],
  /* Seed examples. CAISO publishes NQC values by resource but not a project-level
     development pipeline with dates and owners, so no named development project
     is carried — the same position PJM is in and the opposite of ERCOT, where
     tolled assets are publicly announced. */
  projects: [
    { n: 'CAISO seed example A', region: 'SP15', mw: 100, h: 4, cod: 2030, st: 'op' },
    { n: 'CAISO seed example B', region: 'SP15', mw: 200, h: 4, cod: 2030, st: 'comm' },
    { n: 'CAISO seed example C', region: 'ZP26', mw: 150, h: 4, cod: 2030, st: 'con' },
    { n: 'CAISO seed example D', region: 'SP15', mw: 250, h: 4, cod: 2031, st: 'ra' },
    { n: 'CAISO seed example E', region: 'NP15', mw: 100, h: 4, cod: 2031, st: 'ra' },
    { n: 'CAISO seed example F', region: 'ZP26', mw: 120, h: 4, cod: 2031, st: 'fcds' },
    { n: 'CAISO seed example G', region: 'SP15', mw: 300, h: 4, cod: 2032, st: 'fcds' },
    { n: 'CAISO seed example H', region: 'NP15', mw: 80,  h: 8, cod: 2032, st: 'gia' },
    { n: 'CAISO seed example I', region: 'ZP26', mw: 200, h: 4, cod: 2032, st: 'que' },
    { n: 'CAISO seed example J', region: 'SP15', mw: 150, h: 4, cod: 2032, st: 'ann' },
  ],


  reinforcements: [
    { n: ['Slice of Day Resource Adequacy framework', '分时段容量充裕度框架'], operator: 'CPUC', region: ['State-wide', '全州'], gw: null,
      cls: 'design', scope: ['RA obligations redefined across 24 hourly slices from 2025, with a storage excess-capacity test ensuring batteries can be charged over the critical net-peak hours.', '自2025年起，容量充裕度义务按24个小时时段重新定义，并设有储能富余容量测试，确保电池能在关键净峰时段完成充电。'],
      year: 2025, status: ['In force — the framework this market now contracts under', '已生效 — 本市场目前据以签约的框架'], c: 'good' },
    { n: ['Four-hour NQC test', '四小时净合格容量测试'], operator: 'CPUC / CAISO', region: ['State-wide', '全州'], gw: null,
      cls: 'design', scope: ['Net qualifying capacity determined from tested sustained output over four hours, with no additional credit for longer duration.', '净合格容量依据四小时持续出力测试结果确定，更长时长不予额外计入。'],
      year: 2026, status: ['In force — and the reason four hours is a ceiling here', '已生效 — 也是四小时在此构成上限的原因'], c: 'warn' },
    { n: ['Interconnection queue reform', '并网排队改革'], operator: 'CAISO', region: ['State-wide', '全州'], gw: 500,
      cls: 'process', scope: ['Roughly 500 GW of generation and storage in the queue, with batteries about 46% of it. Interconnection has overtaken technology cost as the binding constraint on deployment.', '排队中的发电与储能项目约500GW，其中储能约占46%。并网已取代技术成本成为建设的约束性瓶颈。'],
      year: null, status: ['Ongoing — no completion date, and the binding constraint on this market', '持续进行中 — 无完成日期，且构成本市场的约束性瓶颈'], c: 'critical' },
  ],

  planClasses: [
    { id: 'design', n: ['Market design, in force', '市场机制，已生效'], c: 'good',
      d: ['A rule already operating with published parameters. In CAISO these are unusually strong evidence: the Slice of Day framework and the four-hour NQC test are both published in full and both directly set what a battery is paid.', '已在运行且参数公开的规则。在CAISO，此类证据异常有力：分时段框架与四小时净合格容量测试均已完整公布，且二者直接决定储能所获报酬。'] },
    { id: 'process', n: ['Process reform, ongoing', '流程改革，持续进行'], c: 'critical',
      d: ['A reform with no completion date. The queue is the clearest case: it is the binding constraint on this market and nothing published says when it stops being one.', '没有完成日期的改革。排队是最清晰的例证：它是本市场的约束性瓶颈，而没有任何公开信息说明这一状况何时终结。'] },
  ],

  notPublished: [
    { item: ['RA price for a specific project', '特定项目的容量充裕度价格'],
      status: ['No clearing price exists', '不存在出清价格'],
      why: ['Resource Adequacy is negotiated bilaterally between load-serving entities and generators. Benchmarks and ranges are published; an individual contract price is not, and there is no auction to clear one.',
            '容量充裕度由负荷服务实体与发电方双边协商确定。基准值与区间已公布；单笔合约价格未公布，且不存在可供出清的拍卖机制。'],
      instead: ['The $8.77/kW-month H1 2025 benchmark as the seed, with the reported $4.29–14.67/kW-month unconstrained-area range as the band. That band is the widest contracted band on this platform and it is wide for a structural reason, not for lack of evidence.',
                '以2025年上半年每kW每月$8.77的基准作为种子值，并以已报告的非受限区域每kW每月$4.29–14.67区间作为波动范围。该区间为本平台最宽的合同化区间，其宽度源于结构性原因而非证据不足。'] },
    { item: ['Reconciliation of the published full stack', '已公布全口径收入的调和'],
      status: ['Unresolved — roughly $3/kW-month unexplained', '未解决 — 约每kW每月$3无法解释'],
      why: ['A full CAISO stack of $14.83/kW-month is reported for 2025 with an RA contract in place. RA benchmarked at $8.77 and merchant ran $2.5–3. The residual is not explained by any source located.',
            '据报道，2025年在签有容量充裕度合约的情况下，CAISO全口径收入为每kW每月$14.83。容量充裕度基准为$8.77，市场化收入为$2.5–3。其残差无法由所找到的任何来源解释。'],
      instead: ['Nothing. The residual is recorded here rather than allocated to a leg, because assigning an unexplained figure to either would fabricate precision. The model carries RA plus observed merchant and no more.',
                '不作任何处理。该残差在此记录而非分摊至某一收入项，因为将无法解释的数值归入任一项都会制造虚假的精确度。模型仅计入容量充裕度加已观测市场化收入，不作额外计算。'] },
    { item: ['Energy versus ancillary split of the merchant benchmark', '市场化收入基准中电能量与辅助服务的拆分'],
      status: ['Not published', '未公布'],
      why: ['The CAISO merchant benchmark is a single combined figure for energy arbitrage and ancillary services. No decomposition was located.',
            'CAISO市场化收入基准是电能量套利与辅助服务合并的单一数值。未找到相应拆解数据。'],
      instead: ['An estimated 80/20 split, labelled estimated wherever it is used and applied identically to all three forward cases so that the vintage rule is not broken by it.',
                '采用估算的80/20拆分，在所有使用之处均标注为估算值，并对三种前瞻情形一致适用，以免因此破坏口径年度规则。'] },
    { item: ['RA contract tenor distribution', '容量充裕度合约期限分布'],
      status: ['Not published', '未公布'],
      why: ['Tenors are negotiated and mostly unpublished. The longest publicly named is Ormat\'s fifteen-year agreement with the City of Riverside.',
            '合约期限由协商确定且多数未公开。已具名公开的最长期限为Ormat与Riverside市签订的十五年协议。'],
      instead: ['Ten years as the seed with a 5–15 year band, the high end observed and the low end reflecting the shorter rolling contracts that make up much of the market.',
                '以十年作为种子值，波动区间为5–15年；上限为实测值，下限反映构成市场大部分的较短期滚动合约。'] },
    { item: ['NQC treatment below four hours', '四小时以下的净合格容量处理方式'],
      status: ['Not published as a schedule', '未以对照表形式公布'],
      why: ['The four-hour test and the absence of credit beyond it are published. How a shorter asset is credited across the 24 Slice of Day slices is resource-specific rather than a published curve.',
            '四小时测试标准及超出部分不予计入的规定均已公布。但更短时长资产在24个分时段中如何计入信用属资源专项事项，而非公布的曲线。'],
      instead: ['A proportional-to-duration approximation below four hours, stated as one. Above four hours the curve is flat and that IS the published rule.',
                '四小时以下采用与时长成比例的近似处理，并已明确标示。四小时以上曲线保持平坦，而这正是已公布的规则。'] },
    { item: ['US fixed opex, $/MW/yr', '美国固定运维成本，每MW每年'],
      status: ['No published series', '无公开序列'],
      why: ['No US operator or ISO publishes a fixed opex figure for grid-scale storage. One national-laboratory figure exists: NREL selects 4% of capital cost a year for a four-hour battery, from the high end of published values, because it includes the capacity additions that hold a system at its rating (Cost Projections for Utility-Scale Battery Storage: 2025 Update, page 11). The seed here is the maintenance-only end and is paired with a market line that degrades, so the two are not the same measure. PJM and ERCOT carry the same gap.',
            '美国没有运营商或独立系统运营机构公布电网级储能的固定运维成本。国家实验室的数字只有一个：NREL针对四小时电池取每年为投资成本的4%，该值取自公开数值的高端，因为它包含了使系统维持额定容量的容量增补（《公用事业级电池储能成本预测：2025年更新》第11页）。此处的种子值属于仅含日常维护的低端，并与逐年衰减的市场化收入配套使用，两者并非同一口径。PJM与ERCOT存在相同缺口。'],
      instead: ['$20,000/MW/yr, held equal across all three US markets and the NEM.',
                '采用每MW每年$20,000，在三个美国市场与NEM之间保持一致。'] },
  ],

  lab: {
    connectionPerMW: 0,
    vatPct: 0, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,

    /* 100 MW is a modelling convention. FOUR hours is not: it is what the CPUC
       tests net qualifying capacity on, and nothing beyond it is credited.

       capexKWh 187.04 + capexKW 587.84 is NREL's $334/kWh on the platform's
       stack shares — the identical decomposition PJM uses.

       spread 18.75 $/MWh at 1.0 cycles a day reproduces comparison.js's $24,960
       arbitrage seed exactly: 4h × 0.94 usable × 1.0 × 365 × 0.97 avail =
       1,331.2 MWh/MW/yr, × $18.75 = $24,960. */
    mw: 100, hours: 4, capexKWh: 187.04, capexKW: 587.84, opexKW: 20,
    rte: 88, avail: 97, degr: 2.0, cycles: 1.0, spread: 18.75, optFee: 5,

    /* The RA benchmark in $k per MW per year, on a ten-year contract. */
    capPrice: 105.24, capYrs: 10,

    /* Ancillary at the year-1 vintage, from comparison.js. */
    servicesKW: 6.24,

    grantPct: 0,
    life: 20, disc: 8, debtPct: 60, rate: 5.9, tenor: 15,
  },

  glossary: [
    ['CAISO — California Independent System Operator', 'CAISO — 加州独立系统运营机构'],
    ['Resource Adequacy (RA) — bilateral capacity contracting', '容量充裕度（RA） — 双边容量签约'],
    ['Load-serving entity (LSE) — the RA counterparty', '负荷服务实体（LSE） — 容量充裕度合约对手'],
    ['Net Qualifying Capacity (NQC) — tested on four-hour sustained output', '净合格容量（NQC） — 按四小时持续出力测定'],
    ['Slice of Day — hourly RA obligations across 24 slices', '分时段机制 — 按24个小时时段确定容量充裕度义务'],
    ['Storage excess-capacity test', '储能富余容量测试'],
    ['Full-capacity deliverability status versus energy-only', '全容量可交付性资格与仅电能量资格'],
    ['Local capacity area', '本地容量区'],
    ['Must-offer obligation', '强制报价义务'],
    ['SP15 / NP15 / ZP26 — the price regions', 'SP15/NP15/ZP26 — 价格区域'],
    ['Midday trough — solar-driven negative prices', '午间低谷 — 光伏驱动的负电价'],
    ['CEQA — California Environmental Quality Act review', 'CEQA — 加州环境质量法案审查'],
    ['CPUC — California Public Utilities Commission', 'CPUC — 加州公用事业委员会'],
    ['§48E investment tax credit — 30% for standalone storage', '§48E投资税收抵免 — 独立储能30%'],
    ['FEOC / Material Assistance Cost Ratio (MACR)', 'FEOC/实质协助成本比率（MACR）'],
  ],

  kpiExport: [
    ['RA capacity price benchmark, H1 2025', 8.77, 'USD/kW-month', 'third party', 'CAISO_SEED_V1', 'Modo Energy — up more than 12% YoY'],
    ['RA capacity price, annualised', 105240, 'USD/MW/yr', 'calculated', 'CAISO_SEED_V1', 'dashboard — 8.77 × 12 × 1,000'],
    ['Reported RA range, unconstrained areas — low', 4.29, 'USD/kW-month', 'third party', 'CAISO_SEED_V1', 'the model band floor'],
    ['Reported RA range, unconstrained areas — high', 14.67, 'USD/kW-month', 'third party', 'CAISO_SEED_V1', 'the model band ceiling'],
    ['NQC test duration', 4, 'h', 'official', 'CAISO_SEED_V1', 'CPUC — no additional credit beyond four hours'],
    ['Merchant revenue, September 2025', 2.54, 'USD/kW-month', 'third party', 'CAISO_SEED_V1', 'Modo Energy'],
    ['Merchant revenue, January 2026', 1.81, 'USD/kW-month', 'third party', 'CAISO_SEED_V1', 'Modo Energy — the band floor'],
    ['Storage QC adjusted for foldback from', 2027, 'RA year', 'official', 'CAISO_SEED_V1', 'CPUC D.26-07-008, 2 Jul 2026 — haircut not published; not in the model'],
    ['Unit-specific UCAP for storage from', 2028, 'RA year', 'official', 'CAISO_SEED_V1', 'CPUC D.26-07-008 — forced-outage based; not in the model'],
    ['Merchant revenue, June 2026', 2.55, 'USD/kW-month', 'third party', 'CAISO_SEED_V1', 'Modo Energy — −16.9% YoY'],
    ['Published full stack with RA, 2025', 14.83, 'USD/kW-month', 'third party', 'CAISO_SEED_V1', 'does not reconcile — ~$3 residual unallocated'],
    ['Battery fleet, early 2026', 15, 'GW', 'third party', 'CAISO_SEED_V1', 'from 11.6 GW in 2024 after 45% growth'],
    ['Interconnection queue', 500, 'GW', 'third party', 'CAISO_SEED_V1', 'batteries about 46% of it'],
    ['4h installed capital cost', 1336000, 'USD/MW', 'official', 'CAISO_SEED_V1', 'NREL 2025 update — same basis as PJM'],
    ['§48E ITC for standalone storage', 30, '%', 'official', 'CAISO_SEED_V1', 'seeded at 0 in the model, editable in the Lab'],
    ['RA price for a specific project', 'not published', '-', 'coverage gap', 'CAISO_SEED_V1', 'bilateral; no clearing price exists'],
    ['Energy versus ancillary split', 'estimated', '-', 'coverage gap', 'CAISO_SEED_V1', '80/20, no published decomposition'],
    ['Full-stack residual', 'unallocated', '-', 'coverage gap', 'CAISO_SEED_V1', '~$3/kW-month unexplained'],
  ],
};

export { M };
