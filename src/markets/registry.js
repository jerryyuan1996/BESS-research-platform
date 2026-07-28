/* ---------------------------------------------------------------------------
   THE MARKET REGISTRY — the canonical list of available markets.

   This file is the ONLY place the application learns that a market exists.
   Everything downstream derives from it:

     market cards · market navigation · market routes · comparison columns ·
     market selectors · the global comparison engine · market counts ·
     supported strategy lists

   Adding a market is: create its directory, import it here, add it to the array.
   Nothing else in the app needs to change. See docs/adding-a-market.md.

   Order matters — it is the display order everywhere, and it is the tie-break
   order for best/worst highlighting in the league table.

   There is no `if (market === 'wa')` anywhere in this codebase. If you are about
   to write one, add a capability flag or a manifest field instead.
   --------------------------------------------------------------------------- */
import wa from './wa/index.js';
import gb from './gb/index.js';
import ie from './ie/index.js';
import ro from './ro/index.js';
import pl from './pl/index.js';
// Three allocation points sharing one Japan research dashboard (dashboardId 'jp').
import jpTokyo from './jp-tokyo/index.js';
import jpKyushu from './jp-kyushu/index.js';
import jpHokkaido from './jp-hokkaido/index.js';

export const markets = [wa, gb, ie, ro, pl, jpTokyo, jpKyushu, jpHokkaido];

// ---- derived lookups -------------------------------------------------------

const byIdMap = new Map(markets.map(m => [m.manifest.id, m]));
const bySlugMap = new Map(markets.map(m => [m.manifest.slug, m]));

export const byId = (id) => byIdMap.get(id) || null;
export const bySlug = (slug) => bySlugMap.get(slug) || null;

export const marketIds = () => markets.map(m => m.manifest.id);
export const marketCount = () => markets.length;

/**
 * Every allocation point. This is what finance comparisons iterate.
 *
 * Tokyo, Kyushu and Hokkaido are three entries here even though they share one
 * research dashboard: for a portfolio they are three different exposures.
 */
export const ALLOCATION_MARKETS = () => markets;

/**
 * One entry per distinct research dashboard.
 *
 * Use for anything that counts *documents* rather than *exposures* — nav rows,
 * bundle management, "how many dashboards are there" copy. The three Japan
 * markets collapse to one entry here.
 */
export const DETAIL_DASHBOARDS = () => {
  const seen = new Set();
  return markets.filter(m => {
    const key = m.manifest.dashboardId || m.manifest.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/** Markets that expose a comparison interface, i.e. can be normalized. */
export const comparableMarkets = () => markets.filter(m => m.comparison);

/** Markets whose normalized inputs are complete enough to enter the engine. */
export const engineReadyMarkets = () => markets.filter(m => m.comparison && m.comparison.engineReady !== false);

/** Markets with a migrated dashboard. The rest render a pending-migration page. */
export const dashboardMarkets = () => markets.filter(m => typeof m.dashboard === 'function');

/** Route path for a market. */
export const marketPath = (market) => '/markets/' + market.manifest.slug;

/**
 * The module that actually renders a market's dashboard.
 *
 * For a market with its own dashboard this is itself. For a regional entry such
 * as jp_tokyo it is the module named by `dashboardId`, which is asked to open in
 * `manifest.region`.
 */
export function dashboardOwner(market){
  const owner = market.manifest.dashboardId;
  if (!owner || owner === market.manifest.id) return market;
  return byId(owner) || market;
}
