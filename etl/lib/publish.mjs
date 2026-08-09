/* ---------------------------------------------------------------------------
   ATOMIC PUBLICATION.

     download → parse → normalize → validate → reconcile → publish

   Every stage can fail, and a failure at any of them must leave the last
   known-good artifact exactly as it was. That is the whole design: the previous
   file is the production artifact, and a run that cannot prove it has something
   better has no business touching it.

   THE FAILURE THIS PREVENTS. A register renames a column. The parser reads
   `undefined` for every row, the transform drops every record, and the run
   publishes an empty but perfectly valid file over a good one. Nothing throws,
   the tests pass, and a market silently loses its pipeline until somebody
   notices. Reconciliation catches it; atomicity is what makes catching it
   useful.

   WHAT ATOMIC MEANS HERE. Write to a temporary file in the same directory, then
   rename. `rename` within a filesystem is atomic, so a reader never sees a
   half-written file and a crash mid-write cannot corrupt the artifact. The
   previous version is kept alongside as `.previous.json` so a bad accepted run
   can be reversed without a re-fetch.

   A rejected run writes a diagnostic and returns a non-zero-ish result. It does
   not throw: the caller usually has other datasets to attempt, and one bad
   register should not abort the rest.
   --------------------------------------------------------------------------- */
import { validateProjects } from '../../src/projects/schema.js';
import { reconcile, formatFindings, SEVERITY } from './reconcile.mjs';
import { writeAtomic, copyWithin, removeWithin, readTextIfPresent } from './boundary.mjs';

/* Paths here are REPO-RELATIVE and every write goes through the boundary, which
   confines them to public/data/public/. This module owns the policy — whether a
   dataset may replace the last known-good artifact — and boundary.mjs owns the
   mechanism. Importing node:fs here would bypass the containment checks that are
   the repository's entire governance model, so it does not. */
const baseName = (p) => String(p).split('/').pop();

/** Read the summary of the last accepted run, or null on a first publish. */
export async function lastAccepted(file){
  const text = await readTextIfPresent(file);
  if (text == null) return null;
  try {
    return JSON.parse(text)?.summary ?? null;
  } catch {
    /* An unreadable artifact is not a baseline. It is also not a reason to
       refuse the new one — publishing over corruption is an improvement. */
    return null;
  }
}

/**
 * Validate, reconcile and — only if both pass — publish atomically.
 *
 * @param {object} spec
 * @param {string} spec.file          destination path
 * @param {object[]} spec.projects    normalized records
 * @param {object} spec.meta          marketId, source, licence, publishedAt, ingestedAt …
 * @param {boolean} [spec.acceptDrift] a human has looked at the warnings and accepts them
 * @param {(msg:string)=>void} [spec.log]
 * @returns {{published:boolean, findings:object[], summary:object, diagnostic:?string}}
 */
export async function publishDataset({ file, projects, meta, acceptDrift = false, log = () => {} }){
  const label = meta?.label || baseName(file);

  /* ---- validate: every record well formed ------------------------------ */
  const problems = validateProjects(projects);
  if (problems.length){
    return await reject({
      file, label, log,
      findings: [{ severity: SEVERITY.ERROR, code: 'schema', message: `${label}: ${problems.length} invalid record(s)`, detail: problems.slice(0, 10) }],
      summary: null,
    });
  }

  /* ---- reconcile: the dataset plausible, and plausible given last time -- */
  const previous = await lastAccepted(file);
  const { ok, summary, findings } = reconcile(projects, { previous, label });

  const errors = findings.filter(f => f.severity === SEVERITY.ERROR);
  const warnings = findings.filter(f => f.severity === SEVERITY.WARNING);

  if (errors.length){
    return await reject({ file, label, log, findings, summary });
  }
  if (warnings.length && !acceptDrift){
    /* Suspicious rather than wrong. Blocking by default, because a drift warning
       is usually a broken ingestion and the cost of a false stop is a re-run
       while the cost of a false publish is silently wrong published data. */
    log(`  ! ${label}: held back — ${warnings.length} drift warning(s)`);
    log(formatFindings(findings));
    log(`  · re-run with --accept-drift once the change is understood.`);
    return await reject({ file, label, log, findings, summary, held: true });
  }

  /* ---- publish: atomically, keeping the previous version ---------------- */
  const artifact = {
    ...meta,
    summary,
    reconciliation: { acceptedDrift: acceptDrift, findings },
    projects,
  };

  /* Keep the outgoing version first, so a bad acceptance can be reversed
     without a re-fetch. The write itself is atomic inside the boundary. */
  await copyWithin(file, `${file}.previous.json`);
  await writeAtomic(file, JSON.stringify(artifact, null, 1) + '\n');
  await clearDiagnostic(file);

  log(`  ✔ ${label}: ${summary.records} records, ${Math.round(summary.totalMW)} MW`
    + (summary.totalMWh != null ? ` / ${Math.round(summary.totalMWh)} MWh` : '')
    + (warnings.length ? ` (${warnings.length} accepted drift warning(s))` : ''));

  return { published: true, findings, summary, diagnostic: null };
}

const diagnosticPath = (file) => `${file}.diagnostic.json`;

async function clearDiagnostic(file){
  await removeWithin(diagnosticPath(file));
}

async function reject({ file, label, log, findings, summary, held = false }){
  const path = diagnosticPath(file);

  /* The diagnostic sits next to the artifact it did NOT replace, so whoever
     finds a stale file also finds the reason it is stale. */
  await writeAtomic(path, JSON.stringify({
    label,
    rejectedAt: new Date().toISOString(),
    held,
    previousArtifactPreserved: (await readTextIfPresent(file)) != null,
    summary,
    findings,
  }, null, 1) + '\n');

  if (!held){
    log(`  ✖ ${label}: rejected, previous artifact left in place`);
    log(formatFindings(findings));
  }
  log(`  · diagnostic written to ${baseName(path)}`);

  return { published: false, findings, summary, diagnostic: path };
}

/**
 * Run one source end to end.
 *
 * `steps.download` and `steps.parse` are separated so a source that reads a
 * local manual download can supply only the latter — and so a network failure is
 * reported as a download failure rather than a parse failure, which is the
 * difference between "the endpoint was down" and "the file changed shape".
 */
export async function runPipeline({ label, file, meta, steps, acceptDrift = false, log = () => {} }){
  const stage = async (name, fn) => {
    if (!fn) return null;
    try {
      return await fn();
    } catch (error){
      log(`  ✖ ${label}: ${name} failed — ${error.message}`);
      await reject({
        file, label, log, summary: null,
        findings: [{ severity: SEVERITY.ERROR, code: name, message: `${label}: ${name} failed`, detail: error.message }],
      });
      throw new PipelineStop(name);
    }
  };

  try {
    const downloaded = await stage('download', steps.download);
    const parsed = await stage('parse', () => steps.parse(downloaded));
    const projects = await stage('normalize', () => steps.normalize(parsed));
    return await publishDataset({ file, projects, meta, acceptDrift, log });
  } catch (error){
    if (error instanceof PipelineStop){
      return { published: false, findings: [], summary: null, diagnostic: diagnosticPath(file) };
    }
    throw error;
  }
}

class PipelineStop extends Error {
  constructor(stage){ super(`pipeline stopped at ${stage}`); this.name = 'PipelineStop'; this.stage = stage; }
}
