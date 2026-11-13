/* ---------------------------------------------------------------------------
   Market dashboard engine for the GB / IE / RO / PL lineage.

   Those four prototype dashboards were generated from one common engine: the
   same 1,039 lines appear byte-identically in all four payloads (the only
   difference is a five-line srcHealth override GB carries and the others do
   not). This module is that engine, extracted once.

   A market in this lineage therefore supplies only data:

       mkt.js       identity, locale, currency, COD years, seed tag
       tabs.js      tab list
       sources.js   source register
       data.js      M — the entire market dataset
       sections.js  buildSections(api) — one declarative block spec per tab

   …and its dashboard.js is four lines. Compare WA, which predates this engine
   and is hand-written per tab; see docs/architecture.md.

   Everything shared with WA — h(), L(), the charts, card/badge/chip/kpi/why,
   the source drawer, theme, language — comes from src/, not from here.
   --------------------------------------------------------------------------- */
import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { app, requestRender } from '../../app/state.js';
import { LS } from '../../utils/storage.js';
import { navigate } from '../../app/router.js';

import { card } from '../../components/card.js';
import { badge, statusBadge as statusBadgeBase } from '../../components/badge.js';
import { chip } from '../../components/chip.js';
import { why } from '../../components/decisionLogic.js';
import { kpi, scoreRows, bandFor, meter } from '../../components/metricCard.js';
import { sectionHead } from '../../components/sectionHeader.js';
import { drawTab } from '../../components/tabSections.js';
import { resolveSegment } from '../tabGroups.js';
import { sourceDrawer, sourceStatusBadge } from '../../components/sourceDrawer.js';
// Charts, card and why are re-exported to market sections through `api`, not used here.
import { renderHeader } from '../../components/header.js';
import { marketNav, tabNav, revenueSubNav, labLink } from '../../components/navigation.js';
import { renderFooter } from '../../components/footer.js';
import { enhanceMarketPage, pairOverviewMap } from '../../components/pageEnhancements.js';
import { gridMapForMarket } from '../gridMapRegistry.js';
import { lineChart, barChart, waterfall, bandChart } from '../../charts/index.js';

import { applySponsorDataset } from '../../comparison/sponsorAssumptions.js';
import { BASE_TEXT } from './text.js';
import { GLOSS_CORE } from './glossary.js';
import { createFormat } from './format.js';
import { createCompute } from './compute.js';
import { createLab } from './lab.js';
import { createDesignFitBlock } from './designFitBlock.js';
import { createBlocks } from './blocks.js';
import { createExports } from './exports.js';
import { researchUnits, pickUnits } from './researchUnits.js';
import { conciseResearchSections, finishConciseResearch } from './conciseResearch.js';

/**
 * @param {object} cfg
 * @param {object} cfg.MKT            identity + locale config
 * @param {Array}  cfg.TABS           [[id, [en, zh]], …]
 * @param {object} cfg.SRC            source register
 * @param {object} cfg.M              market dataset
 * @param {(api:object)=>Function} cfg.buildSections  returns SECTIONS()
 * @param {(api:object, ids:string[])=>Promise<void>} [cfg.prepareSections]
 *        load the sections a route is about to draw, before anything is drawn
 * @param {object} [cfg.textOverrides]  market-specific additions to the shared T
 * @param {(root:HTMLElement)=>void} [cfg.finishResearch] reader presentation after a paint
 */
/** The heading the overview takes when it is stacked under the investment case. */
const OVERVIEW_HEAD = ['Market at a glance', '市场概览'];

/**
 * What a reader sees between "this tab was asked for" and "this tab can be
 * drawn", for a market that fetches its sections on demand.
 *
 * Three bars rather than a spinner, and the same element and classes the
 * market page uses while it waits for a dashboard chunk, so the two waits look
 * like one behaviour. It is appended only after 120 ms: a section already in
 * memory resolves in a microtask, and a skeleton that flashes is worse than no
 * skeleton at all.
 */
