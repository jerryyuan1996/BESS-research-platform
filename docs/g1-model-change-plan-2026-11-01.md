# G-1 numerical changes and implementation decisions — 1 November 2026

The analyst approved the recommendations and authorised updating PRs #91–98, separate model/function PRs, final reconciliation and sequential script merges in the chat on 1 November 2026 (Australia/Perth).

**Approval recorded, 1 November 2026.** The analyst approved this plan for PJM, Poland and Italy in the chat, then approved Ireland's six-hour candidate and infrastructure-fund Wait call after the [longer-duration comparison](ireland-duration-review-2026-11-01.md). Ireland retains its assumed forward services revenue with consistent wording; a zero-services base is not approved. Append the decision and learning to market history. Calculations below were performed on copies in memory at baseline `7f8245d`; no snapshot or regression fixture was regenerated.

## Ireland: match the price and credit to one auction

- Keep the 2029/30 auction price of EUR135.50/kW/year. Date correction from the independent review: the auction was held on 26 March 2026; final results were published on 5 May. The earlier plan described it by the provisional-results month, April.
- Replace the illustrative four-hour credit 0.66 with **0.277**, for the model's 50 MW unit (40 < IC <= 50 MW band).
- Replace the 1, 2, 4, 6, 8-hour design curve `[0.22, 0.41, 0.66, 0.81, 0.89]` with **`[0.072, 0.143, 0.277, 0.425, 0.549]`**. The dashboard's 0.5 and 12-hour points become 0.036 and 0.690 from the same row; no interpolation is invented.
- Source: [SEMO IAIP2930T-4 v1.1, 13 August 2025](https://www.sem-o.com/sites/semo/files/2025-08/IAIP2930T-4.pdf), Table 3, PDF p.7, Other Storage, 40–50 MW row. The pack states the curves are final at this stage. Price: the 2029/30 auction results already cited in the model and #91.
- Arithmetic: capacity payment **135.50 × 1,000 × 0.277 = EUR37,533.50/MW/year**, previously EUR89,430. Use the engine's established rounding convention.
- **Superseding analyst ruling:** retain the current EUR8,000/MW/year services seed and existing assumed decay curve for the duration comparison. Describe this as uncontracted, assumed competitive services income within trading, not continued DS3 tariff rights after the long-stop. Remove the claim that the model prices no services. A zero-services case may be shown only as an explicitly labelled sensitivity, not the proposed base.
- Source for the long-stop: [SEM-25-031](https://www.semcommittee.com/files/semcommittee/2025-06/SEM-25-031%20System%20Services%20Regulated%20Arrangements%20to%20FASS%20-%20The%20Gap%20-%20Decision%20Paper.pdf), executive summary and Decisions 1–2, p.9. The successor's start remains unconfirmed in the opened June/October workshops recorded by #91.
- The 2030/31 initial pack's four-hour 0.151 is a separately labelled forward sensitivity, not mixed with the 2029/30 cleared price as a new observed base. [Initial pack](https://www.sem-o.com/sites/semo/files/2026-08/IAIP3031T-4.pdf), Table 3.
- In-memory design-engine results with retained services: four-hour hold IRR **9.00% → 1.73%**, first-year secured share **55.1% → 34.0%**. The separate duration comparison was subsequently reviewed and approved; see the dated learning record. These are operating-model/design results, not the market card's investment-summary returns. The earlier 1.29% no-services sensitivity is superseded as a proposed base.
- Duration finding: six hours has the highest hold IRR, but the platform ranks designs by value per MW at its existing yields: one hour is the least-negative capacity design and **every tested capacity design has negative value**. Do not describe this as a recommendation to buy a one-hour battery or keep saying four hours is best.
- Proposed call reconciliation: hold new-entry underwriting for review rather than claim the refreshed model supports Build position; keep earlier awarded contracts a distinct vintage priced from their own documents. A verdict change will be explicit in the view-store audit trail and the final script record.

## PJM: published indicative credit, existing price scenario

- Keep the 2028/29 secured payment and the analyst's current forward price path unchanged. No discount rate, price limit, weight or duration-selection rule changes.
- Replace four-hour renewal credit with the source's values. Ordered years **2029/30–2042/43**:

| Hours | Proposed renewal credit, in year order |
| --- | --- |
| 4 | .57, .42, .34, .30, .26, .24, .23, .22, .22, .22, .21, .20, .20, .19 |
| 6 | .66, .52, .44, .40, .36, .34, .33, .31, .32, .32, .32, .30, .30, .28 |
| 8 | .69, .56, .50, .47, .44, .41, .41, .39, .40, .41, .40, .39, .38, .37 |
| 10 | .76, .66, .60, .56, .54, .52, .51, .50, .51, .52, .51, .49, .48, .47 |

- Source: [PJM Preliminary ELCC Class Ratings for Use in the Reliability Procurement Backstop](https://www.pjm.com/-/media/DotCom/committees-groups/cifp-rbp/postings/preliminary-elcc-class-ratings-for-period-dy28-dy42.pdf), p.1. Opened 1 November 2026. Beyond 2029/30 these are **non-binding indicative values**, not awarded rights.
- Existing prices, same year order, USD/MW-day: **337.83, 500, 520, 470, 430, 400, 380, 380, 380, 380, 380, 380, 380, 380**. They remain analyst scenarios.
- Arithmetic per duration and year: `round(existing price × 365 × that year's duration-specific credit)`. Four-hour payments become **70,286; 76,650; 64,532; 51,465; 40,807; 35,040; 31,901; 30,514; 30,514; 30,514; 29,127; 27,740; 27,740; 26,353** USD/nameplate MW/year.
- Add mechanical support for each duration's own renewal curve; preserve the existing engine path for markets without such data. Do not scale all future years by a fixed 2028/29 ratio.
- Four-hour in-memory design hold IRR **2.37% → −0.31%**; year-one secured share remains 46.7%. Other-duration final results require the duration-specific implementation and will be reported before merge. Keep the existing Wait call.

## Poland: recommended grant cohort, not signed-cohort cash received

- Change `pl-grant-4h.grantPct` **37.9 → 37.3** (the code uses percentage points, not the fraction .373).
- Source: [official updated ranking list](https://www.gov.pl/attachment/20702c51-561a-418d-898e-e84139263bfb), posted 12 December 2025. #98 extracts 172 recommended grant rows, approximately PLN3.735bn recommended grants / PLN10.004bn corresponding project cost, **100 × 3.735 / 10.004 = 37.335…%, rounded to 37.3%**. Recompute the aggregate from the primary document before implementation; exclude loan rows and non-recommended rows. Do not count the cost again for a paired loan.
- Primary aggregate reverified 1 November 2026: **172** rows with type Dotacja and positive recommended grant. Total cost **PLN10,003,742,317.00**, recommended grant **PLN3,734,999,999.99**; `100 × grant / cost = 37.3360276748%`, rounded to **37.3%**. Loan rows and zero/non-recommended grants excluded. Only numeric aggregates retained; no participant names copied.
- This is a cohort screening assumption. A project's signed grant, eligible-cost definition, disbursement, durability and capacity-payment deduction still need its own documents. Do not substitute the separate signed-agreements cohort into this denominator.
- In-memory four-hour merchant design hold IRR with the grant **17.11% → 16.88%**. Market-card returns use a separate investment basis and will be rechecked after implementation. New entrants without an award keep grantPct zero. Calls remain separate: Situational on grant cohort, Wait on the ordinary capacity play.

## Italy: narrow the entry cohort; no invented 2028 capacity price

- Keep the existing economics only as a **legacy delivery-2027 contract-vintage illustration**. Re-scope the capacity play and action to RTB assets already holding an earlier awarded contract whose price, factor, delivery date, transferability and grid rights are verified. The current four-hour model factor is not a general new-entry factor.
- New delivery-2028 four-hour storage uses 40% North/Centre-North, 51% Centre-South, 21% South/Calabria, 21% Sicily/Sardinia as a dated rule record. It remains outside the legacy case pending a known auction price and a separately priced zonal case.
- Source: MASE decree 327/2026, Annex 4 §8.3 Table 11; [ARERA 370/2026](https://www.arera.it/fileadmin/allegati/docs/26/370-2026-R-eel.pdf), pp.9–11. Do not reuse the superseded 0.53 proposal.
- Physical day-ahead zone count **6 → 7**, adding Calabria as its own zone, from [ARERA 103/2019](https://www.arera.it/allegati/docs/19/103-19.pdf), operative points 1–2 (effective 2021). Keep MACSE procurement groupings separate from physical bidding zones; do not silently alter regional model weights or published auction totals.
- Use “maximum premium” for the second MACSE auction's cap. Awarded MW/average hours remain withheld in the story until the results report is opened. Capacity and MACSE cases are calculated separately pending contract-compatibility evidence.

## Work already authorised independently of numerical approval

1. Update the existing eight script branches, including bilingual copy, markers, source/claim links and final G-1 records. Preserve branch discussions. No replacement eight-PR set.
2. Add the small Poland two-card feature in a separate PR: distinct grant-cohort and ordinary capacity calls, using their own existing published result fields. Do not attach the grant case's financial summary to the ordinary capacity card.
3. Correct stale CAISO four-hour-test wording and replace the remaining ERCOT saturation reason's subscription index with public primary evidence in a separate content fix. Keep already-settled #101 decisions intact.
4. Approve signature-chart designs and fixed-vintage, source-located records. Price-data permissions stay parked; rights-unresolved price layers use unscaled Example fallbacks. Dataset registration and full story scene construction remain G-2 work, not an expansion of these G-1 scripts.
5. GB: use the services-fill chart; omit the unverified revenue-shift sentence and search-only EFR tender figures; omit the reference secured-share comparison unless its existing result is safely available. Romania: index only, Example daily shape, labelled reserve assumption, grant unresolved until the 2 November review, order trigger pending formal-text verification. ERCOT: softened post-Uri causal wording, short ownership check, Texas schematic. PJM: no pre-method-change accreditation points or 2024/25 context bar; future indicative line dashed. CAISO: saturation is platform interpretation at Fair, no RA-price direction while rights are parked.
6. Model/function PRs remain separately reviewable. Reconcile scripts against their final inputs/results, then merge each script only after its dependencies and exact-head checks pass. Aggregate sources/claims into shared registers afterwards.

## Verification and audit

Run npm test, test:current, build, test:budget and test:e2e before each PR candidate, and etl:verify after data/dataset changes. Never run test:baseline or rewrite legacy fixtures. A current-input assertion may change only alongside its approved source-backed assumption, with the old/new arithmetic shown here. Verify the confidentiality guard on staged bytes and the actual built output. Publish only through the existing GitHub Actions pipeline. Record all value changes and verdict/call decisions, including any secondary changes caused by comparative ranking. Preserve unrelated local work and every snapshot history.
