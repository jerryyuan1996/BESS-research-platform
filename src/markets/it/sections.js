/* ---------------------------------------------------------------------------
   Italy — section specs for the shared block engine.

   One organising argument runs through every tab: Italy is the only market on
   this platform where all four routes to market exist at once, and the only one
   where choosing between them is a genuine spread rather than a formality. Terna
   publishes more that is directly investable than any other TSO here — zonal
   procurement requirements, clearing prices by zone, and four named submarine
   projects with commissioning years. What it does not publish is the cost side,
   and that asymmetry shapes every number on these tabs.

   Two structural facts are repeated deliberately rather than stated once,
   because a reader who misses either will overstate Italy badly:

     · MACSE is priced per MWh-YEAR, not per MW-year.
     · MACSE and the capacity market are MUTUALLY EXCLUSIVE. Never add them.

   Content is deliberately tighter than GB's. Every tab is complete and sourced;
   none is padded. Where a figure is not published, the tab says so rather than
   estimating around it — the `data` tab lists all twelve such gaps.
   --------------------------------------------------------------------------- */
import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';
import { MACSE_AUCTION, MACSE_ZONES, MACSE_CAPTION } from './storageZones.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { h, L, MKT, M, SRC, state, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct,
          compositeScore, liveScore, dilutionAt } = api;

const SEC_B = {};
function SECTIONS(){
  const o = {};
  Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
  return o;
}
const O = M.official;
/* Revenue series are carried in EUR thousands per MW per year, the unit the
   sources publish, so they get their own formatter rather than being multiplied
   up and back down at every call site. */
const kMW = v => fmtC(v) + 'k';

// ============================== OVERVIEW ==============================
SEC_B.home = function (){
  return {
  head: ['Italy — four routes to market, and a real spread between them',
         '意大利 — 四条售电路径，且彼此之间存在真实价差'],
  cap: ['What each route pays, what it costs to take, and why the cheapest-looking one buys the thing the others cannot.',
        '各条路径的收益、选择该路径的代价，以及为何看似最低价的一条能换来其他路径无法提供的东西。'],
  blocks: [
    { t:'warn', text:M.seedWarn },
    { t:'card', mt:false, title:['Position at a glance','总体判断'], badges:['calc','illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Investment stance','投资立场'], v:L(M.overall.statusL),
          d:['COD window ' + M.overall.codWindow, '投运窗口 ' + M.overall.codWindow] },
        { l:['Composite score','综合评分'], v:String(compositeScore()) + '<small>/100</small>',
          d:['confidence ' + M.overall.confidence + '%', '置信度 ' + M.overall.confidence + '%'], b:['calc'] },
        { l:['Routes to market','售电路径数量'], v:'4',
          d:['MACSE, capacity market, toll, merchant — the richest set here','MACSE、容量市场、租赁、市场化 — 本平台最完整的组合'], b:['official'] },
        { l:['MACSE clear, 4h equivalent','MACSE出清价，4小时等值'], v:kMW(51.8) + '<small>/MW/yr</small>',
          d:['€12,959/MWh/yr weighted average, 15 yr from 2028','加权平均每MWh每年€12,959，自2028年起15年'], b:['official'] },
        { l:['Merchant, South mainland','市场化收入，南部大陆'], v:kMW(123) + '<small>/MW/yr</small>',
          d:['4h wholesale only, excluding MSD','仅4小时批发口径，不含辅助服务'], b:['model'] },
        { l:['MACSE requirement in the North','北部MACSE需求'], v:'0<small> GWh</small>',
          d:['of 10 GWh in the first auction — a TSO decision, not an outcome','首次拍卖10GWh中的0GWh — 属电网运营商决定而非市场结果'], b:['official'] },
      ] },
      { t:'ic', b:['House view: ','本方观点：'], text:M.overall.rationale },
    ] },

    { t:'card', title:['The four facts that decide an Italian case','决定意大利投资逻辑的四个事实'], badges:['official'], blocks:[
      { t:'table', head:[['Fact','事实'],['Evidence','证据'],['What it does to the case','对投资逻辑的影响']], rows:[
        [{b:['MACSE is priced per MWh-year, not per MW-year','MACSE按每MWh每年计价，而非每MW每年']},
         ['€' + fmtN(O.macseWavg) + '/MWh/yr weighted average; the awarded fleet came in at ' + fmtN(O.macseAwardedMW) + ' MW across ' + fmtN(O.macseAwardedMWh) + ' MWh — ' + O.macseHoursAvg + ' hours average',
          '加权平均每MWh每年€' + fmtN(O.macseWavg) + '；中标机组共' + fmtN(O.macseAwardedMW) + 'MW、' + fmtN(O.macseAwardedMWh) + 'MWh — 平均' + O.macseHoursAvg + '小时'],
         ['A MACSE bidder builds a different machine. Compare per MWh, never per MW.','MACSE投标人建设的是另一种设备。应按每MWh比较，绝不可按每MW。']],
        [{b:['MACSE and the capacity market do not stack','MACSE与容量市场不可叠加']},
         ['A MACSE-contracted system cannot simultaneously hold a capacity market nomination','已签MACSE合同的系统不能同时持有容量市场申报'],
         ['Adding the two lines overstates Italy by about ' + fmtC(31490) + '/MW/yr. They are alternatives.','将两项收入相加会使意大利被高估约每MW每年' + fmtC(31490) + '。二者为替代关系。']],
        [{b:['Terna zoned the procurement, not just the price','Terna对采购而非仅对价格进行了分区']},
         ['Requirement set at zero for the North and Centre-North; Sicily cleared 30% above Sud e Calabria for the same product',
          '北部与中北部需求设为零；西西里同一产品出清价较南部及卡拉布里亚高30%'],
         ['Zone eligibility is a hard line. Confirm it before anything else in the model matters.','区域资格是硬性界线。在模型中其他任何事项之前，须先确认。']],
        [{b:['The cost side is the weak side','成本侧是薄弱环节']},
         ['Capex evidence spans a factor of ' + O.capexSpreadX + '; no toll price disclosed in three signed deals; no Italian fixed opex published at all',
          '造价证据跨度达' + O.capexSpreadX + '倍；三笔已签租赁交易均未披露价格；意大利完全未公布固定运维成本'],
         ['Italy prices its revenue to the euro and does not price its cost at all.','意大利将收入精确公布至欧元，却完全不公布成本。']],
      ] },
      { t:'why', text:['These four are not independent. Terna publishes revenue with unusual precision because it is the buyer — MACSE clearing prices, capacity premiums and zonal requirements are all its own procurement records. Nobody occupies the equivalent position on the cost side, so the capex band spans a factor of 2.4 and no toll fee has ever been disclosed. The practical consequence is that an Italian case is decided by which route you take and which zone you take it in, both of which are knowable in advance from published documents, and then re-decided by a capex number nobody will give you. That is the opposite failure mode to Germany, where the revenue is the uncertain half.',
        '这四点并非彼此独立。Terna之所以能以异常的精度公布收入数据，是因为它本身就是买方 — MACSE出清价格、容量溢价与分区需求都是其自身的采购记录。成本侧则无人处于同等地位，因此造价区间跨度达2.4倍，且从未有租赁费用被披露。实际后果是：意大利的投资逻辑先由所选路径与所在区域决定 — 二者均可从公开文件中事先获知 — 随后又被一个无人愿意提供的造价数字重新决定。这与德国恰好相反，在德国不确定的一半是收入。'],
        sig:['Revenue published to the euro, cost not published at all','收入精确至欧元，成本完全未公布'] },
    ] },

    { t:'card', title:['The four routes on one basis','四条路径的统一口径比较'], badges:['calc'], blocks:[
      { t:'bar', cfg:{ xs:M.revBasisLabels, bw:48, yfmt:v => kMW(v), labels:true, h:240,
        series:[{ name:['EUR thousands per MW per year, 4h basis','每MW每年（千欧元），4小时口径'], color:'var(--s10)', vals:M.revBasisSeriesK }] } },
      { t:'cap', text:['All four converted to the same four-hour, per-megawatt basis. The MACSE bar is the same asset\'s contracted alternative, not a different product. The Timera bar is an observed peak, not a forecast.',
                       '四者均换算至相同的四小时、每兆瓦口径。MACSE柱代表同一资产的合同化替代方案，而非另一种产品。Timera柱为观测到的峰值，而非预测值。'] },
      { t:'why', text:['On a like-for-like energy basis MACSE cleared at €12,959 per MWh per year against a merchant wholesale value of €24,500 in the North and €30,750 in the South mainland, and against its own price cap of €37,000 — so the auction cleared at 35% of its ceiling and at roughly 42–53% of the wholesale value of the same stored energy, before any MSD revenue at all. That is a large discount and it is not irrational. What the winner buys with it is a fifteen-year contract with the transmission system operator as counterparty, which supports materially higher gearing at a lower cost of debt than a merchant position can. Whether that trade clears is exactly what the dedicated Investment Lab page is for.',
        '在同等能量口径下，MACSE以每MWh每年€12,959出清，而市场化批发价值在北部为€24,500、南部大陆为€30,750，其自身价格上限为€37,000 — 因此本次拍卖以其上限的35%出清，约为同等储存电量批发价值的42–53%，且尚未计入任何辅助服务市场收入。这是一个很大的折让，但并非不理性。中标方以此换来的是一份以输电系统运营商为对手方的十五年期合同，其可支撑的杠杆水平显著高于市场化头寸、债务成本亦更低。这笔交易是否划算，正是独立投资测算页面所要回答的问题。'],
        sig:['A 45% discount buys a fifteen-year TSO counterparty','45%的折让换来十五年期电网运营商对手方'] },
    ] },
  ] };
};

