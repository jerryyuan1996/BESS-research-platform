/* ---------------------------------------------------------------------------
   PJM — section specs for the shared block engine.

   One organising argument runs through every tab: PJM is the only market on this
   platform where the contracted revenue needs no estimating and the merchant
   revenue cannot be trusted. Both halves of the capacity payment are published
   PJM documents. The merchant stack that the operating fleet actually earns
   belongs to 400 MW competing for a 750 MW Regulation requirement, and 67 GW is
   in the queue behind it.

   So the tabs are sequenced to move a reader from the number they can rely on to
   the number they must not: capacity first, then nodal energy, then Regulation —
   which is the largest observed line and the one this dashboard spends the most
   effort arguing down.

   Content is deliberately tighter than GB's. Every tab is complete and sourced;
   none is padded. Where a figure is not published, the tab says so rather than
   estimating around it — the `data` tab lists all eight such gaps.
   --------------------------------------------------------------------------- */
import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, state, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct,
          liveScore, dilutionAt } = api;

const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
/* Revenue series are carried per MW per year, so the thousands formatter is used
   for the headline figures rather than multiplying up and back down at the call
   site. `perKW` renders the $/kW-month unit that every US revenue source
   publishes in, which is NOT the unit the model works in — keeping the two
   visibly distinct is the point. */
const kMW = v => fmtCk(v);
const perKW = v => fmtC(v) + '/kW-mo';

// ============================== OVERVIEW ==============================
SEC_B.home = function (){
  return {
  head: ['PJM — the best-published capacity payment on this platform, for one year',
         'PJM — 本平台披露最完整的容量收入，期限仅一年'],
  cap: ['What is known with certainty, what is assumed, and why the merchant line the operating fleet earns is not available to a new build.',
        '哪些已确知、哪些属假设，以及在运机组所赚取的市场化收入为何对新建项目不可得。'],
  blocks: [
    { t:'warn', text:M.seedWarn },
    { t:'card', mt:false, title:['Position at a glance','总体判断'], badges:['calc','illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Target COD window','目标投运窗口'], v:M.overall.codWindow,
          d:['evidence confidence ' + M.overall.confidence + '%', '证据置信度 ' + M.overall.confidence + '%'] },
        { l:['Capacity revenue, secured year','容量收入，已锁定年度'], v:kMW(69989) + '<small>/MW/yr</small>',
          d:[fmtC(O.braPrice) + '/MW-day × 365 × ' + O.elcc4h + '% ELCC — both published',
             '每MW每日' + fmtC(O.braPrice) + ' × 365 × ' + O.elcc4h + '% ELCC — 两项均已公布'], b:['official'] },
        { l:['Years that revenue is secured for','该收入的锁定年限'], v:'1<small> yr</small>',
          d:['a Base Residual Auction procures one delivery year','基准剩余容量拍卖仅采购一个实需年度'], b:['official'] },
        { l:['Arbitrage, executable','可执行套利收入'], v:kMW(50336) + '<small>/MW/yr</small>',
          d:['TB4 ' + kMW(O.tb4_2025) + ' after the capture stack','TB4 ' + kMW(O.tb4_2025) + '，扣除捕获折减后'], b:['model'] },
        { l:['Regulation modelled vs earned today','调频：建模值对当前实际值'], v:kMW(19200) + ' <small>vs</small> ' + kMW(247680),
          d:['400 MW fleet against a ' + fmtN(O.regMarketAfterMW) + ' MW requirement, and 67 GW queued',
             '400MW机组对应' + fmtN(O.regMarketAfterMW) + 'MW系统需求，另有67GW排队'], cls:'down', b:['calc'] },
      ] },
      { t:'ic', b:['House view: ','本方观点：'], text:M.overall.rationale },
    ] },

    { t:'card', title:['The four facts that decide a PJM case','决定PJM投资逻辑的四个事实'], badges:['official'], blocks:[
      { t:'table', head:[['Fact','事实'],['Evidence','证据'],['What it does to the case','对投资逻辑的影响']], rows:[
        [{b:['Both halves of the capacity payment are published','容量收入的两个组成部分均已公布']},
         [fmtC(O.braPrice) + '/MW-day cleared ' + O.braDate + ' for ' + O.braDeliveryYear + ', and a ' + O.elcc4h + '% 4-hr ELCC class rating for the same delivery year',
          O.braDeliveryYear + '年度于' + O.braDate + '以每MW每日' + fmtC(O.braPrice) + '出清，同一实需年度的四小时储能ELCC等级为' + O.elcc4h + '%'],
         ['Year one needs no estimate. No other market on this platform can say that.','第一年无需任何估算。本平台没有其他市场能做到这一点。']],
        [{b:['It covers one delivery year','其仅覆盖一个实需年度']},
         ['A BRA procures a single delivery year; the next one (' + O.nextBraDeliveryYear + ') runs in ' + O.nextBraDate,
          '基准剩余容量拍卖仅采购单一实需年度；下一次（' + O.nextBraDeliveryYear + '年度）将于' + O.nextBraDate + '举行'],
         ['Years 2–15 are re-auctioned. They are analyst scenarios, not revenue.','第2–15年须重新拍卖。它们属分析师情景假设，而非收入。']],
        [{b:['The price collar ends, and the cap roughly doubles','价格上下限机制终止后上限将约翻倍']},
         ['The collar covers ' + O.collarAuctions + ' auctions through ' + O.collarLastDeliveryYear + '; PJM\'s uncapped ' + O.prevBraDeliveryYear + ' simulation cleared at ' + fmtC(O.uncappedSimRto) + ' and the cap reverts toward ' + fmtC(O.netConeEstimate),
          '上下限机制覆盖至' + O.collarLastDeliveryYear + '年度共' + O.collarAuctions + '次拍卖；PJM对' + O.prevBraDeliveryYear + '年度的无上限模拟出清价为' + fmtC(O.uncappedSimRto) + '，上限将回升至约' + fmtC(O.netConeEstimate)],
         ['The renewal curve rises before it falls. See the capacity tab.','续期曲线先升后降。详见容量页。']],
        [{b:['The observed Regulation revenue is not available to you','已观测的调频收入对新进入者不可得']},
         ['The fleet earns ' + perKW(O.idxPerKWMonthToSep25) + ' to Sep 2025 and peaked at ' + perKW(O.peakPerKWMonthFeb26) + ' in Feb 2026 — on ~' + fmtN(O.fleetMW) + ' MW against a ' + fmtN(O.regMarketAfterMW) + ' MW requirement',
          '机组收入截至2025年9月为' + perKW(O.idxPerKWMonthToSep25) + '，2026年2月峰值达' + perKW(O.peakPerKWMonthFeb26) + ' — 而这是约' + fmtN(O.fleetMW) + 'MW机组对应' + fmtN(O.regMarketAfterMW) + 'MW系统需求的结果'],
         ['Carried as a band ceiling, never as a base case. See the Regulation tab.','仅作为区间上限，绝不作为基准情形。详见调频页。']],
      ] },
      { t:'why', text:['These four are not independent, and the relationship between them is the PJM case. The capacity payment is high and fully published BECAUSE the RTO is short — ' + fmtN(O.braShortMW) + ' MW short of its reliability requirement in ' + O.braDeliveryYear + ', the second consecutive auction where the entire RTO fell short. The same shortage is what suppressed the price collar into existence and what makes its expiry a step up rather than down. And the same shortage is why 67 GW of storage is in the queue — which is precisely what closes the Regulation market that the operating fleet is currently being paid so well by. A PJM battery is being paid for scarcity twice, and only one of those payments survives the response to it.',
        '这四点并非彼此独立，它们之间的关系正是PJM投资逻辑的核心。容量收入之所以高且完全公开，恰恰是因为该RTO处于短缺状态 — ' + O.braDeliveryYear + '年度低于可靠性需求' + fmtN(O.braShortMW) + 'MW，为连续第二次整个RTO出现缺口。正是这一短缺促成了价格上下限机制的出台，也使其到期意味着价格上台阶而非下台阶。同样是这一短缺，导致67GW储能进入排队 — 而这恰恰将关闭当前令在运机组获利丰厚的调频市场。PJM储能因稀缺而两次获得报酬，但其中只有一项能在市场对稀缺作出反应后存续。'],
        sig:['Paid for scarcity twice; only one payment survives','因稀缺获得两份报酬，仅一份可存续'] },
    ] },

    { t:'card', title:['What the operating fleet earns, and why this model publishes less','在运机组的实际收入，以及本模型为何发布更低数值'], badges:['tp'], blocks:[
      { t:'bar', cfg:{ xs:M.obsLabels, bw:56, yfmt:v => '$' + v, labels:true, h:230,
        series:[{ name:['Observed fleet revenue, $/kW-month','已观测机组收入，$/kW-月'], color:'var(--s14)', vals:M.obsSeries }] } },
      { t:'cap', text:['Modo\'s PJM battery benchmark. ' + perKW(O.idxPerKWMonthToSep25) + ' through September 2025; ' + perKW(O.postRedesignAvgPerKWMonth) + ' on average after the October 2025 Regulation redesign; ' + perKW(O.peakPerKWMonthFeb26) + ' at the February 2026 peak, when Regulation prices averaged $' + O.regPriceFeb26 + '/MWh, over five times the year before.',
                       'Modo的PJM储能基准数据。截至2025年9月为' + perKW(O.idxPerKWMonthToSep25) + '；2025年10月调频市场重构后平均为' + perKW(O.postRedesignAvgPerKWMonth) + '；2026年2月峰值达' + perKW(O.peakPerKWMonthFeb26) + '，当月调频价格均值为每MWh $' + O.regPriceFeb26 + '，为上年同期五倍以上。'] },
      { t:'why', text:['Read this chart as a scarcity rent, not a revenue level. Every bar on it belongs to a fleet of roughly ' + fmtN(O.fleetMW) + ' MW bidding into a Regulation requirement of about ' + fmtN(O.regMarketAfterMW) + ' MW — a market where the supply is smaller than the demand, which is why the price behaves the way the third bar does. The queue behind it holds ' + O.queueStorageGW + ' GW and Modo expects roughly ' + fmtN(O.expected2030MW) + ' MW operating by 2030. Publishing any of these bars as a fifteen-year base case would underwrite the absence of competitors, which is the one thing about PJM that is certain to change.',
        '应将本图视为稀缺租金而非收入水平。图中每一根柱都属于约' + fmtN(O.fleetMW) + 'MW机组竞争约' + fmtN(O.regMarketAfterMW) + 'MW调频需求的结果 — 在这个市场中供给小于需求，这正是第三根柱所呈现的价格表现的成因。其身后排队量达' + O.queueStorageGW + 'GW，Modo预计到2030年在运规模约为' + fmtN(O.expected2030MW) + 'MW。若将其中任何一根柱作为十五年基准情形发布，实质上是在为“竞争者不存在”这一状态承销 — 而这恰恰是PJM唯一确定会改变的事情。'],
        sig:['A scarcity rent, not a revenue level','这是稀缺租金，而非收入水平'] },
      { t:'src', src:SRC.modoStack, use:['Fleet revenue benchmark and the April 2026 stack decomposition','机组收入基准及2026年4月收入结构拆解'] },
    ] },
  ] };
};

