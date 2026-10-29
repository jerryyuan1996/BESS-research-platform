# Saudi Arabia (`sa`) — registration plan, 2026-10-29

**Call: register Saudi Arabia by analyst ruling as a contracted-storage market, `engineReady: false`
until SPPC's storage price is known — the way Finland came in.** SPPC buys four-hour storage under
15-year build-own-operate Storage Services Agreements (SSAs). Group 1 (2 GW / 8 GWh) was signed on
20–21 August 2026 for SAR 4.35bn of investment, which is SAR 2.175m/MW, or US$145/kWh all-in. Group 2
(3 GW / 12 GWh, six sites) closes bids on **12 November 2026** with 27 prequalified bidders, most of
them foreign. The structure suits an infrastructure fund: a single state buyer, a fixed fee for
availability, and no merchant leg. **The one input missing is the price.** SPPC has published no tariff
for Group 1, in English or in Arabic, and no partner disclosure gives one. Every disclosed figure is an
investment value. Evidence: **Strong** for structure and capex, **none** for the contract line.

Scout graduation is not the route: no card exists and `GRADUATION` needs two consecutive reviews.

**Status: signed off 2026-10-29 with every recommended option, and built (uncommitted).** Saudi
Arabia is the seventeenth registered market (`src/markets/sa/`), engine-withheld and not yet graded.
Two things the build found:

- **The schema could not say "capacity contract, price withheld".** A null field with a declared
  reason was allowed only for always-required fields, and `contracted` is required only when the
  capacity capability is claimed. `src/utils/validation.js` now accepts a capability-required field
  as null and declared, on an unready market only; `tests/registry.test.js` reads such a line as
  backing the capability.
- **No Investment Lab.** The Lab prices a contract line; the portfolio tab shows break-even fees at
  6–9% instead (about SAR 269k/MW/yr at 7%).

---

## 1. The Storage Services Agreement

No SSA text is public. What is known comes from SPPC's announcement as reported (SPA, Argaam,
Zawya/TradeArabia, pv magazine, ESS News) and the two consortia's own disclosures. SPPC's site
(spp.com.sa) refused connections when read on 2026-10-29 (gate SA-6).

| Term | What is known | Source |
|---|---|---|
| Buyer | Saudi Power Procurement Company (SPPC), the Principal Buyer, under the Ministry of Energy | SPPC announcement, 20–21 Aug 2026 |
| Model | Build-own-operate. The winner develops, finances, builds, owns, operates and maintains | Same |
| Term | **15 years from each project's COD** | Saudi Energy / ACWA Power disclosure (Zawya, Aug 2026) |
| Payment | Described in trade press as a fixed fee for availability; the formula is not public | Gate SA-1 |
| Price | **Not disclosed** for any Group 1 project | Gate SA-1 |
| Indexation | Not disclosed. SPPC's PV PPAs are flat in nominal riyals; whether the SSA follows is unknown | Gate SA-2 |
| Merchant revenue | None. Saudi Arabia has no wholesale market; SPPC is the single buyer and dispatches | Market structure |
| Ownership | Winners hold 100% of each SPV. ACWA's three sites: ACWA 34.9% (at financial close), Saudi Energy 35.1%, Al Sharif Contracting the rest | Zawya, Aug 2026 |

**Group 1 awards** (each 500 MW / 2,000 MWh, four hours):

| Project | Region | Consortium | Disclosed value |
|---|---|---|---|
| Al Muwayh BESS ISP | Makkah | Saudi Energy, ACWA Power, Al Sharif Contracting | SAR 3.25bn for the three (Saudi Energy) |
| Haden BESS ISP | Makkah | same | ″ |
| Al Kahfah BESS ISP | Hail | same | ″ |
| Al Khushaybi BESS ISP | Qassim | ENGIE, Haji Abdullah Alireza & Co. | about US$220m (ENGIE) |
| **Total** | | | **SAR 4.35bn (US$1.16bn)** (SPPC) |

Check: SAR 4.35bn − 3.25bn = SAR 1.10bn left for Al Khushaybi (US$293m), against ENGIE's own
US$220m. The gap of US$73m is most likely what ENGIE leaves out: financing costs, development and
the connection. The three ACWA sites come to SAR 2,166,667/MW, within 0.4% of SPPC's
SAR 2,175,000/MW average, so the SAR 3.25bn is the same kind of figure: investment, not contract value.

**Group 2** (3 GW / 12 GWh): Samha (Qassim), Al-Leeth (Makkah), Al-Henakiyah (Madinah), Khulais
(Makkah), Sadawi (Eastern Province), Ashyrah (Makkah), each 500 MW. 27 prequalified in July 2026,
including Masdar, ACWA Power, EDF, TotalEnergies, Marubeni, KEPCO, Korea Western Power, Sumitomo,
SPIC, PowerChina, China Southern Power Grid, TNB, Tesla and Saudi Electricity. Bids extended to
12 November 2026 (MEED). The target is 48 GWh of storage by 2030.

