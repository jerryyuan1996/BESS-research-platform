/* ---------------------------------------------------------------------------
   AEMO — Western Australian WEM reference trading price.

   Verified against the live service. Two directories:

     current/   ReferenceTradingPrice_YYYY-MM-DD.json   today, plain JSON
     previous/  ReferenceTradingPrice_YYYYMMDD.zip      archive, one day per zip

   Note the date formats differ between them — hyphenated in current/, compact in
   previous/. They are not interchangeable and a 404 is the polite version of
   what happens if you mix them up.

   Payload shape:

     { data: { tradingDay, referenceTradingPrices:
         [ { tradingInterval: '2026-07-27T08:00:00+08:00',
             referenceTradingPrice: 129.35, isPublished: true }, … ] } }

   Timestamps carry an explicit +08:00 (AWST — Western Australia observes no
   daylight saving), so they parse correctly without any local assumption.

   Backfill is incremental and capped per run. The archive holds one file per day
   back to October 2023; pulling a year of it on every cron tick would be a
   thousand-plus requests against a public regulator four times a day. The window
   fills over a few runs instead.
   --------------------------------------------------------------------------- */
import { httpGet, httpGetJson } from '../lib/fetch.mjs';
import { buildSnapshot } from '../lib/envelope.mjs';
import { unzipFirstEntry } from '../lib/zip.mjs';
import { mergeSeries, missingDays, coverageOf, WINDOW_DAYS, MAX_BACKFILL_PER_RUN } from '../lib/series.mjs';

const ROOT = 'https://data.wa.aemo.com.au/public/market-data/wemde/referenceTradingPrice';

/** Points from one day's payload. Unpublished intervals are dropped rather than
    carried: AEMO marks them isPublished:false precisely because they are not yet
    the settled price. */
function pointsFrom(payload){
  const rows = payload?.data?.referenceTradingPrices;
  if (!Array.isArray(rows)) return [];

  const out = [];
  for (const row of rows){
    if (row?.isPublished === false) continue;
    const v = Number(row?.referenceTradingPrice);
    const ms = Date.parse(row?.tradingInterval);
    if (!Number.isFinite(v) || Number.isNaN(ms)) continue;
    out.push({ t: new Date(ms).toISOString(), v });
  }
  return out;
}

async function fetchCurrentDay(day, log){
  const url = `${ROOT}/current/ReferenceTradingPrice_${day}.json`;
  try {
    return pointsFrom(await httpGetJson(url, { log, retries: 2 }));
  } catch {
    return null;   // not yet published for that day
  }
}

async function fetchArchivedDay(day, log){
  const compact = day.replace(/-/g, '');
  const url = `${ROOT}/previous/ReferenceTradingPrice_${compact}.zip`;
  try {
    const res = await httpGet(url, { log, retries: 2 });
    const buf = Buffer.from(await res.arrayBuffer());
    const { data } = unzipFirstEntry(buf);
    return pointsFrom(JSON.parse(data.toString('utf8')));
  } catch (err){
    log(`  WEM: ${day} unavailable (${err.message})`);
    return null;
  }
}

export async function fetchDataset({ dataset, previous, log, now }){
  const incoming = [];

  // Yesterday and today from current/, which is where they live before the
  // archive picks them up.
  const today = (now ? new Date(now) : new Date());
  for (const offset of [0, 1]){
    const day = new Date(today.getTime() - offset * 86400_000).toISOString().slice(0, 10);
    const pts = await fetchCurrentDay(day, log);
    if (pts) incoming.push(...pts);
  }

  // Backfill whatever the window is still missing, newest first, capped.
  const wanted = missingDays(previous?.series, {
    windowDays: WINDOW_DAYS, maxDays: MAX_BACKFILL_PER_RUN, now,
  });
  if (wanted.length > 0){
    log(`  WEM: backfilling ${wanted.length} day(s) (cap ${MAX_BACKFILL_PER_RUN}/run)`);
  }
  for (const day of wanted){
    const pts = await fetchArchivedDay(day, log);
    if (pts) incoming.push(...pts);
  }

  if (incoming.length === 0 && !previous?.series?.length){
    throw new Error('WEM: no points fetched and no previous snapshot to extend');
  }

  const series = mergeSeries(previous?.series, incoming, { windowDays: WINDOW_DAYS, now });
  const remaining = missingDays(series, { windowDays: WINDOW_DAYS, maxDays: 9999, now }).length;

  return {
    snapshot: buildSnapshot({
      dataset,
      coverage: coverageOf(series, 'PT30M'),
      units: { price: 'AUD/MWh' },
      series,
      notes: [
        'WEM reference trading price, 30-minute trading intervals, AWST (+08:00).',
        'Provisional intervals (isPublished:false) are excluded.',
        remaining > 0
          ? `Window is still ${remaining} day(s) short; backfill continues on later runs.`
          : 'Trailing window complete.',
      ],
    }),
  };
}
