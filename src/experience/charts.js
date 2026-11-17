import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { marketName, pct, returnPct, share, finite, money } from './model.js';
import { cumulativeEquityCash } from '../opportunities/monthlyCash.js';
import { chartFigure, chartTable, linePlot, seriesInspector, exactMoney } from './riskChart.js';
import { meetsTarget, situationalQualifier, QUALIFIER_LABEL } from './traceability.js';

function s(tag, attrs = {}, ...children) {
	const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
	for (const child of children.flat()) if (child != null) node.append(child.nodeType ? child : document.createTextNode(child));
	return node;
}
const text = (x, y, value, attrs = {}) => s('text', { x, y, ...attrs }, value);
const fmt = (n) => Math.round(n).toLocaleString('en-US');

export function miniature(values) {
	const max = Math.max(...values.map(Math.abs), 1);
	return s(
		'svg',
		{
			viewBox: '0 0 400 100',
			class: 'ix-miniature',
			role: 'img',
			'aria-label': L(['Modelled annual operating cash flow', '模型年度经营现金流']),
		},
		s('line', { x1: 0, y1: 88, x2: 400, y2: 88, stroke: 'currentColor', opacity: '.18' }),
		values.map((value, i) =>
			s('rect', {
				x: i * (400 / values.length) + 2,
				y: 88 - (Math.max(0, value) / max) * 74,
				width: (400 / values.length) * 0.64,
				height: (Math.abs(value) / max) * 74,
				rx: 2,
				fill: 'currentColor',
				opacity: 0.95 - i * (0.5 / values.length),
			}),
		),
		text(0, 100, 'Y1'),
		text(375, 100, `Y${values.length}`),
	);
}

/* Actual returns, without a universal hurdle or a target-dependent position. */
export const MATRIX_BASIS = {
	hold: { label: ['All-equity IRR (%)', '全股权IRR（%）'] },
	levered: { label: ['Levered equity IRR (%)', '杠杆后股权IRR（%）'] },
};

/* Plot frame in viewBox units. The inset keeps 0% and 100% dots clear of the frame. */
const PLOT = { left: 58, right: 978, top: 46, bottom: 372, inset: 30 };
const DOT = 7;
const LABEL_HEIGHT = 15;

/* Label positions, nearest first: beside the dot, on a corner, above or below, then stepped away. */
function labelSpots(cx, cy, width, leftFirst) {
	const sides = leftFirst ? [-1, 1] : [1, -1];
	const box = (left, mid) => ({ left, right: left + width, top: mid - LABEL_HEIGHT / 2, bottom: mid + LABEL_HEIGHT / 2 });
	const beside = (side, gap, mid) => box(side === 1 ? cx + gap : cx - gap - width, mid);
	const spots = sides.map((side) => beside(side, 12, cy));
	for (const side of sides) for (const up of [-1, 1]) spots.push(beside(side, 7, cy + up * 15));
	for (const up of [-1, 1]) spots.push(box(cx - width / 2, cy + up * 18));
	for (let step = 2; step <= 12; step++)
		for (const up of [-1, 1]) for (const side of sides) spots.push(beside(side, 16, cy + up * step * 14));
	return spots;
}

