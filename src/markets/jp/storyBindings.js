/* Bind the signed script to its existing owners. No story-side valuation,
   currency conversion, cost reconstruction or copied investment thesis. */
import {HOME_BRIEFING} from '../../briefing/homeData.js';
import {expandReferences} from '../../acquisition/projection.js';
import {playTitle} from '../../governance/playTitle.js';
import {fmtUSD} from '../../utils/formatting.js';
import {MARKERS,isStale,tokensIn} from '../../experience/story/contract.js';
import {JP_LTDA_MERCHANT_RETENTION} from './regions.js';
import {JP_STORY_VALUES as V} from './data/storyEvidenceValues.js';
import {JP_STORY_SOURCES} from './data/storyEvidenceSources.js';
import {composeStory,REGION_IDS,REGIONAL_SENTENCES} from './story.js';

const finite=v=>typeof v==='number'&&Number.isFinite(v);
const number=v=>finite(v)?String(v):null;
const pct=v=>finite(v)?`${(v*100).toFixed(1)}%`:null;
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];

/** Preserve the source's year, month or day precision, without timezone shifts. */
export function datePair(value){
  if(typeof value==='number'&&Number.isInteger(value))return [String(value),`${value}年`];
  if(typeof value!=='string')return null;
  const match=/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);
  if(!match)return null;
  const [,year,month,day]=match;
  if(!month)return [year,`${year}年`];
  if(!months[Number(month)-1])return null;
  return day?[`${Number(day)} ${months[Number(month)-1]} ${year}`,`${year}年${Number(month)}月${Number(day)}日`]
    :[`${months[Number(month)-1]} ${year}`,`${year}年${Number(month)}月`];
}

