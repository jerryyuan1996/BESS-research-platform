import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, setLang, requestRender } from '../app/state.js';
import { navigate } from '../app/router.js';
import './researchContext.css';
import { byId } from '../markets/registry.js';
import { loadMarketResearch } from './marketResearchSource.js';
import './marketResearchDialog.css';

const TITLES = {
  grid: ['Grid & delivery', '电网与交付'],
  revenue: ['Revenue & design', '收入与设计'],
};

/** Reads whole published sections from the same engine as Home. No copied data. */
export function openMarketResearch(marketId, kind, trigger, initialSection = null) {
  if (document.querySelector('.market-research-dialog')) return;
  const market = byId(marketId);
  if (!market) return;
  const marketName = market.manifest.name;
  const basePath = '/markets/' + market.manifest.slug;
  const openingPath = window.location.pathname;
  const previousOverflow = document.body.style.overflow;
  const dialog = h('dialog', { class: 'ix-dialog market-research-dialog', 'aria-labelledby': 'market-research-title', 'data-kind': kind, 'data-market': marketId });
  let active = null, version = 0, closed = false;
  let body, nav, closeButton;

  function finish() {
    if (closed) return;
    closed = true;
    version++;
    document.body.style.overflow = previousOverflow;
    window.removeEventListener('popstate', close);
    dialog.remove();
    if (initialSection !== null && window.location.pathname === openingPath) window.history.replaceState(window.history.state, '', basePath + window.location.search + (kind === 'grid' ? '#overview' : '#revenue-drivers'));
    const origin = trigger?.isConnected ? trigger : document.querySelector(`[data-market-research="${kind}"][data-market="${marketId}"]`);
    origin?.focus({ preventScroll: true });
  }
  function close() { dialog.close(); }

  function drawCard(card, open, omitMap = false) {
    const target = h('div', { class: 'ix-research-card-body' });
    const title = card.title || ['Entry costs & delivery milestones', '进入成本与交付里程碑'];
    const node = h('details', { class: 'ix-research-card', 'data-research-card': card.key },
      h('summary', {}, L(title)), target);
    let drawn = false;
    const draw = () => {
      if (drawn) return;
      drawn = true;
      card.draw(target, el => {
        // The interactive map is already on the market page; all of its
        // accompanying analysis, congestion register and sources remain here.
        if (omitMap) {
          el.querySelector('.geo-grid-map')?.remove();
          for (const caption of el.querySelectorAll('.cap')) {
            if (!caption.children.length) caption.textContent = caption.textContent
              .replace('on the map above', 'on the market page’s grid map')
              .replace('在上方地图中', '在市场页面的电网地图中');
          }
        }
        const heading = el.querySelector(':scope > .card > h3');
        if (heading) {
          const badges = [...heading.children];
          heading.replaceWith(h('div', { class: 'ix-research-card-badges' }, badges));
        }
      });
    };
    node.addEventListener('toggle', () => { if (node.open) draw(); });
    if (open) { node.open = true; draw(); }
    return node;
  }

  function renderChapter(chapter) {
    active = chapter.id;
    const lead = h('div', { class: 'ix-research-lead' });
    chapter.group.lead(lead);
    // The reader supplies the chapter heading. Retain captions and evidence.
    lead.querySelector('.sect > h2')?.remove();
    const fullUrl = basePath + '/evidence';
    const sourceLink = h('a', { href: fullUrl, class: 'ix-text-link', onclick: event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault(); close(); navigate(fullUrl); window.scrollTo({ top: 0, behavior: 'instant' });
    } }, L(['Sources & evidence ↗', '来源与证据 ↗']));
    body.setAttribute('aria-labelledby', 'market-reader-tab-' + chapter.id);
    body.replaceChildren(
      h('div', { class: 'market-reader-chapter-heading' },
        h('p', { class: 'ix-eyebrow' }, L(marketName) + ' · ' + L(['RESEARCH LIBRARY', '研究资料'])),
        h('h3', {}, L(chapter.title))),
      lead,
      h('div', { class: 'ix-research-cards' }, chapter.cards.map((card, i) => drawCard(chapter.omitMap ? { ...card, title: chapter.title } : card, i === 0, chapter.omitMap))),
      h('div', { class: 'market-reader-source-link' }, sourceLink));
    body.scrollTop = 0;
    for (const button of nav.querySelectorAll('[role="tab"]')) {
      const selected = button.dataset.chapter === active;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
  }

  async function loadChapters() {
    const current = ++version;
    body.setAttribute('aria-busy', 'true');
    body.replaceChildren(h('p', { class: 'ix-caption', role: 'status' }, L(['Loading the full research…', '正在载入完整研究…'])));
    try {
      const source = await loadMarketResearch(marketId);
      if (closed || current !== version) return;
      const groups = await source.module.researchExcerpt(source.route, source.sections(kind).map(section => ({ section })),
        { isCurrent: () => !closed && current === version });
      if (closed || current !== version) return;
      const chapters = groups.flatMap(group => kind === 'grid' && group.section === 'grid'
        ? group.cards.map((card, i) => ({ id: 'grid-' + i, group, cards: [card], omitMap: true,
          title: /map|地图/i.test(card.key) ? ['Congestion & constraints', '拥塞与约束'] : card.title || group.label }))
        : [{ id: group.section, group, cards: group.cards, title: group.label }]);
      if (!chapters.length) throw new Error('Research unavailable');
      nav.replaceChildren(...chapters.map((chapter, i) => h('button', {
        type: 'button', role: 'tab', id: 'market-reader-tab-' + chapter.id, 'data-chapter': chapter.id,
        'aria-controls': 'market-reader-panel', 'aria-selected': 'false', tabindex: '-1',
        onclick: () => renderChapter(chapter),
      }, h('span', { class: 'market-reader-number', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')),
      h('span', {}, L(chapter.title)), h('span', { class: 'market-reader-chevron', 'aria-hidden': 'true' }, '↗'))));
      renderChapter(chapters.find(chapter => chapter.id === active) || chapters.find(chapter => chapter.group.section === initialSection) || chapters[0]);
    } catch {
      if (closed || current !== version) return;
      body.replaceChildren(h('p', {}, L(['Research could not be loaded.', '研究内容暂未载入。'])),
        h('button', { type: 'button', class: 'ix-button ix-outline', onclick: loadChapters }, L(['Retry', '重试'])));
    } finally {
      if (!closed && current === version) body.setAttribute('aria-busy', 'false');
    }
  }

  function build() {
    dialog.lang = app.lang === 'zh' ? 'zh-CN' : 'en';
    closeButton = h('button', { type: 'button', class: 'ix-button ix-outline', 'aria-label': L(['Close research', '关闭研究']), onclick: close }, L(['Close', '关闭']), ' ×');
    const language = h('button', { type: 'button', class: 'ix-button ix-outline', onclick: () => {
      setLang(app.lang === 'en' ? 'zh' : 'en'); requestRender(); build();
      dialog.querySelector('.market-reader-language').focus();
    } }, app.lang === 'en' ? '中文' : 'EN');
    language.classList.add('market-reader-language');
    nav = h('nav', { class: 'market-reader-nav', role: 'tablist', 'aria-orientation': 'vertical', 'aria-label': L(['Research chapters', '研究章节']), onkeydown: event => {
      const buttons = [...nav.querySelectorAll('[role="tab"]')];
      const index = buttons.indexOf(document.activeElement);
      if (index < 0 || !['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
        : (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].click(); buttons[next].focus();
    } });
    body = h('div', { id: 'market-reader-panel', class: 'market-reader-panel ix-research-context-body', role: 'tabpanel', tabindex: '0' });
    dialog.replaceChildren(
      h('header', { class: 'market-reader-header' }, h('div', {},
        h('p', { class: 'ix-eyebrow' }, L(marketName) + ' · ' + L(['FULL MARKET RESEARCH', '完整市场研究'])),
        h('h2', { id: 'market-research-title' }, L(TITLES[kind])),
        h('p', { class: 'market-reader-intro' }, L(kind === 'grid'
          ? ['From the network constraint to a deliverable connection.', '从电网约束，读到可交付的并网条件。']
          : ['From the payment mechanism to the storage design.', '从付费机制，读到储能设计的选择。']))),
        h('div', { class: 'market-reader-tools' }, language, closeButton)),
      h('div', { class: 'market-reader-workspace' }, h('aside', { class: 'market-reader-sidebar' },
        h('p', { class: 'ix-eyebrow' }, L(['IN THIS RESEARCH', '本篇内容'])), nav,
        h('p', { class: 'market-reader-provenance' }, L(['Complete market research, charts and sources.', '本市场的完整研究、图表与原始来源。']))), body));
    loadChapters();
  }

  build();
  dialog.addEventListener('close', finish, { once: true });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  window.addEventListener('popstate', close);
  document.body.append(dialog); document.body.style.overflow = 'hidden';
  dialog.showModal(); closeButton.focus();
  return dialog;
}
