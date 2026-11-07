/** Shadow discovery report only. No public-data or investment write path. */
import { mkdir,writeFile,lstat,readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { POLICY_SOURCES,INVENTORY_VERSION } from '../../policy/source-inventory.mjs';
import { discoverPolicies } from '../../policy/discovery.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const output=path.join(root,'etl','out');
for(const target of [path.join(root,'etl'),output])try{if((await lstat(target)).isSymbolicLink())throw new Error('Report path is symbolic');}catch(e){if(e.code!=='ENOENT')throw e;}
let previous=[];
try{previous=JSON.parse(await readFile(path.join(output,'policy-discovery.json'),'utf8')).records||[];}catch(error){if(error.code!=='ENOENT')throw error;}
const result=await discoverPolicies({sources:POLICY_SOURCES,previous,killSwitch:process.env.POLICY_DISCOVERY_DISABLED==='1'});
await mkdir(output,{recursive:true});
await writeFile(path.join(output,'policy-discovery.json'),JSON.stringify({...result,inventoryVersion:INVENTORY_VERSION,mode:'shadow',publicationEnabled:false},null,2)+'\n');
console.log(`Policy discovery shadow cycle ${result.cycle}: ${result.changed} changed documents; ${result.records.filter(x=>x.status==='pending_source_review').length} sources awaiting review; no policy claims published.`);
