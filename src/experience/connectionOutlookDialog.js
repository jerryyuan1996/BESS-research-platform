import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, setLang, requestRender } from '../app/state.js';
import { byId } from '../markets/registry.js';
import { boardViewFor } from '../markets/viewBoard.js';
import { caseViewFor } from '../markets/caseRegistry.js';
import { dimension, TREND_LABEL } from '../governance/investability.js';
import { EVIDENCE_LABEL } from '../governance/briefing.js';
import { connectionOutlookFor, OUTLOOK, SITE_VALUE_METHOD, OUTLOOK_AS_OF } from './connectionOutlook.js';
import './marketResearchDialog.css';
import './connectionOutlook.css';

const SYMBOL = { GBP: '£', EUR: '€', USD: '$' };
const money = (currency, amount) => `${SYMBOL[currency] ?? currency + ' '}${+(amount / 1000).toFixed(2)}k/MW`;

/** The analyst's grid-scarcity grade, read from the view store and never retyped. */
function scarcityBlock(marketId, entry) {
	const projected = boardViewFor(marketId)?.grades?.gridScarcity;
	const full = caseViewFor(marketId)?.grades?.gridScarcity;
	if (!projected) return h('p', {}, L(entry.scarcity ?? ['Not graded.', '未评级。']));
	const dim = dimension('gridScarcity');
	const grade = projected.grade;
	return h(
		'div',
		{ class: 'co-scarcity', 'data-grade': String(grade) },
		h(
			'p',
			{ class: 'co-grade' },
			h('strong', {}, `${grade} / 5`),
			' ',
			h('span', {}, L(dim.anchors[grade])),
		),
		h('p', { class: 'co-grade-scale' }, L(dim.open), full?.trend ? ' · ' + L(TREND_LABEL[full.trend]) : ''),
		full?.reason ? h('p', {}, L(full.reason)) : null,
		full?.trendCause ? h('p', {}, L(full.trendCause)) : null,
	);
}

function siteValueBlock(entry) {
	const sv = entry.siteValue;
	const half = sv ? money(sv.currency, sv.perMW * SITE_VALUE_METHOD.weight) : '';
	const full = sv ? money(sv.currency, sv.perMW) : '';
	const credit = sv
		? h(
				'p',
				{ class: 'co-credit', 'data-site-value': sv.currency },
				h('strong', {}, L(['Site credit: ', '场址价值计入：'])),
				L([
					`${half} in 2026 money, half of ${full} (${sv.basis[0]}), indexed to the last operating year.`,
					`按2026年币值${half}，为${full}的一半（${sv.basis[1]}），并指数化至最后运营年。`,
				]),
			)
		: h(
				'p',
				{ class: 'co-credit', 'data-site-value': 'none' },
				h('strong', {}, L(['Site credit: ', '场址价值计入：'])),
				L(['no reference value has been adopted for this market.', '该市场尚未采用场址残值参考价。']),
			);
	return [h('p', { class: 'co-status' }, L(SITE_VALUE_METHOD.status)), credit, h('p', { class: 'co-method' }, L(SITE_VALUE_METHOD.text))];
}

function section(title, ...children) {
	return h('section', { class: 'co-section' }, h('h3', {}, L(title)), ...children);
}

