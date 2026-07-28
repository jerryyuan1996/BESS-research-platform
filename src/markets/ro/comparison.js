/* ---------------------------------------------------------------------------
   Romania — comparison interface. Reproduces the prototype's MARKETS['ro'].
   Economics are per MW per year, in EUR.

   Romania is the reason capability flags exist. It has no capacity mechanism, so
   the capacity-backed route is genuinely unavailable — not zero-valued. The
   engine returns { na: ['No capacity mechanism', '无容量机制'] } for 'cap' and the
   $1M engine omits the row entirely, exactly as the prototype did.
   --------------------------------------------------------------------------- */

export const comparison = {
  archetype: {
    powerMW: 50,
    durationHours: 2,
  },

  score: {
    composite: 61,
    connectionRisk: 53,
  },

  capabilities: {
    capacityMarket: false,     // no capacity mechanism
    merchant: true,
    ancillaryServices: true,
    tolling: false,
  },

  economics: {
    capexPerMW: 630000,
    opexPerMW: 8000,

    contracted: 0,
    contractYears: 0,
    postFactor: 0,

    merchGross: 55400,
    feePct: 10,
    services: 15000,
    grantPct: 20,
    degr: 2,

    grantNote: ['Includes the 20% capital grant — formal award required', '含20%资本补贴 — 须取得正式授予'],
  },

  narrative: {
    archetype: ['50 MW · 2h · merchant + grant', '50MW · 2小时 · 市场化+补贴'],
    thesis: [
      'Best raw spread economics, zero contracted revenue. Structure — a grant plus a negotiated floor — has to do the work the market does not.',
      '原始价差经济性最佳，合同化收入为零。须由结构 — 补贴加谈判保底 — 承担市场未承担的职能。',
    ],
    pipelineRatio: '~3.0×',
  },
};

export default comparison;
