import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { money, pct, returnPct, share, finite } from './model.js';
import { link, metric } from './chrome.js';
import { STAGE_LABEL } from '../acquisition/parameters.js';
import { gateLabel } from './labels.js';
import { commitmentGates } from './traceability.js';
import { decisionStrip } from './decisionStrip.js';

export const margin = (row, basis = 'hold') => {
	const target = basis === 'levered' ? row.econ.test?.leveredTarget : row.econ.test?.target;
	return finite(row.econ[basis]) && finite(target) ? row.econ[basis] - target : null;
};
export const marginText = (row, basis = 'hold') => {
	const d = margin(row, basis);
	return d == null
		? ['Not assessed', '未检验']
		: [
				(d >= 0 ? '+' : '') + (d * 100).toFixed(2) + ' pp vs target' + (d >= 0 && d < 0.005 ? ' · thin margin' : ''),
				'较目标' + (d >= 0 ? '+' : '') + (d * 100).toFixed(2) + '个百分点' + (d >= 0 && d < 0.005 ? ' · 余量薄' : ''),
			];
};
export function availability(row) {
	return row.market.comparison.engineReady === false
		? [
				'Return withheld: the SSA payment is unpublished. Obtain price, payment formula and availability terms before pricing.',
				'回报暂不能测算：SSA合同付费未公开。定价前须取得价格、付费公式与可用性条款。',
			]
		: ['Reference investment case; project documents remain to be verified.', '参考投资情景；项目文件仍待核验。'];
}
export function currentThesis(row) {
	const i = row.investment;
	if (!i) return availability(row);
	return [
		'The current ' +
			i.hours +
			'h RTB reference case returns ' +
			returnPct(i.holdIRR) +
			' all-equity over ' +
			i.lifeYears +
			' operating years, nominal after project tax. Modelled first-year fixed revenue is ' +
			share(i.secured) +
			' for a ' +
			i.securedYears +
			'-year contract assumption.',
		'当前' +
			i.hours +
			'小时RTB参考情景，按' +
			i.lifeYears +
			'年运营、税后名义口径，全股权长持回报为' +
			returnPct(i.holdIRR) +
			'；模型首年固定收入占比' +
			share(i.secured) +
			'，合同期限假设' +
			i.securedYears +
			'年。',
	];
}
export function basisNote(row) {
	const i = row.investment;
	return h(
		'p',
		{ class: 'ix-basis-note' },
		L(
			i
				? [
						'Model: RTB closing · ' +
							i.lifeYears +
							' operating years · nominal after project tax · project-rights price ' +
							money(i.purchasePricePerMW, i.currency) +
							'/MW; construction remains payable. Recommended entry: ' +
							L(
								STAGE_LABEL[row.stage] ||
									(row.stage === 'co-invest' ? ['Co-investment', '共同投资'] : null) || ['Research', '研究中'],
							) +
							'.',
						'测算：RTB交割起算 · ' +
							i.lifeYears +
							'年运营 · 税后名义 · 项目权利对价' +
							money(i.purchasePricePerMW, i.currency) +
							'/MW，另需支付建设投入。建议进入方式：' +
							L(
								STAGE_LABEL[row.stage] ||
									(row.stage === 'co-invest' ? ['Co-investment', '共同投资'] : null) || ['Research', '研究中'],
							) +
							'。',
					]
				: availability(row),
		),
	);
}
export function decisionReasons(row, compact = false) {
	const d = row.decision || {},
		box = h('div', { class: 'ix-decision-reasons' });
	if (d.reason) box.append(h('p', {}, h('strong', {}, L(['Why this priority: ', '优先级依据：'])), L(d.reason)));
	const gates = commitmentGates(row).slice(0, compact ? 1 : 3);
	if (gates.length)
		box.append(
			h(
				'p',
				{},
				h('strong', {}, L(['Before committing: ', '投入前必须核查：'])),
				gates.map((g) => L(Array.isArray(g) ? g : gateLabel(g))).join(' · '),
			),
		);
	if (!compact && d.counterpoint)
		box.append(h('p', {}, h('strong', {}, L(['What limits conviction: ', '限制判断的因素：'])), L(d.counterpoint)));
	if (!compact && d.event)
		box.append(
			h(
				'p',
				{},
				h('strong', {}, L(['Next event: ', '下一事件：'])),
				L(d.event.label),
				' · ',
				d.event.expected || L(['Date unconfirmed', '日期待定']),
				' · ',
				link('/policy#event-watch', ['Review event ↗', '查看事件 ↗']),
			),
		);
	if (!compact)
		box.append(
			h(
				'small',
				{},
				L(['View reviewed: ', '观点复核：']),
				d.asOf || '—',
				' · ',
				L(['Review due: ', '下次复核：']),
				d.reviewBy || '—',
			),
		);
	return box;
}
export function decisionPanel(row, presentation) {
	const i = row.investment;
	const panel = h(
		'section',
		{ class: 'ix-panel ix-decision-panel ic-decision-panel', id: 'decision' },
		h('h2', {}, L(['The decision at this price and stage', '当前价格与阶段下的投资判断'])),
		presentation.identity(row),
	);
	panel.append(decisionStrip(row));
	if (i) panel.append(presentation.metrics(row, marginText(row)));
	else panel.append(h('p', { role: 'status' }, L(availability(row))));
	return panel;
}
export function contractEvidence(row) {
	const i = row.investment,
		c = row.market.comparison.refinement?.contractRisk;
	if (!i) return null;
	return h(
		'details',
		{ class: 'ix-details ix-contract-evidence' },
		h(
			'summary',
			{},
			L([
				'Modelled fixed revenue ' + share(i.secured) + ' · project contract not verified',
				'模型固定收入' + share(i.secured) + ' · 项目合同未核验',
			]),
		),
		h(
			'p',
			{},
			L([
				'Mechanism eligibility and a model assumption do not prove an executed project contract.',
				'市场机制适用与模型假设不代表已核验的项目合同。',
			]),
		),
		h(
			'dl',
			{ class: 'ix-project-facts' },
			...[
				[['Model contract tenor', '模型合同期限'], i.securedYears + L([' years', '年'])],
				[['Counterparty reference', '交易对手参考'], c?.counterparty ? L(c.counterparty) : '—'],
				[['Contract indexation to verify', '须核验的合同指数化'], c?.indexation ? L(c.indexation) : '—'],
			].map(([k, v]) => h('div', {}, h('dt', {}, L(k)), h('dd', {}, v))),
		),
		h(
			'p',
			{},
			L(['Comparison assumption: ', '比较模型假设：']),
			i.securedIndexation === 'fixed'
				? L(['fixed nominal contract revenue', '合同收入名义固定'])
				: L(['indexed contract revenue; verify actual terms', '合同收入按模型指数化，须核验实际条款']),
			' · ',
			L(['Model inflation: ', '模型通胀：']),
			pct(i.inflationRate),
			h('br'),
			L([
				'Verify tenor, caps, availability deductions, termination and lender acceptance before calling cash bankable.',
				'将现金流认定为可融资前，核验期限、上限、可用率扣款、终止及贷款人接受度。',
			]),
		),
	);
}
