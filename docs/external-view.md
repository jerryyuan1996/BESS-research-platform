# External view — what the market says, and where we differ

**Collection round 1 · vintage 2026-07-30 · revised 2026-08-04 (rounds 2–4) · policy refresh 2026-10-10 (§6c)**

This document records what mainstream research houses, consultancies and trade press were saying
about BESS investment strategy at the collection date, tested against what this platform publishes.
It exists because a normalized cross-market model is only as good as its distance from the consensus
is *deliberate*. Where we differ, that has to be a position we took, not a number we forgot.

Three rules for maintaining it:

1. **Vintage everything.** A capacity auction result is true of one auction. Every claim below carries
   the date and the body that published it.
2. **Separate the observation from the opinion.** A clearing price is an observation. "Italy is the
   best market for new-build capital in 2026" is an opinion held by identifiable people, and is
   recorded as such.
3. **A conflict is not automatically an error.** Some of our positions are deliberately against
   consensus. Those are listed in §5 and are the most valuable part of the file.

> This is a *research capture*, not an approved assumption set. Nothing here is wired into the engine
> by virtue of appearing here. Changes to the model go through the authority classes in
> [`governance.md`](governance.md); this file is the evidence a proposal cites.

---

## 1 · What we publish

**14 allocation markets · 12 dashboards**, as at 2026-08-04. Tokyo, Kyushu and Hokkaido are three
exposures sharing one Japan dashboard.

| Market | Archetype | Base route | Contracted line | Thesis |
|---|---|---|---|---|
| WA — WEM | 200 MW · 7h | capacity | A$422,372/MW, 10 yr, `naqFactor` 0.90 | Capacity-led islanded market; duration is the product |
| AU — NEM | 280 MW · 4h | long-term award | CIS floor A$121,500/MW, 15 yr | Deepest build, thinnest contracted revenue; certainty must be bought |
| GB | 100 MW · 4h | capacity (+ additive toll) | £27.10/kW × 0.38, 15 yr | Trading-led, connection-rationed |
| DE | 100 MW · 4h | merchant | none | Most congestion spend on the platform, least direct route to it |
| IT | 100 MW · 4h | capacity | €31,490/MW/yr (MACSE) | A TSO-procured 15-year tolling clear, zonally priced |
| IE — SEM | 50 MW · 4h | capacity | €135.50/kW × 0.66, 10 yr | Highest capacity pay per nameplate MW; DS3→FASS decay modelled |
| RO | 50 MW · 2h | merchant + grant | none | Best raw spread, zero contracted revenue |
| PL | 100 MW · 4h | capacity | PLN 465.02/kW × 0.1339, 17 yr | Longest contract, but de-rating now takes 87% of it |
| JP ×3 | 50 MW · 6h | long-term award | ~¥10.5m/MW secured, then auction-renewal | 20-yr LTDA with ~90% clawback; regional differentiation |
| PJM | 90 MW · 4h | capacity (auction-renewal) | $69,989/MW/yr, 1 yr secured | A BRA procures one delivery year; the rest is re-won |
| ERCOT | 100 MW · 2h | toll | none | The platform's only 2h archetype, because the fleet is 1.6h |
| CAISO | 100 MW · 4h | capacity | $105,240/MW/yr (bilateral RA) | 4h is a ceiling, not a floor — NQC credits nothing beyond it |

Routes modelled: `cap` · `mer` · `toll` · `ltda`. Unlevered, 15-year window, exit priced at 7.5%
contracted / 11.5% merchant and auction-renewal. Both merchant legs are stated at a single declared
`merchantVintage`, enforced by `src/comparison/vintage.js`.

---

## 2 · Consensus by theme

### 2.1 Route to market

The industry has converged on a ladder, and it is longer than our three routes.

| Structure | Who is doing it | Terms observed |
|---|---|---|
| Physical toll | Drax / Fidra, 250 MW (500 MWh) and 200 MW (800 MWh) | **10-year** fixed annual fee; full dispatch control to offtaker; **owner retains Capacity Market revenue** |
| Financial (virtual) toll | Preferred in Europe over physical — separates optimisation from risk transfer | Competitive with physical tolls as of 2026 |
| Floor + upside share | The middle structure; "the floor market is now thin" as of 2026 | Partial revenue certainty, participation above a threshold |
| Day-ahead spread swap | Aurora lists alongside tolls and hybrid PPAs; more accepted in Spain | Hedge a *portion* of MWh, not the whole asset |
| Cap and floor (GB LDES) | Ofgem Window 1 minded-to, 26 Jun 2026 | ~7.65 GW / 136.9 GWh, 16 projects, **8–22 hour** durations |
| Grid-forming / inertia | GB Pathfinder (Zenobē + Wärtsilä, Blackhillock operational); Germany from Jan 2026 | Fixed-price, **2–10 year** agreements |

Aurora estimates **40–50% of German BESS capacity** could eventually sit under tolling structures.

The lender message is consistent across sources: *revenue forecasts alone no longer finance anything*.
Lenders weight (i) contracting structure, (ii) the **optimiser's operational track record**, and
(iii) verifiable performance data from live assets rather than backtests. Two identical assets with
different route-to-market partners are, to a lender, different assets.

### 2.2 Duration

Unanimous and one-directional. No source found argued for shorter.

| Evidence | Source, date |
|---|---|
| 4h beats 2h on IRR across **all** NEM regions and scenarios; 2h "below 10% as short-duration spreads compress" | Modo, NEM outlook Apr/Jul 2026 |
| Germany 4h **13.7%** unlevered IRR at 2026 COD vs 2h **12.2%** | Modo, German BESS outlook Q2 2026 |
| GB fleet: 2h-and-longer captured **65%** of available Equivalent Energy Time in 2025/26 vs **29%** for sub-2h | Modo |
| GB T-4 2029/30: 2h led on connection MW, but **4h + 5h combined won more de-rated capacity** | Modo / ESS News, Mar 2026 |
| Japan LTDA Round 3: 3–6h bracket **eliminated**, hard **6-hour minimum** | OCCTO via Greenberg Traurig, May 2026 |
| Japan capacity auction: 1.25 GW of BESS awarded under a **6-hour** duration requirement | ESS News / pv magazine, May 2026 |
| WA: benchmark facility is now **200 MW / 1,200 MWh (6h)**; flexible capacity credits require defending a **six-hour** window | ERA / Modo, 2026 |
| GB LDES cap and floor Window 1: **8–22h**, including 18-hour lithium-ion | Ofgem, Jun 2026 |
| Expected outcome: a two-tier market where 4h and 8h dominate T-4 and 1–2h are squeezed into lower-margin ancillary | Multiple |

### 2.3 Market choice

