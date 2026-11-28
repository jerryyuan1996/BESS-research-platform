# End-of-life site value: plan for sign-off

27 November 2026. Decision log for gate G12's terminal-value item; update it in place. The research behind it is in [terminal-value-research-2026-11-27.md](terminal-value-research-2026-11-27.md).

**What changes on the site:** every market page gets a "What the grid connection is worth" card below "Explore grid details". Each card gives the policy trend, how scarce connection is and our call on the connection's future value. In four markets the investment case also shows the return with an end-of-life site value, beside the headline return.
**Cost or risk:** no published number has changed. Moving the credit into the headline would raise the hold return by +0.03 (Italy) to +0.63 (ERCOT) points in four markets, change no grade, and leave the other fourteen markets unchanged.
**Decision needed:** D1–D6 were signed on 27 November 2026. Still open: whether to move the credit into the headline (§5 step 5), on the table in `docs/site-value-impact-2026-11-27.md`.

## 1 · What is built and what is not

| Part | State | Where |
|---|---|---|
| Research note: fund practice, per-market prices, stylised arithmetic | Written | `docs/terminal-value-research-2026-11-27.md` |
| Connection-value card on all 18 market pages, with a lazy reader | Implemented | `src/experience/connectionOutlook.js` (content), `connectionOutlookDialog.js` (reader), `marketResearchLink.js` (card), `story/public/overview.js` (placement) |
| Content test (bilingual, sourced, one evidence marker, no typed return, scarcity grade read not retyped, credit only where a price exists) | Built, passing | `tests/connection-outlook.test.js` |
| Site value in the investment model, beside the headline | Built after the sign-off (§5 steps 1–4) | `src/acquisition/siteValue.js`, `valuation.js`, `reference.js`, `opportunities/investment.js`, `experience/investmentCase.js`, `acquisition/lab.js`, `tests/site-value.test.js` |
| Before/after table for the headline decision | Generated | `docs/site-value-impact-2026-11-27.md` (`node scripts/site-value-impact.mjs`) |

The card reads the analyst's grid-scarcity grade (1–5, with its anchor, trend and dated reason) from the view store when it opens, so a regrade updates the card with no edit here. Spain, Ontario and Saudi Arabia are ungraded, so their cards say so in a sentence instead.

## 2 · The eighteen outlook calls approved on 27 November

The analyst approved these calls on 27 November 2026. Each card gives the reasoning, sources and conditions that would change the call.

| Market | Call on a held connection's future value | Evidence | Main reason |
|---|---|---|---|
| GB | Rising | Fair | Gate 2 rations new battery places; proposed CMP470 fee on queue places while batteries exceed plan |
| Germany | Rising | Fair | Transmission requests ≈4× commitments (211 GW vs 51 GW); maturity-ranked cycles; AgNes fees from 2029 |
| Italy | Holding | Fair | ~300 GW of requests, 6.8 GW ready to build; value sits in authorised projects and MACSE awards; ready-to-build prices sliding |
| Spain | Rising | Fair | ~34 GW permitted vs ~0.3 GW in service; ready-to-build prices €42k → €71.5k/MW since Q3 2024 |
| Poland | Holding | Thin | Speculative conditions purged (doubled advance, new fee), but balancing prices falling |
| Romania | Holding | Thin | Auctions price new connections outside the full south-east |
| Ireland | Rising (near Dublin) | Thin | Data centres ≥10 MVA must bring dispatchable generation or storage |
| Finland | Holding to 2029 | Fair | Southern storage connections restricted until Hikiä–Toivila completes; north open |
| Japan · Tokyo | Rising | Thin | Largest demand area; 11-study cap per operator |
| Japan · Kyushu | Holding | Thin | Rationed by an 8-study cap, not by capacity |
| Japan · Hokkaido | Holding | Thin | Non-firm charging-control route caps the firm premium |
| PJM | Rising | Fair | 60 GW of storage accepted into Cycle 1 vs 1.9 GW awarded in TC1; CIRs transferable to a replacement resource from 30 Jan 2026 |
| ERCOT | Falling (for storage) | Fair | Connect-and-manage; revenue $193 → $24/kW-yr (2023 → 2026); upside is large-load co-location |
| CAISO | Holding | Fair | Deliverability finite; June 2026 proposal keeps it with a retiring or repowering site |
| NEM | Holding | Thin | Paid access rights inside REZs, open with study risk elsewhere |
| WEM (WA) | Rising, then easing | Fair | Network access quantities cap export until relief at end-2029 |
| Ontario | Holding | Thin | Value sits in the 20-year IESO contract; LT2 oversubscribed at lower prices |
| Saudi Arabia | Holding, tied to contract | Thin | Connection comes with SPPC's 15-year award; no separate market |

