import { buildROGridSection } from './gridSection.js';
import { buildROPlanningBlocks } from './planningSection.js';
import { buildROEconomicsBlocks } from './economicsSection.js';
import { RO_BUILD_PATHWAY } from './buildPathway.js';

/* ---------------------------------------------------------------------------
   Romania 鈥?declarative section specs, verbatim from the prototype
   (lines 1580-2479).

   One SEC_B entry per tab, each returning a block spec that the shared engine
   draws. SECTIONS() wraps them in lazy getters so every string re-evaluates when
   the language changes.

   The engine hands in everything these specs use; nothing is imported directly,
   which is what keeps the four markets in this lineage interchangeable.
   --------------------------------------------------------------------------- */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;

// ---------------- section registry ----------------
const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
const eur = ron => ron / M.fx;
const fmtRON = x => NF2.format(x) + ' RON';

// ============================== OVERVIEW ==============================
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
        text:['Romania is an energy-only market with no capacity mechanism, so storage earns from wholesale spreads and balancing services and is capitalised — not remunerated — by state aid. Solar build-out has created a deep midday trough and a steep evening ramp, which is a genuine arbitrage opportunity. But the binding constraints are administrative: an ATR and executed connection agreement, balancing prequalification, and a formal grant award rather than a scheme budget. Value is created by clearing those gates, not by forecasting prices.',
              '罗马尼亚是没有容量机制的单一电能量市场，因此储能收入来自批发价差与平衡服务，而国家援助提供的是资本化支持而非收入报酬。光伏扩张形成了深度午间低谷与陡峭晚间爬坡，构成真实的套利机会。但关键约束是行政性的：ATR与已签并网合同、平衡市场预认证、以及正式补贴授予（而非计划预算）。价值来自跨越这些门槛，而非来自预测价格。'] },
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
SEC_B.story = function (){
  return {
  head: ['Romania Market Evolution — from a coal-and-hydro system to a solar-driven arbitrage market',
         '罗马尼亚市场演进 — 从煤电与水电系统到光伏驱动的套利市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['official','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Market design','市场设计'], v:L(['Energy-only','单一电能量']), d:['no capacity mechanism; coupled to the EU day-ahead market','无容量机制；与欧盟日前市场耦合'], b:['official'] },
        { l:['DAM average price 2025','2025年日前市场均价'], v:fmtC(eur(O.dam2025Wap)) + '<small>/MWh</small>', d:[fmtRON(O.dam2025Wap) + ' · ' + fmt1(O.dam2025TWh) + ' TWh traded', fmtRON(O.dam2025Wap) + ' · 成交' + fmt1(O.dam2025TWh) + 'TWh'], b:['official'] },
        { l:['DAM share of consumption','日前市场占消费比重'], v:O.dam2025SharePct + '<small>%</small>', d:['the rest is bilateral or intraday','其余为双边或日内'], b:['official'] },
        { l:['State-aid scheme for standalone storage','独立储能国家援助计划'], v:fmtCM(O.schemeBudgetEurM * 1e6), d:['capital support, not revenue support','资本支持，非收入支持'], b:['official'] },
        { l:['Operating storage fleet','在运储能规模'], v:fmtN(O.fleetMW) + '<small> MW</small>', d:[fmtN(O.fleetMWh) + ' MWh — early growth stage','' + fmtN(O.fleetMWh) + 'MWh — 早期成长阶段'], b:['illus'] },
        { l:['Authorisations in one Feb 2026 meeting','2026年2月单次会议许可'], v:fmtN(O.authFeb2026MW) + '<small> MW</small>', d:['interest is abundant; delivery is not','兴趣充足，交付不足'], b:['official'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['Romania offers among the best raw arbitrage economics in the comparison set and the weakest revenue de-risking. High and volatile day-ahead prices, a deepening solar trough and a steep evening ramp create a genuine merchant opportunity; the absence of any capacity mechanism means none of it is contracted. The winning project is the one that clears the administrative gates early and negotiates a bilateral floor, not the one with the best price forecast.',
              '罗马尼亚在本对比样本中拥有最好的原始套利经济性之一，以及最弱的收入去风险机制。日前电价高且波动、光伏低谷加深、晚间爬坡陡峭，构成真实的市场化机会；而完全没有容量机制意味着这些收入均未被合同化。优质项目是那些尽早跨越行政门槛并谈成双边保底的项目，而非价格预测最好的项目。'] },
      { t:'why', text:['Two facts do the work. The June 2026 DAM average of ' + fmtRON(O.damJun2026Wap) + '/MWh sits ' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + '% above the 2025 annual average, so price levels and volatility are genuinely supportive. But ' + fmtN(O.authFeb2026MW) + ' MW of storage authorisations approved in a single regulatory meeting shows how much competing interest exists at the paper stage. The Romanian investment problem is therefore conversion, not opportunity: the returns are available to whoever actually connects, and most of the announced pipeline will not.',
        '此处两项事实最为关键。2026年6月日前市场均价' + fmtRON(O.damJun2026Wap) + '/MWh，较2025年年均高出' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + '%，价格水平与波动性确实具有支撑性。但单次监管会议即核准' + fmtN(O.authFeb2026MW) + 'MW储能许可，显示在纸面阶段存在多少竞争性兴趣。因此罗马尼亚的投资难题在于转化率而非机会：收益属于真正并网者，而已公告管线中的大部分不会实现。'],
        sig:['Conversion risk, not opportunity risk','转化风险而非机会风险'] },
    ] },

    ...buildROPlanningBlocks({ SRC }),

    ...buildROEconomicsBlocks(),
    { t:'card', title:['How the Romanian storage case was built — four changes in five years','罗马尼亚储能逻辑的形成 — 五年内四次变化'], badges:['official','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['Romania did not design a storage market; it acquired one as a by-product of solar growth, EU market coupling and state-aid availability. Each of the four changes below improved the case, and none of them created a contracted revenue line. That is why the diligence emphasis here is documentary rather than analytical.',
              '罗马尼亚并未设计储能市场；它是光伏增长、欧盟市场耦合与国家援助可得性的副产品。以下四项变化均改善了投资逻辑，但没有一项创造出合同化收入线。这正是当地尽调侧重文件而非分析的原因。'] },
      { t:'timeline', items:[
        { y:'2019–2022', t:['Market coupling and price convergence','市场耦合与价格趋同'],
          p:['Romania coupled to the wider European day-ahead market, which imported both liquidity and volatility. Prices became a European rather than a domestic variable.',
             '罗马尼亚与更广泛的欧洲日前市场耦合，同时引入了流动性与波动性。电价由本国变量变为欧洲变量。'],
          i:['Any Romanian price forecast is now partly a forecast of continental gas and coupling flows, which is why a domestic fundamentals model alone is insufficient.',
             '如今任何罗马尼亚价格预测都部分是对欧陆燃气与耦合潮流的预测，这正是仅靠本国基本面模型不足以支撑判断的原因。'] },
        { y:'2022–2024', t:['Solar build-out creates the midday trough','光伏扩张形成午间低谷'],
          p:['Rapid utility and rooftop solar deployment deepened the midday price trough and steepened the evening ramp. Negative-price intervals appeared and then multiplied.',
             '大型与屋顶光伏快速部署加深了午间价格低谷、抬升了晚间爬坡陡度。负电价时段开始出现并迅速增加。'],
          i:['This is the arbitrage opportunity in one sentence: solar creates the spread that storage monetises, and continued solar growth both widens it and eventually competes it away.',
             '这是套利机会的一句话概括：光伏创造了储能所变现的价差，而光伏的持续增长既扩大该价差，最终也会将其竞争消解。'] },
        { y:'2024–2025', t:['Tariff treatment of stored energy is corrected','储能电量的电价待遇获得纠正'],
          p:['The regulator moved to remove the double-charging of network tariffs on energy that is stored and returned to the grid — a structural cost that had made standalone storage uneconomic on paper.',
             '监管机构着手取消对“储存后再送回电网”电量的网络费双重计费 — 这项结构性成本曾使独立储能在纸面上不具经济性。'],
          i:['A cost removal, not a revenue addition. It is nonetheless the single change that made standalone Romanian storage modellable at all, and it should be verified as implemented in tariff practice rather than assumed from the announcement.',
             '这是成本的移除而非收入的增加。但它仍是使罗马尼亚独立储能首次具备可建模性的关键变化，且应核验其在电价实践中的落地情况，而非仅凭公告推定。'] },
        { y:'2026', t:['State aid and the first financings','国家援助与首批融资'],
          p:['A ' + fmtCM(O.schemeBudgetEurM * 1e6) + ' state-aid scheme for standalone storage was approved, alongside development-bank-supported project financings that established a bankability precedent.',
             '一项' + fmtCM(O.schemeBudgetEurM * 1e6) + '的独立储能国家援助计划获批，同时开发性银行支持的项目融资确立了可融资性先例。'],
          i:['The scheme reduces capital at risk and the financings prove lenders will lend. Neither creates a contracted revenue line, so gearing remains lower than in a capacity-market jurisdiction for the same asset.',
             '该计划降低风险资本，融资案例证明贷款人愿意放贷。但两者均未创造合同化收入线，因此对同一资产而言，杠杆水平仍低于设有容量市场的司法辖区。'] },
      ] },
      { t:'why', text:['Four changes, all favourable, none of them contractual. Romania has removed cost barriers and added capital support without ever creating a revenue floor — which is a coherent policy choice for an energy-only market but leaves the entire revenue risk with the investor. The base rate to underwrite against is therefore: expect the policy environment to keep improving on cost and capital, and do not expect it to improve on revenue certainty.',
        '四项变化均属有利，但没有一项属于合同性质。罗马尼亚移除了成本障碍并增加了资本支持，却始终未创造收入下限 — 对单一电能量市场而言这是自洽的政策选择，但全部收入风险留给了投资人。因此承销时应参照的基准判断是：预期政策环境在成本与资本层面持续改善，但不应预期其在收入确定性上有所改善。'],
        sig:['Cost and capital improve; revenue risk does not','成本与资本改善，收入风险不变'] },
      { t:'g2', cards:[
        { title:['Day-ahead and intraday price path','日前与日内价格轨迹'], badges:['official','illus'], blocks:[
          { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtN(v), h: 220, ymin: 0,
            series:[
              { name:['DAM (RON/MWh)','日前市场（RON/MWh）'], color:'var(--s1)', vals: M.damSeries },
              { name:['IDM (RON/MWh)','日内市场（RON/MWh）'], color:'var(--s3)', vals: M.idmSeries, dash: true },
            ] } },
          { t:'why', text:['Only the 2025 annual weighted averages and the June 2026 monthly figure are official anchors; the intra-year shape is an illustrative seed. What is real is the persistent discount of intraday to day-ahead, which is roughly ' + fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0) + '% on the 2025 averages — that discount is the cost of correcting a position late, and it belongs in the executable-spread bridge rather than in an upside case.',
            '只有2025年年度加权均价与2026年6月的月度数值是官方锚点；年内形态为示例种子。真实存在的是日内相对日前的持续折价，按2025年均值约为' + fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0) + ' — 该折价是事后修正头寸的成本，应计入可执行价差桥，而非计入上行情景。'],
            sig:['Intraday discount is a cost, not an upside','日内折价是成本，而非上行'] },
        ] },
        { title:['Negative-price and high-price intervals','负电价与高电价时段'], badges:['illus'], blocks:[
          { t:'bar', cfg:{ xs: M.qLabels, mode:'group', bw: 20, yfmt: v => fmtN(v) + ' h', h: 220,
            series:[
              { name:['Negative-price intervals','负电价时段'], color:'var(--s6)', vals: M.negHoursSeries },
              { name:['Intervals above 1,000 RON/MWh','高于1,000 RON/MWh的时段'], color:'var(--s3)', vals: M.highHoursSeries },
            ] } },
          { t:'why', text:['The two series are the storage business model drawn as a chart: negative intervals are when the asset is paid to charge, high intervals are when it is paid to discharge. Both are growing, which widens the spread today. But negative intervals are growing faster, and that asymmetry is the signal that solar saturation is arriving ahead of storage — good for a 2027 COD, progressively less good after.',
            '这两条序列就是储能商业模式的图形表达：负电价时段是资产因充电而获付费之时，高电价时段是其因放电而获付费之时。两者均在增长，当下扩大了价差。但负电价时段增长更快，这一不对称正是光伏饱和先于储能到来的信号 — 对2027年投运有利，其后逐步减弱。'],
            sig:['Negative hours are growing faster','负电价小时数增长更快'] },
        ] },
      ] },
      { t:'src', src: SRC.opcom, use:['Annual and monthly weighted-average prices and traded volumes','年度与月度加权均价及成交量'] },
    ] },

    { t:'card', title:['Who is building Romanian storage — four strategies, one bottleneck','谁在建设罗马尼亚储能 — 四类策略，一个瓶颈'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['Utility / incumbent generator','公用事业与在位发电企业'], n:['State and private generators with existing grid positions','拥有既有电网地位的国有及私营发电企业'], met:'existing connections',
          p:['Reuse or extend existing connection points, which is the fastest route past the binding constraint. Their advantage is regulatory position rather than cost of capital.',
             '复用或扩展既有并网点，是绕过关键约束的最快路径。其优势在于监管地位而非资本成本。'] },
        { type:['Renewable developer adding storage','加建储能的新能源开发商'], n:['Solar and wind developers co-locating batteries','在光伏与风电场共址加建电池的开发商'], met:'shared ATR',
          p:['Add storage behind an existing or applied-for connection, monetising the same solar trough their own generation creates. Structurally the strongest position in Romania.',
             '在既有或已申请的并网点后加建储能，将自身发电所造成的光伏低谷变现。这是罗马尼亚结构上最强的地位。'] },
        { type:['International infra fund','国际基础设施基金'], n:['Development-bank-supported platform investors','由开发性银行支持的平台型投资人'], met:'grant + debt',
          p:['Combine state aid with development-bank debt to build a first-mover portfolio. They accept merchant risk that commercial lenders will not, in exchange for scale and early position.',
             '将国家援助与开发性银行债务结合，构建先发组合。其接受商业银行不愿承担的市场化风险，以换取规模与先发地位。'] },
        { type:['Trading house / optimiser','贸易机构与优化商'], n:['Route-to-market providers and balancing aggregators','售电路径提供方与平衡市场聚合商'], met:'fee + share',
          p:['Balancing qualification and reproducible dispatch performance are scarce in Romania, so the optimiser is a genuine differentiator rather than a commodity service.',
             '在罗马尼亚，平衡市场资格与可复现的调度业绩较为稀缺，因此优化商是真正的差异化因素，而非通用服务。'] },
      ] },
      { t:'note', text:['Concentration read: Romania is fragmented on ownership and concentrated on connection. Whoever holds an ATR with adequate capacity at a location with a real price spread holds the scarce asset — which is why co-location behind an existing renewable connection is structurally advantaged.',
        '集中度解读：罗马尼亚在所有权上分散，在并网上集中。谁在具备真实价差的位置持有容量充足的ATR，谁就持有稀缺资产 — 这正是在既有新能源并网点后共址具备结构性优势的原因。'] },
      { t:'why', text:['For a new entrant this determines strategy before it determines price. Buying an ATR-secured, authorised project costs more per MW but removes the risk that actually kills Romanian projects. Developing from an authorisation is cheaper and is a real business, but it is a permitting business rather than an energy business and should carry development-stage return requirements.',
        '对新进入者而言，这一点在决定价格之前先决定策略。收购已锁定ATR并取得许可的项目，每MW成本更高，但消除了真正导致罗马尼亚项目失败的风险。从设立许可自行开发成本更低且是真实业务，但那是许可业务而非能源业务，应按开发阶段的收益要求承担。'],
        sig:['Buy the ATR, not the megawatts','买的是ATR，而非兆瓦'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: convert or lose the window','近期展望 — 2026至2029：抓住窗口或错失'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026–2027','2026–2027'], h:['First awards and first closings','首批授予与首批交割'], p:['Formal awards under the state-aid scheme and the first commercial financings establish pricing and documentation precedent for everyone that follows.','国家援助计划下的正式授予与首批商业融资，为后续所有参与者确立定价与文本先例。'] },
          { yr:['2027–2028','2027–2028'], h:['Spread peak','价差高点'], p:['Solar saturation has widened the trough but competing storage has not yet arrived at scale. This is the best captured-spread window in the model.','光伏饱和已加深低谷，而竞争性储能尚未规模化到场。这是模型中捕获价差最佳的窗口。'] },
          { yr:['2028–2029','2028–2029'], h:['Competition arrives','竞争到场'], p:['Probability-weighted pipeline begins to connect and the captured spread falls from ' + fmtC(M.codCases[2027].central) + ' to ' + fmtC(M.codCases[2029].central) + '/MWh in the central case.','概率加权管线开始并网，中性情景下捕获价差由' + fmtC(M.codCases[2027].central) + '降至' + fmtC(M.codCases[2029].central) + '/MWh。'] },
        ] },
        { t:'why', text:['The central case loses ' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '% of captured spread between a 2027 and a 2029 COD. In a market with no capacity payment to cushion that decline, COD year is the single most valuable variable a sponsor controls — worth more than a better site, a cheaper cell price or a sharper optimiser. Every month of connection delay is directly priced.',
          '中性情景下，2027年与2029年投运之间捕获价差损失' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '%。在没有容量付费缓冲该下滑的市场中，投运年度是发起人可控的最有价值变量 — 其价值高于更好的场址、更低的电芯价格或更优秀的优化商。并网每延迟一个月都会被直接定价。'],
          sig:['COD year is the most valuable variable','投运年度是最有价值的变量'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: coal exit and the second window','长期展望 — 2030至2035：煤电退出与第二个窗口'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['Scheme minimum reached','达到计划最低目标'], p:['The policy minimum of ' + fmtN(O.schemeMinMWh) + ' MWh plus roughly ' + fmtN(O.policyExtraMW) + ' MW of further expectation, against a much smaller operating base today.','政策最低目标' + fmtN(O.schemeMinMWh) + 'MWh，另加约' + fmtN(O.policyExtraMW) + 'MW的进一步预期，而当前在运基数远小于此。'] },
          { yr:['2031–2033','2031–2033'], h:['Thermal retirement','火电退役'], p:['Coal and older gas retirement removes flexible capacity, steepening ramps and re-widening the spread that new storage had compressed.','煤电与老旧燃气机组退役移除灵活容量，使爬坡更陡，并重新扩大新增储能此前压缩的价差。'] },
          { yr:['2033–2035','2033–2035'], h:['Augmentation cycle','增容周期'], p:['The 2027–2029 2-hour cohort reaches the point where adding MWh is cheaper than new-build, and augmentation-ready sites capture that cycle.','2027–2029年建设的2小时批次将到达“增配MWh比新建更便宜”的时点，具备增容条件的场址将获得该周期机会。'] },
        ] },
        { t:'why', text:['The long-run case is a second window rather than a continuous trend: spreads compress as storage arrives, then re-widen as thermal retires. A 2-hour asset built for the first window with a documented augmentation path can participate in both — which is a stronger argument for augmentation optionality than the marginal-hour NPV alone suggests, because the option is exercised into a different market than the one that priced it.',
          '长期逻辑是第二个窗口，而非持续趋势：价差随储能到场而压缩，随后又因火电退役而重新扩大。为第一个窗口建设的、具备有据可查增容路径的2小时资产可以同时参与两个窗口 — 这比单纯的边际小时NPV更有力地论证了增容选择权的价值，因为该选择权行使时所面对的市场，已不同于当初为其定价的市场。'],
          sig:['Two windows, one augmentable asset','两个窗口，一个可增容资产'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['Tariff treatment of stored energy','储能电量的电价待遇']},
         ['Removal of double-charging is what makes standalone storage modellable. If implementation in tariff practice lags the announcement, the operating cost base changes materially.','取消双重计费是独立储能得以建模的前提。若电价实践中的落地滞后于公告，运营成本基础将发生实质变化。'],
         ['Publication of the applicable tariff methodology','适用电价方法的正式发布']],
        [{b:['Connection allocation and guarantee mechanics','并网分配与保函机制']},
         ['Auction, guarantee and release rules are still evolving. Capital posted against guarantees is at risk until release conditions are documented.','拍卖、保函与释放规则仍在演变。在释放条件形成书面约定前，为保函缴付的资金处于风险状态。'],
         ['Any new regulatory order on connection or guarantees','任何关于并网或保函的新监管法令']],
        [{b:['Pace of competing storage delivery','竞争性储能的交付节奏']},
         ['The captured spread falls ' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '% between 2027 and 2029 in the central case. Faster delivery compresses it further; slower delivery extends the window.','中性情景下，捕获价差在2027至2029年间下降' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '%。交付更快则进一步压缩，更慢则延长窗口。'],
         ['Quarterly count of storage projects reaching energisation','季度内达到送电的储能项目数量']],
      ] },
      { t:'why', text:['All three are administrative rather than market variables, and none is diversifiable within Romania. That is the argument for structuring rather than forecasting: a change-in-law allocation on tariff treatment, documented guarantee release mechanics, and a bilateral floor or tolling arrangement together convert three unforecastable policy variables into three negotiated positions. In a market with no capacity payment, this structuring is not optional refinement — it is what makes the project financeable.',
        '三者均为行政变量而非市场变量，且在罗马尼亚境内均不可分散。这正是“以结构应对而非以预测应对”的理由：关于电价待遇的法律变更风险分担、书面化的保函释放机制、以及双边保底或代工安排，三者结合可将三个无法预测的政策变量转化为三项经过谈判的立场。在没有容量付费的市场中，这种结构安排不是可选的精细化 — 它是项目得以融资的前提。'],
        sig:['Structuring is what makes it financeable','结构安排是可融资的前提'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor’s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Support & Adequacy','支持机制与充裕度'], ['What does the state actually pay for?','国家究竟为什么付费？'], 'capacity'],
        ['04', ['Wholesale & Intraday','批发与日内'], ['How much of the spread is executable?','价差中有多少可执行？'], 'energy'],
        ['05', ['Balancing & Reserves','平衡与备用'], ['What evidence tier has this project reached?','该项目达到了哪一证据层级？'], 'services'],
        ['06', ['Storage Duration','储能时长'], ['Is 2h or 4h right for this price shape?','对当前价格形态，2小时还是4小时正确？'], 'duration'],
        ['07', ['Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid & Permitting','并网与许可'], ['Is there an ATR and an executed connection agreement?','是否具备ATR及已签并网合同？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== SUPPORT & ADEQUACY ==============================
SEC_B.capacity = function (){
  return {
  head: ['Support & Adequacy — what the state actually pays for, and what it does not','支持机制与充裕度 — 国家究竟为什么付费，又不为什么付费'],
  cap: ['Romania has no capacity mechanism. State aid supports capital expenditure, not revenue, so this tab replaces the capacity-market analysis used in the other dashboards and makes the structural difference explicit.',
        '罗马尼亚没有容量机制。国家援助支持的是资本开支而非收入，因此本页取代其他看板中的容量市场分析，并明确呈现这一结构性差异。'],
  blocks: [
    { t:'card', mt:false, title:['The support stack — and what each layer does not do','支持体系 — 以及各层次的作用边界'], badges:['official','policy'], live:false, blocks:[
      { t:'table', head:[['Layer','层次'],['What it provides','提供什么'],['What it does NOT provide','不提供什么']], rows:[
        [{b:['Standalone-storage state-aid scheme','独立储能国家援助计划']},
         [fmtCM(O.schemeBudgetEurM * 1e6) + ' of capital grant budget, subject to eligibility and a formal award', fmtCM(O.schemeBudgetEurM * 1e6) + '资本补贴预算，须满足资格并取得正式授予'],
         ['No revenue floor, no offtake, no capacity payment','无收入下限、无购电协议、无容量付费']],
        [{b:['Modernisation Fund / recovery-facility co-financing','现代化基金与复苏基金联合融资']},
         ['Additional capital co-financing for eligible projects','为合资格项目提供额外资本联合融资'],
         ['No operating support once the asset is built','资产建成后不提供运营支持']],
        [{b:['Tariff correction for stored energy','储能电量的电价纠正']},
         ['Removal of double-charging on energy stored and returned','取消对储存后送回电网电量的双重计费'],
         ['A cost removal, not a revenue addition','这是成本移除，而非收入增加']],
        [{b:['Development-bank debt','开发性银行债务']},
         ['Willingness to lend against merchant and balancing revenue','愿意以市场化与平衡收入为基础放贷'],
         ['Not at commercial-bank gearing or pricing','并非商业银行的杠杆水平与定价']],
        [{b:['Capacity mechanism','容量机制']},
         ['—', '—'],
         ['Does not exist in Romania','在罗马尼亚不存在']],
      ] },
      { t:'why', text:['Read down the right-hand column and the Romanian underwriting frame is complete: every layer of support reduces the capital at risk and none reduces the revenue risk. For an equity investor that is a genuine improvement in returns. For a lender it changes nothing about coverage, which is why Romanian gearing is lower than in a capacity-market jurisdiction for an identical asset — and why a bilateral floor or tolling arrangement, if obtainable, is worth more here than anywhere else in this comparison set.',
        '通读右栏，罗马尼亚的承销框架即告完整：每一层支持都降低风险资本，但没有一层降低收入风险。对股权投资人而言，这是收益的真实改善。对贷款人而言，这对偿债覆盖毫无改变 — 这正是同一资产在罗马尼亚的杠杆低于设有容量市场辖区的原因，也是双边保底或代工安排（若可取得）在本对比样本中于此地价值最高的原因。'],
        sig:['Capital support, not revenue support','资本支持，而非收入支持'] },
    ] },

    { t:'card', title:['Grant mechanics — budget, minimum and award','补贴机制 — 预算、下限与授予'], badges:['official','policy'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Scheme budget','计划预算'], v:fmtCM(O.schemeBudgetEurM * 1e6), d:['a ceiling on total aid, not a project entitlement','是援助总额上限，而非项目权利'], b:['official'] },
        { l:['Minimum new storage energy by 2030','2030年前最低新增储能电量'], v:fmtN(O.schemeMinMWh) + '<small> MWh</small>', d:['a policy floor for the scheme as a whole','针对整个计划的政策下限'], b:['policy'] },
        { l:['Additional storage-power expectation','额外储能功率预期'], v:fmtN(O.policyExtraMW) + '<small> MW</small>', d:['policy and industry expectation, not financed pipeline','政策与行业预期，非已融资管线'], b:['policy'] },
        { l:['Modelled grant share of capex','模型中补贴占造价比例'], v:M.lab.grantPct + '<small>%</small>', d:['conditional on a formal award letter','以正式授予函为条件'], b:['illus'] },
      ] },
      { t:'ladder', items:[
        { n:['1 · Scheme approved','1 · 计划获批'], d:['A budget exists. This tells you the state intends to support storage; it tells you nothing about your project.','预算已存在。这说明国家有意支持储能，但与你的项目无关。'] },
        { n:['2 · Call opened','2 · 申报窗口开放'], d:['Eligibility criteria, MWh minimums and selection rules are published. Model against these, not against the announcement.','资格标准、MWh下限与评选规则已公布。应据此建模，而非依据公告。'] },
        { n:['3 · Application submitted','3 · 提交申请'], d:['Still not evidence. Competing applications routinely exceed the budget several times over.','仍不构成证据。竞争性申请通常数倍于预算规模。'] },
        { n:['4 · Formal award letter','4 · 正式授予函'], d:['The only tier at which a grant may enter a base case. Everything before it is an option with no strike price.','这是补贴唯一可进入基准情景的层级。此前的一切都是没有执行价的期权。'] },
        { n:['5 · Disbursement against milestones','5 · 按里程碑拨付'], d:['Cash timing matters for the financing structure; model the drawdown profile, not a single lump sum.','拨付时点影响融资结构；应对提款曲线建模，而非按一次性总额处理。'] },
      ] },
      { t:'warn', text:['A scheme budget is never an award. The single most common Romanian modelling error is capitalising grant support at application stage, which flatters equity returns by exactly the amount of the risk being ignored.',
        '计划预算绝不等于授予。罗马尼亚最常见的建模错误是在申请阶段即将补贴资本化 — 其对股权回报的美化幅度，恰好等于被忽略的风险。'] },
      { t:'why', text:['The grant changes the capital structure rather than the business. At ' + M.lab.grantPct + '% of capex it lifts equity returns materially, but a lender still sizes debt against merchant and balancing revenue, so the debt quantum is unchanged. The correct model treatment is two cases: with award and without, and the investment decision should be capable of being made on the without-award case alone.',
        '补贴改变的是资本结构而非业务本身。按造价的' + M.lab.grantPct + '%计，它显著提升股权回报，但贷款人仍以市场化与平衡收入安排债务规模，因此债务额度不变。正确的模型处理方式是设置两个情景：取得授予与未取得授予；且投资决策应能够仅凭“未取得授予”情景作出。'],
        sig:['Decide on the without-award case','应以未取得授予情景作决策'] },
      { t:'src', src: SRC.scheme, use:['Scheme budget, state-aid basis and eligibility framework','计划预算、国家援助依据与资格框架'] },
    ] },

    { t:'card', title:['Adequacy context — why the state wants storage at all','充裕度背景 — 国家为何需要储能'], badges:['official','forecast'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Solar-driven midday trough','光伏驱动的午间低谷'], v:L(['Deepening','持续加深']), d:['negative intervals up ' + fmtPct((M.negHoursSeries[5] / M.negHoursSeries[0] - 1) * 100, 0) + ' from Q1-25 to Q2-26','负电价时段自2025Q1至2026Q2上升' + fmtPct((M.negHoursSeries[5] / M.negHoursSeries[0] - 1) * 100, 0)], b:['illus'] },
        { l:['Thermal retirement direction','火电退役方向'], v:L(['Coal exit committed','已承诺煤电退出']), d:['removes flexible capacity, steepens ramps','移除灵活容量，抬升爬坡陡度'], b:['policy'] },
        { l:['Storage authorisations, single meeting','单次会议储能许可'], v:fmtN(O.authFeb2026MW) + '<small> MW</small>', d:['strong developer interest at the paper stage','纸面阶段开发商兴趣强烈'], b:['official'] },
        { l:['Capacity mechanism to procure it','采购容量的机制'], v:L(['None','无']), d:['adequacy relies on price signals and state aid','充裕度依赖价格信号与国家援助'], b:['official'] },
      ] },
      { t:'why', text:['Romania has a physical adequacy problem it is choosing to solve with price signals and capital grants rather than with a capacity mechanism. For an investor that is the whole thesis and the whole risk in one sentence: the need is real and rising, and the state has deliberately declined to contract for it. If policy ever changes on this point — a capacity mechanism, a strategic reserve or a storage tender — every existing merchant asset re-rates upward. That optionality is free and should be noted, but never modelled.',
        '罗马尼亚存在真实的物理充裕度问题，而其选择以价格信号与资本补贴而非容量机制来解决。对投资人而言，这一句话同时概括了全部逻辑与全部风险：需求真实且上升，而国家有意不予以合同化。若该政策取向发生变化 — 引入容量机制、战略备用或储能招标 — 所有既有市场化资产的估值都将上调。这一选择权是免费的，应予记录，但绝不应纳入模型。'],
        sig:['Free option on a future capacity mechanism','对未来容量机制的免费期权'] },
    ] },
  ] };
};