// ============================== MARKET STORY ==============================
SEC_B.story = function (){
  return {
  head: ['Italy Market Story — from thermal beside load to a TSO that buys storage by zone',
         '意大利市场演进 — 从火电紧邻负荷到电网运营商按区域采购储能'],
  cap: ['Italy did not arrive at a locational storage market by accident. It kept zonal pricing when its neighbours dropped it, and then built a procurement mechanism shaped like the constraint.',
        '意大利并非偶然形成了区位化的储能市场。在邻国放弃分区电价时它予以保留，随后又建立了一套与约束形态相匹配的采购机制。'],
  blocks: [
    { t:'card', mt:false, title:['How the system got here','系统如何演变至此'], badges:['official'], blocks:[
      { t:'timeline', items:[
        { y:'2010', t:['Thermal generation beside northern load','火电紧邻北部负荷'],
          p:['The Po Valley gas fleet supplied the industrial north and the islands ran as weakly connected systems of their own. Zonal prices existed but the constraint that now defines the market had not formed.',
             '波河谷燃气机组为北部工业区供电，岛屿则作为弱联网的独立系统运行。当时已有分区电价，但如今定义该市场的约束尚未形成。'],
          i:['Zonal pricing was a settlement convention, not an investment signal.','分区电价当时只是一种结算惯例，而非投资信号。'] },
        { y:'2015–2024', t:['Renewables built in the south, demand stayed in the north','新能源建于南部，需求仍在北部'],
          p:['Wind and solar concentrated in the south and the islands while industrial demand stayed in the Po Valley. Renewables reached ' + O.renewShare2025Pct + '% of national demand in 2025.',
             '风电与光伏集中于南部与岛屿地区，而工业需求仍位于波河谷。2025年新能源占全国需求的' + O.renewShare2025Pct + '%。'],
          i:['The north–south transfer became the Italian constraint, and it is a transmission problem.','南北输送成为意大利的约束，且属于输电问题。'] },
        { y:'Feb 2025', t:['A national storage requirement, set by decree','以法令形式确定的全国储能需求'],
          p:['MASE ' + O.maseDecree + ' set the national storage requirement to 2028, giving Terna a mandate to procure rather than merely to plan.',
             'MASE' + O.maseDecree + '确定了至2028年的全国储能需求，赋予Terna采购授权而不仅是规划职能。'],
          i:['The buyer became the TSO. That is what makes the Italian contract bankable.','买方成为电网运营商。这正是意大利合同具备可融资性的原因。'] },
        { y:'Sep 2025', t:['MACSE clears — and clears by zone','MACSE出清 — 且按区域出清'],
          p:[O.macseAwardedMWh.toLocaleString('en-GB') + ' MWh awarded across ' + O.macseProjects + ' projects at a weighted average of €' + fmtN(O.macseWavg) + '/MWh/yr, 15 years from ' + O.macseDelivery + '. The requirement for the North and Centre-North was set at zero.',
             '共' + O.macseAwardedMWh.toLocaleString('en-GB') + 'MWh在' + O.macseProjects + '个项目中中标，加权平均每MWh每年€' + fmtN(O.macseWavg) + '，自' + O.macseDelivery + '年起为期十五年。北部与中北部的需求被设为零。'],
          i:['The clearest published locational signal on this platform, with a price attached.','本平台最清晰的公开区位信号，且附有价格。'] },
        { y:'2026', t:['A second auction, tilted further south','第二次拍卖，进一步向南倾斜'],
          p:['Scheduled for ' + O.macseAuction2Date + ' at ' + O.macseAuction2GWh + ' GWh, up from ' + O.macseAuction1GWh + '. South and Calabria\'s ceiling rises from ' + O.macseSudCeil1 + ' to ' + O.macseSudCeil2 + ' GWh and Sicily\'s floor doubles to ' + O.macseSiciFloor2 + ' GWh.',
             '定于' + O.macseAuction2Date + '举行，规模' + O.macseAuction2GWh + 'GWh，高于此前的' + O.macseAuction1GWh + 'GWh。南部与卡拉布里亚的上限由' + O.macseSudCeil1 + 'GWh升至' + O.macseSudCeil2 + 'GWh，西西里下限翻倍至' + O.macseSiciFloor2 + 'GWh。'],
          i:['No reserve premium published. A 2026 MACSE result does not yet exist.','尚未公布保留溢价。2026年MACSE结果尚不存在。'] },
      ] },
      { t:'why', text:['Read the sequence rather than the endpoint. Great Britain rejected zonal pricing in July 2025 and Germany in December, on the same finding that a split would be more efficient. Italy already had zonal pricing and, instead of stopping there, added a zonal procurement on top of it. The result is that an Italian battery has two locational signals — a settlement price that varies by zone and a TSO that will or will not buy storage in that zone at all — where a German or British one has neither. That is the single structural reason Italy carries four routes and Germany carries two.',
        '应关注这一序列本身而非终点。英国于2025年7月、德国于12月否决分区电价，二者所依据的研究结论均为拆分更具效率。意大利本就实行分区电价，并未止步于此，而是在其之上叠加了分区采购。结果是意大利储能拥有两重区位信号 — 随区域变动的结算价格，以及电网运营商是否会在该区域采购储能 — 而德国或英国储能两者皆无。这正是意大利拥有四条路径而德国仅有两条的唯一结构性原因。'],
        sig:['Two locational signals where its neighbours have none','邻国均无区位信号，而意大利有两重'] },
      { t:'src', src:SRC.macse, use:['Auction volumes, zonal requirements and clearing prices','拍卖规模、分区需求与出清价格'] },
    ] },

    { t:'card', title:['Six bidding zones, and what each one offers a battery','六个报价区，及其对储能的意义'], badges:['official'], blocks:[
      { t:'table', head:[['Zone','区域'],['What it means for a project','对项目的意义']],
        rows: M.regions.map(r => [{b:r.n}, r.note]) },
      { t:'why', text:['Zone eligibility is a hard line in Italy, not a gradient. A project in Nord and a project in Sicilia are not the same asset with different prices — they have different route sets. The northern developer has the capacity market or a bilateral toll and nothing else; the Sicilian developer has all four, and the one it is most likely to win cleared 30% above the southern mainland. Confirm which side of that line a site sits on before any other diligence, because it determines which of the four models on this platform even applies.',
        '在意大利，区域资格是一条硬性界线而非渐变。位于北部与位于西西里的项目并非价格不同的同一类资产 — 它们的可选路径集合本就不同。北部开发商只有容量市场或双边租赁，别无他选；西西里开发商则拥有全部四条路径，且其最可能中标的一条出清价较南部大陆高出30%。在任何其他尽调之前，应先确认场址位于该界线哪一侧，因为这决定了本平台四个模型中哪一个才适用。'],
        sig:['Different zones are different route sets, not different prices','不同区域意味着不同的路径集合，而非不同的价格'] },
    ] },
  ] };
};

