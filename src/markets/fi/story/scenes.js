/* Finland layouts and qualitative teaching state, composed from the shared kit.
   No control writes the market row, a case input, the URL or the investment model. */
import {isoStage} from '../../../experience/story/kit/symbols.js';
import {h,L,s,fill,words,shared,parts,scene,note,readout,example,narrow,evidence,toggleGroup,stateFor,diagram,updateMarker,text,bound} from './ui.js';
import {FI_NORDIC_MAP} from './geo.js';
import {FI_HISTORY,FI_RESERVE_PRODUCTS,FI_EVIDENCE} from '../data/storyEvidence.js';
import {historyValues,productValues,datePair,longerTeachingDuration} from '../storyBindings.js';
import {story} from '../story.js';
import {need,prices} from '../sections/story.js';

const station=(title,{count=3,future=false,plant=false}={})=>isoStage({
  title,sky:false,viewBox:[600,290],origin:[230,70],
  items:[
    {symbol:'ground',at:[0,0],opts:{w:14,d:11}},
    {symbol:'battery',at:[1,3],opts:{count,future}},
    {symbol:'pcs',at:[5,3]},{symbol:'transformer',at:[7,5]},
    {symbol:'pylon',at:[12,8]},{symbol:plant?'plant':'industry',at:[9,1]},
    ...(plant?[{symbol:'industry',at:[1,8]}]:[]),
  ],
  wires:[[[7.5,5.5],[12,8]]],
});
const controlRow=(...groups)=>h('div',{class:'k-control-row'},...groups);
const pairNumber=(v,unit='h')=>[String(v)+' '+unit,String(v)+(unit==='h'?'小时':unit==='years'?'年':unit)];

