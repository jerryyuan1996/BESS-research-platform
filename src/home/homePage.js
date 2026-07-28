/* ---------------------------------------------------------------------------
   Home page — the Global BESS Investment Cockpit.

   Composition order is the prototype's, unchanged:

     header · disclaimer
     market universe        (cards)
     cross-market league    (one currency, one model)
     revenue architecture   (per MWh, contracted vs merchant)
     $1M engine             (matrix · IRR · frontier · waterfall)
     allocation findings
     footer

   Every section receives the market list as an argument. Nothing here knows how
   many markets there are or what they are called — the list comes from the
   registry, so a newly registered market participates in all of it automatically.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { requestRender } from '../app/state.js';
import { renderHeader, renderDisclaimer } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
import { chip } from '../components/chip.js';
import { markets, comparableMarkets, DETAIL_DASHBOARDS } from '../markets/registry.js';
import { EXIT_YEARS } from '../comparison/assumptions.js';
import { homeState } from './state.js';
import { renderMarketGrid } from './marketGrid.js';
import { renderLeague } from './marketComparison.js';
import { renderStack } from './normalizationView.js';
import { renderEngine } from './allocationMatrix.js';
import { renderFindings } from './findings.js';
import { renderRegionalStrip } from './regionalStrip.js';

const T = {
  title: ['Global BESS Investment Cockpit', '全球储能投资总看板'],
  /* Two counts, deliberately. Allocation markets are exposures; detail dashboards
     are documents. Japan contributes three of the first and one of the second. */
  sub: (n, d) => ([
    'One page across ' + n + ' allocation markets and ' + d + ' detailed dashboards: normalized apples-to-apples indicators, and what $1M buys — by market and by route-to-market.',
    n + '个配置市场、' + d + '个详细看板，一页总览：归一化的同口径指标，以及每100万美元在不同市场、不同售电路径下的回报。',
  ]),
  disclaimer: (n) => ([
    'This hub normalizes seed values from the underlying market dashboards into USD on one simplified, unlevered model, across ' + n + ' allocation markets. All figures are illustrative, carry the badges of their source dashboards, and are not investment advice.',
    '本总看板将各市场看板的种子数值以一个简化、无杠杆的模型归一化为美元，覆盖' + n + '个配置市场。所有数值均为示例性质、沿用来源看板的质量标识，不构成投资建议。',
  ]),
  footerNote: [
    'Sources and quality badges live in each market dashboard; this page inherits them and adds only FX and exit-pricing assumptions, both stated above.',
    '数据来源与质量标识见各市场看板；本页继承之，仅新增汇率与退出定价假设，均已在上文列明。',
  ],
};

/** Exit-year selector. Preserves the prototype's scroll-position restore. */
function exitYearSelect(){
  const sel = h('select', {
    class: 'btn',
    onchange: (e) => {
      const y = window.scrollY;
      homeState.exitYear = +e.target.value;
      requestRender();
      window.scrollTo(0, y);
    },
  }, EXIT_YEARS.map(y => {
    const o = h('option', { value: y }, L(['Exit year: ', '退出年份：']) + y);
    if (y === homeState.exitYear) o.selected = true;
    return o;
  }));
  return sel;
}

export function renderHome(app){
  const list = comparableMarkets();
  const n = list.length;
  const d = DETAIL_DASHBOARDS().length;

  app.append(renderHeader({
    hero: true,
    // Prototype had the literal 'WA · GB · IE · RO · PL'. Now derived.
    kicker: list.map(m => L(m.manifest.shortName)).join(' · '),
    title: T.title,
    sub: T.sub(n, d),
    meta: [
      h('span', {}, h('b', {}, L(['Seed snapshots verified: ', '种子数据核验日期：'])), '2026-07-26'),
      chip('serious', ['All values seed-derived & illustrative — see each dashboard for badges',
                       '所有数值源自种子数据、属示例性质 — 质量标识详见各看板']),
    ],
    controls: [exitYearSelect()],
  }));

  app.append(renderDisclaimer(T.disclaimer(n)));
  app.append(marketNav(markets, 'home'));

  const main = h('div');
  renderMarketGrid(main, list, homeState.exitYear);
  // Explains why several cards share a flag, before the league table compares them.
  renderRegionalStrip(main, list, homeState.exitYear);
  renderLeague(main, list, homeState.exitYear);
  renderStack(main, list, homeState.exitYear);
  renderEngine(main, list, homeState.exitYear);
  renderFindings(main, list, homeState.exitYear);
  app.append(main);

  app.append(renderFooter([T.disclaimer(n), 'hub-1.0 · ' + L(T.footerNote)]));
}
