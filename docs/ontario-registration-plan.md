# Ontario (`ca_on`) — registration plan, 2026-10-23

**Call: register Ontario by analyst ruling, the way Finland came in, as an engine-ready 8-hour
contracted-capacity market.** IESO's LT2 window 1 capacity contract is a 20-year, CPI-part-indexed
fixed payment per MW-Business Day, and the owner keeps every market revenue. The three winners, all
8-hour batteries, cleared at C$527.20–614.47. Day-ahead trading on IESO's post-renewal prices adds
about C$74.8k/MW a year before fees. So the contract (C$141.4k) is about two-thirds of revenue and
trading about a third. Evidence: **Strong** for the contract, **Fair** for capex and for the merchant line.

Scout graduation is not the route: no card exists and `GRADUATION` needs two consecutive reviews.

**Status: signed off 2026-10-23 with every recommended option, and built (uncommitted).** Ontario is
the sixteenth registered market (`src/markets/ca_on/`), engine-ready and not yet graded: hold IRR
6.81%, eighth of sixteen; 67.8% of year-1 revenue contracted. Three things the build found:

- **Fade against the 85% default.** With no augmentation and 2%/yr fade an 8-hour build tests at
  5.45 h by year 20 and needs 11.7 h to hold its rating; payment scales with tested capacity and
  two failed tests below 85% are a default (s.15.6). Modelled as a linear floor; the default is not.
- **Peers' derived asset-return grades move.** In the hold-IRR ranking over sixteen, Tokyo goes
  2 → 1 and the NEM 3 → 2, and GB and the NEM land in different fifths on hold and exit IRR. Stored
  grades are the analyst's and are not changed; `tests/view.test.js` reports it.
- **Ungraded is a new state.** An ungraded market carries no Brief or Entry section, so its landing
  tab shows the overview (`src/markets/tabGroups.js`); the scout roster drops to eight.

---

## 1. The LT2(c-1) contract

