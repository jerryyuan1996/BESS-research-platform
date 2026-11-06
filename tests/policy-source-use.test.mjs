import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,readFile} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
import {fixture,CONTEXT,bodies,attestedContext} from './helpers/policy-fixture.mjs';
import {validatePolicySnapshot} from '../policy/schema.mjs';
import {digest,sourceDigest,verifyEvidenceHashes} from '../policy/integrity.mjs';
import {projectEvidence,sourceTransmissionProblems} from '../policy/source-use.mjs';
import {publishPolicySnapshot} from '../policy/writer.mjs';
import {retainedProofs} from '../policy/retained.mjs';
import {quotationRightsProblems} from '../policy/quotation-rights.mjs';
import {investmentReviewDrafts} from '../policy/investment-review-drafts.mjs';
import {policySceneProblems} from '../policy/scene-contract.mjs';
import {criticalValueInQuote} from '../policy/evidence-values.mjs';
import {orderedSceneClaims,claimDate,claimDateBounds,definitelyBefore} from '../policy/dates.mjs';
function protectedFixture(){
 const s=fixture('adopted'),source=s.sources[0],quoteProofs=new Map();
 Object.assign(source.rights,{reproduction:'facts_only',attribution:['Synthetic authority — Synthetic record','模拟机关 — 模拟文件'],license:['Factual summary only','仅事实摘要'],changes:['Original expression omitted','省略原文表达']});
 s.claims[0].evidence=[projectEvidence({source,quote:'adopted',kind:'legal_status',quoteProofs})];
 return {s,quoteProofs};
}
test('facts-only projection omits text while private hashes and original spans remain mandatory',()=>{
 const {s,quoteProofs}=protectedFixture(),e=s.claims[0].evidence[0];
 assert.equal(Object.hasOwn(e,'quote'),false);assert.equal(e.quoteHash,sourceDigest('adopted'));
 assert.deepEqual(validatePolicySnapshot(s,{...CONTEXT,evidenceBodies:bodies(),quoteProofs}),[]);
 assert.deepEqual(verifyEvidenceHashes(s,bodies(),{quoteProofs}),[]);
 assert.ok(validatePolicySnapshot(s,{...CONTEXT,evidenceBodies:bodies()}).some(x=>x.includes('private quotation proof')));
 assert.ok(verifyEvidenceHashes(s,bodies()).some(x=>x.includes('proof hash')));
 const wrong=new Map([[e.source+':'+e.quoteHash,'consultation']]);
 assert.ok(verifyEvidenceHashes(s,bodies(),{quoteProofs:wrong}).some(x=>x.includes('proof hash')));
 const wrongBody=bodies();wrongBody.set(e.source,wrongBody.get(e.source).replace('adopted','removed'));
 assert.ok(verifyEvidenceHashes(s,wrongBody,{quoteProofs}).length);
});
test('candidate rights flags cannot authorize protected reproduction or remove attribution',()=>{
 const {s,quoteProofs}=protectedFixture();
 s.claims[0].evidence[0]={source:s.sources[0].id,locator:'section 1',quote:'adopted',supports:'legal_status'};
 assert.ok(validatePolicySnapshot(s,{...CONTEXT,evidenceBodies:bodies(),quoteProofs}).some(x=>x.includes('reproduction contradicts')));
 assert.ok(quotationRightsProblems(s,new Map([[s.sources[0].id,{sourceHash:digest(s.sources[0]),maxQuoteChars:999}]])).some(x=>x.includes('protected reproduction')));
 delete s.sources[0].rights.attribution;
 assert.ok(validatePolicySnapshot(s,CONTEXT).some(x=>x.includes('attribution incomplete')));
});
test('only byte-identical retained claims can reuse approved withheld evidence without original bodies',()=>{
 const {s}=protectedFixture(),source=s.sources[0],claim=s.claims[0],index={head:digest(s),verification:{sources:{[source.id]:{sourceHash:digest(source),maxQuoteChars:0}},claims:{[claim.id]:{claimHash:digest(claim),supported:true,translationEquivalent:true}}}};
 const next=structuredClone(s),same=retainedProofs(index,s,next);
 assert.deepEqual(verifyEvidenceHashes(next,new Map(),{retainedSourceIds:same.sourceIds,retainedClaimIds:same.claimIds}),[]);
 next.claims[0].text=['Changed meaning','含义改变'];const changed=retainedProofs(index,s,next);
 assert.equal(changed.claimIds.size,0);assert.ok(verifyEvidenceHashes(next,new Map(),{retainedSourceIds:changed.sourceIds,retainedClaimIds:changed.claimIds}).some(x=>x.includes('proof hash')));
});
test('writer rejects missing private proof and publishes only the safe synthetic projection',async()=>{
 const {s,quoteProofs}=protectedFixture(),repo=await mkdtemp(path.join(os.tmpdir(),'policy-rights-proof-'));
 const context=attestedContext(s);context.sourceReviews.get(s.sources[0].id).maxQuoteChars=0;
 await assert.rejects(()=>publishPolicySnapshot({repo,snapshot:s,context,bodies:bodies(),expectedParent:null,enabled:true}),/quotation proof/);
 context.quoteProofs=quoteProofs;
 const result=await publishPolicySnapshot({repo,snapshot:s,context,bodies:bodies(),expectedParent:null,enabled:true});
 const saved=JSON.parse(await readFile(path.join(repo,'public/data/public/policy/snapshots',result.head+'.json'),'utf8'));
 assert.equal(saved.claims[0].evidence[0].quote,undefined);assert.equal(saved.quoteProofs,undefined);assert.deepEqual(saved,s);
 const proof=JSON.parse(await readFile(path.join(repo,'public/data/public/policy/index.json'),'utf8'));
 assert.equal(JSON.stringify(proof).includes('quotes'),false);
});
test('source-specific model transmission is separately bound and cannot send facts-only originals',()=>{
 const {s}=protectedFixture(),source=s.sources[0],documents=[{source}];
 const approved=new Map([[source.id,{sourceHash:digest(source),modelTransmission:true}]]);
 assert.equal(sourceTransmissionProblems(documents,approved).length,1);
 source.rights.reproduction='bounded_excerpt';
 assert.equal(sourceTransmissionProblems(documents,approved).length,1);
 assert.equal(sourceTransmissionProblems(documents,new Map([[source.id,{sourceHash:digest(source),modelTransmission:true}]] )).length,0);
 assert.equal(sourceTransmissionProblems(documents,new Map()).length,1);
});
test('historical periods preserve year/month precision and cannot become legal effect dates',()=>{
 const s=fixture('adopted'),c={...structuredClone(s.claims[0]),id:'history-period',kind:'date',predicate:'context_at',value:'2023-05',datePrecision:'month',dateSubject:['Earlier open letter','较早公开信'],text:['An earlier letter in 2023-05.','2023-05的较早公开信。'],evidence:[{source:'test-source',locator:'section 1',quote:'May 2023',supports:'date'}]};
 s.claims.push(c);const b=bodies();b.set('test-source',b.get('test-source')+' May 2023');s.sources[0].contentHash=sourceDigest(b.get('test-source'));
 assert.deepEqual(validatePolicySnapshot(s,{...CONTEXT,evidenceBodies:b}),[]);assert.equal(claimDate(c),'2023-05');
 c.predicate='effective_at';assert.ok(validatePolicySnapshot(s,{...CONTEXT,evidenceBodies:b}).some(x=>x.includes('invalid date value')));
 for(const [value,precision,quote,expected]of [['2022','year','since the start of 2022',true],['2023-12','month','early December\n2023',true],['2023-12','month','December 2024',false]])assert.equal(criticalValueInQuote({kind:'date',value,datePrecision:precision},quote,{language:'en'}),expected);
 assert.equal(claimDateBounds({kind:'date',value:'2023-13',datePrecision:'month'}),null);
});
test('overlapping periods do not invent a within-period sequence',()=>{
 const month={id:'month',kind:'date',value:'2023-05',datePrecision:'month'},day={id:'day',kind:'date',value:'2023-05-03'},early={id:'early',kind:'date',value:'2022',datePrecision:'year'},late={id:'late',kind:'date',value:'2023-06-01'};
 assert.equal(definitelyBefore(month,day),false);assert.equal(definitelyBefore(day,month),false);
 assert.deepEqual(orderedSceneClaims('timeline',[late,month,day,early]).map(c=>c.id),['early','month','day','late']);
 assert.deepEqual(orderedSceneClaims('timeline',[late,day,month,early]).map(c=>c.id),['early','day','month','late']);
});
test('unquantified impact scenes require the same evidence anchor and cannot accept a number',()=>{
 const snapshot={claims:[{id:'claim-one',kind:'fact',markets:['gb']}],impacts:[{id:'impact-one',claim:'claim-one',lane:'not_quantifiable',value:null}]},scene={template:'impact_summary',claimIds:['claim-one'],impactIds:['impact-one'],relations:[]};
 assert.deepEqual(policySceneProblems(scene,snapshot,{storyClaimIds:['claim-one']}),[]);
 snapshot.impacts[0].value=10;assert.ok(policySceneProblems(scene,snapshot).length);snapshot.impacts[0].value=null;snapshot.impacts[0].claim='another-claim';assert.ok(policySceneProblems(scene,snapshot).length);
});
test('investment review drafts pin an existing public baseline without approving or rewriting it',()=>{
 const s=fixture('adopted');s.claims[0].id='cl-case-one';s.events[0].claimIds=['cl-case-one'];s.claims[0].mechanism='grid_access';
 const before=JSON.stringify(s),references={'view/markets/gb.json#thesis':{market:'gb',publicValue:['Synthetic approved call','模拟已批准结论']}},referenceBefore=JSON.stringify(references),cases=[{id:'case-one',market:'gb',mechanism:'grid_access',applicability:'applicable'}];
 const d=investmentReviewDrafts(s,cases,references);assert.equal(JSON.stringify(s),before);assert.equal(JSON.stringify(references),referenceBefore);
 assert.equal(d.links[0].state,'unmapped');assert.equal(d.links[0].approvedAt,null);assert.equal(d.reviews[0].status,'pending_reassessment');assert.equal(d.baselines[0].publicRecordHash,digest(references[d.links[0].target]));
 s.links=d.links;s.reviews=d.reviews;assert.deepEqual(validatePolicySnapshot(s,{...CONTEXT,evidenceBodies:bodies()}),[]);
 s.links[0].state='current';assert.ok(validatePolicySnapshot(s,CONTEXT).some(x=>x.includes('approvedAt')));
 assert.throws(()=>investmentReviewDrafts(s,cases,{}),/existing public reference/);
});
test('retrieval time cannot establish currentness or an instrument verification time',()=>{
 const s=fixture('adopted');s.instruments[0].currentness={status:'unknown',asOf:null,scope:['As-issued source only','仅所引原始版本']};
 assert.deepEqual(validatePolicySnapshot(s,CONTEXT),[]);
 s.instruments[0].currentness.asOf=s.sources[0].checkedAt;
 assert.ok(validatePolicySnapshot(s,CONTEXT).some(x=>x.includes('availability is not current law')));
 s.instruments[0].currentness.asOf=null;s.instruments[0].currentness.status='verified';
 assert.ok(validatePolicySnapshot(s,CONTEXT).some(x=>x.includes('currentness')));
});
