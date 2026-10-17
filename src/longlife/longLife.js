/* ---------------------------------------------------------------------------
   THE LONG-LIFE VIEW — the engine's asset, held longer. Beside the engine.

   The comparison engine prices fifteen years, assigns nothing at year 15 and
   carries no augmentation (gate G12). Published returns are quoted on longer
   lives. This module calls the engine, reads its result and extends it. It
   changes no formula and no assumption the engine reads, LIFE stays 15, and
   tests/long-life.test.js asserts that a base case run before and after this
   module is used is the same.

   It reports the hold IRR on a longer window, next to the fifteen-year one. It
   does not replace it, feed a score or change a grade.

   ---------------------------------------------------------------------------
   THE ANALYST'S FOUR DECISIONS (2026-10-12, docs/g12-treatment-proposal.md)

   LIFE          twenty-five years, with twenty beside it.
   SECURED LINE  nothing new. Years 16 to N carry whatever the secured and
                 auction lines are in year 15. No re-contracting is invented.
   RESIDUAL      none. The asset is worth nothing at the end of the window.
   AUGMENTATION  none, and that is the default. The analyst's ruling, as a
                 practitioner: a project carries the supplier's warranty
                 extension and a long-term service agreement together, paid
                 yearly, and with both in place there is no further cost for
                 augmentation. So there is no augmentation year and no lump
                 cost, and capacity fades. Where a market carries the
                 supplier's quoted package (src/comparison/supplierQuote.js)
                 its own price runs to year 25 — warranty blocks for years
                 16–20 and 21–25, preventive maintenance, and no guarantees
                 after year 20. Elsewhere the package is taken to sit inside
                 the opex seed.
                 The public source that was opened (NREL) describes the other
                 convention: a higher yearly operating cost that holds capacity
                 at its rating. It is shown beside the default as a comparison
                 and is not the analyst's case.

   ---------------------------------------------------------------------------
   THE ARITHMETIC, per MW in USD on yearly periods

   From the engine: sec[y], auc[y], mch[y] and eb[y] for y = 1 … 15, and
   cost[y] = sec[y] + auc[y] + mch[y] − eb[y]. g is the market's own yearly
   degradation rate.

   FADING — the engine's own treatment, carried on:

     sec[y]  = sec[15]                                  y = 16 … N
     auc[y]  = auc[15]
     mch[y]  = mch[15] · (1 − g)^(y − 15)
     cost[y] = cost[15] − svc[15] + svc[y]               svc = the quoted package, if any

   MAINTAINED — capacity held at its rating for a yearly charge:

     mch[y]  = mch[y] ÷ (1 − g)^(y − 1)                 y = 1 … 15
     mch[y]  = mch[15] ÷ (1 − g)^14                     y = 16 … N
     cost[y] = cost[y] + max(0, f · capexG − opex)      y = 1 … N

   f is MAINTAINED_FOM_SHARE. Where a market's own opex is already above
   f · capexG nothing is added, and the case says only that capacity is held.

   IRR over [capital flows, eb[1] … eb[N]].

   ---------------------------------------------------------------------------
   WHAT IT DOES NOT KNOW, AND SAYS

   A market whose degradation is a warranty curve and not a rate is not
   extended: the rule above has no rate to carry on. A cost the engine books in
   year 15 because it is the last year (decommissioning) is moved to year N.

   Layering: imports the engine and the assumptions. No DOM, no clock.
   --------------------------------------------------------------------------- */

import { runBaseCase, serviceCostPerMW, opexSeedPerMW } from '../comparison/engine.js';
import { LIFE, LONG_LIFE_YEARS, MAINTAINED_FOM_SHARE } from '../comparison/assumptions.js';
import { irrOf, irrSolutions } from '../utils/finance.js';

const finite = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * The operating line for years 1 … N, from the engine's result.
 *
 * @param result      the engine's base case for the market
 * @param economics   the market's comparison.economics
 * @param years       N, at least LIFE
 * @param maintained  true for the capacity-held case
 */
