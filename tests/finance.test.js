/* Discounting primitives. These are the formulas the whole comparison rests on, so
   they are pinned against values that can be checked by hand. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { npvOf, irrOf, pvTail, annuity, irrSolutions } from '../src/utils/finance.js';

const close = (a, b, tol = 1e-9) =>
  assert.ok(Math.abs(a - b) <= tol, `expected ${a} to be within ${tol} of ${b}`);

test('supplemental expiry sensitivities expose multiple IRRs rather than choosing one',()=>{
  const roots=irrSolutions([-100,230,-132]);
  assert.equal(roots.length,2);close(roots[0],0.1);close(roots[1],0.2);
});

test('npvOf leaves the t=0 flow undiscounted', () => {
  close(npvOf(0.1, [100]), 100);
  close(npvOf(0.1, [0, 110]), 100);
  close(npvOf(0.1, [0, 0, 121]), 100);
});

test('npvOf at a zero rate is a plain sum', () => {
  close(npvOf(0, [-100, 30, 30, 30, 30]), 20);
});

test('irrOf finds the rate that zeroes NPV', () => {
  // -100 now, +110 in one year => exactly 10%
  close(irrOf([-100, 110]), 0.10, 1e-9);
  // -100 now, +60 for two years => 13.0662...%
  const r = irrOf([-100, 60, 60]);
  close(npvOf(r, [-100, 60, 60]), 0, 1e-9);
});

test('irrOf returns null when no sign change exists in [-0.9, 2.0]', () => {
  assert.equal(irrOf([100, 100, 100]), null, 'all-positive flows have no IRR');
  assert.equal(irrOf([-100, -100]), null, 'all-negative flows have no IRR');
});

test('irrOf handles a deeply negative case rather than throwing', () => {
  // The prototype relies on this: WA merchant is about -10.8%.
  const r = irrOf([-1000].concat(Array(15).fill(60)));
  assert.ok(r !== null && r < 0, 'a value-destroying case still returns a negative IRR');
  close(npvOf(r, [-1000].concat(Array(15).fill(60))), 0, 1e-6);
});

test('pvTail discounts the retained tail back to the cut year', () => {
  // Tail from index 2 of [_, _, 100, 100]: first retained flow is one period out.
  close(pvTail([0, 0, 100, 100], 0.1, 2), 100 / 1.1 + 100 / 1.21);
  assert.equal(pvTail([1, 2, 3], 0.1, 3), 0, 'an empty tail is worth nothing');
});

test('annuity amortises principal over n periods', () => {
  close(annuity(1000, 0, 10), 100, 1e-12);
  const pmt = annuity(1000, 0.05, 10);
  // The payment stream must discount back to the principal.
  let pv = 0;
  for (let i = 1; i <= 10; i++) pv += pmt / Math.pow(1.05, i);
  close(pv, 1000, 1e-9);
});
