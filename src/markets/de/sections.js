/* ---------------------------------------------------------------------------
   Germany — section specs for the shared block engine.

   One organising argument runs through every tab: Germany has Europe's deepest
   BESS revenue pool, its largest congestion bill, and no way for a four-hour
   battery to contract against either. The capacity market exists and excludes
   this asset; the bidding zone was kept whole and so congestion never becomes a
   price. What is left is a merchant position that moved 2.5x in one quarter, and
   tolling as the only structure that converts it into something financeable.

   Content is deliberately tighter than GB's. Every tab is complete and sourced;
   none is padded. Where a figure is not published, the tab says so rather than
   estimating around it — the `data` tab lists all ten such gaps.
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
/* The revenue series are carried in EUR thousands per MW per year, the unit the
   sources publish, so they get their own formatter rather than being multiplied
   up and back down at every call site. */
const kMW = v => fmtC(v) + 'k';

// ============================== OVERVIEW ==============================
SEC_B.home = function (){
  return {
  head: ['Germany — Europe\'s most liquid BESS market, and its least contracted',
         '德国 — 欧洲流动性最强、合同化程度最低的储能市场'],
  cap: ['Where the money is, what it is exposed to, and why a four-hour battery cannot contract its way out of that exposure.',
        '收入来源何在、面临何种敞口，以及四小时储能为何无法通过签约摆脱该敞口。'],
  blocks: [
    { t:'warn', text:M.seedWarn },
    { t:'card', mt:false, title:['Position at a glance','总体判断'], badges:['calc','illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Target COD window','目标投运窗口'], v:M.overall.codWindow,
          d:['evidence confidence ' + M.overall.confidence + '%', '证据置信度 ' + M.overall.confidence + '%'] },
        { l:['Merchant revenue, levelised','市场化收入（平准化）'], v:kMW(M.revBasisSeriesK[2]) + '<small>/MW/yr</small>',
          d:['4h basis; near-term runs far higher','4小时口径；近期水平远高于此'], b:['model'] },
        { l:['Capacity revenue available','可获容量收入'], v:'€0',
          d:['the 4.5 GW auction requires 10 hours','4.5GW拍卖要求10小时时长'], b:['official'] },
        { l:['Congestion management cost','拥塞管理成本'], v:'€3.1<small>bn</small>',
          d:['2025, national; none of it locational','2025年全国口径；无任何区位属性'], b:['official'] },
        { l:['Toll tenor precedent','租赁期限先例'], v:'5<small> yr</small>',
          d:['Förderstedt, 300 MW, 80% tolled','Förderstedt项目，300MW，80%租赁'], b:['official'] },
      ] },
      { t:'ic', b:['House view: ','本方观点：'], text:M.overall.rationale },
    ] },

    { t:'card', title:['The four facts that decide a German case','决定德国投资逻辑的四个事实'], badges:['official'], blocks:[
      { t:'table', head:[['Fact','事实'],['Evidence','证据'],['What it does to the case','对投资逻辑的影响']], rows:[
        [{b:['The capacity market excludes this asset','容量市场排除该类资产']},
         [O.capAuctionGW + ' GW auction, bid deadline ' + O.capBidDeadline + ', ' + O.capYears + '-yr contracts, cap ' + fmtC(O.capCapPerMW) + '/MW/yr — but ' + O.capMinHours + ' hours minimum',
          O.capAuctionGW + 'GW拍卖，投标截止' + O.capBidDeadline + '，' + O.capYears + '年期合同，上限' + fmtC(O.capCapPerMW) + '/MW/年 — 但最低时长要求' + O.capMinHours + '小时'],
         ['Contracted revenue is zero, not small. Model it as unavailable.','合同化收入为零而非较小。应按不可获得处理。']],
        [{b:['One bidding zone, by choice','单一报价区，出于主动选择']},
         ['ENTSO-E found every split more efficient, worth €251–339m; Germany rejected it in December 2025',
          'ENTSO-E研究显示任何拆分方案均更具效率，价值2.51–3.39亿欧元；德国于2025年12月否决'],
         ['Congestion never becomes a price. Siting cannot capture it.','拥塞不会转化为价格。选址无法捕获其价值。']],
        [{b:['Revenue moves violently','收入剧烈波动']},
         ['One optimiser\'s 2h book: ' + kMW(265) + ' in Oct 2025, ' + kMW(143) + ' in Nov, ' + kMW(108) + ' in Dec',
          '某优化商2小时资产组合：2025年10月' + kMW(265) + '，11月' + kMW(143) + '，12月' + kMW(108)],
         ['A single seed is indefensible. The Lab band is the honest form.','单一种子值站不住脚。测算模块的区间才是诚实的表达。']],
        [{b:['Ancillary is collapsing, not compressing','辅助服务收入正在崩塌而非收窄']},
         ['55% of revenue in 2026, forecast to ~5% by 2030; aFRR marginal price down 35% year on year',
          '2026年占收入55%，预计2030年降至约5%；aFRR边际价格同比下跌35%'],
         ['The 2026 revenue mix does not survive the modelled window.','2026年的收入结构无法延续至整个建模窗口。']],
      ] },
      { t:'why', text:['These four are not independent. Germany built the deepest BESS fleet in Europe on an ancillary market that its own build-out is now saturating. The current auction excludes this asset, while the shorter-duration May 2027 route has no clearing price to underwrite, and there is no locational price to differentiate a site. That is why tolling grew here faster than anywhere else: it is the only mechanism that converts a German merchant position into something a lender will size against, and it is why the toll tab matters more here than in any other market on this platform.',
        '这四点并非彼此独立。德国在辅助服务市场之上建成了欧洲规模最大的储能装机，而其自身的建设正在使该市场饱和。当前拍卖排除该类资产，2027年5月的短时长路径尚无可承销的出清价格，同时也无可区分场址的区位价格。这正是租赁模式在德国增长快于其他任何地区的原因：它是唯一能将德国市场化头寸转化为贷款人可据以放贷之物的机制，也是租赁议题在本平台所有市场中于此地最为关键的原因。'],
        sig:['No current clearing, no zonal price, so tolling','无当前出清、无分区电价，故走租赁'] },
    ] },

    { t:'card', title:['Where German BESS revenue comes from, and where it is going','德国储能收入来源及其走向'], badges:['calc'], blocks:[
      { t:'bar', cfg:{ xs:M.ancShareLabels, bw:56, yfmt:v => v + '%', labels:true, h:230,
        series:[{ name:['Ancillary share of revenue','辅助服务收入占比'], color:'var(--s9)', vals:M.ancShareSeries }] } },
      { t:'cap', text:['Ancillary services were 67% of a typical two-hour battery\'s income in 2025 on an independent read, 55% in 2026 on Modo\'s, and are forecast at roughly 5% by 2030 as wholesale arbitrage takes over.',
                       '据独立机构测算，2025年辅助服务占典型两小时储能收入的67%，据Modo测算2026年为55%，预计到2030年随批发套利接管将降至约5%。'] },
      { t:'why', text:['Read this chart as a countdown rather than a mix. The German revenue stack that produced 2026\'s headline numbers is the one being competed away: about 800 MW of battery is qualified for FCR against roughly 570 MW procured, and 580 MW is prequalified for aFRR against about 2 GW procured — with the fleet forecast to reach 5.7 GW by the end of 2026. If just over a third of that qualifies, batteries alone meet the entire aFRR requirement. Great Britain ran this experiment: over £150k/MW/yr in 2022, about £50k by 2023.',
        '应将本图视为倒计时而非收入构成。支撑2026年名义收入的德国收入结构，正是被竞争消解的那一部分：约800MW储能已通过FCR资格认证，而采购量约为570MW；580MW已通过aFRR预认证，而采购量约为2GW — 且预计到2026年底装机将达5.7GW。若其中仅三分之一通过认证，储能即可独自满足全部aFRR需求。英国已经历过这一过程：2022年每MW每年超过15万英镑，到2023年约为5万英镑。'],
        sig:['The 2026 mix is the thing being competed away','2026年的收入结构正是被竞争消解的对象'] },
    ] },
  ] };
};

