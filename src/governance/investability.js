/* ---------------------------------------------------------------------------
   INVESTABILITY — four questions, anchored grades, six verdict words.

   DRAFT, AWAITING THE ANALYST'S EDIT. Every anchor, every measure and every
   label below was drafted on 2026-10-10 from
   docs/investment-view-revision-plan-2026-10-10.md §3 and has NOT been signed
   off. Two anchor sets (capital at risk, approval transparency) are the plan's
   own text, reused verbatim; the other ten are first drafts written to the same
   precision and are there to be overwritten. Nothing in the application imports
   this module yet, so nothing here is published.

   THESE VALUES ARE METHODOLOGY. An anchor is the definition of what a grade
   means, and no observation settles a definition. No ETL job, no rule and no
   agent may write or amend anything in this file — not an anchor, not a
   threshold inside one, not a verdict word. Automation may one day change a
   GRADE; it may never change what a grade is measured against.

   ---------------------------------------------------------------------------
   WHY ANCHORS, AND WHAT MAKES ONE USABLE

   The platform already scores every market, in tables each market wrote for
   itself (the component and connection-factor tables, since retired and kept in
   docs/grading/seed-tables.md; they sat in pjm/scores.js, in
   pl/data.js and jp/regions.js). Those tables are good judgement and they are
   not comparable: a 2 on Poland's "deposits, securities and release path" and a
   2 on Tokyo's "deposit / funding readiness" were never measured against the
   same ruler. Thirteen of fifteen markets came out "Selective".

   An anchor is the ruler. Two tests, applied to every line below:

     · CHECKABLE AGAINST A FACT. "Transparent process" is not an anchor.
       "Timeframes published by the operator" is: somebody can open the
       operator's page and it is there or it is not.
     · THE SAME THING IN EVERY MARKET. No anchor names a market, an operator or
       an instrument. Where a number appears it is a share, a count or a span of
       months, never a currency amount — a currency amount means something
       different on a 50 MW project and a 200 MW one, which is exactly why the
       dollar figure travels beside the grade as a `metric` and is compared
       with an archetype's own limit in archetypes.js.

   ---------------------------------------------------------------------------
   A GRADE DESCRIBES THE MARKET. IT DOES NOT SAY WHETHER THAT IS GOOD.

   Every scale runs the same way so a row of grades can be read at a glance:
   5 is the condition most open to a NEW entrant, 1 the most closed. That is a
   reading convention, not a preference. A scarce grid connection is a wall to a
   first-time entrant, the thesis for a developer who can still secure one and
   protection for a fund that already owns one; which of those it is belongs to
   the archetype's `reads` table, and that table is free to be non-monotonic.
   Nothing in this file may assume that a higher grade is better.

   THE PILLARS ARE NEVER BLENDED INTO ONE MARKET-LEVEL NUMBER. There is no
   function here that turns twelve grades into a score, on purpose. Only an
   archetype does that.

   Layering: no DOM, no market module, no ETL code, no import at all.
   --------------------------------------------------------------------------- */

/** The four questions an entry decision asks. The comparison engine answers the first. */
export const PILLARS = ['return', 'entry', 'durability', 'capital'];

export const PILLAR_LABEL = {
  return:     ['Return', '回报'],
  entry:      ['Entry', '进入'],
  durability: ['Durability', '持久性'],
  capital:    ['Capital', '资本'],
};

export const PILLAR_QUESTION = {
  return:     ['What does the asset pay?', '这项资产能赚多少？'],
  entry:      ['What does it take to get in?', '进场要付出什么代价？'],
  durability: ['Will the case still stand in year five?', '五年之后，这套逻辑还站得住吗？'],
  capital:    ['Can I finance it, grow it and sell it?', '融得到资、做得大、退得出吗？'],
};

export const GRADES = [5, 4, 3, 2, 1];

/**
 * How a dimension gets its grade.
 *
 * ANCHOR: a person reads the market against the five written anchors.
 * RANK:   the grade is the market's quintile in the compared set, computed from
 *         the comparison engine. Asset return alone is graded this way until
 *         gate G12 closes, because the engine's ordering is trusted and its
 *         level is not (plan §3.5). A rank grade is therefore RELATIVE: it
 *         moves when another market does, and it must never carry a knock-out.
 *
 * Revenue certainty sits in the same pillar and is NOT ranked. Secured share
 * and tenor are levels the engine already trusts, so they are read against
 * absolute anchors — which is what lets "no secured revenue route exists" be a
 * knock-out for an investor that needs one.
 */
export const GRADED_BY = { ANCHOR: 'anchor', RANK: 'rank' };

/* Quintile anchors for asset return. Mechanical, and written out so that every
   dimension answers the same question in the same shape. */
const RANK_ANCHORS = {
  5: ['Top fifth of the compared markets on this measure', '在所比较的市场中位列前五分之一'],
  4: ['Second fifth', '位列第二个五分之一'],
  3: ['Middle fifth', '位列中间五分之一'],
  2: ['Fourth fifth', '位列第四个五分之一'],
  1: ['Bottom fifth of the compared markets on this measure', '在所比较的市场中位列末五分之一'],
};

/**
 * The fourteen dimensions: asset return, which the engine ranks; revenue
 * certainty, read off the engine's secured share and tenor against anchors;
 * and the twelve a person grades.
 *
 * `n` is the plan's own numbering of the twelve and is null for the two Return
 * dimensions. `measure` says what is being looked at and over what window —
 * it is part of the anchor, because "five deals" means nothing until the window
 * is fixed. `open` says what a 5 describes, for the reader who has not learned
 * the scale yet.
 *
 * "The reference project" is always the market's comparison archetype, the
 * same size and duration the engine prices.
 */
