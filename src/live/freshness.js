/* ---------------------------------------------------------------------------
   FRESHNESS.

   A live-data feature's real failure mode is not the fetch that fails loudly —
   it is the one that quietly stops and leaves last month's number on screen
   looking exactly like this morning's. Every observed value on this site is
   therefore rendered with its age, and a value past its declared staleness
   window is labelled stale rather than presented as current.

   Each dataset declares `staleAfterHours` in the catalogue, set from how often
   the source actually publishes — four days for ECB (weekends and TARGET
   holidays), three for ENTSO-E, four for the daily market files. A single global
   threshold would either cry stale every Sunday or hide a genuinely dead feed.
   --------------------------------------------------------------------------- */

export const FRESHNESS = {
  FRESH: 'fresh',     // within the intended refresh cadence
  AGING: 'aging',     // past the cadence, inside the staleness window
  STALE: 'stale',     // past the staleness window — do not present as current
  ABSENT: 'absent',   // never published
};

/**
 * Classify a summary's age.
 *
 * @param {object|null} summary
 * @param {number} [now]  epoch ms; injected for tests
 */
export function freshnessOf(summary, now = Date.now()){
  if (!summary || !summary.fetchedAt){
    return { state: FRESHNESS.ABSENT, ageHours: null, label: LABELS[FRESHNESS.ABSENT] };
  }

  const fetched = Date.parse(summary.fetchedAt);
  if (Number.isNaN(fetched)){
    return { state: FRESHNESS.ABSENT, ageHours: null, label: LABELS[FRESHNESS.ABSENT] };
  }

  const ageHours = (now - fetched) / 3_600_000;
  const refresh = summary.refreshHours || 24;
  const staleAfter = summary.staleAfterHours || refresh * 4;

  /* A small grace factor on the refresh cadence. A cron that runs once a
     day will routinely be a day and a few minutes old when a page loads,
     and flagging that as degraded would make the badge meaningless. */
  const state = ageHours <= refresh * 1.5 ? FRESHNESS.FRESH
    : ageHours <= staleAfter ? FRESHNESS.AGING
      : FRESHNESS.STALE;

  return { state, ageHours, label: LABELS[state], fetchedAt: summary.fetchedAt };
}

const LABELS = {
  [FRESHNESS.FRESH]: ['Live', '实时'],
  [FRESHNESS.AGING]: ['Live — overdue', '实时 — 已逾期'],
  [FRESHNESS.STALE]: ['Stale — not current', '过期 — 非当前值'],
  [FRESHNESS.ABSENT]: ['Not published', '未发布'],
};

/** Human age, e.g. "4h ago", "3d ago". */
export function ageLabel(ageHours){
  if (typeof ageHours !== 'number' || !Number.isFinite(ageHours)) return ['—', '—'];
  if (ageHours < 1) return ['just now', '刚刚'];
  if (ageHours < 48){
    const h = Math.round(ageHours);
    return [`${h}h ago`, `${h}小时前`];
  }
  const d = Math.round(ageHours / 24);
  return [`${d}d ago`, `${d}天前`];
}

/**
 * May this value be presented as a current observation?
 *
 * Stale data is still shown — hiding it would leave a reader wondering whether
 * the feed ever worked — but it must not be presented as current, and nothing
 * downstream should treat it as evidence.
 */
export function isPresentableAsCurrent(summary, now = Date.now()){
  const f = freshnessOf(summary, now);
  return f.state === FRESHNESS.FRESH || f.state === FRESHNESS.AGING;
}
