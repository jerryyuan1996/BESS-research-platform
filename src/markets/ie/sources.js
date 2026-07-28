/* ---------------------------------------------------------------------------
   Ireland (SEM, all-island) 鈥?source register, verbatim from the prototype (lines 1343-1354).

   Lives next to the market (brief section 20). Rendered by the shared
   components/sourceDrawer.js 鈥?no source detail is hardcoded in a presentation
   component. Entries preserve name, status, date, coverage period and URL.
   --------------------------------------------------------------------------- */

const SRC = {
  semo:   { file:'SEMO — market data, capacity auction results and market messages', status:['Official — Final','官方 — 最终'], date:'Jul 2026', cy:'T-4 2028/29', url:'https://www.sem-o.com/' },
  semc:   { file:'SEM Committee — CRM, FASS and market-design decisions', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Decision papers', url:'https://www.semcommittee.com/' },
  eirgrid:{ file:'EirGrid — system data, adequacy, dispatch-down and SNSP', status:['Official — Final','官方 — 最终'], date:'2026', cy:'2025 outturn', url:'https://www.eirgrid.ie/' },
  fass:   { file:'EirGrid — Future Arrangements for System Services (FASS) / DASSA design', status:['Consultation — not final policy','征询阶段 — 非最终政策'], date:'2026', cy:'DASSA go-live target 2027', url:'https://www.eirgrid.ie/shaping-our-electricity-future/electricity-markets' },
  soni:   { file:'SONI — Northern Ireland system operation and connections', status:['Official — Final','官方 — 最终'], date:'2026', cy:'NI jurisdiction', url:'https://www.soni.ltd.uk/' },
  cru:    { file:'CRU — connections (ECP), network charges, storage and LDES policy', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Connection policy', url:'https://www.cru.ie/' },
  urni:   { file:'Utility Regulator (NI) — regulatory decisions and tariffs', status:['Official — Final','官方 — 最终'], date:'2026', cy:'NI jurisdiction', url:'https://www.uregni.gov.uk/' },
  cso:    { file:'CSO — data-centre metered electricity consumption', status:['Official — Final','官方 — 最终'], date:'2026', cy:'2025 calendar year', url:'https://www.cso.ie/en/statistics/energy/datacentresmeteredelectricityconsumption/' },
  celtic: { file:'EirGrid — Celtic Interconnector programme', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Expected 2028', url:'https://www.eirgrid.ie/celticinterconnector' },
  neso:   { file:'NESO — GB Capacity Market register, de-rating factors and EAC results (peer namespace)', status:['Official — Final','官方 — 最终'], date:'Jul 2026', cy:'DY 2029/30', url:'https://www.neso.energy/data-portal/capacity-market-register' },
};

export { SRC, SRC as sources };