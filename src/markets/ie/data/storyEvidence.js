/* Ireland: the dated primary facts the signed script binds, and their sources.
   Fixed-vintage, analyst-entered records (docs/immersive-experience-plan/
   ie-build-evidence.md §3). This lazy module is not a time series, an ETL
   snapshot or an investment-model input.

   Every observation carries its own source: primary URL, locator, check date,
   unit and authority. A field the evidence records as unavailable is null and
   stays null; it is never zero, an estimate or a press-only date.            */

const inherited = '2026-10-31';   // read for the 1 November review
const checked = '2026-11-02';     // primary item re-checked for the build decision

/** A source record: what was read, where, and when. */
const src = (title, url, locator, checkedOn = inherited) => ({ title, url, locator, checkedOn });

export const IE_SOURCES = {
  'SRC-IE-01': src('SEM Committee, “SEM”', 'https://www.semcommittee.com/sem',
    'Opening paragraphs: the all-island Single Electricity Market, its go-live and the new market arrangements. Web page; page and table not applicable.'),
  'SRC-IE-03': src('EirGrid and SONI, DS3 Programme Overview 2011', 'https://cms.eirgrid.ie/sites/default/files/publications/DS3-Programme-Overview-2011.pdf',
    'PDF p. 2 §1, programme-established paragraph; frequency workstream, rate of change of frequency as the key limit above 50% SNSP.'),
  'SRC-IE-04': src('EirGrid Group, “DS3 Programme”', 'https://www.eirgridgroup.com/how-the-grid-works/ds3-programme/',
    '“What DS3 achieved”, two milestone paragraphs (2018, 2021, March 2022). Web page; page and table not applicable.'),
  'SRC-IE-05': src('SEM Committee, SEM-19-062 System Services Fixed Contracts Procurement Outcomes, Information Paper, 13 November 2019',
    'https://www.semcommittee.com/files/semcommittee/media-files/SEM-19-062%20-%20System%20Services%20Fixed%20Contracts%20Procurement%20Outcomes%20-%20Information%20note.pdf',
    'Cover publication date; p. 3 §2 five-services paragraph; p. 4 §3 outcome and aggregate contracted-volume paragraph.'),
  'SRC-IE-07': src('SEM Committee, SEM-25-031 FASS: System Services Regulated Arrangements to Future Arrangements – The Gap, Decision Paper, 23 June 2025',
    'https://www.semcommittee.com/files/semcommittee/2025-06/SEM-25-031%20System%20Services%20Regulated%20Arrangements%20to%20FASS%20-%20The%20Gap%20-%20Decision%20Paper.pdf',
    'Executive summary p. 2; Decision 1, PDF p. 10 / printed p. 9 for the long-stop date; Decisions 1–2 and pp. 2–3 for over-procurement.'),
  'SRC-IE-08': src('EirGrid and SONI, FASS Programme Phased Implementation Roadmap V3.0, June 2025',
    'https://cms.soni.ltd.uk/sites/default/files/publications/FASS-TSOs-PIR-June%202025-SONI.pdf',
    'Introduction and programme status: December 2026 no longer viable, May 2027 set.'),
  'SRC-IE-12': src('SEMO, 2028/2029 T-4 Final Capacity Auction Results, FCAR2829T-4 v1.0, 16 January 2025',
    'https://www.sem-o.com/sites/semo/files/documents/general-publications/20282029-T-4-Final-Capacity-Auction-Results-Report-FCAR2829T-4.pdf',
    'Cover and §4.1 clearing-price sentence; Table 7 battery storage by technology class.'),
  'SRC-IE-13': src('SEM Committee, SEM-25-019 CRM 2028/29 T-4 Auction, Volumes Information Note, 3 June 2025',
    'https://www.semcommittee.com/files/semcommittee/2025-06/2028%2029%20T-4%20Volumes%20Information%20Paper%20SEM-25-019%20for%20publication.pdf',
    'p. 21: de-rated and rated battery quantities.'),
  'SRC-IE-14': src('SEMO, 2029/2030 T-4 Initial Auction Information Pack, IAIP2930T-4 v1.1, 13 August 2025',
    'https://www.sem-o.com/sites/semo/files/2025-08/IAIP2930T-4.pdf',
    'Table 3, Other Storage, row 40 < IC ≤ 50 MW and its 1/2/4/6/8-hour columns; Table 30 de-rating curves final at IAIP.'),
  'SRC-IE-16': src('SEMO, Capacity Market Settlement training (I-SEM, 1 September 2017); SEM Committee, SEM-16-073 CRM Parameters Consultation',
    'https://www.sem-o.com/sites/semo/files/documents/training/Capacity-Market-Settlement.pdf',
    'Training slides on supplier charging, strike price and difference payments; SEM-16-073 cited through the same training, search extract only.'),
  'SRC-IE-17': src('SEM Committee, SEM-26-037 High level design options for CRM 2.0, Consultation Paper, 3 July 2026',
    'https://www.semcommittee.com/files/semcommittee/2026-07/sem-26-037-consultation-crm-design-options_v200.pdf',
    'Executive summary; §2.1 delivery timeframe, PDF p. 9 / printed p. 8, proposed T-5 and T-1 bullets; §2.3 de-rating factors. Consultation, not a decision.'),
  'SRC-IE-18': src('CSO, Data Centres Metered Electricity Consumption 2025, release dated 7 July 2026',
    'https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/index.html',
    'Infographic transcript, data-centre row, 2025 column. Republic of Ireland metered electricity; the direct key-findings page refused the reader, the release transcript was opened instead.'),
  'SRC-IE-19': src('Department of Climate, Energy and the Environment, press release on the Greenlink interconnector',
    'https://www.gov.ie/en/department-of-climate-energy-and-the-environment/press-releases/minister-obrien-welcomes-new-electricity-interconnector-as-it-begins-powering-irelands-and-the-uks-energy-grids',
    'Opening paragraphs: commercial operation in 2025. Listing only; the host refused the download.'),
  'SRC-IE-20': src('EirGrid, Celtic Interconnector programme', 'https://www.eirgrid.ie/celticinterconnector',
    'Programme status: planned. Repository record; no capacity, route or landing point is taken from it.'),
  'SRC-IE-21': src('SEMO, T-4 Final Capacity Auction Results reports, delivery years 2022/23 to 2029/30 (2029/30 is FCAR2930T-4 v1, 5 May 2026)',
    'https://www.sem-o.com/sites/semo/files/2026-05/2029_2030%20T-4%20Final%20Capacity%20Auction%20Results%20Report%20FCAR2930T-4.pdf',
    'Per-row locators in CALC-IE-CRM. 2029/30: p. 4 held date, p. 5 Table 1 clearing price, p. 9 Table 3 awarded MW, p. 10 Tables 5–6 participation.'),
  'SRC-IE-22': src('SEMO, T-4 Initial Auction Information Packs, delivery years 2022/23 to 2030/31 (2030/31 is IAIP3031T-4 v1.0, 4 August 2026)',
    'https://www.sem-o.com/sites/semo/files/2026-08/IAIP3031T-4.pdf',
    'Table 3, Other Storage, row 40 < IC ≤ 50 MW in each pack; 2030/31 columns 2/4/8/12-hour. Initial pack, not an auction result.'),
  'SRC-IE-24': src('EirGrid, Future Markets industry workshop presentations, 24 June 2026 and 21 October 2026',
    'https://cms.eirgrid.ie/sites/default/files/publications/FM-Industry-Workshop-Presentation-October-2026.pdf.pdf',
    '“FASS Summary Status”: programme red, PIR v4.0 in drafting, no go-live date. Checked through 21 October 2026.'),
  'SRC-IE-S1': src('SEM Committee, SEM-17-022 CRM Parameters Decision Paper (source supplement registered for this build)',
    'https://www.semcommittee.com/files/semcommittee/media-files/SEM-17-022%20CRM%20Parameters%20Decision%20Paper_1.pdf',
    'Printed p. 93, §§7.1.1 and 7.2.1: maximum multi-year reliability-option term.'),
  'REPO-IE-LIVE': { title: 'REPO-IE-LIVE', url: '/markets/ireland#bankable',
    locator: 'Current briefing row, selected play and investment summary for the selected lens.',
    checkedOn: inherited },
};