export function opportunityMatrix(rows, selected, onSelect, { basis = 'hold' } = {}) {
	const value = (r) => r.econ[basis];
	const dots = rows.filter((r) => finite(value(r)) && finite(r.econ.secured));
	const returns = dots.map((r) => value(r) * 100);
	const low = Math.min(0, Math.floor(Math.min(...returns, 0) / 5) * 5);
	const high = Math.max(10, Math.ceil(Math.max(...returns, 0) / 5) * 5);
	const { left: PL, right: PR, top: PT, bottom: PB, inset } = PLOT;
	const x = (v) => PL + inset + v * (PR - PL - inset * 2);
	const y = (v) => PB - ((v * 100 - low) / (high - low)) * (PB - PT);
	const svg = s('svg', {
		viewBox: '0 0 1000 432',
		class: 'ix-matrix-svg',
		role: 'group',
		'aria-label': L([
			'Global opportunity matrix. Filled dots meet the selected return target; hollow dots fall below it. Select a market with Enter or Space.',
			'全球机会矩阵。实心圆达到所选回报目标，空心圆未达到。按回车或空格选择市场。',
		]),
	});
	const yTicks = [],
		xTicks = [];
	for (let tick = low; tick <= high; tick += 5) {
		const at = y(tick / 100),
			label = text(PL - 10, at + 4, `${tick}%`, { 'text-anchor': 'end' });
		yTicks.push({ at, label });
		svg.append(
			s('line', { x1: PL, y1: at, x2: PR, y2: at, class: tick === 0 ? 'ix-grid-line ix-grid-base' : 'ix-grid-line' }),
			label,
		);
	}
	for (let i = 0; i <= 4; i++) {
		const at = x(i / 4),
			label = text(at, PB + 20, `${i * 25}%`, { 'text-anchor': 'middle' });
		xTicks.push({ at, label });
		svg.append(s('line', { x1: at, y1: PB, x2: at, y2: PB + 5, class: 'ix-grid-line ix-grid-base' }), label);
	}
	svg.append(
		text(14, 22, L(MATRIX_BASIS[basis].label), { class: 'ix-chart-axis' }),
		text((PL + PR) / 2, PB + 46, L(['Modelled fixed revenue share', '模型固定收入占比']), {
			'text-anchor': 'middle',
			class: 'ix-chart-axis',
		}),
		text(PL, PB + 46, L(['← Market-priced', '← 市场化收入']), { class: 'ix-chart-cue' }),
		text(PR, PB + 46, L(['Fixed →', '固定收入 →']), { 'text-anchor': 'end', class: 'ix-chart-cue' }),
	);

	// The selected market reads off both axes: one guide, drawn beneath every dot.
	const guide = s('g', { class: 'ix-matrix-guide', 'aria-hidden': 'true' });
	svg.append(guide);
	const chip = (left, mid, label) => {
		const width = label.length * 6.5 + 10;
		return [
			s('rect', { x: left, y: mid - 9, width, height: 18, rx: 3 }),
			text(left + width / 2, mid + 4, label, { 'text-anchor': 'middle' }),
		];
	};
	const showGuide = (row) => {
		const plotted = row && dots.includes(row),
			cx = plotted ? x(row.econ.secured) : NaN,
			cy = plotted ? y(value(row)) : NaN;
		if (plotted) {
			const returnLabel = returnPct(value(row)),
				shareLabel = share(row.econ.secured);
			guide.replaceChildren(
				s('line', { x1: PL, y1: cy, x2: cx, y2: cy }),
				s('line', { x1: cx, y1: cy, x2: cx, y2: PB }),
				...chip(PL - 6 - (returnLabel.length * 6.5 + 10), cy, returnLabel),
				...chip(cx - (shareLabel.length * 6.5 + 10) / 2, PB + 16, shareLabel),
			);
		} else guide.replaceChildren();
		// A tick label under a value chip steps aside rather than showing through it.
		for (const t of yTicks) t.label.style.visibility = Math.abs(t.at - cy) < 16 ? 'hidden' : '';
		for (const t of xTicks) t.label.style.visibility = Math.abs(t.at - cx) < 32 ? 'hidden' : '';
	};
	const deselect = () => {
		for (const p of svg.querySelectorAll('.ix-point')) {
			p.classList.remove('selected');
			p.setAttribute('aria-pressed', 'false');
		}
	};
	svg.addEventListener('ix:deselect', () => {
		deselect();
		showGuide(null);
	});

	// Labels sit beside their dot. A leader line appears only where crowding pushes one away.
	const occupied = dots.map((row) => ({
		id: row.id,
		left: x(row.econ.secured) - DOT - 2,
		right: x(row.econ.secured) + DOT + 2,
		top: y(value(row)) - DOT - 2,
		bottom: y(value(row)) + DOT + 2,
	}));
	const free = (box, id) =>
		box.left >= PL + 4 &&
		box.right <= PR - 4 &&
		box.top >= PT - 12 &&
		box.bottom <= PB - 3 &&
		!occupied.some(
			(o) =>
				o.id !== id && box.left < o.right + 2 && box.right > o.left - 2 && box.top < o.bottom + 2 && box.bottom > o.top - 2,
		);
	[...dots]
		.sort((a, b) => y(value(a)) - y(value(b)) || a.id.localeCompare(b.id))
		.forEach((row) => {
			const meets = meetsTarget(row, basis),
				qualifier = situationalQualifier(row);
			const status = L(meets ? ['Meets target', '达到目标'] : ['Below target', '低于目标']);
			const label = L(row.market.manifest.shortName);
			const description =
				`${L(marketName(row))} · ${L(MATRIX_BASIS[basis].label)} ${returnPct(row.econ[basis])} · ${status} · ${share(row.econ.secured)}` +
				(qualifier ? ' · ' + L(QUALIFIER_LABEL[qualifier]) : '');
			const point = s('g', {
				class: `ix-point ${row.call} ${qualifier ? 'ix-qualified-' + qualifier : ''} ${row.id === selected ? 'selected' : ''}`,
				role: 'button',
				tabindex: 0,
				'data-market': row.id,
				'data-meets-target': String(meets),
				'aria-label': description,
				'aria-pressed': String(row.id === selected),
			});
			const cx = x(row.econ.secured),
				cy = y(value(row));
			// The halo is the pointer target and the selection ring; the dot itself never changes size.
			point.append(
				s('circle', { cx, cy, r: DOT, class: 'ix-point-dot' }),
				s('circle', { cx, cy, r: DOT + 6, class: 'ix-point-halo' }),
				s('title', {}, description),
			);
			// Conservative character widths cover both English and Chinese at 13px.
			const width = [...label].reduce((n, c) => n + (/[^\x00-\x7f]/.test(c) ? 14 : 8), 0);
			const spots = labelSpots(cx, cy, width, cx > (PL + PR) / 2 + 220);
			const box = spots.find((spot) => free(spot, row.id)) || spots[0];
			occupied.push(box);
			const nearX = Math.max(box.left, Math.min(box.right, cx)),
				nearY = Math.max(box.top, Math.min(box.bottom, cy)),
				gap = Math.hypot(nearX - cx, nearY - cy);
			if (gap > 17) {
				const ux = (nearX - cx) / gap,
					uy = (nearY - cy) / gap;
				point.append(
					s('line', {
						x1: cx + ux * (DOT + 3),
						y1: cy + uy * (DOT + 3),
						x2: nearX - ux * 2,
						y2: nearY - uy * 2,
						class: 'ix-label-leader',
						'aria-hidden': 'true',
					}),
				);
			}
			point.append(text(box.left, box.top + 11.5, label, { 'text-anchor': 'start', class: 'ix-point-label' }));
			const choose = () => {
				deselect();
				point.classList.add('selected');
				point.setAttribute('aria-pressed', 'true');
				showGuide(row);
				onSelect(row);
				document
					.querySelectorAll('[data-market-row]')
					.forEach((tr) => tr.classList.toggle('is-selected', tr.dataset.marketRow === row.id));
			};
			point.addEventListener('click', choose);
			point.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					choose();
				}
			});
			svg.append(point);
		});
	showGuide(dots.find((row) => row.id === selected));
	return svg;
}

