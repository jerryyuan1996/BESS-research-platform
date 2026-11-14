/* Italy: live financial owners stay separate from fixed-vintage chart evidence. */
import {HOME_BRIEFING} from '../../briefing/homeData.js';
import {playTitle} from '../../governance/playTitle.js';
import {tokensIn} from '../../experience/story/contract.js';
import {IT_AUCTION_RESULTS as data} from './data/auctionResults.js';

const finite=v=>typeof v==='number'&&Number.isFinite(v);
const percent=v=>finite(v)?Math.round(v*100)+'%':null;
const text=v=>finite(v)?String(v):null;
export const datePair=value=>!value?null:['en-GB','zh-CN'].map(locale=>new Intl.DateTimeFormat(locale,{timeZone:'UTC',dateStyle:'long'}).format(new Date(value+'T12:00:00Z')));
export const IT_ZONES=[['North','北部'],['Centre-North','中北部'],['Centre-South','中南部'],['South','南部'],['Calabria','卡拉布里亚'],['Sicily','西西里'],['Sardinia','撒丁岛']];
export const IT_HISTORY=[
 {id:'H-IT-01',date:'2019-11',precision:'month',source:'SRC-IT-09'},
 {id:'H-IT-02',date:'2021-01-01',source:'SRC-IT-05'},
 {id:'H-IT-03',date:'2021-11-08',source:'SRC-IT-13'},
 {id:'H-IT-04',date:'2025-02-26',through:'2025-02-27',source:'SRC-IT-11'},
 {id:'H-IT-05',date:'2025-09-30',source:'SRC-IT-16'},
 {id:'H-IT-06',date:'2026-10-16',source:'SRC-IT-08'},
];
export function historyValues(node){
 if(node.precision==='month')return {historyNode:['November 2019','2019年11月']};
 const from=datePair(node.date),through=datePair(node.through);
 return {historyNode:through?from.map((v,i)=>v+'–'+through[i]):from};
}
export function reviewedRowsMatch(story,row,rows,lens){
 if(lens!==story.reviewedAgainst.lens)return false;
 return [story.reviewedAgainst,...story.alternatives].every(expected=>{
  const actual=rows.find(r=>r.play?.id===expected.playRef);
  return actual?.call===expected.call&&actual.play.hours===expected.hours;
 })&&row?.play?.id===story.playRef;
}
export function storyValues(row,ui={}){
 const cap=HOME_BRIEFING.plays['it/it-cap-4h'],macse=HOME_BRIEFING.plays['it/it-ltda-6h'];
 const alternate=HOME_BRIEFING.lenses.infraFund.rows.find(r=>r.market==='it'&&r.play===macse.id);
 const i=row?.investment,share=percent(i?.secured),years=text(i?.securedYears),hold=finite(i?.holdIRR)&&ui.returnPct?ui.returnPct(i.holdIRR):null;
 const levered=finite(i?.leveredIRR)&&ui.returnPct?ui.returnPct(i.leveredIRR):null;
 const perZone=data.derating.filter(r=>r.hours===row?.play?.hours);
 return {
  call:ui.CALLS?.[row?.call]??null,playName:row?.play?(ui.playTitle||playTitle)(row.play,row.stage):null,
  cardFigures:hold&&levered&&share&&years?[hold+' all-equity · '+levered+' levered · '+share+' / '+years+' years · investment-summary basis',hold+' 全股权 · '+levered+' 杠杆后 · '+share+' / '+years+'年 · 投资汇总口径']:null,
  nextAction:row?.play?.action?.text??null,playDuration:text(row?.play?.hours),securedShare:share,securedTenor:years,
  merchantShare:percent(cap?.econ?.merchantLine?.share),
  capacityDesignHold:finite(cap?.econ?.hold)&&ui.returnPct?ui.returnPct(cap.econ.hold):null,
  mACSEDesignHold:finite(macse?.econ?.hold)&&ui.returnPct?ui.returnPct(macse.econ.hold):null,
  mACSESecuredShare:percent(macse?.econ?.secured),mACSENextAction:macse?.action?.text??null,
  mACSECall:ui.CALLS?.[alternate?.call]??null,mACSEPlayDuration:text(macse?.hours),
  zoneList:IT_ZONES.reduce((pairs,p)=>pairs.map((s,j)=>s+(s?(j?'、':', '):'')+p[j]),['','']),
  cMNewbuildTerm:text(row?.econ?.securedYears),
  dY2027Derating:[percent(data.legacyRating.factor)+' (repository record)',percent(data.legacyRating.factor)+'（仓库记录）'],
  dY2028DecisionDate:datePair(IT_HISTORY[5].date),
  dY2028DeratingByZone:perZone.length?['en','zh'].map((_,j)=>perZone.map(r=>r.label[j]+': '+percent(r.factor)).join('; ')):null,
  mACSEAuction1Date:datePair(IT_HISTORY[4].date),mACSETerm:null,
  mACSEAwardedHours:data.macseTotals.mw>0?(data.macseTotals.mwh/data.macseTotals.mw).toFixed(1):null,
  mACSEAreas:['en','zh'].map((_,j)=>data.macse.map(r=>r.label[j]).join(j?'、':', ')),
  mACSEAuction2Date:datePair(macse?.action?.due),cMDY2028AuctionDate:null,
  teachingHours:HOME_BRIEFING.grids.it.hours,
  sourceCheckedDate:datePair(data.vintage),...historyValues(IT_HISTORY[0]),
 };
}

