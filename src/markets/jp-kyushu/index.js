/* ---------------------------------------------------------------------------
   Japan — Kyushu Area. An allocation market, not a dashboard.

   `dashboardId: 'jp'` points at the shared Japan research dashboard, which opens
   in the Kyushu lens.

   Economics: reference 50 MW / 4h, JPY per MW per year.
     ANCHORED  capacity area price ¥15,112/kW/yr (OCCTO, delivery year 2029)
     SEED      capex, opex, merchant margin, incremental balancing value,
               expected-capacity factor and the renewal curve
   --------------------------------------------------------------------------- */
import { dashboard } from '../jp/dashboard.js';
import { tabs } from '../jp/tabs.js';
import { sources } from '../jp/sources.js';
import { JP_REGIONS, JP_COMMON_COST, JP_REFERENCE } from '../jp/regions.js';

const R = JP_REGIONS.kyushu;

export const manifest = {
  id: 'jp_kyushu',
  slug: 'japan-kyushu',
  flag: '🇯🇵',

  dashboardId: 'jp',
  region: 'kyushu',

  shortName: ['JP-Kyushu', '日-九州'],
  name: ['Japan — Kyushu Area', '日本 — 九州区域'],

  currency: 'JPY',
  currencySymbol: '¥',
  locale: 'ja-JP',
  timezone: 'Asia/Tokyo',

  status: ['Selective', '选择性投资'],
  color: 'var(--s8)',

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

    capNote: ['Capacity Market secures one delivery year; expanded Kanmon transfer may reduce the curtailment that creates charging value',
              '容量市场仅锁定一个实需年度；关门断面外送扩容可能减少创造充电价值的弃电'],
  },

  narrative: {
    archetype: ['50 MW · 4h reference · surplus / curtailment', '50MW · 4小时参考 · 过剩 / 弃电'],
    thesis: [
      'Renewable-surplus and curtailment benchmark. Value depends on charging access, regional price capture and interconnector evolution.',
      '新能源过剩与弃电基准市场。价值取决于充电接入、区域价格捕获及跨区互联演进。',
    ],
    pipelineRatio: R.saturation.pipelineRatio,
  },
};

export default { manifest, comparison, sources, tabs, dashboard };
