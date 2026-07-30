# Official Public Data Source Registry

Research date: 2026-07-29  
Markets: Western Australia WEM, Great Britain, Ireland, Romania, Poland, Japan — Tokyo, Kyushu, and Hokkaido

## Purpose and interpretation

This registry records official public sources that can support the dashboard’s recurring evidence, system planning, competition, market, and forecast modules. URLs were checked during this audit. Where an exact dataset or complete coverage was not verified, the row is explicitly marked **Verification Required**, **Partial**, or **Not verified**.

The `Confidence` column below means confidence in the source’s public availability and suitability for the proposed metric. It is not the confidence of a forecast derived from that source.

### Acquisition classes

- **A — Easy to automate:** stable API, CSV, JSON, XML, or straightforward structured download.
- **B — Automatable with transformation:** complex Excel/ZIP, stable HTML table, or consistent structured document.
- **C — Manual periodic update:** planning report, decision, auction PDF, policy document, or changing download link.
- **D — Not practical/core gap:** complete required data not publicly verified, fragmented/inconsistent, or proprietary.

### Proposed source registry record

The implementation should use one source record and separate metric records that reference it:

```text
source_id
source_agency
source_name
source_url
source_type
geography
historical_start
forecast_end
frequency
format
machine_readable
automated_download
registration_required
scraping_required
historical_versions_retained
acquisition_class
licence_or_terms
last_verified
notes
```

Each metric should contain:

```text
metric_id
market
metric_name
source_id
source_vintage
source_locator
authority
unit
frequency
historical_start
forecast_end
last_updated
ingestion_method
transformation_required
transformation_version
confidence_id
notes
```

`source_locator` should identify the workbook tab/cell range, API parameter set, CSV column, HTML table, or PDF page/table. This is necessary for chart-level traceability.

## Cross-market sources

| Market | Category | Metric | Official Organisation | Dataset | URL | Historical | Forecast | Frequency | Format | Machine Readable | Access / Archive | Automation | Proposed Use | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Global | FX | EUR reference FX rates | European Central Bank | Euro foreign exchange reference rates — daily XML | https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml | Latest daily file; separate ECB archives are available | No | Business daily | XML | Yes | Open; no registration; existing connector verified | A | Normalize native-currency observations; retain approved underwriting FX separately | High |
| GB / Ireland / Romania / Poland | Wholesale/system | Day-ahead prices and selected system data | ENTSO-E | Transparency Platform | https://transparency.entsoe.eu/ | Multi-year, subject to bidding-zone and data availability | No | Intraday/daily | API XML; portal downloads | Yes | API security token/registration required; historical access retained | B | Standardized price history and cross-check; existing connector | High for access; market coverage must be tested |

## Western Australia WEM

