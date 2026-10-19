# Acquisition underwriting

Approved scope: 19 October 2026. Give an investor a reference for what a price, connection timetable and income arrangement could earn in each market. Public information and labelled assumptions fill project-data gaps. Actual project inputs replace those assumptions as they become available.

## Decision rules

- Greenfield and ready-to-build: all-equity funding throughout. Independently solve hold and sale ceilings and publish only the lower ceiling and **that route's** target return. Developers sell at operation start; the other three investor types sell five operating years after operation starts.
- Operating: remaining-life hold only. Optional debt is sized against acquisition value, cash available for debt service, lender value/commitment and tenor. Developers do not acquire operating assets.
- Value the future cash actually received after project taxes, remaining construction/development, lifecycle investment, transaction costs and retirement. Original construction costs are sunk for an operating purchase.
- The price is 100% project EV. Seller equity payment is EV minus assumed net debt. New borrowing funds the purchase and is not deducted again from the seller cheque.
- Keep applicable market references visible when project information is incomplete. Do not turn a negative value into a positive acquisition recommendation: show that no additional acquisition payment is supported, the expected return at zero acquisition payment where calculable, and the present-value improvement required. Explicit stage restrictions and known technical failures still apply.

## Rates and costs

`src/acquisition/parameters.js` contains a dated, source-linked annual nominal currency snapshot: EUR 3.50%, GBP/AUD 5.50%, USD 5.25%, JPY 3.00%, PLN 6.25%, RON 6.75%. PLN/RON sovereign proxies contain credit risk; do not add that same spread twice. USD display conversion does not establish a USD investor return.

Buyer's target = currency base + investor/stage premium + 3 percentage points times the discounted merchant/renewal revenue share + an explicitly justified additional premium. Premiums for greenfield / RTB / operating are: strategic 8/6/6 points, infrastructure fund 9/7/7, first foreign buyer 10/8/8, developer 12/10/not applicable. Developer sale-at-operation exposure looks through to the asset's remaining revenue; no operating revenue before sale does not mean zero merchant risk.

The exit buyer's asset discount rate is base + 3 points + 4 points times remaining merchant exposure + additional premium. It is distinct from the seller's target return. No assumed yield compression.

Fees: acquisition 1.5% plus explicitly stated fixed fees; sale 1.5% plus separately modelled capital-gain tax; new financing 1%. Debt reserve: six months of debt service, released when fully repaid. Contingency: 10% greenfield / 7.5% RTB, only on construction not already fixed in price.

Debt conventions (LTV / DSCR / maximum years / margin): contracted 65% / 1.35 / 10 / 2.25 points; mixed 50% / 1.60 / 7 / 2.75; merchant 35% / 2.00 / 5 / 3.50. Leave two operating years after repayment and a contract tail for contracted debt. No automatic refinancing. These are screening assumptions, not bank offers.

For the editable reference, at least 80% discounted merchant/renewal revenue selects merchant terms. At least 80% secured revenue with five or more secured operating years selects contracted terms; the rest is mixed. An explicitly reviewed project debt classification can override that screening choice. In the simple input form, remaining construction is paid at the programme midpoint; a reviewed reference can supply the actual payment schedule. Future investment displayed is the largest declared scenario budget, not the probability-weighted amount a buyer might mistake for a funding commitment.

## Public reference ranges

`src/acquisition/referencePolicy.js` separates official source facts from the platform's own sensitivities. Each market has two complete cases. Each endpoint solves both applicable ownership routes independently and uses their lower ceiling and its matching return target. The two cases are not statistical confidence limits and do not imply a range of returns at one common purchase price.

| Missing input | Favourable reference | Cautious reference | Basis |
|---|---|---|---|
| Unconfirmed income | 100% of market model | 80% | House sensitivity over the existing market research, not a published forecast |
| Operating costs | 100% of market model | 110% | House sensitivity; existing service fees and battery fade retained |
| Remaining construction | Existing construction cost + 5% contingency | Existing construction cost + 15% | House allowance; no repeat original construction charge on operating purchases |
| External grid costs, if absent | 3% of construction | 10% | House allowance; existing explicit grid contributions are not charged twice |
| Remaining greenfield development | 2% of construction | 5% | House allowance, not a market quotation |
| Immediate operating repairs | 1% of construction | 3% | House allowance |
| Retirement, if absent | 2% of construction | 5% | House allowance with no salvage credit; [NYSERDA](https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Clean-Energy-Siting/Decommissioning-and-End-of-Life-Considerations.pdf) supports the cost scope, not these percentages |
| Fixed transaction costs | 0.2% of construction | 0.5% | In addition to the 1.5% acquisition fee |
| Operating asset age | Newly operating | 3 completed years | Illustrative reference assets, not a statement about every asset in a market |
| RTB to commissioning | 12 months | 24 months | House timing; existing local pathway ranges instead used for WA (12–18 months) and Romania (9–15 months) |
| Greenfield to commissioning | 24 months | 48 months | House timing; US references 48–72 months; WA 49–61 and Romania 44–56 months use existing platform pathway conventions |
| Greenfield eventual completion | 75% | 50% | House scenarios; US references 50% / 25%. A quarter of successful paths are delayed a further year |
| Failure | Development costs lost | Development costs lost | No assumed resale proceeds or refundable deposits unless supplied |
| Extra uncertainty premium | None | 1 percentage point | Added to the existing investor/stage/revenue return framework |

