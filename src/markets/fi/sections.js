/* ---------------------------------------------------------------------------
   Finland — declarative section specs.

   One entry per tab, drawn by the shared block engine. Nothing is imported
   directly and no rendering happens here, which is what keeps this market
   interchangeable with the others in the lineage.

   REVISED 2026-10-17. Finland is priced in the engine now: reserves at what
   Fingrid's 2026 annual market paid across the fleet, the negotiated optimiser
   floor as a floor, and the supplier-quoted DC block in its capex. So the
   dashboard carries what the others carry — signal cards, the timeline, the
   design answer, the grid map and congestion register, the transactions, the
   Investment Lab and the committee gates — and the saturation argument it was
   built around is still here, now stated as the reason the reserve line is low
   rather than the reason it is blank.

   Tabs are the standard ten so a reader moving between markets finds the same
   structure. What differs is what fills them.
   --------------------------------------------------------------------------- */

import { FI_BUILD_PATHWAY } from './buildPathway.js';
import { comparison } from './comparison.js';
import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';
import { designLine, designBest, routeFit } from '../_shared/designAnswer.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { L, M, SRC, state, fmtN, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, dilutionAt, labInputs, labModel } = api;
  const E = comparison.economics;

  const SEC_B = {};
  function SECTIONS(){
    const o = {};
    Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
    return o;
  }

  const kMW = (v) => fmtCk(v) + '<small>/MW/yr</small>';
  const fastRows = () => M.reserves.obligation2026
    .filter(r => r.fast)
    .map(r => [{ b: r.product }, r.mw, r.role]);
  const slowRows = () => M.reserves.obligation2026
    .filter(r => !r.fast)
    .map(r => [{ b: r.product }, r.mw, r.role]);

  /* The year-1 revenue stack, from the comparison economics the engine reads. */
  const merchNet = E.merchGross * (1 - E.feePct / 100);
  const expected = merchNet + E.services;
  const securedShare = E.toll / expected;

  // ---------------- Overview -----------------------------------------------
  SEC_B.home = () => ({ head: ['Finland at a glance', '芬兰概览'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'band-story', b: ['Core storyline', '核心叙事'], text: [
        'Finland solved adequacy with nuclear and then created volatility with wind, so it pays batteries for flexibility rather than firm capacity. The reserve markets that paid for the first wave are saturated — connected storage now exceeds the fast-reserve need and FCR-N’s annual auction cleared at zero — so a new battery earns mostly from trading, and the secured part of its revenue is a floor an optimiser signs, not a contract the state offers.',
        '芬兰以核电解决充裕度、又以风电制造波动性，因此为储能的灵活性付费，而非为确定性容量付费。曾支撑首批项目的备用市场已经饱和 — 并网储能已超过快速备用需求，FCR-N年度拍卖以零出清 — 因此新建储能的收入主要来自交易，而其锁定部分是优化商签署的保底，而非国家提供的合同。',
      ] },
      { t: 'kpis', items: [
        { l: ['Merchant revenue, 2h', '市场化收入（2小时）'], v: kMW(E.merchGross), d: ['before a ' + E.feePct + '% optimiser fee', '扣除' + E.feePct + '%优化商费用前'], b: ['model'] },
        { l: ['Reserve revenue', '备用收入'], v: kMW(E.services), d: ['2026 annual FCR-D, shared across the fleet', '2026年度FCR-D出清按全部储能分摊'], b: ['official'] },
        { l: ['Negotiated floor', '协商保底'], v: kMW(E.toll), d: [fmtPct(securedShare * 100, 0) + ' of expected revenue for ' + E.tollYears + ' years', '为预期收入的' + fmtPct(securedShare * 100, 0) + '，为期' + E.tollYears + '年'], b: ['project'] },
        { l: ['Fast-reserve need vs storage', '快速备用需求与储能规模'], v: fmtN(M.reserves.fastTotalMW) + ' / ' + fmtN(M.fleet.connectedMW) + '<small> MW</small>', d: ['need / connected, Feb 2026', '需求/已并网，2026年2月'], cls: 'warn', b: ['official'] },
        { l: ['Southern connections', '南部并网'], v: 'closed', d: ['until ' + M.connection.restrictedUntil, '至' + M.connection.restrictedUntil + '年'], b: ['official'] },
        { l: ['Resource adequacy revenue', '容量充裕度收入'], v: '—', d: ['mechanism dormant since ' + M.adequacy.dormantSince, '机制自' + M.adequacy.dormantSince + '起休眠'], b: ['official'] },
      ] },
      { t: 'warn', text: M.seedWarn },
      { t: 'walk', items: [
        ['01', ['Overview', '总览'], ['What is the house view today?', '当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution', '市场演进'], ['Why did batteries arrive — and what did they do to reserve prices?', '储能为何涌入？它们对备用价格造成了什么影响？'], 'story'],
        ['03', ['Revenue stack', '收入结构'], ['What is left once reserves saturate, and what does a floor secure?', '备用饱和后还剩什么？保底能锁定什么？'], 'services'],
        ['04', ['Asset design', '资产设计'], ['Two hours or four, now that trading carries the case?', '交易成为主要收入后，两小时还是四小时？'], 'duration'],
        ['05', ['Underwriting', '项目承销'], ['Can the project connect, and who will finance and buy it?', '项目能否并网？谁会融资和收购？'], 'grid'],
        ['06', ['Portfolio application', '组合应用'], ['Does the screened case clear the committee gates?', '筛选方案能否通过投委会门槛？'], 'portfolio'],
      ] },
      { t: 'why', text: [
        'The order matters more here than anywhere: the second question already answers most of the third. A Finnish battery is priced on trading plus whatever reserves are left, with a negotiated floor under half of it, and the binding constraint after that is not revenue but a connection — southern Finland is closed to new storage until 2029.',
        '在芬兰，问题的顺序尤为重要：第二个问题已回答了第三个问题的大部分。芬兰储能按交易收入加剩余备用收入定价，其中一半由协商保底托底；此后的约束不在收入，而在并网 — 芬兰南部在2029年前不再接受新增储能并网。',
      ], sig: [['Trading carries the case', '交易支撑投资逻辑'], ['A floor, not a contract', '保底而非合同'], ['Connection is the constraint', '并网才是约束']] },
      { t: 'src', src: SRC.reserveObligations, use: ['Reserve obligations and the procurement forecast', '备用需求及采购预测'] },
    ] },
    { t: 'g2', cards: [
      { title: ['Card A — Reserve Markets Signal', 'Card A — 备用市场信号'], live: false, blocks: [
        { t: 'chip', cls: 'critical', text: ['Saturated — FCR-N annual cleared at zero for 2026', '已饱和 — 2026年度FCR-N以零出清'] },
        { t: 'kpis', items: [
          { l: ['FCR-D up, annual 2026', '2026年度FCR-D上调'], v: '€3.50<small>/MW,h</small>', d: ['237 MW procured', '采购237MW'], b: ['official'] },
          { l: ['FCR-D down, annual 2026', '2026年度FCR-D下调'], v: '€6.00<small>/MW,h</small>', d: ['163 MW procured', '采购163MW'], b: ['official'] },
          { l: ['FCR-N reservation price', 'FCR-N预留价'], v: '€46 → €19<small>/MW,h</small>', d: ['2024 → June 2025', '2024年 → 2025年6月'], cls: 'down', b: ['tp'] },
        ] },
        { t: 'why', text: [
          'Reserves paid for the first wave and will not pay for the next. Spread across the 1,050 MW connected, the 2026 annual market is worth about ' + fmtCk(E.services) + ' per MW a year — a fifth of what trading earns. The hourly markets add something on top for a well-optimised asset, and it is cannibalised first.',
          '备用收入支撑了首批项目，但不会支撑下一批。2026年度市场按1,050MW并网储能分摊，每MW每年约' + fmtCk(E.services) + ' — 仅为交易收入的五分之一。小时级市场可为优化良好的资产带来额外收入，但也最先被同质化竞争侵蚀。',
        ], sig: [['A fifth of trading', '仅为交易收入的五分之一']] },
      ] },
      { title: ['Card B — Wholesale & Intraday Signal', 'Card B — 批发与日内信号'], live: false, blocks: [
        { t: 'chip', cls: 'good', text: ['The revenue that carries the case — wind-driven and 15-minute', '支撑投资逻辑的收入 — 风电驱动、15分钟结算'] },
        { t: 'kpis', items: [
          { l: ['Wind, end 2025', '2025年底风电装机'], v: fmtN(M.wind.mwEnd2025) + '<small> MW</small>', d: ['+' + fmtN(M.wind.addedMW2025) + ' MW in 2025', '2025年新增' + fmtN(M.wind.addedMW2025) + 'MW'], b: ['tp'] },
          { l: ['Observed floor', '已观测最低价'], v: fmtN(M.wholesale.observedFloorEurMWh) + '<small> €/MWh</small>', d: [M.wholesale.observedFloorYear, M.wholesale.observedFloorYear + '年'], b: ['official'] },
          { l: ['Market time unit', '结算周期'], v: M.wholesale.mtuMinutes + '<small> min</small>', d: ['from ' + M.wholesale.mtuChangedOn, '自' + M.wholesale.mtuChangedOn + '起'], b: ['official'] },
        ] },
        { t: 'why', text: [
          'Finland’s volatility comes from wind, 76% of it in Ostrobothnia, against inflexible nuclear — the combination that produces deep negative hours and sharp evening peaks. One bidding zone means no locational basis risk, so the merchant case is purely about time, and fifteen-minute settlement pays a fast battery for exactly that.',
          '芬兰的波动性来自风电（76%位于博滕区）与缺乏灵活性的核电 — 这一组合造成深度负电价时段与陡峭的晚高峰。单一报价区意味着无地域基差风险，市场化逻辑完全取决于时间维度，而15分钟结算恰好为快速储能的这一能力付费。',
        ], sig: [['Wind against nuclear', '风电对核电']] },
      ] },
      { title: ['Card C — Secured Revenue Signal', 'Card C — 锁定收入信号'], live: false, blocks: [
        { t: 'chip', cls: 'warn', text: ['A negotiated floor, project by project', '逐个项目协商的保底'] },
        { t: 'kpis', items: [
          { l: ['Floor level', '保底水平'], v: kMW(E.toll), d: ['half of expected year-1 revenue', '第1年预期收入的一半'], b: ['project'] },
          { l: ['Floor tenor', '保底期限'], v: E.tollYears + '<small> yr</small>', d: ['seven years or more are signed', '已签保底期限为七年或以上'], b: ['project'] },
          { l: ['Secured share, year 1', '第1年锁定比例'], v: fmtPct(securedShare * 100, 0), d: ['the floor at its own level', '按保底自身水平计'], b: ['calc'] },
        ] },
        { t: 'why', text: [
          'No capacity contract exists in Finland, and the dormant peak-load reserve is held outside the market. What secures revenue is a floor from an optimiser or offtaker: the owner keeps everything above it, and lenders size the secured tranche on it. The Statkraft–OX2 seven-year optimisation agreement is the public precedent.',
          '芬兰不存在容量合同，休眠的峰荷备用也置于市场之外。锁定收入来自优化商或购电方的保底：超出部分归业主，贷款人据此测算锁定部分的债务规模。Statkraft与OX2的七年期优化协议是公开先例。',
        ], sig: [['Lenders size on the floor', '贷款人按保底测算']] },
      ] },
      { title: ['Card D — Connection Signal', 'Card D — 并网信号'], live: false, blocks: [
        { t: 'chip', cls: 'serious', text: ['South closed until ' + M.connection.restrictedUntil + '; north open', '南部关闭至' + M.connection.restrictedUntil + '年；北部开放'] },
        { t: 'kpis', items: [
          { l: ['Connection requests', '并网申请'], v: '>' + fmtN(M.connection.requestsMW) + '<small> MW</small>', b: ['official'] },
          { l: ['Already contracted', '已签约'], v: '~' + fmtN(M.connection.contractedMW) + '<small> MW</small>', b: ['official'] },
          { l: ['Fixed connection fee, 110 kV', '110kV固定并网费'], v: '€1.0<small>m</small>', d: ['about 5% of a 50 MW project', '约占50MW项目投资的5%'], b: ['official'] },
        ] },
        { t: 'why', text: [
          'A southern connection is the scarce asset until the Hikiä–Toivila reinforcement completes, and the restriction has already been extended once, from 2027. Because Finland is one price area, a northern site gives up no modelled revenue — the cost of going north is distance to load, not price.',
          '在Hikiä–Toivila加强工程完工前，南部并网容量是稀缺资产，且该限制已由2027年延长一次。由于芬兰为单一报价区，北部选址不会损失模型收入 — 北上的代价是远离负荷，而非电价。',
        ], sig: [['Extended once already', '已延期一次']] },
      ] },
    ] },
  ] });

  // ---------------- Market story -------------------------------------------
  SEC_B.story = () => ({ head: ['How Finland got here — from a reserve boom to a trading market', '芬兰市场的演进 — 从备用收入高峰到交易主导'], blocks: [
    { t: 'card', mt: false, title: ['How the system got here', '系统如何演变至此'], badges: ['official'], blocks: [
      { t: 'timeline', items: M.timeline },
    ] },
    { t: 'card', title: ['What the reserve boom did to reserve prices', '备用收入高峰对备用价格的影响'], badges: ['tp'], blocks: [
      { t: 'bar', cfg: { xs: M.fcrnPrice.map(p => p.y), bw: 40, labels: true, h: 230, yfmt: v => '€' + fmtN(v),
        series: [{ name: ['FCR-N reservation price, €/MW,h', 'FCR-N预留价（€/MW,h）'], color: 'var(--s3)', vals: M.fcrnPrice.map(p => p.v) }] } },
      { t: 'cap', text: ['FCR-N reservation price: 2023, 2024 and June 2025 averages from Clean Horizon; the 2026 annual auction cleared at zero (Fingrid).',
                         'FCR-N预留价：2023、2024年及2025年6月均值来自Clean Horizon；2026年度拍卖以零出清（Fingrid）。'] },
      { t: 'table', head: [['Clean Horizon index, Finland', 'Clean Horizon指数（芬兰）'], ['When', '时间'], ['All-market revenue', '全市场收入']], num: [2], rows: [
        [{ b: ['One hour, peak', '1小时，高峰'] }, M.index.peak.when, kMW(M.index.peak.h1)],
        [{ b: ['Two hours', '2小时'] }, M.index.mid2025.when, kMW(M.index.mid2025.h2)],
        [{ b: ['One hour', '1小时'] }, M.index.aug2026.when, kMW(M.index.aug2026.h1)],
        [{ b: ['Two hours', '2小时'] }, M.index.aug2026.when, kMW(M.index.aug2026.h2)],
        [{ b: ['Four hours', '4小时'] }, M.index.aug2026.when, kMW(M.index.aug2026.h4)],
      ] },
      { t: 'why', text: [
        'A one-hour battery earned about €645k/MW a year at the September 2023 peak and about €50k by August 2026 — a fall of more than nine-tenths in three years, almost all of it in reserves. That is what the 30,000 MW of connection requests were chasing, and what the batteries already connected competed away. The platform’s two-hour case — ' + fmtCk(E.merchGross) + ' trading plus ' + fmtCk(E.services) + ' reserves before fees — sits about a fifth above Clean Horizon’s August two-hour figure of ' + fmtCk(M.index.aug2026.h2) + '.',
        '1小时储能在2023年9月高峰时年收入约为每MW 64.5万欧元，至2026年8月降至约5万欧元 — 三年内下降逾九成，几乎全部来自备用。这正是30,000MW并网申请所追逐的收益，也是已并网储能通过竞争消解掉的收益。本平台的两小时情景 — 扣费前交易收入' + fmtCk(E.merchGross) + '加备用收入' + fmtCk(E.services) + ' — 比Clean Horizon 8月两小时指数' + fmtCk(M.index.aug2026.h2) + '高出约五分之一。',
      ], sig: [['Nine-tenths gone in three years', '三年下降逾九成'], ['The platform sits above the index', '本平台高于指数']] },
      { t: 'src', src: SRC.storageIndex, use: ['All-market revenue by duration, August 2026 and the 2023 peak', '按时长的全市场收入：2026年8月及2023年高峰'] },
      { t: 'src', src: SRC.storageIndex2025, use: ['FCR-N reservation prices 2023 to June 2025', '2023年至2025年6月FCR-N预留价'] },
    ] },
    { t: 'card', title: ['Why adequacy stopped being the question', '充裕度为何不再是问题'], badges: ['official'], blocks: [
      { t: 'p', text: [
        'Olkiluoto 3 entered service and the adequacy problem went away — the strategic reserve has held nothing since July 2022. Wind became the swing producer: ' + fmtN(M.wind.mwEnd2025) + ' MW at the end of 2025, ' + M.wind.ostrobothniaSharePct + '% of it in Ostrobothnia. Then, on 1 October 2025, day-ahead settlement moved to a 15-minute market time unit, shortening the cycle a battery is paid for.',
        'Olkiluoto 3投运后充裕度问题消失 — 战略备用自2022年7月起未持有任何容量。风电成为边际调节电源：2025年底装机' + fmtN(M.wind.mwEnd2025) + 'MW，其中' + M.wind.ostrobothniaSharePct + '%位于博滕区。随后，日前市场结算于2025年10月1日转为15分钟周期，缩短了储能的获利周期。',
      ] },
      { t: 'why', text: [
        'The order matters. Adequacy stopped being the question before volatility became one, which is why Finland has a dormant capacity mechanism and a live reserve market rather than the reverse. A market that solved adequacy with nuclear and then created volatility with wind pays for flexibility, not for firm capacity.',
        '顺序很重要。充裕度问题的消失早于波动性问题的出现，这正是芬兰容量机制休眠而备用市场活跃（而非相反）的原因。一个以核电解决充裕度、又以风电制造波动性的市场，为灵活性付费，而非为确定性容量付费。',
      ] },
      { t: 'src', src: SRC.adequacyStandard, use: ['Reliability standard and the adequacy position', '可靠性标准与充裕度状况'] },
      { t: 'src', src: SRC.windStats, use: ['Wind capacity, additions and location, 2025', '2025年风电装机、新增与分布'] },
    ] },
  ] });

  // ---------------- Capacity & adequacy ------------------------------------
  SEC_B.capacity = () => ({ head: ['A capacity mechanism that procures nothing', '一个未采购任何容量的容量机制'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'kpis', items: [
        { l: ['Procured, 2025–26 period', '2025-26年度采购量'], v: '0<small> MW</small>' },
        { l: ['Dormant since', '休眠起始'], v: M.adequacy.dormantSince },
        { l: ['Reliability standard', '可靠性标准'], v: M.adequacy.loleStandardHours + '<small> h/yr LOLE</small>' },
      ] },
      { t: 'p', text: [
        'Finland has a statutory peak load capacity system under act 117/2011, administered by Finextra. The Energy Authority procured no capacity for 1 November 2025 to 31 October 2026, and nothing has been held since July 2022.',
        '芬兰依据117/2011号法案设有法定峰荷容量机制，由Finextra管理。能源局在2025年11月1日至2026年10月31日期间未采购任何容量，且自2022年7月起未持有任何容量。',
      ] },
      { t: 'why', text: [
        'This is why the platform records no resource adequacy revenue for Finland, and why the secured route is a negotiated floor instead. The mechanism exists and is idle because the system does not need it; it is also a strategic reserve, held outside the market, not an accreditation payment a merchant battery banks. Both facts would have to change before a capacity line appears here.',
        '这正是本平台未记录芬兰容量充裕度收入、而以协商保底作为锁定路径的原因。机制确实存在，只是因系统无需而闲置；它同时也是置于市场之外的战略备用，而非可供市场化储能获取的核定容量收入。只有这两点同时改变，本页才会出现容量收入项。',
      ], sig: [['Dormant, not absent', '休眠而非缺失'], ['Held outside the market', '置于市场之外']] },
      { t: 'src', src: SRC.peakLoadCapacity, use: ['The procurement decision for the current period', '当期采购决定'] },
    ] },
  ] });

  // ---------------- Wholesale ----------------------------------------------
  SEC_B.energy = () => ({ head: ['Wholesale and intraday — the revenue that carries the case', '批发与日内市场 — 支撑投资逻辑的收入'], blocks: [
    { t: 'card', badges: ['official'], live: true, blocks: [
      { t: 'kpis', items: [
        { l: ['Merchant revenue, 2h', '市场化收入（2小时）'], v: kMW(E.merchGross), d: ['before a ' + E.feePct + '% optimiser fee', '扣除' + E.feePct + '%优化商费用前'], b: ['model'] },
        { l: ['Bidding zone', '报价区'], v: '1', d: ['one price, whole country', '全国单一电价'] },
        { l: ['Market time unit', '结算周期'], v: M.wholesale.mtuMinutes + '<small> min</small>', d: ['from ' + M.wholesale.mtuChangedOn, '自' + M.wholesale.mtuChangedOn + '起'] },
        { l: ['Observed floor', '已观测最低价'], v: fmtN(M.wholesale.observedFloorEurMWh) + '<small> €/MWh</small>', d: [M.wholesale.observedFloorYear, M.wholesale.observedFloorYear + '年'] },
      ] },
      { t: 'why', text: [
        'One bidding zone is the single most important fact for siting: no locational basis risk, and no way to earn congestion either. The merchant case rests entirely on the time dimension, which is why the move to 15-minute settlement matters more here than it would in a zonal market — and why trading now carries four-fifths of a Finnish battery’s revenue.',
        '单一报价区是选址方面最重要的事实：既无地域基差风险，也无从获取拥塞收益。市场化收入逻辑完全依赖时间维度，这正是15分钟结算的转变在此比在分区市场更为重要的原因 — 也是交易如今占芬兰储能收入五分之四的原因。',
      ], sig: [['Time, not place', '时间而非地点']] },
      { t: 'src', src: SRC.dayAhead, use: ['Day-ahead price series for the Finnish bidding zone', '芬兰报价区日前电价序列'] },
      { t: 'src', src: SRC.marketStructure, use: ['Market time unit and the observed price record', '结算周期与已观测价格记录'] },
    ] },
  ] });

  // ---------------- Reserve markets ----------------------------------------
  SEC_B.services = () => ({ head: ['Reserve markets — saturated, and priced at what they still pay', '备用市场 — 已饱和，按仍在支付的水平计价'], blocks: [
    { t: 'card', mt: false, title: ['The reserve line, derived', '备用收入的推导'], badges: ['official', 'calc'], live: false, blocks: [
      { t: 'table', head: [['2026 annual market', '2026年度市场'], ['MW procured', '采购MW'], ['€/MW,h', '€/MW,h'], ['€ a year', '年金额（欧元）']], num: [1, 2, 3], rows: [
        [{ b: ['FCR-D up', 'FCR-D上调'] }, '237', '3.50', fmtN(Math.round(237 * 3.50 * 8760))],
        [{ b: ['FCR-D down', 'FCR-D下调'] }, '163', '6.00', fmtN(Math.round(163 * 6.00 * 8760))],
        [{ b: ['FCR-N', 'FCR-N'] }, '0', '0', '0'],
        [{ b: ['Spread across 1,050 MW connected', '按1,050MW并网储能分摊'] }, '', '', fmtC(E.services) + '/MW'],
      ] },
      { t: 'why', text: [
        'This is what an average connected megawatt can show from the one fixed-price market today: ' + fmtCk(E.services) + ' a year. It is a floor-level observation, not a forecast. The hourly markets — FCR-N, the rest of FCR-D, aFRR, mFRR and FFR — add something for a well-optimised battery and are not counted until their prices are tracked (gate FI-2). The Lab band runs from zero to ' + fmtCk(Math.round((3.50 + 6.00) * 8760)) + ', one megawatt holding both FCR-D products all year at the 2026 prices.',
        '这是当前唯一的固定价格市场中一个并网MW的平均可得收入：每年' + fmtCk(E.services) + '。它是保底水平的观测值，而非预测。小时级市场 — FCR-N、FCR-D其余部分、aFRR、mFRR与FFR — 可为优化良好的储能带来额外收入，在其价格纳入跟踪前不予计入（研究缺口FI-2）。投资测算区间为零至' + fmtCk(Math.round((3.50 + 6.00) * 8760)) + '，即1MW全年按2026年价格同时持有FCR-D两个品种。',
      ], sig: [['Observed, not forecast', '观测值而非预测'], ['Hourly upside not counted', '未计小时级上行']] },
      { t: 'src', src: SRC.fcrYearly2026, use: ['Yearly-market volumes and prices for delivery year 2026', '2026交付年度的年度市场容量与价格'] },
    ] },
    { t: 'card', title: ['What the system procures, and the fleet against it', '系统采购需求与对应储能规模'], badges: ['official', 'verify'], live: false, blocks: [
      { t: 'table',
        head: ['Product', 'MW, 2026', 'Role'],
        num: [1],
        rows: fastRows() },
      { t: 'cap', text: ['The fast products a battery competes for — about ' + fmtN(M.reserves.fastTotalMW) + ' MW of obligation in total.',
                         '储能参与竞争的快速品种 — 需求合计约' + fmtN(M.reserves.fastTotalMW) + 'MW。'] },
      { t: 'table',
        head: ['Product', 'MW, 2026', 'Role'],
        num: [1],
        rows: slowRows() },
      { t: 'cap', text: ['The slower products, where a battery competes with demand response and thermal plant on cost.',
                         '响应较慢的品种，储能在此与需求响应及火电机组进行成本竞争。'] },
      /* CORRECTED 2026-08-19 AGAINST THE SOURCE: both blocks grow; the slower
         one grows far faster. Kept from the first version of this tab. */
      { t: 'note', b: ['Both grow — the slower products grow far faster. ', '两类品种均增长 — 但较慢品种增速远高。'], text: [
        'On Fingrid’s 2026–2036 forecast, combined FFR, FCR-N and FCR-D procurement rises from about 734 MW to about 853 MW, roughly +16%, while combined aFRR and mFRR rises from about 960 MW to about 1,850 MW, roughly +93%. Fast-product procurement therefore increases rather than declines, and the weight of the growth sits in the slower products. This is Fingrid’s non-binding forecast of average procurement, updated annually; it is not the obligation table above, and the two are different measures that must not be differenced.',
        '根据Fingrid的2026–2036年预测，FFR、FCR-N与FCR-D合计采购量由约734MW升至约853MW，增幅约16%；而aFRR与mFRR合计采购量由约960MW升至约1,850MW，增幅约93%。因此快速品种的采购量是增长而非下降，只是增量主要集中于响应较慢的品种。此为Fingrid不具约束力的平均采购量预测，每年更新；它并非上方的需求表，二者口径不同，不得相减。',
      ] },
      { t: 'warn', text: [
        'Saturation is why the reserve line is low. Against about ' + fmtN(M.reserves.fastTotalMW) + ' MW of fast-reserve obligation, connected storage passed ' + fmtN(M.fleet.connectedMW) + ' MW in February 2026. The obligation is a sum across distinct products with their own prequalification and clearing, and the fleet counts all storage of 1 MW and above with ' + M.fleet.distributionSharePct + '% distribution-connected, so this is a warning rather than a measurement — but it points one way, and the annual FCR-N result confirms it.',
        '饱和正是备用收入偏低的原因。面对约' + fmtN(M.reserves.fastTotalMW) + 'MW的快速备用需求，已并网储能于2026年2月已超过' + fmtN(M.fleet.connectedMW) + 'MW。需求方为多个独立品种的合计，各有预审与出清；机组方涵盖1MW及以上所有储能类型，其中' + M.fleet.distributionSharePct + '%接入配电网，因此这是预警而非实测 — 但方向一致，而FCR-N年度结果已予以印证。',
      ] },
      { t: 'src', src: SRC.reserveForecast, use: ['The 2026–2036 requirement forecast, by product', '2026–2036年分品种需求预测'] },
      { t: 'src', src: SRC.storageFleet, use: ['Connected storage aggregate', '已并网储能汇总'] },
    ] },
  ] });

  // ---------------- Duration ------------------------------------------------
  SEC_B.duration = () => {
    const best = designBest('fi'), mer = routeFit('fi', 'mer'), floor = routeFit('fi', 'toll');
    return { head: ['Duration — what to build now that trading carries the case', '储能时长 — 交易主导后应建何种时长'], blocks: [
      { t: 'card', badges: ['calc'], live: false, blocks: [
        designLine('fi') ? { t: 'reco', b: ['What to build: ', '建设建议：'], text: designLine('fi') } : null,
        { t: 'kpis', items: [
          { l: ['Engine’s best design', '引擎最佳设计'], v: best ? L(best.name) : '—', b: ['calc'] },
          { l: ['Merchant route', '市场化路径'], v: mer ? L(mer.span) : '—', d: ['durations the engine cannot separate', '引擎无法区分的时长区间'], b: ['calc'] },
          { l: ['Floor route', '保底路径'], v: floor ? L(floor.span) : '—', d: ['the floor is priced at two hours', '保底按两小时定价'], b: ['calc'] },
        ] },
        { t: 'table', head: [['Evidence', '证据'], ['Points to', '指向']], rows: [
          [['The connected and announced fleet is overwhelmingly two-hour: Statkraft/OX2 110 MW/220 MWh and 125 MW/250 MWh, Uusnivala 50 MW/110 MWh, Kauhava 50 MW/100 MWh', '已并网与已公布机组绝大多数为两小时：Statkraft/OX2 110MW/220MWh与125MW/250MWh、Uusnivala 50MW/110MWh、Kauhava 50MW/100MWh'], ['2h', '两小时']],
          [['Foresight bought a 100 MW / 400 MWh four-hour project at Nivala in October 2026', 'Foresight于2026年10月收购Nivala 100MW/400MWh四小时项目'], ['4h, for trading', '四小时，面向交易']],
          [['Clean Horizon’s August 2026 index: €78k/MW at 2h against €111k at 4h — +42% for twice the energy', 'Clean Horizon 2026年8月指数：两小时每MW 7.8万欧元，四小时11.1万欧元 — 能量翻倍收入增42%'], ['sub-linear: 2h for reserves, 4h only if trading is cheap to add', '次线性：备用适合两小时，仅当增加交易能力成本低时才选四小时']],
          [['Reserves are paid per MW, not per hour', '备用按MW而非小时付费'], ['no reserve case for longer duration', '备用收入不支持更长时长']],
        ] },
        { t: 'why', text: [
          'Two hours is what a reserve market builds, and the fleet is two-hour. The newest money is starting to buy four, because once reserves saturate the extra hours are paid by trading alone. The engine’s sweep uses a capture curve shared with Romania until a Finnish fifteen-minute backtest replaces it (gate FI-4), so the four-hour answer is the one to test first.',
          '两小时是备用市场催生的配置，现有机组也以两小时为主。最新资金已开始购买四小时项目，因为备用饱和后增加的时长仅由交易收入支付。引擎时长扫描采用与罗马尼亚共用的捕获曲线，直至芬兰15分钟回测替代（研究缺口FI-4），因此四小时的结论应最先检验。',
        ], sig: [['The fleet is two-hour', '机组以两小时为主'], ['New money buys four', '新资金购买四小时']] },
        { t: 'src', src: SRC.dealForesight, use: ['The four-hour Nivala acquisition', 'Nivala四小时项目收购'] },
        { t: 'src', src: SRC.storageIndex, use: ['Revenue by duration, August 2026', '2026年8月按时长的收入'] },
        { t: 'src', src: SRC.statkraftOx2, use: ['The 235 MW under construction', '在建的235MW'] },
      ] },
    ] };
  };

  // ---------------- Pipeline ------------------------------------------------
  SEC_B.pipeline = () => ({ head: ['Project pipeline and the buyers behind it', '项目管线及其背后的买方'], blocks: [
    { t: 'card', mt: false, title: ['Who is buying Finnish storage', '谁在收购芬兰储能'], badges: ['tp'], live: false, blocks: [
      { t: 'table', head: [['When', '时间'], ['Buyer', '买方'], ['Seller', '卖方'], ['Asset', '资产']],
        rows: M.deals.map(d => [d.when, { b: d.buyer }, d.seller, d.asset]) },
      { t: 'why', text: [
        'The buyers are infrastructure funds and their platforms — L&G NTR, IFM through Nala, Foresight, Prime Capital — and they kept buying through the reserve collapse. Most bought at ready-to-build, which is the entry stage this platform underwrites, and one financed at the project level with a bank. That is the exit market a Finnish developer sells into, and it is deeper than the revenue history would suggest.',
        '买方为基础设施基金及其平台 — L&G NTR、通过Nala的IFM、Foresight、Prime Capital — 且它们在备用收入崩塌期间仍在持续收购。多数在可建设阶段买入，即本平台承销的进入阶段；其中一家已获银行项目融资。这正是芬兰开发商出售资产的退出市场，其深度超出收入历史所显示的水平。',
      ], sig: [['Funds kept buying', '基金持续收购'], ['Ready-to-build is the trade', '交易集中于可建设阶段']] },
      { t: 'src', src: SRC.dealNtr, use: ['Uusnivala, August 2024', 'Uusnivala，2024年8月'] },
      { t: 'src', src: SRC.dealKauhava, use: ['Kauhava financing', 'Kauhava融资'] },
      { t: 'src', src: SRC.dealVuolijoki, use: ['Vuolijoki, February 2026', 'Vuolijoki，2026年2月'] },
      { t: 'src', src: SRC.dealPrime, use: ['170 MWh project, March 2026', '170MWh项目，2026年3月'] },
      { t: 'src', src: SRC.dealForesight, use: ['Nivala four-hour, October 2026', 'Nivala四小时，2026年10月'] },
    ] },
    { t: 'card', title: ['Projects under construction and announced', '在建与已公布项目'], badges: ['dev'], live: false, blocks: [
      { t: 'table',
        head: ['Project', 'MW', 'MWh', 'Status'],
        num: [1, 2],
        rows: M.fleet.announced.map(p => [{ b: p.name }, fmtN(p.mw), fmtN(p.mwh), p.status]) },
      { t: 'note', b: ['Announcements, not a register. ', '公告而非登记册。'], text: [
        'Fingrid publishes storage capacity as an aggregate, not a project-level register, so this table is announcements. The Statkraft/OX2 sites rest on a named counterparty agreement and Nivala on its October 2026 sale to Foresight; the Uusikaupunki row rests on trade press and is the weakest citation on this page.',
        'Fingrid公布的是储能容量汇总值而非项目级登记册，故本表为公告汇总。Statkraft/OX2场址有具名交易对手协议支撑，Nivala依据其2026年10月出售给Foresight的交易；Uusikaupunki仅依据行业媒体报道，属本页最弱来源。',
      ] },
      { t: 'src', src: SRC.storageFleet, use: ['Connected storage aggregate', '已并网储能汇总'] },
      { t: 'src', src: SRC.statkraftOx2, use: ['Statkraft/OX2 agreement', 'Statkraft/OX2协议'] },
      { t: 'src', src: SRC.dealForesight, use: ['Nivala, as sold in October 2026', 'Nivala，2026年10月出售时的规模'] },
      { t: 'src', src: SRC.tradePress, use: ['Uusikaupunki — the weakest citation on this page', 'Uusikaupunki — 本页最弱来源'] },
    ] },
  ] });

  // ---------------- Grid connection ----------------------------------------
  SEC_B.grid = () => ({ head: ['Grid connection — the constraint that decides the project', '并网 — 决定项目成败的约束'], blocks: [
    { t: 'card', mt: false, title: ['Interactive Finland grid — the north–south cut and the restricted south', '芬兰电网交互地图 — 南北断面与受限的南部'], badges: ['official', 'public'], blocks: [
      { t: 'geo-grid-map', data: gridMapById('fi-grid-map') },
      { t: 'why', text: [
        'Generation is in the west and north, where the wind is; load is in the south. The north–south cut is where that shows, and the restricted area is south of it. A northern site is commercially identical in a single price zone and physically easier to connect.',
        '电源位于风资源所在的西部与北部，负荷位于南部。南北断面正是这一格局的体现，受限区域位于其南侧。在单一报价区内，北部场址在商业上并无差别，在物理上则更易并网。',
      ], sig: [['Wind north, load south', '风电在北，负荷在南']] },
    ] },
    { t: 'congestion', data: congestionFor('fi') },
    { t: 'card', title: ['The connection queue', '并网排队'], badges: ['official'], live: false, blocks: [
    { t: 'kpis', items: [
      { l: ['Storage connection requests', '储能并网申请'], v: '>' + fmtN(M.connection.requestsMW) + '<small> MW</small>' },
      { l: ['Already contracted', '已签约'], v: '~' + fmtN(M.connection.contractedMW) + '<small> MW</small>' },
      { l: ['South restricted until', '南部受限至'], v: M.connection.restrictedUntil, d: ['was ' + M.connection.previouslyUntil, '此前为' + M.connection.previouslyUntil + '年'] },
      { l: ['Reinforcement', '加强工程'], v: '+' + fmtN(M.connection.reinforcementMW) + '<small> MW</small>', d: ['north to south', '由北向南'] },
    ] },
    { t: 'p', text: [
      'Fingrid has restricted new grid energy storage connections in southern Finland until 2029, when the Hikiä–Toivila reinforcement completes. Capacity remains available in Ostrobothnia and the north. Because Finland is a single price area, siting north costs nothing in modelled revenue.',
      'Fingrid已将芬兰南部新增电网侧储能并网限制至2029年，即Hikiä–Toivila加强工程完工之时。博滕区与北部仍有可用容量。由于芬兰为单一报价区，在北部选址不会造成模型收入损失。',
    ] },
    { t: 'why', text: [
      'The restriction previously ran to early 2027 and was extended — because connection demand grew, not because the works slipped. Treat 2029 as a forecast with a demonstrated direction of error. Meanwhile the 1,800 MW already contracted holds something the next 30,000 MW cannot buy.',
      '该限制此前至2027年初，后被延长 — 原因是并网需求增长而非工程延误。应将2029年视为一个已显现偏差方向的预测。与此同时，已签约的1,800MW持有后续30,000MW申请无法购得的资源。',
    ], sig: [['Extended once already', '已延期一次'], ['Scarcity favours the incumbent', '稀缺性有利于在运方']] },
    { t: 'src', src: SRC.reserveObligations, use: ['Main grid scale and the reinforcement programme', '主网规模与加强工程'] },
    ] },
    { t: 'pathway', pathway: FI_BUILD_PATHWAY, sourceFor: (k) => SRC[k] },
  ] });

  // ---------------- Portfolio ----------------------------------------------
  SEC_B.portfolio = () => {
    const inp = labInputs(), r = labModel(inp);
    const dn = labModel(inp, { spreadFactor: 0.75, svcFactor: 0.5 });
    const line = designLine('fi');
    return {
    head: ['Portfolio / Fund View — applying the Finnish thesis to a screened opportunity', '组合与基金视图 — 将芬兰逻辑应用于所筛选机会'],
    cap: ['The Investment Lab’s screening case taken through the gate sequence an investment committee applies. It runs the Lab’s own model on the Lab’s inputs; the engine’s case is on the Brief.',
          '投资测算筛选情景，按投委会适用的门槛顺序逐项演示。该情景以投资测算自身的模型与输入运行；引擎情景见要点页。'],
    blocks: [
      { t: 'card', mt: false, title: ['Screened opportunity — institutional screening snapshot', '所筛选机会 — 机构筛选快照'], badges: ['model'], live: false, blocks: [
        { t: 'kpis', items: [
          { l: ['Configuration', '配置'], v: fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d: [inp.hours + '-hour, northern site', inp.hours + '小时，北部场址'] },
          { l: ['Target COD', '目标投运'], v: state.codYear, d: ['dilution factor ' + fmtPct(dilutionAt(+state.codYear) * 100, 0), '稀释系数' + fmtPct(dilutionAt(+state.codYear) * 100, 0)] },
          { l: ['Total capex', '总资本开支'], v: fmtCM(r.capex), d: [fmtC(inp.capexKWh) + '/kWh energy, of which ' + fmtC(inp.dcQuoteKWh) + ' is the quoted DC block', fmtC(inp.capexKWh) + '/kWh能量段，其中' + fmtC(inp.dcQuoteKWh) + '为报价直流电池舱'], b: ['model'] },
          { l: ['Year-1 trading revenue', '第1年交易收入'], v: fmtCM(r.arb1), d: ['plus reserves ' + fmtCM(r.svc1), '另加备用收入' + fmtCM(r.svc1)], b: ['calc'] },
          { l: ['Year-1 EBITDA', '第1年EBITDA'], v: fmtCM(r.ebitda1), d: ['unlevered IRR ' + fmtIRR(r.unlevIRR), '无杠杆IRR ' + fmtIRR(r.unlevIRR)], b: ['calc'] },
          { l: ['Min DSCR — lender downside', '最低偿债覆盖率 — 贷款人下行'], v: fmtX(dn.minDSCR), d: ['−25% spread, −50% reserves', '价差−25%、备用−50%'], cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b: ['calc'] },
        ] },
        line ? { t: 'note', text: ['The Brief and the shortlist use the engine, not this Lab case. ' + line[0], '要点页与候选清单采用引擎而非本测算情景。' + line[1]] } : null,
        { t: 'ic', b: ['Screening conclusion: ', '筛选结论：'], text: [
          'A Finnish screening decision turns on two documents and one negotiation: a connection offer outside the restricted south, Fingrid prequalification for the reserve products the case counts, and an optimiser floor that covers the project for at least seven years. With those in hand the case is trading plus a thin reserve line under a floor at half of expected revenue — and the floor, not the reserve market, is what lenders size on.',
          '芬兰的筛选决策取决于两份文件与一项谈判：受限南部以外的并网方案、方案所计备用品种的Fingrid预认证，以及覆盖项目至少七年的优化商保底。三者齐备后，投资逻辑为交易收入加较薄的备用收入，并由预期收入一半的保底托底 — 贷款人据以测算的是保底而非备用市场。',
        ] },
      ] },
      { t: 'card', title: ['Revenue stack — evidence status of each line', '收入结构 — 各收入项的证据状态'], badges: ['calc'], live: false, blocks: [
        { t: 'table', head: [['Revenue line', '收入项'], ['Year-1, engine case', '第1年（引擎情景）'], ['Evidence status', '证据状态'], ['Treatment in the model', '模型处理方式']], num: [1], rows: [
          [{ b: ['Capacity mechanism', '容量机制'] }, fmtC(0), { chip: 'critical', text: ['Dormant strategic reserve', '休眠的战略备用'] },
           ['Zero by design', '按设计为零']],
          [{ b: ['Trading, day-ahead and intraday', '日前与日内交易'] }, kMW(merchNet), { chip: 'warn', text: ['Seed level; 15-minute backtest outstanding', '种子水平；15分钟回测待完成'] },
           ['The main line; net of a ' + E.feePct + '% optimiser fee', '主要收入项；已扣除' + E.feePct + '%优化商费用']],
          [{ b: ['Reserves', '备用'] }, kMW(E.services), { chip: 'serious', text: ['2026 annual clearing, fleet-shared', '2026年度出清，按储能分摊'] },
           ['Hourly markets not counted (gate FI-2)', '未计小时级市场（研究缺口FI-2）']],
          [{ b: ['Optimiser floor', '优化商保底'] }, kMW(E.toll), { chip: 'good', text: ['Signed in the market; seven years or more', '市场已有签约；七年或以上'] },
           ['A floor: the owner keeps revenue above it', '保底：超出部分归业主']],
        ] },
        { t: 'why', text: [
          'Half of year-one revenue is secured by the floor for seven years, and none of it by the state. That is enough for a secured tranche sized on the floor and a merchant tranche on the rest, which is how the Nala Kauhava project was financed. What the floor cannot do is lift the case: it sits under expected revenue, not beside it.',
          '第一年收入的一半由保底锁定七年，而无任何部分来自国家。这足以按保底测算锁定部分债务、按其余部分测算市场化部分债务 — Nala的Kauhava项目即以此方式融资。保底无法抬高投资回报：它位于预期收入之下，而非之外。',
        ], sig: [['Half secured, by a floor', '一半由保底锁定']] },
        { t: 'src', src: SRC.dealKauhava, use: ['Project finance on a Finnish battery', '芬兰储能项目融资'] },
      ] },
      { t: 'card', title: ['Investment Committee gates — what must be true before capital is released', '投委会门槛 — 资金拨付前必须成立的条件'], badges: ['calc'], live: false, blocks: [
        { t: 'gates', items: [
          { n: ['Gate 1 — Connection outside the restricted south', '门槛1 — 受限南部以外的并网'], d: ['A Fingrid or DSO connection offer with capacity and a date, at a site that does not wait for 2029.', '持有容量与日期明确的Fingrid或配电网并网方案，且场址无需等待2029年。'], c: 'critical', s: ['Decides whether there is a project', '决定项目是否存在'] },
          { n: ['Gate 2 — The floor, signed', '门槛2 — 已签署的保底'], d: ['An optimiser or offtaker floor covering the whole project for at least seven years, at a level the secured tranche can be sized on.', '覆盖整个项目至少七年的优化商或购电方保底，且水平足以测算锁定部分债务。'], c: 'serious', s: ['The only secured revenue', '唯一的锁定收入'] },
          { n: ['Gate 3 — Reserves at the observed level', '门槛3 — 备用按观测水平计'], d: ['Confirm the case does not carry the 2023–2025 reserve prices. FCR-N annual cleared at zero for 2026.', '确认方案未沿用2023–2025年的备用价格。2026年度FCR-N以零出清。'], c: 'critical', s: ['The usual overstatement', '常见的高估之处'] },
          { n: ['Gate 4 — Downside coverage', '门槛4 — 下行覆盖'], d: ['Minimum DSCR of at least 1.30x with trading revenue 25% lower and reserves halved.', '在交易收入下降25%、备用收入减半的情况下，最低偿债覆盖率不低于1.30倍。'], c: 'warn', s: ['Read the Lab above', '见上方测算'] },
          { n: ['Gate 5 — Exit specification', '门槛5 — 退出规格'], d: ['A named buyer universe. Infrastructure funds bought Finnish projects at ready-to-build through 2026; the floor is what makes the asset theirs.', '明确的买家群体。基础设施基金在2026年持续收购可建设阶段的芬兰项目；保底使该资产符合其投资范围。'], c: 'good', s: ['A live exit market', '活跃的退出市场'] },
        ] },
        { t: 'why', text: [
          'The first gate is physical and the second is commercial, and both are documents rather than forecasts. Gate 3 is where Finnish models most often go wrong: the reserve prices of the boom are still in many developer cases, and the 2026 annual auction is the cleanest evidence that they no longer hold.',
          '第一关属物理条件，第二关属商业条件，两者都是文件而非预测。第3关是芬兰模型最常出错之处：许多开发商方案仍沿用高峰期的备用价格，而2026年度拍卖是其已不再成立的最清晰证据。',
        ], sig: [['Gate 3 is the common error', '第3关是常见错误']] },
      ] },
    ] };
  };

  // ---------------- Data & methodology --------------------------------------
  SEC_B.data = () => ({ head: ['Data and methodology', '数据与方法'], blocks: [
    { t: 'card', mt: false, title: ['Open gates', '待关闭的研究缺口'], badges: ['official'], live: false, blocks: [
      { t: 'kpis', items: [
        { l: ['Sources verified', '来源核验日期'], v: '2026-10-17' },
        { l: ['Main grid', '主网规模'], v: fmtN(M.grid.lineKm) + '<small> km</small>', d: [fmtN(M.grid.substations) + ' substations', fmtN(M.grid.substations) + '座变电站'] },
        { l: ['Ten-year investment', '十年投资'], v: '€' + M.grid.tenYearInvestmentEurBn + '<small> bn</small>' },
      ] },
      { t: 'table',
        head: ['Gate', 'What it decides', 'What closes it'],
        rows: [
          [{ b: ['FI-1', 'FI-1'] }, ['The reserve line — set 2026-10-17 at the 2026 annual clearing spread across the fleet', '备用收入项 — 2026-10-17按2026年度出清按全部储能分摊设定'], ['Eligible against procured MW per product, to replace the fleet average', '按品种统计的合格容量与采购容量，以替代储能平均值']],
          [{ b: ['FI-2', 'FI-2'] }, ['Whether the reserve line is too low: the hourly markets', '备用收入是否偏低：小时级市场'], ['The Fingrid API key, terms and CC attribution', 'Fingrid API密钥、条款与CC署名']],
          [{ b: ['FI-3', 'FI-3'] }, ['Finnish capex, opex and fees; the floor level', '芬兰本地造价、运维与费率；保底水平'], ['A local benchmark; the analyst’s floor input meanwhile', '本地基准数据；当前采用分析师的保底输入']],
          [{ b: ['FI-4', 'FI-4'] }, ['A sourced merchant capture rate and the duration curve', '有据可依的市场化捕获率与时长曲线'], ['A backtest on 15-minute settlement', '基于15分钟结算的回测']],
          [{ b: ['FI-5', 'FI-5'] }, ['A north/south split of the connection queue', '并网排队的南北分布'], ['Fingrid publishing requests by region', 'Fingrid按区域公布申请量']],
        ] },
      { t: 'src', src: SRC.fingridApiTerms, use: ['Dataset licence and what the API path still needs', '数据集许可条款及API接入尚需完成的事项'] },
      { t: 'src', src: SRC.reserveObligations, use: ['Reserve obligations and forecast', '备用需求与预测'] },
      { t: 'src', src: SRC.peakLoadCapacity, use: ['Adequacy and the dormant mechanism', '充裕度与休眠机制'] },
      { t: 'src', src: SRC.storageFleet, use: ['Connected storage aggregate', '已并网储能汇总'] },
    ] },
    { t: 'card', title: ['Core formulas', '核心公式'], badges: ['calc'], live: false, blocks: [
      { t: 'table', head: [['Quantity', '指标'], ['Formula', '公式']], rows: [
        [{ b: ['Reserve line', '备用收入'] }, '(237 MW × €3.50 + 163 MW × €6.00) × 8,760 h ÷ 1,050 MW = ' + fmtC(E.services) + '/MW/yr'],
        [{ b: ['Expected year-1 revenue', '第1年预期收入'] }, 'trading × (1 − fee) + reserves = ' + fmtC(Math.round(expected)) + '/MW'],
        [{ b: ['Floor', '保底'] }, '50% × expected year-1 revenue = ' + fmtC(E.toll) + '/MW for ' + E.tollYears + ' years'],
        [{ b: ['Revenue under the floor', '保底下的收入'] }, 'max(floor, trading + reserves) in each floor year; the floor is the secured part'],
        [{ b: ['Capex', '资本开支'] }, 'held €440k/MW at 2h; quoted HiTHIUM DC block landed at €90.19/kWh, outside the sponsor discount'],
      ] },
    ] },
    { t: 'card', title: ['Bilingual glossary', '双语术语表'], badges: ['calc'], live: false, blocks: [
      { t: 'glossary' },
    ] },
  ] });

  /* ---- Investment Case and Entry — the investment-view revision ------------
     Both read the view store and the capital-at-risk ledger by market id; the
     section says which market and nothing else. */
  SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
    { t: 'p', text: ['The easiest of the four markets to get into and the most crowded once inside. Entry is open today and scheduled to narrow in 2027.', '四个市场中最容易进入、进入后也最拥挤的一个。目前入口敞开，但按计划将于2027年收窄。'] },
    { t: 'investment-case', marketId: 'fi' },
  ] });
  SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
    { t: 'p', text: ['The connection application is free and names no security. The cost is a fixed connection fee of EUR 1,000,000 at 110 kV, which is about 5% of a 50 MW project and a much smaller share of a larger one.', '并网申请免费，且未提及担保。成本在于110kV固定并网费100万欧元：对50MW项目约占投资的5%，项目越大占比越小。'] },
    { t: 'entry-ledger', marketId: 'fi' },
  ] });

  return SECTIONS;
}
