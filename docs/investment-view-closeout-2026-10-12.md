# Investment view revision — close-out against the plan

Written 2026-10-12, against `docs/investment-view-revision-plan-2026-10-10.md`. It answers one
question: is everything in that plan done. The answer is **no, not all of it**. Phases 0 to 5 are
built and merged. Five things the plan describes are not built or not complete, and one of them
is a phase's exit condition.

## 1. The seven moves

| # | Move (plan summary) | State |
|---|---|---|
| 1 | Grade every market on the non-return dimensions against written anchors | **Done.** Fifteen markets, fourteen dimensions each, in `view/markets/` |
| 2 | Read the grades through four investor archetypes | **Done.** Four verdicts a market, sixty in all |
| 3 | Quantify entry where public sources allow | **Partly.** See §3, items 1 and 2 |
| 4 | Open on verdicts, not IRRs | **Done.** Verdict board at `/`, the old home page at `/returns` |
| 5 | Rebuild the dashboard around the decision, in seven tabs | **Done**, with one chart missing. See §3, item 1 |
| 6 | A scouting tier of cards for markets with no dashboard | **Machinery only.** See §3, item 3 |
| 7 | Reverse the automation rule | **Built, and not yet run live.** See §3, item 3 |

## 2. Phase by phase

| Phase | Exit condition in the plan | Met? |
|---|---|---|
| 0 — Method | The anchors and tables are the analyst's and are asserted | Yes |
| 1 — Four corners | View store, ledgers and sixteen verdicts for four markets | Yes |
| 2 — Home inversion | The home page answers "where should this investor enter" | Yes. The status chip and composite, due here, were retired on 2026-10-12 |
| 3 — Automation | A rule fires on a real refresh and changes a verdict live, with a changelog line | **Not shown.** The rules engine, the agent and `/changes` exist. Every line in `view/changelog.jsonl` is the analyst's; none is a rule's or the agent's |
| 4 — Scouting | Nine cards written by the agent; a run of clean passes | **No.** `view/scout/` holds no card. `/scout`, the schema, the gate and the agent's scout pass exist |
| 5 — The rest | Fifteen markets by four archetypes, all with ledgers | Yes. Most ledgers are lower bounds and five have no sourced amount |

Phases 3 and 4 wait on the agent running in CI with its key, which is the analyst's to switch on.
Nothing in this close-out touched `agent/`, either live list or the workflow's permissions.

## 3. What the plan describes and the repository does not have

1. **The exposure curve (§6.2).** The plan calls it the signature chart of the Entry tab: months
   from site control against cumulative capital at risk, each security posting marked. It was
   never built. It needs a dated stage for every ledger item, and only Western Australia and
   Romania have a stated development and build range. For the other thirteen it would be a curve
   with no time axis. **Recommended next**, for those two markets first.
2. **Time to first revenue as its own module (§4.3).** The plan names
   `src/entry/timeToRevenue.js`. What exists is the `timing` block on two ledgers and the
   time-to-revenue grade on all fifteen. Gate G37 is where the other thirteen would come from.
3. **Scout cards and a live automated change (§6.4, §7, phases 3 and 4).** As §2.
4. **The connection scorecard (§6.3).** Closed later on 2026-10-12, on the analyst's instruction,
   and further than the plan asked: the scorecard, its index, the `/returns` metric and every
   sentence that argued from the score are deleted. The plan would have kept the factor lists as an
   unscored checklist; they are kept only as a record, in `docs/grading/seed-tables.md`. What the
   dashboards say about how connection fails in each market stays, without the score.
5. **Gate G12.** Sourced and built as far as public previews allow
   (`docs/g12-treatment-proposal.md` §8). It stays open: no return target was found that states
   its life and augmentation.

## 4. Where what was built departs from the plan, by decision

| Plan | As built | Decided |
|---|---|---|
| Claims re-keyed at the tab merge (§6.2, phase 5) | Not re-keyed. A tab is a container of sections and claims stay keyed by section | Analyst, phase 5 decision 4 |
| Twelve dimensions | Fourteen: revenue certainty and asset return are graded with the twelve | Phase 0, §3.5 |
| `pillarStrip.js` as a component | The strips are drawn inside the verdict board | — |
| `view/scout/*.json` | The folder is created by the first card | — |
| Augmentation as a year and a cost | None. Warranty extension and a service agreement by default; capacity fades | Analyst, 2026-10-12 |

## 5. Closed in this change

- **Competition & Demand and Capital & Exit now open on their grades.** The plan has these tabs
  "add" saturation and the demand view, and debt, traded assets and scale. The grades existed only
  on the Investment Case tab. Each tab now shows its own, in the same rows.
- **Gates G34 to G39** are in the register in `docs/external-view.md`. The plan proposed them in
  §4.5 and they were never added.
- **`governance/authority.js`** no longer carries rows for `score.composite` and `status`. Both
  fields are gone, and an unknown field still reads as methodology because the lookup fails
  closed; the test asserts that.
- **Germany's pipeline table** printed "undefined" for a project with no owner.
- **Stale documents.** The exit yields in `docs/comparison-methodology.md` (the plan's Appendix A
  flagged them), the market count and table in `README.md`, and three notes that still called
  the status chip optional.

## 6. Still open, with no recommendation to act now

- **The EU origin grade.** The tariff database could not be opened from here on two attempts: its
  measures are drawn by script and the page was refused in the browser. The grade of 5 for
  Germany, Italy, Poland and Romania rests on a search. One look at TARIC heading 8507 60 with
  origin China settles it.
- **Japan's origin grade** stays at 3 until the auction round's guidelines are opened.
- **A capacity warranty for years 16 to 25** has no sourced price, so the long-life columns carry
  the year-15 cost forward.
- **The opex seeds** are taken to contain the warranty and service package. No seed is itemised.
- **Japan's "compare" region mode** is described in older notes and is not reachable in the
  engine.
- **Scroll to a section** on arriving at an old link was changed to work in an unpainted tab and
  has not been seen working in a visible browser.
