/* Chart-ERCOT-AS: installed battery power above, annual reserve prices below
   (ercot-storyboard.md §9; ercot-build-evidence.md §5).

   Both gates are closed: ERCOT_FLEET and ERCOT_PRICES are not publication-
   ready and carry no eligible value. Until both clear, the chart is the
   approved unscaled Example: fleet rising, prices falling, with no numerical
   axis, no year ticks, no points, no values, no crosshair, no observed-value
   table and no observed-price caption. The Example shapes below are generic
   and derived from no record. Clearing one panel does not clear the other,
   and a mixed or observed rendering is a later, separately reviewed change.
   Reserve prices (per MW held ready, per hour) never share an axis with an
   energy price, and no toll is drawn. */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { s, n2 } from '../../../experience/story/kit/svg.js';
import { toggleGroup } from '../../../experience/story/kit/controls.js';
import { fillPair } from '../../../experience/story/contract.js';

const fill = (el, ...kids) => el.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false));
const words = (pair, values) => L(fillPair(pair, values || {}));
const T = {
  example: ['Example · unscaled; the observed series await publication clearance', '示例 · 不设数值刻度；观测序列待确认发布权限'],
  earlier: ['Earlier', '较早'],
  later: ['Later', '较近'],
  fleetSeries: ['Battery power, rising (Example)', '电池装机，上升（示例）'],
  priceSeries: ['Reserve price, falling (Example)', '备用价格，下降（示例）'],
  later2023: ['Starts later: ECRS began in June 2023', '起点较晚：ECRS自2023年6月起实施'],
  separate: ['Two panels, two measures: they share no axis', '两个面板、两种计量：不共用坐标轴'],
};

/* Generic Example shapes, 0 (low) to 100 (high), left to right. */
const EX_FLEET = [6, 10, 18, 40, 100];
const EX_PRICE = [100, 34, 30, 12, 6];
const EX_ECRS = [null, null, 100, 22, 6];

/** 'observed' only when both gates are open and both series have eligible values. */
export function chartMode(records) {
  const fleet = [2021, 2022, 2023, 2024, 2025].map(y => records.fleet?.[y]?.installedMW).filter(Number.isFinite);
  const prices = Object.values(records.prices?.products || {}).flatMap(p => Object.values(p.annual || {})).map(r => r.usdPerMWPerHour).filter(Number.isFinite);
  return records.fleet?.publicationReady && records.prices?.publicationReady && fleet.length && prices.length ? 'observed' : 'example';
}

const path = (vals, X, Y) => vals.map((v, i) => v === null ? null : [X(i), Y(v)]).filter(Boolean).map(([x, y], i) => `${i ? 'L' : 'M'}${n2(x)},${n2(y)}`).join(' ');

export function reserveChart(shot, { values }, { panels = ['fleet', 'price'], records }) {
  const mode = chartMode(records);
  const lb = shot.labels, products = panels.includes('price') ? shot.controls.slice(0, 5) : [];
  let product = 0, measured = false;
  const host = h('div', { class: 'k-scene ercot-chart', 'data-chart': 'Chart-ERCOT-AS', 'data-mode': 'example', 'data-gate': mode });
  const drawing = h('div', { class: 'ercot-chart-frame' }), notes = h('div', {});
  const paint = () => {
    host.setAttribute('data-product', String(product));
    const X = i => 70 + i * 130, top = 14, height = 120;
    /* One drawing per panel, each with its own title: two measures, no shared axis.
       Each series name sits in the corner its line leaves empty. */
    const panel = (key, data, title, series, corner) => {
      const Y = v => top + height - v / 100 * height;
      return h('div', { class: 'ercot-panel', 'data-panel': key },
        h('p', { class: 'ercot-panel-title' }, title),
        s('svg', { viewBox: '0 0 640 170', role: 'img', 'aria-label': `${title}. ${series}` },
          s('line', { x1: 50, x2: 620, y1: top + height, y2: top + height, class: 'ercot-axis' }),
          s('line', { x1: 50, x2: 50, y1: top, y2: top + height, class: 'ercot-axis' }),
          s('path', { d: path(data, X, Y), class: 'ercot-line ercot-example', 'data-kind': 'example' }),
          s('text', { x: 610, y: corner === 'low' ? top + height - 12 : top + 16, class: 'ercot-label', 'text-anchor': 'end' }, series),
          s('text', { x: 50, y: 162, class: 'ercot-label' }, L(T.earlier)),
          s('text', { x: 620, y: 162, class: 'ercot-label', 'text-anchor': 'end' }, `${L(T.later)} →`)));
    };
    fill(drawing,
      panels.includes('fleet') ? panel('fleet', EX_FLEET, `${words(lb.installed, values)} · ${words(lb.example, values)}`, L(T.fleetSeries), 'low') : null,
      panels.includes('price') ? panel('price', product === 1 ? EX_ECRS : EX_PRICE, `${words(lb.price, values)}${L([': ', '：'])}${words(products[product], values)} · ${words(lb.example, values)}`, L(T.priceSeries), 'high') : null,
      h('p', { class: 'ercot-note ercot-tagline' }, L(T.example)));
    fill(notes,
      panels.length === 2 ? h('p', { class: 'ercot-note' }, L(T.separate)) : null,
      product === 1 && products.length ? h('p', { class: 'ercot-note' }, L(T.later2023)) : null,
      measured ? h('ul', { class: 'ercot-measured' }, shot.extra.measured.map(p => h('li', {}, words(p, values)))) : null);
  };
  if (products.length) host.append(
    toggleGroup({ label: fillPair(shot.question, values), value: product, options: products.map((p, value) => ({ value, label: fillPair(p, values) })), onChange: v => { product = v; paint(); } }),
    toggleGroup({ label: shot.controls[5], multi: true, options: [{ value: 'measured', label: fillPair(shot.controls[5], values), pressed: false }], onChange: (_, pressed) => { measured = pressed; paint(); } }));
  host.append(drawing, notes);
  paint();
  return host;
}
