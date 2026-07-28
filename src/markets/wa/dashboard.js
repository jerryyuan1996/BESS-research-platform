/* ---------------------------------------------------------------------------
   WA dashboard renderer.

   Replaces the prototype's renderHeader / renderNav / renderFooter / render
   (lines 1386-1424, 4333-4352). The composition is the same:

       header · disclaimer · nav · active tab body · footer

   Differences, all consequences of the new architecture rather than choices:

   - The header, disclaimer, nav and footer are the shared components. The header
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
import { renderHeader, renderDisclaimer } from '../../components/header.js';
import { marketNav, tabNav } from '../../components/navigation.js';
import { renderFooter } from '../../components/footer.js';
import { chip } from '../../components/chip.js';
import { markets } from '../registry.js';

import { manifest } from './manifest.js';
import { TABS, DEFAULT_TAB } from './tabs.js';
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
import { renderBenchmark } from './sections/benchmark.js';
import { renderLab } from './sections/lab.js';
import { renderPortfolio } from './sections/portfolio.js';
import { renderData } from './sections/data.js';

/* Tab id → section renderer. Verbatim from the prototype's RENDER map. The BRCP
   forecast and the co-optimisation model are not entries here: they render as the
   tail of the rcm and lab tabs, as they did in the prototype. */
const SECTIONS = {
  home: renderHome,
  story: renderStory,
  rcm: renderRcm,
  energy: renderEnergy,
  fcess: renderFcess,
  duration: renderDuration,
  pipeline: renderPipeline,
  grid: renderGrid,
  benchmark: renderBenchmark,
  lab: renderLab,
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

export function dashboard(container, { tabId, basePath }){
  // An unrecognised tab in the URL falls back to the default rather than 404ing.
  state.tab = TABS.some(([id]) => id === tabId) ? tabId : DEFAULT_TAB;

  container.append(renderHeader({
    title: T.title,
    sub: T.sub,
    meta: [
      h('span', {}, h('b', {}, L(T.asOf) + ': '), SEED.asOf + ' (AWST)'),
      h('span', {}, h('b', {}, L(T.dataDate) + ': '), manifest.dataDate),
      chip('serious', L(T.srcHealth)),
      h('span', {}, L(T.nextMilestone)),
    ],
    controls: [codYearSelect()],
  }));

  container.append(renderDisclaimer(T.disclaimer));
  container.append(marketNav(markets, manifest.id));
  container.append(tabNav(TABS, state.tab, basePath));

  const main = h('div');
  container.append(main);
  (SECTIONS[state.tab] || SECTIONS[DEFAULT_TAB])(main);

  container.append(renderFooter([
    T.disclaimer,
    L(['Model version: ', '模型版本：']) + SEED.modelVersion + ' · ' + L(T.tz) + ' · ' +
      L(['Public and official sources re-verified 26 July 2026; NEM Connection Scorecard data (Jun 2026) is held in a separate namespace and excluded from WA scoring.',
         '公开及官方来源已于2026年7月26日重新核验；NEM并网记分卡数据（2026年6月）保存在独立命名空间，不计入西澳评分。']),
  ]));
}

export default dashboard;
