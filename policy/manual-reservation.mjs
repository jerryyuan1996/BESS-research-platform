import {mkdir,open,readdir,readFile,unlink,lstat,realpath} from 'node:fs/promises';
import path from 'node:path';
import {worstCaseModelUSD} from './authorization.mjs';
import {digest} from './integrity.mjs';

export async function manualAuditDirectory(repo){
  let directory=await realpath(repo);for(const part of ['etl','out','policy-evaluation-ledger']){directory=path.join(directory,part);try{if((await lstat(directory)).isSymbolicLink())throw Error('Symbolic audit path rejected');}catch(error){if(error.code!=='ENOENT')throw error;}}
  return directory;
}

/** Persistent fail-closed reservations: an uncertain request consumes its slot.
 * Directory must be a trusted durable private filesystem chosen by the runner;
 * an ephemeral Actions cache is not a durable audit. */
export async function reserveManualCall({repo,caseId,config,request,now=new Date()}){
  if(!/^[a-z0-9_-]{1,80}$/.test(caseId||''))throw Error('Invalid case identity');
  if(!request||!/^[a-z0-9_-]{1,80}$/.test(request.id||'')||!['caseHash','inputHash','versionHash','settingsHash'].every(key=>/^[a-f0-9]{64}$/.test(request[key]||''))||request.caseId!==caseId||request.corpusHash!==config.approvedCorpusHash)throw Error('Manual request reservation binding missing');
  const requestHash=digest(request);
  const day=new Date(now).toISOString().slice(0,10), cost=worstCaseModelUSD(config);
  if(!Number.isFinite(cost)||cost<=0||cost>0.03||!Number.isFinite(config.maxDailyUSD)||config.maxDailyUSD<=0||config.maxDailyUSD>0.03||cost>config.maxDailyUSD||!Number.isInteger(config.maxSerializedInputBytes)||config.maxSerializedInputBytes<=0||config.maxSerializedInputBytes>16000||!Number.isInteger(config.maxInputTokens)||config.maxInputTokens<=0||config.maxInputTokens>12000||!Number.isInteger(config.maxOutputTokens)||config.maxOutputTokens<=0||config.maxOutputTokens>3000||!Number.isInteger(config.wallTimeMs)||config.wallTimeMs<=0||config.wallTimeMs>120000)throw Error('Evaluation budget exceeds approved proposal');
  const directory=await manualAuditDirectory(repo);
  await mkdir(directory,{recursive:true});const lockPath=path.join(directory,'.reservation.lock');const lock=await open(lockPath,'wx');
  try{
    const names=(await readdir(directory)).filter(n=>/^\d{4}-\d{2}-\d{2}\.json$/.test(n));
    if(names.length>=12||names.includes(`${day}.json`))throw Error('Daily or twelve-call limit reached');
    let total=0;
    for(const name of names){const file=path.join(directory,name);if((await lstat(file)).isSymbolicLink())throw Error('Symbolic audit entry rejected');const row=JSON.parse(await readFile(file,'utf8'));if(!Number.isFinite(row.reservedUSD)||row.reservedUSD<=0||row.reservedUSD>0.03||row.day!==name.slice(0,10)||!/^[a-z0-9_-]{1,80}$/.test(row.caseId||''))throw Error('Malformed audit ledger');if(row.requestId===request.id||row.requestHash===requestHash)throw Error('Manual request already reserved');if(row.caseId===caseId)throw Error('Case already reserved');total+=row.reservedUSD;}
    if(total+cost>0.36)throw Error('Evaluation total budget reached');
    const file=await open(path.join(directory,`${day}.json`),'wx');try{await file.writeFile(JSON.stringify({day,caseId,requestId:request.id,requestHash,binding:Object.fromEntries(['corpusHash','caseHash','inputHash','versionHash','settingsHash'].map(key=>[key,request[key]])),reservedUSD:cost,status:'reserved_outcome_unknown'})+'\n');await file.sync();}finally{await file.close();}
    return {cycle:day,completed:false,reservedUSD:0,worstCaseCallUSD:cost,reservation:{day,caseId,requestId:request.id,requestHash,reservedUSD:cost}};
  }finally{await lock.close();await unlink(lockPath);}
}

/** Append an outcome beside the immutable reservation. Missing/uncertain
 * outcomes still consume their reservation; no result file grants a retry. */
export async function recordManualOutcome({repo,reservation,result,caseHash,sourceHash,originalSourceHash,config}){
  if(!reservation||!/^\d{4}-\d{2}-\d{2}$/.test(reservation.day)||!/^[a-z0-9_-]{1,80}$/.test(reservation.caseId)||!/^[a-f0-9]{64}$/.test(caseHash)||!/^sha256:[a-f0-9]{64}$/.test(sourceHash))throw Error('Invalid manual outcome binding');
  if(!['evaluated','quarantined','disabled','already_processed','input_cap','cost_cap','unchanged'].includes(result.status)||![0,1].includes(result.providerRequests)||![0,1].includes(result.tokenCountRequests)||result.preflightInputTokens!=null&&(!Number.isInteger(result.preflightInputTokens)||result.preflightInputTokens<0))throw Error('Invalid manual outcome');
  const directory=await manualAuditDirectory(repo),file=path.join(directory,reservation.day+'.json');
  if((await lstat(file)).isSymbolicLink())throw Error('Symbolic reservation rejected');
  const saved=JSON.parse(await readFile(file,'utf8'));
  if(saved.day!==reservation.day||saved.caseId!==reservation.caseId||saved.reservedUSD!==reservation.reservedUSD||saved.requestId!==reservation.requestId||saved.requestHash!==reservation.requestHash)throw Error('Manual outcome reservation mismatch');
  const usage=result.usage?Object.fromEntries(['inputTokens','outputTokens','reservedUSD','actualUSD'].map(key=>[key,result.usage[key]])):null;
  if(usage&&(!Number.isInteger(usage.inputTokens)||usage.inputTokens<0||usage.inputTokens>12000||!Number.isInteger(usage.outputTokens)||usage.outputTokens<0||usage.outputTokens>3000||!Number.isFinite(usage.actualUSD)||usage.actualUSD<0||usage.actualUSD>saved.reservedUSD))throw Error('Invalid manual usage audit');
  if(!/^sha256:[a-f0-9]{64}$/.test(originalSourceHash||''))throw Error('Original source audit hash missing');
  const settings=Object.fromEntries(['approvalId','approvedCorpusHash','manualOnly','maxSerializedInputBytes','provider','model','maxInputTokens','maxOutputTokens','maxDailyUSD','wallTimeMs','inputUSDPerMTokens','outputUSDPerMTokens','priceSource'].map(key=>[key,config?.[key]??null]));
  const authorization={approvalId:settings.approvalId,provider:settings.provider,model:settings.model,corpusHash:settings.approvedCorpusHash,settingsHash:digest(settings)};
  const outcome={day:saved.day,requestId:saved.requestId,requestHash:saved.requestHash,binding:saved.binding,caseId:saved.caseId,caseHash,sourceHash,originalSourceHash,authorization,status:result.status,providerRequests:result.providerRequests,tokenCountRequests:result.tokenCountRequests,preflightInputTokens:result.preflightInputTokens??null,usage,matched:typeof result.matched==='boolean'?result.matched:null,canPublish:false};
  const output=await open(path.join(directory,reservation.day+'.result.json'),'wx');try{await output.writeFile(JSON.stringify(outcome)+'\n');await output.sync();}finally{await output.close();}
}
