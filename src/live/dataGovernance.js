import {h} from '../utils/dom.js';
import {L} from '../app/i18n.js';
import {spacedCard} from '../components/card.js';
import {navigate} from '../app/router.js';

const authChip = authority => h('span', {class:'ds-auth '+authority}, authority);

export function renderGovernance(main, AUTHORITY){
  const c = spacedCard(
    ['What automation may and may not change', '自动化的权限边界'],
    []);

  c.append(h('div', { class: 'note' }, L([
    'The rule: judgement publishes automatically after validation; methodology never does. Every value on this site belongs to exactly one of the classes below. The class decides who may change it, and that decision is enforced in code rather than by convention — the pipeline can write published data and the view store, each through its own writer, and a test fails the build if it reaches anywhere else.',
    '规则是：判断经校验后自动发布，方法论永不自动改动。本站每一项数值均归属下列某一类别。类别决定其修改权限，并由代码强制执行而非依赖约定 — 数据管线只能写入已发布数据与观点库，且各自经由专属写入器；若触及其他位置，测试将使构建失败。',
  ])));
  c.append(h('div', { class: 'cap' }, L([
    'What you are looking at: a grade or a verdict on this site may have been set by the analyst, or changed by a rule he wrote in advance when a published figure crossed the line he set. Nothing on the page marks which. ',
    '你所看到的内容：本站的评级或结论可能由分析师设定，也可能在公开数据越过他预先设定的阈值时，由他事先写好的规则改动。页面上不作标注。',
  ]), h('a', { href: '/changes', onclick: (e) => { e.preventDefault(); navigate('/changes'); } },
    L(['The changelog says who made each change, and on what evidence →', '变更记录写明每项变更由谁作出、依据何在 →']))));

  const rows = [
    [AUTHORITY.OBSERVED, ['Fetched from a public source', '取自公开来源'],
      ['Published automatically after validation', '经校验后自动发布']],
    [AUTHORITY.DERIVED, ['Computed from observed data by a fixed formula', '按固定公式从实测数据计算'],
      ['Published automatically after validation', '经校验后自动发布']],
    [AUTHORITY.ANALYST, ['An assumption a public observation bears on', '有公开观测可参照的假设'],
      ['Automation may open a pull request. It may never apply one.', '自动化可提交拉取请求，但绝不可自行应用']],
    [AUTHORITY.VIEW, ['Judgement in the view store: a grade, a verdict, the thesis, a trigger', '观点库中的判断：评级、结论、投资论点、触发事件'],
      ['A rule the analyst wrote in advance may change a grade or a verdict when it fires, with the snapshot as evidence. On a market with a dashboard an agent runs dry: it reports and does not write. Scouting cards, for markets with no dashboard, are the agent\'s to write from pages the analyst listed, each record with a quotation checked against the fetched page; until the analyst makes it live there it is dry on those too. A held view and a pinned record are the analyst\'s alone.',
       '分析师事先写好的规则触发时，可凭数据快照为证改动评级或结论。对已有看板的市场，智能体仅试运行：只报告，不写入。尚无看板的市场设有观察卡片，由智能体依据分析师列出的页面撰写，每条记录都附有与所抓取页面逐字核对过的引文；在分析师启用之前，智能体对卡片同样只试运行。从业者观点与已锁定的记录只由分析师改动。']],
    [AUTHORITY.METHODOLOGY, ['Scoring weights, grade anchors, limits, score bands, discount rates', '评分权重、评级锚定标准、限额、评分区间、折现率'],
      ['Human-set only. Automation may not change one and may not even propose it.', '仅由人工设定；自动化不得改动，也不得提出建议']],
  ];

  const t = h('table', { class: 'ds-table' },
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Class', '类别'])),
      h('th', {}, L(['What it covers', '涵盖范围'])),
      h('th', {}, L(['What automation may do', '自动化权限'])))),
    h('tbody', {}, ...rows.map(([a, what, may]) => h('tr', {},
      h('td', {}, authChip(a)),
      h('td', {}, L(what)),
      h('td', {}, L(may))))));

  c.append(t);
  main.append(c);
}

