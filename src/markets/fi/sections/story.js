import {isoStage} from '../../../experience/story/kit/symbols.js';
/* Signature-scale and reserve-price evidence sections for the immersive story. */
import {h,L,s,fill,words,shared,bound,parts,scene,note,readout,example,narrow,evidence,toggleGroup,stateFor,text} from '../story/ui.js';
import {timeChart} from '../story/chart.js';
import {loadSnapshot} from '../story/data.js';
import {datePair,priceValues} from '../storyBindings.js';
import {FI_STORY_NEED,fastObligationRange} from '../data/storyNeed.js';
import {FI_PRICE_SERIES} from '../data/storyEvidence.js';
import {story} from '../story.js';

const mw=v=>v.toLocaleString('en-US',{maximumFractionDigits:2})+' MW';
function inspector(points,index,label,onChange){
  const range=h('input',{type:'range',min:0,max:points.length-1,step:1,value:index,'aria-label':L(parts('Signature chart axis / definition')[0]),style:'width:100%;margin:0;display:block;'});
  range.oninput=e=>onChange(Number(e.target.value));
  const p=points[index];
  return h('div',{},h('label',{},L(label),range),
    h('dl',{class:'k-lane-terms'},h('dt',{},L(parts('Signature chart axis / definition')[0])),h('dd',{},L(datePair(p.t,{time:true}))),h('dt',{},L(label)),h('dd',{},String(p.v))));
}
export function need(shot,{values,load=loadSnapshot}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{mode:'current',definitions:false,index:-1});
  const root=scene(),holder=h('div',{}),status=readout(),inspect=h('div',{}),definitions=h('div',{});
  let data=null,generation=0;
  const year=FI_STORY_NEED.obligation.year,from=Date.UTC(year,0,1),to=Date.UTC(year+1,0,1);
  const [low,high]=fastObligationRange();
  const point={t:FI_STORY_NEED.connected.period+'-01T00:00:00Z',v:FI_STORY_NEED.connected.mw,label:[values.connectedDate[0]+' · '+values.connectedMW[0],values.connectedDate[1]+' · '+values.connectedMW[1]]};
  const legend=h('ul',{class:'k-key'},['connected','technical','obligations'].map(k=>h('li',{},L(w.label(k)))));
  function draw(){
    if(state.mode==='history'){
      const codes=story.chapters[1].shots[0].controls,keys=['fcrN','fcrDUp','fcrDDown','ffr'],labels=[codes[1],codes[2],codes[3],codes[0]];
      const colors=['#224e40','#a37732','#7b8c9e','#b8cda4'];
      fill(holder,timeChart({title:w.title,desc:shared('Signature chart history mode'),yTitle:parts('Signature chart axis / definition')[1],compact:narrow(),annual:true,
        domain:[Date.UTC(2019,0,1),Date.UTC(2026,0,1)],ticks:FI_STORY_NEED.procurement.filter((_,i)=>!narrow()||i%2===0).map(r=>new Date(Date.UTC(r.year,6,1)).toISOString()),
        traces:keys.map((key,i)=>({id:key,kind:'bar',width:5,dx:(i-1.5)*5,color:colors[i],points:FI_STORY_NEED.procurement.map(r=>({t:new Date(Date.UTC(r.year,6,1)).toISOString(),v:r[key]}))}))}));
      fill(status,note(shared('Signature chart history mode')),h('dl',{class:'k-lane-terms'},FI_STORY_NEED.procurement.flatMap(r=>[
        h('dt',{},String(r.year)),h('dd',{},keys.map((k,i)=>L(labels[i])+': '+mw(r[k])).join(' · '))
      ])));
      fill(inspect);legend.hidden=true;
    }else{
      const points=data?.series||[],index=points.length?Math.max(0,Math.min(points.length-1,state.index<0?points.length-1:state.index)):0;
      fill(holder,timeChart({title:w.title,desc:w.copy,yTitle:parts('Signature chart axis / definition')[1],compact:narrow(),domain:[from,Math.max(to,...points.map(p=>Date.parse(p.t)))],
        traces:points.length?[{id:'network-model-technical-capacity',points,color:'#7b8c9e'}]:[],
        band:{from:new Date(from).toISOString(),to:new Date(to).toISOString(),lo:low,hi:high},point,crossing:true,selected:points[index]}));
      fill(status,h('dl',{class:'k-lane-terms'},
        h('dt',{},L(w.label('connected'))),h('dd',{},L(values.connectedMW)+' · '+L(values.connectedDate)),
        h('dt',{},L(w.label('obligations'))),h('dd',{},L(values.fastObligationMW)),
        h('dt',{},L(w.label('technical'))),h('dd',{},points.length?mw(points.at(-1).v):L(parts('Loading / retry')[3]))));
      if(points.length)fill(inspect,inspector(points,index,parts('Signature chart axis / definition')[1],i=>{state.index=i;save();draw();}));
      else fill(inspect);
      legend.hidden=false;
    }
    definitions.hidden=!state.definitions;
  }
  fill(definitions,note(parts('Signature chart axis / definition')[2]),note(shared('Signature chart storage definition')),note(shared('Signature chart history mode')));
  const controls=toggleGroup({label:w.title,value:state.mode,options:[{value:'current',label:w.control(0)},{value:'history',label:w.control(1)}],onChange:mode=>{state.mode=mode;save();draw();}});
  const defs=toggleGroup({label:w.control(2),multi:true,options:[{value:'definitions',label:w.control(2),pressed:state.definitions}],onChange:(_,pressed)=>{state.definitions=pressed;save();draw();}});
  const thumbnail=isoStage({title:w.title,sky:false,viewBox:[500,240],origin:[215,50],items:[{symbol:'ground',at:[0,0],opts:{w:12,d:8}},{symbol:'battery',at:[1,2]},{symbol:'pcs',at:[5,2]},{symbol:'transformer',at:[7,4]},{symbol:'pylon',at:[10,6]}]});
  thumbnail.setAttribute('style','width:180px;max-width:100%;');
  fill(root,h('div',{class:'k-control-row'},controls,defs),thumbnail,legend,holder,status,inspect,definitions,
    note(shared('Fingrid attribution')),evidence(shot,values));
  draw();
  async function retrieve(reload=false){
    const mine=++generation;
    const result=await load('fi-storage-capacity',{reload});
    if(mine!==generation||root.isConnected===false)return;
    data=result;draw();
    if(!data){const retry=h('button',{type:'button',class:'k-toggle',onclick:()=>retrieve(true)},L(parts('Loading / retry')[2]));status.append(example(),retry);}
  }
  retrieve();
  return root;
}
export function prices(shot,{values,load=loadSnapshot}){
  const w=words(shot,values),{state,save}=stateFor(shot.id,{product:FI_PRICE_SERIES[0].id,index:-1,open:false});
  if(!FI_PRICE_SERIES.some(p=>p.id===state.product))state.product=FI_PRICE_SERIES[0].id;
  const root=scene(),panel=h('div',{}),info=h('div',{}),chart=h('div',{}),inspect=h('div',{});
  const select=h('select',{'aria-label':L(w.control(1)),style:'width:100%;max-width:100%;'},FI_PRICE_SERIES.map(p=>h('option',{value:p.id},L(p.label))));
  select.value=state.product;
  const drawer=h('details',{class:'ix-story-sources',...(state.open?{open:''}:{})},h('summary',{},L(w.control(0))),h('label',{},L(w.control(1)),select),panel);
  let snapshot=null,generation=0;
  const unit=[w.label('price')[0]+' · '+w.label('unit')[0],w.label('price')[1]+' · '+w.label('unit')[1]];
  function draw(){
    if(!snapshot){fill(chart,note(parts('Loading / retry')[0]));fill(info);fill(inspect);return;}
    const product=FI_PRICE_SERIES.find(p=>p.id===state.product),local={...values,...priceValues(snapshot,product)},points=snapshot.series;
    const index=Math.max(0,Math.min(points.length-1,state.index<0?points.length-1:state.index));
    fill(chart,timeChart({title:w.title,desc:bound(shared('Price evidence accessible summary'),local),yTitle:w.label('unit'),compact:narrow(),traces:[{id:product.id,points}],selected:points[index]}));
    // The accessible description uses this selected product and envelope.
    chart.querySelector?.('desc')?.replaceChildren(text(shared('Price evidence accessible summary'),local));
    fill(inspect,inspector(points,index,unit,i=>{state.index=i;save();draw();}));
    const source={id:product.id,title:snapshot.source.name+' · '+L(product.label),url:'https://data.fingrid.fi/en/datasets/'+product.fingridId,locator:String(product.fingridId),checkedOn:story.sources['SRC-FI-32'].checkedOn};
    fill(info,note(shared('Price evidence accessible summary'),local),
      h('p',{class:'k-readout'},L(local.priceFetchedAt)),evidence(shot,local,{label:w.control(2),sources:[source],definition:shared('Price evidence accessible summary')}));
  }
  async function retrieve(reload=false){
    const mine=++generation; snapshot=null;draw();
    const result=await load(state.product,{reload});
    if(mine!==generation||root.isConnected===false)return;
    snapshot=result;
    if(!result){fill(chart,note(parts('Loading / retry')[1]),h('button',{type:'button',class:'k-toggle',onclick:()=>retrieve(true)},L(parts('Loading / retry')[2])));return;}
    draw();
  }
  select.onchange=e=>{state.product=e.target.value;state.index=-1;save();retrieve();};
  drawer.addEventListener('toggle',()=>{state.open=drawer.open;save();if(drawer.open&&!snapshot)retrieve();});
  fill(panel,h('p',{class:'k-readout'},L(w.label('auction'))),chart,inspect,info,h('p',{class:'k-readout'},L(w.label('capture'))));
  const signature=story.chapters[2].shots[0];
  const thumbnail=timeChart({title:words(signature,values).title,desc:words(signature,values).copy,yTitle:parts('Signature chart axis / definition')[1],compact:true,
    domain:[Date.UTC(2026,0,1),Date.UTC(2027,0,1)],band:{from:'2026-01-01T00:00:00Z',to:'2027-01-01T00:00:00Z',lo:fastObligationRange()[0],hi:fastObligationRange()[1]},
    point:{t:FI_STORY_NEED.connected.period+'-01T00:00:00Z',v:FI_STORY_NEED.connected.mw,label:values.connectedDate},crossing:true});
  fill(root,thumbnail,drawer);
  if(state.open)retrieve();
  return root;
}
