/* Ireland — the `grid` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { gridMapById } from '../../gridMapRegistry.js';
import { congestionFor } from '../../congestionRegistry.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.grid = function (){
  const mec = M.mecBridge;
  return {
  head: ['Grid & Connection — a chain of approvals, not a binary status','并网 — 一连串审批与合同，而非二元状态'],
  cap: ['Connection is the binding constraint on Irish storage and the place where development capital is lost. The distinctively Irish requirement is that both MEC (export) and MIC (import) must be documented in an executed agreement — an asset with export rights but insufficient import rights cannot charge at contracted power.',
        '并网是爱尔兰储能的关键约束，也是开发资本损失之处。爱尔兰特有的要求是：MEC（送出）与MIC（受入）必须在已签协议中同时载明 — 拥有送出权利但受入权利不足的资产，无法以合同功率充电。'],
  blocks: [
    { t:'geo-grid-map', data:gridMapById('ie-grid-map') },
    { t:'congestion', data:congestionFor('ie') },
    { t:'card', mt:false, title:['Nameplate → revenue bridge','铭牌容量至收入桥'], badges:['calc','illus'], live:true, blocks:[
      { t:'sub', text:['Capacity channel','容量通道'] },
      { t:'flow', items:[
        ['Nameplate MW','铭牌MW'], ['Contracted MEC','合同MEC'], ['× de-rating factor','×折减系数'],
        ['Awarded de-rated MW','中标折减MW'], ['− Reliability Option difference payments','− 可靠性期权差价支付'],
      ] },
      { t:'sub', text:['Merchant channel','市场化通道'] },
      { t:'flow', items:[
        ['Contracted MIC (charging right)','合同MIC（充电权利）'], ['Central scheduling & SNSP headroom','集中调度与SNSP裕度'],
        ['− constraint & dispatch-down','− 网络约束与限发'], ['− optimiser fee','− 优化商费用'], ['Realised net revenue','实际净收入'],
      ] },
      { t:'why', text:['The two chains start from different numbers, and that is the Irish trap. Capacity revenue is limited by MEC; merchant revenue is limited by MIC. A project with 50 MW MEC and 30 MW MIC has full capacity revenue and two-thirds of its cycling capability, which shows up as a revenue shortfall with no identifiable event. Read both numbers from the executed connection agreement, not from the offer and not from the application.',
        '两条链条的起点数字不同 — 这正是爱尔兰的陷阱。容量收入受MEC限制；市场化收入受MIC限制。一个MEC为50MW、MIC为30MW的项目拥有完整的容量收入，却只有三分之二的循环能力，其表现是没有可识别事件的收入缺口。应从已签并网协议中读取两个数字，而非从报价文件或申请文件中读取。'],
        sig:['MEC pays capacity; MIC enables cycling','MEC决定容量收入，MIC决定循环能力'] },
    ] },

    { t:'card', title:['MEC bridge — requested to monetisable (MW)','MEC桥 — 从申请到可变现（MW）'], badges:['illus'], live:true, blocks:[
      { t:'bar', cfg:{ xs: mec.map(x => L(x.l)), bw: 40, rotX: true, yfmt: v => fmtN(v) + ' MW', labels: true, h: 270,
        series:[{ name:['MW at each stage','各阶段MW'], color:'var(--s1)', vals: mec.map(x => x.v) }] } },
      { t:'why', text:['Requested ' + mec[0].v + ' MW becomes ' + mec[mec.length - 1].v + ' MW monetisable — a ' + fmtPct((1 - mec[mec.length - 1].v / mec[0].v) * 100, 0) + ' reduction, most of it occurring before an offer is even issued. Two implications: size the project against the assessed and offered capacity rather than the requested capacity, and treat any financial model built on requested MEC as overstated from the first line down.',
        '申请' + mec[0].v + 'MW最终变为可变现' + mec[mec.length - 1].v + 'MW — 减少' + fmtPct((1 - mec[mec.length - 1].v / mec[0].v) * 100, 0) + '，且大部分发生在报价文件出具之前。两点含义：应按评估后与报价容量而非申请容量确定项目规模；任何以申请MEC构建的财务模型，从第一行起即被高估。'],
        sig:['Size on offered, not requested','按报价容量而非申请容量定规模'] },
    ] },

    { t:'card', title:['Connection pathway, regulators and reform','并网流程、监管机构及改革'], badges:['official','verify'], live:false, blocks:[
      { t:'flow', items:[
        ['Route to the correct operator','选择正确运营商'], ['Application and studies','申请及研究'], ['Offer: exact MIC + MEC','报价：明确MIC及MEC'],
        ['Planning / land / consents','规划 / 土地 / 许可'], ['Executed agreement','已签协议'], ['Build, test and energise','施工、测试及送电'],
        ['Market registration and qualification','市场注册及资格'],
      ] },
      { t:'table', head:[['Jurisdiction / reform','司法辖区 / 改革'],['Who decides or delivers','决策或交付机构'],['Evidence an investor should demand','投资者应取得的证据']], rows:[
        [{b:['Republic of Ireland generation','爱尔兰共和国发电']},
          ['CRU regulates; EirGrid handles transmission applications above 40 MW and ESB Networks handles smaller distribution applications','CRU监管；40MW以上输电申请由EirGrid处理，较小的配电申请由ESB Networks处理'],
          ['Batch / process status, assessed capacity, exact node, executed agreement, MIC, MEC, enabling works and long-stop dates','批次/流程状态、评估容量、具体节点、已签协议、MIC、MEC、配套工程及最终期限']],
        [{b:['Northern Ireland connection','北爱尔兰并网']},
          ['Utility Regulator regulates; SONI handles transmission connections at 110 kV and above, NIE Networks the distribution system','Utility Regulator监管；110kV及以上输电并网由SONI处理，配电由NIE Networks处理'],
          ['Signed offer, contestable/non-contestable works, reinforcement scope, cost allocation, programme and energisation evidence','已签报价、可竞争/不可竞争工程、增容范围、成本分配、计划及送电证据']],
        [{b:['ROI data-centre reform','爱尔兰共和国数据中心改革']},
          ['CRU’s new policy tests location, system security and matching local generation/storage','CRU新政策测试区位、系统安全及配套本地发电/储能'],
          ['Do not infer approval from corporate announcement or land; require the system-operator decision and matching-resource evidence','不可根据企业公告或土地推断获批；须取得系统运营商决定及配套资源证据']],
        [{b:['NI connection-cost reform','北爱并网成本改革']},
          ['Reinforcement costs are moving toward socialisation while customers retain direct-asset costs and published caps','增容成本正转向社会化，客户仍承担直接资产成本及公布上限'],
          ['Verify the implementation date, qualifying voltage, offer version and residual direct works—policy direction is not a final invoice','核实实施日期、适用电压、报价版本及剩余直接工程；政策方向不是最终账单']],
      ] },
      { t:'why', text:['Delay case study: the existing cross-border path is constrained at roughly 300 MW, while the planned North–South Interconnector is designed for up to 1,500 MW. It is fully consented and in the construction step, but that future capability is not usable until build, testing and energisation finish. Prevent the same valuation error in a BESS deal by tying each dependency to a condition precedent, named document, long-stop date and per-MW price adjustment. Grid-forming capability can improve stability and service eligibility, but it does not create MIC, MEC or network headroom.',
        '延误案例：现有跨境路径受限于约300MW，而规划南北互联线设计能力最高1,500MW。该项目已全部获批并进入施工步骤，但在完成建设、测试及送电前，未来能力不可使用。BESS交易应将每项依赖绑定至先决条件、具名文件、最终期限及按MW调价，以避免同类估值错误。构网型能力可改善稳定性及服务资格，但不会创造MIC、MEC或网络空间。'],
        sig:['Consent is not energisation; capability is not a connection right','许可不等于送电；技术能力不等于并网权'] },
    ] },

    { t:'card', title:['Constraint and dispatch-down — the system problem storage is paid to solve','网络约束与限发 — 储能获付费所要解决的系统问题'], badges:['official','verify'], live:true, blocks:[
      { t:'kpis', items:[
        { l:['Wind dispatch-down (ROI, 2025)','风电限发（爱尔兰共和国，2025）'], v:fmt1(O.windDispatchDownPct) + '<small>%</small>', d:['curtailment plus constraint','弃电加网络约束'], b:['official','verify'] },
        { l:['Constraint & curtailment cost','约束与弃电成本'], v:fmtCM(O.constraintCostM * 1e6), d:['2024/25 · forecast ' + fmtCM(O.constraintForecastM * 1e6),'2024/25 · 预测' + fmtCM(O.constraintForecastM * 1e6)], b:['official','verify'] },
        { l:['SNSP limit today','当前非同步渗透率上限'], v:O.snspNow + '<small>%</small>', d:['policy direction ' + O.snsp2030 + '% by 2030','政策方向：2030年' + O.snsp2030 + '%'], b:['official','verify'] },
        { l:['Interconnection added by 2028','至2028年新增互联'], v:fmtN(O.greenlinkMW + O.celticMW) + '<small> MW</small>', d:['reduces constraints and spreads together','同时减少约束与价差'], b:['official'] },
      ] },
      { t:'why', text:['A ' + fmtCM(O.constraintCostM * 1e6) + ' annual constraint bill rising toward ' + fmtCM(O.constraintForecastM * 1e6) + ' is a quantified, published prize — the clearest statement in any market in this comparison set that the system will pay to fix a problem storage can address. But note the direction of the interconnector row: ' + fmtN(O.greenlinkMW + O.celticMW) + ' MW of coupling reduces exactly this bill. The window in which constraint capture is worth most is therefore before Celtic, not after.',
        '每年' + fmtCM(O.constraintCostM * 1e6) + '并向' + fmtCM(O.constraintForecastM * 1e6) + '上升的约束账单，是一个可量化、已公布的“奖金池” — 这是本对比样本中任何市场都无法比拟的明确表态：系统愿意为解决储能可应对的问题付费。但须注意互联一行的方向：' + fmtN(O.greenlinkMW + O.celticMW) + 'MW的耦合恰恰会减少这笔账单。因此约束捕获价值最高的窗口在Celtic投运之前，而非之后。'],
        sig:['The prize shrinks when the cable lands','电缆投运后奖金池缩小'] },
      { t:'src', src: SRC.eirgrid, use:['Dispatch-down, constraint and curtailment cost, SNSP limit','限发、约束与弃电成本、非同步渗透率上限'] },
    ] },

    { t:'card', title:['The network build behind the offers — named projects and their delivery step','要约背后的电网建设 — 具名项目及其交付阶段'], badges:['official','forecast'], live:false, blocks:[
      { t:'table',
        head:[['Project','工程'],['Route','路径'],['Delivery body','交付主体'],['Position','进展状态'],['Scope','范围'],['Target','目标年份'],['Status','状态']], num:[5],
        rows: M.reinforcements.map(x => {
          const k = M.planClasses.find(c => c.id === x.cls);
          return [{ b:x.n }, x.region, [x.operator, x.operator], { chip:k.c, text:k.n }, x.scope, String(x.year), x.status];
        }) },
      { t:'cap', text:['The all-island transmission projects an Irish connection date depends on, ordered by target year. Ireland publishes no ISP-style status classification, so the position column maps EirGrid\'s own project lifecycle onto whether consent and construction actually exist.',
        '爱尔兰并网日期所依赖的全岛输电工程，按目标年份排列。爱尔兰不发布ISP式的状态分类，因此进展状态列将EirGrid自身的项目生命周期映射为“许可与施工是否确实存在”。'] },
      { t:'table', head:[['Position','进展状态'],['What it does and does not confer','其赋予与不赋予的内容']],
        rows: M.planClasses.map(k => [{ chip:k.c, text:k.n }, k.d]) },
      { t:'why', text:['One row on this table should reset how an Irish network date is read. The North-South Interconnector has held full planning approval on both sides of the border since 2018 and is only now expected to start construction, for completion in 2031 — thirteen years in the consented class. That is the single largest all-island transfer constraint, and it is the constraint behind much of the dispatch-down bill in the card above. Two consequences. A consented Irish project is not a near-term project, so a case that assumes the constraint prize shrinks on the consent date is wrong by years. And Celtic shows the converse risk — it slipped from 2027 to Q4 2028 while already under construction — so even the strongest class here carries schedule risk. Underwrite the constraint capture against the build dates in this table, not against the policy dates.',
        '本表中有一行应当改变对爱尔兰电网日期的解读方式。南北互联线自2018年起即在边界两侧取得完整规划批准，直到现在才预计开工，2031年完工 — 在"已获许可"类别中停留了十三年。它是全岛最大的单一输送约束，也是上方卡片中大部分限发账单背后的成因。由此有两点推论。爱尔兰已获许可的项目并非近期项目，因此假定约束"奖金池"会在许可日期缩小的方案，会误判数年之久。而Celtic则显示了相反的风险 — 它在已经施工的情况下仍由2027年推迟至2028年第四季度 — 因此即便是本表中最强的类别也带有进度风险。约束捕获应以本表中的建设日期承销，而非以政策日期承销。'],
        sig:['Consented has meant thirteen years here','在此“已获许可”曾意味着十三年'] },
      { t:'src', src: SRC.tdp, use:['Named project scope, lifecycle step and target completion years','具名项目范围、生命周期阶段及目标完工年份'] },
      { t:'src', src: SRC.celtic, use:['Celtic Interconnector scope and revised commissioning date','Celtic互联线范围及修订后的投运日期'] },
      { t:'src', src: SRC.pr6, use:['Approved 2026–2030 capital envelope and priority project counts','已核准的2026–2030年资本额度及优先项目数量'] },
    ] },

    { t:'card', title:['Connection risk → suggested commercial protections','并网风险 → 建议商业保护条款'], badges:['calc'], live:false, blocks:[
      { t:'table', head:[['Risk','风险'],['Protection','保护条款'],['Trigger to invoke','触发条件']], rows:[
        [{b:['MEC reduced between offer and executed agreement','报价至签约期间MEC被削减']},
         ['Price adjustment per MW of shortfall; walk-away right below a defined floor','按缺口MW调整价款；低于约定下限时享有退出权'],
         ['Any revision to the offered capacity','报价容量的任何修订']],
        [{b:['MIC insufficient for modelled cycling','MIC不足以支撑模型循环次数']},
         ['MIC ≥ MEC as a condition precedent; otherwise re-model cycles and re-price','以MIC不低于MEC为先决条件；否则重算循环次数并重新定价'],
         ['MIC below MEC in the executed agreement','已签协议中MIC低于MEC']],
        [{b:['ECP batch position treated as delivery evidence','将ECP批次位置视为交付证据']},
         ['Executed connection agreement as a hard condition precedent, with no substitutes accepted','以已签并网协议为硬性先决条件，不接受任何替代'],
         ['Any evidence weaker than an executed agreement','任何弱于已签协议的证据']],
        [{b:['FASS/DASSA repricing of the services line','FASS/DASSA对服务收入重新定价']},
         ['Revenue re-opener with DASSA-parameter triggers in the acquisition or toll agreement','在收购或代工协议中设置收入重议条款及DASSA参数触发机制'],
         ['Publication of DASSA parameters or a go-live date','DASSA参数或上线日期发布']],
        [{b:['Reliability Option difference payments in a high-price year','高电价年度的可靠性期权差价支付']},
         ['Degradation covenant keeping usable duration above the awarded band; state-of-charge operating protocol','以衰减契约维持可用时长高于中标档位；制定荷电状态操作规程'],
         ['Modelled duration within 10% of a band boundary','模型时长距档位边界不足10%']],
      ] },
      { t:'why', text:['Every protection here converts a documentary risk into a priced or allocated one. The two that are genuinely Ireland-specific are the MIC condition and the Reliability Option covenant — neither appears in a GB template, and both are routinely omitted when a GB-experienced sponsor moves west. Adding them costs nothing at term-sheet stage and is effectively impossible to negotiate after signing.',
        '此处每项保护都把文件风险转化为可定价或可分配的风险。真正属爱尔兰特有的是MIC条件与可靠性期权契约 — 两者均不出现在英国模板中，且当具英国经验的发起人西进时常被遗漏。在条款清单阶段加入这两项成本为零，签约后则几乎无法再谈判。'],
        sig:['Two clauses a GB template omits','两项英国模板遗漏的条款'] },
      { t:'src', src: SRC.cru, use:['Connection policy, network charges and storage treatment','并网政策、网络费用与储能待遇'] },
    ] },
  ] };
};

// ============================== IRELAND vs GB (peer benchmark) ==============================
// Mirrors the WA dashboard's "WEM vs NEM" section: the only tab that uses peer-market
// data, held in a separate namespace and excluded from every Ireland scoring input.

  return SEC_B.grid;
}
