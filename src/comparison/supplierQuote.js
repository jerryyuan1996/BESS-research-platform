/* ---------------------------------------------------------------------------
   THE SUPPLIER QUOTATION — the DC block and its service package, as priced.

   HiTHIUM Energy Storage Technology Deutschland GmbH, quotation of 15 October
   2026, revision 1.1, in EUR: thirteen 20 ft liquid-cooled 6,250 kWh DC blocks
   for a two-hour project, FOB, with commissioning and an optional long-term
   service agreement. Read with HiTHIUM's EU BESS Master Supply Agreement
   template of 11 June 2026. Practitioner evidence, supplied by the analyst and
   published by his ruling of 16 October 2026 (docs/supplier-quote-2026-10-plan.md).

   What it prices, and therefore what it may move:

     the DC block      €73.45/kWh nameplate + €0.77 commissioning = €74.22/kWh
     the package       warranty extension (years 6–25), preventive maintenance,
                       and the RTE and 97% availability guarantees (years 1–20),
                       on the annual-payment plan with its 3% escalator

   What it does not price: PCS, transformer, balance of plant, EPC, grid
   connection, freight, customs, VAT and EU battery-regulation recycling. Those
   stay on each market's own evidence.

   Two conversions make a DC-nameplate FOB price comparable with the engine's
   per-MW, at-the-meter, real-terms economics. Both are stated, not hidden:

     at the meter   the project is 70 MWh at the meter for 81.25 MWh nameplate,
                    so every nameplate kWh costs 81.25 / 70 = 1.1607 meter kWh
     real terms     the engine holds opex flat (it carries no inflation), so the
                    package's nominal annual plan is deflated at 2% a year

   Layering: pure data and arithmetic. No DOM, no clock, no market imports.
   --------------------------------------------------------------------------- */
import { heldQuotedStack, rebuiltQuotedStack, buildCapex, CAPEX_SHARES } from './capex.js';
import { LIFE } from './assumptions.js';

export const QUOTE = {
  supplier: 'HiTHIUM Energy Storage Technology Deutschland GmbH',
  date: '2026-10-15',
  revision: '1.1',
  currency: 'EUR',
  incoterm: 'FOB',
  units: 13,
  unitKWh: 6250,
  durationHours: 2,
  /* Designed beginning-of-life capacity, DC nameplate, and the project's
     energy at the meter it is sized to deliver. */
  nameplateKWh: 81250,
  meterKWh: 70000,
  unitPriceEUR: 459062.50,                  // ESS container, 20 ft, 6,250 kWh
  commissioningPerUnitEUR: 4800,
  deliveryDays: [130, 150],                 // after PO countersignature
  standardWarrantyYears: 5,
  sohFloorPct: 65,                          // extended warranty condition
  availabilityGuaranteePct: 97,
  escalatorPct: 3,                          // annual-payment plan, from year 1 (year 6 for warranty)
  /* ±USD 0.6/kWh nameplate per ±$1,000/t of the 30-day Li2CO3 average before PO. */
  lithium: { basisUsdPerT: 20000, usdPerKWhPer1000: 0.6, index: 'SMM battery-grade Li2CO3' },
  fx: { eurUsd: 1.1195, bandPct: 2.5 },
  excluded: ['freight', 'customs duty (2.7%)', 'tariff adders', 'VAT', 'EU Battery Regulation EPR / recycling'],
};

export const QUOTE_TOTALS = {
  dcBlocksEUR: QUOTE.units * QUOTE.unitPriceEUR,                    // 5,967,812.50
  commissioningEUR: QUOTE.units * QUOTE.commissioningPerUnitEUR,    // 62,400.00
};
QUOTE_TOTALS.capexEUR = QUOTE_TOTALS.dcBlocksEUR + QUOTE_TOTALS.commissioningEUR;  // 6,030,212.50

/** €/kWh nameplate, as the quotation prints them. */
export const DC_BLOCK_EUR_PER_KWH = QUOTE.unitPriceEUR / QUOTE.unitKWh;                       // 73.45
export const COMMISSIONING_EUR_PER_KWH = QUOTE_TOTALS.commissioningEUR / QUOTE.nameplateKWh;  // 0.768
export const OVERSIZE = QUOTE.nameplateKWh / QUOTE.meterKWh;                                  // 1.1607

