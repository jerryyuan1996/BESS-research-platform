import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {originalHash,literalReviewChecks,selectedQuotes,parityDates,requireUnapprovedProposal,buildPilotDraft,combinePilotDrafts} from '../policy/review-bundle.mjs';
import {proposedReviewProfiles} from '../scripts/policy/proposed-review-profiles.mjs';
import {independentlyValidate} from '../policy/validation.mjs';
import {validatePolicySnapshot} from '../policy/schema.mjs';
import {sourceDigest} from '../policy/integrity.mjs';
import {hasVerifiedExtraction} from '../policy/extracted-evidence.mjs';
import {readPinnedReviewOriginal,createPinnedPDFPreparer} from '../scripts/policy/review-evidence-io.mjs';

function proposal(){return {schemaVersion:2,approvalState:'proposal_only',activationAllowed:false,independentReviewer:null,documents:[{id:'source-one',file:'source-one.pdf',mediaType:'application/pdf',originalByteHash:'sha256:'+'a'.repeat(64),rightsEvidence:{reviewed:false,rightsReviewed:false}}],cases:Array.from({length:12},(_,i)=>({id:'case-'+i,sourceId:'source-one',expectedReview:null,actualReview:null,reviewedBy:null,sourceReviewed:false,rightsReviewed:false,translationReviewed:false,proposedExpectedReview:true,literalChecks:['source'],applicability:'applicable',applicabilityReason:['Applies.','适用。'],quoteSpans:[{start:0,end:1,textHash:'sha256:'+'b'.repeat(64),quoteHash:'sha256:'+'c'.repeat(64)}]})),pilots:['de','gb','nem','wa'].map(m=>({market:m}))};}
test('a review proposal cannot smuggle approval, accepted labels or a source path',()=>{
  assert.equal(requireUnapprovedProposal(proposal()),true);
  for(const change of [p=>p.activationAllowed=true,p=>p.independentReviewer='invented',p=>p.cases[0].expectedReview=true,p=>p.cases[0].rightsReviewed=true,p=>p.documents[0].file='../source-one.pdf']){
    const value=proposal();change(value);assert.throws(()=>requireUnapprovedProposal(value));
  }
});
test('literal diagnostics ignore script text and never rewrite source quotations',()=>{
  assert.equal(literalReviewChecks('<script>approved</script><p>consultation</p>',['approved','consultation'])[0].found,false);
  const body='The source\nrecords a date and has extra context.';
  const start=body.indexOf('source'),end=body.length,spans=[{start,end,textHash:sourceDigest(body),quoteHash:sourceDigest(body.slice(start,end))}];
  const [quote]=selectedQuotes({body},spans);assert.ok(body.includes(quote));assert.ok(quote.includes('\n'));
  assert.throws(()=>selectedQuotes({body:body+' changed'},spans),/context hash differs/);
  assert.equal(parityDates('2 September 2026'),'2026-09-02');assert.equal(parityDates('2026年9月2日'),'2026-09-02');
});
test('a pinned manual original rejects filename traversal and byte drift without reading private paths',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'policy-source-'));
  const bytes=Buffer.from('%PDF-synthetic-read-boundary');const document={id:'source-one',file:'source-one.pdf',mediaType:'application/pdf',originalBytes:bytes.length,originalByteHash:originalHash(bytes)};
  await writeFile(path.join(root,document.file),bytes);
  assert.deepEqual(await readPinnedReviewOriginal(root,document),bytes);
  await assert.rejects(()=>readPinnedReviewOriginal(root,{...document,file:'../source-one.pdf'}));
  await assert.rejects(()=>readPinnedReviewOriginal(path.join(root,'local-data'),document));
  await writeFile(path.join(root,document.file),Buffer.from('%PDF-synthetic-read-boundarY'));
  await assert.rejects(()=>readPinnedReviewOriginal(root,document),/hash differs/);
});
test('a future profile preparer binds case, source URL, locator, text hash and exact original bytes',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'policy-preparer-'));
  const bytes=Buffer.from('%PDF-synthetic-preparer-boundary'),body='Synthetic selected source page';
  const document={id:'source-one',file:'source-one.pdf',mediaType:'application/pdf',originalBytes:bytes.length,originalByteHash:originalHash(bytes)};
  await writeFile(path.join(root,document.file),bytes);
  const c={id:'case-one',mediaType:'application/pdf',originalByteHash:document.originalByteHash,locator:'Page 1',body,source:{id:'src-case-one',url:'https://official.example.test/record.pdf',locator:'Page 1',contentHash:sourceDigest(body)},extraction:{engine:'synthetic-test',version:'1',pages:[1],textHash:sourceDigest(body)}};
  const definition={caseId:c.id,sourceId:c.source.id,url:c.source.url,locator:c.locator,textHash:c.source.contentHash,pages:[1]};
  const extractor={engine:'synthetic-test',version:'1',extract:async()=>[{page:1,text:body}]};
  const prepare=createPinnedPDFPreparer({sourceRoot:root,document,definition,extractor});
  const receipt=await prepare({case:c});assert.equal(hasVerifiedExtraction(c,receipt),true);
  for(const changed of [{...c,id:'different-case'},{...c,source:{...c.source,url:'https://other.example.test/record.pdf'}},{...c,body:body+' forged'},{...c,extraction:{...c.extraction,pages:[2]}}])await assert.rejects(()=>prepare({case:changed}));
  assert.equal(hasVerifiedExtraction(c,JSON.parse(JSON.stringify(receipt))),false);
});

