import { h } from '../../utils/dom.js';
import { L } from '../../app/i18n.js';
import { card } from '../../components/card.js';
import { badge } from '../../components/badge.js';
import { chip } from '../../components/chip.js';
import { why } from '../../components/decisionLogic.js';
import { sourceDrawer } from '../../components/sourceDrawer.js';
import { SRC } from './sources.js';
import { WA_ECONOMICS_P0 as P } from './economicsP0.js';

const qualityChip = quality => chip(
  quality === 'VERIFIED' ? 'good' : quality === 'DERIVED' ? 'info' : 'warn',
  quality,
);

const table = (head, rows, numeric = []) => h('div', { class:'tbl-wrap' }, h('table', {},
  h('thead', {}, h('tr', {}, head.map((label, index) =>
    h('th', numeric.includes(index) ? { class:'num' } : {}, L(label))))),
  h('tbody', {}, rows.map(row => h('tr', {}, row.map((cell, index) => {
    const td = h('td', numeric.includes(index) ? { class:'num' } : {});
    if (cell && cell.nodeType) td.append(cell);
    else if (cell && typeof cell === 'object' && !Array.isArray(cell) && cell.bold) td.append(h('b', {}, L(cell.bold)));
    else td.append(document.createTextNode(Array.isArray(cell) ? L(cell) : String(cell)));
    return td;
  }))))
));

const flow = items => h('div', { class:'flow' }, items.flatMap((item, index) => {
  const box = h('span', { class:'fbox', style:index === items.length - 1 ? 'border-color:var(--s1);font-weight:var(--fw-medium);' : '' }, L(item));
  return index === 0 ? [box] : [h('span', { class:'farr' }, '→'), box];
}));

