# External view — what the market says, and where we differ

**Collection round 1 · vintage 2026-07-30**

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

## 1 · What we publish, as at the collection date

| Market | Archetype | Base route | Contracted line | Thesis |
|---|---|---|---|---|
| WA — WEM | 200 MW · 8h | capacity | 0.95 × BRCP = A$464k/MW, 10 yr | Capacity-led islanded market; duration is the product |
| GB | 100 MW · 2h | capacity (+ toll) | £27.10/kW × 0.22, 15 yr | Trading-led, connection-rationed |
| IE — SEM | 50 MW · 4h | capacity | €149.96/kW × 0.66, 10 yr | Highest capacity pay per nameplate MW |
| RO | 50 MW · 2h | merchant + 20% grant | none | Best raw spread, zero contracted revenue |
| PL | 100 MW · 4h | capacity | €60.9/kW × 0.65, 17 yr | Longest contract makes storage conventional infrastructure |
| JP ×3 | 50 MW · 4h | capacity (1 yr secured, then auction-renewal) | ¥15,111/kW × 0.70 | Multi-market optionality, regional differentiation |

Routes modelled: `cap` · `mer` · `toll` (GB only) · `ltda` (declared, disabled everywhere).
Unlevered, 15-year window, exit priced at 7.5% contracted / 11.5% merchant and auction-renewal.

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

---

## 3 · Market-by-market: consensus vs what we publish

### Poland — the de-rating collapse

| | We publish | Market |
|---|---|---|
| Capacity price | €60.9/kW/yr (PLN 264.90, Dec-2024 auction, 2029 delivery) | **PLN 465.02/kW/yr**, Dec-2025 auction, 2030 delivery (+76%) |
| Correction factor (KWD) | 0.65 | **0.1339** — down from ~60% (2024) and 95% (2023) |
| Implied per physical MW | €39,585/MW/yr | **~€14.6k/MW/yr** |

~685 MW of de-rated obligation was awarded against ~5.1 GW of physical battery: for every 100 MW
built, 13.4 MW of obligation. Total 2030 obligations ~6.9 GW across 198 CMUs, ~1 GW of it foreign.

The Polish CM expects units to deliver contracted capacity for four hours, so the KWD cut lands
hardest on exactly the 4h configuration we model.

**Caveat that matters:** contracts already won at the old factors are grandfathered for their
17 years. Our number may still be right for an *existing contracted asset*. It is wrong as a
**market-entry benchmark**, and market entry is what the cockpit models.

This directly contradicts our published Poland thesis — *"the auction, not the site, is where value
is created."* The auction is where the value was removed.

### Japan — the 4h archetype cannot bid

LTDA Round 3, results 13 May 2026:

- 3–6h bracket **eliminated**; hard **6-hour minimum** for BESS.
- ~575 MW standalone BESS awarded; ~1,705 MW total storage allocation against an 800 MW target.
  1.25 GW across 19 projects on the wider count (551 MW lithium-ion, 699 MW non-lithium).
- Bid success ~46%, up from ~20% in Round 2. Advisers caution against assuming this persists.
- **20-year** Capacity Reserve Agreement with OCCTO, CPI-indexed, pay-as-bid, clearing prices not disclosed.
- FY2024 (Round 2) guideline maxima: ~¥87,683–93,883/kW/yr for 6h+, vs ~¥56,545–77,509/kW/yr for 3–6h.
- **~90% of net profit from other markets is returned to OCCTO** for the 20-year term.
- **Co-located** renewable + BESS is *not* subject to the clawback.

Two consequences for us. First, our 50 MW / 4h reference is ineligible for the route advisers treat
as the bankable base. Second, the clawback means LTDA and merchant are **not additive** — they are
close to mutually exclusive. Our strategy model treats routes as parallel alternatives with merchant
stacked inside `cap`; switching `ltda` on under that structure would overstate Japan badly.

Japanese capex is the other open item: grid-scale BESS averaged **~¥68,000/kWh in FY2024**
(~US$433/kWh), with system costs 2.5–3× global benchmarks. We model ¥45,000/kWh.

### Great Britain — our spot numbers are right, our archetype is not

Two of our inputs are *exactly* current, which is worth recording:

- **£73,145/MW/yr** is Modo's 2h GB benchmark for the twelve months to April 2026.
- **£27.10/kW/yr** is the actual T-4 2029/30 clear (March 2026).

