import { digest,verifyEvidenceHashes } from './integrity.mjs';
import { validatePolicySnapshot,PublicInvestmentReferenceResolver,policyMateriality } from './schema.mjs';
/** Only trusted code supplies profiles, never fields from the candidate JSON. */
export function independentlyValidate({snapshot,bodies,profiles,marketIds,publicReferences={},retained=null}){
  const context={marketIds,allowedHosts:profiles.filter(p=>p.reviewed&&p.rightsReviewed).map(p=>p.host),attestations:new Map(retained?.attestations||[]),sourceReviews:new Map(retained?.sourceReviews||[]),storyReviews:new Map(retained?.storyReviews||[]),humanReviewDecisions:new Map(retained?.humanReviewDecisions||[]),resolver:new PublicInvestmentReferenceResolver({markets:marketIds,records:publicReferences})};
  const errors=[];
  try{errors.push(...validatePolicySnapshot(snapshot,{...context,evidenceBodies:bodies,retainedClaimIds:retained?.claimIds||new Set()}),...verifyEvidenceHashes(snapshot,bodies,{retainedSourceIds:retained?.sourceIds||new Set()}));}catch{return {valid:false,errors:['Malformed candidate'],context};}
  for(const source of snapshot.sources){
    if(retained?.sourceIds.has(source.id))continue;
    const profile=profiles.find(p=>p.reviewed&&p.rightsReviewed&&p.host===new URL(source.url).hostname&&p.sourceIds.includes(source.id));
    if(!profile){errors.push(`${source.id}: independently reviewed source profile missing`);continue;}
    const claims=snapshot.claims.filter(c=>c.evidence.some(e=>e.source===source.id));
    let verdict;try{verdict=profile.validate({source,claims,body:bodies.get(source.id),snapshot});}catch{errors.push(`${source.id}: source parser failed`);continue;}
    if(!verdict?.sourceSupported){errors.push(`${source.id}: original source does not establish the candidate`);continue;}
    context.sourceReviews.set(source.id,{sourceHash:digest(source),maxQuoteChars:profile.maxQuoteChars});
    for(const claim of claims){if(verdict.supportedClaimIds?.includes(claim.id)&&profile.translationEquivalent(claim))context.attestations.set(claim.id,{claimHash:digest(claim),supported:true,translationEquivalent:true});else errors.push(`${claim.id}: cited source did not independently support this claim/translation`);}
  }
  for(const claim of snapshot.claims)if(!context.attestations.has(claim.id))errors.push(`${claim.id}: independent semantic/translation approval missing`);
  for(const link of snapshot.links)if(link.state!=='unmapped'&&context.resolver.resolve(link).state==='unmapped')errors.push(`${link.id}: public investment reference unresolved`);
  for(const claim of snapshot.claims){
    const links=snapshot.links.filter(link=>link.claim===claim.id&&link.state!=='unmapped');
    const material=policyMateriality({verified:claim.status==='verified',markets:claim.markets,mechanisms:[claim.mechanism],challengesApprovedView:links.some(link=>link.kind==='challenges')});
    if(material.outcome==='material_investment_review'&&links.length){
      const review=snapshot.reviews.find(row=>row.claim===claim.id&&links.every(link=>row.linkIds.includes(link.id)));
      if(!review)errors.push(`${claim.id}: material investment dependency lacks a review case`);
      else if(review.status==='pending_reassessment'&&links.some(link=>link.state!=='pending_reassessment'))errors.push(`${claim.id}: pending review must have a visible dependency notice`);
    }
  }
  for(const story of snapshot.stories){
    if(context.storyReviews.get(story.id)?.storyHash===digest(story))continue;
    const profile=profiles.find(p=>p.reviewed&&p.rightsReviewed&&typeof p.validateStory==='function'&&p.validateStory(story,{snapshot,bodies})===true);
    if(profile)context.storyReviews.set(story.id,{storyHash:digest(story),supported:true,translationEquivalent:true});else errors.push(`${story.id}: independent narrative/translation approval missing`);
  }
  for(const kind of ['instruments','events','impacts','stories','links','reviews'])for(const record of snapshot[kind]){
    if(retained?.records.get(`${kind}:${record.id}`)===digest(record))continue;
    let approved=false;for(const profile of profiles.filter(p=>p.reviewed&&p.rightsReviewed&&typeof p.validatePublicRecord==='function'))try{if(profile.validatePublicRecord({kind,record,snapshot,bodies})===true){approved=true;break;}}catch{/* An uncertain parser cannot approve a record. */}
    if(!approved)errors.push(`${kind}:${record.id}: independent complete-record review missing`);
  }
  if(!errors.length)context.publicationReviewHash=digest(snapshot);
  return {valid:errors.length===0,errors,context};
}
