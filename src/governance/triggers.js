/* ---------------------------------------------------------------------------
   TRIGGERS — a dated or measurable event that would move a verdict or a grade.

   The platform already knew about these. Nine of them were written as prose
   inside decisionProfiles.js — a grant call closing, an auction date, a
   long-stop — where nothing could list them, sort them or act on them. A
   knowledge base records that an event is coming. A decision tool has to be
   able to say WHICH call it would change, and when to look again.

   So a trigger is a record, not a sentence:

       what       the event, in one bilingual line
       when       expected, to the month — a day where one is published
       watches    the dimensions it would move
       direction  which way the grade would go, as the scale reads (up = more
                  open to a new entrant, see investability.js)
       source     where the date came from

   Triggers feed three things: the "changes if" line under a verdict, a
   cross-market calendar, and the rules engine.

   A TRIGGER WITH AN `effect` IS A RULE — the analyst's judgement, exercised in
   advance (plan §7.3). The effect is a change he wrote before the event; the
   rules engine applies it when the trigger's `when` is met by a published
   snapshot, and it applies exactly that and nothing else. `effect: null` is
   still the norm: most triggers are a date to look again, not a rule.

   An effect names FIELDS, and only a few of them: a grade's number, its trend
   and the trend's cause; a verdict's call, its review date and its triggers.
   There is no spelling of an effect that reaches a held view, a pin, a grade's
   basis or evidence, the thesis, another trigger, or anything in methodology.
   Who may WRITE a trigger that carries an effect is the view schema's
   business: the analyst, and nobody else.

   Layering: imports the grade and verdict vocabulary and nothing else. No DOM,
   no market module, no ETL code.
   --------------------------------------------------------------------------- */

import { DIMENSION_IDS, ARCHETYPE_IDS, TREND, VERDICT, VERDICT_IDS } from './investability.js';

/**
 * EVENT: something happens on a date — an act passes, an auction runs. No feed
 * reports it; somebody has to establish that it happened.
 * DATA:  a published series crosses a line. A snapshot can be tested for it.
 */
export const TRIGGER_KIND = { EVENT: 'event', DATA: 'data' };

/** Which way the watched grade would move if the trigger lands as expected. */
export const TRIGGER_DIRECTION = { UP: 'up', DOWN: 'down', EITHER: 'either' };

export const TRIGGER_DIRECTION_LABEL = {
  up:     ['Would open the market further', '将使市场更为开放'],
  down:   ['Would close it further', '将使市场进一步收紧'],
  either: ['Outcome decides the direction', '方向取决于结果'],
};

/**
 * A trigger migrated out of decisionProfiles.js cites that record, whose own
 * `sources` list stands behind the date. It is a weaker citation than a
 * source-register key and is named so it can be found and replaced.
 */
export const SOURCE_DECISION_PROFILE = 'decision-profile';

/** How a source that is not in a market's register was reached. */
export const ACCESS = { OPENED: 'opened', SEARCH_SUMMARY: 'search-summary' };

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/* YYYY-MM or YYYY-MM-DD, and a real one. */
const isWhen = (v) => {
  if (typeof v !== 'string') return false;
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(v);
  if (!m) return false;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return false;
  if (!m[3]) return true;
  const t = Date.parse(`${v}T00:00:00Z`);
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === v;
};

/**
 * A source is a key in the market's own source register, the decision-profile
 * marker, or — for something no register holds yet — a located page with an
 * honest statement of how it was reached. A search summary is not evidence
 * under the claim pilot's rule; it is recorded so a person knows what to open.
 */
