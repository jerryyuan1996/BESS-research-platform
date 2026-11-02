/* ---------------------------------------------------------------------------
   Romania story evidence: a fixed-vintage, manually entered record set
   (ro-build-evidence.md §3). Nothing here refreshes, so there is no dataset
   kind, no scheduled job and no change to src/governance/datasets.js.

   WHAT MAY BE PUBLISHED. An `eligible` value is what the page may print, and
   it is null wherever a source, reuse or calculation gate is still open. A
   null is a gap, never a zero, and never a candidate value carried along for
   later: this file is in the public bundle (docs/data-policy.md), so a number
   written here is published even if no page reads it. The reviewed numbers,
   their arithmetic and the gate each waits on stay in the decision record,
   which is where a later vintage reopens them.

   EVERY VALUE CARRIES A LOCATOR. `locator` names the document and the exact
   page, table, row or clause; `sources` points at the envelope below. A record
   whose primary was never located says so (`unresolved: true`) instead of
   naming a home page. The test beside this file refuses a value without one.

   REUSE. Opening a document is not permission. Each source states its reuse
   status, and a numeric publication needs `permitsNumericPublication`. Three
   connection-rule records are the only numeric values cleared here: the
   decision record directs a limited factual-summary basis for those clauses
   (§8), which is recorded on SRC-RO-13a/b rather than assumed.
   --------------------------------------------------------------------------- */

/** Authoring identity for the whole set: one review vintage, one check date. */
export const RO_STORY_META = {
  id: 'ro-story-evidence',
  marketId: 'ro',
  schemaVersion: 1,
  vintage: '2026-11-02',
  checkedOn: '2026-11-02',
  review: 'ro-grant-status-review',
};

/* The source envelope. `reuse` is decided per document, not per publisher;
   `lastAttemptOn` keeps a failed retrieval separate from an earlier check. */