/* The LTSA annual pricing table, EUR per year for the whole 81.25 MWh, exactly
   as quoted. Year 1 is the first operating year. Warranty is included in the
   standard five years; the RTE and availability guarantees are offered for
   years 1–20 only. */
export const LTSA_ANNUAL_EUR = [
  //  warranty     PMP        RTE      availability
  [        0, 26301.79, 2988.84,  5977.68],   //  1
  [        0, 27090.84, 3078.51,  6157.01],   //  2
  [        0, 27903.56, 3170.86,  6341.72],   //  3
  [        0, 28740.67, 3265.99,  6531.97],   //  4
  [        0, 29602.89, 3363.97,  6727.93],   //  5
  [ 65007.26, 30490.98, 3464.89,  6929.77],   //  6
  [ 66957.47, 31405.71, 3568.84,  7137.66],   //  7
  [ 68966.20, 32347.88, 3675.90,  7351.79],   //  8
  [ 71035.18, 33318.32, 3786.18,  7572.34],   //  9
  [ 73166.24, 34317.86, 3899.76,  7799.51],   // 10
  [ 84023.43, 35347.40, 4016.76,  8033.50],   // 11
  [ 86544.13, 36407.82, 4137.26,  8274.50],   // 12
  [ 89140.46, 37500.06, 4261.38,  8522.74],   // 13
  [ 91814.67, 38625.06, 4389.22,  8778.42],   // 14
  [ 94569.11, 39783.81, 4520.89,  9041.77],   // 15
  [107448.07, 40977.33, 4656.52,  9313.03],   // 16
  [110671.51, 42206.64, 4796.22,  9592.42],   // 17
  [113991.65, 43472.84, 4940.10,  9880.19],   // 18
  [117411.40, 44777.03, 5088.31, 10176.60],   // 19
  [120933.75, 46120.34, 5240.96, 10481.89],   // 20
  [136203.04, 47503.95,       0,        0],   // 21
  [140289.13, 48929.07,       0,        0],   // 22
  [144497.80, 50396.94,       0,        0],   // 23
  [148832.74, 51908.85,       0,        0],   // 24
  [153297.72, 53466.11,       0,        0],   // 25
];

/* ---------------------------------------------------------------------------
   Landed DC block, per kWh at the meter.

   FREIGHT is ocean freight, marine insurance and inland haulage, which the FOB
   price excludes. No figure is published for it; €1.5/kWh nameplate is about
   €9,400 a container. Gate Q-1.

   DUTY is on the goods only, not on commissioning. 2.7% is the quotation's own
   EU figure; the UK is taken at the same rate (gate Q-2). Australia (ChAFTA)
   and Japan admit lithium-ion batteries duty-free. Canada charges 7% MFN on
   tariff item 8507.60.90 ("Lithium-ion — Other", Customs Tariff T2026), and its
   China Surtax Order lists nothing under heading 8507 (SOR/2024-187 as amended
   by SOR/2026-33).
   --------------------------------------------------------------------------- */
export const FREIGHT_EUR_PER_KWH = 1.5;
/* USD: a Chinese lithium-ion battery entered in October 2026 pays 3.4% MFN on
   8507.60, 25% under Section 301 (from 1 January 2026) and a further 12.5% under
   Section 301 (from 24 July 2026), 40.9% in all. The IEEPA tariffs were struck
   down on 20 February 2026 and the Section 122 surcharge expired on 24 July 2026
   (AES and Energy Vault 10-Qs, 2026; trade-press tariff tables). */
export const DUTY_PCT = { EUR: 2.7, GBP: 2.7, AUD: 0, JPY: 0, CAD: 7, USD: 40.9 };

/* A US DC block from a supplier that is not a prohibited foreign entity costs
   about $50/kWh nameplate more than a landed Chinese one: US-made blocks at
   $160–180/kWh against about $120 for Chinese blocks after tariffs, shipping and
   service (Latitude Media, 28 August 2026). Only such a block lets a 2026
   construction start meet the 55% material-assistance ratio the storage credit
   requires; Chinese cells alone are about 52% of equipment cost. */
