/* NEM story evidence: analyst-entered, fixed-vintage records (GAP-NEM-QED,
   GAP-NEM-CIS). No connector, no ETL, no catalogue dataset. Every value was
   re-read from its primary source on 5 November 2026; per-value locators are in
   storyEvidenceProvenance.js, which loads only when a reader opens a source
   disclosure.

   Rights switch (Chart-NEM-SPREAD, Chart-NEM-DAY): ON. The analyst cleared
   AEMO's price-derived series at the G-2 review on 5 November 2026, under
   AEMO's copyright permissions with attribution. nem-05, nem-06 and nem-07
   draw the observed layers from storyEvidenceObserved.js. Setting `mode` back
   to 'example' (and the four price fields to null) restores the unscaled
   Example (nem-build-evidence.md §5). */
import { NEM_STORY_OBSERVED as O } from './storyEvidenceObserved.js';

export const NEM_STORY_VALUES = {
  marketId: 'nem',
  rights: {
    status: 'cleared',
    clearanceRef: 'Analyst decision at the NEM G-2 review, 5 November 2026 (nem-g2-checklist.md, decision 1)',
    mode: 'observed',
    scope: 'AEMO price-derived series: battery price spreads (NEM, WEM, regional) and time-of-day spot prices',
  },
  /* Source list for the shell's Sources disclosure: title, link, check date.
     Exact locators live per value in storyEvidenceProvenance.js. */
  sources: {
    'SRC-NEM-01': { title: 'AEMC, National Electricity Market', url: 'https://www.aemc.gov.au/energy-system/electricity/electricity-system/NEM', checkedOn: '2026-10-30' },
    'SRC-NEM-02': { title: 'AEMC Reliability Panel, 2026 Reliability Standard and Settings Review, draft report', url: 'https://www.aemc.gov.au/sites/default/files/2025-11/2026%20RSSR%20-%20Draft%20Report%20-%20Clean%20%282%29.pdf', checkedOn: '2026-10-30' },
    'SRC-NEM-03': { title: 'AEMO, About the National Electricity Market (NEM)', url: 'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/about-the-national-electricity-market-nem', checkedOn: '2026-11-05' },
    'SRC-NEM-04': { title: 'AEMO, National Electricity Market fact sheet', url: 'https://www.aemo.com.au/-/media/files/electricity/nem/national-electricity-market-fact-sheet.pdf?rev=aa2c6b7c33a84370b50f4f8ebfe404b2', checkedOn: '2026-11-05' },
    'SRC-NEM-05': { title: 'AEMO, Quarterly Energy Dynamics Q3 2026', url: 'https://www.aemo.com.au/-/media/files/major-publications/qed/2026/qed-q3-2026.pdf?rev=921852e545444c2aa215f847859bc8e0&sc_lang=en&hash=03B291B360CA7AD9F7443A500E440D70', checkedOn: '2026-11-05' },
    'SRC-NEM-06': { title: 'AEMO, Quarterly Energy Dynamics Q3 2026 workbook', url: 'https://www.aemo.com.au/-/media/files/major-publications/qed/2026/qed-q3-2026-databook.xlsx?rev=a80a4d7ae2d24cbca1ae96884516e7a0&sc_lang=en&hash=3F6C86FB81AEBFF9349174EA1E9A3E8A', checkedOn: '2026-11-05' },
    'SRC-NEM-07': { title: 'AEMO, Quarterly Energy Dynamics Q2 2026', url: 'https://www.aemo.com.au/-/media/files/major-publications/qed/2026/qed-q2-2026.pdf?rev=5cfa9aa6b7b6490ab22a13de588f9a66&sc_lang=en', checkedOn: '2026-11-05' },
    'SRC-NEM-08': { title: 'AusEnergy Services Limited, CIS Tender 10 – NEM Dispatchable Capacity: Tender Guidelines', url: 'https://asl.org.au/-/media/services/files/cis/cis-t10-nem/260623-cis-tender-10-nem-dispatchable-capacity-tender-guidelines.pdf?rev=9a4dbc9fb60c4f7e9bef2f03f11c515c&sc_lang=en', checkedOn: '2026-11-05' },
    'SRC-NEM-09': { title: 'AusEnergy Services Limited, CIS Tender 10 – NEM Dispatchable Capacity', url: 'https://asl.org.au/tenders/cis-tender-10-nem-dispatchable', checkedOn: '2026-11-05' },
    'SRC-NEM-10': { title: 'DCCEEW, Capacity Investment Scheme', url: 'https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme', checkedOn: '2026-11-05' },
    'SRC-NEM-11': { title: 'DCCEEW, Closed CIS tenders', url: 'https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/closed-cis-tenders', checkedOn: '2026-11-05' },
    'SRC-NEM-12': { title: 'DCCEEW, Progress on CIS Projects and Tenders', url: 'https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/progress-projects-tenders', checkedOn: '2026-11-05' },
    'SRC-NEM-13': { title: 'DCCEEW, Capacity Investment Scheme Agreements Project Register', url: 'https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/projects-register', checkedOn: '2026-11-05' },
    'SRC-NEM-14': { title: 'NEM Review expert panel, NEM wholesale market settings review: final report', url: 'https://www.energy.gov.au/sites/default/files/2025-12/national-electricity-market-wholesale-market-settings-review-final-report.pdf', checkedOn: '2026-11-05' },
    'SRC-NEM-15': { title: 'DCCEEW, NEM wholesale market settings review', url: 'https://www.dcceew.gov.au/energy/markets/nem-wms-review', checkedOn: '2026-11-05' },
    'SRC-NEM-16': { title: 'AEMC, Five Minute Settlement', url: 'https://www.aemc.gov.au/rule-changes/five-minute-settlement', checkedOn: '2026-11-05' },
    'SRC-NEM-17': { title: 'AEMC, Integrating energy storage systems into the NEM', url: 'https://www.aemc.gov.au/rule-changes/integrating-energy-storage-systems-nem', checkedOn: '2026-11-05' },
    'SRC-NEM-18': { title: 'AEMO, Black System South Australia 28 September 2016 – Final Report', url: 'https://www.aemo.com.au/-/media/Files/Electricity/NEM/Market_Notices_and_Events/Power_System_Incident_Reports/2017/Integrated-Final-Report-SA-Black-System-28-September-2016.pdf', checkedOn: '2026-11-05' },
    'SRC-NEM-19': { title: 'AEMO, Loss factors and regional boundaries', url: 'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/market-operations/loss-factors-and-regional-boundaries', checkedOn: '2026-11-05' },
    'SRC-NEM-20': { title: 'AEMO, Quarterly Energy Dynamics Q4 2019', url: 'https://www.aemo.com.au/-/media/files/major-publications/qed/2019/qed-q4-2019.pdf', checkedOn: '2026-11-05' },
    'SRC-WA-09': { title: 'Government of Western Australia, Electricity System and Market Rules, consolidated to 1 October 2026', url: 'https://www.wa.gov.au/system/files/2026-09/electricity_system_and_market_rules_-_1_october_2026.pdf', checkedOn: '2026-10-30' },
    'REPO-NEM-LIVE': { title: 'Current investment case', url: '/markets/nem#bankable', checkedOn: '2026-11-05' },
    'SRC-NE-01': { title: 'Natural Earth, 1:50m admin-1 states and provinces (public domain)', url: 'https://www.naturalearthdata.com/', checkedOn: '2026-11-05' },
    'SRC-WA-11': { title: 'AEMO, About the Wholesale Electricity Market (WEM)', url: 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/about-the-wholesale-electricity-market-wa-wem', checkedOn: '2026-10-30' },
    'SRC-WA-10': { title: 'Government of Western Australia, Electricity Market Review Options Paper, December 2014', url: 'https://www.parliament.wa.gov.au/publications/tabledpapers.nsf/displaypaper/3912753a03050f0631a7781848257e120028dc9e/$file/2753.pdf', checkedOn: '2026-10-30' },
  },
  /* Quarterly Energy Dynamics, Q3 2026 vintage (published October 2026). */
  qed: {
    vintage: '2026-Q3',
    quarters: ['2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3'],
    nemDischargeMW: [85.7, 89.8, 97.8, 161.6, 214.5, 267.9, 359.4, 475.6, 680.0],
    wemDischargeMW: [13.4, 34.8, 35.2, 53.0, 80.3, 104.6, 142.6, 128.9, 160.0],
    dailyChargeGWh: { latest: 13.4, yearBefore: 3.7 },
    eveningDischargeGWh: { latest: 10.9, yearBefore: 3.2 },
    priceSettingShare: { latest: 0.48, yearBefore: 0.18 },
    fcasRevenueShare: 0.023,
    fcasVolumeShare: 0.75,
    /* Price-derived: from the observed records while rights.mode is 'observed'. */
    nemSpreadAUDPerMWh: O.nemSpreadAUDPerMWh,
    wemSpreadAUDPerMWh: O.wemSpreadAUDPerMWh,
    regionalSpreadAUDPerMWh: O.regionalSpreadAUDPerMWh,
    timeOfDayPriceAUDPerMWh: O.timeOfDayPriceAUDPerMWh,
  },
  /* CIS Tender 10 Tender Guidelines, Table 5. Floor, ceiling and payment cap
     are bid variables, fixed nominal amounts, and are never stored or drawn. */
  cisa: { floorSupportShare: 0.9, ceilingSharingShare: 0.5, maxTermYears: 15 },
  /* NEM dispatchable rounds. Results are subject to signing; never totalled. */
  tenders: [
    { id: 'nsw-pilot', kind: 'pilot', status: 'announced', announcedOn: '2023-11-22', projects: 6, mw: 1075, mwh: null },
    { id: 'sa-vic-pilot', kind: 'pilot', status: 'announced', announcedOn: '2024-09-04', projects: 6, mw: 995, mwh: 3626 },
    { id: 'tender-3', kind: 'dispatchable', status: 'announced', announcedOn: '2025-09-16', projects: 16, mw: 4130, mwh: 15370 },
    { id: 'tender-8', kind: 'dispatchable', status: 'announced', announcedOn: '2026-06-24', projects: 15, mw: 4200, mwh: 16100 },
    { id: 'tender-10', kind: 'dispatchable', status: 'assessing', bidsClosedOn: '2026-08-18', resultsExpected: '2026-12', projects: null, mw: null, mwh: null },
  ],
  /* Project register: dispatchable (battery) agreements by stage, register-wide
     and for the NEM alone. */
  register: { correctAsAt: '2026-10-23', batteryAgreements: 17, batteryOperating: 0, batteryConstruction: 9, batteryDevelopment: 7, batteryNoStage: 1, batteryInWem: 2,
    /* NEM only (the story binds these): the register less its two WEM entries,
       both under construction. Analyst decision 3, 5 November 2026. */
    nem: { batteryAgreements: 15, batteryOperating: 0, batteryConstruction: 7, batteryDevelopment: 7, batteryNoStage: 1 } },
  history: {
    'H-NEM-01': { when: '1998' },
    'H-NEM-02': { when: '2016' },
    'H-NEM-03': { when: '2017/2021' },
    'H-NEM-04': { when: '2021' },
    'H-NEM-05': { when: '2023/2027' },
    'H-NEM-06': { when: 'outlook' },
  },
  teaching: { powerMW: 100 },
};
