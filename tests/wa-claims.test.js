/* ---------------------------------------------------------------------------
   THE WA PILOT, AS ACCEPTED.

   Three supported claims, all resting on one document that was actually opened
   and read. Five incomplete, each naming why. This file checks the mechanical
   contract and one thing beyond it: that the two overreaches caught in review
   cannot come back.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { markets } from '../src/markets/registry.js';
import { DISPOSITIONS as CLAIMS } from '../src/markets/wa/dispositions.js';
import { CLAIMS as WA_RUNTIME } from '../src/markets/wa/claims.js';
import { REVIEW } from '../src/markets/wa/sourceReview.js';
import { validateClaim, READINESS, NO_CLAIM_SECTIONS } from '../src/governance/claims.js';
import { openedTheDocument } from '../src/governance/sourceReview.js';

const wa = markets.find(m => m.manifest.id === 'wa');

test('every WA claim validates against the WA evidence namespace', () => {
  for (const [section, claim] of Object.entries(CLAIMS)){
    assert.deepEqual(validateClaim(claim, wa, section), [], `${section} claim is invalid`);
  }
});

test('every analytical WA section has a disposition', () => {
  const analytic = wa.tabs.map(([id]) => id).filter(id => !NO_CLAIM_SECTIONS.has(id));
  assert.equal(analytic.length, 8);
  for (const id of analytic) assert.ok(CLAIMS[id], `${id} has no disposition`);
});

test('the pilot stands at three supported and five incomplete', () => {
  const by = {};
  for (const c of Object.values(CLAIMS)) by[c.readiness] = (by[c.readiness] || 0) + 1;
  assert.equal(by[READINESS.SUPPORTED], 3);
  assert.equal(by[READINESS.INCOMPLETE], 5);
});

test('every supported claim rests on a document that was actually opened', () => {
  /* The rule the whole round turns on. A supported claim may not cite a source
     whose review says it could not be read. */
  for (const [section, claim] of Object.entries(CLAIMS)){
    if (claim.readiness !== READINESS.SUPPORTED) continue;
    for (const id of claim.evidence){
      const review = REVIEW[id];
      assert.ok(review, `${section} cites ${id}, which has no review record`);
      assert.ok(openedTheDocument(review),
        `${section} cites ${id}, whose review says it was not opened`);
    }
  }
});

test('no supported claim says the network access quantity is set annually', () => {
  /* Caught in review: the footnote establishing the cap is cut mid-sentence at
     "AEMO", and the word "annually" elsewhere in the determination attaches to
     the ERA setting the BRCP. Reading it across is the exact overreach this
     process exists to catch, so it is asserted rather than remembered. */
  const grid = CLAIMS.grid;
  assert.ok(!/annual/i.test(grid.text[0]), 'the grid claim must not assert a cadence');
  assert.ok(/not established|not claimed/i.test(grid.caveat[0]),
    'and must say the cadence is unestablished');
});

test('no supported claim asserts that capacity revenue is guaranteed', () => {
  /* The other overreach: an earlier draft said capacity payments set a floor,
     which the section caveat and the determination both deny. */
  for (const [section, claim] of Object.entries(CLAIMS)){
    if (claim.readiness !== READINESS.SUPPORTED) continue;
    const blob = claim.text.join(' ') + ' ' + (claim.caveat || []).join(' ');
    assert.ok(!/guarantee[sd]? (revenue|a floor)/i.test(claim.text[0]),
      `${section} must not promise revenue`);
    if (section === 'rcm')
      assert.ok(/does not guarantee/.test(blob), 'the rcm caveat must carry the denial');
  }
});

test('an incomplete section names what is blocking it', () => {
  for (const [section, claim] of Object.entries(CLAIMS)){
    if (claim.readiness !== READINESS.INCOMPLETE) continue;
    assert.ok(claim.note || claim.reason, `${section} must say why it is incomplete`);
  }
});

test('REPORT: WA pilot dispositions', () => {
  const lines = ['WA pilot, accepted 2026-08-19:'];
  for (const [section, c] of Object.entries(CLAIMS)){
    lines.push(`  ${section.padEnd(10)} ${c.readiness.padEnd(11)}` +
      (c.readiness === READINESS.SUPPORTED ? ` basis=${c.basis} evidence=${c.evidence.join(',')}` : ''));
  }
  lines.push('  data, portfolio: none (descriptive/referential)');
  console.log(lines.join(String.fromCharCode(10)));
  assert.ok(lines.length > 8);
});
