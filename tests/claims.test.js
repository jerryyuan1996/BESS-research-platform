/* ---------------------------------------------------------------------------
   CLAIM VALIDATION — the mechanical half.

   Four things are modelled separately because they fail separately: readiness,
   basis, provenance and gaps. The tests below are organised the same way.

   What is NOT checked, anywhere: whether a claim is true, whether its evidence
   supports it, or whether a causal verb is earned. That is human review, and a
   passing suite here says nothing about it.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { markets } from '../src/markets/registry.js';
import {
  validateClaim, evidenceIds, gapIds, evidenceRecords, authorityOf, verificationOf,
  CLAIM_BASIS, AUTHORITY, VERIFICATION, READINESS, NO_CLAIM_SECTIONS,
} from '../src/governance/claims.js';
import { markets as allMarkets } from '../src/markets/registry.js';

const market = (id) => markets.find(m => m.manifest.id === id);
const wa = market('wa'), pjm = market('pjm'), fi = market('fi');

/* ---- provenance is read from the record, never asserted by the claim ------ */

test('authority is read from an explicit field, never inferred', () => {
  const p = evidenceRecords(pjm);
  assert.equal(authorityOf(p.bra2829, 'bra2829'), AUTHORITY.OFFICIAL);
  assert.equal(authorityOf(p.tb4, 'tb4'), AUTHORITY.THIRD_PARTY);
  /* PUBLISHER, NOT DEVELOPER. Statkraft published this and OX2 builds the
     sites, so counterparty-reported is the accurate category — a commercial
     party describing its own transaction. It was classified developer-reported,
     which named the wrong party and implied a closeness to the asset that the
     publisher does not have. */
  assert.equal(authorityOf(evidenceRecords(fi).statkraftOx2, 'x'), AUTHORITY.COUNTERPARTY);
});

test('self-reported and independent are different, and both are non-official', () => {
  /* The distinction the fourth category exists to keep. Counterparty and
     developer are both parties with a position in what they describe; a
     third-party analyst is not. Folding any of them together would let a
     reader discount them identically when they fail differently. */
  for (const a of [AUTHORITY.DEVELOPER, AUTHORITY.COUNTERPARTY, AUTHORITY.THIRD_PARTY])
    assert.notEqual(a, AUTHORITY.OFFICIAL);
  assert.notEqual(AUTHORITY.COUNTERPARTY, AUTHORITY.DEVELOPER);
  assert.notEqual(AUTHORITY.COUNTERPARTY, AUTHORITY.THIRD_PARTY);

  /* And every one of the three obliges a supported claim to attribute it. */
  const base = {
    readiness: READINESS.SUPPORTED, basis: CLAIM_BASIS.REPORTED,
    text: ['A sentence.', '一句话。'], evidence: ['statkraftOx2'],
  };
  assert.ok(validateClaim(base, fi, 'duration').some(p => /attribution/.test(p)));
  assert.deepEqual(
    validateClaim({ ...base, attribution: 'Statkraft' }, fi, 'duration'), []);
});

test('public availability never implies official authority', () => {
  /* The failure that forced this migration. A public-source COMPILATION is a
     third-party aggregation that happens to be publicly available. */
  const mkt = evidenceRecords(wa).mkt;
  assert.equal(mkt.provenance.availability, 'public');
  assert.equal(authorityOf(mkt, 'mkt'), AUTHORITY.THIRD_PARTY,
    'a publicly available compilation is not an official source');
});

test('final publication state never implies official authority', () => {
  const tb4 = evidenceRecords(pjm).tb4;
  assert.equal(tb4.provenance.publication, 'final');
  assert.equal(authorityOf(tb4, 'tb4'), AUTHORITY.THIRD_PARTY);
});

test('a record with no explicit provenance throws', () => {
  assert.throws(() => authorityOf({ file: 'x', status: ['Official — Final', 'x'] }, 'ghost'),
    /no explicit provenance.authority/);
  assert.throws(() => authorityOf({ provenance: { authority: 'plausible' } }, 'ghost'),
    /unknown authority/);
  assert.throws(() => verificationOf({ provenance: { authority: 'official' } }, 'ghost'),
    /no explicit provenance.verification/);
});

test('every source record in every market is explicitly classified', () => {
  /* Fail closed across the whole platform: an unclassified record is allowed to
     exist, but it is named here and cannot support a published claim. */
  const unclassified = [];
  for (const m of allMarkets){
    const src = evidenceRecords(m);
    for (const [id, rec] of Object.entries(src)){
      const a = authorityOf(rec, id);            // throws if absent or unknown
      verificationOf(rec, id);
      if (a === AUTHORITY.UNCLASSIFIED) unclassified.push(`${m.manifest.id}:${id}`);
    }
  }
  console.log('unclassified authority, pending human decision: ' + unclassified.length);
  for (const u of unclassified) console.log('  ' + u);
  assert.ok(unclassified.length <= 13, 'the unclassified backlog must not grow');
});

