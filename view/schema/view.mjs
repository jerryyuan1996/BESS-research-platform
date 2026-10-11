/* ---------------------------------------------------------------------------
   THE VIEW STORE — what the platform currently thinks, as data.

   view/markets/<id>.json holds one market's judgement: the grade on each
   dimension, the verdict for each investor, the triggers that would move
   either, and the thesis. view/index.json is the verdicts alone, for a board.
   view/changelog.jsonl is every change ever made, one line each, append-only.

   WHY IT IS NOT IN src/. Judgement used to live in market modules, beside the
   methodology it was measured against, and the two were protected by the same
   wall. They are different things. An anchor is a definition; a grade is a
   reading against it, and readings change. Moving the readings here lets the
   definitions stay behind the old wall — archetypes, anchors and discount
   rates are in src/governance/ and nothing in this directory can express a
   change to one.

   WHO MAY WRITE IT: THREE AUTHORS, WITH DIFFERENT RIGHTS. The rule the store
   lives under is "judgement publishes automatically after validation;
   methodology never does". So:

     analyst   everything in the store, including the held layer and rules
     rule      a trigger the analyst wrote in advance, firing: exactly the
               fields its effect names, on a grade or a verdict, and no more
     agent     grades, verdicts, the thesis and plain triggers, one step at a
               time, each change with a source it fetched — and NOT LIVE yet:
               its changes can be prepared and reported, never applied

   The rights are in AUTHOR_RIGHTS and the checks in machineProblems, both
   below. Nothing else decides what a machine may write here.

   This module is the schema: it says what a valid market view is, which paths
   a change may touch and who may touch them. The writer and the tests both use
   it, so the thing that is checked on the way in is the thing that is asserted
   afterwards.
   --------------------------------------------------------------------------- */

import {
  DIMENSION_IDS, ARCHETYPE_IDS, BASIS, VERDICT, validateGrade, validateVerdict,
} from '../../src/governance/investability.js';
import { validateTrigger, isRule, parseEffectPath, TRIGGER_KIND } from '../../src/governance/triggers.js';
import { datasetById } from '../../src/governance/datasets.js';
import {
  AGENT_MAX_GRADE_STEP, VERDICT_SCALE, MAX_QUOTE_CHARS, EVIDENCE_CLASS,
} from '../../src/governance/automation.js';

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/** The sections of a market view. Anything else is not view-store content. */
export const VIEW_SECTIONS = ['grades', 'verdicts', 'triggers', 'thesis'];

/**
 * Evidence a grade may cite that is not a key in the market's source register:
 * a part of the platform itself. A grade derived from the engine's ranking has
 * no external page to point at, and saying so by name is better than leaving
 * the evidence empty. Each of these is something a reader can open.
 */
export const INTERNAL_EVIDENCE = {
  'comparison-engine': ['The comparison engine', '比较引擎'],
  'entry-ledger':      ['The market\'s capital-at-risk ledger', '该市场的风险资本台账'],
  'build-pathway':     ['The market\'s build pathway', '该市场的建设路径'],
  'market-dashboard':  ['The market\'s own dashboard', '该市场看板'],
  'decision-profile':  ['The market\'s decision profile', '该市场的决策画像'],
  'revision-plan':     ['The four-corner table in the revision plan, section 5.1', '修订方案第5.1节的四市场对照表'],
};

/** A market view with nothing in it yet. */
export function emptyView(marketId){
  return { marketId, thesis: null, grades: {}, verdicts: {}, triggers: [] };
}

/**
 * Problems with one market view. Empty array means valid.
 *
 * Beyond the record validators, three things only the whole view can show:
 * a record filed under the wrong key, a trigger filed under the wrong market,
 * and a verdict whose "changes if" names a trigger that does not exist.
 */
