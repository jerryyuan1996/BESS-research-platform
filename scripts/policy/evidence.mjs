import { POLICY_SOURCES } from '../../policy/source-inventory.mjs';
import { discoverPolicies } from '../../policy/discovery.mjs';
/** Bodies exist only in this job's memory. No unreviewed source is fetched. */
export async function fetchPolicyEvidence(){
  const documents=new Map();
  const report=await discoverPolicies({sources:POLICY_SOURCES,onDocument:async({source,document,body})=>documents.set(source.id,{source,document,body})});
  return {report,documents};
}
export function bodiesForSnapshot(snapshot,documents){
  const bodies=new Map();
  for(const source of snapshot.sources){const document=[...documents.values()].find(d=>d.document.url===source.url&&d.document.contentHash===source.contentHash);if(document)bodies.set(source.id,document.body);}
  return bodies;
}
