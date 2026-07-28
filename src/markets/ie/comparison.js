/* ---------------------------------------------------------------------------
   Ireland (SEM) — comparison interface. Reproduces the prototype's MARKETS['ie'].
   Economics are per MW per year, in EUR.
   --------------------------------------------------------------------------- */

export const comparison = {
  archetype: {
    powerMW: 50,
    durationHours: 4,
  },

  score: {
    composite: 60,
    connectionRisk: 48,
  },

  capabilities: {
    capacityMarket: true,      // CRM, against a Reliability Option
    merchant: true,
    ancillaryServices: true,
    tolling: false,
  },

  economics: {
    capexPerMW: 1160000,
    opexPerMW: 10000,

    contracted: 98974,         // €149.96/kW × 0.66 de-rating
    contractYears: 10,
    postFactor: 0.6,

    merchGross: 71200,
    feePct: 9,
    services: 8000,
    grantPct: 0,
    degr: 2,

    capNote: ['Reliability Option difference payments above the strike', '高于执行价时的可靠性期权差价支付'],
  },

  narrative: {
    archetype: ['50 MW · 4h · CRM-led', '50MW · 4小时 · 容量机制主导'],
    thesis: [
      'The highest capacity pay per nameplate MW in the set — earned against a Reliability Option and an executed connection agreement.',
      '样本中每铭牌MW容量付费最高 — 但以可靠性期权及已签并网协议为前提。',
    ],
    pipelineRatio: '~10×',
  },
};

export default comparison;