## 3 · The proposed credit, market by market

**Method.** Multiply the adopted pre-construction site benchmark per MW in 2026 money by the 50% survival weight and the model's cumulative inflation factor to retirement. Deduct the sale fee and tax on the gain. The retirement allowance covers removal. GB uses a cross-market portfolio NAV estimate. Italy and Spain use ready-to-build project benchmarks. ERCOT uses the midpoint of a disclosed development-deal range.

Indexation for the base reference case runs from 2026 to the end of a 20-year life after 1.5 years to commissioning: 21.5 years, factor 1.025^21.5 = **1.700**.

| Market | Observed price (2026 money) | Source | × 50% | Nominal at end of life (× 1.700) | Share of the comparison capex | Stylised IRR effect at 8% / 10% |
|---|---|---|---|---|---|---|
| GB | £84.0k/MW | Gore Street: 8% × £519.3m NAV ÷ 495 MW (GB, IE and Texas rights) | £42.0k | £71.4k | 7.9% of £900k | +0.22 / +0.17 pts |
| Italy | €37.5k/MW | nTeaser ready-to-build median, Q1 2026 | €18.75k | €31.9k | 3.6% of €880k | +0.10 / +0.08 |
| Spain | €71.5k/MW | nTeaser ready-to-build average, quarter reported June 2026 | €35.75k | €60.8k | 6.9% of €880k | +0.19 / +0.15 |
| ERCOT | $51.5k/MW | Midpoint of five Enerdatics development-stage deals, $29–74k | $25.75k | $43.8k | 4.6% of $961.9k | +0.13 / +0.10 |
| Other 14 | none | No adopted site benchmark | — | — | — | 0 |

Arithmetic for the last column: day-one capex 100, level cash flows over 20 years that give the base IRR, plus the nominal credit at year 20 as a share of capex. These are estimates. The real effect comes from the model run in §5 step 4, and that run, not this table, goes to sign-off for the headline.

**What the table says:** at a 20-year life the credit is small, under a quarter of a point. It fixes an inconsistency (the ready-to-build price is paid for a connection that the model then values at zero), not the level of returns. The larger lever is asset life (§4, D6).

**Markets with no credit, and what would add one:**
- **Germany:** marketplace asking prices only (€124–223/kW). Needs a disclosed transaction or a broker index.
- **Japan (3 regions):** one advisory firm's ladder (rights ≈ 20–27% of completed value) and one sale. Needs a second source.
- **CAISO:** one deal at $400k/MW. Needs more deals.
- **PJM:** no rights price. An avoided-upgrade basis is possible: TC1 batteries were allocated $206/kW of network upgrades, which a replacement resource reusing CIRs might avoid. See D5.
- **Poland, Romania, Ireland, Finland, NEM, WEM, Ontario, Saudi Arabia:** no public price.

## 4 · Decisions needed

| # | Decision | Recommendation | Alternative |
|---|---|---|---|
| D1 | The 18 outlook calls in §2, and publishing the card | Approve as drafted | Amend individual calls |
| D2 | Survival weight | **50%** of the indexed price | 75% (lease, consent and connection all likely to survive), or 25% |
| D3 | Removal cost | Keep the existing retirement allowance (2/3/5% of construction) unchanged beside the credit | Cut it to battery removal only where a credit applies |
| D4 | Sale route | The five-year buyer also prices the credit, discounted at the buyer's rate | Credit on the hold route only |
| D5 | PJM basis | No credit until a rights price is public | Avoided-upgrade basis: 50% × $206/kW |
| D6 | Asset life | Keep 20 years for now and take life up separately | Open the life question (25–30 years, as the listed funds use) now. It interacts with the 12 Oct 2026 augmentation ruling |

