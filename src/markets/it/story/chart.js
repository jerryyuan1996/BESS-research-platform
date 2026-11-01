import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {fillPair} from '../../../experience/story/contract.js';
import {s} from '../../../experience/story/kit/svg.js';
import {story} from '../story.js';
import {IT_AUCTION_RESULTS as data} from '../data/auctionResults.js';
const text=(pair,values)=>L(fillPair(pair,values));
const paymentShot=story.chapters.flatMap(c=>c.shots).find(s=>s.id==='it-08');

/** Approved unscaled fallback. No invented price, quantitative axes, observed
    bars or cross-basis return comparison. New-entry capacity stays empty. */
export function forkChart(shot,values,{panel='both',focus=0}={}){
 const labels=paymentShot.labels;
 const titleId='it-fork-'+shot.id;
 const svg=s('svg',{viewBox:'0 0 620 300',role:'img','aria-labelledby':titleId,'data-chart':data.chart.id,'data-authority':'example','data-scaled':'false'},
  s('title',{id:titleId},L(data.chart.fallback)),
  s('text',{x:310,y:28,'text-anchor':'middle',class:'it-example-title'},L(data.chart.fallback)),
  ...[0,1].map(i=>s('g',{'data-route':i?'macse':'capacity',opacity:focus===i?1:.65},
   s('rect',{x:35+i*310,y:65,width:240,height:74,rx:8,fill:'#e4e8da',stroke:'#224e40','stroke-width':2}),
   s('text',{x:155+i*310,y:95,'text-anchor':'middle'},text(paymentShot.controls[i],values)),
   s('text',{x:155+i*310,y:121,'text-anchor':'middle'},text(labels[i? 'label6':'label5'],values)))),
  s('path',{d:'M35 175 H275 V235 H35 Z',fill:'none',stroke:'#9b7d48','stroke-width':2,'stroke-dasharray':'7 5','data-authority':'official-plan'}),
  s('text',{x:155,y:199,'text-anchor':'middle'},L(['Delivery 2028, new storage','2028交付年度，新增储能'])),
  s('text',{x:155,y:221,'text-anchor':'middle'},L(story.text['Missing value'])),
  s('text',{x:465,y:192,'text-anchor':'middle'},text(labels.label4,values)),
  s('text',{x:465,y:218,'text-anchor':'middle'},text(labels.label7,values)),
  s('text',{x:310,y:273,'text-anchor':'middle'},text(labels[panel==='credit'?'label0':'label1'],values)));
 const table=h('table',{class:'it-chart-table'},h('caption',{},L(story.text['Chart fallback'])),
  h('thead',{},h('tr',{},h('th',{},L(story.text['Route switch']).split(' · ')[0]),h('th',{},text(labels.label1,values)),h('th',{},text(labels.label0,values)))),
  h('tbody',{},[0,1].map(i=>h('tr',{},h('th',{},text(paymentShot.controls[i],values)),h('td',{},L(story.text['Missing value'])),h('td',{},text(labels[i?'label6':'label5'],values))))));
 return h('div',{class:'it-fork-chart','data-panel':panel},h('p',{class:'it-chart-status'},L(story.text['Chart fallback'])),
  h('div',{class:'it-chart-scroll',tabindex:'0',role:'region','aria-label':L(data.chart.fallback)},svg),table,
  h('details',{},h('summary',{},text(paymentShot.controls[3],values)),
   h('p',{},text(labels.label2,values)),
   h('p',{},L(['Gross contracted payment before obligations and costs; not revenue, value or return.','履约义务及成本扣除前的合同付款，不等同于收入、价值或回报。'])),
   Object.values(data.gaps).map(g=>h('p',{},h('a',{href:g.source.url,target:'_blank',rel:'noopener noreferrer'},g.source.locator)))));
}