// ============================== MARKET STORY ==============================
SEC_B.story = function (){
  return {
  head: ['PJM Market Story — from surplus to a two-auction shortfall',
         'PJM市场演进 — 从容量过剩到连续两次拍卖缺口'],
  cap: ['PJM spent a decade with more capacity than it needed. Three things ended that, and all three are still running.',
        'PJM曾有十年容量富余。三项因素终结了这一局面，且三者至今仍在持续。'],
  blocks: [
    { t:'card', mt:false, title:['How the system got here','系统如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2010s', t:['Structural surplus','结构性过剩'],
          p:['PJM cleared its capacity auctions comfortably above the reliability requirement for most of the decade. Capacity prices were low enough that storage had no contracted route worth modelling.',
             'PJM在该十年的大部分时间内，容量拍卖出清水平都明显高于可靠性需求。容量价格之低，使储能不存在值得建模的合同化路径。'],
          i:['There was no PJM capacity thesis to underwrite.','当时不存在可供承销的PJM容量投资逻辑。'] },
        { y:'2022–2025', t:['Coal retires, data centres arrive','燃煤退役，数据中心到来'],
          p:['Thermal retirement accelerated while the load forecast turned up sharply on data-centre interconnection. Coal fell ' + fmtN(Math.abs(O.coalChangeMW)) + ' MW UCAP into the ' + O.braDeliveryYear + ' auction alone, from retirements and gas conversions.',
             '火电退役加速，同时因数据中心并网，负荷预测大幅上调。仅在' + O.braDeliveryYear + '年度拍卖中，燃煤UCAP即因退役与燃气改造减少' + fmtN(Math.abs(O.coalChangeMW)) + 'MW。'],
          i:['Supply and demand crossed. The capacity price stopped being a rounding error.','供需关系反转。容量价格不再是可忽略的小数。'] },
        { y:'Jan 2025', t:['The price collar','价格上下限机制'],
          p:['Facing capacity costs rising into retail bills, PJM agreed a cap and floor with the thirteen state governors, later approved by FERC. It covers ' + O.collarAuctions + ' auctions and ends after ' + O.collarLastDeliveryYear + '.',
             '面对容量成本向零售电价传导，PJM与十三州州长达成价格上下限协议，其后获FERC批准。该机制覆盖' + O.collarAuctions + '次拍卖，至' + O.collarLastDeliveryYear + '年度后结束。'],
          i:['The published price is a policy ceiling, not a market clearing price.','所公布的价格是政策上限，而非市场出清价格。'] },
        { y:'Oct 2025', t:['The Regulation redesign','调频市场重构'],
          p:['Phase 1 consolidated RegA and RegD into a single bidirectional signal and terminated RegD-only participation. The market roughly doubled from about ' + fmtN(O.regMarketBeforeMW) + ' MW to about ' + fmtN(O.regMarketAfterMW) + ' MW.',
             '第一阶段将RegA与RegD合并为单一双向信号，并终止仅参与RegD的资格。市场规模由约' + fmtN(O.regMarketBeforeMW) + 'MW约增至' + fmtN(O.regMarketAfterMW) + 'MW。'],
          i:['A one-off doubling into a fleet of ~400 MW. That is what the February 2026 peak is.','这是一次性扩容一倍，而当时机组规模仅约400MW。2026年2月的峰值即源于此。'] },
        { y:'Dec 2025 – Jul 2026', t:['Two auctions short, both at the cap','连续两次拍卖出现缺口，且均以上限出清'],
          p:[O.prevBraDeliveryYear + ' cleared at ' + fmtC(O.prevBraPrice) + '/MW-day, roughly ' + fmtN(O.prevBraShortMW) + ' MW short. ' + O.braDeliveryYear + ' cleared at ' + fmtC(O.braPrice) + ', ' + fmtN(O.braShortMW) + ' MW short. The first two auctions in PJM history where the entire RTO fell short.',
             O.prevBraDeliveryYear + '年度以每MW每日' + fmtC(O.prevBraPrice) + '出清，缺口约' + fmtN(O.prevBraShortMW) + 'MW。' + O.braDeliveryYear + '年度以' + fmtC(O.braPrice) + '出清，缺口' + fmtN(O.braShortMW) + 'MW。这是PJM历史上首次连续两届整个RTO出现缺口。'],
          i:['Storage is being paid to solve a shortage, and 67 GW has queued up to do it.','储能因解决短缺而获得报酬，而已有67GW为此排队。'] },
      ] },
    ] },
    { t:'card', title:['What changes next, and when','下一步变化及其时点'], badges:['official','forecast'], blocks:[
      { t:'ladder', items:[
        { n:[O.nextBraDate + ' — the last collared auction', O.nextBraDate + ' — 上下限机制下的最后一次拍卖'],
          d:['The ' + O.nextBraDeliveryYear + ' Base Residual Auction. After it the cap reverts to a Net CONE-based figure PJM estimates near ' + fmtC(O.netConeEstimate) + '/MW-day, against the ' + fmtC(O.braPrice) + ' cap today and ' + fmtC(O.nextBraCap) + ' for this auction.',
             O.nextBraDeliveryYear + '年度基准剩余容量拍卖。此后价格上限将回归至PJM估算约每MW每日' + fmtC(O.netConeEstimate) + '的净新增成本基准，而当前上限为' + fmtC(O.braPrice) + '，本次拍卖上限为' + fmtC(O.nextBraCap) + '。'] },
        { n:[O.backstopMonth + ' 2026 — Reliability Backstop Procurement', '2026年' + O.backstopMonth + ' — 可靠性兜底采购'],
          d:['A special procurement to address the near-term shortfall with costs allocated to state preferences. FERC suspended the filing on 29 September 2026 to ' + O.backstopSuspendedTo + ' and opened a paper hearing; the bid window did not open.',
             '用于应对近期缺口的特别采购，成本按各州意愿分摊。FERC于2026年9月29日将该申请中止至' + O.backstopSuspendedTo + '并启动书面听证；投标窗口未开启。'] },
        { n:[O.regPhase2Date + ' — Regulation Phase 2', O.regPhase2Date + ' — 调频市场第二阶段'],
          d:['The bidirectional signal splits into RegUp and RegDown. This lets a battery bid on state of charge and direction — but it splits the requirement rather than growing it.',
             '双向信号将拆分为RegUp与RegDown。这使储能可依据荷电状态与方向分别报价 — 但它拆分的是现有需求，而非扩大需求。'] },
        { n:['2029–2031 — the COD window on this dashboard', '2029–2031年 — 本看板的投运窗口'],
          d:['A project reaching commercial operation here bids into its first BRA after the collar has gone, and into a Regulation market with several gigawatts more battery in it than today.',
             '在此窗口投入商运的项目，其首次参与的基准剩余容量拍卖已在上下限机制终止之后，且届时调频市场中的储能规模将比现在多出数吉瓦。'] },
        { n:['2030 — the queue arrives', '2030年 — 排队产能到位'],
          d:['Modo expects roughly ' + fmtN(O.expected2030MW) + ' MW operating, with a ceiling of ' + O.ceiling2030GW + ' GW, against about ' + fmtN(O.fleetMW) + ' MW today — a ' + O.expansionX + '-fold expansion at the top end.',
             'Modo预计在运规模约' + fmtN(O.expected2030MW) + 'MW，上限' + O.ceiling2030GW + 'GW，而当前约为' + fmtN(O.fleetMW) + 'MW — 按上限计为' + O.expansionX + '倍扩张。'] },
      ] },
      { t:'why', text:['The COD window and the two structural changes sit on top of each other, and they push in opposite directions. A project commissioning in ' + M.overall.codWindow + ' misses the collar entirely, which is good: it bids into a market whose cap is roughly ' + fmtC(O.netConeEstimate) + ' rather than ' + fmtC(O.braPrice) + '. The same project also misses the Regulation scarcity entirely, which is the whole reason this dashboard publishes ' + kMW(19200) + ' rather than ' + kMW(247680) + '. Both effects are large, both are reasonably certain, and they do not cancel — the capacity gain accrues to a line that is re-auctioned annually, while the Regulation loss is permanent.',
        '投运窗口与两项结构性变化相互重叠，且作用方向相反。在' + M.overall.codWindow + '投运的项目将完全错过价格上下限期，这是好事：其所面对市场的价格上限约为' + fmtC(O.netConeEstimate) + '而非' + fmtC(O.braPrice) + '。但同一项目也将完全错过调频市场的稀缺期，这正是本看板发布' + kMW(19200) + '而非' + kMW(247680) + '的全部原因。两项影响均幅度可观、确定性较高，且无法相互抵消 — 容量端的收益归属于一条每年重新拍卖的收入线，而调频端的损失则是永久性的。'],
        sig:['The window helps capacity and hurts Regulation','该窗口利好容量收入，不利调频收入'] },
    ] },
  ] };
};

