import {digest,sourceDigest} from '../../policy/integrity.mjs';
import {requireUnapprovedProposal} from '../../policy/review-bundle.mjs';
import {createPinnedPDFPreparer} from './review-evidence-io.mjs';

const sourceData=s=>{const copy=structuredClone(s);delete copy.rights.reviewed;return copy;};
const claimData=c=>{const copy=structuredClone(c);delete copy.translationReviewed;return copy;};
const snapshotData=s=>{const copy=structuredClone(s);copy.sources=copy.sources.map(sourceData);copy.claims=copy.claims.map(claimData);return copy;};

/** Manual-review drafts, never an approved registry. Templates are supplied by
 * the trusted offline preparer from committed proposals and pinned originals,
 * never from an untrusted model candidate. Mechanical matching is not semantic
 * acceptance: every returned approval flag is false and quotation cap is zero. */
export function proposedReviewProfiles({proposal,drafts,corpus,sourceRoot,extractor}){
  requireUnapprovedProposal(proposal);
  if(!drafts.length||drafts.some(d=>d.manifest.publicationApproved!==false||d.manifest.structuralProblems.length)||
    corpus.some(c=>c.expectedReview!==null||c.actualReview!==null||c.reviewer!==null||c.sourceReviewed!==false||c.rightsReviewed!==false||c.translationReviewed!==false))throw Error('Only unapproved, structurally checked preparation data may define profile drafts');
  const snapshots=drafts.map(d=>structuredClone(d.snapshot));
  const snapshotHashes=new Set(snapshots.map(s=>digest(snapshotData(s))));
  const claimHashes=new Map(),translations=new Map(),stories=new Map(),records=new Map(),bindings=new Map();
  for(const snapshot of snapshots){
    for(const claim of snapshot.claims){claimHashes.set(claim.id,digest(claimData(claim)));translations.set(claim.id,digest(claim.text));}
    for(const story of snapshot.stories)stories.set(story.id,digest(story));
    for(const kind of ['instruments','events','impacts','stories','links','reviews'])for(const record of snapshot[kind])records.set(kind+':'+record.id,digest(record));
    for(const source of snapshot.sources){const d=proposal.documents.find(d=>d.url===source.url);if(!d)throw Error('Template source is outside the committed proposal');
      const list=bindings.get(d.id)||[];if(!list.some(b=>b.source.id===source.id&&b.source.contentHash===source.contentHash))list.push({source,sourceHash:digest(sourceData(source))});bindings.set(d.id,list);}
  }
  for(const c of corpus){const definition=proposal.cases.find(p=>p.id===c.id),document=proposal.documents.find(d=>d.id===definition?.sourceId);if(!document||sourceDigest(c.body)!==c.source.contentHash||document.originalByteHash!==c.originalByteHash)throw Error('Corpus source does not match its pinned document');
    const list=bindings.get(document.id)||[];list.push({source:structuredClone(c.source),sourceHash:digest(sourceData(c.source))});bindings.set(document.id,list);}
  const quoteByURL=new Map();
  // Count the combined snapshot once rather than double-counting its four
  // independently reviewable market projections.
  const largest=snapshots.reduce((a,b)=>a.claims.length>b.claims.length?a:b);
  for(const claim of largest.claims)for(const evidence of claim.evidence){const source=largest.sources.find(s=>s.id===evidence.source);quoteByURL.set(source.url,(quoteByURL.get(source.url)||0)+evidence.quote.length);}
  const profiles=[];
  for(const document of proposal.documents){
    const allowed=bindings.get(document.id);if(!allowed?.length)continue;
    const manual=new Map();
    for(const c of corpus.filter(c=>proposal.cases.find(p=>p.id===c.id)?.sourceId===document.id&&c.mediaType==='application/pdf')){
      manual.set(c.id,createPinnedPDFPreparer({sourceRoot,document,extractor,definition:{caseId:c.id,sourceId:c.source.id,url:c.source.url,locator:c.locator,textHash:c.source.contentHash,pages:c.extraction.pages,...(c.extraction.ranges?{ranges:c.extraction.ranges}:{})}}));
    }
    const profile={id:'proposed-'+document.id,host:new URL(document.url).hostname,sourceIds:Object.freeze([...new Set(allowed.map(b=>b.source.id))]),reviewed:false,rightsReviewed:false,maxQuoteChars:0,
      proposedMaxQuoteChars:quoteByURL.get(document.url)||0,
      validate:({source,claims,body})=>{
        const known=allowed.some(b=>b.source.id===source.id&&b.sourceHash===digest(sourceData(source))&&sourceDigest(body)===b.source.contentHash);
        return {sourceSupported:known,supportedClaimIds:known?claims.filter(c=>c.evidence?.some(e=>e.source===source.id)&&claimHashes.get(c.id)===digest(claimData(c))).map(c=>c.id):[]};
      },
      translationEquivalent:claim=>translations.get(claim.id)===digest(claim.text),
      validateStory:story=>stories.get(story.id)===digest(story),
      validatePublicRecord:({kind,record})=>records.get(kind+':'+record.id)===digest(record),
      verifyStoredSnapshot:({snapshot})=>snapshotHashes.has(digest(snapshotData(snapshot))),
      prepareManualEvidence:async args=>{const prepare=manual.get(args.case?.id);if(!prepare)throw Error('No pinned manual PDF definition for this source');return prepare(args);},
    };
    const manifest={id:profile.id,host:profile.host,sourceIds:profile.sourceIds,reviewed:false,rightsReviewed:false,maxQuoteChars:0,proposedMaxQuoteChars:profile.proposedMaxQuoteChars,
      originalByteHash:document.originalByteHash,sourceBindings:allowed.map(b=>({sourceId:b.source.id,sourceHash:b.sourceHash,textHash:b.source.contentHash})),
      claimHashes:Object.fromEntries(claimHashes),translationHashes:Object.fromEntries(translations),storyHashes:Object.fromEntries(stories),recordHashes:Object.fromEntries(records),snapshotHashes:[...snapshotHashes],
      meaning:'Author-proposed exact-template matching only. Requires independent source/meaning/translation/rights and analyst configuration acceptance. Serialized data is not an approved executable profile.'};
    profiles.push({profile:Object.freeze(profile),manifest});
  }
  return profiles;
}
