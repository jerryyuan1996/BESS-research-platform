import admission from './static-release-admission.json' with {type:'json'};
import {digest,sourceDigest} from './integrity.mjs';

const deepFreeze=value=>{if(value&&typeof value==='object'){for(const child of Object.values(value))deepFreeze(child);Object.freeze(value);}return value;};
/** Retain the separate completed source/bilingual review for one exact static
 * release. Hash matching does not review future facts, approve new documents,
 * grant original reproduction or admit evidence to a model. */
export const STATIC_POLICY_ADMISSION=deepFreeze(admission);
const exactSnapshot=snapshot=>digest(snapshot)===admission.releaseSnapshotHash;
const recordHash=(kind,record)=>admission.recordHashes[kind]?.[record.id]===digest(record);
export const STATIC_POLICY_PROFILES=Object.freeze(admission.documents.map(document=>{
  const bindings=admission.bindings.filter(row=>row.documentId===document.documentId);
  return Object.freeze({
    id:'static-'+document.documentId,host:new URL(document.url).hostname,
    sourceIds:Object.freeze(bindings.map(row=>row.sourceId)),
    reviewed:true,rightsReviewed:true,modelTransmission:false,maxQuoteChars:0,
    originalByteHash:document.originalByteHash,admissionProposalSHA256:admission.proposalFileSHA256,
    validate({source,claims,body,snapshot}){
      const known=exactSnapshot(snapshot)&&source.rights.reproduction==='facts_only'&&
        bindings.some(row=>row.sourceId===source.id&&row.url===source.url&&row.locator===source.locator&&row.releaseSourceHash===digest(source))&&
        typeof body==='string'&&sourceDigest(body)===source.contentHash;
      return {sourceSupported:known,supportedClaimIds:known?claims.filter(claim=>recordHash('claims',claim)&&claim.evidence.some(e=>e.source===source.id&&e.reproduction==='withheld'&&!Object.hasOwn(e,'quote'))).map(claim=>claim.id):[]};
    },
    translationEquivalent:claim=>recordHash('claims',claim),
    validateStory:(story,{snapshot})=>exactSnapshot(snapshot)&&recordHash('stories',story),
    validatePublicRecord:({kind,record,snapshot})=>exactSnapshot(snapshot)&&recordHash(kind,record),
    verifyStoredSnapshot:({snapshot})=>exactSnapshot(snapshot),
  });
}));
export const STATIC_HISTORICAL_EVALUATION=admission.historicalEvaluation;