test('an unclassified record cannot support a published claim', () => {
  const wl = Object.entries(evidenceRecords(wa))
    .find(([, r]) => r.provenance.authority === AUTHORITY.UNCLASSIFIED);
  if (!wl) return;
  const problems = validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: [wl[0]],
  }, wa, 'grid');
  assert.ok(problems.some(p => /unclassified authority|re-verification/.test(p)));
});

test('PJM carries five declared gap records, and they are known ids', () => {
  /* Which is why a special-case rejection was not enough: they resolve like any
     other id, so the separation has to be structural. */
  const gaps = gapIds(pjm);
  assert.deepEqual([...gaps].sort(),
    ['opexGap', 'regForwardGap', 'regShareGap', 'taxGap', 'tollGap']);
  for (const g of gaps) assert.ok(evidenceIds(pjm).has(g));
});

/* ---- affirmative support and deficiency never share a field -------------- */

test('a gap record cannot be affirmative evidence', () => {
  const problems = validateClaim({
    readiness: READINESS.SUPPORTED,
    text: ['A claim.', '一项结论。'], basis: CLAIM_BASIS.MEASURED,
    evidence: ['bra2829', 'regForwardGap'],
  }, pjm, 'services');
  assert.ok(problems.some(p => /declared coverage gap/.test(p)));
});

test('a source record cannot masquerade as a gap', () => {
  const problems = validateClaim({
    readiness: READINESS.BLOCKED, gaps: ['bra2829'],
    reason: ['r', 'r。'], requires: ['x', 'x。'],
  }, pjm, 'capacity');
  assert.ok(problems.some(p => /is a source record, not a declared gap/.test(p)));
});

test('a supported claim cannot carry gaps at all', () => {
  const problems = validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['bra2829'], gaps: ['tollGap'],
  }, pjm, 'capacity');
  assert.ok(problems.some(p => /cannot carry gaps/.test(p)));
});

/* ---- verification-required demotes to incomplete ------------------------- */

test('a record flagged for re-verification cannot support a published claim', () => {
  const claim = {
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['consent'],
  };
  assert.ok(validateClaim(claim, wa, 'grid').some(p => /incomplete, not supported/.test(p)));

  /* The same evidence is fine once the claim stops claiming to be published. */
  assert.deepEqual(validateClaim({ ...claim, readiness: READINESS.INCOMPLETE }, wa, 'grid'), []);
});

/* ---- third party may support, with attribution --------------------------- */

test('third-party evidence supports a claim only with visible attribution', () => {
  const base = {
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['tb4'],
  };
  assert.ok(validateClaim(base, pjm, 'energy').some(p => /attribution/.test(p)));
  assert.deepEqual(validateClaim({ ...base, attribution: 'Modo Energy' }, pjm, 'energy'), []);
});

/* ---- basis and provenance are orthogonal --------------------------------- */

test('basis describes the assertion, not the source authority', () => {
  /* A modelled assertion on official inputs is legitimate, and so is a measured
     one on a third party data set. Neither combination is refused. */
  assert.deepEqual(validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A modelled result.', '一项模型结果。'],
    basis: CLAIM_BASIS.MODELLED, evidence: ['bra2829'],
  }, pjm, 'capacity'), []);

  assert.deepEqual(validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A measured result.', '一项实测结果。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['tb4'], attribution: 'Modo Energy',
  }, pjm, 'energy'), []);
});

/* ---- readiness shapes --------------------------------------------------- */

test('blocked carries no text, names its gaps, and says what would unblock it', () => {
  const withText = validateClaim({
    readiness: READINESS.BLOCKED, text: ['Should not be here.', '不应存在。'],
    reason: ['r', 'r。'], gaps: ['regForwardGap'], requires: ['x', 'x。'],
  }, pjm, 'services');
  assert.ok(withText.some(p => /must not carry claim text/.test(p)));

  assert.ok(validateClaim({
    readiness: READINESS.BLOCKED, reason: ['r', 'r。'], gaps: [], requires: ['x', 'x。'],
  }, pjm, 'services').some(p => /must name the gap records/.test(p)));

  assert.deepEqual(validateClaim({
    readiness: READINESS.BLOCKED, reason: ['Reserve revenue is withheld.', '备用收入暂缓发布。'],
    gaps: ['regForwardGap'],
    requires: ['A published forward clearing price and battery award share.',
               '已发布的远期出清价格与电池中标份额。'],
  }, pjm, 'services'), []);
});

test('none records a reason and nothing else', () => {
  assert.deepEqual(validateClaim({
    readiness: READINESS.NONE,
    reason: ['Methodology page — shows the working rather than arguing a case.',
             '方法说明页 — 展示计算过程而非提出结论。'],
  }, wa, 'data'), []);
  assert.ok(validateClaim({
    readiness: READINESS.NONE, gaps: ['tollGap'], reason: ['r', 'r。'],
  }, pjm, 'data').some(p => /records a reason, not gaps/.test(p)));
});

