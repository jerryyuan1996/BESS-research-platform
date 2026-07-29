/* ---------------------------------------------------------------------------
   OBSERVATION ANCHORS — analyst-recorded, machine-read.

   An anchor records what the observable world looked like at the moment an
   analyst approved an assumption. Drift is then measured as movement away from
   the anchor, not as a claim that an observation should replace an assumption.

   Concretely: `merchGross` for GB is £73,145/MW/yr. The bridge cannot verify
   that number — it bundles revenue streams a day-ahead price series does not
   contain. But if the arbitrage index computed from GB prices was 41,200 when
   that figure was approved and is 48,600 today, the assumption is 18% stale in
   the only dimension the data can speak to. That is worth a pull request. The
   bare index value, with nothing to compare it to, is worth nothing.

   THIS FILE IS ANALYST-CONTROLLED. The ETL reads it and never writes it —
   tests/governance.test.js enforces that with the same boundary check that
   protects every other src/ file.

   ---------------------------------------------------------------------------
   HOW TO SET AN ANCHOR

   1. Run the pipeline: `npm run etl`.
   2. It prints, for every market, the current arbitrage index and reports
      `anchor not set`. Nothing is published against an unset anchor and no
      pull request is raised — the market simply reports "drift not measurable".
   3. When you are satisfied the market's `merchGross` reflects your current
      view, copy that printed index into the entry below with today's date and a
      note saying what you were looking at when you approved it.
   4. Commit it. From then on the pipeline measures movement against your anchor.

   Re-anchor whenever you deliberately revise `merchGross` — otherwise the
   pipeline will keep proposing a change you have already made.

   An anchor left unset is a safe state, not a broken one. It means the platform
   reports observations without inferring anything about your assumptions, which
   is exactly the behaviour you want before you have told it what you think.
   --------------------------------------------------------------------------- */

/**
 * @typedef {object} Anchor
 * @property {number} value       the arbitrage index at approval time, native currency /MW/yr
 * @property {string} asOf        ISO date the analyst approved it
 * @property {number} windowDays  complete trading days the index was computed over
 * @property {string} note        what was being looked at; why this level was accepted
 *
 * `windowDays` is not bookkeeping. Spreads are strongly seasonal in every market
 * here, so an index over 44 winter days and one over a full year are different
 * measurements. The detector refuses to propose a change when the current window
 * and the anchor's window are not comparable, and it needs this field to know.
 */

/**
 * Keyed by market id, then by the assumption path the anchor supports.
 *
 * Deliberately empty. Populating it is an analyst act and the platform is
 * designed to behave correctly — reporting observations, proposing nothing —
 * until it happens.
 *
 * @type {Record<string, Record<string, Anchor>>}
 */
export const ANCHORS = {
  // Example of the intended shape. Uncomment, replace with a real measured
  // index from `npm run etl`, and date it:
  //
  // gb: {
  //   'economics.merchGross': {
  //     value: 41200,
  //     asOf: '2026-07-29',
  //     windowDays: 365,
  //     note: 'TTM to Jun 2026 ENTSO-E day-ahead, 2h archetype. Approved alongside '
  //         + 'the £73,145 merchGross seed, which also carries BM and intraday.',
  //   },
  // },
};

/** The anchor for one market and assumption path, or null. */
export function anchorFor(marketId, path){
  return ANCHORS?.[marketId]?.[path] ?? null;
}

/** True when any anchor at all has been recorded. Used to phrase the report. */
export function anyAnchorsSet(){
  return Object.values(ANCHORS).some(m => Object.keys(m).length > 0);
}