| Market | Category | Metric | Official Organisation | Dataset | URL | Historical | Forecast | Frequency | Format | Machine Readable | Access / Archive | Automation | Proposed Use | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WA WEM | System planning | Demand, peak, EV/industrial load, generation, adequacy, reserve capacity requirement | Australian Energy Market Operator | WEM Electricity Statement of Opportunities | https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning/wem-electricity-statement-of-opportunities-wem-esoo | Annual reports and prior editions retained | Ten-year horizon; current editions reach the mid-2030s | Annual | PDF plus forecasting workbooks/portal | Partial | Open; workbook links can change; archives retained | B for workbooks; C for narrative | Today/2030/2035 system view, adequacy and RCM drivers, backtesting | High |
| WA WEM | Wholesale | Trading prices and WEM market records | AEMO | WA Market Data Site | https://data.wa.aemo.com.au/ | Multi-year public market history | No | Market interval / daily | JSON endpoints and downloadable data | Yes | Open; no registration for current connector | A | Energy price/spread history, live evidence, negative-price and volatility metrics | High |
| WA WEM | Capacity | Benchmark Reserve Capacity Price | Economic Regulation Authority of WA | Benchmark Reserve Capacity Prices | https://www.erawa.com.au/markets/wholesale-electricity-market/price-setting/benchmark-reserve-capacity-prices | Annual decisions and prior versions | One pricing year/decision at a time; model inputs may include forward cost assumptions | Annual | PDF and supporting documents | Partial | Open; historical decisions retained | C | BRCP history, assumptions, forecast anchor and backtest | High |
| WA WEM | Capacity | Reserve Capacity Price / historical outcomes | AEMO | Reserve Capacity Price | https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-price | Historical prices via Market Data Site | Near-term auction/cycle outcomes, not a long-range forecast | Annual/cycle | Web page plus market data | Partial | Open; linked resources | B | BRCP-to-RCP bridge and realized capacity-revenue backtest | High |
| WA WEM | Competition | Expressions of Interest and Reserve Capacity EOI | AEMO | Expressions of Interest | https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/expressions-of-interest | Annual publications retained | Proposed capacity and timing in each cycle | Annual/cycle | PDF / reports | Limited | Open; document links; project/technology detail varies | C | Aggregate credible supply interest; do not imply complete project maturity | Medium-high |
| WA WEM | Capacity / delivery | RCM cycle dates and milestones | AEMO | Reserve Capacity Timetable | https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-timetable | Current and some historical cycle documents | Future cycle milestones | Annual/cycle | Web/PDF | No/partial | Open | C | Capacity revenue timing and project-delivery overlay | High |
| WA WEM | Market performance | Price, demand, generation, storage and market-event workbooks | AEMO | Quarterly Energy Dynamics | https://www.aemo.com.au/energy-systems/major-publications/quarterly-energy-dynamics-qed | Quarterly archive from 2018 with workbooks | Commentary only; no long-run official forecast | Quarterly | PDF and Excel | Yes for workbook | Open; editions retained | B | Historical revenue/volatility evidence and backtesting | High |
| WA WEM | Policy/rules | Market rules, reserve standard, certification and de-rating | Government of Western Australia | Electricity System and Market Rules | https://www.wa.gov.au/government/document-collections/electricity-system-and-market-rules | Current rules | Effective/future rule dates | As amended | PDF/DOCX | Partial | Open | C | Policy-to-cash-flow mapping and model validation | High |
| WA WEM | Policy history | Historical rule vintages | Government of Western Australia | Historical versions of the ESM Rules | https://www.wa.gov.au/government/document-collections/historical-versions-of-the-esm-rules | Archived vintages | No | As amended | PDF/DOCX | Partial | Open; archive retained | C | Rule backtesting and historical de-rating/revenue interpretation | High |
| WA WEM | Project support | Capacity Investment Scheme awards | Australian Department of Climate Change, Energy, the Environment and Water | Capacity Investment Scheme | https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme | Award rounds and announcements | Award COD/contract horizons where disclosed | Per round | Web/PDF | Limited | Open | C | Contracted project evidence; Tier 1 award validation | High |
| WA WEM | Grid | Transmission plan, projects and milestones | Western Power | Future of the Grid landing page / Transmission System Plan candidate | https://www.westernpower.com.au/resources-education/our-network-the-grid/future-of-the-grid/ | Partial public plans | Planning horizon varies | Irregular/annual | Web/PDF | Limited | Exact stable Transmission System Plan dataset link not verified in this audit | C pending verification | Regional grid-value profile and reinforcement milestones | Medium / Verification Required |
| WA WEM | Competition | Complete project-level BESS connection queue with stage and COD | Western Power / AEMO | No complete official public register verified | Verification Required | Not verified | Not verified | — | — | No | Public coverage appears incomplete | D | Do not make a granular project funnel dependent on this source | Low |

## Great Britain

