import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyPDFSectionExtraction,hasVerifiedExtraction} from '../policy/extracted-evidence.mjs';
import {sourceDigest} from '../policy/integrity.mjs';
import {originalHash,proposePDFRanges} from '../policy/review-bundle.mjs';

const bytes=Buffer.from('%PDF-synthetic-section-provenance');
const pageText='Original context. Approved decision. Remaining original context.';
function fixture(){
  const selection=[{page:1,start:18,end:36,pageHash:sourceDigest(pageText)}],body=pageText.slice(18,36);
  return {selection,extractor:{engine:'synthetic-test',version:'1',extract:async()=>[{page:1,text:pageText}]},c:{id:'synthetic-case',mediaType:'application/pdf',originalByteHash:originalHash(bytes),locator:'Page 1, specified paragraph',body,source:{id:'synthetic-source',contentHash:sourceDigest(body)},extraction:{engine:'synthetic-test',version:'1',pages:[1],ranges:structuredClone(selection),textHash:sourceDigest(body)}}};
}
test('section proof binds the original PDF, whole-page context and exact unchanged range',async()=>{
  const {c,extractor,selection}=fixture();const proof=await verifyPDFSectionExtraction(c,{bytes,extractor,selection});
  assert.equal(hasVerifiedExtraction(c,proof),true);assert.equal(hasVerifiedExtraction(c,JSON.parse(JSON.stringify(proof))),false);
  c.extraction.ranges[0].start++;assert.equal(hasVerifiedExtraction(c,proof),false);
});
test('serialized candidate ranges alone cannot authorize a selection',async()=>{
  const {c,extractor,selection}=fixture();
  await assert.rejects(()=>verifyPDFSectionExtraction(c,{bytes,extractor}));
  await assert.rejects(()=>verifyPDFSectionExtraction(c,{bytes,extractor,selection:selection.map(r=>({...r,start:r.start+1}))}));
  await assert.rejects(()=>verifyPDFSectionExtraction(c,{bytes:Buffer.from('%PDF-altered'),extractor,selection}));
});
test('even excluded original-page changes, overlap and engine drift invalidate section proof',async()=>{
  const {c,extractor,selection}=fixture();
  await assert.rejects(()=>verifyPDFSectionExtraction(c,{bytes,selection,extractor:{...extractor,extract:async()=>[{page:1,text:pageText+' changed outside excerpt'}]}}),/context differs/);
  await assert.rejects(()=>verifyPDFSectionExtraction(c,{bytes,selection,extractor:{...extractor,version:'2'}}));
  const overlap=[...selection,{...selection[0],start:20,end:30}];c.extraction.ranges=overlap;
  await assert.rejects(()=>verifyPDFSectionExtraction(c,{bytes,extractor,selection:overlap}),/boundaries rejected/);
});
test('proposed windows preserve original text and refuse oversize context instead of raising the input cap',()=>{
  const pages=[{page:1,text:'Context '.repeat(50)+'approved decision'+ ' context'.repeat(50)}];
  const ranges=proposePDFRanges(pages,['approved decision']);assert.equal(ranges.length,1);assert.equal(ranges[0].pageHash,sourceDigest(pages[0].text));
  assert.ok(pages[0].text.slice(ranges[0].start,ranges[0].end).includes('approved decision'));
  assert.deepEqual(proposePDFRanges(pages,['approved decision'],{maxChars:20}),[]);
});
