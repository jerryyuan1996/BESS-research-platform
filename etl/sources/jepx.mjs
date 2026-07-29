/* ---------------------------------------------------------------------------
   JEPX — Japanese spot (day-ahead) area prices.

   Verified against the live file. Three details, each of which silently
   corrupts the output if guessed wrong:

   1. ENCODING is Shift-JIS, not UTF-8. Decoding it as UTF-8 mangles the header
      and — worse — succeeds, producing a file that parses and yields nothing.

   2. UNITS are 円/kWh (yen per kilowatt-hour). Every other market here is in
      currency per MWh. A missed ×1000 makes Japan look a thousand times cheaper
      than everywhere else, which is exactly the kind of error that reads as a
      finding rather than a bug.

   3. THE FILE IS PER JAPANESE FISCAL YEAR — spot_2026.csv covers April 2026 to
      March 2027. A trailing-twelve-month window therefore spans two files for
      most of the year, and fetching only the current one silently truncates the
      window every April.

   Column layout, confirmed from the live header:

       [0]  年月日            date, YYYY/MM/DD
       [1]  時刻コード        30-minute period, 1–48
       [5]  システムプライス   system price
       [6]  エリアプライス北海道   Hokkaido
       [8]  エリアプライス東京     Tokyo
       [14] エリアプライス九州     Kyushu

   Period n covers [00:00 + 30(n−1) min, +30 min) in JST (UTC+9, no DST).
   --------------------------------------------------------------------------- */
import { httpGet } from '../lib/fetch.mjs';
import { buildSnapshot } from '../lib/envelope.mjs';
import { mergeSeries, coverageOf, WINDOW_DAYS } from '../lib/series.mjs';

const BASE = 'https://www.jepx.jp/market/excel/spot_';

/** Which CSV column carries each market's area price. */
const AREA_COLUMN = {
  jp_hokkaido: 6,
  jp_tokyo: 8,
  jp_kyushu: 14,
};

/** Japanese fiscal years spanning a trailing window ending now. */
function fiscalYearsFor(now){
  const d = now ? new Date(now) : new Date();
  // FY starts in April: months 0–2 (Jan–Mar) belong to the previous FY.
  const fy = d.getUTCMonth() < 3 ? d.getUTCFullYear() - 1 : d.getUTCFullYear();
  return [fy - 1, fy];
}

async function fetchYear(year, log){
  const url = `${BASE}${year}.csv`;
  try {
    const res = await httpGet(url, { log });
    const buf = Buffer.from(await res.arrayBuffer());
    return new TextDecoder('shift_jis').decode(buf);
  } catch (err){
    // A fiscal year that does not exist yet, or an archive that has moved, must
    // not fail the whole dataset — the other year still yields a usable window.
    log(`  JEPX: ${year} unavailable (${err.message})`);
    return null;
  }
}

/** JST instant for a trading date and 30-minute period code. */
function jstInstant(dateStr, period){
  const [y, m, d] = dateStr.split('/').map(Number);
  if (!y || !m || !d) return null;
  const minutes = (period - 1) * 30;
  // Construct in UTC then subtract the fixed +09:00 offset. Japan has observed
  // no daylight saving since 1951, so a constant offset is correct here and a
  // timezone library would add nothing.
  const utcMs = Date.UTC(y, m - 1, d, 0, 0, 0) + minutes * 60_000 - 9 * 3600_000;
  return new Date(utcMs).toISOString();
}

function parseCsv(text, column){
  const points = [];
  const lines = text.split(/\r?\n/);

  for (let i = 1; i < lines.length; i++){
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = line.split(',');
    if (cells.length <= column) continue;

    const period = Number(cells[1]);
    if (!Number.isInteger(period) || period < 1 || period > 48) continue;

    const yenPerKwh = Number(cells[column]);
    if (!Number.isFinite(yenPerKwh)) continue;

    const t = jstInstant(cells[0], period);
    if (!t) continue;

    points.push({ t, v: yenPerKwh * 1000 });   // → JPY/MWh
  }
  return points;
}

export async function fetchDataset({ dataset, previous, log, now }){
  const column = AREA_COLUMN[dataset.marketId];
  if (column === undefined){
    throw new Error(`JEPX: no area column mapped for market "${dataset.marketId}"`);
  }

  const incoming = [];
  for (const year of fiscalYearsFor(now)){
    const text = await fetchYear(year, log);
    if (text) incoming.push(...parseCsv(text, column));
  }

  if (incoming.length === 0){
    throw new Error('JEPX: no parseable rows from any fiscal-year file');
  }

  const series = mergeSeries(previous?.series, incoming, { windowDays: WINDOW_DAYS, now });

  return {
    snapshot: buildSnapshot({
      dataset,
      coverage: coverageOf(series, 'PT30M'),
      units: { price: 'JPY/MWh' },
      series,
      notes: [
        'Converted from the published 円/kWh to JPY/MWh (×1000).',
        'Area price for the market\'s own region, not the JEPX system price.',
        'Source file is per Japanese fiscal year (April–March); two are read to span the window.',
      ],
    }),
  };
}
