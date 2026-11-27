import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

export function svgEl(tag, attrs = {}, ...children) {
	const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
	for (const child of children.flat()) if (child != null) node.append(child.nodeType ? child : document.createTextNode(child));
	return node;
}
export const svgText = (x, y, value, attrs = {}) => svgEl('text', { x, y, ...attrs }, value);
export const exactMoney = (value, currency) =>
	Number.isFinite(value)
		? currency + ' ' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
		: '—';
let sequence = 0;
export function chartSVG(title, description, viewBox = '0 0 440 250') {
	const id = 'risk-chart-' + ++sequence;
	return svgEl(
		'svg',
		{ viewBox, role: 'img', 'aria-labelledby': id + '-title', 'aria-describedby': id + '-desc' },
		svgEl('title', { id: id + '-title' }, L(title)),
		svgEl('desc', { id: id + '-desc' }, L(description)),
	);
}
export function chartFigure(kind, title, description) {
	return h(
		'figure',
		{ class: 'ix-risk-chart ix-' + kind, 'data-risk-chart': kind },
		h('figcaption', {}, h('h3', {}, L(title)), h('p', { class: 'ix-caption' }, L(description))),
	);
}
export function chartTable(title, headers, rows) {
	return h(
		'details',
		{ class: 'ix-details ix-risk-table' },
		h('summary', {}, L(['Exact values and evidence', '精确数值与证据'])),
		h(
			'div',
			{ class: 'ix-table-scroll', tabindex: 0, 'aria-label': L(title) },
			h(
				'table',
				{ class: 'ix-table' },
				h('caption', {}, L(title)),
				h(
					'thead',
					{},
					h(
						'tr',
						{},
						headers.map((label) => h('th', { scope: 'col' }, L(label))),
					),
				),
				h(
					'tbody',
					{},
					rows.map((row) =>
						h(
							'tr',
							{},
							row.map((value, i) => h(i ? 'td' : 'th', i ? {} : { scope: 'row' }, L(value))),
						),
					),
				),
			),
		),
	);
}
export function seriesInspector(points, label, describe) {
	const output = h('p', { class: 'ix-risk-readout', 'aria-live': 'polite' });
	const range = h('input', { type: 'range', min: 0, max: points.length - 1, step: 1, value: 0, 'aria-label': L(label) });
	const update = () => {
		const text = describe(points[Number(range.value) || 0]);
		output.replaceChildren(text);
		range.setAttribute('aria-valuetext', text);
	};
	range.addEventListener('input', update);
	update();
	return h('div', { class: 'ix-risk-inspector' }, h('label', {}, L(label), range), output);
}
/** Null observations break the line; debt-free years are never drawn as zero. */
/* `width` widens the drawing box for a chart shown wide, so its text renders
   near reading size instead of scaling up with the figure. */
export function linePlot(title, description, points, format, { thresholds = [], step = false, marks = [], width = 440 } = {}) {
	const svg = chartSVG(title, description, '0 0 ' + width + ' 250'),
		left = Math.round((72 * width) / 440),
		right = width - 26,
		top = 24,
		bottom = 206;
	const values = [0, ...points.map((p) => p.value).filter(Number.isFinite), ...thresholds.map((t) => t.value)];
	const low = Math.min(...values),
		high = Math.max(...values),
		span = high - low || 1;
	const from = points[0].at,
		to = points.at(-1).at;
	const x = (at) => left + ((at - from) / (to - from || 1)) * (right - left),
		y = (v) => bottom - ((v - low) / span) * (bottom - top);
	for (let i = 0; i <= 4; i++) {
		const v = low + (span * i) / 4;
		svg.append(
			svgEl('line', { x1: left, x2: right, y1: y(v), y2: y(v), class: 'ix-grid-line' }),
			svgText(left - 8, y(v) + 5, format(v), { 'text-anchor': 'end' }),
		);
	}
	for (const at of [...new Set([from, ...points.filter((p, i) => i > 0 && i % 5 === 0 && p.at < to - 2).map((p) => p.at), to])])
		svg.append(svgText(x(at), 232, Number(at.toFixed(2)), { 'text-anchor': 'middle' }));
	svg.append(svgEl('line', { x1: left, x2: right, y1: y(0), y2: y(0), class: 'ix-risk-zero' }));
	thresholds.forEach((t, i) =>
		svg.append(
			svgEl(
				'line',
				{ x1: left, x2: right, y1: y(t.value), y2: y(t.value), class: 'ix-risk-threshold threshold-' + i },
				svgEl('title', {}, t.label),
			),
		),
	);
	let segment = [];
	const flush = () => {
		if (segment.length) svg.append(svgEl('polyline', { points: segment.join(' '), class: 'ix-risk-line' }));
		segment = [];
	};
	points.forEach((p, i) => {
		if (!Number.isFinite(p.value)) {
			flush();
			return;
		}
		if (step && segment.length) segment.push(x(p.at) + ',' + y(points[i - 1].value));
		segment.push(x(p.at) + ',' + y(p.value));
	});
	flush();
	marks.forEach((m) =>
		svg.append(
			svgEl('circle', { cx: x(m.at), cy: y(m.value), r: 5, class: 'ix-risk-mark' }, svgEl('title', {}, m.label)),
			/* Labels sit beside the point, on the side away from a rising
			   line, with a halo so a crossing line never hides them. */
			svgText(
				x(m.at) > (left + right) / 2 ? x(m.at) - 10 : x(m.at) + 10,
				Math.max(top + 14, Math.min(bottom - 4, y(m.value) + (m.place === 'below' ? 22 : -10))),
				m.label,
				{ 'text-anchor': x(m.at) > (left + right) / 2 ? 'end' : 'start', class: 'ix-risk-mark-label' },
			),
		),
	);
	return svg;
}
