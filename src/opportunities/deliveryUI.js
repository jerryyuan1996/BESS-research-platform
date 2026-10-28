import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money } from '../experience/model.js';
import { deliveryTimeline, T_ZERO } from './delivery.js';
const time=months=>'T+'+Number(months.toFixed(1))+L(['m','月']);
export function executionTimelines(comparison,row,investor){
  const wrapper=h('div',{class:'ix-delivery-timelines'},
    h('p',{class:'ix-time-origin'},h('strong',{},'T+0 · '),L(T_ZERO),
      L(comparison.stage==='greenfield'?['. This custom case enters before RTB.','. 当前自定义方案从绿地阶段进入。']:
        ['. The common reference case enters at RTB.','. 统一参考项目按RTB交割进入。'])));
  const columns=h('div',{class:'ix-delivery-columns'});
  for(const [reference,label]of [[comparison.standard,['Conventional play','常规play']],[comparison.alternative,['Special opportunity','特殊机会']]]){
    if(!reference)continue;
    const t=deliveryTimeline(reference,investor,row.id);
    const item=milestone=>h('li',{class:milestone.kind==='cash'?'is-cash':''},
      h('span',{class:'ix-milestone-time'},time(milestone.month)),
      h('div',{},h('strong',{},L(milestone.title)),
        milestone.kind==='cash'?h('p',{class:milestone.amount>=0?'ix-cash-in':'ix-cash-out'},
          (milestone.amount>=0?'+':'')+money(milestone.amount,t.currency)+'/MW',
          h('small',{},L(['Project cash ','项目现金 ']),(milestone.amount>=0?'+':'')+money(milestone.amount*t.powerMW,t.currency))):
          h('p',{},L(milestone.output),h('small',{},L(milestone.owner)))));
    columns.append(h('article',{class:'ix-delivery-column'},h('h3',{},L(label)),
      h('p',{class:'ix-caption'},L(['COD ','投运 ']),time(t.codMonths),' · ',L(['Revenue eligibility ','收入资格 ']),time(t.qualifiedMonths)),
      h('ol',{class:'ix-milestones'},t.milestones.map(item)),
      t.laterCash.length?h('details',{class:'ix-details'},h('summary',{},L(['Later operating and exit cash flows','后续经营及退出现金流'])),
        h('ol',{class:'ix-milestones'},t.laterCash.map(item))):null));
  }
  wrapper.append(columns,h('p',{class:'ix-caption'},L(comparison.standard?deliveryTimeline(comparison.standard,investor,row.id).targetBasis:['',''])));
  return wrapper;
}
