import { POLICY_AUTHORIZATION } from '../../policy/authorization.mjs';
import { TRUSTED_POLICY_PROFILES,APPROVED_HISTORICAL_EVALUATION } from '../../policy/validation-profiles.mjs';
import { activationProblems } from '../../policy/activation.mjs';
import { candidateEnvelopeProblems } from '../../policy/candidate-envelope.mjs';
import { POLICY_SOURCES } from '../../policy/source-inventory.mjs';
import { independentlyValidate } from '../../policy/validation.mjs';
import { publishPolicySnapshot,retainedVerification } from '../../policy/writer.mjs';
import { loadMarkers,loadFingerprintKey,fingerprintOf,MARKER_FINGERPRINT,scanText } from '../lib/markers.mjs';
import { marketIds } from '../../src/markets/registry.js';
import { fetchPolicyEvidence,bodiesForSnapshot } from './evidence.mjs';
import { ROOT,readReport,writeReport } from './runtime-io.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { publicInvestmentReferences } from './public-references.mjs';
async function run(){
  if(POLICY_AUTHORIZATION.publicationEnabled!==true)return {status:'disabled',changed:false};
  if(activationProblems({config:POLICY_AUTHORIZATION,sources:POLICY_SOURCES,profiles:TRUSTED_POLICY_PROFILES,evaluation:APPROVED_HISTORICAL_EVALUATION}).length)return {status:'quarantined',changed:false,reason:'Concrete policy activation gates are incomplete'};
  const snapshot=await readReport('policy-candidate.json');if(!snapshot)return {status:'no_candidate',changed:false};
  const report=await readReport('policy-research.json');
  if(process.env.GITHUB_ACTIONS!=='true'||candidateEnvelopeProblems({snapshot,report,runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT}).length)return {status:'quarantined',changed:false,reason:'Candidate is not bound to this publisher workflow run/attempt'};
  snapshot.createdAt=new Date().toISOString();
  if(POLICY_SOURCES.some(s=>!s.reviewed||!s.rightsReviewed)||!TRUSTED_POLICY_PROFILES.length)return {status:'quarantined',changed:false,reason:'Independent source/rights approval missing'};
  const markers=loadMarkers({required:true});const actual=fingerprintOf(markers.markers,loadFingerprintKey({required:true}).key);
  if(actual.count!==MARKER_FINGERPRINT.count||actual.hmacSha256!==MARKER_FINGERPRINT.hmacSha256||scanText(JSON.stringify(snapshot),markers.markers).length)return {status:'quarantined',changed:false,reason:'Original confidentiality gate rejected policy candidate'};
  let index=null;try{index=JSON.parse(await readFile(path.join(ROOT,'public/data/public/policy/index.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  const retained=await retainedVerification(ROOT,snapshot,index?.head??null);
  const evidence=await fetchPolicyEvidence();const bodies=bodiesForSnapshot(snapshot,evidence.documents);
  // Missing public investment references remain unmapped; a model is never
  // permitted to invent resolution or load private notes to complete it.
  const validation=independentlyValidate({snapshot,bodies,profiles:TRUSTED_POLICY_PROFILES,marketIds:marketIds(),publicReferences:await publicInvestmentReferences(marketIds()),retained});
  if(!validation.valid)return {status:'quarantined',changed:false,errors:validation.errors};
  return {status:'independently_verified',...await publishPolicySnapshot({repo:ROOT,snapshot,context:validation.context,bodies,expectedParent:index?.head??null,enabled:true})};
}
let result;try{result=await run();}catch{result={status:'quarantined',changed:false,reason:'Policy verification/publication failed; last known-good retained'};}
await writeReport('policy-validation.json',result);console.log(JSON.stringify(result));
