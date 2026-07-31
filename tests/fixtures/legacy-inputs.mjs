/* ---------------------------------------------------------------------------
   THE PROTOTYPE'S OWN INPUTS, FROZEN.

   These are the five markets' comparison interfaces exactly as they stood when
   the modular engine was proved to reproduce the 1.65 MB prototype — before the
   2026-07-30 revision moved GB to four hours, Poland to the December 2025
   auction parameters, Ireland onto a services decay curve, WA to seven hours and
   Romania upward. Nothing in this file is a published assumption. Nothing here
   should ever be "updated": if a value here changes, the file has stopped doing
   its job.

   WHY THIS FILE EXISTS.

   tests/baseline.test.js used to run the LIVE markets against the prototype's
   outputs, which meant it proved two different things at once:

       (a) the engine computes what the prototype computed          — correctness
       (b) the published assumptions still equal the prototype's     — currency

   Those are not the same claim, and (b) was never meant to hold forever. An
   assumption revision is SUPPOSED to move the pinned numbers — which is exactly
   why the proposal workflow runs `test:structural` rather than the full suite
   (see docs/governance.md). Once the revision landed, keeping them fused would
   have forced a choice between regenerating the fixture — destroying the
   migration's central correctness proof — and living with a permanently red
   test, which stops being a signal.

   Splitting them keeps both, and makes each sharper than the pair was:

       tests/baseline.test.js       (a) engine vs prototype, on THESE inputs
       tests/current-model.test.js  (b) the numbers we publish today

   Layering: this is data, not a module. It imports nothing and must stay that
   way, or it is no longer frozen.
   --------------------------------------------------------------------------- */

/** Vintage of the values below. Purely documentary. */
export const LEGACY_VINTAGE = 'global-cockpit-0727-v1 · frozen 2026-07-30';

export const LEGACY_COMPARISONS = {
  wa: {
    archetype: { powerMW: 200, durationHours: 8 },
    score: { composite: 59, connectionRisk: 43 },
    capabilities: {
      capacityMarket: true, merchant: true, ancillaryServices: true, tolling: false,
    },
    economics: {
      capexPerMW: 4160000,
      opexPerMW: 18000,
      contracted: 464000,        // 0.95 × 2028-29 BRCP
      contractYears: 10,
      postFactor: 0.85,
      merchGross: 139000,
      feePct: 8,
      services: 12000,
      grantPct: 0,
      degr: 2,
      capNote: ['RCM refund exposure; 10-yr fixed-price election', 'RCM退款敞口；10年固定价选择权'],
    },
  },

  gb: {
    archetype: { powerMW: 100, durationHours: 2 },
    score: { composite: 57, connectionRisk: 43 },
    capabilities: {
      capacityMarket: true, merchant: true, ancillaryServices: true, tolling: true,
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
  },

  ie: {
    archetype: { powerMW: 50, durationHours: 4 },
    score: { composite: 60, connectionRisk: 48 },
    capabilities: {
      capacityMarket: true, merchant: true, ancillaryServices: true, tolling: false,
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
  },

  ro: {
    archetype: { powerMW: 50, durationHours: 2 },
    score: { composite: 61, connectionRisk: 53 },
    capabilities: {
      capacityMarket: false, merchant: true, ancillaryServices: true, tolling: false,
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
  },

  pl: {
    archetype: { powerMW: 100, durationHours: 4 },
    score: { composite: 60, connectionRisk: 51 },
    capabilities: {
      capacityMarket: true, merchant: true, ancillaryServices: true, tolling: false,
    },
    economics: {
      capexPerMW: 970000,
      opexPerMW: 9000,
      contracted: 39585,         // ≈€60.9/kW × 0.65 correction factor
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
  },
};

/**
 * A market object shaped the way the engine expects, carrying the frozen inputs
 * and the live manifest (for currency and id). The engine reads nothing else.
 */
export function legacyMarket(liveMarket){
  const frozen = LEGACY_COMPARISONS[liveMarket.manifest.id];
  if (!frozen) throw new Error(`no frozen inputs for ${liveMarket.manifest.id}`);
  return { manifest: liveMarket.manifest, comparison: frozen };
}
