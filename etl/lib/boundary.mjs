/* ---------------------------------------------------------------------------
   THE WRITE BOUNDARY.

   Every byte the ETL writes to disk goes through this module. Nothing else in
   etl/ may import node:fs — tests/governance.test.js asserts that, so the rule
   is enforced rather than merely documented.

   The boundary is a single allowed root:

       public/data/public/

   Not src/. Not docs/. Not a market module. If a future connector "just needs"
   to update one field in a manifest, the answer is that it opens a pull request
   instead. That is the entire governance model expressed as a filesystem check,
   and it is deliberately the least clever code in the repository — a wall is
   only useful if you cannot talk your way around it.

   Path containment is checked on the RESOLVED real path, so `../` traversal and
   symlinks cannot escape. On Windows the comparison is case-insensitive, which
   matches how the filesystem actually behaves; getting that wrong would let a
   check pass locally and fail in CI, or worse, the reverse.
   --------------------------------------------------------------------------- */
import { writeFile, mkdir, readFile, readdir, rename, copyFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Repository root, resolved from this file's location rather than cwd.
    cwd differs between `npm run etl`, a CI step and an editor task runner. */
export const REPO_ROOT = path.resolve(HERE, '..', '..');

/** The one directory the ETL may write to. */
export const ALLOWED_WRITE_ROOT = path.join(REPO_ROOT, 'public', 'data', 'public');

/** Directories the ETL may read from, for reference data it does not own. */
export const READABLE_ROOTS = [
  path.join(REPO_ROOT, 'public', 'data'),
  path.join(REPO_ROOT, 'src'),
  path.join(REPO_ROOT, 'etl'),
];

class BoundaryViolation extends Error {
  constructor(message){
    super(message);
    this.name = 'BoundaryViolation';
  }
}

/** True when `target` is inside `root` (or is `root`). Case-folded on Windows. */
function isInside(root, target){
  const rel = path.relative(root, target);
  if (rel === '') return true;
  if (rel.startsWith('..')) return false;
  // path.relative returns an absolute path when the two are on different drives.
  return !path.isAbsolute(rel);
}

function normalizeForCompare(p){
  return process.platform === 'win32' ? path.resolve(p).toLowerCase() : path.resolve(p);
}

/**
 * Resolve a repo-relative path and assert it falls inside the allowed root.
 * Throws BoundaryViolation rather than returning a flag: a connector that has
 * got this wrong must stop, not continue with a fallback.
 */
export function assertWritable(repoRelativePath){
  const abs = path.resolve(REPO_ROOT, repoRelativePath);
  const root = normalizeForCompare(ALLOWED_WRITE_ROOT);
  const target = normalizeForCompare(abs);

  if (!isInside(root, target)){
    throw new BoundaryViolation(
      `ETL attempted to write outside the allowed root.\n` +
      `  attempted : ${abs}\n` +
      `  allowed   : ${ALLOWED_WRITE_ROOT}\n` +
      `\n` +
      `Automation may not modify analyst-controlled files. If an observation ` +
      `implies an assumption should change, open a pull request — see ` +
      `docs/governance.md.`);
  }
  return abs;
}

/**
 * Write a JSON snapshot. The only write path in the ETL.
 *
 * Returns { written, path, reason }. `written: false` with reason 'unchanged' is
 * the common and desirable case: the cron runs every few hours and most runs
 * find the same data. Rewriting an identical file would produce an empty commit
 * per run and bury real changes in the history — the history IS the audit trail
 * here, so keeping it honest matters.
 */
export async function writeSnapshot(repoRelativePath, snapshot){
  const abs = assertWritable(repoRelativePath);
  const body = JSON.stringify(snapshot, null, 2) + '\n';

  if (existsSync(abs)){
    const current = await readFile(abs, 'utf8');
    if (current === body){
      return { written: false, path: abs, reason: 'unchanged' };
    }
    // Compare content checksums so a changed fetch timestamp alone does not
    // count as a change. See envelope.mjs for what the checksum covers.
    try {
      const prev = JSON.parse(current);
      if (prev?.contentChecksum && prev.contentChecksum === snapshot.contentChecksum){
        return { written: false, path: abs, reason: 'content-identical' };
      }
    } catch {
      // Unparseable existing file — overwrite it. A corrupt snapshot is worse
      // than a rewritten one.
    }
  }

  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, body, 'utf8');
  return { written: true, path: abs, reason: existsSync(abs) ? 'updated' : 'created' };
}

