# Sub-5 in the NEM, and the small-connection routes in every market — plan for sign-off

Drafted 2026-11-26 (research cut the same day) on `codex/it-investor-overview-demo` at `46836048`.

**Decided the same day: all four decisions as recommended (1A, 2A, 3A, 4A).** In the analyst's
words: "I've read them all. I'll take your recommendations."
- The deployment steps are in [Deployment, step by step](#deployment-step-by-step).
- Nothing is built or committed yet. Implementation goes on its own branch from `main`, and no open
  pull request touches `src/opportunities/`.

This changes the special-opportunity screens of five markets (NEM, ERCOT, Romania and the three
Japan areas share one record type), so it needed sign-off before any code (AGENTS.md, "Numbers and
the model"). Every proposed value below carries its source and arithmetic. Inputs with no public
source are named research gates, G48 to G57, continuing `docs/external-view.md`.

## The answer

**Sub-5 is a funded route, and the platform cannot show it today.**
- Infrastructure capital is buying sub-5 MW distribution-connected portfolios in 2026:
  - KKR-backed CleanPeak agreed to buy Sustainable Energy Infrastructure (managed by Patrizia):
    42 MW of batteries over 11 sites, plus 71 MWac of solar over 16 sites, in NSW, Victoria and SA
    (April 2026).
  - Rest, an industry super fund, raised its commitment to MPower to A$250m. Capital committed to the
    platform is now A$350m (2 November 2026). Wollemi Capital bought MPower's renewables business in
    September 2025 for A$19m.
  - I Squared Capital's Anza Power (A$450m equity) bought a portfolio that includes sub-5 MW solar
    hybrids with up to 20 MWh of battery each (January 2026).
  - Enervest and Billion Watts plan a 50 MW / 200 MWh portfolio on 10 distribution-connected sites
    in NSW and Victoria. They expect approvals and connection offers for all 10 sites by June 2027
    (June 2026).
- What these buyers get:
  - no AEMO registration, generator performance standards or transmission queue;
  - a build of six to nine months once connected;
  - granular sites that one aggregator operates as a portfolio.
- Evidence: **Strong** for the activity, **Thin** for the returns. No buyer has disclosed a price,
  a return or a cost per MW.

**The current card has never been shown, and its arithmetic cannot say why Sub-5 is different.**
- Today `nem-sub5` is the 280 MW reference project shrunk to 4.5 MW, with build and running costs
  15% higher and an earlier COD. Revenue is the same per MW.
- For all four investors it returns **5.75% hold IRR**, against **7.37%** for the conventional NEM
  case and a **10.62%** fund target. The 280 MW merchant 4h case also returns 7.37%, so the gap does
  not come from the tender.
- The whole 1.6-point gap is the unsourced 15% premium. The earlier COD is worth 0.1 point.
- **Break-even:** with running costs still 15% higher, Sub-5 matches the conventional case only if
  it is built within **0.3%** of the large project's cost per MW (within 2.7% if its running costs
  match too). Alternatively it must avoid about **A$195k/MW** of works, roughly the whole premium.
- The home page lists a special opportunity only when its IRR beats the conventional play (your
  ruling, 29 October 2026). So the card appears only inside the Investment Lab.
- The model leaves out the five lines that set Sub-5 apart:
  - the distribution network tariff, which can be a cost or a credit;
  - the distribution loss factor;
  - FCAS, where a sub-5 battery has contingency access only;
  - the aggregator's fee;
  - the cost of a distribution connection, set against the transmission connection it avoids.
- It also has two errors:
  - the small route inherits the conventional play's duration;
  - a timing range measured from site control is used as the time from closing to COD.

**Decided 26 November (the four recommendations, below):**
- Rebuild Sub-5 as a *distribution route* on the same acquisition engine: seven explicit fields,
  each sourced or gated, with neutral values that reproduce today's case exactly.
- Build two public datasets so the network line is computed rather than guessed:
  - NEM regional dispatch prices (AEMO NEMWEB), giving an observed arbitrage value by region and
    duration;
  - a versioned table of distribution storage tariffs.
- Keep the display ruling. The rebuilt card shows when its own numbers beat the conventional case.
- Add a trigger on AEMO's exemption review, whose draft report is due 18 December 2026. A 15 MW
  battery threshold would turn "Sub-5" into "Sub-15".
- On today's inputs the rebuilt card reads **5.86%**, still below the conventional case. Until gates
  G48 and G52 close, the answer is that **Sub-5 beats the conventional case only through network
  value or cost, never through speed alone.**

**Across the other markets, three are genuine analogues, three have a contract-backed variant and
the rest offer only a lighter permit:**

| Market | Small route | Strength | Proposed action |
| --- | --- | --- | --- |
| ERCOT | 9.9 MW "Texas 10s" at distribution | Strong (activity) | Revise card |
| Romania | Under 5 MW, outside the new connection auction | Fair | Revise card |
| Japan (3 areas) | Under 2 MW high voltage; new under-50 kW low voltage | Fair / Thin | Revise card |
| PJM | State distributed-storage contracts (Maryland 150 MW, New Jersey Phase 2) | Fair | New card after G55 |
| Finland | Under 5 MW, below Fingrid's connection-inquiry threshold | Thin | New card after G56 |
| CAISO | Rule 21 Fast Track to 5 MVA, blocked by CAISO's 1 MVA wholesale rule | Thin (pending) | Trigger |
| Ontario | Local Generation Program, 100 kW–10 MW | Thin (storage unconfirmed) | Watch item |
| Poland, Italy, Spain, WA | Lighter licence or permit below 10 MW / 10 MW / 50 MW / 5 MW | Thin | Research note only |
| GB, Ireland, Germany, Saudi Arabia | No size route worth a fund's time | — | None |

## 1. What Sub-5 is

### The rule

- **No registration.** A generating system under 5 MW nameplate is automatically exempt from
  registering as a Generator (NER clause 2.2.1(c), as summarised by TasNetworks).
- **A battery under 5 MW is a small bidirectional unit.** It is classified non-scheduled unless AEMO
  approves otherwise.
  - An Integrated Resource Provider acting as a Small Resource Aggregator (IRP-SRA) classifies these
    units at their connection points and sells their energy.
  - It can sell contingency FCAS through ancillary service units, **but not regulation FCAS** (AEMO
    fact sheet, July 2024).
- **Network charges stay.** The storage integration rule kept the existing network-charge
  arrangements: an IRP pays TUoS and DUoS on the load it draws. AEMO had asked for an exemption, and
  the AEMC declined it (AEMC, December 2021).
- **No CIS.** Capacity Investment Scheme dispatchable tenders have required at least 30 MW (Tender 3,
  and the SA–Victoria tender), so Sub-5 is a merchant or bilateral route.
- **The connection is distribution.** Sites connect near zone substations, needing little or no new
  line (Enervest), and face "less onerous connection requirements" than large plant (CleanPeak).
- **Pending change.** AEMO is reviewing its Guide to Registration Exemptions and Production Unit
  Classifications.
  - Consultation paper 15 September 2026; first-round submissions closed 13 October; draft report
    expected 18 December 2026.
  - Proposed (MinterEllison summary): a self-declared exemption pathway for systems under 30 MW, a
    battery threshold raised from 5 MW to 15 MW on both pathways, and no 90-day limit on
    pre-commissioning exemptions.
  - The 15 MW figure is a proposal, and AEMO's own page could not be read to confirm it.

### Who is buying

| Date | Buyer (type) | What | Source |
| --- | --- | --- | --- |
| Sep 2025 | Wollemi Capital (climate investor) | MPower renewables business, A$19m, >A$100m pipeline commitment; "mostly 5 MW" solar | RenewEconomy, 11 Sep 2025 |
| Jan 2026 | Anza Power, backed by I Squared Capital (infrastructure fund; A$450m equity) | Bison Energy's ANZ portfolio, including sub-5 MW solar hybrids with up to 20 MWh of battery | ESS News, 16 Jan 2026 |
| Apr 2026 | CleanPeak Energy, backed by KKR | 100% of SEI: 42 MW of batteries on 11 sites (three hybrids), 71 MWac of solar on 16 sites; price undisclosed | RenewEconomy, 17 Apr 2026 |
| Jun 2026 | Enervest with Billion Watts (Taiwan) | 50 MW / 200 MWh solar-plus-battery, 10 distribution sites, NSW and Victoria | ESS News, 3 Jun 2026 |
| Nov 2026 | Rest (industry super fund) | MPower commitment raised to A$250m; A$350m on the platform | RenewEconomy, 2 Nov 2026 |

The investors' stated reasons are faster deployment and easier connection. None publishes a return.
The commercial models differ:
- CleanPeak supplies corporate customers;
- Anza sells firmed supply to commercial and industrial buyers;
- the rest do not say.

### Revenue evidence

- **Gridcog's monthly sub-5 benchmark** is the only regular public series.
  - It is modelled, not metered. Each site is a 5 MW connection with solar alone, or with a 5 MW
    battery at two hours (10 MWh) or four hours (20 MWh).
  - Dispatch is co-optimised on actual half-hourly prices across energy and all eight contingency
    FCAS markets; regulation FCAS is excluded.
  - It nets off named distribution storage tariffs: Energex in Queensland, Essential Energy HV
    storage in NSW, SA Power Networks HV business generation, and Powercor generator storage in
    Victoria.
  - Loss factors are regional averages.
  - June 2026: storage sites out-earned solar 2.7×, and SA's four-hour battery earned A$196k in the
    month. July 2026: fleet revenue fell 13%, and the same battery earned A$87k.
  - Annual per-MW figures and the split by revenue stream sit behind an access form, so the series
    is a cross-check, not a seed.
- **The network line can have either sign.** Gridcog's 2022 study of the trial community-battery
  tariffs found:
  - Essential Energy's bi-directional tariff, with free midday charging and a 10.8 c/kWh evening
    export rebate, was the only network where charges netted to a credit;
  - Powercor, CitiPower and United Energy ran a simple time-of-use tariff capped at 240 kVA;
  - Ausgrid's tariff rested on pre-defined peak and export events, with a capacity charge of
    A$1.72/kW-month;
  - Evoenergy's commercial-area tariff carried a capacity charge high enough to suppress cycling.
- In its 2024–29 decision the AER removed the rebate from Essential Energy's HV storage tariff and
  widened LV and HV storage eligibility (AER Final Decision Attachment 19, April 2024).
- Today's rates are in each distributor's 2026-27 network price list. Those pages refused automated
  reads, so the line is gate G48.

### How the platform prices it today

`src/opportunities/catalog.js` declares `nem-sub5` as kind `small`, 4.5 MW, merchant, build and
running costs +15%, and a 9–18 month range. `compareOpportunity` (`src/opportunities/model.js`)
replays it through the acquisition engine:
- revenue per MW is the market's own line;
- duration is inherited from the conventional play;
- the COD is the midpoint of the range (13.5 months) against the conventional 18;
- grant and support are set to zero.

The probe scripts read the current model and write nothing.

| Case (infrastructure fund; the other three investors read the same hold IRRs) | Sub-5 hold IRR | Conventional |
| --- | --- | --- |
| As published (4h, 13.5 months, +15% / +15%) | 5.75% | 7.37% |
| Ready-to-build timing, 7.5 months | 5.86% | 7.37% |
| No premiums, 7.5 months, 2h | 3.75% | 7.37% |
| 2h instead of 4h | 2.10% | 7.37% |
| 4h, 7.5 months, 10% of income at risk | 4.53% | 7.37% |
| Break-even build premium, opex +15% | +0.3% | — |
| Break-even build premium, opex unchanged | +2.7% | — |
| Break-even avoided works, at +15% / +15% | A$195,174/MW | — |

Three things follow:
1. **Speed is nearly worthless at a zero rights price.** The engine values earlier cash, not access.
   A sub-5 site's real time advantage is that it gets connected at all, and the engine does not see
   that.
2. **The four-hour design is right.** The NEM capture curve pays 2h about half what it pays 4h
   (A$95,980 against A$176,415 in year 1), so the inherited 4h happens to be the better design. It
   should be chosen, not inherited.
3. **"Avoided works" cannot be credited yet.** The NEM capex stack carries an HV transformer
   (A$61,600/MW) but no separate transmission connection charge (`connectionFeePerMW` is unset), so
   the conventional case shows no cost for a distribution site to avoid. Crediting avoided works
   before that cost is made explicit would count it twice.

## 2. The NEM proposal

### 2.1 A distribution route in the engine

A `small` opportunity gains a `distribution` block. Every field is optional, and absent fields leave
today's behaviour, so all other cards and `npm run test:current` stay pinned.

| Field | Today | Proposed seed | Source and arithmetic | Evidence |
| --- | --- | --- | --- | --- |
| `powerMW` | 4.5 | 4.5 (unchanged) | Under the 5 MW nameplate threshold; SEI averages 3.8 MW (42 MW ÷ 11 sites); Enervest's example site is 5 MW / 10 MWh | Fair |
| `hours` | inherited (4) | **4, explicit** | Enervest and Billion Watts 200 MWh ÷ 50 MW = 4h; Gridcog benchmarks 2h and 4h with SA's 4h site on top; the engine's 4h case beats 2h by 3.65 points | Fair |
| `rtbToCodMonths` | 13.5 (from the site-control range) | **7.5** | Enervest: standalone BESS about 6–9 months, so (6 + 9) ÷ 2 | Thin (developer statement) |
| `siteControlMonths` (display) | 9–18 | **18–21** | Enervest and Billion Watts expect approvals and connection offers 12 months after their June 2026 agreement; 12 + 6 = 18, 12 + 9 = 21 | Thin |
| `networkPerMW` (signed A$/MW-yr; credit positive) | not modelled (0) | 0 until G48 closes, marked Thin | Computed from the tariff dataset (§2.2) on the dispatch profile at one reference distributor | Thin → gate G48 |
| `lossFactor` | market `naqFactor` 0.95 (MLF and curtailment) | 0.95 until G49 closes | Distribution loss factor × the transmission node's MLF, from AEMO's annual loss-factor publication | Thin → gate G49 |
| `servicesShare` | 1.0 of the A$9,000 FCAS line | 1.0 until G50 closes, marked Thin | Contingency share of battery FCAS revenue, from AEMO Quarterly Energy Dynamics; regulation FCAS is closed to a sub-5 unit by rule | Thin → gate G50 |
| `routeFeePct` | market `feePct` 5% | 5% until G51 closes | The IRP-SRA aggregator's or retailer's share; no Australian disclosure | Thin → gate G51 |
| `buildPremiumPct` / `opexPremiumPct` | +15% / +15% (house) | +15% / +15%, marked Thin | No sub-5 cost is published. The break-even says this one input decides the call | Thin → gate G52 |
| `avoidedConnectionPerMW` | 0 | 0, and only after the conventional stack carries an explicit transmission connection cost | See §1 point 3 | Thin → gate G52 |

On these seeds Sub-5 reads 5.86% hold IRR for every investor, against 7.37% conventional, and stays
off the home page. Only the COD timing moves a number. What the change adds is the structure that
lets G48, G49, G50 and G52 move the answer when they close, each through a field with a source.

Engine notes:
- `lossFactor`, `servicesShare` and `routeFeePct` enter through `economicOverrides`, which already
  set dotted economics paths (`naqFactor`, `services`, `feePct`), on the special case only.
- The network line needs one engine line.
  - It follows the precedent of `additionalReserveNetPerMW` in `src/acquisition/reference.js`: a
    signed `networkNetPerMW` input joins the market-revenue line after the optimiser fee.
  - It sits outside the at-risk income haircut and the running-cost uplift, and it is zero when
    absent, so no other case moves.
  - Every cash formula that sums secured + renewal + merchant (valuation, leverage, tax) picks it up
    unchanged.
  - Each annual row also carries it as a memo field, `network`, so the bridge shows the charge or
    credit and not a netted merchant figure.
- The development success, delay and failure weights stay equal between the two cases. A higher
  success probability for Sub-5 would need a sourced input, and none exists.

### 2.2 Two public datasets

1. **NEM regional prices**: five datasets, `nem-nsw1-prices`, `nem-qld1-prices`, `nem-vic1-prices`,
   `nem-sa1-prices` and `nem-tas1-prices`. They carry AEMO NEMWEB 5-minute regional reference
   prices, fetched daily in the existing 06:17 UTC cycle.
   - Derived and published: the daily arbitrage value per region, from the existing pure functions
     (`derivePriceMetrics` and `arbitrageRevenuePerMW` in `src/derive/`). These apply round-trip
     efficiency on the charge leg, cycles, availability and the realisation factor set in
     `src/governance/derivation.js`.
   - The transmission-scale line (gate G40) and the Sub-5 line are read against the same observed
     series.
   - Seeds still change only on your sign-off. The existing drift detector (`etl/drift/`) proposes
     and never writes, and it stays silent until you set an anchor for the NEM merchant line
     (`docs/governance.md`, "Anchors").
   - Before the feed ships, confirm AEMO's copyright permission for NEMWEB files and record it in
     `docs/data-policy.md` and `docs/live-data.md`.
   - Cost: one small daily fetch, about one to two Actions minutes a day, inside the 2,000-minute
     budget.
2. **The storage-tariff table**: hand-entered and versioned, refreshed when the financial year resets
   each 1 July.
   - It lives in `src/markets/nem/data/storageTariffs.js` as sourced, dated market data, the way
     Finland's publication tables do. It is not an ETL feed: no feed is invented for a publication
     table (`docs/live-data.md`).
   - It covers six distributors: Essential Energy, Ausgrid, Endeavour Energy, Powercor, SA Power
     Networks and Energex.
   - It records fixed, demand and time-of-use import and export components, with the price-list URL
     and financial year on every row.
   - It closes G48. The network line is then the tariff applied to the dispatch profile from
     dataset 1.

Gridcog's monthly headline figures go in the source register as an outside cross-check. They are not
a dataset.

### 2.3 Content and display

- **Card text**, in English and Simplified Chinese with the same meaning:
  - **Thesis:** a distribution connection that avoids the transmission queue and registration,
    owned as a portfolio.
  - **Conditions:** a 2026-27 storage tariff at the site's distributor; a connection offer with
    import and export both approved; an IRP-SRA contract; nameplate under 5 MW per system.
  - **Risk:** a network tariff that charges the peak export hours; contingency FCAS saturating; a
    unit cost above the large project's.
  - **Evidence:** Thin. **What would change it:** a published sub-5 build cost or quotation (G52),
    or a distributor tariff that credits evening export (G48).
- **Revenue mechanism:** add a `distribution-network` entry to `src/opportunities/revenue.js` (who
  pays, the problem it solves, how the price forms, the drivers and the underwriting discipline),
  shown only on the Sub-5 comparison.
- **Source register:** add the AEMO IRP-SRA fact sheet, the exemption-guide consultation, the AER
  tariff decision, the distributor price lists and the Gridcog benchmark to
  `src/markets/nem/sources.js`.
- **Triggers** (view, analyst-only):
  - `nem-exemption-guide-draft`: AEMO's draft report on the 5 MW → 15 MW battery threshold
    (expected 18 December 2026), then the final report;
  - `nem-storage-tariffs-fy28`: the 2027-28 network price lists (1 July 2027).
- **Display:** unchanged (decision 2).

## 3. The other seventeen markets

Each entry gives the rule, what it avoids, what it gives up, the evidence, and the action.

### ERCOT: 9.9 MW "Texas 10s" (Strong activity, weak returns) — revise the card

- **Rule.** A distribution-connected generator above 1 MW and up to 10 MW that exports is a
  Settlement Only Generator unless it registers as a Distribution Generation Resource.
  - The settlement-only route earns energy only and is self-dispatched.
  - As a DGR, a battery earns energy and ancillary services under ERCOT dispatch (ERCOT DG
    registration page; ERCOT, June 2023).
- **Activity.**
  - 12 of the 20 batteries that reached operation in Q2 2026 were sub-10 MW "Texas 10s", about
    0.1 GW, or 7% of the quarter's 1.5 GW (Modo, 27 July 2026).
  - The median battery's time from queue entry to operation rose from 2.3 years (2021) to 4.4 years
    (2026), which is the wait a 9.9 MW distribution site avoids.
  - Bimergen bought eight 9.9 MW projects (79.2 MW) from Aggreko with simultaneous financing (3 March
    2026), for operation from Q4 2026 to Q1 2027.
  - SmartestEnergy's three-site "Texas Ten" PPA portfolio is traded by GridBeyond as its QSE
    (August 2026).
- **Returns.** ERCOT battery revenue was pacing $29/kW-year over January–May 2026 (Modo). The fund
  call is already Pass.
- **Card fixes:**
  - allow the toll route where a lease or PPA is evidenced, instead of forcing merchant;
  - set an explicit 2h;
  - use ready-to-build timing of 7.5 months;
  - record DGR or SOG as a condition.
- **Effect.** The card moves from −13.29% to −6.30% hold IRR, against 0.53% for the conventional toll
  2h. It stays unshown.
- **Gate G53:** the typical Texas 10 duration, distribution-utility charges, and lease or toll terms.

### Romania: under 5 MW, outside the connection auction (Fair) — revise the card

- **Rule.** ANRE Order 79/2025 (16 December 2025) allocates grid capacity by competitive auction to
  projects of **5 MW or more**, for requests registered from 1 January 2026 (CMS, 29 December 2025).
  - Daily auction bidding was scheduled to begin 30 October 2026.
  - Participation needs a guarantee of €20,000 per MW for 2026 (ANRE Orders 15 and 16/2026, published
    25 May 2026).
  - The same orders raised the connection guarantee from 5% to 20% of the connection tariff for
    projects over 1 MW, and set a €30/kW licence-stage guarantee.
  - Stored and re-injected energy no longer pays transmission extraction, distribution or
    system-service tariffs.
- **What sub-5 avoids:** the auction, its guarantee and its clearing price. It does not avoid the ATR
  studies.
- **Card fix.** The card's 12–24 month range has made Sub-5 *slower* than the conventional play (18
  against 12 months). At ready-to-build both cases already hold an ATR, so set equal timing:
  6.91% → 7.05%, against 11.20% conventional.
  - Carry the auction price a ≥5 MW project pays as the conventional case's cost once it is known.
    Today the conventional case carries none, so Sub-5's advantage is invisible.
