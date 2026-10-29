# Financing revision plan — 29 October 2026 (approved and implemented)

**Call.** With your six instructions applied, returns rise in every market. The all-equity hold return
goes up 0.5–5.8 pts. The levered equity return beats it wherever the project earns more than its
debt costs: Finland, WA, Italy, Germany, Ireland, Poland, Romania and the NEM. It falls below it in GB, the
US, Japan and Ontario. Italy, WA and Finland clear their targets on the all-equity hold. Ireland
(9.1% vs 9.3%) and Germany's toll (9.1% vs 9.5%) fall just short. GB, the US, Japan and Ontario stay
well short.

Implemented after sign-off; §5 records the decisions. Every number comes from the platform's engine with the proposed
conventions switched on; the calculation sits in the session scratchpad. The debt table in §2 is for
you to confirm.

---

## 1 · The six instructions, as they would be implemented

| # | Your instruction | Implementation | Derivation / source |
|---|---|---|---|
| 1 | Present the hold return | Show **all-equity hold** beside today's **lower of hold and 5-yr sale**, on returns rows and market pages | Both already exist in `valuation.js`; only the comparison table shows them today |
| 2 | Present all-equity and levered return | New **levered equity IRR** (hold route), computed beside the unchanged all-cash return. Debt in §2 | Sizing rules below |
| 3 | Two US scenarios | **(a)** 30% ITC, transferred at $0.913/$, with non-FEOC DC blocks. **(b)** No ITC, with Chinese DC blocks. Both use the landed-cost method already used for the HiTHIUM quote | §3 |
| 4 | Inflation 2.5% on all revenue | Inflation 2.0% → **2.5%** for all real cash flows (revenue and cost). **Every secured contract indexed at 2.5%**; today only the GB Capacity Market is | Your assumption. Contract terms differ (see decision B) |
| 5 | 20 years, capacity fades | No change: already the convention | Your 2026-10-12 ruling |
| 6 | US and GB tax | **US:** 5-yr MACRS with 100% bonus (OBBBA, property acquired after 19 Jan 2025); ITC basis reduced by half the credit; NOL use capped at 80% of taxable income. **GB:** full expensing at 100% in year 1, 25% CT | IRS / OBBBA; gov.uk permanent full expensing |

---

## 2 · Debt sizing — please confirm

**Rule.** One loan per project, drawn at COD and sized on each year's after-tax cash flow
(sculpted):

- Contracted cash flow must cover debt service by **1.20–1.40x**, set by contract quality:
  - **1.20x** for multi-year state or TSO payments: capacity contracts of 10+ years, LTDA, CIS terms of 15 years.
  - **1.30x** for fixed tolls with private offtakers.
  - **1.40x** for floors and collars, and for any contract shorter than 7 years.
- Merchant and auction-renewal cash flow must cover **2.00x** (central case). This is equivalent to the lender downside curve Modo describes.
- **Legal maturity** is the contract tenor where the contract runs 7 years or more (capped at 18). Otherwise it is a **7-yr mini-perm**.
- The **notional profile** runs up to 15 yrs (or the contract tenor if longer). It is limited so that **at least 60% is repaid by legal maturity**, per Modo's German lender terms.
- **Equity repays any balloon** at maturity, which is the platform's approved policy. The refinanced alternative is shown in §4.
- **Gearing cap:** 75% of the build budget where secured revenue is ≥ 50% of year 1, otherwise 60%.
- **Rate:** the platform's base-rate snapshot, plus 225 bp on contracted and 350 bp on merchant service, blended by share. Plus a 1% fee and a 6-month DSRA.
- Interest is tax-deductible up to 30% of EBITDA.

"Gearing" below is debt ÷ build budget (construction + contingency + grid allowance, excluding
VAT). Debt is per MW in the cash-flow currency.

