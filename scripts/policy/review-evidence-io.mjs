import {readFile,lstat,realpath} from 'node:fs/promises';
import path from 'node:path';
import {originalHash} from '../../policy/review-bundle.mjs';
import {verifyPDFExtraction,verifyPDFSectionExtraction} from '../../policy/extracted-evidence.mjs';
import {digest} from '../../policy/integrity.mjs';

export async function nonSymbolicReviewPath(target){
  const absolute=path.resolve(target),parsed=path.parse(absolute);let current=parsed.root;
  for(const part of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)){
    current=path.join(current,part);if((await lstat(current)).isSymbolicLink())throw Error('Symbolic review path rejected');
  }
  return absolute;
}

/** Document identity and root come from trusted runner configuration. Candidate
 * JSON never supplies a file or directory. No source fetching or approval. */
export async function readPinnedReviewOriginal(sourceRoot,document){
  if(typeof sourceRoot!=='string'||sourceRoot.split(/[\\/]/).some(p=>p.toLowerCase()==='local-data')||
    !/^[a-z][a-z0-9-]+$/.test(document?.id||'')||document.file!==document.id+(document.mediaType==='application/pdf'?'.pdf':'.html')||
    !Number.isSafeInteger(document.originalBytes)||document.originalBytes<=0||document.originalBytes>10_000_000||!/^sha256:[a-f0-9]{64}$/.test(document.originalByteHash||''))throw Error('Trusted bounded original-file definition required');
  const root=await realpath(await nonSymbolicReviewPath(sourceRoot));
  const file=await nonSymbolicReviewPath(path.join(root,document.file));
  if(path.dirname(file)!==root)throw Error('Original file escaped its configured directory');
  const stat=await lstat(file);if(!stat.isFile()||stat.size!==document.originalBytes)throw Error('Original file size differs');
  const bytes=await readFile(file);if(bytes.byteLength!==document.originalBytes||originalHash(bytes)!==document.originalByteHash)throw Error('Original file hash differs');
  return bytes;
}

/** Suitable for a future independently accepted profile's prepareManualEvidence
 * method. Merely preparing a process-local receipt grants no profile approval. */
export function createPinnedPDFPreparer({sourceRoot,document,definition,extractor}){
  const expected=structuredClone(definition);
  if(document?.mediaType!=='application/pdf'||!expected?.caseId||!expected.sourceId||!expected.url||!expected.locator||!/^sha256:[a-f0-9]{64}$/.test(expected.textHash||'')||!Array.isArray(expected.pages))throw Error('Trusted PDF case binding required');
  const pinnedDocument=structuredClone(document);
  return async({case:c})=>{
    if(c?.id!==expected.caseId||c.source?.id!==expected.sourceId||c.source?.url!==expected.url||c.locator!==expected.locator||c.source?.locator!==expected.locator||c.source?.contentHash!==expected.textHash||
      c.originalByteHash!==pinnedDocument.originalByteHash||JSON.stringify(c.extraction?.pages)!==JSON.stringify(expected.pages)||digest(c.extraction?.ranges??null)!==digest(expected.ranges??null))throw Error('Case differs from the trusted source binding');
    const bytes=await readPinnedReviewOriginal(sourceRoot,pinnedDocument);
    return expected.ranges?verifyPDFSectionExtraction(c,{bytes,extractor,selection:expected.ranges}):verifyPDFExtraction(c,{bytes,extractor});
  };
}
