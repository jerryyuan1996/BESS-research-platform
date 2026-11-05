import {lstat,readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {digest} from './integrity.mjs';
import {authorizationProblems} from './authorization.mjs';
import {evaluateHistoricalCases} from './evaluation.mjs';
/** Offline release gate. Index approval flags alone never authorize public data.
 * Trusted, reviewed source validators must also recognize the stored assertions. */
export async function verifyPolicyStore({repo,config,profiles,evaluation}){
  const directory=path.join(repo,'public/data/public/policy');
  let info;try{info=await lstat(directory);}catch(e){if(e.code==='ENOENT')return {versions:0,status:'unpublished'};throw e;}
  if(info.isSymbolicLink()||!info.isDirectory())throw Error('Invalid policy store boundary');
  const errors=authorizationProblems(config);
  if(config.publicationEnabled!==true)errors.push('Policy publication is OFF');
  if(!evaluation.approved)errors.push('Historical evaluation is not approved');
  errors.push(...evaluateHistoricalCases(evaluation.cases).blockers);
  if(!profiles.length||profiles.some(p=>!p.reviewed||!p.rightsReviewed||typeof p.verifyStoredSnapshot!=='function'))errors.push('Independent offline source validators missing');
  if(errors.length)throw Error(`Public policy release blocked: ${errors.join('; ')}`);
  async function json(relative,limit){const target=path.join(directory,relative);const stat=await lstat(target);if(stat.isSymbolicLink()||!stat.isFile()||stat.size>limit)throw Error('Invalid policy store file');return JSON.parse(await readFile(target,'utf8'));}
  const index=await json('index.json',1_000_000);
  if(index.schemaVersion!==1||!Array.isArray(index.versions)||!index.versions.length||index.versions.length>10000||new Set(index.versions).size!==index.versions.length||index.versions.at(-1)!==index.head)throw Error('Invalid policy version index');
  const snapshots=path.join(directory,'snapshots');if((await lstat(snapshots)).isSymbolicLink())throw Error('Symbolic policy versions rejected');
  let parent=null;
  for(const hash of index.versions){
    if(!/^[a-f0-9]{64}$/.test(hash))throw Error('Invalid policy version identity');
    const snapshot=await json(`snapshots/${hash}.json`,4_000_000);
    if(digest(snapshot)!==hash||snapshot.parent!==parent)throw Error('Broken policy history checksum or chain');
    if(!profiles.some(profile=>profile.verifyStoredSnapshot({snapshot,index})===true))throw Error('Stored policy assertions lack independent source validation');
    parent=hash;
  }
  const files=await readdir(snapshots);if(files.some(file=>!index.versions.includes(file.replace(/\.json$/,''))||!file.endsWith('.json')))throw Error('Unindexed policy snapshot cannot ship');
  if((await readdir(directory)).some(file=>!['index.json','snapshots'].includes(file)))throw Error('Unexpected public policy asset');
  return {status:'verified',versions:index.versions.length,head:index.head};
}
