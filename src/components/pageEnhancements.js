import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { card } from './card.js';
import { renderGeographicGridMap } from './geographicGridMap.js';
import { sectionClaim } from './sectionClaim.js';
import { claimFor } from '../markets/claimRegistry.js';
import { byId } from '../markets/registry.js';

function drawersOwnedBy(cardNode){
  return [...cardNode.querySelectorAll('.source-drawer')]
    .filter(drawer => drawer.closest('.card') === cardNode);
}

export function consolidateSourceDrawers(root){
  root.querySelectorAll('.card').forEach(cardNode => {
    const drawers = drawersOwnedBy(cardNode);
    if (drawers.length < 2) return;
    const first = drawers[0];
    const list = h('div', { class:'source-list' });
    drawers.forEach(drawer => {
      const grid = drawer.querySelector('.source-grid');
      if (grid) list.append(h('div', { class:'source-list-item' }, grid));
    });
    first.replaceChildren(
      h('summary', {}, L(['Sources & status', '来源与状态'])),
      list,
    );
    drawers.slice(1).forEach(drawer => drawer.remove());
  });
}

export function placeMetricFootnotes(root){
  const notes = [...root.querySelectorAll('.metric-footnotes')];
  if (!notes.length) return;
  const merged = h('aside', {
    class:'metric-footnotes',
    'aria-label':L(['Economic metric notes', '经济指标附注']),
  });
  const seen = new Set();
  notes.forEach(note => {
    [...note.children].forEach(child => {
      const key = child.textContent.trim();
      if (!seen.has(key)){
        seen.add(key);
        merged.append(child);
      }
    });
    note.remove();
  });
  root.append(merged);
}

function removeCard(cardNode){
  const parent = cardNode.parentElement;
  cardNode.remove();
  if (parent?.classList.contains('grid') && !parent.querySelector('.card')) parent.remove();
}

function markValueCell(cell, mark){
  if (!cell || !mark) return;
  const cleaned = cell.textContent.replace(/\s*·\s*(VERIFIED|DERIVED|PROXY)\b/gi, '').trim();
  cell.replaceChildren(document.createTextNode(cleaned), h('sup', { class:'metric-note-ref' }, mark));
}

function economicMetricCards(root){
  return [...root.querySelectorAll('.card')].filter(cardNode => {
    const title = cardNode.querySelector(':scope > h3')?.textContent || '';
    return /first-pass economics|governed first pass|first pass|第一版|经济指标/i.test(title);
  });
}

function simplifyEconomicMetrics(root){
  root.querySelectorAll('.card').forEach(cardNode => {
    const title = cardNode.querySelector(':scope > h3')?.textContent || '';
    if (/Economics DNA|经济性DNA|经济DNA|P0经济DNA/i.test(title)){
      cardNode.querySelector('.flow')?.classList.add('economics-dna-flow');
    }
  });

  economicMetricCards(root).forEach(cardNode => {
    const heading = cardNode.querySelector(':scope > h3');
    heading?.replaceChildren(document.createTextNode(L(['Economics Metrics', '经济指标'])));
    cardNode.querySelectorAll('table').forEach(table => {
      const heads = [...table.querySelectorAll('thead th')];
      const classIndex = heads.findIndex(th => /Class|分类/i.test(th.textContent));
      const removable = heads
        .map((th, index) => ({ index, text:th.textContent }))
        .filter(({ text }) => /Class|分类|Formula|公式|Limitation|限制/i.test(text))
        .map(({ index }) => index)
        .sort((a, b) => b - a);
      table.querySelectorAll('tbody tr').forEach(row => {
        const cells = [...row.children];
        if (classIndex >= 0){
          const classText = cells[classIndex]?.textContent || '';
          const mark = /VERIFIED/i.test(classText) ? '1' : /DERIVED/i.test(classText) ? '2' : /PROXY/i.test(classText) ? '3' : '';
          markValueCell(cells[1], mark);
        } else {
          cells.slice(1).forEach(cell => {
            const valueText = cell.textContent || '';
            const mark = /VERIFIED/i.test(valueText) ? '1' : /DERIVED/i.test(valueText) ? '2' : /PROXY/i.test(valueText) ? '3' : '';
            markValueCell(cell, mark);
          });
        }
      });
      table.querySelectorAll('tr').forEach(row => {
        const cells = [...row.children];
        removable.forEach(index => cells[index]?.remove());
      });
    });
    cardNode.querySelectorAll('.note').forEach(note => {
      if (/VERIFIED|DERIVED|PROXY|已核实|衍生|代理/i.test(note.textContent)) note.remove();
    });
    cardNode.append(h('div', { class:'metric-footnotes' },
      h('p', {}, L(['1 Published value or rule from the cited public source.', '1 引用公开来源直接发布的数值或规则。'])),
      h('p', {}, L(['2 Calculated from published inputs; arithmetic is reproducible.', '2 根据公开输入计算；计算过程可复现。'])),
      h('p', {}, L(['3 Market-level proxy; replace with project-specific evidence before investment approval.', '3 市场层面代理；投资审批前须替换为项目级证据。'])),
    ));
  });
}

