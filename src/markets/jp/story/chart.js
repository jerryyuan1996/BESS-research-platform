/* Chart-JP-PRICE: one JPY axis, with USD design value outside the drawing.
   All prices/targets arrive from the existing acquisition owner. */
import {JP_TEXT} from '../story.js';
import {jpy,chartRows} from '../storyBindings.js';
import {h,L,s,text,note,diagram,table,tag,interactive,JP_UI} from './ui.js';

const finite=v=>typeof v==='number'&&Number.isFinite(v);
const positive=v=>finite(v)&&v>0;
const target=v=>finite(v)?`${(v*100).toFixed(3)}%`:null;
const missing=()=>L(JP_TEXT['Missing financial binding']);
const million=v=>`¥${(v/1000000).toFixed(1)}m`;

/** The table is the chart's data contract, with no substitute zeros. */
export function priceTableRows(data){
  return data.flatMap(area=>area.cases.filter(c=>positive(c.pricePerMW)).map(c=>({
    marketId:area.marketId,region:area.region,name:area.name,key:c.key,
    pricePerMW:c.pricePerMW,targetReturn:c.targetReturn,returnBasis:c.returnBasis,
    buildCostPerMW:positive(area.buildCostPerMW)?area.buildCostPerMW:null,currency:'JPY',
  })));
}

export function priceChart(shot,ctx,{compare=false,data=chartRows()}={}){
  const selected=data.find(d=>d.marketId===ctx.row.id);
  const areas=(compare?data:[selected]).filter(Boolean);
  const usable=priceTableRows(areas);
  if(!usable.length)return h('div',{class:'jp-price-empty',role:'status'},missing());
  const readout=h('p',{class:'jp-readout jp-price-readout',role:'status'});
  const max=Math.ceil(Math.max(...usable.map(r=>r.pricePerMW),...areas.map(a=>positive(a.buildCostPerMW)?a.buildCostPerMW:0))/100000000)*100000000;
  const plot=(shown,compact=false)=>{
  const frame=compact?360:600,left=compact?18:66,right=frame-(compact?18:40),width=right-left,scale=v=>left+v/max*width;
  const height=100+shown.length*126;
  const kids=[];
  for(const tick of [0,max/2,max]){
    const x=scale(tick);kids.push(s('line',{class:'jp-gridline',x1:x,y1:28,x2:x,y2:height-52}),s('text',{class:'jp-axis',x,y:height-28,'text-anchor':'middle'},million(tick)));
  }
  shown.forEach((area,index)=>{
    const y=62+index*126,own=area.marketId===ctx.row.id,base=area.cases.find(c=>c.key==='base');
    const group=s('g',{'data-area':area.marketId,class:own?'jp-chart-own':'jp-chart-other'});
    group.append(s('text',{class:'jp-area-title',x:left,y:y-20},L(area.name||[area.region,area.region])));
    if(positive(area.buildCostPerMW)){
      group.append(s('rect',{class:'jp-build-cost',x:left,y,width:scale(area.buildCostPerMW)-left,height:19,'data-jpy-value':area.buildCostPerMW}));
      if(positive(base?.pricePerMW)){
        const gap=area.buildCostPerMW-base.pricePerMW;
        if(gap>0)group.append(s('rect',{class:'jp-discount-band',x:scale(base.pricePerMW),y:y-3,width:scale(area.buildCostPerMW)-scale(base.pricePerMW),height:28,'data-discount-jpy':gap}));
      }
    }
    area.cases.forEach((c,i)=>{
      if(!positive(c.pricePerMW))return;
      const x=scale(c.pricePerMW),tickY=y+36+i*16;
      const tooltip=[text(shot.labels[c.key],ctx.values),jpy(c.pricePerMW),target(c.targetReturn),c.returnBasis?L(JP_UI.returnBases[c.returnBasis]||[c.returnBasis,c.returnBasis]):null,L(JP_UI.jpyUnit)].filter(Boolean).join(' · ');
      const point=s('g',{class:'jp-price-tick',tabindex:0,'aria-label':tooltip,'data-case':c.key,'data-jpy-value':c.pricePerMW},
        s('title',{},tooltip),s('line',{x1:x,y1:tickY-10,x2:x,y2:tickY+5}),
        s('text',{class:'jp-tick-name',x:x>right-130?x-7:x+7,y:tickY,'text-anchor':x>right-130?'end':'start'},text(shot.labels[c.key],ctx.values)+' · '+million(c.pricePerMW)));
      for(const event of ['focus','pointerenter','click'])point.addEventListener(event,()=>readout.replaceChildren(h('span',{},tooltip)));
      group.append(point);
    });
    kids.push(group);
  });
  const svg=diagram(fillSummary(ctx.values),frame,height,...kids);
  svg.setAttribute('data-chart','Chart-JP-PRICE');svg.setAttribute('data-axis-currency','JPY');
  return svg;
  };
  const summary=fillSummary(ctx.values);
  const summaries=areas.filter(a=>positive(a.buildCostPerMW)).flatMap(a=>{
    const base=a.cases.find(c=>c.key==='base');
    return positive(base?.pricePerMW)?[note([`${L(a.name)} · ${text(shot.labels.discount,ctx.values)}: ${jpy(a.buildCostPerMW-base.pricePerMW)}`,`${L(a.name)} · ${text(shot.labels.discount,ctx.values)}：${jpy(a.buildCostPerMW-base.pricePerMW)}`])]:[];
  });
  const accessible=table([JP_UI.area,JP_UI.case,shot.labels.purchasePrice,JP_UI.target,JP_UI.returnBasis,shot.labels.buildCost],usable.map(r=>[
    r.name||[r.region,r.region],shot.labels[r.key],jpy(r.pricePerMW),target(r.targetReturn)||missing(),r.returnBasis?JP_UI.returnBases[r.returnBasis]||[r.returnBasis,r.returnBasis]:missing(),jpy(r.buildCostPerMW)||missing(),
  ]),{caption:summary,attrs:{'data-price-table':'true','data-currency':'JPY'}});
  return h('div',{class:'jp-price-chart','data-comparison':String(compare)},tag('model'),note(JP_UI.jpyUnit),
    h('div',{class:'jp-wide'},plot(areas)),h('div',{class:'jp-narrow'},plot([selected],true)),readout,...summaries,
    positive(selected?.buildCostPerMW)?null:h('p',{class:'jp-build-withheld',role:'status'},missing()),accessible,
    finite(selected?.designValueUSD)?h('p',{class:'jp-design-value','data-currency':'USD'},text(shot.labels.designValue,ctx.values),' · ',ctx.values.designValue):null);
}

const fillSummary=values=>[0,1].map(i=>JP_TEXT['Chart accessible summary'][i].replace('{areaName}',Array.isArray(values.areaName)?values.areaName[i]:values.areaName||''));

export const signatureChart=(shot,ctx)=>interactive(shot,ctx,index=>priceChart(shot,ctx,{compare:index===1}));
