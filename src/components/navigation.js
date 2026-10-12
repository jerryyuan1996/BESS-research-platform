/* ---------------------------------------------------------------------------
   Navigation.

   Two kinds:
   - marketNav(): the app-level bar linking Home, Returns and every registered market. It
     is built from the registry, so a new market appears here with no edit.
   - tabNav(): a market's own sticky tab strip, built from that market's tabs.js.

   Both use real hrefs and let the router intercept the click, so links are
   middle-clickable, copyable and crawlable — which the prototype's overlay was
   not.
   --------------------------------------------------------------------------- */
import { tabsFor, tabOfSection, LANDING_TAB } from '../markets/tabGroups.js';
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { homeState } from '../home/state.js';

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
/**
 * Which edge, if any, has tabs beyond it.
 *
 * Extracted from the DOM so the decision can be tested directly: the states
 * that matter are the transitions — narrowing an already-mounted strip until it
 * overflows, and widening it again so a stale hint is cleared. Both are real
 * responsive behaviour (a rotation is exactly this), and both were previously
 * only reachable through a browser.
 *
 * @returns {'left'|'right'|'both'|null} null when everything fits
 */
export function overflowHint(scrollWidth, clientWidth, scrollLeft){
  const slack = scrollWidth - clientWidth;
  if (slack <= 1) return null;
  const atStart = scrollLeft <= 1;
  const atEnd = scrollLeft >= slack - 1;
  return atStart ? 'right' : atEnd ? 'left' : 'both';
}

function initTabStrip(el){
  const update = () => {
    const hint = overflowHint(el.scrollWidth, el.clientWidth, el.scrollLeft);
    if (hint) el.setAttribute('data-overflow', hint);
    else el.removeAttribute('data-overflow');
  };

  el.addEventListener('scroll', () => settle(), { passive: true });

  let positioned = false;
  const settle = () => {
    /* SELF-DISCONNECT ONCE THE STRIP LEAVES THE DOCUMENT.

       Market panels mount and unmount on every tab change, so a session builds
       dozens of strips. Each discarded one would otherwise keep an observer
       alive for as long as anything referenced the element — and the element
       references the observer, so the pair keeps each other reachable until the
       whole cycle is collected. Cutting the link explicitly means a removed
       strip stops costing anything the moment it is removed, rather than
       whenever the collector next runs.

       Guarded on `positioned` so this cannot fire before the first mount, when
       the element is legitimately not yet connected. */
    if (positioned && !el.isConnected){
      el.__stripObserver?.disconnect();
      el.__stripObserver = null;
      if (el.__stripRecheck && typeof window !== 'undefined'){
        window.removeEventListener('resize', el.__stripRecheck);
        window.removeEventListener('orientationchange', el.__stripRecheck);
        el.__stripRecheck = null;
      }
      return;
    }
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

  /* A RESIZE OBSERVER WATCHES THE BOX, AND THE BOX IS NOT WHAT CHANGES.

     The strip is full-width, so narrowing the window changes its width and the
     observer fires — but the property that decides the hint is scrollWidth,
     which changes when the media query flips flex-wrap, not when the border box
     resizes. Those are the same event often enough to look correct and not
     always: resizing an already-mounted desktop page down to mobile left two
     strips scrollable with no hint at all.

     Listening for the viewport directly closes it. The media query is the thing
     that actually changes the layout, so it is what gets listened to, with a
     plain resize handler for the widths between steps. */
  const recheck = () => settle();
  if (typeof window !== 'undefined' && window.addEventListener){
    window.addEventListener('resize', recheck, { passive: true });
    window.addEventListener('orientationchange', recheck, { passive: true });
    if (window.matchMedia){
      const mq = window.matchMedia('(max-width:720px)');
      if (mq.addEventListener) mq.addEventListener('change', recheck);
    }
    el.__stripRecheck = recheck;
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
    /* The cross-market returns view, which was the home page until verdicts
       took its place. Listed here so it is one click from anywhere. */
    link('/returns', L(['Returns', '回报对比']), activeId === 'returns'),
    /* Who changed which grade or verdict, and on what. The only place a
       reader can tell a rule's change from the analyst's. */
    link('/changes', L(['Changes', '变更记录']), activeId === 'changes'),
    /* Cards for markets with no dashboard: nine of them, screened and not
       priced. */
    link('/scout', L(['Scouting', '观察名单']), activeId === 'scout'),
    markets.map(m => link(
      '/markets/' + m.manifest.slug,
      L(m.manifest.shortName),
      m.manifest.id === activeId,
      marketFlagCode(m))));
}

/**
 * A market's own tab strip: the seven tabs of markets/tabGroups.js, with the
 * one that holds the section in view marked active.
 *
 * @param {Array<[string, [string,string]]>} sectionTabs  the market's sections
 * @param {string} activeSection  the section being shown
 * @param {string} basePath  e.g. '/markets/western-australia'
 */
export function tabNav(sectionTabs, activeSection, basePath){
  const active = tabOfSection(sectionTabs, activeSection);
  return tabStrip(tabsFor(sectionTabs).map(tab => {
    /* The landing tab's address is the market's own, so a link to it and a
       link to the market are one link. */
    const href = basePath + (tab.id === LANDING_TAB ? '' : '/' + tab.id);
    return h('a', {
      class: 'tab-btn' + (active && active.id === tab.id ? ' active' : ''),
      href,
      onclick: (e) => { e.preventDefault(); navigate(href); window.scrollTo(0, 0); },
    }, L(tab.label));
  }));
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

/**
 * The sub-strip of a tab that shows one section at a time. Today that is
 * Revenue: its sections carry the market's own labels.
 */
export function revenueSubNav(sectionTabs, activeSection, basePath){
  const tab = tabOfSection(sectionTabs, activeSection);
  if (!tab || !tab.pick || tab.sections.length < 2) return null;
  const label = new Map(sectionTabs);
  return h('div', {
    class:'tabs revenue-subtabs',
    'aria-label':L(['Revenue mechanism sections', '收入机制子页']),
  }, tab.sections.map(id => {
    const href = basePath + '/' + tab.id + (id === tab.sections[0] ? '' : '/' + id);
    return h('a', {
      class:'tab-btn' + (activeSection === id ? ' active' : ''),
      href,
      onclick:(event) => {
        event.preventDefault();
        navigate(href);
        window.scrollTo(0, 0);
      },
    }, L(label.get(id)));
  }));
}