export const DIMENSIONS = [
  /* ---- Return ------------------------------------------------------------- */
  {
    id: 'assetReturn', pillar: 'return', n: null, gradedBy: GRADED_BY.RANK,
    label: ['Asset return', '资产回报'],
    question: ['What does the engine say the asset earns?', '比较引擎算出的资产回报是多少？'],
    measure: ['Quintile of the engine IRR among the compared markets, on the return basis the archetype reads (hold or exit).',
              '比较引擎IRR在各市场中的五分位排名；按该投资者类型所看的口径（持有或退出）取值。'],
    open: ['5 = the highest returns in the set', '5 = 回报居各市场前列'],
    anchors: RANK_ANCHORS,
  },
  {
    /* Grades 5 to 2 describe the REFERENCE PROJECT, from figures the engine
       already holds. Grade 1 describes the MARKET, and the difference is the
       point: a project that happens to be unsecured in a market where tolls or
       floors are being signed is a 2, and only a market with no route at all is
       a 1. An investor that needs secured revenue is shut out of the second and
       merely unimpressed by the first.

       AN OPTIMISER FLOOR COUNTS AS A SECURED ROUTE — the analyst's decision of
       2026-10-10. A guaranteed minimum from an offtaker or optimiser is secured
       revenue for its tenor exactly as a toll is, at the level of the floor.

       The anchors ask whether a project HAS SIGNED such a route, not whether
       the signing was published. How that is known is the grade's `basis`: a
       disclosed deal is third-party evidence, and a route known from deal
       experience is a practitioner grade, with its reason kept private.

       A FLOOR SECURES ITS OWN LEVEL, NOT THE REVENUE ABOVE IT — also the
       analyst's decision of 2026-10-10. "Secured share" is guaranteed revenue
       divided by the reference project's EXPECTED revenue in the base case. A
       floor that covers every megawatt and sits at half of expected revenue is
       a secured share of one half, not of the whole. Counting coverage instead
       of level would grade a low floor the same as a toll, and the difference
       between those two is what a lender sizes debt on. */
    id: 'revenueCertainty', pillar: 'return', n: null, gradedBy: GRADED_BY.ANCHOR,
    label: ['Revenue certainty', '收入确定性'],
    question: ['How much of that revenue is secured, and for how long?', '其中多少收入已经锁定，能锁多久？'],
    measure: ['Guaranteed revenue as a share of the reference project\'s expected base-case revenue, and its tenor, from the engine — a floor counts at the level of the floor, not at the capacity it covers; and whether any storage project in the market has signed a secured route — a capacity contract, a toll, an optimiser or offtaker floor, or a tender award.',
              '有保障的收入占参考项目基准情景预期收入的比例及其期限，取自比较引擎——保底只按保底价水平计入，而不按其覆盖的容量计入；以及该市场是否已有储能项目签下锁定收入的途径——容量合同、租赁、优化商或承购方提供的保底，或招标中标。'],
    open: ['5 = most of the expected revenue is guaranteed for a decade', '5 = 大部分预期收入有十年保障'],
    anchors: {
      5: ['Half or more of expected revenue secured for ten years or longer',
          '一半及以上的预期收入已锁定十年或更久'],
      4: ['Half or more secured for five to ten years, or 20–50% secured for ten years or longer',
          '一半及以上的收入锁定五至十年；或20%–50%的收入锁定十年或更久'],
      3: ['20–50% secured for three to ten years, half or more for three to five, or under 20% for ten years or longer',
          '20%–50%的收入锁定三至十年；或一半及以上锁定三至五年；或不足20%但锁定十年或更久'],
      2: ['Anything secured for under three years, or under 20% for under ten; or nothing secured, though at least one storage project in the market has signed a secured route',
          '锁定期限不足三年；或锁定不足20%且不足十年；或参考项目没有锁定收入，但该市场已有至少一个储能项目签下了锁定收入的途径'],
      1: ['No secured revenue route exists in the market: no storage project has signed a capacity contract, a toll, an optimiser or offtaker floor, or a tender award',
          '该市场不存在锁定收入的途径：没有任何储能项目签下容量合同、租赁、优化商或承购方保底，或招标中标'],
    },
  },

  /* ---- Entry -------------------------------------------------------------- */
  {
    /* The plan's own anchors, §3.2, verbatim in English. */
    id: 'capitalAtRisk', pillar: 'entry', n: 1, gradedBy: GRADED_BY.ANCHOR,
    label: ['Capital at risk before FID', '最终投资决策前的风险资本'],
    question: ['What is spent or pledged before the investment decision, and how is it lost?',
               '在最终投资决策之前要花掉、押上多少钱，又会在什么情况下收不回来？'],
    measure: ['Non-refundable spend plus security posted, for the reference project, as a share of its project cost.',
              '参考项目不可退还的支出加上已提交的保证金，占项目总投资的比例。'],
    open: ['5 = almost nothing at risk', '5 = 几乎没有前期风险资本'],
    anchors: {
      5: ['Under 0.5% of project cost, and nothing posted as security',
          '不足项目投资的0.5%，且无需提交任何保证金'],
      4: ['0.5–1.5%, refundable deposits only',
          '0.5%–1.5%，且仅为可退还的押金'],
      3: ['1.5–3%, or security posted only after consent is in hand',
          '1.5%–3%；或保证金在取得许可之后才需提交'],
      2: ['3–6%, or security posted before consent or before capacity is certain',
          '3%–6%；或在取得许可之前、容量尚未确定之前就须提交保证金'],
      1: ['Over 6%, or security forfeitable on events the sponsor does not control',
          '超过6%；或保证金可能因投资方无法控制的事件而被没收'],
    },
  },
  {
    /* The plan's own anchors, §3.2, verbatim in English. */
    id: 'approvalTransparency', pillar: 'entry', n: 2, gradedBy: GRADED_BY.ANCHOR,
    label: ['Approval transparency', '审批透明度'],
    question: ['Can an outsider read the rules and predict the outcome?',
               '局外人能否读懂规则，并预判审批结果？'],
    measure: ['What the connection and consenting bodies publish: the process, the gating rules, the timeframes, the queue and the available capacity.',
              '并网与许可主管机构公开了什么：流程、准入规则、办理时限、排队情况与可用容量。'],
    open: ['5 = everything that decides the outcome is published', '5 = 决定结果的要素全部公开'],
    anchors: {
      5: ['Process, gating rules and timeframes published by the operator; queue and available capacity public; outcomes appealable',
          '流程、准入规则与办理时限均由运营商公布；排队情况与可用容量公开；结果可以申诉'],
      4: ['Process and gating rules published; timeframes indicative; capacity published by region',
          '流程与准入规则已公布；时限仅供参考；可用容量按区域公布'],
      3: ['Process published; timeframes and queue not; outcomes depend on bilateral negotiation',
          '流程已公布，但时限与排队情况未公开；结果取决于双边谈判'],
      2: ['Process changes between rounds, or material discretion with no published criteria',
          '流程每一轮都在变；或存在重大裁量空间而没有公开的判定标准'],
      1: ['No published process, or a moratorium with no stated end',
          '没有公开流程；或已暂停受理且未说明何时恢复'],
    },
  },
  {
    /* Drafted from the stage vocabulary in buildPathway.js. The pathway model
       refuses to publish a summed total; this anchor is graded on the critical
       path the plan's §4.3 proposes, not on a sum of stages. A calendar gate
       is a date that recurs once a year and cannot be bought forward. */
    id: 'timeToRevenue', pillar: 'entry', n: 3, gradedBy: GRADED_BY.ANCHOR,
    label: ['Time to first revenue', '首笔收入所需时间'],
    question: ['How long from a greenfield start to the first revenue?',
               '从零起步到拿到第一笔收入要多久？'],
    measure: ['Months from site control to market entry for the reference project, taken at the midpoint of the critical-path range, with annual calendar gates counted.',
              '参考项目从取得场址到进入市场的月数，取关键路径区间的中点，并计入一年一度的日历节点。'],
    open: ['5 = the shortest path to revenue', '5 = 最快产生收入'],
    anchors: {
      5: ['Under 24 months, with no annual calendar gate on the critical path',
          '不足24个月，且关键路径上没有一年一度的日历节点'],
      4: ['24–36 months, or under 24 with one annual calendar gate',
          '24–36个月；或不足24个月但有一个年度日历节点'],
      3: ['36–48 months',
          '36–48个月'],
      2: ['48–72 months, or two or more annual calendar gates on the critical path',
          '48–72个月；或关键路径上有两个及以上年度日历节点'],
      1: ['Over 72 months, or first revenue waits on a network project whose date the sponsor does not control',
          '超过72个月；或首笔收入须等待某项电网工程投运，而其时间不由投资方掌握'],
    },
  },
  {
    /* Drafted from CAPTURE.ACCESS_AUCTION and CAPTURE.CONNECTION_MORATORIUM in
       congestion.js, and from the queue and study-maturity lines that carry the
       most weight in every market's connection-factor table. Graded for the
       regions where the reference project would actually be built; a market
       that is closed in one region and open in another is a 4, and the verdict
       names the region. */
    id: 'gridScarcity', pillar: 'entry', n: 4, gradedBy: GRADED_BY.ANCHOR,
    label: ['Grid-connection scarcity', '并网容量稀缺程度'],
    question: ['Can a new project still get a firm connection, and how is it rationed?',
               '新项目还拿得到固定并网容量吗？容量靠什么方式分配？'],
    measure: ['How new storage connection capacity is allocated today: on request, by region, by auction or readiness gate, or not at all.',
              '当前新增储能并网容量如何分配：随申请即得、按区域开放、通过拍卖或成熟度门槛分配，或根本不再分配。'],
    open: ['5 = capacity is available on request', '5 = 容量充裕，申请即可获得'],
    anchors: {
      5: ['Firm capacity available in most regions; offers issued on request with connection dates inside three years; no auction, cap or moratorium',
          '多数区域仍有固定容量；提出申请即可获得并网要约，并网日期在三年以内；没有拍卖、上限或暂停受理'],
      4: ['Firm capacity available in regions the operator names; other regions full or closed; offers in the open regions are not competed for',
          '运营商点名的区域仍有固定容量，其余区域已满或已关闭；在开放区域取得要约无需竞争'],
      3: ['Rationed but obtainable: capacity is allocated by auction, readiness gate or annual cycle, and a prepared project can expect an offer within one cycle',
          '需要争取但拿得到：容量通过拍卖、成熟度门槛或年度周期分配，准备充分的项目可望在一个周期内获得要约'],
      2: ['Offers issued only with connection dates more than five years out or as non-firm access, or allocation rules are under reform with existing applications at risk',
          '要约的并网日期在五年以后，或只能获得非固定接入；或分配规则正在改革，已提交的申请可能受影响'],
      1: ['No new storage connection obtainable where the reference project would be built: a moratorium, a closed queue, or nothing before a named relief project',
          '在参考项目的拟建区域拿不到新的储能并网容量：暂停受理、排队关闭，或须等待某项指定的电网加强工程投运'],
    },
  },
  {
    /* Not sourced anywhere in the repository today (plan §5.1), so this set is
       drafted from first principles and is among the least tested here. A
       wholly foreign-owned local company is treated as no barrier: it is
       required nearly everywhere and stops nobody. */
    id: 'foreignEntry', pillar: 'entry', n: 5, gradedBy: GRADED_BY.ANCHOR,
    label: ['Foreign-entry barriers', '外资进入壁垒'],
    question: ['Can a foreign investor own the asset, the land and the licence without a discretionary approval?',
               '外国投资者能否不经裁量性审批，直接持有资产、土地与牌照？'],
    measure: ['Investment-screening rules, land-ownership rules and licensing rules as they apply to a foreign owner of the reference project.',
              '适用于参考项目外资股东的投资审查、土地权属与牌照规定。'],
    open: ['5 = a foreign owner is treated as a domestic one', '5 = 外资与内资待遇相同'],
    anchors: {
      5: ['No screening applies to storage at the reference size; a wholly foreign-owned local company may hold the land, the licence and the connection',
          '参考规模的储能项目不在投资审查范围内；外商独资的本地公司可持有土地、牌照与并网权'],
      4: ['Screening applies by notification or above a published threshold, with published criteria and a statutory decision deadline of 90 days or less',
          '审查以申报制进行，或仅在公布的门槛以上适用；判定标准公开，法定决定期限不超过90天'],
      3: ['Approval is mandatory for the reference project, with published criteria and a statutory deadline longer than 90 days; or land can only be leased, not owned, by a foreign-owned company',
          '参考项目必须取得批准，标准公开，但法定期限超过90天；或外资公司对土地只能租赁、不能持有'],
      2: ['Screening with no statutory deadline or no published criteria; or investors of named origins face a stricter test or an ownership cap',
          '审查没有法定期限或没有公开标准；或特定来源国的投资者面临更严格的审查或持股上限'],
      1: ['Foreign control of storage or of grid-connected assets is prohibited or capped below a majority; or approval is a case-by-case political decision',
          '禁止外资控股储能或并网资产，或外资持股上限低于控股比例；或是否批准属于逐案的政治决定'],
    },
  },
  {
    /* Drafted from the FEOC line of PJM's retired connection-factor table, whose own comment makes the
       distinction grade 2 rests on: a rule that VOIDS support is a cliff, a rule
       that reduces it is a slope. */
    id: 'supplyChainOrigin', pillar: 'entry', n: 6, gradedBy: GRADED_BY.ANCHOR,
    label: ['Supply-chain and origin rules', '供应链与原产地规则'],
    question: ['Does where the equipment or the owner comes from restrict what the project can do?',
               '设备或股东的来源地，会不会限制项目能做的事？'],
    measure: ['Rules in force or legislated that restrict equipment, control systems or ownership by country of origin, and what each one conditions.',
              '已生效或已立法的、按来源国限制设备、控制系统或股权的规则，以及每项规则具体卡住什么。'],
    open: ['5 = origin is not a factor', '5 = 来源地不构成限制'],
    anchors: {
      5: ['No rule restricts equipment or owner by origin, and no origin-specific tariff or duty applies to cells or systems',
          '没有按来源地限制设备或股东的规则，电芯与系统也不适用针对特定来源地的关税'],
      4: ['Origin-specific tariffs or duties apply but condition nothing: any supplier may be used, at a cost',
          '存在针对特定来源地的关税，但不附带其他条件：任何供应商都可以用，只是成本更高'],
      3: ['Origin rules condition a subsidy, a tax credit or an auction score, and reduce it in proportion; a non-compliant project can still connect and trade',
          '原产地规则与补贴、税收抵免或拍卖评分挂钩，并按比例扣减；不合规的项目仍可并网与交易'],
      2: ['Failing an origin rule voids a support entitlement outright, or an origin or security rule conditions a main revenue route or the connection itself',
          '不满足原产地规则会直接丧失全部支持资格；或原产地、安全规则卡住主要收入渠道乃至并网本身'],
      1: ['Equipment or owners of named origins are barred from connecting or from owning; or such a rule is legislated and its scope is not yet published',
          '特定来源地的设备或股东被禁止并网或持有资产；或相关规则已立法但适用范围尚未公布'],
    },
  },

  /* ---- Durability --------------------------------------------------------- */
  {
    /* Drafted from the dated events already written as prose in
       decisionProfiles.js. "The main revenue mechanism" is the largest secured
       or regulated line in the market's revenue stack, or the wholesale market
       design itself where nothing is secured. */
    id: 'policyStability', pillar: 'durability', n: 7, gradedBy: GRADED_BY.ANCHOR,
    label: ['Policy stability', '政策稳定性'],
    question: ['How often do the rules behind the main revenue line change, and are existing assets protected when they do?',
               '支撑主要收入的规则多久变一次？变的时候存量资产是否受保护？'],
    measure: ['Changes to the main revenue mechanism over the last five years, changes now pending, and how existing assets and contracts were treated.',
              '过去五年主要收入机制的变更次数、目前待定的变更，以及存量资产与合同受到的对待。'],
    open: ['5 = the rules have held and existing assets are protected', '5 = 规则稳定，存量资产受保护'],
    anchors: {
      5: ['No change in five years that altered revenue for existing assets, and none pending; grandfathering of existing contracts is written into the rules',
          '五年内没有影响存量资产收入的变更，也没有待定变更；存量合同的"新老划断"已写入规则'],
      4: ['One such change in five years, consulted on and phased in; anything pending is dated and grandfathers existing contracts',
          '五年内有过一次此类变更，经过公开征询并分阶段实施；待定变更均有明确日期，且不追溯存量合同'],
      3: ['Two or more changes in five years, or one dated change pending that alters revenue for assets not yet contracted; existing contracts honoured',
          '五年内两次及以上变更；或有一项已定日期的待定变更，会影响尚未签约资产的收入；存量合同得到履行'],
      2: ['A redesign of the main revenue line is pending with no settled design or no date; or a change in five years took effect on less than twelve months\' notice',
          '主要收入机制正待重新设计，方案或时间尚未确定；或五年内曾有变更在不足十二个月的预告期内生效'],
      1: ['A retroactive change hit existing assets or awarded contracts in five years; or the main mechanism expires inside five years with no successor legislated',
          '五年内出现过追溯存量资产或已中标合同的变更；或主要机制将在五年内到期，而接续机制尚未立法'],
    },
  },
  {
    /* Signed against enquired is the distinction the plan insists on: a
       connection enquiry is free and a signed agreement is not. Thresholds are
       expressed against system peak so that a small system and a large one are
       read on the same scale. This grades how much load is coming, NOT whether
       that helps storage — large load also competes for the same connection
       capacity, and that reading belongs to the archetype. */
    id: 'demandGrowth', pillar: 'durability', n: 8, gradedBy: GRADED_BY.ANCHOR,
    label: ['Demand growth', '需求增长'],
    question: ['Is firm new load arriving, or only enquiries?',
               '新增负荷是真的落地了，还是只停留在意向阶段？'],
    measure: ['New large load with a signed connection agreement, as a share of system peak demand; and the growth in the system operator\'s own central five-year forecast.',
              '已签署并网协议的新增大负荷占系统峰值负荷的比例；以及系统运营商自身五年基准预测中的增速。'],
    open: ['5 = large, signed load growth', '5 = 已签约的负荷增长规模大'],
    anchors: {
      5: ['Signed new load exceeds 10% of system peak, and the operator\'s central forecast grows by more than 3% a year over five years',
          '已签约新增负荷超过系统峰值的10%，且运营商基准预测五年内年均增长超过3%'],
      4: ['Signed new load is 5–10% of system peak, or the central forecast grows by 2–3% a year',
          '已签约新增负荷为系统峰值的5%–10%；或基准预测年均增长2%–3%'],
      3: ['Central forecast grows by 1–2% a year; enquiries are published but signed new load is under 5% of system peak',
          '基准预测年均增长1%–2%；意向申请有公布，但已签约新增负荷不足系统峰值的5%'],
      2: ['Central forecast grows by less than 1% a year; load growth exists only as enquiries or is not published',
          '基准预测年均增长不足1%；负荷增长只停留在意向申请，或没有公开数据'],
      1: ['Central forecast shows demand falling, or announced closures of large load exceed the new load signed',
          '基准预测显示需求下降；或已宣布关停的大负荷超过已签约的新增负荷'],
    },
  },
  {
    /* The platform already measures this, as "a named competition numerator
       divided by a named denominator" (valueDriverData.js). The anchor keeps
       that discipline and fixes the two denominators: the reserve requirement
       storage sells into, and system peak. The revenue clauses are there
       because a ratio alone cannot tell a deep market from a crowded one. */
    id: 'saturation', pillar: 'durability', n: 9, gradedBy: GRADED_BY.ANCHOR,
    label: ['Saturation', '饱和度'],
    question: ['How much storage is already competing for the same revenue?',
               '已经有多少储能在争同一份收入？'],
    measure: ['Operating plus committed storage (under construction, or holding a signed connection agreement) against the reserve requirement it sells into and against system peak demand.',
              '已投运与已承诺的储能（在建或已签并网协议），相对于其所参与的备用需求量以及系统峰值负荷的比例。'],
    open: ['5 = little storage competing', '5 = 竞争的储能很少'],
    anchors: {
      5: ['Operating plus committed storage is under half the reserve requirement it sells into, and under 5% of system peak',
          '已投运与已承诺的储能不足其所参与备用需求量的一半，且不足系统峰值的5%'],
      4: ['Below the reserve requirement, and 5–10% of system peak',
          '低于备用需求量，且为系统峰值的5%–10%'],
      3: ['Exceeds the reserve requirement but stays under 20% of system peak; reserve prices have fallen, energy spreads have not',
          '已超过备用需求量，但不足系统峰值的20%；备用价格已经回落，电能量价差尚未收窄'],
      2: ['More than twice the reserve requirement, or 20–40% of system peak; or published fleet revenue per MW has fallen two years running',
          '超过备用需求量的两倍，或为系统峰值的20%–40%；或公开的机组每MW收入已连续两年下降'],
      1: ['Over 40% of system peak; or published fleet revenue per MW is under half its peak year while committed storage still exceeds the operating fleet',
          '超过系统峰值的40%；或公开的每MW收入已不到峰值年份的一半，而已承诺的储能规模仍大于在运规模'],
    },
  },

  /* ---- Capital ------------------------------------------------------------ */
  {
    /* Drafted from the `refinancing` field of the contract-risk records and
       PJM's "financing, tax equity and delivery execution" component. Counts
       are of DISCLOSED deals over a fixed 24-month window; an undisclosed deal
       establishes nothing, under the same rule the claim pilot applies. */
    id: 'debtAvailability', pillar: 'capital', n: 10, gradedBy: GRADED_BY.ANCHOR,
    label: ['Debt availability', '债务融资可得性'],
    question: ['Will lenders finance storage here without recourse to the sponsor?',
               '贷款人是否愿意在不向股东追索的前提下为这里的储能项目融资？'],
    measure: ['Disclosed non-recourse financings of standalone storage closed in the last 24 months, and the revenue basis they were sized on.',
              '过去24个月内已披露并完成交割的独立储能无追索融资笔数，以及其债务规模所依据的收入口径。'],
    open: ['5 = a deep non-recourse market, including for merchant revenue', '5 = 无追索融资市场成熟，市场化收入也能融资'],
    anchors: {
      5: ['Five or more disclosed non-recourse storage financings in 24 months, at least one of them sized on merchant or floor-backed revenue',
          '24个月内已披露的储能无追索融资达五笔及以上，其中至少一笔以市场化收入或保底收入为基础确定债务规模'],
      4: ['Three or more in 24 months, all sized on contracted, tolled or capacity revenue',
          '24个月内三笔及以上，且全部以合同、租赁或容量收入为基础'],
      3: ['One or two in 24 months; other storage debt is corporate or portfolio-level',
          '24个月内一至两笔；其余储能债务为公司层面或资产组合层面融资'],
      2: ['None in 24 months; storage debt exists only with sponsor recourse or from public and development lenders',
          '24个月内没有；储能债务只在股东提供追索时可得，或仅来自政策性与开发性金融机构'],
      1: ['No disclosed storage debt of any kind; projects are financed entirely with equity',
          '没有任何已披露的储能债务；项目全部以股本出资'],
    },
  },
  {
    /* No transaction evidence is held anywhere in the repository yet (gate G38
       in the plan), so every market will start ungraded on this line. */
    id: 'exitLiquidity', pillar: 'capital', n: 11, gradedBy: GRADED_BY.ANCHOR,
    label: ['Exit liquidity', '退出流动性'],
    question: ['Do storage assets and platforms actually change hands here?',
               '这里的储能资产和平台真的有人买卖吗？'],
    measure: ['Disclosed sales of storage in the last 24 months, between unrelated parties, by stage: ready-to-build projects, operating assets and platforms.',
              '过去24个月内非关联方之间已披露的储能交易，按阶段区分：具备开工条件的项目、在运资产与平台。'],
    open: ['5 = operating assets and platforms trade regularly', '5 = 在运资产与平台交易频繁'],
    anchors: {
      5: ['Five or more disclosed sales of operating assets or platforms in 24 months, to both financial and strategic buyers',
          '24个月内已披露的在运资产或平台交易达五笔及以上，买方既有财务投资者也有战略投资者'],
      4: ['Two to four disclosed sales of operating assets or platforms in 24 months',
          '24个月内已披露的在运资产或平台交易为二至四笔'],
      3: ['Three or more ready-to-build projects sold in 24 months, but at most one operating asset or platform',
          '24个月内具备开工条件的项目成交三笔及以上，但在运资产或平台交易至多一笔'],
      2: ['One or two disclosed sales at any stage in 24 months',
          '24个月内各阶段合计仅有一至两笔已披露交易'],
      1: ['No disclosed storage sale between unrelated parties',
          '没有非关联方之间的已披露储能交易'],
    },
  },
  {
    /* The reference project is the unit, so the question is the same in a small
       market and a large one: how many more of these fit. "The main revenue
       route" is the mechanism or market the reference project relies on most. */
    id: 'scaleRepeatability', pillar: 'capital', n: 12, gradedBy: GRADED_BY.ANCHOR,
    label: ['Scale and repeatability', '规模与可复制性'],
    question: ['After the first project, is there room for a second and a tenth?',
               '做完第一个项目之后，还有没有做第二个、第十个的空间？'],
    measure: ['How many further reference projects fit inside published connection headroom and inside the volume of the main revenue route without becoming more than a tenth of it.',
              '在已公布的并网裕度之内、且合计不超过主要收入渠道体量十分之一的前提下，还能再容纳多少个参考项目。'],
    open: ['5 = room for ten more', '5 = 还能再做十个'],
    anchors: {
      5: ['Ten or more further reference projects fit, in regions served by one operator',
          '还可容纳十个及以上参考项目，且同属一家运营商的服务区域'],
      4: ['Five to nine fit; or ten fit only across several operators or price zones',
          '还可容纳五至九个；或要跨多家运营商、多个价区才能凑足十个'],
      3: ['Two to four fit',
          '还可容纳二至四个'],
      2: ['A second project fits only by competing with the first for the same capacity or the same procurement round',
          '第二个项目只能与第一个项目争同一份容量或同一轮采购'],
      1: ['One-off: capacity or the main revenue route is allocated to a handful of projects and no further allocation is scheduled',
          '一次性机会：容量或主要收入渠道只分配给少数几个项目，且没有后续分配安排'],
    },
  },
];

