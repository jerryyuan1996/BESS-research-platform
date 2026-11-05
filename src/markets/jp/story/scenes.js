/* One local composition per signed shot. Geographic marks are area-level
   schematics; station cutaways never identify a geographic site. */
import {JP_STORY_VALUES as V} from '../data/storyEvidenceValues.js';
import {JP_AREAS,JP_FREQUENCY_BAND} from './geo.js';
import {SHARED_SHOTS,JP_TEXT,JP_TIMELINE} from '../story.js';
import {datePair,chartRows} from '../storyBindings.js';
import {isoStage} from '../../../experience/story/kit/symbols.js';
import {signatureChart} from './chart.js';
import {h,L,s,uid,text,label,note,tag,panel,diagram,hatch,station,interactive,table,JP_UI} from './ui.js';

const regionOf=ctx=>ctx.row.id.slice(3);
const n=V.national;
const line=(x1,y1,x2,y2,cls='jp-arrow')=>s('line',{x1,y1,x2,y2,class:cls});
const svgLabel=(pair,values,x,y,attrs={})=>s('text',{x,y,...attrs},text(pair,values));
const rect=(x,y,width,height,cls='jp-solid',attrs={})=>s('rect',{x,y,width,height,rx:2,class:cls,...attrs});

function mapDrawing(ctx,{band=true,night=false,planned=false,controlled=false,flow=false,muted=false}={}){
  const region=regionOf(ctx),values=ctx.values,hatching=hatch();
  const kids=[hatching.node];
  for(const area of JP_AREAS)kids.push(s('path',{d:area.path,class:`jp-map-area${area.east?' jp-map-east':''}${area.id===region?' jp-map-own':''}`,'data-region':area.id}));
  const centers=Object.fromEntries(JP_AREAS.map(a=>[a.id,a.center]));
  for(const [a,b] of [['hokkaido','tohoku'],['tohoku','tokyo'],['tokyo','chubu'],['chubu','kansai'],['chubu','hokuriku'],['kansai','chugoku'],['kansai','shikoku'],['chugoku','kyushu']])kids.push(line(...centers[a],...centers[b],'jp-map-link'));
  if(planned){const [x,y]=centers[region];kids.push(s('path',{d:`M${x-20},${y+8}Q${x+40},${y-48} ${x+62},${y+4}`,class:'jp-plan','data-official-plan':'true'}));}
  if(band){
    kids.push(s('polygon',{points:JP_FREQUENCY_BAND.map(p=>p.join(',')).join(' '),class:'jp-frequency-band','data-frequency-band':'approximate'}));
    kids.push(svgLabel(JP_UI.frequencyBand,values,160,392,{class:'jp-band-label'}));
    const [cx,cy]=centers.chubu;
    kids.push(line(cx-5,cy-9,cx-5,cy+9),line(cx+5,cy-9,cx+5,cy+9),svgLabel(JP_TEXT.Map.map(s=>s.split(' · ')[3]),values,cx+15,cy+22));
    kids.push(svgLabel(SHARED_SHOTS['jp-01'].labels.east,values,350,78),svgLabel(SHARED_SHOTS['jp-01'].labels.west,values,170,330));
  }
  if(controlled){
    const area=JP_AREAS.find(a=>a.id==='hokkaido'),clip=uid('jp-system-area');
    kids.push(s('defs',{},s('clipPath',{id:clip},s('path',{d:area.path}))),s('g',{'clip-path':`url(#${clip})`,'data-control-areas':'schematic'},
      rect(area.center[0]-44,area.center[1]-38,85,28,'',{'fill':`url(#${hatching.id})`}),rect(area.center[0]-35,area.center[1],80,24,'',{'fill':`url(#${hatching.id})`})));
  }
  if(flow){const [a,b]=[centers.kyushu,centers.chugoku];kids.push(s('path',{d:`M${a[0]},${a[1]}Q${a[0]+35},${b[1]+12} ${b[0]},${b[1]}`,class:'jp-arrow','stroke-width':5}));}
  if(night)kids.push(rect(0,0,600,420,'jp-night-overlay',{'fill':'var(--ix-ink)','opacity':.19}));
  const svg=diagram(values.areaName||JP_TEXT.Map.map(s=>s.split(' · ')[0]),600,420,...kids);
  /* Crop only unused horizontal frame space; every retained source ring stays
     inside the portrait viewport. This keeps map text legible on phones. */
  svg.setAttribute('viewBox','140 0 320 420');svg.setAttribute('class','jp-drawing k-chart jp-map');
  svg.setAttribute('data-map','prefecture-groups');if(muted)svg.setAttribute('opacity','.35');return svg;
}