New-build storage awards in that auction, by duration: **2h 431 MW · 4h 224 MW · 5h 273 MW ·
8h 70 MW** — 1.18 GW total. Agreement lengths on offer: 1, 3, 9 and **15** years. 109 battery CMUs
participated; 49 exited without a contract.

Context on the price: £27.10 follows three consecutive T-4s at £60–65/kW. The completed-auction range
is £6.44–65/kW. De-rating factors fell sharply for 2026/27 and 2027/28 on a NESO stress-event
methodology change, partially recovered for 2028/29 and 2029/30, and the stated long-run direction is
**downward** as stress events lengthen. Published anchors: 1h **10.47%**, 2h **20.94%** (2024/25).

We discount a one-off auction outcome as a 15-year contracted stream at 7.5%.

### Ireland — the DS3 cliff is not in the model

| | We publish | Market |
|---|---|---|
| Capacity price | €149.96/kW/yr | That is the **2028/29** T-4. The **2029/30** T-4 (Apr 2026) cleared **€135,499.99/MW/yr** |
| System services | €8,000/MW/yr, **flat for 15 years** | DS3 expires end-2026; extended to FASS go-live May 2027, long-stop Sept 2027. Effective rates already **down >40% since 2022** |

Modo's explicit analogy is Great Britain, "where frequency response revenues collapsed" when legacy
contracts ended. The GB precedent in detail: FFR was 40–50% of battery revenue through 2020;
Dynamic Containment launched Q4 2020 and became dominant; DC revenues fell through 2022 on
saturation; by January 2024 Balancing Mechanism revenue had overtaken frequency response entirely.
Saturation arrived at roughly 1.1× the requirement — ~1,567 MW installed against a frequency response
requirement below ~1,400 MW.

Ireland: ~800 MW operational, first 4h system online early 2026, pipeline ~10 GW / 50 GWh across
155 projects **dominated by 4h systems built for wholesale arbitrage** — while the existing fleet is
almost entirely 1h and 2h built for DS3's tariff structure. Wholesale spreads average ~€103/MWh on a
merit order with no mid-merit cushion. De-rating factors are beginning to erode capacity payments,
particularly for shorter durations.

### Western Australia — 8h of capex against a 6h product

| | We publish | Market |
|---|---|---|
| Archetype | 200 MW / **8h** | ERA benchmark facility is **200 MW / 1,200 MWh (6h)**; flexible capacity credits require defending a **six-hour** window |
| Capex | A$4.16m/MW → **A$520/kWh** | ERA benchmark is **A$520/kWh** — our unit cost is exactly right |
| Capacity price | 0.95 × BRCP = A$464k/MW | BRCP A$491,700/MW (+36%), but AEMO forecasts surplus; realised RCP may settle ~**A$422,372/MW** |

The 10-year fixed-price election secures ~**A$844.7m** for a 200 MW battery — A$422,350/MW/yr, which
is the same A$422k level. It is not free certainty: it **sacrifices transmission access priority and
forfeits upside**. Network Access Quantities cap accreditation and dispatch; existing "foundation"
generators hold priority and new entrants take the remaining headroom.

ERA's A$520/kWh sits well above CSIRO's national A$301–377/kWh, so the BRCP may overcompensate
typical construction cost even after WA's regional premium.

AEMO context: >2,000 MW of EOIs into the 2026 Reserve Capacity Cycle; surplus of 347 MW against a
Peak RCR of 6,323 MW in 2028-29; 889 MW of further committed generation and storage by 2028-29.

### Romania — we may be understating it

Our structure is right — no capacity mechanism, merchant plus grant — and matches every source found.
The **level** does not.

| | We publish | Market |
|---|---|---|
| Total revenue | €70,400/MW/yr gross (€55,400 merchant + €15,000 services) | **~€140/kW/yr** (Clean Horizon) |

Supporting observations: 2025 DAM average **€110/MWh** with maximum daily price spread **€168/MWh**,
described as exceptionally high in a European context; FCR ~**€70/MW/h** (the most lucrative
ancillary service); aFRR up/down ~€9/MW/h. In 2025 the regulator **eliminated double taxation of
stored electricity**, exempting charging and discharging from network tariffs — a direct, dated
improvement to project economics that our merchant line does not reflect.

