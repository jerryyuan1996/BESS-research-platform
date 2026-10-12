/* ---------------------------------------------------------------------------
   Italy — tab strip. Each id is a URL segment: /markets/italy/<id>.
   First entry is the default.

   Structure matches the RO/PL lineage exactly, because alignment of format is
   what makes the cross-market comparison mean anything. Only the labels are
   Italian: `capacity` is MACSE and the capacity market, `services` is the MSD
   ancillary market MACSE was created to relieve.
   --------------------------------------------------------------------------- */

const TABS = [
  ['home',      ['Overview', '总览']],
  ['case',      ['Investment Case', '投资判断']],
  ['story',     ['Italy Market Story', '意大利市场演进']],
  ['capacity',  ['MACSE & Capacity Market', 'MACSE与容量市场']],
  ['energy',    ['Wholesale & Intraday', '批发与日内市场']],
  ['services',  ['MSD & Balancing', '辅助服务与平衡市场']],
  ['duration',  ['Storage Duration', '储能时长']],
  ['pipeline',  ['Project Pipeline', '项目管线']],
  ['grid',      ['Grid & Permitting', '并网与许可']],
  ['entry',     ['Entry & Delivery', '进入与交付']],
  ['portfolio', ['Portfolio', '组合与基金视图']],
  ['data',      ['Data & Methodology', '数据与方法']],
];

export const DEFAULT_TAB = TABS[0][0];
export { TABS, TABS as tabs };
