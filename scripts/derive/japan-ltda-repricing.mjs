/* ---------------------------------------------------------------------------
   JAPAN: THE AWARD RE-PRICED ON THE AUCTION'S OWN RULES — the derivations
   behind docs/japan-ltda-repricing-plan.md (gate G43, 2026-10-16).

   Read-only. Prices Japan's long-term auction award (LTDA) for a 9h build,
   the smallest that holds the six-hour floor to year 20, with:

     - the bid return METI lets a battery bidder include: 4.5% pre-tax WACC
       (Round 4, METI 006_s02_00 table 29), not the engine's 8%;
     - the award paid on awarded kW: installed kW × the area's 6h
       adjustment factor (Round 4 table 30), fixed for twenty years;
     - METI's battery cost inputs for opex (table 31): ¥7,000/kW-yr O&M,
       ¥900/kW-yr generation-side charge, 1.4% fixed-asset tax, and
       decommissioning at 5% of the build;
     - three capex levels: the engine's stack, METI's official average,
       and one awarded project's disclosed cost (FMS, ¥32,500/kWh).

   Nothing here changes the engine, the view store or a published number.

     node scripts/derive/japan-ltda-repricing.mjs
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
const { OEM_CAPEX_MULTIPLIER } = await imp('src/comparison/sponsorAssumptions.js');
setObservedFxSummary(JSON.parse(await readFile(path.join(ROOT, 'public/data/public/fx-ecb.summary.json'), 'utf8')));

const FACTOR = { tokyo: 0.907, kyushu: 0.933, hokkaido: 0.946 };   // Round 4 table 30, 6h
const RETURN_NOW = 0.08, RETURN_RULE = 0.045, YEARS = 20, FEE = 0.10;
const annuity = (r) => r / (1 - Math.pow(1 + r, -YEARS));
/* METI table 31, per installed kW of a 6h build; O&M scales with energy at the
   engine's own opexEnergyShare. Fixed-asset tax is 1.4% of book value, taken
   here at half the build on average over a straight-line twenty years. */
const ONM_KW = 7000, CHARGE_KW = 900, ASSET_TAX = 0.014 * 0.5, DECOM = 0.05;
const CAPEX = [
  ['engine stack (¥60k/kWh at 6h)', 1],
  ['METI average (¥69k/kWh at 6h)', 416000 / 360000],
  ['FMS-like (¥32.5k/kWh)', 32500 / 60000],
];
const MARKET_PRICES = [25000, 13000];   // trade-press battery lines, per awarded kW (gate G42)

const usd = (v) => (v >= 0 ? '+$' : '−$') + Math.abs(v / 1000).toFixed(0) + 'k';
const pct = (v) => v == null || !Number.isFinite(v) ? '—' : (v * 100).toFixed(1) + '%';
const yen = (v) => '¥' + Math.round(v).toLocaleString('en');

function priced(v){
  const atCod = runCase(v, 'ltda', 0), atExit = runCase(v, 'ltda', 5);
  return { value: atCod.exitVal - atCod.net, hold: atCod.irrHold, exit: atExit.irrExit };
}

console.log('| Area | Capex | Inputs | Award, per awarded kW | Value/MW | Hold IRR | Exit IRR (yr 5) |');
console.log('|---|---|---|---|---|---|---|');
for (const area of Object.keys(FACTOR)){
  const m = byId('jp_' + area);
  const name = area[0].toUpperCase() + area.slice(1);
  const base = marketAt(m, 'ltda', 9);
  const e9 = base.comparison.economics;
  const kept = m.comparison.economics.ltda.merchantRetention;
  const retained = (e9.merchGross * (1 - FEE) + (e9.services || 0)) * kept;

  for (const [label, k] of CAPEX){
    const sponsorCapex = e9.capexPerMW * k;
    const marketCapex = sponsorCapex / OEM_CAPEX_MULTIPLIER;
    const opexNew = (ONM_KW * (1 + 0.5 * (9 / 6 - 1)) + CHARGE_KW) * 1000 + ASSET_TAX * sponsorCapex;
    const variant = (opex, award, decom) => ({ ...base, comparison: { ...base.comparison, economics: {
      ...e9, capexPerMW: sponsorCapex, opexPerMW: opex,
      ...(decom ? { decommissioningPerMW: DECOM * sponsorCapex } : {}),
      ltda: { ...e9.ltda, payment: award * 1000 } } } });
    /* A cost bid per INSTALLED kW; the bidder offers it per awarded kW. */
    const bidInstalled = (r, opex, decom) => (marketCapex * (1 + (decom ? DECOM / Math.pow(1 + r, YEARS) : 0)) / 1000 * annuity(r)
      + opex / 1000 - retained / 1000);
    const rows = [
      ['today\'s inputs, 8% bid', bidInstalled(RETURN_NOW, e9.opexPerMW, false), e9.opexPerMW, false],
      ['METI rule: 4.5% bid, METI opex', bidInstalled(RETURN_RULE, opexNew, true), opexNew, true],
    ];
    for (const [inputs, perInstalled, opex, decom] of rows){
      const r = priced(variant(opex, perInstalled, decom));
      if (k === 1 || inputs.startsWith('METI'))
        console.log(`| ${name} | ${label} | ${inputs} | ${yen(perInstalled / FACTOR[area])} | ${usd(r.value)} | ${pct(r.hold)} | ${pct(r.exit)} |`);
    }
    for (const price of MARKET_PRICES){
      const r = priced(variant(opexNew, price * FACTOR[area], true));
      console.log(`| ${name} | ${label} | market line, METI opex | ${yen(price)} | ${usd(r.value)} | ${pct(r.hold)} | ${pct(r.exit)} |`);
    }
  }
}
const floor = floorOf(byId('jp_tokyo'), 'ltda');
console.log(`\nA 9h build holds ${termCheck(byId('jp_tokyo'), floor, 9).usableAtTermEnd.toFixed(2)}h in year 20 against the ${floor.hours}h floor.`);
