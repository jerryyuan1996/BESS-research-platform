# Four merchant lines against observed day-ahead prices — plan for sign-off

Drafted 2026-10-23 on `claude/finland-parity` (`bb5d4df`).

**Approved and built the same day.** All four decisions stand as recommended. As built:
- `economics.merchantCurve` in both engine paths; Romania €87,085 (year 1 = 2027) on 1.000, 0.955,
  0.934 and Poland €130,813 (year 1 = 2028) on 1.000, 0.970, 0.950, with observed duration curves.
- The merchant-line coverage rule in `src/governance/briefing.js`, declared by
  `comparison.merchantEvidence` for the four markets here; a market that declares no observed series
  is not marked by it yet.
- `pl-grant-4h` with the play field `grantPct` and its own Opportunistic fund call; `ro-mer-2h`,
  `pl-cap-4h`, the trigger `it-first-toll-price`, both theses and the re-ranked grades through
  `scripts/view/content/merchant-lines-2026-10.mjs`.
- Poland's `pl-day-ahead` dataset now runs on PSE (`etl/sources/pse.mjs`), with no key.
- `node scripts/derive/merchant-lines.mjs` reproduces the fit, the paths and the seeds.

A cross-check against an outside market report put four merchant lines in doubt: Romania, Poland,
Germany and Italy. The report is licence-restricted. Its extraction stays in `local-data/`, and
nothing below quotes it. Every number here is recomputed from public day-ahead prices or read from a
primary source, and each comes with its arithmetic.

## The answer

**Romania's merchant line comes down by a fifth, because of Romania's own batteries, not
Bulgaria's.**
- Bulgaria's fleet grew from about 500 MW (August 2025) to 5.4 GW (August 2026).
- Its two-hour day-ahead value fell 12% (January–July, year on year), while Romania's rose 6%.
- The border kept them apart:
  - Romania and Bulgaria cleared at the same price in 95% of hours in 2025, but in only 37% of hours
    in October 2026.
  - In the evening peak, Romania now clears €36/MWh above Bulgaria.
- Romania's own fleet went from 599 MW (1 April) to 989 MW (1 August), and is expected to double
  again by the end of the year.
- Fitted on what Bulgaria's fleet did to Bulgarian prices, that build takes 17% off Romania's
  two-hour value by 2027.
- **Proposed:**
  - **€110k → €87k in year 1 (COD 2027), €81k from year 3.**
  - **Hold IRR 20.2% → 13.7%.**
  - **Romania moves from first to fifth, and its best design from four hours to two.**
  - Evidence: Fair.

**Poland's merchant line is about half what the day-ahead market paid.**
- PSE's own 2025 day-ahead prices give a four-hour battery €145.7k/MW. The seed is €78k.
- 3.9 GW of grant-funded batteries finish by the end of 2028.
- PSE expects about 5 GW of capacity-market batteries by 2030.
- On the same Bulgarian curve, those two cohorts take 10% off by 2028.
- **Proposed:**
  - **€78k → €131k in year 1 (COD 2028), €124k from year 3.**
  - **Capacity 4h becomes the best design at 9.8% hold (from 3.2%).**
  - **Merchant 4h returns 7.4% (from 0.2%).**
  - **Every design still sits below the platform's yields.**
  - Evidence: Fair.
- The 169 grant-funded projects are a cohort a fund can buy. With the cohort's 37.9% grant, merchant
  4h returns 17.1% hold and is worth +$202k/MW.

**Germany and Italy keep their numbers, and both merchant lines are marked Thin.**
- **Germany:**
  - SMARD's 2025 prices paid 73% of the €184k line.
  - At that level, the merchant play returns 7.3%, not 13.9%.
  - 2026 is tracking 90%.
  - The fund play is already the toll.
- **Italy:**
  - GME's 2025 South prices paid 63% of the €123k line.
  - At that level, the capacity play returns 8.2%, not 14.6%.
  - 2026 is tracking 87%.
- **No toll play for Italy.**
  - At the platform's toll seed (€87k), a toll returns 5.1%.
  - It would need €158k a year to match the capacity play.
  - No Italian toll price has ever been disclosed.

**Recommend:**
- Add a dated merchant curve to the engine, applied to the arbitrage line (decision 1).
- Re-seed Romania and Poland from observed day-ahead value, with observed duration curves.
- Adopt one evidence rule for merchant lines (decision 2):
  - each line is measured against the latest year's observed value;
  - a play is marked no stronger than a merchant line that carries most of its revenue.
- Add no Italian toll play. Instead, add a trigger on the first disclosed Italian toll price
  (decision 3).
- Add a Polish grant-awardee play (decision 4).

## How the prices were read

