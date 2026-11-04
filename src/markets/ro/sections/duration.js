/* Romania — the `duration` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const SEC_B = {};

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

  return SEC_B.duration;
}
