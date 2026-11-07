import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {STATIC_POLICY_ADMISSION as admission} from '../policy/static-release.mjs';
import {TRUSTED_POLICY_PROFILES as profiles,APPROVED_HISTORICAL_EVALUATION as evaluation} from '../policy/validation-profiles.mjs';
import {MANUAL_POLICY_PUBLICATION as manualPublication} from '../policy/publication-authorization.mjs';
import {POLICY_AUTHORIZATION as config} from '../policy/authorization.mjs';
import {MANUAL_EVALUATION_AUTHORIZATION} from '../policy/manual-authorization.mjs';
import {POLICY_SOURCES} from '../policy/source-inventory.mjs';
import {digest} from '../policy/integrity.mjs';
import {evaluateHistoricalCases,approvedEvaluationProblems} from '../policy/evaluation.mjs';
import {quotationRightsProblems} from '../policy/quotation-rights.mjs';
import {verifyPolicyStore} from '../policy/verify-store.mjs';
import {marketIds} from '../src/markets/registry.js';
const repo=fileURLToPath(new URL('..',import.meta.url));
const snapshot=JSON.parse(await readFile(path.join(repo,'public/data/public/policy/snapshots',admission.releaseSnapshotHash+'.json'),'utf8'));

test('owner admission binds only the fixed 23-document 47-binding historical proposal and exact release',()=>{
  assert.equal(admission.proposalFileSHA256,'a8c6d20fba8630e2e4c48b4bc4a134e550ee4c8a81fc821858c7d59bf937067f');
  assert.equal(admission.documents.length,23);assert.equal(admission.bindings.length,47);assert.equal(profiles.length,23);
  assert.deepEqual(manualPublication.approvedHeads,[digest(snapshot)]);
  assert.equal(admission.sourceUse.newAutomatedAcquisition,false);assert.equal(admission.sourceUse.extendsToNewDocumentsOrHashes,false);
  assert.equal(admission.sourceUse.waGovAcquisitionStopLifted,false);assert.equal(admission.sourceAdmissionIsRightsWaiver,false);
  assert.equal(admission.fcasGuideIncorporatedTerms.confirmedOriginalReuseGrantClaimed,false);
});
test('static admission cannot activate model, paid evaluation or source discovery',()=>{
  assert.equal(config.enabled,false);assert.equal(config.publicationEnabled,false);assert.equal(config.maxDailyUSD,null);
  assert.equal(MANUAL_EVALUATION_AUTHORIZATION.enabled,false);assert.equal(MANUAL_EVALUATION_AUTHORIZATION.manualEvaluationApproved,false);
  assert.ok(POLICY_SOURCES.every(s=>s.reviewed===false&&s.rightsReviewed===false));
  assert.ok(profiles.every(p=>p.modelTransmission===false&&p.maxQuoteChars===0&&!p.prepareManualEvidence));
  assert.ok(Object.isFrozen(admission)&&Object.isFrozen(admission.bindings[0]));
});
test('historical measurements retain the approved 16 cases and 85-unit denominator without model accuracy',()=>{
  const measured=evaluateHistoricalCases(evaluation.cases);assert.equal(measured.eligible,true);assert.equal(measured.cases,16);
  assert.equal(measured.criticalAssertions,85);assert.equal(measured.unsupportedAssertions,0);assert.equal(measured.falseReviewPositives,0);assert.equal(measured.falseReviewNegatives,0);
  assert.equal(evaluation.method,'deterministic_source_regression');assert.equal(evaluation.modelAccuracy,null);assert.equal(evaluation.reviewedAt,null);
  assert.ok(approvedEvaluationProblems(evaluation,{requireModel:true,model:'unapproved-model'}).length>0);
});
test('fixed source validators reject changed bytes, new locators, translations, records and timestamps',()=>{
  assert.ok(profiles.every(p=>p.verifyStoredSnapshot({snapshot})));
  const changes=[s=>s.sources[0].url+='?changed',s=>s.sources[0].locator+=' changed',s=>s.claims[0].text[1]+=' changed',s=>s.events[0].verifiedAt='2026-11-07T03:00:00.000Z',s=>s.sources[0].rights.reproduction='bounded_excerpt'];
  for(const change of changes){const next=structuredClone(snapshot);change(next);assert.ok(profiles.every(p=>p.verifyStoredSnapshot({snapshot:next})===false));}
  const source=snapshot.sources[0],profile=profiles.find(p=>p.sourceIds.includes(source.id));
  assert.equal(profile.validate({source,claims:snapshot.claims,body:'Unverified substitute body.',snapshot}).sourceSupported,false);
});
test('zero-excerpt document limits and unresolved investment/currentness safeguards survive admission',()=>{
  const reviews=new Map(snapshot.sources.map(s=>[s.id,{sourceHash:digest(s),maxQuoteChars:0}]));
  assert.deepEqual(quotationRightsProblems(snapshot,reviews),[]);
  assert.ok(snapshot.claims.every(c=>c.evidence.every(e=>e.reproduction==='withheld'&&!Object.hasOwn(e,'quote'))));
  assert.ok(snapshot.sources.every(s=>s.rights.reproduction==='facts_only'));assert.ok(snapshot.links.every(l=>l.state==='unmapped'));
  assert.equal(snapshot.reviews.length,27);assert.ok(snapshot.reviews.every(r=>r.status==='pending_reassessment'));
  assert.ok(snapshot.instruments.every(i=>i.currentness.status==='unknown'&&i.currentness.asOf===null));
});
test('a new checksum and matching index cannot borrow exact static source admission',async()=>{
  const temporary=await mkdtemp(path.join(os.tmpdir(),'policy-static-boundary-'));
  try{
    const index=JSON.parse(await readFile(path.join(repo,'public/data/public/policy/index.json'),'utf8'));
    const changed=structuredClone(snapshot);changed.claims[0].text[0]+=' Unreviewed change.';const head=digest(changed);
    index.head=head;index.versions=[head];const target=path.join(temporary,'public/data/public/policy/snapshots');await mkdir(target,{recursive:true});
    await writeFile(path.join(target,head+'.json'),JSON.stringify(changed));await writeFile(path.join(target,'../index.json'),JSON.stringify(index));
    await assert.rejects(verifyPolicyStore({repo:temporary,config,profiles,evaluation,manualPublication:{...manualPublication,approvedHeads:[head]},marketIds:marketIds()}),/independent source validation/);
  }finally{assert.equal(path.dirname(temporary),path.resolve(os.tmpdir()));await rm(temporary,{recursive:true,force:true});}
});
