/* ---------------------------------------------------------------------------
   The $1M engine — one dollar, N markets, every applicable route to market.

   Four blocks, all N-market:
     A  normalization rules + the market × route matrix
     B  hold IRR by market and route
     C  the certainty frontier (contracted share vs exit IRR)
     D  a $1M waterfall for the selected market

   Routes with no basis in a market are omitted from the matrix entirely, exactly
   as the prototype did — driven now by declared capabilities rather than by a
   zero-valued field.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { requestRender } from '../app/state.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { why } from '../components/decisionLogic.js';
import { kpi } from '../components/metricCard.js';
import { barChart, scatterChart, waterfall } from '../charts/index.js';
import {
  NF2, fmtN, fmt1, fmtPct, fmtUSDk, fmtIRR, fmtX,
} from '../utils/formatting.js';
import { runCase, runBaseCase } from '../comparison/engine.js';
import { STRATEGIES, strategyById, baseStrategy } from '../comparison/strategies.js';
import { FX, EXIT_Y_CONTRACTED, EXIT_Y_MERCHANT, FX_NOTE, FX_SEED_DATE } from '../comparison/assumptions.js';
import { homeState, waterfallMarket } from './state.js';

/* ---- A. assumptions + matrix -------------------------------------------- */

function grantClause(marketList){
  const granted = marketList.filter(m => m.comparison.economics.grantPct > 0);
  if (!granted.length) return { en: 'no grants are netted off capex', zh: '未从造价中扣除任何补贴' };
  const list = granted.map(m => L(m.manifest.shortName) + ' ' + m.comparison.economics.grantPct + '%').join(', ');
  return {
    en: 'grants netted off capex only where the source dashboard supports them (' + list + ')',
    zh: '仅在来源看板支持时将补贴从造价中扣除（' + list + '）',
  };
}

function fxRow(marketList){
  // Only show rates actually in use by the registered markets.
  const used = [...new Set(marketList.map(m => m.manifest.currency))];
  /* Two decimals is right for majors and wrong for JPY — ¥1 = $0.0064 rounds to
     $0.01, a 56% error on the face of the page. Scale the precision to the rate. */
  const rate = (v) => (v < 0.1
    ? v.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
    : NF2.format(v));
  const txt = used.map(cur => {
    const mf = marketList.find(m => m.manifest.currency === cur).manifest;
    return mf.currencySymbol + '1 = $' + rate(FX[cur]);
  }).join(' · ');
  return h('div', { class: 'fxrow' },
    h('span', {}, 'FX: ' + txt),
    h('span', {}, L(['Seed date: ', '种子日期：']) + FX_SEED_DATE),
    h('span', {}, L(FX_NOTE)));
}