- **Gate G54:** the first auction's clearing prices per MW, and whether a *new standalone* storage
  site is inside the auction categories. CMS names storage only as additions to existing sites or
  connections at consumption sites.

### Japan (Tokyo, Kyushu, Hokkaido): under 2 MW high voltage, and under 50 kW low voltage (Fair / Thin) — revise the cards

- **Today.** The three cards price a sub-2 MW high-voltage battery on the merchant route but inherit
  the long-term-auction play's 9 hours. Merchant Japan has no IRR at any duration on today's lines,
  so the screen reads "no IRR" either way.
- **New.** Since April 2026, batteries under 50 kW can join the balancing market. GATES announced a
  pilot of 28 low-voltage units of about 49.5 kW / 200 kWh each, 1.39 MW / 5.6 MWh in total (Japan
  Energy Hub, 8 September 2026). This is Japan's closest match to Sub-5: a granular portfolio below
  the high-voltage threshold.
- **Card fixes:**
  - an explicit 4h (200 kWh ÷ 49.5 kW ≈ 4h for the low-voltage pilot);
  - a low-voltage variant noted in the conditions;
  - balancing revenue read from the area's `services` line, which gate G47 already tracks.
- **Gate G57:** the high-voltage small-site duration, low-voltage balancing qualification and
  aggregation terms, and the low-voltage connection cost.

