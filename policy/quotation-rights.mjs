import {digest} from './integrity.mjs';

/** A new source ID, locator or URL fragment cannot grant a new quotation
 * allowance. Treat identical URLs or bytes as the same work, transitively.
 * Each allowance comes from trusted review, never the candidate's rights flag. */
export function quotationRightsProblems(snapshot,reviews){
  const sources=snapshot.sources||[],parents=sources.map((_,i)=>i),seen=new Map();
  const find=i=>parents[i]===i?i:(parents[i]=find(parents[i]));
  const errors=[];
  sources.forEach((source,i)=>{
    let url;try{const parsed=new URL(source.url);parsed.hash='';url=parsed.href;}catch{errors.push(`${source.id}: invalid source URL`);return;}
    for(const key of [`url:${url}`,`hash:${source.contentHash}`]){
      if(seen.has(key))parents[find(i)]=find(seen.get(key));else seen.set(key,i);
    }
  });
  const groups=new Map();
  sources.forEach((source,i)=>{
    const root=find(i),group=groups.get(root)||{ids:[],limit:Infinity,quoted:0};
    const review=reviews?.get(source.id);
    if(!review||review.sourceHash!==digest(source)||!Number.isInteger(review.maxQuoteChars)||review.maxQuoteChars<0){
      errors.push(`${source.id}: independent source/rights review missing`);group.limit=0;
    }else group.limit=Math.min(group.limit,review.maxQuoteChars);
    group.ids.push(source.id);groups.set(root,group);
  });
  const bySource=new Map(sources.map((source,i)=>[source.id,groups.get(find(i))]));
  for(const claim of snapshot.claims||[])for(const evidence of claim.evidence||[]){
    const group=bySource.get(evidence.source);if(group)group.quoted+=evidence.quote?.length||0;
  }
  for(const group of groups.values())if(group.quoted>group.limit)errors.push(`${group.ids.join(',')}: document quotation allowance exceeded`);
  return errors;
}
