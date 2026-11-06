import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, symlink, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { validatePolicySnapshot, policyMateriality, PublicInvestmentReferenceResolver } from '../policy/schema.mjs';
import { digest,snapshotDiff,versionDelta,replayVersion } from '../policy/integrity.mjs';
import { assertPolicyWritable,publishPolicySnapshot } from '../policy/writer.mjs';
import { fixture,bodies,CONTEXT,NOW,attestedContext } from './helpers/policy-fixture.mjs';
const validate=s=>validatePolicySnapshot(s,{...CONTEXT,evidenceBodies:bodies()});
test('a fully sourced synthetic policy snapshot is valid without financial-model authority',()=>assert.deepEqual(validate(fixture()),[]));
const negativeCases=[
  ['draft treated as effective law',s=>{s.events[0].to='effective';s.instruments[0].state='effective';}],
  ['wrong effective date',s=>{s.events[0].to='effective';s.instruments[0].state='effective';s.events[0].effectiveAt='2030-01-01T00:00:00Z';}],
  ['plausible but unsourced past effective date',s=>{s.events[0].effectiveAt='2025-01-02T00:00:00Z';}],
  ['repeal rewritten as new consultation',s=>{s.events.push({...s.events[0],id:'second-event',from:'repealed',to:'consultation'});}],
  ['duplicate instrument identity',s=>{s.instruments.push({...s.instruments[0],id:'duplicate-instrument'});}],
  ['missing original source',s=>{s.sources=[];}],
  ['headline as legal source',s=>{s.sources[0].authority='news';}],
  ['unknown investment market',s=>{s.instruments[0].markets=['unknown'];}],
  ['Australia country tag mis-scopes NEM fact to WA',s=>{s.instruments[0].markets=['nem'];s.claims[0].markets=['wa'];}],
  ['conflicting legal evidence',s=>{s.claims[0].status='contradictory';}],
  ['missing original language',s=>{s.sources[0].language='';}],
  ['unreviewed translation',s=>{s.claims[0].translationReviewed=false;}],
  ['missing Chinese translation',s=>{s.claims[0].text=['English',''];}],
  ['bilingual numeric mismatch',s=>{s.claims[0].text=['Amount 10','金额20'];}],
  ['invented number',s=>{s.claims[0].kind='number';s.claims[0].value=42;s.claims[0].evidence[0].supports='number';s.claims[0].evidence[0].quote='Amount 42';}],
  ['unreviewed source licence',s=>{s.sources[0].rights.reviewed=false;}],
  ['unapproved nested source-rights fields',s=>{s.sources[0].rights.notes='Synthetic unapproved field';}],
  ['fake original locator',s=>{s.claims[0].evidence[0].locator='invented section';}],
  ['host redirect outside reviewed allowlist',s=>{s.sources[0].url='https://unapproved.example/record';}],
  ['attempted rule-author impersonation',s=>{s.claims[0].author='rule';}],
  ['attempted write-path smuggling',s=>{s.writePath='view/markets/gb.json';}],
];
for(const [name,mutate]of negativeCases)test(`reject ${name}`,()=>{const s=fixture();mutate(s);assert.ok(validate(s).length>0);});
for(const state of ['draft','consultation','amended','adopted','effective','suspended','withdrawn','repealed','superseded'])test(`recorded synthetic lifecycle state ${state} validates independently of investment views`,()=>assert.deepEqual(validate(fixture(state)),[]));
test('immutable snapshot hashing is key-order stable and exact diffs reconstruct before/after',()=>{
  const before=fixture();const after=structuredClone(before);after.claims[0].text=['Revised test','修订测试'];
  const changes=snapshotDiff(before,after);assert.equal(changes.length,1);assert.deepEqual(changes[0].before,before.claims[0]);assert.deepEqual(changes[0].after,after.claims[0]);
  assert.equal(digest({a:1,b:2}),digest({b:2,a:1}));assert.notEqual(digest(before),digest(after));
});
test('binary eligibility is material without a computed IRR; unsupported facts quarantine',()=>{
  assert.equal(policyMateriality({verified:true,markets:['gb'],mechanisms:['eligibility']}).outcome,'material_investment_review');
  assert.equal(policyMateriality({verified:false,markets:['gb'],mechanisms:['eligibility']}).outcome,'uncertain_or_conflicting');
  assert.equal(policyMateriality({verified:true,markets:[]}).outcome,'not_applicable');
  assert.equal(policyMateriality({verified:true,markets:['gb'],mechanisms:['context']}).outcome,'routine');
});
test('public resolver cannot mutate an approved conclusion and reports dangling mappings',()=>{
  const records={'view/markets/gb.json#thesis':{market:'gb',text:'Approved conclusion',approvedAt:NOW}};
  const resolver=new PublicInvestmentReferenceResolver({markets:['gb'],records});
  const result=resolver.resolve({market:'gb',target:'view/markets/gb.json#thesis',state:'pending_reassessment'});result.reference.text='changed';
  assert.equal(records['view/markets/gb.json#thesis'].text,'Approved conclusion');
  assert.equal(resolver.resolve({market:'gb',target:'missing'}).state,'unmapped');
});
test('policy writer rejects all investment, methodology, rule and traversal targets',async()=>{
  for(const target of ['view/markets/gb.json','src/markets/gb/story.js','src/comparison/assumptions.js','etl/rules.mjs','../index.json','snapshots/../../view/index.json','C:\\view\\index.json','index.json:stream'])await assert.rejects(assertPolicyWritable(process.cwd(),target),/allowlist/);
});
test('policy publication fails closed, then preserves immutable replay and parent concurrency',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-writer-'));
  try{
    const snapshot=fixture();const args={repo,snapshot,context:attestedContext(snapshot),bodies:bodies(),expectedParent:null};
    await assert.rejects(publishPolicySnapshot(args),/disabled/);
    const first=await publishPolicySnapshot({...args,enabled:true});assert.equal(first.changed,true);
    const version=JSON.parse(await readFile(path.join(repo,'public/data/public/policy/snapshots',first.head+'.json'),'utf8'));assert.deepEqual(version,snapshot);
    assert.equal((await publishPolicySnapshot({...args,enabled:true})).changed,false);
    const next=structuredClone(snapshot);next.id='synthetic-revision';next.parent=first.head;next.createdAt='2026-11-06T06:17:00Z';
    await assert.rejects(publishPolicySnapshot({...args,snapshot:next,enabled:true}),/parent/);
    next.events[0].summary=['Silently rewritten','静默重写'];
    await assert.rejects(publishPolicySnapshot({...args,snapshot:next,context:attestedContext(next),expectedParent:first.head,enabled:true}),/historical event mutation/);
    next.events[0]=snapshot.events[0];
    assert.equal((await publishPolicySnapshot({...args,snapshot:next,context:attestedContext(next),expectedParent:first.head,enabled:true})).changed,false,'timestamps and snapshot ids alone must not produce a commit');
    next.events.push({...structuredClone(next.events[0]),id:'test-correction',kind:'correction',from:'consultation',to:'consultation',corrects:'test-event',verifiedAt:next.createdAt,summary:['Synthetic correction record','模拟更正记录']});
    const second=await publishPolicySnapshot({...args,snapshot:next,context:attestedContext(next),expectedParent:first.head,enabled:true});
    const index=JSON.parse(await readFile(path.join(repo,'public/data/public/policy/index.json'),'utf8'));assert.deepEqual(index.versions,[first.head,second.head]);
    assert.deepEqual(JSON.parse(await readFile(path.join(repo,'public/data/public/policy/snapshots',first.head+'.json'),'utf8')),snapshot);
  }finally{await rm(repo,{recursive:true,force:true});}
});
test('source hash tampering cannot publish even when a fabricated quote exists in the supplied body',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-hash-'));
  try{await assert.rejects(publishPolicySnapshot({repo,snapshot:fixture(),context:CONTEXT,bodies:new Map([['test-source','consultation invented']]),enabled:true,expectedParent:null}),/hash mismatch/);}finally{await rm(repo,{recursive:true,force:true});}
});
test('model-supplied review booleans cannot self-approve publication',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-attestation-'));
  try{await assert.rejects(publishPolicySnapshot({repo,snapshot:fixture(),context:CONTEXT,bodies:bodies(),enabled:true,expectedParent:null}),/independent evidence\/translation attestation missing/);}finally{await rm(repo,{recursive:true,force:true});}
});
test('a changed claim invalidates the independent attestation',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-review-digest-'));const snapshot=fixture();const context=attestedContext(snapshot);
  snapshot.claims[0].text=['Changed meaning','改变含义'];
  try{await assert.rejects(publishPolicySnapshot({repo,snapshot,context,bodies:bodies(),enabled:true,expectedParent:null}),/attestation missing/);}finally{await rm(repo,{recursive:true,force:true});}
});
test('a scenario must reproduce its number from cited numeric inputs',()=>{
  const s=fixture();s.claims.push({...structuredClone(s.claims[0]),id:'test-number',kind:'number',value:10,evidence:[{source:'test-source',locator:'section 1',quote:'10',supports:'number'}]});
  s.impacts.push({id:'test-impact',claim:'test-number',lane:'scenario',value:20,currency:'EUR',denominator:'MW',period:'annual',technology:'BESS',location:'gb',formula:'sum',inputs:['test-number','test-number']});
  assert.deepEqual(validate(s),[]);s.impacts[0].value=25;assert.ok(validate(s).some(x=>x.includes('arithmetic')));
  s.impacts[0].value=20;s.impacts[0].formula='eval(20)';assert.ok(validate(s).some(x=>x.includes('arithmetic')));
});
test('scene specs accept referenced templates and reject executable payloads',()=>{
  const s=fixture();s.stories.push({id:'test-story',title:['Story','故事'],answer:['Answer','答案'],instrumentIds:['test-instrument'],claimIds:['test-claim'],changesIf:['Evidence changes','证据变化'],chapters:[{id:'test-chapter',title:['Title','标题'],text:['Text','文字'],claimIds:['test-claim'],scene:{template:'lifecycle',claimIds:['test-claim'],impactIds:[]}}]});
  assert.deepEqual(validate(s),[]);s.stories[0].chapters[0].scene.onclick='alert(1)';assert.ok(validate(s).some(x=>x.includes('unknown field')));
});
test('version replay reconstructs metadata, changes and order exactly, and rejects tampering',()=>{
  const before=fixture('effective');const after=structuredClone(before);after.id='revised-snapshot';after.createdAt='2026-11-06T06:17:00Z';after.claims.reverse();after.claims[0].text=['Revised evidence','修订证据'];
  const delta=versionDelta(before,after);assert.deepEqual(replayVersion(before,delta),after);
  const wrong=structuredClone(delta);wrong.changes[0].after.text=['Tampered','篡改'];assert.throws(()=>replayVersion(before,wrong),/checksum/);
  assert.throws(()=>replayVersion(after,delta),/parent/);
});
test('model-supplied licence flags cannot replace independent source review',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-rights-'));const snapshot=fixture();const context=attestedContext(snapshot);context.sourceReviews.clear();
  try{await assert.rejects(publishPolicySnapshot({repo,snapshot,context,bodies:bodies(),enabled:true,expectedParent:null}),/independent source\/rights review missing/);}finally{await rm(repo,{recursive:true,force:true});}
});
test('independently reviewed quotation allowance applies across all claims of a source',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-quotes-'));const snapshot=fixture();const context=attestedContext(snapshot);context.sourceReviews.get('test-source').maxQuoteChars=1;
  try{await assert.rejects(publishPolicySnapshot({repo,snapshot,context,bodies:bodies(),enabled:true,expectedParent:null}),/quotation allowance exceeded/);}finally{await rm(repo,{recursive:true,force:true});}
});

