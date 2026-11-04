/* The map and the congestion register are joined to the market in
   gridMapRegistry.js and congestionRegistry.js, so they cannot disagree. Both
   are declared here, in the section that draws them, rather than in the
   dashboard chunk — which is why the map arrives when this tab is opened and
   not before. The registration is a side effect of importing gridMapData.js;
   overview.js imports it too, because the engine pairs the map with the
   overview on the story tab. */
import { createShared } from './shared.js';
import { gridMapById } from '../../gridMapRegistry.js';
import { congestionFor } from '../../congestionRegistry.js';
import '../gridMapData.js';   // side effect: registers this market's grid map

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, M, SRC, state, fmtN, fmtCk, fmtCM, fmtPct } = api;
  const { O } = createShared(api);

  return function (){
    return {
    head: ['Grid, MLF & Congestion — connecting is not the same as being allowed to export','并网、边际损耗与拥塞 — 并网不等于获准送出'],
    cap: ['NEM generators and storage hold no firm transmission rights. A constrained unit receives nothing, and the Congestion Relief Market that would have changed that was recommended not to proceed. What does reach the battery is a marginal loss factor — a permanent settlement multiplier, republished every ' + O.mlfResetDate + '.',
          'NEM的发电与储能不持有固定输电权。受约束机组得不到任何补偿，而本可改变这一状况的拥塞缓解市场已被建议不予推行。真正传导至储能的是边际损耗系数 — 一项每年' + O.mlfResetDate + '重新公布的永久性结算乘数。'],
    blocks: [
      { t:'card', mt:false, title:['Interactive NEM grid — past, current and planned','NEM电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
        { t:'geo-grid-map', data:gridMapById('nem-grid-map') },
        { t:'why', text:['The map is an orientation and evidence tool, not a headroom heatmap. Its most important contrast is between where generation now sits — inland renewable energy zones — and where load has always sat, on the coast. The wires in between were built to serve local demand rather than to export at scale, which is why utility-scale renewable curtailment passed ' + O.nemCurtailTWh + ' TWh in 2025, up more than ' + O.nemCurtailGrowthPct + '% year on year.',
          '该地图是方位与证据工具，而非可用容量热力图。其最重要的对比在于：发电如今位于何处 — 内陆可再生能源区 — 与负荷始终位于何处 — 沿海。中间的电网原本是为服务本地负荷而非大规模外送而建，这正是2025年公用事业级可再生能源限电量突破' + O.nemCurtailTWh + 'TWh、同比增长逾' + O.nemCurtailGrowthPct + '%的原因。'],
          sig:['Generation moved inland; the wires did not','发电移向内陆，电网没有'] },
        { t:'src', src: SRC.isp, use:['Transmission nodes, corridors and the 2026 optimal development path','输电节点、走廊及2026年最优发展路径'] },
        { t:'src', src: SRC.giscoBoundary, use:['Published country boundary used by the map','地图采用的公开国家边界'] },
      ] },

      { t:'congestion', data:congestionFor('nem') },

      { t:'card', title:['No firm access — the structural fact behind every constraint row','无固定接入权 — 每一条约束背后的结构性事实'], badges:['official'], live:false, blocks:[
        { t:'table', head:[['Question','问题'],['NEM answer','NEM的答案'],['Consequence for the model','对模型的影响']], rows:[
          [{b:['Does a connection grant a right to export?','并网是否赋予送出权利？']},
           ['No. Access can change whenever new generation, storage or network conditions do.','否。每当新增发电、储能或网络条件变化，接入条件即可能改变。'],
           ['Export volume is an assumption, not a contractual quantity. Model it with a range.','送出电量是假设而非合同数量。应以区间建模。']],
          [{b:['Is a constrained-off unit compensated?','受约束停机的机组是否获得补偿？']},
           ['No. Compensation exists only where AEMO directs a unit, for instance to hold a state of charge for system security.','否。仅在AEMO直接调度机组时才有补偿，例如要求为系统安全维持特定荷电状态。'],
           ['Curtailment is a revenue loss with no offsetting receipt. It belongs in the revenue haircut, not in an events table.','限电是没有任何抵偿收入的损失。它属于收入折减项，而非事件表。']],
          [{b:['Will that change?','这会改变吗？']},
           ['The AEMC\'s Congestion Relief Market was recommended not to proceed, and ministers noted that at the December 2025 ECMC.','AEMC提出的拥塞缓解市场已被建议不予推行，能源部长会议于2025年12月予以采纳。'],
           ['Do not carry an option on future congestion compensation. The reform was considered and declined.','不应持有未来拥塞补偿的期权。该改革已被审议并否决。']],
          [{b:['What does reach the asset?','真正传导至资产的是什么？']},
           ['A marginal loss factor: a settlement multiplier on every megawatt-hour at the connection point, republished every ' + O.mlfResetDate + '.','边际损耗系数：作用于并网点每一兆瓦时的结算乘数，每年' + O.mlfResetDate + '重新公布。'],
           ['A live annual variable on the revenue line, not a fixed discount agreed at financial close.','这是收入线上逐年变动的活变量，而非融资交割时锁定的固定折扣。']],
        ] },
        { t:'kpis', items:[
          { l:['Average MLF cost to NEM batteries','NEM储能平均MLF成本'], v:fmtCk(O.mlfCostPerMW) + '<small>/MW/yr</small>', d:['2024; some assets ' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '× higher','2024年；部分资产为该水平的' + O.mlfMultipleLo + '–' + O.mlfMultipleHi + '倍'], b:['tp'] },
          { l:['Network curtailment within the battery fleet','储能行业内网络限电量'], v:fmtN(O.fleetCurtailMWh) + '<small> MWh</small>', d:['2025, across the whole NEM battery fleet','2025年，覆盖全NEM储能机组'], b:['tp'] },
          { l:['NEM-wide renewable curtailment','全NEM可再生能源限电'], v:O.nemCurtailTWh + '<small>+ TWh</small>', d:['2025, up more than ' + O.nemCurtailGrowthPct + '% year on year','2025年，同比增长逾' + O.nemCurtailGrowthPct + '%'], b:['tp'] },
          { l:['Combined haircut in the comparison interface','对比接口中的合计折减'], v:fmtPct((1 - 0.95) * 100, 0), d:['loss factors plus curtailment, both on market revenue','损耗系数加限电，两者均作用于市场化收入'], b:['calc'] },
        ] },
        { t:'why', text:['This is the row that surprises investors from capacity-market jurisdictions. In GB, Ireland or Poland a network constraint is an event with a settlement consequence; in the NEM it is simply an absence of revenue. The AEMC has itself found that a battery relieving a constraint may be under-compensated for the role it plays, by being settled at the regional reference price. That finding was made, the remedy was designed, and it was recommended not to proceed. Underwrite accordingly.',
          '这是最令来自容量市场辖区的投资者意外的一行。在英国、爱尔兰或波兰，网络约束是一个带有结算后果的事件；在NEM，它只是收入的缺失。AEMC自身已认定：缓解约束的电池因按区域参考电价结算，可能就其所发挥的作用而获得不足的补偿。该认定已作出、补救方案已设计，但被建议不予推行。承销时应据此处理。'],
          sig:['The remedy was designed and declined','补救方案已设计，但被否决'] },
        { t:'src', src: SRC.aemc, use:['Congestion Relief Market recommendation and the ministerial response','拥塞缓解市场建议及部长级回应'] },
        { t:'src', src: SRC.mlf, use:['Connection-point loss factors, republished annually effective 1 July','并网点损耗系数，每年重新公布并于7月1日生效'] },
      ] },

      { t:'card', title:['The 2026 ISP optimal development path — planning scale','2026年ISP最优发展路径 — 规划规模'], badges:['official','forecast'], live:false, blocks:[
        { t:'kpis', items:[
          { l:['New transmission by 2050','2050年前新增输电线路'], v:fmtN(O.ispKm2050) + '<small> km</small>', d:['a ' + O.ispExtensionPct + '% extension of the existing ' + fmtN(O.ispExistingKm) + ' km network; ' + fmtN(O.ispKmPrev) + ' km in the 2024 ISP','在现有' + fmtN(O.ispExistingKm) + '公里电网基础上扩展' + O.ispExtensionPct + '%；2024年ISP为' + fmtN(O.ispKmPrev) + '公里'], b:['official'] },
          { l:['Upfront transmission capital','输电前期资本开支'], v:'A$' + O.ispTxCapexAbn + '<small>bn</small>', d:['of which A$' + O.ispTxCapexTo2050Abn + 'bn is recognised to 2050; saves consumers A$' + O.ispConsumerSavingAbn + 'bn against a no-transmission path','其中A$' + O.ispTxCapexTo2050Abn + '0亿计入2050年前；相较无输电投资路径为消费者节省A$' + O.ispConsumerSavingAbn + '0亿'], b:['official'] },
          { l:['Grid-scale storage needed by 2030','2030年前所需公用事业级储能'], v:O.ispStorage2030GW + '<small> GW</small>', d:[fmtN(O.queueGW) + ' GW already sits in the connections pipeline','并网队列中已有' + fmtN(O.queueGW) + 'GW'], b:['official'] },
          { l:['Storage in the 2050 path','2050年路径中的储能'], v:O.ispStorage2050GW + '<small> GW</small>', d:[O.ispShortMedGW + ' GW shallow and medium duration plus ' + O.ispLongGW + ' GW of deep storage','浅层与中时长' + O.ispShortMedGW + 'GW，另有深度储能' + O.ispLongGW + 'GW'], b:['official'] },
          { l:['NEM consumption, now → 2050','NEM用电量，当前→2050'], v:fmtN(O.ispConsumptionNowTWh) + ' → ' + fmtN(O.ispConsumption2050TWh) + '<small> TWh</small>', d:['capacity roughly triples, ' + O.ispCapacityNowGW + ' GW to ' + O.ispCapacity2050GW + ' GW','装机容量约增至三倍，由' + O.ispCapacityNowGW + 'GW增至' + O.ispCapacity2050GW + 'GW'], b:['official'] },
        ] },
        { t:'bar', cfg:{
          xs: M.ispClasses.filter(k => ['committed','anticipated','actionable','future'].includes(k.id)).map(k => L(k.n)),
          bw: 58, yfmt: v => fmtN(v) + ' km', labels: true,
          series: [{ name: ['Step Change route km by ISP status class','按ISP状态分类的阶跃变革情景线路公里数'], color: 'var(--s6)',
            vals: [O.ispKmCommitted, O.ispKmAnticipated, O.ispKmActionable, O.ispKmFuture] }], h: 230 } },
        { t:'cap', text:['More than half the ' + fmtN(O.ispKm2050) + ' km is already committed or anticipated. Actionable build fell from 3,675 km in the 2024 ISP to ' + fmtN(O.ispKmActionable) + ' km and future build from 1,712 km to ' + O.ispKmFuture + ' km — mostly because projects graduated into the committed and anticipated classes, not because less network is needed. A further ' + fmtN(O.ispConnectionAssetKm) + ' km of generator connection assets sits outside this total.',
          '' + fmtN(O.ispKm2050) + '公里中已有过半属于已承诺或预期项目。可行动项目建设量由2024年ISP的3,675公里降至' + fmtN(O.ispKmActionable) + '公里，未来项目由1,712公里降至' + O.ispKmFuture + '公里 — 主要原因是项目升级进入已承诺与预期类别，而非所需电网减少。此外还有' + fmtN(O.ispConnectionAssetKm) + '公里的发电侧并网资产不计入该总量。'] },
        { t:'why', text:['Read the shape of this chart before any single project. The ' + O.ispKmActionable + ' km of actionable build is what the 2026 ISP is asking proponents to start now, and it is less than half the 2024 figure — so the volume of *newly instructed* transmission has fallen sharply even though the 2050 requirement barely moved. For a battery that cuts both ways. Less new instruction means fewer construction-cost shocks and less competition for contractors; it also means the relief a congested node is waiting for is more likely to already be in a class where the date is real, or in a future class where it is a decade away. The ' + O.ispStorage2030GW + ' GW-by-2030 storage requirement against ' + fmtN(O.queueGW) + ' GW already queued is the same message from the generation side: the system-level need is met on paper, so nothing about being in the pipeline is scarce.',
          '在看任何单个项目之前，先看这张图的形态。' + O.ispKmActionable + '公里的可行动建设量是2026年ISP要求发起人立即启动的部分，不到2024年数字的一半 — 因此尽管2050年需求几乎未变，*新下达指令*的输电量已大幅下降。对储能而言，这有两面性。新指令减少意味着施工成本冲击更少、承包商竞争更弱；同时也意味着拥塞节点所等待的缓解措施，要么已进入日期可信的类别，要么处于十年之后的未来类别。2030年前需要' + O.ispStorage2030GW + 'GW储能而队列中已有' + fmtN(O.queueGW) + 'GW，这从电源侧传递了同样的信息：系统层面的需求在纸面上已被满足，因此"身处管线之中"本身并不稀缺。'],
          sig:['Instruction volume halved; the 2050 need did not','指令量减半，2050年需求未减'] },
        { t:'src', src: SRC.isp, use:['Optimal development path, planning scale and horizon figures','最优发展路径、规划规模及展望期数值'] },
        { t:'src', src: SRC.ispA5, use:['Step Change route kilometres by status class and the change against the 2024 ISP','按状态分类的阶跃变革情景线路公里数及相对2024年ISP的变化'] },
      ] },

      { t:'card', title:['The ISP register, project by project — what each status class actually commits','ISP项目登记表 — 各状态类别究竟承诺了什么'], badges:['official','forecast'], live:false, blocks:[
        { t:'table', head:[['Project','工程'],['Region','区域'],['Delivery body','交付主体'],['ISP class','ISP类别'],['Scope','范围'],['MW','MW'],['A$m','A$百万'],['Year','年份'],['Status','状态']], num:[5,6,7], rows:
          M.ispProjects.map(x => {
            const k = M.ispClasses.find(c => c.id === x.cls);
            return [{ b:x.n }, [x.region, x.region], [x.operator, x.operator], { chip:k.c, text:k.n }, x.scope,
                    x.mw == null ? null : fmtN(x.mw), x.capexAM == null ? null : fmtN(x.capexAM),
                    x.earliest ? String(x.year) + ' (≥' + x.earliest + ')' : String(x.year), x.status];
          }) },
        { t:'cap', text:['Every network investment on the optimal development path, in AEMO\'s own status classes: ' + O.ispCommittedAnticipatedCount + ' committed or anticipated, ' + O.ispActionableCount + ' actionable, ' + O.ispFutureCount + ' future and 2 distribution. That is ' + M.ispProjects.length + ' rows for ' + (M.ispProjects.length - 1) + ' projects, because VNI West is one project whose two components were split in this ISP: the South West NSW REZ scope proceeds under NSW legislation and the interconnector scope under the National Electricity Rules. Cost is the A5 reported estimate in A$ million ($2025) and is blank for committed and anticipated projects, which sit outside the ISP cost-benefit analysis. "≥" marks an earliest in-service date published separately from the proponent-advised year.',
          '最优发展路径上的每一项网络投资，按AEMO自身的状态分类：已承诺或预期' + O.ispCommittedAnticipatedCount + '项、可行动' + O.ispActionableCount + '项、未来' + O.ispFutureCount + '项、配电2项。' + (M.ispProjects.length - 1) + '个项目对应' + M.ispProjects.length + '行，因为VNI West虽为单一项目，但其两个组成部分在本次ISP中被拆分：新州西南REZ部分依新州立法推进，互联线部分依《国家电力规则》推进。成本为附录A5报告的估算值（A$百万，2025年价），已承诺与预期项目不填列，因其不纳入ISP成本效益分析。"≥"表示与发起人建议年份分开公布的最早投运日期。'] },
        { t:'table', head:[['ISP status class','ISP状态类别'],['What AEMO means by it','AEMO的定义']], rows:
          M.ispClasses.map(k => [{ chip:k.c, text:k.n }, k.d]) },
        { t:'warn', text:['"Actionable" is the class most often misread in a teaser. It is an instruction to a network business to begin a regulatory investment test — not a funded project, not a construction start and not a date. Seven of the ' + O.ispActionableCount + ' are newly actionable in this ISP and must begin that test now; only the other five are already being assessed or have been.',
          '"可行动"是推介材料中最常被误读的类别。它是要求电网企业启动输电监管投资测试的指令 — 既非已获资金的项目，也非开工，更非确定日期。' + O.ispActionableCount + '项中有7项是本次ISP新增的可行动项目，须立即启动该测试；仅其余5项正在评估或已完成评估。'] },
        { t:'why', text:['Three rows carry most of the underwriting information. Project EnergyConnect is the market\'s reminder that a delivered project can still be a late one: Stage 1 energised in ' + O.pecStage1Done + ' at ' + O.pecStage1MW + ' MW, but the full ' + O.pecMW + ' MW does not arrive until ' + O.pecStage2Year + ', roughly a year later than first planned. VNI West moved from ' + O.vniWestWasYear + ' to ' + O.vniWestYear + ' on a ' + fmtCM(O.vniWestAbn * 1e9) + ' project, and in this ISP its two halves were split apart into different regulatory regimes. And QNI Connect went the other way entirely — an actionable project in the 2024 ISP whose identified need was deferred almost a decade to the mid-2040s, because AEMO reduced assumed coal flexibility and counted newly committed batteries. Nothing physical failed; the need was recalculated. That is the rule the register teaches: believe a date once construction has started and the delivery partners are contracted, and treat every earlier class as an option that AEMO can reprice at the next ISP.',
          '三行承载了大部分承销信息。Project EnergyConnect提醒市场：已交付的项目仍可能是延期项目 — 一期于' + O.pecStage1Done + '以' + O.pecStage1MW + 'MW送电，但完整的' + O.pecMW + 'MW要到' + O.pecStage2Year + '才到位，比最初计划晚约一年。VNI West这一' + fmtCM(O.vniWestAbn * 1e9) + '的工程由' + O.vniWestWasYear + '年推迟至' + O.vniWestYear + '年，且在本次ISP中其两个部分被拆分至不同监管制度之下。QNI Connect则完全相反 — 它在2024年ISP中属可行动项目，而其识别需求被推迟近十年至2040年代中期，原因是AEMO下调了燃煤机组的假定灵活性并计入了新承诺的电池。没有任何实体环节失败；只是需求被重新计算。这正是本登记表所揭示的规则：当工程已开工且交付合作方已签约时采信其日期，并将此前的每一个类别都视为AEMO可在下一次ISP中重新定价的期权。'],
          sig:['A need can be recalculated away','需求可能被重新计算掉'] },
        { t:'src', src: SRC.ispA5, use:['Project scope, status class, reported cost and proponent-advised timing for every project','各项目的范围、状态类别、报告成本及发起人建议时点'] },
        { t:'src', src: SRC.pec, use:['SA–NSW interconnector scope and staged energisation','南澳—新南威尔士互联线范围及分期送电情况'] },
        { t:'src', src: SRC.humelink, use:['500 kV route, length and completion','500千伏路径、长度及完工时间'] },
        { t:'src', src: SRC.cwo, use:['REZ network capacity and commissioning year','可再生能源区网络容量及投运年份'] },
        { t:'src', src: SRC.aer, use:['Approved transmission capex, including Marinus Link Stage 1','已核准输电资本开支，含Marinus Link一期'] },
      ] },

      { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
        { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
          [{b:['Marginal loss factor declines after financial close','融资交割后边际损耗系数下降']},
           ['Price adjustment tied to the published loss factor at the connection point, with a floor below which the seller carries the difference','以并网点公布的损耗系数为准设置价款调整，并设下限，低于下限部分由卖方承担'],
           ['Any acquisition priced off a regional average rather than the node','任何以区域平均值而非节点数据定价的收购']],
          [{b:['Uncompensated curtailment above the modelled level','无补偿限电超出模型水平']},
           ['Earn-out or deferred consideration linked to a measured first-year export volume','与实测第一年送出电量挂钩的对赌或递延对价'],
           ['A site in western NSW or north-west Victoria, where curtailment concentrates','位于新南威尔士西部或维多利亚西北部等限电集中地区的场址']],
          [{b:['Commissioning hold points delay full output','调试节点延迟满出力'],},
           ['Long-stop tied to unrestricted operation, not to mechanical completion, with per-day liquidated damages','将最终截止日挂钩无限制运行而非机械完工，并设按日违约金'],
           ['Any model that starts revenue at practical completion','任何以实质完工作为收入起点的模型']],
          [{b:['Generator performance standards renegotiated','发电机组性能标准被重新协商']},
           ['Condition precedent on accepted standards, with a price adjustment if the accepted envelope is narrower than assumed','以性能标准获接受为先决条件，若接受的范围窄于假设则调整价款'],
           ['Standards still in negotiation at signing','签约时性能标准仍在协商中']],
          [{b:['Relief arrives and the congestion thesis expires','缓解到位，拥塞投资逻辑失效']},
           ['Do not underwrite a congestion-driven charging advantage beyond the named relief date','不得将拥塞带来的低价充电优势承销至具名缓解日期之后'],
           ['A case relying on constraint-driven cheap charging','任何依赖约束所造成低价充电的投资逻辑']],
        ] },
        { t:'why', text:['Four of the five protections price a variable rather than allocate a permit risk, which is the correct emphasis for a market whose connection process works. The fifth is the one most often missed and it runs the other way: South Australia\'s congestion thesis is not permanent, but neither has it expired. Project EnergyConnect Stage 1 delivered only ' + O.pecStage1MW + ' MW of the eventual ' + O.pecMW + ' MW, and Stage 2 is not in service until ' + O.pecStage2Year + '. So the underwritable date is Stage 2, not the headline that the interconnector "is built" — and a case that assumes relief has already arrived is as wrong as one that assumes it never will.',
          '五项保护中有四项是为变量定价而非分配许可风险 — 对一个并网流程运作良好的市场而言，这是正确的侧重。第五项最常被遗漏，且方向相反：南澳的拥塞投资逻辑并非永久成立，但也尚未失效。Project EnergyConnect一期仅交付了最终' + O.pecMW + 'MW中的' + O.pecStage1MW + 'MW，二期要到' + O.pecStage2Year + '才投运。因此可承销的日期是二期，而非"互联线已建成"这一标题 — 假定缓解已经到位的方案，与假定其永不到来的方案同样错误。'],
          sig:['The underwritable date is Stage 2','可承销的日期是二期'] },
      ] },
    ] };
  };
}
