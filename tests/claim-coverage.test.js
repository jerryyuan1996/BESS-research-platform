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

/* ---------------------------------------------------------------------------
   THE GOVERNED COUNT.

   The report above reads the old per-section slot and is informational. This is
   the number quoted when a market is signed off: how many sections publish a
   claim, out of every analytical section on the platform.

   TWO COUNTS THAT MUST AGREE. "Governed" is what the claim modules declare;
   "reader-visible" is what the renderer would put on a page. They are computed
   separately here on purpose — if the gate ever loosened, a blocked or
   incomplete draft would raise the second without the first, and this test is
   where that shows up.
   --------------------------------------------------------------------------- */
import { markets as allMarkets } from '../src/markets/registry.js';
import { READINESS, NO_CLAIM_SECTIONS, validateClaim } from '../src/governance/claims.js';
import { CLAIMS as WA_RUNTIME } from '../src/markets/wa/claims.js';
import { CLAIMS as PJM_RUNTIME } from '../src/markets/pjm/claims.js';
import { CLAIMS as FI_RUNTIME } from '../src/markets/fi/claims.js';
import { DISPOSITIONS as WA_ALL } from '../src/markets/wa/dispositions.js';
import { DISPOSITIONS as PJM_ALL } from '../src/markets/pjm/dispositions.js';
import { DISPOSITIONS as FI_ALL } from '../src/markets/fi/dispositions.js';

/* The three markets that have been through evidence review. Runtime is what a
   reader downloads; all is what was decided. */
const REVIEWED = {
  wa:  { runtime: WA_RUNTIME,  all: WA_ALL },
  pjm: { runtime: PJM_RUNTIME, all: PJM_ALL },
  fi:  { runtime: FI_RUNTIME,  all: FI_ALL },
};

test('governed and reader-visible coverage agree at 7/160', () => {
  let governed = 0, readerVisible = 0;

  for (const { all } of Object.values(REVIEWED)){
    for (const [sid, c] of Object.entries(all)){
      assert.ok(!NO_CLAIM_SECTIONS.has(sid), `${sid} argues nothing by design`);
      if (c.readiness === READINESS.SUPPORTED) governed++;
      /* The renderer's own gate, applied to the data rather than asserted
         against the source: supported, and carrying text. */
      if (c.readiness === READINESS.SUPPORTED && Array.isArray(c.text) && c.text[0])
        readerVisible++;
    }
  }

  const analytical = allMarkets.length * 10;
  assert.equal(analytical, 160, 'sixteen markets, ten sections each');
  assert.equal(governed, 7, 'WA three, PJM three, Finland one');
  assert.equal(readerVisible, governed,
    'a claim that renders but is not governed, or vice versa, is the bug this catches');
});

test('THE BUNDLE BOUNDARY: only supported claims enter a runtime chunk', () => {
  /* The property, for every claim-enabled market rather than for Finland alone.
     Finland's chunk went over budget because seven sections that render NOTHING
     each shipped a bilingual paragraph saying why. WA and PJM had the same
     defect and only enough headroom to hide it, which is why this is asserted
     as a property and not left to whichever market trips a budget first. */
  for (const [mid, { runtime, all }] of Object.entries(REVIEWED)){
    for (const [sid, c] of Object.entries(runtime)){
      assert.equal(c.readiness, READINESS.SUPPORTED,
        `${mid}/${sid} renders nothing, so its prose belongs in dispositions.js`);
      assert.ok(Array.isArray(c.text) && c.text[0], `${mid}/${sid} must carry its sentence`);
    }
    /* Nothing is lost by the split: runtime is exactly the supported subset. */
    const supported = Object.entries(all)
      .filter(([, c]) => c.readiness === READINESS.SUPPORTED).map(([sid]) => sid).sort();
    assert.deepEqual(Object.keys(runtime).sort(), supported,
      `${mid} runtime and its supported dispositions have drifted apart`);
  }
});

test('every analytical section has a governed disposition, published or not', () => {
  /* What the split must not cost. PJM carried three dispositions against eight
     analytical sections: a coverage count cannot distinguish a section that was
     examined and declined from one nobody opened, because both read as silence.
     Holding unpublished prose out of the bundle is only safe while every section
     is still accounted for somewhere. */
  for (const [mid, { all }] of Object.entries(REVIEWED)){
    const market = allMarkets.find(m => m.manifest.id === mid);
    const analytical = (market.tabs || [])
      .map(t => (Array.isArray(t) ? t[0] : t.id))
      .filter(id => id && !NO_CLAIM_SECTIONS.has(id));

    assert.equal(analytical.length, 8, `${mid} should have eight analytical sections`);
    for (const sid of analytical)
      assert.ok(all[sid], `${mid}/${sid} has no disposition — examined and declined, or never opened?`);
    for (const sid of Object.keys(all))
      assert.ok(analytical.includes(sid), `${mid}/${sid} is a disposition for no section`);

    /* And every one of them still validates against the schema. */
    for (const [sid, c] of Object.entries(all))
      assert.deepEqual(validateClaim(c, market, sid), [], `${mid}/${sid} is malformed`);
  }
});

test('nothing unpublished carries a sentence that could be rendered', () => {
  /* A blocked or none disposition with `text` is one loosened gate away from
     appearing as a finding. An incomplete one MAY hold a draft — that is what
     the state is for — but it must never be in a runtime chunk. */
  for (const [mid, { all }] of Object.entries(REVIEWED)){
    for (const [sid, c] of Object.entries(all)){
      if (c.readiness === READINESS.SUPPORTED) continue;
      if (c.readiness === READINESS.INCOMPLETE) continue;
      assert.ok(!c.text, `${mid}/${sid} is ${c.readiness} and must carry no text`);
    }
  }
});
