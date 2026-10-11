#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   THE RULES ENGINE.

   A rule is a trigger the analyst wrote in advance, with a `when` and an
   `effect`: "when this published figure crosses this line, make this change".
   This program runs after each refresh and does the mechanical half.

       for each data trigger in the view that carries an effect
         skip it if it has already fired since it was armed
         load the published summary of the dataset it names
         refuse to test a snapshot this run did not fetch, a stale one, one
           whose checksum does not verify, or too short a window
         test the `when`
       gather the changes of every rule that fired
       hand them to the view writer as one batch, or print them (--dry-run)

   WHAT IT DECIDES: nothing. The line, the figure and the change were all
   written by the analyst. This reads a number and compares it. The view
   writer's gate then checks that the change is exactly the rule's effect —
   so even this file cannot make a rule do more than it says.

   WHAT IT READS: published summaries under public/data/, the view store, and
   the governance modules. Nothing else. In particular it has no path to the
   analyst's private overlay and tests/view.test.js asserts that it never
   names it.

   WHAT IT WRITES: the view, through etl/lib/viewWriter.mjs and only through
   it; and a report under etl/out/, which is not committed.

   Usage:
     node etl/rules.mjs                    after `node etl/run.mjs`, in the same job
     node etl/rules.mjs --dry-run          test every rule, write nothing
     node etl/rules.mjs --any-snapshot     dry run only: test snapshots on disk
                                           without a run summary to check them against
   --------------------------------------------------------------------------- */
import { pathToFileURL } from 'node:url';

import { datasetById, summaryFile } from '../src/governance/datasets.js';
import { isRule, testWhen, TRIGGER_KIND } from '../src/governance/triggers.js';
import { MIN_WINDOW_DAYS, EVIDENCE_CLASS } from '../src/governance/automation.js';
import { effectChanges, ruleHasFired } from '../view/schema/view.mjs';
import { readSnapshot, readTextIfPresent } from './lib/boundary.mjs';
import { sha256 } from './lib/envelope.mjs';
import { createViewStore, writeRunReport, ViewRejected } from './lib/viewWriter.mjs';

/** Why a rule was not tested, or what the test found. */
export const RULE_STATUS = {
  FIRED: 'fired',                 // the line was crossed and the change is in the batch
  NOT_MET: 'not-met',             // tested, and the line was not crossed
  ALREADY_FIRED: 'already-fired', // fired since it was armed; waiting to be re-armed
  NOT_FETCHED: 'not-fetched',     // the dataset was not fetched and validated in this run
  NO_SNAPSHOT: 'no-snapshot',     // nothing is published for the dataset
  UNVERIFIED: 'unverified',       // the summary does not match its own checksum
  STALE: 'stale',                 // older than the dataset's own staleness limit
  SHORT_WINDOW: 'short-window',   // a price-derived figure over too few days
  INVALID: 'invalid',             // the effect cannot be applied to the view as it stands
};

/** A summary verifies when its checksum is the hash of everything else in it. */
export function summaryVerifies(summary){
  if (!summary || typeof summary.summaryChecksum !== 'string') return false;
  const { summaryChecksum, ...rest } = summary;
  return sha256(rest) === summaryChecksum;
}

/* Guardrail F. A figure under `derived` or `arbitrage` in a price summary is
   computed over the trailing window, and spreads are seasonal everywhere. It
   is tested only when the window is long enough, whatever the rule's own
   guard says — a rule cannot opt out of the season. */
function windowProblem(when, summary){
  const days = summary?.derived?.spreadDays;
  if (!/^(derived|arbitrage)\./.test(when.field) || typeof days !== 'number') return null;
  return days >= MIN_WINDOW_DAYS ? null : `${days} complete days in the window, and a price-derived figure needs ${MIN_WINDOW_DAYS}`;
}

/**
 * Test every rule and return what each found, with the changes of those that
 * fired. Pure but for `readSummary`: it writes nothing.
 *
 * @param views        every market view
 * @param changelog    every changelog entry
 * @param readSummary  async (datasetId) => the published summary, or null
 * @param fetched      ids of the datasets this run fetched and validated, or
 *                     null to test whatever is on disk (dry runs only)
 * @param now          Date
 */
