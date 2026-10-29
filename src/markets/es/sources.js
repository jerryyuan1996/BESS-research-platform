/* ---------------------------------------------------------------------------
   Spain — source register.

   Read on 2026-10-29 for docs/spain-registration-plan.md, which the analyst
   signed off the same day. The merchant line is computed from OMIE's public
   day-ahead files (free use if the source is cited); the capacity market is
   read from the BOE; fleet counts are REE's; grants are MITECO's. Gaps are
   registered at the end rather than left implicit.
   --------------------------------------------------------------------------- */
import { QUOTE_SOURCES } from '../../comparison/supplierQuote.js';

const OFFICIAL = { authority: 'official', publication: 'final', availability: 'public', verification: 'verified' };
const OFFICIAL_UNVERIFIED = { authority: 'official', publication: 'final', availability: 'public', verification: 'requires-reverification' };
const PRESS = { authority: 'third-party', publication: 'final', availability: 'public', verification: 'verified' };
const GAP = { authority: 'internal', publication: 'draft', availability: 'restricted', verification: 'requires-reverification' };

export const SRC = {
  /* The supplier quotation and its MSA — the DC block and the service package. */
  ...QUOTE_SOURCES,

  // ---- prices -----------------------------------------------------------------
  omiePrices: {
    file: 'OMIE — day-ahead marginal prices (marginalpdbc), Spanish zone',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '1 Jan 2023 – 29 Oct 2026',
    cy: 'One file a day: the hourly marginal price for Portugal and Spain, 96 quarter-hours a day since 1 October 2025. 1,395 of 1,398 days read. 4 h day-ahead value €76.5k (2023), €76.5k (2024), €111.3k (2025); 2026 to 29 October +43.0% on the same days of 2025. Mean price €65.2/MWh in 2025.',
    url: 'https://www.omie.es/es/file-download?parents=marginalpdbc&filename=marginalpdbc_20251231.1',
    authority: 'observed', historical: 'Daily files from 2023', forecast: 'None',
    frequency: 'Daily', format: 'CSV (semicolon)', machineReadable: 'Yes',
    automation: 'A — public, no key; scripts/derive/spain-registration.mjs', lastChecked: '2026-10-29', freshness: 'To 29 Oct 2026',
  },
  omieTerms: {
    file: 'OMIE — legal notice',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '2026',
    cy: 'Public information on the site "puede ser utilizada libremente" provided its content is respected; used in its original format, the source must be cited.',
    url: 'https://www.omie.es/es/aviso-legal',
  },

  // ---- the capacity market ------------------------------------------------------
  capacityOrder: {
    file: 'BOE — Order TED/966/2026, creating a capacity market in the peninsular electricity system',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '17 Sep 2026',
    cy: 'Main and adjustment auctions, and one-year transitional auctions until the first main delivery period. New storage: half the reference technology\'s useful life, never more than 15 years (art. 7.1.a). Firm capacity = installed MW × a coefficient set in each call (art. 3.f, 10). Pay-as-bid; the curve\'s cap may be confidential (art. 15). The award "no serán objeto de actualización" (art. 15.2). Stress hours ≤10% of the year; penalties × 1.2 (art. 22, 27). Public aid must be fully reflected in bids (art. 11.l).',
    url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-19329',
    authority: 'observed', historical: 'n/a', forecast: 'First auction expected Q1 2027',
    frequency: 'Per call', format: 'HTML', machineReadable: 'No',
    automation: 'D — a statute is read, not ingested', lastChecked: '2026-10-29', freshness: 'In force 18 Sep 2026',
  },
  capacityApproval: {
    file: 'ESS News — EU approves capacity market for Spain',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: '1 Jun 2026',
    cy: 'The European Commission approved the Spanish capacity mechanism on 29 May 2026, up to €9bn over 2026–2036.',
    url: 'https://www.ess-news.com/2026/06/01/eu-approves-capacity-market-for-spain/',
  },
  capacityTiming: {
    file: 'Energía Estratégica — the capacity market\'s timing',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: 'Sep 2026',
    cy: 'Sector estimates put the first auction in January–March 2027, depending on when the pending rules are approved.',
    url: 'https://www.energiaestrategica.com/es/notes/hablan-los-referentes-del-sector-espanol-el-mercado-de-capacidad-se-juega-su-futuro-en-septiembre',
  },

  // ---- fleet and demand ----------------------------------------------------------
  reeSystem2025: {
    file: 'REE — Informe del Sistema Eléctrico 2025 (press release)',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '11 Mar 2026',
    cy: 'National demand 256 TWh in 2025 (+2.8%); above 269 TWh counting self-consumption. Peninsular peak 40,070 MW on 15 January.',
    url: 'https://www.ree.es/sites/default/files/2026-03/1103_NP_ISE_2025.pdf',
    authority: 'observed', historical: '2025', forecast: 'None',
    frequency: 'Annual', format: 'PDF', machineReadable: 'No',
    automation: 'D — read', lastChecked: '2026-10-29', freshness: '2025',
  },
  reeBatteries: {
    file: 'Híbridos y Eléctricos — REE\'s installed-battery count',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: 'Apr 2026',
    cy: 'REE counted 28 MW of batteries a year earlier and 193 MW in April 2026; the system closed 2025 with 96 MW of batteries beside 3,331 MW of pumped hydro.',
    url: 'https://www.hibridosyelectricos.com/energia/25000-221000-kw-carrera-espana-por-almacenamiento-energia-en-grandes-campos-baterias-electricas_86932_102.html',
  },
  q2Approvals: {
    file: 'ESS News — Spain adds 1.76 GW of battery storage projects in Q2',
    status: ['Third-party — Press', '第三方 — 媒体'], provenance: PRESS,
    date: '17 Jul 2026',
    cy: '34 battery projects totalling 1.76 GW in the second quarter of 2026, against 733 MW a year earlier.',
    url: 'https://www.ess-news.com/2026/07/17/spain-adds-1-76-gw-of-battery-storage-projects-in-q2/',
  },

  // ---- grants and tax -----------------------------------------------------------
  pinalm: {
    file: 'MITECO — PINALM final award: €818m to 126 storage projects',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '30 Dec 2025',
    cy: '€818.3m of FEDER 2021–27 funds to 126 projects — 69 hybrid, 39 standalone batteries, 15 thermal, 3 pumped hydro — adding 2.2 GW / 9.4 GWh. Built within 36 months of the award and by 31 December 2029. Eligible cost capped at €250/kWh standalone, €300 grid-forming (Order TED/535/2025).',
    url: 'https://www.miteco.gob.es/content/dam/miteco/es/prensa/20251230_NdP.%20El%20MITECO%20asigna%20818%20millones%20a%20126%20proyectos%20que%20reforzar%C3%A1n%20el%20almacenamiento%20energ%C3%A9tico%20a%20gran%20escala%20en%20todo%20el%20pa%C3%ADs.pdf',
    authority: 'observed', historical: 'Round 1', forecast: 'None for batteries',
    frequency: 'Per call', format: 'PDF', machineReadable: 'No',
    automation: 'D — read', lastChecked: '2026-10-29', freshness: 'Final award',
  },
  ivpee: {
    file: 'Osborne Clarke — Royal Decree-Law 18/2026',
    status: ['Third-party — Law firm', '第三方 — 律所'], provenance: PRESS,
    date: 'Jul 2026',
    cy: 'The 7% generation tax (IVPEE) stays at 7% on a reduced base in 2026, falls to 3.5% in 2027 and to 0% from 2028.',
    url: 'https://www.osborneclarke.com/insights/royal-decree-law-182026-29-june-spains-electricity-sector-faces-new-regulatory-framework',
  },

  // ---- grid ------------------------------------------------------------------------
  accessGuarantee: {
    file: 'Xunta de Galicia — guide to grid access and connection guarantees',
    status: ['Official — Guidance', '官方 — 指引'], provenance: OFFICIAL_UNVERIFIED,
    date: '2025',
    cy: 'An access and connection application for generation, storage that exports included, requires a guarantee of €40/kW installed (RD 1955/2000 art. 23, as amended).',
    url: 'https://ficheiros-web.xunta.gal/cei/enerxia/guia-garantias-redes-enerxia-electrica-cas.pdf',
  },
  transmission: {
    file: 'REE — transmission',
    status: ['Official — Public', '官方 — 公开'], provenance: OFFICIAL,
    date: '2026',
    cy: 'Red Eléctrica owns and operates the transmission grid: about 22,000 km at 400 kV and 20,200 km at 220 kV at the end of 2023.',
    url: 'https://www.ree.es/en/press-release-type/transmission',
  },

  // ---- third-party index, a check and not a seed -----------------------------------
  cleanHorizon: {
    file: 'ESS News — Clean Horizon battery revenue indices, August 2026',
    status: ['Third-party — Index', '第三方 — 指数'], provenance: PRESS,
    date: '24 Sep 2026',
    cy: 'Two-hour battery index revenues across European markets, all streams. Spain\'s June 2026 figure was €252k/MW/yr.',
    url: 'https://www.ess-news.com/2026/09/24/battery-revenues-rise-everywhere-in-europe-other-than-baltics-in-august-2026/',
  },

  // ---- gaps --------------------------------------------------------------------------
  balancingGap: {
    file: 'Spanish balancing prices — coverage gap',
    status: ['Not verified', '未核实'], provenance: GAP,
    date: 'Oct 2026',
    cy: 'aFRR band and mFRR prices per MW',
    url: 'https://www.esios.ree.es/en',
    authority: 'methodology', historical: 'REE publishes band prices on esios, behind a free token', forecast: 'N/A',
    frequency: 'Daily', format: 'API', machineReadable: 'Yes', automation: 'B — needs an esios token (gate ES-3)',
    lastChecked: '2026-10-29', freshness: 'Not yet read',
  },
};

export const sources = SRC;
export default SRC;
