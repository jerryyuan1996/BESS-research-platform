#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { statusForMarket, REVIEW_ID } from '../../src/governance/review.js';
import { ROOT, hash, isMain, cliArgs, onlyOptions } from './common.mjs';
import { readBriefingInputs } from '../../src/briefing/disk.js';
export async function reviewStatus({root=ROOT}={}){
  const {views,changelog,summaries}=await readBriefingInputs(root);
  const reviews=[];const dir=path.join(root,'docs/strategy-reviews');
  let names=[];try{names=await readdir(dir,{withFileTypes:true});}catch(e){if(e.code!=='ENOENT')throw e;}
  for(const name of names.filter(n=>n.isDirectory()&&REVIEW_ID.test(n.name))){
    try{reviews.push(JSON.parse(await readFile(path.join(dir,name.name,'review.json'),'utf8')));}catch(e){if(e.code!=='ENOENT')throw e;}
  }
  return Promise.all(views.map(async v=>statusForMarket({market:v.marketId,changelog,summaries,reviews,viewHash:hash(await readFile(path.join(root,'view/markets',`${v.marketId}.json`)))})));
}
if(isMain(import.meta.url)){
  try{const a=cliArgs(process.argv.slice(2));onlyOptions(a,[]);if(a._.length)throw new Error('usage: review:status');console.log(JSON.stringify(await reviewStatus(),null,2));}catch(e){console.error(e.message);process.exitCode=1;}
}
