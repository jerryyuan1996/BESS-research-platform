/* ---------------------------------------------------------------------------
   THE PROVENANCE ENVELOPE.

   Every snapshot the ETL publishes has the same outer shape, whatever the
   source. A reader of any file — or of a diff in a pull request — can answer
   without leaving the file: where did this come from, when, what period does it
   cover, what units is it in, who is allowed to have written it, and has it
   changed since last time.

   Two checksums, and the distinction is the point:

     contentChecksum   covers the data only — series, derived values, coverage,
                       units. Stable across runs that fetch the same data.
     envelopeChecksum  covers everything including fetch timestamps.

   The runner compares contentChecksum to decide whether to write. Without that
   split, a six-hourly cron would commit an identical file four times a day with
   only `fetchedAt` differing, and the git history — which is the audit trail for
   this platform — would become useless for seeing when a number actually moved.
   --------------------------------------------------------------------------- */
import { createHash } from 'node:crypto';

/** Bump when the envelope shape changes in a way readers must notice. */
export const ENVELOPE_SCHEMA_VERSION = 1;

/**
 * Canonical JSON: object keys sorted at every depth, so two structurally equal
 * payloads hash identically regardless of the order a connector happened to
 * build them in. Without this, reordering a field in a connector would look like
 * a data change.
 */
export function canonicalize(value){
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  const out = {};
  for (const key of Object.keys(value).sort()){
    if (value[key] === undefined) continue;
    out[key] = canonicalize(value[key]);
  }
  return out;
}

export function sha256(value){
  return 'sha256:' + createHash('sha256')
    .update(JSON.stringify(canonicalize(value)))
    .digest('hex');
}

/**
 * Build a snapshot envelope.
 *
 * @param {object}   args
 * @param {object}   args.dataset    the catalogue entry from src/governance/datasets.js
 * @param {object}   args.coverage   { from, to, resolution, points }
 * @param {object}   args.units      e.g. { price: 'GBP/MWh' }
 * @param {Array}    args.series     the observed observations
 * @param {object}   [args.derived]  deterministic metrics computed from `series`
 * @param {string[]} [args.notes]    connector remarks worth carrying to a reader
 * @param {string}   [args.fetchedAt]  ISO instant; injected for reproducible tests
 * @returns {object} the snapshot, ready for writeSnapshot()
 */
export function buildSnapshot({ dataset, coverage, units, series, derived = null, notes = [], fetchedAt }){
  if (!dataset || !dataset.id) throw new Error('buildSnapshot: dataset is required');
  if (!Array.isArray(series)) throw new Error(`buildSnapshot(${dataset.id}): series must be an array`);

  if (!dataset.republishable && series.length > 0){
    // A licence constraint, enforced rather than remembered. A connector reading
    // a licensed source may compute against it but must publish an empty series.
    throw new Error(
      `buildSnapshot(${dataset.id}): dataset is marked republishable:false but a ` +
      `raw series was supplied. Publish derived statistics only, or nothing. ` +
      `See docs/data-policy.md.`);
  }

  // The data half of the snapshot — everything a change to which is a real
  // change. Deliberately excludes anything time-of-run.
  const content = {
    datasetId: dataset.id,
    marketId: dataset.marketId,
    coverage,
    units,
    series,
    derived,
  };

  const contentChecksum = sha256(content);

  const envelope = {
    schemaVersion: ENVELOPE_SCHEMA_VERSION,

    // ---- identity ----------------------------------------------------------
    datasetId: dataset.id,
    marketId: dataset.marketId,
    title: dataset.title,

    /* Authority is stamped into the file itself so a reader never has to infer
       it. Machine-written snapshots are observed data carrying derived metrics;
       nothing in this file is an analyst judgement, and the runtime uses this
       field to badge the value correctly on screen. */
    authority: 'observed',

    // ---- provenance --------------------------------------------------------
    source: dataset.source,
    fetchedAt: fetchedAt || new Date().toISOString(),
    coverage,
    units,

    // ---- payload -----------------------------------------------------------
    series,
    derived,
    notes,

    // ---- freshness contract ------------------------------------------------
    refreshHours: dataset.refreshHours,
    staleAfterHours: dataset.staleAfterHours,

    // ---- integrity ---------------------------------------------------------
    contentChecksum,
  };

  envelope.envelopeChecksum = sha256(envelope);
  return envelope;
}

/**
 * Verify a snapshot's content checksum. Used by the CI gate: a snapshot whose
 * payload does not match its recorded checksum was edited by hand, and a
 * hand-edited "observed" file is exactly the confusion this envelope exists to
 * prevent.
 */
export function verifyContentChecksum(snapshot){
  if (!snapshot || !snapshot.contentChecksum) return false;
  const recomputed = sha256({
    datasetId: snapshot.datasetId,
    marketId: snapshot.marketId,
    coverage: snapshot.coverage,
    units: snapshot.units,
    series: snapshot.series,
    derived: snapshot.derived,
  });
  return recomputed === snapshot.contentChecksum;
}
