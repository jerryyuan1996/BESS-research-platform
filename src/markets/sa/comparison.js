/* ---------------------------------------------------------------------------
   Saudi Arabia — comparison interface. Economics are per MW per year, in SAR.

   Registered by the analyst's sign-off of 2026-10-29 on
   docs/saudi-registration-plan.md, which carries every derivation below with
   its source. Not by scout graduation: Saudi Arabia had no card.

   engineReady: FALSE, and that is the headline rather than a caveat, as it
   was for Finland. SPPC buys four-hour storage on fifteen-year
   build-own-operate Storage Services Agreements — a state buyer, a fee for
   availability, no merchant leg: the structure an infrastructure fund wants.
   But SPPC has published no price for any Group 1 project, in English or in
   Arabic, and every disclosed figure is an investment value. The contract line
   is the whole revenue, so without it there is no return to show, and the
   market stays out of the engine until gate SA-1 closes.

   ---------------------------------------------------------------------------
   WHAT IS KNOWN (SPPC, 20–21 August 2026; consortium disclosures)

     Group 1   2 GW / 8 GWh, four 500 MW / 2,000 MWh sites, SAR 4.35bn
               Al Muwayh, Haden (Makkah), Al Kahfah (Hail): Saudi Energy,
               ACWA Power, Al Sharif — SAR 3.25bn for the three
               Al Khushaybi (Qassim): ENGIE, Haji Abdullah Alireza — ~US$220m
     term      15 years from each project's COD
     Group 2   3 GW / 12 GWh, six sites, 27 prequalified; bids due 12 Nov 2026

   Capex is HELD at SPPC's average, SAR 4.35bn ÷ 2,000 MW = SAR 2,175,000/MW
   (US$145/kWh at the peg), not rebuilt from the supplier quotation: the
   quoted block landed here would be 71% of that total and 94% of ENGIE's,
   which leaves no room for the rest of the plant. Saudi winners buy at
   2 GWh a site; the quote is not a Saudi block price.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { stackFrom } from '../../comparison/capex.js';
import { landedDcPerKWh } from '../../comparison/supplierQuote.js';

const HOURS = 4;
export const SAR_PER_USD = 3.75;
/* SPPC's Group 1 investment over its 2,000 MW. */
export const SPPC_TOTAL_SAR = 4.35e9;
export const CAPEX_PER_MW = SPPC_TOTAL_SAR / 2000;                         // 2,175,000
/* ENGIE's ~US$220m for Al Khushaybi, 500 MW: the low end. */
export const ENGIE_PER_MW = 220e6 * SAR_PER_USD / 500;                    // 1,650,000
/* The quotation's block landed at 5% duty with SPPC's 44% non-block share:
   the high end, and the reason the quote is not used. */
export const QUOTE_BLOCK_PER_MW = landedDcPerKWh('SAR') * HOURS * 1000;   // ≈1,549,200
export const REBUILT_PER_MW = 0.44 * CAPEX_PER_MW + QUOTE_BLOCK_PER_MW;   // ≈2,506,200

/* What a bidder must ask to recover SPPC's average over fifteen years at a
   given nominal cost of capital, plus opex: a break-even, never a seed. */
export const OPEX_PER_MW = 30000;
export const breakEvenFee = (rate, capex = CAPEX_PER_MW, years = 15) =>
  capex * rate / (1 - Math.pow(1 + rate, -years)) + OPEX_PER_MW;

const economics = {
  capexPerMW: CAPEX_PER_MW,
  capexStack: stackFrom(CAPEX_PER_MW, HOURS),
  /* VAT, recoverable (ZATCA). */
  vatPct: 15, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,
  /* US$8,000/MW/yr, the level of an availability-only asset with no trading
     desk (Romania, Finland), at the peg; the supplier's package is not used
     because its block is not the one Saudi winners buy (gate SA-4). */
  opexPerMW: OPEX_PER_MW,

  /* GATE SA-1. Null, not zero: zero would say the contract pays nothing,
     which is false. The fee exists; its level is unpublished. */
  contracted: null,
  contractYears: 15,
  postFactor: 0,
  capNote: [
    'SPPC Storage Services Agreement, 15 years from COD, build-own-operate; fee for availability, price not published',
    'SPPC储能服务协议，自投运起15年，建设-拥有-运营；可用性付费，价格未公布',
  ],

  /* No wholesale market: SPPC is the single buyer and dispatches. */
  merchGross: 0,
  feePct: 0,
  services: 0,
  grantPct: 0,
  degr: 2,

  unavailable: {
    contracted: [
      'Withheld: SPPC has published no SSA price for any Group 1 project (gate SA-1).',
      '暂缓：SPPC未公布第一组任何项目的储能服务协议价格（研究缺口SA-1）。',
    ],
  },
};

