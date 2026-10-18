# Financial reconciliation and investor workflow update

Baseline: `0e364a420111c83fb973e842e5fcab9a14097779`. Fixed illustrative FX seeds, USD per MW. These are software reconciliations, not refreshed market underwriting.

The owner approved equity repayment of loan balances at maturity, with additional equity when operating cash is insufficient. Construction draws follow the existing staged capital spending convention. Construction interest and fees remain explicitly zero; tax, reserves, cash traps and local lender terms require project evidence. Exit years are operating years.

The owner chose to retain existing hosting access settings and explicitly skipped private-access configuration. This release does not certify source publication rights; existing private-overlay exclusions and confidential marker scans remain required.

## Base-route exit-year-5 comparison

| Market | Asset exit IRR before | After | Equity exit IRR before | After | Best route/duration after |
|---|---:|---:|---:|---:|---|
| wa | 26.2244% | 24.9642% | 64.3314% | 62.1963% | cap/8h |
| nem | 2.8398% | 2.8398% | -1.0419% | -1.0419% | toll/4h |
| gb | 1.0107% | 1.0107% | -4.3501% | -4.3501% | toll/4h |
| de | 15.2460% | 15.2460% | 28.3760% | 28.3760% | mer/4h |
| it | 17.1727% | 17.1727% | 43.5686% | 43.5686% | cap/4h |
| ie | 9.3821% | 8.6803% | 18.1283% | 15.9913% | cap/4h |
| ro | 24.1650% | 24.1650% | 48.6881% | 48.6881% | mer/4h |
| pl | -6.4882% | -6.4882% | -15.9896% | -15.9896% | cap/1h |
| jp_tokyo | 0.2842% | 0.2842% | -5.8037% | -5.8037% | ltda/9h |
| jp_kyushu | 0.4764% | 0.4764% | -5.4687% | -5.4687% | ltda/9h |
| jp_hokkaido | -0.1959% | -0.1959% | -6.6248% | -6.6248% | ltda/9h |
| pjm | -2.3045% | -2.3045% | -6.8766% | -6.8766% | cap/4h |
| ercot | -12.2993% | -12.2993% | -30.0633% | -30.0633% | toll/2h |
| caiso | 0.6887% | -0.5400% | -6.3824% | -9.9812% | cap/4h |
| fi | 16.4305% | 16.4305% | 38.5824% | 38.5824% | toll/2h |

## What changed and why

- B1: GB capacity, operating-year-10 exit: equity IRR is 2.5668%, versus the reviewed 7.7259%. The $266581.97/MW year-7 balloon is actually settled. It is not subtracted twice when sale coincides with maturity. The hold case repays it too.
- B2: WA at 12/36 months construction now reports asset IRR 24.9642%/18.9279% and equity IRR 62.1963%/43.2688%. At zero debt the complete equity and asset vectors are identical, including capital refunds. These combined figures include B3, unlike the original isolated illustration.
- B3: annual secured and unawarded renewal streams now separate at expiry. The renewal tail uses the existing market-risk yield. WA, Ireland and CAISO lose exit value; the operating revenue assumption is unchanged. Debt cash-flow allocation and evidence composition consume the separated streams.
- B4: WA 7h brief hold IRR now agrees with the 18.2814% sweep result, instead of 19.81%. Annual capacity factors travel with the priced design into the brief and its owner scenarios. Home shortlist and digest consume that same brief.
- B5: GB 8h capacity base capex is £1386501.56/MW; bear capex is £1627008.73/MW, versus the incorrect £986323.51/MW. Absolute ranges scale with the design; percentages and years retain their units.
- B6: the shared production lock keeps all pending jobs and never cancels a running publication. Current main is checked inside that lock and immediately before promotion. The scanned production artifact is uploaded with domain assignment withheld, then that exact deployment is promoted. A pre-promotion record retains source, artifact hash, deployment identity and prior production deployment for rollback. Scheduled data commits follow the same current-main policy.
- B7: valuation rates come from the calculated result, including overrides, in the bilingual market brief, digest and saved case.

## Recommendation effects

The highest-value eligible route/duration is unchanged in every market. Value declines for WA, Ireland and CAISO. In the reference-case exit ranking, GB and CAISO move across a quintile boundary. Derived return grades now use the existing methodology separately for each investor’s hold or exit basis. Stored analyst grades and verdicts, and active held overrides, remain intact and visible; generated scores and disagreement flags can therefore change. No analyst buy/sell call is automatically rewritten.

## Investor workflow additions

- Investment Lab downloads a self-contained case: input snapshot, overrides, duration, entry stage, model commit, source/data checksums when available, resolved FX, valuation rates, annual asset and equity flows, debt conventions, evidence composition and unresolved gates. A replay helper recalculates from saved inputs instead of today’s registry.
- A user-set unlevered hurdle solves the maximum additional t=0 entry premium. Negative values mean the modelled cost needs a discount. No fund hurdle is assumed. Exit proceeds share is shown separately.
- A project checklist records connection, permits, land, EPC, performance remedies, warranty, offtake, counterparty credit, financing and supplier evidence. Missing references remain unresolved and do not receive a neutral score. Supplied references record the user’s review, not independent verification.
- The analyst’s long-life continuation case remains visible. New contract-expiry and merchant-only cases stop assuming unawarded fixed revenue after expiry. A 20-year award ends in year 20 rather than silently extending to year 25. Non-conventional sensitivities show no single IRR when multiple roots are found.
- Project-specific local financing and tax remain pending at the owner’s direction because no project documents were supplied. The common financing convention is explicitly illustrative. Supplier evidence includes a gate for validity, delivered scope and publication rights; documents have not been independently re-underwritten.

## Validation and release checks

Regression tests independently reconcile annual debt principal, equity contributions and distributions around operating years 6/7/8/10/15; zero-debt calendars across 0/12/24/36 months; expiry boundaries; every priced eligible route-duration; individual scenario directions; saved-case replay; and delayed-old-run publication decisions. The historical prototype fixture is preserved: its historical replay explicitly applies the old common yield to capacity tails, while separate tests enforce the corrected production policy.

The page checks exercise desktop/mobile, English/Chinese, actual valuation disclosures, hurdle entry, project-evidence states and case download. CI requires confidential markers and their verification key, checks built output and scans the exact uploaded Vercel artifact. A local missing-secret skip is not a release waiver.

Compatible source-map-js and brace-expansion patches remove the two high audit findings. The remaining two moderate package flags are ExcelJS and its uuid dependency. The installed ExcelJS code uses uuid v4 without a caller-supplied buffer; the advisory concerns v3/v5/v6 with a supplied buffer. No claim of a remotely exploitable browser path is made. ExcelJS stays a build-only dependency. A forced downgrade to ExcelJS 3.4.0 was not applied.

Production publication and first-refresh identity must be verified against the release record; local success alone is not live deployment confirmation.

The data workflow has a manual `verify_release` option for this acceptance check. It refreshes the selected public dataset through the normal data-commit/reusable-CI path and skips the analyst agent. It creates no new schedule. Bundle allowance is reallocated after loading the Investment Lab on demand: entry/shared limits change from 222/104 kB to 155/171 kB, leaving their combined 326 kB ceiling unchanged; the home-view ceiling is tightened from 258 to 195 kB.
