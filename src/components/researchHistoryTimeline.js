import {h} from '../utils/dom.js';
import {L} from '../app/i18n.js';

/** One full-node renderer for original research and the shared public history. */
export function researchHistoryTimeline(items,{axis='history',owner='research'}={}){
  return h('div',{class:'timeline',role:'list'},items.map((e,i)=>h('div',{
    class:'tl-item',role:'listitem','data-history-node':`${owner}-${axis}-${i}`},
    h('div',{class:'tl-year','data-history-field':'y'},e.y),
    h('div',{class:'tl-body'},h('h4',{'data-history-field':'t'},L(e.t)),
      h('p',{'data-history-field':'p'},L(e.p)),
      e.i?h('p',{class:'imp'},h('b',{},L(['Capital lens: ','资本视角：'])),h('span',{'data-history-field':'i'},L(e.i))):null))));
}
