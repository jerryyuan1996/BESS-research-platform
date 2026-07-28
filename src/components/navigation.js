/* ---------------------------------------------------------------------------
   Navigation.

   Two kinds:
   - marketNav(): the app-level bar linking Home and every registered market. It
     is built from the registry, so a new market appears here with no edit.
   - tabNav(): a market's own sticky tab strip, built from that market's tabs.js.

   Both use real hrefs and let the router intercept the click, so links are
   middle-clickable, copyable and crawlable — which the prototype's overlay was
   not.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';

/**
 * @param {Array} markets  registry entries
 * @param {string} activeId  market id, or 'home'
 */
export function marketNav(markets, activeId){
  const link = (href, label, active) => h('a', {
    class: 'tab-btn' + (active ? ' active' : ''),
    href,
    onclick: (e) => { e.preventDefault(); navigate(href); },
  }, label);

  return h('div', { class: 'tabs' },
    link('/', L(['◂ Global cockpit', '◂ 全球总看板']), activeId === 'home'),
    markets.map(m => link(
      '/markets/' + m.manifest.slug,
      m.manifest.flag + ' ' + L(m.manifest.shortName),
      m.manifest.id === activeId)));
}

/**
 * A market's own tab strip.
 * @param {Array<[string, [string,string]]>} tabs
 * @param {string} activeTab
 * @param {string} basePath  e.g. '/markets/western-australia'
 */
export function tabNav(tabs, activeTab, basePath){
  return h('div', { class: 'tabs' }, tabs.map(([id, name]) => h('a', {
    class: 'tab-btn' + (activeTab === id ? ' active' : ''),
    href: basePath + '/' + id,
    onclick: (e) => { e.preventDefault(); navigate(basePath + '/' + id); window.scrollTo(0, 0); },
  }, L(name))));
}