**One definition everywhere.**
- For each delivery day, a 1 MW battery of *n* hours runs one full cycle. It charges before it
  discharges, and it loses 12% on the round trip (the platform's 88%).
- The day's best schedule is found exactly.
- The **day-ahead value** is that daily margin, averaged over the year and stated per MW per year.
  - It is perfect foresight on day-ahead prices alone: no intraday, no balancing, no optimiser fee.
- Prices are hourly throughout.
  - SDAC moved to 15-minute products on 1 October 2025. Since then, an hour is the mean of its four
    quarter-hours.
  - At 15-minute resolution, the same battery earned 3–9% more in 2026: Romania 2h +8.7%, Poland 4h
    +4.0%, Germany 4h +3.3%.

**The top–bottom spread (TB*n*)** is the mean of the day's *n* dearest hours less its *n* cheapest,
taken with no order and no losses.
- TB*n* × *n* × 365 is the theoretical figure that published spread indices imply.
- The day-ahead value is the part of it a battery can actually schedule.

**Average load.** Fleets are compared on consumption net of power plants' own use:
- Romania: 53.1 TWh, or 6.06 GW (Transelectrica, 2025 net internal consumption, preliminary).
- Bulgaria: 35.28 TWh, or 4.03 GW (ESO's 2025 yearbook: 38.88 TWh gross, less 3.60 TWh of plants'
  own use).
- Poland: 18,075 MW (PSE `kse-load`, 2025).
- Italy: about 311 TWh, or 35.5 GW (Terna, as reported).

**Sources**

| Zone | Series | Status |
|---|---|---|
| Poland | PSE `csdac-pln`: the SDAC price for the Polish zone, PLN/MWh, from 14 June 2024, converted at the ECB rate of the trading day | Public API, no key |
| Germany–Luxembourg | SMARD (Bundesnetzagentur), filter 4169 | CC BY 4.0 |
| Italy, South and North | GME, MGP zonal prices for SUD and NORD | Public results page |
| Romania, Bulgaria; Poland 2023–24 | Computed here on a private-use mirror of the SDAC results | Recompute from ENTSO-E (needs `ENTSOE_TOKEN`), OPCOM or IBEX before anything is published: gate MR-4 |

The mirror reproduced PSE (2025), SMARD (2025) and GME (2023–2026) to €0.1 on every statistic, so
the Romanian and Bulgarian figures will reproduce from ENTSO-E. Its Romanian 2024 mean is €103.5/MWh;
OPCOM's 2024 annual report gives €103.51/MWh (514.96 lei).

**Day-ahead value, €k/MW-yr**

| Zone | 2h 2023 | 2h 2024 | 2h 2025 | 4h 2023 | 4h 2024 | 4h 2025 | Mean price 2025, €/MWh |
|---|---|---|---|---|---|---|---|
| Romania | 79.4 | 120.0 | 105.3 | 133.9 | 195.5 | 176.8 | 108.2 |
| Bulgaria | 79.0 | 117.2 | 106.9 | 133.4 | 190.3 | 180.5 | 106.9 |
| Poland | 39.1 | 74.8 | 89.0 | 69.0 | 124.8 | 145.7 | 104.3 |
| Germany | 59.2 | 70.1 | 79.5 | 101.2 | 116.9 | 134.6 | 89.3 |
| Italy South | 52.8 | 46.9 | 45.9 | 86.7 | 77.5 | 77.0 | 115.0 |

**2026 so far.** Prices rose almost everywhere, sharply from August. Romania's monthly mean went from
€120/MWh in July to €225/MWh in October. On the same days of each year (1 January – 22 October):

| Zone | 2h value | 4h value | Mean price |
|---|---|---|---|
| Romania | +6.6% | +13.0% | +25.9% |
| Bulgaria | **−11.7%** | **−5.2%** | +20.4% |
| Poland | +19.0% | +24.6% | +19.2% |
| Germany | +19.6% | +23.0% | +26.7% |
| Italy South | +33.3% | +39.3% | +26.6% |

## 1. Romania

### The line today

`merchGross` is €110k/MW-yr for the 2h archetype, flat for fifteen years.
- It is the whole of 2025's theoretical spread: TB2 €151.0/MWh × 2h × 365 = €110.2k.
- The day-ahead value a 2h battery could schedule in 2025 was €105.3k. So the seed is 104% of a
  perfect-foresight year.
- It carries nothing for the fleet now arriving. The only cannibalisation term is the generic
  "cross-border coupling damping" score on the duration tab.

### Bulgaria's fleet stayed mostly in Bulgaria

| Date | Bulgarian batteries | Source |
|---|---|---|
| End-2024 | about 86 MW | ESO 2025 yearbook (end-2025 figure, +1,514.7%) |
| April 2025 | 27 MW on the transmission grid | ESO, via 3E News, 10 Apr 2025 |
| August 2025 | about 500 MW / 1,300 MWh | ESO, via Economic.bg, 11 Aug 2025 |
| End-2025 | 1,382 MW | ESO 2025 yearbook |
| May 2026 | 3,432 MW | ESO |
| Mid-June 2026 | about 4,800 MW / 14 GWh | ESO and Capital |
| 17 August 2026 | 5,406 MW of storage, excluding pumped hydro | ENTSO-E data, via Capital, 18 Aug 2026 |

Against its 4.03 GW average load, Bulgaria built a battery fleet larger than that load in a single
year.

Here is what that fleet did, January–July 2026 against January–July 2025, before the autumn price
surge:

| Zone | 2h day-ahead value | Mean price |
|---|---|---|
| Bulgaria | −12.0% | +0.4% |
| Romania | +6.3% | +5.8% |
| Poland | +12.1% | +9.4% |
| Germany | +15.1% | +10.4% |
| Italy South | +19.6% | +7.7% |

The two prices came apart. The table shows the share of hours in which Romania and Bulgaria cleared
within €0.50 of each other:

| 2023 | 2024 | 2025 | Jan 2026 | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 97.2% | 94.6% | 94.8% | 93.1% | 91.9% | 84.9% | 78.0% | 58.5% | 63.3% | 61.7% | 45.4% | 37.0% |

The gap sits in the hours when batteries discharge. April–September, against the same months of 2025:

| Hours | Romania above Bulgaria, 2026 | Same hours, 2025 |
|---|---|---|
| 19:00–23:00 | €36/MWh | €1/MWh |
| 08:00–11:00 | €23/MWh | €7/MWh |
| Midday | level | level |

Bulgaria now exports its evening battery output into Romania until the interconnector is full.
Romania Insider (5 Aug 2026) reports Bulgaria "turned into Romania's main source of imports during
the peak hours". Beyond that limit, only Bulgaria's own peak flattens.

**So the risk to Romania's line is Romania's own build, not Bulgaria's.**
- Transelectrica's list, excluding prosumers:
  - 599 MW / 1,130 MWh on 1 April 2026;
  - 989 MW / 1,975 MWh on 1 August 2026.
- Capacity is expected to double by the end of 2026.
- The dashboard's 420 MW / 780 MWh is out of date.

### A curve fitted on Bulgaria

Poland is the comparison market: a similar price level and a slow-growing fleet. Against Poland,
Bulgaria's two-hour value fell:
- 21.5% in January–July (0.880 ÷ 1.121);
- 23.2% in April–September (0.897 ÷ 1.169).

Over those two windows, Bulgaria's average fleet grew by 0.70 and 1.01 of its average load. The
monthly fleet is interpolated between ESO's dated counts above. One concave curve fits both points:

    compression = −24.3% × (1 − e^(−x / 0.324)),   x = added battery MW ÷ average load

The flattening matters: the first batteries take the dearest hours, and each later one takes less.

**Checks**
- **Romania's own 2026.** Between the same windows, Romania's fleet grew by about 0.07 of its average
  load.
  - The curve predicts −4.6% against Poland. Romania came in at −5.2% (1.063 ÷ 1.121).
  - No separate Bulgarian term is needed.
- **Duration.** In Bulgaria, four-hour value compressed about 2 points less than two-hour (−19.0%
  against −21.5%). Applying the two-hour curve at every duration therefore errs on the low side.
- **Fleet count.** RenewableMarketWatch counts a lower Bulgarian fleet, 3.7–3.9 GW at end-June. That
  count moves Romania's 2027 factor from 0.827 to 0.820.

### Romania's dated path

| Year | Average fleet, GW | Basis | x | Factor vs 2025 |
|---|---|---|---|---|
| 2025 | 0.3 | Below the 599 MW of 1 April 2026; assumed (gate MR-2) | — | 1.000 |
| 2026 | 1.1 | Transelectrica to 1 August; doubling by year-end | 0.13 | 0.919 |
| 2027 | 2.75 | 2026's +1.5 GW a year, held | 0.40 | 0.827 |
| 2028 | 4.25 | same | 0.65 | 0.789 |
| 2029 on | 5.75 | same, then flat | 0.90 | 0.772 |

- 6.5 GW at the end of 2029 is about 13 GWh at two hours.
  - That sits inside the 10–20 GWh Transelectrica says the system needs by 2030, which the site
    already cites (`docs/external-view.md` §8).
- At half the build rate (+0.75 GW a year), the 2027 factor is 0.840.
  - The curve flattens, so the path barely depends on how fast Romania builds.

### The proposal

- **Year 1 (COD 2027): €105.3k × 0.827 = €87.1k** (`merchGross`).
  - It assumes a realisation of 100% of the hourly day-ahead value: the 15-minute uplift (+8.7% in
    2026) and intraday re-trading are taken to offset imperfect foresight.
  - Gate MR-1 tests that.
- **Curve by operating year: 1.000, 0.955, 0.934, then held** (0.789 ÷ 0.827; 0.772 ÷ 0.827).
  - Year 3 is therefore €81.3k.
  - Levelised at the 10.5% merchant yield, the same path is €82.2k.
- **Band:**
  - Floor €69.6k: 80% realisation (€105.3k × 0.80 × 0.827).
  - Ceiling €110.9k: 2024's €120.0k at 110% realisation and the slow build (× 0.840).
  - Today's €110k becomes the top of the band.
- **Duration curve, observed:** the 2023–2025 mean of day-ahead value per MWh, with 2h = 1.

  | | 1h | 4h | 6h | 8h |
  |---|---|---|---|---|
  | Observed | 1.095 | 0.833 | 0.688 | 0.556 |
  | Seed today | 1.10 | 0.82 | 0.70 | 0.62 |

  - The basis becomes `observed`. That also clears the placeholder flag that marks the 4h play Thin
    today.
- **Dashboard.**
  - The `dilution` table follows the same path, so the Lab and the engine agree: 2027 1.047,
    2028 1.000, 2029 0.978.
  - The coupling score gets a measured basis: the share of hours Romania and Bulgaria clear together.
  - The fleet moves to 989 MW / 1,975 MWh.

### Returns

Each cell gives hold IRR (15 years) · exit IRR (year 5) · value per MW at the platform's yields.

| Case | 2h | 4h | Best design |
|---|---|---|---|
| Today | 20.2% · 24.2% · $245k | 18.4% · 21.7% · $327k | 4h |
| Curve only, on today's €110k | 18.9% · 22.4% · $206k | 17.1% · 19.9% · $263k | 4h |
| **Proposed: re-seed, curve, observed durations** | **13.7% · 14.9% · $65k** | **12.2% · 12.7% · $46k** | **2h** |
| Same, as one levelised figure (€82.2k) | 13.6% · 14.9% · $65k | 12.1% · 12.7% · $45k | 2h |

- Romania falls from first to fifth on the archetype's hold IRR, behind:
  - Western Australia 19.8%;
  - Italy 14.6%;
  - Finland 14.6%;
  - Germany 13.9%.
- The proposed sweep at other durations: 1h 11.1%; 6h 9.1%; 8h 4.9%.
- The best design moves from four hours to two, so `ro-mer-4h` becomes `ro-mer-2h`.

## 2. Poland

### The line today

`merchGross` is €78k/MW-yr for the 4h archetype. It is a prototype seed with no derivation, and the
dashboard labels its spread series SEED.

PSE's own 2025 prices:
- TB4 was €108.9/MWh, so the theoretical figure is €108.9 × 4 × 365 = €159.0k.
- The day-ahead value a 4h battery could schedule was €145.7k.
- **The seed is 49% of the first and 54% of the second.**
- On the same days of 2026, the 4h value is running 24.6% higher.

### What arrives, dated

| What | Volume | When | Source |
|---|---|---|---|
| Capacity-market batteries, achievable capacity | about 170 MW; about 2 GW; about 4 GW; up to 5 GW | 2027; 2028; 2029; 2030 | PSE data, via Parkiet |
| NFOŚiGW grant cohort | 3.9 GW / 14.5 GWh rated | Finish by end-2028 | NFOŚiGW, via Parkiet |
| NFOŚiGW ranking list | 169 projects, PLN 9.847bn of cost, PLN 3.735bn of grants, PLN 0.415bn of loans | 12 Dec 2025 | NFOŚiGW ranking list |
| Both cohorts together | about 5 GW by 2029, more than 6 GW in 2030 | — | Parkiet, from PSE and NFOŚiGW |

- The two cohorts overlap. A grant reduces the capacity payment of the same unit, so some projects
  contracted less capacity obligation than they built.
- The cohort's cost is PLN 9.847bn ÷ 14.5 GWh = PLN 679/kWh, about €158/kWh at 4.30. That is 35% below
  the platform's Polish €242.5/kWh.
- Pierwsza Faza (16 Oct 2026) reads URE's 2028–2030 results as about 11 GW of connection capacity:
  obligation divided by each auction's availability factor. That is an upper estimate. PSE's own ramp
  is used here.

### Poland's dated path

The curve is Romania's.

| Year | Average fleet, GW | Basis | x | Factor vs 2025 |
|---|---|---|---|---|
| 2025 | 0.3 | No grid-scale count is published; assumed (gate MR-2) | — | 1.000 |
| 2026 | 0.9 | assumed | 0.03 | 0.976 |
| 2027 | 1.95 | first capacity units; grant projects start | 0.09 | 0.940 |
| 2028 | 3.5 | capacity ~2 GW; cohort finishing | 0.18 | 0.898 |
| 2029 | 4.75 | ~5 GW by year-end | 0.25 | 0.871 |
| 2030 on | 5.75 | more than 6 GW by year-end; then flat | 0.30 | 0.853 |

### The proposal

- **Year 1 (COD 2028): €145.7k × 0.898 = €130.8k.**
- **Curve by operating year: 1.000, 0.970, 0.950, then held.**
  - Year 3 is therefore €124.2k.
  - Levelised: €125.3k.
- **Band:**
  - Floor €100.9k: 80% realisation, with the grant cohort fully additive to the capacity ramp
    (factor 0.866).
  - Ceiling €148.0k: 110% realisation with the capacity ramp alone (0.924).
  - Clean Horizon's €800k+ spot figure leaves the band. It stays in the basis as context.
- **Duration curve, observed** (2023–2025, 2h = 1):

  | | 1h | 4h | 6h | 8h |
  |---|---|---|---|---|
  | Observed | 1.086 | 0.845 | 0.708 | 0.571 |
  | Seed today | 1.12 | 0.84 | 0.72 | 0.63 |
- **A live line.**
  - A `day-ahead-pl` dataset from PSE `csdac-pln` replaces the SEED spread series.
  - It needs no token, so Poland does not wait for `ENTSOE_TOKEN`.
- **Dilution table:** 2028 1.031, 2029 1.000, 2030 0.979.

### Returns

Each cell gives hold IRR · exit IRR (year 5) · value per MW.

| Case | Merchant 4h | Capacity 4h | Best design |
|---|---|---|---|
| Today | 0.2% · −6.5% · −$482k | 3.2% · −1.1% · −$334k | capacity 1h: −0.9% · −$260k |
| **Proposed** | **7.4% · 5.4% · −$170k** | **9.8% · 9.5% · −$23k** | **capacity 4h** |
| Same, levelised (€125.3k) | 7.4% · 5.4% · −$171k | 9.8% · 9.5% · −$24k | capacity 4h |
| **Grant awardee, 37.9% grant** | **17.1% · 20.0% · +$202k** | not priced | — |

- The proposed capacity sweep: 1h 3.7%; 2h 7.9%; 6h 7.9%; 8h 5.0%.
- Capacity 4h prices an asset that already holds the DY2030 seventeen-year contract. A new entrant is
  on merchant 4h, at 7.4%.
- Poland rises from fourteenth to seventh.
- `pl-cap-1h` becomes `pl-cap-4h`.
- On today's €78k line, the grant awardee returns only 7.5%. The awardee play depends on the re-seed.

## 3. Germany: keep the number, mark it Thin

- **The line.** `merchGross` is €183.75k for 4h: Modo's lifetime-levelised 2h central (€122.5k) ×
  1.50.
  - It carries everything a German battery earns except Momentanreserve: day-ahead, intraday and the
    ancillary products.
- **What day-ahead alone paid** (SMARD, 4h):
  - €101.2k in 2023;
  - €116.9k in 2024;
  - **€134.6k in 2025, which is 73% of the line.**
  - 2026 is running 23.0% above the same days of 2025: about €165.6k for the year, or 90%.
- **Most of what German batteries earn today is not day-ahead spread.**
  - The realised 2h book on the dashboard (enspired) earned 3.4×, 2.6× and 2.9× the 15-minute
    day-ahead value of the same months in October–December 2025.
  - In money: €265k, €143k and €108k realised, against €77k, €55k and €37k of day-ahead value,
    annualised.
- **The site's own forecast.** On Modo's forecast, the ancillary share falls from 55% of revenue in
  2026 to about 5% by 2030.
  - By then the line must come almost entirely from wholesale trading: about €175k.
  - That is 1.3× what day-ahead paid in 2025.
- **What is at stake.** At the 2025 day-ahead level (€134.6k):
  - merchant 4h returns 7.3% hold instead of 13.9%;
  - the five-year toll returns 8.7% instead of 11.7%.
- **Marker: Thin.** The line rests on one forecaster, and the latest full year of day-ahead prices
  paid 73% of it.
  - **What would change it:** the 2026 full year paying at least 75% (it is tracking 90%). That moves
    it to Fair at the January 2027 refresh.
- No number moves.
  - The fund play is already `de-toll-4h`.
  - Its first five years are tolled, so the merchant marker does not cap it.

## 4. Italy: keep the number, mark it Thin, no toll play

- **The line.** `merchGross` is €123k: Modo's July 2026 four-hour wholesale spread for the South
  mainland, excluding MSD, flat in real terms to 2040.
- **What day-ahead paid** (GME SUD, 4h):
  - €86.7k in 2023;
  - €77.5k in 2024;
  - **€77.0k in 2025, which is 63% of the line.**
  - The North tells the same story: GME NORD €64.3k against Modo's €98k (66%).
  - 2026 is running 39.3% above the same days of 2025 in the South: about €107k for the year, or 87%.
- **The forecast is flat while its own fleet grows eightfold.**
  - The site quotes Modo expecting Italy's fleet to grow from 1.9 GW to as much as 15 GW by 2030.
  - Against Italy's 35.5 GW average load, that adds x = 0.37.
  - On the Bulgarian curve, x = 0.37 takes about 16% off.
- **Duration seeds.** Italy's 2h and 8h duration seeds sit 10–14% above observed (GME SUD 2023–2025,
  4h = 1: 2h 1.207, 8h 0.645). That is out of scope here.