export const RO_STORY_SOURCES = {
  'SRC-RO-01': {
    publisher: 'Transelectrica',
    title: 'Sistemul Electroenergetic Național depășește borna de 2.500 MW de noi capacități de producție și stocare conectate la rețea în 2026',
    url: 'https://web.transelectrica.ro/noutati/noutati/734_2026.08.20_19-51-16.pdf',
    publishedOn: '2026-08-20',
    effectiveOn: null,
    coverage: 'connections to 20 August 2026; storage available at 1 August 2026; year-end estimate',
    language: 'ro',
    access: 'opened',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'PDF', pdfPage: [1, 2], printedPage: null, table: null, row: null, column: null, clause: 'p. 1 final paragraph; p. 2 paragraph beginning „Până la sfârșitul anului 2026”' },
    reuse: {
      status: 'public-link-only',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Sursa: Transelectrica, 20 august 2026',
      constraints: 'The release and the checked site material state no reusable-data permission. The link and a qualitative treatment may proceed; the numbers wait for a recorded basis.',
    },
  },
  'SRC-RO-02': {
    publisher: 'Transelectrica counts as reported by press summaries',
    title: 'Dated storage counts attributed to Transelectrica, 2025–2026',
    url: null,
    publishedOn: null,
    effectiveOn: null,
    coverage: 'January 2025 to October 2026, as attributed',
    language: 'ro',
    access: 'not-located',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    unresolved: true,
    locator: { document: null, pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: null },
    reuse: {
      status: 'not-located',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: null,
      constraints: 'Targeted primary-host searches did not establish the release, page or row. A news report is not an observation, and a source home page cannot stand in for an unlocated numeric row.',
    },
  },
  'SRC-RO-03': {
    publisher: 'Ministry of Energy, applicant guide annexed to Order 915/14.08.2026 (read from a third-party copy)',
    title: 'Ghidul solicitantului — instalații de stocare autonome, Fondul pentru Modernizare',
    url: 'https://startupcafe.ro/wp-content/uploads/2026/08/Ghidul_solicitantului_instalatii_stocare_autonama_FM.pdf',
    publishedOn: '2026-08-14',
    effectiveOn: null,
    coverage: 'scheme rules and national plan reference',
    language: 'ro',
    access: 'opened (copy)',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'PDF', pdfPage: [4, 10, 33], printedPage: [4, 10, 33], table: null, row: null, column: null, clause: 'p. 4 opening PNIESC paragraph; p. 10 final paragraph before §1.2; p. 33 §3.1.2' },
    reuse: {
      status: 'copy-pending-comparison',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Sursa: Ministerul Energiei, ghidul solicitantului, Ordinul 915/14.08.2026',
      constraints: 'A third-party copy is not the ministry or Gazette text. Compare the applicable annex, establish version and reuse, and do not ship the copy.',
    },
  },
  'SRC-RO-04': {
    publisher: 'Ministry of Energy and the EU-funds portal',
    title: 'Stand-alone battery storage call page and the notice of an amended call',
    url: 'https://energie.gov.ro/lansare-apel-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-stand-alone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din-fondul-pentru-modernizare-p/',
    publishedOn: null,
    effectiveOn: null,
    coverage: 'submission window and any published outcome',
    language: 'ro',
    access: 'inaccessible at the last check',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'call page', pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: null },
    reuse: {
      status: 'link-only',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: null,
      constraints: 'Access failure is not evidence of non-publication. No ranking, list or outcome was opened, and none is asserted.',
    },
  },
  'SRC-RO-05': {
    publisher: 'European Investment Bank, Modernisation Fund',
    title: 'MF 2026-1 RO 0-006 — Supporting investments in stand-alone battery storage installations',
    url: 'https://www.modernisationfund.eu/wp-content/uploads/2026/07/MF-2026-1-RO-0-006-%E2%80%93-Supporting-investments-in-the-development-of-stand-alone-battery-storage-installations-of-electricity.pdf',
    publishedOn: '2026-03-11',
    effectiveOn: null,
    coverage: 'programme confirmation 2026–2030',
    language: 'en',
    access: 'opened',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'PDF', pdfPage: [1, 2, 3], printedPage: null, table: null, row: null, column: null, clause: 'priority-investment confirmation' },
    reuse: {
      status: 'link-only',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Source: European Investment Bank / Modernisation Fund',
      constraints: 'A programme confirmation names no selected battery and is not an award.',
    },
  },
  'SRC-RO-06': {
    publisher: 'European Commission and European Investment Bank',
    title: 'Joint press release: ETS revenues invested in cleaner energy systems in 11 EU countries',
    url: 'https://www.modernisationfund.eu/joint-press-release-e2-5-billion-of-eu-ets-revenues-invested-in-cleaner-energy-systems-in-11-eu-countries/',
    publishedOn: '2026-07-02',
    effectiveOn: null,
    coverage: 'programme disbursement, not project awards',
    language: 'en',
    access: 'opened',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'web release', pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: 'opening paragraphs and investment list' },
    reuse: {
      status: 'link-only',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Source: European Commission',
      constraints: 'Money to a state programme is not a beneficiary list and not receipt by a battery owner.',
    },
  },
  'SRC-RO-07': {
    publisher: 'European Commission',
    title: 'IP/26/524 — Commission approves a Romanian State aid scheme for electricity storage (SA.121308)',
    url: 'https://ec.europa.eu/commission/presscorner/detail/en/ip_26_524',
    publishedOn: '2026-03-06',
    effectiveOn: null,
    coverage: 'scheme approval',
    language: 'en',
    access: 'opened (press-corner text)',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'press release', pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: 'approval decision and scheme description' },
    reuse: {
      status: 'link-only',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Source: European Commission, 6 March 2026',
      constraints: 'Approval of a scheme is not an award under it.',
    },
  },
  'SRC-RO-08': {
    publisher: 'OPCOM',
    title: 'Annual report 2005',
    url: 'https://ns1.opcom.ro/uploads/doc/rapoarte/Companie/RA_2005_RO.pdf',
    publishedOn: null,
    effectiveOn: null,
    coverage: '2005 market launch',
    language: 'ro',
    access: 'opened in the G-1 research; not reopened on 2 November 2026',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'PDF', pdfPage: [4, 19], printedPage: null, table: null, row: null, column: null, clause: 'day-ahead market launch, two-sided bidding' },
    reuse: {
      status: 'historical-fact',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Sursa: OPCOM, raport anual 2005',
      constraints: 'Event date and description only; no copied table, chart or report graphic.',
    },
  },
  'SRC-RO-09': {
    publisher: 'EPEX SPOT',
    title: '4M Market Coupling launched with success',
    url: 'https://epexspot.com/en/news/4m-market-coupling-launched-success',
    publishedOn: '2014-11-19',
    effectiveOn: '2014-11-20',
    coverage: 'Czech, Hungarian, Romanian and Slovak coupling',
    language: 'en',
    access: 'opened in the G-1 research; launch date from the announcement title',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'web notice', pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: 'launch announcement and success notice' },
    reuse: {
      status: 'historical-fact',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Source: EPEX SPOT',
      constraints: 'Month precision is retained on the page; no price or volume is drawn from this notice.',
    },
  },
  'SRC-RO-10': {
    publisher: 'OPCOM',
    title: 'Interim Coupling project: go-live confirmed for 17 June 2021',
    url: 'https://www.opcom.ro/uploads/doc/Comunicate/Communication%20note%2015.06.2021.pdf',
    publishedOn: '2021-06-15',
    effectiveOn: '2021-06-17',
    coverage: '4M MC to Multi-Regional Coupling',
    language: 'en',
    access: 'opened in the G-1 research',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'PDF', pdfPage: 1, printedPage: null, table: null, row: null, column: null, clause: 'go-live date and first delivery' },
    reuse: {
      status: 'historical-fact',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Sursa: OPCOM, 15 iunie 2021',
      constraints: 'Event date only; no price series is drawn from this document.',
    },
  },
  'SRC-RO-11': {
    publisher: 'Nord Pool for the SDAC parties',
    title: 'Closing the loop — inclusion of the Bulgarian-Romanian border into the Single Day-Ahead Coupling',
    url: 'https://nordpoolgroup.com/en/message-center-container/newsroom/exchange-message-list/2021/q4/27-october-2021-closing-the-loop--inclusion-of-the-bulgarian-romanian-border--into-the-single-day-ahead-coupling-sdac',
    publishedOn: '2021-10-27',
    effectiveOn: '2021-10-27',
    coverage: 'implicit allocation of the Romania–Bulgaria border',
    language: 'en',
    access: 'opened in the G-1 research',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'web notice', pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: 'effective date, first delivery, joint price and flow calculation' },
    reuse: {
      status: 'historical-fact',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Source: Nord Pool / SDAC',
      constraints: 'No measured flow or capacity figure is taken from this notice.',
    },
  },
  'SRC-RO-12': {
    publisher: 'ANRE',
    title: 'ANRE elimină dublarea tarifelor pentru energia electrică stocată și reintrodusă în rețea',
    url: 'https://anre.ro/comunicat-de-presa-anre-elimina-dublarea-tarifelor-pentru-energia-electrica-stocata-si-reintrodusa-in-retea/',
    publishedOn: '2025-07-08',
    effectiveOn: null,
    coverage: 'network-tariff exemption for stored-and-reinjected energy',
    language: 'ro',
    access: 'opened in the G-1 research; the order text was not opened',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'press release', pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: 'scope of the exemption and what still pays' },
    reuse: {
      status: 'historical-fact',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Sursa: ANRE, 8 iulie 2025',
      constraints: 'Event date and the exemption boundary only. The order number and its in-force date are reported, not opened, and are not printed as facts here.',
    },
  },
  'SRC-RO-15': {
    publisher: 'ESO (Bulgaria)',
    title: 'Statistical yearbook 2025, installed-capacity table',
    url: 'https://www.eso.bg/fileObj.php?oid=5908',
    publishedOn: null,
    effectiveOn: null,
    coverage: 'installed capacity at end-2025',
    language: 'bg',
    access: 'opened',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'PDF', pdfPage: 3, printedPage: null, table: 'installed-capacity table', row: 'ОСЕЕ*', column: 'MW', clause: 'battery definition in the table footnote' },
    reuse: {
      status: 'no-basis-located',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: 'Източник: ЕСО ЕАД, статистически годишник 2025',
      constraints: 'No affirmative reuse basis was found in the yearbook or the checked site material. A Romanian licence does not transfer to a Bulgarian source.',
    },
  },
  'SRC-RO-13a': {
    publisher: 'ANRE',
    title: 'Order 53/2024 on the allocation of connection capacity',
    url: 'https://licitatii.transelectrica.ro/pages/legislatie/1780468203_Ordinul_ANRE_nr._53_din_2024.pdf',
    publishedOn: '2024-07-30',
    effectiveOn: null,
    coverage: 'connection-capacity auctions from 2026',
    language: 'ro',
    access: 'opened',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'PDF', pdfPage: 6, printedPage: 7, table: null, row: null, column: null, clause: 'Annex 1, Art. 1(a)–(c), Art. 2(2), Art. 3(2)(e)' },
    reuse: {
      status: 'limited-factual-summary',
      permitsNumericPublication: true,
      basisUrl: null,
      basisLocator: 'Annex 1, Art. 1(a)–(c), Art. 2(2), Art. 3(2)(e)',
      attribution: 'Sursa: ANRE, Ordinul nr. 53/2024',
      constraints: 'A legal threshold and allocation lag restated as fact with their clause. No reproduction of the order, its annexes, tables or diagrams. Recorded under ro-build-evidence.md §8; the analyst confirms the basis at G-2.',
    },
  },
  'SRC-RO-13b': {
    publisher: 'ANRE',
    title: 'Order 79/2025 publishing the 2026 auction session timetable',
    url: 'https://licitatii.transelectrica.ro/pages/legislatie/1780468203_Ordinul_ANRE_nr._79_din_2025.pdf',
    publishedOn: null,
    effectiveOn: null,
    coverage: 'scheduled 2026 auction sessions',
    language: 'ro',
    access: 'opened',
    checkedOn: '2026-11-02',
    lastAttemptOn: '2026-11-02',
    locator: { document: 'PDF', pdfPage: 2, printedPage: 14, table: null, row: null, column: null, clause: 'Art. II(f)' },
    reuse: {
      status: 'limited-factual-summary',
      permitsNumericPublication: true,
      basisUrl: null,
      basisLocator: 'Art. II(f)',
      attribution: 'Sursa: ANRE, Ordinul nr. 79/2025',
      constraints: 'A scheduled rule date restated as fact. It does not establish that an auction ran. No reproduction of the order or its tables.',
    },
  },
  'SRC-RO-17': {
    publisher: 'Counterparty announcement, as recorded in this repository',
    title: 'Minimum-revenue guarantee announcement for a Romanian battery',
    url: null,
    publishedOn: '2026-02-04',
    effectiveOn: null,
    coverage: 'existence and shape of one announced optimiser floor',
    language: 'en',
    access: 'repository record; not reopened',
    checkedOn: '2026-11-02',
    lastAttemptOn: null,
    locator: { document: 'announcement, as registered in src/markets/ro/sources.js', pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: 'opening paragraphs: optimisation agreement with a minimum revenue guarantee' },
    reuse: {
      status: 'qualitative-only',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: null,
      attribution: null,
      constraints: 'A route precedent only. No party, project, level, share or target-asset term is reproduced, and no numerical label may rest on it until a source-use record exists.',
    },
  },
};

