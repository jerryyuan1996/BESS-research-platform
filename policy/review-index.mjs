/** Public-safe sidecar projection; no investment text or writer is involved. */
export function pendingReviewIndex(snapshot){
  return snapshot.reviews.filter(r=>r.status==='pending_reassessment').flatMap(review=>{
    const claim=snapshot.claims.find(c=>c.id===review.claim);
    return review.linkIds.map(id=>snapshot.links.find(l=>l.id===id)).filter(link=>link&&link.state!=='unmapped').map(link=>({id:review.id,market:link.market,instrument:claim.instrument,claim:claim.id}));
  });
}
