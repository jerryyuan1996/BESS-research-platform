/* Romania — the `capacity` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

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

  return SEC_B.capacity;
}
