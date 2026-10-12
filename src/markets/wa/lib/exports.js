/* ---------------------------------------------------------------------------
   CSV / JSON export, verbatim from the prototype (lines 4246-4332).
   Client-side only - a Blob and an object URL, no server involved.
   --------------------------------------------------------------------------- */
import { state } from '../state.js';
import { SEED } from '../data/seed.js';
import { RCM_HISTORY } from '../data/rcmHistory.js';
import { WEM_MARKET } from '../data/wemMarket.js';
import { NEM_SC } from '../data/nemScorecard.js';
import { KEMERTON, ESOO_BAL, hasProjectData } from '../data/kemerton.js';
import { dniScore, kemDurationCase } from '../lib/scores.js';

// ---------------- exports ----------------
function download(name, text, mime){
  const b = new Blob([text], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
function exportCsv(){
  const rows = [
    ['metric', 'value', 'unit', 'quality', 'status', 'source'],
    ['BRCP 2028-29', SEED.brcp2829, 'A$/MW/yr', 'official', 'SEED_JSON_V1', 'ERA / AEMO'],
    ['Peak RCP 2027-28', SEED.rcp2728, 'A$/MW/yr', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['Peak RCR 2028-29', SEED.peakRcr2829, 'MW', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['E&C above Peak RCR 2028-29', SEED.surplusAboveRcr, 'MW', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['Capacity supply ratio', (SEED.supplyRatio * 100).toFixed(1), '%', 'calculated', 'SEED_JSON_V1', 'dashboard'],
    ['Upper deadband headroom', SEED.upperDeadbandHeadroom, 'MW', 'calculated', 'SEED_JSON_V1', 'dashboard'],
    ['Battery fleet Q1 2026', SEED.fleetMW, 'MW', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['Battery fleet Q1 2026', SEED.fleetMWh, 'MWh', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['Energy price spread Q1 2026', SEED.spreadNow, 'A$/MWh', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['Energy price spread Q1 2025', SEED.spreadPrior, 'A$/MWh', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['Battery FCESS revenue Q1 2026', SEED.fcessBattRevNow, 'A$M', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['FCESS enablement cost Q1 2026', SEED.fcessCostNow, 'A$M', 'official', 'SEED_JSON_V1', 'AEMO'],
    ['ESR duration requirement 2028-29', SEED.esrHours, 'h', 'official', 'SEED_JSON_V1', 'AEMO / ESM Rules'],
    ['ESR duration requirement 2027-28', ESOO_BAL.esr2728Hours, 'h', 'official', 'SEED_JSON_V1', 'AEMO / ESM Rules'],
    ['Existing + committed battery 2028-29', ESOO_BAL.existingCommittedBessMW, 'MW', 'official', 'SEED_JSON_V1', '2026 WEM ESOO'],
    ['Storage share of SWIS peak demand (9 May 2026)', WEM_MARKET.records.peakSharePct, '%', 'public source', 'SEED_JSON_V1', 'Energy Policy WA (public)'],
    ['Battery share of FCESS contingency+regulation volume Q1 2026', 83, '%', 'official', 'SEED_JSON_V1', 'AEMO QED Q1 2026'],
    ['CIS Tenders 5+6 WA standalone storage awarded', WEM_MARKET.cis.t56StorageGWh, 'GWh', 'official', 'SEED_JSON_V1', 'DCCEEW / CIS'],
    ['Operating-asset valuation range (low)', WEM_MARKET.pricing.opSystemLo, 'A$/kWh', 'public source', 'SEED_JSON_V1', 'disclosed transactions'],
    ['Operating-asset valuation range (high)', WEM_MARKET.pricing.opSystemHi, 'A$/kWh', 'public source', 'SEED_JSON_V1', 'disclosed transactions'],
    ['NEM pipeline (context only, not WA)', NEM_SC.pipelineGW, 'GW', 'official (NEM namespace)', 'CONTEXT_ONLY', 'AEMO NEM Connection Scorecard Jun 2026'],
    ['NEM battery share of pipeline (context only, not WA)', NEM_SC.pipelineMix[0].pct, '%', 'official (NEM namespace)', 'CONTEXT_ONLY', 'AEMO NEM Connection Scorecard Jun 2026'],
    ['NEM full output achieved FY2026 (context only, not WA)', NEM_SC.fyOutput.fullGW, 'GW', 'official (NEM namespace)', 'CONTEXT_ONLY', 'AEMO NEM Connection Scorecard Jun 2026'],
    ['Duration-Need Index', dniScore(), '0-100', 'calculated (illustrative inputs)', 'SEED_JSON_V1', 'dashboard'],
    ['ERA reference capex intensity', KEMERTON.capex.eraBenchmarkPerKWh, 'A$/kWh', 'official final', 'SEED_JSON_V1', 'ERA BRCP final determination'],
  ];

  /* The confidential project rows are appended only where the local layer is
     present, and their LABELS come from that layer too.

     Keeping the labels here was not safe: they named the project and its
     financial model, and a gated block still ships its string literals. A `dist/` scan
     found them after the values themselves had already been moved out. */
  if (hasProjectData && Array.isArray(KEMERTON.exportRows)){
    const case85 = kemDurationCase(8.5);
    const value = (field) => {
      if (field === 'durationCase8_5') return case85 ? case85.headroom : '';
      return field.split('.').reduce((o, k) => (o == null ? undefined : o[k]), KEMERTON);
    };
    for (const r of KEMERTON.exportRows){
      rows.push([r.label, value(r.field), r.unit, r.basis, 'CONFIDENTIAL', r.source]);
    }
  }
  download('wa_bess_dashboard_kpis.csv', rows.map(r => r.join(',')).join('\n'), 'text/csv');
}
function exportJson(){
  const o = {
    asOf: SEED.asOf, modelVersion: SEED.modelVersion, language: state.lang,
    official: {
      brcp2829: SEED.brcp2829, rcp2728: SEED.rcp2728, peakRcr2829: SEED.peakRcr2829,
      surplusAboveRcr: SEED.surplusAboveRcr, fleetMW: SEED.fleetMW, fleetMWh: SEED.fleetMWh,
      spreadQ1_2026: SEED.spreadNow, spreadQ1_2025: SEED.spreadPrior,
      fcessBattRevQ1_2026_AM: SEED.fcessBattRevNow, fcessCostQ1_2026_AM: SEED.fcessCostNow, esrHours: SEED.esrHours,
    },
    calculated: {
      expectedCC: SEED.expectedCC, supplyRatioPct: +(SEED.supplyRatio * 100).toFixed(2),
      upperDeadbandHeadroomMW: SEED.upperDeadbandHeadroom, durationNeedIndex: dniScore(),
    },
    esooBalance2829: ESOO_BAL,
    rcmEvolution: { benchmarkTechnology: RCM_HISTORY.benchTech, esrPath: RCM_HISTORY.esr },
    wemMarketStructure: {
      records: WEM_MARKET.records, cis: WEM_MARKET.cis,
      exitRoutes: WEM_MARKET.exits.map(e => ({ route: e.n[0], when: e.w[0] })),
      transactionPricing: WEM_MARKET.pricing,
      holders: WEM_MARKET.holders.map(x => ({ type: x.k[0], holdPeriod: x.hold[0], returnRequirement: x.ret[0] })),
      note: 'Public-source compilation. Not official data; never used for scoring.',
    },
    nemContextOnly: {
      warning: 'NEM context only. Never fed into WA capacity balance, pipeline, merchant curve or scoring.',
      pipelineGW: NEM_SC.pipelineGW, pipelineMix: NEM_SC.pipelineMix.map(m => ({ tech: m.n[0], pct: m.pct })),
      fyApproved: NEM_SC.fyApproved, fyOutput: NEM_SC.fyOutput, stages: NEM_SC.stages.map(s => ({ stage: s.n[0], gw: s.gw, conversion: s.conv, typicalMonths: s.dur })),
      systemStrength: NEM_SC.sysStrength,
    },
    /* Public WEM capacity context, which was previously nested inside the
       confidential block and is not confidential at all — it is 2026 WEM ESOO
       and ERA material. */
    wemCapacityContext: KEMERTON.capacityContext,
    wemDurationThresholds: KEMERTON.duration,
    eraReference: {
      benchmarkPerKWh: KEMERTON.capex.eraBenchmarkPerKWh,
      referenceCapexAUD: KEMERTON.capex.eraReferenceCapexAUD,
      brcp: KEMERTON.capex.eraBRCP,
      fixedCapitalChargePerMW: KEMERTON.capex.fixedCapitalChargePerMW,
    },
    disclaimer: 'Seed snapshot only. Illustrative series excluded. Not investment advice.',
  };

  /* The confidential project layer is added only in a development build where
     local-data/ is present. A public export carries no key for it — not an empty
     one. */
  if (hasProjectData){
    o.kemertonConfidential = {
      project: KEMERTON.project,
      duration: { ...KEMERTON.duration, cases: [7, 7.5, 8, 8.5].map(kemDurationCase) },
      merchant: KEMERTON.merchant,
      marketServices: KEMERTON.marketServices,
      capex: KEMERTON.capex,
      grid: KEMERTON.grid,
      sourceStatus: Object.fromEntries(Object.entries(KEMERTON.sources).map(([k, v]) => [k, { file: v.file, status: v.status, date: v.date, applicable: v.cy }])),
    };
  }
  download('wa_bess_dashboard_seed.json', JSON.stringify(o, null, 2), 'application/json');
}


export { download, exportCsv, exportJson };