### PJM: state distributed-storage contracts (Fair) — new card after G55

- **Maryland.** The Next Generation Energy Act sets a 150 MW goal for distribution-connected
  front-of-meter storage.
  - Distribution companies filed plans by 1 November 2025 and 1 November 2026.
  - The first tranche was approved on 8 April 2026, through competitive procurement.
  - BGE's initial plan covers 29 MW: 3 MW utility-owned, 15 MW customer-sited and 11 MW from third
    parties.
  - The Commission's timeline is 50 MW by 1 November 2027 and 150 MW by 1 November 2028.
- **New Jersey.** GSESP Phase 2 Block 1 is a distributed-storage straw proposal (August 2026),
  administered by the distribution companies, with fixed and performance incentives. Industry
  reports put the target at 500–800 MW of behind-the-meter and distribution-connected storage.
- **Why it matters.** It is the PJM-area version of Sub-5 with a contracted line, which ERCOT's and
  the NEM's small routes lack.
- **Gate G55:** the awarded incentive or contract price per kW-year and the term, from Maryland
  tranche awards or the New Jersey final order.
- **Card:** kind `award`, PJM, once G55 gives a price. The platform carries PJM as one market, so the
  card must name the state.

### Finland: under 5 MW at a distribution connection (Thin) — new card after G56

