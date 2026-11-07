import {digest,sourceDigest} from './integrity.mjs';
export const quoteProofKey=e=>e.source+':'+e.quoteHash;
/** Trusted offline preparation only. Facts-only evidence retains its exact
 * private proof while the public-shaped record contains a digest, never text.
 * This is a projection, not a licence grant or semantic approval. */
export function sourceUseRights(document){
  const use=document.rightsEvidence?.sourceUse;
  return {metadata:true,termsURL:document.rightsEvidence.termsURL,reviewed:false,...(use?{reproduction:use.reproduction,attribution:use.attribution,license:use.license,changes:use.changes}: {})};
}
export function projectEvidence({source,quote,kind,quoteProofs}){
  if(source.rights.reproduction!=='facts_only')return {source:source.id,locator:source.locator,quote,supports:kind};
  const e={source:source.id,locator:source.locator,quoteHash:sourceDigest(quote),reproduction:'withheld',supports:kind};
  quoteProofs.set(quoteProofKey(e),quote);return e;
}
/** New source-use records need an explicit exact-source transmission decision.
 * Public reuse, lawful acquisition and paid-provider authorization are separate.
 * Existing legacy profiles remain governed by their original gates. */
export function sourceTransmissionProblems(documents,reviews=new Map()){
  const errors=[];
  for(const doc of documents){
    const source=doc.source;
    if(!source?.rights?.reproduction)continue;
    const review=reviews.get(source.id);
    if(source.rights.reproduction==='facts_only'||!review||review.sourceHash!==digest(source)||review.modelTransmission!==true)
      errors.push(source.id+': original text is not approved for model transmission');
  }
  return errors;
}
