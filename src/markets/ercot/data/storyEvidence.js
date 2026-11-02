/* ---------------------------------------------------------------------------
   ERCOT story evidence: fixed-vintage, analyst-entered records.
   Authority: ercot-build-evidence.md section 3. No scheduled feed, model input
   or live observation is registered here.

   Eligible values are the reviewed facts below. Gated values are null, never
   zero. Candidate operator-fleet and ancillary-service price numbers are not
   carried in this public module, even in hidden fields or Examples. The two
   chart gates are independent. Every datum retains its source, exact locator,
   measure, precision and calculation/review state.
   --------------------------------------------------------------------------- */

const locator = (extra = {}) => ({
  document: null, pdfPage: null, printedPage: null, section: null,
  table: null, row: null, column: null, sheet: null, cell: null, clause: null,
  ...extra,
});

const calculation = (inputs, formula, rounding = 'source precision retained', reviewStatus = 'reviewed') => ({
  inputs, formula, rounding, reviewStatus,
});

const reuse = (status, permitsNumericPublication, basisLocator, attribution, constraints) => ({
  status, permitsNumericPublication, basisUrl: null, basisLocator, attribution, constraints,
});

const sourceRecord = (extra) => ({
  publisher: 'Independent Market Monitor for ERCOT (Potomac Economics)',
  title: '', url: null, language: 'en',
  publishedOn: null, effectiveOn: null,
  coverage: { from: null, to: null },
  checkedOn: null, lastAttemptOn: null, access: 'not checked',
  locator: locator(),
  reuse: reuse('unresolved', false, null, null, 'No reuse beyond the reviewed disposition is authorised.'),
  ...extra,
});

const datum = (extra) => ({
  id: null, sourceIds: [], period: null, datePrecision: null,
  measure: null, scope: null, unit: null, status: 'observed',
  approximate: false, comparator: null, qualifier: null,
  locator: locator(), calculation: calculation(null, null),
  ...extra,
});

const open = (gate, note) => ({ gate, note });

export const ERCOT_STORY_META = {
  id: 'ercot-story-evidence',
  marketId: 'ercot',
  kind: 'fixed-vintage-table',
  entry: 'analyst-entered',
  schemaVersion: 1,
  vintage: '2026-11-02',
  checkedOn: '2026-11-02',
  refresh: 'review when a cited document or gate is reviewed',
  bearsOn: [],
};