export async function evaluateRules({ views, changelog, readSummary, fetched, now }){
  const runAt = now.toISOString();
  const today = runAt.slice(0, 10);
  const reports = [];
  const changes = [];

  for (const view of views){
    for (const trigger of view.triggers){
      if (trigger.kind !== TRIGGER_KIND.DATA || !isRule(trigger)) continue;
      const when = trigger.when;
      const report = { rule: trigger.id, market: view.marketId, dataset: when.dataset, field: when.field, op: when.op, threshold: when.value };
      const say = (status, detail = null, extra = {}) => reports.push({ ...report, status, detail, ...extra });

      if (ruleHasFired(changelog, view.marketId, trigger.id)){ say(RULE_STATUS.ALREADY_FIRED, 'fired since it was armed; rewrite the trigger record to arm it again'); continue; }
      const dataset = datasetById(when.dataset);
      /* Guardrail A: nothing moves on a snapshot this run did not fetch. */
      if (fetched && !fetched.includes(when.dataset)){ say(RULE_STATUS.NOT_FETCHED, 'the dataset was not fetched and validated in this run'); continue; }
      const summary = await readSummary(when.dataset);
      if (!summary){ say(RULE_STATUS.NO_SNAPSHOT, 'no summary is published for this dataset'); continue; }
      if (!summaryVerifies(summary)){ say(RULE_STATUS.UNVERIFIED, 'the published summary does not match its own checksum'); continue; }
      const ageHours = (now.getTime() - Date.parse(summary.fetchedAt)) / 3_600_000;
      if (!(ageHours <= dataset.staleAfterHours)){ say(RULE_STATUS.STALE, `fetched ${summary.fetchedAt}, past the dataset's ${dataset.staleAfterHours}-hour limit`); continue; }
      const short = windowProblem(when, summary);
      if (short){ say(RULE_STATUS.SHORT_WINDOW, short); continue; }

      const result = testWhen(when, summary);
      const seen = { observed: result.observed, guards: result.guards, fetchedAt: summary.fetchedAt };
      if (!result.met){ say(RULE_STATUS.NOT_MET, result.why, seen); continue; }

      const evidence = [{
        publisher: dataset.source.name, url: dataset.source.url,
        class: dataset.official ? EVIDENCE_CLASS.OFFICIAL : EVIDENCE_CLASS.THIRD_PARTY,
        retrievedAt: summary.fetchedAt, sha256: summary.sourceSnapshot?.contentChecksum ?? summary.summaryChecksum,
        dataset: when.dataset, field: when.field, observed: result.observed, op: when.op, threshold: when.value,
      }];
      let records;
      try { records = effectChanges(view, trigger, { kind: 'rule', asOf: today }); }
      catch (error){ say(RULE_STATUS.INVALID, error.message, seen); continue; }
      const made = records.map(record => ({
        market: view.marketId, path: record.path, to: record.to,
        author: { kind: 'rule', rule: trigger.id, run: runAt },
        trigger: trigger.id, reason: trigger.note, evidence,
      }));
      changes.push(...made);
      say(RULE_STATUS.FIRED, null, { ...seen, paths: made.map(c => c.path) });
    }
  }
  return { runAt, reports, changes };
}

/**
 * Evaluate, then apply or report. All of a run's changes are written or none
 * of them: one refusal, or more changes than the cap, and the whole batch is
 * rejected and returned as such.
 */
export async function runRules({ store, readSummary, fetched, now = new Date(), dryRun = false, cap }){
  const evaluated = await evaluateRules({
    views: await store.readAll(), changelog: await store.changelog(), readSummary, fetched, now,
  });
  const options = cap === undefined ? {} : { cap };
  let entries = [], rejected = null;
  try {
    entries = dryRun
      ? (await store.prepareBatch(evaluated.changes, now, options)).map(p => p.entry)
      : await store.applyBatch(evaluated.changes, now, options);
  } catch (error){
    if (!(error instanceof ViewRejected)) throw error;
    rejected = { reason: error.message, changes: evaluated.changes };
  }
  return { ...evaluated, dryRun, entries, rejected, written: !dryRun && !rejected ? entries.length : 0 };
}

/** The report a person reads. */
export function renderRulesReport(result){
  const lines = [`## Rules — ${result.runAt}${result.dryRun ? ' (dry run, nothing written)' : ''}`, ''];
  if (!result.reports.length) lines.push('No data rule is armed in the view store.');
  for (const r of result.reports){
    const read = r.observed === undefined || r.observed === null ? '' : ` — read ${r.observed}`;
    lines.push(`- **${r.rule}** (${r.market}) · \`${r.dataset}\` \`${r.field} ${r.op} ${r.threshold}\`${read} · **${r.status}**${r.detail ? ` — ${r.detail}` : ''}`);
    for (const g of r.guards || []) lines.push(`  - guard \`${g.field} ${g.op} ${g.value}\`: ${g.observed ?? 'missing'} — ${g.ok ? 'holds' : 'does not hold'}`);
  }
  lines.push('');
  if (result.rejected) lines.push(`**Rejected, nothing written.** ${result.rejected.reason}`);
  else if (!result.entries.length) lines.push('No change to the view.');
  else for (const e of result.entries){
    lines.push(`${result.dryRun ? 'Would change' : 'Changed'} \`${e.market}\` \`${e.path}\` — ${e.reason[0]}`);
  }
  return lines.join('\n');
}

/* ---- command line ---------------------------------------------------------- */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const anySnapshot = argv.includes('--any-snapshot');
  if (anySnapshot && !dryRun){
    console.error('--any-snapshot is for dry runs: a real run tests only what its own refresh fetched.');
    process.exit(2);
  }

  /* The refresh this run follows says which datasets it fetched and
     validated. Without it nothing is tested, except in a dry run that asks. */
  let fetched = null;
  if (!anySnapshot){
    const summary = await readTextIfPresent('etl/out/summary.json');
    const parsed = summary ? JSON.parse(summary) : null;
    if (!Array.isArray(parsed?.fetched)){
      console.error('No etl/out/summary.json with a `fetched` list — run `node etl/run.mjs` first, or use --dry-run --any-snapshot.');
      process.exit(dryRun ? 0 : 1);
    }
    fetched = parsed.fetched;
  }

  const result = await runRules({
    store: createViewStore(),
    readSummary: (id) => readSnapshot(summaryFile(id)),
    fetched, dryRun,
  });
  const report = renderRulesReport(result);
  console.log(report);
  await writeRunReport('rules-report.md', `${report}\n`);
  await writeRunReport('rules-report.json', `${JSON.stringify({ runAt: result.runAt, dryRun, reports: result.reports, written: result.written, entries: result.entries.map(e => e.id), rejected: result.rejected }, null, 2)}\n`);
  if (result.rejected) await writeRunReport('view-rejected.json', `${JSON.stringify(result.rejected, null, 2)}\n`);
  /* A rejection is a fault in a rule or in the gate, and somebody should look. */
  if (result.rejected) process.exit(1);
}
