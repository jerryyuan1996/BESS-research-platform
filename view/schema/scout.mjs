/* ---------------------------------------------------------------------------
   SCOUT CARDS — the schema, and who may write what on one.

   view/scout/<id>.json holds one scout market's card: sourced facts, a grade
   on each dimension a public page can speak to, a verdict for each investor,
   the triggers those verdicts wait on, and a return signal or nothing.
   view/scout/passes.jsonl holds one line per live scout run.

   A CARD IS NOT A MARKET VIEW, AND THE TWO DO NOT SHARE A RIGHTS TABLE. The
   agent is a live author here and nowhere else, so everything that decides
   what it may write on a card is in this file and nothing in view.mjs was
   widened to make room: AUTHOR_RIGHTS, LIVE_AUTHORS, parsePath and
   machineProblems there still describe core markets, value for value.

   WHICH TIER A CHANGE BELONGS TO IS DECIDED BY ITS ID, never by the caller.
   An id in the roster (src/governance/scout.js) is a card; any other id is a
   market. The two sets are disjoint by test, so no flag on a change can route
   a core market through the rights below.

   WHAT A CARD CANNOT HOLD:

     · a return. No numeric return field exists, the two Return dimensions do
       not parse, and no text on a card may name a modelled return.
     · a held view or a pin written by a machine. There is no held layer on a
       card at all.
     · a rule. A trigger with an effect is refused for every author.
     · its own name, region or source list. Those are in src/.

   This module is the schema: the writer and the tests both use it.
   --------------------------------------------------------------------------- */

import {
  ARCHETYPE_IDS, BASIS, VERDICT, validateGrade, validateVerdict,
} from '../../src/governance/investability.js';
import { validateTrigger, isRule } from '../../src/governance/triggers.js';
import { ARCHETYPES, KNOCK_OUT, knockOuts } from '../../src/governance/archetypes.js';
import {
  AGENT_MAX_GRADE_STEP, VERDICT_SCALE, MAX_QUOTE_CHARS, EVIDENCE_CLASS, MAX_MACHINE_CHANGES_PER_RUN,
} from '../../src/governance/automation.js';
import {
  isScoutId, SCOUT_DIMENSION_IDS, MAX_SCOUT_FACTS, RETURN_SIGNAL_KINDS, RETURN_WORDS, REVENUE_RATE,
  SCOUT_FIRST_CALLS, SCOUT_KNOCKED_OUT_CALLS, SCOUT_EXTREME_GRADES, MAX_SCOUT_CARDS_PER_RUN,
  SCOUT_REVIEW_MIN_DAYS, GRADUATION, ADMITTED_TERMS, SCOUT_REGION_IDS, scoutIdsIn,
} from '../../src/governance/scout.js';
import { scoutSources } from '../../src/scout/sources.js';
import { AUTHOR_RIGHTS, evidenceProblems, verdictEvidenceSuffices } from './view.mjs';

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);
const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(`${v}T00:00:00Z`));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** The sections of a card. Anything else is not card content. */
export const SCOUT_SECTIONS = ['facts', 'grades', 'verdicts', 'triggers', 'returnSignal', 'checked'];

/** A card with nothing on it yet. */
export function emptyCard(id){
  return { id, tier: 'scout', facts: [], grades: {}, verdicts: {}, triggers: [], returnSignal: null, checked: null };
}

/** True when a card holds nothing: the state the page calls "no card written yet". */
export const cardIsEmpty = (card) => !card || same(card, emptyCard(card.id));

/* ---- paths ------------------------------------------------------------------ */

/**
 * Where a change to a card may land:
 *
 *     grades.<dimension>   verdicts.<archetype>   triggers.<id>
 *     facts                returnSignal           checked
 *
 * Whole records, as in the market store. `facts` is the whole list. `checked`
 * is the analyst's record that he spot-checked the card.
 *
 * Twelve dimensions, not fourteen: the two in the Return pillar do not parse.
 * Nor does `.held`, or any spelling of methodology. Returns { section, key }
 * or null.
 */