- **Rule.**
  - Every storage project above 5 MW must send Fingrid a connection-contract inquiry, throughout
    Finland.
  - Fingrid restricts new storage connections in southern Finland until 2029, when Hikiä–Toivila is
    complete (Fingrid, 26 September 2025).
  - 56% of Finnish storage is connected to distribution networks.
  - Fingrid's storage capacity fee is charged on charging plus discharging capacity: €87.5/MW-month
    in 2025, half the power-plant rate (Fingrid, 30 October 2024).
- **The question.** Can a sub-5 MW battery on a southern distributor's network connect while the
  transmission restriction holds, and on what distributor tariff?
- **Gate G56:** a southern distributor's position on sub-5 storage connections and its storage
  tariff.
- **Card:** a sub-5 variant of `fi-available-node` if G56 closes favourably. Finland's reserve line
  rulings stand.

### CAISO: Rule 21 Fast Track to 5 MVA (Thin, pending) — trigger only

- Rule 21 lets a distribution project up to 5 MVA take Fast Track review under CPUC jurisdiction.
  But CAISO requires any wholesale-exporting project above 1 MVA to interconnect under its own
  tariff.
- CESA asks the CPUC to raise the Rule 21 Screen Q threshold from 1 to 5 MVA in R.25-08-004 (opened
  20 August 2025).
- **Trigger `caiso-rule21-screen-q`:** a CPUC decision on Screen Q. Until then, a 1–5 MVA wholesale
  battery has no distinct route.

### Ontario: Local Generation Program, 100 kW–10 MW (Thin) — watch item

- The IESO is designing a competitive program for distribution-connected resources of 100 kW to
  10 MW that do not participate in the market, targeting a 2026 launch.
  - The IESO says facilities over 10 MW typically need connection impact assessments.
  - Storage eligibility is not confirmed beyond batteries added to existing facilities in a
    recontracting stream.
- The established small play in Ontario is behind the meter: Class A customers pay the Global
  Adjustment on their share of the five peak hours, and a battery cuts that share. That is a
  customer-site play, not a market play.
- **Watch item, not a trigger.** Ontario has no view record yet (`view/markets/` holds none for
  `ca_on`), so it cannot carry a trigger. Track LGP design documents that admit standalone storage
  in this plan's watch list.

### Lighter permits only: Poland, Italy, Spain, Western Australia — research note, no card

| Market | Rule | What it does not avoid |
| --- | --- | --- |
| Poland | Over 10 MW needs a URE licence; 50 kW–10 MW needs only an entry in the operator's storage register (Energy Law art. 32, from the May 2021 amendment) | The distribution connection itself; whether the 50% storage connection-fee relief is size-limited is unverified |
| Italy | Electrochemical storage under 10 MW is a free activity with no authorisation, unless landscape, safety or environmental constraints apply (Osborne Clarke, June 2024) | The distribution connection (TICA). Balancing access through aggregated units and the current law text are unverified |
| Spain | Projects up to 50 MW are authorised by the regions, not MITECO. In Q3 2026 the regions handled 66 of 87 storage projects (655 MW) and MITECO 62.8% of capacity. Valencia eased authorisation for standalone storage under 10 MW (DL 14/2025) | Access and connection rights, which are the binding constraint |
| Western Australia | A 5–10 MW facility must register as a Market Participant unless AEMO grants an exemption; 10 MW and above cannot be Non-Scheduled (AEMO WEM registration pages) | Whether an unregistered sub-5 battery can earn capacity credits, the line WA's case rests on, is unverified |

These go into each market's research section as context. None changes a number.

### No useful small route: GB, Ireland, Germany, Saudi Arabia

- **GB.** Only projects below the Transmission Impact Assessment lower limit (1 MW in England and
  Wales, 200 kW in Scotland) skip a Gate 2 application. Batteries are oversupplied: 14.8 GW above
  the top of the 2030 range (DESNZ/Ofgem, April 2026). Keep `gb-gate2`.
