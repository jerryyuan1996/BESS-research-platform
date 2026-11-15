import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { app, toggleLang, requestRender } from '../app/state.js';
import { navigate } from '../app/router.js';

export function link(href, label, className = '', attrs = {}) {
	return h(
		'a',
		{
			href,
			class: className,
			...attrs,
			onclick: (event) => {
				if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
				if (href.startsWith('#')) return;
				event.preventDefault();
				navigate(href);
				window.scrollTo({ top: 0, behavior: 'instant' });
			},
		},
		L(label),
	);
}
export function eyebrow(text) {
	return h('div', { class: 'ix-eyebrow' }, L(text));
}
export function sectionTitle(kicker, title, sub = null) {
	return h('div', { class: 'ix-section-heading' }, eyebrow(kicker), h('h2', {}, L(title)), sub ? h('p', {}, L(sub)) : null);
}
export function metric(label, value, note = null) {
	return h(
		'div',
		{ class: 'ix-metric' },
		h('span', {}, L(label)),
		h('strong', {}, value),
		note ? h('small', {}, L(note)) : null,
	);
}
export const RESOURCE_TITLES = {
	data: ['Data status', '数据状态'],
	changes: ['What changed, and who changed it', '改了什么，由谁改的'],
	scout: ['Scouting — markets with no dashboard', '观察名单 — 尚无看板的市场'],
	investmentLab: ['Acquisition price and return target', '收购价格与目标回报'],
	desk: ['The analyst desk', '分析台'],
};

/** Shared frame for the supporting research pages; their content stays local. */
export function resourcePage(container, { page, title = RESOURCE_TITLES[page], sub, kicker, className = '', busy = false }) {
	document.title = `${L(['Global BESS', '全球储能'])} | ${L(title)}`;
	container.classList.add('ix-app');
	const main = h(
		'main',
		{ id: 'ix-main', class: `ix-container ix-secondary ${className}`, tabindex: -1, ...(busy ? { 'aria-busy': 'true' } : {}) },
		h(
			'div',
			{ class: 'ix-secondary-intro' },
			kicker ? eyebrow(kicker) : null,
			h('h1', { tabindex: -1 }, L(title)),
			sub ? h('p', {}, L(sub)) : null,
		),
	);
	container.append(siteHeader(page), main, siteFooter());
	return main;
}
export function siteHeader(active = 'home') {
	const marketPath = active === 'market' ? window.location.pathname.split('/').slice(0, 3).join('/') : '/returns';
	const nav = h(
		'nav',
		{ class: 'ix-nav', 'aria-label': L(['Main navigation', '主导航']) },
		link(
			'/',
			['Investment brief', '投资简报'],
			active === 'home' ? 'is-active' : '',
			active === 'home' ? { 'aria-current': 'page' } : {},
		),
		link(
			'/returns',
			['Global markets', '全球市场'],
			active === 'returns' ? 'is-active' : '',
			active === 'returns' ? { 'aria-current': 'page' } : {},
		),
		link(
			marketPath,
			active === 'market' ? ['Market intelligence', '市场详情'] : ['Choose a market', '选择市场'],
			active === 'market' ? 'is-active' : '',
			active === 'market' ? { 'aria-current': 'page' } : {},
		),
		link(
			active === 'market' ? marketPath + '/policy' : '/policy',
			['Policy & industry intelligence', '政策与行业情报'],
			active === 'policy' ? 'is-active' : '',
			active === 'policy' ? { 'aria-current': 'page' } : {},
		),
	);
	const toggle = h(
		'button',
		{
			class: 'ix-menu-toggle',
			type: 'button',
			'aria-label': L(['Toggle navigation', '展开导航']),
			'aria-expanded': 'false',
			onclick: () => {
				const open = toggle.getAttribute('aria-expanded') !== 'true';
				toggle.setAttribute('aria-expanded', String(open));
				nav.classList.toggle('is-open', open);
			},
		},
		'☰',
	);
	return h(
		'header',
		{ class: 'ix-header' },
		link('#ix-main', ['Skip to content', '跳到正文'], 'ix-skip'),
		h(
			'div',
			{ class: 'ix-header-inner' },
			link('/', 'GLOBAL BESS', 'ix-brand'),
			nav,
			h(
				'div',
				{ class: 'ix-header-actions' },
				h(
					'button',
					{
						class: 'ix-language',
						type: 'button',
						'aria-label': L(['Switch to Chinese', '切换到英文']),
						onclick: () => {
							toggleLang();
							requestRender({ focus: 'language' });
						},
					},
					app.lang === 'zh' ? 'EN' : '中文',
				),
				toggle,
			),
		),
	);
}
export function siteFooter() {
	return h(
		'footer',
		{ class: 'ix-footer' },
		h(
			'div',
			{ class: 'ix-container ix-footer-inner' },
			h(
				'div',
				{},
				link('/', 'GLOBAL BESS', 'ix-brand'),
				h('p', {}, L(['Intelligence for the energy transition.', '为能源转型，寻找值得投资的机会。'])),
			),
			h(
				'nav',
				{ 'aria-label': L(['Research resources', '研究资源']) },
				link('/returns', ['Global comparison', '全球比较']),
				link('/data', ['Data & methodology', '数据与方法']),
				link('/policy', ['Policy & industry intelligence', '政策与行业情报']),
				link('/changes', ['View changes', '观点变更']),
				link('/investment-lab', ['Acquisition pricing', '收购定价']),
				link('/scout', ['Watchlist', '观察名单']),
				link('/desk', ['Analyst desk', '分析台']),
			),
			h('span', { class: 'ix-mono' }, 'RESEARCH / 2026'),
		),
	);
}