The grant is now specified: EC approved the scheme March 2026; Romania's Modernisation Fund
allocation is €636.9m (the largest of any recipient); the current tranche is €150m for standalone
storage, awarded by **competitive bidding capped at €69,000/MWh and €15m per company**, targeting
≥2,174 MWh. For our 50 MW / 2h archetype the cap is €6.9m against 20% of capex = €6.3m — so 20% sits
just inside the cap, but it is a **binary auction outcome we model as a deterministic percentage**.

Saturation risk is the counterweight: pipeline >9 GW, >2 GW operational expected by end-2026. FCR at
€70/MW/h does not survive that. An aggressive level needs a decay attached to it.

---

## 4 · Structural gaps in our model

Ordered by how much they distort a published number.

1. **De-rating is not a first-class input.** Poland going 95% → 60% → 13.39% in three auctions is the
   clearest evidence that de-rating, not price, is the volatile variable in any capacity-backed
   thesis. In our code it is fused into a hardcoded `contracted` figure with a comment. This is the
   highest-value ETL feed we do not have — it applies to PL, GB, IE and WA alike.
2. **No regime-change step in services revenue.** Every services line is flat with 2%/yr degradation.
   Consensus is unanimous that ancillary markets saturate: DS3→FASS in Ireland, GB's frequency
   response collapse as the documented precedent, Timera forecasting German FCR/aFRR down up to 50%
   vs 2025.
3. **No duration sensitivity.** One archetype per market means duration and geography are perfectly
   confounded. We cannot test our own published finding — *"merchant viability tracks duration, not
   geography"* — because no two markets share a duration and no market has two.