export function cashFlowChart(t) {
	const data = cumulativeEquityCash(t.rawCash, t.powerMW),
		title = ['Cumulative equity cash over the project life', '全生命周期累计股权现金流'];
	const desc = [
		'Whole project, nominal after-tax cash on the all-equity hold basis. Steps use the model payment dates. Payback is the first non-negative balance after investment, without discounting.',
		'全项目税后名义现金，采用全股权长持口径。阶梯取自模型支付日期；回本为投入后累计余额首次非负，未折现。',
	];
	const box = chartFigure('cumulative-equity', title, desc),
		year = (at) => Number(at.toFixed(2)) + L([' years from closing', ' 年（自交割起）']);
	const points = data.series.map((p) => ({ ...p, value: p.cumulative }));
	box.setAttribute('data-total', data.series.at(-1)?.cumulative ?? 0);
	const marks = [
		{ ...data.peak, value: data.peak.cumulative, label: L(['Peak cash at risk', '峰值在险资金']) },
		...(data.payback ? [{ ...data.payback, value: data.payback.cumulative, label: L(['Payback', '回本']) }] : []),
	];
	box.append(
		h(
			'dl',
			{ class: 'ix-risk-metrics' },
			h(
				'div',
				{},
				h('dt', {}, L(['Peak cash at risk', '峰值在险资金'])),
				h('dd', {}, money(data.peakCashAtRisk, t.currency)),
				h('small', {}, year(data.peak.at)),
			),
			h(
				'div',
				{},
				h('dt', {}, L(['Payback', '回本'])),
				h('dd', {}, data.payback ? year(data.payback.at) : L(['Not reached within the model life', '模型期内未回本'])),
			),
		),
		linePlot(title, desc, points, (v) => money(v, t.currency).replace(t.currency + ' ', ''), { step: true, marks }),
		h('p', { class: 'ix-caption' }, t.currency + ' · ' + L(['Whole project · years from closing', '全项目 · 自交割起的年数'])),
		seriesInspector(
			points,
			['Inspect a cash date', '选择现金流日期'],
			(p) => year(p.at) + ' · ' + money(p.cumulative, t.currency),
		),
		chartTable(
			title,
			[
				['Years from closing', '交割起年数'],
				['Net cash', '净现金'],
				['Cumulative equity cash', '累计股权现金'],
			],
			data.series.map((p) => [Number(p.at.toFixed(4)), exactMoney(p.net, t.currency), exactMoney(p.cumulative, t.currency)]),
		),
	);
	return box;
}

