/* ---------------------------------------------------------------------------
   Discounting primitives, verbatim from the prototype.

   npvOf / irrOf appeared identically in the cockpit (lines 758-766) and in WA's
   investment lab (lines 3221-3229). `annuity` is WA-only in the prototype but is
   generic, so it lives here.

   irrOf is an 80-iteration bisection over [-0.9, 2.0]. It returns null when the
   bracket does not straddle zero — i.e. when there is no sign change and the cash
   flows have no IRR in that range. Callers must treat null as "no IRR", never as
   zero; fmtIRR renders it as an em dash.

   Do not "improve" these. The brief freezes the formulas, and tests/baseline
   asserts the outputs against the prototype.
   --------------------------------------------------------------------------- */

/** NPV of `cfs` where cfs[0] is at t=0 (undiscounted). */
export function npvOf(rate, cfs){
  return cfs.reduce((a, c, i) => a + c / Math.pow(1 + rate, i), 0);
}

/** Bisection IRR. Returns null when no root exists in [-0.9, 2.0]. */
export function irrOf(cfs){
  let lo = -0.9, hi = 2.0;
  const f = r => npvOf(r, cfs);
  if (f(lo) * f(hi) > 0) return null;
  for (let k = 0; k < 80; k++){ const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}

/** PV of arr[from..] discounted back to period `from` (first retained flow is one period out). */
export const pvTail = (arr, r, from) =>
  arr.slice(from).reduce((a, v, i) => a + v / Math.pow(1 + r, i + 1), 0);

/** Level payment amortising P over n periods at rate r. */
export function annuity(P, r, n){
  return r === 0 ? P / n : P * r / (1 - Math.pow(1 + r, -n));
}