// ============================== MACSE & CAPACITY MARKET ==============================
SEC_B.capacity = function (){
  return {
  head: ['MACSE & Capacity Market — two contracted routes that cannot be held together',
         'MACSE与容量市场 — 两条无法同时持有的合同化路径'],
  cap: ['Italy has two contracted mechanisms with the same counterparty logic and mutually exclusive eligibility. Choosing between them is the first real decision in an Italian case.',
        '意大利拥有两套对手方逻辑相同、资格却互斥的合同化机制。在二者之间作出选择，是意大利投资逻辑中的第一个实质性决定。'],
  blocks: [
    { t:'card', mt:false, title:['MACSE — Terna\'s centralised storage procurement','MACSE — Terna的集中式储能采购'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:['Awarded, first auction','首次拍卖中标量'], v:fmtN(O.macseAwardedMWh) + '<small> MWh</small>',
          d:[fmtN(O.macseAwardedMW) + ' MW across ' + O.macseProjects + ' projects', fmtN(O.macseAwardedMW) + 'MW，共' + O.macseProjects + '个项目'], b:['official'] },
        { l:['Weighted average clear','加权平均出清价'], v:'€' + fmtN(O.macseWavg) + '<small>/MWh/yr</small>',
          d:['against a €' + fmtN(O.macseCap) + ' cap — ' + O.macseClearPctOfCap + '% of ceiling', '价格上限为€' + fmtN(O.macseCap) + ' — 相当于上限的' + O.macseClearPctOfCap + '%'], b:['official'] },
        { l:['Awarded fleet duration','中标机组平均时长'], v:O.macseHoursAvg + '<small> h</small>',
          d:['because the price follows energy, not power','因计价基础为电量而非功率'], b:['calc'] },
        { l:['Contract term','合同期限'], v:O.macseYears + '<small> yr</small>',
          d:['delivery from ' + O.macseDelivery + '; TSO counterparty', '自' + O.macseDelivery + '年起交付；对手方为电网运营商'], b:['official'] },
      ] },
      { t:'table', head:[['Zone','区域'],['Clearing price','出清价格'],['Four-hour equivalent','四小时等值'],['Read','解读']], rows:[
        [{b:['Sicilia','西西里']}, '€' + fmtN(O.macseSici) + '/MWh/yr', kMW(Math.round(O.macseSici * 4 / 1000)) + '/MW/yr',
         {chip:'good', text:['Highest of any zone — ~30% above the southern mainland','各区域最高 — 较南部大陆高约30%']}],
        [{b:['Sardegna','撒丁岛']}, '€' + fmtN(O.macseSard) + '/MWh/yr', kMW(Math.round(O.macseSard * 4 / 1000)) + '/MW/yr',
         {chip:'good', text:['Second highest; island system with deep MSD','第二高；孤岛系统，辅助服务市场深度较大']}],
        [{b:['Sud e Calabria','南部与卡拉布里亚']}, '€' + fmtN(O.macseSud) + '/MWh/yr', kMW(Math.round(O.macseSud * 4 / 1000)) + '/MW/yr',
         {chip:'warn', text:['Lowest clear; largest volume; ceiling rises to ' + O.macseSudCeil2 + ' GWh','出清价最低；规模最大；上限升至' + O.macseSudCeil2 + 'GWh']}],
        [{b:['Nord and Centro-Nord','北部与中北部']}, {chip:'critical', text:['No requirement set','未设定需求']}, '—',
         {chip:'critical', text:['No MACSE route exists at all','完全不存在MACSE路径']}],
      ] },
      { t:'warn', text:['MACSE and the capacity market are mutually exclusive. A MACSE-contracted system cannot simultaneously hold a capacity market nomination, and adding the two revenue lines together overstates an Italian case by about ' + fmtC(31490) + '/MW/yr at the four-hour archetype. The comparison engine treats routes as alternatives, so this is enforced structurally — but a spreadsheet built outside it will not enforce anything.',
                        'MACSE与容量市场互斥。已签MACSE合同的系统不能同时持有容量市场申报，将两项收入相加会使四小时原型下的意大利方案被高估约每MW每年' + fmtC(31490) + '。对比引擎将各路径视为替代关系，故已在结构上强制执行 — 但在引擎之外自建的电子表格不会执行任何约束。'] },
      { t:'why', text:['The per-MWh pricing is the whole mechanism in one design choice, and it is why the awarded fleet averaged ' + O.macseHoursAvg + ' hours against the four hours the rest of the Italian market indexes on. Terna is buying stored energy, so a bidder maximises MWh per euro of capex rather than MW. At four hours the weighted average clear is worth ' + fmtC(O.macse4hEquiv) + '/MW/yr; at the ' + O.macseHoursAvg + ' hours actually awarded, the same clearing price is ' + fmtC(O.macseAtAwardedHours) + '/MW/yr. Any comparison against Japan\'s LTDA or the NEM\'s CIS has to hold that in mind, because those pay per MW and this does not.',
        '按每MWh计价这一设计选择本身即概括了整套机制，也解释了为何中标机组平均时长达' + O.macseHoursAvg + '小时，而意大利市场其余部分的基准为四小时。Terna采购的是储存的电量，因此投标人会追求每欧元造价所对应的MWh最大化，而非MW。在四小时口径下，加权平均出清价对应每MW每年' + fmtC(O.macse4hEquiv) + '；而在实际中标的' + O.macseHoursAvg + '小时下，同一出清价对应每MW每年' + fmtC(O.macseAtAwardedHours) + '。与日本长期脱碳电源拍卖或澳大利亚容量投资计划作比较时必须牢记这一点，因为后两者按每MW计价，而本机制不是。'],
        sig:['Per MWh, not per MW — and the fleet responded','按每MWh而非每MW计价 — 中标机组作出了相应回应'] },
      { t:'src', src:SRC.macse, use:['Awarded volumes, zonal clearing prices and the auction timetable','中标规模、分区出清价格与拍卖时间表'] },
    ] },

    { t:'card', title:['What a MACSE winner gives up','MACSE中标方所放弃的东西'], badges:['official','calc'], blocks:[
      { t:'table', head:[['Term','条款'],['Effect on the model','对模型的影响']], rows:[
        [{b:['Terna resells the contracted time-shifting product','Terna转售已签约的时移产品']},
         ['The owner does NOT keep dispatch optionality on contracted energy. Merchant upside on that energy is not the owner\'s to capture.','业主对已签约电量不保留调度选择权。该部分电量的市场化上行收益不归业主。']],
        [{b:['The assignee keeps MSD trading control','受让方保留辅助服务市场交易控制权']},
         ['Roughly ' + O.macseTernaSharePct + '% of contribution margin returns to Terna, leaving about ' + O.macseRetentionPct + '% with the owner. Corroborated by two secondary readings, NOT verified in the scheme regulation.','约' + O.macseTernaSharePct + '%的贡献毛利返还Terna，业主留存约' + O.macseRetentionPct + '%。经两项二手解读佐证，未在机制规则文本中核实。']],
        [{b:['Not stackable with the capacity market','不可与容量市场叠加']},
         ['Approximately ' + fmtC(31490) + '/MW/yr of capacity revenue is forgone at the four-hour archetype.','四小时原型下放弃约每MW每年' + fmtC(31490) + '的容量收入。']],
        [{b:['Technical compliance requires oversizing','技术合规要求超配']},
         [O.macseOversizePct + '% oversizing on an ' + O.macseOversizeHours + '-hour system to hold contracted capacity across the term — the basis for this dashboard\'s 1.1%/yr degradation seed.',
          O.macseOversizeHours + '小时系统需超配' + O.macseOversizePct + '%以在全期维持已签约容量 — 本看板每年1.1%衰减率种子值即据此设定。']],
        [{b:['No capital grant','无资本补贴']},
         ['`excludesGrant` is set on the MACSE route. The award is the support.','MACSE路径设置了`excludesGrant`。中标本身即为支持措施。']],
      ] },
      { t:'why', text:['The retention percentage is the most sensitive unverified input in the Italian case and it deserves to be moved rather than trusted. At 20% retention the MACSE route is a near-pure contracted position; at 40% it becomes a hybrid whose merchant tail changes the gearing calculation materially. Two independent secondary sources put it near 20% and the scheme regulation text was not obtained. A reader who has the regulation should override this input in the Investment Lab before drawing a conclusion from the frontier chart.',
        '留存比例是意大利投资逻辑中最敏感的未核实输入，应当加以调整而非直接采信。在20%留存下，MACSE路径接近纯合同化头寸；在40%下则成为混合结构，其市场化敞口将显著改变杠杆测算。两个独立二手来源认为该比例接近20%，机制规则文本未能取得。若读者持有该规则文本，应在投资测算模块中覆盖此输入后再从边界图得出结论。'],
        sig:['The 80/20 split is the least verified number here','80/20分成是此处核实程度最低的数字'] },
    ] },

    { t:'card', title:['The capacity market — the northern route','容量市场 — 北部路径'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:[O.cmDY + ' premium', O.cmDY + '溢价'], v:fmtC(O.cmPremium) + '<small>/MW/yr</small>',
          d:['on de-rated capacity','按折减后容量计'], b:['official'] },
        { l:['New-build contract term','新建项目合同期限'], v:O.cmYearsNew + '<small> yr</small>',
          d:['existing capacity receives ' + O.cmYearsExisting + ' year', '既有容量为' + O.cmYearsExisting + '年'], b:['official'] },
        { l:['BESS share of new de-rated capacity','储能占新增折减容量比例'], v:O.cmBessSharePct + '<small>%</small>',
          d:['on 15-year contracts','15年期合同'], b:['official'] },
        { l:['De-rating at 4h','4小时折减系数'], v:fmtPct(O.cmDerate4h * 100),
          d:[O.cmDerate8h * 100 + '% at 8h; ' + O.cmDerate4hProposed * 100 + '% proposed for ' + O.cmProposedDY, '8小时为' + O.cmDerate8h * 100 + '%；' + O.cmProposedDY + '拟降至' + O.cmDerate4hProposed * 100 + '%'], b:['official'] },
      ] },
      { t:'warn', text:['Terna has PROPOSED cutting the four-hour de-rating factor from ' + O.cmDerate4h + ' to ' + O.cmDerate4hProposed + ' for ' + O.cmProposedDY + ' — a ' + O.cmDerateCutPct + '% reduction per nameplate MW that would withdraw what is currently Europe\'s most favourable battery de-rating. It is a proposal, not a decision, and it sits at the floor of this platform\'s contracted band rather than in the seed.',
                        'Terna已提议将' + O.cmProposedDY + '的四小时折减系数由' + O.cmDerate4h + '下调至' + O.cmDerate4hProposed + ' — 按铭牌MW计相当于削减' + O.cmDerateCutPct + '%，将撤回目前欧洲最有利的储能折减待遇。该项为提案而非决定，因此置于本平台合同化收入区间的下限而非种子值。'] },
      { t:'why', text:['The capacity market is the only contracted route open to a northern Italian project, which is why the de-rating proposal matters more than its size suggests. In the south a developer facing a de-rating cut can bid MACSE instead; in the north there is no alternative except a bilateral toll at a price nobody publishes. Note also the direction the de-rating runs: Italy pays 67% at four hours and 90% at eight, so unlike Germany — where the capacity mechanism excludes short duration outright — Italian duration buys capacity revenue rather than forfeiting it. That reinforces the same conclusion the MACSE result reaches from the other side.',
        '容量市场是意大利北部项目唯一开放的合同化路径，这使得折减系数提案的重要性超出其数值本身。在南部，面临折减下调的开发商可转而投标MACSE；在北部则除了价格无人公布的双边租赁之外别无选择。还应注意折减系数的方向：意大利四小时为67%、八小时为90%，因此与德国 — 容量机制直接排除短时长 — 不同，意大利的时长可换取容量收入而非丧失容量收入。这从另一侧强化了MACSE结果所指向的同一结论。'],
        sig:['Duration buys capacity revenue here, unlike Germany','与德国不同，此处时长可换取容量收入'] },
      { t:'src', src:SRC.derating, use:['De-rating factors by duration and the DY2028 proposal','按时长划分的折减系数及2028实需年度提案'] },
    ] },

    { t:'card', title:['Tolling — the route with no published price','租赁 — 无公开价格的路径'], badges:['official'], blocks:[
      { t:'table', head:[['Deal','交易'],['Scale','规模'],['Tenor','期限'],['Price','价格']], rows:[
        [{b:['Axpo / Zelestra','Axpo与Zelestra']}, [O.tollAxpoMW + ' MW, ' + O.tollAxpoRegion, O.tollAxpoMW + 'MW，意大利北部'],
         O.tollAxpoYears + ' yr', {chip:'critical', text:['Not disclosed','未披露']}],
        [{b:['Zelestra / EnBW','Zelestra与EnBW']}, [O.tollEnbwMW + ' MW / ' + fmtN(O.tollEnbwMWh) + ' MWh (4h)', O.tollEnbwMW + 'MW / ' + fmtN(O.tollEnbwMWh) + 'MWh（4小时）'],
         ['Not disclosed','未披露'], {chip:'critical', text:['Not disclosed','未披露']}],
        [{b:['Zelestra / BKW','Zelestra与BKW']}, ['Not disclosed','未披露'], ['Not disclosed','未披露'],
         {chip:'critical', text:['Not disclosed','未披露']}],
      ] },
      { t:'kpis', items:[
        { l:['Signed Italian tolls','已签署的意大利租赁交易'], v:String(O.tollDeals),
          d:['prices disclosed: ' + O.tollPricesDisclosed, '已披露价格数量：' + O.tollPricesDisclosed], b:['official'] },
        { l:['Rational floor','理性下限'], v:kMW(51.8) + '<small>/MW/yr</small>',
          d:['below this a developer takes MACSE instead','低于此水平开发商将转而选择MACSE'], b:['model'] },
        { l:['Rational ceiling','理性上限'], v:kMW(123) + '<small>/MW/yr</small>',
          d:['above this the offtaker loses on the wholesale leg alone','高于此水平承购方仅在批发环节即告亏损'], b:['model'] },
        { l:['Platform seed','平台种子值'], v:kMW(87) + '<small>/MW/yr</small>',
          d:['the midpoint, stated as a midpoint','取中值，并明示为中值'], b:['model'] },
      ] },
      { t:'warn', text:['No Italian toll price has been disclosed in any of the three signed deals. The proposition that Italian tolls price above MACSE is therefore an UNVERIFIED hypothesis, not a finding — there is no Italian toll price in existence to verify it against. The band this platform carries is bounded by two anchors a rational toll must sit between, and it must not be read as a market quote.',
                        '三笔已签署的意大利租赁交易均未披露价格。因此“意大利租赁定价高于MACSE”属未经证实的假设而非结论 — 根本不存在可供比对的意大利租赁价格。本平台采用的区间以理性租赁定价必然落入的两个锚点为界，不得视为市场报价。'] },
      { t:'why', text:['The bounding argument is worth stating explicitly because it is doing all the work. A developer will not sign a toll below what MACSE pays for the same asset, because MACSE is available and carries the TSO as counterparty — so €51,836/MW/yr at four hours is a floor. An offtaker will not pay above the four-hour wholesale spread of €123,000/MW/yr, because above that it loses money on the wholesale leg before any MSD upside — so that is a ceiling. Both ends are derived from published Italian numbers; neither is a toll price. The seed sits at the midpoint and should be moved by anyone holding better information.',
        '这一定界论证值得明确说明，因为全部推理都由它承担。开发商不会以低于MACSE对同一资产付费水平签署租赁，因为MACSE可得且以电网运营商为对手方 — 故四小时下每MW每年€51,836构成下限。承购方不会支付高于四小时批发价差每MW每年€123,000的价格，因为超过该水平其在计入任何辅助服务上行空间之前即在批发环节亏损 — 故此为上限。两端均由已公布的意大利数据推导而来；两者都不是租赁价格。种子值取中值，掌握更好信息者应予调整。'],
        sig:['Two anchors, no quotation','两个锚点，没有报价'] },
      { t:'src', src:SRC.tollPriceGap, use:['The Italian toll price coverage gap','意大利租赁价格数据缺口'] },
    ] },
  ] };
};