export const ERCOT_STORY_SOURCES = {
  'SRC-ERCOT-01': sourceRecord({
    title: '2025 State of the Market Report for the ERCOT Electricity Markets',
    url: 'https://www.potomaceconomics.com/wp-content/uploads/2026/06/2025-State-of-the-Market-Report-for-ERCOT.pdf',
    publishedOn: '2026-05',
    coverage: { from: '2014', to: '2025' },
    checkedOn: '2026-11-02', lastAttemptOn: '2026-11-02', access: 'opened',
    locator: locator({
      document: '2025 State of the Market Report for the ERCOT Electricity Markets',
      pdfPage: [2, 8, 21, 22, 30, 36, 40, 43, 44, 58, 62, 161],
      printedPage: ['ii–iv', 'viii', 2, 7, 8, 21, 22, 23, 36, 40, 'A-3'],
      section: '§II.D; §I.E; §II.H; §III.B; Appendix', table: 'Figure 25 inset table; Table A1',
    }),
    reuse: reuse('cite-link-factual-records', true,
      'Reviewed factual records in §II.H, Figure 25 inset, Table A1 and the named paragraphs',
      'Source: Independent Market Monitor for ERCOT, 2025 State of the Market Report, May 2026',
      'No licence is stated. Cite and link; do not reproduce figures. Numeric eligibility is limited to the reviewed fixed-vintage facts; price cells remain gated by visual verification and reuse review.'),
  }),
  'SRC-ERCOT-02': sourceRecord({
    title: '2024 State of the Market Report',
    url: 'https://www.potomaceconomics.com/wp-content/uploads/2025/06/2024-State-of-the-Market-Report.pdf',
    publishedOn: '2025-05', coverage: { from: '2024', to: '2024' },
    checkedOn: '2026-11-02', lastAttemptOn: '2026-11-02', access: 'opened',
    locator: locator({ document: '2024 State of the Market Report', pdfPage: 60, printedPage: 22, section: '§2', clause: 'first paragraph' }),
    reuse: reuse('cite-link-factual-records', true, 'Printed p.22 / PDF p.60, §2 first paragraph',
      'Source: Independent Market Monitor for ERCOT, 2024 State of the Market Report',
      'Cite and link; no figure reproduction. This report is not a substitute vintage for the 2025 report price table.'),
  }),
  'SRC-ERCOT-03': sourceRecord({
    title: '2023 State of the Market Report',
    url: 'https://www.potomaceconomics.com/wp-content/uploads/2024/05/2023-State-of-the-Market-Report_Final_060624.pdf',
    publishedOn: '2024-06', coverage: { from: '2023', to: '2023' },
    checkedOn: '2026-11-02', lastAttemptOn: '2026-11-02', access: 'opened',
    locator: locator({ document: '2023 State of the Market Report', printedPage: ['v', 'ix'], section: 'Supply in 2023; ECRS account' }),
    reuse: reuse('cite-link-factual-records', true, 'Printed p.v, Supply in 2023; p.ix, ECRS account',
      'Source: Independent Market Monitor for ERCOT, 2023 State of the Market Report',
      'Cite and link; no figure reproduction. Preserve the reported stock rather than reconstructing it from additions.'),
  }),
  'SRC-ERCOT-04': sourceRecord({
    title: '2021 State of the Market Report',
    url: 'https://www.potomaceconomics.com/wp-content/uploads/2022/05/2021-State-of-the-Market-Report.pdf',
    publishedOn: '2022-05', coverage: { from: '2021-02-15', to: '2021-02-19' },
    checkedOn: '2026-10-31', lastAttemptOn: '2026-10-31', access: 'opened',
    locator: locator({ document: '2021 State of the Market Report', printedPage: 'iv', clause: 'Winter Storm Uri EEA3 account' }),
    reuse: reuse('historical-fact', false, null, 'Source: Independent Market Monitor for ERCOT, 2021 State of the Market Report',
      'Event range only. Battery additions are a different measure and are not used as year-end stock.'),
  }),
  'SRC-ERCOT-05': sourceRecord({
    title: '2022 State of the Market Report',
    url: 'https://www.potomaceconomics.com/wp-content/uploads/2023/05/2022-State-of-the-Market-Report_Final_060623.pdf',
    publishedOn: '2023-06', coverage: { from: '2022', to: '2022' },
    checkedOn: '2026-11-02', lastAttemptOn: '2026-11-02', access: 'opened',
    locator: locator({ document: '2022 State of the Market Report', pdfPage: 8, printedPage: 'ii', clause: 'generation-portfolio bullet' }),
    reuse: reuse('cite-link-factual-records', true, 'Printed p.ii / PDF p.8, generation-portfolio bullet',
      'Source: Independent Market Monitor for ERCOT, 2022 State of the Market Report',
      'Year-end monitor value only; cite and link, with no figure reproduction.'),
  }),
  'SRC-ERCOT-06': sourceRecord({
    publisher: 'Public Utility Commission of Texas',
    title: 'Project No. 52631, Item 47, order adopting amendments to 16 TAC §25.505',
    url: 'https://interchange.puc.texas.gov/Documents/52631_47_1171647.PDF',
    publishedOn: '2021-12-02', effectiveOn: '2022', coverage: { from: '2021-12-02', to: '2022' },
    checkedOn: '2026-10-31', lastAttemptOn: '2026-11-02',
    access: 'HTTP 402 on 2 November; prior 31 October successful check retained',
    locator: locator({ document: 'PUCT Project No. 52631, Item 47', printedPage: [1, 4, 5], clause: 'adoption and cap amendment' }),
    reuse: reuse('cite-link-factual-records', true, 'Item 47, p.1 and pp.4–5: adoption and cap amendment',
      'Source: Public Utility Commission of Texas, Project No. 52631, Item 47',
      'Historical amendment only. ERCOT notice M-A120721-01 remains unopened, so the effective day is not accepted; reopen the current rule before calling the cap current.'),
  }),
  'SRC-ERCOT-07': sourceRecord({
    publisher: 'Public Utility Commission of Texas',
    title: 'Public Utility Commission of Texas Unanimously Adopts Performance Credit Mechanism Reliability Service',
    url: 'https://ftp.puc.texas.gov/public/puct-info/agency/resources/pubs/news/2023/PUCT_Adopts_Performance_Credit_Mechanism_Reliability_Service.pdf',
    publishedOn: '2023-01-19', coverage: { from: '2023-01-19', to: '2023-01-19' },
    checkedOn: '2026-10-31', lastAttemptOn: '2026-10-31', access: 'opened',
    locator: locator({ document: 'PUCT news release, 19 January 2023', clause: 'performance-credit adoption and deferred implementation' }),
    reuse: reuse('historical-fact', false, null, 'Source: Public Utility Commission of Texas, 19 January 2023 release',
      'A release, not the order; historical adoption and deferral only.'),
  }),
  'SRC-ERCOT-08': sourceRecord({
    publisher: 'Public Utility Commission of Texas',
    title: 'Project No. 55000 Performance Credit Mechanism: Items 47–48 and open-meeting minutes, item 17',
    url: 'https://ftp.puc.texas.gov/public/puct-info/agency/calendar/minutes/12-19-24.pdf',
    publishedOn: '2024-12-19', coverage: { from: '2024-12-13', to: '2024-12-19' },
    checkedOn: '2026-10-31', lastAttemptOn: '2026-10-31', access: 'opened',
    locator: locator({ document: 'PUCT open-meeting minutes, 19 December 2024', clause: 'item 17; adopted staff final recommendation on PCM' }),
    reuse: reuse('historical-fact', false, null, 'Source: Public Utility Commission of Texas, Project No. 55000',
      'Records the closed branch, not a prospective credit; later reconsideration is not asserted.'),
  }),
  'SRC-ERCOT-10': sourceRecord({
    publisher: 'Lawrence Berkeley National Laboratory',
    title: 'Queued Up: 2026 Edition',
    url: 'https://eta-publications.lbl.gov/sites/default/files/2026-06/queued_up_2026_edition.pdf',
    publishedOn: '2026-06', coverage: { from: '2010', to: '2025' },
    checkedOn: '2026-10-31', lastAttemptOn: '2026-11-02',
    access: 'Reader size limit on 2 November; prior 31 October successful check retained',
    locator: locator({ document: 'Queued Up: 2026 Edition', pdfPage: [44, 47], printedPage: [44, 47], clause: 'slide 47 ERCOT request-to-agreement row; slides 44/47 cohort and coverage' }),
    reuse: reuse('doe-funded-cite-link', true, 'Slide 47, ERCOT request-to-agreement row',
      'Source: Lawrence Berkeley National Laboratory, Queued Up: 2026 Edition',
      'DOE-funded analysis; cite and link. Not ERCOT rule text, COD time or a project promise.'),
  }),
  'SRC-ERCOT-14': sourceRecord({
    publisher: 'ERCOT',
    title: 'Market notices M-D050523-01 and M-F110525-04; NPRR 1282 context',
    url: null, coverage: { from: '2023-06-09', to: '2025-12-05' },
    checkedOn: null, lastAttemptOn: '2026-11-02', access: '2 November access incomplete; notices not opened; search results only',
    unresolved: true,
    locator: locator({ document: 'ERCOT market notices M-D050523-01 and M-F110525-04', clause: 'ECRS first operating day and real-time co-optimisation transition; operator text pending' }),
    reuse: reuse('unresolved-corroboration', false, null, 'Source: ERCOT market notices',
      'Notices were not opened. Historical dates rely on the opened monitor corroboration; operator rule/effective-text verification remains open.'),
  }),
  'SRC-ERCOT-19': sourceRecord({
    publisher: 'ERCOT',
    title: 'Notice on the Operating Reserve Demand Curve, 30 May 2014',
    url: null, publishedOn: '2014-05-30', coverage: { from: '2014', to: '2014' },
    checkedOn: null, lastAttemptOn: '2026-10-31', access: 'search result; not opened',
    unresolved: true,
    locator: locator({ document: 'ERCOT ORDC notice, 30 May 2014', clause: 'candidate start-date text pending; opened monitor report supplies year precision' }),
    reuse: reuse('historical-year-only', false, null, 'Source: ERCOT ORDC notice',
      'The candidate start day is withheld until the notice is read; only 2014 year precision is eligible.'),
  }),
  'SRC-ERCOT-WB': sourceRecord({
    publisher: 'ERCOT',
    title: 'Capacity Changes by Fuel Type Charts, December 2025 candidate workbook',
    url: 'https://www.ercot.com/files/docs/2026/01/08/Capacity-Changes-by-Fuel-Type-Charts_December_2025.xlsx',
    coverage: { from: '2021', to: '2025' },
    checkedOn: null, lastAttemptOn: '2026-11-02',
    access: 'link/HTML level only; XLSX contents not read',
    unresolved: true,
    locator: locator({ document: 'Capacity Changes by Fuel Type Charts, December 2025 candidate workbook', clause: 'Natural end-2025 candidate; September 2026 revision and definition check still required' }),
    reuse: reuse('unresolved', false, null, 'Source: ERCOT, Capacity Changes by Fuel Type workbook',
      'No sheet, row, year-cell, commercial-operation definition, fixed vintage or reuse basis is verified. No candidate operator MW is carried.'),
  }),
};