- **What is at stake.** At the observed €77.0k:
  - the capacity play returns 8.2% hold, not 14.6%;
  - merchant returns 2.1%;
  - the toll returns 3.2%.
- **Marker: Thin.** The line rests on one forecaster, and the latest year paid 63% of it.
  - **What would change it:** the 2026 full year at 75% or more (it is tracking 87%).
  - Or: Italy's intraday auctions showing that the gap is intraday value (gate MR-6).

**The toll play.** At the platform's numbers, a toll is the weakest Italian route:

| Toll case | Hold IRR | Note |
|---|---|---|
| €87k seed, ten years, merchant tail | 5.1% | the capacity play is 14.6% |
| Toll that would match the capacity play | €157.8k a year | above the toll band's €123k ceiling |
| Same, with merchant at GME's observed level | €120.3k a year | against a capacity play that falls to 8.2% |

- Three Italian tolls have been announced, and none is priced.
- A rational offtaker pays at most what it expects to earn from the asset.
  - At observed prices, that is €77.0k of day-ahead value plus €13.7k of MSD: about €91k.
  - So the €87k seed is consistent with observed prices.
  - At that price, a toll does not pay for a €220/kWh battery.
- The fund play stays `it-cap-4h`. Its marker falls to Thin, and a trigger watches for the first
  disclosed Italian toll price.

