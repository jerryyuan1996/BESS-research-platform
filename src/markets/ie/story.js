/* Ireland: the complete bilingual script signed off at G-1 on 1 November 2026,
   reconciled to the build evidence of 2 November (ie-build-evidence.md).
   Plain content only; every figure resolves through storyBindings.js.

   Two sentences differ from the storyboard cells because the evidence file
   rules on them: the services line (§7, B-IE-COPY) and the offered-capacity
   sentence (§2, B-IE-PARTICIPATION). Both are marked where they sit.        */
import { IE_SOURCES } from './data/storyEvidence.js';

/* §7's exact services wording, used wherever the story mentions services. */
export const SERVICES_LABEL = [
  'System services: assumed, declining and uncontracted income included within trading; {ds3Name} tariff rights end by {longStop}.',
  '辅助服务：交易收入中计入假设递减、未锁定的收入；{ds3Name}费率权利最迟于{longStop}结束。',
];

const shot = (id, chapter, scene, question, copy, meaning, marker, controls, claims, rest = {}) =>
  ({ id, chapter, scene, question, copy, meaning, marker, controls, claims, ...rest });

const fair = (change) => ({ level: 'fair', change });

export const story = {
  storySchemaVersion: 1,
  contentVersion: '2026-11-02',
  marketId: 'ie',
  systemBoundary: [
    'Ireland · all-island SEM, Republic-of-Ireland financial assumptions',
    '爱尔兰 · 全岛单一电力市场，采用爱尔兰共和国的财务假设',
  ],
  supportedLocales: ['en', 'zh'],
  playRef: 'ie-cap-6h',
  reviewedAgainst: {
    playRef: 'ie-cap-6h',
    hours: 6,
    call: 'wait',
    lens: 'infraFund',
    on: '2026-11-01',
    commit: '7e00c1a0abac88d9bb4355624febb0bb571ff381',
  },

  /* Tokens a string may use. A figure, a date and an identifier that carries a
     digit all arrive this way; the contract forbids typed figures in copy. */
  tokens: [
    'call', 'playName', 'cardFigures', 'nextAction', 'playDuration',
    'securedShare', 'securedTenor', 'semGoLive', 'isemGoLive', 'ds3Start',
    'snspLimit', 'snspDate', 'vcAward', 'vcServicesWord', 'longStop',
    'roMaxYears', 'dataCentreShare', 'dataCentreYear', 'crmContextDuration',
    'crmBand', 'newBatteryOfferedShare', 'sourceCheckedDate',
    'ds3Name', 'tor1', 'tor2',
  ],

  sources: IE_SOURCES,

  claims: {
    'CL-IE-18': { sources: ['SRC-IE-01', 'SRC-IE-03'] },
    'CL-IE-19': { sources: ['SRC-IE-03', 'SRC-IE-04'] },
    'CL-IE-03': { sources: ['SRC-IE-05', 'SRC-IE-04'] },
    'CL-IE-04': { sources: ['SRC-IE-07'] },
    'CL-IE-05': { sources: ['SRC-IE-08', 'SRC-IE-24'] },
    'CL-IE-06': { sources: ['SRC-IE-07'] },
    'CL-IE-07': { sources: ['SRC-IE-12', 'SRC-IE-13'] },
    'CL-IE-08': { sources: ['SRC-IE-21'] },
    'CL-IE-09': { sources: ['SRC-IE-16', 'SRC-IE-17', 'SRC-IE-21', 'SRC-IE-S1'] },
    'CL-IE-10': { sources: ['SRC-IE-14', 'SRC-IE-22'] },
    'CL-IE-11': { sources: ['SRC-IE-18'] },
    'CL-IE-12': { sources: ['SRC-IE-19', 'SRC-IE-20'] },
    'CL-IE-13': { sources: ['SRC-IE-17'] },
    'CL-IE-14': { sources: ['REPO-IE-LIVE'] },
    'CL-IE-15': { sources: ['SRC-IE-22'] },
    'CL-IE-16': { sources: ['SRC-IE-21'] },
    'CL-IE-17': { sources: ['SRC-IE-24'] },
  },

  opening: {
    id: 'ie-00',
    chapter: 'opening',
    scene: 'ie-thumbnail',
    question: ['What is the call here, and what carries it?', '这里的投资判断是什么，靠什么支撑？'],
    copy: [
      '{call} · {playName} · {cardFigures} · {nextAction} A capacity contract carries this case: it secures part of revenue for {securedTenor} years, with merchant exposure after it ends unless a new contract is won. '
        + SERVICES_LABEL[0] + ' Follow the story from a small island grid to the contract.',
      '{call} · {playName} · {cardFigures} · {nextAction}这项投资靠容量合同支撑：合同在{securedTenor}年内锁定部分收入；到期后若未赢得新合同，则承担市场风险。'
        + SERVICES_LABEL[1] + '沿着故事，从一个小型岛屿电网看到这份合同。',
    ],
    meaning: null,
    marker: { level: 'play' },
    controls: [['Start the story', '开始阅读'], ['Go to the investment case', '查看投资方案']],
    claims: ['CL-IE-14'],
  },

  chapters: [
    {
      id: 'origins',
      title: ['Origins', '系统起点'],
      shots: [
        shot('ie-01', 'origins', 'ie-island',
          ['What kind of grid is this?', '这是一个怎样的电网？'],
          ['Ireland and Northern Ireland run one power system on one island. Its links to Great Britain are direct-current cables: they trade power but do not share frequency. When a large plant trips, the island must catch the fall on its own.',
            '爱尔兰与北爱尔兰在同一座岛上运行同一个电力系统。它与英国之间以直流海缆相连：可以交易电力，但不共享频率。大型机组跳闸时，岛上电网必须自行稳住频率下跌。'],
          ['A small island buys both fast response and firm evening capacity; this play is paid for the second.',
            '小型岛屿电网既要采购快速响应，也要采购晚高峰的可靠容量；本方案靠后者获得收入。'],
          fair(['the analyst’s review of the interconnector list and an operator statement of the synchronous boundary.',
            '分析师复核互联线路清单，以及运营商对同步区边界的正式表述。']),
          [['One system', '同一系统'], ['Trading links', '交易联系']],
          ['CL-IE-18', 'CL-IE-12'],
          {
            labels: {
              system: ['One power system, two jurisdictions', '一个电力系统，两个司法辖区'],
              dc: ['Power transfer by DC', '直流输电'],
              planned: ['Planned', '规划中'],
              ireland: ['Ireland', '爱尔兰'],
              northernIreland: ['Northern Ireland', '北爱尔兰'],
              greatBritain: ['Great Britain', '英国'],
              france: ['France', '法国'],
            },
          }),
      ],
    },
    {
      id: 'choices',
      title: ['Historical choices', '历史选择'],
      shots: [
        shot('ie-02', 'choices', 'ie-history',
          ['Why does a battery here sell capacity years ahead?', '为什么这里的电池要提前数年出售容量？'],
          ['On {semGoLive} the two jurisdictions merged their wholesale markets into one all-island market. Its redesign, live from {isemGoLive}, added a capacity auction that buys firm megawatts years before they are needed.',
            '{semGoLive}，两个司法辖区将各自的批发市场合并为一个全岛市场。自{isemGoLive}起实施的新市场设计，增加了容量拍卖，在实际需要之前数年采购可靠容量。'],
          ['The capacity auction this play relies on is part of the market’s design, not a scheme added for batteries.',
            '本方案所依赖的容量拍卖是市场设计的组成部分，并非专为电池设立的机制。'],
          fair(['reviewed locators in the SEM Committee’s market-design decisions for the capacity mechanism and its first auction.',
            '在单一电力市场委员会的市场设计决定中，核实容量机制及其首次拍卖的具体出处。']),
          [['Wholesale market', '批发市场'], ['Capacity auction', '容量拍卖'], ['Open source', '查看来源']],
          ['CL-IE-18', 'CL-IE-09'],
          {
            labels: {
              wholesale: ['Wholesale market', '批发市场'],
              capacity: ['Capacity auction', '容量拍卖'],
              ahead: ['Years ahead of delivery', '提前数年采购'],
            },
          }),

        shot('ie-03', 'choices', 'ie-snsp',
          ['Why did this grid start paying for speed?', '这个电网为什么开始为“快速”付费？'],
          ['To use more of its wind, the operators set out in {ds3Start} to let more non-synchronous power run at once. They raised the limit step by step, reaching {snspLimit} in {snspDate}. Each step needed fast reserve and stability from other sources; {ds3Name} system services paid for them.',
            '为了用上更多风电，运营商自{ds3Start}起逐步提高同时运行的非同步电源占比上限，并于{snspDate}达到{snspLimit}。每提高一步，都需要其他资源提供快速备用和系统稳定支撑；{ds3Name}系统服务为此付费。'],
          /* B-IE-COPY: the storyboard's “this play does not rely on it” is
             replaced by §7's exact services wording. */
          [SERVICES_LABEL[0], SERVICES_LABEL[1]],
          fair(['reviewed extracts from the operators’ {ds3Name} pages dating each SNSP step.',
            '经复核的运营商{ds3Name}资料，列明每次上调非同步电源占比的日期。']),
          [['Raise the limit', '提高上限'], ['Show what it needs', '显示所需支撑']],
          ['CL-IE-19'],
          {
            labels: {
              limit: ['Share of non-synchronous power allowed', '允许的非同步电源占比'],
              fastReserve: ['Fast reserve', '快速备用'],
              inertia: ['Inertia', '转动惯量'],
            },
          }),

        shot('ie-04', 'choices', 'ie-services',
          ['What paid for Ireland’s first batteries?', '是什么为爱尔兰首批电池付费？'],
          ['In {vcAward}, the operators ran a competition for fixed-term contracts to provide {vcServicesWord} fast reserve services at a capped volume. Every winner was a battery. Batteries that followed were paid the regulated {ds3Name} tariffs.',
            '{vcAward}，运营商就{vcServicesWord}快速备用服务举行竞争性采购，以限定总量授予固定期限合同，中标者全部是电池项目。此后建成的电池则按{ds3Name}监管费率获得报酬。'],
          ['The first batteries were sized for fast services; this play is sized for the capacity auction instead.',
            '首批电池按快速服务的需要设计；本方案则按容量拍卖的要求设计。'],
          fair(['the analyst’s review of the outcome note and the services’ technical terms extracted from the {ds3Name} protocol.',
            '分析师复核采购结果说明，并从{ds3Name}规程中摘录各项服务的技术条款。']),
          [['FFR', 'FFR'], ['POR', 'POR'], ['SOR', 'SOR'], ['{tor1}', '{tor1}'], ['{tor2}', '{tor2}'], ['Contract', '合同'], ['Tariff', '费率']],
          ['CL-IE-03'],
          {
            labels: {
              contract: ['Fixed-term contract', '固定期限合同'],
              tariff: ['Regulated tariff', '监管费率'],
            },
          }),
      ],
    },
    {
      id: 'tensions',
      title: ['Today’s tensions', '当下矛盾'],
      shots: [
        shot('ie-05', 'tensions', 'ie-longstop',
          ['Why are the regulated services tariffs ending?', '受监管的系统服务费率为什么终止？'],
          ['The regulators extended the {ds3Name} tariffs only until a new daily auction starts, or {longStop} at the latest, and ruled out any further extension. The new auction’s start date is not confirmed. After that, fast services are bought competitively, in a market the regulators already describe as over-procured.',
            '监管机构将{ds3Name}费率延期至新的日前系统服务拍卖启动为止，最迟不超过{longStop}，并明确不再延期。新拍卖的启动日期尚未确定。此后，快速服务将以竞争方式采购；监管机构已指出，这类备用目前采购过量。'],
          ['The model retains an assumed declining competitive-services contribution within trading. It is uncontracted and does not extend {ds3Name} tariffs.',
            '模型在交易收入中保留假设递减的竞争性辅助服务收入。该收入未锁定，也不代表{ds3Name}费率延期。'],
          fair(['a published go-live date and first results for the new auction, or a SEM Committee decision changing the long-stop.',
            '新拍卖公布上线日期及首批结果，或单一电力市场委员会作出变更最终截止日的决定。']),
          [['Tariffs', '监管费率'], ['New auction', '新拍卖'], ['After the long-stop', '截止日之后']],
          ['CL-IE-04', 'CL-IE-05', 'CL-IE-06'],
          {
            labels: {
              ends: ['Tariffs end: the earlier of the new auction’s start or the long-stop', '费率终止：以新拍卖启动或最终截止日中较早者为准'],
              noExtension: ['No further extension', '不再延期'],
              newAuction: ['New auction: start date not confirmed', '新拍卖：启动日期未确定'],
              backstop: ['Backstop procurement', '后备采购'],
            },
          }),

        shot('ie-06', 'tensions', 'ie-crm-chart',
          ['What does the capacity auction pay, and how much does it credit a battery?', '容量拍卖付多少钱，又给电池计入多少容量？'],
          /* B-IE-PARTICIPATION replaces the storyboard's “most qualified new
             batteries did not bid” with the offered-share sentence. */
          ['Each year the auction buys firm megawatts years ahead, for demand that keeps rising: data centres alone used {dataCentreShare} of metered electricity in {dataCentreYear}. The price per credited megawatt has risen, but the share of a {crmContextDuration}-hour battery’s power that the auction credits has fallen. Only {newBatteryOfferedShare} of qualified new battery capacity was offered. A contract won in an earlier auction keeps that auction’s credit, so what a project holds matters.',
            '容量拍卖每年提前数年采购可靠容量，以满足持续增长的需求：仅数据中心在{dataCentreYear}就占计量用电量的{dataCentreShare}。每计入MW的价格有所上升，但拍卖对{crmContextDuration}小时参考电池计入的功率比例却在下降。已获资格的新建电池容量中，仅{newBatteryOfferedShare}提交了报价。早先拍卖中赢得的合同沿用该轮的计入比例，因此项目实际持有的合同至关重要。'],
          ['The capacity contract carries this play; its value depends on the price and the credit the project actually holds.',
            '容量合同支撑本方案；其价值取决于项目实际持有的价格与计入比例。'],
          fair(['the price and de-rating factor in the project’s own capacity agreement, and the analyst’s review of the auction series.',
            '项目自身容量协议中的价格与折减系数，以及分析师对拍卖序列的复核。']),
          [['Clearing price', '出清价'], ['Storage credit', '储能计入比例'], ['Batteries awarded', '电池中标量'], ['Show definitions', '查看口径']],
          ['CL-IE-07', 'CL-IE-08', 'CL-IE-11', 'CL-IE-15', 'CL-IE-16'],
          {
            /* The offered share is withheld under B-IE-RIGHTS with the rest of
               the numeric layer. This is the same copy with that one sentence
               removed, so the page never prints an em dash or a typed figure. */
            copyWhenWithheld: [
              'Each year the auction buys firm megawatts years ahead, for demand that keeps rising: data centres alone used {dataCentreShare} of metered electricity in {dataCentreYear}. The price per credited megawatt has risen, but the share of a {crmContextDuration}-hour battery’s power that the auction credits has fallen. A contract won in an earlier auction keeps that auction’s credit, so what a project holds matters.',
              '容量拍卖每年提前数年采购可靠容量，以满足持续增长的需求：仅数据中心在{dataCentreYear}就占计量用电量的{dataCentreShare}。每计入MW的价格有所上升，但拍卖对{crmContextDuration}小时参考电池计入的功率比例却在下降。早先拍卖中赢得的合同沿用该轮的计入比例，因此项目实际持有的合同至关重要。',
            ],
            labels: {
              price: ['Clearing price', '出清价'],
              priceUnit: ['EUR per de-rated MW per year', '欧元/折减MW/年'],
              credit: ['Storage credit', '储能计入比例'],
              creditUnit: ['de-rating factor', '折减系数'],
              awarded: ['Battery storage awarded', '中标电池储能'],
              awardedUnit: ['de-rated MW', '折减MW'],
              newer: ['New', '新建'],
              existing: ['Existing', '既有'],
              initialPack: ['Initial pack, auction not yet held', '初步信息包，拍卖尚未举行'],
              longStop: ['{ds3Name} tariffs end by here', '{ds3Name}费率最迟于此结束'],
            },
            caption: ['T-4 auctions by delivery year; de-rated megawatts, not nameplate. Source: SEMO auction results and information packs',
              '按交付年度列示T-4拍卖；折减MW，非铭牌容量。来源：SEMO拍卖结果及信息包'],
          }),
      ],
    },
    {
      id: 'battery',
      title: ['Add a battery', '加入电池'],
      shots: [
        shot('ie-07', 'battery', 'ie-seconds',
          ['What does a battery do here?', '电池在这里起什么作用？'],
          ['The same battery can answer a frequency fall within seconds, or deliver its stored energy across the evening peak. Fast response uses little energy; the evening needs the battery full. A {playDuration}-hour battery can do both jobs, but it cannot promise the same megawatts twice.',
            '同一组电池既能在数秒内响应频率下跌，也能在晚高峰期间持续放出储存的电量。快速响应耗电很少；晚高峰则需要电池充满待命。{playDuration}小时电池两项任务都能承担，但同一份功率不能重复承诺。'],
          ['The capacity obligation requires charged and available power. Assumed services income remains exposed and must share physical capability with trading.',
            '容量义务要求电池充好电并保持可用。假设辅助服务收入仍有风险，并须与交易共用实际功率和电量。'],
          fair(['the asset’s tested usable energy and the capacity contract’s availability and performance terms.',
            '项目经测试的可用电量，以及容量合同中的可用性与履约条款。']),
          [['Frequency fall', '频率下跌'], ['Evening peak', '晚高峰'], ['Reset example', '重置示例']],
          ['CL-IE-09'],
          {
            labels: {
              fast: ['Fast response: power for seconds', '快速响应：数秒的功率'],
              evening: ['Evening peak: energy for hours', '晚高峰：数小时的电量'],
              once: ['Same megawatts, promised once', '同一份功率，只能承诺一次'],
              example: ['Example', '示例'],
            },
          }),

        shot('ie-08', 'battery', 'ie-duration',
          ['Why is this play {playDuration} hours?', '为什么本方案选择{playDuration}小时？'],
          ['Longer batteries receive more capacity credit and need more capital. The reviewed candidate is {playDuration} hours: its hold IRR is highest among the reviewed alternatives, but remains below the fund’s target. The fund therefore watches while it verifies project award terms, construction cost and executable trading income.',
            '更长时长可获得更多计入容量，也需要更多资本。已复核的候选为{playDuration}小时：其长持IRR在已比较方案中最高，但仍低于基金目标。因此基金保持观察，继续核实项目授标条款、建设成本及可执行交易收入。'],
          ['Compare return, capital required and value per MW on the same auction vintage; a higher IRR alone does not establish an investable case.',
            '应按同一拍卖批次比较回报、所需资本及每MW价值；更高的IRR本身不能证明方案值得投资。'],
          fair(['the analyst’s ruling on the model’s de-rating curve, and a duration result rerun on the auction’s published factors.',
            '分析师就模型折减曲线作出裁定，并按拍卖公布的折减系数重新测算最佳时长。']),
          [['Current play', '当前方案'], ['Shorter teaching battery', '更短时长示例'], ['Longer teaching battery', '更长时长示例'], ['Open duration evidence', '查看时长依据']],
          ['CL-IE-10', 'CL-IE-14', 'CL-IE-15'],
          {
            labels: {
              built: ['Built megawatts', '建成功率'],
              credited: ['Credited megawatts', '计入容量'],
              capital: ['More capital', '更多资本投入'],
              example: ['Example', '示例'],
            },
          }),
      ],
    },
    {
      id: 'payment',
      title: ['Who pays', '谁来付钱'],
      shots: [
        shot('ie-09', 'payment', 'ie-contract',
          ['What does the capacity contract secure, and until when?', '容量合同锁定了什么，锁定到什么时候？'],
          ['A new project that wins can fix its capacity payment for up to {roMaxYears} years. In return it sells a reliability option: when market prices rise above a strike price, it pays the difference back on its credited megawatts, so it must be charged and available when prices spike. The contract pays for being there; energy is sold separately.',
            '新建项目中标后，最长可将容量付款锁定{roMaxYears}年。作为交换，它出售一份可靠性期权：当市场价格高于执行价时，须按计入容量返还差价，因此价格飙升时电池必须充满并可用。合同付费的是“随时可用”，电量另行出售。'],
          /* §7's exact secured-revenue wording: the storyboard's shorter Meaning
             dropped the merchant tail, so the ruled sentence is used. */
          ['Conditional on obtaining and performing the modelled capacity award, capacity secures {securedShare} of first-year revenue for {securedTenor} years. After expiry, revenue is merchant unless a new contract is won; renewal is an assumption.',
            '以取得并履行模型中的容量授标为条件，容量付款在{securedTenor}年内锁定首年收入的{securedShare}。到期后，若未赢得新合同，则承担市场风险；续期仍是假设。'],
          fair(['the project’s signed capacity agreement, its de-rated quantity and its delivery milestones.',
            '项目已签署的容量协议、其折减容量及交付里程碑。']),
          [['During the contract', '合同期内'], ['Scarcity example', '稀缺时段示例'], ['After expiry', '到期以后'], ['Contract evidence', '合同证据']],
          ['CL-IE-09', 'CL-IE-14'],
          {
            labels: {
              capacity: ['Capacity payment', '容量付款'],
              strike: ['Strike price', '执行价'],
              payback: ['Difference paid back', '超额部分返还'],
              merchant: ['Merchant after expiry', '到期后承担市场风险'],
              unverified: ['Project contract not verified', '项目合同尚未核验'],
            },
          }),

        shot('ie-10', 'payment', 'ie-payers',
          ['Who pays the battery, and for what?', '谁向电池付钱，为什么付？'],
          ['Suppliers fund capacity payments through the market operator. Energy is sold through wholesale markets, and grid operators procure services. The model includes capacity, wholesale trading and an assumed declining competitive-services contribution within trading; those services are uncontracted.',
            '售电商通过市场运营商为容量付款出资；电量通过批发市场出售；电网运营商采购系统服务。模型计入容量、批发交易，以及交易收入中一项假设递减的竞争性辅助服务收入；该辅助服务收入未锁定。'],
          ['Verify each buyer, contract and settlement obligation. The reference is a screening case, not proof that a new entrant already holds those revenues.',
            '须核实每类买方、合同与结算义务。参考情景用于初筛，不代表新进入者已经取得这些收入。'],
          fair(['verified settlement terms for the project, and the new auction’s rules and first results.',
            '核实项目的结算条款，以及新拍卖的规则与首批结果。']),
          [['Capacity', '容量'], ['Energy', '电量'], ['System services', '系统服务']],
          ['CL-IE-04', 'CL-IE-09'],
          {
            labels: {
              capacity: ['Capacity', '容量'],
              capacityUnit: ['EUR per de-rated MW per year', '欧元/折减MW/年'],
              energy: ['Energy', '电量'],
              energyUnit: ['EUR/MWh', '欧元/MWh'],
              services: [SERVICES_LABEL[0], SERVICES_LABEL[1]],
            },
          }),
      ],
    },
    {
      id: 'investment',
      title: ['The investment', '回到投资'],
      shots: [
        shot('ie-11', 'investment', 'ie-factors',
          ['What would make this play less attractive?', '什么变化会让本方案失去吸引力？'],
          ['Four things could weaken the case: a redesign of the capacity auction, now under consultation; storage credit falling further; more batteries and new interconnection competing for the evening; and a delay that puts the contract at risk. Check the project’s contract and delivery date before pricing. Then: {nextAction}',
            '有四类变化可能削弱投资逻辑：容量拍卖机制改革（目前正在征询意见）；储能计入比例进一步下降；更多电池和新增互联线路争夺晚高峰；以及工程延误危及容量合同。定价前，先核实项目合同与交付日期。随后：{nextAction}'],
          ['The entry price must work on the contract the project holds, its delivery date and the downside.',
            '进入价格须与项目所持合同、交付日期及下行情景相匹配。'],
          fair(['the SEM Committee’s decision on the redesign, the next auction’s final de-rating factors, or the project’s signed agreement and milestones.',
            '单一电力市场委员会就机制改革作出的决定、下一轮拍卖的最终折减系数，或项目已签协议及里程碑。']),
          [['Auction redesign', '拍卖改革'], ['Less credit', '计入容量下降'], ['More competition', '竞争加剧'], ['Delivery delay', '交付延误']],
          ['CL-IE-10', 'CL-IE-12', 'CL-IE-13', 'CL-IE-15', 'CL-IE-17'],
          {
            labels: {
              proposed: ['Proposed, not decided', '拟议，尚未决定'],
            },
            extra: {
              exits: [
                { anchor: 'bankable', label: ['Bankable case', '可融资方案'] },
                { anchor: 'revenue', label: ['Revenue', '收益拆解'] },
                { anchor: 'execution', label: ['Execution', '执行步骤'] },
                { anchor: 'downside', label: ['Downside', '下行风险'] },
              ],
            },
          }),

        shot('ie-12', 'investment', 'ie-overview',
          ['Where do I check the numbers?', '在哪里核对具体数字？'],
          ['The story stops here. The market page shows the bankable case, the revenue split, the execution steps and the downside for the same play.',
            '故事到此结束。市场页面针对同一方案，列出可融资方案、收益拆解、执行步骤和下行风险。'],
          ['Every figure in those sections comes from the same model result as the card.',
            '这些部分的每个数字都与方案卡来自同一模型结果。'],
          fair(['a changed call, play or model result in the briefing.', '简报中的投资判断、方案或模型结果发生变化。']),
          [['Bankable case', '可融资方案'], ['Revenue', '收益拆解'], ['Execution', '执行步骤'], ['Downside', '下行风险']],
          [],
          {
            extra: {
              exits: [
                { anchor: 'bankable', label: ['Bankable case', '可融资方案'] },
                { anchor: 'revenue', label: ['Revenue', '收益拆解'] },
                { anchor: 'execution', label: ['Execution', '执行步骤'] },
                { anchor: 'downside', label: ['Downside', '下行风险'] },
              ],
            },
          }),
      ],
    },
  ],

  /* Page vocabulary that is not a shot's own copy. Bilingual, same order. */
  text: {
    'Common navigation': ['Previous; Next; Chapters; Open evidence; Close evidence; Back to market', '上一节；下一节；章节；查看证据；关闭证据；返回市场'],
    'Evidence drawer': ['Source; Locator; Checked on {sourceCheckedDate}; Definition', '来源；具体位置；核查时间：{sourceCheckedDate}；统计口径'],
    'Marker line': ['What would change it:', '会改变判断的证据：'],
    'Diagram / history legend': ['Schematic; Observed event; Decided date; Announced plan; Example', '示意；已发生事件；已定日期；已公布计划；示例'],
    'Future: long-stop': ['{ds3Name} tariffs end by {longStop}', '{ds3Name}费率最迟于{longStop}结束'],
    'Future: new auction': ['Daily services auction: start date not confirmed', '日前系统服务拍卖：启动日期未确定'],
    'All-island system': ['One power system, two jurisdictions', '一个电力系统，两个司法辖区'],
    'Future: Celtic': ['Celtic link to France: planned', '通往法国的Celtic互联线：规划中'],
    'Signature chart axes': ['Delivery year; Clearing price · EUR per de-rated MW per year; Four-hour storage credit · de-rating factor · {crmBand}; Battery storage awarded · de-rated MW',
      '交付年度；出清价 · 欧元/折减MW/年；四小时储能计入比例 · 折减系数 · {crmBand}；中标电池储能 · 折减MW'],
    'Signature chart definition': ['De-rated megawatts count what the auction credits, not what is built. The de-rating factor is the share of a unit’s power the auction credits, for a unit of the stated duration and size',
      '折减MW是拍卖计入的容量，并非建成容量。折减系数是拍卖对指定时长与规模机组计入的功率比例'],
    /* §7 replaces the storyboard's older “battery of the play's duration”
       accessible summary with the fixed-context distinction. */
    'Signature chart accessible summary': ['Historical context: {crmContextDuration}-hour storage, {crmBand}; each point uses that delivery auction’s pack. This is not the {playDuration}-hour candidate’s credit. T-4 auctions by delivery year',
      '历史背景：{crmContextDuration}小时储能，{crmBand}；各点采用对应交付年度拍卖的信息包。这不是{playDuration}小时候选方案的计入比例。按交付年度列示T-4拍卖'],
    'Signature chart example': ['Example: price and storage credit', '示例：价格与储能计入比例'],
    'Service purposes': ['FFR: arrest the frequency fall; POR: replace the immediate response; SOR: sustain reserve; TOR1 and TOR2: continue reserve cover', 'FFR：遏制频率下跌；POR：接替即时响应；SOR：维持备用；TOR1和TOR2：继续提供备用支撑'],
    'Battery / station': ['Battery modules; Inverter; Transformer; Controls; Connection; Usable energy; Charge; Discharge', '电池模块；逆变器；变压器；控制系统；并网接入；可用电量；充电；放电'],
    'Investment IRR basis': ['All-equity hold IRR · after-tax nominal · from RTB closing', '全股权长持IRR · 项目税后名义 · 自RTB交割起算'],
    'Capital basis': ['Construction budget including reserves · current prices', '含储备的建设预算 · 当期价格'],
    'Value basis': ['Design value less net capital at COD · USD per nameplate MW', '设计口径投运时价值减净投入 · 美元/铭牌MW'],
    'Awarded scope': ['Batteries awarded — four recent auctions only', '电池中标量——仅最近四轮拍卖'],
    'Redesign factor': ['A new auction design could change contract length, credit or price for new storage', '新的拍卖设计可能改变新建储能的合同期限、计入容量或价格'],
    'De-rating factor': ['Less credit per megawatt built means less capacity income for the same battery', '每MW建成功率可计入的容量减少，同一电池的容量收入随之下降'],
    'Competition factor': ['More batteries and interconnection can narrow evening prices and the trading line', '更多电池和互联线路可能压低晚高峰价格及交易收入'],
    'Delivery factor': ['A project that misses its delivery date can lose or forfeit its contract', '未能按期交付的项目可能失去合同'],
    'Loading / retry': ['Loading source data…; Could not load data; Retry; Auction history not yet available', '正在载入来源数据…；数据未能载入；重试；拍卖历史暂不可用'],
    'Missing financial binding': ['Current case unavailable; review the market case', '当前情景暂不可用；请查看市场方案'],
    'Missing value': ['Not published; the chart stays an Example', '暂未公布；图表仍为示例'],
    'Reduced motion / text alternative': ['Read the explanation; the selected state is shown without animation', '阅读文字说明；当前选择直接显示，无需动画'],
  },
};
