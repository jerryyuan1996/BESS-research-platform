/* Signed-off Japan copy, mechanically transcribed from storyboard §§4–8.
   Only bound-token notation, Markdown bold and link syntax are adapted for the
   existing plain-data contract. Shared shots are reused without area edits. */
import {REGIONAL_SENTENCES,REGIONAL_SHOTS} from './storyRegions.js';
import {JP_STORY_SOURCES} from './data/storyEvidenceSources.js';
export {REGIONAL_SENTENCES};
export const SHARED_SHOTS = {
  "jp-00": {
    "id": "jp-00",
    "chapter": "opening",
    "scene": "jp-00",
    "question": [
      "What is the call in {areaName}, and why is it a purchase rather than a build?",
      "{areaName}的投资判断是什么？为什么是收购，而不是新建？"
    ],
    "copy": [
      "{call} · {playName} · {cardFigures} · {nextAction}. Japan's long-term auction award secures nearly all of a battery's revenue for {awardTerm} years. But a battery bid may price only a regulated return, and the holder hands back most of what it earns elsewhere. A fund earns its yield only by buying an operating award holder below what it cost to build. {regionalSentence}",
      "{call} · {playName} · {cardFigures} · {nextAction}。日本长期脱碳电源拍卖的中标合同，可在{awardTerm}年内锁定电池几乎全部收入。但电池报价只能计入受监管的回报，中标者在其他市场所得的大部分也须上缴。基金只有以低于建设成本的价格收购已投运的中标资产，才能达到其收益率。{regionalSentence}"
    ],
    "meaning": null,
    "controls": [
      [
        "Start the story",
        "开始阅读"
      ],
      [
        "Go to the investment case",
        "查看投资方案"
      ]
    ],
    "labels": {},
    "claims": [
      "CL-JP-25",
      "CL-JP-28"
    ],
    "marker": {
      "level": "play"
    },
    "links": [
      {
        "label": [
          "Go to the investment case",
          "查看投资方案"
        ],
        "href": "/markets/{areaSlug}#bankable"
      }
    ]
  },
  "jp-01": {
    "id": "jp-01",
    "chapter": "origins",
    "scene": "jp-01",
    "question": [
      "What kind of system is this?",
      "这是一个怎样的电力系统？"
    ],
    "copy": [
      "Japan's grid grew as regional utilities, each building for its own area. The east runs at {eastFrequency} hertz and the west at {westFrequency}, so power crosses between the halves only through converter stations. For decades, regulated tariffs let these utilities recover what they spent, so a large plant could count on being paid back.",
      "日本电网由各区域电力公司分别建成，各自为本区域建设。东部频率为{eastFrequency}赫兹，西部为{westFrequency}赫兹，两半之间的电力只能经由变频站交换。数十年来，受监管的电价让这些公司得以回收投资，大型电源可以确定地收回成本。"
    ],
    "meaning": [
      "Each area is its own market for a battery, but the award that pays it is national. That award exists because regulated recovery ended, as the next chapter shows.",
      "对电池而言，每个区域都是独立的市场，但为它付费的中标合同是全国性的。下一章将说明，这一合同之所以存在，正是因为受监管的成本回收已经结束。"
    ],
    "controls": [
      [
        "Two frequencies",
        "两种频率"
      ],
      [
        "Regulated recovery",
        "受监管的成本回收"
      ]
    ],
    "labels": {
      "east": [
        "East ({eastFrequency} Hz)",
        "东部（{eastFrequency}赫兹）"
      ],
      "west": [
        "West ({westFrequency} Hz)",
        "西部（{westFrequency}赫兹）"
      ],
      "converters": [
        "Converter stations",
        "变频站"
      ],
      "links": [
        "Links between areas",
        "区域间联络线"
      ],
      "tariff": [
        "Regulated tariff",
        "受监管电价"
      ],
      "recovered": [
        "Costs recovered",
        "成本得以回收"
      ]
    },
    "claims": [
      "CL-JP-15",
      "CL-JP-02"
    ],
    "marker": {
      "level": "fair",
      "change": [
        "OCCTO's current rating of the converter stations, reopened at its source.",
        "在原始出处重新核实的OCCTO变频站现行额定容量。"
      ]
    },
    "caption": [
      "Schematic. Area outlines follow prefecture groups; the frequency boundary is approximate.",
      "示意图。区域轮廓按都道府县组合绘制，频率分界为近似位置。"
    ]
  },
  "jp-02": {
    "id": "jp-02",
    "chapter": "origins",
    "scene": "jp-02",
    "question": [
      "What happened when the east ran short?",
      "东部电力短缺时发生了什么？"
    ],
    "copy": [
      "After the earthquake and tsunami of {earthquakeDate}, the east lost a large share of its supply at once. From {outageDate}, Tokyo's utility cut power to its districts in rotation. Help from the west could arrive only through the converter stations.",
      "{earthquakeDate}地震和海啸之后，东部的供电能力一下子损失了很大一部分。自{outageDate}起，东京的电力公司在各区轮流停电。来自西部的支援只能经由变频站送达。"
    ],
    "meaning": [
      "The shortage made adequacy a national problem and set off the reform that created today's auctions. The award a battery holds descends from it.",
      "这次短缺使供电充足性成为全国性问题，并开启了催生今天各类拍卖机制的改革。电池所持有的中标合同正源于此。"
    ],
    "controls": [
      [
        "Before",
        "此前"
      ],
      [
        "{earthquakeMonth}",
        "{earthquakeMonth}"
      ]
    ],
    "labels": {
      "outages": [
        "Rotating outages",
        "轮流停电"
      ],
      "converters": [
        "Converter stations",
        "变频站"
      ],
      "supplyLost": [
        "Eastern supply lost",
        "东部供电损失"
      ]
    },
    "claims": [
      "CL-JP-17",
      "CL-JP-18"
    ],
    "marker": {
      "level": "fair",
      "change": [
        "OCCTO's or METI's record of the supply lost and the transfers through the converters in {earthquakeMonth}.",
        "OCCTO或经产省关于{earthquakeMonth}供电损失及经变频站输送电量的记录。"
      ]
    }
  },
  "jp-03": {
    "id": "jp-03",
    "chapter": "choices",
    "scene": "jp-03",
    "question": [
      "How did Japan change its power system?",
      "日本如何改革其电力系统？"
    ],
    "copy": [
      "Japan reformed its system in three steps. In {reformStep1} a national body, OCCTO, began coordinating the areas. In {reformStep2} every customer could choose a retailer. In {reformStep3} the grid companies were separated from generation and retail.",
      "日本分三步改革电力系统。{reformStep1}，全国性机构OCCTO开始协调各区域；{reformStep2}，所有用户都可以自由选择售电公司；{reformStep3}，电网公司与发电和售电业务分离。"
    ],
    "meaning": [
      "Competition replaced guaranteed cost recovery. New plant now needed another way to be paid back.",
      "竞争取代了有保障的成本回收，新建电源需要另一种方式收回投资。"
    ],
    "controls": [
      [
        "National coordinator",
        "全国协调机构"
      ],
      [
        "Open retail",
        "零售全面放开"
      ],
      [
        "Separate grids",
        "电网独立"
      ],
      [
        "Select a node",
        "选择节点"
      ]
    ],
    "labels": {
      "coordinator": [
        "OCCTO",
        "OCCTO"
      ],
      "retailers": [
        "Retailers",
        "售电公司"
      ],
      "grids": [
        "Grid companies",
        "电网公司"
      ],
      "generation": [
        "Generation",
        "发电"
      ]
    },
    "claims": [
      "CL-JP-16"
    ],
    "marker": {
      "level": "strong",
      "change": [
        "a METI record dating the reform steps differently.",
        "经产省对改革步骤给出不同日期的记录。"
      ]
    }
  },
  "jp-04": {
    "id": "jp-04",
    "chapter": "choices",
    "scene": "jp-04",
    "question": [
      "Why does Japan pay batteries through a long-term auction?",
      "日本为什么通过长期拍卖为电池付费？"
    ],
    "copy": [
      "Once prices were set in short-term markets, OCCTO explains, investors could no longer count on recovering the cost of large new plant. Japan first added a capacity market from {capacityMarketYear}, which pays one year at a time. From {ltdaYear} it added a long-term auction that pays new low-carbon capacity, batteries included, for many years. The supply crunch in the east in {supplyCrunchDate} kept adequacy on the agenda.",
      "OCCTO指出，价格改由短期市场决定后，投资者无法再确定能收回大型新建电源的成本。日本先于{capacityMarketYear}年起引入容量市场，按年度付费；又于{ltdaYear}年起增设长期拍卖，为包括电池在内的新建低碳容量提供多年期付费。{supplyCrunchDate}东部电力供需紧张，使供电充足性继续留在议程上。"
    ],
    "meaning": [
      "The award exists to make large investment predictable. That is why it pays nearly all of a battery's revenue, and why it limits what the battery may keep.",
      "这一中标合同的目的，是让大额投资变得可预期。这正是它几乎覆盖电池全部收入、同时又限制电池可留存收益的原因。"
    ],
    "controls": [
      [
        "Short-term prices",
        "短期价格"
      ],
      [
        "Capacity market",
        "容量市场"
      ],
      [
        "Long-term auction",
        "长期拍卖"
      ]
    ],
    "labels": {
      "annual": [
        "One year at a time",
        "按年度"
      ],
      "longTerm": [
        "Many years",
        "多年期"
      ],
      "lowCarbon": [
        "New low-carbon capacity",
        "新建低碳容量"
      ]
    },
    "claims": [
      "CL-JP-15"
    ],
    "marker": {
      "level": "strong",
      "change": [
        "a METI policy record giving a different purpose for the auction.",
        "经产省政策文件对该拍卖给出不同的目的。"
      ]
    }
  },
  "jp-05": {
    "id": "jp-05",
    "chapter": "choices",
    "scene": "jp-05",
    "question": [
      "What does a battery promise when it wins the award?",
      "电池中标后要承担哪些义务？"
    ],
    "copy": [
      "A winning battery is paid a fixed amount per kW each year for {awardTerm} years in principle. In return it must be able to discharge for {obligationHours} hours without stopping, and its declared capacity is deemed to allow for every operating risk, fade included. It hands back about {clawbackShare} of its profit from other markets, and its bid may not exceed its area's ceiling.",
      "中标电池按每千瓦每年获得固定付费，原则上为期{awardTerm}年。作为交换，它必须能够连续放电{obligationHours}小时，且其申报容量被视为已考虑全部运行风险，包括容量衰减。它须上缴在其他市场所获利润的约{clawbackShare}，报价也不得超过所在区域的上限。"
    ],
    "meaning": [
      "The award fixes revenue and caps the upside. What the holder still controls is cost and performance against the floor.",
      "中标合同锁定了收入，也封住了上行空间。持有人仍能掌控的，是成本，以及能否守住最低时长要求。"
    ],
    "controls": [
      [
        "Term",
        "合同期限"
      ],
      [
        "Floor",
        "最低时长"
      ],
      [
        "Clawback",
        "收益上缴"
      ],
      [
        "Ceiling",
        "报价上限"
      ]
    ],
    "labels": {
      "payment": [
        "Paid per kW per year",
        "按千瓦每年付费"
      ],
      "continuous": [
        "Continuous discharge",
        "连续放电"
      ],
      "fade": [
        "Fade allowed for",
        "已计入衰减"
      ],
      "returned": [
        "Returned",
        "上缴"
      ],
      "kept": [
        "Kept",
        "留存"
      ],
      "ceiling": [
        "Area ceiling",
        "区域上限"
      ]
    },
    "claims": [
      "CL-JP-05",
      "CL-JP-06",
      "CL-JP-07",
      "CL-JP-08",
      "CL-JP-11"
    ],
    "marker": {
      "level": "strong",
      "change": [
        "a change to the terms of awards already made; each new round resets the terms of new awards only.",
        "对已授予合同条款的修改；每一轮新拍卖只重设新中标合同的条款。"
      ]
    }
  },
  "jp-06": {
    "id": "jp-06",
    "chapter": "tensions",
    "scene": "jp-06",
    "question": [
      "How hard will it be to win a new award?",
      "新的中标合同有多难拿到？"
    ],
    "copy": [
      "In {nextRound}, lithium-ion batteries compete for a pool of {lithiumIonPool}, and no award is made beyond it. Projects on cells from makers certified under Japan's economic-security law clear first; others win only what is left. Bids close on {bidCloseDate}, and winning prices are not published one by one.",
      "在{nextRound}中，锂离子电池争夺{lithiumIonPool}的名额，超出部分一律不予中标。使用经日本经济安全保障法认定的厂商所产电芯的项目优先中标，其余项目只能分享剩下的名额。投标于{bidCloseDate}截止，各项目的中标价格不单独公布。"
    ],
    "meaning": [
      "New awards will be few and contested, so an operating award holder is a scarce asset. This round's results are the event the call watches.",
      "新中标名额少、竞争激烈，因此已投运的中标资产是稀缺资产。本轮结果正是本判断所关注的事件。"
    ],
    "controls": [
      [
        "Certified first",
        "认定优先"
      ],
      [
        "Bid order only",
        "仅按报价排序"
      ]
    ],
    "labels": {
      "pool": [
        "Lithium-ion pool",
        "锂离子名额"
      ],
      "certified": [
        "Certified maker's cells",
        "认定厂商电芯"
      ],
      "other": [
        "Other cells",
        "其他电芯"
      ],
      "bidClose": [
        "Bids close",
        "投标截止"
      ]
    },
    "claims": [
      "CL-JP-09",
      "CL-JP-10",
      "CL-JP-13",
      "CL-JP-14"
    ],
    "marker": {
      "level": "strong",
      "change": [
        "the round's results, showing how much certified capacity bid and where the pool cleared.",
        "本轮结果所显示的认定电芯投标规模，以及名额在哪个价位出清。"
      ]
    }
  },
  "jp-08": {
    "id": "jp-08",
    "chapter": "tensions",
    "scene": "jp-08",
    "question": [
      "If the award secures the revenue, why not build?",
      "既然中标合同能锁定收入，为什么不新建？"
    ],
    "copy": [
      "METI limits the return a battery bid may price, so the award pays back a regulated return and little more. Building the play's design at today's cost loses value at a fund's yields: {designValue} per MW. The same award, bought from an operating holder, clears the fund's target at up to {purchaseCeiling} per MW, against a build cost of {buildCostPerMW}.",
      "经产省限制了电池报价可计入的回报，因此中标合同只能带来受监管的回报，几乎没有更多。按当前成本新建本方案的设计，按基金收益率计算会损失价值：每兆瓦{designValue}。同样的中标合同，若从已投运的持有人手中收购，收购价不高于每兆瓦{purchaseCeiling}时即可达到基金的目标收益；相比之下，建设成本为每兆瓦{buildCostPerMW}。"
    ],
    "meaning": [
      "What a fund pays for an award holder is the investment decision. Below the ceiling the call holds; above it, it does not.",
      "基金为中标资产支付的价格，就是投资决策本身。低于上限，判断成立；高于上限，判断不成立。"
    ],
    "controls": [
      [
        "This area",
        "本区域"
      ],
      [
        "Compare areas",
        "比较三个区域"
      ]
    ],
    "labels": {
      "buildCost": [
        "Build cost per MW",
        "每兆瓦建设成本"
      ],
      "purchasePrice": [
        "Purchase price that clears the target",
        "达到目标收益的收购价"
      ],
      "cautious": [
        "Cautious",
        "审慎"
      ],
      "base": [
        "Reference",
        "基准"
      ],
      "favourable": [
        "Favourable",
        "乐观"
      ],
      "discount": [
        "Discount the call needs",
        "本判断所需的折价"
      ],
      "designValue": [
        "Value of a new build, at the platform's yields (USD per MW)",
        "新建项目按本平台收益率计算的价值（美元/兆瓦）"
      ]
    },
    "claims": [
      "CL-JP-12",
      "CL-JP-25",
      "CL-JP-28"
    ],
    "marker": {
      "level": "fair",
      "change": [
        "an observed sale price for an operating Japanese award holder, or published award prices.",
        "已投运日本中标资产的实际成交价格，或公开的中标价格。"
      ]
    },
    "caption": [
      "Model values; bases labelled. No award price is shown because none is published.",
      "模型数值，口径均已标注。由于中标价格未公开，图中不显示中标价格。"
    ]
  },
  "jp-09": {
    "id": "jp-09",
    "chapter": "battery",
    "scene": "jp-09",
    "question": [
      "Why does the battery need more hours than the award asks for?",
      "为什么电池需要比中标要求更长的时长？"
    ],
    "copy": [
      "The award asks for {obligationHours} hours of continuous discharge in every year of its term, and the declared capacity must already allow for fade. A battery built at exactly {obligationHours} hours falls short as soon as it starts to fade. The platform's design starts at {playDuration} hours so that it still holds the floor in year {awardTerm}, without adding cells later.",
      "中标合同要求在合同期内每年都能连续放电{obligationHours}小时，且申报容量必须已考虑衰减。恰好按{obligationHours}小时建设的电池，一开始衰减就达不到要求。本平台的设计从{playDuration}小时起步，在不追加电芯的情况下，到第{awardTerm}年仍能守住最低时长。"
    ],
    "meaning": [
      "The extra hours are the cost of holding the floor. A buyer checks the holder's real fade and declared capacity, not the label on the asset.",
      "多出的时长，是守住最低时长要求的代价。买方要核查的是持有人实际的衰减情况和申报容量，而不是资产标签上的数字。"
    ],
    "controls": [
      [
        "Built at the floor",
        "按最低时长建设"
      ],
      [
        "The play's design",
        "本方案设计"
      ]
    ],
    "labels": {
      "floor": [
        "Floor",
        "最低时长"
      ],
      "fade": [
        "Fade (Example)",
        "衰减（示例）"
      ],
      "finalYear": [
        "Final year",
        "最后一年"
      ],
      "addedHours": [
        "Added hours",
        "追加时长"
      ]
    },
    "claims": [
      "CL-JP-06",
      "CL-JP-07"
    ],
    "marker": {
      "level": "fair",
      "change": [
        "the holder's warranted fade curve and the capacity it declared to OCCTO.",
        "持有人的质保衰减曲线，以及其向OCCTO申报的容量。"
      ]
    }
  },
  "jp-11": {
    "id": "jp-11",
    "chapter": "payment",
    "scene": "jp-11",
    "question": [
      "Who pays the award, and what can reduce it?",
      "中标合同由谁付钱？什么会减少这笔收入？"
    ],
    "copy": [
      "OCCTO pays the award each month, an annual amount set per contracted kW. The holder must meet its performance requirements, with penalties for shortfalls, and must hand back about {clawbackShare} of its profit from other markets. The Electricity and Gas Market Surveillance Commission checks those returns. The cost reaches electricity users through the capacity market.",
      "OCCTO按月支付中标合同款项，年度金额按合同容量每千瓦计算。持有人必须满足履约要求，未达标将被处罚，并须上缴在其他市场所获利润的约{clawbackShare}。电力燃气交易监视等委员会负责核查上缴情况。这笔成本通过容量市场最终由电力用户承担。"
    ],
    "meaning": [
      "The payer is a national institution, and the conditions are performance and the clawback. Lenders can rely on that.",
      "付款方是全国性机构，附带条件是履约和收益上缴，贷款方可以依赖这一点。"
    ],
    "controls": [
      [
        "Payment",
        "付款"
      ],
      [
        "Penalties",
        "处罚"
      ],
      [
        "Clawback",
        "收益上缴"
      ],
      [
        "Who funds it",
        "资金来源"
      ]
    ],
    "labels": {
      "monthly": [
        "Monthly payment",
        "按月付款"
      ],
      "perKW": [
        "Per contracted kW",
        "按合同千瓦计"
      ],
      "penalty": [
        "Penalty",
        "处罚"
      ],
      "returned": [
        "Returned profit",
        "上缴利润"
      ],
      "surveillance": [
        "Surveillance",
        "监视"
      ]
    },
    "claims": [
      "CL-JP-05",
      "CL-JP-08",
      "CL-JP-27"
    ],
    "marker": {
      "level": "fair",
      "change": [
        "OCCTO's capacity-contribution rules, showing who funds the award.",
        "OCCTO关于容量市场分摊费用（容量拠出金）的规则，表明由谁为中标合同出资。"
      ]
    }
  },
  "jp-12": {
    "id": "jp-12",
    "chapter": "payment",
    "scene": "jp-12",
    "question": [
      "After the award and the clawback, what decides the return?",
      "扣除中标合同收入和收益上缴之后，回报由什么决定？"
    ],
    "copy": [
      "On the platform's model, the award covers {securedShare} of first-year revenue across the {securedYears}-year window, and the holder keeps {retainedShare} of its trading profit. The rest of the return comes from what was paid for the asset and what it costs to run.",
      "按本平台模型，在{securedYears}年的测算期内，中标合同覆盖首年收入的{securedShare}，持有人保留交易利润的{retainedShare}。其余回报取决于资产的收购价格和运营成本。"
    ],
    "meaning": [
      "Revenue is nearly fixed, so cost, performance and entry price decide the return. The regional differences matter, but they work through a small share.",
      "收入几乎是固定的，因此回报取决于成本、履约和收购价格。区域差异固然重要，但只通过很小的份额起作用。"
    ],
    "controls": [
      [
        "This area",
        "本区域"
      ],
      [
        "Compare areas",
        "比较三个区域"
      ]
    ],
    "labels": {
      "award": [
        "Award",
        "中标合同收入"
      ],
      "returned": [
        "Trading, returned",
        "交易利润（上缴）"
      ],
      "kept": [
        "Trading, kept",
        "交易利润（留存）"
      ],
      "entryPrice": [
        "Entry price",
        "收购价格"
      ],
      "runningCost": [
        "Running cost",
        "运营成本"
      ]
    },
    "claims": [
      "CL-JP-25",
      "CL-JP-08"
    ],
    "marker": {
      "level": "fair",
      "change": [
        "an operating holder's audited award payments and clawback statements.",
        "已投运持有人经审计的中标合同收款和上缴记录。"
      ]
    }
  }
};
export const JP_TEXT = {
  "Story button and navigation": [
    "Story · Previous · Next · Chapters · Sources",
    "故事 · 上一节 · 下一节 · 章节 · 来源"
  ],
  "Area switch note": [
    "This story is told for {areaName}. The other areas have their own.",
    "本故事针对{areaName}讲述，其他区域各有其故事。"
  ],
  "Evidence drawer": [
    "Source · Locator · Checked on {sourceCheckedDate} · Definition",
    "来源 · 具体位置 · 核查时间：{sourceCheckedDate} · 统计口径"
  ],
  "Marker strings": [
    "Strong evidence. · Fair evidence. · Thin evidence. · What would change it:",
    "证据充分。 · 证据尚可。 · 证据单薄。 · 会改变判断的证据："
  ],
  "Legend": [
    "Schematic · Observed · Official plan · Example · Model value",
    "示意 · 实测 · 官方规划 · 示例 · 模型数值"
  ],
  "Map": [
    "Japan · East · West · Converter stations · {areaName}",
    "日本 · 东部 · 西部 · 变频站 · {areaName}"
  ],
  "Chart accessible summary": [
    "For {areaName}: build cost of the play's design per MW, and the purchase prices per MW at which an operating award holder clears the fund's target, in three cases. Values are model results in JPY per MW",
    "{areaName}：本方案设计的每兆瓦建设成本，以及在三种情景下已投运中标资产达到基金目标收益的每兆瓦收购价。数值为模型结果，单位为日元/兆瓦"
  ],
  "Exits": [
    "Go to the investment case · Back to the play",
    "前往投资方案 · 返回方案卡"
  ],
  "Stale call": [
    "This story was last reviewed against the call of {researchCheckDate}.",
    "本故事最近一次依据{researchCheckDate}的投资判断复核。"
  ],
  "Loading / retry": [
    "Loading source data… · Could not load data · Retry",
    "正在载入来源数据… · 数据未能载入 · 重试"
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
  ],
  "Interpretation": [
    "Interpretation",
    "解读"
  ]
};
export const JP_TIMELINE = [
  {
    "dateToken": "h01Year",
    "style": "observed",
    "fields": {
      "constraint": [
        "Large plant needed decades of predictable income.",
        "大型电源需要数十年可预期的收入。"
      ],
      "choice": [
        "Regional utilities recovered approved costs through regulated tariffs.",
        "区域电力公司通过受监管的电价回收经核准的成本。"
      ],
      "remains": [
        "Areas built for themselves, joined by few links.",
        "各区域各自建设，彼此之间联络线很少。"
      ],
      "effect": [
        "Each area is its own market for a battery.",
        "对电池而言，每个区域都是一个独立的市场。"
      ]
    }
  },
  {
    "dateToken": "earthquakeDate",
    "style": "observed",
    "fields": {
      "constraint": [
        "The earthquake and tsunami took a large share of eastern supply at once.",
        "地震和海啸使东部供电能力一下子损失了很大一部分。"
      ],
      "choice": [
        "Rotate outages across Tokyo's districts.",
        "在东京各区轮流停电。"
      ],
      "remains": [
        "Adequacy became a national question.",
        "供电充足性成为全国性问题。"
      ],
      "effect": [
        "The reform that created today's auctions.",
        "由此开启的改革，催生了今天的拍卖机制。"
      ]
    }
  },
  {
    "dateToken": "reformStep1",
    "style": "observed",
    "fields": {
      "constraint": [
        "Regional monopolies and limited links between areas.",
        "区域垄断，区域间联络有限。"
      ],
      "choice": [
        "A national coordinator, open retail, separated grid companies.",
        "设立全国协调机构，全面放开零售，电网公司独立。"
      ],
      "remains": [
        "Prices set in short-term markets.",
        "由短期市场决定价格。"
      ],
      "effect": [
        "No guaranteed recovery for new plant.",
        "新建电源不再有保障的成本回收。"
      ]
    }
  },
  {
    "dateToken": "capacityMarketYear",
    "style": "observed",
    "fields": {
      "constraint": [
        "Short-term prices could not finance large new plant.",
        "短期价格无法支撑大型新建电源的融资。"
      ],
      "choice": [
        "Pay for capacity one year at a time, then for new low-carbon capacity over many years.",
        "先按年度为容量付费，再为新建低碳容量提供多年期付费。"
      ],
      "remains": [
        "Award holders on long contracts.",
        "持有长期合同的中标者。"
      ],
      "effect": [
        "The asset the call buys.",
        "本判断所要收购的资产。"
      ]
    }
  },
  {
    "dateToken": "supplyCrunchDate",
    "style": "observed",
    "fields": {
      "constraint": [
        "Thermal plant was retiring.",
        "火电机组陆续关停。"
      ],
      "choice": [
        "Keep adequacy on the agenda; widen the auction.",
        "继续把供电充足性放在议程上，并扩大拍卖范围。"
      ],
      "remains": [
        "Auctions repeated each year.",
        "拍卖每年举行。"
      ],
      "effect": [
        "New rounds keep setting the terms new awards carry.",
        "每一轮新拍卖都在重设新中标合同的条款。"
      ]
    }
  },
  {
    "dateToken": "bidCloseDate",
    "style": "planned",
    "fields": {
      "choice": [
        "A capped lithium-ion pool; certified cells clear first.",
        "锂离子设上限；使用认定电芯的项目优先中标。"
      ],
      "effect": [
        "The event the call watches.",
        "本判断所关注的事件。"
      ]
    }
  },
  {
    "dateToken": "firstCurtailmentDate",
    "style": "observed",
    "region": "kyushu",
    "fields": {
      "event": [
        "First renewable curtailment on the Kyushu mainland.",
        "九州本土首次对新能源实施出力控制。"
      ]
    }
  },
  {
    "dateToken": "blackoutDate",
    "style": "observed",
    "region": "hokkaido",
    "fields": {
      "event": [
        "Whole-area blackout after an earthquake; a first for Japan.",
        "地震后全区域大停电，日本首次。"
      ]
    }
  },
  {
    "dateToken": "studyCapDate",
    "style": "observed",
    "region": "tokyo",
    "fields": {
      "event": [
        "One applicant may have only a limited number of connection studies open at once.",
        "每个申请人可同时进行的并网研究数量受到限制。"
      ]
    }
  }
];
export const JP_CLAIMS = {
  "CL-JP-02": {
    "sources": [
      "SRC-JP-14"
    ],
    "type": "evidence"
  },
  "CL-JP-05": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-06": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-07": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-08": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-09": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-10": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-11": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-12": {
    "sources": [
      "SRC-JP-03"
    ],
    "type": "evidence"
  },
  "CL-JP-13": {
    "sources": [
      "SRC-JP-04"
    ],
    "type": "evidence"
  },
  "CL-JP-14": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-15": {
    "sources": [
      "SRC-JP-01"
    ],
    "type": "evidence"
  },
  "CL-JP-16": {
    "sources": [
      "SRC-JP-05"
    ],
    "type": "evidence"
  },
  "CL-JP-17": {
    "sources": [
      "SRC-JP-06"
    ],
    "type": "evidence"
  },
  "CL-JP-18": {
    "sources": [
      "SRC-JP-01",
      "SRC-JP-05",
      "SRC-JP-06"
    ],
    "type": "interpretation"
  },
  "CL-JP-19": {
    "sources": [
      "SRC-JP-08"
    ],
    "type": "evidence"
  },
  "CL-JP-20": {
    "sources": [
      "SRC-JP-10"
    ],
    "type": "evidence"
  },
  "CL-JP-21": {
    "sources": [
      "SRC-JP-11"
    ],
    "type": "evidence"
  },
  "CL-JP-22": {
    "sources": [
      "SRC-JP-15"
    ],
    "type": "evidence"
  },
  "CL-JP-23": {
    "sources": [
      "SRC-JP-07",
      "SRC-JP-15"
    ],
    "type": "evidence"
  },
  "CL-JP-24": {
    "sources": [
      "SRC-JP-13"
    ],
    "type": "evidence"
  },
  "CL-JP-25": {
    "sources": [
      "REPO-JP-LIVE"
    ],
    "type": "model-fact"
  },
  "CL-JP-27": {
    "sources": [
      "SRC-JP-18"
    ],
    "type": "evidence"
  },
  "CL-JP-28": {
    "sources": [
      "SRC-JP-03",
      "REPO-JP-LIVE",
      "REPO-JP-RULINGS"
    ],
    "type": "interpretation"
  },
  "CL-JP-29": {
    "sources": [
      "SRC-JP-17"
    ],
    "type": "evidence"
  }
};
const CHAPTER_LAYOUT = [
  [
    "origins",
    [
      "Origins",
      "系统起点"
    ],
    [
      "jp-01",
      "jp-02"
    ]
  ],
  [
    "choices",
    [
      "Historical choices",
      "历史选择"
    ],
    [
      "jp-03",
      "jp-04",
      "jp-05"
    ]
  ],
  [
    "tensions",
    [
      "Today's tensions",
      "当下矛盾"
    ],
    [
      "jp-06",
      "07",
      "jp-08"
    ]
  ],
  [
    "battery",
    [
      "Add a battery",
      "加入电池"
    ],
    [
      "jp-09",
      "10"
    ]
  ],
  [
    "payment",
    [
      "Who pays",
      "谁来付钱"
    ],
    [
      "jp-11",
      "jp-12"
    ]
  ],
  [
    "investment",
    [
      "The investment",
      "回到投资"
    ],
    [
      "13"
    ]
  ]
];
export const REGION_IDS = Object.freeze({jp_tokyo:'tokyo',jp_kyushu:'kyushu',jp_hokkaido:'hokkaido'});
export function composeStory(regionId){
  const region=REGION_IDS[regionId]||regionId;
  if(!REGIONAL_SHOTS[region])return null;
  const marketId='jp_'+region,playRef='jp-'+region+'-ltda-6h';
  const shot=id=>SHARED_SHOTS[id]||REGIONAL_SHOTS[region]['jp-'+region+'-'+id];
  return {
    storySchemaVersion:1,contentVersion:'2026-11-05',marketId,playRef,
    systemBoundary:{tokyo:['Japan — Tokyo Area','日本 — 东京区域'],kyushu:['Japan — Kyushu Area','日本 — 九州区域'],hokkaido:['Japan — Hokkaido Area','日本 — 北海道区域']}[region],supportedLocales:['en','zh'],
    reviewedAgainst:{playRef,hours:9,call:'opportunistic',lens:'infraFund',route:'ltda',stage:'operating',on:'2026-11-05',commit:'13dacf0e1e3874bd888452f694fc7c90240a97aa'},
    tokens:["areaName","areaSlug","call","playName","cardFigures","nextAction","awardTerm","regionalSentence","eastFrequency","westFrequency","h01Year","earthquakeDate","outageDate","earthquakeMonth","earthquakeYear","supplyCrunchDate","supplyCrunchYear","reformStep1","reformStep2","reformStep3","capacityMarketYear","ltdaYear","obligationHours","clawbackShare","nextRound","lithiumIonPool","bidCloseDate","designValue","purchaseCeiling","buildCostPerMW","playDuration","securedShare","securedYears","retainedShare","converterYear","studyCapDate","studyCap","fitDate","suspensionDate","firstCurtailmentDate","transferTripDate","blackoutDate","blackoutMonth","newKitahonYear","linkYear","chargingControlSystems","sourceCheckedDate","researchCheckDate","playEvidence","purchaseTarget","triggerDate"],
    text:JP_TEXT,claims:JP_CLAIMS,sources:JP_STORY_SOURCES,
    opening:SHARED_SHOTS['jp-00'],
    chapters:CHAPTER_LAYOUT.map(([id,title,ids])=>({id,title,shots:ids.map(shot)})),
  };
}
