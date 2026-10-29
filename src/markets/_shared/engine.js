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
import { enhanceMarketPage } from '../../components/pageEnhancements.js';
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

/**
 * @param {object} cfg
 * @param {object} cfg.MKT            identity + locale config
 * @param {Array}  cfg.TABS           [[id, [en, zh]], …]
 * @param {object} cfg.SRC            source register
 * @param {object} cfg.M              market dataset
 * @param {(api:object)=>Function} cfg.buildSections  returns SECTIONS()
 * @param {object} [cfg.textOverrides]  market-specific additions to the shared T
 */
/** The heading the overview takes when it is stacked under the investment case. */
const OVERVIEW_HEAD = ['Market at a glance', '市场概览'];

export function createMarketEngine(cfg){
  const { MKT, TABS, SRC, buildSections, textOverrides, regions } = cfg;

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

  function render(){
    if (pendingTab != null){
      const t = pendingTab;
      pendingTab = null;
      // Preserve the regional lens across a tab change.
      const q = (REGIONS && regionValue === 'compare') ? '?region=compare' : '';
      navigate(basePath + '/' + t + q);   // route change triggers the re-render
      return;
    }
    requestRender();
  }

  // ---- wire the engine pieces, in dependency order -----------------------
  const fmt = createFormat(MKT);
  const compute = createCompute({ M, state });

  const ctx = { MKT, TABS, SRC, M, T, state, render, LS, fmt, compute };
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

  // Markets supply SECTIONS() as a function so every string re-evaluates per language.
  const SECTIONS = buildSections(api);

  /** Verbatim from the prototype's renderSection(). */
  function renderSection(spec){
    return function (main){
      if (spec.warn) main.append(h('div', { class: 'warnbox' }, '⚠ ' + L(spec.warn)));
      if (spec.head) sectionHead(main, spec.head, spec.cap);
      ctx.blocks.B(main, spec.blocks);
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
   */
  function dashboard(container, route, allMarkets){
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

    const S_ = SECTIONS();
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
      after: (id, el) => enhanceMarketPage(el, {
        /* The map is paired with the overview, wherever the overview is drawn. */
        overviewMap: id === 'home'
          ? gridMapForMarket(MKT.id, route.market?.manifest.region || (regionValue === 'compare' ? null : regionValue))
          : null,
        marketId: MKT.id, tabId: id,
      }),
    });
    container.append(renderFooter([
      L(['Model version: ', '模型版本：']) + M.modelVersion + ' · ' + L(MKT.tzNote) + ' · ' + L(M.footerNote),
    ]));
  }

  // Reuse the full research's own blocks in the investor overview. No copied
  // narrative or stale numeric snapshot is maintained in the overview layer.
  /* The two blocks the market's front page lifts out of this research: the
     house view and the one-minute orientation. The full research leaves them
     out, so a reader who goes deeper does not read them twice. */
  const flatten = blocks => (blocks || []).flatMap(b => [b, ...flatten(b.blocks), ...flatten(b.cards)]);
  function summaryPicks(sections) {
    const home = flatten(sections.home?.blocks);
    const ic = home.find(b => b.t === 'ic') || null;
    const house = ic?.text || M.overall?.rationale || home.find(b => b.t === 'band-story')?.text;
    const story = sections.story?.blocks || [];
    const orientation = flatten(story).find(b => b.t === 'card' &&
      /one-minute orientation|一分钟市场定位/i.test((b.title || []).join(' '))) || story.find(b => b.t === 'card') || null;
    return { ic, house, orientation };
  }
  /* Sections are rebuilt on each read, so a block is matched by what it says, not by identity. */
  const sameBlock = (a, b) => a.t === b.t && JSON.stringify(a.title ?? a.text) === JSON.stringify(b.title ?? b.text);
  const withoutBlocks = (blocks, drop) => blocks && blocks.filter(b => !drop.some(d => sameBlock(b, d))).map(b =>
    (b.blocks || b.cards) ? { ...b, ...(b.blocks ? { blocks: withoutBlocks(b.blocks, drop) } : {}), ...(b.cards ? { cards: withoutBlocks(b.cards, drop) } : {}) } : b);

  function researchSummary(container, route, allMarkets) {
    registry = allMarkets;
    basePath = route.basePath;
    if (REGIONS) regionValue = REGION_IDS.includes(route.region) ? route.region : REGIONS[0][0];
    const { house, orientation } = summaryPicks(SECTIONS());
    if (house) ctx.blocks.B(container, { t:'card', title:['House view','本方观点'],
      blocks:[{t:'p',text:house}], mt:false });
    if (orientation) ctx.blocks.B(container, { ...orientation, mt:false,
      title:['One-minute market orientation','一分钟市场定位'] });
  }
  return { state, dashboard, SECTIONS, api, researchSummary };
}
