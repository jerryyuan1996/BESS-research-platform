/* ---------------------------------------------------------------------------
   WA seed dataset, verbatim from the prototype (lines 338-531).
   Official snapshot values plus the illustrative series that must be replaced by
   live ETL before any investment use. Every value is unchanged.
   --------------------------------------------------------------------------- */
import { landedDcPerKWh } from '../../../comparison/supplierQuote.js';


// ---------------- SEED DATA (spec §3 official snapshot + §24 example JSON) ----------------
const SEED = {
  asOf: '2026-07-26',
  modelVersion: 'seed-1.3-wem-structure-nem-benchmark',
  // --- official snapshot values (spec §3) — badge: official, status: SEED_JSON_V1 ---
  brcp2829: 488500,          // A$/MW/yr, 2028-29 Peak & Flexible BRCP (ERA, 200 MW / 1,200 MWh benchmark)
  rcp2728: 360700,           // A$/MW/yr, 2027-28 published Peak RCP
  peakRcr2829: 6323,         // MW
  surplusAboveRcr: 347,      // MW existing+committed above Peak RCR (official position)
  fleetMW: 1275, fleetMWh: 5140,          // Q1 2026 (AEMO)
  spreadNow: 13, spreadPrior: 51,          // A$/MWh energy price spread Q1 2026 vs Q1 2025 (AEMO)
  fcessBattRevNow: 4.2, fcessBattRevPrior: 8.6,   // A$M battery FCESS revenue Q1 2026 vs Q1 2025
  fcessCostNow: 5.1,         // A$M FCESS enablement cost Q1 2026 (down ~75% yoy)
  esrHours: 7,               // 2026 RCM ESR duration requirement (new-storage certification context)
  // --- calculated from the official snapshot ---
  get expectedCC(){ return this.peakRcr2829 + this.surplusAboveRcr; },              // 6,670 MW
  get supplyRatio(){ return this.expectedCC / this.peakRcr2829; },                  // 1.0549
  get upperDeadbandHeadroom(){ return Math.round(this.peakRcr2829 * 1.05 - this.expectedCC); },  // −31 MW
  get lowerDeadbandHeadroom(){ return Math.round(this.expectedCC - this.peakRcr2829 * 0.95); },
  get fleetAvgHours(){ return this.fleetMWh / this.fleetMW; },

  // --- homepage decision seed (spec §24, illustrative) ---
  overall: { confidence: 74, codWindow: '2028–2029',
    rationale: ['RCM remains supportive, while energy arbitrage and FCESS are being diluted by rapid battery entry.',
                'RCM仍具支撑，但电池集中投运正在压缩现货套利和FCESS收益。'] },
  connection: { wpStage: ['Planning', '规划阶段'], gpsStage: 'R0', aoStatus: ['Draft', '草案'],
    naqToNameplate: 0.95, floatMonths: 7 },
  durationSig: { stage: ['Long-duration / capacity-driven', '长时容量驱动'],
    driver: ['ESR requirement and islanded-grid residual peak', 'ESR时长要求及孤立电网剩余峰值'] },

  // --- illustrative quarterly series (badge: illus; endpoints anchored to official §3 values) ---
  quarters: ['Q1-25', 'Q2-25', 'Q3-25', 'Q4-25', 'Q1-26'],
  spreadSeries: [51, 44, 33, 21, 13],
  fleetMWhSeries: [2600, 3200, 3900, 4600, 5140],
  fleetMWSeries: [720, 860, 1010, 1150, 1275],
  negHoursSeries: [210, 255, 240, 315, 350],
  fcessBattRevSeries: [8.6, 7.4, 6.1, 5.0, 4.2],
  fcessShareSeries: [38, 45, 54, 62, 70],
  fcessCostSeries: [20.4, 16.8, 12.9, 8.4, 5.1],
  // trailing optimised gross revenue, A$k/MW/yr annualised, by duration (illustrative)
  tbSeries: {
    '2h':  [98, 84, 66, 48, 36],
    '4h':  [132, 118, 98, 78, 64],
    '6h':  [149, 137, 118, 99, 86],
    '8h':  [158, 148, 131, 113, 101],
    '10h': [163, 155, 140, 123, 112],
  },
  eventDurBuckets: ['<1h', '1–2h', '2–4h', '4–6h', '>6h'],
  eventDurCounts: [34, 41, 28, 17, 6],

  // --- RCM series (illustrative history; 2027-28 RCP and 2028-29 BRCP are official) ---
  capYears: ['2025-26', '2026-27', '2027-28', '2028-29'],
  brcpSeries: [210000, 245000, 372000, 488500],
  rcpSeries: [178000, 225000, 360700, null],
  capBalance: { existing: 5720, committed: 950, anticipatedPwt: 240, eoiPwt: 120 },
  demandWaterfall: [
    { l: ['2026-27 RCR (illustrative)', '2026-27 RCR（示例）'], v: 6100, t: 'start' },
    { l: ['Population / organic', '人口/自然增长'], v: 80, t: 'd' },
    { l: ['Committed industrial', '已承诺工业负荷'], v: 90, t: 'd' },
    { l: ['Data centres (prob-wt)', '数据中心（概率加权）'], v: 60, t: 'd' },
    { l: ['Speculative industrial (prob-wt)', '投机性工业（概率加权）'], v: 40, t: 'd' },
    { l: ['Weather normalisation', '气象归一化'], v: -47, t: 'd' },
    { l: ['2028-29 Peak RCR (official)', '2028-29峰值RCR（官方）'], v: 6323, t: 'total' },
  ],
  largeLoads: [
    { n: 'Example load A — data centre', mw: 120, stage: ['Access contract executed', '接入合同已签署'], sys: 'SWIS_CONFIRMED' },
    { n: 'Example load B — Li refinery expansion', mw: 85, stage: ['Studies', '研究阶段'], sys: 'SWIS_CONFIRMED' },
    { n: 'Example load C — data centre campus', mw: 200, stage: ['Enquiry', '问询阶段'], sys: 'UNKNOWN' },
    { n: 'Example load D — Pilbara mining electrification', mw: 350, stage: ['FID', '最终投资决定'], sys: 'NWIS' },
    { n: 'Example load E — green H2 pilot', mw: 150, stage: ['Announced', '仅公告'], sys: 'OFF_GRID' },
  ],

  // --- ESR trajectory (rule path per spec §2.6/§9.2A; transition vintages indicative) ---
  esrYears: ['2024-25', '2025-26', '2026-27', '2027-28', '2028-29'],
  esrPath: [4, 4, 4, 6, 7],

  // --- fleet + pipeline duration distribution (illustrative) ---
  durBuckets: ['≤2h', '4h', '6h', '≥8h'],
  fleetByDurMW: [220, 905, 150, 0],
  fleetByDurMWh: [440, 3620, 1080, 0],
  pipeByDurMW: [90, 640, 480, 260],
  pipeByDurMWh: [180, 2560, 2880, 2200],

  // --- marginal hour waterfall, 7h → 8h, A$k/MW/yr (illustrative) ---
  marginalHour: [
    { l: ['RCM duration compliance', 'RCM时长合规价值'], v: 18, t: 'd' },
    { l: ['Incremental arbitrage', '增量套利'], v: 9, t: 'd' },
    { l: ['Reliability / flexibility', '可靠性与灵活性'], v: 3, t: 'd' },
    { l: ['Annualised capex', '年化资本开支'], v: -22, t: 'd' },
    { l: ['Degradation & opex', '衰减与运维'], v: -4, t: 'd' },
    { l: ['Net marginal value', '净边际价值'], v: 4, t: 'total' },
  ],

  // --- pipeline stage probabilities (spec §10.2 defaults, editable) ---
  stages: [
    { id: 'op',   n: ['Operating', '已投运'], p: 100 },
    { id: 'con',  n: ['Under construction (financial close)', '在建（已完成融资交割）'], p: 90 },
    { id: 'com',  n: ['Committed / contract awarded', '已承诺 / 合同授予'], p: 75 },
    { id: 'crc',  n: ['CRC, RCS & network pathway complete', 'CRC、RCS及网络路径基本完成'], p: 65 },
    { id: 'ao',   n: ['Access Offer, no financing', '已获接入报价、未融资'], p: 45 },
    { id: 'da',   n: ['DA & land secured, early grid process', '已获开发批准、前期并网'], p: 25 },
    { id: 'eoi',  n: ['EOI / announced only', '意向 / 仅公告'], p: 10 },
  ],
  // illustrative placeholder projects — NOT real facilities
  projects: [
    { n: 'Seed example A', mw: 200, h: 4, cod: 2026, st: 'op' },
    { n: 'Seed example B', mw: 100, h: 4, cod: 2026, st: 'con' },
    { n: 'Seed example C', mw: 150, h: 2, cod: 2027, st: 'con' },
    { n: 'Seed example D', mw: 220, h: 4, cod: 2027, st: 'com' },
    { n: 'Seed example E', mw: 120, h: 6, cod: 2027, st: 'crc' },
    { n: 'Seed example F', mw: 250, h: 4, cod: 2028, st: 'com' },
    { n: 'Seed example G', mw: 180, h: 6, cod: 2028, st: 'ao' },
    { n: 'Seed example H', mw: 300, h: 8, cod: 2028, st: 'da' },
    { n: 'Seed example I', mw: 140, h: 6, cod: 2029, st: 'ao' },
    { n: 'Seed example J', mw: 400, h: 8, cod: 2029, st: 'da' },
    { n: 'Seed example K', mw: 200, h: 10, cod: 2029, st: 'eoi' },
    { n: 'Seed example L', mw: 250, h: 4, cod: 2029, st: 'eoi' },
  ],

  // --- Duration-Need Index factors (spec §9.5; preset scores illustrative, editable) ---
  dniFactors: [
    { n: ['Minimum net-demand decline & evening-ramp length', '最小净负荷下降与晚高峰爬坡时长'], w: 15, s: 3 },
    { n: ['Solar vs wind composition of forward supply', '远期供给中光伏与风电构成'], w: 8, s: 2 },
    { n: ['Thermal retirement vs firm replacement gap', '火电退出与可靠替代缺口'], w: 12, s: 2 },
    { n: ['Grid isolation & import capability', '电网孤立性与外部输入能力'], w: 10, s: 3 },
    { n: ['System size & geographic diversity', '系统规模与地理多样性'], w: 5, s: 3 },
    { n: ['Duration-differentiated capacity rules', '按时长差异化的容量规则'], w: 15, s: 3 },
    { n: ['Longer-duration energy-price signal', '长时段电价信号'], w: 10, s: 1 },
    { n: ['Ancillary-market saturation', '辅助服务市场饱和度'], w: 8, s: 3 },
    { n: ['Explicit long-duration policy / procurement', '明确的长时政策或采购信号'], w: 10, s: 1 },
    { n: ['Reliability standard & extreme-event tail', '可靠性标准与极端事件尾部'], w: 7, s: 2 },
  ],
  dniBands: [
    { lo: 0, hi: 34, n: ['Short-duration market', '短时市场'], c: 'info',
      d: ['2–4h may be sufficient; do not overbuild MWh without contract value.', '2–4小时可能足够；无合同价值时不宜过度配置MWh。'] },
    { lo: 35, hi: 54, n: ['Transition zone', '过渡区间'], c: 'warn',
      d: ['Build only with augmentation optionality and monitor rules quarterly.', '仅在保留增容选择权的前提下建设，并每季度跟踪规则。'] },
    { lo: 55, hi: 69, n: ['Duration-value inflection', '时长价值拐点'], c: 'serious',
      d: ['Underwrite 6–8h and compare contracted versus merchant tails.', '按6–8小时进行测算，并对比合同与市场化尾部收益。'] },
    { lo: 70, hi: 100, n: ['Long-duration / capacity-driven', '长时容量驱动'], c: 'good',
      d: ['Duration compliance is a core investment condition: build to the ESR requirement and price every added hour on its own.', '时长合规是核心投资条件：按ESR要求建设，并为每一新增小时单独定价。'] },
  ],

  // --- augmentation option checklist (spec §9.8; 0–2 each, editable) ---
  augItems: [
    ['Land reserved for additional containers', '预留增容集装箱用地'],
    ['DC collection system expansion capacity', '直流汇集系统扩容能力'],
    ['Transformer & switchgear headroom', '变压器与开关设备裕度'],
    ['PCS & EMS compatibility', 'PCS与EMS兼容性'],
    ['Grid approval treatment of MWh-only augmentation', '仅增MWh的并网审批处理'],
    ['Planning & environmental approval coverage', '规划与环评覆盖'],
    ['OEM / LTSA augmentation rights', 'OEM/长期服务协议增容权利'],
    ['Financing consent & reserve-account treatment', '融资同意与储备账户安排'],
    ['Augment without reducing contracted availability', '增容不影响合同可用率'],
  ],
  augDefaults: [2, 2, 1, 2, 1, 1, 1, 1, 1],


  // --- Investment Lab defaults (illustrative) ---
  lab: {
    /* REBUILT 2026-10-17: 44% of the ERA A$520/kWh is held; the DC slice is the
       quoted block landed (src/comparison/supplierQuote.js). */
    mw: 200, hours: 8, capexKWh: 0.44 * 520 + landedDcPerKWh('AUD'), dcQuoteKWh: landedDcPerKWh('AUD'), opexKW: 18, rte: 88, avail: 97, degr: 1.5,
    ccPct: 95, rcpPct: 100, fcessKW: 12, life: 20, disc: 8, debtPct: 60, rate: 6.5, tenor: 12,
  },
  merchantCurve: { 2: 62000, 4: 96000, 6: 121000, 7: 131000, 8: 139000, 10: 151000, 12: 158000 }, // A$/MW/yr, illustrative
};

export { SEED };
