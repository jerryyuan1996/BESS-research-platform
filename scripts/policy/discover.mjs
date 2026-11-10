/** Shadow discovery report only. No public-data or investment write path. */
import { mkdir,writeFile,lstat,readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { POLICY_SOURCES,INVENTORY_VERSION } from '../../policy/source-inventory.mjs';
import { discoverPolicies } from '../../policy/discovery.mjs';
import { discoveryCoverage,discoverySummary } from '../../policy/discovery-report.mjs';
import { documentLinkObservations,mergeDiscoveryJournal,validateDiscoveryState } from '../../policy/discovery-journal.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const output=path.join(root,'etl','out');
for(const target of [path.join(root,'etl'),output,...['policy-discovery.json','policy-discovery.md','policy-discovery-journal.json'].map(name=>path.join(output,name))])try{if((await lstat(target)).isSymbolicLink())throw new Error('Report path is symbolic');}catch(e){if(e.code!=='ENOENT')throw e;}
async function readMetadata(name){const file=path.join(output,name);if((await lstat(file)).size>2_000_000)throw new Error('oversize_discovery_metadata');return JSON.parse(await readFile(file,'utf8'));}
let priorReport=null,storedJournal=null;
try{priorReport=await readMetadata('policy-discovery.json');}catch(error){if(error.code!=='ENOENT')throw error;}
try{storedJournal=await readMetadata('policy-discovery-journal.json');}catch(error){if(error.code!=='ENOENT')throw error;}
// Only the exact pre-collector inactive report can seed an empty journal.
// Lost history must not erase a prior access denial and silently enable retries.
const {previous,priorJournal}=validateDiscoveryState(priorReport,storedJournal,POLICY_SOURCES);
const observations=[];let overflow=0;
const result=await discoverPolicies({sources:POLICY_SOURCES,previous,killSwitch:process.env.POLICY_DISCOVERY_DISABLED==='1',onDocument:payload=>{
  const links=documentLinkObservations(payload);observations.push(...links.records);overflow+=links.overflow;
}});
const journal=mergeDiscoveryJournal({previous:priorJournal,observations,sources:POLICY_SOURCES,now:result.checkedAt,overflow});
result.journal={records:journal.records.length,added:journal.added,overflow:journal.overflow,prunedNavigation:journal.prunedNavigation,baseline:journal.baseline,retentionDays:journal.retentionDays,historyComplete:false};
await mkdir(output,{recursive:true});
await writeFile(path.join(output,'policy-discovery-journal.json'),JSON.stringify(journal,null,2)+'\n');
await writeFile(path.join(output,'policy-discovery.json'),JSON.stringify({...result,coverage:discoveryCoverage(result.records),inventoryVersion:INVENTORY_VERSION,mode:'shadow',publicationEnabled:false},null,2)+'\n');
await writeFile(path.join(output,'policy-discovery.md'),discoverySummary(result));
console.log(`Policy discovery shadow cycle ${result.cycle}: ${result.changed} changed documents; ${result.records.filter(x=>x.status==='pending_source_review').length} sources awaiting review; no policy claims published.`);
for(const record of result.records)if(record.blockedReason||record.stopReason)console.log(`Policy source ${record.id}: ${record.blockedReason??record.stopReason}. No retry without a new relevant source review.`);
