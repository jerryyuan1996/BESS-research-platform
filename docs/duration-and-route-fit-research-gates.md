# Duration and route fit — research gates G1, DG-1, DG-2, DG-5, DG-6

Opened on 2026-10-15 for §7 of `docs/duration-and-route-fit-plan.md`. Every answer below comes
from the publisher's own document, downloaded and read as text. None comes from a search
summary. That is the `opened` access level in `src/governance/triggers.js`. Where a document
could not be opened, the section says so.

Nothing in the plan, `src/`, `view/`, `etl/` or `tests/` was edited, and nothing was committed.

**How to read the quotations.** Each is verbatim from the text extracted from the PDF or
workbook, with line breaks and hyphenation removed. "…" marks a cut, and English in square
brackets is my translation. Page numbers are PDF pages.

---

## Summary

| Gate | Status | Answer | What it moves |
|---|---|---|---|
| G1 | Closed | 4h storage de-rating is **43.96%** for T-4 2029/30 and **44.61%** for T-4 2030/31. The dashboard's 0.45 is close. The engine's 0.38 is the outlier | §6 GB row reverses and becomes an engine change |
| DG-1 | Closed | One KWD, 13.39%, for all storage at every duration. But certified capacity must be deliverable for **four uninterrupted hours**, so a battery under 4h certifies only MWh ÷ 4 | §6 PL rows: 0.1339 × min(1, h/4), not flat |
| DG-2 | Closed | Yes. The annual 3_4_Energy_Storage schedule and the monthly EIA-860M both carry "Nameplate Energy Capacity (MWh)". The connector comment is wrong | No §6 row, no §2.4 figure. §1.3 and §4.3 |
| DG-5 | Closed (Italy with a version caveat) | All four schemes measure fade. WA re-certifies credits every cycle. Japan makes bidders build degradation into the declared capacity. Germany re-tests every year over the bid duration. Italy lets the committed MWh fall 1% a year and penalises any shortfall below that path | §2.4: WA gains a 7.5h fixed-price floor (9.0h build). Germany clarified. Italy 18% → about 15% |
| DG-6 | Closed | Yes. Seven hours applies to new storage certified in the 2026 Reserve Capacity Cycle, which is Capacity Year 2028–29 | WA's 7h has no buffer. §6 flag resolved |

