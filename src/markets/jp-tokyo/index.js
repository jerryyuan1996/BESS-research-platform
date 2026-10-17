/* ---------------------------------------------------------------------------
   Japan — Tokyo Area. An allocation market, not a dashboard.

   `dashboardId: 'jp'` points at the shared Japan research dashboard, which opens
   in the Tokyo lens. The national rulebook lives there once; only this market's
   normalized comparison inputs live here.

   Economics: reference 50 MW / 6h, JPY per MW per year.
     ANCHORED  capacity area price ¥15,111/kW/yr (OCCTO, delivery year 2029)
     SEED      capex, opex, merchant margin, incremental balancing value,
               expected-capacity factor, the renewal curve and the LTDA bid
   See src/markets/jp/regions.js and the Data & Methodology tab for the gates.

   REVISED 2026-07-30: the base route is now the long-term decarbonization
   auction, not the Capacity Market main auction. LTDA Round 3 set a hard
   six-hour minimum, so the previous four-hour reference could not bid into the
   route Japanese projects are actually financed on. See regions.js for the
   award derivation and docs/external-view.md §3 for the evidence.
   --------------------------------------------------------------------------- */
import { tabs } from '../jp/tabs.js';
import { sources } from '../jp/sources.js';
import {
  JP_REGIONS, JP_COMMON_COST, JP_CAPITAL, JP_REFERENCE, JP_LTDA_MERCHANT_RETENTION, jpRanges,
  JP_ARCHETYPE_CAPEX, JP_ARCHETYPE_OPEX, JP_OTHER_OPEX,
  JP_DURATION_RESPONSE,
} from '../jp/regions.js';
import { merchantVintage } from '../../comparison/vintage.js';

const R = JP_REGIONS.tokyo;

export const manifest = {
  id: 'jp_tokyo',
  slug: 'japan-tokyo',
  flag: '🇯🇵',

  // Three allocation points, one research dashboard.
  dashboardId: 'jp',
  region: 'tokyo',

  shortName: ['JP-Tokyo', '日-东京'],
  name: ['Japan — Tokyo Area', '日本 — 东京区域'],

  currency: 'JPY',
  currencySymbol: '¥',
  locale: 'ja-JP',
  timezone: 'Asia/Tokyo',

  color: 'var(--s7)',

  asOf: '2026-07-28',
  dataDate: 'JEPX TTM Jul 2026 / CM delivery year 2029',
  modelVersion: 'jp-seed-1.0-three-region-capacity-renewal',
  lastVerified: '2026-07-28',
  sourceHealth: [
    'Base case — structure anchored to OCCTO/TSO sources; economics pending ETL',
    '基准情景 — 结构已锚定OCCTO及电网运营商来源；经济性待ETL完成',
  ],
};

const economics = {
  // Capacity revenue is won one delivery year at a time and re-auctioned after.
  riskClass: 'auction-renewal',

  capexPerMW: JP_ARCHETYPE_CAPEX,
  opexPerMW: JP_OTHER_OPEX,      // METI O&M less the quoted service package (JP_CAPITAL)
  /* Component stack, consumption tax and build period — shared across the
     three areas, because none of them differ on capital cost. */
  ...JP_CAPITAL,

  securedContracted: R.econ.securedContractedJPYMWYr,
  securedContractYears: 1,
  auctionRenewalCurve: R.econ.renewal,
  auctionRenewalScenario: R.econ.renewalScenario,

  merchGross: R.econ.merchGrossJPYMWYr,
  feePct: JP_COMMON_COST.optimiserFeePct,
  services: R.econ.balancingIncrementalJPYMWYr,
  grantPct: 0,               // market benchmark excludes project-specific support
  degr: JP_REFERENCE.degrPct,

  /* The bankable route. A 20-year OCCTO Capacity Reserve Agreement never rolls
     off inside the 15-year window, so there is no renewal curve here — but the
     ~90% clawback means it is very nearly an ALTERNATIVE to the merchant stack
     rather than an addition to it, which is what merchantRetention encodes. */
  ltda: {
    payment: R.econ.ltdaPaymentJPYMWYr,
    awardFactor: R.econ.ltdaAwardFactor,
    years: 20,
    /* Round 3 abolished the 3-6h bracket and set a hard six-hour floor, so a
       shorter asset cannot bid into this route at all. Declared by the market
       rather than assumed by the model: the NEM Capacity Investment Scheme is
       also a long-term award and has no duration minimum. */
    minDurationHours: 6,
    merchantRetention: JP_LTDA_MERCHANT_RETENTION,
    note: [
      '20-yr OCCTO CRA, CPI-indexed, 6h minimum; ~90% of other-market net profit returned',
      '20年OCCTO容量储备协议，随CPI调整，最低6小时；其他市场净利润约90%需上缴',
    ],
  },

  capNote: ['Capacity Market secures one delivery year; years 2-15 are auction-renewal, not contracted',
            '容量市场仅锁定一个实需年度；第2–15年属拍卖续约，非已签约'],
};

const ranges = jpRanges(economics);

export const comparison = {
  engineReady: true,

  /* The long-term award, not the annual capacity auction. See the header. */
  baseStrategy: 'ltda',

  archetype: { powerMW: JP_REFERENCE.powerMW, durationHours: JP_REFERENCE.durationHours },

  /* Shared by the three areas — see JP_DURATION_RESPONSE in ../jp/regions.js. */
  durationResponse: JP_DURATION_RESPONSE,

  capabilities: {
    capacityMarket: true,      // OCCTO Capacity Market main auction
    merchant: true,            // JEPX day-ahead and intraday
    ancillaryServices: true,   // EPRX balancing
    tolling: false,
    longTermAward: true,       // LTDA Round 3 — 6h minimum, 20-yr CRA
  },

  economics,
  ranges,

  /* Both merchant legs priced at the same year. See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1. Capacity Market revenue is additive to merchant, so both merchant legs are exposed from commercial operation. Under the long-term award the clawback reduces retained market revenue but does not remove the exposure, so the vintage is unchanged.',
    '第1年。容量市场收入与市场化收入并存，因此两个市场化收入项自商业运行起即处于敞口状态。在长期中标机制下，收益上缴会减少留存的市场化收入，但并未消除该敞口，故口径年度不变。',
  ]),

  narrative: {
    archetype: ['50 MW · 9h reference · LTDA-led', '50MW · 9小时参考 · 长期脱碳拍卖主导'],
    thesis: [
      'Large-load, scarcity and flexibility benchmark, underwritten on a 20-year award rather than a one-year auction. The award is national and identical in all three areas, so Tokyo-area price capture and connection quality are what differentiate — and the clawback means the trading upside mostly is not yours.',
      '大负荷、稀缺性与灵活性基准市场，以20年中标而非一年期拍卖为承销基础。中标条件全国统一、三区域一致，故差异化来自东京区域价格兑现与并网质量 — 且收益上缴机制意味着交易端上行空间大部分不归投资人所有。',
    ],
    pipelineRatio: R.saturation.pipelineRatio,
  },
};

/* The dashboard loads on demand — see src/markets/ro/index.js for the reasoning
   and marketPage.js for the loading, failure and stale-navigation handling.

   Three allocation points share ONE dashboard chunk. dashboardOwner() resolves
   jp_tokyo/jp_kyushu/jp_hokkaido to the 'jp' module, so the loader is keyed on
   the owner and all three visits reuse a single import. Keying it on the
   allocation point instead would have produced three loads of the same bytes. */
export const loadDashboard = () => import('../jp/dashboard.js').then(m => m.dashboard);

export default { manifest, comparison, sources, tabs, loadDashboard };
