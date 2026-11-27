/* The execution roadmap: one month axis from closing (T+0) to the first
   operating-year cash, with each workstream as a bar and the model's equity
   cash per MW pulsed on the same axis. Below it, one card per step carries the
   deliverable, the owner and the cash that falls inside that step.

   Plain HTML positioned in percent, not a scaled SVG, so the labels stay at
   reading size on a phone. Every number comes from deliveryTimeline(); nothing
   is typed here. Styles: src/experience/executionRoadmap.css (loaded with the
   market page, because node tests import this module directly). */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money } from '../experience/model.js';

const n = (months) => Number(months.toFixed(1));
const time = (months) => 'T+' + n(months) + L(['m', '月']);
const span = (from, to) => (to - from > 0.05 ? 'T+' + n(from) + '–' + n(to) + L(['m', '月']) : time(from));
const signed = (value, currency) => (value >= 0 ? '+' : '−') + money(Math.abs(value), currency);

/** Delivery steps in time order, each with its span and the cash inside it. */
export function deliveryPhases(t) {
	const steps = t.milestones.filter((m) => m.kind === 'delivery').sort((a, b) => a.month - b.month);
	const cash = t.milestones.filter((m) => m.kind === 'cash');
	const end = Math.max(t.codMonths + 12, t.qualifiedMonths, ...cash.map((c) => c.month), steps.at(-1)?.month ?? 0, 1);
	return {
		end,
		cash,
		steps: steps.map((step, index) => {
			const next = steps[index + 1];
			return {
				...step,
				index,
				start: step.month,
				stop: next ? next.month : end,
				cash: cash.filter((c) => c.month >= step.month - 1e-6 && (!next || c.month < next.month - 1e-6)),
			};
		}),
	};
}

function ticks(end) {
	const step = end <= 12 ? 3 : end <= 36 ? 6 : end <= 72 ? 12 : 24;
	const out = [];
	for (let m = 0; m <= end + 1e-6; m += step) out.push(m);
	return out;
}

