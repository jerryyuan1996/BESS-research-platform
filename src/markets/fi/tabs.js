/* ---------------------------------------------------------------------------
   Finland — tab strip.

   Aligned with the shared lineage, with the one substitution the market forces:
   there is no capacity-market tab, because there is no resource adequacy revenue
   to describe. Reserve markets take that slot and absorb what other markets
   split between "Capacity Market" and "System Services", since in Finland they
   are the same set of products.

   The reserve tab id is in REVENUE_IDS in components/navigation.js — a revenue
   tab missing from that set is silently dropped from the grouped nav.

   No dashboard is wired yet, so these describe the intended shape rather than
   pages that render. See docs/adding-a-market.md: the comparison interface and
   the dashboard are deliberately separable, and this market is mid-way through
   on purpose.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',     ['Overview', '总览']],
  ['story',    ['Finnish Market Story', '芬兰市场演进']],
  ['services', ['Reserve Markets', '备用市场']],
  ['energy',   ['Wholesale & Intraday', '批发与日内']],
  ['duration', ['Duration', '储能时长']],
  ['pipeline', ['Project Pipeline', '项目管线']],
  ['grid',     ['Grid Connection', '并网']],
  ['data',     ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
export default TABS;
