/* ---------------------------------------------------------------------------
   Poland story evidence: the capacity-auction record set, fixed vintage,
   analyst-entered (pl-build-evidence.md §3). Nothing here refreshes, so there
   is no dataset kind, no scheduled job and no edit to
   src/governance/datasets.js — that catalogue keeps capacity results out of
   automation on purpose.

   WHAT MAY BE PUBLISHED. Every stored field is listed in §3.1 and carries its
   own locator: the document, the printed page, the notice point or the
   regulation item, the unit, and the arithmetic where a value is calculated.
   The eleven contract values are CALC-PL-01: price × factor / 100, decimal
   half-up to 0.01, each reproduced beside its row.

   WHAT IS WITHHELD. A null is a gap, never a zero. `P.successor` holds the
   boundary year and nothing else; the grant's three project-level fields are
   null because no agreement, payment or sale consent was supplied;
   `additionalEndsOn` is null because no general terminal date for the quarterly
   product was established, and that null is the source of the pl-06 scope
   correction rather than a missing 2028 value.

   THE QUANTITATIVE LAYER IS STILL GATED. `chart.quantitativeReady` is false.
   Section 5 of the decision record retires it only when the analyst accepts the
   quantitative rendering at G-2, so this module registers the records and the
   page keeps the Example form until that acceptance. A data PR that registered
   the rows is not the acceptance.

   RIGHTS. Each source records its disposition, not its publisher: normative
   acts and official notices rest on Copyright Act art. 4 (SRC-PL-24), the PSE
   rules stay link-only, and the storage report publishes extracted facts and an
   original drawing only. B-PL-RIGHTS closes at G-2, which is why the status is
   `pending-review` on the report while its numbers are already registered.
   --------------------------------------------------------------------------- */

/** Authoring identity for the whole set: one review vintage, two check dates. */
export const PL_STORY_META = {
  id: 'pl-capacity-auctions',
  marketId: 'pl',
  kind: 'fixed-vintage-table',
  entry: 'analyst-entered',
  refresh: 'review-after-auction-or-legal-change',
  bearsOn: [],
  schemaVersion: 1,
  reviewedOn: '2026-11-02',
  /* The complete absence-of-successor check the script was signed against.
     Opening legal pages today does not silently refresh it. */
  legalCheckedOn: '2026-10-31',
  units: {
    price: 'PLN/kW/year',
    factor: '%',
    obligation: 'MW-of-capacity-obligation',
  },
};

/* The source envelope. Locators are one-based printed/PDF pages; an HTML page
   has no page number and names its heading or table instead. `checkedOn` is the
   actual check, kept apart from `publishedOn`. */