/* ---- section ownership and declared external dependencies ---------------- */

const OWNERSHIP = new Map([['brcp', 'rcm'], ['esoo', 'rcm'], ['mkt', 'story'],
                           ['cis', 'pipeline'], ['cef', 'grid']]);

test('evidence from another section must be declared as external', () => {
  const undeclared = validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['brcp'],
  }, wa, 'energy', OWNERSHIP);
  assert.ok(undeclared.some(p => /belongs to section "rcm", not "energy"/.test(p)));

  assert.deepEqual(validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['brcp'],
    external: [{ section: 'rcm', evidence: ['brcp'],
                 why: 'the capacity price is the floor this section measures against' }],
  }, wa, 'energy', OWNERSHIP), []);
});

test('an external declaration must name the section that actually owns the record', () => {
  const problems = validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['brcp'],
    external: [{ section: 'pipeline', evidence: ['brcp'], why: 'because' }],
  }, wa, 'energy', OWNERSHIP);
  assert.ok(problems.some(p => /owned by section "rcm", not "pipeline"/.test(p)));
});

test('an external declaration cannot cite evidence the claim does not use', () => {
  const problems = validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['esoo'],
    external: [{ section: 'rcm', evidence: ['esoo', 'brcp'], why: 'because' }],
  }, wa, 'rcm', OWNERSHIP);
  assert.ok(problems.some(p => /which the claim does not use/.test(p)));
});

/* ---- resolution and absence --------------------------------------------- */

test('an unresolvable or foreign id cannot pass', () => {
  assert.ok(validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['noSuchRecord'],
  }, wa, 'rcm').some(p => /does not resolve in wa/.test(p)));

  /* A real PJM record is still not WA evidence. */
  assert.ok(validateClaim({
    readiness: READINESS.SUPPORTED, text: ['A claim.', '一项结论。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['bra2829'],
  }, wa, 'rcm').some(p => /does not resolve in wa/.test(p)));
});

test('a claim must be one sentence, and a semicolon is two', () => {
  for (const en of ['This is one. And another.', 'Capacity leads; arbitrage is thin.']){
    assert.ok(validateClaim({
      readiness: READINESS.SUPPORTED, text: [en, '中文。'],
      basis: CLAIM_BASIS.MEASURED, evidence: ['brcp'],
    }, wa, 'rcm').some(p => /exactly one sentence/.test(p)));
  }
});

test('absence is a valid state at every level', () => {
  assert.deepEqual(validateClaim(null, wa, 'rcm'), []);
  assert.deepEqual(validateClaim(undefined, fi, 'services'), []);
  assert.equal(NO_CLAIM_SECTIONS.has('data'), true);
  assert.equal(NO_CLAIM_SECTIONS.has('portfolio'), true);
});

test('a decimal point is not a sentence boundary', () => {
  /* The first claim that quoted a price failed this check: "$325.00 per MW-day"
     reads as two sentences to a naive matcher. A number is the most likely
     thing a decision-useful claim contains, so the check had to learn the
     difference between a decimal and a full stop. */
  assert.deepEqual(validateClaim({
    readiness: READINESS.SUPPORTED,
    text: ['Every price cleared at the cap of $325.00 per MW-day UCAP.',
           '所有价格均以每MW`日325.00美元的上限出清。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['bra2829'],
  }, pjm, 'capacity'), []);

  /* And still catches a genuine second sentence. */
  assert.ok(validateClaim({
    readiness: READINESS.SUPPORTED,
    text: ['It cleared at $325.00. That is the cap.', '中文。中文。'],
    basis: CLAIM_BASIS.MEASURED, evidence: ['bra2829'],
  }, pjm, 'capacity').some(p => /exactly one sentence/.test(p)));
});

test('a dotted abbreviation is refused as house style, not silently mis-parsed', () => {
  /* The one-sentence rule looks for a terminator followed by whitespace, which
     cannot tell "U.S. market" from a sentence break. Rather than leave that as
     a known weakness, claim copy may not use dotted abbreviations at all — and
     the message says what to write instead. The validator is a house-style
     guard, not a parser, and this is where that shows. */
  const bad = validateClaim({
    readiness: READINESS.SUPPORTED, basis: CLAIM_BASIS.MEASURED, evidence: ['bra2829'],
    text: ['The U.S. market cleared at the cap.', '美国市场以上限出清。'],
  }, pjm, 'capacity');
  assert.ok(bad.some(p => /house style/.test(p)));
  assert.ok(bad.some(p => /US, not/.test(p)), 'the message must say what to write instead');

  /* The undotted form passes. */
  assert.deepEqual(validateClaim({
    readiness: READINESS.SUPPORTED, basis: CLAIM_BASIS.MEASURED, evidence: ['bra2829'],
    text: ['The US market cleared at the cap of $325.00 per MW-day.', '美国市场以每MW日325.00美元的上限出清。'],
  }, pjm, 'capacity'), []);
});
