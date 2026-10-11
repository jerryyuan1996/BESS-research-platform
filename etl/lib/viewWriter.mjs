/* ---------------------------------------------------------------------------
   THE VIEW WRITER — the only code that writes view/.

   One writer, as boundary.mjs is the only code that writes published data.
   The ETL has two exits now and this is the second: boundary.mjs writes
   public/data/public/ and validates a snapshot; this writes view/ and
   validates a judgement. Neither can reach the other's directory, and neither
   can reach src/.

   It validates before it writes, so an invalid change is never on disk, and it
   appends the changelog in the same call, so a change that is on disk is never
   unrecorded.

   WHAT IT MAY WRITE. Three kinds of file under the store's root and nothing
   else: markets/<id>.json, index.json and changelog.jsonl. Not view/schema/,
   which is code and says who may write what. Not src/, where methodology
   lives. See assertViewWritable.

   TWO DOORS. A rule and the agent come in from etl/rules.mjs and
   agent/run.mjs. The analyst comes in through the command line in scripts/,
   which wraps this store with the one check that needs his private overlay.
   This module never reads that overlay and has no path to it: a held view is
   refused here unless the caller supplies the check, and no caller under etl/
   or agent/ does.

   THE GATE (plan §7.4). A change is applied only if all of these hold:

     · the author is a known kind, may write that path, and is live
     · the path is a view-store path — whole records, never methodology
     · a held view is the analyst's alone, at its own path
     · it carries a reason in both languages
     · it changes something
     · a machine change passes machineProblems: evidence, pins, the size of
       the step, and for a rule, that it is exactly its trigger's effect
     · the whole market view is valid afterwards
     · the changelog line it produces is valid, and is built from the change

   A change that fails throws and writes nothing. A BATCH that fails anywhere,
   or that is larger than the cap, writes nothing at all.
   --------------------------------------------------------------------------- */
import { readFile, writeFile, mkdir, appendFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  emptyView, validateMarketView, parsePath, readPath, writePath, buildIndex,
  validateChangelogEntry, authorMayWrite, isHeldPath, gapFor,
  PERMITTED_AUTHORS, MACHINE_AUTHORS, LIVE_AUTHORS, machineProblems,
} from '../../view/schema/view.mjs';
import { MAX_MACHINE_CHANGES_PER_RUN } from '../../src/governance/automation.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..');

/** The store in the repository. Tests pass their own root. */
export const VIEW_ROOT = path.join(REPO_ROOT, 'view');

export class ViewRejected extends Error {
  constructor(message, problems = []){
    super(problems.length ? `${message}\n  ${problems.join('\n  ')}` : message);
    this.name = 'ViewRejected';
    this.problems = problems;
  }
}

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/* Stable, diffable JSON: two-space indent and a trailing newline. Key order is
   whatever the record was built with, which the schema's helpers keep steady. */
const stringify = (value) => `${JSON.stringify(value, null, 2)}\n`;

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const MARKET_ID = /^[a-z][a-z0-9_]*$/;

/**
 * The absolute path of a store file, or a throw. The store has three kinds of
 * file and this names them; everything else under the root, and everything
 * outside it, is not this writer's to touch.
 */
export function assertViewWritable(root, relative){
  const rel = String(relative).replace(/\\/g, '/');
  const market = /^markets\/([^/]+)\.json$/.exec(rel);
  const ok = rel === 'index.json' || rel === 'changelog.jsonl' || (market && MARKET_ID.test(market[1]));
  if (!ok) throw new ViewRejected(`the view writer does not write "${rel}" — only markets/<id>.json, index.json and changelog.jsonl`);
  return path.join(root, ...rel.split('/'));
}

/**
 * Where a run leaves its report: etl/out/, which is never committed. The one
 * write this module makes outside the store, and it cannot be pointed
 * anywhere else — the name is a bare filename.
 */
export async function writeRunReport(name, body){
  if (!/^[a-z][a-z0-9-]*\.(json|md)$/.test(name)) throw new ViewRejected(`"${name}" is not a report name`);
  const dir = path.join(REPO_ROOT, 'etl', 'out');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), body, 'utf8');
  return path.join(dir, name);
}

/**
 * @param root          the store's directory; tests pass a temporary one
 * @param heldReason    async (market, dimension) => truthy when the analyst's
 *                      private reason for a held view exists. Absent, no held
 *                      view can be written through this store.
 * @param heldMissing   the message when it does not
 */
