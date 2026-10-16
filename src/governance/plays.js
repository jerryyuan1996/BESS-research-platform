/* ---------------------------------------------------------------------------
   PLAYS — what an investor would actually commit to in a market.

   A verdict says whether an investor should enter a market and by which entry
   stage. It does not say what to build: which revenue route, at how many
   hours. The guided-experience plan (approved 2026-10-16) makes that the unit
   of opportunity:

       play = market × revenue route × duration × entry stage

   e.g. Italy · capacity market · 4h · ready-to-build. A market holds one to
   three. They live in the view store, in the `plays` section of a market's
   file, because a play is judgement: the analyst chooses which designs are
   worth an investor's attention. The economics of a play are never stored
   here. They are the engine's, worked out at render from the route and the
   hours (src/comparison/designFit.js), so a play cannot quote a stale number.

   This section replaces the `design` section the duration plan approved and
   never built (docs/duration-and-route-fit-plan.md §4.4): a house design is a
   play's route and hours. The trend and cause that plan gives a design attach
   to plays when its Part D is built.

   A PLAY INHERITS THE MARKET'S CALL. A verdict may name the play it is about
   (`verdicts.<archetype>.play`). A play may also carry its OWN call for an
   archetype, in the same record shape as a verdict, where the analyst's call
   on that design differs from the market's: Italy's MACSE play is
   opportunistic for the fund while the market's call, on the capacity-market
   play, is enter now. A play never carries a call for an archetype whose
   market verdict already names it — that would be two calls on one design.

   WHO WRITES IT. The analyst only, for now (plan decision 2). A rule and the
   agent have no rights on this section; view/schema/view.mjs says so in
   AUTHOR_RIGHTS, and a missing row is a closed door.

   Layering: no DOM. Imported by the view schema, which the writer, the ETL's
   rules engine and the tests all use.
   --------------------------------------------------------------------------- */

import {
  ARCHETYPE_IDS, ROUTE, PLAY_ID_PATTERN, validateVerdict, checkStamp, isDay,
} from './investability.js';

/**
 * The revenue routes a play may be built on: the engine's route ids
 * (src/comparison/strategies.js). Named here as vocabulary so the schema need
 * not import the engine; tests/view.test.js asserts the two lists agree.
 */
export const REVENUE_ROUTES = ['cap', 'mer', 'toll', 'ltda'];

/** Generic names. A play's own label carries the market's name for the route. */
export const REVENUE_ROUTE_LABEL = {
  cap:  ['Capacity contract', '容量合同'],
  mer:  ['Merchant', '纯市场化'],
  toll: ['Toll or floor', '租赁或保底'],
  ltda: ['Long-term auction award', '长期拍卖中标合同'],
};

/** No battery here is longer than a day; a bigger number is a typo for MWh. */
export const MAX_PLAY_HOURS = 24;

/** The fields a play record may hold. Anything else is refused, so the shape cannot drift. */
export const PLAY_FIELDS = ['id', 'label', 'route', 'hours', 'stage', 'why', 'action', 'calls', 'author', 'asOf', 'lockedUntil'];

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/**
 * Problems with one play record, filed under `key`. Empty array means valid.
 *
 * What this cannot check, because it needs the market: that the route is one
 * the market supports and the hours are on its duration grid. The tests
 * check that for every committed play, against the registry.
 */
export function validatePlay(record, key){
  if (!record || typeof record !== 'object' || Array.isArray(record)) return [`${key}: play record is missing`];
  const problems = [];
  const at = (m) => problems.push(`${key}: ${m}`);

  for (const field of Object.keys(record)){
    if (!PLAY_FIELDS.includes(field)) at(`"${field}" is not a field of a play`);
  }
  if (typeof record.id !== 'string' || !PLAY_ID_PATTERN.test(record.id)) at('id must be a kebab-case slug of two parts or more');
  else if (record.id !== key) at(`is filed under "${key}" but its id is "${record.id}"`);
  if (!isPair(record.label)) at('label must be an [en, zh] pair naming route, hours and stage');
  if (!REVENUE_ROUTES.includes(record.route)) at(`route must be one of ${REVENUE_ROUTES.join(', ')}`);
  if (typeof record.hours !== 'number' || !Number.isFinite(record.hours) || record.hours <= 0 || record.hours > MAX_PLAY_HOURS){
    at(`hours must be a number above 0 and at most ${MAX_PLAY_HOURS}`);
  }
  if (!ROUTE.includes(record.stage)) at(`stage must be one of ${ROUTE.join(', ')}`);
  if (!isPair(record.why)) at('why must be an [en, zh] pair — one line on why this design');

  const action = record.action;
  if (!action || typeof action !== 'object' || Array.isArray(action)) at('action must be { text, due }');
  else {
    if (!isPair(action.text)) at('action.text must be an [en, zh] pair — the concrete next step');
    if (action.due !== null && !isDay(action.due)) at('action.due must be null or a YYYY-MM-DD date');
    for (const field of Object.keys(action)) if (field !== 'text' && field !== 'due') at(`"action.${field}" is not a field of an action`);
  }

  if (record.calls !== undefined){
    if (!record.calls || typeof record.calls !== 'object' || Array.isArray(record.calls)) at('calls must be an object keyed by archetype');
    else for (const [archetype, call] of Object.entries(record.calls)){
      if (!ARCHETYPE_IDS.includes(archetype)){ at(`calls holds an unknown archetype "${archetype}"`); continue; }
      if (call?.archetype !== archetype) at(`calls.${archetype} holds a record for "${call?.archetype}"`);
      for (const p of validateVerdict(call)) at(`calls.${p}`);
      if (call && 'play' in call) at(`calls.${archetype}: a play's own call does not point at a play — it is the play's`);
      if (call && call.route !== record.stage) at(`calls.${archetype}: enters by "${call.route}", but the play's stage is "${record.stage}"`);
    }
  }

  checkStamp(record, at);
  return problems;
}

/** The plays of a view, in id order. A view with no plays section has none. */
export function playsOf(view){
  return Object.values(view?.plays || {}).sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * The call a play carries for an archetype: its own, or the market's verdict
 * when that verdict names this play, or — for a play nobody names — the
 * market's verdict as inherited. `own` says which.
 */
export function playCall(view, play, archetype){
  const ownCall = play?.calls?.[archetype];
  if (ownCall) return { verdict: ownCall, own: true };
  const market = view?.verdicts?.[archetype] || null;
  return market ? { verdict: market, own: false } : null;
}
