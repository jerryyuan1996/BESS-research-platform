/* Japan — the `services` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;
  const { N, R } = createShared(api);
  const SEC_B = {};

  SEC_B.services = function (){
    const rs = lensRegions();
    return {
    head: ['Balancing Market — national products, regional saturation', '需给调整市场 — 全国品种，区域饱和'],
    cap: ['Product definitions are national and appear once. Only the incremental value after JEPX opportunity cost feeds the global engine.',
          '品种定义为全国统一，仅列示一次。仅扣除JEPX机会成本后的增量价值计入全球引擎。'],
    blocks: [
      { t: 'card', mt: false, title: ['Product matrix', '品种矩阵'], badges: ['official'], live: false,
        src: SRC.eprx, srcUse: ['Rules effective 1 Jul 2026', '2026年7月1日生效规则'], blocks: [
        { t: 'table',
          head: [['Product', '品种'], ['Japanese', '日文'], ['Response', '响应时间'], ['Duration', '持续时间']],
          rows: N.balancingProducts.map(p => [{ b: p.n }, p.jp, p.resp, p.dur]) },
        { t: 'why', text: ['Five products, one asset. A battery cannot sell capability into all of them simultaneously and still run an arbitrage cycle — every ΔkW reserved is energy headroom withdrawn from JEPX. This is why the platform counts only incremental balancing value.',
                           '五个品种，一台资产。储能无法在维持套利循环的同时向所有品种提供容量 — 每预留一份ΔkW，就从JEPX撤出一份电量裕度。这正是本平台仅计算调整力增量价值的原因。'],
          sig: ['Reserved ΔkW is withdrawn energy', '预留容量即撤出电量'] } ] },
      { t: 'card', title: ['Investor claim checked — “online / extra-high-voltage priority”',
                           '投资人说法核验 — “online / 特别高压优先权”'],
        badges: ['official', 'calc'], live: false, src: SRC.eprxProductRequirements,
        srcUse: ['Current product requirements and control-line eligibility', '现行品种要求与控制线路准入'], blocks: [
        { t: 'chip', cls: 'warn', text: [
          'Commercially plausible, but not a general priority right',
          '商业上可能形成优势，但并非普遍优先权',
        ] },
        { t: 'table',
          head: [['Question', '问题'], ['Verified rule', '已核验规则'], ['Investment reading', '投资解读']],
          rows: [
            [{ b: ['Who clears first?', '谁优先出清？'] },
             ['Lowest ΔkW bid price first; tie-breaks use fewer interconnectors, then system-priority area.', 'ΔkW报价最低者先出清；同价时依次按经过联络线更少、系统优先区域排序。'],
             ['Voltage class and project duration are not clearing-priority fields.', '电压等级与项目时长并非出清优先字段。']],
            [{ b: ['Is there any online access edge?', 'online是否存在准入优势？'] },
             ['Yes, narrowly: the rules cap offline Primary awards, so online capability can avoid that product-specific constraint.', '有，但范围有限：规则对离线一次调频中标设有上限，online能力可避免这一特定品种约束。'],
             ['Treat it as product access, not universal dispatch priority.', '应视为品种准入优势，而非普遍调度优先权。']],
            [{ b: ['Does online control matter?', 'online控制是否重要？'] },
             ['Yes. Secondary-1 requires dedicated-line online LFC; Secondary-2 and Tertiary products require online control with dedicated line or the simplified command system, depending on product.', '是。二次①要求专线online LFC；二次②及三次产品按品种要求采用专线或简易指令系统进行online控制。'],
             ['Qualification can open more products and more bid windows, which is a real commercial edge.', '通过资格审查可开放更多品种与投标窗口，构成真实商业优势。']],
            [{ b: ['Is a 2 MW / 8 MWh project excluded?', '2MW/8MWh项目是否被排除？'] },
             ['No. The minimum bid is 1 MW across products; aggregation may meet it. EPRX also allows qualifying 1–10 MW high/extra-high-voltage batteries in the offline FCR category, with no different bidding method.', '否。各品种最低投标量均为1MW，可通过聚合满足。EPRX亦允许符合条件的1–10MW高压/特别高压电池进入离线一次调频类别，投标方式并无差异。'],
             ['A small project loses only if it lacks qualification, bids less competitively or carries higher per-MW control costs — not because it is “2/8”.', '小项目只有在资格不足、报价竞争力较弱或单位MW控制成本更高时处于劣势，并非因其“2/8”规格。']],
          ] },
        { t: 'flow', items: [
          ['Grid import + export rights', '充放电并网权'],
          ['Control line / telemetry', '控制线路/遥测'],
          ['TSO prequalification test', 'TSO资格预审'],
          ['Competitive ΔkW bid', '有竞争力的ΔkW报价'],
          ['Incremental revenue after JEPX cost', '扣除JEPX机会成本后的增量收入'],
        ] },
        { t: 'g3', cards: [
          { title: ['Tokyo opportunity', '东京机会'], badges: ['jp-tokyo'], blocks: [
            { t: 'p', text: ['Online multi-product access is most useful where deep load and scarcity support repeated dispatch — but only with firm import/export evidence.', '在深度负荷与稀缺性支持重复调度之处，online多品种准入最有价值 — 但前提是充放电并网证据充分。'] },
          ] },
          { title: ['Kyushu opportunity', '九州机会'], badges: ['jp-kyushu'], blocks: [
            { t: 'p', text: ['Pair online qualification with verified solar-surplus charging access. Grid reinforcement that reduces curtailment is the downside overlay.', '将online资格与已核验的光伏过剩充电接入结合；降低弃电的电网强化则是下行情景。'] },
          ] },
          { title: ['Hokkaido warning', '北海道提示'], badges: ['jp-hokkaido'], blocks: [
            { t: 'p', text: ['First-mover access is already being competed away: published FY2026 balancing registrations exceed 0.2 GW against a small requirement. Online capability does not prevent saturation.', '先发准入优势已被竞争侵蚀：公开FY2026调整力注册规模超过0.2GW，而需求池较小。online能力无法避免饱和。'] },
          ] },
        ] },
        { t: 'warn', text: [
          'Underwriting rule: do not add a generic “online premium”. Model only the products actually prequalified, accepted bid volumes and realised prices, net of JEPX opportunity cost, state-of-charge reservation, degradation, fees and penalties.',
          '承销规则：不得笼统添加“online溢价”。仅对实际通过资格预审的品种、实际中标量及实现价格建模，并扣除JEPX机会成本、SOC预留、衰减、费用与罚则。',
        ] },
        { t: 'src', src: SRC.eprxRules18, use: ['Articles 26, 32 and 39 — minimum bid, award order, offline Primary cap and performance', '第26、32、39条 — 最低投标量、中标顺序、离线一次调频上限与履约'] },
        { t: 'src', src: SRC.eprxFaq, use: ['1 MW minimum, aggregation, offline FCR eligibility and control-line clarification', '1MW最低投标量、聚合、离线一次调频资格及控制线路说明'] },
        { t: 'src', src: SRC.eprxBatteryGuide, use: ['Voltage, metering, aggregation and connection pathways', '电压、计量、聚合与并网路径'] },
      ] },


      { t: 'card', title: ['Incremental value bridge', '增量价值桥接'], badges: ['calc', 'illus'], live: true, blocks: [
        { t: 'wfrows', items: [
          { l: ['Balancing gross payment', '调整力毛付费'], v: '+', n: ['Capability plus energy', '容量加电量'] },
          { l: ['− JEPX opportunity cost', '− JEPX机会成本'], v: '−', n: ['Margin forgone on reserved headroom', '预留裕度上放弃的收益'] },
          { l: ['− SOC / headroom reservation cost', '− SOC/裕度预留成本'], v: '−', n: ['State-of-charge constraint', '荷电状态约束'] },
          { l: ['− additional degradation', '− 额外衰减'], v: '−', n: ['Extra cycling', '额外循环'] },
          { l: ['− fees and penalties', '− 费用与罚则'], v: '−', n: ['Market and performance', '市场与履约'] },
          { l: ['= incremental balancing value', '= 调整力增量价值'], v: '=', n: ['The only figure fed to the global engine', '唯一计入全球引擎的数值'] },
        ] },
        { t: 'bar', cfg: {
          xs: rs.map(id => L(R(id).short)),
          mode: 'group', h: 240, yfmt: v => '¥' + fmt1(v / 1e6) + 'M',
          series: [{ name: ['Incremental balancing value (¥/MW/yr)', '调整力增量价值（¥/MW/年）'], color: 'var(--s5)',
                     vals: rs.map(id => R(id).econ.balancingIncrementalJPYMWYr) }] } },
        { t: 'why', text: ['Hokkaido shows the lowest incremental value despite the largest renewable-integration need. That is saturation arriving before the requirement grows: more than 0.2 GW of batteries expected to register in FY2026 against a small regional requirement. Need does not set price; the ratio of supply to requirement does.',
                           '尽管新能源消纳需求最大，北海道的增量价值却最低。这是饱和先于需求增长而至：预计FY2026将有超过0.2GW储能注册，而区域需求规模有限。定价并非由需求决定，而是由供给与需求之比决定。'],
          sig: ['Need does not set price', '需求不决定价格'] } ] },
    ] };
  };

  // ============================== DURATION ==============================

  return SEC_B.services;
}
