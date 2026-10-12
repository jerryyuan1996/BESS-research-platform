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
   AUGMENTATION  no year and no lump cost were chosen. A source was opened
                 instead, and it does not describe augmentation as an event: it
                 describes a higher yearly operating cost that holds capacity
                 at its rating. Both cases are shown.

   ---------------------------------------------------------------------------
   THE ARITHMETIC, per MW in USD on yearly periods

   From the engine: sec[y], auc[y], mch[y] and eb[y] for y = 1 … 15, and
   cost[y] = sec[y] + auc[y] + mch[y] − eb[y]. g is the market's own yearly
   degradation rate.

   FADING — the engine's own treatment, carried on:

     sec[y]  = sec[15]                                  y = 16 … N
     auc[y]  = auc[15]
     mch[y]  = mch[15] · (1 − g)^(y − 15)
     cost[y] = cost[15]

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

import { runBaseCase } from '../comparison/engine.js';
import { LIFE, LONG_LIFE_YEARS, MAINTAINED_FOM_SHARE } from '../comparison/assumptions.js';
import { irrOf } from '../utils/finance.js';

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
    ? Math.max(0, MAINTAINED_FOM_SHARE * result.capexG - economics.opexPerMW * result.fxRate)
    : 0;

  const line = [];
  for (let y = 1; y <= years; y++){
    const i = Math.min(y, LIFE) - 1;
    const sec = result.secY[i], auc = result.aucY[i];
    let cost = sec + auc + result.mchY[i] - result.eb[i];
    if (i === LIFE - 1) cost -= decommissioning;
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
  }));
  return {
    withheld: false,
    assetIrr: result.irrHold,
    windows,
    upkeepPerMW: Math.max(0, MAINTAINED_FOM_SHARE * result.capexG - economics.opexPerMW * result.fxRate),
  };
}
