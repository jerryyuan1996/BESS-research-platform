/* Analyst-entered publication records, fixed at this vintage. This lazy module
   is not a time series, an ETL snapshot, or an investment-model input.
   Every numeric field is covered by its row's primary-source locator. */
const checkedOn = '2026-11-01';
const cmUrl = 'https://download.terna.it/terna/Rendiconto-Esiti-Asta-Madre_2027_8dd97982c75d724.pdf';
const ratingUrl = 'https://www.mase.gov.it/portale/documents/d/guest/all_4_dtf_2-pdf';
const macseUrl = 'https://download.terna.it/terna/Rendiconto_EsitiMacse2028_aggiornati_8de05c1e38635fd.pdf';
const rulesUrl = 'https://download.terna.it/terna/Disciplina_MACSE_finale_8dc5adee4100d68.pdf';
const reference = (url, locator) => ({url, locator, checkedOn});
const zoneGroups = [
  ['north', ['North and Centre-North', '北部与中北部']],
  ['centreSouth', ['Centre-South', '中南部']],
  ['south', ['South and Calabria', '南部与卡拉布里亚']],
  ['islands', ['Sicily and Sardinia', '西西里与撒丁岛']],
];
/* Hand transcription, Annex 4 Table 11, printed/PDF p. 33. Percentages
   converted to shares by dividing by 100; no interpolation or extrapolation. */
const ratingRows = [
  [1,11,13,7,7], [2,21,26,13,13], [3,30,39,17,17], [4,40,51,21,21],
  [5,44,58,24,24], [6,49,64,26,27], [7,52,68,28,30], [8,55,71,29,33],
];

export const IT_AUCTION_RESULTS = {
  id: 'it-auction-results', kind: 'fixed-vintage-table', vintage: checkedOn,
  entry: 'analyst-entered', refresh: 'review after each auction', bearsOn: [],
  sourcePolicy: 'Public regulatory tables and reported auction facts, with attribution; no wholesale-price series.',
  capacity: [{
    deliveryYear: 2027, auctionDates: ['2025-02-26','2025-02-27'],
    premiumPerCreditedMWYear: 47000, existingCreditedMW: 38047, newCreditedMW: 594,
    unit: 'EUR/credited-MW/year', authority: 'observed',
    source: reference(cmUrl, 'Executive Summary, printed/PDF p. 4: auction dates, delivery year, national existing/new CDP and premiums. CDP is de-rated capacity, not nameplate MW.'),
  }, {
    deliveryYear: 2028, premiumPerCreditedMWYear: null,
    unit: 'EUR/credited-MW/year', authority: 'official-plan',
    source: reference('https://www.arera.it/fileadmin/allegati/docs/26/370-2026-R-eel.pdf', 'Operative point 1: applicability limited to delivery 2028. No auction result or new-entry price is supplied.'),
  }],
  derating: ratingRows.flatMap(([hours,...percent]) => zoneGroups.map(([zoneGroup,label],i) => ({
    deliveryYear: 2028, zoneGroup, label, hours, factor: percent[i]/100,
    unit: 'share-of-nameplate-MW', authority: 'decided-rule', scope: 'new-storage-only',
    arithmetic: percent[i]+' / 100',
    source: reference(ratingUrl, 'Annex 4, Table 11, printed/PDF p. 33; '+hours+' h row, '+label[0]+' column; delivery year and cohort in §8.3, p. 32. Approved by decree 327/2026; compliance ARERA 370/2026.'),
  }))),
  legacyRating: {
    deliveryYear: 2027, hours: 4, factor: .67, unit: 'share-of-nameplate-MW',
    authority: 'repository-record', primaryVerified: false,
    source: reference('https://github.com/jerryyuan1996/BESS-research-platform/blob/7effd37/src/markets/it/comparison.js', 'CM_DERATING_4H; durationResponse published four-hour point. GAP-IT-DY27: Annex 3 not located; this is the approved repository fallback, not a newly verified primary observation.'),
  },
  macse: [
    ['centreSouth',['Centre-South','中南部'],14566,2000,271.401],
    ['sardinia',['Sardinia','撒丁岛'],15029,500,74.634],
    ['sicily',['Sicily','西西里'],15846,500,77.411],
    ['south',['South and Calabria','南部与卡拉布里亚'],12137,6968,1067.946],
  ].map(([area,label,premiumPerMWhYear,mwh,mw]) => ({
    area,label,deliveryYear:2028,premiumPerMWhYear,mwh,mw,
    unit:'EUR/MWh/year',authority:'observed',
    source:reference(macseUrl,'Updated results, cover 7 October 2025; printed/PDF p. 6, Table 1 weighted-average premium (rounded to nearest integer), Table 2 selected MWh and maximum selected MW; '+label[0]+' row. Auction date and delivery year in opening paragraph.'),
  })),
  macseTotals: {
    mwh:9968,mw:1491.392,projects:14,termYears:null,authority:'observed',
    source:reference(macseUrl,'Printed/PDF p. 6 Table 2 TOTAL, maximum selected MW; p. 7 Table 3, numbered storage systems 1–14. The report does not give the contract term.'),
  },
  gaps: {
    'GAP-IT-MACSE-MW': {status:'partly-resolved',fallback:'MW, MWh and system count verified in the detailed report. Contract term remains unverified; no observed term label.',source:reference(macseUrl,'pp. 5–7; no contract-tenor field')},
    'GAP-IT-DY27': {status:'open',fallback:'Use the labelled repository record; withhold quantitative legacy-payment comparison pending Annex 3.',source:reference('https://www.terna.it/it/sistema-elettrico/mercato-capacita','Capacity-market document page and targeted Annex 3 search checked; exact delivery-2027 annex not located.')},
    'GAP-IT-STACK': {status:'open',fallback:'Never stacked. Candidate eligibility clause found; confirm the applicable approved vintage before treating it as a final compatibility ruling.',source:reference(rulesUrl,'Art. 7.1(c), pp. 18–19: no capacity-market post-auction nomination, except a subsequently terminated contract. Cover retains approval-date placeholder; applicability not assumed.')},
  },
  chart: {id:'Chart-IT-FORK',quantitativeReady:false,fallback:['Example: two contract shapes','示例：两种合同形态'],reason:'Annex 3 and applicable contract terms remain open. No new-entry capacity price.'},
};

/** Market-local registration keeps manual records out of the six-hour feeds,
    price validators and initial application graph. */
export const IT_STORY_DATASETS = {[IT_AUCTION_RESULTS.id]:IT_AUCTION_RESULTS};

/** Teaching arithmetic only, gross contracted payments, never a case return. */
export function forkPayments({hours,capacityPremium,factor,macsePremium}){
  const valid = v => typeof v==='number' && Number.isFinite(v) && v>=0;
  return {
    capacity: valid(capacityPremium)&&valid(factor)?capacityPremium*factor:null,
    macse: valid(macsePremium)&&valid(hours)?macsePremium*hours:null,
    unit:'EUR/nameplate-MW/year',
  };
}
