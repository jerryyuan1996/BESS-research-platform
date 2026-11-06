import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyPDFExtraction,hasVerifiedExtraction} from '../policy/extracted-evidence.mjs';
import {sourceDigest} from '../policy/integrity.mjs';
import {evaluationCorpusProblems} from '../policy/manual-evaluation.mjs';
import {fixture,BODY} from './helpers/policy-fixture.mjs';

// Synthetic transport bytes; this tests binding and rejection, not a PDF parser
// or historical accuracy. Actual extraction must use the separately pinned tool.
const bytes=Buffer.from('%PDF-1.7\nsynthetic test bytes');
const originalByteHash='sha256:'+createHash('sha256').update(bytes).digest('hex');
const makeCase=()=>({id:'pdf-case',source:{...fixture().sources[0],contentHash:sourceDigest(BODY)},body:BODY,locator:'page 2',mediaType:'application/pdf',originalByteHash,extraction:{engine:'synthetic-test-extractor',version:'1',pages:[2],textHash:sourceDigest(BODY)}});
const extractor={engine:'synthetic-test-extractor',version:'1',extract:async()=>[{page:2,text:BODY}]};

test('PDF evidence binds original bytes, pinned extractor, selected pages and exact extracted text',async()=>{
  const c=makeCase();const receipt=await verifyPDFExtraction(c,{bytes,extractor});
  assert.equal(hasVerifiedExtraction(c,receipt),true);
  assert.notEqual(receipt.originalByteHash,receipt.textHash);
  assert.equal(hasVerifiedExtraction(c,JSON.parse(JSON.stringify(receipt))),false,'serialized metadata is not a trusted extraction receipt');
  assert.equal(hasVerifiedExtraction({...c,locator:'page 3'},receipt),false);
  assert.equal(hasVerifiedExtraction({...c,body:'changed'},receipt),false);
  assert.equal(hasVerifiedExtraction({...c,originalByteHash:sourceDigest(BODY)},receipt),false);
});
test('PDF provenance rejects tampered originals, extraction drift and ambiguous/reordered pages',async()=>{
  const c=makeCase();
  await assert.rejects(verifyPDFExtraction(c,{bytes:Buffer.from('%PDF-altered'),extractor}));
  await assert.rejects(verifyPDFExtraction(c,{bytes,extractor:{...extractor,version:'2'}}));
  await assert.rejects(verifyPDFExtraction(c,{bytes,extractor:{...extractor,extract:async()=>[{page:2,text:'changed'}]}}));
  await assert.rejects(verifyPDFExtraction(c,{bytes,extractor:{...extractor,extract:async()=>[{page:3,text:BODY}]}}));
  await assert.rejects(verifyPDFExtraction({...c,extraction:{...c.extraction,pages:[2,2]}},{bytes,extractor}));
});
test('manual evaluation cannot accept PDF text by relabelling its hash or asserting a review boolean',async()=>{
  const c=makeCase();const corpus=Array.from({length:12},(_,i)=>({...c,id:`case-${i}`,market:['de','gb','nem','wa'][i%4],reviewer:'synthetic',sourceReviewed:true,rightsReviewed:true,translationReviewed:true,expectedReview:false}));
  assert.ok(evaluationCorpusProblems(corpus).length);
  const evidenceProofs=new Map();for(const row of corpus)evidenceProofs.set(row.id,await verifyPDFExtraction(row,{bytes,extractor}));
  assert.deepEqual(evaluationCorpusProblems(corpus,{evidenceProofs}),[]);
  corpus[0].extraction.pages=[3];assert.ok(evaluationCorpusProblems(corpus,{evidenceProofs}).length);
});
