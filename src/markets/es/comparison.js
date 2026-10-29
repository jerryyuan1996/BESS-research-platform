/* ---------------------------------------------------------------------------
   Spain — comparison interface. Economics are per MW per year, in EUR.

   Registered by the analyst's sign-off of 2026-10-29 on
   docs/spain-registration-plan.md, which carries every derivation below with
   its source; scripts/derive/spain-registration.mjs reproduces them from
   OMIE's files. Not by scout graduation: Spain had no card.

   THE CASE IN ONE LINE. Spain is a solar evening spread that a four-hour
   battery is built for, traded by a fleet that is still tiny, with a capacity
   market in law that has not yet held an auction. Merchant revenue carries
   the whole return until it does.

   ---------------------------------------------------------------------------
   THE MERCHANT LINE (OMIE marginalpdbc, Spanish zone; the merchant-lines
   definition: one cycle a day, charge before discharge, 88% round trip on the
   charge leg, best schedule found exactly, hourly prices)

     4 h day-ahead value   2023 €76.5k   2024 €76.5k   2025 €111.3k (€304.89/day)
     2026 to 29 October    +43.0% on the same days of 2025

   Spain's own fleet (REE: 96 MW at end-2025, 193 MW in April 2026) against
   29.22 GW of average load (REE, 2025 demand 256 TWh), on the curve fitted on
   Bulgaria, takes 7.4% off by a 2028 COD:

     fleet, annual average GW   2025 0.06  2026 0.35  2027 1.5  2028 3.5  2029 5.5  2030 7.5
     factor                     1.000      0.993      0.966     0.926     0.894     0.868

   THE CAPACITY MARKET (Order TED/966/2026, in force 18 September 2026) is not
   a line here. It has no auction, no published cap and no battery firmness
   coefficient; a new-storage award runs half the technology's useful life,
   never more than fifteen years, is pay-as-bid, and is NOT indexed (art.
   15.2). When the first auction clears it enters as a play, nominal — the
   analyst's ruling of 2026-10-29 makes it an exception to the 2.5% rule.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { quotedEconomics } from '../../comparison/supplierQuote.js';

/* ---- the merchant leg's level and path ------------------------------------- */
/* 2025 day-ahead value of a 1 MW / 4 h battery, EUR per MW-day and per year. */
export const DA_VALUE_4H_2025 = 304.888 * 365;      // €111,284
const DA_VALUE_4H_2024 = 209.70 * 365;              // €76,541
const DA_VALUE_4H_2023 = 209.50 * 365;              // €76,468
const DA_VALUE_4H_2026_YTD = 455.90 * 365;          // €166,404, 1 Jan – 29 Oct 2026

/* The compression curve fitted on Bulgaria (docs/merchant-lines-plan-2026-10.md). */
const factor = (x) => 1 - 0.243 * (1 - Math.exp(-x / 0.324));
/* REE, 2025 national demand at power-station busbars: 256 TWh ÷ 8,760 h. */
export const AVERAGE_LOAD_GW = 256 / 8.76;
export const FLEET_GW = { 2025: 0.06, 2026: 0.35, 2027: 1.5, 2028: 3.5, 2029: 5.5, 2030: 7.5 };
export const PATH = Object.fromEntries(Object.entries(FLEET_GW)
  .map(([y, g]) => [y, factor((g - FLEET_GW[2025]) / AVERAGE_LOAD_GW)]));
export const YEAR_ONE = 2028;
/* Band ends: a fast build (5 GW by 2028) and a slow one (1.8 GW). */
const FAST_2028 = factor((5.0 - FLEET_GW[2025]) / AVERAGE_LOAD_GW);    // 0.901
const SLOW_2028 = factor((1.8 - FLEET_GW[2025]) / AVERAGE_LOAD_GW);    // 0.959

/* ---- capex: the European 4 h survey, Italy's basis -------------------------- */
/* €220/kWh, the midpoint of the €180–260/kWh European turnkey 4 h LFP band,
   method HELD: a 2026 survey that already prices today's DC blocks, so it
   stands and the quote says how much of it is the block. The ceiling sits
   near PINALM's €250/kWh eligible-cost cap for standalone storage. */
const HOURS = 4;
const CAPEX_TOTAL_PER_MW = 220 * HOURS * 1000;
/* Fixed opex, Ireland and Poland range, with the quote's service package
   inside it (gate ES-4). */
const OPEX_SEED_PER_MW = 10000;
const QUOTED = quotedEconomics({ currency: 'EUR', hours: HOURS, method: 'held', total: CAPEX_TOTAL_PER_MW, opexSeed: OPEX_SEED_PER_MW });

