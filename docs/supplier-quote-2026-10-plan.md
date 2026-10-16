# The supplier quotation in the cost model — plan, derivations and result

Approved by the analyst on 2026-10-16 and built on 2026-10-17. The code is
`src/comparison/supplierQuote.js`; the stack builders are in `src/comparison/capex.js`.

## What was supplied

**HiTHIUM Energy Storage Technology Deutschland GmbH, quotation of 15 October 2026, rev 1.1, EUR.**
Thirteen 20 ft liquid-cooled 6,250 kWh DC blocks for a two-hour project: 81.25 MWh nameplate at
beginning of life, 70 MWh at the meter. Delivery 130–150 days after PO; FOB.

| Item | Qty | Unit € | Total € | €/kWh nameplate |
|---|---|---|---|---|
| ESS container, 6,250 kWh | 13 | 459,062.50 | 5,967,812.50 | 73.45 |
| Commissioning, DC blocks | 13 | 4,800.00 | 62,400.00 | 0.77 |
| **Capex** | | | **6,030,212.50** | **74.22** |

Excluded: freight, customs (2.7%), tariff adders, VAT, EU Battery Regulation EPR / recycling.
Indexation: ±USD 0.6/kWh nameplate per ±$1,000/t of the 30-day Li2CO3 average before PO, from
$20,000/t. FX basis EUR/USD 1.1195 with a ±2.5% band. Standard warranty five years; extension
conditional on SOH above 65%.

LTSA, annual-payment plan, 3% escalator, € per year for the whole 81.25 MWh:

| Year | Warranty | PMP | RTE guarantee | 97% availability guarantee |
|---|---|---|---|---|
| 1 | included | 26,301.79 | 2,988.84 | 5,977.68 |
| 5 | included | 29,602.89 | 3,363.97 | 6,727.93 |
| 6 | 65,007.26 | 30,490.98 | 3,464.89 | 6,929.77 |
| 11 | 84,023.43 | 35,347.40 | 4,016.76 | 8,033.50 |
| 16 | 107,448.07 | 40,977.33 | 4,656.52 | 9,313.03 |
| 20 | 120,933.75 | 46,120.34 | 5,240.96 | 10,481.89 |
| 21 | 136,203.04 | 47,503.95 | — | — |
| 25 | 153,297.72 | 53,466.11 | — | — |

The full 25-year table is `LTSA_ANNUAL_EUR` in the module.

**HiTHIUM EU BESS Master Supply Agreement, template of 11 June 2026.** Its exhibits G, I, J, K and
M (warranty, capacity, availability and RTE guarantees, PMP) are blank, so it gives no curve,
RTE level or LD rate. What it gives:

- Supply payments 15% at PO, 15% at mass production, 30% at FAT, 40% within 30 days of shipment;
  commissioning 20% / 80%.
- The guarantees need the PMP and the warranty; availability also needs a project over 30 MWh.
  That is the analyst's 2026-10-12 default package.
- LD caps: 5% per guarantee, 10% aggregate; delay 0.05%/day after 14 days, capped at 5%;
  supplier liability 100% of the PO.
- Re-openers: FX ±5% against RMB, Li2CO3 ±10% (SMM), shipping ±10%, tax changes, Chinese
  consumption tax. EPR fees sit outside the price.
- Cancellation 10 / 30 / 50 / 100% at 120 / 100 / 80 / <80 days before shipment.

These terms are recorded, not modelled. All of them fall inside the build year, which the engine
spends as one outflow.

## The analyst's rulings (2026-10-16)

1. **Publish in full.** Line items and the supplier's name are published. The customer named on
   the quotation and its quote number are not.
2. **Capex by benchmark vintage.** Totals from 2026 European price surveys are **held** and
   re-split: GB, IE, RO, PL, DE, IT, FI. Totals from a cost model or regulator benchmark are
   **rebuilt** on the quote: NEM (GenCost), WA (ERA), Japan (FY2024-anchored ¥60,000/kWh).
3. **The quote is the price.** The quoted DC block is exempt from the 0.90 OEM multiplier, which
   stays on everything else.
4. **The service package sits inside each opex seed, as its own back-loaded line.** The seed's
   fifteen-year sum is held.

US markets stay on NREL. A China-sourced block there carries Section 301 (25% from 2026), MFN
3.4% and any IEEPA duty, and likely fails the foreign-entity test for the storage ITC (gate Q-3).

## Derivations

**Landed DC block, per kWh at the meter.** The oversize factor is 81.25 / 70 = 1.1607. Freight,
insurance and inland haulage are taken at €1.5/kWh nameplate (gate Q-1). Duty is charged on
goods only.

- EU and UK at 2.7% duty (the UK rate is gate Q-2): (73.45 × 1.027 + 0.768 + 1.5) × 1.1607 =
  **€90.19**
- Australia (ChAFTA) and Japan, duty-free: (73.45 + 0.768 + 1.5) × 1.1607 = **€87.89**
- ECB reference rates, 15 Oct 2026: £76.31, A$142.54, ¥15,561.

**Capex.** Q is the quoted block per MW = h × 1000 × landed. The block is owner-furnished, so it
sits outside the EPC wrap.

- **Held:** the total T stands. dcBlockPerKWh = d, and energy-scaling BOP = (0.56·T − 0.88·Q) /
  kWh, so capex at every other duration is what it was. PCS, transformer and BOP per MW follow the
  global split.
- **Rebuilt:** capex = d · h · 1000 + 0.44 · T_benchmark. PCS, transformer and BOP are held per
  MW, and EPC is held at 0.12 · T (37.5% of the power lines).
- **Sponsor:** 0.9 · (raw − Q) + Q.