**Investor preference (share naming each as their preferred market for the next three years):**
US 25% · UK 19% · China 14% · Italy 8%.

**Aurora European co-location attractiveness, 2026:** Germany #1 · GB and Bulgaria joint #2 ·
Spain, Hungary, France flagged as watchlist. 20 markets assessed.

**Trade consensus top three for new-build capital in 2026:** Italy, Poland, Great Britain.
Explicitly flagged *approach with caution*: ERCOT (saturation), Ireland (DS3 being legislated out).

**Clean Horizon Storage Index, May 2026** — spot revenue run-rates, 85% efficiency, 1.5 cycles/day,
gross of fees. Read as a **signal, not an underwriting number**:

| Market | Run-rate | Duration | Driver |
|---|---|---|---|
| Poland | €800k+/MW/yr | 2h | aFRR capacity €120+/MW/h |
| Italy (North / South) | €654k / €640k per MW/yr | 4h | ~80% tertiary reserve (mFRR) |
| Latvia · Lithuania · Estonia | €338k · €326k · €175k per MW/yr | — | Baltic ancillary immaturity |
| Romania | ~€140/kW/yr (separate Clean Horizon assessment) | not stated | DAM volatility + FCR ~€70/MW/h |

**Global framing:** BNEF forecasts 158 GW / 459 GWh of 2026 deployments, +41% on 2025's 112 GW.
Wood Mackenzie records 106 GW installed in 2025. Australia is the third-largest utility-scale market
globally, with 4.3 GW reaching financial close in 2025 (+150% YoY).

### 2.4 Project debt

| Parameter | Market evidence, 2026 |
|---|---|
| Gearing | **60–75%** contracted · **50–60%** merchant. Rarely the 80–85% seen in solar and wind |
| DSCR | Tolled tranche ~**1.15x** · merchant tranche ~**2.0x**. P90 DSCR **1.20–1.35x** for well-contracted storage, materially higher for merchant |
| Tenor | **7–10 year** legal tenor hard mini-perm; notional amortisation constrained by **battery supplier warranty duration** |
| Typical shape | ~12-month merchant phase, then ~80% tolled for **5–7 years** |
| Merchant financeability | Lenders now actively finance merchant BESS in Germany — priced through mini-perms, tighter DSCRs and scrutiny of revenue assumptions |
| Activity | Q1 2026: record **53 deals / 11 GW**, +50% QoQ. Germany 25 deals; Italy third-most-active with 12 |
| Activity, latest | Q3 2026: **53 deals / 11.8 GW** across 14 countries (Q2: 38 across 10). GB led on count (10); Germany on capacity (8 deals, 3.5 GW). **Tolls underpinned 14 deals, more than any other revenue model**, and contracted revenue underpinned most Q3 debt — Modo, October 2026 |

---

## 3 · Market-by-market conflicts — all closed

The six conflicts collected on 2026-07-30 have been resolved and their detail deleted. Each was
re-verified against the live comparison interface on 2026-08-04; the change that closed it is in
§6a.

| Conflict as collected | Closed by | Verified now |
|---|---|---|
| **Poland** — we published the Dec-2024 auction at KWD 0.65 while the market had moved | Capacity line rebuilt on the Dec-2025 auction | `capacity` = PLN 465.02/kW × 0.1339, delivery 2030 |
| **Japan** — a 4h reference could not bid into the LTDA's 6h minimum, and capex sat at ¥45k/kWh | Archetype to 6h; base route to the LTDA; capex to ¥60k/kWh | 50 MW · 6h, ¥360m/MW, base route `ltda` |
| **Great Britain** — spot numbers right, archetype wrong at 2h; toll modelled as an alternative to capacity | Archetype to 4h; toll to 10 years and additive | 100 MW · 4h, `tollYears` 10, `tollAdditiveWithCapacity` |
| **Ireland** — the DS3→FASS cliff was a footnote, not a model input | `servicesCurve` calibrated on GB's frequency-response collapse | `servicesCurve` present |
| **Western Australia** — 8h of capex against a 6h product, and no charge for forfeited access | Archetype to 7h; `naqFactor` 0.90 | 200 MW · 7h, `naqFactor` 0.90 |
| **Romania** — merchant revenue understated at €70.4k | Raised, then revised to €110k with an FCR saturation curve | `merchGross` €110,000 with `servicesCurve` |

> Deleted rather than archived on purpose. This file's value is the distance between us and
> consensus *today*; a settled conflict left in the present tense is noise that reads like an open
> one.

---

## 4 · Structural gaps in our model

Ordered by how much they distort a published number. Five of the original nine closed and have been
deleted: de-rating is now a first-class `capacity` input, `servicesCurve` models regime change, the
toll is 10 years and additive, a project-debt layer sizes leverage per market, and the three
"missing markets" — Italy, Germany and the NEM — are all built, alongside PJM, ERCOT and CAISO.

1. **No duration sensitivity within a market.** One archetype per market still means duration and
   geography are confounded, so we cannot test our own published finding — *"merchant viability
   tracks duration, not geography"*. The confound is weaker than it was: the platform now spans 2h
   (RO, ERCOT), 4h, 6h (JP) and 7h (WA), so duration varies across markets even though it is fixed
   within each one.
2. **No optimiser / route-to-market counterparty dimension**, which lenders now weight explicitly.
3. **Saturation does not enter the engine.** `narrative.pipelineRatio` is still a display string
   rendered by `metrics.js` and touches no cash flow.
4. **No co-location.** All fourteen archetypes are standalone. Aurora ranks co-location as a separate
   market question, and in Japan co-location is the way around the LTDA clawback.
5. **Component capex is a global split, not a market observation.** The stack introduced in
   `src/comparison/capex.js` reconciles exactly to each market's published installed cost, but the
   DC-block/PCS/transformer/BOP/EPC shares are the same everywhere. Gate **G24**. It bites hardest in
   Japan, where the capex premium over global benchmarks (**G5**) cannot be attributed to a component.
6. **The RTB entry price is an input, not an observation.** `devCostPct` and `rtbPremiumPct` are
   seeded at zero, so every published return is still a build-cost return rather than an acquisition
   return. Gate **G25**.

---

## 5 · Where we are deliberately against consensus

Recorded so that a future reader does not "fix" these. The fifth entry — `ltda` declared but
disabled — has been deleted: the route is now the base case in Japan and the NEM, so the position
no longer exists to defend.

1. **Secured share and secured tenor are separate published rows**, and auction-renewal cash flow is
   discounted at the merchant yield rather than the contracted yield. The standard research deck
   reports a single "contracted %" that puts Japan's one-year award and Poland's seventeen-year
   contract at the same position. Our three risk classes exist to stop that. Keep.
