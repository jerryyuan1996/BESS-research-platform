/* ---------------------------------------------------------------------------
   PLAYS, PRICED AND RANKED — the shortlist behind the briefing.

   A play (governance/plays.js) names a design: route, hours, entry stage. Its
   economics are the engine's, worked out here at the moment the briefing is
   built, so a play cannot carry a stale number:

     value     value per MW of connection at the platform's yields, from the
               design-fit sweep (comparison/designFit.js)
     eligible  whether the design holds its duration floor to the end of term
     hold/exit hold and exit IRR at exit year 5, from runCase on that design
     secured   the secured share of first-year revenue, and for how long

   Then, per investor, one row for each market — the play the market's verdict
   names, or the play entered at the verdict's stage, or the most valuable — and
   one more for every play that carries its own call for that investor. Rows
   are ordered by call, then by value (plan decision 4). A row whose call and
   economics disagree is flagged; governance/briefing.js says when.

   Layering: no DOM. Imports the engine, so this runs where the engine runs: in
   Node, at build time and in the digest. A page reads the result.
   --------------------------------------------------------------------------- */

import { runCase, runBaseCase } from '../comparison/engine.js';
import { supportedStrategies, baseStrategy } from '../comparison/strategies.js';
import { sweepDesign, fitOf, marketAt } from '../comparison/designFit.js';
import { ARCHETYPE_IDS, VERDICT_IDS } from '../governance/investability.js';
import { playsOf, REVENUE_ROUTE_LABEL } from '../governance/plays.js';
import { byExpected, isResolved } from '../governance/triggers.js';
import {
  tierOf, TIER_ORDER, disagreementOf, evidenceOf, WEAK_INPUT_BASIS,
} from '../governance/briefing.js';
import { returnKeyFor } from '../home/boardModel.js';

/** The exit year every briefing figure is priced at: the league table's default. */
export const BRIEFING_EXIT_YEAR = 5;

const finite = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : null);
const round = (x, places) => (x === null ? null : Number(x.toFixed(places)));

/**
 * One market's sweep and fit, worked out once. A market the engine withholds
 * (Finland) returns { withheld: true }.
 */
export function marketDesign(market){
  const cmp = market.comparison;
  if (cmp.engineReady === false || !cmp.economics) return { withheld: true, sweep: null, fit: null };
  const sweep = sweepDesign(market);
  if (sweep.na) return { withheld: true, sweep: null, fit: null };
  return { withheld: false, sweep, fit: fitOf(market, { sweep }) };
}

/**
 * What the engine says of one design. Numbers are rounded to what a page
 * prints, so the projection is small and a build is stable to the cent.
 */
export function designEconomics(market, design, route, hours){
  if (design.withheld) return { priced: false, withheld: true };
  const point = design.sweep.points.find(p => p.route === route && p.hours === hours) || null;
  const variant = marketAt(market, route, hours);
  const run = variant.na ? null : runCase(variant, route, BRIEFING_EXIT_YEAR);
  const weakInputs = Object.entries(point?.inputs || {})
    .filter(([, input]) => input && WEAK_INPUT_BASIS.includes(input.basis))
    .map(([line, input]) => ({ line, basis: input.basis }));
  return {
    priced: Boolean(point?.priced),
    eligible: point ? point.eligible !== false : false,
    reason: point && point.eligible === false ? point.reason : null,
    requiredHours: round(finite(point?.term?.requiredHours), 1),
    value: round(finite(point?.value), 0),
    hold: round(finite(run?.irrHold), 4),
    exit: round(finite(run?.irrExit), 4),
    secured: round(finite(run?.securedShare), 3),
    securedYears: finite(run?.securedYears),
    weakInputs,
  };
}

/** The route a market prices by default, as a stand-in play when it has none written. */
function basePlay(market, verdict){
  const cmp = market.comparison;
  const route = baseStrategy(market) || supportedStrategies(market)[0]?.id || 'mer';
  const hours = cmp.archetype?.durationHours ?? 4;
  const name = REVENUE_ROUTE_LABEL[route] || [route, route];
  return {
    id: `${market.manifest.id.replace(/_/g, '-')}-base`, implicit: true,
    label: [`${name[0]} · ${hours}h`, `${name[1]} · ${hours}小时`],
    route, hours, stage: verdict?.route ?? null, why: null, action: null,
  };
}

