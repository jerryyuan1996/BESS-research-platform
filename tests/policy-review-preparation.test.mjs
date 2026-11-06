import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {originalHash,literalReviewChecks,originalQuote,parityDates,requireUnapprovedProposal,buildPilotDraft,combinePilotDrafts} from '../policy/review-bundle.mjs';
import {proposedReviewProfiles} from '../scripts/policy/proposed-review-profiles.mjs';
import {independentlyValidate} from '../policy/validation.mjs';
import {sourceDigest} from '../policy/integrity.mjs';
import {hasVerifiedExtraction} from '../policy/extracted-evidence.mjs';
import {readPinnedReviewOriginal,createPinnedPDFPreparer} from '../scripts/policy/review-evidence-io.mjs';

function proposal(){return {schemaVersion:1,approvalState:'proposal_only',activationAllowed:false,independentReviewer:null,documents:[{id:'source-one',file:'source-one.pdf',mediaType:'application/pdf',originalByteHash:'sha256:'+'a'.repeat(64),rightsEvidence:{reviewed:false,rightsReviewed:false}}],cases:Array.from({length:12},(_,i)=>({id:'case-'+i,sourceId:'source-one',expectedReview:null,actualReview:null,reviewedBy:null,sourceReviewed:false,rightsReviewed:false,translationReviewed:false,proposedExpectedReview:true,literalChecks:['source']})),pilots:['de','gb','nem','wa'].map(m=>({market:m}))};}
test('a review proposal cannot smuggle approval, accepted labels or a source path',()=>{
  assert.equal(requireUnapprovedProposal(proposal()),true);
  for(const change of [p=>p.activationAllowed=true,p=>p.independentReviewer='invented',p=>p.cases[0].expectedReview=true,p=>p.cases[0].rightsReviewed=true,p=>p.documents[0].file='../source-one.pdf']){
    const value=proposal();change(value);assert.throws(()=>requireUnapprovedProposal(value));
  }
});
test('literal diagnostics ignore script text and never rewrite source quotations',()=>{
  assert.equal(literalReviewChecks('<script>approved</script><p>consultation</p>',['approved','consultation'])[0].found,false);
  const body='The source\nrecords a date and has extra context.';
  const quote=originalQuote(body,'source records');assert.ok(body.includes(quote));assert.ok(quote.includes('\n'));assert.equal(originalQuote(body,'invented'),null);
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

function syntheticDraft(){
  const p=proposal(),body='Original source. Publication date: 1 January 2025. This proposal was approved.';
  Object.assign(p.documents[0],{url:'https://official.example.test/source.pdf',publisher:'Synthetic official publisher',title:'Synthetic record',language:'en',retrievedAt:'2026-11-05T03:00:00Z',rightsEvidence:{...p.documents[0].rightsEvidence,termsURL:'https://official.example.test/terms'}});
  for(let i=0;i<p.cases.length;i++)Object.assign(p.cases[i],{market:['de','gb','nem','wa'][Math.floor(i/3)],mechanism:'context',referenceFact:['A sourced context fact.','有来源的背景事实。']});
  const pilot={market:'de',id:'synthetic-pilot',officialId:'synthetic-record',jurisdiction:'DE',title:['Synthetic policy','合成政策'],lifecycle:{sourceId:'source-one',pages:[1],locator:'Page 1',publishedAt:'2025-01-01',state:'adopted',stateAnchor:'approved',dateAnchor:'1 January 2025'},answer:['Synthetic answer.','合成回答。'],changesIf:['New source.','新来源。'],economicCase:'case-0',questions:[],chapters:[{id:'synthetic-before',title:['Two records','两条记录'],text:['Sourced comparison.','有来源的比较。'],caseIds:['case-0','case-1'],scene:'before_after'},{id:'synthetic-timeline',title:['Timeline','时间线'],text:['Dated record.','有日期的记录。'],caseIds:['case-0'],scene:'timeline'}]};
  const units=new Map([...p.cases.map(c=>[c.id,{documentId:'source-one',locator:'Page 1',body}]),['core-de',{documentId:'source-one',locator:'Page 1',body}]]);
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
  pilot.chapters[0].caseIds=['case-0','case-1'];pilot.lifecycle.stateAnchor='invented approval text';
  assert.throws(()=>buildPilotDraft(pilot,p,units,'2026-11-06T00:00:00.000Z'),/original quotation missing/);
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
  const {p,pilot,units}=syntheticDraft(),now='2026-11-06T00:00:00.000Z';
  const drafts=['de','gb','nem','wa'].map(m=>{
    const marketCases=p.cases.filter(c=>c.market===m).map(c=>c.id),base=marketCases[0];
    units.set('core-'+m,units.get('core-de'));
    const next={...pilot,market:m,id:'synthetic-'+m,officialId:'record-'+m,jurisdiction:m.toUpperCase(),economicCase:base,
      chapters:[{...pilot.chapters[0],id:m+'-records',caseIds:marketCases.slice(0,2)},{...pilot.chapters[1],id:m+'-timeline',caseIds:[base]}]};
    return buildPilotDraft(next,p,units,now);
  });
  const combined=combinePilotDrafts(drafts,now);
  assert.deepEqual(combined.manifest.structuralProblems,[]);assert.equal(combined.snapshot.parent,null);
  assert.equal(combined.snapshot.stories.length,4);assert.equal(combined.manifest.publicationApproved,false);
  assert.equal(combined.snapshot.sources[0].checkedAt,'2026-11-05T03:00:00.000Z');
  assert.throws(()=>combinePilotDrafts(drafts.slice(1),now));
});
