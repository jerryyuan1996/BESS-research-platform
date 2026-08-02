/* ---------------------------------------------------------------------------
   Romania 鈥?market dataset, verbatim from the prototype (lines 1351-1578).

   Everything the dashboard shows: official snapshot values, scorecards, bands,
   de-rating and duration curves, the project pipeline, lab defaults and the
   per-tab narrative content. Not one value was changed by the migration.
   --------------------------------------------------------------------------- */

const M = {
  asOf: '2026-07-26',
  dataDate: '2025 annual / Jun 2026 monthly',
  modelVersion: 'ro-seed-1.0-support-structure-pl-benchmark',
  title: ['Romania Battery Investment Dashboard', '罗马尼亚储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。'],
  nextMilestone: ['Next milestone: first formal awards under the standalone-storage scheme and the current Transelectrica capacity-allocation window',
                  '下一里程碑：独立储能计划的首批正式授予及当前Transelectrica容量分配窗口'],
  footerNote: ['Public and official sources re-verified 26 July 2026; Polish data (Jul 2026) is held in a separate peer namespace and excluded from Romania scoring.',
               '公开及官方来源已于2026年7月26日重新核验；波兰数据（2026年7月）保存在独立同业命名空间，不计入罗马尼亚评分。'],
  seedWarn: ['Every value on this page is a RO_SEED_V1 snapshot or an illustrative placeholder. No KPI is production-complete until its live ingestion, validation and source-health check are operational. Grants are never revenue; a scheme budget is never an award; authorisations are never operating MW; indicative grid capacity is never an ATR.',
             '本页所有数值均为RO_SEED_V1种子快照或示例占位数据。在实时抓取、校验及源健康检测上线前，任何KPI均不可用于生产决策。补贴不等于收入；计划预算不等于正式授予；许可不等于投运容量；示意性电网容量不等于ATR。'],

  fx: 4.97,   // RON per EUR — illustrative mid-rate; replace with the central-bank series
  official: {
    dam2025Wap: 575.22, dam2025TWh: 15.7, dam2025SharePct: 32, idm2025Wap: 518.43, damJun2026Wap: 694.48,
    schemeBudgetEurM: 150, schemeMinMWh: 2174, policyExtraMW: 2496,
    connTariffGuarPct: 20, auctionGuarEurMW: 20000, estabGuarEurKW: 30,
    authFeb2026MW: 596,
    fleetMW: 420, fleetMWh: 780,
  },

  overall: { statusL: ['Selective', '选择性投资'], chipCls: 'warn', confidence: 68, codWindow: '2027–2029',
    rationale: ['Wholesale volatility, improving tariff treatment and capital-grant support are real; but connection rights, balancing qualification and award evidence — not scheme budgets — decide whether capital should be committed.',
                '批发波动、电价待遇改善与资本补贴支持真实存在；但决定是否应投入资本的是并网权利、平衡资格与正式授予证据，而非计划预算。'] },
  components: [
    { n: ['Wholesale & intraday outlook', '批发与日内前景'], w: 20, s: 66 },
    { n: ['Grid connection & permitting', '并网与许可'], w: 20, s: 52 },
    { n: ['Balancing & reserves access', '平衡与备用准入'], w: 15, s: 58 },
    { n: ['Grant / support availability', '补贴与支持可得性'], w: 15, s: 70 },
    { n: ['Storage-duration fit', '储能时长匹配度'], w: 10, s: 65 },
    { n: ['Probability-weighted pipeline', '概率加权管线'], w: 10, s: 55 },
    { n: ['Financing & contracted revenue', '融资与合同收入'], w: 10, s: 60 },
  ],

  // ---- wholesale ----
  pxLabels: ['Q1-25', 'Q2-25', 'Q3-25', 'Q4-25', 'Jan-26', 'Feb-26', 'Mar-26', 'Apr-26', 'May-26', 'Jun-26'],
  damSeries: [640, 470, 555, 635, 660, 610, 505, 465, 545, 694.48],
  idmSeries: [585, 430, 505, 555, 600, 560, 470, 435, 505, 640],
  qLabels: ['Q1-25', 'Q2-25', 'Q3-25', 'Q4-25', 'Q1-26', 'Q2-26'],
  negHoursSeries: [45, 260, 210, 60, 85, 340],
  highHoursSeries: [120, 40, 95, 180, 210, 75],
  spreadBridge: [
    { l: ['Published day-ahead top–bottom spread (2h block)', '公布日前峰谷价差（2小时块）'], v: 85, t: 'start' },
    { l: ['Intraday re-trade uplift', '日内再交易增益'], v: 6, t: 'd' },
    { l: ['Liquidity & gate-closure execution', '流动性与闭市执行折损'], v: -9, t: 'd' },
    { l: ['Round-trip efficiency loss (88%)', '往返效率损失(88%)'], v: -10, t: 'd' },
    { l: ['Availability & outages', '可用率与停机'], v: -3, t: 'd' },
    { l: ['Optimiser fee (~10%)', '优化商费用(约10%)'], v: -7, t: 'd' },
    { l: ['Executable net margin', '可执行净价差'], v: 62, t: 'total' },
  ],
  codCases: { 2027: { low: 45, central: 62, high: 78 }, 2028: { low: 40, central: 58, high: 75 }, 2029: { low: 36, central: 54, high: 72 } },
  dilution: { 2027: 1.05, 2028: 1.00, 2029: 0.92 },

  // ---- balancing & reserves ----
  balProducts: [
    { id: 'FCR',  n: ['Frequency Containment Reserve', '频率遏制备用'], reqMW: 88, capEurMWh: 19, dir: ['symmetric', '对称'] },
    { id: 'aFRR', n: ['automatic Frequency Restoration Reserve', '自动频率恢复备用'], reqMW: 400, capEurMWh: 26, dir: ['up / down', '上调/下调'] },
    { id: 'mFRR', n: ['manual Frequency Restoration Reserve', '手动频率恢复备用'], reqMW: 1000, capEurMWh: 9, dir: ['up / down', '上调/下调'] },
  ],
  afrrCapSeries: [34, 30, 27, 24, 26, 22],
  balActUp: 900, balActDn: 40,
  evidenceLadder: [
    { n: ['1 · Published capacity & activation results', '1 · 已公布容量与激活结果'], d: ['Observable from the system operator and exchange — the only tier that is fact.', '可从系统运营方与交易所观察 — 唯一属于事实的层级。'] },
    { n: ['2 · Reproducible optimiser backtest', '2 · 可复现的优化器回测'], d: ['Not yet evidenced for most Romanian projects; ask for the data, not the conclusion.', '多数罗马尼亚项目尚未具备；应索取数据本身而非结论。'] },
    { n: ['3 · Project prequalification', '3 · 项目预认证'], d: ['Project-specific; qualification for FCR, aFRR and mFRR is not automatic.', '项目特定；FCR、aFRR与mFRR资格并非自动获得。'] },
    { n: ['4 · Award & activation track record', '4 · 中标与激活业绩记录'], d: ['Limited precedent for batteries; treat any modelled activation revenue as unproven.', '电池先例有限；任何模型中的激活收入均应视为未经证实。'] },
    { n: ['5 · Contracted floor or tolling', '5 · 合同保底或代工'], d: ['Rare in Romania and therefore a negotiation objective rather than a market standard.', '在罗马尼亚罕见，因此属谈判目标而非市场惯例。'] },
  ],

  // ---- capacity channel: Romania has no capacity mechanism ----
  deratingCurve: { 1: 1, 2: 1, 4: 1, 6: 1, 8: 1 },
  futureCapFactor: 0,

  // ---- duration ----
  durationPath: { years: ['2027', '2028', '2029'], hours: [2, 2, 4] },
  durConfigs: [1, 2, 4, 6, 8],
  durSpreadFactor: { 1: 1.10, 2: 1.00, 4: 0.82, 6: 0.70, 8: 0.62 },
  usableFraction: 0.91,
  marginalHour: [
    { l: ['Incremental arbitrage (deeper cycle)', '增量套利（更深循环）'], v: 14, t: 'd' },
    { l: ['Balancing access widened', '平衡市场准入扩大'], v: 4, t: 'd' },
    { l: ['Grant MWh eligibility', '补贴MWh资格'], v: 6, t: 'd' },
    { l: ['Annualised incremental capex', '年化增量资本开支'], v: -19, t: 'd' },
    { l: ['Degradation & opex', '衰减与运维'], v: -3, t: 'd' },
    { l: ['Net marginal value', '净边际价值'], v: 2, t: 'total' },
  ],
  durFactors: [
    { n: ['Intraday spread shape & evening ramp length', '日内价差形态与晚间爬坡时长'], w: 20, s: 2 },
    { n: ['Solar build-out & midday trough depth', '光伏扩张与午间低谷深度'], w: 15, s: 3 },
    { n: ['Balancing-product duration requirements', '平衡产品时长要求'], w: 15, s: 2 },
    { n: ['Negative-price interval frequency', '负电价时段频率'], w: 10, s: 2 },
    { n: ['Cross-border coupling damping of spreads', '跨境耦合对价差的平抑'], w: 10, s: 1 },
    { n: ['Grant-scheme MWh minimums & eligibility', '补贴计划MWh下限与资格'], w: 10, s: 2 },
    { n: ['Cycling & degradation economics', '循环与衰减经济性'], w: 10, s: 2 },
    { n: ['Lender downside coverage via contracted floors', '贷款人下行保障（合同保底）'], w: 10, s: 1 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Shallow-shift market', '浅移峰市场'], c: 'info',
      d: ['1h shifting may suffice; do not overbuild MWh without contract value.', '1小时移峰或已足够；无合同价值时不宜过度配置MWh。'] },
    { lo: 35, hi: 54, n: ['1–2h merchant zone', '1–2小时市场化区间'], c: 'warn',
      d: ['Underwrite 1–2h merchant; treat longer builds as option value only.', '按1–2小时市场化测算；更长配置仅作期权价值。'] },
    { lo: 55, hi: 69, n: ['2h core with 4h augmentation', '2小时为主、预留4小时增容'], c: 'serious',
      d: ['2h core design with a credible augmentation path to 4h — the screening archetype.', '2小时核心设计并保留可信的4小时增容路径 — 筛选原型。'] },
    { lo: 70, hi: 100, n: ['4h+ duration-driven', '4小时以上时长驱动'], c: 'good',
      d: ['Underwrite 4h+ only with marginal-hour NPV and lender coverage evidence.', '仅在边际小时NPV及贷款人保障证据支持下按4小时以上测算。'] },
  ],
  augItems: [
    ['Land reserved for additional containers', '预留增容集装箱用地'],
    ['DC collection system expansion capacity', '直流汇集系统扩容能力'],
    ['Transformer & switchgear headroom', '变压器与开关设备裕度'],
    ['PCS & EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['ATR / connection treatment of MWh-only augmentation', '仅增MWh时的ATR/并网处理'],
    ['Planning & environmental approval coverage', '规划与环评覆盖'],
    ['OEM / LTSA augmentation rights', 'OEM/长期服务协议增容权利'],
    ['Financing consent & reserve-account treatment', '融资同意与储备账户安排'],
    ['Grant-scheme treatment of augmented capacity', '补贴计划对增容部分的处理'],
  ],
  augDefaults: [2, 2, 1, 2, 1, 1, 1, 1, 1],

  // ---- pipeline ----
  stages: [
    { id: 'op',   n: ['Operating', '已投运'], p: 100 },
    { id: 'con',  n: ['Under construction / financing closed', '在建/已融资交割'], p: 90 },
    { id: 'rtb',  n: ['RTB — ATR + connection agreement + authorisation + grant secured', 'RTB — ATR+并网合同+设立许可+补贴落实'], p: 70 },
    { id: 'atr',  n: ['ATR obtained, pre-financing', '已获ATR、融资前'], p: 45 },
    { id: 'auth', n: ['Establishment authorisation / early permits only', '仅设立许可/前期许可'], p: 25 },
    { id: 'ann',  n: ['Announced / policy pipeline only', '仅公告/政策管线'], p: 8 },
  ],
  projects: [
    { n: 'RO seed example A', county: 'Ilfov',     mw: 24,  h: 1, cod: 2026, st: 'op' },
    { n: 'RO seed example B', county: 'Olt',       mw: 60,  h: 2, cod: 2027, st: 'con' },
    { n: 'RO seed example C', county: 'Dolj',      mw: 100, h: 2, cod: 2027, st: 'rtb' },
    { n: 'RO seed example D', county: 'Constanța', mw: 80,  h: 2, cod: 2027, st: 'atr' },
    { n: 'RO seed example E', county: 'Timiș',     mw: 50,  h: 4, cod: 2028, st: 'rtb' },
    { n: 'RO seed example F', county: 'Prahova',   mw: 120, h: 2, cod: 2028, st: 'atr' },
    { n: 'RO seed example G', county: 'Giurgiu',   mw: 90,  h: 4, cod: 2028, st: 'auth' },
    { n: 'RO seed example H', county: 'Cluj',      mw: 150, h: 2, cod: 2028, st: 'ann' },
    { n: 'RO seed example I', county: 'Galați',    mw: 200, h: 4, cod: 2029, st: 'auth' },
    { n: 'RO seed example J', county: 'Arad',      mw: 100, h: 4, cod: 2029, st: 'atr' },
    { n: 'RO seed example K', county: 'Bihor',     mw: 40,  h: 1, cod: 2027, st: 'auth' },
    { n: 'RO seed example L', county: 'Mehedinți', mw: 250, h: 4, cod: 2029, st: 'ann' },
  ],

  // ---- connection ----
  connFactors: [
    { n: ['Land, planning & environmental rights', '土地、规划与环评权利'], w: 15, s: 1 },
    { n: ['Capacity-allocation route & auction outcome', '容量分配路径与拍卖结果'], w: 10, s: 2 },
    { n: ['ATR status, capacity & validity', 'ATR状态、容量与有效期'], w: 15, s: 2 },
    { n: ['Connection agreement & works scope', '并网合同与工程范围'], w: 15, s: 2 },
    { n: ['Network reinforcement scope & delivery responsibility', '网络加强范围与交付责任'], w: 10, s: 2 },
    { n: ['Guarantees posted & release path', '已缴保函与释放路径'], w: 5, s: 1 },
    { n: ['Establishment authorisation & licensing progress', '设立许可与牌照进度'], w: 10, s: 1 },
    { n: ['Market & balancing-responsible-party registration', '市场与平衡责任方注册'], w: 10, s: 2 },
    { n: ['Energisation, testing & unrestricted operation', '送电、测试与无限制运行'], w: 5, s: 1 },
    { n: ['Evidence & governance quality', '证据与治理质量'], w: 5, s: 1 },
  ],
  connBands: [
    { lo: 0, hi: 24, n: ['Connection-investable', '可投资并网状态'], c: 'good',
      d: ['Evidence is sufficient to release development consideration.', '证据充分，可支付开发对价。'] },
    { lo: 25, hi: 44, n: ['Conditional — require CPs & holdbacks', '有条件 — 需先决条件与保留款'], c: 'warn',
      d: ['Structure the risk: conditions precedent, holdbacks, long-stop dates.', '以结构应对风险：先决条件、保留款、最终截止日。'] },
    { lo: 45, hi: 64, n: ['Material risk — re-price / defer', '重大风险 — 重新定价或延后'], c: 'serious',
      d: ['Re-price or defer until an ATR and executed connection agreement are in hand.', '在取得ATR及已签并网合同前，重新定价或延后。'] },
    { lo: 65, hi: 100, n: ['Not investment-ready', '不具备投资条件'], c: 'critical',
      d: ['Do not commit capital; the connection chain is unproven.', '不得投入资本；并网链条尚未证实。'] },
  ],

  /* ---- named transmission, from Transelectrica's RET Development Plan
     2026–2035 ---------------------------------------------------------------
     The plan is organised by priority direction rather than by delivery status,
     so the class column below records the direction each named work serves. That
     is the honest mapping: Romania's public synthesis names the works and the
     2030 delivery window, but does not publish a per-project consenting position
     or a construction start, and none is invented here. */
  reinforcements: [
    { n: ['Brașov – Sibiu South', 'Brașov — Sibiu South'], operator: 'Transelectrica', region: ['Centre — Transylvania', '中部 — 特兰西瓦尼亚'],
      cls: 'security', scope: ['400 kV reinforcement across the central corridor linking Transylvanian load to the southern ring', '400千伏中部走廊增容，连接特兰西瓦尼亚负荷与南部环网'],
      year: 2030, status: ['Named 2030 work in the adopted plan; no published construction start', '已列入通过规划的2030年具名工程；未公布开工时间'], c: 'warn' },
    { n: ['Cetate – Calafat', 'Cetate — Calafat'], operator: 'Transelectrica', region: ['South West — Oltenia', '西南 — 奥尔特尼亚'],
      cls: 'interconnection', scope: ['South-western reinforcement serving the Danube corridor and Bulgarian cross-border exchange', '西南部增容工程，服务多瑙河走廊及与保加利亚的跨境交换'],
      year: 2030, status: ['Named 2030 work in the adopted plan; no published construction start', '已列入通过规划的2030年具名工程；未公布开工时间'], c: 'warn' },
    { n: ['Alba Iulia – Cluj Florești', 'Alba Iulia — Cluj Florești'], operator: 'Transelectrica', region: ['North West — Transylvania', '西北 — 特兰西瓦尼亚'],
      cls: 'renewables', scope: ['North-western 400 kV reinforcement releasing Transylvanian renewable and hydro transfer', '西北部400千伏增容，释放特兰西瓦尼亚可再生能源与水电输送能力'],
      year: 2030, status: ['Named 2030 work in the adopted plan; no published construction start', '已列入通过规划的2030年具名工程；未公布开工时间'], c: 'warn' },
    { n: ['Bucharest South – Mostiștea', 'Bucharest South — Mostiștea'], operator: 'Transelectrica', region: ['South — Muntenia', '南部 — 蒙特尼亚'],
      cls: 'security', scope: ['Reinforcement into the Bucharest load centre, the largest single demand concentration on the system', '通往布加勒斯特负荷中心的增容工程，该地是系统内最大的单一负荷集中区'],
      year: 2030, status: ['Named 2030 work in the adopted plan; no published construction start', '已列入通过规划的2030年具名工程；未公布开工时间'], c: 'warn' },
    { n: ['Lotru – Sibiu South', 'Lotru — Sibiu South'], operator: 'Transelectrica', region: ['Centre — Vâlcea / Sibiu', '中部 — 沃尔恰 / 锡比乌'],
      cls: 'renewables', scope: ['Reinforcement around the Lotru hydro complex, improving central transfer capability', 'Lotru水电枢纽周边增容，提升中部输送能力'],
      year: 2030, status: ['Named 2030 work in the adopted plan; no published construction start', '已列入通过规划的2030年具名工程；未公布开工时间'], c: 'warn' },
    { n: ['RET Development Plan 2026–2035', 'RET发展规划2026–2035'], operator: 'Transelectrica', region: ['Romania', '罗马尼亚全境'],
      cls: 'programme', scope: ['The adopted transmission programme the works above sit inside, built on four priority directions and running to a 2035 horizon', '上述工程所属的已通过输电计划，基于四个优先方向，展望至2035年'],
      year: 2035, status: ['Adopted plan horizon — a programme, not a commissioning date', '已通过的规划展望期 — 属计划而非投运日期'], c: 'serious' },
  ],

  /* Romania's plan classifies by priority direction, not by delivery status, so
     that is what the register reports. The absence of a status ladder is itself
     the finding, and the `why` on the card says so rather than inferring one. */
  planClasses: [
    { id: 'security',        n: ['Security of supply', '供电安全'], c: 'warn',
      d: ['Serves the plan\'s supply-security direction. Delivery status is not published per project, so the 2030 window is a plan year rather than a commissioning date.', '服务于规划的供电安全方向。各项目的交付状态未公布，因此2030年窗口属规划年份而非投运日期。'] },
    { id: 'renewables',      n: ['Renewable integration', '新能源接入'], c: 'warn',
      d: ['Serves the plan\'s renewable-integration direction, including the Dobrogea and Moldova build-out. Same caveat on dating.', '服务于规划的新能源接入方向，含多布罗加与摩尔多瓦地区建设。日期方面存在同样保留。'] },
    { id: 'interconnection', n: ['Interconnection', '跨境互联'], c: 'warn',
      d: ['Serves the cross-border capacity direction, which targets 15% interconnection by 2030 and 7,000 MW of exchange capacity.', '服务于跨境容量方向，目标为2030年互联率15%及7,000MW交换能力。'] },
    { id: 'programme',       n: ['Programme', '整体计划'], c: 'serious',
      d: ['The plan as a whole. Romania publishes priority directions and named works but not per-project consent or construction status — so no row here can be read as a date.', '规划整体。罗马尼亚公布优先方向与具名工程，但不公布各项目的许可或施工状态 — 因此本表任何一行均不可视为日期。'] },
  ],

  lab: {
    mw: 50, hours: 2, capexKWh: 240, capexKW: 150, opexKW: 8,
    rte: 88, avail: 96, degr: 2.0, cycles: 1.4, spread: 62, optFee: 10,
    capPrice: 0, capYrs: 0, servicesKW: 15, grantPct: 20,
    life: 15, disc: 9, debtPct: 55, rate: 6.8, tenor: 10,
  },

  // ---- peer namespace: Poland (context only, never scored) ----
  peer: {
    name: ['Poland', '波兰'],
    asOf: 'Jul 2026',
    fxPlnPerEur: 4.27,
    cmPricePlnKW: 260, cmDY: '2030', cmAgreementYears: 17, cmAwardedBessGW: 5.0,
    derate: { 1: 0.22, 2: 0.40, 4: 0.65, 6: 0.80, 8: 0.89 },
    fleetMW: 1500, fleetMWh: 3500, pipelineGW: 20,
    daSpreadEur: 75, negHours: 1200, coalSharePct: 55,
    supportEurM: 1200, balancingReform: '15-minute settlement, 2024',
  },

  glossary: [
    ['Day-Ahead Market (DAM / PZU)', '日前市场'],
    ['Intraday Market (IDM / PI)', '日内市场'],
    ['OPCOM (market operator)', 'OPCOM（市场运营方）'],
    ['Transelectrica (transmission system operator)', 'Transelectrica（输电系统运营方）'],
    ['ANRE (energy regulator)', 'ANRE（能源监管机构）'],
    ['ATR — technical connection permit', 'ATR — 技术并网许可'],
    ['Establishment authorisation', '设立许可'],
    ['Connection agreement & works scope', '并网合同与工程范围'],
    ['Capacity-allocation auction', '容量分配拍卖'],
    ['Connection-tariff guarantee', '并网费保函'],
    ['Establishment-authorisation guarantee', '设立许可保函'],
    ['Double-charging of stored energy', '储能电量双重计费'],
    ['State-aid scheme budget vs award', '国家援助计划预算与正式授予之别'],
    ['Modernisation Fund / RRF co-financing', '现代化基金/复苏基金联合融资'],
    ['FCR / aFRR / mFRR', '频率遏制备用/自动频率恢复备用/手动频率恢复备用'],
    ['Balancing responsible party (BRP)', '平衡责任方'],
    ['Prequalification for reserve products', '备用产品预认证'],
    ['Activation price vs capacity price', '激活价格与容量价格之别'],
    ['RON / EUR reference rate', '列伊/欧元参考汇率'],
    ['Capacity market (Polish peer term)', '容量市场（波兰同业术语）'],
  ],

  kpiExport: [
    ['DAM weighted-average price 2025', 575.22, 'RON/MWh', 'official', 'RO_SEED_V1', 'OPCOM'],
    ['DAM traded volume 2025', 15.7, 'TWh', 'official', 'RO_SEED_V1', 'OPCOM'],
    ['DAM share of domestic consumption 2025', 32, '%', 'official', 'RO_SEED_V1', 'OPCOM'],
    ['IDM weighted-average price 2025', 518.43, 'RON/MWh', 'official', 'RO_SEED_V1', 'OPCOM'],
    ['DAM weighted-average price Jun 2026', 694.48, 'RON/MWh', 'official', 'RO_SEED_V1', 'OPCOM'],
    ['Standalone-storage state-aid scheme budget', 150, 'EUR m', 'official', 'RO_SEED_V1', 'European Commission'],
    ['Scheme minimum new storage energy by 2030', 2174, 'MWh', 'policy', 'RO_SEED_V1', 'scheme design'],
    ['Storage authorisations approved in one Feb 2026 meeting', 596, 'MW', 'official', 'RO_SEED_V1', 'ANRE'],
    ['Connection-tariff guarantee', 20, '%', 'verify', 'RO_SEED_V1', 'ANRE'],
    ['Allocation-auction participation guarantee', 20000, 'EUR/MW', 'verify', 'RO_SEED_V1', 'ANRE'],
    ['Executable net margin after all haircuts', 62, 'EUR/MWh', 'calculated', 'RO_SEED_V1', 'dashboard'],
    ['aFRR capacity requirement', 400, 'MW', 'illustrative', 'RO_SEED_V1', 'Transelectrica seed'],
    ['Poland capacity clearing price (peer, context only)', 260, 'PLN/kW/yr', 'illustrative (peer namespace)', 'CONTEXT_ONLY', 'PSE seed'],
    ['Poland BESS capacity awarded (peer, context only)', 5.0, 'GW', 'illustrative (peer namespace)', 'CONTEXT_ONLY', 'PSE seed'],
  ],
};

export { M };