// ============================== WHOLESALE & INTRADAY ==============================
SEC_B.energy = function (){
  const cod = state.codYear, cc = M.codCases[cod] || M.codCases[2028];
  return {
  head: ['Wholesale & Intraday — how much of the spread is executable?','批发与日内市场 — 价差中有多少可执行？'],
  cap: ['This is the primary revenue line and, absent a capacity mechanism, close to the only one a lender can see. The analysis therefore focuses on the executable margin rather than the published spread, and on the COD year rather than today.',
        '这是主要收入来源；在没有容量机制的情况下，也几乎是贷款人唯一能看到的收入来源。因此分析聚焦于可执行价差而非公布价差，并聚焦于投运年度而非当下。'],
  blocks: [
    { t:'card', mt:false, title:['Price level and volatility','价格水平与波动性'], badges:['official','illus'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['DAM weighted-average 2025','2025年日前加权均价'], v:fmtRON(O.dam2025Wap), d:['≈ ' + fmtC(eur(O.dam2025Wap)) + '/MWh','≈ ' + fmtC(eur(O.dam2025Wap)) + '/MWh'], b:['official'] },
        { l:['IDM weighted-average 2025','2025年日内加权均价'], v:fmtRON(O.idm2025Wap), d:[fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0) + ' below day-ahead','较日前低' + fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0)], b:['official'] },
        { l:['DAM weighted-average Jun 2026','2026年6月日前加权均价'], v:fmtRON(O.damJun2026Wap), d:['≈ ' + fmtC(eur(O.damJun2026Wap)) + '/MWh','≈ ' + fmtC(eur(O.damJun2026Wap)) + '/MWh'], b:['official'] },
        { l:['DAM share of consumption','日前市场占消费比重'], v:O.dam2025SharePct + '<small>%</small>', d:[fmt1(O.dam2025TWh) + ' TWh traded in 2025','2025年成交' + fmt1(O.dam2025TWh) + 'TWh'], b:['official'] },
      ] },
      { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtN(v), h: 240, ymin: 0,
        series:[
          { name:['DAM (RON/MWh)','日前市场（RON/MWh）'], color:'var(--s1)', vals: M.damSeries },
          { name:['IDM (RON/MWh)','日内市场（RON/MWh）'], color:'var(--s3)', vals: M.idmSeries, dash: true },
        ] } },
      { t:'note', text:['Only the 2025 annual weighted averages and the June 2026 monthly figure are official anchors. The intra-year shape is an illustrative seed and the RON/EUR rate used throughout is an illustrative mid-rate of ' + fmt1(M.fx) + ' — replace it with the central-bank series before any transaction use, because a 5% FX move changes euro-denominated returns by more than most operating assumptions do.',
        '只有2025年年度加权均价与2026年6月的月度数值是官方锚点。年内形态为示例种子；全篇所用RON/EUR汇率为示意中间价' + fmt1(M.fx) + ' — 任何交易用途前须以央行序列替换，因为5%的汇率变动对以欧元计价收益的影响，大于多数运营假设。'] },
      { t:'why', text:['Two things matter here. Price levels are high by regional standards and rising — the June 2026 monthly average is ' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + '% above the 2025 annual figure. And the day-ahead market clears only ' + O.dam2025SharePct + '% of consumption, so liquidity outside the peak hours is thinner than the headline volume suggests. Both point the same way: model the executable spread on realistic volumes, not the theoretical maximum on the full curve.',
        '此处有两点关键。按区域标准价格水平偏高且在上升 — 2026年6月月均较2025年年度数值高' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + '%。而日前市场仅出清了消费量的' + O.dam2025SharePct + '%，因此高峰时段以外的流动性比总成交量所显示的更薄。两点指向同一结论：应按现实成交量测算可执行价差，而非按完整曲线上的理论最大值。'],
        sig:['Thin liquidity outside peak hours','高峰时段外流动性偏薄'] },
      { t:'src', src: SRC.opcom, use:['Annual and monthly weighted-average prices, traded volumes and market share','年度与月度加权均价、成交量及市场份额'] },
    ] },

    { t:'card', title:['Published → executable margin bridge (€/MWh discharged)','公布至可执行价差桥（€/MWh放电）'], badges:['calc','illus'], live:true, blocks:[
      { t:'wf', cfg:{ yfmt: v => fmtC(v), h: 290, steps: M.spreadBridge } },
      { t:'why', text:['About ' + fmtPct((1 - 62 / 85) * 100, 0) + '% of the published spread is lost before it reaches the P&L, which is a smaller haircut than Ireland’s and a similar one to GB’s. The Romanian deductions are ordinary — liquidity, efficiency, availability, fees — rather than structural, because there is no central scheduling and no binding system-penetration limit standing between the price signal and the trade. That is the compensating advantage of an energy-only design: what you see is closer to what you can execute.',
        '公布价差中约' + fmtPct((1 - 62 / 85) * 100, 0) + '%在进入损益表前即已损失，折减幅度小于爱尔兰，与英国接近。罗马尼亚的扣减项属常规性 — 流动性、效率、可用率、费用 — 而非结构性，因为价格信号与实际交易之间既无集中调度，也无硬性的系统渗透率上限。这正是单一电能量设计的补偿性优势：所见更接近所能执行。'],
        sig:['Ordinary haircuts, not structural ones','折减属常规而非结构性'] },
    ] },

    { t:'card', title:['Captured spread by COD year — the competition discount','按投运年度的捕获价差 — 竞争折扣'], badges:['forecast','illus'], live:true, blocks:[
      { t:'band', cfg:{ xs: Object.keys(M.codCases), yfmt: v => fmtC(v), h: 260,
        low: Object.values(M.codCases).map(c => c.low),
        base: Object.values(M.codCases).map(c => c.central),
        high: Object.values(M.codCases).map(c => c.high) } },
      { t:'cmp', items:[
        { h:['Captured spread at COD ' + cod,'投运年' + cod + '的捕获价差'], v:fmtC(cc.central) + '/MWh',
          s:['low ' + fmtC(cc.low) + ' · high ' + fmtC(cc.high) + ' — the case spread is the real risk','低' + fmtC(cc.low) + ' · 高' + fmtC(cc.high) + ' — 情景间差距才是真实风险'] },
        { h:['Competition dilution factor','竞争稀释系数'], v:fmtPct(dilutionAt(+cod) * 100, 0), s:['relative to a 2028 reference COD','相对于2028年基准投运年'] },
      ] },
      { t:'why', text:['The central case falls from ' + fmtC(M.codCases[2027].central) + ' to ' + fmtC(M.codCases[2029].central) + '/MWh across three COD years — a ' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '% decline driven entirely by competing storage arriving. With no capacity payment to cushion it, COD year is the single most valuable variable a Romanian sponsor controls. Every month of permitting or connection delay is directly priced into the merchant line, which is why the diligence budget belongs on the connection chain rather than on the price forecast.',
        '中性情景下，三个投运年度之间捕获价差由' + fmtC(M.codCases[2027].central) + '降至' + fmtC(M.codCases[2029].central) + '/MWh — 下降' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '%，其驱动完全来自竞争性储能的到场。由于没有容量付费缓冲，投运年度是罗马尼亚发起人可控的最有价值变量。许可或并网每延迟一个月都会被直接计入市场化收入，这正是尽调预算应投向并网链条而非价格预测的原因。'],
        sig:['Delay is priced directly into revenue','延迟被直接计入收入'] },
    ] },
  ] };
};