export function sourceProblems(source){
  if (typeof source === 'string') return source.trim() ? [] : ['source is empty'];
  if (!source || typeof source !== 'object') return ['source must be a register key or a located page'];
  const problems = [];
  if (typeof source.publisher !== 'string' || !source.publisher.trim()) problems.push('source.publisher is missing');
  if (typeof source.url !== 'string' || !/^https:\/\//.test(source.url)) problems.push('source.url must be an https link');
  if (!Object.values(ACCESS).includes(source.access)) problems.push(`source.access must be one of ${Object.values(ACCESS).join(', ')}`);
  return problems;
}

/* A real calendar day, written YYYY-MM-DD. */
const isDay = (v) => isWhen(v) && v.length === 10;

/* ---------------------------------------------------------------------------
   WHEN — the test a `data` trigger puts to a published snapshot.

       { dataset, field, op, value, guard: [{ field, op, value }], basis }

   `field` is a dotted path into the dataset's published SUMMARY, the same
   file the site loads. `guard` is every condition that must hold before the
   test means anything — enough days in the window, typically. `basis` says in
   words where the number came from, because a threshold nobody can derive is a
   threshold nobody can challenge.
   --------------------------------------------------------------------------- */

export const WHEN_OPS = ['<', '<=', '>', '>='];

const FIELD_PATH = /^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)*$/;

function conditionProblems(c, what){
  const problems = [];
  if (!c || typeof c !== 'object' || Array.isArray(c)) return [`${what} must be an object`];
  if (typeof c.field !== 'string' || !FIELD_PATH.test(c.field)) problems.push(`${what}.field must be a dotted path into the published summary`);
  if (!WHEN_OPS.includes(c.op)) problems.push(`${what}.op must be one of ${WHEN_OPS.join(' ')}`);
  if (typeof c.value !== 'number' || !Number.isFinite(c.value)) problems.push(`${what}.value must be a finite number`);
  return problems;
}

/** Problems with a `when`. Empty array means valid. */
export function whenProblems(when){
  if (!when || typeof when !== 'object' || Array.isArray(when)) return ['when must be an object'];
  const problems = conditionProblems(when, 'when');
  if (typeof when.dataset !== 'string' || !/^[a-z0-9-]+$/.test(when.dataset)) problems.push('when.dataset must be a dataset id');
  if (when.guard !== undefined){
    if (!Array.isArray(when.guard)) problems.push('when.guard must be an array of conditions');
    else when.guard.forEach((g, i) => problems.push(...conditionProblems(g, `when.guard[${i}]`)));
  }
  if (!isPair(when.basis)) problems.push('when.basis must be an [en, zh] pair saying where the threshold comes from');
  for (const key of Object.keys(when)){
    if (!['dataset', 'field', 'op', 'value', 'guard', 'basis'].includes(key)) problems.push(`when.${key} is not a field of a when`);
  }
  return problems;
}

/** The value at a dotted path, or undefined. */
export function readField(object, field){
  let at = object;
  for (const key of String(field).split('.')){
    if (at === null || typeof at !== 'object') return undefined;
    at = at[key];
  }
  return at;
}

const holds = (op, a, b) => op === '<' ? a < b : op === '<=' ? a <= b : op === '>' ? a > b : a >= b;

/**
 * Put a `when` to a published summary.
 *
 * Returns what was read as well as the answer, so a report can show the
 * number and not only the verdict on it. A field that is missing or not a
 * number is `met: false` with the reason — never a pass, and never a zero.
 */
export function testWhen(when, summary){
  const check = (c) => {
    const observed = readField(summary, c.field);
    const usable = typeof observed === 'number' && Number.isFinite(observed);
    return { field: c.field, op: c.op, value: c.value, observed: usable ? observed : null, ok: usable && holds(c.op, observed, c.value) };
  };
  const guards = (when.guard || []).map(check);
  const main = check(when);
  const blocked = guards.find(g => !g.ok);
  return {
    met: !blocked && main.ok,
    observed: main.observed,
    guards,
    why: main.observed === null ? `${when.field} is not a number in the published summary`
      : blocked ? `guard ${blocked.field} ${blocked.op} ${blocked.value} not met (${blocked.observed ?? 'missing'})`
      : main.ok ? null : `${when.field} is ${main.observed}, not ${when.op} ${when.value}`,
  };
}

