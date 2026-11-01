/* ---------------------------------------------------------------------------
   SNAPSHOT SUMMARIES.

   Each dataset is published twice, and the split is not premature optimisation —
   a year of half-hourly Japanese prices is 1.2 MB of JSON, and three Japanese
   areas alone are 3.6 MB. Loading that into the browser to draw a chart with 365
   visible points would make the live-data layer cost four times the entire
   application bundle.

       <id>.json           the full observed series. Audit artefact: it is what
                           the checksum covers, what a reader can download, and
                           what the drift calculation runs on in CI.

       <id>.summary.json   what the SITE loads. Envelope metadata, the derived
                           metrics, and one row per local trading day.

   The summary is a strict function of the full snapshot, so it can never
   disagree with it, and it carries the full file's checksum so a reader can
   verify which snapshot it came from.

   Daily rollups are computed on the market's own local trading day, for the same
   reason the spread statistics are: a UTC day boundary splits a Japanese
   trading day in half and silently changes every daily figure.
   --------------------------------------------------------------------------- */
import { cleanSeries, groupByLocalDay, dailySpreadDetail, inferPointsPerHour, mean } from '../../src/derive/priceMetrics.js';
import { sha256 } from './envelope.mjs';

/**
 * One row per local trading day: enough to draw every chart the site needs
 * without shipping the underlying half-hourly series.
 */
export function dailyRollup(series, { timezone, durationHours, price = true }){
  const clean = cleanSeries(series);
  if (clean.length === 0) return [];

  const pointsPerHour = inferPointsPerHour(clean);
  const days = groupByLocalDay(clean, timezone);
  const rows = [];

  for (const [d, pts] of [...days.entries()].sort((a, b) => a[0].localeCompare(b[0]))){
    const values = pts.map(p => p.v);
    const detail = price ? dailySpreadDetail(pts, durationHours, pointsPerHour) : null;
    rows.push({
      d,
      n: pts.length,
      mean: round(mean(values)),
      min: round(Math.min(...values)),
      max: round(Math.max(...values)),
      // Null rather than absent when the day is too short to support a trade —
      // the chart must show a gap, not interpolate across it.
      spread: detail ? round(detail.spread) : null,
      charge: detail ? round(detail.chargeMean) : null,
      discharge: detail ? round(detail.dischargeMean) : null,
    });
  }
  return rows;
}

function round(v){
  return (typeof v === 'number' && Number.isFinite(v)) ? Math.round(v * 100) / 100 : null;
}

/**
 * Build the summary the site loads.
 *
 * @param {object} snapshot  the full snapshot
 * @param {object} metrics   output of derivePriceMetrics()
 * @param {object} extra     { arbitrage } — bridge output, when computable
 */
export function buildSummary(snapshot, metrics, { timezone, durationHours, arbitrage = null } = {}){
  const rollupTimezone = timezone || (snapshot.units?.power ? 'UTC' : undefined);
  const daily = dailyRollup(snapshot.series, { timezone: rollupTimezone, durationHours, price: Boolean(snapshot.units?.price) });

  const summary = {
    schemaVersion: snapshot.schemaVersion,
    datasetId: snapshot.datasetId,
    marketId: snapshot.marketId,
    title: snapshot.title,
    authority: 'observed',

    source: snapshot.source,
    fetchedAt: snapshot.fetchedAt,
    coverage: snapshot.coverage,
    units: snapshot.units,
    notes: snapshot.notes,

    refreshHours: snapshot.refreshHours,
    staleAfterHours: snapshot.staleAfterHours,

    /* Deterministic functions of the observed series. Authority 'derived':
       machine-computed, published automatically, never an analyst judgement.

       When there are no price metrics — FX, and any future dataset that is not a
       price series — the connector's own derived block is carried through
       unchanged rather than nulled. Nulling it silently dropped the ECB rates,
       which is the whole payload of that dataset. */
    derived: !metrics ? (snapshot.derived ?? null) : {
      authority: 'derived',
      points: metrics.points,
      coverageDays: metrics.coverageDays,
      pointsPerHour: metrics.pointsPerHour,
      mean: round(metrics.mean),
      median: round(metrics.median),
      stdev: round(metrics.stdev),
      p5: round(metrics.p5),
      p95: round(metrics.p95),
      negativeHoursPct: metrics.negativeHoursPct,
      spreadMean: round(metrics.spreadMean),
      spreadMedian: round(metrics.spreadMedian),
      spreadP25: round(metrics.spreadP25),
      spreadP75: round(metrics.spreadP75),
      spreadDays: metrics.spreadDays,
      chargeMean: round(metrics.chargeMean),
      dischargeMean: round(metrics.dischargeMean),
      durationHours: metrics.durationHours,
    },

    /* The arbitrage index. Carried so the site can show what the observation
       implies, clearly separated from the analyst's assumption — never merged
       into it. */
    arbitrage: arbitrage ? {
      authority: 'derived',
      revenuePerMW: Math.round(arbitrage.revenuePerMW),
      marginPerCycle: round(arbitrage.marginPerCycle),
      inputs: arbitrage.inputs,
      claim: arbitrage.claim,
    } : null,

    ...(snapshot.units?.power ? { dailyTimezone: rollupTimezone } : {}),
    daily,

    /* Ties this summary to the exact snapshot it was computed from. */
    sourceSnapshot: {
      file: `${snapshot.datasetId}.json`,
      contentChecksum: snapshot.contentChecksum,
      points: snapshot.series?.length ?? 0,
    },
  };

  summary.summaryChecksum = sha256(summary);
  return summary;
}