// ============================== WHOLESALE & INTRADAY ==============================
SEC_B.energy = function (){
  return {
  head: ['Wholesale & Intraday — a zonal price and a forecast that does not decay',
         '批发与日内市场 — 分区价格与不衰减的预测'],
  cap: ['Italy is the one market on this platform whose published forward wholesale view is roughly flat in real terms. That is the source\'s finding, and it changes how a fifteen-year model behaves.',
        '意大利是本平台唯一一个公开远期批发预测按实际价值计大致持平的市场。这是来源方的结论，并会改变十五年模型的表现。'],
  blocks: [
    { t:'card', mt:false, title:['The zonal spread, four-hour basis','分区价差，四小时口径'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:['North (Nord)','北部'], v:kMW(O.modoNorth / 1000) + '<small>/MW/yr</small>',
          d:['wholesale only, excluding MSD','仅批发口径，不含辅助服务'], b:['model'] },
        { l:['South mainland (Sud)','南部大陆'], v:kMW(O.modoSouth / 1000) + '<small>/MW/yr</small>',
          d:['the seed — the only zone where all four routes coexist','种子值 — 四条路径唯一并存的区域'], b:['model'] },
        { l:['Forecast shape to ' + O.modoFlatTo, '至' + O.modoFlatTo + '年预测形态'], v:'Flat',
          d:['in real terms; no decay curve applied','按实际价值计；未施加衰减曲线'], b:['model'] },
        { l:['Observed peak, ' + O.timeraPeakPeriod, O.timeraPeakPeriod + '观测峰值'], v:'€' + O.timeraPeakPerKW + '<small>/kW/yr</small>',
          d:['an observation, not a forecast','为观测值而非预测值'], b:['official'] },
      ] },
      { t:'why', text:['Germany\'s dashboard applies a declining dilution curve because Modo cut German lifetime revenues 16% across the forward view. Italy\'s does not, because the same house publishes an Italian forecast that is roughly flat in real terms to ' + O.modoFlatTo + '. Bending it would substitute a house view for the source, so this platform carries it flat and puts the real Italian downside where it belongs: MSD saturation, on the services tab. A reader who disbelieves the flat forecast should move the merchant band down in the Investment Lab rather than expect the dashboard to have done it silently.',
        '德国看板施加了递减稀释曲线，因为Modo在其远期预测中将德国全生命周期收入下调了16%。意大利看板未施加，因为同一机构发布的意大利预测按实际价值计至' + O.modoFlatTo + '年大致持平。弯曲该曲线等于以本方观点替代来源结论，因此本平台按持平处理，并将意大利真正的下行风险置于其应在之处：辅助服务市场饱和，见系统服务页。若读者不认同持平预测，应在投资测算模块中下调市场化收入区间，而非期待看板已在暗中作出调整。'],
        sig:['Flat is the source\'s finding, not a missing series','持平是来源方的结论，而非缺失的序列'] },
    ] },

    { t:'card', title:['Published spread to executable margin','由公开价差到可执行价差'], badges:['calc'], blocks:[
      { t:'wf', cfg:{ steps:M.spreadBridge, yfmt:v => '€' + fmtN(v), h:260 } },
      { t:'cap', text:['€ per discharged MWh, four-hour basis. MSD is settled separately and is NOT in this line — it enters the model at ' + fmtC(O.msdSeed) + '/MW/yr. The optimiser fee is applied once in the model, as lab.optFee, and is deliberately not a step here.',
                       '单位为每放电MWh欧元，四小时口径。辅助服务市场单独结算，不含于本项 — 其在模型中按每MW每年' + fmtC(O.msdSeed) + '计入。优化商费用在模型中仅计一次，即lab.optFee，故此处刻意不设为一步。'] },
      { t:'note', b:['Two steps are conventions. ','其中两步为惯例值。'],
        text:['No Italian source publishes a per-gate revenue decomposition, so the intraday re-optimisation step and the imbalance step are model conventions rather than observations. The endpoint is not: €' + O.execMarginPerMWh + '/MWh at 1.4 cycles/day and 97% availability reproduces the ' + fmtC(O.modoSouth) + '/MW/yr southern seed to within 0.06%.',
              '无任何意大利来源公布按交易时点划分的收入构成，因此日内再优化与偏差敞口两步为模型惯例值而非观测值。终点值则非惯例：在日循环1.4次、可用率97%下，每MWh €' + O.execMarginPerMWh + '可将南部种子值每MW每年' + fmtC(O.modoSouth) + '复现至0.06%以内。'] },
    ] },

    { t:'card', title:['The Italian market sequence','意大利市场交易序列'], badges:['official'], blocks:[
      { t:'table', head:[['Market','市场'],['When','时间'],['Fit for a 4h battery','对四小时储能的适配性']],
        rows: M.gateCloses.map(g => [{b:g.n}, g.when, g.fit]) },
      { t:'why', text:['The last row is the one that does not appear on any other dashboard in this platform. MACSE is not a daily gate — it is an assignment under which Terna resells the contracted time-shifting product, so a MACSE-contracted battery does not keep dispatch optionality on that energy. Every other route on this page leaves the owner deciding when to discharge. That is the real content of the discount MACSE cleared at, and it is why the comparison engine models the route with a merchant retention factor rather than as a simple fixed payment.',
        '最后一行在本平台其他任何看板中均不出现。MACSE并非每日交易关闸 — 它是一种指派安排，Terna据此转售已签约的时移产品，因此已签MACSE合同的储能对该部分电量不保留调度选择权。本页其他所有路径均由业主自行决定放电时点。这才是MACSE出清折让的真实内涵，也是对比引擎以市场化留存系数而非简单固定付费来建模该路径的原因。'],
        sig:['MACSE buys the dispatch decision, not just the energy','MACSE买走的是调度决策权，而不仅是电量'] },
      { t:'src', src:SRC.gme, use:['Day-ahead and intraday prices and volumes by zone','按区域划分的日前与日内价格及电量'] },
    ] },
  ] };
};

// ============================== MSD & BALANCING ==============================
SEC_B.services = function (){
  return {
  head: ['MSD & Balancing — the deepest ancillary pool in Europe, and the least underwritable number on this dashboard',
         '辅助服务与平衡市场 — 欧洲最具深度的辅助服务资金池，也是本看板最难承销的数字'],
  cap: ['Italy\'s ancillary market is genuinely large. The only published total for it is a single month annualised at roughly five times the forward view, and this platform does not use it.',
        '意大利辅助服务市场规模确实很大。其唯一公布的总额为单月年化数据，约为远期预测的五倍，本平台不予采用。'],
  blocks: [
    { t:'card', mt:false, title:['MSD share of BESS revenue, by zone','辅助服务收入占储能收入比例，按区域'], badges:['calc'], blocks:[
      { t:'bar', cfg:{ xs:M.ancShareLabels, bw:56, yfmt:v => v + '%', labels:true, h:230,
        series:[{ name:['MSD share of revenue','辅助服务收入占比'], color:'var(--s9)', vals:M.ancShareSeries }] } },
      { t:'cap', text:['Balancing at about ' + O.msdSouthSharePct + '% of southern mainland BESS revenue and about ' + O.msdSardSharePct + '% in Sardinia, against near zero in the North. Italy is the one market on this platform where the ancillary question is locational rather than chronological.',
                       '平衡服务约占南部大陆储能收入' + O.msdSouthSharePct + '%、撒丁岛约' + O.msdSardSharePct + '%，北部接近零。意大利是本平台唯一一个辅助服务问题属区位性而非时间性的市场。'] },
      { t:'why', text:['Germany\'s ancillary chart is a countdown — 55% of revenue in 2026 falling to about 5% by 2030 as the fleet saturates a national requirement. Italy\'s is a map. The MSD share does not vary much by year in the published view; it varies by zone, because a weakly connected island needs balancing that a well-connected industrial north does not. Sardinia sits at twice the southern mainland share and cleared MACSE second-highest, on an island holding close to half the national battery fleet. Read that concentration as both the opportunity and the competition.',
        '德国的辅助服务图是一张倒计时表 — 2026年占收入55%，随装机饱和全国需求，至2030年降至约5%。意大利的则是一张地图。在已公布的预测中，辅助服务占比并不随年份显著变化，而是随区域变化，因为弱联网岛屿所需的平衡服务是联网良好的工业北部所不需要的。撒丁岛的占比为南部大陆的两倍，MACSE出清价位居第二，而该岛承载了接近全国半数的储能装机。这种集中既是机会，也是竞争。'],
        sig:['Locational, not chronological','属区位性而非时间性'] },
    ] },

    { t:'card', title:['The number this platform refuses to use','本平台拒绝采用的数字'], badges:['official'], blocks:[
      { t:'table', head:[['Figure','数值'],['What it is','其性质'],['Why it is not the seed','为何未作为种子值']], rows:[
        [{b:['€' + fmtN(O.chNorth / 1000) + 'k/MW/yr, Italy North, ' + O.chMonth, '意大利北部每MW每年€' + fmtN(O.chNorth / 1000) + 'k，' + O.chMonth]},
         ['Storage Index total revenue, about ' + O.chTertiarySharePct + '% from tertiary reserve','储能指数总收入，其中约' + O.chTertiarySharePct + '%来自三次备用'],
         ['A SINGLE MONTH ANNUALISED — a spot run-rate, not an underwriting level','单月年化数据 — 属现货运行率，而非承销水平']],
        [{b:['€' + fmtN(O.chSouth / 1000) + 'k/MW/yr, Italy South, ' + O.chMonth, '意大利南部每MW每年€' + fmtN(O.chSouth / 1000) + 'k，' + O.chMonth]},
         ['Same index, same month','同一指数，同一月份'],
         ['Roughly ' + O.chMultipleOfForward + 'x the published forward wholesale view for the same zone','约为同一区域已公布远期批发预测的' + O.chMultipleOfForward + '倍']],
        [{b:[fmtC(O.msdSeed) + '/MW/yr — what this platform uses', '本平台采用的每MW每年' + fmtC(O.msdSeed)]},
         ['Derived from the published revenue SPLIT: ' + O.msdSouthSharePct + '% of the ' + fmtC(O.modoSouth) + ' wholesale figure','依据公布的收入构成拆分推导：批发收入' + fmtC(O.modoSouth) + '的' + O.msdSouthSharePct + '%'],
         [{chip:'good', text:['Same basis as the merchant seed, so the two cannot disagree','与市场化种子值口径一致，故两者不会相互矛盾']}]],
      ] },
      { t:'warn', text:['Sustaining the index level would require about ' + fmtC(O.msdDurableNeeded) + '/MW/yr of durable tertiary reserve revenue against a fleet the same forecaster expects to grow from ' + O.fleet2025GW + ' GW to as much as ' + O.fleet2030GWhi + ' GW by 2030. MSD saturation is the dominant modelling risk in Italy, and it is the one this dashboard is least able to size.',
                        '若要维持该指数水平，需在同一预测机构预计装机将从' + O.fleet2025GW + 'GW增至2030年最高' + O.fleet2030GWhi + 'GW的背景下，持续获得约每MW每年' + fmtC(O.msdDurableNeeded) + '的三次备用收入。辅助服务市场饱和是意大利建模的主要风险，也是本看板最难量化的一项。'] },
      { t:'why', text:['The index figures are correctly published and are not being disputed — they are the wrong instrument for a fifteen-year model, which is a different criticism. A month in which tertiary reserve clears very high is a real month; annualising it produces a number that no Italian asset has earned over a year and that the same market\'s own forward curve contradicts by a factor of five. Germany has the mirror-image problem with a realised revenue book that moved 2.5x in one quarter. In both cases the discipline is the same: ask for the monthly series by zone and by product, never the index headline.',
        '指数数据的发布本身无误，此处并非质疑其正确性 — 而是指其不适用于十五年模型，这是另一层面的批评。三次备用出清价格极高的某个月份是真实存在的；但将其年化后所得的数字，从未有任何意大利资产在整年内实现，且与同一市场自身的远期曲线相差五倍。德国存在镜像问题：其实际运营收入在单季度内波动2.5倍。两种情形下的纪律相同：应索取按区域与产品分列的月度序列，绝不可采用指数概要数字。'],
        sig:['A real month is not an underwriting level','真实的一个月不等于承销水平'] },
      { t:'src', src:SRC.msdGap, use:['The MSD underwriting-level coverage gap','辅助服务市场承销水平数据缺口'] },
    ] },

    { t:'card', title:['Where MSD prices are highest','辅助服务价格最高的区域'], badges:['official'], blocks:[
      { t:'kpis', items:[
        { l:['Sicily up-regulation','西西里上调服务'], v:'≈€' + O.msdSiciUp + '<small>/MWh</small>',
          d:[O.msdPricePeriod, O.msdPricePeriod], b:['official'] },
        { l:['Centre-South up-regulation','中南部上调服务'], v:'≈€' + O.msdCsudUp + '<small>/MWh</small>',
          d:[O.msdPricePeriod, O.msdPricePeriod], b:['official'] },
        { l:['Sardinian fleet','撒丁岛装机'], v:fmtN(O.fleetSardMW) + '<small> MW</small>',
          d:['of a national ' + O.fleet2025GW + ' GW operational', '全国已投运' + O.fleet2025GW + 'GW中的份额'], b:['official'] },
        { l:['National fleet, 2030 high case','全国装机，2030年高情景'], v:O.fleet2030GWhi + '<small> GW</small>',
          d:['from ' + O.fleet2025GW + ' GW today', '当前为' + O.fleet2025GW + 'GW'], b:['model'] },
      ] },
      { t:'why', text:['The Sicilian MSD premium and the Sicilian MACSE premium point the same way, which is the useful part: the zone that clears highest in the TSO\'s procurement is also the zone where up-regulation prices highest in the daily market. That coherence is why this platform treats the zonal MACSE spread as a defensible proxy for constraint value on the grid tab. It is still a proxy — Terna does not publish curtailment volumes — but it is one that two independent price series agree on.',
        '西西里的辅助服务溢价与MACSE溢价指向一致，这正是有价值之处：在电网运营商采购中出清价最高的区域，也是日常市场中上调服务价格最高的区域。这种一致性正是本平台在电网页将MACSE分区价差视为约束价值可靠代理指标的原因。它仍然只是代理指标 — Terna不公布限电量 — 但这是一个获得两组独立价格序列相互印证的代理指标。'],
        sig:['Two independent price series, same zone on top','两组独立价格序列，指向同一最高区域'] },
    ] },
  ] };
};