const MONITOR_SOURCE = {
  2021: 'SRC-ERCOT-01', 2022: 'SRC-ERCOT-05', 2023: 'SRC-ERCOT-03',
  2024: 'SRC-ERCOT-02', 2025: 'SRC-ERCOT-01',
};
const MONITOR_VINTAGE = {
  2021: '2025 State of the Market Report, May 2026',
  2022: '2022 State of the Market Report, June 2023',
  2023: '2023 State of the Market Report, June 2024',
  2024: '2024 State of the Market Report, May 2025',
  2025: '2025 State of the Market Report, May 2026',
};

const DC_LOCATOR = locator({ document: '2025 State of the Market Report', pdfPage: 58, printedPage: 36, section: '§II.H', clause: 'opening paragraph, SPP and Mexico ties' });

export const ERCOT_DC_TIES = datum({
  id: 'dc-ties-total', sourceIds: ['SRC-ERCOT-01'], period: '2025 report vintage',
  datePrecision: 'report vintage', measure: 'DC tie count and transfer capability',
  scope: 'ERCOT asynchronous links through SPP and Mexico', unit: 'count; MW',
  qualifier: 'transfer capability, not observed flow', locator: DC_LOCATOR,
  calculation: calculation('SPP and Mexico groups', '2 + 2 = 4 ties; 820 MW + 400 MW = 1,220 MW'),
  totalCount: 4, totalTransferMW: 1220,
  spp: datum({
    id: 'dc-ties-spp', sourceIds: ['SRC-ERCOT-01'], period: '2025 report vintage',
    datePrecision: 'report vintage', measure: 'DC tie count and transfer capability',
    scope: 'SPP ties', unit: 'count; MW', qualifier: 'transfer capability, not observed flow',
    locator: DC_LOCATOR, calculation: calculation('Published SPP group', 'direct 2 ties and 820 MW'),
    count: 2, transferMW: 820,
  }),
  mexico: datum({
    id: 'dc-ties-mexico', sourceIds: ['SRC-ERCOT-01'], period: '2025 report vintage',
    datePrecision: 'report vintage', measure: 'DC tie count and transfer capability',
    scope: 'Mexico ties', unit: 'count; MW', qualifier: 'transfer capability, not observed flow',
    locator: DC_LOCATOR, calculation: calculation('Published Mexico group', 'direct 2 ties and 400 MW'),
    count: 2, transferMW: 400,
  }),
});

