import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

let sequence=0, current=null, observer=null, dismissHover=false, pointerListener=false;
const owners=new Map();
/** Hover, keyboard focus or click; tap pins it, Escape/outside click dismisses.
 * Native popover top layer avoids table clipping. No HTML from source strings. */
export function explanation(label,title,content,{className='acq-explain'}={}){
  if(!pointerListener){document.addEventListener('pointermove',()=>{dismissHover=false;},{passive:true});pointerListener=true;}
  const id=`explain-${++sequence}`;
  const popup=h('div',{id,class:'acq-popover',popover:'auto',role:'dialog','aria-label':L(title)},
    h('div',{class:'acq-popover-heading'},h('b',{},L(title))));
  const button=h('button',{type:'button',class:className,'aria-controls':id,'aria-expanded':'false'},label);
  let pinned=false,timer=null,suppress=false;
  const close=()=>{clearTimeout(timer);if(popup.isConnected)popup.hidePopover?.();pinned=false;button.setAttribute('aria-expanded','false');};
  const show=()=>{
    clearTimeout(timer);if(suppress||dismissHover||!button.isConnected)return;
    if(current && current!==popup && current.isConnected && current.matches(':popover-open'))current.hidePopover?.();
    if(!popup.isConnected){
      owners.set(popup,button);document.body.append(popup);
      if(!observer){observer=new MutationObserver(()=>{
        for(const [node,owner] of owners)if(!owner.isConnected){node.remove();owners.delete(node);if(current===node)current=null;}
        if(!owners.size){observer.disconnect();observer=null;}
      });observer.observe(document.body,{childList:true,subtree:true});}
    }
    popup.showPopover?.();current=popup;button.setAttribute('aria-expanded','true');
    const r=button.getBoundingClientRect(),width=popup.offsetWidth;
    // Long source/assumption panels must scroll beside their trigger, never
    // cover it between pointerenter and click (including on small screens).
    const below=Math.max(0,innerHeight-r.bottom-16),above=Math.max(0,r.top-16);
    const useBelow=below>=Math.min(popup.scrollHeight,280)||below>=above;
    popup.style.maxHeight=Math.max(40,useBelow?below:above)+'px';
    const height=popup.offsetHeight;
    popup.style.left=Math.max(8,Math.min(r.left,innerWidth-width-8))+'px';
    popup.style.top=(useBelow?r.bottom+8:Math.max(8,r.top-height-8))+'px';
  };
  popup.append(typeof content==='function'?content():content,
    h('button',{type:'button',class:'acq-explain',onclick:()=>{dismissHover=true;suppress=true;close();button.focus();queueMicrotask(()=>{suppress=false;});}},L(['Close','关闭'])));
  button.addEventListener('pointerenter',show);
  button.addEventListener('pointerleave',()=>{if(!pinned)timer=setTimeout(close,250);});
  button.addEventListener('focus',()=>{if(!suppress){dismissHover=false;show();}});
  button.addEventListener('blur',event=>{if(!pinned&&!popup.contains(event.relatedTarget))timer=setTimeout(close,250);});
  button.addEventListener('click',()=>{dismissHover=false;pinned=true;show();});
  popup.addEventListener('pointerenter',()=>clearTimeout(timer));
  popup.addEventListener('pointerleave',()=>{if(!pinned)timer=setTimeout(close,250);});
  popup.addEventListener('toggle',event=>{if(event.newState==='closed'){pinned=false;button.setAttribute('aria-expanded','false');if(!button.isConnected)popup.remove();}});
  return button;
}
