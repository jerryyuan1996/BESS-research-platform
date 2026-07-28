/* ---------------------------------------------------------------------------
   Romania 鈥?source register, verbatim from the prototype (lines 1339-1349).

   Lives next to the market (brief section 20). Rendered by the shared
   components/sourceDrawer.js 鈥?no source detail is hardcoded in a presentation
   component. Entries preserve name, status, date, coverage period and URL.
   --------------------------------------------------------------------------- */

const SRC = {
  opcom:  { file:'OPCOM — annual and monthly market results (DAM / IDM)', status:['Official — Final','官方 — 最终'], date:'Jul 2026', cy:'2025 annual, Jun 2026 monthly', url:'https://www.opcom.ro/anunturi-stiri-pp/en/1' },
  tel:    { file:'Transelectrica — balancing market and reserve procurement', status:['Official — Final','官方 — 最终'], date:'2026', cy:'FCR / aFRR / mFRR', url:'https://www.transelectrica.ro/en/web/tel/piata-de-echilibrare' },
  telmap: { file:'Transelectrica — indicative available connection capacity map', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Screening only', url:'https://web.transelectrica.ro/harti_crd_tel/index.html' },
  anre:   { file:'ANRE — storage tariff treatment and connection reform orders', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Tariffs, guarantees, auctions', url:'https://anre.ro/24931-2/' },
  scheme: { file:'European Commission — EUR 150m Romanian standalone-storage state-aid scheme', status:['Official — Final','官方 — 最终'], date:'Mar 2026', cy:'Scheme budget, not awards', url:'https://competition-policy.ec.europa.eu/state-aid_en' },
  ebrd:   { file:'EBRD — Romanian grid-scale storage project financing', status:['Public source','公开来源'], date:'2026', cy:'Project-finance precedent', url:'https://www.ebrd.com/' },
  entsoe: { file:'ENTSO-E Transparency Platform (RO bidding zone)', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Continuous', url:'https://transparency.entsoe.eu/' },
  bnr:    { file:'National Bank of Romania — official RON/EUR reference rates', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Daily', url:'https://www.bnr.ro/' },
  pse:    { file:'PSE / URE — Polish capacity market and connection data (peer namespace)', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Peer context', url:'https://www.pse.pl/' },
};

export { SRC, SRC as sources };