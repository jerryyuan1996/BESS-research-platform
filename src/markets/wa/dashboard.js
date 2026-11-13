/* ---------------------------------------------------------------------------
   WA dashboard renderer.

   Replaces the prototype's renderHeader / renderNav / renderFooter / render
   (lines 1386-1424, 4333-4352). The composition is the same:

       header · nav · active tab body · footer

   Differences, all consequences of the new architecture rather than choices:

   - The header, nav and footer are the shared components. The header
     receives WA's metadata and WA's third control (forecast COD year) as data.
   - There are two nav rows now: the application row (cockpit + every registered
     market) and WA's own tab strip. The prototype had no way back to the cockpit
     because it lived inside an overlay iframe.
   - The active tab comes from the URL, so every tab is linkable and the browser
     back button works across tabs.
   - applyTheme() is gone from here — theme is applied once by the app shell.
   --------------------------------------------------------------------------- */
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { requestRender } from '../../app/state.js';
import { renderHeader } from '../../components/header.js';
import { marketNav, tabNav, revenueSubNav, labLink } from '../../components/navigation.js';
import { renderFooter } from '../../components/footer.js';
import { enhanceMarketPage, pairOverviewMap } from '../../components/pageEnhancements.js';
import { gridMapForMarket } from '../gridMapRegistry.js';
import { drawTab } from '../../components/tabSections.js';
import { sectionHead } from '../../components/sectionHeader.js';
import { resolveSegment } from '../tabGroups.js';
import { WA_GRID_MAP } from './gridMapData.js';
import { markets } from '../registry.js';

import { manifest } from './manifest.js';
import { TABS } from './tabs.js';
import { state, LS } from './state.js';
import { T } from './text.js';
import { SEED } from './data/seed.js';

import { renderHome } from './sections/home.js';
import { renderStory } from './sections/story.js';
import { renderRcm } from './sections/rcm.js';
import { renderEnergy } from './sections/energy.js';
import { renderFcess } from './sections/fcess.js';
import { renderDuration } from './sections/duration.js';
import { renderPipeline } from './sections/pipeline.js';
import { renderGrid } from './sections/grid.js';
import { renderPortfolio } from './sections/portfolio.js';
import { renderData } from './sections/data.js';
import { renderCase, renderEntry } from './sections/case.js';
import { CLAIMS } from './claims.js';
import { registerClaims } from '../claimRegistry.js';
import VIEW from '../../../view/markets/wa.json' with { type: 'json' };
import { ENTRY_LEDGER } from './entryLedger.js';
import { registerCase } from '../caseRegistry.js';
import { finishConciseResearch } from '../_shared/conciseResearch.js';

/* Registered from the dashboard so the claim prose travels in this market's
   own lazy chunk rather than in the bundle every reader downloads. */
registerClaims('wa', CLAIMS);

/* This market's whole view and ledger, for its Investment Case and Entry tabs.
   Registered here so the reasons, arguments and forfeiture terms travel in
   this market's own chunk; the home page carries a projection of them. */
registerCase('wa', { view: VIEW, ledger: ENTRY_LEDGER });

export function researchSummary(container) {
  container.append(h('article', { class:'card' }, h('h3', {}, L(['House view','本方观点'])),
    h('p', {}, L(SEED.overall.rationale))));
  pairOverviewMap(container, gridMapForMarket('wa') || WA_GRID_MAP);
  renderStory(container, { summaryOnly:true });
  finishConciseResearch(container);
}

/* Tab id → section renderer. The BRCP forecast and the RCM × Energy × FCESS
   co-optimisation are not entries here: both render as the tail of the rcm tab.
   The co-optimiser moved there when the Investment Lab and Project Debt tabs left
   the dashboard for the home page, where one model now serves every market — see
   src/home/investmentLab.js. */
const SECTIONS = {
  home: renderHome,
  case: renderCase,
  entry: renderEntry,
  story: renderStory,
  rcm: renderRcm,
  energy: renderEnergy,
  fcess: renderFcess,
  duration: renderDuration,
  pipeline: renderPipeline,
  grid: renderGrid,
  portfolio: renderPortfolio,
  data: renderData,
};

/** Forecast COD year selector — WA's page-specific header control. */
function codYearSelect(){
  return h('select', {
    class: 'btn',
    onchange: (e) => {
      state.codYear = e.target.value;
      LS.set('wa_cod', state.codYear);
      requestRender();
    },
  }, ['2027-28', '2028-29'].map(y => {
    const o = h('option', { value: y }, L(T.codYearLbl) + ': ' + y);
    if (y === state.codYear) o.selected = true;
    return o;
  }));
}

export function dashboard(container, { tabId, subId, basePath }){
  /* Where the address lands: one of seven tabs, holding one section or several.
     An old address names a section and resolves to its tab; an unrecognised one
     falls back to the landing tab rather than 404ing. */
  const where = resolveSegment(TABS, tabId, subId);
  // The section in view, which is what a section's own links set.
  state.tab = where.section || where.sections[0];

  container.append(renderHeader({
    title: T.title,
    sub: T.sub,
    meta: [
      h('span', {}, h('b', {}, L(T.asOf) + ': '), SEED.asOf + ' (AWST)'),
      h('span', {}, h('b', {}, L(T.dataDate) + ': '), manifest.dataDate),
      h('span', {}, L(T.nextMilestone)),
    ],
    controls: [codYearSelect()],
  }));

  container.append(marketNav(markets, manifest.id));
  container.append(tabNav(TABS, state.tab, basePath));
  const revenueNav = revenueSubNav(TABS, state.tab, basePath);
  if (revenueNav) container.append(revenueNav);

  container.append(labLink(manifest.id));

  const main = h('div');
  container.append(main);
  drawTab(main, where, {
    basePath, marketId: manifest.id,
    draw: (id, el) => {
      /* The overview drew no heading of its own while it was the landing page.
         Stacked under the investment case it takes one. */
      if (id === 'home') sectionHead(el, ['Market at a glance', '市场概览']);
      SECTIONS[id](el);
      finishConciseResearch(el);
    },
    after: (id, el) => { enhanceMarketPage(el, {
      /* The map is paired with the overview, wherever the overview is drawn. */
      overviewMap: id === 'home' ? WA_GRID_MAP : null,
      marketId: manifest.id,
      tabId: id,
    }); finishConciseResearch(el); },
  });
  container.append(renderFooter([
    L(['Model version: ', '模型版本：']) + SEED.modelVersion + ' · ' + L(T.tz) + ' · ' +
      L(['Public and official sources re-verified 26 July 2026; NEM Connection Scorecard data (Jun 2026) is held in a separate namespace and excluded from WA scoring.',
         '公开及官方来源已于2026年7月26日重新核验；NEM并网记分卡数据（2026年6月）保存在独立命名空间，不计入西澳评分。']),
  ]));
}

export default dashboard;
