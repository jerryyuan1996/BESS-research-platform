/* ---------------------------------------------------------------------------
   Great Britain 鈥?market dataset, verbatim from the prototype (lines 1365-1631).

   Everything the dashboard shows: official snapshot values, scorecards, bands,
   de-rating and duration curves, the project pipeline, lab defaults and the
   per-tab narrative content. Not one value was changed by the migration.
   --------------------------------------------------------------------------- */

const M = {
  asOf: '2026-07-26',
  dataDate: 'TTM Apr 2026 / DY 2029-30',
  modelVersion: 'gb-seed-1.0-cm-structure-sem-benchmark',
  title: ['Great Britain Battery Investment Dashboard', '英国储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。'],
  nextMilestone: ['Next milestone: T-4 2030/31 auction parameters and the next Gate 2 offer tranche', '下一里程碑：T-4 2030/31拍卖参数及下一批Gate 2要约'],
  footerNote: ['Public and official sources re-verified 26 July 2026; Irish SEM data (Jul 2026) is held in a separate peer namespace and excluded from GB scoring. Northern Ireland is out of scope — it is covered in the Ireland dashboard.',
               '公开及官方来源已于2026年7月26日重新核验；爱尔兰SEM数据（2026年7月）保存在独立同业命名空间，不计入英国评分。北爱尔兰不在本看板范围内，由爱尔兰看板覆盖。'],
  seedWarn: ['Every value on this page is a GB_SEED_V1 snapshot or an illustrative placeholder. No KPI is production-complete until its live ingestion, validation and source-health check are operational. De-rated MW is never nameplate MW; a Gate 2 offer is never an energisation date; realised revenue is never theoretical revenue.',
             '本页所有数值均为GB_SEED_V1种子快照或示例占位数据。在实时抓取、校验及源健康检测上线前，任何KPI均不可用于生产决策。折减后MW不等于铭牌MW；Gate 2要约不等于送电日期；实际收入不等于理论收入。'],

  // ---- official snapshot ----
  official: {
    t4Price: 27.10, t4DY: '2029/30', t4AwardedMW: 40108.6,
    t1Price: 5.00, t1DY: '2026/27', t1AwardedMW: 7192.3,
    cmAgreementYears: 15,
    cp2030BatteryGW: [23, 27], cp2030LdesGW: [4, 6], batteryBaselineGW: 4.5, ldesBaselineGW: 2.9,
    ldesWindow1Projects: 16,
    fleetGW: 6.5, fleetAvgHours: 1.7, pipelineAvgHours: 2.2,
  },

  overall: { statusL: ['Selective', '选择性投资'], chipCls: 'warn', confidence: 74, codWindow: '2028–2030',
    rationale: ['A diversified revenue stack remains, but returns are now set by connection certainty, realised BM dispatch and saturation — not by a generic storage-scarcity thesis.',
                '收入来源仍然多元，但收益已由并网确定性、平衡机制实际调度与市场饱和决定，而非笼统的“储能稀缺”逻辑。'] },
  components: [
    { n: ['Wholesale & Balancing Mechanism outlook', '批发与平衡机制前景'], w: 20, s: 64 },
    { n: ['Grid connection & planning risk', '并网与规划风险'], w: 20, s: 58 },
    { n: ['Capacity Market outlook', '容量市场前景'], w: 15, s: 50 },
    { n: ['Duration & LDES need', '时长与长时储能需求'], w: 15, s: 68 },
    { n: ['Pipeline saturation', '管线饱和度'], w: 10, s: 48 },
    { n: ['Financing & contracted structures', '融资与合同结构'], w: 10, s: 62 },
    { n: ['System-services outlook', '系统服务前景'], w: 10, s: 34 },
  ],

  // ---- Capacity Market ----
  cmYears: ['24/25', '25/26', '26/27', '27/28', '28/29', '29/30'],
  t4Series: [18.00, 30.59, 63.00, 65.00, 60.00, 27.10],
  t1Years: ['22/23', '23/24', '24/25', '25/26', '26/27'],
  t1Series: [75.00, 60.00, 35.79, 20.00, 5.00],
  derateHours: [1, 2, 4, 6, 8, 10, 12],
  derateVintages: {
    'T-4 2028/29': [0.11, 0.25, 0.48, 0.66, 0.79, 0.88, 0.95],
    'T-4 2029/30': [0.09, 0.22, 0.45, 0.63, 0.77, 0.86, 0.94],
  },
  deratingCurve: { 1: 0.09, 2: 0.22, 4: 0.45, 6: 0.63, 8: 0.77, 10: 0.86, 12: 0.94 },

  // ---- wholesale & BM ----
  bmRevenueByDur: { 1: 55000, 2: 73145, 4: 86200, 6: 91800, 8: 95600 },
  revShare: [
    { n: ['Balancing Mechanism', '平衡机制'], pct: 39, c: 'var(--s1)' },
    { n: ['Day-ahead', '日前'], pct: 38, c: 'var(--s2)' },
    { n: ['Intraday', '日内'], pct: 14, c: 'var(--s3)' },
    { n: ['Imbalance', '不平衡结算'], pct: 9, c: 'var(--muted)' },
  ],
  realisedRatio: { fleetMedian: 0.82, strong: 0.92, weak: 0.65 },
  skipRate: 0.34,
  buildYears: ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032'],
  buildLow:     [5.6, 6.5, 7.8, 9.5, 11.0, 12.5, 13.5, 14.5],
  buildCentral: [5.6, 6.5, 8.5, 11.0, 13.5, 16.0, 18.0, 19.5],
  buildHigh:    [5.6, 6.5, 9.5, 13.0, 16.5, 20.0, 23.0, 25.0],
  avgDurByYear: [1.6, 1.7, 1.8, 1.9, 2.1, 2.2, 2.3, 2.4],
  compression2h: {
    LOW:     [1.00, 1.00, 0.97, 0.94, 0.91, 0.89, 0.88, 0.87],
    CENTRAL: [1.00, 1.00, 0.94, 0.88, 0.83, 0.79, 0.76, 0.74],
    HIGH:    [1.00, 1.00, 0.90, 0.81, 0.74, 0.68, 0.64, 0.61],
  },
  spreadBridge: [
    { l: ['Theoretical perfect-foresight 2h spread value', '理论完全预见2小时价差价值'], v: 112, t: 'start' },
    { l: ['Forecast error & gate-closure execution', '预测误差与闭市执行'], v: -11, t: 'd' },
    { l: ['Round-trip efficiency loss (88%)', '往返效率损失(88%)'], v: -9, t: 'd' },
    { l: ['BM skip rate (34% of instructions)', '平衡机制跳过率(34%)'], v: -8, t: 'd' },
    { l: ['Availability, cycling & warranty limits', '可用率、循环与质保限制'], v: -5, t: 'd' },
    { l: ['Network charges (TNUoS / DUoS / BSUoS)', '网络费用(TNUoS/DUoS/BSUoS)'], v: -6, t: 'd' },
    { l: ['Optimiser fee (~10% of gross)', '优化商费用(约毛收入10%)'], v: -8, t: 'd' },
    { l: ['Realised net revenue', '实际净收入'], v: 65, t: 'total' },
  ],

  // ---- system services ----
  services: [
    { code: 'DC', n: ['Dynamic Containment', '动态遏制'], reqMW: 1200, procMW: 1180, price: 2.90, share: 97, qualMW: 5400, yoy: -25 },
    { code: 'DM', n: ['Dynamic Moderation', '动态调节'], reqMW: 350, procMW: 345, price: 3.80, share: 99, qualMW: 2100, yoy: -30 },
    { code: 'DR', n: ['Dynamic Regulation', '动态调整'], reqMW: 450, procMW: 440, price: 4.10, share: 98, qualMW: 2480, yoy: -28 },
    { code: 'BR', n: ['Balancing Reserve', '平衡备用'], reqMW: 900, procMW: 880, price: 5.00, share: 88, qualMW: 2340, yoy: -12 },
    { code: 'QR', n: ['Quick Reserve', '快速备用'], reqMW: 650, procMW: 610, price: 6.50, share: 85, qualMW: 1240, yoy: -8 },
    { code: 'SR', n: ['Slow Reserve', '慢速备用'], reqMW: 500, procMW: 430, price: 3.90, share: 55, qualMW: 700, yoy: null },
  ],

  // ---- duration ----
  durationPath: { years: ['2028', '2029', '2030', '2031'], hours: [2, 2, 4, 4] },
  durConfigs: [1, 2, 4, 6, 8],
  durSpreadFactor: { 1: 1.14, 2: 1.00, 4: 0.84, 6: 0.72, 8: 0.63 },
  usableFraction: 0.94,
  futureCapFactor: 0.6,
  dilution: { 2028: 1.06, 2029: 1.00, 2030: 0.92, 2031: 0.85 },
  events: {
    highPrice: { p50: 2.5, p90: 5.5, p99: 9.0 },
    windDrought: { p50: 8, p90: 18, p99: 36 },
  },
  durFactors: [
    { n: ['Residual-load & high-price-event duration', '剩余负荷及高价事件时长'], w: 12, s: 2 },
    { n: ['Wind-drought tail', '低风事件尾部风险'], w: 12, s: 2 },
    { n: ['Thermal / nuclear retirement gap', '火电与核电退役缺口'], w: 10, s: 2 },
    { n: ['Interconnector stress contribution', '互联线路紧张时段贡献'], w: 8, s: 1 },
    { n: ['Capacity Market de-rating uplift', '容量市场折减系数增益'], w: 12, s: 2 },
    { n: ['LDES cap-and-floor policy signal', '长时储能上下限机制信号'], w: 12, s: 2 },
    { n: ['System-services market saturation', '系统服务市场饱和度'], w: 8, s: 3 },
    { n: ['Longer-duration merchant signal', '更长时长市场化信号'], w: 10, s: 1 },
    { n: ['Constraint & regional balancing need', '拥塞与区域平衡需求'], w: 8, s: 2 },
    { n: ['Pipeline MW versus MWh', '管线MW与MWh对比'], w: 8, s: 2 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Short-duration market', '短时市场'], c: 'info',
      d: ['1–2h remains sufficient; do not add MWh without contract value.', '1–2小时仍然足够；无合同价值时不宜增配MWh。'] },
    { lo: 35, hi: 54, n: ['Transition zone', '过渡区间'], c: 'warn',
      d: ['Build 2h with augmentation optionality and re-test each auction vintage.', '按2小时建设并保留增容选择权，每个拍卖年份重新检验。'] },
    { lo: 55, hi: 69, n: ['Duration-value inflection', '时长价值拐点'], c: 'serious',
      d: ['Underwrite 4h; compare de-rating uplift against incremental MWh capex.', '按4小时测算；以折减系数增益对比增量MWh造价。'] },
    { lo: 70, hi: 100, n: ['Long-duration / policy-driven', '长时/政策驱动'], c: 'good',
      d: ['8h+ becomes a separate contracted asset class under cap-and-floor.', '8小时以上在上下限机制下成为独立的合同化资产类别。'] },
  ],
  augItems: [
    ['Land reserved for additional enclosures', '预留新增电池舱用地'],
    ['DC collection system expansion capacity', '直流汇集系统扩容能力'],
    ['Transformer & switchgear headroom', '变压器与开关设备裕度'],
    ['PCS & EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['Planning consent covers the added MWh', '规划许可覆盖新增MWh'],
    ['Connection agreement unaffected by MWh-only augmentation', '仅增MWh不影响并网协议'],
    ['OEM / LTSA augmentation rights', 'OEM/长期服务协议增容权利'],
    ['Financing consent & reserve-account treatment', '融资同意与储备账户安排'],
    ['CM agreement compliance after augmentation', '增容后容量市场协议合规'],
  ],
  augDefaults: [2, 2, 1, 2, 1, 1, 1, 1, 1],

  // ---- pipeline ----
  stages: [
    { id: 'op',  n: ['Operating', '已投运'], p: 100 },
    { id: 'uc',  n: ['Under construction, financial close & firm connection', '在建，已融资交割且并网确定'], p: 90 },
    { id: 'fid', n: ['FID / financed, Gate 2 + implementable consent', '已FID/融资，Gate 2及可实施许可'], p: 85 },
    { id: 'g2p', n: ['Gate 2, consented, procurement advanced', 'Gate 2，已许可，采购推进中'], p: 75 },
    { id: 'g2c', n: ['Gate 2 & consented, no financing', 'Gate 2且已许可，未融资'], p: 60 },
    { id: 'g2i', n: ['Gate 2 but planning / land incomplete', 'Gate 2但规划/土地未完成'], p: 45 },
    { id: 'g1',  n: ['Gate 1 with secured land & planning progress', 'Gate 1，土地已控且规划推进'], p: 25 },
    { id: 'ann', n: ['Announced / early development only', '仅公告/早期开发'], p: 10 },
  ],
  projects: [
    { n: 'Seed example Alder',   region: 'North West',   mw: 100, h: 2, cod: 2027, st: 'uc' },
    { n: 'Seed example Birch',   region: 'Yorkshire',    mw: 150, h: 2, cod: 2027, st: 'fid' },
    { n: 'Seed example Coppice', region: 'East Midlands',mw: 200, h: 1, cod: 2028, st: 'g2p' },
    { n: 'Seed example Dunlin',  region: 'Scotland',     mw: 300, h: 2, cod: 2028, st: 'g2c' },
    { n: 'Seed example Eider',   region: 'South West',   mw: 250, h: 4, cod: 2029, st: 'g2i' },
    { n: 'Seed example Fenwick', region: 'North East',   mw: 400, h: 2, cod: 2029, st: 'g2c' },
    { n: 'Seed example Garnet',  region: 'Wales',        mw: 350, h: 4, cod: 2030, st: 'g1' },
    { n: 'Seed example Heron',   region: 'East of England', mw: 500, h: 4, cod: 2030, st: 'ann' },
    { n: 'Seed example Ivel',    region: 'South East',   mw: 150, h: 8, cod: 2030, st: 'g2i' },
    { n: 'Seed example Jarrow',  region: 'Scotland',     mw: 250, h: 4, cod: 2031, st: 'g1' },
  ],

  // ---- connection ----
  connFactors: [
    { n: ['Land & planning', '土地与规划'], w: 12, s: 1 },
    { n: ['Gate status / strategic alignment', 'Gate状态与战略匹配'], w: 15, s: 1 },
    { n: ['Connection scope & date', '并网范围与日期'], w: 12, s: 1 },
    { n: ['Connection cost & securities', '并网成本与保证金'], w: 10, s: 2 },
    { n: ['Technical compliance (Grid Code / G99)', '技术合规（电网规范/G99）'], w: 12, s: 2 },
    { n: ['Network delivery & outage windows', '电网工程交付与停电窗口'], w: 8, s: 1 },
    { n: ['Market registration (BSC / BMU / metering)', '市场注册（BSC/BMU/计量）'], w: 8, s: 2 },
    { n: ['CM / LDES qualification', '容量市场/长时储能资格'], w: 8, s: 1 },
    { n: ['Charging & policy change', '网络收费与政策变化'], w: 8, s: 1 },
    { n: ['Evidence & governance', '证据与治理'], w: 7, s: 1 },
  ],
  connBands: [
    { lo: 0, hi: 24, n: ['Connection-investable', '可投资并网状态'], c: 'good',
      d: ['Evidence is sufficient to release development consideration.', '证据充分，可支付开发对价。'] },
    { lo: 25, hi: 44, n: ['Conditional — require CPs & holdbacks', '有条件 — 需先决条件与保留款'], c: 'warn',
      d: ['Structure the risk: conditions precedent, holdbacks, long-stop dates.', '以结构应对风险：先决条件、保留款、最终截止日。'] },
    { lo: 45, hi: 64, n: ['Material risk — re-price / defer', '重大风险 — 重新定价或延后'], c: 'serious',
      d: ['Re-price or defer until the Gate 2 tranche and consent position is proven.', '在Gate 2批次与规划许可获证实前，重新定价或延后。'] },
    { lo: 65, hi: 100, n: ['Not investment-ready', '不具备投资条件'], c: 'critical',
      d: ['Do not commit capital; the connection chain is unproven.', '不得投入资本；并网链条尚未证实。'] },
  ],

  // ---- contracted structures ----
  contracted: [
    { s: ['Toll (short tenor)', '容量租赁（短期）'], r: ['~2-year toll, several-hundred-MW portfolio', '约2年期，数百MW组合'], v: 57000,
      n: ['Fixed payment; offtaker takes market risk and upside.', '固定付款；承购方承担市场风险与上行收益。'] },
    { s: ['Floor (portfolio-level)', '收益下限（组合层面）'], r: ['Floor covering the majority of a ~1 GW book', '覆盖约1GW组合的大部分'], v: 44000,
      n: ['Downside protection; owner retains upside above the floor.', '下行保护；下限以上收益归业主。'] },
    { s: ['Revenue swap (ISDA)', '收益互换（ISDA）'], r: ['Multi-year (7yr+) financial swap', '多年期（7年以上）金融互换'], v: 52000,
      n: ['Financial fixed-for-floating; first publicly reported GB structure of its kind.', '固定对浮动的金融结构；英国首个公开披露的同类结构。'] },
    { s: ['Long-tenor toll', '长期容量租赁'], r: ['~15-year toll on a 4-hour asset', '4小时资产约15年期租赁'], v: null,
      n: ['Undisclosed level. Long unindexed tolls trade duration certainty for inflation exposure.', '价格未披露。长期非指数化租赁以通胀敞口换取期限确定性。'] },
  ],

  // ---- Investment Lab defaults ----
  lab: {
    mw: 100, hours: 2, capexKWh: 140, capexKW: 180, opexKW: 9,
    rte: 88, avail: 96, degr: 2, cycles: 1.5, spread: 65, optFee: 10,
    capPrice: 27.10, capYrs: 15, servicesKW: 4,
    life: 20, disc: 7, debtPct: 50, rate: 6.5, tenor: 15,
  },

  // ---- peer namespace: Ireland / SEM (context only, never scored) ----
  peer: {
    name: ['Ireland — SEM (all-island)', '爱尔兰 — 单一电力市场（全岛）'],
    asOf: 'Jul 2026',
    crmPriceEurKW: 149.96, crmDY: '2028/29', crmAwardedMW: 5942, crmAgreementYears: 10,
    derate: { 0.5: 0.11, 1: 0.22, 2: 0.41, 4: 0.66, 6: 0.81, 8: 0.89, 12: 0.94 },
    fleetMW: 1000, pipelineMW: 10000, pipelineMWh: 50000, pipelineProjects: 155,
    daSpreadEur: 103, ds3DeclinePct: 40, dcSharePct: 23, dcGWh: 7663,
    windDispatchDownPct: 11.3, constraintCostEurM: 567, constraintForecastEurM: 700,
    snspNow: 75, snsp2030: 95, storageAmbitionMW: 2000, ldesConceptMW: 201, ldesConceptMWh: 804,
    interconnectors: [['Greenlink (Wales)', 500, '2025'], ['Celtic (France)', 700, '2028e']],
    fxEurPerGbp: 1.17,
  },

  // ---- glossary additions (core terms live in the engine) ----
  glossary: [
    ['Capacity Market (CM)', '容量市场'],
    ['T-4 / T-1 auction', 'T-4/T-1拍卖'],
    ['Delivery year (DY)', '交付年度'],
    ['Capacity agreement (15-year new build)', '容量协议（新建15年）'],
    ['Balancing Mechanism (BM)', '平衡机制'],
    ['Bid-Offer Acceptance (BOA)', '报价接受指令'],
    ['Skip rate', '跳过率'],
    ['Balancing Mechanism Unit (BMU)', '平衡机制机组'],
    ['Balancing and Settlement Code (BSC)', '平衡与结算规则'],
    ['Imbalance price', '不平衡电价'],
    ['Dynamic Containment (DC)', '动态遏制'],
    ['Dynamic Moderation (DM)', '动态调节'],
    ['Dynamic Regulation (DR)', '动态调整'],
    ['Balancing Reserve (BR)', '平衡备用'],
    ['Quick Reserve (QR) / Slow Reserve (SR)', '快速备用/慢速备用'],
    ['Enduring Auction Capability (EAC)', '常态化拍卖平台'],
    ['TNUoS / DUoS / BSUoS charges', '输电/配电/平衡服务使用费'],
    ['Transmission Entry Capacity (TEC)', '输电接入容量'],
    ['Embedded Capacity Register (ECR)', '配网接入容量登记册'],
    ['Connections reform — Gate 1 / Gate 2', '并网改革 — Gate 1/Gate 2'],
    ['Clean Power 2030 (CP2030)', '2030清洁电力计划'],
    ['LDES cap-and-floor', '长时储能上下限机制'],
    ['Grid Code / G99', '电网规范/G99'],
    ['Reformed National Pricing (RNP)', '改革后的全国统一定价'],
    ['Single Electricity Market (SEM)', '单一电力市场（爱尔兰岛）'],
  ],

  // ---- CSV export rows ----
  kpiExport: [
    ['T-4 clearing price DY 2029/30', 27.10, 'GBP/kW/yr', 'official', 'GB_SEED_V1', 'NESO CM register'],
    ['T-4 awarded de-rated capacity DY 2029/30', 40108.6, 'MW', 'official', 'GB_SEED_V1', 'NESO CM register'],
    ['T-1 clearing price DY 2026/27', 5.00, 'GBP/kW/yr', 'official', 'GB_SEED_V1', 'NESO CM register'],
    ['CM de-rating factor 2h (T-4 2029/30)', 0.22, 'factor', 'official', 'GB_SEED_V1', 'NESO de-rating factors'],
    ['CM de-rating factor 4h (T-4 2029/30)', 0.45, 'factor', 'official', 'GB_SEED_V1', 'NESO de-rating factors'],
    ['CP2030 battery range', '23-27', 'GW', 'official', 'GB_SEED_V1', 'DESNZ CP2030 Action Plan'],
    ['CP2030 LDES range', '4-6', 'GW', 'official', 'GB_SEED_V1', 'DESNZ CP2030 Action Plan'],
    ['Operating GB battery fleet', 6.5, 'GW', 'calculated', 'GB_SEED_V1', 'TEC/ECR + REPD'],
    ['Fleet weighted-average duration', 1.7, 'h', 'calculated', 'GB_SEED_V1', 'dashboard'],
    ['Realised 2h revenue (TTM Apr 2026)', 73145, 'GBP/MW/yr', 'third-party modelled', 'GB_SEED_V1', 'licensed vendor index'],
    ['Realised-to-theoretical ratio (fleet median)', 0.82, 'ratio', 'third-party modelled', 'GB_SEED_V1', 'licensed vendor index'],
    ['Battery BM skip rate', 0.34, 'ratio', 'official', 'GB_SEED_V1', 'NESO skip rates'],
    ['DC clearing price', 2.90, 'GBP/MW/h', 'official', 'GB_SEED_V1', 'NESO EAC results'],
    ['Battery share of DC volume', 97, '%', 'official', 'GB_SEED_V1', 'NESO EAC results'],
    ['LDES Window 1 minded-to projects', 16, 'count', 'official (draft)', 'GB_SEED_V1', 'Ofgem LDES Window 1'],
    ['Ireland CRM T-4 2028/29 (peer, context only)', 149960, 'EUR/MW de-rated/yr', 'official (peer namespace)', 'CONTEXT_ONLY', 'SEMO'],
    ['Ireland CM de-rating factor 2h (peer, context only)', 0.41, 'factor', 'official (peer namespace)', 'CONTEXT_ONLY', 'SEMO'],
  ],
};

export { M };