The full list of changes is in [What changes in the plan](#what-changes-in-the-plan).

---

## G1 — GB Capacity Market de-rating for duration-limited storage

### Answer

NESO publishes the factors in Table 3 of the Capacity Auction Guidelines. It calculates them by
the Scaled EFC method under Rule 2.3.5 and explains them in the Electricity Capacity Report
(ECR). The DESNZ parameters letters set interconnector factors only.

| Duration | T-4 2029/30 | T-4 2030/31 | T-4 2028/29 (ECR 2024, reference) | Dashboard `deratingCurve` | Engine |
|---|---|---|---|---|---|
| 0.5h | 5.57% | 5.58% | 5.30% | — | |
| 1h | 10.99% | 11.15% | 10.47% | 9% | |
| 2h | 21.98% | 22.31% | 20.94% | 22% | |
| 3h | 32.97% | 33.46% | 31.27% | — | |
| 4h | **43.96%** | **44.61%** | 41.74% | 45% | **38%** |
| 5h | 55.09% | 55.92% | 52.34% | — | |
| 6h | 66.08% | 66.92% | 62.67% | 63% | |
| 7h | 76.93% | 78.22% | 73.14% | — | |
| 8h | 87.77% | 90.75% | 83.47% | 77% | |
| 8.5h | 92.16% | 90.75% | 88.78% | — | |
| Longest class | 92.16% (9.5h+) | 90.75% (8h+) | 92.99% (9h+) | 86% (10h), 94% (12h) | |

The curve is close to linear, at about 11 points an hour, up to the duration-limited threshold.
That threshold is 8.5h for 2029/30 and 8h for 2030/31.

Four further points:

- **The engine's 1h and 2h figures come from an earlier vintage.**
  - `src/markets/gb/comparison.js:39` cites "1h 10.47% and 2h 20.94% (CM year 2024/25)".
  - Those are the T-4 2028/29 values from the 2024 ECR (10.4688% and 20.9375%).
  - Its premise that the factor "does not scale linearly past 2h" does not hold for any of these
    three vintages.
- **The engine's 0.38 matches no published factor.** Even the 2028/29 vintage gives 41.74% at
  4h.
- **T-4 factors rose and T-1 factors fell.**
  - T-4 at 4h: 41.74% (2028/29), then 43.96% (2029/30), then 44.61% (2030/31).
  - T-1 at 4h: 54.44% (2026/27), then 49.29% (2027/28).
  - The plan's "factors fell" (§3.2) holds for T-1 only.
- **The 2030/31 guidelines are already published (July 2026)**, before that auction.

### Quotations

- T-4 2029/30 guidelines, Table 3, p. 10: "Storage Duration: 4h … 43.96".
- 2026 guidelines, Table 3, p. 12, with columns "De-rating factors T-1 & ST %" and "De-rating
  factors T-4 %": "Storage Duration: 4h … 49.29 … 44.61".
- ECR 2026, p. 23: "the Scaled EFC methodology gives a de-rating factor of 90.75%".
- DESNZ letter, July 2025: "Table 2 sets out the de-rating factors for interconnectors".

### Sources (all opened)

1. NESO (EMR Delivery Body), *Capacity Auction Guidelines — Four Year Ahead Capacity Auction
   (T-4), Delivery Year 2029/2030, Version 1.0*, February 2026 (file dated 9 February 2026).
   - Table 3, pp. 10–11.
   - https://nationalenergyso-emr.my.salesforce.com/sfc/p/8d000002dUGC/a/J700000063aM/6Qn1Cn75exChKlwEiV7oGoVxDW4_dU0VIk.o6OG7cnc
   - Listed on https://emrdeliverybody.nationalenergyso.com/IG/s/article/CM-Auction-Guidelines-and-Parameters
2. NESO, *Capacity Auction Guidelines — T-1 Delivery Year 2027/28 and T-4 Delivery Year 2030/31,
   Version 1.0*, July 2026 (file dated 20 July 2026).
   - Table 3, pp. 11–12.
   - https://nationalenergyso-emr.my.salesforce.com/sfc/p/8d000002dUGC/a/Sr0000027RGr/5wSWw2OiFsgJGjNoVzsiEIIWMaqEotyvU.dRua3X2XI
3. NESO, *Electricity Capacity Report 2026* (file "Public_NESO ECR 2026_final", 20 July 2026),
   p. 23.
   - https://nationalenergyso-emr.my.salesforce.com/sfc/p/8d000002dUGC/a/Sr0000027ROv/SmmxZT4oauSSnfe1kS_OVwVq5_L_YAirVt2XzNMVEBk
   - Its *Data Workbook*, sheet "Figure A12", gives the 2029/30 and 2030/31 T-4 columns to six
     decimals:
     https://nationalenergyso-emr.my.salesforce.com/sfc/p/8d000002dUGC/a/Sr0000027RS9/y1YRskgortbec5.Y8Hvhs7FtOx6MMpgoLV4rhBOTQ70
   - Both are listed on https://emrdeliverybody.nationalenergyso.com/IG/s/article/Electricity-Capacity-Report-ECR
4. NESO, *ECR 2025 Data Workbook* (Final, 15 July 2025), sheet "Figure A10", which sets T-4
   2028/29 beside T-4 2029/30.
   - https://nationalenergyso-emr.my.salesforce.com/sfc/p/8d000002dUGC/a/J70000005jrn/c.Q9YbAU4zaDmfB8abU4y5pYCb39fYaCHmuBj5XlMSQ
5. DESNZ, *Capacity Market auction parameters letter to NESO*, 8 July 2025 and July 2026. These
   carry interconnector factors only, so they are not the source for storage.
   - https://assets.publishing.service.gov.uk/media/686d2950fe1a249e937cbe23/desnz-2025-parameters-letter-neso.pdf
   - https://assets.publishing.service.gov.uk/media/6a5de8d53ae256c99b70301d/letter-to-NESO-CM-parameters-information-july-2026.pdf

### What it changes

- **§6, GB `deratingCurve[4]`: reverse the row.**
  - The dashboard's 0.45 is within 0.011 of the published 0.4396.
  - The value to correct is the engine's `capacity.derating` 0.38, to 0.4396. That is the T-4
    2029/30 vintage, the one whose £27.10 clear the engine prices.
- **This moves a published number.**
  - GB capacity revenue rises from £10,298 to £11,913 per MW-yr (+15.7%).
  - The contracted band moves with it: £2,447–24,700 becomes £2,831–28,574 per MW-yr.
  - So the §6 preamble ("the engine already carries the right values … do not move") does not
    hold for GB, and `tests/current-model.test.js` would change.
  - The vintage is your call: 2029/30 (0.4396) or 2030/31 (0.4461).
- **§6, the dashboard's vintage table for 2029/30 becomes**
  `{ 1: 0.1099, 2: 0.2198, 4: 0.4396, 6: 0.6608, 8: 0.8777, 10: 0.9216, 12: 0.9216 }`.
  - The 2030/31 set is `{ 1: 0.1115, 2: 0.2231, 4: 0.4461, 6: 0.6692, 8: 0.9075, 10: 0.9075, 12: 0.9075 }`.
  - The 8h point moves most: 0.77 becomes 0.88.
- **§1.2, the GB tipping point.**
  - The plan has 6h beating 4h above £14.71/kW-yr, on a 0.18 gap between the dashboard's 0.45
    and 0.63.
  - On the published 0.4396 and 0.6608 the gap is 0.2212, so the threshold falls to about £12
    (14.71 × 0.18 ÷ 0.2212 = £11.97).
  - That estimate assumes the lab's capacity line is linear in price × factor. Recompute it
    rather than scale it. 8h (0.8777) needs re-running too.
- **§2.4: no change.**

---

## DG-1 — Poland: the 13.39% KWD and how delivery duration is tested

### Answer

1. **The 13.39% applies at every duration.**
   - §10 point 9 of the 2030 parameters regulation sets one KWD for one technology group:
     pumped-storage hydro, batteries, flywheels and supercapacitors.
   - No duration dimension exists in it.
   - The only individual KWD the Rules allow, for units mixing technologies (pkt 7.5.4.7), is a
     MW-weighted average. It has no duration term either.
2. **Duration is tested at certification.**
   - Every physical unit must confirm that its net achievable capacity can be delivered for an
     uninterrupted period of at least four hours (Rules pkt 7.4.2.1 ppkt 8). New units must do
     the same (pkt 7.4.2.6).
   - The confirmation uses the Annex 7.1 form. The form lists "magazyn energii elektrycznej"
     [electricity storage] and asks how many hours the store holds at net achievable capacity.
   - Since update card RRM/Z/14/2025, an independent expert's report confirms the storage MWh:
     at certification for new units bidding for multi-year contracts, and again at the
     operational milestone.
3. **Delivery is tested in hourly call periods.**
   - The obligation is to deliver in each *okres przywołania* (capacity-market call period). Each
     is "a full hour" (art. 2 ust. 1 pkt 26), announced at least eight hours ahead (art. 57
     ust. 9).
   - There is a quarterly demonstration (art. 67 ust. 1–4).
   - PSE may call test call periods. A test passes only if delivery reaches the full obligation
     (art. 67 ust. 5–9).
   - The Rules bar a storage test when PSE's own dispatch corrections prevent delivery "for at
     least one hour" (pkt 16.8.1.2).

**My reading.**

- The obligation ceiling is KWD × certified net capacity, and certified capacity must be holdable
  for four hours. A battery shorter than four hours can therefore certify only MWh ÷ 4.
- Per nameplate MW, the factor is 13.39% × min(1, h/4):

  | 1h | 2h | 4h and longer |
  |---|---|---|
  | 3.35% | 6.70% | 13.39% |

- Neither the regulation nor the Rules writes "MWh ÷ 4" for storage, and PSE has not been asked.
  The plan's own source ("deliverable for four hours") reads the Rules the same way.
- At 13.39% the delivery test does not bind duration. A 4h battery holding 13.39% of its power can
  sustain it for about 30 hours of call periods.

### Quotations

- Regulation, §10 pkt 9: "13,39 % – dla … magazynów energii elektrycznej w postaci akumulatorów"
  [13.39% for … electricity storage in the form of batteries].
- Rules, pkt 7.4.2.1 ppkt 8: "przez nieprzerwany okres nie krótszy niż 4 godziny" [for an
  uninterrupted period of not less than 4 hours].
- Annex 7.1: "magazyn/zasobnik energii lub paliwa o pojemności pozwalającej na pracę z mocą
  osiągalną netto" [an energy or fuel store whose capacity allows operation at net achievable
  capacity].