function syntheticDraft(market='de'){
  const p=proposal(),body='Original source. Publication date: 1 January 2025. This proposal was approved.';
  const span=quote=>{const start=body.indexOf(quote);return [{start,end:start+quote.length,textHash:sourceDigest(body),quoteHash:sourceDigest(quote)}];};
  Object.assign(p.documents[0],{url:'https://official.example.test/source.pdf',publisher:'Synthetic official publisher',title:'Synthetic record',language:'en',retrievedAt:'2026-11-05T03:00:00Z',rightsEvidence:{...p.documents[0].rightsEvidence,termsURL:'https://official.example.test/terms'}});
  for(let i=0;i<p.cases.length;i++)Object.assign(p.cases[i],{market:['de','gb','nem','wa'][Math.floor(i/3)],mechanism:'context',proposedExpectedReview:false,quoteSpans:span('Original source.'),referenceFact:['A sourced context fact.','有来源的背景事实。']});
  const ids=p.cases.filter(c=>c.market===market).map(c=>c.id),instrument='pol-synthetic-'+market,unit='core-'+market;
  const evidence=quote=>[{unit,spans:span(quote)}];
  const pilot={market,id:'synthetic-'+market,officialId:'record-'+market,jurisdiction:market.toUpperCase(),title:['Synthetic policy','模拟政策'],answer:['Synthetic answer.','模拟回答。'],changesIf:['New source.','新来源。'],economicCase:ids[0],questions:[],evidenceUnits:[],
    records:{rootInstrument:instrument,instruments:[{id:instrument,officialId:'record-'+market,jurisdiction:market.toUpperCase(),markets:[market],title:['Synthetic record','模拟记录'],state:'adopted',supersedes:null}],
      claims:[{id:'cl-state-'+market,instrument,kind:'legal_status',predicate:null,value:'adopted',text:['An approved record.','获批记录。'],evidence:evidence('approved')},{id:'cl-date-'+market,instrument,kind:'date',predicate:'published_at',value:'2025-01-01',text:['Published 2025-01-01.','公布于2025-01-01。'],evidence:evidence('1 January 2025')}],
      events:[{id:'evt-synthetic-'+market,instrument,kind:'transition',from:null,to:'adopted',announcedAt:null,publishedAt:'2025-01-01',effectiveAt:null,consultationClosesAt:null,adoptedAt:null,claimIds:['cl-state-'+market,'cl-date-'+market],corrects:null,summary:['Synthetic approved record.','模拟批准记录。']}]},
    chapters:[{id:market+'-before',title:['Two records','两份记录'],text:['Sourced comparison.','有来源的比较。'],caseIds:ids.slice(0,2),scene:'before_after'},{id:market+'-timeline',title:['Timeline','时间线'],text:['Dated record.','有日期的记录。'],caseIds:[ids[0]],scene:'timeline',timelineClaimIds:['cl-date-'+market]}]};
  const units=new Map([...p.cases.map(c=>[c.id,{documentId:'source-one',locator:'Page1',body}]),[unit,{documentId:'source-one',locator:'Page1',body,issuedAt:'2025-01-01'}]]);
  return {p,pilot,units};
}
test('canonical-shaped synthetic drafts retain every source and translation gate and cannot independently validate',()=>{
  const {p,pilot,units}=syntheticDraft();const result=buildPilotDraft(pilot,p,units,'2026-11-06T00:00:00.000Z');
  assert.deepEqual(result.manifest.structuralProblems,[]);assert.equal(result.manifest.fullSchemaValid,false);assert.equal(result.manifest.publicationApproved,false);
  assert.ok(result.snapshot.sources.every(s=>s.rights.reviewed===false));assert.ok(result.snapshot.claims.every(c=>c.translationReviewed===false));
  assert.equal(result.snapshot.impacts[0].value,null);assert.deepEqual(result.snapshot.links,[]);
  const check=independentlyValidate({snapshot:result.snapshot,bodies:result.bodies,profiles:[],marketIds:['de','gb','nem','wa']});assert.equal(check.valid,false);
});
test('a draft chapter cannot borrow another market case or an invented core citation',()=>{
  const {p,pilot,units}=syntheticDraft();pilot.chapters[0].caseIds=['case-0','case-3'];
  assert.throws(()=>buildPilotDraft(pilot,p,units,'2026-11-06T00:00:00.000Z'),/outside its market evidence graph/);
  pilot.chapters[0].caseIds=['case-0','case-1'];units.get('core-de').body+=' changed';
  assert.throws(()=>buildPilotDraft(pilot,p,units,'2026-11-06T00:00:00.000Z'),/quotation span or context hash differs/);
});

