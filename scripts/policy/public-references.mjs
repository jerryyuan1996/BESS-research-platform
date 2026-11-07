/** A fixed, read-only projection of already-public view records. It neither
 * imports the View Writer nor loads/evaluates market model or story modules. */
import { readFile,lstat } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './runtime-io.mjs';
export async function publicInvestmentReferences(marketIds){
  const records={};
  for(const id of marketIds){
    if(!/^[a-z][a-z0-9_]*$/.test(id))throw new Error('Unknown public market identity');
    const file=path.join(ROOT,'view','markets',`${id}.json`);
    for(const p of [path.join(ROOT,'view'),path.join(ROOT,'view','markets'),file])if((await lstat(p)).isSymbolicLink())throw new Error('Public view reference path is symbolic');
    const view=JSON.parse(await readFile(file,'utf8'));
    for(const section of ['thesis','grades','verdicts','plays','triggers']){
      if(view[section]==null)continue;
      records[`view/markets/${id}.json#${section}`]={market:id,publicValue:structuredClone(view[section])};
      if(section==='triggers')for(const trigger of view.triggers)records[`view/markets/${id}.json#triggers.${trigger.id}`]={market:id,publicValue:structuredClone(trigger)};
      else if(!Array.isArray(view[section])&&typeof view[section]==='object')for(const [key,value]of Object.entries(view[section]))records[`view/markets/${id}.json#${section}.${key}`]={market:id,publicValue:structuredClone(value)};
    }
  }
  return records;
}