// ============================== DURATION ==============================
SEC_B.duration = function (){
  return {
  head: ['Storage Duration — four hours for a merchant, six or more for a MACSE bid',
         '储能时长 — 市场化路径四小时，MACSE投标六小时以上'],
  cap: ['Italy is the market where the duration question has two answers that diverge by more than a rounding, because one route pays per MW and the other pays per MWh.',
        '在意大利，时长问题存在两个差异远超取整误差的答案，因为一条路径按每MW付费，另一条按每MWh付费。'],
  blocks: [
    { t:'card', mt:false, title:['Why the archetype is four hours, and what the auction did instead','为何原型采用四小时，以及拍卖的实际结果'], badges:['calc'], blocks:[
      { t:'table', head:[['Evidence','证据'],['Points to','指向']], rows:[
        [['Every published Italian revenue figure — Modo\'s zonal forecast, Timera\'s arbitrage commentary — is quoted on a four-hour basis','所有已公布的意大利收入数据 — Modo分区预测、Timera套利分析 — 均按四小时口径引用'], ['4h','四小时']],
        [['Zelestra / EnBW, the one toll whose energy is disclosed, is ' + O.tollEnbwMW + ' MW / ' + fmtN(O.tollEnbwMWh) + ' MWh','唯一披露电量的租赁交易Zelestra与EnBW为' + O.tollEnbwMW + 'MW / ' + fmtN(O.tollEnbwMWh) + 'MWh'], ['4h exactly','恰为四小时']],
        [['Capacity de-rating is ' + fmtPct(O.cmDerate4h * 100) + ' at four hours and ' + fmtPct(O.cmDerate8h * 100) + ' at eight','容量折减系数四小时为' + fmtPct(O.cmDerate4h * 100) + '，八小时为' + fmtPct(O.cmDerate8h * 100)], ['longer is better for capacity','时长越长对容量市场越有利']],
        [['MACSE pays €' + fmtN(O.macseWavg) + ' per MWh of storage per year, not per MW','MACSE按每MWh储能每年€' + fmtN(O.macseWavg) + '付费，而非按每MW'], ['as long as capex allows','在造价允许范围内越长越好']],
        [['The MACSE-awarded fleet came in at ' + fmtN(O.macseAwardedMW) + ' MW across ' + fmtN(O.macseAwardedMWh) + ' MWh','MACSE中标机组共' + fmtN(O.macseAwardedMW) + 'MW、' + fmtN(O.macseAwardedMWh) + 'MWh'], [O.macseHoursAvg + 'h average — a different machine', '平均' + O.macseHoursAvg + '小时 — 另一种设备']],
      ] },
      { t:'why', text:['Four hours is the right answer for a merchant, tolled or capacity-market Italian battery and the wrong answer for a MACSE one. The gap is not bridgeable by adding an hour: at ' + O.macseHoursAvg + ' hours the same clearing price is worth ' + fmtC(O.macseAtAwardedHours) + '/MW/yr against ' + fmtC(O.macse4hEquiv) + ' at four, so a MACSE bidder who builds four hours has given away two-thirds of the revenue the mechanism was designed to pay it. This dashboard models the four-hour archetype because that is the basis every other Italian figure is published on, and states the divergence rather than averaging it away.',
        '对市场化、租赁或容量市场型意大利储能而言，四小时是正确答案；对MACSE型储能则是错误答案。二者的差距无法通过增加一小时弥合：在' + O.macseHoursAvg + '小时下，同一出清价对应每MW每年' + fmtC(O.macseAtAwardedHours) + '，而四小时下为' + fmtC(O.macse4hEquiv) + '，因此按四小时建设的MACSE投标人放弃了该机制本欲支付给它的三分之二收入。本看板以四小时原型建模，因为其他所有意大利数据均按此口径公布，并明示这一差异而非将其平均掉。'],
        sig:['Two right answers, and the auction chose the longer one','两个正确答案，而拍卖选择了较长的一个'] },
    ] },
    { t:'card', title:['Duration-Need Index','时长需求指数'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
    ] },
    { t:'card', title:['Marginal value of hours five to eight, on the MACSE route','MACSE路径下第五至第八小时的边际价值'], badges:['calc','illus'], blocks:[
      { t:'wf', cfg:{ steps:M.marginalHour, yfmt:v => kMW(v), h:250 } },
      { t:'cap', text:['Per MW per year, four hours to eight. The step is 4→8 rather than 2→4 because those are the two durations Terna publishes a de-rating factor for, and because MACSE\'s per-MWh price makes the long end the interesting one.',
                       '单位为每MW每年，由四小时至八小时。选择4→8而非2→4，是因为Terna仅就这两个时长公布折减系数，且MACSE按每MWh计价使得长时长端更具分析价值。'] },
      { t:'warn', text:['The result is NEGATIVE and that is the finding, not a modelling error. On the only Italian capex evidence available — a flat €' + O.capexKWhMid + '/kWh band with no power-block and energy-block split — the fifth-to-eighth hours do not pay. Yet MACSE awarded ' + O.macseHoursAvg + ' hours on average. Either the winners hold a cost decomposition the published band does not expose, or they are pricing the fifteen-year TSO contract above the marginal cost of the energy. This dashboard cannot tell which, and does not pick.',
                        '结果为负值，这是结论而非建模错误。基于现有唯一的意大利造价证据 — 不区分功率段与能量段的平价每kWh €' + O.capexKWhMid + '区间 — 第五至第八小时无法收回成本。然而MACSE中标机组平均时长达' + O.macseHoursAvg + '小时。要么中标方掌握公开区间未披露的成本拆分，要么其对十五年期电网运营商合同的定价高于能量的边际成本。本看板无法判定，也不作选择。'] },
      { t:'why', text:['This is the most useful open question on the Italian dashboard and it is worth stating as a diligence instruction rather than as a caveat. Ask an Italian EPC for the price of a marginal megawatt-hour on an existing power block, separately from the turnkey per-kWh figure. If the incremental energy cost is materially below €' + O.capexKWhMid + '/kWh — and on a shared power block it should be — the MACSE result becomes arithmetically explicable and the six-to-eight hour machine becomes the right build for that route. If it is not, then the auction winners are paying for counterparty quality, which is a legitimate trade but a different one.',
        '这是意大利看板上最有价值的未决问题，值得作为尽调指令而非注意事项加以说明。应向意大利EPC承包商询问在既有功率段基础上增加边际兆瓦时的价格，并与交钥匙每kWh报价分开询问。若增量能量成本显著低于每kWh €' + O.capexKWhMid + ' — 在共用功率段的情况下理应如此 — 则MACSE结果在算术上即可解释，六至八小时设备也就成为该路径的正确设计。若并非如此，则中标方所支付的是对手方质量的溢价，这是一笔正当的交易，但性质完全不同。'],
        sig:['Ask the EPC for the marginal MWh, not the turnkey per-kWh','应向EPC询问边际MWh价格，而非交钥匙每kWh报价'] },
    ] },
    { t:'card', title:['Augmentation readiness','扩容准备度'], badges:['illus'], live:true, blocks:[
      { t:'aug' },
    ] },
  ] };
};

// ============================== PIPELINE ==============================
SEC_B.pipeline = function (){
  return {
  head: ['Project Pipeline — two contracted stages, because Italy has two contracted routes',
         '项目管线 — 两个合同化阶段，因为意大利有两条合同化路径'],
  cap: ['Every other market on this platform has one contracted milestone in its development ladder. Italy has two with different counterparties, different tenors and different probabilities.',
        '本平台其他所有市场的开发阶梯中只有一个合同化里程碑。意大利有两个，且对手方、期限与概率各不相同。'],
  blocks: [
    /* Italy's contracted pipeline is the MACSE award, and Terna publishes it as
       a national volume with a clearing price per zone. So it is presented by
       zone, and the capacity column says "not published by zone" rather than
       being left blank — a blank cell reads as zero. */
    { t:'card', mt:false, title:['MACSE auction 1 — awarded storage by zone','MACSE首轮拍卖 — 分区中标储能'],
      badges:['official'], blocks:[
        { t:'zone-awards', auction:MACSE_AUCTION, zones:MACSE_ZONES, caption:MACSE_CAPTION },
      ] },
    { t:'card', title:['Development stage probabilities','开发阶段概率'], badges:['illus'], blocks:[
      { t:'stageProb' },
      { t:'cap', text:['Illustrative weighting used to convert an announced pipeline into a probability-weighted one. Not an official Italian dataset.',
                       '用于将已公布管线转换为概率加权管线的示意权重。并非意大利官方数据集。'] },
      { t:'why', text:['A MACSE award is scored above a toll and below construction, and both parts of that placement are deliberate. Above a toll, because the counterparty is the transmission system operator on a fifteen-year term rather than a utility on ten, and because the award price is public where the toll price is not. Below construction, because an award still has to be built and MACSE technical compliance — including the ' + O.macseOversizePct + '% oversizing obligation — has to be met across the whole term, not demonstrated once at commissioning.',
        'MACSE中标的评分高于租赁、低于在建，这一定位的两个方面均属刻意安排。高于租赁，是因为其对手方为输电系统运营商且期限为十五年，而非期限十年的公用事业公司，且中标价格公开而租赁价格不公开。低于在建，是因为中标后仍须建成，且MACSE技术合规 — 包括' + O.macseOversizePct + '%的超配义务 — 须在整个合同期内持续满足，而非仅在投运时演示一次。'],
        sig:['A public price and a TSO counterparty beat an undisclosed toll','公开价格与电网运营商对手方优于未披露的租赁'] },
    ] },
    { t:'card', title:['Announced versus probability-weighted','已公布容量与概率加权容量'], badges:['calc','illus'], blocks:[
      { t:'pipeChart', unit:'MW' },
      { t:'why', text:['The gap between the two lines carries the Italian version of the saturation question, and it is narrower than Germany\'s for a specific reason: a large share of the Italian pipeline is already contracted to Terna at a known price for fifteen years, which is a different kind of certainty from a merchant pipeline of the same size. What the gap does still govern is MSD depth. The published forecast has the fleet growing from ' + O.fleet2025GW + ' GW to as much as ' + O.fleet2030GWhi + ' GW by 2030, and MSD is the one revenue line on this dashboard with no contracted floor under it.',
        '两条曲线之间的差距承载着意大利版本的饱和问题，且其宽度小于德国，原因很具体：意大利管线中很大一部分已按已知价格与Terna签订十五年合同，这与同等规模的市场化管线属于不同性质的确定性。该差距仍然决定的是辅助服务市场深度。已公布预测显示装机将从' + O.fleet2025GW + 'GW增至2030年最高' + O.fleet2030GWhi + 'GW，而辅助服务是本看板上唯一没有合同化底线支撑的收入项。'],
        sig:['Contracted pipeline is a different kind of pipeline','已签约管线属于另一种性质的管线'] },
    ] },
    { t:'card', title:['Named projects','具名项目'], badges:['illus'], blocks:[
      { t:'table', head:[['Project','项目'],['Owner','所有方'],['Zone','区域'],['MW','MW'],['Hours','时长'],['COD','投运'],['Stage','阶段']],
        num:[3,4],
        rows: M.projects.map(p => [{b:[p.n, p.n]}, [p.owner || '—', p.owner || '—'], [p.region, p.region],
                                   String(p.mw), String(p.h), p.cod, {chip:'info', text:[p.st, p.st]}]) },
      { t:'cap', text:['Axpo / Zelestra is a real, publicly announced project with a published MW, tenor and region. Its DURATION is not disclosed — four hours is the archetype convention here and is registered as a coverage gap. Everything else is a seed example. Italy publishes auction results at project level but not a development pipeline with dates.',
                       'Axpo与Zelestra为真实且已公开公告的项目，其MW、期限与区域均已公布。其时长未披露 — 此处四小时为原型惯例，并已登记为数据缺口。其余均为种子示例。意大利公布项目层面的拍卖结果，但不公布含日期的开发管线。'] },
      { t:'src', src:SRC.macse, use:['Project-level auction awards','项目层面的拍卖中标情况'] },
    ] },
  ] };
};