## 5. One evidence rule for merchant lines

Today the marker reads only two things (`evidenceOf` in `src/governance/briefing.js`):
- whether a play's design inputs are placeholders;
- the bases of its grades.

It never reads how the revenue line is sourced. So Italy's fund play shows **Strong**, while 71% of
its first-year revenue rests on one forecast that the market paid 63% of.

**Proposed rule** (methodology, so yours to approve):
1. **Coverage** = the latest complete year's day-ahead value ÷ the merchant line restated at that
   year. A line with a dated path is restated by dividing it by the path's factor from that year to
   year 1.
2. **Markers:**
   - **Strong:** coverage 90–110%, the line inside the last three years' observed range, and the path
     fitted on the market's own data.
   - **Fair:** coverage 75–125%.
   - **Thin:** anything else, or no observed series.
3. A play whose merchant line carries more than half of its first-year revenue is marked no stronger
   than that line.
4. Coverage refreshes every January from the published series. The thresholds are methodology.

| Merchant line | Today | Coverage | Marker today | After this plan | Marker after |
|---|---|---|---|---|---|
| Romania | €110k | 96% | Fair: no path | €87.1k + path | Fair; Strong once re-fitted on Romania (MR-3) |
| Poland | €78k | 187% | Thin | €130.8k + path | Fair |
| Germany | €183.75k | 73% | Thin | unchanged | Thin; Fair if 2026 ≥ 75% |
| Italy | €123k | 63% | Thin | unchanged | Thin; Fair if 2026 ≥ 75% |

