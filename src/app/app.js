/* ---------------------------------------------------------------------------
   Application shell.

   Owns the mount point, the route → page mapping, and the single render entry
   point that every component reaches through requestRender().

   The shell knows about exactly two page kinds: the home cockpit, and "a market".
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
import { renderMarketPage } from '../markets/marketPage.js';
import { marketNav } from '../components/navigation.js';
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
  if (route.name === 'home') return void renderHome(app);
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
