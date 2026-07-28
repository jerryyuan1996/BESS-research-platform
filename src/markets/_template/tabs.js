/* ---------------------------------------------------------------------------
   TEMPLATE — this market's tab strip.

   Format: [tabId, [en, zh]]. The tabId becomes a URL segment, so it must be
   lowercase and URL-safe: /markets/<slug>/<tabId>.

   Order is presentation order. The first entry is the default tab, used when the
   route carries no tab segment and when an unknown tab is requested.

   Markets are structurally different (brief section 22) — do not copy another
   market's tabs because they exist. A market with four meaningful sections should
   have four tabs.
   --------------------------------------------------------------------------- */

export const tabs = [
  ['home',     ['Overview', '总览']],
  ['capacity', ['Capacity Mechanism', '容量机制']],
  ['energy',   ['Energy Arbitrage', '现货套利']],
  ['lab',      ['Investment Lab', '投资测算']],
  ['data',     ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = tabs[0][0];

export default tabs;