/** One observation: value, unit, authority, arithmetic and its own locator. */
const obs = (value, unit, sourceId, locator, extra = {}) => ({
  value, unit, authority: 'observed',
  source: { id: sourceId, url: IE_SOURCES[sourceId].url, locator, checkedOn: IE_SOURCES[sourceId].checkedOn },
  ...extra,
});

const label = {
  'H-IE-01': ['the all-island Single Electricity Market goes live', '全岛单一电力市场上线'],
  'H-IE-02': ['the operators start the DS3 programme', '运营商启动DS3计划'],
  'H-IE-03': ['the redesigned market goes live, with capacity auctions', '新市场设计上线，引入容量拍卖'],
  'H-IE-04': ['fixed-term fast-services contracts awarded; all winners are batteries', '授予快速服务固定期限合同，中标者均为电池'],
  'H-IE-05': ['the non-synchronous limit reaches the final level', '非同步电源占比上限达到最终水平'],
  'H-IE-06': ['regulators set the DS3 long-stop and rule out further extension', '监管机构设定DS3最终截止日，并明确不再延期'],
};

export const IE_STORY_EVIDENCE = {
  id: 'ie-story-evidence',
  kind: 'fixed-vintage-table',
  entry: 'analyst-entered',
  refresh: 'review when a cited document is replaced',
  vintage: checked,
  bearsOn: [],

  /* Event dates, not publication dates. Where a document states only a year or
     a month, the stored precision says so; no first day is invented. */
  history: {
    'H-IE-01': {
      eventDate: obs('2007-11-01', 'day', 'SRC-IE-01', 'Opening paragraphs: SEM go-live date. Page/table not applicable.'),
      precision: 'day', label: label['H-IE-01'], sources: ['SRC-IE-01'],
    },
    'H-IE-02': {
      eventDate: obs('2011', 'year', 'SRC-IE-03', 'PDF p. 2 §1, programme-established paragraph, read with the document date.'),
      precision: 'year', label: label['H-IE-02'], sources: ['SRC-IE-03', 'SRC-IE-04'],
    },
    'H-IE-03': {
      eventDate: obs('2018-10-01', 'day', 'SRC-IE-01', 'New-market-arrangements paragraph. No first-capacity-auction date is inferred.'),
      precision: 'day', label: label['H-IE-03'], sources: ['SRC-IE-01'],
    },
    'H-IE-04': {
      eventDate: obs('2019', 'year', 'SRC-IE-05', 'Cover: published 13 November 2019; p. 4 §3 outcomes. The award year is 2019, not the publication day.'),
      precision: 'year', publishedOn: '2019-11-13', label: label['H-IE-04'], sources: ['SRC-IE-05'],
    },
    'H-IE-05': {
      eventDate: obs('2022-03', 'month', 'SRC-IE-04', '“What DS3 achieved”, milestone paragraph. Month precision preserved.'),
      precision: 'month', label: label['H-IE-05'], sources: ['SRC-IE-04'],
    },
    'H-IE-06': {
      eventDate: obs('2025-06-23', 'day', 'SRC-IE-07', 'Cover decision date, not the future long-stop.'),
      precision: 'day', label: label['H-IE-06'], sources: ['SRC-IE-07'],
    },
  },

  /* An operating limit, not the annual renewable share. Two dated steps and
     the final one; no intermediate date is added. */
  snsp: {
    steps: [
      { date: '2018', precision: 'year', qualifier: 'by', limitShare: obs(.65, 'share', 'SRC-IE-04', '“What DS3 achieved”, first milestone paragraph: 65 / 100 by 2018.', { arithmetic: '65 / 100' }) },
      { date: '2021', precision: 'year', qualifier: 'in', limitShare: obs(.70, 'share', 'SRC-IE-04', 'Same paragraph, second step: 70 / 100 in 2021.', { arithmetic: '70 / 100' }) },
      { date: '2022-03', precision: 'month', qualifier: 'in', limitShare: obs(.75, 'share', 'SRC-IE-04', 'Same paragraph, final step: 75 / 100 in March 2022.', { arithmetic: '75 / 100' }) },
    ],
    sources: ['SRC-IE-04'],
  },

  /* Five identifiers share one contracted volume; the MW is not multiplied
     by five and no winner is named. */
  vc: {
    awardedMW: obs(110, 'MW', 'SRC-IE-05', 'p. 4 §3 aggregate outcome paragraph and the contract-size table; 110 × 1.'),
    winnerCount: obs(3, 'count', 'SRC-IE-05', 'Same aggregate paragraph; 3 × 1. Winners’ names are not copied.'),
    serviceCount: obs(5, 'count', 'SRC-IE-05', 'Count of the five services named at p. 3 §2; length of serviceCodes.'),
    serviceCodes: ['FFR', 'POR', 'SOR', 'TOR1', 'TOR2'],
    sources: ['SRC-IE-05', 'SRC-IE-06'],
  },

  ds3: {
    longStopDate: obs('2027-09-30', 'day', 'SRC-IE-07', 'Decision 1, PDF p. 10 / printed p. 9: date parsed directly.'),
    /* No confirmed successor date in the opened evidence. Never populated from
       a target, a roadmap year or an operating-year decay. */
    successorStartDate: {
      value: null, unit: 'day', authority: 'official-plan',
      source: { id: 'SRC-IE-24', url: IE_SOURCES['SRC-IE-24'].url, locator: IE_SOURCES['SRC-IE-24'].locator, checkedOn: '2026-10-21' },
      reason: 'No confirmed go-live date in the TSO workshops; programme reported red, PIR v4.0 in drafting.',
    },
    sources: ['SRC-IE-07', 'SRC-IE-24'],
  },

  /* A mechanism maximum, conditional on qualifying and approval. It does not
     overwrite the reference case's own secured tenor. */
  ro: {
    maxYears: obs(10, 'years', 'SRC-IE-S1', 'Printed p. 93, §§7.1.1 and 7.2.1, maximum multi-year term; 10 × 1.', {
      conditional: 'qualifying capacity and approval',
      supplement: 'SRC-IE-S1 registered as a source supplement for this build; not a claim that an asset holds ten years.',
    }),
    sources: ['SRC-IE-16', 'SRC-IE-S1'],
  },

  dataCentres: {
    year: obs(2025, 'calendar-year', 'SRC-IE-18', 'Infographic transcript, data-centre row, 2025 column; observation year, release dated 2026-07-07.'),
    share: obs(.23, 'share', 'SRC-IE-18', 'Same transcript and column: 23 / 100. Republic of Ireland metered electricity, not all-island demand.', { arithmetic: '23 / 100' }),
    sources: ['SRC-IE-18'],
  },

  /* Proposed in a consultation: labelled as proposed wherever printed. */
  crmRedesign: {
    mainLeadYears: obs(5, 'years', 'SRC-IE-17', '§2.1, PDF p. 9 / printed p. 8, proposed T-5 bullet.'),
    topUpLeadYears: obs(1, 'years', 'SRC-IE-17', 'Same page, proposed T-1 bullet.'),
    status: 'proposal',
    sources: ['SRC-IE-17'],
  },

  /* GAP-IE-LINKS: a schematic boundary and trading links, no capacity. */
  map: {
    interconnectorMW: null,
    interconnectorCount: null,
    celticExpectedYear: null,
    plannedCeltic: true,
    state: 'planned',
    gapIds: ['GAP-IE-LINKS'],
    sources: ['SRC-IE-19', 'SRC-IE-20'],
  },

  /* Excluded numerical scope, recorded so a later build cannot fill it by
     accident: GAP-IE-DS3-TERMS and the first-auction-date gate. */
  excluded: {
    responseTimes: null,
    serviceTariffs: null,
    firstCapacityAuctionDate: null,
  },

  gaps: {
    'GAP-IE-CRM': {
      status: 'open',
      fallback: 'Price and credit history may be drawn; the awarded-volume toggle covers 2026/27–2029/30 only. Earlier battery totals stay null.',
      closes: 'A reviewed sum of the earlier final reports’ unit tables, with cohort classification, locators and arithmetic.',
    },
    'GAP-IE-DS3-TERMS': {
      status: 'open',
      fallback: 'Service purposes only. No seconds, minutes, response thresholds or service rates.',
      closes: 'The applicable DS3 protocol with version, clause, page, service row and technical definitions.',
    },
    'GAP-IE-LINKS': {
      status: 'open',
      fallback: 'Schematic boundary and trading links only; no interconnector MW, count, landing point or cable route.',
      closes: 'Analyst review of the operator’s complete link list, state, capacity definition and dated pages.',
    },
  },
};

/** Market-local registration: manual records stay out of the six-hour feeds. */
export const IE_STORY_DATASETS = { [IE_STORY_EVIDENCE.id]: IE_STORY_EVIDENCE };

/** Share as the site prints it: whole percent. */
export const percent = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v * 100) + '%' : null);
