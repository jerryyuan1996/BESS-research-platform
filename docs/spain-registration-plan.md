# Spain (`es`) — registration plan, 2026-10-29

**Call: register Spain by analyst ruling as an engine-ready 4-hour merchant market, with the new
capacity market as a dated trigger rather than a revenue line.** A 1 MW / 4 h battery trading
Spain's 2025 day-ahead prices earned **€111.3k/MW-yr** (one cycle a day, 88% round trip, perfect
foresight). That is below Poland (€145.7k), Germany (€134.6k) and Romania (€176.8k) but above Italy
South (€77.0k), and 2026 is running **43% higher**. Spain's own fleet is tiny (96 MW at end-2025, 193 MW in April 2026), so the
fleet path takes 7.4% off by a 2028 COD: **year-1 merchant €103,050/MW**. The capacity market
(Order TED/966/2026) is law, but no auction, price cap or battery firmness factor exists yet; the
first auction is expected in Q1 2027. Evidence: **Fair** for the merchant line and for capex.

Scout graduation is not the route: no card exists and `GRADUATION` needs two consecutive reviews.

**Status: signed off 2026-10-29 with every recommended option, and built (uncommitted).** Spain is
the eighteenth registered market (`src/markets/es/`), engine-ready and not yet graded. What the
build found:

- **The return is thin on merchant alone.** All-equity hold IRR 2.58%, fourteenth of seventeen priced
  markets (exit −2.51%); 4.1% on the investment page's 20-year basis. €103k/MW gross against
  €880k/MW of capex leaves the case to the upside this plan does not count: balancing (ES-3) and a
  capacity award (ES-1).
- **Evidence is Fair, not Strong** (corrected in §2): the path rides the Bulgarian curve.
- **Two peers' derived asset-return grades move** in the seventeen-market ranking: Great Britain 2 → 3,
  Tokyo 1 → 2. Applied by the analyst's ruling of 2026-10-29, one changelog line each.

---

## 1. Day-ahead value — the merchant-lines method on OMIE prices

Data: OMIE `marginalpdbc` files, Spanish zone column, 1 January 2023 to 29 October 2026, 1,395 of
1,398 days (3 files did not download: 28 May 2023, 30 October 2025, 27 November 2025). Hourly to
30 September 2025; 96 quarter-hours from 1 October 2025, averaged to hours as the merchant-lines plan
does. OMIE's legal notice allows free use of published information if the source is cited.

Method (`docs/merchant-lines-plan-2026-10.md`, "How the prices were read"): each day a 1 MW battery
runs one full cycle, charges before it discharges, buys 1/0.88 MWh for each MWh sold, and the best
schedule is found exactly. **Check:** the same code on SMARD's 2025 German prices gives €79.4k (2 h)
and €133.6k (4 h) at a €89.3/MWh mean, against the plan's €79.5k, €134.6k and €89.3: within 0.7%.

| Year | 2 h value | 4 h value | TB2 | TB4 | Mean price |
|---|---|---|---|---|---|
| 2023 | €44.4k | €76.5k | €69.7 | €62.4 | €87.1/MWh |
| 2024 | €44.7k | €76.5k | €67.4 | €60.1 | €63.0/MWh |
| **2025** | **€64.1k** (€175.6/day) | **€111.3k** (€304.9/day) | €93.1 | €83.3 | €65.2/MWh |

**2026 so far** (1 January – 29 October, same days of each year): 2 h +35.8%, 4 h +43.0%, mean price
+27.9% (€64.6 → €82.6). The rise is in the autumn: the 4 h value was €696, €752 and €694/MW/day in
August, September and October 2026, against €368, €387 and €342 a year earlier, with mean prices of
€118–162/MWh. This is the same autumn spike the merchant-lines plan saw in Romania.

**Spain is a solar spread market.** The mean price fell from €87 to €65 between 2023 and 2025 while
the 4 h value rose 45%: midday prices collapse (April–May 2025 means of €27 and €17/MWh) and evenings
hold. That is the shape a 4-hour battery is built for, and why 4 h earns 1.74× the 2 h value.

