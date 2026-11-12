import { sourceDigest,digest } from './integrity.mjs';
import { safeURL } from './schema.mjs';
export const DISCOVERY_LIMITS=Object.freeze({bytes:1_000_000,timeoutMs:15_000,retries:2,redirects:3});
export const cycleId=now=>new Date(now).toISOString().slice(0,10);
export const retryableFailure=reason=>['network_error','offline'].includes(reason)||/^http_5\d\d$|^robots_http_5\d\d$/.test(reason);
const permissionStop=reason=>/^(?:http_|robots_http_)(?:401|403|429)$/.test(reason)||['robots_denied','invalid_robots_document','unreviewed_redirect','unreviewed_redirect_path'].includes(reason);
export function validRobotsDocument(body,type=''){
  if(/<\s*(?:!doctype|\/?[a-z])\b|[\u0000-\u0008]/i.test(body))return false;
  if(!/(?:text\/html|application\/xhtml)/i.test(type))return true;
  // Some official servers mislabel a real plain-text robots file as HTML.
  // Only a complete, recognisable rules document can override that MIME label.
  const lines=body.split(/\r?\n/).map(s=>s.replace(/#.*/,'').trim()).filter(Boolean);
  return lines.some(s=>/^user-agent:\s*\S+/i.test(s)) && lines.every(s=>/^(?:user-agent|allow|disallow|sitemap|crawl-delay|host):\s*[^<>]*$/i.test(s));
}
export function canonicalURL(value){const u=new URL(value);u.hash='';for(const key of [...u.searchParams.keys()])if(/^utm_|^fbclid$/.test(key))u.searchParams.delete(key);u.searchParams.sort();return u.href;}
/** Conservative robots handling. A denial is retained even if another group
 * might be more permissive; uncertainty reduces coverage, never expands it. */
export function robotsPermit(text,pathname){
  let relevant=false;let sawRule=false;const rules=[];
  for(const raw of text.split(/\r?\n/)){
    const line=raw.replace(/#.*/,'').trim();const cut=line.indexOf(':');if(cut<0)continue;
    const key=line.slice(0,cut).trim().toLowerCase(),value=line.slice(cut+1).trim();
    if(key==='user-agent'){if(sawRule){relevant=false;sawRule=false;}relevant ||= value==='*'||/besspolicyresearch/i.test(value);}
    else if(['allow','disallow'].includes(key)&&relevant){sawRule=true;if(value)rules.push({allow:key==='allow',path:value});}
  }
  const matches=rules.filter(r=>{const regex='^'+r.path.split('*').map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*').replace(/\\\$$/,'$');return new RegExp(regex).test(pathname);});
  matches.sort((a,b)=>b.path.length-a.path.length||Number(a.allow)-Number(b.allow));
  return !matches.length||matches[0].allow;
}
async function boundedText(response,maxBytes){
  if(Number(response.headers.get('content-length')||0)>maxBytes)throw new Error('size_limit');
  const reader=response.body?.getReader();if(!reader)return '';
  let size=0;const chunks=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new Error('size_limit');}chunks.push(value);}
  return new TextDecoder().decode(Buffer.concat(chunks));
}
async function fetchReviewed(url,source,fetcher,limits,pathPermitted=null){
  let current=url;
  for(let hop=0;hop<=limits.redirects;hop++){
    if(!safeURL(current)||new URL(current).hostname!==source.host)throw new Error('unreviewed_redirect');
    if(source.metadataScope && (pathPermitted||new URL(current).pathname!=='/robots.txt') && !source.metadataScope.pageURLs?.includes(current))throw new Error('unreviewed_redirect_path');
    if(pathPermitted&&!pathPermitted(new URL(current).pathname))throw new Error('robots_denied');
    const response=await fetcher(current,{redirect:'manual',headers:{'user-agent':'BESSPolicyResearch/1.0'},signal:AbortSignal.timeout(limits.timeoutMs)});
    if([301,302,303,307,308].includes(response.status)){const next=response.headers.get('location');if(!next)throw new Error('redirect_without_target');current=new URL(next,current).href;continue;}
    return {response,url:canonicalURL(current)};
  }
  throw new Error('redirect_limit');
}
/** Pure runner: callers own report serialization. No publisher, fs, model or token. */
export async function discoverPolicies({sources,previous=[],now=new Date(),fetcher=fetch,limits=DISCOVERY_LIMITS,sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),killSwitch=false,onDocument=null}){
  const checkedAt=new Date(now).toISOString();const cycle=cycleId(now);const records=[];const seenURLs=new Set(),seenIdentities=new Set();
  const old=new Map(previous.map(x=>[x.identity,x]));
  for(const source of sources){
    const identity=`${source.jurisdiction}:${source.officialId}`;
    const base={id:source.id,identity,jurisdiction:source.jurisdiction,markets:[...source.markets],language:source.language,title:source.title,sourceURL:source.url,checkedAt,cycle,...(source.blockedReason?{blockedReason:source.blockedReason}:{})};
    const prior=old.get(identity);
    const scopeVersion=source.metadataScope?.reviewVersion??'unversioned';
    const renewedReview=Boolean(prior?.stopReason&&prior.stopScopeVersion!==scopeVersion);
    const accessHistory=[...(prior?.accessHistory||[])];
    if(accessHistory.length)base.accessHistory=accessHistory;
    const retain=(status,extra={})=>records.push({...base,status,lastSuccessfulAt:prior?.lastSuccessfulAt??null,lastKnownGood:prior?.lastKnownGood??null,
      ...(prior?.stopReason?{stopReason:prior.stopReason,stopScopeVersion:prior.stopScopeVersion,stoppedAt:prior.stoppedAt,priorStatus:prior.priorStatus??prior.status}:{}),...extra});
    if(killSwitch){retain('disabled');continue;}
    if(!(source.reviewed&&source.rightsReviewed)&&!source.metadataScope?.reviewed){retain('pending_source_review');continue;}
    if(prior?.stopReason&&prior.stopScopeVersion===scopeVersion){
      retain('blocked_after_denial',{stopReason:prior.stopReason,stopScopeVersion:prior.stopScopeVersion,stoppedAt:prior.stoppedAt,priorStatus:prior.priorStatus??prior.status});continue;
    }
    // A restored same-day attempt is not another request, including after denial.
    if(source.metadataScope?.reviewed&&prior?.cycle===cycle&&!renewedReview&&!['pending_source_review','disabled'].includes(prior.status)){
      records.push({...prior,status:'same_cycle_retained',priorStatus:prior.priorStatus??prior.status});continue;
    }
    if(!safeURL(source.url)||new URL(source.url).hostname!==source.host){retain('unreviewed_host');continue;}
    const url=canonicalURL(source.url);
    if(seenURLs.has(url)||seenIdentities.has(identity)){retain('duplicate');continue;}seenURLs.add(url);seenIdentities.add(identity);
    if(renewedReview){accessHistory.push({reason:prior.stopReason,scopeVersion:prior.stopScopeVersion,stoppedAt:prior.stoppedAt,reviewedAt:checkedAt});base.accessHistory=accessHistory;}
    let success=false;let failure='unavailable';
    for(let attempt=0;attempt<=limits.retries;attempt++){
      try{
        const robot=await fetchReviewed(new URL('/robots.txt',url).href,source,fetcher,limits);
        let robotsText=null;
        if(robot.response.status!==404){
          if(!robot.response.ok)throw new Error(`robots_http_${robot.response.status}`);
          const robotsType=robot.response.headers.get('content-type')||'';
          robotsText=await boundedText(robot.response,100_000);
          if(!validRobotsDocument(robotsText,robotsType))throw new Error('invalid_robots_document');
        }
        // The same host's cached rules apply BEFORE every page/redirect GET.
        const pathPermitted=pathname=>robotsText===null||robotsPermit(robotsText,pathname);
        const result=await fetchReviewed(url,source,fetcher,limits,pathPermitted);if(!result.response.ok)throw new Error(`http_${result.response.status}`);
        const type=result.response.headers.get('content-type')||'';if(!/^text\/(?:html|plain)|application\/(?:json|xml)/i.test(type))throw new Error('unsupported_document_type');
        const body=await boundedText(result.response,limits.bytes);if(!body.trim())throw new Error('empty_document');
        const hash=sourceDigest(body);const document={url:result.url,contentHash:hash,observedAt:checkedAt,publishedAt:null,effectiveAt:null};
        if(onDocument)await onDocument({source,document,body});
        const unchanged=prior?.lastKnownGood?.contentHash===hash;
        records.push({...base,status:unchanged?'unchanged':'changed',lastSuccessfulAt:checkedAt,lastKnownGood:unchanged?prior.lastKnownGood:document});success=true;break;
      }catch(error){failure=/^[a-z_0-9]+$/.test(error.message)?error.message:'network_error';if(!retryableFailure(failure))break;if(attempt<limits.retries)await sleep(250*(2**attempt));}
    }
    if(!success)retain(failure,permissionStop(failure)?{stopReason:failure,stopScopeVersion:scopeVersion,stoppedAt:checkedAt}:{});
    await sleep(250);
  }
  // Exclude check timestamps from identity: repeat checks do not manufacture content.
  const contentHash=digest(records.map(({id,identity,status,lastKnownGood})=>({id,identity,status:status==='unchanged'?'changed':status,lastKnownGood})));
  return {schemaVersion:1,cycle,checkedAt,contentHash,records,changed:records.filter(x=>x.status==='changed').length,verifiedPolicyClaims:0};
}
