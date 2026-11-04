/* Poland — the `story` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { buildPLPlanningBlocks } from '../planningSection.js';
import { buildPLEconomicsBlocks } from '../economicsSection.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.story = function (){
  return {
  head: ['Poland Market Evolution — from a coal capacity market to a storage capacity market',
         '波兰市场演进 — 从煤电容量市场到储能容量市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['verify','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Market design','市场设计'], v:L(['Energy + capacity market','电能量+容量市场']), d:['the only capacity mechanism in this CEE comparison','本中东欧对比中唯一的容量机制'], b:['official'] },
        { l:['Coal share of generation (seed)','煤电占发电量比重（种子）'], v:'~' + O.coalSharePct + '<small>%</small>', d:['retiring — which is what the capacity market pays to replace','正在退役 — 这正是容量市场付费替代的对象'], b:['illus'] },
        { l:['Negative-price hours 2025 (seed)','2025年负电价小时数（种子）'], v:'~' + fmtN(O.negHours) + '<small> h</small>', d:['from ~' + fmtN(M.negHoursSeriesY[0]) + ' h in 2023 — solar arriving fast','由2023年约' + fmtN(M.negHoursSeriesY[0]) + '小时上升 — 光伏快速到场'], b:['illus'] },
        { l:['Operating storage fleet (seed)','在运储能规模（种子）'], v:fmtN(O.fleetMW) + '<small> MW</small>', d:[fmtN(O.fleetMWh) + ' MWh','' + fmtN(O.fleetMWh) + 'MWh'], b:['illus'] },
        { l:['BESS capacity contracted (seed)','已签约储能容量（种子）'], v:fmt1(O.cmAwardedBessGW) + '<small> GW</small>', d:['storage is now the dominant new-entry technology','储能已成为主导性的新进入技术'], b:['verify'] },
        { l:['Connection pipeline (seed)','并网管线（种子）'], v:fmt1(O.pipelineGW) + '<small> GW</small>', d:['rationed by connection refusals','受并网拒批配给'], b:['illus'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['Poland built a capacity market to keep coal available and ended up using it to procure storage. That is the single most important fact for an investor: the mechanism was not designed for batteries, but batteries now win it, and the resulting long contract is what makes Polish storage conventionally financeable. The scarce resource is not capital or policy support — it is a connection that allows the project to certify and bid.',
              '波兰建立容量市场原本是为了保持煤电可用，最终却用它来采购储能。这是对投资人而言最重要的事实：该机制并非为电池设计，但电池如今在其中胜出，而由此产生的长期合同使波兰储能具备常规可融资性。稀缺资源既非资本也非政策支持 — 而是一份能让项目通过认证并参与投标的并网。'] },
      { t:'why', text:['Two facts do the work. Roughly ' + O.coalSharePct + '% coal in the stack is retiring, which is a quantified, contracted capacity need rather than a forecast — the auction pays for it every year. And ' + fmt1(O.cmAwardedBessGW) + ' GW of storage already contracted shows the mechanism works for batteries in practice, not just in theory. The Polish investment problem is therefore access, not thesis: the returns are available to whoever can connect and certify, and the connection queue is what decides who that is.',
        '此处两项事实最为关键。电源结构中约' + O.coalSharePct + '%的煤电正在退役，这是一项可量化、已合同化的容量需求而非预测 — 拍卖每年为其付费。而已签约' + fmt1(O.cmAwardedBessGW) + 'GW储能表明该机制对电池不仅在理论上、也在实践中有效。因此波兰的投资难题在于准入而非逻辑：收益属于能够并网并通过认证者，而并网队列决定了谁能做到。'],
        sig:['Access risk, not thesis risk','准入风险而非逻辑风险'] },
    ] },

    ...buildPLPlanningBlocks({ SRC }),

    ...buildPLEconomicsBlocks(),
    { t:'card', title:['How Poland arrived at a storage capacity market — four changes','波兰如何走向储能容量市场 — 四次变化'], badges:['verify','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['The Polish capacity market was designed for thermal plant and has been progressively re-pointed toward flexibility. Each re-pointing changed which technology could win without changing the mechanism’s name — which is exactly the pattern that strands designs built for the previous vintage. Record the auction vintage and correction-factor table in every model.',
              '波兰容量市场原为火电设计，此后逐步向灵活性资源重新定向。每次重新定向都在机制名称不变的情况下改变了哪种技术能够胜出 — 这正是使按上一版本设计的资产被搁浅的模式。应在每个模型中记录拍卖年份与折减系数表。'] },
      { t:'timeline', items:[
        { y:'2018–2021', t:['A capacity market built for coal','为煤电而建的容量市场'],
          p:['The mechanism was introduced to secure adequacy in a coal-dominated system, with multi-year contracts for new build and shorter contracts for existing plant. Storage was a marginal participant.',
             '该机制的引入是为了在以煤电为主的系统中保障充裕度，对新建机组给予多年期合同、对既有机组给予较短期限。储能当时只是边缘参与者。'],
          i:['The contract length that now makes storage financeable was designed to finance thermal plant. Investors inherit a structure built for a different technology — including obligations calibrated to plant that can run for days.',
             '如今使储能可融资的合同期限，最初是为火电融资而设计的。投资人继承的是为另一种技术构建的结构 — 包括按可连续运行数日的机组标定的义务条款。'] },
        { y:'2021–2023', t:['Emissions limits push coal out of the auction','排放限值将煤电挤出拍卖'],
          p:['EU emission-performance requirements progressively excluded the highest-emitting units from new capacity contracts, opening the auction to gas, demand response and storage.',
             '欧盟排放绩效要求逐步将高排放机组排除于新增容量合同之外，使拍卖向燃气、需求响应与储能开放。'],
          i:['This is the origin of the storage opportunity. The mechanism did not choose batteries; it excluded the incumbent and batteries were the cheapest qualifying new entrant.',
             '这正是储能机会的来源。该机制并未选择电池，而是排除了在位技术，而电池是最便宜的合资格新进入者。'] },
        { y:'2023–2025', t:['Storage becomes the dominant new entrant','储能成为主导性新进入者'],
          p:['Successive auctions contracted multiple gigawatts of battery capacity, making storage the leading new-build technology by contracted volume.',
             '连续几轮拍卖签约了数吉瓦电池容量，使储能按签约量成为领先的新建技术。'],
          i:['Once storage wins an auction at scale, the correction factor becomes the most consequential regulatory number in the market — it decides how much of each battery is paid, and it is revised between vintages.',
             '一旦储能在拍卖中规模化胜出，折减系数即成为市场中最具后果的监管数字 — 它决定每台电池获付费的比例，且在不同年份之间会被修订。'] },
        { y:'2024–2026', t:['Balancing reform and the solar collision','平衡市场改革与光伏冲击'],
          p:['The balancing market moved to 15-minute settlement with a redesigned dispatch and reserve framework, while solar growth pushed negative-price hours to roughly ' + fmtN(O.negHours) + ' a year.',
             '平衡市场转向15分钟结算并重新设计了调度与备用框架，同时光伏增长将负电价小时数推高至每年约' + fmtN(O.negHours) + '小时。'],
          i:['Two things happened at once: the merchant opportunity widened and the historical dataset became unusable. Any Polish backtest spanning the reform is measuring two different markets.',
             '两件事同时发生：市场化机会扩大，而历史数据集变得不可用。任何跨越该改革的波兰回测，实际上在衡量两个不同的市场。'] },
      ] },
      { t:'why', text:['Four changes in under a decade, and the mechanism’s name never changed. That is the base rate to underwrite against: expect the correction-factor table and the auction parameters to be revised between vintages, and expect each revision to favour the technology the system currently needs rather than the one that won last time. Two practical conclusions: record the vintage in every model, and treat the next parameter review as a scheduled event with a P&L consequence.',
        '不到十年内四次变化，而机制名称从未改变。这就是承销时应参照的基准频率：应预期折减系数表与拍卖参数在不同年份之间被修订，且每次修订都会有利于系统当前所需的技术，而非上一次胜出的技术。两项实务结论：在每个模型中记录版本；并将下一次参数审查视为具有损益后果的既定事件。'],
        sig:['Same mechanism, revised every vintage','机制不变，每一版本均被修订'] },
      { t:'g2', cards:[
        { title:['Capacity clearing price path (seed)','容量出清价轨迹（种子）'], badges:['verify'], blocks:[
          { t:'line', cfg:{ xs: M.cmYears, yfmt: v => fmtN(v), h: 200, ymin: 0,
            series:[{ name:['Clearing price (PLN/kW/yr)','出清价（PLN/kW/年）'], color:'var(--s1)', vals: M.cmPriceSeries }] } },
          { t:'why', text:['The seed path declines as more storage and demand response qualify — the ordinary consequence of a mechanism that has successfully attracted new entry. Two underwriting rules follow: model a declining price path rather than the last print, and remember that a ' + O.cmAgreementYears + '-year contract locks in whichever price you won, so the auction you enter determines the majority of lifetime contracted revenue.',
            '随着更多储能与需求响应取得资格，种子路径呈下降态势 — 这是机制成功吸引新进入者的通常后果。由此得出两条承销原则：应按下降的价格路径而非最近一次出清价建模；并须记住' + O.cmAgreementYears + '年合同锁定的是你中标时的价格，因此你参与的那次拍卖决定了终身合同化收入的大部分。'],
            sig:['One auction, seventeen years','一次拍卖，十七年'] },
        ] },
        { title:['Correction factors by duration','按时长的折减系数'], badges:['official'], blocks:[
          { t:'line', cfg:{ xs: M.derateHours.map(x => x + 'h'), yfmt: v => fmtPct(v * 100, 0), ymin: 0, h: 200,
            series:[{ name:['Correction factor','折减系数'], color:'var(--s1)', vals: M.derateHours.map(hh => M.deratingCurve[hh]) }] } },
          { t:'why', text:['The curve rises to 4 hours (' + fmtPct(M.deratingCurve[2] * 100, 1) + ' → ' + fmtPct(M.deratingCurve[4] * 100, 1) + ') and is flat after it (' + fmtPct(M.deratingCurve[6] * 100, 1) + ' at 6h, ' + fmtPct(M.deratingCurve[8] * 100, 1) + ' at 8h). The factor is the same for every duration; what rises is how much of the battery certifies, because certified capacity must be deliverable for four uninterrupted hours. The mechanism is telling you what it wants, four hours of firm energy, and it pays nothing for a fifth.',
            '曲线升至4小时（' + fmtPct(M.deratingCurve[2] * 100, 1) + '→' + fmtPct(M.deratingCurve[4] * 100, 1) + '），其后持平（6小时' + fmtPct(M.deratingCurve[6] * 100, 1) + '，8小时' + fmtPct(M.deratingCurve[8] * 100, 1) + '）。各时长适用同一折减系数；上升的是电池中可获认证的部分，因为认证容量必须能够连续四小时交付。该机制在明确表达其需求：四小时的可靠能量，且对第五小时不付任何费用。'],
            sig:['The mechanism asks for four hours','该机制要求四小时'] },
        ] },
      ] },
      { t:'src', src: SRC.pse, use:['Capacity auction results, contract lengths and contracted volumes','容量拍卖结果、合同期限与签约容量'] },
    ] },

    { t:'card', title:['The price shape — coal exit meets solar growth','价格形态 — 煤电退出遭遇光伏增长'], badges:['illus'], blocks:[
      { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtC(v), h: 230, ymin: 0,
        series:[
          { name:['Day-ahead average (€/MWh)','日前均价（€/MWh）'], color:'var(--s1)', vals: M.damSeries },
          { name:['Average daily spread (€/MWh)','日均价差（€/MWh）'], color:'var(--s3)', vals: M.spreadSeries },
        ] } },
      { t:'bar', cfg:{ xs: M.negHoursYears, bw: 46, yfmt: v => fmtN(v) + ' h', labels: true, h: 230,
        series:[{ name:['Negative-price hours','负电价小时数'], color:'var(--s6)', vals: M.negHoursSeriesY }] } },
      { t:'why', text:['Negative-price hours have gone from roughly ' + fmtN(M.negHoursSeriesY[0]) + ' to ' + fmtN(M.negHoursSeriesY[2]) + ' in two years and are still rising. For a storage investor that is the charging opportunity growing faster than the discharging opportunity, which widens the spread now. It is also the clearest signal that the merchant case is time-limited: the same solar that creates the trough will eventually be joined by the ' + fmt1(O.cmAwardedBessGW) + ' GW of contracted storage that fills it.',
        '负电价小时数在两年内由约' + fmtN(M.negHoursSeriesY[0]) + '增至' + fmtN(M.negHoursSeriesY[2]) + '，且仍在上升。对储能投资人而言，这意味着充电机会的增长快于放电机会，当下扩大了价差。它同时也是最清晰的信号，表明市场化逻辑具有时限性：创造低谷的同一批光伏，最终将与填补该低谷的' + fmt1(O.cmAwardedBessGW) + 'GW已签约储能同时存在。'],
        sig:['Charging opportunity grows faster','充电机会增长更快'] },
      { t:'src', src: SRC.tge, use:['Day-ahead and intraday price levels, spreads and negative-price intervals','日前与日内价格水平、价差及负电价时段'] },
    ] },

    { t:'card', title:['Who is building Polish storage — four strategies, one bottleneck','谁在建设波兰储能 — 四类策略，一个瓶颈'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['State-linked utility','国有关联公用事业'], n:['Incumbent generators replacing retiring coal','以储能替代退役煤电的在位发电企业'], met:'existing sites & connections',
          p:['Reuse retiring thermal sites, which already hold connection capacity and grid infrastructure. Structurally the fastest route past the binding constraint.',
             '复用退役火电场址，其已具备并网容量与电网基础设施。这是绕过关键约束在结构上最快的路径。'] },
        { type:['International IPP / infra fund','国际独立发电商与基础设施基金'], n:['Platform investors bidding into the capacity auction','参与容量拍卖投标的平台型投资人'], met:'contracted portfolios',
          p:['Acquire or develop for the auction and finance against the resulting long contract. Poland is one of the few CEE markets where this conventional model works.',
             '为拍卖而收购或开发，并以由此取得的长期合同进行融资。波兰是少数几个该常规模式行得通的中东欧市场之一。'] },
        { type:['Renewable developer co-locating','共址加建的新能源开发商'], n:['Solar and wind owners adding storage behind an existing connection','在既有并网点后加建储能的光伏与风电业主'], met:'shared connection',
          p:['Reuse an existing connection to bypass the queue and monetise the midday trough their own generation creates.',
             '复用既有并网点以绕开排队，并将自身发电所造成的午间低谷变现。'] },
        { type:['Trading house / optimiser','贸易机构与优化商'], n:['Route-to-market and balancing certification providers','售电路径与平衡市场认证提供方'], met:'fee + share',
          p:['Post-reform market access is a specialist function, and certification for reserve products is project-specific rather than automatic.',
             '改革后的市场准入属专业职能，且备用产品认证按项目取得，并非自动获得。'] },
      ] },
      { t:'note', text:['Concentration read: Poland is fragmented on ownership and concentrated on connection capacity. Whoever holds connection conditions at a location that can certify for the auction holds the scarce asset — which is why retiring thermal sites and existing renewable connections are structurally advantaged.',
        '集中度解读：波兰在所有权上分散，在并网容量上集中。谁在能够通过拍卖认证的位置持有并网条件，谁就持有稀缺资产 — 这正是退役火电场址与既有新能源并网点具备结构性优势的原因。'] },
      { t:'why', text:['For a new entrant this determines strategy before it determines price. The two structurally advantaged routes — a retiring thermal site and a co-located renewable connection — both work by reusing connection capacity that already exists. Greenfield development competes for the scarce resource directly and should be underwritten with development-stage return requirements, not infrastructure ones.',
        '对新进入者而言，这一点在决定价格之前先决定策略。两条具备结构性优势的路径 — 退役火电场址与共址新能源并网点 — 均通过复用既有并网容量实现。绿地开发则直接争夺稀缺资源，应按开发阶段而非基础设施的收益要求进行承销。'],
        sig:['Reuse a connection or price development risk','要么复用并网，要么为开发风险定价'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: auction position decides returns','近期展望 — 2026至2029：拍卖地位决定收益'], badges:['verify','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026–2027','2026–2027'], h:['Certification and auction cycle','认证与拍卖周期'], p:['Whether a project certifies and clears determines whether it has a ' + O.cmAgreementYears + '-year contract or a merchant asset. There is no partial outcome.','项目能否通过认证并出清，决定其拥有的是' + O.cmAgreementYears + '年合同还是市场化资产。不存在中间结果。'] },
          { yr:['2027–2028','2027–2028'], h:['Merchant spread peak','市场化价差高点'], p:['Solar saturation has widened the trough but the contracted storage cohort has not yet fully connected. Captured spread is at its highest in the model.','光伏饱和已加深低谷，而已签约储能批次尚未完全并网。模型中捕获价差处于最高水平。'] },
          { yr:['2028–2030','2028–2030'], h:['Contracted cohort arrives','已签约批次到场'], p:['The ' + fmt1(O.cmAwardedBessGW) + ' GW already contracted begins operating and captured spread falls from ' + fmtC(M.codCases[2028].central) + ' to ' + fmtC(M.codCases[2030].central) + '/MWh in the central case.','已签约的' + fmt1(O.cmAwardedBessGW) + 'GW开始运行，中性情景下捕获价差由' + fmtC(M.codCases[2028].central) + '降至' + fmtC(M.codCases[2030].central) + '/MWh。'] },
        ] },
        { t:'why', text:['In this window the merchant line falls and the contracted line does not — which is the whole argument for treating the auction as the investment decision rather than as a financing step. A project with a capacity contract has a defensible ' + O.cmAgreementYears + '-year base regardless of what the spread does; a project without one is fully exposed to a ' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '% captured-spread decline it cannot influence.',
          '在这一窗口内，市场化收入下降而合同化收入不变 — 这正是应将拍卖视为投资决策而非融资步骤的全部理由。持有容量合同的项目，无论价差如何变化，都拥有可辩护的' + O.cmAgreementYears + '年基础；而没有合同的项目则完全暴露于其无法影响的' + fmtPct((1 - M.codCases[2030].central / M.codCases[2028].central) * 100, 0) + '%捕获价差下滑。'],
          sig:['The auction is the investment decision','拍卖即是投资决策'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: obligation, replacement and the second window','长期展望 — 2030至2035：义务、置换与第二个窗口'], badges:['verify','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['Obligation years begin in earnest','义务年度正式开始'], p:['Contracted storage must actually deliver during system stress events. Assets sized for the correction factor but not for the obligation discover the difference.','已签约储能须在系统紧张事件中实际交付。按折减系数而非按义务定尺寸的资产将在此发现差异。'] },
          { yr:['2031–2033','2031–2033'], h:['Coal retirement accelerates','煤电退役加速'], p:['Removing firm capacity steepens ramps and re-widens the spread that the contracted cohort had compressed.','移除可靠容量使爬坡更陡，并重新扩大已签约批次此前压缩的价差。'] },
          { yr:['2033–2035','2033–2035'], h:['Augmentation and re-contracting','增容与重新签约'], p:['Early 2h assets face a correction-factor table that no longer supports them, while augmentation-ready 4h sites re-contract at a higher factor.','早期2小时资产面对不再支持其经济性的折减系数表，而具备增容条件的4小时场址可按更高系数重新签约。'] },
        ] },
        { t:'why', text:['The long-run risk in Poland is not price — it is the obligation. A ' + O.cmAgreementYears + '-year contract is a ' + O.cmAgreementYears + '-year commitment to deliver energy during stress events, and correction factors are revised while the obligation is not. An asset that is marginal on duration at award becomes progressively more exposed as it degrades. That is why the degradation covenant and the augmentation path are the two documents that protect long-run value here.',
          '波兰的长期风险不在价格，而在义务。' + O.cmAgreementYears + '年合同意味着' + O.cmAgreementYears + '年在紧张事件中交付能量的承诺，而折减系数会被修订、义务却不会。中标时时长处于边际的资产，将随衰减而暴露程度递增。这正是衰减契约与增容路径成为在此保护长期价值的两份关键文件的原因。'],
          sig:['Factors are revised; the obligation is not','系数会被修订，义务不会'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['Correction-factor revision','折减系数修订']},
         ['The factor decides how much of the asset is paid. A downward revision at the short end cuts capacity revenue with no physical change to the project.','该系数决定资产中获付费的比例。短时端的下调会在项目完全不变的情况下削减容量收入。'],
         ['Publication of the correction-factor table for the next auction','下一次拍卖折减系数表的发布']],
        [{b:['Connection refusal policy','并网拒批政策']},
         ['Connection conditions ration the market and gate the auction. Any change to issuance practice changes both the pipeline and the competitive field.','并网条件配给市场并决定拍卖准入。签发实践的任何变化都会同时改变管线与竞争格局。'],
         ['Any change to connection-condition issuance or refusal criteria','并网条件签发或拒批标准的任何变化']],
        [{b:['Capacity auction parameters and demand curve','容量拍卖参数与需求曲线']},
         ['The demand curve and eligibility rules determine the clearing price and which technologies compete. Both are set administratively each cycle.','需求曲线与资格规则决定出清价及参与竞争的技术类型。两者每个周期均由行政确定。'],
         ['Publication of auction parameters for the next delivery year','下一交付年度拍卖参数的发布']],
      ] },
      { t:'why', text:['All three are administrative variables set between auction vintages, none is diversifiable within Poland, and all three are decided before a project can respond. That is the argument for structuring rather than forecasting: a correction-factor sensitivity in the model, a connection long-stop tied to energisation, and an augmentation path that allows re-contracting at a higher factor together convert three unforecastable regulatory variables into three managed positions.',
        '三者均为在不同拍卖年份之间由行政确定的变量，在波兰境内均不可分散，且均在项目能够作出反应之前即已决定。这正是“以结构应对而非以预测应对”的理由：在模型中设置折减系数敏感性、将并网最终截止日挂钩送电、以及保留可按更高系数重新签约的增容路径，三者结合可将三个无法预测的监管变量转化为三项可管理的立场。'],
        sig:['Structure it, don’t forecast it','以结构应对，而非预测'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor’s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Capacity Market','容量市场'], ['How much of the asset does the contract pay for?','合同为资产的多少部分付费？'], 'capacity'],
        ['04', ['Wholesale & Intraday','批发与日内'], ['How much of the spread is executable?','价差中有多少可执行？'], 'energy'],
        ['05', ['Balancing & Reserves','平衡与备用'], ['Is post-reform data being used?','是否采用了改革后的数据？'], 'services'],
        ['06', ['Storage Duration','储能时长'], ['Does the design meet the obligation, not just the factor?','设计是否满足义务，而不仅是系数？'], 'duration'],
        ['07', ['Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid & Connection','并网'], ['Can the project connect and certify at all?','项目能否并网并通过认证？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== CAPACITY MARKET ==============================

  return SEC_B.story;
}
