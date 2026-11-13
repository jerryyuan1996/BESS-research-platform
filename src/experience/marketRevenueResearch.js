import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { sectionTitle, link } from './chrome.js';
import { loadMarketResearch } from './marketResearchSource.js';
import './researchContext.css';
import './marketRevenueResearch.css';

// Read each market's concise research and promote its own
// decision blocks. No second copy of the research or its model figures.
const ROMANIA_DECISION = {
  capacity: 'Grant mechanics — budget, minimum and award',
  energy: 'Captured spread by COD year — the competition discount',
  services: 'Evidence ladder — underwrite only to the tier the project has reached',
  duration: 'Duration answers three different questions',
};
const CHAPTERS = [
  ['capacity', ['Support & adequacy', '支持机制与充裕度']],
  ['energy', ['Wholesale & intraday markets', '批发与日内市场']],
  ['services', ['Balancing & reserves', '平衡与备用']],
  ['duration', ['Storage duration', '储能时长']],
];
const PREFERRED_DECISIONS = {
  jp: { capacity:'Revenue classification', energy:'Area price shape', services:'Product matrix', duration:'Reference duration path' },
  ca_on: { capacity:'The terms that decide the case' },
  ercot: { energy:'The disagreement, stated as a band' },
};

function promoteDecision(why) {
  why.querySelector(':scope > b')?.remove();
  const signal = why.querySelector(':scope > .sig');
  if (signal) why.prepend(signal);
  why.prepend(h('p', { class:'ix-eyebrow' }, L(['INVESTMENT DECISION', '投资决策'])));
}

async function mountChapter(body, row, section) {
  const source = await loadMarketResearch(row.id);
  if (!body.isConnected) return;
  const groups = await source.module.researchExcerpt(source.route, [{ section }], { isCurrent:()=>body.isConnected });
  if (!body.isConnected) return;
  const group = groups[0];
  if (!group?.cards.length) throw new Error('Research unavailable');
  const owner = row.market.manifest.dashboardId || row.id;
  const preferred = owner === 'ro' ? ROMANIA_DECISION[section] : PREFERRED_DECISIONS[owner]?.[section];
  const decisionCard = preferred ? group.cards.find(card => card.key.includes(preferred)) : null;
  const decision = h('div', { class:'market-revenue-decision' });
  const lead = h('div', { class:'ix-research-lead' });
  group.lead(lead);
  lead.querySelector('.sect > h2')?.remove();
  const cards = h('div', { class:'market-revenue-cards' });
  body.replaceChildren(decision, lead, cards,
    link('/markets/' + row.market.manifest.slug + '/evidence', ['Sources & evidence ↗', '来源与证据 ↗'], 'ix-text-link'));
  for (const card of group.cards) {
    const host = h('article', { class:'market-revenue-card ix-research-card-body', 'data-research-card':card.key });
    cards.append(host);
    card.draw(host, el => {
      let placed = false;
      for (const content of el.querySelectorAll('.card')) {
        const why = content.querySelector(':scope > .why');
        if (!why) continue;
        promoteDecision(why);
        if ((!decisionCard || card === decisionCard) && !placed &&
          (!decision.children.length || decision.dataset.decisionCard === card.key)) {
          decision.setAttribute('data-decision-card', card.key);
          decision.replaceChildren(why);
          placed = true;
        } else content.querySelector(':scope > h3')?.after(why);
      }
      // WA also has section-level decisions above its hand-written cards.
      for (const why of el.querySelectorAll(':scope > .why')) {
        promoteDecision(why);
        if (!decision.children.length) { decision.setAttribute('data-decision-card',card.key); decision.replaceChildren(why); }
      }
    });
  }
  if (!decision.children.length) {
    // Markets without a separate reserve product state their zero revenue
    // decision in the existing paragraph rather than a "why" block.
    const paragraph = cards.querySelector('.card > .research-paragraph');
    if (!paragraph) throw new Error('Decision unavailable');
    const sourceCard = paragraph.parentElement, origin = sourceCard.closest('[data-research-card]');
    paragraph.removeAttribute('style');
    const why = h('div', { class:'why' }, group.head ? h('span', { class:'sig' }, L(group.head)) : null, paragraph);
    promoteDecision(why);
    decision.setAttribute('data-decision-card',origin.dataset.researchCard);
    decision.append(why);
    // A paragraph-only card has become the decision; leave no empty card below.
    if ([...sourceCard.children].every(child=>child.tagName === 'H3')) origin.hidden = true;
  }
}

export function revenueResearchSection(row, initialSection = null) {
  const chapters = CHAPTERS.map(([key, title]) => [row.market.tabs.find(([id]) =>
    id === key || (key === 'capacity' && id === 'rcm') || (key === 'services' && id === 'fcess'))?.[0], title]).filter(([id])=>id);
  const section = h('section', { class:'ix-section market-revenue-research', id:'revenue-drivers' },
    sectionTitle(['WHY THE REVENUE EXISTS', '收入背后的经济动因'], ['Who pays, and why?', '谁在付钱，为什么付钱？'],
      ['Start with the investment decision, then explore the mechanisms, charts and evidence.', '先看投资决策，再展开机制、图表与证据。']));
  chapters.forEach(([id, title], i) => {
    const body = h('div', { class:'market-revenue-body ix-research-context-body' });
    const disclosure = h('details', { class:'ix-mechanism market-revenue-chapter', id:'revenue-' + id, 'data-revenue-section':id },
      h('summary', {}, h('span', { class:'ix-step-number' }, String(i + 1).padStart(2, '0')), h('strong', {}, L(title))), body);
    let requested = false;
    const load = async () => {
      requested = true;
      body.setAttribute('aria-busy', 'true');
      body.replaceChildren(h('p', { class:'ix-caption', role:'status' }, L(['Loading the research…', '正在载入研究…'])));
      try { await mountChapter(body, row, id); }
      catch {
        if (body.isConnected) body.replaceChildren(h('p', {}, L(['Research could not be loaded.', '研究内容暂未载入。'])),
          h('button', { type:'button', class:'ix-button ix-outline', onclick:load }, L(['Retry', '重试'])));
      } finally { body.setAttribute('aria-busy', 'false'); }
    };
    disclosure.addEventListener('toggle', () => { if (disclosure.open && !requested) load(); });
    if (id === initialSection) disclosure.open = true;
    section.append(disclosure);
  });
  return section;
}
