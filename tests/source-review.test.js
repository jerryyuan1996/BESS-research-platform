/* ---------------------------------------------------------------------------
   SOURCE REVIEW RECORDS.

   A review record is the evidence that a document was opened. The rules that
   matter are the two that stop it degrading back into a title: a locator, so a
   later reviewer can find the same place, and `doesNotEstablish`, because the
   failure this round keeps producing is not a false statement but a true one
   stretched a clause too far.

   And the strict one: a source that could not be opened may not claim to
   establish anything.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateReview, openedTheDocument, ACCESS } from '../src/governance/sourceReview.js';
import { REVIEW } from '../src/markets/wa/sourceReview.js';
import { REVIEW as PJM_REVIEW } from '../src/markets/pjm/sourceReview.js';
import { markets } from '../src/markets/registry.js';
import { evidenceRecords } from '../src/governance/claims.js';

const wa = markets.find(m => m.manifest.id === 'wa');

test('every WA review record is well formed', () => {
  for (const [id, r] of Object.entries(REVIEW)){
    assert.deepEqual(validateReview(r, id), [], `${id} review is malformed`);
  }
});

test('every reviewed id exists in the WA source register', () => {
  const known = evidenceRecords(wa);
  for (const id of Object.keys(REVIEW)){
    assert.ok(known[id], `review record "${id}" does not correspond to a source record`);
  }
});

test('an inaccessible source cannot claim to establish anything', () => {
  /* The rule that stops "could not open it" quietly becoming "reviewed it". */
  const problems = validateReview({
    reviewedAt: '2026-08-19', access: ACCESS.INACCESSIBLE,
    accessNote: 'blocked', establishes: ['something convenient'],
  }, 'x');
  assert.ok(problems.some(p => /claims to establish things/.test(p)));

  for (const [id, r] of Object.entries(REVIEW)){
    if (r.access === ACCESS.INACCESSIBLE){
      assert.deepEqual(r.establishes, [], `${id} was not opened and must establish nothing`);
      assert.ok(r.accessNote, `${id} must say what was tried`);
    }
  }
});

test('an opened source must carry a locator and its limits', () => {
  const noLocator = validateReview({
    reviewedAt: '2026-08-19', access: ACCESS.PUBLISHER,
    confirmedTitle: 't', confirmedPublisher: 'p',
    establishes: ['a'], doesNotEstablish: ['b'],
  }, 'x');
  assert.ok(noLocator.some(p => /locator is required/.test(p)));

  const noLimits = validateReview({
    reviewedAt: '2026-08-19', access: ACCESS.PUBLISHER,
    confirmedTitle: 't', confirmedPublisher: 'p', locator: 'page 4',
    establishes: ['a'],
  }, 'x');
  assert.ok(noLimits.some(p => /must NOT be inferred/.test(p)));
});

test('the repository does not become an archive', () => {
  const long = validateReview({
    reviewedAt: '2026-08-19', access: ACCESS.PUBLISHER,
    confirmedTitle: 't', confirmedPublisher: 'p', locator: 'l',
    establishes: ['a'], doesNotEstablish: ['b'], excerpt: 'x'.repeat(400),
  }, 'x');
  assert.ok(long.some(p => /not an archive/.test(p)));

  for (const [id, r] of Object.entries(REVIEW)){
    if (r.excerpt) assert.ok(r.excerpt.length <= 300, `${id} excerpt is too long`);
  }
});

test('a date that contradicts the register is recorded, not reconciled away', () => {
  const bare = validateReview({
    reviewedAt: '2026-08-19', access: ACCESS.PUBLISHER,
    confirmedTitle: 't', confirmedPublisher: 'p', locator: 'l',
    establishes: ['a'], doesNotEstablish: ['b'], registerDateDiffers: true,
  }, 'x');
  assert.ok(bare.some(p => /nothing says how/.test(p)));

  /* Two were found in this pass and both are explained rather than corrected in
     place — the rules vintage, and the plan page date against its publication. */
  const differing = Object.entries(REVIEW).filter(([, r]) => r.registerDateDiffers);
  assert.equal(differing.length, 2);
  for (const [id, r] of differing)
    assert.ok(r.registerDateNote.length > 40, `${id} needs a real explanation`);
});

test('REPORT: what the WA pass actually opened', () => {
  const rows = [];
  for (const [id, r] of Object.entries(REVIEW)){
    rows.push(`  ${id.padEnd(10)} ${r.access.padEnd(14)} ` +
      (openedTheDocument(r) ? 'document' : r.access === ACCESS.LANDING_PAGE ? 'landing page' : 'not read'));
  }
  const opened = Object.values(REVIEW).filter(r => r.access !== ACCESS.INACCESSIBLE).length;
  console.log([
    `WA source review 2026-08-19: ${opened} of ${Object.keys(REVIEW).length} reached`,
    ...rows,
    '  AEMO (esoo, qed, crc) returns 403 to automated fetch; archive fallback unavailable.',
  ].join(String.fromCharCode(10)));
  assert.ok(opened >= 1);
});

test('every PJM review record is well formed and ids resolve', () => {
  const pjm = markets.find(m => m.manifest.id === 'pjm');
  const known = evidenceRecords(pjm);
  for (const [id, r] of Object.entries(PJM_REVIEW)){
    assert.deepEqual(validateReview(r, id), [], `${id} review is malformed`);
    /* `ancillaryLanding` is a page reviewed on the way to a document rather
       than a register id, and is allowed to have no source record. Anything
       else must correspond to one. */
    if (id !== 'ancillaryLanding')
      assert.ok(known[id], `review record "${id}" has no matching source record`);
  }
});

test('REPORT: what the PJM pass opened', () => {
  const lines = [];
  for (const [id, r] of Object.entries(PJM_REVIEW))
    lines.push(`  ${id.padEnd(18)} ${r.access}`);
  console.log(['PJM source review 2026-08-19:', ...lines].join(String.fromCharCode(10)));
  assert.ok(Object.keys(PJM_REVIEW).length >= 4);
});
