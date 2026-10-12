/* ---------------------------------------------------------------------------
   Draws the sections of one tab, for every dashboard that has tabs.

   A tab holds one section or several (see markets/tabGroups.js). The shared
   block engine and Western Australia's hand-written dashboard both draw them
   through here, so a stacked tab reads the same in both.

   EACH SECTION GETS ITS OWN WRAPPER, marked with its section id. That is what
   lets the page enhancements run once per section: a section claim is placed
   on its own section's heading and on no other, whichever tab holds it.

   THE ADDRESS IS REWRITTEN IN PLACE when the reader arrived by an old one.
   /markets/<slug>/grid lands on Entry and delivery, scrolls to the grid
   section, and the address bar then reads /entry/grid. replaceState and not a
   navigation: nothing re-renders and the back button still goes back.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { card } from './card.js';
import { mountTabGrades } from './investmentCaseLoader.js';

/**
 * @param main      where the tab's content goes
 * @param where     from resolveSegment: { tab, sections, section, path }
 * @param options.basePath  the market's base path, e.g. '/markets/germany'
 * @param options.marketId  for the changelog link on the Evidence tab
 * @param options.draw      (sectionId, wrapper) => void — draws one section
 * @param options.after     (sectionId, wrapper) => void — enhancements for it
 */
export function drawTab(main, where, { basePath, marketId, draw, after = () => {} }){
  let target = null;
  /* Saturation and demand, or debt, exit and scale: the grades these sections
     are the evidence for (plan section 6.2). */
  if (marketId && (where.tab.id === 'competition' || where.tab.id === 'capital')) mountTabGrades(main, marketId, where.tab.id);
  for (const id of where.sections){
    const wrapper = h('div', { class: 'tab-section', 'data-section': id });
    main.append(wrapper);
    draw(id, wrapper);
    after(id, wrapper);
    if (id === where.section && !where.tab.pick) target = wrapper;
  }

  if (where.tab.id === 'evidence' && marketId){
    const changes = card(['What changed in this market\'s view', '该市场投资判断的变更记录'], []);
    changes.style.marginTop = '14px';
    changes.append(h('div', { class: 'cap' }, L([
      'Every change to a grade, a verdict or a trigger for this market, with who made it and why.',
      '该市场每一次评级、结论或触发事件的变更，以及由谁改动、原因为何。',
    ])));
    const href = `/changes?market=${marketId}`;
    changes.append(h('a', { class: 'btn', href, onclick: (e) => { e.preventDefault(); navigate(href); window.scrollTo(0, 0); } },
      L(['Open this market\'s changelog ▸', '查看该市场的变更记录 ▸'])));
    main.append(changes);
  }

  if (typeof window === 'undefined') return;
  const wanted = basePath + where.path;
  if (window.location.pathname.replace(/\/+$/, '') !== wanted){
    window.history.replaceState(window.history.state, '', wanted + window.location.search + window.location.hash);
  }
  if (target){
    /* Twice: once the page has laid out, and once more after the sections
       above it that load on demand have arrived and pushed it down. The second
       is skipped if the reader has already scrolled somewhere themselves. */
    let placed = null;
    const place = () => { target.scrollIntoView({ block: 'start' }); placed = window.scrollY; };
    /* A timer and not an animation frame: a frame never comes in a tab that is
       not being painted, and the reader would arrive at the top of the page. */
    setTimeout(place, 0);
    setTimeout(() => { if (target.isConnected && placed !== null && Math.abs(window.scrollY - placed) < 4) place(); }, 700);
  }
}
