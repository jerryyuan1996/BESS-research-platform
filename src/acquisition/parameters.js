/** Approved screening conventions, 18 October 2026. Rates are annual nominal
 * proxies in the CASH-FLOW currency, not the display currency. Not bank quotes. */
export const RATE_SNAPSHOT = Object.freeze({
  date:'2026-10-18',
  EUR:{rate:.035,observed:'2026-10-15',source:'https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html'},
  GBP:{rate:.055,observed:'2026-10-15',source:'https://www.bankofengland.co.uk/statistics/yield-curves'},
  AUD:{rate:.055,observed:'2026-09-30',source:'https://www.rba.gov.au/statistics/tables/'},
  USD:{rate:.0525,observed:'2026-10-16',source:'https://home.treasury.gov/resource-center/data-chart-center/interest-rates'},
  CAD:{rate:.0384,observed:'2026-10-16',source:'https://www.bankofcanada.ca/rates/interest-rates/canadian-bonds/'},
  JPY:{rate:.03,observed:'2026-10-15',source:'https://www.mof.go.jp/english/policy/jgbs/reference/interest_rate/index.htm'},
  PLN:{rate:.0625,observed:'2026-09-30',sovereign:true,source:'https://data.ecb.europa.eu/data/datasets/IRS/IRS.M.PL.L.L40.CI.0000.PLN.N.Z'},
  RON:{rate:.0675,observed:'2026-09-30',sovereign:true,source:'https://data.ecb.europa.eu/data/datasets/IRS/IRS.M.RO.L.L40.CI.0000.RON.N.Z'},
});
export const STAGES = ['greenfield','ready-to-build','operating'];
export const INVESTOR_PREMIUM = {
  strategic:{greenfield:.08,'ready-to-build':.06,operating:.06},
  infraFund:{greenfield:.09,'ready-to-build':.07,operating:.07},
  foreignFirstTimer:{greenfield:.10,'ready-to-build':.08,operating:.08},
  developer:{greenfield:.12,'ready-to-build':.10},
};
/** Revised reference ranges: house underwriting conventions, not market quotes.
 * Applied only to labelled references; an explicit investor target takes priority.
 * Asset NAV discount rates are a calibration check, not levered equity IRRs. */
export const REFERENCE_PREMIUM = {
  strategic:{greenfield:.055,'ready-to-build':.03,operating:.025},
  infraFund:{greenfield:.065,'ready-to-build':.04,operating:.035},
  foreignFirstTimer:{greenfield:.075,'ready-to-build':.05,operating:.045},
  developer:{greenfield:.085,'ready-to-build':.06},
};
export const FEES = Object.freeze({acquisition:.015,sale:.015,financing:.01,reserveMonths:6});
/** Analyst's convention of 29 Oct 2026: real cash flows, and every secured
 * contract, escalate at 2.5% a year. */
export const INFLATION = .025;
/** Transfer price of a US investment credit, $ per $ of credit (Crux 2026 average, $0.913). */
export const ITC_TRANSFER_PRICE = .913;
/** Levered equity return, sized as lenders sized storage in 2026 and confirmed by
 * the analyst on 29 Oct 2026. Contracted cash covers 1.20x (multi-year state or
 * TSO payments), 1.30x (fixed tolls) or 1.40x (floors, collars, any contract
 * under seven years); merchant cash covers 2.00x. Legal maturity is the contract
 * tenor where it is 7+ years (max 18), else a 7-year mini-perm; at least 60% is
 * repaid by then (Modo, German tolls, 2026) and equity repays any balloon.
 * Debt is drawn at COD and capped at 75% of the build budget when secured revenue
 * is at least half of year one, otherwise 60%. Not bank quotes. */
export const LEVERAGE = Object.freeze({
  dscr:{state:1.20,toll:1.30,floor:1.40,short:1.40,merchant:2.00},
  shortContractYears:7,miniPermYears:7,maxLegalYears:18,notionalYears:15,minRepaid:.60,
  gearingCap:{contracted:.75,merchant:.60},
  margin:{contracted:.0225,merchant:.035},
});
/** A levered equity return is tested against the investor's unlevered target plus
 * this premium: surveyed levered equity returns (11–12%, DLA Piper 2026) sit about
 * two points above unlevered hurdles (8–12%, Phelas 2026). */
export const LEVERED_PREMIUM = .02;
export const DEBT = Object.freeze({
  contracted:{ltv:.65,dscr:1.35,years:10,margin:.0225},
  mixed:{ltv:.50,dscr:1.60,years:7,margin:.0275},
  merchant:{ltv:.35,dscr:2,years:5,margin:.035},
});
export const STAGE_LABEL = {
  greenfield:['Greenfield','绿地开发'],
  'ready-to-build':['Ready to build','可开工项目'],
  operating:['Operating','已运营'],
};
