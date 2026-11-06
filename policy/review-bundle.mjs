import {createHash} from 'node:crypto';
import {digest,sourceDigest} from './integrity.mjs';
import {policyMateriality,validatePolicySnapshot} from './schema.mjs';

export const originalHash=bytes=>'sha256:'+createHash('sha256').update(bytes).digest('hex');
const normal=text=>text.normalize('NFC').replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{const p=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return p>0&&p<=0x10ffff?String.fromCodePoint(p):' ';}).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/\s+/g,' ').toLowerCase();
export function literalReviewChecks(body,tokens){return tokens.map(token=>({token,found:normal(body).includes(normal(token))}));}

/** Proposed source windows only, pending independent context/selection review.
 * No altered text or replacement bytes are introduced. Oversize windows stay
 * unadmitted instead of increasing the paid input cap. */
export function proposePDFRanges(extracted,tokens,{maxChars=1400,rules=null}={}){
  const ranges=[];
  if(rules){
    for(const rule of rules){
      const page=extracted.find(p=>p.page===rule.page);if(!page)return [];
      const find=anchor=>new RegExp(anchor.split(/\s+/).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+'),'i').exec(page.text);
      const start=find(rule.start),end=find(rule.end);if(!start||!end||end.index<=start.index)return [];
      ranges.push({page:page.page,start:start.index,end:end.index,pageHash:sourceDigest(page.text)});
    }
    return ranges.reduce((sum,r)=>sum+r.end-r.start,0)<=maxChars?ranges:[];
  }
  for(const page of extracted){
    const spans=[];
    for(const token of tokens){
      const pattern=token.split(/\s+/).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+');
      const match=new RegExp(pattern,'i').exec(page.text);if(!match)continue;
      let start=Math.max(0,match.index-100),end=Math.min(page.text.length,match.index+match[0].length+230);
      const lineStart=page.text.lastIndexOf('\n',start);if(lineStart>=0&&start-lineStart<80)start=lineStart+1;
      const lineEnd=page.text.indexOf('\n',end);if(lineEnd>=0&&lineEnd-end<80)end=lineEnd;
      spans.push({start,end});
    }
    if(!spans.length)spans.push({start:0,end:Math.min(240,page.text.length)});
    spans.sort((a,b)=>a.start-b.start);
    const merged=[];for(const span of spans){const last=merged.at(-1);if(last&&span.start<=last.end)last.end=Math.max(last.end,span.end);else if(span.end>span.start)merged.push({...span});}
    for(const span of merged)ranges.push({page:page.page,...span,pageHash:sourceDigest(page.text)});
  }
  return ranges.reduce((sum,r)=>sum+r.end-r.start,0)<=maxChars?ranges:[];
}

export function requireUnapprovedProposal(proposal){
  if(proposal?.schemaVersion!==1||proposal.approvalState!=='proposal_only'||proposal.activationAllowed!==false||proposal.independentReviewer!==null||
    !Array.isArray(proposal.cases)||proposal.cases.length<12||!Array.isArray(proposal.documents)||!Array.isArray(proposal.pilots))throw Error('Only the fixed unapproved review proposal is accepted');
  const ids=new Set(),sources=new Set();
  for(const d of proposal.documents){
    if(!/^[a-z][a-z0-9-]+$/.test(d.id)||sources.has(d.id)||d.file!==d.id+(d.mediaType==='application/pdf'?'.pdf':'.html')||!/^sha256:[a-f0-9]{64}$/.test(d.originalByteHash)||
      d.rightsEvidence?.reviewed!==false||d.rightsEvidence?.rightsReviewed!==false)throw Error('Invalid or prematurely approved source proposal');
    sources.add(d.id);
  }
  for(const c of proposal.cases){
    if(!/^[a-z][a-z0-9-]+$/.test(c.id)||ids.has(c.id)||!sources.has(c.sourceId)||c.expectedReview!==null||c.actualReview!==null||c.reviewedBy!==null||
      c.sourceReviewed!==false||c.rightsReviewed!==false||c.translationReviewed!==false||typeof c.proposedExpectedReview!=='boolean'||!Array.isArray(c.literalChecks)||!c.literalChecks.length)throw Error('Invalid or prematurely approved case proposal');
    ids.add(c.id);
  }
  if(new Set(proposal.pilots.map(p=>p.market)).size!==4||['de','gb','nem','wa'].some(m=>!proposal.pilots.some(p=>p.market===m)))throw Error('Four distinct market pilot drafts required');
  return true;
}

export function proposedMateriality(c){
  return policyMateriality({verified:true,markets:c.mechanism==='context'?[]:[c.market],mechanisms:[c.mechanism]});
}

const months={January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',July:'07',August:'08',September:'09',October:'10',November:'11',December:'12'};
export function parityDates(text){
  return text.replace(/\b(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g,(_,d,m,y)=>`${y}-${months[m]}-${d.padStart(2,'0')}`)
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g,(_,m,y)=>`${y}-${months[m]}`)
    .replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g,(_,y,m,d)=>`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`)
    .replace(/(\d{4})年(\d{1,2})月/g,(_,y,m)=>`${y}-${m.padStart(2,'0')}`);
}

/** Returns original source characters, never a normalized or invented quote. */
export function originalQuote(body,anchor){
  const exact=body.indexOf(anchor);
  if(exact>=0)return body.slice(exact,exact+Math.min(260,Math.max(anchor.length,180)));
  const pattern=anchor.split(/\s+/).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+');
  const match=new RegExp(pattern,'i').exec(body);
  if(!match)return null;
  return body.slice(match.index,match.index+Math.min(260,Math.max(match[0].length,180)));
}

/** Canonical-shaped drafts stay unpublishable. Evidence units are produced by
 * the offline byte/extraction runner, not a model or serialized approval. */
export function buildPilotDraft(pilot,proposal,units,now){
  const cases=proposal.cases.filter(c=>c.market===pilot.market);
  const sources=[],claims=[];const bodies=new Map();
  const sourceFor=(id,unit,issuedAt=null)=>{
    const d=proposal.documents.find(d=>d.id===unit.documentId);
    const source={id,url:d.url,publisher:d.publisher,title:d.title,language:d.language,authority:'official',locator:unit.locator,contentHash:sourceDigest(unit.body),issuedAt,checkedAt:new Date(d.retrievedAt).toISOString(),rights:{metadata:true,termsURL:d.rightsEvidence.termsURL,reviewed:false}};
    sources.push(source);bodies.set(id,unit.body);return source;
  };
  const instrument='pol-'+pilot.id;
  const core=units.get('core-'+pilot.market);if(!core)throw Error('Core source unit missing');
  const coreSource=sourceFor('src-core-'+pilot.market,core,pilot.lifecycle.publishedAt);
  const stateQuote=originalQuote(core.body,pilot.lifecycle.stateAnchor),dateQuote=originalQuote(core.body,pilot.lifecycle.dateAnchor);
  if(!stateQuote||!dateQuote)throw Error(`${pilot.market}: core original quotation missing`);
  const add=(id,kind,predicate,value,text,source,quote,mechanism='context')=>{
    const claim={id,instrument,kind,predicate,value,status:'verified',text:text.map(parityDates),markets:[pilot.market],mechanism,evidence:(Array.isArray(quote)?quote:[quote]).map(q=>({source:source.id,locator:source.locator,quote:q,supports:kind})),translationReviewed:false};claims.push(claim);return claim;
  };
  const zhState={consultation:'征询意见',adopted:'已正式制定'}[pilot.lifecycle.state];
  const state=add('cl-state-'+pilot.market,'legal_status',null,pilot.lifecycle.state,[`The cited original record establishes ${pilot.lifecycle.state} for the named instrument; later completeness remains a separate check.`,`所引原始记录支持该文件处于“${zhState}”状态；后续证据的完整性须另行核对。`],coreSource,stateQuote);
  const published=add('cl-published-'+pilot.market,'date','published_at',pilot.lifecycle.publishedAt,[`The cited original record is dated ${pilot.lifecycle.publishedAt}.`,`所引原始记录日期为 ${pilot.lifecycle.publishedAt}。`],coreSource,dateQuote);
  const claimIds=new Map();const positionIds=new Map();const detailIds=new Map();
  for(const c of cases){
    const unit=units.get(c.id);if(!unit)throw Error('Case source unit missing');
    const source=sourceFor('src-'+c.id,unit);
    const quote=c.positions?c.positionAnchors.map(anchor=>originalQuote(unit.body,anchor)):c.literalChecks.map(anchor=>originalQuote(unit.body,anchor)).find(Boolean);
    if(Array.isArray(quote)?quote.some(q=>!q):!quote)throw Error(`${c.id}: original evidence quotation missing`);
    const claim=add('cl-'+c.id,'fact','related_policy_context',null,c.referenceFact,source,quote,c.mechanism);claimIds.set(c.id,claim.id);
    if(c.positions){const ids=c.positions.map((pair,i)=>add(`cl-${c.id}-${i?'b':'a'}`,'fact','attributed_consultation_position',null,pair,source,quote[i],c.mechanism).id);positionIds.set(c.id,ids);}
    if(c.details){const ids=c.details.map((detail,i)=>add(`cl-${c.id}-${i?'new':'old'}`,'fact','source_version_record',null,detail.text,source,originalQuote(unit.body,detail.anchor),c.mechanism).id);detailIds.set(c.id,ids);}
  }
  const chapterRows=pilot.chapters.map(c=>{
    let ids=c.caseIds.map(id=>claimIds.get(id));if(ids.some(id=>!id))throw Error('Chapter refers outside its market evidence graph');
    let relations=[];
    if(c.scene==='stakeholder'){
      const positions=positionIds.get(c.caseIds[0]);if(!positions||positions.length!==2)throw Error('Sourced stakeholder endpoints missing');
      ids=[...positions,ids[0]];relations=[{from:positions[0],to:positions[1],evidenceClaim:ids[2]}];
    }
    if(c.scene==='timeline')ids=[published.id,...ids];
    if(c.scene==='before_after'&&ids.length===1&&detailIds.has(c.caseIds[0]))ids=detailIds.get(c.caseIds[0]);
    return {id:c.id,title:c.title,text:c.text.map(parityDates),claimIds:[...new Set(ids)],scene:{template:c.scene,claimIds:[...new Set(ids)],impactIds:[],relations}};
  });
  const economicClaim=claimIds.get(pilot.economicCase);
  const snapshot={schemaVersion:1,id:pilot.id,createdAt:now,parent:null,sources,
    instruments:[{id:instrument,officialId:pilot.officialId,jurisdiction:pilot.jurisdiction,markets:[pilot.market],title:pilot.title,state:pilot.lifecycle.state,supersedes:null}],
    events:[{id:'evt-'+pilot.id,instrument,kind:'transition',from:null,to:pilot.lifecycle.state,announcedAt:null,publishedAt:pilot.lifecycle.publishedAt,effectiveAt:null,verifiedAt:now,consultationClosesAt:null,adoptedAt:null,claimIds:[state.id,published.id],corrects:null,summary:[`Original ${pilot.lifecycle.state} record; no universal current entitlement inferred.`,`原始记录的状态为“${zhState}”；不据此推断普遍的现行收入权利。`]}],claims,
    impacts:[{id:'imp-'+pilot.market+'-unquantified',claim:economicClaim,lane:'not_quantifiable',value:null,currency:null,denominator:null,period:null,technology:'BESS',location:pilot.market,formula:null,inputs:[],attribution:null,asOf:now.slice(0,10),contract:null,taxTreatment:null,marketDefinition:pilot.jurisdiction}],
    stories:[{id:'story-'+pilot.id,title:pilot.title,answer:pilot.answer,instrumentIds:[instrument],claimIds:claims.map(c=>c.id),chapters:chapterRows,changesIf:pilot.changesIf}],links:[],reviews:[]};
  const errors=validatePolicySnapshot(snapshot,{marketIds:['de','gb','nem','wa'],allowedHosts:[...new Set(sources.map(s=>new URL(s.url).hostname))],evidenceBodies:bodies});
  const expectedReviewGates=errors.filter(e=>/redistribution terms not reviewed|semantic translation review missing/.test(e));
  const structuralProblems=errors.filter(e=>!expectedReviewGates.includes(e));
  return {snapshot,bodies,manifest:{market:pilot.market,candidateHash:digest(snapshot),fullSchemaValid:errors.length===0,structuralProblems,unapprovedReviewGateCount:expectedReviewGates.length,publicationApproved:false,independentSemanticReview:false,questions:pilot.questions}};
}

/** One initial publication candidate, retaining four independently reviewable
 * market drafts. It does not try to publish four unrelated null-parent heads. */
export function combinePilotDrafts(drafts,now){
  if(drafts.length!==4||new Set(drafts.map(d=>d.manifest.market)).size!==4)throw Error('Four distinct pilot drafts required');
  const snapshot={schemaVersion:1,id:'four-market-policy-pilots',createdAt:now,parent:null};
  for(const key of ['sources','instruments','events','claims','impacts','stories','links','reviews'])snapshot[key]=drafts.flatMap(d=>structuredClone(d.snapshot[key]));
  const bodies=new Map(drafts.flatMap(d=>[...d.bodies]));
  const errors=validatePolicySnapshot(snapshot,{marketIds:['de','gb','nem','wa'],allowedHosts:[...new Set(snapshot.sources.map(s=>new URL(s.url).hostname))],evidenceBodies:bodies});
  const structuralProblems=errors.filter(e=>!/redistribution terms not reviewed|semantic translation review missing/.test(e));
  return {snapshot,bodies,manifest:{market:'all',candidateHash:digest(snapshot),fullSchemaValid:errors.length===0,structuralProblems,publicationApproved:false,independentSemanticReview:false}};
}
