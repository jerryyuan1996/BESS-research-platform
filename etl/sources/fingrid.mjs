/* ---------------------------------------------------------------------------
   Fingrid open data — Finland's hourly reserve capacity prices (gate FI-2).

       https://data.fingrid.fi/api/datasets/<id>/data
         ?startTime=…&endTime=…&format=json&pageSize=20000&sortOrder=asc
       header x-api-key: FINGRID_API_KEY

   Licence: Creative Commons Attribution 4.0, read from each dataset's own
   metadata on 2026-10-30. The attribution string travels in the catalogue entry.

   Why this feed exists. Finland's reserve line is the 2026 YEARLY FCR-D
   clearing spread over the fleet, and Fingrid buys no FCR in a yearly market
   for 2027 (release of 8 September 2026). From 2027 the hourly prices below are
   the only observation of what reserves pay. They are snapshots for the
   analyst; nothing here proposes a change to `economics.services`, and the
   drift detector only reads datasets that bear on the merchant line.

   One Fingrid series per catalogue dataset, in EUR per MW per hour, one point
   per delivery hour (`t` = the hour's start, UTC). Fingrid publishes no
   day-ahead energy price; Finland's comes from ENTSO-E (fi-day-ahead).

   Two operational facts:
     · The starter key is rate-limited to about one request every two seconds,
       and answers 429 beyond it. Requests are spaced here, and httpGet retries
       a 429 with backoff.
     · A missing key skips the dataset and keeps the previous snapshot. The
       GitHub secret is FINGRID_API; the workflow maps it to FINGRID_API_KEY.
   Run locally behind a proxy with NODE_USE_ENV_PROXY=1 (Node's fetch ignores
   HTTPS_PROXY otherwise) and `node --env-file=.env.fingrid`.
   --------------------------------------------------------------------------- */
import { httpGetJson, secret } from '../lib/fetch.mjs';
import { buildSnapshot } from '../lib/envelope.mjs';
import { mergeSeries, coverageOf, WINDOW_DAYS } from '../lib/series.mjs';

const API = 'https://data.fingrid.fi/api/datasets';
const DAY = 86_400_000;
const SPACING_MS = 2_500;

/** Catalogue dataset → Fingrid dataset id and what the series is. */
export const SERIES = {
  'fi-fcr-n':       { id: 317, product: 'FCR-N, hourly market price' },
  'fi-fcr-d-up':    { id: 318, product: 'FCR-D up, hourly market price' },
  'fi-fcr-d-down':  { id: 283, product: 'FCR-D down, hourly market price' },
  'fi-afrr-up':     { id: 52,  product: 'aFRR capacity, up, price' },
  'fi-afrr-down':   { id: 51,  product: 'aFRR capacity, down, price' },
  'fi-mfrr-up':     { id: 329, product: 'mFRR balancing capacity, up, hourly market price' },
  'fi-mfrr-down':   { id: 330, product: 'mFRR balancing capacity, down, hourly market price' },
};

let lastRequestAt = 0;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function spaced(){
  const wait = lastRequestAt + SPACING_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

/** Fingrid rows → hourly points ({ t, v }), sorted, one per start time. */
export function toPoints(rows){
  const byStart = new Map();
  for (const r of rows || []){
    const ms = Date.parse(r?.startTime);
    if (!Number.isFinite(ms) || typeof r.value !== 'number' || !Number.isFinite(r.value)) continue;
    byStart.set(ms, r.value);
  }
  return [...byStart.entries()].sort((a, b) => a[0] - b[0])
    .map(([ms, v]) => ({ t: new Date(ms).toISOString(), v }));
}

/** The window to ask for: from the last point held (less a day, to pick up
 *  late revisions) or a full window on a cold start, to the next day. */
export function requestWindow(previous, end){
  const last = previous?.series?.length ? Date.parse(previous.series[previous.series.length - 1].t) : NaN;
  const from = Number.isFinite(last) ? Math.max(last - DAY, end - WINDOW_DAYS * DAY) : end - WINDOW_DAYS * DAY;
  return { from: new Date(from).toISOString(), to: new Date(end + DAY).toISOString() };
}

export async function fetchDataset({ dataset, previous, log, now }){
  const key = secret('FINGRID_API_KEY');
  if (!key) return { skipped: true, reason: 'FINGRID_API_KEY is not set' };

  const spec = SERIES[dataset.id];
  if (!spec) throw new Error(`Fingrid: no series mapped for dataset "${dataset.id}"`);

  const end = now ? Date.parse(now) : Date.now();
  const { from, to } = requestWindow(previous, end);

  const rows = [];
  for (let page = 1; page; ){
    await spaced();
    const url = `${API}/${spec.id}/data?${new URLSearchParams({ startTime: from, endTime: to, format: 'json', pageSize: '20000', sortOrder: 'asc', page: String(page) })}`;
    const body = await httpGetJson(url, { log, retries: 4, headers: { 'x-api-key': key, accept: 'application/json' } });
    rows.push(...(body.data || []));
    page = body.pagination?.nextPage || null;
  }

  const incoming = toPoints(rows);
  if (!incoming.length && !previous?.series?.length) throw new Error(`Fingrid ${spec.id}: no points fetched and no previous snapshot to extend`);

  const series = mergeSeries(previous?.series, incoming, { windowDays: WINDOW_DAYS, now: new Date(end).toISOString() });
  return {
    snapshot: buildSnapshot({
      dataset,
      coverage: coverageOf(series, 'PT60M'),
      units: { price: 'EUR/MW/h' },
      series,
      notes: [`Fingrid open data, dataset ${spec.id}: ${spec.product}. CC BY 4.0.`],
    }),
  };
}
