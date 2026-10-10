/* ---------------------------------------------------------------------------
   Poland 鈥?market dataset, verbatim from the prototype (lines 1358-1588).

   Everything the dashboard shows: official snapshot values, scorecards, bands,
   de-rating and duration curves, the project pipeline, lab defaults and the
   per-tab narrative content. Not one value was changed by the migration.
   --------------------------------------------------------------------------- */

const M = {
  asOf: '2026-07-26',
  dataDate: '2025 annual / DY 2030',
  modelVersion: 'pl-seed-1.0-capacity-structure-ro-benchmark',
  title: ['Poland Battery Investment Dashboard', '波兰储能投资看板'],
  sub: ['Institutional investor storyline: market evolution, forward signals, project underwriting and portfolio application.',
        '面向机构投资人的投资叙事：市场演进、前瞻信号、项目承销与组合应用。'],
  nextMilestone: ['Next milestone: final URE results of the 3 September 2026 supplementary auction (PLN 325.55k/MW/yr; first batteries cleared, at a 95% factor), the 2028 additional-auction parameters, and the current connection-condition window. No main auction is planned in 2026',
                  '下一里程碑：2026年9月3日补充拍卖的URE最终结果（每MW每年32.555万兹罗提；储能首次中标，折减系数95%）、2028年附加拍卖参数，以及当前并网条件申请窗口。2026年不安排主拍卖'],
  footerNote: ['Sources re-verified 26 July 2026; Romanian data (Jul 2026) is held in a separate peer namespace and excluded from Poland scoring. Capacity-auction prices, correction factors and contracted volumes in this build are seed values that must be replaced with the published auction results before any transaction use.',
               '来源已于2026年7月26日重新核验；罗马尼亚数据（2026年7月）保存在独立同业命名空间，不计入波兰评分。本版本中的容量拍卖价格、折减系数与签约容量均为种子数值，任何交易用途前须以官方公布的拍卖结果替换。'],
  seedWarn: ['Every value on this page is an approved base-case snapshot or an illustrative placeholder, and the capacity-market figures in particular are unverified. No figure is production-complete until its live feed, validation and source-health check are running. A correction factor is never nameplate MW; connection conditions are never an executed connection agreement; a capacity contract is an obligation as well as a payment.',
             '本页所有数值均为已批准的基准情景快照或示例占位数据，其中容量市场数值尤未经核验。在实时数据接入、校验及来源健康检测上线前，任何指标均不可用于生产决策。折减系数不等于铭牌MW；并网条件不等于已签并网合同；容量合同既是付费也是义务。'],

  fx: 4.27,   // PLN per EUR — illustrative mid-rate; replace with the central-bank series
  official: {
    cmPricePln: 260, cmDY: '2030', cmAgreementYears: 17, cmAwardedBessGW: 5.0,
    fleetMW: 1500, fleetMWh: 3500, pipelineGW: 20,
    daSpreadEur: 75, negHours: 1200, coalSharePct: 55,
    supportEurM: 1200, balancingReformYear: 2024,
    dam2025Eur: 92, idm2025Eur: 88,
  },

  overall: { statusL: ['Selective', '选择性投资'], chipCls: 'warn', confidence: 72, codWindow: '2028–2030',
    rationale: ['A long capacity contract makes Polish storage conventionally financeable, but the auction is competitive, the correction factor decides how much of the asset is paid, and connection refusals decide whether the project can bid at all.',
                '长期容量合同使波兰储能具备常规可融资性，但拍卖竞争激烈、折减系数决定资产中获付费的比例，而并网拒批则决定项目能否参与投标。'] },
  components: [
    { n: ['Capacity market outlook', '容量市场前景'], w: 25, s: 72 },
    { n: ['Grid connection & queue risk', '并网与队列风险'], w: 20, s: 45 },
    { n: ['Wholesale & intraday outlook', '批发与日内前景'], w: 15, s: 68 },
    { n: ['Balancing & reserves access', '平衡与备用准入'], w: 10, s: 55 },
    { n: ['Storage-duration fit', '储能时长匹配度'], w: 10, s: 62 },
    { n: ['Pipeline saturation', '管线饱和度'], w: 10, s: 42 },
    { n: ['Financing & capital support', '融资与资本支持'], w: 10, s: 70 },
  ],

  // ---- capacity market ----
  cmYears: ['2026', '2027', '2028', '2029', '2030'],
  cmPriceSeries: [400, 340, 300, 275, 260],           // PLN/kW/yr — SEED, verify
  derateHours: [1, 2, 4, 6, 8],
  deratingCurve: { 1: 0.22, 2: 0.40, 4: 0.65, 6: 0.80, 8: 0.89 },
  futureCapFactor: 0.5,

  // ---- wholesale ----
  pxLabels: ['Q1-25', 'Q2-25', 'Q3-25', 'Q4-25', 'Q1-26', 'Q2-26'],
  damSeries: [104, 78, 88, 101, 98, 82],              // €/MWh — SEED
  spreadSeries: [68, 82, 76, 64, 71, 88],             // €/MWh average daily top–bottom — SEED
  negHoursYears: ['2023', '2024', '2025', '2026e'],
  negHoursSeriesY: [180, 550, 1200, 1600],
  spreadBridge: [
    { l: ['Published average daily day-ahead spread', '公布日均日前价差'], v: 88, t: 'start' },
    { l: ['Intraday & 15-minute re-trade uplift', '日内与15分钟再交易增益'], v: 7, t: 'd' },
    { l: ['Liquidity & gate-closure execution', '流动性与闭市执行折损'], v: -9, t: 'd' },
    { l: ['Round-trip efficiency loss (88%)', '往返效率损失(88%)'], v: -10, t: 'd' },
    { l: ['Availability, cycling & warranty limits', '可用率、循环与质保限制'], v: -4, t: 'd' },
    { l: ['Network charges & fees', '网络费用与其他费用'], v: -5, t: 'd' },
    { l: ['Optimiser fee (~9%)', '优化商费用(约9%)'], v: -7, t: 'd' },
    { l: ['Executable net margin', '可执行净价差'], v: 60, t: 'total' },
  ],
  codCases: { 2028: { low: 46, central: 62, high: 78 }, 2029: { low: 41, central: 57, high: 74 }, 2030: { low: 36, central: 52, high: 70 } },
  dilution: { 2028: 1.05, 2029: 1.00, 2030: 0.91 },

  // ---- balancing ----
  balProducts: [
    { id: 'FCR',  n: ['Frequency Containment Reserve', '频率遏制备用'], reqMW: 120, capEurMWh: 17, dir: ['symmetric', '对称'] },
    { id: 'aFRR', n: ['automatic Frequency Restoration Reserve', '自动频率恢复备用'], reqMW: 900, capEurMWh: 22, dir: ['up / down', '上调/下调'] },
    { id: 'mFRR', n: ['manual Frequency Restoration Reserve', '手动频率恢复备用'], reqMW: 2200, capEurMWh: 8, dir: ['up / down', '上调/下调'] },
  ],
  afrrCapSeries: [31, 28, 26, 23, 22, 20],
  evidenceLadder: [
    { n: ['1 · Published market results', '1 · 公开市场结果'], d: ['Observable from the system operator and the exchange — the only tier that is fact.', '可从系统运营方与交易所观察 — 唯一属于事实的层级。'] },
    { n: ['2 · Post-reform data only', '2 · 仅采用改革后数据'], d: ['The 2024 balancing reform changed settlement and dispatch; pre-reform history is a different market.', '2024年平衡市场改革改变了结算与调度机制；改革前的历史属于另一个市场。'] },
    { n: ['3 · Project prequalification', '3 · 项目预认证'], d: ['Certification for FCR, aFRR and mFRR is project-specific and not automatic.', 'FCR、aFRR与mFRR认证属项目特定，并非自动获得。'] },
    { n: ['4 · Award & activation record', '4 · 中标与激活记录'], d: ['Battery precedent is growing but still thin; treat modelled activation revenue as unproven.', '电池先例在增加但仍然稀薄；模型中的激活收入应视为未经证实。'] },
    { n: ['5 · Contracted floor or tolling', '5 · 合同保底或代工'], d: ['Less necessary here than in Romania because the capacity contract already provides the floor.', '此处的必要性低于罗马尼亚，因为容量合同已提供保底。'] },
  ],

  // ---- duration ----
  durationPath: { years: ['2028', '2029', '2030'], hours: [2, 4, 4] },
  durConfigs: [1, 2, 4, 6, 8],
  durSpreadFactor: { 1: 1.12, 2: 1.00, 4: 0.84, 6: 0.72, 8: 0.63 },
  usableFraction: 0.92,
  marginalHour: [
    { l: ['Capacity correction-factor uplift (0.40 → 0.65)', '容量折减系数提升(0.40→0.65)'], v: 15, t: 'd' },
    { l: ['Incremental arbitrage (deeper cycle)', '增量套利（更深循环）'], v: 12, t: 'd' },
    { l: ['Balancing access widened', '平衡市场准入扩大'], v: 4, t: 'd' },
    { l: ['Capital support eligibility', '资本支持资格'], v: 4, t: 'd' },
    { l: ['Annualised incremental capex', '年化增量资本开支'], v: -26, t: 'd' },
    { l: ['Degradation & opex', '衰减与运维'], v: -3, t: 'd' },
    { l: ['Net marginal value, hours 3–4', '第3–4小时净边际价值'], v: 6, t: 'total' },
  ],
  durFactors: [
    { n: ['Capacity correction-factor uplift by duration', '按时长的容量折减系数增益'], w: 20, s: 3 },
    { n: ['Solar build-out & midday trough depth', '光伏扩张与午间低谷深度'], w: 15, s: 3 },
    { n: ['Coal retirement & evening ramp length', '煤电退役与晚间爬坡时长'], w: 15, s: 2 },
    { n: ['Negative-price interval frequency', '负电价时段频率'], w: 10, s: 3 },
    { n: ['Balancing-product duration requirements', '平衡产品时长要求'], w: 10, s: 2 },
    { n: ['Capacity obligation during stress events', '紧张事件期间的容量义务'], w: 10, s: 2 },
    { n: ['Cross-border coupling damping of spreads', '跨境耦合对价差的平抑'], w: 10, s: 1 },
    { n: ['Cycling & degradation economics', '循环与衰减经济性'], w: 10, s: 2 },
  ],
  durBands: [
    { lo: 0, hi: 34, n: ['Short-duration market', '短时市场'], c: 'info',
      d: ['1–2h sufficient; do not add MWh without a correction-factor or contract reason.', '1–2小时足够；无折减系数或合同理由时不宜增配MWh。'] },
    { lo: 35, hi: 54, n: ['Transition zone', '过渡区间'], c: 'warn',
      d: ['Build 2h with augmentation optionality and re-test each auction vintage.', '按2小时建设并保留增容选择权，每个拍卖年份重新检验。'] },
    { lo: 55, hi: 69, n: ['Duration-value inflection', '时长价值拐点'], c: 'serious',
      d: ['Underwrite 4h; the correction-factor step is the main driver.', '按4小时测算；折减系数的阶跃是主要驱动。'] },
    { lo: 70, hi: 100, n: ['Long-duration / capacity-driven', '长时/容量驱动'], c: 'good',
      d: ['4h+ is the default new-build design; test 6h against incremental capex.', '4小时以上为新建默认设计；6小时须对照增量造价检验。'] },
  ],
  augItems: [
    ['Land reserved for additional enclosures', '预留新增电池舱用地'],
    ['DC collection system expansion capacity', '直流汇集系统扩容能力'],
    ['Transformer & switchgear headroom', '变压器与开关设备裕度'],
    ['PCS & EMS compatibility with added MWh', 'PCS与EMS对新增MWh的兼容性'],
    ['Connection conditions cover the added MWh', '并网条件覆盖新增MWh'],
    ['Building permit & environmental decision coverage', '建设许可与环评决定的覆盖范围'],
    ['OEM / LTSA augmentation rights', 'OEM/长期服务协议增容权利'],
    ['Capacity contract compliance after augmentation', '增容后容量合同合规'],
    ['Financing consent & reserve-account treatment', '融资同意与储备账户安排'],
  ],
  augDefaults: [2, 2, 1, 2, 1, 1, 1, 1, 1],

  // ---- pipeline ----
  stages: [
    { id: 'op',   n: ['Operating', '已投运'], p: 100 },
    { id: 'con',  n: ['Under construction, financing closed', '在建，已融资交割'], p: 92 },
    { id: 'cm',   n: ['Capacity contract awarded + connection agreement', '已获容量合同+并网协议'], p: 80 },
    { id: 'cert', n: ['Certified for the capacity auction, not yet awarded', '已通过容量拍卖认证，尚未中标'], p: 55 },
    { id: 'cc',   n: ['Connection conditions issued, no capacity contract', '已取得并网条件，无容量合同'], p: 40 },
    { id: 'perm', n: ['Permits and land only', '仅具备许可与土地'], p: 20 },
    { id: 'ann',  n: ['Announced / connection application only', '仅公告/并网申请'], p: 8 },
  ],
  projects: [
    { n: 'PL seed example A', region: 'Wielkopolska',    mw: 50,  h: 2, cod: 2026, st: 'op' },
    { n: 'PL seed example B', region: 'Mazowieckie',     mw: 100, h: 2, cod: 2027, st: 'con' },
    { n: 'PL seed example C', region: 'Śląskie',         mw: 200, h: 2, cod: 2027, st: 'cm' },
    { n: 'PL seed example D', region: 'Pomorskie',       mw: 150, h: 4, cod: 2028, st: 'cm' },
    { n: 'PL seed example E', region: 'Łódzkie',         mw: 250, h: 4, cod: 2028, st: 'cert' },
    { n: 'PL seed example F', region: 'Dolnośląskie',    mw: 120, h: 2, cod: 2028, st: 'cc' },
    { n: 'PL seed example G', region: 'Zachodniopomorskie', mw: 300, h: 4, cod: 2029, st: 'cert' },
    { n: 'PL seed example H', region: 'Lubelskie',       mw: 180, h: 4, cod: 2029, st: 'cc' },
    { n: 'PL seed example I', region: 'Małopolskie',     mw: 400, h: 4, cod: 2030, st: 'perm' },
    { n: 'PL seed example J', region: 'Kujawsko-Pomorskie', mw: 220, h: 6, cod: 2030, st: 'perm' },
    { n: 'PL seed example K', region: 'Podkarpackie',    mw: 500, h: 4, cod: 2030, st: 'ann' },
  ],

  // ---- connection ----
  connFactors: [
    { n: ['Connection conditions issued & capacity adequate', '已取得并网条件且容量充足'], w: 20, s: 2 },
    { n: ['Executed connection agreement & works schedule', '已签并网协议与工程进度'], w: 15, s: 2 },
    { n: ['Land, building permit & environmental decision', '土地、建设许可与环评决定'], w: 15, s: 1 },
    { n: ['Capacity-auction certification pathway', '容量拍卖认证路径'], w: 12, s: 1 },
    { n: ['Network reinforcement scope & cost allocation', '网络加强范围与费用分担'], w: 10, s: 2 },
    { n: ['Grid-code & technical compliance', '电网规范与技术合规'], w: 10, s: 1 },
    { n: ['Market registration & balancing certification', '市场注册与平衡市场认证'], w: 8, s: 2 },
    { n: ['Deposits, securities & release path', '押金、保证金与释放路径'], w: 5, s: 1 },
    { n: ['Evidence & governance quality', '证据与治理质量'], w: 5, s: 1 },
  ],
  connBands: [
    { lo: 0, hi: 24, n: ['Connection-investable', '可投资并网状态'], c: 'good',
      d: ['Evidence is sufficient to release development consideration.', '证据充分，可支付开发对价。'] },
    { lo: 25, hi: 44, n: ['Conditional — require CPs & holdbacks', '有条件 — 需先决条件与保留款'], c: 'warn',
      d: ['Structure the risk: conditions precedent, holdbacks, long-stop dates.', '以结构应对风险：先决条件、保留款、最终截止日。'] },
    { lo: 45, hi: 64, n: ['Material risk — re-price / defer', '重大风险 — 重新定价或延后'], c: 'serious',
      d: ['Re-price or defer until connection conditions and certification are proven.', '在并网条件与认证获证实前，重新定价或延后。'] },
    { lo: 65, hi: 100, n: ['Not investment-ready', '不具备投资条件'], c: 'critical',
      d: ['Do not commit capital; the connection chain is unproven.', '不得投入资本；并网链条尚未证实。'] },
  ],

  /* ---- named transmission, from PSE's Transmission Network Development Plan
     (PRSP) 2025–2034, agreed with the regulator URE on 20 December 2024 ------
     Poland's plan is unusually binding by the standards of this platform: URE
     agreement is a regulatory act, not a consultation output. What it is not is
     a commissioning guarantee, which is why the class column separates the
     projects that are physically underway from the ones the plan merely lists. */
  reinforcements: [
    { n: ['Choczewo 400 kV station', 'Choczewo 400千伏变电站'], operator: 'PSE', region: ['Pomerania — Żarnowiec area', '波莫瑞 — Żarnowiec地区'],
      cls: 'construction', scope: ['Offshore wind connection point; the plan allocates up to 5,350 MW of offshore capacity here by 2034', '海上风电并网点；规划到2034年在此分配最多5,350MW海上风电容量'],
      year: 2027, status: ['Under construction since March 2023; equipment passed readiness tests end-2025, completion 2027', '自2023年3月起施工；设备于2025年底通过就绪测试，2027年完工'], c: 'good' },
    { n: ['Krzemienica 400 kV station', 'Krzemienica 400千伏变电站'], operator: 'PSE', region: ['Pomerania — Słupsk area', '波莫瑞 — 斯武普斯克地区'],
      cls: 'planned', scope: ['Second offshore landing hub; the plan allocates up to 5,060 MW of offshore capacity here by 2034', '第二个海上风电落点枢纽；规划到2034年在此分配最多5,060MW海上风电容量'],
      year: 2034, status: ['In the agreed PRSP; no published commissioning date for the full allocation', '已列入获同意的PRSP；全部分配容量无公布投运日期'], c: 'serious' },
    { n: ['Słupsk 400 kV', 'Słupsk 400千伏'], operator: 'PSE', region: ['Pomerania', '波莫瑞'],
      cls: 'planned', scope: ['Third offshore landing point; 1,440 MW allocated by 2034', '第三个海上风电落点；到2034年分配1,440MW'],
      year: 2034, status: ['In the agreed PRSP; no published commissioning date', '已列入获同意的PRSP；无公布投运日期'], c: 'serious' },
    { n: ['Internal north–south HVDC link', '国内南北高压直流联络线'], operator: 'PSE', region: ['North → South Poland', '波兰北部 → 南部'],
      cls: 'planned', scope: ['The plan\'s flagship: a direct-current link carrying northern offshore and wind output to southern load without loading the AC network', '规划的旗舰项目：直流线路将北部海上风电与陆上风电送至南部负荷中心，且不加重交流网络负担'],
      year: 2034, status: ['Identified in the agreed PRSP; no route, consent or in-service date published', '已在获同意的PRSP中识别；未公布路径、许可或投运日期'], c: 'critical' },
    { n: ['PRSP 2025–2034 programme', 'PRSP 2025–2034计划'], operator: 'PSE, agreed by URE', region: ['Poland', '波兰全境'],
      cls: 'programme', scope: ['4,700 km of new 400 kV circuits, 28 new and 110 rebuilt substations, more than PLN 64bn to 2034', '新建4,700公里400千伏线路，新建28座、改造110座变电站，到2034年投资超过640亿兹罗提'],
      year: 2034, status: ['Agreed with URE on 20 December 2024 — a regulatory act, not a commissioning date', '2024年12月20日获URE同意 — 属监管行为，而非投运日期'], c: 'serious' },
  ],

  /* Poland's status vocabulary. `planned` is the class that does the work here:
     URE agreement makes a PRSP entry more than a wish, and still less than a
     project with a route and a date. */
  planClasses: [
    { id: 'construction', n: ['In construction', '在建'], c: 'good',
      d: ['Physically underway with a published completion year. The only class where a date can carry weight.', '已实际开工并公布完工年份。唯一日期具有分量的类别。'] },
    { id: 'planned',      n: ['In the agreed plan', '已列入获同意规划'], c: 'serious',
      d: ['Listed in a PRSP that the regulator has formally agreed, but with no route, consent or in-service date published. A 2034 horizon year is not a commissioning date.', '列入监管机构已正式同意的PRSP，但未公布路径、许可或投运日期。2034年的展望年份并非投运日期。'] },
    { id: 'programme',    n: ['Programme total', '计划总量'], c: 'serious',
      d: ['The plan-wide capital and route totals. Useful for sizing the national build; useless for dating any one connection.', '全规划的资本与线路总量。可用于衡量全国建设规模，但无法为任何单一并网确定日期。'] },
  ],

  lab: {
    /* ---- capital structure. Seeded neutral: nothing here moves a published
       return until it is set. VAT is recoverable, so it costs only timing, and
       the Lab leaves the refund lag to the engine. */
    vatPct: 23, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
    mw: 100, hours: 4, capexKWh: 200, capexKW: 170, opexKW: 9,
    rte: 88, avail: 96, degr: 2.0, cycles: 1.2, spread: 60, optFee: 9,
    capPrice: 60.9, capYrs: 17, servicesKW: 10, grantPct: 10,
    life: 20, disc: 8, debtPct: 60, rate: 6.2, tenor: 15,
  },

  // ---- peer namespace: Romania (context only, never scored) ----
  peer: {
    name: ['Romania', '罗马尼亚'],
    asOf: 'Jul 2026',
    fxRonPerEur: 4.97,
    capacityMechanism: false,
    dam2025Ron: 575.22, idm2025Ron: 518.43, damJun2026Ron: 694.48, dam2025TWh: 15.7, damSharePct: 32,
    schemeBudgetEurM: 150, schemeMinMWh: 2174, policyExtraMW: 2496,
    authFeb2026MW: 596, fleetMW: 420, fleetMWh: 780,
    executableSpreadEur: 62, codCentral2028: 58, codCentral2029: 54,
    afrrReqMW: 400, afrrCapEurMWh: 26,
  },

  glossary: [
    ['Capacity market (rynek mocy)', '容量市场'],
    ['Capacity auction (main / additional)', '容量拍卖（主拍卖/补充拍卖）'],
    ['Correction factor (de-rating)', '折减系数'],
    ['Capacity obligation', '容量义务'],
    ['Demand curve (capacity auction)', '容量拍卖需求曲线'],
    ['New-build capacity agreement (multi-year)', '新建容量协议（多年期）'],
    ['Certification for the capacity auction', '容量拍卖认证'],
    ['PSE (transmission system operator)', 'PSE（输电系统运营方）'],
    ['URE (energy regulator)', 'URE（能源监管机构）'],
    ['TGE (power exchange)', 'TGE（电力交易所）'],
    ['Connection conditions (warunki przyłączenia)', '并网条件'],
    ['Connection agreement (umowa o przyłączenie)', '并网协议'],
    ['Connection refusal', '并网拒批'],
    ['Building permit & environmental decision', '建设许可与环评决定'],
    ['Balancing market reform & 15-minute settlement', '平衡市场改革与15分钟结算'],
    ['FCR / aFRR / mFRR', '频率遏制备用/自动频率恢复备用/手动频率恢复备用'],
    ['Negative-price intervals', '负电价时段'],
    ['Coal retirement pathway', '煤电退役路径'],
    ['NFOŚiGW / Modernisation Fund support', '国家环保基金/现代化基金支持'],
    ['PLN / EUR reference rate', '兹罗提/欧元参考汇率'],
    ['Energy-only market (Romanian peer term)', '单一电能量市场（罗马尼亚同业术语）'],
  ],

  kpiExport: [
    ['Capacity auction clearing price (seed)', 260, 'PLN/kW/yr', 'verify', 'PL_SEED_V1', 'PSE — replace with published result'],
    ['Capacity agreement length, new build (seed)', 17, 'yr', 'verify', 'PL_SEED_V1', 'PSE — replace with published result'],
    ['BESS capacity contracted (seed)', 5.0, 'GW', 'verify', 'PL_SEED_V1', 'PSE — replace with published result'],
    ['Correction factor 2h (seed)', 0.40, 'factor', 'verify', 'PL_SEED_V1', 'PSE correction-factor table'],
    ['Correction factor 4h (seed)', 0.65, 'factor', 'verify', 'PL_SEED_V1', 'PSE correction-factor table'],
    ['Operating storage fleet (seed)', 1500, 'MW', 'illustrative', 'PL_SEED_V1', 'public compilation'],
    ['Connection pipeline (seed)', 20, 'GW', 'illustrative', 'PL_SEED_V1', 'public compilation'],
    ['Average daily day-ahead spread (seed)', 88, 'EUR/MWh', 'illustrative', 'PL_SEED_V1', 'TGE-derived seed'],
    ['Executable net margin after all haircuts', 60, 'EUR/MWh', 'calculated', 'PL_SEED_V1', 'dashboard'],
    ['Negative-price hours 2025 (seed)', 1200, 'h', 'illustrative', 'PL_SEED_V1', 'TGE-derived seed'],
    ['Coal share of generation (seed)', 55, '%', 'illustrative', 'PL_SEED_V1', 'public compilation'],
    ['Romania capacity mechanism (peer, context only)', 'none', '-', 'official (peer namespace)', 'CONTEXT_ONLY', 'ANRE / market design'],
    ['Romania executable spread (peer, context only)', 62, 'EUR/MWh', 'calculated (peer namespace)', 'CONTEXT_ONLY', 'Romania dashboard'],
  ],
};

export { M };