| Market | Category | Metric | Official Organisation | Dataset | URL | Historical | Forecast | Frequency | Format | Machine Readable | Access / Archive | Automation | Proposed Use | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| GB | Capacity / competition | Capacity Market Units, components, auction history, capacity, cost, de-rating and status | National Energy System Operator | Capacity Market Register | https://www.neso.energy/data-portal/capacity-market-register | Register/history resources; current catalogue contains multiple CSVs | Delivery years and awarded obligations | Weekly | CSV via Data Portal / catalogue API | Yes | Open under NESO Open Data Licence; no registration observed; history resources retained | A | Replace PDF/manual CM assumptions; award and competition funnel | High |
| GB | Grid / competition | Transmission Entry Capacity projects, site, status, Gate, MW | National Energy System Operator | TEC Register | https://www.neso.energy/data-portal/transmission-entry-capacity-tec-register/tec_register | Current and prior resource versions via portal | Connection dates and project status | Twice weekly | CSV / Data Portal API | Yes | Open; duplicates and aggregated rows require documented handling | A/B | Connection pipeline, location, COD, delivery risk; deduplicate with REPD | High |
| GB | System planning | Demand, generation, storage and flexibility scenarios | National Energy System Operator | Future Energy Scenarios documents and data | https://www.neso.energy/publications/future-energy-scenarios-fes/fes-documents | Annual archive and workbooks | Long-term; includes 2030/2035 | Annual | Excel/PDF | Yes for workbooks | Open; archives retained | B | Today/2030/2035 system view and scenario anchors | High |
| GB | System planning | Electricity supply, capacity, generation, demand and storage scenario table | National Energy System Operator | FES Electricity Supply Data Table ES1 | https://www.neso.energy/data-portal/future-energy-scenario-electricity-supply-data-table-es1/electricity_supply_data_table_es1_2025 | Data Portal versions | Long-term through 2035 and beyond by scenario | Annual | Structured Data Portal resource | Yes | Open | A | Direct FES series ingestion and forecast provenance | High |
| GB | Grid | Transmission boundary capability, needs, projects and constraints | National Energy System Operator | Electricity Ten Year Statement | https://www.neso.energy/publications/electricity-ten-year-statement-etys | Annual documents/workbooks | Ten-year | Annual | PDF and Excel | Partial/yes | Open; archives/documents retained | B/C | Grid-value boundaries and reinforcement timing | High |
| GB | Grid | Network expansion to 2030 and beyond | National Energy System Operator | Beyond 2030 | https://www.neso.energy/publications/beyond-2030 | Current report and workbook | 2030s | Periodic | PDF and data workbook | Partial/yes | Open | B/C | Reinforcement scenario and connection-value interpretation | High |
| GB | Wholesale / balancing | Imbalance, price, demand, generation, balancing, bids/offers, system actions | Elexon | BMRS API | https://bmrs.elexon.co.uk/api-documentation/introduction | Multi-year endpoint-dependent | No | Near-real-time / settlement | REST JSON/CSV | Yes | Open API; repository notes prior 403/environment issues, so production connectivity must be retested | A if reachable; B until retested | Merchant/BM/ancillary historical evidence and backtesting | High for source; Medium for current runtime access |
| GB | Policy / system | 2030 clean-power capacity and flexibility pathway | UK Department for Energy Security and Net Zero | Clean Power 2030 Action Plan | https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report | Current publication | 2030 | Policy updates | HTML/PDF | Limited | Open; publication retained | C | Official system target and policy-to-cash-flow drivers | High |
| GB | Competition | Renewable and storage project status, capacity and location | UK Department for Energy Security and Net Zero | Renewable Energy Planning Database | https://ckan.publishing.service.gov.uk/dataset/repd | Historical quarterly extracts | Expected operational dates where supplied | Quarterly | CSV/Excel via data.gov.uk | Yes | Open; versions/resources retained | B | Planning-stage pipeline, status, owner/location; deduplicate with TEC | High |
| GB | Contract / policy | LDES cap-and-floor model inputs and mechanics | Office of Gas and Electricity Markets | LDES Cap and Floor Financial Model and Handbook | https://www.ofgem.gov.uk/guidance/long-duration-electricity-storage-ldes-cap-and-floor-financial-model-and-handbook | Current and future decision versions | Contract/model horizon | Per decision/window | XLSM and PDF | Partial | Open; macro-enabled workbook requires controlled parsing | B/C | Contractability, floor/cap cash-flow and bankability analysis | High |
| GB | Market reform | Flexibility policy actions and timing | UK Government / DESNZ | Clean Flexibility Roadmap | https://www.gov.uk/government/publications/clean-flexibility-roadmap/clean-flexibility-roadmap | Current publication | Policy milestones | Periodic | HTML/PDF | Limited | Open | C | Policy-to-market-rule and revenue direction | High |

## Ireland