// ============================== MARKET STORY ==============================
SEC_B.story = function (){
  return {
  head: ['Germany Market Story — from generation beside load to wind north, load south',
         '德国市场演进 — 从电源紧邻负荷到风电在北、负荷在南'],
  cap: ['The German transmission problem is younger than it looks. It was created by two policy decisions and is being solved by four wires.',
        '德国的输电难题比表面看起来更为新近。它由两项政策决定造成，并正由四条线路加以解决。'],
  blocks: [
    { t:'card', mt:false, title:['How the system got here','系统如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2010', t:['Generation sat beside load','电源紧邻负荷'],
          p:['Rhenish lignite served Ruhr industry and Bavarian nuclear served Bavarian industry. The transmission system moved relatively little power over long distances, and congestion was a local matter.',
             '莱茵褐煤供应鲁尔工业，巴伐利亚核电供应巴伐利亚工业。输电系统的长距离输送量相对有限，拥塞属于本地问题。'],
          i:['There was no national north–south transfer problem to invest around.','当时不存在可供投资的全国性南北输送难题。'] },
        { y:'2011–2023', t:['The nuclear exit removed southern generation','弃核移除了南部电源'],
          p:['Southern baseload closed while northern wind grew. The gap between them became the German congestion problem, and it is a transmission problem rather than a generation one.',
             '南部基荷电源关停，而北部风电增长。两者之间的缺口成为德国的拥塞问题，且属于输电问题而非电源问题。'],
          i:['Congestion cost is a transfer constraint, so it is fixed by wires — and wires have dates.','拥塞成本源于输送约束，因此靠线路解决 — 而线路有明确日期。'] },
        { y:'2025', t:['Two decisions closed the locational route','两项决定关闭了区位路径'],
          p:['ENTSO-E published its bidding zone review in April, finding every German split configuration more efficient. Germany notified rejection by end-October and confirmed it in December, publishing a grid action plan instead.',
             'ENTSO-E于4月发布报价区研究，认为任何德国拆分方案都更具效率。德国于10月底通知否决，并于12月确认，转而发布电网行动计划。'],
          i:['Congestion stays socialised. A battery cannot be paid for where it sits.','拥塞成本继续社会化分摊。储能无法因所处位置获得报酬。'] },
        { y:'2026', t:['A capacity market that this asset cannot enter','一个该类资产无法进入的容量市场'],
          p:['The StromVKG auction opened at ' + O.capAuctionGW + ' GW with ' + O.capYears + '-year contracts and a ' + fmtC(O.capCapPerMW) + '/MW/yr cap — and a ' + O.capMinHours + '-hour minimum discharge that excludes two- and four-hour batteries. State-aid approval was still pending when it opened.',
             'StromVKG拍卖以' + O.capAuctionGW + 'GW规模启动，合同期' + O.capYears + '年，上限' + fmtC(O.capCapPerMW) + '/MW/年 — 但' + O.capMinHours + '小时最低放电时长要求将两小时与四小时储能排除在外。启动时国家补助审批仍未完成。'],
          i:['Contracted revenue is unavailable, not merely thin. Tolling is the substitute.','合同化收入并非稀薄，而是无从获得。租赁是其替代方案。'] },
      ] },
    ] },
    { t:'card', title:['What changes next, and when','下一步变化及其时点'], badges:['official'], blocks:[
      { t:'ladder', items:[
        { n:['End 2026 — Ultranet energises','2026年底 — Ultranet送电'],
          d:['2 GW, Osterath to Philippsburg, fully approved 31 October 2025. The nearest relief date in Germany.','2GW，自Osterath至Philippsburg，已于2025年10月31日全面获批。德国最近的缓解时点。'] },
        { n:['2027 — SuedOstLink and A-Nord','2027年 — SuedOstLink与A-Nord'],
          d:['2 GW into Bavaria and about 2 GW into the Rhine belt. The Bavarian link is the one that relieves the platform\'s most locational German opportunity.','2GW接入巴伐利亚，约2GW接入莱茵地区。其中巴伐利亚线路缓解的正是本平台在德国区位属性最强的机会。'] },
        { n:['May 2027 — the shorter-duration capacity auction','2027年5月 — 短时长容量拍卖'],
          d:['A roughly ' + O.gen2AuctionGW + ' GW generation-capacity auction on ' + O.gen2Date + ' drops the ten-hour test. This is the first realistic capacity route for a four-hour asset.','约' + O.gen2AuctionGW + 'GW的发电容量拍卖将于' + O.gen2Date + '举行，取消十小时门槛。这是四小时资产首个现实可行的容量路径。'] },
        { n:['4 August 2029 — the grid fee exemption ends','2029年8月4日 — 电网费用豁免到期'],
          d:['Storage commissioned before that date is exempt; after it the AgNes framework charges €4–7k/MW/yr on capacity only. Twenty-year grandfathering applies where FID precedes the final decision.','该日期前投运的储能可获豁免；此后AgNes框架仅按容量收取每MW每年€4–7k。在最终决定前作出投资决策的项目享有20年祖父条款保护。'] },
        { n:['End 2028 — SuedLink','2028年底 — SuedLink'],
          d:['About 4 GW over roughly 700 km, the largest single piece of German congestion relief and the latest to arrive.','约4GW、约700公里，是德国规模最大的单项拥塞缓解工程，也是最晚投运的一项。'] },
      ] },
      { t:'why', text:['The COD window on this dashboard is ' + M.overall.codWindow + ' and it sits directly inside that ladder, which is the point. A project reaching commercial operation in 2028 sees Ultranet already energised, SuedOstLink and A-Nord landing around it, SuedLink arriving at the end of its first year, and the grid fee exemption expiring in its second. Almost every structural advantage in the German case has a date attached, and most of those dates fall inside the first three years of operation.',
        '本看板的投运窗口为' + M.overall.codWindow + '，恰好处于上述时间序列之中，这正是关键所在。2028年投入商业运营的项目将面临：Ultranet已送电、SuedOstLink与A-Nord在其周边陆续投运、SuedLink在其运营首年末到位、电网费用豁免在其运营第二年到期。德国投资逻辑中几乎每一项结构性优势都附带日期，而其中多数日期落在运营的前三年之内。'],
        sig:['Every German advantage has an expiry date','德国的每一项优势都有到期日'] },
    ] },
  ] };
};