const ranges = {
  capexPerMW: band(economics.capexPerMW, ENGIE_PER_MW, Math.round(REBUILT_PER_MW), {
    basis: [
      'SPPC\'s Group 1 investment, SAR 4.35bn over 2,000 MW (US$145/kWh); ACWA\'s three sites come to SAR 2.17m/MW, within 0.4%. Low: ENGIE\'s ~US$220m for Al Khushaybi (US$110/kWh), which likely leaves out financing and the connection. High: SPPC\'s non-block share with the supplier\'s quoted block landed at 5% duty (US$167/kWh).',
      'SPPC第一组投资43.5亿里亚尔/2,000MW（每kWh 145美元）；ACWA三个场址为每MW 217万里亚尔，相差0.4%以内。下限：ENGIE所述Al Khushaybi约2.2亿美元（每kWh 110美元），可能未含融资与并网。上限：SPPC非电池部分加按5%关税到岸的报价电池舱（每kWh 167美元）。',
    ],
    source: 'SPPC Group 1 announcement, Aug 2026; Saudi Energy / ACWA Power disclosure; ENGIE on Al Khushaybi; HiTHIUM quotation',
    gate: 'SA-3',
  }),
  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: ['No Saudi operating benchmark. US$8,000/MW/yr at the peg, the level of an availability-only asset elsewhere on the platform.', '无沙特运维基准。按联系汇率每MW每年8,000美元，取本平台其他仅收可用性付费资产的水平。'],
    source: 'Platform seed',
    gate: 'SA-4',
  }),
  contractYears: limits(economics.contractYears, 15, 20, {
    basis: ['Fifteen years from each project\'s COD, as the ACWA consortium disclosed; no extension is published. The ceiling is the platform\'s twenty-year asset life, the most any renewal could add.', '自各项目投运起十五年，据ACWA联合体披露；未公布延期条款。上限为本平台二十年资产寿命，即任何续约最多可延长至的年限。'],
    source: 'Saudi Energy / ACWA Power disclosure (Zawya), Aug 2026',
  }),
  devCostPct: limits(0, 0, 15, {
    basis: ['Zero because SPPC\'s figure is a project total. Ceiling is the platform convention.', '因SPPC数据为项目总额，取零。上限为平台惯例。'],
    source: 'No published Saudi series; bound is the platform convention',
    gate: 'SA-4',
  }),
  rtbPremiumPct: limits(0, 0, 200, {
    basis: ['SPPC procures sites itself; no ready-to-build trade exists.', 'SPPC自行确定场址；不存在可建设阶段交易。'],
    source: 'Not applicable to an SPPC procurement',
    gate: 'SA-4',
  }),
  constructionMonths: limits(12, 9, 30, {
    basis: ['Platform convention. No Group 1 COD is published.', '平台惯例。第一组投运日期未公布。'],
    source: 'Platform convention',
    gate: 'SA-4',
  }),
  degr: limits(economics.degr, 1, 3, {
    kind: 'dispersed',
    basis: ['2%/yr, the platform seed in every market.', '每年2%，各市场统一种子值。'],
    source: 'Platform seed — held constant across all markets',
    gate: 'G13',
  }),
};

export const comparison = {
  /* Four hours: SPPC's only duration. SPPC procures 500 MW sites; the
     platform's per-MW archetype is 50 MW, and the size limit is the card's
     to show. */
  archetype: { powerMW: 50, durationHours: HOURS },

  capabilities: {
    capacityMarket: true,      // the SSA: payment for availability
    merchant: false,           // no wholesale market
    ancillaryServices: false,
    tolling: false,
  },

  engineReady: false,
  baseStrategy: 'cap',

  economics,
  ranges,

  narrative: {
    archetype: ['50 MW · 4h · SPPC Storage Services Agreement', '50MW · 4小时 · SPPC储能服务协议'],
    thesis: [
      'A state buyer, a fifteen-year fee for availability and no merchant leg — the structure an infrastructure fund wants. SPPC signed 2 GW / 8 GWh in August 2026 for SAR 4.35bn of investment and closes bids for 3 GW / 12 GWh more on 12 November. It has not published a price, so no return is shown until one is.',
      '国有买方、十五年可用性付费且无市场化收入 — 正是基础设施基金所需的结构。SPPC于2026年8月签署2GW/8GWh、投资43.5亿里亚尔，并将于11月12日截标另外3GW/12GWh。价格尚未公布，因此在公布前不展示回报。',
    ],
    /* Group 2's 3 GW against Group 1's 2 GW signed; nothing is yet operating
       under an SSA. */
    pipelineRatio: '~1.5×',
  },
};

export default comparison;
