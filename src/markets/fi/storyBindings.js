/* Finland story tokens: current market-card fields or dated primary records.
   No model calculation, return basis substitution or price-to-revenue bridge. */
import { HOME_BRIEFING } from '../../briefing/homeData.js';
import { playTitle } from '../../governance/playTitle.js';
import { MARKERS, tokensIn } from '../../experience/story/contract.js';
import { FI_STORY_NEED, fastObligationRange } from './data/storyNeed.js';
import { FI_EVIDENCE, FI_HISTORY, FI_RESERVE_PRODUCTS } from './data/storyEvidence.js';

const finite = v => typeof v === 'number' && Number.isFinite(v);
const number = v => finite(v) ? v.toLocaleString('en-US',{maximumFractionDigits:2}) : null;
const pair = v => [v,v];
const share = v => finite(v) ? Math.round(v*100)+'%' : null; // market card's share() convention
const ZONE = 'Europe/Helsinki';
export function datePair(value,{early=false,time=false}={}){
  if(!value) return null;
  if(/^\d{4}$/.test(value))return [value,value+'年'];
  const date=new Date(value.length===7?value+'-15T00:00:00Z':value.length===10?value+'T00:00:00Z':value);
  if(!Number.isFinite(date.getTime()))return null;
  const options={year:'numeric',month:'long',...(value.length===7?{}:{day:'numeric'}),timeZone:time?ZONE:'UTC',...(time?{hour:'2-digit',minute:'2-digit',hour12:false}:{})};
  const en=new Intl.DateTimeFormat('en-GB',options).format(date),zh=new Intl.DateTimeFormat('zh-CN',options).format(date);
  return [early?'early '+en:en,early?zh+'初':zh].map(s=>time?s+' · '+ZONE:s);
}
export function historyValues(record){
  const dates=record.dates.map(d=>datePair(d,{early:record.early}));
  return {historyNode:[dates.map(d=>d[0]).join(' · '),dates.map(d=>d[1]).join(' · ')]};
}
export function productValues(product=FI_RESERVE_PRODUCTS[0]){
  const a=product.activation,b=product.support;
  let activation;
  if(a.triggers)activation=[a.triggers.map(([hz,sec])=>hz+' Hz → '+sec+' s').join('; '),a.triggers.map(([hz,sec])=>hz+'Hz → '+sec+'秒').join('；')];
  else if(a.percentMinutes)activation=[a.percentMinutes.map(([pct,min])=>'~'+pct+'% · '+min+' min').join('; '),a.percentMinutes.map(([pct,min])=>'约'+pct+'% · '+min+'分钟').join('；')];
  else if(a.percentSeconds)activation=[a.percentSeconds[0]+'% · '+a.percentSeconds[1]+' s',a.percentSeconds[0]+'% · '+a.percentSeconds[1]+'秒'];
  else activation=[a.minutes+' min',a.minutes+'分钟'];
  let support;
  if(b.seconds)support=[b.seconds.join(' / ')+' s',b.seconds.join(' / ')+'秒'];
  else if(b.hoursEachWay)support=[b.hoursEachWay+' h ↑ + '+b.hoursEachWay+' h ↓; '+b.powerRatio+'× MW',b.hoursEachWay+'小时↑ + '+b.hoursEachWay+'小时↓；'+b.powerRatio+'× MW'];
  else if(b.minutesRange)support=[b.minutesRange.join('–')+' min',b.minutesRange.join('—')+'分钟'];
  else if(b.capacityHours)support=[b.capacityHours+' h',b.capacityHours+'小时'];
  else support=[b.minutes+' min',b.minutes+'分钟'];
  return {productTerms:product.label,productActivation:activation,productSupport:support,productDirection:pair(product.direction),productApproval:pair(product.locator)};
}
/** Price vintages come only from the selected committed envelope. */
export function priceValues(snapshot,product){
  if(!snapshot||snapshot.units?.price!=='EUR/MW/h')return {priceCoverage:null,priceFetchedAt:null};
  const from=datePair(snapshot.coverage?.from,{time:true}),to=datePair(snapshot.coverage?.to,{time:true});
  return {
    productTerms:product.label,
    priceCoverage:from&&to?[from[0]+' → '+to[0],from[1]+' → '+to[1]]:null,
    priceFetchedAt:datePair(snapshot.fetchedAt,{time:true}),
  };
}
export const sourceValues = source => ({sourceCheckedDate:datePair(source?.checkedOn)});