export const ERCOT_OFFER_CAP = datum({
  id: 'offer-cap-amendment', sourceIds: ['SRC-ERCOT-06'], period: '2021 adoption / 2022 effective year',
  datePrecision: 'adoption day; effective year', measure: 'system-wide offer-cap amendment',
  scope: 'historical amendment; current-rule presentation requires recheck', unit: 'USD/MWh',
  qualifier: 'effective day unverified', sourceId: 'SRC-ERCOT-06',
  locator: locator({ document: 'PUCT Project No. 52631, Item 47', printedPage: [1, 4, 5], clause: 'adoption and cap amendment; ERCOT notice M-A120721-01 pending' }),
  calculation: calculation('Adopting order', 'direct 5,000 USD/MWh and prior 9,000 USD/MWh; no scale conversion'),
  currentUSDPerMWh: 5000, priorUSDPerMWh: 9000,
  adoptedOn: '2021-12-02', effectiveOn: '2022',
});

export const ERCOT_CONNECTION = datum({
  id: 'connection-request-to-agreement', sourceIds: ['SRC-ERCOT-10'], period: '2010–2025 request cohort',
  datePrecision: 'cohort years', measure: 'mean generation-interconnection request-to-agreement time',
  scope: 'ERCOT requests in Queued Up: 2026 Edition', unit: 'months',
  qualifier: 'not COD time or a project promise; no numeric elsewhere comparator', sourceId: 'SRC-ERCOT-10',
  locator: locator({ document: 'Queued Up: 2026 Edition', pdfPage: [44, 47], printedPage: [44, 47], clause: 'slide 47 ERCOT request-to-agreement row; slides 44/47 cohort and data coverage' }),
  calculation: calculation('Published ERCOT cohort mean and coverage', 'direct 24 months; cohort 2010 through 2025'),
  meanRequestToAgreementMonths: 24, requestCohortFromYear: 2010, dataThroughYear: 2025,
});

