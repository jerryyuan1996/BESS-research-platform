/* ---------------------------------------------------------------------------
   PROJECT DEBT — the panel.

   It was a tab on all six dashboards. It is now the levered half of the home
   page's Investment Lab, which is a simplification rather than a move: the panel
   always took a registry entry and nothing else, so six tabs were already six
   copies of one renderer reading the same normalized inputs. What changed is
   that it now reads the SCENARIO — a market under the reader's overrides — so
   moving an assumption reprices the debt as well as the return.

   What this panel is for. The cross-market cockpit is unlevered on purpose,
   which leaves the most important consequence of a route to market unmeasured:
   what a capacity contract or a toll principally buys is DEBT. This prices that,
   per market, with the conventions lenders described through 2026 — and reports
   the three things a levered summary usually hides:

     · how much of the debt stands on contracted cash flow rather than a forecast
     · where the structure has to be refinanced, and with what outstanding
     · whether leverage helps at all, which for a low-yielding award it does not

   All figures are USD per MW of nameplate, matching the comparison engine.
   Sizing model and sources: src/economics/projectDebt.js.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { card } from './card.js';
import { badge } from './badge.js';
import { chip } from './chip.js';
import { kpi } from './metricCard.js';
import { why } from './decisionLogic.js';
import { fmtN, fmt1, fmtPct, fmtIRR } from '../utils/formatting.js';
import { runCase } from '../comparison/engine.js';
import { supportedStrategies, baseStrategy, strategyById } from '../comparison/strategies.js';
import { sizeProjectDebt, riskClassFor, DEBT_CONVENTIONS, allInRate } from '../economics/projectDebt.js';

const usd = (v) => v == null ? '—' : '$' + fmtN(Math.round(v));
const usdM = (v) => v == null ? '—' : '$' + fmt1(v / 1e6) + 'M';
const yrs = (v) => (v ? v + L([' yr', '年']) : '—');
const dscrOf = (v) => v == null ? '—' : v.toFixed(2) + 'x';

function table(head, rows, num = []){
  const w = h('div', { class: 'tbl-wrap' });
  w.append(h('table', {},
    h('thead', {}, h('tr', {}, head.map((x, i) =>
      h('th', num.includes(i) ? { class: 'num' } : {}, L(x))))),
    h('tbody', {}, rows.map(r => h('tr', {}, r.map((cell, i) => {
      const td = h('td', num.includes(i) ? { class: 'num' } : {});
      if (cell && cell.b) td.append(h('b', {}, L(cell.b)));
      else if (cell && cell.chip) td.append(chip(cell.chip, L(cell.text)));
      else td.append(document.createTextNode(cell == null ? '—' : L(cell)));
      return td;
    }))))));
  return w;
}

/**
 * @param {HTMLElement} parent
 * @param {object} market  a registry entry ({ manifest, comparison, … })
 * @param {number} [exitYear]
 * @param {object} [opts]
 * @param {object} [opts.conventions]  overrides the governed financing conventions.
 *   Only the Investment Lab passes this, and only for the four PRICED fields —
 *   base rate, margin and the two gearing ceilings. Coverage tests, the tranche
 *   split and the tenor caps are methodology and are not reachable from the UI;
 *   see src/comparison/ranges.js.
 */