export const DIMENSION_IDS = DIMENSIONS.map(d => d.id);

/** Every dimension read against written anchors: all but asset return. */
export const ANCHORED_DIMENSIONS = DIMENSIONS.filter(d => d.gradedBy === GRADED_BY.ANCHOR);

/** The twelve non-return dimensions a person grades, in the plan's numbering. */
export const GRADED_DIMENSIONS = DIMENSIONS.filter(d => d.n !== null);

const BY_ID = new Map(DIMENSIONS.map(d => [d.id, d]));

export function dimension(id){
  return BY_ID.get(id) || null;
}

export function dimensionsIn(pillar){
  return DIMENSIONS.filter(d => d.pillar === pillar);
}

/** The anchor a grade was measured against, or null when either is unknown. */
export function anchorText(dimensionId, grade){
  return BY_ID.get(dimensionId)?.anchors[grade] || null;
}

/* ---------------------------------------------------------------------------
   THE GRADE RECORD (plan §3.3)
   --------------------------------------------------------------------------- */

/** Direction over the last 24 months. */
export const TREND = ['improving', 'stable', 'deteriorating'];

export const TREND_LABEL = {
  improving:     ['Improving', '趋于改善'],
  stable:        ['Stable', '保持稳定'],
  deteriorating: ['Deteriorating', '趋于恶化'],
};

