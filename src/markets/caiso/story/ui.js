import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {s,uid} from '../../../experience/story/kit/svg.js';
import {fillPair} from '../../../experience/story/contract.js';
import {toggleGroup} from '../../../experience/story/kit/controls.js';
export {h,L,s,toggleGroup};
export const text=(pair,values={})=>L(fillPair(pair,values));
export const note=(pair,values={})=>h('p',{class:'k-readout'},text(pair,values));
export const example=()=>h('span',{class:'k-tag'},L(['Example','示例']));
export const scene=(...children)=>h('div',{class:'caiso-scene k-scene'},...children);
export function diagram(title,viewBox='0 0 600 280',...children){const id=uid('caiso');return s('svg',{class:'k-stage k-diagram',viewBox,role:'img','aria-labelledby':id},s('title',{id},L(title)),...children);}
const memory=new Map();
export function localState(id,defaults){if(!memory.has(id))memory.set(id,{...defaults});return memory.get(id);}
export const card=(title,body,future=false)=>h('section',{class:'caiso-card'+(future?' caiso-future':'')},h('strong',{},L(title)),h('p',{},L(body)));
