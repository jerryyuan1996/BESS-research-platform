/* Lazy GB configuration; shared kit, shell, navigator and marker are unchanged. */
import '../../experience/story/kit/index.js';
import './story/story.css';
import {h} from '../../utils/dom.js';
import {L} from '../../app/i18n.js';
import {app} from '../../app/state.js';
import {openStory} from '../../experience/story/shell.js';
import {story} from './story.js';
import {storyBindings} from './storyBindings.js';
import {canOpen,reviewedContent} from './story/availability.js';
import {scenes,thumbnail} from './story/scenes.js';

export function open(ctx){
  if(!canOpen(ctx.row,app.lens??'infraFund'))return null;
  const bindings=storyBindings(ctx.row,ctx.ui);
  if(Number(bindings.values.playDuration)!==story.reviewedAgainst.hours)return null;
  const teaching=new Map();
  const drawing=Object.fromEntries(Object.entries(scenes).map(([id,make])=>[id,(shot,base)=>make(shot,{...base,...bindings,teaching})]));
  const available=reviewedContent(bindings.values);
  const dialog=openStory({...ctx,story:available,values:bindings.values,scenes:drawing});
  if(!dialog)return null;
  const openingFacts=()=>{
    const opening=dialog.querySelector('[data-shot="gb-00"] .ix-shot-text');
    if(!opening||opening.querySelector('.gb-opening-thumb'))return;
    const card=opening.querySelector('.ix-story-play');
    const price=bindings.values.operatingPrice;
    if(card){
      card.append(h('p',{class:'gb-opening-basis'},L(['The return shown is for building it new','所示回报为新建项目情景'])));
      if(price)card.append(h('p',{class:'gb-opening-price'},h('strong',{},L(['Buying operating','收购在运资产'])),' · ',L(price)));
      const secured=bindings.values.securedShare,years=bindings.values.securedTenor;
      if(secured!==null&&years!==null)card.append(h('p',{class:'gb-opening-secured'},L([secured+' secured for '+years+' years; merchant exposure after the toll.','锁定'+secured+'收入，期限'+years+'年；租赁期后承担市场风险。'])));
      card.append(h('small',{},L(['Model assumption, not a signed contract','模型假设，并非已签合同'])));
    }
    const svg=thumbnail(story.opening,bindings);svg.setAttribute('aria-hidden','true');
    opening.append(h('div',{class:'gb-opening-thumb'},svg));
  };
  openingFacts();dialog.addEventListener('click',openingFacts);
  return dialog;
}
