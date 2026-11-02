/* Chart-GB-FILL: observed availability prices and mean MW; no revenue bridge. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {fillPair} from '../../../experience/story/contract.js';
import {s} from '../../../experience/story/kit/svg.js';
import {toggleGroup} from '../../../experience/story/kit/controls.js';
import {loadResponseData} from './data.js';
import {RECORDS} from './evidence.js';

const T={
  date:['Date','日期'],service:['Service','服务'],price:['Clearing price · £/MW/h','出清价格 · 英镑/MW/小时'],mw:['Cleared MW','出清MW'],
  battery:['Of which battery','其中为电池'],other:['Other or unlabelled','其他或未标注'],
  monthly:['Monthly table','月度数据表'],method:['How measured','计算口径'],
  clearing:['Block clearing prices, weighted by cleared MW','按出清MW加权的时段出清价格'],
  accepted:['Accepted-bid fees, weighted by accepted MW','按接受MW加权的投标可用容量费'],
  mean:['Mean cleared MW per EFA block; early daily procurement remains a separate method','每个EFA时段平均出清MW；早期日度采购单列计算口径'],
  example:['Example','示例'],missing:['Quantitative history not yet available','量化历史暂不可用'],loading:['Loading source data…','正在载入来源数据…'],retry:['Could not load data; retry','数据未能载入，重试'],
  platform:['Platform change','平台变更'],observed:['Auction observations, not battery earnings','这是拍卖观测，不是电池收入'],
  attribution:['Supported by National Energy SO Open Data','Supported by National Energy SO Open Data'],
  coverage:['Coverage (UTC)','覆盖期（UTC）'],fetched:['EAC fetched (UTC)','EAC提取时间（UTC）'],partial:['Edge months may be partial.','首末月份可能不完整。'],
  low:['Low frequency','低频'],high:['High frequency','高频'],
};
const COLORS={DCL:'#1d654e',DCH:'#68a98b',DRL:'#b05b32',DRH:'#dca880',DML:'#53548c',DMH:'#9694bd'};
const codeLabel=code=>[code+' · '+T[code.endsWith('L')?'low':'high'][0],code+' · '+T[code.endsWith('L')?'low':'high'][1]];
const number=(v,precision=2)=>Number.isFinite(v)?new Intl.NumberFormat('en-GB',{maximumFractionDigits:precision}).format(v):'—';
const words=(p,values)=>L(fillPair(p,values));
const monthIndex=m=>Number(m.slice(0,4))*12+Number(m.slice(5));

/** Separate paths at missing months, source platform and pricing-method changes. */
export function segments(rows,field,service){
  const groups=new Map();
  for(const r of rows.filter(r=>r.service===service&&Number.isFinite(r[field]))){
    const k=r.platform+'/'+r.basis;const g=groups.get(k)||[];g.push(r);groups.set(k,g);
  }
  const result=[];
  for(const [kind,points] of groups){
    let part=[];
    for(const r of points.sort((a,b)=>a.from.localeCompare(b.from))){
      if(part.length&&monthIndex(r.month)-monthIndex(part.at(-1).month)>1){result.push({kind,rows:part});part=[];}
      part.push(r);
    }
    if(part.length)result.push({kind,rows:part});
  }
  return result;
}

