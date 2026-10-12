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
import { markets, marketPath, hasDashboard, resolveDashboard } from './registry.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
import { refinementBanner } from '../components/refinementBanner.js';

/* ---------------------------------------------------------------------------
   THE ASYNC BOUNDARY.

   Market dashboards load on demand, so between "the reader asked for Romania"
   and "Romania can be drawn" there is a gap. Three states live in that gap, and
   the page has to mean something in all of them:

     loading   a skeleton, not an empty #app. A blank page is indistinguishable
               from a broken one, and on a slow connection this is what a first
               visit looks like for most of a second.
     failure   a chunk that 404s is a REAL production case, not a hypothetical:
               a redeploy replaces hashed filenames, and a reader whose tab has
               been open across one gets a request for bytes that no longer
               exist. That must offer a reload, not a white screen.
     stale     the reader navigated again before the chunk arrived. Rendering
               then puts the previous page's content under the current URL.

   `renderToken` is the guard for the third. Every render attempt takes the next
   token; a resolution whose token is no longer current does nothing. One counter
   for the whole module is enough because #app hosts one page at a time.
   --------------------------------------------------------------------------- */
let renderToken = 0;

/** A market header with a skeleton where the dashboard will be. */
function renderLoading(container, market){
  const mf = market.manifest;
  container.append(h('div', { class: 'hdr' }, h('div', {},
    h('div', { class: 'kicker' }, mf.flag + ' ' + L(mf.shortName)),
    h('h1', {}, L(mf.name)),
    h('div', { class: 'sub' }, L(['Loading the dashboard…', '正在加载看板…'])))));
  container.append(marketNav(markets, mf.id));
  /* Three bars rather than a spinner: it says "content is coming and roughly
     this shape", which a spinner does not. aria-busy so a screen reader is told
     the same thing rather than being read an empty region. */
  container.append(h('div', { class: 'dash-skeleton', 'aria-busy': 'true',
    'aria-label': L(['Loading', '加载中']) },
    h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' })));
}

/** A chunk that would not load. Recoverable, and says so. */
function renderLoadFailure(container, market, err){
  const mf = market.manifest;
  container.innerHTML = '';
  container.append(h('div', { class: 'hdr' }, h('div', {},
    h('div', { class: 'kicker' }, mf.flag + ' ' + L(mf.shortName)),
    h('h1', {}, L(mf.name)))));
  container.append(marketNav(markets, mf.id));
  container.append(h('div', { class: 'warnbox' }, L([
    'This market\'s dashboard could not be loaded. The most likely cause is that the site was updated while this page was open, which replaces the files this tab was going to request. Reloading fixes that.',
    '本市场看板加载失败。最可能的原因是本页打开期间站点已更新，导致本标签页请求的文件已被替换。刷新即可解决。',
  ])));
  container.append(h('div', {},
    h('button', { class: 'btn', onclick: () => window.location.reload() },
      L(['Reload the page', '刷新页面']))));
  /* The cockpit does not depend on this chunk, so it is a genuine way out
     rather than a consolation link. */
  container.append(h('div', { class: 'note' },
    L(['Every other market and the global cockpit are unaffected — ', '其他市场与全球总看板不受影响 — ']),
    h('a', { href: '/', onclick: (e) => { e.preventDefault(); navigate('/'); } },
      L(['return to the cockpit', '返回总看板'])), '.'));
  container.append(renderFooter([DISCLAIMER]));
  console.error('[market] dashboard chunk failed to load for %s:', mf.id, err);
}

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
    'This market\'s detailed dashboard has not yet been migrated out of the legacy single-file prototype. Its comparison interface is complete, so it participates fully in every comparison on the Returns page — the league table, the $1M engine, the certainty frontier and the waterfall all include it.',
    '该市场的详细看板尚未从旧版单文件原型中迁出。其对比接口已完成，因此在回报对比页的所有对比中均完整参与 — 包括同口径对比表、百万美元引擎、确定性前沿与瀑布图。',
  ])));

  container.append(h('div', { class: 'note' },
    h('b', {}, L(['Available now: ', '当前可用：'])),
    L(['this market\'s economics on a like-for-like basis, on the ', '该市场的同口径经济性见']),
    h('a', { href: '/returns', onclick: (e) => { e.preventDefault(); navigate('/returns'); } },
      L(['Returns page', '回报对比页'])),
    L(['. Migration steps are documented in docs/adding-a-market.md.',
       '。迁移步骤记录于 docs/adding-a-market.md。'])));

  const e = market.comparison.economics;
  const rows = [
    [['Reference archetype', '参考原型'], L(market.comparison.narrative.archetype)],
    [['Connection risk', '并网风险'], market.comparison.score.connectionRisk + '/100'],
    [['Currency', '货币'], mf.currency],
    [['Capex per MW', '每MW造价'], mf.currencySymbol + e.capexPerMW.toLocaleString(mf.locale)],
    [['Contract length', '合同年限'], e.contractYears ? e.contractYears + L([' years', '年']) : L(['None', '无'])],
    [['Verified', '核验日期'], mf.asOf],
  ];
  container.append(h('div', { class: 'card', style: 'margin-top:14px;' },
    h('h3', {}, L(['Comparison interface — what the Returns page reads from this market', '对比接口 — 回报对比页读取的内容'])),
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
export function renderMarketPage(container, market, tabId, regionOverride, subId = null){
  if (!hasDashboard(market)) return renderPending(container, market);

  /* A market may delegate its dashboard to another module. Tokyo, Kyushu and
     Hokkaido are separate allocation points that share one Japan dashboard; the
     shared renderer is told which regional lens to open in. resolveDashboard()
     handles that delegation, so three visits share one chunk.

     The URL still names the allocation point the visitor asked for, so links,
     the back button and the market nav all stay consistent. */
  const token = ++renderToken;
  const pending = resolveDashboard(market);

  /* A chunk already in memory resolves in a microtask, so showing a skeleton
     unconditionally would flash it on every subsequent visit to the same market.
     The delay is longer than a warm import and shorter than a cold one. */
  const skeletonTimer = setTimeout(() => {
    if (token === renderToken && !container.firstChild) renderLoading(container, market);
  }, 120);

  pending.then(dashboard => {
    clearTimeout(skeletonTimer);
    /* STALE NAVIGATION. Between the request and the resolve the reader may have
       gone somewhere else — clicked another market, hit back, changed language.
       The container is then either detached or already owned by another page,
       and rendering into it produces the previous page's content under the
       current URL. The token is what makes that non-negotiable rather than
       best-effort. */
    if (token !== renderToken) return;
    if (typeof dashboard !== 'function') return renderPending(container, market);

    container.innerHTML = '';
    dashboard(container, {
      tabId,
      subId,
      basePath: marketPath(market),
      region: regionOverride || market.manifest.region || null,
      market,
    });
    const banner = refinementBanner(market);
    const header = container.querySelector('.hdr');
    if (banner && header) header.insertAdjacentElement('afterend', banner);
  }).catch(err => {
    clearTimeout(skeletonTimer);
    if (token !== renderToken) return;
    renderLoadFailure(container, market, err);
  });
}
