import {createHash} from 'node:crypto';
import {digest,sourceDigest} from './integrity.mjs';
import {policyMateriality,validatePolicySnapshot} from './schema.mjs';
import {sourceUseRights,projectEvidence} from './source-use.mjs';
import {investmentReviewDrafts} from './investment-review-drafts.mjs';

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
  if(proposal?.schemaVersion!==2||proposal.approvalState!=='proposal_only'||proposal.activationAllowed!==false||proposal.independentReviewer!==null||
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
    if(proposal.schemaVersion===2&&(!Array.isArray(c.quoteSpans)||!c.quoteSpans.length||!['applicable','excluded','unresolved'].includes(c.applicability)||!Array.isArray(c.applicabilityReason)||c.applicabilityReason.length!==2))throw Error('Explicit evidence selection and applicability are required');
  }
  if(new Set(proposal.pilots.map(p=>p.market)).size!==4||['de','gb','nem','wa'].some(m=>!proposal.pilots.some(p=>p.market===m)))throw Error('Four distinct market pilot drafts required');
  return true;
}

export function proposedMateriality(c){
  return policyMateriality({verified:c.applicability!=='unresolved',markets:c.applicability==='excluded'?[]:[c.market],mechanisms:[c.mechanism]});
}

/** Fixed author-selected offsets, bound to the whole evidence unit. Repeated
 * headings, changed context and stale offsets must not silently pick a quote. */
export function selectedQuotes(unit,spans){
  if(!unit||!Array.isArray(spans)||!spans.length)throw Error('Explicit original quotation spans required');
  return spans.map(span=>{
    if(Object.keys(span).some(k=>!['start','end','textHash','quoteHash'].includes(k))||!Number.isInteger(span.start)||!Number.isInteger(span.end)||span.start<0||span.end>unit.body.length||span.end<=span.start||span.end-span.start>300||span.textHash!==sourceDigest(unit.body))throw Error('Original quotation span or context hash differs');
    const quote=unit.body.slice(span.start,span.end);
    if(sourceDigest(quote)!==span.quoteHash)throw Error('Original quotation hash differs');
    return quote;
  });
}

const months={January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',July:'07',August:'08',September:'09',October:'10',November:'11',December:'12'};
export function parityDates(text){
  return text.replace(/\b(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g,(_,d,m,y)=>`${y}-${months[m]}-${d.padStart(2,'0')}`)
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g,(_,m,y)=>`${y}-${months[m]}`)
    .replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g,(_,y,m,d)=>`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`)
    .replace(/(\d{4})年(\d{1,2})月/g,(_,y,m)=>`${y}-${m.padStart(2,'0')}`);
}

// A missing verification time is a pending review gate, never an approved or
// fabricated timestamp. The public schema still requires an actual UTC time.
const pendingDraftReviewGate=(error,snapshot)=>/redistribution terms not reviewed|semantic translation review missing/.test(error)||snapshot.events.some(event=>event.verifiedAt===null&&error===event.id+'.verifiedAt: explicit UTC timestamp required');

/** Canonical-shaped drafts stay unpublishable. Evidence units are produced by
 * the offline byte/extraction runner, not a model or serialized approval. */
