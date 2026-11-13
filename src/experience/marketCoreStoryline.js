import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { loadMarketResearch } from './marketResearchSource.js';
import { CORE_STORYLINE } from '../markets/ro/coreStoryline.js';

// Read the market's own published narrative, in its existing regional lens.
// Figures and judgement remain owned by the research, not the page shell.
export async function mountCoreStoryline(host, id) {
  const source = await loadMarketResearch(id);
  if (!host.isConnected) return;
  const groups = await source.module.researchExcerpt(source.route, [{ section:'home' }], { isCurrent:()=>host.isConnected });
  if (!host.isConnected) return;
  const narrative = groups[0]?.storyline;
  if (!narrative) throw new Error('Core storyline unavailable');
  host.setAttribute('data-storyline-market', id);
  const label = h('p', { class:'ix-eyebrow' }, L(['CORE STORYLINE', '核心叙事']));
  if (id === 'ro') {
    host.replaceChildren(label, h('h3', {}, L(CORE_STORYLINE.conclusion)),
      ...['revenue','opportunity','execution'].map(key => h('p', {}, L(CORE_STORYLINE[key]))));
    return;
  }
  const text = L(narrative);
  const match = text.match(/^([\s\S]+?[。！？])([\s\S]*)$/u) || text.match(/^([\s\S]+?[.!?])\s+([\s\S]*)$/u);
  host.replaceChildren(label, h('h3', {}, match ? match[1] : text), match?.[2]?.trim() ? h('p', {}, match[2].trim()) : null);
  const regional = groups[0].regionalView;
  if (regional && L(regional) !== text) host.append(h('p', { class:'public-regional-view' }, L(regional)));
}
