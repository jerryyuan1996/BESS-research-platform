/* Market-local compositions over the unmodified shared kit. Teaching state
   lives in each returned scene; no control writes to the row or the case. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {fillPair} from '../../../experience/story/contract.js';
import {isoStage} from '../../../experience/story/kit/symbols.js';
import {toggleGroup} from '../../../experience/story/kit/controls.js';
import {s} from '../../../experience/story/kit/svg.js';
import {story} from '../story.js';
import {HISTORY,RECORDS} from './evidence.js';
import {signatureChart} from './chart.js';

const T={event:['Event and source','事件与来源'],meaning:['Why it matters','投资含义'],schematic:['Schematic','示意图'],example:['Example','示例'],model:['Model assumption, not a signed contract','模型假设，并非已签合同'],pending:['Decision pending','待决定']};
const text=(p,values={})=>L(fillPair(p,values));
const labels=(shot,values)=>{
  const pair=shot.labels?.all;if(!pair)return [];
  const split=fillPair(pair,values).map(t=>t.split(' · '));
  return split[0].map((_,i)=>[split[0][i],split[1][i]??split[0][i]]);
};
const scene=(...nodes)=>h('div',{class:'k-scene gb-scene'},...nodes);
const group=(shot,ctx,indices,change,value=0)=>{
  const selected=ctx.teaching?.get(shot.id)??value;
  if(selected!==value)change(selected);
  return toggleGroup({label:fillPair(shot.question,ctx.values),value:selected,options:indices.map(i=>({value:i,label:fillPair(shot.controls[i],ctx.values)})),onChange:v=>{ctx.teaching?.set(shot.id,v);change(v);}});
};
const readout=(...nodes)=>h('p',{class:'k-readout gb-readout','aria-live':'polite'},...nodes);
const badge=pair=>h('span',{class:'gb-badge'},L(pair));

function grid(shot,ctx,{energy=3,cutaway=false,queue=false,focus=false,night=false,battery=true}={}){
  return isoStage({viewBox:[640,350],origin:[320,54],title:fillPair(shot.question,ctx.values),desc:fillPair(shot.meaning||shot.copy,ctx.values),time:night?'night':'day',className:'gb-grid',
    items:[{symbol:'ground',at:[0,0],opts:{w:18,d:14}},
      {symbol:'plant',at:[2,2]},{symbol:'city',at:[12,2]},
      {symbol:'pylon',at:[7,2]},{symbol:'substation',at:[8,5]},
      ...(battery?[{symbol:'battery',at:[5,9],opts:{count:energy,highlight:focus},lift:cutaway?1.7:0},
      {symbol:'pcs',at:[9,9],lift:cutaway?3:0},{symbol:'transformer',at:[12,9],lift:cutaway?3:0}]:[]),
      ...(cutaway?[{symbol:'controls',at:[7,9],lift:5}]:[]),
      ...(queue?[{symbol:'battery',at:[2,12],opts:{count:2,future:true}},{symbol:'battery',at:[6,13],opts:{count:2,future:true}}]:[])],
    wires:[{from:[4,3],to:[8,5]},{from:[8,5],to:[13,3]},{from:[8,5],to:[11,9]}]});
}

function historyDetails(shot,ctx){
  const nodes=HISTORY.filter(n=>n.shots.includes(shot.id));
  if(!nodes.length)return null;
  const records=nodes.flatMap(n=>n.records.map(k=>RECORDS[k]));
  return h('details',{class:'gb-history-details'},h('summary',{},L(T.event)),h('p',{},text(shot.copy,ctx.values)),
    ...records.map(r=>h('p',{},h('a',{href:r.url,target:'_blank',rel:'noopener noreferrer'},story.sources[r.sourceId]?.title||r.sourceId),h('small',{},r.locator))),
    h('h5',{},L(T.meaning)),h('p',{},text(shot.meaning,ctx.values)));
}

function frequency(shot,ctx){
  const holder=h('div'),notes=readout();const lb=labels(shot,ctx.values);
  const draw=k=>{
    const svg=s('svg',{viewBox:'0 0 640 350',role:'img','aria-label':text(shot.question,ctx.values),class:'gb-frequency','data-focus':k},s('title',{},text(shot.question,ctx.values)),s('desc',{},text(shot.copy,ctx.values)));
    // Deliberately schematic outlines. Links represent named neighbours, not
    // a count, route, rating or dispatch flow of actual interconnectors.
    svg.append(s('path',{d:'M285 40L267 65 276 92 255 111 267 144 252 170 270 189 253 221 278 245 313 236 338 256 375 235 351 218 356 194 335 165 329 132 306 112 318 87 302 65Z',class:'gb-island'}),
      s('ellipse',{cx:313,cy:154,rx:99,ry:137,class:'gb-sync-boundary',opacity:k===0?1:.35}),
      s('path',{d:'M105 138L86 166 94 204 125 218 151 194 144 154Z',class:'gb-neighbour'}),
      s('path',{d:'M477 46L489 26 513 38 493 112 474 131 463 107Z',class:'gb-neighbour'}),
      s('path',{d:'M437 255L540 239 591 267 572 316 464 311Z',class:'gb-neighbour'}));
    for(const [a,b] of [[[260,180],[148,180]],[[329,99],[474,87]],[[343,225],[459,273]]]){
      svg.append(s('path',{d:`M${a}L${b}`,class:'gb-dc-link',opacity:k===1?1:.35}),...([a,b].map(([x,y])=>s('rect',{x:x-6,y:y-6,width:12,height:12,class:'gb-converter'}))));
    }
    for(const [x,y,i] of [[300,314,0],[320,30,1],[117,248,3],[495,155,4],[510,339,5]])svg.append(s('text',{x,y,'text-anchor':'middle',class:'gb-map-label'},L(lb[i])));
    holder.replaceChildren(svg);notes.replaceChildren(badge(T.schematic),' ',text(shot.controls[k],ctx.values),' · ',L(lb[k===0?1:2]));
  };
  draw(0);return scene(group(shot,ctx,[0,1],draw),holder,notes,historyDetails(shot,ctx));
}

function trading(shot,ctx){
  const holder=h('div'),cards=h('div',{class:'gb-route-cards'}),lb=labels(shot,ctx.values);
  const draw=k=>{
    holder.replaceChildren(grid(shot,ctx,{focus:k===2,battery:false}));
    cards.replaceChildren(...(k===0?[h('div',{class:'gb-card gb-active'},L(shot.controls[0]))]:lb.map((p,i)=>h('div',{class:'gb-card'+(i===k?' gb-active':''),'data-path':i},h('strong',{},L(p))))));
  };
  draw(1);return scene(group(shot,ctx,[0,1,2],draw,1),holder,cards,historyDetails(shot,ctx));
}

function tender(shot,ctx){
  const holder=h('div'),lb=labels(shot,ctx.values),note=readout();
  const draw=k=>{
    holder.replaceChildren(grid(shot,ctx,{focus:k===0}));
    note.replaceChildren(badge(T.schematic),' ',L(lb[0]),' · ',L(shot.controls[k]));
    holder.setAttribute('data-tender-figures','withheld');holder.setAttribute('data-focus',String(k));
  };
  draw(0);return scene(group(shot,ctx,[0,1],draw),holder,note,historyDetails(shot,ctx));
}

function capacityBars(shot,ctx,hours,focus=1){
  const design=ctx.duration?.cells?.find(c=>c.hours===hours),power=ctx.model?.powerMW;
  const svg=s('svg',{viewBox:'0 0 640 200',role:'img','aria-label':text(shot.question,ctx.values),'data-hours':hours,class:'gb-capacity-bars'},s('title',{},text(shot.question,ctx.values)));
  const lb=labels(shot,ctx.values);
  if(!Number.isFinite(power)||!Number.isFinite(design?.factor))return svg;
  svg.append(s('rect',{x:24,y:37,width:570,height:38,class:'gb-nameplate-bar',opacity:focus===0?1:.4}),s('rect',{x:24,y:111,width:570*design.factor,height:38,class:'gb-counted-bar',opacity:focus===0?.4:1}),
    s('text',{x:24,y:27},L(lb[0]||['Power','功率'])+' · '+power+' MW'),s('text',{x:24,y:177},L(lb[1]||['Counted for capacity','计入容量'])+' · '+Number((power*design.factor).toFixed(2))+' MW'),
    s('text',{x:594,y:27,'text-anchor':'end'},hours+'h · '+(design.factor*100).toFixed(2)+'%'));
  return svg;
}

function capacity(shot,ctx){
  const holder=h('div'),note=readout();
  const draw=k=>{
    const hours=k===2?ctx.duration.longer:ctx.duration.current;
    holder.replaceChildren(capacityBars(shot,ctx,hours,k));
    note.replaceChildren(badge(T.example),' ',L(labels(shot,ctx.values)[2]));
    holder.setAttribute('data-view',String(k));
  };
  draw(1);return scene(group(shot,ctx,[0,1,2],draw,1),holder,note,historyDetails(shot,ctx));
}

function access(shot,ctx){
  const holder=h('div'),paths=h('div',{class:'gb-route-cards'}),lb=labels(shot,ctx.values);
  const draw=k=>{
    holder.replaceChildren(grid(shot,ctx,{focus:k<3}));
    paths.replaceChildren(...shot.controls.slice(0,3).map((p,i)=>h('div',{class:'gb-card'+(i===k?' gb-active':''),'data-unit':i?'energy':'availability'},h('strong',{},L(p)),h('p',{},L(lb[i?2:0])),badge(lb[i?3:1]))));
  };
  draw(0);return scene(group(shot,ctx,[0,1,2,3],draw),holder,paths,readout(L(lb[4])),historyDetails(shot,ctx));
}

function queue(shot,ctx){
  const holder=h('div'),cards=h('div',{class:'gb-route-cards'}),lb=labels(shot,ctx.values);
  const draw=k=>{
    holder.replaceChildren(grid(shot,ctx,{queue:true,focus:k===1}));
    cards.replaceChildren(h('div',{class:'gb-card'},L(lb[0])),...(k===0?[h('div',{class:'gb-card'},L(shot.controls[0]),' · ',L(T.schematic))]:[h('div',{class:'gb-card gb-proposal','data-authority':'official-plan'},L(lb[1]),h('p',{},L(lb[2]))),h('div',{class:'gb-card gb-proposal'+(k===2?' gb-active':''),'data-authority':'official-proposal'},L(shot.controls[2]),h('p',{},L(lb[3])))]));
  };
  draw(1);return scene(group(shot,ctx,[0,1,2],draw,1),holder,cards,historyDetails(shot,ctx));
}

function duration(shot,ctx){
  const holder=h('div'),note=readout(),lb=labels(shot,ctx.values);
  const draw=k=>{
    const hours=[ctx.duration.current,ctx.duration.shorter,ctx.duration.longer][k],count=[3,2,5][k];
    holder.replaceChildren(grid(shot,ctx,{energy:count,cutaway:true,focus:true}));
    holder.setAttribute('data-teaching-hours',String(hours));
    const power=ctx.model.powerMW,energy=Number.isFinite(power)&&Number.isFinite(hours)?power*hours:null;
    note.replaceChildren(badge(T.example),' ',L(lb[0])+': '+(power??'—')+' MW · '+L(lb[2])+': '+(energy??'—')+' MWh · '+hours+'h');
  };
  draw(0);return scene(group(shot,ctx,[0,1,2],draw),holder,note,h('p',{},L(lb[4]),' · ',L(lb[5])));
}

function allocation(shot,ctx){
  const holder=h('div'),note=readout(),power=h('div',{class:'gb-single-power'}),lb=labels(shot,ctx.values);
  const draw=k=>{
    holder.replaceChildren(grid(shot,ctx,{focus:true}));
    note.replaceChildren(L(shot.controls[k]),' · ',L(lb[0]),' · ',L(lb[1]));
    holder.setAttribute('data-allocation',String(k));
    power.replaceChildren(h('span',{class:'gb-allocated'},L(shot.controls[k])),h('span',{class:'gb-committed'},L(lb[0])));
  };
  draw(0);return scene(group(shot,ctx,[0,1,2,3],draw),holder,power,readout(badge(T.example),' ',L(lb[2])),note);
}

function payment(shot,ctx){
  const holder=h('div'),lb=labels(shot,ctx.values);
  const draw=k=>{
    const payer=[lb[0],lb[1],lb[2],lb[4]][k],unit=[lb[5],lb[6],lb[6],lb[7]][k];
    holder.replaceChildren(h('div',{class:'gb-payment-path','data-payment':k},h('strong',{},L(payer)),h('span',{'aria-hidden':'true'},k===1?'↔':'→'),
      ...(k===3?[h('strong',{},L(lb[3])),h('span',{'aria-hidden':'true'},'→')]:[]),h('span',{},L(shot.controls[k])),badge(unit)),
      ...(k===3?[h('div',{class:'gb-term-bar'},text(shot.meaning,ctx.values))]:[]));
  };
  draw(0);return scene(group(shot,ctx,[0,1,2,3],draw),holder);
}

function toll(shot,ctx){
  const holder=h('div'),lb=labels(shot,ctx.values);
  const draw=k=>{
    const svg=s('svg',{viewBox:'0 0 640 210',role:'img','aria-label':text(shot.question,ctx.values),class:'gb-toll-band','data-authority':'model-assumption','data-focus':k},s('title',{},text(shot.question,ctx.values)));
    svg.append(s('rect',{x:24,y:35,width:345,height:54,class:'gb-assumed-toll'}),s('rect',{x:24,y:110,width:450,height:40,class:'gb-assumed-capacity'}),s('path',{d:'M369,63H611 M474,130H611',class:'gb-merchant-tail'}),
      s('text',{x:34,y:67},L(lb[0])),s('text',{x:34,y:137},L(lb[1])),s('text',{x:390,y:40},L(lb[2])),s('text',{x:24,y:190},L(shot.controls[k===1?1:0])));
    holder.replaceChildren(svg,readout(badge(T.model),' ',L(lb[4])));
    if(k===2)holder.append(h('p',{},text(shot.meaning,ctx.values)));
  };
  draw(0);return scene(group(shot,ctx,[0,1,2],draw),holder);
}

function investment(shot,ctx){
  const holder=h('div'),factors=story.vocabulary.find(p=>p[0].startsWith('More batteries can lower'))?.map(s=>s.split(' · '));
  const draw=k=>{holder.replaceChildren(grid(shot,ctx,{queue:true,focus:k===0,night:k===1}));holder.setAttribute('data-factor',String(k));};
  draw(0);
  return scene(group(shot,ctx,[0,1,2,3],draw),holder,h('div',{class:'gb-factor-cards'},...shot.controls.slice(0,4).map((p,i)=>h('div',{class:'gb-card'},h('strong',{},L(p)),h('p',{},factors?L([factors[0][i],factors[1][i]]):text(shot.meaning,ctx.values))))));
}

export function thumbnail(shot,ctx){return grid(shot,ctx,{focus:true});}
export const scenes={
  'gb-00':thumbnail,'gb-01':frequency,'gb-02':trading,'gb-03':tender,'gb-04':capacity,
  'gb-05':signatureChart,'gb-06':access,'gb-07':queue,'gb-08':duration,'gb-09':allocation,
  'gb-10':payment,'gb-11':toll,'gb-12':investment,
};
