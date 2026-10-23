/* ---------------------------------------------------------------------------
   Ontario — comparison interface. Economics are per MW per year, in CAD.

   Registered by the analyst's sign-off of 2026-10-23 on
   docs/ontario-registration-plan.md, which carries every derivation below with
   its source. Not by scout graduation: Ontario had no card.

   THE CASE IN ONE LINE. IESO's LT2 capacity contract pays a fixed price per
   MW-Business Day for twenty years and lets the owner keep every market
   revenue, so an Ontario battery is a contracted eight-hour asset with a
   trading line on top — about two-thirds contract, one-third trading.

   ---------------------------------------------------------------------------
   THE CONTRACT (IESO, LT2(c-1) Contract, final form of 4 November 2025)

     term        COD to 30 April 2050; milestone COD 1 May 2030 (s.9.1, Exhibit P)
     price       C$/MW-Business Day; 20% follows Ontario CPI after COD, 80% is
                 fixed in nominal dollars; the whole price follows CPI from
                 contract date to COD (Exhibit J)
     revenue     the IESO "shall have no interest" in the facility's other
                 products or services (s.2.10) — trading is the owner's
     duration    eight or twelve hours (Exhibit A; RFP s.2.1(c))
     fade        payment scales with tested capacity; two failed tests below
                 85% of contract capacity are an event of default (s.15.6);
                 the owner may cut contract capacity by up to 7% after year 3
                 (s.4.3)
     support     the Clean Technology ITC is excluded from the 50% clawback on
                 future government support (s.2.15)

   Business Days, from the contract's definition and IESO's holiday schedules:
   250–252 a contract year, mean 250.90 over the twenty years to April 2050,
   so 251. The cleared prices, × 251:

     Napanee BESS Phase 2   300 MW   C$527.20   132,327
     Eagle Lake             190 MW   C$580.50   145,706
     Simcoe                 150 MW   C$614.47   154,232
     weighted               640 MW   C$563.48   141,433
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { quotedEconomics } from '../../comparison/supplierQuote.js';

/* Contract Business Days a year: the mean of the twenty contract years from the
   1 May 2030 milestone, 5,018 ÷ 20 = 250.90, rounded. */
export const BUSINESS_DAYS = 251;
/* IESO's weighted average of the three window-1 winners, C$/MW-Business Day. */
export const LT2_PRICE = 563.48;
const LT2_LOW = 527.20, LT2_HIGH = 614.47;

/* ---- capex: Oneida rebuilt with the quoted DC block (decision 3) ----------
   Oneida, 250 MW / 1,000 MWh, final cost about C$700m (Northland Power,
   7 May 2025): C$2,800,000/MW at four hours, priced on 2023 DC blocks. The
   platform's REBUILT route keeps its 44% power side and replaces its 56% DC
   slice with the HiTHIUM block landed in Canada at 7% duty:

     (73.45 × 1.07 + 0.768 + 1.5) × 81.25/70 × 1.5923  = C$149.445/kWh
     149.445 × 8,000 + 0.44 × 2,800,000              = C$2,427,560/MW

   A project total, so Ontario labour, the connection and owner's costs are
   inside it — connectionFeePerMW and devCostPct stay zero. */
const ONEIDA_PER_MW_4H = 700000000 / 250;
/* Fixed opex: US$20,000/MW at four hours (the US/NEM convention) × 1.4207
   CAD/USD, with the quote's service package inside it (gate ON-3). */
const OPEX_SEED_PER_MW = 28000;
const QUOTED = quotedEconomics({
  currency: 'CAD', hours: 8, method: 'rebuilt',
  total: ONEIDA_PER_MW_4H, benchmarkHours: 4, opexSeed: OPEX_SEED_PER_MW,
});
/* Band ends on the same rebuild: low US$230/kWh (the platform's US EPC floor),
   high NREL's US$334/kWh four-hour total re-based to eight hours on the ERCOT
   convention (8,000 × 187.04 + 587,840 = US$2,084,160), both at 1.420682 CAD/USD
   (ECB, 15 October 2026). */