export function renderProjectDebt(parent, market, exitYear = 5, opts = {}){
  const C = { ...DEBT_CONVENTIONS, ...(opts.conventions || {}) };

  if (!market || !market.comparison){
    parent.append(h('div', { class: 'warnbox' }, L([
      'Project debt is unavailable: this market publishes no normalized comparison inputs.',
      '无法测算项目债务：该市场未发布归一化对比输入。',
    ])));
    return;
  }

  const routes = supportedStrategies(market)
    .map(s => {
      const result = runCase(market, s.id, exitYear);
      if (result.na) return null;
      const debt = sizeProjectDebt(result, { exitYear, riskClass: riskClassFor(market, s.id), conventions: C });
      return debt ? { s, result, debt } : null;
    })
    .filter(Boolean);

  if (!routes.length){
    parent.append(h('div', { class: 'warnbox' }, L([
      'No route to market produces a financeable case at current assumptions.',
      '在当前假设下，没有任何售电路径可形成可融资方案。',
    ])));
    return;
  }

  const baseId = baseStrategy(market);
  const base = routes.find(r => r.s.id === baseId) || routes[0];
  const r = allInRate(C);

  /* ---- A. the base-case structure --------------------------------------- */

  const cA = card(
    ['Project debt — what the route to market finances',
     '项目债务 — 售电路径能支撑多少融资'],
    [badge('calc'), badge('illus')]);

  cA.append(h('div', { class: 'note' },
    h('b', {}, L(['Base case: ', '基准情景：'])),
    L([
      L(strategyById(baseId).n) + ' · unlevered project cash flow from the comparison engine, USD per MW · two tranches sized separately, the contracted one at a '
        + C.dscrSecured.toFixed(2) + 'x coverage test and the market one at '
        + C.dscrMarket.toFixed(2) + 'x · all-in cost of debt '
        + fmtPct(r * 100) + ' (base ' + fmtPct(C.baseRate * 100)
        + ' + margin ' + fmtPct(C.margin * 100) + ')',
      L(strategyById(baseId).n) + ' · 采用对比引擎的无杠杆项目现金流，单位为每MW美元 · 分两档独立测算：合同档覆盖倍数 '
        + C.dscrSecured.toFixed(2) + '倍，市场档 '
        + C.dscrMarket.toFixed(2) + '倍 · 综合债务成本 '
        + fmtPct(r * 100) + '（基准利率 ' + fmtPct(C.baseRate * 100)
        + ' + 利差 ' + fmtPct(C.margin * 100) + '）',
    ])));

  cA.append(h('div', { class: 'kpis' },
    kpi(L(['Gearing achieved', '实现杠杆率']), fmtPct(base.debt.gearing * 100, 0),
      { text: L(base.debt.ceilingBinds
        ? ['Capped by the gearing ceiling', '受杠杆上限约束']
        : ['Capped by the coverage test', '受覆盖倍数约束']) }),
    kpi(L(['Senior debt', '优先级债务']), usdM(base.debt.totalDebt),
      { text: L(['per MW of nameplate', '每铭牌MW']) }),
    kpi(L(['On contracted cash flow', '由合同现金流支撑']),
      fmtPct(base.debt.securedDebtShare * 100, 0),
      { text: L(['share of senior debt', '占优先级债务比例']) }),
    kpi(L(['Minimum DSCR', '最低偿债覆盖倍数']), dscrOf(base.debt.minDSCR)),
    kpi(L(['Levered IRR (yr ' + exitYear + ')', '杠杆后IRR（第' + exitYear + '年）']),
      fmtIRR(base.debt.irrLevered),
      { text: L(['unlevered ', '无杠杆 ']) + fmtIRR(base.debt.irrUnlevered),
        cls: base.debt.irrLevered != null && base.debt.irrUnlevered != null
          && base.debt.irrLevered < base.debt.irrUnlevered ? 'bad' : null })));

  cA.append(table(
    [['Tranche', '档级'], ['Sized against', '测算基础'], ['Coverage', '覆盖倍数'],
     ['Amount / MW', '金额/MW'], ['Tenor', '期限'], ['Repayment', '还本方式']],
    [
      [{ b: ['A', 'A'] }, ['Secured cash flow', '合同化现金流'],
        C.dscrSecured.toFixed(2) + 'x', usd(base.debt.trancheA.amount),
        yrs(base.debt.trancheA.tenor), ['Fully amortising', '完全摊还']],
      [{ b: ['B', 'B'] }, ['Market cash flow', '市场化现金流'],
        C.dscrMarket.toFixed(2) + 'x', usd(base.debt.trancheB.amount),
        yrs(base.debt.trancheB.tenor),
        base.debt.trancheB.balloon > 0
          ? ['Mini-perm, balloon ' + usd(base.debt.trancheB.balloon), '短期过桥，尾款 ' + usd(base.debt.trancheB.balloon)]
          : ['—', '—']],
      [{ b: ['Equity', '权益'] }, ['Residual', '剩余'], '—', usd(base.debt.equity), '—', '—'],
    ], [3, 4]));

  cA.append(why([
    'The single number to read is the share of senior debt standing on contracted cash flow. Year-one contracted share — the figure the cockpit’s certainty frontier plots — treats a one-year award and a fifteen-year contract identically. Debt does not: it applies tenor and coverage before it applies optimism, so two assets that look equally contracted can finance completely differently. That gap is the reason this tab exists.',
    '最值得关注的单一指标是优先级债务中由合同现金流支撑的比例。驾驶舱“确定性前沿”所绘制的第1年合同化占比，将一年期中标与十五年合同同等看待；而债务不会——它先施加期限与覆盖倍数约束，再考虑乐观预期。因此两个看似合同化程度相同的资产，融资结果可能截然不同。这一差距正是本页存在的理由。',
  ], ['Read the secured debt share, not the secured revenue share', '看债务的锁定占比，而非收入的锁定占比']));
  parent.append(cA);

  /* ---- B. tenor risk and rollover --------------------------------------- */

  const cB = card(['Tenor risk, rollover and debt matching', '期限风险、续作与债务匹配'], [badge('calc')]);

  cB.append(h('div', { class: 'note' }, h('b', {}, L(['The matching rule: ', '匹配规则：'])),
    L([
      'debt tenor = min(secured tenor + rollover allowance, battery warranty, legal cap). The rollover allowance is zero for auction-renewal revenue — nobody lends a term loan against an auction that has not happened — and zero for a toll, because the toll is the security and it stops when it stops.',
      '债务期限 = min（锁定年限 + 续作宽限, 电池质保期, 法定上限）。对拍卖续约型收入，续作宽限为零 — 没有贷款人会以尚未发生的拍卖为抵押发放定期贷款；对租赁结构亦为零 — 租赁本身即为担保，租赁终止即担保终止。',
    ])));

  cB.append(table(
    [['Route', '路径'], ['Secured tenor', '锁定年限'], ['Rollover allowed', '续作宽限'],
     ['Debt tenor A', 'A档期限'], ['Merchant tail from', '市场化敞口起始'],
     ['Maturity year', '到期年度'], ['Balloon / MW', '尾款/MW'], ['Equity funding gap / MW', '股东追加资金/MW']],
    routes.map(({ s, debt }) => [
      { b: s.n },
      yrs(debt.securedYears),
      debt.rolloverAllowance ? yrs(debt.rolloverAllowance) : { chip: 'bad', text: ['none', '无'] },
      yrs(debt.trancheA.tenor),
      debt.merchantTailFrom ? L(['yr ', '第']) + debt.merchantTailFrom + L(['', '年']) : '—',
      debt.refinanceYear ? L(['yr ', '第']) + debt.refinanceYear + L(['', '年']) : ['None', '无'],
      debt.balloon > 0 ? usd(debt.balloon) : '—',
      usd(Math.max(0, ...debt.maturityFundingGap)),
    ]), [1, 2, 3, 4, 5, 6]));

  cB.append(why([
    'Equity repays the remaining loan at maturity; no refinancing is assumed. Returns include that repayment once, including an additional equity contribution when operating cash is insufficient. The funding gap is shown separately from ordinary DSCR. All years are operating years. Construction draws follow staged spending; construction interest and fees are assumed zero. Financing remains illustrative, not a lender commitment.',
    '到期贷款余额由股东偿还，不假设获得新贷款。回报已计入一次尾款偿还；经营现金不足时计入股东追加资金。该缺口与日常偿债覆盖倍数分开显示。年度均从投运起算。建设期按支出进度提款，建设期利息及融资费用暂按零计。融资仅为示例，不代表银行承诺。',
  ], ['Equity repays the balloon at maturity', '到期尾款由股东偿还']));
  parent.append(cB);

  /* ---- C. debt capacity by route ---------------------------------------- */

  const cC = card(['Debt capacity by route to market', '按售电路径的债务承载能力'], [badge('calc')]);

  cC.append(table(
    [['Route', '路径'], ['Gearing', '杠杆率'], ['On contract', '合同支撑占比'],
     ['Min DSCR', '最低覆盖倍数'], ['Unlevered IRR', '无杠杆IRR'], ['Levered IRR', '杠杆后IRR'],
     ['Leverage', '杠杆效果']],
    routes.map(({ s, debt }) => {
      const helps = debt.irrLevered != null && debt.irrUnlevered != null
        && debt.irrLevered > debt.irrUnlevered;
      return [
        { b: s.n },
        fmtPct(debt.gearing * 100, 0),
        fmtPct(debt.securedDebtShare * 100, 0),
        dscrOf(debt.minDSCR),
        fmtIRR(debt.irrUnlevered),
        fmtIRR(debt.irrLevered),
        debt.irrLevered == null
          ? '—'
          : { chip: helps ? 'ok' : 'bad', text: helps ? ['accretive', '增厚'] : ['dilutive', '摊薄'] },
      ];
    }), [1, 2, 3, 4, 5]));

  cC.append(h('div', { class: 'cap' }, L([
    'Leverage is accretive only where the project return exceeds the all-in cost of debt of ' + fmtPct(r * 100) + '. A route can carry a high secured share, finance easily, and still dilute equity.',
    '仅当项目回报高于 ' + fmtPct(r * 100) + ' 的综合债务成本时，杠杆才具增厚作用。某一路径可能锁定占比高、融资顺利，却仍然摊薄权益回报。',
  ])));

  cC.append(why([
    'This table is where a contracted route earns its premium or fails to. The cockpit prices certainty through a 400bp spread between contracted and merchant exit yields, which is a statement about who will buy the asset. Debt capacity is a statement about who will fund it, and the two do not always agree — a long, low-priced award can be highly bankable and simultaneously a poor use of equity.',
    '本表决定了合同化路径能否兑现其溢价。驾驶舱通过合同化与市场化退出折现率之间400个基点的利差来定价确定性，这反映的是“谁会买这项资产”。而债务承载能力反映的是“谁会为其提供资金”，两者未必一致 — 一个期限长但价格低的中标合同，可能既高度可融资，又是权益资本的低效运用。',
  ], ['Bankable and worth owning are different tests', '可融资与值得持有是两个不同的检验']));
  parent.append(cC);

  /* ---- D. assumptions ---------------------------------------------------- */

  const cD = card(['Financing assumptions and where they come from', '融资假设及其来源'], [badge('illus')]);

  cD.append(table(
    [['Parameter', '参数'], ['Value', '取值'], ['Basis', '依据']],
    [
      [['Gearing ceiling — contracted', '杠杆上限 — 合同化'], fmtPct(C.maxGearingSecured * 100, 0),
        ['Reported band 60–75%; rarely the 80–85% of solar and wind', '市场区间60–75%；罕有光伏风电的80–85%']],
      [['Gearing ceiling — merchant', '杠杆上限 — 市场化'], fmtPct(C.maxGearingMarket * 100, 0),
        ['Reported band 50–60%', '市场区间50–60%']],
      [['DSCR — contracted tranche', '覆盖倍数 — 合同档'], C.dscrSecured.toFixed(2) + 'x',
        ['Tolled portions sized around 1.15x', '租赁部分按约1.15倍测算']],
      [['DSCR — market tranche', '覆盖倍数 — 市场档'], C.dscrMarket.toFixed(2) + 'x',
        ['Merchant portions need a much larger cushion, often 2.0x', '市场化部分需更厚缓冲，通常2.0倍']],
      [['P90 DSCR quoted by lenders', '贷款人报出的P90覆盖倍数'],
        C.p90Band[0].toFixed(2) + '–' + C.p90Band[1].toFixed(2) + 'x',
        ['Reported, not used to size — our cash flows are P50', '仅供参考，不用于测算 — 本模型现金流为P50']],
      [['Legal tenor cap', '法定期限上限'], yrs(C.legalTenorCap),
        ['7–10 year hard mini-perms', '7–10年硬性短期过桥结构']],
      [['Amortisation profile cap', '摊还期限上限'], yrs(C.warrantyTenor),
        ['Constrained by battery supplier warranty duration', '受电池供应商质保期约束']],
      [['Base rate', '基准利率'], fmtPct(C.baseRate * 100),
        ['SOFR, January 2026 (down 69bp from August 2025)', 'SOFR，2026年1月（较2025年8月下降69个基点）']],
      [['Margin', '利差'], fmtPct(C.margin * 100),
        { b: ['ASSUMPTION — midpoint of a 200–250bp band, not an observation', '假设值 — 200–250基点区间的中值，非实测'] }],
    ], [1]));

  cD.append(h('div', { class: 'warnbox' }, L([
    'The margin is the weakest input on this page. BESS-specific senior debt margins are not publicly quoted, so it is an assumption band rather than a market observation, and every levered IRR here moves with it. Gate G10 in docs/external-view.md is what would replace it.',
    '利差是本页最薄弱的输入。储能项目的优先级债务利差并无公开报价，因此这是一个假设区间而非市场实测值，本页所有杠杆后IRR均随之变动。docs/external-view.md 中的G10研究缺口即为替换该假设的路径。',
  ])));

  cD.append(why([
    'Everything above is a market convention, not a term sheet. The point of stating them as data rather than burying them in a spreadsheet is that a reader can disagree with one number and see exactly which conclusions move — and that the ETL can, in principle, propose an update to the observable ones. The coverage tests and the sizing rules are methodology and stay human-set.',
    '以上均为市场惯例，而非具体条款清单。将其作为数据明示而非埋藏于表格中，目的在于：读者可对某一数值提出异议，并直接看到哪些结论随之变化；同时ETL在原则上可对可观测项提出更新建议。覆盖倍数检验与测算规则属方法论，仅由人工设定。',
  ], ['Conventions as data, methodology as judgement', '惯例作为数据，方法论作为判断']));
  parent.append(cD);
}

export default renderProjectDebt;
