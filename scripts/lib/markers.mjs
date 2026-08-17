/* ---------------------------------------------------------------------------
   THE CONFIDENTIAL MARKER SET — loading, and proving it has not been tampered
   with.

   WHY THIS FILE EXISTS AT ALL. The marker list used to be a plaintext array in
   tests/bundle-confidentiality.test.js, and that file exempted itself from the
   scan it defined. So the detection rule was also a published copy of the
   confidential values: every marker was written into tracked source in order to
   be banned everywhere else. That trade was made once, mid-incident, and it does
   not survive contact with a second live deal.

   So the values moved out and the LOGIC stayed:

     tracked      this file, the scanner, the structural patterns, the fingerprint
     not tracked  the deal-specific markers themselves

   WHERE THE MARKERS COME FROM, in order:

     1. $GUARD_MARKER_SET        a JSON array. This is how CI gets them, from a
                                 repository secret.
     2. local-data/markers.json  a JSON array. This is how a developer gets them.
                                 local-data/ is git-ignored; see docs/data-policy.md.
     3. nowhere                  absence. Whether that is a skip or a failure is
                                 the CALLER's decision — see `required` below.

   The fingerprint key follows the same two-source pattern:

     1. $GUARD_FINGERPRINT_KEY        hex string, from a repository secret
     2. local-data/fingerprint-key.txt hex string, git-ignored

   The secret is NOT named CONFIDENTIAL_… deliberately: `CONFIDENTIAL_[A-Z_]+` is
   one of the structural patterns below, so an env var by that name would trip
   the guard on the very file that defines it. That was not theoretical — the
   first draft of this module was called exactly that and failed its own scan,
   which is a small demonstration that removing the exemptions works.

   ABSENCE IS NOT AUTOMATICALLY SAFE. A developer with no local-data/ cannot scan
   and should not be blocked; CI with no secret has scanned nothing and must go
   red. That is the same split REQUIRE_OUTPUT already makes for the build
   directory, and it is deliberately the same shape so there is one rule to learn.

   THE FINGERPRINT, and the failure it exists for. Fail-closed catches a MISSING
   marker set. It does not catch one that has been quietly edited down — which is
   not hypothetical: the August 2026 history purge rewrote the old FORBIDDEN list
   into '[REDACTED-PROJECT]' by content, leaving a guard that scanned for a string
   no bundle would ever contain and passed against anything. It was caught by
   inspection, not by a test.

   MARKER_FINGERPRINT is a committed digest over the sorted set. Any change to
   the set changes it, so a legitimate addition shows up as a diff someone has to
   justify in review, and a silent deletion fails CI. The set stays reviewable
   without being readable.

   WHY IT IS KEYED (HMAC) RATHER THAN A PLAIN HASH. An unkeyed SHA-256 of the set
   is a verification oracle, and this repository is the worst case for one: the
   ORIGINAL fourteen markers are exposed in history and cannot be un-exposed. So
   an attacker starts already knowing thirteen or fourteen of the inputs. Add one
   new low-entropy marker — a project codename, a short site name, a round number
   — and they can enumerate candidates, hash each against the known set, and
   confirm a hit against the committed digest. The digest would then leak exactly
   the value it was added to protect.

   HMAC-SHA256 under a key that is NOT in the repository removes that: without
   the key a candidate set cannot be tested, so the digest verifies the set for
   anyone holding the key and says nothing to anyone who does not.

   The key is a SECOND secret, deliberately separate from the marker set. One
   secret protecting itself is not a construction that helps.

   WHAT THIS IS NOT: security. Anyone holding the repository and local-data/ has
   the markers, exactly as they have the data the markers protect. The goal is
   to stop confidential values being PUBLISHED into tracked source, which is
   achievable, rather than to keep a secret from someone who already has it.
   --------------------------------------------------------------------------- */
import { createHmac } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const MARKERS_FILE = path.join(REPO, 'local-data', 'markers.json');

/**
 * Patterns that carry no confidential content and therefore stay tracked.
 *
 * These are shapes rather than values: a link to the confidential document
 * store, or the naming convention the prototype used for redacted third-party
 * material. Keeping them here means the generic half of the rule is reviewable
 * in the open, and only the deal-specific half needs the secret.
 *
 * Each is checked against file text exactly as the literal markers are. Note
 * that neither matches its own source text — `drive\.google\.com` does not match
 * the backslashes it is written with, and `CONFIDENTIAL_[A-Z_]+` needs a letter
 * where its own source has `[`. That is what lets this file be scanned like
 * every other tracked file instead of being exempted like its predecessor.
 */
export const STRUCTURAL_PATTERNS = [
  { name: 'confidential document store link', re: /drive\.google\.com/ },
  { name: 'redacted third-party placeholder', re: /CONFIDENTIAL_[A-Z_]+/ },
];

/**
 * Hash and cardinality of the approved marker set.
 *
 * Regenerate with `npm run guard:fingerprint` after a deliberate change, and
 * expect to justify the diff in review. A changed fingerprint with no
 * corresponding deal is the signal this exists for.
 */
export const MARKER_FINGERPRINT = {
  count: 14,
  hmacSha256: 'a7900b84ee5842c75c2573d1d7446a8e419fe509740b841d1089bde1df327ee3',
};

