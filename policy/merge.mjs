import { digest } from './integrity.mjs';
/** The model supplies changed policy records, not authority to delete history. */
export function mergePolicyDelta(previous,delta){
  const keys=['schemaVersion','id','createdAt','parent','sources','instruments','events','claims','impacts','stories','links','reviews'];
  if(!delta||Object.keys(delta).some(k=>!keys.includes(k)))throw new Error('Unknown policy delta field');
  if(!previous)return structuredClone(delta);
  if(delta.parent!==digest(previous))throw new Error('Policy candidate was based on a different published version');
  const output={schemaVersion:1,id:delta.id,createdAt:delta.createdAt,parent:delta.parent};
  for(const kind of ['sources','instruments','events','claims','impacts','stories','links','reviews']){
    if(!Array.isArray(delta[kind]))throw new Error('Policy delta collection missing');
    const records=new Map(previous[kind].map(record=>[record.id,structuredClone(record)]));
    for(const record of delta[kind]){
      const before=records.get(record.id);
      if(before&&['sources','events','claims','impacts','reviews'].includes(kind)&&digest(before)!==digest(record))throw new Error('Model attempted to rewrite immutable evidence or analyst review history');
      if(kind==='reviews'&&!before&&record.status!=='pending_reassessment')throw new Error('Model cannot resolve or defer investment reviews');
      records.set(record.id,structuredClone(record));
    }
    output[kind]=[...records.values()];
  }
  return output;
}
/** The model only needs current instrument identities/states, not historic
 * source bodies and never the investment view store. */
export function priorPolicySummary(snapshot){return snapshot?{head:digest(snapshot),instruments:snapshot.instruments.map(({id,officialId,jurisdiction,markets,state})=>({id,officialId,jurisdiction,markets,state}))}:null;}
