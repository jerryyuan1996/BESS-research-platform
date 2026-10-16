# Duration and route fit, by market — plan for sign-off

Drafted 2026-10-15 against `main` at `1e1ca69`. **Nothing here is built.** You asked three things:
which duration and which deployment strategy fit each market best, what the trends are and what
drives them, and how the platform can capture it. §0 to §3 answer the first two from the evidence
the repository already holds plus a round of searches. §4 onwards is the build. No step moves a
published number, a rights table or a piece of methodology until you decide it in §11.

How the figures were made:

- The dashboard sweeps in §1.2 come from running each market's own `labModel`
  (`src/markets/_shared/lab.js`) on its own seed (`M.lab`), at every duration that market sweeps.
- The price-shape figures in §3.3 come from the snapshots in `public/data/public/`, through
  `dailySpreadDetail` and `meanDailyExecutableSpread`, the functions the platform already
  publishes spreads with.
- Figures from outside the repository carry a numbered source in §12. Every one was read as a
  search summary on 2026-10-15, not opened. That is the `search-summary` access level in
  `src/governance/triggers.js`, and it is why several of them are research gates in §7.

---

## 0. The short answer

### 0.1 What the evidence says today

A deployment strategy here means a **route to market and a duration taken together**. In most of
these markets the route decides the duration. The readings below are preliminary and mine; none is
a grade or a verdict.

| Market | Modelled today | Fit (route · hours) | Direction | What drives it |
|---|---|---|---|---|
| Great Britain | 4h · Capacity Market + trading | Capacity Market · 4–5h. A separate class of 8h and longer under LDES cap-and-floor | Lengthening into two tiers | The auction pays de-rated MW, which rises with duration. Services saturated in 2022. Cap-and-floor window 1 averages about 18h |
| Germany | 4h · merchant | Merchant or toll · 4h. Capacity route · 10h, only if StromVKG clears | Lengthening. Fleet at 1.67h, but 4h is 63% of scheduled 2028 additions | Deeper solar trough, ancillary revenue collapsing, connection charged per MW. StromVKG requires ten hours |
| Italy | 4h · Capacity Market | Capacity Market, merchant or toll · 4h. MACSE · 6–7h | Lengthening on the contracted route | MACSE pays per MWh (awards averaged 6.68h). Terna proposes cutting the 4h de-rating to 0.53 |
| NEM (NSW) | 4h · CIS | 4h, with 6h inside the band | Lengthening, but the premium is eroding | Solar trough (4h keeps 96% of the 2h $/MWh). CIS awards 3.7–3.8h. Fleet at 2.38h and catching up |
| Western Australia | 7h · Reserve Capacity Mechanism | RCM · at least 7h. About 8.4h if credits must hold for ten years with no augmentation (§2.4) | Lengthening by rule: 4h, then 6h, then 7h | The ESR duration requirement. Arbitrage stops paying at the sixth hour (§3.3) |
| ERCOT | 2h · toll | Merchant · 2h. Toll · 4h | Slowly lengthening | Ancillary saturation and RTC+B. Offtakers want 4h discharge windows |
| CAISO | 4h · Resource Adequacy | RA · exactly 4h. 8h only through IRP procurement | Stable | RA credits four hours and no more. Slice-of-day and LDES counting are still open |
| PJM | 4h · capacity auction | 4h. 6h if the ELCC gap widens | Watch | ELCC class ratings: 4h 59%, 6h 68% |
| Japan (three areas) | 6h · LTDA | LTDA · at least 6h, plus a fade buffer (§2.4). Short merchant or annual-auction designs do not pay | Lengthening by rule | LTDA's six-hour floor. Capex 2.5–3× global |
| Poland | 4h · merchant | Unresolved: the capacity line no longer pays for hours | Pressure to shorten on the capacity leg | A KWD of 13.39% applied to every duration |
| Ireland | 4h · Capacity Market | 4h (de-rating 0.66). The dashboard's own sweep says 2h, which needs review | Lengthening as DS3 runs off | DS3 to FASS. De-rating by duration |
| Romania | 2h · merchant | 2h now, 4h as FCR saturates | Lengthening | FCR saturation, day-ahead spreads, tariff reform |
| Finland | 2h · not engine-ready | 2h | Watch | Reserve saturation. Optimiser floors |

### 0.2 Seven patterns across the markets

1. **Where adequacy is paid by the hour, the rules lengthen in dated steps.**
   - WA's ESR requirement has gone 4h → 6h → 7h [10].
   - Japan's LTDA abolished the 3–6h bracket [14].
   - GB's LDES window starts at 8h [3].
   - Germany's StromVKG requires 10h.
   - MACSE pays per MWh and awarded 6.68h.

   A rule is announced before it binds, which makes this the most predictable driver on the list. It
   belongs in the trigger calendar, not in a forecast.
2. **Accreditation is falling at the short end.**
   - PJM's 4h ELCC went from 92% (2024/25) to 59% (2028/29) [13].
   - Terna proposes cutting the 4h factor from 0.67 to 0.53.
   - Poland cut storage to 13.39% at every duration [15].
   - NESO's expert panel wants empirical battery data in its factors [4].

   Where the curve stays steep (PJM, Italy, GB, Ireland), the next hour gains value. Where it went
   flat (Poland), the next hour gains nothing.
3. **Ancillary saturation removes the short-duration premium.**
   - GB in 2022.
   - Germany, from 55% of revenue to about 5% by 2030.
   - Ireland, as DS3 gives way to FASS.
   - Romania's FCR and Finland's reserves.
   - ERCOT, from 84% of revenue to 48%.
   - PJM Regulation.

   Services are bought in MW. Once they saturate, what is left is energy, which is bought in MWh.
4. **The marginal hour is getting cheaper faster than the first one.**
   - Stationary packs fell 45% in a year, to $70/kWh.
   - Turnkey 4h systems averaged $110/kWh against $124/kWh at 2h [16].
   - In GenCost, the 4h premium over 2h fell 20–30% in two years.
5. **Solar-shaped prices lengthen the trough, but the fleet catches up.**
   - In the NEM, 4h keeps 96% of the 2h $/MWh.
   - On JEPX, 6h keeps 87–89% of the 4h ¥/MWh (§3.3).
   - But NSW fleet duration reached 3.2h and NSW revenue fell 51%. A duration advantage is relative
     to the fleet it competes with.
6. **Duration has become a route choice.**
   - ERCOT: merchant 2h, tolled 4h.
   - Italy: Capacity Market and tolls at 4h, MACSE at 6.7h.
   - Japan: LTDA at 6h or more, merchant short.
   - Germany: merchant 4h, StromVKG 10h.

   In these four, "the best duration" is the wrong question. The right one is the best duration on
   each route, then the best route.
7. **The fleet lags the awards by two to four years.**
   - Fleet averages: GB 1.62h, Germany 1.67h, ERCOT 1.65h, NEM 2.38h.
   - Awards: GB T-4 new build about 3.7h, CIS 3.7–3.8h, WA CIS 7.6h, MACSE 6.7h, GB LDES about 18h.

   The fleet is the lagging signal. Awards and rules lead.

### 0.3 Why the platform cannot say this itself yet

1. **It has two duration models, and they disagree.**
   - The engine prices one duration per market.
   - The dashboards carry a second model, the prototype's `labModel`, which sweeps durations.
   - Run on their own seeds today, the sweeps pick a different duration from the archetype in six of
     eleven markets (§1.2).
2. **Some dashboard inputs are stale.**
   - Poland's sweep credits a de-rating that rises from 0.40 at 2h to 0.65 at 4h. The December 2025
     auction applied 13.39% to every duration.
   - GB's dashboard credits 0.45 at 4h where the engine carries 0.38.
   - Japan's duration path still reads 4–4.5h against a 6h archetype.
   - GB's lab seed is still 2h.
3. **The sweeps ignore the route.**
   - Japan's runs on the annual Capacity Market and picks 1h. The route Japan is financed on admits
     nothing below 6h.
   - Germany's prices StromVKG at its cap and picks 10h.
