/** Read only the approved policy store. No investment or private-data access. */
import { readFile,lstat } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from './runtime-io.mjs';
import { digest } from '../../policy/integrity.mjs';
async function read(relative,limit){
  let target=ROOT;
  for(const part of ['public','data','public','policy',...relative.split('/')]){target=path.join(target,part);const info=await lstat(target);if(info.isSymbolicLink())throw new Error('Published policy path is symbolic');}
  if((await lstat(target)).size>limit)throw new Error('Published policy size budget exceeded');return JSON.parse(await readFile(target,'utf8'));
}
export async function readPublishedPolicy(){
  let index;try{index=await read('index.json',1_000_000);}catch(error){if(error.code==='ENOENT')return {index:null,snapshot:null};throw error;}
  if(!/^[a-f0-9]{64}$/.test(index.head||''))throw new Error('Invalid published policy head');const snapshot=await read(`snapshots/${index.head}.json`,4_000_000);
  if(digest(snapshot)!==index.head)throw new Error('Published policy checksum mismatch');return {index,snapshot};
}