export const NON_FEOC_PREMIUM_USD_PER_KWH = 50;

/* ECB euro reference rates on the quotation's date, 15 October 2026, cross-
   computed through USD exactly as the fx-ecb feed publishes them. Fixed here so
   the published conversion does not drift with each day's rate. */
export const QUOTE_FX_DATE = '2026-10-15';
/* CAD: ECB 15 Oct 2026, 1.5923 CAD and 1.1208 USD per euro → 1.1208 / 1.5923. */
const USD_PER = { EUR: 1.1208, GBP: 1.3246661151164165, AUD: 0.6910839807621162, JPY: 0.006330057607590647, CAD: 1.1208 / 1.5923, USD: 1 };
export const EUR_TO = Object.fromEntries(Object.entries(USD_PER).map(([cur, usd]) => [cur, USD_PER.EUR / usd]));

/** Landed DC block, market currency per kWh at the meter. */
export function landedDcPerKWh(currency){
  const duty = DUTY_PCT[currency];
  const fx = EUR_TO[currency];
  if (duty == null || fx == null) throw new Error(`supplierQuote: no landed basis for ${currency}`);
  const perNameplateKWh = DC_BLOCK_EUR_PER_KWH * (1 + duty / 100) + COMMISSIONING_EUR_PER_KWH + FREIGHT_EUR_PER_KWH;
  return perNameplateKWh * OVERSIZE * fx;
}

/* ---------------------------------------------------------------------------
   The service package, per kWh at the meter, in real terms.

   The annual plan is nominal: it escalates 3% a year and steps up when each
   five-year warranty block begins. The engine is real-terms, so each year is
   deflated at CPI_PCT. What remains is the escalator above inflation and the
   warranty step-ups, which is why the line is back-loaded: €0.49/kWh in year 1,
   €1.34 in year 6 and €1.57 in year 15.
   --------------------------------------------------------------------------- */
export const CPI_PCT = 2;
export const PACKAGE_YEARS = LTSA_ANNUAL_EUR.length;    // 25

export const PACKAGE_EUR_PER_KWH = LTSA_ANNUAL_EUR.map((row, i) =>
  row.reduce((a, v) => a + v, 0) / Math.pow(1 + CPI_PCT / 100, i + 1) / QUOTE.meterKWh);

/**
 * The package as a yearly schedule, market currency per MW, years 1 … 25.
 *
 * It scales with stored energy: the PMP, warranty and guarantees are priced
 * per DC block, and a longer battery has proportionally more of them.
 */
export function serviceSchedulePerMW(hours, currency){
  const fx = EUR_TO[currency];
  if (fx == null) throw new Error(`supplierQuote: no FX for ${currency}`);
  return PACKAGE_EUR_PER_KWH.map(v => v * hours * 1000 * fx);
}

/** Mean of the first `years` of a schedule — what a flat seed would have held. */
export function scheduleMean(schedule, years){
  const head = schedule.slice(0, years);
  return head.reduce((a, v) => a + v, 0) / head.length;
}

/** Plain-number summary for prose and the methodology page. */
export const QUOTE_SUMMARY = {
  capexEURPerKWhNameplate: QUOTE_TOTALS.capexEUR / QUOTE.nameplateKWh,   // 74.22
  landedEURPerKWhMeter: landedDcPerKWh('EUR'),                           // 90.19
  packageYear1: PACKAGE_EUR_PER_KWH[0],                                  // 0.494
  packageYear6: PACKAGE_EUR_PER_KWH[5],                                  // 1.343
  packageYear15: PACKAGE_EUR_PER_KWH[14],                                // 1.570
};

/**
 * What a market's comparison interface declares once the quote is applied.
 *
 * @param {object} o
 * @param {string} o.currency        market currency (EUR, GBP, AUD, JPY)
 * @param {number} o.hours           archetype duration
 * @param {'held'|'rebuilt'} o.method  see src/comparison/capex.js
 * @param {number} o.total           held: installed cost per MW at `hours`;
 *                                   rebuilt: the benchmark per MW at `benchmarkHours`
 * @param {number} [o.benchmarkHours] rebuilt only; defaults to `hours`
 * @param {number} o.opexSeed        the flat fixed-opex seed the package sits inside
 */