export function openingThumbnail(ctx){
  return h('div',{class:'jp-opening'},mapDrawing(ctx,{band:false}),tag('schematic'),note(SHARED_SHOTS['jp-01'].caption,ctx.values),note(JP_TEXT['Area switch note'],ctx.values));
}

const opening=(shot,ctx)=>h('div',{class:'jp-scene k-scene','data-scene':shot.id},openingThumbnail(ctx));

function frequency(shot,ctx){
  return interactive(shot,ctx,index=>[
    tag('schematic'),mapDrawing(ctx,{muted:index===1}),
    index===1?panel(shot.controls[1],station(shot,ctx.values,{items:[{symbol:'plant',at:[-4,3]}]}),
      note(shot.labels.tariff,ctx.values),note(shot.labels.recovered,ctx.values))
      :h('ul',{class:'k-key'},['east','west','converters','links'].map(key=>h('li',{},label(shot,key,ctx.values)))),
  ]);
}

function outages(shot,ctx){
  return interactive(shot,ctx,index=>{
    const reduced=Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    const cells=Array.from({length:24},(_,i)=>rect(70+(i%6)*71,55+Math.floor(i/6)*38,55,24,index&&i%3!==1?`jp-outage-off${reduced?'':' jp-rotate'}`:'jp-pale'));
    return [tag('observed'),mapDrawing(ctx,{night:true}),diagram(text(shot.question,ctx.values),600,265,...cells,
      svgLabel(shot.labels.outages,ctx.values,70,235)),note(shot.controls[index],ctx.values),
      reduced?note(JP_TEXT['Reduced motion']):null,note(shot.labels.converters,ctx.values)];
  });
}

function timelineDate(node,index,values){
  if(index===2)return [0,1].map(i=>text([values.reformStep1[i],values.reformStep1[i]])+'–'+text([values.reformStep3[i],values.reformStep3[i]]));
  if(index===3)return [`FY${n.capacityMarketYear} · FY${n.ltdaYear}`,`${n.capacityMarketYear}财年 · ${n.ltdaYear}财年`];
  if(node.region==='tokyo')return datePair(V.regional.tokyo.studyCapDate);
  const raw=values[node.dateToken];return Array.isArray(raw)?raw:[raw,raw];
}

