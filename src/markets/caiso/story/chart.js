import {CAISO_DAY as D} from '../data/storyEvidence.js';
import {s,L,note,example,scene,diagram,toggleGroup,localState} from './ui.js';
export const FALLBACK=['Observed series awaiting registration; showing an Example','观察序列尚待登记；当前展示示例'];
/* This release has no cleared series. Original mechanism geometry has no time
   or MW scale, measured curve shape, era comparison, numerical hover or ratio. */
export function eveningChart(shot,{values}){
  const title=['Midday charging can shift energy to the evening','午间充电可将电能转移到傍晚'];
  const state=localState(shot.id,{band:true});
  const band=s('rect',{x:352,y:176,width:218,height:20,rx:5,fill:'none',stroke:'#a37732','stroke-dasharray':'6 4','data-example-band':'true'});
  const svg=diagram(title,'0 0 600 260',
    s('rect',{x:24,y:32,width:230,height:170,rx:20,fill:'#e6e9dc'}),
    s('rect',{x:346,y:32,width:230,height:170,rx:20,fill:'#d4dfe0'}),
    s('circle',{cx:140,cy:87,r:25,fill:'#dcb96c'}),
    s('path',{d:'M140 122 L140 156 L265 156 M257 147 L269 156 L257 165',fill:'none',stroke:'#224e40','stroke-width':4}),
    s('rect',{x:273,y:131,width:54,height:48,rx:6,fill:'#a8be91',stroke:'#224e40'}),
    s('path',{d:'M327 156 L455 156 L455 121 M446 129 L455 117 L464 129',fill:'none',stroke:'#224e40','stroke-width':4}),
    s('path',{d:'M470 62 A25 25 0 1 0 470 108 A20 20 0 0 1 470 62',fill:'#567778'}),
    s('text',{x:140,y:230,'text-anchor':'middle',class:'k-label'},L(['Midday','中午'])),
    s('text',{x:455,y:230,'text-anchor':'middle',class:'k-label'},L(['Evening','傍晚'])),band);
  const update=()=>band.setAttribute('visibility',state.band?'visible':'hidden');update();
  const control=toggleGroup({label:shot.question,multi:true,options:[{value:'band',label:['Show the Example band','显示示例时段带'],pressed:state.band}],onChange:(_,pressed)=>{state.band=pressed;update();}});
  svg.setAttribute('data-chart','Chart-CAISO-EVENING');svg.setAttribute('data-publication-status',D.publicationStatus);
  return scene(example(),control,svg,note(FALLBACK),note(['Example duration: {playDuration} hours; no exact operating hours or fleet coverage is established.','示例时长：{playDuration}小时；不据此判断确切运行时段或机组群覆盖比例。'],values));
}