const economics = {
  capexPerMW: CAPEX_TOTAL_PER_MW,
  capexStack: QUOTED.capexStack,
  capexQuotedPerMW: QUOTED.capexQuotedPerMW,
  /* IVA, recoverable. */
  vatPct: 21, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,
  opexPerMW: QUOTED.otherOpexPerMW,
  serviceSchedulePerMW: QUOTED.serviceSchedulePerMW,

  /* No contracted line until the first capacity auction clears (gate ES-1). */
  contracted: 0,
  contractYears: 0,
  postFactor: 0,

  /* The 2025 day-ahead value restated at year 1 (COD 2028): €111,284 × 0.926. */
  merchGross: Math.round(DA_VALUE_4H_2025 * PATH[YEAR_ONE]),
  merchantCurve: [1, PATH[2029] / PATH[YEAR_ONE], PATH[2030] / PATH[YEAR_ONE]].map(v => Math.round(v * 1000) / 1000),
  merchantCurveBasis: {
    yearOne: YEAR_ONE,
    text: [
      'Spain\'s own fleet, 0.06 GW in 2025 to 7.5 GW in 2030 (REE counts; PINALM\'s 2.2 GW by 2029), against 29.2 GW of average load, on the compression Bulgaria\'s fleet produced in 2026: −24.3% × (1 − e^(−x/0.324)), x = added battery MW ÷ average load.',
      '西班牙自身储能由2025年的0.06GW增至2030年的7.5GW（REE统计；PINALM于2029年前新增2.2GW），对应29.2GW平均负荷，采用保加利亚储能在2026年造成的价差压缩曲线：−24.3% × (1 − e^(−x/0.324))，x为新增电池功率除以平均负荷。',
    ],
  },
  feePct: 10,

  /* No balancing line until REE's band prices are read (gate ES-3). Spain's
     aFRR band and mFRR do pay batteries, so zero understates the asset; the
     direction of the error is deliberate. */
  services: 0,

  /* PINALM's round 1 is closed; a grant reaches a new investor only by buying
     an awarded project, which waits for IDAE's per-project aid (gate ES-5). */
  grantPct: 0,
  degr: 2,

  servicesNote: [
    'Balancing revenue is not counted until REE\'s aFRR band and mFRR prices are read (gate ES-3). Merchant leg falls with Spain\'s own fleet: −3.5% in year 2, −6.3% from year 3.',
    '在读取REE的aFRR调频容量与mFRR价格前不计入平衡服务收入（研究缺口ES-3）。市场化收入随西班牙自身储能增长而下降：第2年−3.5%，第3年起−6.3%。',
  ],
};

const ranges = {
  devCostPct: limits(0, 0, 15, {
    basis: ['Zero because the European survey is EPC scope. The ceiling is the platform convention.', '因欧洲调查为EPC口径，取零。上限为平台惯例。'],
    source: 'No published Spanish series; bound is the platform convention',
    gate: 'ES-4',
  }),
  rtbPremiumPct: limits(0, 0, 200, {
    basis: ['No Spanish ready-to-build trade price is published.', '西班牙无公开的可建设阶段交易价格。'],
    source: 'Never published, in any market',
    gate: 'ES-4',
  }),
  constructionMonths: limits(12, 9, 36, {
    basis: ['Platform convention. PINALM gives projects 36 months from the award to be built.', '平台惯例。PINALM给予项目自资助之日起36个月的建设期。'],
    source: 'Platform convention; MITECO PINALM award, 30 Dec 2025',
    gate: 'ES-4',
  }),
  capexPerMW: band(economics.capexPerMW, 180 * HOURS * 1000, 260 * HOURS * 1000, {
    basis: [
      'The €180–260/kWh European turnkey 4 h LFP band at four hours; the seed is its €220/kWh midpoint, Italy\'s basis. PINALM caps eligible cost at €250/kWh for standalone storage, near the ceiling.',
      '欧洲4小时磷酸铁锂交钥匙区间€180–260/kWh按四小时换算；种子值取其中值€220/kWh，与意大利同一基准。PINALM将独立储能合格成本上限定为€250/kWh，接近区间上限。',
    ],
    source: '2026 European BESS turnkey EPC surveys (€180–260/kWh, 4h LFP); Order TED/535/2025',
    gate: 'ES-4',
  }),
  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: ['No Spanish fixed-opex series. €10,000/MW/yr is the Ireland and Poland range, with the supplier\'s service package carried separately; access tolls for storage are not yet read.', '无西班牙固定运维序列。€10,000/MW/年取爱尔兰与波兰区间，供应商服务包单列；储能接入费尚未读取。'],
    source: 'Platform seed',
    gate: 'ES-4',
  }),
  merchGross: band(economics.merchGross, Math.round(DA_VALUE_4H_2024 * FAST_2028), Math.round(DA_VALUE_4H_2026_YTD * SLOW_2028), {
    basis: [
      'The seed is the 2025 day-ahead value of a 4 h battery on OMIE prices (€111.3k: one cycle a day, 88% round trip, perfect foresight) restated at 2028 by Spain\'s fleet path, × 0.926. The floor is the 2024 value on a fast build (5 GW by 2028, × 0.901); the ceiling is the 2026 rate to 29 October on a slow one (1.8 GW, × 0.959).',
      '种子值为基于OMIE电价的4小时储能2025年日前价值（€111.3k：每日一次循环、往返效率88%、完全预见），按西班牙储能路径折算至2028年，× 0.926。下限取2024年价值与快速建设（2028年5GW，× 0.901）；上限取2026年截至10月29日的水平与慢速建设（1.8GW，× 0.959）。',
    ],
    source: 'OMIE marginalpdbc day-ahead prices, Spanish zone, 2023–2026; REE installed batteries; MITECO PINALM award; docs/spain-registration-plan.md',
    gate: 'ES-2',
  }),
  feePct: limits(economics.feePct, 6, 12, {
    kind: 'dispersed',
    basis: ['Optimiser fees across the platform\'s markets run 8–10% of market revenue; the band widens that by the stated dispersion.', '本平台各市场优化商费用为市场化收入的8–10%；该区间在此基础上按既定离散幅度扩展。'],
    source: 'Platform cross-market seeds, widened by the stated dispersion',
  }),
  /* No services band: the capability is off until REE's prices are read, as
     Ontario's is, so the Lab exposes no services line (gate ES-3). */
  degr: limits(economics.degr, 1, 3, {
    kind: 'dispersed',
    basis: ['2%/yr, the platform seed in every market.', '每年2%，各市场统一种子值。'],
    source: 'Platform seed — held constant across all markets',
    gate: 'G13',
  }),
};

