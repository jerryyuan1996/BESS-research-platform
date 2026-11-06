/* Public reading shell. Reuses the native dialog, story navigation styles and
   whitelisted history-place API. No investor row or model enters this module. */
import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {app,setLang,requestRender} from '../../../app/state.js';
import {recordStoryPlace as recordPlace,onStoryPlace as onPlaceChange,navigate} from '../../../app/router.js';
import {CHAPTERS,loadPublicContent,publicPlace,readPublicPlace} from './content.js';
import {PUBLIC_CATALOG,PUBLIC_VERSION} from './catalog.js';
import './public.css';

export function open(ctx){
  const summary=PUBLIC_CATALOG[ctx.id];
  if(!summary)return null;
  const initial=readPublicPlace(ctx.place);
  let chapter=initial.chapter, data=null, closed=false, stop=null, version=0;
  let locale=initial.locale||app.lang;
  const previousOverflow=document.body.style.overflow, previousScroll=[window.scrollX,window.scrollY];
  const dialog=h('dialog',{class:'ix-dialog ix-story-dialog public-story-dialog','aria-labelledby':'public-story-title','data-market':ctx.id,'data-version':PUBLIC_VERSION});
  let body,nav,closeBtn,langBtn;
  const alive=()=>!closed;
  const remember=(how='push')=>recordPlace(publicPlace(chapter,locale),how);
  function close({fromHistory=false,restore=true}={}){
    if(closed)return;closed=true;version++;stop?.();
    if(!fromHistory)recordPlace(null,'push');
    if(dialog.open)dialog.close();dialog.remove();
    document.body.style.overflow=previousOverflow;
    if(restore){window.scrollTo(...previousScroll);const trigger=ctx.trigger?.isConnected?ctx.trigger:document.querySelector('.public-story-trigger');trigger?.focus({preventScroll:true});}
  }
  const research=()=>{const trigger=dialog.querySelector('.public-research-button');ctx.openResearch?.(trigger);};
  const legacy=()=>{close({restore:false});ctx.openLegacy?.();};
  function build(){
    dialog.lang=locale;dialog.dataset.locale=locale;
    closeBtn=h('button',{type:'button',class:'ix-button ix-outline','aria-label':L(['Close market background','关闭市场背景']),onclick:()=>close()},L(['Close ×','关闭 ×']));
    langBtn=h('button',{type:'button',class:'ix-button ix-outline','aria-label':L(['Switch to Chinese','切换到英文']),onclick:()=>{
      locale=locale==='en'?'zh':'en';setLang(locale);requestRender();build();remember('replace');show(chapter,{history:false,focus:false});langBtn.focus();
    }},locale==='en'?'中文':'EN');
    const regions={jp_tokyo:['Tokyo / Kanto','东京／关东'],jp_kyushu:['Kyushu','九州'],jp_hokkaido:['Hokkaido','北海道']};
    const regionSelect=ctx.id.startsWith('jp_')?h('select',{'aria-label':L(['Japan region','日本地区']),onchange:e=>{
      const slug={jp_tokyo:'japan-tokyo',jp_kyushu:'japan-kyushu',jp_hokkaido:'japan-hokkaido'}[e.target.value];
      const params=new URLSearchParams(location.search);const p=publicPlace(chapter,locale);params.set('view','story');params.set('chapter',p.chapter);params.set('shot',p.shot);navigate('/markets/'+slug+'?'+params);
    }},Object.entries(regions).map(([id,label])=>h('option',{value:id,...(id===ctx.id?{selected:''}:{})},L(label)))):null;
    const head=h('header',{class:'public-story-head'},
      h('div',{},h('p',{class:'ix-eyebrow'},L(['PUBLIC MARKET READING','公共市场叙事'])),h('h2',{id:'public-story-title'},L(ctx.name)),
        h('p',{class:'public-story-meta'},L(['All investors · Public logic review pending','所有投资人 · 公共逻辑待确认']),' · ',PUBLIC_VERSION)),
      h('div',{class:'public-story-tools'},...(regionSelect?[regionSelect]:[]),langBtn,
        h('button',{type:'button',class:'ix-button ix-outline public-research-button',onclick:research},L(['Full research ↗','完整研究 ↗'])),closeBtn));
    nav=h('nav',{class:'public-story-nav','aria-label':L(['Public story chapters','公共叙事章节'])},CHAPTERS.map(([id,title],i)=>h('button',{type:'button','data-chapter':id,onclick:()=>show(id)},String(i+1).padStart(2,'0'),' · ',L(title))));
    body=h('div',{class:'public-story-body',tabindex:'-1','aria-live':'polite'});
    dialog.replaceChildren(head,nav,body);
  }
  async function show(id,{history=true,focus=true}={}){
    chapter=CHAPTERS.some(c=>c[0]===id)?id:'history';
    const run=++version;
    nav.querySelectorAll('button').forEach(b=>{if(b.dataset.chapter===chapter)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    if(history)remember();
    body.replaceChildren(h('p',{class:'public-loading'},L(['Loading this chapter…','正在加载本章…'])));
    body.setAttribute('aria-busy','true');
    try{
      const [content,renderer]=await Promise.all([data||loadPublicContent(ctx.id),import('./chapter.js')]);
      if(closed||run!==version)return;
      data=content;
      const node=renderer.renderChapter(data,chapter,{alive:()=>alive()&&run===version,research,legacy:ctx.id==='ercot'?null:legacy});
      const versionNote=initial.version&&initial.version!==PUBLIC_VERSION?h('p',{role:'status',class:'public-version-note'},L(['This link names an older edition. Showing the current review draft: ','链接指向其他版本。当前显示最新待确认稿：']),PUBLIC_VERSION):null;
      body.replaceChildren(...(versionNote?[versionNote]:[]),node,
        h('footer',{class:'public-chapter-footer'},h('span',{},L(['Source-script review: ','来源脚本复核：']),summary.reviewedOn),
          chapter!=='research'?h('button',{type:'button',class:'ix-button ix-outline',onclick:()=>show(CHAPTERS[CHAPTERS.findIndex(c=>c[0]===chapter)+1][0])},L(['Next chapter →','下一章 →'])):h('button',{type:'button',class:'ix-button ix-outline',onclick:()=>close()},L(['Return to overview','返回市场概况']))));
      body.scrollTop=0;if(focus)node.querySelector('h3')?.focus({preventScroll:true});
    }catch{
      if(closed||run!==version)return;
      body.replaceChildren(h('h3',{},L(['Chapter could not load','本章未能加载'])),h('p',{},L(summary.history)),h('p',{},L(summary.logic)),
        h('button',{type:'button',class:'ix-button',onclick:()=>window.location.reload()},L(['Retry chapter','重试本章'])),
        h('a',{class:'ix-text-link',href:ctx.researchUrl},L(['Read the existing research ↗','阅读既有研究 ↗'])));
    }finally{if(!closed&&run===version)body.setAttribute('aria-busy','false');}
  }
  if(locale!==app.lang){setLang(locale);requestRender();}
  build();document.body.append(dialog);document.body.style.overflow='hidden';dialog.showModal();closeBtn.focus();
  remember(ctx.place?'replace':'push');show(chapter,{history:false,focus:false});
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('close',()=>close());
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});
  stop=onPlaceChange((route,{samePage})=>{
    if(!samePage||!route.story?.shot?.startsWith('public-'))return close({fromHistory:true,restore:samePage});
    const place=readPublicPlace(route.story);
    if(place.locale&&place.locale!==locale){locale=place.locale;setLang(locale);requestRender();build();}
    show(place.chapter,{history:false});
  });
  return dialog;
}
