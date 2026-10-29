import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money } from '../experience/model.js';
import { deliveryTimeline, T_ZERO } from './delivery.js';
const time=months=>'T+'+Number(months.toFixed(1))+L(['m','月']);
/* Two milestones are the same step when they fall in the same month with the
   same title and, for cash, the same amount. */
const same=(a,b)=>a&&b&&Math.abs(a.month-b.month)<1e-6&&a.title[0]===b.title[0]&&
  (a.kind!=='cash'||Math.abs(a.amount-b.amount)<.5);
/** Index of the first milestone where the two delivery paths stop matching. */
function divergenceIndex(a,b){
  const n=Math.max(a.length,b.length);
  for(let i=0;i<n;i++)if(!same(a[i],b[i]))return i;
  return -1;
}
export function executionTimelines(comparison,row,investor){
  const wrapper=h('div',{class:'ix-delivery-timelines'},
    h('p',{class:'ix-time-origin'},h('strong',{},'T+0 · '),L(T_ZERO),
      L(comparison.stage==='greenfield'?['. This custom case enters before RTB.','. 当前自定义方案从绿地阶段进入。']:
        ['. The common reference case enters at RTB.','. 统一参考项目按RTB交割进入。'])));
  const paths=[[comparison.standard,['Conventional play','常规方案']],[comparison.alternative,['Special opportunity','特殊机会']]]
    .filter(([reference])=>reference).map(([reference,label])=>({label,t:deliveryTimeline(reference,investor,row.id)}));
  /* With both paths shown, mark the step from which they part. */
  const split=paths.length===2?divergenceIndex(paths[0].t.milestones,paths[1].t.milestones):-1;
  if(split>=0){
    const [a,b]=paths.map(p=>p.t),at=Math.min(a.milestones[split]?.month??Infinity,b.milestones[split]?.month??Infinity);
    const step=(b.milestones[split]||a.milestones[split]).title;
    const gain=a.qualifiedMonths-b.qualifiedMonths;
    wrapper.append(h('div',{class:'ix-divergence'},
      h('strong',{},L(['Paths diverge at ','路径分岔于 ']),time(at)),
      h('p',{},L([
        'The first differing model item is “'+step[0]+'”. Conventional / special COD: '+time(a.codMonths)+' / '+time(b.codMonths)+
          '; revenue eligibility: '+time(a.qualifiedMonths)+' / '+time(b.qualifiedMonths)+'. These are scenario dates, not verified project commitments.',
        '首个不同的模型条目为“'+step[1]+'”。常规／特殊方案投运：'+time(a.codMonths)+'／'+time(b.codMonths)+
          '；收入资格：'+time(a.qualifiedMonths)+'／'+time(b.qualifiedMonths)+'。这些是情景日期，尚不是已核实的项目承诺。',
      ]))));

  }
  const columns=h('div',{class:'ix-delivery-columns'});
  if(split>0)wrapper.append(h('details',{class:'ix-details ix-shared-milestones'},h('summary',{},L(['Shared milestones before divergence','分岔前的共同里程碑'])),h('ol',{},paths[0].t.milestones.slice(0,split).map(m=>h('li',{},time(m.month),' · ',L(m.title),m.kind==='cash'?' · '+money(m.amount,paths[0].t.currency)+'/MW':'')))));
  for(const {label,t} of paths){
    const item=(milestone,i)=>h('li',{class:[milestone.kind==='cash'?'is-cash':'',split>=0&&i>=split?'is-diverged':''].join(' ').trim()},
      h('span',{class:'ix-milestone-time'},time(milestone.month)),
      h('div',{},h('strong',{},L(milestone.title)),
        milestone.kind==='cash'?h('p',{class:milestone.amount>=0?'ix-cash-in':'ix-cash-out'},
          (milestone.amount>=0?'+':'')+money(milestone.amount,t.currency)+'/MW',
          h('small',{},L(['Project cash ','项目现金 ']),(milestone.amount>=0?'+':'')+money(milestone.amount*t.powerMW,t.currency))):
          h('p',{},L(milestone.output),h('small',{},L(milestone.owner)))));
    const list=h('ol',{class:'ix-milestones'});
    t.milestones.forEach((m,i)=>{
      if(paths.length===2&&split>0&&i<split)return;
      if(split>=0&&i===split)list.append(h('li',{class:'ix-divergence-mark','aria-hidden':'true'},L(['Paths diverge here','自此路径分岔'])));
      list.append(item(m,i));
    });
    columns.append(h('article',{class:'ix-delivery-column'+(paths.length===1?' is-single':'')},h('h3',{},L(label)),
      h('p',{class:'ix-caption'},L(['COD ','投运 ']),time(t.codMonths),' · ',L(['Revenue eligibility ','收入资格 ']),time(t.qualifiedMonths)),
      list,
      t.laterCash.length?h('details',{class:'ix-details'},h('summary',{},L(['Later operating and exit cash flows','后续经营及退出现金流'])),
        h('ol',{class:'ix-milestones'},t.laterCash.map((m)=>item(m,-1)))):null));
  }
  wrapper.append(columns,h('p',{class:'ix-caption'},L(paths[0]?paths[0].t.targetBasis:['',''])));
  return wrapper;
}
