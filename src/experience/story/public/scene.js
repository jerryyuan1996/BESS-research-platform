/* ---------------------------------------------------------------------------
   THE EXPLANATORY SCENE of the market-background reading.

   One drawing, three coordinated views of it, and for a market that has them a
   set of step-through sequences:

     System        what is happening on the network, and which constraint binds
     Plant cutaway how the battery responds, in its own equipment
     Payment chain what service that is, who pays under which mechanism, and
                   what stops the payment

   The three share one SCENARIO and one selected component. A scenario is a
   handful of declared facts (the time of day, whether solar is curtailed,
   whether the link is full, whether the battery charges, whether it is
   qualified, awarded and delivers). A sequence step declares a scenario and a
   caption; the reader's switches change the scenario; the drawing and the
   line of text beneath it are both drawn from it, so they cannot disagree.

   WHAT THIS IS NOT. It is a schematic: not to scale, no simulated dispatch,
   no number in it. No switch here reaches the investment case, which this
   module never holds. Nothing moves except as a one-off transition when a
   step or a switch changes the picture, and under reduced motion not at all.

   FOUR LAYERS, never sharing a line style (../kit/layers.js): power as solid
   lines, instructions as thin dotted lines, obligations as a document and a
   dashed link, payments as a token on a rail beneath the plant.

   TWO FRAMES. A wide one for a desktop column and a compact one drawn near
   full size on a phone, so the drawing never scrolls sideways. Words are real
   text beside the drawing in both; the wide frame also labels its objects.
   --------------------------------------------------------------------------- */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {s,uid,n2} from '../kit/svg.js';
import {plane,isoLine,project} from '../kit/iso.js';
import {SYMBOLS,wire} from '../kit/symbols.js';
import {batteryCutaway,detailedPCS,detailedTransformer,detailedBusbar,meterPoint,disconnector} from '../kit/powerStation.js';
import {controlRoom,marketHall,converterStation,congestionMark,curtailedMark,openMark,skyMarks} from '../kit/network.js';
import {signalLine,contractLink,settlementRail,layerLegend} from '../kit/layers.js';
import {sequencePlayer} from '../kit/sequence.js';
import {limitOf,baseScenario,readScenario} from './scenario.js';
import '../../../styles/story.css';
import './scene.css';

/* ---- sequences ------------------------------------------------------------
   Step data is content, one module per market, fetched with that market's
   first scene and kept. A market with no module has the three views and the
   switches, and no step-through. */
const SEQUENCE_LOADERS={
  wa:()=>import('./sequences/wa.js'),nem:()=>import('./sequences/nem.js'),
  gb:()=>import('./sequences/gb.js'),de:()=>import('./sequences/de.js'),
  it:()=>import('./sequences/it.js'),ie:()=>import('./sequences/ie.js'),
  ro:()=>import('./sequences/ro.js'),pl:()=>import('./sequences/pl.js'),
  jp:()=>import('./sequences/jp.js'),pjm:()=>import('./sequences/pjm.js'),
  ercot:()=>import('./sequences/ercot.js'),caiso:()=>import('./sequences/caiso.js'),
  fi:()=>import('./sequences/fi.js'),
};
const sequenceCache=new Map();
export const sequenceGroup=id=>id.startsWith('jp_')?'jp':id;
/** The sequences for a market, or [] when it has none. Never rejects the scene: a failed fetch is no sequences. */
export function loadSequences(marketId){
  const group=sequenceGroup(marketId);
  if(!SEQUENCE_LOADERS[group])return Promise.resolve([]);
  if(!sequenceCache.has(group))sequenceCache.set(group,SEQUENCE_LOADERS[group]().then(m=>m.default).catch(()=>{sequenceCache.delete(group);return null;}));
  return sequenceCache.get(group).then(pack=>pack?pack.for(marketId):[]);
}

