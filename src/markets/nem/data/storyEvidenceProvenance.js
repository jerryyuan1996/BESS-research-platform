/* Per-value locators for the NEM story evidence. Loaded on demand, only when a
   reader opens a shot's source disclosure. Every value was re-read from the
   primary source in a browser on 5 November 2026 (checkedOn). Paths name a
   field of NEM_STORY_VALUES, or `observed.` for the report-text
   reconciliation record in storyEvidenceObserved.js. */
const QED = 'SRC-NEM-06', REPORT = 'SRC-NEM-05', VINTAGE = 'QED Q3 2026 (October 2026)';
const qed = (locator, unit, arithmetic = 'Workbook cell, rounded to one decimal', kind = 'observed-data') =>
  ({ sourceRef: QED, locator, unit, vintage: VINTAGE, checkedOn: '2026-11-05', arithmetic, kind, rights: 'AEMO copyright permissions, attribution' });
const text = (sourceRef, locator, unit, arithmetic = 'As stated in the source', kind = 'observed-data', vintage = VINTAGE) =>
  ({ sourceRef, locator, unit, vintage, checkedOn: '2026-11-05', arithmetic, kind, rights: 'public-link-only' });

export const NEM_STORY_PROVENANCE = {

  'qed.vintage': text(REPORT, 'Cover; "covering 1 July to 30 September 2026"', 'quarter'),
  'qed.quarters': qed('Figure 56, column I, rows 11–19 (Q3 24 to Q3 26)', 'quarter', 'Labels rewritten as YYYY-Qn'),
  'qed.nemDischargeMW': qed('Figure 56 "NEM-wide battery price spread", column J "Average Discharge", rows 11–19', 'MW'),
  'qed.wemDischargeMW': qed('Figure 107, column L "MW_discharge_avg", rows 5–13 (2024Q3 to 2026Q3)', 'MW'),
  'qed.dailyChargeGWh': text(REPORT, 'Executive summary p. 4, first bullet: charging 13.4 GWh a day 10:00–16:00 in Q3 2026; 3.7 GWh in Q3 2025', 'GWh per day'),
  'qed.eveningDischargeGWh': text(REPORT, 'Executive summary p. 4, first bullet: discharging 10.9 GWh 16:00–21:00 in Q3 2026; 3.2 GWh in Q3 2025', 'GWh per day'),
  'qed.priceSettingShare': text(REPORT, 'Executive summary p. 4: battery charging or discharging set prices in 48% of dispatch intervals, up from 18%; workbook Figure 23 rows 11–12, Battery 23.6% + Battery Charge 24.3% (Q3 26), 9.1% + 9.1% (Q3 25)', 'share of dispatch intervals', 'Report text; workbook sum reconciles to the rounded figure'),
  'qed.fcasRevenueShare': text(REPORT, '§2.4.1 p. 38: "FCAS accounted for only 2.3% of total battery revenue"', 'share of battery net revenue'),
  'qed.fcasVolumeShare': qed('Figure 71 title "Batteries FCAS market share rose to 75%"; cell I10, Battery 0.7459', 'share of FCAS volume', 'Title figure; cell rounds to 75%'),
  'cisa.floorSupportShare': text('SRC-NEM-08', 'Table 5 p. 13, "Revenue Floor Support Percentage (%) 90%"; p. 12 top up of 90% of the difference below the Annual Floor', 'share of shortfall', 'As stated', 'market-rule', 'Tender Guidelines, 23 June 2026'),
  'cisa.ceilingSharingShare': text('SRC-NEM-08', 'Table 5 p. 13, "Revenue Ceiling Sharing Percentage (%) 50%"; p. 12 pay 50% of the excess above the Annual Ceiling', 'share of excess', 'As stated', 'market-rule', 'Tender Guidelines, 23 June 2026'),
  'cisa.maxTermYears': text('SRC-NEM-08', 'Table 5 p. 13, Final Expiry Date: "Maximum of 15 years after the Support Start Date"', 'years', 'As stated', 'market-rule', 'Tender Guidelines, 23 June 2026'),
  'tenders.nsw-pilot': text('SRC-NEM-11', 'CIS NSW tender: results 22 November 2023; 6 successful bids; 1,075 MW. No MWh total stated', 'date; projects; MW', 'As stated; MWh left null rather than summed', 'historical-fact', 'Page last updated 20 July 2026'),
  'tenders.sa-vic-pilot': text('SRC-NEM-11', 'South Australia – Victoria tender: announced 4 September 2024; six projects; 995 MW or 3626 MWh', 'date; projects; MW; MWh', 'As stated', 'historical-fact', 'Page last updated 20 July 2026'),
  'tenders.tender-3': text('SRC-NEM-11', 'CIS Tender 3 – NEM Dispatchable: announced 16 September 2025; 16 projects; 4.13 GW (15.37 GWh)', 'date; projects; MW; MWh', 'GW × 1,000', 'historical-fact', 'Page last updated 20 July 2026'),
  'tenders.tender-8': text('SRC-NEM-11', 'CIS Tender 8 – NEM Dispatchable: announced 24 June 2026; 15 projects; 4.2 GW or 16.1 GWh', 'date; projects; MW; MWh', 'GW × 1,000', 'historical-fact', 'Page last updated 20 July 2026'),
  'tenders.tender-10': text('SRC-NEM-09', 'At a glance: bids closed 18 August 2026; target 4 GW of 4-hour equivalent, or 16 GWh. Results indicatively December 2026 (SRC-NEM-10, "Proposed tender rounds", Tender 10 announced Dec 2026)', 'date', 'As stated; no result exists', 'official-plan', 'Read 5 November 2026'),
  'register.correctAsAt': text('SRC-NEM-13', 'Introduction: "correct as at 23 October 2026"', 'date', 'As stated', 'observed-data', 'Register of 23 October 2026'),
  'register.batteryAgreements': text('SRC-NEM-13', 'Entries with "CISA Type: Dispatchable", pages 1–5 (all 40 entries read)', 'count', 'Counted by reading every entry', 'observed-data', 'Register of 23 October 2026'),
  'register.batteryOperating': text('SRC-NEM-13', 'Dispatchable entries with "Project stage: Operations": none', 'count', 'Counted; the one operating project on the register is a generation agreement', 'observed-data', 'Register of 23 October 2026'),
  'register.batteryConstruction': text('SRC-NEM-13', 'Dispatchable entries at Construction (one entry spells it "Project: Construction")', 'count', 'Counted', 'observed-data', 'Register of 23 October 2026'),
  'register.batteryDevelopment': text('SRC-NEM-13', 'Dispatchable entries at Development', 'count', 'Counted', 'observed-data', 'Register of 23 October 2026'),
  'register.batteryNoStage': text('SRC-NEM-13', 'Dispatchable entry with no stated stage', 'count', 'Counted', 'observed-data', 'Register of 23 October 2026'),
  'register.nem.batteryAgreements': text('SRC-NEM-13', 'Dispatchable entries outside Western Australia', 'count', 'batteryAgreements 17 less batteryInWem 2', 'observed-data', 'Register of 23 October 2026'),
  'register.nem.batteryOperating': text('SRC-NEM-13', 'NEM dispatchable entries at Operations: none', 'count', 'Counted', 'observed-data', 'Register of 23 October 2026'),
  'register.nem.batteryConstruction': text('SRC-NEM-13', 'NEM dispatchable entries at Construction', 'count', 'batteryConstruction 9 less the two WEM entries, both at Construction', 'observed-data', 'Register of 23 October 2026'),
  'register.nem.batteryDevelopment': text('SRC-NEM-13', 'NEM dispatchable entries at Development', 'count', 'Counted; no WEM entry at Development', 'observed-data', 'Register of 23 October 2026'),
  'register.nem.batteryNoStage': text('SRC-NEM-13', 'NEM dispatchable entry with no stated stage', 'count', 'Counted', 'observed-data', 'Register of 23 October 2026'),
  'register.batteryInWem': text('SRC-NEM-13', 'Dispatchable entries located in Western Australia (WEM)', 'count', 'Counted; included in batteryAgreements', 'observed-data', 'Register of 23 October 2026'),
  'history.H-NEM-01.when': text('SRC-NEM-03', 'Paragraph 1: commenced as a wholesale spot market in December 1998', 'year', 'As stated', 'historical-fact', 'Read 5 November 2026'),
  'history.H-NEM-02.when': text('SRC-NEM-18', 'Title and p. 1: Black System, South Australia, 28 September 2016', 'year', 'As stated', 'historical-fact', 'March 2017'),
  'history.H-NEM-03.when': text('SRC-NEM-16', 'Overview: final rule 28 November 2017, settlement every five minutes starting in 2021', 'years', 'As stated', 'historical-fact', 'Rule change completed'),
  'history.H-NEM-04.when': text('SRC-NEM-17', 'Overview: final rule made 2 December 2021', 'year', 'As stated', 'historical-fact', 'Rule change completed'),
  'history.H-NEM-05.when': text('SRC-NEM-10', 'Scope and size: pilots from 2023; tenders rolled out from 2024 to 2027', 'years', 'As stated', 'historical-fact', 'Page last updated 24 June 2026'),
  'history.H-NEM-06.when': text('SRC-NEM-15', 'Energy Ministers to consider the law changes in December 2026; outlook, not a decision', 'outlook', 'Dashed; nothing drawn as completed', 'official-plan', 'Page last updated 14 October 2026'),
  'teaching.powerMW': { sourceRef: 'REPO-NEM-LIVE', locator: 'Evidence specification §4, teaching battery', unit: 'MW', vintage: 'Teaching value', checkedOn: '2026-11-05', arithmetic: 'Example value; never changes the case', kind: 'teaching', rights: 'Platform' },
  /* AEMO price-derived records (storyEvidenceObserved.js), cleared by the
     analyst on 5 November 2026; read through the qed price fields. */
  'qed.nemSpreadAUDPerMWh': qed('Figure 56, column K "Spread", rows 11–19', 'AUD/MWh', 'Workbook cell, rounded to two decimals'),
  'qed.wemSpreadAUDPerMWh': qed('Figure 107, column M "spread_$_MWh", rows 5–13', 'AUD/MWh', 'Workbook cell, rounded to two decimals'),
  'observed.reportText': text(REPORT, 'p. 39: NEM spread $123/MWh (Q3 2025) to $59/MWh (Q3 2026); p. 69: WEM $51/MWh to $2/MWh; SRC-NEM-07 p. 37: $342/MWh to $51/MWh (Q2 2026)', 'AUD/MWh'),
  'qed.regionalSpreadAUDPerMWh': text(REPORT, 'p. 39: SA fell by $82/MWh to $65; QLD $68 and VIC $58; NSW lowest at $51, down $33. Tasmania not reported', 'AUD/MWh', 'Year before: NSW 51 + 33 = 84; SA 65 + 82 = 147; QLD and VIC year-before not stated, left null'),
  'qed.timeOfDayPriceAUDPerMWh': qed('Figure 15, row 11 "Q3 2026" and row 12 "Q3 2025", columns I to KJ (288 intervals, labelled by interval end 00:05 to 24:00, market time)', 'AUD/MWh'),
};