**The play markers, by investor (today → proposed):**

| Play | Fund | Strategic | Foreign first-timer | Developer |
|---|---|---|---|---|
| `it-cap-4h` | Strong → **Thin** | Fair → **Thin** | Fair → **Thin** | Thin |
| `de-mer-4h` | — | Fair → **Thin** | — | Strong → **Thin** |
| `de-toll-4h` | Fair | — | Strong | — |
| `ro-mer-4h` → `ro-mer-2h` | Thin → **Fair** | Thin → **Fair** | Thin → **Fair** | Thin → **Fair** |
| `pl-cap-1h` → `pl-cap-4h` | Thin → **Fair** | Thin → **Fair** | Thin → **Fair** | Thin |
| `it-ltda-6h` | Thin, unchanged: merchant is 28% of its revenue | — | — | — |

## Decisions for you

1. **How the dated path enters the engine: a merchant curve, or one levelised figure.**
   - **Curve.** A new `economics.merchantCurve`:
     - multipliers on the arbitrage line, index 0 = year 1, held at its last value, with a dated
       basis;
     - applied where `servicesCurve` is, in both engine paths, so tolls' merchant tails and award
       retention follow it;
     - when absent it is 1, so no other market moves and `tests/baseline.test.js` stays pinned.
   - **Levelised.** Romania €82.2k and Poland €125.3k, with no engine change.
   - Hold IRRs match within 0.1 point (Romania 13.7% against 13.6%; Poland 7.4% both).
   - **Recommended: the curve.** Two reasons:
     - `vintage.js` already says a seed is a level at its stated year and the forward path belongs in
       a curve;
     - a rule can re-fit a curve against each new year of prices, which it cannot do to a levelised
       number.
   - Either way, both markets are re-seeded from observed day-ahead value at 100% realisation, with
     observed duration curves (§1, §2).
   - To keep today's levels instead, the curve alone takes Romania to 18.9% (2h), and Poland stays at
     0.2%.
