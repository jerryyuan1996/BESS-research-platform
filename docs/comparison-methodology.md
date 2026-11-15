# Comparison methodology

Current code at base commit `06ec0cc530473ff98347ed8853644d1fc5381fb4`, checked 15 November 2026. Two related models serve different purposes.

| Scope | Comparison engine | Headline investment model |
| --- | --- | --- |
| Owner | `src/comparison/engine.js` | `src/opportunities/investment.js` and `src/acquisition/` |
| Default window | 15 operating years | 20 operating years |
| Unit/currency | Per MW in USD | Per MW in project currency; display adapters expose USD and project totals |
| Clock | Capital schedule plus operating-year cash flow | RTB investment closing and dated construction/operation |
| Basis | Operating streams without the acquisition model's nominal/project-tax overlay | Nominal, after project tax, including purchase/construction timing |
| Debt | Unlevered core; separate `src/economics/projectDebt.js` analysis | All-equity case plus COD loan/equity case in `src/acquisition/leverage.js` |
| Consumers | Design/route screens, research, older lab and input adaptation | Home/global/market investment figures, current calculator and opportunity comparisons |

The return-grade basis is under a pending sign-off plan.

## Comparison engine: inputs and currency

The registry supplies each market's archetype, economics and route capabilities. Sponsor cost assumptions are applied at the registry/shared-dashboard boundary. `runCase(market, strategyId, exitYear, options)` checks availability, selects the revenue engine and decorates the result. `runBaseCase` resolves the default route. An unavailable route returns `na`, not fabricated economics.

`src/comparison/assumptions.js` owns the 15-year window and seed FX. `src/comparison/fx.js` owns active FX selection: permitted observed reference data can replace supported seeds, otherwise seed values remain explicit. Conversion is USD per unit of local currency. FX is neither universally live nor universally frozen.

`src/comparison/capex.js` reconciles component breakdowns to the authoritative build total, computes development/RTB consideration and schedules construction/VAT flows. The engine also accounts for declared grid contributions, tax/tariff additions, grant caps/eligibility and selected supply costs. Recoverable VAT is working-capital timing; non-recoverable VAT is capital cost. Construction timing can delay operation. A component breakdown does not silently replace the total.

## Comparison engine: streams and routes

| Array | Meaning |
| --- | --- |
| `secY` | Model fixed/secured cash for its stated term |
| `aucY` | Future auction renewals or post-contract cash priced as market risk |
| `mchY` | Merchant energy and incremental services after applicable fees, curves, degradation and retention |
| `svcY` | Equipment service/warranty **cost**, not ancillary-service revenue |
| `eb` | Net operating cash after fixed opex, service and lifecycle costs |

Economic classification does not establish an executed project contract. Evidence decoration separately reports modelled fixed income, evidence-secured income, executed-project income and proxy exposure.

`src/comparison/strategies.js` gates capacity-backed, merchant, toll/floor and long-term-award routes. A fixed toll generally replaces trading; an additive toll/capacity input retains its separate eligible capacity line. A floor leaves only trading above the floor in merchant cash. A toll may revert to merchant after expiry where its inputs say so. Auction-renewal markets separate the secured term from assumed future clearings. Long-term awards apply their specified retention/support rules; contingent support is settled by its dedicated helper.

Explicit merchant/services curves and degradation schedules take precedence over fallbacks. The code's fallback annual degradation is not a claim that all markets follow the same curve. Capacity factors and duration floors can vary by operating year. Equipment service schedules and lifecycle costs are deductions, not undisclosed offsets inside gross merchant revenue.

## Comparison engine: returns and exit

Hold/exit returns use full scheduled capital and operating vectors. Exit at operating year `X` values the remaining fixed, renewal and merchant streams separately, less remaining opex/service/lifecycle obligations. `assumptions.js` currently sets tail yields to 6.5% for fixed/secured, 10.5% for merchant/renewal and 7.0% for opex. These are comparison-engine valuation constants, not the investment model's target hurdle.

`src/utils/finance.js` provides `irrOf` (80 bisection steps over −0.9 to 2.0), NPV, `pvTail` and supplemental multi-root search. `null` never means zero. Result diagnoses distinguish missing metrics from cash flows without a usable IRR; associated MOIC/cash flows remain relevant.

Hold IRR, exit IRR, MOIC, first-year cash yield, payback, secured share/tenor and capital controlled per dollar are separate fields. `designFit.js` sweeps permitted route/duration choices; `refinement.js` applies scenarios. Entry-return analysis and opportunity screens retain their stated basis rather than relabelling a comparison return as the headline.

## Headline investment model: reference and timing

`referenceInvestment` in `src/opportunities/investment.js` defaults to RTB entry and 20 operating years. `src/acquisition/reference.js` adapts the market, route, duration and overrides; `pricingOptions` recalculates duration-dependent options for the chosen play.

The clock starts at investment closing. Remaining construction, VAT, recoveries, transaction costs, revenue qualification and operating flows retain their dates. Development/construction scenarios use their declared assumptions. Buying an operating asset does not charge its original construction budget again.

`src/acquisition/cashflows.js` applies nominal escalation/indexation and tax accounts. It retains revenue, opex, lifecycle capital, project tax, sale tax and terminal obligations where applicable. Current tax/supply/contract conventions are input policies, not new conclusions made here.

`src/acquisition/valuation.js` values dated cash flows, solves purchase-price ceilings at the investor target and computes hold/sale returns at the supplied price. The target is a hurdle, never the calculated IRR. Missing or non-unique returns stay unpriced/N/M.

## Headline investment model: financing and published fields

`src/acquisition/leverage.js` adds project debt at COD; pre-operation funding remains all cash in the reference. Contracted/merchant income have separate sizing coverage assumptions, gearing limits, maturity/repayment constraints and financing costs. Equity repays the required maturity balance. Debt is conditional model capacity, not a bank commitment.

| Field from `investmentMetrics` | Meaning |
| --- | --- |
| `holdIRR` | All-equity hold return used in the headline |
| `saleIRR` | All-equity sale-route return |
| `irr` | Conservative hold/sale result under the applicable route policy |
| `leveredIRR` | Equity return after the project loan |
| `targetReturn`, `test` | Investor hurdle and the existing all-equity/levered target test |
| `leverage.minCover`, `leverage.coverByYear` | Resulting debt coverage; the annual detail is included when `debtBreakdown` is requested |
| `leverage.contractedDSCR`, `leverage.merchantDSCR` | Loan-sizing inputs, not resulting coverage |
| `bridge`, `operatingUSD` | Investment-basis revenue/cost/tax cash flows used in charts |

`src/opportunities/summary.js` derives investor conventional/special results. `vite-plugin-briefing.js` emits lazy investor data. `src/experience/model.js` reads investment hold return for headline economics while retaining comparison calculations for supporting research. The older operating calculator remains disclosed in the Investment Lab.

## Verification

`npm run test:current` checks both historical fixtures and today's model expectations. Legacy fixtures deliberately retain historical inputs/yields; they do not imply current assumptions are frozen forever. Never regenerate them to make a presentation change pass.

Finance, acquisition, leverage, scenario and investor-page tests verify their model boundaries. Chart tests verify presentation of supplied data; browser tests verify built-site behavior. UI/documentation edits authorize no new assumptions, scoring weights, discount rates or live analyst judgements.
