import {isoStage} from '../../../experience/story/kit/symbols.js';
import {CAISO_EVIDENCE as E,CAISO_HISTORY as H} from '../data/storyEvidence.js';
import {CAISO_TEACHING} from './teaching.js';
import {LABELS,HISTORY_TEXT} from './labels.js';
import {MAP} from './geo.js';
import {fillPair} from '../../../experience/story/contract.js';
import {eveningChart} from './chart.js';
import {h,L,s,text,note,example,scene,diagram,toggleGroup,localState,card} from './ui.js';

const UNKNOWN=['Not yet known','尚不可知'];
const station=(title,{time='day',future=false,lift=0}={})=>isoStage({title,viewBox:[600,300],origin:[260,72],time,items:[{symbol:'ground',at:[0,0],opts:{w:14,d:10}},{symbol:'solarFarm',at:[0,1]},{symbol:'battery',at:[4,4],opts:{count:2,future},lift},{symbol:'pcs',at:[7,4],lift:lift/2},{symbol:'transformer',at:[9,5]},{symbol:'pylon',at:[12,7]},{symbol:'home',at:[10,0]}],wires:[[[9,5],[12,7]]]});
function localValues(row,values){const t=CAISO_TEACHING(row);return {...values,examplePower:String(t.powerMW),sodHours:String(E.sodHours),ldesThreshold:String(E.ldesThresholdHours)};}
/* Controls use already-localised labels. L() in the shared control selects the
   language; retain genuine pairs rather than mixing a new investment state. */
