import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {s,uid} from '../kit/svg.js';
import {sourceButton} from '../../../components/sourcePopup.js';
import {SYSTEM_STEPS,REVENUE_ROUTES,PAYMENT_STEPS,deliveryState} from './italyLogicContent.js';
import './italyLogic.css';

const P=(value,cls='')=>h('p',{class:cls},L(value));
const replace=(target,...children)=>target.replaceChildren(...children.filter(child=>child!=null));
const button=(label,fn,attrs={})=>h('button',{type:'button',onclick:fn,...attrs},L(label));
const label=(x,y,value,cls='')=>s('text',{x,y,'text-anchor':'middle',class:cls},L(value));
function icon(kind,x,y){
 const g=s('g',{transform:`translate(${x} ${y})`,class:'il-icon'});
 if(kind==='solar')g.append(s('circle',{cx:0,cy:-10,r:9}),s('path',{d:'M-22 10h44l-6 23h-32z M-11 10l3 23 M11 10l-3 23 M-19 21h38 M0 33v8 M-13 41h26'}));
 if(kind==='battery')g.append(s('rect',{x:-23,y:-28,width:46,height:57,rx:5}),s('path',{d:'M-8 -34h16 M-12 -16h24 M-12 0h24 M-12 16h24',class:'il-charge-level'}));
 if(kind==='grid')g.append(s('path',{d:'M0 -32l-21 61 M0 -32l21 61 M-15 9h30 M-10 -7h20 M-21 29h42 M-24 -14h48 M-31 2h62 M-24 -14v9 M24 -14v9 M-31 2v9 M31 2v9'}));
 if(kind==='load')g.append(s('path',{d:'M-24 29v-45h48v45z M-12 -5h5 M7 -5h5 M-12 7h5 M7 7h5 M-12 19h5 M7 19h5 M-30 29h60'}));
 if(kind==='contract')g.append(s('path',{d:'M-22 -29h31l13 13v45h-44z M9 -29v13h13 M-11 -4h22 M-11 7h22 M-11 18h14'}));
 if(kind==='payer')g.append(s('path',{d:'M-30 -12L0 -31 30 -12z M-21 -7v31 M-7 -7v31 M7 -7v31 M21 -7v31 M-30 30h60'}));
 return g;
}
function node(x,y,kind,title,active=false){return s('g',{class:'il-node'+(active?' is-active':'')},s('circle',{cx:x,cy:y,r:46}),icon(kind,x,y-3),label(x,y+72,title));}
function svgBase(title,desc,small){
 const id=uid('italy-logic'),svg=s('svg',{viewBox:small?'0 0 380 390':'0 0 860 390',role:'img','aria-labelledby':id+'-title '+id+'-desc',class:'il-diagram'});
 svg.append(s('title',{id:id+'-title'},L(title)),s('desc',{id:id+'-desc'},L(desc)));
 const arrow=id+'-arrow';svg.dataset.arrow=arrow;
 svg.append(s('defs',{},s('marker',{id:arrow,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'},s('path',{d:'M0 0L10 5L0 10z',fill:'context-stroke'}))));
 return svg;
}
function powerDiagram(step,blocked,small,system){
 if(system)return marketPowerDiagram(system,step,blocked,small);
 const state=deliveryState(step,blocked),charging=state==='charging',discharging=state==='discharging';
 const svg=svgBase(SYSTEM_STEPS[step].title,SYSTEM_STEPS[step].body,small);
 const solar=small?[80,82]:[110,112],grid=small?[290,82]:[435,112],battery=small?[80,270]:[275,275],load=small?[290,270]:[750,112];
 const flow=(d,on,cls='')=>svg.append(s('path',{d,class:`il-wire ${on?'il-flow':''} ${cls}`,...(on?{'marker-end':`url(#${svg.dataset.arrow})`}:{})}));
 flow(`M${solar[0]+46} ${solar[1]}H${grid[0]-46}`,step===0);
 flow(small?'M80 128V224':'M110 158V275H229',charging);
 flow(small?'M126 270H190V82H244':'M321 275H435V158',discharging,'il-discharge');
 flow(small?'M290 128V224':'M481 112H704',discharging,'il-discharge');
 svg.append(node(...solar,'solar',['Solar generation','光伏发电'],step<2),node(...grid,'grid',['Grid connection','并网连接'],discharging),node(...battery,'battery',['Battery storage','电池储能'],step>0),node(...load,'load',['Electricity demand','用电需求'],discharging));
 if(step===2&&blocked){const x=small?290:590,y=small?177:112;svg.append(s('circle',{cx:x,cy:y,r:17,class:'il-blocked'}),s('path',{d:`M${x-7} ${y-7}l14 14 M${x+7} ${y-7}l-14 14`,class:'il-cross'}));}
 svg.append(label(small?190:605,small?374:285,
  charging?['Charging · losses apply','充电中 · 存在损耗']:discharging?['Discharging · export available','放电中 · 具备送出条件']:state==='constrained'?['Export constrained · delivery limited','出口受限 · 交付受到限制']:['Surplus is local and hourly','富余具有地点和时段属性'],'il-state-label'));
 return svg;
}
function marketPowerDiagram(system,step,blocked,small){
 const svg=svgBase(system.steps[step].title,system.steps[step].body,small),w=small?380:860;
 svg.dataset.physicalKind=system.kind;
 const constrained=step===2&&blocked,on=step===2&&!blocked;
 const wire=(d,active,cls='')=>svg.append(s('path',{d,class:`il-wire ${active?'il-flow':''} ${cls}`,...(active?{'marker-end':`url(#${svg.dataset.arrow})`}:{})}));
 const cross=(x,y)=>svg.append(s('circle',{cx:x,cy:y,r:17,class:'il-blocked'}),s('path',{d:`M${x-7} ${y-7}l14 14 M${x+7} ${y-7}l-14 14`,class:'il-cross'}));
 if(system.kind==='shift'){
  const a=small?[80,82]:[110,112],g=small?[290,82]:[435,112],b=small?[80,270]:[275,275],d=small?[290,270]:[750,112];
  wire(`M${a[0]+46} ${a[1]}H${g[0]-46}`,step===0);
  wire(small?'M80 128V224':'M110 158V275H229',step===1);
  wire(small?'M126 270H190V82H244':'M321 275H435V158',on,'il-discharge');
  wire(small?'M290 128V224':'M481 112H704',on,'il-discharge');
  svg.append(node(...a,'solar',system.sourceLabel,step<2),node(...g,'grid',system.gridLabel,on),node(...b,'battery',['Battery','电池'],step>0),node(...d,'load',system.loadLabel,on));
  if(constrained)cross(small?290:590,small?177:112);
 }else if(system.kind==='response'){
  const xs=small?[65,190,315]:[120,430,740],y=110;
  wire(`M${xs[0]+44} ${y}H${xs[1]-44}`,step>0,'il-obligation');
  wire(`M${xs[1]+44} ${y}H${xs[2]-44}`,on,'il-obligation');
  wire(`M${xs[2]} 198V260H${xs[0]}V198`,on,'il-discharge');
  svg.append(node(xs[0],y,'grid',system.sourceLabel,step===0||on),node(xs[1],y,'contract',system.gridLabel,step>0),node(xs[2],y,'battery',['Response','电池响应'],step>0));
  // Qualitative frequency trace, with no numerical axis or fabricated observation.
  svg.append(s('path',{d:`M${w*.22} 304h${w*.56}`,class:'il-reference'}),s('path',{d:on?`M${w*.22} 304q${w*.07} -36 ${w*.14} 0t${w*.14} 0q${w*.07} -7 ${w*.14} 0h${w*.14}`:`M${w*.22} 304q${w*.07} -36 ${w*.14} 0t${w*.14} 0t${w*.14} 0t${w*.14} 0`,class:'il-frequency'+(on?' is-restored':'')}));
  if(constrained)cross(xs[2],260);
 }else{
  const xs=small?[65,190,315]:[120,430,740],y=125;
  wire(`M${xs[0]+44} ${y}H${xs[1]-44}`,system.kind==='connection'?step>0&&!constrained:step===0);
  wire(`M${xs[1]+44} ${y}H${xs[2]-44}`,on,'il-discharge');
  svg.append(node(xs[0],y,'grid',system.sourceLabel,step<2),node(xs[1],y,'battery',['Battery','电池'],step>0),node(xs[2],y,'load',system.loadLabel,on));
  if(system.kind==='connection'){
   const gate=(xs[0]+xs[1])/2;
   svg.append(s('path',{d:`M${gate-9} ${y-25}v50 M${gate+9} ${y-25}v50`,class:'il-access-gate'}),label(w/2,270,system.gridLabel,'il-state-label'));
   if(constrained)cross(gate,y);
  }else{
   svg.append(s('rect',{x:w/2-76,y:255,width:152,height:38,rx:5,class:'il-energy-store'}));
   for(let i=0;i<4;i++)svg.append(s('rect',{x:w/2-68+i*35,y:263,width:30,height:22,rx:2,class:'il-energy-block'+((step===1||on||i===0)&&(!constrained||i===0)?' is-filled':'')}));
   svg.append(label(w/2,325,['Usable energy for the obligation','用于履约的可用电量'],'il-state-label'));
   if(constrained)cross((xs[1]+xs[2])/2,y);
  }
 }
 svg.append(label(w/2,small?378:375,constrained?['Constraint reached · delivery limited','触及约束 · 交付受限']:system.states[step],'il-state-label'));
 return svg;
}
function paymentDiagram(route,step,delivered,small,routes=REVENUE_ROUTES){
 const r=routes[route],svg=svgBase(r.label,[r.promise[0]+'. '+r.net[0],r.promise[1]+'。'+r.net[1]],small);
 svg.dataset.paymentKind=r.kind||'contract';
 const xs=small?[62,190,318]:[125,430,735],y=small?100:140;
 for(let i=0;i<2;i++)svg.append(s('path',{d:`M${xs[i]+44} ${y}H${xs[i+1]-44}`,class:'il-wire il-obligation'+(step<2?' il-flow':''),'marker-end':`url(#${svg.dataset.arrow})`}));
 svg.append(node(xs[0],y,'battery',r.kind==='grant'?['Eligible build','合格建设']:['Project','项目'],true),node(xs[1],y,'contract',[r.unit+' · '+(r.kind==='grant'?'cost':'rights'),r.unit+' · '+(r.kind==='grant'?'成本':'权利')],step>0),node(xs[2],y,'payer',['Payer / user','付费／使用方'],step>0));
 const baseY=small?252:288;
 svg.append(s('path',{d:`M${xs[2]} ${y+88}V${baseY}H${xs[0]}V${y+88}`,class:'il-wire il-payment'+(step===2&&delivered&&r.kind!=='procurement'?' il-flow':''),'marker-end':`url(#${svg.dataset.arrow})`}));
 const cash={grant:['Eligible capital reimbursement','合格建设成本报销'],toll:['Contract fee for dispatch rights','调度权换取合同费'],floor:['Contract floor / sharing settlement','合同保底／分成结算'],underwriting:['Revenue support / sharing','收入支持／收益分成'],clawback:['Capacity payment after profit returns','利润返还后的容量付款'],procurement:['Payment terms still required','仍需实际付款条款']};
 svg.append(label(small?190:430,baseY+28,step===2?delivered?(cash[r.kind]||['Earned settlement → project cash','履约结算 → 项目现金']):r.kind==='grant'?['Reimbursement delayed / reduced','报销延迟／扣减']:r.kind==='procurement'?['Payment terms still required','仍需实际付款条款']:['Deductions / penalties may apply','可能扣减／罚款']:['Rights and delivery come before cash','先明确权利，再履约结算'],'il-state-label'));
 if(r.kind==='toll'&&step===1)svg.append(s('path',{d:`M${xs[2]} ${y-54}V${y-78}H${xs[0]}V${y-54}`,class:'il-wire il-control il-flow','marker-end':`url(#${svg.dataset.arrow})`}),label(xs[1],y-90,['Dispatch instruction','调度指令'],'il-state-label'));
 if(['clawback','underwriting'].includes(r.kind)&&step===2)svg.append(s('path',{d:`M${xs[0]} ${baseY+53}H${xs[2]}`,class:'il-wire il-return','marker-end':`url(#${svg.dataset.arrow})`}),label(xs[1],baseY+78,['Required revenue return / sharing →','应返还收益／分成 →'],'il-state-label'));
 if(step===2&&!delivered)svg.append(s('circle',{cx:xs[1],cy:baseY,r:13,class:'il-blocked'}),label(xs[1],baseY+5,'!','il-warning'));
 return svg;
}
function references(data,keys){return sourceButton(()=>h('div',{},h('h4',{},L(['Evidence for this explanation','本章解释的依据'])),
 h('ul',{},keys.map(key=>data.sources[key]).filter(Boolean).map(source=>h('li',{},h('a',{href:source.url,target:'_blank',rel:'noopener noreferrer'},source.title),source.locator?P(source.locator):null,source.checkedOn?P(['Checked '+source.checkedOn,'核对日期 '+source.checkedOn]):null)))),['Official evidence & scope','官方依据与适用范围']);}

export function renderChapter(data,id,ctx,config=null){
 const system=id==='system',root=h('article',{class:'public-chapter market-logic italy-logic','data-chapter':id,'data-market':data.marketId,'data-public-pilot':data.marketId});
 const systemConfig=config?.system,systemSteps=systemConfig?.steps||SYSTEM_STEPS,routes=config?.routes||REVENUE_ROUTES;
 let step=0,route=Object.keys(routes)[0],blocked=false,delivered=true,timer=null,playing=false;
 const small=globalThis.matchMedia?.('(max-width:720px)').matches;
 const steps=system?systemSteps.map(s=>s.label):PAYMENT_STEPS;
 const title=system?(systemConfig?.title||['Storage moves energy through time. Location decides whether it can deliver.','储能搬移电量，选址决定能否兑现。']):['Choose the revenue route, then follow the rights and the cash.','先选收入路径，再追踪权利和现金。'];
 root.append(P(system?['03 / FROM SYSTEM NEED TO PROJECT VALUE','03 / 从系统需求到项目价值']:['04 / FROM SERVICE TO PROJECT CASH','04 / 从服务到项目现金'],'il-eyebrow'),h('h3',{tabindex:-1},L(title)),
  P(system?(systemConfig?['Follow the local need, the battery’s action and its delivery constraint. Select a step to change the drawing.','从当地需求，看到电池动作，再看交付约束。选择步骤，图与文字一起变化。']:['Follow one battery from a sunny hour to an evening delivery. Each step changes the same drawing.','沿着一座电池，从光伏充足时刻走到晚间交付。每一步都改变同一张图。']):['The same battery can be paid for different promises. Select one route; do not add incompatible rights or revenues.','同一座电池，可以为不同承诺获得收入。每次看清一条路径，再判断权利与收益能否兼容。'],'il-intro'));
 const routeControls=h('div',{class:'il-routes',role:'group','aria-label':L(['Revenue route','收入路径'])});
 if(!system){Object.entries(routes).forEach(([key,r])=>routeControls.append(button(r.label,()=>{route=key;stop();step=0;delivered=true;draw();},{'data-revenue-route':key})));root.append(routeControls);}
 const nav=h('div',{class:'il-steps',role:'group','aria-label':L(['Explanation steps','逻辑步骤'])});
 const illustration=h('div',{class:'il-illustration'}),copy=h('div',{class:'il-copy','aria-live':'polite'}),controls=h('div',{class:'il-controls'});
 const shell=h('div',{class:'il-storyboard'},illustration,copy);
 const play=button(['Play the sequence','播放流程'],()=>{if(playing){stop();root.classList.add('is-paused');return;}step=0;playing=true;draw();tick();},{class:'il-play'});
 function stop(){playing=false;clearTimeout(timer);play.textContent=L(['Replay the sequence','重播流程']);play.setAttribute('aria-pressed','false');root.dataset.playing='false';}
 function tick(){timer=setTimeout(()=>{if(!ctx.alive()||!root.isConnected||document.hidden){stop();return;}if(step===2){stop();return;}step++;draw();tick();},2800);}
 steps.forEach((label,index)=>nav.append(button(label,()=>{stop();step=index;draw();},{'data-logic-step':index})));
 nav.addEventListener('keydown',event=>{
  const index=Number(event.target.dataset.logicStep);if(!Number.isInteger(index))return;
  const next=event.key==='ArrowRight'?Math.min(2,index+1):event.key==='ArrowLeft'?Math.max(0,index-1):event.key==='Home'?0:event.key==='End'?2:null;
  if(next===null)return;event.preventDefault();stop();step=next;draw();nav.querySelectorAll('button')[next].focus();
 });
 controls.append(play,P(['Schematic · no numerical dispatch or price simulation','机制示意 · 非数值调度或价格模拟'],'il-schematic'));
 const takeaway=h('div',{class:'il-takeaway','aria-live':'polite'});
 root.append(nav,shell,controls,takeaway);
 function draw(){
  const restoreConditionFocus=copy.querySelector('.il-condition')===document.activeElement;
  root.classList.remove('is-paused');
  nav.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(step===i)));
  routeControls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.revenueRoute===route)));
  play.textContent=L(playing?['Pause','暂停']:['Play the sequence','播放流程']);
  play.setAttribute('aria-pressed',String(playing));root.dataset.playing=String(playing);
  root.dataset.step=String(step);root.dataset.route=system?'physical':route;
  if(system){const content=systemSteps[step],constrained=step===2&&blocked,condition=systemConfig?.condition;
   illustration.replaceChildren(powerDiagram(step,blocked,small,systemConfig));illustration.dataset.flow=systemConfig?(constrained?'constrained':`${systemConfig.kind}-${step}`):deliveryState(step,blocked);
   illustration.dataset.physicalKind=systemConfig?.kind||'shift';
   replace(copy,P(['PHYSICAL LOGIC','物理逻辑'],'il-eyebrow'),h('h4',{},L(content.title)),P(content.body),
    step===2?button(blocked?(condition?.restore||['Restore export access','恢复送出条件']):(condition?.try||['Try: export constrained','试试看：出口受限']),()=>{stop();blocked=!blocked;draw();},{class:'il-condition','aria-pressed':String(blocked)}):null,
    constrained?P(condition?.alert||['The energy remains available in the battery, but grid access limits delivery. A high evening price alone does not secure the sale.','电量仍可能留在电池内，但并网条件限制交付。仅有晚间高价，并不能保证卖出电量。'],'il-alert'):null);
   takeaway.replaceChildren(h('strong',{},L(['SO WHAT SHOULD I CHECK?','因此，该核验什么？'])),P(constrained?(condition?.check||['Test both import and export limits in the connection agreement, including when each limit applies.','核验并网协议的充电、放电上限，以及各上限生效的时段。']):content.takeaway));
  }else{const r=routes[route];
   illustration.replaceChildren(paymentDiagram(route,step,delivered,small,routes));
   replace(copy,P(L(r.label),'il-eyebrow'),h('h4',{},L(step===0?r.promise:step===1?r.right:r.pay)),
    P(step===0?['The contract or trade defines the service and its measurement. Installed battery size alone does not establish a payment.','合同或交易先定义服务与计量口径。电池建成的规模，本身不等于有权获得的收入。']:step===1?['Identify who may schedule the battery and which obligations reserve its capacity. One unit of capacity cannot be promised twice in the same period.','确认谁有权安排电池运行、哪些义务占用了容量。同一时段的一份容量，不能重复承诺。']:r.net),
    h('div',{class:'il-counterparty'},h('span',{},L(['Counterparty / user','交易对手／使用者'])),h('strong',{},L(r.counterparty))),
    step===2&&r.kind!=='procurement'?button(delivered?(r.kind==='grant'?['Try: expenditure fails eligibility','试试看：支出不符合资格']:['Try: delivery obligation missed','试试看：未完成交付义务']):['Restore eligibility / delivery','恢复资格／履约'],()=>{stop();delivered=!delivered;draw();},{class:'il-condition','aria-pressed':String(!delivered)}):null,
    step===2&&!delivered?P(r.kind==='grant'?['Ineligible costs or unmet milestones can delay or reduce support and may trigger repayment under the grant agreement.','不合格成本或未完成节点可能延迟、减少拨款，并可能触发资助协议的返还要求。']:['The contract or market settlement determines deductions and penalties. A headline premium is not unconditional net cash.','扣减与罚款由合同或市场结算规则确定。名义费用并非无条件到账的净现金。'],'il-alert'):null);
   takeaway.replaceChildren(h('strong',{},L(['BEFORE ADDING THIS REVENUE','计入这笔收入之前'])),P(r.check));
  }
  const alert=copy.querySelector('.il-alert');
  if(alert)illustration.querySelector('desc').textContent+=' '+alert.textContent;
  if(restoreConditionFocus)copy.querySelector('.il-condition')?.focus({preventScroll:true});
 }
 draw();
 root.append(h('div',{class:'il-next-read'},P(system?['Next: a physical benefit becomes investable only through a payment mechanism.','下一步：物理价值要通过付费机制，才可能成为可投资的现金流。']:['For a project decision, bring the signed rights, connection terms and full cost budget into the current investment case.','进入项目决策时，把已签权利、并网条件和完整成本预算带回当前投资方案。']),
  !system?button(['Return to the investment case →','回到当前投资方案 →'],ctx.investment,{class:'ix-button'}):null,
  references(data,system?(systemConfig?.sources||['SRC-IT-21','SRC-IT-05','SRC-IT-06']):Object.values(routes).flatMap(r=>r.sources).filter((v,i,a)=>a.indexOf(v)===i))));
 return root;
}