/* ---- words ---------------------------------------------------------------- */
const VIEWS=[['system',['01 · System','01 · 系统']],['storage',['02 · Plant cutaway','02 · 电站剖面']],['mechanism',['03 · Payment chain','03 · 收入因果']]];
const PARTS=[
  ['battery',['Battery racks','电池机架'],['Modules store energy; usable charge and ageing limit sustained delivery.','模组储存电量；可用荷电量与衰减限制持续交付。']],
  ['pcs',['PCS · DC ↔ AC','PCS · 直流↔交流'],['Power conversion controls charging and discharge. Losses reduce delivered energy.','功率变换控制充放电，损耗减少实际可交付电量。']],
  ['transformer',['Transformer','变压器'],['Voltage is matched to the grid; protection constrains the electrical path.','电压与电网匹配；保护系统约束电气路径。']],
  ['busbar',['Busbar & protection','母线与保护'],['Collection, switching and protection connect the conversion blocks to the grid.','汇集、开关与保护把变流模块连接至电网。']],
  ['connection',['Point of connection','并网点'],['Metering and connection terms determine the permissible import and export.','计量与并网条款决定允许的输入与输出。']],
  ['network',['Local network constraint','本地网络约束'],null],
  ['control',['Operator control room','调度控制室'],['The system operator instructs the plant through its controls. An instruction is not a payment.','系统运营方通过控制系统向电站下达指令。指令本身并不是付款。']],
];
const LAYERS={
  title:['The four layers of this drawing','本图的四个图层'],
  ac:['Power · alternating current','电力 · 交流'],dc:['Power · direct current','电力 · 直流'],
  signal:['Control signal','控制信号'],contract:['Contract obligation','合同义务'],payment:['Payment, on the settlement rail','付款（结算轨道）'],
};
const GATES=[['Qualified','具备资格'],['Awarded','已中标'],['Delivered','已交付']];
const RAIL_ENDS=[['Service','服务'],['Paid','付款']];

/* The reader's switches. Each changes the scenario and nothing else. */
const SWITCHES={
  time:{label:['Period','时段'],options:[['day',['Midday','正午']],['dusk',['Evening peak','晚高峰']],['night',['Night','夜间']]]},
  network:{label:['Network','电网'],options:[['open',['Has room','有裕度']],['constrained',['Constrained','受约束']]]},
  flow:{label:['Battery','电池'],options:[['charge',['Charge ←','充电 ←']],['discharge',['Discharge →','放电 →']]]},
};
const CONDITIONS=[['qualified',GATES[0]],['awarded',GATES[1]],['delivers',GATES[2]]];

/* Which links cross between systems that cannot simply be joined. */
const CONVERTER=new Set(['tokyo','hokkaido']);

/* ---- frames --------------------------------------------------------------- */
/* tx, ty place world (0, 0); k scales the world; H is the frame's height. The
   payment view keeps its lower part for the settlement rail. */
const FRAMES={
  wide:{W:960,system:{H:500,tx:372,ty:176,k:.9},storage:{H:440,tx:326,ty:18,k:1.5},mechanism:{H:540,tx:385,ty:100,k:.8,rail:462}},
  compact:{W:440,system:{H:350,tx:158,ty:128,k:.5},storage:{H:300,tx:92,ty:44,k:.84},mechanism:{H:400,tx:176,ty:74,k:.44,rail:322}},
};

const line=(points,cls)=>isoLine(points,{cls});
const flow=(from,to,z,reverse=false,count=3)=>SYMBOLS.flow(from[0],from[1],{to,z,count,reverse});

