/* ---------------------------------------------------------------------------
   WHAT CHANGED — the dated items "since your last visit" is cut from.

   Four sources, each dated, each classed (governance/briefing.js CHANGE_CLASS):

     the changelog   a call, a way in, a play or a catalyst moved — but not the
                     view being written for the first time (before SETUP_UNTIL),
                     and not a grade's number or reasons, which are how a call is
                     argued and stay on /changes
     the calendar    a trigger whose date has passed with no outcome recorded
     the price feeds a week's daily spread departing from its 90-day mean
     the news feed   a headline tagged to a market (governance/newsTags.js)

   The briefing carries the last CHANGE_WINDOW_DAYS of them, newest first; the
   page cuts them again at the reader's last visit.

   Layering: no DOM, no engine.
   --------------------------------------------------------------------------- */

import {
  CHANGE_CLASS, SETUP_UNTIL, CHANGE_WINDOW_DAYS, DATA_MOVE_SHARE, DATA_SHORT_DAYS, DATA_LONG_DAYS,
} from '../governance/briefing.js';
import { tagHeadline } from '../governance/newsTags.js';
import { isResolved } from '../governance/triggers.js';
import { changeText } from './sentences.js';
import { playTitle } from '../governance/playTitle.js';

const DAY = 86_400_000;
const dayOf = (iso) => String(iso).slice(0, 10);

/** Months end where they end, so "2026-11" passes on 1 December. */
const passedOn = (expected) => (expected.length === 7 ? `${expected}-31` : expected);

/**
 * The briefing's reading of one changelog line, or null when it is evidence,
 * bookkeeping or the first writing of the view.
 */
export function classifyEntry(entry, { playLabel = null } = {}){
  if (!entry || dayOf(entry.at) < SETUP_UNTIL) return null;
  if (entry.tier === 'scout') return null;
  const [section, key] = String(entry.path).split('.');
  const { from, to, market } = entry;
  const item = (cls, text, extra = {}) => ({ at: entry.at, cls, market, text, source: 'changelog', id: entry.id, ...extra });

  if (section === 'verdicts' && key && !entry.path.endsWith('.held')){
    if (!from && to) return item(CHANGE_CLASS.CALL, changeText.callNew(market, key, to.call), { archetype: key });
    if (from && !to) return item(CHANGE_CLASS.CALL, changeText.callWithdrawn(market, key), { archetype: key });
    if (from.call !== to.call) return item(CHANGE_CLASS.CALL, changeText.callMoved(market, key, from.call, to.call), { archetype: key });
    if (from.route !== to.route) return item(CHANGE_CLASS.CALL, changeText.wayIn(market, key, from.route, to.route), { archetype: key });
    /* Naming a play for the first time is bookkeeping; moving to another one is a call. */
    if (from.play && to.play && from.play !== to.play) return item(CHANGE_CLASS.CALL, changeText.playSwitched(market, key, playLabel?.(market, to.play) || [to.play, to.play]), { archetype: key, play: to.play });
    return null;
  }
  if (section === 'plays' && key){
    if (!from && to) return item(CHANGE_CLASS.VIEW, changeText.playAdded(market, to.label), { play: key });
    if (from && !to) return item(CHANGE_CLASS.CALL, changeText.playDropped(market, from.label), { play: key });
    if (from.route !== to.route || from.hours !== to.hours || from.stage !== to.stage){
      return item(CHANGE_CLASS.CALL, changeText.playRedesigned(market, from.label, to.label), { play: key });
    }
    for (const archetype of new Set([...Object.keys(from.calls || {}), ...Object.keys(to.calls || {})])){
      const a = from.calls?.[archetype]?.call, b = to.calls?.[archetype]?.call;
      if (a !== b){
        if (!b) return item(CHANGE_CLASS.CALL, changeText.callWithdrawn(market, archetype), { archetype, play: key });
        return item(CHANGE_CLASS.CALL, a ? changeText.callMoved(market, archetype, a, b) : changeText.callNew(market, archetype, b), { archetype, play: key });
      }
    }
    if (JSON.stringify(from.why) !== JSON.stringify(to.why) || JSON.stringify(from.action) !== JSON.stringify(to.action)){
      return item(CHANGE_CLASS.VIEW, changeText.playAdded(market, to.label), { play: key, rewritten: true });
    }
    return null;
  }
  if (section === 'thesis') return to ? item(CHANGE_CLASS.VIEW, changeText.thesis(market)) : null;
  if (section === 'triggers' && key){
    if (!from && to) return item(CHANGE_CLASS.CATALYST, changeText.catalystAdded(market, to.label, to.expected), { trigger: key });
    if (from && !to) return item(CHANGE_CLASS.CATALYST, changeText.catalystDropped(market, from.label), { trigger: key });
    if (!from.outcome && to.outcome) return item(CHANGE_CLASS.CATALYST, changeText.catalystHappened(market, to.label, to.outcome.text), { trigger: key });
    if (from.expected !== to.expected) return item(CHANGE_CLASS.CATALYST, changeText.catalystMoved(market, to.label, to.expected), { trigger: key });
    return null;
  }
  return null;
}