| Market | Category | Metric | Official Organisation | Dataset | URL | Historical | Forecast | Frequency | Format | Machine Readable | Access / Archive | Automation | Proposed Use | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Ireland | System planning | Demand, generation, adequacy, capacity need | EirGrid and SONI | Generation Capacity Statement 2023-2032 | https://cms.eirgrid.ie/generation-capacity-statement-2023-2032 | Annual reports; older editions available | To 2032 in this edition | Annual | PDF | Limited | Open | C | Historical vintage and adequacy backtest | High |
| Ireland | System planning | Structured inputs to GCS | EirGrid and SONI | GCS 2023-2032 Data Workbook | https://cms.eirgrid.ie/generation-capacity-statement-2023-2032-data-workbook | Edition-specific | To 2032 | Annual | Excel | Yes | Open; stable edition page | B | Demand/capacity/adequacy ingestion | High |
| Ireland | System planning | All-island adequacy forecast | EirGrid and SONI | All-Island Resource Adequacy Assessment 2025-2034 | https://cms.eirgrid.ie/sites/default/files/publications/AIRAA-2025-2034.pdf | Current report; prior GCS/AIRAA vintages separately | To 2034 | Annual | PDF | Limited | Open direct PDF; exact landing-page/structured workbook coverage should be verified | C | Near-2035 adequacy anchor; display 2034, not a fabricated 2035 point | Medium-high |
| Ireland | Grid | Transmission capacity, constraints and development | EirGrid and SONI | All-Island Ten-Year Transmission Forecast Statement 2024 | https://cms.eirgrid.ie/sites/default/files/publications/All-Island-Ten-Year-Transmission-Forecast-Statement-2024_1.pdf | Annual statements | Ten-year | Annual | PDF | Limited | Open; edition archives must be indexed | C | Grid-value regions, transmission constraints and reinforcement | High |
| Ireland | Grid / policy | 2030 grid transformation and renewable integration | EirGrid | Shaping Our Electricity Future Roadmap | https://cms.eirgrid.ie/shaping-our-electricity-future-roadmap | Roadmap versions | 2030 | Periodic | Web/PDF | Limited | Open | C | System/grid milestones, policy-to-revenue implications | High |
| Ireland | Grid delivery | Project status and milestones | EirGrid | Network Delivery Portfolio / Transmission Infrastructure Delivery reports | https://www.eirgrid.ie/grid/grid-reports-and-planning/network-delivery-portfolio | Report history and current replacement reports | Future project milestones | Quarterly/periodic | PDF/web | Limited | Open; report naming changed, so connector needs a manifest | C/B | Transmission delivery backtest and project-delivery overlay | High |
| Ireland | Grid / competition | Forecast constraints for ECP applicants, assumptions and zones | EirGrid | ECP Constraint Forecast Reports | https://www.eirgrid.ie/industry/customer-information/ecp-constraint-forecast-reports | Prior reports | Applicant/connection horizon | Periodic | PDF and Excel examples/data | Partial/yes | Open | B/C | Regional grid-value and connection-risk evidence | High |
| Ireland | Curtailment | Annual/monthly constraint and curtailment | EirGrid and SONI | Constraint and Curtailment publications | https://cms.eirgrid.ie/taxonomy/term/27 | Multi-year archive | No | Monthly/annual | PDF and selected datasets | Partial | Open; archives retained | B/C | Historical physical-imbalance and revenue-driver evidence | High |
| Ireland | Market / capacity | SEM prices, imbalance, CRM qualification/results and market publications | Single Electricity Market Operator | General Publications | https://www.sem-o.com/publications/general-publications | Multi-year publications | Auction/delivery years where applicable | Daily/monthly/auction | ZIP, XLSX, CSV, PDF | Partial/yes | Open; resource structure varies | B/C | Market/CRM evidence and contracted-revenue validation | High |
| Ireland | Grid risk | Near-term system margin | EirGrid | System Margins Outlook Reports | https://www.eirgrid.ie/grid/system-margins-outlook-reports | Report archive | Weeks/months | Twice weekly | PDF | No | Open; high frequency but manual format | C | Short-term adequacy monitor, not core long-run forecast | High |
| Ireland | Policy / connection | Connection policy and Generation and System Services policy | Commission for Regulation of Utilities | Network Connections | https://www.cru.ie/regulations-policy/energy/network-connections/ | Decision archive | Effective/future milestones | Per decision | Web/PDF | Limited | Open | C | Policy-to-development-risk and revenue mapping | High |
| Ireland | Demand | Data-centre metered electricity consumption | Central Statistics Office Ireland | Data Centres Metered Electricity Consumption 2025 | https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/ | 2015-2025 in current release | No | Annual | HTML, PxStat, Excel | Yes | Open; PxStat API/download | A/B | Historical load driver and demand-forecast calibration | High |
| Ireland | Competition | Complete official BESS project funnel through financing/construction | EirGrid / CRU / planning authorities | No single complete register verified | Verification Required | Partial across connection/planning sources | Partial COD claims | — | Mixed | No | Requires multi-source entity resolution; financing is rarely official/public | D as a single source; B/C as composite | Build a coverage-labelled composite, never claim completeness | Low for completeness |

## Romania