/**
 * What a grade rests on.
 *
 * PRACTITIONER is for a dimension with NO PUBLIC EVIDENCE AT ALL: nothing to
 * cite, so the grade is the analyst's judgement and says so. It carries no
 * evidence and no public reason, and the reason lives in the private overlay.
 *
 * It is NOT how the analyst records a view that departs from what sources
 * support. That is the `held` layer below, which sits on top of a sourced
 * grade and strips nothing from it. A record that has evidence or a public
 * reason and calls itself practitioner is refused, and told to use `held`.
 */
export const BASIS = {
  OFFICIAL: 'official',
  THIRD_PARTY: 'third-party',
  DERIVED: 'derived',
  PRACTITIONER: 'practitioner',
};

export const BASIS_LABEL = {
  [BASIS.OFFICIAL]:     ['Official source', '官方来源'],
  [BASIS.THIRD_PARTY]:  ['Third-party source', '第三方来源'],
  [BASIS.DERIVED]:      ['Derived on this platform', '本平台推算'],
  [BASIS.PRACTITIONER]: ['Practitioner judgement', '从业者判断'],
};

/** Who wrote a record. Recorded, never displayed. */
export const AUTHOR = ['analyst', 'rule', 'agent'];

const isPair = (v) => Array.isArray(v) && v.length === 2
  && v.every(s => typeof s === 'string' && s.trim().length > 0);