export const PL_STORY_SOURCES = {
  'SRC-PL-01': {
    publisher: 'Sejm',
    title: 'Ustawa z dnia 8 grudnia 2017 r. o rynku mocy (Capacity Market Act), consolidated text',
    url: 'https://eli.gov.pl/api/acts/DU/2026/1400/text/T/D20261400L.pdf',
    publishedOn: '2026-10-02',
    effectiveOn: '2018-01-18',
    coverage: 'arts. 2(1), 25(4)-(5), 29(3)-(4), 46(1)(2), 61(3); the statutory terms and dates this set stores',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: {
      document: 'Dz.U. 2026 poz. 1400, consolidated text',
      printedPage: [3, 17, 19, 27, 37],
      table: null,
      row: null,
      column: null,
      clause: 'art. 2(1)(1), (3a); art. 25(4)(1)-(5); art. 29(3)(7), 29(4); art. 46(1)(2); art. 61(3)',
    },
    reuse: {
      status: 'official-act-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: Dziennik Ustaw; URE',
      constraints: 'A normative act is outside copyright under art. 4. Facts are restated with their article; the act itself is not reproduced or hosted.',
    },
  },
  'SRC-PL-02': {
    publisher: 'European Commission',
    title: 'Decision C(2018) 601 final, State aid SA.46100 (2017/N), Planned Polish capacity mechanism',
    url: 'https://ec.europa.eu/competition/state_aid/cases/272253/272253_1977790_162_2.pdf',
    publishedOn: '2018-02-07',
    effectiveOn: null,
    coverage: 'recitals (4)-(8), (43), (49)-(50), (109)-(110), (140) and the conclusion',
    language: 'en',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: {
      document: 'Commission decision, PDF',
      printedPage: [2],
      table: null,
      row: null,
      column: null,
      clause: 'recital (6), p. 2: the 2015 supply limits; recitals (43), (49)-(50), (109)-(110)',
    },
    reuse: {
      status: 'official-document-attribution',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Source: European Commission, C(2018) 601 final',
      constraints: 'Restated with attribution; no table or figure is copied. The event date is the Commission\u2019s record, the causal reading stays interpretation.',
    },
  },
  'SRC-PL-03': {
    publisher: 'European Commission',
    title: 'Decision (EU) 2026/341 granting Poland a derogation under art. 22(4)(b) of Regulation (EU) 2019/943',
    url: 'https://data.europa.eu/eli/dec/2026/341/oj',
    publishedOn: '2026-02-24',
    effectiveOn: '2025-08-11',
    coverage: 'arts. 1-3; recitals (1)-(8), (27)-(28), (73)',
    language: 'en',
    access: 'opened through the Polish-language OJ reproduction; EUR-Lex form not reopened',
    checkedOn: '2026-11-02',
    locator: {
      document: 'OJ L, Decision (EU) 2026/341',
      printedPage: null,
      table: null,
      row: null,
      column: null,
      clause: 'art. 3 and recital (73): the one-year supplementary auctions and their end date',
    },
    reuse: {
      status: 'official-document-attribution',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Source: European Commission, Decision (EU) 2026/341',
      constraints: 'The 2028 end date belongs to the supplementary product. No terminal date for the quarterly additional auctions is taken from this decision.',
    },
  },
  'SRC-PL-05': {
    publisher: 'URE',
    title: 'Final results of the main auctions for 2021-2025 delivery (Informacje nr 99/2018, 103/2018, 10/2019, 106/2019, 2/2021)',
    url: 'https://www.ure.gov.pl/pl/energia-elektryczna/rynek-mocy/informcjepure',
    publishedOn: null,
    effectiveOn: null,
    coverage: 'five notices, each point (c): closing round and domestic clearing price',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: {
      document: 'five URE notices, index page',
      printedPage: [13, 10, 9, 9, 6],
      table: null,
      row: null,
      column: null,
      clause: 'point (c) of each notice; p. 1 supplies delivery year, auction date, notice number and notice date',
    },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: URE, informacje o ostatecznych wynikach aukcji',
      constraints: 'Official documents, restated with their notice number and point. No notice table or PDF is republished; no participant name is copied.',
    },
  },
  'SRC-PL-06': {
    publisher: 'URE',
    title: 'Informacja nr 2/2022, final results of the main auction for 2026 delivery',
    url: 'https://www.ure.gov.pl/download/9/12529/Ostatecznewynikiaukcjiglownejnarokdostaw2026.pdf',
    publishedOn: '2022-01-07',
    effectiveOn: null,
    coverage: 'auction of 16 December 2021, points (b)-(e), (l)',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'URE notice 2/2022, PDF', printedPage: [12], table: null, row: null, column: null, clause: 'point (c)' },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: URE, informacja nr 2/2022',
      constraints: 'Restated with its notice number and point; no table or notice is republished.',
    },
  },
  'SRC-PL-07': {
    publisher: 'URE',
    title: 'Informacje nr 2/2023 and nr 2/2024, final results of the main auctions for 2027 and 2028 delivery',
    url: 'https://www.ure.gov.pl/download/9/13461/20230109INFOPUREwynikiaukcjiglownejnarokdostaw2027.pdf',
    publishedOn: null,
    effectiveOn: null,
    coverage: 'auctions of 15 December 2022 and 14 December 2023, point (c) and the unit list',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'two URE notices, PDFs', printedPage: [9, 13], table: null, row: null, column: null, clause: 'point (c) of each notice; the 2028 unit list for the term cross-check' },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: URE, informacje nr 2/2023 i 2/2024',
      constraints: 'Restated with notice number and point. The unit list is used only as a count and a term cross-check, never copied.',
    },
  },
  'SRC-PL-08': {
    publisher: 'URE',
    title: 'Informacja nr 02/2025, final results of the main auction for 2029 delivery',
    url: 'https://www.ure.gov.pl/download/9/15112/Ostateczneogloszeniewynikowaukcjiglownejna2029.pdf',
    publishedOn: '2025-01-03',
    effectiveOn: null,
    coverage: 'auction of 12 December 2024, points (b)-(f), (m)-(n) and the unit list',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'URE notice 02/2025, PDF', printedPage: [18], table: null, row: null, column: null, clause: 'point (c)' },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: URE, informacja nr 02/2025',
      constraints: 'Restated with its notice number and point; nothing is republished.',
    },
  },
  'SRC-PL-09': {
    publisher: 'URE',
    title: 'Informacja nr 44/2025, final results of the catch-up auction for 2029 delivery',
    url: 'https://www.ure.gov.pl/download/9/15656/Ogloszenieostatecznychwynikowaukcjidogrywkowejna2029.pdf',
    publishedOn: '2025-08-08',
    effectiveOn: null,
    coverage: 'auction of 17 July 2025, points (c), (e)-(h)',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'URE notice 44/2025, PDF', printedPage: [5], table: null, row: null, column: null, clause: 'point (c)' },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: URE, informacja nr 44/2025',
      constraints: 'A separate product at the same delivery year; restated with its own notice number, never merged with the main auction.',
    },
  },
  'SRC-PL-10': {
    publisher: 'Minister of Climate and Environment',
    title: 'Auction-parameter regulations for 2021-2027 delivery (battery factor)',
    url: 'https://eli.gov.pl/api/acts/DU/2022/1690/text/O/D20221690.pdf',
    publishedOn: null,
    effectiveOn: null,
    coverage: 'Dz.U. 2018/1632, 2019/1457, 2020/1355, 2021/1480, 2022/1690, chapter 1 factor list',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: {
      document: 'five Dziennik Ustaw regulations',
      printedPage: [3, 2, 2, 2, 2],
      table: null,
      row: null,
      column: null,
      clause: 'chapter 1 factor list: the 2018 regulation\u2019s battery row is item 8, contrary to the register\u2019s generic "same item"; later regulations item 9',
    },
    reuse: {
      status: 'official-act-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: Dziennik Ustaw',
      constraints: 'Normative acts outside copyright. Each factor is restated with its Dz.U. number and item; no annex is reproduced.',
    },
  },
  'SRC-PL-11': {
    publisher: 'Minister of Climate and Environment',
    title: 'Auction-parameter regulations for 2028, 2029 and the 2029 catch-up auction (battery factor)',
    url: 'https://api.sejm.gov.pl/eli/acts/DU/2024/1154/text.pdf',
    publishedOn: null,
    effectiveOn: null,
    coverage: 'Dz.U. 2023/1561, 2024/1154 chapter 1 item 9; Dz.U. 2025/571 § 9 item 9',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'three Dziennik Ustaw regulations', printedPage: [2, 2, 2], table: null, row: null, column: null, clause: 'chapter 1 item 9; the catch-up regulation\u2019s § 9 item 9' },
    reuse: {
      status: 'official-act-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: Dziennik Ustaw',
      constraints: 'Normative acts outside copyright. The 2029 main auction and the catch-up auction keep separate factors and separate items.',
    },
  },
  'SRC-PL-12': {
    publisher: 'Minister of Energy',
    title: 'Auction-parameter regulation for 2030 delivery and the additional auctions for 2027',
    url: 'https://api.sejm.gov.pl/eli/acts/DU/2025/1066/text.pdf',
    publishedOn: '2025-08-05',
    effectiveOn: null,
    coverage: 'Dz.U. 2025/1066 §§ 1-2, 8, 10 item 9',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'Dz.U. 2025 poz. 1066', printedPage: [2], table: null, row: null, column: null, clause: '§ 10 item 9: 13.39 %, pumped storage grouped with batteries' },
    reuse: {
      status: 'official-act-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: Dziennik Ustaw',
      constraints: 'This row groups pumped storage with batteries; the factor is restated as decided, not as a battery-only observation.',
    },
  },
  'SRC-PL-15': {
    publisher: 'PSE',
    title: 'Regulamin Rynku Mocy (capacity market rules), update card RRM/Z/16/2026',
    url: 'https://www.pse.pl/documents/20182/51490/RRM_Z_16_2026.pdf',
    publishedOn: null,
    effectiveOn: '2026-11-01',
    coverage: 'pkt 6.3.2.5 and 7.4.2.1(8): the four-hour certification test',
    language: 'pl',
    access: 'opened; PSE site terms not checked',
    checkedOn: '2026-11-02',
    locator: { document: 'RRM, PDF', printedPage: [35, 43], table: null, row: null, column: null, clause: 'pkt 6.3.2.5 and 7.4.2.1(8)' },
    reuse: {
      status: 'limited-factual-summary',
      permitsNumericPublication: true,
      basisUrl: null,
      basisLocator: 'pkt 7.4.2.1(8), p. 43',
      attribution: 'Źródło: PSE, Regulamin Rynku Mocy',
      constraints: 'Link only: the rule is restated as fact with its clause and the rules PDF is neither copied nor hosted. The version is the one the URE approval of 9 September made effective on 1 November; the PDF\u2019s earlier preparation date is not its effective date. PSE site terms remain unchecked, which is why this stays link-only.',
    },
  },
  'SRC-PL-16': {
    publisher: 'URE',
    title: 'Magazynowanie energii elektrycznej - Raport 2024',
    url: 'https://www.ure.gov.pl/download/9/14751/Raportmagazynyenergii.pdf',
    publishedOn: '2024-07-08',
    effectiveOn: null,
    coverage: 'Figure 1 on printed/PDF p. 6; the first paragraph of p. 7',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: {
      document: 'URE storage report 2024, PDF',
      printedPage: [6, 7],
      table: null,
      row: null,
      column: null,
      clause: 'Figure 1, electrochemical-storage series by delivery year (p. 6); first paragraph (p. 7): 33 units and 1,734 MW from the 2023 auction',
    },
    reuse: {
      status: 'pending-review',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: URE, Raport 2024 - magazynowanie energii elektrycznej',
      constraints: 'B-PL-RIGHTS: official material on the art. 4 basis, to be confirmed at the build\u2019s rights review. Extracted facts and an original drawing only; no report image, figure or table is republished. The status stays pending-review until the analyst records the source-by-source disposition at G-2.',
    },
  },
  'SRC-PL-17': {
    publisher: 'NFOŚiGW, Modernisation Fund portal',
    title: 'Programme page for electricity storage with the 8 December 2025 results notice and the 12 December 2025 update',
    url: 'https://www.gov.pl/web/funduszmodernizacyjny/magazyny-energii-elektrycznej-i-zwiazana-z-nimi-infrastruktura-dla-poprawy-stabilnosci-polskiej-sieci-elektroenergetycznej2',
    publishedOn: '2025-12-12',
    effectiveOn: null,
    coverage: 'publication dates of the ranking list and its update',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'programme page, HTML', printedPage: null, table: null, row: null, column: null, clause: 'headings 08.12.2025 and 12.12.2025 and the updated-list link' },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: NFOŚiGW, Fundusz Modernizacyjny',
      constraints: 'Dates only. The file\u2019s internal preparation date is not its publication date, and a list place is not a commitment.',
    },
  },
  'SRC-PL-18': {
    publisher: 'NFOŚiGW',
    title: 'Ranking lists, original and updated',
    url: 'https://www.gov.pl/attachment/20702c51-561a-418d-898e-e84139263bfb',
    publishedOn: '2025-12-12',
    effectiveOn: null,
    coverage: 'printed/PDF pp. 1-9, numbered rows 1-181',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: {
      document: 'updated ranking list, PDF',
      printedPage: [1, 9],
      table: 'numbered ranking rows 1-181',
      row: 'rows with Forma dofinansowania = Dotacja and a positive recommended amount',
      column: 'Rekomendowane dofinansowanie (zł); Koszt całkowity (zł)',
      clause: null,
    },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: NFOŚiGW, lista rankingowa',
      constraints: 'Counts and sums computed from the rows; no recipient name, project name or contract identifier is copied.',
    },
  },
  'SRC-PL-19': {
    publisher: 'Minister of Climate and Environment',
    title: 'Regulation on NFOŚiGW state aid for electricity storage',
    url: 'https://api.sejm.gov.pl/eli/acts/DU/2025/280/text.pdf',
    publishedOn: '2025-03-05',
    effectiveOn: '2025-03-08',
    coverage: '§§ 4-7, 9-11, 13: thresholds, deadlines, delay bands, repayment',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'Dz.U. 2025 poz. 280', printedPage: [2, 3], table: null, row: null, column: null, clause: '§ 6(1)-(3); § 7(2); § 9(2); § 13' },
    reuse: {
      status: 'official-act-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: Dziennik Ustaw',
      constraints: 'The delay bands are statutory and carry a force-majeure qualification; they are not a straight-line monthly cut.',
    },
  },
  'SRC-PL-21': {
    publisher: 'Modernisation Fund portal',
    title: 'Signed agreements, storage-programme table',
    url: 'https://www.gov.pl/web/funduszmodernizacyjny/zawarte-umowy',
    publishedOn: null,
    effectiveOn: null,
    coverage: 'the storage programme\u2019s table of signed grant agreements',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'signed-agreements page, HTML', printedPage: null, table: 'storage programme, rows with Forma dofinansowania = Dotacja', row: null, column: null, clause: null },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: NFOŚiGW, zawarte umowy',
      constraints: 'A count of distinct grant-agreement rows, excluding the nine loan rows and later programmes\u2019 tables. No recipient name or contract identifier is retained.',
    },
  },
  'SRC-PL-26': {
    publisher: 'URE',
    title: 'Informacja nr 1/2026, final results of the main auction for 2030 delivery',
    url: 'https://www.ure.gov.pl/download/9/15928/InformacjaPrezesaUrzeduRegulacjiEnergetykiNr12026.pdf',
    publishedOn: '2026-01-02',
    effectiveOn: null,
    coverage: 'auction of 11 December 2025, points (b)-(g) and the unit list',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'URE notice 1/2026, PDF', printedPage: [12], table: null, row: null, column: null, clause: 'point (c)' },
    reuse: {
      status: 'official-document-factual-summary',
      permitsNumericPublication: true,
      basisUrl: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
      basisLocator: 'Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)',
      attribution: 'Źródło: URE, informacja nr 1/2026',
      constraints: 'The last scheduled main auction. Restated with its notice number and point; the unit list is not used to infer a technology split.',
    },
  },
  'SRC-PL-24': {
    publisher: 'Sejm',
    title: 'Ustawa o prawie autorskim i prawach pokrewnych (Copyright Act), consolidated text',
    url: 'https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf',
    publishedOn: '2025-01-08',
    effectiveOn: null,
    coverage: 'art. 4: official acts, documents and materials are outside copyright',
    language: 'pl',
    access: 'opened',
    checkedOn: '2026-11-02',
    locator: { document: 'Dz.U. 2025 poz. 24', printedPage: [3], table: null, row: null, column: null, clause: 'art. 4' },
    reuse: {
      status: 'legal-basis',
      permitsNumericPublication: false,
      basisUrl: null,
      basisLocator: 'art. 4',
      attribution: null,
      constraints: 'The basis other sources cite for reuse; it publishes no figure of its own.',
    },
  },
};