export function buildPilotDraft(pilot,proposal,units,now,{publicReferences=null}={}){
  if(proposal.schemaVersion!==2||!pilot.records)throw Error('Explicit v2 evidence selections and dated records required; legacy first-match preparation is retired');
  const cases=proposal.cases.filter(c=>c.market===pilot.market);
  const sources=[],claims=[],bodies=new Map(),sourceIds=new Map(),quoteProofs=new Map();
  const sourceFor=id=>{
    if(sourceIds.has(id))return sourceIds.get(id);
    const unit=units.get(id),d=proposal.documents.find(d=>d.id===unit?.documentId);
    if(!d)throw Error('Original evidence unit missing');
    const source={id:'src-'+id,url:d.url,publisher:d.publisher,title:d.title,language:d.language,authority:'official',locator:unit.locator,contentHash:sourceDigest(unit.body),issuedAt:unit.issuedAt??null,checkedAt:new Date(d.retrievedAt).toISOString(),rights:{...sourceUseRights(d),...(pilot.evidenceUnits.find(def=>def.id===id)?.withholdOriginalExcerpts===true?{reproduction:'facts_only'}:{})}};
    sources.push(source);bodies.set(source.id,unit.body);sourceIds.set(id,source);return source;
  };
  const evidenceFor=(refs,kind)=>refs.flatMap(ref=>{
    const source=sourceFor(ref.unit);
    return selectedQuotes(units.get(ref.unit),ref.spans).map(quote=>projectEvidence({source,quote,kind,quoteProofs}));
  });
  const add=definition=>{
    const {evidence,...data}=definition;
    const claim={...data,status:'verified',text:data.text.map(parityDates),markets:data.markets??[pilot.market],mechanism:data.mechanism??'context',evidence:evidenceFor(evidence,data.kind),translationReviewed:false};
    claims.push(claim);return claim;
  };
  const claimIds=new Map(),positionIds=new Map(),detailIds=new Map();
  for(const c of cases){
    const refs=spans=>[{unit:c.id,spans}];
    const base={instrument:c.instrumentId??pilot.records.rootInstrument,markets:c.applicability==='excluded'?[]:[pilot.market],mechanism:c.mechanism};
    const claim=add({...base,id:'cl-'+c.id,kind:'fact',predicate:'related_policy_context',value:null,text:c.referenceFact,evidence:[...refs(c.quoteSpans),...(c.supplementalEvidence??[])]});
    claimIds.set(c.id,claim.id);
    if(c.positions)positionIds.set(c.id,c.positions.map((text,i)=>add({...base,id:`cl-${c.id}-${i?'b':'a'}`,kind:'fact',predicate:'attributed_consultation_position',value:null,text,evidence:refs(c.positionQuoteSpans[i])}).id));
    if(c.details)detailIds.set(c.id,c.details.map((d,i)=>add({...base,id:`cl-${c.id}-${i?'new':'old'}`,kind:d.kind??'fact',predicate:d.predicate??'source_version_record',value:d.value??null,text:d.text,...(d.dateSubject?{dateSubject:d.dateSubject}:{}),evidence:refs(d.quoteSpans)}).id));
  }
  for(const definition of pilot.records.claims)add(definition);
  const chapterRows=pilot.chapters.map(c=>{
    let ids=c.caseIds.map(id=>claimIds.get(id));if(ids.some(id=>!id))throw Error('Chapter refers outside its market evidence graph');
    let sceneIds=ids,relations=[];
    if(c.scene==='stakeholder'){
      const positions=positionIds.get(c.caseIds[0]);if(!positions||positions.length!==2)throw Error('Sourced stakeholder endpoints missing');
      sceneIds=[...positions,ids[0]];relations=[{from:positions[0],to:positions[1],evidenceClaim:ids[0]}];ids=[...ids,...positions];
    }
    if(c.scene==='timeline'){
      sceneIds=c.timelineClaimIds;
      if(!Array.isArray(sceneIds)||!sceneIds.length||sceneIds.some(id=>claims.find(claim=>claim.id===id)?.kind!=='date'))throw Error('Timeline requires explicitly dated claims');
      ids=[...ids,...sceneIds];
    }
    if(c.scene==='before_after'&&ids.length===1&&detailIds.has(c.caseIds[0])){sceneIds=detailIds.get(c.caseIds[0]);ids=[...ids,...sceneIds];}
    if(c.scene==='impact_summary'){const economicClaim=claimIds.get(pilot.economicCase);ids=[...ids,economicClaim];sceneIds=[...sceneIds,economicClaim];}
    return {id:c.id,title:c.title,text:c.text.map(parityDates),claimIds:[...new Set(ids)],scene:{template:c.scene,claimIds:[...new Set(sceneIds)],impactIds:c.scene==='impact_summary'?['imp-'+pilot.market+'-unquantified']:[],relations}};
  });
  const instruments=structuredClone(pilot.records.instruments).map(instrument=>({...instrument,currentness:{status:'unknown',asOf:null,scope:['Only the cited source versions have been examined; later changes and complete current law are not established.','仅检查所引来源版本；尚未确立后续变更及完整现行法律。']}})),events=pilot.records.events.map(event=>({...structuredClone(event),verifiedAt:null}));
  const snapshot={schemaVersion:1,id:pilot.id,createdAt:now,parent:null,sources,instruments,events,claims,
    impacts:[{id:'imp-'+pilot.market+'-unquantified',claim:claimIds.get(pilot.economicCase),lane:'not_quantifiable',value:null,currency:null,denominator:null,period:null,technology:'BESS',location:pilot.market,formula:null,inputs:[],attribution:null,asOf:null,contract:null,taxTreatment:null,marketDefinition:pilot.jurisdiction}],
    stories:[{id:'story-'+pilot.id,title:pilot.title,answer:pilot.answer,instrumentIds:instruments.map(i=>i.id),claimIds:claims.map(c=>c.id),chapters:chapterRows,changesIf:pilot.changesIf}],links:[],reviews:[]};
  const investment=publicReferences?investmentReviewDrafts(snapshot,cases,publicReferences):{links:[],reviews:[],baselines:[]};
  snapshot.links=investment.links;snapshot.reviews=investment.reviews;
  const errors=validatePolicySnapshot(snapshot,{marketIds:['de','gb','nem','wa'],allowedHosts:[...new Set(sources.map(s=>new URL(s.url).hostname))],evidenceBodies:bodies,quoteProofs});
  const expectedReviewGates=errors.filter(e=>pendingDraftReviewGate(e,snapshot));
  const structuralProblems=errors.filter(e=>!expectedReviewGates.includes(e));
  return {snapshot,bodies,quoteProofs,baselines:investment.baselines,manifest:{market:pilot.market,candidateHash:digest(snapshot),fullSchemaValid:errors.length===0,structuralProblems,unapprovedReviewGateCount:expectedReviewGates.length,verificationPendingEvents:events.filter(e=>e.verifiedAt===null).map(e=>e.id),publicationApproved:false,independentSemanticReview:false,questions:pilot.questions}};
}

