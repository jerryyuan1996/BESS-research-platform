import {readFile,readdir} from 'node:fs/promises';
import {digest} from '../../policy/integrity.mjs';
import {manualCaseDocument} from '../../policy/manual-evaluation.mjs';
import {prepareShadowRequest} from '../../policy/shadow.mjs';

/** Hash the running implementation, including uncommitted edits. A git commit
 * alone would not bind the code actually making the request. No private files. */
export async function manualImplementationHash(){
  const root=new URL('../../',import.meta.url),entries=[];
  for(const directory of ['policy/','scripts/policy/'])for(const name of (await readdir(new URL(directory,root))).filter(n=>n.endsWith('.mjs')).sort()){
    const relative=directory+name;entries.push([relative,digest(await readFile(new URL(relative,root),'utf8'))]);
  }
  entries.push(['scripts/lib/markers.mjs',digest(await readFile(new URL('scripts/lib/markers.mjs',root),'utf8'))]);
  return digest(entries);
}

export async function manualRequestBinding({cases,caseId,config}){
  const selected=cases?.find(c=>c.id===caseId);if(!selected)throw Error('Unknown requested case');
  const document=manualCaseDocument(selected);
  const {request}=prepareShadowRequest({changedDocuments:[document],bodies:new Map([[document.sourceId,selected.body]]),config});
  return {caseId,corpusHash:config.approvedCorpusHash,caseHash:digest(selected),inputHash:digest(JSON.stringify(request)),versionHash:await manualImplementationHash(),settingsHash:digest(config)};
}

/** The private, analyst-authored request is separate from dormant capability
 * approval. It authorizes one exact case/input/code/settings, not future runs. */
export async function manualRequestProblems({request,requestId,cases,caseId,config,now=new Date()}){
  const errors=[];
  if(config?.manualOnly!==true)errors.push('Manual-only evaluation required');
  if(!request||request.schemaVersion!==1||request.explicitRequest!==true||request.mode!=='manual-shadow'||request.approvalId!==config?.approvalId||(typeof request.requestedBy!=='string'||!request.requestedBy.trim())||!/^[a-z0-9_-]{1,80}$/.test(requestId||'')||request.id!==requestId)errors.push('Explicit single-use manual request missing');
  const at=Date.parse(request?.requestedAt),expires=Date.parse(request?.expiresAt),time=new Date(now).getTime();
  const utc=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value);
  if(!utc(request?.requestedAt)||!utc(request?.expiresAt)||!Number.isFinite(time)||!Number.isFinite(at)||!Number.isFinite(expires)||at>time||expires<=time||expires<=at||expires-at>86400000)errors.push('Manual request must be current and expire within 24 hours');
  if(cases?.some(c=>c.id===caseId)){
    const expected=await manualRequestBinding({cases,caseId,config});
    if(Object.entries(expected).some(([key,value])=>request?.[key]!==value))errors.push('Manual request case/input/version/settings binding mismatch');
  }else errors.push('Unknown requested case');
  return errors;
}
