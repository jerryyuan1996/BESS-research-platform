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

   WHO MAY WRITE IT, TODAY: THE ANALYST, AND NOBODY ELSE. The plan this store
   comes from goes on to let rules and an agent write here. That is a later
   phase and it needs the authority model rewritten first. Until then the
   writer refuses any author that is not the analyst, and the ETL's own write
   boundary still stops at public/data/public/ — tests/governance.test.js
   asserts that and this store does not ask it to stop.

   This module is the schema: it says what a valid market view is and which
   paths a change may touch. The writer and the tests both use it, so the thing
   that is checked on the way in is the thing that is asserted afterwards.
   --------------------------------------------------------------------------- */

import {
  DIMENSION_IDS, ARCHETYPE_IDS, validateGrade, validateVerdict,
} from '../../src/governance/investability.js';
import { validateTrigger } from '../../src/governance/triggers.js';

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

/** Who may write the view today. See the header: this is one name on purpose. */
export const PERMITTED_AUTHORS = ['analyst'];

/**
 * Who may write a held view: the analyst, and this list does not grow.
 *
 * Kept apart from PERMITTED_AUTHORS deliberately. The plan goes on to let
 * rules and an agent write sourced grades, and when that list is widened this
 * one must not move with it: a held view is the analyst's own judgement, and
 * a machine that could write it would be writing his opinion for him.
 */
export const HELD_AUTHORS = ['analyst'];

/** May this kind of author write this path? The gate asks here and nowhere else. */
export function authorMayWrite(path, kind){
  if (!parsePath(path)) return false;
  return isHeldPath(path) ? HELD_AUTHORS.includes(kind) : PERMITTED_AUTHORS.includes(kind);
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
  if (!PERMITTED_AUTHORS.includes(entry.author?.kind)) at(`author.kind must be one of ${PERMITTED_AUTHORS.join(', ')}`);
  if (!parsePath(entry.path)) at(`"${entry.path}" is not a view-store path`);
  if (!('from' in entry) || !('to' in entry)) at('from and to are both recorded, null included');
  if (!isPair(entry.reason)) at('reason must be an [en, zh] pair');
  if (!Array.isArray(entry.evidence)) at('evidence must be an array');
  if (isHeldPath(entry.path) && !HELD_AUTHORS.includes(entry.author?.kind)) at('a held view is written by the analyst alone');
  if (entry.gap !== undefined && !GAP_MOVEMENT.includes(entry.gap?.movement)) at('gap.movement is not a known movement');
  return problems;
}