test('source aliases and changed URL fragments cannot multiply a document quotation allowance',async()=>{
  const repo=await mkdtemp(path.join(os.tmpdir(),'policy-quote-alias-'));
  try{
    const snapshot=fixture();
    const alias={...structuredClone(snapshot.sources[0]),id:'source-alias',url:snapshot.sources[0].url+'#second-section'};
    snapshot.sources.push(alias);
    snapshot.claims.push({...structuredClone(snapshot.claims[0]),id:'alias-claim',evidence:[{...snapshot.claims[0].evidence[0],source:alias.id}]});
    const context=attestedContext(snapshot);for(const review of context.sourceReviews.values())review.maxQuoteChars=15;
    const evidence=bodies();evidence.set(alias.id,evidence.get('test-source'));
    await assert.rejects(publishPolicySnapshot({repo,snapshot,context,bodies:evidence,enabled:true,expectedParent:null}),/document quotation allowance exceeded/);
    alias.url='https://official.example/relocated-record';
    const relocated=attestedContext(snapshot);for(const review of relocated.sourceReviews.values())review.maxQuoteChars=15;
    await assert.rejects(publishPolicySnapshot({repo,snapshot,context:relocated,bodies:evidence,enabled:true,expectedParent:null}),/document quotation allowance exceeded/);
    for(const review of relocated.sourceReviews.values())review.maxQuoteChars=30;
    assert.equal((await publishPolicySnapshot({repo,snapshot,context:relocated,bodies:evidence,enabled:true,expectedParent:null})).changed,true);
  }finally{await rm(repo,{recursive:true,force:true});}
});

test('an investment review cannot borrow the dependency link of a different policy claim',()=>{
  const s=fixture();s.claims.push({...structuredClone(s.claims[0]),id:'different-claim'});
  s.links.push({id:'different-link',claim:'different-claim',market:'gb',target:'view/markets/gb.json#thesis',kind:'context',mechanism:'context',source:'test-source',relevance:['Synthetic reference','模拟关联'],approvedAt:NOW,state:'pending_reassessment'});
  s.reviews.push({id:'wrong-review',claim:'test-claim',linkIds:['different-link'],status:'pending_reassessment',reason:['Synthetic review','模拟复核'],action:['Review separately','单独复核']});
  assert.ok(validate(s).some(error=>error.includes('different policy claim')));
});