| Market | Method | h | Raw capex | Q / raw | Sponsor capex | Was |
|---|---|---|---|---|---|---|
| GB | held | 4 | £900,000 | 33.9% | £840,524 | £810,000 |
| IE | held | 4 | €1,160,000 | 31.1% | €1,080,076 | €1,044,000 |
| RO | held | 2 | €630,000 | 28.6% | €585,038 | €567,000 |
| PL | held | 4 | €970,000 | 37.2% | €909,076 | €873,000 |
| DE | held | 4 | €935,000 | 38.6% | €877,576 | €841,500 |
| IT | held | 4 | €880,000 | 41.0% | €828,076 | €792,000 |
| FI | held | 2 | €440,000 | 41.0% | €414,038 | €396,000 |
| NEM | rebuilt | 4 | A$1,247,740 | 45.7% | A$1,179,980 | A$1,386,000 |
| WA | rebuilt | 7 | A$2,599,346 | 38.4% | A$2,439,186 | A$3,276,000 |
| JP (×3) | rebuilt | 9 | ¥298,451,393 | 46.9% | ¥282,611,393 | ¥427,090,910 |

Japan is rebuilt on its six-hour basis: 9,000 × ¥15,561 + 0.44 × ¥360m = ¥298.5m. The plan
estimated ¥308.1m because it kept EPC on the DC block; the owner-furnished rule removes that.

**Service package, real terms.** The engine holds opex flat, so the nominal plan is deflated at
2%/yr. Per kWh at the meter: €0.494 in year 1, €1.343 in year 6, €1.570 in year 15; the
**15-year mean is €1.138**.

| Market | Package mean /MW-yr | Seed | Other opex |
|---|---|---|---|
| GB | £3,851 | £13,000 | £9,149 |
| IE | €4,551 | €10,000 | €5,449 |
| RO | €2,276 | €8,000 | €5,724 |
| PL | €4,551 | €9,000 | €4,449 |
| DE | €4,551 | €17,000 | €12,449 |
| IT | €4,551 | €13,000 | €8,449 |
| FI | €2,276 | €9,000 | €6,724 |
| NEM | A$7,381 | A$20,000 | A$12,619 |
| WA | A$12,917 | A$18,000 | A$5,083 |
| JP | ¥1.81m | ¥11.74m (METI O&M at the rebuilt capex) | ¥9.93m |

WA's remainder of A$5,083 for insurance, land and fees is thin; that is the open question in
gate G13. Japan's award bid keeps the flat METI seed, because that is how METI costs its ceiling.

**Award revenue derived from capex.**
- **Japan:** the cost-reflective bid follows the rebuilt raw capex: Tokyo ¥54,000 → ¥37,000 per
  awarded kW, Kyushu ¥52,000 → ¥36,000, Hokkaido ¥51,000 → ¥35,000 (ceiling ¥71,140).
- **NEM:** `ltda.payment` is re-derived on its own formula: 0.6 × 1,247,740 × 0.10979 + 20,000
  = 102.2k. The midpoint with LTESA's 150k is 126.1k, and 0.9 × that is **A$113,500** (was
  121,500).

**Lab availability.** The guaranteed 97% is the plant floor (grid unavailability excluded, MSA
5A.6(g)). The GB, IE, RO, PL and NEM labs move from 95–96% to 97%. Japan's 92% feeds the
floor-holding build and is unchanged.

**Debt.** `warrantyTenor` goes from 10 to 20, because the default package extends the warranty to
year 20. The 10-year legal tenor cap still binds, so no number moves.

**Degradation.** The SOH > 65% condition at year 20 is consistent with 2%/yr fade
(0.98^19 = 68.1%). `degr` is unchanged.

## Result — 15-year hold IRR, base route

| | GB | IE | RO | PL | DE | IT | NEM | WA | JP Tokyo / Kyushu / Hokkaido |
|---|---|---|---|---|---|---|---|---|---|
| Was | 5.1 | 9.6 | 20.8 | 0.8 | 14.6 | 15.4 | 3.1 | 13.1 | 3.6 / 3.5 / 3.4 |
| Now | 4.5 | 9.0 | 20.2 | 0.2 | 13.9 | 14.6 | 4.5 | 19.8 | 2.8 / 2.9 / 2.5 |

The plan expected NEM at 5.5% on capex alone. The re-derived CIS award brings it to 4.5%.

**Design sweep.** Two best designs move. WA's goes from 7 h to 8 h: with rebuilt capex only the
quoted block scales with energy, so the eighth hour pays, and value per MW rises from A$0.55m to
A$1.17m. Poland's capacity route goes from 2 h to 1 h, by A$4k/MW between two negative values,
because the package scales with stored energy. Both plays' wording is the analyst's to revise.

**Grades.** The asset-return grades were re-derived by the stored rank rule:
- WA 4 → 5
- NEM 2 → 3
- CAISO 2 → 3, because Japan fell below it
- Italy 5 → 4
- Tokyo and Kyushu 3 → 2

Hold and exit now order WA and Romania, and NEM and GB, differently, but give every market the
same fifth. `tests/view.test.js` now asserts the grades agree, not the order. NEM and CAISO score
above the "Opportunistic" calls of 16 October, so each carries a drafted score note; the calls
are unchanged.

## Gates

- **Q-1** Freight, marine insurance and inland haulage, at €1.5/kWh nameplate. Unsourced.
- **Q-2** UK customs rate on lithium-ion accumulators, taken at the EU's 2.7%.
- **Q-3** US markets: Section 301 and IEEPA duty plus the ITC foreign-entity test; the quote is
  not applied there.
- **Q-4** The Li2CO3 index at PO against the $20,000/t basis (SMM). At ±USD 0.6/kWh per
  $1,000/t, a $5,000/t move shifts the block by about €3.1/kWh at the meter.
