import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { gridMapForMarket } from '../markets/gridMapRegistry.js';
import { loadMarketResearch } from './marketResearchSource.js';

// Reuse the published card itself; no second transcription of its figures or analysis.
const RESEARCH_CARDS = { it: { section:'story', cards:['Six bidding zones, and what each one offers a battery'] } };

export async function mountMarketOverviewContext(host, id) {
  const { market, module, route } = await loadMarketResearch(id);
  if (!host.isConnected) return;
  const pick = RESEARCH_CARDS[id];
  if (pick) {
    const groups = await module.researchExcerpt(route, [pick], { isCurrent:()=>host.isConnected });
    if (!host.isConnected) return;
    const card = groups[0]?.cards[0];
    if (!card) throw new Error('Market context unavailable');
    host.setAttribute('data-context-card', card.key);
    card.draw(host, el => {
      const body = el.querySelector(':scope > .card');
      if (!body) return;
      body.classList.add('market-context-card');
      // The complete reading remains available while all six zones stay visible.
      for (const why of body.querySelectorAll(':scope > .why')) {
        const detail = h('details', { class:'market-context-analysis' },
          h('summary', {}, L(['Why the location changes the investment case', '区域如何影响投资判断'])));
        why.replaceWith(detail);
        detail.append(why);
      }
    });
    return;
  }

  // Lift the existing current-period map reading into the opening column.
  // Japan keeps its exact regional lens; no new market judgements are authored.
  const owner = market.manifest.dashboardId || id;
  let map = gridMapForMarket(owner, route.region);
  // Some dashboards register maps only when their grid section loads. Ask that
  // owner's existing loader to prepare the section without drawing any cards.
  // Keeping this inside the owner also preserves the per-market bundle split.
  if (!map) {
    await module.researchExcerpt(route, [{ section:'grid', cards:[] }], { isCurrent:()=>host.isConnected });
    map = gridMapForMarket(owner, route.region);
  }
  if (!host.isConnected) return;
  const current = map?.periods.current;
  if (!current?.kicker || !current.thesis || !current.implication) throw new Error('Market context unavailable');
  host.setAttribute('data-context-map', map.id);
  host.replaceChildren(h('article', { class:'market-context-card' },
    h('div', { class:'market-context-heading' },
      h('p', { class:'ix-eyebrow' }, L(['SYSTEM & LOCATION', '系统与区位'])),
      h('span', { class:'market-context-period' }, L(current.label))),
    h('h3', {}, L(current.kicker)),
    h('p', { class:'market-context-thesis' }, L(current.thesis)),
    h('div', { class:'market-context-implication' },
      h('h4', {}, L(['What this means for storage', '对储能的意义'])),
      h('p', {}, L(current.implication)))));
}
