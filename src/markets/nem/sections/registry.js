/* ---------------------------------------------------------------------------
   NEM SECTIONS, FETCHED ONE AT A TIME.

   One entry per section id. Every value is a thunk around a LITERAL specifier,
   which is the only shape Vite can analyse: it emits one chunk per entry and
   resolves it on demand. A registry that imported the modules and stored them
   in an object would look identical here and ship every section to a reader who
   opened the brief — the split would be gone with nothing failing.

   NOTHING IN THIS FILE IMPORTS A SECTION. The only edges are these thunks, so
   the market's dashboard chunk reaches section code only through a call to
   `loadSections`.

   `benchmark` is registered but no tab holds it (`nem/tabs.js` has no entry for
   it, and `markets/tabGroups.js` groups the twelve that exist). That is how the
   single-file version stood too: the section was written, is not routed, and no
   reader can reach it. It is kept registered rather than deleted so that
   registering the tab later is a one-line change, and because deleting content
   is not what a loader refactor is for. The cost of keeping it is one chunk
   that is emitted and never requested — zero bytes on the wire.
   --------------------------------------------------------------------------- */

/** Section id → the module that builds it. Order is the order of tabs.js, then the rest. */
const LOADERS = {
  case:      () => import('./case.js'),
  entry:     () => import('./entry.js'),
  home:      () => import('./overview.js'),
  story:     () => import('./story.js'),
  capacity:  () => import('./capacity.js'),
  energy:    () => import('./energy.js'),
  services:  () => import('./services.js'),
  duration:  () => import('./duration.js'),
  pipeline:  () => import('./pipeline.js'),
  grid:      () => import('./grid.js'),
  benchmark: () => import('./benchmark.js'),
  portfolio: () => import('./portfolio.js'),
  data:      () => import('./methodology.js'),
};

/** id → the section's factory, created once the module has arrived. */
const FACTORIES = new Map();

/** Every section id this market can draw, loaded or not. */
export const SECTION_IDS = Object.keys(LOADERS);

export const isLoaded = (id) => FACTORIES.has(id);

export const loadedIds = () => [...FACTORIES.keys()];

/** The spec for a loaded section. Re-evaluated on every read, as SEC_B was. */
export const sectionSpec = (id) => FACTORIES.get(id)();

/**
 * Fetch and build the sections named, skipping the ones already here.
 *
 * Resolves when every requested section can be drawn. Rejects if one chunk
 * cannot be fetched — the caller decides what a reader sees; see the loading,
 * failure and stale-render states in markets/_shared/engine.js.
 *
 * @param {object} api       the engine's api, captured by each factory
 * @param {string[]} ids     section ids from the route
 */
export async function loadSections(api, ids){
  const wanted = [...new Set(ids)].filter(id => LOADERS[id] && !FACTORIES.has(id));
  await Promise.all(wanted.map(async (id) => {
    const module = await LOADERS[id]();
    /* Two ids could share one module later; the guard keeps that from building
       the same section twice if they resolve together. */
    if (!FACTORIES.has(id)) FACTORIES.set(id, module.create(api));
  }));
}

/**
 * Every section, loaded. The engine never calls this — it is the test seam and
 * the statement of what "all of them" means, so a test can build the whole
 * market without knowing which tab each section sits in.
 */
export const loadAllSections = (api) => loadSections(api, SECTION_IDS);