function reform(shot,ctx){
  return interactive(shot,ctx,index=>{
    const layers=['coordinator','retailers','grids'];
    const boxes=layers.map((key,i)=>rect(58+i*158,42,132,66,i===index?'jp-solid':'jp-muted'));
    const svg=diagram(text(shot.question,ctx.values),600,190,...layers.map((key,i)=>s('g',{'data-reform-layer':key},boxes[i],svgLabel(shot.labels[key],ctx.values,66+i*158,142))));
    const details=h('dl'),buttons=[];
    const selected=2;
    const choose=i=>{
      const node=JP_TIMELINE[i];
      buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));
      details.replaceChildren(...Object.entries(node.fields).flatMap(([key,pair])=>[h('dt',{},L(JP_UI.timelineFields[key])),h('dd',{},text(pair,ctx.values))]));
      const layer=i<2?0:i===2?1:2;
      boxes.forEach((box,j)=>box.setAttribute('class',j===layer?'jp-solid':'jp-muted'));
      svg.setAttribute('data-selected-node',i);
    };
    const nodes=JP_TIMELINE.map((node,i)=>{
      const button=h('button',{type:'button',class:'jp-node-pick','aria-pressed':String(i===selected),onclick:()=>choose(i)},L(timelineDate(node,i,ctx.values)));
      buttons.push(button);
      return h('section',{class:`jp-node${node.region===regionOf(ctx)?' jp-node-own':node.region?' jp-node-other':''}${node.style==='planned'?' jp-node-plan':''}`,'data-timeline-region':node.region||'national'},button,node.style==='planned'?tag('plan'):null);
    });
    choose(selected);
    /* The era controls choose a reform layer; a node changes the same one
       layer and its exact signed fields, retaining focus on its own button. */
    boxes.forEach((box,j)=>box.setAttribute('class',j===index?'jp-solid':'jp-muted'));
    return [svg,note(shot.controls[3],ctx.values),h('div',{class:'jp-timeline'},nodes),h('div',{class:'jp-node'},details)];
  },{options:shot.controls.slice(0,3)});
}

function payback(shot,ctx){
  return interactive(shot,ctx,index=>{
    const y=[35,89,143,197],kids=[];
    kids.push(rect(150,y[0],360,20,'jp-outline'),svgLabel(shot.labels.lowCarbon,ctx.values,18,y[0]+15));
    for(let i=0;i<8;i++)kids.push(rect(150+i*43,y[1],14+(i%3)*9,20,index===0?'jp-solid':'jp-muted'));
    kids.push(rect(150,y[2],42,20,index===1?'jp-solid':'jp-muted'),rect(150,y[3],360,20,index===2?'jp-solid':'jp-muted'));
    shot.controls.forEach((pair,i)=>kids.push(svgLabel(pair,ctx.values,18,y[i+1]+15)));
    return [tag('schematic'),diagram(text(shot.question,ctx.values),600,255,...kids),note(index===1?shot.labels.annual:shot.labels.longTerm,ctx.values)];
  });
}

function clauses(shot,ctx){
  return interactive(shot,ctx,index=>{
    const v=ctx.values,readouts=[['awardTerm',shot.controls[0]],['obligationHours',shot.labels.continuous],['clawbackShare',shot.labels.returned],[null,shot.labels.ceiling]];
    const [token,title]=readouts[index];
    const visual=diagram(text(title,v),600,115,
      rect(70,35,index===1?360:430,24,'jp-pale'),index===2?rect(70,35,387,24,'jp-solid'):null,
      index===3?line(500,15,500,90):null,svgLabel(title,v,70,99));
    return [station(shot,v),visual,h('p',{class:'jp-readout'},text(title,v),token?' · '+text(['{'+token+'}','{'+token+'}'],v):null,
      token==='awardTerm'?' '+L(JP_UI.unitNames.years):token==='obligationHours'?' '+L(JP_UI.unitNames.hours):null)];
  });
}

