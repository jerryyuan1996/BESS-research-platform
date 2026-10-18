/* ---------------------------------------------------------------------------
   THE BRIEFING MODEL — one object for the page, the desk and the digest.

   PR 3 of the guided-experience plan. The home page, /desk and the weekly
   GitHub digest all read what this returns, so the three can never disagree.
   It is built where the engine runs — at build time by vite-plugin-briefing.js,
   and in Node by the digest and the tests — and a page receives the result as
   data, with no engine in its chunk.

   For each of the four investors: the shortlist of plays in order (call, then
   value), the computed call sentence, the next actions. For everyone: the
   catalysts ahead, a line per market on what to build, the changes of the last
   CHANGE_WINDOW_DAYS, and the analyst's queue.

   Plays travel once, in `plays`, keyed `<market>/<play>`; a row names its play.
   Triggers travel once, in `triggers`. Everything is dated, so a page can cut
   "since your last visit" on the reader's own clock.

   Layering: no DOM. Pure given its inputs; the inputs are read in disk.js.
   --------------------------------------------------------------------------- */

import { ARCHETYPE_IDS } from '../governance/investability.js';
import { playsOf } from '../governance/plays.js';
import { byExpected, isResolved } from '../governance/triggers.js';
import { TIER, MAX_ACTIONS, CATALYST_WINDOW_DAYS } from '../governance/briefing.js';
import { assessMarket } from '../entry/assessment.js';
import { returnGradesFor } from '../comparison/returnGrades.js';
import { runBaseCase } from '../comparison/engine.js';
import { FX } from '../comparison/assumptions.js';
import {
  marketDesign, designEconomics, designGrid, lensRows, orderRows, returnFieldFor, BRIEFING_EXIT_YEAR,
} from './plays.js';
import { callSentence, buildLine, routeNames, flagText, marketName, inSentence } from './sentences.js';
import { REVENUE_ROUTE_LABEL } from '../governance/plays.js';
import { collectChanges } from './changes.js';
import { buildQueue } from './queue.js';

export const BRIEFING_VERSION = 1;
export const DEFAULT_LENS = 'infraFund';

const DAY = 86_400_000;
const playKey = (marketId, playId) => `${marketId}/${playId}`;
const dueOf = (expected) => (expected.length === 7 ? `${expected}-31` : expected);

/**
 * @param input.markets    the registry's markets
 * @param input.views      every market view (view/markets/*.json)
 * @param input.changelog  every changelog line
 * @param input.ledgerFor  marketId → capital-at-risk ledger or null
 * @param input.summaries  datasetId → published summary (prices, news, FX)
 * @param input.catalogue  the dataset catalogue
 * @param input.now        a Date
 */
export function buildBriefing({ markets, views, changelog, ledgerFor, summaries, news = null, catalogue, now }){
  const on = now.toISOString().slice(0, 10);
  const viewById = new Map(views.map(v => [v.marketId, v]));
  const returnGrades = returnGradesFor(markets, BRIEFING_EXIT_YEAR);

  /* ---- each graded market, priced once ---- */
  const entries = [];
  const plays = {};
  const engine = {};
  for (const market of markets){
    const id = market.manifest.id;
    const view = viewById.get(id);
    const base = runBaseCase(market, BRIEFING_EXIT_YEAR);
    engine[id] = { hold: Number.isFinite(base?.irrHold) ? base.irrHold : null, secured: Number.isFinite(base?.securedShare) ? base.securedShare : null };
    if (!view || !Object.keys(view.grades || {}).length) continue;
    const design = marketDesign(market);
    const cache = new Map();
    const playEcon = (play) => {
      if (!cache.has(play.id)) cache.set(play.id, designEconomics(market, design, play.route, play.hours));
      return cache.get(play.id);
    };
    const assessment = assessMarket(view, market, ledgerFor(id), FX, { on, returnGrades });
    entries.push({ market, view, design, assessment, playEcon });
    for (const play of playsOf(view)){
      plays[playKey(id, play.id)] = {
        market: id, id: play.id, label: play.label, route: play.route, hours: play.hours, stage: play.stage,
        why: play.why, action: play.action, econ: playEcon(play),
      };
    }
  }

  /* ---- the shortlist, per investor ---- */
  const lenses = {};
  const lensRowsFull = {};
  for (const archetype of ARCHETYPE_IDS){
    const raw = lensRows(entries, archetype, on);
    const econOf = (row) => entries.find(e => e.market.manifest.id === row.market).playEcon(playRecordOf(row));
    const playRecordOf = (row) => {
      const stored = plays[playKey(row.market, row.play)];
      if (stored) return stored;
      /* A market with no plays written yet stands on its base route and archetype. */
      const entry = entries.find(e => e.market.manifest.id === row.market);
      const p = row.implicitPlay;
      plays[playKey(row.market, row.play)] = { market: row.market, id: p.id, label: p.label, route: p.route, hours: p.hours,
        stage: row.stage, implicit: true, why: null, action: null, econ: entry.playEcon(p) };
      return plays[playKey(row.market, row.play)];
    };
    const ordered = orderRows(raw, econOf);
    lensRowsFull[archetype] = ordered.map(r => ({ ...r, econ: econOf(r), playRecord: playRecordOf(r) }));
    for (const r of ordered) delete r.implicitPlay;

    const returnField = returnFieldFor(archetype);
    const nextDecisive = nextDecisiveTrigger(lensRowsFull[archetype], viewById, on);
    lenses[archetype] = {
      returnField,
      rows: ordered.map(r => ({ ...r, flagText: r.flag ? flagText[r.flag](econOf(r)) : null })),
      call: callSentence(lensRowsFull[archetype].map(r => ({ ...r, play: r.playRecord })), archetype, nextDecisive, returnField),
      next: nextDecisive?.id ?? null,
      actions: actionsFor(lensRowsFull[archetype]),
    };
  }

  /* ---- catalysts, what to build, changes, the queue ---- */
  const triggers = {};
  for (const view of views){
    for (const t of view.triggers || []){
      triggers[t.id] = { id: t.id, market: view.marketId, label: t.label, expected: t.expected ?? null, direction: t.direction, watches: t.watches,
        ...(t.outcome ? { outcome: t.outcome } : {}) };
    }
  }
  const horizon = new Date(now.getTime() + (CATALYST_WINDOW_DAYS + 31) * DAY).toISOString().slice(0, 10);
  const catalysts = byExpected(Object.values(triggers).filter(t => t.expected !== null && !t.outcome && dueOf(t.expected) >= on && dueOf(t.expected) <= horizon)).map(t => t.id);

  const grids = Object.fromEntries(entries.map(({ market, design }) => [market.manifest.id, designGrid(design)]));

  const build = entries.map(({ market, view, design }) => {
    const id = market.manifest.id;
    const names = routeNames(playsOf(view));
    const fit = design.fit && !design.fit.na ? design.fit : null;
    return {
      market: id,
      line: buildLine(id, fit, design.withheld, names, design.sweep?.baseRoute ?? null),
      best: fit?.best ? { route: fit.best.route, hours: fit.best.hours, value: Math.round(fit.best.value) } : null,
    };
  });

  const changes = collectChanges({ changelog, views, feeds: priceFeeds(summaries, catalogue), news, on })
    .map(({ id, ...item }) => item);

  const queue = buildQueue({ views, lenses: lensRowsFull, engine, summaries, catalogue, on, nowMs: now.getTime() });

  return {
    version: BRIEFING_VERSION,
    builtAt: now.toISOString(),
    on,
    defaultLens: DEFAULT_LENS,
    exitYear: BRIEFING_EXIT_YEAR,
    markets: Object.fromEntries(markets.map(m => [m.manifest.id, { name: marketName(m.manifest.id, m.manifest.name), slug: m.manifest.slug }])),
    plays,
    triggers,
    lenses,
    catalysts,
    build,
    grids,
    changes,
    queue,
  };
}

