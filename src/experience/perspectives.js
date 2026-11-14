import {h} from '../utils/dom.js';
import {L} from '../app/i18n.js';
import {LS} from '../utils/storage.js';
import {app,setLens,requestRender} from '../app/state.js';
import {HOME_BRIEFING} from '../briefing/homeData.js';
import {LENSES,opportunities,featuredOpportunity,marketName} from './model.js';
import './perspectives.css';

const priorities={
 infraFund:[['Contract coverage','合同覆盖'],['Downside protection','下行保护'],['Debt capacity','融资能力'],['Exit liquidity','退出流动性']],
 strategic:[['Platform scale','平台规模'],['Market access','市场准入'],['Operating capability','运营能力'],['Long-term value','长期价值']],
 foreignFirstTimer:[['Local partners','当地合作伙伴'],['Entry barriers','进入壁垒'],['Execution certainty','执行确定性'],['First-deal exposure','首单风险敞口']],
 developer:[['Land and grid','土地与并网'],['Permitting','许可'],['Construction readiness','建设就绪度'],['Development exit','开发退出']],
};
const stages={'greenfield':['Greenfield','绿地开发'],'ready-to-build':['Ready to build','可开工'],'operating':['Operating','运营中'],'co-invest':['Co-investment','共同投资']};
const usd=value=>'$'+new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(value/1e6)+'m';
function parameters(data){
 const limit=metric=>data.limits?.find(x=>x.metric===metric&&x.routes.some(route=>data.entersAt.includes(route)))?.max;
 const greenfield=data.entersAt.includes('greenfield'),risk=limit('preFidCapitalUSD'),security=limit('securityBeforeConsentUSD'),months=limit('monthsToReadyToBuild');
 const items=[
  [['Capital before investment decision','投资决策前风险资本'],greenfield&&Number.isFinite(risk)?'≤ '+usd(risk):L(['Enter after development','开发后进入']),greenfield?['Greenfield route only','仅适用于绿地路径']:['RTB / operating acquisition or co-investment','收购可开工／运营资产，或共同投资']],
  [['Security before consent','获批前保证金'],Number.isFinite(security)?'≤ '+usd(security):L(greenfield?['Project-specific','逐项目核验']:['After consent','获批后进入']),['Check cash tied up, not only capex','看资金占用，不只看总造价']],
  [['Development window','开发等待期限'],Number.isFinite(months)?'≤ '+months+L([' months','个月']):L(greenfield?['Project-specific','逐项目核验']:['RTB / operating','可开工／运营中']),['Greenfield start → ready to build','从绿地启动至可开工']],
 ];
 return h('div',{class:'ix-perspective-parameters'},
  h('p',{class:'ix-perspective-capital-label'},L(['Single-project funding range · USD','单项目资金量级 · 美元'])),
  h('strong',{class:'ix-perspective-capital'},data.chequeUSD?data.chequeUSD.map(usd).join(' – '):L(['Project-specific','按项目测算'])),
  h('dl',{},items.map(([label,value,note])=>h('div',{},h('dt',{},L(label)),h('dd',{},value),h('small',{},L(note))))),
  h('p',{class:'ix-perspective-return'},h('span',{},L(['Return focus','回报重点'])),h('strong',{},L(data.returnReads))));
}
let selectedInSession=Boolean(LS.get('hub_lens')),compare=false,focusLens=null;
export function perspectiveLead(id){return featuredOpportunity(opportunities(id),id);}
export function renderPerspectives(){
 selectedInSession ||= Boolean(LS.get('hub_lens'));
 const active=LENSES[app.lens]?app.lens:'infraFund';
 const full=!selectedInSession||compare;
 const section=h('section',{class:`ix-perspectives ${full?'is-full':'is-compact'}`,'aria-labelledby':'perspectives-title'},
  h('header',{},h('h2',{id:'perspectives-title'},L(['Choose your investment perspective','选择投资视角'])),h('p',{},L(['Match your capital, development exposure and route to ownership. These are the platform’s existing profile settings.','按资金量级、前期风险与进入阶段匹配自己。以下为平台现有的投资者参数。']))));
 const grid=h('div',{class:'ix-perspective-grid'});
 for(const id of Object.keys(LENSES)){
  const data=HOME_BRIEFING.investorPerspectives[id],lead=perspectiveLead(id);
  const select=h('button',{type:'button',class:'ix-perspective-select','aria-pressed':String(active===id),'data-perspective':id,onclick:()=>{selectedInSession=true;compare=false;focusLens=id;setLens(id);requestRender();}},L(LENSES[id]),h('span',{'aria-hidden':'true'},active===id?' ✓':' ↗'));
  const details=h('details',{class:'ix-perspective-details'},h('summary',{},L(['Who this suits & priorities','适用对象与重点'])),
   h('p',{class:'ix-perspective-who'},L(data.who)),parameters(data),h('p',{class:'ix-perspective-priorities'},priorities[id].map(p=>L(p)).join(' · ')),
   h('p',{class:'ix-perspective-entry'},h('strong',{},L(['Typical entry · ','典型进入阶段 · '])),data.entersAt.map(stage=>L(stages[stage])).join(' / ')),
   h('p',{class:'ix-perspective-lead'},h('strong',{},L(['Current lead · ','当前重点 · '])),lead?L(marketName(lead)):L(['Research','研究'])));
  if(active===id||globalThis.matchMedia?.('(min-width:721px)').matches)details.open=true;
  grid.append(h('article',{class:active===id?'is-active':''},select,details));
 }
 section.append(grid);
 if(full)section.append(h('p',{class:'ix-perspective-definition'},L(['m = million US dollars. Funding ranges describe the profile, not an equity minimum or a market rule. “Project-specific” means no numerical limit is set. Select a perspective to see its current investment cases.','m = 百万美元。资金区间为视角设定，不是最低股权出资或市场准入门槛。“逐项目核验”表示未设统一数值上限。选择视角后查看对应的当前投资方案。'])));
 if(selectedInSession)section.append(h('button',{type:'button',class:'ix-perspective-compare','aria-expanded':String(full),onclick:()=>{compare=!compare;focusLens='compare';requestRender();}},L(full?['Collapse comparison','收起对比']:['Compare four perspectives','比较四种视角'])));
 if(focusLens){const target=focusLens;focusLens=null;requestAnimationFrame(()=>section.querySelector(target==='compare'?'.ix-perspective-compare':`[data-perspective="${target}"]`)?.focus({preventScroll:true}));}
 return section;
}
