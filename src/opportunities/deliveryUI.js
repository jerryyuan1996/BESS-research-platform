import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { deliveryTimeline, T_ZERO } from './delivery.js';
import { monthlyCashChart } from './monthlyCashUI.js';
import { cashFlowChart } from '../experience/charts.js';
import { deliveryRoadmap, deliverySteps } from './deliveryRoadmap.js';
const time=months=>'T+'+Number(months.toFixed(1))+L(['m','月']);
const selectedPlans=new Map();
/* Step-by-step guidance reads top to bottom: where T+0 is, the roadmap of
   workstreams and cash on one axis, a card per step, then the whole-life
   cash curve and the monthly detail for whoever wants the exact dates. */
export function executionTimelines(comparison,row,investor){
  const key=row.id+':'+investor,paths=[
    {id:'standard',reference:comparison.standard,label:['Conventional play','常规方案']},
    {id:'alternative',reference:comparison.alternative,label:['Special opportunity','特殊机会']},
  ].filter(p=>p.reference);
  let selected=paths.some(p=>p.id===selectedPlans.get(key))?selectedPlans.get(key):'standard';
  const wrapper=h('div',{class:'ix-delivery-timelines'});
  function draw(focus=false){
    const path=paths.find(p=>p.id===selected)||paths[0];
    if(!path)return;
    const t=deliveryTimeline(path.reference,investor,row.id,{route:'hold'});
    const switches=paths.length>1?h('div',{class:'ix-plan-switch',role:'group','aria-label':L(['Execution plan','执行方案'])},paths.map(p=>h('button',{
      type:'button','data-plan':p.id,'aria-pressed':String(p.id===path.id),
      onclick:()=>{selected=p.id;selectedPlans.set(key,selected);draw(true);},
    },L(p.label)))):null;
    const laterFrom=Math.floor(Math.max(t.codMonths+12,t.qualifiedMonths))+1;
    const later=t.laterCash.length?h('details',{class:'ix-details ix-later-cash','data-plan':path.id},
      h('summary',{},L(['Later operating and exit cash flows','后续经营及退出现金流'])),
      h('p',{class:'ix-caption'},L(['Same selected plan and all-equity hold basis. The cumulative line retains the original closing cash balance.','沿用当前方案及全股权长持口径；累计线延续从交割开始的现金余额。'])),
      monthlyCashChart(t,{from:laterFrom,plan:path.id})):null;
    const firstCash=Math.max(t.codMonths+12,t.qualifiedMonths);
    wrapper.replaceChildren(h('p',{class:'ix-time-origin'},h('strong',{},'T+0 · '),L(T_ZERO),
      L(comparison.stage==='greenfield'?['. This custom case enters before RTB.','. 当前自定义方案从绿地阶段进入。']:
        ['. The common reference case enters at RTB.','. 统一参考项目按RTB交割进入。'])),
      ...[switches].filter(Boolean),h('div',{class:'ix-plan-heading'},h('h3',{},L(path.label)),
        h('dl',{class:'ix-key-dates'},
          h('div',{},h('dt',{},L(['Commercial operation','商业投运'])),h('dd',{},time(t.codMonths))),
          h('div',{},h('dt',{},L(['Revenue eligibility','取得收入资格'])),h('dd',{},time(t.qualifiedMonths))),
          h('div',{},h('dt',{},L(['First operating-year cash','首个运营年度现金'])),h('dd',{},time(firstCash))),
          h('div',{},h('dt',{},L(['Return basis','回报口径'])),h('dd',{},L([path.reference.input.annual.length+'-year all-equity hold',path.reference.input.annual.length+'年全股权长持']))))),
      deliveryRoadmap(t,path.id),
      h('div',{class:'ix-execution-layout','data-plan':path.id},
        deliverySteps(t),
        h('aside',{class:'ix-execution-cash'},h('details',{class:'ix-details ix-construction-cash'},
          h('summary',{},L(['Monthly construction and operating cash detail','建设及运营期逐月现金明细'])),monthlyCashChart(t,{plan:path.id})))),
      cashFlowChart(t),
      ...[later].filter(Boolean),h('p',{class:'ix-caption'},L(t.targetBasis)));
    if(focus)wrapper.querySelector('.ix-plan-switch [data-plan="'+selected+'"]')?.focus({preventScroll:true});
  }
  draw();return wrapper;
}