- Act, art. 2 ust. 1 pkt 26: "okres przywołania na rynku mocy – pełną godzinę" [capacity-market
  call period – a full hour].

### Sources (all opened)

1. *Rozporządzenie Ministra Energii z dnia 1 sierpnia 2025 r. w sprawie parametrów aukcji głównej
   dla roku dostaw 2030 …*, Dz.U. 2025 poz. 1066 (published 5 August 2025), §10.
   - https://api.sejm.gov.pl/eli/acts/DU/2025/1066/text.pdf
2. PSE, *Regulamin rynku mocy*, consolidated after update card RRM/Z/16/2026 (PDF dated
   6 August 2026).
   - pkt 6.3.2.5 (p. 35), 7.4.2.1 ppkt 8 (p. 43), 7.4.2.6, 7.5.4.7 (p. 58) and 16.8.1.2 (p. 123).
   - https://www.pse.pl/documents/20182/51490/RRM_Z_16_2026.pdf
3. PSE, *Załączniki do Regulaminu Rynku Mocy po KA16*, Annex 7.1, p. 15 (PDF modified
   10 September 2026).
   - https://www.pse.pl/documents/20182/51490/Zalaczniki_do_Regulaminu_Rynku_Mocy_po_KA16.pdf
4. PSE, *Karta aktualizacji nr RRM/Z/14/2025*, the version approved by the URE President (PDF
   modified 4 December 2025).
   - Items 2 and 10: pkt 7.4.2.6 ppkt 2 lit. e and pkt 14.1.2.3 ppkt 2.
   - https://bip.ure.gov.pl/download/3/20255/KartaaktualizacjiRRMZ142025.pdf
5. *Ustawa z dnia 8 grudnia 2017 r. o rynku mocy*, consolidated text Dz.U. 2025 poz. 610 (Sejm
   print of 8 October 2025).
   - art. 2 ust. 1 pkt 23 and 26, art. 57 ust. 9, art. 58 ust. 4a and art. 67.
   - https://eli.gov.pl/api/acts/DU/2025/610/text/U/D20250610Lj.pdf

URE's approving decision for RRM/Z/14/2025 did not download (TLS handshake failure). The card
itself is the approved text, so the gate does not depend on the decision.

### What it changes

- **§6, PL `deratingCurve`:** not a flat 0.1339. The proposal becomes 0.1339 × min(1, h/4), that
  is `{ 1: 0.0335, 2: 0.0670, 4: 0.1339, 6: 0.1339, 8: 0.1339 }`.
  - The engine's 0.1339 at the 4h archetype is right and does not move.
- **§6, PL `marginalHour`:** the uplift for hours 3–4 is not 0.
  - The dashboard's +€15k pays for 0.25 of factor. Scaled to the 0.0670 that hours 3–4 add, the
    uplift is about **+€4k**.
  - The net marginal value of hours 3–4 becomes about **−€5k**, not −€9k.
- **§0.1, §2.1 and §3.2, PL wording:** the capacity line pays for hours up to four and nothing
  beyond. It has not stopped paying for hours altogether.
- **§2.4: no change.**

---

## DG-2 — Does the EIA-860 Energy Storage schedule carry MWh?

### Answer

**Yes, and the connector comment is wrong.**

- **The annual layout lists the field.** `LayoutY2025.xlsx` lists "Nameplate Energy Capacity
  (MWh)" on schedules 3B and 3C (lines 3B-34 and 3C-11). It is marked for the Energy Storage
  Operable, Proposed and Retired-and-Canceled files.
- **The annual data fills it.** `3_4_Energy_Storage_Y2025.xlsx` carries the column. All 1,003
  operable battery records have it.
- **The monthly form carries it too.**
  - EIA-860M has the same column on its Operating sheet, though not on Planned.
  - In the August 2026 file, every one of 1,128 operating battery rows (54,451 MW) has an MWh.