| Market | Play | Contract (yrs, yr-1 secured share) | Contracted DSCR | Legal / notional | All-in rate | Debt / MW | **Gearing** | Min cover | Balloon at maturity |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| Italy | it-cap-4h | Capacity, 15y, 20% | 1.20x | 15 / 15 | 6.6% | EUR 558,951 | **60.0%** (cap) | 2.29x | 0% |
| Ireland | ie-cap-4h | Capacity, 10y, 55% | 1.20x | 10 / 15 | 6.2% | EUR 911,314 | **75.0%** (cap) | 1.48x | 25% |
| WA | wa-cap-8h | Capacity, 10y, 78% | 1.20x | 10 / 15 | 7.9% | AUD 2,178,327 | **75.0%** (cap) | 1.73x | 26% |
| Poland | pl-grant-4h | Merchant + grant | — | 7 / 10 | 9.8% | PLN 1,513,992 | **33.9%** | 2.00x | 40% |
| Poland | pl-cap-4h (new entrant) | Capacity, 17y, 10% | 1.20x | 17 / 17 | 9.6% | PLN 2,494,121 | **55.8%** | 1.83x | 0% |
| Finland | fi-toll-2h | Optimiser floor, 7y, 40% | 1.40x | 7 / 11 | 6.4% | EUR 279,475 | **60.0%** (cap) | 2.28x | 39% |
| Germany | de-toll-4h | Toll, 5y, 100% | 1.40x (<7y) | 7 / 11 | 5.8% | EUR 646,932 | **65.5%** | 1.40x | 37% |
| Germany | de-mer-4h (strategic) | Merchant | — | 7 / 10 | 7.0% | EUR 522,296 | **52.9%** | 2.00x | 37% |
| Romania | ro-mer-2h | Merchant | — | 7 / 10 | 10.3% | RON 1,317,575 | **37.6%** | 2.00x | 37% |
| NEM | nem-ltda-4h | CIS collar, 15y, 61% | 1.40x | 15 / 15 | 8.1% | AUD 771,301 | **58.1%** | 1.59x | 0% |
| GB | gb-toll-4h | Toll, 10y, 100% | 1.30x | 10 / 15 | 7.8% | GBP 518,929 | **54.9%** | 1.30x | 27% |
| GB | gb-cap-4h (strategic) | Capacity, 15y, 12% | 1.20x | 15 / 15 | 8.8% | GBP 398,153 | **42.1%** | 1.82x | 0% |
| CAISO (a) | caiso-cap-4h | RA, 10y, 78% | 1.20x | 10 / 15 | 7.7% | USD 736,472 | **49.9%** | 1.29x | 22% |
| CAISO (b) | caiso-cap-4h | RA, 10y, 78% | 1.20x | 10 / 15 | 7.7% | USD 730,256 | **60.1%** | 1.29x | 22% |
| PJM (a) | pjm-cap-4h | Capacity, 1y, 47% | 1.40x (<7y) | 7 / 12 | 8.1% | USD 457,401 | **31.0%** | 1.67x | 38% |
| PJM (b) | pjm-cap-4h | Capacity, 1y, 47% | 1.40x (<7y) | 7 / 12 | 8.1% | USD 454,622 | **37.4%** | 1.67x | 37% |
| ERCOT (a) | ercot-toll-2h | Toll, 7y, 100% | 1.30x | 7 / 15 | 7.5% | USD 353,782 | **40.7%** | 1.30x | 15% |
| ERCOT (b) | ercot-toll-2h | Toll, 7y, 100% | 1.30x | 7 / 15 | 7.5% | USD 353,216 | **47.9%** | 1.30x | 14% |
| Japan (×3) | jp-*-ltda-6h | LTDA, 20y, 95% | 1.20x | 18 / 18 | 5.3% | JPY 238.5m | **75.0%** (cap) | 1.23–1.26x | 0% |
| Ontario | base route | Capacity, 20y, 68% | 1.20x | 18 / 18 | 6.4% | CAD 1,300,585 | **50.2%** | 1.38x | 0% |

