/* Dated primary-source facts named by the signed-off script's binding register.
   Numeric data and document references only; no project or model assumptions. */
export const FI_EVIDENCE = {
  checkedOn: '2026-10-31',
  ol3: { name: 'OL3', regularDate: '2023-04-16', outputMW: 1600, netStepMW: 1300, sources: ['SRC-FI-18','SRC-FI-19','SRC-FI-20'] },
  annualDeliveryYear: { value: 2026, source: 'SRC-FI-22' },
  hourlyDeliveryYear: { value: 2027, source: 'SRC-FI-23', announcedOn: '2026-09-08' },
  billSubmission: { month: '2026-12', source: 'SRC-FI-25', announcedOn: '2026-10-23', status: 'official-plan' },
  vision: { origin: '2025-10', horizon: 2040, source: 'SRC-FI-02', status: 'scenario' },
};

export const FI_HISTORY = [
  { id:'H-FI-01', dates:['1959'], sources:['SRC-FI-29','SRC-FI-28','SRC-FI-01'], kind:'event' },
  { id:'H-FI-02', dates:['1998','1999'], sources:['SRC-FI-30'], kind:'event' },
  { id:'H-FI-03', dates:['2014','2020-05','2022-01-01'], sources:['SRC-FI-32','SRC-FI-06','SRC-FI-31','SRC-FI-01'], kind:'event' },
  { id:'H-FI-04', dates:['2023-04-16'], sources:['SRC-FI-18','SRC-FI-19','SRC-FI-20','SRC-FI-21'], kind:'event' },
  { id:'H-FI-05', dates:['2026-02'], early:true, sources:['SRC-FI-04','SRC-FI-01'], kind:'event' },
  { id:'H-FI-06', dates:['2026-09-08'], sources:['SRC-FI-23'], kind:'event' },
];

/* Values are supplied by the named clauses, not a site qualification verdict.
   Support and activation are different clocks. FCR-N's pair is symmetric;
   the aFRR hour is its capacity commitment, not a battery-sizing rule. */
export const FI_RESERVE_PRODUCTS = [
  { id:'ffr', label:['FFR','FFR'], group:'ffr', activation:{triggers:[[49.7,1.3],[49.6,1],[49.5,0.7]]}, support:{seconds:[5,30]}, direction:'↑', sources:['SRC-FI-07','SRC-FI-08'], locator:'§§4–5, 7, 9.2; §3, Tables 3.1–3.2' },
  { id:'fcr-n', label:['FCR-N','FCR-N'], group:'fcr', activation:{percentMinutes:[[63,1],[95,3]]}, support:{hoursEachWay:1,powerRatio:1.34}, direction:'↕', sources:['SRC-FI-09','SRC-FI-10','SRC-FI-11'], locator:'§§4–5, 8, 10–11; §3.5, Table 10' },
  { id:'fcr-d-up', label:['FCR-D ↑','FCR-D ↑'], group:'fcr', activation:{percentSeconds:[86,7.5]}, support:{minutes:20}, direction:'↑', sources:['SRC-FI-09','SRC-FI-10','SRC-FI-11'], locator:'§§4–5, 8, 11.3–11.4; §3.5, Table 10' },
  { id:'fcr-d-down', label:['FCR-D ↓','FCR-D ↓'], group:'fcr', activation:{percentSeconds:[86,7.5]}, support:{minutes:20}, direction:'↓', sources:['SRC-FI-09','SRC-FI-10','SRC-FI-11'], locator:'§§4–5, 8, 11.3–11.4; §3.5, Table 10' },
  { id:'afrr', label:['aFRR','aFRR'], group:'restoration', activation:{minutes:5}, support:{capacityHours:1}, direction:'↑ / ↓', sources:['SRC-FI-13','SRC-FI-14'], locator:'§§4–5, 7–8, 11.1–11.2' },
  { id:'mfrr', label:['mFRR','mFRR'], group:'restoration', activation:{minutes:12.5}, support:{minutesRange:[5,20]}, direction:'↑ / ↓', sources:['SRC-FI-16','SRC-FI-17'], locator:'§§5, 7.3.1–7.3.2, 8, 12.1–12.2' },
];
export const FI_PRICE_SERIES = [
  {id:'fi-fcr-n',label:['FCR-N','FCR-N'],sourceId:'SRC-FI-32',fingridId:317},
  {id:'fi-fcr-d-up',label:['FCR-D ↑','FCR-D ↑'],sourceId:'SRC-FI-32',fingridId:318},
  {id:'fi-fcr-d-down',label:['FCR-D ↓','FCR-D ↓'],sourceId:'SRC-FI-32',fingridId:283},
  {id:'fi-afrr-up',label:['aFRR ↑','aFRR ↑'],sourceId:'SRC-FI-32',fingridId:52},
  {id:'fi-afrr-down',label:['aFRR ↓','aFRR ↓'],sourceId:'SRC-FI-32',fingridId:51},
  {id:'fi-mfrr-up',label:['mFRR ↑','mFRR ↑'],sourceId:'SRC-FI-32',fingridId:329},
  {id:'fi-mfrr-down',label:['mFRR ↓','mFRR ↓'],sourceId:'SRC-FI-32',fingridId:330},
];