4. **Nothing has a time dimension.** No fleet, award or price-shape series is recorded, so
   "lengthening" exists only as prose.
5. **No objective is stated.** NPV and IRR pick different durations in five of eleven sweeps. In a
   sixth (ERCOT), no duration has a positive IRR.

### 0.4 What the plan builds

- **Part A: one duration model, inside the engine.** Each market declares how its revenue lines
  respond to duration. The engine sweeps route × duration and reports:
  - the fit,
  - the band around it,
  - the value given up at the archetype.

  The dashboards read the engine's result.
- **Part B: the paid-duration curve from the price feeds.** The executable spread at 1, 2, 4, 6 and
  8 hours, from every published price series, every month. Drift from the declared curve proposes a
  PR.
- **Part C: built and awarded duration over time.**
  - Fleet duration, from the registers the ETL already reads.
  - An award ledger, one row per programme round.
- **Part D: drivers, tipping points and a house view.**
  - A driver table per market.
  - The input value at which the fit would change.
  - A `design` section in the view store, whose trend your rules may move.
- **Part E: the pages.**
  - A design-fit table on `/returns`.
  - Three cards in each market's duration section.

---

## 1. What the platform holds today

### 1.1 The engine: one archetype, four routes

| Market | Archetype | Base route | Routes declared |
|---|---|---|---|
| GB | 4h | `cap` | cap, mer, toll |
| DE | 4h | `mer` | mer, toll |
| IT | 4h | `cap` | cap, mer, toll, ltda |
| NEM | 4h | `ltda` (CIS) | mer, toll, ltda |
| WA | 7h | `cap` (RCM) | cap, mer |
| ERCOT | 2h | `toll` | mer, toll |
| CAISO | 4h | `cap` (RA) | cap, mer |
| PJM | 4h | `cap` | cap, mer |
| JP ×3 | 6h | `ltda` | cap, mer, ltda |
| PL | 4h | `mer` | cap, mer |
| IE | 4h | `cap` | cap, mer |
| RO | 2h | `mer` | mer |
| FI | 2h | not in the engine | — |

Three points matter for this plan:

- **`archetype.durationHours` and `baseStrategy` are methodology** in `src/governance/authority.js`.
  No machine may write or propose either one. The plan keeps it that way (§4.4).
- **The engine can already price capex at any duration.** `buildCapex(stack, hours)` scales the
  energy components with kWh. Today, though, `capitalOf` scales the stack back to `capexPerMW`,
  which is right only at the archetype. A sweep has to let the stack total stand instead.
- **One field exists but is unused.** `economics.ltda.minDurationHours` is classified in
  `authority.js`, but no market declares it.

### 1.2 The dashboards: a second model, and what it says

Every dashboard on the shared block engine except Finland's carries a duration section. It holds:

- `deratingCurve`, `durSpreadFactor` and `durConfigs`;
- in most of them, a hand-written `marginalHour` waterfall;
- a `durFactors` scorecard (the Duration-Need Index);
- in six of them (GB, IE, PL, RO, NEM and Japan), a card drawn by `blkLabDuration` that shows NPV
  by duration.

The model behind that card is the prototype's `labModel`, not the engine. It discounts at a
market-specific rate over its own life (often 20 years). The engine prices 15 years at
stream-specific exit yields.

Run on each market's own seed on 2026-10-15:

| Market | Archetype | Sweep's best by NPV | Sweep's best by IRR | Card published? | What decides it |
|---|---|---|---|---|---|
| GB | 4h | **6h** (£226k/MW; 4h £205k) | 4h (10.7%) | yes | De-rating of 0.45 at 4h and 0.63 at 6h. The engine carries 0.38 at 4h |
| IE | 4h | **2h** | **2h** | yes | Seed energy capex of €250/kWh |
| PL | 4h | 4h | **2h** | yes | De-rating of 0.65 at 4h. The auction applied 13.39% flat |
| RO | 2h | **1h** | 2h | yes | Every duration is NPV-negative |
| DE | 4h | **10h** (€1,591k/MW) | **10h** | no | StromVKG priced at its €244/kW cap |
| IT | 4h | 4h (2h within 2%) | **2h** | no | Prices the capacity route, not MACSE |
| NEM | 4h | 4h (6h within 2%) | **6h** | yes | Every duration is NPV-negative |
| PJM | 4h | 4h | 4h | no | Every duration is NPV-negative |
| ERCOT | 2h | **1h** | no positive IRR | no | Merchant only. Every duration is NPV-negative |
| CAISO | 4h | 4h | 4h | no | RA credit capped at four hours |
| JP (Tokyo) | 6h | **1h** | **1h** | yes | The annual Capacity Market route at ¥60,000/kWh |

Bold marks an answer that differs from the archetype.

**The levels are not the point; several seeds are illustrative. The instability is.** The same
platform underwrites GB at 4h on the league table and prints 6h as the best NPV on the GB dashboard.
It underwrites Japan at 6h and prints 1h.

**Germany shows why the route has to be explicit.** On the dashboard's seed:

- With no capacity revenue, NPV rises with duration to 8h (€503k/MW).
- 10h overtakes the best shorter build once StromVKG clears above about **€10.9/kW-yr de-rated**,
  which is 4% of the €244 cap.

GB shows the same thing on its own seed: 6h beats 4h at any T-4 price above about £14.71/kW-yr.
These are tipping points, the quantity Part D makes standard. Each one rests on an illustrative
capture curve, which Part B replaces with measured ones.

### 1.3 What is observed and what is seeded

**Price snapshots.**

- Published: WA (WEM energy reference prices) and the three JEPX areas, twelve months each, to
  11–13 October 2026.
- ENTSO-E (GB, IE, RO, PL, FI) has no snapshot, because no token is configured.
- DE, IT, NEM, PJM, ERCOT and CAISO have no price feed at all.

**Duration in the spread figures.** `derivePriceMetrics` computes the spread at the archetype's
duration only.

**Registers with MWh.**

- `etl/sources/mastr.mjs` (Germany, manual export) and `etl/sources/aemo-generation-information.mjs`
  (NEM and WEM) carry MWh. So `durationHours` is set wherever those sources publish energy.
- `etl/sources/eia-860m.mjs` has no MWh.
- The NESO TEC register has no duration field.
- OSM covers Ireland.

**Duration evidence.** `src/home/valueDriverData.js` registers duration evidence for one market (WA,
7h). The other seven carry the gap "No official like-for-like market duration series is registered".

