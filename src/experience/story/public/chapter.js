import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {CHAPTERS} from './content.js';
import {renderResearchHistory,renderHistoryProvenance} from './historyChapter.js';

// Audit dispositions remain in the source registry; readers see the reuse boundary.
const readerReuse=text=>text
  .replace(/ Recorded under ro-build-evidence\.md §8; the analyst confirms the basis at G-2\./,'')
  .replace(/B-PL-RIGHTS closed at G-2 on 3 November 2026: official material on the art\. 4 basis, with the analyst recording this source-by-source disposition\./,'Official material on the art. 4 basis.');
const P=(text,cls='')=>h('p',{class:cls},L(text));
const TEXT={
  excerpt:['Research excerpt','研究摘录'],
  draft:['Economic interpretation','经济机制解读'],
  fact:['Sourced background','有来源的背景'],
  physical:['Power changes immediately; energy limits how long it can continue. Charging and discharging use the same connection. Controls must respect the connection agreement as well as the battery’s usable energy.', '功率可以快速改变，但电量限制了动作能持续多久。充放电共用同一并网连接。控制系统既要遵守并网协议，也要服从电池可用电量限制。'],
  equipment:['Cells and racks store DC energy. The PCS converts DC and AC; the transformer matches the grid voltage. Protection, metering, the busbar and the point of connection complete the electrical path.', '电芯与机架储存直流电量。PCS完成交直流转换，变压器匹配电网电压。保护、计量、母线与并网点共同组成完整电气路径。'],
  limit:['An illustration is not a dispatch model. The same power and energy cannot be promised twice; conversion losses, charging access and delivery obligations constrain compatible services.', '示意图不是调度模型。同一份功率和电量不能重复承诺；转换损耗、充电准入及交付义务，共同限制可兼容服务。'],
  interpretation:['The public reading connects a physical need to a participation mechanism. It does not establish an awarded contract, a project cash flow or an investor-specific return. Use the existing investment case for its own scope and assumptions.', '公共解读把物理需求与参与机制相连，并不确立中标合同、项目现金流或某类投资人的回报。既有投资方案须在其原有适用范围与假设下阅读。'],
};
export function renderChapter(data,id,ctx){
  const heading=h('h3',{tabindex:'-1'},L(CHAPTERS.find(c=>c[0]===id)[1]));
  const node=h('article',{class:'public-chapter','data-chapter':id},heading);
  if(data.latestCheckedOn)node.append(h('p',{class:'public-version-note public-source-check-note'},L(['Sources last checked: ','来源最近核对：']),data.latestCheckedOn));
  const sourceHref=url=>url?.includes('/jerryyuan1996/BESS-research-platform')?ctx.researchUrl:url;
  const badge=text=>h('p',{class:'public-content-label'},L(text));
  const excerpts=section=>data.extracts[section].map(e=>h('blockquote',{class:'public-reference'},badge(TEXT.excerpt),h('h4',{},L(e.question)),P(e.text),
    h('details',{},h('summary',{},L(['Excerpt provenance','原文追溯'])),h('ul',{},(e.sourceIds||[]).map(key=>data.sources[key]).filter(source=>source?.url).map(source=>h('li',{},h('a',{href:sourceHref(source.url),target:'_blank',rel:'noopener noreferrer'},source.title)))))));
  if(id==='history')node.append(renderResearchHistory(data.historyResearch,ctx.researchUrl));
  if(id==='research'&&data.logicSources)node.append(h('section',{class:'public-logic-sources'},h('h4',{},L(['Evidence for the value and revenue explanations','价值与收入叙事的依据'])),
    h('ul',{},Object.values(data.logicSources).map(source=>h('li',{},h('a',{href:source.url,target:'_blank',rel:'noopener noreferrer'},source.title),P(['Checked '+source.checkedOn,'核对日期 '+source.checkedOn]))))));
  if(data.summary.historyOnly){
    if(id==='research')node.append(renderHistoryProvenance(data.historyResearch,ctx.researchUrl),
      P(['Market development history from the existing research.','既有研究中的市场发展历程。']),
      h('button',{type:'button',class:'ix-button',onclick:ctx.research},L(['Open full research','打开完整研究'])));
    return node;
  }
  if(id==='system')node.append(badge(TEXT.draft),P(data.constraint,'public-chapter-lead'),P(data.summary.logic),...excerpts('system'));
  if(id==='mechanism')node.append(badge(TEXT.draft),P(data.payment,'public-chapter-lead'),...excerpts('mechanism'));
  if(id==='storage')node.append(badge(TEXT.draft),P(TEXT.equipment,'public-chapter-lead'),P(TEXT.physical),P(TEXT.limit));
  if(id==='judgement')node.append(badge(TEXT.draft),P(data.summary.logic,'public-chapter-lead'),
    h('div',{class:'public-condition-card'},h('strong',{},L(['What would change this reading','会改变当前解读的条件'])),P(data.summary.condition)),
    P(TEXT.interpretation),P(['Fair evidence · inspect the dated sources and conditions below.', '证据一般 · 请结合下方带日期的来源与成立条件阅读。'],'public-evidence-marker'));
  if(['system','mechanism','storage'].includes(id)){
    const holder=h('div',{class:'public-scene-host','aria-busy':'true'},L(['Loading explanatory scene…','正在加载机制示意图…']));
    node.append(holder);
    let attempt=0;
    const draw=async()=>{
      const run=++attempt;
      holder.setAttribute('aria-busy','true');
      /* The market's step-through sequences come with its scene; a market with
         none, or a sequence chunk that fails, still gets the three views. */
      try{const scene=await import('./scene.js');const sequences=await scene.loadSequences(data.marketId);if(run!==attempt||!ctx.alive())return;holder.replaceChildren(scene.renderScene(data,id,{sequences}));}
      catch{if(run===attempt&&ctx.alive())holder.replaceChildren(P(['Scene unavailable; the text and sources remain readable. Retry reloads this chapter.','场景暂不可用；正文与来源仍可阅读。重试将重新加载本章。']),h('button',{type:'button',class:'ix-button ix-outline',onclick:()=>window.location.reload()},L(['Retry scene','重试场景'])));}
      finally{holder.setAttribute('aria-busy','false');}
    };draw();
  }
  /* The research behind the chapter, where the market's research is placed
     (src/experience/researchMap.js). The page supplies the closed disclosure;
     this reading imports no research and fetches none until it is opened. */
  if(['system','mechanism'].includes(id)){const behind=ctx.researchContext?.(id);if(behind)node.append(behind);}
  const all=Object.entries(data.sources||{}).filter(([,s])=>s.url);
  const sectionSourceIds=new Set([...(data.sourceIdsByChapter?.[id]||[]),...data.extracts[id==='history'?'history':id==='system'?'system':'mechanism'].flatMap(e=>e.sourceIds),...(data.regionalSourceIds||[])]);
  const selected=all.filter(([key])=>sectionSourceIds.has(key));
  const refs=id==='research'||data.sourceGroups?all:(selected.length?selected:all.slice(0,5));
  const sourceList=entries=>h('ul',{},entries.map(([key,s])=>h('li',{'data-source-id':key},h('a',{href:sourceHref(s.url),target:'_blank',rel:'noopener noreferrer'},s.title),
    s.checkedOn?h('small',{},L(['Sources last checked: ','来源最近核对：']),s.checkedOn):null,
    typeof s.locator==='string'?h('p',{class:'public-source-locator'},s.locator):null,
    s.reuse?.constraints?h('p',{class:'public-source-locator'},readerReuse(s.reuse.constraints)):null)));
  const renderedSources=data.sourceGroups?data.sourceGroups.map(group=>h('section',{class:'public-source-group','data-source-scope':group.id},
    h('h4',{},L(group.title)),sourceList(refs.filter(([key])=>group.ids.includes(key))))):sourceList(refs);
  node.append(h('details',{class:'public-chapter-sources',...(id==='research'?{open:''}:{})},
    h('summary',{},L(['Source records & original scope','来源记录与原适用范围'])),
    data.latestCheckedOn?h('p',{'data-date-kind':'source-check'},L(['Sources last checked: ','来源最近核对：']),data.latestCheckedOn):null,
    renderedSources,
    h('a',{href:ctx.researchUrl},L(['Full market research ↗','完整市场研究 ↗']))));

  if(id==='research')node.append(h('div',{class:'ix-actions'},
    h('button',{type:'button',class:'ix-button',onclick:ctx.research},L(['Open full research','打开完整研究'])),
    ctx.legacy?h('button',{type:'button',class:'ix-button ix-outline',onclick:ctx.legacy},L(['Investor-specific story','投资人专项叙事'])):null));
  if(id==='research'&&Object.keys(data.internalReferences).length)node.append(h('section',{class:'public-internal-references'},
    h('h4',{},L(['Existing research & model context','既有研究与模型背景'])),
    P(['These internal research links retain their original scope. They are distinct from the external primary evidence above.','以下为保留原适用范围的内部研究入口，与上方外部原始证据分别列示。']),
    h('ul',{},Object.values(data.internalReferences).map(s=>h('li',{},h('a',{href:sourceHref(s.url)},s.title))))));
  return node;
}
