/* ---------------------------------------------------------------------------
   ECB — euro foreign-exchange reference rates.

   Endpoint verified against the live service:
     https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml

   Returns EUR-based rates: <Cube currency='USD' rate='1.1367'/> means one euro
   buys 1.1367 dollars. The platform needs USD per unit of each market currency,
   so every rate is cross-computed through the euro:

       USD per GBP = (USD per EUR) / (GBP per EUR)

   The euro itself is the degenerate case — USD per EUR is quoted directly.

   These rates are OBSERVED. They are published as data and are NOT written into
   comparison/assumptions.js: the engine keeps using the analyst-approved FX
   until a human merges a change. See src/governance/authority.js for why a daily
   rate silently repricing every published IRR is the wrong behaviour.

   Published on TARGET business days only, around 16:00 CET. Weekend and holiday
   runs correctly find the same rates as Friday and write nothing.
   --------------------------------------------------------------------------- */
import { httpGetText } from '../lib/fetch.mjs';
import { buildSnapshot } from '../lib/envelope.mjs';

const URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

/** Currencies the platform needs, from src/comparison/assumptions.js. */
const NEEDED = ['AUD', 'CAD', 'GBP', 'JPY'];   // EUR is handled via the USD/EUR quote

/** Parse the ECB daily cube. Regex rather than an XML parser: the document is a
    flat, stable, machine-generated list of self-closing tags, and adding a
    dependency to read three attributes would be the wrong trade. */
function parseEcb(xml){
  const dateMatch = xml.match(/<Cube\s+time=['"](\d{4}-\d{2}-\d{2})['"]/);
  if (!dateMatch) throw new Error('ECB: no <Cube time=…> found — document shape changed');

  const rates = {};
  for (const m of xml.matchAll(/<Cube\s+currency=['"]([A-Z]{3})['"]\s+rate=['"]([\d.]+)['"]/g)){
    const v = Number(m[2]);
    if (Number.isFinite(v) && v > 0) rates[m[1]] = v;
  }
  if (Object.keys(rates).length === 0) throw new Error('ECB: no rates parsed');
  return { date: dateMatch[1], perEur: rates };
}

export async function fetchDataset({ dataset, log }){
  const xml = await httpGetText(URL, { log });
  const { date, perEur } = parseEcb(xml);

  const usdPerEur = perEur.USD;
  if (!usdPerEur) throw new Error('ECB: USD rate absent — cannot cross any pair');

  const t = `${date}T00:00:00Z`;
  const rates = { EUR: usdPerEur };

  for (const ccy of NEEDED){
    const perEurRate = perEur[ccy];
    if (!perEurRate){
      log(`  ECB: ${ccy} not quoted today — skipped`);
      continue;
    }
    rates[ccy] = usdPerEur / perEurRate;
  }

  /* The series carries one point per currency for the published date. A single
     day is the whole of what this source publishes at a time; history
     accumulates across runs through the standard merge. */
  const series = Object.entries(rates)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ccy, v]) => ({ t, v, k: ccy }));

  return {
    snapshot: buildSnapshot({
      dataset,
      coverage: { from: t, to: t, resolution: 'P1D', points: series.length },
      units: { rate: 'USD per 1 unit of currency' },
      series,
      derived: { asOf: date, usdPerEur, rates },
      notes: [
        'Cross-computed through the euro from ECB reference rates.',
        'Reference rates are indicative, not tradable — they are not dealable prices.',
      ],
    }),
    // What the drift detector compares against approved FX in assumptions.js.
    observations: Object.fromEntries(Object.entries(rates).map(([ccy, v]) => [`FX.${ccy}`, v])),
  };
}
