/* Calendar-time composition from the shared SVG and axis primitives.
   The shared dayChart is fixed to 48 intraday bins; these records span years. */
import {L} from '../../../app/i18n.js';
import {niceTicks} from '../../../charts/chartUtils.js';
import {s,n2,uid} from '../../../experience/story/kit/svg.js';

export function segments(points,gap=3_600_000){
  const out=[];let run=[];
  for(const p of points){
    if(!Number.isFinite(p.v)||!Number.isFinite(Date.parse(p.t))){if(run.length)out.push(run);run=[];continue;}
    if(run.length&&Date.parse(p.t)-Date.parse(run.at(-1).t)>gap){out.push(run);run=[];}
    run.push(p);
  }
  if(run.length)out.push(run);
  return out;
}
const num=v=>v.toLocaleString('en-US',{maximumFractionDigits:2});
export function timeChart({title,desc,yTitle,traces=[],band,point,selected,domain,ticks,compact=false,crossing=false,annual=false}){
  const W=compact?400:720,H=compact?260:310,left=compact?55:64,right=16,top=18,bottom=48;
  const all=traces.flatMap(t=>t.points||[]).filter(p=>Number.isFinite(p.v)&&Number.isFinite(Date.parse(p.t)));
  const dates=all.map(p=>Date.parse(p.t));
  if(point)dates.push(Date.parse(point.t));
  const first=domain?.[0]??Math.min(...dates),last=domain?.[1]??Math.max(...dates);
  const from=Number.isFinite(first)?first:0,to=Number.isFinite(last)&&last>from?last:from+3_600_000;
  const vals=[0,...all.map(p=>p.v),...(band?[band.lo,band.hi]:[]),...(point?[point.v]:[])];
  const ys=niceTicks(Math.min(...vals),Math.max(1,...vals),4),lo=ys[0],hi=ys.at(-1);
  const x=t=>left+(Date.parse(t)-from)/(to-from)*(W-left-right);
  const y=v=>top+(hi-v)/(hi-lo||1)*(H-top-bottom);
  const id=uid('fi-time'),did=uid('fi-time-desc');
  const xTicks=ticks||Array.from({length:compact?3:5},(_,i)=>new Date(from+(to-from)*i/(compact?2:4)).toISOString());
  const labelDate=t=>new Intl.DateTimeFormat(L(['en-GB','zh-CN']),{...(annual?{}:{month:'short'}),year:'numeric',timeZone:'UTC'}).format(new Date(t));
  const svg=s('svg',{class:'k-chart',viewBox:'0 0 '+W+' '+H,role:'img','aria-labelledby':id+' '+did,'data-calendar-chart':'true'},
    s('title',{id},L(title)),s('desc',{id:did},L(desc||title)),
    ys.map(v=>s('g',{class:'k-tick'},s('line',{class:'k-grid',x1:left,x2:W-right,y1:n2(y(v)),y2:n2(y(v))}),s('text',{x:left-7,y:n2(y(v)+4),'text-anchor':'end'},num(v)))),
    band?s('rect',{'data-measure':'gross-product-commitments',x:n2(x(band.from)),y:n2(y(band.hi)),width:n2(x(band.to)-x(band.from)),height:n2(y(band.lo)-y(band.hi)),fill:'var(--ix-green,#224e40)','fill-opacity':'.2',stroke:'var(--ix-green,#224e40)'}):null,
    traces.flatMap(trace=>{
      if(trace.kind==='bar')return trace.points.map(p=>s('rect',{'data-series':trace.id,x:n2(x(p.t)-(trace.width||16)/2+(trace.dx||0)),y:n2(y(p.v)),width:trace.width||16,height:n2(y(0)-y(p.v)),fill:trace.color||'var(--ix-green,#224e40)'}));
      return segments(trace.points,trace.gap).map(run=>s('path',{'data-series':trace.id,'data-points':run.length,fill:'none',stroke:trace.color||'var(--ix-green,#224e40)','stroke-width':1.7,d:run.map((p,i)=>(i?'L':'M')+n2(x(p.t))+','+n2(y(p.v))).join(' ')}));
    }),
    point?s('g',{'data-connected-observation':'true','data-precision':'early-month'},s('circle',{cx:n2(x(point.t)),cy:n2(y(point.v)),r:5,fill:'var(--ix-green,#224e40)'},s('title',{},L(point.label))),crossing?s('path',{'data-crossing':'left-censored',d:'M'+n2(x(point.t)-8)+','+n2(y(point.v))+' h-20 l6,-4 m-6,4 l6,4',fill:'none',stroke:'var(--ix-green,#224e40)','stroke-width':2}):null):null,
    selected?s('circle',{'data-crosshair':'true',cx:n2(x(selected.t)),cy:n2(y(selected.v)),r:4,fill:'var(--ix-risk,#9c5b40)'}):null,
    s('line',{class:'k-axis',x1:left,x2:W-right,y1:H-bottom,y2:H-bottom}),
    xTicks.map((t,i)=>s('g',{class:'k-tick'},s('line',{x1:n2(x(t)),x2:n2(x(t)),y1:H-bottom,y2:H-bottom+4}),s('text',{x:n2(x(t)),y:H-bottom+20,'text-anchor':i===0?'start':i===xTicks.length-1?'end':'middle'},labelDate(t)))),
    s('text',{class:'k-axis-title',x:13,y:H/2,transform:'rotate(-90 13 '+H/2+')','text-anchor':'middle'},L(yTitle)));
  return svg;
}