const CAD_PER_USD = 1.5923 / 1.1208;
const CAPEX_LOW = Math.round(QUOTED.capexQuotedPerMW + 0.44 * 230 * 4000 * CAD_PER_USD);   // 1,770,652
const CAPEX_HIGH = Math.round((8000 * 187.04 + 587840) * CAD_PER_USD);                      // 2,960,928

/* ---- merchant: gate ON-1 (decision 1) --------------------------------------
   The platform's PJM convention with N = 8: the daily sum of the eight highest
   hourly day-ahead Ontario Zonal Prices less the eight lowest.

     2026 window, 24 Jul – 23 Oct (90 days)    C$325.63/MW-day
     seasonal ratio from HOEP 2023 and 2024    0.86719 (0.85936, 0.87502)
     annual                                    325.63 × 0.86719 × 365 = 103,070
     × 0.88 round-trip × 0.97 availability × 0.85 foresight = C$74,783

   Exhibit S reimburses uplifts and Global Adjustment on charging energy, so
   the energy price alone is the right basis. */
const TB8_ANNUAL = 103070;
const HAIRCUT = 0.88 * 0.97 * 0.85;
const MERCH_GROSS = Math.round(TB8_ANNUAL * HAIRCUT);                       // 74,783
const MERCH_LOW = Math.round(58835 * HAIRCUT);                              // 42,689 — HOEP 2023, full year
const MERCH_HIGH = Math.round(325.63 * 365 * HAIRCUT);                      // 86,236 — the window, unscaled

const economics = {
  /* Unrounded, so the dashboard Lab reconciles to the cent (2,427,559.69). */
  capexPerMW: QUOTED.capexPerMW,
  capexStack: QUOTED.capexStack,
  capexQuotedPerMW: QUOTED.capexQuotedPerMW,
  /* Ontario HST, recoverable. */
  vatPct: 13, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,
  opexPerMW: QUOTED.otherOpexPerMW,
  serviceSchedulePerMW: QUOTED.serviceSchedulePerMW,

  /* The LT2 contract at its year-1 value, flat, as every other contract on the
     platform is entered (decision 2). In real terms the 80% fixed part erodes
     at 2% CPI: the 15-year mean factor is 0.2 + 0.8 × 0.8738 = 0.899, so the
     flat line reads about 10% above its real value. Stated in capNote. */
  contracted: Math.round(LT2_PRICE * BUSINESS_DAYS),                       // 141,433
  contractYears: 20,
  postFactor: 0,
  capNote: [
    'IESO LT2 capacity contract to 2050; 20% CPI-indexed, 80% fixed (about 10% below the flat line in real terms over 15 years); must offer in the day-ahead market 16 h each Business Day',
    'IESO LT2容量合同至2050年；20%与CPI挂钩、80%固定（15年实际值较平直收入线低约10%）；每个工作日须在日前市场申报16小时',
  ],

  merchGross: MERCH_GROSS,
  feePct: 10,

  /* No ancillary line. Operating reserve paid C$2–5/MW-h before Market
     Renewal and an eight-hour battery cycling daily cannot sell it every hour. */
  services: 0,

  /* The Clean Technology ITC: refundable, 30% for storage available for use
     before 2034. The contract lets the owner keep it, so the bids were priced
     with it — this is not support counted twice (gate ON-4 on the eligible
     share and the labour requirements). */
  grantPct: 30,
  grantNote: [
    'Clean Technology ITC, 30% refundable — kept by the owner under LT2 s.2.15',
    '清洁技术投资税收抵免，30%可退还 — 依LT2第2.15条归业主所有',
  ],
  degr: 2,
};

