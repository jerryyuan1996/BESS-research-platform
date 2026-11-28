# End-of-life value and grid-connection value: how investors price it

Research note, 27 November 2026. Covers gate G12 in `docs/external-view.md`, the "terminal-value treatment" item. Research only: no model, fixture or site change has been made. Any change that follows moves numbers in several markets, so under `AGENTS.md` it needs a written plan with each value and its arithmetic, then the analyst's sign-off.

## 1 · The answer

**Infrastructure funds do not, as a rule, add a separate lump terminal value for a battery. They give the grid connection its value in a different way: they model a longer life on the same site, 25–30+ years for the listed GB battery funds and 30–40 years for UK wind and solar trusts, and they pay for augmentation or replacement batteries along the way. The life they use is limited by the lease, the planning consent and the connection, not by the battery.** Transaction prices back this up. Buyers pay well above build cost for operating batteries, and they pay separately for connection rights before anything is built.

The platform's base case has a 20-year life, a retirement charge of 3% of construction at the end, and no salvage. That treats the connection, which is the scarce thing being paid for at ready-to-build, as worth nothing once the first battery is retired, and then charges a cost to leave the site. The analyst is right that this is inconsistent with paying a ready-to-build premium.

**The effect on the 20-year return is real but small.** A site value at year 20 equal to 10–20% of day-one capex adds about 0.2–0.5 points of IRR at 8–12% (§4). The bigger effects are elsewhere:

1. **The five-year sale route.** The exit buyer also gets nothing after year 20, so the sale price, and the lower-of-hold-and-sale ceiling, carries the same gap.
2. **The 15-year cautious case**, where an end value is discounted over a shorter period.
3. **Ready-to-build price ceilings.** These are solved from net present value, so any end-of-life credit raises the ceiling directly.

**Recommended treatment:** add an end-of-life *site value* on both routes. It is the market's observed ready-to-build price per MW, indexed, with a haircut for the chance that lease, consent and connection survive, and net of battery removal. Use it only where a public price exists, keep the 20-year life, and show it first as a separate line beside the headline. Options and the decision needed are in §5.

**Evidence: Fair.** Fund practice and the existence of the premium are well documented. Per-MW connection prices are public for only about half the markets, and the best of them come from one or two trackers. **What would change it:** an independent valuer's report that states a battery terminal value, or a run of disclosed ready-to-build prices in the markets marked Thin below.

## 2 · How mainstream investors treat end of life

