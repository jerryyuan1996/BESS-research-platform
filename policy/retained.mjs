import { digest } from './integrity.mjs';
/** `index` and `previous` must come from the trusted committed policy store.
 * No candidate field is accepted as a prior approval. */
export function retainedProofs(index,previous,snapshot){
  const result={sourceIds:new Set(),claimIds:new Set(),attestations:new Map(),sourceReviews:new Map(),storyReviews:new Map(),humanReviewDecisions:new Map(),records:new Map()};
  if(!index||!previous)return result;
  if(digest(previous)!==index.head)throw new Error('Retained policy history checksum mismatch');
  const same=(kind,record)=>previous[kind].some(p=>p.id===record.id&&digest(p)===digest(record));const proof=index.verification||{};
  for(const source of snapshot.sources||[])if(same('sources',source)&&proof.sources?.[source.id]?.sourceHash===digest(source)){result.sourceIds.add(source.id);result.sourceReviews.set(source.id,proof.sources[source.id]);}
  for(const claim of snapshot.claims||[])if(same('claims',claim)&&claim.evidence.every(e=>result.sourceIds.has(e.source))&&proof.claims?.[claim.id]?.claimHash===digest(claim)){result.claimIds.add(claim.id);result.attestations.set(claim.id,proof.claims[claim.id]);}
  for(const story of snapshot.stories||[])if(same('stories',story)&&story.claimIds.every(id=>result.claimIds.has(id))&&proof.stories?.[story.id]?.storyHash===digest(story))result.storyReviews.set(story.id,proof.stories[story.id]);
  for(const review of snapshot.reviews||[])if(same('reviews',review)&&proof.reviewDecisions?.[review.id]?.reviewHash===digest(review))result.humanReviewDecisions.set(review.id,proof.reviewDecisions[review.id]);
  for(const kind of ['instruments','events','impacts','stories','links','reviews'])for(const record of snapshot[kind]||[])if(same(kind,record)&&proof.records?.[kind]?.[record.id]===digest(record))result.records.set(`${kind}:${record.id}`,digest(record));
  return result;
}