Weights, discount rates and exit yields are untouched. The credit is an analyst assumption, so automation may propose a refreshed price but never apply one.

## 5 · Implementation after sign-off

1. **Parameter.** Add a dated, source-linked `SITE_VALUE` table (price, currency, date, source id, weight) to `src/acquisition/parameters.js`, read from the same values as `connectionOutlook.js`, so the card and the model cannot disagree. Register it in `src/governance/authority.js` as an analyst assumption.
2. **Cash flow.** In `src/acquisition/valuation.js`, the hold route adds `+siteValue` at `codYears + life`, nominalised with the existing `nominalAmount`. The sale route adds its present value at the buyer's rate inside `terminal` (if D4 is yes). `src/acquisition/operating.js` carries it to the remaining-life end for operating purchases. The comparison engine stays unchanged, because it is the real-terms cross-market view.
3. **Display first, headline second (Option C → A).** Show "with site value" beside the headline hold return on the investment card and in the Lab, with its own Lab input (default from the table, editable, zero allowed). The headline stays unchanged until step 5.
4. **Before/after table.** Extend `scripts/audit-investment-returns.mjs` to print each market's hold, sale and lower-of returns with and without the credit, for the four investors. This is the number set that goes to the analyst.
5. **Headline adoption (separate sign-off).** The asset-return grade ranks the headline hold return (16 Nov ruling), so check the regrade effect and any market story's `reviewedAgainst` call before switching. Expected effect is small, but it must be checked, not assumed.
6. **Checks.** `npm test`, `npm run test:current` (no fixture regeneration), `npm run build`, `npm run test:budget`, `npm run test:e2e`, plus hand checks of the credit's nominalisation and sale-route discounting in `tests/site-value.test.js`.

**As built (27 Nov 2026):**
- **Step 1.** The table lives in `src/acquisition/siteValue.js`, not `parameters.js`, so the card and the model import one source. It is registered in `ASSUMPTION_AUTHORITY`: prices are ANALYST, the 50% weight is METHODOLOGY.
- **Step 2.** Both routes index the base-year credit using the project's inflation rate or dated path. This also applies when operating cash flows are supplied in nominal money. The model then deducts the 1.5% sale fee and sale-gain tax on a site with no remaining basis. The illustrative table in §3 shows the amounts before fee and tax.
- **Step 2, scope.** The levered return and the cross-market comparison engine are unchanged.
- **Step 3.** The bankable case shows "With end-of-life site value" beside all-equity hold IRR. The Lab accepts a project-specific amount in 2026 money. The four markets with a benchmark offer a button to apply it. Zero or a blank field uses the base case.
- **Step 4.** Results are in `docs/site-value-impact-2026-11-27.md`. The script reproduces every published grade and rank before applying the credit.
  - Hold return: GB +0.22 (strategic, developer) and +0.25 (fund, first foreign buyer); Italy +0.03; Spain +0.23; ERCOT +0.63 points.
  - Spain moves from rank 13 to 12. **No asset-return grade changes for any investor.** The other 13 markets are identical.
- **Step 5** awaits the analyst's sign-off on that table.

## 6 · Change log

- 2026-11-27 · Plan drafted; card built on `claude/grid-connection-value` for review. No model change.
- 2026-11-27 · **Signed off by the analyst, "approve as drafted":** D1 (the eighteen calls and the card), D2 (50% weight), D3 (retirement allowance kept), D4 (the sale buyer prices the credit), D5 (no PJM credit), D6 (20-year life kept; life taken up separately). §5 steps 1–4 proceed. Step 5, moving the credit into the headline, still needs its own sign-off on the before/after table.
