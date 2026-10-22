# Acquisition underwriting

Revised 23 October 2026. Give an investor a reference for what a price, connection timetable and income arrangement could earn in each market. Public information and labelled assumptions fill project-data gaps. Actual project inputs replace those assumptions as they become available.

## Decision rules

- Greenfield and ready-to-build: all-equity funding throughout. Independently solve hold and sale ceilings and publish only the lower ceiling and **that route's** target return. Developers sell at operation start; the other three investor types sell five operating years after operation starts.
- Operating: remaining-life hold only. Optional debt is sized against acquisition value, cash available for debt service, lender value/commitment and tenor. Developers do not acquire operating assets.
- Value the future cash actually received after project taxes, remaining construction/development, lifecycle investment, transaction costs and retirement. Original construction costs are sunk for an operating purchase.
- The price is 100% project EV. Seller equity payment is EV minus assumed net debt. New borrowing funds the purchase and is not deducted again from the seller cheque.
- Keep all applicable references visible. Negative results show a model return where meaningful, a reverse construction budget and a path to test actual terms. They are not a judgement that every asset in that country is unattractive. Known technical failures and stage restrictions still apply.
- A user can inspect hold or sale IRR separately; the conservative purchase ceiling continues to require both applicable routes. Inputs and saved calculations use the same cash-flow evaluator.

## Nominal cash flows and tax accounts

The comparison model is real-terms. `cashflows.js` converts reference revenue/costs at their cash dates into nominal local currency using an editable 2% inflation convention. Fixed nominal contracts do not inflate; GB indexed capacity income can. VAT and failed-development refunds recover the original funded principal, with no inflation gain during the refund lag. Explicit annual schedules are nominal unless explicitly declared real. Equivalent nominal/real descriptions must give equal values: `(1 + nominal return) = (1 + real return) × (1 + inflation)`.

