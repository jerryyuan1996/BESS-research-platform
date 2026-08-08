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
import { fmtIRRor } from '../utils/formatting.js';
import { marketFlagCode } from './navigation.js';

const CONSENSUS = {
  aligned:['Aligned', '一致'],
  more_bullish:['More bullish', '偏乐观'],
  stale:['Corrected', '已更正'],
};
const CONSENSUS_CHIP = { aligned:'good', more_bullish:'serious', stale:'warn' };

/**
 * @param {object} market  registry entry ({ manifest, comparison, ... })
 * @param {object} result  comparison-engine output for that market's base strategy
 * @param {object} scenarios owner Base/Bull results
 */
export function marketCard(market, result, scenarios){
  const { manifest: mf, comparison: cmp } = market;
  const href = '/markets/' + mf.slug;

  const profile = cmp.refinement;
  const scenarioIrr = item => Number.isFinite(item?.result?.irrHold)
    ? fmtIRRor(item.result.irrHold, item.result.irrHoldAbsent, L) : 'N/M';
  const scenarioLine = [scenarios?.base, scenarios?.bull]
    .map(scenarioIrr).join(' / ');
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
      chip('serious', ['Screening only', '仅供筛选']),
      chip(CONSENSUS_CHIP[profile.consensus.status] || 'info',
        CONSENSUS[profile.consensus.status] || ['Review', '复核']),
      h('span', { style: 'font-size:11.5px;color:var(--ink2);' },
        L(['Evidence ', '证据 ']) + profile.confidenceScore + '/10')),
    h('div', { class: 'mstats mstats-single' },
      stat(['Base / Bull IRR', '基准/乐观IRR'], scenarioLine)),
    h('div', { class:'note', style:'margin:8px 0;' },
      h('b', {}, L(['Next gate: ', '下一门槛：'])), profile.investmentGate?.[0] || 'Project evidence'),
    h('div', { class: 'thesis' }, L(cmp.narrative.thesis)),
    h('a', {
      class: 'enter',
      href,
      onclick: (e) => { e.preventDefault(); navigate(href); },
    }, L(['Open dashboard →', '进入看板 →'])));
}
