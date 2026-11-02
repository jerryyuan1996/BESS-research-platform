/* Ireland: the fixed-vintage capacity-auction record behind Chart-IE-CRM
   (docs/immersive-experience-plan/ie-build-evidence.md §§3 and 5).

   Registered shape, not registered numbers. B-IE-RIGHTS keeps the observed
   CRM numeric layer out of the browser until a documented permission or reuse
   basis is reviewed: every price, credit factor, awarded quantity and
   participation count below is null and marked `withheld`, and each still
   carries the primary locator that would fill it. Nothing here is an ETL feed,
   a model input or a revenue bridge, and nothing is displayed while the chart
   runs as the approved unscaled Example.

   Structural fields (the fixed context duration and the source size band) are
   definitions of the chart's scope, not observations of a price or a credit.  */

const vintage = '2026-11-02';
const checked = '2026-11-02';

const rights = {
  status: 'unresolved',
  basisUrl: null,
  checkedOn: null,
  gate: 'B-IE-RIGHTS',
  note: 'FCAR2930T-4 PDF p. 2 and IAIP2930T-4 / IAIP3031T-4 PDF p. 3 reserve reproduction rights and refer to prior written permission. A citation is not a licence.',
};

const semO = (document, version, publishedOn, url) => ({ id: document, version, publishedOn, url });

/* The final report and the information pack are separate documents with
   separate versions and dates, even when they describe the same auction. */
