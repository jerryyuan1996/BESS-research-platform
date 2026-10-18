/* ---------------------------------------------------------------------------
   THE VERDICT BOARD, AS DATA.

   Everything the home page shows about a market for an investor, worked out
   here and drawn elsewhere. No DOM: the ordering, the "lead with the barrier"
   rule and the calendar window are the parts worth testing, and a test should
   not need a browser to reach them.

   It decides nothing. A verdict is the analyst's record, read from the view
   store and handed on untouched; the score beside it comes from
   entry/assessment.js. What this module adds is arrangement:

     - a market with grades gets a cell per investor; a market without gets
       "not yet graded" and its return, never a guessed verdict
     - when a ceiling applies the cell LEADS WITH THE BARRIER and says so in
       `headline`, so no renderer can put the score first by accident
     - a market whose return the engine does not price (Finland) has its Return
       pillar marked withheld, whatever the grade beneath it says
     - rows are ordered by verdict, then by fit. Ungraded markets follow in
       registry order: ranking them by return is the mistake the board exists
       to correct

   The caller supplies the evaluation date. Nothing here reads a clock.
   --------------------------------------------------------------------------- */
import {
  PILLARS, VERDICT_IDS, ARCHETYPE_IDS, dimension, effectiveGrade,
} from '../governance/investability.js';
import { ARCHETYPES, NOT_ACCESSIBLE, DISAGREEMENT_LABEL, METRIC } from '../governance/archetypes.js';
import { byExpected, overdue, isResolved } from '../governance/triggers.js';
import { assessMarket } from '../entry/assessment.js';
import { returnGradesFor } from '../comparison/returnGrades.js';
import { limitInputs } from '../entry/ledger.js';
import { runScenarioSet } from '../comparison/refinement.js';

/** The lens a stored preference resolves to: a known archetype id, or null for "all four". */
export const resolveLens = (value) => (ARCHETYPE_IDS.includes(value) ? value : null);

const finite = (v) => typeof v === 'number' && Number.isFinite(v);

const usd = (value) => {
  if (value >= 1e6) return 'USD ' + (value / 1e6).toFixed(value >= 1e8 ? 0 : 1).replace(/\.0$/, '') + 'm';
  if (value >= 1e3) return 'USD ' + Math.round(value / 1e3) + 'k';
  return 'USD ' + Math.round(value);
};

/**
 * What the engine says this market returns, base and bull, or why it says
 * nothing. `withheld` is a market the engine does not price at all; `na` is
 * one it prices and finds no meaningful figure for.
 */
export function marketReturn(market, exitYear){
  if (!market.comparison || market.comparison.engineReady === false) return { withheld: true };
  const set = runScenarioSet(market, undefined, exitYear);
  const pick = (key) => ({
    base: finite(set.base.result?.[key]) ? set.base.result[key] : null,
    bull: finite(set.bull.result?.[key]) ? set.bull.result[key] : null,
  });
  return { withheld: false, exitYear, hold: pick('irrHold'), exit: pick('irrExit') };
}

/**
 * Which of the two engine returns an investor reads. A holder reads the hold
 * IRR; one that sells reads the exit IRR. The developer's own measure — a
 * development multiple — is not modelled, so it is shown the exit IRR a buyer
 * of its project would earn, and the page says so.
 */
export const returnKeyFor = (archetypeId) =>
  (archetypeId && ARCHETYPES[archetypeId].returnBasis !== 'hold-irr' ? 'exit' : 'hold');

/* The barrier, in words. A breached limit is quoted with its figure when the
   figure is public; a figure from the private overlay is never printed. */