export const jpy=v=>finite(v)?new Intl.NumberFormat('en-US',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(v):null;
export const fiscalEnd=v=>finite(v)?[`end-FY${v}`,`${v}财年末`]:null;

export function cardFigures(row,ui={}){
  const value=row?.investment?.holdIRR;
  if(!finite(value)||typeof ui.returnPct!=='function')return null;
  const formatted=ui.returnPct(value),margin=ui.marginText?.(row);
  return margin?[`${formatted} (${margin[0]})`,`${formatted}（${margin[1]}）`]:[formatted,formatted];
}

/** Decode the platform's public projection; never recalculate a reference. */
export function chartRows(briefing=HOME_BRIEFING){
  const rows=expandReferences(briefing.acquisitions?.infraFund||[],briefing.acquisitionReferenceData);
  return Object.entries(REGION_IDS).map(([marketId,region])=>{
    const playId=`jp-${region}-ltda-6h`;
    const row=rows.find(r=>r.market===marketId&&r.playId===playId&&r.stage==='operating');
    const cases=['cautious','base','favourable'].map(key=>{
      const own=row?.currency==='JPY'?row.referenceCases.find(c=>c.key===key):null;
      return {key,pricePerMW:own?.status==='priced'&&finite(own.pricePerMW)&&own.pricePerMW>0?own.pricePerMW:null,
        targetReturn:finite(own?.targetReturn)?own.targetReturn:null,returnBasis:own?.returnBasis||null,route:own?.route||null};
    });
    return {marketId,region,name:briefing.markets?.[marketId]?.name||null,currency:'JPY',cases,
      /* BUILD-JP-02: neither designEconomics nor the operating reference exposes
         the play design's build cost in JPY. An operating budget zero is not it. */
      buildCostPerMW:null,designValueUSD:finite(briefing.plays?.[`${marketId}/${playId}`]?.econ?.value)?briefing.plays[`${marketId}/${playId}`].econ.value:null};
  });
}

export function storySources(row){
  const slug=row?.market?.manifest?.slug;
  return Object.fromEntries(Object.entries(JP_STORY_SOURCES).map(([id,s])=>[id,{...s,url:slug?s.url.replace('{areaSlug}',slug):s.url}]));
}

export function storyValues(row,ui={}){
  const region=REGION_IDS[row?.id],r=V.regional[region],n=V.national;
  const m=row?.market,lt=m?.comparison?.economics?.ltda;
  const econ=HOME_BRIEFING.plays?.[`${row?.id}/${row?.play?.id}`]?.econ;
  const own=chartRows().find(r=>r.marketId===row?.id),base=own?.cases.find(c=>c.key==='base');
  const expected=HOME_BRIEFING.triggers?.[row?.next]?.expected;
  return {
    call:ui.CALLS?.[row?.call]||null,
    playName:row?.play?(ui.playTitle||playTitle)(row.play,row.stage):null,
    cardFigures:cardFigures(row,ui),nextAction:row?.play?.action?.text||null,
    playEvidence:MARKERS[row?.evidence]||null,
    areaName:m?.manifest?.name||null,areaSlug:m?.manifest?.slug||null,
    regionalSentence:REGIONAL_SENTENCES[row?.id]||null,
    playDuration:number(row?.play?.hours),obligationHours:number(lt?.minDurationHours),awardTerm:number(lt?.years),
    retainedShare:pct(JP_LTDA_MERCHANT_RETENTION),securedShare:pct(econ?.secured),securedYears:number(econ?.securedYears),
    designValue:finite(econ?.value)?fmtUSD(econ.value):null,purchaseCeiling:jpy(base?.pricePerMW),
    purchaseTarget:pct(base?.targetReturn),buildCostPerMW:jpy(own?.buildCostPerMW),
    triggerDate:datePair(expected),bidCloseDate:datePair(expected),
    eastFrequency:number(n.eastFrequency),westFrequency:number(n.westFrequency),converterYear:fiscalEnd(n.converterYear),
    h01Year:number(n.h01Year),earthquakeDate:datePair(n.earthquakeDate),outageDate:datePair(n.outageDate),
    earthquakeMonth:datePair(n.earthquakeMonth),earthquakeYear:number(n.earthquakeYear),
    reformStep1:datePair(n.reformStep1),reformStep2:datePair(n.reformStep2),reformStep3:datePair(n.reformStep3),
    capacityMarketYear:finite(n.capacityMarketYear)?[`FY${n.capacityMarketYear}`,`${n.capacityMarketYear}财`]:null,
    ltdaYear:finite(n.ltdaYear)?[`FY${n.ltdaYear}`,`${n.ltdaYear}财`]:null,
    supplyCrunchDate:datePair(n.supplyCrunchDate),supplyCrunchYear:number(n.supplyCrunchYear),
    clawbackShare:n.clawbackShare||null,nextRound:n.nextRound||null,
    lithiumIonPool:finite(n.lithiumIonPoolMW)?[`${n.lithiumIonPoolMW} MW`,`${n.lithiumIonPoolMW}兆瓦`]:null,
    studyCap:number(r?.studyCap),studyCapDate:datePair(r?.studyCapDate),
    fitDate:datePair(n.fitDate),suspensionDate:datePair(n.suspensionDate),firstCurtailmentDate:datePair(n.firstCurtailmentDate),
    transferTripDate:datePair(n.transferTripDate),blackoutDate:datePair(n.blackoutDate),blackoutMonth:datePair(n.blackoutMonth),
    newKitahonYear:number(n.newKitahonYear),linkYear:fiscalEnd(n.linkYear),chargingControlSystems:number(n.chargingControlSystems),
    sourceCheckedDate:datePair(V.checkedOn),researchCheckDate:datePair(n.researchCheckDate),
  };
}

/** Per-composition guards; a stale area never changes another area's result. */
export function storyMatches(story,row,lens='infraFund'){
  return Boolean(story&&row?.id===story.marketId&&lens===story.reviewedAgainst.lens
    &&row.play?.id===story.playRef&&row.play.hours===story.reviewedAgainst.hours
    &&row.call===story.reviewedAgainst.call&&row.play.route===story.reviewedAgainst.route
    &&row.stage===story.reviewedAgainst.stage);
}

export function reviewed({row,lens='infraFund',ui={},regionId=row?.id}={}){
  const story=composeStory(regionId);
  if(!story||isStale(story,row)||!storyMatches(story,row,lens))return null;
  return {story,values:storyValues(row,ui)};
}

const financial=new Set(['call','playName','cardFigures','nextAction','areaName','areaSlug','playDuration','obligationHours','awardTerm','retainedShare','securedShare','securedYears','designValue','purchaseCeiling','purchaseTarget','buildCostPerMW']);

/** Hide the sentence with a missing owner, then show the approved missing state.
    Other sentences keep their signed wording. Never feed a missing token to
    fillTokens, whose generic em dash is not the Japan missing-state contract. */
export function storyWithAvailableValues(story,values){
  const missing=new Set(story.tokens.filter(key=>values[key]===null||values[key]===undefined||values[key]===''));
  const adapt=shot=>{
    const out={...shot};
    for(const key of ['question','copy','meaning']){
      const pair=shot[key];
      if(!pair?.some(s=>tokensIn(s).some(t=>missing.has(t))))continue;
      const used=pair.flatMap(tokensIn).filter(t=>missing.has(t));
      const fallback=story.text[used.some(t=>financial.has(t))?'Missing financial binding':'Missing evidence binding'];
      out[key]=pair.map((text,i)=>{
        const parts=text.split(i?/(?<=[。！？])/:/(?<=[.!?])\s+/);
        const kept=parts.filter(part=>!tokensIn(part).some(t=>missing.has(t)));
        return [...kept,fallback[i]].filter(Boolean).join(i?'':' ');
      });
    }
    return out;
  };
  return {...story,opening:adapt(story.opening),chapters:story.chapters.map(c=>({...c,shots:c.shots.map(adapt)})),missingBindings:[...missing]};
}
