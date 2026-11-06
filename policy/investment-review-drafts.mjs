import {digest} from './integrity.mjs';
import {policyMateriality} from './schema.mjs';
/** Read-only investment references are evidence for a proposed review target,
 * never authority to approve a baseline or change the investment view. */
export function investmentReviewDrafts(snapshot,cases,publicReferences){
  const links=[],reviews=[],baselines=[];
  const mechanisms={eligibility:['eligibility','资格'],grid_access:['grid access','并网准入'],grid_cost:['grid costs','电网成本'],revenue_right:['revenue entitlement','收入权利'],deadline:['deadlines','期限'],investment_call:['investment assumptions','投资假设']};
  for(const c of cases){
    if(c.applicability!=='applicable'||policyMateriality({verified:true,markets:[c.market],mechanisms:[c.mechanism]}).outcome!=='material_investment_review')continue;
    const claim=snapshot.claims.find(row=>row.id==='cl-'+c.id),target='view/markets/'+c.market+'.json#thesis',baseline=publicReferences[target];
    if(!claim||!baseline)throw Error('Investment review draft requires an existing public reference and source claim');
    const id='link-'+c.id;
    const mechanism=mechanisms[c.mechanism];
    links.push({id,claim:claim.id,market:c.market,target,kind:'context',mechanism:c.mechanism,source:claim.evidence[0].source,relevance:['Check the cited '+mechanism[0]+' mechanism against the existing thesis; the baseline approval date and exact mapping remain unconfirmed.','对照现有投资论点复核所引'+mechanism[1]+'机制；基线批准日期和准确映射尚未确认。'],approvedAt:null,state:'unmapped'});
    reviews.push({id:'review-'+c.id,claim:claim.id,linkIds:[id],status:'pending_reassessment',reason:['The sourced policy fact can affect a thesis assumption; no change to the approved conclusion or project income is established.','有来源的政策事实可能影响投资论点的假设；尚未确立对已批准结论或项目收入的任何更改。'],action:['Confirm the exact approved baseline and dependency, then assess the cited mechanism for the reference project before changing any assumption.','先确认准确的已批准基线及依赖关系，再评估所引机制对参考项目的适用性，随后才考虑修改假设。']});
    baselines.push({linkId:id,target,publicRecordHash:digest(baseline),publicValue:structuredClone(baseline.publicValue),approvedAt:null,mappingApproved:false});
  }
  return {links,reviews,baselines};
}
