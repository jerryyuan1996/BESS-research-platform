/* ---------------------------------------------------------------------------
   JAPAN: THE BUILD THAT HOLDS THE AWARD FLOOR — the derivations behind
   docs/japan-ltda-floor-plan.md (guided-experience plan, PR 8).

   Read-only. Prints the plan's tables from the repository's own data:

     1. JEPX capture relative to 4h, per area, from the published snapshots,
        by the method of docs/duration-and-route-fit-plan.md §3.3;
     2. the long-term auction award priced at the 6h archetype and at the
        builds that hold its six-hour floor to year 20, under each reading of
        what the award pays;
     3. the award a 9h build needs to break even at the platform's yields.

   The extension past 8h exists only inside this script. Nothing here changes
   the engine, the view store or a published number.

     node scripts/derive/japan-ltda-floor.mjs
   --------------------------------------------------------------------------- */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const imp = (f) => import(pathToFileURL(path.join(ROOT, f)).href);
const { byId } = await imp('src/markets/registry.js');
const { runCase } = await imp('src/comparison/engine.js');
const { marketAt, floorOf, termCheck } = await imp('src/comparison/designFit.js');
const { setObservedFxSummary } = await imp('src/comparison/fx.js');
const { meanDailyExecutableSpread } = await imp('src/economics/valueMetrics.js');
const { OEM_CAPEX_MULTIPLIER } = await imp('src/comparison/sponsorAssumptions.js');
const { opexSeedPerMW } = await imp('src/comparison/engine.js');

const json = async (f) => JSON.parse(await readFile(path.join(ROOT, f), 'utf8'));
setObservedFxSummary(await json('public/data/public/fx-ecb.summary.json'));

const AREAS = ['tokyo', 'kyushu', 'hokkaido'];
/* The award's own bid terms, as src/markets/jp/regions.js prices the archetype. */
const BID_RATE = 0.08, BID_YEARS = 20, FEE = 0.10;
const ANNUITY = BID_RATE / (1 - Math.pow(1 + BID_RATE, -BID_YEARS));

const usd = (v) => (v >= 0 ? '+$' : '−$') + Math.abs(v / 1000).toFixed(0) + 'k';
const pct = (v) => (v * 100).toFixed(1) + '%';
const yen = (v) => '¥' + Math.round(v).toLocaleString('en');

/* ---- 1. capture past 8h, from JEPX ---------------------------------------- */
const HOURS = [4, 6, 8, 9, 10];
const capture = {};
console.log('### JEPX capture relative to 4h (contiguous windows, one cycle a day)\n');
console.log('| Hours | ' + AREAS.map(a => a[0].toUpperCase() + a.slice(1)).join(' | ') + ' | Mean |');
console.log('|---|' + AREAS.map(() => '---|').join('') + '---|');
const spreads = {};
let window = '';
for (const area of AREAS){
  const snap = await json(`public/data/public/jp-${area}-jepx.json`);
  const series = snap.series || [];
  window = `${series[0]?.t?.slice(0, 10)} to ${series[series.length - 1]?.t?.slice(0, 10)}`;
  spreads[area] = Object.fromEntries(HOURS.map(h => [h,
    meanDailyExecutableSpread(series, { durationHours: h, timezone: 'Asia/Tokyo' })?.spreadMean ?? null]));
}
for (const h of HOURS){
  const rel = AREAS.map(a => spreads[a][h] / spreads[a][4]);
  capture[h] = rel.reduce((s, v) => s + v, 0) / rel.length;
  console.log(`| ${h} | ${rel.map(v => v.toFixed(3)).join(' | ')} | ${capture[h].toFixed(3)} |`);
}
console.log(`\nJEPX snapshots, ${window}.\n`);

/* ---- 2. the floor-holding builds ------------------------------------------ */
const extend = (m) => {
  const dr = m.comparison.durationResponse;
  return { ...m, comparison: { ...m.comparison, durationResponse: { ...dr,
    hours: [...dr.hours, 9, 10],
    merchantCapture: [...dr.merchantCapture, Number(capture[9].toFixed(2)), Number(capture[10].toFixed(2))] } } };
};
const paying = (v, award) => ({ ...v, comparison: { ...v.comparison, economics: { ...v.comparison.economics,
  ltda: { ...v.comparison.economics.ltda, payment: award * 1000 } } } });
