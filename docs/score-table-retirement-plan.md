# Retiring the status chip and the composite — plan for sign-off

Drafted 2026-10-12 against `origin/main` at `b9e0aea`. **Nothing here is built.** This is the last
approved piece of phase 5 (main plan §6.3, phase 5 plan §3.4). It is written up separately because
it reaches into the comparison interface and the governance code, which the phase 5 brief said not
to change without a plan.

## 1. Why now

Open any market and the landing tab now leads with four verdicts, set by you, each with its
arguments. Directly under them the old overview still says **"Investment stance: Selective"** and
**"Composite score 62/100"**. Germany's page says "Build position" for three investors and
"Opportunistic" for the fund, and then "Selective" for nobody in particular. Thirteen of fifteen
markets say "Selective". That is the contradiction §2.1 of the main plan was written about, and
since the merge to seven tabs it is on the same screen as its replacement.

## 2. What exists, by where it lives

| Thing | Where it is declared | Where a reader sees it | What else reads it |
|---|---|---|---|
| **Stance label** ("Selective", "Watch", "Research") | `manifest.status` in 15 manifests; `M.overall.statusL` in 10 `data.js` files | The "Investment stance" tile on five overviews (caiso, de, ercot, it, pjm) and its equivalents elsewhere | Nothing. `manifest.status` is read by no module since phase 2 |
| **Composite score** | `score.composite` in each `comparison.js`; computed from `components` in `data.js`, `scores.js`, `jp/regions.js`, `wa/lib/scores.js` | The "Composite score" tile on each overview; WA's home lists its components | `comparison/metrics.js` (a metric already hidden from the league table); `utils/validation.js` and `markets/schema.js` (required field); `governance/authority.js` (classed methodology); the JSON export |
| **Weighted component table** | `components` arrays, 7 to 8 lines a market | A table on six overviews (gb, ie, jp, nem, pl, ro) and WA's home | The composite above |
| **Connection-risk index** | `score.connectionRisk`; computed from `connFactors` | A scorecard in the grid section of eleven dashboards, editable by the reader; a line on the pending-market page | `comparison/metrics.js`, where it **is** a compared metric on `/returns`; validation, schema, authority, the JSON export |
| **Connection-factor lists** | `connFactors` arrays, 8 to 10 lines a market, each scored 0 to 3 | Inside that scorecard | The index above |
| **Duration scorecard** | `durFactors` | The duration section | Not in scope. §6.3 does not name it and it is not a verdict |

`tests/fixtures/legacy-inputs.mjs` carries `score` on each fixture market. The engine never reads
it, so `tests/baseline.test.js` does not depend on it.

## 3. What I propose, in three steps

Each step ends at a state worth stopping in, and the first is the one that fixes what a reader
sees.

### Step A — take them off the page (dashboards only)

No data is deleted and nothing outside `src/markets/` changes.

- **Remove the "Investment stance" and "Composite score" tiles** from every overview. The verdicts
  above them are the stance; the fit scores beside the verdicts are the only scores, and each
  belongs to one investor.
- **Remove the weighted component table** from the seven overviews that draw it.
- **Turn the connection-factor scorecard into a checklist.** It stays in the grid section, which now
  sits in Entry & Delivery, under the name "Project connection checklist". The lines stay, because
  they are good project diligence. Their 0 to 3 scores, the weights, the summed index, the band and
  the reader's ability to edit them go: a checklist of what to establish for a project is not a
  grade of a market, and the market's grades are now in the view store.
- **The house-view paragraph stays.** It is prose, it argues, and it is not a score. Where it
  quotes the composite it is reworded.

After step A no page shows a market-level score or a one-word stance.

### Step B — delete the composite and the stance from the data

- Delete `components` and `score.composite` from every market, `M.overall.statusL` from the ten
  data files, and `status` from the fifteen manifests.
- `utils/validation.js` and `markets/schema.js` stop requiring `score.composite`.
- `comparison/metrics.js` loses the `composite` metric. It is already hidden from the league table,
  so no page changes.
- `governance/authority.js` loses the `score.composite` row. **This is governance code.** The row
  says a composite is methodology and no automation may change it. Deleting a thing that no longer
  exists removes its protection with it; nothing becomes writable that was not.
- The JSON export drops `compositeScore`.

### Step C — the connection-risk index: keep, for now

§6.3 says the index is replaced by the Entry pillar's time-to-revenue and grid-scarcity grades. On
the dashboards step A already does that. But the index is also a **compared metric on `/returns`**,
ranked across markets, and that page is the old home page, kept deliberately as the place for the
engine's numbers.

