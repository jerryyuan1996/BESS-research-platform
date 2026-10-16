/* ---------------------------------------------------------------------------
   Returns — one currency, one model, every market.

   This was the home page until the investment-view revision put verdicts
   there instead (plan section 6.1). Everything that page showed is here, in
   the same order and from the same calls, so no number moved:

     header
     market universe        (cards)
     cross-market league    (one currency, one model)
     revenue architecture   (per MWh, contracted vs merchant)
     $1M engine             (matrix · IRR · frontier · waterfall)
     grid and congestion

   Two sections were written for the old page and never mounted. They are
   mounted here, after the engine they comment on:

     key readings           computed commentary on the returns above
     evidence               ranges, evidence confidence and approval gates

   Every section receives the market list as an argument. Nothing here knows how
   many markets there are or what they are called — the list comes from the
   registry, so a newly registered market participates in all of it automatically.

   Fetched on demand: a reader who opens the home page and a market never pays
   for the league table, the globe or the engine's charts.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { requestRender } from '../app/state.js';
import { navigate } from '../app/router.js';
import { renderHeader } from '../components/header.js';
import { marketNav } from '../components/navigation.js';
import { renderFooter } from '../components/footer.js';
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
import { renderFindings } from './findings.js';
import { renderLongLife } from './longLifeView.js';
import { renderRefinementOverview } from './refinementOverview.js';

const T = {
  title: ['Returns across markets', '跨市场回报对比'],
  /* Two counts, deliberately. Allocation markets are exposures; detail dashboards
     are documents. Japan contributes three of the first and one of the second. */
  sub: (n, d) => ([
    'One page across ' + n + ' allocation markets and ' + d + ' detailed dashboards: comparable market indicators and an illustrative $1M allocation model.',
    '覆盖' + n + '个配置市场和' + d + '个详细看板：集中展示可比市场指标及仅作示例的100万美元配置模型。',
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

function linkButton(href, label, cls = ''){
  return h('a', {
    class:'btn' + cls,
    href,
    onclick:event => {
      event.preventDefault();
      navigate(href);
      window.scrollTo(0, 0);
    },
  }, L(label));
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

export function renderReturnsPage(app){
  const list = comparableMarkets();
  refreshTranslationFx();
  const n = list.length;
  const d = DETAIL_DASHBOARDS().length;
  /* When each market's inputs were last checked: the span across the markets
     shown, from their manifests, never a date typed here. */
  const checked = list.map(m => m.manifest.lastVerified).filter(Boolean).sort();
  const first = checked[0], last = checked[checked.length - 1];
  const span = !first ? ['—', '—'] : first === last ? [first, first] : [first + ' to ' + last, first + '至' + last];

  app.append(renderHeader({
    hero: true,
    // Prototype had the literal 'WA · GB · IE · RO · PL'. Now derived.
    kicker: list.map(m => L(m.manifest.shortName)).join(' · '),
    title: T.title,
    sub: T.sub(n, d),
    meta: [
      h('span', {}, h('b', {}, L(['Comparison inputs reviewed: ', '对比输入复核日期：'])), L(span)),
    ],
    controls: [
      exitYearSelect(),
      linkButton('/', ['◂ Briefing', '◂ 简报']),
      linkButton('/investment-lab', ['Investment Lab ↗', '投资测算 ↗'], ' lab-access-btn'),
    ],
  }));

  app.append(marketNav(markets, 'returns'));

  const main = h('div');
  const universe = h('section', { class:'market-universe' });
  renderMarketGrid(universe, list, homeState.exitYear, renderMarketGlobe());
  main.append(universe);
  renderNewsPreview(main);
  renderLeague(main, list, homeState.exitYear);
  renderStack(main, list, homeState.exitYear);
  renderEngine(main, list, homeState.exitYear);
  /* Commentary computed from the engine results above, then the evidence
     those results rest on. */
  /* The same assets on a longer life, beside the engine (gate G12). */
  renderLongLife(main, list);
  renderFindings(main, list, homeState.exitYear);
  renderRefinementOverview(main, list, homeState.exitYear);
  /* Congestion is the one revenue line the unlevered model does not carry. */
  renderCongestionView(main, list);
  app.append(main);

  app.append(renderFooter(['hub-1.0 · ' + L(T.footerNote)]));
}
