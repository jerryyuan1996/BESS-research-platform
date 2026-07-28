/* ---------------------------------------------------------------------------
   Japan — Tokyo Area. An allocation market, not a dashboard.

   `dashboardId: 'jp'` points at the shared Japan research dashboard, which opens
   in the Tokyo lens. The national rulebook lives there once; only this market's
   normalized comparison inputs live here.

   Economics: reference 50 MW / 4h, JPY per MW per year.
     ANCHORED  capacity area price ¥15,111/kW/yr (OCCTO, delivery year 2029)
     SEED      capex, opex, merchant margin, incremental balancing value,
               expected-capacity factor and the renewal curve
   See src/markets/jp/regions.js and the Data & Methodology tab for the gates.
   --------------------------------------------------------------------------- */
import { dashboard } from '../jp/dashboard.js';
import { tabs } from '../jp/tabs.js';
import { sources } from '../jp/sources.js';
import { JP_REGIONS, JP_COMMON_COST, JP_REFERENCE } from '../jp/regions.js';

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

  status: ['Selective', '选择性投资'],
  color: 'var(--s7)',

  asOf: '2026-07-28',
  dataDate: 'JEPX TTM Jul 2026 / CM delivery year 2029',
  modelVersion: 'jp-seed-1.0-three-region-capacity-renewal',
  lastVerified: '2026-07-28',
  sourceHealth: [
    'SEED — structure anchored to OCCTO/TSO sources; economics pending ETL',
    '种子数据 — 结构已锚定OCCTO及电网运营商来源；经济性待ETL完成',
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
    capacityMarket: true,      // OCCTO Capacity Market main auction
    merchant: true,            // JEPX day-ahead and intraday
    ancillaryServices: true,   // EPRX balancing
    tolling: false,
    longTermAward: false,      // LTDA excluded from the market benchmark
  },

  economics: {
    // Capacity revenue is won one delivery year at a time and re-auctioned after.
    riskClass: 'auction-renewal',

    capexPerMW: JP_COMMON_COST.capexPerMW,
    opexPerMW: JP_COMMON_COST.opexPerMW,

    securedContracted: R.econ.securedContractedJPYMWYr,
    securedContractYears: 1,
    auctionRenewalCurve: R.econ.renewal,

    merchGross: R.econ.merchGrossJPYMWYr,
    feePct: JP_COMMON_COST.optimiserFeePct,
    services: R.econ.balancingIncrementalJPYMWYr,
    grantPct: 0,               // market benchmark excludes project-specific support
    degr: JP_REFERENCE.degrPct,

    capNote: ['Capacity Market secures one delivery year; years 2-15 are auction-renewal, not contracted',
              '容量市场仅锁定一个实需年度；第2–15年属拍卖续约，非已签约'],
  },

  narrative: {
    archetype: ['50 MW · 4h reference · scarcity / multi-market', '50MW · 4小时参考 · 稀缺性 / 多市场'],
    thesis: [
      'Large-load, scarcity and flexibility benchmark. Underwrite Tokyo-area price capture and connection quality rather than demand size alone.',
      '大负荷、稀缺性与灵活性基准市场。投资重点是东京区域价格兑现与并网质量，而非仅看负荷规模。',
    ],
    pipelineRatio: R.saturation.pipelineRatio,
  },
};

export default { manifest, comparison, sources, tabs, dashboard };