| Investor or source | Life and end-of-life treatment | What it implies for connection value |
|---|---|---|
| **Gresham House Energy Storage Fund** (largest listed GB battery fund), annual report 2024 | The NAV is a discounted cash flow. The weighted discount rate is 10.73%: 6.5% on Capacity Market cash, 8.5% on tolling, 10.85% on merchant. The company says its battery investments are designed to run for **25 years or more**. The auditor treats asset life as a key estimate. | The NAV implies an enterprise value of **£734k per operational MW** (1,072 MW). At the March 2025 share price it was £398k/MW. The fund doubled duration at two 50 MW sites by adding batteries behind the **existing inverters and connection equipment**, in about three months. That is the connection being reused for value. |
| **Gore Street Energy Storage Fund**, strategy plan July 2025 and FY2026 results | The weighted discount rate is 10.25% (FY2026). Its plan carries about **495 MW of pre-construction grid connection rights** in GB, Ireland and Texas at **about 8% of NAV** (31 March 2025, NAV £519.3m). The board expects their value to rise as connection dates approach. | 8% × £519.3m ÷ 495 MW ≈ **£84k/MW** for a connection right before construction. That is our arithmetic, and the figure blends three markets. The fund is also upgrading GB and Irish assets from 1h to 2h on their existing connections. |
| **Harmony Energy Income Trust** take-private, 2025 | The independent valuer (Forvis Mazars, under Takeover Code Rule 29) confirmed a DCF of equity cash flows, cross-checked to sector multiples, under IFRS 13 and IVSC guidance. | Modo calculates that the Foresight offer implied **£784k/MW** of enterprise value for a 2h portfolio, against **£550k/MW** typical 2h build cost (excluding financing and development). That is a premium of about £234k/MW, or 43%, on our arithmetic. Modo attributes part of it to site leases of **up to 40 years** and to avoiding connection-queue risk. |
| **Greencoat UK Wind** | 30-year life in the base case. Five years shorter would cut NAV by **14.6%**. | Life is one of the most sensitive inputs in UK renewables NAVs. |
| **Octopus Renewables Infrastructure Trust** | Lives are set asset by asset. Extending some onshore wind farms from 30 to 35 years added **1.72p a share (£9.1m)** to NAV. | Life extensions are booked as value once land and consent rights support them. |
| **Brookfield Renewable**, annual report 2022 | Hydro is valued on a 20-year DCF **plus a terminal value**. Wind, solar and **storage** are valued over their expected remaining useful life, which independent engineers set. | A large infrastructure owner gives perpetual sites a terminal value and finite equipment a long life, but no lump terminal value. |
| **US lease finance** (IRS Rev. Proc. 2001-28) | For a leveraged-lease ruling, the lessor must expect the asset to be worth **at least 20% of original cost** at the end of the lease, after removal cost and without counting inflation. | US lease and sale-leaseback structures therefore carry an appraised residual by construction. |
| **Revenue forecasters and lenders** | Modo's forecasting assumptions use a **15-year** battery life (2025 real terms). Lenders size debt over 5–12 years and give no credit for a terminal value. | The forecast curves funds buy stop at 15 years, and the fund extends them. The platform's 20 years sits between forecaster and fund. |