## 2. Spain's dated fleet path

Average load: **29.22 GW** (REE, 2025 national demand at power-station busbars, 256 TWh ÷ 8,760).

| Year | Battery fleet, annual average | Basis | Factor |
|---|---|---|---|
| 2025 | 0.06 GW | REE: 28 MW (April 2025), 96 MW (end-2025) | 1.000 |
| 2026 | 0.35 GW | REE: 193 MW (April 2026); 1.76 GW approved in Q2 2026 | 0.993 |
| 2027 | 1.5 GW | PINALM cohort starts; FRV 1.2 GW ready-to-build 2026–27 | 0.966 |
| 2028 | 3.5 GW | Most of PINALM's 2.2 GW / 9.4 GWh (36 months from December 2025) plus merchant builds | **0.926** |
| 2029 | 5.5 GW | PINALM deadline 31 December 2029; 7.6 GW in permitting (December 2025) | 0.894 |
| 2030 | 7.5 GW | Toward PNIEC's battery share of its 22.5 GW storage target | 0.868 |

Factor = 1 − 0.243 × (1 − e^(−x/0.324)), x = (fleet − 0.06) ÷ 29.22, the curve fitted on Bulgaria.

### Proposed comparison inputs

- `merchGross`: **€103,046** = 111,284 × 0.926 (4 h, year 1 = 2028; €103,050 in the first draft of
  this plan, which rounded the daily value to €304.9).
  `merchantCurve: [1.000, 0.965, 0.937]` (0.894 ÷ 0.926, 0.868 ÷ 0.926), held after year 3.
- Band (observed ends): low **€68,980**: the 2024 value (€76.5k) on a fast path (5 GW by 2028,
  factor 0.901). High **€159,615**: the 2026 year-to-date rate (€455.9/day) on a slow path (1.8 GW,
  factor 0.959).
- `feePct: 10`. `merchantEvidence` declared: coverage = observed ÷ (seed ÷ 0.926) = **100%**, as it
  is by construction for a seed restated from its own observation. The path rides a curve fitted on
  Bulgaria, so `pathFit: 'other-market'`, as for Romania: **Fair** under the merchant-coverage rule.
  (Corrected 2026-10-30: the first draft said 108% and Strong, dividing by the seed instead of the
  restated line, and missed the own-market condition.)
- `services: 0`. Spain's aFRR band and mFRR pay batteries, and REE's balancing costs hit a record
  after the April 2025 blackout (€27.27/MWh on the final price in 2025; January–September 2026 costs
  +37.3%). But no band price has been read: REE's data sit behind an esios token (gate ES-3). The
  Clean Horizon index (2 h, €252k/MW-yr in June 2026, all revenue streams) against this plan's
  June 2026 2 h day-ahead rate (€88.7k) shows how much intraday and balancing may add. It is not a
  seed: a third party's index. Upside, not modelled.
- `contracted: 0`, `contractYears: 0` until the first capacity auction clears (§3).
- Archetype **50 MW × 4 h**. PINALM's cohort averages 4.3 h (9.4 GWh ÷ 2.2 GW) and a capacity
  market credits firmness by duration.

## 3. The capacity market — law, not yet revenue

Order TED/966/2026 (BOE 17 September 2026, in force 18 September), after the European Commission's
approval on 29 May 2026 (up to €9bn over 2026–2036):