// ============================== RPM CAPACITY & ELCC ==============================
SEC_B.capacity = function (){
  return {
  head: ['RPM Capacity & ELCC — two published numbers, and fourteen assumed years',
         'RPM容量市场与ELCC核证 — 两个已公布数值，与十四个假设年度'],
  cap: ['The capacity payment is a product of a clearing price and an accreditation factor. PJM publishes both, separately, for every delivery year.',
        '容量收入是出清价格与核证系数的乘积。PJM就每个实需年度分别公布这两项数据。'],
  blocks: [
    { t:'card', mt:false, title:['The secured year — nothing here is estimated','已锁定年度 — 此处无任何估算'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:['Clearing price, ' + O.braDeliveryYear, O.braDeliveryYear + '年度出清价格'], v:fmtC(O.braPrice) + '<small>/MW-day</small>',
          d:['at the FERC-approved cap, RTO-wide, ' + O.braDate + '; ' + O.braChangePct + '% on ' + O.prevBraDeliveryYear,
             '以FERC批准的上限出清，全RTO统一，' + O.braDate + '；较' + O.prevBraDeliveryYear + '年度' + O.braChangePct + '%'], b:['official'] },
        { l:['4-hr storage ELCC class rating','四小时储能ELCC等级'], v:O.elcc4h + '<small>%</small>',
          d:['up from ' + O.elcc4hPrev + '% for ' + O.prevBraDeliveryYear, '较' + O.prevBraDeliveryYear + '年度的' + O.elcc4hPrev + '%上升'], b:['official'] },
        { l:['Capacity revenue to a 4h battery','四小时储能可获容量收入'], v:kMW(69989) + '<small>/MW/yr</small>',
          d:[fmtC(O.braPrice) + ' × 365 × ' + O.elcc4h + '%', fmtC(O.braPrice) + ' × 365 × ' + O.elcc4h + '%'], b:['calc'] },
        { l:['Years secured','锁定年限'], v:'1<small> yr</small>',
          d:['a BRA procures one delivery year — this is not a contract tenor','基准剩余容量拍卖仅采购一个实需年度 — 这不是合同期限'], b:['official'] },
        { l:['Shortfall against the reliability requirement','相对可靠性需求的缺口'], v:fmtN(O.braShortMW) + '<small> MW</small>',
          d:['second consecutive auction where the entire RTO fell short','连续第二次整个RTO出现缺口'], cls:'down', b:['official'] },
        { l:['Reserve margin','备用率'], v:O.braReserveMarginPct + '<small>%</small>',
          d:['for ' + O.braDeliveryYear + '; ' + fmtN(O.braUcapMW) + ' MW UCAP procured', O.braDeliveryYear + '年度；已采购' + fmtN(O.braUcapMW) + 'MW UCAP'], b:['official'] },
      ] },
      { t:'why', text:['This is the only capacity figure on this platform that required no judgement to produce. Western Australia\'s RCM price needs a refund-exposure reading, Japan\'s needs an Expected Capacity factor nobody publishes, Poland\'s needs a de-rating factor and an FX rate, and the NEM has no capacity market to read at all. PJM posts the clearing price in a news release and the four-hour storage class rating in a separate PDF, and the product of the two is what the asset is paid. The uncertainty in PJM capacity revenue is real and it is large — but all of it lives after this year, not in it.',
        '这是本平台唯一无需任何判断即可得出的容量数值。西澳的RCM价格需要对退款敞口作出解读，日本的需要一个从未公布的期待容量系数，波兰的需要折减系数与汇率，而NEM根本没有容量市场可供解读。PJM在新闻稿中公布出清价格，在另一份PDF中公布四小时储能等级评定，两者之积即为该资产所获报酬。PJM容量收入的不确定性真实且巨大 — 但它全部存在于本年度之后，而非本年度之内。'],
        sig:['No judgement in year one; all of it after','第一年无需判断；不确定性全在其后'] },
      { t:'src', src:SRC.bra2829, use:['Clearing price, volume procured and the reliability shortfall','出清价格、采购电量与可靠性缺口'] },
      { t:'src', src:SRC.elcc2829, use:['The 4-hr storage accreditation applied to that price','适用于该价格的四小时储能核证系数'] },
    ] },

    { t:'card', title:['The ELCC ladder — what PJM pays for duration','ELCC阶梯 — PJM为时长支付的对价'], badges:['official'], blocks:[
      { t:'bar', cfg:{ xs:['4-hr','6-hr','8-hr','10-hr'], bw:56, yfmt:v => v + '%', labels:true, h:230,
        series:[
          { name:[O.braDeliveryYear, O.braDeliveryYear], color:'var(--s14)', vals:[O.elcc4h, O.elcc6h, O.elcc8h, O.elcc10h] },
          { name:[O.prevBraDeliveryYear, O.prevBraDeliveryYear], color:'var(--s12)', vals:[O.elcc4hPrev, O.elcc6hPrev, O.elcc8hPrev, O.elcc10hPrev] },
        ] } },
      { t:'cap', text:['PJM ELCC class ratings for the two most recent Base Residual Auctions. For context in the same table: nuclear ' + O.elccNuclear + '%, coal ' + O.elccCoal + '%, gas combined cycle ' + O.elccCcgt + '%, demand response ' + O.elccDr + '%, onshore wind ' + O.elccOnshoreWind + '%, tracking solar ' + O.elccTrackingSolar + '%.',
                       '最近两届基准剩余容量拍卖的PJM ELCC等级评定。同表中其他类别以供对照：核电' + O.elccNuclear + '%、燃煤' + O.elccCoal + '%、燃气联合循环' + O.elccCcgt + '%、需求响应' + O.elccDr + '%、陆上风电' + O.elccOnshoreWind + '%、跟踪式光伏' + O.elccTrackingSolar + '%。'] },
      { t:'why', text:['PJM pays more for duration than any market on this platform: nine ELCC points between four and six hours, and nineteen between four and ten. Germany\'s capacity market pays a four-hour battery nothing at all, and Japan\'s Expected Capacity factor does not vary with duration. And yet the duration tab shows the sixth hour still failing to clear on this dashboard\'s own numbers, by about ' + kMW(23000) + '/MW/yr. That is not a contradiction — it is what US installed cost does to an otherwise attractive accreditation ladder. The ladder is the strongest argument for a longer PJM asset and it is not, on these inputs, a sufficient one.',
        'PJM为时长支付的对价高于本平台任何市场：四小时至六小时之间相差九个ELCC百分点，四小时至十小时之间相差十九个。德国的容量市场对四小时储能完全不予支付，日本的期待容量系数则不随时长变化。然而时长页显示，按本看板自身数据，第六小时仍无法实现盈亏平衡，缺口约为每MW每年' + kMW(23000) + '。这并非自相矛盾 — 而是美国安装成本对一个本应具有吸引力的核证阶梯所造成的结果。该阶梯是延长PJM资产时长的最有力论据，但按当前输入尚不构成充分论据。'],
        sig:['The best duration ladder on the platform, and it still does not clear','本平台最优的时长阶梯，但仍无法实现盈亏平衡'] },
      { t:'src', src:SRC.elcc2728, use:['The prior delivery year\'s class ratings, for the trend','上一实需年度的等级评定，用于观察趋势'] },
    ] },

    { t:'card', title:['The fourteen assumed years — price up, accreditation down','十四个假设年度 — 价格上行，核证系数下行'], badges:['calc','illus'], blocks:[
      { t:'line', cfg:{ xs:M.renewalYears, h:260, yfmt:v => String(v),
        series:[
          { name:['Assumed clearing price, $/MW-day','假设出清价格，$/MW-日'], color:'var(--s14)', vals:M.renewalPrice },
          { name:['Assumed 4-hr ELCC, %','假设四小时ELCC，%'], color:'var(--s13)', vals:M.renewalElcc },
        ] } },
      { t:'cap', text:['Every year on this chart is an ANALYST SCENARIO. No auction has cleared for any of them. The two lines are declared separately in src/markets/pjm/comparison.js so a reader can disagree with the price path and the accreditation path independently rather than with one blended number.',
                       '本图中每一年均属分析师情景假设。其中没有任何一年已完成拍卖出清。两条曲线在src/markets/pjm/comparison.js中分别声明，以便读者可就价格路径与核证路径分别提出异议，而非面对单一混合数值。'] },
      { t:'table', head:[['Delivery year','实需年度'],['Assumed price, $/MW-day','假设价格，$/MW-日'],['Assumed 4-hr ELCC','假设四小时ELCC'],['Payment, $/MW/yr','收入，$/MW/年'],['Status','状态']], num:[1,2,3],
        rows: [[{b:[O.braDeliveryYear, O.braDeliveryYear]}, fmtC(O.braPrice), O.elcc4h + '%', kMW(69989), {chip:'good', text:['Cleared','已出清']}]].concat(
          M.renewalYears.map((y, i) => [{b:[y, y]}, fmtC(M.renewalPrice[i]), M.renewalElcc[i] + '%',
            kMW(Math.round(M.renewalPrice[i] * 365 * M.renewalElcc[i] / 100)),
            {chip:'warn', text:['Analyst scenario','分析师情景假设']}])) },
      { t:'why', text:['Note what the payment column does: it RISES above the secured year before it falls below it, peaking in 2030/31–2031/32. That is not a modelling artefact. The collar ends after ' + O.collarLastDeliveryYear + ' and PJM\'s own uncapped simulation for ' + O.prevBraDeliveryYear + ' cleared at ' + fmtC(O.uncappedSimRto) + ' RTO-wide — about 60% above the capped price — while four-hour ELCC has not yet begun eroding because the queue has not yet arrived. For two or three delivery years those two forces are both favourable at once. After that the accreditation decline runs alone. Any renewal model that forced a monotonic decline would have hidden the most investable feature of this market, which is why the platform\'s schema does not require one.',
        '请注意收入一列的走势：它先升至已锁定年度之上，随后再降至其下，峰值出现在2030/31–2031/32年度。这并非建模产物。价格上下限机制在' + O.collarLastDeliveryYear + '年度后终止，而PJM自身对' + O.prevBraDeliveryYear + '年度的无上限模拟显示全RTO出清价为' + fmtC(O.uncappedSimRto) + '，比设限价格高约60%；与此同时，由于排队产能尚未到位，四小时ELCC也尚未开始下降。在两到三个实需年度内，这两股力量同时向好。此后，核证系数的下降便将单独发挥作用。任何强制单调递减的续期模型都会掩盖本市场最具投资价值的特征，这正是本平台的数据规范不作此要求的原因。'],
        sig:['It rises before it falls, and that is the opportunity','先升后降，而机会正在于此'] },
      { t:'src', src:SRC.collar, use:['The collar\'s scope and when it ends','上下限机制的适用范围及终止时点'] },
    ] },
  ] };
};