The comment at `etl/sources/eia-860-enrichment.mjs:22` ("EIA does not publish an MWh for battery
generators on either form") is wrong for both forms. So is `etl/sources/eia-860m.mjs:15` ("It
also carries no energy capacity").

The same 860M file also carries Latitude and Longitude on its Operating and Planned sheets.
`eia-860m.mjs:11` says the monthly file lacks coordinates. None of this was edited; it is out of
scope.

**Measured from the opened files.** These are derived figures, Σ MWh ÷ Σ MW of nameplate:

| Scope | Date | MW | MWh | Duration |
|---|---|---|---|---|
| US, operable batteries (EIA-860 final) | end-2025 | 43,643 | 121,045 | 2.77h |
| ERCOT balancing authority (860M) | August 2026 | 18,205 | 30,020 | 1.65h |
| CAISO balancing authority (CISO only, 860M) | August 2026 | 17,094 | 59,118 | 3.46h |
| PJM (860M) | August 2026 | 666 | 1,504 | 2.26h |

The ERCOT figure matches the plan's 1.65h from Modo.

### Quotations

- `LayoutY2025.xlsx`, Field Directory: "Nameplate Energy Capacity (MWh) | 3B, 3C | 3B-34, 3C-11 |
  The nameplate energy capacity".
- `3_4_Energy_Storage_Y2025.xlsx`, title row: "2025 Form EIA-860 Data - Schedule 3, 'Energy
  Storage Data' (Operable Units Only)".

### Sources (all opened)

1. EIA, *Form EIA-860 detailed data, 2025 final* (released 10 September 2026).
   - https://www.eia.gov/electricity/data/eia860/xls/eia8602025.zip
   - Inside the zip: `LayoutY2025.xlsx`, "Content and Layout of the Annual Electric Generator
     Report (EIA-860) Data Files for 2025" (dated 9 June 2026), and
     `3_4_Energy_Storage_Y2025.xlsx` (dated 10 September 2026).
2. EIA, *Preliminary Monthly Electric Generator Inventory*, August 2026 (released 24 September
   2026), sheet "Operating" ("Inventory of Operating Generators as of August 2026").
   - https://www.eia.gov/electricity/data/eia860m/xls/august_generator2026.xlsx

### What it changes

- **No §6 row and no §2.4 figure.**
- **§1.3** says `eia-860m.mjs` has no MWh. That describes the connector, not EIA's data.
- **§4.3:** the condition for the US joining Part C is met.
- **§4.4:** the ERCOT data trigger (4h above 25% of quarterly commissioned MW) becomes buildable.

---

## DG-5 — How four schemes treat fade against their duration floors

All four measure fade, and none ignores it. They differ in when they test and how hard they
penalise.

### Western Australia — Reserve Capacity Mechanism, ESR credits

**Answer.**

1. **Credits are re-certified every Reserve Capacity Cycle, and fade de-rates them linearly.**
   - An ESR's Peak Certified Reserve Capacity is AEMO's expectation of its Linearly Derating
     Capacity (4.11.3).
   - That is the lesser of nameplate and maximum Charge Level (MWh) ÷ the hours in its Peak
     Electric Storage Resource Obligation Duration (Chapter 11 definition).
   - Applicants must give capability data "for each year of its expected remaining life"
     (4.10.1(fA)(iii)–(iv)).
   - AEMO must document "how AEMO will account for any degradation", using manufacturer data and
     observed performance (4.9.10(c)(ii)).
   - So fade de-rates credits year by year, linearly, with no cliff.
2. **The duration that credits are measured against is fixed for ten years.** It is the
   requirement in force when the ESR first received credits (Peak ESROD definition, (a)(i)). For
   the 2026 cycle that is seven hours (DG-6).
3. **The 10-year fixed price adds a second floor, tested every cycle.**
   - A ten-year Fixed Price Component must be able to hold its Peak Certified Reserve Capacity
     traded bilaterally for at least the highest forecast ESR Duration Requirement in the ESOO's
     Long Term PASA horizon (4.14.1CB(a)(ii)(2)).
   - In the 2026 ESOO that is **7.5 hours** (2031–32).
   - If it later cannot, and the fixed price is at or above the floating price, it is treated as
     a five-year fixed price from then on (4.14.1CC).
   - The fixed price is set "per Peak Capacity Credit per Trading Day". The quantity is still
     re-certified each year under the election.

**Quotations.**

- 4.14.1CC(a)(iii): "it cannot currently maintain output at the level of its Peak Certified
  Reserve Capacity".
- Linearly Derating Capacity: "maximum Charge Level capability (in MWh) divided by half the number
  of Trading Intervals". The Trading Intervals are those of the Peak ESROD, so half their number is
  hours.

**Source (opened).** Government of Western Australia, *Electricity System and Market Rules*,
consolidated to 1 October 2026 (PDF dated 23 September 2026).

- Clauses 4.9.10, 4.10.1(fA), 4.11.3, 4.14.1B, 4.14.1CB and 4.14.1CC.
- Chapter 11 definitions: Linearly Derating Capacity, Peak Electric Storage Resource Obligation
  Duration and Fixed Daily Peak Reserve Capacity Price.
- PDF pp. 439, 444–445, 457, 483–484, 798 and 812.
- https://www.wa.gov.au/system/files/2026-09/electricity_system_and_market_rules_-_1_october_2026.pdf
- The 7.5h comes from the 2026 ESOO (DG-6).

**Not opened.** AEMO's *WEM Procedure: Certification of Reserve Capacity*, which sets out the
degradation arithmetic. The download returned a Cloudflare challenge (HTTP 403). The Rules settle
the gate; the procedure would only add detail.

**§2.4, WA.**

- Credit fade is confirmed. A 7h build holds 5.84h in year 10, and its credits fall to 83.4%.
- 8.4h holds full credits (unchanged).
- **New:** holding the 10-year fixed price on all credited MW to year 10 needs 7.5 ÷ 0.8337 =
  **9.0h**.

### Japan — Long-Term Decarbonisation Auction (LTDA)

**Answer.**

1. **The floor.** A battery qualifies only if it can run continuously for six hours or more at
   least once a day at the eligible capacity. The annual average of its declared monthly
   continuous-generation hours must also be six or more (2025 guidelines, 電源等要件 D).
2. **Fade is priced in up front, not re-tested.**
   - Bidders declare monthly managed capacity (管理容量) and continuous hours "taking into account
     operational risks over the years the scheme applies".
   - The form names "capacity decline due to degradation" among those risks.
   - The declared figure becomes the assessed capacity (アセスメント対象容量), deemed to include
     every operational risk.
3. **It is enforced every delivery year.**
   - The source must stay able to supply at least the assessed capacity (contract terms, art. 19
     ①(1)).
   - Each 30-minute slot's shortfall counts as a fractional stop slot, and unplanned slots count
     five times (art. 20).
   - The penalty is 0.0125% of the annual contract amount per slot-equivalent beyond 8,640 a year
     (art. 21). It is capped at 110% a year and 18.3% a month (art. 25).
   - Batteries must also offer surplus within the daily operating duration they registered at
     bidding (art. 19 ※2).
4. **The term** is 20 years in principle, and longer on request. It starts in the fiscal year
   after supply begins.

**Quotations.**

- Form note: "当該容量にはあらゆる運用のリスクが織り込まれているものと見なし" [the capacity is
  deemed to have every operational risk built in].
- Same form, risks named: "劣化による容量低下" [capacity decline due to degradation].

**Sources (opened).**

1. OCCTO, 第528回理事会 第2号議案 (3 September 2025). It attaches the final
   長期脱炭素電源オークション募集要綱（応札年度：2025年度）, the round that results were announced
   for in May 2026, and the 長期脱炭素電源オークション 容量確保契約約款.
   - PDF pp. 12, 14, 63, 82–86 and 90.
   - https://www.occto.or.jp/soukaihoka/rijikai/2025/files/rijikai_528_gian2.pdf
2. OCCTO, 長期脱炭素電源オークション募集要綱（応札年度：2026年度）, 2 September 2026. It carries the
   same eligibility and the same form note on p. 13 and in the form.
   - https://www.occto.or.jp/assets/260902_boshuyoukou_long_2026.pdf

**§2.4, Japan: unchanged.** The contracted kW must still hold six hours in year 20: 8.8h per
contracted kW. Declaring fewer kW for a 6h build reaches the same ratio. The plan's §6 JP row
(6h throughout) now rests on an opened source.

### Germany — StromVKG

**What the law is.**

- StromVKG is the *Strom-Versorgungssicherheits- und Kapazitätengesetz*, Article 1 of the *Gesetz
  zur Sicherung der Versorgungssicherheit Strom und zur Bereitstellung neuer Kapazitäten*.
- I read the government bill (BT-Drs. 21/6279, 8 June 2026) and the text the Bundestag adopted
  (BR-Drs. 410/26, 10 July 2026).
- I did not open a Bundesgesetzblatt promulgation, nor the Commission's state-aid decision. § 87
  makes the law subject to that decision.

**Answer, on the adopted text.**

1. **The floor at the bid.**
   - In long-duration tenders the bid's maximum delivery duration (*Höchsterbringungsdauer*: the
     full hours a store can feed in at the bid nominal power, § 2 Nr. 18) must be at least ten
     hours (§ 38 (1) Nr. 6, § 49 Nr. 5).
   - The term is 15 years only (§ 12 (2)).