/** The price summaries a change can be read from, keyed by the market they price. */
function priceFeeds(summaries, catalogue){
  const out = {};
  for (const dataset of catalogue){
    const summary = summaries[dataset.id];
    if (!summary || !Array.isArray(summary.daily) || !dataset.marketId) continue;
    if (summary.derived?.spreadMean === undefined) continue;
    out[dataset.marketId] = summary;
  }
  return out;
}

/** The soonest dated, unresolved trigger an acting call names next: what the briefing calls the next decisive date. */
function nextDecisiveTrigger(rows, viewById, on){
  const acting = rows.filter(r => r.tier === TIER.PURSUE || r.tier === TIER.PREPARE || r.tier === TIER.SITUATIONAL);
  const named = [];
  for (const r of acting){
    const t = (viewById.get(r.market).triggers || []).find(x => x.id === r.next);
    if (t && t.expected !== null && !isResolved(t) && dueOf(t.expected) >= on) named.push(t);
  }
  return byExpected(named)[0] || null;
}

/** The investor's next steps: acting tiers first, dated ones by date. */
function actionsFor(rows){
  const acting = rows.filter(r => [TIER.PURSUE, TIER.PREPARE, TIER.SITUATIONAL, TIER.WATCH].includes(r.tier) && r.playRecord?.action);
  const seen = new Set();
  return acting
    .filter(r => { const k = `${r.market}/${r.play}`; if (seen.has(k)) return false; seen.add(k); return true; })
    .map(r => ({ market: r.market, play: r.play, tier: r.tier, text: r.playRecord.action.text, due: r.playRecord.action.due }))
    .sort((a, b) => (a.due === null) - (b.due === null) || String(a.due).localeCompare(String(b.due)))
    .slice(0, MAX_ACTIONS);
}

/**
 * What the home page carries: everything but the queue's own words, which only
 * /desk prints. The home page says how long the queue is and links there.
 */
/**
 * What a deep tab needs to name a duration the way the Brief does: each
 * market's build line and best design, and each route's best duration and
 * band. A few hundred bytes a market, so a dashboard carries it without the
 * rest of the briefing (guided-experience plan, PR 7).
 */
export function designProjection(briefing){
  const nameOf = (route) => {
    const label = REVENUE_ROUTE_LABEL[route] || [route, route];
    return [inSentence(label[0]), label[1]];
  };
  return {
    build: briefing.build.map(b => ({
      market: b.market, line: b.line,
      best: b.best ? { route: b.best.route, hours: b.best.hours, name: nameOf(b.best.route) } : null,
    })),
    byRoute: Object.fromEntries(Object.entries(briefing.grids || {}).map(([id, grid]) => [id, grid ? grid.byRoute : null])),
  };
}

export function homeProjection(briefing){
  const { queue, ...rest } = briefing;
  const byKind = {};
  for (const item of queue) byKind[item.kind] = (byKind[item.kind] || 0) + 1;
  const disagreements = {};
  for (const item of queue.filter(q => q.kind === 'disagreement')) disagreements[item.archetype] = (disagreements[item.archetype] || 0) + 1;
  return { ...rest, queueSummary: { total: queue.length, byKind, disagreements } };
}