- **Ireland.** No size route was found. The new batch connection process replaced the old gate.
  Keep `ie-upgrade`.
- **Germany.** No size threshold.
  - One developer reports targeting 10–30 MW medium-voltage projects for shorter development.
  - Storage connection requests reached 18,158 in 2025.
  - Batteries left the power-plant connection ordinance at the end of 2025, and transmission
    connections are allocated by project maturity from 1 April 2026.
  - E.ON's flexible connection standard reaches its German networks by end-2026.
  - Keep `de-existing-node`; note flexible connection as a future route.
- **Saudi Arabia.** A single buyer runs state rounds, so there is no small route.

**Scout markets.** Chile's distributed-generation regime for plants up to 9 MW (PMGD) is the closest
global analogue to Sub-5. Research it first if Chile is registered.

## Decisions (taken 26 November 2026: A on all four)

1. **Where Sub-5 lives. Taken: A.**
   - **A. Rebuild it as a special-opportunity card now, and promote it to a play once G48 and G52
     close.** Recommended.
     - It is confined to `src/opportunities/`.
     - It changes no stored call.
     - It keeps plays to route × duration × stage until a small play has evidence behind it.
   - **B. A play now**, with a new play field `connection: 'distribution'` and `powerMW`, its own
     fund call, and a place in the shortlist.
     - Plays are analyst-only, so B needs your call text for four investors.
     - It touches the design-fit sweep and the briefing projection.
2. **The display rule. Taken: A.**
   - **A. Keep the 29 October ruling:** a special opportunity shows on the home page and market page
     only when its IRR beats the conventional play. Recommended. The card shows when its own fields
     earn it.
   - **B.** Also show each small route on its market page with its gap and break-even (A$/MW of
     avoided works, or premium %), marked as research rather than an opportunity. This would
     explain to a fund reader why Sub-5 is not on the list. It reopens a signed ruling.
3. **Sub-5 cost basis. Taken: A.**
   - **A. Keep +15% build and running costs, marked Thin under G52, until a quotation or a disclosed
     project cost arrives.** Recommended.
   - **B.** If you can obtain a 5 MW / 20 MWh quotation from the supplier behind the existing quote,
     that closes G52 the way the supplier quote closed the large-project capex. This is a
     practitioner input, as with the Finland floor.
   - The break-even (+0.3%) means this single input decides whether Sub-5 can ever show.
4. **The NEM datasets. Taken: A.**
   - **A. Build both the five NEM price datasets (daily, automated) and the storage-tariff table
     (annual, by hand).** Recommended. They also re-source the transmission-scale merchant line (G40), which is
     still open.
   - **B.** No new feed. Close G48 by hand from the price lists, and keep Gridcog as a cross-check.
     This saves the Actions minutes but leaves both merchant lines unobserved.

## Deployment, step by step

There are two pull requests, then one per market as each gate closes:
- **PR 1** prices the small routes as their own designs (decisions 1A, 2A, 3A).
- **PR 2** adds the NEM prices and the storage-tariff table (decision 4A).

Each is one feature (AGENTS.md). Each opens as a draft, which runs no checks, and is marked ready
only after the full local check list passes. Neither moves a headline number, so each needs only
your merge.

### Step 0: before any code (half a day)

1. **Branch from `main`, not from this checkout.** This plan is untracked, so it travels with the
   working tree. Leave `.workbuddy/` and `perf/p1-after-browser.json` alone; they are not this work.

   ```bash
   git fetch origin
   git switch -c claude/sub5-distribution-route origin/main
   ```

2. **Confirm the commit guard is active.** `git config core.hooksPath` must print `.githooks`;
   otherwise run `npm run guard:install`, then `npm run guard:staged`.
3. **Confirm the baseline on `main`:** `npm test` and `npm run test:current` pass before anything
   changes.
4. **Check for parallel work.** `gh pr list --state open` returned none on 26 November. Re-check, and
   check branches for edits to `src/opportunities/`, `src/acquisition/reference.js` and
   `src/markets/nem/`.
5. **Check the NEM story.** No call changes here, so the story's sign-off stands. Confirm that its
   `reviewedAgainst` still matches the stored calls before merging (the Poland and ERCOT lesson of
   15–16 November).
6. **Check every name** in the branch name, commit messages and PR text against
   `local-data/markers.json`. Nothing scans those surfaces.

### PR 1: small routes priced as their own designs

Branch `claude/sub5-distribution-route`, opened as a draft at the first push. Make one commit per
step, each passing `npm test`.

1. **The plan.** Commit this file as the decision log.
2. **The engine line** in `src/acquisition/reference.js`.
   - Add a signed `networkNetPerMW` input, after the `additionalReserveNetPerMW` precedent (§2.1).
   - It joins `merchant` after the optimiser fee, outside `unsecuredRevenueFactor` and
     `operatingCostFactor`, and is carried on each row as the memo field `network`.
   - Absent means zero, so `tests/baseline.test.js` and `tests/current-model.test.js` stay pinned.
3. **The comparison** in `src/opportunities/model.js`.
   - **Duration.** A `small` route must declare `hours`; without it the case is `unavailable` with
     the reason "A small route must declare its own duration".
   - **Timing.** Ready-to-build prices `rtbToCodMonths`, or the conventional case's own months when
     the card says `rtbTiming: 'same'`. Greenfield prices the midpoint of `siteControlMonths`. A
     reader's input still overrides both.
   - **The `distribution` block, on the special case only:**
     - `lossFactor` → `naqFactor`;
     - `servicesShare` × `services`;
     - `routeFeePct` → `feePct`;
     - `networkPerMW` → `networkNetPerMW`.
   - **Bounds**, added to the `bounds` table so the existing invalid-input test covers them: loss
     factor 0.80–1.10; services share 0–1; route fee 0–30%; network −A$200k to +A$200k per MW-year.
4. **The cards** in `src/opportunities/catalog.js`.
   - Each revised card gains an `asOf: '2026-11-26'`. The comparison caption reads `o.asOf`, falling
     back to `RESEARCH_DATE`, so the untouched cards keep 27 October.
   - **`nem-sub5`:**
     - `hours: 4`, `siteControlMonths: [18, 21]`, `rtbToCodMonths: 7.5`;
     - `distribution: { networkPerMW: 0, lossFactor: 0.95, servicesShare: 1, routeFeePct: 5 }`, with
       each field's evidence marker and gate (G48–G52);
     - the thesis, conditions and risk of §2.3, in both languages;
     - the source becomes the AEMO IRP-SRA fact sheet.
   - **`ercot-small-dg`:**
     - `route: 'toll'`, `hours: 2`, `rtbToCodMonths: 7.5`;
     - the conditions name the DGR or settlement-only choice;
     - sources: ERCOT's DG registration page and Modo's Q2 2026 buildout.
   - **`ro-sub5`:**
     - `hours: 2` (today inherited from `ro-mer-2h`), `rtbTiming: 'same'`;
     - the conditions name the ≥5 MW auction and its €20,000/MW guarantee;
     - source: the CMS note on ANRE Order 79/2025.
   - **`jp-*-small`:**
     - `hours: 4`;
     - the conditions name the under-50 kW low-voltage variant;
     - add the Japan Energy Hub source.