function storySubTabs(root, tabId){
  if (tabId !== 'story') return;
  let orientation = [...root.querySelectorAll('.card')].find(cardNode =>
    /One-minute orientation for a new institutional investor|机构投资人的一分钟市场定位/i
      .test(cardNode.querySelector(':scope > h3')?.textContent || ''));
  const sectionHead = [...root.children].find(node => node.classList?.contains('sect')) || null;
  const content = [...root.children].filter(node => node !== sectionHead);
  const hasNamedOrientation = Boolean(orientation);
  if (!orientation) orientation = root.querySelector('.card');
  const splitAt = content.findIndex(node => node === orientation || node.contains(orientation));
  if (splitAt < 0) return;
  const panelSplit = hasNamedOrientation ? splitAt : splitAt + 1;
  const orientationNodes = hasNamedOrientation ? content.slice(panelSplit) : content.slice(0, panelSplit);
  const economicsNodes = hasNamedOrientation ? content.slice(0, panelSplit) : content.slice(panelSplit);
  const nav = h('div', {
    class:'story-subtabs',
    role:'tablist',
    'aria-label':L(['Market story sections', '市场演进子页']),
  });
  const orientationPanel = h('section', {
    class:'story-panel',
    role:'tabpanel',
    'data-story-panel':'orientation',
  }, orientationNodes);
  const economicsPanel = h('section', {
    class:'story-panel',
    role:'tabpanel',
    'data-story-panel':'economics',
    hidden:'hidden',
  }, economicsNodes);
  const tabs = [
    ['orientation', ['One-minute orientation', '一分钟市场定位'], orientationPanel],
    ['economics', ['Economics', '经济性'], economicsPanel],
  ];
  const select = id => {
    tabs.forEach(([tabKey, , panel]) => {
      const active = tabKey === id;
      panel.hidden = !active;
      nav.querySelector(`[data-story-tab="${tabKey}"]`)?.setAttribute('aria-selected', String(active));
    });
  };
  tabs.forEach(([id, label]) => nav.append(h('button', {
    class:'btn' + (id === 'orientation' ? ' active' : ''),
    type:'button',
    role:'tab',
    'data-story-tab':id,
    'aria-selected':String(id === 'orientation'),
    onclick:(event) => {
      nav.querySelectorAll('.btn').forEach(button => button.classList.remove('active'));
      event.currentTarget.classList.add('active');
      select(id);
    },
  }, L(label))));
  root.append(nav, orientationPanel, economicsPanel);
}

function mergeTimelines(root){
  const timelines = [...root.querySelectorAll('.timeline')];
  if (timelines.length < 2) return;
  const first = timelines[0];
  const firstCard = first.closest('.card');
  const seen = new Set([...first.children].map(item => item.textContent.replace(/\s+/g, ' ').trim()));
  timelines.slice(1).forEach(timeline => {
    [...timeline.children].forEach(item => {
      const key = item.textContent.replace(/\s+/g, ' ').trim();
      if (!seen.has(key)){
        seen.add(key);
        first.append(item);
      }
    });
    const owner = timeline.closest('.card');
    if (owner && owner !== firstCard) removeCard(owner);
    else timeline.remove();
  });
}
export function pairOverviewMap(root, data){
  if (!data) return;
  const firstCard = [...root.children].find(node => node.classList?.contains('card'));
  if (!firstCard) return;
  const mapCard = card(
    ['Grid at a glance — generation, demand and deliverability', '电网速览 — 发电、负荷与可交付性'],
    [],
  );
  mapCard.classList.add('overview-map-card');
  renderGeographicGridMap(mapCard, { ...data, compact:true });
  const pair = h('div', { class:'overview-lead' });
  firstCard.before(pair);
  pair.append(firstCard, mapCard);
}

export function enhanceMarketPage(root, { overviewMap = null, marketId = '', tabId = '' } = {}){
  simplifyEconomicMetrics(root);
  mergeTimelines(root);
  if (overviewMap) pairOverviewMap(root, overviewMap);
  consolidateSourceDrawers(root);
  storySubTabs(root, tabId);
  placeMetricFootnotes(root);
  placeSectionClaim(root, marketId, tabId);
}

/* ---------------------------------------------------------------------------
   The claim goes under the section heading and above everything the section
   shows, which is the one position that makes it an argument rather than a
   summary. Inserted after the section renders, from the market's accepted
   claims, so no section module needs to know claims exist and every market gets
   the behaviour the moment its claims are reviewed.

   Nothing is inserted unless a supported claim exists — no container, no
   placeholder, and no unpublished draft anywhere in the DOM.
   --------------------------------------------------------------------------- */
function placeSectionClaim(root, marketId, tabId){
  if (!marketId || !tabId) return;
  const claim = claimFor(marketId, tabId);
  if (!claim) return;

  const market = byId(marketId);
  const block = sectionClaim(claim, market);
  if (!block) return;                     // incomplete, blocked, or none

  const sect = root.querySelector('.sect');
  if (!sect) return;
  /* After the heading and its caption, before the first figure. */
  const cap = sect.querySelector(':scope > .cap');
  const anchor = cap || sect.querySelector(':scope > h2');
  if (anchor) anchor.after(block); else sect.prepend(block);
}