I recommend leaving `score.connectionRisk` and its `/returns` column alone in this change, and
deciding it when `/returns` is next revisited. Removing it is a change to what the league table
ranks on. Keeping it means `connFactors` keep their scores in the data even though the dashboard
no longer prints them, which is a loose end and I would rather name it than hide it.

The alternative is to remove the column and the index now. That is clean, and it takes a ranked
metric off a page you may still use.

## 4. What is lost, and how to keep it

The component tables are real judgement: seven or eight weighted lines a market that somebody
argued over. §6.3 says to use each line as seed evidence for the first grades and then delete the
table. That happened for the eleven markets of phase 5: each grading sheet printed the seed lines
beside the dimension they bore on. The sheets were deleted when the grades were written, so the
mapping survives only in git history (commit `73798b5`).

For the four markets graded in phase 1 no such mapping was written down.

**I recommend one generated file, `docs/grading/seed-tables.md`, written in step B before the
arrays are deleted:** every market's component and connection-factor lines with their weights and
scores, as they stood. It costs nothing, it is not shown on any page, and it means the judgement is
retired and not destroyed.

## 5. Tests I expect to change

| Test | Change | Step |
|---|---|---|
| `tests/governance.test.js` | Two assertions name `score.composite` as methodology; they go with the row | B |
| `tests/registry.test.js` | Two fixture markets declare `score.composite`; the validation they exercise no longer requires it | B |
| `tests/bundle-budget.test.js` | Market chunks shrink a little; no budget needs raising | A, B |
| `tests/section-shape.test.js`, the claim tests | Expected unchanged. Three markets have a `home` disposition and all three are unpublished, so no published claim sits above a tile that is removed. I will check each before touching it | A |
| `tests/print-snapshot.test.js`, the export tests | Whatever pins `compositeScore` in an export | B |
| `tests/baseline.test.js`, `tests/current-model.test.js` | **Not touched.** The fixtures may keep their `score` field; the engine does not read it | – |

Untouched throughout: the comparison engine's formulas, the view store, both live lists, every
rights table, the gates, `agent/`, `etl/` and the workflows.

## 6. What I believe cannot be done as §6.3 words it

- **"Make the manifest field optional, then remove."** Nothing reads it, so the two steps are one.
- **"Move the factor lists to Entry and Delivery."** They are already there: the grid section became
  part of that tab in the merge. What remains is renaming them and removing the scoring.
- **`confidenceScore` "unchanged, shown per grade as its basis".** It is a decision-profile field,
  shown on `/returns`, and a grade's basis is already printed from the grade itself. I propose it
  stays exactly where it is and is not wired to the grades.

## 7. Pull requests

| # | Contents | Sign-off |
|---|---|---|
| 1 | Step A, all fifteen markets. Browser-checked in both languages at two widths | This plan |
| 2 | Step B, with `seed-tables.md` | This plan, and specifically the `authority.js` row |

Step C is not built unless you choose the alternative.

## 8. Decisions this needs from you

1. **Step A as described**, including the connection scorecard becoming an unscored checklist and
   losing its edit controls.
2. **Step B**, including the deletion of the `score.composite` row from `authority.js`.
3. **The connection-risk index on `/returns`:** keep for now (recommended), or remove with the rest.
4. **`docs/grading/seed-tables.md`** as the record of what is retired, or rely on git history.
5. **The duration scorecard:** out of scope, as proposed, or treated like the connection one.

## 9. As built (2026-10-12)

The analyst asked for the best recommendation on each decision in §8. What was built, and where it
departs from the text above:

1. **Step A, with one departure.** The stance and the composite are off every overview, and so is
   the weighted component table. **The connection scorecard was not turned into a checklist.** In
   five dashboards (Great Britain, Ireland, the NEM, Poland, Romania) its index is quoted inside the
   analytical prose, in band chips and in tiles, and the index stays on `/returns` under decision 3.
   Removing the scores from the card while the same number is still argued from in the paragraphs
   around it, and still ranked on `/returns`, would leave a page that contradicts itself. It goes
   when the index goes, as one change.
2. **Step B, with one departure.** `components`, `score.composite`, `overall.statusL` and
   `manifest.status` are deleted, with the composite metric, the export field and the schema
   requirement. **`governance/authority.js` was not edited.** Its `score.composite` and `status`
   rows are a rights table, and the standing instruction is that no rights table is touched without
   the analyst deciding it in terms. A row protecting a field that no longer exists is inert.
   Beyond the plan: a manifest that defines `status` is now refused by validation, so the label
   cannot come back beside the verdicts.
3. **The connection-risk index stays** on `/returns`, as recommended.
4. **`docs/grading/seed-tables.md`** holds every retired table, label and composite.
5. **The duration scorecard is untouched.**

Steps A and B went in one pull request, not two: with the tiles gone, the data under them had no
reader left.