// ============================== CAPACITY MARKET & TOLLING ==============================
SEC_B.capacity = function (){
  return {
  head: ['Capacity Market & Grid-Forming — the route that exists and the route that is open',
         '容量市场与构网能力 — 已存在的路径与真正开放的路径'],
  cap: ['Germany legislated a capacity mechanism and then set an eligibility bar this asset class cannot clear. What filled the gap is tolling.',
        '德国立法建立了容量机制，但设定了该类资产无法达到的准入门槛。填补该空缺的是租赁模式。'],
  blocks: [
    { t:'card', mt:false, title:['The StromVKG capacity auction','StromVKG容量拍卖'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:['First auction volume','首次拍卖规模'], v:O.capAuctionGW + '<small> GW</small>',
          d:['bids close ' + O.capBidDeadline, '投标截止 ' + O.capBidDeadline], b:['official'] },
        { l:['Contract length','合同期限'], v:O.capYears + '<small> yr</small>',
          d:['availability obligations','可用性义务'], b:['official'] },
        { l:['Price cap','价格上限'], v:fmtC(O.capCapPerMW) + '<small>/MW/yr</small>',
          d:['on de-rated capacity','按折减后容量计'], b:['official'] },
        { l:['Minimum discharge duration','最低放电时长'], v:O.capMinHours + '<small> h</small>',
          d:['a 4h battery is ineligible','四小时储能不具备资格'], b:['official'] },
      ] },
      { t:'table', head:[['Requirement','要求'],['Threshold','门槛'],['Does a 4h battery clear it?','四小时储能能否满足？']], rows:[
        [['Continuous discharge duration','连续放电时长'], O.capMinHours + ' h', {chip:'critical', text:['No — this is the binding exclusion','否 — 这是决定性排除条件']}],
        [['Round-trip efficiency','往返效率'], '≥' + O.capMinRtePct + '%', {chip:'good', text:['Yes','是']}],
        [['Technical availability','技术可用率'], O.capAvailPct + '%', {chip:'warn', text:['Demanding but achievable','要求严格但可实现']}],
        [['De-rating applied','适用折减系数'], O.derate10h + ' at 10h, ' + O.derate20h + ' at 20h', {chip:'info', text:['No factor is published below 10h','未公布10小时以下的系数']}],
        [['Local content','本地化要求'], ['Mandate on cells and inverters','对电芯与逆变器设有强制要求'], {chip:'warn', text:['Supply-chain dependency','供应链依赖']}],
      ] },
      { t:'warn', text:['The scheme had not received European Commission state-aid approval when the auction opened; approval was reported on 2 September 2026. A capacity revenue line built on it would still be assuming an eligibility change.',
                        '该机制在拍卖启动时尚未获得欧盟委员会国家补助批准；批准已于2026年9月2日见诸报道。以其为基础建立容量收入项，仍等于假设资格条件将改变。'] },
      { t:'why', text:['The ten-hour bar is why this market\'s contracted revenue is declared zero rather than small, and the distinction matters. A small number invites a reader to scale it; zero states that the mechanism does not admit the asset. The realistic entry point is the roughly ' + O.gen2AuctionGW + ' GW generation-capacity auction on ' + O.gen2Date + ', which drops the duration test — and even then the platform carries no capacity revenue, because no clearing price for a shorter-duration segment exists to carry.',
        '十小时门槛正是本市场合同化收入被声明为零而非较小值的原因，这一区别至关重要。较小的数值会诱使读者按比例放大；而零则表明该机制不接纳此类资产。现实的进入时点是' + O.gen2Date + '约' + O.gen2AuctionGW + 'GW的发电容量拍卖，该轮取消时长门槛 — 但即便如此，本平台仍不计入容量收入，因为短时长档位尚无可供采用的出清价格。'],
        sig:['Zero because ineligible, not because cheap','为零是因不具资格，而非因价格低廉'] },
      { t:'src', src:SRC.stromvkg, use:['Auction volume, eligibility, de-rating and timetable','拍卖规模、资格条件、折减系数及时间表'] },
    ] },

    { t:'card', title:['Tolling — the structure that replaced the capacity route','租赁 — 取代容量路径的结构'], badges:['official'], blocks:[
      { t:'table', head:[['Deal','交易'],['Scale','规模'],['Tenor','期限'],['Structure','结构']], rows:[
        [{b:['Next Kraftwerke / ECO STOR, Förderstedt','Next Kraftwerke与ECO STOR，Förderstedt项目']},
         ['300 MW / >700 MWh','300MW / 超过700MWh'], '5 yr',
         ['80% tolled, 20% merchant; phased from November 2026 in three 100 MW blocks','80%租赁、20%市场化；自2026年11月起分三个100MW区块投运']],
        [{b:['Next Kraftwerke / ju:niz Energy','Next Kraftwerke与ju:niz Energy']},
         ['Not disclosed','未披露'], '7 yr', ['Tolling agreement','租赁协议']],
      ] },
      { t:'kpis', items:[
        { l:['European standalone toll deals','欧洲独立租赁交易'], v:'3 → 15',
          d:['2024 to 2025; six of the fifteen in Germany','2024至2025年；十五笔中六笔在德国'], b:['official'] },
        { l:['Aurora\'s expected tolled share','Aurora预计租赁占比'], v:'40–50%',
          d:['of German BESS capacity, eventually','最终占德国储能装机比例'], b:['official'] },
        { l:['Merchant beats tolling below','低于此水平时市场化优于租赁'], v:kMW(95) + '<small>/MW/yr</small>',
          d:['Modo breakeven, 2h basis','Modo盈亏平衡点，2小时口径'], b:['model'] },
        { l:['Debt capacity flattens above','高于此水平债务承载能力趋平'], v:kMW(115) + '<small>/MW/yr</small>',
          d:['the project cannot support more debt','项目无法承载更多债务'], b:['model'] },
      ] },
      { t:'warn', text:['No German toll fee has ever been publicly disclosed, in any transaction. The band this platform carries is reverse-engineered from a published breakeven analysis and must not be read as a market quote.',
                        '德国从未在任何交易中公开披露租赁费用。本平台采用的区间系自公开的盈亏平衡分析反推得出，不得视为市场报价。'] },
      { t:'why', text:['The economics of a German toll are a leverage trade rather than a revenue trade. A full toll locks returns at about 12% unlevered and supports 85% gearing; a partial toll spans 9–17% unlevered across scenarios. German deals cluster at 80–100% tolled while banks generally will not finance beyond 80% contracted revenue, which is the tension the Förderstedt structure resolves at exactly 80%. Note the tenor: five years against a fifteen-year model life leaves ten years of merchant tail, and that tail is where the toll case is actually won or lost.',
        '德国租赁的经济性本质是杠杆交易而非收入交易。全额租赁将无杠杆回报锁定在约12%，并可支撑85%的杠杆率；部分租赁在各情景下的无杠杆回报为9–17%。德国交易的租赁比例集中在80–100%，而银行通常不为超过80%的合同化收入提供融资 — Förderstedt结构正是以恰好80%化解了这一矛盾。请注意期限：五年期对应十五年建模寿命，留下十年市场化敞口，而这段敞口期才是租赁投资逻辑真正决出成败之处。'],
        sig:['A leverage trade with a ten-year tail','一笔带有十年敞口的杠杆交易'] },
    ] },

    { t:'card', title:['Momentanreserve — the grid-forming product','Momentanreserve — 构网能力产品'], badges:['official'], blocks:[
      { t:'table', head:[['Parameter','参数'],['Value','取值']], rows:[
        [['Procured by','采购方'], ['50Hertz, Amprion, TenneT and TransnetBW jointly','50Hertz、Amprion、TenneT与TransnetBW联合采购']],
        [['Opened','启动时间'], ['22 January 2026; first delivery period to 21 January 2028','2026年1月22日；首个交付期至2028年1月21日']],
        [['Contract tenor','合同期限'], ['2 to 10 years, fixed price','2至10年，固定价格']],
        [['Premium price','溢价档价格'], ['€805/MWs/yr rising to €888.50 at 100% availability; requires 90% availability','每MWs每年€805，可用率100%时升至€888.50；要求可用率90%']],
        [['Basic price','基础档价格'], ['€76 to €109.50/MWs/yr; requires 30% availability','每MWs每年€76至€109.50；要求可用率30%']],
        [['Eligible','合格资源'], ['Grid-forming BESS, flywheels, synchronous condensers','构网型储能、飞轮、同步调相机']],
      ] },
      { t:'why', text:['This platform seeds inertia at €6,038/MW/yr, derived bottom-up from the published tender price: €805/MWs/yr at 90% availability gives €3,019, doubled because a battery supplies positive and negative inertia at once. Third-party analysis publishes €8–20k/MW/yr for the same product. The factor that would reconcile them — how many MWs a battery may register per MW of rating — is not published, so the seed takes the derivable end and the Investment Lab band carries the upside. Either way it is not a driver: at the top of the range it is under a tenth of merchant revenue.',
        '本平台将惯量收入种子值设为每MW每年€6,038，依据公开招标价格自下而上推导：90%可用率下每MWs每年€805对应€3,019，因电池可同时提供正负惯量而翻倍。第三方分析就同一产品公布的数值为每MW每年€8–20k。用于调和两者的系数 — 即每MW额定容量可注册多少MWs — 并未公开，故种子值采用可推导的一端，上行空间由投资测算模块的区间承载。无论如何，它都不是主要驱动因素：即便取区间上限，也不足市场化收入的十分之一。'],
        sig:['Real, contracted, and immaterial','真实存在、已合同化，但影响有限'] },
    ] },
  ] };
};

