#!/usr/bin/env node
/* A deterministic packet from tracked public records. Never invokes an assistant. */
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { buildBriefing } from '../../src/briefing/model.js';
import { markets as registry } from '../../src/markets/registry.js';
import { ledgerFor } from '../../src/entry/ledgerRegistry.js';
import { DATASETS } from '../../src/governance/datasets.js';
import { setObservedFxSummary, clearObservedFx } from '../../src/comparison/fx.js';
import { runBaseCase } from '../../src/comparison/engine.js';
import { returnGradesFor } from '../../src/comparison/returnGrades.js';
import { evaluateRules } from '../../etl/rules.mjs';
import { ROOT, hash, json, git, revision, readPublicSnapshot, requirePublicSnapshot, locations, atomicWrite, isMain, cliArgs, onlyOptions, safeFile, withReviewLock } from './common.mjs';

const order = b => Object.fromEntries(Object.entries(b.lenses).map(([id,lens]) => [id,lens.rows.map(r => ({market:r.market,play:r.play,call:r.call,value:b.plays[`${r.market}/${r.play}`]?.econ?.value ?? null}))]));
export function computePacketFigures(inputs, selected, now){
  clearObservedFx();
  const build = () => buildBriefing({markets:registry,ledgerFor,catalogue:DATASETS,now,...inputs});
  try {
    const seed = build();
    const fxApplied = inputs.summaries['fx-ecb'] ? setObservedFxSummary(inputs.summaries['fx-ecb'],now.getTime()) : false;
    const current = build();
    const grades=returnGradesFor(registry);
    const engine = Object.fromEntries(selected.map(id => {
      const m=registry.find(m=>m.manifest.id===id);
      const base=runBaseCase(m,5);
      return [id,{storedGrades:inputs.views.find(v=>v.marketId===id)?.grades,engineGrade:grades[id]?.['hold-irr'] ?? null,
        base:base.na ? {unavailable:true} : {holdIRR:base.irrHold,securedShare:base.securedShare,securedYears:base.securedYears},
        plays:Object.fromEntries(Object.entries(current.plays).filter(([,p])=>p.market===id))}];
    }));
    return {engine,shortlist:{seedFx:order(seed),currentFx:order(current),currentFxApplied:fxApplied},triggers:current.queue.filter(q=>selected.includes(q.market) && ['overdue','soon','rule'].includes(q.kind))};
  } finally {clearObservedFx();}
}
export async function buildReviewPacket({root=ROOT,markets,commit='HEAD',verifyCheckout=true,snapshot}={}){
  const selected=[...new Set(markets ?? [])].sort();
  if (!selected.length || selected.some(id=>!registry.some(m=>m.manifest.id===id))) throw new Error('select registered markets with --markets');
  const sha=revision(root,commit);
  const source=requirePublicSnapshot(root,sha,snapshot);
  const {files,asOf}=source, allowed=new Set(files);
  const snapshots=new Map([[sha,source]]);
  const readAt=(root,ref,file)=>{
    if(!snapshots.has(ref)) snapshots.set(ref,readPublicSnapshot(root,ref));
    const bytes=snapshots.get(ref).blobs.get(file);
    if(!bytes) throw new Error(`not tracked in snapshot: ${file}`);
    return bytes.toString('utf8');
  };
  const now=new Date(asOf);
  const evidence=[]; const manifest={};
  const read=(file,kind)=>{
    if(!allowed.has(file)) throw new Error(`not tracked in snapshot: ${file}`);
    const raw=readAt(root,sha,file); manifest[file]=source.manifest[file];
    if(kind) evidence.push({id:file,kind,sha256:manifest[file]});
    return raw;
  };
  const log=read('view/changelog.jsonl','strategy-history').split(/\r?\n/).filter(Boolean).map(JSON.parse);
  const views=files.filter(f=>/^view\/markets\/[a-z0-9_]+\.json$/.test(f)).map(f=>JSON.parse(read(f,'strategy')));
  const summaries={};
  for(const file of files.filter(f=>/^public\/data\/public\/[^/]+\.summary\.json$/.test(f))){
    const s=JSON.parse(read(file,'dataset')); summaries[s.datasetId]=s;
  }
  // Pin every public data file and model input, so a changed dependency cannot
  // be silently applied with a report generated from an older snapshot.
  for(const file of files.filter(f=>f.startsWith('public/data/public/') || f.startsWith('src/') || f.startsWith('view/schema/'))){
    if(!manifest[file]) read(file);
  }
  if(verifyCheckout) for(const [file,digest] of Object.entries(manifest)){
    const current=await readFile(await safeFile(root,file));
    if(hash(current)!==digest) throw new Error(`checkout differs from packet commit: ${file}; commit or select a matching checkout`);
  }
  const baselines={};
  for(const id of selected){
    const last=log.filter(e=>e.market===id && e.author?.kind==='analyst').at(-1);
    let baselineCommit=null;
    if(last) baselineCommit=git(root,'log',sha,'--format=%H','--reverse',`-S${last.id}`,'--','view/changelog.jsonl').trim().split('\n')[0] || null;
    const datasets={};
    for(const [dataset,s] of Object.entries(summaries)){
      if(s.marketId && s.marketId!==id) continue;
      const file=`public/data/public/${dataset}.summary.json`;
      let previous=null;
      if(baselineCommit) { try {previous=JSON.parse(readAt(root,baselineCommit,file));} catch { /* absent at approved baseline */ } }
      datasets[dataset]={sha256:manifest[file],summaryChecksum:s.summaryChecksum??null,current:s.derived??null,
        baseline:previous?.derived??null,baselineAvailable:Boolean(previous),fetchedAt:s.fetchedAt??null};
    }
    baselines[id]={viewHash:manifest[`view/markets/${id}.json`],latestChangelogId:last?.id??null,lastApprovedAt:last?.at??null,baselineCommit,datasets};
  }
  const newsFile='public/data/public/industry-news.json';
  const inputs={views,changelog:log,summaries,news:allowed.has(newsFile)?JSON.parse(readAt(root,sha,newsFile)):null};
  const figures=computePacketFigures(inputs,selected,now);
  const rules=await evaluateRules({views:views.filter(v=>selected.includes(v.marketId)),changelog:log,readSummary:async id=>summaries[id]??null,fetched:null,now});
  const policyFiles=files.filter(f=>f.startsWith('public/data/public/policy/')&&f.endsWith('.json'));
  const policy=policyFiles.map(file=>({file,sha256:manifest[file],record:JSON.parse(readAt(root,sha,file))}));
  for(const p of policy) evidence.push({id:p.file,kind:'policy',sha256:p.sha256});
  const policySinceBaseline=Object.fromEntries(selected.map(id=>[id,policy.filter(p=>{
    if(!baselines[id].baselineCommit) return true;
    try{return hash(readAt(root,baselines[id].baselineCommit,p.file))!==p.sha256;}catch{return true;}
  }).map(p=>p.file)]));
  const body={schemaVersion:1,dataCommit:sha,asOf,markets:selected,manifest,evidence,baselines,figures,rules,policy,policySinceBaseline,
    discoveryCoverage:'Tracked public policy records only. The daily discovery journal is an Actions artifact, not a tracked input; absence here does not mean no new policy.'};
  const id=`review-${sha.slice(0,12)}-${hash(json({markets:selected,manifest})).slice(0,12)}`;
  const unsigned={id,...body};
  return {...unsigned,packetHash:hash(json(unsigned))};
}
export async function savePacket(packet,root=ROOT){
  return withReviewLock(root,async()=>{
  const where=await locations(root,packet.id);
  const body=json(packet);
  // A checked report refers to these exact bytes. A newer builder may produce
  // a different packet for the same input-derived id; never replace its audit.
  let existing;
  try {existing=await readFile(where.packet,'utf8');}
  catch(e){if(e.code!=='ENOENT')throw e;}
  if(existing!==undefined && existing!==body) throw new Error('existing packet differs; refusing to overwrite its review snapshot');
  if(existing===undefined){
    await mkdir(path.dirname(where.packet),{recursive:true});
    await atomicWrite(where.packet,body);
  }
  // Never overwrite an assistant's existing report or the owner's decisions.
  await mkdir(where.dir,{recursive:true});
  const review={schemaVersion:1,id:packet.id,packetHash:packet.packetHash,markets:packet.markets,dataCommit:packet.dataCommit,asOf:packet.asOf,
    sections:{A:'',B:'',C:'',D:'',E:''},proposals:[],checked:null,status:'analysis not started',decisions:[]};
  const reviewFile=await safeFile(root,`docs/strategy-reviews/${packet.id}/review.json`);
  try {await readFile(reviewFile);} catch(e){if(e.code!=='ENOENT')throw e;await atomicWrite(reviewFile,json(review));}
  return where;
  });
}
if(isMain(import.meta.url)){
  try{const a=cliArgs(process.argv.slice(2));onlyOptions(a,['markets','commit']);if(a._.length)throw new Error('unexpected argument');
    const p=await buildReviewPacket({markets:(a.markets??'').split(',').filter(Boolean),commit:a.commit??'HEAD'});await savePacket(p);console.log(p.id);
  }catch(e){console.error(e.message);process.exitCode=1;}
}
