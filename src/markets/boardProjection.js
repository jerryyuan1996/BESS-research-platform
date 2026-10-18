/* ---------------------------------------------------------------------------
   THE BOARD PROJECTION — a market's view and ledger, cut down to what the home
   page computes with.

   A market view is mostly words: a reason in two languages for each of
   fourteen grades, three arguments and a counter-argument for each of four
   verdicts, and for each ledger item how it is posted and how it is lost. The
   home board prints none of that. It reads grades as numbers, a verdict's call
   and route, and a ledger's amounts, and it works out the rest.

   Carrying the words to the home page cost about five kilobytes a market, and
   the budget had room for one more market, not eleven. So the home page gets
   this and the words travel with the market's own dashboard, registered in
   markets/caseRegistry.js when that chunk loads.

   THE SHAPES ARE KEPT. A projected view is still { marketId, grades, verdicts,
   triggers } and a projected ledger is still { marketId, basis, items }, so
   entry/assessment.js and home/boardModel.js take either without knowing
   which. tests/verdict-board.test.js holds the two to the same board, field
   for field.

   NOTHING IS DECIDED HERE. A field is copied or it is left out.

   Layering: no DOM, no import. The build plugin and plain Node both use it.
   --------------------------------------------------------------------------- */

/** What the board reads of a grade: the number, and the held layer's number and dates. */
function projectGrade(record, dimension){
  const out = { grade: record.grade };
  if(dimension==='assetReturn')out.basis=record.basis;
  if (record.held){
    out.held = { grade: record.held.grade, confidence: record.held.confidence, reviewBy: record.held.reviewBy };
  }
  return out;
}

/** What the board reads of a verdict. The arguments stay with the dashboard. */
function projectVerdict(record){
  const out = {
    archetype: record.archetype, call: record.call, route: record.route,
    changesIf: record.changesIf, reviewBy: record.reviewBy ?? null, asOf: record.asOf,
  };
  if (record.where) out.where = record.where;
  if (record.scoreNote) out.scoreNote = record.scoreNote;
  if (record.play) out.play = record.play;
  return out;
}

/**
 * What the board reads of a play: the design, its one line and its next step,
 * and any call of its own. A play's words are short by rule — a label, a
 * line, an action — so they travel; the thesis stays with the dashboard.
 */
function projectPlay(record){
  const out = {
    id: record.id, label: record.label, route: record.route, hours: record.hours, stage: record.stage,
    why: record.why, action: record.action,
  };
  if (record.calls) out.calls = Object.fromEntries(Object.entries(record.calls).map(([id, call]) => [id, projectVerdict(call)]));
  return out;
}

/** What the board, the calendar and the changes panel read of a trigger. */
export function projectTrigger(trigger){
  const out = {
    id: trigger.id, market: trigger.market, kind: trigger.kind, label: trigger.label,
    expected: trigger.expected ?? null, watches: trigger.watches, direction: trigger.direction,
  };
  if (trigger.outcome) out.outcome = trigger.outcome;
  return out;
}

export function projectView(view){
  const out = {
    marketId: view.marketId,
    grades: Object.fromEntries(Object.entries(view.grades).map(([id, record]) => [id, projectGrade(record,id)])),
    verdicts: Object.fromEntries(Object.entries(view.verdicts).map(([id, record]) => [id, projectVerdict(record)])),
    triggers: view.triggers.map(projectTrigger),
  };
  if (view.plays) out.plays = Object.fromEntries(Object.entries(view.plays).map(([id, record]) => [id, projectPlay(record)]));
  return out;
}

/** A ledger's figures and flags: everything ledgerTotals reads, and no prose. */
export function projectLedger(ledger){
  return {
    marketId: ledger.marketId,
    basis: { powerMW: ledger.basis.powerMW, durationHours: ledger.basis.durationHours },
    items: ledger.items.map(item => ({
      id: item.id, kind: item.kind, amount: item.amount, postedAt: item.postedAt,
      beforeFid: item.beforeFid, beforeConsent: item.beforeConsent, status: item.status,
    })),
  };
}

/** A market file counts as graded once it holds a grade. One with triggers only does not. */
export const isGraded = (view) => Object.keys(view.grades || {}).length > 0;

/**
 * Everything the home page needs of the view store and the ledgers.
 *
 * @param views    every market file in view/markets, graded or not
 * @param ledgers  every capital-at-risk ledger
 */
export function boardData(views, ledgers){
  const sorted = [...views].sort((a, b) => a.marketId.localeCompare(b.marketId));
  return {
    views: Object.fromEntries(sorted.filter(isGraded).map(v => [v.marketId, projectView(v)])),
    ledgers: Object.fromEntries([...ledgers].sort((a, b) => a.marketId.localeCompare(b.marketId)).map(l => [l.marketId, projectLedger(l)])),
    /* Wider than the graded list: a market whose file holds only triggers is
       still on the calendar. */
    triggers: sorted.flatMap(v => (v.triggers || []).map(projectTrigger)),
  };
}
