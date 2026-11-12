import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

/** The two entrances share a reader and keep its research off the initial page. */
export function marketResearchLink(marketId, kind) {
  const grid = kind === 'grid';
  const label = grid ? ['Explore grid details', '电网详情'] : ['Explore revenue & design', '收入与设计详解'];
  const trigger = h('button', { type: 'button', class: 'market-research-link', 'data-market-research': kind, 'data-market': marketId,
    'aria-haspopup': 'dialog', onclick: async () => {
      trigger.disabled = true;
      trigger.setAttribute('aria-busy', 'true');
      try {
        const { openMarketResearch } = await import('./marketResearchDialog.js');
        if (trigger.isConnected) openMarketResearch(marketId, kind, trigger);
      } catch {
        title.textContent = L(['Could not load — click to retry', '暂未载入，点击重试']);
      } finally {
        trigger.disabled = false;
        trigger.removeAttribute('aria-busy');
      }
    } },
    h('span', {}, h('strong', {}, L(label)), h('small', {}, L(grid
      ? ['Constraints, network upgrades & connection', '拥塞约束、输电工程与并网交付']
      : ['Capacity, energy, balancing & storage duration', '容量机制、电能量、辅助服务与储能时长']))),
    h('span', { class: 'market-research-arrow', 'aria-hidden': 'true' }, '↗'));
  const title = trigger.querySelector('strong');
  return trigger;
}
