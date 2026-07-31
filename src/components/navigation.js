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
import { homeState } from '../home/state.js';

const REVENUE_IDS = new Set(['rcm', 'capacity', 'energy', 'fcess', 'services', 'duration']);
const COUNTRY_FLAGS = {
  wa: 'au',
  gb: 'gb',
  ie: 'ie',
  ro: 'ro',
  pl: 'pl',
  jp: 'jp',
  jp_tokyo: 'jp',
  jp_kyushu: 'jp',
  jp_hokkaido: 'jp',
};
export const marketFlagCode = market => COUNTRY_FLAGS[market.manifest.id]
  || COUNTRY_FLAGS[market.manifest.dashboardId]
  || 'un';


function groupedTabs(tabs){
  const revenue = tabs.filter(([id]) => REVENUE_IDS.has(id));
  const other = tabs.filter(([id]) => !REVENUE_IDS.has(id));
  const byId = new Map(other);
  const ordered = [];
  for (const id of ['home', 'story', 'grid']){
    if (byId.has(id)){
      ordered.push([id, byId.get(id)]);
      byId.delete(id);
    }
  }
  if (revenue.length) ordered.push([revenue[0][0], ['Revenue Mechanisms', '收入机制']]);
  for (const entry of other){
    if (!byId.has(entry[0])) continue;
    ordered.push(entry);
    byId.delete(entry[0]);
  }
  return { ordered, revenue };
}

/**
 * @param {Array} markets  registry entries
 * @param {string} activeId  market id, or 'home'
 */
export function marketNav(markets, activeId){
  const link = (href, label, active, flag = '') => h('a', {
    class: 'tab-btn' + (active ? ' active' : ''),
    href,
    onclick: (e) => { e.preventDefault(); navigate(href); },
  }, flag && h('span', { class:`market-flag fi fi-${flag}`, 'aria-hidden':'true' }), label);

  return h('div', { class: 'tabs' },
    link('/', L(['◂ Global cockpit', '◂ 全球总看板']), activeId === 'home'),
    markets.map(m => link(
      '/markets/' + m.manifest.slug,
      L(m.manifest.shortName),
      m.manifest.id === activeId,
      marketFlagCode(m))));
}

/**
 * A market's own tab strip.
 * @param {Array<[string, [string,string]]>} tabs
 * @param {string} activeTab
 * @param {string} basePath  e.g. '/markets/western-australia'
 */
export function tabNav(tabs, activeTab, basePath){
  const { ordered, revenue } = groupedTabs(tabs);
  const revenueIds = new Set(revenue.map(([id]) => id));
  return h('div', { class: 'tabs' }, ordered.map(([id, name]) => h('a', {
    class: 'tab-btn' + ((activeTab === id || (id === revenue[0]?.[0] && revenueIds.has(activeTab))) ? ' active' : ''),
    href: basePath + '/' + id,
    onclick: (e) => { e.preventDefault(); navigate(basePath + '/' + id); window.scrollTo(0, 0); },
  }, L(name))));
}

/**
 * A pointer from a market dashboard to the home-page Investment Lab.
 *
 * The Lab used to be two tabs on every dashboard. Removing them without leaving
 * a signpost would look like a feature was deleted, so each market says where its
 * returns model went — and preselects itself when the reader follows the link, so
 * the Lab opens on the market they were already reading.
 *
 * @param {string} marketId  preselected in the Lab on arrival
 */
export function labLink(marketId){
  const open = () => {
    homeState.labMarket = marketId;
    navigate('/');
    /* The Lab does not exist in the document until the home page has been built,
       and navigate() does not promise to have finished by the time it returns.
       Watch for the element across a few frames rather than assuming one is
       enough; give up quietly if it never appears. */
    let frames = 0;
    const scroll = () => {
      const lab = document.getElementById('lab');
      if (lab) lab.scrollIntoView({ block: 'start' });
      else if (frames++ < 30) requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
  };
  return h('div', { class: 'lab-pointer' },
    h('span', {}, L([
      'Model this market — retype the assumptions, price a capital structure:',
      '测算本市场 — 重新输入假设、测算资本结构：',
    ])),
    h('a', {
      class: 'btn',
      href: '/#lab',
      onclick: (e) => { e.preventDefault(); open(); },
    }, L(['Investment Lab & project debt ▸', '投资测算与项目债务 ▸'])));
}

export function revenueSubNav(tabs, activeTab, basePath){
  const revenue = tabs.filter(([id]) => REVENUE_IDS.has(id));
  if (!revenue.some(([id]) => id === activeTab)) return null;
  return h('div', {
    class:'tabs revenue-subtabs',
    'aria-label':L(['Revenue mechanism sections', '收入机制子页']),
  }, revenue.map(([id, name]) => h('a', {
    class:'tab-btn' + (activeTab === id ? ' active' : ''),
    href:basePath + '/' + id,
    onclick:(event) => {
      event.preventDefault();
      navigate(basePath + '/' + id);
      window.scrollTo(0, 0);
    },
  }, L(name))));
}
