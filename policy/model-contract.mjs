/** Provider-side structural contract. Independent semantic validation remains
 * mandatory; this schema is not evidence or publication authority. */
const text={type:'string'};const nullableText={anyOf:[text,{type:'null'}]};const number={type:'number'};
const list=items=>({type:'array',items});const pair={type:'array',items:text,minItems:2,maxItems:2};
const object=(properties,required=Object.keys(properties))=>({type:'object',additionalProperties:false,properties,required});
const evidence=object({source:text,locator:text,quote:{type:'string',maxLength:300},supports:text});
const scene=object({template:{type:'string',enum:['timeline','lifecycle','status_transition','before_after','causal','stakeholder','sourced_range','impact_waterfall','market_matrix']},claimIds:list(text),impactIds:list(text),relations:list(object({from:text,to:text,evidenceClaim:text}))});
export const POLICY_OUTPUT_SCHEMA=object({
  schemaVersion:{type:'integer',enum:[1]},id:text,createdAt:text,parent:nullableText,
  sources:list(object({id:text,url:text,publisher:text,title:text,language:text,authority:{type:'string',enum:['official','attributed_forecast']},locator:text,contentHash:text,issuedAt:nullableText,checkedAt:text,rights:object({metadata:{type:'boolean'},termsURL:text,reviewed:{type:'boolean'}})})),
  instruments:list(object({id:text,officialId:text,jurisdiction:text,markets:list(text),title:pair,state:text,supersedes:nullableText,provision:object({parent:text,locator:text})},['id','officialId','jurisdiction','markets','title','state','supersedes'])),
  events:list(object({id:text,instrument:text,kind:text,from:nullableText,to:text,announcedAt:nullableText,publishedAt:text,effectiveAt:nullableText,verifiedAt:text,consultationClosesAt:nullableText,adoptedAt:nullableText,claimIds:list(text),corrects:nullableText,summary:pair})),
  claims:list(object({id:text,instrument:text,kind:text,predicate:nullableText,value:{anyOf:[text,number,{type:'null'}]},status:text,text:pair,markets:list(text),mechanism:text,evidence:list(evidence),translationReviewed:{type:'boolean'}})),
  impacts:list(object({id:text,claim:text,lane:text,value:{anyOf:[number,{type:'null'}]},currency:nullableText,denominator:nullableText,period:nullableText,technology:nullableText,location:nullableText,formula:nullableText,inputs:list(text),attribution:nullableText,asOf:nullableText,contract:nullableText,taxTreatment:nullableText,marketDefinition:nullableText})),
  stories:list(object({id:text,title:pair,answer:pair,instrumentIds:list(text),claimIds:list(text),changesIf:pair,chapters:list(object({id:text,title:pair,text:pair,claimIds:list(text),scene:{anyOf:[scene,{type:'null'}]}}))})),
  links:list(object({id:text,claim:text,market:text,target:text,kind:text,mechanism:text,source:text,relevance:pair,approvedAt:text,state:text})),
  reviews:list(object({id:text,claim:text,linkIds:list(text),status:text,reason:pair,action:pair})),
});
