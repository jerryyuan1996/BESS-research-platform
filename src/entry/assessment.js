/* ---------------------------------------------------------------------------
   ONE MARKET, FOUR INVESTORS — the join.

   Three things have to meet before a verdict can be checked: the market's
   grades (the view store), what entry costs in money (the ledger) and how each
   investor reads both (the archetypes). Each lives where its authority puts
   it, and none of them knows about the others. This is the one place they are
   put side by side.

   It decides nothing. It returns, for each archetype, the score, the ceiling,
   what could not be checked and — where the analyst has set a verdict — whether
   that verdict sits where the score would put it. The verdict is always the
   analyst's own record, handed back untouched.

   The caller supplies the market view, the conversion rates and the
   evaluation date. This module does not read the store, look up a rate or
   consult a clock, so the same function serves a page, a test and a script.

   PRIVATE FIGURES ARE THE CALLER'S TO OFFER. The analyst's own screen may pass
   deal-derived figures for a limit the public ledger cannot check. They are
   used for the limit check and reported as used; nothing here stores them, and
   a caller that passes none — every build — gets the public answer.
   --------------------------------------------------------------------------- */

import { ARCHETYPE_IDS } from '../governance/investability.js';
import { ARCHETYPES, assess } from '../governance/archetypes.js';
import { ledgerTotals, referenceProject, limitInputs } from './ledger.js';

/**
 * @param view     a market view from the view store
 * @param market   the registered market: { manifest, comparison }
 * @param ledger   its capital-at-risk ledger, or null when it has none
 * @param usdPer   USD per unit, keyed by currency code
 * @param options.on              evaluation date, YYYY-MM-DD; required once any
 *                                grade in the view carries a held layer
 * @param options.privateMetrics  figures from the private overlay, keyed by
 *                                METRIC; each replaces the public figure and is
 *                                treated as complete
 */
export function assessMarket(view, market, ledger, usdPer, { on, privateMetrics = {} } = {}){
  const project = referenceProject(market.comparison, usdPer?.[market.manifest.currency]);
  const totals = ledger ? ledgerTotals(ledger, usdPer, project?.costUSD ?? null) : null;

  /* With no ledger the project cost is still known — it comes from the engine —
     so the cheque can be checked even where nothing else can. */
  const inputs = totals
    ? limitInputs(totals)
    : limitInputs({ empty: true, projectCostUSD: project?.costUSD ?? null });
  const privateMetricsUsed = Object.keys(privateMetrics);
  const metrics = { ...inputs.metrics, ...privateMetrics };
  const incomplete = inputs.incomplete.filter(key => !privateMetricsUsed.includes(key));

  const byArchetype = {};
  for (const id of ARCHETYPE_IDS){
    const verdict = view.verdicts?.[id] ?? null;
    byArchetype[id] = { ...assess(ARCHETYPES[id], view.grades, metrics, verdict, incomplete, on), verdict };
  }
  return { marketId: view.marketId, project, totals, byArchetype, privateMetricsUsed };
}

/** Archetypes whose verdict the score disagrees with. Empty when all sit within a band. */
export function disagreements(assessment){
  return ARCHETYPE_IDS
    .map(id => assessment.byArchetype[id])
    .filter(a => a.check?.disagrees)
    .map(a => ({ archetype: a.archetype, call: a.check.call, expected: a.check.expected, kind: a.check.kind }));
}