export function renderWaEconomicsP0(main){
  const dna = card(['P0 Economics DNA — how SWIS reliability need becomes BESS cash flow','P0经济DNA — SWIS可靠性需求如何转化为BESS现金流'], [badge('official'), badge('calc'), badge('verify')]);
  dna.append(h('div', { style:'margin:8px 0;' }, chip('warn', L(P.dna.type))));
  dna.append(flow(P.dna.chain));
  dna.append(why([
    'WA is already showing the economics of rapid entry: official Q1 evidence records both spread compression and falling FCESS revenue. The investable chain therefore starts with accredited, network-deliverable capacity; merchant lines are upside.',
    '西澳已显现快速进入的经济后果：官方一季度证据同时记录价差压缩及FCESS收入下降。因此，可投资链条应从经认证且网络可交付的容量开始；市场化收入仅作上行。',
  ], ['Capacity first, merchant second','容量优先，市场化其次']));
  main.append(dna);

  const metrics = card(['Official first-pass economics — VERIFIED, DERIVED and PROXY','官方第一版经济指标 — VERIFIED、DERIVED及PROXY'], [badge('official'), badge('calc')]);
  metrics.append(table(
    [
      ['Metric','指标'],
      ['Value','数值'],
      ['Class','分类'],
      ['Formula / official source','公式 / 官方来源'],
      ['Limitation','限制'],
    ],
    P.metrics.map(metric => [
      { bold:metric.label },
      metric.display,
      qualityChip(metric.quality),
      h('span', {}, metric.formula, ' ', h('a', { href:metric.sourceUrl, target:'_blank', rel:'noopener' }, metric.source)),
      metric.limitation,
    ]),
    [1],
  ));
  metrics.append(h('div', { class:'note' }, L([
    'VERIFIED is directly stated official evidence; DERIVED is transparent arithmetic; PROXY is an official market signal that cannot substitute for a project-specific executable metric.',
    'VERIFIED为官方直接发布证据；DERIVED为透明计算；PROXY为不能替代项目可执行指标的官方市场信号。',
  ])));
  metrics.append(sourceDrawer(SRC.qed, ['Operating stock, achieved spread and FCESS first-pass evidence.','在运存量、已实现价差及FCESS第一版证据。']));
  main.append(metrics);

  const capacity = card(['Capacity accreditation — the paid MW chain','容量认证 — 获付MW链条'], [badge('official'), badge('calc')]);
  capacity.append(flow(P.capacityLogic.chain));
  capacity.append(table(
    [
      ['Formula','公式'],
      ['100 MW example','100MW示例'],
      ['Release class','发布分类'],
    ],
    [[
      P.capacityLogic.formula,
      P.capacityLogic.example,
      qualityChip('DERIVED'),
    ]],
  ));
  capacity.append(h('div', { class:'warnbox' }, P.capacityLogic.limitation));
  capacity.append(sourceDrawer(SRC.brcp, ['Official BRCP benchmark; actual payment remains governed by certification, NAQ, credit assignment and RCP.','官方BRCP基准；实际支付仍受认证、NAQ、信用分配及RCP约束。']));
  main.append(capacity);

  const competition = card(['Operating vs committed BESS competition — coverage boundary first','在运与已承诺BESS竞争 — 覆盖边界优先'], [badge('official'), badge('verify')]);
  competition.append(table(
    [
      ['Competition layer','竞争层'],
      ['MW','MW'],
      ['Class','分类'],
      ['What it actually means','实际含义'],
    ],
    P.competition.rows.map(row => [
      { bold:row.label },
      row.value,
      qualityChip(row.quality),
      row.definition,
    ]),
    [1],
  ));
  competition.append(h('div', { class:'warnbox' }, h('b', {}, `${P.competition.status}: `), P.competition.boundary));
  competition.append(sourceDrawer(SRC.esoo, ['Existing-plus-committed BESS classification and explicit project-funnel boundary.','现有加已承诺BESS分类及显式项目漏斗边界。']));
  main.append(competition);

  const conclusion = card(['Investment conclusion and Bear / Base / Bull driver tree','投资结论及熊市 / 基准 / 牛市驱动树'], [badge('forecast'), badge('verify')]);
  conclusion.append(h('div', { class:'reco' }, h('b', {}, L(P.conclusion.headline)), L(P.conclusion.text)));
  conclusion.append(table(
    [
      ['Case','情景'],
      ['BESS-owner perspective','BESS业主视角'],
      ['System / consumer perspective','系统 / 消费者视角'],
      ['Binding drivers','关键驱动'],
    ],
    P.scenarios.map(scenario => [
      { bold:[scenario.name, scenario.name] },
      scenario.owner,
      scenario.system,
      scenario.drivers.join(' · '),
    ]),
  ));
  conclusion.append(why([
    'The owner bull case is explicitly a stressed-system case: delayed replacement capacity can lift RCP and scarcity value while worsening reliability and consumer cost.',
    '业主牛市情景明确对应系统压力：替代容量延迟可抬升RCP及稀缺价值，同时恶化可靠性及消费者成本。',
  ], ['Investor bull can be system bear','投资者牛市可能是系统熊市']));
  main.append(conclusion);

  const gates = card(['Executable spread / capture-rate release gates','可执行价差 / 捕获率发布门槛'], [badge('verify')]);
  gates.append(table(
    [
      ['Duration','时长'],
      ['Status','状态'],
      ['Required governed evidence','所需受治理证据'],
      ['Current boundary','当前边界'],
    ],
    P.executionGates.map(gate => [
      { bold:[`${gate.hours}h`, `${gate.hours}小时`] },
      chip('warn', gate.status),
      gate.requirement,
      gate.currentEvidence,
    ]),
  ));
  gates.append(h('div', { class:'warnbox' }, L([
    'No 2h/4h/8h executable spread or capture-rate output is released until these interval-data gates pass. Missing evidence is TO_BUILD, never zero.',
    '在区间数据门槛通过前，不发布任何2小时/4小时/8小时可执行价差或捕获率输出。缺失证据标记为TO_BUILD，绝不视为零。',
  ])));
  gates.append(sourceDrawer(SRC.qed, ['Official market proxy only; future project-duration backtest remains gated.','仅作为官方市场代理；未来项目时长回测仍受门槛限制。']));
  main.append(gates);
}
