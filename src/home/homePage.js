/* ---------------------------------------------------------------------------
   Home page — the Global BESS Investment Cockpit.

   Composition order:

     header · disclaimer
     market universe        (cards)
     cross-market league    (one currency, one model)
     revenue architecture   (per MWh, contracted vs merchant)
     $1M engine             (matrix · IRR · frontier · waterfall)
     footer

   Every section receives the market list as an argument. Nothing here knows how
   many markets there are or what they are called — the list comes from the
   registry, so a newly registered market participates in all of it automatically.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { requestRender } from '../app/state.js';
import { navigate } from '../app/router.js';
import { renderHeader, renderDisclaimer } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
import { chip } from '../components/chip.js';
import { markets, comparableMarkets, DETAIL_DASHBOARDS } from '../markets/registry.js';
import { EXIT_YEARS } from '../comparison/assumptions.js';
import { homeState } from './state.js';
import { whenLoaded } from '../live/client.js';
import { setObservedFxSummary } from '../comparison/fx.js';
import { renderMarketGrid } from './marketGrid.js';
import { renderLeague } from './marketComparison.js';
import { renderMarketGlobe } from './marketGlobe.js';
import { renderNewsPreview } from '../news/newsFeed.js';
import { renderStack } from './normalizationView.js';
import { renderEngine } from './allocationMatrix.js';
import { renderCongestionView } from './congestionView.js';

const T = {
  title: ['Global BESS Investment Cockpit', '全球储能投资总看板'],
  /* Two counts, deliberately. Allocation markets are exposures; detail dashboards
     are documents. Japan contributes three of the first and one of the second. */
  sub: (n, d) => ([
    'One page across ' + n + ' allocation markets and ' + d + ' detailed dashboards: comparable market indicators and an illustrative $1M allocation model.',
    '覆盖' + n + '个配置市场和' + d + '个详细看板：集中展示可比市场指标及仅作示例的100万美元配置模型。',
  ]),
  disclaimer: (n) => ([
    'The market cards, league tables and $1M engine put ' + n + ' markets on a like-for-like footing in a simplified, unlevered USD model. These allocation outputs are illustrative; source and evidence status remain available in each detailed market dashboard.',
    '市场卡片、排行榜及100万美元引擎将' + n + '个市场置于同一口径，纳入简化、无杠杆的美元模型。配置结果仅作示例；各项来源及证据状态仍保留在对应市场的详细看板中。',
  ]),
  footerNote: [
    'Detailed market dashboards retain the governed public-source registry. The allocation model inherits their badges and adds only the stated FX and exit-pricing assumptions.',
    '各市场详细看板继续保留受治理的公开来源登记册；配置模型沿用其标识，并仅新增已披露的汇率与退出定价假设。',
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

function investmentLabButton(){
  return h('a', {
    class:'btn lab-access-btn',
    href:'/investment-lab',
    onclick:event => {
      event.preventDefault();
      navigate('/investment-lab');
      window.scrollTo(0, 0);
    },
  }, L(['Investment Lab', '投资测算']) + ' ↗');
}

function refreshTranslationFx(){
  whenLoaded('fx-ecb', summary => {
    const asOf = summary?.derived?.asOf || summary?.fetchedAt;
    if (!asOf || homeState.fxAsOf === asOf) return;
    if (!setObservedFxSummary(summary)) return;
    homeState.fxAsOf = asOf;
    requestRender();
  });
}

export function renderHome(app){
  const list = comparableMarkets();
  refreshTranslationFx();
  const n = list.length;
  const d = DETAIL_DASHBOARDS().length;

  app.append(renderHeader({
    hero: true,
    // Prototype had the literal 'WA · GB · IE · RO · PL'. Now derived.
    kicker: list.map(m => L(m.manifest.shortName)).join(' · '),
    title: T.title,
    sub: T.sub(n, d),
    meta: [
      h('span', {}, h('b', {}, L(['Comparison inputs reviewed: ', '对比输入复核日期：'])), '2026-08-04'),
      chip('serious', ['Release Gate: screening only — not approved for underwriting',
                       '发布门槛：仅供筛选 — 未获承销批准']),
    ],
    controls: [exitYearSelect(), investmentLabButton()],
  }));

  app.append(renderDisclaimer(T.disclaimer(n)));
  app.append(marketNav(markets, 'home'));

  const main = h('div');
  const universe = h('section', { class:'market-universe' });
  renderMarketGrid(universe, list, homeState.exitYear, renderMarketGlobe());
  main.append(universe);
  renderNewsPreview(main);
  renderLeague(main, list, homeState.exitYear);
  renderStack(main, list, homeState.exitYear);
  renderEngine(main, list, homeState.exitYear);
  /* Congestion is the one revenue line the unlevered model does not carry. */
  renderCongestionView(main, list);
  app.append(main);

  app.append(renderFooter([T.disclaimer(n), 'hub-1.0 · ' + L(T.footerNote)]));
}