2. **The evidence rule reads the merchant line (§5).** **Recommended.**
   - It is the only way the marker can say what the outside check said.
   - It runs on published prices.
3. **Italy: no toll play.**
   - Keep `it-cap-4h` as the fund play, with a Thin marker.
   - Add the trigger `it-first-toll-price` to its changes-if: an Italian toll's price, or a priced
     tenor, is disclosed.
   - The alternative is an `it-toll-4h` play at the €87k seed, which would read 5.1% hold.
   - **Recommended: no play.**
     - A play the engine prices at a third of the capacity play's return is not a call a fund can
       act on.
     - The price that would change that has never been published.
4. **Poland: the grant awardees become a play, `pl-grant-4h`.**
   - Merchant, 4h, ready-to-build, priced with the cohort's 37.9% grant (PLN 3.735bn of grants over
     PLN 9.847bn of cost).
   - A play gains one optional field, `grantPct`, applied before pricing. Plays stay analyst-written.
   - On the re-seeded line it returns 17.1% hold and +$202k/MW.
   - The capacity route plus a grant is not priced. The grant reduces the capacity payment by a rule
     this plan has not read (MR-5).
   - **Recommended, together with decision 1.** Without the re-seed the play reads 7.5% and is not
     worth adding.

## What moves once you sign off

