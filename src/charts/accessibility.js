/* Shared presentation only: never changes the supplied values or scale domains. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { fmtN } from '../utils/formatting.js';
import { formatNumber, formatVintage } from '../utils/locale.js';
import { S } from './chartUtils.js';
import { tipShow, tipHide } from '../components/tooltip.js';

const kinds = {
  line: ['Line chart', '折线图'], bar: ['Bar chart', '柱状图'],
  band: ['Low, base and high chart', '低值、基准与高值图'],
  waterfall: ['Waterfall chart', '瀑布图'], scatter: ['Scatter chart', '散点图'],
  exposure: ['Capital at risk by month from site control', '自取得场址起各月的风险资本'],
};
const category = ['Category', '类别'], value = ['Value', '数值'];
const exact = v => v == null ? '—' : typeof v === 'number' ? formatNumber(v, { maximumFractionDigits: 20 }) : L(v);
const seriesNames = (cfg, kind) => kind === 'band' ? [['High', '高'], ['Base', '基准'], ['Low', '低']] :
  (cfg.series || cfg.curves || cfg.pts || []).map(s => s.name || s.label).filter(Boolean);

export function chartMetadata(cfg, kind, heading = ''){
  const names = [...new Set(seriesNames(cfg, kind).map(L))];
  const title = L(cfg.title || cfg.name) || heading || names.join(' / ') || L(kinds[kind]);
  const axes = [cfg.xlabel && L(['X axis: ', '横轴：']) + L(cfg.xlabel),
    cfg.ylabel && L(['Y axis: ', '纵轴：']) + L(cfg.ylabel)].filter(Boolean);
  return { title, description: [L(kinds[kind]), ...axes,
    names.length && L(['Series: ', '系列：']) + names.join(' / '),
    L(['Tab to inspect values; Escape closes the tooltip. Exact values are in the table below.',
      '按 Tab 查看数值；Escape 关闭提示。精确数值见下方表格。'])].filter(Boolean).join('. ') };
}

/** Only a supplied dataset's own vintage: no clock, manifest or page-date fallback. */
export function chartVintage(dataset){
  const vintage = dataset?.vintage ?? dataset?.asOf ?? dataset?.asAt ?? dataset?.dataAsOf ?? dataset?.snapshotDate;
  if (typeof vintage !== 'string' && typeof vintage !== 'number') return null;
  return String(vintage).trim() || null;
}
export function vintageLabel(dataset){
  const raw = chartVintage(dataset);
  if (!raw) return null;
  return L(['As of ', '截至 ']) + formatVintage(raw);
}

/** The rows mirror the renderer, including its zero coercion and omitted stacks.
    Raw numbers remain raw until the table is rendered; null line gaps stay null. */
export function chartTableData(cfg, kind){
  if (kind === 'line' || kind === 'bar') return {
    headers: [cfg.xlabel || category, ['Series', '系列'], cfg.ylabel || value],
    rows: [...cfg.xs.flatMap((x, i) => cfg.series.flatMap(s => {
      const v = kind === 'bar' ? s.vals[i] || 0 : s.vals[i] ?? null;
      return kind === 'bar' && cfg.mode === 'stack' && v <= 0 ? [] : [[x, s.name, v]];
    })), ...(cfg.refs || []).map(r => [L(['Reference', '参考线']), r.label, r.y])],
  };
  if (kind === 'band') return {
    headers: [cfg.xlabel || category, ['High', '高'], ['Base', '基准'], ['Low', '低'], ...(cfg.official ? [['Official', '官方']] : [])],
    rows: cfg.xs.map((x, i) => [x, cfg.high[i], cfg.base[i], cfg.low[i], ...(cfg.official ? [cfg.official.i === i ? cfg.official.y : null] : [])]),
  };
  if (kind === 'waterfall'){
    let cumulative = 0;
    return { headers: [category, cfg.ylabel || value, ['From', '起点'], ['To', '终点']], rows: cfg.steps.map(s => {
      const total = s.t === 'start' || s.t === 'total';
      const from = total ? cfg.zeroBase ? 0 : Math.min(0, s.v) : cumulative;
      cumulative = total ? s.v : cumulative + s.v;
      return [s.l, s.v, from, cumulative];
    }) };
  }
  if (kind === 'scatter') return { headers: [['Point', '数据点'], cfg.xlabel || 'X', cfg.ylabel || 'Y', ['Details', '详情']],
    rows: cfg.pts.map(p => [p.name || p.label || '', p.x, p.y, { html: p.tip || p.short || '' }]) };
  if (kind === 'exposure') return {
    headers: [['Series / event', '系列 / 事件'], ['Month', '月份'], ['Fast', '快'], ['Slow', '慢'], ['Before (USD/MW)', '之前（美元/MW）'], ['After (USD/MW)', '之后（美元/MW）'], ['Lower bound', '下限']],
    rows: cfg.curves.flatMap(({ name, curve }, i) => [
      [name, 0, 0, 0, curve.events[0]?.before ?? 0, curve.events[0]?.before ?? 0, false],
      ...(i === 0 && curve.decision ? [[L(name) + ' / ' + L(['Decision', '投资决策']), curve.decision.central, curve.decision.fast, curve.decision.slow, null, null, null]] : []),
      ...curve.events.map(e => [L(name) + ' / ' + L(e.label || e.type), e.month.central, e.month.fast, e.month.slow, e.before, e.after, e.lowerBound]),
      [L(name) + ' / ' + L(['First revenue', '首笔收入']), curve.firstRevenue.central, curve.firstRevenue.fast, curve.firstRevenue.slow, curve.end, curve.end, curve.events.at(-1)?.lowerBound ?? false],
    ]),
  };
  return { headers: [], rows: [] };
}

