/* ---------------------------------------------------------------------------
   Market card — the home page's market-universe tile.

   Registry-driven: it renders whatever markets it is handed and reads only the
   manifest + comparison interface. It never reaches into a market's dashboard.

   The prototype's card linked to `href` and a delegated click handler opened a
   srcdoc iframe overlay. It is now a real route.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { chip } from './chip.js';
import { meter } from './metricCard.js';
import { fmtPct, fmtIRRor } from '../utils/formatting.js';
import { marketFlagCode } from './navigation.js';

/**
 * @param {object} market  registry entry ({ manifest, comparison, ... })
 * @param {object} result  comparison-engine output for that market's base strategy
 */
export function marketCard(market, result){
  const { manifest: mf, comparison: cmp } = market;
  const href = '/markets/' + mf.slug;

  const stat = (label, value) => h('div', { class: 'ms' },
    h('div', { class: 'l' }, L(label)),
    h('div', { class: 'v' }, value));

  return h('div', { class: 'mcard' },
    h('div', { class: 'mhead' },
      h('span', { class: `flag fi fi-${marketFlagCode(market)}`, 'aria-hidden':'true' }),
      h('div', {},
        h('h3', {}, L(mf.name)),
        h('div', { class: 'arch' }, L(cmp.narrative.archetype)))),
    h('div', { style: 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;' },
      chip('warn', mf.status),
      h('span', { style: 'font-size:11.5px;color:var(--ink2);' },
        L(['Composite ', '综合评分 ']) + cmp.score.composite + '/100')),
    meter(cmp.score.composite, mf.color),
    h('div', { class: 'mstats' },
      stat(['Contracted share (yr 1)', '合同化占比（第1年）'], fmtPct(result.contractedShare * 100, 0)),
      stat(['15-yr unlevered IRR', '15年无杠杆IRR'], fmtIRRor(result.irrHold, result.irrHoldAbsent, L))),
    h('div', { class: 'thesis' }, L(cmp.narrative.thesis)),
    h('a', {
      class: 'enter',
      href,
      onclick: (e) => { e.preventDefault(); navigate(href); },
    }, L(['Open dashboard →', '进入看板 →'])));
}