const ranges = {
  contracted: band(economics.contracted, Math.round(LT2_LOW * BUSINESS_DAYS), Math.round(LT2_HIGH * BUSINESS_DAYS), {
    basis: ['The three window-1 prices × 251 Business Days: Napanee C$527.20 to Simcoe C$614.47; the seed is IESO\'s weighted average, C$563.48.',
            '窗口1三个中标价格×251个工作日：Napanee 527.20加元至Simcoe 614.47加元；种子值为IESO加权平均价563.48加元。'],
    source: 'IESO, LT2(c-1) RFP final results, 13 July 2026',
    gate: 'ON-2',
  }),
  contractYears: limits(economics.contractYears, 20, 21, {
    basis: ['COD to 30 April 2050 from a 1 May 2030 milestone; the IESO may ask for a 21st year with the owner\'s consent.',
            '自2030年5月1日里程碑投运日至2050年4月30日；IESO可经业主同意要求延长至第21年。'],
    source: 'IESO, LT2(c-1) Contract, s.9.1 and Exhibit P',
  }),
  postFactor: limits(economics.postFactor, 0, 1, {
    basis: ['No mechanism after 2050 is published, so the seed is zero; a later procurement could pay anything up to the same price. Inside the fifteen-year window it changes nothing, because the contract runs twenty.', '2050年后无已公布的机制，故种子值为零；未来采购最高可按同等价格支付。在十五年测算期内不产生影响，因合同期为二十年。'],
    source: 'IESO, LT2(c-1) Contract',
  }),
  capexPerMW: band(economics.capexPerMW, CAPEX_LOW, CAPEX_HIGH, {
    basis: ['Oneida\'s final C$700m cost rebuilt with the quoted DC block landed in Canada at 7% duty, at eight hours. Low: the US EPC floor of US$230/kWh rebuilt the same way. High: NREL\'s 2025 four-hour total re-based to eight hours.',
            'Oneida最终成本7亿加元，以加拿大到岸（7%关税）报价直流电池舱按八小时重构。下限：美国EPC低端每kWh 230美元按同法重构。上限：NREL 2025年四小时总价按八小时换算。'],
    source: 'Northland Power, Oneida, 7 May 2025; HiTHIUM quotation; CBSA T2026; NREL 2025 update',
    gate: 'ON-6',
  }),
  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: ['The US/NEM fixed-opex convention converted to CAD, with the supplier\'s service package carried separately. No Ontario operating benchmark has been read.',
            '美国/NEM固定运维惯例换算为加元，供应商服务包单列。尚未取得安大略本地运维基准。'],
    source: 'Platform convention; no Ontario operating benchmark read',
    gate: 'ON-3',
  }),
  merchGross: band(economics.merchGross, MERCH_LOW, MERCH_HIGH, {
    basis: ['Daily eight-hour spread on IESO\'s day-ahead zonal price, 24 July – 23 October 2026, annualised with HOEP\'s 2023–24 seasonal ratio and taken through the PJM haircuts. Low: HOEP 2023, the weakest full calendar year. High: the 2026 window without the seasonal discount.',
            'IESO日前分区电价每日八小时价差（2026年7月24日至10月23日），以HOEP 2023–24年季节比率年化，并按PJM折减。下限：HOEP 2023年，最弱的完整日历年。上限：2026年窗口未作季节折减。'],
    source: 'IESO Day-Ahead Hourly Ontario Zonal Energy Price; IESO Yearly HOEP reports 2023–2024',
    gate: 'ON-1b',
  }),
  feePct: limits(economics.feePct, 5, 12, {
    basis: ['Platform optimiser-fee convention. No Ontario fee is disclosed.', '平台优化商费率惯例。安大略无已披露费率。'],
    source: 'No disclosed Ontario optimiser fee; platform convention',
    gate: 'ON-3',
  }),
  grantPct: limits(economics.grantPct, 20, 30, {
    basis: ['30% with the labour requirements met, 20% without.', '满足劳工要求时为30%，否则为20%。'],
    source: 'Income Tax Act s.127.45',
    gate: 'ON-4',
  }),
  devCostPct: limits(0, 0, 15, {
    basis: ['Zero because Oneida\'s cost is a project total. Ceiling is the platform convention.', '因Oneida成本为项目总额，取零。上限为平台惯例。'],
    source: 'No published Ontario series; bound is the platform convention',
    gate: 'ON-3',
  }),
  rtbPremiumPct: limits(0, 0, 200, {
    basis: ['No Ontario ready-to-build trade is published.', '安大略无公开的可建设阶段交易。'],
    source: 'Never published, in any market',
    gate: 'ON-3',
  }),
  constructionMonths: limits(12, 9, 30, {
    basis: ['Platform convention. Napanee Phase 2 starts construction in 2027 for operation in 2029–30.', '平台惯例。Napanee二期于2027年开工、2029–30年投运。'],
    source: 'Platform convention; OPG for corroboration',
    gate: 'ON-3',
  }),
  degr: limits(economics.degr, 1, 3, {
    basis: ['The platform value, held constant across every market.', '全平台统一取值。'],
    source: 'Platform value; no measured series published in any market',
    gate: 'ON-3',
  }),
};