function plainHTML(html){
  const box = h('div', { html });
  box.querySelectorAll?.('b, span, div, hr').forEach(el => el.append(' '));
  return box.textContent.replace(/\s+/g, ' ').trim();
}
function cell(value){
  return value && typeof value === 'object' && 'html' in value ? plainHTML(value.html) :
    typeof value === 'boolean' ? L(value ? ['Yes', '是'] : ['No', '否']) : exact(value);
}
let sequence = 0;
export function finishChart(parent, wrap, svg, cfg, kind){
  const head = parent.querySelector?.('h2, h3, h4');
  // Card badges are child elements, not part of its title.
  const heading = head ? [...head.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim() : '';
  const meta = chartMetadata(cfg, kind, heading || svg.getAttribute('aria-label') || ''), id = 'chart-' + ++sequence;
  svg.removeAttribute('aria-hidden'); svg.removeAttribute('aria-label');
  svg.setAttribute('role', 'img'); svg.setAttribute('aria-labelledby', id + '-title');
  svg.setAttribute('aria-describedby', id + '-desc');
  const title = S('title', { id: id + '-title' }), desc = S('desc', { id: id + '-desc' });
  title.textContent = meta.title; desc.textContent = meta.description; svg.prepend(title, desc);
  wrap.setAttribute('data-chart-type', kind);
  const stamp = vintageLabel(cfg.dataset);
  if (stamp) wrap.append(h('p', { class: 'chart-vintage', 'data-vintage': chartVintage(cfg.dataset) }, stamp));
  const data = chartTableData(cfg, kind);
  wrap.append(h('details', { class: 'chart-table' }, h('summary', {}, L(['Exact values', '精确数值'])),
    h('div', { class: 'tbl-wrap', tabindex: 0, role: 'region', 'aria-label': meta.title }, h('table', {},
      h('caption', {}, meta.title), h('thead', {}, h('tr', {}, data.headers.map(v => h('th', { scope: 'col' }, L(v))))),
      h('tbody', {}, data.rows.map(row => h('tr', {}, row.map((v, i) => h(i ? 'td' : 'th', i ? {} : { scope: 'row' }, cell(v))))))))));
  parent.append(wrap);
  return wrap;
}

/** Mouse and focus share one tooltip, one accessible label, and one dismissal. */
export function pointTooltip(node, html, { show = () => {}, hide = () => {} } = {}){
  node.setAttribute('tabindex', '0'); node.setAttribute('role', 'img');
  node.setAttribute('class', ((node.getAttribute('class') || '') + ' chart-point').trim());
  node.setAttribute('aria-label', plainHTML(html));
  const close = () => { hide(); tipHide(); };
  const open = ev => { show(); tipShow(html, ev); };
  node.addEventListener('mousemove', open);
  node.addEventListener('mouseleave', close);
  node.addEventListener('focus', () => {
    // Settle scrolling before measuring; the page otherwise animates this move.
    node.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
    const r = node.getBoundingClientRect();
    open({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
  });
  node.addEventListener('blur', close);
  node.addEventListener('keydown', ev => { if (ev.key === 'Escape'){ close(); ev.preventDefault(); ev.stopPropagation(); } });
}

export function seriesTooltip(cfg, i){
  let html = `<b>${L(cfg.xs[i])}</b>`;
  for (const s of cfg.series) html += `<div class="tr"><span><span style="display:inline-block;width:8px;height:8px;border-radius:var(--r-xs);background:${s.color};margin-right:5px"></span>${L(s.name)}</span><b>${s.vals[i] == null ? '—' : (cfg.yfmt || fmtN)(s.vals[i])}</b></div>`;
  return html;
}

/** Exact exposure events share the chart keyboard/tooltip behavior. */
export function exposureInspectors(svg, cfg, X, Y){
  const nf = v => formatNumber(v, { maximumFractionDigits: 20 });
  // Event inspectors also cover thin comparison curves and zero-change events.
  for (const { curve, name } of cfg.curves){
    for (const e of curve.events){
      const point = S('circle', { cx: X(e.month.central), cy: Y(e.after), r: 6, fill: 'transparent' });
      pointTooltip(point, `<b>${L(name)} · ${L(e.label)}</b><div>${L(['Month', '月份'])}: ${nf(e.month.central)} (${nf(e.month.fast)}–${nf(e.month.slow)})</div><div>${nf(e.before)} → ${nf(e.after)} USD/MW</div>` +
        (e.lowerBound ? `<div>${L(['Lower bound', '下限'])}</div>` : ''));
      svg.append(point);
    }
    const end = S('circle', { cx: X(curve.firstRevenue.central), cy: Y(curve.end), r: 6, fill: 'transparent' });
    pointTooltip(end, `<b>${L(name)} · ${L(['First revenue', '首笔收入'])}</b><div>${nf(curve.firstRevenue.central)} · ${nf(curve.end)} USD/MW</div>`);
    svg.append(end);
  }
}