**The duration scorecards (`durFactors`)** are the last weighted 0–3 scorecards on the dashboards.
The score-table retirement left them out of scope (that plan's decision 5).

---

## 2. What "best fit" should mean

### 2.1 A design is a route and a duration together

The route sets the rule each extra hour is paid under:

| Market | Route | Rule for the next hour |
|---|---|---|
| Japan | LTDA | Nothing below 6h. The award claws back about 90% of other-market profit |
| Germany | StromVKG | Nothing below 10h, plus 92% round-trip efficiency and 100% availability |
| Italy | MACSE | Paid per MWh-year, so every hour is paid |
| Italy | Capacity Market | Paid per de-rated MW: 0.67 at 4h, 0.90 at 8h |
| CAISO | RA | Credit stops at four hours |
| PJM | BRA | ELCC by class: 4h 59%, 6h 68%, 8h 71%, 10h 78% |
| WA | RCM | Credits de-rate linearly below the ESR duration requirement |
| Poland | Capacity Market | Same factor at every duration |
| ERCOT | Toll | Priced at the quoted duration; the only published quote is 2h |
| Every market | Services | Bought in MW, so the next hour earns nothing, except where a product needs hours to qualify (ERCOT Non-Spin, 4h) |

### 2.2 Which number picks the design (decision 1)

- **(a) Value per MW of connection, at the platform's own yields. Recommended.** Discount each
  revenue stream at the exit yield `assumptions.js` already applies to it, then subtract net capital.
  - The yields are 6.5% secured, 10.5% merchant and auction-renewal, and 7% opex.
  - No new discount rate is introduced. Discount rates stay human-only.
  - A contracted MWh is worth more than a merchant one, exactly as the rest of the platform prices
    it.
  - Per MW, because in most of these markets the connection is the scarce, slow and irreversible
    input.
- **(b) Value per unit of capital.** The $1M engine's lens. It favours shorter durations wherever
  capex per MW is lower. Shown beside (a), not used to pick.
- **(c) Hold IRR.** What the league table ranks. It rewards a small capital base, which is why it
  disagrees with NPV in five of eleven sweeps. Shown, not used to pick.

### 2.3 A band, not a point

The fit is the best design. **The band is every duration whose value lies within a tolerance of the
best.**

- Proposed tolerance: 2% of the archetype's net capital per MW. A percentage of value fails when
  every design destroys value, as six of the eleven sweeps do.
- The tolerance is methodology and yours to set.
- An archetype inside the band is never flagged. NEM 4h against 6h is the case this exists for.

### 2.4 A duration floor has to hold for the term, not just at COD (decision 6)

Under your ruling of 2026-10-12 there is no augmentation cost, so capacity fades (2%/yr seed). A
scheme that pays only above a duration floor therefore has to be tested on usable duration at the
end of the term:

| Scheme | Floor | Term | Usable at end of term from a build at the floor | Build needed to hold the floor |
|---|---|---|---|---|
| WA RCM (ESR) | 7h | 10-yr election | 7 × 0.98⁹ = **5.84h**. Credits fall to 83% if fade counts | 7 ÷ 0.8337 = **8.4h** |
| Japan LTDA | 6h | 20 yr | 6 × 0.98¹⁹ = **4.09h** | 6 ÷ 0.6812 = **8.8h** |
| Germany StromVKG | 10h | 15 yr | 10 × 0.98¹⁴ = **7.54h** | 10 ÷ 0.7536 = **13.3h** |
| Italy MACSE | per MWh | 15 yr | — | The scheme's own oversizing obligation: 18% at 8h across the term, per the IT dashboard |

The WA dashboard already recommends "an 8-hour minimum design" for 2028–29 COD. It reaches that by a
different route, and the agreement is reassuring.

How each scheme actually measures fade is a research gate (DG-5). The answer moves the fit
materially, which is why this is a decision rather than a default. The augmentation ruling stands:
this test sizes the build and adds no augmentation cost.

### 2.5 What the fit is not

- **Not a grade, not a verdict, and not the archetype.** The archetype stays methodology. Moving it
  stays your decision, as GB's 2h → 4h and Japan's 4h → 6h were.
- **Not per investor.** The verdicts already say which investor can reach which route. A fund that
  needs a secured route reads the best duration within the secured routes.

---

## 3. Trends and their drivers

### 3.1 Three signals

- **Built.** What the operating fleet holds: Σ MWh ÷ Σ MW, quarterly, with the share of MW whose
  MWh is known. This is the lagging signal.
- **Awarded.** What contracts and auctions buy: the MWh-weighted duration of each programme round.
  It leads the fleet by two to four years.
- **Paid.** What the rules and prices reward for the next hour:
  - accreditation by duration, by vintage;
  - duration floors, by vintage;
  - the capture curve from published prices, over a rolling twelve months.

  The engine turns these into the fit.

### 3.2 Market by market

| Market | Built | Awarded | Paid | Reading |
|---|---|---|---|---|
| **GB** | Fleet 6.8 GW / 11 GWh = 1.62h at end-2025, from 1.2h in 2022 [1]. The repository carries 1.7h | T-4 2029/30 new build: 2h 431 MW, 4h 224, 5h 273, 8h 70. That is 3,683 MWh ÷ 998 MW = **3.7h** [2]. LDES window 1, minded-to on 26 June 2026: 7,645 MW / 136.9 GWh = **17.9h**, 8–22h, 11 of 16 lithium-ion [3] | De-rating by duration (gate G1). Factors fell, and NESO's panel wants empirical data [4]. T-4 cleared £27.10 | Two tiers: 4–5h for capacity and trading, 8h and longer under cap-and-floor. 1–2h is squeezed |
| **DE** | About 1.5h at end-2025, 1.67h in 2026. 4h is 27 MW (<1%) [5] | 4h is 63% of scheduled 2028 additions. More than 3 GW of projects above 2h registered since 2024 [5]. StromVKG round: 4.5 GW, 10h minimum | Modo, 2026 COD: 4h at 13.7% unlevered IRR against 2h at 12.2%, on capex of €935k against €700k/MW [6] | 2h → 4h now. 10h is a separate class if StromVKG clears |
| **IT** | — | MACSE 1: 1,491 MW / 9,968 MWh = **6.68h**. Signed tolls index on 4h | Capacity Market de-rating 0.67 at 4h, 0.90 at 8h. 0.53 proposed at 4h for DY2028. MACSE 2 on 24 Nov 2026, cap €27,000/MWh-yr | Two machines: a 4h market asset and a 6–7h MACSE asset |
| **NEM** | 7,960 MW / 18,961 MWh = 2.38h (June 2026). Projected above 3h by 2029 | CIS Tender 3: 4.13 GW / 15.37 GWh = **3.7h** [8]. Tender 8 (24 June 2026): 4.2 GW / 16.1 GWh = **3.8h** [7]. NSW's share is reported at 830 MW / 2,270 MWh = 2.7h; the state figures sum to 15.6 GWh, not 16.1 | 4h captures 96% of 2h $/MWh. GenCost 2025-26: 4h A$385/kWh, 2h A$525/kWh | 4h is the standard. The premium erodes as the fleet lengthens |
| **WA** | Fleet ≤2h 220 MW, 4h 905 MW, 6h 150 MW (seed) | WA CIS Tender 6: 482 MW / 3,683 MWh = **7.6h** [9] | ESR duration requirement 4h → 6h → 7h. The 2026 ESOO, published 23 June 2026, set 7h [10] | Rule-driven and still rising. A submission expects further increases as storage connects [10] |
| **ERCOT** | 1.5h → 1.65h during 2025. 4.2 of the 6 GW added in 2025 were 2h. Only 112 MW above 2.5h was commissioned [11] | Named 4h tolled assets: Ferdinand 200 MW / 800 MWh, Padua 2 150 MW / 600 MWh (2026), Alamo City 120 MW / 480 MWh (2027) [11] | RTC+B cut ancillary duration requirements to 0.5–1h (Non-Spin stays at 4h). TB2 is the benchmark | 2h merchant. 4h when tolled |
| **CAISO** | About 3.8h at end-2025 [12] | First 8h IRP project (Tumbleweed) completed, per a CPUC release of 25 June 2026 [12] | RA credit capped at 4h. Slice-of-day since 2025. D.26-07-008 adds foldback (2027) and UCAP (2028). LDES counting is open in R.25-10-003 [12] | Fixed at 4h by the counting rules. 8h through procurement |
| **PJM** | — | ELCC class moves are visible in FERC filings [13] | ELCC 2028/29: 4h 59%, 6h 68%, 8h 71%, 10h 78%. 4h was 92% in 2024/25 [13] | The curve keeps 6h within reach. Regulation is saturating |
| **JP** | No complete public queue | LTDA round 3 (13 May 2026): about 1.25 GW of storage (551 MW lithium-ion, 699 MW other). Battery bids fell from about 7 GW to 2.73 GW after the 6h floor [14] | Floor of 6h. JEPX: 6h keeps 87–89% of the 4h ¥/MWh (§3.3) | Duration is set by the scheme, not by price |
| **PL** | — | December 2025 auction: about 685 MW de-rated against about 5.1 GW physical [15] | KWD 13.39%, applied uniformly across durations. Obligations expected to be deliverable for four hours [15] | The capacity line stopped paying for hours. Base route is already `mer` |
| **IE** | About 1 GW, built for DS3 services | T-4 2029/30 at €135.50/kW | De-rating 0.66 at 4h, 0.89 at 8h. DS3 → FASS, long-stop 30 Sep 2027 | Lengthening as services saturate |
| **RO** | About 2 GW expected operational by end-2026, from a pipeline above 9 GW | — | FCR about €70/MW/h, saturating. 2025 day-ahead daily spread peaked at €168/MWh. Double charging removed in 2025 | 2h → 4h as FCR goes |
| **FI** | About 1,050 MW, overwhelmingly 2h | Optimiser floors (practitioner input) | Fast reserves of about 795 MW against the connected fleet. 15-minute MTU since October 2025 | 2h. Watch saturation |

### 3.3 What the published prices already say (WA and Japan)

Method:

- Best contiguous charge window, then a later contiguous discharge window, each local day.
- Perfect foresight, one cycle a day.
- 12 months to 11–13 October 2026.
- The functions the platform already ships.

**Western Australia**, WEM energy reference prices (A$/MWh), margin at 88% round-trip efficiency:

| Hours | Spread | Margin | Per MW-yr (one cycle a day) |
|---|---|---|---|
| 2 | 79.5 | 70.2 | A$51k |
| 4 | 60.1 | 50.2 | A$73k |
| 6 | 48.6 | 38.2 | A$84k |
| 7 | 43.7 | 33.0 | A$84k |
| 8 | 38.3 | 27.3 | A$80k |

**The seventh hour earns nothing from prices.** WA's 7h is bought for the ESR requirement. This
confirms, with data, the WA dashboard's own line: "a rules-and-physics case, not yet a price case".

It also opens a question. The engine's WA `merchGross` seed is **A$139k/MW-yr at 7h**, against
A$84k here. Some of the gap could come from:

- five-minute prices;
- a second daily cycle;
- co-optimisation with FCESS.

None of these is measured. Research gate DG-7.

**Japan**, JEPX (¥/MWh). Capture relative to 4h, contiguous windows:

| Hours | Tokyo | Kyushu | Hokkaido | Dashboard seed |
|---|---|---|---|---|
| 1 | 1.35 | 1.17 | 1.26 | 1.25 |
| 2 | 1.19 | 1.11 | 1.15 | 1.15 |
| 6 | 0.87 | 0.89 | 0.88 | 0.85 |
| 8 | 0.72 | 0.73 | 0.73 | 0.72 |

The seed matches what JEPX paid. **Price shape is not why Japan's fit is 6h. The LTDA floor is.**
Kyushu's curve is the flattest of the three areas.

### 3.4 The drivers, and the engine input each one moves

| # | Driver | Pushes | Measured by | Engine input it moves | Binds now in |
|---|---|---|---|---|---|
| 1 | Accreditation by duration | Longer where the curve is steep; nothing where it is flat | Official de-rating, ELCC, NQC and KWD tables, by vintage | `durationResponse.capacityDerating` | GB, IE, IT, PJM; CAISO caps it; PL flat |
| 2 | Duration floors in contracted schemes | A step to the floor, plus a buffer (§2.4) | Scheme rules, by round | `durationResponse.routeRules.<route>.minHours` | JP, WA, DE, GB LDES |
| 3 | Payment basis: per MW or per MWh | Per MWh pays every hour | Scheme rules | `routeRules.<route>.basis` | IT MACSE |
| 4 | Price shape: trough and peak length | Longer as solar grows | Capture curve from price feeds (Part B) | `durationResponse.merchantCapture` | NEM, CAISO, JP, DE, IT South |
| 5 | Ancillary saturation | Removes the short-duration premium | Procured MW ÷ competing fleet MW | `economics.services` and its curve | DE, IE, RO, FI, ERCOT, PJM (GB done) |
| 6 | Marginal-hour cost | Longer as cells fall | Energy-scaling capex per kWh | `capexStack.dcBlockPerKWh` and the energy share of BOP and EPC | Everywhere (gate G24, DG-3) |
| 7 | Connection scarcity and per-MW charges | More MWh per scarce MW | Queue size, connection charge per MW | Power-scaling capex, entry ledger | DE (BKZ), GB, PJM |
| 8 | Fleet cannibalisation | Erodes the next hour's premium | Fleet duration against the fit (Part C) | `merchantCapture`, by vintage | NEM (NSW), GB |
| 9 | Offtaker specification | Sets a duration for the route | Announced tolls and floors, by duration | `toll`, only at its quoted duration | ERCOT, DE, IT, NEM |
| 10 | Stress-event length, thermal retirement | Longer accreditation over time | ESOO ADG, NESO ECR, PJM ELCC studies | De-rating vintages | WA, GB, PJM |
| 11 | Network tariffs on charging | Changes cycling economics | Tariff rules | Merchant net, opex | RO (removed), DE (AgNes from 2029) |
| 12 | Fade without augmentation | Oversizing against floors | Warranty or degradation curve | §2.4 test | WA, JP, DE, IT |

### 3.5 What it means for a design decision

- **Build to what is paid at COD,** plus the fade buffer where a floor must hold for the term. Do
  not build to what the fleet holds.
- **Where the next step is dated** (ESR, LTDA rounds, StromVKG), the cheap hedge is the right to add
  energy later:
  - a connection agreement sized for more MWh than are built;
  - permits sized the same way.

  The NEM and Japan dashboards' augmentation-readiness lists already name the items. Expansion for a
  rule step is not the augmentation your ruling excludes.
- **Where duration is a route choice** (ERCOT, Italy, Japan, Germany), choose the route first. The
  duration follows from it.
- **Where services still dominate** (ERCOT, Finland and Romania today), the short asset earns most
  now and loses most as they saturate. The decay curve decides the case, not the level.

---

## 4. How the platform captures it

### 4.1 Part A: one duration model, inside the engine

Each market declares a `comparison.durationResponse` beside `economics` and `ranges`:

```js
durationResponse: {
  hours: [2, 4, 6, 8],                              // the sweep; must contain the archetype
  capacityDerating: {                               // official table, by vintage
    vintage: 'T-4 2029/30',
    table: { 1: 0.10, 2: 0.21, 4: 0.38 },           // a point not published is not invented
    source: '…', gate: 'G1',
  },
  merchantCapture: { 2: 1.19, 4: 1.00, 6: 0.87, 8: 0.72 },   // $/MWh relative to the archetype
  servicesBasis: 'power',                           // flat in MW, or a step table by hours
  routeRules: {
    ltda: { minHours: 6, holdForTerm: true, basis: 'kW' },
    toll: { quotedHours: 4 },                       // priced only where quoted
  },
  opexEnergyShare: 0.5,                             // LTSA and warranty scale with MWh (DG-4)
}
```

The engine gains `sweepDesign(market)` and `fitOf(market)`. For every supported route and every
declared hour, the sweep returns:

- capital;
- the year-1 revenue lines;
- value per MW (decision 1);
- value per unit of capital;
- hold IRR, MOIC and secured share;
- eligibility, with the reason when a design is ineligible.

`fitOf` returns:

- the best design;
- the best duration on each route;
- the band;
- the value given up at the archetype;
- which points rest on a seed rather than on a published figure.

How each line moves with duration:

- **Capex.** `buildCapex(stack, h)`: energy parts scale with kWh, power parts stay per MW. Off the
  archetype, the stack total replaces `capexPerMW` instead of being scaled to it.
- **Capacity.** Price × derating(h), from the vintage table. An unpublished point is carried as a
  badged seed, never interpolated silently. `interp()` clamps at the lowest point, which is why PJM's
  sweep starts at 4h.
- **Merchant.** `merchGross × (h / h0) × merchantCapture(h)`. The level stays calibrated to the
  archetype's observed figure; only the shape comes from the curve. This also removes the lab's
  assumption that cycles per day do not change with duration.
- **Services.** Flat in MW, or a step table where eligibility depends on hours (for example ERCOT
  Non-Spin at 4h).
- **Toll.** Priced only at its quoted duration. Elsewhere the cell reads "no quotation", never an
  extrapolation.
- **Long-term award.** Eligibility from `minHours`, tested at the end of the term when
  `holdForTerm` is set (decision 6). Paid per kW or per kWh according to `basis`.
- **Opex.** `opexPerMW × ((1 − s) + s × h / h0)`, where `s` is `opexEnergyShare`.

**The proof is parity.** At the archetype duration and the base route, the sweep reproduces the
league table to the bit, for every market. That is the same proof that carried the refactor and the
capex stack.

**Dashboards (decision 2).** The NPV-by-duration card and the marginal-hour waterfall read the
engine's sweep; the waterfall becomes computed rather than hand-written. `labModel` stays for the
portfolio and DSCR screening it still does. The `durFactors` scorecards are replaced by Part D's
driver table, which is measured where the scorecard was scored.

### 4.2 Part B: the paid-duration curve from the price feeds

- **A pure function.** `durationCurve(series, { timezone, hours, roundTripEfficiency })` in
  `src/derive/`, built on `meanDailyExecutableSpread`. For each duration it returns:
  - the contiguous spread and margin;
  - the number of full local days;
  - capture relative to the archetype.
- **Published automatically, as derived-observed data.** It goes into each feed's summary on every
  run, over a rolling twelve months, and `/data` shows it.
- **Drift proposes, and never applies.** When observed capture departs from
  `durationResponse.merchantCapture` beyond a materiality threshold for two months running,
  `etl/propose.mjs` opens an evidence-backed PR. It is never auto-merged. The threshold goes in
  `src/governance/materiality.js` and is yours.
- **Coverage.**
  - Live today: WA and the three JEPX areas.
  - GB, IE, RO, PL and FI once `ENTSOE_TOKEN` is configured.
  - Decision 5 adds NEMWEB (NEM, no key), CAISO OASIS (no key), and DE-LU plus the Italian zones in
    the ENTSO-E connector's `DOMAIN` table (FI is already in it).
- **The label states the limits.** The curve is built from day-ahead or reference prices, with
  perfect foresight and one cycle a day. It is a shape, not a revenue; the level stays yours.
  Intraday and balancing shape is DG-8.

### 4.3 Part C: built and awarded duration, over time

**Fleet duration.**

- `fleetDuration(projects, { asOf })` beside `fleetTotals` in `src/projects/clusters.js` returns
  Σ MWh ÷ Σ MW over operating records with a published MWh, plus its coverage. It never imputes a
  duration.
- The ETL writes a quarterly history per market from each register refresh: MaStR for Germany, AEMO
  Generation Information for the NEM and WEM, OSM for Ireland.
- The US joins only if the EIA-860 annual Energy Storage schedule carries MWh. EIA's notice lists
  "nameplate energy capacity (MWh)" among its storage data elements [17], while
  `etl/sources/eia-860-enrichment.mjs` says neither form has it. Gate DG-2.

**Award ledger.**

- `etl/manual/duration-awards.csv` feeds `etl/sources/duration-awards.mjs`, which publishes
  `public/data/public/duration-awards.json`.
- One row per programme round. Each row records:
  - market, programme, round, result date and route;
  - MW, and MWh or a duration class;
  - basis (nameplate, de-rated or connection);
  - source URL, access level and a quotation.
- You write the rows (a manual input, as the MaStR export is), and validation publishes them. The
  seed rows are the rounds in §3.2.

**Rule vintages.** Accreditation tables and duration floors live in `durationResponse` under a
vintage label. The scout agent's monthly pass reports any new vintage it finds, running dry on core
markets.

### 4.4 Part D: drivers, tipping points and the house view

- **A vocabulary.** `src/governance/durationDrivers.js` holds the twelve drivers of §3.4 (ids,
  labels, and the engine input each one moves). It is methodology.
- **Per-market readings.** `durationResponse.drivers` records each driver that binds:
  - its indicator, where a series exists;
  - its mapped input;
  - today's value.

  This is analyst-class.
- **Tipping points.** For each driver mapped to an input, the engine finds by bisection the value at
  which the fit changes, and reports the distance from today. The Germany and GB figures in §1.2
  are the first two. They are computed on the market page only, for cost.
- **A house view, `design` (decision 3).** A new view-store section:
  `{ route, hours, band, trend: lengthening | stable | shortening, cause: <driver id>, reason, evidence, asOf, author }`.
  - You write the design.
  - A rule (a trigger with an effect, written by you in advance) may move `trend` and `cause` only.
    That is the scope the first data rule had in phase 3.
  - The agent stays dry.
- **First triggers.**

  | Market | Trigger | Kind |
  |---|---|---|
  | DE | StromVKG result above the 10h tipping price | event |
  | IT | MACSE 2 awarded duration at or above 6h | event, 24 Nov 2026 |
  | WA | ESR duration requirement at or above 8h in the next ESOO | event |
  | PJM | The 6h ELCC exceeds 4h by 10 points or more for the next BRA | event |
  | PL | Storage KWD published by duration | event |
  | CAISO | LDES accreditation adopted under slice-of-day | event |
  | ERCOT | 4h above 25% of quarterly commissioned MW | data, once Part C covers the US |
  | NEM | Fleet duration at or above 3.0h | data, from AEMO Generation Information |
- **The digest.** The monthly digest issue gets one line per market where the computed band excludes
  the house design or the archetype, two months running. Nothing else acts on it.

### 4.5 Part E: where a reader sees it

**`/returns`, after the $1M engine: a "Design fit" section.** One row per market:

- the modelled design;
- the computed fit and band;
- the value given up at the archetype;
- built, awarded and paid;
- the house design and its trend;
- the top driver and its distance to the tipping point.

Beside the table, small multiples of value against duration, with the archetype and the fit marked.

**Each market's Revenue & Design → duration section: three cards.**

1. Fit by route, from the engine.
2. Built, awarded and paid, over time.
3. Drivers, with their tipping distances.

They replace the prototype NPV card and the scorecard (decision 2).

**Elsewhere.** `/changes` lists design changes like any other change. `/data` lists the new feeds.

---

## 5. Who may change what

| Thing | Where it lives | Class | Who changes it |
|---|---|---|---|
| Duration curve from prices | Feed summaries | derived-observed | ETL, every run, after validation |
| Fleet duration | `public/data/public/` | derived-observed | ETL, from each register refresh |
| Award ledger rows | `etl/manual/` → snapshot | observed | You write them; validation publishes |
| `durationResponse` curves, floors, opex share, driver readings | `comparison.js` | analyst | Automation may propose on drift; never applies |
| `durationResponse.hours` (the sweep grid) | `comparison.js` | methodology | You |
| Fit, band, tipping points | Engine, at render | model output | Recomputed on approved assumptions |
| Fit tolerance; trend and drift thresholds | `assumptions.js`, `materiality.js` | methodology | You |
| Driver vocabulary | `src/governance/durationDrivers.js` | methodology | You |
| House design (route, hours, band) | `view/markets/*.json`, `design` | view | You |
| Design trend and cause | Same | view | You, or a rule you wrote. Agent dry |
| Archetype duration, base route | `comparison.js` | methodology, unchanged | You |

**Rights tables this touches.**

- `authority.js`:
  - new `COMPARISON_AUTHORITY` rows for `durationResponse.*`;
  - `design` in `VIEW_AUTHORITY`;
  - two `METHODOLOGY_SURFACES` entries.
- `view/schema/view.mjs`: the `design` section and its rights.

Under the standing instruction, neither is edited without your decision in terms. That is decision 3.

**Cadence is unchanged.**

- The ETL keeps its six-hourly refresh and asks no model.
- Model-driven scheduled runs stay monthly, under your ruling of 2026-10-12.
- A run you dispatch by hand is never limited.
- Nothing reads `local-data/`.

---

## 6. Values I propose to correct in Part A, with derivations

These move the dashboards' duration cards only. The engine already carries the right values, so the
league table and `tests/current-model.test.js` do not move.

| Market | Field | Now | Proposed | Derivation and source |
|---|---|---|---|---|
| PL | Dashboard `deratingCurve` | 1h 0.22 … 4h 0.65 … 8h 0.89 | 0.1339 at every duration | URE final results, 2030 delivery year (December 2025): storage KWD 13.39%, reported as applied uniformly across durations [15]. The engine already carries 0.1339. Gate DG-1 confirms it against the PSE parameters |
| PL | `marginalHour` "correction-factor uplift (0.40 → 0.65)" | +€15k | 0 | Follows from the row above. The net marginal value of hours 3–4 falls from +€6k to −€9k |
| GB | Dashboard `deratingCurve[4]` and its vintage table | 0.45 | 0.38 | The engine's value: interpolated from NESO's 1h 10.47% and 2h 20.94%. The trade press reports 30–40% for 4h [2]. Gate G1 stays open for the published factor |
| GB | Lab seed `hours` | 2 | 4 | The archetype since 2026-07-30 |
| JP | `durationPath.hours` | 4, 4, 4, 4.5, 4.5 | 6 throughout | LTDA round 3: below 6h is ineligible [14]. Archetype 6h since 2026-07-30 |

These are flagged for your review, not proposed:

- **Ireland.** The dashboard's sweep picks 2h against a 4h archetype, driven by a seed energy capex
  of €250/kWh.
- **WA merchant level.** See §3.3 and DG-7.
- **WA's buffer.** The comparison note argues 7h = a 6h window plus 17%. If the 7h ESR requirement
  is the one the archetype bids into, that buffer is zero. See DG-6.

---

## 7. Research gates this opens

| Gate | Question | Why it matters |
|---|---|---|
| G1 (existing) | GB de-rating factors by duration, T-4 2029/30 and 2030/31 | Decides GB 4h against 5–6h |
| DG-1 | Does Poland's 13.39% KWD apply to every duration, and is delivery tested over four hours? | Decides whether Poland's capacity line pays for hours at all |
| DG-2 | Does the EIA-860 annual Energy Storage schedule carry MWh (EIA's layout file)? | An official US fleet duration, and a correction to a connector comment |
| DG-3 | The energy-scaling share of installed cost, by market | BNEF's 2025 turnkey prices imply about $96/kWh of energy and $56/kW of power, so power is about 13% of a 4h system [16]. The platform's global split puts BOP and EPC on the power side, at about 36–44%. The duration answer is more sensitive to this than to any revenue line. Extends G24 |
| DG-4 | The share of fixed opex that scales with MWh (LTSA and warranty extension) | No public source. Proposed placeholder 0.5, badged |
| DG-5 | How WA's RCM, Japan's LTDA, Germany's StromVKG and Italy's MACSE treat fade against their floors | §2.4. Moves fits by 1.4–3.3 hours |
| DG-6 | Is the 2026 ESOO's 7h requirement the one the WA archetype's cycle bids into? | Whether the archetype has any buffer |
| DG-7 | WA `merchGross` A$139k/MW-yr against A$84k on published prices | A 65% gap on a seed |
| DG-8 | Capture curves in intraday and balancing (GB BM, DE intraday, IT MSD) | Day-ahead shape may understate short duration's value. Modo's German 1h/2h/4h benchmarks (May 2026) are a cross-check |
| DG-9 | A toll price at any duration other than ERCOT's quoted 2h | Without one, the toll route is priced at one point only |
| DG-10 | CAISO's D.26-07-008 haircuts, and LDES accreditation under slice-of-day | The size of CAISO's RA line at 4h and above |
| DG-11 | StromVKG's first clearing price | Sets Germany's 10h tipping point |
| DG-12 | Per-project durations in CIS Tender 8, and any duration minimum it set | The headline totals give 3.8h, and the state figures do not sum |
| DG-13 | A published expected-capacity factor for a six-hour battery in Japan's Capacity Market (opened 2026-10-15, §15) | The engine carries the 4h factor, 0.70, at the 6h archetype; until this closes the route is swept at 6h only |

**Closed on 2026-10-15 from opened primary sources:** G1, DG-1, DG-2, DG-5 and DG-6. The answers
and quotations are in `docs/duration-and-route-fit-research-gates.md`; what they changed is in
§15.

---

## 8. Order of work and pull requests

| # | Contents | Moves a published number? | Sign-off |
|---|---|---|---|
| 1 | Part A engine: `durationResponse` (values moved over unchanged where dashboard and engine agree), `sweepDesign`, `fitOf`, parity tests | No | This plan; decisions 1 and 6 |
| 2 | §6 corrections; dashboards read the engine; scorecards → driver table | The duration cards only | §6; decision 2 |
| 3 | Part B duration curve in feed summaries, and drift proposals | No; adds derived figures | Decision 5 for the new feeds |
| 4 | Part C fleet duration and award ledger, seeded from §3.2 | No; adds observed figures | This plan |
| 5 | Part D vocabulary, tipping points, view `design` section, triggers, digest line | No engine number; adds view content | Decision 3, which touches rights tables |
| 6 | Part E pages | Adds sections | This plan |

Every PR ends at a state worth stopping in. PRs 1 and 3 can run in parallel; 5 needs 1.

---

## 9. Tests

**New.**

| File | What it asserts |
|---|---|
| `tests/design-fit.test.js` | Parity at the archetype and base route, for every market. Eligibility gates (a 4h LTDA case is ineligible). Tolls unpriced off their quoted duration. Capex at any duration from the stack. The band tolerance |
| Duration-curve tests | Capture at the archetype is 1. Agreement with `meanDailyExecutableSpread` at every duration. Grouping by local day (Japan) |
| Fleet-duration tests | Coverage is reported, and a missing MWh never becomes a duration |
| Award-ledger schema tests | Source and access are required. MWh or a duration class is required |

**Changed.**

- `tests/governance.test.js`: every new comparison field is classified; the `design` rights hold;
  no agent may write `design.route` or `design.hours`.
- Dashboard and print snapshots that pin the duration cards change in PR 2, by the values in §6.
- `tests/bundle-budget.test.js`: the sweep goes in the `/returns` chunk.

**Untouched.** `tests/baseline.test.js` and `tests/current-model.test.js`. PR 1 must keep both green
bit for bit.

---

## 10. What this plan does not do

- **Co-location and hybrids are recorded, not priced.** This covers a connection shared with solar
  or wind: Germany's Innovationsausschreibung, Italy, Japan's FIP retrofits, US hybrids. They go into
  the award ledger and the driver table. Pricing them needs a second revenue model and a plan of its
  own.
- **Grid-forming, system-strength and congestion-relief contracts** are treated the same way. 74% of
  the NEM's announced pipeline features grid-forming inverters. Congestion stays at zero modelled revenue (gate G14).
- **Per-investor fits.** §2.5.
- **Augmentation.** Your ruling of 2026-10-12 stands. §2.4 sizes a build against a floor and adds no
  augmentation cost.
- **Changing any archetype.**

---

## 11. Decisions this needs from you

1. **The objective.** Value per MW of connection at the platform's own exit yields (recommended),
   value per unit of capital, or hold IRR.
2. **One duration model.** The dashboards read the engine's sweep and the `durFactors` scorecards
   become the measured driver table (recommended), or both models are kept side by side.
3. **A house view of the design.** A `design` section in the view store, where your rules may move
   only its trend and cause. The archetype stays methodology, and divergence goes to the digest
   (recommended). The alternative is the computed fit with no house view.
4. **Scope.** The four existing routes × duration now, with co-location and grid-forming recorded
   but not priced (recommended), or co-location priced now.
5. **New feeds.** NEMWEB and CAISO OASIS now, plus DE-LU and the Italian zones in the ENTSO-E
   connector (recommended), or the existing feeds only. Separately: the ENTSO-E token, which needs
   you to email their service desk, is what lights up GB, IE, RO, PL and FI.
6. **Duration floors held for the term.** Tested at the end of the term under fade (recommended), or
   at COD only.
7. **The corrections in §6.**

---

## 12. Sources

Each source below was read as a search summary on 2026-10-15, not opened (access level
`search-summary`).

1. Modo Energy, GB battery buildout Q4 2025 — https://modoenergy.com/research/en/gb-battery-energy-storage-capacity-buildout-q4-2025-projections-2026-clean-power
2. T-4 2029/30 results by duration — https://www.ess-news.com/?p=8383 ; https://www.solarpowerportal.co.uk/battery-storage/neso-procures-40gw-in-t-1-auction-energy-storage-wins-6-4-of-capacity ; Modo, https://modoenergy.com/research/en/gb-capacity-market-t4-2029-30-battery-energy-storage-march-2026
3. Ofgem, LDES cap and floor window 1 — https://ofgem.gov.uk/decision/long-duration-electricity-storage-cap-and-floor-application-window-1 ; https://www.energy-storage.news/uks-ofgem-goes-big-on-ldes-cap-and-floor-window-1-18-hour-lithium-ion-among-winners/ ; https://www.energy-uk.org.uk/wp-content/uploads/2026/07/Energy-UK-Explains-long-duration-energy-storage-July-2026.pdf
4. NESO de-rating direction — https://assets.publishing.service.gov.uk/media/68762902a8d0255f9fe28e94/2025-panel-of-technical-experts-report-on-neso-ecr.pdf ; https://energy-storage.news/uk-system-operator-reassessing-outdated-capacity-market-de-rating-factors-for-storage
5. Modo Energy, Germany buildout — https://modoenergy.com/research/de-germany-bess-batteries-buildout-capacity-growth-installation-grid-scale-february-2026 ; https://modoenergy.com/research/germany-battery-buildout-report-germany-adds-888-mw-in-1h-2026-more-than-all-of-2025 ; https://modoenergy.com/research/germany-december-2025-optimal-battery-duration-analysis
6. Modo Energy, Germany outlook — https://modoenergy.com/research/fr/germany-battery-investment-outlook-q2-2026-executive-summary ; https://modoenergy.com/research/july-2026-germany-bess-forecast-update-slower-ancillary-saturation-lifts-near-term-revenues
7. CIS Tender 8 — https://www.pv-magazine-australia.com/2026/06/24/fifteen-big-batteries-secure-cis-contracts-in-latest-tender/ ; https://www.enerdata.net/publications/daily-energy-news/australia-selects-15-bess-projects-42-gw161-gwh-cis-tender-8.html ; https://www.energy-storage.news/australia-awards-4-2gw-16-1gwh-of-battery-storage-under-capacity-investment-scheme-tender-8/
8. CIS Tender 3 — https://www.energy-storage.news/?p=86673
9. WA CIS Tenders 5 and 6 — https://modoenergy.com/research/en/australia-wem-cis-tender-5-6-announced-bess-renewables-western-australia-swis
10. WA ESR duration requirement — https://www.wa.gov.au/government/document-collections/2026-benchmark-technology-review ; https://www.aemo.com.au/-/media/files/electricity/wem/planning_and_forecasting/esoo/2026/2026-wem-electricity-statement-of-opportunities.pdf ; https://www.erawa.com.au/sites/default/files/2026-benchmark-reserve-capacity-prices-2028-29-capacity-year-draft-determination-public-submission-synergy.PDF
11. Modo Energy, ERCOT buildout 2025 — https://modoenergy.com/research/ercot-battery-buildout-2025-annual-report ; https://modoenergy.com/research/ercot-battery-buildout-report-q3-2025
12. CAISO — https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-celebrates-first-long-duration-energy-storage-project-developed-under-irp-process ; https://modoenergy.com/research/caiso-battery-storage-2026-things-to-watch ; https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/resource-adequacy-homepage/oga-fact-sheet-on-track-3-decision-final.pdf
13. PJM, 2028/2029 BRA ELCC class ratings — https://www.pjm.com/-/media/DotCom/planning/res-adeq/elcc/28-29-bra-elcc-class-ratings.pdf ; FERC filing ER26-1917, https://www.pjm.com/-/media/DotCom/documents/ferc/filings/2026/20260410-er26-1917-000.pdf
14. Japan LTDA round 3 — https://www.ess-news.com/2026/05/15/japan-awards-1-25-gw-of-battery-storage-in-capacity-market-auction/ ; https://taiyangnews.info/storage/japan-awards-125-gw-battery-storage-3rd-ltda ; https://www.gtlaw.com/en/insights/2026/6/bess-and-the-japan-power-market-the-current-state-of-play-at-ltda-auction-round-3
15. Poland, December 2025 auction — https://www.energy-storage.news/?p=92398 ; https://modoenergy.com/research/poland-pl-capacity-market-bess-cm-auction-merchant-revenue-stack-battery-march-2026
16. BNEF 2025 price surveys — https://about.bnef.com/insights/clean-energy/new-record-lows-for-battery-prices/ ; https://www.energy-storage.news/?p=92133 ; https://www.ess-news.com/?p=7552
17. EIA-860 — https://www.eia.gov/electricity/data/eia860/index.php ; https://www.eia.gov/about/new/?r=3070

Repository sources: each market's `comparison.js` and `data.js`, `src/markets/decisionProfiles.js`,
`src/governance/authority.js`, `src/comparison/capex.js`, the ETL connectors named above, and the
snapshots in `public/data/public/`.

---

## 13. Sign-off (2026-10-15)

The analyst's instruction, verbatim: "Approve all seven recommendations in §11 of
docs/duration-and-route-fit-plan.md, including the §6 corrections. Start with PR 1."

So the following are decided, each as recommended:

1. **Objective.** Value per MW of connection at the platform's own exit yields.
2. **One duration model.** The dashboards read the engine. The scorecards become the driver table.
3. **House view.** A `design` section in the view store; rules may move its trend and cause.
4. **Scope.** Four routes × duration. Co-location and grid-forming are recorded, not priced.
5. **Feeds.** NEMWEB, CAISO OASIS, and the extra ENTSO-E zones.
6. **Floors.** Duration floors are tested at the end of the term under fade.
7. **Corrections.** The values in §6.

The research gates in §7 are being opened in a separate session. Its findings go in
`docs/duration-and-route-fit-research-gates.md`.

---

## 14. As built: PR 1 (2026-10-15)

Branch `claude/duration-fit-engine`. What was built:

- `src/comparison/designFit.js` (`sweepDesign`, `fitOf`, `marketAt`, `validateDurationResponse`);
- a `durationResponse` block in every priced market;
- the authority rows;
- `DESIGN_FIT_TOLERANCE = 0.02` in `assumptions.js`;
- `tests/design-fit.test.js`.

It moves no published number. `tests/baseline.test.js` and `tests/current-model.test.js` pass
unchanged, and so does the full suite.

Where it departs from §4.1:

1. **Curves are arrays aligned to `hours`.** An array is a leaf, so the governance test classifies
   each curve as one decision. The object form sketched in §4.1 would have needed a rights entry
   for every duration.
2. **Curves are shapes; the levels stay the engine's.** Every curve is read relative to its own
   value at the archetype. So the dashboard curves moved over unchanged, including GB's de-rating
   row with 0.45 at 4h, while the engine keeps 0.38. Only the row's shape is used.
   - §6's GB correction is a dashboard change and goes in PR 2.
   - Poland's flat 13.39% is declared here already, because a flat curve is the correction.
3. **The LTDA floor and term are read, not restated.** They come from
   `economics.ltda.minDurationHours` and `.years`.
4. **The build that would hold a floor is reported, not priced.** Japan needs 8.8h to hold its LTDA
   floor to year 20. The declared curve stops at 8h, and the sweep never extrapolates.
5. **Two values are new rather than moved, and need your confirmation:**
   - WA's capture curve, observed on the WEM prices to 14 October 2026;
   - WA's sweep grid, [4, 6, 7, 8, 10] (the hand-written WA dashboard had none).
6. **Found while declaring Japan.** The Capacity Market route carries the 4h expected-capacity factor
   (0.70) at the 6h archetype. That route is priced at the archetype only until the factor is put
   right, which belongs in PR 2.
7. **Two engine changes, both neutral when unused and both tested:**
   - `degradationFactor` is exported, so the floor test uses the cash flows' own fade;
   - `runCase` takes an optional per-year `capacityFactors`.

**What the sweep says today.** It is published nowhere until PRs 2 and 6. Floors are tested at the
end of the term (decision 6). Values are USD per MW at the platform's exit yields.

| Market | Archetype | Best design | Archetype in the overall band | Best on the archetype's route |
|---|---|---|---|---|
| WA | RCM 7h | RCM 7h | yes | 7h, band 7–8h |
| NEM | CIS 4h | Toll 4h | no, gives up $37k | 4h |
| GB | CM 4h | Toll 4h | no, gives up $49k | 2h, band 2–4h |
| DE | Merchant 4h | Merchant 4h | yes | 4h |
| IT | CM 4h | CM 4h | yes | 4h |
| IE | CM 4h | CM 4h | yes | 4h |
| RO | Merchant 2h | Merchant 4h | no, gives up $106k | 4h, on a seed capture curve |
| PL | Merchant 4h | CM 1h | no, gives up $289k | 1h, on a seed capture curve |
| JP ×3 | LTDA 6h | Merchant 1h | fails its floor at year 20 | none until DG-5 |
| PJM | BRA 4h | BRA 4h | yes | 4h |
| ERCOT | Toll 2h | Toll 2h | yes | 2h |
| CAISO | RA 4h | RA 4h | yes | 4h |

On its own route, the archetype sits inside the band in nine of fourteen allocation markets. The
other five each have a reason:

- **Romania.** 4h beats 2h, on a seed capture curve.
- **Poland.** Once capacity pays per MW, not per hour, the shortest build wins.
- **Japan (all three areas).** The LTDA's six-hour floor does not hold to year 20 without
  augmentation. Gate DG-5 asks whether OCCTO measures it that way.

For comparison, the dashboards' prototype sweeps disagreed with the archetype in six of eleven
markets (§1.2).

---

## 15. The research gates, the second sign-off, and PR 2 (2026-10-15)

### 15.1 What the gates reversed

The five gates were closed on opened primary sources (`docs/duration-and-route-fit-research-gates.md`).
Two of the §6 corrections you had approved rested on the search summaries and were wrong:

- **GB.** NESO's published 4h factor for T-4 2029/30 is 43.96%. The dashboard's 0.45 was close;
  the engine's 0.38, interpolated, was the outlier.
- **Poland.** The 13.39% factor is the same at every duration, but it applies to certified capacity,
  which must be deliverable for four uninterrupted hours. A battery shorter than four hours
  certifies MWh ÷ 4, so the factor is not flat across durations.

The gates also confirmed decision 6's premise: WA, Japan, Germany and Italy all measure fade
against their floors.

### 15.2 Your decisions (2026-10-15)

Asked after the gates reported:

1. **GB:** the engine's 4h de-rating moves to 0.4396, the T-4 2029/30 factor (recommended over
   2030/31's 0.4461, because that is the vintage the £27.10 price belongs to).
2. **Poland:** 0.1339 × min(1, h/4).
3. **Japan:** keep the 4h expected-capacity factor (0.70) and open gate DG-13, rather than move a
   published number on a seed.

You also confirmed the three items from §14: WA's observed capture curve, WA's grid, and Japan's
factor finding.

### 15.3 What PR 2 changes

- **GB, engine.** `capacity.derating` 0.38 → 0.4396. The capacity line moves from £10,298 to
  £11,913 per MW-yr (+15.7%). The league-table base case moves from 10.7% to 10.9% year-1 yield
  and from 4.7% to 5.1% hold IRR. `tests/current-model.test.js` is re-pinned with that derivation.
  GB stays ninth of fourteen on hold IRR.
- **GB, dashboard and P0 layer.** Both vintage rows are now NESO's published tables. The 4h P0
  value is £27.10 × 43.96% = £11,913. Two passages of GB prose said the factors fell between
  vintages and that hours beyond four pay poorly; NESO's tables show the opposite, so both were
  rewritten.
- **Poland, dashboard and sweep.** The curve is 0.1339 × min(1, h/4). The marginal-hour uplift is
  +€4k, so the net is −€5k. The 100 MW bridge now shows an obligation of about 12 MW, not 60.
  Several passages argued from the old seed (the obligation, the "binding question", the fourth
  hour) and were rewritten. They now say the capacity contract no longer pays for the fourth hour
  and the case rests on merchant and balancing revenue.
- **Japan.** The duration path is six hours throughout (§6). Gate DG-13 is named where the factor
  is declared.
- **WA.** Comments only: the buffer over the seven-hour requirement is zero (DG-6), and the ten-year
  fixed price tests a 7.5h floor.
- **The duration card (decision 2).** The six dashboards that drew the prototype's NPV-by-duration
  card (GB, IE, PL, RO, NEM, Japan) now draw the engine's sweep. Every route is shown at every
  declared duration, with the band, the modelled design, the reasons a design is unpriced or
  fails its floor, and a computed reading. `labModel` keeps the dossier and portfolio screening.
- **Bundle.** The shared market chunks' budget rises from 98 to 102 kB, for the 3.3 kB the sweep
  and the card add.

### 15.4 What was withdrawn, and what waits

- **§6's "GB lab seed `hours` 2 → 4" is withdrawn.** The GB lab's 2h is a deliberate, tested
  screening case (`tests/sponsor-alignment.test.js`: "the merchant-weighted 2h asset"). The row
  existed only so the duration card would sweep from the archetype, and the card no longer reads
  the lab.
- **Computed marginal-hour waterfalls, and the `durFactors` scorecards becoming the driver table,
  move to PR 5.** The scorecards' replacement needs the driver vocabulary that PR 5 introduces.
  The waterfalls are quoted inside several markets' prose, so they are rewritten together with
  it. Poland's scorecard still scores the correction-factor uplift 3; it is retired with the rest.
- **Not edited, for you:**
  - GB's two derived grade reasons quote the old engine: "4.7%" (now 5.1%) and "10% secured" (now
    12%). Neither grade moves.
  - Poland's dashboard capacity price seed (260 PLN/kW) still differs from the engine's 465.02.
  - Italy's 1.1%/yr degradation seed is flagged as misderived (DG-5).

### 15.5 The sweep after PR 2

Floors are tested at the end of the term. Values are USD per MW.

| Market | Archetype | Best design | Archetype in the overall band | Best on the archetype's route |
|---|---|---|---|---|
| WA | RCM 7h | RCM 7h | yes | 7h, band 7–8h |
| NEM | CIS 4h | Toll 4h | no, gives up $37k | 4h |
| GB | CM 4h | Toll 4h | no, gives up $49k | 2h, band 2–4h |
| DE | Merchant 4h | Merchant 4h | yes | 4h |
| IT | CM 4h | CM 4h | yes | 4h |
| IE | CM 4h | CM 4h | yes | 4h |
| RO | Merchant 2h | Merchant 4h | no, gives up $106k | 4h, on a seed capture curve |
| PL | Merchant 4h | CM 2h | no, gives up $188k | 1h, on a seed capture curve |
| JP ×3 | LTDA 6h | Merchant 1h | fails its floor at year 20 | none: 8.8h would hold, outside the 8h grid |
| PJM | BRA 4h | BRA 4h | yes | 4h |
| ERCOT | Toll 2h | Toll 2h | yes | 2h |
| CAISO | RA 4h | RA 4h | yes | 4h |

Poland's best capacity-route design moves from 1h to 2h once sub-4h storage certifies at MWh ÷ 4.
**2026-10-16, guided-experience plan PR 8** (`docs/japan-ltda-floor-plan.md`). Japan's grid reaches
9h and 10h on JEPX capture, so the LTDA route prices its floor-holding build. That build is 9h:
−$554k to −$563k/MW with the award held at the 6h bid, the market reading after gate G42.

Japan's result is now on OCCTO's own rules, so it is the right reading rather than a gate. Whether
to extend Japan's grid past 8h, and price the build that holds the floor, is a methodology choice
for you (the grid is methodology).