/** The trigger a call would move on next: the soonest unresolved dated one, else an overdue one, else undated. */
function nextTrigger(view, changesIf, on){
  const named = byExpected((view.triggers || []).filter(t => changesIf.includes(t.id) && !isResolved(t)));
  const dated = named.filter(t => t.expected !== null);
  const ahead = dated.find(t => (t.expected.length === 7 ? `${t.expected}-31` : t.expected) >= on);
  return (ahead || dated[dated.length - 1] || named[0] || null)?.id ?? null;
}

/**
 * The rows of one investor's shortlist, unordered.
 *
 * @param entries  [{ market, view, design, assessment }] for every graded market
 */
export function lensRows(entries, archetype, on){
  const rows = [];
  for (const { market, view, design, assessment, playEcon } of entries){
    const verdict = view.verdicts?.[archetype] || null;
    const plays = playsOf(view);
    const fit = finite(assessment?.byArchetype?.[archetype]?.fit);
    const row = (play, call, own) => {
      const econ = playEcon(play);
      const becauseBases = (call.because || []).map(b => view.grades?.[b.dimension]?.basis);
      return {
        market: market.manifest.id,
        play: play.id, implicit: Boolean(play.implicit),
        call: call.call, own, tier: tierOf(call.call),
        stage: own || verdict?.play === play.id ? play.stage : (call.route ?? play.stage),
        where: call.where ?? null,
        fit: round(fit, 1),
        evidence: evidenceOf(econ, becauseBases),
        next: nextTrigger(view, call.changesIf || [], on),
        reviewBy: call.reviewBy ?? null,
      };
    };

    for (const play of plays){
      const own = play.calls?.[archetype];
      if (own) rows.push(row(play, own, true));
    }
    if (!verdict) continue;
    const ownIds = new Set(plays.filter(p => p.calls?.[archetype]).map(p => p.id));
    const named = verdict.play ? plays.find(p => p.id === verdict.play) : null;
    const byStage = plays.find(p => p.stage === verdict.route && !ownIds.has(p.id));
    const byValue = [...plays].filter(p => !ownIds.has(p.id))
      .sort((a, b) => (playEcon(b).value ?? -Infinity) - (playEcon(a).value ?? -Infinity))[0];
    const play = named || byStage || byValue || basePlay(market, verdict);
    if (!ownIds.has(play.id)) rows.push({ ...row(play, verdict, false), ...(play.implicit ? { implicitPlay: play } : {}) });
  }
  return rows;
}

const callRank = (call) => { const i = VERDICT_IDS.indexOf(call); return i === -1 ? VERDICT_IDS.length : i; };

/**
 * The shortlist in order: call, then value; a design that is not priced or not
 * compliant comes last in its call, by fit. Flags are set here, because a flag
 * needs to know where a play ranks among every priced design.
 */
export function orderRows(rows, econOf){
  const priced = rows.map(r => econOf(r)).filter(e => e.priced && e.eligible && e.value !== null).map(e => e.value).sort((a, b) => b - a);
  const rankShare = (value) => {
    if (value === null || !priced.length) return null;
    const above = priced.filter(v => v > value).length;
    return priced.length === 1 ? 0 : above / (priced.length - 1);
  };
  const ranked = rows.map(r => {
    const econ = econOf(r);
    const comparable = econ.priced && econ.eligible && econ.value !== null;
    return { ...r, flag: disagreementOf(r.call, econ, comparable ? rankShare(econ.value) : null), sortValue: comparable ? econ.value : null };
  });
  ranked.sort((a, b) =>
    TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)
    || callRank(a.call) - callRank(b.call)
    || (a.sortValue === null) - (b.sortValue === null)
    || (b.sortValue ?? 0) - (a.sortValue ?? 0)
    || (b.fit ?? -1) - (a.fit ?? -1)
    || a.market.localeCompare(b.market));
  return ranked.map(({ sortValue, ...r }) => r);
}

/** The return figure an investor reads: hold IRR for a holder, exit IRR for a seller. */
export const returnFieldFor = (archetype) => returnKeyFor(archetype);

export { ARCHETYPE_IDS, runBaseCase };