export function quotedEconomics({ currency, hours, method, total, benchmarkHours = hours, opexSeed }){
  const d = landedDcPerKWh(currency);
  const capexStack = method === 'held'
    ? heldQuotedStack(total, hours, d)
    : rebuiltQuotedStack(total, benchmarkHours, d);
  const capexPerMW = method === 'held' ? total : buildCapex(capexStack, hours).total;
  const serviceSchedule = serviceSchedulePerMW(hours, currency);
  const serviceMean = scheduleMean(serviceSchedule, LIFE);
  return {
    dcPerKWh: d,
    capexPerMW,
    capexQuotedPerMW: d * hours * 1000,
    capexStack,
    serviceSchedulePerMW: serviceSchedule,
    serviceMeanPerMW: serviceMean,
    otherOpexPerMW: opexSeed - serviceMean,
  };
}

/**
 * US installed cost under a named DC-block supply, USD per MW.
 * The benchmark's non-DC share (44%) is kept and its DC share replaced by the
 * landed block: 'chinese' is the quotation under the US duty stack; 'non-feoc'
 * adds the compliant-supply premium. Same swap as a rebuilt market's band end.
 */
export function usSupplyCapex(total, hours, supply){
  const premium = supply === 'non-feoc' ? NON_FEOC_PREMIUM_USD_PER_KWH * OVERSIZE : 0;
  return (1 - CAPEX_SHARES.dcBlock) * total + (landedDcPerKWh('USD') + premium) * hours * 1000;
}

/** A rebuilt market's band end: the same swap applied to a benchmark at its own duration. */
export function rebuiltEnd(benchmarkEnd, hours, currency){
  const s = CAPEX_SHARES;
  return benchmarkEnd == null ? null : (1 - s.dcBlock) * benchmarkEnd + landedDcPerKWh(currency) * hours * 1000;
}

/* The two documents, as source-register entries. Registered in every market
   whose capex or opex now reads them (src/markets/<id>/sources.js). A supplier
   pricing its own supply is a counterparty describing its own deal. */
export const QUOTE_SOURCES = {
  hithiumQuote: {
    file: 'HiTHIUM Energy Storage Technology Deutschland GmbH — BESS quotation, 13 × 6.25 MWh DC blocks, 20-year warranty',
    status: ['Supplier quotation', '供应商报价'],
    provenance: { authority: 'counterparty-reported', publication: 'final', availability: 'public', verification: 'verified' },
    date: '15 Oct 2026', url: '',
    cy: 'DC block €459,062.50 per 6.25 MWh container (€73.45/kWh) plus €4,800 commissioning each, FOB, €74.22/kWh nameplate in all; LTSA annual plan (warranty years 6–25, preventive maintenance, RTE and 97% availability guarantees years 1–20) with a 3% escalator',
    authority: 'observed',
    historical: 'One quotation, revision 1.1',
    forecast: 'Li2CO3 indexation ±USD 0.6/kWh per $1,000/t from $20,000/t; EUR/USD 1.1195 ±2.5%',
    frequency: 'One-off', format: 'PDF quotation', machineReadable: 'No',
    automation: 'D — analyst-supplied document', lastChecked: '2026-10-17',
    freshness: 'Valid 30 days from 15 Oct 2026',
  },
  hithiumMsa: {
    file: 'HiTHIUM — Master Supply Agreement template, EU BESS',
    status: ['Supplier contract template', '供应商合同模板'],
    provenance: { authority: 'counterparty-reported', publication: 'draft', availability: 'public', verification: 'verified' },
    date: '11 Jun 2026', url: '',
    cy: 'Payment 15/15/30/40% to shipment; guarantees conditional on PMP and warranty; LDs capped 5% per guarantee, 10% aggregate, delay 0.05%/day to 5%; liability 100% of PO; FX, Li2CO3 and shipping re-openers',
    authority: 'observed',
    historical: 'Template; exhibits G–M blank', forecast: 'None', frequency: 'One-off',
    format: 'Word template', machineReadable: 'No', automation: 'D — analyst-supplied document',
    lastChecked: '2026-10-17', freshness: 'Template of 11 Jun 2026',
  },
};