2. **Eligibility was relaxed between bill and law.**
   - Plants must be able to feed in "Strom in Höhe von 80 Prozent der installierten Leistung" for
     ten consecutive hours.
   - Energy-limited plants must be able to do so again "jederzeit spätestens nach 3 Stunden" [at
     any time, after at most three hours] (§ 12 (5)).
   - The bill had 100% and one hour.
3. **Fade is re-tested every year.**
   - After each commitment year, the holder names an uninterrupted measurement window equal to
     the bid's maximum delivery duration. The window may lie up to 24 months before the end of
     that year (§ 69).
   - The demonstrated reduced capacity is "die kleinste der gemessenen Leistungen innerhalb des
     Messzeitraums" [the smallest power measured in the window] × the reduction factor (§ 70).
   - If it falls short of the awarded reduced capacity, the penalty is twice the capacity payment
     × the shortfall fraction (§ 80 (2)).
   - It is capped, together with availability payments, at twice the capacity payment (§ 80 (3)).
4. **Annex 4 (long-duration tenders) prices storage at a reduction factor.**
   - Batteries: 0.58 at 10h, 0.62 at 11h, 0.66 at 12h, rising to 0.89 at 23–24h.
   - The class carries a technical availability factor of 1.00 and a cycle efficiency of 0.92.
     These are inputs to the factor, not eligibility tests. The plan's §2.1 reads them as
     requirements.

**Quotation.** § 80 (2): "Die Pönale beträgt das 2-fache der Kapazitätsvergütung" [the penalty
is twice the capacity payment], multiplied by the shortfall fraction.

**Sources (opened).**

1. Deutscher Bundestag, Drucksache 21/6279, *Gesetzentwurf der Bundesregierung … Entwurf eines
   Gesetzes zur Sicherung der Versorgungssicherheit Strom und zur Bereitstellung neuer
   Kapazitäten …*, 8 June 2026.
   - https://dserver.bundestag.de/btd/21/062/2106279.pdf
2. Bundesrat, Drucksache 410/26, *Gesetzesbeschluss des Deutschen Bundestages*, 10 July 2026.
   - § 2 Nr. 18 (p. 10), § 12 (p. 15), § 38 (p. 27), § 49 (p. 34), §§ 69–70 (pp. 45–46), § 80
     (p. 50) and Annex 4 (p. 61).
   - https://dserver.bundestag.de/brd/2026/0410-26.pdf

**§2.4, Germany.**

