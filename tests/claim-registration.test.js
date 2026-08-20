/* ---------------------------------------------------------------------------
   CLAIM REGISTRATION ACROSS MARKET NAVIGATION.

   Claims register when a market's dashboard chunk loads, which keeps the prose
   out of the shared bundle. That trade buys a class of bug in return: the
   registry is global and long-lived, while the page it serves changes.

   The dangerous case is a slow chunk. A reader opens WA, navigates to PJM
   before WA's chunk finishes, and WA registers late — onto a page that is now
   PJM. If lookup were by "most recently registered" or by a mutable "current
   claims" variable, WA's argument would appear under PJM's heading. It is
   keyed by market id and read with the ACTIVE market id, which makes that
   impossible; these tests hold it that way.
   --------------------------------------------------------------------------- */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  registerClaims, claimFor, marketsWithClaims, __resetClaims,
} from '../src/markets/claimRegistry.js';
import { CLAIMS as WA } from '../src/markets/wa/claims.js';
import { CLAIMS as PJM } from '../src/markets/pjm/claims.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('loading the same market twice does not duplicate its claims', () => {
  __resetClaims();
  registerClaims('wa', WA);
  registerClaims('wa', WA);
  assert.deepEqual(marketsWithClaims(), ['wa'], 'one entry, not two');
  /* And the claim itself is still a single object, not an accumulated array. */
  const c = claimFor('wa', 'rcm');
  assert.ok(c && !Array.isArray(c));
  assert.equal(c.text.length, 2, 'still one bilingual pair');
});

test('two markets resolve independently, in either load order', () => {
  for (const order of [['wa', 'pjm'], ['pjm', 'wa']]){
    __resetClaims();
    for (const id of order) registerClaims(id, id === 'wa' ? WA : PJM);

    /* Each market answers with its own section, and with nothing for a section
       it does not have a claim for. */
    assert.ok(claimFor('wa', 'rcm'), `wa/rcm missing when loaded ${order.join(' then ')}`);
    assert.ok(claimFor('pjm', 'capacity'), `pjm/capacity missing when loaded ${order.join(' then ')}`);
    assert.equal(claimFor('pjm', 'rcm'), null, 'PJM has no rcm section claim');
    assert.equal(claimFor('wa', 'capacity'), null, 'WA has no capacity section claim');
  }
});

test('a late chunk cannot render its claim on the market now being viewed', () => {
  /* The slow-chunk case, played out. PJM is the active page; WA's chunk lands
     afterwards. Lookup takes the active market id, so WA's arrival changes
     nothing about what PJM renders. */
  __resetClaims();
  registerClaims('pjm', PJM);
  const activeMarket = 'pjm';
  const before = claimFor(activeMarket, 'capacity');

  registerClaims('wa', WA);                       // the straggler arrives
  const after = claimFor(activeMarket, 'capacity');

  assert.equal(after, before, 'the active market claim must be unchanged');
  assert.match(after.text[0], /Base Residual Auction/);
  /* And no WA claim is reachable through a PJM section id. */
  for (const section of Object.keys(WA)){
    const leaked = claimFor(activeMarket, section);
    if (leaked) assert.notEqual(leaked, WA[section], `${section} leaked from wa into pjm`);
  }
});

test('lookup is keyed by market, never by whatever registered last', () => {
  /* The property that makes the above safe, asserted directly against the
     source so a future refactor to a "current claims" variable fails here. */
  const src = readFileSync(path.join(REPO, 'src/markets/claimRegistry.js'), 'utf8');
  assert.match(src, /BY_MARKET\.get\(marketId\)/,
    'claimFor must resolve through the market id');
  assert.ok(!/let\s+current|currentClaims|lastRegistered/.test(src),
    'no mutable current-market state may exist in the registry');
});

test('print receives the same claim element as the screen', () => {
  /* There is no separate print render path for claims: the element in the DOM
     is the element that prints, so a claim cannot differ between the two. What
     print must NOT do is hide it, and the print stylesheet must not sweep it up
     with the controls. */
  const print = readFileSync(path.join(REPO, 'src/styles/print.css'), 'utf8');
  const at = print.indexOf('@media print{');
  const hideBlock = print.slice(at, print.indexOf('}', print.indexOf('display:none !important', at)));
  assert.ok(!/\.claim\b/.test(hideBlock), 'the claim must not be hidden in print');
  assert.match(print, /\.claim\{[^}]*break-inside:avoid/s, 'and must print as one block');

  /* And the component builds one element used by both, rather than a screen
     variant and a print variant that could drift. */
  const comp = readFileSync(path.join(REPO, 'src/components/sectionClaim.js'), 'utf8');
  assert.equal((comp.match(/class: 'claim'/g) || []).length, 1,
    'exactly one claim element is built');
  /* Comments stripped first. This asserted against the whole file and went red
     when a comment used the word "printed" to describe a string-concatenation
     bug — a prose match, not a print branch. What matters is that no CODE
     branches on print. */
  const code = comp.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/print/i.test(code), 'the component has no print-specific branch');
});