test('draft profiles bind exact source, translation, story and stored records without conferring approval',()=>{
  const {p,pilot,units}=syntheticDraft();
  const draft=buildPilotDraft(pilot,p,units,'2026-11-06T00:00:00.000Z');
  const [{profile,manifest}]=proposedReviewProfiles({proposal:p,drafts:[draft],corpus:[]});
  assert.equal(profile.reviewed,false);assert.equal(profile.rightsReviewed,false);assert.equal(profile.maxQuoteChars,0);
  assert.equal(profile.verifyStoredSnapshot({snapshot:draft.snapshot}),true);
  assert.equal(profile.translationEquivalent(draft.snapshot.claims[0]),true);
  assert.equal(profile.validateStory(draft.snapshot.stories[0]),true);
  const source=draft.snapshot.sources[0];
  assert.equal(profile.validate({source,claims:draft.snapshot.claims,body:draft.bodies.get(source.id)}).sourceSupported,true);
  assert.equal(profile.validate({source:{...source,url:'https://other.example.test'},claims:[],body:draft.bodies.get(source.id)}).sourceSupported,false);
  const changed=structuredClone(draft.snapshot);changed.claims[0].text[1]+=' altered';
  assert.equal(profile.translationEquivalent(changed.claims[0]),false);
  assert.equal(profile.verifyStoredSnapshot({snapshot:changed}),false);
  changed.stories[0].answer[0]+=' altered';assert.equal(profile.validateStory(changed.stories[0]),false);
  const event={...draft.snapshot.events[0],publishedAt:'2024-01-01'};
  assert.equal(profile.validatePublicRecord({kind:'events',record:event}),false);
  assert.equal(JSON.parse(JSON.stringify(manifest)).verifyStoredSnapshot,undefined);
  assert.equal(independentlyValidate({snapshot:draft.snapshot,bodies:draft.bodies,profiles:[profile],marketIds:['de','gb','nem','wa']}).valid,false);
});

