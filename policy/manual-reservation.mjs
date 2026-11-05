import {mkdir,open,readdir,readFile,unlink,lstat,realpath} from 'node:fs/promises';
import path from 'node:path';
import {worstCaseModelUSD} from './authorization.mjs';

/** Persistent fail-closed reservations: an uncertain request consumes its slot.
 * Directory must be a trusted durable private filesystem chosen by the runner;
 * an ephemeral Actions cache is not a durable audit. */
export async function reserveManualCall({repo,caseId,config,now=new Date()}){
  if(!/^[a-z0-9_-]{1,80}$/.test(caseId||''))throw Error('Invalid case identity');
  const day=new Date(now).toISOString().slice(0,10), cost=worstCaseModelUSD(config);
  if(!Number.isFinite(cost)||cost<=0||cost>0.03||!Number.isFinite(config.maxDailyUSD)||config.maxDailyUSD<=0||config.maxDailyUSD>0.03||cost>config.maxDailyUSD||!Number.isInteger(config.maxInputTokens)||config.maxInputTokens<=0||config.maxInputTokens>12000||!Number.isInteger(config.maxOutputTokens)||config.maxOutputTokens<=0||config.maxOutputTokens>3000||!Number.isInteger(config.wallTimeMs)||config.wallTimeMs<=0||config.wallTimeMs>120000)throw Error('Evaluation budget exceeds approved proposal');
  let directory=await realpath(repo);for(const part of ['etl','out','policy-evaluation-ledger']){directory=path.join(directory,part);try{if((await lstat(directory)).isSymbolicLink())throw Error('Symbolic audit path rejected');}catch(error){if(error.code!=='ENOENT')throw error;}}
  await mkdir(directory,{recursive:true});const lockPath=path.join(directory,'.reservation.lock');const lock=await open(lockPath,'wx');
  try{
    const names=(await readdir(directory)).filter(n=>/^\d{4}-\d{2}-\d{2}\.json$/.test(n));
    if(names.length>=12||names.includes(`${day}.json`))throw Error('Daily or twelve-call limit reached');
    let total=0;
    for(const name of names){const file=path.join(directory,name);if((await lstat(file)).isSymbolicLink())throw Error('Symbolic audit entry rejected');const row=JSON.parse(await readFile(file,'utf8'));if(!Number.isFinite(row.reservedUSD)||row.reservedUSD<=0||row.reservedUSD>0.03||row.day!==name.slice(0,10)||!/^[a-z0-9_-]{1,80}$/.test(row.caseId||''))throw Error('Malformed audit ledger');if(row.caseId===caseId)throw Error('Case already reserved');total+=row.reservedUSD;}
    if(total+cost>0.36)throw Error('Evaluation total budget reached');
    const file=await open(path.join(directory,`${day}.json`),'wx');try{await file.writeFile(JSON.stringify({day,caseId,reservedUSD:cost,status:'reserved_outcome_unknown'})+'\n');await file.sync();}finally{await file.close();}
    return {cycle:day,completed:false,reservedUSD:0,worstCaseCallUSD:cost};
  }finally{await lock.close();await unlink(lockPath);}
}