2. **Unlevered comparison.** Consensus underwrites levered. We keep the cross-market comparison
   unlevered so that debt capacity is an *output* to be measured rather than an assumption baked in.
   Keep — but the missing half is now planned as a market-level project-debt layer, not a change to
   the global engine.
3. **Spot indices are not underwriting numbers.** Clean Horizon's Poland 2h at €800k+/MW/yr is a
   monthly run-rate annualised at 1.5 cycles/day gross of fees, during a period of extreme aFRR
   prices in a market with very little operational capacity. We will not carry it as a merchant
   assumption, and this file records why.

4. **Fifteen years, no residual, no augmentation.** This one was surfaced *by* the revision rather
   than decided in it, and it is the largest single reason our absolute returns sit below published
   ones. `LIFE = 15` and the hold case assigns no terminal value at year 15; the exit case prices
   only the cash flows remaining inside the window. Consensus unlevered IRRs — GB at 10-12%, Germany
   4h at 13.7% — are quoted on a 20-25 year life with augmentation capex and a residual.

   The effect is visible at GB. Holding unit cost constant at ~£225/kWh across the move from 2h to
   4h doubles the capital base while merchant revenue rises about 30%, so the 15-year hold IRR falls
   to 3.1%. That is not a contradiction of the market view; it is the same asset seen through a
   shorter window with nothing at the end of it. **Read the ordering, not the level** — which the
   README already says, and which this makes load-bearing rather than decorative.

   Left unchanged deliberately. `LIFE`, the exit yields and `UNLEVERED` are METHODOLOGY, and moving
   the window would re-rate all fourteen markets at once for a reason that has nothing to do with any
   of them. The honest fix is a terminal-value treatment and an augmentation line, which is a
   design decision, not a data refresh. Recorded as gate **G12**.

---

## 6 · Next research round — named gates

Each item is a specific document or series that would close a specific open assumption.

> **Two numbering schemes share the letter G, and they are not the same gates.** The table below is
> the platform-wide sequence and is what `gate:` fields in every `comparison.js` refer to.
> [`japan-etl-gates.md`](japan-etl-gates.md) separately numbers eight Japan-only inputs G1–G8, so
> "G2" means *Modo's GB 4h series* here and *Japanese capex per MW* there. Nothing in code reads the
> Japanese numbering, so the collision is a documentation hazard rather than a bug — but it is worth
> resolving before the Japanese list grows.
>
> **G29 is unassigned.** The US round jumped from G28 to G30. Left as a hole rather than renumbered,
> because gate ids are cited from `comparison.js` files and renumbering would silently repoint them.

