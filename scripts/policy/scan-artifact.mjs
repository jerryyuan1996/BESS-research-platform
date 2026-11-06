import { loadMarkers,loadFingerprintKey,fingerprintOf,MARKER_FINGERPRINT,scanText } from '../lib/markers.mjs';
import { readReport } from './runtime-io.mjs';
const markers=loadMarkers({required:true});const actual=fingerprintOf(markers.markers,loadFingerprintKey({required:true}).key);
if(actual.count!==MARKER_FINGERPRINT.count||actual.hmacSha256!==MARKER_FINGERPRINT.hmacSha256)throw new Error('Original confidentiality fingerprint did not verify');
let count=0;for(const name of ['policy-candidate.json','policy-research.json']){const report=await readReport(name);if(report){if(scanText(JSON.stringify(report),markers.markers).length)throw new Error('Policy artifact rejected by the original confidentiality guard');count++;}}
console.log(`Original confidentiality guard scanned ${count} policy report(s); no raw evidence bodies are uploaded.`);