/* A real calendar day, written YYYY-MM-DD. The round trip rejects 2026-02-30,
   which a pattern alone would accept. */
const isDay = (v) => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const t = Date.parse(`${v}T00:00:00Z`);
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === v;
};

const stamp = (record, at) => {
  if (!isDay(record.asOf)) at('asOf must be a YYYY-MM-DD date');
  if (!AUTHOR.includes(record.author)) at(`author must be one of ${AUTHOR.join(', ')}`);
  if (record.lockedUntil !== null && !isDay(record.lockedUntil)){
    at('lockedUntil must be null or a YYYY-MM-DD date — a pin has an end, or it is not set');
  }
};

/**
 * Problems with one grade record. Empty array means valid.
 *
 * Strict about the things that would let a grade drift from its ruler: the
 * grade is a whole number from 1 to 5 because the anchors are five written
 * lines and a 3.5 is measured against none of them; and the basis is named,
 * because a grade whose provenance is unstated cannot be challenged.
 */
export function validateGrade(record){
  if (!record || typeof record !== 'object') return ['grade record is missing'];
  const problems = [];
  const at = (m) => problems.push(`${record.dimension || '?'}: ${m}`);

  if (!BY_ID.has(record.dimension)) at(`unknown dimension "${record.dimension}" — the vocabulary is fixed, see DIMENSIONS`);
  if (!Number.isInteger(record.grade) || record.grade < 1 || record.grade > 5){
    at('grade must be a whole number from 1 to 5 — the anchors are five lines and nothing sits between them');
  }

  /* The metric sits BESIDE the grade and is optional: most dimensions have no
     number yet. When present it must be usable, because an archetype's limit is
     compared with it directly. */
  if (record.metric !== undefined && record.metric !== null){
    if (typeof record.metric !== 'object' || Array.isArray(record.metric)) at('metric must be an object of named figures');
    else {
      for (const [key, value] of Object.entries(record.metric)){
        if (key === 'currency'){
          if (typeof value !== 'string' || !/^[A-Z]{3}$/.test(value)) at('metric.currency must be a three-letter code');
        } else if (typeof value !== 'number' || !Number.isFinite(value)){
          at(`metric.${key} must be a finite number`);
        }
      }
    }
  }

  if (!TREND.includes(record.trend)) at(`trend must be one of ${TREND.join(', ')}`);
  else if (record.trend !== 'stable' && !isPair(record.trendCause)){
    at('trendCause must be an [en, zh] pair — a trend with no named cause is a mood');
  }
  if (record.trendCause !== undefined && record.trendCause !== null && !isPair(record.trendCause)){
    at('trendCause must be an [en, zh] pair');
  }

  if (!Object.values(BASIS).includes(record.basis)) at(`basis must be one of ${Object.values(BASIS).join(', ')}`);
  const practitioner = record.basis === BASIS.PRACTITIONER;

  if (!Array.isArray(record.evidence) || record.evidence.some(e => typeof e !== 'string' || !e.trim())){
    at('evidence must be an array of source-register ids');
  } else if (!record.evidence.length && !practitioner){
    at('no evidence — only a practitioner grade may stand without a source');
  }

  if (practitioner){
    /* Evidence or a public reason means sources DO say something. Then the
       sourced reading belongs in the record and the analyst's own view on top
       of it — relabelling the whole grade would strip what anyone can check. */
    const sourced = (Array.isArray(record.evidence) && record.evidence.length > 0)
      || (record.reason !== undefined && record.reason !== null);
    if (sourced){
      at('a practitioner grade carries no evidence and no public reason — where sources support a grade, keep a sourced basis and record your own view in `held`');
    }
  } else if (!isPair(record.reason)){
    at('reason must be an [en, zh] pair');
  }

  if (record.held !== undefined){
    if (practitioner) at('a practitioner grade is already the analyst\'s view — `held` sits on a sourced grade, and there is none here to depart from');
    for (const p of validateHeld(record.held)) at(`held: ${p}`);
  }

  stamp(record, at);
  return problems;
}

