/* ---------------------------------------------------------------------------
   Number and currency formatting.

   The prototype declared these separately in every program, with one real
   divergence: the cockpit used the 'en-US' locale and WA used 'en-AU'. For
   grouped integers and 1-/2-decimal values those two locales emit identical
   strings (comma group separator, period decimal separator), so the divergence
   is invisible in output — but it is preserved rather than unified, because
   silently changing a locale is exactly the kind of quiet behaviour change the
   brief rules out. `numberFormats(locale)` lets a market keep its own.

   The exports at the bottom are the cockpit's set ('en-US'). Charts fall back to
   `fmtN` when a caller passes no `yfmt`.
   --------------------------------------------------------------------------- */

/** Builds a locale-bound formatter set. Markets call this with their own locale. */
export function numberFormats(locale){
  const NF0 = new Intl.NumberFormat(locale);
  const NF1 = new Intl.NumberFormat(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const NF2 = new Intl.NumberFormat(locale, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
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
