import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {researchHistoryTimeline} from '../../../components/researchHistoryTimeline.js';
import {sourceDrawer} from '../../../components/sourceDrawer.js';
import {badge} from '../../../components/badge.js';

export function renderResearchHistory(history,researchUrl){
  const root=h('section',{class:'public-full-history','data-history-owner':history.owner},
    h('p',{class:'public-content-label'},L(['Research excerpt','研究摘录'])),
    h('h4',{class:'public-history-heading'},L(history.head)),
    history.cap?h('p',{class:'public-history-cap'},L(history.cap)):null,
    h('p',{class:'public-history-scope'},L(['Capital lenses and planned / forecast status follow the original research.','资本视角及计划／预测状态沿用原研究。'])));
  let axis=0;
  const block=(b,key)=>{
    if(!b)return null;
    if(b.t==='timeline')return researchHistoryTimeline(b.items,{owner:history.owner,axis:axis++});
    if(b.t==='card'||b.t==='g2')return h('section',{class:b.t==='card'?'public-history-card':'public-history-support','data-history-block':key},
      b.title?h('h4',{},L(b.title)):null,
      b.badges?.length?h('div',{class:'public-history-authority'},b.badges.map(kind=>badge(kind))):null,
      (b.blocks||b.cards||[]).map((child,i)=>block(b.t==='g2'?{...child,t:'card'}:child,key+'-'+i)));
    if(b.t==='band-story')return h('div',{class:'story-band','data-history-block':key},h('strong',{},L(b.b)),h('p',{},L(b.text)));
    if(b.t==='why')return h('aside',{class:'public-history-why','data-history-block':key},h('p',{},L(b.text)),b.sig?h('strong',{},L(b.sig)):null);
    if(b.t==='src')return sourceDrawer(b.src,b.use);
    if(b.t==='flow')return h('div',{class:'public-history-flow','data-history-block':key},b.items.map((item,i)=>h('span',{},i?h('span',{'aria-hidden':'true'},b.sep||'→'):null,L(item))));
    if(b.t==='sub')return h('p',{class:'public-history-region','data-history-block':key},L(b.text),
      history.marketId==='jp_'+({Tokyo:'tokyo',Kyushu:'kyushu',Hokkaido:'hokkaido'}[b.text[0]])?h('strong',{},' · ',L(['Current region','当前地区'])):null);
    if(b.t==='table')return table(b.head,b.rows,key);
    if(b.t==='line'||b.t==='bar'){
      const cfg=b.cfg;
      return h('details',{class:'public-history-data','data-history-block':key},
        h('summary',{},L(['Supporting series · original values and units','支撑序列 · 原数值及单位'])),
        table([['Period','时期'],...cfg.series.map(s=>s.name)],cfg.xs.map((x,i)=>[x,...cfg.series.map(s=>cfg.yfmt?cfg.yfmt(s.vals[i]):s.vals[i])]),key+'-data'));
    }
    if(['p','cap','note','reco'].includes(b.t))return h('p',{'data-history-block':key},b.b?h('strong',{},L(b.b)):null,L(b.text));
    throw new Error('Unsupported original history block: '+b.t);
  };
  root.append(...history.cards.map((card,i)=>block(card,String(i))),renderHistoryProvenance(history,researchUrl));
  return root;
}
function table(head,rows,key){
  return h('div',{class:'public-history-table',tabindex:'0','data-history-block':key},h('table',{},
    head?h('thead',{},h('tr',{},head.map(label=>h('th',{scope:'col'},L(label))))):null,
    h('tbody',{},rows.map(row=>h('tr',{},row.map((cell,i)=>h(i?'td':'th',i?{}:{scope:'row'},L(cell?.b||cell?.text||(cell==null?'':cell)))))))));
}
export function renderHistoryProvenance(history,researchUrl){
  return h('details',{class:'public-history-provenance'},h('summary',{},L(['Original history provenance & source register','原历程出处与来源登记'])),
    history.dataDate?h('p',{},L(['Original research data vintage: ','原研究数据口径：']),history.dataDate):null,
    history.dataVersion?h('p',{},L(['Original research data version: ','原研究数据版本：']),history.dataVersion):null,
    h('p',{},L(['Source drawers within each history retain the original citations. Where the original card had no individual citation, the market source register below remains context; it is not a new event-by-event verification.','各历程内的来源抽屉保留原引用。原卡没有独立引用时，下列市场来源登记仍作为背景，不代表新增的逐事件核验。'])),
    h('a',{href:researchUrl},L(['Full market research ↗','完整市场研究 ↗'])),
    h('a',{href:researchUrl?.replace(/\/home$/, '/data')},L(['Market data & sources ↗','市场数据与来源 ↗'])));
}