/** The drawing for one view of one scenario. */
function diagram(data,view,state,selected,compact,sequence,live){
  const theme=data.summary.theme,frame=(compact?FRAMES.compact:FRAMES.wide),{W}=frame,{H,tx,ty,k,rail}=frame[view];
  const id=uid('public-scene'),where=limitOf(theme,data.marketId),linked=where==='link',dark=state.time==='night';
  const charging=state.flow==='charge',moving=state.flow!=='idle'&&state.breaker==='closed';
  const ctx={lights:[]};
  /* A world point in frame units: labels and marks are drawn there, unscaled, so they stay readable. */
  const P=(x,y,z=0)=>{const [px,py]=project(x,y,z);return [n2(tx+px*k),n2(ty+py*k)];};
  const world=s('g',{class:'k-world',transform:`translate(${tx},${ty}) scale(${k})`});
  const marks=[],labels=[];
  const label=(at,text,{dx=8,dy=-8,anchor='start'}={})=>{if(compact)return;const [x,y]=P(...at);labels.push(s('g',{class:'k-label-g'},s('circle',{class:'k-label-dot',cx:x,cy:y,r:2}),s('text',{class:'k-label',x:x+dx,y:y+dy,'text-anchor':anchor},L(text))));};

  if(view==='storage')world.append(plane(4.4,6.6,-.05,22.4,6.6,{cls:'public-land'}));
  else world.append(plane(-1.5,-3.6,-.05,32,20.4,{cls:'public-land'}));
  world.append(line([[5,11,.06],[25,11,.06]],'public-cable-trench'));

  /* ---- the system: generation, network, load ---- */
  if(view!=='storage'){
    const curtailed=state.solar==='curtailed'&&!dark;
    /* Generation stands behind and to the left of the plant, where nothing hides it. */
    const farm=SYMBOLS.solarFarm(-1,1.2,{rows:3,w:4.6});
    if(dark||state.solar==='off')farm.classList.add('is-dark');
    if(curtailed)farm.classList.add('is-curtailed');
    world.append(SYMBOLS.wind(5.4,0),theme==='hokkaido'?SYMBOLS.wind(7.8,-1.8):null,farm);
    if(curtailed){marks.push(curtailedMark(...P(1.3,2.9,1.4)));label([1.3,2.9,1.4],['Solar held back','光伏被限发'],{dx:14,dy:4});}
    /* the area's own line: generation, through two towers, to the load centre */
    const G=[9.5,2.5],F=[16,1.5],T=[23,2];
    world.append(SYMBOLS.pylon(...G),SYMBOLS.pylon(...F),SYMBOLS.pylon(...T));
    const tight=state.network==='constrained'&&where==='line';
    world.append(line([[3.6,2.9,.7],[G[0],G[1],4.6]],'public-ac-line'),wire(G,F,{cls:tight?'public-constrained-line':'public-ac-line'}),wire(F,T,{cls:'public-ac-line'}),
      line([[T[0],T[1],4.6],[27,3.4,1.2]],'public-ac-line'),line([[24.6,8.9,2],[T[0],T[1],4.6]],'public-ac-line'));
    if(!dark&&state.solar==='on')world.append(flow([4.8,2.8],[8.6,2.6],2.7));
    if(tight){marks.push(congestionMark(...P(12.7,2,4.2)));label([12.7,2,4.2],['Line at its limit','线路已达上限'],{dx:0,dy:-16,anchor:'middle'});}
    else world.append(flow([10.5,2.3],[15,1.7],4.6));
    world.append(flow([17,1.6],[22,2],4.6));
    world.append(SYMBOLS.city(26,3,{},ctx));
    if(theme==='capacity')world.append(SYMBOLS.industry(25.5,-2.4,{},ctx));
    /* the way out of the area, where there is one */
    if(linked){
      const X=[16,-2.6];
      world.append(SYMBOLS.pylon(...X));
      const full=state.network==='constrained';
      world.append(wire(F,X,{cls:full?'public-constrained-line':'public-ac-line'}),line([[X[0],X[1],4.6],[14.2,-5.2,4.6]],full?'public-constrained-line':'public-ac-line'));
      if(CONVERTER.has(theme)||['gb','ie'].includes(data.marketId))world.append(converterStation(11.6,-2.9));
      if(full){marks.push(congestionMark(...P(16,-.5,4.4)));label([16,-.5,4.4],['Link at its limit','联络线已达上限'],{dx:14,dy:4});}
      else if(!dark)world.append(flow([16,1],[16,-2.2],4.6,false,2));
      label([14.2,-5.2,4.6],theme==='tokyo'?['To the western system','通往西部系统']:['kyushu','hokkaido'].includes(theme)?['To Honshu','通往本州']:['To the neighbouring area','通往相邻区域'],{dx:-8,dy:-6,anchor:'end'});
    }
    if(where==='boundary')world.append(SYMBOLS.noLink(18,-2.4,{length:5}),line([[14,-3.2,.1],[27,-3.2,.1]],'public-boundary'));
    /* who instructs: the operator, in front and to the left */
    world.append(controlRoom(.6,12.6,{},ctx));
    label([2.2,12.6,3.4],['System operator','系统运营方'],{dx:-6,dy:-12,anchor:'middle'});
    if(state.fleet==='crowded'){
      world.append(SYMBOLS.battery(14.6,13.2,{count:2,future:true}),SYMBOLS.battery(19.4,13.2,{count:2,future:true}));
      label([18.3,13.4,1.7],['More batteries, same hours','更多电池，相同时段'],{dx:0,dy:-10,anchor:'middle'});
    }
  }

  /* ---- the plant ---- */
  const lamp=state.breaker==='open'?'off':state.signal==='limit'?'limited':'ok';
  world.append(batteryCutaway(6,8,{soc:state.soc,climate:true,shadow:true}),detailedPCS(13,8,{lamp,shadow:true}),detailedTransformer(17,8,{lamp,shadow:true}),detailedBusbar(21,8),meterPoint(24,8));
  world.append(line([[11.8,11.38,.7],[13.5,11.38,.7],[13.5,9.6,.7]],'public-dc-line'),line([[15.2,9.2,.4],[17.2,9.2,.4]],'public-ac-line'));
  const busbar=world.querySelector('[data-component=busbar]');
  if(state.breaker==='open'){
    world.append(line([[18.7,8.9,2.55],[21,8.9,2.5],[22.4,8.9,2.2]],'public-hv-line'));
    busbar.append(disconnector(22.5,8.75,{open:true}));
    marks.push(openMark(...P(23.3,8.8,3.3)));label([23.3,8.8,3.3],['Connection open','并网开关断开'],{dx:14,dy:4});
  }else{
    world.append(line([[18.7,8.9,2.55],[21,8.9,2.5],[23,8.9,2.1],[24.6,8.9,2]],'public-hv-line'));
    busbar.append(disconnector(22.5,8.75));
  }
  if(moving)world.append(flow([12,11],[16,11],.8,charging),flow([20,11],[25,11],.8,charging));
  if(view!=='storage'&&moving)world.append(flow([24.5,8.4],[23.2,3],3.2,charging,2));

  /* ---- who pays, and the contract between them (payment view) ---- */
  let contract=null;
  if(view==='mechanism'){
    world.append(marketHall(9.5,13.8,{},ctx));
    contract=contractLink(P(11.2,15.1,3.3),P(9.2,10.2,3.5),{signed:state.awarded});
    label([9.4,16.4,1.9],['The payer','付款方'],{dx:-10,dy:2,anchor:'end'});
  }

  /* ---- instructions (dotted, above everything they cross) ---- */
  if(state.signal){
    const kind=state.signal;
    world.append(view==='storage'
      ?signalLine([[9.2,13,1.4],[11.6,12.2,1.4],[13.9,10,1.4]],{kind})
      :signalLine([[3.2,13.1,3.2],[8.8,12.4,1.4],[13.9,10,1.4]],{kind}));
    label(view==='storage'?[9.2,13,1.4]:[8.8,12.4,1.4],{dispatch:['Dispatch instruction','调度指令'],frequency:['Frequency signal','频率信号'],limit:['Charging limit','充电限制']}[kind],{dx:0,dy:16,anchor:'middle'});
  }
  if(state.headroom){
    /* one megawatt, two uses: the solid part is sold as energy, the hatched part is held back */
    const [hx,hy]=P(14.1,8.2,3.3);
    marks.push(s('g',{class:'public-headroom',transform:`translate(${hx},${hy})`},
      s('rect',{class:'public-headroom-sold',x:-30,y:-7,width:36,height:14,rx:2}),s('rect',{class:'public-headroom-held',x:6,y:-7,width:24,height:14,rx:2})));
    label([14.1,8.2,3.3],['Sold as energy | held in reserve','作为电能量出售｜预留'],{dx:0,dy:-14,anchor:'middle'});
  }

  /* ---- numbered parts ---- */
  const spots={battery:[9,10,3.6],pcs:[14,9,2.9],transformer:[18,9,3.1],busbar:[21.4,10,4],connection:[25,9,2.6],
    network:linked?[16,-2.6,6]:where==='boundary'?[20.5,-2.4,1.6]:[16,1.5,6.1],control:[2.2,12.6,2.6]};
  PARTS.forEach(([key],i)=>{
    if(view==='storage'&&(key==='network'||key==='control'))return;
    const [px,py]=P(...spots[key]);
    marks.push(s('g',{class:'public-part-marker'+(selected===key?' is-selected':''),'data-marker':key},s('circle',{cx:px,cy:py,r:11}),s('text',{x:px,y:py+4,'text-anchor':'middle'},String(i+1))));
  });
  if(selected)world.querySelectorAll('.public-equipment').forEach(node=>node.classList.add(node.dataset.component===selected?'is-selected':'is-muted'));

  const tintH=rail?rail-46:H;
  const svg=s('svg',{viewBox:`0 0 ${W} ${H}`,class:'public-power-scene k-stage'+(compact?' is-compact':'')+(live?' is-live':''),'data-market':data.marketId,'data-theme':theme,'data-mode':view,'data-time':state.time,'data-frame':compact?'compact':'wide',
      role:'img','aria-labelledby':`${id}-title ${id}-desc`},
    s('title',{id:`${id}-title`},L(sequence?sequence.title:data.constraint)),
    s('desc',{id:`${id}-desc`},readScenario(state,theme,view,data.marketId).map(([,text])=>L(text)).join(' ')),
    s('rect',{class:'k-sky',width:W,height:tintH,rx:10}),
    view==='storage'?null:skyMarks(W-(compact?34:58),compact?30:44),
    world,
    s('rect',{class:'k-tint',width:W,height:tintH,rx:10}),
    s('g',{class:'k-lights',transform:`translate(${tx},${ty}) scale(${k})`,'aria-hidden':'true'},ctx.lights),
    contract,
    rail?settlementRail({x0:compact?46:150,x1:W-(compact?46:150),y:rail,gates:[state.qualified,state.awarded,state.delivers],
      labels:compact?null:GATES.map((name,i)=>L(sequence?.gates?.[i]||name)),ends:compact?null:RAIL_ENDS.map(L)}):null,
    s('g',{class:'k-labels'},labels),
    s('g',{class:'public-marks'},marks));
  return svg;
}