| Market | Category | Metric | Official Organisation | Dataset | URL | Historical | Forecast | Frequency | Format | Machine Readable | Access / Archive | Automation | Proposed Use | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Romania | System/grid planning | Demand, generation, renewables, retirement, adequacy, transmission and storage-related grid needs | Transelectrica | Romanian Power Grid Development Plan 2026-2035 | https://www.transelectrica.ro/documents/10179/20107575/01_Nota%2BPD%2BRET%2B2026-2035%2Binclusiv%2Banexe_EN.pdf/2ff26066-2f3a-4401-91d6-863abec723ed?version=1.0 | Prior plans exist on Transelectrica site | To 2035 | Biennial/periodic | PDF with annexes | Limited | Open; direct official file verified; stable parent-page discovery should be added to ETL manifest | C | Today/2030/2035 system view, grid projects, backtesting | High |
| Romania | Grid / competition | Connection-capacity auction zones, applications, requested MW and COD | Transelectrica | Electricity Network Capacity Allocation Process | https://www.transelectrica.ro/procesul-de-alocare-a-capacitatii-retelei-electrice | Current process and centralizers | Application COD and auction milestones | Per allocation cycle | Web, PDF/Excel attachments | Partial/yes | Open; Romanian-language transformations | B/C | Zonal competition, connection maturity and delivery schedule | High |
| Romania | Grid | Indicative grid connection information | Transelectrica | Indicative Connection Map | https://web.transelectrica.ro/harti_crd_tel/index.html | Current view; archive not confirmed | Planned/available connection indications | Irregular | Interactive web map | Partial | Open; extraction/terms and historical retention require verification | B/C | Lightweight grid-value layer; snapshot source metadata | Medium / transformation verification required |
| Romania | System operations | Generation, demand, exchanges and market operation | Transelectrica | Daily Reports | https://www.transelectrica.ro/en/rapoarte-zilnice | Public archive, including 15-minute Excel after platform changes | No | Daily | Excel | Yes | Open; file naming/layout may vary by period | B | System balance, renewable penetration and historical backtest | High |
| Romania | Balancing | Balancing market volumes/prices and reports | Transelectrica | Balancing Market / monthly reports | https://www.transelectrica.ro/en/piata-echilibrare | Monthly/periodic archive | No | Monthly | Excel/PDF | Partial | Open | B/C | Balancing revenue pool and volatility evidence | High |
| Romania | Wholesale | Day-ahead, intraday and other market results | OPCOM | Transactions and Results | https://opcom.ro/tranzactii-rezultate-home/en/303 | Multi-year reports/results | No | Daily/monthly/annual | HTML, Excel/PDF/ZIP depending product | Partial/yes | Open; stable endpoint discovery needed per product | B | Wholesale price/spread, volume and market-size evidence | High |
| Romania | Wholesale history | Annual market statistics and rule commentary | OPCOM | 2024 Annual Report | https://www.opcom.ro/uploads/doc/rapoarte/Anual/RS_2024_EN.pdf | Annual editions | No | Annual | PDF | Limited | Open; prior versions available by edition | C | Historical market context and validation | High |
| Romania | Authorization / competition | Storage authorizations and regulatory decisions | Romanian Energy Regulatory Authority | Storage authorization communications/decisions | https://anre.ro/comunicat-de-presa-850-de-megawati-infiintati-intr-o-singura-sedinta-a-comitetului-de-reglementare-al-anre/ | Individual decisions/communications | Project intent/timing where disclosed | Irregular | HTML/PDF | Limited | Open but not a comprehensive storage register | C | Tier 1 project evidence only; not total pipeline | Medium |
| Romania | Competition | Complete project-level BESS funnel, financing and construction | Transelectrica / ANRE / planning authorities | No single complete register verified | Verification Required | Partial | Partial COD | — | Mixed | No | Multi-source entity resolution required; private stages unavailable | D as a single source | Coverage-labelled composite only | Low for completeness |

## Poland

| Market | Category | Metric | Official Organisation | Dataset | URL | Historical | Forecast | Frequency | Format | Machine Readable | Access / Archive | Automation | Proposed Use | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Poland | System/policy | Demand, generation, renewables, thermal transition and policy scenarios | Ministry of Energy, Poland | National Energy and Climate Plan to 2030 with outlook to 2040, adopted 8 June 2026 | https://www.gov.pl/web/energia/krajowy-plan-w-dziedzinie-energii-i-klimatu-do-2030-r-z-perspektywa-do-2040-r---przyjety-przez-rade-ministrow | Earlier plans/drafts retained on government pages | 2030/2040; WAM and WEM scenario attachments | Periodic | PDF plus methodology/scenario annexes | Limited | Open; official publication and attachments retained | C | Official 2030/2035-context system scenarios and policy drivers | High |
| Poland | System/grid planning | Demand, generation mix, adequacy to 2040, spatial balance, network projects and storage connections | Polskie Sieci Elektroenergetyczne | Transmission Network Development Plan 2025-2034 | https://www.pse.pl/documents/31287/22159050/Development_plan_2025_2034_main_document_20_12_2024.pdf/6397676d-d217-4bcb-b04c-f3fafc2dde12?safeargs=76657273696f6e3d312e31 | Prior development plans exist | Network to 2034; adequacy analysis to 2040 | Periodic | PDF | Limited | Open official English PDF; historical plans require index | C | Today/2030/2034 system and spatial grid-value view; use 2034 label | High |
| Poland | Market operations | Price, imbalance, system demand/generation and operational reports | Polskie Sieci Elektroenergetyczne | Market Data / Raporty OSP | https://raporty-st.pse.pl/ | Multi-year endpoint-dependent | No | Near-real-time/daily | API/web data | Yes | Open; site states an API is available; exact endpoint/schema must be captured during connector implementation | A/B | Operational price/system evidence and backtesting | High for availability; endpoint mapping pending |
| Poland | Capacity | Preliminary capacity-auction results and process | Polskie Sieci Elektroenergetyczne | Capacity Market News and auction result pages | https://www.pse.pl/web/pse-eng/areas-of-activity/capacity-market/capacity-market-news | Delivery-year auction pages and prior results | Delivery years including 2030 | Per auction | HTML/PDF | Limited | Open; results spread across year-specific pages | C | Procurement, price, contract term and project evidence | High |
| Poland | Capacity | Final auction obligations and clearing result | Energy Regulatory Office | Final results — main auction for delivery year 2030 | https://www.ure.gov.pl/pl/urzad/informacje-ogolne/aktualnosci/13031%2CPrezes-URE-oglasza-ostateczne-wyniki-aukcji-glownej-rynku-mocy-na-dostawy-w-2030.html | Prior final-result releases | Delivery year 2030 in this edition | Per auction | HTML/PDF | Limited | Open; each auction requires a manifest entry | C | Authoritative contracted-revenue validation | High |
| Poland | Competition/grid | Named storage connection projects, locations, milestones and spatial system balance | Polskie Sieci Elektroenergetyczne | Development Plan 2025-2034 project tables/maps | https://www.pse.pl/documents/31287/22159050/Development_plan_2025_2034_main_document_20_12_2024.pdf/6397676d-d217-4bcb-b04c-f3fafc2dde12?safeargs=76657273696f6e3d312e31 | Edition snapshots | To 2034 | Periodic | PDF | Limited | Open; table extraction and project entity resolution required | B/C | Partial storage funnel and grid-value map | Medium-high |
| Poland | Competition | Complete official grid-scale BESS connection/permit/finance funnel | PSE / DSOs / URE | No single complete official register verified | Verification Required | Partial | Partial | — | Mixed | No | TSO plan and auction sources cover only parts of the funnel | D as a single source | Show coverage and avoid a precise total credible pipeline | Low for completeness |