**Against market practice (60–75% contracted, 50–60% merchant):** the contracted cases sit at 50–75%
(Italy and Finland are capped at 60% because secured revenue is under half of year 1). Polish and
Romanian merchant debt comes out at 34–38%, below the 50–60% practice band. The reason is the
9.8–10.3% all-in rate built off the sovereign swap rate, not the coverage test. US gearing is low
because US cash flow is thin relative to capex.

---

## 3 · US scenario inputs

| Input | (a) Credit + non-FEOC | (b) No credit + Chinese | Derivation |
|---|---|---|---|
| DC block, landed | **$195.6/kWh** at meter | **$137.6/kWh** at meter | Chinese: HiTHIUM €73.45/kWh × (1 + 40.9% duty) + €0.77 commissioning + €1.5 freight, × 1.1208 $/€ = $118.5/kWh nameplate; × 81.25/70 oversize = $137.6. Non-FEOC: +$50/kWh nameplate (US-made $160–180 vs ~$120 landed Chinese, Latitude Media 28 Aug 2026) → $195.6 |
| Duty stack on Chinese cells | — | 40.9% | 3.4% MFN + 25% Section 301 (from 1 Jan 2026) + 12.5% Section 301 (from 24 Jul 2026). The IEEPA tariffs were struck down on 20 Feb 2026 |
| Build capex / MW (4h, before contingency) | $1,311,456 | $1,079,456 | 44% non-DC share of today's $1,202,400 (platform split) + DC × 4,000 kWh. Today's model sits between the two ($168/kWh DC) |
| Build budget / MW (with 7.5% contingency + 5% grid) | $1,475,493 | $1,214,332 | Today: $1,352,700 |
| ERCOT 2h build budget | $868,688 | $738,107 | Same method; today $973,944 |
| ITC | 30% × 85% of build × $0.913 | none | 2026 MACR threshold for storage is 55% (60% in 2027, rising to 75% after 2029). Chinese cells alone are about 52% of equipment cost, so (b) cannot qualify. Energy-community and domestic-content adders (+10% each) are not assumed |

---

## 4 · Returns under the proposal (infrastructure fund, RTB)

| Market | Target | Today (published) | **All-equity hold** | All-equity, lower of hold/sale | **Levered equity** | Levered, balloon refinanced | Hold with contracts fixed |
|---|---:|---:|---:|---:|---:|---:|---:|
| Finland | 9.2% | 14.4% | **14.9%** | 14.9% | **18.2%** | 19.8% | 14.9% |
| WA | 10.1% | 10.6% | **13.4%** | 12.7% | **19.0%** | 20.2% | 12.1% |
| Italy | 10.0% | 9.6% | **11.6%** | 10.9% | **15.3%** | 15.3% | 11.1% |
| Poland (grant) | 13.3% | 9.2% | **11.5%** | 9.8% | **12.1%** | 13.3% | 11.5% |
| Romania | 13.8% | 8.6% | **11.2%** | 9.2% | **11.4%** | 12.8% | 11.2% |
| Ireland | 9.3% | 5.6% | **9.1%** | 7.3% | **11.4%** | 12.9% | 8.2% |
| Germany (toll) | 9.5% | 5.4% | **9.1%** | 6.9% | **10.4%** | 12.1% | 8.6% |
| NEM | 10.6% | 3.9% | **7.4%** | 4.4% | **7.8%** | 7.8% | 7.4% |
| Ontario | 8.8% | −0.6% | **4.7%** | 2.2% | **4.0%** | 4.0% | 2.7% |
| GB (toll) | 10.4% | −2.5% | **4.6%** | −1.8% | **3.3%** | 4.8% | 3.3% |
| Japan Kyushu | 7.2% | −3.0% | **4.5%** | 2.1% | **4.3%** | 4.3% | 0.4% |
| Japan Tokyo | 7.1% | −3.2% | **4.4%** | 2.0% | **4.1%** | 4.1% | 0.3% |
| Japan Hokkaido | 7.1% | −3.6% | **4.2%** | 1.7% | **3.7%** | 3.7% | 0.1% |
| CAISO (a) | 10.6% | −2.2% | **5.8%** | 0.6% | **5.1%** | 6.4% | 4.8% |
| CAISO (b) | 10.6% | −2.2% | **5.6%** | −0.4% | **4.8%** | 6.1% | 4.6% |
| PJM (a) | 12.1% | −2.7% | **4.3%** | −0.1% | **3.4%** | 5.0% | 4.3% |
| PJM (b) | 12.1% | −2.7% | **4.1%** | −1.1% | **3.0%** | 4.7% | 4.0% |
| ERCOT (a) | 10.1% | −12.3% | **0.5%** | −3.2% | **−2.1%** | −0.7% | −1.0% |
| ERCOT (b) | 10.1% | −12.3% | **−0.5%** | −5.1% | **−3.2%** | −1.9% | −1.9% |

