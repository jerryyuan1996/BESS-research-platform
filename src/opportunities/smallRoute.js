/* The small-connection route on a market page (NEM Sub-5 and its analogues).
   The call comes first as the section title, then the return against the
   conventional play and the target, then timing, size and the build cost at
   which the route would match. Every figure is read from the paired
   comparison (compareOpportunity); the words come from smallRoutes.js.
   Styles: src/experience/smallRoute.css, loaded with the market page. */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { sectionTitle } from '../experience/chrome.js';
import { pct } from '../experience/model.js';
import { EVIDENCE_LABEL } from '../governance/briefing.js';
import { strategyById } from '../comparison/strategies.js';
import { opportunityById } from './catalog.js';
import { smallRouteFor } from './smallRoutes.js';
import { opportunityIRRs, breakEvenBuildPremium } from './model.js';

const KICKER = ['SMALL-CONNECTION ROUTE', '小规模接入路径'];
const one = (x) => Number(x.toFixed(1));
const points = (x) => one(Math.abs(x) * 100);
const signedPct = (x) => (x > 0.05 ? '+' : x < -0.05 ? '−' : '') + one(Math.abs(x)) + '%';
const external = (url, label) => h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, L(label), ' ↗');
const evidenceChip = (level) =>
	EVIDENCE_LABEL[level] ? h('span', { class: 'ix-small-evidence is-' + level, 'data-evidence': level }, L(EVIDENCE_LABEL[level])) : null;
const design = (r) =>
	r.input.powerMW + ' MW · ' + r.input.durationHours + 'h · ' + L(strategyById(r.input.strategyId)?.n || [r.input.strategyId, r.input.strategyId]);

/** The call, from the paired comparison: timing first, then return. */
export function smallRouteHeadline(c) {
	const r = opportunityIRRs(c);
	if (!r || r.special == null) return ['No IRR on today’s revenue lines.', '按当前收入测算，没有可计算的 IRR。'];
	if (r.conventional == null) return ['Priced; the conventional play has no IRR to compare.', '已定价；常规方案没有可比较的 IRR。'];
	const saved = c.standard.codMonths - c.alternative.codMonths,
		m = one(Math.abs(saved)),
		gap = r.special - r.conventional,
		p = points(gap);
	const time =
		Math.abs(saved) < 0.05
			? ['Same timetable', '工期相同']
			: saved > 0
				? [m + ' months sooner to COD', '投运提前 ' + m + ' 个月']
				: [m + ' months later to COD', '投运推迟 ' + m + ' 个月'];
	if (Math.abs(gap) <= 1e-4) return [time[0] + ', level on return.', time[1] + '，回报持平。'];
	const ahead = gap > 0,
		same = Math.abs(saved) < 0.05,
		contrast = (saved > 0 && !ahead) || (saved < 0 && ahead);
	return [
		time[0] + (same ? ', ' : contrast ? ', but ' : ' and ') + p + (ahead ? ' points ahead on return.' : ' points behind on return.'),
		time[1] + (contrast ? '，但' : '，') + (ahead ? '回报高出 ' : '回报低 ') + p + ' 个百分点。',
	];
}