/** Every record names its gate. `null` gate means the value is cleared. */
const OPEN = (gate, note) => ({ gate, note });

/**
 * The fleet series. `eligible` is the published value; `status` says what kind
 * of thing it would be if the gate closed. `datePrecision` is copied, never
 * upgraded: a month stays a month and an absent date stays absent.
 */
export const RO_FLEET = {
  id: 'fleet',
  unit: 'MW',
  measure: 'connected-storage-power',
  scope: 'national stand-alone plus hybrid-plant storage, at the connection/testing boundary the operator reports',
  sourceIds: ['SRC-RO-01', 'SRC-RO-02'],
  observations: [
    {
      id: 'fleet-2025-start',
      period: '2025-start',
      date: null,
      datePrecision: 'start-of-year, exact date not published',
      status: 'reported',
      approximate: false,
      mw: null,
      mwh: null,
      sourceIds: ['SRC-RO-02'],
      locator: { document: null, pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: null },
      unresolved: true,
      open: OPEN('source', 'A reported start-of-year count with no primary release, page or row. A 1 January observation date is not invented here.'),
    },
    {
      id: 'fleet-2026-04-01',
      date: '2026-04-01',
      datePrecision: 'day',
      status: 'reported',
      approximate: false,
      mw: null,
      mwh: null,
      sourceIds: ['SRC-RO-02'],
      locator: { document: null, pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: null },
      unresolved: true,
      open: OPEN('source', 'Reported count; the operator primary was not located.'),
    },
    {
      id: 'fleet-2026-06-20',
      date: '2026-06-20',
      datePrecision: 'day',
      status: 'reported',
      approximate: false,
      mw: null,
      mwh: null,
      sourceIds: ['SRC-RO-02'],
      locator: { document: null, pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: null },
      unresolved: true,
      open: OPEN('source', 'Reported count; the operator primary was not located.'),
    },
    {
      id: 'fleet-2026-08-01',
      date: '2026-08-01',
      datePrecision: 'day',
      status: 'observed',
      approximate: false,
      mw: null,
      mwh: null,
      sourceIds: ['SRC-RO-01'],
      locator: { document: 'PDF', pdfPage: 1, printedPage: null, table: null, row: null, column: null, clause: 'p. 1 final paragraph: storage available at 1 August 2026' },
      open: OPEN('reuse', 'The count and its definition were opened in the operator release; no reusable-data permission was located, so the number is withheld. No aggregate energy value is published for this date.'),
    },
    {
      id: 'fleet-2026-09-01',
      date: '2026-09-01',
      datePrecision: 'day',
      status: 'reported',
      approximate: false,
      mw: null,
      mwh: null,
      sourceIds: ['SRC-RO-02'],
      locator: { document: null, pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: null },
      unresolved: true,
      open: OPEN('source', 'Reported counts also disagree on the power figure; the operator primary was not located.'),
    },
    {
      id: 'fleet-2026-10-01',
      date: '2026-10-01',
      datePrecision: 'day',
      status: 'reported',
      approximate: false,
      mw: null,
      mwh: null,
      sourceIds: ['SRC-RO-02'],
      locator: { document: null, pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: null },
      unresolved: true,
      open: OPEN('source', 'A nearly flat energy total against a higher power figure needs the operator\u2019s own numbers; the primary was not located.'),
    },
  ],
  yearEnd: {
    id: 'fleet-year-end',
    status: 'estimate',
    approximate: true,
    additionsMW: null,
    totalMW: null,
    forecastPublishedOn: '2026-08-20',
    forDate: '2026-12-31',
    forDatePrecision: 'end-year',
    baselineDate: null,
    sourceIds: ['SRC-RO-01'],
    locator: { document: 'PDF', pdfPage: 2, printedPage: null, table: null, row: null, column: null, clause: 'paragraph beginning „Până la sfârșitul anului 2026”' },
    open: OPEN('reuse + calculation', 'The approximate further additions are the operator\u2019s forecast, not a count, and their reuse is unresolved. No official year-end total was located: the release does not align its remaining additions with its 1 August count, so the total stays null until a baseline is accepted.'),
  },
};