const priced = (v) => {
  const atCod = runCase(v, 'ltda', 0), atExit = runCase(v, 'ltda', 5);
  return { value: atCod.exitVal - atCod.net, hold: atCod.irrHold, exit: atExit.irrExit };
};
/* What a compliant bidder bids for a build: the archetype's formula, on market
   cost (the sponsor's capex is OEM_CAPEX_MULTIPLIER of it), less the share of
   market profit the award lets the owner keep. */
const bidFor = (m, v) => {
  const e = v.comparison.economics, kept = m.comparison.economics.ltda.merchantRetention;
  const retained = (e.merchGross * (1 - FEE) + (e.services || 0)) * kept;
  /* Market cost: the multiplier never applied to the quoted DC block (2026-10-17),
     and the bid recovers the flat opex seed, not the rest-of-opex line. */
  const quoted = e.capexQuotedPerMW || 0;
  const market = (e.capexPerMW - quoted) / OEM_CAPEX_MULTIPLIER + quoted;
  return Math.round((market / 1000 * ANNUITY + opexSeedPerMW(e) / 1000 - retained / 1000) / 1000) * 1000;
};

console.log('### The award at the archetype and at the builds that hold the floor\n');
console.log('| Area | Design | Capex ¥m/MW | Award ¥/kW/yr | Value/MW | Hold IRR | Exit IRR (yr 5) | Hours per contracted kW, year 20 |');
console.log('|---|---|---|---|---|---|---|---|');
const breakEven = {};
for (const area of AREAS){
  const m = extend(byId('jp_' + area));
  const name = area[0].toUpperCase() + area.slice(1);
  const floor = floorOf(m, 'ltda');
  const at = (h) => marketAt(m, 'ltda', h);
  const v6 = at(6), v9 = at(9), v10 = at(10);
  const bid6 = bidFor(m, v6), bid9 = bidFor(m, v9);
  const row = (design, v, award, hours, awardText = yen(award), perContracted = 1) => {
    const r = priced(paying(v, award));
    /* Usable hours per CONTRACTED kW: contracting fewer kW lengthens them. */
    const held = termCheck(m, floor, hours).usableAtTermEnd / perContracted;
    console.log(`| ${name} | ${design} | ${(v.comparison.economics.capexPerMW / 1e6).toFixed(0)} | ${awardText} | ${usd(r.value)} | ${pct(r.hold)} | ${pct(r.exit)} | ${held.toFixed(2)}h${held >= floor.hours - 1e-9 ? '' : ' (fails)'} |`);
  };
  row('6h, as modelled today', v6, bid6, 6);
  row('9h, re-bid at its own cost', v9, bid9, 9);
  row('9h, the 6h award held', v9, bid6, 9);
  row('10h, at the 9h bid', v10, bid9, 10);
  const share = termCheck(m, floor, 6).usableAtTermEnd / floor.hours;
  row(`6h, ${(share * 100).toFixed(0)}% of kW contracted`, v6, bid6 * share, 6, `${yen(bid6)} on ${(share * 100).toFixed(0)}%`, share);
  let lo = 0, hi = 200000;
  for (let i = 0; i < 50; i++){ const mid = (lo + hi) / 2; if (priced(paying(v9, mid)).value >= 0) hi = mid; else lo = mid; }
  breakEven[name] = Math.ceil(hi / 100) * 100;
}
const required = termCheck(byId('jp_tokyo'), floorOf(byId('jp_tokyo'), 'ltda'), 6).requiredHours;
console.log(`\nRequired build to hold six hours to year 20: ${required.toFixed(2)}h per contracted kW.`);
console.log('Break-even award for a 9h build, at the platform\'s yields: '
  + Object.entries(breakEven).map(([a, v]) => `${a} ${yen(v)}`).join(', ') + ' per kW-year.');
