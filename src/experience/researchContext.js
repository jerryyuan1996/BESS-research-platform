/* ---------------------------------------------------------------------------
   RESEARCH IN CONTEXT, AS THE READER SEES IT.

   A chapter of the market page — or of the market-background reading — carries
   one closed disclosure, "Research behind this section". This module fills it
   when the reader opens it, and it is fetched then and not before: opening a
   market page loads no research, and opening a disclosure loads this, the
   map, that market's research chunk and the sections its cards come from.

   What a reader gets, in this order:

     what the section argues     the research section's own heading, caption
                                 and reviewed claim, as its tab shows them
     the picture                 the first card that holds a chart, a map or a
                                 timeline, open (else the first diagram or card)
     the detail                  every other card, closed, under its own title
     the source                  each card's own source drawer, and a link to
                                 the tab the cards come from

   The cards are not copies. src/experience/researchMap.js names them, the
   market's engine draws them with the renderer its research tabs use
   (researchExcerpt in src/markets/_shared/engine.js), and a card changed in
   the research is changed here.

   Nothing from the page's own chunk is imported: the page hands this module
   what it needs, so the page chunk keeps its name and its budget.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { byId } from '../markets/registry.js';
import { picksFor } from './researchMap.js';
import './researchContext.css';

const loaders = import.meta.glob(['../markets/*/dashboard.js', '!../markets/_template/**']);

/** A link inside the site that keeps the page's own navigation. */
function inside(href, label, cls){
  return h('a', { href, class: cls, onclick: (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); navigate(href); window.scrollTo({ top: 0, behavior: 'instant' });
  } }, L(label));
}

/* The research tab draws a card under its own heading. Here the heading is the
   line the reader pressed, so the card keeps what the heading carried besides
   the words — its source, method and state badges — and drops the repeat. */
function withoutRepeatedTitle(body){
  const head = body.querySelector(':scope > .card > h3');
  if (!head) return;
  const badges = [...head.children];
  if (badges.length) head.replaceWith(h('div', { class: 'ix-research-card-badges' }, badges));
  else head.remove();
}

/* A section that is one component has no card title of its own. */
const COMPONENT_TITLE = {
  '#entry-ledger': ['Entry ledger — what is paid, when, and what is forfeited', '进入成本台账 — 何时支付、支付多少、何种情形被没收'],
};

function cardNode(card, open){
  const body = h('div', { class: 'ix-research-card-body' });
  const title = card.title || COMPONENT_TITLE[card.key] || ['Research component', '研究组件'];
  const node = h('details', { class: 'ix-research-card', 'data-research-card': card.key },
    h('summary', {}, h('span', { class: 'ix-research-card-title' }, L(title))),
    body);
  let drawn = false;
  const draw = () => { if (drawn) return; drawn = true; card.draw(body, withoutRepeatedTitle); };
  node.addEventListener('toggle', () => { if (node.open) draw(); });
  if (open){ node.open = true; draw(); }
  return node;
}

function groupNode(group, market, openKey){
  const lead = h('div', { class: 'ix-research-lead' });
  group.lead(lead);
  /* One heading level below the chapter it sits in. */
  const title = lead.querySelector('.sect > h2');
  const heading = h('h4', { class: 'ix-research-group-title' }, title?.textContent || (group.label ? L(group.label) : ''));
  title?.remove();
  const path = '/markets/' + market.manifest.slug + '/' + group.section;
  return h('section', { class: 'ix-research-group', 'data-research-section': group.section },
    heading, lead,
    h('div', { class: 'ix-research-cards' }, group.cards.map(card => cardNode(card, card.key === openKey))),
    group.label ? inside(path, [`Open “${group.label[0]}” in the full research ↗`, `在完整研究中打开“${group.label[1]}” ↗`], 'ix-text-link ix-research-tab-link') : null);
}

/**
 * Fill one chapter's disclosure. Never throws: a chunk that fails leaves a
 * retry in place, and the chapter above it is untouched.
 *
 * @param body      the element inside the opened disclosure
 * @param marketId  the market the page shows (an allocation point for Japan)
 * @param options   { chapter, slot } as src/experience/researchMap.js names them
 */
export async function mountResearchContext(body, marketId, { chapter, slot = null } = {}){
  const market = byId(marketId);
  const owner = market?.manifest.dashboardId || market?.manifest.id;
  const picks = market ? picksFor(owner, chapter, slot) : [];
  body.setAttribute('aria-busy', 'true');
  body.replaceChildren(h('p', { class: 'ix-caption' }, L(['Loading the research behind this section…', '正在载入本节背后的研究…'])));
  try {
    const load = loaders['../markets/' + owner + '/dashboard.js'];
    const module = picks.length && load ? await load() : null;
    const groups = module?.researchExcerpt
      ? await module.researchExcerpt({ basePath: '/markets/' + market.manifest.slug, region: market.manifest.region }, picks)
      : [];
    if (!body.isConnected) return;
    if (!groups.length){
      body.replaceChildren(h('p', { class: 'ix-caption' }, L(['The full research for this market is in its research tabs.', '本市场的完整研究见研究标签页。'])),
        inside('/markets/' + market.manifest.slug + '/home', ['Full market research ↗', '完整市场研究 ↗'], 'ix-text-link'));
      return;
    }
    /* The picture first: the earliest chart, map or timeline opens with the
       disclosure; failing that the earliest diagram; failing that the first card. */
    const every = groups.flatMap(group => group.cards);
    const first = every.find(card => card.visual === 2) || every.find(card => card.visual === 1) || every[0];
    const count = groups.reduce((sum, group) => sum + group.cards.length, 0);
    body.replaceChildren(
      h('p', { class: 'ix-research-kind' }, h('span', {}, L(['Research excerpt', '研究摘录'])),
        L([`${count} ${count === 1 ? 'card' : 'cards'} from the full market research, each with its own sources. Open any title to read it.`,
           `取自完整市场研究的${count}张研究卡，各自附来源。点击标题展开阅读。`])),
      ...groups.map(group => groupNode(group, market, first?.key)),
      h('p', { class: 'ix-caption' }, L(['Extracted directly from the full market research · source vintage: ', '直接引用完整市场研究 · 原研究口径：']),
        market.manifest.dataDate || market.manifest.asOf));
  } catch {
    if (!body.isConnected) return;
    body.replaceChildren(h('p', {}, L(['The research behind this section could not be loaded.', '本节背后的研究暂未载入。'])),
      h('button', { class: 'ix-button ix-outline', type: 'button', onclick: () => mountResearchContext(body, marketId, { chapter, slot }) }, L(['Retry', '重试'])));
  } finally {
    body.setAttribute('aria-busy', 'false');
  }
}
