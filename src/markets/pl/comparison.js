/* ---------------------------------------------------------------------------
   Poland — comparison interface. Reproduces the prototype's MARKETS['pl'].
   Economics are per MW per year, in EUR.
   --------------------------------------------------------------------------- */

export const comparison = {
  archetype: {
    powerMW: 100,
    durationHours: 4,
  },

  score: {
    composite: 60,
    connectionRisk: 51,
  },

  capabilities: {
    capacityMarket: true,      // capacity contract via auction
    merchant: true,
    ancillaryServices: true,
    tolling: false,
  },

  economics: {
    capexPerMW: 970000,
    opexPerMW: 9000,

    contracted: 39585,         // ≈€60.9/kW × 0.65 correction factor (seed, verify)
    contractYears: 17,
    postFactor: 0.5,

    merchGross: 78000,
    feePct: 9,
    services: 10000,
    grantPct: 10,
    degr: 2,

    grantNote: ['Includes a 10% capital-support assumption', '含10%资本支持假设'],
    capNote: ['17-yr contract outlives the 15-yr window', '17年合同长于15年比较窗口'],
  },

  narrative: {
    archetype: ['100 MW · 4h · capacity contract', '100MW · 4小时 · 容量合同'],
    thesis: [
      'The longest contract in the set makes storage conventional infrastructure. The auction — not the site — is where value is created.',
      '样本中期限最长的合同使储能成为常规基础设施。价值创造发生在拍卖，而非场址。',
    ],
    pipelineRatio: '~13×',
  },
};

export default comparison;
