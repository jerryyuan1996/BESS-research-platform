import {impactCompatibility} from './compare.mjs';
export const SCENE_TEMPLATES=Object.freeze(['timeline','lifecycle','status_transition','before_after','causal','stakeholder','sourced_range','impact_waterfall','impact_summary','market_matrix']);

/** Declarative references only. Layout, SVG tags and attributes belong to the
 * reviewed renderer. Semantic approval of every relationship remains separate. */
export function policySceneProblems(spec,snapshot,{storyClaimIds=null}={}){
  if(!spec||Array.isArray(spec)||Object.keys(spec).some(k=>!['template','claimIds','impactIds','relations'].includes(k))||!SCENE_TEMPLATES.includes(spec.template))return ['Unreviewed scene shape'];
  if(!Array.isArray(spec.claimIds)||!Array.isArray(spec.impactIds)||spec.claimIds.length+spec.impactIds.length>24||spec.claimIds.length+spec.impactIds.length===0)return ['Scene reference budget exceeded'];
  if(new Set(spec.claimIds).size!==spec.claimIds.length||new Set(spec.impactIds).size!==spec.impactIds.length)return ['Duplicate scene evidence'];
  const claims=spec.claimIds.map(id=>snapshot.claims.find(c=>c.id===id)),impacts=spec.impactIds.map(id=>snapshot.impacts.find(i=>i.id===id));
  if(claims.some(c=>!c)||impacts.some(i=>!i))return ['Scene evidence reference missing'];
  if(!['sourced_range','impact_waterfall','impact_summary'].includes(spec.template)&&(!claims.length||impacts.length))return ['This template requires claim evidence without quantitative exhibits'];
  if(spec.template==='impact_summary'&&(!claims.length||!impacts.length||impacts.some(i=>i.lane!=='not_quantifiable'||i.value!==null||!spec.claimIds.includes(i.claim))))return ['Impact summary requires unquantified impacts linked to its cited claims'];
  if(spec.template==='market_matrix'&&new Set(claims.flatMap(c=>c.markets)).size>4)return ['Market matrix column budget exceeded'];
  if(storyClaimIds&&(spec.claimIds.some(id=>!storyClaimIds.includes(id))||impacts.some(i=>!storyClaimIds.includes(i.claim))))return ['Scene exceeds the story evidence graph'];
  if(spec.relations!==undefined&&(!Array.isArray(spec.relations)||spec.relations.length>24||spec.relations.some(r=>!r||Array.isArray(r)||Object.keys(r).some(k=>!['from','to','evidenceClaim'].includes(k))||r.from===r.to||!spec.claimIds.includes(r.from)||!spec.claimIds.includes(r.to)||!spec.claimIds.includes(r.evidenceClaim))))return ['Invalid sourced relation'];
  if(['causal','stakeholder'].includes(spec.template)&&(claims.length<2||!spec.relations?.length))return ['A relationship scene needs cited endpoints and a supporting claim'];
  if(spec.template==='before_after'&&claims.length!==2)return ['Before/after needs two independently reviewed claims'];
  if(spec.template==='timeline'&&claims.some(c=>c.kind!=='date'))return ['A chronology requires explicitly dated claims with their own meaning'];
  if(spec.template==='sourced_range'){
    if(impacts.length<2||impacts.some(i=>!Number.isFinite(i.value)||i.location!==impacts[0].location||impactCompatibility(i,impacts[0]).state!=='comparable'))return ['Incompatible quantitative scene basis'];
  }
  if(spec.template==='impact_waterfall'){
    const impact=impacts[0],values=(impact?.inputs||[]).map(id=>snapshot.claims.find(c=>c.id===id)?.value);
    const result=impact?.formula==='sum'?values.reduce((a,b)=>a+b,0):impact?.formula==='difference'&&values.length===2?values[0]-values[1]:NaN;
    if(impacts.length!==1||impact?.lane!=='scenario'||!Number.isFinite(impact.value)||!values.length||values.length>24||impact.inputs.some(id=>snapshot.claims.find(c=>c.id===id)?.kind!=='number')||values.some(v=>!Number.isFinite(v))||!Number.isFinite(result)||Math.abs(result-impact.value)>1e-9*Math.max(1,Math.abs(result)))return ['Waterfall needs a bounded reproducible additive scenario'];
    if(storyClaimIds&&impact.inputs.some(id=>!storyClaimIds.includes(id)))return ['Scenario input exceeds the story evidence graph'];
  }
  return [];
}
