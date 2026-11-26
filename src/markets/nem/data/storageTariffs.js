// Published network use-of-system charges excluding GST. Energy charges are
// cents/kWh. Export credits are positive and export charges are negative.
const edition = { financialYear: '2026-27', effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30',
  readOn: '2026-11-26', fixedUnit: 'AUD/site/day', energyUnit: 'c/kWh' };

export const STORAGE_TARIFFS = [
  { ...edition, id: 'essential', distributor: 'Essential Energy', code: 'BHND4LS', region: 'NSW1', timezone: 'Australia/Sydney',
    source: 'https://www.essentialenergy.com.au/-/media/Project/EssentialEnergy/Website/Files/Our-Network/PriceListAndExplanatoryNotes2026-27.pdf',
    page: 'Price list p. 1, storage assignment and time bands pp. 4–7', fixed: 27.4319,
    demand: { basis: 'monthlyBands', unit: 'AUD/kVA/month', peak: 12.5825, shoulder: 11.2496, off: 3.8099 },
    energy: { sun: [0, -0.9850], peak: [0, 0], shoulder: [0, 0], off: [0, 0] },
    windows: ['All days. Solar 10–15, peak 17–20, off-peak 22–07, otherwise shoulder.',
      '每日。日间 10–15 时，高峰 17–20 时，低谷 22–次日 7 时，其余为平段。'],
    eligibility: ['New HV storage or hybrid connection with ancillary load only. Confirm the site meter clock in the Far West.',
      '新接入高压储能或混合项目，仅允许辅助负荷。远西地区需核对电表时区。'] },
  { ...edition, id: 'ausgrid', distributor: 'Ausgrid', code: 'EA374 / EA375', region: 'NSW1', timezone: 'Australia/Sydney',
    source: 'https://aopt-p-001.sitecorecontenthub.cloud/api/public/content/a6b7b18dc0e84cda9ab067f61a6bbab7?v=21f13674',
    page: 'Approved price list p. 3, ES7 section 3.9', fixed: 31.664801, demand: null,
    energy: { ordinary: [1.9792, 0], event: [48.7511, 44.7700] },
    windows: ['Retailer-notified critical demand events. Other intervals use the ordinary rate.',
      '高峰时段以零售商通知的关键需量事件为准，其余时段适用普通费率。'],
    eligibility: ['Paired high-voltage storage import and export tariffs. The historical event calendar is required.',
      '高压储能购售电配套费率。核算需取得历史关键需量事件日历。'] },
  { ...edition, id: 'endeavour', distributor: 'Endeavour Energy', code: 'N29', region: 'NSW1', timezone: 'Australia/Sydney',
    source: 'https://edge.sitecorecloud.io/endeavouren152b-endeavouren7772-production9ea5-b88d/media/Endeavour-Energy/Publications/Documents/NUOS-Price-List.pdf',
    page: 'Price list table 1a, PDF p. 37, sections 4 and 6', fixed: 84.65,
    demand: { basis: 'monthlyPeakPerDay', unit: 'AUD/kVA/day', high: 0.4196, low: 0.4140 },
    energy: { high: [2.9405, 0], low: [2.8733, 0], off: [2.7231, 0] },
    windows: ['Peak 16–20 on NSW business days. November to March is high season.',
      '新州工作日 16–20 时为高峰，11 月至次年 3 月为高季。'],
    eligibility: ['Standard metered HV import and a standard export-meter code. Individual connection terms can differ.',
      '适用于常规高压计量购电及标准出口计量代码，单独约定的接入条款需另核。'] },
  { ...edition, id: 'powercor', distributor: 'Powercor', code: 'PFL', region: 'VIC1', timezone: 'Australia/Melbourne',
    source: 'https://media.powercor.com.au/documents/Network-pricing/CPPC-Flexible-Network-tariffs-fact-sheet.pdf',
    page: 'Flexible Large, p. 2', fixed: 0,
    minimumImportKvaExclusive: 240, maximumImportKvaExclusive: 30000,
    demand: { basis: 'rollingImportKw', unit: 'AUD/kW/month', anytime: 1.25 },
    energy: { peak: [7, 0], off: [0, 0] },
    windows: ['Peak 16–21 in December–February and June–August. Capacity uses the rolling 12-month maximum import.',
      '12–2 月和 6–8 月的 16–21 时为高峰。容量费取滚动 12 个月的最大购电功率。'],
    eligibility: ['Flexible import capacity above 240 kVA and below 30 MVA. Site operating limits follow the connection agreement.',
      '灵活接入容量须大于 240 kVA 且低于 30 MVA，项目实际运行上限以接入协议为准。'] },
  { ...edition, id: 'sapn', distributor: 'SA Power Networks', code: 'HVBG / HVBGCBD', region: 'SA1', timezone: 'Australia/Adelaide',
    source: 'https://www.sapowernetworks.com.au/public/download.jsp?id=338670',
    page: 'Table 8, PDF p. 29, total NUoS schedule PDF p. 36', fixed: 0,
    demand: { basis: 'rollingAnnualDemand', unit: 'AUD/kVA/day', peak: 0.2696, anytime: 0.0849 },
    energy: { ordinary: [0, 0] },
    windows: ['November–March peak. Non-CBD 17–21 daily or CBD 11–17 weekdays. Peak uses a daily average and anytime demand uses a half hour.',
      '11 月至次年 3 月计高峰需量。非 CBD 为每日 17–21 时，CBD 为工作日 11–17 时。高峰取窗口日均，全天需量取半小时最大值。'],
    eligibility: ['Standard HV business generation connection. Select the applicable CBD or non-CBD location.',
      '常规高压发电类接入，按项目位置选择 CBD 或非 CBD 口径。'] },
  { ...edition, id: 'energex', distributor: 'Energex', code: '92000', region: 'QLD1', timezone: 'Australia/Brisbane',
    source: 'https://www.energex.com.au/__data/assets/excel_doc/0010/1985968/Energex-2026-27-Network-Price-List-Updated-for-Sch-8.xlsx',
    guide: 'https://www.energex.com.au/__data/assets/pdf_file/0011/2058077/Energex-Network-Tariff-Guide-2026-27.pdf',
    page: 'CAC!C13:I13, units in row 7, tariff guide pp. 26–27', fixed: 74.237, demand: null,
    energy: { peak: [0.639, 0], shoulder: [0, 0], off: [0, 0] },
    windows: ['Weekday peak 17–20. Every day 11–13 is off-peak. Remaining hours are shoulder.',
      '工作日 17–20 时为高峰，每日 11–13 时为低谷，其余为平段。'],
    eligibility: ['CAC dynamic flexible storage connection. Charging is for export. The agreed operating envelope governs site dispatch.',
      '适用于 CAC 动态灵活储能接入，购电限于再售电，实际调度受接入协议的动态功率范围约束。'] },
];

// Gazetted statewide dates relevant to a trailing-year replay of this edition.
// The August bank holiday is a business day under Endeavour section 6.2.
// https://www.nsw.gov.au/about-nsw/public-holidays
export const NSW_HOLIDAYS = new Set((
  '2025-01-01 2025-01-27 2025-04-18 2025-04-21 2025-04-25 2025-06-09 2025-10-06 2025-12-25 2025-12-26 ' +
  '2026-01-01 2026-01-26 2026-04-03 2026-04-06 2026-04-27 2026-06-08 2026-10-05 2026-12-25 2026-12-28 ' +
  '2027-01-01 2027-01-26 2027-03-26 2027-03-29 2027-04-26 2027-06-14 2027-10-04 2027-12-27 2027-12-28'
).split(' '));
