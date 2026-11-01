/* Italy: twelve G-1 shots copied from the signed-off bilingual tables. */
export const story = {
  "storySchemaVersion": 1,
  "contentVersion": "2026-11-01",
  "marketId": "it",
  "systemBoundary": [
    "Italy · physical day-ahead zones; procurement groups differ",
    "意大利 · 实体日前价格区；采购区域分组不同"
  ],
  "supportedLocales": [
    "en",
    "zh"
  ],
  "playRef": "it-cap-4h",
  "reviewedAgainst": {
    "playRef": "it-cap-4h",
    "hours": 4,
    "call": "enter-now",
    "lens": "infraFund",
    "on": "2026-11-01",
    "commit": "7effd37"
  },
  "alternatives": [
    {
      "playRef": "it-ltda-6h",
      "hours": 6,
      "call": "opportunistic",
      "lens": "infraFund"
    }
  ],
  "tokens": [
    "call",
    "playName",
    "cardFigures",
    "nextAction",
    "zoneList",
    "cMNewbuildTerm",
    "mACSEAuction1Date",
    "mACSETerm",
    "mACSEAreas",
    "dY2027Derating",
    "dY2028DecisionDate",
    "dY2028DeratingByZone",
    "playDuration",
    "mACSEAwardedHours",
    "mACSEAuction2Date",
    "cMDY2028AuctionDate",
    "securedShare",
    "securedTenor",
    "merchantShare",
    "capacityDesignHold",
    "mACSEDesignHold",
    "mACSESecuredShare",
    "mACSENextAction",
    "sourceCheckedDate",
    "historyNode"
  ],
  "sources": {
    "SRC-IT-05": {
      "title": "ARERA · Deliberazione 103/2019/R/eel, 19 Mar 2019",
      "url": "https://www.arera.it/allegati/docs/19/103-19.pdf",
      "locator": "https://www.arera.it/allegati/docs/19/103-19.pdf, Delibera points 1–2",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-06": {
      "title": "GME · MGP results by zone",
      "url": "https://www.mercatoelettrico.org/en/",
      "locator": "https://www.mercatoelettrico.org/en/ (repository record `gme`)",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-07": {
      "title": "MASE · Decree 259 of 6 Aug 2026, capacity-market rules for delivery 2028",
      "url": "https://www.mase.gov.it/portale/mercato-elettrico",
      "locator": "https://www.mase.gov.it/portale/mercato-elettrico (listed); summarised in SRC-IT-09, \"Considerato, in aggiunta\"",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-08": {
      "title": "MASE · Decree 327 of 16 Oct 2026 approving DTF 2 and Annex 4 for delivery 2028",
      "url": "https://www.mase.gov.it/portale/documents/d/guest/dm_327_16-10-2026-pdf",
      "locator": "https://www.mase.gov.it/portale/documents/d/guest/dm_327_16-10-2026-pdf (Art. 1); Annex 4: https://www.mase.gov.it/portale/documents/d/guest/all_4_dtf_2-pdf, §8.3 and Table 11, p. 33",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-09": {
      "title": "ARERA · Deliberazione 370/2026/R/eel, 14 Oct 2026",
      "url": "https://www.arera.it/fileadmin/allegati/docs/26/370-2026-R-eel.pdf",
      "locator": "https://www.arera.it/fileadmin/allegati/docs/26/370-2026-R-eel.pdf, pp. 9–11 and Delibera point 1",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-10": {
      "title": "Terna · Delivery-2028 auction notice",
      "url": "https://www.terna.it/it/sistema-elettrico/mercato-capacita",
      "locator": "Expected under https://www.terna.it/it/sistema-elettrico/mercato-capacita",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-11": {
      "title": "Terna · Rendiconto degli esiti, Asta Madre 2027",
      "url": "https://download.terna.it/terna/Rendiconto-Esiti-Asta-Madre_2027_8dd97982c75d724.pdf",
      "locator": "https://download.terna.it/terna/Rendiconto-Esiti-Asta-Madre_2027_8dd97982c75d724.pdf, Executive Summary p. 3 and \"Capacità Nuova Assegnata\" p. 8",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-12": {
      "title": "Terna · Capacity-market discipline (decree of 28 Jun 2019) and first auctions, delivery 2022 and 2023",
      "url": "https://download.terna.it/terna/2019_12_06_Rendiconto%20EsitiAsta%202022_PUBBLICATO_8d7c06cc9f8470b.pdf",
      "locator": "Results report: https://download.terna.it/terna/2019_12_06_Rendiconto%20EsitiAsta%202022_PUBBLICATO_8d7c06cc9f8470b.pdf",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-13": {
      "title": "Legislative Decree 210/2021, Art. 18",
      "url": "https://www.normattiva.it/",
      "locator": "https://www.normattiva.it/ (decreto legislativo 8 novembre 2021, n. 210)",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-14": {
      "title": "ARERA · Deliberazione 247/2023/R/eel, 6 Jun 2023, and Annex A (updated)",
      "url": "https://www.arera.it/fileadmin/allegati/docs/23/247-23-reel-allegato-a-aggiornato.pdf",
      "locator": "https://www.arera.it/fileadmin/allegati/docs/23/247-23-reel-allegato-a-aggiornato.pdf, Arts. 6.3, 6.6, 11–13",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-15": {
      "title": "MASE · Decree 346 of 10 Oct 2024 approving the MACSE rules",
      "url": "https://mase.gov.it/sites/default/files/Archivio_Energia/Archivio_Normativa/dm_346_10.10.2024.pdf",
      "locator": "https://mase.gov.it/sites/default/files/Archivio_Energia/Archivio_Normativa/dm_346_10.10.2024.pdf (repository record `dm346`)",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-16": {
      "title": "Terna · \"Terna completes first MACSE auction: 10 GWh of energy storage capacity awarded\"",
      "url": "https://www.terna.it/en/media/press-releases/detail/completed-first-macse-auction",
      "locator": "https://www.terna.it/en/media/press-releases/detail/completed-first-macse-auction",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-17": {
      "title": "ARERA · Deliberazione 362/2025/R/eel, 30 Jul 2025",
      "url": "https://arera.it/atti-e-provvedimenti/dettaglio/25/362-25",
      "locator": "https://arera.it/atti-e-provvedimenti/dettaglio/25/362-25",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-18": {
      "title": "ARERA · Consultation 283/2026/R/eel, 30 Jul 2026",
      "url": "https://www.arera.it/fileadmin/allegati/docs/26/283-2026-R-eel.pdf",
      "locator": "https://www.arera.it/fileadmin/allegati/docs/26/283-2026-R-eel.pdf (repository record `arera283`)",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-19": {
      "title": "ARERA · Deliberazione 332/2026/R/eel, 24 Sep 2026",
      "url": "https://www.arera.it/fileadmin/allegati/docs/26/332-2026-R-eel.pdf",
      "locator": "https://www.arera.it/fileadmin/allegati/docs/26/332-2026-R-eel.pdf, pp. 4–5 and Delibera point 1",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-20": {
      "title": "MASE · Decree of 27 Mar 2026 (MACSE rules for the second battery auction) and Decree 162 of 20 May 2026 (16 GWh requirement for 2029)",
      "url": "https://www.mase.gov.it/portale/mercato-elettrico",
      "locator": "https://www.mase.gov.it/portale/mercato-elettrico (listing); both recited in SRC-IT-19, p. 4",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-21": {
      "title": "Terna · Development Plan 2025, public-consultation presentation (hosted by ARERA)",
      "url": "https://www.arera.it/fileadmin/allegati/operatori/pds/25/Presentazione_della_consultazione_pubblica_sul_Piano_di_sviluppo_2025.pdf",
      "locator": "https://www.arera.it/fileadmin/allegati/operatori/pds/25/Presentazione_della_consultazione_pubblica_sul_Piano_di_sviluppo_2025.pdf, slide \"Richieste di Connessione: FER\"",
      "checkedOn": "2026-10-31"
    },
    "SRC-IT-22": {
      "title": "Terna · Tyrrhenian Link and Adriatic Link project pages",
      "url": "https://github.com/jerryyuan1996/BESS-research-platform",
      "locator": "Repository records `tyrrhenian`, `adriatic`",
      "checkedOn": "2026-10-31"
    },
    "REPO-IT-LIVE": {
      "title": "Live Italy view and briefing",
      "url": "https://github.com/jerryyuan1996/BESS-research-platform/blob/main/view/markets/it.json",
      "locator": "Live infraFund rows and separate design-grid play economics; rechecked at 7effd37",
      "checkedOn": "2026-11-01"
    }
  },
  "claims": {
    "CL-IT-02": {
      "sources": [
        "SRC-IT-11",
        "SRC-IT-12"
      ]
    },
    "CL-IT-03": {
      "sources": [
        "SRC-IT-14",
        "SRC-IT-16"
      ]
    },
    "CL-IT-04": {
      "sources": [
        "SRC-IT-05",
        "SRC-IT-06"
      ]
    },
    "CL-IT-05": {
      "sources": [
        "SRC-IT-07",
        "SRC-IT-09",
        "SRC-IT-12"
      ]
    },
    "CL-IT-06": {
      "sources": [
        "SRC-IT-11"
      ]
    },
    "CL-IT-07": {
      "sources": [
        "SRC-IT-13",
        "SRC-IT-14",
        "SRC-IT-15",
        "SRC-IT-16"
      ]
    },
    "CL-IT-08": {
      "sources": [
        "SRC-IT-14"
      ]
    },
    "CL-IT-09": {
      "sources": [
        "SRC-IT-21"
      ]
    },
    "CL-IT-10": {
      "sources": [
        "SRC-IT-08",
        "SRC-IT-09"
      ]
    },
    "CL-IT-10i": {
      "sources": [
        "SRC-IT-08",
        "REPO-IT-LIVE"
      ]
    },
    "CL-IT-11": {
      "sources": [
        "SRC-IT-19",
        "SRC-IT-20"
      ]
    },
    "CL-IT-12": {
      "sources": [
        "SRC-IT-10"
      ]
    },
    "CL-IT-13": {
      "sources": [
        "REPO-IT-LIVE"
      ]
    },
    "CL-IT-14": {
      "sources": [
        "REPO-IT-LIVE"
      ]
    }
  },
  "opening": {
    "id": "it-00",
    "chapter": "opening",
    "title": [
      "The call",
      "先看投资判断"
    ],
    "question": [
      "What is the call here, and what is the alternative?",
      "这里的投资判断是什么？备选路径又是什么？"
    ],
    "copy": [
      "{call} · {playName} · {cardFigures} · {nextAction}. Screen only ready-to-build assets with an earlier awarded capacity contract and verified terms. New storage needs its decided zonal credit and a separately established auction price. MACSE remains a separate calculation pending compatibility checks.",
      "{call} · {playName} · {cardFigures} · {nextAction}。仅筛选已持有早先容量授标合同、条款已核实的具备开工条件资产。新储能须采用已确定的分区计入比例，并另行取得拍卖价格。合同兼容性核实前，MACSE仍单独测算。"
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
    "labels": {},
    "claims": [
      "CL-IT-13"
    ],
    "scene": "it-00",
    "extra": {}
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
          "id": "it-01",
          "chapter": "origins",
          "title": [
            "One country, several prices",
            "一个国家，多个价格"
          ],
          "question": [
            "Why is one country priced in several places?",
            "为什么一个国家要分区定价？"
          ],
          "copy": [
            "Italy is long and narrow, with two large islands. Power moves along a few corridors, so the day-ahead market clears a separate price for each zone ({zoneList}) within the limits between them. Where a battery sits decides which price it trades.",
            "意大利国土狭长，另有两大岛屿。电力只能沿少数通道输送，因此日前市场在区间输电限额内按区域分别出清价格（{zoneList}）。电池建在哪里，就交易哪个区域的价格。"
          ],
          "meaning": [
            "This play earns its trading margin at its own zone's price, so the zone is the first thing to check.",
            "本方案的交易收益按所在区域的价格实现，因此所属区域是首要核查项。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a new zone review by ARERA and Terna that changes the zones.",
              "ARERA与Terna开展新一轮分区评估并调整价格区。"
            ]
          },
          "controls": [
            [
              "Zones",
              "价格区"
            ],
            [
              "Corridors",
              "输电通道"
            ]
          ],
          "labels": {
            "label0": [
              "Day-ahead price zone",
              "日前价格区"
            ],
            "label1": [
              "Transfer limit between zones",
              "区间输电限额"
            ],
            "label2": [
              "Approximate boundaries",
              "边界为示意"
            ]
          },
          "claims": [
            "CL-IT-04"
          ],
          "scene": "it-01",
          "extra": {}
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
          "id": "it-02",
          "chapter": "choices",
          "title": [
            "Paying for capacity that will be there",
            "为“到时可用”的容量付费"
          ],
          "question": [
            "What does Italy's capacity market buy?",
            "意大利的容量市场买的是什么？"
          ],
          "copy": [
            "Terna auctions, years ahead, capacity that must be available when the system is tight. A winner earns an annual premium for each credited MW and pays back the difference when market prices rise above a strike price. New plant can hold the contract for {cMNewbuildTerm} years, and the trading margin stays with the owner. In the delivery-2027 auction, batteries won most of the new capacity.",
            "Terna提前数年拍卖系统紧张时必须可用的容量。中标者按每个计入的MW获得年度溢价；市场价格高于执行价时，须返还差额。新建机组的合同期可达{cMNewbuildTerm}年，交易收益仍归业主。在2027交付年度的拍卖中，新增容量大部分由电池获得。"
          ],
          "meaning": [
            "The capacity contract secures a premium on credited MW and leaves the battery free to trade; this play is built on that pairing.",
            "容量合同对计入的MW锁定溢价，同时让电池保留交易自由；本方案正是建立在这一组合之上。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the auction rules for delivery 2028 opened, with the strike-price, availability and contract-term clauses extracted.",
              "打开2028交付年度拍卖规则，提取执行价、可用性及合同期限条款。"
            ]
          },
          "controls": [
            [
              "Premium",
              "溢价"
            ],
            [
              "Strike-price repayment",
              "执行价返还"
            ],
            [
              "Open timeline",
              "查看时间线"
            ]
          ],
          "labels": {
            "label0": [
              "Annual premium per credited MW",
              "按计入MW支付的年度溢价"
            ],
            "label1": [
              "Pay back when prices exceed the strike",
              "价格高于执行价时返还差额"
            ],
            "label2": [
              "Trading margin stays with the owner",
              "交易收益归业主"
            ]
          },
          "claims": [
            "CL-IT-02",
            "CL-IT-05",
            "CL-IT-06"
          ],
          "scene": "it-02",
          "extra": {}
        },
        {
          "id": "it-03",
          "chapter": "choices",
          "title": [
            "A second contract, only for storage",
            "第二种合同，只为储能而设"
          ],
          "question": [
            "Why did Italy create a second storage contract?",
            "意大利为何另设一种储能合同？"
          ],
          "copy": [
            "The capacity market pays for being available at tight moments, not for moving midday power into the evening. A 2021 decree called for storage bought centrally; ARERA set the criteria, the ministry approved Terna's rules, and the first MACSE auction on {mACSEAuction1Date} awarded {mACSETerm}-year contracts in {mACSEAreas}. None went to the north.",
            "容量市场为紧张时段的可用性付费，而不是为把午间电力挪到傍晚付费。2021年的一项法令要求集中采购储能；ARERA制定标准，主管部门批准Terna的规则；{mACSEAuction1Date}举行的首轮MACSE拍卖在{mACSEAreas}授予了期限为{mACSETerm}年的合同，北部没有获配。"
          ],
          "meaning": [
            "MACSE is a separate route with its own payer and obligations; this play holds a capacity contract, not a MACSE one.",
            "MACSE是另一条路径，付款方与义务各不相同；本方案持有的是容量合同，而非MACSE合同。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "Terna's results notice and the MACSE rules opened, confirming the areas, the term and the energy rights.",
              "打开Terna结果公告与MACSE规则，核实区域、期限及电量权利。"
            ]
          },
          "controls": [
            [
              "Open timeline",
              "查看时间线"
            ],
            [
              "Areas",
              "区域"
            ],
            [
              "Why it matters",
              "投资含义"
            ]
          ],
          "labels": {
            "label0": [
              "Law",
              "法令"
            ],
            "label1": [
              "Regulator's criteria",
              "监管标准"
            ],
            "label2": [
              "Approved rules",
              "规则获批"
            ],
            "label3": [
              "First auction",
              "首轮拍卖"
            ],
            "label4": [
              "Areas with a requirement",
              "设有需求的区域"
            ]
          },
          "claims": [
            "CL-IT-03",
            "CL-IT-07"
          ],
          "scene": "it-03",
          "extra": {}
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
          "id": "it-04",
          "chapter": "tensions",
          "title": [
            "Sun and queues in the south, demand in the north",
            "南部阳光与排队，北部用电"
          ],
          "question": [
            "Where is the tension today?",
            "今天的矛盾在哪里？"
          ],
          "copy": [
            "Most new solar and wind, and most battery connection requests, sit in the south and on the islands; much of the demand is in the north. At midday the southern zones can make more power than the corridors north can carry, so their prices fall. Terna plans new links; until they run, zone prices keep diverging.",
            "新增光伏、风电以及大部分储能并网申请集中在南部和岛屿，而大量用电需求在北部。午间，南部区域的发电可能超出北送通道的输送能力，当地价格随之走低。Terna规划了新的输电工程；在其投运之前，各区域价格仍会分化。"
          ],
          "meaning": [
            "A southern battery can buy cheap midday power and sell in the evening, and so can the many batteries queued beside it.",
            "南部电池可以在午间低价充电、傍晚放电；排在它旁边的大量电池同样可以。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "Terna's connection-request data by region and the current development plan's dated links.",
              "Terna按区域公布的并网申请数据，以及现行电网发展规划中注明日期的输电工程。"
            ]
          },
          "controls": [
            [
              "Midday",
              "午间"
            ],
            [
              "Evening",
              "傍晚"
            ],
            [
              "Planned links",
              "规划线路"
            ]
          ],
          "labels": {
            "label0": [
              "Connection requests (stacked symbols, not to scale)",
              "并网申请（堆叠符号，不按比例）"
            ],
            "label1": [
              "Planned link, not yet built",
              "规划线路，尚未建成"
            ]
          },
          "claims": [
            "CL-IT-09"
          ],
          "scene": "it-04",
          "extra": {}
        },
        {
          "id": "it-05",
          "chapter": "tensions",
          "title": [
            "How much of a battery the capacity market counts",
            "容量市场把电池算作多少"
          ],
          "question": [
            "How much of a four-hour battery does the capacity market count?",
            "容量市场把四小时电池算作多少容量？"
          ],
          "copy": [
            "Terna credits a battery only for the share of its power it can hold through the hours of stress. In the delivery-2027 auction a four-hour battery counted for {dY2027Derating} of its power in every zone. On {dY2028DecisionDate} the ministry approved factors for delivery 2028 that differ by zone, {dY2028DeratingByZone}, for new storage only. Contracts already awarded keep their factor.",
            "Terna只按电池能在系统紧张时段持续提供的功率比例计入容量。在2027交付年度拍卖中，四小时电池在各区域均按其功率的{dY2027Derating}计入。{dY2028DecisionDate}，主管部门批准了2028交付年度按区域区分的系数（{dY2028DeratingByZone}），仅适用于新增储能；已授予的合同保留原有系数。"
          ],
          "meaning": [
            "The capacity line now depends on the project's zone and on whether it already holds a contract; the play must be priced at the factor that applies to it.",
            "容量收入现在取决于项目所在区域，以及项目是否已持有合同；本方案须按适用于自身的系数定价。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a further decree or Terna recalculation before the delivery-2028 auction.",
              "2028交付年度拍卖前，主管部门再次发布部令或Terna重新测算系数。"
            ]
          },
          "controls": [
            [
              "Delivery 2027",
              "2027交付年度"
            ],
            [
              "Delivery 2028",
              "2028交付年度"
            ],
            [
              "By zone",
              "按区域"
            ],
            [
              "Contracts already awarded",
              "已授予合同"
            ]
          ],
          "labels": {
            "label0": [
              "Credited share of nameplate power",
              "计入容量占铭牌功率比例"
            ],
            "label1": [
              "Delivery 2027, all zones",
              "2027交付年度，全国统一"
            ],
            "label2": [
              "Delivery 2028, new storage",
              "2028交付年度，新增储能"
            ],
            "label3": [
              "Decided {dY2028DecisionDate}",
              "{dY2028DecisionDate}确定"
            ]
          },
          "claims": [
            "CL-IT-10",
            "CL-IT-10i"
          ],
          "scene": "it-05",
          "extra": {}
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
          "id": "it-06",
          "chapter": "battery",
          "title": [
            "Why four hours for the capacity route",
            "容量路径为何选四小时"
          ],
          "question": [
            "Why does this play build {playDuration} hours?",
            "本方案为何选择{playDuration}小时？"
          ],
          "copy": [
            "A longer battery receives more capacity credit, but needs more capital. The current design test uses legacy contract-vintage assumptions. Check the asset’s actual awarded price, factor and delivery obligations before applying it; the decided new-storage factors require a separate zonal case.",
            "更长时长可以获得更多计入容量，但也需要更多资本。当前设计测试采用旧合同批次的假设。使用前须核对资产实际中标价格、计入比例与交付义务；已确定的新储能系数需要另建分区测算情景。"
          ],
          "meaning": [
            "A legacy award and a new entrant have different rights; the old design result does not establish the best new-entry duration.",
            "旧批次中标资产与新进入者享有不同权利；旧设计结果不能证明新进入者的最优时长。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the design test re-run at the decided delivery-2028 factors, or a different cost per MWh.",
              "按已确定的2028交付年度系数重新进行时长测试，或每MWh成本发生变化。"
            ]
          },
          "controls": [
            [
              "Current play",
              "当前方案"
            ],
            [
              "Teaching battery: two, six, eight hours",
              "示例电池：二、六、八小时"
            ],
            [
              "Open duration evidence",
              "查看时长依据"
            ]
          ],
          "labels": {
            "label0": [
              "More hours, more of the power credited",
              "时长越长，计入的功率越多"
            ],
            "label1": [
              "More hours, more capital",
              "时长越长，资本投入越多"
            ],
            "label2": [
              "Thinner trading margin per MWh",
              "每MWh交易收益摊薄"
            ],
            "label3": [
              "Example",
              "示例"
            ]
          },
          "claims": [
            "CL-IT-13"
          ],
          "scene": "it-06",
          "extra": {}
        },
        {
          "id": "it-07",
          "chapter": "battery",
          "title": [
            "Why MACSE winners build long",
            "MACSE中标者为何建长时电池"
          ],
          "question": [
            "Why did MACSE winners build longer batteries?",
            "MACSE中标者为何建造更长时的电池？"
          ],
          "copy": [
            "MACSE pays per MWh of storage a year, so each extra hour adds contracted income. The first auction's winners averaged {mACSEAwardedHours} hours. Whether that pays depends on what the extra hours cost: the price of a marginal MWh added to a shared power block.",
            "MACSE按每年每MWh储能付费，因此每多一小时都会增加合同收入。首轮中标项目平均时长为{mACSEAwardedHours}小时。这是否划算，取决于额外时长的成本，即在共享功率模块上增加一个边际MWh的价格。"
          ],
          "meaning": [
            "The MACSE route's return turns on the cost of the marginal MWh, which the published turnkey price does not show.",
            "MACSE路径的回报取决于边际MWh成本，而公开的交钥匙价格无法反映这一成本。"
          ],
          "marker": {
            "level": "thin",
            "change": [
              "an EPC price for a marginal MWh on a shared power block, obtained before {mACSEAuction2Date}.",
              "在{mACSEAuction2Date}之前，取得共享功率模块上边际MWh的EPC报价。"
            ]
          },
          "controls": [
            [
              "Four hours",
              "四小时"
            ],
            [
              "Six hours",
              "六小时"
            ],
            [
              "Eight hours (Example)",
              "八小时（示例）"
            ],
            [
              "Open first-auction results",
              "查看首轮拍卖结果"
            ]
          ],
          "labels": {
            "label0": [
              "Paid per MWh of storage",
              "按每MWh储能付费"
            ],
            "label1": [
              "First-auction average: {mACSEAwardedHours} h",
              "首轮中标平均：{mACSEAwardedHours}小时"
            ],
            "label2": [
              "Cost of the next MWh?",
              "下一MWh的成本是多少？"
            ],
            "label3": [
              "Example",
              "示例"
            ]
          },
          "claims": [
            "CL-IT-07",
            "CL-IT-13"
          ],
          "scene": "it-07",
          "extra": {}
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
          "id": "it-08",
          "chapter": "payment",
          "title": [
            "Two contracts for one battery",
            "一台电池，两种合同（signature chart / 核心图表）"
          ],
          "question": [
            "Who pays, and what does the owner give up?",
            "谁来付钱？业主让出了什么？"
          ],
          "copy": [
            "In the capacity market, Terna pays a premium for each credited MW, and the owner keeps the trading margin with its risk. Under MACSE, Terna pays a fixed premium for each MWh of storage, and the time-shifting use of the contracted energy passes to Terna, which offers it to the market. The chart shows what each contract pays one nameplate MW, from published auction results.",
            "在容量市场中，Terna为每个计入的MW支付溢价，交易收益及其风险仍归业主。在MACSE下，Terna为每MWh储能支付固定溢价，已签约电量的时移使用权转交Terna，由其向市场提供。图表依据已公布的拍卖结果，显示每种合同为一个铭牌MW支付多少。"
          ],
          "meaning": [
            "The capacity route secures less and keeps the trading upside; MACSE secures more and hands that upside over.",
            "容量路径锁定的收入较少，但保留交易上行空间；MACSE锁定更多收入，却让出了这部分空间。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the chart's record completed from Terna's MACSE results report and the MACSE rules' margin-sharing percentage.",
              "依据Terna的MACSE结果报告及MACSE规则中的收益分成比例，补全图表记录。"
            ]
          },
          "controls": [
            [
              "Capacity market",
              "容量市场"
            ],
            [
              "MACSE",
              "MACSE"
            ],
            [
              "Zone",
              "区域"
            ],
            [
              "How measured",
              "计算方法"
            ]
          ],
          "labels": {
            "label0": [
              "Credited share of nameplate power",
              "计入容量占铭牌功率比例"
            ],
            "label1": [
              "Contracted payment",
              "合同付款"
            ],
            "label2": [
              "EUR per nameplate MW per year",
              "欧元／铭牌MW／年"
            ],
            "label3": [
              "Delivery 2027 contract",
              "2027交付年度合同"
            ],
            "label4": [
              "First MACSE auction, by area",
              "首轮MACSE拍卖（按区域）"
            ],
            "label5": [
              "Owner keeps the trading margin",
              "交易收益归业主"
            ],
            "label6": [
              "Time-shifting use passes to Terna",
              "时移使用权转交Terna"
            ],
            "label7": [
              "Never added together",
              "二者绝不相加"
            ],
            "label8": [
              "Set at the auction on {cMDY2028AuctionDate}",
              "于{cMDY2028AuctionDate}拍卖确定"
            ]
          },
          "claims": [
            "CL-IT-05",
            "CL-IT-06",
            "CL-IT-07",
            "CL-IT-08"
          ],
          "scene": "it-08",
          "caption": [
            "Example: two contract shapes",
            "示例：两种合同形态"
          ],
          "extra": {}
        },
        {
          "id": "it-09",
          "chapter": "payment",
          "title": [
            "What the capacity contract secures, and until when",
            "容量合同锁定什么，锁定到何时"
          ],
          "question": [
            "What does the capacity contract secure, and for how long?",
            "容量合同锁定了什么，锁定多久？"
          ],
          "copy": [
            "The capacity premium secures {securedShare} of first-year revenue for {securedTenor} years. The rest, {merchantShare}, is trading in the zone's day-ahead, intraday and balancing markets, and stays merchant. When prices spike above the strike, part of that gain goes back. After the contract, the capacity line has to be won again at a later auction.",
            "容量溢价锁定首年收入的{securedShare}，期限为{securedTenor}年。其余{merchantShare}来自所在区域的日前、日内和平衡市场交易，仍属市场化收入。价格高于执行价时，部分收益须返还。合同到期后，容量收入须在后续拍卖中重新竞得。"
          ],
          "meaning": [
            "Most of this play's revenue is merchant, and the evidence for that line is thin.",
            "本方案的大部分收入属于市场化收入，而这部分收入的证据单薄。"
          ],
          "marker": {
            "level": "thin",
            "change": [
              "a full year of observed zonal prices that pays the model's merchant line, or a signed floor or toll on the trading margin.",
              "全年区域价格观测达到模型的市场化收入假设，或就交易收益签订保底或租赁合同。"
            ]
          },
          "controls": [
            [
              "During the contract",
              "合同期内"
            ],
            [
              "After the contract",
              "合同到期后"
            ],
            [
              "Merchant evidence",
              "市场化收入依据"
            ]
          ],
          "labels": {
            "label0": [
              "Capacity premium, contracted",
              "容量溢价（合同锁定）"
            ],
            "label1": [
              "Trading: day-ahead, intraday, balancing",
              "交易：日前、日内、平衡市场"
            ],
            "label2": [
              "After the contract: re-auctioned",
              "合同到期后：重新拍卖"
            ],
            "label3": [
              "Strike-price repayment caps the highest prices",
              "执行价返还使最高价格封顶"
            ]
          },
          "claims": [
            "CL-IT-14"
          ],
          "scene": "it-09",
          "extra": {}
        },
        {
          "id": "it-10",
          "chapter": "payment",
          "title": [
            "Why MACSE is the alternative, not the call",
            "MACSE为何是备选，而非首选"
          ],
          "question": [
            "If MACSE secures more, why is it not the call?",
            "MACSE锁定的收入更多，为何不是首选？"
          ],
          "copy": [
            "The two routes trade different rights for different payments. The legacy capacity illustration and MACSE are compared on the labelled design basis: {capacityDesignHold} and {mACSEDesignHold}. MACSE’s modelled secured share is {mACSESecuredShare}. These are separate vintages and contract assumptions, not a current new-entry ranking. Next for MACSE: {mACSENextAction}",
            "两条路径以不同权利换取不同付款。旧批次容量情景与MACSE按明确标注的设计口径比较：分别为{capacityDesignHold}和{mACSEDesignHold}。MACSE模型的固定收入占比为{mACSESecuredShare}。两者对应不同批次和合同假设，不能用作当前新进入者的投资排序。MACSE下一步：{mACSENextAction}"
          ],
          "meaning": [
            "Underwrite the awarded contract, the zone and the entry price. Reprice new storage before comparing it with MACSE.",
            "承销依据是实际中标合同、所在分区及进入价格。比较新储能与MACSE之前，应先重新定价。"
          ],
          "marker": {
            "level": "thin",
            "change": [
              "the second auction's clearing prices by area, and an EPC price for the marginal MWh.",
              "第二轮拍卖各区域的出清价格，以及边际MWh的EPC报价。"
            ]
          },
          "controls": [
            [
              "Capacity market",
              "容量市场"
            ],
            [
              "MACSE",
              "MACSE"
            ],
            [
              "About the basis",
              "口径说明"
            ]
          ],
          "labels": {
            "label0": [
              "Secured share",
              "锁定收入占比"
            ],
            "label1": [
              "Hold return, design comparison",
              "持有期回报（设计对比口径）"
            ],
            "label2": [
              "Not the market page's headline basis",
              "与市场页标题回报口径不同"
            ]
          },
          "claims": [
            "CL-IT-13"
          ],
          "scene": "it-10",
          "extra": {}
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
          "id": "it-11",
          "chapter": "investment",
          "title": [
            "What could weaken it",
            "什么会削弱投资逻辑"
          ],
          "question": [
            "What would make this play less attractive?",
            "什么会让这条投资路线失去吸引力？"
          ],
          "copy": [
            "Four things. The factor decided for new storage in delivery 2028, where it applies to the project. A zone whose prices do not pay the merchant line. More batteries competing for the same spread and the same auctions. Authorisation or construction that misses a delivery year. The next capacity auction is on {cMDY2028AuctionDate} and the next MACSE auction on {mACSEAuction2Date}. Then: {nextAction}",
            "有四个因素：适用于项目的2028交付年度新增储能系数；所在区域价格不足以支撑市场化收入假设；更多电池争夺同一价差和同一拍卖；许可或建设延误错过交付年度。下一轮容量拍卖定于{cMDY2028AuctionDate}，下一轮MACSE拍卖定于{mACSEAuction2Date}。随后：{nextAction}"
          ],
          "meaning": [
            "Price the project at its own zone's factor and an observed trading margin before committing.",
            "承诺投资前，按项目所在区域适用的系数和实际观测的交易收益定价。"
          ],
          "marker": {
            "level": "thin",
            "change": [
              "the analyst's re-pricing at the decided factors, the delivery-2028 auction result, and a year of observed zonal margin.",
              "分析师按已确定系数重新定价、2028交付年度拍卖结果，以及一整年的区域交易收益观测。"
            ]
          },
          "controls": [
            [
              "De-rating",
              "折减系数"
            ],
            [
              "Merchant margin",
              "市场化收益"
            ],
            [
              "Competition",
              "竞争"
            ],
            [
              "Delay",
              "延误"
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
          "labels": {},
          "claims": [
            "CL-IT-10",
            "CL-IT-11",
            "CL-IT-12",
            "CL-IT-14"
          ],
          "scene": "it-11",
          "extra": {
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
              },
              {
                "label": [
                  "Back to the play",
                  "返回方案卡"
                ],
                "anchor": "decision"
              }
            ],
            "factorCards": [
              [
                "Affects capacity income; see the Bankable case and Downside",
                "影响容量收入；见可融资方案与下行风险"
              ],
              [
                "Affects most of revenue; see Revenue and Downside",
                "影响大部分收入；见收益拆解与下行风险"
              ],
              [
                "Affects spreads and auction prices; see Downside",
                "影响价差与拍卖价格；见下行风险"
              ],
              [
                "Affects first revenue; see Execution",
                "影响首笔收入；见执行步骤"
              ],
              [
                "A disclosed Italian toll price could reopen the route choice",
                "意大利租赁价格一旦公开，路径选择可能重新打开"
              ]
            ]
          }
        }
      ]
    }
  ],
  "text": {
    "Context": [
      "English",
      "简体中文"
    ],
    "Market and lens": [
      "Italy · Infrastructure fund",
      "意大利 · 基础设施基金"
    ],
    "Entry button": [
      "Grid, history and full research context",
      "电网、历史与完整研究背景"
    ],
    "Navigation": [
      "Previous · Next · Chapters · Sources",
      "上一节 · 下一节 · 章节 · 来源"
    ],
    "Evidence drawer": [
      "Source · Locator · Checked on {sourceCheckedDate} · Event and source · Why it matters",
      "来源 · 具体位置 · 核查时间：{sourceCheckedDate} · 事件与来源 · 投资含义"
    ],
    "Marker line": [
      "What would change it:",
      "会改变判断的证据："
    ],
    "Legend": [
      "Schematic · Observed · Decided rule · Announced auction · Planned link · Example",
      "示意 · 已观测 · 已确定规则 · 已公布拍卖 · 规划线路 · 示例"
    ],
    "Route switch": [
      "Capacity market · MACSE · The two are alternatives and are never added together",
      "容量市场 · MACSE · 二者互为替代，绝不相加"
    ],
    "Exit": [
      "Go to the investment case",
      "前往投资方案"
    ],
    "Stale call": [
      "This story was last reviewed against the call of ‹date›.",
      "本故事最近一次依据‹date›的投资判断复核。"
    ],
    "Missing value": [
      "Value unavailable; see the market case",
      "数值暂缺；请查看市场方案"
    ],
    "Chart fallback": [
      "Auction results awaiting review; showing an Example",
      "拍卖结果待审核；当前展示示例"
    ],
    "Loading": [
      "Loading evidence… · Could not load; retry",
      "正在载入证据… · 未能载入，重试"
    ],
    "Reduced motion": [
      "You can read the full story without motion",
      "无需动画也可阅读完整内容"
    ],
    "H-IT-01": [
      "{historyNode}: first capacity-market auctions",
      "{historyNode}：首批容量市场拍卖"
    ],
    "H-IT-02": [
      "{historyNode}: new zone configuration takes effect",
      "{historyNode}：新的价格分区配置生效"
    ],
    "H-IT-03": [
      "{historyNode}: decree calls for central storage procurement",
      "{historyNode}：法令要求集中采购储能"
    ],
    "H-IT-04": [
      "{historyNode}: capacity auction for delivery 2027; batteries win most new capacity",
      "{historyNode}：2027交付年度容量拍卖，电池获得大部分新增容量"
    ],
    "H-IT-05": [
      "{historyNode}: first MACSE auction",
      "{historyNode}：首轮MACSE拍卖"
    ],
    "H-IT-06": [
      "{historyNode}: delivery-2028 de-rating decided by zone",
      "{historyNode}：2028交付年度折减系数按区域确定"
    ],
    "Future (dashed)": [
      "{mACSEAuction2Date}: second MACSE auction · {cMDY2028AuctionDate}: capacity auction for delivery 2028",
      "{mACSEAuction2Date}：第二轮MACSE拍卖 · {cMDY2028AuctionDate}：2028交付年度容量拍卖"
    ]
  }
};