## Japan — national and regional

| Market | Category | Metric | Official Organisation | Dataset | URL | Historical | Forecast | Frequency | Format | Machine Readable | Access / Archive | Automation | Proposed Use | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Japan | System planning | Regional demand, peak, capacity, adequacy, generation and network development | Organization for Cross-regional Coordination of Transmission Operators, Japan | Aggregation of Electricity Supply Plans FY2025 | https://www.occto.or.jp/en/assets/information_disclosure/supply_plan/files/2025_Aggregation_of_Electricity_Supply_Plan.pdf | Annual editions from FY2015 listed by OCCTO | FY2025-2034 | Annual | PDF with structured tables/appendices | Partial | Open; English annual archive retained | B/C | National and regional Today/2030/2034 system view; backtesting | High |
| Japan | System planning | Regional demand and supply/interconnector outlook | OCCTO | Outlook of Electricity Supply-Demand and Cross-regional Interconnection Lines | https://www.occto.or.jp/en/information_disclosure/outlook_of_electricity_supply-demand/ | Annual editions FY2015-FY2024 listed | Ten-year horizon by edition | Annual | PDF | Limited | Open; archive retained | C | Regional adequacy and interconnector drivers; vintage backtest | High |
| Japan | Demand | Ten-year national and regional demand methodology/forecast | OCCTO | Demand forecast across the country and of each supply area | https://www.occto.or.jp/en/works/no10.html | Annual methodology and underlying plan editions | Ten years | Annual | Web/PDF | Partial | Open | C/B | Tokyo/Kyushu/Hokkaido demand and data-center/industrial drivers | High |
| Japan | Policy/system | 2040 demand and generation policy outlook | Ministry of Economy, Trade and Industry / Agency for Natural Resources and Energy | Seventh Strategic Energy Plan and FY2040 outlook | https://www.enecho.meti.go.jp/en/category/others/basic_plan/ | Prior strategic plans retained | FY2040 | Periodic | PDF | Limited | Open; English materials published | C | 2040 context; do not convert to an unsupported 2035 point | High |
| Japan | Grid | National and cross-regional reinforcement, including Hokkaido-Honshu and Tokyo interfaces | OCCTO | Long-term Cross-regional Network Policy / Master Plan | https://www.occto.or.jp/en/works/no5.html | Policy and development-plan history | Long term / project-specific | Periodic | Web/PDF | Limited | Open | C | Interconnector and regional grid-value scenarios | High |
| Japan | Capacity | Main and incremental capacity auction clearing files and verification data | OCCTO | Capacity Market Auction Information and Results | https://www.occto.or.jp/capacity-market/yoryoshijyo/main/data/ | Delivery years FY2024-FY2029 listed; result ZIPs retained | Award delivery years | Per auction | ZIP, CSV/data files, PDF | Yes/partial | Open; Japanese; archive retained | B | Clearing, awarded MW, price and auction-renewal evidence | High |
| Japan | Balancing-market rules | Bid minimum, award order, offline Primary cap and performance assessment | Electric Power Reserve Exchange | Trading Rules v18 | https://www.eprx.or.jp/outline/docs/kitei_ver.18_260701.pdf | Versioned public rules retained | Effective 1 Jul 2026 | As amended | Versioned PDF | Limited | Open; Japanese; immutable version URL | C | Verify whether voltage, size or online status changes award priority | High |
| Japan | Balancing-market products | Command, monitoring, response and duration requirements by product | Electric Power Reserve Exchange | Product Requirements v6 | https://www.eprx.or.jp/outline/docs/shouhin_ver.6_20260313.pdf | Versioned public requirements retained | Current product matrix | As amended | Versioned PDF | Limited | Open; Japanese; immutable version URL | C | Product eligibility and control-system underwriting | High |
| Japan | Balancing-market participation | Battery voltage, connection, metering, aggregation and online/offline pathways | Electric Power Reserve Exchange | Battery and Pumped-Storage Participation Guide v3 | https://www.eprx.or.jp/outline/docs/yousuichikudenchi_guide_260314.pdf | Versioned public guides retained | Current participation pathways | As amended | Versioned PDF | Limited | Open; Japanese; immutable version URL | C | Separate technical access advantages from clearing priority | High |
| Japan | Balancing-market operations | Operating instructions and economic dispatch order | Electric Power Reserve Exchange | Economic Dispatch Explanation v3 | https://www.eprx.or.jp/outline/docs/chouseiryokuunyou_ver.3_20240401.pdf | Versioned public guide retained | Current dispatch method | As amended | Versioned PDF | Limited | Open; Japanese; immutable version URL | C | Validate upward/downward dispatch merit order | High |
| Japan | Balancing-market communications | Dedicated-line / simplified-command application process and capacity status | Electric Power Reserve Exchange | Communications-System Application | https://www.eprx.or.jp/outline/system_construction.html | Linked status files are periodically replaced | Current | As updated | HTML and linked files | Partial | Open; Japanese | B | Connection lead time, telemetry feasibility and recurring status checks | High |
| Japan | Capacity / competition | Capacity contracts and current status | OCCTO | Capacity Securing Contract Results and Status | https://www.occto.or.jp/various/capacity-market/jitsujukyukanren/yoryokakuhokeiyaku.html | Results/status archives from 2020 onward listed | Delivery years and long-term auction projects | Periodic | PDF and summary data file | Partial | Open; Japanese; historical editions retained | B/C | Validate current contracted projects, changes, and renewal/delivery risk | High |
| Japan | Capacity / competition | Long-term decarbonized capacity auction awards and awarded resources | OCCTO | FY2025 Long-term Decarbonized Power Source Auction Results | https://www.occto.or.jp/news/012080.html | Annual award rounds from FY2023 | Award-specific long-term delivery/contract | Annual | PDF and award list | Limited/partial | Open; Japanese | C | Storage award pipeline, contractability and case-study candidates | High |
| Tokyo / Kyushu / Hokkaido | Wholesale | Regional day-ahead prices and volumes | Japan Electric Power Exchange | Day-Ahead Market Data | https://www.jepx.jp/en/electricpower/market-data/spot/ | Downloadable daily/monthly/yearly history | No | Daily / market interval | CSV download / HTML | Yes | Open; existing connector verified for the three regions | A/B | Regional spread, basis, negative-price, volatility and merchant evidence | High |
| Tokyo | Curtailment/grid | Renewable output-control rules, forecasts and simulation data | TEPCO Power Grid | Output Control | https://www.tepco.co.jp/pg/consignment/access/outputcontrol.html | Prior forecast/simulation links listed | Short- and long-term curtailment outlook | Annual/periodic | PDF and simulation data downloads | Partial/yes | Open; Japanese; historical links present | B/C | Tokyo curtailment/grid constraint layer and forecast evidence | High |
| Kyushu | Curtailment | Annual renewable output-control forecast and methodology | Kyushu Electric Power Transmission and Distribution | Renewable Energy / Output Control | https://www.kyuden.co.jp/td/functions/faq/renewable-energy.html | Prior outlooks referenced | Annual/longer-run scenario documents | Annual | PDF | Limited | Open; Japanese | C | Kyushu curtailment forecast and scenario driver | High |
| Kyushu | Curtailment/system operations | Output-control instructions/results and demand/supply balance | Kyushu Electric Power Transmission and Distribution | Electricity Usage and Renewable Output Control Outlook | https://www.kyuden.co.jp/td_power_usages/pc.html | Current-year and linked prior result files | Days ahead; no long-run forecast | Daily/irregular files | HTML/PDF; some Excel | Partial | Open; Japanese; linked files change | B/C | Curtailment realization and system-balance backtest | High |
| Kyushu | Grid | Selected demand-side connection headroom / welcome-zone maps | Kyushu Electric Power Transmission and Distribution | Welcome Zone / capacity maps | https://www.kyuden.co.jp/td/application/firm-location/capacity-map/map-kitakyushu.html | Current snapshots; historical retention not confirmed | Current/indicative future headroom | Irregular | Interactive web/images/HTML tables | Limited | Open; explicitly demand-side and not a generator queue | C | Context only; do not treat as BESS generation-connection availability | Medium |
| Hokkaido | Curtailment | Renewable output-control outlook, results and simulation workbooks | Hokkaido Electric Power Network | Renewable Output Control — Supply/Demand Constraints | https://www.hepco.co.jp/network/renewable_energy/output_control/constraints/index.html | Simulation workbooks listed from 2018 onward | Annual short/long-term outlook | Annual plus event updates | PDF and Excel | Yes/partial | Open; Japanese; historical simulation files retained | B | Curtailment backtesting and regional merchant driver | High |
| Hokkaido | Balancing/system | Cross-regional and regional balancing-operation data | Hokkaido Electric Power Network | Status of Supply-Demand Adjustment Operations | https://www.hepco.co.jp/network/con_service/public_document/adjustment_work_status/index.html | Monthly CSV archive from at least FY2025 on current page | No | Monthly | CSV | Yes | Open; Japanese | A/B | Balancing need, operational evidence and revenue-pool context | High |
| Hokkaido | Curtailment operations | Day-ahead curtailment outlook and instruction history | Hokkaido Electric Power Network | Renewable Energy Output Control Forecast | https://denkiyoho.hepco.co.jp/renewable_energy_output_control_forecast.html | Current year with linked historical instructions | Days ahead | Daily/event | HTML, PDF, Excel | Partial | Open | B/C | Operational curtailment monitor and realized-event archive | High |
| Tokyo / Kyushu / Hokkaido | Competition | Complete grid-scale BESS application/connection queue with MW, MWh, status, COD and owner | OCCTO / regional T&D companies | No complete official public register verified | Verification Required | Partial disclosures only | Partial | — | Mixed | No | Auction awards and T&D materials cover subsets, not the complete queue | D as a single source | Show known official awards and explicit coverage gap; avoid precise pipeline ratios | Low for completeness |