function queue(shot,ctx){
  return interactive(shot,ctx,index=>{
    const bids=Array.from({length:6},(_,i)=>({id:i,certified:i%2===0}));
    const order=index===0?[...bids.filter(b=>b.certified),...bids.filter(b=>!b.certified)]:bids;
    const draw=vertical=>{
      const blocks=order.map((bid,i)=>{
        const x=vertical?90:38+i*81,y=vertical?70+i*65:90;
        return s('g',{'data-certified':String(bid.certified),'data-bid-order':bid.id},rect(x,y,60,39,i<4?'jp-pale':'jp-muted'),bid.certified?s('circle',{cx:x+30,cy:y+18,r:6,class:'jp-solid'}):null);
      });
      return diagram(text(shot.question,ctx.values),vertical?320:600,vertical?510:245,
        ...blocks,vertical?line(65,324,180,324):line(362,57,362,158),
        s('line',vertical?{x1:65,y1:470,x2:250,y2:470,class:'jp-plan','data-official-plan':'true'}:{x1:492,y1:30,x2:492,y2:200,class:'jp-plan','data-official-plan':'true'}),
        svgLabel(shot.labels.pool,ctx.values,vertical?20:45,vertical?35:48),svgLabel(shot.labels.bidClose,ctx.values,vertical?20:405,vertical?500:218));
    };
    return [tag('schematic'),h('div',{class:'jp-wide'},draw(false)),h('div',{class:'jp-narrow'},draw(true)),
      note(['{lithiumIonPool} · {nextRound}','{lithiumIonPool} · {nextRound}'],ctx.values),note(['{bidCloseDate}','{bidCloseDate}'],ctx.values),
      h('ul',{class:'k-key'},['certified','other'].map(key=>h('li',{},label(shot,key,ctx.values))))];
  });
}

/** Teaching path, computed only from the bound model's duration/fade/term. */
export function fadeSeries({hours,floor,years,fade}){
  if(![hours,floor,years,fade].every(Number.isFinite)||hours<=0||floor<=0||years<1||fade<0||fade>=1)return [];
  return Array.from({length:years},(_,i)=>({year:i+1,hours:hours*(1-fade)**i}));
}

function fade(shot,ctx){
  return interactive(shot,ctx,index=>{
    const floor=Number(ctx.values.obligationHours),installed=Number(ctx.values.playDuration),years=Number(ctx.values.awardTerm);
    const rate=ctx.row.market.comparison.economics.degr/100,hours=index===0?floor:installed;
    const series=fadeSeries({hours,floor,years,fade:rate});
    if(!series.length)return note(JP_TEXT['Missing financial binding']);
    const x=t=>56+(t-1)/Math.max(1,years-1)*470,y=h=>220-h/(installed+1)*180;
    return [tag('example'),station(shot,ctx.values,{items:index?[{symbol:'battery',at:[1,6],opts:{count:1,highlight:true},lift:1.2}]:[]}),
      index?note(shot.labels.addedHours,ctx.values):null,diagram(text(shot.question,ctx.values),600,265,
      s('polyline',{points:series.map(p=>`${x(p.year)},${y(p.hours)}`).join(' '),class:'jp-arrow','data-fade-example':'true'}),
      line(56,y(floor),526,y(floor),'jp-outline'),svgLabel(shot.labels.floor,ctx.values,56,y(floor)-8),
      svgLabel(shot.labels.finalYear,ctx.values,435,251)),
      h('p',{class:'jp-readout'},text(shot.controls[1],ctx.values),' · ',ctx.values.playDuration,' ',L(JP_UI.unitNames.hours),' · ',label(shot,'floor',ctx.values),' ',ctx.values.obligationHours,' ',L(JP_UI.unitNames.hours),' · ',label(shot,'finalYear',ctx.values),' ',ctx.values.awardTerm),
      note(shot.labels.fade,ctx.values)];
  });
}