// ============================== WHOLESALE & INTRADAY ==============================
SEC_B.energy = function (){
  return {
  head: ['Day-ahead & Intraday — five gate closures, and a revenue line that moved 2.5x in a quarter',
         '日前与日内市场 — 五个关闸时点，以及单季度波动2.5倍的收入'],
  cap: ['Germany is Europe\'s most liquid power market for storage. That liquidity is why the revenue is large and why it is unstable.',
        '德国是欧洲储能流动性最强的电力市场。这种流动性既是收入规模较大的原因，也是其不稳定的根源。'],
  blocks: [
    { t:'card', mt:false, title:['Realised revenue — one optimiser\'s two-hour book','实际收入 — 某优化商的两小时资产组合'], badges:['official'], blocks:[
      { t:'bar', cfg:{ xs:M.realLabels, bw:56, yfmt:v => kMW(Math.round(v/1000)), labels:true, h:250,
        series:[{ name:['Annualised revenue per MW','每MW年化收入'], color:'var(--s9)', vals:M.realSeries }] } },
      { t:'cap', text:['Annualised from monthly performance, 2h basis. Daily cycles fell alongside: ' + M.realCycles.join(' → ') + '.',
                       '由月度业绩年化，2小时口径。日循环次数同步下降：' + M.realCycles.join(' → ') + '。'] },
      { t:'why', text:['This is the single most important chart on the German dashboard, and it is a real book rather than a model. Revenue fell 45% from October to November 2025 and another 25% into December, with daily cycles falling from 1.58 to 0.93 — the asset was not merely paid less per cycle, it was dispatched less often. Any German case built on a single revenue number is a case built on one month of that series, and the choice of month decides the answer.',
        '这是德国看板上最重要的一张图，且反映的是真实资产组合而非模型。2025年10月至11月收入下跌45%，至12月再跌25%，日循环次数由1.58降至0.93 — 该资产不仅单次循环收入减少，被调用的频次也在下降。任何以单一收入数字为基础的德国投资逻辑，实质上都建立在该序列中的某一个月之上，而选择哪个月就决定了结论。'],
        sig:['One book, one quarter, 2.5x','同一资产组合，同一季度，2.5倍波动'] },
    ] },

    { t:'card', title:['Which revenue number a fifteen-year model should use','十五年模型应采用哪一个收入数值'], badges:['calc'], blocks:[
      { t:'bar', cfg:{ xs:M.revBasisLabels, bw:48, yfmt:v => kMW(v), labels:true, h:230,
        series:[{ name:['EUR thousands per MW per year','每MW每年（千欧元）'], color:'var(--s10)', vals:M.revBasisSeriesK }] } },
      { t:'note', b:['The platform seeds the levelised figure. ','本平台采用平准化数值作为种子。'],
        text:['Seeding the near-term number would underwrite a 2026 peak for fifteen years. The source\'s own forecast has revenues roughly halving by 2030, and its April 2026 update cut lifetime revenues 16% across the curve with the largest reductions from 2028.',
              '若采用近期数值作为种子，等于以2026年的峰值承销十五年。来源方自身的预测显示收入到2030年将大致腰斩，其2026年4月的更新更将全生命周期收入下调16%，其中2028年起降幅最大。'] },
      { t:'wf', cfg:{ steps:M.spreadBridge, yfmt:v => kMW(v), h:260 } },
      { t:'why', text:['The bridge shows why a four-hour asset is modelled at more than twice a two-hour day-ahead spread and still less than double the two-hour total: energy doubles, but capture per megawatt-hour falls, and the ancillary leg does not scale with duration at all. That last point is the one most often missed. Frequency products are paid on power, so a four-hour battery earns the same ancillary revenue as a two-hour one on the same inverter — which means the ancillary collapse hits a four-hour case proportionally less, and is part of why four hours beats two on returns despite costing a third more.',
        '该桥图说明了为何四小时资产的建模收入高于两小时日前价差的两倍，却仍不足两小时总收入的两倍：能量翻倍，但每兆瓦时的捕获率下降，而辅助服务部分完全不随时长扩展。最后一点最常被忽视。调频类产品按功率计费，因此在同一逆变器上，四小时储能与两小时储能获得的辅助服务收入相同 — 这意味着辅助服务收入的崩塌对四小时方案的相对冲击更小，也是四小时在造价高出三分之一的情况下回报仍优于两小时的原因之一。'],
        sig:['Ancillary is paid on power, not energy','辅助服务按功率计费，而非按电量'] },
    ] },

    { t:'card', title:['The five daily gate closures','每日五个关闸时点'], badges:['official'], blocks:[
      { t:'table', head:[['Gate','时点'],['When','时间'],['Fit for a 4h battery','对四小时储能的适配性']],
        rows: M.gateCloses.map(g => [{b:g.n}, g.when, g.fit]) },
      { t:'src', src:SRC.smard, use:['Day-ahead prices, generation and dispatch','日前价格、发电与调度数据'] },
    ] },
  ] };
};

// ============================== ANCILLARY ==============================
SEC_B.services = function (){
  return {
  head: ['FCR, aFRR & mFRR — a revenue stack its own build-out is removing',
         '一次、二次与三次调频 — 正被自身装机增长消解的收入结构'],
  cap: ['Germany\'s ancillary markets are the most mature in Europe and the closest to saturation. Both statements come from the same figures.',
        '德国的辅助服务市场是欧洲最成熟的，也是最接近饱和的。这两个判断源自同一组数据。'],
  blocks: [
    { t:'card', mt:false, title:['Saturation, measured','饱和程度的量化'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:['FCR — qualified vs procured','FCR — 已认证与采购量对比'], v:'800 / 570<small> MW</small>',
          d:['already oversupplied','已供过于求'], b:['official'] },
        { l:['aFRR — prequalified battery','aFRR — 已预认证储能'], v:'580<small> MW</small>',
          d:['~30% of the operational fleet, against ~2 GW procured','约占已投运装机30%，采购量约2GW'], b:['official'] },
        { l:['aFRR marginal price','aFRR边际价格'], v:'€15<small>/MW/h</small>',
          d:['2026 to date, 35% below the same period of 2025','2026年至今，较2025年同期下跌35%'], b:['official'] },
        { l:['Fleet forecast','装机预测'], v:'5.7<small> GW</small>',
          d:['by end-2026; a third of it meets all aFRR demand','至2026年底；其中三分之一即可满足全部aFRR需求'], b:['model'] },
      ] },
      { t:'why', text:['The arithmetic is unusually clean and it is why this tab exists. German TSOs procure roughly 2 GW of aFRR. The battery fleet is forecast at 5.7 GW by the end of 2026. If a little over a third of that fleet prequalifies — and 30% of today\'s fleet already has — batteries alone meet the entire requirement, with every other technology and every additional megawatt competing for nothing. FCR has already crossed that line at about 800 MW qualified against 570 MW procured. This is not a forecast of saturation; it is a measurement of it.',
        '这一算术关系异常清晰，也正是本页存在的原因。德国电网运营商采购的aFRR约为2GW。预计到2026年底储能装机将达5.7GW。若其中略超三分之一通过预认证 — 而当前装机中已有30%通过 — 储能即可独自满足全部需求，其余所有技术及每一新增兆瓦都将无份额可争。FCR已越过该临界点：约800MW已认证，而采购量为570MW。这不是对饱和的预测，而是对饱和的测量。'],
        sig:['Batteries alone can meet the whole aFRR requirement','仅储能即可满足全部aFRR需求'] },
      { t:'src', src:SRC.regelleistung, use:['FCR, aFRR and mFRR clearing prices and procured volumes','一次、二次及三次调频出清价格与采购量'] },
    ] },
    { t:'card', title:['The Great Britain precedent','英国的先例'], badges:['official'], blocks:[
      { t:'note', b:['What happened there: ','英国的情况：'],
        text:['GB batteries earned over £150k/MW/yr from frequency response in 2022 and about £50k by 2023, after installed capacity crossed roughly 1.1x the requirement. Germany is past that ratio on FCR and approaching it on aFRR.',
              '英国储能2022年调频收入超过每MW每年15万英镑，至2023年降至约5万英镑，此前装机容量已超过需求量约1.1倍。德国在FCR上已越过该比例，在aFRR上正在逼近。'] },
      { t:'why', text:['This platform calibrates Ireland\'s services decay on the GB collapse and it applies the same reasoning here, with one difference worth stating: Ireland\'s decline is legislated and therefore dated, while Germany\'s is competitive and therefore not. A dated cliff can be underwritten around. A competitive one cannot, because the date depends on how fast the fleet your own project is part of prequalifies.',
        '本平台以英国的收入崩塌为基准校准爱尔兰的系统服务衰减曲线，此处采用相同逻辑，但有一处差异值得说明：爱尔兰的下降由立法确定因而有明确日期，德国的下降源于竞争因而没有。有明确日期的断崖可以在承销中加以应对；竞争性的下降则不能，因为其时点取决于你自己项目所属的装机群体通过预认证的速度。'],
        sig:['A competitive cliff has no date to underwrite to','竞争性断崖没有可供承销的日期'] },
    ] },
  ] };
};