Source: IESO, *LT2(c-1) Contract, consolidated with Addenda 1–3*, 4 November 2025 (the final form;
checked against the 11 September 2025 consolidation, and the clauses below are unchanged except
Exhibit J's indexing, noted). *LT2(c-1) RFP, consolidated with Addenda 1–4*, 10 November 2025.
Results table, 13 July 2026. IESO's terms permit reuse.

| Term | What the contract says | Clause |
|---|---|---|
| Term | From COD to **30 April 2050**. Milestone COD **1 May 2030**, so 20 years for a project on time. Longstop 18 months after the milestone. The IESO may extend to the day before the 20th anniversary of the later of COD and milestone; a 21st year needs the owner's consent | s.1.1 "Expiry Date"; s.9.1; Exhibit P |
| Market revenue | **Retained.** The IESO "shall have no interest" in the facility's other products or services, except future capacity-related products, which the owner may not sell without consent. The monthly payment has no revenue-netting term | s.2.10(a), s.2.11, Exhibit J |
| Minimum duration | **8 hours.** Duration Capability is 8 or 12 hours; 12 h+ storage earned 2 rated points, 8–12 h earned none. Must deliver contract capacity for 8 consecutive hours inside Qualifying Hours (07:00–23:00 EST, Business Days) | Exhibit A; RFP s.1.2(f), s.2.1(c), s.4.3 |
| Business Days | Weekdays less the holidays on IESO's *Physical and Financial Market Holiday Schedule*, **except** Easter Monday, Remembrance Day and NDTR. That leaves 10 holidays, all placed on weekdays (IESO moves weekend holidays to the next weekday: 27 Dec 2021, 3 Jan 2022, 3 Jul 2023) | s.1.1 "Business Day" |
| Payment | MP = IFCP × Business Days × contract MW × CRF × FMCRF − availability charge + storage regulatory credit | Exhibit J |
| Indexation | Whole price follows Ontario CPI from contract date to COD (FCP_COD = FCP × CPI_COD / CPI_CD). From year 2: **20% of FCP_COD follows CPI, 80% is fixed in nominal dollars** | Exhibit J (final form) |
| Early-COD bonus | None for storage. The 1.2–1.5× multiplier is for non-storage facilities only | s.2.3(b) |
| Tax credits | The Clean Technology ITC (ITA s.127.45) and the Clean Electricity ITC are **excluded** from the 50% clawback on future government support. The owner keeps them | s.1.1 "Future Government Support Program"; s.2.15 |
| New tariffs | If tariffs introduced after the 18 Dec 2025 bid deadline raise capex >10%, the owner may ask for a new price; if the IESO refuses, the contract ends at no cost | s.2.16 |
| Storage protections | Charging-side uplifts and Global Adjustment reimbursed (scaled by round-trip efficiency against 0.75). If a market-rule change stops the owner covering charging cost from market revenue, the price rises by up to 15% | Exhibit S; s.1.6(c) |
| Fade | After year 3 the owner may cut contract capacity by up to 7% of the original, at most three times; payment falls in proportion | s.4.3 |
| Penalties | Availability charge = monthly payment × shortfall × 1.0–2.0 by month. Planned outages cut obligation by at most 5% a month. Delay LDs C$150/MW-Business Day, capped at 548 days | Exhibits E-2, F; s.2.3(c)–(d) |

**Business-day count.** Counted day by day from the definition, checked against IESO's 2021–2023
schedules: 250–252 a contract year, **mean 250.90** over the 20 contract years May 2030–April 2050
(5,018 days). Proposed constant: **251**. "250" understates by 0.36%.

**Results.** RFP target was up to 600 MW; IESO contracted 640 MW, all storage, all 8-hour — none took
the scored 12-hour option. Durations are from each owner's announcement; IESO's table omits them.

| Project | Zone | Contract MW | Build (owner) | C$/MW-BD | × 251 = C$/MW-yr |
|---|---|---|---|---|---|
| Napanee BESS Phase 2 (Atura Power, OPG) | East | 300 | 300 MW, up to 8 h → 2,400 MWh | 527.20 | 132,327 |
| Eagle Lake Power Reserve (Neoen) | Northwest | 190 | 200 MW / 1,600 MWh, in service 2030 | 580.50 | 145,706 |
| Simcoe Battery Project (NRStor, Aecon, Sitka) | Southwest | 150 | 150 MW / 1,200 MWh | 614.47 | 154,232 |
| Weighted (IESO's figure) | | 640 | | **563.48** | **141,433** |

Check: (300 × 527.20 + 190 × 580.50 + 150 × 614.47) ÷ 640 = 360,625.5 ÷ 640 = 563.477. All three
are 50% First Nation–owned. Eagle Lake is built 10 MW above its contract.

**Window 2.** Drafts posted 9 October 2026 (LT2(c-2) RFP and contract, with blacklines). Same 8/12 h
options, 20/80 indexation, 7% reduction and tariff clause; milestone COD **1 May 2032**, expiry
**30 April 2052**; repowered sites may bid under a cap; target MW and dates still blank. This is the
entry point for a new investor, so it is the play to model.

### Proposed comparison inputs

- `capabilities.capacityMarket: true`; `contracted: 141433` (C$563.48 × 251); `contractYears: 20`
  (the engine caps at `LIFE` = 15, so five contracted years fall outside the window, as with Japan's
  20-year award; the long-life view shows them); `postFactor: 0` (no post-2050 mechanism).
- Band on `contracted`: **132,327–154,232**, the cleared range × 251. Source: IESO results table.
- `capNote`: "IESO LT2 capacity contract to 2050, 20% CPI-indexed; must offer in the day-ahead market
  16 h each Business Day; availability charges up to 2× monthly payment".
- **Real-terms erosion (decision 2).** The engine is real-terms and the 80% fixed part loses value at
  2% CPI (the `CPI_PCT` the supplier-quote work used). Year-y real factor = 0.2 + 0.8 × 1.02^−(y−1);
  the 15-year mean is 0.2 + 0.8 × 0.8738 = **0.899**, so a flat-equivalent line is 141,433 × 0.899 =
  **C$127,148**. No other market deflates its contract line today.
- Archetype: **50 MW × 8 h**, what all three winners built.
- `grantPct: 30` — the CT-ITC, refundable, for storage available for use before 2034 (15% in 2034,
  nil after). Window 1 (COD by 2030) and window 2 (by 2032) both qualify. Kept by contract s.2.15.
  The full rate needs the labour requirements; otherwise 20% (gate ON-4). It is not double support:
  the contract lets the owner keep it, so bids were priced with it.
- `vatPct: 13`, `vatRecoverable: true` (Ontario HST).

## 2. FX — add CAD to the frozen table

Required: validation refuses a manifest currency without an FX row. Pricing Ontario in USD instead
would bury a conversion in the market file and make the contract price unreadable.

**Proposed `CAD: 0.67`**, by the PLN method of 2026-10-12 (through the euro seed, so the platform's
EUR/CAD cross equals ECB's): ECB on the seed date 28 July 2026, CAD 1.6036 per EUR →
1.08 ÷ 1.6036 = **0.6735**. The observed cross that day was 1.1367 ÷ 1.6036 = 0.709; using it would
make an EUR-priced DC block about 5% dearer in USD in Ontario than in Finland, an artefact.
Also add `'CAD'` to `NEEDED` in `etl/sources/ecb.mjs` so the live ECB cross exists (ECB publishes CAD).

## 3. Capex — rebuild Ontario's one observed cost with the HiTHIUM block

Duty and surtax, verified against government text:

- **MFN duty 7%.** Customs Tariff T2026, 8507.60.90 00 "Lithium-ion — Other". China takes MFN.
- **No surtax.** The China Surtax Order (SOR/2024-187) now covers only steel and aluminium at 25%;
  SOR/2026-33 repealed the EV schedule; no heading 8507 is listed (text current to 2026-09-30).
  Any later tariff falls under contract s.2.16.
- No FEOC rule and no US Section 301 tariff, so the reason US markets stay on NREL does not apply.

**What the winners and their neighbours disclose.** None of the three winners has published a cost:
Neoen states it is not disclosed, Simcoe's partners give no figure and Aecon's EPC agreement is not
final, and OPG gives none for Phase 2. Napanee Phase 1 (250 MW / 4 h) entered service in April 2026
"within the approved budget" (OPG, Q2 2026 results) but OPG and Atura publish no amount; the
C$600m and C$725m figures in trade press are not used. The one primary Ontario figure is **Oneida**:
250 MW / 1,000 MWh, 4 h, Haldimand County, "final cost of approximately $700 million, compared to
the initial $800 million estimate at financial close in 2023" (Northland Power, 7 May 2025) —
C$2.8m/MW, C$700/kWh, priced on 2023 DC blocks.

Method: the platform's **rebuilt** route (`capex.js`), which exists for an observed or benchmark total
priced on older DC blocks: keep its 44% power side, replace its 56% DC slice with the quoted block.
`quotedEconomics({ currency: 'CAD', hours: 8, method: 'rebuilt', total: T4, benchmarkHours: 4 })`,
which needs `CAD` added to `DUTY_PCT` (7) and `USD_PER` in `supplierQuote.js`.

| Step | Arithmetic | Result |
|---|---|---|
| Landed DC block | (73.45 × 1.07 + 0.768 commissioning + 1.5 freight) × 81.25/70 × 1.5923 CAD/EUR (ECB, 15 Oct 2026) | **C$149.45/kWh** at the meter |
| DC block at 8 h | 149.445 × 8,000 | C$1,195,560/MW |
| Oneida power side | 700,000,000 ÷ 250 = 2,800,000 × 0.44 | C$1,232,000/MW |
| **Oneida rebuilt, 8 h** | 1,195,560 + 1,232,000 | **C$2,427,560/MW** (C$303.4/kWh) |
| Net of 30% CT-ITC | × 0.70 | C$1,699,292/MW |
| NREL rebuilt, 8 h (option b) | US$334 × 4,000 × (1.5923 ÷ 1.1208) = 1,898,031 × 0.44 = 835,134 + 1,195,560 | C$2,030,693/MW (C$253.8/kWh) |

Oneida's figure is a project total, so it carries Ontario labour, the connection and owner's costs that
NREL's US installed cost does not; that is why it sits 20% above the NREL rebuild. With it as the
seed, `connectionFeePerMW` and `devCostPct` stay at zero so nothing is counted twice.

Band (observed ends, `band()` kind `sourced`): low **C$1,770,652** — US$230/kWh, the platform's US EPC
floor, rebuilt the same way; high **C$2,960,928** — NREL's total re-based to 8 h on the ERCOT
convention (8,000 × 187.04 + 587,840 = US$2,084,160 × 1.420682). Opex: the quote's service package at
8 h inside a seed of C$28,000/MW/yr (US$20,000 at 4 h, the US/NEM convention, × 1.4207; gate ON-3).

Sense check: year-1 cash of 141,433 contract + 74,783 × 0.9 trading − 28,000 opex = C$180,738/MW is
**10.6%** of the Oneida-based net capex (12.7% on the NREL basis) — a plausible 20-year contracted
yield, consistent with what three bidders accepted.

## 4. Merchant and ancillary — gate ON-1 closed

**Proposed `merchGross: 74783`, `feePct: 10`, `merchant: true`.** Derived on the platform's PJM
convention (`src/markets/pjm/comparison.js`): the daily sum of the N highest hourly prices less the N
lowest, × 0.88 round-trip × 0.97 availability × 0.85 imperfect foresight — with N = 8 for an 8-hour
battery. Charging-side uplifts and Global Adjustment are reimbursed by Exhibit S, so the energy price
alone is the right basis.

Data: IESO *Day-Ahead Hourly Ontario Zonal Energy Price* reports, 24 July – 23 October 2026, 90 days,
every hour priced; IESO's *Yearly HOEP OR Predispatch* reports 2023 and 2024 for the seasonal shape.
Both from reports-public.ieso.ca (no key; the older reports.ieso.ca now requires an account). IESO
keeps only the latest 92 days of day-ahead prices, and its day-ahead market began on 1 May 2025.

| Step | Arithmetic | Result |
|---|---|---|
| Mean daily TB8, 2026 window | Σ top-8 − Σ bottom-8 hourly day-ahead zonal prices, mean of 90 days | C$325.63/MW-day |
| Seasonal ratio | full-year mean TB8 ÷ same-window mean, on HOEP: 2023 161.19 ÷ 187.57 = 0.85936, 2024 191.48 ÷ 218.83 = 0.87502 | mean 0.86719 |
| Annual TB8 | 325.63 × 0.86719 × 365 | C$103,070/MW-yr |
| **merchGross** | × 0.88 × 0.97 × 0.85 = × 0.72556 | **C$74,783/MW-yr** |
| After fee | × 0.90 | C$67,305/MW-yr |

Band (observed ends): low **C$42,689** — HOEP 2023, the weakest full calendar year (annual TB8
58,835 × 0.72556); high **C$86,236** — the 2026 window without the seasonal discount
(325.63 × 365 × 0.72556). For reference, HOEP 2024's full year gives C$50,848 (70,081 × 0.72556).

Checks, none used as the seed:

- **Market Renewal lifted spreads.** Same window, TB8 C$325.63 on 2026 day-ahead prices against
  C$218.83 on 2024 HOEP: +49%. Mean price C$56.55/MWh against C$32.19 for 2024 as a whole.
- **Ordering.** A perfect-foresight daily dispatch of 1 MW / 8 MWh, charging before discharging,
  0.88 applied on charge, empty at each day's end, earns C$264.76/MW-day against TB8 × 0.88 =
  C$286.55. The convention reads 8% high; on the dispatch basis the seed would be C$69,096.
- **Week shape.** Weekdays C$363.92/MW-day, weekends C$226.08.
- **Location.** On IESO's nine virtual zones over the same days, TB8 runs from C$294 (Northwest) to
  C$339 (Ottawa). Against the provincial zonal price: East (Napanee) +3.7%, Southwest (Simcoe) −0.4%,
  Northwest (Eagle Lake) −9.7%; the three winners MW-weighted, −1.2%. Storage settles at its node, so
  that ±10% is site risk inside the number, and like PJM the market declares no `naqFactor`.
- **Basis rule.** The PJM and NEM seeds use a full calendar year. Ontario's day-ahead market has no
  full year IESO still publishes, so the year is built from the window and HOEP's seasonal ratio —
  hence Fair, and gate ON-1b.

**Ancillary: `false`.** Before Market Renewal, operating reserve averaged C$4.57 (10-minute
spinning), C$4.20 (non-spinning) and C$2.07 (30-minute) per MW-h in 2024; selling 10-minute spinning
every hour of the year would be C$40,024/MW. An 8-hour battery cycling daily cannot do that, and no
post-renewal year exists. Upside, not modelled.

## 5. Registration contract (docs/adding-a-market.md, step 6)

| Item | Proposal |
|---|---|
| Manifest | `id: 'ca_on'`, slug `ontario`, `currency: 'CAD'`, `locale: 'en-CA'`, `timezone: 'America/Toronto'`, 16th market so a hue + pattern pair (Finland precedent), `modelVersion: 'ca_on-1.0-lt2-contract'` |
| Remove from scout roster | `SCOUT_ROSTER` must drop `ca_on` — `tests/scout.test.js` asserts no id is in both sets |
| Congestion register | `ca_on/congestion.js`: IESO's LT2 window 2 Preliminary Connection Guidance (15 Oct 2026) as the capture evidence — capacity is allocated by zone in the procurement, not by a charge (gate ON-5) |
| Grid map + boundary | Ontario boundary from the boundary script; markers at the three project towns (Bath, Oxdrift, Simcoe) and IESO zone centroids — no substations plotted from memory |
| Transmission voltage | `ca_on: { bulkKV: 230, detailKV: 115, operator: 'IESO (IESO-controlled grid)', levels: ['500 kV', '230 kV', '115 kV'], url: 'https://www.ieso.ca/ontarioenergymap/' }`. IESO: "the high-voltage IESO-Controlled Grid which includes 115 kilovolt (kV), 230 kV, and 500 kV" lines, "over 30,000 kilometres". Detail at 115 kV is IESO's own floor. Bulk at 230 kV on the Irish precedent (220 kV bulk under a 400 kV tier); 500 kV draws inside it |
| Bounding box | `etl/sources/osm-grid.mjs`: Ontario, about 41.6–56.9°N, 95.2–74.3°W |
| Pipeline source | `projectPipelineSources.js`: IESO contracted-resources and LT1/LT2 results tables |
| Dashboard | Path A block engine, ten sections in seven tabs; revenue sections `capacity` (LT2 contract) and `energy`; `services` and `duration` per tabGroups |
| Decision profile | `decisionProfiles.js`: infrastructure fund reads the contract as secured revenue; play `on-cap-8h` (LT2 window 2 bid, COD 2032) |
| Flag | `ca` in `COUNTRY_FLAGS` and `styles/flags.css` |
| Tests | ids and counts in `registry.test.js`, `grid-maps.test.js`, `bundle-budget.test.js` |

## 6. Research gates

- **ON-1b** A full calendar year of day-ahead prices. IESO keeps 92 days, so add an IESO feed to the
  ETL (public, no key, terms permit reuse) and reprice the seed when it holds twelve months.
- **ON-2** Window 2 target MW and dates, when IESO posts them.
- **ON-3** Ontario opex for an 8-hour asset.
- **ON-4** CT-ITC eligible share of capex and whether labour requirements are met.
- **ON-5** Read IESO's 15 October 2026 connection guidance for the congestion register.
- **ON-6** A disclosed cost for an 8-hour Ontario build (Aecon's Simcoe EPC, if announced).

## 7. Decisions for Jerry

1. **Merchant seed.** ON-1 changes this decision: the market goes in engine-ready either way.
   (a) C$74,783 — the post-renewal window annualised — *recommended*: it is the market a 2030
   battery trades in. (b) C$50,848 — HOEP 2024, the last full calendar year, on the old market design.
2. **Contract line in real terms?** (a) Year-1 C$141,433 flat, as every other contract is entered —
   *recommended* for consistency, with the 0.899 erosion stated in `capNote`. (b) Deflate to C$127,148.
3. **Capex basis.** (a) Oneida rebuilt with the HiTHIUM block landed at 7% duty, C$2.43m/MW gross,
   30% CT-ITC as `grantPct` — *recommended*: Ontario's one published final cost. (b) NREL rebuilt the
   same way, C$2.03m/MW, the US basis.
4. **FX seed.** (a) `CAD: 0.67` through the euro seed — *recommended*. (b) 0.71 observed cross.

---

Sources: IESO LT2 page and documents named above; IESO Physical and Financial Market Holiday
Schedules 2021–2023; IESO public reports (Day-Ahead Hourly Ontario Zonal Energy Price; Day-Ahead
Hourly Virtual Zonal Energy Price; Yearly HOEP OR Predispatch 2023–2024); IESO, *Ontario's Electricity
System* map; ECB euro reference rates (CAD, USD); CBSA Customs Tariff T2026, chapter 85; Justice
Laws, SOR/2024-187 as amended by SOR/2026-33; Income Tax Act s.127.45; Northland Power, Oneida
commercial operations release, 7 May 2025; Neoen, Eagle Lake release, 23 June 2026; NRStor, Simcoe
release, 11 August 2026; OPG, 2026 second-quarter results; NREL, *Cost Projections for Utility-Scale
Battery Storage: 2025 Update* (as already cited in the CAISO and ERCOT files). The analyst's private
reading ranks Ontario first of the nine scout markets; nothing here rests on it.