function renderMatrix(main, marketList, X){
  const cA = spacedCard(
    ['The $1M engine — one dollar, ' + marketList.length + ' markets, comparable routes to market',
     '百万美元引擎 — 同一美元、' + marketList.length + '个市场、可比售电路径'],
    [badge('calc'), badge('illus')]);

  const g = grantClause(marketList);
  cA.append(h('div', { class: 'note' }, h('b', {}, L(['Normalization rules: ', '归一化规则：'])),
    L([
      'Uniform 15-year window · unlevered · each market’s reference archetype from its own dashboard · merchant revenue net of optimiser fees, degrading 2%/yr · capacity lines at each market’s contract terms, stepping down after expiry · ' + g.en + ' · exit at year ' + X + ' priced as remaining contracted cash flow at ' + fmtPct(EXIT_Y_CONTRACTED * 100) + ' and merchant at ' + fmtPct(EXIT_Y_MERCHANT * 100) + '. Leverage is deliberately excluded: debt capacity differs by market for exactly the reasons this page measures, so it is expressed through the exit yields rather than assumed.',
      '统一15年窗口 · 无杠杆 · 各市场采用其自身看板的参考原型 · 市场化收入已扣除优化商费用并按每年2%衰减 · 容量收入按各市场合同条款计算、到期后阶梯下调 · ' + g.zh + ' · 第' + X + '年退出：剩余合同化现金流按' + fmtPct(EXIT_Y_CONTRACTED * 100) + '折现、市场化按' + fmtPct(EXIT_Y_MERCHANT * 100) + '折现。刻意不含杠杆：各市场债务容量的差异恰恰是本页所度量的对象，因此以退出折现率而非杠杆假设来表达。',
    ])));
  cA.append(fxRow(marketList));

  /* Build every row once, then take the best hold IRR from those same results.
     The prototype ran runCase twice — once to find the maximum and once to render
     — and compared the two doubles with ===. Computing once removes that
     fragility (docs/migration-notes.md, B2) while producing identical output. */
  const perMarket = marketList.map(m => ({
    market: m,
    runs: STRATEGIES.map(s => ({ s, r: runCase(m, s.id, X) })).filter(x => !x.r.na),
  }));
  const allIrrs = perMarket.flatMap(pm => pm.runs.map(x => x.r.irrHold)).filter(v => v != null);
  const bestIrr = allIrrs.length ? Math.max(...allIrrs) : null;

  const rows = [];
  perMarket.forEach(({ market: m, runs }, mi) => {
    runs.forEach(({ s, r }, i) => {
      const tr = h('tr', { class: 'eng-row' + (mi % 2 ? ' alt' : '') + (i === 0 ? ' grp-first' : '') });
      if (i === 0) tr.append(h('td', { class: 'mcell', rowspan: String(runs.length), style: '--mc:' + m.manifest.color },
        h('span', { class: 'mflag' }, m.manifest.flag),
        h('span', { class: 'mname' }, L(m.manifest.shortName)),
        h('span', { class: 'march' }, L(m.comparison.narrative.archetype))));
      const sc = h('td', {}, h('b', {}, L(s.n)));
      if (r.note) sc.append(h('span', { class: 'snote' }, '↳ ' + L(r.note)));
      tr.append(sc,
        h('td', { class: 'num' }, fmtN(r.kwPerM)),
        h('td', { class: 'num' }, fmtUSDk(r.eb1 * 1e6 / r.net)),
        h('td', { class: 'num' }, r.payback ? r.payback + L([' yr', ' 年']) : '—'),
        h('td', { class: 'num' + (r.irrHold === bestIrr ? ' best' : '') }, h('b', {}, fmtIRR(r.irrHold))),
        h('td', { class: 'num' }, fmtIRR(r.irrExit)),
        h('td', { class: 'num' }, h('b', {}, fmtX(r.moic))));
      rows.push(tr);
    });
  });

  cA.append(h('div', { class: 'tbl-wrap eng' }, h('table', {},
    h('thead', {}, h('tr', {},
      h('th', {}, L(['Market', '市场'])),
      h('th', {}, L(['Route to market', '售电路径'])),
      h('th', { class: 'num' }, L(['kW per $1M', '每$1M可控kW'])),
      h('th', { class: 'num' }, L(['Yr-1 cash per $1M', '每$1M第1年现金'])),
      h('th', { class: 'num' }, L(['Payback', '回收期'])),
      h('th', { class: 'num' }, L(['15-yr IRR', '15年IRR'])),
      h('th', { class: 'num' }, L(['Exit-yr ' + X + ' IRR', '第' + X + '年退出IRR'])),
      h('th', { class: 'num' }, L(['MOIC (yr ' + X + ')', 'MOIC（第' + X + '年）'])))),
    h('tbody', {}, rows))));

  cA.append(h('div', { class: 'cap' }, L([
    'Only routes with a basis in each market are listed: Romania has no capacity mechanism, and the tolled/floor structure has a market precedent only in GB. Green marks the highest hold IRR in the matrix.',
    '仅列示在各市场确有依据的路径：罗马尼亚无容量机制，租赁/保底结构仅在英国有市场先例。绿色标示矩阵中最高的持有IRR。',
  ])));
  cA.append(why([
    'Read each market\'s rows against each other, not against other markets. The gap between a market\'s capacity-backed row and its merchant row is what that market\'s mechanism is actually worth — a couple of IRR points in some, the entire investment case in others. And the merchant rows are really a duration test: strip the capacity revenue away and the result sorts by hours rather than by country, because merchant revenue pays for power while only a capacity mechanism pays for hours. Where the mechanism secures one delivery year at a time, that gap is itself at risk — which is why the secured tenor column exists.',
    '应将每个市场的各行相互对照，而非跨市场对照。同一市场容量支撑行与纯市场化行之间的差距，即为该市场机制的真实价值 — 在部分市场为几个IRR百分点，在另一些市场则是整个投资逻辑。纯市场化各行实为一场时长测试：剥离容量收入后，结果按小时数而非国别排序，因为市场化收入为功率付费，而只有容量机制为小时数付费。若该机制每次仅锁定一个交付年度，这一差距本身即处于风险之中 — 这正是设置锁定年限列的原因。',
  ], ['Merchant rows are a duration test', '纯市场化各行是一场时长测试']));
  main.append(cA);
}