// ============================== NODAL ENERGY ==============================
SEC_B.energy = function (){
  return {
  head: ['Nodal Energy & TB4 Spreads — the leg that grows, and the one that depends on the node',
         '节点电能量与TB4价差 — 增长中的收入项，也是最依赖节点位置的一项'],
  cap: ['PJM settles at the node. A site decision here moves arbitrage revenue by more than any modelling assumption on this dashboard.',
        'PJM按节点结算。此处的选址决定对套利收入的影响，大于本看板上任何建模假设。'],
  blocks: [
    { t:'card', mt:false, title:['TB4 spread and the capture stack','TB4价差与捕获折减'], badges:['tp','calc'], blocks:[
      { t:'kpis', items:[
        { l:['TB4 spread, 2025 fleet average','TB4价差，2025年机组平均'], v:kMW(O.tb4_2025) + '<small>/MW/yr</small>',
          d:['+' + O.tb4ChangePct + '% on 2024\'s ' + kMW(O.tb4_2024), '较2024年的' + kMW(O.tb4_2024) + '上涨' + O.tb4ChangePct + '%'], b:['tp'] },
        { l:['Round-trip efficiency','往返效率'], v:O.captureRtePct + '<small>%</small>',
          d:['equipment property, held equal across markets','设备属性，各市场保持一致'], b:['model'] },
        { l:['Availability','可用率'], v:O.captureAvailPct + '<small>%</small>',
          d:['outages and maintenance','停机与检修'], b:['model'] },
        { l:['Foresight capture','预见性捕获率'], v:O.captureForesightPct + '<small>%</small>',
          d:['TB4 is a perfect-foresight ceiling computed after the fact','TB4是事后计算的完美预见性上限'], b:['model'] },
        { l:['Executable arbitrage','可执行套利收入'], v:kMW(50336) + '<small>/MW/yr</small>',
          d:['before the optimiser fee','扣除优化商费用前'], b:['calc'] },
      ] },
      { t:'wf', cfg:{ steps:M.spreadBridge, yfmt:v => kMW(v), h:260 } },
      { t:'cap', text:['The optimiser fee is deliberately not a step here. The model applies it once, as lab.optFee, and deducting it twice is the most common way this bridge is misread.',
                       '此处刻意不将优化商费用列为一个步骤。模型仅在lab.optFee处应用一次，重复扣除是误读该桥形图最常见的方式。'] },
      { t:'why', text:['The direction of travel is the interesting part. PJM\'s TB4 spread rose ' + O.tb4ChangePct + '% in a single year, at a time when the equivalent series in the NEM, Germany and ERCOT were all falling. The reason is on the market-story tab: PJM is short, its load forecast keeps rising on data-centre interconnection, and the storage that would compress the spread is stuck in a ' + O.queueStorageGW + ' GW queue rather than operating. This is the one merchant leg on this dashboard where the queue being slow is good news.',
        '真正值得注意的是变化方向。PJM的TB4价差在一年内上涨' + O.tb4ChangePct + '%，而同期NEM、德国与ERCOT的同类指标均在下跌。原因见市场演进页：PJM处于短缺状态，其负荷预测因数据中心并网持续上调，而本可压缩价差的储能被困在' + O.queueStorageGW + 'GW的排队队列中而非投入运行。这是本看板上唯一一项“排队缓慢反而是好消息”的市场化收入。'],
        sig:['The only leg where a slow queue helps','唯一因排队缓慢而受益的收入项'] },
      { t:'src', src:SRC.tb4, use:['TB4 fleet averages and nodal dispersion','TB4机组平均值与节点离散度'] },
    ] },

    { t:'card', title:['The node decides more than the model does','节点位置的影响大于模型本身'], badges:['tp'], blocks:[
      { t:'table', head:[['Area','区域'],['What it is','性质'],['What it does to arbitrage','对套利收入的影响']],
        rows: M.regions.map(r => [{b:r.n}, r.note, r.id === 'DOM' || r.id === 'SWMAAC'
          ? ['Highest-spread nodes in the RTO','全RTO价差最高的节点']
          : (r.id === 'EMAAC' ? ['Lowest-spread nodes in the RTO','全RTO价差最低的节点'] : ['Between the two','介于两者之间'])]) },
      { t:'warn', text:[O.tb4TopNodesVaMd + ' of the ' + O.tb4NodeSample + ' highest-spread nodes are in northern Virginia and eastern Maryland; ' + O.tb4BottomNodesNj + ' of the ' + O.tb4NodeSample + ' lowest are in New Jersey. An RTO-average TB4 is not a substitute for the node, and this dashboard\'s ' + kMW(50336) + ' seed is a fleet average.',
                        '价差最高的' + O.tb4NodeSample + '个节点中有' + O.tb4TopNodesVaMd + '个位于弗吉尼亚北部与马里兰东部；最低的' + O.tb4NodeSample + '个中有' + O.tb4BottomNodesNj + '个位于新泽西。全RTO平均TB4不能替代具体节点数据，而本看板' + kMW(50336) + '的种子值属机组平均水平。'] },
      { t:'why', text:['Compare this with the capacity tab and the asymmetry is the whole PJM siting argument. The last three Base Residual Auctions cleared at ONE price for the entire RTO, so location is worth nothing on the capacity line. On the energy line it is worth the difference between the top and bottom of that node distribution. A PJM site selection is therefore an energy decision made alone — the capacity revenue will be identical wherever the asset sits, and the arbitrage revenue will not be close.',
        '将本页与容量页对照，其不对称性正是PJM选址论据的全部。最近三届基准剩余容量拍卖对整个RTO以单一价格出清，因此在容量收入上位置毫无价值。而在电能量收入上，其价值等于该节点分布顶部与底部之间的差额。因此PJM的选址完全是一项电能量决策 — 无论资产位于何处，容量收入都完全相同，而套利收入则相差悬殊。'],
        sig:['Capacity is location-blind; energy is not','容量收入与位置无关，电能量收入则不然'] },
    ] },
  ] };
};

