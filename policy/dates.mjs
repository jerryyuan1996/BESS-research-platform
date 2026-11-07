import {isTime} from './schema.mjs';
import {isCalendarDate,isContextPeriod} from './evidence-values.mjs';
/** Date roles are explicit evidence, never inferred from a nearby event. */
export const POLICY_DATE_LABELS=Object.freeze({published_at:['Published','公布'],document_dated_at:['Document dated','文件落款'],announced_at:['Announced','公告'],effective_at:['Commencement / effect','施行／生效'],adopted_at:['Adopted','通过'],consultation_closes_at:['Consultation closes','咨询截止'],context_at:['Context date','背景日期'],deadline_at:['Deadline','期限']});
export const claimDate=claim=>claim.kind==='date'?claim.value:'';
export function claimDateLabel(claim){
  if(claim.kind!=='date')return ['Date not established','日期未确立'];
  const role=POLICY_DATE_LABELS[claim.predicate]??['Date','日期'];
  const labels=claim.dateSubject?role.map((label,i)=>label+': '+claim.dateSubject[i]):role;
  return claim.datePrecision?labels.map((label,i)=>label+' ('+(claim.datePrecision==='month'?['month only','仅到月份']:['year only','仅到年份'])[i]+')'):labels;
}
export function claimDateBounds(claim){
  if(claim.kind!=='date')return null;
  const v=claim.value;
  if(isTime(v))return [Date.parse(v),Date.parse(v)];
  if(isCalendarDate(v))return [Date.parse(v),Date.parse(v)+86400000-1];
  if(!isContextPeriod(v,claim.datePrecision))return null;
  const [year,month='01']=v.split('-').map(Number),start=Date.UTC(year,month-1,1),end=claim.datePrecision==='year'?Date.UTC(year+1,0,1):Date.UTC(year,month,1);
  return [start,end-1];
}
export function definitelyBefore(a,b){const x=claimDateBounds(a),y=claimDateBounds(b);return !!x&&!!y&&x[1]<y[0];}
export function orderedSceneClaims(template,claims){
  if(template!=='timeline')return [...claims];
  // Stable topological ordering asserts only non-overlapping date intervals.
  const pending=claims.filter(c=>claimDateBounds(c)),result=[];
  while(pending.length){const index=pending.findIndex(c=>!pending.some(other=>other!==c&&definitelyBefore(other,c)));result.push(...pending.splice(index,1));}
  return [...result,...claims.filter(c=>!claimDateBounds(c))];
}
export const EVENT_DATE_FIELDS=Object.freeze([['announcedAt','announced_at'],['publishedAt','published_at'],['recordDatedAt','document_dated_at'],['consultationClosesAt','consultation_closes_at'],['adoptedAt','adopted_at'],['effectiveAt','effective_at']]);
export function eventDates(event){return EVENT_DATE_FIELDS.filter(([field])=>event[field]!=null).map(([field,role])=>({role,value:event[field],label:POLICY_DATE_LABELS[role]}));}

/** The recorded instant is the author's source check of the as-issued record;
 * it does not date independent review or establish complete current law. */
export function eventVerification(event){
  const at=isTime(event?.verifiedAt)?event.verifiedAt:null;
  return {at,label:at?['Author source check completed','作者来源检查完成']:['Source check pending','来源检查待完成']};
}
export function compareEventVerification(a,b){
  const left=eventVerification(a).at,right=eventVerification(b).at;
  return left&&right?Date.parse(right)-Date.parse(left)||a.id.localeCompare(b.id):left?-1:right?1:a.id.localeCompare(b.id);
}
export function matchesVerificationFreshness(event,filter,now=Date.now()){
  if(!filter)return true;
  const at=eventVerification(event).at;if(!at)return false;
  const when=Date.parse(at),cutoff=now-7*86400000;
  return filter==='stale'?when<cutoff:filter==='recent'?when>=cutoff&&when<=now:false;
}
