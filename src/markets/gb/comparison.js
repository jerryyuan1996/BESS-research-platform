/* ---------------------------------------------------------------------------
   GB — comparison interface. Values reproduce the prototype's MARKETS['gb'].
   Economics are per MW per year, in GBP.

   GB is the only market in the set that declares `tolling`. In the prototype this
   was inferred from the presence of an `econ.toll` field; it is now explicit.
   --------------------------------------------------------------------------- */

export const comparison = {
  archetype: {
    powerMW: 100,
    durationHours: 2,
  },

  score: {
    composite: 57,
    connectionRisk: 43,
  },

  capabilities: {
    capacityMarket: true,      // Capacity Market
    merchant: true,
    ancillaryServices: true,
    tolling: true,             // tolling precedent exists in GB
  },

  economics: {
    capexPerMW: 460000,
    opexPerMW: 9000,

    contracted: 5962,          // £27.10/kW × 0.22 de-rating
    contractYears: 15,
    postFactor: 0.5,

    merchGross: 73145,
    feePct: 10,
    services: 4000,
    grantPct: 0,
    degr: 2,

    toll: 57000,
    tollYears: 15,             // prototype used LIFE (15); assumed rollable

    capNote: ['CM availability obligation; stress-event penalties', '容量市场可用性义务；紧张事件罚则'],
    tollNote: ['Precedent tenors are shorter; assumed rollable', '先例期限更短；假设可滚动续签'],
  },

  narrative: {
    archetype: ['100 MW · 2h · trading-led', '100MW · 2小时 · 交易主导'],
    thesis: [
      'Trading-led and connection-rationed. Returns are made by execution and contracted structure, not by the market.',
      '交易主导、并网配给。收益来自执行与合同结构，而非市场本身。',
    ],
    pipelineRatio: '~2.5×',
  },
};

export default comparison;