const docs = {
  '2022/23': {
    price: semO('FCAR2223T-4', 'v1.2', '2022-04-20', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/T-4-2022-2023-Final-Capacity-Auction-Results-Report.pdf'),
    credit: semO('IAIP2223T-4', 'v1.1', '2018-10-02', 'https://www.sem-o.com/documents/general-publications/Initial-Auction-Information-Pack_IAIP2223T-4.pdf'),
  },
  '2023/24': {
    price: semO('FCAR2324T-4', 'v1.3', '2022-04-20', 'https://www.sem-o.com/documents/general-publications/T-4-2023-2024-Final-Capacity-Auction-Results-Report.pdf'),
    credit: semO('IAIP2324T-4', 'v1.0', '2019-09-13', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/Initial-Auction-Information-Pack_IAIP2324T-4.pdf'),
  },
  '2024/25': {
    price: semO('FCAR2425T-4', 'v1.2', '2022-04-20', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/T-4-2024-2025-Final-Capacity-Auction-Results-Report.pdf'),
    credit: semO('IAIP2425T-4', 'v1.0', '2020-06-03', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/Initial-Auction-Information-Pack_IAIP2425T-4.pdf'),
  },
  '2025/26': {
    price: semO('FCAR2526T-4', 'v1.0', '2022-05-06', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/T-4-2025-26-Final-Capacity-Auction-Results-Report.pdf'),
    credit: semO('IAIP2526T-4', 'v1.0', '2021-10-01', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/Initial-Auction-Information-Pack_IAIP2526T-4.pdf'),
  },
  '2026/27': {
    price: semO('FCAR2627T-4', 'v1.0', '2023-05-04', 'https://www.sem-o.com/sites/semo/files/2025-02/FCAR2627T-4-report.pdf'),
    credit: semO('IAIP2627T-4', 'v1.0', '2022-09-08', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/Initial-Auction-Information-Pack_IAIP2627T-4.pdf'),
  },
  '2027/28': {
    price: semO('FCAR2728T-4', 'v1.0', '2023-12-05', 'https://www.sem-o.com/documents/general-publications/FCAR2728T-4-report-v1.0.pdf'),
    credit: semO('IAIP2728T-4', 'v1.1', '2023-03-14', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/IAIP2728T-4.pdf'),
  },
  '2028/29': {
    price: semO('FCAR2829T-4', 'v1.0', '2025-01-16', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/20282029-T-4-Final-Capacity-Auction-Results-Report-FCAR2829T-4.pdf'),
    credit: semO('IAIP2829T-4', 'v1.1', '2024-10-16', 'https://www.sem-o.com/sites/semo/files/documents/general-publications/IAIP2829T-4.pdf'),
  },
  '2029/30': {
    price: semO('FCAR2930T-4', 'v1', '2026-05-05', 'https://www.sem-o.com/sites/semo/files/2026-05/2029_2030%20T-4%20Final%20Capacity%20Auction%20Results%20Report%20FCAR2930T-4.pdf'),
    credit: semO('IAIP2930T-4', 'v1.1', '2025-08-13', 'https://www.sem-o.com/sites/semo/files/2025-08/IAIP2930T-4.pdf'),
  },
  '2030/31': {
    price: null,
    credit: semO('IAIP3031T-4', 'v1.0', '2026-08-04', 'https://www.sem-o.com/sites/semo/files/2026-08/IAIP3031T-4.pdf'),
  },
};

/** One withheld observation: unit, authority, primary locator, no value. */
const held = (unit, doc, locator, extra = {}) => ({
  value: null, unit, authority: 'observed', withheld: 'B-IE-RIGHTS', rights,
  source: { document: doc?.id ?? null, version: doc?.version ?? null, publishedOn: doc?.publishedOn ?? null, url: doc?.url ?? null, locator, checkedOn: checked },
  ...extra,
});

/* Held dates and quantities are published document facts; they are withheld
   with the numeric layer so one gate governs the whole record. The 2030/31
   date has a different reason: the auction has not been held. */
const notHeld = (locator) => ({
  value: null, unit: 'day', authority: 'official-plan', withheld: null,
  reason: 'Auction not held; initial pack only.',
  source: { document: 'IAIP3031T-4', version: 'v1.0', publishedOn: '2026-08-04', url: docs['2030/31'].credit.url, locator, checkedOn: checked },
});

const noResult = (unit, doc, locator, reason) => ({
  value: null, unit, authority: 'initial-pack', withheld: null, reason,
  source: { document: doc?.id ?? null, version: doc?.version ?? null, publishedOn: doc?.publishedOn ?? null, url: doc?.url ?? null, locator, checkedOn: checked },
});

/** A final result: price, credit and — only from 2026/27 — awarded MW. */
const row = (deliveryYear, auctionDateLocator, { awards = false, table = null } = {}) => {
  const d = docs[deliveryYear];
  const awardLocator = `${table}, Battery Storage row`;
  const noTotal = noResult('de-rated MW', d.price, 'Earlier final reports publish no battery total; it would have to be summed from their unit tables, which is GAP-IE-CRM.',
    'No battery total is published for this delivery year (GAP-IE-CRM); null is not zero.');
  return {
    deliveryYear,
    status: 'final-results',
    auctionDate: held('day', d.price, auctionDateLocator),
    price: held('EUR/de-rated-MW/year', d.price, 'Table 1, auction-clearing-price EUR row. Strip currency and grouping separators, retain precision, × 1.'),
    credit2h: held('factor', d.credit, 'Table 3, specified size row, 2-hour column; × 1.'),
    credit4h: held('factor', d.credit, 'Table 3, specified size row, 4-hour column; × 1. Display percent only by × 100.'),
    batteryNewMW: awards ? held('de-rated MW', d.price, `${awardLocator}, successful-new column; × 1.`) : noTotal,
    batteryExistingMW: awards ? held('de-rated MW', d.price, `${awardLocator}, successful-existing column; × 1.`) : noTotal,
    batteryTotalMW: awards ? held('de-rated MW', d.price, 'New + existing only when both exist. Record the sum even where the source also supplies a total.') : noTotal,
    gapIds: awards ? [] : ['GAP-IE-CRM'],
  };
};

const initialPack = () => {
  const d = docs['2030/31'];
  const notHeldYet = (unit, locator) => noResult(unit, d.credit, locator, 'Auction not held; no result published.');
  return {
    deliveryYear: '2030/31',
    status: 'initial-pack',
    auctionDate: notHeld('Auction not yet held; Q1 2027 per the TSO workshop.'),
    price: notHeldYet('EUR/de-rated-MW/year', 'No final result; the clearing price stays null.'),
    credit2h: held('factor', d.credit, 'Table 3, specified size row, 2-hour column; a published factor, not a cleared auction price.'),
    credit4h: held('factor', d.credit, 'Table 3, specified size row, 4-hour column; drawn dashed as an initial-pack point.'),
    batteryNewMW: notHeldYet('de-rated MW', 'No auction result.'),
    batteryExistingMW: notHeldYet('de-rated MW', 'No auction result.'),
    batteryTotalMW: notHeldYet('de-rated MW', 'No auction result.'),
    gapIds: [],
  };
};

export const IE_CRM_AUCTIONS = {
  id: 'ie-crm-auctions',
  kind: 'fixed-vintage-table',
  entry: 'analyst-entered',
  refresh: 'review after a new result or a new information pack',
  vintage,
  bearsOn: [],
  /* The whole observed layer is withheld together; a partially filled record
     would render as a series the rights review has not cleared. */
  valuesWithheld: true,
  rights,
  gapIds: ['GAP-IE-CRM'],

  /* Chart scope, not an observation: the fixed four-hour column each pack
     publishes, and the source size band the archetype sits in. */
  contextHours: {
    value: 4, unit: 'hours', authority: 'decided-rule',
    source: { document: 'CALC-IE-CRM / IAIP Table 3', url: docs['2029/30'].credit.url, locator: 'Fixed 4-hour column and each IAIP Table 3 column header; store 4, independent of row.play.hours.', checkedOn: checked },
  },
  initialCapacityBand: {
    lowerExclusiveMW: {
      value: 40, unit: 'rated MW', authority: 'decided-rule',
      source: { document: 'IAIP2930T-4 Table 3', url: docs['2029/30'].credit.url, locator: 'Other Storage, “40 < IC ≤ 50 MW” row: lower bound × 1.', checkedOn: checked },
    },
    upperInclusiveMW: {
      value: 50, unit: 'rated MW', authority: 'decided-rule',
      source: { document: 'IAIP2930T-4 Table 3', url: docs['2029/30'].credit.url, locator: 'Same row: upper bound × 1. The archetype’s 50 MW belongs in this band.', checkedOn: checked },
    },
  },

  rows: [
    row('2022/23', 'Final report executive summary: auction held 28 March 2019.'),
    row('2023/24', 'Final report executive summary: auction held 27 April 2020.'),
    row('2024/25', 'Final report executive summary: auction held 21 January 2021.'),
    row('2025/26', 'Final report executive summary: auction held 24 March 2022.'),
    row('2026/27', 'Final report executive summary: auction held 23 March 2023; awards in Table 8.', { awards: true, table: 'Table 8' }),
    row('2027/28', 'Final report executive summary: auction held 26 October 2023; awards in Table 7.', { awards: true, table: 'Table 7' }),
    row('2028/29', 'Final report: auction held 17 December 2024 (not the overview table’s older 5 December entry); awards in Table 7.', { awards: true, table: 'Table 7' }),
    row('2029/30', 'Final report p. 4: auction held 26 March 2026; awards in Table 3.', { awards: true, table: 'Table 3' }),
    initialPack(),
  ],

  /* 2029/30 only: the one auction whose tables separate qualified from offered
     new capacity. All-battery project counts are recorded beside the MW so the
     two scopes are never confused. */
  participation: {
    deliveryYear: '2029/30',
    qualifiedNewMW: held('de-rated MW', docs['2029/30'].price, 'PDF/printed p. 10, Table 5, Battery Storage row, qualified column; × 1.'),
    offeredNewMW: held('de-rated MW', docs['2029/30'].price, 'Same table and row, offered column; × 1.'),
    offeredNewShare: held('share', docs['2029/30'].price, 'Offered ÷ qualified new de-rated MW; denominator is MW, not project count. Display whole percent.'),
    qualifiedProjects: held('count', docs['2029/30'].price, 'Table 6, Battery Storage row, qualified column; all-battery CMU count, not new projects only.'),
    offeredProjects: held('count', docs['2029/30'].price, 'Same table and row, offered column.'),
    successfulProjects: held('count', docs['2029/30'].price, 'Same table and row, successful column.'),
    scope: 'all-battery project counts; new-capacity MW',
  },

  /* §5: the drawing is an Example, unscaled, until every displayed field has
     its provenance and the rights review clears. */
  chart: {
    id: 'Chart-IE-CRM',
    quantitativeReady: false,
    mode: 'example',
    fallback: ['Example: price and storage credit', '示例：价格与储能计入比例'],
    reason: 'The observed CRM layer is withheld under B-IE-RIGHTS. The Example carries no observed value, tick, tooltip or auction date.',
  },

  gaps: {
    'GAP-IE-CRM': {
      status: 'open',
      fallback: 'Awarded-volume mode covers delivery 2026/27–2029/30 only; earlier battery totals stay null and are never drawn at zero.',
      closes: 'A reviewed sum of the earlier final reports’ unit tables, with technology and cohort classification, locators and arithmetic.',
    },
  },
};

/** Market-local registration: a manual table, not a new connector or feed. */
export const IE_CRM_DATASETS = { [IE_CRM_AUCTIONS.id]: IE_CRM_AUCTIONS };
