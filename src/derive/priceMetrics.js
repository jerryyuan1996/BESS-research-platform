/* ---------------------------------------------------------------------------
   DERIVED PRICE METRICS.

   Pure, deterministic functions from an observed price series to the statistics
   a storage investor actually reads. No DOM, no I/O, no clock — the same input
   always produces the same output, which is what lets these publish
   automatically and be pinned by tests.

   Layering matches comparison/: arithmetic over a data contract, importable by
   both the browser app and the Node ETL.

   The series contract, produced by every connector:

       [ { t: '2026-07-28T13:30:00Z', v: 84.21 }, … ]

       t   ISO instant, UTC, chronologically ordered
       v   price in the units declared on the snapshot envelope

   Local time matters here. A "daily" spread means a spread within the market's
   own trading day, so every function that groups by day takes an IANA timezone
   and groups by local calendar date. Grouping a Japanese market by UTC days
   would split each local day across two buckets and understate every spread —
   silently, and by an amount that looks plausible.
   --------------------------------------------------------------------------- */

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** Clean a raw series: drop malformed points, keep chronological order. */
export function cleanSeries(series){
  if (!Array.isArray(series)) return [];
  return series
    .filter(p => p && isNum(p.v) && !Number.isNaN(Date.parse(p.t)))
    .map(p => ({ t: p.t, v: p.v, ms: Date.parse(p.t) }))
    .sort((a, b) => a.ms - b.ms);
}

/**
 * Local calendar date (YYYY-MM-DD) for an instant, in a given IANA zone.
 * Uses Intl rather than manual offset arithmetic so daylight saving is handled
 * by the platform's tz database instead of by assumption.
 */
export function localDate(ms, timezone){
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date(ms));
  } catch {
    // Unknown zone — fall back to UTC rather than throwing. A metric computed on
    // UTC days is wrong-ish; a crashed ETL run publishes nothing at all.
    return new Date(ms).toISOString().slice(0, 10);
  }
}

/** Group a cleaned series into local trading days. */
export function groupByLocalDay(clean, timezone){
  const days = new Map();
  for (const p of clean){
    const d = localDate(p.ms, timezone);
    if (!days.has(d)) days.set(d, []);
    days.get(d).push(p);
  }
  return days;
}