// ============================== BALANCING & RESERVES ==============================
SEC_B.services = function (){
  return {
  head: ['Balancing & Reserves — real revenue, largely unevidenced','平衡与备用 — 收入真实，但大多缺乏证据'],
  cap: ['Balancing is where Romanian storage models find their upside and where they are least supported by evidence. This tab separates what is observable from what is assumed, using an explicit five-tier evidence ladder.',
        '平衡市场是罗马尼亚储能模型寻找上行空间之处，也是其证据支持最薄弱之处。本页以显式的五级证据阶梯，区分可观察事实与假设。'],
  blocks: [
    { t:'card', mt:false, title:['Reserve products — requirement, price and direction','备用产品 — 需求、价格与方向'], badges:['illus','verify'], live:true, blocks:[
      { t:'table', head:[['Product','产品'],['Direction','方向'],['Requirement (MW)','需求(MW)'],['Capacity price (€/MW/h)','容量价格(€/MW/h)'],['Battery suitability','电池适配度']], num:[2,3],
        rows:[
          [{ b:['FCR — ' + M.balProducts[0].n[0], 'FCR — ' + M.balProducts[0].n[1]] }, M.balProducts[0].dir, fmtN(M.balProducts[0].reqMW), fmtC(M.balProducts[0].capEurMWh), { chip:'good', text:['High — power, not energy','高 — 需功率而非能量'] }],
          [{ b:['aFRR — ' + M.balProducts[1].n[0], 'aFRR — ' + M.balProducts[1].n[1]] }, M.balProducts[1].dir, fmtN(M.balProducts[1].reqMW), fmtC(M.balProducts[1].capEurMWh), { chip:'good', text:['High — the main battery product','高 — 电池的主力产品'] }],
          [{ b:['mFRR — ' + M.balProducts[2].n[0], 'mFRR — ' + M.balProducts[2].n[1]] }, M.balProducts[2].dir, fmtN(M.balProducts[2].reqMW), fmtC(M.balProducts[2].capEurMWh), { chip:'warn', text:['Moderate — deep volume, low price','中等 — 量大价低'] }],
        ] },
      { t:'bar', cfg:{ xs: M.balProducts.map(p => p.id), mode:'group', bw: 26, yfmt: v => fmtN(v), h: 240,
        series:[
          { name:['Requirement (MW)','需求(MW)'], color:'var(--s1)', vals: M.balProducts.map(p => p.reqMW) },
          { name:['Capacity price (€/MW/h)','容量价格(€/MW/h)'], color:'var(--s3)', vals: M.balProducts.map(p => p.capEurMWh) },
        ] } },
      { t:'why', text:['The product structure is the familiar European one and the economics point the same way as everywhere else: the small, fast, power-based products pay the highest unit price and saturate first; the large, slow, energy-based product pays least per MW but has the deepest volume. A 2-hour Romanian battery should target aFRR as its primary balancing product and treat mFRR as volume filler, not the reverse.',
        '产品结构为欧洲通行形态，其经济性指向与其他市场一致：规模小、响应快、以功率为基础的产品单位价格最高且最先饱和；规模大、响应慢、以能量为基础的产品单位价格最低但成交量最深。罗马尼亚的2小时电池应以aFRR为主力平衡产品，并将mFRR作为成交量补充，而非相反。'],
        sig:['aFRR primary, mFRR filler','aFRR为主力，mFRR作补充'] },
      { t:'src', src: SRC.tel, use:['Reserve procurement volumes, capacity prices and activation results','备用采购量、容量价格与激活结果'] },
    ] },

    { t:'card', title:['aFRR capacity price trend — the saturation signal','aFRR容量价格趋势 — 饱和信号'], badges:['illus'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.qLabels, yfmt: v => fmtC(v), h: 220, ymin: 0,
        series:[{ name:['aFRR-up capacity price (€/MW/h)','aFRR上调容量价格（€/MW/h）'], color:'var(--s6)', vals: M.afrrCapSeries }] } },
      { t:'kpis', items:[
        { l:['aFRR-up capacity price change','aFRR上调容量价格变化'], v:fmtPct((M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0), d:['over six quarters','六个季度内'], cls:'down', b:['illus'] },
        { l:['Average activation price, up','平均上调激活价格'], v:fmtRON(M.balActUp) + '<small>/MWh</small>', d:['≈ ' + fmtC(eur(M.balActUp)) + '/MWh','≈ ' + fmtC(eur(M.balActUp)) + '/MWh'], b:['illus'] },
        { l:['Average activation price, down','平均下调激活价格'], v:fmtRON(M.balActDn) + '<small>/MWh</small>', d:['≈ ' + fmtC(eur(M.balActDn)) + '/MWh — the charging opportunity','≈ ' + fmtC(eur(M.balActDn)) + '/MWh — 充电机会'], b:['illus'] },
      ] },
      { t:'why', text:['The aFRR capacity price is already down ' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% over six quarters as more capable capacity qualifies — the same pattern GB and Ireland went through, arriving in Romania later and from a lower base. Model balancing capacity revenue flat at best, and note that the up/down activation spread is itself a trading opportunity: being paid ' + fmtC(eur(M.balActUp)) + '/MWh to discharge and ' + fmtC(eur(M.balActDn)) + '/MWh to charge is a wider margin than the day-ahead spread, when it is available.',
        '随着更多有能力的容量取得资格，aFRR容量价格在六个季度内已下降' + fmtPct(Math.abs(M.afrrCapSeries[5] / M.afrrCapSeries[0] - 1) * 100, 0) + '% — 与英国、爱尔兰经历的模式相同，只是在罗马尼亚出现更晚、起点更低。平衡容量收入最多按持平建模；同时须注意上调/下调激活价差本身即是交易机会：以' + fmtC(eur(M.balActUp)) + '/MWh放电、以' + fmtC(eur(M.balActDn)) + '/MWh充电，在可获得时其margin宽于日前价差。'],
        sig:['Activation spread beats the day-ahead spread','激活价差优于日前价差'] },
    ] },

    { t:'card', title:['Evidence ladder — underwrite only to the tier the project has reached','证据阶梯 — 只按项目已达到的层级承销'], badges:['calc'], live:false, blocks:[
      { t:'ladder', items: M.evidenceLadder },
      { t:'warn', text:['Most Romanian projects presented to investors sit at tier 1: published market results exist, but the specific project has no prequalification, no reproducible backtest and no activation record. Balancing revenue claimed above the tier reached is an assumption, not a forecast.',
        '向投资人展示的多数罗马尼亚项目处于第1级：公开市场结果确实存在，但具体项目既无预认证、无可复现回测，也无激活记录。超出所达层级的平衡收入主张是假设，而非预测。'] },
      { t:'why', text:['This ladder is the single most useful diligence tool in the Romanian dashboard because it converts a vague question ("is the balancing revenue real?") into a documentary one ("which tier has this project reached, and what is the document?"). At ' + fmtCk(M.lab.servicesKW * 1000) + '/MW/yr the balancing line is roughly ' + fmtPct(M.lab.servicesKW * 1000 / (M.lab.servicesKW * 1000 + M.lab.spread * 2 * 0.91 * 1.4 * 365 * 0.96) * 100, 0) + '% of a 2-hour asset’s gross revenue — large enough that an unevidenced assumption here can carry an otherwise failing case over the line.',
        '这一阶梯是罗马尼亚看板中最有用的单项尽调工具，因为它把一个模糊问题（“平衡收入是否真实？”）转化为文件问题（“该项目达到哪一层级？对应文件是什么？”）。按' + fmtCk(M.lab.servicesKW * 1000) + '/MW/年计，平衡收入约占2小时资产毛收入的' + fmtPct(M.lab.servicesKW * 1000 / (M.lab.servicesKW * 1000 + M.lab.spread * 2 * 0.91 * 1.4 * 365 * 0.96) * 100, 0) + ' — 其规模足以使一个本不成立的投资案例因这一未经证实的假设而勉强通过。'],
        sig:['Which tier, and what is the document?','处于哪一层级？文件是什么？'] },
    ] },
  ] };
};

