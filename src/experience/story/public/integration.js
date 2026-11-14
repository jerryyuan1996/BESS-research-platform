import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import './integration.css';
import {INTEGRATED_CHAPTER} from './integrationModel.js';

// Exhaustive mapping: every original shot appears once in the unified reading.
const titles={
 history:['How historical choices shape the investment','历史选择如何影响投资'],
 overview:['Grid geography and system foundations','电网地理与系统基础'],
 system:['Engineering, constraints and detailed evidence','工程路径、约束与详细依据'],
 mechanism:['Contract terms, payment charts and detailed evidence','合同条款、付费图解与详细依据'],
 investment:['Reference investment case and downside','参考投资方案与下行情景'],
};

export function integrateChapter(node,chapter,ctx){
 if(chapter==='investment')node.append(ctx.currentCase());
 if(chapter==='research'){
  node.append(h('h4',{},L(['Full market research in context','完整市场研究背景'])),ctx.researchSummary());
  return;
 }
 if(!titles[chapter]||!ctx.hasMaterials)return;
 const host=h('div',{class:'unified-material-body'}),panel=h('details',{class:'unified-material',...(chapter==='investment'?{open:''}:{})},
  h('summary',{},L(titles[chapter])),host);
 node.append(panel);
 let loaded=false,pending=null,attempt=0;
 function fill(){
  if(loaded)return Promise.resolve();
  if(pending)return pending;
  pending=load().finally(()=>{pending=null;});return pending;
 }
 async function load(){
  const run=++attempt;host.setAttribute('aria-busy','true');
  host.replaceChildren(h('p',{},L(['Loading supporting explanation…','正在载入详细解释…'])));
  try{
   const material=await ctx.materials();if(!ctx.alive()||run!==attempt)return;
   if(!material)throw new Error('Material unavailable');
   const shots=[...material.querySelectorAll('[data-shot]')].filter(el=>INTEGRATED_CHAPTER[el.dataset.originalChapter]===chapter);
   const details=shots.map(shot=>{
    const title=shot.querySelector('h4').textContent;
    const detail=h('details',{class:'unified-detail','data-integrated-shot':shot.dataset.shot},h('summary',{},title),shot);
    if(chapter==='investment'&&shot.dataset.originalChapter==='opening')detail.open=true;
    return detail;
   });
   // Retain pack-level classes for the market's original chart styles.
   host.classList.add(...[...material.classList].filter(c=>c!=='unified-story-material'));
   host.replaceChildren(h('p',{class:'unified-case-scope'},L(['Reference case · infrastructure-fund perspective. Figures retain the original route and model basis; your selected case is shown in Investment decision.','研究参考案例 · 基础设施基金视角。数值保留原路径与模型口径；您选定的方案见“回到投资决策”。'])),...details);
   host.querySelectorAll('a[href*="github.com/jerryyuan1996/BESS-research-platform"]').forEach(a=>a.href=ctx.researchUrl);
   loaded=true;
  }catch{
   if(ctx.alive()&&run===attempt)host.replaceChildren(h('p',{},L(['The detailed explanation could not load.','详细解释暂未载入。'])),h('button',{type:'button',class:'ix-button ix-outline',onclick:fill},L(['Retry explanation','重试详细解释'])));
  }finally{if(run===attempt)host.setAttribute('aria-busy','false');}
 }
 panel.addEventListener('toggle',()=>{if(panel.open&&!loaded)fill();});
 if(panel.open)fill();
 return async()=>{panel.open=true;await fill();};
}

export function renderChapter(data,id){
 return h('article',{class:'public-chapter unified-investment','data-chapter':id},h('h3',{tabindex:-1},L(['From system value to an investable project','从系统价值，走向可投资项目'])),
  h('p',{},L(['Bring the physical constraint and payment rights into the same case. Then test entry price, funding and downside.','把物理约束与付款权利带入同一方案，再检验进入价格、融资与下行情景。'])));
}
