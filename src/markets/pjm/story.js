import {PJM_STORY_VALUES as E} from './data/storyEvidenceValues.js';
/* Bilingual storyboard table import; approved reconciliations: evidence section 7.
   All numeric labels resolve existing evidence or live case fields. */
export const story = {
  "storySchemaVersion": 1,
  "contentVersion": "2026-11-03",
  "marketId": "pjm",
  "systemBoundary": [
    "PJM regional capacity market",
    "PJM区域容量市场"
  ],
  "supportedLocales": [
    "en",
    "zh"
  ],
  "playRef": "pjm-cap-4h",
  "reviewedAgainst": {
    "playRef": "pjm-cap-4h",
    "hours": 4,
    "call": "wait",
    "on": "2026-10-31"
  },
  "sources": {...E.sources,"REPO-PJM-LIVE":{"title": "Current investment case", "url": "/markets/pjm#bankable", "checkedOn": "2026-11-03", "locator": "Selected infrastructure-fund row, live play and existing investment summary"}},
  "claims": {
    "CL-PJM-16": {
      "sources": [
        "SRC-PJM-04",
        "SRC-PJM-06",
        "SRC-PJM-07",
        "SRC-PJM-08",
        "SRC-PJM-09",
        "SRC-PJM-10",
        "SRC-PJM-11",
        "SRC-PJM-12",
        "SRC-PJM-01"
      ],
      "kind": "historical-fact plus official-plan; market-rule"
    },
    "CL-PJM-02": {
      "sources": [
        "SRC-PJM-17",
        "SRC-PJM-05"
      ],
      "kind": "market-rule; historical-fact"
    },
    "CL-PJM-03": {
      "sources": [
        "SRC-PJM-01",
        "SRC-PJM-02",
        "SRC-PJM-03"
      ],
      "kind": "observed-data; market-observation"
    },
    "CL-PJM-04": {
      "sources": [
        "SRC-PJM-01",
        "SRC-PJM-02",
        "SRC-PJM-17"
      ],
      "kind": "observed-data; market-rule"
    },
    "CL-PJM-05": {
      "sources": [
        "SRC-PJM-17",
        "SRC-PJM-19",
        "SRC-PJM-20",
        "SRC-PJM-24",
        "SRC-PJM-25"
      ],
      "kind": "interpretation by PJM and by the Market Monitor"
    },
    "CL-PJM-06": {
      "sources": [
        "SRC-PJM-15",
        "SRC-PJM-16",
        "SRC-PJM-13"
      ],
      "kind": "market-rule; historical-fact"
    },
    "CL-PJM-07": {
      "sources": [
        "SRC-PJM-21"
      ],
      "kind": "historical-fact; market-rule"
    },
    "CL-PJM-08": {
      "sources": [
        "SRC-PJM-04",
        "SRC-PJM-12",
        "SRC-PJM-06",
        "SRC-PJM-09"
      ],
      "kind": "market-rule"
    },
    "CL-PJM-09": {
      "sources": [
        "SRC-PJM-11"
      ],
      "kind": "official-plan (non-binding)"
    },
    "CL-PJM-10": {
      "sources": [
        "SRC-PJM-11"
      ],
      "kind": "model-assumption"
    },
    "CL-PJM-11": {
      "sources": [
        "SRC-PJM-17",
        "SRC-PJM-18",
        "SRC-PJM-19"
      ],
      "kind": "official-plan; market-rule"
    },
    "CL-PJM-12": {
      "sources": [
        "SRC-PJM-14",
        "SRC-PJM-13"
      ],
      "kind": "official-plan"
    },
    "CL-PJM-13": {
      "sources": [
        "SRC-PJM-26",
        "SRC-PJM-17"
      ],
      "kind": "market-rule"
    },
    "CL-PJM-14": {
      "sources": [
        "SRC-PJM-22",
        "SRC-PJM-23"
      ],
      "kind": "historical-fact"
    },
    "CL-PJM-15": {
      "sources": [
        "SRC-PJM-25"
      ],
      "kind": "observed-data; official process"
    }
  },
  "opening": {
    "id": "pjm-00",
    "chapter": "opening",
    "scene": "pjm-00",
    "question": [
      "What is the call here, and why should I read on?",
      "这里的投资判断是什么？为什么值得读下去？"
    ],
    "copy": [
      "The existing play card: {call}, {playName}, the figures the card already shows, {nextAction}. Beneath it: \"Why: the best-published capacity price on the platform, but secured a single delivery year at a time, on a credit that is falling.\"",
      "沿用现有投资方案卡：{call}、{playName}、卡片已显示的各项数据、{nextAction}。卡片下方一行：“原因在于：这是本平台公开最充分的容量价格，但每次只能锁定一个交付年度，而计入的认证系数正在下降。”"
    ],
    "meaning": null,
    "marker": {
      "level": "play"
    },
    "controls": [
      [
        "Start the story",
        "开始阅读"
      ],
      [
        "Go to the investment case",
        "前往投资方案"
      ]
    ],
    "claims": [
      "CL-PJM-02",
      "CL-PJM-08",
      "CL-PJM-09"
    ]
  },
  "chapters": [
    {
      "id": "origins",
      "title": [
        "Origins",
        "起源"
      ],
      "shots": [
        {
          "id": "pjm-01",
          "chapter": "origins",
          "scene": "pjm-01",
          "question": [
            "Which market is this, and what does a battery sell into?",
            "这是哪个市场？电池在这里向谁出售服务？"
          ],
          "copy": [
            "PJM began in {number1927} as the world's first continuing power pool. It now runs one grid, one energy market and one capacity auction from New Jersey to Illinois and North Carolina. Since the {number202627} auction, the whole region has cleared at a single capacity price.",
            "PJM始于{number1927}年，是世界上第一个持续运作的电力联营体。如今，它在从新泽西到伊利诺伊、再到北卡罗来纳的广大区域内，运营一张电网、一个电能量市场和一场容量拍卖。自{number202627}交付年度拍卖以来，整个区域均以统一的容量价格出清。"
          ],
          "meaning": [
            "Capacity revenue here comes from one regional auction, not from the site; the site still decides energy revenue and the connection.",
            "这里的容量收入来自统一的区域拍卖，而非具体站址；但电能量收入和并网条件仍取决于站址。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "an auction in which an import-limited zone, such as Virginia or northern Illinois, clears above the rest of the region.",
              "某次拍卖中，弗吉尼亚或伊利诺伊北部等受输入能力限制的区域，出清价格高于区域其他部分。"
            ]
          },
          "controls": [
            [
              "One price",
              "统一价格"
            ],
            [
              "Zones that can split",
              "可能单独定价的区域"
            ]
          ],
          "claims": [
            "CL-PJM-14",
            "CL-PJM-03"
          ],
          "labels": {
            "label0": [
              "PJM region (approximate)",
              "PJM区域（近似）"
            ],
            "label1": [
              "Zones modelled separately",
              "单独建模的区域"
            ],
            "label2": [
              "One clearing price",
              "统一出清价格"
            ]
          },
          "caption": [
            "Approximate. Outline: Natural Earth. Region: PJM.",
            "近似范围。轮廓：Natural Earth。区域：PJM。"
          ]
        }
      ]
    },
    {
      "id": "choices",
      "title": [
        "Historical choices",
        "历史选择"
      ],
      "shots": [
        {
          "id": "pjm-02",
          "chapter": "choices",
          "scene": "pjm-02",
          "question": [
            "How does PJM pay for reliability?",
            "PJM如何为可靠性付费？"
          ],
          "copy": [
            "Through an auction held ahead of time. Since the {number200708} delivery year, PJM has bought capacity in a Base Residual Auction, and each auction buys a single delivery year, from June to May. The next year has to clear again in the next auction.",
            "通过提前举行的拍卖。自{number200708}交付年度起，PJM通过基础剩余容量拍卖采购容量，每次拍卖只采购一个交付年度，即当年六月至次年五月。下一年的容量必须在下一次拍卖中重新出清。"
          ],
          "meaning": [
            "A cleared battery holds its capacity price for that year only, which is why this play counts capacity as secured for {securedTenor} year and treats later years as scenarios.",
            "出清的电池只在该年度内锁定容量价格；因此本方案仅把{securedTenor}年的容量收入计为锁定收入，其后各年均按情景处理。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a rule that commits auction capacity for more than one delivery year, such as the backstop taking effect for the project.",
              "出现把拍卖容量承诺延长至多个交付年度的规则，例如兜底采购对该项目生效。"
            ]
          },
          "controls": [
            [
              "Select a node",
              "选择节点"
            ],
            [
              "Constraint",
              "约束"
            ],
            [
              "Choice",
              "选择"
            ],
            [
              "What remains",
              "遗留"
            ],
            [
              "Effect today",
              "今日影响"
            ]
          ],
          "claims": [
            "CL-PJM-02",
            "CL-PJM-06",
            "CL-PJM-11",
            "CL-PJM-14"
          ],
          "extra": {
            "historyNodes": [
              {
                "id": "H-PJM-01",
                "when": "{historyWhen1}",
                "title": [
                  "A power pool",
                  "电力联营"
                ],
                "style": "observed",
                "constraint": [
                  "Neighbouring utilities wanted to share their power plants.",
                  "相邻的电力公司希望共享各自的发电厂。"
                ],
                "choice": [
                  "Join their systems in a pool.",
                  "把各自的系统联成一个联营体。"
                ],
                "remains": [
                  "One operator for a large region spanning many states.",
                  "一个统一调度、横跨多个州的大区域运营机构。"
                ],
                "effect": [
                  "One capacity auction, and lately one capacity price, across the region.",
                  "全区域只有一场容量拍卖，近来也只有一个容量价格。"
                ]
              },
              {
                "id": "H-PJM-02",
                "when": "{historyWhen2}",
                "title": [
                  "Capacity bought ahead",
                  "提前采购容量"
                ],
                "style": "observed",
                "constraint": [
                  "New plants take years to build, so reliability has to be bought before it is needed.",
                  "新电厂建设需要数年，可靠性必须提前买下。"
                ],
                "choice": [
                  "A forward auction for each delivery year: the Reliability Pricing Model.",
                  "按交付年度举行远期拍卖，即可靠性定价模型。"
                ],
                "remains": [
                  "The Base Residual Auction.",
                  "基础剩余容量拍卖。"
                ],
                "effect": [
                  "Secured capacity revenue lasts a single delivery year.",
                  "锁定的容量收入只覆盖一个交付年度。"
                ]
              },
              {
                "id": "H-PJM-03",
                "when": "{historyWhen3}",
                "title": [
                  "Paid to perform",
                  "按履约付费"
                ],
                "style": "observed",
                "constraint": [
                  "Many plants failed in the {number2014} Polar Vortex.",
                  "{number2014}年极地涡旋期间大量机组失灵。"
                ],
                "choice": [
                  "Capacity Performance: a charge for any resource that falls short in an emergency.",
                  "容量绩效规则：紧急状态下未能履约的资源须缴纳罚款。"
                ],
                "remains": [
                  "Performance Assessment Intervals and their charges.",
                  "绩效评估时段及相应罚款。"
                ],
                "effect": [
                  "A cleared battery must deliver in emergencies, including long winter ones.",
                  "出清的电池必须在紧急状态下履约，包括持续较长的冬季紧急状态。"
                ]
              },
              {
                "id": "H-PJM-04",
                "when": "{historyWhen4}",
                "title": [
                  "Winter risk sets the credit",
                  "冬季风险"
                ],
                "style": "observed",
                "constraint": [
                  "In Winter Storm Elliott, in December {number2022}, generators failed in the cold on a large scale.",
                  "{number2022}年末的冬季风暴Elliott期间，大量机组在严寒中失灵。"
                ],
                "choice": [
                  "Credit every resource for what it adds in the riskiest hours, approved by FERC in January {number2024}.",
                  "按每种资源在风险最高时段的边际贡献核定认证系数，于{number2024}年一月获FERC批准。"
                ],
                "remains": [
                  "A class rating set before each auction.",
                  "每次拍卖前核定的类别核定值。"
                ],
                "effect": [
                  "Storage is judged on long winter events, and its credit is falling.",
                  "储能按持续较长的冬季事件接受评估，其认证系数正在下降。"
                ]
              },
              {
                "id": "H-PJM-05",
                "when": "{historyWhen5}",
                "title": [
                  "Demand outruns supply",
                  "需求超过供给"
                ],
                "style": "observed",
                "constraint": [
                  "Data-centre load grew faster than new supply.",
                  "数据中心负荷增长快于新增供给。"
                ],
                "choice": [
                  "Cap and floor the price through the {number202930} auction, and propose a backstop procurement.",
                  "为截至{number202930}交付年度的拍卖设定价格上下限，并提出兜底采购。"
                ],
                "remains": [
                  "A capped price, and auctions that fell short of the reliability requirement.",
                  "受上限约束的价格，以及低于可靠性需求的拍卖结果。"
                ],
                "effect": [
                  "The high price is a ceiling, secured a single year at a time.",
                  "高价是上限，且每次只能锁定一年。"
                ]
              },
              {
                "id": "H-PJM-06",
                "when": "{historyWhen6}",
                "title": [
                  "After the cap",
                  "上限之后"
                ],
                "style": "plan",
                "constraint": [
                  "No cap or floor is approved after the {number202930} auction.",
                  "{number202930}交付年度拍卖之后，尚无获批的价格上下限。"
                ],
                "choice": [
                  "None yet: an outlook, not a decision. The backstop is suspended, and the rules for later auctions are open.",
                  "尚无决定：这是展望，而非决策。兜底采购被中止，此后拍卖的规则仍未确定。"
                ],
                "effect": [
                  "The case waits for the December auction and the backstop ruling.",
                  "投资方案须等待十二月的拍卖结果和兜底采购的裁定。"
                ]
              }
            ]
          }
        },
        {
          "id": "pjm-03",
          "chapter": "choices",
          "scene": "pjm-03",
          "question": [
            "What does a capacity resource promise in PJM?",
            "在PJM，容量资源承诺了什么？"
          ],
          "copy": [
            "To deliver when the grid is in trouble. After many plants failed in the {number2014} Polar Vortex, PJM brought in Capacity Performance rules in {number2016}: a resource that falls short during an emergency pays a charge. Winter Storm Elliott, in December {number2022}, was their first wide-scale use.",
            "在电网告急时如约供电。{number2014}年极地涡旋期间大量机组失灵，PJM随后于{number2016}年推出“容量绩效”规则：紧急状态下未能履约的资源须缴纳罚款。{number2022}年末的冬季风暴Elliott是这套规则首次大范围实施。"
          ],
          "meaning": [
            "For a battery the obligation falls in winter emergencies that can last for days, so its value depends on how long it can keep delivering.",
            "对电池而言，这项义务集中在可能持续数日的冬季紧急状态，因此其价值取决于它能持续供电多久。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a change to the Capacity Performance charges, or to the emergencies that trigger them.",
              "容量绩效罚款规则，或触发罚款的紧急状态规则发生变化。"
            ]
          },
          "controls": [
            [
              "{number2014} Polar Vortex",
              "{number2014}年极地涡旋"
            ],
            [
              "Winter Storm Elliott",
              "冬季风暴Elliott"
            ],
            [
              "Show the obligation",
              "显示履约义务"
            ]
          ],
          "claims": [
            "CL-PJM-07"
          ],
          "labels": {
            "label0": [
              "Forced outage",
              "强迫停运"
            ],
            "label1": [
              "Emergency (Performance Assessment Interval)",
              "紧急状态（绩效评估时段）"
            ],
            "label2": [
              "Example: battery state of charge",
              "示例：电池荷电状态"
            ]
          }
        },
        {
          "id": "pjm-04",
          "chapter": "choices",
          "scene": "pjm-04",
          "question": [
            "If I own a {playDuration}-hour battery, how much of it is paid for capacity?",
            "如果我拥有一台{playDuration}小时电池，其中多少容量能获得付费？"
          ],
          "copy": [
            "Only part of its power. Since the {number202526} auction, PJM credits every resource for what it adds in the hours of greatest risk. For the next auction a {playDuration}-hour battery is credited {nextAuctionRating} of its power; longer batteries are credited more.",
            "只有部分功率。自{number202526}交付年度拍卖起，PJM按每种资源在风险最高时段的边际贡献核定认证系数。在下一次拍卖中，{playDuration}小时电池按其功率的{nextAuctionRating}计入；时长更长的电池计入比例更高。"
          ],
          "meaning": [
            "A battery is paid the auction price on its credited power only, so a lower credit cuts revenue even when the price holds.",
            "电池只能按计入的功率获得拍卖价格，因此即使价格不变，认证系数下降也会减少收入。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a FERC-approved change to how PJM accredits storage.",
              "经FERC批准的PJM储能认证方法变更。"
            ]
          },
          "controls": [
            [
              "Nameplate",
              "铭牌功率"
            ],
            [
              "Credited",
              "计入功率"
            ],
            [
              "By duration",
              "按时长"
            ]
          ],
          "claims": [
            "CL-PJM-08"
          ],
          "labels": {
            "label0": [
              "Example: {number100} MW battery",
              "示例：{number100}MW电池"
            ],
            "label1": [
              "Credited MW",
              "计入的MW"
            ],
            "label2": [
              "Class rating, next auction",
              "下一次拍卖的类别核定值"
            ],
            "label3": [
              "{playDuration}-hour storage",
              "{playDuration}小时储能"
            ]
          }
        }
      ]
    },
    {
      "id": "tensions",
      "title": [
        "Today's tensions",
        "当下的矛盾"
      ],
      "shots": [
        {
          "id": "pjm-05",
          "chapter": "tensions",
          "scene": "pjm-05",
          "question": [
            "Why is the capacity price so high?",
            "为什么容量价格这么高？"
          ],
          "copy": [
            "Demand is growing faster than new supply, led by data centres. In December {number2025}, for the first time, an auction cleared well short of PJM's reliability requirement; the July {number2026} auction fell short again. Both cleared at the price cap.",
            "需求增长快于新增供给，数据中心是主要推手。{number2025}年底，拍卖出清量首次明显低于PJM的可靠性需求；{number2026}年七月的拍卖再次出现缺口。两次拍卖均以价格上限出清。"
          ],
          "meaning": [
            "The scarcity is real, but the price a battery sees is a ceiling, not what the auction would otherwise have cleared.",
            "稀缺是真实的，但电池看到的价格是上限，而不是拍卖本来会出清的价格。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "an auction that meets the full reliability requirement below the cap.",
              "某次拍卖在上限以下出清并满足全部可靠性需求。"
            ]
          },
          "controls": [
            [
              "{number202728} auction",
              "{number202728}拍卖"
            ],
            [
              "{number202829} auction",
              "{number202829}拍卖"
            ],
            [
              "Where the demand comes from",
              "需求从何而来"
            ]
          ],
          "claims": [
            "CL-PJM-04",
            "CL-PJM-05",
            "CL-PJM-15"
          ],
          "labels": {
            "label0": [
              "Reliability requirement",
              "可靠性需求"
            ],
            "label1": [
              "Cleared",
              "已出清"
            ],
            "label2": [
              "Shortfall",
              "缺口"
            ],
            "label3": [
              "Price cap",
              "价格上限"
            ],
            "label4": [
              "New supply waiting to connect",
              "等待并网的新增供给"
            ]
          },
          "caption": [
            "Sources: PJM Base Residual Auction reports for {number202728} and {number202829}; data-centre attribution from PJM and PJM's Independent Market Monitor.",
            "来源：PJM {number202728}与{number202829}交付年度基础剩余容量拍卖报告；数据中心的影响分析来自PJM及其独立市场监察机构。"
          ]
        },
        {
          "id": "pjm-06",
          "chapter": "tensions",
          "scene": "pjm-06",
          "question": [
            "Is that a market price?",
            "这是市场形成的价格吗？"
          ],
          "copy": [
            "Only partly. Since the {number202627} auction, a cap and floor have held the price in a band. PJM proposed them to settle a complaint by Pennsylvania; FERC approved them in April {number2025}, and in April {number2026} approved their extension through the {number202930} auction. PJM's own simulation of the July {number2026} auction without them cleared far higher.",
            "只能算部分是。自{number202627}交付年度拍卖起，价格上下限把价格限定在一个区间内。这一上下限是PJM为解决宾夕法尼亚州的申诉而提出的，{number2025}年四月获FERC批准；{number2026}年四月，FERC又批准将其延长至{number202930}交付年度拍卖。PJM对{number2026}年七月拍卖的模拟显示，若没有上下限，出清价格将远高于此。"
          ],
          "meaning": [
            "Today's price is a ceiling set by settlement. No cap or floor is approved after the {number202930} auction, so the price for later years could move either way.",
            "当前价格是和解协议设定的上限。{number202930}交付年度拍卖之后尚无获批的上下限，因此此后各年的价格可能上行，也可能下行。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a FERC-approved cap, floor or other price rule for the {number203031} auction.",
              "FERC批准适用于{number203031}交付年度拍卖的价格上限、下限或其他价格规则。"
            ]
          },
          "controls": [
            [
              "With the cap",
              "有上下限"
            ],
            [
              "Without it (PJM simulation)",
              "无上下限（PJM模拟）"
            ]
          ],
          "claims": [
            "CL-PJM-06",
            "CL-PJM-03"
          ],
          "labels": {
            "label0": [
              "Demand curve",
              "需求曲线"
            ],
            "label1": [
              "Cap",
              "上限"
            ],
            "label2": [
              "Floor",
              "下限"
            ],
            "label3": [
              "Cleared at the cap",
              "以上限出清"
            ],
            "label4": [
              "Simulation without cap and floor",
              "无上下限模拟"
            ]
          }
        },
        {
          "id": "pjm-07",
          "chapter": "tensions",
          "scene": "pjm-07",
          "question": [
            "If the price is so high, why wait?",
            "既然价格这么高，为什么还要等待？"
          ],
          "copy": [
            "Because the price is set a single delivery year at a time, and the credit is falling. For the next auction a {playDuration}-hour battery is credited {nextAuctionRating}. PJM's indicative ratings put it at {indicative203031} for {number203031}, the first auction with no cap approved, and lower again in later years.",
            "因为价格每次只锁定一个交付年度，而认证系数正在下降。在下一次拍卖中，{playDuration}小时电池按{nextAuctionRating}计入；按PJM的指示性核定值，{number203031}交付年度（首个尚无获批价格上限的拍卖）将降至{indicative203031}，此后还会继续走低。"
          ],
          "meaning": [
            "The credited power a battery can sell is set to shrink just as the cap ends, so the next auctions, not today's price, decide its value.",
            "恰在价格上限到期之际，电池可出售的计入功率却将缩水；因此决定其价值的是接下来的几次拍卖，而非当前价格。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "ratings for the {number203031} auction, which PJM is due to post in January {number2027}, well above PJM's indicative value.",
              "PJM预计于{number2027}年一月公布的{number203031}交付年度拍卖核定值明显高于其指示性数值。"
            ]
          },
          "controls": [
            [
              "Price",
              "价格"
            ],
            [
              "Credit",
              "认证系数"
            ],
            [
              "Show PJM's indicative ratings",
              "显示PJM指示性核定值"
            ]
          ],
          "claims": [
            "CL-PJM-16",
            "CL-PJM-03",
            "CL-PJM-08",
            "CL-PJM-09",
            "CL-PJM-12"
          ],
          "labels": {
            "label0": [
              "Clearing price, $/MW-day",
              "出清价格（美元/MW·日）"
            ],
            "label1": [
              "Cap and floor",
              "价格上下限"
            ],
            "label2": [
              "{playDuration}-hour storage rating",
              "{playDuration}小时储能核定值"
            ],
            "label3": [
              "Indicative (PJM, non-binding)",
              "指示性（PJM，不具约束力）"
            ],
            "label4": [
              "Auction pending",
              "拍卖待举行"
            ],
            "label5": [
              "No cap approved",
              "尚无获批上限"
            ],
            "label6": [
              "One delivery year",
              "一个交付年度"
            ]
          },
          "caption": [
            "Prices: PJM Base Residual Auction reports. Ratings: PJM's ELCC class ratings for each auction; later years from PJM's preliminary ratings of {sourceVintage}, which are non-binding.",
            "价格：PJM基础剩余容量拍卖报告。核定值：PJM各次拍卖的ELCC类别核定值；后续年度取自PJM于{sourceVintage}发布的初步核定值，不具约束力。"
          ]
        }
      ]
    },
    {
      "id": "battery",
      "title": [
        "Add a battery",
        "加入电池"
      ],
      "shots": [
        {
          "id": "pjm-08",
          "chapter": "battery",
          "scene": "pjm-08",
          "question": [
            "Why this duration?",
            "为什么是这个时长？"
          ],
          "copy": [
            "Longer batteries receive more capacity credit but cost more to build. The design test compares each duration’s own indicative renewal credit at the model’s unchanged price scenario. Its best capacity duration is {bestDuration} hours; the current play is {playDuration} hours. Every displayed design still needs to pass the fund’s target test.",
            "更长时长可以获得更多计入容量，但建设成本更高。设计测试在模型既定价格情景下，分别采用各时长自身的参考续期计入比例。容量路径的最优时长为{bestDuration}小时，当前方案为{playDuration}小时。所有展示的设计仍须通过基金目标回报检验。"
          ],
          "meaning": [
            "A higher credited share is valuable only relative to its extra capital cost; indicative credit remains non-binding.",
            "更高计入比例的价值须与额外资本投入比较；参考计入比例仍不具约束力。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a design test run on PJM's indicative ratings, or a battery price, that moves the best duration.",
              "以PJM指示性核定值重新运行的设计测试，或电池价格变化，使最优时长改变。"
            ]
          },
          "controls": [
            [
              "One option for each duration in {designDurations}",
              "按{designDurations}逐一设置时长选项"
            ],
            [
              "Show the design test",
              "显示设计测试"
            ]
          ],
          "claims": [
            "CL-PJM-10"
          ],
          "labels": {
            "label0": [
              "Credited share, next auction",
              "下一次拍卖的计入比例"
            ],
            "label1": [
              "More energy",
              "更多电量"
            ],
            "label2": [
              "More capital",
              "更多资本"
            ],
            "label3": [
              "Design test: {designLine}",
              "设计测试：{designLine}"
            ]
          }
        },
        {
          "id": "pjm-09",
          "chapter": "battery",
          "scene": "pjm-09",
          "question": [
            "Why is the credit falling?",
            "为什么认证系数在下降？"
          ],
          "copy": [
            "Because PJM's riskiest hours have moved into winter, and winter emergencies can last for days. A battery that empties on the first cold evening cannot recharge if demand stays high through the night. PJM's indicative ratings show the credit for every storage class falling over the period to {number204243}, the shortest batteries most.",
            "因为PJM风险最高的时段已转向冬季，而冬季紧急状态可能持续数日。电池若在第一个寒冷的傍晚放空，而夜间需求居高不下，就无法再充电。PJM的指示性核定值显示，截至{number204243}交付年度，各类储能的认证系数都将下降，时长最短的电池降幅最大。"
          ],
          "meaning": [
            "A credit set for each auction makes long-run capacity revenue an assumption, not a fact.",
            "认证系数按每次拍卖重新核定，因此长期容量收入只是假设，而非事实。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "official ratings for later auctions that stop falling, or a change in how PJM models winter risk.",
              "后续拍卖的正式核定值不再下降，或PJM对冬季风险的建模方式改变。"
            ]
          },
          "controls": [
            [
              "Next auction",
              "下一次拍卖"
            ],
            [
              "{number203031} (indicative)",
              "{number203031}（指示性）"
            ],
            [
              "{number203536} (indicative)",
              "{number203536}（指示性）"
            ],
            [
              "Example battery",
              "示例电池"
            ]
          ],
          "claims": [
            "CL-PJM-09",
            "CL-PJM-08"
          ],
          "labels": {
            "label0": [
              "Example: {number100} MW battery",
              "示例：{number100}MW电池"
            ],
            "label1": [
              "Credited MW",
              "计入的MW"
            ],
            "label2": [
              "Indicative (PJM, non-binding)",
              "指示性（PJM，不具约束力）"
            ],
            "label3": [
              "Winter emergency",
              "冬季紧急状态"
            ],
            "label4": [
              "Cannot recharge",
              "无法充电"
            ]
          }
        }
      ]
    },
    {
      "id": "payment",
      "title": [
        "Who pays",
        "谁来付费"
      ],
      "shots": [
        {
          "id": "pjm-10",
          "chapter": "payment",
          "scene": "pjm-10",
          "question": [
            "Who pays this battery, and for what?",
            "谁为这台电池付费？为什么付费？"
          ],
          "copy": [
            "Capacity first. Electricity suppliers pay through PJM, day by day through the delivery year, for capacity that cleared the auction, and the battery must deliver in emergencies. In this play capacity is {securedShare} of first-year modelled revenue. The model counts it as secured for {securedTenor} year and unsecured after; a real project holds that year only once it has cleared an auction. Energy trading and Regulation, both merchant, make up the rest.",
            "容量收入优先。售电主体通过PJM，在整个交付年度内按日为拍卖中出清的容量付费；电池须在紧急状态下履约。在本方案中，容量收入占首年模型收入的{securedShare}。模型仅将其在{securedTenor}年内计为锁定收入，此后为非锁定收入；实际项目只有在拍卖中出清后，才真正拥有这一年的收入。其余收入来自电能量交易和调频，均为市场化收入。"
          ],
          "meaning": [
            "The secured part of this play lasts a single delivery year; everything after it depends on auctions not yet held.",
            "本方案的锁定收入只覆盖一个交付年度；此后的一切都取决于尚未举行的拍卖。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the settlement clauses for the energy and Regulation routes; the capacity route is already sourced.",
              "电能量和调频两条路径的结算条款；容量路径已有出处。"
            ]
          },
          "controls": [
            [
              "Capacity",
              "容量"
            ],
            [
              "Energy",
              "电能量"
            ],
            [
              "Regulation",
              "调频"
            ]
          ],
          "claims": [
            "CL-PJM-13",
            "CL-PJM-07",
            "CL-PJM-02"
          ],
          "labels": {
            "label0": [
              "Paid",
              "计价"
            ],
            "label1": [
              "Obligation",
              "义务"
            ],
            "label2": [
              "Evidence",
              "证据"
            ]
          },
          "extra": {
            "routes": [
              [
                "Cleared in the auction → Committed for the delivery year → Deliver in emergencies → Paid per day. Paid: the auction price, per MW of credited capacity, per day. Obligation: deliver during emergencies, or pay a charge. Evidence: rules sourced",
                "拍卖出清 → 承诺该交付年度 → 紧急状态下履约 → 按日付费。计价：按拍卖价格，每MW计入容量、每日计。义务：紧急状态下履约，否则缴纳罚款。证据：规则已有出处"
              ],
              [
                "Offered → Dispatched → Paid at the node. Paid: per MWh at the nodal price. Obligation: deliver what is dispatched. Evidence: settlement clauses pending",
                "报价 → 获得调度 → 按节点电价结算。计价：按节点电价、每MWh计。义务：按调度指令出力。证据：结算条款待核"
              ],
              [
                "Offered → Assigned → Paid for regulation provided. Paid: per MW of regulation, per hour. Obligation: follow PJM's regulation signal. Evidence: product terms pending",
                "报价 → 获得分配 → 按所提供的调频付费。计价：按每MW调频、每小时计。义务：跟随PJM的调频信号。证据：产品条款待核"
              ]
            ]
          }
        },
        {
          "id": "pjm-11",
          "chapter": "payment",
          "scene": "pjm-11",
          "question": [
            "Could a battery lock in more than one year?",
            "电池能否锁定超过一年的收入？"
          ],
          "copy": [
            "Possibly, through PJM's backstop. To fill the shortfall, PJM proposed a one-time procurement of new capacity, batteries included, with commitments of up to {backstopTerm} years. FERC accepted it on {acceptedDate} but suspended it until {backstopDate} while it settles who pays, and PJM filed an amended plan on {amendedDate}.",
            "有可能，途径是PJM的兜底采购。为弥补缺口，PJM提出一次性采购新增容量（包括电池），承诺期最长{backstopTerm}年。FERC于{acceptedDate}接受了这一方案，但在确定由谁付费期间，将其中止至{backstopDate}；PJM已于{amendedDate}提交修订方案。"
          ],
          "meaning": [
            "A multi-year commitment would change this play's secured revenue, but none is on offer yet, and the platform does not model one.",
            "多年期承诺将改变本方案的锁定收入，但目前尚无此类承诺可供签订，本平台也未对其建模。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "FERC's ruling on PJM's amended filing, and backstop results that show whether batteries win commitments.",
              "FERC对PJM修订申请的裁定，以及显示电池能否获得承诺的兜底采购结果。"
            ]
          },
          "controls": [
            [
              "Auction only",
              "仅拍卖"
            ],
            [
              "With the backstop (scenario)",
              "含兜底采购（情景）"
            ]
          ],
          "claims": [
            "CL-PJM-11"
          ],
          "labels": {
            "label0": [
              "Accepted",
              "已接受"
            ],
            "label1": [
              "Suspended",
              "已中止"
            ],
            "label2": [
              "Proposed bid window",
              "拟议投标窗口"
            ],
            "label3": [
              "Commitment of up to {backstopTerm} years",
              "最长{backstopTerm}年的承诺"
            ],
            "label4": [
              "Scenario",
              "情景"
            ]
          }
        }
      ]
    },
    {
      "id": "investment",
      "title": [
        "The investment",
        "投资"
      ],
      "shots": [
        {
          "id": "pjm-12",
          "chapter": "investment",
          "scene": "pjm-12",
          "question": [
            "What would make this play worth pricing, and what would make it worse?",
            "什么会让这个方案值得定价？什么会让它更糟？"
          ],
          "copy": [
            "{watchedTriggerCount} events could change the case. The December auction sets the {number202930} price, and a third large shortfall in a row would also trigger the backstop auction already in PJM's rules. The suspension of PJM's new backstop ends on {backstopDate}; it could offer batteries longer commitments, or add competing supply. Until then the reference return is {holdReturn} against the fund's target of {targetReturn}. Next: {nextAction}",
            "有{watchedTriggerCount}件事可能改变投资方案。十二月的拍卖将确定{number202930}交付年度的价格；若连续第三次出现较大缺口，还会触发PJM现行规则中的兜底拍卖。PJM新兜底采购的中止期于{backstopDate}结束；它可能为电池提供更长期的承诺，也可能带来更多竞争性供给。在此之前，参考回报为{holdReturn}，而基金的目标为{targetReturn}。下一步：{nextAction}"
          ],
          "meaning": [
            "{nextAction}",
            "{nextAction}"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a change to the auction schedule or to the backstop's timetable.",
              "拍卖时间表或兜底采购时间表发生变化。"
            ]
          },
          "controls": [
            [
              "Auction price",
              "拍卖价格"
            ],
            [
              "Credit",
              "认证系数"
            ],
            [
              "Backstop",
              "兜底采购"
            ],
            [
              "Return",
              "回报"
            ],
            [
              "Connection",
              "并网"
            ]
          ],
          "claims": [
            "CL-PJM-04",
            "CL-PJM-11",
            "CL-PJM-12",
            "CL-PJM-15"
          ],
          "extra": {
            "factors": [
              {
                "affects": [
                  "Affects capacity income; see the fixed-payment input",
                  "影响容量收入；见固定收入输入项"
                ]
              },
              {
                "affects": [
                  "Affects credited MW; no matching downside input yet",
                  "影响计入的MW；下行测试暂无对应输入项"
                ]
              },
              {
                "affects": [
                  "Could lengthen secured revenue or add competition; see the fixed-term input",
                  "可能延长锁定收入，也可能加剧竞争；见固定期限输入项"
                ]
              },
              {
                "affects": [
                  "Below the fund's target; see Bankable case",
                  "低于基金目标；见可融资方案"
                ]
              },
              {
                "affects": [
                  "A new request waits for the reformed study cycles; see the delay input",
                  "新申请须等待改革后的研究周期；见投运延误输入项"
                ]
              },
              {
                "affects": [
                  "The other side: {counterpoint}",
                  "另一面：{counterpoint}"
                ]
              }
            ],
            "exits": [
              {
                "label": [
                  "Bankable case",
                  "可融资方案"
                ],
                "anchor": "bankable"
              },
              {
                "label": [
                  "Revenue",
                  "收益拆解"
                ],
                "anchor": "revenue"
              },
              {
                "label": [
                  "Execution",
                  "执行步骤"
                ],
                "anchor": "execution"
              },
              {
                "label": [
                  "Downside",
                  "下行风险"
                ],
                "anchor": "downside"
              }
            ]
          }
        }
      ]
    }
  ],
  "tokens": [
    "acceptedDate",
    "amendedDate",
    "backstopDate",
    "backstopTerm",
    "bestDuration",
    "call",
    "counterpoint",
    "designDurations",
    "designLine",
    "historyWhen1",
    "historyWhen2",
    "historyWhen3",
    "historyWhen4",
    "historyWhen5",
    "historyWhen6",
    "holdReturn",
    "indicative203031",
    "nextAction",
    "nextAuctionRating",
    "number100",
    "number1927",
    "number200708",
    "number2014",
    "number2016",
    "number2022",
    "number2024",
    "number2025",
    "number202526",
    "number2026",
    "number202627",
    "number2027",
    "number202728",
    "number202829",
    "number202930",
    "number203031",
    "number203536",
    "number204243",
    "playDuration",
    "playName",
    "securedShare",
    "securedTenor",
    "sourceVintage",
    "targetReturn",
    "watchedTriggerCount"
  ]
};
export const FIELD_BINDINGS = {
  "call": {
    "path": "R.call",
    "format": "call"
  },
  "playName": {
    "path": "R.play",
    "format": "play"
  },
  "nextAction": {
    "path": "R.play.action.text",
    "format": "pair"
  },
  "playDuration": {
    "path": "R.play.hours",
    "format": "text"
  },
  "securedTenor": {
    "path": "R.econ.securedYears",
    "format": "text"
  },
  "securedShare": {
    "path": "R.econ.secured",
    "format": "share"
  },
  "holdReturn": {
    "path": "R.econ.hold",
    "format": "return"
  },
  "targetReturn": {
    "path": "R.econ.test.target",
    "format": "return"
  },
  "counterpoint": {
    "path": "R.decision.counterpoint",
    "format": "pair"
  },
  "bestDuration": {
    "path": "B.grids.pjm.byRoute.cap.best",
    "format": "text"
  },
  "designDurations": {
    "path": "B.grids.pjm.hours",
    "format": "list"
  },
  "designLine": {
    "path": "B.build.pjm.line",
    "format": "pair"
  },
  "nextAuctionRating": {
    "path": "nextPublishedAuction.auctionRatingByHours",
    "format": "rating"
  },
  "indicative203031": {
    "path": "E.years.2030-31.indicativeRatingByHours",
    "format": "rating"
  },
  "backstopTerm": {
    "path": "E.backstop.maxTermYears",
    "format": "text"
  },
  "backstopDate": {
    "path": "B.triggers.pjm-backstop-filing-suspension-ends.expected",
    "format": "date"
  },
  "sourceVintage": {
    "path": "E.years.2030-31.indicativeRatingSourceVintageOn",
    "format": "date"
  },
  "watchedTriggerCount": {
    "path": "B.triggers",
    "format": "count"
  },
  "number1927": {
    "path": "E.history.H-PJM-01.when",
    "format": "text"
  },
  "number200708": {
    "path": "E.history.H-PJM-02.firstDeliveryYear",
    "format": "text"
  },
  "number2014": {
    "path": "E.history.H-PJM-03.polarVortexYear",
    "format": "text"
  },
  "number2016": {
    "path": "E.history.H-PJM-03.performanceYear",
    "format": "text"
  },
  "number2022": {
    "path": "E.history.H-PJM-04.elliottMonth",
    "format": "year"
  },
  "number2024": {
    "path": "E.history.H-PJM-04.marginalApprovalDate",
    "format": "year"
  },
  "number2025": {
    "path": "E.history.H-PJM-05.collarApprovedOn",
    "format": "year"
  },
  "number2026": {
    "path": "E.history.H-PJM-05.extensionApprovedOn",
    "format": "year"
  },
  "number2027": {
    "path": "E.years.2030-31.ratingPostedDate",
    "format": "year"
  },
  "number100": {
    "path": "E.teaching.powerMW",
    "format": "text"
  },
  "number202526": {
    "path": "E.years.2025-26.deliveryYear",
    "format": "text"
  },
  "number202627": {
    "path": "E.years.2026-27.deliveryYear",
    "format": "text"
  },
  "number202728": {
    "path": "E.years.2027-28.deliveryYear",
    "format": "text"
  },
  "number202829": {
    "path": "E.years.2028-29.deliveryYear",
    "format": "text"
  },
  "number202930": {
    "path": "E.years.2029-30.deliveryYear",
    "format": "text"
  },
  "number203031": {
    "path": "E.years.2030-31.deliveryYear",
    "format": "text"
  },
  "number203536": {
    "path": "E.years.2035-36.deliveryYear",
    "format": "text"
  },
  "number204243": {
    "path": "E.years.2042-43.deliveryYear",
    "format": "text"
  },
  "acceptedDate": {
    "path": "E.backstop.acceptedOn",
    "format": "date"
  },
  "amendedDate": {
    "path": "E.backstop.amendedFiledOn",
    "format": "date"
  },
  "historyWhen1": {
    "path": "E.history.H-PJM-01.when",
    "format": "text"
  },
  "historyWhen2": {
    "path": "E.history.H-PJM-02.when",
    "format": "text"
  },
  "historyWhen3": {
    "path": "E.history.H-PJM-03.when",
    "format": "text"
  },
  "historyWhen4": {
    "path": "E.history.H-PJM-04.when",
    "format": "text"
  },
  "historyWhen5": {
    "path": "E.history.H-PJM-05.when",
    "format": "text"
  },
  "historyWhen6": {
    "path": "E.history.H-PJM-06.when",
    "format": "text"
  }
};