/** The approved Missing value state replaces a sentence with an unresolved
    binding. It never inserts a zero, an invented term or a press-only date. */
export function storyWithAvailableValues(story,values){
 const missing=new Set(story.tokens.filter(t=>values[t]===null||values[t]===undefined));
 const adapt=shot=>{
  const out={...shot,labels:Object.fromEntries(Object.entries(shot.labels).filter(([,pair])=>!pair.some(s=>tokensIn(s).some(t=>missing.has(t))))) };
  for(const key of ['question','copy','meaning'])if(shot[key]?.some(s=>tokensIn(s).some(t=>missing.has(t))))out[key]=story.text['Missing value'];
  return out;
 };
 return {...story,opening:adapt(story.opening),chapters:story.chapters.map(c=>({...c,shots:c.shots.map(adapt)})),missingBindings:[...missing]};
}

/** Retain verified explanations in the unified reader when a term or a future
    date is withheld. The underlying bindings and the original edition stay intact. */
export function storyForUnifiedReader(story,values){
 const available=storyWithAvailableValues(story,values),copies={};
 if(!values.mACSETerm)copies['it-03']=[
  'The capacity market pays for availability at tight moments. Moving midday energy into the evening creates a different need. A 2021 decree called for centrally procured storage; ARERA set the criteria and the ministry approved Terna’s rules. The first MACSE auction on {mACSEAuction1Date} awarded storage contracts in {mACSEAreas}; none went to the north. Verify the awarded term, availability requirements and dispatch rights in the contract documents.',
  '容量市场为紧张时段的可用性付费；把午间电量挪到傍晚，则提出另一类需求。2021年的法令要求集中采购储能，ARERA制定标准，主管部门批准Terna的规则。{mACSEAuction1Date}的首轮MACSE拍卖在{mACSEAreas}授予储能合同，北部没有获配。合同期限、可用性要求与调度权须按中标文件逐项核验。',
 ];
 if(!values.cMDY2028AuctionDate||!values.mACSEAuction2Date)copies['it-11']=[
  'Four things can weaken this route: the applicable zonal capacity-credit factor; trading revenue below the case assumption; more batteries competing for spreads and auctions; and permission or construction delays that miss delivery. Verify the next capacity and MACSE auction dates against the official notices before committing to a timetable. Next: {nextAction}',
  '四类因素会削弱这条路线：项目适用的分区容量计入系数；交易收入低于方案假设；更多电池争夺价差与拍卖；许可或建设延误导致无法按期交付。排定投资时间表前，应依据官方公告核验下一轮容量与MACSE拍卖日期。下一步：{nextAction}',
 ];
 return {...available,chapters:available.chapters.map(c=>({...c,shots:c.shots.map(shot=>copies[shot.id]?{...shot,copy:copies[shot.id]}:shot)}))};
}
