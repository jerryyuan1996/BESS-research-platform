import {digest} from './integrity.mjs';
/** A previous local file or prior workflow attempt cannot masquerade as the
 * current model artifact. This grants no factual or publication approval. */
export function candidateEnvelopeProblems({snapshot,report,runId,attempt,now=new Date()}){
  const errors=[];
  if(!/^\d+$/.test(String(runId||''))||!Number.isInteger(Number(attempt))||Number(attempt)<1)errors.push('Trusted workflow identity missing');
  if(!report||report.status!=='shadow_valid'||report.canPublish!==false||report.published!==false)errors.push('Candidate lacks a valid shadow decision packet');
  if(report?.workflowRunId!==String(runId)||report?.workflowAttempt!==Number(attempt))errors.push('Candidate belongs to another workflow run or attempt');
  if(report?.candidateHash!==digest(snapshot))errors.push('Candidate bytes differ from the decision packet');
  const age=new Date(now).getTime()-Date.parse(report?.reportedAt);
  if(!Number.isFinite(age)||age<0||age>3_600_000)errors.push('Candidate decision packet is stale or future-dated');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(report?.cycle||''))errors.push('Candidate cycle identity missing');
  return errors;
}