// ============================== STORAGE DURATION ==============================
SEC_B.duration = function (){
  const dni = liveScore('durFactors'), band = bandFor(M.durBands, dni);
  return {
  head: ['Storage Duration — is 2h or 4h right for this price shape?','储能时长 — 对当前价格形态，2小时还是4小时正确？'],
  cap: ['With no capacity mechanism paying for duration, the fourth hour in Romania has to earn its capex from arbitrage, wider balancing access and grant eligibility alone. This tab tests whether it does.',
        '由于没有容量机制为时长付费，罗马尼亚的第4小时必须仅靠套利、更广的平衡市场准入与补贴资格来偿付其造价。本页对此进行检验。'],
  blocks: [
    { t:'card', mt:false, title:['Duration answers three different questions','时长回答三个不同问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Mechanism','机制'],['Answer for Romania at 2h → 4h','罗马尼亚由2小时增至4小时的答案']], rows:[
        [{b:['How much capacity revenue?','容量收入多少？']}, ['No capacity mechanism exists','不存在容量机制'],
         ['Zero. This is the structural difference from every other market in the comparison set.','为零。这是与本对比样本中所有其他市场的结构性差异。']],
        [{b:['How much merchant revenue?','市场化收入多少？']}, ['Deeper cycles across a solar-driven price shape','在光伏驱动的价格形态中进行更深循环'],
         ['Positive but sub-linear — 4h captures ' + fmtPct(M.durSpreadFactor[4] * 100, 0) + ' of the 2h spread capture rate','为正但呈次线性 — 4小时的价差捕获率为2小时的' + fmtPct(M.durSpreadFactor[4] * 100, 0)]],
        [{b:['Am I eligible for anything?','是否具备政策资格？']}, ['State-aid scheme MWh minimums','国家援助计划的MWh下限'],
         ['Yes — the grant is the only structural reason to add MWh, which makes duration a policy decision rather than a trading one','是 — 补贴是增配MWh的唯一结构性理由，这使时长成为政策决策而非交易决策']],
      ] },
      { t:'wf', cfg:{ yfmt: v => fmtC(v) + 'k', h: 280, steps: M.marginalHour } },
      { t:'why', text:['The fourth hour nets about ' + fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k/MW/yr — positive, but only because grant eligibility contributes ' + fmtC(6) + 'k of it. Strip the grant and the fourth hour is roughly break-even, which is the honest reading: in an energy-only market the market itself does not pay for duration. Build 2h and buy the option to add the third and fourth hours later, when either the price shape or the scheme rules make them worth committing.',
        '第4小时净值约' + fmtC(M.marginalHour[M.marginalHour.length - 1].v) + 'k/MW/年 — 为正，但其中' + fmtC(6) + 'k来自补贴资格。剔除补贴后第4小时大致盈亏平衡，这才是诚实的解读：在单一电能量市场中，市场本身并不为时长付费。应建设2小时并买入日后增配第三、第四小时的选择权，待价格形态或计划规则足以支撑时再行投入。'],
        sig:['Without the grant, the fourth hour is flat','剔除补贴后第4小时大致持平'] },
    ] },

    { t:'card', title:['Duration Economics Scorecard — every component visible and editable','时长经济性评分卡 — 分项全部可见、可编辑'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
      { t:'why', text:['The index sits at ' + dni + '/100 — ' + L(band.n) + '. The factor doing most of the work is solar build-out and midday trough depth (score 3), which is a genuine physical driver. The two holding it down are cross-border coupling (score 1: Romania is coupled to a large European market that damps extreme spreads) and lender downside coverage (score 1: there is no contracted floor to lend against). Read together: the physical case for duration is stronger than the financial case, which is exactly why augmentation optionality rather than upfront MWh is the right structure.',
        '该指数为' + dni + '/100 — ' + L(band.n) + '。贡献最大的因子是光伏扩张与午间低谷深度（评分3），这是真实的物理驱动。压低它的两个因子是跨境耦合（评分1：罗马尼亚与庞大的欧洲市场耦合，极端价差被平抑）与贷款人下行保障（评分1：不存在可供放贷的合同保底）。综合解读：时长的物理理由强于财务理由 — 这正是“增容选择权而非前置MWh”才是正确结构的原因。'],
        sig:['Physical case > financial case','物理理由强于财务理由'] },
    ] },

    { t:'card', title:['Augmentation readiness — the option to add hours later','增容准备度 — 日后增加小时数的选择权'], badges:['illus'], live:false, blocks:[
      { t:'aug' },
      { t:'why', text:['In Romania the augmentation option is the duration strategy, not a refinement of it. The two items most often lost are the ATR treatment of an MWh-only augmentation and the grant-scheme treatment of augmented capacity — both are cheap to establish at the outset, both are effectively impossible to retrofit, and either one alone can make the option unexercisable when the second window opens after thermal retirement.',
        '在罗马尼亚，增容选择权本身即是时长策略，而非其补充。最常被遗漏的两项是“仅增MWh时的ATR处理”与“补贴计划对增容部分的处理” — 两者在项目起始阶段建立成本低廉，事后则几乎无法补救；其中任一项缺失，都可能导致火电退役后第二个窗口开启时该选择权无法行使。'],
        sig:['Two clauses decide whether the option exists','两项条款决定选择权是否存在'] },
    ] },
    
    /* Relocated from the Investment Lab tab, which moved to a dedicated page. The
       duration question is a market question — where the de-rating uplift stops
       covering the MWh capex — so it belongs beside the rest of this tab rather
       than inside a returns model. */
    { t:'card', title:['Duration and route — what each design is worth','时长与路径 — 各设计的价值'], badges:['calc'], live:false, blocks:[
      { t:'designFit' },
      { t:'cap', text:['Every route this market supports, at every duration it declares, priced by the comparison engine the league table uses; at the modelled duration it is the league table case itself. Value is the exit value at commercial operation, at the platform exit yields, less net capital, per MW. A design within 2% of the capital of the modelled design of the best one is in the band. A route priced at one duration is shown there only, and a duration floor must hold to the end of its term.',
        '本市场支持的每一条路径、在其声明的每一个时长下，均由排行榜所用的同一比较引擎定价；在当前模型时长下即为排行榜本身的情景。价值为投运时按平台退出收益率计算的退出价值减去净资本，按每MW计。与最佳设计相差不超过当前模型设计资本2%的设计视为位于区间之内。仅在单一时长下定价的路径只在该时长下显示，且时长下限须维持至期限结束。'] },
      { t:'why', text:['Judge a duration on what it adds to value, not on headline IRR: a longer asset can carry a lower IRR and a higher value, and the capital committed differs several-fold down this table. Read the band before the best point, because inside it the inputs cannot separate the designs.',
        '判断时长应看其对价值的贡献，而非项目整体IRR：更长的资产可能IRR更低而价值更高，且本表各行所投入的资本相差数倍。应先看区间，再看最佳点，因为在区间之内，输入数据无法区分各设计。'],
        sig:['Read the band, then the best point','先看区间，再看最佳点'] },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  const mw = pipelineByYear('MW');
  const totRaw = mw.raw.reduce((a, b) => a + b, 0), totPw = mw.pw.reduce((a, b) => a + b, 0);
  return {
  head: ['Project Pipeline — probability-weighted, with MW and MWh separated','项目管线 — 概率加权，MW与MWh分列'],
  cap: ['A pipeline is a distribution, not a number. In Romania the gate that matters is the ATR plus an executed connection agreement, and the announced pipeline sits mostly below it.',
        '管线是一个分布而非一个数字。在罗马尼亚，关键门槛是ATR加已签并网合同，而已公告管线大部分尚未跨过该门槛。'],
  blocks: [
    { t:'card', mt:false, title:['Stage probabilities — the gate is the discount','阶段概率 — 门槛即折减'], badges:['calc'], live:false, blocks:[
      { t:'stageProb' },
      { t:'why', text:['The probability step that matters is establishment authorisation (25%) to ATR obtained (45%) to ready-to-build (70%). ' + fmtN(O.authFeb2026MW) + ' MW of authorisations approved in a single regulatory meeting therefore represents roughly ' + fmtN(O.authFeb2026MW * 0.25) + ' MW on a probability-weighted basis — real, but a quarter of the headline. Announcements and authorisations are the two numbers most often quoted and the two least informative.',
        '真正关键的概率跃迁是由设立许可（25%）到取得ATR（45%）再到具备开工条件（70%）。因此单次监管会议核准的' + fmtN(O.authFeb2026MW) + 'MW许可，按概率加权约相当于' + fmtN(O.authFeb2026MW * 0.25) + 'MW — 真实存在，但仅为表面数字的四分之一。公告与许可是最常被引用、也最缺乏信息量的两个数字。'],
        sig:['Authorisations are worth a quarter of headline','许可的实际价值约为表面数字的四分之一'] },
    ] },
    { t:'g2', cards:[
      { title:['COD pipeline by year — MW','按投运年度的管线 — MW'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MW' },
        { t:'why', text:['Probability weighting removes ' + fmtPct((1 - totPw / totRaw) * 100, 0) + '% of announced MW across the seed register. In a market with no capacity payment, that discount matters more than elsewhere: competing MW arrives directly against your spread with nothing to cushion it.',
          '在种子登记表中，概率加权剔除了已公告MW的' + fmtPct((1 - totPw / totRaw) * 100, 0) + '%。在没有容量付费的市场中，这一折减比其他市场更重要：竞争性MW直接冲击你的价差，且没有任何缓冲。'],
          sig:['Competing MW hits the spread directly','竞争性MW直接冲击价差'] },
      ] },
      { title:['COD pipeline by year — MWh','按投运年度的管线 — MWh'], badges:['illus'], live:true, blocks:[
        { t:'pipeChart', unit:'MWh' },
        { t:'why', text:['MWh is the series that predicts spread compression, and in Romania it is the only saturation series that matters — there is no capacity auction for MW to saturate. Track MWh reaching energisation quarterly; it is the leading indicator for the captured-spread decline from ' + fmtC(M.codCases[2027].central) + ' to ' + fmtC(M.codCases[2029].central) + '/MWh.',
          'MWh序列预测价差压缩，而在罗马尼亚它是唯一重要的饱和序列 — 因为不存在可供MW饱和的容量拍卖。应按季度跟踪达到送电的MWh；它是捕获价差由' + fmtC(M.codCases[2027].central) + '降至' + fmtC(M.codCases[2029].central) + '/MWh的领先指标。'],
          sig:['Track MWh energised, quarterly','按季度跟踪已送电MWh'] },
      ] },
    ] },
    { t:'card', title:['Project register — illustrative placeholders, not real facilities','项目登记表 — 示例占位，非真实项目'], badges:['illus'], live:true, blocks:[
      { t:'projTable' },
      { t:'note', text:['All projects shown are illustrative placeholders, tagged by county so locational concentration can be checked. Replace with a register built from ATR issuance and establishment authorisations before any transaction use, and de-duplicate against the indicative capacity map, which is a screening tool only.',
        '所示项目均为示例占位，并按县标注以便检查区位集中度。任何交易用途前，须以基于ATR签发与设立许可构建的登记数据替换，并与示意性容量地图去重 — 后者仅为筛选工具。'] },
    ] },
  ] };
};

// ============================== GRID & PERMITTING ==============================
SEC_B.grid = function (){
  return {
  head: ['Grid & Permitting — a chain of approvals, not a binary status','并网与许可 — 一连串审批与合同，而非二元状态'],
  cap: ['Connection and permitting are where Romanian development capital is lost, and the failure mode is a category error rather than a technical one — treating a capacity map, an authorisation or a scheme budget as evidence of a project.',
        '并网与许可是罗马尼亚开发资本损失之处，且其失效模式是类别错误而非技术错误 — 将容量地图、许可或计划预算视为项目的证据。'],
  blocks: [
    { t:'card', mt:false, title:['Nameplate → revenue bridge','铭牌容量至收入桥'], badges:['calc','illus'], live:true, blocks:[
      { t:'flow', items:[
        ['Indicative capacity map','示意性容量地图'], ['Establishment authorisation','设立许可'],
        ['ATR — technical connection permit','ATR — 技术并网许可'], ['Executed connection agreement','已签并网合同'],
        ['Energisation & unrestricted operation','送电与无限制运行'], ['Market & balancing registration','市场与平衡市场注册'],
      ] },
      { t:'ladder', items:[
        { n:['Indicative capacity map','示意性容量地图'], d:['A screening tool published by the system operator. It is never a financeable right and it changes without notice.','系统运营方公布的筛选工具。它绝非可融资权利，且会在无预告的情况下变更。'] },
        { n:['Establishment authorisation','设立许可'], d:['A permit to develop, not capacity to connect. Approved in volume; converts at roughly a quarter.','这是开发许可，而非并网容量。批量核准，转化率约四分之一。'] },
        { n:['ATR','ATR'], d:['The technical connection permit with a defined capacity and validity period. This is the first tier that is evidence.','载明容量与有效期的技术并网许可。这是第一个构成证据的层级。'] },
        { n:['Executed connection agreement','已签并网合同'], d:['Works scope, cost allocation and delivery responsibility become binding. Model against this, not the ATR alone.','工程范围、费用分担与交付责任在此具备约束力。应据此建模，而非仅凭ATR。'] },
        { n:['Energisation & registration','送电与注册'], d:['Unrestricted operation plus market and balancing-responsible-party registration. Revenue starts here, not at mechanical completion.','无限制运行加市场及平衡责任方注册。收入自此开始，而非自机械完工开始。'] },
      ] },
      { t:'why', text:['Five tiers, and the first two are the ones most often presented as a project. ' + fmtN(O.authFeb2026MW) + ' MW of authorisations approved in a single meeting is the clearest illustration: that volume is genuine developer interest, and almost none of it holds an ATR with adequate capacity at a location with a real price spread. The diligence question is not "does the project have permits" but "which tier, and what is the document number".',
        '共五个层级，而最常被当作项目呈现的是前两个。单次会议核准' + fmtN(O.authFeb2026MW) + 'MW许可是最清晰的例证：该体量代表真实的开发商兴趣，但其中几乎没有项目在具备真实价差的位置持有容量充足的ATR。尽调问题不是“项目是否有许可”，而是“处于哪一层级？文件编号是什么”。'],
        sig:['Which tier, and what is the document number?','处于哪一层级？文件编号为何？'] },
    ] },

    { t:'card', title:['Guarantees — capital at risk before financial close','保函 — 融资交割前的风险资本'], badges:['verify'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Allocation-auction participation guarantee','容量分配拍卖参与保函'], v:fmtC(O.auctionGuarEurMW) + '<small>/MW</small>', d:['verify the current documentation and release path','须核验现行文件与释放路径'], b:['verify'] },
        { l:['Connection-tariff guarantee','并网费保函'], v:O.connTariffGuarPct + '<small>%</small>', d:['of the connection tariff — verify applicability','占并网费的比例 — 须核验适用性'], b:['verify'] },
        { l:['Establishment-authorisation guarantee','设立许可保函'], v:fmtC(O.estabGuarEurKW) + '<small>/kW</small>', d:['verify return and forfeiture conditions','须核验返还与没收条件'], b:['verify'] },
        { l:['Guarantee cost on a 50 MW / 2h project','50MW/2小时项目的保函成本'], v:fmtCM(50 * O.auctionGuarEurMW + 50 * 1000 * O.estabGuarEurKW), d:['illustrative combined exposure before financial close','示例：融资交割前的合计敞口'], b:['calc'] },
      ] },
      { t:'warn', text:['Guarantee mechanics are still evolving and must be verified per transaction against the order in force. Capital posted against auction, connection and authorisation guarantees is capital at risk until the release conditions are documented in the share purchase agreement — and forfeiture conditions are frequently drafted more broadly than sponsors assume.',
        '保函机制仍在演变，每笔交易均须对照现行法令核验。为拍卖、并网与设立许可保函缴付的资金，在释放条件于股权买卖协议中形成书面约定之前均属风险资本 — 且没收条件的拟定范围往往比发起人预期的更宽。'] },
      { t:'why', text:['On a 50 MW project the combined guarantee exposure is roughly ' + fmtCM(50 * O.auctionGuarEurMW + 50 * 1000 * O.estabGuarEurKW) + ' posted before financial close — meaningful development capital sitting against conditions the sponsor does not control. Negotiate the release mechanics in the SPA before posting, not after, and price the carrying cost of that capital into the development budget rather than treating it as a deposit.',
        '对50MW项目，融资交割前缴付的保函合计敞口约为' + fmtCM(50 * O.auctionGuarEurMW + 50 * 1000 * O.estabGuarEurKW) + ' — 这是一笔可观的开发资本，且其释放取决于发起人无法控制的条件。应在缴付之前而非之后于股权买卖协议中谈定释放机制，并将该资金的持有成本计入开发预算，而非视为押金。'],
        sig:['Negotiate release before posting','缴付前先谈定释放机制'] },
      { t:'src', src: SRC.anre, use:['Connection rules, guarantees and allocation auctions','并网规则、保函与分配拍卖'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['Indicative map capacity not available at ATR stage','示意性地图容量在ATR阶段不可得']},
         ['ATR with a specified capacity and validity period as a hard condition precedent','以载明容量与有效期的ATR为硬性先决条件'],
         ['Any reliance on the capacity map in the investment case','投资案例中对容量地图的任何依赖']],
        [{b:['ATR expires before financial close','ATR在融资交割前失效']},
         ['Validity-period covenant with an extension obligation and a price adjustment','有效期契约，附延期义务及价款调整'],
         ['Less than twelve months of ATR validity remaining','ATR剩余有效期不足十二个月']],
        [{b:['Network reinforcement scope or cost shifts','网络加强范围或费用变动']},
         ['Cost-sharing cap above an agreed threshold and clear delivery responsibility','超出约定阈值的成本分担上限及明确的交付责任划分'],
         ['Any revision to the works scope or estimate','工程范围或估算的任何修订']],
        [{b:['Grant not awarded or reduced','补贴未获授予或被削减']},
         ['Formal award letter as a condition precedent; equity bridge sized for the no-grant case','以正式授予函为先决条件；股权过桥资金按无补贴情景配置'],
         ['Grant assumed in the base case','基准情景假设取得补贴']],
        [{b:['Balancing revenue not realised','平衡收入未能实现']},
         ['Earn-out or deferred consideration linked to prequalification and a first activation record','与预认证及首次激活记录挂钩的对赌或递延对价'],
         ['Balancing revenue above evidence tier 2','平衡收入主张超出第2证据层级']],
      ] },
      { t:'why', text:['Every protection here converts an administrative risk into a priced or allocated one, which is the only thing that can be done with Romanian development exposure. The two that matter most are the ATR validity covenant and the grant award condition precedent — both are routinely omitted, and each on its own can turn a completed acquisition into a project that cannot reach financial close.',
        '此处每项保护都把行政风险转化为可定价或可分配的风险，而这也是应对罗马尼亚开发敞口的唯一手段。其中最关键的是ATR有效期契约与补贴授予先决条件 — 两者常被遗漏，且任一项缺失都可能使一笔已完成的收购变成无法走到融资交割的项目。'],
        sig:['ATR validity and award condition first','优先落实ATR有效期与授予条件'] },
      { t:'src', src: SRC.telmap, use:['Indicative available connection capacity — screening only, never a financeable right','示意性可用并网容量 — 仅供筛选，绝非可融资权利'] },
    ] },
  ] };
};