export function parseScoutPath(path){
  if (path === 'facts' || path === 'returnSignal' || path === 'checked') return { section: path, key: null, layer: null };
  const m = /^(grades|verdicts|triggers)\.([A-Za-z0-9_-]+)$/.exec(typeof path === 'string' ? path : '');
  if (!m) return null;
  const [, section, key] = m;
  if (section === 'grades' && !SCOUT_DIMENSION_IDS.includes(key)) return null;
  if (section === 'verdicts' && !ARCHETYPE_IDS.includes(key)) return null;
  return { section, key, layer: null };
}

/** The value at a path, or null when nothing is there. */
export function readScoutPath(card, path){
  const where = parseScoutPath(path);
  if (!where) return null;
  if (where.section === 'facts') return card.facts.length ? card.facts : null;
  if (where.section === 'returnSignal' || where.section === 'checked') return card[where.section] ?? null;
  if (where.section === 'triggers') return card.triggers.find(t => t.id === where.key) ?? null;
  return card[where.section][where.key] ?? null;
}

/** A copy of the card with the path set, or cleared when `to` is null. */
export function writeScoutPath(card, path, to){
  const where = parseScoutPath(path);
  if (!where) throw new Error(`"${path}" is not a path on a scout card`);
  const next = structuredClone(card);
  if (where.section === 'facts') next.facts = to ?? [];
  else if (where.section === 'returnSignal' || where.section === 'checked') next[where.section] = to;
  else if (where.section === 'triggers'){
    next.triggers = next.triggers.filter(t => t.id !== where.key);
    if (to !== null) next.triggers.push(to);
    next.triggers.sort((a, b) => a.id.localeCompare(b.id));
  }
  else if (to === null) delete next[where.section][where.key];
  else next[where.section][where.key] = to;
  return next;
}

/* ---- the card as a whole ------------------------------------------------------ */