/* ---- B. hold IRR by market and route ------------------------------------ */

function renderIrrChart(main, marketList, X){
  const cB = spacedCard(
    ['Hold IRR by market and route (15-yr, unlevered)', '按市场与路径的持有IRR（15年，无杠杆）'],
    [badge('calc')]);

  const colors = ['var(--s2)', 'var(--s1)', 'var(--s3)'];
  barChart(cB, {
    xs: marketList.map(m => L(m.manifest.shortName)),
    mode: 'group', bw: 18, yfmt: v => fmt1(v) + '%', h: 260,
    series: STRATEGIES.map((s, i) => ({
      name: s.n,
      color: colors[i % colors.length],
      /* Unavailable routes are passed as 0 so barChart draws no visible bar, which
         is the prototype's behaviour. The engine itself returns { na } — see
         docs/migration-notes.md, B3, for why this is preserved rather than fixed
         here. Changing it is a one-line change once a visual change is acceptable. */
      vals: marketList.map(m => { const r = runCase(m, s.id, X); return r.na ? 0 : r.irrHold * 100; }),
    })),
  });

  cB.append(h('div', { class: 'cap' }, L([
    'Bars below the zero line are value-destroying at these assumptions. A missing bar means the strategy has no basis in that market (no capacity mechanism in Romania; no toll precedent outside GB).',
    '零线以下的柱表示在该假设下摧毁价值。缺失的柱表示该策略在该市场没有依据（罗马尼亚无容量机制；英国以外无租赁先例）。',
  ])));
  cB.append(why([
    'Notice what the chart does not show: a market that dominates. Wherever a tolled or floor bar sits below its own merchant bar, that gap is the insurance premium the market charges to remove merchant risk — and the premium buys the one thing an unlevered chart cannot show, which is debt capacity. The right reading is that each bar prices a different risk. The portfolio question is which risks you are being paid most to hold, not which bar is tallest.',
    '请注意图中没有出现的东西：一个全面占优的市场。凡租赁或保底柱低于其自身纯市场化柱之处，该差距即为市场为消除市场化风险所收取的保险费 — 而这笔保费买到的正是无杠杆图表无法呈现的东西：债务容量。正确的读法是：每根柱定价的是不同的风险。组合层面的问题是你持有哪类风险获得的报酬最高，而非哪根柱最高。',
  ], ['Each bar prices a different risk', '每根柱定价的是不同风险']));
  main.append(cB);
}

/* ---- C. certainty frontier ---------------------------------------------- */

function renderFrontier(main, marketList, X){
  const cC = spacedCard(
    ['The certainty frontier — contracted share vs exit-year IRR', '确定性前沿 — 合同化占比与退出年IRR'],
    [badge('calc')]);

  scatterChart(cC, {
    xmin: 0, xfmt: v => fmtN(v) + '%', yfmt: v => fmt1(v) + '%',
    xlabel: ['Secured share of year-1 revenue (%) — exit IRR at year ' + X + ' on the y-axis',
             '第1年已锁定收入占比（%） — 纵轴为第' + X + '年退出IRR'],
    pts: marketList.map(m => {
      const r = runBaseCase(m, X);
      const secured = (r.securedShare ?? r.contractedShare) * 100;
      const tenor = r.securedYears ?? m.comparison.economics.contractYears ?? 0;
      return {
        x: secured, y: r.irrExit * 100, color: m.manifest.color,
        label: L(m.manifest.shortName),
        tip: '<b>' + m.manifest.flag + ' ' + L(m.manifest.name) + '</b>' +
          '<div class="tr"><span>' + L(['Secured share', '已锁定占比']) + '</span><b>' + fmtPct(secured, 0) + '</b></div>' +
          // Tenor next to share: a 1-year award and a 15-year contract can sit at
          // the same x position and mean completely different things.
          '<div class="tr"><span>' + L(['Secured tenor', '锁定年限']) + '</span><b>' + (tenor ? tenor + L([' yr', '年']) : '—') + '</b></div>' +
          '<div class="tr"><span>' + L(['Exit IRR', '退出IRR']) + '</span><b>' + fmtIRR(r.irrExit) + '</b></div>' +
          '<div class="tr"><span>MOIC</span><b>' + fmtX(r.moic) + '</b></div>' +
          '<div class="tr"><span>' + L(['Thesis', '逻辑']) + '</span><b>' + L(m.comparison.narrative.archetype) + '</b></div>',
      };
    }),
  });

  cC.append(why([
    'An efficient frontier should slope down — more certainty, less return. This one does not, because exit buyers pay for certainty faster than the auctions charge for it. But read the x-axis carefully: it is secured share, and two points at the same x can carry a one-year award and a fifteen-year contract. Hover for the tenor before concluding that two markets offer the same certainty. A point that is highly secured for a single delivery year is closer to the merchant end of this chart than its position suggests.',
    '有效前沿本应向下倾斜 — 确定性越高、回报越低。此图并非如此，因为退出买家为确定性支付溢价的速度快于拍卖对其收取的价格。但请仔细阅读横轴：其含义为已锁定占比，而横轴同一位置的两个点可能分别对应一年期中标与十五年合同。在断定两个市场具有同等确定性之前，请先查看悬停提示中的锁定年限。仅锁定单一交付年度的高占比点，实际上比其位置所示更接近本图的市场化一端。',
  ], ['Check the tenor before trusting the x-axis', '相信横轴前先核对锁定年限']));
  main.append(cC);
}

