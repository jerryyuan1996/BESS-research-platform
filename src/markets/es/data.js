/* ---------------------------------------------------------------------------
   Spain — market dataset. Every number is traceable to sources.js and to
   docs/spain-registration-plan.md, signed off 2026-10-29; the price figures
   reproduce from scripts/derive/spain-registration.mjs.
   --------------------------------------------------------------------------- */
import { landedDcPerKWh } from '../../comparison/supplierQuote.js';
import { comparison, PATH, FLEET_GW, AVERAGE_LOAD_GW } from './comparison.js';

const E = comparison.economics;

const M = {
  asOf: '2026-10-29',
  dataDate: 'OMIE day-ahead prices 1 Jan 2023 – 29 Oct 2026; Order TED/966/2026',
  modelVersion: 'es-1.0-omie-merchant',
  title: ['Spain Battery Investment Dashboard', '西班牙储能投资看板'],
  sub: ['A solar evening spread a four-hour battery is built for, a fleet still under 0.2 GW, and a capacity market in law with no auction yet: what trading pays, how fast the fleet takes it back, and what the capacity market might add.',
        '四小时储能正对应的光伏晚间价差、仍不足0.2GW的储能机组，以及已立法但尚未拍卖的容量市场：交易收入多少、机组增长会收回多少，以及容量市场可能增加什么。'],
  nextMilestone: ['Next milestone: the first capacity auction\'s call, with battery firmness coefficients (expected Q1 2027), and REE\'s balancing prices (gate ES-3)',
                  '下一里程碑：首次容量拍卖的公告及电池可靠性系数（预计2027年一季度），以及REE平衡服务价格（研究缺口ES-3）'],
  footerNote: ['Public sources read 29 October 2026: OMIE\'s day-ahead files, the BOE order creating the capacity market, REE\'s system report and battery counts, and MITECO\'s PINALM award.',
               '公开来源于2026年10月29日核阅：OMIE日前电价文件、设立容量市场的BOE法令、REE系统报告与电池统计，以及MITECO的PINALM资助结果。'],
  seedWarn: ['The trading line is perfect foresight on day-ahead prices alone, restated along a fleet path fitted on another market. Intraday and balancing revenue are not counted, and the capacity market pays nothing until an auction clears.',
             '交易收入为仅基于日前电价的完全预见值，并按以另一市场拟合的机组路径折算。未计入日内与平衡服务收入，容量市场在拍卖出清前不产生任何收入。'],

  /* ---- trading (OMIE, the merchant-lines definition) ----------------------- */
  trading: {
    years: [
      { y: '2023', v2: 44.4, v4: 76.5, tb4: 62.4, mean: 87.1 },
      { y: '2024', v2: 44.7, v4: 76.5, tb4: 60.1, mean: 63.0 },
      { y: '2025', v2: 64.1, v4: 111.3, tb4: 83.3, mean: 65.2 },
    ],
    v4PerDay2025: 304.89,
    ytdTo: '29 Oct', ytd4: { 2025: 318.8, 2026: 455.9 }, ytdMean: { 2025: 64.6, 2026: 82.6 },
    autumn2026: [ { m: ['Aug', '8月'], v4: 696, mean: 118 }, { m: ['Sep', '9月'], v4: 752, mean: 143 }, { m: ['Oct', '10月'], v4: 694, mean: 162 } ],
    spring2025: { april: 27, may: 17 },
    capture: [ { h: 1, c: 1.235 }, { h: 2, c: 1.161 }, { h: 4, c: 1.000 }, { h: 6, c: 0.795 }, { h: 8, c: 0.471 } ],
    deCheck: { v2: 79.4, v4: 133.6, published2: 79.5, published4: 134.6 },
  },

  /* ---- the fleet path ------------------------------------------------------ */
  fleet: {
    loadGW: AVERAGE_LOAD_GW,
    years: Object.keys(FLEET_GW).map(y => ({ y, gw: FLEET_GW[y], f: PATH[y] })),
    end2025MW: 96, april2026MW: 193, q2ApprovedGW: 1.76, permittingGW: 7.6,
  },

  /* ---- the capacity market (Order TED/966/2026) ------------------------------ */
  capacity: {
    approved: '2026-05-29', orderDate: '2026-09-15', inForce: '2026-09-18',
    budgetBn: 9, maxYears: 15, stressShareMax: 10, penaltyK: 1.2, firstAuction: ['Q1 2027 (sector estimate)', '2027年一季度（业界估计）'],
  },

  /* ---- grants ---------------------------------------------------------------- */
  pinalm: { aidM: 818.3, projects: 126, hybrid: 69, standalone: 39, thermal: 15, pumped: 3, gw: 2.2, gwh: 9.4, deadline: '2029-12-31', capKWh: 250, capKWhGridForming: 300 },
  guaranteePerKW: 40,

  /* The dashboard Investment Lab. Reconciles to the comparison archetype: a
     flat €220/kWh with no separate power line, Italy's convention for a survey
     band with no power/energy split. The spread is set so the Lab's trading
     line reproduces the €103,046 seed: 4 h × 365 × 97% × €72.76. */
  lab: {
    vatPct: 21, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
    mw: 50, hours: 4, capexKWh: 220, dcQuoteKWh: landedDcPerKWh('EUR'), capexKW: 0, opexKW: 10,
    rte: 88, avail: 97, degr: 2.0, cycles: 1, spread: Math.round(E.merchGross / (4 * 365 * 0.97) * 100) / 100, optFee: 10,
    capPrice: 0, capYrs: 0, servicesKW: 0, grantPct: 0,
    life: 15, disc: 8, debtPct: 50, rate: 6, tenor: 10,
  },
  /* No capacity line, so duration buys nothing on that channel yet. */
  deratingCurve: { 1: 1, 2: 1, 4: 1, 6: 1, 8: 1 },
  futureCapFactor: 0,
  /* Observed capture per MWh relative to four hours, 2023–2025 mean. */
  durSpreadFactor: { 1: 1.235, 2: 1.161, 4: 1.000, 6: 0.795, 8: 0.471 },
  usableFraction: 1,

  /* How the market got here, dated. */
  timeline: [
    { y: '2023', t: ['Spreads before batteries', '储能出现前的价差'],
      p: ['Mean day-ahead price €87/MWh; a four-hour battery would have earned €76.5k/MW on it. Spain\'s storage was pumped hydro, 3.3 GW; batteries were negligible (28 MW as late as April 2025).', '日前均价€87/MWh；四小时储能可得每MW 7.65万欧元。西班牙的储能以3.3GW抽水蓄能为主，电池可忽略不计（直至2025年4月仅28MW）。'],
      i: ['A solar market with almost no storage.', '几乎没有储能的光伏市场。'] },
    { y: '2025', t: ['Solar troughs and the blackout', '光伏低谷与大停电'],
      p: ['April and May averaged €27 and €17/MWh as midday solar flooded the market; the 28 April blackout sent balancing costs to a record. The four-hour value rose 45% to €111.3k/MW while the mean price fell. PINALM awarded €818m for 2.2 GW / 9.4 GWh on 30 December.', '4月与5月日前均价分别为€27与€17/MWh，午间光伏充斥市场；4月28日大停电使平衡服务成本创历史新高。四小时价值上升45%至每MW 11.13万欧元，而均价下降。12月30日PINALM以8.18亿欧元资助2.2GW/9.4GWh。'],
      i: ['Spreads widen as prices fall.', '电价下跌而价差扩大。'] },
    { y: '2026', t: ['A capacity market and an autumn spike', '容量市场与秋季价格飙升'],
      p: ['The Commission approved a capacity mechanism on 29 May; Order TED/966/2026 created it on 15 September. Batteries reached 193 MW in April. From August, prices rose to €118–162/MWh and the four-hour value to about €700/MW a day.', '欧盟委员会于5月29日批准容量机制；9月15日TED/966/2026号令正式设立。4月电池达193MW。自8月起电价升至€118–162/MWh，四小时价值约每MW每日€700。'],
      i: ['The upside arrives before the build does.', '上行空间先于建设到来。'] },
    { y: '2027–29', t: ['The first auctions and the grant fleet', '首批拍卖与受资助机组'],
      p: ['The first capacity auction is expected in Q1 2027; PINALM projects must be built by the end of 2029. On the fleet path the four-hour value is 7% lower by 2028 and 13% by 2030.', '首次容量拍卖预计于2027年一季度举行；PINALM项目须于2029年底前建成。按机组路径，四小时价值到2028年下降7%，到2030年下降13%。'],
      i: ['The entry point: a 2028 COD.', '进入点：2028年投运。'] },
  ],

  glossary: [
    ['OMIE — Operador del Mercado Ibérico de Energía, the Iberian day-ahead and intraday market operator', 'OMIE — 伊比利亚电力市场运营商，负责日前与日内市场'],
    ['REE — Red Eléctrica, Spain\'s transmission owner and system operator', 'REE — 西班牙输电网所有者兼系统运营商'],
    ['MITECO — the Ministry for the Ecological Transition', 'MITECO — 生态转型部'],
    ['PINALM — the FEDER-funded storage investment grant line run by IDAE', 'PINALM — 由IDAE管理、FEDER资助的储能投资补贴'],
    ['Potencia firme — firm capacity: installed MW × the firmness coefficient set in each auction call', '可靠容量 — 装机容量×每次拍卖公告设定的可靠性系数'],
    ['aFRR band — the secondary regulation capacity REE buys each day', 'aFRR调频容量 — REE每日采购的二次调频容量'],
    ['IVPEE — the 7% tax on the value of electricity generated; 0% from 2028', 'IVPEE — 7%的发电价值税；2028年起为0%'],
  ],
};

export { M };
export default M;
