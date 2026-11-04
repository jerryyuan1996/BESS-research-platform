// ============================== NEM vs WEM (peer benchmark) ==============================
// The only tab that uses peer-market data. It is held in a separate namespace and
// excluded from every NEM scoring input, exactly as Romania holds Poland.
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, M, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, labInputs } = api;
  const { O, P } = createShared(api);

  return function (){
    const inp = labInputs();
    /* WEM capacity revenue per nameplate MW, and the NEM merchant line on this
       dashboard's own seed, so the two bars are on the same basis. */
    const nemMerchPerMW = inp.hours * M.usableFraction * inp.cycles * 365 * (inp.avail / 100)
      * inp.spread * M.durSpreadFactor[4];
    const waContractedShare = P.rcmPricePerMW / (P.rcmPricePerMW + P.merchGross + P.services);
    return {
    head: ['NEM vs WEM — two Australian markets, opposite answers on capacity (context only)',
           'NEM与WEM对比 — 两个澳大利亚市场，对容量给出相反答案（仅背景参考）'],
    cap: ['The only section in this dashboard that uses Western Australian data. Both markets sit in one country under one federal energy policy, use the same equipment and the same contractors, and have made opposite choices on whether to pay for capacity. Comparing them isolates what is genuinely a NEM problem. All WEM figures are held in a separate namespace and excluded from the NEM\'s grades and verdicts.',
          '本看板中唯一使用西澳数据的章节。两个市场同处一国、同受一套联邦能源政策管辖、使用相同设备与承包商，却在“是否为容量付费”上作出了相反选择。比较两者可分离出真正属于NEM特有的问题。所有WEM数值保存在独立命名空间，不计入NEM的评级与结论。'],
    blocks: [
      { t:'note', b:['Scope discipline: ','范围纪律：'],
        text:['WEM data never enters the NEM price series, pipeline, FCAS analysis or any scoring input. It is used here for one purpose: to price what a capacity mechanism is worth, using the cleanest natural experiment available anywhere on this platform — the same technology, the same country, the same supply chain, and one market design difference.',
              'WEM数据绝不进入NEM的价格序列、管线、FCAS分析或任何评分输入。此处使用仅有一个目的：借助本平台所能提供的最干净的自然实验 — 相同技术、相同国家、相同供应链，仅市场设计一项不同 — 为“容量机制值多少”定价。'] },

      { t:'card', mt:false, title:['Market design — the same asset earns differently on each side of the country','市场设计 — 同一资产在国境两侧的获利方式不同'], badges:['peer'], live:false, blocks:[
        { t:'table', head:[['Feature','特征'],['NEM','NEM'],['WEM (peer namespace)','WEM（同业命名空间）']], rows:[
          [{b:['Market structure','市场结构']},
           ['Energy-only, five regions, five-minute dispatch and settlement','单一电能量，五个区域，五分钟调度与结算'],
           ['Energy market plus a Reserve Capacity Mechanism','电能量市场加备用容量机制']],
          [{b:['Capacity payment','容量付费']},
           [L(['None — and the Nelson Review kept it that way on ' + O.reviewDate,'无 — Nelson评估于' + O.reviewDate + '维持这一设计']), L(['None','无'])],
           ['≈' + fmtCk(P.rcmPricePerMW) + '/MW/yr on a ' + P.rcmElectionYears + '-year fixed-price election','约' + fmtCk(P.rcmPricePerMW) + '/MW/年，按' + P.rcmElectionYears + '年固定价选择权']],
          [{b:['Who sets the revenue floor','谁设定收入底线']},
           ['Nobody by default. A CIS collar or a virtual toll, both confidentially priced, if you win one.','默认无人设定。若能取得，则由CIS双向结构或虚拟租赁设定，而两者定价均保密。'],
           ['The Reserve Capacity Mechanism, administered and published, for every accredited facility','由备用容量机制设定，管理并公布，适用于所有获认定设施']],
          [{b:['How congestion is settled','拥塞如何结算']},
           ['In marginal loss factors and uncompensated curtailment — a charge on market revenue','以边际损耗系数与无补偿限电结算 — 属市场化收入上的费用'],
           [P.congestionInstrument[0], P.congestionInstrument[1]]],
          [{b:['Capital cost','资本成本']},
           [fmtC(O.gencost4h) + '/kWh at four hours (GenCost 2025-26)', fmtC(O.gencost4h) + '/kWh（四小时，GenCost 2025-26）'],
           ['≈' + fmtC(P.capexPerKWh) + '/kWh; capital cost runs about ' + P.capexPremiumPerKWPct + '% higher per kW than the NEM','约' + fmtC(P.capexPerKWh) + '/kWh；按每kW计，资本成本约比NEM高' + P.capexPremiumPerKWPct + '%']],
          [{b:['Archetype','原型配置']},
           [fmtN(inp.mw) + ' MW · ' + inp.hours + 'h, from CIS Tender 8', fmtN(inp.mw) + 'MW · ' + inp.hours + '小时，取自CIS第8轮'],
           [fmtN(P.archetypeMW) + ' MW · ' + P.archetypeHours + 'h, set by the capacity accreditation rules', fmtN(P.archetypeMW) + 'MW · ' + P.archetypeHours + '小时，由容量认定规则决定']],
          [{b:['Dashboard use','看板用途']},
           ['Core NEM score and every other tab','NEM核心评分及其他所有页面'],
           ['This section only — context, never scored','仅本节 — 背景参考，不参与评分']],
        ] },
        { t:'why', text:['The decisive row is capacity payment. Western Australia contracts ' + fmtCk(P.rcmPricePerMW) + '/MW/yr for ' + P.rcmElectionYears + ' years on published, administered terms; the NEM pays nothing for capacity and, after a full market settings review concluded on ' + O.reviewDate + ', will not start. Everything else in this table follows from that one difference — including the archetype, because a market that pays for capacity accredits duration and a market that does not lets arbitrage choose it.',
          '决定性的一行是容量付费。西澳按公开、受管制的条款签订' + P.rcmElectionYears + '年、' + fmtCk(P.rcmPricePerMW) + '/MW/年的容量合同；NEM完全不为容量付费，且在' + O.reviewDate + '完成的一次完整市场设计评估之后也不会开始。本表其余各行皆源自这一项差异 — 包括原型配置，因为为容量付费的市场会对时长进行认定，不付费的市场则任由套利来决定时长。'],
          sig:['One design difference explains the whole table','一项设计差异解释了整张表'] },
      ] },

      { t:'card', title:['Revenue certainty compared — what a capacity mechanism is worth','收入确定性对比 — 容量机制值多少'], badges:['illus','peer'], blocks:[
        { t:'kpis', items:[
          { l:['NEM — contracted revenue per nameplate MW','NEM — 每铭牌MW合同化收入'], v:fmtC(0) + '<small>/MW/yr</small>', d:['no capacity mechanism exists; comparison.js sets `contracted` to zero','不存在容量机制；comparison.js将contracted设为零'], b:['official'] },
          { l:['WEM — capacity revenue per nameplate MW','WEM — 每铭牌MW容量收入'], v:'≈' + fmtCk(P.rcmPricePerMW) + '<small>/MW/yr</small>', d:['on a ' + P.rcmElectionYears + '-year fixed-price election (peer namespace)','按' + P.rcmElectionYears + '年固定价选择权（同业命名空间）'], b:['peer'] },
          { l:['NEM — merchant revenue per nameplate MW','NEM — 每铭牌MW市场化收入'], v:'≈' + fmtCk(nemMerchPerMW) + '<small>/MW/yr</small>', d:['gross at ' + inp.hours + 'h, before optimiser fee, loss factors and opex','' + inp.hours + '小时口径毛值，未扣除优化商费用、损耗系数与运维'], b:['calc'] },
          { l:['WEM contracted share of the stack','WEM收入结构中的合同化占比'], v:'≈' + fmtPct(waContractedShare * 100, 0), d:['capacity as a share of capacity + merchant + services (peer namespace)','容量收入占“容量+市场化+服务”的比重（同业命名空间）'], b:['peer'] },
        ] },
        { t:'bar', cfg:{ xs:[L(['NEM — contracted','NEM — 合同化']), L(['NEM — merchant','NEM — 市场化']), L(['WEM — capacity','WEM — 容量']), L(['WEM — merchant','WEM — 市场化'])],
          bw: 44, rotX: true, yfmt: v => fmtCk(v), labels: false, h: 270,
          series:[{ name:['A$/MW/yr','A$/MW/年'], color:'var(--s1)', vals:[0, nemMerchPerMW, P.rcmPricePerMW, P.merchGross] }] } },
        { t:'cmp', items:[
          { h:['NEM — what a lender can size against by default','NEM — 默认情况下贷款人可据以安排规模的部分'], v:'0%', s:['gearing is constrained by the absence of any contracted line unless a CIS collar or a toll is secured','除非取得CIS双向结构或租赁，否则杠杆受限于不存在任何合同化收入线'] },
          { h:['WEM — what a lender can size against','WEM — 贷款人可据以安排规模的部分'], v:'≈' + fmtPct(waContractedShare * 100, 0), s:['an administered, published capacity price converts the same asset into conventional project finance','受管制且公开的容量价格使同一资产成为常规项目融资标的'] },
        ] },
        { t:'why', text:['This is the most decision-relevant comparison on the platform because it holds nearly everything constant. Same country, same currency, same equipment, same contractors, same federal climate policy. One market pays ' + fmtCk(P.rcmPricePerMW) + '/MW/yr for capacity on published terms and the other pays nothing. The consequence is not that NEM returns are lower — they can be higher — but that the NEM asset needs a confidentially priced private contract to reach the same buyer universe the WEM asset reaches by default.',
          '这是本平台最具决策相关性的对比，因为它几乎控制了所有其他变量。同一国家、同一货币、同一设备、同一批承包商、同一套联邦气候政策。一个市场按公开条款为容量支付' + fmtCk(P.rcmPricePerMW) + '/MW/年，另一个分文不付。其后果并非NEM回报更低 — 它可能更高 — 而是NEM资产需要一份定价保密的私人合同，才能触及WEM资产默认即可触及的买家群体。'],
          sig:['Same country, opposite financing structures','同一国家，相反的融资结构'] },
      ] },

      { t:'g2', cards:[
        { title:['Cost and scale — the NEM is cheaper and much larger','成本与规模 — NEM更便宜且大得多'], badges:['illus','peer'], blocks:[
          { t:'kpis', items:[
            { l:['NEM installed fleet','NEM在运机组'], v:fmtN(O.installedMW) + '<small> MW</small>', d:[fmtN(O.fleetMWh) + ' MWh at ' + fmt1(O.fleetHours) + ' h average','' + fmtN(O.fleetMWh) + 'MWh，平均' + fmt1(O.fleetHours) + '小时'], b:['official'] },
            { l:['NEM capital cost, 4h','NEM资本成本，4小时'], v:fmtC(O.gencost4h) + '<small>/kWh</small>', d:[fmtCM(O.gencost4h * 4 * 1000) + '/MW installed','安装成本' + fmtCM(O.gencost4h * 4 * 1000) + '/MW'], b:['official'] },
            { l:['WEM capital cost','WEM资本成本'], v:'≈' + fmtC(P.capexPerKWh) + '<small>/kWh</small>', d:[fmtCM(P.capexPerMW) + '/MW at ' + P.archetypeHours + ' h (peer namespace)','' + P.archetypeHours + '小时口径' + fmtCM(P.capexPerMW) + '/MW（同业命名空间）'], b:['peer'] },
            { l:['WEM capex premium per kW','WEM每kW造价溢价'], v:'≈' + P.capexPremiumPerKWPct + '<small>%</small>', d:['on a per-kW basis; the two dashboards\' own per-kWh figures give ' + fmtPct((P.capexPerKWh / O.gencost4h - 1) * 100, 0) + '%','按每kW口径；两个看板各自的每kWh数据则给出' + fmtPct((P.capexPerKWh / O.gencost4h - 1) * 100, 0) + '%'], b:['peer','verify'] },
          ] },
          { t:'note', text:['The two capex comparisons use different bases and both are shown rather than reconciled. The sourced statement is that WEM capital cost runs about ' + P.capexPremiumPerKWPct + '% higher per kW. This platform\'s own figures are ' + fmtC(P.capexPerKWh) + '/kWh for the WEM against ' + fmtC(O.gencost4h) + '/kWh for the NEM, which is ' + fmtPct((P.capexPerKWh / O.gencost4h - 1) * 100, 0) + '% on an energy basis. A per-kW comparison across a ' + P.archetypeHours + '-hour and a ' + M.lab.hours + '-hour archetype is not the same measurement as a per-kWh one, and neither figure is adjusted to match the other.',
            '两项造价对比使用不同口径，此处并列呈现而不作调和。有来源的表述是：按每kW计，WEM的资本成本约高出' + P.capexPremiumPerKWPct + '%。本平台自身的数据则为WEM ' + fmtC(P.capexPerKWh) + '/kWh对NEM ' + fmtC(O.gencost4h) + '/kWh，按能量口径为' + fmtPct((P.capexPerKWh / O.gencost4h - 1) * 100, 0) + '%。在' + P.archetypeHours + '小时与' + M.lab.hours + '小时两种原型之间作每kW对比，与作每kWh对比并非同一度量，且两个数字均未作相互调整。'] },
          { t:'why', text:['Scale and cost run the same way and reinforce each other. The NEM is the larger market by an order of magnitude and buys equipment more cheaply per kilowatt-hour, which is a genuine competitive advantage for a NEM project against a WEM one on the capital side. It does not survive contact with the revenue side: the WEM asset has a published capacity price and the NEM asset does not.',
            '规模与成本方向一致且相互强化。NEM是规模大一个数量级的市场，且每千瓦时的设备采购更便宜 — 在资本侧，这是NEM项目相对WEM项目的真实竞争优势。但它在收入侧无法存续：WEM资产拥有公开的容量价格，NEM资产没有。'],
            sig:['Cheaper capital, unpriced revenue','资本更便宜，收入无定价'] },
        ] },
        { title:['Where the constraint sits in each market','各市场的约束所在'], badges:['illus','peer'], blocks:[
          { t:'table', head:[['Dimension','维度'],['NEM','NEM'],['WEM','WEM']], rows:[
            [{b:['Primary constraint','首要约束']}, ['Merchant spread compression as the fleet grows','装机增长带来的市场化价差压缩'], ['Network Access Quantity headroom — foundation generators hold priority','网络接入量裕度 — 基础发电机组享有优先权']],
            [{b:['How congestion reaches the P&L','拥塞如何进入损益表']}, ['A loss-factor multiplier plus uncompensated curtailment on market revenue','损耗系数乘数加市场化收入上的无补偿限电'], ['Fewer Capacity Credits — the loss appears in the capacity payment, not the energy market','容量信用减少 — 损失体现在容量付费而非电能量市场']],
            [{b:['Is anyone compensated?','是否有人获得补偿？']}, ['No. No firm rights, and the Congestion Relief Market was recommended not to proceed.','否。不存在固定权利，且拥塞缓解市场已被建议不予推行。'], ['Not compensated either, but the loss is measured and administered rather than merely realised','同样无补偿，但损失是被计量与管理的，而非仅仅被动发生']],
            [{b:['What rations development','什么在配给开发']}, ['Offtake. Anyone can build; few can contract.','购电。人人可建，能签约者寥寥。'], ['Accreditation. Capacity Credits are the scarce asset.','认定。容量信用是稀缺资产。']],
            [{b:['Named relief','具名缓解工程']}, ['Project EnergyConnect full ' + O.pecMW + ' MW at ' + O.pecStage2Year + '; HumeLink ' + O.humelinkYear + '; VNI West slipped to ' + O.vniWestYear,'Project EnergyConnect完整' + O.pecMW + 'MW于' + O.pecStage2Year + '到位；HumeLink为' + O.humelinkYear + '年；VNI West推迟至' + O.vniWestYear + '年'], ['Clean Energy Link — East expected operational by end-2029','清洁能源联络线—东段预计2029年底投运']],
          ] },
          { t:'why', text:['Both markets ration, but they ration different things. The WEM rations accreditation, so a WEM developer\'s scarce asset is Capacity Credits and the diligence question is how many the facility will be assigned. The NEM rations offtake, so a NEM developer\'s scarce asset is a counterparty and the diligence question is who will write the contract. Neither is harder; they require different skills and different people, and a team that succeeded in one should not assume it can execute in the other.',
            '两个市场都在配给，但配给的对象不同。WEM配给的是认定，因此WEM开发商的稀缺资产是容量信用，尽调问题是该设施将获分配多少。NEM配给的是购电，因此NEM开发商的稀缺资产是交易对手，尽调问题是谁会签下这份合同。两者难度不分高下，但所需技能与人员不同 — 在一个市场成功的团队不应假设自己能在另一个市场执行。'],
            sig:['WEM rations accreditation; the NEM rations offtake','WEM配给认定，NEM配给购电'] },
        ] },
      ] },

      { t:'card', title:['What transfers from the WEM to a NEM decision — and what does not','哪些WEM结论可迁移至NEM决策 — 哪些不能'], badges:['calc','peer'], blocks:[
        { t:'table', head:[['Verdict','结论'],['Dimension','维度'],['Reasoning','理由']], rows:[
          [{chip:'good', text:['Transfers','可迁移']}, {b:['Equipment, EPC and grid-code capability','设备、EPC与电网规范能力']},
           ['One national supply chain, one contractor pool and one set of Australian standards serve both markets.','同一条全国供应链、同一批承包商与同一套澳大利亚标准同时服务两个市场。']],
          [{chip:'good', text:['Transfers','可迁移']}, {b:['Warranty envelopes and degradation experience','质保范围与衰减经验']},
           ['Australian warranties commonly guarantee 60–70% capacity retention, and the same OEMs supply both coasts.','澳大利亚质保通常保证60–70%的容量保持率，且同一批OEM供应东西两岸。']],
          [{chip:'good', text:['Transfers','可迁移']}, {b:['AEMO as operator and publisher','AEMO作为运营方与发布方']},
           ['AEMO runs both markets and publishes to a comparable standard, so data availability expectations carry across.','AEMO同时运营两个市场并以可比标准公布数据，因此对数据可得性的预期可以互通。']],
          [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Revenue certainty and gearing','收入确定性与杠杆']},
           ['A published capacity price underpins WEM project debt. The NEM has no equivalent, so the same asset supports materially less leverage without a private contract.','公开的容量价格支撑WEM的项目融资。NEM没有对应机制，因此在没有私人合同的情况下，同一资产可支撑的杠杆显著更低。']],
          [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Duration economics','时长经济性']},
           ['WEM accreditation rules push the archetype to ' + P.archetypeHours + ' hours. In the NEM duration is chosen by arbitrage, and the answer is ' + M.lab.hours + ' hours.','WEM的认定规则将原型推向' + P.archetypeHours + '小时。在NEM，时长由套利决定，答案是' + M.lab.hours + '小时。']],
          [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['How congestion is priced','拥塞如何定价']},
           ['The WEM settles it in capacity accreditation; the NEM settles it in loss factors and uncompensated curtailment. The same physical constraint hits a different line of the model.','WEM以容量认定结算，NEM以损耗系数与无补偿限电结算。同一物理约束落在模型的不同行上。']],
          [{chip:'critical', text:['Does not transfer','不可迁移']}, {b:['Development skill set','开发所需能力']},
           ['WEM development is an accreditation exercise; NEM development is an offtake negotiation with a short counterparty list.','WEM开发是一项认定工作；NEM开发是与少数对手方进行的购电谈判。']],
        ] },
        { t:'reco', b:['Comparison conclusion: ','对比结论：'],
          text:['Use the WEM to calibrate cost, delivery capability, warranty terms and operator behaviour — the supply side and the physical side. Do not use it to calibrate revenue certainty, gearing, duration economics or how congestion reaches the P&L — the design side. A WEM comparable tells you what an Australian battery should cost and who can build it; only the NEM structure tells you how much of that revenue anyone will lend against.',
                '应以WEM校准成本、交付能力、质保条款与运营方行为 — 即供给侧与物理侧。不应以其校准收入确定性、杠杆、时长经济性或拥塞如何进入损益表 — 即设计侧。WEM可比市场能说明澳大利亚电池应有的成本水平以及谁能建造它；但只有NEM自身的结构能说明这些收入中有多少可供任何人放贷。'] },
        { t:'why', text:['This split is the operative rule for the whole section and it defines the boundary the dashboard enforces in code: WEM figures inform supply-side and physical assumptions and are excluded from every revenue and scoring input. The specific error this section exists to prevent is importing a WEM gearing assumption into a NEM case — same country, same equipment, same operator, and an entirely different financeable revenue.',
          '这一划分是本节的可执行规则，同时界定了看板在代码层面强制执行的边界：WEM数值可用于供给侧与物理侧假设，并被排除于所有收入与评分输入之外。本节要防止的具体错误是将WEM的杠杆假设引入NEM方案 — 同一国家、同一设备、同一运营方，而可融资收入完全不同。'],
          sig:['Supply side yes, design side no','供给侧可用，设计侧不可用'] },
      ] },
    ] };
  };
}