function barriers(assessment, cell, view, on){
  const arch = ARCHETYPES[cell.archetype];
  const out = [];
  for (const id of cell.knockOuts){
    const d = dimension(id);
    const grade = effectiveGrade(view.grades[id], on).grade;
    out.push({
      kind: 'knock-out',
      text: [`${d.label[0]} is graded ${grade} of 5, which this investor cannot accept`,
             `“${d.label[1]}”评级为${grade}（满分5），这类投资者无法接受`],
    });
  }
  const inputs = assessment.totals ? limitInputs(assessment.totals) : { metrics: {}, incomplete: [] };
  for (const limit of arch.limits){
    if (!cell.limitsBreached.includes(limit.id)) continue;
    const isPrivate = assessment.privateMetricsUsed.includes(limit.metric);
    const value = inputs.metrics[limit.metric];
    if (isPrivate || !finite(value)){
      out.push({ kind: 'limit', confidential: isPrivate, text: limit.label });
      continue;
    }
    const least = inputs.incomplete.includes(limit.metric);
    const months = limit.metric === METRIC.MONTHS_TO_RTB;
    const figure = months ? [`${Math.round(value)} months`, `${Math.round(value)}个月`] : [usd(value), usd(value)];
    const max = months ? [`${limit.max} months`, `${limit.max}个月`] : [usd(limit.max), usd(limit.max)];
    out.push({
      kind: 'limit',
      text: [`${limit.label[0]}: ${least ? 'at least' : 'about'} ${figure[0]}, against a limit of ${max[0]}`,
             `${limit.label[1]}：${least ? '至少' : '约'} ${figure[1]}，而其上限为 ${max[1]}`],
    });
  }
  return out;
}

/* The trigger a reader should watch next: the soonest one this verdict names
   that has not already passed, or — when all have — the most recent overdue
   one, flagged, because somebody has to go and look. */
function nextTrigger(view, verdict, on){
  const named = byExpected(view.triggers.filter(t => verdict.changesIf.includes(t.id)));
  if (!named.length) return null;
  const late = new Set(overdue(named, on).map(t => t.id));
  const ahead = named.find(t => !late.has(t.id));
  const chosen = ahead || named[named.length - 1];
  return { ...chosen, overdue: late.has(chosen.id), others: named.length - 1 };
}

function cellFor(assessment, archetypeId, view, on, returnWithheld){
  const a = assessment.byArchetype[archetypeId];
  const verdict = a.verdict;
  const closed = a.ceiling === NOT_ACCESSIBLE;
  return {
    archetype: archetypeId,
    verdict,
    call: verdict?.call ?? null,
    route: a.route,
    where: verdict?.where ?? null,
    /* 'ceiling' means the barrier is the headline and the score is not. */
    headline: a.headline,
    fit: a.fit,
    band: a.band,
    pillars: Object.fromEntries(PILLARS.map(p => [p, p === 'return' && returnWithheld ? null : a.pillars[p]])),
    returnWithheld,
    knockOuts: a.knockOuts,
    limitsBreached: a.limitsBreached,
    barriers: closed ? barriers(assessment, a, view, on) : [],
    unchecked: ARCHETYPES[archetypeId].limits.filter(l => a.limitsUnchecked.includes(l.id)).map(l => l.label),
    flag: a.check?.disagrees
      ? { kind: a.check.kind, label: DISAGREEMENT_LABEL[a.check.kind], note: verdict?.scoreNote ?? null }
      : null,
    changesIf: verdict ? nextTrigger(view, verdict, on) : null,
    heldApplied: a.heldApplied.length > 0,
    confidential: assessment.privateMetricsUsed.length > 0,
  };
}

const verdictRank = (call) => {
  const i = VERDICT_IDS.indexOf(call);
  return i === -1 ? VERDICT_IDS.length : i;
};

/**
 * The board: one row per registered market.
 *
 * @param markets            the registry's markets, in registry order
 * @param options.lens       an archetype id, or null for all four
 * @param options.on         evaluation date, YYYY-MM-DD
 * @param options.usdPer     USD per unit, keyed by currency code
 * @param options.exitYear   the exit year the return is priced at
 * @param options.viewFor    marketId → graded view or null
 * @param options.ledgerFor  marketId → ledger or null
 * @param options.privateMetricsFor  marketId → figures from the private overlay;
 *                                   empty in every build
 */
