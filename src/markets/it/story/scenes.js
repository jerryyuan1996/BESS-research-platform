/* Italy-only composition of the shared kit. Controls own drawing state only. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {fillPair} from '../../../experience/story/contract.js';
import {isoStage} from '../../../experience/story/kit/symbols.js';
import {toggleGroup} from '../../../experience/story/kit/controls.js';
import {s} from '../../../experience/story/kit/svg.js';
import {story} from '../story.js';
import {IT_ZONES,IT_HISTORY,historyValues} from '../storyBindings.js';
import {forkChart} from './chart.js';
import {ITALY_MAP} from './geo.js';

const words=(pair,values)=>L(fillPair(pair,values));
const wrap=(...nodes)=>h('div',{class:'k-scene it-scene'},...nodes);
const labels=(shot,values)=>h('div',{class:'it-labels'},Object.values(shot.labels).map(p=>h('p',{},words(p,values))));
const controls=(shot,values,indexes,change,value=0)=>toggleGroup({label:fillPair(shot.question,values),options:indexes.map(i=>({value:i,label:fillPair(shot.controls[i],values)})),value,onChange:change});
const vocab=(key)=>story.text[key];

function battery(shot,values,{hours=Number(values.playDuration),future=false,time='day',cutaway=false,plant=false}={}){
 return isoStage({title:fillPair(shot.question,values),viewBox:[640,400],origin:[290,40],
  items:[{symbol:'ground',at:[0,0],opts:{w:18,d:13}},
   {symbol:'battery',at:[5,5],opts:{count:Math.max(2,Math.min(6,Math.round(hours))),highlight:true,future},lift:cutaway?1:0},
   {symbol:'pcs',at:[9,5],lift:cutaway?3:0},{symbol:'transformer',at:[12,5],lift:cutaway?3:0},
   {symbol:'controls',at:[5,8],lift:cutaway?5:0},{symbol:plant?'plant':'city',at:[13,9]},
   {symbol:'solarFarm',at:[1,10],opts:{rows:2}}],wires:[{from:[8,6],to:[12,6]}],time});
}

export function italyMap(shot,values,{selected=-1,planned=false,queue=false,futureQueue=false}={}){
 const titleId='it-map-'+shot.id;
 const svg=s('svg',{viewBox:'0 0 600 420',role:'img','aria-labelledby':titleId,class:'it-map'},
  s('title',{id:titleId},words(shot.question,values)),
  ITALY_MAP.map((polygon,i)=>s('g',{'data-zone':IT_ZONES[i][0]},
   s('polygon',{points:polygon,fill:(Array.isArray(selected)?selected.includes(i):selected===i)?'#b7cca5':'#e4e8da',stroke:'#224e40','stroke-width':2}),
   s('text',{x:[265,300,330,375,410,420,175][i],y:[70,120,175,235,295,370,260][i],'text-anchor':'middle',class:'it-map-label'},L(IT_ZONES[i])))));
 if(planned)svg.append(s('path',{d:'M180 230 Q270 135 340 195 M350 200 Q430 185 405 280',fill:'none',stroke:'#9b7d48','stroke-width':3,'stroke-dasharray':'7 5','data-authority':'official-plan'}));
 if(queue)for(let i=0;i<3;i++)svg.append(s('rect',{x:470+i*14,y:265-i*10,width:22,height:30,fill:'#b7cca5',stroke:'#224e40',...(futureQueue?{'stroke-dasharray':'5 3'}:{}),'data-authority':futureQueue?'scenario':'schematic'}));
 return svg;
}

function geography(shot,{values}){
 const holder=h('div'),readout=h('p',{class:'k-readout','aria-live':'polite'});
 const draw=(selected=-1)=>{holder.replaceChildren(italyMap(shot,values,{selected}));readout.textContent=selected<0?words(shot.labels.label2,values):L(IT_ZONES[selected]);};
 draw();
 const zones=toggleGroup({label:shot.controls[0],value:-1,options:IT_ZONES.map((label,value)=>({label,value})),onChange:draw});
 return wrap(controls(shot,values,[0,1],i=>{holder.dataset&&(holder.dataset.layer=i?'corridors':'zones');draw();}),holder,zones,readout,labels(shot,values));
}

function timeline(shot,values,ids){
 const holder=h('div');
 const draw=index=>{
  const node=IT_HISTORY[index],source=story.sources[node.source],local={...values,...historyValues(node)};
  holder.replaceChildren(h('p',{},words(vocab(node.id),local)),h('details',{},
   h('summary',{},words(vocab('Evidence drawer'),local)),
   h('a',{href:source.url,target:'_blank',rel:'noopener noreferrer'},source.title),h('p',{},source.locator),
   h('p',{},words(shot.meaning,values))));
 };
 draw(ids[0]);
 return h('section',{class:'it-timeline'},toggleGroup({label:shot.question,value:ids[0],options:ids.map(value=>({value,label:fillPair(vocab(IT_HISTORY[value].id),{...values,...historyValues(IT_HISTORY[value])})})),onChange:draw}),holder);
}
function history(shot,{values}){
 const holder=h('div');
 const draw=i=>holder.replaceChildren(shot.id==='it-03'&&i===1?italyMap(shot,values,{selected:[2,3,4,5,6]}):battery(shot,values,{plant:shot.id==='it-02',cutaway:i===1}),labels(shot,values));
 draw(0);
 return wrap(controls(shot,values,[0,1,2],draw),holder,timeline(shot,values,shot.id==='it-02'?[0,3]:[2,4]));
}
function tension(shot,{values}){
 const holder=h('div');
 const draw=i=>{holder.replaceChildren(italyMap(shot,values,{queue:true,planned:i===2}),battery(shot,values,{time:i===1?'dusk':'day',future:i===2}));holder.setAttribute('data-teaching',String(i));};
 draw(0);return wrap(controls(shot,values,[0,1,2],draw),holder,labels(shot,values));
}
function credit(shot,{values}){
 const holder=h('div'),zone=h('div');let selected=0;
 const draw=i=>{selected=i;holder.replaceChildren(forkChart(shot,values,{panel:'credit',focus:i}));};
 draw(0);
 const zones=toggleGroup({label:shot.controls[2],value:0,options:IT_ZONES.map((label,value)=>({label,value})),onChange:i=>{zone.textContent=L(IT_ZONES[i]);holder.setAttribute('data-zone',String(i));draw(selected);}});
 return wrap(controls(shot,values,[0,1,3],draw),holder,zones,zone);
}
function duration(shot,{values}){
 const holder=h('div'),readout=h('p',{class:'k-readout','aria-live':'polite'});
 const macse=shot.id==='it-07',preferred=Number(macse?values.mACSEPlayDuration:values.playDuration);
 const available=values.teachingHours||[],choices=available.filter(h=>[2,4,6,8].includes(h)&&h!==preferred);
 let alternative=0;
 const draw=hours=>{holder.replaceChildren(battery(shot,values,{hours,cutaway:true}));holder.setAttribute('data-hours',String(hours));readout.textContent=L(['Example','示例'])+' · '+String(hours)+' h';};
 draw(preferred);
 return wrap(controls(shot,values,macse?[0,1,2]:[0,1],i=>{
  let hours=preferred;
  if(macse)hours=[4,6,8][i];else if(i===1){hours=choices[alternative++%choices.length]||preferred;}
  if(available.includes(hours))draw(hours);
 },macse?1:0),holder,readout,labels(shot,values),h('details',{},h('summary',{},words(shot.controls.at(-1),values)),h('p',{},words(shot.meaning,values))));
}
function payment(shot,{values}){
 const holder=h('div'),area=h('p');
 const draw=i=>{holder.replaceChildren(forkChart(shot,values,{focus:i}));holder.setAttribute('data-route',i?'macse':'capacity');};
 draw(0);
 return wrap(controls(shot,values,[0,1],draw),holder,
  toggleGroup({label:shot.controls[2],value:0,options:IT_ZONES.map((label,value)=>({value,label})),onChange:i=>{area.textContent=L(IT_ZONES[i]);}}),area,
  h('details',{},h('summary',{},words(shot.controls[3],values)),h('p',{},L(vocab('Chart fallback'))),h('p',{},L(vocab('Route switch')))));
}
function term(shot,{values}){
 const holder=h('div'),label=h('p',{class:'k-readout'});
 const draw=i=>{holder.replaceChildren(battery(shot,values,{future:i===1,time:i===1?'dusk':'day'}));holder.setAttribute('data-term',i===1?'after':'during');label.textContent=words(shot.labels['label'+(i===1?2:0)],values)+(i===1?'':' · '+values.securedTenor+' '+L(['years','年']));};
 draw(0);return wrap(controls(shot,values,[0,1],draw),holder,label,labels(shot,values));
}
function comparison(shot,{values}){
 const cards=h('div',{class:'ix-dialog-grid it-design-comparison',style:'--compare-count:2'},
  [0,1].map(i=>h('article',{'data-basis':'design',class:'ix-story-play'},h('h3',{},words(shot.controls[i],values)),h('p',{},words(shot.labels.label1,values)),h('strong',{},i?values.mACSEDesignHold:values.capacityDesignHold),h('p',{},words(shot.labels.label2,values)))));
 const holder=h('div');
 const draw=i=>{holder.replaceChildren(battery(shot,values,{hours:Number(i?values.mACSEPlayDuration:values.playDuration),cutaway:true}));cards.setAttribute('data-focus',String(i));};
 draw(0);return wrap(controls(shot,values,[0,1],draw),holder,cards,h('details',{},h('summary',{},words(shot.controls[2],values)),h('p',{},words(shot.meaning,values))));
}
function risks(shot,{values}){
 const destinations=[['bankable','downside'],['revenue','downside'],['downside'],['execution'],['revenue']];
 return wrap(italyMap(shot,values,{queue:true,planned:true,futureQueue:true}),h('div',{class:'it-risk-cards'},shot.extra.factorCards.map((pair,i)=>h('article',{'data-watch':i===4?'toll':'risk'},
  i<4?h('h3',{},words(shot.controls[i],values)):null,h('p',{},words(pair,values)),
  destinations[i].map(anchor=>h('a',{href:'#'+anchor,onclick:e=>{e.preventDefault();shotHost(shot,anchor);}},words(shot.controls[{bankable:4,revenue:5,execution:6,downside:7}[anchor]],values)))))));
}
/* Follow the shell-owned exit so focus and close behaviour stay on one path. */
function shotHost(shot,anchor){document.querySelector('[data-shot="'+shot.id+'"] .ix-story-exits a[href="#'+anchor+'"]')?.click();}

export const scenes={'it-01':geography,'it-02':history,'it-03':history,'it-04':tension,'it-05':credit,'it-06':duration,'it-07':duration,'it-08':payment,'it-09':term,'it-10':comparison,'it-11':risks};
