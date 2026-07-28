/* ---------------------------------------------------------------------------
   Poland 鈥?source register, verbatim from the prototype (lines 1346-1356).

   Lives next to the market (brief section 20). Rendered by the shared
   components/sourceDrawer.js 鈥?no source detail is hardcoded in a presentation
   component. Entries preserve name, status, date, coverage period and URL.
   --------------------------------------------------------------------------- */

const SRC = {
  pse:    { file:'PSE — capacity market auction results and certification register', status:['Verify against current documents','须以现行文件核验'], date:'2026', cy:'Delivery years to 2030', url:'https://www.pse.pl/' },
  corr:   { file:'Capacity market correction (de-rating) factors by technology and duration', status:['Verify against current documents','须以现行文件核验'], date:'2026', cy:'Auction-specific', url:'https://www.pse.pl/' },
  tge:    { file:'TGE (Polish Power Exchange) — day-ahead and intraday market results', status:['Official — Final','官方 — 最终'], date:'2026', cy:'2025 annual, 2026 monthly', url:'https://tge.pl/' },
  bal:    { file:'PSE — balancing market reform, 15-minute settlement and reserve procurement', status:['Official — Final','官方 — 最终'], date:'2024–2026', cy:'Post-reform', url:'https://www.pse.pl/' },
  ure:    { file:'URE (Energy Regulatory Office) — licensing, capacity market oversight', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Regulatory', url:'https://www.ure.gov.pl/' },
  conn:   { file:'PSE / DSO connection conditions and refusal statistics', status:['Verify against current documents','须以现行文件核验'], date:'2026', cy:'Connection queue', url:'https://www.pse.pl/' },
  nfos:   { file:'NFOŚiGW / Modernisation Fund — storage capital support programmes', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Capital grants and loans', url:'https://www.gov.pl/web/nfosigw' },
  entsoe: { file:'ENTSO-E Transparency Platform (PL bidding zone)', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Continuous', url:'https://transparency.entsoe.eu/' },
  opcom:  { file:'OPCOM / ANRE — Romanian market and support-scheme data (peer namespace)', status:['Official — Final','官方 — 最终'], date:'2026', cy:'Peer context', url:'https://www.opcom.ro/anunturi-stiri-pp/en/1' },
};

export { SRC, SRC as sources };