| Term | What the order says | Article |
|---|---|---|
| Auctions | Main (delivery starts within 5 years) and adjustment (12 months, starting within 12 months). Transitional one-year auctions for each calendar year until the first main delivery period | art. 7; transitional provision |
| New storage | Commitment of **half the reference technology's useful life, never more than 15 years**. A new-investment quota may allow up to 9 years from award to delivery | art. 7.1.a |
| Existing capacity | 12 months | art. 7.1.a |
| Firm capacity | Installed MW × a firmness coefficient from 0 to 1, set in each call by the Secretary of State on CNMC's proposal | art. 3.f, 10 |
| Price | **Pay-as-bid**. The demand curve's cap is a fixed €/MW-firm-year and **may be confidential** | art. 15.1, 15.3, 16.1 |
| Indexation | "El precio de adjudicación y la potencia firme adjudicada no serán objeto de actualización": **none** | art. 15.2 |
| Obligation | Availability in stress hours, no more than 10% of the year. Penalty = shortfall × price × 1.2. Failed tests cost a month, then a quarter, then the year and the right to bid | art. 22, 24.4, 27 |
| Stacking | Public aid must be fully reflected in the bid. No other capacity payment, and no specific balancing product paid for the same MW and period | art. 11.i–m |
| Emissions | New capacity must be non-emitting; existing up to 550 g CO₂/kWh | art. 11.c |

No figure in euros appears anywhere in the order. The first auction needs a call, firmness
coefficients and a demand curve. Sector estimates put it in January–March 2027 (Energía Estratégica,
September 2026).

**Proposal:** the market goes in engine-ready on merchant revenue, with a trigger
`es-first-capacity-auction`: "First Spanish capacity auction clears, with battery firmness
coefficients published". When it clears, the capacity line is entered as a play (`es-cap-4h`) at the
cleared price × the 4 h firmness coefficient, for the commitment the call sets (half of a 15–20-year
battery life: 7.5–10 years).

## 4. Capex, grants and tax

**Capex: €880,000/MW** (€220/kWh × 4,000), the midpoint of the €180–260/kWh European turnkey 4 h band,
method `'held'`. This is Italy's basis exactly (`src/markets/it/comparison.js`), so the two southern
markets compare on one survey. Band €720,000–€1,040,000. The ceiling is near PINALM's eligible-cost
cap of €250/kWh for standalone storage (€1.0m/MW at 4 h). Opex seed €10,000/MW/yr (Ireland and Poland
range; gate ES-4).

**PINALM grants** (IDAE, FEDER 2021–27, final award 30 December 2025): €818.3m to 126 projects
(69 hybrid, 39 standalone batteries, 15 thermal, 3 pumped hydro) adding 2.2 GW / 9.4 GWh. Projects must
be built within 36 months of the award and by 31 December 2029. Round 1 is closed, so a new investor
reaches a grant only by buying an awarded project. That is the Polish grant-awardee play
(`pl-grant-4h`), and it needs the aid per project from IDAE's resolution (gate ES-5).

**Tax:** `es: tax([.25, .25], ['es'])`, 25% corporate income tax (Agencia Tributaria). `vatPct: 21`,
recoverable. The 7% generation tax (IVPEE) is cut by RDL 18/2026: 7% on a reduced base in 2026,
3.5% in 2027, **0% from 2028**. Whether storage discharges were ever in scope is disputed (PwC, June
2026). A 2028 COD never pays it, so it is not modelled.

**Debt:** merchant cash at 2.00x DSCR under the 2026-10-29 conventions. A capacity award would add
contracted cash at 1.20x (a state contract over 7 years) once it exists.

## 5. Registration contract (docs/adding-a-market.md, step 6)

