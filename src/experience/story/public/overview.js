import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { PUBLIC_READING_CATALOG } from './historyCatalog.js';
import { marketResearchLink } from '../../marketResearchLink.js';
import { publicChapters } from './chapters.js';

const BOOK =
	'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5.6c2.9-1.3 5.9-1.2 9 .9 3.1-2.1 6.1-2.2 9-.9v13.1c-2.9-1.3-5.9-1.2-9 .9-3.1-2.1-6.1-2.2-9-.9z"/><path d="M12 6.5v13.1"/></svg>';

export function renderPublicOverview(id, { name, open }) {
	const c = PUBLIC_READING_CATALOG[id];
	if (!c) return null;
	/* The one entrance to the guided reading: an obvious card that says what
	   is inside (the reader's own chapter list), not a plain button. */
	const chapters = publicChapters(id, c.historyOnly);
	const trigger = h(
		'button',
		{ type: 'button', class: 'ix-button public-story-trigger ix-entry-card', onclick: () => open(trigger) },
		h('span', { class: 'ix-entry-icon', 'aria-hidden': 'true', html: BOOK }),
		h(
			'span',
			{ class: 'ix-entry-text' },
			h(
				'small',
				{ class: 'ix-entry-kicker' },
				L([`Guided reading · ${chapters.length} chapters`, `导读 · ${chapters.length} 章`]),
			),
			h('strong', {}, L(['Market background & investment logic', '市场背景与投资逻辑'])),
			h('span', { class: 'ix-entry-chapters' }, chapters.map(([, title]) => L(title)).join(' · ')),
		),
		h('span', { class: 'ix-entry-go', 'aria-hidden': 'true' }, '→'),
	);
	const context = h('div', { class: 'market-overview-context', 'aria-busy': 'true' });
	const section = h(
		'section',
		{
			id: 'overview',
			class: 'public-overview',
			'data-public-market': id,
			'data-version': c.version,
			'data-status': c.status,
			'aria-labelledby': 'public-overview-title',
		},
		h(
			'div',
			{ class: 'public-overview-heading' },
			h('p', { class: 'ix-eyebrow' }, L(['MARKET BACKGROUND · SHARED RESEARCH', '市场背景 · 公共研究'])),
			h(
				'h2',
				{ id: 'public-overview-title' },
				L(
					c.historyOnly
						? ['How this market developed.', '这个市场如何发展至今。']
						: ['Why storage matters here.', '储能为何在这里有价值。'],
				),
			),
		),
		h(
			'div',
			{ class: 'public-overview-grid' },
			h(
				'div',
				{ class: 'public-overview-copy public-core-storyline', 'aria-busy': 'true' },
				h('p', { class: 'ix-caption' }, L(['Loading the core storyline…', '正在载入核心叙事…'])),
			),
			h('aside', { class: 'public-overview-reading' }, trigger, h('p', { class: 'public-status', role: 'status' })),
		),
	);
	{
		section.classList.add('market-overview');
		const left = h(
			'div',
			{ class: 'market-overview-story' },
			section.querySelector('.public-overview-heading'),
			section.querySelector('.public-overview-copy'),
			context,
			section.querySelector('.public-overview-reading'),
		);
		const host = h('div', { class: 'market-overview-map', 'aria-busy': 'true' });
		const load = async () => {
			host.setAttribute('aria-busy', 'true');
			host.replaceChildren(h('p', { class: 'ix-caption' }, L(['Loading the grid map…', '正在载入电网地图…'])));
			try {
				const { mountMarketGrid } = await import('../../marketGrid.js');
				if (host.isConnected) await mountMarketGrid(host, id);
			} catch {
				if (host.isConnected)
					host.replaceChildren(
						h(
							'button',
							{ type: 'button', class: 'ix-button ix-outline', onclick: load },
							L(['Retry grid map', '重试电网地图']),
						),
					);
			} finally {
				host.setAttribute('aria-busy', 'false');
			}
		};
		section.replaceChildren(
			left,
			h(
				'div',
				{ class: 'market-overview-geography' },
				h(
					'div',
					{ class: 'market-map-heading' },
					h(
						'div',
						{},
						h('p', { class: 'ix-eyebrow' }, L(['THE GEOGRAPHY OF VALUE', '价值的地理分布'])),
						h('h3', {}, L(name) + ' · ' + L(['Electricity network', '电网'])),
					),
					h('span', { class: 'market-map-hint' }, L(['Select a location to explore', '点击地点，查看影响'])),
				),
				host,
				marketResearchLink(id, 'grid'),
			),
		);
		// The host is connected by the caller before this import resolves.
		load();
		const loadContext = async () => {
			context.setAttribute('aria-busy', 'true');
			context.replaceChildren(h('p', { class: 'ix-caption' }, L(['Loading market context…', '正在载入市场格局…'])));
			try {
				const { mountMarketOverviewContext } = await import('../../marketOverviewContext.js');
				if (context.isConnected) await mountMarketOverviewContext(context, id);
			} catch {
				if (context.isConnected)
					context.replaceChildren(
						h(
							'button',
							{ type: 'button', class: 'ix-button ix-outline', onclick: loadContext },
							L(['Retry market context', '重试市场格局']),
						),
					);
			} finally {
				context.setAttribute('aria-busy', 'false');
			}
		};
		// Both readers use the same cached market payload, with independent retries.
		loadContext();
		const copy = section.querySelector('.public-core-storyline');
		const loadNarrative = async () => {
			copy.setAttribute('aria-busy', 'true');
			try {
				const { mountCoreStoryline } = await import('../../marketCoreStoryline.js');
				if (copy.isConnected) await mountCoreStoryline(copy, id);
			} catch {
				if (copy.isConnected)
					copy.replaceChildren(
						h(
							'button',
							{ type: 'button', class: 'ix-button ix-outline', onclick: loadNarrative },
							L(['Retry core storyline', '重试核心叙事']),
						),
					);
			} finally {
				copy.setAttribute('aria-busy', 'false');
			}
		};
		loadNarrative();
	}
	return section;
}
