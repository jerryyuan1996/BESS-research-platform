# Acquisition underwriting

Approved scope: 18 October 2026. The buyer's acquisition ceiling and its matching target annual return replace legacy design net value on the home purchase list.

## Decision rules

- Greenfield and ready-to-build: all-equity funding throughout. Independently solve hold and sale ceilings and publish only the lower ceiling and **that route's** target return. Developers sell at operation start; the other three investor types sell five operating years after operation starts.
- Operating: remaining-life hold only. Optional debt is sized against acquisition value, cash available for debt service, lender value/commitment and tenor. Developers do not acquire operating assets.
- Value the future cash actually received after project taxes, remaining construction/development, lifecycle investment, transaction costs and retirement. Original construction costs are sunk for an operating purchase.
- The price is 100% project EV. Seller equity payment is EV minus assumed net debt. New borrowing funds the purchase and is not deducted again from the seller cheque.
- Do not publish missing, zero/negative, ineligible or unpriceable results. A high fit score or an old positive market call cannot bypass missing inputs or create a recommendation.

## Rates and costs

`src/acquisition/parameters.js` contains a dated, source-linked annual nominal currency snapshot: EUR 3.50%, GBP/AUD 5.50%, USD 5.25%, JPY 3.00%, PLN 6.25%, RON 6.75%. PLN/RON sovereign proxies contain credit risk; do not add that same spread twice. USD display conversion does not establish a USD investor return.

Buyer's target = currency base + investor/stage premium + 3 percentage points times the discounted merchant/renewal revenue share + an explicitly justified additional premium. Premiums for greenfield / RTB / operating are: strategic 8/6/6 points, infrastructure fund 9/7/7, first foreign buyer 10/8/8, developer 12/10/not applicable. Developer sale-at-operation exposure looks through to the asset's remaining revenue; no operating revenue before sale does not mean zero merchant risk.

The exit buyer's asset discount rate is base + 3 points + 4 points times remaining merchant exposure + additional premium. It is distinct from the seller's target return. No assumed yield compression.

Fees: acquisition 1.5% plus explicitly stated fixed fees; sale 1.5% plus separately modelled capital-gain tax; new financing 1%. Debt reserve: six months of debt service, released when fully repaid. Contingency: 10% greenfield / 7.5% RTB, only on construction not already fixed in price.

Debt conventions (LTV / DSCR / maximum years / margin): contracted 65% / 1.35 / 10 / 2.25 points; mixed 50% / 1.60 / 7 / 2.75; merchant 35% / 2.00 / 5 / 3.50. Leave two operating years after repayment and a contract tail for contracted debt. No automatic refinancing. These are screening assumptions, not bank offers.

For the editable reference, at least 80% discounted merchant/renewal revenue selects merchant terms. At least 80% secured revenue with five or more secured operating years selects contracted terms; the rest is mixed. An explicitly reviewed project debt classification can override that screening choice. In the simple input form, remaining construction is paid at the programme midpoint; a reviewed reference can supply the actual payment schedule. Future investment displayed is the largest declared scenario budget, not the probability-weighted amount a buyer might mistake for a funding commitment.

## Reference inputs and honest withholding

Existing comparison models are not complete acquisition models: their zero development premiums are intentionally **not** evidence that a greenfield project is free to acquire. No tax rate, grid cost, development success probability or retirement cost has been invented to fill those gaps.

`comparison.acquisition` holds explicitly reviewed reference inputs and `eligibleInvestors` per stage. All reference fields need evidence or a stated analyst assumption. `scripts/acquisition-readiness.mjs` reports missing fields privately to researchers. At implementation, the existing market records do not yet declare this complete acquisition contract; their home purchase rows remain absent until populated and reviewed. Existing market research and dashboards remain accessible.

The Investment Lab accepts project-specific costs, tax assumptions, development outcomes and source references, using the same solver. A conservative editable cash-tax proxy omits depreciation and interest tax relief. Full evidenced annual tax schedules can instead be provided in `annual`. Inputs are private to the browser session; downloads preserve the exact input and result including the two routes for model review. Only the lower route is displayed.

The default reference life is 15 years from operation start. Completed operating years are removed. Longer life requires an explicit `annual` schedule rather than copying year-15 revenue. All cash amounts are nominal and in the stated underlying currency. PL/RO require explicit native-currency mapping because their legacy EUR comparison contains converted PLN/RON inputs.

## Reader interface

The home list has three columns: market/design, ceiling with matching target return, buyer recommendation. There are no warning flags, placeholder rows or missing-input counts. Only available stages appear. Market details and digest consume the same qualified result. Hover, focus or tap explains project EV, seller equity cheque, further spending, target return and source assumptions. Essential contract conditions stay visible. Raw fit scores are explained as investor fit, never investment returns or success probabilities.

## Verification

`tests/acquisition.test.js` independently checks discounted cash-flow prices, route minima, delayed and failed development paths, tax/cost withholding, debt limits, seller equity, developer stage limits, remaining life and FX invariance. Existing comparison calculations and their frozen baseline are preserved.