/** The national plan line: a target, drawn dashed, never an observed fleet. */
export const RO_PLAN_2030 = {
  id: 'plan-2030',
  status: 'plan',
  year: 2030,
  mw: null,
  mwh: null,
  measure: 'storage-target, not connected capacity',
  sourceIds: ['SRC-RO-03'],
  locator: { document: 'PDF', pdfPage: 4, printedPage: 4, table: null, row: null, column: null, clause: 'opening PNIESC paragraph' },
  open: OPEN('reuse + official comparison', 'The plan levels are read from a third-party copy of the applicant guide. They stay null until the ministry or Gazette annex is compared and a reuse basis is recorded.'),
};

/** Bulgaria: a different definition of installed battery capacity. */
export const RO_BG_END_2025 = {
  id: 'bg-end-2025',
  status: 'observed',
  year: 2025,
  mw: null,
  mwh: null,
  measure: 'installed battery capacity, Bulgarian operator definition',
  sourceIds: ['SRC-RO-15'],
  locator: { document: 'PDF', pdfPage: 3, printedPage: null, table: 'installed-capacity table', row: 'ОСЕЕ*', column: 'MW', clause: 'footnote definition of the battery row' },
  open: OPEN('reuse', 'The row was opened, but no reuse basis was located. The number is withheld and the label is suppressed rather than tagged as reported.'),
};

