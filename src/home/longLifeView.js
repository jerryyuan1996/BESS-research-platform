/* ---------------------------------------------------------------------------
   The long-life view on /returns: every market's hold IRR on fifteen, twenty
   and twenty-five years, fading and with capacity maintained.

   Arithmetic is src/longlife/longLife.js; this file only draws it. The table is
   ordered by the engine's own fifteen-year figure, so the reader sees whether a
   longer window changes the order (it barely does) before reading any level.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { why } from '../components/decisionLogic.js';
import { longLife } from '../longlife/longLife.js';
import { MAINTAINED_FOM_SHARE } from '../comparison/assumptions.js';

const pct = (v) => (v === null || v === undefined ? '—' : (v * 100).toFixed(1) + '%');

export const LONG_LIFE_TEXT = {
  title: ['The same asset, held longer', '同一资产，持有更久'],
  cap: [
    'The comparison engine prices fifteen years and assigns nothing after them. Published returns are quoted on longer lives. These columns extend the engine\'s own cash flows to twenty and twenty-five years and sit beside its figure; they do not replace it, and no grade or score reads them.',
    '比较引擎只测算十五年，其后不计任何价值；而公开发布的回报通常按更长的寿命给出。以下各列把引擎自身的现金流延伸至二十年和二十五年，与引擎数字并列展示；它们不取代引擎数字，任何评级或评分均不读取它们。',
  ],
  fading: ['Capacity fades (default)', '容量逐年衰减（默认）'],
  maintained: ['Capacity maintained (NREL convention)', '容量维持在额定值（NREL口径）'],
  years: (n) => [n + ' yr', n + '年'],
  market: ['Market', '市场'],
  rules: [
    'Fading is the default: a project carries a warranty extension from the supplier and a long-term service agreement, paid yearly, and with both in place pays nothing further for augmentation. The market line goes on degrading at the market\'s own rate, the secured line and other costs stay at their year-15 level, the supplier\'s quoted warranty and maintenance are paid at their own price to year 25 where a market carries them, and nothing is added at the end. Maintained is a comparison, not the default: the market line is held at its rating in every year, for a yearly operating cost of ' + (MAINTAINED_FOM_SHARE * 100).toFixed(0) + '% of gross capex in place of the market\'s own where that is lower. The 4% is the US national laboratory\'s figure for a four-hour battery on a fifteen-year life; using it for longer, or outside the United States, goes beyond what that source says.',
    '衰减情形为默认情形：项目同时购买供应商的延保与长期服务协议并按年支付，在此前提下不再发生额外的容量增补成本。市场化收入继续按该市场自身的衰减率下降，有保障收入与其他成本维持第15年水平；凡采用供应商报价的市场，延保与维护按报价支付至第25年；期末不计任何残值。维持情形仅作对照，并非默认情形：市场化收入在每一年都保持额定水平，代价是每年的运营成本取总投资的' + (MAINTAINED_FOM_SHARE * 100).toFixed(0) + '%（若该市场自身的运营成本更低）。4%是美国国家实验室针对四小时电池、十五年寿命给出的数字；把它用于更长的寿命或美国以外的市场，已超出该来源本身的表述。',
  ],
  why: [
    'A longer window is worth two to three points where returns are low and under one where they are high, and it barely changes the order. Paying to hold capacity costs more than the capacity earns in most markets here. So the fifteen-year window explains only part of the distance between the engine and published returns; the rest is revenue level, capex or a residual value, and none of those is settled by this table.',
    '在回报偏低的市场，延长测算期可带来两到三个百分点；在回报较高的市场则不足一个百分点，且市场排序几乎不变。在这里的多数市场，为维持容量所付出的成本高于这部分容量带来的收入。因此，十五年的测算期只能解释引擎数字与公开回报之间的一部分差距；其余差距来自收入水平、造价或残值，而本表并不能回答这些问题。',
  ],
  sig: ['The window is part of the gap, not all of it', '测算期只是差距的一部分'],
};

export function renderLongLife(main, marketList){
  const T = LONG_LIFE_TEXT;
  const rows = marketList
    .map(m => ({ m, v: longLife(m) }))
    .filter(x => !x.v.withheld)
    .sort((a, b) => b.v.assetIrr - a.v.assetIrr);
  if (!rows.length) return;

  const c = spacedCard(T.title, [badge('calc'), badge('illus')]);
  c.append(h('div', { class: 'cap' }, L(T.cap)));
  const windows = rows[0].v.windows.map(w => w.years);
  c.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {},
      h('tr', {},
        h('th', { rowspan: '2' }, L(T.market)),
        h('th', { class: 'num', colspan: String(windows.length) }, L(T.fading)),
        h('th', { class: 'num', colspan: String(windows.length) }, L(T.maintained))),
      h('tr', {},
        ...windows.map(n => h('th', { class: 'num' }, L(T.years(n)))),
        ...windows.map(n => h('th', { class: 'num' }, L(T.years(n)))))),
    h('tbody', {}, ...rows.map(({ m, v }) => h('tr', {},
      h('td', {}, h('b', {}, L(m.manifest.shortName))),
      ...v.windows.map(w => h('td', { class: 'num' }, pct(w.fading))),
      ...v.windows.map(w => h('td', { class: 'num' }, pct(w.maintained)))))))));
  c.append(h('div', { class: 'cap', style: 'margin-top:6px;' }, L(T.rules)));
  c.append(why(T.why, T.sig));
  main.append(c);
}