const fleetRow = (year) => datum({
  id: `fleet-${year}`, sourceIds: ['SRC-ERCOT-WB', MONITOR_SOURCE[year]],
  year, period: `December ${year}`, datePrecision: 'end-year',
  measure: 'year-end battery storage power, commercial operation approved',
  scope: 'ERCOT operator series; synchronization, plans, requests and reserve qualification excluded',
  unit: 'MW', status: 'withheld', comparator: 'monitor-cross-check',
  sourceId: 'SRC-ERCOT-WB', comparatorSourceId: MONITOR_SOURCE[year], sourceVintage: null,
  definition: 'December year-end battery MW, commercial operation approved; workbook footnote and distinction from synchronization remain to be verified.',
  locator: locator({ document: 'Selected Capacity Changes by Fuel Type workbook; vintage unresolved', clause: `${year} sheet/table/row/year-cell unresolved` }),
  calculation: calculation(null, null, 'pending actual source unit and cell', 'pending workbook extraction and definition review'),
  installedMW: null, differenceMW: null, differencePct: null,
  comparisonStatus: 'blocked; monitor check is qualitative only',
  disposition: 'withhold operator value; do not substitute monitor stock, sum additions or average sources',
  open: open('locator + definition + vintage + reuse', 'A single selected workbook and its actual cells, footnote, revision and rights must be reviewed.'),
});

export const ERCOT_FLEET = {
  publicationReady: false,
  open: open('locator + definition + vintage + reuse', 'Independent upper-panel gate.'),
  2021: fleetRow(2021), 2022: fleetRow(2022), 2023: fleetRow(2023),
  2024: fleetRow(2024), 2025: fleetRow(2025),
};

const monitorRow = (year, mw, sourceId, monitorLocator, calc, extra = {}) => datum({
  id: `monitor-check-${year}`, sourceIds: [sourceId], year, period: `end-${year}`,
  datePrecision: 'end-year', measure: 'monitor-reported battery/ESR capacity',
  scope: 'annual monitor cross-check; not the operator observation series', unit: 'MW',
  status: 'observed-monitor-check', sourceId, sourceVintage: MONITOR_VINTAGE[year],
  checkedOn: ERCOT_STORY_SOURCES[sourceId].checkedOn,
  locator: monitorLocator, calculation: calc, mw, ...extra,
});

export const ERCOT_MONITOR_CHECKS = {
  2021: monitorRow(2021, 1600, 'SRC-ERCOT-01',
    locator({ document: '2025 State of the Market Report', pdfPage: 43, printedPage: 21, section: '2. ESR Capacity Trends', clause: '2021 stock statement' }),
    calculation('Printed rounded stock', 'direct 1,600 MW'), { qualifier: 'rounded', approximate: true }),
  2022: monitorRow(2022, 2700, 'SRC-ERCOT-05',
    locator({ document: '2022 State of the Market Report', pdfPage: 8, printedPage: 'ii', clause: 'generation-portfolio bullet' }),
    calculation('2.7 GW', '2.7 GW × 1,000 = 2,700 MW'), { qualifier: 'rounded', approximate: true }),
  2023: monitorRow(2023, 4400, 'SRC-ERCOT-03',
    locator({ document: '2023 State of the Market Report', pdfPage: 11, printedPage: 'v', section: 'Supply in 2023' }),
    calculation('4.4 GW', '4.4 GW × 1,000 = 4,400 MW; do not reconstruct stock from additions'), { qualifier: 'rounded', approximate: true }),
  2024: monitorRow(2024, 9505, 'SRC-ERCOT-02',
    locator({ document: '2024 State of the Market Report', pdfPage: 60, printedPage: 22, section: '§2', clause: 'first paragraph' }),
    calculation('Printed stock', 'direct 9,505 MW')),
  2025: monitorRow(2025, 17000, 'SRC-ERCOT-01',
    locator({ document: '2025 State of the Market Report', pdfPage: [12, 43, 44], printedPage: ['ii', 21, 22], clause: 'year-end capacity statements' }),
    calculation('Printed bounded stock', 'direct greater-than 17,000 MW'), { comparator: 'gt' }),
};