- **Per bid MW, the plan's 13.3h stands** (10 ÷ 0.98¹⁴).
- The last year may be tested on year-14 capability, because the window can lie up to 24 months
  early. That gives 13.0h (10 ÷ 0.98¹³).
- **Per connection MW the floor is lower.** The adopted text lets a bid cover 80% of installed
  power, so the energy floor is 8 MWh per installed MW. Holding it to year 15 needs 10.6 MWh per
  installed MW (8 ÷ 0.7536).
- Which basis applies follows from decision 1 (value per MW of connection).
- Two points sit outside §2.4 but decide whether batteries can use this route at all:
  - the route pays 58% of nominal power at 10h;
  - the three-hour re-attainment rule constrains state of charge or charging power. The text does
    not say how it is tested.

### Italy — MACSE

**Answer.**

1. **No oversizing obligation is written. What is written is an allowed decline.**
   - For lithium-ion, the committed capacity (*capacità impegnata*, MWh) may fall 1% a year. So
     may round-trip efficiency (Relazione tecnica).
   - The other parameters for lithium-ion:

     | Delivery period | Equivalent cycles | Efficient unavailability | Target duration |
     |---|---|---|---|
     | 15 years | 354 a year | 264 hours a year | 8 hours |
2. **Fade is measured every quarter-hour.**
   - The unavailability penalty uses Q_ind. Q_ind includes the gap between the declared maximum
     storable energy, "progressivamente ridotta per tener conto del degrado annuo previsto dalla
     Relazione tecnica", and the energy actually available on Terna's systems (Disciplina art.
     26.3.b.I).
   - Penalties apply beyond the efficient unavailability level. Without five days' notice they
     apply from the first quarter-hour.
   - They run at 1.2 to 2.5 times the hourly premium per MWh short. They are capped at 1.2 × the
     premium × the committed capacity a year (art. 26.1–26.4).
3. **Oversizing is the developer's answer, and the regulator prices it.**
   - Terna's technology study finds 12% oversizing necessary against an allowed 1% a year.
   - ARERA built 12% into the first auction's premium cap. For the 2029 auction it rejected
     operators' requests to raise it.

**Quotations.**

- Terna study: "sarebbe necessario sovradimensionare l’impianto del 12% rispetto alla capacità
  impegnata" [the plant would need oversizing by 12% relative to the committed capacity].
- ARERA 332/2026: "non vi sono evidenze di maggiori degradi delle prestazioni delle batterie"
  [there is no evidence of greater battery performance degradation].

**Sources (opened).**

1. Terna, *MACSE — Relazione tecnica*, the version dated 12 April 2024. Its cover reads
   "Approvata con Decreto … del [.]". p. 4.
   - https://download.terna.it/terna/Relazione_tecnica_8dc5add45277331.pdf
2. Terna, *Disciplina del meccanismo di approvvigionamento di capacità di stoccaggio elettrico*,
   consultation version of 31 October 2023. Art. 26, pp. 37–38.
   - https://download.terna.it/terna/Disciplina_MACSE_8dbda3943dc7d3c.pdf
3. Terna, *Studio sulle tecnologie di riferimento per lo stoccaggio elettrico*, published as ARERA
   168/2025/R/eel Allegato B (April 2025). §3.3 and note 4, pp. 6 and 16–17.
   - https://www.arera.it/fileadmin/allegati/docs/25/168-2025-R-eel-ALLEGATO_B.pdf
4. ARERA, deliberazione 362/2025/R/eel, 29 July 2025 (premium cap, first auction).
   - https://www.arera.it/fileadmin/allegati/docs/25/362-2025-R-eel.pdf
5. ARERA, deliberazione 332/2026/R/eel, 24 September 2026 (premium cap, 2029 delivery auction),
   pp. 8–9.
   - https://www.arera.it/fileadmin/allegati/docs/26/332-2026-R-eel.pdf

**Version caveat.**

- I could not open the Disciplina as approved by DM 346/2024 (22 October 2024), nor as updated by
  the decree of 27 March 2026.
  - The decree PDFs carry the decree text only, without the annex.
  - Terna's MACSE page did not render to a script-free fetch.
  - The in-app browser refused terna.it.
- The mechanism, an allowed 1% a year decline penalised every quarter-hour, therefore comes from
  the 2023 Disciplina and the 2024 Relazione tecnica.
- ARERA's 2025 and 2026 decisions confirm that the 12% oversizing allowance against the
  Relazione tecnica's degradation limit carried into both auctions.
- Re-check the article numbers and penalty multipliers against the 2026 text before they go into
  code.

**§2.4, Italy.**

- Replace "18% at 8h across the term, per the IT dashboard" with **about 15%**.
  - At the platform's 2%/yr seed against an allowed 1%/yr, holding the declining obligation to
    year 15 needs (0.99 ÷ 0.98)¹⁴ = 1.153 of the committed MWh at COD.
  - If the allowance is read as linear, it is 14%.
- Terna and ARERA price 12%.
- The 18% is a trade-press figure. It appears in no rule I opened.

**Flagged, not changed: the IT engine's degradation seed.**

- `src/markets/it/comparison.js:123–128` derives a 1.1%/yr seed from "18% oversizing … ≈ 1.02%/yr".
- That ignores the 1%/yr decline MACSE already allows. Against that allowance, 18% oversizing
  implies about 2.1%/yr of physical fade, and Terna's 12% implies about 1.8%/yr.
- The seed is understated by roughly half. It is an analyst-class value outside §6.

### The §2.4 table with these findings