function nordic(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{view:'frequency'});
  const M=FI_NORDIC_MAP,svg=diagram(w.title,...M.viewBox);
  const draw=()=>{
    fill(svg,svg.firstChild,
      s('rect',{x:40,y:20,width:405,height:315,rx:28,fill:'none',stroke:'#9dae99'}),
      M.countries.map(c=>s('polygon',{points:c.polygon,fill:c.key==='finland'?'#b8cda4':'#e6e9dc',stroke:'#224e40','stroke-width':1})),
      M.ac.map(([a,b])=>s('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:state.view==='frequency'?'#224e40':'#9dae99','stroke-width':state.view==='frequency'?4:1})),
      M.dc.map(([a,b])=>s('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:state.view==='trading'?'#a37732':'#c6ceb5','stroke-width':state.view==='trading'?4:1,'stroke-dasharray':'5 4'})),
      M.countries.map(c=>{
        const label=L(w.label(c.key)),chunks=label.includes(' ')?label.split(' '):[label];
        return s('text',{class:'k-label',x:c.at[0],y:c.at[1],'text-anchor':'middle'},chunks.map((part,i)=>s('tspan',{x:c.at[0],dy:i?22:0},part)));
      }));
    svg.setAttribute('data-view',state.view);
  };
  draw();
  return scene(toggleGroup({label:w.title,value:state.view,options:[{value:'frequency',label:w.control(0)},{value:'trading',label:w.control(1)}],onChange:v=>{state.view=v;save();draw();}}),
    svg,note(w.label('boundary')),h('ul',{class:'k-key'},['ac','dc'].map(key=>h('li',{},L(w.label(key))))),note(parts('Diagram / history legend')[0]),evidence(shot,values));
}
function products(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{product:'ffr',view:'purpose'}),panel=h('div',{});
  if(!FI_RESERVE_PRODUCTS.some(p=>p.id===state.product))state.product='ffr';
  const draw=()=>{
    const product=FI_RESERVE_PRODUCTS.find(p=>p.id===state.product),local={...values,...productValues(product)};
    const terms=h('dl',{class:'k-lane-terms'});
    if(state.view==='requirements'){
      for(const [label,key] of [['activation','productActivation'],['support','productSupport'],['direction','productDirection'],['approval','productApproval']])terms.append(h('dt',{},L(w.label(label))),h('dd',{},L(local[key])));
    }else terms.append(h('dt',{},L(product.label)),h('dd',{},text(shot.copy,local)));
    const resources=isoStage({title:w.title,sky:false,viewBox:[600,265],origin:[260,75],items:[{symbol:'ground',at:[0,0],opts:{w:15,d:10}},{symbol:'plant',at:[0,1]},{symbol:'industry',at:[6,1]},{symbol:'battery',at:[9,6],opts:{count:2}}]});
    // A local, wordless reservoir outline distinguishes hydro from thermal plant.
    resources.append(s('path',{'data-hydro':'true',d:'M35,105 h100 l15,70 h-130 z M20,185 q20,-10 40,0 t40,0 t40,0',fill:'#aebfc9',stroke:'#7b8c9e','stroke-width':2}));
    const ladder=diagram(w.title,600,175,FI_RESERVE_PRODUCTS.map((p,i)=>s('g',{'data-response-rung':p.id},s('line',{x1:20+i*10,x2:570,y1:18+i*26,y2:18+i*26,stroke:p.id===state.product?'#224e40':'#c6ceb5','stroke-width':p.id===state.product?4:1}),s('text',{class:'k-label',x:25+i*10,y:14+i*26},L(p.label)))));
    fill(panel,ladder,resources,note(parts('Diagram / history legend')[0]),terms,evidence(shot,local,{ids:product.sources}));
    panel.setAttribute('data-product',state.product);panel.setAttribute('data-view',state.view);
  };draw();
  return scene(toggleGroup({label:w.title,value:state.product,options:FI_RESERVE_PRODUCTS.map((p,i)=>({value:p.id,label:w.control(i)})),onChange:v=>{state.product=v;save();draw();}}),
    toggleGroup({label:w.control(6),value:state.view,options:[{value:'purpose',label:w.control(6)},{value:'requirements',label:w.control(7)}],onChange:v=>{state.view=v;save();draw();}}),panel);
}
function history(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{mode:'history',node:0}),panel=h('div',{}),root=scene();
  const draw=()=>{
    const record=FI_HISTORY[Math.max(0,Math.min(FI_HISTORY.length-1,state.node))];
    const local={...values,...historyValues(record)};
    if(state.mode==='future'){
      const vision={...values,historyNode:datePair(FI_EVIDENCE.vision.origin)};
      fill(panel,station(w.title,{future:true}),note(shot.extra.vision,vision),
        h('p',{class:'k-readout'},L(w.label('plan')),' · FCR · ',L(values.fcrHourlyYear)),
        evidence(shot,vision,{label:w.control(2),ids:['SRC-FI-02','SRC-FI-23']}));
    }else{
      fill(panel,h('ol',{class:'ix-story-timeline'},shot.extra.historyNodes.map((node,i)=>h('li',{class:'ix-node'},
        h('p',{class:'ix-node-title'},text(node.title,{...values,...historyValues(FI_HISTORY[i])})),
        h('button',{type:'button',class:'k-toggle','aria-pressed':String(i===state.node),onclick:()=>{state.node=i;save();draw();}},L(historyValues(FI_HISTORY[i]).historyNode))))),
        note(shared('Non-price source date label'),local),evidence(shot,local,{label:w.control(2),ids:record.sources}));
    }
    panel.setAttribute('data-mode',state.mode);
    updateMarker(root,state.mode==='future'?shot.extra.futureMarker:shot.marker);
  };
  fill(root,toggleGroup({label:w.title,value:state.mode,options:[{value:'history',label:w.control(0)},{value:'future',label:w.control(1)}],onChange:v=>{state.mode=v;save();draw();}}),panel);
  draw();queueMicrotask(()=>updateMarker(root,state.mode==='future'?shot.extra.futureMarker:shot.marker));
  return root;
}
function protectedLoss(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{view:'protection'}),panel=h('div',{});
  const draw=()=>{
    const max=FI_EVIDENCE.ol3.outputMW,bars=[{key:'output',value:max},{key:'netStep',value:FI_EVIDENCE.ol3.netStepMW}];
    fill(panel,station(w.title,{plant:true}),diagram(w.title,600,135,bars.map((bar,i)=>s('rect',{x:20,y:20+i*50,width:bar.value/max*560,height:28,fill:i&&state.view==='protection'?'#224e40':'#9dae99','data-protected-step':i?'true':'false'}))),
      h('dl',{class:'k-lane-terms'},bars.flatMap(bar=>[h('dt',{},L(w.label(bar.key))),h('dd',{},'')])),example());
    panel.setAttribute('data-view',state.view);
  };draw();
  return scene(toggleGroup({label:w.title,value:state.view,options:[{value:'unit',label:w.control(0)},{value:'protection',label:w.control(1)}],onChange:v=>{state.view=v;save();draw();}}),panel,evidence(shot,values));
}
function headroom(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{response:'reset'}),panel=h('div',{});
  const draw=()=>{
    const energy=state.response==='up'?.3:state.response==='down'?.75:.55;
    fill(panel,station(w.title),diagram(w.title,600,140,
      s('rect',{x:20,y:18,width:560*energy,height:25,fill:'#224e40','data-energy':'available'}),
      s('rect',{x:20,y:58,width:560*(1-energy),height:25,fill:'#b8cda4','data-energy':'space'}),
      s('rect',{x:20,y:98,width:360,height:25,fill:'#a37732','data-power':'headroom'})),
      h('ul',{class:'k-key'},['energy','space','headroom'].map(k=>h('li',{},L(w.label(k))))),
      readout(L(w.label('example')),' · ',values.playDuration?' '+L(pairNumber(values.playDuration)):''),example());
    panel.setAttribute('data-response',state.response);
  };draw();
  return scene(toggleGroup({label:w.title,value:state.response,options:['up','down','reset'].map((v,i)=>({value:v,label:w.control(i)})),onChange:v=>{state.response=v;save();draw();}}),panel,evidence(shot,values));
}
function duration(shot,{values,row}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{size:'play'}),longer=longerTeachingDuration(row),panel=h('div',{});
  const draw=()=>{
    const hours=state.size==='longer'&&longer?longer:values.playDuration===null?null:Number(values.playDuration);
    if(hours===null||!Number.isFinite(hours)){fill(panel,note(shared('Missing financial binding')));return;}
    fill(panel,station(w.title,{count:Math.min(6,Math.max(1,hours))}),
      readout(state.size==='longer'?L(w.control(1)):L(w.control(0)),' · ',L(pairNumber(hours)),state.size==='longer'?example():null),
      diagram(w.title,600,125,s('rect',{'data-duration-layer':'power',x:20,y:18,width:260,height:30,fill:'#224e40'}),s('text',{class:'k-label',x:30,y:39},L(words(story.chapters[3].shots[0],values).label('headroom'))),s('rect',{'data-duration-layer':'energy',x:20,y:65,width:Math.min(560,260*hours/Number(values.playDuration)),height:30,fill:'#b8cda4'}),s('text',{class:'k-label',x:30,y:86},L(parts('Battery / station')[6]))),
      h('ul',{class:'k-key'},['energy','capital','use'].map(k=>h('li',{},L(w.label(k))))));
    panel.setAttribute('data-duration',String(hours));
  };draw();
  return scene(toggleGroup({label:w.title,value:state.size,options:[{value:'play',label:w.control(0)},{value:'longer',label:w.control(1)}],onChange:v=>{state.size=v;save();draw();}}),panel,evidence(shot,values));
}
function qualification(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{view:'requirements'}),panel=h('div',{});
  const draw=()=>{
    fill(panel,station(w.title),h('ol',{class:'k-lane'},shot.extra.steps.map(p=>h('li',{},L(p)))),
      state.view==='conflict'?h('div',{},diagram(w.title,600,120,
        s('rect',{x:20,y:20,width:360,height:30,fill:'#224e40'}),s('rect',{x:230,y:55,width:350,height:30,fill:'#a37732'})),
        readout(L(w.label('committed')),' · ',L(w.label('unknown')),example())):note(shot.copy,values));
    panel.setAttribute('data-view',state.view);
  };draw();
  return scene(toggleGroup({label:w.title,value:state.view,options:[{value:'requirements',label:w.control(0)},{value:'conflict',label:w.control(1)}],onChange:v=>{state.view=v;save();draw();}}),panel,evidence(shot,values));
}
function payment(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{lane:'capacity'}),panel=h('div',{});
  const keys=['capacity','energy','trading'];
  const draw=()=>{
    fill(panel,keys.map((key,i)=>{
      const lane=h('section',{class:'k-lanes','data-payment-path':key,...(state.lane!==key?{hidden:''}:{})},
        h('h5',{},L(w.control(i))),
        h('ol',{class:'k-key'},(key==='trading'?[shot.extra.actors[0],w.control(2)]:shot.extra.actors).map((p,index,actors)=>h('li',{},L(p),index<actors.length-1?h('span',{'aria-hidden':'true'},'↔'):null))),
        note(key==='capacity'?w.label('capacityUnit'):w.label('energyUnit')));
      if(key==='energy')lane.append(h('ul',{class:'k-key'},['fcrEnergy','noEnergyFee','restoreEnergy'].map(k=>h('li',{},L(w.label(k))))));
      return lane;
    }));
    panel.setAttribute('data-active-path',state.lane);
  };draw();
  return scene(toggleGroup({label:w.title,value:state.lane,options:keys.map((v,i)=>({value:v,label:w.control(i)})),onChange:v=>{state.lane=v;save();draw();}}),panel,evidence(shot,values));
}
function floor(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{period:'floor'}),panel=h('div',{});
  const draw=()=>{
    const during=state.period==='floor';
    fill(panel,diagram(w.title,600,180,
      during?s('rect',{x:30,y:110,width:400,height:40,fill:'#224e40','data-floor':'minimum'}):null,
      s('rect',{x:30,y:40,width:400,height:during?70:110,fill:'#b8cda4','fill-opacity':'.6','stroke-dasharray':during?undefined:'4 3',stroke:'#224e40','data-market-upside':'true'})),
      readout(L(during?w.label('floor'):w.label('merchant')),during?' · '+L(pairNumber(values.securedTenor,'years')):''),
      note(during?w.label('upside'):w.label('merchant')),note(w.label('unverified')));
    panel.setAttribute('data-period',state.period);
  };draw();
  return scene(toggleGroup({label:w.title,value:state.period,options:[{value:'floor',label:w.control(0)},{value:'merchant',label:w.control(1)}],onChange:v=>{state.period=v;save();draw();}}),panel,evidence(shot,values));
}
function overview(shot,{values}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{factor:0}),panel=h('div',{});
  const draw=()=>{
    const factor=shot.extra.factors[state.factor]||shot.extra.factors[0];
    fill(panel,station(w.title,{future:true}),
      state.factor===2?diagram(w.title,600,150,s('path',{'data-proposed-law':'true',d:'M220,10 h125 l35,35 v95 h-160 z M345,10 v35 h35 M240,70 h110 M240,90 h110 M240,110 h80',fill:'none',stroke:'#9dae99','stroke-width':2,'stroke-dasharray':'5 4'})):null,
      note(factor.affects,values));
    panel.setAttribute('data-factor',factor.id);
  };draw();
  return scene(toggleGroup({label:w.title,value:state.factor,options:shot.extra.factors.map((_,i)=>({value:i,label:w.control(i)})),onChange:v=>{state.factor=v;save();draw();}}),panel,evidence(shot,values));
}
export const scenes={
  'fi-nordic-map':nordic,'fi-products':products,'fi-history':history,
  'fi-protected-loss':protectedLoss,'fi-need':need,'fi-prices':prices,
  'fi-headroom':headroom,'fi-duration':duration,'fi-qualification':qualification,
  'fi-payment':payment,'fi-floor':floor,'fi-overview':overview,
};