5. **What the reader sees.**
   - `src/opportunities/ui.js`:
     - two table rows: "Network charge or credit, year 1 / MW" (marked Thin while `networkPerMW` is
       the zero seed) and "Loss factor";
     - the caption shows the site-control range;
     - the download carries the `distribution` block.
   - `src/opportunities/revenue.js`: a `distribution-network` mechanism in both languages, listed
     when the route has a `distribution` block.
   - `src/markets/nem/sources.js`: five entries with provenance and `lastChecked: '2026-11-26'`:
     - the IRP-SRA fact sheet;
     - the exemption-guide consultation;
     - the AER Essential Energy tariff decision;
     - the distributor price lists (as a coverage gap until G48);
     - Gridcog's benchmark (as an outside cross-check).
   - No card text types a model figure (AGENTS.md, "Writing for the site").
6. **The triggers**, in a new script `scripts/view/content/sub5-triggers-2026-11.mjs`, on the
   pattern of `ercot-mora-2026-11.mjs`.
   - It writes three triggers, each `kind: 'event'`, `effect: null`, bilingual labels:
     - `nem-exemption-guide-draft`: market `nem`, expected `2026-12`, watching `revenueCertainty`
       and `policyStability`;
     - `nem-storage-tariffs-fy28`: market `nem`, expected `2027-07`, watching `assetReturn`;
     - `caiso-rule21-screen-q`: market `caiso`, `expected: null`, watching `revenueCertainty`.
   - Run `node scripts/view/content/sub5-triggers-2026-11.mjs --check`, then `--apply` on the
     branch. The view changes ride in the PR, and your merge is the analyst application.
   - Ontario stays a watch item: it has no view record.
7. **Tests**, extending `tests/special-opportunities.test.js`:
   - a neutral `distribution` block reproduces today's special cash flows exactly (`deepEqual` on
     `annual`);
   - a network credit raises NPV and a charge lowers it; the line is untouched by the income haircut
     and the opex uplift, and it is taxed with the merchant line;
   - a `small` card without `hours` is unavailable;
   - ready-to-build prices `rtbToCodMonths`; greenfield prices the site-control midpoint;
   - for all four investors, NEM Sub-5 reads 5.86% against 7.37% and `beatsConventional` is false;
   - ERCOT small reads −6.30% against 0.53%, and Romania sub-5 7.05% against 11.20%;
   - the home picks from `opportunitySummary` are unchanged;
   - `e2e/opportunities.spec.js` keeps its assertion that the home list does not contain "Sub-5".
     That assertion is the visible proof of decision 2A.
8. **Local checks, in this order**, all before the first non-draft push:

   ```bash
   npm test
   npm run test:current
   npm run build
   npm run test:budget
   npm run test:e2e
   ```

   - `npm run test:current` must pass unchanged. If it moves, stop: nothing in PR 1 is meant to move
     a headline number.
   - If `test:budget` fails because the bundle grew, raise the cap and say so in the PR (ruling of
     5 November). Never cut content to fit.
   - `npm run etl:verify` is not needed: PR 1 changes no data.
9. **Push and mark ready.**
   - The PR runs the fast gates and the smoke suite, about 7–8 Actions minutes.
   - No `full-check` label: the full browser suite has run locally and runs again on `main` before
     the deploy. Add the label only if the local run was flaky.
   - The PR body opens with:
     - **What changes on the site:** the Sub-5, ERCOT small, Romania sub-5 and Japan small-site
       comparisons in the Investment Lab are priced on their own size, duration and timing, with a
       network-charge line; nothing new appears on the home page.
     - **Cost or risk:** one PR check and one `main` run with its deploy; no headline return, grade or
       call moves.
     - **Decision needed:** merge; the four decisions were taken on 26 November 2026.
10. **Merge (yours).**
    - On `main`, CI runs `npm test`, the build, the confidentiality scan, `etl:verify` and the full
      browser suite.
    - It then runs `vercel build`, scans `.vercel/output`, deploys with `--prebuilt` and runs the
      smoke suite on the live URL: about 15–16 minutes.
    - Never deploy around this pipeline (`docs/publishing.md`).
11. **Check the live site** after the deploy summary shows `published: true`:
    - `/`: the special-opportunity list is unchanged, with no Sub-5;
    - `/markets/nem`: no comparison section, as before;
    - the Investment Lab on the NEM market: the Sub-5 comparison shows 4.5 MW / 4h, 7.5 months, and
      the network line marked Thin;
    - `/changes`: the three new triggers.
12. **Rollback.**
    - Code: revert the merge commit on a new branch and merge that through the same pipeline. Never
      force-push or reset `main`.
    - View: `node scripts/view/writer.mjs revert <id>` for each trigger change. The ids are on
      `/changes`.

### PR 2: NEM prices and storage tariffs

Branch `claude/nem-prices-and-tariffs` from `main` after PR 1 merges.

1. **The licence and file check, before any connector code.**
   - Confirm that AEMO's copyright permission covers republishing NEMWEB price files. The WEM entry
     already records "AEMO — free reuse with attribution".
   - If it does not cover republication, publish only the derived daily metrics and mark the full
     series `republishable: false`.
   - Confirm the layout of the daily public prices report (5-minute regional reference price by
     region) and the archive path used for backfill.
2. **The connector**, `etl/sources/aemo-nem.mjs`.
   - It fetches each daily file once and serves all five regional datasets from it, as the JEPX
     connector shares its files, through `etl/lib/bounded-download.mjs` and `bounded-zip.mjs`.
   - Declare provider `aemo-nem` at concurrency 1 in `etl/lib/concurrency.mjs`. Register it in
     `CONNECTORS` in `etl/run.mjs`.
   - The existing backfill rule fills at most 45 days per run, so a full trailing year takes about
     nine daily runs.
3. **The catalogue**, five entries in `src/governance/datasets.js`:
   - `kind: 'timeseries'`, `marketId: 'nem'`, AEMO NEMWEB as source with the confirmed licence;
   - `refreshHours` 24, `staleAfterHours` four days, `requiresKey: false`, `official: true`;
   - `bearsOn: ['economics.merchGross']` for `nem-nsw1-prices` only, since NSW1 is the reference
     region. The other four bear on nothing.
   - `npm test`'s exhaustiveness test confirms the field is classified.
4. **No anchor.** PR 2 adds no NEM anchor to `src/governance/anchors.js`, so the drift bridge
   reports "not computable" and opens no proposal. Setting the anchor is your act, after a full
   trailing year has passed the seasonality guard. That is when gate G40 gets its observed basis.
5. **The tariff table**, `src/markets/nem/data/storageTariffs.js`.
   - One row per distributor, tariff code and financial year: fixed (A$/day), demand
     (A$/kVA-month and its window), time-of-use import and export (c/kWh by window, exports signed
     so a credit is positive), solar-soak windows and kVA limits.
   - Every row carries the price-list URL, its page and the date read.
   - Six distributors for FY2026-27. Their sites refused automated reads, so read the price lists
     in the browser pane, or the analyst downloads them.
   - A test checks that every row has a URL, a financial year and units.