- **Published numbers** (`npm run test:current`, regenerated, with the diff justified):
  - Romania: 20.2% → 13.7% (2h archetype); 4h 18.4% → 12.2%.
  - Poland: 0.2% → 7.4% (merchant 4h archetype); capacity 4h 3.2% → 9.8%.
  - Germany, Italy and every other market do not move.
- **The ranking** (archetype hold IRR):
  - Romania 1st → 5th; Poland 14th → 7th.
  - Western Australia, Italy, Finland and Germany each rise one place.
  - Great Britain through PJM each fall one.
- **Grades.** Asset-return grades re-rank over fifteen. Every grade reason that quotes a rank
  ("Fifth of fifteen…") is re-quoted, in a change file for your sign-off, as for Japan.
- **Plays and content** (through the writer, signed off with this plan):
  - `ro-mer-4h` → `ro-mer-2h`, its "why" re-quoting 13.7% and the 2h and 4h values;
  - `pl-cap-1h` → `pl-cap-4h`, and the new `pl-grant-4h`;
  - Italy's fund call gains the toll trigger;
  - two theses:
    - **Romania:** "Wide day-ahead spreads, and a home fleet that doubles this year. Bulgaria's
      batteries mostly stay behind the border; Romania's own build takes about 17% off the two-hour
      value by 2027. Two hours is the best design, at 13.7% hold, and a negotiated floor is how a
      fund holds it."
    - **Poland:** "No new-entry capacity route, but the day-ahead market pays almost twice what the
      platform carried. An uncontracted four-hour project returns 7.4%, and every design still sits
      below the platform's yields. A project in the 2025 grant cohort returns 17.1%."
- **Briefing.**
  - Markers change as in §5.
  - Romania's fund row stays Opportunistic and falls in the value order.
  - Poland's rows rise, but every Polish design is still negative at the platform's yields, so no call
    is flagged as ahead of its economics.
- **Code:**
  - `src/comparison/engine.js`: `merchantCurve` on the arbitrage line, in both paths.
  - `src/comparison/vintage.js`: a curve must start at 1.00 and carry a dated basis.
  - `src/markets/ro/comparison.js`, `src/markets/pl/comparison.js`: seeds, curves, bands and observed
    duration curves.
  - `src/markets/ro/data.js`, `src/markets/pl/data.js`: dilution tables from the same paths; Romania's
    fleet to 989 MW / 1,975 MWh.
  - `src/governance/briefing.js` (methodology): the coverage rule.
  - `src/briefing/plays.js`: passes each line's marker and its merchant share.
  - `src/governance/plays.js` and `view/schema`: the optional `grantPct` on a play.
  - `etl/`: a `day-ahead-pl` dataset from PSE `csdac-pln`; coverage figures from SMARD and GME.
  - Tests:
    - with no curve, the pinned baseline holds;
    - Romania and Poland reproduce their year-1 levels from the stated arithmetic;
    - the rule's three bands;
    - a play is capped by its merchant line.
- **Docs.** `docs/external-view.md` gains the MR gates. The derivation scripts move into
  `scripts/derive/merchant-lines.mjs`. They are read-only, like the Japan ones.

## Research gates

