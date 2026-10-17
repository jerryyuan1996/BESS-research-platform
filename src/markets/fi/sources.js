/* ---------------------------------------------------------------------------
   Finland — source register.

   THE EVIDENCE PACK CAME FIRST, and the comparison interface is built from it
   rather than the other way round. That ordering is the reason `engineReady` is
   false: the sources below support the market's STRUCTURE completely, and its
   per-MW economics only partly, and the second half is what the $1M engine
   consumes.

   Everything here was read on 2026-08-18. Where a figure is a Fingrid
   obligation or a published clearing price it is quoted exactly; where it is an
   inference it says so and carries a gate.
   --------------------------------------------------------------------------- */
import { QUOTE_SOURCES } from '../../comparison/supplierQuote.js';

export const SRC = {
  /* The supplier quotation and its MSA — capex DC block and the service package (2026-10-17). */
  ...QUOTE_SOURCES,
  // ---- system operator: reserves -------------------------------------------
  reserveObligations: {
    file: 'Fingrid — Power system reserves: obligations and procurement forecast',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026',
    cy: 'FFR 0–60 MW · FCR-D up 309 MW · FCR-D down 298 MW · FCR-N 128 MW · aFRR ~50 MW · mFRR up 880–1,300 MW · mFRR down 575 MW',
    url: 'https://www.fingrid.fi/en/electricity-market/reserves/power-system-reserves/',
    authority: 'observed',
    historical: 'Annual average procured volumes, 2019 onward',
    forecast: 'Fingrid publishes a product-by-product requirement forecast to 2036',
    frequency: 'Annual, with the forecast reissued as the transition proceeds',
    format: 'HTML tables',
    machineReadable: 'Partial — the same series are in the open-data API',
    automation: 'B — a page monitor would work; the API is the better route once the key is provisioned and CC Attribution is implemented',
    lastChecked: '2026-08-18',
    freshness: 'Current 2026 obligation period',
  },

  reserveForecast: {
    file: 'Fingrid — reserve requirement forecast 2026–2036',
    status: ['Official — Draft', '官方 — 草案'], provenance:{authority:'official',publication:'draft',availability:'public',verification:'verified'},
    date: '2026',
    cy: 'FCR-N 128 MW (2026) → 105 MW (2035–36) · mFRR up 290 → 530 MW (2033+) · mFRR down 567 → 1,100 MW (2032+)',
    url: 'https://www.fingrid.fi/en/electricity-market/reserves/power-system-reserves/',
    authority: 'official-forecast',
    historical: 'None — this is the forward view',
    forecast: 'To 2036, per product',
    frequency: 'Reissued periodically',
    format: 'HTML',
    machineReadable: 'No',
    automation: 'C — a forecast revision is an analyst decision, not an ingestion',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  fcrYearly2026: {
    file: 'Fingrid — procurement of frequency containment reserves from the yearly market 2026',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2025',
    cy: 'FCR-D up 237.0 MW at €3.50/MW,h · FCR-D down 163.0 MW at €6.00/MW,h. Fingrid states yearly-market volumes and prices fall across all FCR products for 2026, moving volume to the hourly market.',
    url: 'https://www.fingrid.fi/en/news/news/2025/procurement-of-frequency-containment-reserves-from-yearly-market-2026/',
    authority: 'observed',
    historical: 'Per procurement round',
    forecast: 'None',
    frequency: 'Annual',
    format: 'HTML news release',
    machineReadable: 'No',
    automation: 'B — release monitor',
    lastChecked: '2026-08-18',
    freshness: 'Current for delivery year 2026',
  },

  // ---- adequacy: the reason capacityMarket is false ------------------------
  peakLoadCapacity: {
    file: 'Fingrid / Finextra — peak load capacity under act 117/2011',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2025',
    cy: 'The Energy Authority procured NO capacity for the period 1 Nov 2025 – 31 Oct 2026. No capacity has been held in the strategic reserve since July 2022.',
    url: 'https://www.fingrid.fi/en/grid/peak-load-capacity/',
    authority: 'observed',
    historical: 'Yearly periods published since the act took effect',
    forecast: 'None',
    frequency: 'Annual decision',
    format: 'HTML',
    machineReadable: 'No',
    automation: 'B — annual decision monitor',
    lastChecked: '2026-08-18',
    freshness: 'Current period',
  },

  adequacyStandard: {
    file: 'Energy Authority — national report on electricity and gas markets in Finland',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2024',
    cy: 'Reliability standard LOLE 2.1 h/yr, adopted by the Government in March 2022. National resource adequacy assessments have shown no concern preventing that standard since Olkiluoto 3 entered service.',
    url: 'https://energiavirasto.fi/en/frontpage',
    authority: 'observed',
    historical: 'Annual national report',
    forecast: 'Resource adequacy assessments',
    frequency: 'Annual',
    format: 'PDF',
    machineReadable: 'No',
    automation: 'C — read on publication',
    lastChecked: '2026-08-18',
    freshness: '2024 report, the most recent read',
  },

  // ---- prices ---------------------------------------------------------------
  dayAhead: {
    file: 'ENTSO-E Transparency Platform — Finland day-ahead prices',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026',
    cy: 'Bidding zone 10YFI-1--------U (Finland, Fingrid BZ/CA/MBA). Wired through the same connector and token as GB, IE, RO and PL.',
    url: 'https://transparency.entsoe.eu/',
    authority: 'observed',
    historical: 'Full day-ahead history for the zone',
    forecast: 'None',
    frequency: 'Daily',
    format: 'REST API, XML',
    machineReadable: 'Yes',
    automation: 'A — already automated for four other markets',
    lastChecked: '2026-08-18',
    freshness: 'Live',
  },

  marketStructure: {
    file: 'Nordic day-ahead market — 15-minute market time unit',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2025',
    cy: 'Day-ahead trading moved from hourly to 15-minute resolution on 1 October 2025. Finland reached −500 €/MWh in 2024; negative-price hours have risen with wind penetration.',
    url: 'https://www.nordpoolgroup.com/',
    authority: 'observed',
    historical: 'Price history from the exchange',
    forecast: 'None',
    frequency: 'Continuous',
    format: 'HTML / API',
    machineReadable: 'Partial',
    automation: 'C — structural fact, not a series',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  // ---- the fleet the saturation gate measures -------------------------------
  /* THREE ENTRIES, NOT ONE. An earlier draft put the aggregate and the project
     announcements behind a single citation, which made an operator statistic and
     a developer press release look like the same class of evidence. They are
     not, and the saturation argument leans on the first. */
  storageFleet: {
    file: 'Fingrid — combined capacity of electricity storages in Finland exceeds 1,000 MW',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026-02',
    cy: 'About 1,050 MW connected in early February 2026: 261 systems of 1 MW and above totalling ~980 MW, plus ~70 MW of smaller batteries tracked through the reserve markets. 56% on the distribution grid, 44% on transmission. All storage types, not batteries alone.',
    url: 'https://www.fingrid.fi/en/news/news/2026/the-combined-capacity-of-electricity-storages-in-finland-now-exceeds-1000-mw/',
    authority: 'observed',
    historical: 'Fingrid also publishes installed battery capacity as a series',
    forecast: 'None; the release notes many further connections are expected',
    frequency: 'Ad hoc release; the underlying series is continuous',
    format: 'HTML release; the series is REST API',
    machineReadable: 'Yes, for the series',
    automation: 'A — the series is CC Attribution, see the licence entry below',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  statkraftOx2: {
    file: 'Statkraft — seven-year optimisation agreement for OX2 batteries in Finland',
    /* PUBLISHER IS STATKRAFT; THE DEVELOPER IS OX2. This was classified
       developer-reported, which named the wrong party: Statkraft is the
       offtaker and optimiser, not the builder, so the record was implicitly
       claiming a closeness to the asset that its publisher does not have.
       Counterparty-reported says what it is — a commercial party to the deal,
       describing the deal. Still self-reported, still requires attribution,
       still not independent research. */
    status: ['Counterparty-reported', '交易对手方披露'], provenance:{authority:'counterparty-reported',publication:'final',availability:'public',verification:'verified'},
    date: '2026',
    cy: '235 MW across two sites under construction — 110 MW/220 MWh and 125 MW/250 MWh — under a seven-year optimisation agreement.',
    url: 'https://www.statkraft.com/newsroom/news-and-stories/2026/statkraft-signs-contract-with-OX2-to-optimize-large-scale-batteries-in-finland/',
    authority: 'observed',
    historical: 'n/a — a single transaction',
    forecast: 'None',
    frequency: 'One-off',
    format: 'HTML release',
    machineReadable: 'No',
    automation: 'C — a counterparty announcement is read, not ingested',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  tradePress: {
    file: 'Trade press — Uusikaupunki project report',
    status: ['Verify against current documents', '须以现行文件核验'], provenance:{authority:'unclassified',publication:'final',availability:'public',verification:'requires-reverification'},
    date: '2026',
    cy: 'Uusikaupunki 50 MW/100 MWh, reported for 2026 (Nivala, which this record carried at 70 MW/140 MWh, is now sourced to its October 2026 sale). NOT confirmed against a developer or operator statement — this carries the weakest evidence on this page and are shown because omitting known projects would understate the fleet, not because the citation is strong.',
    url: 'https://www.energy-storage.news/tag/finland/',
    authority: 'third-party',
    historical: 'n/a',
    forecast: 'None',
    frequency: 'Ad hoc',
    format: 'HTML',
    machineReadable: 'No',
    automation: 'C — trade press is corroboration, never a primary register',
    lastChecked: '2026-08-18',
    freshness: 'Current, unverified against a primary source',
  },

  // ---- licence, which gates publication rather than ingestion ---------------
  fingridApiTerms: {
    file: 'Fingrid open data — dataset licence and API terms',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026',
    cy: 'The datasets themselves declare CREATIVE COMMONS ATTRIBUTION, with downloads in JSON, CSV, XLSX and XML — so republication is permitted with attribution. What still requires action is the API path specifically: a registered key, and the terms accepted at registration. Gate FI-2 is therefore "provision the key, accept and record the API terms, implement attribution", not "redistribution rights are unknown".',
    url: 'https://data.fingrid.fi/en/instructions',
    authority: 'observed',
    historical: 'n/a',
    forecast: 'n/a',
    frequency: 'n/a',
    format: 'HTML',
    machineReadable: 'No',
    automation: 'C — a licence is read and accepted by a person',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  // ---- added with the build pathway (round 4) -------------------------------
  connectionPhases: {
    file: 'Fingrid — connection to the main grid: connection agreement phases and general connection terms',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026',
    cy: 'A main grid connection is agreed by connection agreement, whose prerequisites include a legally valid land-use plan and building permits. The preceding letter of intent requires the EIA programme published and rights to the project area secured, and describes the route to the connection agreement.',
    url: 'https://www.fingrid.fi/en/grid/grid-connection-agreement-phases/',
    authority: 'observed',
    historical: 'Process pages, not project records',
    forecast: 'None',
    frequency: 'As revised',
    format: 'HTML',
    machineReadable: 'No',
    automation: 'C — a published process is read, not ingested',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  gridCode: {
    file: 'Fingrid — grid code specifications; SJV2024 for grid energy storage systems',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2025-03-20',
    cy: 'The Energy Authority adopted VJV2024 and SJV2024 on 20 March 2025. SJV2024 is a dedicated code for GRID ENERGY STORAGE SYSTEMS, applying from 0.8 kW, with requirements by type class A to D according to capacity and connection voltage.',
    url: 'https://www.fingrid.fi/en/grid/grid-connection-agreement-phases/grid-code-specifications/',
    authority: 'observed',
    historical: 'Superseded specifications remain published',
    forecast: 'None',
    frequency: 'As revised',
    format: 'HTML / PDF',
    machineReadable: 'No',
    automation: 'C',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  connectionRestriction: {
    file: 'Fingrid — restrictions on new energy storage facility connections in southern Finland',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2025',
    cy: 'New grid energy storage connections in southern Finland restricted until 2029, when the Hikia-Toivila reinforcement completes. Previously to early 2027 and extended. More than 30,000 MW of storage connection requests against about 1,800 MW contracted; several thousand MW available in Ostrobothnia and the north.',
    url: 'https://www.fingrid.fi/en/news/news/2025/fingrid-secures-transmission-capacity-for-growth-in-electricity-consumption-and-new-industrial-investments--restrictions-on-new-energy-storage-facility-connections-continued-in-southern-finland/',
    authority: 'observed',
    historical: 'Restated as the restriction is revised',
    forecast: 'Relief stated as 2029',
    frequency: 'As revised',
    format: 'HTML',
    machineReadable: 'No',
    automation: 'B — release monitor',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  /* A DECLARED COVERAGE GAP, as a first-class record.

     Finland already declares this in comparison.economics.unavailable, which is
     what keeps the number off the page. But a claim cannot CITE that: the claim
     schema resolves gaps against the source register, so a withheld line that
     lives only on the comparison object is invisible to the one mechanism built
     to stop a section arguing past it. Gate FI-1 becomes a record so a blocked
     disposition can name it.

     Internal authority and requires-reverification, which together are what the
     schema recognises as a gap rather than a source — it can never be counted
     as affirmative evidence. */
  reserveRevenueGap: {
    file: 'Finnish reserve revenue line — coverage gap (gate FI-1): no published clearing-price series, and no eligible-versus-procured basis per product',
    status: ['Not verified', '未核实'],
    provenance: { authority: 'internal', publication: 'draft', availability: 'restricted',
                  verification: 'requires-reverification' },
    date: '2026-08',
    cy: 'Reserve revenue, all products',
    url: 'https://data.fingrid.fi/en/instructions',
  },

  reserveParticipation: {
    file: 'Fingrid — how to participate in the reserve markets',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026',
    cy: 'Prequalification is per reserve product, each with its own technical requirements and approval. Entry is not tied to an annual capacity-certification cycle, unlike the WEM Reserve Capacity Cycle.',
    url: 'https://www.fingrid.fi/en/electricity-market/reserves/reserve-products/how-to-participate-in-the-reserve-markets/',
    authority: 'observed',
    historical: 'n/a — a process page',
    forecast: 'None',
    frequency: 'As revised',
    format: 'HTML',
    machineReadable: 'No',
    automation: 'C — a published process is read, not ingested',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  /* ---- added 2026-10-17, with Finland's entry to the engine ------------------ */
  windStats: {
    file: 'Renewables Finland — wind power statistics 2025',
    status: ['Industry association', '行业协会'], provenance:{authority:'third-party',publication:'final',availability:'public',verification:'verified'},
    date: '2026',
    cy: '9,433 MW of wind at year-end 2025 on 2,002 turbines, 1,023 MW added in 2025; the Ostrobothnia regions hold 76% of it.',
    url: 'https://suomenuusiutuvat.fi/en/wind-power-statistics-2025/',
    authority: 'observed', historical: 'Annual since the 1990s', forecast: 'None', frequency: 'Annual',
    format: 'HTML + PDF', machineReadable: 'No', automation: 'C — annual statistics are read, not ingested',
    lastChecked: '2026-10-17', freshness: 'Year-end 2025',
  },
  storageIndex: {
    file: 'Clean Horizon Storage Index (published through Nord Pool) — Finland',
    status: ['Third party', '第三方'], provenance:{authority:'third-party',publication:'final',availability:'public',verification:'verified'},
    date: 'Aug 2026',
    cy: 'All-market revenue for a Finnish battery as reported for August 2026: about €50k/MW/yr at 1h, €78k at 2h and €111k at 4h, against €645k at 1h at the September 2023 peak. Clean Horizon put a two-hour asset at about €400k in mid-2025.',
    url: 'https://www.nordpoolgroup.com/en/services/power-market-data-services/bess-market-clean-horizon-storage-index/',
    authority: 'observed', historical: 'Monthly since 2023', forecast: 'None', frequency: 'Monthly',
    format: 'Subscription index; free monthly aggregate', machineReadable: 'No', automation: 'D — analyst review',
    lastChecked: '2026-10-17', freshness: 'August 2026',
  },
  storageIndex2025: {
    file: 'Clean Horizon — Storage Index update: Finland in focus',
    status: ['Third party', '第三方'], provenance:{authority:'third-party',publication:'final',availability:'public',verification:'verified'},
    date: '18 Jul 2025',
    cy: 'FCR-N reserved at €47/MW,h in 2023 and €46 in 2024, falling to €19 by June 2025; a two-hour battery at about €400k/MW/yr.',
    url: 'https://www.cleanhorizon.com/news/storage-index-update-finland-in-focus/',
    authority: 'observed', historical: 'n/a — a market note', forecast: 'None', frequency: 'Ad hoc',
    format: 'HTML', machineReadable: 'No', automation: 'C — a note is read, not ingested',
    lastChecked: '2026-10-17', freshness: 'July 2025',
  },
  dealNtr: {
    file: 'NTR — L&G NTR Clean Power Fund purchases its first battery storage project (Uusnivala, from OX2)',
    status: ['Counterparty-reported', '交易对手方披露'], provenance:{authority:'counterparty-reported',publication:'final',availability:'public',verification:'verified'},
    date: '1 Aug 2024',
    cy: 'Uusnivala BESS, at least 50 MW / 110 MWh, ready-to-build, bought from OX2.',
    url: 'https://www.ntrplc.com/articles/lg-ntr-clean-power-fund-purchases-first-battery-storage-project/',
    authority: 'observed', historical: 'n/a — a single transaction', forecast: 'None', frequency: 'One-off',
    format: 'HTML release', machineReadable: 'No', automation: 'C — a transaction is read, not ingested',
    lastChecked: '2026-10-17', freshness: 'Current',
  },
  dealKauhava: {
    file: 'Enerdatics — Nala Renewables secures financing for the 50 MW Kauhava battery in Finland',
    status: ['Third party', '第三方'], provenance:{authority:'third-party',publication:'final',availability:'public',verification:'requires-reverification'},
    date: '2025',
    cy: 'Kauhava, 50 MW / 100 MWh, acquired by Nala in January 2025, with long-term project finance from Société Générale.',
    url: 'https://www.enerdatics.com/insights/nala-renewables-secures-financing-to-power-finlands-energy-future-with-the-kauhava-bess-project',
    authority: 'observed', historical: 'n/a — a single transaction', forecast: 'None', frequency: 'One-off',
    format: 'HTML', machineReadable: 'No', automation: 'C — a transaction is read, not ingested',
    lastChecked: '2026-10-17', freshness: 'Current',
  },
  dealVuolijoki: {
    file: 'ESS News — Fu-Gen and Nala Renewables close on 125 MW ready-to-build BESS in Finland',
    status: ['Third party', '第三方'], provenance:{authority:'third-party',publication:'final',availability:'public',verification:'verified'},
    date: '17 Feb 2026',
    cy: 'Vuolijoki standalone BESS, 125 MW, ready-to-build, bought by Nala (a Trafigura and IFM joint venture) from Fu-Gen; construction to begin in 2026.',
    url: 'https://www.ess-news.com/2026/02/17/fu-gen-and-nala-renewables-close-on-125-mw-ready-to-build-bess-in-finland/',
    authority: 'observed', historical: 'n/a — a single transaction', forecast: 'None', frequency: 'One-off',
    format: 'HTML', machineReadable: 'No', automation: 'C — a transaction is read, not ingested',
    lastChecked: '2026-10-17', freshness: 'Current',
  },
  dealPrime: {
    file: 'Renewables Now — Prime Capital closes purchase of 170-MWh BESS project in Finland',
    status: ['Third party', '第三方'], provenance:{authority:'third-party',publication:'final',availability:'public',verification:'verified'},
    date: '11 Mar 2026',
    cy: 'A 170 MWh Finnish BESS project, acquisition closed by Prime Capital.',
    url: 'https://renewablesnow.com/news/prime-capital-closes-purchase-of-170-mwh-bess-project-in-finland-1291156/',
    authority: 'observed', historical: 'n/a — a single transaction', forecast: 'None', frequency: 'One-off',
    format: 'HTML', machineReadable: 'No', automation: 'C — a transaction is read, not ingested',
    lastChecked: '2026-10-17', freshness: 'Current',
  },
  dealForesight: {
    file: 'Renewables Now — Foresight acquires 100-MW/400-MWh BESS project in Finland from FRV',
    status: ['Third party', '第三方'], provenance:{authority:'third-party',publication:'final',availability:'public',verification:'verified'},
    date: '15 Oct 2026',
    cy: 'Nivala BESS, 100 MW / 400 MWh, four hours, fully permitted, bought by Foresight through its FEIP II fund from FRV; commercial operation expected in H2 2028; for wholesale, intraday and ancillary markets.',
    url: 'https://renewablesnow.com/news/foresight-acquires-100-mw400-mwh-bess-project-in-finland-from-frv-1303040/',
    authority: 'observed', historical: 'n/a — a single transaction', forecast: 'None', frequency: 'One-off',
    format: 'HTML', machineReadable: 'No', automation: 'C — a transaction is read, not ingested',
    lastChecked: '2026-10-17', freshness: 'Current',
  },
};

export const sources = SRC;
export default SRC;
