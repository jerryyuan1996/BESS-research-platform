/* Great Britain: signed-off bilingual tables, with the explicit G-1/build dispositions.
   Plain content; bindings and renderers are separate. */
export const story = {
  "storySchemaVersion": 1,
  "contentVersion": "2026-11-01",
  "marketId": "gb",
  "systemBoundary": [
    "Great Britain · GB synchronous area",
    "英国 · 英国同步区"
  ],
  "supportedLocales": [
    "en",
    "zh"
  ],
  "playRef": "gb-toll-4h",
  "reviewedAgainst": {
    "playRef": "gb-toll-4h",
    "call": "opportunistic",
    "hours": 4,
    "lens": "infraFund",
    "stage": "operating",
    "route": "toll",
    "on": "2026-11-01",
    "commit": "26a678b8bf0c01e8b04c3b9553b2e877c68497bb"
  },
  "tokens": [
    "call",
    "playName",
    "cardFigures",
    "nextAction",
    "playEvidence",
    "playDuration",
    "securedShare",
    "securedTenor",
    "operatingPrice",
    "tollQuotedHours",
    "capacityAgreementYears",
    "deratingCurve",
    "netaDate",
    "bettaDate",
    "capacityDate",
    "efrDate",
    "deratingDate",
    "dcDate",
    "drDmDate",
    "obpDate",
    "gate2Date",
    "remaDate",
    "feeDate",
    "queueMW",
    "cpBatteryRange",
    "cpHorizon",
    "serviceSeries",
    "sourceCheckedDate",
    "gateName",
    "capacityAuction",
    "deratingSchedule"
  ],
  "sources": {
    "SRC-GB-01": {
      "title": "NESO · GB Synchronous Area operational methodology (SOGL) and supporting document",
      "url": "https://www.neso.energy/document/299176/download",
      "locator": "Scope: GB as its own synchronous area; standard frequency range",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-02": {
      "title": "NESO · National Electricity Transmission System Performance Report",
      "url": "https://www.neso.energy/document/267701/download",
      "locator": "Interconnector list (HVDC links)",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-03": {
      "title": "Ofgem · NETA: a review of the first three months (Aug 2001); NETA factsheet (Feb 2002)",
      "url": "https://www.ofgem.gov.uk/sites/default/files/docs/2001/08/a-review-of-the-first-three-months-31-08_0.pdf",
      "locator": "Factsheet: NETA \"introduced in England and Wales on Tuesday 27 March 2001\"",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-04": {
      "title": "Ofgem · What is BETTA? (Apr 2002); Energy Act 2004 explanatory notes; HMRC VFUP3300",
      "url": "https://www.ofgem.gov.uk/sites/default/files/docs/2002/04/1105-factsheet0702_15april_0.pdf",
      "locator": "BETTA user guide (Feb 2005): go-live \"anticipated to be 1 April 2005\", https://www.ofgem.gov.uk/sites/default/files/docs/2005/02/9549-2605.pdf; Ofgem July 2005 consultation: NETA \"extended GB wide under BETTA in April 2005\", https://www.ofgem.gov.uk/sites/default/files/docs/2005/07/11190-17805.pdf",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-05": {
      "title": "National Grid · Enhanced Frequency Response Market Information Report (26 Aug 2016)",
      "url": "https://www.nationalgrid.com/sites/default/files/documents/EFR%20Market%20Information%20Report%20v1%20(1)_1.pdf",
      "locator": "Moved original; quantitative results withheld — GAP-GB-EFR",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-06": {
      "title": "National Grid · Enhanced Frequency Response 2016 (presentation)",
      "url": "https://www.nationalgrid.com/sites/default/files/documents/8589937157-06_EFR.pdf",
      "locator": "Moved original; quantitative results withheld — GAP-GB-EFR",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-07": {
      "title": "National Grid · EFR Invitation to Tender v2.2",
      "url": "https://www.nationalgrid.com/sites/default/files/documents/Enhanced%20Frequency%20Response%20ITT%20v2_2%20compare.pdf",
      "locator": "NESO copy: https://www.neso.energy/document/101541/download. §3.4: contracts of up to four years; 50 MW cap per applicant (§3.4, §7.17); results due 26 Aug 2016",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-08": {
      "title": "NESO · \"National Grid ESO debuts Dynamic Containment frequency response service\"; ESO Annual Report 2020",
      "url": "https://www.neso.energy/news/national-grid-eso-debuts-dynamic-containment-frequency-response-service",
      "locator": "News dated 30 Sep 2020: goes live in the control room at 11pm; first round accepted two battery units for 90 MW; tenders seven days a week",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-09": {
      "title": "Ofgem · DR and DM Article 18 decision letters (Mar 2022); decision on DR, DM and DC terms (Feb 2023); NESO Dynamic Services page; ESO news on DM",
      "url": "https://www.ofgem.gov.uk/sites/default/files/2022-03/DR%20Art18%20decision%20letter.pdf",
      "locator": "DC high launched October 2021 (Ofgem 2023); DM added 21 Apr 2022 (ESO news). First cleared deliveries in SRC-GB-12: DC high 4 Nov 2021, DR 9 Apr 2022, DM 7 May 2022 (CF-GB-05)",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-10": {
      "title": "NESO · Enduring Auction Capability platform (news); May 2024 Balancing Costs technical report",
      "url": "https://www.neso.energy/news/enduring-auction-capability-platform-new-and-improved-platform-procuring-frequency-response-services",
      "locator": "News dated 24 Nov 2023: bids for several services at once; first EAC round, average clearing price 35% below the previous seven days, cleared volume stable. May 2024 report: \"In November 2023 the procurement of DC, DM and DR was moved to the Enduring Auction Capability (EAC) platform\"",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-11": {
      "title": "NESO · Balancing Cost Winter Report (May 2024); Monthly Balancing Cost Reports, July and August 2026",
      "url": "https://www.neso.energy/document/318696/download",
      "locator": "Falls attributed to more participants, requirement certainty and auction design; 2026 moves to liquidity and offered volume against a firm requirement",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-12": {
      "title": "NESO data portal · Dynamic Containment, Regulation and Moderation auction results",
      "url": "https://www.neso.energy/data-portal/dynamic-containment-data",
      "locator": "Rights: NESO Open Data Licence; \"This dataset will no longer be updated\". CKAN package `dynamic-containment-data` (api.neso.energy): DC masterdata 2020–21 (fields incl. Volume Accepted, Availability Fee, Technology Type); results summary 2021–2023 (Service, EFA Date, Cleared Volume, Clearing Price); results by unit 2021–2023 (incl. Technology Type); linear and block orders",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-13": {
      "title": "NESO data portal · EAC auction results",
      "url": "https://www.neso.energy/data-portal/eac-auction-results",
      "locator": "Rights: NESO Open Data Licence; daily update. CKAN package `eac-auction-results`: Response-Reserve results summary (auctionProduct, deliveryStart, clearedVolume, clearingPrice), current year plus FY2023, FY2024 and FY2025 archives; results by unit (incl. technologyType); sell orders (quantity, executedQuantity)",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-14": {
      "title": "NESO · NESO Open Licence",
      "url": "https://www.neso.energy/data-portal/neso-open-licence",
      "locator": "Licence v1.0, \"based on version 3.0 of the Open Government Licence\"; free to \"exploit the Information commercially and non-commercially\"; attribution \"Supported by National Energy SO Open Data\"; applies dataset by dataset",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-15": {
      "title": "NESO · \"First stages of Open Balancing Platform go live\"; \"The start of the balancing mechanism revolution\"; RIIO-2 BP2 2023-24 incentives report",
      "url": "https://www.neso.energy/news/first-stages-open-balancing-platform-go-live",
      "locator": "News dated 13 Dec 2023: first stage goes live \"this week\" for bulk dispatch of battery storage and small units. Incentives report: Release 1 in December 2023; average daily volume instructed for batteries up 220% after early fixes",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-16": {
      "title": "NESO · Skip rates page and methodology guide",
      "url": "https://www.neso.energy/industry-information/balancing-services/skip-rates",
      "locator": "Two skip-rate datasets; by-technology reporting since June 2025",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-17": {
      "title": "Elexon · Licence to use BMRS open data; BMRS API terms",
      "url": "https://www.elexon.co.uk/bsc/data/balancing-mechanism-reporting-agent/copyright-licence-bmrs-data/",
      "locator": "Licence page: free to \"exploit the BMRS Data, including commercially\", with attribution; API terms separate; conflicting general copyright page (CF-GB-08)",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-18": {
      "title": "DECC via GOV.UK · \"First Capacity Market auction guarantees security of supply at low cost\"; T-4 2014 provisional results",
      "url": "https://www.gov.uk/government/news/first-capacity-market-auction-guarantees-security-of-supply-at-low-cost",
      "locator": "\"The T-4 Capacity Auction for delivery in 2018 concluded on 18th December 2014\"",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-19": {
      "title": "DESNZ · Capacity Market Rules, informal consolidation July 2026, Schedule 3B; Capacity Market (Amendment) Rules 2018",
      "url": "https://assets.publishing.service.gov.uk/media/6a68894dcc35a9471da4c18f/capacity-market-rules-consolidation-2026.pdf",
      "locator": "2026 consolidation opened: Schedule 3B, methodology for determining de-rating; rule 2.3.5B (EFC under Schedule 3B). 2018 amendment not reopened; the Dec 2017 National Grid assessment not located (CF-GB-09)",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-20": {
      "title": "NESO and DESNZ · T-4 2029/30 results and auction monitor report; Capacity Market Register",
      "url": "https://www.neso.energy/news/delivering-reliability-gb-consumers-capacity-market-action",
      "locator": "NESO news: concluded 11 Mar 2026 at £27.10/kW/year, against £60–65 in the previous three T-4s; 40.1 GW for 2029/30. Monitor report confirms the price. Register holds agreements and a de-rating CSV. Table 3 of the T-4 2029/30 guidelines per REPO-GB-01 (not reopened)",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-21": {
      "title": "EMR Settlement and legislation.gov.uk · Capacity Market scheme page; G15 supplier payments; Electricity Capacity (Supplier Payment etc.) Regulations 2014",
      "url": "https://www.emrsettlement.co.uk/schemes/capacity-market/",
      "locator": "Suppliers pay the Capacity Market Supplier Charge; the Electricity Settlements Company pays providers; stress-event penalties",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-22": {
      "title": "DESNZ · REMA summer update 2025",
      "url": "https://www.gov.uk/government/publications/review-of-electricity-market-arrangements-rema-summer-update-2025/review-of-electricity-market-arrangements-rema-summer-update-2025-accessible-webpage",
      "locator": "10 Jul 2025: \"retain a single national GB-wide wholesale market\"; \"We have therefore decided not to implement zonal pricing\"",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-23": {
      "title": "Ofgem · TMO4+ summary decision; Gate 2 Criteria Methodology decision (OFG1164); extension decision",
      "url": "https://www.ofgem.gov.uk/sites/default/files/2025-04/Summary-Decision-Document-TMO4-package.pdf",
      "locator": "Summary decision, publication date 15 Apr 2025; extension decision: implementation on 10 Jun 2025. Gate 2 wording (confirmed date, point, queue position) from the methodology decision, not reopened",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-24": {
      "title": "DESNZ and Ofgem · Open letter, \"Connections Reform: delivery update and battery capacity\" (Apr 2026)",
      "url": "https://www.gov.uk/government/publications/connections-reform-delivery-update-and-battery-capacity/open-letter-from-desnz-and-ofgem-on-connections-reform-delivery",
      "locator": "Letter dated 16 Apr 2026: \"14.8 GW above the top of the Action Plan battery capacity range for 2030 and 61.7 GW above the projected battery system need in 2035\"; NESO's consultation raises disapplying protections 3a/3b so only batteries with a revenue support scheme qualify in the next window",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-25": {
      "title": "Ofgem and NESO · CMP470 Oversubscribed Technologies Commitment Fee: urgency decision, workgroup report, minded-to consultation (17 Sep 2026), press release",
      "url": "https://www.ofgem.gov.uk/sites/default/files/2026-09/CMP470-Minded-to-Consultation.pdf",
      "locator": "Minded-to consultation, response deadline 1 Oct 2026; press release 17 Sep 2026: about 90 GW of batteries operational or in the reformed queue (83 GW prioritised plus 7 GW operating) against about 29 GW needed by 2035. Decision awaited (CF-GB-10)",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-26": {
      "title": "DESNZ · Clean Power 2030 Action Plan main report (Dec 2024); Clean Flexibility Roadmap (Jul 2025)",
      "url": "https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report",
      "locator": "\"23-27 GW\" of batteries by 2030 (opened); separate long-duration category",
      "checkedOn": "2026-10-31"
    },
    "SRC-GB-27": {
      "title": "NESO · \"NESO to launch new Quick Reserve service\"; Slow Reserve page",
      "url": "https://www.neso.energy/news/neso-launch-new-quick-reserve-service",
      "locator": "Quick Reserve launch on 3 Dec 2024 (opened); Slow Reserve go-live notice, intended 31 Mar 2026 (not opened)",
      "checkedOn": "2026-10-31"
    },
    "REPO-GB-LIVE": {
      "title": "Current fund play card and briefing",
      "url": "/markets/great-britain#bankable",
      "locator": "infraFund row, investment-summary projection; current call, play, hours and operatingPurchase",
      "checkedOn": "2026-11-01"
    },
    "REPO-GB-01": {
      "title": "Published-vintage model fields",
      "url": "/markets/great-britain#bankable",
      "locator": "comparison.durationResponse.capacityDerating; routeRules.toll.quotedHours; economics.contractYears. Existing result fields; no new case calculation.",
      "checkedOn": "2026-11-01"
    }
  },
  "claims": {
    "CL-GB-03": {
      "sources": [
        "SRC-GB-01",
        "SRC-GB-02"
      ]
    },
    "CL-GB-04": {
      "sources": [
        "SRC-GB-03",
        "SRC-GB-04"
      ]
    },
    "CL-GB-05": {
      "sources": [
        "SRC-GB-18",
        "SRC-GB-21"
      ]
    },
    "CL-GB-06": {
      "sources": [
        "SRC-GB-19",
        "SRC-GB-20",
        "REPO-GB-01"
      ]
    },
    "CL-GB-07": {
      "sources": [
        "SRC-GB-05",
        "SRC-GB-06",
        "SRC-GB-07"
      ]
    },
    "CL-GB-08": {
      "sources": [
        "SRC-GB-08",
        "SRC-GB-09",
        "SRC-GB-10",
        "SRC-GB-12"
      ]
    },
    "CL-GB-09": {
      "sources": [
        "SRC-GB-10",
        "SRC-GB-11",
        "SRC-GB-12",
        "SRC-GB-13"
      ]
    },
    "CL-GB-10": {
      "sources": [
        "SRC-GB-15",
        "SRC-GB-16"
      ]
    },
    "CL-GB-11": {
      "sources": [
        "SRC-GB-22"
      ]
    },
    "CL-GB-12": {
      "sources": [
        "SRC-GB-23"
      ]
    },
    "CL-GB-13": {
      "sources": [
        "SRC-GB-24",
        "SRC-GB-25"
      ]
    },
    "CL-GB-14": {
      "sources": [
        "SRC-GB-26"
      ]
    },
    "CL-GB-15": {
      "sources": [
        "SRC-GB-10",
        "SRC-GB-21"
      ]
    },
    "CL-GB-16": {
      "sources": [
        "REPO-GB-LIVE",
        "REPO-GB-01"
      ]
    },
    "CL-GB-17": {
      "sources": [
        "SRC-GB-20",
        "SRC-GB-21"
      ]
    },
    "CL-GB-18": {
      "sources": [
        "SRC-GB-15",
        "SRC-GB-17"
      ]
    }
  },
  "vocabulary": [
    [
      "Great Britain · Infrastructure fund",
      "英国 · 基础设施基金"
    ],
    [
      "Grid, history and full research context",
      "电网、历史与完整研究背景"
    ],
    [
      "Previous · Next · Chapters · Open evidence · Close evidence · Back to market",
      "上一节 · 下一节 · 章节 · 查看证据 · 关闭证据 · 返回市场"
    ],
    [
      "Source · Locator · Checked on {sourceCheckedDate} · Definition · Event and source · Why it matters",
      "来源 · 具体位置 · 核查时间：{sourceCheckedDate} · 统计口径 · 事件与来源 · 投资含义"
    ],
    [
      "Strong evidence. · Fair evidence. · Thin evidence. · What would change it:",
      "证据充分。 · 证据尚可。 · 证据单薄。 · 会改变判断的证据："
    ],
    [
      "Schematic · Observed event · Official plan · Decision pending · Example · Model assumption",
      "示意图 · 已发生事件 · 官方计划 · 待决定 · 示例 · 模型假设"
    ],
    [
      "Date · Clearing price · £/MW/h · Cleared MW · Offered MW · All technologies",
      "日期 · 出清价格 · 英镑/MW/小时 · 出清MW · 报价MW · 全部技术类型"
    ],
    [
      "Availability prices for holding response ready; not earnings · Auction platform changed here · Tender with multi-year contracts; not a daily auction",
      "待命响应的可用容量价格，并非收入 · 拍卖平台在此变更 · 多年期合同招标，并非日度拍卖"
    ],
    [
      "{serviceSeries} clearing prices and cleared MW by month, {serviceSeries} coverage. Auction observations, not battery earnings",
      "{serviceSeries}各月出清价格与出清MW，覆盖期{serviceSeries}。这是拍卖观测，不是电池收入"
    ],
    [
      "Battery modules · Inverter · Transformer · Controls · Connection · Usable energy · Charge · Discharge",
      "电池模块 · 逆变器 · 变压器 · 控制系统 · 并网接入 · 可用电量 · 充电 · 放电"
    ],
    [
      "More batteries can lower the price of every remaining service and spread · Narrower spreads reduce merchant value after the toll · A shorter toll leaves more of the hold merchant · Queue rules change the value of new connections, not of one already held",
      "更多电池会压低剩余各项服务的价格与价差 · 价差收窄会降低租赁期后的市场化价值 · 租赁期缩短会使持有期内更多时间承担市场风险 · 排队规则改变的是新并网的价值，而非已握有的并网"
    ],
    [
      "Current case unavailable; review the market case · Quantitative history not yet available · Loading source data… · Could not load data; retry",
      "当前情景暂不可用；请查看市场方案 · 量化历史暂不可用 · 正在载入来源数据… · 数据未能载入，重试"
    ],
    [
      "You can read the full story without motion",
      "无需动画也可阅读完整内容"
    ]
  ],
  "opening": {
    "id": "gb-00",
    "title": [
      "The call",
      "先看投资判断"
    ],
    "chapter": "opening",
    "scene": "gb-00",
    "question": [
      "What is the call here, and why should I read on?",
      "这里的投资判断是什么？为什么值得读下去？"
    ],
    "copy": [
      "Why: each service Britain's batteries entered has filled, so little revenue is secured. A toll on an operating asset fixes most of it for the toll's term.",
      "原因在于：英国电池进入的每一项服务都已饱和，能锁定的收入很少。在运资产附带的租赁合同，可在合同期内锁定大部分收入。"
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
      "CL-GB-16"
    ],
    "extra": {
      "controlText": [
        "Start the story · Go to the investment case",
        "开始阅读 · 前往投资方案"
      ]
    }
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
          "id": "gb-01",
          "title": [
            "An island that keeps its own frequency",
            "自守频率的岛屿电网"
          ],
          "chapter": "origins",
          "scene": "gb-01",
          "question": [
            "Why does Britain buy so much fast response?",
            "英国为什么需要采购大量快速响应？"
          ],
          "copy": [
            "Great Britain runs its own frequency. Its links to the island of Ireland, Norway and the continent are direct-current cables: they trade power but do not share the grid's frequency. When a large unit trips, Britain must cover most of the response within its own system.",
            "英国电网独立维持自身频率。它与爱尔兰岛、挪威和欧洲大陆的连接都是直流海缆：可以交易电力，但不共享电网频率。大型机组跳闸时，英国须主要依靠本系统内的资源提供响应。"
          ],
          "meaning": [
            "A grid that holds its own frequency created the first paid market for fast batteries.",
            "自守频率的电网，为快速响应电池创造了第一个付费市场。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the analyst's reading of NESO's GB synchronous-area methodology and the current interconnector frequency obligations.",
              "分析师核读NESO关于英国同步区的运行方法，以及现行互联线路的频率义务。"
            ]
          },
          "controls": [
            [
              "Own frequency",
              "自身频率"
            ],
            [
              "Trading links",
              "交易联系"
            ]
          ],
          "labels": {
            "all": [
              "Great Britain · GB synchronous area · Direct-current link · Island of Ireland · Norway · Continental Europe",
              "英国 · 英国同步区 · 直流联络线 · 爱尔兰岛 · 挪威 · 欧洲大陆"
            ]
          },
          "claims": [
            "CL-GB-03"
          ],
          "extra": {
            "controlText": [
              "Own frequency · Trading links",
              "自身频率 · 交易联系"
            ]
          }
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
          "id": "gb-02",
          "title": [
            "Trading by contract",
            "以合同交易，由平衡机制收尾"
          ],
          "chapter": "choices",
          "scene": "gb-02",
          "question": [
            "How does Britain trade electricity?",
            "英国如何交易电力？"
          ],
          "copy": [
            "In {netaDate}, bilateral trading replaced the central Pool in England and Wales; from {bettaDate} it covered all of Great Britain. Generators and suppliers contract ahead and dispatch themselves. The system operator balances what is left in the Balancing Mechanism.",
            "{netaDate}，双边交易在英格兰和威尔士取代了集中式电力库（Pool）；自{bettaDate}起覆盖整个大不列颠。发电商与售电商提前签约并自行调度，剩余的不平衡由系统运营商在平衡机制中处理。"
          ],
          "meaning": [
            "This play's trading and balancing value is what a toll counterparty buys.",
            "本方案的交易与平衡价值，正是租赁对手方所购买的。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "Ofgem's NETA and BETTA implementation records, opened at their exact pages.",
              "打开Ofgem关于NETA与BETTA实施的原始记录，并核对具体页码。"
            ]
          },
          "controls": [
            [
              "Pool",
              "电力库"
            ],
            [
              "Bilateral trading",
              "双边交易"
            ],
            [
              "Balancing Mechanism",
              "平衡机制"
            ]
          ],
          "labels": {
            "all": [
              "Contracted ahead · Self-dispatched · Balanced at the end",
              "提前签约 · 自行调度 · 最后平衡"
            ]
          },
          "claims": [
            "CL-GB-04"
          ],
          "extra": {
            "controlText": [
              "Pool · Bilateral trading · Balancing Mechanism",
              "电力库 · 双边交易 · 平衡机制"
            ]
          }
        },
        {
          "id": "gb-03",
          "title": [
            "The first battery wave",
            "第一波电池"
          ],
          "chapter": "choices",
          "scene": "gb-03",
          "question": [
            "What first brought large batteries onto Britain's grid?",
            "是什么最早把大型电池带上英国电网？"
          ],
          "copy": [
            "The first Enhanced Frequency Response tender procured very fast response on multi-year terms. Batteries could provide that service. Exact tender counts, accepted MW and prices are withheld until the original results report has been opened.",
            "首次增强型频率响应招标以多年期条款采购极快响应，电池可以提供这项服务。具体投标数量、中标MW和价格，须待打开原始结果报告后再展示。"
          ],
          "meaning": [
            "A fast-response procurement route existed; its exact award figures remain an evidence gap.",
            "当时已存在快速响应采购路径；具体中标数字仍属证据缺口。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the opened tender report and site list, confirming accepted MW, price and technology.",
              "打开招标报告及场址清单，核实中标MW、价格和技术类型。"
            ]
          },
          "controls": [
            [
              "Service requirements",
              "服务要求"
            ],
            [
              "Contract term",
              "合同期限"
            ]
          ],
          "labels": {
            "all": [
              "Enhanced Frequency Response · Tendered sites · Accepted tenders · Availability price · £/MW/h",
              "增强型频率响应 · 投标场址 · 中标标书 · 可用容量价格 · 英镑/MW/小时"
            ]
          },
          "claims": [
            "CL-GB-07"
          ],
          "extra": {
            "controlText": [
              "Service requirements · Contract term",
              "服务要求 · 合同期限"
            ]
          }
        },
        {
          "id": "gb-04",
          "title": [
            "Capacity, paid by duration",
            "容量按时长计价"
          ],
          "chapter": "choices",
          "scene": "gb-04",
          "question": [
            "How does Britain pay for capacity, and why does duration matter?",
            "英国如何为容量付费？时长为何重要？"
          ],
          "copy": [
            "The Capacity Market held its first auction in {capacityDate}. Suppliers fund it. A battery is credited with only part of its power, a share set by how long it can keep discharging; storage has been de-rated by duration since {deratingDate}. The longer the battery, the larger the share.",
            "容量市场于{capacityDate}举行首次拍卖，资金来自售电商。电池只有部分功率被计入，比例取决于它能持续放电多久；自{deratingDate}起，储能按时长折减。电池时长越长，计入比例越高。"
          ],
          "meaning": [
            "The capacity agreement is the main long contract a battery can win here, and it rewards the hours this play builds.",
            "容量协议是电池在这里能赢得的主要长期合同，并为本方案配置的时长带来回报。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the {capacityAuction} auction guidelines' storage table and Schedule {deratingSchedule}, opened and checked against the model's factors.",
              "打开{capacityAuction}拍卖指引中的储能折减表及《容量市场规则》附表{deratingSchedule}，并与模型系数核对。"
            ]
          },
          "controls": [
            [
              "Nameplate MW",
              "铭牌MW"
            ],
            [
              "Counted MW",
              "计入MW"
            ],
            [
              "Longer battery (Example)",
              "更长时长（示例）"
            ]
          ],
          "labels": {
            "all": [
              "Nameplate · Counted for capacity · De-rating factor: {deratingCurve} · Example",
              "铭牌容量 · 计入容量 · 折减系数：{deratingCurve} · 示例"
            ]
          },
          "claims": [
            "CL-GB-05",
            "CL-GB-06"
          ],
          "extra": {
            "controlText": [
              "Nameplate MW · Counted MW · Longer battery (Example)",
              "铭牌MW · 计入MW · 更长时长（示例）"
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
          "id": "gb-05",
          "title": [
            "Each service filled in turn",
            "各项服务依次被填满 (signature chart / 核心图表)"
          ],
          "chapter": "tensions",
          "scene": "gb-05",
          "question": [
            "What happened to prices as batteries filled each service?",
            "电池逐一进入各项服务后，价格发生了什么变化？"
          ],
          "copy": [
            "Dynamic Containment opened in {dcDate}; Dynamic Regulation and Moderation followed in {drDmDate}. As more MW competed for each requirement, clearing prices fell far below their opening levels; NESO attributes the falls to more participants and more offered volume. Since then some prices have risen with requirements, and some clear below zero. A clearing price is what the auction paid to hold response ready, not what a battery earned.",
            "动态遏制（DC）于{dcDate}开放，动态调节（DR）和动态缓和（DM）于{drDmDate}相继推出。随着更多MW竞争每项需求量，出清价格降至远低于开放之初的水平；NESO将价格下降归因于参与者和报价量增加。此后，部分价格随需求量上升而回升，部分则以负价出清。出清价格是拍卖为待命响应支付的价格，不是电池的实际收入。"
          ],
          "meaning": [
            "The services that drew batteries now pay little, so this play does not rest on them.",
            "曾经吸引电池的服务如今回报很低，因此本方案不依靠这些服务。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the NESO auction results registered, plotted and reviewed by the analyst.",
              "登记NESO拍卖结果数据，绘图并经分析师复核。"
            ]
          },
          "controls": [
            [
              "Dynamic Containment",
              "动态遏制"
            ],
            [
              "Dynamic Regulation",
              "动态调节"
            ],
            [
              "Dynamic Moderation",
              "动态缓和"
            ],
            [
              "All services",
              "全部服务"
            ],
            [
              "How measured",
              "计算口径"
            ]
          ],
          "labels": {
            "all": [
              "Clearing price · £/MW/h · Cleared MW · Offered MW · Platform change",
              "出清价格 · 英镑/MW/小时 · 出清MW · 报价MW · 平台变更"
            ]
          },
          "claims": [
            "CL-GB-08",
            "CL-GB-09"
          ],
          "extra": {
            "controlText": [
              "Dynamic Containment · Dynamic Regulation · Dynamic Moderation · All services · How measured",
              "动态遏制 · 动态调节 · 动态缓和 · 全部服务 · 计算口径"
            ]
          },
          "caption": [
            "Auction prices for holding response ready; not battery earnings.",
            "这是待命响应的拍卖价格，不是电池收入。"
          ]
        },
        {
          "id": "gb-06",
          "title": [
            "From services to trading",
            "从辅助服务转向交易"
          ],
          "chapter": "tensions",
          "scene": "gb-06",
          "question": [
            "How can batteries participate in balancing?",
            "电池如何参与平衡机制？"
          ],
          "copy": [
            "From {obpDate}, the control room could instruct many batteries at once in the Balancing Mechanism. This is a change in dispatch access. A dispatch instruction and a clearing price do not establish the owner’s captured revenue.",
            "自{obpDate}起，调度室可在平衡机制中一次性向多台电池发出指令。这体现的是调度参与方式的变化；调度指令与出清价格不能直接证明业主实际获得的收入。"
          ],
          "meaning": [
            "Keep the participation mechanism separate from the still-unverified revenue split.",
            "应把参与机制与尚未核实的收入构成区分开。"
          ],
          "marker": {
            "level": "thin",
            "change": [
              "the operator’s dispatch records and payment terms; a revenue split needs separate sourcing.",
              "运营商调度记录与付款条款；收入构成需要另行查证。"
            ]
          },
          "controls": [
            [
              "Response",
              "响应服务"
            ],
            [
              "Balancing Mechanism",
              "平衡机制"
            ],
            [
              "Wholesale",
              "批发市场"
            ],
            [
              "Units",
              "单位"
            ]
          ],
          "labels": {
            "all": [
              "Capacity held ready · £/MW/h · Energy traded · £/MWh · Different units; never added",
              "待命容量 · 英镑/MW/小时 · 交易电量 · 英镑/MWh · 单位不同，不可相加"
            ]
          },
          "claims": [
            "CL-GB-10",
            "CL-GB-18"
          ],
          "extra": {
            "controlText": [
              "Response · Balancing Mechanism · Wholesale · Units",
              "响应服务 · 平衡机制 · 批发市场 · 单位"
            ]
          }
        },
        {
          "id": "gb-07",
          "title": [
            "A queue full of batteries",
            "排满电池的并网队列"
          ],
          "chapter": "tensions",
          "scene": "gb-07",
          "question": [
            "Why not build a new battery instead?",
            "为什么不新建一座电池？"
          ],
          "copy": [
            "Ofgem approved a reordered connection queue in {gate2Date}: projects that pass {gateName} get a confirmed date and connection point. Batteries in the reformed queue still exceed the government's range for {cpHorizon}, {cpBatteryRange}. In {feeDate}, Ofgem proposed an extra commitment fee for oversubscribed technologies; its decision is pending. Britain keeps one national price: zonal pricing was rejected in {remaDate}.",
            "Ofgem于{gate2Date}批准重新排序的并网队列：通过{gateName}的项目获得确定的并网日期和接入点。改革后队列中的电池仍超过政府{cpHorizon}年的规划区间（{cpBatteryRange}）。{feeDate}，Ofgem提议对超额申请的技术加收承诺费，决定尚未作出。英国维持全国统一电价：分区电价方案已于{remaDate}被否决。"
          ],
          "meaning": [
            "New-build batteries face queue rules still being set; an operating asset already holds its connection.",
            "新建电池面临仍在制定中的排队规则；在运资产已握有并网条件。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "Ofgem's decision on the commitment fee and NESO's final rule on queue protections for batteries.",
              "Ofgem对承诺费的决定，以及NESO关于电池排队保护的最终规则。"
            ]
          },
          "controls": [
            [
              "Before reform",
              "改革前"
            ],
            [
              "{gateName} queue",
              "{gateName}队列"
            ],
            [
              "Proposed fee (pending)",
              "拟议收费（待定）"
            ]
          ],
          "labels": {
            "all": [
              "Operating · {gateName} queue: {queueMW} · Government range for {cpHorizon}: {cpBatteryRange} · Decision pending",
              "在运 · {gateName}队列：{queueMW} · 政府{cpHorizon}年规划区间：{cpBatteryRange} · 待决定"
            ]
          },
          "claims": [
            "CL-GB-11",
            "CL-GB-12",
            "CL-GB-13",
            "CL-GB-14"
          ],
          "extra": {
            "controlText": [
              "Before reform · {gateName} queue · Proposed fee (pending)",
              "改革前 · {gateName}队列 · 拟议收费（待定）"
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
          "id": "gb-08",
          "title": [
            "Why four hours",
            "为什么是四小时"
          ],
          "chapter": "battery",
          "scene": "gb-08",
          "question": [
            "Why is this play {playDuration} hours?",
            "为什么本方案选择{playDuration}小时？"
          ],
          "copy": [
            "Two things set it. The toll the model prices is quoted at {tollQuotedHours} hours, the only toll duration it prices. Capacity credit rises with duration, so the play's battery counts for more capacity than a shorter Example battery. A longer battery counts for more again but needs more capital; the model weighs both.",
            "原因有二。模型定价的租赁按{tollQuotedHours}小时报价，这也是模型唯一定价的租赁时长。容量信用随时长提高，因此本方案的电池比较短的示例电池计入更多容量。更长的电池计入更多，但需要更多资本，模型对两者加以权衡。"
          ],
          "meaning": [
            "{playDuration} hours matches the toll on offer and keeps the capacity credit beside it.",
            "{playDuration}小时既匹配现有的租赁报价，也保住与之并存的容量信用。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a toll quoted at another duration, or a changed de-rating table or design-fit result.",
              "出现其他时长的租赁报价，或折减系数表、设计匹配结果发生变化。"
            ]
          },
          "controls": [
            [
              "Current play",
              "当前方案"
            ],
            [
              "Shorter battery (Example)",
              "较短时长（示例）"
            ],
            [
              "Longer battery (Example)",
              "较长时长（示例）"
            ]
          ],
          "labels": {
            "all": [
              "Power · MW · Energy · MWh · Counted for capacity · More capital · Example",
              "功率 · MW · 电量 · MWh · 计入容量 · 更多资本 · 示例"
            ]
          },
          "claims": [
            "CL-GB-06",
            "CL-GB-16"
          ],
          "extra": {
            "controlText": [
              "Current play · Shorter battery (Example) · Longer battery (Example)",
              "当前方案 · 较短时长（示例） · 较长时长（示例）"
            ]
          }
        },
        {
          "id": "gb-09",
          "title": [
            "One set of megawatts",
            "同一组兆瓦，不能重复承诺"
          ],
          "chapter": "battery",
          "scene": "gb-09",
          "question": [
            "Can one battery earn every service at once?",
            "一座电池能同时赚取所有服务的收入吗？"
          ],
          "copy": [
            "No. The same MW and stored energy can be held for response, offered into balancing or traded ahead, but never promised twice. The capacity agreement sits alongside them, with a duty to deliver when the system is stressed. Under a toll, the offtaker decides how the battery is used.",
            "不能。同一组MW和储存电量，可用于待命响应、在平衡机制中报价或提前交易，但绝不能重复承诺。容量协议与这些用途并存，但在系统紧张时必须履约。在租赁期内，由承租方决定电池如何使用。"
          ],
          "meaning": [
            "Revenue lines share one battery, so this play never adds services at their individual maxima.",
            "各收入项共用同一座电池，因此本方案从不按各项服务的单项最高值叠加收入。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the toll's dispatch and availability terms, and NESO's current rules on splitting service bids.",
              "租赁合同的调度与可用率条款，以及NESO现行的服务报价拆分规则。"
            ]
          },
          "controls": [
            [
              "Response",
              "响应"
            ],
            [
              "Balancing",
              "平衡"
            ],
            [
              "Trading",
              "交易"
            ],
            [
              "Capacity duty",
              "容量义务"
            ]
          ],
          "labels": {
            "all": [
              "Headroom already committed · Stress-event duty · Offtaker dispatches",
              "余量已被占用 · 紧张事件义务 · 承租方调度"
            ]
          },
          "claims": [
            "CL-GB-15",
            "CL-GB-16"
          ],
          "extra": {
            "controlText": [
              "Response · Balancing · Trading · Capacity duty",
              "响应 · 平衡 · 交易 · 容量义务"
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
          "id": "gb-10",
          "title": [
            "Who pays for what",
            "谁为何付费"
          ],
          "chapter": "payment",
          "scene": "gb-10",
          "question": [
            "Who pays a British battery, and what is fixed?",
            "谁向英国电池付钱？哪些收入是固定的？"
          ],
          "copy": [
            "NESO procures response in short auctions. Balancing actions and imbalance settle through Elexon; trading earns a price spread. Suppliers fund the Capacity Market through the Electricity Settlements Company for the agreement’s term. Each payment has its own obligations and units.",
            "NESO通过短期拍卖采购响应。平衡操作与不平衡电量通过Elexon结算；交易赚取价差。容量市场由售电商出资，经电力结算公司在协议期内付款。每项付款有各自的履约义务和计量单位。"
          ],
          "meaning": [
            "A capacity agreement fixes one payment line for a term; the executed toll must establish what else is fixed.",
            "容量协议在一定期限内固定一项付款；其他哪些收入被固定，需要以已签租赁合同为依据。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "payment terms checked in the EMR Settlement guidance and in the asset's own capacity agreement.",
              "核对EMR结算指引中的付款条款，以及资产自身的容量协议。"
            ]
          },
          "controls": [
            [
              "Response",
              "响应"
            ],
            [
              "Balancing and imbalance",
              "平衡与不平衡"
            ],
            [
              "Trading",
              "交易"
            ],
            [
              "Capacity",
              "容量"
            ]
          ],
          "labels": {
            "all": [
              "NESO · Elexon settlement · Market counterparties · Electricity Settlements Company · Suppliers · £/MW/h · £/MWh · £/kW/year",
              "NESO · Elexon结算 · 市场交易对手 · 电力结算公司 · 售电商 · 英镑/MW/小时 · 英镑/MWh · 英镑/kW/年"
            ]
          },
          "claims": [
            "CL-GB-15",
            "CL-GB-17",
            "CL-GB-18"
          ],
          "extra": {
            "controlText": [
              "Response · Balancing and imbalance · Trading · Capacity",
              "响应 · 平衡与不平衡 · 交易 · 容量"
            ]
          }
        },
        {
          "id": "gb-11",
          "title": [
            "What a toll secures, and until when",
            "租赁锁定什么，锁到何时"
          ],
          "chapter": "payment",
          "scene": "gb-11",
          "question": [
            "What does the toll secure, and until when?",
            "租赁锁定了什么？锁定到什么时候？"
          ],
          "copy": [
            "In this play an offtaker pays a fixed annual fee and dispatches the battery, while the owner keeps its capacity agreement. Together they secure {securedShare} of first-year modelled revenue, for {securedTenor} years. After the toll, revenue returns to merchant unless a new toll is signed. Until the asset's contract is checked, the toll is a model assumption.",
            "在本方案中，承租方支付固定年费并调度电池，业主保留容量协议。二者合计锁定首年模型收入的{securedShare}，期限{securedTenor}年。租赁到期后，若未签新租赁，收入回归市场化。在核实资产合同之前，租赁只是模型假设。"
          ],
          "meaning": [
            "The toll fixes an agreed fee for its term, subject to counterparty and performance obligations.",
            "租赁在合同期内固定约定费用，同时承担对手方与履约条件风险。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a signed toll, with its counterparty, tenor, dispatch rights, availability deductions and termination terms checked.",
              "已签署的租赁合同，并核实对手方、期限、调度权、可用率扣款和终止条款。"
            ]
          },
          "controls": [
            [
              "During the toll",
              "租赁期内"
            ],
            [
              "After the toll",
              "租赁期后"
            ],
            [
              "Contract checks",
              "合同核查"
            ]
          ],
          "labels": {
            "all": [
              "Fixed toll fee · Capacity agreement · Merchant after the toll · Model assumption, not a signed contract · This play: {securedShare}",
              "固定租赁费 · 容量协议 · 租赁期后承担市场风险 · 模型假设，并非已签合同 · 本方案：{securedShare}"
            ]
          },
          "claims": [
            "CL-GB-16"
          ],
          "extra": {
            "controlText": [
              "During the toll · After the toll · Contract checks",
              "租赁期内 · 租赁期后 · 合同核查"
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
          "id": "gb-12",
          "title": [
            "Why buy it operating",
            "为什么收购在运资产"
          ],
          "chapter": "investment",
          "scene": "gb-12",
          "question": [
            "Why buy an operating battery rather than build one?",
            "为什么收购在运电池，而不是新建？"
          ],
          "copy": [
            "An operating asset already holds its connection and may hold a capacity agreement, so the open queue rules fall on new build. The price decides the case. The card states the entry test: {operatingPrice}. More batteries, narrower spreads, a shorter toll or a weaker counterparty would lower what a fund can pay. Then: {nextAction}.",
            "在运资产已握有并网条件，并可能持有容量协议，因此悬而未决的排队规则主要影响新建项目。价格决定投资是否成立。方案卡列明进入条件：{operatingPrice}。更多电池、价差收窄、租赁期缩短或对手方信用减弱，都会压低基金可支付的价格。随后：{nextAction}。"
          ],
          "meaning": [
            "The call holds only at an entry price that clears the yield with the toll as signed.",
            "只有在按已签租赁条款仍能达到收益率要求的价格进入，这一判断才成立。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the asset's signed toll and capacity agreement, Ofgem's fee decision, or a changed operating-asset price on the card.",
              "资产已签的租赁合同与容量协议、Ofgem的收费决定，或方案卡上在运资产价格的变化。"
            ]
          },
          "controls": [
            [
              "More batteries",
              "更多电池"
            ],
            [
              "Narrower spreads",
              "价差收窄"
            ],
            [
              "Shorter toll",
              "租赁期缩短"
            ],
            [
              "Queue rules",
              "排队规则"
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
          "labels": {
            "all": [
              "More batteries · Narrower spreads · Shorter toll · Queue rules",
              "更多电池 · 价差收窄 · 租赁期缩短 · 排队规则"
            ]
          },
          "claims": [
            "CL-GB-09",
            "CL-GB-13",
            "CL-GB-16"
          ],
          "extra": {
            "controlText": [
              "More batteries · Narrower spreads · Shorter toll · Queue rules · Bankable case · Revenue · Execution · Downside",
              "更多电池 · 价差收窄 · 租赁期缩短 · 排队规则 · 可融资方案 · 收益拆解 · 执行步骤 · 下行风险"
            ]
          }
        }
      ]
    }
  ],
  "editorialOverrides": [
    {
      "shot": "gb-06",
      "field": "marker.level",
      "value": "thin",
      "authority": "Analyst build instruction, 1 November 2026"
    },
    {
      "shot": "gb-11",
      "field": "labels",
      "authority": "G-1 disposition: omit reference secured-share comparison"
    },
    {
      "shot": "gb-05",
      "field": "labels",
      "authority": "GAP-GB-EFR: omit unverified quantitative tender point"
    }
  ]
};