function choices(shot,ctx,draw){
  const state=localState(shot.id,{step:0}),panel=h('div',{'aria-live':'polite'}),values=localValues(ctx.row,ctx.values);
  const render=()=>{panel.replaceChildren(...[draw(state.step,values)].flat());panel.setAttribute('data-teaching-step',state.step);};render();
  return scene(toggleGroup({label:shot.question,value:state.step,options:shot.controls.map((label,i)=>({value:i,label:label.map((v,lang)=>v.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g,(_,key)=>Array.isArray(values[key])?values[key][lang]:values[key]??'—'))})),onChange:i=>{state.step=i;render();}}),panel);
}
function geography(shot,ctx){return choices(shot,ctx,(step,values)=>{
  const svg=diagram(LABELS[shot.id][0],MAP.viewBox,s('path',{d:MAP.balancingArea,fill:'#b8cda4',stroke:'#224e40','stroke-width':2,'fill-rule':'evenodd','data-ba-overlay':'approximate'}));
  return [svg,note(LABELS[shot.id][0]),card(LABELS[shot.id][1],step?['Each retailer holds a capacity contract.','每个售电主体持有容量合同。']:['Before system RA requirements','系统RA要求生效之前']),step?card(LABELS[shot.id][2],LABELS[shot.id][3]):null,h('a',{href:MAP.sourceUrl,target:'_blank',rel:'noopener noreferrer'},L(['Geographic source · approximate','地图来源 · 近似']))].filter(Boolean);
});}
function day(shot,ctx){return choices(shot,ctx,step=>[station(shot.question,{time:step?'dusk':'day'}),note(LABELS[shot.id][2]),note(step?LABELS[shot.id][3]:LABELS[shot.id][1])]);}
function history(shot,ctx){
  const state=localState(shot.id,{node:0}),values=localValues(ctx.row,ctx.values),panel=h('div',{'aria-live':'polite'});
  const select=h('select',{'aria-label':L(shot.controls[0])},HISTORY_TEXT.map((n,i)=>h('option',{value:i},L(n.title))));select.value=String(state.node);
  const render=()=>{
    const node=HISTORY_TEXT[state.node],dates=H[node.id],future=dates.status==='adopted-future-effect';
    const dateList=Object.entries(dates).filter(([key])=>!['sourceIds','locator','status','checkedOn','arithmetic'].includes(key));
    panel.replaceChildren(h('p',{class:'caiso-amount'},dateList.map(([,v])=>Array.isArray(v)?v.join(' / '):v).join(' · ')),...Object.entries(node.fields).map(([field,pair],i)=>card([field,['约束','选择','遗留','今日影响'][i]],pair.map((v,lang)=>v.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g,(_,key)=>Array.isArray(values[key])?values[key][lang]:values[key]??'—')),future&&i>0)),note(['Historical adoption is distinct from future effects; future effects are dashed.','历史通过时间与未来生效时间分开；未来影响以虚线表示。']));
  };select.addEventListener('change',()=>{state.node=Number(select.value);render();});render();return scene(select,panel);
}
function fleet(shot,ctx){return choices(shot,ctx,(step,values)=>{
  if(!step)return [station(shot.question,{time:'dusk'}),example(),note(LABELS[shot.id][0]),note(['Schematic shortfall; no outage MW is registered.','短缺机制示意；未登记停电容量数值。'])];
  const rows=[['fleet2020',E.fleet2020MW,E.fleet2020AsOf],['fleetDec2024',E.fleetDec2024MW,E.fleetDec2024AsOf]];
  const svg=diagram(LABELS[shot.id][2],'0 0 600 180',rows.map(([key,value,period],i)=>s('g',{},s('text',{x:20,y:40+i*70,class:'k-label'},`${period} · ${text(['about {value} MW','约{value} MW'],{value:values[key]})}`),s('rect',{x:20,y:50+i*70,width:520*value/E.fleetDec2024MW,height:15,fill:'#224e40','data-observed':'true'}))));
  return [svg,note(LABELS[shot.id][2]),note(['Procurement requirement and installed battery capacity are different measures.','采购要求与已安装电池容量是不同口径。'])];
});}
function seasons(shot,ctx){return choices(shot,ctx,step=>[station(shot.question,{time:'dusk'}),card(shot.controls[step],step===0?['A dated summer assessment; this does not show realised dispatch.','一份注明日期的夏季评估；不代表实际运行结果。']:step===1?['System adequacy does not remove seasonal scarcity.','全系统充裕不意味着所有季节都宽松。']:['Deliverability and the asset’s own contract still decide the case.','可交付性和资产自身的合同仍决定投资逻辑。'],step===0)]);}
function qualifications(shot,ctx){return choices(shot,ctx,(step,values)=>{
  const svg=diagram(shot.question,'0 0 600 180',Array.from({length:E.sodHours},(_,i)=>s('rect',{x:18+i*23,y:35,width:19,height:42,fill:step?'#a8be91':'#e6e9dc',stroke:'#224e40'})),s('rect',{x:185,y:110,width:150,height:30,fill:'#a8be91',stroke:'#224e40'}),step===2?s('path',{d:'M335 110 L390 120 L390 140 L335 140 Z',fill:'none',stroke:'#a37732','stroke-dasharray':'6 4'}):null);
  return [svg,note(['Daily showing: {sodHours} hours; battery basis: {qcBasisHours} continuous hours.','每日申报：{sodHours}小时；电池基准：连续{qcBasisHours}小时。'],values),step===2?example():null,step===2?card(LABELS[shot.id][3],UNKNOWN,true):note(LABELS[shot.id][step?2:0]),card(LABELS[shot.id][4],UNKNOWN,true),card(LABELS[shot.id][5],['Unit-specific outage accreditation is separate from foldback.','按机组停运记录核定与出力回落是两回事。'],true)].filter(Boolean);
});}
function duration(shot,ctx){
  const t=CAISO_TEACHING(ctx.row),state=localState(shot.id,{duration:1,after:false}),values=localValues(ctx.row,ctx.values),panel=h('div',{'aria-live':'polite'});
  const render=()=>{const i=state.duration;panel.replaceChildren(station(shot.question,{future:state.after}),example(),note(['Example: {power} MW · {hours} h · {energy} MWh','示例：{power} MW · {hours}小时 · {energy} MWh'],{power:t.powerMW,hours:t.durationHours[i],energy:t.energyMWh[i]}),note(state.after?['After foldback: not yet known','出力回落后：尚不可知']:['Base credited power (Example): {credit} MW','基准计入信用的功率（示例）：{credit} MW'],{credit:t.baseCreditedMW[i]}),note(['Lossless usable energy and unconstrained deliverability are assumed; this is not an asset qualification.','假设可用电能无损耗、可交付性不受限；这不是对具体资产的资格核定。']));};
  const label=p=>p.map((v,lang)=>v.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g,(_,key)=>values[key]??'—'));
  const presets=toggleGroup({label:shot.question,value:state.duration,options:shot.controls.slice(0,3).map((p,i)=>({value:i,label:label(p)})),onChange:i=>{state.duration=i;render();}});
  const condition=toggleGroup({label:['Qualification illustration','容量资格示意'],value:state.after,options:shot.controls.slice(3).map((p,i)=>({value:Boolean(i),label:p})),onChange:v=>{state.after=v;render();}});render();return scene(presets,condition,panel);
}
function cutaway(shot,ctx){return choices(shot,ctx,step=>[station(shot.question,{lift:step?2:0}),...(step?[card(['Deliverability','可交付性'],['Verify the asset’s own status and obligations.','核实资产自身的资格和义务。']),card(['Executed RA contract','已签署的RA合同'],['Price, MW, tenor, counterparty and qualifying-capacity risk remain diligence items.','价格、容量、期限、交易对手和合格容量风险仍需尽调。'])]:[card(['Modules · PCS · Transformer · Controls · Connection','模组 · 功率变换系统 · 变压器 · 控制系统 · 并网'],['Breakdown not available','成本拆分尚不可得'])])]);}
function payments(shot,ctx){return choices(shot,ctx,(step,values)=>[station(shot.question),card(shot.controls[step],step===0?[text(['Model: {securedShare} secured for {securedTenor} years; unsecured after.','模型：{securedShare}收入在前{securedTenor}年锁定；此后为非锁定收入。'],values),text(['Model: {securedShare} secured for {securedTenor} years; unsecured after.','模型：{securedShare}收入在前{securedTenor}年锁定；此后为非锁定收入。'],values)]:step===1?['Energy payment unit: MWh','电能量计价单位：MWh']:['Regulation capacity payment unit: MW','调频容量计价单位：MW']),note(['A model assumption is not an executed asset contract.','模型假设不等于资产已签署的合同。'])]);}
function commitments(shot,ctx){return choices(shot,ctx,step=>[h('div',{class:'caiso-grid'},shot.controls.map((p,i)=>card(p,i===step?['Selected commitment; check compatible power, energy and charging obligations.','当前所选承诺；须核对可兼容的功率、电量和充电义务。']:['Compatibility must be demonstrated.','须证明能够兼容。']))),note(LABELS[shot.id][2])]);}
function investment(shot,ctx){return choices(shot,ctx,(step,values)=>[station(shot.question),card(shot.controls[step],step?[text(['Operating target {operatingTarget}; price ceiling {operatingPriceCeiling}.','在运资产目标{operatingTarget}；价格上限{operatingPriceCeiling}。'],values),text(['Operating target {operatingTarget}; price ceiling {operatingPriceCeiling}.','在运资产目标{operatingTarget}；价格上限{operatingPriceCeiling}。'],values)]:[text(['Build return {holdReturn}; target {targetReturn}; build capex {buildCapex}.','新建回报{holdReturn}；目标{targetReturn}；新建成本{buildCapex}。'],values),text(['Build return {holdReturn}; target {targetReturn}; build capex {buildCapex}.','新建回报{holdReturn}；目标{targetReturn}；新建成本{buildCapex}。'],values)]),note(['The current ceiling is before the unknown cut; it is not a post-cut bid.','当前上限未计入未知下调；不能作为下调后的报价。']),note(['{nextAction}','{nextAction}'],values)]);}
function downside(shot,ctx){return choices(shot,ctx,(step,values)=>[h('div',{class:'caiso-grid'},[['Qualifying MW','合格容量'],['RA price and renewal','RA价格与续约'],['Outage accreditation','停运记录核定'],['Purchase price','买入价格']].map(p=>card(p,['No numerical downside magnitude or probability is registered here.','此处未登记下行幅度或概率。'],true))),note(['{nextAction}','{nextAction}'],values)]);}
const renderers={'caiso-01':geography,'caiso-02':day,'caiso-03':history,'caiso-04':fleet,'caiso-05':eveningChart,'caiso-06':seasons,'caiso-07':qualifications,'caiso-08':duration,'caiso-09':cutaway,'caiso-10':payments,'caiso-11':commitments,'caiso-12':investment,'caiso-13':downside};
/* The SVG title and control-group accessible name use exactly the page's
   binding owner (evidence §4), rather than exposing an unresolved figure. */
export const scenes=Object.fromEntries(Object.entries(renderers).map(([id,render])=>[id,(shot,ctx)=>render({...shot,question:fillPair(shot.question,ctx.values)},ctx)]));
