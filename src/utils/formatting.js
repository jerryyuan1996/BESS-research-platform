/* Shared number and currency formatting. English conventions are preserved;
   formatters resolve the page language on every call, including after a toggle. */
import { pageNumberFormat } from './locale.js';

/** Markets retain their English convention; every formatter follows page language. */
export function numberFormats(locale){
  const NF0 = pageNumberFormat(locale);
  const NF1 = pageNumberFormat(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const NF2 = pageNumberFormat(locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const fmtN = (x) => NF0.format(Math.round(x));
  return {
    NF0, NF1, NF2,
    fmtN,
    fmt1: (x) => NF1.format(x),
    fmtPct: (x, d = 1) => (d ? NF1.format(x) : fmtN(x)) + '%',
  };
}

const US = numberFormats('en-US');

export const { NF0, NF1, NF2, fmtN, fmt1, fmtPct } = US;

export const fmtUSD  = (x) => '$' + fmtN(x);
export const fmtUSDk = (x) => '$' + fmtN(x / 1000) + 'k';
export const fmtUSDM = (x) => '$' + NF2.format(x / 1e6) + 'M';

/* Note the multiplication-sign glyph: the cockpit renders MOIC as '1.55×' with
   two decimals, while WA's investment lab renders '1.5x' with one decimal and an
   ASCII x. Both are kept — see markets/wa/ui.js for WA's variants. */
export const fmtIRR = (v) => (v == null ? '—' : NF1.format(v * 100) + '%');
export const fmtX   = (v) => (v == null ? '—' : NF2.format(v) + '×');

/* An absent IRR has two meanings and they must not print the same way.

   A dash says "no number here", which is right when a route does not exist in a
   market. It is wrong when the case was computed in full and the answer is that
   the cash flows never return the capital — that is a finding, not a gap, and
   the platform used to bury it behind the same glyph a missing input produces.

   `absent` is the engine's diagnosis object (result.irrHoldAbsent /
   irrExitAbsent). Where it is present the value is genuinely unsolvable and this
   prints N/M; where it is null the dash still means what it always meant. MOIC
   is unaffected in both cases and is what a reader should look at instead. */
export const IRR_NO_SOLUTION = ['N/M — no positive IRR solution', 'N/M — 无正IRR解'];

/* Keep the caller-supplied localiser for the missing-return label; numeric
   formatting above follows the page language through the shared helper. */
export const fmtIRRor = (v, absent, localise) =>
  (v != null ? fmtIRR(v) : (absent ? localise(IRR_NO_SOLUTION) : '—'));
