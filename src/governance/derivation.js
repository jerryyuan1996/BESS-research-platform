/* ---------------------------------------------------------------------------
   APPROVED DERIVATION PARAMETERS.

   Turning an observed price series into a number comparable with a revenue
   assumption requires parameters that no feed publishes: how efficiently the
   battery cycles, how often, and how much of the theoretical spread a real
   operator captures. Those are analyst positions, so they live here under
   METHODOLOGY authority — automation reads them and can neither change nor
   propose against them.

   Keeping them in one file, apart from comparison/assumptions.js, does two
   things. It leaves the frozen comparison assumptions genuinely untouched, so
   tests/baseline.test.js keeps proving what it was written to prove. And it puts
   every parameter that bridges observation to assumption in one place, where the
   honest answer to "why does the model think prices imply that revenue?" is a
   single file rather than a hunt.

   These values are conventional industry mid-points, not this platform's
   research. They are starting points to be replaced with the analyst's own —
   which is why each carries the reason it is here rather than a citation it does
   not have.
   --------------------------------------------------------------------------- */

/**
 * AC-to-AC round-trip efficiency. Applied to charge cost when computing an
 * arbitrage margin: a battery buys 1/η MWh for every 1 MWh it sells.
 */
export const ROUND_TRIP_EFFICIENCY = 0.85;

/**
 * Equivalent full cycles per year for the modelled archetype.
 *
 * 365 is one cycle a day. Short-duration merchant batteries in liquid markets
 * commonly run above this; warranty-constrained assets run below. It is set at
 * the round number deliberately, so that a reader can scale the output in their
 * head rather than reverse-engineering an unexplained 412.
 */
export const CYCLES_PER_YEAR = 365;

/** Fraction of the year the asset is available to trade. */
export const AVAILABILITY = 0.97;

/**
 * Realisation factor: the share of the perfect-foresight daily spread a real
 * operator actually captures.
 *
 * Perfect foresight is not achievable — the operator does not know the day's
 * high and low in advance, is bound by forecast error, market gate closures and
 * state-of-charge constraints. Published GB and Australian post-trade analyses
 * put realised capture broadly in the 60–80% band against a perfect-foresight
 * benchmark. 0.70 sits in the middle of that.
 *
 * This is the single largest source of error in the bridge, and the drift logic
 * is built so it mostly cancels: drift is measured as a RATIO against an anchor
 * computed with the same factor, so a wrong constant shifts both sides equally
 * and largely cancels out of the comparison. That is why the pipeline reports
 * relative movement rather than asserting an absolute revenue.
 */
export const SPREAD_REALISATION = 0.70;

/**
 * Cap on the arbitrage estimate's claim.
 *
 * A price series supports an estimate of WHOLESALE ARBITRAGE revenue only. It
 * says nothing about capacity payments, ancillary-service revenue or balancing
 * income, all of which sit inside a market's `merchGross` and `services` to
 * varying degrees. The bridge therefore never asserts a level for merchGross;
 * it produces an index whose MOVEMENT is evidence. See src/derive/README.md.
 */
export const BRIDGE_CLAIM = [
  'Wholesale arbitrage only — excludes capacity, ancillary and balancing revenue',
  '仅批发套利 — 不含容量、辅助服务与平衡市场收入',
];

/** Every parameter above, for rendering in the methodology drawer. */
export const DERIVATION_PARAMETERS = [
  { key: 'ROUND_TRIP_EFFICIENCY', value: ROUND_TRIP_EFFICIENCY, label: ['Round-trip efficiency (AC-AC)', '往返效率（交流侧）'] },
  { key: 'CYCLES_PER_YEAR', value: CYCLES_PER_YEAR, label: ['Equivalent full cycles per year', '年等效满充放次数'] },
  { key: 'AVAILABILITY', value: AVAILABILITY, label: ['Availability', '可用率'] },
  { key: 'SPREAD_REALISATION', value: SPREAD_REALISATION, label: ['Spread realisation vs perfect foresight', '价差实现率（对比完美预见）'] },
];
