/* ---------------------------------------------------------------------------
   THE ANALYST'S QUEUE — calls that have gone stale, and what to do about each.

   The platform can say when reality has moved past a call; only the analyst
   can move the call (plan decision 8: two lists, kept apart). Every item names
   the record to change, so the fix is one change file through the analyst's
   own command line, which the app never touches.

   Kinds, in the order the desk lists them:

     overdue        a trigger's date has passed and no outcome is recorded
     disagreement   a call and the economics point opposite ways
     stale-reason   a grade's reason quotes an engine figure the engine no
                    longer gives
     rule           a data rule is within RULE_NEAR_SHARE of its line, or over it
     review         a call's or a held view's review date has passed or is near
     action         a play's next action is past its date
     soon           a trigger falls due within DUE_SOON_DAYS
     feed           a published feed is stale

   Layering: no DOM. The engine figures it compares against are handed in.
   --------------------------------------------------------------------------- */

import { overdue, isResolved } from '../governance/triggers.js';
import { DUE_SOON_DAYS, REVIEW_SOON_DAYS, RULE_NEAR_SHARE } from '../governance/briefing.js';
import { freshnessOf, FRESHNESS } from '../live/freshness.js';
import { dimension as dimensionOf } from '../governance/investability.js';
import { queueText } from './sentences.js';

