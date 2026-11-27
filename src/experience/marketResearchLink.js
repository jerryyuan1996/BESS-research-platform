import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';

const ICON = {
	grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21 12 3l4 18"/><path d="M4.5 7h15M6.5 11.5h11M9.6 15.5h4.8"/><path d="M4.5 7v2.2M19.5 7v2.2"/></svg>',
	revenue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M6 20v-6M11 20V8M16 20v-9M21 20V4"/></svg>',
};

/** The two entrances share a reader and keep its research off the initial page.
 *  Each is a card with an icon, what it opens and a filled arrow, so it reads
 *  as a way in rather than a line of text. */
export function marketResearchLink(marketId, kind) {
	const grid = kind === 'grid';
	const label = grid ? ['Explore grid details', '探索电网详情'] : ['Explore revenue & design', '收入与设计详解'];
	const trigger = h(
		'button',
		{
			type: 'button',
			class: 'market-research-link',
			'data-market-research': kind,
			'data-market': marketId,
			'aria-haspopup': 'dialog',
			onclick: async () => {
				trigger.disabled = true;
				trigger.setAttribute('aria-busy', 'true');
				try {
					const { openMarketResearch } = await import('./marketResearchDialog.js');
					if (trigger.isConnected) openMarketResearch(marketId, kind, trigger);
				} catch {
					title.textContent = L(['Could not load — click to retry', '暂未载入，点击重试']);
				} finally {
					trigger.disabled = false;
					trigger.removeAttribute('aria-busy');
				}
			},
		},
		h('span', { class: 'market-research-icon', 'aria-hidden': 'true', html: ICON[grid ? 'grid' : 'revenue'] }),
		h(
			'span',
			{ class: 'market-research-text' },
			h('small', { class: 'market-research-kicker' }, L(grid ? ['Grid reader', '电网专题'] : ['Revenue reader', '收入专题'])),
			h('strong', {}, L(label)),
			h(
				'small',
				{},
				L(
					grid
						? ['Constraints, network upgrades & connection', '拥塞约束、输电工程与并网交付']
						: ['Capacity, energy, balancing & storage duration', '容量机制、电能量、辅助服务与储能时长'],
				),
			),
		),
		h('span', { class: 'market-research-arrow', 'aria-hidden': 'true' }, '→'),
	);
	const title = trigger.querySelector('strong');
	return trigger;
}
