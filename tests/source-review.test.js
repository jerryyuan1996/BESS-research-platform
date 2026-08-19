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

/* ---------------------------------------------------------------------------
   FINLAND — the pilot's hard case.

   Nine of fourteen records reached, and the finding that matters is not the
   three dead links but the two healthy ones: a record titled as a national
   market report pointing at a homepage, and a record cited for two projects
   pointing at a tag index carrying neither. Both return 200. Only opening them
   finds it, which is the argument for this whole file.
   --------------------------------------------------------------------------- */
import { REVIEW as FI_REVIEW } from '../src/markets/fi/sourceReview.js';
import { CLAIMS as FI_SHIPPED } from '../src/markets/fi/claims.js';
import { DISPOSITIONS as FI_CLAIMS } from '../src/markets/fi/dispositions.js';
import { DEFECTS as FI_DEFECTS } from '../src/markets/fi/sourceReview.js';
import { validateClaim, READINESS, NO_CLAIM_SECTIONS, CLAIM_BASIS } from '../src/governance/claims.js';

const fi = markets.find(m => m.manifest.id === 'fi');

test('every Finland review record is well formed and its id resolves', () => {
  const known = evidenceRecords(fi);
  for (const [id, r] of Object.entries(FI_REVIEW)){
    assert.deepEqual(validateReview(r, id), [], `${id} review is malformed`);
    assert.ok(known[id], `review record "${id}" has no matching source record`);
  }
});

test('a healthy link that does not reach its evidence is still recorded as a defect', () => {
  /* The two register defects. Both were reachable, so neither is inaccessible —
     the failure is that what was reached is not what the register claims. */
  for (const id of ['adequacyStandard', 'tradePress']){
    const r = FI_REVIEW[id];
    assert.notEqual(r.access, ACCESS.INACCESSIBLE, `${id} was reached, not blocked`);
    assert.ok(r.doesNotEstablish.some(d => /REGISTER DEFECT/.test(d)),
      `${id} must record that its citation does not reach its evidence`);
  }
});

test('every Finland disposition validates and every analytical section has one', () => {
  for (const [sid, c] of Object.entries(FI_CLAIMS))
    assert.deepEqual(validateClaim(c, fi, sid), [], `${sid} does not validate`);

  /* Every analytical section is dispositioned — no slot left silently empty. */
  const analytical = ['home', 'story', 'capacity', 'energy', 'services',
                      'duration', 'pipeline', 'grid'];
  for (const sid of analytical)
    assert.ok(FI_CLAIMS[sid], `${sid} has no disposition`);
  for (const sid of NO_CLAIM_SECTIONS)
    assert.ok(!FI_CLAIMS[sid], `${sid} argues nothing by design and needs no disposition`);

});

test('the blocked reserve section names a gap and never implies a revenue level', () => {
  const s = FI_CLAIMS.services;
  assert.equal(s.readiness, READINESS.BLOCKED);
  assert.deepEqual(s.gaps, ['reserveRevenueGap']);
  assert.ok(!s.text, 'a blocked section publishes no sentence');
  /* services: null must never become zero or a downside case. */
  for (const line of [...s.reason, ...s.requires])
    assert.ok(!/negligible|zero revenue|no revenue is available/i.test(line),
      'a withheld revenue line must not be narrated as an absent one');
});

test('the one supported Finland claim attributes its counterparty source', () => {
  const d = FI_CLAIMS.duration;
  assert.equal(d.readiness, READINESS.SUPPORTED);
  assert.deepEqual(d.evidence, ['statkraftOx2']);
  assert.ok(d.attribution, 'counterparty-reported evidence must stay visibly attributed');
  /* Reported, not measured. The facilities are under construction, so there is
     no operating asset that could have been measured — exact arithmetic on a
     disclosed design is still a disclosure. */
  assert.equal(d.basis, CLAIM_BASIS.REPORTED);
  assert.ok(!/fleet|Finnish batteries are|all /i.test(d.text[0]),
    'two facilities under one agreement are not the fleet');
  /* The four caveats the disposition must keep. */
  for (const [what, re] of [
    ['counterparty', /counterparty/i],
    ['two facilities, not the fleet', /two facilities/i],
    ['floor has no amount', /no amount/i],
    ['does not validate the other projects', /Nivala|Uusikaupunki/],
  ]) assert.match(d.caveat[0], re, `the caveat must keep: ${what}`);
});

test('reported is its own basis, separate from provenance and attribution', () => {
  /* Three axes that must not collapse: what kind of assertion, who stands
     behind the record, and whose name the reader sees. */
  const rec = evidenceRecords(fi).statkraftOx2;
  assert.equal(rec.provenance.authority, 'counterparty-reported', 'provenance is on the record');
  assert.equal(FI_CLAIMS.duration.basis, CLAIM_BASIS.REPORTED, 'basis is on the claim');
  assert.ok(Array.isArray(FI_CLAIMS.duration.attribution), 'attribution is bilingual and visible');
  /* And `reported` is a real member, so a typo cannot pass validation. */
  assert.ok(Object.values(CLAIM_BASIS).includes('reported'));
  assert.deepEqual(
    validateClaim({ ...FI_CLAIMS.duration, basis: 'anecdote' }, fi, 'duration')
      .filter(p => /basis must be one of/.test(p)).length, 1);
});

test('REPORT: what the Finland pass opened, and what it decided', () => {
  const reached = Object.values(FI_REVIEW).filter(r => r.access !== ACCESS.INACCESSIBLE).length;
  const tally = {};
  for (const c of Object.values(FI_CLAIMS)) tally[c.readiness] = (tally[c.readiness] || 0) + 1;
  console.log([
    `Finland source review 2026-08-19: ${reached} of ${Object.keys(FI_REVIEW).length} reached`,
    ...Object.entries(FI_REVIEW).map(([id, r]) => `  ${id.padEnd(22)} ${r.access}`),
    '  dispositions: ' + Object.entries(tally).map(([k, v]) => `${v} ${k}`).join(', '),
    `  register defects found by opening, not by link status: ${FI_DEFECTS.length}`,
    '  WIRED: duration only. Coverage 7/150.',
  ].join(String.fromCharCode(10)));
  assert.equal(reached, 9);
});