export function chartSvg(shot,{values={},data=null,selected=3}={}){
  const title=fillPair(shot.question,values);
  const svg=s('svg',{viewBox:'0 0 680 460',role:'img','aria-label':L(title),class:'gb-fill-chart','data-chart':'Chart-GB-FILL','data-mode':data?'observed':'example'},s('title',{},L(title)),s('desc',{},L(T.observed)));
  const left=64,right=650,top=48,mid=235,bottom=408;
  svg.append(s('text',{x:left,y:21,class:'gb-axis-title'},L(T.price)),s('text',{x:left,y:258,class:'gb-axis-title'},L(T.mw)));
  if(!data){
    svg.append(s('text',{x:right,y:22,'text-anchor':'end',class:'gb-example-tag'},L(T.example)));
    for(const y of [top,277]){
      svg.append(s('path',{d:`M${left},${y+92}H${right}`,class:'gb-axis'}));
      for(const [i,color] of ['#1d654e','#b05b32','#53548c'].entries()){
        const points=y===top?[[0,20+i*12],[100,45+i*9],[200,90+i*5],[320,112-i*8],[450,98+i*7],[586,110-i*5]]:[[0,110-i*5],[100,85-i*5],[200,62-i*7],[320,38+i*3],[450,24+i*7],[586,25+i*8]];
        svg.append(s('path',{d:points.map(([x,v],j)=>(j?'L':'M')+(left+x)+','+(y+v)).join(' '),fill:'none',stroke:color,'stroke-width':2.5,class:'gb-example-line'}));
      }
    }
    svg.append(s('text',{x:left,y:447},L(T.date)));
    return svg;
  }
  const allowed=selected===3?['DCL','DCH','DRL','DRH','DML','DMH']:[['DCL','DCH'],['DRL','DRH'],['DML','DMH']][selected];
  const rows=data.rows.filter(r=>allowed.includes(r.service));
  const start=Math.min(...data.rows.map(r=>Date.parse(r.from))),end=Math.max(...data.rows.map(r=>Date.parse(r.to)));
  const x=r=>left+(Date.parse(r.from)+(Date.parse(r.to)-Date.parse(r.from))/2-start)/(end-start)*(right-left);
  const prices=rows.map(r=>r.price).filter(Number.isFinite);
  const high=Math.max(...prices,1),low=Math.min(...prices,0)-Math.max(1,high*.08),maxMW=Math.max(...rows.map(r=>r.clearedMW),1)*1.05;
  const yPrice=v=>top+(high-v)/(high-low)*(mid-top-18),yMW=v=>277+(maxMW-v)/maxMW*(bottom-277);
  svg.setAttribute('data-price-min',String(low));
  for(let i=0;i<4;i++){
    const price=low+(high-low)*i/3,mw=maxMW*i/3;
    for(const [value,y] of [[price,yPrice(price)],[mw,yMW(mw)]])svg.append(s('text',{x:left-8,y:y+4,'text-anchor':'end',class:'gb-tick'},number(value,1)),s('path',{d:`M${left},${y}H${right}`,class:'gb-grid-line'}));
  }
  svg.append(s('path',{d:`M${left},${yPrice(0)}H${right}`,class:'gb-zero'}));
  for(const service of allowed){
    for(const [field,y] of [['batteryMW',yMW],['price',yPrice],['clearedMW',yMW]])for(const part of segments(rows,field,service)){
      const points=part.rows.map(r=>[x(r),y(r[field])]);
      svg.append(s('path',{d:points.map(([a,b],i)=>(i?'L':'M')+a.toFixed(2)+','+b.toFixed(2)).join(' '),fill:'none',stroke:COLORS[service],'stroke-width':field==='batteryMW'?7:2.4,opacity:field==='batteryMW'?.22:1,'data-service':service,'data-platform':part.kind,'data-field':field,class:'gb-observed-line'}));
      if(field!=='batteryMW')for(let i=0;i<points.length;i++)svg.append(s('circle',{cx:points[i][0],cy:points[i][1],r:2,fill:COLORS[service],'aria-label':part.rows[i].month+' · '+service+' · '+number(part.rows[i][field])}));
    }
  }
  const platform=data.sources.find(d=>d.datasetId==='gb-eac-response')?.coverage.from;
  const eventX=(Date.parse(platform)-start)/(end-start)*(right-left)+left;
  svg.append(s('path',{d:`M${eventX},${top}V${bottom}`,class:'gb-platform-rule'}),s('text',{x:eventX+4,y:mid+6,class:'gb-tick'},L(T.platform)));
  const events=[['DR',RECORDS.dr.value,56],['DM',RECORDS.dm.value,82],['OBP',RECORDS.obp.value,108]];
  for(const [name,value,labelY] of events){
    const t=Date.parse(value+(value.length===7?'-15T12:00:00Z':'T12:00:00Z'));
    if(t<start||t>end)continue;
    const ex=left+(t-start)/(end-start)*(right-left);
    svg.append(s('path',{d:`M${ex},${top}V${bottom}`,class:'gb-event-rule','data-event':name,'data-date-precision':value.length===7?'month':'day'}),s('text',{x:ex+3,y:labelY,class:'gb-tick'},name+' · '+value));
  }
  const firstYear=new Date(start).getUTCFullYear(),lastYear=new Date(end).getUTCFullYear();
  for(let year=firstYear;year<=lastYear;year++){
    const t=Date.UTC(year,6,1);if(t<start||t>end)continue;
    const tick=left+(t-start)/(end-start)*(right-left);
    svg.append(s('text',{x:tick,y:432,'text-anchor':'middle',class:'gb-tick'},String(year)));
  }
  svg.append(s('text',{x:(left+right)/2,y:453,'text-anchor':'middle',class:'gb-tick'},L(T.date)));
  return svg;
}

