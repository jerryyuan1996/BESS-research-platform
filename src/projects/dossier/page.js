/* ---------------------------------------------------------------------------
   The dossier page shell.

   Renders one project dossier at /projects/<slug>, with the same application
   chrome every other page carries. In a production build no dossier exists, so
   this file's real job is the one it does when there is nothing to draw.

   WHY AN UNKNOWN SLUG IS A 404 AND NOT A WITHHELD PAGE. There are no public
   links to dossiers — the portfolio list is empty by construction — so nothing
   legitimate reaches such a URL, and treating every random slug as valid turns
   typos and stale links into silent non-errors.

   It also leaks. A withheld page that rendered only for REAL slugs would be an
   oracle: it would confirm which deal codenames exist to anyone who guessed one.
   A 404 for everything the build does not know about says less and is more
   honest about the error case. "Withheld" is reserved for a place where a
   deliberately published, non-confidential descriptor exists to attach it to —
   which is the market portfolio tab, not this route.

   The section bodies come from the dossier itself and are drawn by the shared
   block engine, so a dossier is data rather than code. Nothing in this file
   knows what a transaction or a sensitivity grid contains.
   --------------------------------------------------------------------------- */
/* The dossier's own stylesheet, imported HERE rather than in main.js so it
   travels with this lazily-loaded chunk. A published build has no dossiers at
   all, and a market reader has no use for these rules; importing it eagerly
   made every visitor download the styling for a page they cannot open. */
import '../../styles/dossier.css';

import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { navigate } from '../../app/router.js';
import { markets, byId } from '../../markets/registry.js';
import { marketNav } from '../../components/navigation.js';
import { renderFooter } from '../../components/footer.js';
import { badge } from '../../components/badge.js';
import { dossierBlocks } from './blocks.js';
import { DOSSIER_TABS, dossierBySlug, dossierPath } from './registry.js';

const DISCLAIMER = [
  'Project-level material. This document supports, but does not replace, independent investment, legal, technical and financial analysis, and is not investment advice.',
  '项目层面材料。本文件用于辅助而非替代独立的投资、法律、技术及财务分析，不构成投资建议。',
];

/**
 * A route that names no dossier this build knows about.
 *
 * Identical for "never existed" and "exists but is not in this build", which is
 * the point — see the header.
 */
export function renderDossierNotFound(container, slug){
  container.append(h('div', { class: 'hdr' }, h('div', {},
    h('h1', {}, L(['Page not found', '页面不存在'])),
    h('div', { class: 'sub' }, '/projects/' + (slug || '')))));
  container.append(marketNav(markets, 'home'));
  container.append(h('div', { class: 'note' },
    L(['No project page exists at that address. Project material is not published on this site — see ',
       '该地址不存在项目页面。本站不发布项目层面材料 — 参见']),
    h('a', { href: '/', onclick: (e) => { e.preventDefault(); navigate('/'); } },
      L(['the global cockpit', '全球总看板'])),
    L([' for the market research this platform does publish.', '，了解本平台确实发布的市场研究。'])));
  container.append(renderFooter([DISCLAIMER]));
}

/**
 * @param {HTMLElement} container
 * @param {string} slug
 * @param {string|null} tabId
 */
export function renderDossierPage(container, slug, tabId){
  const d = dossierBySlug(slug);
  if (!d) return renderDossierNotFound(container, slug);

  const market = byId(d.marketId);
  const tabs = DOSSIER_TABS.filter(([id]) => d.sections[id]);
  const active = tabs.some(([id]) => id === tabId) ? tabId : tabs[0][0];

  container.append(h('div', { class: 'hdr' },
    h('div', {},
      h('div', { class: 'kicker' },
        (market?.manifest.flag ? market.manifest.flag + ' ' : '')
        + (market ? L(market.manifest.shortName) : d.marketId)),
      h('h1', {}, L(d.name)),
      d.sub ? h('div', { class: 'sub' }, L(d.sub)) : null),
    h('div', {}, badge('conf'))));

  container.append(marketNav(markets, market?.manifest.id));

  /* The dossier's own tab strip. Real hrefs so the tabs are linkable and
     middle-clickable, matching every other tabbed surface here. */
  container.append(h('div', { class: 'tabs' }, tabs.map(([id, label]) => {
    const href = dossierPath(d) + (id === tabs[0][0] ? '' : '/' + id);
    return h('a', {
      class: 'tab-btn' + (id === active ? ' active' : ''),
      href,
      onclick: (e) => { e.preventDefault(); navigate(href); },
    }, L(label));
  })));

  const main = h('div');
  container.append(main);

  const section = d.sections[active];
  if (section?.blocks){
    const { B } = dossierBlocks();
    B(main, section.blocks);
  }

  container.append(renderFooter([
    DISCLAIMER,
    ...(d.footer ? [d.footer] : []),
  ]));
}