export const ERCOT_FLEET_DURATION_2025 = datum({
  id: 'fleet-duration-2025', sourceIds: ['SRC-ERCOT-01'], year: 2025, period: 'end-2025',
  datePrecision: 'end-year', measure: 'monitor-reported ESR fleet duration',
  scope: '2025 ESR fundamentals', unit: 'hours', sourceId: 'SRC-ERCOT-01',
  locator: locator({ document: '2025 State of the Market Report', pdfPage: 43, printedPage: 21, section: 'ESR fundamentals', clause: 'fleet-duration bullet' }),
  calculation: calculation('Printed fleet duration', 'direct 1.83 hours; no derivation from rounded or bounded fleet totals'),
  hours: 1.83,
});

const priceObservation = (productId, year) => {
  const structural = productId === 'ecrs' && year < 2023;
  const coverageNote = productId === 'ecrs' && year === 2023
    ? 'ECRS observation starts with its June launch; reserve-capacity price, not captured revenue.'
    : productId === 'ecrs' && year === 2025
      ? 'Includes only one month after real-time co-optimisation; reserve-capacity price, not captured revenue.'
      : 'Annual reserve-capacity price, not arbitrage price or captured revenue.';
  return datum({
    id: `as-price-${productId}-${year}`, sourceIds: ['SRC-ERCOT-01'],
    year, period: String(year), datePrecision: 'calendar-year',
    measure: 'annual ancillary-service reserve-capacity price',
    scope: `${productId} in the 2025 report vintage`, unit: 'USD per MW held ready per hour',
    status: structural ? 'not-yet-launched' : 'withheld',
    qualifier: structural ? 'structural pre-launch null' : null,
    productId, sourceId: 'SRC-ERCOT-01', sourceVintage: '2025 State of the Market Report, May 2026',
    sourcePrintedUnit: '$/MWh', coverageNote,
    locator: locator({
      document: '2025 State of the Market Report', pdfPage: 62, printedPage: 40,
      section: '§III.B', table: 'in-body Figure 25, Ancillary Service Prices, inset table',
      row: productId, column: String(year),
      clause: 'Contents-list figure misnumbering is not used; visual cell verification remains pending.',
    }),
    calculation: calculation('Selected printed table cell; not yet visually verified',
      'identity transcription only; no annual-average recomputation, scale conversion or annual-hours multiplication',
      'preserve printed precision', structural ? 'structural null; no interpolation' : 'pending visual primary-table and reuse review'),
    usdPerMWPerHour: null,
    open: structural
      ? open('structural', 'ECRS was not yet launched; this remains null after any rights clearance.')
      : open('rights + visual-table-verification', 'No candidate value is eligible or carried until the printed cell and reuse are cleared.'),
  });
};

const annualPrices = (productId) => Object.fromEntries([2021, 2022, 2023, 2024, 2025].map((year) => [year, priceObservation(productId, year)]));

export const ERCOT_PRICES = {
  publicationReady: false,
  open: open('rights + visual-table-verification', 'Independent lower-panel gate.'),
  products: {
    rrs: { annual: annualPrices('rrs') }, nonSpin: { annual: annualPrices('nonSpin') },
    regUp: { annual: annualPrices('regUp') }, regDown: { annual: annualPrices('regDown') },
    ecrs: { annual: annualPrices('ecrs') },
  },
};

