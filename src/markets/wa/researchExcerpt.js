import './gridMapData.js';
import { drawOverviewGrid } from '../_shared/overviewGrid.js';
/* WA's research is hand-written. Embed an existing public section whole, not
   a second transcription of its cards. Only requested renderers are fetched.
   The portfolio renderer is deliberately absent: even its development-only
   confidential import must never be reached through a chapter disclosure. */
import { TABS } from './tabs.js';
import { registerResearchExcerpt } from './state.js';
import { enhanceMarketPage } from '../../components/pageEnhancements.js';
import VIEW from '../../../view/markets/wa.json' with { type: 'json' };
import { ENTRY_LEDGER } from './entryLedger.js';
import { registerCase } from '../caseRegistry.js';
import { CLAIMS } from './claims.js';
import { registerClaims } from '../claimRegistry.js';
import { finishConciseResearch } from '../_shared/conciseResearch.js';
import { CORE_STORYLINE_TEXT } from './coreStoryline.js';

registerCase('wa', { view: VIEW, ledger: ENTRY_LEDGER });
registerClaims('wa', CLAIMS);

const PUBLIC_SECTIONS = {
  home: () => import('./sections/home.js').then(m => m.renderHome),
  story: () => import('./sections/story.js').then(m => m.renderStory),
  rcm: () => import('./sections/rcm.js').then(m => m.renderRcm),
  energy: () => import('./sections/energy.js').then(m => m.renderEnergy),
  fcess: () => import('./sections/fcess.js').then(m => m.renderFcess),
  duration: () => import('./sections/duration.js').then(m => m.renderDuration),
  pipeline: () => import('./sections/pipeline.js').then(m => m.renderPipeline),
  grid: () => import('./sections/grid.js').then(m => m.renderGrid),
  entry: () => import('./sections/case.js').then(m => m.renderEntry),
  data: () => import('./sections/data.js').then(m => m.renderData),
};

export async function researchExcerpt(route, picks){
  const groups = [];
  for (const pick of picks){
    const section = pick.section, load = PUBLIC_SECTIONS[section];
    if (!load) continue;
    const key = '#tab-' + section;
    const named = pick.cards?.includes(key);
    if (!named && pick.cards && (!pick.rest || pick.except?.includes(key))) continue;
    const render = await load();
    const label = TABS.find(([id]) => id === section)[1];
    groups.push({ section, label, storyline:section === 'home' ? CORE_STORYLINE_TEXT : null, lead(){}, cards: [{ key, title: label, visual: 2,
      draw(body, after){
        const paint = () => {
          body.replaceChildren();
          render(body);
          enhanceMarketPage(body, { marketId: 'wa', tabId: section });
          finishConciseResearch(body);
          after?.(body);
        };
        registerResearchExcerpt(body, paint, route.basePath);
        paint();
      },
    }] });
  }
  return groups;
}

export function renderOverviewGrid(container) { drawOverviewGrid(container, 'wa'); }
