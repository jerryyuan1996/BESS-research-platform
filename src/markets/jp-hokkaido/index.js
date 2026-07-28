/* ---------------------------------------------------------------------------
   Japan — Hokkaido Area. An allocation market, not a dashboard.

   `dashboardId: 'jp'` points at the shared Japan research dashboard, which opens
   in the Hokkaido lens.

   Economics: reference 50 MW / 4h, JPY per MW per year.
     ANCHORED  capacity area price ¥14,972/kW/yr (OCCTO, delivery year 2029),
               5-study cap, 0.9 → 1.2 GW Hokkaido-Honshu, ~2 GW connection queue
     SEED      capex, opex, merchant margin, incremental balancing value,
               expected-capacity factor and the renewal curve

   The incremental balancing value is the lowest of the three regions despite the
   largest renewable-integration need: more than 0.2 GW of batteries were expected
   to register for the balancing market in FY2026 against a small requirement.
   That is saturation arriving before the requirement grows.
   --------------------------------------------------------------------------- */
import { dashboard } from '../jp/dashboard.js';
import { tabs } from '../jp/tabs.js';
import { sources } from '../jp/sources.js';
import { JP_REGIONS, JP_COMMON_COST, JP_REFERENCE } from '../jp/regions.js';

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

  status: ['Selective', '选择性投资'],
  color: 'var(--s4)',

  asOf: '2026-07-28',
  dataDate: 'JEPX TTM Jul 2026 / CM delivery year 2029',
  modelVersion: 'jp-seed-1.0-three-region-capacity-renewal',
  lastVerified: '2026-07-28',
  sourceHealth: [
    'SEED — structure anchored to OCCTO/HEPCO sources; economics pending ETL',
    '种子数据 — 结构已锚定OCCTO及北海道电力网络来源；经济性待ETL完成',
  ],
};

export const comparison = {
  engineReady: true,

  archetype: { powerMW: JP_REFERENCE.powerMW, durationHours: JP_REFERENCE.durationHours },

  score: {
    composite: R.components.reduce((a, c) => a + c.w * c.s, 0) / 100,
    connectionRisk: R.connFactors.reduce((a, f) => a + f.w * f.s, 0) / 3,
  },

  capabilities: {
    capacityMarket: true,
    merchant: true,
    ancillaryServices: true,
    tolling: false,
    longTermAward: false,
  },

  economics: {
    riskClass: 'auction-renewal',

    capexPerMW: JP_COMMON_COST.capexPerMW,
    opexPerMW: JP_COMMON_COST.opexPerMW,

    securedContracted: R.econ.securedContractedJPYMWYr,
    securedContractYears: 1,
    auctionRenewalCurve: R.econ.renewal,

    merchGross: R.econ.merchGrossJPYMWYr,
    feePct: JP_COMMON_COST.optimiserFeePct,
    services: R.econ.balancingIncrementalJPYMWYr,
    grantPct: 0,
    degr: JP_REFERENCE.degrPct,

    capNote: ['Capacity Market secures one delivery year; charging-side headroom and Hokkaido-Honshu reinforcement are the binding constraints',
              '容量市场仅锁定一个实需年度；充电侧裕度与北海道—本州联络线扩容为约束条件'],
  },

  narrative: {
    archetype: ['50 MW · 4h reference · renewable export / balancing', '50MW · 4小时参考 · 新能源外送 / 调整力'],
    thesis: [
      'Renewable-export and interconnector-constrained benchmark. Underwrite charging-side headroom, Hokkaido Area Price capture, balancing saturation and Hokkaido–Honshu reinforcement.',
      '新能源外送与跨区互联受限的基准市场。重点评估充电侧容量、北海道区域电价兑现、调整力饱和及北海道—本州联络线扩容。',
    ],
    pipelineRatio: R.saturation.pipelineRatio,
  },
};

export default { manifest, comparison, sources, tabs, dashboard };
