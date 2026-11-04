/* Romania — the `benchmark` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.benchmark = function (){
  const P = M.peer;
  const plCapEurKW = P.cmPricePlnKW / P.fxPlnPerEur;               // PLN/kW → €/kW
  const plPerNameplate2h = plCapEurKW * P.derate[2] * 1000;        // €/MW/yr
  const roMerch2h = M.lab.spread * 2 * M.usableFraction * M.lab.cycles * 365 * (M.lab.avail / 100);
  return {
  head: ['Romania vs Poland — market design, revenue certainty and what transfers (context only)',
         '罗马尼亚与波兰对比 — 市场设计、收入确定性与可迁移结论（仅背景参考）'],
  cap: ['The only section in this dashboard that uses Polish data. Romania and Poland are neighbouring CEE markets with similar fundamentals — coal exit, rapid solar growth, rising volatility — that have made opposite choices on revenue certainty. Comparing them isolates what is genuinely Romanian. All Polish figures are held in a separate namespace and excluded from Romania\'s grades and verdicts.',
        '本看板中唯一使用波兰数据的章节。罗马尼亚与波兰是基本面相近的中东欧邻国 — 煤电退出、光伏快速增长、波动性上升 — 却在收入确定性上作出了相反选择。比较两者可分离出真正属于罗马尼亚特有的因素。所有波兰数值保存在独立命名空间，不计入罗马尼亚的评级与结论。'],
  blocks: [
    { t:'note', b:['Scope discipline: ','范围纪律：'],
      text:['Polish data (Jul 2026) never enters the Romanian price series, pipeline, balancing analysis or any scoring input. It is used here for one purpose: to calibrate whether a Romanian observation is a Romanian problem or a general CEE storage-market problem — and, specifically, to price what the absence of a capacity mechanism is worth.',
            '波兰数据（2026年7月）绝不进入罗马尼亚的价格序列、管线、平衡分析或任何评分输入。此处使用仅有一个目的：校准某一罗马尼亚观察结果究竟是罗马尼亚特有问题，还是中东欧储能市场的普遍问题 — 并具体地为“没有容量机制”这一事实定价。'] },

    { t:'card', mt:false, title:['Market design — the same asset earns differently in each market','市场设计 — 同一资产在两个市场的获利方式不同'], badges:['peer'], live:false, blocks:[
      { t:'table', head:[['Feature','特征'],['Romania','罗马尼亚'],['Poland','波兰']], rows:[
        [{b:['Market structure','市场结构']},
         ['Energy-only, EU-coupled day-ahead and intraday markets','单一电能量，与欧盟耦合的日前及日内市场'],
         ['Energy market plus a capacity market with long new-build contracts','电能量市场加上设有长期新建合同的容量市场']],
        [{b:['Capacity payment','容量付费']},
         [L(['None','无']), L(['None','无'])],
         ['≈' + fmtC(plCapEurKW) + '/kW de-rated/yr (' + fmtN(P.cmPricePlnKW) + ' PLN/kW), ' + P.cmAgreementYears + '-year new-build contracts','约' + fmtC(plCapEurKW) + '/kW折减/年（' + fmtN(P.cmPricePlnKW) + ' PLN/kW），新建合同' + P.cmAgreementYears + '年']],
        [{b:['Who sets the revenue floor','谁设定收入底线']},
         ['Nobody. Every euro of revenue is merchant or balancing.','无人设定。每一欧元收入均来自市场化或平衡市场。'],
         ['A capacity auction, per project, for ' + P.cmAgreementYears + ' years','由容量拍卖逐项目设定，期限' + P.cmAgreementYears + '年']],
        [{b:['State support','国家支持']},
         [fmtCM(O.schemeBudgetEurM * 1e6) + ' capital-grant scheme — reduces capital at risk', fmtCM(O.schemeBudgetEurM * 1e6) + '资本补贴计划 — 降低风险资本'],
         ['Capital support alongside capacity contracts — both channels available','资本支持与容量合同并行 — 两条通道同时可用']],
        [{b:['Merchant driver','市场化驱动']},
         ['Solar-driven midday trough and steep evening ramp','光伏驱动的午间低谷与陡峭晚间爬坡'],
         ['Coal-heavy stack (~' + P.coalSharePct + '%) plus rapid solar growth; ' + fmtN(P.negHours) + ' negative-price hours','高煤电占比（约' + P.coalSharePct + '%）加光伏快速增长；负电价' + fmtN(P.negHours) + '小时']],
        [{b:['Binding constraint','关键约束']},
         ['ATR and executed connection agreement','ATR与已签并网合同'],
         ['Connection refusals and grid capacity at the transmission operator','系统运营方的并网拒批与电网容量']],
        [{b:['Lender posture','贷款人态度']},
         ['Development-bank-led; commercial gearing constrained by the absence of a floor','以开发性银行为主；因缺乏保底，商业杠杆受限'],
         ['Capacity contract supports conventional project debt','容量合同可支撑常规项目融资']],
        [{b:['Dashboard use','看板用途']},
         ['Core Romania score and every other tab','罗马尼亚核心评分及其他所有页面'],
         ['This section only — context, never scored','仅本节 — 背景参考，不参与评分']],
      ] },
      { t:'why', text:['The decisive row is "who sets the revenue floor". Poland contracts a floor project by project for ' + P.cmAgreementYears + ' years, so Polish development is a bidding strategy and Polish debt is sized against a contract. Romania contracts nothing, so Romanian development is a permitting-and-connection strategy and Romanian debt is sized against a spread. Same fundamentals, opposite financing structures — which is why a Polish comparable tells you almost nothing useful about Romanian gearing.',
        '决定性的一行是“谁设定收入底线”。波兰逐项目签订' + P.cmAgreementYears + '年的保底合同，因此波兰的开发本质是投标策略，波兰的债务以合同为基础安排规模。罗马尼亚不签订任何合同，因此罗马尼亚的开发本质是许可与并网策略，其债务以价差为基础安排规模。基本面相同，融资结构相反 — 这正是波兰可比项目对罗马尼亚杠杆几乎没有参考价值的原因。'],
        sig:['RO: permitting · PL: bidding','罗马尼亚看许可·波兰看投标'] },
    ] },

    { t:'card', title:['Revenue certainty compared — what a capacity mechanism is worth','收入确定性对比 — 容量机制值多少'], badges:['illus','peer'], blocks:[
      { t:'kpis', items:[
        { l:['Romania — contracted revenue per nameplate MW','罗马尼亚 — 每铭牌MW合同化收入'], v:fmtC(0) + '<small>/MW/yr</small>', d:['no capacity mechanism exists','不存在容量机制'], b:['official'] },
        { l:['Poland — capacity revenue per nameplate MW (2h)','波兰 — 每铭牌MW容量收入（2小时）'], v:'≈' + fmtCk(plPerNameplate2h) + '<small>/MW/yr</small>', d:['≈' + fmtC(plCapEurKW) + '/kW × ' + fmtPct(P.derate[2] * 100, 0) + ' (peer namespace)','≈' + fmtC(plCapEurKW) + '/kW × ' + fmtPct(P.derate[2] * 100, 0) + '（同业命名空间）'], b:['peer'] },
        { l:['Romania — merchant revenue per nameplate MW (2h)','罗马尼亚 — 每铭牌MW市场化收入（2小时）'], v:'≈' + fmtCk(roMerch2h) + '<small>/MW/yr</small>', d:['gross, before optimiser fee and opex','毛值，未扣除优化商费用与运维'], b:['calc'] },
        { l:['Polish contracted share of a 2h stack','波兰2小时资产的合同化收入占比'], v:'≈' + fmtPct(plPerNameplate2h / (plPerNameplate2h + roMerch2h) * 100, 0), d:['illustrative, using a comparable merchant line','示例，采用可比的市场化收入线'], b:['illus'] },
      ] },
      { t:'bar', cfg:{ xs:[L(['RO — contracted','罗马尼亚 — 合同化']), L(['RO — merchant','罗马尼亚 — 市场化']), L(['PL — contracted','波兰 — 合同化']), L(['PL — merchant (comparable)','波兰 — 市场化（可比）'])],
        bw: 44, rotX: true, yfmt: v => fmtCk(v), labels: false, h: 260,
        series:[{ name:['€/MW/yr','€/MW/年'], color:'var(--s1)', vals:[0, roMerch2h, plPerNameplate2h, roMerch2h] }] } },
      { t:'cmp', items:[
        { h:['Romania — what a lender can size against','罗马尼亚 — 贷款人可据以安排规模的部分'], v:'0%', s:['gearing is constrained by the absence of any contracted line, not by the quality of the asset','杠杆受限于不存在任何合同化收入线，而非资产质量'] },
        { h:['Poland — what a lender can size against','波兰 — 贷款人可据以安排规模的部分'], v:'≈' + fmtPct(plPerNameplate2h / (plPerNameplate2h + roMerch2h) * 100, 0), s:['a ' + P.cmAgreementYears + '-year contract converts the same asset into conventional project finance','' + P.cmAgreementYears + '年合同使同一资产成为常规项目融资标的'] },
      ] },
      { t:'why', text:['This is the most decision-relevant comparison in either CEE dashboard. The same battery, in two neighbouring markets with similar price fundamentals, is a merchant asset on one side of the border and a contracted infrastructure asset on the other. The consequence is not a difference in returns — Romanian equity returns can be higher — but a difference in who can own it: Polish assets are accessible to conventional infrastructure debt and pension-backed buyers, Romanian assets are not until a bilateral floor is negotiated. Build the exit specification accordingly.',
        '这是两个中东欧看板中最具决策相关性的对比。同一台电池，在价格基本面相近的两个相邻市场中，边境这一侧是市场化资产，另一侧则是合同化基础设施资产。其后果并非收益率的差异 — 罗马尼亚的股权回报可能更高 — 而是“谁能持有它”的差异：波兰资产可为常规基础设施债务与养老金支持的买家所接受，罗马尼亚资产在谈成双边保底之前则不然。退出规格应据此设计。'],
        sig:['Same asset, different owner universe','同一资产，买家群体不同'] },
      { t:'src', src: SRC.pse, use:['Polish capacity market clearing, contract length and de-rating (peer namespace)','波兰容量市场出清、合同期限与折减（同业命名空间）'] },
    ] },

    { t:'g2', cards:[
      { title:['Scale and fundamentals — similar problem, different size','规模与基本面 — 问题相似，量级不同'], badges:['illus','peer'], blocks:[
        { t:'kpis', items:[
          { l:['Romania operating fleet','罗马尼亚在运机组'], v:fmtN(O.fleetMW) + '<small> MW</small>', d:[fmtN(O.fleetMWh) + ' MWh','' + fmtN(O.fleetMWh) + 'MWh'], b:['illus'] },
          { l:['Poland operating fleet','波兰在运机组'], v:fmtN(P.fleetMW) + '<small> MW</small>', d:[fmtN(P.fleetMWh) + ' MWh (peer namespace)','' + fmtN(P.fleetMWh) + 'MWh（同业命名空间）'], b:['peer'] },
          { l:['Poland BESS capacity contracted','波兰已签约储能容量'], v:fmt1(P.cmAwardedBessGW) + '<small> GW</small>', d:['awarded in capacity auctions','通过容量拍卖中标'], b:['peer'] },
          { l:['Poland connection pipeline','波兰并网管线'], v:fmt1(P.pipelineGW) + '<small> GW</small>', d:['constrained by connection refusals','受并网拒批约束'], b:['peer'] },
        ] },
        { t:'why', text:['Poland is three to four times Romania on operating storage and has already contracted roughly ' + fmt1(P.cmAwardedBessGW) + ' GW through capacity auctions, so the CEE learning curve on cost, EPC and grid-code compliance is being paid for by Polish volume. That transfers to Romania as cheaper procurement and a deeper contractor pool. What does not transfer is the reason Polish volume exists — a capacity contract that Romania has chosen not to offer.',
          '波兰的在运储能规模为罗马尼亚的三至四倍，且已通过容量拍卖签约约' + fmt1(P.cmAwardedBessGW) + 'GW，因此中东欧在成本、EPC与电网规范合规上的学习曲线由波兰的规模支付。这对罗马尼亚的迁移效应体现为采购更便宜、承包商资源池更深。不可迁移的是波兰规模得以形成的原因 — 一份罗马尼亚选择不提供的容量合同。'],
          sig:['Polish volume pays your learning curve','波兰的规模为你支付学习曲线'] },
      ] },
      { title:['Where the constraint sits in each market','各市场的约束所在'], badges:['illus','peer'], blocks:[
        { t:'table', head:[['Dimension','维度'],['Romania','罗马尼亚'],['Poland','波兰']], rows:[
          [{b:['Primary constraint','首要约束']}, ['ATR issuance and executed connection agreements','ATR签发与已签并网合同'], ['Connection refusals at the transmission operator','系统运营方的并网拒批']],
          [{b:['What it rations','其配给对象']}, ['Which projects can be built at all','哪些项目根本可以建成'], ['Which projects can bid into the capacity auction','哪些项目可参与容量拍卖投标']],
          [{b:['Consequence for value','对价值的影响']}, ['Connection rights are the scarce asset','并网权利是稀缺资产'], ['Connection rights plus auction strategy are the scarce assets','并网权利加投标策略共同构成稀缺资产']],
          [{b:['Negative-price exposure','负电价敞口']}, ['Rising fast from a low base','自低基数快速上升'], [fmtN(P.negHours) + ' hours — further along the same curve', fmtN(P.negHours) + '小时 — 处于同一曲线的更靠后位置']],
          [{b:['Coal in the stack','电源结构中的煤电']}, ['Retiring, with a committed exit direction','正在退役，退出方向已承诺'], ['≈' + P.coalSharePct + '% — retirement creates the capacity need the auction pays for','约' + P.coalSharePct + '% — 退役形成了容量拍卖所付费的容量需求']],
        ] },
        { t:'why', text:['Both markets ration by connection, but they ration toward different things. In Romania a connection right is the whole asset; in Poland it is the entry ticket to an auction that then determines value. That means Polish development risk is two-stage and Romanian development risk is one-stage but unhedged. For a Romanian sponsor the practical lesson is that the Polish second stage — a contracted floor — is exactly what a bilateral toll or floor would replicate, and it is worth paying real value for.',
          '两个市场均以并网作为配给手段，但配给指向不同。在罗马尼亚，并网权利即是全部资产；在波兰，它只是进入拍卖的入场券，而拍卖才决定价值。这意味着波兰的开发风险是两阶段的，罗马尼亚的开发风险是单阶段但无对冲的。对罗马尼亚发起人而言，实务教训是：波兰的第二阶段 — 合同化保底 — 正是双边代工或保底安排所能复制的，且值得为其支付实质对价。'],
          sig:['A bilateral floor replicates Poland’s stage two','双边保底可复制波兰的第二阶段'] },
      ] },
    ] },

    { t:'card', title:['What transfers from Poland to a Romanian decision — and what does not','哪些波兰结论可迁移至罗马尼亚决策 — 哪些不能'], badges:['calc','peer'], blocks:[
      { t:'table', head:[['Verdict','结论'],['Dimension','维度'],['Reasoning','理由']], rows:[
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Equipment, EPC and grid-code learning curve','设备、EPC与电网规范学习曲线']},
         ['Polish volume of roughly ' + fmt1(P.cmAwardedBessGW) + ' GW contracted sets CEE pricing and contractor availability that Romanian projects also draw on.','波兰约' + fmt1(P.cmAwardedBessGW) + 'GW的签约规模决定了中东欧的定价与承包商可获得性，罗马尼亚项目同样受益。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Solar saturation and negative-price trajectory','光伏饱和与负电价轨迹']},
         ['Poland is further along the same curve at ' + fmtN(P.negHours) + ' negative-price hours; its trajectory is a reasonable forward path for Romania.','波兰在同一曲线上更靠前，负电价达' + fmtN(P.negHours) + '小时；其轨迹可作为罗马尼亚的合理前瞻路径。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Coal-exit-driven flexibility need','煤电退出驱动的灵活性需求']},
         ['Both systems retire coal into a solar-heavy stack, which steepens ramps and re-widens spreads on a similar timetable.','两个系统均在高光伏占比的电源结构中退役煤电，使爬坡更陡并按相近时间表重新扩大价差。']],
        [{chip:'good', text:['Transfers','可迁移']}, {b:['Balancing-market saturation pattern','平衡市场饱和模式']},
         ['Capacity prices for fast reserve products decline as qualified supply grows — the same pattern observed in GB, Ireland and Poland.','随着合格供给增加，快速备用产品的容量价格下降 — 与英国、爱尔兰及波兰观察到的模式一致。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Revenue certainty and gearing','收入确定性与杠杆']},
         ['A ' + P.cmAgreementYears + '-year capacity contract underpins Polish project debt. Romania has no equivalent, so the same asset supports materially less leverage.','' + P.cmAgreementYears + '年容量合同支撑波兰的项目融资。罗马尼亚没有对应机制，因此同一资产可支撑的杠杆显著更低。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Duration economics','时长经济性']},
         ['Polish de-rating factors pay for hours (' + fmtPct(P.derate[2] * 100, 0) + ' at 2h rising to ' + fmtPct(P.derate[4] * 100, 0) + ' at 4h). In Romania duration must earn its capex from arbitrage and grant eligibility alone.','波兰的折减系数为小时数付费（2小时' + fmtPct(P.derate[2] * 100, 0) + '，4小时升至' + fmtPct(P.derate[4] * 100, 0) + '）。在罗马尼亚，时长必须仅靠套利与补贴资格偿付造价。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Development risk structure','开发风险结构']},
         ['Polish development is two-stage (connection, then auction). Romanian development is one-stage and unhedged, so failure modes and capital-at-risk profiles differ.','波兰的开发为两阶段（先并网、后拍卖）。罗马尼亚为单阶段且无对冲，因此失效模式与风险资本曲线均不相同。']],
        [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Buyer universe at exit','退出时的买家群体']},
         ['Polish contracted assets are accessible to conventional infrastructure and pension capital; Romanian merchant assets are not until a floor is negotiated.','波兰的合同化资产可为常规基础设施与养老金资本所接受；罗马尼亚的市场化资产在谈成保底之前则不然。']],
      ] },
      { t:'reco', b:['Comparison conclusion: ','对比结论：'],
        text:['Use Poland to calibrate cost, delivery capability, solar-saturation trajectory and balancing-market behaviour — the supply side and the physical side. Do not use it to calibrate revenue certainty, gearing, duration economics or exit pricing — the contractual side. A Polish comparable tells you what a CEE battery should cost and how the price shape will evolve; only the Romanian structure tells you how much of that revenue anyone will lend against.',
              '应以波兰校准成本、交付能力、光伏饱和轨迹与平衡市场行为 — 即供给侧与物理侧。不应以其校准收入确定性、杠杆、时长经济性或退出定价 — 即合同侧。波兰可比市场能说明中东欧电池应有的成本水平以及价格形态的演变方式；但只有罗马尼亚自身的结构能说明这些收入中有多少可供任何人放贷。'] },
      { t:'why', text:['This split is the operative rule for the whole section and it defines the boundary the dashboard enforces in code: Polish figures inform supply-side and physical assumptions and are excluded from every revenue and scoring input. The specific error this section exists to prevent is importing a Polish gearing assumption into a Romanian case — the asset looks the same, the price fundamentals are similar, and the financeable revenue is entirely different.',
        '这一划分是本节的可执行规则，同时界定了看板在代码层面强制执行的边界：波兰数值可用于供给侧与物理侧假设，并被排除于所有收入与评分输入之外。本节要防止的具体错误是将波兰的杠杆假设引入罗马尼亚方案 — 资产看似相同、价格基本面相近，而可融资收入却完全不同。'],
        sig:['Supply side yes, contractual side no','供给侧可用，合同侧不可用'] },
    ] },
  ] };
};
// ============================== PORTFOLIO / FUND VIEW ==============================

  return SEC_B.benchmark;
}
