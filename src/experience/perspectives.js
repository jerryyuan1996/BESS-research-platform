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
let selectedInSession=Boolean(LS.get('hub_lens')),compare=false,focusLens=null;
export function perspectiveLead(id){return featuredOpportunity(opportunities(id),id);}
export function renderPerspectives(){
 selectedInSession ||= Boolean(LS.get('hub_lens'));
 const active=LENSES[app.lens]?app.lens:'infraFund';
 const full=!selectedInSession||compare;
 const section=h('section',{class:`ix-perspectives ${full?'is-full':'is-compact'}`,'aria-labelledby':'perspectives-title'},
  h('header',{},h('h2',{id:'perspectives-title'},L(['Choose your investment perspective','选择投资视角'])),h('p',{},L(['One research base. Four ways to read it. Switch at any time.','同一研究基础，四种阅读视角，可随时切换。']))));
 const grid=h('div',{class:'ix-perspective-grid'});
 for(const id of Object.keys(LENSES)){
  const data=HOME_BRIEFING.investorPerspectives[id],lead=perspectiveLead(id);
  const select=h('button',{type:'button',class:'ix-perspective-select','aria-pressed':String(active===id),'data-perspective':id,onclick:()=>{selectedInSession=true;compare=false;focusLens=id;setLens(id);requestRender();}},L(LENSES[id]),h('span',{'aria-hidden':'true'},active===id?' ✓':' ↗'));
  const details=h('details',{class:'ix-perspective-details'},h('summary',{},L(['Who this suits & priorities','适用对象与重点'])),
   h('p',{},L(data.who)),h('ul',{},priorities[id].map(p=>h('li',{},L(p)))),
   h('p',{class:'ix-perspective-entry'},h('strong',{},L(['Typical entry · ','典型进入阶段 · '])),data.entersAt.map(stage=>L(stages[stage])).join(' / ')),
   h('p',{class:'ix-perspective-lead'},h('strong',{},L(['Current lead · ','当前重点 · '])),lead?L(marketName(lead)):L(['Research','研究'])));
  if(active===id||globalThis.matchMedia?.('(min-width:721px)').matches)details.open=true;
  grid.append(h('article',{class:active===id?'is-active':''},select,details));
 }
 section.append(grid);
 if(selectedInSession)section.append(h('button',{type:'button',class:'ix-perspective-compare','aria-expanded':String(full),onclick:()=>{compare=!compare;focusLens='compare';requestRender();}},L(full?['Collapse comparison','收起对比']:['Compare four perspectives','比较四种视角'])));
 if(focusLens){const target=focusLens;focusLens=null;requestAnimationFrame(()=>section.querySelector(target==='compare'?'.ix-perspective-compare':`[data-perspective="${target}"]`)?.focus({preventScroll:true}));}
 return section;
}
