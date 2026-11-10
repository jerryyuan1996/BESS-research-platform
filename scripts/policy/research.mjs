import {writeReport} from './runtime-io.mjs';

/** Retired unattended entry. Enabling capability flags cannot enable a paid
 * path here. Use the separately approved local evaluate-shadow command. */
export async function unattendedPolicyResearch(){
  return {cycle:new Date().toISOString().slice(0,10),status:'manual_only',published:false,providerRequests:0,usage:null,blockers:['Policy model use requires an explicit single-use local manual request']};
}
await writeReport('policy-research.json',await unattendedPolicyResearch());
console.log('Policy research is local manual-only; no model was called.');