export function validateMarketView(view){
  if (!view || typeof view.marketId !== 'string' || !view.marketId) return ['view has no marketId'];
  const problems = [];
  const at = (m) => problems.push(`${view.marketId}: ${m}`);

  for (const key of Object.keys(view)){
    if (key !== 'marketId' && !VIEW_SECTIONS.includes(key)) at(`"${key}" is not a section of a market view`);
  }
  if (view.thesis !== null && !isPair(view.thesis)) at('thesis must be null or an [en, zh] pair');

  if (!view.grades || typeof view.grades !== 'object' || Array.isArray(view.grades)) at('grades must be an object keyed by dimension');
  else for (const [key, record] of Object.entries(view.grades)){
    if (!DIMENSION_IDS.includes(key)) at(`grades holds an unknown dimension "${key}"`);
    else if (record?.dimension !== key) at(`grades.${key} holds a record for "${record?.dimension}"`);
    for (const p of validateGrade(record)) at(`grades.${p}`);
  }

  const triggerIds = new Set();
  if (!Array.isArray(view.triggers)) at('triggers must be an array');
  else for (const trigger of view.triggers){
    for (const p of validateTrigger(trigger)) at(`triggers.${p}`);
    if (trigger?.market !== view.marketId) at(`trigger ${trigger?.id} belongs to "${trigger?.market}"`);
    /* A rule that tests a dataset nobody publishes would never fire and never say so. */
    if (trigger?.when && typeof trigger.when.dataset === 'string' && !datasetById(trigger.when.dataset)){
      at(`trigger ${trigger.id}: when.dataset "${trigger.when.dataset}" is not in the dataset catalogue`);
    }
    if (triggerIds.has(trigger?.id)) at(`trigger ${trigger?.id} appears twice`);
    triggerIds.add(trigger?.id);
  }

  if (!view.verdicts || typeof view.verdicts !== 'object' || Array.isArray(view.verdicts)) at('verdicts must be an object keyed by archetype');
  else for (const [key, record] of Object.entries(view.verdicts)){
    if (!ARCHETYPE_IDS.includes(key)) at(`verdicts holds an unknown archetype "${key}"`);
    else if (record?.archetype !== key) at(`verdicts.${key} holds a record for "${record?.archetype}"`);
    for (const p of validateVerdict(record)) at(`verdicts.${p}`);
    for (const id of Array.isArray(record?.changesIf) ? record.changesIf : []){
      if (!triggerIds.has(id)) at(`verdicts.${key}: changesIf names "${id}", which is not a trigger of this market`);
    }
  }
  return problems;
}

/**
 * Where a change may land. A path is one whole record or the thesis:
 *
 *     grades.<dimension>      verdicts.<archetype>      triggers.<id>      thesis
 *
 * Whole records, never one field inside one. A verdict whose call changed and
 * whose reasons did not is the half-edit this store exists to prevent: the
 * record is validated as a unit, so it is replaced as a unit.
 *
 * ONE EXCEPTION, AND IT IS A LAYER RATHER THAN A FIELD:
 *
 *     grades.<dimension>.held
 *
 * The analyst's held view sits on top of a sourced grade and must be able to
 * come and go without the sourced grade being touched. So it has its own path:
 * writing it replaces the layer and nothing else, and writing the grade
 * replaces the sourced record and carries the layer over unchanged.
 *
 * Returns { section, key, layer } or null. Null is how every methodology path
 * fails — there is no spelling of "a weight" or "an anchor" that parses.
 */
export function parsePath(path){
  if (path === 'thesis') return { section: 'thesis', key: null, layer: null };
  const held = /^grades\.([A-Za-z0-9_-]+)\.held$/.exec(typeof path === 'string' ? path : '');
  if (held) return DIMENSION_IDS.includes(held[1]) ? { section: 'grades', key: held[1], layer: 'held' } : null;
  const m = /^(grades|verdicts|triggers)\.([A-Za-z0-9_-]+)$/.exec(typeof path === 'string' ? path : '');
  if (!m) return null;
  const [, section, key] = m;
  if (section === 'grades' && !DIMENSION_IDS.includes(key)) return null;
  if (section === 'verdicts' && !ARCHETYPE_IDS.includes(key)) return null;
  return { section, key, layer: null };
}

/** True when a path addresses the analyst's held layer. */
export const isHeldPath = (path) => parsePath(path)?.layer === 'held';