function payment(shot,ctx){
  return interactive(shot,ctx,index=>{
    const draw=vertical=>{
    const fundingOpen=V.gaps.funding,kids=[];
    JP_UI.paymentRoles.forEach((pair,i)=>{
      const x=vertical?45:22+i*116,y=vertical?22+i*85:75;
      kids.push(rect(x,y,vertical?230:100,vertical?48:57,i===index?'jp-solid':'jp-pale'),svgLabel(pair,ctx.values,x+6,vertical?y+30:162,vertical&&i===index?{class:'jp-inverse'}:{}));
      if(i<4)kids.push(vertical?line(160,y+48,160,y+85,fundingOpen&&i<2?'jp-plan':'jp-arrow'):line(x+100,102,x+116,102,fundingOpen&&i<2?'jp-plan':'jp-arrow'));
    });
    kids.push(s('path',{d:vertical?'M275,380Q330,330 275,300':'M535,74Q390,12 370,73',class:'jp-arrow','data-return':'penalty'}),s('path',{d:vertical?'M45,380Q0,330 45,300':'M535,132Q390,212 370,132',class:'jp-arrow','data-return':'clawback'}));
    return diagram(text(shot.question,ctx.values),vertical?320:600,vertical?430:235,...kids);
    };
    return [h('div',{class:'jp-wide'},draw(false)),h('div',{class:'jp-narrow'},draw(true)),note(shot.controls[index],ctx.values),
      note(index===1?shot.labels.penalty:index===2?shot.labels.returned:index===3?shot.labels.surveillance:shot.labels.monthly,ctx.values),
      index===2?note(['{clawbackShare}','{clawbackShare}'],ctx.values):null];
  });
}

function revenueDrawing(shot,ctx,{compare=false,keptLabel}={}){
  const rows=(compare?chartRows():chartRows().filter(r=>r.marketId===ctx.row.id));
  const kids=[];
  rows.forEach((area,i)=>{
    const selected=area.marketId===ctx.row.id;
    const value=area.securedShare;
    kids.push(s('g',{class:selected?'jp-chart-own':'jp-chart-other','data-revenue-area':area.marketId},
      rect(52,45+i*72,490,22,'jp-pale'),
      Number.isFinite(value)?rect(52,45+i*72,490*value,22,'jp-solid',{'data-secured-share':value}):null,
      svgLabel(area.name||[area.region,area.region],ctx.values,52,34+i*72)));
  });
  /* A separate profit strip uses model retention. The secured-share bar's
     denominator is net first-year revenue; returned gross profit is never
     quietly added to that denominator. No regional trading amount is shown. */
  const retention=Number.parseFloat(ctx.values.retainedShare)/100;
  const y=rows.length*80+42;
  if(Number.isFinite(retention))kids.push(s('g',{'data-base':'other-market-profit'},
    rect(52,y,490*(1-retention),16,'jp-muted'),rect(52+490*(1-retention),y,490*retention,16,'jp-solid'),
    svgLabel(shot.labels.returned||SHARED_SHOTS['jp-12'].labels.returned,ctx.values,52,y+43),
    svgLabel(keptLabel||shot.labels.kept||SHARED_SHOTS['jp-12'].labels.kept,ctx.values,470,y+43)));
  const svg=diagram(text(shot.question,ctx.values),600,y+72,...kids);
  svg.setAttribute('data-revenue-plot','true');return svg;
}

function retained(shot,ctx){
  return interactive(shot,ctx,index=>[tag('model'),
    h('div',{class:'jp-wide'},revenueDrawing(shot,ctx,{compare:index===1})),h('div',{class:'jp-narrow'},revenueDrawing(shot,ctx)),
    table([JP_UI.area,shot.labels.award,JP_UI.securedYears,shot.labels.kept],chartRows().filter(r=>index===1||r.marketId===ctx.row.id).map(r=>[
      r.name,Number.isFinite(r.securedShare)?(r.securedShare*100).toFixed(1)+'%':L(JP_TEXT['Missing financial binding']),r.securedYears===null?L(JP_TEXT['Missing financial binding']):String(r.securedYears),ctx.values.retainedShare,
    ]),{attrs:{'data-revenue-table':'true'}}),
    h('ul',{class:'k-key'},Object.values(shot.labels).map(pair=>h('li',{},text(pair,ctx.values))))]);
}

