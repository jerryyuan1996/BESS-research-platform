import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture,CONTEXT,bodies} from './helpers/policy-fixture.mjs';
import {validatePolicySnapshot} from '../policy/schema.mjs';
import {claimDate,claimDateLabel,orderedSceneClaims,eventDates,eventVerification,compareEventVerification,matchesVerificationFreshness} from '../policy/dates.mjs';
import {policySceneProblems} from '../policy/scene-contract.mjs';
import {selectedQuotes,proposedMateriality} from '../policy/review-bundle.mjs';
import {sourceDigest} from '../policy/integrity.mjs';
const validate=s=>validatePolicySnapshot(s,{...CONTEXT,evidenceBodies:bodies()});
function unknownPublication(){
 const s=fixture('adopted');s.sources[0].issuedAt=null;s.events[0].publishedAt=null;s.events[0].kind='observation';return s;
}
test('an undated observed state does not manufacture publication, adoption or effect dates',()=>{
 const s=unknownPublication();assert.deepEqual(validate(s),[]);assert.deepEqual(eventDates(s.events[0]),[]);
 assert.equal(claimDate(s.claims[0]),'');assert.deepEqual(claimDateLabel(s.claims[0]),['Date not established','日期未确立']);
 s.events[0].kind='transition';assert.ok(validate(s).some(e=>e.includes('undated state evidence must be an observation')));
});
test('a document date needs its own typed evidence and cannot stand in for adoption or effect',()=>{
 const s=unknownPublication(),event=s.events[0];
 const c={...structuredClone(s.claims[0]),id:'dated-record',kind:'date',predicate:'document_dated_at',value:'2025-01-01T00:00:00Z',evidence:[{source:'test-source',locator:'section 1',quote:'2025-01-01T00:00:00Z',supports:'date'}]};
 s.claims.push(c);event.claimIds.push(c.id);event.recordDatedAt=c.value;assert.deepEqual(validate(s),[]);
 event.adoptedAt=c.value;assert.ok(validate(s).some(e=>e.includes('adoptedAt lacks matching dated claim')));
 delete event.adoptedAt;event.effectiveAt=c.value;assert.ok(validate(s).some(e=>e.includes('effectiveAt lacks matching dated claim')));
});
test('a contextual predecessor date is labelled and cannot satisfy a provision effective date',()=>{
 const s=unknownPublication(),c={...structuredClone(s.claims[0]),id:'predecessor',kind:'date',predicate:'context_at',value:'2025-01-01T00:00:00Z',dateSubject:['Named predecessor','所列前序规则'],evidence:[{source:'test-source',locator:'section 1',quote:'2025-01-01T00:00:00Z',supports:'date'}]};
 s.claims.push(c);s.events[0].claimIds.push(c.id);assert.deepEqual(validate(s),[]);
 assert.deepEqual(claimDateLabel(c),['Context date: Named predecessor','背景日期: 所列前序规则']);
 s.events[0].effectiveAt=c.value;assert.ok(validate(s).some(e=>e.includes('effectiveAt lacks matching dated claim')));
 delete s.events[0].effectiveAt;delete c.dateSubject;assert.ok(validate(s).some(e=>e.includes('dateSubject')));
});
test('state-preserving notices append an existing history and cannot invent a new first state',()=>{
 const s=unknownPublication(),notice={...structuredClone(s.events[0]),id:'later-notice',kind:'notice',from:'adopted',to:'adopted'};
 s.events.push(notice);assert.deepEqual(validate(s),[]);
 notice.to='effective';assert.ok(validate(s).some(e=>e.includes('notice must preserve')));
 const first=unknownPublication();first.events[0].kind='notice';first.events[0].from='adopted';assert.ok(validate(first).some(e=>e.includes('notice must preserve')));
});
test('a second initial observation cannot erase an existing legal history',()=>{
 const s=unknownPublication();s.events.push({...structuredClone(s.events[0]),id:'second-observation'});assert.ok(validate(s).some(e=>e.includes('observation records only the first')));
});
test('chronology sorts real date claims while before-after order and unknown dates stay explicit',()=>{
 const early={id:'early',kind:'date',value:'2021-12-02',predicate:'document_dated_at'},late={id:'late',kind:'date',value:'2026-09-02',predicate:'effective_at'},state={id:'state',kind:'legal_status',value:'adopted'};
 assert.deepEqual(orderedSceneClaims('timeline',[late,state,early]).map(c=>c.id),['early','late','state']);
 assert.deepEqual(orderedSceneClaims('before_after',[late,early]),[late,early]);
 assert.deepEqual(claimDateLabel(early),['Document dated','文件落款']);
 const snapshot={claims:[early,state],impacts:[]};
 assert.ok(policySceneProblems({template:'timeline',claimIds:['state'],impactIds:[]},snapshot).length);
 assert.deepEqual(policySceneProblems({template:'timeline',claimIds:['early'],impactIds:[]},snapshot),[]);
});
test('explicit selection survives duplicate headings and refuses stale context, offsets, bounds and hashes',()=>{
 const body='Formula index: 4.29.1F.\nOther topic.\n4.29.1F. greater of zero and a divided by days less peak.',quote='greater of zero and a divided by days less peak.',start=body.indexOf(quote),span={start,end:start+quote.length,textHash:sourceDigest(body),quoteHash:sourceDigest(quote)};
 assert.deepEqual(selectedQuotes({body},[span]),[quote]);
 for(const changed of [{...span,start:0},{...span,end:body.length+1},{...span,quoteHash:'sha256:'+'a'.repeat(64)},{...span,unexpected:true}])assert.throws(()=>selectedQuotes({body},[changed]));
 assert.throws(()=>selectedQuotes({body:body.replace('Other topic.','Changed topic.')},[span]),/context hash differs/);
 assert.throws(()=>selectedQuotes({body},[]));
});
test('relevant historical context is routine, scope exclusions are inapplicable and unresolved scope is quarantined',()=>{
 assert.equal(proposedMateriality({market:'nem',mechanism:'context',applicability:'applicable'}).outcome,'routine');
 assert.equal(proposedMateriality({market:'wa',mechanism:'context',applicability:'excluded'}).outcome,'not_applicable');
 assert.equal(proposedMateriality({market:'wa',mechanism:'eligibility',applicability:'unresolved'}).outcome,'uncertain_or_conflicting');
 assert.equal(proposedMateriality({market:'wa',mechanism:'eligibility',applicability:'applicable'}).outcome,'material_investment_review');
});


