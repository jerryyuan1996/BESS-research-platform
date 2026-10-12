/* ---------------------------------------------------------------------------
   Germany — tab strip. Each id is a URL segment: /markets/germany/<id>.
   First entry is the default.

   Structure matches the RO/PL lineage exactly. Only the labels are German:
   `capacity` covers the capacity market Germany is still legislating and the
   grid-forming products it already procures; `grid` carries the connection-cost
   contribution no other market on this platform charges.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',       ['Overview', '总览']],
  ['case',       ['Investment Case', '投资判断']],
  ['story',      ['Germany Market Story', '德国市场演进']],
  ['capacity',   ['Capacity Market & Grid-Forming', '容量市场与构网能力']],
  ['energy',     ['Day-ahead & Intraday', '日前与日内市场']],
  ['services',   ['FCR, aFRR & mFRR', '一次、二次与三次调频']],
  ['duration',   ['Storage Duration', '储能时长']],
  ['pipeline',   ['Project Pipeline', '项目管线']],
  ['grid',       ['Grid & Connection Cost', '并网与接入费用']],
  ['entry',      ['Entry & Delivery', '进入与交付']],
  ['portfolio',  ['Portfolio', '组合与基金视图']],
  ['data',       ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