| Item | Proposal |
|---|---|
| Manifest | `id: 'es'`, slug `spain`, `currency: 'EUR'`, `locale: 'es-ES'`, `timezone: 'Europe/Madrid'`, `modelVersion: 'es-1.0-omie-merchant'` (18th market if Saudi Arabia registers first) |
| Remove from scout roster | `SCOUT_ROSTER` drops `es`; Southern and Eastern Europe scouts the Netherlands and Bulgaria |
| Congestion register | `es/congestion.js`: REE's published available access capacity by node, and the capacity-tender regime for saturated nodes (gate ES-7) |
| Grid map + boundary | Peninsular Spain (the capacity market is peninsular); OSM lines |
| Transmission voltage | `es: { bulkKV: 400, detailKV: 220, operator: 'Red Eléctrica (REE)', levels: ['400 kV', '220 kV'] }`, the Irish precedent |
| Bounding box | `etl/sources/osm-grid.mjs`: about 35.9–43.8°N, 9.4°W–3.4°E |
| Pipeline source | `projectPipelineSources.js`: MITECO storage approvals; IDAE PINALM resolution |
| Price feed | New `etl/sources/omie.mjs`: public, no key, source cited. ENTSO-E (`10YES-REE------0`) once `ENTSOE_TOKEN` exists |
| Dashboard | Ten sections in seven tabs; revenue sections `energy` (day-ahead) and `capacity` (the order, no price yet); `services` per tabGroups |
| Decision profile | `es`: confidence 6. Merchant line Fair, capex Fair, capacity pending. Play `es-merchant-4h` (COD 2028) |
| Flag | `es` already in `COUNTRY_FLAGS` from the scout roster |
| Derivation | `scripts/derive/spain-registration.mjs`: the OMIE fetch, the dispatch and the path, so every figure above reproduces |
| Tests | ids and counts in `registry.test.js`, `grid-maps.test.js`, `bundle-budget.test.js`, `scout.test.js` |

## 6. Research gates

- **ES-1** First capacity auction: call, firmness coefficients by duration, demand-curve cap (if
  published), cleared prices. Becomes trigger `es-first-capacity-auction`.
- **ES-2** Re-read the fleet path on REE's quarterly installed-battery counts.
- **ES-3** Balancing prices (aFRR band, mFRR) from REE esios: free token on request.
- **ES-4** Spanish opex, including access tolls for storage.
- **ES-5** PINALM aid per project from IDAE's resolution, for an awardee play.
- **ES-6** Iberian basis. Portugal shares the price in most hours; adding its ~52 TWh load and its
  fleet to the path is a refinement.
- **ES-7** REE nodal access capacity for the congestion register.

## 7. Decisions for Jerry

1. **Archetype and seed.** (a) 4 h, €103,050. *Recommended*: Spain's spread is a solar evening
   spread, PINALM builds average 4.3 h, and firmness favours duration. (b) 2 h, €59,349.
2. **Which year sets the level.** (a) 2025, the last full year, with 2026 as the band's ceiling.
   *Recommended*: the merchant-lines rule used it for Romania and Poland. (b) 2026 year to date
   (€166k at 4 h before the path), with the autumn spike in the seed.
3. **Capacity payments and the 2.5% convention.** (a) Treat a Spanish capacity award as nominal,
   because art. 15.2 forbids updating the price, an exception to the 2026-10-29 rule like Japan's
   official CPI path. *Recommended*. (b) Index it at 2.5% like every other contract. Nothing moves
   until the first auction clears; the decision sets how it enters.
4. **Grant play.** (a) Add `es-pinalm-4h` once ES-5 gives the aid per project. *Recommended*.
   (b) Add it now at an estimated cohort intensity.

---

Sources: OMIE, marginalpdbc day-ahead files, 2023–2026 (omie.es, legal notice); SMARD (Bundesnetzagentur)
filter 4169, 2025, for the method check; REE, *Informe del Sistema Eléctrico 2025* (11 March 2026)
and year-end 2025 data; REE installed-battery figures as reported (Híbridos y Eléctricos, April 2026);
ESS News (Q2 2026 approvals, 17 July 2026; capacity market, 17 September 2026; Clean Horizon indices,
August–September 2026); BOE, Order TED/966/2026 (BOE-A-2026-19329); European Commission approval,
29 May 2026; Energía Estratégica on the first-auction timing; MITECO, PINALM final award press
release, 30 December 2025; Order TED/535/2025 (PINALM bases); Osborne Clarke on RDL 18/2026; PwC,
*Almacenamiento energético: claves fiscales* (June 2026); FRV, February 2026; Agencia Tributaria
(corporate tax). The capex band is the European survey already cited in the Italian file.