/** The value at a path, or null when nothing is there. */
export function readPath(view, path){
  const where = parsePath(path);
  if (!where) return null;
  if (where.section === 'thesis') return view.thesis ?? null;
  if (where.section === 'triggers') return view.triggers.find(t => t.id === where.key) ?? null;
  if (where.layer === 'held') return view.grades[where.key]?.held ?? null;
  return view[where.section][where.key] ?? null;
}

/** A copy of the view with the path set, or removed when `to` is null. */
export function writePath(view, path, to){
  const where = parsePath(path);
  if (!where) throw new Error(`"${path}" is not a view-store path`);
  const next = structuredClone(view);
  if (where.layer === 'held'){
    const record = next.grades[where.key];
    if (!record) throw new Error(`${path}: there is no sourced grade for a held view to sit on`);
    if (to === null) delete record.held; else record.held = to;
    return next;
  }
  if (where.section === 'grades'){
    /* The sourced record is replaced; a held layer on it is carried over
       exactly as it was. Nobody changes the analyst's view by changing what
       the sources say underneath it. */
    const layer = next.grades[where.key]?.held;
    if (to === null){
      if (layer) throw new Error(`${path}: remove the held view first — a sourced grade cannot be deleted from under one`);
      delete next.grades[where.key];
    } else {
      const { held: ignored, ...sourced } = to;
      next.grades[where.key] = layer ? { ...sourced, held: layer } : sourced;
    }
    return next;
  }
  if (where.section === 'thesis') next.thesis = to;
  else if (where.section === 'triggers'){
    next.triggers = next.triggers.filter(t => t.id !== where.key);
    if (to !== null) next.triggers.push(to);
    next.triggers.sort((a, b) => a.id.localeCompare(b.id));
  }
  else if (to === null) delete next[where.section][where.key];
  else next[where.section][where.key] = to;
  return next;
}

/** The verdict board: every market's calls and nothing else. */
export function buildIndex(views){
  const index = {};
  for (const view of [...views].sort((a, b) => a.marketId.localeCompare(b.marketId))){
    const calls = {};
    for (const id of ARCHETYPE_IDS){
      const v = view.verdicts[id];
      if (v) calls[id] = { call: v.call, route: v.route, asOf: v.asOf, reviewBy: v.reviewBy ?? null };
    }
    index[view.marketId] = calls;
  }
  return index;
}

/* ---------------------------------------------------------------------------
   WHO MAY WRITE WHAT
   --------------------------------------------------------------------------- */

/** Every kind of author the store knows. Anything else is refused everywhere. */
export const PERMITTED_AUTHORS = ['analyst', 'rule', 'agent'];

/** The authors that are not a person. */
export const MACHINE_AUTHORS = ['rule', 'agent'];

/**
 * The authors whose changes are APPLIED today. The agent is permitted and not
 * live: it runs dry, reporting what it would have changed, until it has earned
 * the scout cards and then the core markets (plan §8). Adding it here is that
 * decision, and it is the analyst's.
 */
export const LIVE_AUTHORS = ['analyst', 'rule'];

/**
 * Who may write a held view: the analyst, and this list does not grow.
 *
 * Kept apart from PERMITTED_AUTHORS deliberately. Rules and an agent write
 * sourced grades, and this list did not move when that one was widened: a held
 * view is the analyst's own judgement, and a machine that could write it would
 * be writing his opinion for him.
 */
export const HELD_AUTHORS = ['analyst'];

/**
 * What each author may do, by section.
 *
 *   create / replace / remove   whether the record may come into being, change
 *                               or go
 *   fields                      for a replace: the only fields that may differ
 *                               afterwards, besides the stamps (author, asOf).
 *                               null means the whole record is the author's.
 *
 * A section an author has no entry for is closed to it. The held layer is not
 * in this table at all: HELD_AUTHORS answers for it.
 */
