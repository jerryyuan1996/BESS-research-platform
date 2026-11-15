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

import { CLAIMS } from '../src/markets/wa/claims.js';

import { validateClaim, READINESS, NO_CLAIM_SECTIONS } from '../src/governance/claims.js';


const wa = markets.find(m => m.manifest.id === 'wa');

test('every WA claim validates against the WA evidence namespace', () => {
  for (const [section, claim] of Object.entries(CLAIMS)){
    assert.deepEqual(validateClaim(claim, wa, section), [], `${section} claim is invalid`);
  }
});







test('no supported claim says the network access quantity is set annually', () => {
  /* Caught in review: the footnote establishing the cap is cut mid-sentence at
     "AEMO", and the word "annually" elsewhere in the determination attaches to
     the ERA setting the BRCP. Reading it across is the exact overreach this
     process exists to catch, so it is asserted rather than remembered. */
  const grid = CLAIMS.grid;
  assert.ok(grid);
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
