/* ---------------------------------------------------------------------------
   THE CLAIM ON THE PAGE.

   The rendering rules that carry meaning rather than style: only a supported
   claim reaches the DOM, an unpublished draft reaches nothing at all, and the
   caveat cannot be separated from the claim it qualifies.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLAIMS } from '../src/markets/wa/claims.js';
import { claimFor, marketsWithClaims } from '../src/markets/claimRegistry.js';
import { READINESS } from '../src/governance/claims.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENT = readFileSync(path.join(REPO, 'src/components/sectionClaim.js'), 'utf8');
const CSS = readFileSync(path.join(REPO, 'src/styles/components.css'), 'utf8');
const PRINT = readFileSync(path.join(REPO, 'src/styles/print.css'), 'utf8');

test('only a supported claim can render', () => {
  /* The gate. Everything else returns null before any element is built, so an
     unpublished draft cannot reach the DOM, an export or a screen reader. */
  assert.match(COMPONENT, /readiness !== READINESS\.SUPPORTED\) return null/);
  assert.match(COMPONENT, /!claim\.text\[0\]\) return null/);
});

test('claims register from the market chunk, not the shared bundle', async () => {
  /* An import map put every market's claim prose in the shared bundle and the
     budget test caught it 60 bytes over. Claims now register when a market's
     dashboard chunk loads, so the registry is EMPTY until one does — which is
     the property worth asserting, because a static import would silently make
     it non-empty again. */
  const { marketsWithClaims: live, __resetClaims } = await import('../src/markets/claimRegistry.js');
  __resetClaims();
  assert.deepEqual(live(), [], 'nothing is registered before a dashboard loads');

  const { registerClaims } = await import('../src/markets/claimRegistry.js');
  registerClaims('wa', CLAIMS);
  assert.deepEqual(live(), ['wa']);
});

test('the registry only exposes markets whose claims were reviewed', () => {
  /* Registration, not enumeration: a market appears here when its claims have
     been through evidence review, and most have not. Asserted as a property
     rather than a fixed list, so adding a reviewed market is not a test edit —
     but a market appearing WITHOUT review still fails. */
  /* Which markets CAN register is a source-tree property, checked statically:
     a market may ship a claims module only if it also has a source review. */
  const withClaims = readdirSync(path.join(REPO, 'src/markets'))
    .filter(d => existsSync(path.join(REPO, 'src/markets', d, 'claims.js')))
    .sort();
  /* Held as a property, which is what the comment above always promised and
     what the literal list underneath it was quietly breaking — Finland's review
     landing turned a passing test red for the one reason it should not, a
     reviewed market being added. The property below is the real assertion. */
  assert.ok(withClaims.length, 'at least one market has been through review');

  for (const id of withClaims){
    assert.ok(existsSync(path.join(REPO, 'src/markets', id, 'sourceReview.js')),
      `${id} ships claims but has no source review record`);
    const dash = readFileSync(path.join(REPO, 'src/markets', id, 'dashboard.js'), 'utf8');
    assert.match(dash, /registerClaims\(/,
      `${id} ships claims but never registers them, so they would never render`);
  }

  /* Unregistered markets and non-claim sections resolve to null, never to a
     stray object that a renderer might try to draw. */
  /* `de` has been through no review and ships no claims module at all — the
     case `fi` used to stand for, before Finland was reviewed. */
  assert.equal(claimFor('de', 'services'), null);
  assert.equal(claimFor('wa', 'data'), null);
  assert.equal(claimFor('nope', 'nope'), null);
});

test('exactly the three accepted WA sections would render', () => {
  const renderable = Object.entries(CLAIMS)
    .filter(([, c]) => c.readiness === READINESS.SUPPORTED)
    .map(([s]) => s).sort();
  assert.deepEqual(renderable, ['grid', 'rcm', 'story']);
});

test('every renderable claim carries its caveat in the same block', () => {
  /* A limitation moved to a methodology panel is a limitation nobody reads.
     For rcm it is the difference between a benchmark and a payment. */
  for (const [section, c] of Object.entries(CLAIMS)){
    if (c.readiness !== READINESS.SUPPORTED) continue;
    assert.ok(Array.isArray(c.caveat) && c.caveat[0] && c.caveat[1],
      `${section} must carry a bilingual caveat`);
  }
  assert.match(COMPONENT, /claim-caveat/);
  /* Appended to the same root, between the text and the metadata. */
  const textAt = COMPONENT.indexOf("class: 'claim-text'");
  const caveatAt = COMPONENT.indexOf("class: 'claim-caveat'");
  const metaAt = COMPONENT.indexOf("class: 'claim-meta'");
  assert.ok(textAt < caveatAt && caveatAt < metaAt, 'claim, then caveat, then metadata');
});

test('the grid claim never states a cadence, in either language', () => {
  const g = CLAIMS.grid;
  assert.ok(!/annual/i.test(g.text[0]), 'EN claim must not say annually');
  assert.ok(!/每年|年度/.test(g.text[1]), 'ZH claim must not say annually');
  assert.match(g.caveat[0], /not established/);
  assert.match(g.caveat[1], /尚未确立/);
});

test('no rendered claim carries the BRCP value', () => {
  /* Verified and recorded in the review, deliberately absent from the sentence:
     a number invites being quoted away from the methodology behind it. */
  for (const [section, c] of Object.entries(CLAIMS)){
    if (c.readiness !== READINESS.SUPPORTED) continue;
    const blob = c.text.join(' ') + ' ' + (c.caveat || []).join(' ');
    assert.ok(!/488[,.]?500/.test(blob), `${section} must not quote the BRCP value`);
  }
});

test('basis is rendered subordinate, and evidence resolves to a record', () => {
  assert.match(COMPONENT, /claim-basis/);
  assert.match(CSS, /\.claim-meta\{[^}]*font-size:var\(--fs-2xs\)/s,
    'metadata must be smaller than the claim it annotates');
  /* A link with no href would be a claim that cannot be checked. */
  assert.match(COMPONENT, /rec\.url/);
  assert.match(COMPONENT, /claim-evidence-nolink/);
});

test('the claim block cannot be split across a printed page', () => {
  assert.match(PRINT, /\.claim\{[^}]*break-inside:avoid/s);
  assert.match(PRINT, /\.claim\{[^}]*break-after:avoid/s);
  /* A printed link is useless as a link and essential as a citation. */
  assert.match(PRINT, /\.claim-evidence::after\{[^}]*attr\(href\)/s);
});

test('the claim region is announced before it is read', () => {
  assert.match(COMPONENT, /'aria-label'/);
  assert.match(COMPONENT, /Section claim/);
});

test('a bilingual attribution is resolved, not concatenated', () => {
  /* Finland's duration claim is the first to render an attribution at all, and
     it is a pair. The component appended `claim.attribution` directly, which
     for an array prints the English AND the Chinese, in both languages. A bare
     proper name — "Modo Energy" — still passes through unchanged. */
  assert.match(COMPONENT, /Array\.isArray\(claim\.attribution\)\s*\?\s*L\(claim\.attribution\)/,
    'a pair must resolve through L() before it reaches the page');
  assert.ok(!/\+ claim\.attribution\b/.test(COMPONENT),
    'the raw value must never be concatenated into the label');
});

test('reported renders with its own label rather than falling through', () => {
  /* An unlabelled basis is not an error in the renderer — the meta line just
     omits it — so a missing entry would silently drop the one thing that says
     this sentence is a disclosure and not a measurement. */
  assert.match(COMPONENT, /reported:\s*\['Reported', '企业披露'\]/);
});