test('pending verification never falls back to preparation, retrieval or legal dates',()=>{
 const event={id:'pending',verifiedAt:null,createdAt:'2026-11-06T00:00:00Z',preparedAt:'2026-11-06T00:00:00Z',checkedAt:'2026-11-06T00:00:00Z',publishedAt:'2025-01-01T00:00:00Z'};
 assert.deepEqual(eventVerification(event),{at:null,label:['Verification pending','待核实']});
 assert.equal(eventVerification({...event,verifiedAt:'2026-11-06'}).at,null);
});
test('event ordering uses only recorded verification and leaves pending records last',()=>{
 const early={id:'early',verifiedAt:'2026-10-01T00:00:00Z',createdAt:'2030-01-01T00:00:00Z'},later={id:'later',verifiedAt:'2026-11-01T00:00:00Z'},pending={id:'pending',verifiedAt:null,createdAt:'2030-01-01T00:00:00Z'};
 assert.deepEqual([pending,early,later].sort(compareEventVerification).map(e=>e.id),['later','early','pending']);
 assert.deepEqual(eventVerification(early).label,['Verified','已核实']);
});
test('an unverified event qualifies for neither recent nor stale verification filters',()=>{
 const now=Date.parse('2026-11-10T00:00:00Z');
 for(const filter of ['recent','stale'])assert.equal(matchesVerificationFreshness({verifiedAt:null},filter,now),false);
 assert.equal(matchesVerificationFreshness({verifiedAt:null},'',now),true);
 assert.equal(matchesVerificationFreshness({verifiedAt:'2026-11-09T00:00:00Z'},'recent',now),true);
 assert.equal(matchesVerificationFreshness({verifiedAt:'2026-10-01T00:00:00Z'},'stale',now),true);
 assert.equal(matchesVerificationFreshness({verifiedAt:'2026-11-11T00:00:00Z'},'recent',now),false);
});
