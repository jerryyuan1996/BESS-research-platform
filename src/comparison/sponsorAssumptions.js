/* ---------------------------------------------------------------------------
   Sponsor-level underwriting assumptions.

   Market modules retain the public/official cost observations they were built
   from — an ERA benchmark, a CSIRO GenCost band, a NREL ATB figure — because
   those are evidence and evidence does not move when a buyer negotiates. What
   moves is the price THIS sponsor pays, and that is what this module applies.

   It is applied at every boundary where market data enters a renderer, and it
   has to be all of them or the platform publishes two different IRRs for the
   same market:

     src/markets/registry.js      → comparison economics + Lab ranges
                                    (home cockpit, league table, $1M engine,
                                     certainty frontier, Investment Lab)
     src/markets/_shared/engine.js → M.lab seeds for the eleven dashboards on
                                    the shared engine
     src/markets/wa/sections/*    → WA's SEED.lab, which predates that engine

   Before August 2026 only the first of those applied it, so a market dashboard's
   Portfolio tab priced Romania at €630,000/MW while the cockpit priced the same
   2h asset at €567,000/MW. Adding a renderer that reads raw market data without
   passing it through here reintroduces exactly that split.
   --------------------------------------------------------------------------- */

/** The sponsor's OEM-backed buying position against published market cost. */
export const OEM_CAPEX_MULTIPLIER = 0.90;

/* The August 2026 revision moved every exit yield down by one point
   (contracted 7.5→6.5, merchant 11.5→10.5, opex 8.0→7.0). The dashboards carry
   their own project NPV hurdle rates, which are a different quantity but the
   same view of the cost of capital, so they move by the same amount rather than
   by the same ratio: the spread BETWEEN markets is the market-risk judgement and
   a proportional cut would quietly compress it. */
export const SPONSOR_DISCOUNT_DELTA_PP = -1.0;

/* Equipment the sponsor buys. A grid connection charge is deliberately NOT here:
   it is a published network tariff set by a TSO or DNO, not an OEM quotation,
   and discounting it by a procurement multiplier would understate what a project
   actually pays to connect. Percentage fields (epcPct, dutyPct) are also absent
   — they scale with the base they are applied to and must not be scaled twice. */
const CAPEX_STACK_MONEY_FIELDS = new Set([
  'dcBlockPerKWh',
  'pcsPerMW',
  'transformerHvPerMW',
  'bopPerMW',
  'bopPerKWh',
  'otherPerMW',
]);

/** Dashboard lab seeds denominated in money per unit of equipment. */
const LAB_MONEY_FIELDS = new Set([
  'capexKWh',        // energy block, market currency per kWh
  'capexKW',         // power block, market currency per kW
]);

const scale = value => Number.isFinite(value) ? value * OEM_CAPEX_MULTIPLIER : value;

const SPONSOR_BASIS = [
  'Sponsor OEM-backed procurement position: the published band above, at '
    + Math.round(OEM_CAPEX_MULTIPLIER * 100) + '% of market cost.',
  '发起人OEM采购价位：上述公开区间的'
    + Math.round(OEM_CAPEX_MULTIPLIER * 100) + '%。',
];

function scaleCapexStack(stack){
  if (!stack) return stack;
  return Object.fromEntries(Object.entries(stack).map(([key, value]) => [
    key,
    CAPEX_STACK_MONEY_FIELDS.has(key) ? scale(value) : value,
  ]));
}

/* The band's endpoints move with the seed — the sponsor's position applies
   across the range, not just at the midpoint — but the market's own evidence
   sentence is KEPT and the sponsor clause appended to it. Replacing it left the
   Lab showing a generic "OEM-backed procurement range." above a `source` line
   citing ERA and CSIRO, so the reader could not tell which claim the citation
   supported. */
function scaleRange(range){
  if (!range) return range;
  const basis = range.basis
    ? [range.basis[0] + ' ' + SPONSOR_BASIS[0], range.basis[1] + ' ' + SPONSOR_BASIS[1]]
    : SPONSOR_BASIS;
  return { ...range, seed:scale(range.seed), min:scale(range.min), max:scale(range.max), basis };
}

/** Returns a registry entry carrying the sponsor's executable cost basis. */
export function applySponsorAssumptions(market){
  if (!market?.comparison?.economics) return market;
  const comparison = market.comparison;
  const economics = comparison.economics;
  return {
    ...market,
    comparison:{
      ...comparison,
      economics:{
        ...economics,
        capexPerMW:scale(economics.capexPerMW),
        capexStack:scaleCapexStack(economics.capexStack),
      },
      ranges:comparison.ranges ? {
        ...comparison.ranges,
        capexPerMW:scaleRange(comparison.ranges.capexPerMW),
      } : comparison.ranges,
    },
  };
}

/**
 * The same sponsor position, applied to a dashboard's Investment Lab seed.
 *
 * A market dashboard's lab is a separate lineage from the comparison engine — it
 * models a named project configuration rather than a normalized $1M — but it
 * must buy equipment at the same price and discount at the same rate, or the two
 * publish contradictory returns for one market.
 *
 * Returns a new object; the market's own seed data is never mutated.
 */
export function applySponsorLabSeed(lab){
  if (!lab || typeof lab !== 'object') return lab;
  const out = Object.fromEntries(Object.entries(lab).map(([key, value]) => [
    key,
    LAB_MONEY_FIELDS.has(key) ? scale(value) : value,
  ]));
  if (Number.isFinite(out.disc)) out.disc = Number((out.disc + SPONSOR_DISCOUNT_DELTA_PP).toFixed(2));
  return out;
}

/** A market module with the sponsor position applied to its dashboard seeds. */
export function applySponsorDataset(dataset){
  if (!dataset?.lab) return dataset;
  return { ...dataset, lab:applySponsorLabSeed(dataset.lab) };
}
