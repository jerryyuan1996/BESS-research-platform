import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { marketResearchSummary } from './researchSummary.js';
export function openResearchDialog(market,name,trigger){
  const previousOverflow=document.body.style.overflow;
  const close=h('button',{type:'button',class:'ix-button ix-outline ix-dialog-close','aria-label':L(['Close research details','关闭研究详情']),autofocus:true},L(['Close ×','关闭 ×']));
  const dialog=h('dialog',{class:'ix-dialog ix-research-dialog','aria-labelledby':'ix-research-title'},
    h('div',{class:'ix-research-heading'},h('h2',{id:'ix-research-title'},name+' · '+L(['Grid, history and full research context','电网、历史与完整研究背景'])),close),
    h('div',{class:'ix-app ix-research-body'},marketResearchSummary(market)));
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;dialog.remove();trigger?.focus({preventScroll:true});},{once:true});
  dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(a.target!=='_blank')dialog.close();}));
  document.body.append(dialog);document.body.style.overflow='hidden';dialog.showModal();
  return dialog;
}
