/* ---------------------------------------------------------------------------
   TEMPLATE — dashboard renderer.

   Contract:  dashboard(container, { tabId, basePath }) => void

   The shell has already resolved the route and mounted #app. This function owns
   everything inside it: header, nav, the active tab's body, footer.

   Import shared UI and charts. Do NOT copy a chart implementation, a badge, a
   card or a theme system into this directory — there is exactly one of each and
   they live in src/charts and src/components.

   Market-specific CSS, if genuinely needed, goes in a .css file in this directory
   and is imported here. Almost always it is not needed: the shared design tokens
   and components cover the cockpit's whole visual vocabulary.
   --------------------------------------------------------------------------- */
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { renderHeader, renderDisclaimer } from '../../components/header.js';
import { marketNav, tabNav } from '../../components/navigation.js';
import { renderFooter } from '../../components/footer.js';
import { markets } from '../registry.js';

import { manifest } from './manifest.js';
import { tabs, DEFAULT_TAB } from './tabs.js';
import { state } from './state.js';

// One render function per tab. Add sections under ./sections/ and import them.
// import { renderOverview } from './sections/overview.js';
const SECTIONS = {
  home: (main) => main.append(h('div', { class: 'note' },
    L(['Replace this with the market overview section.', '请以市场总览章节替换此处。']))),
};

const DISCLAIMER = [
  'This dashboard supports, but does not replace, independent investment, legal, technical and financial analysis.',
  '本看板用于辅助而非替代独立的投资、法律、技术及财务分析。',
];

export function dashboard(container, { tabId, basePath }){
  // Fall back to the default tab when the URL names one this market does not have.
  state.tab = tabs.some(([id]) => id === tabId) ? tabId : DEFAULT_TAB;

  container.append(renderHeader({
    kicker: manifest.flag + ' ' + L(manifest.shortName),
    title: manifest.name,
    sub: ['One-line description of this market dashboard.', '本市场看板的一句话说明。'],
    meta: [
      h('span', {}, h('b', {}, L(['Seed snapshot verified: ', '种子数据核验日期：'])), manifest.asOf || '—'),
    ],
  }));
  container.append(renderDisclaimer(DISCLAIMER));
  container.append(marketNav(markets, manifest.id));
  container.append(tabNav(tabs, state.tab, basePath));

  const main = h('div');
  container.append(main);
  (SECTIONS[state.tab] || SECTIONS[DEFAULT_TAB])(main);

  container.append(renderFooter([
    DISCLAIMER,
    L(['Model version: ', '模型版本：']) + (manifest.modelVersion || '—'),
  ]));
}

export default dashboard;