/** Connection rules: the only numeric values cleared in this vintage. */
export const RO_CONNECTION = {
  auctionThresholdMW: 5,
  auctionThresholdComparator: 'gte',
  auctionThresholdBasis: 'site installed power, inclusive threshold',
  allocationLagYears: 2,
  allocationLagBasis: 'calendar years after the auction year; allocation begins in the second year',
  auctionSessionsFrom: '2026-10-30',
  auctionSessionsBasis: 'scheduled rule date; it does not establish that an auction ran',
  sourceIds: ['SRC-RO-13a', 'SRC-RO-13b'],
  locator: { document: 'ANRE Orders 53/2024 and 79/2025', pdfPage: [6, 2], printedPage: [7, 14], table: null, row: null, column: null, clause: 'Annex 1 Art. 1(a)–(c), 2(2), 3(2)(e); Art. II(f)' },
  open: null,
};

/** Grant obligations: months to commission, years of operation. */
export const RO_GRANT_RULES = {
  commissionWithinMonths: null,
  operateAtLeastYears: null,
  sourceIds: ['SRC-RO-03'],
  locator: { document: 'PDF', pdfPage: [10, 33], printedPage: [10, 33], table: null, row: null, column: null, clause: 'p. 10 final paragraph before §1.2; p. 33 §3.1.2' },
  open: OPEN('reuse + official comparison', 'Both obligations are read from the third-party guide copy. They stay null until the annex is compared and the basis recorded; neither becomes a promised commissioning date.'),
};

