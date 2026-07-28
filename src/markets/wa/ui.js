/* ---------------------------------------------------------------------------
   WA-local formatting.

   Two deliberate divergences from the cockpit's formatters are preserved here
   rather than unified (see docs/migration-notes.md section 7):

     1. Locale is 'en-AU', not 'en-US'. For grouped integers and 1-decimal values
        the two emit identical strings, so this is invisible in output — but
        changing a locale silently is not something this refactor does.
     2. fmtX renders '1.5x' (one decimal, ASCII x). The cockpit renders '1.55×'
        (two decimals, multiplication sign). Both are correct in their own context.

   Everything else — h(), L(), card(), badge(), chip(), why(), kpi(), the charts —
   is imported from src/. This file exists only for the currency and locale
   specifics that genuinely belong to Western Australia.
   --------------------------------------------------------------------------- */
import { numberFormats } from '../../utils/formatting.js';

const { NF0, NF1, fmtN, fmtPct } = numberFormats('en-AU');

const fmtA  = (x) => 'A$' + fmtN(x);
const fmtAk = (x) => 'A$' + fmtN(x / 1000) + 'k';
const fmtAM = (x) => 'A$' + NF1.format(x / 1e6) + 'M';
const fmtMW = (x) => fmtN(x) + ' MW';

const fmtIRR = (v) => (v == null ? '—' : NF1.format(v * 100) + '%');
const fmtX   = (v) => (v == null ? '—' : NF1.format(v) + 'x');

export { NF0, NF1, fmtN, fmtPct, fmtA, fmtAk, fmtAM, fmtMW, fmtIRR, fmtX };
