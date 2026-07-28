/* ---------------------------------------------------------------------------
   Great Britain 鈥?source register, verbatim from the prototype (lines 1347-1360).

   Lives next to the market (brief section 20). Rendered by the shared
   components/sourceDrawer.js 鈥?no source detail is hardcoded in a presentation
   component. Entries preserve name, status, date, coverage period and URL.
   --------------------------------------------------------------------------- */

const SRC = {
  cmreg:  { file:'NESO Capacity Market Register & auction results', status:['Official — Final','官方 — 最终'], date:'13 Jul 2026', cy:'DY 2026/27 & 2029/30', url:'https://www.neso.energy/data-portal/capacity-market-register' },
  derate: { file:'NESO Capacity Market De-Rating Factors', status:['Official — Final','官方 — 最终'], date:'20 Feb 2026', cy:'T-4 2029/30 vintage', url:'https://www.neso.energy/data-portal/capacity-market-register/capacity_market_de-rating_factors' },
  bmrs:   { file:'Elexon BMRS Insights (wholesale, imbalance, BM)', status:['Official — Final','官方 — 最终'], date:'17 Jul 2026', cy:'TTM to Apr 2026', url:'https://bmrs.elexon.co.uk/' },
  eac:    { file:'NESO EAC (Enduring Auction Capability) results', status:['Official — Final','官方 — 最终'], date:'16 Jul 2026', cy:'DC/DM/DR/BR/QR/SR', url:'https://www.neso.energy/data-portal/eac-auction-results' },
  skip:   { file:'NESO Skip Rates', status:['Official — Final','官方 — 最终'], date:'15 Jul 2026', cy:'Rolling', url:'https://www.neso.energy/data-portal/skip-rates' },
  tec:    { file:'NESO TEC Register + DNO Embedded Capacity Registers', status:['Official — Final','官方 — 最终'], date:'14 Jul 2026', cy:'Pipeline to 2032', url:'https://www.neso.energy/data-portal/transmission-entry-capacity-tec-register/tec_register' },
  repd:   { file:'DESNZ Renewable Energy Planning Database (REPD)', status:['Official — Final','官方 — 最终'], date:'30 Apr 2026', cy:'Quarterly extract', url:'https://www.gov.uk/government/publications/renewable-energy-planning-database-quarterly-extract' },
  reform: { file:'NESO Connections Reform timeline (Gate 1 / Gate 2)', status:['Official — Final','官方 — 最终'], date:'1 Jul 2026', cy:'Offers phased to Mar 2027', url:'https://www.neso.energy/industry-information/connections-reform/connections-reform-timeline' },
  ldes:   { file:'Ofgem LDES cap-and-floor Window 1 — minded-to decisions', status:['Official — Draft','官方 — 草案'], date:'12 Jun 2026', cy:'Window 1', url:'https://www.ofgem.gov.uk/consultation/long-duration-electricity-storage-window-1-minded-decisions' },
  cp2030: { file:'DESNZ Clean Power 2030 Action Plan', status:['Official — Final','官方 — 最终'], date:'1 May 2026', cy:'2030 capacity ranges', url:'https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report' },
  vendor: { file:'Licensed third-party GB BESS revenue index (vendor & vintage to be recorded)', status:['Third-party modelled','第三方模型'], date:'30 Apr 2026', cy:'TTM realised revenue', url:'' },
  semo:   { file:'SEMO / SEM Committee — Irish CRM auction results & FASS decisions (peer namespace)', status:['Official — Final','官方 — 最终'], date:'Jul 2026', cy:'T-4 2028/29', url:'https://www.sem-o.com/' },
};

export { SRC, SRC as sources };