| # | Gate | Closes | Where to get it |
|---|---|---|---|
| G1 | NESO Auction Guidelines / De-Rating Factor workbook, T-4 2029/30 | GB de-rating by duration (we have 1h and 2h only, from 2024/25) | NESO EMR Delivery Body — "Auction Results and De-Rating Factors Summary Data Workbook" |
| G2 | Modo ME BESS GB **4h** series | GB 4h merchant revenue; we only hold the 2h benchmark | Modo terminal (paid) |
| G3 | PSE draft parameters for the next Polish main auction | Whether KWD 13.39% is a step change or an overshoot to be partly reversed | PSE / URE auction parameter publications |
| G4 | OCCTO LTDA Round 3 guidelines and price caps | Japanese LTDA award level — pay-as-bid, clearing not disclosed. **Part-closed 2026-10:** the FY2026 (Round 4) outline publishes the battery ceiling at ¥70,675–74,417/kW/yr, replacing the FY2024 band; the award level itself is still not an observation | OCCTO auction guidelines |
| G5 | Japanese 6h BESS capex, 2026 vintage | Our ¥45,000/kWh vs ~¥68,000/kWh observed FY2024 | MRI / METI cost estimates; IEEFA |
| G6 | DS3 realised payments per MW per year for a 4h Irish battery | Whether our €8,000/MW/yr services level is right before any decay curve is applied | EirGrid DS3 settlement data; Modo Ireland |
| G7 | SEM FASS auction design and indicative price caps | The floor the Irish services curve should decay to | SEMC / EirGrid FASS consultations |
| G8 | AEMO WA network constraint / NAQ curtailment data | The size of the access-priority haircut on WA merchant revenue | AEMO WEM constraint and dispatch data |
| G9 | Clean Horizon Romania forecast (S1 2026) | Duration basis and forward decay behind the ~€140/kW/yr figure | Clean Horizon (paid) |
| G10 | Real BESS senior debt margins by market | Project-debt pricing — we hold base rates and structural conventions, not margins. Re-searched July 2026: Modo's Q1 2026 report gives deal counts and volumes (53 deals / 11 GW, >€3bn disclosed debt) but no margin quotation, and no public source quotes one. The 200–250bp band stands as an assumption | Modo European BESS Capital Markets report; lender term sheets |
| G11 | Terna MACSE auction 2 rules and results (24 Nov 2026) | ~~Whether to add Italy~~ — closed 2026-08 on auction 1. The auction-2 reserve premium was set at **€27,000/MWh/yr** by ARERA resolution 332/2026 (24 Sep 2026), down from €37,000. What remains open is whether the ≈€12,959/MWh/yr weighted clear holds at 16 GWh against 10 | Terna publications |
| G12 | A terminal-value and augmentation treatment | Why our absolute returns sit below published ones — see §5.5. A design decision, not a data fetch | Internal; needs an augmentation capex curve and a residual-value basis |
| G13 | Per-market BESS fixed-opex and degradation series | The two Investment Lab bands with no published counterpart anywhere. Opex seeds run US$8.6k–16.5k/MW/yr across fourteen markets against a US utility-scale benchmark of US$15–25k; degradation is held at 2%/yr in every market because nothing market-specific exists to hold it at anything else | Operator LTSA/O&M disclosures; supplier warranty degradation curves |
| G14 | Per-MW congestion revenue for a battery, by market | The one number the congestion register deliberately does not carry. Operators publish the constraint pool — NESO a £3.1bn balancing cost, EirGrid an 11.3% dispatch-down rate, PSE a 1,131 GWh curtailed volume, OCCTO an output-control percentage — but none publish what share of it a battery captures. Closing it would let the Investment Lab price congestion instead of only flagging its expiry date. Italy is the nearest thing to a partial close: its zonal MACSE spread (Sicily 30% above Sud e Calabria for the same product) is a published price for one constraint, but it is a procurement clear rather than a measurement, so the register uses it as a proxy and says so | Modo GB Balancing Mechanism revenue by asset; EirGrid/PSE settlement data; Terna curtailment volumes in GWh; an optimiser's realised constraint-revenue disclosure |
| G15 | Australian 4h BESS capex outside GenCost | The NEM capex seed rests on a single source — CSIRO GenCost 2025-26 at A$385/kWh — with the band floor derived from GenCost's own 2h trajectory rather than from a second observer | Vendor EPC quotations; AEMO ISP cost inputs; a disclosed Australian project cost |
| G16 | A disclosed BESS toll fee, in any market | The gate five markets now share. No toll price has ever been published in Australia, Germany, Italy or GB, and ERCOT's published TB2 value is a proxy rather than a fee, so every toll band is bounded rather than quoted — the NEM's by the NSW LTESA Round 6 annuity cap, Germany's by a published breakeven analysis, Italy's by the MACSE clear below and the wholesale spread above. One disclosed fee would convert three derivations into one benchmark | Transaction disclosure; an offtaker's segment reporting; an infrastructure fund's valuation note |
| G17 | CIS floor, cap and payment ceiling for an awarded project | The NEM's contracted route is modelled at 90% of a bracketed floor because every CIS project's terms are commercial-in-confidence. Round 5 cleared at ≈A$185k and Round 6 at ≈A$150k, so the direction is known and the level is not | DCCEEW; an awarded proponent's disclosure |
| G18 | NEM marginal loss factor and curtailment at project level | Modo finds location moves NEM IRRs by up to 1.8 percentage points and reports some batteries carrying MLF costs 5–10× the fleet average. The platform carries one national `naqFactor`, which cannot express that | AEMO MLF tables by connection point; WattClarity curtailment reviews |
| G19 | Whether German published capex already includes the Baukostenzuschuss | A 12–24% swing on German capital cost, unresolved. Reported BKZ tariffs run €110k–165k/MW against a €935k/MW 4h capex; no source states whether the charge sits inside the figure | Modo methodology note; an EPC and a DSO quotation obtained separately |
| G20 | German 4h merchant revenue, published | Modo publishes 2h revenue and, separately, 4h capex and a 4h IRR — but not the 4h revenue that reconciles them. The platform's 1.50× duration scalar is derived from the two ratios that are published, and every German revenue figure depends on it | Modo terminal (paid); an optimiser's 4h book |
| G21 | Momentanreserve MWs registered per MW of rating | The bottom-up derivation gives €6,038/MW/yr and Modo publishes €8–20k for the same product — a threefold disagreement whose reconciling factor is not published | German TSO tender documentation; a participating operator's registration |
| G22 | ARERA Deliberazione 168/2025, Allegato B — reference storage technology costs | The highest-value single follow-up on the platform. Italy's capex band spans a factor of 2.4 because a European turnkey survey (€180–260/kWh) and Italian expert interviews (~$120/kWh) disagree by half. The authoritative document exists and would not machine-read | ARERA — analyst extraction of Allegato B |
| G23 | Italian MSD revenue at an underwriting level | The only published Italian MSD total is one month annualised — €654k/MW/yr North, €640k South, May 2026 — roughly 5× the forward wholesale view. The platform seeds from the published revenue *split* instead. MSD saturation is Italy's dominant modelling risk and its size is unknown | GME MSD clearing-price series by zone and product; an Italian optimiser's monthly book |
| G24 | **A component-level capex breakdown for any market** | The stack introduced in `src/comparison/capex.js` splits every market's installed cost by the same global shares — DC block 56%, PCS 9%, transformer 4%, BOP 19%, EPC 12% — because no market publishes its own. Until this closes the split is descriptive and only the total it reconciles to is market evidence. It matters most in Japan, where the capex premium over global benchmarks (G5) cannot be attributed to a component | EPC bid tabulations; an owner's cost breakdown; a tier-1 integrator's price list |
| G25 | **The RTB acquisition premium, in any market** | The platform underwrites at ready-to-build, so the entry price is development cost plus a developer's margin — and an RTB trade is a private bilateral, so no market publishes either leg. `devCostPct` and `rtbPremiumPct` are seeded at zero and exposed as Investment Lab inputs; the Lab reports the implied £/MW so the assumption is at least visible | Transaction disclosure; a developer's segment reporting; an infrastructure fund's acquisition note |
| G26 | **Connection charge by market, at project scale** | Germany is the only market with a published figure — the Baukostenzuschuss, up to €140,000/MW, applied inconsistently across DSOs and upheld by the courts. Everywhere else the charge is regulated on actual cost or negotiated, so it is project-specific and unpublished. Japan's TEPCO regime is the clearest case of a known *schedule* against an unknown *amount*: a 10% deposit and a first contribution of at least 50% from 1 April 2026 | DSO/TSO connection offers; a proponent's disclosed connection cost |
| G27 | **VAT recovery lag by market** | Rates are statutory and known — GB 20%, Germany 19%, Italy 22%, Poland 23%, Ireland 23%, Romania 21% since 1 Aug 2025, Australia and Japan 10%. What is not published is how long a refund actually takes, which is the only thing that matters when VAT is recoverable: it converts a rate into a working-capital drag on IRR. Seeded at zero months, so VAT currently costs nothing in the model | Tax authority service standards; an operator's working-capital disclosure |
| G28 | **PJM Base Residual Auction clearing beyond the cleared years** | PJM's secured line is one delivery year — $325.00/MW-day × 365 × 59% ELCC = $69,989/MW/yr — and everything after it is an auction-renewal assumption. The 2027/28 and 2028/29 results are published, and the 2029/30 cap is now known ($337.83/MW-day, planning parameters of 31 Aug 2026); the renewal curve past them is not, and PJM is the market where that matters most because the BRA is the whole contracted position | PJM auction results and ELCC class ratings as each BRA clears |
| G30 | **US ancillary-service saturation, all three markets** | The one gate the US markets share. ERCOT's RTC+B went live 5 December 2025 and PJM's Regulation Redesign Phase 1 on 1 October 2025, both re-sizing the products a battery earns from, and CAISO's queue composition points the same way. Every US services seed is therefore a forward view rather than a run-rate | Modo indices post-redesign; ERCOT AS Methodology; PJM Regulation market size |
| G31 | **IRC §48E qualification under the material-assistance rules** | The federal tax credit is worth up to 37% of capex and the three US markets model it identically, but the One Big Beautiful Bill Act's material-assistance provisions and IRS Notice 2026-15 condition it on supply-chain sourcing that no BESS developer publishes. A binary that moves US returns more than any revenue assumption | IRS guidance; a developer's qualification opinion |
| G32 | **US merchant energy revenue at a 2030 vintage** | ERCOT and CAISO merchant seeds rest on Modo indices measured on today's fleet, restated to the vintage `merchantVintage` declares. The restatement is a judgement, not an observation, and ERCOT is where it bites — a 2h archetype in the market consensus flags for saturation | Modo forward curves; an optimiser's forward book |
| G33 | **CAISO Resource Adequacy price and tenor distribution** | RA is bilaterally negotiated rather than cleared, so CAISO's contracted line has the widest band on the platform. One 15-year agreement is public (Ormat / City of Riverside); nothing publishes the distribution around it | CPUC RA reports; utility procurement filings |
| G34 | **Security and guarantee amounts under each market's connection contract** | The capital-at-risk ledgers. Fifteen ledgers exist as of 2026-10-12; most are lower bounds and five have no sourced amount | Operator contribution and security policies; a proponent's disclosure |
| G35 | **Development attrition by market: applications that reach operation** | The break-even attrition line on each Entry tab has nothing to be read against. True attrition is published nowhere | Queue registers with dated status changes; GB's TEC register is the nearest |
| G36 | **Development cost to ready-to-build, per MW** | Replaces the zero `devCostPct` seed, and turns every entry-adjusted return from "at most" into a figure. Related to G25 | Developer disclosures; transaction filings |
| G37 | **Build programme by market and duration** | Replaces the uniform twelve months. Only Western Australia and Romania have a stated development and build range, so only they have an entry-adjusted return. Related to G26 | Operator connection timetables; project announcements with dated milestones |
| G38 | **Traded-asset and platform transactions by market** | The evidence for the exit-liquidity grade | Transaction announcements; adviser league tables |
| G39 | **Investment-screening thresholds applying to storage, by market** | The foreign-entry grade. Opened for most markets in October 2026; the EU tariff database was not opened for the origin grade | Statute and regulator guidance |

