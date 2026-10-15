/* ---------------------------------------------------------------------------
   Japan — Hokkaido Area. An allocation market, not a dashboard.

   `dashboardId: 'jp'` points at the shared Japan research dashboard, which opens
   in the Hokkaido lens.

   Economics: reference 50 MW / 6h, JPY per MW per year.
     ANCHORED  capacity area price ¥14,972/kW/yr (OCCTO, delivery year 2029),
               5-study cap, 0.9 → 1.2 GW Hokkaido-Honshu, ~2 GW connection queue
     SEED      capex, opex, merchant margin, incremental balancing value,
               expected-capacity factor and the renewal curve

   The incremental balancing value is the lowest of the three regions despite the
   largest renewable-integration need: more than 0.2 GW of batteries were expected
   to register for the balancing market in FY2026 against a small requirement.
   That is saturation arriving before the requirement grows.
   --------------------------------------------------------------------------- */
import { tabs } from '../jp/tabs.js';
import { sources } from '../jp/sources.js';
import {
  JP_REGIONS, JP_COMMON_COST, JP_CAPITAL, JP_REFERENCE, JP_LTDA_MERCHANT_RETENTION, jpRanges,
  JP_DURATION_RESPONSE,
} from '../jp/regions.js';
import { merchantVintage } from '../../comparison/vintage.js';

const R = JP_REGIONS.hokkaido;

export const manifest = {
  id: 'jp_hokkaido',
  slug: 'japan-hokkaido',
  flag: '🇯🇵',

  dashboardId: 'jp',
  region: 'hokkaido',

  shortName: ['JP-Hokkaido', '日-北海道'],
  name: ['Japan — Hokkaido Area', '日本 — 北海道区域'],

  currency: 'JPY',
  currencySymbol: '¥',
  locale: 'ja-JP',
  timezone: 'Asia/Tokyo',

  color: 'var(--s4)',

  asOf: '2026-07-28',
  dataDate: 'JEPX TTM Jul 2026 / CM delivery year 2029',
  modelVersion: 'jp-seed-1.0-three-region-capacity-renewal',
  lastVerified: '2026-07-28',
  sourceHealth: [
    'Base case — structure anchored to OCCTO/HEPCO sources; economics pending ETL',
    '基准情景 — 结构已锚定OCCTO及北海道电力网络来源；经济性待ETL完成',
  ],
};

const economics = {
  riskClass: 'auction-renewal',

  capexPerMW: JP_COMMON_COST.capexPerMW,
  opexPerMW: JP_COMMON_COST.opexPerMW,
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
  grantPct: 0,
  degr: JP_REFERENCE.degrPct,

  /* The bankable route. A 20-year OCCTO Capacity Reserve Agreement never rolls
     off inside the 15-year window, so there is no renewal curve here — but the
     ~90% clawback means it is very nearly an ALTERNATIVE to the merchant stack
     rather than an addition to it, which is what merchantRetention encodes. */
  ltda: {
    payment: R.econ.ltdaPaymentJPYMWYr,
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

  capNote: ['Capacity Market secures one delivery year; charging-side headroom and Hokkaido-Honshu reinforcement are the binding constraints',
            '容量市场仅锁定一个实需年度；充电侧裕度与北海道—本州联络线扩容为约束条件'],
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
    capacityMarket: true,
    merchant: true,
    ancillaryServices: true,
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
    archetype: ['50 MW · 6h reference · renewable export / balancing', '50MW · 6小时参考 · 新能源外送 / 调整力'],
    thesis: [
      'Renewable-export and interconnector-constrained benchmark. Underwrite charging-side headroom, Hokkaido Area Price capture, balancing saturation and Hokkaido–Honshu reinforcement.',
      '新能源外送与跨区互联受限的基准市场。重点评估充电侧容量、北海道区域电价兑现、调整力饱和及北海道—本州联络线扩容。',
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
