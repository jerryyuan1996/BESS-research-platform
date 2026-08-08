/* Sponsor-level underwriting assumptions.

   Market modules retain the public/official cost observations they were built
   from. The registry applies these sponsor terms to the normalized investment
   cases so every home-page output and every Investment Lab scenario starts from
   the same executable buying position without rewriting source evidence. */

export const OEM_CAPEX_MULTIPLIER = 0.90;

const CAPEX_STACK_MONEY_FIELDS = new Set([
  'dcBlockPerKWh',
  'pcsPerMW',
  'transformerHvPerMW',
  'bopPerMW',
  'bopPerKWh',
  'connectionFeePerMW',
  'otherPerMW',
]);

const scale = value => Number.isFinite(value) ? value * OEM_CAPEX_MULTIPLIER : value;

function scaleCapexStack(stack){
  if (!stack) return stack;
  return Object.fromEntries(Object.entries(stack).map(([key, value]) => [
    key,
    CAPEX_STACK_MONEY_FIELDS.has(key) ? scale(value) : value,
  ]));
}

function scaleRange(range){
  if (!range) return range;
  return {
    ...range,
    seed:scale(range.seed),
    basis:['OEM-backed procurement range.', 'OEM支持的采购区间。'],
    min:scale(range.min),
    max:scale(range.max),
  };
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
