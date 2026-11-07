import {researchHistory} from './history.js';
/* ---------------------------------------------------------------------------
   Spain — declarative section specs for the shared block engine.

   Written 2026-10-29 on the analyst's sign-off of
   docs/spain-registration-plan.md. The order of the argument: a solar spread
   pays a four-hour battery well today, Spain's own build takes back less than
   a tenth by 2028, and the capacity market is law with nothing yet to bank.
   --------------------------------------------------------------------------- */

import { comparison } from './comparison.js';
import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';
import { designLine, designBest } from '../_shared/designAnswer.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { L, M, SRC, state, fmtN, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, dilutionAt, labInputs, labModel } = api;
  const E = comparison.economics;
  const T = M.trading, F = M.fleet, C = M.capacity, G = M.pinalm;

  const SEC_B = {};
  function SECTIONS(){
    const o = {};
    Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
    return o;
  }

  const kMW = (v) => fmtCk(v) + '<small>/MW/yr</small>';
  const y2025 = T.years[2];
  const ytdPct = (T.ytd4[2026] / T.ytd4[2025] - 1) * 100;
  const f2028 = F.years.find(r => r.y === '2028').f;

  // ---------------- Overview -----------------------------------------------
  SEC_B.home = () => ({ head: ['Spain at a glance', '西班牙概览'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'band-story', b: ['Core storyline', '核心叙事'], text: [
        'Spain is a solar spread market: midday prices collapse and evenings hold, so a four-hour battery earned €111k per MW on 2025 day-ahead prices and 2026 is running higher still. Spain\'s own battery fleet is under 0.2 GW, so its build takes back only 7% by a 2028 start. The capacity market is law and has not held an auction; it is the upside, not the case.',
        '西班牙是光伏价差市场：午间电价崩落而晚间坚挺，四小时储能按2025年日前电价每MW收入11.1万欧元，2026年更高。西班牙自身储能不足0.2GW，到2028年投运时其建设仅收回7%。容量市场已立法但尚未拍卖；它是上行空间而非基本情景。',
      ] },
      { t: 'kpis', items: [
        { l: ['Day-ahead value, 4 h, 2025', '4小时日前价值（2025）'], v: kMW(Math.round(y2025.v4 * 1000)), d: ['one cycle a day, perfect foresight', '每日一次循环、完全预见'], b: ['calc'] },
        { l: ['Year-1 trading line, 2028', '第1年交易收入（2028）'], v: kMW(E.merchGross), d: ['× ' + f2028.toFixed(3) + ' for Spain\'s fleet path', '按西班牙机组路径× ' + f2028.toFixed(3)], b: ['calc'] },
        { l: ['2026 so far', '2026年至今'], v: '+' + fmtPct(ytdPct, 0), d: ['4 h value, same days of 2025', '4小时价值，与2025年同期相比'], cls: 'up', b: ['calc'] },
        { l: ['Batteries installed', '已装电池'], v: F.april2026MW + '<small> MW</small>', d: ['REE, April 2026', 'REE，2026年4月'], b: ['official'] },
        { l: ['Capex, 4 h', '资本开支（4小时）'], v: fmtCM(E.capexPerMW) + '<small>/MW</small>', d: ['€220/kWh, the European survey midpoint', '€220/kWh，欧洲调查中值'], b: ['model'] },
        { l: ['First capacity auction', '首次容量拍卖'], v: 'Q1 2027', d: ['sector estimate; no call yet', '业界估计；尚无公告'], b: ['public'] },
      ] },
      { t: 'warn', text: M.seedWarn },
      { t: 'walk', items: [
        ['01', ['Overview', '总览'], ['What is the house view today?', '当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution', '市场演进'], ['How did solar make the spread?', '光伏如何造就价差？'], 'story'],
        ['03', ['Revenue stack', '收入结构'], ['What does trading pay, and what does the fleet take back?', '交易收入多少，机组增长收回多少？'], 'energy'],
        ['04', ['Asset design', '资产设计'], ['Why four hours, and not eight?', '为何四小时而非八小时？'], 'duration'],
        ['05', ['Underwriting', '项目承销'], ['What does a grid application put at risk?', '并网申请承担哪些风险？'], 'grid'],
        ['06', ['Portfolio application', '组合应用'], ['Does the screened case clear the committee gates?', '筛选方案能否通过投委会门槛？'], 'portfolio'],
      ] },
      { t: 'why', text: [
        'Merchant revenue is the whole return until the first capacity auction clears, so a Spanish decision is a view on two things: how fast the fleet arrives, and how much intraday and balancing add to a day-ahead line that is already perfect foresight.',
        '在首次容量拍卖出清前，市场化收入构成全部回报，因此西班牙的投资决策取决于两点：机组增长速度，以及日内与平衡服务能在已按完全预见计算的日前收入之上增加多少。',
      ], sig: [['Merchant carries the case', '市场化收入承担全部逻辑'], ['Fleet still tiny', '机组规模仍极小']] },
      { t: 'src', src: SRC.omiePrices, use: ['The day-ahead value', '日前价值'] },
    ] },
    { t: 'g2', cards: [
      { title: ['Card A — Spread Signal', 'Card A — 价差信号'], live: false, blocks: [
        { t: 'chip', cls: 'good', text: ['Spreads widened as prices fell', '电价下跌而价差扩大'] },
        { t: 'kpis', items: [
          { l: ['Mean price, 2023 → 2025', '均价（2023→2025）'], v: '€' + T.years[0].mean + ' → €' + y2025.mean, b: ['official'] },
          { l: ['4 h value, 2023 → 2025', '4小时价值（2023→2025）'], v: '€' + T.years[0].v4 + 'k → €' + y2025.v4 + 'k', cls: 'up', b: ['calc'] },
        ] },
        { t: 'why', text: [
          'Solar pushes midday prices toward zero — April and May 2025 averaged €' + T.spring2025.april + ' and €' + T.spring2025.may + '/MWh — while evenings stay gas-priced. A battery is paid on the gap, not the level.',
          '光伏将午间电价推向零 — 2025年4月与5月均价分别为€' + T.spring2025.april + '与€' + T.spring2025.may + '/MWh — 而晚间仍由燃气定价。储能赚取的是价差而非价格水平。',
        ], sig: [['Paid on the gap', '赚取价差']] },
      ] },
      { title: ['Card B — Fleet Signal', 'Card B — 机组信号'], live: false, blocks: [
        { t: 'chip', cls: 'good', text: ['Under 0.2 GW against 29 GW of load', '对29GW负荷不足0.2GW'] },
        { t: 'kpis', items: [
          { l: ['Fleet, April 2026', '机组（2026年4月）'], v: F.april2026MW + ' MW', b: ['official'] },
          { l: ['Value lost by 2028', '至2028年价值损失'], v: fmtPct((1 - f2028) * 100, 1), cls: 'warn', b: ['calc'] },
          { l: ['PINALM build', 'PINALM建设'], v: G.gw + ' GW', d: ['by end-2029', '2029年底前'], b: ['official'] },
        ] },
        { t: 'why', text: [
          'Bulgaria built a fleet the size of its load in a year and lost about a quarter of its two-hour value. Spain\'s planned build is a tenth of its load by 2028, which on the same curve costs about 7%.',
          '保加利亚一年内建成相当于其负荷的储能，两小时价值损失约四分之一。西班牙到2028年的计划建设约为负荷的十分之一，按同一曲线损失约7%。',
        ], sig: [['A tenth of load by 2028', '2028年约为负荷的十分之一']] },
      ] },
      { title: ['Card C — Capacity Signal', 'Card C — 容量信号'], live: false, blocks: [
        { t: 'chip', cls: 'warn', text: ['Law, no auction, no price', '已立法、未拍卖、无价格'] },
        { t: 'kpis', items: [
          { l: ['New-storage term', '新建储能期限'], v: '≤' + C.maxYears + '<small> yr</small>', d: ['half the useful life', '使用寿命的一半'], b: ['official'] },
          { l: ['Indexation', '指数化'], v: L(['None', '无']), d: ['art. 15.2', '第15.2条'], b: ['official'] },
        ] },
        { t: 'why', text: [
          'Pay-as-bid, a cap that may be confidential and a firmness coefficient set in each call: nothing can be priced before the first auction. An award will enter nominal, by the analyst\'s ruling, because the order forbids updating it.',
          '按报价支付、上限可能保密、可靠性系数在每次公告中设定：首次拍卖前无从定价。授标将按名义值计入（分析师裁定），因法令禁止调整。',
        ], sig: [['Upside, not the case', '上行空间，非基本情景']] },
      ] },
      { title: ['Card D — Entry Signal', 'Card D — 进入信号'], live: false, blocks: [
        { t: 'chip', cls: 'warn', text: ['€40/kW to apply for a connection', '申请并网须缴每kW €40'] },
        { t: 'kpis', items: [
          { l: ['Access guarantee, 50 MW', '接入担保（50MW）'], v: '€' + fmtN(M.guaranteePerKW * 50000 / 1e6) + 'm', b: ['official'] },
          { l: ['In permitting', '审批中'], v: F.permittingGW + ' GW', d: ['December 2025', '2025年12月'], b: ['public'] },
        ] },
        { t: 'why', text: [
          'Grid access, not permits or capital, is what a Spanish project waits for: the guarantee is posted with the application and returned at operation, and saturated nodes are allocated by tender.',
          '西班牙项目等待的是电网接入，而非许可或资本：担保随申请提交、投运后退还，饱和节点通过招标分配。',
        ], sig: [['Access is the queue', '接入即排队']] },
      ] },
    ] },
  ] });

  // ---------------- Market story -------------------------------------------
  SEC_B.story = () => ({ head: researchHistory(api).head, blocks: [
    researchHistory(api).cards[0],
    { t: 'card', title: ['Price level against battery value', '电价水平与储能价值'], badges: ['official', 'calc'], blocks: [
      { t: 'bar', cfg: { xs: T.years.map(r => r.y), bw: 46, labels: true, h: 230, yfmt: v => '€' + fmtN(v) + 'k',
        series: [{ name: ['4 h day-ahead value, €k/MW-yr', '4小时日前价值（千欧元/MW/年）'], color: 'var(--s9)', vals: T.years.map(r => r.v4) }] } },
      { t: 'cap', text: ['One cycle a day, charge before discharge, 88% round trip, best schedule found exactly, on OMIE\'s hourly Spanish prices.',
                         '每日一次循环、先充后放、往返效率88%、精确求解最优调度，基于OMIE西班牙小时电价。'] },
      { t: 'why', text: [
        'The mean price fell a quarter from 2023 to 2025 and the four-hour value rose 45%. That is the solar effect: the more midday supply, the deeper the trough a battery charges in.',
        '2023至2025年均价下降四分之一，而四小时价值上升45%。这正是光伏效应：午间供应越多，储能充电的低谷越深。',
      ], sig: [['Falling price, rising spread', '电价降、价差升']] },
      { t: 'src', src: SRC.omiePrices, use: ['Prices and values by year', '各年电价与价值'] },
    ] },
  ] });

  // ---------------- Trading -------------------------------------------------
  SEC_B.energy = () => ({ head: ['Day-ahead trading — the line that carries the case', '日前交易 — 承担全部逻辑的收入'], blocks: [
    { t: 'card', mt: false, title: ['The trading line, derived', '交易收入的推导'], badges: ['official', 'calc'], live: false, blocks: [
      { t: 'table', head: [['Step', '步骤'], ['Arithmetic', '计算'], ['Result', '结果']], num: [2], rows: [
        [{ b: ['4 h value, 2025', '4小时价值（2025）'] }, ['Mean of 363 days, OMIE hourly prices', 'OMIE小时电价363天均值'], '€' + T.v4PerDay2025 + '/MW-day'],
        [{ b: ['Annual', '年度'] }, [T.v4PerDay2025 + ' × 365', T.v4PerDay2025 + ' × 365'], fmtC(Math.round(T.v4PerDay2025 * 365))],
        [{ b: ['Fleet path to 2028', '至2028年机组路径'] }, ['1 − 0.243 × (1 − e^(−x/0.324)), x = 3.44 GW ÷ ' + F.loadGW.toFixed(1) + ' GW', '1 − 0.243 × (1 − e^(−x/0.324))，x = 3.44GW ÷ ' + F.loadGW.toFixed(1) + 'GW'], f2028.toFixed(3)],
        [{ b: ['Trading line, year 1', '第1年交易收入'] }, ['annual × path', '年度 × 路径'], fmtC(E.merchGross)],
      ] },
      { t: 'why', text: [
        'This is the definition the platform reads Romania and Poland on, so Spain sits beside them on one basis. Run on SMARD\'s German prices the same code gives €' + T.deCheck.v2 + 'k and €' + T.deCheck.v4 + 'k against the published €' + T.deCheck.published2 + 'k and €' + T.deCheck.published4 + 'k.',
        '本平台对罗马尼亚与波兰采用同一定义，因此西班牙与之处于同一口径。以同一代码运行SMARD德国电价，得到€' + T.deCheck.v2 + 'k与€' + T.deCheck.v4 + 'k，对比已公布的€' + T.deCheck.published2 + 'k与€' + T.deCheck.published4 + 'k。',
      ], sig: [['Fair: path fitted elsewhere', '证据中等：路径在他处拟合']] },
      { t: 'src', src: SRC.omiePrices, use: ['The 2025 value', '2025年价值'] },
      { t: 'src', src: SRC.reeSystem2025, use: ['Average load', '平均负荷'] },
    ] },
    { t: 'card', title: ['The fleet path', '机组路径'], badges: ['official', 'calc'], live: false, blocks: [
      { t: 'table', head: [['Year', '年份'], ['Fleet, GW', '机组（GW）'], ['Factor', '系数']], num: [1, 2], rows:
        F.years.map(r => [r.y, r.gw.toFixed(2), r.f.toFixed(3)]) },
      { t: 'why', text: [
        'Dated from REE\'s counts and the grant awards: 96 MW at the end of 2025, 193 MW in April 2026, PINALM\'s 2.2 GW built by 2029 and the merchant pipeline on top. A slow build (1.8 GW by 2028) loses 4%; a fast one (5 GW) 10%.',
        '依据REE统计与补贴授予确定：2025年底96MW，2026年4月193MW，PINALM的2.2GW于2029年前建成，另加市场化项目。慢速建设（2028年1.8GW）损失4%；快速建设（5GW）损失10%。',
      ] },
      { t: 'src', src: SRC.reeBatteries, use: ['Installed batteries', '已装电池'] },
      { t: 'src', src: SRC.pinalm, use: ['The grant cohort', '受资助机组'] },
    ] },
    { t: 'card', title: ['2026 so far', '2026年至今'], badges: ['calc'], live: false, blocks: [
      { t: 'kpis', items: [
        ...T.autumn2026.map(m => ({ l: m.m, v: '€' + m.v4 + '<small>/MW-day</small>', d: ['mean price €' + m.mean + '/MWh', '均价€' + m.mean + '/MWh'], b: ['calc'] })),
      ] },
      { t: 'why', text: [
        'The 2026 rate is the band\'s ceiling, not the seed: the merchant-lines rule seeds on the last full year, and an autumn spike that lifts every European market is not a Spanish structural change.',
        '2026年水平作为区间上限而非种子值：市场化收入规则以最近一个完整年度为种子，而推高所有欧洲市场的秋季价格飙升并非西班牙的结构性变化。',
      ] },
    ] },
  ] });

  // ---------------- Capacity market -----------------------------------------
  SEC_B.capacity = () => ({ head: ['The capacity market — law, not yet revenue', '容量市场 — 已立法，尚无收入'], blocks: [
    { t: 'card', mt: false, title: ['What Order TED/966/2026 says', 'TED/966/2026号令的规定'], badges: ['official'], live: false, blocks: [
      { t: 'table', head: [['Term', '条款'], ['What the order says', '法令规定'], ['Article', '条款号']], rows: [
        [{ b: ['Auctions', '拍卖'] }, ['Main (delivery within 5 years), adjustment (12 months), and one-year transitional auctions until the first main delivery', '主拍卖（5年内开始交付）、调整拍卖（12个月），以及在首个主交付期前每年一次的过渡拍卖'], 'art. 7'],
        [{ b: ['New storage', '新建储能'] }, ['Half the reference technology\'s useful life, never more than 15 years', '参考技术使用寿命的一半，最长不超过15年'], 'art. 7.1.a'],
        [{ b: ['Firm capacity', '可靠容量'] }, ['Installed MW × a coefficient from 0 to 1, set in each call on CNMC\'s proposal', '装机容量×0至1的系数，由每次公告依CNMC建议设定'], 'art. 3.f, 10'],
        [{ b: ['Price', '价格'] }, ['Pay-as-bid; the curve\'s cap is a fixed €/MW-firm-year and may be confidential', '按报价支付；需求曲线上限为固定的每MW可靠容量年价格，可保密'], 'art. 15'],
        [{ b: ['Indexation', '指数化'] }, ['None: the award "no serán objeto de actualización"', '无：授标价格"不予调整"'], 'art. 15.2'],
        [{ b: ['Obligation', '义务'] }, ['Availability in stress hours, at most ' + C.stressShareMax + '% of the year; penalty × ' + C.penaltyK, '压力时段可用，最多占全年' + C.stressShareMax + '%；罚则× ' + C.penaltyK], 'art. 22, 27'],
        [{ b: ['Stacking', '叠加'] }, ['Public aid fully reflected in the bid; no specific balancing product paid for the same MW', '公共资助须全额体现在报价中；同一容量不得另获特定平衡产品付费'], 'art. 11'],
      ] },
      { t: 'why', text: [
        'No euro figure appears anywhere in the order. Until a call publishes a demand curve and battery firmness, any capacity line would be invented, so the market enters on merchant revenue and the first auction is a dated trigger.',
        '法令中未出现任何欧元金额。在公告公布需求曲线与电池可靠性系数之前，任何容量收入都属虚构，因此本市场以市场化收入登记，首次拍卖作为有日期的触发条件。',
      ], sig: [['No price yet', '尚无价格']] },
      { t: 'src', src: SRC.capacityOrder, use: ['Every term above', '上述全部条款'] },
      { t: 'src', src: SRC.capacityApproval, use: ['The Commission\'s approval', '欧盟委员会批准'] },
      { t: 'src', src: SRC.capacityTiming, use: ['The first auction\'s timing', '首次拍卖时间'] },
    ] },
  ] });

  // ---------------- Balancing ------------------------------------------------
  SEC_B.services = () => ({ head: ['Balancing — not counted yet', '平衡服务 — 暂不计入'], blocks: [
    { t: 'card', badges: ['public'], live: false, blocks: [
      { t: 'p', text: [
        'REE buys aFRR band capacity daily and activates mFRR, and both pay batteries. Balancing costs hit a record after the April 2025 blackout. The band prices sit on REE\'s esios platform behind a free token that has not been provisioned (gate ES-3), so the line is zero.',
        'REE每日采购aFRR调频容量并调用mFRR，两者均向储能付费。2025年4月大停电后平衡服务成本创历史新高。调频容量价格位于REE的esios平台，需免费令牌，尚未申请（研究缺口ES-3），因此该项取零。',
      ] },
      { t: 'why', text: [
        'A third party\'s all-streams index put a two-hour Spanish battery at about €252k/MW a year in June 2026, against this dashboard\'s two-hour day-ahead rate of about €89k that month. Most of the gap is intraday and balancing — upside the line does not carry.',
        '第三方全收入指数显示2026年6月西班牙两小时储能约为每MW每年25.2万欧元，而本看板当月两小时日前水平约8.9万欧元。差额主要来自日内与平衡服务 — 本收入线未计入的上行空间。',
      ], sig: [['Upside, not modelled', '上行空间，不建模']] },
      { t: 'src', src: SRC.cleanHorizon, use: ['The all-streams index', '全收入指数'] },
      { t: 'src', src: SRC.balancingGap, use: ['Where the prices sit', '价格所在位置'] },
    ] },
  ] });

  // ---------------- Duration -------------------------------------------------
  SEC_B.duration = () => {
    const best = designBest('es');
    return { head: ['Duration — four hours, and why not eight', '储能时长 — 四小时，为何不是八小时'], blocks: [
      { t: 'card', badges: ['calc'], live: false, blocks: [
        ...(designLine('es') ? [{ t: 'reco', b: ['What to build: ', '建设建议：'], text: designLine('es') }] : []),
        { t: 'kpis', items: [
          { l: ['Engine\'s best design', '引擎最佳设计'], v: best ? L(best.name) : '—', b: ['calc'] },
        ] },
        { t: 'table', head: [['Duration', '时长'], ['Value per MWh vs 4 h', '每MWh价值相对4小时']], num: [1], rows:
          T.capture.map(c => [c.h + ' h', c.c.toFixed(3)]) },
        { t: 'why', text: [
          'A day has one solar trough and one evening peak. Six hours still earns 80% per MWh of what four does; eight earns under half, because the extra hours charge at prices that are no longer low and sell at prices that are no longer high.',
          '一天只有一个光伏低谷和一个晚高峰。六小时每MWh仍可得四小时的80%；八小时不足一半，因为多出的时段充电电价已不低、放电电价已不高。',
        ], sig: [['One trough, one peak', '一个低谷，一个高峰']] },
        { t: 'src', src: SRC.omiePrices, use: ['Value by duration, 2023–2025', '各时长价值（2023–2025）'] },
      ] },
    ] };
  };

  // ---------------- Pipeline -------------------------------------------------
  SEC_B.pipeline = () => ({ head: ['Project pipeline — grants and permits', '项目管线 — 补贴与许可'], blocks: [
    { t: 'card', mt: false, title: ['PINALM, the grant cohort', 'PINALM受资助机组'], badges: ['official'], live: false, blocks: [
      { t: 'kpis', items: [
        { l: ['Aid', '资助'], v: '€' + G.aidM + '<small>m</small>', b: ['official'] },
        { l: ['Projects', '项目'], v: String(G.projects), d: [G.hybrid + ' hybrid, ' + G.standalone + ' standalone batteries', G.hybrid + '个混合、' + G.standalone + '个独立电池'], b: ['official'] },
        { l: ['Storage', '储能'], v: G.gw + ' GW / ' + G.gwh + ' GWh', d: ['built by ' + G.deadline, G.deadline + '前建成'], b: ['official'] },
      ] },
      { t: 'why', text: [
        'Round 1 is closed and the aid per project is not yet read, so a grant reaches a new investor only by buying an awarded project (gate ES-5). The cohort is also the largest dated piece of the fleet path.',
        '第一轮已结束且各项目资助额尚未读取，因此新投资者只能通过收购获资助项目获得补贴（研究缺口ES-5）。该批机组也是机组路径中最大的有日期部分。',
      ] },
      { t: 'src', src: SRC.pinalm, use: ['The award', '资助结果'] },
    ] },
    { t: 'card', title: ['Permits', '许可'], badges: ['public'], live: false, blocks: [
      { t: 'p', text: [
        F.q2ApprovedGW + ' GW of battery projects were approved in the second quarter of 2026 alone, against 733 MW a year earlier, and ' + F.permittingGW + ' GW were in permitting at the end of 2025.',
        '仅2026年二季度即有' + F.q2ApprovedGW + 'GW电池项目获批，上年同期为733MW；2025年底审批中的项目达' + F.permittingGW + 'GW。',
      ] },
      { t: 'src', src: SRC.q2Approvals, use: ['Quarterly approvals', '季度审批'] },
    ] },
  ] });

  // ---------------- Grid -----------------------------------------------------
  SEC_B.grid = () => ({ head: ['Grid connection — access is the queue', '并网 — 接入即排队'], blocks: [
    { t: 'card', mt: false, title: ['Interactive Spain storage map', '西班牙储能交互地图'], badges: ['official', 'public'], blocks: [
      { t: 'geo-grid-map', data: gridMapById('es-grid-map') },
    ] },
    { t: 'congestion', data: congestionFor('es') },
    { t: 'card', title: ['The transmission system', '输电系统'], badges: ['official'], live: false, blocks: [
      { t: 'p', text: [
        'Red Eléctrica owns and operates the transmission grid, about 22,000 km at 400 kV and 20,200 km at 220 kV. An access application for storage that exports posts a guarantee of €' + M.guaranteePerKW + '/kW, returned at operation.',
        'Red Eléctrica拥有并运营输电网，400kV约22,000公里、220kV约20,200公里。可向电网送电的储能提交接入申请须缴每kW €' + M.guaranteePerKW + '担保，投运后退还。',
      ] },
      { t: 'src', src: SRC.transmission, use: ['The grid', '电网'] },
      { t: 'src', src: SRC.accessGuarantee, use: ['The access guarantee', '接入担保'] },
    ] },
  ] });

  // ---------------- Portfolio ------------------------------------------------
  SEC_B.portfolio = () => {
    const inp = labInputs(), r = labModel(inp);
    const dn = labModel(inp, { spreadFactor: 0.6 });
    const line = designLine('es');
    return {
      head: ['Portfolio / Fund View — a four-hour merchant battery', '组合与基金视图 — 四小时市场化储能'],
      cap: ['The Investment Lab\'s screening case taken through the gates an investment committee applies. It runs the Lab\'s own model on the Lab\'s inputs.',
            '投资测算筛选情景，按投委会适用的门槛顺序逐项演示。该情景以投资测算自身的模型与输入运行。'],
      blocks: [
        { t: 'card', mt: false, title: ['Screened opportunity — institutional screening snapshot', '所筛选机会 — 机构筛选快照'], badges: ['model'], live: false, blocks: [
          { t: 'kpis', items: [
            { l: ['Configuration', '配置'], v: fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d: [inp.hours + '-hour, merchant', inp.hours + '小时，市场化'] },
            { l: ['Target COD', '目标投运'], v: state.codYear, d: ['dilution factor ' + fmtPct(dilutionAt(+state.codYear) * 100, 0), '稀释系数' + fmtPct(dilutionAt(+state.codYear) * 100, 0)] },
            { l: ['Total capex', '总资本开支'], v: fmtCM(r.capex), b: ['model'] },
            { l: ['Year-1 trading', '第1年交易收入'], v: fmtCM(r.arb1), b: ['calc'] },
            { l: ['Year-1 EBITDA', '第1年EBITDA'], v: fmtCM(r.ebitda1), d: ['unlevered IRR ' + fmtIRR(r.unlevIRR), '无杠杆IRR ' + fmtIRR(r.unlevIRR)], b: ['calc'] },
            { l: ['Min DSCR — trading −40%', '最低偿债覆盖率 — 交易−40%'], v: fmtX(dn.minDSCR), cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b: ['calc'] },
          ] },
          ...(line ? [{ t: 'note', text: ['The shortlist uses the engine, not this Lab case. ' + line[0], '候选清单采用引擎而非本测算情景。' + line[1]] }] : []),
          { t: 'ic', b: ['Screening conclusion: ', '筛选结论：'], text: [
            'A Spanish decision turns on a connection at a node with capacity, a view on how much intraday and balancing add to perfect-foresight day-ahead value, and whether the first capacity auction pays enough to bid. With all-merchant revenue, lenders size at 2.0x cover.',
            '西班牙的投资决策取决于有容量节点的并网、对日内与平衡服务在完全预见日前价值之上增加多少的判断，以及首次容量拍卖是否值得参与。全部为市场化收入时，贷款人按2.0倍覆盖率测算。',
          ] },
        ] },
        { t: 'card', title: ['Investment Committee gates — what must be true before capital is released', '投委会门槛 — 资金拨付前必须成立的条件'], badges: ['calc'], live: false, blocks: [
          { t: 'gates', items: [
            { n: ['Gate 1 — A connection right', '门槛1 — 并网权'], d: ['Access and connection granted at a node with capacity; the €40/kW guarantee posted.', '在有容量的节点获得接入与并网许可；已提交每kW €40担保。'], c: 'critical', s: ['The queue', '排队'] },
            { n: ['Gate 2 — The fleet path', '门槛2 — 机组路径'], d: ['REE\'s counts tracking the path; a fast build costs 10% by 2028.', 'REE统计与路径相符；快速建设到2028年损失10%。'], c: 'serious', s: ['Gate ES-2', '研究缺口ES-2'] },
            { n: ['Gate 3 — Balancing evidence', '门槛3 — 平衡服务证据'], d: ['aFRR band and mFRR prices read from REE before the case leans on them.', '在依赖平衡服务前从REE读取aFRR调频容量与mFRR价格。'], c: 'warn', s: ['Gate ES-3', '研究缺口ES-3'] },
            { n: ['Gate 4 — The first capacity auction', '门槛4 — 首次容量拍卖'], d: ['Battery firmness and a cleared price, entered nominal.', '电池可靠性系数与出清价格，按名义值计入。'], c: 'good', s: ['Upside', '上行空间'] },
          ] },
        ] },
      ] };
  };

  // ---------------- Data & methodology ---------------------------------------
  SEC_B.data = () => ({ head: ['Data and methodology', '数据与方法'], blocks: [
    { t: 'card', mt: false, title: ['Open gates', '待关闭的研究缺口'], badges: ['official'], live: false, blocks: [
      { t: 'table', head: ['Gate', 'What it decides', 'What closes it'], rows: [
        [{ b: ['ES-1', 'ES-1'] }, ['A capacity line', '容量收入'], ['The first auction\'s call and results', '首次拍卖公告与结果']],
        [{ b: ['ES-2', 'ES-2'] }, ['The fleet path', '机组路径'], ['REE\'s quarterly installed-battery counts', 'REE季度已装电池统计']],
        [{ b: ['ES-3', 'ES-3'] }, ['A balancing line', '平衡服务收入'], ['REE esios band and mFRR prices', 'REE esios调频容量与mFRR价格']],
        [{ b: ['ES-4', 'ES-4'] }, ['Opex and access tolls', '运维与接入费'], ['A Spanish operating benchmark', '西班牙本地运维基准']],
        [{ b: ['ES-5', 'ES-5'] }, ['A grant play', '补贴方案'], ['PINALM aid per project from IDAE', 'IDAE公布的PINALM各项目资助额']],
        [{ b: ['ES-6', 'ES-6'] }, ['An Iberian basis', '伊比利亚口径'], ['Portugal\'s load and fleet in the path', '路径纳入葡萄牙负荷与机组']],
        [{ b: ['ES-7', 'ES-7'] }, ['Where a project can connect', '项目可并网位置'], ['REE\'s nodal access capacity', 'REE节点接入容量']],
      ] },
    ] },
    { t: 'card', title: ['Core formulas', '核心公式'], badges: ['calc'], live: false, blocks: [
      { t: 'table', head: [['Quantity', '指标'], ['Formula', '公式']], rows: [
        [{ b: ['Day-ahead value', '日前价值'] }, 'max over split s of Σ top-4 after s − Σ bottom-4 before s ÷ 0.88, mean of days × 365'],
        [{ b: ['Trading line', '交易收入'] }, '304.89 × 365 × ' + f2028.toFixed(3) + ' = ' + fmtC(E.merchGross) + '/MW/yr'],
        [{ b: ['Capex', '资本开支'] }, '220 × 4,000 = ' + fmtC(E.capexPerMW) + '/MW'],
        [{ b: ['Reproduce', '复现'] }, 'node scripts/derive/spain-registration.mjs <cacheDir> --fetch'],
      ] },
      { t: 'src', src: SRC.omieTerms, use: ['Reuse terms', '使用条款'] },
      { t: 'src', src: SRC.ivpee, use: ['The generation tax, 0% from 2028', '发电税，2028年起为0%'] },
    ] },
    { t: 'card', title: ['Bilingual glossary', '双语术语表'], badges: ['calc'], live: false, blocks: [
      { t: 'glossary' },
    ] },
  ] });

  return SECTIONS;
}