// ============================== GRID & PERMITTING ==============================
SEC_B.grid = function (){
  return {
  head: ['Grid & Permitting — where the constraint is priced, and when it ends',
         '并网与许可 — 约束在何处被定价，又将在何时终结'],
  cap: ['Italy is the one market on this platform where the congestion register and the procurement mechanism are the same object. Terna did not merely publish a constraint map; it built a purchasing programme shaped like one.',
        '意大利是本平台唯一一个拥塞登记表与采购机制为同一事物的市场。Terna不仅公布了约束地图，还建立了一套与之形态相同的采购计划。'],
  blocks: [
    { t:'card', mt:false, title:['Interactive Italy grid — past, current and planned','意大利电网交互地图 — 过去、当前与规划'], badges:['official','public'], blocks:[
      { t:'geo-grid-map', data:gridMapById('it-grid-map') },
      { t:'why', text:['The map shows the constraint and the relief on the same picture, which no other market on this platform can do with dates attached. Generation is in the south and the islands, demand is in the Po Valley, and four named submarine schemes land between ' + O.tyrrhenianCod + ' and ' + O.adriaticCod + ': the Tyrrhenian Link at ' + O.tyrrhenianMW + ' MW, SA.CO.I.3 at ' + O.sacoi3MW + ' MW, ELMED at ' + O.elmedMW + ' MW and the Adriatic Link at ' + O.adriaticMW + ' MW. A MACSE award runs fifteen years from ' + O.macseDelivery + ' and the works that relieve the constraint behind it commission in the same window.',
        '地图在同一画面上同时呈现约束与缓解措施，且带有明确日期，这是本平台其他任何市场都无法做到的。发电位于南部与岛屿，需求位于波河谷，四项具名海底工程将在' + O.tyrrhenianCod + '至' + O.adriaticCod + '年间投运：' + O.tyrrhenianMW + 'MW的第勒尼安互联、' + O.sacoi3MW + 'MW的SA.CO.I.3、' + O.elmedMW + 'MW的ELMED与' + O.adriaticMW + 'MW的亚得里亚海互联。MACSE中标合同自' + O.macseDelivery + '年起为期十五年，而缓解其背后约束的工程恰在同一窗口期投运。'],
        sig:['Underwrite the contract, not the scarcity','承销依据应为合同，而非稀缺性'] },
      { t:'src', src:SRC.plan, use:['Named reinforcements and their commissioning years','具名加强工程及其投运年份'] },
    ] },

    { t:'congestion', data:congestionFor('it') },

    { t:'card', title:['Named transmission relief','具名输电缓解工程'], badges:['official'], blocks:[
      { t:'table', head:[['Project','工程'],['Route','路径'],['Operator','运营方'],['Delivery stage','交付阶段'],['Scope','范围'],['Year','年份'],['Status','状态']],
        rows: M.reinforcements.map(r => {
          const k = M.planClasses.find(c => c.id === r.cls);
          return [{b:r.n}, r.region, [r.operator, r.operator], {chip:k.c, text:k.n}, r.scope, String(r.year), {chip:r.c, text:r.status}];
        }) },
      { t:'table', head:[['Delivery stage','交付阶段'],['What it does and does not confer','其赋予与不赋予的内容']],
        rows: M.planClasses.map(k => [{ chip:k.c, text:k.n }, k.d]) },
      { t:'why', text:['This is the strongest relief evidence on the platform and the comparison is worth making explicitly. Germany\'s four HVDC corridors are all reported as running late, which is the only reason a German congestion thesis has a runway at all. The NEM\'s register leans on programme dates. Italy has four named submarine schemes with contracted cable supply and commissioning years, plus a Development Plan committing more than €' + O.planEbn + 'bn over ten years. The plan row is carried last and marked weakest on purpose: a decade of capital expenditure is not a commissioning date, and only the four named projects above carry dates worth underwriting to.',
        '这是本平台最有力的缓解证据，值得明确作出比较。德国的四条高压直流走廊均有延期报道，这也是德国拥塞投资逻辑尚存窗口期的唯一原因。澳大利亚国家电力市场的登记表则依赖计划日期。意大利拥有四项具名海底工程，其电缆供应已签约且有明确投运年份，另有十年投资超过' + O.planEbn + '亿欧元的发展规划。规划一行刻意置于最后并标为最弱：十年资本开支不等于投运日期，只有上述四项具名工程才具备值得承销的日期。'],
        sig:['Four dated projects beat one funded programme','四项有明确日期的工程优于一项已获资金的计划'] },
      { t:'src', src:SRC.tyrrhenian, use:['The Tyrrhenian Link scope and schedule','第勒尼安互联的范围与进度'] },
      { t:'src', src:SRC.adriatic, use:['The Adriatic Link scope and cable contract','亚得里亚海互联的范围与电缆合同'] },
    ] },

    { t:'card', title:['Connection and permitting','并网与许可'], badges:['official'], blocks:[
      { t:'table', head:[['Step','环节'],['What it is','内容'],['What it is not','其局限']], rows:[
        [{b:['STMG','最小技术方案（STMG）']},
         ['Soluzione Tecnica Minima Generale — the connection solution issued against a specific point','针对特定接入点出具的最小技术方案'],
         ['Not a queue position and not an energisation date','不等于排队位置，也不等于送电日期']],
        [{b:['Autorizzazione Unica / PAUR','单一许可/PAUR']},
         ['The single authorisation route, run at regional level with environmental assessment folded in','单一授权路径，由大区层面执行，并纳入环境评估'],
         ['Regional practice varies; a national timetable does not exist','各大区做法不一；不存在全国统一时间表']],
        [{b:['MSD qualification','辅助服务市场资格']},
         ['Enablement per product and per direction','按产品与方向分别取得资格'],
         ['Qualification for one product is not qualification for another','取得某一产品资格不等于取得其他产品资格']],
        [{b:['MACSE technical compliance','MACSE技术合规']},
         ['Capacity held to term, with the ' + O.macseOversizePct + '% oversizing obligation on an ' + O.macseOversizeHours + '-hour system','全期维持已签约容量，' + O.macseOversizeHours + '小时系统须承担' + O.macseOversizePct + '%超配义务'],
         ['Not a one-off commissioning test — it runs for fifteen years','并非一次性投运测试 — 须持续十五年']],
        [{b:['Curtailment compensation','限电补偿']},
         ['ARERA ' + O.areraCurtailRes + ' is the instrument','ARERA' + O.areraCurtailRes + '为相关机制'],
         ['No 2025 curtailment volume in GWh was located — see the coverage gaps','未找到2025年以GWh计的限电量 — 详见数据缺口']],
      ] },
      { t:'why', text:['Zone eligibility is the diligence step that has no analogue in any other market on this platform, and it costs nothing to perform. Terna publishes the MACSE requirement by zone; a site is either inside the perimeter or it is not, and that single fact removes or restores an entire route to market. Do it before the connection work, before the land work and before the model, because it determines which of four models applies. Everything else on this tab is ordinary development risk that Italy shares with its neighbours.',
        '区域资格核查是本平台其他任何市场都不存在对应环节的尽调步骤，且执行成本为零。Terna按区域公布MACSE需求；场址要么在范围之内、要么不在，这一事实本身即可移除或恢复一整条售电路径。应在并网工作、土地工作与建模之前完成，因为它决定了四个模型中哪一个适用。本页其余内容均属意大利与其邻国共有的常规开发风险。'],
        sig:['One free check removes or restores a whole route','一项零成本核查即可移除或恢复整条路径'] },
    ] },

    { t:'card', title:['Connection risk scorecard','并网风险记分卡'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'connFactors', bands:'connBands' },
    ] },
  ] };
};