function tokyoTension(shot,ctx){
  return interactive(shot,ctx,index=>[
    tag('schematic'),mapDrawing(ctx,{planned:index===1}),
    isoStage({viewBox:[600,190],origin:[200,85],sky:false,title:shot.question,desc:shot.meaning,items:[{symbol:'city',at:[0,0]},{symbol:'city',at:[4,2]},{symbol:'city',at:[8,0]}]}),
    index===2?diagram(text(shot.labels.studies,ctx.values),600,170,
      ...Array.from({length:Number(ctx.values.studyCap)},(_,i)=>rect(38+(i%6)*86,32+Math.floor(i/6)*42,65,26,'jp-pale')),
      svgLabel(shot.labels.studies,ctx.values,38,143)):null,
    h('p',{class:'jp-readout'},label(shot,'studies',ctx.values),' · ',ctx.values.studyCap,' · ',text(['{studyCapDate}','{studyCapDate}'],ctx.values)),
    index===1?h('div',{},tag('plan'),note(['{converterYear}','{converterYear}'],ctx.values)):null,
  ]);
}

function kyushuTension(shot,ctx){
  return interactive(shot,ctx,index=>[
    tag('schematic'),mapDrawing(ctx,{band:false,flow:index===3}),
    diagram(text(shot.labels.surplus,ctx.values),600,185,
      ...Array.from({length:12},(_,i)=>rect(42+(i%6)*67,30+Math.floor(i/6)*40,48,25,index===2&&i%3===0?'jp-muted':'jp-pale')),
      index===1?line(320,15,320,120,'jp-outline'):null,
      line(410,60,550,index===3?30:70),svgLabel(shot.labels.link,ctx.values,250,155)),
    note(shot.controls[index],ctx.values),
    note([['{fitDate}','{suspensionDate}','{firstCurtailmentDate}','{transferTripDate}'][index],['{fitDate}','{suspensionDate}','{firstCurtailmentDate}','{transferTripDate}'][index]],ctx.values),
    h('ol',{class:'jp-narrow jp-history-steps'},['fitDate','suspensionDate','firstCurtailmentDate'].map((key,i)=>h('li',{},text(shot.controls[i],ctx.values),' · ',text(['{'+key+'}','{'+key+'}'],ctx.values)))),
  ]);
}

function hokkaidoTension(shot,ctx){
  return interactive(shot,ctx,index=>[
    tag('schematic'),mapDrawing(ctx,{band:false,night:index===0,planned:index===1,controlled:index===2}),
    isoStage({viewBox:[600,200],origin:[240,110],sky:false,title:shot.question,desc:shot.meaning,items:[{symbol:'wind',at:[-1,0]},{symbol:'wind',at:[4,2]},{symbol:'home',at:[9,1]}]}),
    note(shot.controls[index],ctx.values),
    index===2?h('p',{class:'jp-readout'},ctx.values.chargingControlSystems,' ',L(JP_UI.unitNames['count of systems']))
      :index===1?h('div',{},note(['{newKitahonYear}','{newKitahonYear}'],ctx.values),tag('plan'),note(['{linkYear}','{linkYear}'],ctx.values)):note(shot.labels.blackout,ctx.values),
    h('ol',{class:'jp-narrow jp-history-steps'},[datePair(n.blackoutDate),datePair(n.newKitahonYear),datePair(n.chargingControlNotice)].map((date,i)=>h('li',{},text(shot.controls[i],ctx.values),' · ',L(date)))),
  ]);
}

function dayShape(shot,ctx,index){
  const points=index?[[50,125],[135,128],[220,105],[290,133],[355,95],[420,60],[520,112]]:[[50,126],[135,132],[220,115],[290,148],[355,90],[420,35],[520,108]];
  return diagram(text(shot.question,ctx.values),600,205,s('polyline',{points:points.map(p=>p.join(',')).join(' '),class:'jp-arrow','data-day-shape':'example'}),
    svgLabel(shot.labels.charge,ctx.values,65,178),
    svgLabel(shot.labels.discharge,ctx.values,410,178));
}

