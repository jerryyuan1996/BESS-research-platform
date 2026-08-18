/* ---------------------------------------------------------------------------
   ENTSO-E Transparency Platform — day-ahead prices.

   One connector and one free token cover four of this platform's markets:
   Great Britain, Ireland (SEM), Romania and Poland. Endpoint verified live; an
   unauthenticated request returns a well-formed Acknowledgement_MarketDocument,
   which confirms the URL and parameters are right.

       https://web-api.tp.entsoe.eu/api
         ?securityToken=…
         &documentType=A44                 price document
         &in_Domain=<EIC>&out_Domain=<EIC> same zone for a day-ahead price
         &periodStart=YYYYMMDDHHMM&periodEnd=YYYYMMDDHHMM   (UTC)

   Register for a token at transparency.entsoe.eu, then mail the service desk to
   have API access enabled — it is not automatic on signup. Store it as the
   ENTSOE_TOKEN secret; a missing token skips the dataset and leaves the previous
   snapshot untouched.

   ---------------------------------------------------------------------------
   THE CURVE-TYPE TRAP

   A44 documents use curveType A03 ("variable sized block"), in which a Point is
   published only when the price CHANGES. A flat afternoon appears as a single
   point at position 25 and then nothing until position 40. Reading positions
   literally yields a series with holes in exactly the calm periods, which biases
   every spread statistic upward — the quiet hours vanish and only the volatile
   ones remain. Prices must be carried forward to the next stated position.

   This is the single most consequential detail in the file. It is also invisible
   in testing against a volatile day, which is how it survives into production.
   --------------------------------------------------------------------------- */
import { httpGetText, secret } from '../lib/fetch.mjs';
import { buildSnapshot } from '../lib/envelope.mjs';
import { mergeSeries, coverageOf, WINDOW_DAYS } from '../lib/series.mjs';

const API = 'https://web-api.tp.entsoe.eu/api';

/** EIC bidding-zone codes, per market id. */
const DOMAIN = {
  gb: '10YGB----------A',
  ie: '10Y1001A1001A59C',    // SEM — the all-island Irish market
  ro: '10YRO-TEL------P',
  pl: '10YPL-AREA-----S',
  fi: '10YFI-1--------U',    // Finland, Fingrid BZ / CA / MBA
};

/** ISO 4217 per market, used to label the snapshot's units. */
const CURRENCY = { gb: 'GBP', ie: 'EUR', ro: 'EUR', pl: 'EUR' };