export const ERCOT_REVENUE_PER_KW_2025 = datum({
  id: 'revenue-per-kw-2025', sourceIds: ['SRC-ERCOT-01'], year: 2025, period: '2025 compared with 2024',
  datePrecision: 'calendar-year comparison', measure: 'decline magnitude in revenue per unit of capacity',
  scope: 'ESR revenue trends', unit: 'percent decline', approximate: true,
  qualifier: 'almost', sourceId: 'SRC-ERCOT-01',
  locator: locator({ document: '2025 State of the Market Report', pdfPage: 44, printedPage: 22, section: '§3 ESR Revenue Trends', clause: 'paragraph before Figure 17' }),
  calculation: calculation('Printed monitor comparison', 'direct almost 37%; no chart digitisation or subscription index'),
  declineMagnitudePct: 37, comparisonYear: 2024,
});

export const ERCOT_ORDC_2025 = datum({
  id: 'ordc-2025', sourceIds: ['SRC-ERCOT-01'], year: 2025, period: '2025',
  datePrecision: 'calendar-year', measure: 'ORDC active hours and average price adder',
  scope: 'historical ORDC result before retirement', unit: 'hours; USD/MWh upper bound',
  comparator: 'lt', sourceId: 'SRC-ERCOT-01',
  locator: locator({ document: '2025 State of the Market Report', pdfPage: 30, printedPage: 8, section: '§II.D', clause: 'paragraph before Figure 5; executive-summary corroboration p.iii' }),
  calculation: calculation('Printed active hours and bounded adder', 'direct 57 hours and less than 0.02 USD/MWh'),
  activeHours: 57, averagePriceAdderUpperBoundUSDPerMWh: 0.02,
});

const RESERVE_LOCATOR = locator({ document: '2025 State of the Market Report', pdfPage: 161, printedPage: 'A-3', table: 'Table A1' });
const reserveRule = (productId, durationMinutes, formula, row, extra = {}) => datum({
  id: `reserve-duration-${productId}`, sourceIds: ['SRC-ERCOT-01'], period: 'post-real-time-co-optimisation rule vintage',
  datePrecision: 'rule vintage; effective text pending', measure: 'reserve-product duration rule',
  scope: productId, unit: 'minutes', sourceId: 'SRC-ERCOT-01',
  locator: locator({ ...RESERVE_LOCATOR, row }),
  calculation: calculation(row, formula), durationMinutes, ...extra,
});

export const ERCOT_RESERVE_RULES = datum({
  id: 'reserve-duration-rules', sourceIds: ['SRC-ERCOT-01', 'SRC-ERCOT-14'], period: 'post-real-time-co-optimisation rule vintage',
  datePrecision: 'rule vintage; effective text pending', measure: 'ancillary-service duration rules',
  scope: 'Reg-Up, RRS, ECRS, Non-Spin and unresolved Reg-Down', unit: 'minutes',
  qualifier: 'Reg-Up is named specifically; no claim about every regulation product',
  locator: RESERVE_LOCATOR,
  calculation: calculation('Monitor Table A1 and pending operator notices', 'product rows transcribed; operator effective text remains pending', 'source precision retained', 'historical table reviewed; operator effective-text verification open'),
  effectiveOn: '2025-12-05',
  open: open('operator-rule-verification', 'The candidate effective day remains pending until the operator clause/effective text is read; it is not a verified current-rule claim.'),
  regUp: reserveRule('regUp', 30, 'direct 30 minutes; 30 ÷ 60 = 0.5 hours if displayed', 'Reg-Up'),
  rrs: reserveRule('rrs', 30, 'direct 30 minutes; 30 ÷ 60 = 0.5 hours if displayed', 'RRS'),
  ecrs: reserveRule('ecrs', 60, '1 hour × 60 = 60 minutes', 'ECRS'),
  nonSpin: reserveRule('nonSpin', 240, '4 hours × 60 = 240 minutes', 'NSRS'),
  regDown: reserveRule('regDown', null, 'no accepted duration row established', 'Reg-Down', {
    status: 'withheld', open: open('locator', 'Do not infer Reg-Down duration from Reg-Up symmetry.'),
  }),
});