// ============================== BENCHMARK ==============================
SEC_B.benchmark = function (){
  /* Compared against Germany rather than Great Britain: the two are the mirror
     image of each other on the one variable that decides both markets — whether
     congestion becomes a price a battery can trade. Germany rejected the zonal
     split in December 2025; Italy kept zonal pricing and then added a zonal
     procurement on top of it. Everything else follows from that. */
  return {
  head: ['Italy vs Germany — the same constraint, opposite answers',
         '意大利与德国对比 — 相同的约束，相反的答案'],
  cap: ['Both markets have renewable generation far from industrial load. Germany decided congestion should stay socialised; Italy decided to buy storage where the constraint binds. Every difference below follows from that one decision.',
        '两个市场的新能源发电均远离工业负荷。德国决定拥塞成本继续社会化分摊；意大利决定在约束发生处采购储能。以下所有差异均源于这一项决定。'],
  blocks: [
    { t:'card', mt:false, title:['One variable, isolated','隔离出的单一变量'], badges:['calc'], blocks:[
      { t:'table', head:[['','' ],['Italy','意大利'],['Germany','德国']], rows:[
        [{b:['Zonal pricing','分区电价']},
         [{chip:'good', text:['Six bidding zones, retained','六个报价区，予以保留']}],
         [{chip:'critical', text:['Rejected December 2025; single zone kept','2025年12月否决；维持单一报价区']}]],
        [{b:['Locational procurement','区位化采购']},
         [{chip:'good', text:['MACSE — requirement set by zone, zero in the North','MACSE — 按区域设定需求，北部为零']}],
         [{chip:'critical', text:['None','无']}]],
        [{b:['Observable price of one constraint','单一约束的可观测价格']},
         ['Sicily cleared 30% above Sud e Calabria for the same product','西西里同一产品出清价较南部及卡拉布里亚高30%'],
         ['None — congestion cost is socialised','无 — 拥塞成本社会化分摊']],
        [{b:['Capacity route for a 4h battery','四小时储能的容量路径']},
         [{chip:'good', text:[fmtC(O.cmPremium) + '/MW/yr at ' + fmtPct(O.cmDerate4h * 100) + ' de-rating, 15-yr contracts', '每MW每年' + fmtC(O.cmPremium) + '，折减系数' + fmtPct(O.cmDerate4h * 100) + '，15年期合同']}],
         [{chip:'critical', text:['Ineligible — 10-hour minimum discharge','不具备资格 — 最低放电10小时']}]],
        [{b:['Routes to market','售电路径数量']},
         [{chip:'good', text:['Four — MACSE, capacity, toll, merchant','四条 — MACSE、容量、租赁、市场化']}],
         [{chip:'warn', text:['Two — toll and merchant','两条 — 租赁与市场化']}]],
        [{b:['Forward merchant view','远期市场化预测']},
         ['Roughly flat in real terms to ' + O.modoFlatTo, '按实际价值计至' + O.modoFlatTo + '年大致持平'],
         ['Cut 16% across the curve; ancillary from 55% to ~5% by 2030','全曲线下调16%；辅助服务占比由55%降至2030年约5%']],
        [{b:['The weak half of the evidence','证据薄弱的一半']},
         [{chip:'warn', text:['Cost — capex spans a factor of ' + O.capexSpreadX, '成本 — 造价跨度达' + O.capexSpreadX + '倍']}],
         [{chip:'warn', text:['Revenue — a realised book moved 2.5x in a quarter','收入 — 实际运营账簿单季度波动2.5倍']}]],
      ] },
      { t:'why', text:['The comparison isolates one variable and the answer is unusually clean. Both markets face renewable generation far from industrial load. Germany was told by ENTSO-E that every bidding-zone split would be more efficient, rejected it, and now has €3.1bn of annual congestion cost that no battery can reach through siting — so tolling is doing all the structural work and no German toll price has ever been published. Italy kept its zones and then went further, having the TSO buy storage where the constraint binds, at a price it publishes by zone. The result is that an Italian developer chooses between four routes on published numbers while a German one negotiates a toll in the dark.',
        '该对比隔离出单一变量，结论异常清晰。两个市场均面临新能源发电远离工业负荷的问题。ENTSO-E告知德国任何报价区拆分方案都更具效率，德国予以否决，如今每年承担31亿欧元拥塞成本，而储能无法通过选址触达 — 因此租赁承担了全部结构性作用，且德国从未公布过任何租赁价格。意大利保留了分区并更进一步，由电网运营商在约束发生处采购储能，并按区域公布价格。结果是意大利开发商可依据公开数据在四条路径中作出选择，而德国开发商只能在不透明的环境中议定租赁条件。'],
        sig:['Italy publishes the price of its constraint; Germany does not have one','意大利公布其约束的价格；德国则不存在这一价格'] },
    ] },

    { t:'card', title:['And the mirror-image weakness','以及镜像式的弱点'], badges:['calc'], blocks:[
      { t:'note', b:['Do not read this as Italy winning. ','不应将此解读为意大利胜出。'],
        text:['Germany publishes revenue with unusual precision and contracts with none: realised monthly books, per-product ancillary clearing prices, published 2h and 4h IRRs — and not one toll fee. Italy publishes contracts with unusual precision and cost with none: MACSE clearing prices to the euro by zone, capacity premiums, four dated relief projects — and no fixed opex figure, no toll price, and a capex band spanning a factor of ' + O.capexSpreadX + '. Each market is opaque exactly where the other is transparent, which is why the two dashboards fail differently and why neither one\'s method transfers cleanly to the other.',
              '德国以异常的精度公布收入，却完全不公布合同：月度实际运营账簿、分产品辅助服务出清价格、已公布的2小时与4小时内部收益率 — 唯独没有任何租赁费用。意大利以异常的精度公布合同，却完全不公布成本：按区域精确至欧元的MACSE出清价格、容量溢价、四项有明确日期的缓解工程 — 却没有固定运维数据、没有租赁价格，造价区间跨度达' + O.capexSpreadX + '倍。两个市场恰好在对方透明之处不透明，这正是两个看板失效方式不同的原因，也是任一市场的方法无法直接移植到另一市场的原因。'] },
    ] },
  ] };
};

// ============================== PORTFOLIO ==============================
SEC_B.portfolio = function (){
  return {
  head: ['Portfolio / Fund View — screening an Italian opportunity','组合与基金视图 — 意大利机会筛选'],
  cap: ['A worked screening example on this dashboard\'s own assumptions. Illustrative — it demonstrates the gate sequence, not a transaction.',
        '基于本看板自身假设的筛选示例。仅作示意，用于演示门槛顺序，而非真实交易。'],
  blocks: [
    { t:'card', mt:false, title:['Investment Committee gates','投委会门槛'], badges:['calc'], blocks:[
      { t:'gates', items:[
        { n:['Gate 1 — Zone confirmed against the MACSE requirement table','门槛1 — 对照MACSE需求表确认区域'],
          d:['Costs nothing and removes or restores an entire route to market. A site in Nord has two contracted options; a site in Sicilia has four, and the one it is most likely to win cleared 30% above the southern mainland.',
             '零成本，却可移除或恢复整条售电路径。位于北部的场址有两种合同化选择；位于西西里的场址有四种，且其最可能中标的一种出清价较南部大陆高30%。'],
          c:'critical', s:['Do this first','应最先执行'] },
        { n:['Gate 2 — Route declared, and only one of MACSE or capacity','门槛2 — 确定路径，且MACSE与容量市场只能择一'],
          d:['They are mutually exclusive. A model holding both overstates the case by about ' + fmtC(31490) + '/MW/yr at four hours. Declare the route before the model is built, because the four routes are four different assets.',
             '二者互斥。同时计入两项的模型会使四小时下的方案被高估约每MW每年' + fmtC(31490) + '。应在建模之前确定路径，因为四条路径对应四类不同资产。'],
          c:'critical', s:['Never stack the two','绝不可将二者叠加'] },
        { n:['Gate 3 — Capex quoted, and the marginal MWh quoted separately','门槛3 — 取得造价报价，并单独取得边际MWh报价'],
          d:['The published Italian capex evidence spans a factor of ' + O.capexSpreadX + '. Ask the EPC for the turnkey per-kWh figure AND the price of an incremental megawatt-hour on the same power block. The second number decides whether a MACSE bid should be six hours or four.',
             '已公布的意大利造价证据跨度达' + O.capexSpreadX + '倍。应同时向EPC承包商索取交钥匙每kWh报价与同一功率段上增量兆瓦时的价格。后一个数字决定MACSE投标应按六小时还是四小时设计。'],
          c:'critical', s:['The weakest evidence on this page','本页最薄弱的证据'] },
        { n:['Gate 4 — MSD modelled from the revenue split, not the index','门槛4 — 辅助服务收入按收入构成而非指数建模'],
          d:['Confirm the case does not carry the ' + fmtC(O.chNorth) + '/MW/yr index level. That is one month annualised at roughly ' + O.chMultipleOfForward + 'x the forward view, and sustaining it would need about ' + fmtC(O.msdDurableNeeded) + '/MW/yr of durable tertiary reserve against a fleet forecast to reach ' + O.fleet2030GWhi + ' GW.',
             '确认方案未采用每MW每年' + fmtC(O.chNorth) + '的指数水平。该数据为单月年化，约为远期预测的' + O.chMultipleOfForward + '倍；若要维持，需在装机预计达' + O.fleet2030GWhi + 'GW的背景下持续获得约每MW每年' + fmtC(O.msdDurableNeeded) + '的三次备用收入。'],
          c:'serious', s:['Use the split, not the level','应采用构成比例而非绝对水平'] },
        { n:['Gate 5 — De-rating sensitivity run at ' + O.cmDerate4hProposed, '门槛5 — 按' + O.cmDerate4hProposed + '折减系数进行敏感性测算'],
          d:['Only for a capacity-market case. Terna has proposed cutting the four-hour factor from ' + O.cmDerate4h + ' to ' + O.cmDerate4hProposed + ' for ' + O.cmProposedDY + '. It is a proposal, but a northern Italian project has no MACSE fallback if it lands.',
             '仅适用于容量市场路径。Terna已提议将' + O.cmProposedDY + '的四小时系数由' + O.cmDerate4h + '下调至' + O.cmDerate4hProposed + '。该项为提案，但若落地，意大利北部项目没有MACSE作为退路。'],
          c:'warn', s:['Northern cases only','仅限北部项目'] },
        { n:['Gate 6 — Relief date checked against the contract term','门槛6 — 核对缓解工程日期与合同期限'],
          d:['A MACSE award runs fifteen years from ' + O.macseDelivery + ' and the Tyrrhenian Link commissions the same year. If the case depends on the scarcity rather than the contract, the runway is shorter than the contract.',
             'MACSE中标合同自' + O.macseDelivery + '年起为期十五年，而第勒尼安互联于同年投运。若投资逻辑依赖稀缺性而非合同本身，则其窗口期短于合同期限。'],
          c:'warn', s:['Underwrite the contract','应以合同为承销依据'] },
      ] },
      { t:'ic', b:['Screening conclusion: ','筛选结论：'],
        text:['Italy rewards a case that is decided on published documents and punishes one that is decided on a spreadsheet. The zone, the route, the contract price and the relief date are all knowable before any modelling begins, and each of them moves the answer by more than the model\'s own precision. What is not knowable from public sources is the cost side, and that is where an Italian case should spend its diligence budget: one EPC quotation with the marginal megawatt-hour priced separately would close more of the uncertainty on this dashboard than any amount of further revenue analysis.',
              '意大利奖励依据公开文件作出的判断，惩罚依据电子表格作出的判断。区域、路径、合同价格与缓解工程日期均可在建模开始前获知，且其中任何一项对结论的影响都超过模型自身的精度。无法从公开来源获知的是成本侧，这也是意大利项目应投入尽调预算之处：一份将边际兆瓦时单独定价的EPC报价，对消除本看板不确定性的作用超过任何进一步的收入分析。'] },
    ] },
  ] };
};

