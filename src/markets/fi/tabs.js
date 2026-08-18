/* ---------------------------------------------------------------------------
   Finland — tab strip.

   Aligned with the shared lineage, with the one substitution the market forces:
   there is no capacity-market tab, because there is no resource adequacy revenue
   to describe. Reserve markets take that slot and absorb what other markets
   split between "Capacity Market" and "System Services", since in Finland they
   are the same set of products.

   The reserve tab id is in REVENUE_IDS in components/navigation.js — a revenue
   tab missing from that set is silently dropped from the grouped nav.

   The set is the same ten every other market carries, so a reader moving
   between dashboards finds the same structure. What differs is what fills them.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['Finnish Market Story', '芬兰市场演进']],
  /* Named for the mechanism that exists rather than the revenue that does not.
     Finland's peak load capacity system is real, statutory and dormant — the
     Energy Authority procured nothing for 2025–26 — and that dormancy is the
     evidence behind capabilities.capacityMarket being false. It is a tab's worth
     of argument, not an omission. */
  ['capacity',  ['Capacity & Adequacy', '容量与充裕度']],
  ['energy',    ['Wholesale & Intraday', '批发与日内']],
  ['services',  ['Reserve Markets', '备用市场']],
  ['duration',  ['Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid Connection', '并网']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
export default TABS;
