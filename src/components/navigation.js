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
/* A market id is not a country code — `wa` is Australia and the three Japanese
   areas share one flag — so the mapping is explicit. Anything missing falls back
   to the UN flag, which is why a market absent from this table renders a
   placeholder rather than failing: NEM, DE and IT were all doing exactly that
   until the US round noticed it. Add a market here AND to src/styles/flags.css,
   which vendors only the flags actually used. */
const COUNTRY_FLAGS = {
  wa: 'au',
  nem: 'au',
  gb: 'gb',
  ie: 'ie',
  de: 'de',
  it: 'it',
  ro: 'ro',
  pl: 'pl',
  jp: 'jp',
  jp_tokyo: 'jp',
  jp_kyushu: 'jp',
  jp_hokkaido: 'jp',
  pjm: 'us',
  ercot: 'us',
  caiso: 'us',
  fi: 'fi',
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

/* ---------------------------------------------------------------------------
   THE TAB STRIP, ONCE, FOR ALL THREE PLACES THAT BUILD ONE.

   Below the --bp-md step the strip scrolls sideways rather than wrapping, which
   recovered a third of the mobile viewport. Scrolling introduces two problems a
   wrapped strip does not have, and both are solved here rather than in each
   caller.

   THE ACTIVE TAB CAN START OFF-SCREEN. Arriving at the tenth tab of sixteen
   would show the first four and no indication that the current one exists. It
   is scrolled into view on mount — by setting `scrollLeft` rather than calling
   `scrollIntoView`, which would also scroll the PAGE vertically and land the
   reader below the heading they just navigated to.

   OFF-SCREEN TABS NEED TO BE VISIBLE AS A FACT, NOT AS AN INSTRUCTION. The
   strip carries a `data-overflow` attribute saying which side is cut off, and
   the stylesheet fades that edge. No badge, no arrows, no "swipe for more" —
   the content itself is the signal, and a fade that appears only on the side
   with more content is a truthful one.

   Keyboard access needs nothing added: the tabs are real links, so they are
   focusable and followable already, and a browser scrolls a focused element in
   an overflow container into view on its own. What was missing is a visible
   focus ring, which is in the stylesheet.
   --------------------------------------------------------------------------- */
export function tabStrip(...children){
  const el = h('div', { class: 'tabs' }, ...children);
  initTabStrip(el);
  return el;
}

/**
 * Wire the overflow hint and the initial scroll position.
 *
 * OBSERVER-DRIVEN, NOT TIMER-DRIVEN. The first version measured inside a
 * requestAnimationFrame and bailed when the element was not yet connected —
 * which it never was, because every caller builds the strip and appends it
 * afterwards. The result looked harmless: the strip scrolled, and simply had no
 * fade and no initial positioning, on every page.
 *
 * A ResizeObserver fires when the element first has a box, so it cannot run too
 * early, and it also handles rotation and window resize for free.
 */
function initTabStrip(el){
  const update = () => {
    const slack = el.scrollWidth - el.clientWidth;
    if (slack <= 1){ el.removeAttribute('data-overflow'); return; }
    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft >= slack - 1;
    el.setAttribute('data-overflow', atStart ? 'right' : atEnd ? 'left' : 'both');
  };

  el.addEventListener('scroll', update, { passive: true });

  let positioned = false;
  const settle = () => {
    if (!positioned && el.clientWidth > 0){
      positioned = true;
      const active = el.querySelector('.tab-btn.active');
      if (active && el.scrollWidth > el.clientWidth){
        /* scrollLeft, not scrollIntoView: the latter scrolls the PAGE as well,
           landing the reader below the heading they just navigated to. */
        el.scrollLeft = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
      }
    }
    update();
  };

  /* THE OBSERVER IS RETAINED ON THE ELEMENT, DELIBERATELY.

     `new ResizeObserver(fn).observe(el)` keeps no reference to the observer, and
     an observer with no strong reference may be collected — after which the
     callback simply stops arriving. It fails silently and intermittently, which
     is the worst way for it to fail. Hanging it off the element ties its
     lifetime to the strip's.

     The timeout is not redundant. Callers build the strip and append it
     afterwards, so at `observe()` time the element has no box; a browser that
     reports nothing until the next resize would leave the strip unhinted
     forever. One task later it is in the document and measurable. */
  if (typeof ResizeObserver === 'function'){
    el.__stripObserver = new ResizeObserver(settle);
    el.__stripObserver.observe(el);
  }
  setTimeout(settle, 0);
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

  return tabStrip(
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
  return tabStrip(ordered.map(([id, name]) => h('a', {
    class: 'tab-btn' + ((activeTab === id || (id === revenue[0]?.[0] && revenueIds.has(activeTab))) ? ' active' : ''),
    href: basePath + '/' + id,
    onclick: (e) => { e.preventDefault(); navigate(basePath + '/' + id); window.scrollTo(0, 0); },
  }, L(name))));
}

/**
 * A pointer from a market dashboard to the dedicated Investment Lab page.
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
    navigate('/investment-lab');
    window.scrollTo(0, 0);
  };
  return h('div', { class: 'lab-pointer' },
    h('span', {}, L([
      'Model this market — retype the assumptions, price a capital structure:',
      '测算本市场 — 重新输入假设、测算资本结构：',
    ])),
    h('a', {
      class: 'btn',
      href: '/investment-lab',
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