/* All-equity hold IRR of each design against the common target, on one scale. */
function returnBars(c, label) {
	const r = opportunityIRRs(c),
		target = c.targetReturn;
	const rows = [
		{ id: 'small', name: label, value: r.special },
		{ id: 'conventional', name: ['Conventional play', '常规方案'], value: r.conventional },
	];
	const values = [0, target, ...rows.map((x) => x.value)].filter(Number.isFinite);
	const lo = Math.min(...values) * 1.15,
		hi = Math.max(...values) * 1.15,
		at = (v) => ((v - lo) / (hi - lo || 1)) * 100;
	const zero = at(0);
	const describe = rows.map((x) => L(x.name) + ' ' + (x.value == null ? L(['no IRR', '无 IRR']) : pct(x.value))).join('; ');
	return h(
		'figure',
		{ class: 'ix-return-bars', role: 'img', 'aria-label': describe + '; ' + L(['target ', '目标 ']) + pct(target) },
		h('figcaption', {}, L(['All-equity hold IRR · same closing date and price', '全股权长持 IRR · 同一交割日与对价'])),
		h(
			'div',
			{ class: 'ix-return-plot', 'aria-hidden': 'true' },
			h(
				'div',
				{ class: 'ix-return-guides' },
				lo < 0 ? h('span', { class: 'ix-return-zero', style: `left:${zero}%` }) : null,
				Number.isFinite(target)
					? h(
							'span',
							{ class: 'ix-return-target' + (at(target) > 70 ? ' is-right' : ''), style: `left:${at(target)}%` },
							h('em', {}, L(['Target ', '目标 ']) + pct(target)),
						)
					: null,
			),
			rows.map((x) => {
				const has = Number.isFinite(x.value),
					from = has ? Math.min(zero, at(x.value)) : zero,
					to = has ? Math.max(zero, at(x.value)) : zero,
					negative = has && x.value < 0;
				return h(
					'div',
					{ class: 'ix-return-row is-' + x.id },
					h('span', { class: 'ix-return-name' }, L(x.name)),
					h(
						'span',
						{ class: 'ix-return-track' },
						has ? h('span', { class: 'ix-return-bar', style: `left:${from}%;width:${Math.max(0.6, to - from)}%` }) : null,
						h(
							'span',
							{
								class: 'ix-return-value' + (negative ? ' is-negative' : '') + (has ? '' : ' is-none'),
								/* A negative value reads beside the zero line, on the side its bar leaves free. */
								style: `left:${to}%`,
							},
							has ? pct(x.value) : L(['No IRR', '无 IRR']),
						),
					),
				);
			}),
		),
	);
}

function fact(label, value, note = null, attrs = {}) {
	return h('div', attrs, h('dt', {}, L(label)), h('dd', {}, value), note ? h('small', {}, note) : null);
}

/* The build cost at which the route would match, solved on the same paired
   model. It re-runs the comparison a dozen times, so it fills in after the
   page has painted. */
function breakEvenFact(row, investor, o, values, c) {
	const value = h('dd', {}, L(['Calculating…', '计算中…']));
	const holder = h('div', { 'data-break-even': 'pending' }, h('dt', {}, L(['Break-even build cost / MW', '盈亏平衡建设成本 / MW'])), value);
	const settle = (text, state, note = null) => {
		value.replaceChildren(text);
		if (note) holder.append(h('small', {}, note));
		holder.setAttribute('data-break-even', state);
	};
	const r = opportunityIRRs(c);
	if (!r || r.special == null || r.conventional == null) {
		settle(L(['No IRR to match', '没有可匹配的 IRR']), 'none');
		return holder;
	}
	setTimeout(() => {
		if (holder.isConnected === false) return;
		const be = breakEvenBuildPremium(row.market, o, investor, row.play, values);
		if (!be) settle(L(['No build cost closes the gap', '任何建设成本都无法弥合差距']), 'none');
		else
			settle(
				signedPct(be.pct),
				String(one(be.pct)),
				L([
					'Against the conventional design per MW; this case assumes ' + signedPct(be.current) + '.',
					'相对常规设计的每 MW 成本；本测算假设为 ' + signedPct(be.current) + '。',
				]),
			);
	}, 0);
	return holder;
}

function pointsList(items) {
	return h(
		'dl',
		{ class: 'ix-small-points' + (items.length > 2 ? ' is-three' : '') },
		items.map(([label, text]) => h('div', {}, h('dt', {}, L(label)), h('dd', {}, L(text)))),
	);
}

function sourcesLine(sources, extra = []) {
	const parts = [...sources.map(([label, url]) => external(url, label)), ...extra].filter(Boolean);
	return parts.length ? h('p', { class: 'ix-small-foot' }, ...parts) : null;
}

