/* ---------------------------------------------------------------------------
   Ontario — source register.

   Read on 2026-10-23 for docs/ontario-registration-plan.md, which the analyst
   signed off the same day. The contract terms are quoted from IESO's final
   LT2(c-1) contract and RFP; the merchant line is computed from IESO's public
   price reports; the capex observation is Northland Power's final cost for
   Oneida. IESO's terms permit reuse.
   --------------------------------------------------------------------------- */
import { QUOTE_SOURCES } from '../../comparison/supplierQuote.js';

const OFFICIAL = { authority: 'official', publication: 'final', availability: 'public', verification: 'verified' };
const OFFICIAL_DRAFT = { authority: 'official', publication: 'draft', availability: 'public', verification: 'verified' };
const COUNTERPARTY = { authority: 'counterparty-reported', publication: 'final', availability: 'public', verification: 'verified' };

export const SRC = {
  /* The supplier quotation and its MSA — the DC block and the service package. */
  ...QUOTE_SOURCES,

  // ---- the contract -------------------------------------------------------
  lt2Contract: {
    file: 'IESO — LT2(c-1) Contract, consolidated with Addenda 1, 2 and 3',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '4 Nov 2025',
    cy: 'Term from COD to 30 April 2050 (milestone COD 1 May 2030). Monthly payment = indexed fixed capacity payment × Business Days × contract MW × reduction factors, less availability charges, plus a storage regulatory credit. 20% of the price follows Ontario CPI after COD, 80% is fixed; the whole price follows CPI from contract date to COD. The IESO has no interest in the facility\'s other products or services (s.2.10). Duration Capability 8 or 12 hours. Clean Technology ITC excluded from the 50% clawback (s.2.15). Post-bid tariffs above +10% of capex re-open the price (s.2.16).',
    url: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/capacity/LT2c-1-20251104-Contract-Consolidated-with-Addendum-1-and-2-and-3.pdf',
    authority: 'observed', historical: 'Window 1 form', forecast: 'Window 2 drafts posted 9 Oct 2026',
    frequency: 'Per procurement window', format: 'PDF', machineReadable: 'No',
    automation: 'D — a contract is read, not ingested', lastChecked: '2026-10-23', freshness: 'Final form for window 1',
  },
  lt2Rfp: {
    file: 'IESO — LT2(c-1) RFP, consolidated with Addenda 1–4',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '10 Nov 2025',
    cy: 'Up to 600 MW of year-round capacity from new-build dispatchable resources of 1 MW or more able to deliver contract capacity for at least eight consecutive hours in Qualifying Hours; 12 hours earns two rated points. Proposal deadline 18 December 2025. Proposal fee C$11,300; proposal security C$35,000/MW (minimum C$0.5m, maximum C$15m), converted to completion and performance security, C$20,000/MW after COD.',
    url: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/capacity/LT2c-1-20251110-RFP-Consolidated-with-Addendum-1-2-3-4.pdf',
    authority: 'observed', historical: 'Window 1', forecast: 'Window 2 draft, 9 Oct 2026',
    frequency: 'Per procurement window', format: 'PDF', machineReadable: 'No',
    automation: 'D — a procurement document is read, not ingested', lastChecked: '2026-10-23', freshness: 'Final for window 1',
  },
  lt2Results: {
    file: 'IESO — LT2(c-1) RFP final results, with individual prices',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '13 Jul 2026',
    cy: 'Three storage projects, 640 MW: Napanee BESS Phase 2, 300 MW at C$527.20/MW-Business Day (East); Eagle Lake Power Reserve, 190 MW at C$580.50 (Northwest); Simcoe Battery Project, 150 MW at C$614.47 (Southwest). Weighted average C$563.48. All three 50% First Nation-owned.',
    url: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/capacity/LT2c-1-20260702-Public-Result-Table-With-Individual-Prices.pdf',
    authority: 'observed', historical: 'Window 1', forecast: 'None',
    frequency: 'Per procurement window', format: 'PDF table', machineReadable: 'No',
    automation: 'D — analyst review', lastChecked: '2026-10-23', freshness: 'Current',
  },
  lt2Window2: {
    file: 'IESO — Draft LT2(c-2) RFP and Contract, with blacklines to window 1',
    status: ['Official — Draft', '官方 — 草案'], provenance: OFFICIAL_DRAFT,
    date: '9 Oct 2026',
    cy: 'Same eight- and twelve-hour options, the same 20/80 indexation, 7% capacity reduction and tariff clause; milestone COD 1 May 2032 and expiry 30 April 2052; repowered sites may bid under a cap. Target MW and the schedule are still blank.',
    url: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/capacity/LT2-c-2-RFP-20261009-draft.pdf',
    authority: 'official-forecast', historical: 'n/a', forecast: 'Window 2 procurement',
    frequency: 'Per window', format: 'PDF', machineReadable: 'No',
    automation: 'C — a draft is read when revised', lastChecked: '2026-10-23', freshness: 'Draft for discussion',
  },
  lt2Page: {
    file: 'IESO — Long-Term 2 RFP',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '2026',
    cy: 'LT2(c-1) contracts executed with three proponents, 640.00 MW. LT2(e-1) contracts executed with 13 proponents, 1,115.10 MW. Window 2 drafts posted 9 October 2026; preliminary connection guidance 15 October 2026.',
    url: 'https://www.ieso.ca/Sector-Participants/Resource-Acquisition-and-Contracts/Long-Term-2-RFP',
    authority: 'observed', historical: 'Since 2024', forecast: 'Window 2',
    frequency: 'As revised', format: 'HTML', machineReadable: 'No',
    automation: 'B — a page monitor would work', lastChecked: '2026-10-23', freshness: 'Current',
  },
  holidaySchedule: {
    file: 'IESO — Physical and Financial Market Holiday Schedules, 2021–2023',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '2021–2023',
    cy: 'Weekend holidays are listed on the next weekday (27 Dec 2021, 3 Jan 2022, 3 Jul 2023). Less the contract\'s three carve-outs this leaves ten weekday holidays a year, so 250–252 Business Days a contract year, mean 250.90 to April 2050.',
    url: 'https://ieso.ca/Sector-Participants/Calendars/Market-Calendars/2023-Physical-and-Financial-Market-Holiday-Schedule',
    authority: 'observed', historical: 'Annual since 2002', forecast: 'Published each November',
    frequency: 'Annual', format: 'HTML', machineReadable: 'No',
    automation: 'C — read once a year', lastChecked: '2026-10-23', freshness: 'Rule stable',
  },

  // ---- prices ---------------------------------------------------------------
  daZonalPrice: {
    file: 'IESO — Day-Ahead Hourly Ontario Zonal Energy Price report',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '24 Jul – 23 Oct 2026',
    cy: '90 days, every hour priced: mean price C$56.55/MWh; mean daily sum of the eight highest hours less the eight lowest C$325.63/MW. IESO keeps the latest 92 days on its public reports site.',
    url: 'https://reports-public.ieso.ca/public/DAHourlyOntarioZonalPrice/',
    authority: 'observed', historical: 'Rolling 92 days; the day-ahead market began 1 May 2025', forecast: 'None',
    frequency: 'Daily', format: 'XML', machineReadable: 'Yes',
    automation: 'A — public, no key; gate ON-1b is to accumulate it', lastChecked: '2026-10-23', freshness: 'Daily',
  },
  daVirtualZonal: {
    file: 'IESO — Day-Ahead Hourly Virtual Zonal Energy Price report',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '24 Jul – 23 Oct 2026',
    cy: 'Eight-hour spread by zone over the same 90 days: East C$337.70, Southwest C$324.21, Northwest C$294.01 per MW-day; the nine zones span C$294–339.',
    url: 'https://reports-public.ieso.ca/public/DAHourlyZonal/',
    authority: 'observed', historical: 'Rolling', forecast: 'None',
    frequency: 'Daily', format: 'XML', machineReadable: 'Yes',
    automation: 'A — public, no key', lastChecked: '2026-10-23', freshness: 'Daily',
  },
  hoepYearly: {
    file: 'IESO — Yearly HOEP OR Predispatch reports, 2023 and 2024',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '2023–2024',
    cy: 'The real-time price before Market Renewal. Annual eight-hour spread C$58,835/MW (2023) and C$70,081 (2024); the full year ran at 0.859 and 0.875 of the late-July-to-October window. Operating reserve averaged C$4.57 (10-minute spinning), C$4.20 (non-spinning) and C$2.07 (30-minute) per MW-h in 2024.',
    url: 'https://reports-public.ieso.ca/public/PriceHOEPPredispOR/',
    authority: 'observed', historical: '2002 to April 2025', forecast: 'None — retired at Market Renewal',
    frequency: 'Annual file', format: 'CSV', machineReadable: 'Yes',
    automation: 'A — static archive', lastChecked: '2026-10-23', freshness: 'Final (series ended 30 Apr 2025)',
  },

  // ---- capex ----------------------------------------------------------------
  oneidaCost: {
    file: 'Northland Power — commercial operations at the Oneida Energy Storage Project',
    status: ['Counterparty-reported', '交易对手方披露'], provenance: COUNTERPARTY,
    date: '7 May 2025',
    cy: 'Oneida, 250 MW / 1,000 MWh, Haldimand County: "completed with a final cost of approximately $700 million, compared to the initial $800 million estimate at financial close in 2023"; backed by a 20-year IESO capacity contract.',
    url: 'https://northlandpower.com/northland-power-announces-commercial-operations-at-oneida-energy-storage-project-canadas-largest-battery-storage-facility-delivered-ahead-of-schedule-and-below-budget/',
    authority: 'observed', historical: 'One project', forecast: 'None',
    frequency: 'One-off', format: 'HTML release', machineReadable: 'No',
    automation: 'D — a disclosure is read', lastChecked: '2026-10-23', freshness: 'Final cost',
  },
  customsTariff: {
    file: 'CBSA — Customs Tariff T2026, chapter 85; China Surtax Order SOR/2024-187 as amended by SOR/2026-33',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '2026',
    cy: 'Tariff item 8507.60.90 00, lithium-ion accumulators "Other": MFN 7%. The China Surtax Order covers steel and aluminium at 25% only; its EV schedule was repealed by SOR/2026-33 and no heading 8507 is listed.',
    url: 'https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2026/html/00/ch85-eng.html',
    authority: 'observed', historical: 'Annual schedules', forecast: 'None',
    frequency: 'Annual', format: 'HTML', machineReadable: 'No',
    automation: 'C — read when revised', lastChecked: '2026-10-23', freshness: 'T2026; surtax text current to 2026-09-30',
  },
  cleanTechItc: {
    file: 'Income Tax Act s.127.45 — Clean Technology Investment Tax Credit',
    /* Read through the Parliamentary Budget Officer's costing and a law-firm
       bulletin, not the statute itself — hence re-verification (gate ON-4). */
    status: ['Official — Final', '官方 — 最终'], provenance: { ...OFFICIAL, verification: 'requires-reverification' },
    date: '2024',
    cy: 'Refundable credit of 30% of the capital cost of eligible clean technology property, including stationary electricity storage that uses no fossil fuel, available for use before 2034; 15% in 2034 and nothing after. The full rate needs the labour requirements, otherwise 20%.',
    url: 'https://laws-lois.justice.gc.ca/eng/acts/I-3.3/section-127.45.html',
    authority: 'observed', historical: 'In force since 2024', forecast: 'Steps down in 2034',
    frequency: 'Statute', format: 'HTML', machineReadable: 'No',
    automation: 'C — a statute is read', lastChecked: '2026-10-23', freshness: 'Current',
  },

  // ---- the winners and the grid -----------------------------------------
  napaneeOpg: {
    file: 'OPG — 2026 second-quarter results: Napanee BESS Phase 1 and Phase 2',
    status: ['Counterparty-reported', '交易对手方披露'], provenance: COUNTERPARTY,
    date: '2026',
    cy: 'Phase 1, up to 250 MW for up to four hours, delivered in April 2026 "ahead of schedule and within the approved budget". Phase 2 awarded in June 2026 under LT2: up to 300 MW for up to eight hours. No cost figure is published for either phase.',
    url: 'https://www.opg.com/news-resources/newsroom/release/opg-reports-2026-second-quarter-financial-results/',
    authority: 'observed', historical: 'n/a', forecast: 'None',
    frequency: 'Quarterly', format: 'HTML', machineReadable: 'No',
    automation: 'D — read', lastChecked: '2026-10-23', freshness: 'Current',
  },
  aturaApproval: {
    file: 'Atura Power — Napanee energy storage gets approval',
    status: ['Counterparty-reported', '交易对手方披露'], provenance: COUNTERPARTY,
    date: '8 Jun 2023',
    cy: 'The 250 MW Napanee BESS is 35% of the storage capacity IESO had just announced: seven projects totalling 739 MW. Owned through a joint venture of Atura Power and Ameresco.',
    url: 'https://www.aturapower.com/news/napanee-energy-storage-gets-approval/',
    authority: 'observed', historical: 'n/a', forecast: 'None',
    frequency: 'One-off', format: 'HTML', machineReadable: 'No',
    automation: 'D — read', lastChecked: '2026-10-23', freshness: '2023',
  },
  eagleLakeNeoen: {
    file: 'Neoen — long-term contract for a new 200 MW, 8-hour battery in Ontario',
    status: ['Counterparty-reported', '交易对手方披露'], provenance: COUNTERPARTY,
    date: '23 Jun 2026',
    cy: 'Eagle Lake Power Reserve, 200 MW / 1,600 MWh about 15 km west of Dryden, with a 190 MW / 8-hour 20-year capacity contract; 50/50 with Eagle Lake First Nation; construction from 2028, in service 2030. Capex not disclosed.',
    url: 'https://neoen.com/en/news/2026/neoen-awarded-long-term-contract-for-new-200-mw-8-hour-battery-in-ontario-canada/',
    authority: 'observed', historical: 'n/a', forecast: 'None',
    frequency: 'One-off', format: 'HTML', machineReadable: 'No',
    automation: 'D — read', lastChecked: '2026-10-23', freshness: 'Current',
  },
  simcoeNrstor: {
    file: 'NRStor — Simcoe Battery Project partners execute IESO agreement',
    status: ['Counterparty-reported', '交易对手方披露'], provenance: COUNTERPARTY,
    date: '11 Aug 2026',
    cy: 'Simcoe Battery Project, 150 MW / 1,200 MWh in Norfolk County, 20-year capacity contract; Six Nations Group and the Mississaugas of the Credit Business Corporation hold 50%, with Aecon Concessions, Sitka Power and NRStor. Capex not disclosed.',
    url: 'https://nrstor.com/2026/08/11/nrstor-battery-storage-project-in-norfolk-county/',
    authority: 'observed', historical: 'n/a', forecast: 'None',
    frequency: 'One-off', format: 'HTML', machineReadable: 'No',
    automation: 'D — read', lastChecked: '2026-10-23', freshness: 'Current',
  },
  gridMap: {
    file: 'IESO — Ontario\'s Electricity System (map)',
    status: ['Official — Final', '官方 — 最终'], provenance: OFFICIAL,
    date: '2026',
    cy: '"The high-voltage IESO-Controlled Grid which includes 115 kilovolt (kV), 230 kV, and 500 kV" transmission lines; "over 30,000 kilometres of transmission lines in Ontario."',
    url: 'https://www.ieso.ca/ontarioenergymap/',
    authority: 'observed', historical: 'n/a', forecast: 'None',
    frequency: 'As revised', format: 'HTML map', machineReadable: 'No',
    automation: 'C — read', lastChecked: '2026-10-23', freshness: 'Current',
  },
  connectionGuidance: {
    file: 'IESO — LT2 Window 2 Preliminary Connection Guidance',
    status: ['Official — Draft', '官方 — 草案'], provenance: OFFICIAL_DRAFT,
    date: '15 Oct 2026',
    cy: 'Posted with the window 2 drafts; not yet read into this register (gate ON-5).',
    url: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/LT2-Window-2-Guidance-20261015.pdf',
    authority: 'official-forecast', historical: 'n/a', forecast: 'Window 2',
    frequency: 'Per window', format: 'PDF', machineReadable: 'No',
    automation: 'D — read', lastChecked: '2026-10-23', freshness: 'Preliminary',
  },
};

export const sources = SRC;
export default SRC;
