/* ---------------------------------------------------------------------------
   WEM market-level capacity data (public) + a project underwriting layer
   (confidential, loaded only in development).

   The split follows what the data actually is, not what is convenient:

     PUBLIC        2026 WEM ESOO capacity balance, ERA BRCP determinations, the
                   WEM duration thresholds, and AEMO's CRC calendar. All of it is
                   published by AEMO or the ERA and is properly part of a public
                   research site.

     CONFIDENTIAL  the named project — its address, technical specification,
                   developer-reported trading assumptions, financial-model capex,
                   connection-study findings, and the Drive links to those
                   documents. `local-data/wa-kemerton-project.json`.

   The prototype carried both in one file and shipped both. That file's own
   comment said all project content was confined to the Portfolio tab, which had
   stopped being true — it had reached the duration, grid, FCESS and export
   layers as well.

   Callers must treat `KEMERTON.project` and the other confidential blocks as
   possibly null, because in production they always are. `hasProjectData` is the
   flag to branch on; the public blocks are always present.
   --------------------------------------------------------------------------- */
import { SRC } from '../sources.js';
import { loadLocal } from '../../../local/loader.js';

const LOCAL = loadLocal('wa-kemerton-project');

/** True when the confidential project layer is available. Always false in a build. */
export const hasProjectData = LOCAL !== null;

/* ---- public: WEM duration requirement thresholds -------------------------- */
const durationPublic = {
  currentRequirementHours: 7.0,
  fixedPriceBaseThresholdHours: 7.5,
  sensitivityLowHours: 8.0,
  sensitivityHighHours: 8.5,
};

/* ---- public: 2026 WEM ESOO capacity context ------------------------------- */
const capacityContext = {
  peakRCTMW: 6323, existingCommittedMW: 6670, headlineSurplusMW: 347,
  durationUpliftMW: 392, committedDeliveryMW: 889, anticipatedMW: 622,
  eoiPressureMW: 2000, vppPeakReductionMW: 200,
};

/* ---- public: ERA reference capex and capacity price ----------------------- */
const capexPublic = {
  eraBenchmarkPerKWh: 521,
  eraReferenceCapexAUD: 625600000,
  eraBRCP: 488500,
  fixedCapitalChargePerMW: 100000,
};

/* ---- public: AEMO Reserve Capacity Cycle calendar ------------------------- */
const schedule = [
  ['7 Jul 2026', ['CRC applications close', 'CRC申请截止']],
  ['25 Aug 2026', ['AEMO notifies Peak and Flexible CRC', 'AEMO通知峰值及灵活CRC']],
  ['7 Sep 2026', ['Security, trade declaration and 5-/10-year fixed-price nomination', '保证金、交易声明及5/10年固定价选择']],
  ['13 Oct 2026', ['Capacity Credits assigned; NAQ notified; initial price information', '容量信用分配；NAQ通知；初始价格信息']],
  ['19 Nov 2026', ['Component credits, category prices and RCR adequacy determination', '分项信用、分类价格及RCR充足性结论']],
];

/**
 * The assembled dataset.
 *
 * Confidential blocks are null when absent rather than empty objects, so a
 * caller that forgets to check fails loudly on property access instead of
 * quietly computing with zeros. That is the same reason the comparison engine
 * returns `{ na }` rather than 0 for an unavailable strategy.
 */
const KEMERTON = {
  // public
  capacityContext,
  schedule,
  duration: { ...durationPublic, ...(LOCAL?.durationProject ?? {}) },
  capex: { ...capexPublic, ...(LOCAL?.capexProject ?? {}) },

  // confidential — null in production
  project: LOCAL?.project ?? null,
  merchant: LOCAL?.merchant ?? null,
  marketServices: LOCAL?.marketServices ?? null,
  grid: LOCAL?.grid ?? null,
  configHistory: LOCAL?.configHistory ?? null,
  /* Export row labels live in the local layer too — they name the project and
     its financial model, so keeping them in src/ shipped them in the bundle. */
  exportRows: LOCAL?.exportRows ?? null,

  /* Source register: the public entries always resolve; the confidential
     document links exist only where the local layer is present. */
  sources: {
    esoo: SRC.esoo, brcp: SRC.brcp, crc: SRC.crc, tsp: SRC.tsp,
    ...(LOCAL?.sources ?? {}),
  },
};

/**
 * Market-level 2028-29 capacity balance (2026 WEM ESOO, 15 Jul 2026) — RCM tab.
 * Entirely public: it derives from the ESOO capacity context above, not from the
 * project layer, which is why the RCM and story tabs are unaffected by whether
 * confidential data is present.
 */
const ESOO_BAL = Object.assign({}, capacityContext, {
  existingCommittedBessMW: 1666,   // existing + committed SWIS battery forecast operational by 2028-29
  reliabilityMetYears: 3,          // reliability target expected to be met over the next three years
  esr2829Hours: 7, esr2728Hours: 6,
  consumption3536TWh: 32.1, peakRct3536MW: 7454, thermalExit3536MW: 1661, ecGap3536MW: -2161,
});

export { KEMERTON, ESOO_BAL };
