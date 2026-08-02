/* ---------------------------------------------------------------------------
   WA source register, verbatim from the prototype (lines 637-651).

   Lives next to the market (brief section 20). Rendered by the shared
   components/sourceDrawer.js - no source detail is hardcoded in a presentation
   component. Project-document sources stay inside the project object and appear
   only on the Portfolio tab.
   --------------------------------------------------------------------------- */


// ============================================================================
//  SHARED SOURCE REGISTER — official / public market sources used market-wide.
//  Project-document sources stay inside the project object (portfolio tab only).
// ============================================================================
const SRC = {
  esoo:  { file:'2026 WEM Electricity Statement of Opportunities', status:['Official — Final','官方 — 最终'], date:'15 Jul 2026', cy:'2028-29 to 2035-36', url:'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning/wem-electricity-statement-of-opportunities-wem-esoo' },
  brcp:  { file:'2026 Benchmark Reserve Capacity Prices (2028-29) — Final Determination, ERA, 13 Mar 2026', status:['Official — Final','官方 — 最终'], date:'13 Mar 2026', cy:'2028-29', url:'https://www.erawa.com.au/markets/wholesale-electricity-market/price-setting/benchmark-reserve-capacity-prices' },
  crc:   { file:'2026 CRC Process Information Session / Reserve Capacity Timetable', status:['Official — Final','官方 — 最终'], date:'2026', cy:'2028-29', url:'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-timetable' },
  qed:   { file:'AEMO Quarterly Energy Dynamics — Q1 2026 (latest published)', status:['Official — Final','官方 — 最终'], date:'Apr 2026', cy:'Q1 2026', url:'https://www.aemo.com.au/energy-systems/major-publications/quarterly-energy-dynamics-qed' },
  rules: { file:'WA Electricity System & Market Rules; RCM Review and WEM Investment Certainty amending rules', status:['Official — Final','官方 — 最终'], date:'2023–2025', cy:'Rule framework', url:'https://www.wa.gov.au/government/document-collections/electricity-system-and-market-rules' },
  tsp:   { file:'Western Power Transmission System Plan 2025 — Draft', status:['Official — Draft','官方 — 草案'], date:'2025', cy:'Planning context', url:'https://www.westernpower.com.au/resources-education/our-network-the-grid/future-of-the-grid/' },
  /* The named-project register draws on three documents with different weight:
     the state plan sets the phased ambition, the Western Power program pages
     carry project scope and construction status, and the state funding
     commitment is an envelope rather than a project. Kept separate on purpose. */
  swisPlan:  { file:'Energy Policy WA — SWIS Transmission Plan', status:['Official — Final','官方 — 最终'], date:'18 Sep 2025', cy:'Phased capacity ambition to the 2040s', url:'https://www.wa.gov.au/organisation/energy-policy-wa/the-south-west-interconnected-system-transmission-plan-future-ready-transmission-network-was-main-electricity-system' },
  celProgram:{ file:'Western Power — Clean Energy Link program', status:['Official — Public','官方 — 公开'], date:'2026', cy:'Named project scope, contracts and construction status', url:'https://www.westernpower.com.au/resources-education/our-network-the-grid/future-of-the-grid/clean-energy-link-program/' },
  cef:       { file:'Government of Western Australia — Clean Energy Fund (A$1.4bn)', status:['Official — Public','官方 — 公开'], date:'27 Apr 2026', cy:'Transmission and generation funding envelope', url:'https://www.wa.gov.au/government/media-statements/Cook%20Labor%20Government/Government-plans-WA%27s-clean-energy-future-with-$1.4-billion-fund-20260427' },
  nemsc: { file:'AEMO NEM Connection Scorecard — June 2026 (FY2026 full year)', status:['Official — Final','官方 — 最终'], date:'Jun 2026', cy:'FY2025-26', url:'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/participate-in-the-market/network-connections/connection-scorecard' },
  mkt:   { file:'WA storage market study — players, exit channels and long-term holders (24 Jul 2026)', status:['Public-source compilation','公开信息汇编'], date:'24 Jul 2026', cy:'2024-12 → 2026-07', url:'' },
  cis:   { file:'DCCEEW / Capacity Investment Scheme — Tenders 2, 5 and 6 outcomes', status:['Official — Final','官方 — 最终'], date:'2 May 2026', cy:'CIS awards', url:'https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme' },
};

export { SRC, SRC as sources };