**Pattern.** The value at end of life is the site (land, consent and connection), not the battery. Funds price it mostly as more operating years on that site, and sometimes as a sale of the rights, as Gore Street plans. Accounting treats connection rights the same way: acquired rights are recognised as identifiable intangible assets at fair value and amortised over the shorter of the contract and their economic benefit (IREN's filings, on power connections for data centres).

## 3 · Connection value, market by market

This table records what a connection right is worth in public sources, and whether the right survives the first battery. Prices are per MW of connection, before construction, unless stated. Evidence: **Strong** means primary, rules-based or several disclosed deals. **Fair** means one tracker or several secondary sources. **Thin** means asking prices, a single deal or nothing public.

| Market | Does the connection outlive the battery? | Public price of rights / ready-to-build | Evidence |
|---|---|---|---|
| **GB** | Yes. A connected site keeps its agreement, and new entrants now need Gate 2 under connection reform. About 153 GW of stalled projects were cut from the queue in December 2025. The proposed CMP470 commitment fee on battery Gate 2 places is £3k/MW rising to £25k/MW; consultation closed 1 Oct 2026, with no decision yet. | Gore Street rights ≈ £84k/MW (derived above). Harmony exit at £234k/MW above 2h build cost, for an operating asset. | **Fair** |
| **Germany** | Yes, and the right is scarce: one buyer reports that less than a tenth of the battery connection capacity requested is actually granted. Transmission operators charge €50k per application plus a €1,500/MW deposit, credited against the construction-cost contribution (BKZ). TransnetBW's extra-high-voltage BKZ is €96.91/kW. | Asking prices for connected rights on a project marketplace: **€124–223/kW** (3.4 MW and 10 MW listings, i.e. small projects). No transaction statistics. | **Thin** |
| **Italy** | Yes. Projects with connection rights, environmental authorisation and land carry a clear premium. | nTeaser deal data: ready-to-build median **€44k/MW** (Q4 2025), falling to **€37.5k/MW** (Q1 2026); range €15–55k/MW. Enerdatics puts ready-to-build at ≥ $80k/MW. | **Fair** |
| **Spain** | Yes. Access permits are the bottleneck: about 34 GW of storage holds access permits against roughly 0.3 GW in service. | nTeaser: ready-to-build battery average **€71.5k/MW** in the quarter reported in June 2026, up from €42k/MW in Q3 2024. Top deals reach about €112k/MW. | **Fair** |
| **Poland** | Yes. Issued connection conditions reserve about 240 GW, 90 GW of it for storage. The connection advance doubled to PLN 60k/MW from 30 April 2026. | No public price for rights. Operating comparator: Greenvolt sold 400 MW / 1.6 GWh for €311.5m at closing plus €80m contingent, i.e. €0.78–0.98m/MW. | **Thin** |
| **Romania** | Yes. Allocation is moving from first-come-first-served to auctions (January 2026 reform), with about 91 GW in the connection process. | None public. | **Thin** |
| **Ireland** | Yes. The connection offer is the asset being traded. | Ready-to-build deals in 2026 (Capital Dynamics, Gore Street's EU fund) were all undisclosed. Gore Street's ~£84k/MW figure includes Irish rights. | **Thin** |
| **Finland** | Yes. A binding Fingrid connection agreement is the headline term in ready-to-build sales. | 2026 ready-to-build deals (Luxcara, Foresight, Nala) were undisclosed. | **Thin** |
| **Japan** (Tokyo, Hokkaido, Kyushu) | Yes. The connection study and its contribution are fixed site by site. | One advisory firm's price ladder for a typical small grid-scale unit, first half of 2026: **rights only ¥150–200m, completed plant ¥700–800m**, so the rights are about 20–27% of completed value. One disclosed sale: 2 MW / 8 MWh for ¥520m. | **Thin** |
| **ERCOT** | Yes, but connection is less scarce because of connect-and-manage, so the right is worth less. | Enerdatics: five development-stage US battery deals in ERCOT since 2024, at **$29–74k/MW**. An earlier ready-to-build sale was marketed at 7–9% of capex (about $60–77k/MW). | **Fair** |
| **CAISO** | Yes, explicitly. CAISO's June 2026 final proposal keeps interconnection service and deliverability for units that retire or repower, and a retiring unit's deliverability can pass to storage. | One development-stage deal at **$400k/MW** (single point). Deliverability is the scarce part. | **Thin** (price) · **Strong** (rule) |
| **PJM** | Yes, explicitly. Capacity Interconnection Rights survive one year after deactivation and can be transferred. FERC accepted PJM's replacement-generation process from 30 Jan 2026. | No rights price. As a proxy for what a new entrant pays to get the right, the average network-upgrade allocation for Transition Cycle 1 batteries was **$206/kW**. | **Fair** |
| **US, other** | Existing wind and solar sites are reused for batteries. | XPLR Infrastructure agreed in February 2026 to sell interconnection assets and rights for four co-located batteries (about 400 MW) to NextEra Energy Resources for about $31m, roughly $78/kW on our arithmetic. This is related-party, so not arm's length, and executed in pieces later in 2026. | **Thin** |
| **NEM** | Yes. In NSW renewable energy zones, access rights are allocated explicitly and paid for through an annual access fee per connection point (7.15 GW allocated in Central-West Orana). | Ready-to-build deals (for example a 250 MW / 1 GWh Riverina project) were undisclosed. | **Thin** |
| **WEM (WA)** | Not researched in public sources. | None found. | **Thin** |
| **Ontario** | Not found. LT2 contract terms govern the first life. | None found. | **Thin** |
| **Saudi Arabia** | Single-buyer storage service agreement, and the engine is already withheld. A site value is not meaningful until the contract terms are known. | — | **Thin** |

**Reading across.** Where prices exist, a pre-construction connection right sells for roughly **€35–110k per MW in Europe and $30–80k per MW in ERCOT**, about 5–20% of build cost. Prices are highest where connections are rationed (Spain, GB, Germany) and lowest where they are not (ERCOT). In Japan the rights are a larger share of a smaller, dearer asset.

## 4 · How much it moves a return

This is stylised arithmetic, not model output, and can be reproduced from the description. Day-one capex is 100, with level cash flows over 20 years that give the base IRR.

**A lump site value at year 20** adds:

| Base IRR | Site value 10% of capex | 20% | 40% |
|---|---|---|---|
| 6% | +0.37 pts | +0.70 | +1.30 |
| 8% | +0.28 | +0.54 | +1.01 |
| 10% | +0.21 | +0.41 | +0.79 |
| 12% | +0.16 | +0.32 | +0.61 |

A year-20 amount is worth 0.215 of its face value today at 8%, and 0.149 at 10%. The ready-to-build premium is paid on day one at full value, and anything recovered at year 20 comes back at a fifth or less. **The premium is mainly a payment for earlier, lower-risk cash flows, not something an end value gives back.** A site value narrows the inconsistency the analyst identified. It does not reverse it.

**Repowering on the same connection** for years 21–30 instead, reinvesting R% of day-one capex at year 20 to earn S% of the first-life cash flow:

| Base IRR | R 40%, S 60% | R 50%, S 60% | R 40%, S 80% |
|---|---|---|---|
| 8% | +0.03 pts | −0.25 | +0.38 |
| 10% | +0.07 | −0.14 | +0.35 |
| 12% | +0.09 | −0.07 | +0.31 |

Repowering is worth something only if the second-life spread is close to the first life's. So a lump site value taken from today's observed prices is the steadier input. It is also the one a buyer at year 20 would actually pay: the price of a brownfield ready-to-build site.

For a GB-style illustration, take a right worth £84k/MW today, indexed at 2.5% for about 21.5 years to roughly £143k/MW. Credit 50–75% of that for the chance that lease, consent and connection all survive, and it is about 12–18% of a ~£600k/MW day-one cost. From the table, that adds roughly 0.25–0.5 points at 8–10%. Romania, Poland, Ireland, Finland and the other Thin markets would get no credit until a price is found.

## 5 · Options for the model (decision needed)

| Option | What changes | For | Against |
|---|---|---|---|
| **A · Site value at end of life** (recommended) | At the last operating year, both hold and sale routes receive: observed rights price per MW × indexation × survival haircut, minus battery removal net of recycling. Whether it replaces today's flat retirement charge is decision D3 in the sign-off plan. Thin markets keep zero. | Uses an observed market price, the same kind of number as the entry price, and needs no revenue forecast past year 20. Consistent across hold and sale. | One new per-market input and one haircut. The haircut is a house judgement. |
| **B · Second life on the same connection** | Add a repowering capex at year 20 at forecast battery cost, and run years 21–30 on extended revenue. Terminal value = max(0, NPV of the second life). | Closest to how the listed funds model it. | Rests on revenue forecasts 20–30 years out. The result swings either side of zero (§4). |
| **C · Sensitivity line only** | Keep the headline. Show "with site value" beside it, computed as in A. | No published number moves, and no multi-market plan is needed to show it. | Leaves the headline inconsistent with the ready-to-build price it reports. |

**Recommendation:** start with **C using A's arithmetic**. Then, once the per-market values below are signed, move A into the headline. Keep the 20-year life. The life question (25–30 years as the funds use) is separate and larger, and it overlaps with the augmentation ruling of 12 October 2026 (warranty extension and service agreement, no augmentation cost). Settle it on its own.

**Values the analyst would need to sign**, in a separate plan:

1. The rights price per market and its date. Proposed starting points from §3: GB ~£84k/MW, Italy €37.5k/MW, Spain €71.5k/MW, ERCOT ~$50k/MW (midpoint of $29–74k). Germany, Japan and CAISO stay Thin until there is a transaction source. Everything else is zero.
2. The survival factor, proposed as crediting 50% of the indexed price. It covers lease expiry, a consent that runs out, connection rule changes, and replacing the transformer and substation equipment.
3. How removal is charged. Superseded by the sign-off plan (`docs/site-value-plan-2026-11-27.md`, D3), which recommends keeping the existing 2–5% retirement allowance beside the credit.
4. Whether the five-year sale buyer receives the same site value. Recommended yes, discounted at the buyer's rate.
5. Indexation at the existing 2.5% convention.

## 6 · Sources

Fund practice and transactions
- Gresham House Energy Storage Fund, [Annual Report 2024](http://greshamhouse.com/wp-content/uploads/2026/09/GRID-Annual-Report-31-December-2024.pdf): discount rates (financial review), EV per MW (p. 36), augmentation case study, 25-year horizon, valuation notes.
- Gore Street Energy Storage Fund, [Strategy and Capital Allocation Plan, 30 July 2025](https://www.lse.co.uk/rns/strategy-and-capital-allocation-plan-56rlzoqduhfxjip.html) (grid rights c.8% of NAV), via [Hargreaves Lansdown summary](https://www.hl.co.uk/shares/stock-market-news/company--news/gore-street-energy-storage-unveils-capital-allocation-strategy); [FY2026 results coverage](https://www.solarpowerportal.co.uk/battery-storage/gore-street-energy-storage-fund-posts-27-nav-decline-amid-uk-bess-revenue-squeeze).
- Forvis Mazars, [HEIT valuation report, 6 May 2025](https://www.foresight.group/media/qwjktal2/heit-valuation-report-provided-by-forvis-mazars-6-may-2025.pdf).
- Modo Energy, [HEIT possible cash offer, 18 March 2025](https://modoenergy.com/research/listed-battery-funds-harmony-heit-possible-cash-offer-march-2025); [GB acquisitions deep dive, 2023](https://modoenergy.com/research/battery-energy-storage-acquisitions-deep-dive); [model assumptions, January 2026](https://docs.modoenergy.com/pages/jan-2026/uk-europe/model-assumptions).
- Greencoat UK Wind and ORIT life sensitivities: [Hargreaves Lansdown](https://www.hl.co.uk/news/renewable-infrastructure-income-opportunity-or-value-trap); [ORIT commentary](https://davidturver.substack.com/p/alas-poor-orit) (critical third-party view).
- Brookfield Renewable Partners, [2022 annual report (Form 6-K)](https://www.sec.gov/Archives/edgar/data/1533232/000153323223000008/bep2022annualreport.htm).
- IRS Rev. Proc. 2001-28 residual test: [Tax Notes](https://taxnotes.com/irs-revenue-procedures/accounting-periods-and-methods/irs-outlines-information-required-advance-rulings-leveraged-lease-transactions/2001/05/07/dpgg), [Smith Gambrell & Russell summary](https://www.sgrlaw.com/?p=951).
- IREN, [Form 10-Q](https://www.sec.gov/Archives/edgar/data/0001878848/000187884826000026/iren-20260331.htm) (connection rights as intangibles).

Connection rules and prices
- GB: [ESS News on queue clean-up](https://www.ess-news.com/2025/12/09/great-britain-axes-153-gw-of-zombie-projects-to-clear-the-queue-for-shovel-ready-bess/); CMP470 summary at [bess.farm](https://www.bess.farm/policy-and-future/ofgem-cmp470-new-financial-rules-for-the-uk-battery-queue.html) (secondary; confirm with Ofgem).
- Germany: [STW on BKZ 2026](https://stw-group.de/2026/08/28/baukostenzuschuss-batteriespeicher/), [BESS-Kompass on the maturity procedure](https://bess-kompass.de/reifegradverfahren-netzanschluss-batteriespeicher/), [OMSI rights marketplace](https://omsi24.com/marktplatz/projektrechte) (asking prices), [aurivolt](https://www.industriebox.de/2026/09/03/aurivolt-kauft-projektrechte-fr-batteriespeicher-zwischen-einem-und-zehn-megawatt/).
- Italy: [ESS News / nTeaser, April 2026](https://www.ess-news.com/2026/04/14/italian-ready-to-build-bess-market-prices-slide-amid-regulatory-uncertainty-macse-misfire/); [Enerdatics](https://www.enerdatics.com/insights/why-italys-latest-battery-deal-is-counted-in-grid-connections-not-megawatt-hours).
- Spain: [ION Analytics / nTeaser](https://ionanalytics.com/insights/uncategory/spanish-solar-project-prices-plummet-as-bess-values-soar-2/); [Energy-Storage.News](https://www.energy-storage.news/how-a-spanish-battery-makes-money-today-and-what-lenders-will-finance-tomorrow/).
- Poland: [ESS News, Greenvolt sale](https://www.ess-news.com/2026/10/26/greenvolt-sells-off-two-800-mwh-polish-battery-projects-for-438-million/); [Szumski Consulting](https://www.szumskiconsulting.com/blog/battery-grid-connection-poland.html) (secondary).
- Romania: [ESS News on permits](https://www.ess-news.com/2026/06/05/romania-grants-grid-permits-for-546-mw-of-solar-and-battery-storage/).
- Ireland: [ESS News](https://www.ess-news.com/2026/08/21/global-clean-investor-snaps-up-680-mwh-of-ready-to-build-irish-bess/). Finland: [Energy Global, Luxcara](https://www.energyglobal.com/energy-storage/27022026/luxcara-acquires-construction-ready-battery-storage-project-in-finland).
- Japan: [Scix knowledge pages](https://www.scix.co.jp/en/knowledge) (single advisory source); [Nuvve sale](https://secure.businesswire.com/news/home/20260309871339/en/NUVVE-JAPAN-Finalizes-First-Sale-Agreement-for-2MW-8MWh-Battery-Storage-Project-in-Mino-Gifu-for-%243.35-million-%C2%A5520-Million).
- ERCOT and CAISO prices: [Enerdatics](https://www.enerdatics.com/insights/why-two-projects-carry-the-economics-of-a-2-3-gw-battery-deal); [Energy-Storage.News, Solvent](https://www.energy-storage.news/developer-solvent-to-sell-tranche-of-2-5gw-ercot-bess-portfolio/).
- CAISO: [Final proposal, retention of interconnection service and deliverability, 23 June 2026](https://stakeholdercenter.caiso.com/InitiativeDocuments/Final-Proposal-Retention-of-Interconnection-Service-and-Deliverability-for-Retirements-Final-Proposal-Jun-23-26.pdf).
- PJM: [Inside Lines on replacement generation](https://insidelines.pjm.com/ferc-approves-streamlined-process-to-replace-retiring-facilities/); [FERC order ER26-403](https://www.pjm.com/pjmfiles/directory/etariff/FercOrders/8585/20260129-er26-403-001.pdf); [Modo on Transition Cycle 1 costs](https://modoenergy.com/research/en/pjm-transition-cycle-1-battery-storage-bess-buildout-interconnection-costs-arbitrage-revenue-developers).
- US other: [XPLR Q4 2025 release](https://www.sec.gov/Archives/edgar/data/1603145/000160314526000004/xplrq42025exhibit99.htm) and [Q2 2026 10-Q](https://www.sec.gov/Archives/edgar/data/0001603145/000160314526000032/xplr-20260630.htm) (read through search excerpts; the SEC pages could not be fetched directly).
- NEM: [EnergyCo, access rights in two REZs](https://www.energyco.nsw.gov.au/news/access-rights-two-renewable-energy-zones-give-certainty-investors-and-communities); [Central-West Orana access scheme](https://www.energyco.nsw.gov.au/central-west-orana-access-scheme).

**Source caveats.** The GRID figures come from our own text extraction of the annual-report PDF. The Gore Street 8% figure is from the RNS as summarised by two outlets; the full RNS page refused automated reading. nTeaser, Enerdatics and Scix are private trackers quoted in the press, so recompute any of these from a primary source before publishing it on the site as observed.