/** Triggers whose date passed inside the window and whose outcome nobody has recorded. */
export function passedTriggers(views, on, windowDays = CHANGE_WINDOW_DAYS){
  const since = new Date(Date.parse(`${on}T00:00:00Z`) - windowDays * DAY).toISOString().slice(0, 10);
  const items = [];
  for (const view of views){
    for (const t of view.triggers || []){
      if (t.expected === null || isResolved(t)) continue;
      const due = passedOn(t.expected);
      if (due >= on || due < since) continue;
      items.push({
        at: `${due}T00:00:00.000Z`, cls: CHANGE_CLASS.CATALYST, market: view.marketId, source: 'calendar', trigger: t.id,
        text: changeText.catalystDue(view.marketId, t.label, t.expected),
      });
    }
  }
  return items;
}

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

/**
 * A price series that moved: the mean daily spread over the last
 * DATA_SHORT_DAYS against the DATA_LONG_DAYS before them. Days with no spread
 * (a part day) are skipped.
 */
export function spreadMove(summary, marketId){
  const days = (summary?.daily || []).filter(d => typeof d.spread === 'number' && Number.isFinite(d.spread));
  if (days.length < DATA_SHORT_DAYS + 30) return null;
  const recent = days.slice(-DATA_SHORT_DAYS);
  const prior = days.slice(-(DATA_SHORT_DAYS + DATA_LONG_DAYS), -DATA_SHORT_DAYS);
  const a = mean(recent.map(d => d.spread)), b = mean(prior.map(d => d.spread));
  if (!(b > 0)) return null;
  const share = a / b - 1;
  if (Math.abs(share) < DATA_MOVE_SHARE) return null;
  const unit = summary.units?.price || '';
  const lastDay = recent[recent.length - 1].d;
  const fmt = (x) => (x >= 100 ? Math.round(x).toLocaleString('en-US') : x.toFixed(1));
  return {
    at: `${lastDay}T00:00:00.000Z`, cls: CHANGE_CLASS.DATA, market: marketId, source: 'feed', dataset: summary.datasetId,
    share: Number(share.toFixed(3)),
    text: changeText.spreadMoved(marketId, share, fmt(a), fmt(b), unit, lastDay),
  };
}

/** Headlines tagged to a market, inside the window. Untagged headlines reach no briefing. */
export function taggedNews(news, on, windowDays = CHANGE_WINDOW_DAYS){
  const since = Date.parse(`${on}T00:00:00Z`) - windowDays * DAY;
  const items = news?.series || news?.items || [];
  return items
    .filter(item => Date.parse(item.t) >= since)
    .map(item => ({ item, markets: tagHeadline(item) }))
    .filter(x => x.markets.length)
    .map(({ item, markets }) => ({
      at: new Date(Date.parse(item.t)).toISOString(), cls: CHANGE_CLASS.NEWS, markets, market: markets[0],
      source: 'news', title: item.title, url: item.url, publisher: item.source, category: item.category ?? null,
    }))
    .sort((a, b) => b.at.localeCompare(a.at));
}

/** Every change inside the window, newest first. */
export function collectChanges({ changelog, views, feeds, news, on }){
  const since = new Date(Date.parse(`${on}T00:00:00Z`) - CHANGE_WINDOW_DAYS * DAY).toISOString();
  const labels = new Map(views.flatMap(v => Object.values(v.plays || {}).map(p => [`${v.marketId}/${p.id}`, playTitle(p)])));
  const playLabel = (market, id) => labels.get(`${market}/${id}`) || null;
  const fromLog = changelog.map(e => classifyEntry(e, { playLabel })).filter(Boolean).filter(c => c.at >= since);
  const fromFeeds = Object.entries(feeds || {}).map(([marketId, summary]) => spreadMove(summary, marketId)).filter(Boolean).filter(c => c.at >= since);
  return [...fromLog, ...passedTriggers(views, on), ...fromFeeds, ...taggedNews(news, on)]
    .sort((a, b) => b.at.localeCompare(a.at));
}
