#!/usr/bin/env node
/* Explicit local analyst action only. Neither packet nor check imports this. */
import { readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { createViewStore } from '../view/writer.mjs';
import { reviewProblems } from '../../src/governance/review.js';
import { analystChanges, changedInputs, reviewContentHash, renderReport } from './check.mjs';
import { ROOT, hash, json, loadReview, atomicWrite, isMain, cliArgs, onlyOptions, validatePacketInputs, git, publicInputPath, safeFile, updateDecisionLog, presentInputPaths, withReviewLock } from './common.mjs';
export async function currentDataFingerprint(root,packet){
  await validatePacketInputs(root,packet);
  const files=[...new Set([...Object.keys(packet.manifest),...presentInputPaths(root)])].sort();
  const hashes={};for(const file of files){
    await safeFile(root,file);
    try{hashes[file]=hash(await readFile(path.join(root,file)));}catch(e){if(e.code!=='ENOENT')throw e;hashes[file]=null;}
  }return hash(json(hashes));
}
export async function decideReview({root=ROOT,id,approve=[],reject=[],defer=[],acknowledgeData=null,now=new Date(),store=createViewStore(path.join(root,'view'))}){
  return withReviewLock(root,async()=>{
    const {where,packet,review}=await loadReview(root,id);
    const errors=reviewProblems(review,packet);
    if(errors.length)throw new Error(errors.join('\n'));
    if(!review.checked||review.checked.contentHash!==reviewContentHash(review)||review.checked.packetHash!==packet.packetHash)throw new Error('run review:check on this exact report before deciding');
    const choices=[...approve.map(proposal=>({proposal,decision:'approved'})),...reject.map(proposal=>({proposal,decision:'rejected'})),...defer.map(proposal=>({proposal,decision:'deferred'}))];
    if(!choices.length)throw new Error('choose proposal ids explicitly; there is no approve-all');
    if(new Set(choices.map(c=>c.proposal)).size!==choices.length)throw new Error('a proposal may have only one decision');
    for(const c of choices){
      if(!review.proposals.some(p=>p.id===c.proposal))throw new Error(`unknown proposal ${c.proposal}`);
      if(review.decisions?.some(d=>d.proposal===c.proposal && d.decision!=='deferred'))throw new Error(`${c.proposal} already has a final decision`);
    }
    const accepted=review.proposals.filter(p=>approve.includes(p.id));
    const moved=await changedInputs(root,packet);
    // Data acknowledgment never authorizes rebasing against a changed strategy or methodology.
    const protectedMoved=moved.filter(f=>!f.startsWith('public/data/public/'));
    if(accepted.length&&protectedMoved.length)throw new Error(`strategy or engine changed; prepare a new review: ${protectedMoved.join(', ')}`);
    const fingerprint=await currentDataFingerprint(root,packet);
    if(accepted.length&&moved.length&&acknowledgeData!==fingerprint)throw new Error(`data moved: ${moved.join(', ')}; inspect differences, then pass --acknowledge-data ${fingerprint}`);
    const logFile=await safeFile(root,'docs/strategy-reviews/README.md');
    const logText=await readFile(logFile,'utf8');
    if(!logText.includes('<!-- reviews:start -->')||!logText.includes('<!-- reviews:end -->')) throw new Error('decision log markers missing');
    const changes=analystChanges(accepted.filter(p=>p.kind==='view'),id);
    // Whole-batch preparation happens before any view write. No assumption edit is applied.
    await store.prepareBatch(changes,now);
    const pending={id,at:now.toISOString(),choices,inputFingerprint:fingerprint,changes};
    const intent=path.join(where.dir,'pending-decision.json');
    try{await readFile(intent);throw new Error('an earlier decision has an uncertain outcome; reconcile pending-decision.json with changelog before continuing');}catch(e){if(e.code!=='ENOENT')throw e;}
    await atomicWrite(intent,json(pending));
    const entries=changes.length?await store.applyBatch(changes,now):[];
    const decisions=[...(review.decisions??[]).filter(d=>!choices.some(c=>c.proposal===d.proposal)),...choices.map(c=>({...c,at:now.toISOString(),inputFingerprint:fingerprint,
      result:c.decision!=='approved'?c.decision:review.proposals.find(p=>p.id===c.proposal).kind==='assumption'?'written plan and separate sign-off required':review.proposals.find(p=>p.id===c.proposal).kind==='view'?'applied':'recorded',
      acknowledgedData:moved.length&&accepted.length?moved:[]}))];
    const allDecided=review.proposals.every(p=>decisions.some(d=>d.proposal===p.id));
    const appliedChangelogIds=[...(review.appliedChangelogIds??[]),...entries.map(e=>e.id)];
    // A subsequent rejection or deferral cannot erase a previously applied
    // proposal. Pending work remains visible in the per-proposal decisions.
    const status=appliedChangelogIds.length?'applied':!allDecided?'awaiting decision':decisions.some(d=>d.decision==='deferred')?'deferred':decisions.every(d=>d.decision==='rejected')?'rejected':'approved';
    const result={...review,status,decisions,appliedChangelogIds};
    await atomicWrite(path.join(where.dir,'review.json'),json(result));
    await atomicWrite(path.join(where.dir,'report.md'),renderReport(result));
    await updateDecisionLog(root,result);
    await unlink(intent);
    return result;
  });
}
if(isMain(import.meta.url)){
  try{const a=cliArgs(process.argv.slice(2));onlyOptions(a,['approve','reject','defer','acknowledge-data']);if(a._.length!==1)throw new Error('usage: review:decide <id> --approve p1 --reject p2 --defer p3');
    const split=k=>(a[k]??'').split(',').filter(Boolean);const r=await decideReview({id:a._[0],approve:split('approve'),reject:split('reject'),defer:split('defer'),acknowledgeData:a['acknowledge-data']});console.log(`${r.id}: ${r.status}`);
  }catch(e){console.error(e.message);process.exitCode=1;}
}