export const AUTHOR_RIGHTS = {
  analyst: {
    grades:   { create: true, replace: true, remove: true, fields: null },
    verdicts: { create: true, replace: true, remove: true, fields: null },
    triggers: { create: true, replace: true, remove: true, fields: null },
    thesis:   { create: true, replace: true, remove: true, fields: null },
  },
  /* A rule's fields are narrower still than this row says: exactly the ones
     its own effect names. machineProblems holds it to that. */
  rule: {
    grades:   { create: false, replace: true, remove: false, fields: ['grade', 'trend', 'trendCause'] },
    verdicts: { create: false, replace: true, remove: false, fields: ['call', 'reviewBy', 'changesIf'] },
  },
  agent: {
    grades:   { create: false, replace: true, remove: false, fields: ['grade', 'trend', 'trendCause', 'reason', 'evidence', 'basis'] },
    verdicts: { create: false, replace: true, remove: false, fields: ['call', 'because', 'despite', 'reviewBy', 'changesIf'] },
    /* A trigger, never a rule: see machineProblems. */
    triggers: { create: true, replace: true, remove: false, fields: null },
    thesis:   { create: true, replace: true, remove: false, fields: null },
  },
};

/** Fields every author sets on a record it writes; never counted as a change of substance. */
const STAMPS = ['author', 'asOf'];

/** May this kind of author write this path at all? The first question the gate asks. */
export function authorMayWrite(path, kind){
  const where = parsePath(path);
  if (!where) return false;
  if (where.layer === 'held') return HELD_AUTHORS.includes(kind);
  return Boolean(AUTHOR_RIGHTS[kind]?.[where.section]);
}

const sameValue = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** The top-level fields that differ between two records, the held layer aside. */
function changedFields(from, to){
  const keys = new Set([...Object.keys(from || {}), ...Object.keys(to || {})]);
  keys.delete('held');
  return [...keys].filter(key => !sameValue(from?.[key], to?.[key]));
}

const SHA = /^sha256:[0-9a-f]{64}$/;

/**
 * Problems with the evidence a machine change carries (guardrail A).
 *
 * A rule's evidence is the published snapshot it tested: the dataset, the
 * field, what it read and the line it crossed, with the snapshot's own
 * checksum. An agent's is a page it fetched, with a quotation short enough to
 * be a quotation.
 */
