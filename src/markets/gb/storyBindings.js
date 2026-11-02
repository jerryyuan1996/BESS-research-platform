/* Read the selected card and its published-vintage fields; never run a case. */
import {CALLS,share,returnPct} from '../../experience/model.js';
import {operatingPrice} from '../../experience/projectFacts.js';
import {playTitle} from '../../governance/playTitle.js';
import {MARKERS,tokensIn} from '../../experience/story/contract.js';
import {RECORDS} from './story/evidence.js';
import {story} from './story.js';

const finite=Number.isFinite;
const pair=value=>Array.isArray(value)?[...value]:value;
const date=r=>{
  if(!r?.value)return null;
  const month=/^\d{4}-\d\d$/.test(r.value);
  const d=new Date(r.value+(month?'-01':'')+'T12:00:00Z');
  return ['en-GB','zh-CN'].map(locale=>new Intl.DateTimeFormat(locale,{timeZone:'UTC',...(month?{year:'numeric',month:'long'}:{dateStyle:'long'})}).format(d));
};

export function storyBindings(row,ui={}){
  const play=row?.play,investment=row?.investment,comparison=row?.market?.comparison;
  const hours=comparison?.durationResponse?.hours||[];
  const factors=comparison?.durationResponse?.capacityDerating||[];
  const duration=hours.map((hours,i)=>({hours,factor:finite(factors[i])?factors[i]:null}));
  const at=duration.findIndex(d=>d.hours===play?.hours);
  const action=play?.action?.text;
  const gateName=action?.[0]?.match(/\bGate\s*\d+\b/)?.[0]??null;
  const q=comparison?.durationResponse?.routeRules?.toll?.quotedHours;
  const dr=date(RECORDS.dr),dm=date(RECORDS.dm);
  const values={
    call:pair((ui.CALLS||CALLS)[row?.call])??null,
    playName:play?playTitle(play,row.stage):null,
    cardFigures:investment?[returnPct(investment.holdIRR)+' · '+share(investment.secured)+' / '+investment.securedYears,returnPct(investment.holdIRR)+' · '+share(investment.secured)+' / '+investment.securedYears]:null,
    nextAction:pair(action)??null,playEvidence:pair(MARKERS[row?.evidence])??null,
    playDuration:finite(play?.hours)?String(play.hours):null,
    securedShare:finite(investment?.secured)?share(investment.secured):null,
    securedTenor:finite(investment?.securedYears)?String(investment.securedYears):null,
    operatingPrice:operatingPrice(investment),
    tollQuotedHours:finite(q)?String(q):null,
    capacityAgreementYears:finite(comparison?.economics?.contractYears)?String(comparison.economics.contractYears):null,
    deratingCurve:duration.length&&duration.every(d=>d.factor!==null)?[
      duration.map(d=>d.hours+'h '+(d.factor*100).toFixed(2)+'%').join(' · '),
      duration.map(d=>d.hours+'小时 '+(d.factor*100).toFixed(2)+'%').join(' · ')]:null,
    netaDate:date(RECORDS.neta),bettaDate:date(RECORDS.betta),capacityDate:date(RECORDS.firstCapacity),
    efrDate:null,deratingDate:date(RECORDS.deratingRules),dcDate:date(RECORDS.dc),drDmDate:dr.map((s,i)=>s+' / '+dm[i]),
    obpDate:date(RECORDS.obp),gate2Date:date(RECORDS.gate2),remaDate:date(RECORDS.rema),feeDate:date(RECORDS.feeConsultation),
    queueMW:['en-GB','zh-CN'].map(locale=>new Intl.NumberFormat(locale).format(RECORDS.queueMW.value)+' MW'),
    cpBatteryRange:[RECORDS.cpBatteryRange.value.join('–')+' GW',RECORDS.cpBatteryRange.value.join('–')+' GW'],
    cpHorizon:String(RECORDS.cpHorizon.value),serviceSeries:null,sourceCheckedDate:date({value:story.reviewedAgainst.on}),gateName:gateName?[gateName,gateName]:null,
    capacityAuction:story.sources['SRC-GB-20'].title.match(/T-\d/)?.[0]??null,
    deratingSchedule:RECORDS.deratingRules.locator.match(/Schedule (\d+B)/)?.[1]??null,
  };
  return {values,duration:{cells:duration,current:play?.hours??null,shorter:duration[at-1]?.hours??null,longer:duration[at+1]?.hours??null},
    model:{powerMW:investment?.powerMW??null,hours:play?.hours??null,securedYears:investment?.securedYears??null,capacityYears:comparison?.economics?.contractYears??null}};
}

export const storyValues=(row,ui)=>storyBindings(row,ui).values;

/** Missing figures remove their whole sentence, with the approved empty text. */
export function storyWithAvailableValues(input,values){
  const missing=s=>tokensIn(s).some(t=>values[t]===null||values[t]===undefined||values[t]==='');
  const fallback=['Quantitative history not yet available','量化历史暂不可用'];
  const clean=p=>p?.map((s,i)=>s.split(i?/(?<=。)/:/(?<=[.!?])\s+/).filter(x=>!missing(x)).join(i?'':' ')||fallback[i]);
  const shot=s=>({...s,copy:clean(s.copy),meaning:s.meaning?clean(s.meaning):null,
    labels:Object.fromEntries(Object.entries(s.labels||{}).map(([k,p])=>[k,p.map((v,i)=>v.split(' · ').filter(x=>!missing(x)).join(' · ')||fallback[i])]))});
  return {...input,opening:shot(input.opening),chapters:input.chapters.map(c=>({...c,shots:c.shots.map(shot)}))};
}
