import { canonicalURL } from './discovery.mjs';
import { safeURL } from './schema.mjs';

export const JOURNAL_LIMITS=Object.freeze({days:90,records:250,linksPerPage:100,titleCharacters:500,urlCharacters:1500});
const iso=value=>typeof value==='string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString()===value;
const titleSafe=(value,limit)=>typeof value==='string'&&Boolean(value.trim())&&value.length<=limit&&!/[\u0000-\u001f\u007f]|<[^>]*>/.test(value);
const pageAllowed=(value,source)=>metadataURLAllowed(value,source)&&source.metadataScope.pageURLs?.includes(value);

export function validateDiscoveryMetadata(report,sources){
  if(report?.schemaVersion!==1||!iso(report.checkedAt)||!Array.isArray(report.records)||report.records.length!==sources.length)throw new Error('invalid_discovery_metadata');
  const seen=new Set();
  for(const r of report.records){
    const source=sources.find(s=>s.id===r.id);
    if(!source||seen.has(r.id)||r.identity!==`${source.jurisdiction}:${source.officialId}`||r.sourceURL!==source.url
      ||!iso(r.checkedAt)||r.cycle!==r.checkedAt.slice(0,10)||!/^\w{1,60}$/.test(r.status))throw new Error('invalid_discovery_metadata');
    if(r.lastKnownGood && (!iso(r.lastKnownGood.observedAt)||!/^sha256:[a-f0-9]{64}$/.test(r.lastKnownGood.contentHash)
      ||!safeURL(r.lastKnownGood.url)||new URL(r.lastKnownGood.url).hostname!==source.host))throw new Error('invalid_discovery_metadata');
    if(r.stopReason && (!/^(?:http_|robots_http_)(?:401|403|429)$|^(?:robots_denied|invalid_robots_document|unreviewed_redirect|unreviewed_redirect_path)$/.test(r.stopReason)
      ||typeof r.stopScopeVersion!=='string'||!r.stopScopeVersion||!iso(r.stoppedAt)))throw new Error('invalid_discovery_metadata');
    if(r.accessHistory && (!Array.isArray(r.accessHistory)||r.accessHistory.some(h=>!/^\w{1,60}$/.test(h.reason)||typeof h.scopeVersion!=='string'||!iso(h.stoppedAt)||!iso(h.reviewedAt))))throw new Error('invalid_discovery_metadata');
    seen.add(r.id);
  }
  return report;
}

/** Explicit inventory additions preserve every old source and its denials.
 * A partial current report is never mistaken for a fresh inventory migration. */
export function migrateDiscoveryInventory(report,journal,sources){
  if(![2,3].includes(report?.inventoryVersion))return report;
  const expected=['de-agnes','gb-connections','nem-iess','wa-wic','nem-iess-aemo','wa-wic-aemo','nem-iess-technical','wa-brcp-era'];
  if(sources.map(s=>s.id).join(',')!==expected.join(','))throw new Error('unreviewed_inventory_migration');
  const oldIds=expected.slice(0,report.inventoryVersion===2?4:6);
  const additions=sources.filter(s=>!oldIds.includes(s.id));
  validateDiscoveryState(report,journal,sources.filter(s=>oldIds.includes(s.id)));
  return {...report,inventoryVersion:4,records:[...report.records,...additions.map(s=>({id:s.id,identity:`${s.jurisdiction}:${s.officialId}`,jurisdiction:s.jurisdiction,markets:[...s.markets],language:s.language,title:s.title,sourceURL:s.url,checkedAt:report.checkedAt,cycle:report.checkedAt.slice(0,10),status:'pending_source_review',lastSuccessfulAt:null,lastKnownGood:null}))]};
}

/** A journal alone cannot recover per-source denial state held in the report. */
export function validateDiscoveryState(report,journal,sources){
  const previous=validateDiscoveryMetadata(report,sources).records;
  const priorJournal=journal===null?null:validateJournal(journal,sources);
  const inactiveBaseline=previous.every(r=>r.status==='pending_source_review'&&!r.lastKnownGood&&!r.lastSuccessfulAt&&!r.stopReason);
  if(!priorJournal&&!inactiveBaseline)throw new Error('discovery_history_missing_or_incomplete_no_fetch');
  return {previous,priorJournal};
}

/** Only explicit source-bound paths. Links are observations, never fetch instructions. */
export function metadataURLAllowed(value,source){
  if(typeof value!=='string'||value.length>JOURNAL_LIMITS.urlCharacters||!safeURL(value)||!source.metadataScope?.reviewed)return false;
  const url=new URL(value);
  if(url.protocol!=='https:'||url.hostname!==source.host||url.port||/%(?:2f|5c|00)/i.test(url.pathname))return false;
  // Scope is exact pathname or a directory including its trailing slash.
  return (source.metadataScope.paths||[]).some(p=>url.pathname===p)
    ||(source.metadataScope.directories||[]).some(p=>p.startsWith('/')&&p.endsWith('/')&&url.pathname.startsWith(p))
    ||(source.metadataScope.pdfDirectories||[]).some(p=>p.startsWith('/')&&p.endsWith('/')&&url.pathname.startsWith(p)&&/\.pdf$/i.test(url.pathname));
}

