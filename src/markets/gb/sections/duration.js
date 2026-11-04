/* Great Britain — the `duration` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { designLine, designBest, routeFit } from '../../_shared/designAnswer.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, T, state, bandFor, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, durationAt, interp, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O } = createShared(api);
  const SEC_B = {};

SEC_B.duration = function (){
  const dni = liveScore('durFactors'), band = bandFor(M.durBands, dni);
  const d2 = M.deratingCurve[2], d4 = M.deratingCurve[4];
  const capUplift = O.t4Price * (d4 - d2) * 1000;
  const merchUplift = M.bmRevenueByDur[4] - M.bmRevenueByDur[2];
  const addCapexPerMW = 2 * M.lab.capexKWh * 1000;       // 2 extra MWh per MW
  const annualised = addCapexPerMW * 0.09;                // ~9% capital charge, indicative
  /* The engine's answer to the question this tab asks, as the Brief states it. */
  const capFit = routeFit('gb', 'cap'), best = designBest('gb');
  const flat = Boolean(capFit && capFit.low < capFit.high);
  const engineSays = !capFit || !best ? ['', ''] : [
    ' The engine prices the trade directly: on the capacity route '
      + (flat ? 'it cannot separate ' + capFit.low + 'h from ' + capFit.high + 'h on value, so the added hours pay for themselves and no more'
              : 'its best duration is ' + capFit.hours + 'h')
      + '; the best design overall is ' + best.name[0] + ' at ' + best.hours + 'h.',
    '引擎直接为这一取舍定价：在容量路径上，'
      + (flat ? '引擎无法在价值上区分' + capFit.low + '小时与' + capFit.high + '小时，即新增小时恰好收回自身成本'
              : '其最佳时长为' + capFit.hours + '小时')
      + '；整体最佳设计为' + best.name[1] + best.hours + '小时。',
  ];
  return {
  head: ['Storage Duration & LDES — is the fourth hour worth its capex?','储能时长与长时储能 — 第4小时是否值其造价？'],
  cap: ['GB pays for duration through the de-rating table and through resilience during stress events, not through wider spreads. This tab separates the three questions duration answers — capacity value, merchant value and policy eligibility — because they have different answers.',
        '英国通过折减系数表及紧张事件下的韧性为时长付费，而非通过更宽的价差。本页拆分时长所回答的三个问题 — 容量价值、市场化价值与政策资格 — 因为三者答案不同。'],
  blocks: [
    { t:'card', mt:false, title:['Duration answers three different questions','时长回答三个不同问题'], badges:['calc','official'], live:false, blocks:[
      { t:'table', head:[['Question','问题'],['Mechanism','机制'],['Answer for GB at 2h → 4h','英国由2小时增至4小时的答案']], rows:[
        [{b:['How much capacity revenue?','容量收入多少？']}, ['Capacity Market de-rating factor','容量市场折减系数'],
         [fmtPct(d2 * 100, 0) + ' → ' + fmtPct(d4 * 100, 0) + ' of nameplate; +' + fmtCk(capUplift) + '/MW/yr at the last clearing price',
          '折减系数由' + fmtPct(d2 * 100, 0) + '升至' + fmtPct(d4 * 100, 0) + '；按最近出清价每MW/年增加' + fmtCk(capUplift)]],
        [{b:['How much merchant revenue?','市场化收入多少？']}, ['Realised spread capture across more hours','在更多小时内实现价差捕获'],
         ['+' + fmtCk(merchUplift) + '/MW/yr — sub-linear, because deeper cycles capture thinner spreads',
          '每MW/年增加' + fmtCk(merchUplift) + ' — 呈次线性，因更深循环所捕获价差更薄']],
        [{b:['Am I eligible for anything?','是否具备政策资格？']}, ['LDES cap-and-floor threshold (8h+ in practice)','长时储能上下限机制门槛（实务上8小时以上）'],
         ['No. 4h is below the LDES regime and above the short-duration merchant sweet spot — a deliberate middle.',
          '否。4小时低于长时储能机制门槛，又高于短时市场化的最优区间 — 是一个刻意的中间选择。']],
      ] },
      { t:'wf', cfg:{ yfmt: v => fmtCk(v), h: 270, steps: [
        { l:['Capacity de-rating uplift','容量折减系数增益'], v: capUplift, t:'d' },
        { l:['Incremental merchant revenue','增量市场化收入'], v: merchUplift, t:'d' },
        { l:['Reserve-product access (energy-based)','备用类产品准入（能量型）'], v: 2500, t:'d' },
        { l:['Stress-event penalty avoidance','规避紧张事件罚则'], v: 1500, t:'d' },
        { l:['Annualised incremental capex','年化增量资本开支'], v: -annualised, t:'d' },
        { l:['Degradation & opex','衰减与运维'], v: -2000, t:'d' },
        { l:['Net marginal value, hours 3–4','第3–4小时净边际价值'], v: capUplift + merchUplift + 2500 + 1500 - annualised - 2000, t:'total' },
      ] } },
      { t:'why', text:['The fourth hour is paid for ' + (capUplift >= merchUplift ? 'mostly by the capacity mechanism (' + fmtCk(capUplift) + ') and only secondarily by trading (' + fmtCk(merchUplift) + ')' : 'mostly by trading (' + fmtCk(merchUplift) + ') and only secondarily by the capacity mechanism (' + fmtCk(capUplift) + ')') + ', against roughly ' + fmtCk(annualised) + '/MW/yr of annualised incremental capex at ' + fmtC(M.lab.capexKWh) + '/kWh. That makes the decision acutely sensitive to two things a sponsor does not control: the de-rating vintage at the auction entered, and the cell price at procurement.' + engineSays[0],
        '第4小时' + (capUplift >= merchUplift ? '主要由容量机制付费（' + fmtCk(capUplift) + '），交易仅为次要来源（' + fmtCk(merchUplift) + '）' : '主要由交易付费（' + fmtCk(merchUplift) + '），容量机制仅为次要来源（' + fmtCk(capUplift) + '）') + '，而按' + fmtC(M.lab.capexKWh) + '/kWh计的年化增量资本开支约为' + fmtCk(annualised) + '/MW/年。这使决策对两个发起人无法控制的因素高度敏感：参与拍卖时的折减系数版本，以及采购时的电芯价格。' + engineSays[1]],
        sig: best ? ['Best design: ' + best.name[0] + ' at ' + best.hours + 'h', '最佳设计：' + best.name[1] + best.hours + '小时'] : ['Not priced', '未定价'] },
    ] },

    { t:'card', title:['Duration-Need Index — every component visible and editable','时长需求指数 — 分项全部可见、可编辑'], badges:['calc','illus'], live:true, blocks:[
      { t:'scorecard', id:'durFactors', bands:'durBands' },
      { t:'why', text:['The index sits at ' + dni + '/100 — ' + L(band.n) + '. The two factors holding it down are the longer-duration merchant signal (score 1: GB spreads do not widen enough to pay for hours) and interconnector contribution (score 1: 8+ GW of interconnection substitutes for domestic duration in most conditions). The two pulling it up are the de-rating uplift and the LDES policy signal — both administrative. Read together: GB duration is a policy-paid attribute, so it should be underwritten against policy documents and auction tables, not against price forecasts.',
        '该指数为' + dni + '/100 — ' + L(band.n) + '。压低它的两个因子是更长时长的市场化信号（评分1：英国价差扩大不足以支付更多小时）与互联线路贡献（评分1：8GW以上互联在多数工况下替代了本土时长需求）。推高它的两个因子是折减系数增益与长时储能政策信号 — 二者均属行政性。综合解读：英国的时长是由政策付费的属性，因此应以政策文件与拍卖表格而非价格预测进行承销。'],
        sig:['Duration is policy-paid in GB','英国的时长由政策付费'] },
    ] },

    { t:'card', title:['Event-duration evidence — how long does the system actually need?','事件时长证据 — 系统实际需要多久？'], badges:['calc','illus'], live:true, blocks:[
      { t:'bar', cfg:{ xs:['P50','P90','P99'], mode:'group', bw: 30, yfmt: v => fmt1(v) + ' h', labels: true, h: 240,
        series:[
          { name:['High-price event length','高价事件时长'], color:'var(--s1)', vals:[M.events.highPrice.p50, M.events.highPrice.p90, M.events.highPrice.p99] },
          { name:['Wind-drought length','低风事件时长'], color:'var(--s6)', vals:[M.events.windDrought.p50, M.events.windDrought.p90, M.events.windDrought.p99] },
        ] } },
      { t:'note', text:['Two different phenomena with two different answers. Price events are hours long and are addressed by 2–4h batteries. Wind droughts are days long and cannot be addressed by lithium at any commercially plausible duration — they are the case for LDES, interconnection and dispatchable low-carbon generation.',
        '这是两种不同现象，对应两种不同答案。价格事件持续数小时，2–4小时电池即可应对。低风事件持续数日，在任何商业上可行的时长下锂电池均无法应对 — 这正是长时储能、互联线路与可调度低碳电源的用武之地。'] },
      { t:'why', text:['The P90 high-price event runs ' + fmt1(M.events.highPrice.p90) + ' hours against a fleet average of ' + fmt1(O.fleetAvgHours) + ' hours, so the existing fleet is energy-limited in exactly the periods that matter most for both price capture and capacity-market performance. That gap is the new-build advantage, and it is worth more than the headline spread comparison suggests because it appears in the highest-priced hours of the year. But note the P99 at ' + fmt1(M.events.highPrice.p99) + ' hours: even 8h does not fully cover the tail, which is why capacity-market penalty exposure never reaches zero.',
        'P90高价事件持续' + fmt1(M.events.highPrice.p90) + '小时，而存量平均时长为' + fmt1(O.fleetAvgHours) + '小时，因此既有机组恰恰在对价格捕获与容量市场履约最关键的时段内出现能量受限。这一缺口正是新建项目的优势，且其价值高于表面价差比较所显示的水平，因为它出现在全年电价最高的时段。但须注意P99为' + fmt1(M.events.highPrice.p99) + '小时：即便8小时也无法完全覆盖尾部，这正是容量市场罚则敞口永远无法归零的原因。'],
        sig:['Fleet is short exactly when it matters','存量机组恰在关键时刻时长不足'] },
    ] },

    { t:'card', title:['Fleet versus pipeline duration — where the market is heading','存量与管线时长对比 — 市场走向'], badges:['calc','illus'], live:true, blocks:[
      { t:'line', cfg:{ xs: M.buildYears, yfmt: v => fmt1(v) + ' h', ymin: 0, h: 220,
        series:[{ name:['Fleet weighted-average duration','存量加权平均时长'], color:'var(--s1)', vals: M.avgDurByYear }],
        refs:[{ y: 4, label:['4h — de-rating inflection','4小时 — 折减系数拐点'], color:'var(--s3)' }] } },
      { t:'why', text:['The fleet drifts from ' + fmt1(M.avgDurByYear[0]) + ' h to ' + fmt1(M.avgDurByYear[M.avgDurByYear.length - 1]) + ' h over eight years — it never reaches the 4h de-rating inflection on this path. That is the structural read: GB is building a long tail of short assets that will compete hard for the same narrowing spreads and receive a shrinking share of capacity revenue. A 4h build is not following the market; it is deliberately leaving it.',
        '八年间存量加权平均时长由' + fmt1(M.avgDurByYear[0]) + '小时漂移至' + fmt1(M.avgDurByYear[M.avgDurByYear.length - 1]) + '小时 — 在该路径上从未达到4小时的折减系数拐点。结构性解读是：英国正在建设一条由短时资产构成的长尾，这些资产将激烈争夺同一批不断收窄的价差，并获得日益缩减的容量收入份额。建设4小时并非跟随市场，而是有意离开市场。'],
        sig:['4h is a deliberate divergence','4小时是有意的分化'] },
    ] },

    { t:'card', title:['LDES cap-and-floor — a separate asset class, not a longer battery','长时储能上下限机制 — 独立资产类别，而非更长的电池'], badges:['draft','illus'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['CP2030 LDES requirement','CP2030长时储能需求'], v:'4–6<small> GW</small>', d:['from a ' + fmt1(O.ldesBaselineGW) + ' GW baseline, mainly pumped storage','基线' + fmt1(O.ldesBaselineGW) + 'GW，以抽水蓄能为主'], b:['official'] },
        { l:['Window 1 minded-to projects','第一窗口倾向性入选项目'], v:String(O.ldesWindow1Projects), d:['minded-to is not a final financeable award','倾向性决定并非最终可融资授予'], b:['draft'] },
        { l:['Practical duration threshold','实务时长门槛'], v:'8<small> h+</small>', d:['below this the CM de-rating route applies instead','低于此门槛则适用容量市场折减路径'], b:['calc'] },
      ] },
      { t:'gates', items:[
        { n:['Regime','机制'], d:['Regulated cap-and-floor: a revenue floor with an upside cap, administered rather than traded.','受监管的上下限机制：设定收入下限并对上行设上限，属行政管理而非市场交易。'], c:'good', s:['Different risk class','不同风险类别'] },
        { n:['Cost of capital','资本成本'], d:['Floor-supported cash flow supports materially higher leverage and a lower equity return requirement.','保底支撑的现金流可支撑显著更高的杠杆及更低的股权回报要求。'], c:'good', s:['Lower','更低'] },
        { n:['Buyer universe','买家群体'], d:['Regulated-asset investors and pension capital, not merchant storage funds.','受监管资产投资人与养老金资本，而非市场化储能基金。'], c:'info', s:['Different','不同'] },
        { n:['Capitalisation rule','资本化规则'], d:['Do not capitalise a floor before final award. Minded-to status carries process, FID-reset and post-construction review risk.','最终授予前不得将保底资本化。倾向性状态仍附带流程、FID重设与建后审查风险。'], c:'critical', s:['Award only','仅以授予为准'] },
      ] },
      { t:'why', text:['Treating LDES as "a battery with more hours" is the single most common category error in GB storage underwriting. It is a regulated asset with a floor, a cap, a different lender base and a different buyer at exit — closer in character to a transmission asset than to a 2h merchant battery. The practical consequence is that an 8h project and a 2h project should not appear in the same portfolio model with the same discount rate, and a fund mandate that permits both should say which it is underwriting.',
        '把长时储能视为“小时数更多的电池”，是英国储能承销中最常见的类别错误。它是带有下限与上限、贷款人基础不同、退出时买家亦不同的受监管资产 — 其性质更接近输电资产而非2小时市场化电池。实务后果是：8小时项目与2小时项目不应以相同折现率出现在同一组合模型中；若基金授权允许两者兼投，应明确说明其承销的是哪一类。'],
        sig:['Not a longer battery — a different asset','并非更长的电池，而是不同资产'] },
      { t:'src', src: SRC.ldes, use:['Window 1 minded-to decisions and cap-and-floor regime design','第一窗口倾向性决定及上下限机制设计'] },
    ] },

    { t:'card', title:['Augmentation readiness — the option to add hours later','增容准备度 — 日后增加小时数的选择权'], badges:['illus'], live:false, blocks:[
      { t:'aug' },
      { t:'why', text:['The right to add hours later lets the build follow the de-rating vintage and the cell price instead of fixing both today' + (capFit ? '; on the capacity route the engine puts the design at ' + capFit.span[0] + ', which is the range the option has to cover' : '') + '. It is only real if it is documented in the planning consent, the connection agreement, the OEM warranty and the financing documents — the four places it is normally lost.',
        '日后增加小时数的权利，使建设规模可随折减系数版本与电芯价格调整，而不必今天就将二者锁定' + (capFit ? '；容量路径上引擎给出的设计为' + capFit.span[1] + '，即该选择权须覆盖的范围' : '') + '。只有在规划许可、并网协议、OEM质保与融资文件中均有明确记载时，该选择权才真实存在 — 而这四处正是它通常被丢失的地方。'],
        sig:['The option must be in four documents','选择权须写入四份文件'] },
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
