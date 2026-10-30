import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money } from '../experience/model.js';
import { monthlyCashSeries } from './monthlyCash.js';
const s=(tag,attrs={},...children)=>{
  const n=document.createElementNS('http://www.w3.org/2000/svg',tag);
  Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));
  children.flat().forEach(c=>n.append(c?.nodeType?c:document.createTextNode(c)));
  return n;
};
const label=(x,y,value,attrs={})=>s('text',{x,y,...attrs},value);
export function monthlyCashChart(t,{from=0,plan='standard'}={}){
  const all=monthlyCashSeries(t.rawCash,t.powerMW),data=all.filter(m=>m.month>=from);
  const box=h('section',{class:'ix-monthly-cash','data-plan':plan,'data-basis':'hold','data-total':all.at(-1)?.cumulative??0},
    h('h4',{},L(['Monthly net cash flow','逐月净现金流'])),
    h('p',{class:'ix-caption'},L(['Whole project · after-tax nominal · all-equity hold','全项目 · 税后名义 · 全股权长持']),' · ',t.currency));
  if(!data.length)return box;
  const w=760,left=82,right=730,top=30,bottom=220,step=(right-left)/data.length;
  const tick=v=>money(v,t.currency).replace(t.currency+' ','');
  const max=Math.max(0,...data.map(d=>d.net)),min=Math.min(0,...data.map(d=>d.net));
  const span=max-min||1,y=v=>bottom-(v-min)/span*(bottom-top),x=i=>left+(i+.5)*step;
  const svg=s('svg',{viewBox:'0 0 760 265',role:'img','aria-label':L(['Monthly net cash flow, from closing. Bars show net receipts or payments.','从交割起的月度净现金流；柱形为当月净收付。'])});
  for(let i=0;i<=4;i++){
    const v=min+span*i/4;
    svg.append(s('line',{x1:left,x2:right,y1:y(v),y2:y(v),class:'ix-grid-line'}),
      label(left-9,y(v)+4,tick(v),{'text-anchor':'end'}));
  }
  const tickStep=data.length>72?48:12;
  const showTick=(d,i)=>i===0||i===data.length-1||(d.month%tickStep===0&&(data.length-1-i)*step>=70);
  data.forEach((d,i)=>{
    if(showTick(d,i))svg.append(label(x(i),242,'T+'+d.month,{'text-anchor':i===data.length-1?'end':'middle'}));
    if(Math.abs(d.net)>.001)svg.append(s('rect',{x:left+i*step+.2,y:Math.min(y(0),y(d.net)),
      width:Math.max(.8,step-.4),height:Math.max(1,Math.abs(y(d.net)-y(0))),fill:d.net>=0?'#315f4c':'#b87643'},
      s('title',{},'T+'+d.month+L(['m','月'])+' · '+money(d.net,t.currency))));
  });
  svg.append(s('line',{x1:left,x2:right,y1:y(0),y2:y(0),stroke:'#68766c'}));
  const cTop=38,cBottom=166,cMax=Math.max(0,...data.map(d=>d.cumulative)),cMin=Math.min(0,...data.map(d=>d.cumulative));
  const cy=v=>cBottom-(v-cMin)/(cMax-cMin||1)*(cBottom-cTop);
  const cumulative=s('svg',{viewBox:'0 0 760 195',role:'img','aria-label':L(['Cumulative project cash flow, with a separate scale','累计项目净现金流，采用独立纵轴'])});
  [cMin,0,cMax].filter((v,i,a)=>a.indexOf(v)===i).forEach(v=>cumulative.append(
    s('line',{x1:left,x2:right,y1:cy(v),y2:cy(v),class:'ix-grid-line'}),
    label(left-9,cy(v)+4,tick(v),{'text-anchor':'end'})));
  cumulative.append(s('polyline',{points:data.map((d,i)=>x(i)+','+cy(d.cumulative)).join(' '),fill:'none',stroke:'#224e40','stroke-width':2.5}));
  data.forEach((d,i)=>{if(showTick(d,i))cumulative.append(label(x(i),188,'T+'+d.month,{'text-anchor':i===data.length-1?'end':'middle'}));});
  const cursor=s('line',{x1:x(0),x2:x(0),y1:top,y2:bottom,class:'ix-cash-cursor'}),
    cursor2=s('line',{x1:x(0),x2:x(0),y1:cTop,y2:cBottom,class:'ix-cash-cursor'});
  svg.append(cursor);cumulative.append(cursor2);
  const readout=h('p',{class:'ix-cash-readout','aria-live':'polite'}),range=h('input',{type:'range',min:0,max:data.length-1,value:0,step:1,'aria-label':L(['Inspect a cash-flow month','选择现金流月份'])});
  function inspect(index){
    const d=data[index],at=x(index);range.value=index;
    for(const c of [cursor,cursor2]){c.setAttribute('x1',at);c.setAttribute('x2',at);}
    readout.replaceChildren(h('strong',{},'T+'+d.month+L(['m','月'])),
      h('span',{},L(['Net ','当月净额 ']),money(d.net,t.currency)),
      h('span',{},L(['Cumulative ','累计净额 ']),money(d.cumulative,t.currency)));
    range.setAttribute('aria-valuetext','T+'+d.month+' · '+money(d.net,t.currency));
  }
  range.addEventListener('input',()=>inspect(Number(range.value)));
  for(const chart of [svg,cumulative])chart.addEventListener('click',e=>{
    const r=chart.getBoundingClientRect(),u=(e.clientX-r.left)/r.width*w;
    inspect(Math.max(0,Math.min(data.length-1,Math.floor((u-left)/step))));
  });
  inspect(0);
  box.append(h('div',{class:'ix-monthly-plot'},svg),
    h('h4',{},L(['Cumulative net cash flow · separate scale','累计净现金流 · 独立纵轴'])),
    h('div',{class:'ix-monthly-plot'},cumulative),range,readout,
    h('p',{class:'ix-caption'},L(['One bucket per month; annual operating cash remains at the model’s year-end settlement date. Blank months mean no modelled payment, not no operating activity. Construction, VAT, tax, reinvestment and final retirement remain included. This view does not change IRR.',
      '每格为一个月；年度经营净现金仍按模型在运营年末结算。空白月份表示模型未安排收付，不表示没有经营活动。已包含建设、增值税、所得税、再投资及期末退役支出；本图不改变IRR。'])));
  const records=h('details',{class:'ix-details ix-monthly-records'},h('summary',{},L(['Exact payment dates and amounts','查看原模型收付日期及金额'])),
    h('div',{class:'ix-table-scroll'},h('table',{class:'ix-table'},h('thead',{},h('tr',{},['T+',['Net cash','净现金'],['Cumulative','累计净现金']].map(v=>h('th',{scope:'col'},Array.isArray(v)?L(v):v)))),
      h('tbody',{},data.filter(d=>d.payments.some(p=>Math.abs(p.amount)>.005)).map(d=>h('tr',{},
        h('th',{scope:'row'},[...new Set(d.payments.filter(p=>Math.abs(p.amount)>.005).map(p=>Number(p.month.toFixed(2))))].join(' / ')+L(['m','月'])),
        h('td',{},money(d.net,t.currency)),h('td',{},money(d.cumulative,t.currency))))))));
  box.append(records);return box;
}
