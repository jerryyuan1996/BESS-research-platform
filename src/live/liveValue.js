/* ---------------------------------------------------------------------------
   RENDERING OBSERVED VALUES.

   The visual contract for the whole live-data feature:

       an observed value NEVER replaces an approved one on screen

   They are shown together, labelled, with the observation's age. A reader must
   always be able to tell which number the model used and which number the market
   is currently reporting, because those are different claims and the difference
   is the interesting part.

   This is the same discipline the comparison engine already applies to
   availability — it returns { na } rather than substituting zero, so a caller
   cannot accidentally treat "unknown" as "nothing". Here, an observation cannot
   be accidentally treated as an assumption.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { freshnessOf, ageLabel, FRESHNESS } from './freshness.js';

/**
 * A small provenance chip: LIVE / OVERDUE / STALE / SEED.
 * @param {object|null} summary
 */
export function liveBadge(summary){
  const f = freshnessOf(summary);
  const cls = {
    [FRESHNESS.FRESH]: 'live-fresh',
    [FRESHNESS.AGING]: 'live-aging',
    [FRESHNESS.STALE]: 'live-stale',
    [FRESHNESS.ABSENT]: 'live-absent',
  }[f.state];

  const node = h('span', { class: 'badge live ' + cls }, L(f.label));
  if (f.ageHours != null){
    node.title = L(['Fetched ', '获取于']) + L(ageLabel(f.ageHours))
      + ' · ' + (f.fetchedAt || '');
  }
  return node;
}

/**
 * An approved value paired with its observation.
 *
 * @param {object} args
 * @param {string[]} args.label       [en, zh] name of the quantity
 * @param {string}   args.approved    formatted approved value
 * @param {string}   [args.observed]  formatted observation, when available
 * @param {object|null} args.summary  the snapshot summary, for freshness
 * @param {number}   [args.delta]     relative difference, for the caption
 */
export function observedVsApproved({ label, approved, observed, summary, delta }){
  const row = h('div', { class: 'obs-row' });

  row.append(h('span', { class: 'obs-label' }, L(label)));

  row.append(h('span', { class: 'obs-approved' },
    h('span', { class: 'obs-tag' }, L(['approved', '已批准'])),
    h('b', {}, approved)));

  if (observed != null){
    row.append(h('span', { class: 'obs-observed' },
      h('span', { class: 'obs-tag' }, L(['observed', '实测'])),
      h('b', {}, observed)));

    if (typeof delta === 'number' && Number.isFinite(delta)){
      const cls = Math.abs(delta) < 0.02 ? 'flat' : (delta > 0 ? 'up' : 'down');
      row.append(h('span', { class: 'obs-delta ' + cls },
        (delta >= 0 ? '+' : '') + (delta * 100).toFixed(1) + '%'));
    }
    row.append(liveBadge(summary));
  } else {
    row.append(h('span', { class: 'obs-absent' }, L(['no observation published', '暂无实测数据'])));
  }

  return row;
}

/**
 * The standing disclaimer for any block showing observed data.
 *
 * Repeated per block rather than stated once at the top of the page, because a
 * reader arrives at a deep link, screenshots one card, or pastes one table into
 * a memo — and the caveat has to travel with the number.
 */
export function observedNote(){
  return h('div', { class: 'cap obs-note' }, L([
    'Observed values are published automatically from public sources. They are shown for comparison only — every figure in the model remains the analyst-approved value until a change is reviewed and merged.',
    '实测值由公开来源自动发布，仅供对照。模型中的每一项数值在经人工复核并合并前，均维持分析师已批准的取值。',
  ]));
}
