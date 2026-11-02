/* Poland: the complete bilingual script signed off at G-1 on 1 November 2026.
   Plain content only: no rendering code and no typed figure. Every amount,
   share, duration and count is a {token} that resolves through storyBindings.js;
   dates are sourced events, and the two things the page calls an Example say so.

   Source: docs/immersive-experience-plan/poland-storyboard.md, with the field
   owners in docs/immersive-experience-plan/pl-build-evidence.md.

   THREE SENTENCES DIFFER FROM THE SIGNED SCRIPT, each because the decision
   record names the wording and blocks the original:

     pl-06  the supplementary end date no longer governs the quarterly product
            (B-PL-COPY-SCOPE: "Quarterly additional auctions admit existing
            units. Supplementary auctions buy a year at a time through ...").
     pl-12  the factor card states the statutory bands instead of a straight
            monthly cut (B-PL-COPY-SCOPE, grant regulation §6(2)-(3)).
     pl-00  the card figures are the shared card's base IRR and margin only;
            the other two metrics stay in the decision panel (B-PL-COPY-SCOPE).

   TWO ADDITIONS the record requires: the transfer sentence sits on pl-09's
   grant hotspot (GAP-PL-TRANSFER), and pl-12 carries a fifth exit so it is
   reachable from there.

   pl-05 keeps the signed numeric sentence and a figure-free Example variant.
   The page shows the Example until the analyst accepts the quantitative
   rendering at G-2 (chart.quantitativeReady, §5).

   Preserve both languages when the analyst approves any later wording. */