test('one initial candidate combines four market drafts while retaining their unapproved gates',()=>{
  const now='2026-11-06T00:00:00.000Z';
  const drafts=['de','gb','nem','wa'].map(m=>{
    const {p,pilot,units}=syntheticDraft(m);return buildPilotDraft(pilot,p,units,now);
  });
  const combined=combinePilotDrafts(drafts,now);
  assert.deepEqual(combined.manifest.structuralProblems,[]);assert.equal(combined.snapshot.parent,null);
  assert.equal(combined.snapshot.stories.length,4);assert.equal(combined.manifest.publicationApproved,false);
  assert.equal(combined.snapshot.sources[0].checkedAt,'2026-11-05T03:00:00.000Z');
  assert.throws(()=>combinePilotDrafts(drafts.slice(1),now));
});

test('draft preparation and serialized assertions cannot manufacture event verification',()=>{
  const {p,pilot,units}=syntheticDraft();
  pilot.records.events[0].verifiedAt='2026-11-06T12:00:00.000Z';
  const first=buildPilotDraft(pilot,p,units,'2026-11-06T13:00:00.000Z');
  const later=buildPilotDraft(pilot,p,units,'2026-11-07T13:00:00.000Z');
  assert.deepEqual(first.snapshot.events,later.snapshot.events);
  assert.ok(first.snapshot.events.every(e=>e.verifiedAt===null));
  assert.deepEqual(first.manifest.structuralProblems,[]);
  const flagsOnly=structuredClone(first.snapshot);
  flagsOnly.sources.forEach(source=>source.rights.reviewed=true);
  flagsOnly.claims.forEach(claim=>claim.translationReviewed=true);
  const errors=validatePolicySnapshot(flagsOnly,{marketIds:['de','gb','nem','wa'],allowedHosts:['official.example.test'],evidenceBodies:first.bodies});
  assert.ok(errors.some(e=>e.includes('.verifiedAt: explicit UTC timestamp required')));
  assert.equal(first.manifest.publicationApproved,false);
});

test('supplementary case evidence retains exact source bindings and may only narrow excerpt use',()=>{
  const {p,pilot,units}=syntheticDraft();
  p.documents[0].rightsEvidence.sourceUse={reproduction:'bounded_excerpt',
    attribution:['Synthetic authority, synthetic record','模拟机关、模拟文件'],
    license:['Synthetic excerpt permission','模拟摘录许可'],changes:['Synthetic test only','仅模拟测试']};
  const unit='supplement-de',body=units.get('core-de').body,quote='approved',start=body.indexOf(quote);
  pilot.evidenceUnits.push({id:unit,sourceId:'source-one',pages:[1],locator:'Page1',issuedAt:null,withholdOriginalExcerpts:true});
  units.set(unit,{documentId:'source-one',body,locator:'Page1'});
  const c=p.cases.find(c=>c.market==='de');
  c.supplementalEvidence=[{unit,spans:[{start,end:start+quote.length,textHash:sourceDigest(body),quoteHash:sourceDigest(quote)}]}];
  const result=buildPilotDraft(pilot,p,units,'2026-11-06T00:00:00.000Z');
  assert.deepEqual(result.manifest.structuralProblems,[]);
  const claim=result.snapshot.claims.find(cl=>cl.id==='cl-'+c.id);
  assert.equal(claim.evidence.length,2);assert.equal(claim.evidence[0].quote,'Original source.');
  assert.equal(claim.evidence[1].source,'src-'+unit);assert.equal(claim.evidence[1].reproduction,'withheld');
  assert.equal('quote' in claim.evidence[1],false);assert.equal(claim.evidence[1].quoteHash,sourceDigest(quote));
  const source=result.snapshot.sources.find(s=>s.id==='src-'+unit);
  assert.equal(source.rights.reproduction,'facts_only');assert.equal(source.rights.reviewed,false);
  assert.equal(result.quoteProofs.get('src-'+unit+':'+sourceDigest(quote)),quote);
  assert.equal(result.manifest.publicationApproved,false);
  c.supplementalEvidence[0].spans[0].quoteHash='sha256:'+'0'.repeat(64);
  assert.throws(()=>buildPilotDraft(pilot,p,units,'2026-11-06T00:00:00.000Z'),/Original quotation hash differs/);
  c.supplementalEvidence[0].unit='absent-unit';
  assert.throws(()=>buildPilotDraft(pilot,p,units,'2026-11-06T00:00:00.000Z'),/Original evidence unit missing/);
});