/* ---------------------------------------------------------------------------
   THE HELD LAYER — what the analyst actually believes, on top of what sources
   support.

   A sourced grade says what a public reader can verify. The analyst often
   knows more, from deals, and that knowledge cannot be published as a reason.
   Before this layer the only way to record it was to relabel the whole grade
   "practitioner", which threw away the sourced reading and its evidence. So
   the two are kept apart and BOTH are kept:

       grade, basis, evidence, reason     what public sources support
       held: { grade, confidence,         what the analyst believes
               asOf, reviewBy, publicNote }

   THE GAP BETWEEN THEM IS THE POINT. It marks exactly where the analyst's
   judgement departs from what anyone can read, and a page can say so: "1 ·
   practitioner view; public sources support 2".

   Four rules, each enforced somewhere a test can reach:

     · IT GOES STALE. `reviewBy` is required and at most twelve months after
       `asOf`. Past that date the layer lapses: scores fall back to the sourced
       grade and the lapse is reported, not silently dropped.
     · IT STRIPS NOTHING. Adding or removing it never touches the sourced
       grade, its reason or its evidence. It is written and removed at its own
       path — see view/schema/view.mjs.
     · ONLY THE ANALYST WRITES IT. No rule and no agent may create, change or
       remove it, whatever else they are one day allowed to write.
     · THE REAL REASON STAYS PRIVATE. `publicNote` is at most one line that is
       safe to publish. The reason is in the private overlay.

   Confidence is shown and does nothing else. It does not weight a score: a
   discounted grade would be a second grade nobody had written down.
   --------------------------------------------------------------------------- */

