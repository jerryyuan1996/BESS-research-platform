/* Canonical unit and basis vocabulary for governed metrics.

   Units are intentionally explicit rather than inferred from labels. A metric
   that says only "capacity" cannot safely be compared, charted or exported:
   it might be MW, GW, nameplate, de-rated, or energy capacity. */

export const UNIT = {
  MW: 'MW',
  GW: 'GW',
  MWH: 'MWh',
  GWH: 'GWh',
  TWH: 'TWh',
  GBP_PER_KW_YEAR: 'GBP/kW/year',
  JPY_PER_KW_YEAR: 'JPY/kW/year',
  GBP_PER_MW_YEAR: 'GBP/MW/year',
  PERCENT: '%',
  FACTOR: 'factor',
  COUNT: 'count',
  HOURS: 'hours',
};

export const YEAR_BASIS = {
  CALENDAR: 'calendar-year',
  FISCAL: 'fiscal-year',
  DELIVERY: 'delivery-year',
  EFFECTIVE_DATE: 'effective-date-year',
  SNAPSHOT: 'snapshot',
};

export const VALUE_BASIS = {
  NAMEPLATE: 'nameplate',
  CUMULATIVE_CONTRACTED: 'cumulative-contracted',
  DE_RATED: 'de-rated',
  ANNUAL_ENERGY: 'annual-energy',
  PEAK: 'peak',
  COUNT: 'count',
};

const KNOWN_UNITS = new Set(Object.values(UNIT));
const KNOWN_YEAR_BASES = new Set(Object.values(YEAR_BASIS));
const KNOWN_VALUE_BASES = new Set(Object.values(VALUE_BASIS));

export function isKnownUnit(unit){
  return KNOWN_UNITS.has(unit);
}

export function validateMetricBasis(metric){
  const problems = [];
  if (!isKnownUnit(metric?.unit)) problems.push(`unknown unit "${metric?.unit}"`);
  if (!KNOWN_YEAR_BASES.has(metric?.yearBasis)) problems.push(`unknown year basis "${metric?.yearBasis}"`);
  if (!KNOWN_VALUE_BASES.has(metric?.valueBasis)) problems.push(`unknown value basis "${metric?.valueBasis}"`);
  return problems;
}