// ============================== DURATION ==============================
SEC_B.duration = function (){
  return {
  head: ['Storage Duration — four hours, and the reason it is not ten','储能时长 — 四小时，以及为何不是十小时'],
  cap: ['Germany is the one market on this platform where the duration question has two different right answers depending on which route you are chasing.',
        '德国是本平台唯一一个市场：时长问题的正确答案因所追求的路径不同而不同。'],
  blocks: [
    { t:'card', mt:false, title:['Why the archetype is four hours','为何原型采用四小时'], badges:['calc'], blocks:[
      { t:'table', head:[['Evidence','证据'],['Points to','指向']], rows:[
        [['4h delivers 13.7% unlevered IRR against 12.2% for 2h at 2026 COD, despite 34% higher capex','2026年投运下，四小时无杠杆内部收益率13.7%，两小时为12.2%，尽管造价高出34%'], ['4h','四小时']],
        [['Fluence reports its German project book shifting from around 2h average to 4h','Fluence报告其德国项目组合平均时长由约2小时转向4小时'], ['4h','四小时']],
        [['Newly installed system duration rose from 1.7h to 2.3h in H1 2026 — but this includes residential and C&I','2026年上半年新增系统平均时长由1.7小时升至2.3小时 — 但该数据包含户用及工商业系统'], ['not the grid-scale archetype','非电网级原型']],
        [['Förderstedt, the flagship tolled asset, is 300 MW / >700 MWh','旗舰租赁资产Förderstedt为300MW / 超过700MWh'], ['2.33h — already above 2h','2.33小时 — 已超过两小时']],
        [['The capacity auction requires 10h continuous discharge','容量拍卖要求连续放电10小时'], ['a different asset entirely','完全属于另一类资产']],
      ] },
      { t:'why', text:['Four hours is the right answer for a merchant or tolled German battery and the wrong answer for a capacity-market one, and the gap between them is not bridgeable by adding an hour or two. Ten hours is a different machine with a different capex, a different de-rating factor and a different buyer. A developer choosing four hours is choosing the merchant and tolling routes permanently — at least until the shorter-duration auction in ' + O.gen2Date + ' — and that choice should be made explicitly rather than arrived at by defaulting to the European norm.',
        '对市场化或租赁型德国储能而言，四小时是正确答案；对容量市场型储能而言则是错误答案，且两者之间的差距无法通过增加一两个小时来弥合。十小时是另一种机器：造价不同、折减系数不同、买家也不同。选择四小时的开发商实际上是永久性地选择了市场化与租赁路径 — 至少在' + O.gen2Date + '短时长拍卖之前如此 — 这一选择应当明确作出，而非因沿用欧洲惯例而被动形成。'],
        sig:['Four hours is a route choice, not a sizing choice','四小时是路径选择，而非规模选择'] },
    ] },
    { t:'card', title:['Duration-Need Index','时长需求指数'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
    ] },
    { t:'card', title:['Marginal value of the third and fourth hour','第三、四小时的边际价值'], badges:['calc','illus'], blocks:[
      { t:'wf', cfg:{ steps:M.marginalHour, yfmt:v => kMW(v), h:250 } },
      { t:'cap', text:['Incremental value of moving from two hours to four, per MW per year. Ancillary is unchanged because frequency products are paid on power.',
                       '由两小时提升至四小时的增量价值，单位为每MW每年。辅助服务收入不变，因为调频类产品按功率计费。'] },
    ] },
    { t:'card', title:['Augmentation readiness','扩容准备度'], badges:['illus'], live:true, blocks:[
      { t:'aug' },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  return {
  head: ['Project Pipeline — the fleet that is competing away its own revenue',
         '项目管线 — 正在消解自身收入的装机群'],
  cap: ['German BESS build-out is the direct cause of the ancillary saturation on the services tab. The pipeline and the revenue forecast are one series read twice.',
        '德国储能建设是系统服务页所述辅助服务饱和的直接成因。管线与收入预测本质上是同一序列的两种读法。'],
  blocks: [
    { t:'card', mt:false, title:['Development stage probabilities','开发阶段概率'], badges:['illus'], blocks:[
      { t:'stageProb' },
      { t:'cap', text:['Illustrative weighting used to convert an announced pipeline into a probability-weighted one. Not an official German dataset.',
                       '用于将已公布管线转换为概率加权管线的示意权重。并非德国官方数据集。'] },
    ] },
    { t:'card', title:['Announced versus probability-weighted','已公布容量与概率加权容量'], badges:['calc','illus'], blocks:[
      { t:'pipeChart', unit:'MW' },
      { t:'why', text:['The gap between the two lines is the German investment question stated as a picture. If the announced pipeline arrives, ancillary revenue is gone by the late 2020s and the merchant case has to carry the whole return. If the probability-weighted line is closer to right, the ancillary decay is slower and the 2026 revenue mix survives a few years longer. Nothing on this dashboard settles which — but the FCR figures on the services tab show the fleet has already crossed the saturation threshold for at least one product, which is evidence for the faster path.',
        '两条曲线之间的差距，正是德国投资问题的图形化表达。若已公布管线如期建成，辅助服务收入将在2020年代末消失，全部回报须由市场化部分承担。若概率加权曲线更接近实际，则辅助服务衰减较慢，2026年的收入结构可多维持数年。本看板无法判定孰是孰非 — 但系统服务页的FCR数据显示，装机群在至少一项产品上已越过饱和门槛，这构成了支持较快路径的证据。'],
        sig:['The pipeline and the revenue forecast are the same series','管线与收入预测是同一序列'] },
    ] },
    { t:'card', title:['Named projects','具名项目'], badges:['illus'], blocks:[
      { t:'table', head:[['Project','项目'],['Owner','所有方'],['TSO zone','电网区域'],['MW','MW'],['Hours','时长'],['COD','投运'],['Stage','阶段']],
        num:[3,4],
        rows: M.projects.map(p => [{b:[p.n, p.n]}, [p.owner, p.owner], [p.region, p.region],
                                   String(p.mw), String(p.h), p.cod, {chip:'info', text:[p.st, p.st]}]) },
      { t:'cap', text:['Illustrative register assembled for this dashboard. Germany publishes installed capacity through the Marktstammdatenregister but not a project-level development pipeline with dates.',
                       '为本看板整理的示意登记表。德国通过市场主数据登记册公布已装机容量，但不公布含日期的项目级开发管线。'] },
      { t:'src', src:SRC.mastr, use:['Installed capacity and duration of new systems','新增系统的装机容量与时长'] },
    ] },
  ] };
};

// ============================== GRID ==============================
SEC_B.grid = function (){
  return {
  head: ['Grid & Connection Cost — €3.1bn of congestion that never becomes a price',
         '并网与接入费用 — 31亿欧元拥塞成本从未转化为价格'],
  cap: ['Germany spends more managing congestion than any market on this platform and gives a battery the least direct way to reach it. The map and register below say where and until when.',
        '德国的拥塞管理支出高于本平台任何市场，而储能触达该价值的路径最为间接。下方地图与登记表说明其位置与持续时间。'],
  blocks: [
    { t:'card', mt:false, title:['Interactive Germany grid — past, current and planned','德国电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
      { t:'geo-grid-map', data:gridMapById('de-grid-map') },
      { t:'why', text:['The map makes the German problem legible in one shape: generation moved north when the nuclear fleet closed in the south, and the four HVDC corridors are the answer. Ultranet lands at the end of 2026, SuedOstLink and A-Nord in 2027, SuedLink at the end of 2028. All four are reported as running late, which is the only reason a German congestion thesis has a runway at all.',
        '地图以单一图形清晰呈现德国的问题：南部核电关停后发电重心北移，四条高压直流走廊即为应对之策。Ultranet于2026年底投运，SuedOstLink与A-Nord于2027年，SuedLink于2028年底。四者均有延期报道，这也是德国拥塞投资逻辑尚存窗口期的唯一原因。'],
        sig:['Ten gigawatts of relief, all of it dated','十吉瓦缓解能力，且均有明确日期'] },
      { t:'src', src:SRC.bnetza, use:['Congestion volumes, costs and grid development','拥塞电量、成本与电网发展'] },
    ] },

    { t:'congestion', data:congestionFor('de') },

    { t:'card', title:['Connection cost — the Baukostenzuschuss','接入费用 — 并网工程费分摊'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:['Reported BKZ range','已报告BKZ区间'], v:'€110–165k<small>/MW</small>',
          d:['one-off, non-refundable','一次性，不可退还'], b:['official'] },
        { l:['Court position','法院立场'], v:'Upheld',
          d:['Bundesgerichtshof, 15 July 2025; charges already levied not reimbursable','联邦最高法院，2025年7月15日；已征收部分不予返还'], b:['official'] },
        { l:['Grid fee exemption ends','电网费用豁免到期'], v:'4 Aug 2029',
          d:['then €4–7k/MW/yr on capacity only','其后仅按容量收取每MW每年€4–7k'], b:['official'] },
        { l:['Energy-based charge','按电量计费方案'], v:'Rejected',
          d:['would have cost ~4pp of a 20-yr IRR','本将使20年内部收益率损失约4个百分点'], b:['official'] },
      ] },
      { t:'warn', text:['It is not confirmed whether the capex figures this platform carries already include the Baukostenzuschuss. That is a 12–24% swing on German capital cost and the single largest unresolved item in this market. The Investment Lab band carries the uncertainty at its upper end.',
                        '目前无法确认本平台采用的造价数据是否已包含并网工程费分摊。该项对德国资本成本的影响幅度为12–24%，是本市场最大的未决事项。投资测算模块的区间在上限处承载了这一不确定性。'] },
      { t:'why', text:['The German regulator did something unusual in May 2026 and it deserves noting: presented with the option of an energy-based grid charge for storage, it chose a capacity-only charge instead. An energy charge at the level discussed would have stripped about four percentage points from a twenty-year IRR; the capacity charge that was chosen costs about half a point. That is the difference between a financeable asset class and an unfinanceable one, decided in a single regulatory instrument, and it is the strongest evidence on this dashboard that German policy is trying to keep storage viable even while excluding it from the capacity market.',
        '德国监管机构于2026年5月作出了一项不寻常的决定，值得记录：在面临对储能采用按电量计费的电网费用方案时，其选择了仅按容量计费。按所讨论水平的电量计费方案本将使二十年内部收益率损失约四个百分点；而最终选定的容量计费方案成本约为半个百分点。这正是可融资资产类别与不可融资资产类别之间的差别，由单一监管文件所决定 — 也是本看板上最有力的证据，表明德国政策在将储能排除于容量市场之外的同时，仍在努力维持其可行性。'],
        sig:['Capacity-only, not energy-based: half a point instead of four','仅按容量而非按电量：半个百分点而非四个'] },
      { t:'src', src:SRC.agnes, use:['The AgNes grid fee framework and its grandfathering','AgNes电网费用框架及其祖父条款'] },
    ] },

    { t:'card', title:['The corridors behind the congestion — named projects and approval stage','拥塞背后的走廊工程 — 具名项目及核准阶段'], badges:['official','forecast'], blocks:[
      { t:'table',
        head:[['Corridor','走廊'],['Route','路径'],['Delivery body','交付主体'],['Approval stage','核准阶段'],['Scope','范围'],['GW','GW'],['Target','目标年份'],['Status','状态']], num:[5,6],
        rows: M.reinforcements.map(x => {
          const k = M.planClasses.find(c => c.id === x.cls);
          return [{ b:x.n }, x.region, [x.operator, x.operator], { chip:k.c, text:k.n }, x.scope,
                  x.gw == null ? null : String(x.gw), String(x.year), x.status];
        }) },
      { t:'cap', text:['The four HVDC corridors a German congestion thesis depends on, plus the statutory plan behind them. Ten gigawatts of relief across three years.',
        '德国拥塞投资逻辑所依赖的四条高压直流走廊，以及其背后的法定规划。三年内共十吉瓦缓解能力。'] },
      { t:'table', head:[['Approval stage','核准阶段'],['What it does and does not confer','其赋予与不赋予的内容']],
        rows: M.planClasses.map(k => [{ chip:k.c, text:k.n }, k.d]) },
      { t:'why', text:['What is striking about this table is how little it separates. Four corridors, two approval classes, one delivery period, and every one of them reported late — including Ultranet, which is fully approved and still slipping. That uniformity is the German finding: the relief is not a portfolio of independent projects that might arrive at different times, it is a single synchronised bet on the same supply chain, the same contractors and the same construction window. So there is no diversification to underwrite. If the corridors run late together the congestion thesis extends for everyone at once, and if they land together it closes for everyone at once. Two consequences follow. Do not model corridor-by-corridor relief probabilities as independent. And treat 2029 — after SuedLink and the same year the grid fee exemption ends — as the year the German case has to stand on something other than congestion.',
        '本表最值得注意的，是它区分度之低。四条走廊、两个核准类别、一个交付期，且每一条都有延期报道 — 包括已全面核准却仍在推迟的Ultranet。这种一致性正是德国的关键结论：缓解措施并非一组可能在不同时点到位的独立项目，而是对同一供应链、同一承包商、同一施工窗口的单一同步押注。因此不存在可供承销的分散化。若各走廊同步延期，拥塞逻辑将对所有人同时延长；若同步投运，则对所有人同时终结。由此有两点推论。不应将各走廊的缓解概率按独立事件建模。并应将2029年 — SuedLink之后、且与电网费用豁免到期同年 — 视为德国投资逻辑必须依靠拥塞以外因素支撑的那一年。'],
        sig:['One synchronised bet, not four projects','这是一次同步押注，而非四个项目'] },
      { t:'src', src:SRC.ultranet, use:['Ultranet route, capacity and approval decision','Ultranet路径、容量及核准决定'] },
      { t:'src', src:SRC.suedostlink, use:['SuedOstLink route, capacity and final-section approval','SuedOstLink路径、容量及最后区段核准'] },
      { t:'src', src:SRC.suedlink, use:['SuedLink route, capacity and construction progress','SuedLink路径、容量及施工进展'] },
      { t:'src', src:SRC.bnetza, use:['Statutory network development planning and confirmed need','法定电网发展规划及已确认需求'] },
    ] },

    { t:'card', title:['Connection risk scorecard','并网风险记分卡'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'connFactors', bands:'connBands' },
    ] },
  ] };
};