export const CONFIDENCE = ['high', 'medium', 'low'];

export const CONFIDENCE_LABEL = {
  high:   ['High confidence', '把握较大'],
  medium: ['Medium confidence', '把握中等'],
  low:    ['Low confidence', '把握较小'],
};

/** Experience goes stale. A held view must be looked at again within this many months. */
export const HELD_MAX_MONTHS = 12;

const addMonths = (day, months) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
};

/** Problems with one held layer. Empty array means valid. */
export function validateHeld(held){
  if (!held || typeof held !== 'object' || Array.isArray(held)) return ['must be an object'];
  const problems = [];
  if (!Number.isInteger(held.grade) || held.grade < 1 || held.grade > 5) problems.push('grade must be a whole number from 1 to 5');
  if (!CONFIDENCE.includes(held.confidence)) problems.push(`confidence must be one of ${CONFIDENCE.join(', ')}`);
  if (!isDay(held.asOf)) problems.push('asOf must be a YYYY-MM-DD date');
  if (!isDay(held.reviewBy)) problems.push('reviewBy is required, as a YYYY-MM-DD date — experience goes stale');
  else if (isDay(held.asOf)){
    if (held.reviewBy <= held.asOf) problems.push('reviewBy must be after asOf');
    else if (held.reviewBy > addMonths(held.asOf, HELD_MAX_MONTHS)){
      problems.push(`reviewBy is more than ${HELD_MAX_MONTHS} months after asOf`);
    }
  }
  if (held.publicNote !== null && !isPair(held.publicNote)) problems.push('publicNote must be null or an [en, zh] pair');
  for (const key of Object.keys(held)){
    if (!['grade', 'confidence', 'asOf', 'reviewBy', 'publicNote'].includes(key)) problems.push(`"${key}" is not a field of a held view — a reason or a figure belongs in the private overlay`);
  }
  return problems;
}

const asGrade = (v) => Number.isInteger(v) && v >= 1 && v <= 5 ? v : null;

/**
 * The grade to score with, and everything a page needs to say where it came
 * from. THE ONE PLACE this is decided: every score, knock-out and band check
 * reads a grade through here.
 *
 * `entry` is a bare grade or a grade record. `on` is the evaluation date,
 * YYYY-MM-DD, and it is an argument rather than the clock so that this stays
 * pure and a test can stand on either side of a review date.
 *
 *   grade      the grade to use: held while it is live, sourced otherwise
 *   sourced    what public sources support, always
 *   held       the held grade, or null when there is no held layer
 *   applied    true when the held grade is the one in use
 *   lapsed     true when a held layer exists and its review date has passed
 *
 * The held grade applies up to and including `reviewBy`. A record with a held
 * layer cannot be evaluated without a date: guessing which side of the review
 * date "now" falls on is exactly the silent choice this function exists to
 * prevent, so it throws.
 */
export function effectiveGrade(entry, on){
  const record = entry && typeof entry === 'object' ? entry : null;
  const sourced = asGrade(record ? record.grade : entry);
  const layer = record?.held ?? null;
  if (!layer) return { grade: sourced, sourced, held: null, applied: false, lapsed: false, confidence: null, reviewBy: null };

  if (!isDay(on)) throw new Error('a grade with a held layer needs an evaluation date (YYYY-MM-DD) to decide whether the layer has lapsed');
  const applied = on <= layer.reviewBy;
  return {
    grade: applied ? asGrade(layer.grade) : sourced,
    sourced,
    held: asGrade(layer.grade),
    applied,
    lapsed: !applied,
    confidence: layer.confidence,
    reviewBy: layer.reviewBy,
  };
}