/** A reader for one market's connection value, opened from the card below the grid entrance. */
export function openConnectionOutlook(marketId, trigger) {
	if (document.querySelector('.market-research-dialog')) return null;
	const market = byId(marketId);
	const entry = connectionOutlookFor(marketId);
	if (!market || !entry) return null;
	const previousOverflow = document.body.style.overflow;
	const dialog = h('dialog', {
		class: 'ix-dialog market-research-dialog connection-outlook-dialog',
		'aria-labelledby': 'connection-outlook-title',
		'data-kind': 'connection',
		'data-market': marketId,
	});
	let closed = false;
	let closeButton;
	const close = () => dialog.close();
	function finish() {
		if (closed) return;
		closed = true;
		document.body.style.overflow = previousOverflow;
		window.removeEventListener('popstate', close);
		dialog.remove();
		const origin = trigger?.isConnected
			? trigger
			: document.querySelector(`[data-market-research="connection"][data-market="${marketId}"]`);
		origin?.focus({ preventScroll: true });
	}

	function build() {
		dialog.lang = app.lang === 'zh' ? 'zh-CN' : 'en';
		closeButton = h(
			'button',
			{ type: 'button', class: 'ix-button ix-outline', 'aria-label': L(['Close', '关闭']), onclick: close },
			L(['Close', '关闭']),
			' ×',
		);
		const language = h(
			'button',
			{
				type: 'button',
				class: 'ix-button ix-outline market-reader-language',
				onclick: () => {
					setLang(app.lang === 'en' ? 'zh' : 'en');
					requestRender();
					build();
					dialog.querySelector('.market-reader-language').focus();
				},
			},
			app.lang === 'en' ? '中文' : 'EN',
		);
		const evidence = entry.evidence;
		dialog.replaceChildren(
			h(
				'header',
				{ class: 'market-reader-header' },
				h(
					'div',
					{},
					h('p', { class: 'ix-eyebrow' }, L(market.manifest.name) + ' · ' + L(['GRID CONNECTION VALUE', '并网权价值'])),
					h('h2', { id: 'connection-outlook-title' }, L(['What the connection is worth', '并网权值多少'])),
					h(
						'p',
						{ class: 'market-reader-intro' },
						L([
							'Policy trend, how scarce connection is, and where the value of a held connection is going.',
							'政策走向、并网稀缺程度，以及已持有并网权的价值走向。',
						]),
					),
				),
				h('div', { class: 'market-reader-tools' }, language, closeButton),
			),
			h(
				'div',
				{ class: 'co-body', tabindex: '0' },
				h(
					'section',
					{ class: 'co-call', 'data-outlook': entry.outlook },
					h('p', { class: 'ix-eyebrow' }, L(['OUR VIEW ON ITS FUTURE VALUE', '我们对其未来价值的判断'])),
					h(
						'p',
						{ class: 'co-call-head' },
						h('span', { class: `co-outlook ${entry.outlook}` }, L(OUTLOOK[entry.outlook])),
						h('span', { class: `co-evidence ${evidence}`, 'data-evidence': evidence }, L(EVIDENCE_LABEL[evidence])),
					),
					h('p', { class: 'co-call-text' }, L(entry.call)),
				),
				section(['Market and policy trend', '市场与政策走向'], h('p', {}, L(entry.trend))),
				section(['How scarce connection is', '并网有多稀缺'], scarcityBlock(marketId, entry)),
				section(['Price and valuation evidence', '价格与估值依据'], h('p', {}, L(entry.price))),
				section(['How we would value it at end of life', '寿命期末的估值方式'], ...siteValueBlock(entry)),
				section(
					['What would change this view', '什么会改变这一判断'],
					h('p', {}, L(entry.changeIf)),
				),
				section(
					['Sources', '来源'],
					h(
						'ul',
						{ class: 'co-sources' },
						entry.sources.map((src) =>
							h('li', {}, h('a', { href: src.url, target: '_blank', rel: 'noopener noreferrer' }, L(src.label), ' ↗')),
						),
					),
					h('p', { class: 'co-asof' }, L([`As of ${OUTLOOK_AS_OF}`, `截至${OUTLOOK_AS_OF}`])),
				),
			),
		);
	}

	build();
	dialog.addEventListener('close', finish, { once: true });
	dialog.addEventListener('click', (event) => {
		if (event.target !== dialog) return;
		const rect = dialog.getBoundingClientRect();
		if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
	});
	window.addEventListener('popstate', close);
	document.body.append(dialog);
	document.body.style.overflow = 'hidden';
	dialog.showModal();
	closeButton.focus();
	return dialog;
}
