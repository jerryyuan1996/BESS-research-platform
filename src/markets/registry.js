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
import { decisionProfileForMarket } from './decisionProfiles.js';
import wa from './wa/index.js';
import gb from './gb/index.js';
import ie from './ie/index.js';
import ro from './ro/index.js';
import pl from './pl/index.js';
// Three allocation points sharing one Japan research dashboard (dashboardId 'jp').
import jpTokyo from './jp-tokyo/index.js';
import jpKyushu from './jp-kyushu/index.js';
import jpHokkaido from './jp-hokkaido/index.js';
// Added in the 2026-08 round. NEM is Australia's other market: energy-only,
// against WA's capacity-paying WEM.
import nem from './nem/index.js';
import de from './de/index.js';
import it from './it/index.js';
/* The 2026-08 US round. CAISO, ERCOT and PJM are three separate allocation
   markets with three separate dashboards, not one country with three regional
   lenses like Japan: they share a federal tax and tariff layer and almost
   nothing else. PJM pays for capacity through an auction, CAISO through
   bilateral Resource Adequacy, and ERCOT does not pay for capacity at all —
   which is the single question this platform's comparison engine cares about
   most, and they give three different answers to it.

   Appended rather than inserted. Registry order is the tie-break order for
   best/worst highlighting in the league table, so adding to the end is the
   change that moves the fewest existing published outputs. */
import pjm from './pjm/index.js';
import ercot from './ercot/index.js';
import caiso from './caiso/index.js';
/* Finland, added in the 2026-08 round. Appended, like the US markets, because
   registry order is the tie-break for best/worst highlighting in the league
   table. It registers with engineReady:false — see fi/comparison.js — so it
   appears on the cards, in the nav and on the map while staying out of every
   numeric comparison until its reserve revenue line is evidenced. */
import fi from './fi/index.js';
/* Ontario, registered 2026-10-23 on the analyst's sign-off of
   docs/ontario-registration-plan.md. Appended for the same reason as Finland. */
import caOn from './ca_on/index.js';
/* Saudi Arabia and Spain, registered 2026-10-29 on the analyst's sign-off of
   docs/saudi-registration-plan.md and docs/spain-registration-plan.md.
   Saudi Arabia is engine-withheld, as Finland once was: SPPC's price is
   unpublished. */
import sa from './sa/index.js';
import es from './es/index.js';
import { applySponsorAssumptions } from '../comparison/sponsorAssumptions.js';

const registeredMarkets = [wa, nem, gb, de, it, ie, ro, pl, jpTokyo, jpKyushu, jpHokkaido, pjm, ercot, caiso, fi, caOn, sa, es];

/* Decision metadata is a comparison concern shared by every global component.
   Attach it once at registration without mutating the market module, so detail
   dashboards remain the authority for their own facts and renderers. */
export const markets = registeredMarkets.map(market => applySponsorAssumptions({
  ...market,
  comparison: market.comparison
    ? { ...market.comparison, refinement: decisionProfileForMarket(market.manifest.id) }
    : market.comparison,
}));
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

/**
 * Markets with a migrated dashboard. The rest render a pending-migration page.
 *
 * Two shapes count, and the difference is only about WHEN the code arrives:
 *
 *   dashboard      a synchronous renderer, in the main bundle
 *   loadDashboard  a function returning a promise for that renderer
 *
 * A market that has neither has not been migrated. See hasDashboard().
 */
export const dashboardMarkets = () => markets.filter(hasDashboard);

/** True when a market can render a dashboard, eagerly or on demand. */
export const hasDashboard = (market) =>
  typeof market?.dashboard === 'function' || typeof market?.loadDashboard === 'function';

/**
 * Resolves a market's dashboard renderer, loading its chunk if needed.
 *
 * Always async, even for a market whose renderer is already in the bundle, so
 * the caller has ONE path to get right rather than two. A caller that sometimes
 * awaits and sometimes does not is a caller that will eventually render a market
 * page into a container the router has already moved on from.
 *
 * Resolves to null when the market has no dashboard at all — the
 * pending-migration case, which is not an error.
 *
 * @param {object} market  an allocation point, not necessarily the owner
 * @returns {Promise<Function|null>}
 */
export async function resolveDashboard(market){
  const owner = dashboardOwner(market);
  if (typeof owner.dashboard === 'function') return owner.dashboard;
  if (typeof owner.loadDashboard === 'function') return owner.loadDashboard();
  return null;
}

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