/** Eleven notices, the row key being (kind, deliveryYear). */
const AUCTION_ROWS = [
  {
    id: 'main-2021', kind: 'main', deliveryYear: 2021,
    auctionOn: '2018-11-15', noticeId: '99/2018', noticeOn: '2018-11-27', round: 5,
    pricePLNPerKWYear: 240.32, batteryFactorPct: 96.11,
    contractPLNPerCertifiedKWYear: 230.97,
    priceSource: 'SRC-PL-05', factorSource: 'SRC-PL-10',
    priceLocator: { document: 'Informacja nr 99/2018', printedPage: [13], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2018 poz. 1632', printedPage: [3], clause: '§ 10 item 8' },
    arithmetic: '240.32 x 96.11 / 100 = 230.971552, decimal half-up 230.97',
  },
  {
    id: 'main-2022', kind: 'main', deliveryYear: 2022,
    auctionOn: '2018-12-05', noticeId: '103/2018', noticeOn: '2018-12-14', round: 7,
    pricePLNPerKWYear: 198.00, batteryFactorPct: 96.11,
    contractPLNPerCertifiedKWYear: 190.30,
    priceSource: 'SRC-PL-05', factorSource: 'SRC-PL-10',
    priceLocator: { document: 'Informacja nr 103/2018', printedPage: [10], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2018 poz. 1632', printedPage: [3], clause: '§ 10 item 8' },
    arithmetic: '198.00 x 96.11 / 100 = 190.297800, decimal half-up 190.30',
  },
  {
    id: 'main-2023', kind: 'main', deliveryYear: 2023,
    auctionOn: '2018-12-21', noticeId: '10/2019', noticeOn: '2019-01-14', round: 8,
    pricePLNPerKWYear: 202.99, batteryFactorPct: 96.11,
    contractPLNPerCertifiedKWYear: 195.09,
    priceSource: 'SRC-PL-05', factorSource: 'SRC-PL-10',
    priceLocator: { document: 'Informacja nr 10/2019', printedPage: [9], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2018 poz. 1632', printedPage: [3], clause: '§ 10 item 8' },
    arithmetic: '202.99 x 96.11 / 100 = 195.093689, decimal half-up 195.09',
  },
  {
    id: 'main-2024', kind: 'main', deliveryYear: 2024,
    auctionOn: '2019-12-06', noticeId: '106/2019', noticeOn: '2019-12-30', round: 5,
    pricePLNPerKWYear: 259.87, batteryFactorPct: 96.11,
    contractPLNPerCertifiedKWYear: 249.76,
    priceSource: 'SRC-PL-05', factorSource: 'SRC-PL-10',
    priceLocator: { document: 'Informacja nr 106/2019', printedPage: [9], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2019 poz. 1457', printedPage: [2], clause: '§ 10 item 9' },
    arithmetic: '259.87 x 96.11 / 100 = 249.761057, decimal half-up 249.76',
  },
  {
    id: 'main-2025', kind: 'main', deliveryYear: 2025,
    auctionOn: '2020-12-14', noticeId: '2/2021', noticeOn: '2021-01-05', round: 7,
    pricePLNPerKWYear: 172.85, batteryFactorPct: 96.11,
    contractPLNPerCertifiedKWYear: 166.13,
    priceSource: 'SRC-PL-05', factorSource: 'SRC-PL-10',
    priceLocator: { document: 'Informacja nr 2/2021', printedPage: [6], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2020 poz. 1355', printedPage: [2], clause: '§ 10 item 9' },
    arithmetic: '172.85 x 96.11 / 100 = 166.126135, decimal half-up 166.13',
  },
  {
    id: 'main-2026', kind: 'main', deliveryYear: 2026,
    auctionOn: '2021-12-16', noticeId: '2/2022', noticeOn: '2022-01-07', round: 1,
    pricePLNPerKWYear: 400.39, batteryFactorPct: 96.11,
    contractPLNPerCertifiedKWYear: 384.81,
    priceSource: 'SRC-PL-06', factorSource: 'SRC-PL-10',
    priceLocator: { document: 'Informacja nr 2/2022', printedPage: [12], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2021 poz. 1480', printedPage: [2], clause: '§ 10 item 9' },
    arithmetic: '400.39 x 96.11 / 100 = 384.814829, decimal half-up 384.81',
  },
  {
    id: 'main-2027', kind: 'main', deliveryYear: 2027,
    auctionOn: '2022-12-15', noticeId: '2/2023', noticeOn: '2023-01-09', round: 1,
    pricePLNPerKWYear: 406.35, batteryFactorPct: 95.00,
    contractPLNPerCertifiedKWYear: 386.03,
    batteryObligationMW: 165, batteryUnits: null, technologyStatus: 'reported', technologySource: 'SRC-PL-16',
    priceSource: 'SRC-PL-07', factorSource: 'SRC-PL-10',
    priceLocator: { document: 'Informacja nr 2/2023', printedPage: [9], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2022 poz. 1690', printedPage: [2], clause: '§ 10 item 9' },
    technologyLocator: { document: 'URE storage report 2024', printedPage: [6], clause: 'Figure 1, electrochemical battery segment at delivery 2027' },
    arithmetic: '406.35 x 95.00 / 100 = 386.032500, decimal half-up 386.03',
  },
  {
    id: 'main-2028', kind: 'main', deliveryYear: 2028,
    auctionOn: '2023-12-14', noticeId: '2/2024', noticeOn: '2024-01-05', round: 6,
    pricePLNPerKWYear: 244.90, batteryFactorPct: 95.00,
    contractPLNPerCertifiedKWYear: 232.66,
    batteryObligationMW: 1734, batteryUnits: 33, technologyStatus: 'reported', technologySource: 'SRC-PL-16',
    priceSource: 'SRC-PL-07', factorSource: 'SRC-PL-11',
    priceLocator: { document: 'Informacja nr 2/2024', printedPage: [13], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2023 poz. 1561', printedPage: [2], clause: '§ 10 item 9' },
    technologyLocator: { document: 'URE storage report 2024', printedPage: [7], clause: 'first paragraph: 33 electrochemical units and 1,734 MW from the 2023 auction' },
    arithmetic: '244.90 x 95.00 / 100 = 232.655000, decimal half-up 232.66',
  },
  {
    id: 'main-2029', kind: 'main', deliveryYear: 2029,
    auctionOn: '2024-12-12', noticeId: '02/2025', noticeOn: '2025-01-03', round: 7,
    pricePLNPerKWYear: 264.90, batteryFactorPct: 61.30,
    contractPLNPerCertifiedKWYear: 162.38,
    batteryObligationMW: null, batteryUnits: null, technologyStatus: 'pending', technologySource: null,
    priceSource: 'SRC-PL-08', factorSource: 'SRC-PL-11',
    priceLocator: { document: 'Informacja nr 02/2025', printedPage: [18], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2024 poz. 1154', printedPage: [2], clause: '§ 10 item 9' },
    arithmetic: '264.90 x 61.30 / 100 = 162.383700, decimal half-up 162.38',
  },
  {
    id: 'catch-up-2029', kind: 'catch-up', deliveryYear: 2029,
    auctionOn: '2025-07-17', noticeId: '44/2025', noticeOn: '2025-08-08', round: 1,
    pricePLNPerKWYear: 534.09, batteryFactorPct: 12.33,
    contractPLNPerCertifiedKWYear: 65.85,
    batteryObligationMW: null, batteryUnits: null, technologyStatus: 'pending', technologySource: null,
    priceSource: 'SRC-PL-09', factorSource: 'SRC-PL-11',
    priceLocator: { document: 'Informacja nr 44/2025', printedPage: [5], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2025 poz. 571', printedPage: [2], clause: '§ 9 item 9' },
    arithmetic: '534.09 x 12.33 / 100 = 65.853297, decimal half-up 65.85',
  },
  {
    id: 'main-2030', kind: 'main', deliveryYear: 2030,
    auctionOn: '2025-12-11', noticeId: '1/2026', noticeOn: '2026-01-02', round: 2,
    pricePLNPerKWYear: 465.02, batteryFactorPct: 13.39,
    contractPLNPerCertifiedKWYear: 62.27,
    batteryObligationMW: null, batteryUnits: null, technologyStatus: 'pending', technologySource: null,
    priceSource: 'SRC-PL-26', factorSource: 'SRC-PL-12',
    priceLocator: { document: 'Informacja nr 1/2026', printedPage: [12], clause: 'point (c)' },
    factorLocator: { document: 'Dz.U. 2025 poz. 1066', printedPage: [2], clause: '§ 10 item 9' },
    arithmetic: '465.02 x 13.39 / 100 = 62.266178, decimal half-up 62.27',
  },
];

/* The notices for 2021-2026 delivery report no battery split at all: the storage
   report's Figure 1 shows pumped storage for those vintages. */
const NONE_REPORTED = new Set(['main-2021', 'main-2022', 'main-2023', 'main-2024', 'main-2025', 'main-2026']);

export const PL_AUCTIONS = AUCTION_ROWS.map(row => (NONE_REPORTED.has(row.id)
  ? {
    ...row,
    batteryObligationMW: null,
    batteryUnits: null,
    technologyStatus: 'none-reported',
    technologySource: 'SRC-PL-16',
    technologyLocator: {
      document: 'URE storage report 2024',
      printedPage: [6],
      clause: 'Figure 1: pumped storage only for delivery 2021-2026; missing is not an observed zero',
    },
  }
  : row));

/**
 * The rules the page states as rules. Maxima are what a certificate allows,
 * not guaranteed project terms; 7 and 17 are 5 + 2 and 15 + 2, conditional on
 * the extension criteria.
 */
export const PL_RULES = {
  existingMaxYears: 1,
  modernisedBaseYears: 5,
  newBaseYears: 15,
  lowEmissionExtraYears: 2,
  modernisedMaxYears: 7,
  newMaxYears: 17,
  certificationHours: 4,
  milestoneDeliveryYear: 3,
  additionalPeriodMonths: 3,
  supplementaryPeriodYears: 1,
  supplementaryEndsOn: '2028-12-31',
  additionalEndsOn: null,
  capacitySettlementMonths: 1,
  sourceIds: ['SRC-PL-01', 'SRC-PL-15', 'SRC-PL-03'],
  locator: {
    document: 'Capacity Market Act, RRM, derogation decision',
    printedPage: [17, 27, 37, 35, 43],
    clause: 'art. 25(4)(1)-(5): 1, 5, 15 and the 2-year extension; art. 46(1)(2): third delivery year; art. 61(3): monthly settlement; RRM pkt 6.3.2.5 and 7.4.2.1(8): four uninterrupted hours; art. 2(1)(3a)(d) and 29(4): supplementary to 31 Dec 2028, with no general terminal date for the quarterly product',
  },
  open: null,
};

/** History: the two years the script prints, extracted, never derived. */
export const PL_HISTORY = {
  h01Year: 2015,
  h02ActOn: '2017-12-08',
  sourceIds: ['SRC-PL-02', 'SRC-PL-01'],
  locator: {
    document: 'Commission decision C(2018) 601; Capacity Market Act title',
    printedPage: [2, 3],
    clause: 'recital (6), p. 2: the 2015 supply limits; the act\u2019s attached title: adoption 8 December 2017',
  },
  open: null,
};

/* The grant cohort. The two programme aggregates are counted from rows; the
   three project-level fields were never supplied, so they are null, not zero. */
const OPEN = (gate, note) => ({ gate, note });

export const PL_GRANT = {
  listFirstOn: '2025-12-08',
  listUpdatedOn: '2025-12-12',
  recommendedCount: 172,
  recommendedPLN: '3734999999.99',
  correspondingCostPLN: '10003742317.00',
  recommendedSharePct: 37.336027674792,
  signedGrants: 170,
  signedCheckedOn: '2026-11-02',
  minMW: 2,
  minMWh: 4,
  completionMonths: 36,
  latestAwardOn: '2025-12-31',
  costsEligibleUntil: '2028-12-31',
  delayBandStartMonths: 3,
  delayBandEndMonths: 6,
  delayPctPerMonth: 5,
  laterDelayPctPerMonth: 10,
  individualAwardPLN: null,
  cashReceivedPLN: null,
  transferVerified: null,
  sourceIds: ['SRC-PL-17', 'SRC-PL-18', 'SRC-PL-21', 'SRC-PL-19'],
  locator: {
    document: 'programme page; updated ranking list; signed-agreements table; grant regulation',
    printedPage: [1, 9, 2, 3],
    table: 'ranking rows 1-181; storage-programme agreement rows',
    clause: 'ranked count and sums from rows with Dotacja and a positive amount; § 6(1)-(3), § 7(2), § 9(2), § 13 of the grant regulation',
  },
  open: OPEN('project documents', 'No target agreement, payment evidence or sale consent was supplied. The programme aggregates establish none of the three project-level values, and null here means unverified, not zero cash and not a proven prohibition.'),
};

/** The successor: a boundary, never a forecast observation. */
export const PL_SUCCESSOR = {
  firstUnscheduledDeliveryYear: 2031,
  legislatedOn: null,
  auctionOn: null,
  pricePLNPerKWYear: null,
  batteryFactorPct: null,
  batteryObligationMW: null,
  batteryUnits: null,
  sourceIds: ['SRC-PL-01'],
  locator: { document: 'Capacity Market Act', printedPage: [19], clause: 'art. 29(3)(7): the listed main-auction schedule ends at delivery 2030' },
  open: OPEN('legislation', '2030 + 1 marks the boundary of the scheduled list, not an announced auction. Absence is dated to the legal check, not to today.'),
};

/** Chart-PL-AUCTIONS: the records above, and the mode they may be drawn in. */
export const PL_CHART = {
  id: 'Chart-PL-AUCTIONS',
  quantitativeReady: false,
  referenceKW: 1,
  fallback: ['Example: auction price × correction factor', '示例：拍卖价格×修正系数'],
  open: OPEN('G-2 acceptance', 'Section 5 retires the Example only when the records exist, the eleven joins reproduce, the locators resolve, the rights disposition is recorded, the numeric copy binds, both Rule 11 rows still match and the analyst accepts the quantitative rendering at G-2.'),
};

/** One object, so a caller cannot pick a value out of its provenance. */
export const PL_STORY_EVIDENCE = {
  meta: PL_STORY_META,
  sources: PL_STORY_SOURCES,
  auctions: PL_AUCTIONS,
  rules: PL_RULES,
  history: PL_HISTORY,
  grant: PL_GRANT,
  successor: PL_SUCCESSOR,
  chart: PL_CHART,
};

/** The market-local catalogue the decision record names. Nothing else reads it. */
export const PL_STORY_DATASETS = { [PL_STORY_META.id]: PL_STORY_EVIDENCE };

/** The rows a chart may plot, in delivery order: main first, catch-up beside it. */
export function auctionSeries(){
  return [...PL_AUCTIONS].sort((a, b) => a.deliveryYear - b.deliveryYear || (a.kind === 'main' ? -1 : 1));
}

/** Delivery years present in the records, for the shared x axis. */
export function deliveryYears(){
  return [...new Set(PL_AUCTIONS.map(row => row.deliveryYear))].sort((a, b) => a - b);
}
