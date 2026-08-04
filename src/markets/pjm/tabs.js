/* ---------------------------------------------------------------------------
   PJM — tab strip. Each id is a URL segment: /markets/pjm/<id>.
   First entry is the default.

   Eleven tabs, the same count and the same reading order as every other market
   in this lineage — a dashboard that quietly gained or lost one would have
   stopped being comparable, which tests/registry.test.js asserts.

   Two labels carry PJM-specific weight. `capacity` is the Reliability Pricing
   Model and the ELCC accreditation that decides what a four-hour battery is
   actually paid; `services` is Regulation alone, because after the October 2025
   redesign consolidated RegA and RegD there is only one signal, and it is the
   line this market most needs a reader to stop trusting.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',       ['Overview', '总览']],
  ['story',      ['PJM Market Story', 'PJM市场演进']],
  ['capacity',   ['RPM Capacity & ELCC', 'RPM容量市场与ELCC核证']],
  ['energy',     ['Nodal Energy & TB4 Spreads', '节点电能量与TB4价差']],
  ['services',   ['Regulation', '调频市场']],
  ['duration',   ['Storage Duration', '储能时长']],
  ['pipeline',   ['Project Pipeline', '项目管线']],
  ['grid',       ['Interconnection & Congestion', '并网与拥塞']],
  ['benchmark',  ['PJM vs the platform', 'PJM与本平台其他市场对比']],
  ['portfolio',  ['Portfolio', '组合与基金视图']],
  ['data',       ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
