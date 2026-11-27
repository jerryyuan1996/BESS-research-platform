import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money, returnPct } from './model.js';
import { labField } from '../comparison/ranges.js';
import { chartFigure, chartSVG, chartTable, svgEl, svgText } from './riskChart.js';

const pp = (value) =>
	Number.isFinite(value) ? (value >= 0 ? '+' : '') + (value * 100).toFixed(2) + L([' pp', ' 个百分点']) : 'N/M';
const evidenceLabel = (value) => (value === 'sourced' ? ['Sourced', '有来源'] : ['Assumed', '假设']);
const endpoint = (end) => (end === 'min' ? ['Lower input', '输入下限'] : ['Upper input', '输入上限']);
function inputValue(key, value, currency, scale = 1) {
	const unit = labField(key)?.unit;
	return unit === 'cur'
		? money(value * scale, currency)
		: unit === 'pct'
			? value + '%'
			: unit === 'frac'
				? (value * 100).toFixed(1) + '%'
				: value + (unit === 'mo' ? L([' months', ' 个月']) : unit === 'yr' ? L([' years', ' 年']) : '');
}
export function tornadoChart(factors, baseIRR, currency, scale = 1) {
	const title = ['Ranked single-factor sensitivity', '单因素敏感性排序'];
	const desc = [
		'Largest absolute change in all-equity hold IRR first. Each endpoint changes one input only; all other inputs stay at base. Effects are not added together.',
		'按全股权长持 IRR 相对基准的最大绝对变化排序。每个端点只改变一项输入，其余保持基准；各因素影响不能相加。',
	];
	const box = chartFigure('tornado', title, desc),
		max = Math.max(0.0001, ...factors.map((f) => f.effect || 0));
	box.append(h('p', { class: 'ix-risk-readout' }, L(['Base all-equity IRR: ', '基准全股权 IRR：']), returnPct(baseIRR)));
	for (const f of factors) {
		const label = labField(f.key)?.label || [f.key, f.key],
			ends = f.ends.map((e) => ({
				...e,
				text:
					L(endpoint(e.end)) +
					' ' +
					inputValue(f.key, e.value, currency, scale) +
					' → ' +
					returnPct(e.hold) +
					' (' +
					pp(e.delta) +
					')',
			}));
		const svg = chartSVG(label, [ends.map((e) => e.text).join('; '), ends.map((e) => e.text).join('；')], '0 0 440 82');
		const x = (v) => 220 + (v / max) * 198;
		svg.append(svgEl('line', { x1: 220, x2: 220, y1: 2, y2: 60, class: 'ix-risk-zero' }));
		svg.append(svgText(220, 78, L(['Base', '基准']), { 'text-anchor': 'middle' }));
		ends.forEach((e, i) => {
			if (!Number.isFinite(e.delta)) return;
			const at = x(e.delta),
				cy = 17 + i * 28;
			svg.append(
				svgEl('rect', {
					x: Math.min(220, at),
					y: cy - 8,
					width: Math.max(1, Math.abs(at - 220)),
					height: 16,
					class: e.delta < 0 ? 'ix-risk-down' : 'ix-risk-up',
				}),
				svgEl('circle', { cx: at, cy, r: 3, fill: 'currentColor' }),
			);
		});
		const row = h(
			'section',
			{ class: 'ix-tornado-factor', 'data-factor': f.key, 'data-effect': f.effect ?? '', 'data-evidence': f.evidence },
			h('h4', {}, L(label), h('span', { class: 'ix-risk-badge' }, L(evidenceLabel(f.evidence)))),
			svg,
			h(
				'div',
				{ class: 'ix-risk-endpoints' },
				ends.map((e) => h('p', { tabindex: 0 }, e.text)),
			),
		);
		const detail = chartTable(
			label,
			[
				['Endpoint', '端点'],
				['Input', '输入'],
				['All-equity IRR', '全股权 IRR'],
				['Change', '变化'],
			],
			ends.map((e) => [endpoint(e.end), inputValue(f.key, e.value, currency, scale), returnPct(e.hold), pp(e.delta)]),
		);
		detail.append(
			h('p', { class: 'ix-caption' }, L(f.band.basis || ['Band basis not supplied.', '未提供区间依据。'])),
			h('p', { class: 'ix-caption' }, L(['Source: ', '来源：']), L(f.band.source || ['Not supplied', '未提供'])),
		);
		row.append(detail);
		box.append(row);
	}
	return box;
}