/** One initial publication candidate, retaining four independently reviewable
 * market drafts. It does not try to publish four unrelated null-parent heads. */
export function combinePilotDrafts(drafts,now){
  if(drafts.length!==4||new Set(drafts.map(d=>d.manifest.market)).size!==4)throw Error('Four distinct pilot drafts required');
  const snapshot={schemaVersion:1,id:'four-market-policy-pilots',createdAt:now,parent:null};
  for(const key of ['sources','instruments','events','claims','impacts','stories','links','reviews'])snapshot[key]=drafts.flatMap(d=>structuredClone(d.snapshot[key]));
  const bodies=new Map(drafts.flatMap(d=>[...d.bodies]));
  const quoteProofs=new Map(drafts.flatMap(d=>[...d.quoteProofs]));
  const errors=validatePolicySnapshot(snapshot,{marketIds:['de','gb','nem','wa'],allowedHosts:[...new Set(snapshot.sources.map(s=>new URL(s.url).hostname))],evidenceBodies:bodies,quoteProofs});
  const structuralProblems=errors.filter(e=>!pendingDraftReviewGate(e,snapshot));
  return {snapshot,bodies,quoteProofs,manifest:{market:'all',candidateHash:digest(snapshot),fullSchemaValid:errors.length===0,structuralProblems,verificationPendingEvents:snapshot.events.filter(e=>e.verifiedAt===null).map(e=>e.id),publicationApproved:false,independentSemanticReview:false}};
}
