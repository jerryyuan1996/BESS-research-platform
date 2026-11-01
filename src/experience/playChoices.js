import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { playTitle } from '../governance/playTitle.js';

/** Loaded only by a market with multiple distinct opportunities. */
export function renderPlayChoices(rows, selected, tag) {
  return h('section', { class: 'ix-panel ix-play-choices', 'aria-label': L(['Two separate opportunities', '两类独立投资机会']) },
    h('h2', {}, L(['Two separate opportunities', '两类独立投资机会'])),
    h('div', { class: 'ix-dialog-grid', style: '--compare-count:2' }, rows.map(row => h('article', { class: 'ix-story-play', 'data-play': row.play.id },
      tag(row), h('h3', {}, L(playTitle(row.play, row.stage))),
      row.play.why ? h('p', {}, L(row.play.why)) : null,
      row.play.action?.text ? h('p', {}, L(row.play.action.text)) : null))),
    h('p', { class: 'ix-basis-note' }, L(['Financial case below: ', '下方财务测算对应：']), L(playTitle(selected.play, selected.stage))));
}
