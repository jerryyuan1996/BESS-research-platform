# Financing model cross-check against market practice — 29 October 2026

**Call.** The platform's return is more conservative than mainstream BESS underwriting in four
ways that move numbers: (1) it publishes the *lower* of a 20-year hold and a forced 5-year sale,
(2) it funds the build all-cash, (3) it leaves the US storage ITC out by default, and (4) it holds
Japan's long-term auction payment flat in nominal terms. Applying mainstream conventions lifts
unlevered returns by 2–7 points in most markets. It does not reorder the board: Finland, WA and Italy
stay on top, Germany moves up into the pass set, and GB, the US and Japan still miss their targets.

Scope: infrastructure-fund lens, ready-to-build entry, base reference case, the play each market
publishes today. Every number is the platform's own cash-flow engine (`src/acquisition/*`) with one
convention changed. Ontario has no published play and is not run. Harness: scratch script, not in
the repo. Nothing in the model was changed.

---

## 1 · The differences

| # | Item | Platform | Mainstream practice | Effect if applied | Evidence |
|---|---|---|---|---|---|
| 1 | **Which return is published** | Lower of 20-yr hold and 5-yr sale. The sale buyer discounts at base + 3% + 4% × merchant share, less 1.5% fee and sale tax | Project IRR to end of life, shown with the equity IRR. No forced-sale test | **0 to +7.0 pts** (Finland 0; Italy +1.1 and passes its target, 9.6 → 10.7 vs 10.0) | Strong |
| 2 | **Capital structure** | Pre-operation deals are all-cash by validation rule (`valuation.js`). Debt is allowed only on operating acquisitions | Project-financed at close: 60–75% gearing with contracts, ~50–60% with merchant exposure. Fully merchant deals are often equity-only | **+0.3 to +4.6 pts** where the unlevered IRR beats the cost of debt. **−1.4 to −3.8 pts** where it doesn't (GB, US, Japan) | Strong |
| 3 | **Hurdle basis** | Target = base rate + investor premium + 3% × merchant share, tested against unlevered cash flows. Range 9.2–13.8% | Unlevered hurdles of 8–12% (Germany). Levered equity targets cluster at 11–12% (survey median) and run 12–18% for German tolled or merchant deals | Fine as an unlevered hurdle. **PL and RO targets (13.3% / 13.8%) sit above the mainstream unlevered range** because the sovereign base rate is added in full. Adopting #2 needs a separate levered target, roughly 2–4 pts higher | Fair |
| 4 | **Debt terms: two modules disagree** | Operating-acquisition debt: 1.35x / 65% / 10 yrs contracted; 2.0x / **35% / 5 yrs** merchant; annuity repayment, sized on the weakest year. Dashboard debt layer: **1.15x** on the secured tranche, 2.0x on the merchant tranche, 7-yr mini-perm with the balloon paid by equity | Contracted DSCR 1.20–1.40x (base case); merchant debt sized on a downside curve, equivalent to about 2.0x on the central case. Repayment is sculpted. Notional tenor runs 15–20 yrs, capped by warranty, under a 7–10-yr legal mini-perm | The acquisition terms are conservative: merchant gearing is 35% against ~60% in practice. The dashboard's 1.15x is aggressive. Annuity repayment sized on the weakest year carries less debt than sculpting at the same minimum DSCR | Fair |
| 5 | **Life and augmentation** | 20 yrs, capacity fades, no augmentation. This is your 2026-10-12 ruling | 20–25 yrs, with augmentation as scheduled capex and an augmentation reserve | 25 yrs with fade: **+0.4 to +1.5 pts**, but Japan **falls** because the award ends at year 20. 25 yrs with capacity restored (cost = fade × landed DC price × 1.2, falling 4%/yr real): **+0.5 to +4.4 pts**; Japan slips 0.3–0.7 pts | Fair. Kept as a deliberate divergence |
| 6 | **US storage ITC** | Off by default (`supportCase:'none'`). It is a Lab option only | 48E storage ITC at 30% is standard in US models, sold at ~$0.91 per dollar (Crux 2026 average $0.913). The platform's own ERCOT notes say transacted tolls already assume it | **CAISO +2.2, PJM +2.7, ERCOT +3.0 pts.** **FEOC check:** "material assistance" rules apply to storage beginning construction after 2025, so a project built on the quoted Chinese DC block may not qualify | Strong for the credit; Fair for FEOC on this supply chain |
| 7 | **Tax depreciation** | Straight line over 10 yrs on 85% of the basis, with losses carried forward | US 5-yr MACRS + 100% bonus; GB full expensing; elsewhere broadly similar | **≈ 0** (US +0.1 pt, GB 0.0). Early-year tax losses already shelter income in these cases, so faster write-off doesn't move cash. No action | Strong (computed) |
| 8 | **Contract indexation** | Secured revenue is fixed nominal, except the GB Capacity Market | MACSE is indexed. Japan's long-term auction has an inflation adjustment, moving from CPI to several indicators. Tolls are often partly indexed | Fully indexed: **Japan +3.1 to +3.2 pts** (0.9% → 4.0%), WA +1.0, GB toll +1.0, CAISO +0.8, Ireland +0.7, Germany +0.5, Italy CM +0.4. Japan is the only market where this changes the picture | Thin until the METI formula is read |
| 9 | **Construction funding** | All cash, no IDC, no financing fees before COD | Construction debt drawn pro rata or after equity; IDC and fees are capitalised; converts to a term loan at COD | Second-order next to #2. The harness draws debt at COD (equity first), which sits between the two conventions | Fair |
| 10 | **Reserves and covenants** | 6-month DSRA, operating acquisitions only | DSRA plus O&M/augmentation reserve, lock-up at ~1.10x, cash sweep on merchant tails | Small drag on equity IRR (DSRA is in the harness). Doesn't change rankings | Fair |