export function evidenceProblems(evidence, kind){
  if (!Array.isArray(evidence) || !evidence.length) return ['a machine change carries at least one evidence record — nothing moves on what was recalled'];
  const problems = [];
  evidence.forEach((e, i) => {
    const at = (m) => problems.push(`evidence[${i}]: ${m}`);
    if (!e || typeof e !== 'object'){ at('must be an object'); return; }
    if (typeof e.publisher !== 'string' || !e.publisher.trim()) at('publisher is missing');
    if (typeof e.url !== 'string' || !/^https:\/\//.test(e.url)) at('url must be an https link');
    if (typeof e.retrievedAt !== 'string' || !Number.isFinite(Date.parse(e.retrievedAt))) at('retrievedAt must be an ISO timestamp');
    if (typeof e.sha256 !== 'string' || !SHA.test(e.sha256)) at('sha256 must be the content hash of what was read');
    if (!Object.values(EVIDENCE_CLASS).includes(e.class)) at(`class must be one of ${Object.values(EVIDENCE_CLASS).join(', ')}`);
    if (kind === 'rule'){
      if (typeof e.dataset !== 'string' || !datasetById(e.dataset)) at('a rule cites a dataset in the catalogue');
      if (typeof e.field !== 'string' || !e.field) at('a rule cites the field it tested');
      if (typeof e.observed !== 'number' || !Number.isFinite(e.observed)) at('a rule records the value it read');
      if (typeof e.threshold !== 'number' || !Number.isFinite(e.threshold)) at('a rule records the line that value crossed');
    }
    if (kind === 'agent'){
      if (typeof e.quote !== 'string' || !e.quote.trim()) at('an agent quotes the passage it relies on');
      else if (e.quote.length > MAX_QUOTE_CHARS) at(`quote is ${e.quote.length} characters — at most ${MAX_QUOTE_CHARS}`);
    }
  });
  return problems;
}

const host = (url) => { try { return new URL(url).host.replace(/^www\./, ''); } catch { return null; } };

/** Guardrail G: one official source, or two that are independent of each other. */
export function verdictEvidenceSuffices(evidence){
  if (!Array.isArray(evidence)) return false;
  if (evidence.some(e => e?.class === EVIDENCE_CLASS.OFFICIAL)) return true;
  const independent = new Set(evidence.map(e => `${String(e?.publisher).trim().toLowerCase()}|${host(e?.url)}`));
  const publishers = new Set(evidence.map(e => String(e?.publisher).trim().toLowerCase()));
  const hosts = new Set(evidence.map(e => host(e?.url)));
  return independent.size >= 2 && publishers.size >= 2 && hosts.size >= 2;
}

/**
 * The records a rule's effect would produce, as whole-record changes.
 *
 * An effect names fields; the store replaces records. So each record the
 * effect touches is read, has those fields set, is stamped, and is returned
 * whole. A `trendCause` of null removes the field. Throws when the effect
 * names a record the view does not hold: a rule changes what is there.
 */
export function effectChanges(view, trigger, { kind = 'rule', asOf }){
  const records = new Map();
  for (const step of trigger.effect){
    const where = parseEffectPath(step.path);
    if (!where) throw new Error(`${trigger.id}: "${step.path}" is not a field a rule may change`);
    const path = `${where.section}.${where.key}`;
    if (!records.has(path)){
      const current = view[where.section][where.key];
      if (!current) throw new Error(`${trigger.id}: ${path} does not exist in ${view.marketId} — a rule changes a record, it does not create one`);
      const { held: ignored, ...sourced } = structuredClone(current);
      records.set(path, sourced);
    }
    const record = records.get(path);
    if (step.to === null) delete record[where.field]; else record[where.field] = step.to;
  }
  return [...records].map(([path, record]) => ({ path, to: { ...record, author: kind, asOf } }));
}

/** The changelog id of the analyst's last write of a trigger record, and when. Null when he never wrote it. */
function armedAt(changelog, market, triggerId){
  const writes = changelog.filter(e => e.market === market && e.path === `triggers.${triggerId}`);
  const last = writes[writes.length - 1];
  return last && last.author?.kind === 'analyst' && last.to !== null ? last.at : null;
}

/**
 * Has this rule fired since it was last armed?
 *
 * A rule fires ONCE per arming. It is armed when the analyst writes its
 * trigger record and it stays fired until he writes that record again. So a
 * second run on the same snapshot does nothing, a series hovering at a
 * threshold cannot flap, and a change the analyst reverted stays reverted.
 */
export function ruleHasFired(changelog, market, triggerId){
  const armed = armedAt(changelog, market, triggerId);
  return changelog.some(e => e.market === market && e.author?.kind === 'rule' && e.trigger === triggerId
    && (armed === null || e.at > armed));
}

/**
 * Everything that stops a machine author's change. Empty array means it may go
 * ahead. This is the validation gate of plan §7.4, less the two parts that
 * need a disk: that the whole view is valid afterwards, and the
 * confidentiality scan of the result.
 *
 *   change     { market, path, to, author, evidence, trigger }
 *   before     the market view as it stands
 *   changelog  every entry so far
 *   today      YYYY-MM-DD, for pins
 */
export function machineProblems(change, before, { changelog = [], today }){
  const kind = change.author?.kind;
  const where = parsePath(change.path);
  if (!where || !MACHINE_AUTHORS.includes(kind)) return ['not a machine change to a view path'];
  if (where.layer === 'held') return [`author "${kind}" may not write a held view — it is the analyst's own judgement and only the analyst writes it`];

  const rights = AUTHOR_RIGHTS[kind][where.section];
  if (!rights) return [`author "${kind}" may not write ${where.section}`];

  const problems = [];
  const from = readPath(before, change.path);
  const to = change.to;
  const record = where.section === 'grades' || where.section === 'verdicts';

  if (from === null && !rights.create) problems.push(`author "${kind}" may not create ${change.path} — a machine changes a record that exists`);
  if (to === null && !rights.remove) problems.push(`author "${kind}" may not remove ${change.path}`);
  if (problems.length) return problems;

  /* D — pins. A pin is how the analyst keeps a position he holds deliberately. */
  if (from?.lockedUntil && from.lockedUntil >= today){
    return [`${change.path} is pinned until ${from.lockedUntil} — a pinned record is the analyst's to change`];
  }

  if (record && from && to){
    const changed = changedFields(from, to);
    const outside = changed.filter(f => !STAMPS.includes(f) && !rights.fields.includes(f));
    if (outside.length) problems.push(`author "${kind}" may not change ${outside.map(f => `${change.path}.${f}`).join(', ')}`);
    if (!changed.some(f => !STAMPS.includes(f))) problems.push(`${change.path}: nothing of substance would change`);
    if (to.author !== kind) problems.push(`${change.path}: the record must say who wrote it — author "${kind}"`);

    if (where.section === 'grades'){
      /* A practitioner grade has no public evidence and its reason is private.
         A machine that cannot see the reason does not replace the grade. */
      if (from.basis === BASIS.PRACTITIONER || to.basis === BASIS.PRACTITIONER){
        problems.push(`${change.path} is a practitioner grade — it is the analyst's judgement and a machine does not write one`);
      }
      /* C — one step a run, for the agent. */
      if (kind === 'agent' && Math.abs(to.grade - from.grade) > AGENT_MAX_GRADE_STEP){
        problems.push(`${change.path}: ${from.grade} to ${to.grade} is more than ${AGENT_MAX_GRADE_STEP} step in one run`);
      }
    }
    if (where.section === 'verdicts' && to.call !== from.call){
      if (from.call === VERDICT.NOT_ACCESSIBLE || to.call === VERDICT.NOT_ACCESSIBLE){
        problems.push(`${change.path}: "not accessible" is a knock-out's reading — a machine neither sets it nor moves a call away from it`);
      } else if (kind === 'agent' && Math.abs(VERDICT_SCALE.indexOf(to.call) - VERDICT_SCALE.indexOf(from.call)) > 1){
        problems.push(`${change.path}: "${from.call}" to "${to.call}" is more than one step in one run`);
      }
    }
  }

  if (where.section === 'triggers'){
    /* Only the analyst writes a rule. An agent that could would be writing
       itself a standing instruction, and the rule class would inherit
       whatever the agent had been persuaded of. */
    if (isRule(to)) problems.push(`author "${kind}" may not write a trigger that carries an effect — a rule is the analyst's judgement, written by the analyst`);
    if (isRule(from)) problems.push(`${change.path} is a rule — only the analyst changes one`);
  }

  /* A — evidence, and G — enough of it to move a verdict. */
  problems.push(...evidenceProblems(change.evidence, kind));
  if (where.section === 'verdicts' && !verdictEvidenceSuffices(change.evidence)){
    problems.push(`${change.path}: a verdict moves on one official source or two independent ones`);
  }
  if (typeof change.author.run !== 'string' || !Number.isFinite(Date.parse(change.author.run))) problems.push('a machine author records the run it wrote in');

  if (kind === 'rule'){
    const trigger = before.triggers.find(t => t.id === change.trigger);
    if (!change.trigger || change.author.rule !== change.trigger) problems.push('a rule change names the trigger it fired on, as its trigger and as its author');
    else if (!trigger) problems.push(`"${change.trigger}" is not a trigger of ${before.marketId}`);
    else if (trigger.kind !== TRIGGER_KIND.DATA || !isRule(trigger)) problems.push(`"${change.trigger}" is not a data trigger with an effect — there is no rule to apply`);
    else if (armedAt(changelog, before.marketId, trigger.id) === null) problems.push(`"${change.trigger}" was not written by the analyst — a rule is armed only by him`);
    else if (ruleHasFired(changelog, before.marketId, trigger.id)) problems.push(`"${change.trigger}" has already fired — the analyst re-arms a rule by rewriting its trigger`);
    else {
      /* The change must be the effect, the whole effect and nothing but. */
      let expected = null;
      try { expected = effectChanges(before, trigger, { kind, asOf: to?.asOf }).find(c => c.path === change.path); }
      catch (error){ problems.push(error.message); }
      if (expected === undefined) problems.push(`${change.path} is not a record the effect of "${trigger.id}" touches`);
      else if (expected && !sameValue(expected.to, to)) problems.push(`${change.path}: the new record is not what the effect of "${trigger.id}" produces`);
    }
  }
  if (kind === 'agent' && (!change.author.model || !change.author.prompt)) problems.push('an agent records its model and prompt version');
  return problems;
}

/**
 * How a change moved the gap between a held view and the sourced grade under
 * it. Recorded on the changelog entry so the analyst's judgement leaves a
 * track record that can be counted by dimension.
 *
 *   toward / met / away / none   the SOURCED grade changed under a held view:
 *                                did the public record move to meet the
 *                                analyst, away from him, or neither
 *   opened / revised / withdrawn the HELD view itself was set, changed or
 *                                removed
 *
 * Null when no held view is involved.
 */
export const GAP_MOVEMENT = ['toward', 'met', 'away', 'none', 'opened', 'revised', 'withdrawn'];

export function gapFor(path, before, after){
  const where = parsePath(path);
  if (!where || where.section !== 'grades') return null;
  const was = before.grades[where.key], now = after.grades[where.key];

  if (where.layer === 'held'){
    const movement = !was?.held ? 'opened' : !now?.held ? 'withdrawn' : 'revised';
    return { dimension: where.key, held: now?.held?.grade ?? null, heldWas: was?.held?.grade ?? null, sourced: now.grade, movement };
  }
  if (!now?.held || !was) return null;
  const held = now.held.grade;
  const d0 = Math.abs(was.grade - held), d1 = Math.abs(now.grade - held);
  const movement = d1 === d0 ? 'none' : d1 > d0 ? 'away' : d1 === 0 ? 'met' : 'toward';
  return { dimension: where.key, held, sourcedWas: was.grade, sourced: now.grade, movement };
}

/** Problems with one changelog entry. Empty array means valid. */
export function validateChangelogEntry(entry){
  const problems = [];
  const at = (m) => problems.push(`${entry?.id || '?'}: ${m}`);
  if (!entry || typeof entry !== 'object') return ['changelog entry is missing'];
  if (typeof entry.id !== 'string' || !entry.id) at('id is missing');
  if (typeof entry.at !== 'string' || !Number.isFinite(Date.parse(entry.at))) at('at must be an ISO timestamp');
  if (typeof entry.market !== 'string' || !entry.market) at('market is missing');
  const kind = entry.author?.kind;
  if (!PERMITTED_AUTHORS.includes(kind)) at(`author.kind must be one of ${PERMITTED_AUTHORS.join(', ')}`);
  if (MACHINE_AUTHORS.includes(kind)){
    /* A machine line is only as good as what it can be traced to. */
    for (const p of evidenceProblems(entry.evidence, kind)) at(p);
    if (typeof entry.author.run !== 'string' || !Number.isFinite(Date.parse(entry.author.run))) at('a machine author records the run it wrote in, as an ISO timestamp');
    if (kind === 'rule' && (typeof entry.author.rule !== 'string' || entry.author.rule !== entry.trigger)) at('a rule entry names its rule, and the rule is the trigger it fired on');
    if (kind === 'agent' && (!entry.author.model || !entry.author.prompt)) at('an agent entry records its model and prompt version');
  }
  if (entry.reverts !== undefined && (typeof entry.reverts !== 'string' || !entry.reverts)) at('reverts must name the changelog id it undoes');
  if (!parsePath(entry.path)) at(`"${entry.path}" is not a view-store path`);
  if (!('from' in entry) || !('to' in entry)) at('from and to are both recorded, null included');
  if (!isPair(entry.reason)) at('reason must be an [en, zh] pair');
  if (!Array.isArray(entry.evidence)) at('evidence must be an array');
  if (isHeldPath(entry.path) && !HELD_AUTHORS.includes(entry.author?.kind)) at('a held view is written by the analyst alone');
  if (entry.gap !== undefined && !GAP_MOVEMENT.includes(entry.gap?.movement)) at('gap.movement is not a known movement');
  return problems;
}
