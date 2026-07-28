/* ---------------------------------------------------------------------------
   WA — comparison interface.

   This is the ONLY thing the global comparison engine reads from this market. It
   is a deliberate, narrow contract: the dashboard below it holds far more detail
   (RCM forecasting, dispatch co-optimisation, a project underwriting layer) and
   none of that is visible to the home page.

   Every value reproduces the prototype cockpit's MARKETS['wa'] entry exactly.
   Economics are per MW per year, in AUD.
   --------------------------------------------------------------------------- */

export const comparison = {
  archetype: {
    powerMW: 200,
    durationHours: 8,
  },

  score: {
    composite: 59,
    connectionRisk: 43,
  },

  capabilities: {
    capacityMarket: true,      // Reserve Capacity Mechanism
    merchant: true,
    ancillaryServices: true,   // FCESS
    tolling: false,            // no WA tolling precedent
  },

  economics: {
    capexPerMW: 4160000,
    opexPerMW: 18000,

    contracted: 464000,        // 0.95 × 2028-29 BRCP
    contractYears: 10,         // 10-yr fixed-price election
    postFactor: 0.85,

    merchGross: 139000,
    feePct: 8,
    services: 12000,
    grantPct: 0,
    degr: 2,

    capNote: ['RCM refund exposure; 10-yr fixed-price election', 'RCM退款敞口；10年固定价选择权'],
  },

  narrative: {
    archetype: ['200 MW · 8h · RCM-led', '200MW · 8小时 · RCM主导'],
    thesis: [
      'Capacity-led islanded market. Duration is the product; the risk is timing, not thesis.',
      '容量主导的孤立市场。时长即产品；风险在时点而非逻辑。',
    ],
    pipelineRatio: '~2.4×',
  },
};

export default comparison;
