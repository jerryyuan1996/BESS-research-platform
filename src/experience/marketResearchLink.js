import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

const ICON = {
	grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21 12 3l4 18"/><path d="M4.5 7h15M6.5 11.5h11M9.6 15.5h4.8"/><path d="M4.5 7v2.2M19.5 7v2.2"/></svg>',
	revenue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M6 20v-6M11 20V8M16 20v-9M21 20V4"/></svg>',
	connection: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/></svg>',
};

const READER = {
	grid: {
		kicker: ['Grid reader', '电网专题'],
		title: ['Explore grid details', '探索电网详情'],
		description: ['Constraints, network upgrades & connection', '拥塞约束、输电工程与并网交付'],
	},
	revenue: {
		kicker: ['Revenue reader', '收入专题'],
		title: ['Explore revenue & design', '收入与设计详解'],
		description: ['Capacity, energy, balancing & storage duration', '容量机制、电能量、辅助服务与储能时长'],
	},
	connection: {
		kicker: ['Connection value', '并网权价值'],
		title: ['What the grid connection is worth', '并网权值多少'],
		description: ['Policy trend, scarcity & our view on its future value', '政策走向、稀缺程度与未来价值判断'],
	},
};

/** Each research reader loads when the user opens its card. */
export function marketResearchLink(marketId, kind) {
	const copy = READER[kind];
	const title = h('strong', {}, L(copy.title));
	const trigger = h(
		'button',
		{
			type: 'button',
			class: kind === 'connection' ? 'market-research-link market-connection-link' : 'market-research-link',
			'data-market-research': kind,
			'data-market': marketId,
			'aria-haspopup': 'dialog',
			onclick: async () => {
				trigger.disabled = true;
				trigger.setAttribute('aria-busy', 'true');
				try {
					if (kind === 'connection') {
						const { openConnectionOutlook } = await import('./connectionOutlookDialog.js');
						if (trigger.isConnected) openConnectionOutlook(marketId, trigger);
					} else {
						const { openMarketResearch } = await import('./marketResearchDialog.js');
						if (trigger.isConnected) openMarketResearch(marketId, kind, trigger);
					}
					title.textContent = L(copy.title);
				} catch {
					title.textContent = L(['Could not load — click to retry', '暂未载入，点击重试']);
				} finally {
					trigger.disabled = false;
					trigger.removeAttribute('aria-busy');
				}
			},
		},
		h('span', { class: 'market-research-icon', 'aria-hidden': 'true', html: ICON[kind] }),
		h(
			'span',
			{ class: 'market-research-text' },
			h('small', { class: 'market-research-kicker' }, L(copy.kicker)),
			title,
			h('small', {}, L(copy.description)),
		),
		h('span', { class: 'market-research-arrow', 'aria-hidden': 'true' }, '→'),
	);
	return trigger;
}