/* ---------------------------------------------------------------------------
   EFFECT — the change a rule applies, written in advance by the analyst.

       [ { path: 'grades.<dimension>.<field>',  to: … },
         { path: 'verdicts.<archetype>.<field>', to: … } ]

   The fields are listed, and the list is short on purpose.
   --------------------------------------------------------------------------- */

export const EFFECT_FIELDS = {
  grades: ['grade', 'trend', 'trendCause'],
  verdicts: ['call', 'reviewBy', 'changesIf'],
};

/** { section, key, field } for an effect path, or null. Null is how everything else fails. */
export function parseEffectPath(path){
  const m = /^(grades|verdicts)\.([A-Za-z0-9_-]+)\.([A-Za-z]+)$/.exec(typeof path === 'string' ? path : '');
  if (!m) return null;
  const [, section, key, field] = m;
  if (!EFFECT_FIELDS[section].includes(field)) return null;
  if (!(section === 'grades' ? DIMENSION_IDS : ARCHETYPE_IDS).includes(key)) return null;
  return { section, key, field };
}

const EFFECT_VALUE = {
  grade: (v) => Number.isInteger(v) && v >= 1 && v <= 5 ? null : 'a grade is a whole number from 1 to 5',
  trend: (v) => TREND.includes(v) ? null : `a trend is one of ${TREND.join(', ')}`,
  trendCause: (v) => v === null || isPair(v) ? null : 'a trend cause is null or an [en, zh] pair',
  /* NOT_ACCESSIBLE is a knock-out's reading, not a call a rule can make. */
  call: (v) => VERDICT_IDS.includes(v) && v !== VERDICT.NOT_ACCESSIBLE ? null
    : `a rule's call is one of ${VERDICT_IDS.filter(id => id !== VERDICT.NOT_ACCESSIBLE).join(', ')}`,
  reviewBy: (v) => v === null || isDay(v) ? null : 'a review date is null or YYYY-MM-DD',
  changesIf: (v) => Array.isArray(v) && v.every(id => typeof id === 'string' && id.trim()) ? null : 'changesIf is an array of trigger ids',
};

/** Problems with an effect. Empty array means valid. */
export function effectProblems(effect){
  if (!Array.isArray(effect) || !effect.length) return ['effect must be null or a non-empty array of field changes'];
  const problems = [];
  const seen = new Set();
  effect.forEach((step, i) => {
    const where = parseEffectPath(step?.path);
    if (!where){
      problems.push(`effect[${i}]: "${step?.path}" is not a field a rule may change — only ${Object.entries(EFFECT_FIELDS).map(([s, f]) => `${s}.<id>.{${f.join(', ')}}`).join(' and ')}`);
      return;
    }
    if (seen.has(step.path)) problems.push(`effect[${i}]: ${step.path} appears twice`);
    seen.add(step.path);
    if (!('to' in step)) problems.push(`effect[${i}]: ${step.path} states no new value`);
    else {
      const wrong = EFFECT_VALUE[where.field](step.to);
      if (wrong) problems.push(`effect[${i}]: ${step.path} — ${wrong}`);
    }
    for (const key of Object.keys(step)) if (key !== 'path' && key !== 'to') problems.push(`effect[${i}]: "${key}" is not a field of an effect step`);
  });
  return problems;
}

/** True when a trigger is a rule: it carries a change that applies itself. */
export const isRule = (trigger) => Array.isArray(trigger?.effect) && trigger.effect.length > 0;