/* ---- D. $1M waterfall --------------------------------------------------- */

function renderWaterfall(main, marketList, X){
  const m = waterfallMarket();
  if (!m) return;
  const r = runBaseCase(m, X);
  const sf = 1e6 / r.net;                                    // scale to $1M invested
  const stratName = strategyById(baseStrategy(m)).n;

  const cD = spacedCard(
    ['$1M in, what comes back — ' + L(m.manifest.name) + ', ' + L(stratName) + ', exit year ' + X,
     '投入100万美元的回收路径 — ' + L(m.manifest.name) + '，' + L(stratName) + '，第' + X + '年退出'],
    [badge('calc')]);

  cD.append(h('div', { class: 'seg', style: 'margin:4px 0 6px;' }, marketList.map(mm =>
    h('button', {
      class: 'btn' + (mm.manifest.id === homeState.wfMarket ? ' active' : ''),
      onclick: () => {
        const y = window.scrollY;
        homeState.wfMarket = mm.manifest.id;
        requestRender();
        window.scrollTo(0, y);
      },
    }, mm.manifest.flag + ' ' + L(mm.manifest.shortName)))));

  waterfall(cD, {
    yfmt: v => '$' + fmtN(v) + 'k', h: 280,
    steps: [
      { l: ['$1M invested (net of grant)', '投入100万美元（扣除补贴后）'], v: -1000, t: 'start' },
      { l: ['Operating cash, years 1–' + X, '第1–' + X + '年运营现金'], v: Math.round(r.cumOp * sf / 1000), t: 'd' },
      { l: ['Exit proceeds (yr ' + X + ')', '退出所得（第' + X + '年）'], v: Math.round(r.exitVal * sf / 1000), t: 'd' },
      { l: ['Net position', '净头寸'], v: Math.round((r.cumOp + r.exitVal - r.net) * sf / 1000), t: 'total' },
    ],
  });

  cD.append(h('div', { class: 'kpis' },
    kpi(L(['MOIC at exit', '退出时MOIC']), fmtX(r.moic)),
    kpi(L(['Exit-year IRR', '退出年IRR']), fmtIRR(r.irrExit)),
    kpi(L(['kW controlled per $1M', '每100万美元可控kW']), fmtN(r.kwPerM)),
    kpi(L(['Exit share of total return', '退出占总回报比重']), fmtPct(r.exitVal / (r.cumOp + r.exitVal) * 100, 0))));

  cD.append(why([
    'The last KPI is the one to interrogate: the share of total return that arrives only at exit. Where it is high, the case depends on a buyer existing at year ' + X + ' — which loops back to contracted share, since that is what defines the buyer universe. A market can therefore fail this chart twice: weak operating cash and no natural exit buyer. Check Romania against Poland here and the value of a capacity contract becomes a single picture.',
    '最后一个KPI最值得追问：总回报中仅在退出时才实现的占比。占比越高，投资逻辑越依赖第' + X + '年有买家存在 — 而这又回到合同化占比，因为正是它界定了买家群体。因此一个市场可能在此图上双重失分：运营现金薄弱，且缺乏自然的退出买家。在此将罗马尼亚与波兰对照，容量合同的价值便浓缩为一张图。',
  ], ['Interrogate the exit share', '追问退出占比']));
  main.append(cD);
}

/* ---- entry point -------------------------------------------------------- */

export function renderEngine(main, marketList, exitYear){
  renderMatrix(main, marketList, exitYear);
  renderIrrChart(main, marketList, exitYear);
  renderFrontier(main, marketList, exitYear);
  renderWaterfall(main, marketList, exitYear);
}