// ============================== ROMANIA vs POLAND (peer benchmark) ==============================
// Mirrors the WA dashboard's "WEM vs NEM" section: the only tab that uses peer-market
// data, held in a separate namespace and excluded from every Romania scoring input.
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
SEC_B.portfolio = function (){
  const inp = labInputs(), r = labModel(inp);
  const dn = labModel(inp, { spreadFactor: 0.75, svcFactor: 0.6, noGrant: true });
  return {
  head: ['Portfolio / Fund View — applying the Romanian thesis to a screened opportunity','组合与基金视图 — 将罗马尼亚逻辑应用于所筛选机会'],
  cap: ['A worked screening example using the Investment Lab assumptions. All project-specific content is confined to this tab and is illustrative — it demonstrates the gate sequence an investment committee should apply, not a real transaction.',
        '使用投资测算假设的筛选示例。所有项目层面内容均限于本页且为示例性质 — 用于演示投委会应遵循的门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Screened opportunity — institutional screening snapshot','所筛选机会 — 机构筛选快照'], badges:['illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Configuration','配置'], v:fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>', d:[inp.hours + '-hour core with augmentation optionality','' + inp.hours + '小时核心设计并保留增容选择权'] },
        { l:['Target COD','目标投运'], v:state.codYear, d:['dilution factor ' + fmtPct(dilutionAt(+state.codYear) * 100, 0),'稀释系数' + fmtPct(dilutionAt(+state.codYear) * 100, 0)] },
        { l:['Total capex','总资本开支'], v:fmtCM(r.capex), d:['grant ' + fmtCM(r.grant) + ' — award letter required','补贴' + fmtCM(r.grant) + ' — 须取得授予函'], b:['model'] },
        { l:['Year-1 merchant revenue','第1年市场化收入'], v:fmtCM(r.arb1), d:['plus balancing ' + fmtCM(r.svc1),'另加平衡收入' + fmtCM(r.svc1)], b:['calc'] },
        { l:['Year-1 EBITDA','第1年EBITDA'], v:fmtCM(r.ebitda1), d:['unlevered IRR ' + fmtIRR(r.unlevIRR),'无杠杆IRR ' + fmtIRR(r.unlevIRR)], b:['calc'] },
        { l:['Min DSCR — lender downside','最低偿债覆盖率 — 贷款人下行'], v:fmtX(dn.minDSCR), d:['no grant, −25% spread, −40% balancing','无补贴、价差−25%、平衡−40%'], cls: dn.minDSCR != null && dn.minDSCR < 1.3 ? 'down' : '', b:['calc'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['A Romanian screening decision turns on three documents and one negotiation: the ATR, the executed connection agreement, the grant award letter, and a bilateral floor or tolling arrangement. The financial model is comparatively straightforward; the evidence pack is not. If the first three documents are not in hand, the correct answer is to price the opportunity as development risk rather than as an asset.',
              '罗马尼亚的筛选决策取决于三份文件与一项谈判：ATR、已签并网合同、补贴授予函，以及双边保底或代工安排。财务模型相对直接，证据资料包则不然。若前三份文件尚未到手，正确做法是按开发风险而非按资产为该机会定价。'] },
    ] },
    { t:'card', title:['Revenue stack — evidence status of each line','收入结构 — 各收入项的证据状态'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Revenue line','收入项'],['Year-1 amount','第1年金额'],['Evidence status','证据状态'],['Treatment in the model','模型处理方式']], num:[1], rows:[
        [{b:['Capacity mechanism','容量机制']}, fmtC(0), {chip:'critical', text:['Does not exist in Romania','在罗马尼亚不存在']},
         ['Zero by design — the structural difference from every peer market','按设计为零 — 与所有同业市场的结构性差异']],
        [{b:['Wholesale arbitrage','批发套利']}, fmtCM(r.arb1), {chip:'warn', text:['Executable margin, competition-diluted','可执行价差，已按竞争稀释']},
         ['Primary revenue line; equity risk with no contractual support','主要收入来源；属股权风险，无合同支持']],
        [{b:['Balancing & reserves','平衡与备用']}, fmtCM(r.svc1), {chip:'serious', text:['Evidence tier 1 for most projects','多数项目仅达第1证据层级']},
         ['Underwrite only to the tier reached; exclude above tier 2 from debt sizing','只按已达层级承销；超出第2层级的部分排除于债务规模测算']],
        [{b:['Capital grant','资本补贴']}, fmtCM(r.grant), {chip:'warn', text:['Award letter required — budget is not award','须取得授予函 — 预算不等于授予']},
         ['A capex reduction, not revenue; removed entirely in the lender case','属资本开支减项而非收入；在贷款人情景中完全剔除']],
        [{b:['Fixed opex','固定运维']}, '−' + fmtCM(r.opex), {chip:'good', text:['LTSA and O&M contracted','长期服务协议与运维已签约']},
         ['Check warranty cycling limits against the ' + inp.cycles + ' cycles/day assumption','须核对质保循环限制与每日' + inp.cycles + '次循环假设是否一致']],
      ] },
      { t:'why', text:['Zero per cent of gross revenue is contracted, which is the single most important line in this table and the reason Romanian gearing is structurally lower than Polish, Irish or British gearing for an identical asset. The three available responses are lower debt, a development-bank lender that will take merchant risk, or a negotiated bilateral floor. Choose which one before building the model, because each implies a different capital structure and a different buyer at exit.',
        '毛收入中合同化部分为零 — 这是本表最重要的一行，也是同一资产在罗马尼亚的杠杆结构性低于波兰、爱尔兰或英国的原因。可选的三种应对是：降低债务、寻求愿承担市场化风险的开发性银行、或谈判取得双边保底。应在建模之前作出选择，因为每一种都意味着不同的资本结构与不同的退出买家。'],
        sig:['Zero contracted — choose the response first','合同化为零 — 应先选定应对方式'] },
    ] },
    { t:'card', title:['Investment Committee gates — what must be true before capital is released','投委会门槛 — 资金拨付前必须成立的条件'], badges:['calc'], live:false, blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — ATR','门槛1 — ATR'], d:['An ATR with adequate capacity and at least twelve months of remaining validity at the modelled financial close.','在模型所设融资交割时点，持有容量充足且剩余有效期不少于十二个月的ATR。'], c:'warn', s:['Evidence required','需提供证据'] },
        { n:['Gate 2 — Connection agreement','门槛2 — 并网合同'], d:['Executed, with works scope, cost allocation and delivery responsibility defined and a long-stop tied to energisation.','已签署，且明确工程范围、费用分担与交付责任，并将最终截止日挂钩送电。'], c:'warn', s:['Executed only','仅接受已签署'] },
        { n:['Gate 3 — Grant award','门槛3 — 补贴授予'], d:['A formal award letter, or an investment case that stands without the grant. A scheme budget is never sufficient.','取得正式授予函，或投资逻辑在无补贴情况下仍然成立。计划预算永远不构成充分条件。'], c:'serious', s:['Letter or no-grant case','授予函或无补贴情景'] },
        { n:['Gate 4 — Downside coverage','门槛4 — 下行覆盖'], d:['Minimum DSCR of at least 1.30x with no grant and stressed merchant and balancing revenue.','在无补贴且市场化与平衡收入承压的情况下，最低偿债覆盖率不低于1.30x。'], c: dn.minDSCR != null && dn.minDSCR >= 1.3 ? 'good' : 'critical', s: dn.minDSCR != null && dn.minDSCR >= 1.3 ? ['Met','已满足'] : ['Not met','未满足'] },
        { n:['Gate 5 — Exit specification','门槛5 — 退出规格'], d:['A defined buyer universe: either a negotiated floor that makes the asset conventional infrastructure, or a merchant buyer that prices Romanian spread risk.','明确的买家群体：要么谈成保底使资产成为常规基础设施，要么找到愿为罗马尼亚价差风险定价的市场化买家。'], c:'serious', s:['Design for it now','须在当下即行设计'] },
      ] },
      { t:'why', text:['The gates are ordered so the cheapest test comes first, and in Romania the first three are all documentary. Gate 4 is where the absence of a capacity mechanism becomes visible: the same project that passes comfortably in Poland or Ireland can fail here on coverage alone, and no amount of modelling fixes that. Gate 5 is the one most often deferred, and deferring it is how a fund ends up owning a merchant Romanian asset it cannot sell.',
        '门槛按“最便宜的检验优先”排序，而在罗马尼亚前三关均属文件性。第4关是“没有容量机制”显现之处：在波兰或爱尔兰可以轻松通过的同一项目，在此可能仅因偿债覆盖不足而失败，且任何建模都无法弥补。第5关最常被推迟，而推迟它正是基金最终持有一项无法出售的罗马尼亚市场化资产的原因。'],
        sig:['Gate 4 exposes the missing mechanism','第4关暴露缺失的机制'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  const srcs = [SRC.opcom, SRC.tel, SRC.telmap, SRC.anre, SRC.scheme, SRC.ebrd, SRC.entsoe, SRC.bnr, SRC.pse];
  return {
  head: ['Data & Methodology — source registry, formulas and quality badges','数据与方法 — 数据源登记、公式与质量标识'],
  cap: ['Every figure in this dashboard carries a quality badge and a namespace. Official values come from named regulator, market-operator or system-operator publications; calculated values are derived here; illustrative values are synthetic placeholders that must be replaced by live ingestion before any investment use.',
        '本看板中每个数值均带有质量标识与命名空间。官方数值来自具名的监管机构、市场运营方或系统运营方出版物；计算值在本看板内推导；示例数值为合成占位数据，任何投资用途前须以实时抓取数据替换。'],
  blocks: [
    { t:'card', mt:false, title:['Source hierarchy — which source may answer which question','来源层级 — 何种来源可回答何种问题'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Only acceptable source','唯一可接受来源'],['Never acceptable','不可接受']], rows:[
        [{b:['Can the project connect?','项目能否并网？']}, ['ATR plus an executed connection agreement','ATR加已签并网合同'], ['The indicative capacity map or an establishment authorisation','示意性容量地图或设立许可']],
        [{b:['Will the grant be received?','补贴能否到手？']}, ['A formal award letter','正式授予函'], ['The scheme budget, a call announcement or a submitted application','计划预算、申报公告或已提交申请']],
        [{b:['What spread is achievable?','可实现的价差是多少？']}, ['Executable margin after the full bridge of deductions','经全部扣减桥接后的可执行价差'], ['The published day-ahead top–bottom spread','公布的日前峰谷价差']],
        [{b:['Is balancing revenue real?','平衡收入是否真实？']}, ['Project prequalification plus a reproducible optimiser backtest','项目预认证加可复现的优化器回测'], ['Market-wide published results applied to an unqualified project','将全市场公开结果套用于未取得资格的项目']],
        [{b:['What is the euro return?','以欧元计的回报是多少？']}, ['The central-bank RON/EUR reference series','央行RON/EUR参考汇率序列'], ['A single illustrative mid-rate held flat','单一示意中间价并保持不变']],
      ] },
      { t:'why', text:['All five rows describe the same error in different clothes: substituting an earlier, more available proxy for definitive evidence. In Romania that error has a consistent direction — every convenient proxy is more optimistic than the real thing, and the currency row compounds it, because a flat exchange-rate assumption quietly removes a risk that is larger than most operating variables.',
        '五行描述的是同一错误的不同表现：以更早、更易获得的替代指标取代决定性证据。在罗马尼亚，该错误方向一致 — 每一个便利的替代指标都比真实情况更乐观；而汇率一行会放大这一效应，因为固定汇率假设悄然消除了一项大于多数运营变量的风险。'],
        sig:['Every convenient proxy flatters','每个便利替代指标都在美化'] },
    ] },
    { t:'card', title:['Source registry — verified 26 July 2026','数据源登记表 — 2026年7月26日核验'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Source date','来源日期'],['Applicable period','适用期间']],
        rows: srcs.map(s => [{ b: [s.file, s.file] }, s.status, s.date, s.cy]) },
      { t:'note', text:['Currency discipline: the RON/EUR rate used throughout this dashboard is an illustrative mid-rate of ' + fmt1(M.fx) + '. Replace it with the central-bank reference series before any transaction use and model the exchange-rate path explicitly — for a euro-denominated investor it is a material risk, not a presentational convenience.',
        '汇率纪律：本看板全篇所用RON/EUR汇率为示意中间价' + fmt1(M.fx) + '。任何交易用途前须以央行参考序列替换，并对汇率路径显式建模 — 对以欧元计价的投资人而言，这是实质风险，而非表述上的便利。'] },
    ] },
    { t:'card', title:['Core formulas','核心公式'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Quantity','指标'],['Formula','公式']], rows:[
        [{b:['Capacity revenue','容量收入']}, 'zero — Romania has no capacity mechanism'],
        [{b:['Discharged energy, year 1','第1年放电电量']}, 'MW × hours × usable fraction × cycles/day × 365 × availability'],
        [{b:['Executable margin','可执行价差']}, 'published spread + intraday uplift − liquidity − RTE − availability − optimiser fee'],
        [{b:['Effective spread by duration','按时长的有效价差']}, 'executable margin × duration factor × (RTE / 88) × dilution factor(COD year)'],
        [{b:['Net capex','净资本开支']}, 'gross capex − grant (only with a formal award letter)'],
        [{b:['Duration scorecard','时长评分卡']}, 'Σ (factor weight × factor score) / 3, each factor scored 0–3'],
        [{b:['DSCR','偿债覆盖率']}, 'EBITDA(year) / annuity(debt, interest rate, tenor)'],
      ] },
    ] },
    { t:'card', title:['Data-quality badge legend & seed status','数据质量标识说明与种子状态'], badges:['calc'], live:false, blocks:[
      { t:'badges', items:['official','calc','illus','forecast','dev','public','tp','peer','final','draft','model','consult','verify','policy',
        h('span', { class:'badge seed' }, MKT.seedTag), h('span', { class:'badge etl' }, 'LIVE_ETL_REQUIRED')] },
      { t:'cap', text:['Official values, refreshed July 2026: 2025 day-ahead weighted-average price ' + fmtRON(O.dam2025Wap) + '/MWh on ' + fmt1(O.dam2025TWh) + ' TWh traded, equal to ' + O.dam2025SharePct + '% of domestic consumption · 2025 intraday weighted average ' + fmtRON(O.idm2025Wap) + '/MWh · June 2026 day-ahead weighted average ' + fmtRON(O.damJun2026Wap) + '/MWh · ' + fmtCM(O.schemeBudgetEurM * 1e6) + ' standalone-storage state-aid scheme approved, with a policy minimum of ' + fmtN(O.schemeMinMWh) + ' MWh by 2030 and a further ' + fmtN(O.policyExtraMW) + ' MW of expectation · ' + fmtN(O.authFeb2026MW) + ' MW of storage-related authorisations approved in one February 2026 regulatory meeting. Guarantee levels, balancing volumes, price shapes and all project data are illustrative seeds pending live ingestion; the RON/EUR rate of ' + fmt1(M.fx) + ' is illustrative. Polish figures are peer-namespace context and never enter Romanian scoring.',
        '官方数值，2026年7月刷新：2025年日前加权均价' + fmtRON(O.dam2025Wap) + '/MWh，成交' + fmt1(O.dam2025TWh) + 'TWh，占国内消费' + O.dam2025SharePct + '% · 2025年日内加权均价' + fmtRON(O.idm2025Wap) + '/MWh · 2026年6月日前加权均价' + fmtRON(O.damJun2026Wap) + '/MWh · ' + fmtCM(O.schemeBudgetEurM * 1e6) + '独立储能国家援助计划已获批准，政策最低目标为2030年前' + fmtN(O.schemeMinMWh) + 'MWh，另有' + fmtN(O.policyExtraMW) + 'MW预期 · 2026年2月单次监管会议核准' + fmtN(O.authFeb2026MW) + 'MW储能相关许可。保函水平、平衡成交量、价格形态及全部项目数据均为示例种子，待实时抓取替换；RON/EUR汇率' + fmt1(M.fx) + '为示意值。波兰数值属同业命名空间背景资料，绝不进入罗马尼亚评分。'] },
      { t:'exports' },
    ] },
    { t:'card', title:['Bilingual glossary','双语术语表'], badges:['calc'], live:false, blocks:[
      { t:'glossary' },
      { t:'why', text:['Four terms carry disproportionate decision weight and are the ones most often used loosely in Romanian discussions: ATR (the technical connection permit — the first tier that constitutes evidence), establishment authorisation (a permit to develop, not capacity to connect), scheme budget versus award (a ceiling on total aid versus a project entitlement), and evidence tier (which of the five balancing-revidence levels a specific project has actually reached). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
        '有四个术语在决策中的权重不成比例，且在罗马尼亚的讨论中最常被宽泛使用：ATR（技术并网许可 — 第一个构成证据的层级）、设立许可（开发许可，而非并网容量）、计划预算与正式授予之别（援助总额上限与项目权利之别），以及证据层级（具体项目在五级平衡收入证据阶梯中实际达到的层级）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
        sig:['Agree four definitions before negotiating','谈判前先统一四项定义'] },
    ] },
  ] };
};


  SEC_B.grid = () => buildROGridSection({ SRC, M });

  /* ---- Investment Case and Entry — the investment-view revision ------------
     Both read the view store and the capital-at-risk ledger by market id; the
     section says which market and nothing else. */
  SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
    { t: 'p', text: ['The highest return of any market here, with nothing secured and the rules still moving. The guarantees are a large share of a small project and a modest sum of money.', '回报为各市场之最，但没有任何锁定收入，规则也仍在变动。保函占小项目投资的比例很高，金额却不大。'] },
    { t: 'investment-case', marketId: 'ro' },
  ] });
  SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
    { t: 'p', text: ['Three guarantees and the price of the auctioned capacity fall due before financial close. Three of the five items have no published amount, so every total is a lower bound. The pathway beneath shows where the annual auction sits.', '融资交割前须提交三项保函，并支付拍得容量的价款。五项中有三项没有公开金额，因此所有合计均为下限。其下的建设路径显示了年度拍卖所处的位置。'] },
    { t: 'entry-ledger', marketId: 'ro' },
    { t: 'pathway', pathway: RO_BUILD_PATHWAY, sourceFor: (k) => SRC[k] },
  ] });

  return SECTIONS;
}