---

## 6a · Round 1 — what it changed

Landed 2026-07-30. Every item below is an analyst decision, not an automated update — the ETL
proposed none of it and could not have.

| Market | Change | Effect |
|---|---|---|
| Poland | Capacity line rebuilt on the Dec-2025 auction: PLN 465.02/kW × KWD 13.39% | €39,585 → **€14,481**/MW/yr. Thesis rewritten |
| Japan ×3 | 4h → **6h**; base route moved from the annual capacity auction to the **LTDA**; capex ¥45k → ¥60k/kWh | Secured share ~96% for the full window; award priced off cost, not off the bid ceiling |
| GB | 2h → **4h**; capex £460k → £900k/MW at unchanged £225/kWh; toll corrected to 10 years, additive with CM, reverting to merchant | Backs the T-4 duration shift; toll and capacity stop being modelled as alternatives |
| Ireland | Capacity price to the 2029/30 auction (€135.50/kW); **services decay curve** calibrated on GB's frequency-response collapse | The DS3→FASS cliff is now in the model rather than in a footnote |
| WA | 8h → **7h** against a 6h product; RCP to the surplus-adjusted A$422,372/MW; **naqFactor 0.90** for forfeited access priority | Capex per MW falls ~12% at unchanged A$520/kWh; the election's cost lands on energy revenue |
| Romania | €70.4k → **€140k**/MW/yr gross, with an FCR saturation curve and the scheme's real grant ceilings | Aggressive level, with the decay that makes it defensible |

**Structural.** The capacity line is now declared as price × de-rating and derived, so the two
components drift independently and the ETL can propose either. `servicesCurve` models a regime
change rather than a trend. `ltda` carries a clawback fraction, so an award is never additive with
the merchant stack. `naqFactor` charges an access regime against energy revenue. Grant caps bind on
the scheme's own terms. All classified in `governance/authority.js`; the classification test now
walks to every leaf, so a nested object can no longer be authorised wholesale.

**Project debt.** A layer beside the revenue tabs on every dashboard, sizing two tranches
against secured and market cash flow separately, with rollover allowances that are **zero** for
auction-renewal revenue and for tolls. It reports the share of senior debt standing on contracted
cash flow — what certainty actually buys — plus the refinancing point and the balloon. It shows
leverage as *dilutive* for Japan's award, whose return sits below the all-in cost of debt.

**Tests.** Split in two. `baseline.test.js` now runs the prototype's own frozen inputs
(`fixtures/legacy-inputs.mjs`) and proves engine correctness; `current-model.test.js` pins what we
publish today. They fail for opposite reasons, which is the point.

---

## 6b · Rounds 2-4 — what changed since

Landed 2026-08-01 to 2026-08-04. Analyst decisions throughout; the ETL proposed none of it.

**Markets.** Italy, Germany and the NEM closed the "missing markets" gap; PJM, ERCOT and CAISO then
took the platform to fourteen. The US three are separate markets rather than one country with
regional lenses because they share a federal tax and tariff layer and almost nothing above it —
which makes the league table an unusually clean controlled comparison of market design.

**The merchant vintage.** The first US build priced ERCOT's arbitrage leg at CY2025 actual against a
2030-saturated ancillary leg. That is not conservative, it is incoherent: it prices one leg in a
world where the queue has arrived and the other in a world where it has not.
`src/comparison/vintage.js` now derives the vintage year from the base route, so a market cannot
disagree with its own toll tenor, and all fourteen markets declare one.

**Capital cost.** Capex was one number spent at t=0. It now carries a component stack, a tax layer, a
ready-to-build entry price and a construction period — the four things that were hiding inside a
single scalar. Introduced as a strict superset: every stack reconciles exactly to its market's
published installed cost, VAT is recoverable with no lag, dev cost and premium seed at zero, and a
twelve-month build is one outflow. **Nothing revalued.** `baseline.test.js` proves it, still green
against a fixture that was never regenerated. New gates G24-G27.

**Network plans.** Every market gained a named-project register in its own jurisdiction's status
vocabulary, plotted on a new planned-build map layer. The NEM's is AEMO's 2026 ISP Appendix A5 in
full. Correcting one error found on the way: Project EnergyConnect was recorded as fully energised in
June 2026 and is not — Stage 1 delivered 150 MW of an eventual 800 MW and Stage 2 lands November
2027, which inverted an argument the grid tab was building on it.

**No forced returns.** `irrOf` returned null both when a route does not exist and when the cash flows
never return the capital. The engine now diagnoses which, and an unsolvable case prints
"N/M — no positive IRR solution" with MOIC retained rather than an em dash that hides the difference.

---

## 6c · Policy refresh — 2026-10-10

A re-read of every market's policy and consensus statements against what was published between
early August and 10 October 2026. Analyst decisions throughout; the ETL proposed none of it.