export function createViewStore(root = VIEW_ROOT, { heldReason = null, heldMissing = null } = {}){
  const marketFile = (id) => assertViewWritable(root, `markets/${id}.json`);
  const indexFile = assertViewWritable(root, 'index.json');
  const changelogFile = assertViewWritable(root, 'changelog.jsonl');

  async function read(marketId){
    if (!MARKET_ID.test(marketId)) throw new ViewRejected(`"${marketId}" is not a market id`);
    if (!existsSync(marketFile(marketId))) return emptyView(marketId);
    return JSON.parse(await readFile(marketFile(marketId), 'utf8'));
  }

  async function readAll(){
    const dir = path.join(root, 'markets');
    if (!existsSync(dir)) return [];
    const files = (await readdir(dir)).filter(f => f.endsWith('.json')).sort();
    return Promise.all(files.map(f => read(f.slice(0, -5))));
  }

  async function changelog(){
    if (!existsSync(changelogFile)) return [];
    return (await readFile(changelogFile, 'utf8')).split('\n').filter(Boolean).map(line => JSON.parse(line));
  }

  /**
   * Check a change and return what applying it would produce, writing nothing.
   * `apply` is this plus the writes, so a dry run and a real one cannot differ.
   *
   * `state` lets a batch be prepared as a sequence: each change sees the view
   * and the changelog the earlier ones would leave.
   */
  async function prepare(change, now = new Date(), state = null){
    if (!change || typeof change !== 'object') throw new ViewRejected('change is missing');
    if (!parsePath(change.path)){
      throw new ViewRejected(`"${change.path}" is not a view-store path — methodology is not written here`);
    }
    const kind = change.author?.kind;
    if (!PERMITTED_AUTHORS.includes(kind) || !authorMayWrite(change.path, kind)){
      throw new ViewRejected(isHeldPath(change.path)
        ? `author "${kind}" may not write a held view — it is the analyst's own judgement and only the analyst writes it`
        : `author "${kind}" may not write the view at ${change.path}`);
    }
    if (!isPair(change.reason)) throw new ViewRejected('a change carries a reason as an [en, zh] pair');
    if (change.to === undefined) throw new ViewRejected('a change states its new value; null removes the record');
    const evidence = change.evidence ?? [];
    if (!Array.isArray(evidence)) throw new ViewRejected('evidence must be an array');

    const where = parsePath(change.path);
    if (where.section === 'grades' && !where.layer && change.to && 'held' in change.to){
      throw new ViewRejected(`${change.market} ${change.path}: a held view is written at ${change.path}.held, never inside the sourced grade`);
    }
    if (where.layer === 'held' && change.to !== null){
      /* The reason for a held view is the one thing about it that cannot be
         published, so it is required where it CAN be checked: on the machine
         that has the overlay, by the caller that can read it. */
      if (!heldReason || !(await heldReason(change.market, where.key))){
        throw new ViewRejected(`${change.market} ${change.path}: ${heldMissing ? heldMissing(where.key) : 'no private reason is available to this writer — a held view is written through the analyst\'s own command line'}`);
      }
    }

    const before = state?.views.get(change.market) ?? await read(change.market);
    const log = state?.log ?? await changelog();
    const from = readPath(before, change.path);
    if (same(from, change.to)) throw new ViewRejected(`${change.market} ${change.path}: nothing would change`);

    if (MACHINE_AUTHORS.includes(kind)){
      const problems = machineProblems(change, before, { changelog: log, today: now.toISOString().slice(0, 10) });
      if (problems.length) throw new ViewRejected(`${change.market} ${change.path}: refused to ${kind}`, problems);
    } else if ((where.section === 'grades' || where.section === 'verdicts') && !where.layer && change.to && change.to.author !== kind){
      /* The stamp on a record is who wrote it last. A person replacing a
         record a rule wrote takes it back in name as well. */
      throw new ViewRejected(`${change.market} ${change.path}: the record says author "${change.to.author}" and the change is the ${kind}'s`);
    }

    let after;
    try { after = writePath(before, change.path, change.to); }
    catch (error){ throw new ViewRejected(error.message); }
    const problems = validateMarketView(after);
    if (problems.length) throw new ViewRejected(`${change.market} ${change.path}: the view would be invalid`, problems);

    const at = now.toISOString();
    const gap = gapFor(change.path, before, after);
    const entry = {
      id: `${at}-${change.market}-${change.path}`,
      at, market: change.market,
      author: change.author,
      path: change.path, from, to: change.to,
      reason: change.reason,
      evidence,
      ...(change.trigger ? { trigger: change.trigger } : {}),
      ...(change.reverts ? { reverts: change.reverts } : {}),
      ...(gap ? { gap } : {}),
    };
    const entryProblems = validateChangelogEntry(entry);
    if (entryProblems.length) throw new ViewRejected('the changelog entry would be invalid', entryProblems);
    if (log.some(e => e.id === entry.id)) throw new ViewRejected(`${entry.id}: a changelog id repeats — two changes to one path in the same instant`);
    return { after, entry };
  }

  async function write(prepared){
    await mkdir(path.join(root, 'markets'), { recursive: true });
    for (const { after } of prepared) await writeFile(marketFile(after.marketId), stringify(after), 'utf8');
    await writeFile(indexFile, stringify(buildIndex(await readAll())), 'utf8');
    await appendFile(changelogFile, prepared.map(p => `${JSON.stringify(p.entry)}\n`).join(''), 'utf8');
  }

  const assertLive = (change) => {
    if (!LIVE_AUTHORS.includes(change?.author?.kind)){
      throw new ViewRejected(`author "${change?.author?.kind}" is not live — its changes are reported, not applied`);
    }
  };

  /** Apply one change: the market file, the index and the changelog line. */
  async function apply(change, now = new Date()){
    const prepared = await prepare(change, now);
    assertLive(change);
    await write([prepared]);
    return prepared.entry;
  }

  /**
   * Prepare several changes as one run, each seeing what the earlier ones
   * leave. Writes nothing. Throws on the first refusal, or when the run would
   * make more machine changes than the cap allows (guardrail E).
   */
  async function prepareBatch(changes, now = new Date(), { cap = MAX_MACHINE_CHANGES_PER_RUN } = {}){
    const machine = changes.filter(c => MACHINE_AUTHORS.includes(c?.author?.kind)).length;
    if (machine > cap){
      throw new ViewRejected(`this run would make ${machine} machine changes and the cap is ${cap} — nothing is written`);
    }
    const state = { views: new Map(), log: [...await changelog()] };
    const prepared = [];
    for (const change of changes){
      const one = await prepare(change, now, state);
      state.views.set(change.market, one.after);
      state.log.push(one.entry);
      prepared.push(one);
    }
    return prepared;
  }

  /** Apply a run's changes, all of them or none. */
  async function applyBatch(changes, now = new Date(), options = {}){
    const prepared = await prepareBatch(changes, now, options);
    changes.forEach(assertLive);
    if (prepared.length) await write(prepared);
    return prepared.map(p => p.entry);
  }

  /**
   * The change that undoes a changelog entry (guardrail I). The analyst's, and
   * only good while the path still holds what that entry left: a record that
   * has moved on since is not silently rolled back over.
   */
  async function revertChange(id, { reason = null } = {}){
    const log = await changelog();
    const entry = log.find(e => e.id === id);
    if (!entry) throw new ViewRejected(`"${id}" is not a changelog id`);
    const now = readPath(await read(entry.market), entry.path);
    if (!same(now, entry.to)) throw new ViewRejected(`${entry.market} ${entry.path} has changed since ${id} — revert the later change first, or write the record you want`);
    /* The restored record is the analyst's now: he chose to put it back. */
    const where = parsePath(entry.path);
    const stamped = entry.from && !where.layer && (where.section === 'grades' || where.section === 'verdicts');
    return {
      market: entry.market, path: entry.path, to: stamped ? { ...entry.from, author: 'analyst' } : entry.from,
      author: { kind: 'analyst' },
      reason: reason ?? [`Reverts the change of ${entry.at.slice(0, 10)}.`, `撤销${entry.at.slice(0, 10)}的变更。`],
      evidence: [],
      reverts: id,
    };
  }

  async function revert(id, now = new Date(), options = {}){
    return apply(await revertChange(id, options), now);
  }

  return { root, read, readAll, changelog, prepare, apply, prepareBatch, applyBatch, revertChange, revert };
}