/** A row of choices: one pressed. `attr` names each button for tests and styles. */
function choice(label,options,value,attr,onPick){
  return h('div',{class:'public-switch',role:'group','aria-label':L(label)},h('span',{class:'public-switch-label'},L(label)),
    ...options.map(([key,text])=>h('button',{type:'button',[attr]:key,'aria-pressed':String(key===value),onclick:()=>onPick(key)},L(text))));
}

/**
 * @param data      the market's public content (content.js)
 * @param initial   the chapter the scene sits in: system | storage | mechanism
 * @param options   { sequences, start } — the market's sequences and the id of
 *                  the one to open on, when a link asked for one
 */
export function renderScene(data,initial='system',{sequences=[],start=null}={}){
  const theme=data.summary.theme;
  /* The sequence a chapter opens on is the first that calls that chapter home. */
  let sequence=sequences.find(q=>q.id===start)||sequences.find(q=>q.home.includes(initial))||sequences[0]||null;
  let view=initial,state=baseScenario(theme,data.marketId),selected=null,player=null;
  const narrow=typeof matchMedia==='function'?matchMedia('(max-width: 720px)'):null;

  const root=h('figure',{class:'public-scene','data-local-mechanism':data.marketId});
  const head=h('header',{class:'public-scene-head'});
  const picker=h('div',{class:'public-sequence-picker',role:'group','aria-label':L(['Explanations for this market','本市场的讲解'])});
  const modes=h('div',{class:'public-scene-modes','aria-label':L(['Scene views','场景视图'])});
  const viewport=h('div',{class:'public-scene-viewport'});
  const playerHost=h('div',{class:'public-scene-stage'});
  const reading=h('ul',{class:'public-scene-reading','aria-live':'polite','aria-label':L(['What the drawing shows now','当前图示内容'])});
  const switches=h('div',{class:'public-scene-switches','aria-label':L(['Change the scenario','改变情景'])});
  const stages=h('ol',{class:'public-scene-stages'});
  const causes=h('div',{class:'public-scene-causes'});
  const parts=h('div',{class:'public-parts','aria-label':L(['Equipment and constraint annotations','设备与约束注释'])});
  const description=h('p',{class:'public-hotspot-description','aria-live':'polite'});

  const set=patch=>{state={...state,...patch};draw(true);};

  /* `live` marks a redraw that changed the picture, which is the only kind that moves anything. */
  function draw(live=false){
    const compact=Boolean(narrow?.matches);
    head.replaceChildren(
      h('p',{class:'public-content-label'},L(['Schematic','示意图'])),
      h('p',{class:'public-scene-title'},L(sequence?sequence.title:data.constraint)),
      h('p',{class:'public-scene-disclosure'},L(['SCHEMATIC · NOT TO SCALE · NO SIMULATED DISPATCH','示意 · 不按比例 · 不模拟调度'])));
    modes.replaceChildren(...VIEWS.map(([key,label])=>h('button',{type:'button','data-mode':key,'aria-pressed':String(view===key),onclick:()=>{view=key;draw(true);modes.querySelector(`[data-mode=${key}]`)?.focus({preventScroll:true});}},L(label))));
    viewport.replaceChildren(diagram(data,view,state,selected,compact,sequence,live));
    reading.replaceChildren(...readScenario(state,theme,view,data.marketId).map(([key,text])=>h('li',{'data-reading':key},L(text))));
    const focused=document.activeElement&&switches.contains(document.activeElement)?[...switches.querySelectorAll('button')].indexOf(document.activeElement):-1;
    switches.replaceChildren(
      h('p',{class:'public-switch-note'},L(['Change the scenario. The drawing and the lines above follow; the investment case does not. A payment condition opens the payment chain.','改变情景：图示与上方说明随之变化；投资方案不受影响。更改付款条件会切换到收入因果视图。'])),
      choice(SWITCHES.time.label,SWITCHES.time.options,state.time,'data-time',key=>set({time:key,solar:key==='day'?(state.solar==='off'?'on':state.solar):'off'})),
      limitOf(theme,data.marketId)==='boundary'?null:choice(SWITCHES.network.label,SWITCHES.network.options,state.network,'data-network',key=>set({network:key})),
      choice(SWITCHES.flow.label,SWITCHES.flow.options,state.flow,'data-flow',key=>set({flow:key,breaker:'closed'})),
      h('div',{class:'public-switch',role:'group','aria-label':L(['Payment conditions','付款条件'])},h('span',{class:'public-switch-label'},L(['Payment conditions','付款条件'])),
        ...CONDITIONS.map(([key,text],i)=>h('button',{type:'button','data-condition':key,'aria-pressed':String(state[key]),onclick:()=>{view='mechanism';set({[key]:!state[key]});}},`${i+1} · `,L(sequence?.gates?.[i]||text)))));
    if(focused>=0)switches.querySelectorAll('button')[focused]?.focus({preventScroll:true});
    /* A contracted sequence names the six stages in the market's own words. */
    const step=player&&sequence?sequence.steps[player.index()]:null;
    stages.replaceChildren(...(sequence?.stages||[]).map((name,i)=>h('li',{...(step?.stage===i?{'aria-current':'step'}:{})},L(name))));
    stages.hidden=!sequence?.stages;
    causes.hidden=view!=='mechanism';
    parts.replaceChildren(...PARTS.map(([key,label],i)=>h('button',{type:'button','data-part':key,'aria-pressed':String(selected===key),onclick:()=>{
      selected=selected===key?null:key;if((key==='network'||key==='control')&&selected&&view==='storage')view='system';draw();parts.querySelector(`[data-part=${key}]`)?.focus({preventScroll:true});}},`${i+1} · `,L(label))));
    const part=PARTS.find(([key])=>key===selected);
    description.textContent=part?L(part[2]||data.summary.condition):L(['Select a numbered part to focus it and read its role.','点击编号聚焦该部件并阅读其作用。']);
    root.dataset.view=view;
  }

  /* The cause chain of the payment view, as text: nothing here is cut short. */
  causes.append(...[[['Physical need','物理需求'],data.constraint],[['Participation & obligation','参与及义务'],data.payer],[['Payment condition','付款条件'],data.summary.condition]]
    .map(([label,text],i)=>h('div',{class:'public-cause'},h('strong',{},`${i+1} · `,L(label)),h('p',{},L(text)))));

  function mount(){
    player?.stop();player=null;
    picker.replaceChildren(...sequences.map(q=>h('button',{type:'button','data-sequence':q.id,'aria-pressed':String(q===sequence),onclick:()=>{sequence=q;mount();picker.querySelector(`[data-sequence="${q.id}"]`)?.focus({preventScroll:true});}},L(q.title))));
    picker.hidden=sequences.length<2;
    if(!sequence){playerHost.replaceChildren(viewport);draw();return;}
    player=sequencePlayer({steps:sequence.steps,stage:viewport,
      onStep:step=>{state={...baseScenario(theme,data.marketId),...(sequence.base||{}),...step.state};view=step.view;draw(true);},
      caption:step=>sourceLine(data,step)});
    playerHost.replaceChildren(player.node);
    draw();
  }
  mount();
  /* The frame follows the width; a scene that has left the page lets go. */
  const reframe=()=>{if(root.isConnected)draw();else narrow.removeEventListener('change',reframe);};
  narrow?.addEventListener?.('change',reframe);

  root.append(head,picker,modes,playerHost,reading,stages,causes,switches,
    layerLegend(Object.fromEntries(['ac','dc','signal','contract','payment'].map(key=>[key,L(LAYERS[key])])),L(LAYERS.title)),
    parts,description,
    h('figcaption',{},L(['Schematic · physical need → qualification → payment. Source records are in this chapter.','示意图 · 物理需求 → 资格 → 付款。本章附来源记录。'])));
  return root;
}

/** The sources a step rests on, by title, from this market's own source records. */
function sourceLine(data,step){
  const cited=(step.sources||[]).map(key=>data.sources?.[key]).filter(source=>source?.url);
  if(!cited.length)return null;
  return h('p',{class:'k-seq-sources'},L(['Sources: ','来源：']),...cited.flatMap((source,i)=>[i?' · ':null,h('a',{href:source.url,target:'_blank',rel:'noopener noreferrer'},source.title)]));
}
