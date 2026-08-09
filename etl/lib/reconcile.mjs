/* ---------------------------------------------------------------------------
   DATASET-LEVEL RECONCILIATION.

   Parser validation asks "is this record well formed". Reconciliation asks the
   different and harder question: "is this DATASET plausible, and is it plausible
   GIVEN THE LAST ONE WE ACCEPTED".

   Every failure this catches produces a file full of individually valid records:

     a register that halves overnight        — a filter matched a renamed column
     a fleet whose MW doubles                — a unit conversion slipped
     every status suddenly "operating"       — a status map stopped matching
     duplicate ids                           — a join fanned out
     null rates that jump                    — an optional column disappeared
     coordinates all at 0,0                  — empty cells read as numbers
     commissioning dates in 1899             — an Excel serial read as a year

   Findings are SEVERITY-TAGGED rather than boolean. An `error` is structurally
   wrong and must never publish. A `warning` is suspicious — a 40% drop in record
   count is usually a broken filter and occasionally a genuine restatement — and
   the pipeline treats it as blocking unless a human accepts it, because the
   alternative is overwriting good data with a plausible mistake.
   --------------------------------------------------------------------------- */
import { energyMWh, isPlottable, MAPPED_STAGES } from '../../src/projects/schema.js';

export const SEVERITY = { ERROR: 'error', WARNING: 'warning', INFO: 'info' };

/* Thresholds for change against the last accepted snapshot. Deliberately wide:
   these exist to catch a broken ingestion, not to police a market that grew. */
export const DRIFT = {
  recordCountDrop: 0.25,        // a quarter of the register vanishing
  recordCountJump: 1.50,        // or more than doubling-and-a-half
  capacityDrop: 0.25,
  capacityJump: 1.50,
  nullRateJump: 0.20,           // 20 percentage points more nulls in a field
};

const pct = (part, whole) => (whole ? part / whole : 0);
const sum = (values) => values.reduce((total, value) => total + value, 0);

/**
 * Summarise a dataset. The same shape is stored with an accepted snapshot so the
 * next run has something to compare against.
 */
export function summarise(projects){
  const located = projects.filter(isPlottable);
  const withEnergy = projects.filter(p => energyMWh(p) != null);

  const byStage = {};
  for (const project of projects){
    byStage[project.stage] = (byStage[project.stage] || 0) + 1;
  }

  const nullRates = {};
  for (const field of ['operator', 'expectedCod', 'durationHours', 'lat']){
    nullRates[field] = Number(pct(projects.filter(p => p[field] == null).length, projects.length).toFixed(4));
  }

  return {
    records: projects.length,
    totalMW: Number(sum(projects.map(p => p.capacityMW || 0)).toFixed(3)),
    // Only from records that publish one; a partial sum is not a fleet energy.
    totalMWh: withEnergy.length
      ? Number(sum(withEnergy.map(energyMWh)).toFixed(3))
      : null,
    withEnergy: withEnergy.length,
    located: located.length,
    byStage,
    nullRates,
  };
}

/**
 * Reconcile a candidate dataset, optionally against the last accepted summary.
 *
 * @param {object[]} projects
 * @param {object} [options]
 * @param {?object} [options.previous]  a summary from a previously accepted run
 * @param {string} [options.label]
 * @returns {{ok:boolean, summary:object, findings:object[]}}
 */
