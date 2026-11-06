import {h} from '../../../utils/dom.js';
import {L} from '../../../app/i18n.js';
import {CHAPTERS} from './content.js';

const P=(text,cls='')=>h('p',{class:cls},L(text));
const TEXT={
  excerpt:['Reference · original signed script','参考事实 · 原签核脚本原文'],
  draft:['Public interpretation · review pending','公共解读 · 待确认'],
  fact:['Source-backed background · reorganised for public review','有来源背景 · 公共重组待确认'],
  physical:['Power changes immediately; energy limits how long it can continue. Charging and discharging use the same connection. Controls must respect the connection agreement as well as the battery’s usable energy.', '功率可以快速改变，但电量限制了动作能持续多久。充放电共用同一并网连接。控制系统既要遵守并网协议，也要服从电池可用电量限制。'],
  equipment:['Cells and racks store DC energy. The PCS converts DC and AC; the transformer matches the grid voltage. Protection, metering, the busbar and the point of connection complete the electrical path.', '电芯与机架储存直流电量。PCS完成交直流转换，变压器匹配电网电压。保护、计量、母线与并网点共同组成完整电气路径。'],
  limit:['An illustration is not a dispatch model. The same power and energy cannot be promised twice; conversion losses, charging access and delivery obligations constrain compatible services.', '示意图不是调度模型。同一份功率和电量不能重复承诺；转换损耗、充电准入及交付义务，共同限制可兼容服务。'],
  interpretation:['The public reading connects a physical need to a participation mechanism. It does not establish an awarded contract, a project cash flow or an investor-specific return. Use the existing investment case for its own scope and assumptions.', '公共解读把物理需求与参与机制相连，并不确立中标合同、项目现金流或某类投资人的回报。既有投资方案须在其原有适用范围与假设下阅读。'],
};
export function renderChapter(data,id,ctx){
  const heading=h('h3',{tabindex:'-1'},L(CHAPTERS.find(c=>c[0]===id)[1]));
  const node=h('article',{class:'public-chapter','data-chapter':id},heading);
  if(data.evidenceUpdated)node.append(h('p',{class:'public-version-note',role:'status'},L(['Evidence record updated after the source-script review: ','证据记录晚于来源脚本复核：']),data.latestSourceOn,' · ',L(['Recheck the linked sources; the public interpretation remains pending.','请复核链接来源；公共解读仍待确认。'])));
  const badge=text=>h('p',{class:'public-content-label'},L(text));
  const excerpts=section=>data.extracts[section].map(e=>h('blockquote',{class:'public-reference'},badge(TEXT.excerpt),h('h4',{},L(e.question)),P(e.text),
    h('details',{},h('summary',{},L(['Excerpt provenance','原文追溯'])),h('small',{},e.shotId,' · ',e.claimIds.join(' / ')))));
  if(id==='history')node.append(badge(TEXT.fact),P(data.summary.history,'public-chapter-lead'),...(data.background?[P(data.background)]:[]),
    h('ol',{class:'public-history-timeline','aria-label':L(['Institutional timeline','制度时间轴'])},(data.timeline||[]).map(([when,en,zh])=>h('li',{},h('time',{},when),P([en,zh])))),...excerpts('history'));
  if(id==='system')node.append(badge(TEXT.draft),P(data.constraint,'public-chapter-lead'),P(data.summary.logic),...excerpts('system'));
  if(id==='mechanism')node.append(badge(TEXT.draft),P(data.payment,'public-chapter-lead'),...excerpts('mechanism'));
  if(id==='storage')node.append(badge(TEXT.draft),P(TEXT.equipment,'public-chapter-lead'),P(TEXT.physical),P(TEXT.limit));
  if(id==='judgement')node.append(badge(TEXT.draft),P(data.summary.logic,'public-chapter-lead'),
    h('div',{class:'public-condition-card'},h('strong',{},L(['What would change this reading','会改变当前解读的条件'])),P(data.summary.condition)),
    P(TEXT.interpretation),P(['Fair · the new public interpretation awaits content confirmation; dated source records remain inspectable below.', '一般 · 新的公共解读仍待内容确认；下方可核查带日期的来源记录。'],'public-evidence-marker'));
  if(['system','mechanism','storage'].includes(id)){
    const holder=h('div',{class:'public-scene-host','aria-busy':'true'},L(['Loading explanatory scene…','正在加载机制示意图…']));
    node.append(holder);
    let attempt=0;
    const draw=async()=>{
      const run=++attempt;
      holder.setAttribute('aria-busy','true');
      try{const scene=await import('./scene.js');if(run!==attempt||!ctx.alive())return;holder.replaceChildren(scene.renderScene(data,id));}
      catch{if(run===attempt&&ctx.alive())holder.replaceChildren(P(['Scene unavailable; the text and sources remain readable. Retry reloads this chapter.','场景暂不可用；正文与来源仍可阅读。重试将重新加载本章。']),h('button',{type:'button',class:'ix-button ix-outline',onclick:()=>window.location.reload()},L(['Retry scene','重试场景'])));}
      finally{holder.setAttribute('aria-busy','false');}
    };draw();
  }
  const all=Object.entries(data.sources||{}).filter(([,s])=>s.url);
  const sectionSourceIds=new Set([...(data.sourceIdsByChapter?.[id]||[]),...data.extracts[id==='history'?'history':id==='system'?'system':'mechanism'].flatMap(e=>e.sourceIds),...(data.regionalSourceIds||[])]);
  const selected=all.filter(([key])=>sectionSourceIds.has(key));
  const refs=id==='research'||data.sourceGroups?all:(selected.length?selected:all.slice(0,5));
  const sourceList=entries=>h('ul',{},entries.map(([key,s])=>h('li',{'data-source-id':key},h('a',{href:s.url,target:'_blank',rel:'noopener noreferrer'},s.title),
    h('small',{},key,s.checkedOn?' · '+s.checkedOn:''),
    typeof s.locator==='string'?h('p',{class:'public-source-locator'},s.locator):null,
    s.reuse?.constraints?h('p',{class:'public-source-locator'},s.reuse.constraints):null)));
  const renderedSources=data.sourceGroups?data.sourceGroups.map(group=>h('section',{class:'public-source-group','data-source-scope':group.id},
    h('h4',{},L(group.title)),sourceList(refs.filter(([key])=>group.ids.includes(key))))):sourceList(refs);
  node.append(h('details',{class:'public-chapter-sources',...(id==='research'?{open:''}:{})},
    h('summary',{},L(['Source records & original scope','来源记录与原适用范围'])),
    P(['Source-script review: '+data.summary.reviewedOn+' · Public edition '+data.version+' · Public logic review pending.', '来源脚本复核：'+data.summary.reviewedOn+' · 公共版本'+data.version+' · 公共逻辑待确认。']),
    renderedSources,
    h('a',{href:`https://github.com/jerryyuan1996/BESS-research-platform/blob/c0229820ff609e38f45b259c3abf9a948aaee51c/${data.script}`,target:'_blank',rel:'noopener noreferrer'},L(['Original script & approval scope ↗','原脚本与签核范围 ↗'])),
    P(['Original script version: '+data.legacyVersion+'. Original investor, strategy and stage restrictions remain in force. Public edits have no new Jerry sign-off.', '原脚本版本：'+data.legacyVersion+'。原投资人、策略与阶段限制继续有效；公共编辑尚无新的Jerry签核。'])));
  if(id==='research')node.append(h('div',{class:'ix-actions'},
    h('button',{type:'button',class:'ix-button',onclick:ctx.research},L(['Open full research','打开完整研究'])),
    ctx.legacy?h('button',{type:'button',class:'ix-button ix-outline',onclick:ctx.legacy},L(['Original scoped story','原适用范围Story'])):null));
  if(id==='research'&&Object.keys(data.internalReferences).length)node.append(h('section',{class:'public-internal-references'},
    h('h4',{},L(['Existing research & model context','既有研究与模型背景'])),
    P(['These internal research links retain their original scope. They are distinct from the external primary evidence above.','以下为保留原适用范围的内部研究入口，与上方外部原始证据分别列示。']),
    h('ul',{},Object.values(data.internalReferences).map(s=>h('li',{},h('a',{href:s.url},s.title))))));
  return node;
}