/** The section for one market. `screen` is specialOpportunityScreen()'s
 * result; `workbench(o)` builds the like-for-like comparison when the reader
 * opens it. Null for a market with no small-route record. */
export function smallRouteSection(row, investor, screen, { workbench = null } = {}) {
	const route = smallRouteFor(row.id);
	if (!route) return null;
	const section = h('section', { id: 'small-route', class: 'ix-section ix-small-route', 'data-small-kind': route.kind });
	const priced = route.kind === 'priced' && screen?.small?.o.id === route.opportunity ? screen.small : null;
	if (!priced) {
		/* Research only: the rule, what it avoids and what would change it. */
		const kind = route.kind === 'priced' ? 'contract' : route.kind;
		const o = route.kind === 'priced' ? opportunityById(route.opportunity) : null;
		section.setAttribute('data-small-kind', kind);
		section.append(
			sectionTitle(KICKER, route.status || ['Not priced for this investor yet.', '尚未针对该投资者定价。']),
			h(
				'div',
				{ class: 'ix-small-card is-research' },
				route.kind === 'none'
					? null
					: h('header', { class: 'ix-small-head' }, h('h3', {}, L(route.title || o?.label || ['Small route', '小型路径'])), evidenceChip(route.evidence)),
				route.kind === 'none'
					? h('p', { class: 'ix-small-none' }, L(route.rule))
					: pointsList(
							[
								[['The rule', '规则'], route.rule || o?.thesis],
								[['What it avoids', '可以绕开什么'], route.avoids],
								[['What would change it', '什么会改变判断'], route.changesIf],
							].filter(([, text]) => text),
						),
				sourcesLine(route.sources || []),
			),
		);
		return section;
	}
	const { o, c } = priced;
	const label = o.label;
	const siteMonths = (o.siteControlMonths ?? o.months).join('–');
	const facts = h(
		'dl',
		{ class: 'ix-small-facts' },
		fact(
			['Closing → COD', '交割 → 投运'],
			one(c.alternative.codMonths) + L([' months', ' 个月']),
			L([
				'Against ' + one(c.standard.codMonths) + ' for the conventional play; ' + siteMonths + ' months from site control.',
				'常规方案为 ' + one(c.standard.codMonths) + ' 个月；从取得场址起约 ' + siteMonths + ' 个月。',
			]),
		),
		fact(['Design', '设计'], design(c.alternative), L(['Against ', '常规方案：']) + design(c.standard)),
		breakEvenFact(row, investor, o, screen.values || {}, c),
	);
	const fold =
		!priced.valid && workbench
			? (() => {
					const host = h('div', { class: 'ix-small-workbench-body' });
					const details = h(
						'details',
						{ class: 'ix-details ix-small-workbench' },
						h('summary', {}, L(['Test the inputs: price, timing, costs and network charges', '调整输入：价格、工期、成本与配网费用'])),
						host,
					);
					details.addEventListener('toggle', () => {
						if (!details.open || host.childElementCount) return;
						const node = workbench(o);
						if (node) host.append(node);
					});
					return details;
				})()
			: null;
	section.append(
		sectionTitle(KICKER, smallRouteHeadline(c)),
		h(
			'div',
			{ class: 'ix-small-card' },
			h('header', { class: 'ix-small-head' }, h('h3', {}, L(label)), evidenceChip(route.evidence)),
			h('div', { class: 'ix-small-grid' }, returnBars(c, label), facts),
			pointsList([
				[['What it avoids', '可以绕开什么'], route.avoids],
				[['What would change it', '什么会改变判断'], route.changesIf],
			]),
			sourcesLine(route.sources || [], [
				h('a', { href: '#execution', class: 'ix-small-jump' }, L(['Compare the timetables ↓', '比较两种方案的时间表 ↓'])),
				priced.valid
					? h('a', { href: '#opportunity-comparison', class: 'ix-small-jump' }, L(['Open the like-for-like valuation ↓', '查看同口径估值 ↓']))
					: null,
			]),
			fold,
		),
	);
	return section;
}
