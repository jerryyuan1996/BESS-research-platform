/** Policy data is separate from investment authority. No model/view imports. */
export const SCHEMA_VERSION = 1;
export const STATES = Object.freeze(['draft','consultation','amended','adopted','effective','suspended','withdrawn','repealed','superseded']);
export const TRANSITIONS = Object.freeze({
  draft:['consultation','amended','adopted','withdrawn'], consultation:['amended','adopted','withdrawn'],
  amended:['consultation','adopted','withdrawn'], adopted:['effective','amended','withdrawn','superseded'],
  effective:['suspended','repealed','superseded'], suspended:['effective','repealed','superseded'],
  withdrawn:[], repealed:[], superseded:[],
});
export const MECHANISMS = Object.freeze(['eligibility','grid_access','grid_cost','revenue_right','deadline','investment_call','context']);
export const isPair = x => Array.isArray(x) && x.length === 2 && x.every(s => typeof s === 'string' && s.trim());
export const isId = x => typeof x === 'string' && /^[a-z][a-z0-9_-]{1,95}$/.test(x);
export const isTime = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().slice(0,19) === x.slice(0,19);
export function safeURL(x){
  try { const u=new URL(x); return u.protocol==='https:' && !u.username && !u.password && !/^localhost$|^127\.|^0\.|^10\.|^192\.168\.|^169\.254\.|^\[/.test(u.hostname); } catch { return false; }
}
const requiredKeys = (o, allowed, at, errors) => {
  if (!o || typeof o !== 'object' || Array.isArray(o)) { errors.push(`${at}: object required`); return false; }
  for (const k of Object.keys(o)) if (!allowed.includes(k)) errors.push(`${at}: unknown field ${k}`);
  return true;
};
const unique = (rows,at,errors) => {
  const ids=new Set();
  for (const r of rows){ if(!isId(r?.id)||ids.has(r.id))errors.push(`${at}: invalid or duplicate identity`);ids.add(r?.id); }
  return ids;
};
const textPair=(value,at,errors)=>{if(!isPair(value))errors.push(`${at}: en/zh pair required`);};
const time=(value,at,errors,nullable=false)=>{if(!(nullable&&value===null)&&!isTime(value))errors.push(`${at}: explicit UTC timestamp required`);};

/** Structural/semantic safety check, not a substitute for human translation or legal review. */
export function validatePolicySnapshot(s, {marketIds=[], evidenceBodies=null, allowedHosts=[]}={}){
  const errors=[];
  if(!requiredKeys(s,['schemaVersion','id','createdAt','parent','sources','instruments','events','claims','impacts','stories','links','reviews'], 'snapshot',errors))return errors;
  if(s.schemaVersion!==SCHEMA_VERSION)errors.push('snapshot: unsupported schemaVersion');
  if(!isId(s.id))errors.push('snapshot: invalid id');time(s.createdAt,'createdAt',errors);
  if(s.parent!==null&&!/^[a-f0-9]{64}$/.test(s.parent||''))errors.push('snapshot: invalid parent');
  for(const k of ['sources','instruments','events','claims','impacts','stories','links','reviews'])if(!Array.isArray(s[k]))errors.push(`${k}: array required`);
  if(errors.length)return errors;
  const indexes=Object.fromEntries(['sources','instruments','events','claims','impacts','stories','links','reviews'].map(k=>[k,unique(s[k],k,errors)]));
  const sourceById=new Map(s.sources.map(x=>[x.id,x]));const instrumentById=new Map(s.instruments.map(x=>[x.id,x]));
  const claimById=new Map(s.claims.map(x=>[x.id,x]));
  const ref=(kind,id,at)=>{if(!indexes[kind].has(id))errors.push(`${at}: unresolved ${kind} reference`);};
  const scope=(markets,at)=>{if(!Array.isArray(markets)||!markets.length||markets.some(m=>!marketIds.includes(m)))errors.push(`${at}: explicit known market scope required`);};
  for(const r of s.sources){
    requiredKeys(r,['id','url','publisher','title','language','authority','locator','contentHash','issuedAt','checkedAt','rights'],r.id,errors);
    if(!safeURL(r.url)||!allowedHosts.includes(new URL(safeURL(r.url)?r.url:'https://invalid.invalid').hostname))errors.push(`${r.id}: source outside reviewed HTTPS hosts`);
    if(!['official','attributed_forecast'].includes(r.authority))errors.push(`${r.id}: unsupported source authority`);
    if(!r.publisher||!r.title||!r.language||!r.locator)errors.push(`${r.id}: original source metadata/locator missing`);
    if(!/^sha256:[a-f0-9]{64}$/.test(r.contentHash||''))errors.push(`${r.id}: source hash missing`);
    if(r.rights?.metadata!==true||!r.rights?.termsURL||!safeURL(r.rights.termsURL)||r.rights?.reviewed!==true)errors.push(`${r.id}: redistribution terms not reviewed`);
    time(r.issuedAt,`${r.id}.issuedAt`,errors,true);time(r.checkedAt,`${r.id}.checkedAt`,errors);
  }
  const identities=new Set();
  for(const r of s.instruments){
    requiredKeys(r,['id','officialId','jurisdiction','markets','title','state','supersedes'],r.id,errors);
    textPair(r.title,r.id,errors);scope(r.markets,r.id);
    if(!r.officialId||!r.jurisdiction||!STATES.includes(r.state))errors.push(`${r.id}: instrument identity/state missing`);
    const identity=`${r.jurisdiction}:${r.officialId}`;if(identities.has(identity))errors.push(`${r.id}: duplicate official identity`);identities.add(identity);
    if(r.supersedes!==null){ref('instruments',r.supersedes,r.id);if(r.supersedes===r.id)errors.push(`${r.id}: self supersession`);}
  }
  const eventStates=new Map();const eventTimes=new Map();
  for(const r of s.events){
    requiredKeys(r,['id','instrument','kind','from','to','announcedAt','publishedAt','effectiveAt','verifiedAt','claimIds','corrects','summary'],r.id,errors);
    ref('instruments',r.instrument,r.id);textPair(r.summary,r.id,errors);
    if(!['transition','correction'].includes(r.kind))errors.push(`${r.id}: unknown event kind`);
    if(!STATES.includes(r.to))errors.push(`${r.id}: invalid event state`);
    if(r.kind==='transition' && !(r.from===null||TRANSITIONS[r.from]?.includes(r.to)))errors.push(`${r.id}: illegal lifecycle transition`);
    if(r.kind==='correction' && (!r.corrects||r.from!==r.to))errors.push(`${r.id}: correction must preserve state and name prior event`);
    if(r.corrects!==null){ref('events',r.corrects,r.id);if(r.corrects===r.id)errors.push(`${r.id}: self correction`);}
    if(eventStates.has(r.instrument)&&eventStates.get(r.instrument)!==r.from)errors.push(`${r.id}: discontinuous event history`);
    eventStates.set(r.instrument,r.to);
    for(const k of ['announcedAt','effectiveAt'])time(r[k],`${r.id}.${k}`,errors,true);
    for(const k of ['publishedAt','verifiedAt'])time(r[k],`${r.id}.${k}`,errors);
    if(Date.parse(r.publishedAt)>Date.parse(r.verifiedAt))errors.push(`${r.id}: verified before publication`);
    if(Date.parse(r.verifiedAt)<(eventTimes.get(r.instrument)||0))errors.push(`${r.id}: non-append-only chronology`);
    eventTimes.set(r.instrument,Date.parse(r.verifiedAt));
    if(r.to==='effective'&&(!r.effectiveAt||Date.parse(r.effectiveAt)>Date.parse(r.verifiedAt)))errors.push(`${r.id}: future or unknown effect is not effective law`);
    if(!Array.isArray(r.claimIds)||!r.claimIds.length)errors.push(`${r.id}: event needs sourced claims`);
    else for(const c of r.claimIds){ref('claims',c,r.id);const claim=claimById.get(c);if(claim?.kind==='legal_status'&&claim.value!==r.to)errors.push(`${r.id}: legal state claim disagrees with event`);}
    const eventClaims=(r.claimIds||[]).map(id=>claimById.get(id)).filter(Boolean);
    if(!eventClaims.some(c=>c.kind==='legal_status'&&c.value===r.to&&c.instrument===r.instrument))errors.push(`${r.id}: event lacks matching legal-state evidence`);
    for(const [field,predicate] of [['effectiveAt','effective_at'],['announcedAt','announced_at']]){
      if(r[field]!==null&&!eventClaims.some(c=>c.kind==='date'&&c.predicate===predicate&&c.value===r[field]&&c.instrument===r.instrument))errors.push(`${r.id}: ${field} lacks matching dated claim`);
    }
    if(!eventClaims.some(c=>c.evidence?.some(e=>sourceById.get(e.source)?.issuedAt===r.publishedAt)))errors.push(`${r.id}: publication date lacks matching original source`);
  }
  for(const [id,state]of eventStates)if(instrumentById.get(id)?.state!==state)errors.push(`${id}: final state disagrees with event history`);
  for(const r of s.instruments)if(!eventStates.has(r.id))errors.push(`${r.id}: instrument has no evidenced lifecycle`);
  for(const r of s.claims){
    requiredKeys(r,['id','instrument','kind','predicate','value','status','text','markets','mechanism','evidence','translationReviewed'],r.id,errors);
    ref('instruments',r.instrument,r.id);textPair(r.text,r.id,errors);scope(r.markets,r.id);
    if(!['legal_status','date','number','fact','inference','scenario'].includes(r.kind)||!['verified','uncertain','contradictory'].includes(r.status))errors.push(`${r.id}: invalid claim kind/status`);
    if(r.status!=='verified')errors.push(`${r.id}: unverified claim must remain quarantined`);
    if(r.translationReviewed!==true)errors.push(`${r.id}: semantic translation review missing`);
    if(!MECHANISMS.includes(r.mechanism))errors.push(`${r.id}: unknown impact mechanism`);
    if(r.markets?.some(m=>!instrumentById.get(r.instrument)?.markets?.includes(m)))errors.push(`${r.id}: claim exceeds instrument jurisdiction`);
    if(r.kind==='legal_status'&&!STATES.includes(r.value))errors.push(`${r.id}: invalid legal state value`);
    if(r.kind==='date'&&!isTime(r.value))errors.push(`${r.id}: invalid date value`);
    if(r.kind==='date'&&!['effective_at','announced_at','published_at'].includes(r.predicate))errors.push(`${r.id}: date must name its exact legal-time meaning`);
    if(r.kind==='number'&&!Number.isFinite(r.value))errors.push(`${r.id}: invalid numeric value`);
    if(!Array.isArray(r.evidence)||!r.evidence.length)errors.push(`${r.id}: missing original evidence`);
    else for(const e of r.evidence){
      requiredKeys(e,['source','locator','quote','supports'],`${r.id}.evidence`,errors);ref('sources',e.source,r.id);
      if(!e.locator||!e.quote||e.quote.length>300||e.supports!==r.kind)errors.push(`${r.id}: invalid source locator/quote/type`);
      const source=sourceById.get(e.source);if(source?.locator!==e.locator)errors.push(`${r.id}: locator differs from verified source`);
      if(['legal_status','date'].includes(r.kind)&&source?.authority!=='official')errors.push(`${r.id}: legal status/date requires official authority`);
      const body=evidenceBodies?.get(e.source);
      if(evidenceBodies&&(!body||!body.includes(e.quote)))errors.push(`${r.id}: invented quotation`);
      if(['legal_status','date','number'].includes(r.kind)&&e.quote&&!String(e.quote).includes(String(r.value)))errors.push(`${r.id}: critical value absent from quotation`);
    }
    const nums=(str)=>(str.match(/\d+(?:\.\d+)?/g)||[]).sort().join('|');
    if(isPair(r.text)&&nums(r.text[0])!==nums(r.text[1]))errors.push(`${r.id}: bilingual numeric mismatch`);
  }
  for(const r of s.impacts){
    requiredKeys(r,['id','claim','lane','value','currency','denominator','period','technology','location','formula','inputs','attribution'],r.id,errors);ref('claims',r.claim,r.id);
    if(!['official_observed','attributed_forecast','scenario','not_quantifiable'].includes(r.lane))errors.push(`${r.id}: unknown impact lane`);
    if(r.lane==='not_quantifiable'){if(r.value!==null)errors.push(`${r.id}: unknown impact cannot contain number`);continue;}
    if(!Number.isFinite(r.value)||!['MW','MWh'].includes(r.denominator)||!r.period||!r.technology||!r.location||!/^[A-Z]{3}$/.test(r.currency||''))errors.push(`${r.id}: incomplete quantitative basis`);
    const citedSources=(claimById.get(r.claim)?.evidence||[]).map(e=>sourceById.get(e.source));
    if(r.lane==='official_observed'&&citedSources.some(source=>source?.authority!=='official'))errors.push(`${r.id}: a forecast cannot masquerade as observed official data`);
    if(r.lane==='attributed_forecast'&&(!r.attribution||!citedSources.some(source=>source?.publisher===r.attribution)))errors.push(`${r.id}: forecast attribution must name its cited publisher`);
    if(r.lane==='scenario'){
      const operations={sum:xs=>xs.reduce((a,b)=>a+b,0),product:xs=>xs.reduce((a,b)=>a*b,1),difference:xs=>xs.length===2?xs[0]-xs[1]:NaN,ratio:xs=>xs.length===2&&xs[1]!==0?xs[0]/xs[1]:NaN};
      const values=(r.inputs||[]).map(id=>claimById.get(id)?.kind==='number'?claimById.get(id).value:NaN);
      const result=operations[r.formula]?.(values);
      if(!values.length||values.some(v=>!Number.isFinite(v))||!Number.isFinite(result)||Math.abs(result-r.value)>1e-9*Math.max(1,Math.abs(result)))errors.push(`${r.id}: scenario arithmetic/source inputs do not reproduce the value`);
    }
    if(claimById.get(r.claim)?.kind!=='number'&&r.lane!=='scenario')errors.push(`${r.id}: number not supported by a numeric claim`);
    if(r.lane!=='scenario'&&claimById.get(r.claim)?.value!==r.value)errors.push(`${r.id}: impact differs from sourced value`);
  }
  for(const r of s.stories){
    requiredKeys(r,['id','title','answer','instrumentIds','claimIds','chapters','changesIf'],r.id,errors);
    for(const k of ['title','answer','changesIf'])textPair(r[k],`${r.id}.${k}`,errors);
    if(!Array.isArray(r.instrumentIds)||!r.instrumentIds.length||!Array.isArray(r.claimIds)||!r.claimIds.length||!Array.isArray(r.chapters)||!r.chapters.length)errors.push(`${r.id}: story graph empty`);
    else{for(const x of r.instrumentIds)ref('instruments',x,r.id);for(const x of r.claimIds)ref('claims',x,r.id);}
    for(const chapter of r.chapters||[]){
      requiredKeys(chapter,['id','title','text','claimIds','scene'],r.id,errors);textPair(chapter.title,r.id,errors);textPair(chapter.text,r.id,errors);for(const x of chapter.claimIds||[])ref('claims',x,r.id);
      if(chapter.scene!==null){
        const scene=chapter.scene;
        if(!requiredKeys(scene,['template','claimIds','impactIds'],'scene',errors))continue;
        if(!['timeline','lifecycle','status_transition','before_after','causal','stakeholder','sourced_range','impact_waterfall','market_matrix'].includes(scene.template))errors.push(`${r.id}: unreviewed scene template`);
        for(const [key,kind]of [['claimIds','claims'],['impactIds','impacts']])if(!Array.isArray(scene[key]))errors.push(`${r.id}: scene needs typed references`);else for(const id of scene[key])ref(kind,id,r.id);
        if((scene.claimIds?.length||0)+(scene.impactIds?.length||0)>24)errors.push(`${r.id}: scene exceeds bounded item count`);
      }
    }
  }
  for(const r of s.links){
    requiredKeys(r,['id','claim','market','target','kind','mechanism','source','relevance','approvedAt','state'],r.id,errors);
    ref('claims',r.claim,r.id);ref('sources',r.source,r.id);if(!marketIds.includes(r.market)||!claimById.get(r.claim)?.markets?.includes(r.market))errors.push(`${r.id}: invalid market mapping`);
    if(!/^view\/markets\/[a-z_]+\.json#(?:grades|verdicts|plays|thesis|triggers)(?:\.[a-zA-Z0-9_-]+)*$|^src\/markets\/[a-z_]+\/(?:story|comparison)\.js#[a-zA-Z0-9_.-]+$/.test(r.target||''))errors.push(`${r.id}: invalid public investment reference`);
    if(!['supports','challenges','context'].includes(r.kind)||!MECHANISMS.includes(r.mechanism)||!['current','pending_reassessment','unmapped'].includes(r.state))errors.push(`${r.id}: invalid dependency relation/state`);
    textPair(r.relevance,r.id,errors);time(r.approvedAt,`${r.id}.approvedAt`,errors);
  }
  for(const r of s.reviews){
    requiredKeys(r,['id','claim','linkIds','status','reason','action'],r.id,errors);ref('claims',r.claim,r.id);
    if(!['pending_reassessment','resolved','deferred'].includes(r.status))errors.push(`${r.id}: invalid review state`);
    if(!Array.isArray(r.linkIds)||!r.linkIds.length)errors.push(`${r.id}: review without affected reference`);
    else for(const x of r.linkIds)ref('links',x,r.id);
    textPair(r.reason,r.id,errors);textPair(r.action,r.id,errors);
  }
  return errors;
}

export function policyMateriality({verified,conflicting=false,markets=[],mechanisms=[],challengesApprovedView=false}){
  if(!verified||conflicting)return {outcome:'uncertain_or_conflicting',reasons:['Evidence is missing or contradictory; quarantine']};
  if(!markets.length)return {outcome:'not_applicable',reasons:['No evidenced applicable investment market']};
  const material=mechanisms.filter(x=>['eligibility','grid_access','grid_cost','revenue_right','deadline','investment_call'].includes(x));
  return material.length||challengesApprovedView
    ? {outcome:'material_investment_review',reasons:[...material,...(challengesApprovedView?['challenges approved investment view']:[])]}
    : {outcome:'routine',reasons:['Verified policy context without a material investment mechanism']};
}

/** Inputs are public registry projections supplied by trusted caller; never filesystem paths. */
export class PublicInvestmentReferenceResolver{
  constructor({markets,records}){this.markets=new Set(markets);this.records=structuredClone(records);}
  resolve(link){
    if(!this.markets.has(link.market))return {state:'unmapped',reason:'Unknown market'};
    const record=this.records[link.target];
    if(!record||record.market!==link.market)return {state:'unmapped',reason:'No verified public investment reference'};
    return {state:link.state,reference:structuredClone(record)};
  }
}