/** A quotation on a card: enough to open the page and find the words. */
function quotationProblems(records, where){
  if (!Array.isArray(records) || !records.length) return [`${where}: carries at least one quotation with its source`];
  const problems = [];
  records.forEach((e, i) => {
    if (!e || typeof e !== 'object'){ problems.push(`${where}: evidence[${i}] must be an object`); return; }
    if (typeof e.publisher !== 'string' || !e.publisher.trim()) problems.push(`${where}: evidence[${i}] has no publisher`);
    if (typeof e.url !== 'string' || !/^https:\/\//.test(e.url)) problems.push(`${where}: evidence[${i}].url must be an https link`);
    if (typeof e.quote !== 'string' || !e.quote.trim()) problems.push(`${where}: evidence[${i}] has no quotation`);
    else if (e.quote.length > MAX_QUOTE_CHARS) problems.push(`${where}: evidence[${i}] quotes ${e.quote.length} characters — at most ${MAX_QUOTE_CHARS}`);
  });
  return problems;
}

/* Every string a reader of the card would see, with where it sits. */
function cardText(card){
  const out = [];
  const add = (where, value) => {
    if (typeof value === 'string') out.push({ where, text: value });
    else if (Array.isArray(value)) value.forEach(v => add(where, v));
    else if (value && typeof value === 'object') Object.values(value).forEach(v => add(where, v));
  };
  (Array.isArray(card.facts) ? card.facts : []).forEach((f, i) => { add(`facts[${i}]`, f?.text); add(`facts[${i}]`, (f?.evidence || []).map(e => e?.quote)); });
  for (const [id, g] of Object.entries(card.grades || {})){ add(`grades.${id}`, g?.reason); add(`grades.${id}`, g?.trendCause); }
  for (const [id, v] of Object.entries(card.verdicts || {})){ add(`verdicts.${id}`, v?.because); add(`verdicts.${id}`, v?.despite); add(`verdicts.${id}`, v?.where); add(`verdicts.${id}`, v?.scoreNote); }
  for (const t of Array.isArray(card.triggers) ? card.triggers : []) add(`triggers.${t?.id}`, t?.label);
  if (card.returnSignal){ add('returnSignal', card.returnSignal.note); add('returnSignal', (card.returnSignal.evidence || []).map(e => e?.quote)); }
  if (card.checked) add('checked', card.checked.note);
  return out;
}

/**
 * NO RETURN IS MODELLED, checked in the words. No text on a card names a
 * modelled return, and a revenue rate appears in the return signal only.
 */
export function returnTextProblems(card){
  const problems = [];
  for (const { where, text } of cardText(card)){
    if (RETURN_WORDS.test(text)) problems.push(`${where}: names a modelled return — a scout card prints no IRR, multiple or payback`);
    else if (where !== 'returnSignal' && REVENUE_RATE.test(text)) problems.push(`${where}: quotes a revenue rate — a third party's index belongs in the return signal and nowhere else`);
  }
  return problems;
}

/** Problems with one card. Empty array means valid. */
export function validateCard(card){
  if (!card || typeof card.id !== 'string' || !card.id) return ['card has no id'];
  const problems = [];
  const at = (m) => problems.push(`${card.id}: ${m}`);
  if (!isScoutId(card.id)) at('is not in the scout roster — the analyst adds a market there first');
  if (card.tier !== 'scout') at('tier must be "scout"');

  for (const key of Object.keys(card)){
    if (key !== 'id' && key !== 'tier' && !SCOUT_SECTIONS.includes(key)) at(`"${key}" is not a section of a scout card`);
  }
  const sources = scoutSources(card.id);

  if (!Array.isArray(card.facts)) at('facts must be an array');
  else {
    if (card.facts.length > MAX_SCOUT_FACTS) at(`holds ${card.facts.length} facts — at most ${MAX_SCOUT_FACTS}`);
    card.facts.forEach((fact, i) => {
      if (!isPair(fact?.text)) at(`facts[${i}]: text must be an [en, zh] pair`);
      for (const key of Object.keys(fact || {})) if (key !== 'text' && key !== 'evidence') at(`facts[${i}]: "${key}" is not a field of a fact`);
      for (const p of quotationProblems(fact?.evidence, `facts[${i}]`)) at(p);
    });
  }

  if (!card.grades || typeof card.grades !== 'object' || Array.isArray(card.grades)) at('grades must be an object keyed by dimension');
  else for (const [key, record] of Object.entries(card.grades)){
    if (!SCOUT_DIMENSION_IDS.includes(key)) at(`grades.${key}: not a dimension a scout card is graded on — no return is modelled`);
    else if (record?.dimension !== key) at(`grades.${key} holds a record for "${record?.dimension}"`);
    for (const p of validateGrade(record)) at(`grades.${p}`);
    if (record && 'held' in record) at(`grades.${key}: a scout card has no held layer`);
    if (record?.metric !== undefined && record.metric !== null) at(`grades.${key}: a scout card carries no figures beside a grade`);
    for (const source of Array.isArray(record?.evidence) ? record.evidence : []){
      if (!sources[source]) at(`grades.${key}: cites "${source}", which is not in this market's source list`);
    }
  }

  const triggerIds = new Set();
  if (!Array.isArray(card.triggers)) at('triggers must be an array');
  else for (const trigger of card.triggers){
    for (const p of validateTrigger(trigger)) at(`triggers.${p}`);
    if (trigger?.market !== card.id) at(`trigger ${trigger?.id} belongs to "${trigger?.market}"`);
    if (isRule(trigger) || (trigger?.when !== undefined && trigger?.when !== null)) at(`trigger ${trigger?.id}: a scout card holds no rule — a trigger here has no test and no effect`);
    if (typeof trigger?.source === 'string' && !sources[trigger.source]) at(`trigger ${trigger?.id}: cites "${trigger.source}", which is not in this market's source list`);
    for (const d of Array.isArray(trigger?.watches) ? trigger.watches : []){
      if (!SCOUT_DIMENSION_IDS.includes(d)) at(`trigger ${trigger?.id}: watches "${d}", which a scout card is not graded on`);
    }
    if (triggerIds.has(trigger?.id)) at(`trigger ${trigger?.id} appears twice`);
    triggerIds.add(trigger?.id);
  }

  if (!card.verdicts || typeof card.verdicts !== 'object' || Array.isArray(card.verdicts)) at('verdicts must be an object keyed by archetype');
  else for (const [key, record] of Object.entries(card.verdicts)){
    if (!ARCHETYPE_IDS.includes(key)) at(`verdicts holds an unknown archetype "${key}"`);
    else if (record?.archetype !== key) at(`verdicts.${key} holds a record for "${record?.archetype}"`);
    for (const p of validateVerdict(record)) at(`verdicts.${p}`);
    for (const id of Array.isArray(record?.changesIf) ? record.changesIf : []){
      if (!triggerIds.has(id)) at(`verdicts.${key}: changesIf names "${id}", which is not a trigger of this card`);
    }
    for (const reason of Array.isArray(record?.because) ? record.because : []){
      if (!card.grades?.[reason?.dimension]) at(`verdicts.${key}: because cites "${reason?.dimension}", which is not graded on this card`);
    }
  }

  if (card.returnSignal !== null){
    const s = card.returnSignal;
    if (!s || typeof s !== 'object') at('returnSignal must be null or an object');
    else {
      for (const key of Object.keys(s)) if (!['kind', 'note', 'evidence'].includes(key)) at(`returnSignal: "${key}" is not a field of a return signal — it carries no number of its own`);
      if (!RETURN_SIGNAL_KINDS.includes(s.kind)) at(`returnSignal.kind must be one of ${RETURN_SIGNAL_KINDS.join(', ')}`);
      if (!isPair(s.note)) at('returnSignal.note must be an [en, zh] pair');
      for (const p of quotationProblems(s.evidence, 'returnSignal')) at(p);
    }
  }

  if (card.checked !== null){
    const c = card.checked;
    if (!c || typeof c !== 'object' || !isDay(c.asOf)) at('checked must be null or carry the date of the check as asOf');
    else if (c.note !== null && c.note !== undefined && !isPair(c.note)) at('checked.note must be null or an [en, zh] pair');
  }

  for (const p of returnTextProblems(card)) at(p);
  return problems;
}

/* ---- who may write what -------------------------------------------------------- */

/**
 * The authors whose changes to a CARD are applied. Apart from LIVE_AUTHORS in
 * view.mjs, which is the list for core markets and is not this one.
 *
 * The agent is not in it yet: until the analyst adds it, the scout pass runs
 * dry on cards as the daily pass does on markets. Adding it is the decision
 * revision plan §8 reserves to him, and it is one line.
 */
export const SCOUT_LIVE_AUTHORS = ['analyst'];

const WHOLE = { create: true, replace: true, remove: true, fields: null };

/**
 * What each author may do on a card, by section. A rule has no entry: there
 * are no rules on a card. `checked` is the analyst's alone.
 *
 * The agent may CREATE a grade and a verdict here, which it may not on a
 * market: there is no prior judgement on a card to overwrite. What it may
 * change on a record that exists is the same list of fields as on a market.
 */
export const SCOUT_RIGHTS = {
  analyst: { facts: WHOLE, grades: WHOLE, verdicts: WHOLE, triggers: WHOLE, returnSignal: WHOLE, checked: WHOLE },
  agent: {
    grades:       { create: true, replace: true, remove: false, fields: AUTHOR_RIGHTS.agent.grades.fields },
    verdicts:     { create: true, replace: true, remove: false, fields: AUTHOR_RIGHTS.agent.verdicts.fields },
    triggers:     { create: true, replace: true, remove: false, fields: null },
    facts:        { create: true, replace: true, remove: false, fields: null },
    returnSignal: { create: true, replace: true, remove: false, fields: null },
  },
};

/** May this kind of author write this path on a card at all? */
export function scoutAuthorMayWrite(path, kind){
  const where = parseScoutPath(path);
  return Boolean(where && SCOUT_RIGHTS[kind]?.[where.section]);
}

const STAMPS = ['author', 'asOf'];

function changedFields(from, to){
  const keys = new Set([...Object.keys(from || {}), ...Object.keys(to || {})]);
  return [...keys].filter(key => !same(from?.[key], to?.[key]));
}

/** The dimensions on a card that an investor can be knocked out on. */
export function scoutKnockOutDimensions(archetypeId){
  const reads = ARCHETYPES[archetypeId].reads;
  return SCOUT_DIMENSION_IDS.filter(d => Object.values(reads[d] || {}).includes(KNOCK_OUT));
}

/** The pages a machine may cite for a market: listed, and with terms somebody has read. */
export function admittedSources(id, sources = scoutSources(id)){
  return Object.fromEntries(Object.entries(sources).filter(([, s]) => ADMITTED_TERMS.includes(s.terms?.status)));
}

/**
 * Everything that stops the agent's change to a card. Empty array means it
 * may go ahead. Guardrails A to I, restated for a tier where a record is
 * created as often as it is changed (phase 4 plan §3).
 *
 *   change   { market, path, to, author, evidence }
 *   before   the card as it stands
 *   today    YYYY-MM-DD, for pins
 *   sources  the market's source list. The analyst's, unless a test says
 *            otherwise: the writer never passes one
 */
export function scoutMachineProblems(change, before, { today, sources = scoutSources(before.id) }){
  const kind = change.author?.kind;
  const where = parseScoutPath(change.path);
  if (!where) return ['not a change to a path on a scout card'];
  const rights = SCOUT_RIGHTS[kind]?.[where.section];
  if (kind !== 'agent' || !rights) return [`author "${kind}" may not write ${where.section} on a scout card`];

  const from = readScoutPath(before, change.path);
  const to = change.to;
  if (to === null) return [`author "${kind}" may not remove ${change.path}`];

  /* D — pins. */
  if (from?.lockedUntil && from.lockedUntil >= today){
    return [`${change.path} is pinned until ${from.lockedUntil} — a pinned record is the analyst's to change`];
  }

  const problems = [];
  const record = where.section === 'grades' || where.section === 'verdicts';
  const evidence = Array.isArray(change.evidence) ? change.evidence : [];

  if (record){
    if (to.author !== kind) problems.push(`${change.path}: the record must say who wrote it — author "${kind}"`);
    if (from){
      const changed = changedFields(from, to);
      const outside = changed.filter(f => !STAMPS.includes(f) && !rights.fields.includes(f));
      if (outside.length) problems.push(`author "${kind}" may not change ${outside.map(f => `${change.path}.${f}`).join(', ')}`);
      if (!changed.some(f => !STAMPS.includes(f))) problems.push(`${change.path}: nothing of substance would change`);
    } else if (to.lockedUntil !== null){
      problems.push(`${change.path}: a machine does not pin a record`);
    }
  }

  if (where.section === 'grades'){
    if (from?.basis === BASIS.PRACTITIONER || to.basis === BASIS.PRACTITIONER){
      problems.push(`${change.path} is a practitioner grade — it is the analyst's judgement and a machine does not write one`);
    } else if (![BASIS.OFFICIAL, BASIS.THIRD_PARTY].includes(to.basis)){
      problems.push(`${change.path}: a machine grades a scout card from an official or a third-party page, not as "${to.basis}"`);
    } else if (to.basis === BASIS.OFFICIAL && !evidence.some(e => e?.class === EVIDENCE_CLASS.OFFICIAL)){
      problems.push(`${change.path}: the basis says official and no official page is quoted`);
    }
    /* C — one step a run, once a grade exists. */
    if (from && Math.abs(to.grade - from.grade) > AGENT_MAX_GRADE_STEP){
      problems.push(`${change.path}: ${from.grade} to ${to.grade} is more than ${AGENT_MAX_GRADE_STEP} step in one run`);
    }
    /* C — for a created grade: the anchor decides, and an extreme needs more. */
    if (!from && SCOUT_EXTREME_GRADES.includes(to.grade) && !verdictEvidenceSuffices(evidence)){
      problems.push(`${change.path}: a first grade of ${to.grade} needs one official source or two independent ones`);
    }
    /* The record cites exactly the pages the change quotes. */
    const cited = new Set((Array.isArray(to.evidence) ? to.evidence : []).map(key => sources[key]?.url));
    const quoted = new Set(evidence.map(e => e?.url));
    if (!same([...cited].sort(), [...quoted].sort())) problems.push(`${change.path}: the sources the grade names are not the pages the change quotes`);
  }

  if (where.section === 'verdicts'){
    if (to.call === VERDICT.NOT_ACCESSIBLE || from?.call === VERDICT.NOT_ACCESSIBLE && to.call !== from.call){
      problems.push(`${change.path}: "not accessible" is a knock-out's reading — a machine neither sets it nor moves a call away from it`);
    } else if (!from){
      /* C — a first call sits within one place of "wait". */
      if (!SCOUT_FIRST_CALLS.includes(to.call)) problems.push(`${change.path}: a first call is one of ${SCOUT_FIRST_CALLS.join(', ')} — "${to.call}" is reached one place a run`);
      /* A barrier cannot be hidden by leaving its dimension blank. */
      const blank = scoutKnockOutDimensions(where.key).filter(d => !before.grades[d]);
      if (blank.length) problems.push(`${change.path}: ${blank.join(', ')} can shut this investor out and is not graded yet`);
    } else if (to.call !== from.call && Math.abs(VERDICT_SCALE.indexOf(to.call) - VERDICT_SCALE.indexOf(from.call)) > 1){
      problems.push(`${change.path}: "${from.call}" to "${to.call}" is more than one step in one run`);
    }
    /* A knock-out caps a machine's call. */
    if ((!from || to.call !== from.call) && knockOuts(where.key, before.grades, today).length && !SCOUT_KNOCKED_OUT_CALLS.includes(to.call)){
      problems.push(`${change.path}: a grade on this card shuts this investor out — the most a machine calls is "${VERDICT.WAIT}"`);
    }
    /* G — enough evidence to set or move a verdict. */
    if (!verdictEvidenceSuffices(evidence)) problems.push(`${change.path}: a verdict moves on one official source or two independent ones`);
  }

  if (where.section === 'triggers'){
    if (isRule(to) || isRule(from)) problems.push(`${change.path}: a scout card holds no rule`);
    if (typeof to.source !== 'string') problems.push(`${change.path}: a machine's trigger cites a page from the source list by its key`);
  }

  if (where.section === 'facts' || where.section === 'returnSignal'){
    /* Every quotation on the record is one the change verified. */
    const verified = new Set(evidence.map(e => `${e?.url}|${e?.quote}`));
    const shown = where.section === 'facts' ? to.flatMap(f => f?.evidence || []) : (to.evidence || []);
    if (shown.some(e => !verified.has(`${e?.url}|${e?.quote}`))) problems.push(`${change.path}: shows a quotation the change does not carry as evidence`);
  }

  /* A — evidence: fetched in this run, quoted, and from a page the analyst listed. */
  problems.push(...evidenceProblems(change.evidence, kind));
  const allowed = new Map(Object.values(admittedSources(before.id, sources)).map(s => [s.url, s]));
  for (const e of evidence){
    const listed = allowed.get(e?.url);
    if (!listed) problems.push(`evidence: ${e?.url} is not on this market's source list, or its terms have not been read`);
    /* What a source is, is the list's to say and not the change's. */
    else if ((listed.authority === 'official') !== (e.class === EVIDENCE_CLASS.OFFICIAL)) problems.push(`evidence: ${e.url} is listed as ${listed.authority} and the change calls it ${e.class}`);
  }
  if (typeof change.author.run !== 'string' || !Number.isFinite(Date.parse(change.author.run))) problems.push('a machine author records the run it wrote in');
  if (!change.author.model || !change.author.prompt) problems.push('an agent records its model and prompt version');
  return problems;
}

/**
 * E, for a scout run: how many cards it touches and how many existing records
 * it replaces. Returns the problems; empty means inside both caps.
 */
export function scoutRunProblems(prepared){
  const problems = [];
  const cards = new Set(prepared.map(p => p.entry.market));
  if (cards.size > MAX_SCOUT_CARDS_PER_RUN) problems.push(`this run would touch ${cards.size} cards and the cap is ${MAX_SCOUT_CARDS_PER_RUN} — nothing is written`);
  const replaced = prepared.filter(p => p.entry.from !== null).length;
  if (replaced > MAX_MACHINE_CHANGES_PER_RUN) problems.push(`this run would replace ${replaced} existing records and the cap is ${MAX_MACHINE_CHANGES_PER_RUN} — nothing is written`);
  return problems;
}

/* ---- the pass log ---------------------------------------------------------------- */

/**
 * A pass is clean when it ran over every card it set out to, a page was read
 * and the model answered for each, and NO proposal was rejected — for
 * evidence or for anything else. A proposal dropped because nothing would
 * change was never a rejection and is not recorded as one.
 */
export function passIsClean(pass){
  return Array.isArray(pass?.cards) && pass.cards.length > 0
    && !(pass.unfetched || []).length && !(pass.unanswered || []).length && !(pass.rejected || []).length;
}

/** Problems with one line of the pass log. Empty array means valid. */
export function validatePass(pass){
  if (!pass || typeof pass !== 'object') return ['pass is missing'];
  const problems = [];
  const at = (m) => problems.push(`${pass.run || '?'}: ${m}`);
  if (typeof pass.run !== 'string' || !Number.isFinite(Date.parse(pass.run))) at('run must be an ISO timestamp');
  if (!SCOUT_REGION_IDS.includes(pass.region)) at(`region must be one of ${SCOUT_REGION_IDS.join(', ')}`);
  if (!Array.isArray(pass.cards) || pass.cards.some(id => !isScoutId(id))) at('cards must be roster ids');
  else {
    if (pass.cards.length > MAX_SCOUT_CARDS_PER_RUN) at(`covers ${pass.cards.length} cards — at most ${MAX_SCOUT_CARDS_PER_RUN}`);
    if (SCOUT_REGION_IDS.includes(pass.region) && pass.cards.some(id => !scoutIdsIn(pass.region).includes(id))) at('covers a card outside its region');
  }
  if (!pass.model || !pass.prompt) at('records the model and the prompt version');
  for (const key of ['proposed', 'written']) if (!Number.isInteger(pass[key]) || pass[key] < 0) at(`${key} must be a count`);
  for (const key of ['unfetched', 'unanswered']) if (!Array.isArray(pass[key]) || pass[key].some(id => !isScoutId(id))) at(`${key} must be a list of roster ids`);
  if (!Array.isArray(pass.pages)) at('pages must be a list');
  if (!Array.isArray(pass.rejected) || pass.rejected.some(r => typeof r?.why !== 'string' || !r.why)) at('rejected must be a list, each with its reason');
  if (pass.clean !== passIsClean(pass)) at('clean must be what the rest of the line says');
  return problems;
}

const DAY = 86_400_000;

/**
 * The number of consecutive clean passes at the end of the log.
 *
 * An unclean pass sets it to zero. A clean one adds one only if every card in
 * it last had a clean pass at least SCOUT_REVIEW_MIN_DAYS earlier, or never:
 * a repeat inside that window is not a review and neither counts nor breaks.
 */
export function cleanStreak(passes, minDays = SCOUT_REVIEW_MIN_DAYS){
  let streak = 0;
  const lastClean = new Map();
  for (const pass of [...passes].sort((a, b) => a.run.localeCompare(b.run))){
    if (!pass.clean){ streak = 0; continue; }
    const at = Date.parse(pass.run);
    if (pass.cards.every(id => !lastClean.has(id) || at - lastClean.get(id) >= minDays * DAY)) streak += 1;
    for (const id of pass.cards) lastClean.set(id, at);
  }
  return streak;
}

/**
 * How far a card is toward graduation: over its last GRADUATION.passes passes,
 * did one investor read a graduating call throughout?
 *
 * @returns {{ passes, needed, archetype }}  passes is how many of the most
 *          recent consecutive passes the best-placed investor has held such a
 *          call through
 */
export function graduationProgress(card, passes, changelog){
  const mine = passes.filter(p => p.cards.includes(card.id)).map(p => p.run).sort();
  let best = { passes: 0, needed: GRADUATION.passes, archetype: null };
  for (const [id, verdict] of Object.entries(card.verdicts || {})){
    if (!GRADUATION.calls.includes(verdict.call)) continue;
    /* When the call last became a graduating one. */
    let since = null;
    for (const e of changelog){
      if (e.market !== card.id || e.path !== `verdicts.${id}`) continue;
      if (e.to && GRADUATION.calls.includes(e.to.call) && !(e.from && GRADUATION.calls.includes(e.from.call))) since = e.at;
    }
    const held = since === null ? 0 : mine.filter(run => run >= since).length;
    if (held > best.passes) best = { passes: Math.min(held, GRADUATION.passes), needed: GRADUATION.passes, archetype: id };
  }
  return best;
}