export function mean(values){
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values){
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function stdev(values){
  if (values.length < 2) return null;
  const m = mean(values);
  const v = values.reduce((a, x) => a + (x - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(v);
}

/** Percentile by linear interpolation. `p` in [0, 1]. */
export function percentile(values, p){
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const idx = (s.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return s[lo];
  return s[lo] + (s[hi] - s[lo]) * (idx - lo);
}

/**
 * The core storage metric: the spread a battery of a given duration could
 * capture within one trading day under perfect foresight.
 *
 * For a `durationHours` battery, the achievable trade is not (max − min) — that
 * is a single settlement period and a 2-hour battery cannot discharge its whole
 * energy into it. It is the mean of the highest `durationHours` of the day minus
 * the mean of the lowest `durationHours`. Using max − min instead overstates the
 * opportunity, and overstates it most in exactly the volatile markets where the
 * error matters.
 *
 * @param {Array} dayPoints   points within one local day
 * @param {number} durationHours
 * @param {number} pointsPerHour  settlement periods per hour (2 for half-hourly)
 * @returns {number|null} spread in the series' price units
 */
export function dailySpread(dayPoints, durationHours, pointsPerHour){
  const d = dailySpreadDetail(dayPoints, durationHours, pointsPerHour);
  return d ? d.spread : null;
}

/**
 * As `dailySpread`, but returns the two price LEVELS as well as their difference.
 *
 * The levels are needed, not optional. Round-trip efficiency does not act on the
 * spread — it acts on the charge leg, because the battery must buy 1/η MWh for
 * every 1 MWh it sells. The correct margin is
 *
 *     duration × (dischargeMean − chargeMean / η)
 *
 * which is not `duration × spread × η` and differs from it by more the higher
 * the absolute price level. Returning only the difference would make the honest
 * calculation impossible downstream.
 *
 * @returns {{spread:number, dischargeMean:number, chargeMean:number}|null}
 */
export function dailySpreadDetail(dayPoints, durationHours, pointsPerHour){
  const n = Math.max(1, Math.round(durationHours * pointsPerHour));
  if (dayPoints.length < n * 2) return null;   // cannot both charge and discharge

  const sorted = [...dayPoints].map(p => p.v).sort((a, b) => a - b);
  const chargeMean = mean(sorted.slice(0, n));
  const dischargeMean = mean(sorted.slice(-n));
  return { spread: dischargeMean - chargeMean, dischargeMean, chargeMean };
}

/**
 * Infer settlement periods per hour from the observed timestamps.
 *
 * Inferred rather than declared because sources change resolution — GB moved
 * parts of its reporting from half-hourly to hourly, and a hardcoded 2 would
 * have halved every subsequent spread without any error surfacing. The modal
 * gap is used rather than the mean so that clock changes and gaps do not skew it.
 */
export function inferPointsPerHour(clean){
  if (clean.length < 3) return 1;
  const gaps = new Map();
  for (let i = 1; i < clean.length; i++){
    const gapMin = Math.round((clean[i].ms - clean[i - 1].ms) / 60000);
    if (gapMin <= 0 || gapMin > 24 * 60) continue;
    gaps.set(gapMin, (gaps.get(gapMin) || 0) + 1);
  }
  if (gaps.size === 0) return 1;
  const modal = [...gaps.entries()].sort((a, b) => b[1] - a[1])[0][0];
  return Math.max(1, Math.round(60 / modal));
}

/**
 * Full derived metric set for one observed series.
 *
 * Every value is either a number or null. Null means "not computable from this
 * data" and is carried through to the UI as such — never coerced to zero, for
 * the same reason the comparison engine refuses to: zero is a claim, absence is
 * not.
 *
 * @param {Array} series          raw snapshot series
 * @param {object} opts
 * @param {string} opts.timezone      IANA zone for the market's trading day
 * @param {number} opts.durationHours the archetype's storage duration
 * @returns {object} derived metrics
 */
export function derivePriceMetrics(series, { timezone, durationHours }){
  const clean = cleanSeries(series);
  if (clean.length === 0){
    return {
      points: 0, coverageDays: 0, pointsPerHour: null,
      mean: null, median: null, stdev: null,
      p5: null, p95: null, negativeHoursPct: null,
      spreadMean: null, spreadMedian: null, spreadP25: null, spreadP75: null,
      spreadDays: 0, chargeMean: null, dischargeMean: null,
      durationHours, timezone,
    };
  }

  const values = clean.map(p => p.v);
  const pointsPerHour = inferPointsPerHour(clean);
  const days = groupByLocalDay(clean, timezone);

  // Partial days at either end of the window would understate their spread, so
  // they are excluded from the spread statistics rather than diluting them.
  const expectedPerDay = 24 * pointsPerHour;
  const spreads = [], chargeLevels = [], dischargeLevels = [];
  for (const [, pts] of days){
    if (pts.length < expectedPerDay * 0.8) continue;
    const d = dailySpreadDetail(pts, durationHours, pointsPerHour);
    if (d !== null){
      spreads.push(d.spread);
      chargeLevels.push(d.chargeMean);
      dischargeLevels.push(d.dischargeMean);
    }
  }

  const negatives = values.filter(v => v < 0).length;

  return {
    points: clean.length,
    coverageDays: days.size,
    pointsPerHour,

    mean: mean(values),
    median: median(values),
    stdev: stdev(values),
    p5: percentile(values, 0.05),
    p95: percentile(values, 0.95),

    /* Hours at or below zero. For a battery this is charging value, not a
       problem — it is the metric most likely to be misread by a reader used to
       generation assets, so it is named for what it is. */
    negativeHoursPct: clean.length > 0 ? negatives / clean.length : null,

    spreadMean: mean(spreads),
    spreadMedian: median(spreads),
    spreadP25: percentile(spreads, 0.25),
    spreadP75: percentile(spreads, 0.75),
    spreadDays: spreads.length,

    /* The two legs behind the spread. Carried separately because efficiency
       acts on the charge leg, not on the difference — see dailySpreadDetail. */
    chargeMean: mean(chargeLevels),
    dischargeMean: mean(dischargeLevels),

    durationHours,
    timezone,
  };
}