// ============================== REGULATION ==============================
SEC_B.services = function (){
  return {
  head: ['Regulation — the largest observed line, and the one this dashboard argues down',
         '调频市场 — 已观测收入中最大的一项，也是本看板主动下调的一项'],
  cap: ['Regulation is power-based, capped by a system requirement that does not grow, and currently priced by a fleet smaller than that requirement.',
        '调频为功率型服务，受不增长的系统需求所限，且当前价格由一个规模小于该需求的机组群体决定。'],
  blocks: [
    { t:'card', mt:false, title:['Why the observed number is not the forecast','为何已观测数值不能作为预测值'], badges:['calc'], blocks:[
      { t:'wf', cfg:{ steps:M.regBridge, yfmt:v => kMW(v), h:280 } },
      { t:'cap', text:['Four steps from what the fleet earns to what a new entrant should underwrite. Every input is published: the requirement, the pre-spike clearing price, the operating fleet and the 2030 projection.',
                       '从机组实际收入到新进入者应据以承销的水平，共四个步骤。每一项输入均已公开：系统需求、价格飙升前的出清价格、在运机组规模及2030年预测。'] },
      { t:'kpis', items:[
        { l:['Requirement after the redesign','市场重构后的系统需求'], v:fmtN(O.regMarketAfterMW) + '<small> MW</small>',
          d:['from about ' + fmtN(O.regMarketBeforeMW) + ' MW; a one-off, and Phase 2 splits rather than grows it',
             '由约' + fmtN(O.regMarketBeforeMW) + 'MW提升；属一次性调整，第二阶段为拆分而非扩大'], b:['official'] },
        { l:['Operating battery fleet','在运储能机组'], v:fmtN(O.fleetMW) + '<small> MW</small>',
          d:['smaller than the requirement it bids into','小于其所参与竞争的系统需求'], b:['tp'] },
        { l:['Expected fleet by 2030','2030年预期机组规模'], v:fmtN(O.expected2030MW) + '<small> MW</small>',
          d:['ceiling ' + O.ceiling2030GW + ' GW; ' + O.queueStorageGW + ' GW in the queue', '上限' + O.ceiling2030GW + 'GW；排队' + O.queueStorageGW + 'GW'], b:['tp'] },
        { l:['Clearing price, Oct 2025 vs Jun 2025','出清价格，2025年10月对6月'], v:'$' + O.regPriceOct25 + ' <small>vs</small> $' + O.regPriceJun25,
          d:['per MW/h; the seed uses the pre-spike month deliberately','单位每MW·h；种子值刻意采用价格飙升前的月份'], b:['tp'] },
        { l:['Regulation earned today','当前调频收入'], v:kMW(247680) + '<small>/MW/yr</small>',
          d:['0.86 × the ' + kMW(288000) + ' index — estimated split; carried as the band ceiling',
             kMW(288000) + '指数的0.86倍 — 拆分为估算值；作为区间上限保留'], b:['calc'] },
        { l:['Regulation modelled','建模调频收入'], v:kMW(19200) + '<small>/MW/yr</small>',
          d:['a fixed pot divided by a growing fleet','固定收入池除以不断增长的机组规模'], b:['calc'] },
      ] },
      { t:'why', text:['The redesign is what makes this argument tractable, and it cuts both ways. Consolidating RegA and RegD into a single bidirectional signal roughly doubled the market from ' + fmtN(O.regMarketBeforeMW) + ' MW to ' + fmtN(O.regMarketAfterMW) + ' MW and made the new signal gentler on a battery than RegD was — fewer deep cycles, smoother dispatch. That is genuinely good, and it is the reason October 2025 prices reached $' + O.regPriceOct25 + '/MW/h against $' + O.regPriceJun25 + ' in June. But it was a one-off step in the size of the pot, not a growth rate, and Phase 2 in ' + O.regPhase2Date + ' splits the signal into RegUp and RegDown rather than enlarging it. There is no second doubling on the timetable, and there are several gigawatts of battery on it.',
        '正是这次市场重构使上述论证得以成立，且其影响是双向的。将RegA与RegD合并为单一双向信号使市场规模由' + fmtN(O.regMarketBeforeMW) + 'MW约增至' + fmtN(O.regMarketAfterMW) + 'MW，且新信号对电池的损耗低于原RegD — 深度循环减少、调度更平缓。这确实是利好，也是2025年10月价格达到每MW·h $' + O.regPriceOct25 + '（6月为$' + O.regPriceJun25 + '）的原因。但这是收入池规模的一次性跃升，而非增长率；且' + O.regPhase2Date + '的第二阶段是将信号拆分为RegUp与RegDown，而非扩大规模。时间表上没有第二次翻倍，却有数吉瓦储能在列。'],
        sig:['A one-off doubling, not a growth rate','这是一次性翻倍，而非增长率'] },
      { t:'src', src:SRC.regRedesign, use:['Market size before and after Phase 1, and the Phase 2 timetable','第一阶段前后的市场规模及第二阶段时间表'] },
    ] },

    { t:'card', title:['What the fleet actually earns, decomposed','机组实际收入的构成拆解'], badges:['tp','illus'], blocks:[
      { t:'bar', cfg:{ xs:M.stackLabels, bw:56, yfmt:v => '$' + v, labels:true, h:220,
        series:[{ name:['April 2026 fleet stack, $/kW-month','2026年4月机组收入结构，$/kW-月'], color:'var(--s14)', vals:M.stackSeries }] } },
      { t:'cap', text:['The one published decomposition of a PJM battery\'s revenue. Note the capacity bar: ' + perKW(O.stackApr26Cap) + ' annualises to about ' + kMW(60000) + '/MW/yr against this model\'s ' + kMW(69989) + ' derivation from the BRA — an independent cross-check that lands within 15%.',
                       'PJM储能收入唯一的公开拆解数据。请注意容量一栏：' + perKW(O.stackApr26Cap) + '年化后约为每MW每年' + kMW(60000) + '，而本模型依据基准剩余容量拍卖推导的结果为' + kMW(69989) + ' — 这是一项独立交叉验证，误差在15%以内。'] },
      { t:'warn', text:['The Regulation / arbitrage split is ESTIMATED. FERC\'s Electric Quarterly Reports give ' + O.eqrRegSharePct + '% of revenue from Regulation for ' + O.eqrQuarter + ' across ' + O.eqrUnits + ' reporting batteries; the April 2026 stack above decomposes independently to about 78% Regulation. Neither is a per-unit split and no source publishes one. The estimate is used ONLY to read the historical index apart — neither forward leg on this dashboard is derived from it.',
                        '调频与套利的拆分属估算值。FERC电力季度报告显示，' + O.eqrQuarter + '共' + O.eqrUnits + '台申报储能中，' + O.eqrRegSharePct + '%的收入来自调频；上方2026年4月的收入结构独立拆解约为78%调频。二者均非单机组拆分，且无任何来源公布此类数据。该估算仅用于拆解历史指数 — 本看板两条前瞻性收入项均不由其推导。'] },
      { t:'src', src:SRC.eqr, use:['The 86% Regulation share, self-reported by 19 units','19台机组自行申报的86%调频收入占比'] },
    ] },

    { t:'card', title:['Regulation does not pay for duration','调频市场不为时长付费'], badges:['calc'], blocks:[
      { t:'note', text:['Regulation is procured in megawatts, not megawatt-hours. A ten-hour battery earns exactly the same Regulation revenue per MW as a four-hour battery, which is why `services` is held constant across every duration in the Investment Lab and why the marginal-hour waterfall on the duration tab shows zero on the Regulation line.',
                        '调频服务按兆瓦而非兆瓦时采购。十小时储能每MW所获调频收入与四小时储能完全相同，这正是投资测算模块中`services`在各时长下保持不变的原因，也是时长页边际小时瀑布图中调频一项为零的原因。'] },
      { t:'why', text:['This is the trap that a US revenue stack sets for a duration decision. Regulation is by far the largest observed line in PJM today, and it contributes nothing to the case for a longer asset — while the capacity line, which is much smaller today, contributes nine ELCC points between four and six hours. A developer reading the observed revenue mix and concluding that PJM is a short-duration market would be reading the right data and drawing the wrong conclusion: the line that dominates today is the line that both saturates and refuses to scale.',
        '这正是美国收入结构对时长决策所设下的陷阱。调频目前是PJM已观测收入中最大的一项，却对延长资产时长的论证毫无贡献 — 而目前规模小得多的容量收入，在四小时至六小时之间贡献九个ELCC百分点。若开发商依据已观测收入构成得出“PJM是短时长市场”的结论，那是读对了数据却得出了错误结论：当前占主导地位的收入项，既会饱和、又拒绝随时长扩展。'],
        sig:['The dominant line saturates and does not scale','占主导的收入项既饱和又不随时长扩展'] },
      { t:'src', src:SRC.regForwardGap, use:['What is not published about forward Regulation','关于前瞻性调频收入的未公开事项'] },
    ] },
  ] };
};

