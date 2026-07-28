/* ---------------------------------------------------------------------------
   Japan — tab strip. Same 12-tab institutional-investor storyline as every other
   market in the platform, with the Japan-specific mechanisms named correctly:
   Capacity Market and LTDA are one tab because they are two mechanisms of one
   national framework, and JEPX carries the regional-basis comparison.
   --------------------------------------------------------------------------- */

export const TABS = [
  ['home',      ['Overview', '总览']],
  ['story',     ['Japan Market Story', '日本市场演进']],
  ['capacity',  ['Capacity & LTDA', '容量市场与长期脱碳拍卖']],
  ['energy',    ['JEPX Energy & Regional Basis', 'JEPX现货与区域价差']],
  ['services',  ['Balancing Market', '需给调整市场']],
  ['duration',  ['Storage Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid & Connection', '并网与电网约束']],
  ['benchmark', ['Regional Benchmark', '区域对比']],
  ['lab',       ['Investment Lab', '投资测算']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

/** Regional lenses. 'compare' first — it is the default and the cleanest workflow. */
export const REGIONS = [
  ['compare',  ['Compare 3 regions', '三区域对比']],
  ['tokyo',    ['Tokyo', '东京']],
  ['kyushu',   ['Kyushu', '九州']],
  ['hokkaido', ['Hokkaido', '北海道']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS as tabs };
