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

export const SRC = {
  // ---- system operator: reserves -------------------------------------------
  reserveObligations: {
    file: 'Fingrid — Power system reserves: obligations and procurement forecast',
    status: ['Official — Final', '官方 — 最终'],
    date: '2026',
    cy: 'FFR 0–60 MW · FCR-D up 309 MW · FCR-D down 298 MW · FCR-N 128 MW · aFRR ~50 MW · mFRR up 880–1,300 MW · mFRR down 575 MW',
    url: 'https://www.fingrid.fi/en/electricity-market/reserves/power-system-reserves/',
    authority: 'observed',
    historical: 'Annual average procured volumes, 2019 onward',
    forecast: 'Fingrid publishes a product-by-product requirement forecast to 2036',
    frequency: 'Annual, with the forecast reissued as the transition proceeds',
    format: 'HTML tables',
    machineReadable: 'Partial — the same series are in the open-data API',
    automation: 'B — a page monitor would work; the API is the better route once its licence is confirmed',
    lastChecked: '2026-08-18',
    freshness: 'Current 2026 obligation period',
  },

  reserveForecast: {
    file: 'Fingrid — reserve requirement forecast 2026–2036',
    status: ['Official — Draft', '官方 — 草案'],
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
    status: ['Official — Final', '官方 — 最终'],
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
    status: ['Official — Final', '官方 — 最终'],
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
    status: ['Official — Final', '官方 — 最终'],
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
    status: ['Official — Final', '官方 — 最终'],
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
    status: ['Official — Final', '官方 — 最终'],
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
  storageFleet: {
    file: 'Fingrid open data — total installed battery energy storage capacity, with developer announcements',
    status: ['Developer-reported', '开发商披露'],
    date: '2026',
    cy: 'About 250 MW of BESS operational mid-2025. Announced and under construction: Statkraft/OX2 235 MW (110 MW/220 MWh and 125 MW/250 MWh), Nivala 70 MW/140 MWh, Uusikaupunki 50 MW/100 MWh. See the saturation gate in comparison.js.',
    url: 'https://data.fingrid.fi/en/datasets/424',
    authority: 'observed',
    historical: 'Fingrid publishes installed BESS capacity as a series',
    forecast: 'Developer announcements are not a financed pipeline',
    frequency: 'Continuous for the Fingrid series',
    format: 'REST API',
    machineReadable: 'Yes',
    automation: 'B — blocked on the licence question below, not on the connector',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },

  // ---- licence, which gates publication rather than ingestion ---------------
  fingridApiTerms: {
    file: 'Fingrid open data — API terms of use',
    status: ['Verify against current documents', '须以现行文件核验'],
    date: '2026',
    cy: 'Free, but a registered API key is required and the licence text sits behind that registration. Redistribution terms are NOT established from the public page, so no Fingrid series may be republished until they are read. This is why the reserve-price feed is proposed rather than wired.',
    url: 'https://data.fingrid.fi/en/instructions',
    authority: 'observed',
    historical: 'n/a',
    forecast: 'n/a',
    frequency: 'n/a',
    format: 'HTML',
    machineReadable: 'No',
    automation: 'C — a licence is read by a person',
    lastChecked: '2026-08-18',
    freshness: 'Current',
  },
};

export const sources = SRC;
export default SRC;
