/* ---------------------------------------------------------------------------
   Great Britain 鈥?market dataset, verbatim from the prototype (lines 1365-1631).

   Everything the dashboard shows: official snapshot values, scorecards, bands,
   de-rating and duration curves, the project pipeline, lab defaults and the
   per-tab narrative content. Not one value was changed by the migration.
   --------------------------------------------------------------------------- */

import {
  GB_SYSTEM_EVOLUTION, GB_TEC_PIPELINE, GB_TEC_PROJECTS, GB_METRIC_REGISTRY,
} from './officialData.js';

const M = {
  asOf: '2026-07-29',
  dataDate: 'FES 2025 / TEC 29 Jul 2026 / TTM Apr 2026 / DY 2029-30',
  modelVersion: 'gb-governed-2.0-fes-tec',
  title: ['Great Britain Battery Investment Dashboard', '英国储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。'],
  nextMilestone: ['Next milestone: T-4 2030/31 auction parameters and the next Gate 2 offer tranche', '下一里程碑：T-4 2030/31拍卖参数及下一批Gate 2要约'],
  footerNote: ['Official FES and TEC sources re-verified 29 July 2026; Irish SEM data remains in a separate peer namespace and is excluded from GB scoring. Northern Ireland is covered in the Ireland dashboard.',
               'FES与TEC官方来源已于2026年7月29日重新核验；爱尔兰SEM数据仍保存在独立同业命名空间，不计入英国评分。北爱尔兰由爱尔兰看板覆盖。'],
  seedWarn: ['FES system planning and the TEC project pipeline are governed official snapshots with metric-level lineage. Revenue, service, finance and some policy values remain base-case, analyst or third-party modelled and retain their existing badges. A queue MW is never expected delivery; a Gate 2 field is never an energisation date; realised revenue is never theoretical revenue.',
             'FES系统规划与TEC项目管线现为带指标级溯源的受治理官方快照。收入、服务、财务及部分政策数值仍为基准情景、分析师或第三方模型，并保留既有标识。队列MW绝不等于预期交付；Gate 2字段绝不等于送电日期；实际收入绝不等于理论收入。'],

  systemEvolution: GB_SYSTEM_EVOLUTION,
  pipelineOfficial: GB_TEC_PIPELINE,
  metricRegistry: GB_METRIC_REGISTRY,

  // ---- official snapshot ----
  official: {
    t4Price: 27.10, t4DY: '2029/30', t4AwardedMW: 40108.6,
    t1Price: 5.00, t1DY: '2026/27', t1AwardedMW: 7192.3,
    cmAgreementYears: 15,
    cp2030BatteryGW: [23, 27], cp2030LdesGW: [4, 6], batteryBaselineGW: 4.5, ldesBaselineGW: 2.9,
    ldesWindow1Projects: 16,
    fleetGW: 6.5, fleetAvgHours: 1.7, pipelineAvgHours: 2.2,
  },

  overall: { confidence: 74, codWindow: '2028–2030',
    rationale: ['A diversified revenue stack remains, but returns are now set by connection certainty, realised BM dispatch and saturation — not by a generic storage-scarcity thesis.',
                '收入来源仍然多元，但收益已由并网确定性、平衡机制实际调度与市场饱和决定，而非笼统的“储能稀缺”逻辑。'] },
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
  /* ---- named transmission, from the Great Grid Upgrade and the transitional
     Centralised Strategic Network Plan ---------------------------------------
     GB has no ISP-equivalent status vocabulary, so the class column uses the
     consenting position, which is the thing that actually moves a GB date:
     an Ofgem-funded project with no development consent is not the same asset
     as one in construction. `cls` matches `planClasses` below. */
  reinforcements: [
    { n: ['Yorkshire GREEN', 'Yorkshire GREEN工程'], operator: 'NGET', region: ['Yorkshire', '约克郡'],
      cls: 'construction', scope: ['400 kV reinforcement across Yorkshire, releasing north-to-south boundary transfer', '横跨约克郡的400千伏增容工程，释放南北断面输送能力'],
      year: 2027, status: ['Under construction; first assets operational 2027, works complete 2028', '在建；首批资产2027年投运，工程2028年完工'], c: 'good' },
    { n: ['Bramford to Twinstead Reinforcement', 'Bramford至Twinstead增容工程'], operator: 'NGET', region: ['Suffolk / Essex', '萨福克 / 埃塞克斯'],
      cls: 'construction', scope: ['400 kV reinforcement between Bramford and Twinstead; £363m main works contract', 'Bramford与Twinstead之间的400千伏增容；主体工程合同3.63亿英镑'],
      year: 2028, status: ['Consented and under construction since 2025; completion 2028', '已获许可并自2025年起施工；2028年完工'], c: 'good' },
    { n: ['Eastern Green Link 1', '东方绿色互联1号线'], operator: 'SP Transmission / NGET', region: ['Scotland → North East England', '苏格兰 → 英格兰东北'],
      cls: 'funded', scope: ['2 GW HVDC subsea link, Torness to Hawthorn Pit; ~£2bn Ofgem funding decision November 2024', '2GW海底高压直流线路，Torness至Hawthorn Pit；2024年11月Ofgem约20亿英镑资金决定'],
      year: 2029, status: ['Funded and in delivery; fully operational 2029', '已获资金并在交付中；2029年全面投运'], c: 'warn' },
    { n: ['Eastern Green Link 2', '东方绿色互联2号线'], operator: 'SSEN Transmission / NGET', region: ['Scotland → Yorkshire', '苏格兰 → 约克郡'],
      cls: 'construction', scope: ['2 GW HVDC subsea link, Peterhead to Drax; GB\'s longest subsea HVDC cable', '2GW海底高压直流线路，Peterhead至Drax；英国最长海底高压直流电缆'],
      year: 2029, status: ['Under construction since September 2024; commissioning 2029', '自2024年9月起施工；2029年投运'], c: 'warn' },
    { n: ['Norwich to Tilbury', 'Norwich至Tilbury工程'], operator: 'NGET', region: ['East Anglia → Essex', '东安格利亚 → 埃塞克斯'],
      cls: 'planning', scope: ['400 kV reinforcement from Norwich through Bramford to Tilbury', '自Norwich经Bramford至Tilbury的400千伏增容'],
      year: 2031, status: ['DCO application submitted September 2025; construction from 2027 if consented', '2025年9月提交开发许可申请；若获许可，2027年起施工'], c: 'serious' },
    { n: ['Sea Link', 'Sea Link海底联络线'], operator: 'NGET', region: ['Suffolk ↔ Kent', '萨福克 ↔ 肯特'],
      cls: 'planning', scope: ['2 GW HVDC link between Suffolk and Kent, mostly subsea, around 138 km', '连接萨福克与肯特的2GW高压直流线路，以海底段为主，约138公里'],
      year: 2031, status: ['DCO examination closed May 2026; completion expected end-2031 if consented', '2026年5月开发许可审查结束；若获许可，预计2031年底完工'], c: 'serious' },
    { n: ['Eastern Green Link 3', '东方绿色互联3号线'], operator: 'SSEN Transmission / NGET', region: ['Scotland → Lincolnshire', '苏格兰 → 林肯郡'],
      cls: 'early', scope: ['2 GW HVDC subsea link from Peterhead into Lincolnshire', '自Peterhead至林肯郡的2GW海底高压直流线路'],
      year: 2033, status: ['Ofgem early construction funding agreed; construction from 2029, operational 2033', 'Ofgem已同意前期施工资金；2029年起施工，2033年投运'], c: 'serious' },
    { n: ['Eastern Green Link 4', '东方绿色互联4号线'], operator: 'SP Transmission / NGET', region: ['Fife → Lincolnshire', '法夫 → 林肯郡'],
      cls: 'early', scope: ['2 GW HVDC subsea link, Westfield in Fife into Lincolnshire; ~£2bn of supply contracts placed', '2GW海底高压直流线路，自法夫Westfield至林肯郡；已签署约20亿英镑供货合同'],
      year: 2033, status: ['Ofgem early construction funding agreed; target 2033', 'Ofgem已同意前期施工资金；目标2033年'], c: 'serious' },
    { n: ['Grimsby to Walpole', 'Grimsby至Walpole工程'], operator: 'NGET', region: ['Lincolnshire → Norfolk', '林肯郡 → 诺福克'],
      cls: 'early', scope: ['400 kV onshore link providing the landing capacity the Eastern Green Links need', '400千伏陆上线路，为东方绿色互联各线提供所需的落点容量'],
      year: 2033, status: ['Ofgem target delivery December 2033; application 2027, construction 2029–2033', 'Ofgem目标交付时间为2033年12月；2027年提交申请，2029–2033年施工'], c: 'critical' },
    { n: ['Transitional CSNP / Beyond 2030', '过渡性CSNP / 2030后规划'], operator: 'NESO', region: ['Great Britain', '英国全境'],
      cls: 'programme', scope: ['The strategic network plan the projects above are drawn from; the next transitional CSNP is due June 2026 and the full CSNP by end-2028', '上述项目所源自的战略网络规划；下一版过渡性CSNP应于2026年6月发布，完整CSNP应于2028年底前发布'],
      year: 2028, status: ['A plan, not a commissioning date — the weakest relief evidence on this table', '这是规划而非投运日期 — 本表中证据力最弱的一行'], c: 'serious' },
  ],

  /* GB status vocabulary. The ordering is deliberate: it is a consenting ladder,
     and a project cannot skip a rung. Defined once so the register's chips and
     the explanatory table cannot drift apart. */
  planClasses: [
    { id: 'operational',  n: ['Operational', '已投运'],           c: 'good',
      d: ['Energised and carrying power. The only class where the date is a fact rather than a forecast.', '已送电并输送电力。唯一日期属于事实而非预测的类别。'] },
    { id: 'construction', n: ['In construction', '在建'],          c: 'good',
      d: ['Consented, funded and physically underway. Slippage is possible but the works exist.', '已获许可、资金到位并已实际开工。仍可能延期，但工程实体存在。'] },
    { id: 'funded',       n: ['Funded, pre-construction', '已获资金，未开工'], c: 'warn',
      d: ['Ofgem has made a project assessment decision and released funding; main construction has not started.', 'Ofgem已作出项目评估决定并拨付资金；主体工程尚未开工。'] },
    { id: 'planning',     n: ['In planning', '许可审批中'],        c: 'serious',
      d: ['A DCO application is submitted or in examination. No consent, so no construction date can be relied on.', '开发许可申请已提交或处于审查中。尚无许可，因此任何施工日期均不可依赖。'] },
    { id: 'early',        n: ['Early funding, pre-application', '前期资金，未申请'], c: 'critical',
      d: ['Ofgem has agreed early construction funding and a target date, but the consenting application has not been made.', 'Ofgem已同意前期施工资金并设定目标日期，但许可申请尚未提交。'] },
    { id: 'programme',    n: ['Programme', '规划计划'],           c: 'serious',
      d: ['A strategic plan covering many projects. A programme slips in pieces, so a programme year is not a date for any one project.', '覆盖多个项目的战略规划。计划是分块延期的，因此计划年份不构成任何单一项目的日期。'] },
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
    { id: 'uc',  n: ['Under Construction/Commissioning (TEC status)', '在建/调试（TEC状态）'], p: 90 },
    { id: 'g2c', n: ['Gate 2 and Consents Approved (TEC fields)', 'Gate 2且许可获批（TEC字段）'], p: 60 },
    { id: 'g2i', n: ['Other Gate 2 record', '其他Gate 2记录'], p: 45 },
    { id: 'g1',  n: ['Gate 1 record', 'Gate 1记录'], p: 25 },
    { id: 'tec', n: ['TEC record with Gate not populated', 'Gate未填报的TEC记录'], p: 20 },
  ],
  projects: GB_TEC_PROJECTS.map(project => ({
    n: project.name,
    owner: project.owner,
    region: project.hostTO,
    site: project.connectionSite,
    mw: project.capacityMW,
    h: project.durationHours,
    cod: project.expectedCod ? Number(project.expectedCod.slice(0, 4)) : null,
    codDate: project.expectedCod,
    st: project.stage === 'under_construction' ? 'uc' : 'g2c',
    gate: project.gate,
    statusRaw: project.statusRaw,
    sourceProjectId: project.sourceProjectId,
  })),


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
    /* ---- capital structure. Seeded neutral: nothing here moves a published
       return until it is set. VAT is recoverable, so it costs only timing, and
       the Lab leaves the refund lag to the engine. */
    vatPct: 20, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
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
    ['FES total system demand 2035', 396764, 'GWh', 'official-forecast', 'FES 2025 — Ten Year Forecast', 'gb-neso-fes-ed1-2025'],
    ['FES peak customer demand 2035', 71.914, 'GW', 'official-forecast', 'FES 2025 — Ten Year Forecast', 'gb-neso-fes-ed1-2025'],
    ['FES data-centre demand 2035', 33211, 'GWh', 'official-forecast', 'FES 2025 — Ten Year Forecast', 'gb-neso-fes-ed1-2025'],
    ['FES network-connected battery capacity 2030', 23.865084, 'GW', 'official-forecast', 'FES 2025 — Ten Year Forecast', 'gb-neso-fes-es1-2025'],
    ['FES LDES capacity 2035', 7.158094, 'GW', 'official-forecast', 'FES 2025 — Ten Year Forecast', 'gb-neso-fes-es1-2025'],
    ['TEC exact-ESS forward capacity 2026+', 177195.8, 'MW', 'derived-observed', 'TEC 2026-07-29', 'gb-neso-tec-register'],
    ['TEC exact-ESS Gate 2 forward capacity 2026+', 7778.4, 'MW', 'derived-observed', 'TEC 2026-07-29', 'gb-neso-tec-register'],
    ['TEC exact-ESS analyst-weighted forward capacity 2026+', 43271.6, 'MW', 'analyst-scenario', 'TEC 2026-07-29 / screening weights v1', 'gb-neso-tec-register'],
    ['TEC duration coverage', 0, '%', 'observed', 'TEC 2026-07-29', 'gb-neso-tec-register'],
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