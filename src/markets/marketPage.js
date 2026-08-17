/* ---------------------------------------------------------------------------
   Market page shell.

   Wraps any market module in the shared application chrome: app navigation,
   the market's own tab strip, and the footer. The shell is market-agnostic — it
   reads only the manifest, `tabs` and `dashboard`, and knows nothing about what
   any particular market contains.

   A market that has a comparison interface but no dashboard yet renders a
   documented pending-migration page rather than a broken route.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { markets, marketPath, dashboardOwner } from './registry.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
import { refinementBanner } from '../components/refinementBanner.js';

const DISCLAIMER = [
  'This dashboard supports, but does not replace, independent investment, legal, technical and financial analysis. Composite signals, recommended durations and suggested commercial terms are generated from the stated methodology and the data sources shown; they are not investment advice and should not be relied upon as the sole basis for a transaction decision.',
  '本看板用于辅助而非替代独立的投资、法律、技术及财务分析。综合信号、建议时长及建议商业条款均基于所示方法及数据来源生成，不构成投资建议，不应作为交易决策的唯一依据。',
];

function renderPending(container, market){
  const mf = market.manifest;
  container.append(h('div', { class: 'hdr' },
    h('div', {},
      h('div', { class: 'kicker' }, mf.flag + ' ' + L(mf.shortName)),
      h('h1', {}, L(mf.name)),
      h('div', { class: 'sub' }, L([
        'Market dashboard migration pending.',
        '市场看板迁移进行中。',
      ])))));

  container.append(marketNav(markets, mf.id));
  container.append(refinementBanner(market));


  container.append(h('div', { class: 'warnbox' }, L([
    'This market\'s detailed dashboard has not yet been migrated out of the legacy single-file prototype. Its comparison interface is complete, so it participates fully in every comparison on the global cockpit — the league table, the $1M engine, the certainty frontier and the waterfall all include it.',
    '该市场的详细看板尚未从旧版单文件原型中迁出。其对比接口已完成，因此在全球总看板的所有对比中均完整参与 — 包括同口径对比表、百万美元引擎、确定性前沿与瀑布图。',
  ])));

  container.append(h('div', { class: 'note' },
    h('b', {}, L(['Available now: ', '当前可用：'])),
    L(['this market\'s economics on a like-for-like basis, on the ', '该市场的同口径经济性见']),
    h('a', { href: '/', onclick: (e) => { e.preventDefault(); navigate('/'); } },
      L(['global cockpit', '全球总看板'])),
    L(['. Migration steps are documented in docs/adding-a-market.md.',
       '。迁移步骤记录于 docs/adding-a-market.md。'])));

  const e = market.comparison.economics;
  const rows = [
    [['Reference archetype', '参考原型'], L(market.comparison.narrative.archetype)],
    [['Composite score', '综合评分'], market.comparison.score.composite + '/100'],
    [['Connection risk', '并网风险'], market.comparison.score.connectionRisk + '/100'],
    [['Currency', '货币'], mf.currency],
    [['Capex per MW', '每MW造价'], mf.currencySymbol + e.capexPerMW.toLocaleString(mf.locale)],
    [['Contract length', '合同年限'], e.contractYears ? e.contractYears + L([' years', '年']) : L(['None', '无'])],
    [['Verified', '核验日期'], mf.asOf],
  ];
  container.append(h('div', { class: 'card', style: 'margin-top:14px;' },
    h('h3', {}, L(['Comparison interface — what the cockpit reads from this market', '对比接口 — 总看板读取的内容'])),
    h('div', { class: 'tbl-wrap' }, h('table', {}, h('tbody', {}, rows.map(([k, v]) =>
      h('tr', {}, h('td', {}, h('b', {}, L(k))), h('td', {}, String(v)))))))));

  container.append(renderFooter([DISCLAIMER]));
}

/**
 * @param {HTMLElement} container  #app
 * @param {object} market          registry entry
 * @param {string|null} tabId      deep-linked tab, or null for the market's default
 */
/**
 * @param {HTMLElement} container
 * @param {object} market        the allocation point being visited
 * @param {string|null} tabId
 * @param {string|null} regionOverride  from ?region=, e.g. 'compare'
 */
export function renderMarketPage(container, market, tabId, regionOverride){
  /* A market may delegate its dashboard to another module. Tokyo, Kyushu and
     Hokkaido are separate allocation points that share one Japan dashboard; the
     shared renderer is told which regional lens to open in.

     The URL still names the allocation point the visitor asked for, so links,
     the back button and the market nav all stay consistent. */
  const owner = dashboardOwner(market);
  if (typeof owner.dashboard !== 'function') return renderPending(container, market);

  owner.dashboard(container, {
    tabId,
    basePath: marketPath(market),
    region: regionOverride || market.manifest.region || null,
    market,
  });
  const banner = refinementBanner(market);
  const header = container.querySelector('.hdr');
  if (banner && header) header.insertAdjacentElement('afterend', banner);
}