export function reconcile(projects, { previous = null, label = 'dataset' } = {}){
  const findings = [];
  const add = (severity, code, message, detail) =>
    findings.push({ severity, code, message: `${label}: ${message}`, ...(detail ? { detail } : {}) });

  const summary = summarise(projects);

  /* ---- structural: never publishable ----------------------------------- */

  if (!projects.length){
    add(SEVERITY.ERROR, 'empty', 'produced no records at all');
    return { ok: false, summary, findings };
  }

  const ids = new Map();
  for (const project of projects) ids.set(project.id, (ids.get(project.id) || 0) + 1);
  const duplicates = [...ids].filter(([, n]) => n > 1).map(([id]) => id);
  if (duplicates.length){
    add(SEVERITY.ERROR, 'duplicate-ids',
      `${duplicates.length} duplicate id(s) — a join has fanned out`, duplicates.slice(0, 10));
  }

  const badCapacity = projects.filter(p => !Number.isFinite(p.capacityMW) || p.capacityMW <= 0);
  if (badCapacity.length){
    add(SEVERITY.ERROR, 'invalid-capacity',
      `${badCapacity.length} record(s) with a non-positive or non-finite capacity`,
      badCapacity.slice(0, 5).map(p => p.id));
  }

  const badStage = projects.filter(p => !MAPPED_STAGES.includes(p.stage));
  if (badStage.length){
    add(SEVERITY.ERROR, 'unmapped-stage',
      `${badStage.length} record(s) in a stage the map does not render`,
      [...new Set(badStage.map(p => p.stage))]);
  }

  /* A coordinate that exists must be usable. Null island is the signature of an
     empty cell read as a number, and it is a US plant in the Gulf of Guinea. */
  const nullIsland = projects.filter(p => p.lat === 0 && p.lon === 0);
  if (nullIsland.length){
    add(SEVERITY.ERROR, 'null-island',
      `${nullIsland.length} record(s) at 0°,0° — empty cells read as numbers`,
      nullIsland.slice(0, 5).map(p => p.id));
  }

  const badCoord = projects.filter(p =>
    (p.lat != null || p.lon != null) && !isPlottable(p) && !(p.lat === 0 && p.lon === 0));
  if (badCoord.length){
    add(SEVERITY.ERROR, 'invalid-coordinates',
      `${badCoord.length} record(s) with a half-declared or out-of-range position`,
      badCoord.slice(0, 5).map(p => p.id));
  }

  /* Excel serial dates read as text land in 1899-1900; a COD centuries out is a
     parse error, not a project. */
  const badDates = projects.filter(p => {
    if (!p.expectedCod) return false;
    const year = Number(String(p.expectedCod).slice(0, 4));
    return !Number.isFinite(year) || year < 1990 || year > 2060;
  });
  if (badDates.length){
    add(SEVERITY.ERROR, 'impossible-dates',
      `${badDates.length} record(s) with a commissioning date outside 1990–2060`,
      badDates.slice(0, 5).map(p => `${p.id}: ${p.expectedCod}`));
  }

  const badDuration = projects.filter(p =>
    p.durationHours != null && (!Number.isFinite(p.durationHours) || p.durationHours <= 0 || p.durationHours > 24));
  if (badDuration.length){
    add(SEVERITY.ERROR, 'implausible-duration',
      `${badDuration.length} record(s) with a duration outside 0–24 hours`,
      badDuration.slice(0, 5).map(p => `${p.id}: ${p.durationHours}h`));
  }

  /* ---- drift: suspicious, and blocking until a human looks -------------- */

  if (previous){
    const ratio = (now, before) => (before ? now / before : null);

    const recordRatio = ratio(summary.records, previous.records);
    if (recordRatio != null && recordRatio < DRIFT.recordCountDrop){
      add(SEVERITY.WARNING, 'record-count-drop',
        `records fell from ${previous.records} to ${summary.records} `
        + `(${Math.round(recordRatio * 100)}% of the last accepted run)`);
    }
    if (recordRatio != null && recordRatio > DRIFT.recordCountJump){
      add(SEVERITY.WARNING, 'record-count-jump',
        `records rose from ${previous.records} to ${summary.records}`);
    }

    const mwRatio = ratio(summary.totalMW, previous.totalMW);
    if (mwRatio != null && mwRatio < DRIFT.capacityDrop){
      add(SEVERITY.WARNING, 'capacity-drop',
        `total capacity fell from ${previous.totalMW} MW to ${summary.totalMW} MW`);
    }
    if (mwRatio != null && mwRatio > DRIFT.capacityJump){
      /* The unit-conversion signature. A kW/MW slip multiplies by exactly 1,000
         and every record stays individually valid. */
      add(SEVERITY.WARNING, 'capacity-jump',
        `total capacity rose from ${previous.totalMW} MW to ${summary.totalMW} MW`
        + (mwRatio > 900 && mwRatio < 1100 ? ' — close to 1,000×, check the unit conversion' : ''));
    }

    for (const [field, rate] of Object.entries(summary.nullRates)){
      const before = previous.nullRates?.[field];
      if (before == null) continue;
      if (rate - before > DRIFT.nullRateJump){
        add(SEVERITY.WARNING, 'null-rate-jump',
          `${field} is null in ${Math.round(rate * 100)}% of records, up from ${Math.round(before * 100)}% `
          + '— a column may have been renamed');
      }
    }

    /* A status map that stops matching sends every record into one bucket. */
    for (const stage of MAPPED_STAGES){
      const now = summary.byStage[stage] || 0;
      const before = previous.byStage?.[stage] || 0;
      if (before >= 5 && now === 0){
        add(SEVERITY.WARNING, 'stage-vanished',
          `no records in stage "${stage}", down from ${before} — check the status mapping`);
      }
    }
  } else {
    add(SEVERITY.INFO, 'no-baseline', 'no previously accepted snapshot to compare against');
  }

  const blocking = findings.filter(f => f.severity !== SEVERITY.INFO);
  return { ok: blocking.length === 0, summary, findings };
}

/** A short human-readable report. Written to the console and to the diagnostic. */
export function formatFindings(findings){
  if (!findings.length) return '  (nothing to report)';
  const order = { error: 0, warning: 1, info: 2 };
  return [...findings]
    .sort((a, b) => order[a.severity] - order[b.severity])
    .map(f => {
      const mark = f.severity === SEVERITY.ERROR ? '✖' : f.severity === SEVERITY.WARNING ? '!' : '·';
      const detail = f.detail ? `\n      ${JSON.stringify(f.detail)}` : '';
      return `  ${mark} [${f.code}] ${f.message}${detail}`;
    })
    .join('\n');
}
