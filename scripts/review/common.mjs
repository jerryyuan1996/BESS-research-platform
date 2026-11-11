import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, rename, lstat, open, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REVIEW_ID } from '../../src/governance/review.js';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const json = value => `${JSON.stringify(value, null, 2)}\n`;
export const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], { maxBuffer: 64 * 1024 * 1024, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] });
export function revision(root, ref = 'HEAD'){
  if (!/^[a-zA-Z0-9_./-]+$/.test(ref) || ref.startsWith('-')) throw new Error('invalid commit reference');
  return git(root, 'rev-parse', '--verify', `${ref}^{commit}`).trim();
}
export function trackedPaths(root, commit){ return git(root, 'ls-tree', '-r', '--name-only', commit).trim().split('\n').filter(Boolean); }
export function readAt(root, commit, file){
  if (file.startsWith('/') || file.split('/').some(p => p === '..' || p === 'local-data') || /[\r\n\0:]/.test(file)) throw new Error('unsafe tracked path');
  return git(root, 'show', `${commit}:${file}`);
}
export async function safeFile(root, relative){
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).some(p => p === '..') || relative.includes('\0')) throw new Error('unsafe output path');
  let cur = path.resolve(root);
  for (const part of relative.split(/[\\/]/)){
    cur = path.join(cur, part);
    try { if ((await lstat(cur)).isSymbolicLink()) throw new Error('review paths may not be symbolic links'); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  return cur;
}
export async function locations(root, id){
  if (!REVIEW_ID.test(id)) throw new Error('invalid review id');
  return { packet: await safeFile(root, `etl/out/strategy-review/${id}/packet.json`), dir: await safeFile(root, `docs/strategy-reviews/${id}`) };
}
export async function atomicWrite(file, body){
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp-${process.pid}`;
  await writeFile(temp, body, { flag:'wx' });
  await rename(temp, file);
}
// Analysis and decisions share both review files and the topic log. Take one
// repository-wide lock before reading either, so a slow check cannot overwrite
// an analyst decision made while its engine computation was running.
export async function withReviewLock(root, action){
  const lock=await safeFile(root,'etl/out/strategy-review/.decision-lock');
  await mkdir(path.dirname(lock),{recursive:true});
  const handle=await open(lock,'wx');
  try { return await action(); }
  finally { await handle.close(); await unlink(lock); }
}
export function publicInputPath(file){
  if(typeof file !== 'string' || !file || file.includes('\\') || /[\r\n\0:]/.test(file) || file.split('/').some(p=>!p || p==='.' || p==='..' || p==='local-data')) return false;
  return file.startsWith('public/data/public/') || file.startsWith('src/') || file.startsWith('view/schema/') || /^view\/markets\/[a-z0-9_]+\.json$/.test(file) || file==='view/changelog.jsonl';
}
export function presentInputPaths(root){
  const tracked=git(root,'ls-files','-z').split('\0').filter(publicInputPath);
  const untracked=git(root,'ls-files','--others','-z','--','public/data/public','view/markets').split('\0').filter(publicInputPath);
  return [...new Set([...tracked,...untracked])].sort();
}
// Read immutable Git blobs in one binary batch, never through checkout paths.
const trustedSnapshots = new WeakSet();
export function readPublicSnapshot(root, commit){
  const sha=revision(root,commit);
  const opts={maxBuffer:128*1024*1024,stdio:['pipe','pipe','pipe']};
  const tree=execFileSync('git',['-C',root,'ls-tree','-r','-z',sha],opts).toString('utf8');
  const entries=tree.split('\0').filter(Boolean).map(row=>{
    const tab=row.indexOf('\t');
    const [mode,type,oid]=row.slice(0,tab).split(' ');
    return {mode,type,oid,file:row.slice(tab+1)};
  }).filter(e=>publicInputPath(e.file));
  for(const e of entries) if(e.type!=='blob'||!['100644','100755'].includes(e.mode)) throw new Error('public snapshot contains non-regular blob');
  const batch=execFileSync('git',['-C',root,'cat-file','--batch'],{...opts,input:entries.map(e=>e.oid+'\n').join('')});
  let offset=0;const blobs=new Map(),manifest={};
  for(const e of entries){
    const end=batch.indexOf(10,offset);
    if(end<0) throw new Error('truncated Git blob header');
    const [oid,type,sizeText]=batch.subarray(offset,end).toString('ascii').split(' ');
    const size=Number(sizeText);offset=end+1;
    if(oid!==e.oid||type!=='blob'||!Number.isSafeInteger(size)||size<0||offset+size>=batch.length||batch[offset+size]!==10) throw new Error('invalid Git blob batch');
    const bytes=batch.subarray(offset,offset+size);offset+=size+1;
    blobs.set(e.file,bytes);manifest[e.file]=hash(bytes);
  }
  if(offset!==batch.length) throw new Error('unexpected Git blob batch bytes');
  const snapshot={root:path.resolve(root),sha,asOf:git(root,'show','-s','--format=%cI',sha).trim(),files:entries.map(e=>e.file),manifest,blobs};
  trustedSnapshots.add(snapshot);return snapshot;
}
export function requirePublicSnapshot(root,commit,snapshot){
  if(!snapshot) return readPublicSnapshot(root,commit);
  if(!trustedSnapshots.has(snapshot)||snapshot.root!==path.resolve(root)||snapshot.sha!==commit) throw new Error('untrusted Git snapshot');
  return snapshot;
}
export async function validatePacketInputs(root,packet){
  if(!packet.manifest || typeof packet.manifest!=='object' || Array.isArray(packet.manifest)) throw new Error('invalid packet manifest');
  for(const [file,digest] of Object.entries(packet.manifest)){
    if(!publicInputPath(file) || !/^[a-f0-9]{64}$/.test(digest)) throw new Error('packet input outside tracked public allowlist');
    await safeFile(root,file);
  }
  const snapshot=readPublicSnapshot(root,packet.dataCommit);
  if(packet.dataCommit!==snapshot.sha || packet.asOf!==snapshot.asOf) throw new Error('packet commit metadata differs from Git snapshot');
  if(Object.keys(packet.manifest).length!==snapshot.files.length || snapshot.files.some(file=>packet.manifest[file]!==snapshot.manifest[file])) throw new Error('packet manifest differs from Git snapshot');
  if(!Array.isArray(packet.evidence) || packet.evidence.some(e=>!e || !publicInputPath(e.id) || packet.manifest[e.id]!==e.sha256)) throw new Error('invalid packet evidence');
  return snapshot;
}
export async function loadReview(root, id){
  const where = await locations(root,id);
  const packet = JSON.parse(await readFile(where.packet,'utf8'));
  const { packetHash, ...unsigned } = packet;
  if (packet.id !== id || packetHash !== hash(json(unsigned))) throw new Error('packet checksum mismatch');
  const snapshot=await validatePacketInputs(root,packet);
  const {buildReviewPacket}=await import('./packet.mjs');
  const rebuilt=await buildReviewPacket({root,markets:packet.markets,commit:packet.dataCommit,verifyCheckout:false,snapshot});
  if(json(rebuilt)!==json(packet)) throw new Error('packet content differs from deterministic Git snapshot');
  const reviewFile=await safeFile(root,`docs/strategy-reviews/${id}/review.json`);
  const review = JSON.parse(await readFile(reviewFile,'utf8'));
  return { where, packet, review };
}
export const isMain = url => process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(url);
export function cliArgs(argv){
  const result = { _: [] };
  for(let i=0;i<argv.length;i++){
    const s=argv[i];
    if (!s.startsWith('--')) { result._.push(s); continue; }
    const key=s.slice(2); if (!key || !argv[i+1] || argv[i+1].startsWith('--')) throw new Error(`missing value for ${s}`);
    if (result[key] !== undefined) throw new Error(`duplicate option ${s}`);
    result[key]=argv[++i];
  }
  return result;
}
export function onlyOptions(args, allowed){ for(const key of Object.keys(args)) if(key !== '_' && !allowed.includes(key)) throw new Error(`unknown option --${key}`); }

export async function updateDecisionLog(root,review){
  const file=await safeFile(root,'docs/strategy-reviews/README.md');
  const start='<!-- reviews:start -->',end='<!-- reviews:end -->';
  const old=await readFile(file,'utf8');
  if(!old.includes(start)||!old.includes(end))throw new Error('decision log markers missing');
  const a=old.indexOf(start)+start.length,b=old.indexOf(end);
  const rows=old.slice(a,b).split('\n').filter(l=>l.startsWith('| review-')&&!l.startsWith(`| ${review.id} |`));
  rows.push(`| ${review.id} | ${review.asOf.slice(0,10)} | ${review.markets.join(', ')} | ${review.dataCommit} | ${review.status} | ${(review.decisions??[]).map(d=>`${d.proposal}: ${d.decision}`).join('; ')} | Not released |`);
  rows.sort();await atomicWrite(file,`${old.slice(0,a)}\n${rows.join('\n')}\n${old.slice(b)}`);
}