export function extendedOperatingLine(result, economics, years, maintained){
  const g = (economics.degr || 2) / 100;
  const fade = (y) => Math.pow(1 - g, y - 1);
  const decommissioning = finite(economics.decommissioningPerMW) ? economics.decommissioningPerMW * result.fxRate : 0;
  const upkeep = maintained
    ? Math.max(0, MAINTAINED_FOM_SHARE * result.capexG - opexSeedPerMW(economics) * result.fxRate)
    : 0;
  const svc = (y) => serviceCostPerMW(economics, y) * result.fxRate;

  const line = [];
  for (let y = 1; y <= years; y++){
    const i = Math.min(y, LIFE) - 1;
    const sec = result.secY[i], auc = result.aucY[i];
    let cost = sec + auc + result.mchY[i] - result.eb[i];
    if (i === LIFE - 1) cost -= decommissioning;
    if (y > LIFE) cost += svc(y) - svc(LIFE);
    if (y === years) cost += decommissioning;

    let mch;
    if (maintained) mch = result.mchY[i] / fade(i + 1);
    else mch = y <= LIFE ? result.mchY[i] : result.mchY[LIFE - 1] * Math.pow(1 - g, y - LIFE);

    line.push(sec + auc + mch - cost - upkeep);
  }
  return line;
}

/**
 * The hold IRR on `years`, fading or maintained.
 * With years = LIFE and maintained = false this is the engine's own IRR.
 */
export function longLifeIrr(result, economics, years, maintained){
  const capital = result.holdFlows.slice(0, result.holdFlows.length - LIFE);
  return irrOf(capital.concat(extendedOperatingLine(result, economics, years, maintained)));
}

/** Separate expiry sensitivity; the analyst's continuation case stays intact.
 * Beyond year 15, existing capacity is paid only to its actual declared expiry.
 * No future award is assumed; merchant revenue and service costs continue.
 */
export function contractAwareLife(result, economics, years, merchantOnly = false){
  const continuation=extendedOperatingLine(result,economics,years,false);
  const primaryTerm=result.strategyId==='ltda' ? economics.ltda?.years || 0
    : result.strategyId==='toll' ? economics.tollYears || 0
    : result.strategyId==='cap' ? economics.securedContractYears ?? economics.contractYears ?? 0 : 0;
  const additionalTerm=result.strategyId==='toll' && economics.tollAdditiveWithCapacity ? economics.contractYears || 0 : 0;
  const secY=[],aucY=[];
  const fx=result.fxRate;
  for(let y=1;y<=years;y++) {
    if(y<=LIFE){secY.push(result.secY[y-1]);aucY.push(result.aucY[y-1]);continue;}
    const fixedAt15=result.secY[LIFE-1]+result.aucY[LIFE-1];
    let secured=0;
    if(!merchantOnly){
      const primary=result.strategyId==='ltda' ? economics.ltda?.payment || 0
        : result.strategyId==='toll' ? economics.toll || 0
        : economics.securedContracted ?? economics.contracted ?? 0;
      if(y<=primaryTerm)secured+=primary*fx;
      if(y<=additionalTerm)secured+=(economics.contracted || 0)*fx;
    }
    continuation[y-1]+=secured-fixedAt15;
    secY.push(secured);aucY.push(0);
  }
  const capital=result.holdFlows.slice(0,result.holdFlows.length-LIFE);
  const flows=capital.concat(continuation);
  const roots=irrSolutions(flows);
  return {irr:roots.length===1?roots[0]:null,irrRoots:roots,flows,secY,aucY,
    tailPolicy:merchantOnly?'merchant-only-after-year-15':'contract-expiry-no-renewal'};
}

/**
 * The long-life view for one market.
 *
 * @returns
 *   withheld    true when the engine does not price the market, or its
 *               degradation is a curve this rule cannot carry on
 *   assetIrr    the engine's fifteen-year hold IRR, untouched
 *   windows     [{ years, fading, maintained }] for LIFE and each long life
 *   upkeepPerMW the yearly charge the maintained case adds, USD per MW
 */
export function longLife(market){
  const result = runBaseCase(market, 5);
  if (!market?.comparison || result.na) return { withheld: true, reason: result.na ?? null };
  const economics = market.comparison.economics;
  if (Array.isArray(economics.warrantyDegradationCurve)){
    return { withheld: true, reason: ['Degradation is a warranty curve, which this view does not extend', '衰减按质保曲线给定，本视图不予延伸'] };
  }
  const windows = [LIFE, ...LONG_LIFE_YEARS].map(years => ({
    years,
    fading: years === LIFE ? result.irrHold : longLifeIrr(result, economics, years, false),
    maintained: longLifeIrr(result, economics, years, true),
    contractExpiry: contractAwareLife(result,economics,years).irr,
    merchantOnly: contractAwareLife(result,economics,years,true).irr,
  }));
  return {
    withheld: false,
    assetIrr: result.irrHold,
    windows,
    upkeepPerMW: Math.max(0, MAINTAINED_FOM_SHARE * result.capexG - opexSeedPerMW(economics) * result.fxRate),
  };
}