export const comparison = {
  /* Eight hours: the contract's minimum, and what all three winners built. */
  archetype: { powerMW: 50, durationHours: 8 },

  capabilities: {
    capacityMarket: true,       // the LT2 capacity contract
    merchant: true,             // day-ahead and real-time trading, retained by the owner
    ancillaryServices: false,   // operating reserve not counted — see `services`
    tolling: false,
  },

  engineReady: true,
  baseStrategy: 'cap',

  /* The design sweep. Only eight hours and more qualify for the contract, so
     the curve starts at eight. Capture is observed: value per MWh of the daily
     N-hour spread over the 2026 window, relative to eight hours. Payment under
     the contract scales with tested capacity, so the floor is linear — with the
     caveat that two failed tests below 85% are a default (s.15.6), which the
     sweep does not model. */
  durationResponse: {
    hours: [8, 10, 12],
    merchantCapture: [1.000, 0.871, 0.746],
    merchantCaptureBasis: 'observed',
    opexEnergyShare: 0.5,
    routeRules: {
      cap: {
        floorHours: 8, floorKind: 'linear', termYears: 20,
        note: ['Payment scales with tested capacity; below 85% after two tests the contract is in default (s.15.6).',
               '付款随测试容量按比例调整；连续两次测试低于85%即构成违约（第15.6条）。'],
      },
    },
    note: ['Capture from IESO\'s day-ahead prices, 24 July – 23 October 2026: 12 hours earns 12% more trading revenue than 8 for half as much again in energy.',
           '捕获率取自IESO日前电价（2026年7月24日至10月23日）：12小时较8小时交易收入仅多12%，而储能容量多一半。'],
  },

  economics,
  ranges,

  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. The contract is additive to trading, so merchant exposure begins at commercial operation.',
    '第1年。容量合同与交易收入叠加，故市场化敞口自商业运行起即存在。',
  ]),

  narrative: {
    archetype: ['50 MW · 8h · LT2 contract plus trading', '50MW · 8小时 · LT2合同加交易'],
    thesis: [
      'A twenty-year capacity contract from the system operator, priced per MW-Business Day, with every market revenue left to the owner. Window 1 of LT2 cleared three eight-hour batteries at C$527–614 — about C$141k/MW a year — and day-ahead trading since Market Renewal adds about C$75k before fees. Window 2 drafts were posted in October 2026 with a 2032 commissioning date, which is the entry point.',
      '由系统运营商提供的二十年容量合同，按每MW工作日定价，市场收入全部归业主。LT2窗口1以每MW工作日527–614加元中标三个八小时储能项目 — 约每MW每年14.1万加元 — 电力市场改革后的日前交易另增约7.5万加元（扣费前）。窗口2草案已于2026年10月发布，投运日为2032年，这是进入点。',
    ],
    /* Pipeline to operating on Ontario's own sourced basis: 640 MW contracted in
       LT2 window 1 against the two operating plants with published figures,
       Oneida and Napanee Phase 1, 500 MW. LT1 storage under construction is not
       counted because its storage share is not yet sourced here. */
    pipelineRatio: '~1.3×',
  },
};

export default comparison;