Other investor plays: Germany merchant (strategic) all-equity hold 10.0% (target 9.5%), levered
11.1%. GB capacity (strategic) 5.4%, levered 4.3%. Poland capacity (new entrant) 9.3%, levered 9.6%.

**What moved each market:**
- **2.5% indexation on contracts** adds 0.5–1.3 pts in most contracted markets and 2.0 pts in Ontario. In Japan it adds ~4 pts (LTDA is 95% of revenue): hold is 0.9% today and 4.5% indexed, against 0.4% if the contract stays fixed while costs inflate.
- **US scenario (a) beats (b)** by 0.2–1.0 pt, all-equity and levered, so the credit is worth more than the non-FEOC premium costs. Neither reaches 10%. ERCOT stays around zero.
- **US/GB accelerated depreciation** adds little on a standalone basis because early losses are carried forward. If the owner's group uses the losses as they arise, the hold rises: GB toll 4.6% → 5.0%, GB cap 5.4% → 5.8%, CAISO 5.8% → 6.4%, PJM 4.3% → 4.7%. That is decision C.
- **Leverage** helps where the all-equity return beats the all-in rate. It dilutes in GB (7.8% debt vs 4.6% asset), the US, Japan (5.3% vs 4.5%) and Ontario.

---

## 5 · Decisions — taken 29 October 2026, implemented the same day

- **A.** Debt table confirmed as computed.
- **B.** Every secured contract escalates at 2.5%. **Japan, refined the same day:** OCCTO's rules correct each LTDA payment every year by actual core CPI, measured against the year before the bid (2025 rules, p.99 and p.104). There is no fixed contractual rate, so Japan follows the Bank of Japan's core-CPI forecasts instead (2.5% FY2026, 2.4% FY2027, 2.0% FY2028, 2% target), giving 2.45%, 2.2%, then 2.0% from the October 2026 close. Japan's all-equity hold is 3.8–4.1% (was 4.2–4.5% at 2.5%), and its gearing is 73–75%, just under the cap.
- **C.** US and GB tax losses are used by the owner's group as they arise. Debt is still sized on the project's own (standalone) tax, so the gearing in §2 is unchanged.
- **D.** Two layers. Layer 1 compares the all-equity hold with the investor's target. If it misses, layer 2 compares the levered equity return with the target plus 2 pts (`LEVERED_PREMIUM`). Infrastructure fund: Italy, WA and Finland pass on all-equity; Ireland passes with debt (11.4% vs 11.3%); Germany's toll misses both (9.1% / 10.4%). Across all four lenses, 15 of 64 cases pass (13 all-equity, 2 levered); see `docs/investment-return-audit-2026-10-29.md`.

## 5a · Decisions as originally asked