4. **Toll tenor and additivity are both wrong.** We assume 15 years (the code concedes "precedent
   tenors are shorter; assumed rollable"); precedent is 10. And in the Drax structure the owner
   **retains** Capacity Market revenue, so toll and capacity are additive — we model them as
   mutually exclusive rows.
5. **No leverage.** Deliberate, and defended in `comparison-methodology.md`. But debt capacity is the
   main thing a capacity contract or a toll actually buys, so expressing it only through a 400bp
   exit-yield spread understates the contracted routes we are trying to measure — and our
   "certainty frontier does not slope down" finding is partly an artefact of that choice.
6. **No optimiser / route-to-market counterparty dimension**, which lenders now weight explicitly.
7. **Saturation does not enter the engine.** `narrative.pipelineRatio` exists as a display string
   (~2.4× to ~13×) and touches nothing.
8. **No co-location.** All archetypes are standalone. Aurora ranks co-location as a separate market
   question, and in Japan co-location is the way around the LTDA clawback.
9. **Missing markets.** We cover three of consensus' top picks and miss the two most-cited: **Italy**
   (MACSE — Terna 15-year tolling, 10 GWh awarded in auction 1, **16 GWh auction 24 Nov 2026**, up to
   ~€34k/MW depending on contracted discharge duration) and **Germany** (Aurora #1 for co-location,
   40–50% tolled, grid-forming inertia contracts from Jan 2026). Also **Australia's NEM** — while we
   carry only WA, a ~6 GW islanded system.

---

## 5 · Where we are deliberately against consensus

Recorded so that a future reader does not "fix" these.

1. **Secured share and secured tenor are separate published rows**, and auction-renewal cash flow is
   discounted at the merchant yield rather than the contracted yield. The standard research deck
   reports a single "contracted %" that puts Japan's one-year award and Poland's seventeen-year
   contract at the same position. Our three risk classes exist to stop that. Keep.
2. **`ltda` was declared but disabled**, on the grounds that an award is project-specific and showing
   it by default would imply every project in the market wins one. That reasoning is sound; what
   changed is that the LTDA is now the *only* route with a six-hour-plus product, which makes the
   omission distortive rather than conservative. Revisit — the *reason* still stands and any
   enablement must carry an illustrative/project badge.
3. **Unlevered comparison.** Consensus underwrites levered. We keep the cross-market comparison
   unlevered so that debt capacity is an *output* to be measured rather than an assumption baked in.
   Keep — but the missing half is now planned as a market-level project-debt layer, not a change to
   the global engine.
4. **Spot indices are not underwriting numbers.** Clean Horizon's Poland 2h at €800k+/MW/yr is a
   monthly run-rate annualised at 1.5 cycles/day gross of fees, during a period of extreme aFRR
   prices in a market with very little operational capacity. We will not carry it as a merchant
   assumption, and this file records why.

5. **Fifteen years, no residual, no augmentation.** This one was surfaced *by* the revision rather
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
   the window would re-rate all eight markets at once for a reason that has nothing to do with any
   of them. The honest fix is a terminal-value treatment and an augmentation line, which is a
   design decision, not a data refresh. Recorded as gate **G12**.

---

## 6 · Next research round — named gates

Each item is a specific document or series that would close a specific open assumption.

| # | Gate | Closes | Where to get it |
|---|---|---|---|
| G1 | NESO Auction Guidelines / De-Rating Factor workbook, T-4 2029/30 | GB de-rating by duration (we have 1h and 2h only, from 2024/25) | NESO EMR Delivery Body — "Auction Results and De-Rating Factors Summary Data Workbook" |
| G2 | Modo ME BESS GB **4h** series | GB 4h merchant revenue; we only hold the 2h benchmark | Modo terminal (paid) |
| G3 | PSE draft parameters for the next Polish main auction | Whether KWD 13.39% is a step change or an overshoot to be partly reversed | PSE / URE auction parameter publications |
| G4 | OCCTO LTDA Round 3 guidelines and price caps | Japanese LTDA award level — pay-as-bid, clearing not disclosed; we hold only the FY2024 cap band | OCCTO auction guidelines |
| G5 | Japanese 6h BESS capex, 2026 vintage | Our ¥45,000/kWh vs ~¥68,000/kWh observed FY2024 | MRI / METI cost estimates; IEEFA |
| G6 | DS3 realised payments per MW per year for a 4h Irish battery | Whether our €8,000/MW/yr services level is right before any decay curve is applied | EirGrid DS3 settlement data; Modo Ireland |
| G7 | SEM FASS auction design and indicative price caps | The floor the Irish services curve should decay to | SEMC / EirGrid FASS consultations |
| G8 | AEMO WA network constraint / NAQ curtailment data | The size of the access-priority haircut on WA merchant revenue | AEMO WEM constraint and dispatch data |
| G9 | Clean Horizon Romania forecast (S1 2026) | Duration basis and forward decay behind the ~€140/kW/yr figure | Clean Horizon (paid) |
| G10 | Real BESS senior debt margins by market | Project-debt pricing — we hold base rates and structural conventions, not margins. Re-searched July 2026: Modo's Q1 2026 report gives deal counts and volumes (53 deals / 11 GW, >€3bn disclosed debt) but no margin quotation, and no public source quotes one. The 200–250bp band stands as an assumption | Modo European BESS Capital Markets report; lender term sheets |
| G11 | Terna MACSE auction 2 rules and results (24 Nov 2026) | Whether to add Italy, and on what contract terms | Terna publications |
| G12 | A terminal-value and augmentation treatment | Why our absolute returns sit below published ones — see §5.5. A design decision, not a data fetch | Internal; needs an augmentation capex curve and a residual-value basis |
| G13 | Per-market BESS fixed-opex and degradation series | The two Investment Lab bands with no published counterpart anywhere. Opex seeds run US$8.6k–16.5k/MW/yr across our six markets against a US utility-scale benchmark of US$15–25k; degradation is held at 2%/yr in every market because nothing market-specific exists to hold it at anything else | Operator LTSA/O&M disclosures; supplier warranty degradation curves |
| G14 | Per-MW congestion revenue for a battery, by market | The one number the congestion register deliberately does not carry. Operators publish the constraint pool — NESO a £3.1bn balancing cost, EirGrid an 11.3% dispatch-down rate, PSE a 1,131 GWh curtailed volume, OCCTO an output-control percentage — but none publish what share of it a battery captures. Closing it would let the Investment Lab price congestion instead of only flagging its expiry date | Modo GB Balancing Mechanism revenue by asset; EirGrid/PSE settlement data; an optimiser's realised constraint-revenue disclosure |

---

## 6a · What this round changed

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

**Project debt.** A new tab beside the revenue tabs on all six dashboards, sizing two tranches
against secured and market cash flow separately, with rollover allowances that are **zero** for
auction-renewal revenue and for tolls. It reports the share of senior debt standing on contracted
cash flow — what certainty actually buys — plus the refinancing point and the balloon. It shows
leverage as *dilutive* for Japan's award, whose return sits below the all-in cost of debt.

**Tests.** Split in two. `baseline.test.js` now runs the prototype's own frozen inputs
(`fixtures/legacy-inputs.mjs`) and proves engine correctness; `current-model.test.js` pins what we
publish today. They fail for opposite reasons, which is the point. 200 assertions, all passing.

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
