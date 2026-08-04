/* ---------------------------------------------------------------------------
   Multi-region strip.

   Renders one card per country that contributes more than one allocation market,
   explaining why those markets are separate points despite sharing a dashboard.
   Registry-driven: it appears because Japan contributes three entries today, and
   would appear for any other country that later does the same.

   Placed between the market cards and the cross-market league, because that is
   where a reader first wonders why three cards carry the same flag.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { why } from '../components/decisionLogic.js';
import { chip } from '../components/chip.js';
import { fmtPct, fmtIRR, fmtIRRor } from '../utils/formatting.js';
import { runBaseCase } from '../comparison/engine.js';

/* Standing editorial per shared dashboard. Keyed by dashboardId so a new
   multi-region country adds an entry rather than editing this component. */
const COMMENTARY = {
  jp: {
    title: ['Japan regional lens — same national market, different storage problem',
            '日本区域视角 — 同一全国市场，不同储能问题'],
    intro: [
      'Tokyo, Kyushu and Hokkaido share one national rulebook: the same Capacity Market, the same five balancing products, the same JEPX. They are three allocation points because price formation, grid access and saturation are regional — and because the 2029 capacity area prices sit within 0.9% of each other, none of the difference comes from the mechanism itself.',
      '东京、九州与北海道共享同一套全国规则：相同的容量市场、相同的五类调整力品种、相同的JEPX。之所以将其视为三个配置点，是因为价格形成、并网条件与饱和程度均属区域范畴 — 且2029年容量区域价格相差不到0.9%，差异并非来自机制本身。',
    ],
    conclusion: [
      'Capacity-market headline economics are effectively identical across the three areas. The regional investment spread therefore has to come from JEPX capture, curtailment and charging value, balancing saturation, grid deliverability, interconnector evolution and pipeline pressure — every one of which this platform measures separately.',
      '三个区域的容量市场表观经济性实质相同。因此区域投资差异必须来自JEPX价格捕获、弃电与充电价值、调整力饱和、电网可交付性、联络线演进及管线压力 — 本平台对上述每一项均单独度量。',
    ],
    facts: {
      jp_tokyo: [
        [['2029 CM area price', '2029容量市场区域价格'], '¥15,111/kW'],
        [['Concurrent study cap', '并发检讨上限'], '11'],
        [['Verified curtailment', '已核验弃电'], '20 d (Mar–May 2026)'],
        [['Constraint', '约束'], ['Load-centre headroom', '负荷中心裕度']],
      ],
      jp_kyushu: [
        [['2029 CM area price', '2029容量市场区域价格'], '¥15,112/kW'],
        [['Concurrent study cap', '并发检讨上限'], '8'],
        [['Verified curtailment', '已核验弃电'], '50 d (Jan–Mar 2026)'],
        [['Constraint', '约束'], ['Kanmon export', '关门断面外送']],
      ],
      jp_hokkaido: [
        [['2029 CM area price', '2029容量市场区域价格'], '¥14,972/kW'],
        [['Concurrent study cap', '并发检讨上限'], '5'],
        [['Verified curtailment', '已核验弃电'], '36 d (Mar–May 2026)'],
        [['Constraint', '约束'], ['0.9 → 1.2 GW interconnector', '联络线0.9→1.2GW']],
      ],
    },
    lineage: [
      ['National rules', '全国规则'], 'JEPX / EPRX / OCCTO',
      ['Regional price', '区域价格'], 'JEPX Area Price',
      ['Curtailment', '弃电'], 'OCCTO regional verification',
      ['Connection', '并网'], 'TEPCO PG / Kyushu T&D / HEPCO Network',
      ['Economics', '经济性'], 'Unified Japan Investment Lab — seed pending ETL',
    ],
  },
};

export function renderRegionalStrip(main, marketList, exitYear){
  // Group by shared dashboard; only groups with more than one market qualify.
  const groups = new Map();
  for (const m of marketList){
    const key = m.manifest.dashboardId;
    if (!key || key === m.manifest.id) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }

  for (const [key, group] of groups){
    if (group.length < 2) continue;
    const copy = COMMENTARY[key];
    if (!copy) continue;

    const c = spacedCard(copy.title, [badge('official'), badge('calc')]);
    c.append(h('div', { style: 'font-size:12.5px;color:var(--ink2);margin:6px 0 10px;' }, L(copy.intro)));

    const grid = h('div', { class: 'grid g3' });
    for (const m of group){
      const r = runBaseCase(m, exitYear);
      const col = h('div', { class: 'card', style: 'margin-top:0;' },
        h('h3', {}, m.manifest.flag + ' ' + L(m.manifest.shortName)),
        h('div', { class: 'cap' }, L(m.comparison.narrative.archetype)));
      col.append(h('div', { style: 'margin:6px 0;' }, chip('info', m.comparison.narrative.thesis || m.manifest.status)));

      const rows = (copy.facts && copy.facts[m.manifest.id]) || [];
      col.append(h('div', { class: 'tbl-wrap' }, h('table', {}, h('tbody', {},
        rows.map(([k, v]) => h('tr', {},
          h('td', {}, L(k)),
          h('td', { class: 'num' }, h('b', {}, typeof v === 'string' ? v : L(v))))),
        h('tr', {},
          h('td', {}, L(['Secured share (yr 1)', '第1年锁定占比'])),
          h('td', { class: 'num' }, h('b', {}, r.na ? 'N/A' : fmtPct((r.securedShare ?? r.contractedShare) * 100, 0)))),
        h('tr', {},
          h('td', {}, L(['15-yr unlevered IRR', '15年无杠杆IRR'])),
          h('td', { class: 'num' }, h('b', {}, r.na ? 'N/A' : fmtIRRor(r.irrHold, r.irrHoldAbsent, L)))),
      ))));
      grid.append(col);
    }
    c.append(grid);

    // Data lineage — makes clear the three points are not hand-built estimates.
    const lin = h('div', { class: 'source-grid', style: 'margin-top:12px;' });
    for (let i = 0; i < copy.lineage.length; i += 2){
      lin.append(h('b', {}, L(copy.lineage[i])), h('span', {}, copy.lineage[i + 1]));
    }
    c.append(h('details', { class: 'source-drawer' },
      h('summary', {}, L(['Data lineage — where each regional value comes from', '数据血缘 — 各区域数值的来源'])), lin));

    c.append(why(copy.conclusion, ['Same mechanism, regional spread', '机制相同，区域分化']));
    main.append(c);
  }
}