/** ENTSO-E's compact UTC stamp: YYYYMMDDHHMM. */
function stamp(date){
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}${p(date.getUTCHours())}${p(date.getUTCMinutes())}`;
}

/** Resolution string → minutes. */
function resolutionMinutes(res){
  const m = /^PT(\d+)M$/.exec(res);
  if (m) return Number(m[1]);
  if (res === 'PT1H' || res === 'PT60M') return 60;
  return null;
}

const tagValue = (xml, tag) => {
  const m = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(xml);
  return m ? m[1].trim() : null;
};

/**
 * Parse a Publication_MarketDocument into points.
 *
 * Handles the A03 carry-forward described above: positions are sparse, and every
 * slot between one stated position and the next takes the earlier price.
 */
function parseDocument(xml){
  if (/<Acknowledgement_MarketDocument/.test(xml)){
    const reason = tagValue(xml, 'text') || 'no matching data';
    return { points: [], acknowledgement: reason };
  }

  const points = [];

  for (const tsMatch of xml.matchAll(/<TimeSeries>([\s\S]*?)<\/TimeSeries>/g)){
    const ts = tsMatch[1];

    for (const perMatch of ts.matchAll(/<Period>([\s\S]*?)<\/Period>/g)){
      const period = perMatch[1];

      const start = tagValue(period, 'start');
      const end = tagValue(period, 'end');
      const resolution = tagValue(period, 'resolution');
      const stepMin = resolutionMinutes(resolution);
      if (!start || !stepMin) continue;

      const startMs = Date.parse(start);
      const endMs = Date.parse(end);
      if (Number.isNaN(startMs)) continue;

      // Collect the stated points first, then expand.
      const stated = [];
      for (const ptMatch of period.matchAll(/<Point>([\s\S]*?)<\/Point>/g)){
        const pos = Number(tagValue(ptMatch[1], 'position'));
        const price = Number(tagValue(ptMatch[1], 'price.amount'));
        if (Number.isInteger(pos) && Number.isFinite(price)) stated.push({ pos, price });
      }
      if (stated.length === 0) continue;
      stated.sort((a, b) => a.pos - b.pos);

      // How many slots the period actually spans.
      const slots = Number.isNaN(endMs)
        ? stated[stated.length - 1].pos
        : Math.max(stated[stated.length - 1].pos, Math.round((endMs - startMs) / (stepMin * 60_000)));

      let si = 0, current = stated[0].price;
      for (let pos = 1; pos <= slots; pos++){
        while (si < stated.length && stated[si].pos === pos){
          current = stated[si].price;
          si++;
        }
        points.push({
          t: new Date(startMs + (pos - 1) * stepMin * 60_000).toISOString(),
          v: current,
        });
      }
    }
  }

  return { points, acknowledgement: null };
}

export async function fetchDataset({ dataset, previous, log, now }){
  const token = secret('ENTSOE_TOKEN');
  if (!token){
    // Not an error. A missing credential means "not refreshed this run"; the
    // previous snapshot stays and the run reports it.
    return { skipped: true, reason: 'ENTSOE_TOKEN is not set' };
  }

  const domain = DOMAIN[dataset.marketId];
  const currency = CURRENCY[dataset.marketId];
  if (!domain) throw new Error(`ENTSO-E: no bidding-zone code for market "${dataset.marketId}"`);

  const end = now ? new Date(now) : new Date();
  const incoming = [];

  /* Request in monthly chunks. The platform accepts a year for A44, but a single
     large response is all-or-nothing: one upstream hiccup and the whole window
     is lost. Monthly chunks degrade to a partial refresh instead, and the merge
     makes partial refreshes harmless. */
  const CHUNK_DAYS = 30;
  const chunks = Math.ceil(WINDOW_DAYS / CHUNK_DAYS);
  let failures = 0;

  for (let i = 0; i < chunks; i++){
    const chunkEnd = new Date(end.getTime() - i * CHUNK_DAYS * 86400_000);
    const chunkStart = new Date(chunkEnd.getTime() - CHUNK_DAYS * 86400_000);

    /* Skip a chunk the snapshot already covers densely. Day-ahead publishes
       roughly 24 points a day; 20 is a generous "we already have this". */
    if (previous?.series?.length){
      const inChunk = previous.series.filter(p => {
        const ms = Date.parse(p.t);
        return ms >= chunkStart.getTime() && ms < chunkEnd.getTime();
      }).length;
      if (inChunk >= CHUNK_DAYS * 20) continue;
    }

    const url = `${API}?securityToken=${encodeURIComponent(token)}`
      + `&documentType=A44&in_Domain=${domain}&out_Domain=${domain}`
      + `&periodStart=${stamp(chunkStart)}&periodEnd=${stamp(chunkEnd)}`;

    try {
      const xml = await httpGetText(url, { log, retries: 2 });
      const { points, acknowledgement } = parseDocument(xml);
      if (acknowledgement){
        log(`  ENTSO-E ${dataset.marketId}: ${chunkStart.toISOString().slice(0, 10)} — ${acknowledgement}`);
      }
      incoming.push(...points);
    } catch (err){
      failures++;
      log(`  ENTSO-E ${dataset.marketId}: chunk ${chunkStart.toISOString().slice(0, 10)} failed — ${err.message}`);
      // A run of consecutive failures means the token or the service is the
      // problem, not one chunk. Stop rather than hammering it.
      if (failures >= 3) break;
    }
  }

  if (incoming.length === 0 && !previous?.series?.length){
    throw new Error('ENTSO-E: no points fetched and no previous snapshot to extend');
  }

  const series = mergeSeries(previous?.series, incoming, { windowDays: WINDOW_DAYS, now });

  return {
    snapshot: buildSnapshot({
      dataset,
      coverage: coverageOf(series, 'PT60M'),
      units: { price: `${currency}/MWh` },
      series,
      notes: [
        `Day-ahead prices for bidding zone ${domain}.`,
        'Sparse A03 curve points are carried forward to the next stated position.',
        'Resolution follows the source and may mix PT60M and PT15M across the window.',
      ],
    }),
  };
}