| Market | What moved | Model effect |
|---|---|---|
| PJM | 2029/30 collar cap is **$337.83/MW-day**, not $325 (Reference Resource UCAP factor 79% → 76%). FERC suspended the Reliability Backstop filing on 29 Sep 2026 to 28 Feb 2027 | Renewal year 1: 337.83 × 365 × 0.57 = $70,286 (was $67,616). Hold IRR 2.34% → **2.37%** |
| WA | BRCP 2028-29 is **A$488,500** (ERA final, 13 Mar 2026); A$491,700 was the draft | Band ceiling only. Realised price held at A$422,372 — scaling onto the final BRCP would give ~A$419,600 (−0.65%) |
| Japan ×3 | Round 4 outline (2 Sep 2026): Li-ion capped at 400 MW, certified-cell projects awarded first, ceiling ¥70,675–74,417/kW/yr, bids 27 Jan–3 Feb 2027 | Band ceiling only; the cost-derived bid is unchanged and is now ~51% of the ceiling midpoint, not 41% |
| Ireland | TSOs: May 2027 DASSA go-live "is not feasible"; no new date; DS3 long-stop still 30 Sep 2027 | None — the year-3 step in `servicesCurve` survives either outcome |
| ERCOT | Large-load queue ~474 GW (~90% data centres), paused for audit since 3 Aug 2026; June 2026 fleet revenue a record-low $1.11/kW-month | None — the queue was already an upside scenario, not base revenue |
| Germany | EU state-aid approval reported 2 Sep 2026; BNetzA final grid-fee draft 6 Aug 2026 | None |
| Italy | Auction-2 reserve premium €27,000/MWh/yr | None — the modelled line is the auction-1 clear |
| NEM | ESEM draft legislation 14 Sep 2026; first round indicatively late 2027, not early 2027 | None |
| CAISO | CPUC D.26-07-008: storage QC cut for foldback from 2027, unit-specific UCAP from 2028 | **Not priced.** The RA line still pays on nameplate; the haircut is unpublished |
| Romania | Operating storage ~2 GWh at 1 Aug 2026; €150m grant call closes 30 Oct 2026 | None |
| Poland | Supplementary T-1 auction (3 Sep 2026) cleared batteries at a 95% factor, PLN 325.55k/MW/yr; no main auction in 2026 | None — a top-up for assets already online, not a new-entry route |

**Consensus since round 1.** Tolling is now the modal revenue model in European BESS debt (§2.4).
BNEF (August 2026) and AEMO's Q2 2026 report agree NEM battery revenue roughly halved year on year
as spreads fell from A$342 to A$51/MWh, which moves consensus toward the caution this platform
already carried. ERCOT saturation is the standard reading. Aurora's European ordering is unchanged:
Germany, Great Britain, Italy.

**Left open on purpose.** Confidence scores, consensus statuses and run-rate factors in
`decisionProfiles.js` were not re-scored. The German €4–7k/MW/yr grid fee was not re-read from the
6 August draft. US tariff wording ("reciprocal tariffs") predates the February 2026 Supreme Court
ruling and was not verified.

---

## 7 · Sources

Ordered by section of first use. All accessed 2026-07-30.