/**
 * Keyed digest over a marker set: sorted, JSON-encoded, HMAC-SHA256.
 *
 * `count` is deliberately still in the clear. Cardinality is not a value and
 * cannot be brute-forced into one, and every useful failure message needs it —
 * "13 markers, expected 14" is the message that tells someone a marker was
 * dropped, which is the whole point.
 *
 * @param {string[]} markers
 * @param {string} key  hex-encoded HMAC key
 */
export function fingerprintOf(markers, key){
  if (!key) throw new Error('fingerprintOf requires the HMAC key');
  const sorted = [...markers].sort();
  return {
    count: sorted.length,
    hmacSha256: createHmac('sha256', Buffer.from(key, 'hex'))
      .update(JSON.stringify(sorted), 'utf8').digest('hex'),
  };
}

const KEY_FILE = path.join(REPO, 'local-data', 'fingerprint-key.txt');

/**
 * The HMAC key, or null when it is not available.
 *
 * Separate from loadMarkers() on purpose: holding the marker set does not imply
 * holding the key, and a caller that only needs to SCAN should not be blocked by
 * a missing key it has no use for. Only fingerprint verification needs both.
 *
 * @param {object} [opts]
 * @param {boolean} [opts.required]
 * @returns {{key: string, source: string}|null}
 */
export function loadFingerprintKey({ required = false } = {}){
  const raw = process.env.GUARD_FINGERPRINT_KEY?.trim()
    || (existsSync(KEY_FILE) ? readFileSync(KEY_FILE, 'utf8').trim() : '');

  if (raw){
    if (!/^[0-9a-f]{32,}$/i.test(raw)){
      throw new Error('The fingerprint key must be at least 16 bytes, hex-encoded.');
    }
    return {
      key: raw,
      source: process.env.GUARD_FINGERPRINT_KEY?.trim() ? '$GUARD_FINGERPRINT_KEY' : 'local-data/fingerprint-key.txt',
    };
  }

  if (!required) return null;
  throw new Error(
    'No fingerprint key is available, so the marker set could not be verified.\n' +
    'Supply it as the $GUARD_FINGERPRINT_KEY repository secret, or place\n' +
    'local-data/fingerprint-key.txt for local runs.\n' +
    'The key is a SECOND secret, separate from the marker set: an unkeyed digest\n' +
    'over a set whose earlier members are already exposed in this repository\'s\n' +
    'history would let a new low-entropy marker be guessed and confirmed.');
}

/**
 * @param {object} [opts]
 * @param {boolean} [opts.required]  when true, absence throws instead of returning null
 * @returns {{markers: string[], source: string}|null}
 */
export function loadMarkers({ required = false } = {}){
  const found = fromEnv() || fromFile();

  if (!found){
    if (!required) return null;
    throw new Error(
      'No confidential marker set is available, so nothing was scanned.\n' +
      'Supply it as the $GUARD_MARKER_SET repository secret (a JSON array),\n' +
      'or place local-data/markers.json for local runs.\n' +
      'This is deliberately a failure and not a skip: a guard that scans for\n' +
      'nothing passes against everything, which is how the previous version of\n' +
      'this check sat inert through every CI run. See docs/data-policy.md.');
  }
  return found;
}

function fromEnv(){
  const raw = process.env.GUARD_MARKER_SET;
  if (!raw || !raw.trim()) return null;
  return { markers: parse(raw, '$GUARD_MARKER_SET'), source: '$GUARD_MARKER_SET' };
}

function fromFile(){
  if (!existsSync(MARKERS_FILE)) return null;
  return {
    markers: parse(readFileSync(MARKERS_FILE, 'utf8'), 'local-data/markers.json'),
    source: 'local-data/markers.json',
  };
}

/* A malformed marker set is a failure, never an empty set. Falling back to []
   would turn a typo in a secret into a guard that silently passes everything —
   the precise failure mode this module was written to close. */
function parse(raw, where){
  let value;
  try {
    value = JSON.parse(raw);
  } catch (err){
    throw new Error(`${where} is not valid JSON: ${err.message}`);
  }
  if (!Array.isArray(value) || value.some(m => typeof m !== 'string' || !m)){
    throw new Error(`${where} must be a JSON array of non-empty strings`);
  }
  if (value.length === 0){
    throw new Error(`${where} is empty. An empty marker set scans for nothing.`);
  }
  return value;
}

/**
 * Every hit in one file's text: literal markers plus structural patterns.
 * Reports the pattern NAME rather than the matched text, so a failure message
 * can be printed in CI without republishing the value that caused it.
 */
export function scanText(text, markers){
  const hits = [];
  for (const marker of markers){
    if (text.includes(marker)) hits.push(redact(marker));
  }
  for (const { name, re } of STRUCTURAL_PATTERNS){
    if (re.test(text)) hits.push(name);
  }
  return hits;
}

/**
 * How a marker is named in output.
 *
 * Printing the marker itself would put it in CI logs, which are a publication
 * channel of their own — and on a public build log, a more accessible one than
 * the repository ever was. First character, length, and nothing else: enough to
 * identify which marker fired if you hold the set, useless if you do not.
 */
export const redact = (marker) => `${marker[0]}${'•'.repeat(Math.max(1, marker.length - 1))} (${marker.length} chars)`;
