/* ---------------------------------------------------------------------------
   THE VIEW WRITER — the only code that writes view/.

   One writer, as etl/lib/boundary.mjs is the only code that writes published
   data. It validates before it writes, so an invalid change is never on disk,
   and it appends the changelog in the same call, so a change that is on disk is
   never unrecorded.

   WHY THIS IS IN scripts/ AND NOT IN etl/. The plan places it at
   etl/lib/viewWriter.mjs, where rules and an agent will one day call it. Today
   they may not: the authority model says no judgement is automated, and
   tests/governance.test.js asserts that nothing under etl/ touches the
   filesystem except through a boundary that stops at public/data/public/.
   Putting the writer there would mean weakening that test before the decision
   it protects has been rewritten. So it sits with the other tools a person
   runs, the ETL cannot reach it, and it moves when the wall is redrawn.

   THE GATE. A change is applied only if all of these hold:

     · the author is the analyst
     · the path is a view-store path — whole records, never methodology
     · a held view is written by the analyst alone, at its own path, and has a
       private reason in the local overlay explaining it
     · it carries a reason in both languages
     · it changes something
     · the whole market view is valid afterwards

   A change that fails throws and writes nothing.

   Run as a tool:  node scripts/view/writer.mjs apply <change.json>
   --------------------------------------------------------------------------- */
import { readFile, writeFile, mkdir, appendFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  emptyView, validateMarketView, parsePath, readPath, writePath, buildIndex,
  validateChangelogEntry, authorMayWrite, isHeldPath, gapFor,
} from '../../view/schema/view.mjs';
import { NOTES_KEY, heldNote } from '../../src/local/notes.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** The store in the repository. Tests pass their own root. */
export const VIEW_ROOT = path.resolve(HERE, '..', '..', 'view');

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

/* The private overlay, read from disk. This writer runs on the analyst's own
   machine, where the folder exists; anywhere else there is no file and no
   held view can be written — which is the intended result, not a gap. */
const LOCAL_NOTES = path.resolve(HERE, '..', '..', 'local-data', `${NOTES_KEY}.json`);

async function readLocalNotes(){
  if (!existsSync(LOCAL_NOTES)) return null;
  return JSON.parse(await readFile(LOCAL_NOTES, 'utf8'));
}

/**
 * @param root   the store's directory; tests pass a temporary one
 * @param notes  how to read the private overlay; tests pass their own
 */
export function createViewStore(root = VIEW_ROOT, { notes = readLocalNotes } = {}){
  const marketFile = (id) => path.join(root, 'markets', `${id}.json`);
  const indexFile = path.join(root, 'index.json');
  const changelogFile = path.join(root, 'changelog.jsonl');

  async function read(marketId){
    if (!/^[a-z][a-z0-9_]*$/.test(marketId)) throw new ViewRejected(`"${marketId}" is not a market id`);
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
   */
  async function prepare(change, now = new Date()){
    if (!change || typeof change !== 'object') throw new ViewRejected('change is missing');
    if (!parsePath(change.path)){
      throw new ViewRejected(`"${change.path}" is not a view-store path — methodology is not written here`);
    }
    if (!authorMayWrite(change.path, change.author?.kind)){
      throw new ViewRejected(isHeldPath(change.path)
        ? `author "${change.author?.kind}" may not write a held view — it is the analyst's own judgement and only the analyst writes it`
        : `author "${change.author?.kind}" may not write the view — only the analyst today`);
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
         published, so it is required where it CAN be checked: here, on the
         machine that has the overlay. */
      const reason = heldNote(change.market, where.key, await notes());
      if (!reason){
        throw new ViewRejected(`${change.market} ${change.path}: no private reason in local-data/${NOTES_KEY}.json — add held.${where.key}.reason for this market first`);
      }
    }

    const before = await read(change.market);
    const from = readPath(before, change.path);
    if (same(from, change.to)) throw new ViewRejected(`${change.market} ${change.path}: nothing would change`);

    let after;
    try { after = writePath(before, change.path, change.to); }
    catch (error){ throw new ViewRejected(error.message); }
    const problems = validateMarketView(after);
    if (problems.length) throw new ViewRejected(`${change.market} ${change.path}: the view would be invalid`, problems);

    const at = now.toISOString();
    const entry = {
      id: `${at}-${change.market}-${change.path}`,
      at, market: change.market,
      author: change.author,
      path: change.path, from, to: change.to,
      reason: change.reason,
      evidence,
      ...(change.trigger ? { trigger: change.trigger } : {}),
      ...(gapFor(change.path, before, after) ? { gap: gapFor(change.path, before, after) } : {}),
    };
    const entryProblems = validateChangelogEntry(entry);
    if (entryProblems.length) throw new ViewRejected('the changelog entry would be invalid', entryProblems);
    return { after, entry };
  }

  /** Apply one change: the market file, the index and the changelog line. */
  async function apply(change, now = new Date()){
    const { after, entry } = await prepare(change, now);
    await mkdir(path.join(root, 'markets'), { recursive: true });
    await writeFile(marketFile(change.market), stringify(after), 'utf8');
    await writeFile(indexFile, stringify(buildIndex(await readAll())), 'utf8');
    await appendFile(changelogFile, `${JSON.stringify(entry)}\n`, 'utf8');
    return entry;
  }

  return { root, read, readAll, changelog, prepare, apply };
}

/* ---- command line ---------------------------------------------------------- */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  const [command, file] = process.argv.slice(2);
  if (command !== 'apply' || !file){
    console.error('usage: node scripts/view/writer.mjs apply <change.json>\n       the file holds one change, or an array of them');
    process.exit(2);
  }
  const loaded = JSON.parse(await readFile(file, 'utf8'));
  const store = createViewStore();
  try {
    for (const change of Array.isArray(loaded) ? loaded : [loaded]){
      const entry = await store.apply(change);
      console.log(`  ${entry.market}  ${entry.path}`);
    }
  } catch (error){
    console.error(error.message);
    process.exit(1);
  }
}
