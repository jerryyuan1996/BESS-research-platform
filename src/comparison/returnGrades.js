/* ---------------------------------------------------------------------------
   THE FIFTHS RULE — how a ranked return becomes an asset-return grade.

   Markets are ranked from the highest return to the lowest and cut into
   fifths: grade = 6 − ⌈rank × 5 ÷ count⌉. With seventeen priced markets that
   is ranks 1–3 → 5, 4–6 → 4, 7–10 → 3, 11–13 → 2 and 14–17 → 1.

   This file holds the rule and nothing else. WHAT is ranked is decided where
   the figure is computed: since the analyst's sign-off of 16 November 2026 it
   is the investment model's all-equity hold return of the case on each
   investor's card (src/opportunities/returnGrades.js), no longer a return of
   the comparison engine. The engine still chooses designs; it grades nothing.

   Ties: two equal returns keep the order they were given in, so a ranking is
   reproducible. A value that is not a finite number is not ranked and gets no
   grade — a market the model does not price is never placed last by default.
   --------------------------------------------------------------------------- */

/** The grade of rank `rank` among `count` ranked markets. */
export const fifthGrade = (rank, count) => 6 - Math.ceil(rank * 5 / count);

/**
 * Rank and grade. `pairs` is [[id, value], …]; the result is keyed by id:
 * { rank, count, grade, value }.
 */
export function gradeByFifths(pairs){
  const rows = pairs
    .map(([id, value], index) => ({ id, value, index }))
    .filter(row => typeof row.value === 'number' && Number.isFinite(row.value))
    .sort((a, b) => b.value - a.value || a.index - b.index);
  return Object.fromEntries(rows.map((row, i) => [row.id, {
    rank: i + 1, count: rows.length, grade: fifthGrade(i + 1, rows.length), value: row.value,
  }]));
}
