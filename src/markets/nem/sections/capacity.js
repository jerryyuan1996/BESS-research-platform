// ============================== CAPACITY INVESTMENT SCHEME ==============================
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, SRC, state, fmtN, fmt1, fmtCk, fmtPct } = api;
  const { O } = createShared(api);

  return function (){
    return {
    head: ['Capacity Investment Scheme — a collar, not a capacity payment','容量投资计划 — 双向保底—分成结构，而非容量付费'],
    cap: ['The NEM has no capacity mechanism and the Nelson Review kept it that way. This tab therefore analyses the Commonwealth underwriting scheme that stands in its place — what it pays, what it takes back, what it never publishes, and what happens when it winds up in ' + O.cisWindUp + '.',
          'NEM没有容量机制，Nelson评估亦维持这一设计。因此本页分析取而代之的联邦承销计划 — 它支付什么、收回什么、从不公布什么，以及它在' + O.cisWindUp + '年结束后会发生什么。'],
    blocks: [
      { t:'card', mt:false, title:['The support stack — and what each layer does not do','支持体系 — 以及各层次的作用边界'], badges:['official','policy'], live:false, blocks:[
        { t:'table', head:[['Layer','层次'],['What it provides','提供什么'],['What it does NOT provide','不提供什么']], rows:[
          [{b:['Capacity mechanism','容量机制']},
           ['—','—'],
           ['Does not exist in the NEM, and the Nelson Review kept the energy-only model on ' + O.reviewDate,'NEM中不存在；Nelson评估于' + O.reviewDate + '保留了单一电能量模式']],
          [{b:['Capacity Investment Scheme','容量投资计划']},
           ['A two-sided collar: ' + O.cisFloorSharePct + '% of the shortfall below an agreed annual revenue floor, over a ' + O.cisTermMinYr + '–' + O.cisTermMaxYr + ' year term','双向结构：补足低于约定年度收入下限部分的' + O.cisFloorSharePct + '%，期限' + O.cisTermMinYr + '–' + O.cisTermMaxYr + '年'],
           ['No published price, no availability payment, and no capital grant — the scheme displaced grants rather than joining them','无公布价格、无可用性付费、无资本补贴 — 该计划取代而非叠加于补贴之上']],
          [{b:['NSW LTESA','新南威尔士LTESA']},
           ['An option to draw an annuity, exercisable annually with ' + O.ltesaNoticeMonthsMin + '–' + O.ltesaNoticeMonthsMax + ' months\' notice, up to ' + O.ltesaMaxYears + ' years for batteries','按年行使的年金提取选择权，须提前' + O.ltesaNoticeMonthsMin + '–' + O.ltesaNoticeMonthsMax + '个月通知，储能最长' + O.ltesaMaxYears + '年'],
           ['Not a contract for difference and not a toll. It does not oblige the developer to draw, and it does not oblige the state to top up beyond the cap','并非差价合约，也非租赁。它既不强制开发商提取，也不要求州政府在上限之外补足']],
          [{b:['Virtual toll','虚拟租赁']},
           ['A bilateral transfer of dispatch rights and market risk to an offtaker, 12–15 years of observed precedent','将调度权与市场风险双边转移给承购方，已观察到的先例期限为12–15年'],
           ['No price has ever been disclosed for any Australian BESS toll, so there is no benchmark to negotiate against','澳大利亚从未披露过任何储能租赁价格，因此不存在可供谈判参照的基准']],
          [{b:['Electricity Services Entry Mechanism','电力服务准入机制']},
           ['Auctions for standardised tradable derivatives — bulk clean energy, shaping and firming. Draft legislation ' + O.esemDraftDate + '; first round indicatively ' + O.esemStart,'对标准化可交易衍生品进行拍卖 — 批量清洁电力、调形与调峰。立法草案于2026年9月14日发布；首轮采购暂定于2027年底'],
           ['Does not exist yet. Its product specifications are not published, so no NEM battery can currently be underwritten against it','尚不存在。其产品规格未公布，因此目前没有任何NEM电池可据以承销']],
        ] },
        { t:'why', text:['Read down the right-hand column and the NEM underwriting frame is complete: there is exactly one operating route to a contracted revenue line, it is competitively bid, its price is confidential, and it closes in ' + O.cisWindUp + '. Everything else is either bilateral with a handful of counterparties or does not exist yet. That is why the first question on a NEM project is which route it is on, and the second is what happens if that route fails.',
          '通读右栏，NEM的承销框架即告完整：通往合同化收入线的在运路径恰好只有一条，它需竞争性投标、价格保密，且将于' + O.cisWindUp + '年关闭。其余选项要么是仅有少数对手方的双边安排，要么尚不存在。这正是NEM项目的第一个问题是“走哪条路径”、第二个问题是“若该路径失败会怎样”的原因。'],
          sig:['One operating route, and it closes in ' + O.cisWindUp,'仅一条在运路径，且' + O.cisWindUp + '年关闭'] },
      ] },

      { t:'card', title:['How a CIS agreement actually pays','CIS协议的实际支付机制'], badges:['official'], live:true, blocks:[
        { t:'flow', items:[
          ['Revenue below the floor','收入低于保底价'], ['Commonwealth pays ' + O.cisFloorSharePct + '% of the shortfall','联邦政府补足缺口的' + O.cisFloorSharePct + '%'],
          ['Between floor and ceiling','介于保底价与上限之间'], ['Project keeps 100%','项目保留100%'],
          ['Above the ceiling','高于上限'], ['Commonwealth takes ' + O.cisCeilingSharePct + '%','联邦政府分成' + O.cisCeilingSharePct + '%'],
        ], sep:'→' },
        { t:'kpis', items:[
          { l:['Shortfall share paid below the floor','保底价以下的补足比例'], v:O.cisFloorSharePct + '<small>%</small>', d:['owner receipts while the floor binds are ' + fmt1(O.cisFloorSharePct / 100) + ' × floor + ' + fmtPct(100 - O.cisFloorSharePct, 0) + ' of market revenue','保底生效期间业主收入为' + fmt1(O.cisFloorSharePct / 100) + '×保底价 + 市场化收入的' + fmtPct(100 - O.cisFloorSharePct, 0)], b:['official'] },
          { l:['Revenue share taken above the ceiling','上限以上的分成比例'], v:O.cisCeilingSharePct + '<small>%</small>', d:['the upside is capped, which is what makes it a collar','上行同样被限制 — 这正是其成为双向结构的原因'], b:['official'] },
          { l:['Agreement term','协议期限'], v:O.cisTermMinYr + '–' + O.cisTermMaxYr + '<small> yr</small>', d:['biddable, so the awarded term is not published either','属可投标变量，因此实际授予期限亦不公开'], b:['official'] },
          { l:['Published floor, ceiling or annual payment cap','已公布的保底价、上限或年度支付上限'], v:L(['None','无']), d:['bidder-submitted and commercial-in-confidence for every project','由投标人提交，各项目均属商业机密'], b:['verify'] },
        ] },
        { t:'warn', text:['A CIS agreement is not a fixed payment and modelling it as one needs saying out loud. The linearisation this platform uses — a fixed payment plus a ' + fmtPct(100 - O.cisFloorSharePct, 0) + ' retention of market revenue — is exact only while the floor binds. If merchant revenue recovers past the floor, retention steps to 100% and the fixed component disappears. At today\'s merchant levels the floor does bind, which is precisely why the approximation is currently safe and will not stay that way.',
          'CIS协议并非固定付费，将其按固定付费建模这一点必须明说。本平台采用的线性化处理 — 固定付费加上市场化收入的' + fmtPct(100 - O.cisFloorSharePct, 0) + '留存 — 仅在保底生效期间精确成立。若市场化收入回升至保底价之上，留存比例将跃升至100%，固定部分随之消失。按当前市场化收入水平保底确实生效，这正是该近似目前安全、但不会一直安全的原因。'] },
        { t:'why', text:['The collar shape matters more than the level for a credit committee. A floor protects debt service in the years that would otherwise break it; a ceiling gives away exactly the years that would have repaid equity early. So a CIS agreement moves the asset from an equity story to a debt story, and a sponsor who wanted the upside has bought the wrong instrument. Decide which side of that trade you are on before bidding the floor, because the floor is what you bid and the ceiling is what you accept.',
          '对信贷委员会而言，结构形态比水平更重要。保底保护的是本来会击穿偿债的年份；上限让渡的恰恰是本可提前偿还股权的年份。因此CIS协议把资产从股权故事转变为债权故事 — 想要上行空间的发起人买错了工具。应在投标保底价之前确定自己处于这笔交易的哪一侧，因为保底价是你投的，上限是你接受的。'],
          sig:['A collar turns equity upside into debt capacity','双向结构把股权上行换成债务容量'] },
        { t:'src', src: SRC.cis, use:['Scheme mechanics, tender volumes and closing dates','计划机制、招标容量及截标日期'] },
      ] },

      { t:'card', title:['Tender record — volumes are published, prices are not','招标记录 — 容量公布，价格不公布'], badges:['official'], live:true, blocks:[
        { t:'table', head:[['Round','轮次'],['Awarded MW','中标MW'],['Awarded MWh','中标MWh'],['Projects','项目数'],['Price','价格']], num:[1,2,3], rows:[
          [{b:['Tender 3 — December 2024','第3轮 — 2024年12月']}, fmtN(O.t3MW), fmtN(O.t3MWh), String(O.t3Projects) + ' (' + O.t3FourHourProjects + ' four-hour)',
           {chip:'critical', text:['Not published','未公布']}],
          [{b:['Tender 8 — 24 June 2026','第8轮 — 2026年6月24日']}, fmtN(O.t8MW), fmtN(O.t8MWh), String(O.t8Projects) + ' standalone lithium-ion',
           {chip:'critical', text:['Not published','未公布']}],
          [{b:['Tender 10 — bids close ' + O.t10Close,'第10轮 — ' + O.t10Close + '截标']}, fmtN(O.t10MW), fmtN(O.t10MWh), L(['reported final dispatchable round','据报为最后一轮可调度电源招标']),
           {chip:'critical', text:['Will not be published','将不会公布']}],
        ] },
        { t:'kpis', items:[
          { l:['Tender 3 bids received','第3轮收到的投标'], v:fmtN(O.t3Bids), d:['offering roughly ' + fmtN(O.t3BidMW / 1000) + ' GW and ' + fmtN(O.t3BidMWh / 1000) + ' GWh against a ' + fmtN(O.t3TargetMW / 1000) + ' GW target','合计约' + fmtN(O.t3BidMW / 1000) + 'GW与' + fmtN(O.t3BidMWh / 1000) + 'GWh，而目标为' + fmtN(O.t3TargetMW / 1000) + 'GW'], b:['official'] },
          { l:['Tender 3 oversubscription','第3轮超额认购倍数'], v:fmt1(O.t3BidMW / O.t3TargetMW) + '<small>×</small>', d:['on power — competition sets the floor, and competition is intense','按功率计 — 竞争决定保底水平，而竞争十分激烈'], b:['calc'] },
          { l:['Tender 8 average project size','第8轮平均项目规模'], v:fmtN(O.t8MW / O.t8Projects) + '<small> MW</small>', d:[fmt1(O.t8MWh / O.t8MW) + ' h average duration across ' + O.t8Projects + ' projects','' + O.t8Projects + '个项目的平均时长为' + fmt1(O.t8MWh / O.t8MW) + '小时'], b:['calc'] },
          { l:['Awarded capacity at FID before Tender 3','第3轮之前中标容量的最终投资决策比例'], v:O.preT3FidPct + '<small>%</small>', d:['an award is not a project — this is the delivery discount','中标不等于项目 — 这是交付折减'], cls:'down', b:['official'] },
        ] },
        { t:'why', text:['Two readings, and they point in opposite directions. Tender 3 was oversubscribed roughly ' + fmt1(O.t3BidMW / O.t3TargetMW) + '× on power, which tells you the awarded floors were bid down hard and are lower than a developer would like — competition, not generosity, sets this price. But only ' + O.preT3FidPct + '% of battery capacity awarded before Tender 3 had reached FID at that time, which tells you an award is a licence to try. Both readings belong in the same model: a low floor you might not reach.',
          '有两种解读，且方向相反。第3轮按功率计超额认购约' + fmt1(O.t3BidMW / O.t3TargetMW) + '倍，说明中标保底价被激烈压低，低于开发商所期望的水平 — 决定这一价格的是竞争而非慷慨。但第3轮之前中标的储能容量中，当时仅' + O.preT3FidPct + '%达到最终投资决策，说明中标只是获得尝试的许可。两种解读应同时进入模型：一个你未必能兑现的、较低的保底价。'],
          sig:['A hard-bid floor you may never reach','一个被激烈压低、且你未必能兑现的保底价'] },
      ] },

      { t:'card', title:['The NSW alternative — an LTESA is an option, not a contract for difference','新南威尔士的替代方案 — LTESA是选择权，而非差价合约'], badges:['official','policy'], live:true, blocks:[
        { t:'table', head:[['Feature','特征'],['CIS agreement','CIS协议'],['NSW LTESA','新南威尔士LTESA']], rows:[
          [{b:['Instrument','工具类型']},
           ['A two-sided collar on annual revenue','对年度收入的双向保底—分成结构'],
           ['An option to draw an annuity, exercised annually','按年行使的年金提取选择权']],
          [{b:['Who decides each year','每年由谁决定']},
           ['Nobody — the collar applies automatically','无人决定 — 双向结构自动适用'],
           ['The developer, with ' + O.ltesaNoticeMonthsMin + '–' + O.ltesaNoticeMonthsMax + ' months\' notice, so it can opt out of high-merchant years','开发商决定，须提前' + O.ltesaNoticeMonthsMin + '–' + O.ltesaNoticeMonthsMax + '个月通知，因而可在市场化收入高的年份放弃行使']],
          [{b:['Payment formula','支付公式']},
           [O.cisFloorSharePct + '% of the shortfall below the floor', '补足低于保底价部分的' + O.cisFloorSharePct + '%'],
           ['The lesser of the bid annuity cap, or the cap minus ' + O.ltesaClawbackPct + '% of revenue above a net revenue threshold','取以下两者较低者：投标年金上限，或年金上限减去超出净收入门槛部分的' + O.ltesaClawbackPct + '%']],
          [{b:['Maximum term','最长期限']},
           [O.cisTermMinYr + '–' + O.cisTermMaxYr + ' years, biddable', O.cisTermMinYr + '–' + O.cisTermMaxYr + '年，可投标'],
           ['Up to ' + O.ltesaMaxYears + ' years for batteries','储能最长' + O.ltesaMaxYears + '年']],
          [{b:['Geography','适用范围']},
           ['NEM-wide, Commonwealth','全NEM，联邦层级'],
           ['New South Wales only','仅新南威尔士']],
          [{b:['Price disclosure','价格披露']},
           [L(['None','无']), L(['None','无'])],
           ['Average annuity caps are published by round: ' + fmtCk(O.ltesaR5CapMW) + ' in Round 5, ' + fmtCk(O.ltesaR6CapMW) + ' in Round 6','按轮次公布平均年金上限：第5轮' + fmtCk(O.ltesaR5CapMW) + '，第6轮' + fmtCk(O.ltesaR6CapMW)]],
        ] },
        { t:'kpis', items:[
          { l:['LTESA Round 5 average annuity cap','LTESA第5轮平均年金上限'], v:'≈' + fmtCk(O.ltesaR5CapMW) + '<small>/MW/yr</small>', d:['the highest published Australian long-term storage price of any kind','这是澳大利亚已公布的任何类型长期储能价格中的最高值'], b:['official'] },
          { l:['LTESA Round 6 average annuity cap','LTESA第6轮平均年金上限'], v:'≈' + fmtCk(O.ltesaR6CapMW) + '<small>/MW/yr</small>', d:[fmtPct((O.ltesaR6CapMW / O.ltesaR5CapMW - 1) * 100, 0) + ' in a single round','单轮变动' + fmtPct((O.ltesaR6CapMW / O.ltesaR5CapMW - 1) * 100, 0)], cls:'down', b:['official'] },
          { l:['Clawback above the net revenue threshold','超出净收入门槛部分的回收比例'], v:O.ltesaClawbackPct + '<small>%</small>', d:['which is why the annuity cap is a ceiling, not an expectation','这正是年金上限属天花板而非预期值的原因'], b:['official'] },
          { l:['Optionality value','选择权价值'], v:L(['Materially positive','显著为正']), d:['the developer opts out of high-merchant years; a CIS ceiling cannot','开发商可在市场化收入高的年份放弃行使；CIS的上限则无法回避'], b:['calc'] },
        ] },
        { t:'why', text:['The LTESA is the more valuable instrument per dollar of stated cap, and the reason is structural: the developer chooses each year whether to exercise, so it keeps the upside a CIS ceiling gives away. The offsetting fact is the price. The Round 6 average cap of ' + fmtCk(O.ltesaR6CapMW) + '/MW/yr is ' + fmtPct((O.ltesaR6CapMW / O.ltesaR5CapMW - 1) * 100, 0) + ' on Round 5 in one round — the state is buying the same product much more cheaply because more bidders need it. Use the Round 6 cap as the ceiling on any toll negotiation in the same region: a private counterparty cannot rationally pay above what the state clears at.',
          '按每一元标称上限计，LTESA是更有价值的工具，原因是结构性的：开发商每年自行选择是否行使，因而保留了CIS上限所让渡的上行空间。与之相抵的是价格。第6轮平均上限' + fmtCk(O.ltesaR6CapMW) + '/MW/年较第5轮单轮变动' + fmtPct((O.ltesaR6CapMW / O.ltesaR5CapMW - 1) * 100, 0) + ' — 州政府以低得多的价格买到同样的产品，因为需要它的投标人更多了。应将第6轮上限作为同一区域内任何租赁谈判的天花板：私营对手方不可能理性地支付高于州政府出清水平的价格。'],
          sig:['The state\'s cap is the ceiling on any private toll','州政府的上限即任何私营租赁的天花板'] },
        { t:'src', src: SRC.ltesa, use:['LTESA structure, battery terms and published round annuity caps','LTESA结构、储能条款及各轮公布的年金上限'] },
      ] },

      { t:'card', title:['What is not published, and what this dashboard does instead','哪些未公布，以及本看板如何处理'], badges:['verify'], live:false, blocks:[
        { t:'ladder', items:[
          { n:['1 · Scheme exists','1 · 计划存在'], d:['A budget and a tender calendar exist. This tells you the Commonwealth intends to underwrite storage; it tells you nothing about your project.','预算与招标日程已存在。这说明联邦政府有意为储能承销，但与你的项目无关。'] },
          { n:['2 · Tender opened','2 · 招标开放'], d:['Volumes, eligibility and closing dates are published. Model against these, not against the announcement.','容量、资格与截标日期已公布。应据此建模，而非依据公告。'] },
          { n:['3 · Bid submitted','3 · 已投标'], d:['Still not evidence. Tender 3 drew ' + O.t3Bids + ' bids offering roughly ' + fmt1(O.t3BidMW / O.t3TargetMW) + '× the target.','仍不构成证据。第3轮收到' + O.t3Bids + '份投标，合计约为目标的' + fmt1(O.t3BidMW / O.t3TargetMW) + '倍。'] },
          { n:['4 · Award announced','4 · 中标公告'], d:['Project, MW, MWh and state are published. Floor, ceiling, payment cap and term are not — and never will be for this scheme.','项目、MW、MWh与所在州已公布。保底价、上限、支付上限与期限则不公布 — 且本计划永远不会公布。'] },
          { n:['5 · Agreement executed and FID taken','5 · 协议签署并作出最终投资决策'], d:['The only tier at which a contracted revenue line may enter a base case. Only ' + O.preT3FidPct + '% of pre-Tender-3 awarded battery capacity had reached this tier at that time.','这是合同化收入唯一可进入基准情景的层级。第3轮之前中标的储能容量中，当时仅有' + O.preT3FidPct + '%达到该层级。'] },
        ] },
        { t:'note', text:['Because tier 4 publishes volumes but not prices, this dashboard brackets the floor rather than asserting one: a debt-service-and-opex build-up at the low end, and the NSW LTESA Round 6 annuity cap as a same-region, same-asset-class proxy at the high end. The derivation is in src/markets/nem/comparison.js and the resulting range is what the dedicated Investment Lab page varies over.',
          '由于第4层级公布容量但不公布价格，本看板对保底价采取区间估计而非直接主张：下限为偿债与运维成本推算，上限为新南威尔士LTESA第6轮年金上限（同区域、同资产类别的代理指标）。推导过程见src/markets/nem/comparison.js，所得区间即独立投资测算页面的变动范围。'] },
        { t:'why', text:['This is the honest position and it is worth stating plainly: this dashboard does not know what a CIS agreement pays, and neither does anyone outside the transaction. What it can do is bound the answer from two independent directions and refuse to present the midpoint as a fact. The Nelson Review recommending that the successor mechanism publish its clearing prices is the strongest available evidence that this gap is real, acknowledged, and scheduled to close no earlier than ' + O.esemStart + '.',
          '这是诚实的立场，值得明说：本看板不知道CIS协议的支付水平，交易之外亦无人知晓。它能做的是从两个独立方向框定答案，并拒绝把中值当作事实呈现。Nelson评估建议后继机制公布出清价格，是关于“该缺口真实存在、已被承认、且最早在' + O.esemStart + '才可能弥合”的最有力证据。'],
          sig:['Bound the answer; do not assert the midpoint','框定答案，不主张中值'] },
        { t:'src', src: SRC.contractPriceGap, use:['Coverage assessment for CIS prices and Australian toll prices','CIS价格与澳大利亚租赁价格的覆盖情况评估'] },
      ] },
    ] };
  };
}