function monthlyTable(data,selected){
  const allowed=selected===3?null:[['DCL','DCH'],['DRL','DRH'],['DML','DMH']][selected];
  const rows=data.rows.filter(r=>!allowed||allowed.includes(r.service)).sort((a,b)=>a.month.localeCompare(b.month)||a.service.localeCompare(b.service)||a.platform.localeCompare(b.platform));
  const body=rows.map(r=>h('tr',{'data-service':r.service,'data-platform':r.platform},h('th',{scope:'row'},r.month),
    ...[r.service,number(r.price),number(r.clearedMW),number(r.batteryMW),number(r.otherMW),r.basis==='accepted-bid'?L(T.accepted):L(T.clearing),r.from.slice(0,10)+' — '+r.to.slice(0,10)].map(value=>h('td',{},value))));
  const table=h('table',{},h('caption',{},L(T.observed)),h('thead',{},h('tr',{},...[T.date,T.service,T.price,T.mw,T.battery,T.other,T.method,T.coverage].map(p=>h('th',{scope:'col'},L(p))))),h('tbody',{},...body));
  return h('details',{class:'gb-monthly'},h('summary',{},L(T.monthly)),h('div',{class:'gb-table-scroll',tabindex:'0'},table));
}

export function signatureChart(shot,ctx={}){
  let selected=ctx.teaching?.get(shot.id)??3,data=ctx.data??null;
  const graphic=h('div',{class:'gb-chart-frame'}),table=h('div'),status=h('p',{role:'status',class:'gb-data-status'},L(data?T.observed:T.loading));
  const host=h('div',{class:'k-scene gb-scene gb-signature'});
  const legend=h('div',{class:'gb-chart-legend'});
  const draw=()=>{
    graphic.replaceChildren(chartSvg(shot,{...ctx,data,selected}));
    const codes=selected===3?Object.keys(COLORS):[['DCL','DCH'],['DRL','DRH'],['DML','DMH']][selected];
    legend.replaceChildren(...codes.map(code=>h('span',{},h('i',{style:'background:'+COLORS[code]}),L(codeLabel(code)))),h('span',{},L(T.battery)));
    table.replaceChildren(...(data?[monthlyTable(data,selected)]:[]));
  };
  const method=h('details',{class:'gb-method'},h('summary',{},L(T.method)),h('p',{},L(T.clearing)),h('p',{},L(T.accepted)),h('p',{},L(T.mean)));
  host.append(toggleGroup({label:fillPair(shot.question,ctx.values||{}),value:selected,options:shot.controls.slice(0,4).map((label,value)=>({value,label})),onChange:v=>{selected=v;ctx.teaching?.set(shot.id,v);draw();}}),graphic,legend,status,method,table,h('p',{class:'gb-attribution'},L(T.attribution)));
  draw();
  if(!data){
    const load=async(reload=false)=>{
      status.textContent=L(T.loading);
      const next=await (ctx.loadData||loadResponseData)({reload});
      if(host.isConnected===false)return;
      data=next;draw();
      if(data){const [first,last]=data.sources;status.replaceChildren(L(T.observed),h('br'),L(T.coverage)+' '+first.coverage.from.slice(0,10)+' — '+last.coverage.to.slice(0,10)+' · '+L(T.fetched)+' '+last.fetchedAt.slice(0,10),h('br'),L(T.partial));}
      else status.replaceChildren(h('span',{},L(T.missing)),' ',h('button',{type:'button',class:'ix-text-link',onclick:()=>load(true)},L(T.retry)));
    };
    load();
  }
  return host;
}

export const CHART_TEXT=T;
