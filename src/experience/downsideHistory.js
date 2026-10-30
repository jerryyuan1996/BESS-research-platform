export const PRICE_HISTORY={wa:'wa-wem-prices',pl:'pl-day-ahead',jp_tokyo:'jp-tokyo-jepx',jp_kyushu:'jp-kyushu-jepx',jp_hokkaido:'jp-hokkaido-jepx'};
/** Empirical frequency of a specified fall in monthly mean daily spreads.
 * This is a price proxy, not a calibrated project-return or joint-stress probability.
 * Only consecutive, completed calendar months with >=90% valid days count. */
export function historicalPressure(summary,decline){
  if(!Number.isFinite(decline)||decline<=0||decline>1)return null;
  const cutoff=summary.fetchedAt?.slice(0,7);
  if(!cutoff)return null;
  const groups=new Map();
  for(const d of summary.daily||[]){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(d.d)||!Number.isFinite(d.spread)||d.spread<0)continue;
    const key=d.d.slice(0,7);if(key>=cutoff)continue;
    if(!groups.has(key))groups.set(key,new Map());
    groups.get(key).set(d.d,d.spread);
  }
  const months=[...groups].sort(([a],[b])=>a.localeCompare(b)).flatMap(([month,days])=>{
    const [year,m]=month.split('-').map(Number),calendarDays=new Date(Date.UTC(year,m,0)).getUTCDate();
    return days.size/calendarDays>=.9?[{month,index:year*12+m,mean:[...days.values()].reduce((a,b)=>a+b,0)/days.size}]:[];
  });
  const pairs=[];
  for(let i=1;i<months.length;i++){
    const a=months[i-1],b=months[i];
    if(b.index-a.index===1&&a.mean>0)pairs.push({from:a.month,to:b.month,decline:(a.mean-b.mean)/a.mean});
  }
  if(!pairs.length)return null;
  const events=pairs.filter(p=>p.decline+1e-9>=decline);
  return {count:events.length,total:pairs.length,frequency:events.length/pairs.length,
    from:pairs[0].from,to:pairs.at(-1).to,threshold:decline,events,
    durationHours:summary.derived?.durationHours,source:summary.source,fetchedAt:summary.fetchedAt};
}
export function stressConditions(base,stress){
  if(!base||!stress)return [];
  const out=[],currency=base.input.currency;
  const add=(kind,a,b)=>out.push({kind,base:a,stress:b,currency});
  if(stress.codMonths>base.codMonths+.01)add('delay',base.codMonths,stress.codMonths);
  if(stress.assumptions.buildBudget>base.assumptions.buildBudget*1.001)add('build',base.assumptions.buildBudget,stress.assumptions.buildBudget);
  const a=base.input.annual[0],b=stress.input.annual[0];
  if(a.secured>0&&b.secured<a.secured*.999)add('fixed',a.secured,b.secured);
  const term=input=>{const i=input.annual.findIndex(y=>y.secured<=.001);return i<0?input.annual.length:i;};
  if(a.secured>0&&term(stress.input)<term(base.input))add('term',term(base.input),term(stress.input));
  if(a.merchant>0&&b.merchant<a.merchant*.999)add('trading',a.merchant,b.merchant);
  if(b.opex>a.opex*1.001)add('opex',a.opex,b.opex);
  return out;
}