/** ui carries the market page's formatters; do not import its own chunk. */
export function storyValues(row,ui={}){
  const i=row?.investment,need=FI_STORY_NEED,grid=HOME_BRIEFING.grids?.fi?.hours;
  const hours=finite(row?.play?.hours)?row.play.hours:row?.market?.comparison?.archetype?.durationHours;
  const shareText=share(i?.secured),tenor=finite(i?.securedYears)?String(i.securedYears):null;
  const returnText=finite(i?.holdIRR)&&ui.returnPct?ui.returnPct(i.holdIRR):null;
  const bounds=fastObligationRange();
  return {
    call:ui.CALLS?.[row?.call]||null,
    playName:row?.play?(ui.playTitle||playTitle)(row.play,row.stage):null,
    cardFigures:returnText&&shareText&&tenor?[returnText+' · '+shareText+' / '+tenor+' years',returnText+' · '+shareText+' / '+tenor+'年']:null,
    nextAction:row?.play?.action?.text||null,playEvidence:MARKERS[row?.evidence]||null,
    playDuration:finite(hours)?String(hours):null,durationGrid:Array.isArray(grid)?pair(grid.join(' · ')):null,
    securedShare:shareText,securedTenor:tenor,
    plantName:pair(FI_EVIDENCE.ol3.name),ol3RegularDate:datePair(FI_EVIDENCE.ol3.regularDate),
    ol3Output:pair(number(FI_EVIDENCE.ol3.outputMW)+' MW'),ol3NetStep:pair(number(FI_EVIDENCE.ol3.netStepMW)+' MW'),
    connectedDate:datePair(need.connected.period,{early:true}),
    connectedMW:['≈'+number(need.connected.mw)+' MW','约'+number(need.connected.mw)+'MW'],
    fastObligationMW:[bounds.map(number).join('–')+' MW',bounds.map(number).join('—')+'MW'],
    annualDeliveryYear:String(FI_EVIDENCE.annualDeliveryYear.value),fcrHourlyYear:String(FI_EVIDENCE.hourlyDeliveryYear.value),
    billSubmissionMonth:datePair(FI_EVIDENCE.billSubmission.month),
    visionHorizon:String(FI_EVIDENCE.vision.horizon),priceCoverage:null,priceFetchedAt:null,
    sourceCheckedDate:datePair(FI_EVIDENCE.checkedOn),...historyValues(FI_HISTORY[0]),...productValues(),
  };
}
export function longerTeachingDuration(row){
  const hours=HOME_BRIEFING.grids?.fi?.hours||[];
  return hours.filter(h=>finite(h)&&h>(row?.play?.hours??Infinity)).sort((a,b)=>a-b)[0]??null;
}

/** Use the signed-off figure-free fallback when a financial binding is missing. */
export function storyWithAvailableValues(story,values){
  const financial=new Set(['call','playName','cardFigures','nextAction','playDuration','securedShare','securedTenor']);
  const missing=[...financial].filter(k=>values[k]===null||values[k]===undefined);
  if(!missing.length)return story;
  const set=new Set(missing),fallback=story.text['Missing financial binding'];
  const adapt=shot=>{
    const out={...shot};
    for(const key of ['question','copy','meaning']){
      if(shot[key]?.some(s=>tokensIn(s).some(t=>set.has(t))))out[key]=fallback;
    }
    return out;
  };
  return {...story,opening:adapt(story.opening),chapters:story.chapters.map(c=>({...c,shots:c.shots.map(adapt)})),missingBindings:missing};
}
