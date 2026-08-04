/* ---------------------------------------------------------------------------
   MERCHANT VINTAGE — the year both merchant legs are stated at.

   A market's merchant revenue has two legs and they come from different sources:
   energy arbitrage from a spread series, ancillary services from a clearing-price
   series. Nothing stops an author taking one from last calendar year and the
   other from a 2030 projection, and the first US build did exactly that — ERCOT
   carried CY2025 actual arbitrage against a 2030-saturated ancillary line, and
   PJM carried a CY2025 TB4 spread against a Regulation figure scaled to the 2030
   fleet.

   That is not conservative. It is incoherent: it prices one leg in a world where
   the queue has arrived and the other in a world where it has not, and the
   resulting total describes no year that will ever happen.

   THE RULE. Both legs are stated at the same year, and that year is the FIRST
   UNCOVERED MERCHANT YEAR — the first modelled year in which the market's base
   route leaves merchant revenue exposed.

     toll-led        tollYears + 1. Years inside the toll do not pay merchant
                     revenue to the owner at all, so stating a leg at year 1
                     prices a cash flow nobody receives. ERCOT's seven-year toll
                     makes year 8 the first year the merchant assumption matters.
     everything else year 1. Where capacity or auction revenue is ADDITIVE to
                     merchant rather than a substitute for it — PJM, WA, the NEM,
                     Japan, and every European market here — merchant is exposed
                     from commercial operation.

   Forward evolution beyond the vintage year is NOT expressed by moving the seed.
   It is expressed by `servicesCurve`, which the engine already applies per year
   and which Ireland and Romania have used since before the US markets existed.
   A seed is a level at a stated year; a curve is what happens after it. Fusing
   the two is the error this module exists to prevent.

   THREE CASES, ONE VINTAGE. Downside, base and upside are all stated at the same
   year and built on a common set of forward assumptions — volatility, scarcity,
   storage cannibalisation, market-design change and ancillary saturation. They
   become the band floor, seed and ceiling in `comparison.ranges`, so the Lab is
   moving between three internally consistent worlds rather than between a
   historical observation and a projection.

   OBSERVED HISTORY IS A REFERENCE, NOT A SEED. The most recent complete calendar
   year is preserved as the observed downside reference — the trough repeating —
   and the multi-year record is a validation band: if a case falls outside what
   the market has ever actually produced, that is a reason to revisit it, not a
   number to publish. Neither is the base case, because neither is stated at the
   vintage year.
   --------------------------------------------------------------------------- */

/**
 * The first modelled year in which merchant revenue is exposed.
 *
 * Derived from the base route rather than declared, so a market cannot quietly
 * disagree with its own toll tenor. Returns 1 for every route whose contracted
 * revenue is additive to merchant.
 *
 * @param {object} market
 * @param {string} strategyId  the market's base strategy
 * @returns {number} 1-based model year
 */
export function firstUncoveredMerchantYear(market, strategyId){
  const e = market?.comparison?.economics || {};
  /* A toll replaces market exposure for its tenor — see strategies.js. Only
     where it reverts to merchant is there an uncovered year at all; a toll
     running the full window never exposes one, and the vintage is then the year
     after the toll would have ended, which is what the band still has to price. */
  if (strategyId === 'toll') return (e.tollYears || 0) + 1;
  return 1;
}

/**
 * Build a market's vintage declaration from the economics and ranges it already
 * has, so the three cases cannot drift away from the band the Lab moves inside.
 *
 * The base case IS the seed and the outer cases ARE the band endpoints — stating
 * them again by hand would create two versions of the same claim. What the market
 * supplies is the one thing that cannot be derived: `basis`, saying which year
 * both legs are priced at and why that is the year that matters.
 *
 * @param {number} year        the first uncovered merchant year
 * @param {object} economics
 * @param {object} ranges
 * @param {[string,string]} basis
 */
export function merchantVintage(year, economics, ranges, basis){
  const pick = (key, end) => (ranges?.[key] ? ranges[key][end] : economics[key]);
  return {
    year,
    basis,
    cases: {
      downside: { merchGross: pick('merchGross', 'min'), services: pick('services', 'min') },
      base:     { merchGross: economics.merchGross,      services: economics.services },
      upside:   { merchGross: pick('merchGross', 'max'), services: pick('services', 'max') },
    },
  };
}

/**
 * Problems with a market's merchant-vintage declaration.
 *
 * Checks that the declared vintage says the same thing the base route implies,
 * that three cases exist and are ordered, and that the base case is the published
 * seed. Returns descriptions; empty when consistent.
 */
export function validateMerchantVintage(market, strategyId){
  const problems = [];
  const cmp = market?.comparison;
  const e = cmp?.economics;
  if (!e) return problems;
  const v = cmp.merchantVintage;
  const expected = firstUncoveredMerchantYear(market, strategyId);

  if (!v){
    problems.push('comparison.merchantVintage is missing — both merchant legs must state the year they are priced at');
    return problems;
  }
  if (v.year !== expected){
    problems.push(`merchantVintage.year is ${v.year} but the ${strategyId} route leaves merchant exposed from year ${expected}`);
  }
  if (!Array.isArray(v.basis) || v.basis.length < 2 || typeof v.basis[0] !== 'string'){
    problems.push('merchantVintage.basis must be an [en, zh] pair explaining what the vintage year is');
  }

  const c = v.cases || {};
  for (const k of ['downside', 'base', 'upside']){
    if (!c[k]){ problems.push(`merchantVintage.cases.${k} is missing`); continue; }
    for (const leg of ['merchGross', 'services']){
      if (!Number.isFinite(c[k][leg])) problems.push(`merchantVintage.cases.${k}.${leg} must be a number`);
    }
  }
  if (c.downside && c.base && c.upside){
    if (!(c.downside.merchGross <= c.base.merchGross && c.base.merchGross <= c.upside.merchGross)){
      problems.push('merchantVintage arbitrage cases must run downside ≤ base ≤ upside');
    }
    if (!(c.downside.services <= c.base.services && c.base.services <= c.upside.services)){
      problems.push('merchantVintage ancillary cases must run downside ≤ base ≤ upside');
    }
    /* The seed IS the base case. If they can differ, the declaration is
       decoration and the published number is unexplained. */
    if (Math.abs(c.base.merchGross - e.merchGross) > 1){
      problems.push(`economics.merchGross (${e.merchGross}) is not the declared base case (${c.base.merchGross})`);
    }
    if (Math.abs(c.base.services - e.services) > 1){
      problems.push(`economics.services (${e.services}) is not the declared base case (${c.base.services})`);
    }
  }
  return problems;
}