function tokyoBattery(shot,ctx){
  return interactive(shot,ctx,index=>[
    tag('example'),station(shot,ctx.values),h('div',{class:'jp-panels'},
      panel(shot.controls[index],dayShape(shot,ctx,index)),
      panel(SHARED_SHOTS['jp-12'].labels.award,revenueDrawing(shot,ctx),note(shot.labels.returned,ctx.values),note(shot.labels.kept,ctx.values))),
    note(shot.labels.connection,ctx.values),
  ]);
}

function kyushuBattery(shot,ctx){
  return interactive(shot,ctx,index=>{
    const own=V.regional.kyushu.outputControl,v=ctx.values;
    const physical=diagram(text(shot.question,v),600,170,
      rect(40,40,180,55,'jp-pale'),rect(350,40,170,55,index===0?'jp-solid':'jp-muted'),
      index===0?line(220,66,350,66):line(280,35,280,100,'jp-plan'),
      svgLabel(shot.labels.curtailed,v,40,136),svgLabel(shot.labels.charging,v,350,136));
    return [tag('schematic'),h('div',{class:'jp-physical', 'data-panel':'physical'},panel(shot.labels.charging,physical,station(shot,v))),
      h('div',{class:'jp-revenue','data-panel':'revenue'},panel(SHARED_SHOTS['jp-12'].labels.award,revenueDrawing(shot,ctx,{keptLabel:index===0?shot.labels.kept:shot.controls[1]}),note(shot.labels.returned,v))),
      tag('observed'),table([JP_UI.month,JP_UI.days],own.months.map(m=>[datePair(m.month),String(m.days)]),
        {caption:shot.labels.monthlyDays,attrs:{'data-observed-months':'kyushu'}}),
      note([datePair(own.window[0])[0]+'–'+datePair(own.window[1])[0],datePair(own.window[0])[1]+'—'+datePair(own.window[1])[1]])];
  });
}

function hokkaidoBattery(shot,ctx){
  return interactive(shot,ctx,index=>{
    const pattern=hatch(),kids=[pattern.node];
    for(let i=0;i<10;i++)kids.push(rect(45+i*50,60,39,50,index&&i%3===0?'':'jp-pale',index&&i%3===0?{fill:`url(#${pattern.id})`}:{}));
    kids.push(line(40,135,550,135,'jp-outline'),s('line',{x1:505,y1:30,x2:505,y2:170,class:'jp-plan','data-official-plan':'true'}),svgLabel(shot.labels.floor,ctx.values,45,160));
    return [tag('example'),diagram(text(shot.question,ctx.values),600,205,...kids),note(index?shot.labels.restricted:shot.labels.firm,ctx.values),
      h('div',{},tag('plan'),note(shot.labels.link,ctx.values),note(['{linkYear}','{linkYear}'],ctx.values))];
  });
}

function investment(shot,ctx){
  const copy=text(shot.copy,ctx.values),items=copy.split(/(?<=[.!?；。])\s*/).filter(Boolean);
  return h('div',{class:'jp-scene k-scene','data-scene':shot.id},h('div',{class:'jp-wide'},mapDrawing(ctx,{band:false,planned:regionOf(ctx)!=='kyushu'}),tag('schematic')),
    h('ul',{class:'jp-narrow jp-checklist'},items.map(s=>h('li',{},s))),note(shot.meaning,ctx.values));
}

export const scenes={
  'jp-00':opening,'jp-01':frequency,'jp-02':outages,'jp-03':reform,'jp-04':payback,'jp-05':clauses,'jp-06':queue,
  'jp-08':signatureChart,'jp-09':fade,'jp-11':payment,'jp-12':retained,
  'jp-tokyo-07':tokyoTension,'jp-kyushu-07':kyushuTension,'jp-hokkaido-07':hokkaidoTension,
  'jp-tokyo-10':tokyoBattery,'jp-kyushu-10':kyushuBattery,'jp-hokkaido-10':hokkaidoBattery,
  'jp-tokyo-13':investment,'jp-kyushu-13':investment,'jp-hokkaido-13':investment,
};