function plainTitle(value){
  return value.replace(/<[^>]*>/g,' ').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{
    const code=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);
    return code>0&&code<=0x10ffff?String.fromCodePoint(code):' ';
  }).replace(/&(amp|quot|apos|lt|gt|nbsp);/gi,(_,n)=>({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' '}[n.toLowerCase()]))
    .replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim();
}

/** Source-page navigation is not a document lead, regardless of query/fragment. */
function sourceNavigation(value,source){
  const url=new URL(value);
  return (source?.metadataScope?.pageURLs||[]).some(page=>{
    const registered=new URL(page);return url.origin===registered.origin&&url.pathname===registered.pathname;
  });
}

export function documentLinkObservations({source,document,body},limits=JOURNAL_LIMITS){
  if(!source.metadataScope?.reviewed)return {records:[],overflow:0};
  if(!pageAllowed(document.url,source))throw new Error('unreviewed_metadata_page');
  const records=[];const seen=new Set();let overflow=0;
  // Ignore script/style/comments, and never follow <base>, scripts or linked URLs.
  const html=body.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'');
  for(const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)){
    const href=match[1].match(/(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if(!href)continue;
    const rawHref=plainTitle(href[1]??href[2]);
    if(!rawHref||rawHref.startsWith('#'))continue;
    let url;try{url=canonicalURL(new URL(rawHref,document.url).href);}catch{continue;}
    if(sourceNavigation(url,source)||!metadataURLAllowed(url,source)||seen.has(url))continue;
    const title=plainTitle(match[2]);if(!titleSafe(title,limits.titleCharacters))continue;
    seen.add(url);
    if(records.length>=limits.linksPerPage){overflow++;continue;}
    records.push({sourceId:source.id,url,title,sourcePageURL:document.url,sourcePageHash:document.contentHash,
      firstObservedAt:document.observedAt,lastObservedAt:document.observedAt,publishedAt:null,effectiveAt:null});
  }
  return {records,overflow};
}

export function validateJournal(journal,sources,limits=JOURNAL_LIMITS){
  if(journal?.schemaVersion!==1||!Array.isArray(journal.records)||journal.records.length>limits.records||!iso(journal.checkedAt))throw new Error('invalid_discovery_journal');
  const keys=['sourceId','url','title','sourcePageURL','sourcePageHash','firstObservedAt','lastObservedAt','publishedAt','effectiveAt'].sort().join(',');
  const seen=new Set();
  for(const r of journal.records){
    const source=sources.find(s=>s.id===r.sourceId);const id=`${r.sourceId}:${r.url}`;
    if(!source||Object.keys(r).sort().join(',')!==keys||!metadataURLAllowed(r.url,source)||!pageAllowed(r.sourcePageURL,source)
      ||!titleSafe(r.title,limits.titleCharacters)||!/^sha256:[a-f0-9]{64}$/.test(r.sourcePageHash)
      ||!iso(r.firstObservedAt)||!iso(r.lastObservedAt)||r.firstObservedAt>r.lastObservedAt||r.lastObservedAt>journal.checkedAt
      ||r.publishedAt!==null||r.effectiveAt!==null||seen.has(id))throw new Error('invalid_discovery_journal');
    seen.add(id);
  }
  return journal;
}

/** Retain observations through failures. This rolling index is not a version archive. */
export function mergeDiscoveryJournal({previous=null,observations=[],sources,now=new Date(),overflow=0},limits=JOURNAL_LIMITS){
  const checkedAt=new Date(now).toISOString();
  if(previous)validateJournal(previous,sources,limits);
  if(previous?.checkedAt>checkedAt)throw new Error('future_discovery_journal');
  const cutoff=Date.parse(checkedAt)-limits.days*86400000;
  let prunedNavigation=0;
  const retained=(previous?.records||[]).filter(r=>{
    if(sourceNavigation(r.url,sources.find(s=>s.id===r.sourceId))){prunedNavigation++;return false;}
    return Date.parse(r.lastObservedAt)>=cutoff;
  });
  const records=new Map(retained.map(r=>[`${r.sourceId}:${r.url}`,r]));
  let added=0;
  for(const r of observations){
    if(sourceNavigation(r.url,sources.find(s=>s.id===r.sourceId)))continue;
    const key=`${r.sourceId}:${r.url}`,prior=records.get(key);
    if(!prior&&records.size>=limits.records){overflow++;continue;}
    if(!prior)added++;
    records.set(key,{...r,firstObservedAt:prior?.firstObservedAt??r.firstObservedAt});
  }
  const result={schemaVersion:1,checkedAt,retentionDays:limits.days,historyComplete:false,
    baseline:previous?'restored':'initial_seed',added,overflow,prunedNavigation,
    records:[...records.values()].sort((a,b)=>a.sourceId.localeCompare(b.sourceId)||a.url.localeCompare(b.url))};
  validateJournal(result,sources,limits);return result;
}