| Scheme | Floor | Term | How fade is measured | Usable at end of term from a build at the floor | Build needed to hold the floor |
|---|---|---|---|---|---|
| WA RCM, credits | 7h (fixed for ten years from first credits) | 10 capacity years | Re-certified every cycle. Credits = min(MW, MWh ÷ 7h), with degradation counted | 5.84h; credits 83.4% | 8.4h (unchanged) |
| WA RCM, 10-year fixed price | 7.5h (highest forecast requirement in the 2026 ESOO) | 10 years | Tested every cycle (4.14.1CC). Failure means five-year treatment | 7.5 × 0.8337 = 6.25h | 7.5 ÷ 0.8337 = **9.0h** (new) |
| Japan LTDA | 6h annual average, declared | 20 years | The declared capacity must already allow for degradation. Per-slot shortfall penalties every year | 4.09h | 8.8h (unchanged) |
| Germany StromVKG | 10h at the bid's nominal power | 15 years | Functional test every year over the bid duration. Penalty twice the shortfall | 7.54h | 13.3h per bid MW, or 13.0h if the last test uses year-14 capability (unchanged). 10.6 MWh per installed MW when bidding 80% |
| Italy MACSE | Paid per MWh. Committed MWh may fall 1% a year | 15 years | Every quarter-hour against the declining path, beyond 264 h a year | — | About 15% oversizing at 2%/yr. Terna and ARERA reference 12% |

---

## DG-6 — Does the 2026 ESOO's seven hours apply to the 2028–29 Capacity Year?

### Answer

**Yes.**

- **Seven hours applies to the 2028–29 Capacity Year.**
  - The 2026 WEM ESOO sets the ESR Duration Requirement for new storage certified in the 2026
    Reserve Capacity Cycle, which is Capacity Year 2028–29.
  - It is an assessed six hours plus an Availability Duration Gap of one hour: 14 Trading
    Intervals.
- **It then holds for that storage for ten years** (Peak ESROD definition, ESM Rules).
- **The WA archetype bids into that cycle**, so its 7h has no buffer over the requirement.

Three further points from the same document:

- **The 10-year fixed price needs 7.5 hours.** `src/markets/wa/comparison.js` uses that election
  to corroborate its A$422,372/MW price. At 7h the election is not available on the full credited
  MW (DG-5).
- **Later requirements may rise.** The ESOO's sensitivity with anticipated storage puts the
  requirement at eight to eight and a half hours later in the outlook. That applies to storage
  certified in later cycles, not to storage certified in 2026.
- **The benchmark may move.** The ESM Rules require the Coordinator to redetermine the Benchmark
  Technologies within six months of a changed requirement (4.16.11(b)). The six-hour benchmark
  behind the 2028–29 BRCP predates this ESOO.

### Quotations

- p. 74: "sets the requirement for new ESR for 2028-29 under the 2026 Reserve Capacity Cycle".
- p. 78: "an ESR Duration Requirement of 14 Trading Intervals (seven hours) for 2028-29".
- p. 77: "the highest forecast ESR Duration Requirement … is seven and a half hours in 2031-32".

### Sources (opened)

1. AEMO, *2026 Wholesale Electricity Market Electricity Statement of Opportunities*, June 2026.
   - It is based on information as at 11 June 2026; the PDF file is dated 15 July 2026.
   - Executive summary (p. 4); §4.1.1 with Tables 24–25 (pp. 74–78); §4.1.2 (p. 79); §5 (p. 84).
   - https://www.aemo.com.au/-/media/files/electricity/wem/planning_and_forecasting/esoo/2026/2026-wem-electricity-statement-of-opportunities.pdf
2. *Electricity System and Market Rules*, 1 October 2026: the definition of Peak Electric Storage
   Resource Obligation Duration (p. 812) and clause 4.16.11. URL as under DG-5.

### What it changes

- **§6, "WA's buffer": resolved. The buffer is zero.**
  - The note in `src/markets/wa/comparison.js:14–20` (7h = a six-hour window plus 17%) rests on a
    six-hour requirement that no longer applies to the cycle it bids into.
  - The archetype's duration is methodology and stays yours.
- **§2.4, WA:** the floor is 7h for credits, confirmed. Add the 7.5h fixed-price floor (DG-5).
- **§0.1, WA:** "RCM · at least 7h" holds for credits. The fixed-price route needs 7.5h, and 9.0h
  to keep it for ten years without augmentation.

---

## What changes in the plan

### §6 rows

| §6 row | Before | After | Gate |
|---|---|---|---|
| PL `deratingCurve` | 0.1339 at every duration | **0.1339 × min(1, h/4)**: 1h 0.0335, 2h 0.0670, 4h–8h 0.1339. The KWD is flat; certification caps sub-4h storage | DG-1 |
| PL `marginalHour` uplift | 0, with net hours 3–4 at −€9k | **About +€4k**, with net hours 3–4 at **about −€5k** | DG-1 |
| GB `deratingCurve[4]` and vintage table | Dashboard 0.45 → 0.38 | **Reversed.** Dashboard 0.45 → 0.4396, with the vintage table in G1. **Engine 0.38 → 0.4396**, which moves the GB capacity line (+15.7%) and the league table | G1 |
| GB lab seed `hours` | 2 → 4 | Unaffected by these gates | — |
| JP `durationPath.hours` | 6 throughout | Unchanged. Now on an opened OCCTO source | DG-5 |

**The §6 preamble no longer holds for GB.** It says the engine "already carries the right
values". The GB correction is an engine change and needs its own decision.

**The flagged items change too.**

- **WA's buffer: resolved, zero** (DG-6). Plus the 7.5h fixed-price floor.
- **New flag: the IT engine's 1.1%/yr degradation seed is misderived** (DG-5, Italy).
- Ireland and the WA merchant level are untouched.

### §2.4 figures

