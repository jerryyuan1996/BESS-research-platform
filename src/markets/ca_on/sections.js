import {researchHistory} from './history.js';
/* ---------------------------------------------------------------------------
   Ontario — declarative section specs for the shared block engine.

   Written 2026-10-23 on the analyst's sign-off of
   docs/ontario-registration-plan.md. The order of the argument: a contract
   from the system operator pays about two-thirds of the revenue, trading the
   rest, and the open questions are the trading level and whether an
   eight-hour build holds its rating for twenty years.
   --------------------------------------------------------------------------- */

import { comparison } from './comparison.js';
import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';
import { designLine, designBest, routeFit } from '../_shared/designAnswer.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { L, M, SRC, state, fmtN, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, dilutionAt, labInputs, labModel } = api;
  const E = comparison.economics;
  const T = M.trading, K = M.lt2;

  const SEC_B = {};
  function SECTIONS(){
    const o = {};
    Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
    return o;
  }

  const kMW = (v) => fmtCk(v) + '<small>/MW/yr</small>';
  const merchNet = E.merchGross * (1 - E.feePct / 100);
  const total = E.contracted + merchNet;
  const contractShare = E.contracted / total;

  // ---------------- Overview -----------------------------------------------
  SEC_B.home = () => ({ head: ['Ontario at a glance', '安大略概览'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'band-story', b: ['Core storyline', '核心叙事'], text: [
        'Ontario buys capacity from batteries on twenty-year contracts and leaves the market revenue with the owner. Window 1 of LT2 cleared three eight-hour batteries at about C$141k per MW a year, and day-ahead trading since Market Renewal adds about C$75k before fees. The investable entry is window 2, drafted for a 2032 start.',
        '安大略以二十年合同向储能采购容量，市场收入归业主所有。LT2窗口1以约每MW每年14.1万加元授予三个八小时储能项目，电力市场改革后的日前交易另增约7.5万加元（扣费前）。可投资的进入点是窗口2，草案投运日为2032年。',
      ] },
      { t: 'kpis', items: [
        { l: ['LT2 contract, year 1', 'LT2合同（第1年）'], v: kMW(E.contracted), d: ['C$' + K.priceWeighted + '/MW-Business Day × ' + K.businessDays, '每MW工作日' + K.priceWeighted + '加元×' + K.businessDays], b: ['official'] },
        { l: ['Trading, 8 h', '交易收入（8小时）'], v: kMW(E.merchGross), d: ['before a ' + E.feePct + '% optimiser fee', '扣除' + E.feePct + '%优化商费用前'], b: ['calc'] },
        { l: ['Contracted share, year 1', '第1年合同占比'], v: fmtPct(contractShare * 100, 0), d: ['of contract plus trading after fees', '占合同加扣费后交易收入'], b: ['calc'] },
        { l: ['Contract term', '合同期限'], v: '20<small> yr</small>', d: ['COD to 30 April 2050', '投运至2050年4月30日'], b: ['official'] },
        { l: ['Capex, 8 h', '资本开支（8小时）'], v: fmtCM(E.capexPerMW) + '<small>/MW</small>', d: ['before the 30% investment tax credit', '扣除30%投资税收抵免前'], b: ['model'] },
        { l: ['Window 2 milestone', '窗口2里程碑'], v: '2032', d: ['drafts posted 9 Oct 2026', '草案于2026年10月9日发布'], b: ['official'] },
      ] },
      { t: 'warn', text: M.seedWarn },
      { t: 'walk', items: [
        ['01', ['Overview', '总览'], ['What is the house view today?', '当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution', '市场演进'], ['How did Ontario get to eight-hour contracts?', '安大略如何走到八小时合同？'], 'story'],
        ['03', ['Revenue stack', '收入结构'], ['What does LT2 pay, and what does trading add?', 'LT2支付多少，交易增加多少？'], 'capacity'],
        ['04', ['Asset design', '资产设计'], ['Eight hours or twelve — and will it hold for twenty years?', '八小时还是十二小时 — 能否维持二十年？'], 'duration'],
        ['05', ['Underwriting', '项目承销'], ['What does a bid put at risk, and where can it connect?', '投标承担哪些风险，可在何处并网？'], 'grid'],
        ['06', ['Portfolio application', '组合应用'], ['Does the screened case clear the committee gates?', '筛选方案能否通过投委会门槛？'], 'portfolio'],
      ] },
      { t: 'why', text: [
        'The contract is the investable thing: a system-operator counterparty, twenty years, a price fixed at bid, and nothing taken back from the market revenue. What decides a bid is the price you can offer, and that is set by capex, the 30% tax credit and how much trading you believe in.',
        '合同本身就是可投资的标的：系统运营商作为交易对手、二十年期限、投标时锁定价格，且不收回任何市场收入。决定投标的是可报出的价格，而这取决于资本开支、30%税收抵免以及对交易收入的判断。',
      ], sig: [['System-operator counterparty', '系统运营商作为交易对手'], ['Market revenue retained', '市场收入保留'], ['Bid on capex and trading', '依据造价与交易报价']] },
      { t: 'src', src: SRC.lt2Results, use: ['Window 1 prices and projects', '窗口1价格与项目'] },
    ] },
    { t: 'g2', cards: [
      { title: ['Card A — Contract Signal', 'Card A — 合同信号'], live: false, blocks: [
        { t: 'chip', cls: 'good', text: ['Twenty years, priced per MW-Business Day', '二十年期，按每MW工作日定价'] },
        { t: 'kpis', items: [
          { l: ['Weighted price', '加权价格'], v: 'C$' + K.priceWeighted, d: ['per MW-Business Day', '每MW工作日'], b: ['official'] },
          { l: ['Cleared range', '中标区间'], v: 'C$' + K.priceLow + '–' + K.priceHigh, b: ['official'] },
          { l: ['CPI-indexed share', 'CPI挂钩比例'], v: K.indexedSharePct + '%', d: ['the rest fixed in nominal dollars', '其余为名义固定'], b: ['official'] },
        ] },
        { t: 'why', text: [
          'Eighty per cent of the price is fixed in nominal dollars, so in real terms the line erodes: over fifteen years it averages about 90% of its first-year value at 2% inflation. The platform carries the first-year value flat, as it does every contract, and says so here.',
          '价格的80%为名义固定，因此按实际值计算会逐年侵蚀：按2%通胀，十五年平均约为首年价值的90%。本平台与其他合同一样按首年价值平直计入，并在此说明。',
        ], sig: [['80% fixed nominal', '80%名义固定']] },
      ] },
      { title: ['Card B — Trading Signal', 'Card B — 交易信号'], live: false, blocks: [
        { t: 'chip', cls: 'warn', text: ['90 days of a new market — a full year will move it', '新市场仅90天数据 — 满一年后将调整'] },
        { t: 'kpis', items: [
          { l: ['Eight-hour spread', '八小时价差'], v: 'C$' + T.tb8PerDay + '<small>/MW-day</small>', d: [T.windowFrom + ' to ' + T.windowTo, T.windowFrom + '至' + T.windowTo], b: ['official'] },
          { l: ['Against 2024, same months', '与2024年同期相比'], v: '+' + fmtPct((T.tb8PerDay / T.hoep2024Window - 1) * 100, 0), d: ['before Market Renewal', '电力市场改革前'], cls: 'up', b: ['calc'] },
          { l: ['Trading line', '交易收入'], v: kMW(E.merchGross), d: ['annualised, after round-trip, availability and foresight', '年化，已计往返效率、可用率与预见性折减'], b: ['calc'] },
        ] },
        { t: 'why', text: [
          'Locational day-ahead prices since May 2025 widened the spread a battery trades by about half on the same months of 2024. The window is summer and autumn, so the year is scaled down by the old market\'s seasonal shape before the seed is set.',
          '2025年5月起实行的节点日前电价，使储能可交易的价差较2024年同期扩大约一半。观测窗口为夏秋两季，因此在设定种子值前按旧市场的季节形态对全年进行了下调。',
        ], sig: [['Half wider since renewal', '改革后价差扩大一半']] },
      ] },
      { title: ['Card C — Capex Signal', 'Card C — 造价信号'], live: false, blocks: [
        { t: 'chip', cls: 'good', text: ['No surtax on Chinese batteries; 7% duty', '中国电池无附加税；关税7%'] },
        { t: 'kpis', items: [
          { l: ['Capex, 8 h', '资本开支（8小时）'], v: fmtCM(E.capexPerMW) + '<small>/MW</small>', d: ['Oneida rebuilt with the quoted DC block', '以报价直流电池舱重构Oneida成本'], b: ['model'] },
          { l: ['After the 30% ITC', '扣除30%抵免后'], v: fmtCM(E.capexPerMW * 0.7) + '<small>/MW</small>', b: ['calc'] },
          { l: ['Oneida, final', 'Oneida最终成本'], v: 'C$700<small>m</small>', d: ['250 MW / 1,000 MWh, 2025', '250MW/1,000MWh，2025年'], b: ['project'] },
        ] },
        { t: 'why', text: [
          'Canada charges 7% on Chinese lithium-ion batteries and no surtax, and the contract re-opens the price if a tariff introduced after the bid raises capex by more than 10%. The refundable 30% tax credit is the owner\'s to keep, so it is in every winning bid.',
          '加拿大对中国锂电池征收7%关税、无附加税；若投标后新增关税使造价上升超过10%，合同可重新议价。30%可退还税收抵免归业主所有，因此已体现在所有中标报价中。',
        ], sig: [['Tariff risk shared', '关税风险共担']] },
      ] },
      { title: ['Card D — Delivery Signal', 'Card D — 交付信号'], live: false, blocks: [
        { t: 'chip', cls: 'serious', text: ['Payment scales with tested capacity; default below 85%', '付款随测试容量调整；低于85%即违约'] },
        { t: 'kpis', items: [
          { l: ['Proposal security', '投标担保'], v: 'C$35,000<small>/MW</small>', d: ['letter of credit, held to COD', '信用证，持有至投运'], b: ['official'] },
          { l: ['Delay damages', '延误违约金'], v: 'C$150<small>/MW-day</small>', d: ['per Business Day, up to 548 days', '按工作日计，最长548天'], b: ['official'] },
          { l: ['Fade at year 20, 2%/yr', '第20年衰减（每年2%）'], v: fmtPct((1 - Math.pow(0.98, 19)) * 100, 0), d: ['with no augmentation', '不考虑扩容'], cls: 'warn', b: ['calc'] },
        ] },
        { t: 'why', text: [
          'An exact eight-hour build without augmentation tests below 85% around year ten at 2% a year, which is a default, not a discount. Winning owners oversize — Eagle Lake builds 200 MW for 190 contracted — and the contract lets them cut capacity by up to 7%. This is the one place the platform\'s no-augmentation default does not fit the contract.',
          '若不扩容，恰好八小时的储能按每年2%衰减，约在第十年测试容量低于85%，这将构成违约而非扣款。中标方均超配 — Eagle Lake为190MW合同建设200MW — 合同亦允许削减最多7%的容量。这是本平台"不扩容"默认设定与合同不相符的唯一之处。',
        ], sig: [['Oversize or augment', '超配或扩容']] },
      ] },
    ] },
  ] });

  // ---------------- Market story -------------------------------------------
  SEC_B.story = () => ({ head: researchHistory(api).head, blocks: [
    researchHistory(api).cards[0],
    { t: 'card', title: ['What Market Renewal did to the spread', '电力市场改革对价差的影响'], badges: ['official', 'calc'], blocks: [
      { t: 'bar', cfg: { xs: ['HOEP 2023', 'HOEP 2024', 'Day-ahead 2026*'], bw: 46, labels: true, h: 230, yfmt: v => 'C$' + fmtN(v),
        series: [{ name: ['Eight-hour spread, C$/MW-yr', '八小时价差（加元/MW/年）'], color: 'var(--s6)', vals: [T.hoep2023Annual, T.hoep2024Annual, T.tb8Annual] }] } },
      { t: 'cap', text: ['Daily sum of the eight highest hourly prices less the eight lowest, summed over the year. *2026 is 90 days annualised with the 2023–24 seasonal ratio, ' + T.seasonalRatio + '.',
                         '每日八个最高小时电价之和减八个最低之和，按年加总。*2026年为90天数据，以2023–24年季节比率' + T.seasonalRatio + '年化。'] },
      { t: 'why', text: [
        'Ontario ran one uniform real-time price until 30 April 2025. The day-ahead market with locational prices that replaced it widened the eight-hour spread from about C$70k per MW a year in 2024 to about C$103k on the 2026 evidence, before any haircut.',
        '安大略在2025年4月30日前实行全省统一实时电价。取而代之的含节点电价日前市场，使八小时价差由2024年约每MW每年7.0万加元扩大至2026年数据所示的约10.3万加元（未计折减）。',
      ], sig: [['From one price to many', '从单一电价到多节点电价']] },
      { t: 'src', src: SRC.hoepYearly, use: ['The spread before Market Renewal', '电力市场改革前的价差'] },
      { t: 'src', src: SRC.daZonalPrice, use: ['The spread since', '此后的价差'] },
    ] },
  ] });

  // ---------------- Capacity: the LT2 contract ------------------------------
  SEC_B.capacity = () => ({ head: ['The LT2 capacity contract — what it pays and what it asks', 'LT2容量合同 — 支付什么、要求什么'], blocks: [
    { t: 'card', mt: false, title: ['The contract line, derived', '合同收入的推导'], badges: ['official', 'calc'], live: false, blocks: [
      { t: 'table', head: [['Project', '项目'], ['Zone', '区域'], ['MW', 'MW'], ['C$/MW-BD', '加元/MW工作日'], ['× 251 = C$/MW-yr', '×251 = 加元/MW/年']], num: [2, 3, 4], rows: [
        ...K.winners.map(w => [{ b: w.name }, w.zone, fmtN(w.mw), w.price.toFixed(2), fmtN(Math.round(w.price * K.businessDays))]),
        [{ b: ['Weighted (IESO)', '加权（IESO）'] }, '', fmtN(K.contractedMW), K.priceWeighted.toFixed(2), fmtN(E.contracted)],
      ] },
      { t: 'p', text: [
        'Business Days are weekdays less ten holidays a year — IESO\'s market holiday schedule without Easter Monday, Remembrance Day and the National Day for Truth and Reconciliation, which the contract carves out. Counted day by day that is 250 to 252 a contract year and 250.90 on average to April 2050, so 251.',
        '工作日为工作周日扣除每年十个节假日 — 即IESO市场节假日表剔除合同排除的复活节星期一、国殇纪念日与全国真相与和解日。逐日计算，每合同年为250至252天，至2050年4月平均250.90天，故取251。',
      ] },
      { t: 'src', src: SRC.lt2Results, use: ['Prices and projects', '价格与项目'] },
      { t: 'src', src: SRC.holidaySchedule, use: ['The Business Day count', '工作日天数'] },
    ] },
    { t: 'card', title: ['The terms that decide the case', '决定投资逻辑的条款'], badges: ['official'], live: false, blocks: [
      { t: 'table', head: [['Term', '条款'], ['What the contract says', '合同规定'], ['Clause', '条款号']], rows: [
        [{ b: ['Term', '期限'] }, ['COD to 30 April 2050; milestone COD 1 May 2030; longstop eighteen months later', '投运至2050年4月30日；里程碑投运日2030年5月1日；最终期限再延后十八个月'], 's.9.1, Exhibit P'],
        [{ b: ['Market revenue', '市场收入'] }, ['Retained: the IESO has no interest in the facility\'s other products or services, except future capacity products', '保留：除未来容量类产品外，IESO对设施的其他产品或服务不享有权益'], 's.2.10'],
        [{ b: ['Duration', '时长'] }, ['Eight or twelve hours of contract capacity inside 07:00–23:00 EST on Business Days', '工作日东部标准时间7:00–23:00内持续输出合同容量八或十二小时'], 'Exhibit A'],
        [{ b: ['Indexation', '指数化'] }, ['Whole price to CPI until COD; then 20% to CPI, 80% fixed', '投运前全额与CPI挂钩；投运后20%挂钩、80%固定'], 'Exhibit J'],
        [{ b: ['Must-offer', '强制申报'] }, ['Offer contract capacity into the day-ahead market; shortfall charged at up to twice the monthly payment', '须在日前市场申报合同容量；不足部分最高按月付款两倍收取'], 's.3.1, Exhibit F'],
        [{ b: ['Capacity tests', '容量测试'] }, ['Payment scales with tested capacity; two failed tests below 85% are a default', '付款随测试容量调整；两次测试低于85%即违约'], 's.15.6'],
        [{ b: ['Charging costs', '充电成本'] }, ['Uplifts and Global Adjustment on charging reimbursed; up to +15% on the price if a rule change blocks charging economics', '充电的附加费与全球调整费予以返还；若规则变更导致充电不经济，价格最高上调15%'], 'Exhibit S, s.1.6(c)'],
        [{ b: ['Tariffs', '关税'] }, ['A post-bid tariff raising capex over 10% re-opens the price; refusal ends the contract at no cost', '投标后新增关税使造价上升超过10%可重新议价；IESO拒绝则无成本终止合同'], 's.2.16'],
        [{ b: ['Tax credit', '税收抵免'] }, ['Clean Technology ITC excluded from the 50% clawback of new government support', '清洁技术投资税收抵免不受新增政府支持50%返还条款约束'], 's.2.15'],
      ] },
      { t: 'why', text: [
        'Three clauses make this an infrastructure contract rather than a capacity auction: the system operator is the counterparty for twenty years, the owner keeps the trading upside, and two of the risks a battery owner usually carries alone — new tariffs and a rule change that breaks charging economics — are shared.',
        '三项条款使其成为基础设施合同而非容量拍卖：系统运营商作为二十年交易对手，业主保留交易上行收益，且储能业主通常独自承担的两项风险 — 新增关税与破坏充电经济性的规则变更 — 由双方共担。',
      ], sig: [['Twenty-year counterparty', '二十年交易对手'], ['Two risks shared', '两项风险共担']] },
      { t: 'src', src: SRC.lt2Contract, use: ['Every clause above', '上述全部条款'] },
      { t: 'src', src: SRC.lt2Window2, use: ['What window 2 keeps and changes', '窗口2保留与调整的内容'] },
    ] },
  ] });

  // ---------------- Trading -------------------------------------------------
  SEC_B.energy = () => ({ head: ['Day-ahead trading — the line the owner keeps', '日前交易 — 业主保留的收入'], blocks: [
    { t: 'card', mt: false, title: ['The trading line, derived (gate ON-1)', '交易收入的推导（研究缺口ON-1）'], badges: ['official', 'calc'], live: false, blocks: [
      { t: 'table', head: [['Step', '步骤'], ['Arithmetic', '计算'], ['Result', '结果']], num: [2], rows: [
        [{ b: ['Eight-hour spread, 2026 window', '2026年窗口八小时价差'] }, ['Mean of 90 days: top-8 less bottom-8 hourly day-ahead zonal prices', '90天均值：日前分区电价最高8小时减最低8小时'], 'C$' + T.tb8PerDay + '/MW-day'],
        [{ b: ['Seasonal ratio', '季节比率'] }, ['Full-year over same-window mean on HOEP, 2023 and 2024', 'HOEP 2023与2024年全年均值除以同窗口均值'], String(T.seasonalRatio)],
        [{ b: ['Annual spread', '年度价差'] }, [T.tb8PerDay + ' × ' + T.seasonalRatio + ' × 365', T.tb8PerDay + ' × ' + T.seasonalRatio + ' × 365'], 'C$' + fmtN(T.tb8Annual)],
        [{ b: ['Trading line', '交易收入'] }, ['× 0.88 round-trip × 0.97 availability × 0.85 foresight', '× 0.88往返效率 × 0.97可用率 × 0.85预见性'], fmtC(E.merchGross)],
      ] },
      { t: 'why', text: [
        'This is the platform\'s PJM convention at eight hours. Two checks bracket it: a dispatch that charges before it discharges earns 8% less than the convention assumes, and HOEP\'s weakest full year, 2023, would put the line at ' + fmtCk(42689) + '. A full year of day-ahead prices replaces the seasonal scaling (gate ON-1b).',
        '这是本平台PJM惯例在八小时下的应用。两项校验为其划定区间：先充后放的调度比惯例假设少8%；按HOEP最弱的完整年份2023年计，交易收入为' + fmtCk(42689) + '。满一年的日前电价将取代季节缩放（研究缺口ON-1b）。',
      ], sig: [['Fair, not strong', '证据中等']] },
      { t: 'src', src: SRC.daZonalPrice, use: ['The 2026 window', '2026年观测窗口'] },
      { t: 'src', src: SRC.hoepYearly, use: ['The seasonal ratio and the low end', '季节比率与下限'] },
    ] },
    { t: 'card', title: ['Where the spread is', '价差的分布'], badges: ['official'], live: false, blocks: [
      { t: 'kpis', items: [
        ...T.zones.map(z => ({ l: z.name, v: 'C$' + z.tb8 + '<small>/MW-day</small>', d: [fmtPct((z.tb8 / T.tb8PerDay - 1) * 100, 1) + ' vs the province', '与全省相比' + fmtPct((z.tb8 / T.tb8PerDay - 1) * 100, 1)], b: ['official'] })),
        { l: ['Weekdays / weekends', '工作日/周末'], v: 'C$' + T.weekday + ' / ' + T.weekend, b: ['calc'] },
      ] },
      { t: 'why', text: [
        'Location moves the trading line by about a tenth and leaves the contract untouched, so it is worth about 3% of revenue either way. Weekends trade about 40% thinner, which is when the contract asks nothing.',
        '区位对交易收入的影响约为十分之一，对合同毫无影响，因此对总收入的影响约为正负3%。周末价差约薄40%，而合同在周末不提出任何要求。',
      ] },
      { t: 'src', src: SRC.daVirtualZonal, use: ['Spread by zone', '分区价差'] },
    ] },
  ] });

  // ---------------- Operating reserve ----------------------------------------
  SEC_B.services = () => ({ head: ['Operating reserve — not counted', '运行备用 — 不计入'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'kpis', items: [
        { l: ['10-minute spinning, 2024', '10分钟旋转备用（2024）'], v: 'C$' + T.reserve2024.spin10 + '<small>/MW-h</small>', b: ['official'] },
        { l: ['10-minute non-spinning', '10分钟非旋转备用'], v: 'C$' + T.reserve2024.nonSpin10 + '<small>/MW-h</small>', b: ['official'] },
        { l: ['30-minute', '30分钟备用'], v: 'C$' + T.reserve2024.r30 + '<small>/MW-h</small>', b: ['official'] },
      ] },
      { t: 'why', text: [
        'Reserve paid C$2–5 per MW-hour before Market Renewal. Selling 10-minute spinning reserve every hour of the year would be about C$40k per MW, and a battery that cycles eight hours a day cannot do that, so the line is zero and the upside is unpriced.',
        '电力市场改革前备用价格为每MW时2–5加元。全年每小时出售10分钟旋转备用约为每MW 4万加元，而每天循环八小时的储能无法做到，因此该收入项取零，上行空间不予计价。',
      ], sig: [['Upside, not modelled', '上行空间，不建模']] },
      { t: 'src', src: SRC.hoepYearly, use: ['Operating reserve prices, 2024', '2024年运行备用价格'] },
    ] },
  ] });

  // ---------------- Duration -------------------------------------------------
  SEC_B.duration = () => {
    const best = designBest('ca_on'), cap = routeFit('ca_on', 'cap');
    return { head: ['Duration — eight hours, and whether it holds for twenty years', '储能时长 — 八小时，以及能否维持二十年'], blocks: [
      { t: 'card', badges: ['calc'], live: false, blocks: [
        designLine('ca_on') ? { t: 'reco', b: ['What to build: ', '建设建议：'], text: designLine('ca_on') } : null,
        { t: 'kpis', items: [
          { l: ['Engine\'s best design', '引擎最佳设计'], v: best ? L(best.name) : '—', b: ['calc'] },
          { l: ['Contract route', '合同路径'], v: cap ? L(cap.span) : '—', d: ['durations the engine cannot separate', '引擎无法区分的时长区间'], b: ['calc'] },
        ] },
        { t: 'table', head: [['Duration', '时长'], ['Daily spread, C$/MW', '每日价差（加元/MW）'], ['Per MWh vs 8 h', '每MWh相对8小时']], num: [1, 2], rows:
          T.capture.map(c => [c.h + ' h', fmtN(Math.round(c.tb)), c.c.toFixed(3)]) },
        { t: 'why', text: [
          'Twelve hours earns two rated points in the procurement and 12% more trading than eight, for half as much again in batteries. Every window-1 winner built eight. The harder question is fade: payment follows tested capacity, and below 85% is a default, so an eight-hour build either oversizes, augments or cuts its contract by up to 7%.',
          '十二小时在采购中可得两个评分点，交易收入比八小时多12%，但电池多一半。窗口1全部中标方均建设八小时。更棘手的是衰减：付款随测试容量调整，低于85%即违约，因此八小时项目须超配、扩容或将合同容量削减最多7%。',
        ], sig: [['Every winner built eight', '所有中标方均为八小时'], ['Fade is the risk', '衰减才是风险']] },
        { t: 'src', src: SRC.daZonalPrice, use: ['Spread by duration', '按时长的价差'] },
        { t: 'src', src: SRC.lt2Rfp, use: ['The 8- and 12-hour rules', '八小时与十二小时规则'] },
      ] },
    ] };
  };

  // ---------------- Pipeline -------------------------------------------------
  SEC_B.pipeline = () => ({ head: ['Project pipeline — who won, and what they built', '项目管线 — 谁中标、建了什么'], blocks: [
    { t: 'card', mt: false, title: ['LT2 window 1 winners', 'LT2窗口1中标项目'], badges: ['official', 'project'], live: false, blocks: [
      { t: 'table', head: [['Project', '项目'], ['Owners', '业主'], ['Build', '规模'], ['C$/MW-BD', '加元/MW工作日']], num: [3],
        rows: K.winners.map(w => [{ b: w.name }, w.owner, w.build, w.price.toFixed(2)]) },
      { t: 'why', text: [
        'Every winner is half owned by a First Nation, and the procurement scored it. The owners are a provincial utility, an international independent and a Canadian developer group — the buyers a window-2 project would sell into or partner with.',
        '每个中标项目均有原住民持股一半，且采购对此评分。业主分别为省属电力公司、国际独立发电商与加拿大开发商团体 — 即窗口2项目的潜在买方或合作方。',
      ], sig: [['First Nation partners on every winner', '每个中标项目均有原住民合作方']] },
      { t: 'src', src: SRC.napaneeOpg, use: ['Napanee Phase 2', 'Napanee二期'] },
      { t: 'src', src: SRC.eagleLakeNeoen, use: ['Eagle Lake', 'Eagle Lake'] },
      { t: 'src', src: SRC.simcoeNrstor, use: ['Simcoe', 'Simcoe'] },
    ] },
    { t: 'card', title: ['Operating storage', '在运储能'], badges: ['project'], live: false, blocks: [
      { t: 'table', head: [['Plant', '电站'], ['Size', '规模'], ['In service', '投运'], ['Cost', '成本']], rows: [
        [{ b: ['Oneida', 'Oneida'] }, '250 MW / 1,000 MWh', 'May 2025', ['about C$700m, final', '约7亿加元（最终）']],
        [{ b: ['Napanee Phase 1', 'Napanee一期'] }, ['250 MW, 4 h', '250MW，4小时'], 'April 2026', ['within approved budget; amount not published', '在核定预算内；金额未公布']],
      ] },
      { t: 'src', src: SRC.oneidaCost, use: ['Oneida', 'Oneida'] },
      { t: 'src', src: SRC.aturaApproval, use: ['The 2023 storage awards', '2023年储能授标'] },
    ] },
  ] });

  // ---------------- Grid -----------------------------------------------------
  SEC_B.grid = () => ({ head: ['Grid connection — location prices the trading line, not the contract', '并网 — 区位影响交易收入，不影响合同'], blocks: [
    { t: 'card', mt: false, title: ['Interactive Ontario storage map', '安大略储能交互地图'], badges: ['official', 'public'], blocks: [
      { t: 'geo-grid-map', data: gridMapById('ca_on-grid-map') },
      { t: 'why', text: [
        'The winners sit in three different zones, from the widest spread in the East to the thinnest in the Northwest, and bid C$527 to C$614. Brownfield sites and spreads explain the order better than the contract does, because the contract pays the same everywhere.',
        '中标项目分布于三个不同区域，从价差最宽的东部到最薄的西北，报价527至614加元。棕地场址与价差比合同更能解释报价排序，因为合同在各地支付相同。',
      ] },
    ] },
    { t: 'congestion', data: congestionFor('ca_on') },
    { t: 'card', title: ['The transmission system', '输电系统'], badges: ['official'], live: false, blocks: [
      { t: 'p', text: [
        'IESO draws the IESO-controlled grid as 115, 230 and 500 kV lines, more than 30,000 km in all. Where window-2 capacity can connect is in IESO\'s preliminary connection guidance of 15 October 2026, not yet read into this dashboard (gate ON-5).',
        'IESO将其控制的电网描述为115、230与500kV线路，总长逾30,000公里。窗口2容量可在何处并网见IESO于2026年10月15日发布的初步并网指引，尚未纳入本看板（研究缺口ON-5）。',
      ] },
      { t: 'src', src: SRC.gridMap, use: ['Voltage levels and line length', '电压等级与线路长度'] },
      { t: 'src', src: SRC.connectionGuidance, use: ['Window 2 connection guidance', '窗口2并网指引'] },
    ] },
  ] });

  // ---------------- Portfolio ------------------------------------------------
  SEC_B.portfolio = () => {
    const inp = labInputs(), r = labModel(inp);
    const dn = labModel(inp, { spreadFactor: 0.6 });
    const line = designLine('ca_on');
    return {
      head: ['Portfolio / Fund View — an eight-hour LT2 bid', '组合与基金视图 — 八小时LT2投标'],
      cap: ['The Investment Lab\'s screening case taken through the gates an investment committee applies. It runs the Lab\'s own model on the Lab\'s inputs; the engine\'s case is on the Brief.',
            '投资测算筛选情景，按投委会适用的门槛顺序逐项演示。该情景以投资测算自身的模型与输入运行；引擎情景见要点页。'],
      blocks: [
        { t: 'card', mt: false, title: ['Screened opportunity — institutional screening snapshot', '所筛选机会 — 机构筛选快照'], badges: ['model'], live: false, blocks: [
          { t: 'kpis', items: [
            { l: ['Configuration', '配置'], v: fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d: [inp.hours + '-hour, LT2 window 2', inp.hours + '小时，LT2窗口2'] },
            { l: ['Target COD', '目标投运'], v: state.codYear, d: ['dilution factor ' + fmtPct(dilutionAt(+state.codYear) * 100, 0), '稀释系数' + fmtPct(dilutionAt(+state.codYear) * 100, 0)] },
            { l: ['Total capex', '总资本开支'], v: fmtCM(r.capex), d: ['less a 30% ITC of ' + fmtCM(r.grant), '扣除30%抵免' + fmtCM(r.grant)], b: ['model'] },
            { l: ['Year-1 contract', '第1年合同收入'], v: fmtCM(r.capRev), d: ['plus trading ' + fmtCM(r.arb1), '另加交易收入' + fmtCM(r.arb1)], b: ['calc'] },
            { l: ['Year-1 EBITDA', '第1年EBITDA'], v: fmtCM(r.ebitda1), d: ['unlevered IRR ' + fmtIRR(r.unlevIRR), '无杠杆IRR ' + fmtIRR(r.unlevIRR)], b: ['calc'] },
            { l: ['Min DSCR — trading −40%', '最低偿债覆盖率 — 交易−40%'], v: fmtX(dn.minDSCR), cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b: ['calc'] },
          ] },
          line ? { t: 'note', text: ['The Brief and the shortlist use the engine, not this Lab case. ' + line[0], '要点页与候选清单采用引擎而非本测算情景。' + line[1]] } : null,
          { t: 'ic', b: ['Screening conclusion: ', '筛选结论：'], text: [
            'An Ontario decision turns on three documents: a window-2 award at a price the capex supports, a supply contract that holds eight hours of tested capacity for twenty years, and confirmation that the build qualifies for the 30% tax credit. With those, two-thirds of revenue is a system-operator contract and lenders can size on it.',
            '安大略的投资决策取决于三份文件：报价可被造价支撑的窗口2中标、能在二十年内维持八小时测试容量的供货合同，以及项目符合30%税收抵免条件的确认。三者齐备后，三分之二的收入来自系统运营商合同，贷款人可据此测算。',
          ] },
        ] },
        { t: 'card', title: ['Investment Committee gates — what must be true before capital is released', '投委会门槛 — 资金拨付前必须成立的条件'], badges: ['calc'], live: false, blocks: [
          { t: 'gates', items: [
            { n: ['Gate 1 — A window-2 award', '门槛1 — 窗口2中标'], d: ['An executed LT2 contract at a price the capex and the trading case support.', '已签署的LT2合同，价格可由造价与交易收入支撑。'], c: 'critical', s: ['Two-thirds of revenue', '三分之二的收入'] },
            { n: ['Gate 2 — Duration held for the term', '门槛2 — 全期维持时长'], d: ['Oversizing, augmentation or the 7% reduction planned so tested capacity never falls below 85%.', '规划超配、扩容或7%削减，确保测试容量始终不低于85%。'], c: 'critical', s: ['Default, not discount', '违约而非扣款'] },
            { n: ['Gate 3 — The tax credit', '门槛3 — 税收抵免'], d: ['CT-ITC eligibility and the labour requirements confirmed; 30%, not 20%.', '确认清洁技术投资税收抵免资格与劳工要求；30%而非20%。'], c: 'serious', s: ['A tenth of capex', '约十分之一的造价'] },
            { n: ['Gate 4 — Trading at a full year', '门槛4 — 满一年的交易数据'], d: ['The trading line re-read on a full year of day-ahead prices before the bid is priced.', '投标定价前以满一年的日前电价复核交易收入。'], c: 'warn', s: ['Gate ON-1b', '研究缺口ON-1b'] },
            { n: ['Gate 5 — First Nation partnership', '门槛5 — 原住民合作'], d: ['Every window-1 winner was half First Nation-owned and the procurement scores it.', '窗口1所有中标项目均有原住民持股一半，且采购对此评分。'], c: 'good', s: ['Scored in the procurement', '采购评分项'] },
          ] },
        ] },
      ] };
  };

  // ---------------- Data & methodology ---------------------------------------
  SEC_B.data = () => ({ head: ['Data and methodology', '数据与方法'], blocks: [
    { t: 'card', mt: false, title: ['Open gates', '待关闭的研究缺口'], badges: ['official'], live: false, blocks: [
      { t: 'table', head: ['Gate', 'What it decides', 'What closes it'], rows: [
        [{ b: ['ON-1b', 'ON-1b'] }, ['The trading line', '交易收入'], ['A full year of day-ahead prices; IESO keeps 92 days, so the platform must accumulate them', '满一年的日前电价；IESO仅保留92天，平台须自行积累']],
        [{ b: ['ON-2', 'ON-2'] }, ['The window-2 price and size', '窗口2价格与规模'], ['IESO\'s final window-2 RFP', 'IESO最终版窗口2招标文件']],
        [{ b: ['ON-3', 'ON-3'] }, ['Opex for an eight-hour asset', '八小时资产的运维成本'], ['An Ontario operating benchmark', '安大略本地运维基准']],
        [{ b: ['ON-4', 'ON-4'] }, ['The 30% tax credit', '30%税收抵免'], ['The statute read and the eligible share confirmed', '核阅法条并确认合格比例']],
        [{ b: ['ON-5', 'ON-5'] }, ['Where window 2 can connect', '窗口2可并网位置'], ['IESO\'s 15 October 2026 connection guidance', 'IESO 2026年10月15日并网指引']],
        [{ b: ['ON-6', 'ON-6'] }, ['An eight-hour Ontario cost', '安大略八小时造价'], ['A disclosed cost for one of the winners', '中标项目之一公布造价']],
      ] },
      { t: 'src', src: SRC.lt2Page, use: ['The procurement page', '采购页面'] },
    ] },
    { t: 'card', title: ['Core formulas', '核心公式'], badges: ['calc'], live: false, blocks: [
      { t: 'table', head: [['Quantity', '指标'], ['Formula', '公式']], rows: [
        [{ b: ['Contract line', '合同收入'] }, 'C$563.48 × 251 Business Days = ' + fmtC(E.contracted) + '/MW/yr, flat for 20 years'],
        [{ b: ['Trading line', '交易收入'] }, '325.63 × 0.86719 × 365 × 0.88 × 0.97 × 0.85 = ' + fmtC(E.merchGross) + '/MW/yr'],
        [{ b: ['Capex', '资本开支'] }, '149.445 × 8,000 + 0.44 × 2,800,000 = ' + fmtC(Math.round(E.capexPerMW)) + '/MW; 30% ITC as a grant'],
        [{ b: ['Landed DC block', '到岸直流电池舱'] }, '(73.45 × 1.07 + 0.768 + 1.5) × 81.25/70 × 1.5923 = C$149.445/kWh'],
      ] },
      { t: 'src', src: SRC.customsTariff, use: ['Duty and surtax', '关税与附加税'] },
      { t: 'src', src: SRC.oneidaCost, use: ['The capex observation', '造价观测值'] },
      { t: 'src', src: SRC.cleanTechItc, use: ['The tax credit', '税收抵免'] },
    ] },
    { t: 'card', title: ['Bilingual glossary', '双语术语表'], badges: ['calc'], live: false, blocks: [
      { t: 'glossary' },
    ] },
  ] });

  return SECTIONS;
}
