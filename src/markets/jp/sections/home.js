/* Japan — the `home` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { buildJPEconomicsBlocks } from '../economicsSection.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;
  const { O, N, R, path, perRegion, regionTable, regionBadge, lensNote, seedGate } = createShared(api);
  const SEC_B = {};

  SEC_B.home = function (){
    const S = M.systemEvolution;
    const systemRegions = ['tokyo', 'kyushu', 'hokkaido'];
    return {
    warn: M.seedWarn,
    blocks: [
      lensNote(),
      ...buildJPEconomicsBlocks(),
      { t: 'card', mt: false, title: ['Official system evolution — OCCTO FY2025 supply plan',
                                      '官方系统演进 — OCCTO FY2025供给计划'],
        badges: ['official', 'forecast'], live: false, src: SRC.occtoSupplyPlan2025,
        srcUse: ['Appendix 2 and 3 regional demand and supply tables', '附录2与3的区域需求及供给表'], blocks: [
        { t: 'table',
          head: [['Region', '区域'], ['FY2025 peak', 'FY2025峰值'], ['FY2030 peak', 'FY2030峰值'],
                 ['FY2034 peak', 'FY2034峰值'], ['FY2034 supply capacity', 'FY2034供给能力']],
          num: [1, 2, 3, 4],
          rows: systemRegions.map(id => [
            { b: R(id).short },
            fmt1(S.regions[id].peakDemandGW[0]) + ' GW',
            fmt1(S.regions[id].peakDemandGW[1]) + ' GW',
            fmt1(S.regions[id].peakDemandGW[2]) + ' GW',
            fmt1(S.regions[id].supplyCapacityGW[2]) + ' GW',
          ]) },
        { t: 'note', text: [
          'These are official planning points from one named FY2025 vintage. FY2034 is shown because it is the source horizon; the dashboard does not interpolate an unsupported 2035 value. Hokkaido uses its winter-peak series while Tokyo and Kyushu use their regional peak series.',
          '以上为同一FY2025官方版本中的规划点。由于来源止于FY2034，故看板显示FY2034，不插值生成无来源的2035数值。北海道采用冬季峰值序列，东京与九州采用各自区域峰值序列。',
        ] },
        { t: 'g2', cards: [
          { title: ['Forecast confidence', '预测置信度'], badges: ['calc'], blocks: [
            { t: 'kpis', items: [
              { l: ['Evidence confidence', '证据置信度'], v: M.forecastGovernance.confidenceScore + '/10', d: M.forecastGovernance.confidenceBand },
              { l: ['Queue completeness', '队列完整性'], v: 'N/A', d: ['No complete public register', '无完整公开登记'] },
            ] },
            { t: 'p', text: M.forecastGovernance.confidenceBasis },
          ] },
          { title: ['What invalidates the case', '何种情况会推翻情景'], badges: ['verify'], blocks: [
            { t: 'p', text: M.forecastGovernance.invalidation },
            { t: 'note', text: M.forecastGovernance.queueCoverage },
          ] },
        ] },
        { t: 'why', text: [
          'The common national rules do not create common regional economics. Tokyo grows into a deeper load pool; Kyushu peak demand is almost flat while solar-surplus and export constraints dominate; Hokkaido gains supply capacity and interconnection but remains a small winter-peaking system. These physical differences are the official anchor for the three regional scenarios.',
          '统一的全国规则并不会产生统一的区域经济性。东京进入更深的负荷池；九州峰值需求基本持平，光伏过剩与外送约束占主导；北海道供给能力与跨区互联提升，但仍是规模较小的冬峰系统。这些物理差异是三个区域情景的官方锚点。',
        ], sig: ['Official need anchors scenarios; it does not guarantee returns', '官方需求锚定情景，但不保证回报'] },
      ] },

      { t: 'card', mt: false, title: ['Institutional Investor Walkthrough — six questions, one decision path',
                                      '机构投资人导览 — 六个问题，一条决策路径'],
        badges: ['official'], live: false, blocks: [
        { t: 'band-story', b: ['Core storyline', '核心叙事'],
          text: ['Japan gives a battery more monetization channels than any other market in this platform — day-ahead and intraday energy, five balancing products, an annual Capacity Market and a long-term decarbonization auction. That national optionality is not an underwriting argument. What decides the investment is area-price capture and grid deliverability, and those are regional. Tokyo, Kyushu and Hokkaido share one rulebook and present three different storage problems.',
                 '日本为储能提供了本平台中最多的变现渠道 — 日前与日内电能量、五类调整力品种、年度容量市场以及长期脱碳电源拍卖。但这种全国层面的可选性并不构成承销依据。真正决定投资的是区域价格兑现与电网可交付性，而二者均属区域范畴。东京、九州与北海道共享同一规则体系，却呈现三种不同的储能问题。'] },
        { t: 'walk', items: [
          ['01', ['National architecture', '全国架构'], ['Which revenue markets can a Japanese BESS access?', '日本储能可进入哪些收入市场？'], 'capacity'],
          ['02', ['Regional economics', '区域经济性'], ['Is Tokyo, Kyushu or Hokkaido the better regime for this strategy?', '就该策略而言，东京、九州还是北海道更优？'], 'energy'],
          ['03', ['Revenue durability', '收入持久性'], ['Which cash flows are secured, auction-renewed or merchant?', '哪些现金流已锁定、属拍卖续约或纯市场化？'], 'capacity'],
          ['04', ['Asset design', '资产设计'], ['What duration matches each region?', '各区域适配何种时长？'], 'duration'],
          ['05', ['Execution', '执行'], ['Can the site charge, discharge, connect and reach COD?', '场址能否充电、放电、并网并如期投运？'], 'grid'],
          ['06', ['Portfolio decision', '组合决策'], ['Which project clears the fund gates?', '哪个项目能通过基金门槛？'], 'portfolio'],
        ] },
        { t: 'why', text: ['The order matters. Japan\'s national framework is genuinely attractive and is the same everywhere, so it cannot differentiate one project from another. Every question that can actually change an investment decision is regional or site-specific, which is why this dashboard is one national rulebook with three lenses rather than three dashboards.',
                           '顺序很重要。日本的全国框架确有吸引力，但各地一致，因而无法区分项目优劣。所有真正能改变投资决策的问题都是区域性或场址性的 — 这正是本看板采用“一套全国规则、三个区域视角”而非三个独立看板的原因。'],
          sig: ['National optionality does not differentiate', '全国可选性无法构成差异'] } ] },

      // ---- national market stack (once, full width) ----
      { t: 'card', title: ['Card A — Japan national market stack', 'A卡 — 日本全国市场结构'],
        badges: ['official'], live: false, blocks: [
        { t: 'table',
          head: [['Channel', '渠道'], ['Payment', '付费方式'], ['Tenor', '期限'], ['Principal obligation', '主要义务'], ['Area-specific?', '是否区域特定']],
          rows: N.stack.map(s => [
            { b: s.n }, s.pay, s.tenor, s.obligation,
            s.areaSpecific ? { chip: 'warn', text: ['Yes — area', '是 — 按区域'] } : { chip: 'info', text: ['No — national', '否 — 全国'] },
          ]) },
        { t: 'note', b: ['Rule vintage: ', '规则版本：'],
          text: [L(N.policy.eprxVintage) + ' ' + L(N.policy.ltdaRound3),
                 L(N.policy.eprxVintage) + ' ' + L(N.policy.ltdaRound3)] },
        { t: 'why', text: ['Four of the five channels are area-specific. That single column is the whole argument for treating Tokyo, Kyushu and Hokkaido as three allocation points: the rules are identical, the prices are not.',
                           '五个渠道中有四个按区域定价。仅此一列即足以说明为何应将东京、九州与北海道视为三个独立配置点：规则相同，价格不同。'],
          sig: ['Same rules, different prices', '规则相同，价格不同'] } ] },

      // ---- regional investment signal ----
      perRegion(id => ({
        title: [L(R(id).name) + ' — investment signal', L(R(id).name) + ' — 投资信号'],
        badges: [regionBadge(id), 'calc'], live: false, blocks: [
          { t: 'chip', cls: 'info', text: R(id).thesis },
          { t: 'p', text: R(id).thesisLong },
        ],
      })),

      // ---- regional market snapshot ----
      { t: 'card', title: ['Card C — Regional market snapshot, identical KPI definitions', 'C卡 — 区域市场快照（KPI定义一致）'],
        badges: ['calc', 'illus'], live: true, blocks: [
        regionTable(['Metric', '指标'], [
          { l: ['JEPX Area Price average (¥/kWh)', 'JEPX区域价格均值（¥/kWh）'], f: id => fmt1(R(id).jepx.avgJPYkWh) },
          { l: ['P95 interval price (¥/kWh)', 'P95时段价格（¥/kWh）'], f: id => fmt1(R(id).jepx.p95JPYkWh) },
          { l: ['P05 interval price (¥/kWh)', 'P05时段价格（¥/kWh）'], f: id => fmt1(R(id).jepx.p05JPYkWh) },
          { l: ['Optimised 4h spread (¥/kWh)', '优化后4小时价差（¥/kWh）'], f: id => fmt1(R(id).jepx.optimised4hSpreadJPYkWh) },
          { l: ['Near-zero-price intervals (%)', '近零价格时段占比（%）'], f: id => fmt1(R(id).jepx.nearZeroIntervalsPct) + '%' },
          { l: ['Basis to System Price (¥/kWh)', '相对系统价格的价差（¥/kWh）'], f: id => fmt1(R(id).jepx.basisToSystemJPYkWh) },
          { l: ['Market-split hours (%)', '市场分割小时占比（%）'], f: id => fmt1(R(id).jepx.marketSplitHoursPct) + '%' },
          { l: ['Verified curtailment days', '已核验弃电天数'], f: id => R(id).curtailment.totalDays + ' (' + L(R(id).curtailment.window) + ')' },
        ]),
        { t: 'why', text: ['Kyushu has the widest optimised spread and the most near-zero intervals — solar surplus is a charging opportunity before it is a curtailment problem. Hokkaido splits from the system price most often, which is the price signature of an export constraint. Tokyo is the tightest and most liquid, which is worth less to an arbitrage battery than it sounds.',
                           '九州的优化价差最宽、近零价格时段最多 — 光伏过剩首先是充电机会，其次才是弃电问题。北海道与系统价格分离最频繁，这正是外送受限的价格特征。东京最紧俏、流动性最好，但对套利型储能而言其价值不如表面看来那么高。'],
          sig: ['Wide spread beats high average', '宽价差优于高均价'] } ] },

      // ---- capacity + duration + grid summary ----
      { t: 'card', title: ['Card D — Capacity Market, delivery year ' + O.cmDeliveryYear, 'D卡 — 容量市场，' + O.cmDeliveryYear + '实需年度'],
        badges: ['official'], live: false, src: SRC.occtoCm2029,
        srcUse: ['Area clearing price and contracted capacity by area', '各区域出清价与已签约容量'], blocks: [
        { t: 'table',
          head: [['Area', '区域'], ['Area price (¥/kW/yr)', '区域价格（¥/kW/年）'], ['Contracted capacity (kW)', '已签约容量（kW）']],
          num: [1, 2],
          rows: N.capacity2029.areas.map(a => [{ b: a.n }, fmtN(a.priceJPYkW), fmtN(a.contractedKW)]) },
        { t: 'cap', text: N.capacity2029.note },
        { t: 'why', text: ['The three prices sit within about 0.9% of each other. Anyone differentiating Japanese regions on capacity price alone is differentiating on noise — the spread that matters comes from wholesale capture, curtailment, balancing saturation and grid access, which is what the rest of this dashboard measures.',
                           '三个区域价格相差约0.9%。仅凭容量价格区分日本各区域，实为在噪声上做区分 — 真正的差异来自现货捕获、弃电、调整力饱和与并网条件，而这正是本看板其余部分所度量的对象。'],
          sig: ['Capacity price is not the differentiator', '容量价格不是差异来源'] } ] },

      { t: 'card', title: ['Card F — Grid and connection at a glance', 'F卡 — 并网条件一览'],
        badges: ['official'], live: false, blocks: [
        regionTable(['Metric', '指标'], [
          { l: ['TSO', '电网运营商'], f: id => L(R(id).tso) },
          { l: ['Concurrent study cap from 1 Aug 2026', '2026年8月1日起并发检讨上限'], f: id => String(R(id).grid.studyCap) },
          { l: ['Regional constraint focus', '区域约束重点'], f: id => L(R(id).grid.constraint) },
        ]),
        { t: 'why', text: ['The study cap is a real allocation constraint, not an administrative detail. Hokkaido allows five concurrent studies per operator against Tokyo\'s eleven, in the region with the largest connection queue relative to operating stock. A developer\'s ability to hold optionality is materially narrower there.',
                           '并发检讨上限是真实的配置约束，而非行政细节。北海道每家业者仅允许5项并发检讨，而东京为11项 — 且北海道的并网队列相对在运容量的比例最高。开发商在该区域持有选择权的能力显著受限。'],
          sig: ['Five slots is a portfolio constraint', '五个名额构成组合约束'] } ] },

      seedGate,
    ] };
  };

  // ============================== STORY ==============================

  return SEC_B.home;
}