| Market | What changes |
|---|---|
| WA | 5.84h, 83% and 8.4h confirmed. **New:** the 10-year fixed price needs 7.5h held, so the build is **9.0h** |
| Japan | 4.09h and 8.8h unchanged; mechanism confirmed |
| Germany | **13.3h** per bid MW stands, or 13.0h with the early-window rule. **Floor clarified:** 10h at bid power, while eligibility is ten hours at 80% of installed power. That gives 10.6 MWh per installed MW |
| Italy | **"18%" → about 15%** at the 2%/yr seed (14% on a linear reading). The scheme's own reference is 12% |

The text above the §2.4 table also changes. Decision 6's premise holds for all four schemes, since
each measures fade. The WA dashboard's "8-hour minimum design" sits between the 7.5h fixed-price
floor and the 9.0h needed to keep it.

### Other plan text these gates correct

These are outside §6 and §2.4 and are listed for completeness.

- **§1.3:** EIA-860M carries MWh; the connector just does not read it.
- **§4.3:** the condition for the US joining Part C is met.
- **§2.1 and §0.1, Germany:** the floor is 10h at bid power. The 92% and 100% are Annex 4 class
  parameters, not tests, and the route pays a 0.58 reduction factor at 10h.
- **§2.1, WA:** "Credits de-rate linearly below the ESR duration requirement" is confirmed by the
  Rules.
- **§3.2, GB:** T-4 factors rose across the last three vintages. Only T-1 fell.
- **§12:** sources [2], [4], [10], [15] and [17] can be replaced by the opened documents above.

### Against what PR 1 declared (§14)

While these gates were open, the plan gained §13 (your sign-off of all seven decisions, including
the §6 corrections) and §14 (PR 1, commit `dcb3f34`). PR 1 declared its `durationResponse`
curves from §6, so five of its values are touched. Nothing below was edited.

| Market | Declared in PR 1 | What the gates say | Effect on §14's sweep |
|---|---|---|---|
| GB | `capacityDerating` [0.09, 0.22, 0.45, 0.63, 0.77], basis `seed`, read as a shape. The engine level stays 0.38 | **Published T-4 2029/30:** [0.1099, 0.2198, 0.4396, 0.6608, 0.8777]. As a shape that is [0.25, 0.50, 1.00, 1.50, 2.00], against the declared [0.20, 0.49, 1.00, 1.40, 1.71]. The level should be 0.4396 | Longer builds gain on the CM route, and every CM design gains 15.7% at the level. §14's "2h, band 2–4h" on the CM route needs re-running |
| PL | `capacityDerating` flat 0.1339, basis `reported` | **0.1339 × min(1, h/4):** [0.0335, 0.0670, 0.1339, 0.1339, 0.1339]. As a shape that is [0.25, 0.5, 1, 1, 1] | §14's "CM 1h, gives up $289k" rests on the flat curve. Under the four-hour rule a 1h build earns a quarter of the capacity line, so that result should not be published |
| WA | `cap: { floorHours: 7, floorKind: 'linear', termYears: 10 }` | **Confirmed** by ESM Rules 4.11.3 and the Peak ESROD definition. The 10-year fixed price's 7.5h floor (4.14.1CB, 4.14.1CC) is not modelled | None today: the engine prices the surplus-adjusted Reserve Capacity Price. It matters if the fixed price is ever priced |
| JP ×3 | `ltda` floor 6h, binary, held for 20 years. §14: "none until DG-5" | **OCCTO measures it that way.** The declared capacity must already allow for degradation, and shortfalls are penalised every year. A bidder may instead contract fewer kW (about 68% of nameplate for a 6h build at 2%/yr) and hold that for the whole term | "Fails its floor at year 20" is the right reading. The 8.8h build lies outside the 8h grid. Contracting fewer kW for the term is a third floor kind, which the engine's `binary` and `linear` do not express |
| IT | `ltda: { paymentBasis: 'kWh' }`, with no fade rule | **Committed MWh may fall 1%/yr.** Shortfalls below that path are penalised every quarter-hour beyond 264 h/yr | Not modelled. At the engine's own 1.1%/yr seed the oversizing is about 1.4%. At about 2%/yr, which the 12% and 18% figures imply, it is 12–15% |

§14 says "§6's GB correction is a dashboard change and goes in PR 2". That needs revising: the
dashboard row's level was right, and the engine level is the one to change.

### Repository notes that are now wrong

None of these was edited, because all are outside this task's scope.

- `src/markets/gb/comparison.js:293` and `src/markets/pl/comparison.js:272`: the PR 1 curves above.

- `etl/sources/eia-860-enrichment.mjs:22`: no MWh "on either form".
- `etl/sources/eia-860m.mjs:11–17`: no coordinates and no energy capacity.
- `src/markets/gb/comparison.js:37–47`: the 0.38 and its "CM year 2024/25" label.
- `src/markets/wa/comparison.js:14–20`: the six-hour window and 17% buffer.
- `src/markets/it/comparison.js:123–128`: the 1.1%/yr derivation.

---

## Left open, or not opened

| Item | Why | Effect on the gates |
|---|---|---|
| AEMO, *WEM Procedure: Certification of Reserve Capacity* | Cloudflare challenge (HTTP 403) | None. The ESM Rules settle WA |
| MACSE Disciplina as approved (October 2024) and as amended (March 2026) | Not found as a downloadable file. The in-app browser refused terna.it | Italy closed on the 2023 Disciplina, the 2024 Relazione tecnica and ARERA 2025–2026. Re-check article numbers |
| URE decision approving RRM/Z/14/2025 | TLS handshake failure | None. The approved card itself was opened |
| StromVKG promulgation (BGBl) and the EU state-aid decision | Not looked up as opened sources | None on the rules read. Whether the law is in force is not established here |
| PSE confirmation that sub-4h storage certifies at MWh ÷ 4 | A reading of the Rules, not a published statement | The PL §6 figures rest on it |