/** The bar chart: workstreams, key dates and equity cash pulses on one axis. */
export function deliveryRoadmap(t, plan = 'standard') {
	const { end, steps, cash } = deliveryPhases(t);
	const at = (month) => Math.max(0, Math.min(100, (month / end) * 100));
	const largest = Math.max(1, ...cash.map((c) => Math.abs(c.amount)));
	const cod = t.codMonths,
		qualified = t.qualifiedMonths;
	const keyDates = [
		Math.abs(cod - qualified) < 0.05
			? { month: cod, label: ['COD + revenue', 'COD + 收入资格'], kind: 'cod' }
			: { month: cod, label: ['COD', 'COD'], kind: 'cod' },
		...(Math.abs(cod - qualified) < 0.05 ? [] : [{ month: qualified, label: ['Revenue eligibility', '收入资格'], kind: 'revenue' }]),
	];
	const edge = (pct) => (pct > 86 ? ' is-right' : pct < 8 ? ' is-left' : '');
	/* Labels on the same side of the axis that sit close together step down. */
	const last = { in: -100, out: -100 },
		tier = { in: 0, out: 0 },
		reach = { in: 0, out: 0 };
	const pulses = cash.map((c) => {
		const side = c.amount >= 0 ? 'in' : 'out',
			pct = at(c.month);
		tier[side] = pct - last[side] < 12 ? (tier[side] + 1) % 3 : 0;
		last[side] = pct;
		const height = Math.max(3, (Math.abs(c.amount) / largest) * 56);
		/* Each side of the line is as tall as its largest bar and label. */
		reach[side] = Math.max(reach[side], height + 24 + tier[side] * 17);
		return h(
			'span',
			{
				class: 'ix-cash-pulse is-' + side,
				style: `left:clamp(6px,${pct}%,calc(100% - 6px));height:${height}px`,
				title: L(c.title) + ' · ' + time(c.month),
			},
			h(
				'span',
				{ class: 'ix-cash-pulse-label' + edge(pct) + ' tier-' + tier[side] },
				signed(c.amount, t.currency),
			),
		);
	});
	const describe = [
		steps.map((s) => L(s.phase || s.title) + ' ' + span(s.start, s.stop)).join('; '),
		steps.map((s) => L(s.phase || s.title) + ' ' + span(s.start, s.stop)).join('；'),
	];
	return h(
		'figure',
		{ class: 'ix-roadmap', 'data-plan': plan },
		h(
			'figcaption',
			{ class: 'ix-roadmap-caption' },
			h('h3', {}, L(['Delivery roadmap', '交付路线图'])),
			h(
				'p',
				{ class: 'ix-caption' },
				L([
					'Months from closing. Bars run from each step’s target start to the next; pulses show equity cash per MW on the same dates, paid out below the line and received above it.',
					'自交割起的月数。横条为各步骤从目标开始至下一步骤的时段；同一时间轴上的脉冲为每MW股权现金，线下为支出，线上为收入。',
				]),
			),
		),
		h(
			'div',
			{ class: 'ix-roadmap-chart', role: 'img', 'aria-label': L(['Delivery roadmap: ', '交付路线图：']) + L(describe) },
			h(
				'div',
				{ class: 'ix-roadmap-row is-axis', 'aria-hidden': 'true' },
				h('span', { class: 'ix-roadmap-label' }),
				h(
					'div',
					{ class: 'ix-roadmap-ticks' },
					ticks(end).map((m) =>
						h('span', { class: 'ix-roadmap-tick' + edge(at(m)), style: `left:${at(m)}%` }, m ? time(m) : 'T+0'),
					),
				),
			),
			h(
				'div',
				{ class: 'ix-roadmap-body' },
				h(
					'div',
					{ class: 'ix-roadmap-grid', 'aria-hidden': 'true' },
					ticks(end).map((m) => h('span', { class: 'ix-roadmap-gridline', style: `left:${at(m)}%` })),
					keyDates.map((d, i) =>
						h(
							'span',
							{ class: 'ix-roadmap-key is-' + d.kind + (at(d.month) > 55 ? ' is-right' : ''), style: `left:${at(d.month)}%;--key-row:${i}` },
							h('em', {}, L(d.label) + ' · ' + time(d.month)),
						),
					),
				),
				steps.map((s) =>
					h(
						'div',
						{ class: 'ix-roadmap-row', 'data-phase': s.index },
						h(
							'span',
							{ class: 'ix-roadmap-label' },
							h('b', { 'aria-hidden': 'true' }, String(s.index + 1)),
							h('span', {}, L(s.phase || s.title), h('small', {}, span(s.start, s.stop))),
						),
						h(
							'div',
							{ class: 'ix-roadmap-track' },
							h('span', {
								class: 'ix-roadmap-bar' + (s.stop - s.start < end * 0.015 ? ' is-point' : ''),
								style: `left:${at(s.start)}%;width:${Math.max(0, at(s.stop) - at(s.start))}%`,
							}),
						),
					),
				),
				h(
					'div',
					{ class: 'ix-roadmap-row is-cash' },
					h(
						'span',
						{ class: 'ix-roadmap-label' },
						h('b', { class: 'is-cash', 'aria-hidden': 'true' }, '±'),
						h('span', {}, L(['Equity cash / MW', '股权现金 / MW']), h('small', {}, t.currency)),
					),
					h(
						'div',
						{ class: 'ix-roadmap-cash', style: `height:${Math.max(reach.in, 12) + Math.max(reach.out, 12)}px;--axis:${Math.max(reach.in, 12)}px` },
						pulses,
					),
				),
			),
		),
	);
}

/** One card per step: when, what to deliver, who owns it, and its cash. */
export function deliverySteps(t) {
	const { steps } = deliveryPhases(t);
	return h(
		'ol',
		{ class: 'ix-steps' },
		steps.map((s) =>
			h(
				'li',
				{ class: 'ix-step', 'data-phase': s.index },
				h(
					'div',
					{ class: 'ix-step-head' },
					h('span', { class: 'ix-step-num', 'aria-hidden': 'true' }, String(s.index + 1)),
					h('span', { class: 'ix-step-phase' }, L(s.phase || s.title)),
					h('span', { class: 'ix-step-time' }, time(s.month)),
				),
				h('h4', {}, L(s.title)),
				s.output ? h('p', {}, L(s.output)) : null,
				s.owner ? h('p', { class: 'ix-step-owner' }, h('span', {}, L(['Owner', '负责方'])), L(s.owner)) : null,
				s.cash.length
					? h(
							'ul',
							{ class: 'ix-step-cash', 'aria-label': L(['Cash in this step', '本步骤现金流']) },
							s.cash.map((c) =>
								h(
									'li',
									{ class: c.amount >= 0 ? 'is-in' : 'is-out' },
									h('strong', {}, signed(c.amount, t.currency) + ' / MW'),
									h('span', {}, time(c.month) + ' · ' + L(c.title)),
									h('small', {}, L(['Whole project ', '全项目 ']) + signed(c.amount * t.powerMW, t.currency)),
								),
							),
						)
					: null,
			),
		),
	);
}