/** Problems with one trigger. Empty array means valid. */
export function validateTrigger(trigger){
  if (!trigger || typeof trigger !== 'object') return ['trigger is missing'];
  const problems = [];
  const at = (m) => problems.push(`${trigger.id || '?'}: ${m}`);

  if (typeof trigger.id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)+$/.test(trigger.id)) at('id must be a kebab-case slug');
  if (typeof trigger.market !== 'string' || !trigger.market) at('market is missing');
  if (!Object.values(TRIGGER_KIND).includes(trigger.kind)) at(`kind must be one of ${Object.values(TRIGGER_KIND).join(', ')}`);
  if (!isPair(trigger.label)) at('label must be an [en, zh] pair saying what the event is');
  /* Null is allowed and means "announced, undated". An event with no date is
     still worth listing; an invented date is not. */
  if (trigger.expected !== null && !isWhen(trigger.expected)) at('expected must be null, YYYY-MM or YYYY-MM-DD');

  if (!Array.isArray(trigger.watches) || !trigger.watches.length) at('watches must name at least one dimension');
  else for (const d of trigger.watches) if (!DIMENSION_IDS.includes(d)) at(`watches an unknown dimension "${d}"`);

  if (!Object.values(TRIGGER_DIRECTION).includes(trigger.direction)) at(`direction must be one of ${Object.values(TRIGGER_DIRECTION).join(', ')}`);
  for (const p of sourceProblems(trigger.source)) at(p);

  /* A data trigger says what it tests. An event has no feed, so it has no
     `when`: somebody establishes that it happened. */
  if (trigger.kind === TRIGGER_KIND.DATA){
    if (trigger.when === undefined || trigger.when === null) at('a data trigger states its `when` — the dataset, the field and the line it crosses');
    else for (const p of whenProblems(trigger.when)) at(p);
  } else if (trigger.when !== undefined && trigger.when !== null){
    at('only a data trigger carries a `when`');
  }

  if (trigger.effect === undefined) at('effect must be null or a list of field changes');
  else if (trigger.effect !== null){
    for (const p of effectProblems(trigger.effect)) at(p);
    /* The note is the reason the changelog will give when the rule fires. It
       is written now, with the effect, by the person whose judgement it is. */
    if (!isPair(trigger.note)) at('a trigger with an effect carries a note as an [en, zh] pair — the reason recorded when it fires');
  }
  if (trigger.note !== undefined && trigger.note !== null && !isPair(trigger.note)) at('note must be an [en, zh] pair');

  /* Optional. What happened, and on which day. A trigger whose date passes is
     overdue until somebody records its outcome; the outcome closes it. The
     day must be a real day, because "it happened" is a dated fact. */
  if (trigger.outcome !== undefined && trigger.outcome !== null){
    const o = trigger.outcome;
    if (typeof o !== 'object' || Array.isArray(o)) at('outcome must be null or { on, text }');
    else {
      if (typeof o.on !== 'string' || o.on.length !== 10 || !isWhen(o.on)) at('outcome.on must be the YYYY-MM-DD day it happened');
      if (!isPair(o.text)) at('outcome.text must be an [en, zh] pair saying what happened');
      for (const key of Object.keys(o)) if (key !== 'on' && key !== 'text') at(`"outcome.${key}" is not a field of an outcome`);
    }
  }
  return problems;
}

/** True once the analyst has recorded what happened. A resolved trigger is never overdue. */
export const isResolved = (trigger) => Boolean(trigger?.outcome && typeof trigger.outcome === 'object');

/* Month-precision dates sort at the END of their month: "by end of 2026-12"
   should not appear ahead of something dated the 3rd. Undated sorts last. */
const sortKey = (when) => when === null ? '9999-12-31' : (when.length === 7 ? `${when}-31` : when);

/** Triggers in the order they are expected, soonest first, undated last. */
export function byExpected(triggers){
  return [...triggers].sort((a, b) => sortKey(a.expected).localeCompare(sortKey(b.expected)) || a.id.localeCompare(b.id));
}

/** Triggers that would move a given dimension. */
export function triggersWatching(triggers, dimensionId){
  return triggers.filter(t => t.watches.includes(dimensionId));
}

/**
 * Triggers whose expected date has passed as of `today` (YYYY-MM-DD) and whose
 * outcome nobody has recorded. A month-precision date is overdue only once its
 * month has ended. These are the ones somebody has to go and look at.
 */
export function overdue(triggers, today){
  return byExpected(triggers).filter(t => t.expected !== null && !isResolved(t) && sortKey(t.expected) < today);
}
