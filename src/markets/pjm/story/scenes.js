/* Market-local compositions over the unchanged story kit. Teaching state is local. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {fillPair} from '../../../experience/story/contract.js';
import {isoStage} from '../../../experience/story/kit/symbols.js';
import {toggleGroup} from '../../../experience/story/kit/controls.js';
import {s} from '../../../experience/story/kit/svg.js';
import {PJM_STORY_VALUES as E} from '../data/storyEvidenceValues.js';
import {datePair,nextPublishedAuction,durationDesigns,watchedEvents} from '../storyBindings.js';
import {FOOTPRINT} from './geo.js';
import {priceCreditChart} from './chart.js';

const T={example:['Example','示例'],schematic:['Schematic','示意'],unknown:['Not published','尚未公布'],scenario:['Scenario','情景'],
  power:['Nameplate power','铭牌功率'],energy:['Nominal energy','标称电量'],credited:['Credited power','计入功率'],rating:['Class rating','类别核定值'],
  shortfall:['Reported shortfall · UCAP MW','报告缺口 · UCAP MW'],basis:['Matched requirement and procurement basis pending','可比需求与采购口径待核'],
  queue:['Accepted storage in the study cycle · not built supply','研究周期接纳的储能 · 并非建成供给'],
  monitor:['Independent Market Monitor attribution','独立市场监察机构归因'],next:['Next published BRA rating','下一次已公布BRA核定值'],
  design:['Design basis · separate from investment hold return','设计口径 · 与投资长持回报分开'],
  value:['Design value per nameplate MW','每铭牌MW的设计价值'],hold:['Design hold return','设计长持回报'],
  indicative:['Indicative (PJM, non-binding)','指示性（PJM，不具约束力）'],
  zones:['DOM / COMED · schematic zone labels','DOM / COMED · 区域示意标签'],
  noAward:['Proposed maximum term; no award or project receipt','拟议最长期限；无授标或项目收入'],
  sources:['Sources and locators','来源与具体位置'],
};
const W=(pair,values)=>L(fillPair(pair,values));
const pct=v=>Number.isFinite(v)?`${Math.round(v*100)}%`:L(T.unknown);
const MW=v=>Number.isFinite(v)?`${Number(v.toFixed(2))} MW`:L(T.unknown);
const note=pair=>h('p',{class:'pjm-note'},L(pair));
const readouts=entries=>h('dl',{class:'pjm-readouts'},entries.flatMap(([name,value])=>[h('dt',{},L(name)),h('dd',{},Array.isArray(value)?L(value):String(value))]));
const labels=(shot,values)=>Object.values(shot.labels||{}).map(pair=>W(pair,values));
const title=(shot,values)=>fillPair(shot.question,values);

export function gridThumbnail(){return h('div',{},isoStage({title:['Example battery and regional grid','示例电池与区域电网'],sky:false,items:[
  {symbol:'ground',at:[0,0]}, {symbol:'plant',at:[2,2]}, {symbol:'substation',at:[9,3]},
  {symbol:'battery',at:[13,4]}, {symbol:'city',at:[7,9]},
],wires:[[[5,4],[10,4]],[[11,5],[14,5]],[[10,5],[9,9]]],origin:[320,80]}),h('p',{class:'pjm-delivery-strip'},L(['June → May','六月 → 五月'])));}

function stage(shot,values,{cold=false,future=false,modules=1}={}){
  return isoStage({title:title(shot,values),desc:T.example,time:cold?'night':'day',sky:false,origin:[320,75],items:[
    {symbol:'ground',at:[0,0]}, {symbol:'plant',at:[2,2],opts:{highlight:cold}},
    {symbol:'substation',at:[8,3]}, {symbol:'city',at:[5,9]},
    ...Array.from({length:modules},(_,i)=>({symbol:'battery',at:[12+(i%2)*3,4+Math.floor(i/2)*3],opts:{future}})),
    {symbol:'pcs',at:[11,9]},{symbol:'transformer',at:[9,8]},
  ],wires:[[[5,4],[9,4]],[[10,4],[13,5]],[[9,5],[7,9]]]});
}

function interactive(shot,ctx,draw){
  let mode=0;
  const host=h('div',{class:'k-scene pjm-scene'}),body=h('div',{});
  const paint=()=>{host.setAttribute('data-state',String(mode));body.replaceChildren(draw(mode));};
  host.append(toggleGroup({label:title(shot,ctx.values),value:mode,
    options:shot.controls.map((pair,value)=>({value,label:fillPair(pair,ctx.values)})),onChange:value=>{mode=value;paint();}}),body);
  paint();return host;
}

function footprint(shot,{values}){
  return interactive(shot,{values},mode=>{
    const svg=s('svg',{viewBox:FOOTPRINT.viewBox,role:'img','aria-label':W(shot.question,values),class:'pjm-map'},
      ...Object.entries(FOOTPRINT.paths).map(([id,d])=>s('path',{d,class:'pjm-state','data-state-id':id})),
      ...Object.entries(FOOTPRINT.labels).map(([id,[x,y]])=>s('text',{x,y,class:'pjm-map-label','text-anchor':'middle'},id)));
    if(mode)for(const [id,zone] of [['VA','DOM'],['IL','COMED']]){
      const [cx,cy]=FOOTPRINT.labels[id];svg.append(s('ellipse',{cx,cy,rx:42,ry:25,class:'pjm-zone'}),s('text',{x:cx,y:cy-30,class:'pjm-map-label','text-anchor':'middle'},zone));
    }
    return h('div',{},svg,note(mode?T.zones:[shot.labels.label0[0],shot.labels.label0[1]]),note([FOOTPRINT.source.treatment,'近似整州着色；不是精确服务区域或潮流边界。']));
  });
}

function history(shot,{values}){
  const nodes=shot.extra.historyNodes;
  let nodeIndex=0,fieldIndex=0;
  const host=h('div',{class:'k-scene pjm-scene'}),body=h('div',{});
  const fieldKeys=['constraint','choice','remains','effect'];
  const paint=()=>{
    const node=nodes[nodeIndex],field=fieldKeys[fieldIndex];
    const rows=Object.values(E.years).filter(y=>y.auctionStatus==='cleared');
    const dates=rows.flatMap(y=>[y.resultsPostedDate,y.deliveryStart,y.deliveryEnd]).filter(Boolean).map(Date.parse);
    const lo=Math.min(...dates),hi=Math.max(...dates),x=date=>30+(Date.parse(date)-lo)/(hi-lo)*560;
    const svg=s('svg',{viewBox:'0 0 640 240',role:'img','aria-label':W(shot.question,values)});
    rows.forEach((row,i)=>{
      const y=35+i*48;
      svg.append(s('line',{x1:x(row.resultsPostedDate),x2:x(row.deliveryStart),y1:y,y2:y,class:'pjm-grid'}),
        s('circle',{cx:x(row.resultsPostedDate),cy:y,r:4,class:'pjm-point'}),
        s('rect',{x:x(row.deliveryStart),y:y-9,width:x(row.deliveryEnd)-x(row.deliveryStart),height:18,class:'pjm-delivery'}),
        s('text',{x:x(row.deliveryStart),y:y+25,class:'pjm-chart-label'},row.deliveryYear));
    });
    body.replaceChildren(svg,h('div',{class:node.style==='plan'?'pjm-history-detail pjm-future':'pjm-history-detail'},
      h('h5',{},W(node.when,values),' · ',W(node.title,values)),
      h('p',{},node[field]?W(node[field],values):L(['No statement in this signed node','签署节点未列此项']))));
  };
  host.append(toggleGroup({label:shot.controls[0],value:nodeIndex,options:nodes.map((node,value)=>({value,label:fillPair([node.when+' · '+node.title[0],node.when+' · '+node.title[1]],values)})),onChange:value=>{nodeIndex=value;paint();}}),
    toggleGroup({label:title(shot,values),value:fieldIndex,options:shot.controls.slice(1).map((label,value)=>({value,label:fillPair(label,values)})),onChange:value=>{fieldIndex=value;paint();}}),body);
  paint();return host;
}

function performance(shot,{values}){
  return interactive(shot,{values},mode=>h('div',{},note(T.example),stage(shot,values,{cold:true}),
    s('svg',{viewBox:'0 0 640 42',role:'img','aria-label':W(shot.labels.label2,values)},
      s('rect',{x:100,y:8,width:440,height:20,class:'pjm-uncredited'}),s('rect',{x:100,y:8,width:[390,210,70][mode],height:20,class:'pjm-delivery'})),
    note(shot.labels[['label0','label1','label2'][mode]])));
}

function credit(shot,{values}){
  const hours=Number(values.playDuration),row=nextPublishedAuction(hours),power=E.teaching.powerMW;
  return interactive(shot,{values},mode=>{
    const rating=row?.auctionRatingByHours[hours];
    const bars=s('svg',{viewBox:'0 0 640 150',role:'img','aria-label':W(shot.question,values)});
    const options=mode===2?Object.keys(row?.auctionRatingByHours||{}).map(Number):[hours];
    options.forEach((h,i)=>{
      const r=row?.auctionRatingByHours[h],y=25+i*30;
      bars.append(s('rect',{x:100,y,width:480,height:18,class:'pjm-uncredited'}));
      if(Number.isFinite(r))bars.append(s('rect',{x:100,y,width:480*(mode===0?1:r),height:18,class:'pjm-delivery'}));
      bars.append(s('text',{x:15,y:y+14,class:'pjm-chart-label'},`${h}h · ${pct(r)}`));
    });
    return h('div',{},note(T.example),stage(shot,values),bars,readouts([[T.power,MW(power)],[T.energy,`${power*hours} MWh`],[T.credited,MW(Number.isFinite(rating)?power*rating:null)]]));
  });
}

function scarcity(shot,{values}){
  return interactive(shot,{values},mode=>{
    const rows=Object.values(E.years).filter(y=>y.shortfallUCAPMW!==null);
    const row=rows[Math.min(mode,rows.length-1)];
    return h('div',{},stage(shot,values,{modules:mode===2?2:1}),mode===2?
      readouts([[T.queue,MW(E.queue.storageNameplateMW)],[T.monitor,pct(E.attribution.monitorReportedShare)]])
      :readouts([[T.shortfall,`${row.deliveryYear} · ${row.shortfallUCAPMW}`],[T.basis,['Qualitative comparison; paired bars withheld','定性比较；不显示成对数值柱形']]]));
  });
}

function collar(shot,{values}){
  return interactive(shot,{values},mode=>h('div',{},note(T.example),
    s('svg',{viewBox:'0 0 640 270',role:'img','aria-label':W(shot.question,values)},
      s('path',{d:'M60,230 L580,230 M60,35 L60,230',class:'pjm-axis'}),
      s('rect',{x:60,y:100,width:520,height:75,class:'pjm-band'}),
      s('path',{d:mode?'M90,215 L190,185 L280,140 L370,85 L470,40':'M90,215 L190,185 L280,140 L370,100 L470,100',class:`pjm-rating${mode?' pjm-plan':''}`}),
      s('text',{x:80,y:95,class:'pjm-chart-label'},W(shot.controls[mode],values))),
    note([labels(shot,values).join(' · '),labels(shot,values).join(' · ')])));
}

function duration(shot,{values}){
  const options=durationDesigns();
  let index=options.findIndex(d=>String(d.hours)===values.playDuration);if(index<0)index=0;
  const host=h('div',{class:'k-scene pjm-scene'}),body=h('div',{});
  const paint=()=>{const d=options[index];body.replaceChildren(note(T.example),stage(shot,values,{modules:Math.max(1,Math.ceil(d.hours/2))}),
    readouts([[T.energy,`${E.teaching.powerMW*d.hours} MWh`],[T.rating,pct(nextPublishedAuction(d.hours)?.auctionRatingByHours[d.hours])],[T.value,d.valueText],[T.hold,d.holdText]]),note(T.design),note(fillPair(shot.labels.label3,values)));};
  host.append(toggleGroup({label:title(shot,values),value:index,options:options.map((d,value)=>({value,label:[`${d.hours}h`,`${d.hours}小时`]})),onChange:value=>{index=value;paint();}}),body);paint();return host;
}

function winter(shot,{values}){
  return interactive(shot,{values},mode=>{
    const hours=Number(values.playDuration),row=mode===0?nextPublishedAuction(hours):E.years[['2030-31','2035-36','2042-43'][mode-1]];
    const rating=mode===0?row?.auctionRatingByHours[hours]:row?.indicativeRatingByHours[hours];
    return h('div',{class:mode?'pjm-future':''},note(T.example),stage(shot,values,{cold:true,future:mode>0}),
      h('div',{class:'pjm-days'},...Array.from({length:E.teaching.winterEventDays},()=>h('span',{},W(shot.labels.label3,values)))),
      readouts([[mode?T.indicative:T.next,row?.deliveryYear||L(T.unknown)],[T.rating,pct(rating)],[T.credited,MW(Number.isFinite(rating)?E.teaching.powerMW*rating:null)]]));
  });
}

function payment(shot,{values}){
  return interactive(shot,{values},mode=>h('div',{},stage(shot,values),
    h('p',{class:'pjm-flow'},W(shot.extra.routes[mode],values)),
    mode===0?readouts([[shot.controls[0],values.securedShare],[T.year||['Secured delivery years','锁定交付年数'],values.securedTenor]]):null));
}

function backstop(shot,{values}){
  return interactive(shot,{values},mode=>h('div',{},note(mode?T.scenario:T.schematic),stage(shot,values,{future:mode>0,modules:mode?3:1}),
    readouts([[shot.labels.label0,values.acceptedDate],[shot.labels.label1,values.backstopDate]]),
    mode?h('div',{class:'pjm-commitment pjm-plan'},W(shot.labels.label3,values),' · ',L(T.noAward)):null));
}

function closing(shot,{values}){
  return interactive(shot,{values},mode=>h('div',{},gridThumbnail(),
    h('p',{},W(shot.extra.factors[Math.min(mode,shot.extra.factors.length-1)].affects,values)),
    h('ul',{},watchedEvents().map(event=>h('li',{},L(event.label),' · ',L(datePair(event.expected)))))));
}

export const scenes={
  'pjm-00':()=>gridThumbnail(),'pjm-01':footprint,'pjm-02':history,'pjm-03':performance,
  'pjm-04':credit,'pjm-05':scarcity,'pjm-06':collar,'pjm-07':priceCreditChart,'pjm-08':duration,
  'pjm-09':winter,'pjm-10':payment,'pjm-11':backstop,'pjm-12':closing,
};
