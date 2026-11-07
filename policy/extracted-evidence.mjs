import {createHash} from 'node:crypto';
import {digest,sourceDigest} from './integrity.mjs';

// Receipts are process-local capabilities. A JSON field or model-supplied flag
// cannot stand in for execution of a trusted, pinned extractor over actual bytes.
const receipts=new WeakMap();
const byteDigest=bytes=>'sha256:'+createHash('sha256').update(bytes).digest('hex');
const binding=c=>digest({body:c.body,source:c.source,locator:c.locator,originalByteHash:c.originalByteHash,mediaType:c.mediaType,extraction:c.extraction});

/** `extractor` is trusted runner configuration, never corpus/model JSON. It
 * receives bounded bytes and an explicit one-based page selection, and returns
 * page text in that exact order. No network, files, credentials or writer here. */
export async function verifyPDFExtraction(c,{bytes,extractor}){
  if(!(bytes instanceof Uint8Array)||bytes.byteLength===0||bytes.byteLength>10_000_000||
    Buffer.from(bytes.subarray(0,5)).toString('ascii')!=='%PDF-'||c?.mediaType!=='application/pdf'||
    !extractor||typeof extractor.extract!=='function'||!extractor.engine||!extractor.version||
    c.extraction?.engine!==extractor.engine||c.extraction?.version!==extractor.version||
    !Array.isArray(c.extraction.pages)||!c.extraction.pages.length||c.extraction.pages.length>12||
    c.extraction.pages.some((page,i,pages)=>!Number.isSafeInteger(page)||page<1||(i>0&&page<=pages[i-1]))||
    byteDigest(bytes)!==c.originalByteHash)throw Error('PDF original bytes or pinned extraction contract rejected');
  const pages=await extractor.extract({bytes:Buffer.from(bytes),pages:[...c.extraction.pages]});
  if(!Array.isArray(pages)||pages.length!==c.extraction.pages.length||pages.some((page,i)=>page?.page!==c.extraction.pages[i]||typeof page.text!=='string'))throw Error('PDF extraction page sequence rejected');
  const body=pages.map(page=>page.text).join('\n\f\n');
  if(Buffer.byteLength(body,'utf8')>1_000_000||body!==c.body||sourceDigest(body)!==c.source?.contentHash||c.extraction.textHash!==sourceDigest(body))throw Error('PDF extracted text provenance rejected');
  const receipt=Object.freeze({originalByteHash:c.originalByteHash,textHash:sourceDigest(body),engine:extractor.engine,version:extractor.version,pages:Object.freeze([...c.extraction.pages])});
  receipts.set(receipt,binding(c));return receipt;
}
export function hasVerifiedExtraction(c,receipt){return !!receipt&&receipts.get(receipt)===binding(c);}

/** Bounded excerpts use separately supplied trusted selections. A model or
 * corpus range field is not a selector authority. Full page hashes preserve
 * the surrounding original context, even where it is not sent to a provider. */
export async function verifyPDFSectionExtraction(c,{bytes,extractor,selection}){
  if(!(bytes instanceof Uint8Array)||!bytes.byteLength||bytes.byteLength>10_000_000||Buffer.from(bytes.subarray(0,5)).toString('ascii')!=='%PDF-'||
    c?.mediaType!=='application/pdf'||byteDigest(bytes)!==c.originalByteHash||!extractor||!extractor.engine||!extractor.version||typeof extractor.extract!=='function'||
    c.extraction?.engine!==extractor.engine||c.extraction?.version!==extractor.version||!Array.isArray(selection)||!selection.length||selection.length>24||
    !Array.isArray(c.extraction.ranges)||digest(selection)!==digest(c.extraction.ranges))throw Error('Trusted PDF section selection required');
  const pages=[...new Set(selection.map(r=>r?.page))];
  if(!pages.length||pages.length>12||pages.some((p,i)=>!Number.isSafeInteger(p)||p<1||(i>0&&p<=pages[i-1]))||JSON.stringify(pages)!==JSON.stringify(c.extraction.pages))throw Error('PDF section page sequence rejected');
  let previous=null;
  for(const range of selection){
    if(!range||Object.keys(range).sort().join(',')!=='end,page,pageHash,start'||!Number.isSafeInteger(range.start)||!Number.isSafeInteger(range.end)||range.start<0||range.end<=range.start||!/^sha256:[a-f0-9]{64}$/.test(range.pageHash||'')||
      previous&&(range.page<previous.page||range.page===previous.page&&range.start<previous.end))throw Error('PDF section boundaries rejected');
    previous=range;
  }
  const extracted=await extractor.extract({bytes:Buffer.from(bytes),pages});
  if(!Array.isArray(extracted)||extracted.length!==pages.length||extracted.some((p,i)=>p?.page!==pages[i]||typeof p.text!=='string'))throw Error('PDF section extraction pages rejected');
  const byPage=new Map(extracted.map(p=>[p.page,p.text]));
  for(const range of selection){const text=byPage.get(range.page);if(range.end>text.length||sourceDigest(text)!==range.pageHash)throw Error('PDF section original-page context differs');}
  const body=selection.map(r=>byPage.get(r.page).slice(r.start,r.end)).join('\n\f\n');
  if(Buffer.byteLength(body,'utf8')>1_000_000||body!==c.body||sourceDigest(body)!==c.source?.contentHash||c.extraction.textHash!==sourceDigest(body))throw Error('PDF section text provenance rejected');
  const ranges=Object.freeze(selection.map(r=>Object.freeze({...r})));
  const receipt=Object.freeze({originalByteHash:c.originalByteHash,textHash:sourceDigest(body),engine:extractor.engine,version:extractor.version,pages:Object.freeze(pages),ranges});
  receipts.set(receipt,binding(c));return receipt;
}
