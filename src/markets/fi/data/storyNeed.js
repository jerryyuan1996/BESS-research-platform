/* Finland story observations. Public primary sources only.
   The obligation and annual-average tables are publications, not feeds.
   Values remain in MW; nothing here is a model input or captured revenue. */
const CHECKED = '2026-10-31';
const RESERVES = 'https://www.fingrid.fi/en/electricity-market/reserves/power-system-reserves/';
const reference = (id, url, locator, date = CHECKED) => ({ id, url, locator, checkedOn: CHECKED, sourceDate: date });
const procurement = [
  [2019, 139, 275, 0, 0],
  [2020, 122, 278, 0, 2],
  [2021, 123, 293, 0, 3],
  [2022, 122, 279, 106, 3],
  [2023, 121, 281, 205, 2],
  [2024, 122, 283, 249, 3],
  [2025, 126, 295, 291, 2],
];

export const FI_STORY_NEED = {
  checkedOn: CHECKED, unit: 'MW', timezone: 'Europe/Helsinki',
  obligation: {
    year: 2026, fcrN: 128, fcrDUp: 309, fcrDDown: 298, ffr: [0, 60],
    measure: 'gross-product-commitments',
    source: reference('SRC-FI-01', RESERVES, 'National reserve obligations (capacity) and procurement sources in 2026; FCR-N, FCR-D up, FCR-D down and FFR rows'),
  },
  connected: {
    period: '2026-02', precision: 'early-month', approximate: true,
    mw: 1050, largerMW: 980, smallEstimateMW: 70,
    measure: 'all-size-connected-estimate',
    source: reference('SRC-FI-04', 'https://www.fingrid.fi/en/news/news/2026/the-combined-capacity-of-electricity-storages-in-finland-now-exceeds-1000-mw/', 'Opening and paragraph beginning Fingrid has started collecting data; observation early February, publication 24 February 2026 at 14:36', '2026-02-24'),
  },
  procurement: procurement.map(([year, fcrN, fcrDUp, fcrDDown, ffr]) => ({
    year, fcrN, fcrDUp, fcrDDown, ffr, measure: 'annual-average-procured',
    source: reference('SRC-FI-01', RESERVES, 'Average reserve capacity procurement 2019–2025 (table); column '+year+'; FCR-N, FCR-D up, FCR-D down and FFR rows'),
  })),
  storageSeries: {
    datasetId: 'fi-storage-capacity', fingridId: 424, validFrom: '2026-03-11',
    measure: 'network-model-technical-capacity', unit: 'MW', noSpliceToConnected: true,
    source: reference('SRC-FI-05', 'https://data.fingrid.fi/en/datasets/424', 'Description, Dataset and Additional information: systems over one MW; includes some approaching operation; distribution reporting incomplete'),
  },
  crossing: { kind: 'left-censored', exactDate: null, byPeriod: '2026-02', precision: 'early-month' },
};

/** A scale comparison, not simultaneously deliverable battery MW. */
export function fastObligationRange(record = FI_STORY_NEED.obligation){
  const fixed = record.fcrN + record.fcrDUp + record.fcrDDown;
  return record.ffr.map(ffr => fixed + ffr);
}
export const fastProcurementMW = (row) => row.fcrN + row.fcrDUp + row.fcrDDown + row.ffr;
