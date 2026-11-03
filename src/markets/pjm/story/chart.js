/* Chart-PJM-PRICE-ELCC: no numeric upper-panel price payload or price geometry. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {s} from '../../../experience/story/kit/svg.js';
import {toggleGroup} from '../../../experience/story/kit/controls.js';
import {fillPair} from '../../../experience/story/contract.js';
import {PJM_STORY_VALUES as E} from '../data/storyEvidenceValues.js';
import {datePair} from '../storyBindings.js';

const T={
  example:['Example · unscaled price sketch','示例 · 不设数值刻度的价格示意'],
  credit:['BRA class rating · share of nameplate power','BRA类别核定值 · 占铭牌功率比例'],
  pending:['Auction pending','拍卖待举行'],
  noCap:['No cap approved','尚无获批上限'],
  indicative:['Indicative (PJM, non-binding)','指示性（PJM，不具约束力）'],
  observed:['Published BRA rating','已公布BRA核定值'],
  year:['Delivery year','交付年度'],
  upper:['Price layer','价格层'],
  table:['Chart values and publication states','图表数值与公布状态'],
  basis:['Rating basis','核定依据'],
  unknown:['Not published','尚未公布'],
};
const rows=Object.values(E.years);
const line=points=>points.map(([x,y],i)=>`${i?'L':'M'}${x},${y}`).join(' ');
const x=i=>48+i*(864/(rows.length-1));
const y=rating=>348-rating*160;

export function priceCreditChart(shot,{values}) {
  const hours=Number(values.playDuration);
  let mode=2;
  const host=h('div',{class:'k-scene pjm-chart','data-chart':'Chart-PJM-PRICE-ELCC','data-price-mode':'example'});
  const drawing=h('div',{});
  const paint=()=>{
    const price=s('g',{'data-panel':'price',hidden:mode===1});
    price.append(s('text',{x:48,y:24,class:'pjm-chart-title'},L(T.example)));
    rows.forEach((row,i)=>{
      if(row.auctionStatus==='cleared'){
        price.append(s('rect',{x:x(i)-13,y:76,width:26,height:64,class:'pjm-price-example','data-kind':'example'}));
        price.append(s('rect',{x:x(i)-18,y:64,width:36,height:12,class:'pjm-band'}));
      } else if(row.auctionStatus==='pending'){
        price.append(s('rect',{x:x(i)-18,y:64,width:36,height:12,class:'pjm-band pjm-plan'}));
        price.append(s('text',{x:x(i),y:44,'text-anchor':'middle',class:'pjm-chart-label'},L(T.pending)));
        price.append(s('text',{x:x(i),y:160,'text-anchor':'middle',class:'pjm-chart-label'},L(datePair(row.resultsPostedDate))));
      }
    });
    price.append(s('text',{x:x(rows.findIndex(r=>r.auctionStatus==='not-held')),y:62,class:'pjm-chart-label'},L(T.noCap)));
    const credit=s('g',{'data-panel':'credit',hidden:mode===0});
    credit.append(s('text',{x:48,y:180,class:'pjm-chart-title'},L(T.credit)));
    for(const tick of [0,.25,.5,.75,1]){
      credit.append(s('line',{x1:48,x2:912,y1:y(tick),y2:y(tick),class:'pjm-grid'}));
      credit.append(s('text',{x:40,y:y(tick)+4,'text-anchor':'end',class:'pjm-chart-label'},`${tick*100}%`));
    }
    const observed=[],indicative=[];
    rows.forEach((row,i)=>{
      const a=row.auctionRatingByHours[hours],b=row.indicativeRatingByHours[hours];
      if(Number.isFinite(a))observed.push([x(i),y(a)]);
      if(Number.isFinite(b))indicative.push([x(i),y(b)]);
    });
    credit.append(s('path',{d:line(observed),class:'pjm-rating','data-kind':'observed'}));
    observed.forEach(([cx,cy])=>credit.append(s('circle',{cx,cy,r:3,class:'pjm-point'})));
    if(mode===2&&indicative.length){
      const connector=observed.length?[observed.at(-1),...indicative]:indicative;
      credit.append(s('path',{d:line(connector),class:'pjm-rating pjm-plan','data-kind':'indicative-non-binding'}));
      credit.append(s('text',{x:365,y:195,class:'pjm-chart-label'},L(T.indicative)));
    }
    const axis=s('g',{});
    rows.forEach((row,i)=>axis.append(s('text',{x:x(i),y:375,transform:`rotate(45 ${x(i)} 375)`,'text-anchor':'start',class:'pjm-chart-label'},row.deliveryYear)));
    drawing.replaceChildren(s('svg',{viewBox:'0 0 980 450',role:'img','aria-label':L(fillPair(shot.question,values))},price,credit,axis));
  };
  host.append(toggleGroup({label:fillPair(shot.question,values),value:mode,options:shot.controls.map((label,value)=>({value,label:fillPair(label,values)})),onChange:value=>{mode=value;paint();}}),drawing);
  paint();
  const table=h('table',{class:'pjm-chart-table'},
    h('caption',{},L(T.table)),
    h('thead',{},h('tr',{},[T.year,T.upper,T.credit,T.basis].map(label=>h('th',{scope:'col'},L(label))))),
    h('tbody',{},rows.map(row=>{
      const official=row.auctionRatingByHours[hours],indicative=row.indicativeRatingByHours[hours];
      const rating=official??indicative;
      return h('tr',{},h('th',{scope:'row'},row.deliveryYear),
        h('td',{},L(row.auctionStatus==='cleared'?T.example:row.auctionStatus==='pending'?T.pending:T.noCap)),
        h('td',{},Number.isFinite(rating)?`${Math.round(rating*100)}%`:L(T.unknown)),
        h('td',{},L(official===null?T.indicative:T.observed)));
    })));
  host.append(h('details',{},h('summary',{},L(T.table)),table));
  return host;
}
