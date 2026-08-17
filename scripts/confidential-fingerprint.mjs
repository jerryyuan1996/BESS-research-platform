/* ---------------------------------------------------------------------------
   Print or verify the confidential marker set's fingerprint.

     npm run guard:fingerprint          print the current set's fingerprint
     npm run guard:fingerprint -- --check   compare it to the committed one

   Run the first form after deliberately changing the marker set, paste the
   result into MARKER_FINGERPRINT in scripts/lib/markers.mjs, and expect to
   explain the diff in review. That review step is the whole point: the set
   itself is not readable in the repository, so the fingerprint is the only
   place a change to it becomes visible.

   Prints no marker, ever — only the count and the hash.
   --------------------------------------------------------------------------- */
import {
  loadMarkers, loadFingerprintKey, fingerprintOf, MARKER_FINGERPRINT,
} from './lib/markers.mjs';

const check = process.argv.includes('--check');

const loaded = loadMarkers({ required: true });
const keyed = loadFingerprintKey({ required: true });
const actual = fingerprintOf(loaded.markers, keyed.key);

console.log(`markers : ${loaded.source}`);
console.log(`key     : ${keyed.source}`);
console.log(`count   : ${actual.count}`);
console.log(`hmac    : ${actual.hmacSha256}`);

if (!check) process.exit(0);

const ok = actual.count === MARKER_FINGERPRINT.count
  && actual.hmacSha256 === MARKER_FINGERPRINT.hmacSha256;

if (ok){
  console.log('\nmatches the committed fingerprint.');
  process.exit(0);
}

console.error(
  '\nThe marker set does not match the fingerprint committed in\n' +
  'scripts/lib/markers.mjs.\n\n' +
  `  committed : ${MARKER_FINGERPRINT.count} markers, ${MARKER_FINGERPRINT.hmacSha256}\n` +
  `  supplied  : ${actual.count} markers, ${actual.hmacSha256}\n\n` +
  'Either the set was changed without updating the fingerprint — in which case\n' +
  'update it and justify the change in review — or the set has been altered\n' +
  'without anyone intending it, which is exactly what this check exists to catch.\n' +
  'A set that has been quietly shortened produces a guard that still runs and no\n' +
  'longer detects what it was written for.');
process.exit(1);