export const comparison = {
  /* Four hours: the solar evening spread, PINALM's 4.3 h average and a
     capacity market that credits firmness by duration (decision 1). */
  archetype: { powerMW: 50, durationHours: HOURS },

  /* Observed: the 2023–2025 mean of day-ahead value per MWh by duration,
     relative to 4 h (scripts/derive/spain-registration.mjs). Eight hours falls
     away because a day has only so many solar troughs and evening peaks. */
  durationResponse: {
    hours: [1, 2, 4, 6, 8],
    merchantCapture: [1.235, 1.161, 1.000, 0.795, 0.471],
    merchantCaptureBasis: 'observed',
    opexEnergyShare: 0.5,
  },

  capabilities: {
    /* False until an auction clears: the mechanism is law with nothing to
       bank yet, the reasoning Finland's file sets out. */
    capacityMarket: false,
    merchant: true,
    ancillaryServices: false,   // withheld until REE prices are read — see `services`
    tolling: false,
  },

  engineReady: true,

  economics,
  ranges,

  /* The line the evidence rule checks (src/governance/briefing.js). The path
     rides a curve fitted on Bulgaria, so it is 'other-market', as Romania's is. */
  merchantEvidence: {
    year: 2025,
    hours: HOURS,
    observedPerMW: Math.round(DA_VALUE_4H_2025),
    restateFactor: PATH[YEAR_ONE],
    /* 2023–2025 observed: €76,468 / €76,541 / €111,284. */
    range: [Math.round(DA_VALUE_4H_2023), Math.round(DA_VALUE_4H_2025)],
    pathFit: 'other-market',
    source: 'OMIE marginalpdbc day-ahead prices, Spanish zone, 2025',
    basis: [
      '2025 day-ahead value of a 4 h battery: hourly prices, one cycle a day, 88% round trip, perfect foresight.',
      '4小时储能2025年日前价值：小时价格、每日一次循环、往返效率88%、完全预见。',
    ],
  },

  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. Spain has no capacity award yet, so the merchant leg carries the entire return from commercial operation.',
    '第1年。西班牙尚无容量授标，因此市场化收入自商业运行起承担全部回报。',
  ]),

  narrative: {
    archetype: ['50 MW · 4h · merchant', '50MW · 4小时 · 市场化'],
    thesis: [
      'A solar spread: midday prices collapse and evenings hold, so a four-hour battery earned €111k/MW on 2025 day-ahead prices and 2026 is running 43% higher. Spain\'s own fleet is under 0.2 GW, so its build takes only 7% off by 2028. The capacity market is law with its first auction expected in Q1 2027 — the upside, not the case.',
      '光伏价差市场：午间电价崩落而晚间坚挺，四小时储能按2025年日前电价每MW收入11.1万欧元，2026年至今高出43%。西班牙自身储能不足0.2GW，到2028年其建设仅使价值下降7%。容量市场已立法，首次拍卖预计于2027年一季度举行 — 属上行空间而非基本情景。',
    ],
    /* PINALM's grant-backed 2.2 GW against the 193 MW REE counted in April
       2026. The 7.6 GW in permitting would read about 40×. */
    pipelineRatio: '~11×',
  },
};

export default comparison;
