/* ---------------------------------------------------------------------------
   Scan STAGED CONTENT for confidential markers. Runs as a pre-commit hook.

   WHY NOT REUSE THE TRACKED-TREE TEST. Because it reads the wrong bytes. It
   enumerates paths with `git ls-files` and then reads each one from the WORKING
   TREE — and those are different contents whenever the index and the working
   tree disagree. Stage a confidential file, revert the working copy, and the
   test reads a clean file while the confidential blob sits in the index, ready
   to be committed.

   In CI that gap is invisible: a fresh checkout has index, HEAD and working tree
   identical. Locally it is wide open, and locally is where a commit is made.

   So this reads `git show :<path>` — the staged blob itself, the exact bytes the
   commit will contain. Nothing else is authoritative about what is about to
   become permanent.

   WHAT IT DOES NOT REPLACE. CI. A hook is bypassable with --no-verify and absent
   on a fresh clone until `npm run guard:install` is run. It moves detection
   earlier; it does not move it anywhere safer. The CI gate remains the thing
   that cannot be skipped.

   Exit codes: 0 clean or nothing staged · 1 marker found · 2 could not scan.
   --------------------------------------------------------------------------- */
import { execFileSync } from 'node:child_process';
import { loadMarkers, scanText, REPO } from './lib/markers.mjs';

const git = (args, opts = {}) =>
  execFileSync('git', args, { cwd: REPO, maxBuffer: 1 << 28, ...opts });

function stagedPaths(){
  /* ACMR: added, copied, modified, renamed. Deletions cannot carry content, and
     including them would mean trying to read blobs that are gone. */
  const out = git(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR']).toString();
  return out.split('\0').filter(Boolean);
}

/**
 * Reads one staged blob.
 *
 * THREE OUTCOMES, NOT TWO, and the previous version collapsed them. It returned
 * null for "binary" and null for "could not read", and the caller skipped both.
 * So a blob git refused to hand over was silently treated as clean — a file that
 * cannot be scanned reported as a file with nothing in it. That is the same
 * vacuous pass this whole guard exists to make unreachable, in miniature.
 *
 * @returns {{text: string}|{binary: true}|{error: Error}}
 */
function stagedContent(rel){
  let buf;
  try {
    buf = git(['show', `:${rel}`]);
  } catch (err){
    return { error: err };
  }
  /* Read as a buffer first: decoding a binary file as UTF-8 produces replacement
     characters that would defeat the NUL test and make the substring scan
     meaningless. */
  if (buf.includes(0)) return { binary: true };
  return { text: buf.toString('utf8') };
}

/**
 * Container formats that carry documents whole, and whose contents this scanner
 * cannot see: a marker inside a PDF or an Office file is compressed, so the
 * substring scan reads past it and reports clean.
 *
 * A confidential deck or report committed as a file is the exact leak this
 * repository has already had once, in a different wrapper. So these are refused
 * rather than skipped.
 */
const HIGH_RISK_BINARY = /\.(pdf|docx?|dotx?|pptx?|potx?|xlsx?|xlsm|xltx?|zip|7z|rar|tar|t?gz|msg|eml|pages|numbers|key)$/i;

/**
 * Paths exempt from that refusal.
 *
 * Exact shapes rather than a bare extension: the five tracked workbooks are ETL
 * parser fixtures and live in one directory. A blanket ".xlsx is fine" would
 * re-open the hole for the next spreadsheet, which in this domain is the most
 * likely confidential file of all.
 */
const BINARY_ALLOWLIST = [
  /^tests\/fixtures\/workbooks\/[^/]+\.xlsx$/,
];

function main(){
  let loaded;
  try {
    loaded = loadMarkers({ required: true });
  } catch (err){
    console.error(`\n  confidentiality: ${err.message}\n`);
    /* Distinct from a marker hit. The commit is blocked either way, but "the
       guard could not run" and "the guard found something" are different
       problems with different fixes, and collapsing them would send someone
       hunting for confidential content that is not there. */
    process.exit(2);
  }

  const paths = stagedPaths();
  if (paths.length === 0) process.exit(0);

  const hits = [];
  const refused = [];
  const unreadable = [];
  let scanned = 0;

  for (const rel of paths){
    /* BY PATH, BEFORE READING. Deciding this from the CONTENT — "does the blob
       contain a NUL byte" — was wrong twice over. A .docx whose bytes happen to
       carry no NUL is scanned as text, matches nothing, and commits clean; and
       the check would be asking whether this particular file looks binary rather
       than whether the FORMAT hides content from a substring scan. The format is
       the property that matters, and the extension is how it is declared. */
    if (HIGH_RISK_BINARY.test(rel) && !BINARY_ALLOWLIST.some(re => re.test(rel))){
      refused.push(rel);
      continue;
    }

    const result = stagedContent(rel);

    if (result.error){
      unreadable.push({ rel, message: result.error.message });
      continue;
    }

    /* Remaining binaries — images, fonts — are skipped, and that stays an
       acknowledged limit rather than an oversight. They are not document
       containers, and a marker in one would not be plaintext anyway. */
    if (result.binary) continue;

    scanned++;
    for (const hit of scanText(result.text, loaded.markers)) hits.push({ rel, hit });
  }

  /* An unreadable blob is neither clean nor dirty; it is unscanned. Exit 2, the
     same code as "the guard could not run", because that is what happened. */
  if (unreadable.length){
    console.error('\n  COMMIT BLOCKED — a staged blob could not be read, so it was not scanned.\n');
    for (const { rel, message } of unreadable) console.error(`    ${rel}  →  ${message}`);
    console.error(
      '\n  This is not a pass. A file the scanner cannot open is a file whose\n' +
      '  contents are unknown, and reporting it as clean is the vacuous-pass\n' +
      '  failure this guard exists to make impossible.\n\n' +
      '  Usually a partially-staged or concurrently-modified index. Re-stage and\n' +
      '  retry; if it persists, run "npm run guard:staged" to see it directly.\n');
    process.exit(2);
  }

  if (refused.length){
    console.error('\n  COMMIT BLOCKED — a document container is staged.\n');
    for (const rel of refused) console.error(`    ${rel}`);
    console.error(
      '\n  These formats are compressed, so a confidential name inside one is\n' +
      '  invisible to a substring scan: it would commit clean and stay readable.\n' +
      '  A confidential report committed whole is the leak this repository has\n' +
      '  already had once, in a different wrapper.\n\n' +
      '  Put it in local-data/, which is git-ignored. If it genuinely belongs in\n' +
      '  the repository, add its path to BINARY_ALLOWLIST in this file and say\n' +
      '  why in the commit message.\n');
    process.exit(1);
  }

  if (hits.length === 0){
    console.log(`  confidentiality: ${scanned} staged file(s) scanned, clean.`);
    process.exit(0);
  }

  console.error('\n  COMMIT BLOCKED — confidential content is staged.\n');
  for (const { rel, hit } of hits) console.error(`    ${rel}  →  ${hit}`);
  console.error(
    '\n  The marker is shown redacted on purpose; hook output ends up in logs\n' +
    '  and scrollback, which are publication channels of their own.\n\n' +
    '  Move the content into local-data/, which is git-ignored, and unstage it:\n' +
    '      git restore --staged <path>\n\n' +
    '  Removing it at HEAD later is NOT enough once pushed — the object stays\n' +
    '  reachable by SHA. See docs/data-policy.md.\n');
  process.exit(1);
}

main();
