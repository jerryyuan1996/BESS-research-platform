/* Finland's scene composition helpers. Shared shell, marker and controls stay intact. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {fillPair,MARKERS} from '../../../experience/story/contract.js';
import {toggleGroup} from '../../../experience/story/kit/controls.js';
import {s,uid} from '../../../experience/story/kit/svg.js';
import {story} from '../story.js';
import {sourceValues} from '../storyBindings.js';
export {h,L,s,toggleGroup};
export const fill=(node,...kids)=>node.replaceChildren(...kids.flat(Infinity).filter(k=>k!==null&&k!==undefined&&k!==false));
export const bound=(pair,values)=>fillPair(pair,values);
export const words=(shot,values)=>({title:fillPair(shot.question,values),copy:fillPair(shot.copy,values),label:key=>fillPair(shot.labels?.[key]||['',''],values),control:i=>fillPair(shot.controls?.[i]||['',''],values)});
export const shared=key=>story.text[key];
export function parts(key){const p=shared(key),en=p[0].split('; '),zh=p[1].split('；');if(en.length!==zh.length)throw Error('Bilingual catalogue mismatch');return en.map((s,i)=>[s,zh[i]]);}
export const scene=(...kids)=>h('div',{class:'k-scene'},...kids);
export const text=(pair,values={})=>L(fillPair(pair,values));
export const narrow=()=>typeof matchMedia==='function'&&matchMedia('(max-width:560px)').matches;
export const example=()=>h('span',{class:'k-tag'},L(parts('Diagram / history legend')[4]));
export function diagram(title,width=600,height=260,...kids){const id=uid('fi-drawing');return s('svg',{class:'k-stage k-diagram',viewBox:'0 0 '+width+' '+height,role:'img','aria-labelledby':id},s('title',{id},L(title)),...kids);}
export const readout=(...kids)=>h('div',{class:'k-readout','aria-live':'polite'},...kids);
export const note=(pair,values={})=>h('p',{class:'k-readout'},text(pair,values));
const memory=new Map(),storageKey='fi-story-ui-2026-10-31';
export function stateFor(id,defaults){
  let saved=memory.get(id);
  if(!saved)try{saved=JSON.parse(globalThis.sessionStorage?.getItem(storageKey)||'{}')[id];}catch{}
  const state={...defaults};for(const k of Object.keys(defaults))if(typeof saved?.[k]===typeof defaults[k])state[k]=saved[k];
  const save=()=>{memory.set(id,{...state});try{const all=JSON.parse(globalThis.sessionStorage?.getItem(storageKey)||'{}');all[id]=state;globalThis.sessionStorage?.setItem(storageKey,JSON.stringify(all));}catch{}};
  return {state,save};
}
export function updateMarker(root,marker){
  const pill=root.closest?.('article')?.querySelector('.ix-story-marker .ix-marker');
  if(pill&&MARKERS[marker.level]){pill.className='ix-marker ix-marker-'+marker.level;pill.textContent=L(MARKERS[marker.level]);}
}
export function evidence(shot,values,{label,ids,definition,sources}={}){
  const choices=sources||[...new Set(ids||(shot.claims||[]).flatMap(c=>story.claims[c]?.sources||[]))].map(id=>({id,...story.sources[id]}));
  const labels=parts('Evidence drawer'),panel=h('div',{}),select=h('select',{'aria-label':L(labels[0]),style:'width:100%;max-width:100%;'},choices.map(src=>h('option',{value:src.id},src.title)));
  const draw=()=>{
    const src=choices.find(s=>s.id===select.value)||choices[0];if(!src)return;
    const local={...values,...sourceValues(src)};
    const defined=definition||(src.id==='SRC-FI-05'?shared('Signature chart storage definition'):src.id==='SRC-FI-01'?parts('Signature chart axis / definition')[2]:shot.copy);
    fill(panel,h('dl',{class:'k-lane-terms',style:'overflow-wrap:anywhere;'},
      h('dt',{},L(labels[0])),h('dd',{},h('a',{href:src.url,target:'_blank',rel:'noopener noreferrer'},src.title)),
      h('dt',{},L(labels[1])),h('dd',{},src.locator||src.id),
      h('dt',{},text(labels[2],local)),h('dd',{},''),
      h('dt',{},L(labels[3])),h('dd',{},text(defined,local))));
  };
  const {state,save}=stateFor('evidence-'+shot.id+'-'+choices.map(s=>s.id).join('-'),{source:choices[0]?.id||'',open:false});
  select.value=choices.some(s=>s.id===state.source)?state.source:choices[0]?.id||'';
  select.onchange=()=>{state.source=select.value;save();draw();};draw();
  const details=h('details',{class:'ix-story-sources',...(state.open?{open:''}:{})},h('summary',{},L(label||parts('Common navigation')[3])),select,panel);
  details.addEventListener('toggle',()=>{state.open=details.open;save();});
  return details;
}