/** Read a previously written snapshot, or null when absent. */
export async function readSnapshot(repoRelativePath){
  const abs = path.resolve(REPO_ROOT, repoRelativePath);
  if (!isInside(normalizeForCompare(path.join(REPO_ROOT, 'public', 'data')), normalizeForCompare(abs))){
    throw new BoundaryViolation(`Snapshot reads are confined to public/data/: ${abs}`);
  }
  if (!existsSync(abs)) return null;
  try {
    return JSON.parse(await readFile(abs, 'utf8'));
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------------------
   Atomic publication primitives.

   These live here, and not in etl/lib/publish.mjs, for the reason the header
   gives: the boundary is only a boundary if it is the sole exit. A publisher
   that reached for `renameSync` itself would bypass every containment check
   above, so it asks for the write instead and this module performs it.

   The split is policy versus mechanism. publish.mjs decides WHETHER a dataset
   may replace the last known-good artifact; this decides HOW bytes reach disk
   without a reader ever seeing a half-written file.
   --------------------------------------------------------------------------- */

/**
 * Write a file atomically: a temporary file in the SAME directory, then rename.
 *
 * Same directory matters — `rename` is only atomic within a filesystem, and a
 * temp file in the OS temp directory can be on a different one, which silently
 * degrades the guarantee to a copy.
 */
export async function writeAtomic(repoRelativePath, body){
  const abs = assertWritable(repoRelativePath);
  await mkdir(path.dirname(abs), { recursive: true });
  const temporary = path.join(path.dirname(abs), `.${path.basename(abs)}.tmp`);
  await writeFile(temporary, body, 'utf8');
  await renameWithRetry(temporary, abs);
  return abs;
}

/* Windows can refuse the rename with EPERM even when the path is writable and
   nothing is wrong with it: any process holding a transient handle on the
   destination — a file watcher, an indexer, a scanner — blocks the replace for
   a few milliseconds. POSIX has no equivalent, so this failure only ever shows
   up on one platform and only under load, which is exactly the shape of a bug
   that reaches production untested. It surfaced as an intermittent test
   failure while a dev server was watching the output directory.

   Retrying is correct rather than merely convenient: the rename is the atomic
   step, so a failed attempt has changed nothing and a later attempt sees the
   same state. Only the transient permission and lock codes are retried;
   anything else is a real error and is rethrown at once.

   The temporary file is removed if every attempt fails, so a blocked write does
   not leave a dotfile behind for the next run to trip over. */
const TRANSIENT_RENAME = new Set(['EPERM', 'EACCES', 'EBUSY']);

async function renameWithRetry(from, to, attempts = 8){
  for (let k = 0; k < attempts; k++){
    try {
      await rename(from, to);
      return;
    } catch (err){
      const last = k === attempts - 1;
      if (!TRANSIENT_RENAME.has(err.code) || last){
        await rm(from, { force: true }).catch(() => {});
        if (last && TRANSIENT_RENAME.has(err.code)){
          throw new Error(
            `could not replace ${path.basename(to)} after ${attempts} attempts: ` +
            `${err.code}. Another process is holding the file — on Windows this is ` +
            'usually a file watcher, indexer or scanner on the output directory.',
            { cause: err });
        }
        throw err;
      }
      await new Promise(r => setTimeout(r, 10 * (k + 1)));
    }
  }
}

/** Copy a published artifact to another path inside the allowed root. */
export async function copyWithin(fromRepoRelative, toRepoRelative){
  const from = assertWritable(fromRepoRelative);
  const to = assertWritable(toRepoRelative);
  if (!existsSync(from)) return false;
  await copyFile(from, to);
  return true;
}

/** Delete a file inside the allowed root. Absent is success, not an error. */
export async function removeWithin(repoRelativePath){
  const abs = assertWritable(repoRelativePath);
  if (!existsSync(abs)) return false;
  await rm(abs);
  return true;
}

/** Read text from inside the readable roots, or null when absent/unreadable. */
export async function readTextIfPresent(repoRelativePath){
  const abs = path.resolve(REPO_ROOT, repoRelativePath);
  if (!READABLE_ROOTS.some(root => isInside(normalizeForCompare(root), normalizeForCompare(abs)))){
    throw new BoundaryViolation(`Reads are confined to the readable roots: ${abs}`);
  }
  if (!existsSync(abs)) return null;
  try {
    return await readFile(abs, 'utf8');
  } catch {
    return null;
  }
}

/** Every snapshot currently on disk. Used by the drift report and the CI gate. */
export async function listSnapshots(){
  if (!existsSync(ALLOWED_WRITE_ROOT)) return [];
  const names = await readdir(ALLOWED_WRITE_ROOT);
  return names.filter(n => n.endsWith('.json'));
}

export { BoundaryViolation };