**Already in line with practice:** 2%/yr degradation (practice 1.5–2.5%), 97% availability, 5–10%
optimiser fee, 2% inflation, 30%-of-EBITDA interest cap, decommissioning allowance, VAT timing, and
lenders sizing merchant debt on a downside curve. The last is equivalent to the 2.0x merchant test.
These need no change.

---

## 2 · Effect on each market (infrastructure fund, RTB, base case)

All figures are nominal after-tax IRRs. "@" is gearing on the build budget.

| Market | Play | Target | **Published** | Hold 20y (#1) | 25y fade | 25y restored (#5) | ITC / bonus / FE (#6–7) | Indexed (#8) | Levered (#2) | Levered, 7y merchant, no refi | **Mainstream unlevered** | **Mainstream levered** |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Finland | fi-toll-2h | 9.2% | **14.4%** | 14.4% | 14.8% | 16.3% | – | 14.4% | 18.8% @60% | 16.7% @60% | **16.3%** | **21.1%** @60% |
| WA | wa-cap-8h | 10.1% | **10.6%** | 11.9% | 12.5% | 12.4% | – | 12.9% | 16.5% @75% | 14.7% @70% | **12.4%** | **16.8%** @75% |
| Italy | it-cap-4h | 10.0% | **9.6%** | 10.7% | 11.4% | 12.0% | – | 11.1% | 14.1% @60% | 12.3% @52% | **12.0%** | **15.6%** @60% |
| Poland | pl-grant-4h | 13.3% | **9.2%** | 11.0% | 11.7% | 12.8% | – | 11.0% | 12.4% @41% | 11.3% @27% | **12.8%** | **14.9%** @44% |
| Romania | ro-mer-2h | 13.8% | **8.6%** | 10.7% | 11.4% | 12.8% | – | 10.7% | 11.4% @45% | 10.8% @31% | **12.8%** | **14.6%** @48% |
| Ireland | ie-cap-4h | 9.3% | **5.6%** | 7.9% | 8.8% | 9.2% | – | 8.6% | 9.1% @68% | 8.4% @53% | **9.2%** | **11.0%** @68% |
| Germany | de-toll-4h | 9.5% | **5.4%** | 8.2% | 9.0% | 10.3% | – | 8.7% | 9.9% @72% | 8.6% @47% | **10.3%** | **12.6%** @75% |
| NEM | nem-ltda-4h | 10.6% | **3.9%** | 6.9% | 7.8% | 8.9% | – | 6.9% | 7.2% @61% | 7.1% @55% | **8.9%** | **10.1%** @61% |
| GB | gb-toll-4h | 10.4% | **−2.5%** | 3.1% | 4.3% | 5.3% | 3.1% | 4.1% | 1.2% @47% | 2.0% @42% | **5.3%** | **4.6%** @46% |
| CAISO | caiso-cap-4h | 10.6% | **−2.2%** | 3.2% | 4.6% | 4.6% | 5.4% | 4.0% | 1.8% @46% | 2.4% @39% | **6.5%** | **6.1%** @43% |
| PJM | pjm-cap-4h | 12.1% | **−2.7%** | 2.2% | 2.9% | 3.9% | 4.9% | 2.2% | 0.2% @36% | 1.6% @26% | **6.2%** | **5.6%** @36% |
| Japan Kyushu | jp-kyushu-ltda-6h | 7.2% | **−3.0%** | 0.9% | 0.7% | 0.6% | – | 4.0% | −1.8% @54% | −1.7% @54% | **0.6%** | **−1.6%** @49% |
| Japan Tokyo | jp-tokyo-ltda-6h | 7.1% | **−3.2%** | 0.8% | 0.2% | 0.1% | – | 4.0% | −1.9% @54% | −1.8% @53% | **0.1%** | **−2.4%** @49% |
| Japan Hokkaido | jp-hokkaido-ltda-6h | 7.1% | **−3.6%** | 0.6% | −0.1% | −0.1% | – | 3.8% | −2.2% @53% | −2.1% @52% | **−0.1%** | **−2.7%** @48% |
| ERCOT | ercot-toll-2h | 10.1% | **−12.3%** | −5.3% | −3.8% | −0.9% | −2.3% | −4.2% | −9.1% @31% | −7.6% @28% | **1.0%** | **−0.4%** @31% |

*Mainstream unlevered* = hold to life + 25 yrs with capacity restored + US ITC at $0.913 with 100%
bonus depreciation + GB full expensing. *Mainstream levered* adds sculpted debt: 1.30x on contracted
cash flow and 2.0x on merchant; tenors of 18 yrs contracted and 15 yrs merchant (refinancing
assumed); gearing capped at 75% (≥50% contracted) or 60% otherwise; margins of 225 bp contracted
and 275 bp merchant over the platform's rate snapshot; 1% fee and a 6-month DSRA; the interest tax
shield is capped at 30% of EBITDA. Indexation (#8) is not in either mainstream column.

**Pass count against the platform's own targets:**

| Convention | Markets clearing target | Change |
|---|---|---|
| Published today | 2 of 15 (FI, WA) | — |
| Hold to life (#1 only) | 3 (+IT) | Italy crosses |
| Mainstream unlevered | 4 (+DE) | Ireland misses by 0.1 pt; PL and RO miss because their targets are 13%+ |
| Mainstream levered vs a flat 12% equity hurdle | 6 (FI, WA, IT, DE, PL, RO) | PL and RO pass only on a flat hurdle, not on a CEE-adjusted one |

---

## 3 · What drives the gap, ranked

1. **The min(hold, sale) rule is the largest single convention.** It costs 1–3 pts in the
   EUR, AUD and CEE markets and 4–7 pts in GB, the US and Japan. Those markets come out low because the
   5-yr buyer discounts at base + 3–7 pts (up to 12.5%) while the hold case already earns less than that. No
   mainstream model publishes this minimum. It is a deliberate stress test, so the clean fix is to
   publish the hold IRR as the headline and keep the sale route as a resale check.
2. **Leverage separates the board instead of lifting it.** It adds 3–5 pts where unlevered returns
   beat the all-in cost of debt (EUR 5.75%, AUD 7.75%): Finland, WA, Italy. It subtracts 1–4 pts in
   GB, the US and Japan, where the asset earns less than its debt costs. This matches the
   dashboard's existing note that leverage is dilutive for Japan's award.
3. **The US ITC is a ~2.5-pt omission against how the US market prices the asset.** It still leaves
   CAISO and PJM near 6% against 10–12% targets. ERCOT stays non-viable.
4. **Japan's case turns on indexation, not financing.** A fully indexed award takes Japan from about
   1% to 4%. That is still below the 7.1% target, but the gap halves. The fourth-round rules also
   put interest-rate movements in the adjustment scope. Read the METI rule before relying on this.
5. **Augmentation and a 25-yr life add 1.5–2 pts in most markets.** This is the convention you set
   aside on 2026-10-12. The comparison stands as a sensitivity, not a recommendation to reverse it.
6. **Accelerated tax depreciation is worth ≈ 0** on these cases. Drop it from the list.

## 4 · If you apply them — suggested order

| Step | Change | Moves | Size of work |
|---|---|---|---|
| A | Headline = hold IRR; sale route kept as a resale check | All 15 markets, +1–7 pts | Small: `valuation.js` route selection and the audit script |
| B | US ITC on by default at the transfer price, with a FEOC eligibility flag tied to the cell origin | 3 US markets, +2–3 pts | Small: `reference.js` default plus a cell-origin check |
| C | Japan award indexation, once the METI formula is confirmed | 3 Japan areas, up to +3 pts | Research gate first, then `securedIndexation` per market |
| D | One debt convention for both modules (1.25–1.30x contracted, 2.0x merchant, sculpted, warranty-capped notional tenor), plus a levered equity column with its own hurdle | Adds a column; headline unchanged | Medium: reconcile `parameters.js DEBT` with `projectDebt.js` |
| E | Keep 20-yr fade; show 25-yr restored as a comparison | None on the headline | Already present in the long-life view |

---

## Sources

- Modo Energy — [German tolls, leverage and equity returns](https://modoenergy.com/research/germany-battery-toll-agreements-leverage-equity-returns-de) (downside-case sizing, 7-yr mini-perm, ≥60% repaid by maturity, 4–6% debt cost, 12–18% equity target)
- Modo Energy — [Germany investment outlook Q2 2026](https://modoenergy.com/research/germany-battery-investment-outlook-q2-2026-executive-summary) (12–14% unlevered central, 5.5% adverse)
- Phelas — [BESS investment analysis](https://www.phelas.com/en/insights/knowledge/bess-investment-analysis) (8–12% unlevered hurdles, 1.2–1.4x base DSCR, ~1.1x lock-up, augmentation as scheduled capex, DSRA/O&M/augmentation reserves)
- pv magazine USA — [DLA Piper survey on merchant exposure](https://pv-magazine-usa.com/2026/06/23/storage-lenders-cap-merchant-exposure-at-60-finds-dla-piper) (11–12% median equity return; German lenders want 60–80% contracted)
- ESS News — [BBDF 2026 finance panel](https://www.ess-news.com/2026/03/31/bbdf-2026-finance-tolling-and-getting-the-merchant-balance-right) (12-month merchant phase, then ~80% tolled for 5–7 yrs)
- ESS News — [Predictable revenues key to BESS finance](https://www.ess-news.com/2026/07/16/predictable-revenues-key-to-battery-storage-finance-says-report/) and Baltic Wind — [Capcora/Suena white paper](https://balticwind.eu/whitepaper-examines-what-makes-battery-storage-projects-bankable/) (merchant 60% debt, 5-yr toll 70%)
- Noerr — [Financing BESS: legal considerations](https://www.noerr.com/en/insights/financing-battery-energy-storage-key-legal-considerations-for-investors-and-lenders)
- Herbert Smith Freehills Kramer — [Funding battery storage projects](https://www.hsfkramer.com/zh/insights/2023-06/financing-the-energy-transition-%E2%80%93-funding-battery-storage-projects) (cash sweeps, higher equity, shorter tenors)
- pv magazine USA — [Crux: 2026 credit pricing](https://pv-magazine-usa.com/2026/08/18/clean-energy-capital-expenditures-on-track-for-180-billion-in-2026-reports-crux/) (ITC average $0.913) · Utility Dive — [ITC glut](https://www.utilitydive.com/news/investment-tax-credit-glut-gives-corporate-buyers-more-leverage/830267/) (storage ITCs 90–93¢)
- Plante Moran — [BESS and tax credits, Oct 2026](https://www.plantemoran.com/explore-our-thinking/insight/2026/10/battery-energy-storage-system) · SEIA — [storage ITC](https://www.seia.org/initiatives/solar-investment-tax-credit-itc) (30% through 2033)
- Gov.uk — [Permanent full expensing](https://www.gov.uk/government/publications/capital-allowances-permanent-full-expensing)
- Shulman Advisory — [LTDA rule changes](https://shulman-advisory.com/?p=4836) (inflation adjustment moving beyond CPI; interest rates in scope from round 4) · ESS News — [Nozu BESS financial close](https://www.ess-news.com/2026/09/15/nozomi-energy-reaches-financial-close-and-starts-build-on-196-mwh-bess-in-japan/)
- Modo Energy — [MACSE results](https://modoenergy.com/research/en/italy-macse-results-low-prices-economics-october-25) (15-yr indexed contract, leverage lifts low-capex returns)