### Proposed comparison inputs

- `engineReady: false`, `capabilities.capacityMarket: false`, `contracted: null` until gate SA-1
  closes; `contractYears: 15`, `postFactor: 0`, `merchant: false`, `ancillary: false`.
- `capNote`: "SPPC Storage Services Agreement, 15 years from COD, build-own-operate; fee for
  availability, price not published".
- Archetype **50 MW × 4 h**: SPPC's duration, at the platform's per-MW scale. SPPC procures only
  500 MW sites, so the "largest single project" limit (about US$290m at SPPC's average) is a
  knock-out for some investors. The card should show it, not the per-MW model.
- `vatPct: 15`, `vatRecoverable: true` (ZATCA).
- Tax: `sa: tax([.20, .20], ['sa'])`. Income tax is 20% on the non-Saudi share of profit; the Saudi
  share pays 2.5% zakat on its zakat base. A foreign first-timer is on the 20%. The 5% withholding tax
  on dividends is not modelled (gate SA-5).
- Debt: a state contract over 10 years, so `contractedDSCR` reads 1.20x under the 2026-10-29
  conventions.

## 2. FX — add SAR to the frozen table

**Proposed `SAR: 0.2667`, the SAMA peg (3.75 riyals to the dollar, unchanged since 1986).** This
departs from the Ontario method, on purpose. Taken through the euro seed, the figure would be
1.08 ÷ (1.1367 × 3.75) = **0.2534**. That would put SPPC's published US$1.16bn at US$1.10bn, a 5%
artefact on the one observed cost. Ontario went through the euro seed to keep a euro-priced DC block
consistent. Here no euro price is used (§3), and the observed figure is in riyals and dollars at the
peg. ECB publishes no SAR rate, so the live feed never moves it.

## 3. Capex — hold SPPC's total; do not rebuild it from the quote

| Basis | Arithmetic | Per MW | Per kWh |
|---|---|---|---|
| **SPPC Group 1 average (seed)** | SAR 4.35bn ÷ 2,000 MW | **SAR 2,175,000** (US$580,000) | **US$145.0** |
| ACWA's three sites | SAR 3.25bn ÷ 1,500 MW | SAR 2,166,667 | US$144.4 |
| ENGIE, Al Khushaybi (low end) | US$220m ÷ 500 MW | SAR 1,650,000 (US$440,000) | US$110.0 |
| Rebuilt with the HiTHIUM block (high end) | 0.44 × 2,175,000 + landed block SAR 1,549,221 | SAR 2,506,221 | US$167.1 |

Landed block: (73.45 × 1.05 duty + 0.768 + 1.5) × 81.25/70 = €92.15/kWh at the meter × 4.2030 SAR/EUR
(1.1208 × 3.75, the quote date's ECB USD rate at the peg) × 4,000 = SAR 1,549,221/MW. The 5% duty is
the GCC common external tariff's general rate, not yet confirmed for 8507.60 in ZATCA's schedule
(gate SA-3).

**Why held, not rebuilt.** The quoted block is a 2 h, 81 MWh European offer. Landed in Saudi Arabia
it would be **71%** of SPPC's all-in cost and 94% of ENGIE's, which leaves no room for the power
side, civil works and connection. Saudi winners are buying at 2 GWh a site: Gotion supplies about
6 GWh of Group 1, and SEC's own builds reportedly came in at US$120–123/kWh (Renewable Vision citing
procurement data). So the quote is not the Saudi block price. The method is `'held'` with the share
taken from `CAPEX_SHARES`, not from the quote. `SAR` goes into `DUTY_PCT` (5) and `USD_PER` (1/3.75) so
`quotedEconomics` resolves.

Band (observed ends, kind `sourced`): low **SAR 1,650,000** (ENGIE), high **SAR 2,506,221** (rebuilt).
Opex seed SAR 30,000/MW/yr (US$8,000, the Romanian and Finnish level for an availability-only asset
with no trading desk; gate SA-4).

**Sense check, and why the engine waits.** On the seed capex, a 15-year availability fee recovering
SAR 2.175m/MW at a 7% nominal cost of capital is 2,175,000 × 0.1098 = SAR 238,800/MW/yr, plus
SAR 30,000 opex: about **SAR 269k/MW/yr (US$72k)**. That is what a bidder must ask to earn 7%. Using it
as the seed would make the market's return equal the assumption, which is why option (b) under
decision 1 is not recommended.

## 4. Registration contract (docs/adding-a-market.md, step 6)

| Item | Proposal |
|---|---|
| Manifest | `id: 'sa'`, slug `saudi-arabia`, `currency: 'SAR'`, `locale: 'en-SA'`, `timezone: 'Asia/Riyadh'`, 17th market (hue + pattern pair), `modelVersion: 'sa-1.0-sppc-ssa'` |
| Remove from scout roster | `SCOUT_ROSTER` drops `sa`; Americas and Middle East scouts Chile alone until a replacement is named |
| Congestion register | `sa/congestion.js`: none applies. SPPC chooses the site and National Grid SA builds the connection, so access is allocated by procurement, not by a queue (Ontario precedent) |
| Grid map + boundary | Saudi boundary from the boundary script; markers at the ten Group 1 and Group 2 sites by town; OSM lines (ODbL, attribution visible) |
| Transmission voltage | `sa: { bulkKV: 380, detailKV: 132, operator: 'National Grid SA (SEC)', levels: ['380 kV', '230 kV', '132 kV'] }`. 380 kV is the national backbone. Detail at 132 kV; the 110/115 kV split to be confirmed against National Grid SA (gate SA-7) |
| Bounding box | `etl/sources/osm-grid.mjs`: about 16.3–32.2°N, 34.5–55.7°E |
| Pipeline source | `projectPipelineSources.js`: SPPC project announcements (Group 1 awards, Group 2 prequalification) |
| Dashboard | Ten sections in seven tabs; revenue section `capacity` (SSA) shown as structure with the price withheld; `energy` and `services` state that no market exists |
| Decision profile | `sa`: confidence 3 (Finland's level: structure verified, largest line withheld). Play `sa-sppc-4h`: bid a future SPPC round inside a consortium, COD about 2029, 15-year SSA. Shown as structure until the engine is ready |
| Flag | `sa` already in `COUNTRY_FLAGS` from the scout roster |
| Tests | ids and counts in `registry.test.js`, `grid-maps.test.js`, `bundle-budget.test.js`, `scout.test.js` |

## 5. Research gates

- **SA-1** The SSA price. Most likely sources: SPPC's Group 2 award announcement (H1 2027), an ACWA
  Power or Saudi Energy Tadawul filing at financial close, a lender's disclosure, or the SSA itself.
  Closing it makes the market engine-ready.
- **SA-2** SSA payment formula and indexation: fixed nominal, CPI-linked, or part-indexed. The 2.5%
  convention applies until the text says otherwise.
- **SA-3** ZATCA duty on 8507.60; 5% assumed.
- **SA-4** Opex for an SPPC availability asset (LTSA scope, insurance, land lease).
- **SA-5** Dividend withholding tax and treaty relief for a foreign owner.
- **SA-6** SPPC primary pages (unreachable on 2026-10-29); recheck from another network.
- **SA-7** National Grid SA voltage levels and the 132 kV vs 110/115 kV split.
- **SA-8** Local-content rules for BESS under SPPC tenders (no LCGPA percentage found).

## 6. Decisions for Jerry

1. **Engine status.** (a) Register now with `engineReady: false`, structure and capex in, return
   withheld until SA-1 closes. *Recommended*: Finland precedent, and nothing invented.
   (b) Engine-ready on a cost-recovery fee (about SAR 269k/MW/yr at 7%), marked Thin: the return
   would be the assumption. (c) Do not register; write the scout card first and wait for the Group 2
   award.
2. **FX seed.** (a) `SAR: 0.2667`, the peg. *Recommended*: it keeps SPPC's published dollar figure
   exact. (b) 0.25 through the euro seed (Ontario method).
3. **Capex basis.** (a) SPPC's SAR 2.175m/MW held, band SAR 1.65–2.51m. *Recommended*: the official
   all-in figure. (b) Rebuilt with the HiTHIUM block, SAR 2.51m: the quote is not a Saudi price.

---

Sources: SPPC Group 1 announcement, 20–21 August 2026, as reported by Saudi Press Agency, Argaam,
Okaz, Sabq, QNA and Zawya/TradeArabia; Saudi Energy and ACWA Power disclosure (Zawya, August 2026);
ENGIE on Al Khushaybi (Saudi Gulf Projects, August 2026); pv magazine, 25 August 2026; ESS News,
24 August and 3 July 2026; MEED (Group 2 prequalification, July 2026; Group 2 bid extension,
October 2026; Group 1 EPC appointments); Energy-Storage.news (Group 2 bidders); Renewable Vision,
Saudi battery storage series 03 (12 September 2026); SAMA (riyal peg); ZATCA (income tax, zakat,
VAT); the HiTHIUM quotation as already cited in `src/comparison/supplierQuote.js`.
