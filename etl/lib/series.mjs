/* ---------------------------------------------------------------------------
   ROLLING-WINDOW SERIES MAINTENANCE.

   Snapshots hold a trailing window — twelve months by default — and connectors
   maintain it incrementally rather than re-downloading it every run.

   This is not only an optimisation. Several of these sources publish one file
   per trading day; a naive connector that rebuilt a year of history every six
   hours would issue about fifteen hundred requests a run against a public
   regulator's server, four times a day, forever. That is the kind of behaviour
   that gets an IP blocked and deserves to be. Incremental merge asks each source
   only for what the snapshot does not already have.

   The merge is idempotent and last-write-wins on timestamp collision, because
   markets restate. A provisional price is republished as final hours later, and
   the correct behaviour is to take the newer value rather than keeping the first
   one seen or ending up with both.
   --------------------------------------------------------------------------- */

/** Default trailing window. Trailing twelve months matches how the market
    dashboards already describe their revenue figures ("TTM to Apr 2026"). */
export const WINDOW_DAYS = 365;

/** Never fetch more than this many backfill days in one run. Keeps a cold start
    polite: the window fills over several runs instead of one long burst. */
export const MAX_BACKFILL_PER_RUN = 45;

/**
 * Merge new points into an existing series, de-duplicate by timestamp, sort, and
 * trim to the trailing window.
 *
 * @param {Array} existing  points already in the snapshot ({t, v})
 * @param {Array} incoming  freshly fetched points
 * @param {object} [opts]
 * @param {number} [opts.windowDays]
 * @param {string} [opts.now]  ISO instant; injected so tests are deterministic
 * @returns {Array} the merged series
 */
export function mergeSeries(existing, incoming, opts = {}){
  const { windowDays = WINDOW_DAYS, now } = opts;

  const byTime = new Map();
  for (const p of (Array.isArray(existing) ? existing : [])){
    if (!p || typeof p.v !== 'number' || Number.isNaN(Date.parse(p.t))) continue;
    byTime.set(Date.parse(p.t), p);
  }
  // Incoming second, so a restated value replaces the one already held.
  for (const p of (Array.isArray(incoming) ? incoming : [])){
    if (!p || typeof p.v !== 'number' || Number.isNaN(Date.parse(p.t))) continue;
    byTime.set(Date.parse(p.t), p);
  }

  const cutoff = (now ? Date.parse(now) : Date.now()) - windowDays * 86400_000;

  return [...byTime.entries()]
    .filter(([ms]) => ms >= cutoff)
    .sort((a, b) => a[0] - b[0])
    .map(([, p]) => p);
}

/** Local calendar dates (YYYY-MM-DD, UTC) already covered by a series. */
export function coveredDays(series){
  const days = new Set();
  for (const p of (Array.isArray(series) ? series : [])){
    const ms = Date.parse(p?.t);
    if (!Number.isNaN(ms)) days.add(new Date(ms).toISOString().slice(0, 10));
  }
  return days;
}

/**
 * Which days a connector still needs, most recent first.
 *
 * Recent-first matters: if the backfill cap truncates the list, the snapshot
 * gains the days a reader is most likely to care about rather than filling in
 * ancient history while last week stays missing.
 */
export function missingDays(series, { windowDays = WINDOW_DAYS, maxDays = MAX_BACKFILL_PER_RUN, now } = {}){
  const have = coveredDays(series);
  const end = now ? new Date(now) : new Date();
  const out = [];

  // Start one day back: today's file is usually incomplete or absent.
  for (let i = 1; i <= windowDays && out.length < maxDays; i++){
    const d = new Date(end.getTime() - i * 86400_000).toISOString().slice(0, 10);
    if (!have.has(d)) out.push(d);
  }
  return out;
}

/** Coverage block for the snapshot envelope. */
export function coverageOf(series, resolution){
  if (!Array.isArray(series) || series.length === 0){
    return { from: null, to: null, resolution, points: 0 };
  }
  return {
    from: series[0].t,
    to: series[series.length - 1].t,
    resolution,
    points: series.length,
  };
}
