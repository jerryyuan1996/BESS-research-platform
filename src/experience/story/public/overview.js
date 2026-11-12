import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { PUBLIC_READING_CATALOG } from './historyCatalog.js';
import { marketResearchLink } from '../../marketResearchLink.js';

export function renderPublicOverview(id, { name, open }){
  const c = PUBLIC_READING_CATALOG[id];
  if (!c) return null;
  const trigger = h('button', { type:'button', class:'ix-button public-story-trigger', onclick:()=>open(trigger) }, L(c.historyOnly?['Market development history','市场发展历程']:['Market background & investment logic', '市场背景与投资逻辑']), ' ↗');
  const context = h('div', { class:'market-overview-context', 'aria-busy':'true' });
  const section = h('section', { id:'overview', class:'public-overview', 'data-public-market':id, 'data-version':c.version, 'data-status':c.status, 'aria-labelledby':'public-overview-title' },
    h('div', { class:'public-overview-heading' },
      h('p', { class:'ix-eyebrow' }, L(['MARKET BACKGROUND · SHARED RESEARCH', '市场背景 · 公共研究'])),
      h('h2', { id:'public-overview-title' }, L(c.historyOnly?['How this market developed.','这个市场如何发展至今。']:['Why storage matters here.', '储能为何在这里有价值。']))),
    h('div', { class:'public-overview-grid' },
      h('div', { class:'public-overview-copy' },
        h('p', { class:'public-history' }, L(c.history)),
        h('p', { class:'public-logic' }, L(c.historyOnly?['Read the complete timeline, explanations and capital lenses from the existing market research.','阅读既有市场研究的完整时间线、解释与资本视角。']:c.logic)),
        c.historyOnly?null:h('p', { class:'public-condition' }, h('strong',{},L(['Key condition · ', '成立条件 · '])), L(c.condition))),
      h('aside', { class:'public-overview-reading' },
        trigger,
        h('p',{class:'public-status','role':'status'}))));
  {
    section.classList.add('market-overview');
    const left = h('div', { class: 'market-overview-story' },
      section.querySelector('.public-overview-heading'), section.querySelector('.public-overview-copy'),
      context,
      section.querySelector('.public-overview-reading'));
    const host = h('div', { class: 'market-overview-map', 'aria-busy': 'true' });
    const load = async () => {
      host.setAttribute('aria-busy', 'true');
      host.replaceChildren(h('p', { class: 'ix-caption' }, L(['Loading the grid map…', '正在载入电网地图…'])));
      try {
        const { mountMarketGrid } = await import('../../marketGrid.js');
        if (host.isConnected) await mountMarketGrid(host, id);
      } catch {
        if (host.isConnected) host.replaceChildren(h('button', { type: 'button', class: 'ix-button ix-outline', onclick: load }, L(['Retry grid map', '重试电网地图'])));
      } finally { host.setAttribute('aria-busy', 'false'); }
    };
    section.replaceChildren(left, h('div', { class: 'market-overview-geography' },
      h('div', { class: 'market-map-heading' }, h('div', {},
        h('p', { class: 'ix-eyebrow' }, L(['THE GEOGRAPHY OF VALUE', '价值的地理分布'])),
        h('h3', {}, L(name) + ' · ' + L(['Electricity network', '电网']))),
        h('span', { class: 'market-map-hint' }, L(['Select a location to explore', '点击地点，查看影响']))),
      host, marketResearchLink(id, 'grid')));
    // The host is connected by the caller before this import resolves.
    load();
    const loadContext = async () => {
      context.setAttribute('aria-busy', 'true');
      context.replaceChildren(h('p', { class:'ix-caption' }, L(['Loading market context…', '正在载入市场格局…'])));
      try {
        const { mountMarketOverviewContext } = await import('../../marketOverviewContext.js');
        if (context.isConnected) await mountMarketOverviewContext(context, id);
      } catch {
        if (context.isConnected) context.replaceChildren(h('button', { type:'button', class:'ix-button ix-outline', onclick:loadContext }, L(['Retry market context', '重试市场格局'])));
      } finally { context.setAttribute('aria-busy', 'false'); }
    };
    // Both readers use the same cached market payload, with independent retries.
    loadContext();
  }
  return section;
}
