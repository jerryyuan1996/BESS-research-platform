/* ---------------------------------------------------------------------------
   Application shell.

   Owns the mount point, the route → page mapping, and the single render entry
   point that every component reaches through requestRender().

   The shell knows about the home page, Returns, the Lab, and market or status pages.
   It resolves a market by slug from the registry — there is no switch on market
   id anywhere in the app.
   --------------------------------------------------------------------------- */
import { $id, h } from '../utils/dom.js';
import { L, htmlLang } from './i18n.js';
import { setRenderer } from './state.js';
import { applyTheme } from './theme.js';
import { currentRoute, onRouteChange, startRouter, navigate } from './router.js';
import { markets, bySlug } from '../markets/registry.js';
import { renderMarketPage, invalidateMarketRender } from '../markets/marketPage.js';
import { renderDataStatus } from '../live/dataStatusPage.js';
import { resourcePage, RESOURCE_TITLES } from '../experience/chrome.js';
import { validateRegistry } from '../utils/validation.js';
import { navigationFocus } from './navigationFocus.js';

function renderNotFound(app, route){
  const main = resourcePage(app, { title: ['Page not found', '页面不存在'], sub: route.path });
  main.append(h('p', {}, L(['That route does not exist. ', '该路由不存在。']),
    h('a', { href: '/', onclick: event => { event.preventDefault(); navigate('/'); } },
      L(['Return to the investment brief', '返回投资简报']))));
}

const resourceLoaders = {
  data: () => import('../live/dataConventions.js').then(({ investmentConventions }) => ({
    renderDataStatus: app => renderDataStatus(app, investmentConventions),
  })),
  changes: () => import('../changes/changesPage.js'),
  scout: () => import('../scout/scoutPage.js'),
  desk: () => import('../desk/deskPage.js'),
  investmentLab: () => import('../home/investmentLabPage.js'),
};
const resourceRenderers = { data: 'renderDataStatus', changes: 'renderChangesPage', scout: 'renderScoutPage',
  desk: 'renderDeskPage', investmentLab: 'renderInvestmentLabPage' };
const resourceModules = new Map();
function renderResource(app, route) {
  const draw = module => module[resourceRenderers[route.name]](app, { market: route.market, author: route.author });
  if (resourceModules.has(route.name)) return draw(resourceModules.get(route.name));
  const holder = resourcePage(app, { page: route.name, busy: true });
  holder.append(h('p', { role: 'status' }, L(['Loading…', '正在加载…'])));
  resourceLoaders[route.name]().then(module => {
    resourceModules.set(route.name, module);
    if (!holder.isConnected) return;
    app.replaceChildren();
    draw(module);
  }).catch(error => pageLoadFailure(holder, error, route.name));
}

/* Guards a stale dossier render, exactly as marketPage.js guards a stale market
   one: the reader may navigate again before the chunk resolves. */
let dossierToken = 0;

function pageLoadFailure(holder,error,page){
  if(!holder.isConnected)return;
  console.error(`[${page}]`,error);
  holder.removeAttribute('aria-busy');
  holder.replaceChildren(h('h1',{tabindex:-1},L(['The page could not be loaded.','页面未能加载。'])),
    h('button',{class:'ix-button',onclick:()=>window.location.reload()},L(['Reload','刷新'])));
}

// Shared lazy-page boundary: discard stale renders and offer one reload path.
function loadExperiencePage(app,load,draw,page){
  const token=experienceToken;
  const holder=h('main',{id:'ix-main',class:'ix-container','aria-busy':'true',style:'padding-top:60px'},h('p',{},L(['Loading','加载中'])));
  app.append(holder);
  load().then(module=>{
    if(token!==experienceToken||!holder.isConnected)return;
    app.replaceChildren();draw(module);
  }).catch(error=>pageLoadFailure(holder,error,page));
}