**Route to market and finance**
Drax — [250 MW / 500 MWh tolling](https://www.drax.com/news/tolling-agreement-for-250mw-500mwh-of-bess/) ·
[200 MW / 800 MWh tolling](https://www.drax.com/news/tolling-agreement-for-200mw-800mwh-of-bess/) ·
Energy-Storage.news — [what a bankable route-to-market looks like](https://www.energy-storage.news/what-does-a-bankable-route-to-market-strategy-for-battery-storage-in-europe-actually-look-like/) ·
[Europe's shift to tolling offtake](https://www.energy-storage.news/balance-between-profitability-predictability-europes-shift-tolling-offtake-agreements-battery-storage/) ·
ESS News — [battery tolling grows as Germany moves beyond merchant risk](https://www.ess-news.com/2026/07/15/battery-tolling-grows-as-germany-moves-beyond-merchant-risk/) ·
[BBDF 2026: finance, tolling, and the merchant balance](https://www.ess-news.com/2026/03/31/bbdf-2026-finance-tolling-and-getting-the-merchant-balance-right/) ·
[BBDF 2026: standalone vs co-located financing](https://www.ess-news.com/2026/04/01/bbdf-2026-how-financing-standalone-vs-co-located-projects-really-works/) ·
Energy-Storage.news — [lenders now actively financing merchant BESS in Germany](https://www.energy-storage.news/lenders-now-actively-financing-merchant-bess-projects-in-germany/) ·
Modo — [European BESS Capital Markets Report Q1 2026](https://modoenergy.com/research/en/european-bess-capital-markets-report-q1-2026) ·
Société Générale — [BESS: emerging asset to essential infrastructure](https://wholesale.banking.societegenerale.com/en/news-insights/all-news-insights/news-details/news/bess-emerging-asset-to-essential-infrastructure/)

**Duration and market attractiveness**
Modo — [NEM BESS outlook Jul 2026](https://modoenergy.com/research/en/nem-battery-investment-outlook-july-2026) ·
[German BESS investment outlook Q2 2026](https://modoenergy.com/research/en/germany-battery-investment-outlook-q2-2026-executive-summary) ·
Aurora — [Germany, GB, Italy top battery investment](https://auroraer.com/company/press-room/germany-great-britain-italy-top-battery-investment-in-europe-while-see-sees-uptick) ·
PV Tech — [Aurora co-location rankings 2026](https://www.pv-tech.org/germany-great-britain-and-bulgaria-top-europes-co-location-investment-rankings-for-2026/) ·
ESS News — [Italy enters top-10 investment markets](https://www.ess-news.com/2026/06/22/italy-enters-top-10-most-attractive-battery-storage-investment-markets/) ·
[Poland, Italy lead Europe's revenue rankings (Clean Horizon Storage Index)](https://www.ess-news.com/2026/07/01/poland-italy-lead-europes-battery-storage-revenue-rankings/) ·
Timera — [5 energy market surprises for 2026](https://timera-energy.com/blog/5-energy-market-surprises-for-2026/) ·
[Italian battery investment is about to surge](https://timera-energy.com/blog/italian-battery-investment-is-about-to-surge/) ·
Energy-Storage.news — [BNEF forecasts 158GW for 2026](https://www.energy-storage.news/bloombergnef-forecasts-158gw-of-global-energy-storage-deployments-in-2026/) ·
Wood Mackenzie — [energy storage: 5 trends for 2026](https://www.woodmac.com/news/opinion/energy-storage-2026-outlook/)

**Great Britain**
Modo — [T-4 2029/30 clears at £27/kW](https://modoenergy.com/research/en/gb-capacity-market-t4-2029-30-battery-energy-storage-march-2026) ·
[Capacity Market methodology docs](https://docs.modoenergy.com/pages/apr-2026/uk-europe/gb/capacity-market/) ·
[2024/25 de-rating factors confirmed](https://modoenergy.com/research/en/gb-capacity-market-2025-bess-derating-factors-confirmed-target-capacity) ·
[frequency response saturation](https://modoenergy.com/research/battery-energy-storage-frequency-response-saturation) ·
[BM revenues overtake frequency response, Jan 2024](https://modoenergy.com/research/battery-energy-storage-revenue-janauary-2024-balancing-mechanism-wholesale-frequency-response-stack-capacity-market-triads) ·
Timera — [T-4 clears at £27/kW after years of £60+](https://timera-energy.com/blog/gb-t-4-auction-clears-at-27-kw-following-multiple-years-of-60-kw-prices-as-auction-demand-falls/) ·
ESS News — [batteries awarded 1.22 GW for 2029 delivery](https://www.ess-news.com/2026/03/11/batteries-awarded-1-22-gw-in-uk-capacity-market-auction-for-2029-delivery/) ·
Energy-Storage.news — [Ofgem LDES cap-and-floor Window 1](https://www.energy-storage.news/uks-ofgem-goes-big-on-ldes-cap-and-floor-window-1-18-hour-lithium-ion-among-winners/) ·
Ofgem — [LDES cap and floor application window 1](https://ofgem.gov.uk/decision/long-duration-electricity-storage-cap-and-floor-application-window-1)

**Ireland**
Modo — [Ireland: a power market in transition for BESS](https://modoenergy.com/research/en/ireland-bess-market-ds3-fass-wholesale-balancing-mechanism-2026) ·
SEM-O — [PCAR2930T-4 provisional results](https://www.sem-o.com/sites/semo/files/2026-04/PCAR2930T-4%20report.pdf) ·
[2028/29 T-4 final results](https://www.sem-o.com/sites/semo/files/documents/general-publications/20282029-T-4-Final-Capacity-Auction-Results-Report-FCAR2829T-4.pdf) ·
EirGrid — [T-4 capacity auction results](https://www.eirgrid.ie/news/eirgrid-group-publishes-t-4-capacity-auction-results) ·
ESS News — [Ireland: waiting for market maturity](https://www.ess-news.com/2025/08/04/spotlight-on-ireland-waiting-for-market-maturity/)

**Poland**
URE — [final results, main capacity auction for 2030](https://www.ure.gov.pl/en/communication/news/504,The-President-of-URE-announces-the-final-results-of-the-main-capacity-market-auc.html) ·
ESS News — [Poland downgrades BESS availability](https://www.ess-news.com/2025/12/30/poland-downgrades-bess-availability-plummets-total-awards-in-capacity-market-auction/) ·
[R.Power in line for 4 GWh of CM contracts](https://www.ess-news.com/2025/12/18/r-power-in-line-for-capacity-market-contracts-for-4-gwh-of-bess-projects-in-poland/) ·
Energy-Storage.news — [BESS wins fall for the first time, de-rating cut to blame](https://www.energy-storage.news/bess-wins-in-poland-capacity-market-falls-for-the-first-time-de-rating-cut-to-blame/) ·
Modo — [Poland's buildout outlook](https://modoenergy.com/research/en/poland-battery-pipeline-buildout-queue-capacity-market-auctions-subsidy-grid-connection-queue)

**Romania**
DNV — [why Romania is emerging as a prime BESS market](https://www.dnv.com/article/why-romania-is-emerging-as-a-prime-battery-storage-market-in-europe/) ·
Clean Horizon — [Romania's market is at a turning point](https://www.cleanhorizon.com/news/romania-energy-storage-market-turning-point/) ·
ESS News — [EC approves Romania's storage subsidy scheme](https://www.ess-news.com/2026/03/09/european-commission-approves-romanias-battery-storage-subsidy-scheme/) ·
Balkan Green Energy News — [€250m in grants for batteries and meters](https://balkangreenenergynews.com/romania-allocates-eur-250-million-in-grants-for-batteries-smart-meters/) ·
Romania Insider — [pipeline exceeds 9 GW](https://www.romania-insider.com/battery-storage-pipeline-romania-july-2026) ·
EBRD — [backing Romania's first large-scale BESS](https://www.ebrd.com/home/news-and-events/news/2026/ebrd-backs-large-scale-battery-storage-project-in-romania-.html)

**Western Australia**
ERA — [2026 BRCP for the 2028-29 capacity year](https://www.erawa.com.au/markets/wholesale-electricity-market-effectiveness-reports/price-setting/benchmark-reserve-capacity-prices/2026-benchmark-reserve-capacity-prices-apply-2028-29-capacity-year) ·
Modo — [draft benchmark capacity price rises 36%](https://modoenergy.com/research/English/australia-wem-draft-benchmark-capacity-price-rises-36-percent) ·
[the state of BESS in the WEM](https://modoenergy.com/research/en/australia-the-state-of-battery-energy-storage-in-the-wem) ·
Energy-Storage.news — [ERA proposes A$491,700/MW](https://www.energy-storage.news/western-australias-era-proposes-au491700-mw-benchmark-price-driven-by-1200mwh-battery-storage-specifications/) ·
AEMO — [2026 WEM Electricity Statement of Opportunities](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning/wem-electricity-statement-of-opportunities-wem-esoo)

**Japan**
Greenberg Traurig — [BESS and the Japan power market: LTDA Round 3](https://www.gtlaw.com/en/insights/2026/6/bess-and-the-japan-power-market-the-current-state-of-play-at-ltda-auction-round-3) ·
Energy-Storage.news — [1.25 GW selected under a 6-hour duration requirement](https://www.energy-storage.news/japans-grid-operators-select-1-25gw-of-bess-in-capacity-market-auction-with-6-hour-duration-requirement/) ·
pv magazine — [Japan awards 1.25 GW in capacity market auction](https://www.pv-magazine.com/2026/05/16/japan-awards-1-25-gw-of-battery-storage-in-capacity-market-auction/) ·
Nishimura & Asahi — [long-term decarbonization auctions](https://www.nishimura.com/en/knowledge/newsletters/natural_resources_energy_241224) ·
IEEFA — [Japan's grid-scale BESS market](https://ieefa.org/resources/japans-grid-scale-bess-market-turning-market-hype-reality) ·
Japan Energy Hub — [BESS costs, MRI estimates](https://japanenergyhub.com/news/bess-costs-meti/)

**Italy (not currently covered)**
ESS News — [MACSE 16 GWh auction set for 24 Nov 2026](https://www.ess-news.com/2026/06/02/italy-sets-november-date-for-macse-storage-auction-targeting-16-gwh/) ·
Energy-Storage.news — [taking stock of the first MACSE auction](https://www.energy-storage.news/terna-is-the-big-winner-taking-stock-of-italys-macse-auction/) ·
Modo — [MACSE 2026: bigger volumes, same rules](https://modoenergy.com/research/en/italy-macse-2026-auction-bess-rules-terna)

---

## 8 · Congestion round — collected 2026-07-31

A second collection round, scoped to one question: **where does network congestion create a BESS
opportunity, how is it captured, and when does it end?** The findings are wired into
`src/markets/*/congestion.js` and rendered as a constraint layer on each market map, a register on
each Grid Connection tab, and one comparison card on the home page.

| Market | Constraint measured | Capture mechanism | Relief | Runway from 2026 |
|---|---|---|---|---|
| GB | £3.1bn balancing cost FY2025/26 (thermal constraints £1.7bn); £380m to turn Scottish wind off and £1.08bn to turn English gas on in 2025; B6 constrained ~30% of periods, B2/B4/B5 ~40% | Balancing Mechanism **only** — REMA rejected zonal pricing on 10 July 2025 | Eastern Green Link 2, 2 GW Peterhead–Drax, £4.3bn, under construction since Sept 2024 | **3 yr** (2029) |
| IE | Wind dispatch-down 11.3% of available energy in 2025 — constraints 6.6pp, curtailment 4.7pp; **83%** of curtailment is the minimum conventional generation rule, SNSP only 17% | Operational rule — relieved by supplying system services, not by siting | FASS competitive auctions from May 2027 (long-stop Sept 2027) | **1 yr** (2027) |
| PL | Non-market RES curtailment 731 GWh (2024) → 1,131 GWh by Sept 2025; April 2025 alone 25+ redispatch days and 223 GWh of solar. Compensation PLN 200–250/MWh vs losses PLN 400–600/MWh | Regulated compensation to the generator; the battery earns from the depressed price, not the payment | Internal north–south HVDC + ~4,700 km new 400 kV, TGDP 2025–2034 | **8 yr** (2034) |
| RO | Dobrogea/Constanța lines and substations cannot carry additional flows; Transelectrica estimates 10–20 GWh of storage needed by 2030 against ~1 GWh installed | **Connection auction — charges the developer.** From 2026 all connections ≥5 MW are auctioned; zonal available capacity published by 15 January, reserve price set from the cost of required grid works | Named in each zonal auction rather than in a separate plan | none published |
| JP-Tokyo | Output control reached the Tokyo area for the **first time** in March 2026 — the last holdout | Output control | None published | none published |
| JP-Kyushu | FY2025 output-control rate 5.9%, highest of any area (Shikoku 3.8%, Tohoku 3.0%, Chugoku 1.5%) | Output control | Chugoku–Kyushu interconnection, ¥441.2bn, scalable to 2 GW, 11–13.5 yr build initiated 2024 | **11 yr** (2037) |
| JP-Hokkaido | Curtailment stays concentrated in northern Hokkaido under **both** OCCTO's base and high-renewables scenarios | Output control | Hokkaido–Honshu HVDC, 2 GW / 800 km Japan Sea route; basic requirements approved April 2024 | **13 yr** (2039) |
| WA | Network Access Quantities cap export; foundation generators hold priority. No per-facility constraint data is published for the SWIS | **Capacity accreditation** — the loss appears as fewer Capacity Credits, not as an energy payment | Clean Energy Link — East (Collie → Shotts/Muja), $1.4bn Clean Energy Fund; Link — North began construction July 2026 | **3 yr** (2029) |

**What this round changed in the model:** nothing numeric. No per-MW congestion revenue is carried in
any market — that is **gate G14** — so the register reports the pool, the mechanism and the expiry
date, and stops. What it does add is a dated warning on the assumption each constraint sits inside:
GB, Poland and the two Japanese areas on `merchGross`, Ireland on `services`, WA on `naqFactor`.
Romania carries no warning because its mechanism charges rather than pays.

**Three positions worth recording as deliberate:**

1. **GB congestion is a route-to-market thesis, not a siting thesis.** With zonal pricing rejected,
   the entire constraint pool is reachable only through Balancing Mechanism actions. Any model that
   prices GB congestion into the wholesale spread is modelling a market that was explicitly refused.
2. **A named, funded relief project is not always a reason to discount a constraint.** Kyushu's
   interconnector is an 11–13.5 year build started in 2024, so it relieves nothing inside a fifteen-year
   window. Runway, not existence, is the test.
3. **The measured column is not rank-comparable and is not presented as if it were.** Five operators
   publish five different quantities. Only runway and capture mechanism are compared across markets.

### 8a · Three markets added, and two new capture mechanisms — 2026-08

| Market | Constraint measured | Capture mechanism | Relief | Runway from 2026 |
|---|---|---|---|---|
| NEM | No firm transmission rights anywhere in the market; the Congestion Relief Market that would have paid for relief was recommended not to proceed. Marginal loss factors run 5–10× the A$3.2k/MW/yr fleet average on some assets | **Uncompensated** — nobody pays, and **loss factor** where it is a continuous settlement haircut | Programme-level ISP works | mostly none published |
| DE | €3.1bn congestion management in 2025; 15.5 TWh downward redispatch; 2.7 TWh PV curtailment | **No verified mechanism.** ENTSO-E found every bidding-zone split more efficient; Germany rejected it in December 2025, so congestion never becomes a price. Whether storage is paid under Redispatch 2.0 could not be verified | Ultranet 2026, SuedOstLink and A-Nord 2027, SuedLink 2028 — all four reported late | **0–2 yr** on paper |
| IT | No national curtailment total published. Instead a **priced** signal: Terna set the first MACSE requirement at 0 GWh for the North and Centre-North and all 10 GWh in the south and the islands; Sicily cleared €15,846/MWh/yr against €12,146 in Sud e Calabria | **Zonal procurement** (MACSE — an auction the operator can *win*) and **zonal price** (Italy kept six bidding zones) | Tyrrhenian Link and SA.CO.I.3 2028, ELMED 2028, Adriatic Link 2029; Development Plan >€23bn to 2034 | **2 yr** (2028) |

**The vocabulary gained two terms, and that was necessary rather than tidy.** `src/governance/congestion.js`
previously had no way to say either of the things Italy does. `ACCESS_AUCTION` exists for Romania and
*charges* the developer; MACSE is the same instrument shape with the money running the other way, so
reusing it would have recorded a revenue as a cost — and the platform's own test caught exactly that.
Hence **`LOCATIONAL_PROCUREMENT`** (pays). Separately, GB and Germany both refused zonal pricing in
2025 and the register's whole GB argument is that congestion there cannot reach the wholesale price;
Italy is the counterexample, so **`ZONAL_PRICE`** (pays) exists to name it. Both are additive: no
existing market's classification changed.

**Italy is the nearest thing to a partial close on gate G14.** The zonal MACSE spread — a 30% premium
for the same product on the other side of one constraint — is a published price attached to a named
constraint, which no other market here provides. It is still a *procurement clear* rather than a
measurement of what a battery captures, and Terna publishes no curtailment volume in GWh, so the
register uses it as a proxy and says so on the page.
