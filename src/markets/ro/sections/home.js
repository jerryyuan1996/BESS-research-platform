/* Romania — the `home` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';
import { CORE_STORYLINE_TEXT } from '../coreStoryline.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, eur, fmtRON } = createShared(api);
  const SEC_B = {};

SEC_B.home = function (){
  const dni = liveScore('durFactors');
  const dband = bandFor(M.durBands, dni);
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2028];
  return {
  warn: M.seedWarn,
  blocks: [
    { t:'card', mt:false, title:['Institutional Investor Walkthrough — six questions, one decision path','机构投资人导览 — 六个问题，一条决策路径'],
      badges:['official'], live:false, blocks:[
      { t:'band-story', b:['Core storyline','核心叙事'],
        text: CORE_STORYLINE_TEXT },
      { t:'p', text:['Target COD window: ' + M.overall.codWindow, '目标投运窗口：' + M.overall.codWindow] },
      { t:'walk', items:[
        ['01', ['Overview','总览'], ['What is the house view today?','当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution','市场演进'], ['Why did BESS become necessary — and what changed after entry?','为何储能成为必需？进入后发生了什么？'], 'story'],
        ['03', ['Revenue stack','收入结构'], ['What actually pays, given there is no capacity market?','在没有容量市场的情况下，究竟靠什么获得报酬？'], 'capacity'],
        ['04', ['Asset design','资产设计'], ['Is 2h or 4h the right build for this price shape?','对当前价格形态而言，2小时还是4小时是正确配置？'], 'duration'],
        ['05', ['Underwriting','项目承销'], ['Can the project connect, qualify and finance?','项目能否并网、取得资格并融资？'], 'grid'],
        ['06', ['Portfolio application','组合应用'], ['Which screened Romanian opportunity passes the gates?','所筛选的罗马尼亚机会中哪一个能通过门槛？'], 'portfolio'],
      ] },
      { t:'why', text:['The six questions are sequenced so each one can veto the next. A market with wide spreads (02) is not the same as a revenue stack that a lender will size against (03), a design that suits the price shape (04), an asset that can actually connect and prequalify (05), or a specific opportunity worth committing capital to (06). In Romania the veto usually falls at step 05, which is why it must be tested before the model is built rather than after.',
        '六个问题按“逐级否决”排序：价差宽的市场（02）不等于贷款人愿据以安排规模的收入结构（03），不等于契合价格形态的设计（04），不等于能真正并网并取得预认证的资产（05），也不等于某个具体机会值得投入资本（06）。在罗马尼亚，否决通常发生在第05步 — 因此它必须在建模之前而非之后检验。'],
        sig:['The veto usually falls at connection','否决通常发生在并网环节'] },
    ] },

    { t:'g2', cards:[
      { title:['Card A — Support & Adequacy Signal','Card A — 支持机制与充裕度信号'], live:false, blocks:[
        { t:'chip', cls:'warn', text:['Capital support, not revenue support — and budget is not award','资本支持而非收入支持 — 且预算不等于授予'] },
        { t:'kpis', items:[
          { l:['Standalone-storage scheme budget','独立储能计划预算'], v:fmtCM(O.schemeBudgetEurM * 1e6), d:['a budget, not a committed award','是预算，而非已承诺的授予'], b:['official'] },
          { l:['Scheme minimum new storage energy','计划最低新增储能电量'], v:fmtN(O.schemeMinMWh) + '<small> MWh</small>', d:['by 2030 — a policy floor, not a pipeline','至2030年 — 政策下限，非管线'], b:['policy'] },
          { l:['Additional storage-power expectation','额外储能功率预期'], v:fmtN(O.policyExtraMW) + '<small> MW</small>', d:['policy and industry expectation, not financed','政策与行业预期，未获融资'], b:['policy'] },
          { l:['Capacity mechanism','容量机制'], v:L(['None','无']), d:['no capacity payment — the revenue stack is merchant plus balancing','无容量付费 — 收入结构为市场化加平衡'], b:['official'] },
          { l:['Grant as % of capex (modelled)','补贴占造价比例（模型）'], v:M.lab.grantPct + '<small>%</small>', d:['conditional on a formal award letter','以正式授予函为条件'], b:['illus'] },
        ] },
        { t:'why', text:['This is the structural fact that distinguishes Romania from every other market in this comparison set: there is no capacity payment, so nothing de-risks the revenue line. State aid reduces the capital at risk, which improves equity returns but does not improve debt coverage — a lender still sizes against merchant and balancing revenue. Two rules follow: never treat a scheme budget as a project award, and never let a grant substitute for a contracted revenue floor in the lender case.',
          '这是使罗马尼亚区别于本对比样本中所有其他市场的结构性事实：没有容量付费，因此没有任何机制为收入线去风险。国家援助降低的是风险资本，从而改善股权回报，但并不改善偿债覆盖 — 贷款人仍以市场化与平衡收入安排规模。由此得出两条原则：绝不将计划预算视为项目授予；在贷款人情景中，绝不以补贴替代合同化收入下限。'],
          sig:['Grants cut capital, not revenue risk','补贴削减的是资本，而非收入风险'] },
      ] },
      { title:['Card B — Wholesale & Intraday Signal','Card B — 批发与日内市场信号'], live:false, blocks:[
        { t:'chip', cls:'good', text:['Strong volatility — the primary reason to invest','波动性强 — 主要投资理由'] },
        { t:'kpis', items:[
          { l:['DAM weighted-average price 2025','2025年日前市场加权均价'], v:fmtRON(O.dam2025Wap) + '<small>/MWh</small>', d:['≈ ' + fmtC(eur(O.dam2025Wap)) + '/MWh','≈ ' + fmtC(eur(O.dam2025Wap)) + '/MWh'], b:['official'] },
          { l:['DAM traded volume 2025','2025年日前市场成交量'], v:fmt1(O.dam2025TWh) + '<small> TWh</small>', d:[O.dam2025SharePct + '% of domestic consumption','占国内消费' + O.dam2025SharePct + '%'], b:['official'] },
          { l:['DAM weighted-average price Jun 2026','2026年6月日前均价'], v:fmtRON(O.damJun2026Wap) + '<small>/MWh</small>', d:['≈ ' + fmtC(eur(O.damJun2026Wap)) + '/MWh — +' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + ' vs 2025 average','≈ ' + fmtC(eur(O.damJun2026Wap)) + '/MWh — 较2025年均价+' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0)], b:['official'] },
          { l:['Executable net margin','可执行净价差'], v:fmtC(62) + '<small>/MWh</small>', d:['from an 85 published spread — see the bridge','由公布价差85推算 — 详见桥接图'], b:['calc'] },
          { l:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '<small>/MWh</small>', d:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high),'低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high)], b:['illus'] },
          { l:['Negative-price intervals (Q2-26)','负电价时段（2026Q2）'], v:'~' + fmtN(M.negHoursSeries[5]) + '<small> h</small>', d:['from ~' + fmtN(M.negHoursSeries[0]) + ' h in Q1-25','由2025Q1约' + fmtN(M.negHoursSeries[0]) + '小时上升'], b:['illus'] },
        ] },
        { t:'why', text:['Romania has the raw material for storage economics: high average prices, a deep solar-driven midday trough and a rising count of negative-price intervals. The executable margin of ' + fmtC(62) + '/MWh is comparatively healthy, and this is why the market attracts capital despite the absence of a capacity mechanism. But note the direction of the negative-price series — it is rising fast, which widens the spread now and signals the same solar saturation that will eventually flatten the evening ramp others are chasing.',
          '罗马尼亚具备储能经济性的原材料：平均电价高、光伏驱动的午间低谷深、负电价时段数量上升。' + fmtC(62) + '/MWh的可执行价差相对健康，这正是该市场在没有容量机制的情况下仍能吸引资本的原因。但须注意负电价序列的方向 — 其上升迅速，当下扩大价差，同时也预示着终将使他人所追逐的晚间爬坡趋于平缓的光伏饱和。'],
          sig:['Same solar that widens the spread will flatten it','扩大价差的光伏终将使其趋平'] },
      ] },
      { title:['Card C — Balancing & Reserves Signal','Card C — 平衡与备用信号'], live:false, blocks:[
        { t:'chip', cls:'serious', text:['Real but unevidenced — qualification and track record are missing','真实但缺乏证据 — 资格认证与业绩记录尚不具备'] },
        { t:'kpis', items:[
          { l:['aFRR capacity requirement','aFRR容量需求'], v:fmtN(M.balProducts[1].reqMW) + '<small> MW</small>', d:['capacity price ' + fmtC(M.balProducts[1].capEurMWh) + '/MW/h','容量价格' + fmtC(M.balProducts[1].capEurMWh) + '/MW/h'], b:['illus'] },
          { l:['mFRR capacity requirement','mFRR容量需求'], v:fmtN(M.balProducts[2].reqMW) + '<small> MW</small>', d:['capacity price ' + fmtC(M.balProducts[2].capEurMWh) + '/MW/h — the deep, cheap product','容量价格' + fmtC(M.balProducts[2].capEurMWh) + '/MW/h — 量大价低的产品'], b:['illus'] },
          { l:['aFRR-up capacity price trend','aFRR上调容量价格趋势'], v:fmtC(M.afrrCapSeries[0]) + ' → ' + fmtC(M.afrrCapSeries[5]) + '<small>/MW/h</small>', d:[fmtPct((M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + ' over six quarters','六个季度内' + fmtPct((M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0)], cls:'down', b:['illus'] },
          { l:['Evidence tier reached by most projects','多数项目达到的证据层级'], v:'1 / 5', d:['published results only — no BESS qualification or activation record','仅有公开结果 — 无电池预认证或激活记录'], b:['calc'] },
        ] },
        { t:'why', text:['Balancing is where Romanian storage models find their upside, and it is also where they are least evidenced. Published capacity and activation results are observable, but reproducible optimiser backtests, project prequalification for FCR/aFRR/mFRR, and a battery award-and-activation track record mostly are not. Underwrite balancing revenue only to the tier of evidence the specific project has actually reached — and note the aFRR capacity price is already trending down ' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% as more capable capacity qualifies.',
          '平衡市场是罗马尼亚储能模型寻找上行空间之处，也是其证据最薄弱之处。公开的容量与激活结果可观察，但可复现的优化器回测、项目的FCR/aFRR/mFRR预认证、以及电池的中标与激活业绩记录，大多并不具备。平衡收入的测算只应达到具体项目实际取得的证据层级 — 并须注意随着更多有能力的容量取得资格，aFRR容量价格已呈' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '%的下行趋势。'],
          sig:['Underwrite to the evidence tier reached','按已达到的证据层级承销'] },
      ] },
      { title:['Card D — Duration Signal','Card D — 时长信号'], live:false, blocks:[
        { t:'chip', cls:'warn', text:['2h core with a documented path to 4h','2小时为核心，并保留明确的4小时路径'] },
        { t:'kpis', items:[
          { l:['Duration-Need Index','时长需求指数'], v:dni + '<small> / 100</small>', d:dband.n, b:['calc','illus'] },
          { l:['Net marginal value, 2h → 4h','2小时→4小时净边际价值'], v:fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k<small>/MW/yr</small>', d:['thin — the fourth hour barely clears','微薄 — 第4小时勉强为正'], b:['illus'] },
          { l:['Spread capture at 4h vs 2h','4小时对2小时的价差捕获率'], v:fmtPct(M.durSpreadFactor[4] * 100, 0), d:['deeper cycles capture thinner spreads','更深循环捕获更薄价差'], b:['illus'] },
          { l:['Grant-scheme MWh eligibility','补贴计划MWh资格'], v:L(['Favours energy','偏向能量']), d:['a policy reason to build longer than the market pays for','这是建设时长超出市场付费水平的政策理由'], b:['policy'] },
        ] },
        { t:'flow', items:[
          ['Solar-driven midday trough','光伏驱动的午间低谷'],
          ['Steep evening ramp','陡峭的晚间爬坡'],
          ['Rising negative-price intervals','负电价时段增加'],
          ['No capacity payment for duration','时长无容量付费'],
          ['2h core, 4h optionality','2小时核心，4小时选择权'],
        ], sep:'+' },
        { t:'why', text:['Romania is the one market in this set where the fourth hour is genuinely marginal: net value is about ' + fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k/MW/yr, because there is no capacity mechanism paying for duration and the grant is the only structural reason to add MWh. The answer is a 2h core design with a documented, consented and financed augmentation path to 4h — build the option, not the energy, and exercise it when the price shape or the scheme rules justify it.',
          '罗马尼亚是本样本中第4小时真正处于边际的唯一市场：净价值约' + fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k/MW/年，因为没有容量机制为时长付费，而补贴是增配MWh的唯一结构性理由。答案是2小时核心设计加上有据可查、已获许可并已安排融资的4小时增容路径 — 建设选择权而非能量，待价格形态或计划规则足以支撑时再行使。'],
          sig:['Build the option, not the energy','建设选择权，而非能量'] },
      ] },
      { title:['Card E — Grid & Permitting Signal','Card E — 并网与许可信号'], badges:['illus'], live:false, blocks:[
        { t:'kpis', items:[
          { l:['Binding evidence','约束性证据'], v:L(['ATR + executed connection agreement','ATR + 已签并网合同']), d:['not an indicative capacity map','而非示意性容量地图'], b:['verify'] },
          { l:['Storage authorisations, one Feb 2026 meeting','2026年2月单次会议的储能许可'], v:fmtN(O.authFeb2026MW) + '<small> MW</small>', d:['authorisations are never operating MW','许可绝不等于投运MW'], b:['official'] },
          { l:['Allocation-auction participation guarantee','容量分配拍卖参与保函'], v:fmtC(O.auctionGuarEurMW) + '<small>/MW</small>', d:['verify current release mechanics','须核验现行释放机制'], b:['verify'] },
          { l:['Connection-tariff guarantee','并网费保函'], v:O.connTariffGuarPct + '<small>%</small>', d:['plus ' + fmtC(O.estabGuarEurKW) + '/kW establishment guarantee','另加' + fmtC(O.estabGuarEurKW) + '/kW设立许可保函'], b:['verify'] },
        ] },
        { t:'note', text:['Required protection: no material non-refundable payment before an ATR and an executed connection agreement. The indicative available-capacity map is a screening tool and is never a financeable right; an establishment authorisation is a permit and is never operating capacity.',
          '必要保护：在取得ATR及已签并网合同前，不支付重大不可退还款项。示意性可用容量地图是筛选工具，绝非可融资权利；设立许可是许可证，绝非投运容量。'] },
        { t:'why', text:['The Romanian connection failure mode is a category error rather than a technical one: treating a map, an authorisation or a scheme budget as evidence of a project. ' + fmtN(O.authFeb2026MW) + ' MW of authorisations approved in a single regulatory meeting illustrates both the opportunity and the trap — that volume is real interest, and almost none of it will connect on the announced schedule. Guarantee mechanics matter too: capital posted against auction and connection guarantees is capital at risk until the release conditions are documented.',
          '罗马尼亚并网的失效模式是类别错误而非技术错误：将地图、许可或计划预算视为项目的证据。单次监管会议核准' + fmtN(O.authFeb2026MW) + 'MW的许可，同时说明了机会与陷阱 — 该体量代表真实兴趣，但其中几乎没有项目会按公告进度并网。保函机制同样重要：为拍卖与并网保函缴付的资金，在释放条件形成书面约定之前均属风险资本。'],
          sig:['A map is not a right','地图不是权利'] },
      ] },
    ] },

    { t:'card', title:['Card F — Underwriting rules','Card F — 承保规则'], badges:['illus'], live:false, blocks:[
      { t:'list', ol:true, items:[
        [['Require an ATR and an executed connection agreement as conditions precedent — never an indicative capacity map or an establishment authorisation.','以ATR及已签并网合同为先决条件 — 绝不接受示意性容量地图或设立许可。'],
         ['Applies when: connection evidence below executed-agreement standard','适用条件：并网证据未达已签合同标准']],
        [['Treat a formal grant award letter, not the scheme budget, as the condition precedent for any grant-dependent case.','任何依赖补贴的情景，以正式补贴授予函而非计划预算作为先决条件。'],
         ['Applies when: grant assumed in the base case','适用条件：基准情景假设取得补贴']],
        [['Underwrite balancing revenue only to the evidence tier the specific project has reached, and require a reproducible optimiser backtest.','平衡收入的测算只应达到具体项目已取得的证据层级，并须提供可复现的优化器回测。'],
         ['Applies when: balancing revenue material to debt service','适用条件：平衡收入对偿债影响重大']],
        [['Build 2h with a documented, consented and financed augmentation path to 4h rather than committing the MWh now.','按2小时建设并保留有据可查、已获许可且已安排融资的4小时增容路径，而非现在即投入MWh。'],
         ['Applies when: marginal value of the fourth hour below ' + fmtC(5) + 'k/MW/yr','适用条件：第4小时边际价值低于' + fmtC(5) + 'k/MW/年']],
        [['Document guarantee release mechanics in the SPA before posting auction or connection guarantees.','在缴付拍卖或并网保函之前，先在股权买卖协议中明确保函释放机制。'],
         ['Applies when: any guarantee posted before financial close','适用条件：融资交割前缴付任何保函']],
      ] },
      { t:'why', text:['Four of the five rules are documentary rather than analytical, the right emphasis for Romania: the modelling question is comparatively easy and the evidence question comparatively hard. Three of the five conditions hold at today’s snapshot for a typical screened project, so the protections listed here are mandatory, not optional. The call itself is on the Brief.',
        '五条规则中有四条属文件性而非分析性 — 这对罗马尼亚而言是正确的侧重：建模问题相对容易，证据问题相对困难。对典型筛选项目而言，按当前快照五项条件中已有三项成立，因此上列保护措施为必须而非可选。结论本身见要点页。'],
        sig:['Documentary risk dominates modelling risk','文件风险高于建模风险'] },
    ] },

    { t:'card', title:['Revenue Driver Bridge — how nameplate MW becomes net operating revenue','收入驱动桥 — 铭牌MW如何变为净运营收入'], badges:['calc'], live:false, blocks:[
      { t:'sub', text:['Capital channel (state aid) — reduces capital at risk, not revenue risk','资本通道（国家援助） — 降低风险资本，而非收入风险'] },
      { t:'flow', items:[
        ['Scheme budget','计划预算'], ['Eligibility & MWh minimum','资格与MWh下限'],
        ['Formal award letter','正式授予函'], ['Disbursement against milestones','按里程碑拨付'], ['Net capex at risk','风险资本净额'],
      ] },
      { t:'sub', text:['Revenue channel (merchant + balancing, net)','收入通道（市场化+平衡，净值）'] },
      { t:'flow', items:[
        ['Published day-ahead spread','公布日前价差'], ['− liquidity & gate-closure','− 流动性与闭市'],
        ['− RTE and availability','− 效率与可用率'], ['− optimiser fee','− 优化商费用'],
        ['+ balancing capacity & activation','+ 平衡容量与激活'], ['Net operating revenue','净运营收入'],
      ] },
      { t:'note', text:['The two channels do different jobs and are not substitutes. The capital channel improves equity returns by reducing the amount at risk; the revenue channel is what a lender sizes against. A project with a large grant and an unevidenced balancing case is still an unbankable project — it is simply a cheaper one.',
        '两条通道作用不同，不可互相替代。资本通道通过减少风险敞口改善股权回报；收入通道才是贷款人据以安排规模的依据。一个补贴丰厚但平衡收入缺乏证据的项目仍然不可融资 — 它只是成本更低而已。'] },
      { t:'why', text:['This bridge is the dashboard’s single organising idea and it makes the Romanian structure explicit: unlike GB, Ireland or Poland, there is no contracted revenue line at all. Every euro of revenue is merchant or balancing, and the state supports the balance sheet rather than the income statement. The practical consequence is that gearing must be lower, or a bilateral floor or tolling structure must be negotiated — there is no third option.',
        '本桥是整个看板的组织主线，并使罗马尼亚的结构一目了然：与英国、爱尔兰或波兰不同，此处根本不存在合同化收入线。每一欧元收入均来自市场化或平衡市场，而国家支持的是资产负债表而非利润表。实务后果是：要么降低杠杆，要么谈判取得双边保底或代工结构 — 没有第三种选择。'],
        sig:['No contracted line means lower gearing','没有合同化收入即须降低杠杆'] },
    ] },
  ] };
};

// ============================== ROMANIA MARKET STORY ==============================

  return SEC_B.home;
}
