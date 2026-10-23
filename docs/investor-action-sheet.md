# Investor action sheet

Implemented 23 October 2026, on main after PR53 and PR54.

The homepage groups all four investor types on one page. Each group shows two
leading opportunities; the remaining opportunities and watchlist are folded.
Investor and currency filters are presentation choices. Comparing up to three
opportunities is local to the page and uploads no project information.

## A recommendation is a specific play

The analyst's shortlist supplies route, storage duration, entry stage, its own
call and any grant cohort. `acquisition/opportunities.js` values that exact
design through the existing acquisition cash-flow evaluator. It does not rank
countries by their dollar ceiling or high return hurdle, change any analyst
call, or replace a merchant play with an invented toll. Source view records and
the comparison engine's published baseline are unchanged.

Strategic investors may use greenfield, RTB or operating. Infrastructure funds
and first-time foreign investors use RTB or operating. Developers use greenfield
or RTB and sell at commissioning. Known closed routes are excluded. A market
without an analyst view can retain a clearly conditional reference, such as
Ontario; absence of a view is not an assumption that the country is inaccessible.

Co-investment is an ownership structure, not an asset milestone. The WA
eight-hour co-investment uses the RTB project reference, explicitly conditional
on a local sponsor and the play's capacity-credit requirements. Its price is
for 100% of the project, not a quoted minority stake. No minority discount or
shareholder-agreement premium is invented.

The Poland grant-funded merchant play retains its 37.9% awarded-cohort support
and merchant income. Its grant is paid as conditional capital support in the
acquisition schedule, with matching tax basis treatment. The ordinary
unsubsidised case does not acquire that grant. Operating acquisitions do not
receive construction subsidies again. WA uses the play's annual capacity
derating in the operating cash flows, including its remaining-life extension.

## Conditions shown next to IRR

Each scenario contains `assumptions.terms`, built from its exact valuation input:

- Months from closing to operation, separately identifying the market model's
  construction period where available. Default commissioning cannot precede
  that construction period; supplied project timing can replace the reference.
- The actual play's income mechanism, amount, remaining tenor and coverage
  denominator. Fixed toll/floor reference plays assume whole-project coverage,
  explicitly as a scenario, rather than claiming a signed project agreement.
- Remaining construction, grid and contingency budget in current prices, with
  development spending separate and recoverable VAT excluded from this quote.
- The first full operating year's nominal operating cost, including the model's
  recurring service schedule. Separately modelled tax, lifecycle work and
  retirement remain in valuation, rather than being relabelled annual opex.
- Operating acquisitions show immediate equipment works, completed age,
  remaining life and remaining contracts. Original construction is not charged
  again.

Displayed price, return, time, income and costs all use one displayed scenario.
If only improved conditions support a positive price, its inputs are shown and
the price is marked conditional. The lower hold/sale ceiling and its own target
still govern unbuilt projects. Operating assets use hold only, with optional
debt. At a ceiling the target is a buying requirement, not an actual seller
quote, guaranteed yield or annual distribution.

## Contract and visual denominators

Fixed toll payments, floor protection, capacity income, awards, CIS collars and
market income have distinct labels and sentences. Capacity coverage is not
revenue coverage. The first-year contracted-income proportion is explicitly
labelled as a model revenue share, not MW under contract. CIS shows the capped
shortfall-support percentage, not a fictitious fixed-revenue percentage.
Floors are settled once; they are not added to a full merchant stream.

The timeline has one common scale across all references on the page. Contract
coverage uses 0–100% with a clearly stated denominator. Costs are aligned in
per-project-MW units, retaining storage hours. Construction and annual opex
never share a numerical axis. Dollar translation aids comparison but does not
change the local-currency IRR or imply FX hedging.

Hover/focus/tap explanations show the cautious/base/improved ranges, sources,
remaining life and cost inclusions. These are coherent screening scenarios,
not statistical intervals. Key contract and support conditions stay visible.
Known project inputs take precedence; selecting a homepage opportunity also
carries its play and stage into the acquisition calculator.

## Validation

Financial regression tests reconcile displayed costs, contracts, income shares
and remaining lives to the same dated cash flows. Dedicated checks cover scope,
the grant cohort, eight-hour WA derating, distinct fixed/floor/CIS terms and
scenario pairing. Browser checks cover all four groups, expanded markets,
desktop/mobile comparison, currency/language changes, popovers and calculator
handoff. No confidential inputs or source materials enter the public bundle.

The homepage first-load budget rises from 230 to 234 KiB for the conditions and
comparison UI (first measurement 231.02 KiB). The unrelated full-history budget
is reconciled from 88 to 90 KiB: main's PR54 history already measures 89.04 KiB.
