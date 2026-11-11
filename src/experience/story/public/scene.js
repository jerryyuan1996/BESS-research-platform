import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {s,uid} from '../kit/svg.js';
import {plane,box,isoLine,at} from '../kit/iso.js';
import {SYMBOLS} from '../kit/symbols.js';
import {batteryCutaway,detailedPCS,detailedTransformer,detailedBusbar,meterPoint} from '../kit/powerStation.js';
import '../../../styles/story.css';
import './scene.css';

const PARTS=[
  ['battery',['Battery racks','电池机架'],['Modules store energy; usable charge and ageing limit sustained delivery.','模组储存电量；可用荷电量与衰减限制持续交付。']],
  ['pcs',['PCS · DC ↔ AC','PCS · 直流↔交流'],['Power conversion controls charging and discharge. Losses reduce delivered energy.','功率变换控制充放电，损耗减少实际可交付电量。']],
  ['transformer',['Transformer','变压器'],['Voltage is matched to the grid; protection constrains the electrical path.','电压与电网匹配；保护系统约束电气路径。']],
  ['busbar',['Busbar & protection','母线与保护'],['Collection, switching and protection connect the conversion blocks to the grid.','汇集、开关与保护把变流模块连接至电网。']],
  ['connection',['Point of connection','并网点'],['Metering and connection terms determine the permissible import and export.','计量与并网条款决定允许的输入与输出。']],
  ['network',['Local network constraint','本地网络约束'],null],
];
const MODES=[['system',['01 · System','01 · 系统']],['storage',['02 · Plant cutaway','02 · 电站剖面']],['mechanism',['03 · Payment chain','03 · 收入因果']]];
const t=(x,y,text,cls='',anchor='start')=>s('text',{x,y,class:cls,'text-anchor':anchor},L(text));
function wrap(text,max=31){
  const str=L(text);if(/[\u3400-\u9fff]/.test(str))return str.match(/.{1,17}/gu)||[];
  const lines=[];let line='';for(const word of str.split(' ')){if((line+' '+word).length>max&&line){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);return lines;
}
function causal(data){
  const stages=[
    {x:22,label:['Physical need','物理需求'],text:data.constraint},
    {x:340,label:['Participation & obligation','参与及义务'],text:data.payer},
    {x:658,label:['Payment condition','付款条件'],text:data.summary.condition},
  ];
  return s('g',{class:'public-causal'},stages.map((c,i)=>s('g',{},
    s('rect',{x:c.x,y:370,width:280,height:140,rx:8,class:'public-causal-card'}),
    t(c.x+18,397,c.label,'public-causal-title'),
    wrap(c.text).slice(0,4).map((line,j)=>s('text',{x:c.x+18,y:425+j*20,class:'public-causal-copy'},line)),
    i<2?s('path',{d:`M${c.x+286},439 h22 m-8,-6 8,6 -8,6`,class:'public-causal-arrow'}):null)));
}
function network(data){
  const theme=data.summary.theme;
  const kids=[SYMBOLS.city(26,3),SYMBOLS.pylon(23,2),isoLine([[24,8,1],[23,3,2],[27,3,1]],{cls:'public-ac-line'})];
  if(['island','frequency'].includes(theme))kids.push(SYMBOLS.noLink(22,-1,{length:5}),isoLine([[19,-1,.1],[29,-1,.1]],{cls:'public-boundary'}));
  if(['regional','congestion','kyushu','hokkaido','tokyo'].includes(theme)){
    kids.push(SYMBOLS.pylon(19,1),isoLine([[19,1,2],[23,2,2]],{cls:'public-constrained-line'}));
    if(theme==='tokyo')kids.push(box(20,1,.2,1.3,1,1.3,{cls:'public-pcs-cabinet'}));
    if(theme==='hokkaido')kids.push(isoLine([[22,7,.3],[23,7,1.3],[24,7,.3]],{cls:'public-switch'}));
  }
  if(theme==='capacity')kids.push(SYMBOLS.industry(25,9),isoLine([[24,8,1],[26,10,1]],{cls:'public-ac-line'}));
  return s('g',{'data-component':'network',class:'public-equipment'},...kids);
}
function diagram(data,mode,flow,selected){
  const id=uid('public-scene'),title=L(data.constraint);
  const svg=s('svg',{viewBox:'0 0 960 540',class:'public-power-scene','data-market':data.marketId,'data-theme':data.summary.theme,'data-mode':mode,role:'img','aria-labelledby':`${id}-title ${id}-desc`},
    s('title',{id:`${id}-title`},title),s('desc',{id:`${id}-desc`},L(['Schematic cutaway: racks, PCS, transformer, busbar and metered grid connection. The local constraint and payment chain are explained in text below.','示意剖面：机架、PCS、变压器、母线与计量并网点。下方文字解释本地约束与付款链。'])),
    s('rect',{width:960,height:540,rx:10,class:'public-scene-background'}),
    t(24,34,data.constraint,'public-scene-title'),
    t(24,57,['SCHEMATIC · NOT TO SCALE · NO SIMULATED DISPATCH','示意 · 不按比例 · 不模拟调度'],'public-scene-disclosure'));
  const world=s('g',{transform:mode==='storage'?'translate(320,40) scale(1.55)':mode==='mechanism'?'translate(385,160) scale(.7)':'translate(385,190) scale(.83)'});
  world.append(mode==='storage'?plane(5,7,-.05,21,6,{cls:'public-land'}):plane(0,0,-.05,29,16,{cls:'public-land'}));
  // Underground routes first, then the distant network and the device solids.
  world.append(isoLine([[5,11,.06],[25,11,.06]],{cls:'public-cable-trench'}));
  if(mode!=='storage'){
    world.append(SYMBOLS.wind(2,2),SYMBOLS.solarFarm(1,7));
    world.append(network(data));
  }
  world.append(batteryCutaway(6,8),detailedPCS(13,8),detailedTransformer(17,8),detailedBusbar(21,8),meterPoint(24,8));
  world.append(isoLine([[11.8,11.38,.7],[13.5,11.38,.7],[13.5,9.6,.7]],{cls:'public-dc-line'}),
    isoLine([[15.2,9.2,.4],[17.2,9.2,.4]],{cls:'public-ac-line'}),
    isoLine([[18.7,8.9,2.55],[21,8.9,2.5],[23,8.9,2.1],[24.6,8.9,2]],{cls:'public-hv-line'}));
  world.append(SYMBOLS.flow(12,11,{to:[16,11],z:.8,count:3,reverse:flow==='charge'}),SYMBOLS.flow(20,11,{to:[25,11],z:.8,count:3,reverse:flow==='charge'}));
  const markers=[['battery',9,10,3.5],['pcs',14,9,2.8],['transformer',18,9,3],['busbar',21,10,3.9],['connection',25,9,2.5],['network',25,3,6.9]];
  markers.forEach(([key,x,y,z],i)=>{if(mode==='storage'&&key==='network')return;const [px,py]=at(x,y,z);world.append(s('g',{class:'public-part-marker'},s('circle',{cx:px,cy:py,r:11}),s('text',{x:px,y:py+4,'text-anchor':'middle'},String(i+1))));});
  if(selected)world.querySelectorAll('.public-equipment').forEach(n=>{if(n.dataset.component!==selected)n.classList.add('is-muted');else n.classList.add('is-selected');});
  svg.append(world);
  if(mode==='mechanism')svg.append(causal(data));
  else {
    svg.append(t(28,475,mode==='storage'?['Racks → PCS → transformer → protected bus → connection','机架 → PCS → 变压器 → 保护母线 → 并网']:data.payer,'public-local-payment'),t(28,505,flow==='charge'?['CHARGING · energy enters storage','充电 · 电量进入储能']:['DISCHARGING · energy leaves storage','放电 · 电量离开储能'],'public-flow-label'));
    if(mode==='system')svg.append(s('path',{d:'M706,86 L738,86 L748,70 L760,104 L772,80 L786,86 L882,86',class:'public-response-trace'}));
  }
  return svg;
}
export function renderScene(data,initial='system'){
  let mode=initial,flow='discharge',selected=null;
  const root=h('figure',{class:'public-scene','data-local-mechanism':data.marketId});
  const modes=h('div',{class:'public-scene-modes','aria-label':L(['Scene steps','场景步骤'])});
  const view=h('div',{class:'public-scene-viewport',tabindex:'0','aria-label':L(['Scrollable schematic. Use the numbered controls below for full-size explanations.','可滚动示意图。下方编号控件提供正常字号解释。'])});
  const description=h('p',{class:'public-hotspot-description','aria-live':'polite'});
  const parts=h('div',{class:'public-parts','aria-label':L(['Equipment and constraint annotations','设备与约束注释'])});
  const controls=h('div',{class:'public-flow-controls'},['charge','discharge'].map(key=>h('button',{type:'button','data-flow':key,onclick:()=>{flow=key;draw();}},L(key==='charge'?['Charge ←','充电 ←']:['Discharge →','放电 →']))));
  function draw(){
    modes.replaceChildren(...MODES.map(([id,label])=>h('button',{type:'button','data-mode':id,'aria-pressed':String(mode===id),onclick:()=>{mode=id;draw();modes.querySelector(`[data-mode=${id}]`)?.focus({preventScroll:true});}},L(label))));
    view.replaceChildren(diagram(data,mode,flow,selected));
    controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.flow===flow)));
    parts.replaceChildren(...PARTS.map(([id,label],i)=>h('button',{type:'button','data-part':id,'aria-pressed':String(selected===id),onclick:()=>{selected=selected===id?null:id;if(id==='network'&&selected)mode='system';draw();parts.querySelector(`[data-part=${id}]`)?.focus({preventScroll:true});}},`${i+1} · `,L(label))));
    const part=PARTS.find(([id])=>id===selected);
    description.textContent=part?L(part[2]||data.summary.condition):L(['Select a numbered part to focus the layer and read its role. Green: network; blue: AC; amber: DC. Arrows are illustrative.', '点击编号聚焦图层并阅读作用。绿色：电网；蓝色：交流；琥珀色：直流。箭头仅为示意。']);
  }
  draw();root.append(modes,view,h('p',{class:'public-scene-scroll-hint'},L(['Swipe the drawing on smaller screens; all annotations are also available below.','小屏可横向滑动图示；全部注释也可在下方阅读。'])),controls,parts,description,
    h('figcaption',{},L(['Schematic · physical need → qualification → payment. Source records are in this chapter.', '示意图 · 物理需求 → 资格 → 付款。本章附来源记录。'])));
  return root;
}
