/* ---------------------------------------------------------------------------
   Application shell.

   Owns the mount point, the route → page mapping, and the single render entry
   point that every component reaches through requestRender().

   The shell knows about the home cockpit, the Lab, and market or status pages.
   It resolves a market by slug from the registry — there is no switch on market
   id anywhere in the app.
   --------------------------------------------------------------------------- */
import { $id, h } from '../utils/dom.js';
import { L, htmlLang } from './i18n.js';
import { setRenderer } from './state.js';
import { applyTheme } from './theme.js';
import { currentRoute, onRouteChange, startRouter, navigate } from './router.js';
import { markets, bySlug } from '../markets/registry.js';
import { renderHome } from '../home/homePage.js';
import { renderInvestmentLabPage } from '../home/investmentLabPage.js';
import { renderMarketPage } from '../markets/marketPage.js';
import { renderDataStatus } from '../live/dataStatusPage.js';
import { marketNav } from '../components/navigation.js';
import { renderNewsPage } from '../news/newsFeed.js';
import { validateRegistry } from '../utils/validation.js';

function renderNotFound(app, route){
  app.append(h('div', { class: 'hdr' }, h('div', {},
    h('h1', {}, L(['Page not found', '页面不存在'])),
    h('div', { class: 'sub' }, route.path))));
  app.append(marketNav(markets, 'home'));
  app.append(h('div', { class: 'note' },
    L(['That route does not exist. Use the navigation above, or ', '该路由不存在。请使用上方导航，或']),
    h('a', { href: '/', onclick: (e) => { e.preventDefault(); navigate('/'); } },
      L(['return to the global cockpit', '返回全球总看板'])), '.'));
}

/* Guards a stale dossier render, exactly as marketPage.js guards a stale market
   one: the reader may navigate again before the chunk resolves. */
let dossierToken = 0;

/** Renders the current route into #app. This is the app's only render entry point. */
export function render(){
  const route = currentRoute();
  document.documentElement.lang = htmlLang();

  const app = $id('app');
  app.innerHTML = '';

  if (route.name === 'market'){
    const market = bySlug(route.slug);
    if (market) return void renderMarketPage(app, market, route.tab, route.region);
    return void renderNotFound(app, { path: '/markets/' + route.slug });
  }
  /* LOADED ON DEMAND, and for this route that matters more than for a market.
     In a published build no dossier exists, so the shell's only job is to render
     a 404 — and shipping the block engine, the structure renderer and the
     sensitivity grid to every visitor so that an unreachable route can say
     "not found" is the worst version of eager loading there is.

     The chunk arrives only if someone actually visits /projects/*, which in a
     published build is a typo or a stale link. Failure is handled the same way
     as a market chunk: a reload, not a white screen. */
  if (route.name === 'dossier'){
    const token = ++dossierToken;
    import('../projects/dossier/page.js')
      .then(m => { if (token === dossierToken) m.renderDossierPage(app, route.slug, route.tab); })
      .catch(err => {
        if (token !== dossierToken) return;
        console.error('[dossier] shell failed to load:', err);
        app.innerHTML = '';
        renderNotFound(app, { path: '/projects/' + (route.slug || '') });
      });
    return;
  }
  if (route.name === 'home') return void renderHome(app);
  if (route.name === 'investmentLab') return void renderInvestmentLabPage(app);
  if (route.name === 'data') return void renderDataStatus(app);
  if (route.name === 'news') return void renderNewsPage(app);
  renderNotFound(app, route);
}

export function boot(){
  /* Dev-only guard. A market registered with a malformed manifest or an incomplete
     comparison interface should fail loudly at registration, not silently produce a
     wrong number on the home page. Stripped from the production bundle. */
  if (import.meta.env && import.meta.env.DEV){
    const problems = validateRegistry(markets);
    if (problems.length){
      console.warn('[registry] %d problem(s) found:\n%s', problems.length, problems.join('\n'));
    }
  }

  applyTheme();
  setRenderer(render);
  onRouteChange(render);
  startRouter();          // fires an initial notify() → first render
}
