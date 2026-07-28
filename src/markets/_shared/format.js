/* ---------------------------------------------------------------------------
   Currency- and locale-bound formatting, verbatim from the prototype (GB payload
   lines 661-672).

   This lineage derives its formatters from MKT rather than hardcoding a locale,
   which is why one factory serves four markets. Note fmtX renders '1.5x' (one
   decimal, ASCII x) - the home cockpit renders '1.55x' with the multiplication
   sign. Both are preserved; see docs/migration-notes.md.
   --------------------------------------------------------------------------- */

/** @param {{locale:string, cur:string}} MKT */
export function createFormat(MKT){const NF0 = new Intl.NumberFormat(MKT.locale);
const NF1 = new Intl.NumberFormat(MKT.locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const NF2 = new Intl.NumberFormat(MKT.locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const fmtN  = (x) => NF0.format(Math.round(x));
const fmt1  = (x) => NF1.format(x);
const fmtC  = (x) => MKT.cur + fmtN(x);
const fmtCk = (x) => MKT.cur + fmtN(x / 1000) + 'k';
const fmtCM = (x) => MKT.cur + NF1.format(x / 1e6) + 'M';
const fmtMW = (x) => fmtN(x) + ' MW';
const fmtPct = (x, d = 1) => (d ? NF1.format(x) : fmtN(x)) + '%';
const fmtIRR = v => v == null ? '—' : NF1.format(v * 100) + '%';
const fmtX   = v => v == null ? '—' : NF1.format(v) + 'x';
  return { NF0, NF1, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtMW, fmtPct, fmtIRR, fmtX };
}