let experiencePage=null;
let experienceToken=0;
function renderExperiencePage(app,route,market){
  ++experienceToken;
  if(experiencePage)return void experiencePage.renderExperience(app,route,market);
  loadExperiencePage(app,()=>import('../experience/pages.js'),module=>{
    experiencePage=module;module.renderExperience(app,route,market);
  },'experience');
}

function renderPolicy(app,route,market=null){
  loadExperiencePage(app,()=>import('../policy/page.js'),module=>module.renderPolicyPage(app,{route,market,markets}),'policy');
}

/** Renders the current route into #app. This is the app's only render entry point. */
export function render(){
  ++dossierToken;
  invalidateMarketRender();
  const route = currentRoute();
  if (route.name === 'news') {
    const params = new URLSearchParams(location.search);
    if (!params.has('type')) params.set('type', 'news');
    history.replaceState(history.state, '', `/policy?${params}${location.hash === '#headlines' ? '#radar' : location.hash}`);
    route.name = 'policy'; route.kind = 'radar';
  }
  if (route.name === 'market' && bySlug(route.slug) && ['grid','entry','revenue','rcm','capacity','energy','fcess','services','duration'].includes(route.tab)) {
    route.research = { kind: ['grid','entry'].includes(route.tab) ? 'grid' : 'revenue', section: route.sub || (route.tab === 'revenue' ? '' : route.tab) };
    route.tab = null;
  }
  document.documentElement.lang = htmlLang();
  const title = RESOURCE_TITLES[route.name] || (route.name === 'market' ? bySlug(route.slug)?.manifest.name : {
    home: ['Investment brief', '投资简报'], returns: ['Global opportunities', '全球投资机会'],
    policy: ['Policy & industry intelligence', '政策与行业情报'],
  }[route.name]) || ['Page not found', '页面不存在'];
  document.title = `${L(['Global BESS', '全球储能'])} | ${L(title)}`;

  const app = $id('app');
  app.innerHTML = '';
  /* A market's tab route is a research page and carries `.ix-app`, which takes
     the padding and the max-width off #app (styles/experience.css). Setting it
     here — on the frame the container is emptied, before any of the page's own
     content exists — is what stops it being set later, under 800 px of finished
     dashboard, where the width change is a layout shift (0.042 on the GB grid
     page before Phase A3). The same condition the research shell below uses. */
  app.classList.toggle('ix-app', ['data','investmentLab','changes','scout','desk','policy'].includes(route.name)
    || (route.name === 'market' && Boolean(route.tab)));
  const experience = route.name === 'home' || route.name === 'returns' || (route.name === 'market' && !route.tab && bySlug(route.slug));
  document.body.classList.toggle('ix-experience', Boolean(experience) || ['market','news','data','investmentLab','changes','scout','desk','policy'].includes(route.name));
  document.body.classList.toggle('ix-research', route.name === 'market' && Boolean(route.tab));
  ++experienceToken;
  if(route.name==='policy'){
    return renderPolicy(app,route);
  }
  if(route.name==='market'&&route.tab==='policy'){
    const market=bySlug(route.slug);
    if(market)return renderPolicy(app,route,market);
  }
  if (experience) {
    const market = route.name === 'market' ? bySlug(route.slug) : null;
    document.title = L(['Global BESS', '全球储能']) + ' | ' + (market ? L(market.manifest.name) : route.name === 'returns' ? L(['Global opportunities', '全球投资机会']) : L(['Investment brief', '投资简报']));
    return void renderExperiencePage(app, route, market);
  }

  if (route.name === 'market'){
    const market = bySlug(route.slug);
    if (market) return void renderMarketPage(app, market, route.tab, route.region, route.sub);
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
    const token = dossierToken;
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
  if (resourceLoaders[route.name]) return void renderResource(app, route);
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
  const focus = navigationFocus($id('app'));
  setRenderer(options => {
    if (options?.focus === 'language') focus.begin('language');
    render();
  });
  onRouteChange(() => { focus.begin(); render(); });
  startRouter();          // fires an initial notify() → first render
}