6. **The derivation**, `src/derive/networkValue.js`, a pure function pinned by tests on synthetic
   days.
   - Net-price dispatch per local day: charge in the cheapest intervals by price plus import
     charge, discharge in the dearest by price plus export credit. Efficiency acts on the charge
     leg.
   - Demand charges come from the largest import inside the tariff's demand window; the fixed charge
     comes per day.
   - It returns the arbitrage margin and the network margin separately, annualised with the
     `derivation.js` parameters.
   - Under 28 complete days it returns null, and absence is shown as absence.
7. **The display.**
   - `/data` lists the five feeds.
   - The Sub-5 comparison shows the observed trailing-12-month network value at the chosen
     distributor, beside the card's seed.
8. **Local checks:** the PR 1 list, plus `npm run etl:dry`, then
   `node etl/run.mjs --only nem-nsw1-prices`, then `npm run etl:verify`.
9. **Cost.**
   - One daily fetch on the existing run: about 1–2 minutes a day, so 30–60 minutes a month, inside
     the 2,000-minute budget. The backfill week costs a few minutes more.
   - Read the Monday briefing's "Automation minutes" line after the first week.
10. **PR body:**
    - **What changes on the site:** NEM prices for five regions on `/data`, and an observed network
      line on the Sub-5 comparison.
    - **Cost or risk:** about 30–60 Actions minutes a month; no number moves.
    - **Decision needed:** merge.
11. **Merge, deploy and check** as in PR 1 steps 10–12.
    - After merge, the next 06:17 UTC run publishes the first snapshots.
    - Check `/data` for five fresh feeds and the run summary's concurrency line.

### After PR 2: one PR per market as its gate closes

- **The NEM network seed (G48).** With the table complete, the card's `networkPerMW` seed moves from
  0 to the computed value at one reference distributor.
  - This is a single-market seed change, so the PR body carries the arithmetic and your merge is
    the sign-off.
  - If Sub-5 then beats the conventional case, it appears on the home page. The assertion in
    `e2e/opportunities.spec.js` changes in the same PR, and the PR says so.
- **The Sub-5 cost (G52).** If you obtain a 5 MW / 20 MWh quotation, `buildPremiumPct` is
  re-sourced, the way the 2026-10 supplier quote re-sourced the large-project capex.
- **Sub-5 as a play (the second half of decision 1A)**, once G48 and G52 close.
  - It needs a new play field, `connection: 'distribution'` with `powerMW`, and your call text for
    the four investors.
  - Check the NEM story's `reviewedAgainst` first.
- **AEMO's exemption guide.**
  - On the draft report (expected 18 December 2026), record the trigger's outcome with a content
    script, as the ERCOT MORA outcome was recorded.
  - On the final report, if 15 MW is adopted, re-scope the card: `powerMW`, the label "Sub-15", and
    the conditions.
- **Other markets**, each as its own PR when its gate closes:
  - Romania's auction cost on the conventional case (G54);
  - the PJM state card (G55);
  - the Finland sub-5 card (G56);
  - the ERCOT lease or toll terms (G53);
  - the Japan small-site terms (G57).

### Calendar

| When | What |
| --- | --- |
| Week of 30 November 2026 | Step 0 and PR 1 (about three working days, including the local browser suite) |
| From 18 December 2026 | AEMO's draft report: record the trigger's outcome |
| December 2026 | PR 2 (about four working days: licence check, connector, six price lists, derivation, tests) |
| About nine daily runs after PR 2 merges | A full trailing year of NEM prices; you may then set the NEM anchor |
| 1 July 2027 | FY2027-28 price lists: refresh the tariff table (trigger `nem-storage-tariffs-fy28`) |

## What moves when PR 1 merges

- The NEM Sub-5 card: 5.75% → 5.86% hold IRR at 7.5 months to COD, with an explicit 4h. It stays
  off the home page and the market page (decision 2A).
- ERCOT small: −13.29% → −6.30% (toll 2h, 7.5 months). Unshown; the fund call is Pass.
- Romania sub-5: 6.91% → 7.05% (equal timing). Unshown.
- Japan small (three areas): duration 9h → 4h; still no IRR on merchant lines.
- No grade, call, headline return, play or stored verdict changes. The view gains three triggers.
- PR 2 moves no number. It adds five feeds and the observed network line beside the card's zero
  seed.

## Research gates

| Gate | What | Close when | Source to read |
| --- | --- | --- | --- |
| G48 | NEM distribution storage tariffs, 2026-27 | Six distributors' storage tariffs tabulated with year and URL | Distributor network price lists; AER tariff structure statements |
| G49 | Distribution loss factors for HV-connected storage | Factors for the reference distributors' HV storage sites | AEMO annual loss-factor publication |
| G50 | Contingency share of battery FCAS revenue | One year of battery FCAS by service | AEMO Quarterly Energy Dynamics |
| G51 | IRP-SRA aggregator or retailer fee | A disclosed fee or contract range | Aggregator disclosures; trade press |
| G52 | Sub-5 build and connection cost; explicit transmission connection cost in the conventional stack | A 5 MW quotation or a disclosed project cost; a TNSP connection-cost source | Supplier quotation; developer and lender disclosures; TNSP connection pricing |
| G53 | ERCOT 9.9 MW duration, distribution charges, lease or toll terms | Two disclosed projects | Developer releases; utility tariffs |
| G54 | Romania connection-auction prices, and storage scope | First auction results; the ANRE order text | ANRE; Transelectrica |
| G55 | Maryland and New Jersey distributed-storage contract prices | Tranche awards or a final order with prices | Maryland PSC; NJBPU |
| G56 | Southern Finland sub-5 distribution connections | A distributor's published position and storage tariff | Southern distributors; Energiavirasto |
| G57 | Japan small-site duration and low-voltage balancing terms | Two disclosed high-voltage small sites; EPRX low-voltage qualification rules | Developer disclosures; EPRX; METI |

Triggers, with no gate:
- AEMO's exemption-guide draft report (expected 18 December 2026) and final report;
- the 2027-28 NEM network price lists;
- the CPUC Screen Q decision;
- IESO LGP storage eligibility (a watch item; Ontario has no view record);
- Gridcog's monthly benchmark, as an outside cross-check.

## Sources

