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
import { renderHome } from '../home/homePage.js';
import { renderMarketPage, invalidateMarketRender } from '../markets/marketPage.js';
import { renderDataStatus } from '../live/dataStatusPage.js';
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
      L(['return to the briefing', '返回简报'])), '.'));
}

/* The Returns page's module, once fetched, so a re-render draws at once. */
let returnsPage = null;

let labPage = null;
function renderLab(app){
  if(labPage)return void labPage.renderInvestmentLabPage(app);
  const holder=h('div',{},h('p',{class:'note'},L(['Loading the Investment Lab…','正在加载投资测算…'])));
  app.append(holder);
  import('../home/investmentLabPage.js').then(module=>{
    labPage=module;
    if(!holder.isConnected)return;
    app.innerHTML='';
    module.renderInvestmentLabPage(app);
  }).catch(error=>{
    console.error('[investment-lab] page failed to load:',error);
    if(!holder.isConnected)return;
    app.innerHTML='';
    renderNotFound(app,{path:'/investment-lab'});
  });
}

function renderReturns(app){
  if (returnsPage) return void returnsPage.renderReturnsPage(app);
  const holder = h('div', {},
    h('div', { class: 'hdr' }, h('div', {},
      h('h1', {}, L(['Returns across markets', '跨市场回报对比'])),
      h('div', { class: 'sub' }, L(['Loading the returns view…', '正在加载回报对比…'])))),
    marketNav(markets, 'returns'),
    h('div', { class: 'dash-skeleton', 'aria-busy': 'true', 'aria-label': L(['Loading', '加载中']) },
      h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' })));
  app.append(holder);
  import('../home/returnsPage.js').then(m => {
    returnsPage = m;
    /* Stale if the reader navigated on: the holder is then detached. */
    if (!holder.isConnected) return;
    app.innerHTML = '';
    m.renderReturnsPage(app);
  }).catch(err => {
    console.error('[returns] page failed to load:', err);
    if (!holder.isConnected) return;
    app.innerHTML = '';
    renderNotFound(app, { path: '/returns' });
  });
}

/* The changelog page's module, once fetched. It brings the whole changelog
   with it, which is why it is not in the entry chunk. */
let changesPage = null;

function renderChanges(app, route){
  const filter = { market: route.market, author: route.author };
  if (changesPage) return void changesPage.renderChangesPage(app, filter);
  const holder = h('div', {},
    h('div', { class: 'hdr' }, h('div', {},
      h('h1', {}, L(['What changed, and who changed it', '改了什么，由谁改的'])),
      h('div', { class: 'sub' }, L(['Loading the changelog…', '正在加载变更记录…'])))),
    marketNav(markets, 'changes'),
    h('div', { class: 'dash-skeleton', 'aria-busy': 'true', 'aria-label': L(['Loading', '加载中']) },
      h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' })));
  app.append(holder);
  import('../changes/changesPage.js').then(m => {
    changesPage = m;
    if (!holder.isConnected) return;
    app.innerHTML = '';
    /* The route may have changed its filters while the chunk was in flight. */
    const now = currentRoute();
    m.renderChangesPage(app, now.name === 'changes' ? { market: now.market, author: now.author } : filter);
  }).catch(err => {
    console.error('[changes] page failed to load:', err);
    if (!holder.isConnected) return;
    app.innerHTML = '';
    renderNotFound(app, { path: '/changes' });
  });
}

/* The scouting page's module, once fetched. It brings the scout cards with
   it: the home page carries each card's four calls and no more. */
let scoutPage = null;

function renderScout(app){
  if (scoutPage) return void scoutPage.renderScoutPage(app);
  const holder = h('div', {},
    h('div', { class: 'hdr' }, h('div', {},
      h('h1', {}, L(['Scouting — markets with no dashboard', '观察名单 — 尚无看板的市场'])),
      h('div', { class: 'sub' }, L(['Loading the scouting cards…', '正在加载观察卡片…'])))),
    marketNav(markets, 'scout'),
    h('div', { class: 'dash-skeleton', 'aria-busy': 'true', 'aria-label': L(['Loading', '加载中']) },
      h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' })));
  app.append(holder);
  import('../scout/scoutPage.js').then(m => {
    scoutPage = m;
    if (!holder.isConnected) return;
    app.innerHTML = '';
    m.renderScoutPage(app);
    /* /scout#se opens on that card, once there is a card to open on. */
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
  }).catch(err => {
    console.error('[scout] page failed to load:', err);
    if (!holder.isConnected) return;
    app.innerHTML = '';
    renderNotFound(app, { path: '/scout' });
  });
}

/* The analyst desk's module, once fetched. It brings the whole briefing with
   it, queue and all; the home page carries the briefing less the queue. */
let deskPage = null;

function renderDesk(app){
  if (deskPage) return void deskPage.renderDeskPage(app);
  const holder = h('div', {},
    h('div', { class: 'hdr' }, h('div', {},
      h('h1', {}, L(['The analyst desk', '分析台'])),
      h('div', { class: 'sub' }, L(['Loading the queue…', '正在加载待办…'])))),
    marketNav(markets, 'desk'),
    h('div', { class: 'dash-skeleton', 'aria-busy': 'true', 'aria-label': L(['Loading', '加载中']) },
      h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' })));
  app.append(holder);
  import('../desk/deskPage.js').then(m => {
    deskPage = m;
    if (!holder.isConnected) return;
    app.innerHTML = '';
    m.renderDeskPage(app);
  }).catch(err => {
    console.error('[desk] page failed to load:', err);
    if (!holder.isConnected) return;
    app.innerHTML = '';
    renderNotFound(app, { path: '/desk' });
  });
}

/* Guards a stale dossier render, exactly as marketPage.js guards a stale market
   one: the reader may navigate again before the chunk resolves. */
let dossierToken = 0;

/* /news — the opportunity bell, the policy calendar and the headlines. Its own
   chunk: the trigger records and the feed are read only by a reader who opens it. */
let newsPage = null;
function renderNews(app){
  const token = ++experienceToken;
  if (newsPage) return void newsPage.renderNewsPage(app);
  const holder = h('div', { class: 'ix-container', 'aria-busy': 'true', style: 'padding-top:60px' },
    h('p', {}, L(['Loading industry news…', '正在加载行业新闻…'])));
  app.append(holder);
  import('../news/newsPage.js').then(module => {
    newsPage = module;
    if (token !== experienceToken || !holder.isConnected) return;
    app.replaceChildren();
    module.renderNewsPage(app);
  }).catch(error => {
    if (!holder.isConnected) return;
    console.error('[news]', error);
    holder.replaceChildren(h('p', {}, L(['The page could not be loaded.', '页面未能加载。'])),
      h('button', { class: 'ix-button', onclick: () => window.location.reload() }, L(['Reload', '刷新'])));
  });
}

let experiencePage = null;
let experienceToken = 0;
function renderExperiencePage(app, route, market) {
  const token = ++experienceToken;
  if (experiencePage) return void experiencePage.renderExperience(app, route, market);
  const holder = h('div', { class: 'ix-container', 'aria-busy': 'true', style: 'padding-top:60px' },
    h('p', {}, L(['Loading the investment brief…', '正在加载投资简报…'])));
  app.append(holder);
  import('../experience/pages.js').then(module => {
    experiencePage = module;
    if (token !== experienceToken || !holder.isConnected) return;
    app.replaceChildren();
    module.renderExperience(app, route, market);
  }).catch(error => {
    if (!holder.isConnected) return;
    console.error('[experience]', error);
    holder.replaceChildren(h('p', {}, L(['The page could not be loaded.', '页面未能加载。'])),
      h('button', { class: 'ix-button', onclick: () => window.location.reload() }, L(['Reload', '刷新'])));
  });
}

/** Renders the current route into #app. This is the app's only render entry point. */
export function render(){
  invalidateMarketRender();
  const route = currentRoute();
  document.documentElement.lang = htmlLang();

  const app = $id('app');
  app.innerHTML = '';
  app.classList.toggle('ix-app',['data','investmentLab','changes','scout','desk'].includes(route.name));
  const experience = route.name === 'home' || route.name === 'returns' || (route.name === 'market' && !route.tab && bySlug(route.slug));
  document.body.classList.toggle('ix-experience', Boolean(experience) || ['market','news','data','investmentLab','changes','scout','desk'].includes(route.name));
  document.body.classList.toggle('ix-research', route.name === 'market' && Boolean(route.tab));
  ++experienceToken;
  if (experience) {
    const market = route.name === 'market' ? bySlug(route.slug) : null;
    document.title = L(['Global BESS', '全球储能']) + ' | ' + (market ? L(market.manifest.name) : route.name === 'returns' ? L(['Global opportunities', '全球投资机会']) : L(['Investment brief', '投资简报']));
    return void renderExperiencePage(app, route, market);
  }

  if (route.name === 'news'){
    document.title = L(['Global BESS', '全球储能']) + ' | ' + L(['Industry news', '行业新闻']);
    return void renderNews(app);
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
  /* The old home page. Fetched on demand now that the home page no longer
     shows it: the league table, the globe and the engine's charts are a large
     share of what the entry chunk used to carry, and a reader who came for a
     verdict or a market never needs them. */
  if (route.name === 'returns') return void renderReturns(app);
  if (route.name === 'changes') return void renderChanges(app, route);
  if (route.name === 'scout') return void renderScout(app);
  if (route.name === 'desk') return void renderDesk(app);
  if (route.name === 'investmentLab') return void renderLab(app);
  if (route.name === 'data') return void renderDataStatus(app);
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