## Confirmed public-data-supported upgrade coverage

### Fully supportable as core recurring modules

- Cross-market day-ahead price history and derived spread evidence.
- WA WEM official system planning, adequacy, capacity prices, rules, and market observations.
- GB system planning, CM awards/register, transmission connection register, planning-stage project database, and operational market data.
- Ireland demand/adequacy, transmission planning, constraints/curtailment, market publications, connection policy, and data-center history.
- Romania system/grid planning, connection-capacity allocation, daily system operation, and wholesale/balancing evidence.
- Poland system/energy policy, transmission planning, operational market data, and capacity-auction results.
- Japan regional demand/adequacy to FY2034, national 2040 policy context, capacity auctions/contracts, regional spot prices, interconnector plans, and curtailment evidence.
- Historical planning-vintage backtests where archives are retained.

### Supportable with manual/transform-heavy updates

- Transmission project milestones and historical delivery status.
- Capacity-market rule and auction interpretation.
- Zonal grid-value maps from official plans.
- Official BESS award and authorization case studies.
- Policy-to-cash-flow mapping.

### Important unresolved or partial gaps

1. **Complete project funnels:** no single public official source covers announced through financed/under-construction/operating stages in WA, Ireland, Romania, Poland, or Japan.
2. **Financing and exit transactions:** debt terms, equity returns, toll prices, and sale valuations are usually private; public corporate disclosures are optional Tier 2 enrichment.
3. **Japan 2035:** current OCCTO ten-year official material reaches FY2034 and METI provides FY2040. The dashboard must show those years or label an analyst interpolation.
4. **WA substation-level grid value:** a stable, granular, public connection-queue and transmission dataset was not verified.
5. **Poland full BESS queue:** PSE plans and auction results provide partial project evidence, not a complete live register.
6. **Romania/Poland project entity resolution:** names and stages must be reconciled across TSO, regulator, planning, auction, and corporate sources.
7. **Forward merchant revenue:** no official source provides bankable long-term BESS revenue/MW forecasts for all markets. These must remain analyst scenarios anchored to official physical drivers and observed market data.
8. **Capex, financing and exit liquidity:** recurring official data is limited; these require approved assumptions, public procurement data where available, and optional corporate/lender evidence.

## Ingestion and governance recommendation

1. Keep `src/governance/datasets.js` as the catalogue for automated feeds.
2. Add `src/governance/sourceRegistry.js` for all confirmed official sources, including manual reports.
3. Add `src/governance/metrics.js` so every displayed series/output has an authority, unit, vintage, and source relationship.
4. Store immutable raw/source-vintage metadata and checksums outside rendered market files.
5. Let machines update only observed, derived-observed, and official-forecast evidence.
6. Keep scenario selection, revenue realization, capex, finance, and investment conclusions human-approved or proposal-only.
7. Fail closed when a metric has no source, unit, authority, or transformation version.