[Berkeley Lab](https://emp.lbl.gov/queues) documents long connection waits and high withdrawals in the US. It motivates allowing for failure and delay; it does **not** establish the house success probabilities or non-US timing assumptions above. Local pathways remain conventions, not promises from a network operator.

Construction VAT is temporarily funded and recovered after the declared lag, or a house 6–12 month lag if unknown. Non-recoverable VAT is a cost. Remaining construction supplied by the user includes its grid budget; a separate generic grid allowance is then removed. If unfixed construction is supplied, only that portion receives the original 10% greenfield / 7.5% RTB contingency.

Unconfirmed contracts, private toll prices and future awards can support a **scenario** but do not become secured revenue or qualify for contracted bank terms. Operating reference purchases can use the merchant debt convention. Confirming a project agreement can change that classification. No ITC, grant, tax relief or special sale exemption is added automatically.

### Tax proxies

Apply the proxy to positive operating cash before lifecycle capex, without assuming depreciation or interest tax relief. This is an intentionally simple cash-tax provision, not a local tax return. Explicit annual tax schedules replace it. Future tax cuts are not anticipated. Regional and group tax ranges are approximations.

| Market | Operating cash-tax proxy | Public reference |
|---|---|---|
| Australia | 30% | [ATO company tax](https://www.ato.gov.au/tax-rates-and-codes/company-tax-rates); no small-business rate assumed |
| UK | 25% | [Corporation tax](https://www.gov.uk/corporation-tax-rates) |
| Germany | 30–33% | [GTAI](https://www.gtai.de/en/invest/investment-guide/corporate-taxation-in-germany) gives about 30%; 33% is a house local-tax stress |
| Italy | 27.90–28.82% | [Invest in Italy](https://www.investinitaly.gov.it/en/doing-business/taxation): 24% IRES, 3.9% IRAP with up to 0.92 points regional variation; combined here as a cash-tax proxy despite differing tax bases |
| Ireland | 12.5–15% | [Trading rate](https://www.revenue.ie/en/companies-and-charities/corporation-tax-for-companies/corporation-tax/basis-of-charge.aspx) and [large-group minimum tax](https://www.revenue.ie/en/companies-and-charities/pillar-two/index.aspx); sale-gain provision uses 33%, without assuming a share-sale exemption |
| Poland | 19% | [Corporate-income tax](https://www.podatki.gov.pl/en/corporate-income-tax/tax-rates/) |
| Romania | 16% | [Tax code](https://static.anaf.ro/static/10/Anaf/legislatie/Cod_fiscal_norme_2023.htm); group-specific minimum/turnover levies need project inputs |
| Japan | 30.64–35% | [JETRO](https://www.jetro.go.jp/en/invest/setting_up/section3/page3.html); 35% is a house local/structure stress |
| PJM | 21–31% | [IRS federal rate](https://www.irs.gov/publications/p542), with a house state-tax stress because PJM spans states |
| ERCOT | 21%, plus 0.75% of revenue reserved | [IRS](https://www.irs.gov/publications/p542), [Texas](https://comptroller.texas.gov/taxes/franchise/); the revenue reserve conservatively approximates franchise tax rather than claiming its actual margin base |
| CAISO | 27.9836% | 21% federal plus [8.84% California](https://www.ftb.ca.gov/file/business/tax-rates.html), allowing for state tax deductibility in this proxy |
| Finland | 20% | [Finnish Tax Administration](https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/limited-companies-and-cooperatives/income-tax/) |

For a pre-operation sale, use the corporate tax proxy on gains and the purchase plus future build/development as the simplified tax basis; Ireland uses a 33% gain provision. Transaction structure can materially change this and is editable.

`comparison.acquisition` can hold project/reference inputs and `eligibleInvestors` per stage. Known values, including explicit zero, replace defaults; a complete project case produces an exact-input ceiling. `scripts/acquisition-readiness.mjs` distinguishes missing original evidence from the assumptions that allow a reference to be shown. Missing evidence alone does not remove a market from the public reference list.

The Investment Lab starts with a usable reference range; blank fields retain reference assumptions. Costs, operating age, tax, completion timetable and contracts can be changed individually. A seller asking price also produces the expected cash-flow IRR at that price, showing the lower of hold/sale for pre-operation purchases and hold only for operating assets. Development outcomes are probability weighted; this is not the average of scenario IRRs. Ambiguous or unbounded IRRs are not represented by an invented percentage. Inputs are private to the browser session; downloads preserve the exact project inputs and both reference scenarios used.

The default reference life is 15 years from operation start, consistent with the [NREL reference framework](https://atb-archive.nrel.gov/electricity/2020/index.php?t=st), not a claim that every project lasts exactly 15 years. Completed operating years are removed. Longer life requires an explicit `annual` schedule. PL/RO legacy EUR model amounts are translated into local currency at 4.3700 PLN/EUR and 5.3310 RON/EUR ([ECB, 16 October 2026](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html)), and valued using PLN/RON hurdles. Constant future FX is an assumption, not a hedge. USD display conversion follows the same model conversion and does not change the underlying local return.

## Reader interface

The home list has three columns: market/design, ceiling with matching target return, and time to operation plus income arrangement. All 15 existing comparable markets have references for the four investor profiles; developers have no operating purchase case. A case with no acquisition budget remains visible and explains the economics in natural language. Hover, focus or tap gives each endpoint's assumptions, matched return, tax, budget, sources and date. Sources and assumptions are dated separately from the underlying market model. Raw fit scores remain investor-fit measures, never investment returns or success probabilities.

Display reference money is rounded down to thousands. The home projection pools repeated assumptions and rounds display-only outputs to reduce transfer size. Full-precision valuation and saved project inputs are unaffected. First-view and briefing-data budgets include this additional reference content.

## Verification

Tests cover the discounted cash-flow price, matched route/return, quoted-price IRR, failures/delays, explicit-input precedence, visible negative references, local-currency conversion, debt, remaining life and projection round trips. Browser checks cover desktop/mobile references, public-source popovers, partial project inputs and both languages. Existing comparison calculations and their frozen baseline are preserved.
