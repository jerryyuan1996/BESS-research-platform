/* ---------------------------------------------------------------------------
   CLAIM COVERAGE — INFORMATIONAL, DELIBERATELY.

   Round 6 established that every section should open with a one-sentence claim:
   what this section argues, not what it contains. Writing those claims is
   editorial work — each has to be supported by the evidence in its own section
   and reviewed market by market — so it is its own round.

   This file provides the slot and reports on it. It does NOT fail. A build that
   broke because an editor had not yet written a sentence would push someone
   towards writing a generic one to make it pass, which is the exact outcome the
   separate round exists to avoid: an unsourced claim is worse than no claim,
   because it reads as a finding.

   What it reports:
     · sections that declare a claim
     · sections that do not yet
     · claims that cite no evidence, which is the one thing worth chasing

   Turn this into an enforcing test only when the editorial round is done.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { markets } from '../src/markets/registry.js';

/**
 * The claim slot.
 *
 * A section may declare `claim: { text: [en, zh], evidence: ['source-id', …] }`.
 * `evidence` names ids that already exist in the section's own source register,
 * so a claim cannot cite something the page does not show.
 */
export const hasClaim = (section) =>
  !!(section && section.claim && Array.isArray(section.claim.text) && section.claim.text[0]);

test('REPORT: claim coverage by market', () => {
  let withClaim = 0, without = 0, unsourced = 0;
  const lines = [];

  for (const m of markets){
    const tabs = m.tabs || [];
    const ids = tabs.map(t => (Array.isArray(t) ? t[0] : t.id)).filter(Boolean);
    const claimed = [];
    for (const t of tabs){
      const section = Array.isArray(t) ? null : t;
      if (hasClaim(section)){
        withClaim++;
        claimed.push(section.id);
        if (!section.claim.evidence?.length) unsourced++;
      } else without++;
    }
    lines.push(`  ${m.manifest.id.padEnd(12)} ${claimed.length}/${ids.length || tabs.length} sections claimed`);
  }

  const total = withClaim + without;
  console.log([
    'claim coverage (informational — this test does not fail):',
    `  sections with a claim   : ${withClaim}`,
    `  sections without a claim: ${without}`,
    `  claims citing no evidence: ${unsourced}`,
    `  coverage: ${total ? (100 * withClaim / total).toFixed(0) : 0}%`,
    ...lines,
    '  Claims are written in the editorial round. An unsourced claim reads as a',
    '  finding, so none are generated here.',
  ].join(String.fromCharCode(10)));

  assert.ok(total >= 0, 'the report ran');
});
