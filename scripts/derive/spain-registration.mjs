/* ---------------------------------------------------------------------------
   docs/spain-registration-plan.md — the derivation, from OMIE's own files.

     node scripts/derive/spain-registration.mjs <cacheDir> [--fetch]

   Read-only against the repository. With --fetch it downloads OMIE's public
   day-ahead files (marginalpdbc, Spanish zone) for 2023-01-01 to yesterday
   into <cacheDir>, which stays outside git; without it, it reads what is
   there. Then it prints:

     · the day-ahead value of a 1 MW battery by year and duration, on the
       merchant-lines definition (docs/merchant-lines-plan-2026-10.md, "How
       the prices were read"): one full cycle a day, charge before discharge,
       buy 1/0.88 MWh for each MWh sold, the best schedule found exactly,
       hourly prices (a 15-minute day is averaged to hours);
     · 2026 to date against the same days of 2025;
     · Spain's dated fleet path on the curve fitted on Bulgaria;
     · the year-1 seed, the curve, the band ends and the duration capture,
       checked against src/markets/es/comparison.js.

   OMIE's legal notice allows free use of its published information if the
   source is cited.
   --------------------------------------------------------------------------- */
import fs from 'node:fs';
import path from 'node:path';
import { byId } from '../../src/markets/registry.js';

const ETA = 0.88;
const [cacheDir, flag] = process.argv.slice(2);
if (!cacheDir){ console.error('usage: node scripts/derive/spain-registration.mjs <cacheDir> [--fetch]'); process.exit(1); }

/* ---- fetch ------------------------------------------------------------------ */
async function fetchAll(){
  fs.mkdirSync(cacheDir, { recursive: true });
  const days = [];
  const end = new Date(); end.setUTCDate(end.getUTCDate() - 1);
  for (let d = new Date(Date.UTC(2023, 0, 1)); d <= end; d.setUTCDate(d.getUTCDate() + 1)) days.push(d.toISOString().slice(0, 10).replace(/-/g, ''));
  const queue = [...days], failed = [];
  async function get(day){
    const file = path.join(cacheDir, `marginalpdbc_${day}.1`);
    if (fs.existsSync(file) && fs.statSync(file).size > 100) return;
    const url = `https://www.omie.es/es/file-download?parents=marginalpdbc&filename=marginalpdbc_${day}.1`;
    for (let i = 0; i < 3; i++){
      try {
        const t = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
        if (t.startsWith('MARGINALPDBC')){ fs.writeFileSync(file, t); return; }
      } catch { /* retry */ }
      await new Promise(r => setTimeout(r, 1000));
    }
    failed.push(day);
  }
  await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await get(queue.shift()); }));
  console.log(`Fetched ${days.length - failed.length} of ${days.length} days; missing ${failed.join(', ') || 'none'}`);
}
if (flag === '--fetch') await fetchAll();

/* ---- read ------------------------------------------------------------------- */
const days = [];
for (const f of fs.readdirSync(cacheDir).sort()){
  const m = f.match(/marginalpdbc_(\d{4})(\d{2})(\d{2})\.1$/);
  if (!m) continue;
  const rows = fs.readFileSync(path.join(cacheDir, f), 'utf8').split(/\r?\n/)
    .map(l => l.split(';')).filter(r => r.length >= 6 && /^\d{4}$/.test(r[0]))
    .sort((a, b) => +a[3] - +b[3]);
  let es = rows.map(r => parseFloat(r[5]));
  if (es.some(Number.isNaN)) continue;
  if (es.length > 25){   // quarter-hours since 1 October 2025: mean of each hour
    const h = [];
    for (let i = 0; i < es.length; i += 4){ const q = es.slice(i, i + 4); h.push(q.reduce((a, b) => a + b, 0) / q.length); }
    es = h;
  }
  days.push({ date: `${m[1]}-${m[2]}-${m[3]}`, prices: es });
}

/* ---- the dispatch ------------------------------------------------------------ */
function dayValue(p, n){
  if (p.length < 2 * n) return null;
  let best = 0;
  for (let s = n; s <= p.length - n; s++){
    const lo = p.slice(0, s).sort((a, b) => a - b).slice(0, n);
    const hi = p.slice(s).sort((a, b) => b - a).slice(0, n);
    const v = hi.reduce((a, b) => a + b, 0) - lo.reduce((a, b) => a + b, 0) / ETA;
    if (v > best) best = v;
  }
  return best;
}
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
function perDay(set, n){ return mean(set.map(d => dayValue(d.prices, n)).filter(v => v != null)); }
const year = (y) => days.filter(d => d.date.startsWith(y));

const HOURS = [1, 2, 4, 6, 8];
const value = {};
for (const y of ['2023', '2024', '2025']){
  value[y] = Object.fromEntries(HOURS.map(n => [n, perDay(year(y), n)]));
  console.log(`${y}: ${HOURS.map(n => `${n}h €${value[y][n].toFixed(1)}/day (€${(value[y][n] * 365 / 1000).toFixed(1)}k)`).join('  ')}  mean price €${mean(year(y).flatMap(d => d.prices)).toFixed(1)}/MWh  (${year(y).length} days)`);
}

/* 2026 to date against the same days of 2025 */
const last = days.filter(d => d.date.startsWith('2026')).map(d => d.date).pop();
const md = last.slice(5);
const ytd = (y) => days.filter(d => d.date.startsWith(y) && d.date.slice(5) <= md);
const ytd4 = { 2025: perDay(ytd('2025'), 4), 2026: perDay(ytd('2026'), 4) };
console.log(`To ${md}: 4h €${ytd4[2025].toFixed(1)} → €${ytd4[2026].toFixed(1)}/day (${((ytd4[2026] / ytd4[2025] - 1) * 100).toFixed(1)}%)`);

/* Capture per MWh relative to 4 h, 2023–2025 mean */
const capture = HOURS.map(n => mean(['2023', '2024', '2025'].map(y => (value[y][n] / n) / (value[y][4] / 4))));
console.log(`Capture per MWh vs 4h (2023–25 mean): ${capture.map((c, i) => `${HOURS[i]}h ${c.toFixed(3)}`).join('  ')}`);

/* ---- the path ------------------------------------------------------------------ */
const f = (x) => 1 - 0.243 * (1 - Math.exp(-x / 0.324));
const LOAD = 256 / 8.76;
const FLEET = { 2025: 0.06, 2026: 0.35, 2027: 1.5, 2028: 3.5, 2029: 5.5, 2030: 7.5 };
const P = Object.fromEntries(Object.entries(FLEET).map(([y, g]) => [y, f((g - FLEET[2025]) / LOAD)]));
console.log(`Path (load ${LOAD.toFixed(2)} GW): ${Object.entries(P).map(([y, v]) => `${y} ${v.toFixed(3)}`).join('  ')}`);

const V4 = value['2025'][4] * 365;
const seed = Math.round(V4 * P[2028]);
const curve = [1, P[2029] / P[2028], P[2030] / P[2028]].map(v => +v.toFixed(3));
const low = Math.round(value['2024'][4] * 365 * f((5.0 - 0.06) / LOAD));
const high = Math.round(ytd4[2026] * 365 * f((1.8 - 0.06) / LOAD));
console.log(`Seed: ${V4.toFixed(0)} × ${P[2028].toFixed(3)} = ${seed}; curve ${curve.join(', ')}; band ${low}–${high}`);

const e = byId('es')?.comparison?.economics;
if (e) console.log(`File carries merchGross ${e.merchGross} (${(e.merchGross / seed * 100 - 100).toFixed(2)}% off), curve ${e.merchantCurve.join(', ')}`);
