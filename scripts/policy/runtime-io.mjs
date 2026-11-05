import { mkdir,readFile,lstat,open,rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const OUTPUT=path.join(ROOT,'etl','out');
const NAMES=new Set(['policy-discovery.json','policy-candidate.json','policy-research.json','policy-ledger.json','policy-validation.json','policy-cycle.json']);
async function reportPath(name){
  if(!NAMES.has(name))throw new Error('Operational report name is not allowlisted');
  const target=path.join(OUTPUT,name);
  for(const p of [path.join(ROOT,'etl'),OUTPUT,target])try{if((await lstat(p)).isSymbolicLink())throw new Error('Operational report path is symbolic');}catch(error){if(error.code!=='ENOENT')throw error;}
  return target;
}
export async function readReport(name){try{return JSON.parse(await readFile(await reportPath(name),'utf8'));}catch(error){if(error.code==='ENOENT')return null;throw error;}}
export async function writeReport(name,value){const target=await reportPath(name);await mkdir(OUTPUT,{recursive:true});const temp=target+'.'+randomUUID()+'.tmp';const handle=await open(temp,'wx');try{await handle.writeFile(JSON.stringify(value,null,2)+'\n');await handle.sync();}finally{await handle.close();}await rename(temp,target);}
