import { POLICY_AUTHORIZATION,worstCaseModelUSD } from '../../policy/authorization.mjs';
import { TRUSTED_POLICY_PROFILES,APPROVED_HISTORICAL_EVALUATION } from '../../policy/validation-profiles.mjs';
import { POLICY_SOURCES } from '../../policy/source-inventory.mjs';
import { activationProblems } from '../../policy/activation.mjs';
import { researchShadow } from '../../policy/shadow.mjs';
import { policyTransport } from '../../policy/transport.mjs';
import { fetchPolicyEvidence } from './evidence.mjs';
import { readReport,writeReport } from './runtime-io.mjs';
import { readPublishedPolicy } from './store-read.mjs';
import { pendingDocuments } from '../../policy/recovery.mjs';
const config=POLICY_AUTHORIZATION;const cycle=new Date().toISOString().slice(0,10);
const blockers=activationProblems({config,sources:POLICY_SOURCES,profiles:TRUSTED_POLICY_PROFILES,evaluation:APPROVED_HISTORICAL_EVALUATION});
if(process.env.POLICY_AI_DISABLED==='1')blockers.push('Policy AI kill switch is ON');
if(blockers.length){await writeReport('policy-research.json',{cycle,status:'disabled',published:false,blockers,usage:null});console.log('Policy research remains OFF; no model was called.');}
else{
  const prior=await readReport('policy-ledger.json');const ledger=prior?.cycle===cycle?prior:{cycle,completed:false,reservedUSD:0,worstCaseCallUSD:worstCaseModelUSD(config),documentHashes:prior?.documentHashes||{}};
  const published=await readPublishedPolicy();
  const discovery=await readReport('policy-discovery.json');const changed=pendingDocuments(discovery?.records,published.snapshot);
  if(!changed.length||ledger.completed){await writeReport('policy-research.json',{cycle,status:ledger.completed?'already_processed':'unchanged',published:false,usage:null});}
  else{
    const evidence=await fetchPolicyEvidence();const bodies=new Map();const changedDocuments=[];
    for(const record of changed){
      const doc=evidence.documents.get(record.id);if(!doc||doc.document.contentHash!==record.lastKnownGood.contentHash)continue;
      const profile=TRUSTED_POLICY_PROFILES.find(p=>p.inventoryId===record.id&&typeof p.extractEvidence==='function'&&typeof p.describeSource==='function');if(!profile)continue;
      const excerpt=profile.extractEvidence(doc.body),source=profile.describeSource(doc);
      if(typeof excerpt!=='string'||!doc.body.includes(excerpt)||source.url!==doc.document.url||source.contentHash!==doc.document.contentHash)continue;
      bodies.set(source.id,doc.body);changedDocuments.push({sourceId:source.id,source,excerpt,inventoryId:record.id});
    }
    // Reservation is persisted before the sole request; a timeout/rerun cannot
    // silently spend the daily allowance again. The orchestrator caches this log.
    ledger.completed=true;await writeReport('policy-ledger.json',ledger);
    const result=await researchShadow({changedDocuments,invoke:policyTransport({key:process.env.POLICY_MODEL_API_KEY,config}),config,ledger:{...ledger,completed:false},context:{marketIds:[...new Set(POLICY_SOURCES.flatMap(s=>s.markets))],allowedHosts:POLICY_SOURCES.filter(s=>s.reviewed).map(s=>s.host),priorIndex:published.index},bodies,before:published.snapshot});
    if(result.candidate)await writeReport('policy-candidate.json',result.candidate);
    const {candidate,lastKnownGood,changes,...report}=result;await writeReport('policy-research.json',{...report,workflowRunId:process.env.GITHUB_RUN_ID||null,workflowAttempt:Number(process.env.GITHUB_RUN_ATTEMPT)||null,reportedAt:new Date().toISOString()});console.log(`Policy research result: ${result.status}; no direct publication.`);
  }
}
