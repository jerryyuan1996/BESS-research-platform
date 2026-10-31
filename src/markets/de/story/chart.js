/* The approved unscaled Example for Chart-DE-SPREAD-TOLL.
 * Price publication is blocked: no observed endpoint is requested and no
 * numeric price axis is fabricated. The fee label reads the model result. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { fillPair } from '../../../experience/story/contract.js';
import { s, uid } from '../../../experience/story/kit/svg.js';
import { PRICE_PUBLICATION_BLOCKED } from './history.js';

const path = points => points.map(([x, y], i) => (i ? 'L' : 'M') + x + ',' + y).join(' ');
// Dimensionless drawing coordinates, not German prices or distribution estimates.
const EXAMPLE = [[12,95],[48,80],[84,106],[120,48],[156,75],[192,35],[228,91],[264,61],[300,103],[336,47],[372,78]];
const image = (title, height, ...kids) => {
  const id = uid('de-chart');
  return s('svg', { viewBox: '0 0 384 ' + height, role: 'img', 'aria-labelledby': id }, s('title', { id }, L(title)), ...kids);
};

export function spreadTollChart(shot, { values, model, chartShot, vocab, focus = 'merchant', tail = false }) {
  if (!PRICE_PUBLICATION_BLOCKED) throw new Error('The observed layer needs a separate rights and quality review before activation');
  const labels = chartShot.labels.all.map(t => t.split(/[;；]/).map(x => x.trim()));
  const upper = [labels[0][0], labels[1][0]], lower = [labels[0][1], labels[1][1]];
  const top = EXAMPLE.map(([x, y]) => [x, y - 11]);
  const bottom = EXAMPLE.map(([x, y]) => [x, y + 11]).reverse();
  const band = path(top) + ' ' + path(bottom).replace(/^M/, 'L') + ' Z';
  const price = h('section', { class: 'de-chart-panel de-price-panel' },
    h('h5', {}, L(fillPair(upper, values))),
    image(shot.question, 138, s('path', { class: 'de-band', d: band }), s('path', { class: 'de-trace', d: path(EXAMPLE) })));
  const fee = h('section', { class: 'de-chart-panel de-fee-panel' },
    h('h5', {}, L(fillPair(lower, values))),
    model.fee === null ? h('p', { class: 'k-readout' }, L(vocab('Financial value unavailable')))
      : image(shot.question, 78, s('path', { class: 'de-flat', d: 'M12,42 L372,42' })));
  const chart = h('div', { class: 'de-spread-chart', 'data-chart': 'Chart-DE-SPREAD-TOLL', 'data-mode': 'example', 'data-focus': focus, 'data-fee': model.fee ?? '', 'data-grid-income': 'none', 'data-after-expiry': String(tail) },
    h('p', { class: 'k-readout' }, h('span', { class: 'k-tag' }, L(fillPair(chartShot.caption, values)))),
    price, fee, h('p', { class: 'k-readout' }, L(vocab('Observed series awaiting publication clearance; showing an Example'))));
  if (shot.id === 'de-10') {
    const en = shot.labels.all[0].split(' · '), zh = shot.labels.all[1].split(' · ');
    chart.append(h('div', { class: 'de-clock', 'data-clock': 'model-entry', 'data-expiry': model.expiry ?? '', 'data-tail': String(tail) },
    h('span', {}, L(fillPair([en.slice(0, 2).join(' · '), zh.slice(0, 2).join(' · ')], values))),
    h('span', { class: 'de-tail' }, L([en[2], zh[2]]))));
  }
  return chart;
}