// ============================== DURATION ==============================
SEC_B.duration = function (){
  return {
  head: ['Storage Duration — the best accreditation ladder on the platform, and the sixth hour still fails',
         '储能时长 — 本平台最优的核证阶梯，但第六小时仍无法成立'],
  cap: ['PJM is the one market here where the capacity market pays real money for duration. At US installed cost it is not enough.',
        'PJM是本平台唯一一个容量市场真正为时长付费的市场。但按美国安装成本计算，这仍不足够。'],
  blocks: [
    { t:'card', mt:false, title:['Why the archetype is four hours','为何原型采用四小时'], badges:['official','calc'], blocks:[
      { t:'table', head:[['Evidence','证据'],['Points to','指向']], rows:[
        [['Four hours is the shortest duration PJM publishes an ELCC class rating for — ' + O.elcc4h + '% for ' + O.braDeliveryYear,
          '四小时是PJM公布ELCC等级评定的最短时长 — ' + O.braDeliveryYear + '年度为' + O.elcc4h + '%'], ['4h','四小时']],
        [['TB4, the published spread benchmark, is computed on a four-hour basis','已公布的价差基准TB4即按四小时口径计算'], ['4h','四小时']],
        [['Six hours adds nine ELCC points and 1.5× the energy','六小时可增加九个ELCC百分点及1.5倍电量'], ['argues for 6h','支持六小时']],
        [['US installed cost is ' + fmtC(O.nrelPerKWh) + '/kWh against roughly $' + O.chinaLoPerKWh + '–' + O.chinaHiPerKWh + ' in China',
          '美国安装成本为每kWh ' + fmtC(O.nrelPerKWh) + '，而中国约为$' + O.chinaLoPerKWh + '–' + O.chinaHiPerKWh], ['argues against 6h','不支持六小时']],
        [['Regulation, the largest observed line, pays nothing for duration','已观测收入中最大的调频项完全不为时长付费'], ['neutral to short','中性偏短时长']],
      ] },
      { t:'why', text:['The duration question in PJM is genuinely close, which is unusual — in most markets on this platform it is settled by one dominant factor. Here the capacity market pushes hard toward six hours and the capital cost pushes hard back, and the waterfall below is what happens when the two meet. The decisive input is not a market fact at all but a tariff one: at Chinese installed cost the sixth hour would clear comfortably. This is the clearest case on the platform of trade policy setting an asset design.',
        'PJM的时长问题确实难分伯仲，这一点颇不寻常 — 在本平台多数市场中，该问题都由某一主导因素决定。而在此处，容量市场强力推向六小时，资本成本又强力拉回，下方瀑布图即为两者交锋的结果。真正起决定作用的并非市场因素，而是关税因素：若按中国的安装成本计算，第六小时将轻松实现盈亏平衡。这是本平台上贸易政策决定资产设计最清晰的例证。'],
        sig:['A tariff, not a market, decides the duration','决定时长的是关税而非市场'] },
    ] },
    { t:'card', title:['Duration-Need Index','时长需求指数'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
    ] },
    { t:'card', title:['Marginal value of the fifth and sixth hour','第五、六小时的边际价值'], badges:['calc','illus'], blocks:[
      { t:'wf', cfg:{ steps:M.marginalHour, yfmt:v => fmtC(v) + 'k', h:250 } },
      { t:'cap', text:['Incremental value of moving from four hours to six, per MW per year, in $ thousands. Regulation is zero because it is paid on power. Incremental capex is 2,000 kWh/MW at the $187.04/kWh energy-scaling component plus EPC, annualised over twenty years at 8%.',
                       '由四小时提升至六小时的增量价值，单位为每MW每年千美元。调频为零，因其按功率计费。增量资本开支为每MW 2,000kWh，按每kWh $187.04的能量型成本分项加EPC计算，按二十年8%折现年化。'] },
      { t:'warn', text:['This waterfall depends on `durSpreadFactor` beyond four hours, and no PJM TB6/TB8/TB10 series was located. Unlike the ELCC ladder above — where every point is a PJM primary source — the 82% six-hour capture rate is an illustrative curve shape. A reader who believes six-hour capture is higher should move it before accepting the negative result.',
                        '本瀑布图依赖四小时以上的`durSpreadFactor`，而未找到PJM的TB6/TB8/TB10序列。与上方ELCC阶梯（其每个点均来自PJM原始出处）不同，六小时82%的捕获率属示意性曲线形态。若读者认为六小时的捕获率更高，应先调整该参数，再判断此负值结论是否成立。'] },
    ] },
    { t:'card', title:['Augmentation readiness','扩容准备度'], badges:['illus'], live:true, blocks:[
      { t:'aug' },
      { t:'cap', text:['Two PJM-specific rows: whether Capacity Interconnection Rights cover the added MWh without a new study, and whether the ELCC class moves up a bracket at the new duration. The second is worth real money — four hours to six is nine points.',
                       '其中两项为PJM特有：容量并网权是否覆盖新增MWh且无需重新研究，以及新时长下ELCC等级能否提升一档。后者具有实际价值 — 四小时至六小时相差九个百分点。'] },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  return {
  head: ['Project Pipeline — a queue thirteen times the fleet it will become',
         '项目管线 — 排队规模达其最终装机的十三倍'],
  cap: ['PJM\'s queue is the largest storage pipeline on this platform by a wide margin, and it is the direct cause of the Regulation saturation on the services tab.',
        'PJM的排队规模远超本平台任何市场，且正是调频页所述饱和现象的直接成因。'],
  blocks: [
    { t:'card', mt:false, title:['Development stage probabilities','开发阶段概率'], badges:['illus'], blocks:[
      { t:'stageProb' },
      { t:'cap', text:['Illustrative weighting used to convert an announced pipeline into a probability-weighted one. Not an official PJM dataset. The step that matters is the interconnection agreement carrying Capacity Interconnection Rights: without CIRs a project cannot offer into RPM at all, so the entire contracted revenue line is unavailable to it.',
                       '用于将已公布管线转换为概率加权管线的示意权重。并非PJM官方数据集。真正关键的步骤是取得含容量并网权的并网协议：若无容量并网权，项目根本无法参与RPM报价，因而全部合同化收入对其不可得。'] },
    ] },
    { t:'card', title:['Announced versus probability-weighted','已公布容量与概率加权容量'], badges:['calc','illus'], blocks:[
      { t:'pipeChart', unit:'MW' },
      { t:'why', text:['The gap between the two lines is the PJM investment question stated as a picture, and it points in the opposite direction to Germany\'s. In Germany a fast pipeline destroys the ancillary revenue the case rests on. In PJM a fast pipeline destroys the Regulation revenue — which this dashboard has already written down to ' + kMW(19200) + ' — while relieving the shortage that is holding the capacity price at its cap. A PJM investor is therefore not straightforwardly rooting for a slow queue: a slow queue protects the TB4 spread and the capacity price, and a fast queue is the only thing that gets the project built.',
        '两条曲线之间的差距是PJM投资问题的图形化表达，且其方向与德国相反。在德国，管线推进过快会摧毁投资逻辑所依赖的辅助服务收入。而在PJM，管线推进过快摧毁的是调频收入 — 本看板已将其下调至' + kMW(19200) + ' — 同时也缓解了使容量价格维持在上限的短缺状态。因此PJM投资人并非简单地希望排队进程缓慢：排队缓慢保护TB4价差与容量价格，而排队加快才是项目得以建成的唯一途径。'],
        sig:['A slow queue protects revenue; a fast queue builds the asset','排队缓慢保护收入，排队加快才能建成资产'] },
    ] },
    { t:'card', title:['Seed project register','种子项目登记表'], badges:['illus'], blocks:[
      { t:'table', head:[['Project','项目'],['LDA / zone','区位可交付区/区域'],['MW','MW'],['Hours','时长'],['COD','投运'],['Stage','阶段']],
        num:[2,3],
        rows: M.projects.map(p => [{b:[p.n, p.n]}, [p.region, p.region],
                                   String(p.mw), String(p.h), p.cod, {chip:'info', text:[p.st, p.st]}]) },
      { t:'cap', text:['Every row is a seed example. Unlike Germany, where Förderstedt is a publicly announced project with a named owner, no PJM project-level list was located — the reformed queue publishes cycle status rather than a named operating fleet. The 90 MW modal size is the Transition Cycle 1 average: ' + O.tc1GW + ' GW across ' + O.tc1Projects + ' projects.',
                       '每一行均为种子示例。与德国不同 — 德国的Förderstedt是有具名所有方的公开项目 — 未找到PJM的项目级清单，因为改革后的排队队列公布的是周期状态而非具名在运机组。90MW的众数规模取自过渡周期一的平均值：' + O.tc1Projects + '个项目合计' + O.tc1GW + 'GW。'] },
      { t:'src', src:SRC.queue, use:['Queue volume, cycle status and Transition Cycle 1 outcomes','排队规模、周期状态及过渡周期一的结果'] },
    ] },
  ] };
};

// ============================== INTERCONNECTION & CONGESTION ==============================
SEC_B.grid = function (){
  return {
  head: ['Interconnection & Congestion — 67 GW queued against 400 MW operating',
         '并网与拥塞 — 67GW排队对应400MW在运'],
  cap: ['The queue is the binding constraint on this market. The map and register below say where and against what.',
        '排队是本市场的约束性瓶颈。下方地图与登记表说明其位置及所面对的对象。'],
  blocks: [
    { t:'card', mt:false, title:['Interactive PJM grid — past, current and planned','PJM电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
      { t:'geo-grid-map', data:gridMapById('pjm-grid-map') },
      { t:'why', text:['The map makes the PJM problem legible in one shape: load is concentrating in northern Virginia while the generation that retired was in Ohio, western Pennsylvania and West Virginia. That is a west-to-east transfer problem inside a single capacity price — the auction clears RTO-wide, so the constraint shows up in the nodal energy market and in deliverability tests rather than in a locational capacity price.',
        '地图以单一图形清晰呈现PJM的问题：负荷正集中于弗吉尼亚北部，而已退役的电源位于俄亥俄、宾州西部与西弗吉尼亚。这是在单一容量价格之下的自西向东输送问题 — 拍卖按全RTO统一出清，因此该约束体现在节点电能量市场与可交付性检验中，而非体现为区位性容量价格。'],
        sig:['A transfer problem hidden inside one capacity price','单一容量价格之下隐藏的输送问题'] },
      { t:'src', src:SRC.queue, use:['Queue volume and cycle status','排队规模与周期状态'] },
    ] },

    { t:'congestion', data:congestionFor('pjm') },

    { t:'card', title:['What PJM is doing about the shortfall','PJM针对缺口所采取的措施'], badges:['official','forecast'], blocks:[
      { t:'table',
        head:[['Initiative','举措'],['Scope','范围'],['Delivery body','实施主体'],['Class','类别'],['GW','GW'],['Target','目标年份'],['Status','状态']], num:[4,5],
        rows: M.reinforcements.map(x => {
          const k = M.planClasses.find(c => c.id === x.cls);
          return [{ b:x.n }, x.scope, [x.operator, x.operator], { chip:k.c, text:k.n },
                  x.gw == null ? null : String(x.gw), String(x.year), x.status];
        }) },
      { t:'table', head:[['Class','类别'],['What it does and does not confer','其赋予与不赋予的内容']],
        rows: M.planClasses.map(k => [{ chip:k.c, text:k.n }, k.d]) },
      { t:'why', text:['Every item on this register is a process rather than a wire, and that is a weaker form of evidence than the platform is used to. The NEM register can name Project EnergyConnect, its capacity, its cost and the month it energised; Germany\'s can name four HVDC corridors with approval decisions and target years. PJM\'s relief is a set of procedural reforms whose effect is real but unquantified — the reformed cycle has produced ' + O.tc1GW + ' GW of battery interconnection agreements, which is the only number on this table with a megawatt attached. Do not underwrite a PJM case on the assumption that the shortfall closes on a schedule, because nothing here has one.',
        '本登记表中每一项都是流程而非实体线路，这是一种弱于本平台惯常所用的证据形式。NEM登记表可以具名Project EnergyConnect及其容量、成本与送电月份；德国的可以列出四条高压直流走廊及其核准决定与目标年份。而PJM的缓解措施是一组程序性改革，其效果真实但未经量化 — 改革后的周期流程已产生' + O.tc1GW + 'GW储能并网协议，这是本表中唯一带有兆瓦数的数字。切勿以“缺口将按时间表关闭”为前提承销PJM项目，因为此处没有任何一项有明确时间表。'],
        sig:['Process, not wires — weaker evidence, and it says so','是流程而非线路 — 证据较弱，且已如实说明'] },
      { t:'src', src:SRC.bra2829, use:['The shortfall the initiatives respond to','这些举措所应对的缺口'] },
    ] },

  ] };
};

// ============================== BENCHMARK ==============================
SEC_B.benchmark = function (){
  return {
  head: ['PJM vs the platform — where a published capacity payment actually ranks',
         'PJM与本平台其他市场对比 — 已公布的容量收入究竟处于何种水平'],
  cap: ['PJM is the platform\'s fourth auction-renewal market and the only one whose auction publishes both the price and the accreditation.',
        'PJM是本平台第四个采用拍卖续期机制的市场，也是唯一一个其拍卖同时公布价格与核证系数的市场。'],
  blocks: [
    { t:'card', mt:false, title:['How the contracted line is produced, market by market','各市场合同化收入的形成方式'], badges:['calc'], blocks:[
      { t:'table', head:[['Market','市场'],['Mechanism','机制'],['What has to be estimated','须估算的内容']], rows:[
        [{b:['PJM','PJM']}, ['RPM Base Residual Auction, one delivery year','RPM基准剩余容量拍卖，一个实需年度'],
         [{b:['Nothing, in the secured year','已锁定年度内无']}, {b:['第一年无需估算','第一年无需估算']}]],
        [{b:['Japan (three areas)','日本（三个区域）']}, ['Capacity Market main auction, one delivery year','容量市场主拍卖，一个实需年度'],
         ['The Expected Capacity factor, which nobody publishes — the single highest-leverage open input in that build','期待容量系数，从未有人公布 — 是该市场建模中影响最大的未决输入']],
        [{b:['Western Australia','西澳']}, ['Reserve Capacity Mechanism, with a 10-yr fixed-price election','储备容量机制，含10年固定价选择权'],
         ['The refund exposure attached to the payment','与该收入相关联的退款敞口']],
        [{b:['Poland','波兰']}, ['Capacity auction, 17-yr contracts','容量拍卖，17年期合同'],
         ['A de-rating factor and an FX rate','折减系数与汇率']],
        [{b:['Germany','德国']}, ['StromVKG, 10-hour minimum','StromVKG，最低10小时'],
         ['Nothing — the four-hour archetype is ineligible','无 — 四小时原型不具备资格']],
        [{b:['NEM','NEM']}, ['None — energy-only, and staying that way','无 — 纯电量市场，且将维持不变'],
         ['The CIS floor, which is commercial-in-confidence for every project','CIS保底价，各项目均属商业机密']],
      ] },
      { t:'why', text:['This table is the reason PJM was worth adding even though its merchant leg is the least trustworthy on the platform. Every other capacity market here requires the analyst to supply something the market will not — a de-rating factor, an expected-capacity factor, a confidential floor. PJM supplies both halves and publishes them on a schedule. That makes it the only market where the difference between the modelled capacity revenue and the actual capacity revenue is zero, which in turn makes it a useful control: where PJM\'s modelled return differs from another market\'s, the difference cannot be blamed on the capacity assumption.',
        '本表正是PJM尽管拥有本平台最不可信的市场化收入项、却仍值得纳入的原因。此处其他每一个容量市场都要求分析师补足市场不会提供的信息 — 折减系数、期待容量系数、保密的保底价。而PJM同时提供两个组成部分，并按既定时间表公布。这使其成为唯一一个建模容量收入与实际容量收入之差为零的市场，从而成为有用的对照基准：当PJM的建模回报与其他市场存在差异时，该差异不可能归咎于容量假设。'],
        sig:['The platform\'s control case for capacity revenue','本平台容量收入的对照基准'] },
    ] },
    { t:'card', title:['Where PJM sits on the two things it is worst at','PJM在其两项最弱指标上的位置'], badges:['calc'], blocks:[
      { t:'table', head:[['Dimension','维度'],['PJM','PJM'],['Comparison','对比']], rows:[
        [{b:['Secured tenor','锁定期限']}, ['1 year','1年'],
         ['Poland 17 years, Italy 15, Japan 1, the NEM none. PJM ties Japan for the shortest secured capacity revenue on the platform.','波兰17年，意大利15年，日本1年，NEM无。PJM与日本并列本平台容量收入锁定期最短。']],
        [{b:['Merchant leg trustworthiness','市场化收入可信度']}, ['Lowest on the platform','本平台最低'],
         ['No PJM battery revenue index is published; the split between Regulation and arbitrage is estimated from 19 FERC filings.','PJM未发布储能收入指数；调频与套利的拆分系依据19份FERC申报估算。']],
        [{b:['Queue-to-fleet ratio','排队量与装机比']}, [O.queueStorageGW + ' GW vs ' + fmtN(O.fleetMW) + ' MW operating', O.queueStorageGW + 'GW对' + fmtN(O.fleetMW) + 'MW在运'],
         ['The most extreme on the platform. The NEM\'s pipeline ratio is about 4.5×; PJM\'s against its expected 2030 fleet is about 13×.','为本平台最极端。NEM的管线比约为4.5倍；PJM相对其2030年预期装机约为13倍。']],
        [{b:['Contracted route beyond the auction','拍卖之外的合同化路径']}, ['None located','未发现'],
         ['ERCOT has ten announced tolls over 1.6 GW. No PJM tolling agreement was found at any price.','ERCOT有十份公开宣布的租赁协议，覆盖1.6GW。未发现任何PJM租赁协议，亦无任何价格。']],
      ] },
      { t:'why', text:['Read the first and last rows together. A one-year secured tenor would be survivable if a tolling market existed to lengthen it, which is how a German or Australian battery converts a thin contracted position into something financeable. PJM has neither: the auction covers one year and there is no toll market behind it. What PJM offers instead is a bilateral large-load matching service opened on ' + O.bilateralServiceDate + ', pairing generation and storage with data-centre buyers on ten-year-plus agreements. That is potentially the most important development on this dashboard and it has no published clearing price, so it appears here as a note rather than as a route.',
        '应将第一行与最后一行对照阅读。若存在租赁市场可延长期限，一年期的锁定尚可承受 — 德国或澳大利亚的储能正是以此将薄弱的合同化头寸转化为可融资资产。而PJM两者皆无：拍卖仅覆盖一年，且其后没有租赁市场。PJM提供的替代方案是' + O.bilateralServiceDate + '启动的双边大负荷撮合服务，将发电与储能同数据中心买方以十年以上协议配对。这可能是本看板上最重要的动向，但它没有公布的出清价格，因此此处仅作为提示而非路径列出。'],
        sig:['One year secured, and no toll market behind it','锁定一年，且身后没有租赁市场'] },
      { t:'src', src:SRC.tollGap, use:['The absence of a PJM tolling market','PJM租赁市场的缺失'] },
    ] },
  ] };
};

// ============================== PORTFOLIO ==============================
SEC_B.portfolio = function (){
  return {
  head: ['Portfolio / Fund View — screening a PJM opportunity','组合与基金视图 — PJM机会筛选'],
  cap: ['A worked screening example on this dashboard\'s own assumptions. Illustrative — it demonstrates the gate sequence, not a transaction.',
        '基于本看板自身假设的筛选示例。仅作示意，用于演示门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Investment Committee gates','投委会门槛'], badges:['calc'], blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Capacity Interconnection Rights, not a queue position','门槛1 — 取得容量并网权，而非仅有排队位置'],
          d:['Without CIRs the asset cannot offer into RPM and the entire contracted revenue line is unavailable. ' + O.queueStorageGW + ' GW is in the queue; Transition Cycle 1 issued agreements to ' + O.tc1Projects + ' battery projects.',
             '若无容量并网权，资产无法参与RPM报价，全部合同化收入均不可得。当前排队量' + O.queueStorageGW + 'GW；过渡周期一仅向' + O.tc1Projects + '个储能项目签发协议。'],
          c:'critical', s:['Binary — no CIRs, no capacity revenue','非此即彼 — 无容量并网权即无容量收入'] },
        { n:['Gate 2 — Network upgrade cost from the completed study','门槛2 — 已完成研究所确定的电网升级成本'],
          d:['The largest project-specific number in a PJM underwriting and the one with no public series. It comes from the system impact study for this project at this point, and nowhere else.',
             '这是PJM项目承销中最大的项目专属数字，且没有公开序列。它只能来自该项目在该节点的系统影响研究，别无来源。'],
          c:'critical', s:['Not knowable from any public source','无法从任何公开来源获知'] },
        { n:['Gate 3 — Regulation modelled at the new-entrant level','门槛3 — 调频收入按新进入者水平建模'],
          d:['Confirm the case does not carry the observed fleet Regulation revenue. ' + kMW(247680) + '/MW/yr belongs to ~' + fmtN(O.fleetMW) + ' MW competing for a ' + fmtN(O.regMarketAfterMW) + ' MW requirement; this dashboard models ' + kMW(19200) + '.',
             '确认方案未采用已观测的机组调频收入。每MW每年' + kMW(247680) + '属于约' + fmtN(O.fleetMW) + 'MW争夺' + fmtN(O.regMarketAfterMW) + 'MW系统需求的结果；本看板建模值为' + kMW(19200) + '。'],
          c:'critical', s:['A 13× difference in the largest observed line','已观测最大收入项存在13倍差异'] },
        { n:['Gate 4 — The node, read from its own TB4 history','门槛4 — 依据节点自身TB4历史判断选址'],
          d:['Capacity revenue is RTO-wide and identical everywhere. Arbitrage is not: ' + O.tb4TopNodesVaMd + ' of the ' + O.tb4NodeSample + ' best nodes are in northern Virginia and eastern Maryland, ' + O.tb4BottomNodesNj + ' of the ' + O.tb4NodeSample + ' worst in New Jersey.',
             '容量收入按全RTO统一，各处相同。套利收入则不然：最优' + O.tb4NodeSample + '个节点中有' + O.tb4TopNodesVaMd + '个位于弗吉尼亚北部与马里兰东部，最差' + O.tb4NodeSample + '个中有' + O.tb4BottomNodesNj + '个位于新泽西。'],
          c:'serious', s:['The only locational decision that pays','唯一有回报的区位决策'] },
        { n:['Gate 5 — FEOC material-assistance documentation','门槛5 — FEOC实质协助合规文件'],
          d:['Failing the Material Assistance Cost Ratio voids the §48E credit entirely rather than reducing it, and IRS Notice 2026-15 left both the prohibited-entity definition and the ratio calculation to regulations that had not issued at the seed date.',
             '未通过实质协助成本比率将使§48E抵免完全失效而非减少，且美国国税局2026-15号公告将受禁实体定义与比率计算方式均留待尚未发布的法规解决。'],
          c:'critical', s:['A cliff, not a slope','断崖式，而非递减式'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['PJM rewards diligence on things that are knowable only project by project, and punishes reliance on things that look published but are not. The capacity payment is the most reliable number on this platform and it is also the only PJM number a reader can take from this dashboard unchanged — the node, the upgrade cost and the FEOC position all have to come from the project. A PJM case that arrives at investment committee carrying the observed fleet Regulation revenue, an RTO-average TB4 and an unquantified upgrade cost has got the one easy number right and all three hard ones wrong.',
              'PJM奖励对只能逐项目查证之事的尽职调查，惩罚对看似已公开实则不然之事的依赖。容量收入是本平台最可靠的数字，同时也是读者唯一可以原封不动从本看板取用的PJM数字 — 节点、升级成本与FEOC状态均须来自项目本身。若一份PJM方案在提交投委会时采用了已观测的机组调频收入、全RTO平均TB4以及未量化的升级成本，那它是把唯一容易的数字做对了，而把三个困难的数字全做错了。'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  return {
  head: ['Data & Methodology — what is published, what is not, and what this dashboard does about it',
         '数据与方法 — 哪些已公开、哪些未公开，以及本看板如何处理'],
  cap: ['PJM publishes more about capacity than any market on this platform and less about battery revenue. Both shape every number here.',
        'PJM关于容量的公开数据多于本平台任何市场，而关于储能收入的公开数据则最少。两者共同决定了此处的每一个数字。'],
  blocks: [
    { t:'card', mt:false, title:['What is not published — and what this dashboard uses instead','未公开的内容 — 以及本看板的替代做法'], badges:['official'], blocks:[
      { t:'table', head:[['Item','项目'],['Publication status','公开状态'],['Why','原因'],['What is used instead','替代做法']],
        rows: M.notPublished.map(x => [{b:x.item}, {chip:'serious', text:x.status}, x.why, x.instead]) },
      { t:'why', text:['Two entries decide more of the PJM answer than the rest of the dashboard combined, and both are on the revenue side. The forward Regulation level is a construction rather than an observation — a fixed requirement divided by a growing fleet — and it moves the modelled return more than any other single input. And the Regulation/arbitrage split that reads the historical index apart rests on ' + O.eqrUnits + ' FERC filings from one quarter. Neither gap is closeable by better analysis; both need disclosures that have not happened.',
        '有两项对PJM结论的影响超过看板其余部分的总和，且两者都在收入端。前瞻性调频水平属构造式推算而非观测值 — 固定需求除以增长中的机组规模 — 且其对建模回报的影响大于任何其他单一输入。而用于拆解历史指数的调频与套利占比，依据的是某一季度' + O.eqrUnits + '份FERC申报。这两项缺口均无法通过更深入的分析弥补；二者都需要尚未发生的信息披露。'],
        sig:['The capacity half is settled; the revenue half is not','容量端已确定，收入端尚未确定'] },
      { t:'src', src:SRC.regForwardGap, use:['Forward Regulation price and battery share of the requirement','前瞻性调频价格与储能在系统需求中的份额'] },
      { t:'src', src:SRC.regShareGap, use:['The per-unit Regulation / arbitrage split','单机组调频与套利收入拆分'] },
      { t:'src', src:SRC.tollGap, use:['The absence of a PJM toll price','PJM租赁价格的缺失'] },
      { t:'src', src:SRC.opexGap, use:['The US fixed opex gap','美国固定运维成本缺口'] },
      { t:'src', src:SRC.taxGap, use:['State and local equipment tax across thirteen states','十三个州的州及地方设备税'] },
    ] },

    { t:'card', title:['Evidence ladder — what would upgrade each number','证据阶梯 — 各数值的升级路径'], badges:['calc'], blocks:[
      { t:'table', head:[['Source that would settle it','可确证的来源'],['What it settles','可确证的内容']],
        rows: M.evidenceLadder.map(e => [{b:e.n}, e.d]) },
    ] },

    { t:'card', title:['Methodology — how this market is normalised','方法论 — 本市场的归一化方式'], badges:['calc'], blocks:[
      { t:'table', head:[['Decision','决策'],['What this dashboard does','本看板的处理'],['Why','原因']], rows:[
        [{b:['Capacity risk class','容量收入风险类别']},
         ['`auction-renewal`, with one secured year and fourteen declared scenario years.','采用`auction-renewal`，含一个已锁定年度与十四个明示的情景年度。'],
         ['A Base Residual Auction procures one delivery year. Modelling it as a fifteen-year contract would assert revenue nobody has bid for.','基准剩余容量拍卖仅采购一个实需年度。若按十五年合同建模，等于主张一笔无人投标的收入。']],
        [{b:['The renewal path','续期路径']},
         ['Each year declares its own assumed clearing price and ELCC separately, and the payment is their product.','每一年分别声明其假设的出清价格与ELCC，收入为二者之积。'],
         ['They move in opposite directions — the collar lifts while accreditation erodes — so a single blended taper could express neither.','二者方向相反 — 上下限机制解除而核证系数下降 — 单一混合递减规则无法表达其中任何一方。']],
        [{b:['Merchant revenue','市场化收入']},
         ['Split in two: arbitrage in `merchGross` from the TB4 spread, Regulation in `services` from the requirement.','拆分为两项：`merchGross`中的套利收入来自TB4价差，`services`中的调频收入来自系统需求。'],
         ['They behave differently. Arbitrage scales with duration and is growing; Regulation is power-based and saturating.','二者性质不同。套利随时长扩展且在增长；调频为功率型且正在饱和。']],
        [{b:['Forward Regulation','前瞻性调频收入']},
         ['A fixed ~' + fmtN(O.regMarketAfterMW) + ' MW requirement divided by a growing fleet, at the pre-spike June 2025 price. The observed level is the band ceiling.','按固定的约' + fmtN(O.regMarketAfterMW) + 'MW需求除以增长中的机组规模，价格取2025年6月飙升前水平。已观测水平作为区间上限。'],
         ['The observed revenue belongs to a fleet smaller than the requirement it bids into. It is a scarcity rent, and the queue closes it.','已观测收入属于一个规模小于其所竞争需求的机组群体。这是稀缺租金，而排队产能将终结它。']],
        [{b:['The 86/14 split','86/14拆分']},
         ['Labelled ESTIMATED everywhere, and used only to read the historical index apart.','在所有位置均标注为估算值，且仅用于拆解历史指数。'],
         ['No per-unit split is published. Neither forward leg is derived from it.','无任何单机组拆分公开。两条前瞻性收入项均不由其推导。']],
        [{b:['Network access haircut','电网接入折减']},
         ['No `naqFactor` is declared.','未声明`naqFactor`。'],
         ['PJM settles at the nodal LMP, so locational basis is already inside the TB4 spread. A haircut on top would deduct it twice.','PJM按节点边际电价结算，因此区位基差已包含在TB4价差之内。再叠加折减将导致重复扣减。']],
        [{b:['Tolling','租赁']},
         ['`capabilities.tolling` is false, so the route returns "no market precedent".','`capabilities.tolling`设为false，因此该路径返回“无市场先例”。'],
         ['No PJM tolling agreement was located at any price. An unpriced route is not a zero-value route.','未发现任何PJM租赁协议，亦无任何价格。无价格的路径不等于零价值路径。']],
        [{b:['The §48E tax credit','§48E税收抵免']},
         ['Seeded at zero, with an editable 0–37% range on the dedicated Investment Lab page.','种子值为零，并在独立投资测算页面中提供0–37%的可编辑区间。'],
         ['The platform\'s benchmarks exclude project-specific support, but the ITC reaches essentially every compliant US project — so it is exposed rather than buried.','本平台的基准剔除项目专属补贴，但ITC实际上覆盖几乎所有合规的美国项目 — 因此将其显性呈现而非隐去。']],
      ] },
      { t:'note', b:['Currency: ','货币：'],
        text:['All figures are in US dollars, which is also the platform\'s comparison currency. PJM is therefore the only market on this platform whose published economics carry no FX assumption at all — the home page FX row does not apply to it.',
              '所有数字均以美元计，而美元同时也是本平台的对比货币。因此PJM是本平台唯一一个已发布经济性数据完全不含汇率假设的市场 — 首页汇率栏对其不适用。'] },
    ] },

    { t:'card', title:['Source register','来源登记册'], badges:['official'], blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Vintage','数据时点'],['Coverage','覆盖范围']], rows:[
        [{b:['PJM — 2028/2029 BRA results','PJM — 2028/2029年度拍卖结果']}, {chip:'good', text:SRC.bra2829.status}, SRC.bra2829.date, SRC.bra2829.cy],
        [{b:['PJM — 2027/2028 BRA results','PJM — 2027/2028年度拍卖结果']}, {chip:'good', text:SRC.bra2728.status}, SRC.bra2728.date, SRC.bra2728.cy],
        [{b:['PJM — ELCC class ratings, 2028/2029','PJM — ELCC等级评定，2028/2029年度']}, {chip:'good', text:SRC.elcc2829.status}, SRC.elcc2829.date, SRC.elcc2829.cy],
        [{b:['PJM Board — price collar decision','PJM董事会 — 价格上下限决定']}, {chip:'good', text:SRC.collar.status}, SRC.collar.date, SRC.collar.cy],
        [{b:['PJM — Regulation Redesign Phase 1','PJM — 调频市场重构第一阶段']}, {chip:'good', text:SRC.regRedesign.status}, SRC.regRedesign.date, SRC.regRedesign.cy],
        [{b:['PJM — interconnection queue','PJM — 并网排队']}, {chip:'good', text:SRC.queue.status}, SRC.queue.date, SRC.queue.cy],
        [{b:['FERC — Electric Quarterly Reports','FERC — 电力季度报告']}, {chip:'good', text:SRC.eqr.status}, SRC.eqr.date, SRC.eqr.cy],
        [{b:['Modo Energy — TB4 spread','Modo Energy — TB4价差']}, {chip:'warn', text:SRC.tb4.status}, SRC.tb4.date, SRC.tb4.cy],
        [{b:['NREL — utility-scale storage cost','NREL — 公用事业级储能成本']}, {chip:'good', text:SRC.nrel.status}, SRC.nrel.date, SRC.nrel.cy],
        [{b:['IRC §48E and the OBBBA','美国税法典§48E与OBBBA法案']}, {chip:'good', text:SRC.itc.status}, SRC.itc.date, SRC.itc.cy],
      ] },
      { t:'src', src:SRC.nrel, use:['Installed capital cost for the four-hour archetype','四小时原型的安装资本成本'] },
      { t:'src', src:SRC.itc, use:['The tax credit and the material-assistance rules that gate it','税收抵免及作为其前置条件的实质协助规则'] },
    ] },

    { t:'card', title:['Glossary','术语表'], badges:['official'], blocks:[ { t:'glossary' } ] },

    { t:'card', title:['Export','数据导出'], badges:['calc'], blocks:[
      { t:'cap', text:['Exports this dashboard\'s KPI set with its seed tag and vintage. The capacity inputs are primary-source; every merchant figure is derived and is labelled as such in the export.',
                       '导出本看板KPI集合及其种子标签与数据时点。容量输入项来自原始出处；所有市场化数值均为推导值，并在导出文件中如此标注。'] },
      { t:'exports' },
    ] },
  ] };
};

/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. There is no build pathway for this market yet, so Entry is
   the ledger. */
SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['Strong load growth and scarce deliverable rights, around a reference project that returns 2.4% on the model with capacity revenue secured one year at a time.', '负荷增长强劲、可交付并网权稀缺；但参考项目的模型回报仅为2.4%，容量收入每次只能锁定一年。'] },
  { t: 'investment-case', marketId: 'pjm' },
] });
SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['Study and readiness deposits are known to exist and none is sourced, so nothing here is totalled.', '已知存在研究押金与成熟度保证金，但均无来源，因此此处不作合计。'] },
  { t: 'entry-ledger', marketId: 'pjm' },
] });

  return SECTIONS;
}