const DAY = 86_400_000;
const addDays = (on, n) => new Date(Date.parse(`${on}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);
const dueOf = (expected) => (expected.length === 7 ? `${expected}-31` : expected);

export const QUEUE_ORDER = ['overdue', 'disagreement', 'stale-reason', 'rule', 'review', 'action', 'soon', 'feed'];

const fileOf = (marketId) => `view/markets/${marketId}.json`;
const dimName = (id) => dimensionOf(id)?.label?.[0]?.toLowerCase() || id;

/** Read a dotted field from a summary: "derived.spreadMean". */
const fieldOf = (summary, field) => String(field).split('.').reduce((o, k) => (o == null ? o : o[k]), summary);

/**
 * Grade reasons that quote an engine figure the engine no longer gives. Two
 * spellings are known, because two derived grades quote the engine:
 * "…on hold IRR, 4.7%" (asset return) and "10% of … revenue is secured"
 * (revenue certainty).
 */
export function staleReasons(view, engine){
  const items = [];
  const reasonOf = (d) => view.grades?.[d]?.reason?.[0] || '';
  const asset = /hold IRR, (−|-)?(\d+(?:\.\d+)?)%/.exec(reasonOf('assetReturn'));
  if (asset && engine.hold !== null){
    const quoted = Number(asset[2]) * (asset[1] ? -1 : 1);
    const now = Number((engine.hold * 100).toFixed(1));
    if (Math.abs(quoted - now) >= 0.1) items.push({ dimension: 'assetReturn', quoted: `${quoted}%`, engine: `${now}%` });
  }
  const secured = /(\d+)% of (?:first-year )?revenue is secured/.exec(reasonOf('revenueCertainty'));
  if (secured && engine.secured !== null){
    const quoted = Number(secured[1]);
    const now = Math.round(engine.secured * 100);
    if (Math.abs(quoted - now) > 1) items.push({ dimension: 'revenueCertainty', quoted: `${quoted}%`, engine: `${now}%` });
  }
  return items;
}

/**
 * The queue.
 *
 * @param views     every market view
 * @param lenses    { archetype: ordered rows, each with econ and play }
 * @param engine    marketId → { hold, secured } of the base case
 * @param summaries datasetId → published summary
 * @param catalogue the dataset catalogue (governance/datasets.js)
 */
export function buildQueue({ views, lenses, engine, summaries, catalogue, on, nowMs }){
  const items = [];
  const push = (kind, market, text, path, extra = {}) => items.push({ kind, market, text, path, ...extra });

  for (const view of views){
    const id = view.marketId;
    const triggers = view.triggers || [];

    for (const t of overdue(triggers, on)){
      push('overdue', id, queueText.overdue(id, t.label, t.expected), `${fileOf(id)} → triggers.${t.id}.outcome`, { trigger: t.id, date: t.expected });
    }
    for (const t of triggers){
      if (t.expected === null || isResolved(t)) continue;
      const due = dueOf(t.expected);
      if (due >= on && due <= addDays(on, DUE_SOON_DAYS)){
        push('soon', id, queueText.soon(id, t.label, t.expected), `${fileOf(id)} → triggers.${t.id}`, { trigger: t.id, date: t.expected });
      }
      /* A data rule near its line, or over it and not yet fired. */
      if (t.when && Array.isArray(t.effect) && t.effect.length){
        const summary = summaries[t.when.dataset];
        const observed = Number(fieldOf(summary, t.when.field));
        const line = Number(t.when.value);
        if (Number.isFinite(observed) && Number.isFinite(line) && line !== 0){
          const crossed = t.when.op === '<' ? observed < line : t.when.op === '>' ? observed > line
            : t.when.op === '<=' ? observed <= line : t.when.op === '>=' ? observed >= line : false;
          if (crossed || Math.abs(observed - line) / Math.abs(line) <= RULE_NEAR_SHARE){
            push('rule', id, queueText.ruleNear(id, t.label, observed, line, crossed), `${fileOf(id)} → triggers.${t.id}`, { trigger: t.id });
          }
        }
      }
    }

    const soon = addDays(on, REVIEW_SOON_DAYS);
    for (const [archetype, verdict] of Object.entries(view.verdicts || {})){
      if (verdict.reviewBy && verdict.reviewBy <= soon){
        push('review', id, queueText.review(id, archetype, verdict.reviewBy), `${fileOf(id)} → verdicts.${archetype}`, { archetype, date: verdict.reviewBy });
      }
    }
    for (const play of Object.values(view.plays || {})){
      for (const [archetype, call] of Object.entries(play.calls || {})){
        if (call.reviewBy && call.reviewBy <= soon){
          push('review', id, queueText.review(id, archetype, call.reviewBy, play.label), `${fileOf(id)} → plays.${play.id}`, { archetype, play: play.id, date: call.reviewBy });
        }
      }
      if (play.action?.due && play.action.due < on){
        push('action', id, queueText.actionOverdue(id, play.label, play.action.text, play.action.due), `${fileOf(id)} → plays.${play.id}`, { play: play.id, date: play.action.due });
      }
    }
    for (const [dimension, grade] of Object.entries(view.grades || {})){
      if (grade.held?.reviewBy && grade.held.reviewBy <= soon){
        push('review', id, queueText.heldReview(id, dimName(dimension), grade.held.reviewBy), `${fileOf(id)} → grades.${dimension}.held`, { dimension, date: grade.held.reviewBy });
      }
    }
    for (const stale of staleReasons(view, engine[id] || { hold: null, secured: null })){
      push('stale-reason', id, queueText.staleReason(id, dimName(stale.dimension), stale.quoted, stale.engine), `${fileOf(id)} → grades.${stale.dimension}`, { dimension: stale.dimension });
    }
  }

  for (const [archetype, rows] of Object.entries(lenses)){
    for (const row of rows){
      if (!row.flag) continue;
      push('disagreement', row.market, queueText.disagreement(row.market, archetype, row.flag, row.playRecord.label),
        `${fileOf(row.market)} → ${row.own ? `plays.${row.play}.calls.${archetype}` : `verdicts.${archetype}`}`, { archetype, play: row.play, flag: row.flag });
    }
  }

  for (const dataset of catalogue){
    const summary = summaries[dataset.id];
    if (!summary) continue;
    const fresh = freshnessOf(summary, nowMs);
    if (fresh.state === FRESHNESS.STALE) push('feed', dataset.marketId || null, queueText.staleFeed(dataset.id, fresh.label), `public/data/public/${dataset.id}.json`, { dataset: dataset.id });
  }

  /* Disagreements grouped by investor, the default one first: the rulings are made through that lens. */
  const LENS_ORDER = ['infraFund', 'strategic', 'foreignFirstTimer', 'developer'];
  const lensRank = (item) => (item.archetype ? LENS_ORDER.indexOf(item.archetype) : 0);
  return items.sort((a, b) => QUEUE_ORDER.indexOf(a.kind) - QUEUE_ORDER.indexOf(b.kind)
    || lensRank(a) - lensRank(b)
    || String(a.date || '').localeCompare(String(b.date || '')) || String(a.market).localeCompare(String(b.market)));
}
