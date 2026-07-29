#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   PROPOSE — turn material drift into a reviewable diff.

   ===========================================================================
   THIS IS THE ONLY PROGRAM IN THE REPOSITORY THAT EDITS AN ANALYST-CONTROLLED
   FILE, AND IT IS NOT PART OF THE ETL.
   ===========================================================================

   The distinction matters, so it is worth being explicit about the two paths:

     etl/run.mjs      unattended, runs on a schedule, commits to the default
                      branch. Physically cannot write outside public/data/ —
                      see etl/lib/boundary.mjs. This is the path that runs
                      without anyone watching, so it has no power over judgement.

     etl/propose.mjs  runs ONLY in the pull-request workflow, ONLY on a throwaway
                      branch, and its entire output is a diff that a human must
                      read and merge. It refuses to run on the default branch.

   A pull request that contains only prose is not reviewable — the reviewer has
   to reconstruct the change in their head and then make it by hand, which is
   both worse and more error-prone than reading a diff. So this program makes the
   edit. What keeps the guarantee intact is not that no program can write to
   src/; it is that no UNATTENDED program can, and that nothing reaches the
   published site without a human merge.

   Edits are surgical and fail loudly. If the target pattern does not match
   exactly once, nothing is written and the run fails — a proposal that silently
   edited the wrong line would be far worse than no proposal at all.
   --------------------------------------------------------------------------- */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

import { REPO_ROOT } from './lib/boundary.mjs';
import { markets } from '../src/markets/registry.js';
import { comparisonAuthority, assumptionAuthority, canMachinePropose } from '../src/governance/authority.js';

const PROPOSALS = path.join(REPO_ROOT, 'etl', 'out', 'proposals.json');

const log = (m) => process.stdout.write(m + '\n');

/** Refuse to run on the default branch. The guard is cheap and the mistake is not. */
function assertNotOnDefaultBranch(){
  if (process.env.ALLOW_PROPOSE_ON_MAIN === '1') return;   // tests only
  let branch = '';
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: REPO_ROOT }).toString().trim();
  } catch {
    throw new Error('propose: cannot determine the current git branch — refusing to edit source');
  }
  if (branch === 'main' || branch === 'master'){
    throw new Error(
      `propose: refusing to run on "${branch}".\n` +
      'This program edits analyst-controlled files and must only ever run on a\n' +
      'branch that becomes a reviewable pull request.');
  }
}

/**
 * Replace a numeric property in a source file, exactly once.
 *
 * Matches `key:` followed by a number, tolerating whitespace, and requires a
 * unique match within the file. A trailing comment on the line is preserved,
 * because in these files the comment usually explains where the number came
 * from and dropping it would quietly destroy the provenance a reader relies on.
 */
function replaceNumericProperty(source, key, nextValue){
  const re = new RegExp(`(^[ \\t]*${key}\\s*:\\s*)(-?[\\d_]+(?:\\.\\d+)?(?:e-?\\d+)?)`, 'gm');
  const matches = [...source.matchAll(re)];

  if (matches.length === 0) return { ok: false, reason: `no assignment to "${key}" found` };
  if (matches.length > 1) return { ok: false, reason: `"${key}" is assigned ${matches.length} times — ambiguous` };

  const m = matches[0];
  const formatted = formatLike(m[2], nextValue);
  const next = source.slice(0, m.index) + m[1] + formatted + source.slice(m.index + m[0].length);
  return { ok: true, source: next, from: m[2], to: formatted };
}

/** Format the new value with a precision that suits the old one. */
function formatLike(oldLiteral, value){
  if (/^-?\d+$/.test(oldLiteral.replace(/_/g, ''))) return String(Math.round(value));
  const decimals = (oldLiteral.split('.')[1] || '').length;
  // Small rates (JPY at 0.0064) need more precision than their literal shows.
  const dp = Math.max(decimals, Math.abs(value) < 0.1 ? 6 : 2);
  return String(Number(value.toFixed(dp)));
}

/** Where a proposal's field lives, and whether it may be proposed at all. */
function resolveTarget(proposal){
  if (proposal.path.startsWith('FX.')){
    const authority = assumptionAuthority(proposal.path);
    if (!canMachinePropose(authority)){
      return { ok: false, reason: `${proposal.path} is ${authority} — automation may not propose against it` };
    }
    return {
      ok: true,
      file: path.join(REPO_ROOT, 'src', 'comparison', 'assumptions.js'),
      key: proposal.path.slice(3),
      authority,
    };
  }

  if (proposal.path.startsWith('economics.')){
    const authority = comparisonAuthority(proposal.path);
    if (!canMachinePropose(authority)){
      return { ok: false, reason: `${proposal.path} is ${authority} — automation may not propose against it` };
    }
    const market = markets.find(m => m.manifest.id === proposal.marketId);
    if (!market) return { ok: false, reason: `unknown market "${proposal.marketId}"` };

    // Market directories are named by slug-ish folder, not by id. Resolve by
    // trying the id and the slug, which covers every market in the registry.
    const candidates = [
      proposal.marketId,
      proposal.marketId.replace(/_/g, '-'),
      market.manifest.slug,
    ];
    for (const dir of candidates){
      const file = path.join(REPO_ROOT, 'src', 'markets', dir, 'comparison.js');
      if (existsSync(file)){
        return { ok: true, file, key: proposal.path.split('.')[1], authority };
      }
    }
    return { ok: false, reason: `no comparison.js found for market "${proposal.marketId}"` };
  }

  return { ok: false, reason: `no proposal target mapped for "${proposal.path}"` };
}

async function main(){
  assertNotOnDefaultBranch();

  if (!existsSync(PROPOSALS)){
    log('No proposals file — nothing material to propose.');
    return;
  }

  const proposals = JSON.parse(await readFile(PROPOSALS, 'utf8'));
  if (!Array.isArray(proposals) || proposals.length === 0){
    log('Proposals file is empty — nothing to do.');
    return;
  }

  let applied = 0;
  const failures = [];

  for (const p of proposals){
    const target = resolveTarget(p);
    if (!target.ok){
      failures.push(`${p.path}: ${target.reason}`);
      continue;
    }

    const before = await readFile(target.file, 'utf8');
    const edit = replaceNumericProperty(before, target.key, p.proposed);
    if (!edit.ok){
      failures.push(`${p.path} in ${path.relative(REPO_ROOT, target.file)}: ${edit.reason}`);
      continue;
    }

    await writeFile(target.file, edit.source, 'utf8');
    applied++;
    log(`  ${p.path}: ${edit.from} → ${edit.to}  (${path.relative(REPO_ROOT, target.file)})`);
  }

  log('');
  log(`Applied ${applied} proposal(s) to the working tree.`);

  if (failures.length){
    log('');
    log('Could not apply:');
    for (const f of failures) log(`  - ${f}`);
    /* A partial proposal is still worth reviewing, but the workflow must know
       the body and the diff no longer agree. */
    if (applied === 0){
      throw new Error('no proposal could be applied — see the failures above');
    }
  }
}

main().catch(err => {
  console.error('\npropose failed:', err?.message || err);
  process.exit(1);
});