| Gate | What | Why it matters, and what closes it |
|---|---|---|
| **MR-1** | Realisation: the share of hourly perfect-foresight day-ahead value a Romanian or Polish battery actually earns, across day-ahead, intraday and 15-minute trading | Seeded at 100%, with a band of 80–110%. Each 10 points moves Romania's hold IRR by about 2 points (80%: 9.4%; 110%: 15.7%). Closed by a realised monthly book, like the German one on the dashboard |
| **MR-2** | Fleet paths: Romania's 2025 average (0.3 GW assumed) and its build from 2027 (+1.5 GW a year assumed); Poland's grid-scale fleet in 2025–26 (assumed) and the grant/capacity overlap (half assumed) | The curve flattens, so the levels move little (Romania's 2027 factor ranges 0.827–0.840). Closed by Transelectrica's storage list, URE unit lists and PSE connection data |
| **MR-3** | Re-fit the curve on each market's own data after the 2027 season | Today the curve is fitted on Bulgaria. A Romanian or Polish fit makes the marker Strong |
| **MR-4** | Publishable Romanian and Bulgarian series | ENTSO-E 12.1.D (needs `ENTSOE_TOKEN`), or OPCOM and IBEX exports. Nothing for Romania or Bulgaria is published from the mirror |
| **MR-5** | How a grant reduces a Polish capacity payment for the same unit | Needed before a capacity-plus-grant play can be priced. Closed by the capacity-market act's provision and URE's practice |
| **MR-6** | Italian intraday value (MI-A auction prices, GME) | The one public measurement that could close the gap between Modo's €123k and GME's €77.0k |

## Sources

Prices and load:
- PSE reporting API: [`csdac-pln`](https://api.raporty.pse.pl/api/csdac-pln) and
  [`kse-load`](https://api.raporty.pse.pl/api/kse-load).
- SMARD (Bundesnetzagentur), [filter 4169](https://www.smard.de/app/chart_data/4169/DE/index_hour.json).
- GME, [MGP zonal prices](https://www.mercatoelettrico.org/it-it/Home/Esiti/Elettricita/MGP/Esiti/Prezzi).
- ECB, [reference rates](https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.zip).
- OPCOM, [annual report 2024](https://ns1.opcom.ro/uploads/doc/rapoarte/Anual/RS_2024_RO.pdf).

Bulgaria:
- ESO, [statistical yearbook 2025](https://www.eso.bg/fileObj.php?oid=5908): installed capacity,
  gross generation and consumption.
- 3E News, [10 Apr 2025](https://3e-news.net/bg/a/view/60557/proekti-za-stroej-na-baterii-s-obshta-moshtnost-ot-blizo-7000-mw-sa-podadeni-kym-eso).
- Economic.bg, [11 Aug 2025](https://www.economic.bg/bg/a/view/v-eso-ima-zajavlenija-za-instalirane-na-12-000-megavata-baterii).
- MrEast, [Aug 2026](https://www.mreast.eu/2026/08/bulgarias-battery-boom-reshapes-its-power-market/),
  for ESO's May and June 2026 figures.
- Capital, [18 Aug 2026](https://www.capital.bg/biznes/energetika/2026/08/18/4946516_bateriite_v_bulgariia_se_uvelichiha_s_1_gw_za_mesec_i/).

Romania:
- Balkan Green Energy News, [7 May 2026](https://balkangreenenergynews.com/romania-exceeds-1-gwh-in-battery-storage-capacity/).
- Romania Insider, [5 Aug 2026](https://www.romania-insider.com/battery-storage-capacity-romania-august-2026).
- Transelectrica, [2025 Q4 results](https://www.transelectrica.ro/documents/10179/21404183/Raport+curent_Rezultate+financiare+T4+2025_ENG.pdf/eb180977-e294-42e9-8242-51340aacd277).

Poland:
- NFOŚiGW, [programme page and ranking list](https://www.gov.pl/web/funduszmodernizacyjny/magazyny-energii-elektrycznej-i-zwiazana-z-nimi-infrastruktura-dla-poprawy-stabilnosci-polskiej-sieci-elektroenergetycznej2).
- Parkiet, [PSE and NFOŚiGW data](https://www.parkiet.com/energetyka/art44802621-magazyny-pomoga-ale-nie-rozwiaza-problemu).
- ESS News, [10 Dec 2025](https://www.ess-news.com/2025/12/10/poland-selects-183-energy-storage-projects-under-1-billion-oversubscribed-subsidy-program/).
- Pierwsza Faza, [16 Oct 2026](https://pierwszafaza.pl/magazyny-rynek-mocy-lista/).
- URE, [2030 auction results](https://www.ure.gov.pl/pl/urzad/informacje-ogolne/aktualnosci/13031,Prezes-URE-oglasza-ostateczne-wyniki-aukcji-glownej-rynku-mocy-na-dostawy-w-2030.html).

Italy:
- QualEnergia on Terna's [2025 demand](https://www.qualenergia.it/articoli/solare-eolico-valgono-un-quinto-consumi-elettrici/).