function sectionSkeleton(){
  return h('div', {
    class: 'dash-skeleton', 'aria-busy': 'true', 'aria-label': L(['Loading this section', '正在加载本节']),
  }, h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' }), h('div', { class: 'sk-bar' }));
}

/**
 * A section chunk that would not load.
 *
 * The realistic cause is not a network blip: a redeploy replaces hashed file
 * names, and a tab that was open across one asks for bytes that no longer
 * exist. That is recoverable by reloading, and the reader is told so rather
 * than left with a heading and nothing under it.
 */
function renderSectionFailure(main, err){
  console.error('[market] section chunk failed to load:', err);
  main.append(h('div', { class: 'warnbox' }, L([
    'This section could not be loaded. The most likely cause is that the site was updated while this page was open, which replaces the files this tab was going to request. Reloading fixes that.',
    '本节加载失败。最可能的原因是本页打开期间站点已更新，导致本标签页请求的文件已被替换。刷新即可解决。',
  ])));
  main.append(h('div', {}, h('button', { class: 'btn', onclick: () => window.location.reload() },
    L(['Reload the page', '刷新页面']))));
}

export function createMarketEngine(cfg){
  const { MKT, TABS, SRC, buildSections, textOverrides, regions, prepareSections } = cfg;
  const finishResearch = root => { finishConciseResearch(root); cfg.finishResearch?.(root); };

  /* The sponsor's buying position is applied HERE rather than in each market's
     data.js, for the same reason the registry applies it rather than each
     comparison.js: the market file states what the market costs, and this is the
     one boundary where that becomes what we pay. Every dashboard on this engine
     therefore prices equipment and discounts cash flow exactly as the cockpit
     does. See src/comparison/sponsorAssumptions.js. */
  const M = applySponsorDataset(cfg.M);

  const T = Object.assign({}, BASE_TEXT, textOverrides || {});

  /* Regional lens, for markets whose dashboard covers several allocation points.
     `regions` is [[id, [en, zh]], …] with 'compare' first. Absent for every
     single-region market, in which case none of this renders. */
  const REGIONS = Array.isArray(regions) ? regions : null;
  const REGION_IDS = REGIONS ? REGIONS.map(([id]) => id) : [];

  /* ---- market-local state ------------------------------------------------
     The prototype kept lang and theme here, namespaced per market (gb_lang,
     ie_theme, …). They are application state now, exposed as getters so the
     migrated section code reads them unchanged.

     `tab` is an accessor. Section code written for the prototype does
     `state.tab = 'grid'; render();` — with a plain field that would set state
     the router knows nothing about, and the next render would immediately
     overwrite it from the URL. The setter records the intent and render()
     turns it into a navigation, so deep links and the back button keep working
     without touching a line of the migrated code. */
  let tabValue = TABS[0][0];
  let pendingTab = null;
  let basePath = '';
  /* The registry, captured on the first render. See api.marketEntry(). */
  let registry = null;
  /* Which render's section load is still current. See the async boundary in
     dashboard(). */
  let sectionToken = 0;

  let regionValue = REGIONS ? REGIONS[0][0] : null;

  const state = {
    get tab(){ return tabValue; },
    set tab(v){ tabValue = v; pendingTab = v; },

    get region(){ return regionValue; },
    set region(v){ regionValue = v; },

    codYear: LS.get(MKT.ns + '_cod') || MKT.codDefault,
    scores: {},          // editable scorecard overrides, keyed by scorecard id
    lab: null,           // lazily seeded from M.lab on first Investment Lab render

    get lang(){ return app.lang; },
    get theme(){ return app.theme; },
  };

  /* Cards drawn outside the dashboard, under a chapter of the market page
     (researchExcerpt, below). A scorecard or a checklist calls render() when
     the reader changes it. On the dashboard that redraws the page; on a market
     page it would close the disclosure the reader is working in, so each
     excerpt keeps how to repaint itself and render() repaints those while any
     is on screen. The dashboard and the market page are different routes, so
     the two cases never meet. */
  const excerpts = new Set();

  function render(){
    if (pendingTab != null){
      const t = pendingTab;
      pendingTab = null;
      // Preserve the regional lens across a tab change.
      const q = (REGIONS && regionValue === 'compare') ? '?region=compare' : '';
      navigate(basePath + '/' + t + q);   // route change triggers the re-render
      return;
    }
    for (const excerpt of excerpts) if (!excerpt.el.isConnected) excerpts.delete(excerpt);
    if (excerpts.size){ for (const excerpt of excerpts) excerpt.paint(); return; }
    requestRender();
  }

  // ---- wire the engine pieces, in dependency order -----------------------
  const fmt = createFormat(MKT);
  const compute = createCompute({ M, state });

  const ctx = { MKT, TABS, SRC, M, T, state, render, LS, fmt, compute, finishResearch };
  ctx.lab = createLab(ctx);
  ctx.designFit = createDesignFitBlock(ctx);
  ctx.exports = createExports(ctx);
  ctx.blocks = createBlocks(ctx);

  const statusBadge = (live) => statusBadgeBase(live, MKT.seedTag);

  /* Everything a market's sections.js may use. Sections destructure what they
     need; nothing here is market-specific, which is why one engine serves four. */
  const api = {
    h, L, MKT, M, SRC, T, TABS, state, render, GLOSS_CORE,
    card, badge, statusBadge, chip, why, kpi, meter, scoreRows, bandFor,
    sectionHead, sourceDrawer, sourceStatusBadge,
    lineChart, barChart, waterfall, bandChart,
    ...fmt, ...compute, ...ctx.lab, ...ctx.blocks, ...ctx.exports,

    /* Regional helpers. `region()` is a function, not a value, because sections
       are rebuilt on every render and must see the lens selected right now. */
    region: () => regionValue,
    isCompare: () => regionValue === 'compare',
    /* The regions a block should draw: all of them in compare mode, otherwise
       just the selected one. This is what stops compare mode from duplicating a
       national rule three times. */
    lensRegions: () => (regionValue === 'compare' ? REGION_IDS.filter(r => r !== 'compare') : [regionValue]),

    /* This market's own registry entry, resolved at render time.

       A static import of the registry here would close a cycle — the registry
       imports the market, which imports this engine. The registry is already
       handed to dashboard() for the application nav row, so it is captured there
       and matched on slug, which is what basePath is built from. Sections must
       call this rather than caching it: three Japanese allocation markets share
       one dashboard, and the answer changes with the route. */
    marketEntry: () => (registry || []).find(m => basePath === '/markets/' + m.manifest.slug) || null,
  };

  /* A market that splits its sections into chunks says how to fetch them.
     Absent for every market in the synchronous lineage — GB, IE, RO, PL, WA,
     Japan — and then nothing about dashboard() changes: no await is taken, no
     skeleton is inserted and no token is read, because PREPARE is null. */
  const PREPARE = typeof prepareSections === 'function'
    ? (ids) => prepareSections(api, ids)
    : null;

  // Markets supply SECTIONS() as a function so every string re-evaluates per language.
  const SECTIONS = conciseResearchSections(buildSections)(api);

  /** Verbatim from the prototype's renderSection(). */
  function renderSection(spec){
    return function (main){
      if (spec.warn) main.append(h('div', { class: 'warnbox' }, '⚠ ' + L(spec.warn)));
      if (spec.head) sectionHead(main, spec.head, spec.cap);
      ctx.blocks.B(main, spec.blocks);
      finishResearch(main);
    };
  }

  /** COD-year selector — this lineage's page-specific header control. */
  function codYearSelect(){
    return h('select', {
      class: 'btn',
      onchange: (e) => {
        state.codYear = e.target.value;
        LS.set(MKT.ns + '_cod', state.codYear);
        requestRender();
      },
    }, MKT.codYears.map(y => {
      const o = h('option', { value: y }, L(T.codYearLbl) + ': ' + y);
      if (y === state.codYear) o.selected = true;
      return o;
    }));
  }

  /* Regional lens control. Each regional entry is a real allocation market with
     its own URL, so selecting one navigates; "compare" is a view of the market
     you are already on and rides in the query string. */
  function regionSelector(allMarkets){
    if (!REGIONS) return null;
    const owner = MKT.id;
    const slugFor = (rid) => {
      const m = allMarkets.find(x => (x.manifest.dashboardId === owner) && x.manifest.region === rid);
      return m ? '/markets/' + m.manifest.slug : null;
    };
    return h('div', { class: 'seg', style: 'margin:2px 0 14px;' }, REGIONS.map(([rid, label]) => {
      const active = rid === regionValue;
      if (rid === 'compare'){
        return h('button', {
          class: 'btn' + (active ? ' active' : ''),
          onclick: () => { navigate(basePath + '/' + tabValue + '?region=compare'); },
        }, L(label));
      }
      const href = slugFor(rid);
      if (!href) return null;
      return h('a', {
        class: 'btn' + (active ? ' active' : ''),
        href: href + '/' + tabValue,
        style: 'text-decoration:none;',
        onclick: (e) => { e.preventDefault(); navigate(href + '/' + tabValue); },
      }, L(label));
    }));
  }

  /**
   * The market-module dashboard entry point.
   * @param {HTMLElement} container
   * @param {{tabId:string|null, basePath:string, region?:string|null}} route
   * @param {Array} allMarkets  registry, for the application nav row
   *
   * Async only for a market that fetches its sections; for every other market
   * the body runs straight through, as it always did, and the returned promise
   * is resolved by the time the caller sees it. marketPage.js ignores the
   * return value either way.
   */
  async function dashboard(container, route, allMarkets){
    registry = allMarkets;
    basePath = route.basePath;
    /* Where the address lands: one of seven tabs, holding one section or
       several. An old address names a section and resolves to its tab. */
    const where = resolveSegment(TABS, route.tabId, route.subId);
    // Set the backing field directly: reading the route is not a navigation.
    // It holds the SECTION in view, which is what a section's own links set.
    tabValue = where.section || where.sections[0];
    pendingTab = null;

    if (REGIONS){
      regionValue = REGION_IDS.includes(route.region) ? route.region : REGIONS[0][0];
    }

    container.append(renderHeader({
      title: M.title,
      sub: M.sub,
      meta: [
        h('span', {}, h('b', {}, L(T.asOf) + ': '), M.asOf + ' (' + MKT.tzShort + ')'),
        h('span', {}, h('b', {}, L(T.dataDate) + ': '), M.dataDate),
        h('span', {}, L(M.nextMilestone)),
      ],
      controls: [codYearSelect()],
    }));
    container.append(marketNav(allMarkets, route.market ? route.market.manifest.id : MKT.id));
    container.append(tabNav(TABS, tabValue, basePath));
    const revenueNav = revenueSubNav(TABS, tabValue, basePath);
    if (revenueNav) container.append(revenueNav);

    const lens = regionSelector(allMarkets);
    if (lens) container.append(lens);

    container.append(labLink(route.market ? route.market.manifest.id : MKT.id));

    const main = h('div');
    container.append(main);

    /* The footer closes the page on every path, including the two that draw no
       section, so it is built once and appended wherever dashboard() ends. */
    const footerLine = () => renderFooter([
      L(['Model version: ', '模型版本：']) + M.modelVersion + ' · ' + L(MKT.tzNote) + ' · ' + L(M.footerNote),
    ]);

    /* -----------------------------------------------------------------------
       THE ASYNC BOUNDARY.

       Everything above this line is the page's chrome and is drawn from the
       manifest, which every market carries eagerly: a reader who asks for a
       tab sees its header, its tab strip and its market nav immediately. Only
       the sections are fetched, and only the ones this route draws.

       The token guards the third state in the gap. Between the request and the
       resolve the reader may have changed tab, changed language, pressed back
       or opened another market; the engine's state and this container then
       belong to a different page. Drawing then puts the previous route's
       sections under the current address, which is the failure a cache makes
       easy and a test hard to see. The counter makes the check unconditional.

       A PREPARE that throws is a chunk that 404'd — a real case, because a
       redeploy replaces hashed names. It is reported in place, with a reload,
       rather than thrown into the router's console.
       ----------------------------------------------------------------------- */
    if (PREPARE){
      const token = ++sectionToken;
      let pending;
      try { pending = PREPARE(where.sections); }
      catch (err){ renderSectionFailure(main, err); container.append(footerLine()); return; }

      const timer = setTimeout(() => {
        if (token === sectionToken && !main.firstChild) main.append(sectionSkeleton());
      }, 120);

      try { await pending; }
      catch (err){
        clearTimeout(timer);
        if (token !== sectionToken) return;
        renderSectionFailure(main, err);
        container.append(footerLine());
        return;
      }
      clearTimeout(timer);
      if (token !== sectionToken) return;
      main.replaceChildren();
    }

    const S_ = SECTIONS();
    /* summaryPicks reads what has been loaded for this route, not the whole
       market. That is exact for the NEM, where no section outside `home` holds
       an `ic` block and `home` is only drawn on the tab that loads it; the
       investment-case summary, which needs the house view wherever it is shown,
       loads home and story itself before asking. See docs/p1-sections-pilot.md. */
    const picks = summaryPicks(S_);
    /* The orientation is lifted out where the story is split into panels
       (components/pageEnhancements.js), which keys on that card. */
    const shownUpFront = [picks.ic].filter(Boolean);
    drawTab(main, where, {
      basePath, marketId: route.market ? route.market.manifest.id : MKT.id,
      draw: (id, el) => {
        const raw = S_[id];
        const spec = raw?.blocks ? { ...raw, blocks: withoutBlocks(raw.blocks, shownUpFront) } : raw;
        /* The overview has no heading of its own in some markets, because it
           used to be the landing page. Stacked under the investment case it
           needs one, or it has no wrapper for a claim to attach to. */
        renderSection(id === 'home' && !spec.head ? { ...spec, head: OVERVIEW_HEAD } : spec)(el);
      },
      after: (id, el) => { enhanceMarketPage(el, {
        /* The map is paired with the overview, wherever the overview is drawn. */
        overviewMap: id === 'home'
          ? gridMapForMarket(MKT.id, route.market?.manifest.region || (regionValue === 'compare' ? null : regionValue))
          : null,
        marketId: MKT.id, tabId: id,
      }); finishResearch(el); },
    });
    container.append(footerLine());
  }

  // Reuse the full research's own blocks in the investor overview. No copied
  // narrative or stale numeric snapshot is maintained in the overview layer.
  /* The two blocks the market's front page lifts out of this research: the
     house view and the one-minute orientation. The full research leaves them
     out, so a reader who goes deeper does not read them twice. */
  const flatten = blocks => (blocks || []).filter(Boolean).flatMap(b => [b, ...flatten(b.blocks), ...flatten(b.cards)]);
  function summaryPicks(sections) {
    const home = flatten(sections.home?.blocks);
    const ic = home.find(b => b.t === 'ic') || null;
    const house = ic?.text || M.overall?.rationale || home.find(b => b.t === 'band-story')?.text;
    const story = sections.story?.blocks || [];
    const orientation = flatten(story).find(b => b.t === 'card' &&
      /one-minute orientation|一分钟市场定位/i.test((b.title || []).join(' '))) || story.find(b => b.t === 'card') || null;
    /* The card holding the story's history timeline. */
    const history = story.find(b => b.t === 'card' && flatten(b.blocks).some(x => x.t === 'timeline')) || null;
    return { ic, house, orientation, history };
  }
  /* Sections are rebuilt on each read, so a block is matched by what it says, not by identity. */
  const sameBlock = (a, b) => a.t === b.t && JSON.stringify(a.title ?? a.text) === JSON.stringify(b.title ?? b.text);
  /* A section may hold a null where a block is conditional — Ontario's design
     answer, which an ungraded market does not have — so nulls are dropped. */
  const withoutBlocks = (blocks, drop) => blocks && blocks.filter(b => b && !drop.some(d => sameBlock(b, d))).map(b =>
    (b.blocks || b.cards) ? { ...b, ...(b.blocks ? { blocks: withoutBlocks(b.blocks, drop) } : {}), ...(b.cards ? { cards: withoutBlocks(b.cards, drop) } : {}) } : b);

  function researchSummary(container, route, allMarkets) {
    registry = allMarkets;
    basePath = route.basePath;
    if (REGIONS) regionValue = REGION_IDS.includes(route.region) ? route.region : REGIONS[0][0];
    const { house, orientation, history } = summaryPicks(SECTIONS());
    if (house) {
      ctx.blocks.B(container, { t:'card', title:['House view','本方观点'],
        blocks:[{t:'p',text:house}], mt:false });
      /* The grid map from the full research sits beside the house view. */
      pairOverviewMap(container, gridMapForMarket(MKT.id, regionValue));
    }
    /* The orientation always carries how the market developed: the story's
       history timeline, unless the orientation card already holds it. */
    const hasTimeline = b => b.t === 'timeline' || flatten(b.blocks).some(x => x.t === 'timeline');
    const historyBlocks = history && !(orientation && hasTimeline(orientation))
      ? [{ t:'card', title:['How the market developed','市场发展历程'],
           blocks:(history.blocks || []).filter(b => ['band-story','timeline','why'].includes(b.t)) }]
      : [];
    if (orientation || historyBlocks.length) ctx.blocks.B(container, { ...(orientation || { t:'card', blocks:[] }), mt:false,
      title:['One-minute market orientation','一分钟市场定位'],
      blocks:[...((orientation?.blocks) || []), ...historyBlocks] });
    finishResearch(container);
  }

  /* -------------------------------------------------------------------------
     RESEARCH IN CONTEXT: the cards a chapter of the market page asks for.

     Nothing is copied. A pick names a section and, by a phrase of its title,
     the cards wanted from it (src/markets/_shared/researchUnits.js); what comes
     back draws those same specifications with the same renderer and the same
     enhancements the research tab uses, so a chart, a table and a source
     drawer are the ones the tab shows. A section that is not loaded, or a
     phrase that names no card, yields nothing rather than an error: the map is
     held to the research by tests/research-map.test.js, not by the page.

     The caller decides the presentation — which card is open, what heads the
     group — so this returns closures instead of drawing into a container. A
     market whose sections load on demand fetches the picked sections first
     (see its dashboard.js).

     @param route       { basePath, region } as for dashboard()
     @param allMarkets  the registry
     @param picks       [{ section, cards?: string[], rest?: boolean, except?: string[] }]
                        as pickUnits() reads them, in the section's own order
     @returns [{ section, label, head, lead(el), cards: [{ key, title, badges, visual, draw(el) }] }]
     ------------------------------------------------------------------------- */
  function researchExcerpt(route, allMarkets, picks){
    const bind = () => {
      registry = allMarkets;
      basePath = route.basePath;
      if (REGIONS) regionValue = REGION_IDS.includes(route.region) ? route.region : REGIONS[0][0];
    };
    bind();
    for (const excerpt of excerpts) if (!excerpt.el.isConnected) excerpts.delete(excerpt);
    const built = SECTIONS();
    return (picks || []).flatMap(pick => {
      const spec = built[pick.section];
      if (!spec) return [];
      const { lead, units } = researchUnits(spec);
      const chosen = pickUnits(units, pick);
      if (!chosen.length) return [];
      return [{
        section: pick.section,
        label: TABS.find(([id]) => id === pick.section)?.[1] || null,
        head: spec.head || null,
        storyline: pick.section === 'home' ? flatten(spec.blocks).find(b => b?.t === 'band-story')?.text || M.overall?.rationale : null,
        regionalView: pick.section === 'home' && REGIONS ? M.overall?.rationale : null,
        /* The section as its tab opens: warning, heading, caption, the text
           before its first card, and its reviewed claim where it has one. */
        lead: (el) => {
          bind();
          renderSection({ warn: spec.warn, head: spec.head, cap: spec.cap, blocks: lead })(el);
          enhanceMarketPage(el, { marketId: MKT.id, tabId: pick.section });
        },
        cards: chosen.map(unit => ({
          key: unit.key, title: unit.title, badges: unit.badges, visual: unit.visual,
          /* `after(el)` runs on every paint, for a caller that dresses the card. */
          draw: (el, after) => {
            /* Re-read on every paint: sections re-evaluate per language, and an
               interactive block repaints through render() above. */
            const paint = () => {
              bind();
              const now = researchUnits(SECTIONS()[pick.section]).units.find(u => u.key === unit.key);
              el.replaceChildren();
              if (!now) return;
              ctx.blocks.B(el, now.blocks.map((block, i) => (i ? block : { ...block, mt: false })));
              enhanceMarketPage(el);
              finishResearch(el);
              after?.(el);
            };
            excerpts.add({ el, paint });
            paint();
          },
        })),
      }];
    });
  }

  return { state, dashboard, SECTIONS, api, researchSummary, researchExcerpt };
}
