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

   The caller supplies the market view and the conversion rates. This module
   does not read the store and does not look up a rate, so the same function
   serves a page, a test and a script.
   --------------------------------------------------------------------------- */

import { ARCHETYPE_IDS } from '../governance/investability.js';
import { ARCHETYPES, assess } from '../governance/archetypes.js';
import { ledgerTotals, referenceProject, limitInputs } from './ledger.js';

/**
 * @param view     a market view from the view store
 * @param market   the registered market: { manifest, comparison }
 * @param ledger   its capital-at-risk ledger, or null when it has none
 * @param usdPer   USD per unit, keyed by currency code
 */
export function assessMarket(view, market, ledger, usdPer){
  const project = referenceProject(market.comparison, usdPer?.[market.manifest.currency]);
  const totals = ledger ? ledgerTotals(ledger, usdPer, project?.costUSD ?? null) : null;

  /* With no ledger the project cost is still known — it comes from the engine —
     so the cheque can be checked even where nothing else can. */
  const { metrics, incomplete } = totals
    ? limitInputs(totals)
    : limitInputs({ empty: true, projectCostUSD: project?.costUSD ?? null });

  const byArchetype = {};
  for (const id of ARCHETYPE_IDS){
    const verdict = view.verdicts?.[id] ?? null;
    byArchetype[id] = { ...assess(ARCHETYPES[id], view.grades, metrics, verdict, incomplete), verdict };
  }
  return { marketId: view.marketId, project, totals, byArchetype };
}

/** Archetypes whose verdict the score disagrees with. Empty when all sit within a band. */
export function disagreements(assessment){
  return ARCHETYPE_IDS
    .map(id => assessment.byArchetype[id])
    .filter(a => a.check?.disagrees)
    .map(a => ({ archetype: a.archetype, call: a.check.call, expected: a.check.expected, kind: a.check.kind }));
}
