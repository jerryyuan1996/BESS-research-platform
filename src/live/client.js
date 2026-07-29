/* ---------------------------------------------------------------------------
   LIVE SNAPSHOT CLIENT.

   Loads the summary files the ETL publishes. Three rules shape this module, and
   all three exist because this is a static research site with no backend:

   1. ABSENCE IS NORMAL. A snapshot may not exist — the pipeline has never run,
      a source was down, a credential expired, or the site was deployed from a
      branch with no data. Every function here resolves to null rather than
      throwing, and every caller renders the seed value it already had. The site
      must be completely usable with zero data files present, because on day one
      that is exactly the situation.

   2. NOTHING BLOCKS FIRST RENDER. Live data arrives after the page is drawn and
      patches itself in. A research dashboard that shows nothing until a fetch
      completes is worse than one that shows its seed figures immediately.

   3. LIVE DATA NEVER REPLACES AN ASSUMPTION. It is displayed ALONGSIDE the
      approved value, labelled as an observation. The engine keeps computing from
      the analyst's numbers. See src/governance/authority.js.

   Requests are deduplicated by dataset id: several components asking for the
   same market's prices in one render share a single fetch.
   --------------------------------------------------------------------------- */
import { DATASETS, summaryPath, datasetsForMarket, globalDatasets } from '../governance/datasets.js';

/** In-flight and settled requests, keyed by dataset id. */
const cache = new Map();

/** Set false to disable all network access — used by tests and by --no-live. */
let enabled = true;

export function setLiveDataEnabled(v){
  enabled = Boolean(v);
  if (!enabled) cache.clear();
}

export function isLiveDataEnabled(){
  return enabled;
}

/**
 * Load one dataset summary. Resolves to the summary object, or null.
 *
 * Never rejects. A caller that has to write `.catch(() => null)` around every
 * call will eventually forget once, and the failure mode is a blank dashboard.
 */
export function loadSummary(datasetId){
  if (!enabled) return Promise.resolve(null);
  if (cache.has(datasetId)) return cache.get(datasetId);

  const p = fetch(summaryPath(datasetId), { cache: 'no-cache' })
    .then(res => {
      // A 404 is the expected shape of "not published yet", not an error worth
      // logging on every page view.
      if (!res.ok) return null;
      return res.json();
    })
    .then(json => {
      if (!json || typeof json !== 'object') return null;
      // Guard against a stray HTML error page parsed as JSON, and against a
      // future schema the running build does not understand.
      if (json.datasetId !== datasetId) return null;
      if (json.schemaVersion !== 1) return null;
      return json;
    })
    .catch(() => null);

  cache.set(datasetId, p);
  return p;
}

/** Every dataset for one market. Resolves to an array, possibly empty. */
export async function loadMarketData(marketId){
  const sets = datasetsForMarket(marketId);
  const loaded = await Promise.all(sets.map(d => loadSummary(d.id)));
  return loaded.filter(Boolean);
}

/** The first available dataset for a market, or null. */
export async function loadPrimaryMarketData(marketId){
  const all = await loadMarketData(marketId);
  return all[0] ?? null;
}

/** Global (non-market) datasets — FX today. */
export async function loadGlobalData(){
  const loaded = await Promise.all(globalDatasets().map(d => loadSummary(d.id)));
  return loaded.filter(Boolean);
}

/** The FX snapshot, or null. */
export async function loadFx(){
  const summary = await loadSummary('fx-ecb');
  // FX carries its rates on the full snapshot's derived block, which the
  // summary copies verbatim.
  return summary?.derived ? summary : null;
}

/** Everything, for the data-status page. */
export async function loadAll(){
  const loaded = await Promise.all(DATASETS.map(async d => ({
    dataset: d,
    summary: await loadSummary(d.id),
  })));
  return loaded;
}

/**
 * Fire-and-forget helper for render functions.
 *
 * Renders synchronously with whatever is already cached, then re-renders when
 * the fetch settles. Callers pass a node-patching callback rather than
 * re-rendering the page, so a slow network cannot fight with user interaction.
 */
export function whenLoaded(datasetId, apply){
  const p = loadSummary(datasetId);
  p.then(summary => { if (summary) { try { apply(summary); } catch { /* a UI patch must never break the page */ } } });
  return p;
}