/** A grade record with its held layer removed. The sourced record, exactly as it was. */
export function sourcedOnly(record){
  if (!record || typeof record !== 'object' || !('held' in record)) return record;
  const { held, ...rest } = record;
  return rest;
}

/* ---------------------------------------------------------------------------
   THE VERDICT (plan §3.6)
   --------------------------------------------------------------------------- */

/**
 * Six words. "Selective" is retired because it is where everything went to
 * hide. NOT_ACCESSIBLE and AVOID are different statements: the first says a
 * knock-out applies and the market may be excellent; the second says the
 * market is a structural mismatch. A page must keep them apart.
 */
export const VERDICT = {
  ENTER_NOW: 'enter-now',
  BUILD_POSITION: 'build-position',
  OPPORTUNISTIC: 'opportunistic',
  WAIT: 'wait',
  AVOID: 'avoid',
  NOT_ACCESSIBLE: 'not-accessible',
};

export const VERDICT_IDS = Object.values(VERDICT);

export const VERDICT_LABEL = {
  [VERDICT.ENTER_NOW]:      ['Enter now', '现在进入'],
  [VERDICT.BUILD_POSITION]: ['Build position', '提前布局'],
  [VERDICT.OPPORTUNISTIC]:  ['Opportunistic', '择机而动'],
  [VERDICT.WAIT]:           ['Wait', '暂时观望'],
  [VERDICT.AVOID]:          ['Avoid', '回避'],
  [VERDICT.NOT_ACCESSIBLE]: ['Not accessible', '无法进入'],
};

export const VERDICT_MEANING = {
  [VERDICT.ENTER_NOW]: [
    'Clears this archetype\'s bar today and the window is open',
    '今天就达到这类投资者的门槛，而且窗口正开着'],
  [VERDICT.BUILD_POSITION]: [
    'Attractive, but entry takes time: secure sites, capacity or partners now, commit capital on a named trigger',
    '有吸引力，但进场需要时间：现在先锁定场址、容量或合作伙伴，待指定的触发条件出现再投入资本'],
  [VERDICT.OPPORTUNISTIC]: [
    'Only specific situations: a named sub-region, a contracted asset, a motivated seller',
    '只做特定机会：指定的子区域、有合同的资产，或急于出手的卖方'],
  [VERDICT.WAIT]: [
    'Not now. Carries a named trigger and a date',
    '现在不做。须写明触发条件与复核日期'],
  [VERDICT.AVOID]: [
    'A structural mismatch with no trigger inside the horizon',
    '结构性不匹配，在可预见的期限内没有能改变判断的触发条件'],
  [VERDICT.NOT_ACCESSIBLE]: [
    'A knock-out applies. The market may be good; it is not open to this investor',
    '触及否决项。市场本身可能很好，只是这类投资者进不去'],
};

/** How the investor gets in. A limit in archetypes.js may bind on some routes and not others. */
export const ROUTE = ['greenfield', 'ready-to-build', 'operating', 'co-invest'];

export const ROUTE_LABEL = {
  'greenfield':     ['Greenfield', '绿地开发'],
  'ready-to-build': ['Ready-to-build', '具备开工条件'],
  'operating':      ['Operating', '在运资产'],
  'co-invest':      ['Co-investment', '跟投'],
};

/**
 * The four investors. Named here, as vocabulary, so that a verdict can be
 * validated without this module importing the tables that describe them;
 * archetypes.js holds everything else.
 */
export const ARCHETYPE_IDS = ['strategic', 'infraFund', 'foreignFirstTimer', 'developer'];

/** A verdict argues from at most this many dimensions. A fourth reason is a list, not an argument. */
export const MAX_BECAUSE = 3;

/**
 * Problems with one verdict record. Empty array means valid.
 *
 * `despite` is required and that is the point of the shape: a verdict with no
 * counter-argument recorded is an assertion. `because` is capped so the author
 * has to choose. A WAIT must say what it is waiting for and when it will be
 * looked at again, or it is an AVOID that has not admitted it.
 *
 * Nothing here checks the call against a score. That is deliberate — the score
 * checks the author in archetypes.js and never decides whether a record is
 * well-formed.
 */
export function validateVerdict(record){
  if (!record || typeof record !== 'object') return ['verdict record is missing'];
  const problems = [];
  const at = (m) => problems.push(`${record.archetype || '?'}: ${m}`);

  if (!ARCHETYPE_IDS.includes(record.archetype)) at(`unknown archetype "${record.archetype}"`);
  if (!VERDICT_IDS.includes(record.call)) at(`call must be one of ${VERDICT_IDS.join(', ')}`);
  if (!ROUTE.includes(record.route)) at(`route must be one of ${ROUTE.join(', ')}`);
  if (record.where !== null && record.where !== undefined && !isPair(record.where)){
    at('where must be null or an [en, zh] pair naming the sub-region');
  }

  if (!Array.isArray(record.because) || !record.because.length){
    at('because must name at least one dimension');
  } else {
    if (record.because.length > MAX_BECAUSE) at(`because carries ${record.because.length} entries — at most ${MAX_BECAUSE}`);
    for (const reason of record.because){
      if (!BY_ID.has(reason?.dimension)) at(`because names an unknown dimension "${reason?.dimension}"`);
      if (!isPair(reason?.text)) at(`because/${reason?.dimension || '?'}: text must be an [en, zh] pair`);
    }
  }

  if (!isPair(record.despite)){
    at('despite is required, as an [en, zh] pair — the strongest argument against the call');
  }

  if (!Array.isArray(record.changesIf) || record.changesIf.some(t => typeof t !== 'string' || !t.trim())){
    at('changesIf must be an array of trigger ids');
  }
  if (record.reviewBy !== null && record.reviewBy !== undefined && !isDay(record.reviewBy)){
    at('reviewBy must be null or a YYYY-MM-DD date');
  }
  /* Optional. When the score disagrees with the call, this is the reason the
     page shows beside the flag — the analyst's answer to the check. */
  if (record.scoreNote !== undefined && record.scoreNote !== null && !isPair(record.scoreNote)){
    at('scoreNote must be an [en, zh] pair');
  }
  if (record.call === VERDICT.WAIT){
    if (!Array.isArray(record.changesIf) || !record.changesIf.length) at('a wait names the trigger it is waiting for');
    if (!isDay(record.reviewBy)) at('a wait carries a review date');
  }

  stamp(record, at);
  return problems;
}
