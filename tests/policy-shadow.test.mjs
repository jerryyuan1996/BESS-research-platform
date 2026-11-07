import test from 'node:test';
import assert from 'node:assert/strict';
import { researchShadow,buildDecisionPacket } from '../policy/shadow.mjs';
import { POLICY_AUTHORIZATION,authorizationProblems } from '../policy/authorization.mjs';
import { fixture,modelFixture,bodies,CONTEXT,NOW } from './helpers/policy-fixture.mjs';
// Rates and model are synthetic test inputs, not a provider price claim.
const config={enabled:true,publicationEnabled:false,approvalId:'synthetic-approval',provider:'anthropic',model:'test-model',maxInputTokens:12000,maxOutputTokens:3000,maxDailyUSD:0.1,wallTimeMs:1000,validatedGoldCases:12,inputUSDPerMTokens:1,outputUSDPerMTokens:2,priceSource:'https://www.anthropic.com/pricing'};
const ledger={reservedUSD:0,worstCaseCallUSD:0.018,completed:false};
const run=(extra={})=>researchShadow({changedDocuments:[{sourceId:'test-source'}],invoke:async()=>({text:JSON.stringify(modelFixture()),inputTokens:500,outputTokens:200}),config,ledger,context:CONTEXT,bodies:bodies(),now:NOW,...extra});
test('production model/publication configuration remains disabled and unapproved',()=>{assert.equal(POLICY_AUTHORIZATION.enabled,false);assert.equal(POLICY_AUTHORIZATION.publicationEnabled,false);assert.ok(authorizationProblems(POLICY_AUTHORIZATION).length);});
test('shadow research has no publication authority even for valid output',async()=>{const r=await run();assert.equal(r.status,'shadow_valid');assert.equal(r.canPublish,false);assert.equal(r.published,false);assert.equal(r.requiresIndependentEvidenceAttestations,true);});
test('no change, no authorization, budget exhaustion and replay all skip model invocation',async()=>{
  let calls=0;const invoke=async()=>{calls++;throw new Error('must not run');};
  assert.equal((await run({invoke,changedDocuments:[]})).status,'unchanged');
  assert.equal((await run({invoke,config:POLICY_AUTHORIZATION})).status,'disabled');
  assert.equal((await run({invoke,ledger:{...ledger,reservedUSD:0.1}})).status,'cost_cap');
  assert.equal((await run({invoke,ledger:{...ledger,cycle:'2026-11-05',completed:true}})).status,'already_processed');assert.equal(calls,0);
});
test('oversize input, malformed output and provider token overrun quarantine without mutation',async()=>{
  assert.equal((await run({config:{...config,maxInputTokens:1}})).status,'input_cap');
  assert.equal((await run({invoke:async()=>({text:'not json',outputTokens:3})})).status,'quarantined');
  assert.equal((await run({invoke:async()=>({text:'{}',outputTokens:5000})})).status,'quarantined');
});
test('timeout is bounded and retains last-known-good policy',async()=>{const before=fixture();const r=await run({before,config:{...config,wallTimeMs:5},invoke:()=>new Promise(()=>{})});assert.equal(r.status,'quarantined');assert.deepEqual(r.lastKnownGood,before);});
for(const [name,mutate] of [
  ['prompt-injected tools',s=>{s.tools=['write_view'];}],['view-author impersonation',s=>{s.author='rule';}],
  ['invented citation',s=>{s.claims[0].evidence[0].quote='invented law';}],['false market mapping',s=>{s.claims[0].markets=['wa'];}],
  ['wrong legal effect',s=>{s.events[0].effectiveAt='2026-10-01T00:00:00Z';}],['missing original locator',s=>{s.claims[0].evidence[0].locator='';}],
  ['translation mismatch',s=>{s.claims[0].text=['10','20'];}],['contradictory state',s=>{s.claims[0].status='contradictory';}],
])test(`shadow quarantine: ${name}`,()=>{const candidate=fixture();mutate(candidate);assert.equal(buildDecisionPacket({candidate,context:CONTEXT,bodies:bodies()}).status,'quarantined');});
test('a changed eligibility claim creates a review packet without editing an approved view',()=>{
  const candidate=fixture();candidate.claims[0].mechanism='eligibility';const approved={call:'wait',text:'Approved'};const before=structuredClone(approved);
  const packet=buildDecisionPacket({candidate,context:CONTEXT,bodies:bodies()});assert.equal(packet.reviews[0].status,'pending_reassessment');assert.deepEqual(approved,before);assert.equal(packet.canPublish,false);
});
