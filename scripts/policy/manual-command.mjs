import {lstat,readFile,realpath} from 'node:fs/promises';
import path from 'node:path';
import {sourceDigest} from '../../policy/integrity.mjs';
import {evaluationCorpusProblems} from '../../policy/manual-evaluation.mjs';
import {authorizationProblems} from '../../policy/authorization.mjs';
import {runReservedManualCase} from './manual-evaluation-runner.mjs';

/** Fixed private corpus path; no user/model-supplied file names or profiles.
 * A committed owner approval binds the complete reviewed UTF-8 corpus hash.
 * PDF adapters, if any, must be trusted reviewed code issuing real receipts. */
export async function executeManualEvaluation({repo,caseId,config,profiles,makeInvoke,now=new Date()}){
  const problems=authorizationProblems({...config,validatedGoldCases:12});
  if(config?.manualEvaluationApproved!==true)problems.push('Separate manual evaluation approval missing');
  if(!/^sha256:[a-f0-9]{64}$/.test(config?.approvedCorpusHash||''))problems.push('Approved corpus hash missing');
  if(!/^[a-z0-9_-]{1,80}$/.test(caseId||''))problems.push('Select one approved case with --case');
  if(!Array.isArray(profiles)||!profiles.length)problems.push('Independent reviewed source profiles missing');
  const disabled=errors=>({status:'disabled',canPublish:false,providerRequests:0,problems:errors});
  if(problems.length)return disabled(problems);
  let file=await realpath(repo);
  for(const part of ['etl','out','policy-review','approved-corpus.json']){file=path.join(file,part);if((await lstat(file)).isSymbolicLink())throw Error('Symbolic corpus path rejected');}
  if(!(await lstat(file)).isFile()||(await lstat(file)).size>4_000_000)throw Error('Invalid approved corpus size');
  const raw=new TextDecoder('utf-8',{fatal:true}).decode(await readFile(file));
  if(sourceDigest(raw)!==config.approvedCorpusHash)throw Error('Approved corpus checksum mismatch');
  const corpus=JSON.parse(raw);if(corpus.schemaVersion!==1||!Array.isArray(corpus.cases))throw Error('Invalid approved corpus');
  const evidenceProofs=new Map();
  for(const c of corpus.cases)if(c?.mediaType==='application/pdf'){
    const profile=profiles.find(p=>p.reviewed&&p.rightsReviewed&&p.sourceIds?.includes(c.source?.id)&&typeof p.prepareManualEvidence==='function');
    if(profile&&c.sourceReviewed===true&&c.rightsReviewed===true&&c.translationReviewed===true)evidenceProofs.set(c.id,await profile.prepareManualEvidence({case:c,repo}));
  }
  const errors=evaluationCorpusProblems(corpus.cases,{evidenceProofs});
  if(!corpus.cases.some(c=>c.id===caseId))errors.push('Case is absent from approved corpus');
  if(corpus.cases.some(c=>!profiles.some(p=>p.reviewed&&p.rightsReviewed&&p.host===new URL(c.source.url).hostname&&p.sourceIds?.includes(c.source.id)&&['validate','translationEquivalent','validatePublicRecord'].every(method=>typeof p[method]==='function'))))errors.push('Every corpus source needs an independent reviewed semantic/translation/record profile');
  if(errors.length)return disabled(errors);
  const invoke=makeInvoke(config);if(typeof invoke!=='function')throw Error('Approved transport missing');
  return runReservedManualCase({repo,cases:corpus.cases,caseId,config,profiles,invoke,now,evidenceProofs});
}