/** One verified announcement of an optimiser floor. Terms are not disclosed. */
export const RO_FLOOR_ANNOUNCEMENT = {
  verifiedCount: null,
  levelDisclosed: false,
  tenorYears: null,
  securedShare: null,
  priceUplift: null,
  sourceIds: ['SRC-RO-17'],
  locator: { document: 'repository record of the announcement', pdfPage: null, printedPage: null, table: null, row: null, column: null, clause: 'opening paragraphs' },
  open: OPEN('reuse', 'One announcement was examined. It establishes neither exclusivity nor a national count, and it supplies no level, tenor or target-asset term. A numerical label needs a source-use record, so the page falls back to the qualitative sentence.'),
};

/**
 * Six history nodes. Dates are sourced events and may be printed; the causal
 * reading stays proposed. Event and first-delivery dates are kept apart.
 */
export const RO_HISTORY = [
  {
    id: 'H-RO-01', dates: ['2005-06-30'], kind: 'event', precision: 'day',
    event: 'A two-sided day-ahead auction under new market rules',
    sourceIds: ['SRC-RO-08'],
    locators: [{ document: 'PDF', pdfPage: [4, 19], printedPage: null, clause: 'day-ahead market launch' }],
  },
  {
    id: 'H-RO-02', dates: ['2014-11'], kind: 'event', precision: 'month',
    event: 'Coupled with the Czech, Slovak and Hungarian markets; launch 19 November for delivery 20 November',
    sourceIds: ['SRC-RO-09'],
    locators: [{ document: 'web notice', pdfPage: null, printedPage: null, clause: 'launch announcement and success notice' }],
  },
  {
    id: 'H-RO-03', dates: ['2021-06-17', '2021-10-27'], kind: 'event', precision: 'day',
    event: 'Into the single day-ahead coupling, then the Bulgarian border; first delivery 28 October 2021',
    sourceIds: ['SRC-RO-10', 'SRC-RO-11'],
    locators: [
      { document: 'PDF', pdfPage: 1, printedPage: null, clause: 'go-live 17 June 2021' },
      { document: 'web notice', pdfPage: null, printedPage: null, clause: 'border into SDAC, 27 October 2021' },
    ],
  },
  {
    id: 'H-RO-04', dates: ['2025-07-08'], kind: 'event', precision: 'day',
    event: 'Stored-and-reinjected energy stops paying network tariffs twice',
    sourceIds: ['SRC-RO-12'],
    locators: [{ document: 'press release', pdfPage: null, printedPage: null, clause: 'announcement; the order number and in-force date are reported, not opened' }],
  },
  {
    id: 'H-RO-05', dates: ['2026'], kind: 'event', precision: 'year',
    event: 'Connection capacity of the threshold and above allocated by auction; sessions from 30 October 2026',
    sourceIds: ['SRC-RO-13a', 'SRC-RO-13b'],
    locators: [{ document: 'orders', pdfPage: [6, 2], printedPage: [7, 14], clause: 'Annex 1; Art. II(f)' }],
  },
  {
    id: 'H-RO-06', dates: ['2026-03-06'], kind: 'event', precision: 'day',
    event: 'State aid scheme approved; the guide follows on 14 August and the first call has no verified outcome',
    sourceIds: ['SRC-RO-07', 'SRC-RO-05', 'SRC-RO-03', 'SRC-RO-06', 'SRC-RO-04'],
    locators: [{ document: 'approval and programme records', pdfPage: null, printedPage: null, clause: 'approval 6 March 2026; confirmation 11 March; guide 14 August; disbursement release 2 July' }],
  },
];

/** A record set is one object so a caller cannot pick a value out of context. */
export const RO_STORY_RECORDS = {
  meta: RO_STORY_META,
  sources: RO_STORY_SOURCES,
  fleet: RO_FLEET,
  plan2030: RO_PLAN_2030,
  bgEnd2025: RO_BG_END_2025,
  connection: RO_CONNECTION,
  grantRules: RO_GRANT_RULES,
  floorAnnouncement: RO_FLOOR_ANNOUNCEMENT,
  history: RO_HISTORY,
};

/** The eligible observed fleet points, in date order: what a chart may draw. */
export function eligibleFleetPoints(){
  return RO_FLEET.observations
    .filter(o => o.date && Number.isFinite(o.mw))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** The latest eligible point, the one a "counted … on …" sentence may use. */
export function latestFleetPoint(){
  const points = eligibleFleetPoints();
  return points.length ? points[points.length - 1] : null;
}