NEM
- AEMO, Small Resource Aggregators in the NEM, fact sheet (July 2024): https://aemo.com.au/-/media/files/electricity/nem/participant_information/registration/2024/registration-fact-sheet-nem-small-resource-aggregators.pdf
- AEMO, Exemption from registering as a Generator in the NEM: https://aemo.com.au/energy-systems/electricity/national-electricity-market-nem/participate-in-the-market/registration/exemption-from-registering-as-a-generator-in-the-nem
- TasNetworks, Exemptions from AEMO registration for embedded generation: https://tasnetworks.com.au/Documents/Manual-documents/Connections/Contracts,-policies-and-applications/Exemptions-from-AEMO-Registration-for-Embedded-Gen
- AEMO, Guide to Registration Exemptions and Production Unit Classifications consultation: https://www.aemo.com.au/consultations/current-and-closed-consultations/guide-to-registration-exemptions-and-production-unit-classifications
- MinterEllison, AEMO opens review of the registration exemption guide: https://www.minterellison.com/articles/aemo-opens-review-of-registration-exemption-and-production-unit-classifications-guide
- AEMC, Integrating energy storage systems, network charges fact sheet (December 2021): https://aemc.gov.au/sites/default/files/2021-12/5._fact_sheet_-_network_use_of_system_charges.pdf
- pv magazine Australia, Third CIS tender seeks 4 GW / 16 GWh (30 MW minimum): https://www.pv-magazine-australia.com/2024/11/14/third-cis-tender-seeks-4-gw-16-gwh-dispatchable-capacity-for-the-nem
- RenewEconomy, CleanPeak buys SEI (17 April 2026): https://reneweconomy.com.au/small-solar-and-battery-specialist-adds-another-27-projects-as-it-buys-up-competitor/
- RenewEconomy, Rest and MPower (2 November 2026): https://reneweconomy.com.au/major-australian-super-fund-bets-bigger-on-small-solar-and-battery-specialist/
- RenewEconomy, Wollemi Capital and MPower (11 September 2025): https://reneweconomy.com.au/faster-and-cheaper-matt-keans-wollemi-capital-bets-big-on-the-power-of-small-solar-and-batteries/
- ESS News, Anza Power (16 January 2026): https://www.ess-news.com/2026/01/16/anza-power-makes-big-entry-in-australia-with-1-4-gw-solar-and-3-4-gwh-battery-pipeline/
- ESS News, Enervest and Billion Watts (3 June 2026): https://www.ess-news.com/2026/06/03/enervest-teams-with-taiwanese-partner-to-progress-sub-5-mw-solar-and-battery-portfolio/
- Enervest, Sub-5 projects: https://enervest.com.au/sub-5-projects/
- Gridcog, NEM sub-5 MW solar and storage benchmark, June and July 2026: https://www.gridcog.com/benchmark-projects/nem-sub-5mw-solar-and-storage---june-2026 and https://www.gridcog.com/benchmark-projects/nem-sub-5mw-solar-and-storage---july-2026
- Gridcog, Network pricing signals for community batteries (2022): https://www.gridcog.com/blog/network-pricing-signals-for-community-batteries-which-network-offers-the-best-tariff
- AER, Essential Energy 2024–29 tariff structure statement, final decision (April 2024): https://aer.gov.au/system/files/2024-04/AER%20-%20Final%20Decision%20Attachment%2019%20-%20Tariff%20structure%20statement%20-%20Essential%20Energy%20-%202024%E2%80%9329%20Distribution%20revenue%20proposal%20-%20April%202024_0.pdf

Other markets
- ERCOT, Distributed generation resource registration: https://www.ercot.com/services/rq/re/dgresource
- ERCOT, DG and DR in ERCOT (June 2023): https://www.ercot.com/files/docs/2023/06/02/DG_and_DR_in_ERCOT_06022023.pdf
- Modo Energy, ERCOT BESS buildout Q2 2026 (27 July 2026): https://modoenergy.com/research/en/ercot-bess-buildout-16-gw-q2-2026-growth-slowing
- Bimergen Energy, acquisition of 79.2 MW of DG BESS in ERCOT South (3 March 2026): https://www.sahmcapital.com/news/content/bimergen-energy-completes-acquisition-of-792-mw-of-late-stage-dg-battery-energy-storage-projects-in-ercot-south-from-aggreko-and-executes-simultaneous-financing-2026-03-03
- The Energyst, GridBeyond and the 29.7 MW Texas Ten portfolio: https://theenergyst.com/gridbeyond-launches-commercial-optimisation-of-29-7mw-battery-portfolio-in-ercot-new-co-optimised-market/
- CMS, ANRE grid capacity allocation (29 December 2025): https://cms.law/en/rou/legal-updates/romania-s-energy-authority-amends-electricity-grid-capacity-allocation-mechanism
- CMS, Romania tightens grid access and licensing (28 May 2026): https://cms.law/en/rou/legal-updates/romania-tightens-electricity-grid-access-and-licensing
- Energy-Storage.news, Romania ends double charging: https://www.energy-storage.news/romania-supports-energy-storage-regulator-ends-double-taxing/
- Japan Energy Hub, GATES low-voltage battery pilot (8 September 2026): https://japanenergyhub.com/news/gates-low-voltage-bess/
- Maryland PSC, Energy storage: https://psc.maryland.gov/regulated-utilities/electricity/renewable-energy/energy-storage/
- NJBPU, GSESP Phase 2 Block 1 stakeholder meeting (September 2026): https://www.nj.gov/bpu/pdf/publicnotice/Phase2%20Block1_Sep%202026%20Public%20Stakeholder%20Meeting.pdf
- Fingrid, storage connection restrictions in southern Finland (26 September 2025): https://www.fingrid.fi/en/news/news/2025/fingrid-secures-transmission-capacity-for-growth-in-electricity-consumption-and-new-industrial-investments--restrictions-on-new-energy-storage-facility-connections-continued-in-southern-finland
- Fingrid, main grid fees and connection principles for storage (30 October 2024): https://www.fingrid.fi/en/news/news/2024/changes-to-the-main-grid-fees-and-connection-principles-for-electricity-storages/
- Fingrid, storage capacity in Finland exceeds 1,000 MW (2026): https://www.fingrid.fi/en/news/news/2026/the-combined-capacity-of-electricity-storages-in-finland-now-exceeds-1000-mw/
- CPUC, Rule 21 rulemaking history (R.25-08-004): https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/infrastructure/rule-21-interconnection/rulemaking-and-regulatory-history
- IESO, Local Generation Program: https://ieso.ca/Sector-Participants/Engagement-Initiatives/Engagements/Local-Generation-Program
- IESO, LGP response to feedback (April 2025): https://ieso.ca/-/media/Files/IESO/Document-Library/engage/lgp/LGP-20250423-ieso-response-to-feedback.pdf
- gov.pl, Licence for electricity storage: https://www.gov.pl/web/national-contact-point-for-renewable-energy-sources/licence-for-electricity-storage
- Osborne Clarke, Battery energy storage systems in Italy: https://www.osborneclarke.com/insights/battery-energy-storage-systems-bess
- ESS News, Spain advances 1.9 GW of storage (21 October 2026): https://www.ess-news.com/2026/10/21/spain-advances-1-9-gw-of-energy-storage-projects/
- ESS News, Regulatory changes boost energy storage in three Spanish regions: https://www.ess-news.com/?p=7917
- AEMO, WEM Rule Participant classes and exemption criteria: https://aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/participate-in-the-market/information-for-current-participants/rule-participant-classes
- GT Law, UK grid connection reforms (April 2025): https://www.gtlaw.com/en/insights/2025/4/uk-grid-connection-reforms-breaking-the-bottleneck
- DESNZ and Ofgem, Connections reform delivery update and battery capacity (April 2026): https://www.gov.uk/government/publications/connections-reform-delivery-update-and-battery-capacity
- ESS News, Germany records 574 GW of battery storage requests in 2025: https://www.ess-news.com/2026/08/26/germany-records-574-gw-of-battery-storage-requests-in-2025/
- Rödl & Partner, Germany battery storage grid connection (February 2026): https://www.roedl.com/en/insights/germany-battery-storage-energy-transition-grid-connection-regulation-economic-risks-challenges-storage-projects/

The model figures come from read-only probes of `compareOpportunity` at `46836048` (infrastructure
fund lens; the other investors' hold IRRs are the same). They are reproducible by calling it with
the inputs in each table row.