Reference tax accounts assume 85% depreciable cost, 10–15-year straight-line write-off, carried losses and interest deductions limited to 30% of positive operating earnings. Principal is not deducted. These are explicit house proxies, not a claim that local tax rules are identical. Asset-purchase basis follows price; a share purchase inherits the provided/assumed remaining basis. Asset-sale basis is reduced by prior depreciation. Explicit annual tax replaces the proxy. Eligibility for accelerated allowances is project-specific; see [UK guidance](https://www.gov.uk/capital-allowances/full-expensing).

## Rates and costs

`src/acquisition/parameters.js` contains a dated, source-linked annual nominal currency snapshot: EUR 3.50%, GBP/AUD 5.50%, USD 5.25%, JPY 3.00%, PLN 6.25%, RON 6.75%. PLN/RON sovereign proxies contain credit risk; do not add that same spread twice. USD display conversion does not establish a USD investor return.

Buyer's target = currency base + investor/stage premium + 3 percentage points times discounted merchant/renewal share. A user's target overrides the formula on both routes. Revised reference premiums for greenfield / RTB / operating are: strategic 5.5/3/2.5 points, infrastructure fund 6.5/4/3.5, first foreign buyer 7.5/5/4.5, developer 8.5/6/not applicable. Legacy explicit-input cases retain the original premiums unless overridden. The currency values are dated screening proxies, not verified live bond quotes. The reference calibration uses [Gore Street FY2025](https://www.gsenergystoragefund.com/content/news/archive/2025/170725.asp) as a stage/income valuation check; NAV discount rates are not levered equity IRR targets. These premiums remain house conventions, not measured investor averages.

The exit buyer's asset discount rate is base + 3 points + 4 points times remaining merchant exposure + additional premium. It is distinct from the seller's target return. No assumed yield compression.

Fees: acquisition 1.5% plus explicitly stated fixed fees; sale 1.5% plus separately modelled capital-gain tax; new financing 1%. Debt reserve: six months of debt service, released when fully repaid. Contingency: 10% greenfield / 7.5% RTB, only on construction not already fixed in price.

Debt conventions (LTV / DSCR / maximum years / margin): contracted 65% / 1.35 / 10 / 2.25 points; mixed 50% / 1.60 / 7 / 2.75; merchant 35% / 2.00 / 5 / 3.50. Leave two operating years after repayment and a contract tail for contracted debt. No automatic refinancing. These are screening assumptions, not bank offers.

For the editable reference, at least 80% discounted merchant/renewal revenue selects merchant terms. At least 80% secured revenue with five or more secured operating years selects contracted terms; the rest is mixed. An explicitly reviewed project debt classification can override that screening choice. In the simple input form, remaining construction is paid at the programme midpoint; a reviewed reference can supply the actual payment schedule. Future investment displayed is the largest declared scenario budget, not the probability-weighted amount a buyer might mistake for a funding commitment.

## Public reference ranges

`referencePolicy.js` separates source facts from house assumptions. Each market has downside, reference and improved cases. Each independently solves both applicable routes, taking the lower price and its matching target. Cases are conditional scenarios, not statistical confidence limits. The reference case uses 100% income/cost, 7.5% build contingency, 5% missing-grid allowance, 3% development/retirement, 2% immediate repairs, 18-month RTB commissioning, 3-year greenfield commissioning and 65% completion (US: 5 years, 40%). Local WA/Romania pathways take priority, including their midpoint. No extra blanket risk premium is added to the downside case.

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

Contract economics and evidence status are separate. References conditionally assume the stated contract is obtained; verifying the same contract does not change its economics. Future auction renewals remain risky. Debt based on an assumed contract is a conditional financing scenario, not a commitment. Every market's calculator offers native routes and explicitly hypothetical negotiated-floor/fixed-contract scenarios: 50%/75% of merchant income as editable starting prices for seven/ten years. A fixed fee replaces trading income; a floor retains only the excess.

Finland supplements the incomplete annual FCR-D seed with €0/15,000/30,000 net per MW-year for unused hourly-reserve opportunity, with fade. This is a stated sensitivity, not a Fingrid quote, and is not stacked on a full-dispatch fixed toll. [Fingrid](https://www.fingrid.fi/en/electricity-market/reserves_and_balancing/) establishes the distinct markets, not those amounts.

NEM CIS uses eligible revenue `R + min(payment cap, .9 × max(F−R,0)) − min(repayment cap, .5 × max(R−C,0))`. The middle band retains 100% of incremental revenue. The illustration's private floor is 113,500/.9, ceiling AUD200,000, payment cap AUD113,500 and repayment cap AUD100,000 per MW-year; these are house inputs, not cleared tender prices. Acquisition cash flows settle the collar after nominalisation. Eligible revenue/cost definitions require the actual [CISA](https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/open-cis-tenders/information-for-cisa-holders).

US pre-operation scenarios separately offer no credit, conditional 6%, or conditional 30% investment credit. [IRS](https://www.irs.gov/credits-deductions/clean-electricity-investment-credit) eligibility, timing, wage/apprenticeship, ownership and supply-chain conditions require project evidence. Defaults are 85% eligible construction basis, 95% cash realisation after 12 months, tax basis reduced by half the gross credit and no bonus credits. No repeat credit is assumed on operating purchases. Other future grants can be entered explicitly. Post-sale VAT/support receivables transfer into buyer-priced proceeds rather than being claimed twice; a commissioning sale allocates the future credit to the qualifying buyer and restores the seller's unclaimed credit basis reduction.

### Tax proxies

Apply the rate to the tax-account profit after the modelled deductions and loss carry-forward described above. Explicit annual tax replaces the proxy. Future tax cuts are not anticipated. Regional and group rates remain approximations.

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

Pre-operation asset-sale gains use purchase plus build/development basis, less support basis adjustments and depreciation already claimed. Ireland uses a 33% gain provision. Transaction structure can materially change this. The exit buyer inherits the remaining model tax schedule; no extra purchase-price basis step-up is invented in terminal value.

`comparison.acquisition` can hold project/reference inputs and `eligibleInvestors` per stage. Known values, including explicit zero, replace defaults; a complete project case produces an exact-input ceiling. `scripts/acquisition-readiness.mjs` distinguishes missing original evidence from the assumptions that allow a reference to be shown. Missing evidence alone does not remove a market from the public reference list.

The calculator accepts partial project inputs, an asking price, target return, income contract, 15/20/25-year life, tax period and inflation. It computes the selected route's IRR; the default shows the lower applicable return. Development cash flows are probability weighted, not an average of scenario IRRs. Ambiguous IRRs are not fabricated. Inputs stay in the browser session; version-3 downloads preserve full precision and all three scenarios.

Downside/reference/improved lives are 15/20/25 years, less completed age. `operating.js` preserves the first 15 years, removes retirement from the arbitrary comparison end and extends actual contract expiry, physical fade, service costs and declared lifecycle works. It never silently renews a fixed toll or copies year 15 forever. Longer life depends on site rights, equipment condition and continued maintenance, with no automatic salvage or additional free augmentation. PL/RO EUR model values translate at 4.37 PLN/EUR and 5.331 RON/EUR; constant future FX is an assumption, not a hedge.

## Reader interface

Home remains a compact market/design, price/target and timing/income list. Reference prices are shown first; an improved-only price is visibly conditional. The old “No acquisition budget yet” conclusion is removed. All 15 markets remain visible for applicable buyers. Popovers explain life, tax, income assumptions and sources. Fit scores remain investor-fit measures, never returns or success probabilities.

`workableTerms.js` reverses the same cash-flow model to show maximum fully priced construction/grid budget, minimum fixed contract income/tenor, delay by 6/12 months and price ceilings at user requirements of 8/10/12/15%. Fixed contract income replaces trading for its term. Each condition changes one input at a time; it is not a promise from a contractor or offtaker. Homepage construction limits are solved from cash dates/VAT/taxes, not a present-value gap mislabelled as a construction quote.

Displayed references use thousand-unit money; the home projection pools assumptions, packs case tuples and rounds indicative money to approximately USD100/MW before display. Full-precision valuation and downloads are unaffected. Three scenarios and added provenance measured 36.8 KiB shared data and 213.9 KiB first view after packing, within revised 40/220 KiB budgets. Calculator code stays lazy.

## Verification

Hand checks cover CIS regions/caps, nominal/real equivalence, VAT principal, depreciation/losses/interest, inherited basis, exit basis, contract expiry, no duplicate trading income, conditional credits and reverse-budget roots. Browser checks cover desktop/mobile, both languages, popovers, quotes, debt, contracts, lifetime and workable terms. Frozen legacy regression fixtures remain intact; the intentional NEM CIS arithmetic correction is reviewed separately.