export const story = {
  "storySchemaVersion": 1,
  "contentVersion": "2026-11-01",
  "marketId": "pl",
  "systemBoundary": [
    "Poland · national power system, one capacity market, one price zone",
    "波兰 · 国家电力系统，单一容量市场，单一价区"
  ],
  "supportedLocales": [
    "en",
    "zh"
  ],
  "playRef": "pl-grant-4h",
  "reviewedAgainst": {
    "playRef": "pl-grant-4h",
    "hours": 4,
    "call": "opportunistic",
    "on": "2026-11-01",
    "commit": "474766e",
    "lens": "infraFund"
  },
  "tokens": [
    "call",
    "playName",
    "cardFigures",
    "nextAction",
    "playEvidence",
    "marketCall",
    "marketPlayName",
    "marketNextAction",
    "marketEvidence",
    "watchedEvent",
    "ungrantedMerchantValue",
    "ungrantedBestValue",
    "grantPlayValue",
    "merchantBand",
    "h01Year",
    "h02ActYear",
    "existingTerm",
    "modernisedTerm",
    "newBuildTerm",
    "firstBatteryDeliveryYear",
    "secondBatteryDeliveryYear",
    "earlyBatteryFactor",
    "firstBatteryObligation",
    "secondBatteryObligation",
    "secondBatteryUnits",
    "lastMainAuctionYear",
    "lastMainDeliveryYear",
    "supplementaryEndYear",
    "lastMainBatteryFactor",
    "firstContractValue",
    "lastContractValue",
    "certificationHours",
    "milestoneDeliveryYear",
    "cohortListDate",
    "cohortSignedGrants",
    "researchCheckDate",
    "sourceCheckedDate",
    "grantShare",
    "playDuration",
    "auctionSeries"
  ],
  "claims": {
    "CL-PL-03": { "sources": ["SRC-PL-01", "SRC-PL-02"] },
    "CL-PL-04": { "sources": ["SRC-PL-02"] },
    "CL-PL-05": { "sources": ["SRC-PL-02"] },
    "CL-PL-06": { "sources": ["SRC-PL-10", "SRC-PL-11", "SRC-PL-12", "SRC-PL-16"] },
    "CL-PL-07": { "sources": ["SRC-PL-05", "SRC-PL-06", "SRC-PL-07", "SRC-PL-08", "SRC-PL-26"] },
    "CL-PL-08": { "sources": ["SRC-PL-07", "SRC-PL-16"] },
    "CL-PL-09": { "sources": ["SRC-PL-16"] },
    "CL-PL-10": { "sources": ["SRC-PL-01", "SRC-PL-03", "SRC-PL-04"] },
    "CL-PL-11": { "sources": ["SRC-PL-03"] },
    "CL-PL-12": { "sources": ["SRC-PL-13", "SRC-PL-14"] },
    "CL-PL-13": { "sources": ["SRC-PL-19", "SRC-PL-20"] },
    "CL-PL-14": { "sources": ["SRC-PL-17", "SRC-PL-18", "SRC-PL-21"] },
    "CL-PL-15": { "sources": ["SRC-PL-19"] },
    "CL-PL-16": { "sources": ["SRC-PL-23"] },
    "CL-PL-17": { "sources": ["SRC-PL-15"] },
    "CL-PL-18": { "sources": ["REPO-PL-LIVE"] },
    "CL-PL-20": { "sources": ["SRC-PL-01"] }
  },
  "opening": {
    "id": "pl-00",
    "chapter": "opening",
    "scene": "pl-opening",
    "question": [
      "What are the calls here, and why are there two?",
      "这里的投资判断是什么？为什么有两个？"
    ],
    "copy": [
      "Grant cohort · own call: {call} · {playName} · {cardFigures} · {nextAction}. Market verdict: {marketCall} · {marketPlayName} · {marketNextAction}. Poland holds two cohorts that are separate investments: projects in the grant cohort, and assets holding an earlier capacity agreement. Without a grant, every design loses value at the platform's yields.",
      "补贴批次 · 独立判断： {call} · {playName} · {cardFigures} · {nextAction}。市场判断： {marketCall} · {marketPlayName} · {marketNextAction}。波兰有两个批次，属于不同的投资：补贴批次中的项目，以及持有早期容量合同的资产。没有补贴，每种设计按本平台收益率都会损失价值。"
    ],
    "meaning": null,
    "marker": { "level": "play" },
    "controls": [
      ["Start the story", "开始阅读"],
      ["Go to the investment case", "查看投资方案"]
    ],
    "claims": ["CL-PL-18"]
  },
  "chapters": [
    {
      "id": "origins",
      "title": ["Origins", "系统起点"],
      "shots": [
        {
          "id": "pl-01",
          "chapter": "origins",
          "scene": "pl-coal-system",
          "question": ["What kind of system is this?", "这是一个怎样的电力系统？"],
          "copy": [
            "Poland's power system was built around coal. Many units were old and due to close, and in the summer of {h01Year} supply to large industrial users had to be limited.",
            "波兰的电力系统围绕煤电建成。许多机组已经老化、即将关停；{h01Year}年夏天，大型工业用户的供电不得不受到限制。"
          ],
          "meaning": [
            "Poland pays for capacity to keep the system adequate; that payment is the route the market's verdict watches.",
            "波兰为容量付费，是为了保证系统供电充足；该市场的判断所关注的，正是这条付费路径。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "PSE's dated record of the {h01Year} supply limits and a primary generation-mix series.",
              "PSE关于{h01Year}年限电的带日期记录，以及一手的发电结构数据。"
            ]
          },
          "controls": [
            ["The coal fleet", "燃煤机组"],
            ["Summer {h01Year}", "{h01Year}年夏季"]
          ],
          "labels": {
            "l01": ["Coal-fired units (schematic)", "燃煤机组（示意）"],
            "l02": ["Large industrial users", "大型工业用户"],
            "l03": ["Supply limited", "供电受限"]
          },
          "caption": ["Schematic. Plant locations are not shown.", "示意图，不显示电厂位置。"],
          "claims": ["CL-PL-04", "CL-PL-05"]
        }
      ]
    },
    {
      "id": "choices",
      "title": ["Historical choices", "历史选择"],
      "shots": [
        {
          "id": "pl-02",
          "chapter": "choices",
          "scene": "pl-capacity-market",
          "question": ["Why does Poland pay for capacity?", "波兰为什么为容量付费？"],
          "copy": [
            "To keep enough capacity, Poland created a capacity market in {h02ActYear}. The grid operator, PSE, runs the auctions; winners are paid for being available and penalised if they fail to deliver. New plant meeting an emission standard could win agreements of up to {newBuildTerm} years, and batteries meet it.",
            "为保证足够的容量，波兰于{h02ActYear}年建立容量市场。由电网运营商PSE组织拍卖；中标者因保持可用而获得付费，未能履约则受罚。满足排放标准的新建机组，可获得最长{newBuildTerm}年的合同，电池符合这一标准。"
          ],
          "meaning": [
            "An earlier capacity agreement is long, fixed income; an asset holding one is a different investment from a new entrant.",
            "早期容量合同是一笔长期、固定的收入；持有此类合同的资产，与新进入者是不同的投资。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "an amendment changing the terms of agreements already signed.",
              "修改已签合同条款的法律修订。"
            ]
          },
          "controls": [
            ["Existing units", "既有机组"],
            ["Modernised units", "改造机组"],
            ["New units", "新建机组"],
            ["Select a node", "选择节点"]
          ],
          "labels": {
            "l01": ["Up to {existingTerm} year", "最长{existingTerm}年"],
            "l02": ["Up to {modernisedTerm} years", "最长{modernisedTerm}年"],
            "l03": ["Up to {newBuildTerm} years", "最长{newBuildTerm}年"],
            "l04": ["Paid for availability", "因保持可用而付费"],
            "l05": ["Penalty for failing to deliver", "未履约受罚"]
          },
          "claims": ["CL-PL-03"]
        },
        {
          "id": "pl-03",
          "chapter": "choices",
          "scene": "pl-battery-entry",
          "question": [
            "Why did the earlier auctions build a contracted battery fleet?",
            "为什么早期拍卖催生了一批签约电池？"
          ],
          "copy": [
            "Because a battery could commit almost all of its power. In the auctions for delivery in {firstBatteryDeliveryYear} and {secondBatteryDeliveryYear}, the correction factor for batteries was {earlyBatteryFactor}, so a battery could commit nearly its full output for {newBuildTerm} years. Battery obligations grew from {firstBatteryObligation} to {secondBatteryObligation}, across {secondBatteryUnits} units.",
            "因为电池几乎可以把全部功率签进合同。在交付年为{firstBatteryDeliveryYear}和{secondBatteryDeliveryYear}的拍卖中，电池的可用性修正系数为{earlyBatteryFactor}，电池几乎能以全部出力签订{newBuildTerm}年的合同。电池的容量义务由{firstBatteryObligation}增至{secondBatteryObligation}，涉及{secondBatteryUnits}个机组。"
          ],
          "meaning": [
            "Those agreements keep the terms of the auction that awarded them; this is the cohort the market's verdict prices, and only below replacement cost.",
            "这些合同沿用授予时那一轮拍卖的条款；该市场的判断所定价的正是这一批次，且仅以低于重置成本的价格。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "URE revising the battery volumes in its storage report.",
              "URE修订其储能报告中的电池签约量。"
            ]
          },
          "controls": [
            ["Delivery {firstBatteryDeliveryYear}", "交付年{firstBatteryDeliveryYear}"],
            ["Delivery {secondBatteryDeliveryYear}", "交付年{secondBatteryDeliveryYear}"],
            ["How the obligation is counted", "容量义务如何计算"]
          ],
          "labels": {
            "l01": ["Certified power", "认证功率"],
            "l02": ["Correction factor", "可用性修正系数"],
            "l03": ["Capacity obligation", "容量义务"],
            "l04": ["Battery agreements", "电池合同"]
          },
          "claims": ["CL-PL-06", "CL-PL-08", "CL-PL-17"]
        },
        {
          "id": "pl-04",
          "chapter": "choices",
          "scene": "pl-end-date",
          "question": ["Why did the long contracts stop?", "长期合同为什么停了？"],
          "copy": [
            "The capacity market was approved for a fixed period. The law schedules main auctions only up to the one held in {lastMainAuctionYear}, for delivery in {lastMainDeliveryYear}. EU emission rules also ended coal's long contracts: coal may stay only in one-year auctions until {supplementaryEndYear}.",
            "容量市场只获批固定期限。法律排定的主拍卖到{lastMainAuctionYear}年那一轮为止，对应交付年为{lastMainDeliveryYear}年。欧盟排放规则也终止了煤电的长期合同：煤电只能在{supplementaryEndYear}年前参加一年期拍卖。"
          ],
          "meaning": [
            "Signed agreements run their full term; what has ended is the route to a new one, which is the event the market's verdict watches.",
            "已签合同照常履行至期满；终止的是取得新合同的路径，这正是该市场的判断所关注的事件。"
          ],
          "marker": {
            "level": "strong",
            "change": ["{watchedEvent}.", "{watchedEvent}。"]
          },
          "controls": [
            ["Main auctions", "主拍卖"],
            ["One-year auctions", "一年期拍卖"],
            ["After {lastMainDeliveryYear}", "{lastMainDeliveryYear}年以后"]
          ],
          "labels": {
            "l01": ["Scheduled main auction", "已排期主拍卖"],
            "l02": ["No main auction scheduled", "无主拍卖排期"],
            "l03": ["One-year auctions for existing units", "既有机组一年期拍卖"],
            "l04": ["Coal derogation ends", "煤电豁免到期"]
          },
          "caption": [
            "Dashed: not scheduled in law at {researchCheckDate}.",
            "虚线：截至{researchCheckDate}，法律未作排期。"
          ],
          "claims": ["CL-PL-10", "CL-PL-11"]
        }
      ]
    },
    {
      "id": "tensions",
      "title": ["Today's tensions", "当下矛盾"],
      "shots": [
        {
          "id": "pl-05",
          "chapter": "tensions",
          "scene": "pl-auction-chart",
          "question": [
            "What could one battery contract, auction by auction?",
            "同一台电池，在各轮拍卖中能签下多少合同？"
          ],
          "copy": [
            "A battery's contract is the clearing price times its correction factor. In the auction for delivery in {firstBatteryDeliveryYear}, that came to {firstContractValue} per kW. By the auction for {lastMainDeliveryYear}, the factor had fallen to {lastMainBatteryFactor}, and the same battery could contract {lastContractValue}. No main auction is scheduled after it.",
            "电池能签下的合同，等于出清价乘以其可用性修正系数。在交付年为{firstBatteryDeliveryYear}的拍卖中，这一数值为每千瓦{firstContractValue}。到交付年为{lastMainDeliveryYear}的拍卖，修正系数已降至{lastMainBatteryFactor}，同一台电池只能签下{lastContractValue}。此后再无主拍卖排期。"
          ],
          /* Shown while chart.quantitativeReady is false. Both sentences are the
             script's own first sentence and the decision record's Example
             wording; §5 forbids a numeric continuation beside an Example. */
          "exampleCopy": [
            "A battery's contract is the clearing price times its correction factor. Example: auction price × correction factor.",
            "电池能签下的合同，等于出清价乘以其可用性修正系数。示例：拍卖价格×修正系数。"
          ],
          "meaning": [
            "What an earlier agreement is worth depends on the auction that awarded it, so an asset holding one is priced one by one, below replacement cost.",
            "早期合同的价值取决于授予它的那一轮拍卖，因此持有此类合同的资产须逐一定价，且须低于重置成本。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the analyst's sign-off of the contract-value calculation and URE's technology split for the last two auctions.",
              "分析师确认合同价值的计算方法，以及URE公布最近两轮拍卖的技术构成。"
            ]
          },
          "controls": [
            ["Clearing price", "出清价"],
            ["Correction factor", "修正系数"],
            ["Contract per kW", "每千瓦合同额"],
            ["How measured", "计算方法"]
          ],
          "labels": {
            "l01": ["Delivery year", "交付年"],
            "l02": ["Clearing price, PLN/kW/year", "出清价（兹罗提/千瓦/年）"],
            "l03": ["Battery correction factor", "电池修正系数"],
            "l04": ["Contract per kW of battery, PLN/kW/year", "每千瓦电池合同额（兹罗提/千瓦/年）"],
            "l05": ["Battery obligations awarded, MW", "电池获授容量义务（MW）"],
            "l06": ["Technology split pending", "技术构成待公布"],
            "l07": ["Catch-up auction", "追加拍卖"],
            "l08": ["No main auction scheduled", "无主拍卖排期"]
          },
          "caption": [
            "Sources: URE final auction results; auction-parameter regulations in Dziennik Ustaw; URE storage report. Contract per kW is price × factor, before any aid deduction.",
            "来源：URE拍卖最终结果；《法律公报》所载拍卖参数条例；URE储能报告。每千瓦合同额＝出清价×修正系数，未扣除任何补贴抵减。"
          ],
          "claims": ["CL-PL-06", "CL-PL-07", "CL-PL-08", "CL-PL-09"]
        },
        {
          "id": "pl-06",
          "chapter": "tensions",
          "scene": "pl-four-doors",
          "question": [
            "Can a new battery still win a capacity contract?",
            "新建电池还能拿到容量合同吗？"
          ],
          /* B-PL-COPY-SCOPE: the signed sentence applied the supplementary end
             date to both products. Quarterly auctions have no terminal year. */
          "copy": [
            "Not a long one. No main auction is scheduled after the one for {lastMainDeliveryYear}. Quarterly additional auctions admit existing units. Supplementary auctions buy a year at a time through {supplementaryEndYear}. A successor framework is not yet law.",
            "拿不到长期合同。交付年{lastMainDeliveryYear}之后不再有主拍卖排期。季度追加拍卖面向既有机组。补充拍卖逐年采购，持续至{supplementaryEndYear}年。接续机制尚未立法。"
          ],
          "meaning": [
            "Until a successor exists, a new capacity battery has no contract to underwrite, so the market's verdict waits for one.",
            "在接续机制出现之前，新建的容量型电池没有可承保的合同，因此该市场的判断是等待。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a legislated successor framework with a route for new storage.",
              "完成立法的接续机制，并为新建储能提供参与路径。"
            ]
          },
          "controls": [
            ["Main auction", "主拍卖"],
            ["Quarterly auctions", "季度拍卖"],
            ["One-year auctions", "一年期拍卖"],
            ["Successor", "接续机制"]
          ],
          "labels": {
            "l01": ["Closed after {lastMainDeliveryYear}", "{lastMainDeliveryYear}年后关闭"],
            "l02": ["Existing units only", "仅限既有机组"],
            "l03": ["A quarter at a time", "每次一个季度"],
            "l04": ["A year at a time, until {supplementaryEndYear}", "每次一年，至{supplementaryEndYear}年"],
            "l05": ["Not legislated", "尚未立法"]
          },
          "claims": ["CL-PL-10", "CL-PL-11", "CL-PL-12"]
        },
        {
          "id": "pl-07",
          "chapter": "tensions",
          "scene": "pl-teaching-day",
          "question": [
            "What does a new battery earn without a contract or a grant?",
            "既无合同又无补贴的新建电池，靠什么赚钱？"
          ],
          "copy": [
            "Trading. It charges when day-ahead prices are low and sells when they are high. On the platform's model that is not enough: at the platform's yields, the same battery is worth {ungrantedMerchantValue} per MW, and even the best ungranted design, which holds a capacity agreement, is worth {ungrantedBestValue}.",
            "靠交易。日前电价低时充电，高时售电。按本平台模型，这还不够：按本平台收益率，同样的电池每MW价值为{ungrantedMerchantValue}；即便是持有容量合同的最优无补贴设计，每MW价值也只有{ungrantedBestValue}。"
          ],
          "meaning": [
            "A new entrant's case rests on trading alone and does not clear the yields; an asset holding an earlier agreement clears them only if bought below replacement cost.",
            "新进入者的投资逻辑只能依靠交易，达不到收益率要求；持有早期合同的资产，只有以低于重置成本的价格买入才能达到。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "realised Polish trading results and a compression curve fitted on Poland's own fleet.",
              "波兰电池的实际交易收益，以及按波兰自身储能规模拟合的价差压缩曲线。"
            ]
          },
          "controls": [
            ["Charge", "充电"],
            ["Discharge", "放电"],
            ["Show model values", "显示模型价值"]
          ],
          "labels": {
            "l01": ["Example", "示例"],
            "l02": ["Day-ahead price (unscaled)", "日前电价（无刻度）"],
            "l03": ["Model value per MW at the platform's yields", "按本平台收益率计的每MW模型价值"]
          },
          "claims": ["CL-PL-18"]
        }
      ]
    },
    {
      "id": "battery",
      "title": ["Add a battery", "加入电池"],
      "shots": [
        {
          "id": "pl-08",
          "chapter": "battery",
          "scene": "pl-certification",
          "question": ["Why are both plays {playDuration} hours?", "为什么两条路线都是{playDuration}小时？"],
          "copy": [
            "For capacity, the test sets it: a battery is certified only for the power it can hold for {certificationHours} uninterrupted hours, so a shorter battery is credited as a smaller one. For trading, the platform's model cannot separate {merchantBand} hours by value. Both plays use {playDuration} hours.",
            "对容量而言，认证测试决定时长：电池只按其能连续保持{certificationHours}小时的功率获得认证，时长较短的电池只能按更小的电池计入。对交易而言，平台模型在价值上无法区分{merchantBand}小时。两条路线都采用{playDuration}小时。"
          ],
          "meaning": [
            "This duration keeps a battery fully creditable for capacity and inside the model's best band for trading, so it fits both cohorts.",
            "这一时长既能让电池获得全额容量认证，又处于模型交易价值的最优区间，因此适用于两个批次。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "PSE confirming how a battery shorter than the test is certified, or a design result that moves the trading band.",
              "PSE确认时长不足的电池如何认证，或设计测算结果改变交易最优区间。"
            ]
          },
          "controls": [
            ["Shorter battery (Example)", "较短电池（示例）"],
            ["{playDuration} hours", "{playDuration}小时"],
            ["Certification test", "认证测试"]
          ],
          "labels": {
            "l01": ["Certified power", "认证功率"],
            "l02": ["Hours held at full power", "满功率持续小时数"],
            "l03": ["Example", "示例"]
          },
          "claims": ["CL-PL-17"]
        },
        {
          "id": "pl-09",
          "chapter": "battery",
          "scene": "pl-rights",
          "question": [
            "What does a fund actually buy in a ready-to-build project here?",
            "在这里，基金买下一个具备开工条件的项目，究竟买到什么？"
          ],
          "copy": [
            "Rights with obligations attached. A capacity agreement pays only once the battery passes its delivery test, and lapses if a new unit has not passed by the end of its {milestoneDeliveryYear} delivery year. A grant is paid against eligible costs, is cut for late completion and must be repaid if its conditions are broken.",
            "权利，附带义务。容量合同只有在电池通过交付测试后才开始付费；新建机组若在第{milestoneDeliveryYear}个交付年结束前仍未通过，合同即告终止。补贴按合格成本拨付，延期完工会被扣减，违反条件则须返还。"
          ],
          "meaning": [
            "The entry price must carry every condition: the capacity cohort's delivery test and term, and the grant cohort's completion deadline and repayment terms.",
            "进入价格必须涵盖每一项条件：容量批次的交付测试与合同期限，补贴批次的完工期限与返还条款。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the target project's capacity agreement, milestone records and signed grant agreement.",
              "目标项目的容量合同、里程碑记录及已签补贴协议。"
            ]
          },
          "controls": [
            ["Equipment", "设备"],
            ["Rights and obligations", "权利与义务"]
          ],
          "extra": {
            "hotspots": [
              {
                "name": ["Grid connection", "并网接入"],
                "role": ["the right to export and import at this point", "在该接入点送电和受电的权利"]
              },
              {
                "name": ["Capacity agreement", "容量合同"],
                "role": ["paid for availability, after the delivery test", "通过交付测试后，因保持可用而获付费"]
              },
              {
                "name": ["Grant agreement", "补贴协议"],
                "role": [
                  "capital support with completion and durability conditions. Grant transfer to a buyer: not verified.",
                  "附完工与存续条件的资本支持。补贴能否随出售转移给买方：尚未核验。"
                ]
              },
              {
                "name": ["Battery and power conversion", "电池与功率变换"],
                "role": ["the equipment the other rights attach to", "其余权利所依附的设备"]
              },
              {
                "name": ["Project documents not verified", "项目文件尚未核验"],
                "role": ["none of the above is evidenced for a specific asset", "以上各项均无特定资产的证据"]
              }
            ]
          },
          "claims": ["CL-PL-03", "CL-PL-13"]
        }
      ]
    },
    {
      "id": "payment",
      "title": ["Who pays", "谁来付钱"],
      "shots": [
        {
          "id": "pl-10",
          "chapter": "payment",
          "scene": "pl-payment-paths",
          "question": ["Who pays each cohort, and how?", "谁为每个批次付钱？怎么付？"],
          "copy": [
            "An earlier capacity agreement is paid every month, through a charge on electricity users, for as long as it runs. The grant cohort's money arrives during construction, not every year: NFOŚiGW pays part of the build cost as eligible costs are incurred. It ranked the applications in {cohortListDate} and lists {cohortSignedGrants} signed grant agreements. Both cohorts earn the rest by trading.",
            "早期容量合同按月付款，资金来自向电力用户收取的容量费，在合同期内持续支付。补贴批次的资金在建设期间拨付，而不是每年支付：国家环保基金在合格成本发生时承担部分建设成本。该基金于{cohortListDate}对申请排序，并列出{cohortSignedGrants}份已签补贴协议。两个批次其余的收入都来自交易。"
          ],
          "meaning": [
            "The capacity cohort holds a recurring payment; the grant cohort holds a smaller capital bill. That is why they are separate investments.",
            "容量批次持有的是持续性付款；补贴批次持有的是更低的资本支出。这正是二者属于不同投资的原因。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "reconciling the cohort count the play uses with NFOŚiGW's list and signed agreements.",
              "将该方案所用的批次数量与国家环保基金的排名清单及已签协议核对一致。"
            ]
          },
          "controls": [
            ["Capacity cohort", "容量批次"],
            ["Grant cohort", "补贴批次"],
            ["Trading", "交易"]
          ],
          "labels": {
            "l01": ["Paid monthly for the agreement's term", "合同期内按月支付"],
            "l02": ["Paid during construction, against eligible costs", "建设期间按合格成本拨付"],
            "l03": ["Market margin", "市场价差"],
            "l04": ["Recurring", "持续性"],
            "l05": ["Not recurring", "非持续性"]
          },
          "claims": ["CL-PL-03", "CL-PL-13", "CL-PL-14"]
        },
        {
          "id": "pl-11",
          "chapter": "payment",
          "scene": "pl-capital-stack",
          "question": ["Why does the grant cohort carry its own call?", "为什么补贴批次有自己的投资判断？"],
          "copy": [
            "Because the grant pays part of the build cost before the battery earns anything. The revenue is the same trading case; the capital at risk is smaller. The play prices the cohort's average grant, {grantShare} of the build cost, and the same design moves from {ungrantedMerchantValue} to {grantPlayValue} per MW at the platform's yields. If a project also holds a capacity agreement, the law deducts the grant from that payment.",
            "因为补贴在电池产生任何收入之前，就承担了部分建设成本。收入仍是同样的交易逻辑，承担风险的资本却更少。该方案按批次平均补贴定价，即建设成本的{grantShare}；按本平台收益率，同一设计的每MW价值由{ungrantedMerchantValue}变为{grantPlayValue}。若项目同时持有容量合同，法律规定须从该合同付款中扣减补贴。"
          ],
          "meaning": [
            "The grant cohort clears the platform's yields only with its grant in place and its conditions met.",
            "补贴批次只有在补贴到位、且满足所附条件时，才能达到本平台收益率。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the target project's signed grant amount, and URE's practice for deducting a grant from a capacity payment.",
              "目标项目已签署的补贴金额，以及URE从容量付款中扣减补贴的实际做法。"
            ]
          },
          "controls": [
            ["Without the grant", "无补贴"],
            ["With the grant", "有补贴"],
            ["Also holds a capacity agreement", "同时持有容量合同"]
          ],
          "labels": {
            "l01": ["Build cost", "建设成本"],
            "l02": ["Grant", "补贴"],
            "l03": ["Capital at risk", "承担风险的资本"],
            "l04": ["Same trading revenue", "同样的交易收入"],
            "l05": ["Capacity price reduced by the grant over the agreement", "在合同期内按补贴扣减容量价格"],
            "l06": ["Model value per MW at the platform's yields", "按本平台收益率计的每MW模型价值"]
          },
          "claims": ["CL-PL-15", "CL-PL-20"]
        }
      ]
    },
    {
      "id": "investment",
      "title": ["The investment", "回到投资"],
      "shots": [
        {
          "id": "pl-12",
          "chapter": "investment",
          "scene": "pl-factors",
          "question": [
            "What would make these plays less attractive?",
            "什么变化会让这两条路线失去吸引力？"
          ],
          "copy": [
            "For the grant cohort: trading margins squeezed as both cohorts' batteries arrive, and late completion that cuts the grant. For the capacity cohort: paying more than replacement cost for an earlier agreement. For both: connection, where refusals are common. Next, for each: {nextAction} · {marketNextAction}",
            "对补贴批次：两个批次的电池陆续投运会压缩交易价差，延期完工则会扣减补贴。对容量批次：为早期合同支付高于重置成本的价格。对两者：并网，申请被拒的情况很常见。下一步，分别是：{nextAction} · {marketNextAction}"
          ],
          "meaning": [
            "The grant cohort's case is a trading case with a smaller capital bill; the capacity cohort's case is the price paid for an agreement. Test each on its own terms.",
            "补贴批次的投资逻辑，是资本支出更低的交易逻辑；容量批次的投资逻辑，是为一份合同所付的价格。两者须各按自身条件检验。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "realised Polish trading results, the target projects' completion records, and a legislated successor framework.",
              "波兰电池的实际交易收益、目标项目的完工记录，以及完成立法的接续机制。"
            ]
          },
          "controls": [
            ["Trading margins", "交易价差"],
            ["Late completion", "延期完工"],
            ["Price paid", "支付价格"],
            ["Connection", "并网"],
            ["Bankable case", "可融资方案"],
            ["Revenue", "收益拆解"],
            ["Execution", "执行步骤"],
            ["Downside", "下行风险"],
            ["Grant transfer", "补贴转让"]
          ],
          "extra": {
            /* B-PL-COPY-SCOPE: the signed card said the grant shrinks for each
               month late. The regulation has delay bands and force majeure. */
            "factors": [
              {
                "affects": [
                  "more batteries trading the same hours; see Revenue and Downside",
                  "更多电池在同一时段交易；见收益拆解与下行风险"
                ]
              },
              {
                "affects": [
                  "late completion can reduce the grant; check the agreement's deadline and the statutory delay bands; see Execution",
                  "延期完工可能导致补贴扣减；须核查协议期限及法定延迟档位；见执行步骤"
                ]
              },
              {
                "affects": [
                  "an earlier agreement is worth only its vintage; see Bankable case",
                  "早期合同的价值取决于其签约年份；见可融资方案"
                ]
              },
              {
                "affects": [
                  "refusals are common and slow projects; see Execution",
                  "申请常被拒绝，拖慢项目；见执行步骤"
                ]
              }
            ],
            /* The fifth exit carries GAP-PL-TRANSFER's sentence within reach of
               this shot; the other four are the script's own links. */
            "exits": [
              { "anchor": "bankable", "label": ["Bankable case", "可融资方案"] },
              { "anchor": "revenue", "label": ["Revenue", "收益拆解"] },
              { "anchor": "execution", "label": ["Execution", "执行步骤"] },
              { "anchor": "downside", "label": ["Downside", "下行风险"] },
              { "anchor": "story-pl-09", "label": ["Grant transfer", "补贴转让"] }
            ]
          },
          "claims": ["CL-PL-13", "CL-PL-16", "CL-PL-18"]
        }
      ]
    }
  ],
  "text": {
    "Tags": [
      "Example · Schematic · Model assumption · Observed event · Not scheduled",
      "示例 · 示意图 · 模型假设 · 已发生事件 · 未作排期"
    ],
    "Chart reading": [
      "Solid: an observed auction result or a decided rule · Dashed: a boundary, a plan or the Example · No second axis",
      "实线：观测到的拍卖结果或已定规则 · 虚线：边界、规划或示例 · 不设第二纵轴"
    ],
    "History legend": [
      "Observed event · Checked: {researchCheckDate}",
      "已发生事件 · 核查截至：{researchCheckDate}"
    ],
    "Evidence drawer": [
      "Source · Locator · Checked on {sourceCheckedDate} · Definition",
      "来源 · 具体位置 · 核查时间：{sourceCheckedDate} · 统计口径"
    ],
    "Example reading": [
      "Example: auction price × correction factor, unscaled",
      "示例：拍卖价格×修正系数，无刻度"
    ],
    "Missing financial binding": [
      "Current case unavailable; review the market case",
      "当前情景暂不可用；请查看市场方案"
    ],
    "Missing evidence binding": [
      "Figure withheld until its source is checked",
      "来源核实前暂不显示该数值"
    ],
    "Reduced motion": [
      "Read the explanation; the selected state is shown without animation",
      "阅读文字说明；当前选择直接显示，无需动画"
    ]
  }
};