export function buildBoard(markets, { lens = null, on, usdPer, exitYear = 5, viewFor, ledgerFor, privateMetricsFor = () => ({}) }){
  const returnGrades = returnGradesFor(markets, exitYear);
  const rows = markets.map((market, index) => {
    const id = market.manifest.id;
    const view = viewFor(id);
    const ret = marketReturn(market, exitYear);
    if (!view) return { market, index, graded: false, ret, cells: null, cell: null };

    const assessment = assessMarket(view, market, ledgerFor(id), usdPer, { on, privateMetrics: privateMetricsFor(id), returnGrades });
    const cells = Object.fromEntries(ARCHETYPE_IDS.map(a => [a, cellFor(assessment, a, view, on, ret.withheld)]));
    return { market, index, graded: true, ret, cells, cell: lens ? cells[lens] : null };
  });

  const graded = rows.filter(r => r.graded);
  const ungraded = rows.filter(r => !r.graded);
  if (lens){
    graded.sort((a, b) =>
      verdictRank(a.cell.call) - verdictRank(b.cell.call)
      || (b.cell.fit ?? -1) - (a.cell.fit ?? -1)
      || a.index - b.index);
  }
  return { lens, on, exitYear, rows: [...graded, ...ungraded], gradedCount: graded.length, ungradedCount: ungraded.length };
}

/* ---- the trigger calendar ------------------------------------------------- */

const monthKey = (year, month) => `${year}-${String(month).padStart(2, '0')}`;

/** The `count` months starting with the one `on` falls in, as YYYY-MM. */
export function monthsFrom(on, count = 12){
  const year = Number(on.slice(0, 4)), month = Number(on.slice(5, 7));
  return Array.from({ length: count }, (_, i) => {
    const m = month - 1 + i;
    return monthKey(year + Math.floor(m / 12), (m % 12) + 1);
  });
}

/**
 * Triggers laid out for the next `count` months from `on`.
 *
 * Five groups, and none of them is dropped: a trigger whose date has passed is
 * `overdue` and needs somebody to check it; one beyond the window is `later`;
 * one with no date is `undated`. A calendar that showed only the tidy middle
 * would hide exactly the items that need attention. A trigger whose outcome is
 * recorded is `resolved`: it has happened, so it leaves the lanes.
 */
export function triggerCalendar(triggers, on, count = 12){
  const months = monthsFrom(on, count);
  const late = overdue(triggers, on);
  const lateIds = new Set(late.map(t => t.id));
  const lanes = new Map();
  const later = [], undated = [], upcoming = [], resolved = [];

  for (const t of byExpected(triggers)){
    if (lateIds.has(t.id)) continue;
    /* What happened is recorded: it is a change now, not a date to watch. */
    if (isResolved(t)){ resolved.push(t); continue; }
    if (t.expected === null){ undated.push(t); continue; }
    const column = months.indexOf(t.expected.slice(0, 7));
    if (column === -1){ later.push(t); continue; }
    if (!lanes.has(t.market)) lanes.set(t.market, months.map(() => []));
    lanes.get(t.market)[column].push(t);
    upcoming.push(t);
  }
  return {
    months,
    lanes: [...lanes.entries()].map(([market, cells]) => ({ market, cells })),
    upcoming, overdue: late, later, undated, resolved,
  };
}

/* ---- what changed ---------------------------------------------------------- */

/** Changes in the seven days ending on `on`, from a per-day count. */
export function changesThisWeek(perDay, on){
  const end = Date.parse(`${on}T00:00:00Z`);
  let count = 0;
  for (const [day, n] of Object.entries(perDay || {})){
    const age = (end - Date.parse(`${day}T00:00:00Z`)) / 86400000;
    if (age >= 0 && age < 7) count += n;
  }
  return count;
}
