/* Romania: the complete bilingual script signed off at G-1 on 1 November 2026.
   Plain content only: no rendering code and no typed figure. Every amount,
   share, duration and count is a {token} that resolves through storyBindings.js;
   dates are sourced events and the two Example tags stay where the script puts
   them. Source: docs/immersive-experience-plan/romania-storyboard.md, and the
   field owners in docs/immersive-experience-plan/ro-build-evidence.md.

   The marker clause alone is stored; the shell prints the fixed wording around
   it. ro-11's third label states that a floor was announced without counting
   announcements, because that count waits on a source-use record.

   Preserve both languages when the analyst approves any later wording. */
export const story = {
  "storySchemaVersion": 1,
  "contentVersion": "2026-11-02",
  "marketId": "ro",
  "systemBoundary": [
    "Romania · national power system, one price zone",
    "罗马尼亚 · 国家电力系统，单一价区"
  ],
  "supportedLocales": [
    "en",
    "zh"
  ],
  "playRef": "ro-mer-2h",
  "reviewedAgainst": {
    "playRef": "ro-mer-2h",
    "hours": 2,
    "call": "opportunistic",
    "on": "2026-11-02",
    "commit": "7e00c1a"
  },
  "tokens": [
    "call",
    "playName",
    "cardFigures",
    "nextAction",
    "playEvidence",
    "securedShare",
    "playDuration",
    "bestMerchantDuration",
    "longerMerchantDuration",
    "merchantValueBest",
    "merchantValueLonger",
    "valueIndexPath",
    "curveFirstYear",
    "optimiserFee",
    "grantNote",
    "nextTrigger",
    "fleetCount",
    "fleetCountDate",
    "fleetObservations",
    "fleetYearEndAdditions",
    "plan2030Level",
    "bgFleetEnd2025",
    "auctionThreshold",
    "grantBuildDeadline",
    "grantOperationYears",
    "researchCheckDate",
    "sourceCheckedDate"
  ],
  "claims": {
    "CL-RO-03": {
      "sources": [
        "SRC-RO-08",
        "SRC-RO-09",
        "SRC-RO-10",
        "SRC-RO-11"
      ]
    },
    "CL-RO-04": {
      "sources": [
        "REPO-RO-MODEL"
      ]
    },
    "CL-RO-05": {
      "sources": [
        "SRC-RO-12"
      ]
    },
    "CL-RO-06": {
      "sources": [
        "SRC-RO-13a",
        "SRC-RO-13b"
      ]
    },
    "CL-RO-07": {
      "sources": [
        "SRC-RO-01"
      ]
    },
    "CL-RO-08": {
      "sources": [
        "SRC-RO-03"
      ]
    },
    "CL-RO-09": {
      "sources": [
        "SRC-RO-15"
      ]
    },
    "CL-RO-10": {
      "sources": [
        "REPO-RO-MODEL"
      ]
    },
    "CL-RO-11": {
      "sources": [
        "SRC-RO-01"
      ]
    },
    "CL-RO-12": {
      "sources": [
        "REPO-RO-MODEL"
      ]
    },
    "CL-RO-13": {
      "sources": [
        "REPO-RO-LIVE"
      ]
    },
    "CL-RO-14": {
      "sources": [
        "REPO-RO-MODEL"
      ]
    },
    "CL-RO-15": {
      "sources": [
        "SRC-RO-03"
      ]
    },
    "CL-RO-16": {
      "sources": [
        "SRC-RO-03",
        "SRC-RO-05",
        "SRC-RO-06",
        "SRC-RO-07"
      ]
    },
    "CL-RO-17": {
      "sources": [
        "REPO-RO-MODEL"
      ]
    },
    "CL-RO-18": {
      "sources": [
        "REPO-RO-LIVE",
        "SRC-RO-17"
      ]
    },
    "CL-RO-19": {
      "sources": [
        "SRC-RO-03",
        "SRC-RO-04"
      ]
    }
  },
  "opening": {
    "id": "ro-00",
    "chapter": "opening",
    "scene": "ro-thumbnail",
    "question": [
      "What is the call here, and what must be in hand before entry?",
      "这里的投资判断是什么？进入前必须先拿到什么？"
    ],
    "copy": [
      "{call} · {playName} · {cardFigures} · {nextAction}. The case on the card is merchant: modelled fixed revenue is {securedShare}. A fund buys in only once an optimiser has agreed a minimum-revenue floor, and those terms are not priced here. The story shows why the spread is wide, why Romania's own batteries compress it, why two hours, and why the floor comes first.",
      "{call} · {playName} · {cardFigures} · {nextAction}。卡片上的情景为市场化情景：模型固定收入占比为{securedShare}。只有在优化商同意提供最低收入保底之后，基金才会买入，而这些条款在此尚未定价。本故事说明：价差为何宽，罗马尼亚自身的电池为何压缩价差，为何选择两小时，以及为何必须先谈定保底。"
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
      "CL-RO-04",
      "CL-RO-18"
    ]
  },
  "chapters": [
    {
      "id": "origins",
      "title": [
        "Origins",
        "系统起点"
      ],
      "shots": [
        {
          "id": "ro-01",
          "chapter": "origins",
          "scene": "ro-map",
          "question": [
            "What kind of market does a Romanian battery sell into?",
            "罗马尼亚的电池在什么样的市场中出售电力？"
          ],
          "copy": [
            "Romania's power comes mostly from hydro, nuclear, gas and lignite, with wind and solar a fast-growing share. The whole country is one price zone, coupled with its neighbours' day-ahead markets. Nobody pays for capacity, so a battery earns only what it trades.",
            "罗马尼亚的电力主要来自水电、核电、天然气和褐煤，风电和光伏的占比正快速上升。全国是一个价区，与邻国的日前市场相耦合。这里没有人为容量付费，电池只能靠交易获得收入。"
          ],
          "meaning": [
            "With no capacity payment, this play's revenue is merchant from the first day.",
            "没有容量付费，本方案的收入从投运第一天起就是市场化收入。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a capacity or long-term flexibility mechanism approved for Romania.",
              "罗马尼亚获批容量机制或长期灵活性机制。"
            ]
          },
          "controls": [
            [
              "One price zone",
              "一个价区"
            ],
            [
              "Coupled with neighbours",
              "与邻国耦合"
            ]
          ],
          "claims": [
            "CL-RO-03",
            "CL-RO-04"
          ],
          "labels": {
            "l01": [
              "Romania",
              "罗马尼亚"
            ],
            "l02": [
              "Bulgaria",
              "保加利亚"
            ],
            "l03": [
              "Hungary",
              "匈牙利"
            ],
            "l04": [
              "Danube",
              "多瑙河"
            ],
            "l05": [
              "Carpathians",
              "喀尔巴阡山脉"
            ],
            "l06": [
              "Black Sea",
              "黑海"
            ],
            "l07": [
              "Hydro",
              "水电"
            ],
            "l08": [
              "Nuclear",
              "核电"
            ],
            "l09": [
              "Gas",
              "天然气"
            ],
            "l10": [
              "Lignite",
              "褐煤"
            ],
            "l11": [
              "Wind",
              "风电"
            ],
            "l12": [
              "Solar",
              "光伏"
            ],
            "l13": [
              "Price zone",
              "价区"
            ]
          },
          "caption": [
            "Schematic",
            "示意图"
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
          "id": "ro-02",
          "chapter": "choices",
          "scene": "ro-timeline",
          "question": [
            "Why does a Romanian battery start from a traded price?",
            "为什么罗马尼亚电池的收入从可交易的价格出发？"
          ],
          "copy": [
            "Since 30 June 2005, Romania's exchange has run a day-ahead auction in which buyers and sellers both bid. In November 2014 it was coupled with the Czech, Slovak and Hungarian markets, and in 2021 with the European day-ahead coupling, including the border with Bulgaria. Coupled markets share one price until the interconnector between them is full.",
            "自2005年6月30日起，罗马尼亚电力交易所开始运行买卖双方共同报价的日前竞价市场。2014年11月，该市场与捷克、斯洛伐克和匈牙利市场耦合；2021年又并入欧洲日前耦合，其中包括与保加利亚的边境。相互耦合的市场共享同一价格，直到彼此之间的联络线满载为止。"
          ],
          "meaning": [
            "The battery earns from Romania's own price, which separates from its neighbours' when the wires fill.",
            "电池的收入来自罗马尼亚本国电价；联络线满载时，这一电价就会与邻国电价分离。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a change to Romania's single price zone or to its coupling with neighbouring markets.",
              "罗马尼亚单一价区或其与邻国市场的耦合方式发生变化。"
            ]
          },
          "controls": [
            [
              "Select a node",
              "选择节点"
            ],
            [
              "Event and source",
              "事件与来源"
            ],
            [
              "Why it matters",
              "投资含义"
            ]
          ],
          "claims": [
            "CL-RO-03"
          ],
          "extra": {
            "historyNodes": [
              {
                "id": "N1",
                "constraint": [
                  "The next day's power needed a transparent, traded price.",
                  "次日的电力需要一个透明、可交易的价格。"
                ],
                "choice": [
                  "New rules for the market operator's day-ahead auction, with buyers and sellers both bidding.",
                  "市场运营机构的日前竞价采用新规则，买卖双方共同报价。"
                ],
                "remains": [
                  "A price for every hour of every day.",
                  "每天每小时都有一个价格。"
                ],
                "effect": [
                  "A battery's revenue starts from this price.",
                  "电池的收入从这一价格出发。"
                ]
              },
              {
                "id": "N2",
                "constraint": [
                  "Separate national auctions used cross-border capacity poorly.",
                  "各国分别竞价，跨境容量未能得到有效利用。"
                ],
                "choice": [
                  "One price calculation with the Czech, Slovak and Hungarian markets.",
                  "与捷克、斯洛伐克和匈牙利市场统一计算价格。"
                ],
                "remains": [
                  "Prices converge whenever cross-border capacity allows.",
                  "只要跨境容量允许，价格就会趋于一致。"
                ],
                "effect": [
                  "Neighbouring supply can narrow Romania's spread, up to the border's limit.",
                  "邻国的供给可以收窄罗马尼亚的价差，但以边境容量为限。"
                ]
              },
              {
                "id": "N3",
                "constraint": [
                  "The Romania–Bulgaria border sat outside the common day-ahead calculation.",
                  "罗马尼亚与保加利亚的边境未纳入统一的日前计算。"
                ],
                "choice": [
                  "Romania joins the single day-ahead coupling on 17 June 2021; the Bulgarian border follows on 27 October 2021.",
                  "罗马尼亚于2021年6月17日加入单一日前耦合；与保加利亚的边境于2021年10月27日随后并入。"
                ],
                "remains": [
                  "Prices and cross-border flows are calculated together across the region.",
                  "区域内的价格与跨境潮流同时计算。"
                ],
                "effect": [
                  "Bulgaria's batteries reach Romania only as far as the interconnector allows.",
                  "保加利亚的电池只能在联络线容量范围内影响罗马尼亚。"
                ]
              }
            ],
            "historyHeadings": [
              "30 June 2005 · A two-sided day-ahead auction",
              "November 2014 · Coupled with three neighbours",
              "2021 · Into the European coupling, then the Bulgarian border"
            ]
          }
        },
        {
          "id": "ro-03",
          "chapter": "choices",
          "scene": "ro-rules",
          "question": [
            "What changed for storage, and what did not?",
            "储能的规则改变了什么，又有什么没有变？"
          ],
          "copy": [
            "In July 2025 the regulator stopped charging network tariffs twice on energy that is stored and fed back. Since 2026, grid connections of {auctionThreshold} and more are allocated by auction, against guarantees. An EU-approved scheme now offers grants towards building new stand-alone batteries; the timetable and outcome of its first call remain unverified. None of these pays a battery for what it does.",
            "2025年7月，监管机构不再对储存后回送电网的电量重复收取电网费。自2026年起，{auctionThreshold}及以上的并网容量须通过拍卖分配，并须提交保函。经欧盟批准的计划如今为新建独立电池提供建设补贴，其首轮申报的时间表与结果仍未核实。这些规则都不为电池提供的服务付费。"
          ],
          "meaning": [
            "These rules cut a cost or ration access; the play's revenue still comes from the market.",
            "这些规则降低了成本或限制了准入；本方案的收入仍来自市场。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the regulator's text of any 2026 order on licences or guarantees, read against the auction rules, and the ministry's published grant lists.",
              "监管机构2026年关于许可或保函的法令文本（对照拍卖规则核读），以及能源部公布的补贴名单。"
            ]
          },
          "controls": [
            [
              "Tariffs",
              "电网费"
            ],
            [
              "Connection",
              "并网"
            ],
            [
              "Grant",
              "补贴"
            ],
            [
              "Checked boundary",
              "核查截止线"
            ]
          ],
          "claims": [
            "CL-RO-05",
            "CL-RO-06",
            "CL-RO-16",
            "CL-RO-19"
          ],
          "labels": {
            "l01": [
              "Network tariffs",
              "电网费"
            ],
            "l02": [
              "Connection auction",
              "并网拍卖"
            ],
            "l03": [
              "Guarantees",
              "保函"
            ],
            "l04": [
              "Grant scheme",
              "补贴计划"
            ],
            "l05": [
              "Outcome unverified",
              "结果尚未核实"
            ],
            "l06": [
              "Checked: {researchCheckDate}",
              "核查截至：{researchCheckDate}"
            ]
          },
          "extra": {
            "historyNodes": [
              {
                "id": "N1",
                "constraint": [
                  "Stored energy paid network tariffs when it was taken in and again when it was used.",
                  "储存的电量在充电时缴一次电网费，使用时又缴一次。"
                ],
                "choice": [
                  "Exempt energy stored and fed back from transmission, distribution and system-service tariffs and from green certificates.",
                  "储存后回送电网的电量，免缴输电、配电和系统服务费用，并免于绿证义务。"
                ],
                "remains": [
                  "The battery's own consumption and losses still pay.",
                  "电池自身的用电和损耗仍须缴费。"
                ],
                "effect": [
                  "Each cycle costs less to run.",
                  "每次充放电循环的运行成本降低。"
                ]
              },
              {
                "id": "N2",
                "constraint": [
                  "Requests to connect far exceeded what the grid could take.",
                  "并网申请远超电网的承载能力。"
                ],
                "choice": [
                  "Allocate capacity of {auctionThreshold} and more by annual auction, with participation and connection guarantees.",
                  "{auctionThreshold}及以上的并网容量按年度拍卖分配，并须提交参与保函和并网保函。"
                ],
                "remains": [
                  "Auctions run from 30 October 2026, for capacity that becomes available two years after the auction year.",
                  "拍卖自2026年10月30日起进行，所分配的容量在拍卖年份两年之后才可使用。"
                ],
                "effect": [
                  "New projects wait longer and post more security; an operating battery already holds its connection.",
                  "新项目等待更久、须提交更多担保；在运电池已持有并网权。"
                ]
              },
              {
                "id": "N3",
                "constraint": [
                  "Variable renewables need more storage to join the grid smoothly.",
                  "波动性可再生能源需要更多储能才能顺利并网。"
                ],
                "choice": [
                  "Direct grants for new stand-alone batteries, awarded by tender on aid per MWh, approved by the European Commission on 6 March 2026.",
                  "以直接补贴支持新建独立电池，按每MWh补贴额竞标授予；欧盟委员会于2026年3月6日批准该计划。"
                ],
                "remains": [
                  "The first call's timetable and outcome remain unverified at the latest check.",
                  "截至最近一次核查，首轮申报的时间表与结果仍未核实。"
                ],
                "effect": [
                  "Grant-funded batteries will add to the home fleet; a grant cuts what a battery costs to build, not what it earns.",
                  "获补贴的电池将增加本国储能规模；补贴降低的是电池的建设成本，而非其收入。"
                ]
              }
            ],
            "historyHeadings": [
              "8 July 2025 · Storage stops paying network tariffs twice",
              "2026 · Connection by auction",
              "2026 · Grants for stand-alone batteries (outcome dashed)"
            ]
          }
        }
      ]
    },
    {
      "id": "tensions",
      "title": [
        "Today's tensions",
        "当下矛盾"
      ],
      "shots": [
        {
          "id": "ro-04",
          "chapter": "tensions",
          "scene": "ro-day-shape",
          "question": [
            "Why is the gap between cheap and dear hours so wide?",
            "便宜时段与高价时段之间的差距为何这么大？"
          ],
          "copy": [
            "Solar is being built fast, on rooftops and in large parks, so midday power is cheap. After sunset the solar is gone while demand stays high, so the evening price is set by the scarcer, dearer supply that is left: hydro, gas and imports. A battery buys at midday and sells in the evening.",
            "屋顶光伏和大型光伏电站都在快速建设，因此中午的电价低廉。日落后光伏出力消失，需求却依然很高，傍晚电价便由剩余的、更稀缺也更昂贵的供给决定：水电、天然气和进口电力。电池在中午买电，在傍晚卖电。"
          ],
          "meaning": [
            "The spread carries this play's revenue; it is a price opportunity, not cash.",
            "本方案的收入靠价差支撑；价差是价格机会，并非现金。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "Romanian day-ahead prices recomputed from a publishable primary source, giving the evening-over-midday gap by year.",
              "基于可公开发布的一手来源重新计算罗马尼亚日前电价，按年份给出傍晚与中午之间的价差。"
            ]
          },
          "controls": [
            [
              "Midday",
              "中午"
            ],
            [
              "Evening",
              "傍晚"
            ],
            [
              "Show the spread",
              "显示价差"
            ]
          ],
          "claims": [
            "CL-RO-11"
          ],
          "labels": {
            "l01": [
              "Example",
              "示例"
            ],
            "l02": [
              "Cheap hours",
              "低价时段"
            ],
            "l03": [
              "Dear hours",
              "高价时段"
            ],
            "l04": [
              "Spread",
              "价差"
            ],
            "l05": [
              "Hydro",
              "水电"
            ],
            "l06": [
              "Gas",
              "天然气"
            ],
            "l07": [
              "Imports",
              "进口电力"
            ]
          },
          "caption": [
            "Example: the shape of a day, not observed prices.",
            "示例：一天中的电价形态，并非实际观测价格。"
          ]
        },
        {
          "id": "ro-05",
          "chapter": "tensions",
          "scene": "ro-border",
          "question": [
            "How can neighbouring batteries affect Romania?",
            "邻国电池如何影响罗马尼亚？"
          ],
          "copy": [
            "Coupled markets can transmit part of a neighbouring battery fleet’s effect through cross-border trade. The interconnector limits that effect when it is constrained. This story has not established how often the border binds or how large the price effect is.",
            "耦合市场可以通过跨境交易传递邻国电池的部分影响。联络线拥塞时，传递会受到限制。本故事尚未证实边境有多频繁受到约束，也未证实对价格的影响有多大。"
          ],
          "meaning": [
            "Cross-border competition remains relevant; compare it with domestic additions once publishable price evidence is available.",
            "跨境竞争仍然相关；取得可公开发布的价格证据后，再与本国新增储能的影响比较。"
          ],
          "marker": {
            "level": "thin",
            "change": [
              "the share of hours Romania and Bulgaria clear at the same day-ahead price, recomputed from a publishable primary source.",
              "基于可公开发布的一手来源，重新计算罗马尼亚与保加利亚日前同价出清的小时占比。"
            ]
          },
          "controls": [
            [
              "Midday",
              "中午"
            ],
            [
              "Evening",
              "傍晚"
            ],
            [
              "Border",
              "边境"
            ]
          ],
          "claims": [
            "CL-RO-09",
            "CL-RO-10"
          ],
          "labels": {
            "l01": [
              "Bulgaria's batteries",
              "保加利亚的电池"
            ],
            "l02": [
              "Romania's batteries",
              "罗马尼亚的电池"
            ],
            "l03": [
              "Interconnector",
              "联络线"
            ],
            "l04": [
              "Border full: prices separate",
              "边境满载：价格分离"
            ],
            "l05": [
              "Reported",
              "报道数据"
            ]
          }
        },
        {
          "id": "ro-06",
          "chapter": "tensions",
          "scene": "ro-fleet-chart",
          "question": [
            "What happens to the spread as Romania builds its own batteries?",
            "罗马尼亚自建电池之后，价差会怎样？"
          ],
          "copy": [
            "Romania's battery fleet is growing fast. Transelectrica counted {fleetCount} on {fleetCountDate} and expects about {fleetYearEndAdditions} more by the end of the year, which would pass the national plan's 2030 level. Each battery buys the cheap hours and sells the dear ones, so the spread narrows. The model takes its largest step off the two-hour value before its first operating year, {curveFirstYear}, then smaller steps as the curve flattens.",
            "罗马尼亚的电池规模增长很快。Transelectrica统计{fleetCountDate}为{fleetCount}，并预计年底前再增加约{fleetYearEndAdditions}，届时将超过国家规划的2030年水平。每台电池都在低价时段买电、在高价时段卖电，价差因此收窄。模型在其首个运营年（{curveFirstYear}）之前对两小时价值作出最大的一次下调，此后曲线趋平，下调幅度逐步变小。"
          ],
          "meaning": [
            "Most of the compression is already in the model before its first year; the open question is how far the fleet runs ahead of the model's path.",
            "模型在首个运营年之前已计入大部分价差压缩；尚待回答的是本国储能规模会比模型路径超前多少。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "Transelectrica's counts running ahead of the build the model assumes, or the curve re-fitted on Romania's own prices after the 2027 season.",
              "Transelectrica的统计持续高于模型假设的建设规模，或在2027年运行季之后以罗马尼亚本国电价重新拟合曲线。"
            ]
          },
          "controls": [
            [
              "Fleet",
              "储能规模"
            ],
            [
              "Model path",
              "模型路径"
            ],
            [
              "Show definitions",
              "查看口径"
            ]
          ],
          "claims": [
            "CL-RO-07",
            "CL-RO-08",
            "CL-RO-12"
          ],
          "labels": {
            "l01": [
              "Connected storage, MW (Transelectrica)",
              "已并网储能（MW，Transelectrica）"
            ],
            "l02": [
              "Transelectrica estimate, year-end",
              "Transelectrica年底估计"
            ],
            "l03": [
              "National plan, 2030",
              "国家规划（2030年）"
            ],
            "l04": [
              "Model: two-hour value, as an index of its basis year",
              "模型：两小时价值（以基准年为基数的指数）"
            ],
            "l05": [
              "Model path, not observed",
              "模型路径，非观测值"
            ]
          },
          "caption": [
            "Fleet: Transelectrica, stand-alone and hybrid-plant storage. Index: the platform's model, fitted on Bulgaria's 2026 experience.",
            "储能规模：Transelectrica，含独立储能与混合电站内的储能。指数：本平台模型，依据保加利亚2026年的经验拟合。"
          ]
        },
        {
          "id": "ro-07",
          "chapter": "tensions",
          "scene": "ro-ladder",
          "question": [
            "Can reserve payments carry the case instead?",
            "备用服务收入能否转而支撑这项投资？"
          ],
          "copy": [
            "The model assumes reserve income fades as more batteries compete for a limited procurement volume. That curve was calibrated on Britain, not on a Romanian reserve-price series. Local procurement results are needed to test it.",
            "模型假设，更多电池争夺有限采购量时，备用收入会逐步减少。这条曲线以英国经验标定，并非根据罗马尼亚备用价格序列得出；需要本地采购结果来检验。"
          ],
          "meaning": [
            "Treat fading reserve revenue as a model assumption; trading carries the priced case.",
            "备用收入递减属于模型假设；已定价情景依靠电力交易。"
          ],
          "marker": {
            "level": "thin",
            "change": [
              "Transelectrica's frequency-reserve procurement results for 2025–2026, by product.",
              "Transelectrica按品种公布的2025–2026年频率备用采购结果。"
            ]
          },
          "controls": [
            [
              "Seconds",
              "秒级"
            ],
            [
              "Minutes",
              "分钟级"
            ],
            [
              "Hours",
              "小时级"
            ],
            [
              "More batteries",
              "更多电池"
            ]
          ],
          "claims": [
            "CL-RO-14"
          ],
          "labels": {
            "l01": [
              "Frequency containment",
              "频率遏制"
            ],
            "l02": [
              "Frequency restoration",
              "频率恢复"
            ],
            "l03": [
              "Trading",
              "电力交易"
            ],
            "l04": [
              "Reserve income",
              "备用收入"
            ],
            "l05": [
              "Model assumption",
              "模型假设"
            ]
          }
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
          "id": "ro-08",
          "chapter": "battery",
          "scene": "ro-station",
          "question": [
            "Why {playDuration} hours rather than {longerMerchantDuration}?",
            "为什么是{playDuration}小时，而不是{longerMerchantDuration}小时？"
          ],
          "copy": [
            "On merchant revenue alone, the design grid's best value is at {bestMerchantDuration} hours. A {longerMerchantDuration}-hour battery earns more per MW, but its extra hours sell into a narrower part of the evening, and each costs a full block of storage. On the model's compressing spread, those hours earn less than they cost.",
            "仅按市场化收入测算，设计矩阵的最优价值出现在{bestMerchantDuration}小时。{longerMerchantDuration}小时电池每MW的收入更高，但多出的时长只能卖在傍晚更窄的价差上，而每多一小时都要多建一整组储能。在模型不断收窄的价差下，这些时长赚回的钱低于其成本。"
          ],
          "meaning": [
            "{playDuration} hours is a capital choice, the most value per MW on the model's merchant path; no rule requires it.",
            "{playDuration}小时是资本决策：在模型的市场化路径下每MW价值最高；并没有规则要求这一时长。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a battery cost, duration capture or fleet path that moves the design grid's best cell.",
              "电池成本、时长收益捕获或储能增长路径发生变化，使设计矩阵的最优单元改变。"
            ]
          },
          "controls": [
            [
              "{bestMerchantDuration} h (Example)",
              "{bestMerchantDuration}小时（示例）"
            ],
            [
              "{longerMerchantDuration} h (Example)",
              "{longerMerchantDuration}小时（示例）"
            ],
            [
              "Open the design grid",
              "查看设计矩阵"
            ]
          ],
          "claims": [
            "CL-RO-13"
          ],
          "labels": {
            "l01": [
              "Power block",
              "功率模块"
            ],
            "l02": [
              "Energy block",
              "储能模块"
            ],
            "l03": [
              "Extra hours",
              "新增时长"
            ],
            "l04": [
              "Model value per MW",
              "模型每MW价值"
            ],
            "l05": [
              "Example: 100 MW battery",
              "示例：100MW电池"
            ]
          }
        },
        {
          "id": "ro-09",
          "chapter": "battery",
          "scene": "ro-lanes",
          "question": [
            "Who actually sells the battery's power?",
            "实际上由谁来出售电池的电力？"
          ],
          "copy": [
            "Usually an optimiser. It bids the battery into the day-ahead and intraday markets and into balancing, and takes a fee. The same megawatts cannot be sold twice. The model assumes the battery captures all the day-ahead value it could have scheduled with hindsight, with quarter-hour and intraday trading making up for imperfect forecasts.",
            "通常由优化商负责。它把电池报入日前市场、日内市场和平衡市场，并收取费用。同一份兆瓦不能重复出售。模型假设电池能获得事后看来可安排的全部日前价值，并以一刻钟交易和日内交易弥补预测误差。"
          ],
          "meaning": [
            "The optimiser decides what the battery earns, so its terms matter to a buyer.",
            "电池能赚多少由优化商决定，因此其合同条款对买方至关重要。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "an optimiser's realised monthly book for a Romanian battery, across day-ahead, intraday and balancing.",
              "优化商提供的罗马尼亚电池月度实际收益账簿，涵盖日前、日内和平衡市场。"
            ]
          },
          "controls": [
            [
              "Day-ahead",
              "日前"
            ],
            [
              "Intraday",
              "日内"
            ],
            [
              "Balancing",
              "平衡"
            ],
            [
              "Optimiser fee",
              "优化商费用"
            ]
          ],
          "claims": [
            "CL-RO-15"
          ],
          "labels": {
            "l01": [
              "Shared megawatts",
              "共用兆瓦"
            ],
            "l02": [
              "Already committed",
              "已被占用"
            ],
            "l03": [
              "Fee: {optimiserFee}",
              "费用：{optimiserFee}"
            ],
            "l04": [
              "Model assumption",
              "模型假设"
            ]
          }
        }
      ]
    },
    {
      "id": "payment",
      "title": [
        "Who pays",
        "谁来付钱"
      ],
      "shots": [
        {
          "id": "ro-10",
          "chapter": "payment",
          "scene": "ro-payers",
          "question": [
            "Who pays this battery, and for what?",
            "谁为这台电池付钱？为什么付钱？"
          ],
          "copy": [
            "Buyers on the exchange pay for the energy it sells, and the grid operator pays for reserve it holds ready. Nothing is contracted in advance: modelled fixed revenue is {securedShare}. The state's grant is different: a one-off payment towards building a new battery, won in a tender, and not income. For an operating asset, any grant was spent on its construction.",
            "交易所中的买方为电池售出的电量付费，电网运营商为电池随时待命的备用付费。没有任何收入事先签约：模型固定收入占比为{securedShare}。国家补贴则不同：它是对新建电池的一次性建设资助，须通过竞标获得，并非收入。对在运资产而言，若曾获得补贴，也早已用于建设。"
          ],
          "meaning": [
            "This play's revenue is all market revenue; a grant lowers what a battery costs to build, never what it earns.",
            "本方案的收入全部来自市场；补贴降低的是电池的建设成本，绝不是其收入。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the ministry's published grant lists, or a signed contract that secures part of the revenue.",
              "能源部公布的补贴名单，或已签署并锁定部分收入的合同。"
            ]
          },
          "controls": [
            [
              "Trading",
              "电力交易"
            ],
            [
              "Balancing",
              "平衡服务"
            ],
            [
              "Capital grant",
              "资本补贴"
            ]
          ],
          "claims": [
            "CL-RO-04",
            "CL-RO-15",
            "CL-RO-16",
            "CL-RO-17"
          ],
          "labels": {
            "l01": [
              "Paid by",
              "付费方"
            ],
            "l02": [
              "Unit",
              "计价单位"
            ],
            "l03": [
              "Obligation",
              "义务"
            ],
            "l04": [
              "Evidence",
              "证据"
            ],
            "l05": [
              "Capital, not income",
              "属于资本，并非收入"
            ],
            "l06": [
              "Award unverified",
              "中标结果未核实"
            ],
            "l07": [
              "New-build case: assumes a grant",
              "新建情景：假设获得补贴"
            ],
            "l08": [
              "Operating purchase: no grant",
              "收购在运资产：不含补贴"
            ]
          },
          "extra": {
            "routes": [
              {
                "id": "trading",
                "text": [
                  "Offered → Cleared → Delivered → Settled. Paid by: the exchange's counterparties, per MWh at the cleared price. Obligation: deliver what clears. Evidence: Fair: the price series awaits a publishable source",
                  "报价 → 出清 → 交付 → 结算。付费方：交易所的交易对手，按出清价、每MWh结算。义务：按出清结果交付。证据：证据尚可：价格序列尚待可公开发布的来源"
                ]
              },
              {
                "id": "balancing",
                "text": [
                  "Qualified → Bid → Held ready or activated → Paid. Paid by: the grid operator, per MW held ready and per MWh activated. Obligation: respond when called. Evidence: Thin: results not yet located",
                  "获得资格 → 报价 → 待命或被调用 → 付费。付费方：电网运营商，按每MW待命及每MWh调用电量付费。义务：接到指令即响应。证据：证据单薄：尚未找到采购结果"
                ]
              },
              {
                "id": "grant",
                "text": [
                  "Tender → Provisional ranking → Final list → Contract → Paid against build costs. Paid by: the Ministry of Energy, from the Modernisation Fund, once. Obligation: commission within {grantBuildDeadline} months and operate for at least {grantOperationYears} years. Evidence: Strong for the rules; award unverified",
                  "竞标 → 初步排名 → 最终名单 → 签约 → 按建设成本拨付。付费方：能源部，资金来自现代化基金，一次性拨付。义务：在{grantBuildDeadline}个月内投运，并至少运营{grantOperationYears}年。证据：证据充分（规则）；中标结果尚未核实"
                ]
              }
            ]
          }
        },
        {
          "id": "ro-11",
          "chapter": "payment",
          "scene": "ro-floor",
          "question": [
            "If nothing is secured, why would a fund buy in?",
            "如果没有任何锁定收入，基金为何还会买入？"
          ],
          "copy": [
            "Only with a floor. An optimiser can agree to pay the owner a minimum each year and share what the battery earns above it; such a floor has been announced in Romania, with its level undisclosed. The fund enters only once a seller can show those terms: the payment, how long it lasts, indexation, the share above the floor, fees, availability conditions and who stands behind it. Until then the price paid rests on merchant revenue alone.",
            "只有在有保底的情况下才会。优化商可以同意每年向业主支付一个最低金额，并分享电池在此之上的收益；罗马尼亚已公布过此类保底，但未披露金额。只有当卖方能拿出以下条款时，基金才会进入：付费金额、期限、指数化、保底以上的分成、费用、可用率条件以及担保方。在此之前，收购价只能以市场化收入为依据。"
          ],
          "meaning": [
            "The floor is a condition of entry and a diligence gate, not part of the price.",
            "保底是进入条件和尽职调查关口，而非定价的一部分。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a floor term sheet, with credit support, that passes the platform's floor check.",
              "附带信用支持并通过本平台保底核查的保底条款清单。"
            ]
          },
          "controls": [
            [
              "The priced case",
              "已定价情景"
            ],
            [
              "The floor checklist",
              "保底核查清单"
            ]
          ],
          "claims": [
            "CL-RO-18"
          ],
          "labels": {
            "l01": [
              "Merchant case (priced)",
              "市场化情景（已定价）"
            ],
            "l02": [
              "Floor: condition of entry, not priced",
              "保底：进入条件，未定价"
            ],
            "l03": [
              "Announced in this market: a floor, level not disclosed",
              "本市场已公布：保底，金额未披露"
            ],
            "l04": [
              "Payment",
              "付费"
            ],
            "l05": [
              "Tenor",
              "期限"
            ],
            "l06": [
              "Indexation",
              "指数化"
            ],
            "l07": [
              "Share above the floor",
              "保底以上分成"
            ],
            "l08": [
              "Fees",
              "费用"
            ],
            "l09": [
              "Availability",
              "可用率"
            ],
            "l10": [
              "Credit support",
              "信用支持"
            ]
          }
        }
      ]
    },
    {
      "id": "investment",
      "title": [
        "The investment",
        "回到投资"
      ],
      "shots": [
        {
          "id": "ro-12",
          "chapter": "investment",
          "scene": "ro-factors",
          "question": [
            "What would make this play less attractive?",
            "什么会让本方案失去吸引力？"
          ],
          "copy": [
            "Romania's own build running ahead of the model's path; reserves fading faster; a floor that is short, low or not on offer; a new order on connections or guarantees; and grant-funded batteries joining the fleet. The grant call's timetable and outcome remain unverified at the latest check. Next: {nextTrigger}, then {nextAction}.",
            "罗马尼亚自身的建设快于模型路径；备用收入消退更快；保底期限短、金额低或根本无法取得；出台新的并网或保函法令；以及获补贴的电池加入储能队伍。补贴申报结果尚未核实。下一步：{nextTrigger}，然后是{nextAction}。"
          ],
          "meaning": [
            "The entry price must work on merchant revenue alone, with the floor's terms in hand before signing.",
            "进入价格必须在仅有市场化收入时也能成立，并须在签约前取得保底条款。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the ministry's published grant lists, Transelectrica's fleet counts set against the model's path, or a priced floor.",
              "能源部公布的补贴名单、Transelectrica储能统计与模型路径的对比，或已定价的保底。"
            ]
          },
          "controls": [
            [
              "Home fleet",
              "本国储能"
            ],
            [
              "Reserves",
              "备用收入"
            ],
            [
              "Floor",
              "保底"
            ],
            [
              "Connection rules",
              "并网规则"
            ],
            [
              "Grant-funded fleet",
              "获补贴储能"
            ],
            [
              "Bankable case",
              "可融资方案"
            ],
            [
              "Revenue",
              "收益拆解"
            ],
            [
              "Execution",
              "执行步骤"
            ],
            [
              "Downside",
              "下行风险"
            ]
          ],
          "claims": [
            "CL-RO-06",
            "CL-RO-07",
            "CL-RO-12",
            "CL-RO-14",
            "CL-RO-16",
            "CL-RO-18",
            "CL-RO-19"
          ],
          "extra": {
            "factors": [
              {
                "affects": [
                  "Narrows the spread; see Revenue and Downside",
                  "收窄价差；见收益拆解与下行风险"
                ]
              },
              {
                "affects": [
                  "Shrinks the early top-up; see Revenue",
                  "缩减早期补充收入；见收益拆解"
                ]
              },
              {
                "affects": [
                  "Decides whether a fund can enter; see the Bankable case",
                  "决定基金能否进入；见可融资方案"
                ]
              },
              {
                "affects": [
                  "Changes cost and timing for new projects; see Execution",
                  "改变新项目的成本与时间；见执行步骤"
                ]
              },
              {
                "affects": [
                  "Adds subsidised competition; see Downside",
                  "增加获补贴的竞争；见下行风险"
                ]
              }
            ],
            "exits": [
              {
                "anchor": "bankable",
                "label": [
                  "Bankable case",
                  "可融资方案"
                ]
              },
              {
                "anchor": "revenue",
                "label": [
                  "Revenue",
                  "收益拆解"
                ]
              },
              {
                "anchor": "execution",
                "label": [
                  "Execution",
                  "执行步骤"
                ]
              },
              {
                "anchor": "downside",
                "label": [
                  "Downside",
                  "下行风险"
                ]
              }
            ]
          }
        }
      ]
    }
  ],
  "text": {
    "Tags": [
      "Example · Schematic · Model assumption · Model path, not observed",
      "示例 · 示意图 · 模型假设 · 模型路径，非观测值"
    ],
    "History legend": [
      "Observed event · Official plan · Estimate · Checked: {researchCheckDate}",
      "已发生事件 · 官方规划 · 估计值 · 核查截至：{researchCheckDate}"
    ],
    "Evidence drawer": [
      "Source · Locator · Checked on {sourceCheckedDate} · Definition",
      "来源 · 具体位置 · 核查时间：{sourceCheckedDate} · 统计口径"
    ],
    "Withheld observation": [
      "Observed prices await a publishable source; showing an Example",
      "实际价格尚待可公开发布的来源；当前展示示例"
    ],
    "Missing financial binding": [
      "Current case unavailable; review the market case",
      "当前情景暂不可用；请查看市场方案"
    ],
    "Reduced motion": [
      "You can read the full story without motion",
      "无需动画也可阅读完整内容"
    ],
    "Chart reading": [
      "Solid: dated observations · Dashed: a plan, an estimate or the model · No shared ordinate",
      "实线：有日期的观测 · 虚线：规划、估计或模型 · 两个面板不共用纵轴"
    ]
  }
};