export function revenueWaterfall(bridge, currency = 'USD') {
	const items = [
		{ label: ['Fixed', '固定收入'], value: bridge.fixed },
		{ label: ['Renewal', '续约收入'], value: bridge.renewal },
		{ label: ['Trading + services', '交易及辅助服务'], value: bridge.trading },
		...(bridge.service ? [{ label: ['Service cost', '服务成本'], value: -bridge.service }] : []),
		{ label: ['Other costs', '其他成本'], value: -bridge.operating },
		...(bridge.tax ? [{ label: ['Project tax', '项目税费'], value: -bridge.tax }] : []),
		{ label: ['Operating cash', '经营现金流'], value: bridge.net, total: true },
	];
	let cursor = 0;
	const bars = items.map((item) => {
		const from = item.total ? 0 : cursor;
		const to = from + item.value;
		if (!item.total) cursor = to;
		return { ...item, from, to };
	});
	const max = Math.max(1, ...bars.flatMap((b) => [b.from, b.to])) * 1.18,
		min = Math.min(0, ...bars.flatMap((b) => [b.from, b.to])) * 1.1;
	const y = (n) => 215 - ((n - min) / (max - min)) * 165;
	const svg = s('svg', {
		viewBox: '0 0 800 275',
		class: 'ix-waterfall',
		role: 'img',
		'aria-label': L([
			`First-year nominal revenue to operating cash flow, ${currency} thousands per MW`,
			`首年名义收入至经营现金流，千${currency}每MW`,
		]),
	});
	for (let i = 0; i <= 4; i++) {
		const val = min + ((max - min) * i) / 4;
		svg.append(
			s('line', { x1: 50, y1: y(val), x2: 775, y2: y(val), class: 'ix-grid-line' }),
			text(42, y(val) + 4, fmt(val / 1000), { 'text-anchor': 'end' }),
		);
	}
	bars.forEach((bar, i) => {
		const step = 715 / items.length,
			bx = 60 + i * step,
			top = Math.min(y(bar.from), y(bar.to));
		svg.append(
			s('rect', {
				x: bx,
				y: top,
				width: 65,
				height: Math.max(2, Math.abs(y(bar.from) - y(bar.to))),
				rx: 1,
				fill: bar.total ? '#132f29' : bar.value < 0 ? '#b87643' : i === 0 ? '#315f4c' : '#84aa93',
			}),
			text(bx + 32, top - 10, (bar.value / 1000).toFixed(1), { 'text-anchor': 'middle', class: 'ix-value-label' }),
			text(bx + 32, 248, L(bar.label), { 'text-anchor': 'middle', class: 'ix-bar-label' }),
		);
		if (i < items.length - 2)
			svg.append(
				s('line', { x1: bx + 65, y1: y(bar.to), x2: bx + step, y2: y(bar.to), stroke: '#aab5ab', 'stroke-dasharray': '3 3' }),
			);
	});
	return svg;
}

export function revenueBar(row) {
	const fixed = Math.max(0, Math.min(100, (row.econ.secured || 0) * 100));
	return h(
		'div',
		{
			class: 'ix-revenue-bar',
			role: 'img',
			'aria-label': `${L(marketName(row))}: ${share(row.econ.secured)} ${L(['modelled fixed income', '模型固定收入'])}`,
		},
		h('span', { style: `width:${fixed}%` }),
		h('span', { style: `width:${100 - fixed}%` }),
	);
}