// ============================== BENCHMARK ==============================
SEC_B.benchmark = function (){
  /* Switched from Great Britain to Italy when Italy landed in the 2026-08 round,
     which is what the previous note said to do. GB was the right comparator while
     the question was "who else rejected zonal pricing"; Italy is the right one now
     that the question is "what does a market get for keeping it". The two are the
     mirror image of each other on the single variable that decides both: whether
     congestion becomes a price a battery can trade. Italy's own benchmark tab
     runs the same comparison from the other side. */
  return {
  head: ['Germany vs Italy — the same constraint, opposite answers',
         '德国与意大利对比 — 相同的约束，相反的答案'],
  cap: ['Both markets put renewable generation far from industrial load. Germany kept one bidding zone and socialised the congestion; Italy kept six and had its TSO buy storage inside them.',
        '两个市场的新能源发电均远离工业负荷。德国维持单一报价区并将拥塞成本社会化；意大利保留六个报价区，并由电网运营商在区内采购储能。'],
  blocks: [
    { t:'card', mt:false, title:['One variable, isolated','隔离出的单一变量'], badges:['calc'], blocks:[
      { t:'table', head:[['','' ],['Germany','德国'],['Italy','意大利']], rows:[
        [{b:['Zonal pricing','分区电价']},
         [{chip:'critical', text:['Rejected December 2025; ENTSO-E had found every split more efficient','2025年12月否决；ENTSO-E曾认为任何拆分均更具效率']}],
         [{chip:'good', text:['Six bidding zones, retained','六个报价区，予以保留']}]],
        [{b:['Locational procurement','区位化采购']},
         [{chip:'critical', text:['None','无']}],
         [{chip:'good', text:['MACSE — requirement set by zone, zero in the North','MACSE — 按区域设定需求，北部为零']}]],
        [{b:['Congestion pool','拥塞资金池']},
         ['≈€3.1bn congestion management, 2025','2025年拥塞管理成本约31亿欧元'],
         ['Not published as a national total; priced instead, by zone','未公布全国总量；改以分区方式定价']],
        [{b:['Observable price of one constraint','单一约束的可观测价格']},
         [{chip:'critical', text:['None — congestion cost is socialised','无 — 拥塞成本社会化分摊']}],
         ['Sicily cleared MACSE 30% above Sud e Calabria for the same product','西西里MACSE同一产品出清价较南部及卡拉布里亚高30%']],
        [{b:['Capacity route for a 4h battery','四小时储能的容量路径']},
         [{chip:'critical', text:['Ineligible — 10-hour minimum discharge','不具备资格 — 最低放电10小时']}],
         [{chip:'good', text:['€47,000/MW/yr at 67% de-rating, 15-yr contracts','每MW每年€47,000，折减系数67%，15年期合同']}]],
        [{b:['Routes to market','售电路径数量']},
         [{chip:'warn', text:['Two — toll and merchant','两条 — 租赁与市场化']}],
         [{chip:'good', text:['Four — MACSE, capacity, toll, merchant','四条 — MACSE、容量、租赁、市场化']}]],
        [{b:['The weak half of the evidence','证据薄弱的一半']},
         [{chip:'warn', text:['Revenue — a realised book moved 2.5x in a quarter','收入 — 实际运营账簿单季度波动2.5倍']}],
         [{chip:'warn', text:['Cost — capex evidence spans a factor of 2.4','成本 — 造价证据跨度达2.4倍']}]],
      ] },
      { t:'why', text:['The comparison isolates one variable and the answer is unflattering to Germany. Both markets face renewable generation far from industrial load. Germany was told by ENTSO-E that every bidding-zone split would be more efficient, rejected it, and now carries €3.1bn of annual congestion cost that no battery can reach through siting — so tolling is doing all the structural work, and no German toll price has ever been published. Italy kept its zones and went further, having Terna buy storage where the constraint binds at a price it publishes by zone. An Italian developer chooses between four routes on published numbers; a German one negotiates a toll in the dark.',
        '该对比隔离出单一变量，而答案对德国并不有利。两个市场均面临新能源发电远离工业负荷的问题。ENTSO-E告知德国任何报价区拆分方案都更具效率，德国予以否决，如今每年承担31亿欧元拥塞成本，而储能无法通过选址触达 — 因此租赁承担了全部结构性作用，且德国从未公布过任何租赁价格。意大利保留了分区并更进一步，由Terna在约束发生处采购储能，并按区域公布价格。意大利开发商可依据公开数据在四条路径中作出选择；德国开发商则只能在不透明的环境中议定租赁条件。'],
        sig:['Italy publishes the price of its constraint; Germany does not have one','意大利公布其约束的价格；德国则不存在这一价格'] },
    ] },

    { t:'card', title:['And the mirror-image weakness','以及镜像式的弱点'], badges:['calc'], blocks:[
      { t:'note', b:['Do not read this as Italy winning. ','不应将此解读为意大利胜出。'],
        text:['Germany publishes revenue with unusual precision and contracts with none: realised monthly books, per-product ancillary clearing prices, published 2h and 4h IRRs — and not one toll fee. Italy publishes contracts with unusual precision and cost with none: MACSE clearing prices to the euro by zone, capacity premiums, four dated relief projects — and no fixed opex figure, no toll price, and a capex band spanning a factor of 2.4. Each market is opaque exactly where the other is transparent, which is why the two dashboards fail differently and why neither one\'s method transfers cleanly to the other.',
              '德国以异常的精度公布收入，却完全不公布合同：月度实际运营账簿、分产品辅助服务出清价格、已公布的2小时与4小时内部收益率 — 唯独没有任何租赁费用。意大利以异常的精度公布合同，却完全不公布成本：按区域精确至欧元的MACSE出清价格、容量溢价、四项有明确日期的缓解工程 — 却没有固定运维数据、没有租赁价格，造价区间跨度达2.4倍。两个市场恰好在对方透明之处不透明，这正是两个看板失效方式不同的原因，也是任一市场的方法无法直接移植到另一市场的原因。'] },
      { t:'why', text:['Great Britain was the comparator on this tab until Italy landed, and the reason for the swap is worth stating. Against GB the question was "who else rejected zonal pricing", and the answer was that both did and Britain kept more instruments — a Balancing Mechanism that dispatches batteries, a Capacity Market a four-hour asset can enter. Against Italy the question is sharper: what does a market actually get for keeping zonal pricing? Four routes instead of two, a published price for one named constraint, and a developer who can pick a zone on evidence. That is the cost of the German decision, stated as a number rather than as a principle.',
        '在意大利加入之前，本页的对比对象是英国，此次更换的理由值得说明。与英国对比时，问题是“还有谁否决了分区电价”，答案是两国均已否决，而英国保留了更多工具 — 可调度储能的平衡机制，以及四小时资产可进入的容量市场。与意大利对比时，问题更为尖锐：保留分区电价究竟能为一个市场带来什么？四条路径而非两条，一项具名约束的公开价格，以及可依据证据选择区域的开发商。这就是德国那项决定的代价，以数字而非原则的形式呈现。'],
        sig:['The cost of the German decision, stated as a number','德国那项决定的代价，以数字形式呈现'] },
    ] },
  ] };
};