// ============================== DATA & METHODOLOGY ==============================
SEC_B.data = function (){
  return {
  head: ['Data & Methodology — what is published, what is not, and what this dashboard does about it',
         '数据与方法 — 哪些已公开、哪些未公开，以及本看板如何处理'],
  cap: ['Italy publishes more about BESS contracts than any market on this platform and almost nothing about BESS costs. Both shape every number here.',
        '意大利关于储能合同的公开数据多于本平台任何市场，而关于储能成本的公开数据几乎为零。两者共同决定了此处的每一个数字。'],
  blocks: [
    { t:'card', mt:false, title:['What is not published — and what this dashboard uses instead','未公开的内容 — 以及本看板的替代做法'], badges:['official'], blocks:[
      { t:'table', head:[['Item','项目'],['Publication status','公开状态'],['Why','原因'],['What is used instead','替代做法']],
        rows: M.notPublished.map(x => [{b:x.item}, {chip:'serious', text:x.status}, x.why, x.instead]) },
      { t:'why', text:['Three entries in this table decide more of the Italian answer than the rest of the dashboard combined. The capex band spans a factor of ' + O.capexSpreadX + ' because a European turnkey survey and Italian expert interviews disagree by half, and the ARERA study that would settle it could not be machine-read. No toll price has been disclosed in any of three signed deals, so the platform\'s toll band is bounded rather than quoted. And the only published MSD total is one month annualised at roughly ' + O.chMultipleOfForward + 'x the forward view. None of the three is closeable by better analysis; the first needs a document extracted, the second needs a disclosure that has not happened, and the third needs a time series nobody publishes.',
        '本表中有三项对意大利结论的影响超过看板其余部分的总和。造价区间跨度达' + O.capexSpreadX + '倍，因为欧洲交钥匙调研与意大利专家访谈相差一半，而可解决该问题的ARERA研究无法机器读取。三笔已签署交易均未披露租赁价格，因此本平台的租赁区间是定界值而非报价。此外，唯一公布的辅助服务总额为单月年化数据，约为远期预测的' + O.chMultipleOfForward + '倍。三者均无法通过更深入的分析弥补：第一项需要提取一份文件，第二项需要一项尚未发生的披露，第三项需要一组无人公布的时间序列。'],
        sig:['One document, one disclosure, one time series','一份文件、一项披露、一组时间序列'] },
      { t:'src', src:SRC.capexGap, use:['The Italian capex coverage gap','意大利造价数据缺口'] },
      { t:'src', src:SRC.tollPriceGap, use:['The toll price coverage gap','租赁价格数据缺口'] },
      { t:'src', src:SRC.msdGap, use:['The MSD underwriting-level coverage gap','辅助服务市场承销水平数据缺口'] },
      { t:'src', src:SRC.curtailmentGap, use:['The curtailment volume coverage gap','限电量数据缺口'] },
    ] },

    { t:'card', title:['Evidence ladder — what would upgrade each number','证据阶梯 — 各数值的升级路径'], badges:['calc'], blocks:[
      { t:'table', head:[['Source that would settle it','可确证的来源'],['What it settles','可确证的内容']],
        rows: M.evidenceLadder.map(e => [{b:e.n}, e.d]) },
    ] },

    { t:'card', title:['Methodology — how this market is normalised','方法论 — 本市场的归一化方式'], badges:['calc'], blocks:[
      { t:'table', head:[['Decision','决策'],['What this dashboard does','本看板的处理'],['Why','原因']], rows:[
        [{b:['MACSE, converted to per MW','MACSE，换算为每MW口径']},
         ['Carried at ' + fmtC(O.macse4hEquiv) + '/MW/yr — the €' + fmtN(O.macseWavg) + '/MWh/yr weighted average at the four-hour archetype.','按每MW每年' + fmtC(O.macse4hEquiv) + '计入 — 即四小时原型下每MWh每年€' + fmtN(O.macseWavg) + '的加权平均值。'],
         ['Every other market on this platform pays per MW. Comparing without converting would flatter or penalise Italy depending on the duration assumed.','本平台其他所有市场均按每MW付费。不作换算的比较将因所假设时长不同而高估或低估意大利。']],
        [{b:['MACSE and capacity market stacking','MACSE与容量市场叠加']},
         ['Structurally impossible — the comparison engine treats routes as alternatives.','结构上不可能 — 对比引擎将各路径视为替代关系。'],
         ['They are mutually exclusive in the scheme rules. A reader adding the two lines would overstate Italy by about ' + fmtC(31490) + '/MW/yr.','机制规则中二者互斥。将两项收入相加的读者会使意大利被高估约每MW每年' + fmtC(31490) + '。']],
        [{b:['Merchant dilution','市场化收入稀释']},
         ['Flat at 1.00 across the whole COD window — no decay curve applied.','整个投运窗口期内均为1.00 — 未施加衰减曲线。'],
         ['The only published Italian forward series is roughly flat in real terms to ' + O.modoFlatTo + '. Bending it would substitute a house view for the source.','唯一公布的意大利远期序列按实际价值计至' + O.modoFlatTo + '年大致持平。弯曲该曲线等于以本方观点替代来源结论。']],
        [{b:['MSD','辅助服务市场收入']},
         ['Seeded from the published revenue SPLIT at ' + fmtC(O.msdSeed) + '/MW/yr, not from the Storage Index level.','以公布的收入构成拆分为基础，取每MW每年' + fmtC(O.msdSeed) + '作为种子，而非采用储能指数水平。'],
         ['The index total is one month annualised at roughly ' + O.chMultipleOfForward + 'x the forward view. The split shares a basis with the merchant seed, so the two cannot disagree.','指数总额为单月年化，约为远期预测的' + O.chMultipleOfForward + '倍。构成拆分与市场化种子值口径一致，故两者不会相互矛盾。']],
        [{b:['Degradation','衰减率']},
         ['1.1%/yr, derived from MACSE\'s ' + O.macseOversizePct + '% oversizing obligation on an ' + O.macseOversizeHours + '-hour system over fifteen years.','采用每年1.1%，源自MACSE对' + O.macseOversizeHours + '小时系统在十五年内' + O.macseOversizePct + '%的超配要求。'],
         ['No Italian degradation series is published. This is the degradation a fifteen-year Italian obligation is actually written against, which makes it a better anchor than a warranty curve.','意大利未公布衰减率序列。这是十五年期意大利义务实际据以订立的衰减水平，因此优于质保曲线作为锚点。']],
        [{b:['Usable fraction','可用容量比例']},
         ['1.00, not the platform\'s usual sub-unity haircut.','取1.00，而非本平台通常的小于1的折减。'],
         ['Every Italian figure this dashboard reconciles to — the €/kWh capex band, the €/MWh MACSE clear, the ' + fmtPct(O.cmDerate4h * 100) + ' de-rating — is already quoted on a nameplate basis. A second haircut would double-count.','本看板所比对的所有意大利数据 — 每kWh造价区间、每MWh MACSE出清价、' + fmtPct(O.cmDerate4h * 100) + '折减系数 — 均已按铭牌口径公布。再作折减将构成重复计算。']],
        [{b:['Congestion','拥塞']},
         ['Carried in the congestion register only, never as a revenue line. The zonal MACSE spread is used as a PROXY for constraint value.','仅计入拥塞登记表，绝不作为收入项。MACSE分区价差用作约束价值的代理指标。'],
         ['Terna publishes zonal clearing prices but not curtailment volumes or the north–south transfer limit. A proxy that two independent price series agree on is still a proxy.','Terna公布分区出清价格，但不公布限电量或南北输送限额。即便获得两组独立价格序列印证，代理指标仍是代理指标。']],
      ] },
      { t:'note', b:['Currency: ','货币：'],
        text:['All figures are in euros. The cross-market comparison converts at the platform\'s seeded EUR rate; see the home page FX row for the rate and its date.',
              '所有数字均以欧元计。跨市场对比按本平台设定的欧元汇率换算；汇率及其日期见首页汇率栏。'] },
    ] },

    { t:'card', title:['Source register','来源登记册'], badges:['official'], blocks:[
      { t:'table', head:[['Source','来源'],['Status','状态'],['Vintage','数据时点'],['Coverage','覆盖范围']], rows:[
        [{b:['Terna — MACSE auction results','Terna — MACSE拍卖结果']}, {chip:'good', text:SRC.macse.status}, SRC.macse.date, SRC.macse.cy],
        [{b:['Terna — Development Plan 2025–2034','Terna — 2025–2034年发展规划']}, {chip:'good', text:SRC.plan.status}, SRC.plan.date, SRC.plan.cy],
        [{b:['Terna — capacity market results','Terna — 容量市场结果']}, {chip:'good', text:SRC.capacityMarket.status}, SRC.capacityMarket.date, SRC.capacityMarket.cy],
        [{b:['Terna — de-rating factors and the DY2028 proposal','Terna — 折减系数及2028实需年度提案']}, {chip:'warn', text:SRC.derating.status}, SRC.derating.date, SRC.derating.cy],
        [{b:['Terna — Tyrrhenian Link','Terna — 第勒尼安互联']}, {chip:'good', text:SRC.tyrrhenian.status}, SRC.tyrrhenian.date, SRC.tyrrhenian.cy],
        [{b:['Terna — Adriatic Link','Terna — 亚得里亚海互联']}, {chip:'good', text:SRC.adriatic.status}, SRC.adriatic.date, SRC.adriatic.cy],
        [{b:['Terna — ELMED','Terna — ELMED互联']}, {chip:'good', text:SRC.elmed.status}, SRC.elmed.date, SRC.elmed.cy],
        [{b:['ARERA — Del. 168/2025 Allegato B','ARERA — 第168/2025号决议附件B']}, {chip:'warn', text:SRC.arera.status}, SRC.arera.date, SRC.arera.cy],
        [{b:['GME — day-ahead and intraday results','GME — 日前与日内市场结果']}, {chip:'good', text:SRC.gme.status}, SRC.gme.date, SRC.gme.cy],
        [{b:['MASE — DM 53 of 27 February 2025','MASE — 2025年2月27日第53号部长令']}, {chip:'good', text:SRC.mase.status}, SRC.mase.date, SRC.mase.cy],
      ] },
      { t:'src', src:SRC.arera, use:['Reference storage technology costs — the document that would settle Italian capex','参考储能技术成本 — 可解决意大利造价问题的文件'] },
    ] },

    { t:'card', title:['Glossary','术语表'], badges:['official'], blocks:[ { t:'glossary' } ] },

    { t:'card', title:['Export','数据导出'], badges:['calc'], blocks:[
      { t:'cap', text:['Exports this dashboard\'s KPI set with its seed tag and vintage. Contract prices ARE present here, unusually — MACSE and the capacity market both publish them. Costs are the absent half.',
                       '导出本看板KPI集合及其种子标签与数据时点。与常规不同，此处包含合同价格 — MACSE与容量市场均予公布。缺失的一半是成本数据。'] },
      { t:'exports' },
    ] },
  ] };
};

/* Investment Case and Entry: the investment-view revision. The content is the
   shared component, which reads this market's view and ledger as its dashboard
   registered them. There is no build pathway for this market yet, so Entry is
   the ledger. */
SEC_B.case = () => ({ head: ['Investment Case — who should enter, and by which route', '投资判断 — 谁应该进入，走哪条路径'], blocks: [
  { t: 'p', text: ['The second-highest modelled return here and a fifteen-year auction contract for the projects that win one; the first auction drew several times the volume on offer.', '模型回报在各市场中排名第二，中标项目可获得十五年期拍卖合同；首轮拍卖的投标量是招标量的数倍。'] },
  { t: 'investment-case', marketId: 'it' },
] });
SEC_B.entry = () => ({ head: ['Entry — what it costs before the first dollar of revenue', '进入成本 — 第一笔收入之前要付出什么'], blocks: [
  { t: 'p', text: ['Two payments are known to fall before revenue, a share of the connection charge and the auction\'s guarantees, and neither has a sourced amount, so nothing here is totalled.', '已知有两笔款项发生在产生收入之前，即部分并网费与拍卖保证金，但都没有可查证的金额，因此此处不作合计。'] },
  { t: 'entry-ledger', marketId: 'it' },
] });

  return SECTIONS;
}