- **A. Debt table (§2):** confirm the DSCR tiers and the resulting gearing per market.
- **B. Contract indexation:** index every contract at 2.5% (your instruction, as computed) or only contracts whose terms are indexed? Fixed-price tolls (DE, GB, ERCOT) and Japan's LTDA under its unconfirmed formula would then stay fixed. Difference: GB toll −1.3, Japan −4.1, Ontario −2.0, CAISO −1.0, Germany toll −0.5 pts.
- **C. Tax losses (US, GB):** carried forward inside the project (standalone, as now) or used by the owner's group in the year they arise?
- **D. Which return sets the call against target:** all-equity hold, today's lower-of, or levered with its own hurdle? The targets are built for unlevered cash flow, so a levered return needs a separate hurdle.

## 6 · Work after sign-off

1. `parameters.js`: 2.5% inflation; DSCR tiers, legal/notional rules, gearing caps and margins replace the three-row `DEBT` table.
2. `projectDebt.js`: replace the 1.15x secured test with the same tiers, so the dashboard debt panel and the returns rows agree.
3. New `src/acquisition/leverage.js`: RTB levered equity IRR from the all-cash hold flows. The all-cash validation rule for the headline stays.
4. `reference.js`: indexation default; US and GB tax policy; US scenario (a)/(b) capex and credit.
5. `supplierQuote.js`: add `USD` to the landed-duty table (40.9%) and a non-FEOC premium constant, each with sources.
6. `opportunities/summary.js` → regenerated summary data: hold, lower-of, levered, gearing and debt/MW per market; US rows ×2.
7. Returns page, market pages and debt panel show the three returns and the gearing.
8. Re-run the return audit as a new dated doc; update the tests whose pinned values move.

## Sources (new for this plan)

- Foley Hoag — [PFE/FEOC rules and battery storage](https://foleyhoag.com/news-and-insights/blogs/energy-and-climate-counsel/2026/july/the-prohibited-foreign-entity-(or-feoc)-rules-and-battery-storage/) (MACR 55% → 75%)
- Latitude Media — [For some storage developers the ITC might not be worth it](https://www.latitudemedia.com/news/for-some-storage-developers-the-itc-might-not-be-worth-it-after-all/) (Chinese ~$120 landed; US-made $160–180)
- Carina Energy — [FEOC compliance for BESS](https://carina.energy/feoc-compliance-guide-bess/) (PFE cells ≈ 52% of equipment cost)
- Pacific Battery — [Lithium battery import tariff stack](https://pacific-battery.com/blog/lithium-battery-import-tariff/) · AES — [10-Q Q1 2026](https://www.sec.gov/Archives/edgar/data/0000874761/000087476126000120/aes-20260331.htm) · Energy Vault — [10-Q Q2 2026](https://www.sec.gov/Archives/edgar/data/0001828536/000182853626000101/nrgv-20260630.htm)
- Gaiergy — [What a US battery project actually costs](https://www.gaiergy.com/research/battery-pricing-article_v2.html) (Anza $175/kWh DC; NREL $334 installed)
- pv magazine USA — [Crux 2026 ITC pricing](https://pv-magazine-usa.com/2026/08/18/clean-energy-capital-expenditures-on-track-for-180-billion-in-2026-reports-crux/) ($0.913)
- Gov.uk — [Permanent full expensing](https://www.gov.uk/government/publications/capital-allowances-permanent-full-expensing). Whether a BESS falls in the main or the special-rate pool is disputed ([Property Tax Partners](https://www.propertytaxpartners.co.uk/blog/property-types-and-specialist-tax/integral-features-capital-allowances)), so full expensing is the assumption
- SEM Committee — [CRM indexation decision](https://www.semcommittee.com/files/semcommittee/media-files/Indexation%20of%20Capacity%20Payments%20Decision%20Paper.pdf) · CISA [draft agreement](https://asl.org.au/tenders/-/media/b6dcd67c74664c99a8e475696286f00c.ashx) (CPI-indexed amounts)
- Modo Energy — [German tolls and leverage](https://modoenergy.com/research/germany-battery-toll-agreements-leverage-equity-returns-de) (≥60% repaid by the 7-yr maturity)
