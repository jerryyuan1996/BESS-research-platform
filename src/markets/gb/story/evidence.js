/* Analyst-entered, fixed-vintage public records approved by the G-1 script.
   Every value carries its own primary-source locator. No financial result. */
const record=(value,sourceId,url,locator,units='date',authority='historical-fact',checkedOn='2026-10-31')=>
  ({value,sourceId,url,locator,units,authority,checkedOn,vintage:checkedOn});
export const RECORDS={
  neta:record('2001-03-27','SRC-GB-03','https://www.ofgem.gov.uk/sites/default/files/docs/2002/03/1098-factsheet0502_27feb_0.pdf','NETA factsheet, opening: introduction in England and Wales on Tuesday 27 March 2001'),
  betta:record('2005-04','SRC-GB-04','https://www.ofgem.gov.uk/sites/default/files/docs/2005/07/11190-17805.pdf','Introduction: NETA extended GB-wide under BETTA in April 2005; month precision, not the earlier planned day'),
  firstCapacity:record('2014-12-18','SRC-GB-18','https://assets.publishing.service.gov.uk/media/5a7dd9bde5274a5eb14e7913/Provisional_Results_Report-Ammendment.pdf','Provisional results, opening: T-4 auction concluded 18 December 2014; auction date, not delivery year'),
  deratingRules:record('2018-07-17','SRC-GB-19','https://www.ofgem.gov.uk/sites/default/files/docs/2018/07/the_capacity_market_amendment_rules_2018_-_presented_to_parliament.pdf','PDF page 4, rules 1.1–1.2 and signature: commencement on 17 July 2018; Schedule 3B duration-limited storage methodology','date','market-rule','2026-11-01'),
  dc:record('2020-10-01','SRC-GB-08','https://www.neso.energy/news/national-grid-eso-debuts-dynamic-containment-frequency-response-service','30 September 2020 news: control-room launch at 23:00; first delivery on 1 October'),
  dr:record('2022-04-09','SRC-GB-12','https://www.neso.energy/data-portal/dynamic-containment-data','Results Summary resource 888e5029-f786-41d2-bc15-cbfd1d285e96: first EFA Date with positive Cleared Volume for DR; delivery, not auction date'),
  dm:record('2022-05-07','SRC-GB-12','https://www.neso.energy/data-portal/dynamic-containment-data','Results Summary resource 888e5029-f786-41d2-bc15-cbfd1d285e96: first EFA Date with positive Cleared Volume for DM; delivery, not auction date'),
  eac:record('2023-11','SRC-GB-10','https://www.neso.energy/news/enduring-auction-capability-platform-new-and-improved-platform-procuring-frequency-response-services','24 November 2023 news and May 2024 report: co-optimising auction platform changed in November 2023; month precision'),
  obp:record('2023-12','SRC-GB-15','https://www.neso.energy/news/first-stages-open-balancing-platform-go-live','13 December 2023 news, first stage goes live this week; battery bulk dispatch; month precision'),
  gate2:record('2025-04-15','SRC-GB-23','https://www.ofgem.gov.uk/sites/default/files/2025-04/Gate-2-Criteria-Methodology-Final-Decision.pdf','PDF page 1, publication date and approval; decision date, distinct from implementation','date','market-rule','2026-11-01'),
  rema:record('2025-07-10','SRC-GB-22','https://www.gov.uk/government/publications/review-of-electricity-market-arrangements-rema-summer-update-2025/review-of-electricity-market-arrangements-rema-summer-update-2025-accessible-webpage','10 July 2025 publication, section retaining a single national GB-wide wholesale market'),
  feeConsultation:record('2026-09-17','SRC-GB-25','https://www.ofgem.gov.uk/sites/default/files/2026-09/CMP470-Minded-to-Consultation.pdf','Cover: minded-to consultation dated 17 September 2026; this is not an Authority decision','date','official-proposal'),
  queueMW:record(83000,'SRC-GB-25','https://www.ofgem.gov.uk/press-release/ofgem-moves-free-grid-capacity-tackling-excess-battery-projects','17 September 2026 release: 83 GW prioritised in reformed queue, separate from 7 GW operational; 83 GW × 1000 = 83000 MW','MW','dated-queue','2026-11-01'),
  cpBatteryRange:record([23,27],'SRC-GB-26','https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report','Clean Power 2030 Action Plan main report, section on battery storage: 23–27 GW by 2030; official plan, not built fleet','GW','official-plan','2026-11-01'),
  cpHorizon:record(2030,'SRC-GB-26','https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report','Same battery-storage range and target horizon as cpBatteryRange','year','official-plan','2026-11-01'),
};

export const GAPS={
  efr:{id:'GAP-GB-EFR',value:null,fallback:['Qualitative tender mechanism; result figures withheld','仅展示招标机制；结果数值暂不展示']},
  revenueSplit:{id:'GAP-GB-REVSPLIT',value:null,fallback:['Dispatch access only; no revenue split','只说明调度参与方式，不展示收入构成']},
  referenceSecured:{id:'GAP-GB-REFSECURED',value:null,fallback:['Comparison omitted','省略参考情景比较']},
  feeDecision:{id:'CF-GB-10',value:null,fallback:['Decision pending','待决定']},
};

export const HISTORY=[
  {id:'H-GB-01',records:['neta','betta'],shots:['gb-02']},
  {id:'H-GB-02',records:['firstCapacity'],shots:['gb-04']},
  {id:'H-GB-03',records:[],gap:'GAP-GB-EFR',shots:['gb-03']},
  {id:'H-GB-04',records:['deratingRules'],shots:['gb-04']},
  {id:'H-GB-05',records:['dc','dr','dm','eac'],shots:['gb-05']},
  {id:'H-GB-06',records:['obp'],shots:['gb-06']},
  {id:'H-GB-07',records:['gate2','rema'],shots:['gb-07']},
  {id:'H-GB-08',records:['feeConsultation'],status:'pending',shots:['gb-07']},
];