// ============================== PORTFOLIO ==============================
SEC_B.portfolio = function (){
  return {
  head: ['Portfolio / Fund View — screening a German opportunity','组合与基金视图 — 德国机会筛选'],
  cap: ['A worked screening example on this dashboard\'s own assumptions. Illustrative — it demonstrates the gate sequence, not a transaction.',
        '基于本看板自身假设的筛选示例。仅作示意，用于演示门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Investment Committee gates','投委会门槛'], badges:['calc'], blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Route declared before the model','门槛1 — 建模前确定路径'],
          d:['Merchant or tolled, chosen and evidenced first. They are different assets: a full toll locks about 12% unlevered and 85% gearing, a merchant case spans a band twice as wide.',
             '先确定并证明采用市场化或租赁路径。二者属不同资产：全额租赁锁定约12%无杠杆回报及85%杠杆率，市场化方案的区间宽度则为其两倍。'],
          c:'serious', s:['Decides the asset','决定资产性质'] },
        { n:['Gate 2 — Capex includes the BKZ, or does not','门槛2 — 造价是否包含BKZ'],
          d:['A 12–24% swing on German capital cost. Ask the EPC and the DSO separately; the Bundesgerichtshof confirmed in July 2025 that the charge stands and is not reimbursable.',
             '对德国资本成本的影响幅度为12–24%。应分别向EPC承包商与配电运营商核实；联邦最高法院已于2025年7月确认该费用成立且不予返还。'],
          c:'critical', s:['Unresolved on this platform','本平台尚未解决'] },
        { n:['Gate 3 — COD before 4 August 2029','门槛3 — 2029年8月4日前投运'],
          d:['The grid fee exemption and its twenty-year grandfathering both hinge on this date, with FID needing to precede the final AgNes decision.',
             '电网费用豁免及其二十年祖父条款均取决于该日期，且投资决策须在AgNes最终决定之前作出。'],
          c:'warn', s:['Schedule-critical','时间关键'] },
        { n:['Gate 4 — Ancillary modelled as decaying','门槛4 — 辅助服务按衰减建模'],
          d:['Confirm the case does not hold 2026\'s 55% ancillary share flat. FCR is already oversupplied and aFRR marginal prices are down 35% year on year.',
             '确认方案未将2026年55%的辅助服务占比保持不变。FCR已供过于求，aFRR边际价格同比下跌35%。'],
          c:'critical', s:['Model it to ~5% by 2030','应建模至2030年降至约5%'] },
        { n:['Gate 5 — Merchant tail after the toll','门槛5 — 租赁到期后的市场化敞口'],
          d:['A five-year toll against a fifteen-year life leaves ten years of merchant tail. That tail is where the toll case is won or lost, and it is unhedged.',
             '五年期租赁对应十五年寿命，留下十年市场化敞口。该敞口期决定租赁方案的成败，且未经对冲。'],
          c:'serious', s:['Ten years unhedged','十年无对冲'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['Germany rewards a decision made early and punishes one deferred. Route, capex basis and COD date all have to be settled before the model is built, because each of them moves the answer by more than the model\'s own precision. A German case that reaches investment committee with the toll unpriced, the BKZ unresolved and the ancillary line held flat is not a case — it is three open questions with a spreadsheet attached.',
              '德国奖励尽早作出的决定，惩罚被推迟的决定。路径、造价口径与投运日期均须在建模之前确定，因为其中任何一项对结论的影响都超过模型自身的精度。若一份德国方案在提交投委会时租赁未定价、BKZ未澄清、辅助服务收入按不变处理，那它不是一份方案 — 而是附带电子表格的三个未决问题。'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  return {
  head: ['Data & Methodology — what is published, what is not, and what this dashboard does about it',
         '数据与方法 — 哪些已公开、哪些未公开，以及本看板如何处理'],
  cap: ['Germany publishes more about BESS revenue than any market on this platform and less about BESS contracts. Both shape every number here.',
        '德国关于储能收入的公开数据多于本平台任何市场，而关于储能合同的公开数据则最少。两者共同决定了此处的每一个数字。'],
  blocks: [
    { t:'card', mt:false, title:['What is not published — and what this dashboard uses instead','未公开的内容 — 以及本看板的替代做法'], badges:['official'], blocks:[
      { t:'table', head:[['Item','项目'],['Publication status','公开状态'],['Why','原因'],['What is used instead','替代做法']],
        rows: M.notPublished.map(x => [{b:x.item}, {chip:'serious', text:x.status}, x.why, x.instead]) },
      { t:'why', text:['Two entries in this table decide more of the German answer than the rest of the dashboard combined. No toll fee has ever been disclosed in any German transaction, so the platform\'s toll band is reverse-engineered from a published breakeven analysis rather than quoted. And it is unconfirmed whether the capex figures include the Baukostenzuschuss, which is a 12–24% swing. Neither gap is closeable by better analysis; both need a disclosure that has not happened.',
        '本表中有两项对德国结论的影响超过看板其余部分的总和。德国从未在任何交易中披露租赁费用，因此本平台的租赁区间系自公开的盈亏平衡分析反推得出，而非引用报价。此外，造价数据是否包含并网工程费分摊尚未确认，其影响幅度为12–24%。这两项缺口均无法通过更深入的分析弥补；二者都需要一项尚未发生的信息披露。'],
        sig:['Two disclosures away from a defensible answer','距离可靠结论仅差两项披露'] },
      { t:'src', src:SRC.tollPriceGap, use:['The toll price coverage gap','租赁价格数据缺口'] },
      { t:'src', src:SRC.inertiaGap, use:['The inertia revenue discrepancy','惯量收入数据分歧'] },
      { t:'src', src:SRC.redispatchGap, use:['Whether storage is compensated under Redispatch 2.0','储能在Redispatch 2.0机制下是否获得补偿'] },
    ] },

    { t:'card', title:['Evidence ladder — what would upgrade each number','证据阶梯 — 各数值的升级路径'], badges:['calc'], blocks:[
      { t:'table', head:[['Source that would settle it','可确证的来源'],['What it settles','可确证的内容']],
        rows: M.evidenceLadder.map(e => [{b:e.n}, e.d]) },
    ] },

    { t:'card', title:['Methodology — how this market is normalised','方法论 — 本市场的归一化方式'], badges:['calc'], blocks:[
      { t:'table', head:[['Decision','决策'],['What this dashboard does','本看板的处理'],['Why','原因']], rows:[
        [{b:['Capacity revenue','容量收入']},
         ['Declared zero; `capacityMarket` is false and the capacity-backed route returns "not applicable".','声明为零；`capacityMarket`设为false，容量支撑路径返回"不适用"。'],
         ['The mechanism exists but requires ten hours of continuous discharge. A four-hour battery is ineligible, not merely poorly paid.','该机制存在，但要求连续放电十小时。四小时储能是不具备资格，而非仅仅收入偏低。']],
        [{b:['Merchant revenue basis','市场化收入口径']},
         ['Seeded at the lifetime-levelised figure scaled to four hours, not the near-term number.','以平准化全生命周期数值折算至四小时作为种子，而非采用近期数值。'],
         ['A fifteen-year model cannot underwrite a 2026 peak. The source\'s own forecast roughly halves revenue by 2030.','十五年模型不能以2026年的峰值承销。来源方自身预测显示收入到2030年将大致腰斩。']],
        [{b:['Two-hour to four-hour scaling','两小时至四小时折算']},
         ['1.50x, derived from the published 2h and 4h capex ratio of 1.336 and IRR ratio of 1.123.','1.50倍，依据公开的两小时与四小时造价比1.336及内部收益率比1.123推导。'],
         ['Only 2h revenue is published. Stating the scalar lets a reader who disputes it discount every German revenue figure at once.','仅公布了两小时收入。明示该系数可使有异议的读者一次性对所有德国收入数据进行折减。']],
        [{b:['Inertia','惯量收入']},
         ['Seeded at the bottom-up €6,038/MW/yr; the published €8–20k range sits at the top of the Lab band.','以自下而上推导的每MW每年€6,038作为种子；公开的€8–20k区间置于测算模块区间上限。'],
         ['The two disagree by roughly three times and the reconciling registration factor is not published. The seed takes the derivable end.','两者相差约三倍，且用于调和的注册系数并未公开。种子值采用可推导的一端。']],
        [{b:['Congestion','拥塞']},
         ['Carried in the congestion register only, never as a revenue line.','仅计入拥塞登记表，绝不作为收入项。'],
         ['Germany rejected the bidding-zone split, so congestion has no locational price. Whether storage is compensated under Redispatch 2.0 is unverified.','德国已否决报价区拆分，因此拥塞不具备区位价格。储能在Redispatch 2.0机制下是否获得补偿尚未核实。']],
      ] },
      { t:'note', b:['Currency: ','货币：'],
        text:['All figures are in euros. The cross-market comparison converts at the platform\'s seeded EUR rate; see the home page FX row for the rate and its date.',
              '所有数字均以欧元计。跨市场对比按本平台设定的欧元汇率换算；汇率及其日期见首页汇率栏。'] },
    ] },

    { t:'card', title:['Source register','来源登记册'], badges:['official'], blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Vintage','数据时点'],['Coverage','覆盖范围']], rows:[
        [{b:['Bundesnetzagentur — congestion management','联邦网络管理局 — 拥塞管理']}, {chip:'good', text:SRC.bnetza.status}, SRC.bnetza.date, SRC.bnetza.cy],
        [{b:['Bundesnetzagentur — StromVKG auction','联邦网络管理局 — StromVKG拍卖']}, {chip:'good', text:SRC.stromvkg.status}, SRC.stromvkg.date, SRC.stromvkg.cy],
        [{b:['Bundesnetzagentur — AgNes grid fees','联邦网络管理局 — AgNes电网费用']}, {chip:'warn', text:SRC.agnes.status}, SRC.agnes.date, SRC.agnes.cy],
        [{b:['German TSOs — Momentanreserve tender','德国电网运营商 — Momentanreserve招标']}, {chip:'good', text:SRC.momentanreserve.status}, SRC.momentanreserve.date, SRC.momentanreserve.cy],
        [{b:['ENTSO-E — Bidding Zone Review','ENTSO-E — 报价区研究']}, {chip:'good', text:SRC.entsoe.status}, SRC.entsoe.date, SRC.entsoe.cy],
        [{b:['Bundesgerichtshof — BKZ ruling','联邦最高法院 — BKZ裁决']}, {chip:'good', text:SRC.bgh.status}, SRC.bgh.date, SRC.bgh.cy],
        [{b:['regelleistung.net — ancillary tenders','regelleistung.net — 辅助服务招标']}, {chip:'good', text:SRC.regelleistung.status}, SRC.regelleistung.date, SRC.regelleistung.cy],
        [{b:['SMARD — market data','SMARD — 市场数据']}, {chip:'good', text:SRC.smard.status}, SRC.smard.date, SRC.smard.cy],
      ] },
      { t:'src', src:SRC.entsoe, use:['The bidding zone configurations Germany rejected','德国所否决的报价区配置方案'] },
    ] },

    { t:'card', title:['Glossary','术语表'], badges:['official'], blocks:[ { t:'glossary' } ] },

    { t:'card', title:['Export','数据导出'], badges:['calc'], blocks:[
      { t:'cap', text:['Exports this dashboard\'s KPI set with its seed tag and vintage. Contract prices are absent because they are not published.',
                       '导出本看板KPI集合及其种子标签与数据时点。合同价格因未公开而缺失。'] },
      { t:'exports' },
    ] },
  ] };
};

/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. Germany has no build pathway yet, so Entry is the ledger. */
SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['One of the higher modelled returns here with nothing secured in the reference project, and transmission connection requests from batteries several times what the grid plan sees a need for.', '模型回报在各市场中居前，但参考项目没有任何锁定收入；电池提出的输电网并网申请，是电网规划所需规模的数倍。'] },
  { t: 'investment-case', marketId: 'de' },
] });
SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['At transmission level a flat application fee and a deposit of EUR 1,500 per MW fall due before the investment decision. The connection cost contribution is far larger and is listed without being counted, and development spend has no source, so the total is a lower bound.', '在输电网层面，最终投资决策之前须缴纳一笔定额申请费和每MW 1,500欧元的保证金。并网工程费分摊金额大得多，此处仅列示而不计入；前期开发支出没有来源，因此合计为下限。'] },
  { t: 'entry-ledger', marketId: 'de' },
] });

  return SECTIONS;
}