export const ERCOT_HISTORY = {
  'H-ERCOT-01': {
    id: 'H-ERCOT-01', dates: ['2014'], datePrecision: 'year', kind: 'event',
    sources: ['SRC-ERCOT-01', 'SRC-ERCOT-19'],
    locators: [
      locator({ document: '2025 State of the Market Report', printedPage: 2, clause: 'ORDC implemented in 2014' }),
      ERCOT_STORY_SOURCES['SRC-ERCOT-19'].locator,
    ],
    event: 'The Operating Reserve Demand Curve is implemented; candidate start day remains withheld.',
  },
  'H-ERCOT-02': {
    id: 'H-ERCOT-02', dates: ['2021-02-15', '2021-02-19'], datePrecision: 'day-range', kind: 'event-range',
    sources: ['SRC-ERCOT-04'],
    locators: [locator({ document: '2021 State of the Market Report', printedPage: 'iv', clause: 'EEA3 from early 15 February to mid-morning 19 February 2021' })],
    event: 'Winter Storm Uri: EEA3 and load shed across the recorded event range.',
  },
  'H-ERCOT-03': {
    id: 'H-ERCOT-03', dates: ['2021-12-02'], datePrecision: 'adoption day; effective year', kind: 'rule',
    sources: ['SRC-ERCOT-06'],
    locators: [locator({ document: 'PUCT Project No. 52631, Item 47', printedPage: 1, clause: 'adoption; effective-date notice pending' })],
    adoptedOn: '2021-12-02', effectiveOn: '2022',
    event: 'Offer-cap amendment adopted; effective year retained without an unverified day.',
  },
  'H-ERCOT-04': {
    id: 'H-ERCOT-04', dates: ['2023-01-19', '2024-12-19'], datePrecision: 'day', kind: 'closed-branch',
    sources: ['SRC-ERCOT-07', 'SRC-ERCOT-08'],
    locators: [
      locator({ document: 'PUCT performance-credit adoption release', clause: 'adopted and deferred on 19 January 2023' }),
      locator({ document: 'PUCT open-meeting minutes, 19 December 2024', clause: 'item 17; staff final recommendation adopted' }),
    ],
    adoptedOn: '2023-01-19', closedOn: '2024-12-19',
    event: 'Performance credit adopted and deferred, then not taken forward; the branch is closed, not prospective.',
  },
  'H-ERCOT-05': {
    id: 'H-ERCOT-05', dates: ['2023-06-10'], datePrecision: 'day', kind: 'event',
    sources: ['SRC-ERCOT-03', 'SRC-ERCOT-14'],
    locators: [
      locator({ document: '2023 State of the Market Report', printedPage: 'ix', clause: 'ECRS from 10 June 2023' }),
      locator({ document: 'ERCOT notice M-D050523-01', clause: 'first procurement/operating day; distinct from 9 June notice/system implementation' }),
    ],
    event: 'ECRS first procurement and operating day.',
  },
  'H-ERCOT-06': {
    id: 'H-ERCOT-06', dates: ['2025-12-05'], datePrecision: 'day', kind: 'event',
    sources: ['SRC-ERCOT-01', 'SRC-ERCOT-14'],
    locators: [
      locator({ document: '2025 State of the Market Report', printedPage: [2, 7], clause: 'real-time co-optimisation and ORDC retirement' }),
      locator({ document: 'ERCOT notice M-F110525-04', clause: 'operator notice pending; historical date corroborated by the monitor report' }),
    ],
    event: 'Real-time co-optimisation goes live and the ORDC adder ends.',
  },
};

export const ERCOT_STORY_RECORDS = {
  ...ERCOT_STORY_META,
  sources: ERCOT_STORY_SOURCES,
  dcTies: ERCOT_DC_TIES,
  offerCap: ERCOT_OFFER_CAP,
  connection: ERCOT_CONNECTION,
  fleet: ERCOT_FLEET,
  monitorChecks: ERCOT_MONITOR_CHECKS,
  fleetDuration2025: ERCOT_FLEET_DURATION_2025,
  prices: ERCOT_PRICES,
  revenuePerKW2025: ERCOT_REVENUE_PER_KW_2025,
  ordc2025: ERCOT_ORDC_2025,
  reserveRules: ERCOT_RESERVE_RULES,
  history: ERCOT_HISTORY,
};

export function eligibleErcotFleetPoints(){
  return [2021, 2022, 2023, 2024, 2025]
    .map((year) => ERCOT_FLEET[year])
    .filter((row) => Number.isFinite(row.installedMW));
}

export function eligibleErcotPricePoints(){
  return Object.values(ERCOT_PRICES.products)
    .flatMap((product) => Object.values(product.annual))
    .filter((row) => Number.isFinite(row.usdPerMWPerHour));
}
