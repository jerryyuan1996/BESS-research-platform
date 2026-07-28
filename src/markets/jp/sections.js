/* ---------------------------------------------------------------------------
   Japan — declarative section specs, 12 tabs, three regional lenses.

   The rule this file exists to enforce: national mechanics appear ONCE. The
   Capacity Market, LTDA and balancing-product rules are rendered full width
   regardless of lens; only blocks whose data genuinely differs by area are
   repeated per region.

   `lensRegions()` returns all three regions in compare mode and just the selected
   one otherwise, so `perRegion()` produces a three-column comparison or a single
   expanded block from the same spec.
   --------------------------------------------------------------------------- */

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    compositeScore, liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;

  const O = M.official;
  const N = M.national;
  const RG = M.regions;

  // ---- helpers ----------------------------------------------------------
  const R = (id) => RG[id];
  const path = (id, key) => 'regions.' + id + '.' + key;
  const jpy = (v) => '¥' + fmtN(v);
  const jpyM = (v) => '¥' + fmt1(v / 1e6) + 'M';

  /** Card body per region: three columns in compare mode, one expanded otherwise. */
  function perRegion(makeCard){
    const rs = lensRegions();
    if (rs.length === 1) return Object.assign({ t: 'card' }, makeCard(rs[0]));
    return { t: 'g3', cards: rs.map(makeCard) };
  }

  /** A three-column table with one column per region in view. */
  function regionTable(headLabel, rows){
    const rs = lensRegions();
    return {
      t: 'table',
      head: [headLabel].concat(rs.map(id => L(R(id).short))),
      num: rs.map((_, i) => i + 1),
      rows: rows.map(r => [r.l].concat(rs.map(id => r.f(id)))),
    };
  }

  const regionBadge = (id) => ({
    tokyo: 'jp-tokyo', kyushu: 'jp-kyushu', hokkaido: 'jp-hokkaido',
  })[id];

  const lensNote = () => (isCompare()
    ? { t: 'sub', text: ['Comparing all three regions. National rules are shown once, at full width.',
                         '正在对比三个区域。全国性规则仅完整显示一次。'] }
    : { t: 'sub', text: [L(R(region()).area) + ' lens — national context stays visible below.',
                         L(R(region()).area) + '视角 — 下方仍保留全国背景。'] });

  const seedGate = {
    t: 'warn',
    text: ['Economics on this page are illustrative seed. Structural facts — Capacity Market prices, curtailment days, study caps, interconnector capacity — are verified against the cited sources; capex, merchant margin, incremental balancing value, the expected-capacity factor and the auction-renewal curve are not. See Data & Methodology for the ETL gates.',
           '本页经济性数值为示例种子。结构性事实 — 容量市场价格、弃电天数、并网检讨上限、联络线容量 — 已对照所引来源核验；造价、市场化收益、调整力增量价值、期待容量系数及拍卖续约曲线尚未核验。ETL门槛见“数据与方法”页。'],
  };

  // =======================================================================
  const SEC_B = {};
  function SECTIONS(){
    const o = {};
    Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
    return o;
  }

  // ============================== OVERVIEW ==============================
  SEC_B.home = function (){
    return {
    warn: M.seedWarn,
    blocks: [
      lensNote(),
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
          text: [L(N.policy.eprxVintage) + ' ' + L(N.policy.ltdaConsultation),
                 L(N.policy.eprxVintage) + ' ' + L(N.policy.ltdaConsultation)] },
        { t: 'why', text: ['Four of the five channels are area-specific. That single column is the whole argument for treating Tokyo, Kyushu and Hokkaido as three allocation points: the rules are identical, the prices are not.',
                           '五个渠道中有四个按区域定价。仅此一列即足以说明为何应将东京、九州与北海道视为三个独立配置点：规则相同，价格不同。'],
          sig: ['Same rules, different prices', '规则相同，价格不同'] } ] },

      // ---- regional investment signal ----
      perRegion(id => ({
        title: [L(R(id).name) + ' — investment signal', L(R(id).name) + ' — 投资信号'],
        badges: [regionBadge(id), 'calc'], live: false, blocks: [
          { t: 'chip', cls: 'info', text: R(id).thesis },
          { t: 'kpis', items: [
            { l: ['Composite score', '综合评分'], v: compositeScore(path(id, 'components')) + ' / 100' },
            { l: ['Connection risk (lower = safer)', '并网风险（越低越安全）'], v: liveScore(path(id, 'connFactors')) + ' / 100' },
          ] },
          { t: 'meter', pct: compositeScore(path(id, 'components')), color: id === 'tokyo' ? 's7' : id === 'kyushu' ? 's8' : 's4' },
          { t: 'scores', items: R(id).components, max: 100 },
          { t: 'p', text: R(id).thesisLong },
        ],
      })),
      { t: 'why', text: ['The weights differ by region on purpose — Tokyo is scored most heavily on arbitrage and deliverability, Kyushu on solar-surplus charging and curtailment, Hokkaido on grid access and balancing saturation. Never hide the weights: a composite is only meaningful if the reader can see what it rewards.',
                         '各区域权重刻意不同 — 东京侧重套利与可交付性，九州侧重光伏过剩充电与弃电，北海道侧重并网条件与调整力饱和。权重绝不隐藏：只有读者能看到评分奖励什么，综合分才有意义。'],
        sig: ['Weights are part of the answer', '权重本身即结论的一部分'] },

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
          { l: ['Connection risk score', '并网风险评分'], f: id => liveScore(path(id, 'connFactors')) + ' / 100' },
        ]),
        { t: 'why', text: ['The study cap is a real allocation constraint, not an administrative detail. Hokkaido allows five concurrent studies per operator against Tokyo\'s eleven, in the region with the largest connection queue relative to operating stock. A developer\'s ability to hold optionality is materially narrower there.',
                           '并发检讨上限是真实的配置约束，而非行政细节。北海道每家业者仅允许5项并发检讨，而东京为11项 — 且北海道的并网队列相对在运容量的比例最高。开发商在该区域持有选择权的能力显著受限。'],
          sig: ['Five slots is a portfolio constraint', '五个名额构成组合约束'] } ] },

      seedGate,
    ] };
  };

  // ============================== STORY ==============================
  SEC_B.story = function (){
    return {
    head: ['Japan Market Story — one national timeline, three regional divergences',
           '日本市场演进 — 一条全国时间轴，三种区域分化'],
    cap: ['National mechanisms arrived in a sequence that applies everywhere. What differs is what each region needed storage FOR by the time they arrived.',
          '全国性机制按同一顺序落地、各地适用。差异在于机制落地时，各区域究竟需要储能来解决什么问题。'],
    blocks: [
      lensNote(),
      { t: 'card', mt: false, title: ['National timeline', '全国时间轴'], badges: ['public'], live: false, blocks: [
        { t: 'timeline', items: [
          { y: '2005', t: ['JEPX opens', 'JEPX成立'], p: ['A wholesale exchange exists, but liquidity and price formation stay thin for years.', '批发交易所成立，但流动性与价格形成在此后多年仍较薄弱。'],
            i: ['No storage case yet — there is no spread to monetize.', '尚无储能投资逻辑 — 不存在可变现的价差。'] },
          { y: '2012', t: ['FIT drives the solar build', 'FIT推动光伏建设'], p: ['Feed-in tariffs produce a large, concentrated solar fleet, heaviest in Kyushu.', '固定电价制度催生大规模、集中的光伏装机，以九州最为集中。'],
            i: ['The surplus that later creates charging value starts here.', '日后形成充电价值的电力过剩自此开始。'] },
          { y: '2018', t: ['Kyushu output control begins', '九州开始出力抑制'], p: ['The first sustained renewable curtailment in mainland Japan.', '日本本土首次持续性新能源弃电。'],
            i: ['System need is proven. Project revenue is not.', '系统需求得到证明，但项目收入并未证明。'] },
          { y: '2020', t: ['Capacity Market first auction', '容量市场首次拍卖'], p: ['OCCTO runs the first main auction; area prices become a distinct revenue line.', 'OCCTO举行首次主拍卖；区域价格成为独立收入项。'],
            i: ['A capacity line appears — but it is won one delivery year at a time.', '容量收入线出现 — 但每次仅锁定一个实需年度。'] },
          { y: '2021', t: ['Balancing Market launches', '需给调整市场启动'], p: ['Products phase in; the full product set follows over the following years.', '各品种分阶段引入，完整品种体系于其后数年建立。'],
            i: ['A second merchant channel, and the first saturation risk.', '第二条市场化渠道出现，同时带来首个饱和风险。'] },
          { y: '2023', t: ['LTDA introduced', '长期脱碳电源拍卖引入'], p: ['A long-term fixed capacity payment becomes available, with other-market revenue sharing.', '长期固定容量付费成为可能，同时附带其他市场收入分享机制。'],
            i: ['The first genuinely long contract — but project-specific, not a market benchmark.', '首个真正意义上的长期合同 — 但属项目层面，而非市场基准。'] },
          { y: '2026', t: ['Connection discipline tightens', '并网管理收紧'], p: ['All three TSOs cap concurrent studies from 1 August; Tokyo records verified curtailment for the first time at scale.', '三家电网运营商自8月1日起设定并发检讨上限；东京首次出现规模化的已核验弃电。'],
            i: ['Grid access, not market access, becomes the binding constraint.', '约束条件从市场准入转为电网接入。'] },
        ] },
        { t: 'why', text: ['Japan added revenue channels faster than it added grid capacity. Every mechanism on this timeline is national and available to every project; the 2026 entries are the first that ration by region. That inversion — from "can I earn?" to "can I connect?" — is the transition this platform is built to price.',
                           '日本增加收入渠道的速度快于增加电网容量。时间轴上每项机制都是全国性、对所有项目开放的；唯有2026年的条目开始按区域配给。这一转折 — 从“能否赚钱”转为“能否并网” — 正是本平台旨在定价的过渡。'],
          sig: ['Grid access is now the binding constraint', '电网接入已成约束条件'] } ] },

      { t: 'card', title: ['Regional divergence — three lanes', '区域分化 — 三条路径'], badges: ['calc'], live: false, blocks: [
        { t: 'flow', items: [['Load depth', '负荷深度'], ['Scarcity / basis', '稀缺性/价差'], ['Growing output control', '出力抑制上升'], ['Tighter connection discipline', '并网管理收紧']], sep: '→' },
        { t: 'sub', text: ['Tokyo', '东京'] },
        { t: 'flow', items: [['Solar buildout', '光伏建设'], ['Chronic surplus', '长期过剩'], ['Transfer solutions', '外送方案'], ['Charging value + cannibalisation risk', '充电价值与收益蚕食风险']], sep: '→' },
        { t: 'sub', text: ['Kyushu', '九州'] },
        { t: 'flow', items: [['Wind / solar resource', '风光资源'], ['Output control + export bottleneck', '出力抑制与外送瓶颈'], ['Charging-side congestion', '充电侧拥塞'], ['Interconnector + balancing saturation', '联络线与调整力饱和']], sep: '→' },
        { t: 'sub', text: ['Hokkaido', '北海道'] },
        { t: 'why', text: ['The three lanes converge on the same word — saturation — by different routes. Tokyo saturates on connection slots, Kyushu on batteries chasing the same curtailment windows, Hokkaido on both at once plus an export limit. An allocator holding all three is not diversified against that; they are diversified against the timing of it.',
                           '三条路径经由不同途径汇向同一个词 — 饱和。东京在并网名额上饱和，九州在争夺同一弃电窗口的储能上饱和，北海道则两者兼有并叠加外送限制。同时持有三者的配置者并未分散该风险，而是分散了其发生时点。'],
          sig: ['Diversified on timing, not on risk', '分散的是时点而非风险'] } ] },

      { t: 'card', title: ['What breaks the thesis', '什么会推翻投资逻辑'], badges: ['calc'], live: false, blocks: [
        { t: 'list', items: [
          [['Capacity Market prices fall as storage enters the auction', '随储能进入拍卖，容量市场价格下跌'], ['The renewal curve in this model already assumes decline; a faster fall removes the floor.', '本模型的续约曲线已假设下降；下跌更快将移除保底。']],
          [['Grid reinforcement removes the curtailment that creates charging value', '电网强化消除了创造充电价值的弃电'], ['Kyushu\'s expanded transfer-trip system is exactly this risk, already in operation.', '九州扩容后的转移跳闸系统正是该风险，且已投运。']],
          [['Balancing markets saturate faster than volumes grow', '调整力市场饱和快于交易量增长'], ['Hokkaido is the leading indicator: >0.2 GW registering against a small requirement.', '北海道是先行指标：注册容量超0.2GW，而需求规模较小。']],
          [['Charging access is restricted where export capacity was the assumed constraint', '在以外送为假设约束之处，充电接入反受限制'], ['HEPCO\'s charging-control framework covers 27 specified systems.', '北海道电力网络的充电控制机制覆盖27个指定系统。']],
        ] },
        { t: 'why', text: ['Three of these four are already observable, not hypothetical. That is unusual: most market theses break on events that have not happened yet. Here the mechanisms that compress returns are already in operation, which makes the timing question — how fast — more important than the direction question.',
                           '四项中已有三项可观察到，而非假设。这较为罕见：多数市场逻辑的破裂源于尚未发生的事件。此处压缩回报的机制均已运行，因此“多快”的时点问题比“方向”问题更为关键。'],
          sig: ['The downside mechanisms are already running', '下行机制已在运行'] } ] },
    ] };
  };

  // ============================== CAPACITY & LTDA ==============================
  SEC_B.capacity = function (){
    return {
    head: ['Capacity Market & LTDA — two mechanisms, one national framework',
           '容量市场与长期脱碳拍卖 — 两个机制，同一全国框架'],
    cap: ['Both are national. Only the Capacity Market clears by area, and only for one delivery year at a time — which is why this platform classifies its payment as secured for one year and everything after as auction-renewal.',
          '二者均为全国机制。仅容量市场按区域出清，且每次仅覆盖一个实需年度 — 因此本平台将其付费归类为“锁定一年”，其后年份归类为“拍卖续约”。'],
    blocks: [
      { t: 'card', mt: false, title: ['Capacity Market architecture', '容量市场架构'], badges: ['official'], live: false,
        src: SRC.occtoCm2029, srcUse: ['Delivery-year 2029 main auction result', '2029实需年度主拍卖结果'], blocks: [
        { t: 'flow', items: [['Main auction', '主拍卖'], ['Capacity Securing Contract', '容量确保合同'], ['Delivery year', '实需年度'], ['Availability obligation', '可用性义务'], ['Payment / penalty', '付费/罚则']] },
        { t: 'table',
          head: [['Area', '区域'], ['2029 area price (¥/kW/yr)', '2029区域价格（¥/kW/年）'], ['Contracted (kW)', '已签约（kW）'], ['Share of set', '占样本比重']],
          num: [1, 2, 3],
          rows: N.capacity2029.areas.map(a => {
            const tot = N.capacity2029.areas.reduce((s, x) => s + x.contractedKW, 0);
            return [{ b: a.n }, fmtN(a.priceJPYkW), fmtN(a.contractedKW), fmtPct(a.contractedKW / tot * 100, 0)];
          }) },
        { t: 'why', text: ['Tokyo contracts nearly ten times Hokkaido\'s capacity at a price 0.9% higher. Area price is set by area requirement against area supply, and in a well-supplied national system that converges. The revenue difference between Japanese regions therefore has to be earned in the energy and balancing markets, not collected from the capacity auction.',
                           '东京签约容量接近北海道的十倍，价格却仅高出0.9%。区域价格由区域需求与区域供给决定，在全国供应充足的系统中二者趋于收敛。因此日本各区域间的收入差异必须在电能量与调整力市场中赚取，而非从容量拍卖中获得。'],
          sig: ['Converged price, divergent requirement', '价格收敛，需求分化'] } ] },

      { t: 'card', title: ['Revenue classification — the distinction that changes the valuation',
                           '收入分类 — 决定估值的关键区分'],
        badges: ['calc'], live: false, blocks: [
        { t: 'table',
          head: [['Class', '类别'], ['Definition', '定义']],
          rows: N.revenueClasses.map(c => [{ b: c.n }, c.d]) },
        { t: 'kpis', items: [
          { l: ['Secured tenor, Capacity Market main auction', '容量市场主拍卖锁定年限'], v: '1 ' + L(['yr', '年']) },
          { l: ['Expected-capacity factor applied, 4h', '4小时期待容量系数'], v: fmtPct(O.expectedCapacityFactor * 100, 0), b: ['illus'] },
          { l: ['Renewal assumption, yr 2 → yr 15', '续约假设，第2年→第15年'], v: '90% → 60%', b: ['illus'] },
        ] },
        { t: 'why', text: ['This is the most important modelling decision in the Japan build. A one-year capacity award discounted at the contracted exit yield would value Japan like Poland\'s 17-year contract. Splitting the stream means the secured year is priced as contracted cash flow and years 2 to 15 are priced as market risk — which is what they are.',
                           '这是日本建模中最重要的决策。若将一年期容量中标按合同折现率贴现，日本的估值将等同于波兰的17年合同。将收入流拆分后，锁定年份按合同现金流定价，第2至15年按市场风险定价 — 这才符合其本质。'],
          sig: ['One-year award ≠ long-term contract', '一年中标≠长期合同'] } ] },

      { t: 'card', title: ['LTDA — long-term decarbonization auction', '长期脱碳电源拍卖'],
        badges: ['consult'], live: false, src: SRC.occtoLtda2026,
        srcUse: ['FY2026 solicitation, in consultation', 'FY2026募集文件，征询阶段'], blocks: [
        { t: 'note', b: ['Status: ', '状态：'], text: N.policy.ltdaConsultation },
        { t: 'list', items: [
          [['Fixed long-term capacity payment', '固定长期容量付费'], ['The only genuinely long contract available to a Japanese battery.', '日本储能可获得的唯一真正长期合同。']],
          [['Other-market revenue sharing applies', '适用其他市场收入分享'], ['Headline award cannot be added to full JEPX and balancing revenue — a share is returned.', '中标金额不可与完整的JEPX及调整力收入直接相加 — 部分须返还。']],
          [['Project-specific, not a market benchmark', '属项目层面，非市场基准'], ['An award is won by a project, so it does not describe the market a new entrant faces.', '中标由具体项目取得，因而不能描述新进入者所面对的市场。']],
        ] },
        { t: 'warn', text: ['LTDA is deliberately excluded from this platform\'s base case for all three Japan regions. Adding a headline award to full merchant revenue would double count, and assuming every project wins one would misdescribe the market. The route is declared in the comparison engine and stays "N/A" until a representative scenario is loaded.',
                            '本平台三个日本区域的基准情景均刻意不含长期脱碳电源拍卖。将中标金额与完整市场化收入相加会造成重复计算，而假设所有项目均能中标则会错误描述市场。该路径已在对比引擎中声明，在载入代表性情景前始终显示“N/A”。'] },
        { t: 'why', text: ['The temptation with LTDA is obvious: it is the one Japanese mechanism that produces a bankable long-dated cash flow, and including it would lift every Japanese IRR on this platform. That is exactly why it is excluded from the benchmark. A market comparison has to describe what a new entrant faces, not what a winner received.',
                           '长期脱碳电源拍卖的诱惑显而易见：它是日本唯一能产生可融资长期现金流的机制，纳入后将抬升本平台所有日本市场的IRR。这恰是将其排除在基准之外的理由。市场对比必须描述新进入者所面对的情形，而非中标者所获得的结果。'],
          sig: ['Exclude the winner\'s contract from the market case', '中标者的合同不应计入市场基准'] } ] },
    ] };
  };

  // ============================== JEPX ENERGY ==============================
  SEC_B.energy = function (){
    const rs = lensRegions();
    return {
    head: ['JEPX Energy & Regional Basis', 'JEPX现货与区域价差'],
    cap: ['Never use the System Price as a proxy for a regional project. Every figure here is an Area Price.',
          '绝不可用系统价格替代区域项目的价格。此处所有数值均为区域价格。'],
    blocks: [
      lensNote(),
      { t: 'card', mt: false, title: ['Area price shape and optimised spread', '区域价格形态与优化价差'],
        badges: ['calc', 'illus'], live: true, src: SRC.jepx,
        srcUse: ['30-minute Area Price by area', '各区域30分钟区域价格'], blocks: [
        { t: 'bar', cfg: {
          xs: rs.map(id => L(R(id).short)),
          mode: 'group', h: 260, yfmt: v => fmt1(v) + ' ¥/kWh',
          series: [
            { name: ['P05 (charging window)', 'P05（充电窗口）'], color: 'var(--s2)', vals: rs.map(id => R(id).jepx.p05JPYkWh) },
            { name: ['Average', '均值'], color: 'var(--s1)', vals: rs.map(id => R(id).jepx.avgJPYkWh) },
            { name: ['P95 (discharge window)', 'P95（放电窗口）'], color: 'var(--s6)', vals: rs.map(id => R(id).jepx.p95JPYkWh) },
          ] } },
        { t: 'why', text: ['A battery is paid for the gap between the second and first bars, not for the height of the middle one. Kyushu has the lowest average price in the set and the widest usable gap; Tokyo has the highest average and a narrower one. Average area price is close to irrelevant as an investment signal.',
                           '储能的收益来自第二根柱与第一根柱之间的差值，而非中间柱的高度。九州平均价格为样本最低，但可用价差最宽；东京均价最高，价差却较窄。区域平均价格作为投资信号几乎不具参考意义。'],
          sig: ['Paid for the gap, not the level', '收益来自价差而非价格水平'] } ] },

      { t: 'card', title: ['Basis and market splitting', '价差与市场分割'], badges: ['calc', 'illus'], live: true, blocks: [
        regionTable(['Metric', '指标'], [
          { l: ['Basis to System Price (¥/kWh)', '相对系统价格价差（¥/kWh）'], f: id => fmt1(R(id).jepx.basisToSystemJPYkWh) },
          { l: ['Market-split hours (%)', '市场分割小时占比（%）'], f: id => fmt1(R(id).jepx.marketSplitHoursPct) + '%' },
          { l: ['Near-zero-price intervals (%)', '近零价格时段占比（%）'], f: id => fmt1(R(id).jepx.nearZeroIntervalsPct) + '%' },
        ]),
        { t: 'why', text: ['Market splitting is how an export constraint shows up in a price series. Hokkaido splits from the system price for roughly a third of hours, Kyushu for a quarter, Tokyo for an eighth. That ordering is the same as the interconnector-constraint ordering, and it is the reason a national price forecast cannot underwrite a regional battery.',
                           '市场分割是外送约束在价格序列中的表现方式。北海道约三分之一小时与系统价格分离，九州约四分之一，东京约八分之一。该排序与联络线约束程度的排序一致，也正是全国价格预测无法为区域储能提供承销依据的原因。'],
          sig: ['Splitting frequency ranks the constraint', '分割频率反映约束强度'] } ] },

      { t: 'card', title: ['Curtailment overlap with the charging window', '弃电与充电窗口的重叠'],
        badges: ['official'], live: false, blocks: [
        { t: 'bar', cfg: {
          xs: rs.map(id => L(R(id).short)),
          mode: 'group', h: 240, labels: true, yfmt: v => fmtN(v) + ' d',
          series: [{ name: ['Verified curtailment days', '已核验弃电天数'], color: 'var(--s3)', vals: rs.map(id => R(id).curtailment.totalDays) }] } },
        { t: 'cap', text: ['Tokyo and Hokkaido: Mar–May 2026. Kyushu: Jan–Mar 2026. Windows differ because that is what the cited OCCTO verifications cover — do not annualise these figures.',
                           '东京与北海道为2026年3–5月，九州为2026年1–3月。时间窗口不同是因为所引OCCTO核验数据覆盖期不同 — 不得据此年化。'] },
        { t: 'why', text: ['Curtailment is a price effect for a battery, never a payment. It matters only where the low-price hours it creates overlap hours the asset can actually import. That is a site question, not a regional one, which is why the connection tab separates import capability from export capability.',
                           '对储能而言弃电是价格效应，而非收入。只有当其造成的低价时段与资产实际可充电的时段重叠时才具意义。这是场址问题而非区域问题 — 因此并网页将充电能力与放电能力分开评估。'],
          sig: ['Overlap, not incidence', '重叠度而非发生率'] } ] },
    ] };
  };

  // ============================== BALANCING ==============================
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
  SEC_B.duration = function (){
    const cy = state.codYear;
    return {
    head: ['Storage Duration — one methodology, three regional scorecards', '储能时长 — 一套方法，三份区域评分'],
    cap: ['Frequent curtailment does not automatically justify longer duration. Each incremental MWh must have identifiable repeatable value or contract value.',
          '频繁弃电并不自动构成延长时长的理由。每一增量MWh都必须具备可识别、可重复的价值或合同价值。'],
    blocks: [
      lensNote(),
      { t: 'card', mt: false, title: ['Reference duration path', '参考时长路径'], badges: ['calc'], live: false, blocks: [
        { t: 'kpis', items: [
          { l: ['Reference duration at COD ' + cy, cy + '投运参考时长'], v: fmt1(durationAt(cy)) + ' h' },
          { l: ['Expected-capacity factor at that duration', '该时长下的期待容量系数'], v: fmtPct(interp(M.deratingCurve, durationAt(cy)) * 100, 0), b: ['illus'] },
          { l: ['Merchant spread factor at that duration', '该时长下的价差系数'], v: fmt1(interp(M.durSpreadFactor, durationAt(cy))) + '×', b: ['illus'] },
        ] },
        { t: 'why', text: ['The two curves pull in opposite directions and that is the whole duration question. Longer duration raises the capacity payment through expected capacity and lowers the merchant margin per MWh because the spread thins. Four hours is where they cross for the reference asset — which is why every market on this platform is compared at its own archetype rather than at a common duration.',
                           '两条曲线方向相反，这正是时长问题的本质。延长时长通过期待容量提高容量付费，同时因价差变薄而降低每MWh的市场化收益。对参考资产而言，两者在4小时处交叉 — 这也是本平台各市场按各自原型而非统一时长对比的原因。'],
          sig: ['Capacity up, spread down', '容量升，价差降'] } ] },

      perRegion(id => ({
        title: [L(R(id).short) + ' — duration need index', L(R(id).short) + ' — 时长需求指数'],
        badges: [regionBadge(id), 'calc'], live: true, blocks: [
          { t: 'scorecard', id: path(id, 'durFactors'), bands: 'durBands' },
        ],
      })),
      { t: 'why', text: ['Kyushu and Hokkaido score higher on duration need than Tokyo, driven by the charging-window and curtailment factors. But the scorecard measures need, not payment: neither market has a mechanism that pays for hours the way a long-duration contract would. Where need is high and payment is not, the correct response is to build to the merchant-optimal duration and keep augmentation optionality, not to build long.',
                         '九州与北海道的时长需求评分高于东京，主要由充电窗口与弃电因子驱动。但评分衡量的是需求而非付费：两地均无类似长时合同那样为小时数付费的机制。在需求高而付费缺失之处，正确做法是按市场化最优时长建设并保留增容选择权，而非直接建长时。'],
        sig: ['High need, no mechanism that pays for hours', '需求高，但无为小时付费的机制'] },

      { t: 'card', title: ['Augmentation readiness', '增容准备度'], badges: ['illus'], live: true, blocks: [
        { t: 'aug' },
        { t: 'why', text: ['Augmentation optionality is worth more in Japan than in most markets on this platform, because the duration answer is genuinely uncertain: the expected-capacity treatment can be revised between auction vintages, and the merchant-optimal duration moves with how much storage enters. Optionality is the correct response to a moving target.',
                           '在本平台各市场中，增容选择权在日本的价值更高，因为时长的答案确实不确定：期待容量的处理方式可能在不同拍卖年份间修订，而市场化最优时长也随储能进入规模变化。面对移动的目标，选择权是正确的应对。'],
          sig: ['Optionality beats a duration bet', '选择权优于时长押注'] } ] },
    ] };
  };

  // ============================== PIPELINE ==============================
  SEC_B.pipeline = function (){
    const rs = lensRegions();
    return {
    head: ['Project Pipeline — one register, region column', '项目管线 — 单一登记表，区域分列'],
    cap: ['Only source-supported MW/MWh and stage enter the register. Where public sources do not disclose capacity precisely enough, the project is listed without invented figures.',
          '仅有来源支持的MW/MWh与阶段方可进入登记表。公开来源未充分披露容量的项目，仅列示名称而不虚构数据。'],
    blocks: [
      { t: 'card', mt: false, title: ['Pipeline by COD year', '按投运年度的管线'], badges: ['public', 'illus'], live: true, blocks: [
        { t: 'pipeChart', unit: 'MW', series: rs.map(id => ({ region: id, name: R(id).short, color: R(id).color })) },
        { t: 'cap', text: ['Probability-weighted using the common stage taxonomy below.', '采用下方通用阶段分类进行概率加权。'] },
        { t: 'stageProb' } ] },

      { t: 'card', title: ['Register — source-supported figures only', '登记表 — 仅含来源支持的数据'],
        badges: ['public'], live: true, blocks: [
        { t: 'projTable' },
        { t: 'warn', text: ['This register is deliberately thin. Several named Japanese BESS projects are public but do not disclose MW/MWh and stage precisely enough to fit the common taxonomy; they are listed below without figures rather than padded into the chart above. Treat the register as a floor, not as the market.',
                            '本登记表刻意保持精简。若干已公开的日本储能项目并未充分披露MW/MWh及阶段，无法纳入通用分类；这些项目在下方仅列名称而不填充至上方图表。请将本表视为下限而非市场全貌。'] },
        { t: 'table',
          head: [['Named project', '具名项目'], ['Region', '区域'], ['Sponsor', '发起方'], ['Capacity disclosed?', '是否披露容量']],
          rows: M.namedPipeline.map(p => [
            { b: p.n }, L(R(p.region).short), p.sponsor,
            { chip: 'warn', text: ['Not to taxonomy standard', '未达分类标准'] },
          ]) } ] },

      { t: 'card', title: ['Saturation signals — the better pipeline measure today', '饱和信号 — 当前更可靠的管线度量'],
        badges: ['official'], live: false, src: SRC.hepcoBalancing,
        srcUse: ['Hokkaido balancing registration and connection-contract queue', '北海道调整力注册与并网合同队列'], blocks: [
        regionTable(['Signal', '信号'], [
          { l: ['Pipeline / operating ratio', '管线对在运倍数'], f: id => R(id).saturation.pipelineRatio },
          { l: ['Concurrent study cap', '并发检讨上限'], f: id => String(R(id).grid.studyCap) },
          { l: ['Queue signal', '队列信号'], f: id => L(R(id).saturation.signal) },
        ]),
        { t: 'why', text: ['For Hokkaido the queue is the pipeline: roughly 2 GW of connection-contract applications against a small operating stock, and more than 0.2 GW expected to register for the balancing market in FY2026. A named-project register would understate that by an order of magnitude. Where the register is thin, use the queue.',
                           '对北海道而言，队列即管线：约2GW并网合同申请对应极小的在运容量，且预计FY2026将有超过0.2GW注册进入调整力市场。具名项目登记表会将其低估一个数量级。登记表稀疏之处，应改用队列数据。'],
          sig: ['Where the register is thin, use the queue', '登记表稀疏时改用队列'] } ] },
    ] };
  };

  // ============================== GRID ==============================
  SEC_B.grid = function (){
    return {
    head: ['Grid & Connection — export MW ≠ import MW', '并网与电网约束 — 放电MW ≠ 充电MW'],
    cap: ['A battery permitted to discharge 50 MW is not automatically permitted to charge 50 MW from the grid. The two are separately evidenced throughout.',
          '获准放电50MW的储能并不自动获准从电网充电50MW。全篇对二者分别取证。'],
    blocks: [
      lensNote(),
      { t: 'card', mt: false, title: ['Comparison strip', '对比条'], badges: ['official'], live: false, blocks: [
        regionTable(['Topic', '主题'], [
          { l: ['TSO', '电网运营商'], f: id => L(R(id).tso) },
          { l: ['Study cap from 1 Aug 2026', '2026年8月1日起检讨上限'], f: id => String(R(id).grid.studyCap) },
          { l: ['Core constraint', '核心约束'], f: id => L(R(id).grid.constraint) },
          { l: ['First construction-cost contribution', '首期工程费负担金'],
            f: id => R(id).grid.firstContributionPct ? '≥' + R(id).grid.firstContributionPct + '%' : L(['Verify current terms', '须核验现行条款']) },
          { l: ['Connection deposit', '并网保证金'],
            f: id => R(id).grid.depositPct ? R(id).grid.depositPct + '%' : L(['Not published', '未公布']) },
        ]),
        { t: 'why', text: ['Study caps are the cleanest cross-regional comparison in this whole dashboard because all three TSOs set them on the same date under the same policy direction. Eleven, eight and five is a direct statement about how much development optionality each region will allow one operator to hold.',
                           '并发检讨上限是本看板中最干净的跨区域对比，因为三家电网运营商在同一日期、依据同一政策方向设定。11、8、5三个数字直接说明了各区域允许单一业者持有多少开发选择权。'],
          sig: ['11 / 8 / 5 is an optionality ranking', '11/8/5即选择权排序'] } ] },

      perRegion(id => ({
        title: [L(R(id).short) + ' — connection risk', L(R(id).short) + ' — 并网风险'],
        badges: [regionBadge(id), 'calc'], live: true, blocks: [
          { t: 'scorecard', id: path(id, 'connFactors'), bands: 'connBands' },
        ],
      })),

      { t: 'card', title: ['Region-specific connection conditions', '区域特定并网条件'], badges: ['official'], live: false, blocks: [
        { t: 'sub', text: ['Tokyo — TEPCO Power Grid', '东京 — 东京电力电网'] },
        { t: 'list', items: [
          [['11 concurrent studies per operator from 1 Aug 2026', '自2026年8月1日起每家业者11项并发检讨'], null],
          [['10% connection deposit; first construction-cost contribution ≥50% for applications from 1 Apr 2026', '并网保证金10%；2026年4月1日起申请的首期工程费负担金≥50%'], null],
          [['Verified output control on 20 days, Mar–May 2026', '2026年3–5月已核验弃电20天'], null],
        ] },
        { t: 'sub', text: ['Kyushu — Kyushu Electric Power T&D', '九州 — 九州电力输配电'] },
        { t: 'list', items: [
          [['8 concurrent studies per operator from 1 Aug 2026', '自2026年8月1日起每家业者8项并发检讨'], null],
          [['Expanded transfer-trip system in operation from 1 Apr 2026 — raises Kanmon export, expected to reduce curtailment', '扩容转移跳闸系统自2026年4月1日投运 — 提升关门断面外送，预计减少弃电'], null],
          [['Verified output control on 50 days, Jan–Mar 2026', '2026年1–3月已核验弃电50天'], null],
        ] },
        { t: 'sub', text: ['Hokkaido — HEPCO Network', '北海道 — 北海道电力网络'] },
        { t: 'list', items: [
          [['5 concurrent studies per operator from 1 Aug 2026 — the tightest in the set', '自2026年8月1日起每家业者5项并发检讨 — 为样本中最严'], null],
          [['Charging-control early-connection scheme covered 27 specified systems as of 10 Apr 2026', '充电控制早期并网机制截至2026年4月10日覆盖27个指定系统'], null],
          [['Hokkaido–Honshu 0.9 GW today, approved 1.2 GW by FY2027-end', '北海道—本州现为0.9GW，已批准至2027财年末扩容至1.2GW'], null],
          [['Verified output control on 36 days, Mar–May 2026', '2026年3–5月已核验弃电36天'], null],
        ] },
        { t: 'why', text: ['Hokkaido is the only region where the network can restrict charging as an explicit condition of early connection. Every other market on this platform treats grid risk as an export question. A model that assumes unconstrained import will overstate Hokkaido specifically, which is why import evidence is weighted equally with export evidence in the shared connection score.',
                           '北海道是唯一将限制充电作为早期并网明确条件的区域。本平台其他市场均将电网风险视为外送问题。假设充电不受限的模型将专门高估北海道 — 因此在通用并网评分中，充电证据与放电证据权重相同。'],
          sig: ['Import restriction is a Hokkaido-specific risk', '充电限制是北海道特有风险'] } ] },
    ] };
  };

  // ============================== BENCHMARK ==============================
  SEC_B.benchmark = function (){
    return {
    head: ['Regional Benchmark — the controlled experiment', '区域对比 — 受控实验'],
    cap: ['If I had the same 50 MW / 4h battery and the same capex today, what changes when I place it in Tokyo, Kyushu or Hokkaido? Only regional items move.',
          '若今天以相同造价配置同一台50MW/4小时储能，置于东京、九州或北海道会有何不同？仅区域项目发生变化。'],
    blocks: [
      { t: 'card', mt: false, title: ['One-page comparison matrix', '一页对比矩阵'], badges: ['calc'], live: true, blocks: [
        { t: 'table',
          head: [['Dimension', '维度'], ['Tokyo', '东京'], ['Kyushu', '九州'], ['Hokkaido', '北海道'], ['Interpretation', '解读']],
          rows: [
            [{ b: ['Primary thesis', '核心逻辑'] }, RG.tokyo.thesis, RG.kyushu.thesis, RG.hokkaido.thesis,
             ['Three different merchant/grid drivers', '三种不同的市场化/电网驱动']],
            [{ b: ['Capacity Market', '容量市场'] }, ['Same national mechanism', '同一全国机制'], ['Same', '同上'], ['Same', '同上'],
             ['Do not duplicate rule analysis', '不重复规则分析']],
            [{ b: ['2029 CM area price', '2029容量市场区域价格'] }, '¥15,111/kW', '¥15,112/kW', '¥14,972/kW',
             ['Modest spread; not the differentiator', '价差有限；非差异来源']],
            [{ b: ['JEPX', 'JEPX'] }, ['Tokyo Area Price', '东京区域价格'], ['Kyushu Area Price', '九州区域价格'], ['Hokkaido Area Price', '北海道区域价格'],
             ['Model each area separately', '各区域分别建模']],
            [{ b: ['Verified curtailment', '已核验弃电'] }, '20 d (Mar–May)', '50 d (Jan–Mar)', '36 d (Mar–May)',
             ['Need ≠ revenue', '需求≠收入']],
            [{ b: ['Study cap', '检讨上限'] }, '11', '8', '5',
             ['Hokkaido most restrictive', '北海道最严']],
            [{ b: ['Interconnector emphasis', '联络线重点'] }, ['System basis', '系统价差'], ['Kanmon export', '关门外送'], ['0.9 → 1.2 GW by FY2027-end', '至2027财年末0.9→1.2GW'],
             ['Hokkaido most export-sensitive', '北海道对外送最敏感']],
            [{ b: ['Saturation signal', '饱和信号'] }, ['Queue-specific', '按队列'], ['Queue-specific', '按队列'], ['>0.2 GW balancing; ~2 GW queue', '调整力>0.2GW；队列约2GW'],
             ['Hokkaido needs explicit cannibalisation tracking', '北海道须显式跟踪收益蚕食']],
            [{ b: ['Main downside', '主要下行'] }, ['Connection + basis normalisation', '并网与价差正常化'], ['Curtailment reduction + cannibalisation', '弃电减少与收益蚕食'], ['Interconnector + charging limits + saturation', '联络线、充电限制与饱和'],
             ['Distinct stress cases', '压力情景各异']],
          ] },
        { t: 'why', text: ['Read the last row first. The three regions fail in three unrelated ways, which is the actual argument for holding more than one of them. If they failed the same way, three Japanese allocations would be one position held three times.',
                           '请先读最后一行。三个区域以三种互不相关的方式失败 — 这才是同时持有多个区域的真正理由。若失败方式相同，三笔日本配置不过是同一头寸持有三次。'],
          sig: ['Three unrelated failure modes', '三种互不相关的失败模式'] } ] },

      { t: 'card', title: ['Scores side by side', '评分并列'], badges: ['calc'], live: true, blocks: [
        { t: 'bar', cfg: {
          xs: M.regionIds.map(id => L(R(id).short)),
          mode: 'group', h: 260, yfmt: v => fmtN(v),
          series: [
            { name: ['Composite score', '综合评分'], color: 'var(--s1)', vals: M.regionIds.map(id => compositeScore(path(id, 'components'))) },
            { name: ['Connection risk (lower = safer)', '并网风险（越低越安全）'], color: 'var(--s6)', vals: M.regionIds.map(id => liveScore(path(id, 'connFactors'))) },
            { name: ['Duration need index', '时长需求指数'], color: 'var(--s3)', vals: M.regionIds.map(id => liveScore(path(id, 'durFactors'))) },
          ] } },
        { t: 'why', text: ['Kyushu scores highest on composite and mid on connection risk; Hokkaido scores lowest on composite and highest on risk. Tokyo sits between on both. That ordering is stable across reasonable weight changes, which is more useful than the point scores themselves — the ranking is the finding, not the number.',
                           '九州综合评分最高、并网风险居中；北海道综合评分最低、风险最高；东京两项均居中。该排序在合理的权重变动下保持稳定，这比具体分值更有价值 — 结论在于排序而非数字。'],
          sig: ['The ranking is the finding', '结论在于排序'] } ] },
    ] };
  };

  // ============================== LAB ==============================
  SEC_B.lab = function (){
    return {
    head: ['Investment Lab — one model, three regional cases', '投资测算 — 一套模型，三个区域案例'],
    cap: ['All physical, financing and exit assumptions are common. Only regional inputs move between cases.',
          '所有物理、融资与退出假设均相同，各案例间仅区域输入发生变化。'],
    blocks: [
      { t: 'card', mt: false, title: ['Inputs', '输入'], badges: ['illus'], live: true, blocks: [
        { t: 'labInputs' },
        { t: 'cap', text: ['Capacity price defaults to the ' + L(R(region() === 'compare' ? 'tokyo' : region()).short) + ' area price × the expected-capacity factor. Capacity agreement defaults to 1 year — the main auction secures one delivery year.',
                           '容量价格默认取' + L(R(region() === 'compare' ? 'tokyo' : region()).short) + '区域价格×期待容量系数。容量协议年限默认为1年 — 主拍卖仅锁定一个实需年度。'] } ] },
      { t: 'card', title: ['Outputs', '输出'], badges: ['calc', 'illus'], live: true, blocks: [
        { t: 'labOut' },
        { t: 'why', text: ['Set the capacity agreement to 1 year and the model tells the truth about Japan: most of the value has to come from energy and balancing, because only one year of capacity revenue is actually secured. Setting it to 15 produces a much better-looking project that does not exist.',
                           '将容量协议年限设为1年，模型即揭示日本的真实情况：绝大部分价值必须来自电能量与调整力，因为实际锁定的容量收入仅一年。设为15年会得到一个好看但并不存在的项目。'],
          sig: ['Set capacity years to 1 and read again', '将容量年限设为1后重新阅读'] } ] },
      { t: 'card', title: ['Duration sweep', '时长扫描'], badges: ['calc', 'illus'], live: true, blocks: [
        { t: 'labDur' } ] },
      { t: 'card', title: ['Scenario snapshots', '情景快照'], badges: ['illus'], live: true, blocks: [
        { t: 'labSnaps' } ] },
    ] };
  };

  // ============================== PORTFOLIO ==============================
  SEC_B.portfolio = function (){
    return {
    head: ['Portfolio — region-aware project underwriting', '组合与基金视图 — 区域感知的项目承销'],
    cap: ['A shell, not a project. Japan project-specific evidence is deliberately absent from this public build.',
          '此为框架而非具体项目。本公开版本刻意不含日本项目层面的证据。'],
    blocks: [
      { t: 'card', mt: false, title: ['Evidence ladder', '证据阶梯'], badges: ['calc'], live: false, blocks: [
        { t: 'ladder', items: [
          { n: ['1 — Executed contract', '1 — 已执行合同'], d: ['LTDA / Capacity Securing Contract / toll / floor / offtake', '长期脱碳中标/容量确保合同/租赁/保底/购电'] },
          { n: ['2 — Final award', '2 — 最终中标'], d: ['Plus executable conditions', '附可执行条件'] },
          { n: ['3 — Binding offer', '3 — 具约束力报价'], d: ['Optimiser or offtaker', '优化商或购电方'] },
          { n: ['4 — Non-binding bid', '4 — 无约束力报价'], d: ['Indicative only', '仅为指示性'] },
          { n: ['5 — Independent forecast', '5 — 独立预测'], d: ['Third-party modelled', '第三方模型'] },
          { n: ['6 — Historical backtest', '6 — 历史回测'], d: ['Area price, not System Price', '区域价格，非系统价格'] },
          { n: ['7 — Developer assumption', '7 — 开发商假设'], d: ['Lowest weight', '权重最低'] },
        ] },
        { t: 'why', text: ['Japanese BESS transactions in 2026 mostly sit at rungs 5 to 7 on the revenue side while sitting at rung 1 or 2 on the technical side. That asymmetry is the deal: the technical package is complete long before the commercial package exists, so diligence spend belongs on the missing documents rather than on re-reviewing the studies.',
                           '2026年日本储能交易在收入侧多处于第5–7级，而在技术侧已达第1–2级。这种不对称正是交易的关键：技术资料包远早于商业资料包完成，因此尽调支出应投向缺失文件，而非重复审阅已有研究。'],
          sig: ['Technical complete, commercial absent', '技术完备，商业缺失'] } ] },

      { t: 'card', title: ['IC gates', '投委会门槛'], badges: ['calc'], live: false, blocks: [
        { t: 'gates', items: [
          { n: ['Grid', '电网'], d: ['Study complete, cost and schedule fixed', '检讨完成，造价与工期确定'], c: 'warn', s: ['Conditional', '有条件'] },
          { n: ['Import capability', '充电能力'], d: ['Approved import MW, separate from export', '获批充电MW，与放电分列'], c: 'warn', s: ['Conditional', '有条件'] },
          { n: ['Export capability', '放电能力'], d: ['Approved export MW', '获批放电MW'], c: 'warn', s: ['Conditional', '有条件'] },
          { n: ['Revenue', '收入'], d: ['Area-price backtest, not System Price', '区域价格回测，非系统价格'], c: 'serious', s: ['Fail without ETL', '无ETL则不通过'] },
          { n: ['Capex', '造价'], d: ['Reconciled to a real Japanese 4h build', '对照真实日本4小时项目核对'], c: 'serious', s: ['Fail without ETL', '无ETL则不通过'] },
          { n: ['Exit', '退出'], d: ['Buyer universe for a 1-year secured asset', '一年期锁定资产的买家群体'], c: 'warn', s: ['Conditional', '有条件'] },
        ] },
        { t: 'why', text: ['Two gates fail on this public build by design — revenue and capex both depend on the ETL that has not run. Showing them as conditional would misrepresent the state of the analysis. A gate that cannot be evidenced is a fail, not a caveat.',
                           '本公开版本中有两项门槛按设计即为不通过 — 收入与造价均依赖尚未执行的ETL。将其显示为“有条件”会歪曲分析现状。无法取证的门槛是“不通过”，而非“注意事项”。'],
          sig: ['Unevidenced is fail, not caveat', '无证据即不通过'] } ] },
    ] };
  };

  // ============================== DATA ==============================
  SEC_B.data = function (){
    return {
    head: ['Data & Methodology', '数据与方法'],
    cap: ['Source hierarchy, the ETL gates that stand between this build and an investable model, and the bilingual glossary.',
          '来源层级、当前版本与可投资模型之间的ETL门槛，以及双语术语表。'],
    blocks: [
      { t: 'card', mt: false, title: ['ETL gates — what must be replaced before use', 'ETL门槛 — 使用前必须替换的内容'],
        badges: ['illus'], live: true, blocks: [
        { t: 'table',
          head: [['Input', '输入'], ['Current status', '当前状态'], ['Required before engineReady', '达到engineReady前所需']],
          rows: [
            [{ b: ['JPY/USD FX', '日元/美元汇率'] }, { chip: 'warn', text: ['Dated seed 2026-07-28', '种子数据，日期2026-07-28'] }, ['Dated rate at model date', '模型日期的定期汇率']],
            [{ b: ['Capex per MW / kWh', '每MW/kWh造价'] }, { chip: 'critical', text: ['Illustrative', '示例'] }, ['Reconciled to a real Japanese 4h build', '对照真实日本4小时项目核对']],
            [{ b: ['Fixed O&M', '固定运维'] }, { chip: 'critical', text: ['Illustrative', '示例'] }, ['Vendor or operating benchmark', '供应商或运营基准']],
            [{ b: ['Merchant margin by area', '各区域市场化收益'] }, { chip: 'critical', text: ['Illustrative', '示例'] }, ['12-month optimised Area Price backtest, per region', '各区域12个月优化区域价格回测']],
            [{ b: ['Incremental balancing value', '调整力增量价值'] }, { chip: 'critical', text: ['Illustrative', '示例'] }, ['Gross less JEPX opportunity cost, SOC cost, degradation, fees', '毛值扣除JEPX机会成本、SOC成本、衰减与费用']],
            [{ b: ['Expected-capacity factor', '期待容量系数'] }, { chip: 'critical', text: ['Illustrative 0.70', '示例0.70'] }, ['Sourced from the current rule vintage', '取自现行规则版本']],
            [{ b: ['Auction-renewal curve', '拍卖续约曲线'] }, { chip: 'critical', text: ['Illustrative 90% → 60%', '示例90%→60%'] }, ['Documented scenario with stated drivers', '有明确驱动因素的书面情景']],
            [{ b: ['Composite / connection / duration scores', '综合/并网/时长评分'] }, { chip: 'warn', text: ['Seed', '种子'] }, ['Re-scored against evidence', '依据证据重新评分']],
            [{ b: ['Capacity Market area prices', '容量市场区域价格'] }, { chip: 'good', text: ['Anchored — OCCTO 2029', '已锚定 — OCCTO 2029'] }, ['—']],
            [{ b: ['Curtailment days', '弃电天数'] }, { chip: 'good', text: ['Anchored — OCCTO verified', '已锚定 — OCCTO核验'] }, ['—']],
            [{ b: ['Study caps / interconnector / queue', '检讨上限/联络线/队列'] }, { chip: 'good', text: ['Anchored — TSO published', '已锚定 — 电网运营商公布'] }, ['—']],
          ] },
        { t: 'why', text: ['Eight of eleven inputs are still seed. The three that are anchored happen to be the ones that differentiate the regions structurally, which is why the qualitative ranking in this dashboard is more trustworthy than the IRRs. Read the ordering; do not quote the numbers.',
                           '11项输入中仍有8项为种子数据。已锚定的3项恰是结构性区分各区域的关键，因此本看板的定性排序比IRR更可信。请阅读排序，勿引用具体数值。'],
          sig: ['Trust the ordering, not the IRR', '相信排序，而非IRR'] } ] },

      { t: 'card', title: ['Source registry', '数据源登记'], badges: ['official'], live: false, blocks: [
        { t: 'table',
          head: [['Source', '来源'], ['Status', '状态'], ['Date', '日期'], ['Coverage', '适用期间']],
          rows: Object.values(SRC).map(s => [{ b: s.file }, s.status, s.date, s.cy]) } ] },

      { t: 'card', title: ['Core formulas', '核心公式'], badges: ['calc'], live: false, blocks: [
        { t: 'wfrows', items: [
          { l: ['Area basis', '区域价差'], v: '=', n: ['Area Price − System Price', '区域价格 − 系统价格'] },
          { l: ['Net JEPX energy margin', 'JEPX净电能量收益'], v: '=', n: ['Discharge receipts − charging cost − RTE loss − degradation − fees', '放电收入 − 充电成本 − 效率损失 − 衰减 − 费用'] },
          { l: ['Incremental balancing', '调整力增量'], v: '=', n: ['Gross − JEPX opportunity cost − SOC cost − degradation − penalties', '毛值 − JEPX机会成本 − SOC成本 − 衰减 − 罚则'] },
          { l: ['Secured CM revenue', '锁定容量收入'], v: '=', n: ['Area price × expected capacity × secured delivery period', '区域价格 × 期待容量 × 锁定交付期'] },
          { l: ['Curtailment-driven value', '弃电驱动价值'], v: '=', n: ['Merchant NPV with observed windows − NPV under a non-curtailed profile', '含实际窗口的市场化NPV − 无弃电情形下的NPV'] },
        ] },
        { t: 'note', b: ['Anti-double-count: ', '防重复计算：'],
          text: ['LTDA headline payment is never added to full JEPX plus balancing revenue; other-market revenue sharing applies. Future Capacity Market re-auction revenue is never treated as contracted.',
                 '长期脱碳拍卖中标金额绝不与完整的JEPX及调整力收入直接相加，须适用其他市场收入分享机制。未来容量市场再拍卖收入绝不视为已签约收入。'] } ] },

      { t: 'card', title: ['Bilingual glossary', '双语术语表'], badges: ['calc'], live: false, blocks: [
        { t: 'glossary' },
        { t: 'exports' } ] },
    ] };
  };

  return SECTIONS;
}
