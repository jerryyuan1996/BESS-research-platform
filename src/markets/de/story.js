/* Germany — G-1 signed off 31 October 2026, including the v1.2 layout.
 * Plain content only. Every figure is a declared binding.
 * de-09 follows the analyst's same-day permission instruction. */
export const story = {
  "storySchemaVersion": 1,
  "contentVersion": "2026-10-31",
  "marketId": "de",
  "systemBoundary": [
    "Germany",
    "德国"
  ],
  "supportedLocales": [
    "en",
    "zh"
  ],
  "playRef": "de-toll-4h",
  "reviewedAgainst": {
    "playRef": "de-toll-4h",
    "hours": 4,
    "call": "opportunistic",
    "on": "2026-10-31"
  },
  "tokens": [
    "researchDate",
    "observedRange",
    "observedInterval",
    "annualFeeLabel",
    "securedYears",
    "openingYear",
    "policyYear",
    "supportDate",
    "buildYear",
    "nuclearDecision",
    "nuclearCompletion",
    "lineOriginalTarget",
    "lineCurrentTarget",
    "playDuration",
    "capacityEffective",
    "preferredDuration",
    "longerDuration",
    "merchantValue",
    "priceReuseLicence",
    "spreadChartLabels",
    "contractExpiryLabel",
    "gridFeeDraft",
    "call"
  ],
  "sources": {
    "SRC-DE-01": {
      "title": "TransnetBW Redispatch, “How it comes to Redispatch”, opening two paragraphs — Rechecked 31 October 2026; undated explanation, not a measured congestion trend or battery revenue entitlement. CL-DE-01 below supplies the payment distinction",
      "url": "https://www.transnetbw.de/en/energy-market/ancillary-services/redispatch"
    },
    "SRC-DE-02": {
      "title": "Netztransparenz Redispatch, “Redispatch measures” and “Requesting and instructing TSO” — Rechecked 31 October 2026; English page is a translation. No aggregate costs, maps or time series copied; no project entitlement inferred",
      "url": "https://www.netztransparenz.de/en/Ancillary-Services/System-operations/Redispatch"
    },
    "SRC-DE-03": {
      "title": "Federal law, EnWG §13a(2), sentences 1–3; §11b(1), (2)(1)(b), (4) — Redispatch compensation includes storage and restores its economic position. Network-storage exceptions have restricted network purposes; they confer no generic merchant trading entitlement",
      "url": "https://www.gesetze-im-internet.de/enwg_2005/__13a.html"
    },
    "SRC-DE-04": {
      "title": "BNetzA, BK4-20-086, signed decision p. 1, operative items 1–2; BK4-21-054A01, pp. 1–3, operative item a and reasons I — Grid-booster investment approval/revenue-cap adjustment; later TenneT lease-to-ownership change with regulated treatment through 2028. Approved network costs are recovered through regulated network revenues/network charges, not a merchant arbitrage premium",
      "url": "https://www.bundesnetzagentur.de/DE/Beschlusskammern/1_GZ/BK4-GZ/2020/BK4-20-0086/BK4-20-0086_Beschluss_DL_BF.pdf?__blob=publicationFile&v=3"
    },
    "SRC-DE-05": {
      "title": "EEX, German Power Markets, opening description of the German Power Future — Liquidity superlative concerns German power futures, not storage assets, toll liquidity or achievable battery margins",
      "url": "https://www.eex.com/en/markets/power/german-power-markets"
    },
    "SRC-DE-06": {
      "title": "Federal legislature, StromVKG heading/date, §§1–6, §12(5)–(6), §74 and Anlage 4; BGBl. 2026 I Nr. 210a, 21 July 2026; Bundestag promulgation/effective-date record — Current capacity legislation exists. Long-duration bids require continuous delivery for 10 hours at 80% of installed power and repeat readiness within 3 hours for energy-limited classes. A standalone four-hour design fails that test. Remuneration requires an obligated provider, not ownership alone",
      "url": "https://www.gesetze-im-internet.de/stromvkg/BJNR0D2AB0026.html"
    },
    "SRC-DE-07": {
      "title": "BNetzA, 21 July 2026 StromVKG notice, opening/auction paragraphs; enacted §4(1), §5, §6 — First long-duration bid date 8 September 2026; notice gives award-announcement deadline 3 November. Current §4 sets the next bid date at 29 December, superseding earlier draft dates. Later rounds are future events, not current reference cash",
      "url": "https://www.bundesnetzagentur.de/SharedDocs/Pressemitteilungen/DE/2026/20260721_StromVKG.html"
    },
    "SRC-DE-08": {
      "title": "Federal economy ministry, “Meilenstein für Versorgungssicherheit”, opening/auction-roadmap paragraphs — Power-plant/capacity strategy progressed to legislation; initial procurement and later mechanism development differ",
      "url": "https://www.bundeswirtschaftsministerium.de/Redaktion/DE/Pressemitteilungen/2026/07/20260710-meilenstein-fuer-versorgungssicherheit.html?view=renderNewsletterHtml"
    },
    "SRC-DE-09": {
      "title": "BNetzA, AgNes draft GBK-25-01-1#3: p. 15 operative 10.1; p. 3 operative 1.2; p. 16 operative 12.1–12.3; pp. 23–24 operative 17.5; p. 155 para. 406 — Standalone storage: annual agreed-connection-capacity charge at the generator capacity-injection tariff; no final EUR/MW/year rate. January's loss-energy approach was dropped. Transition protection and later dynamic charges need separate project checks",
      "url": "https://www.bundesnetzagentur.de/DE/Beschlusskammern/1_GZ/GBK-GZ/2025/GBK-25-01-1x3_AgNes/Downloads/FL-Entwurf_DE_DL_BF.html"
    },
    "SRC-DE-10": {
      "title": "BNetzA, 6 August 2026 AgNes announcement, draft/consultation/timing paragraphs; consultation page, “Konsultation” and update date — Consultation closed 18 September; page still presents a draft and a decision planned for 2026. Search/check on 31 October located no later final AgNes order",
      "url": "https://www.bundesnetzagentur.de/SharedDocs/Pressemitteilungen/DE/2026/20260806_Agnes.html"
    },
    "SRC-DE-11": {
      "title": "BNetzA, Annual Report 2007, printed p. 31, paragraph beginning “The opening of the national energy markets” — Records energy markets as fully liberalised since 1998; not proof liberalisation alone caused today's liquidity",
      "url": "https://www.bundesnetzagentur.de/SharedDocs/Downloads/EN/BNetzA/PressSection/ReportsPublications/2007/AnnualReport2007Id14147pdf.pdf?__blob=publicationFile"
    },
    "SRC-DE-12": {
      "title": "Economy ministry, 14 July 2015 newsletter “Weißbuch: Stromversorgung bleibt sicher und kostengünstig”: opening, “Absicherung durch Kapazitätsreserve”, “Auf Wetterabhängigkeit flexibel reagieren” — Free price formation preferred over a general capacity market, with an out-of-market reserve; storage competes with other flexibility",
      "url": "https://energiewende.bundeswirtschaftsministerium.de/EWD/Redaktion/Newsletter/2015/13/Meldung/weissbuch.html"
    },
    "SRC-DE-13": {
      "title": "Economy ministry, “Fifteenth anniversary of EEG”: opening and “Successful advance of renewables”, first paragraph — EEG commencement; feed-in tariffs, purchase guarantees and priority access supported wind/solar market entry. Not today's battery support route",
      "url": "https://energiewende.bundeswirtschaftsministerium.de/EWD/Redaktion/EN/Newsletter/2015/02/Meldung/15-years-of--eeg.html"
    },
    "SRC-DE-14": {
      "title": "BNetzA, 8 January 2026 renewable expansion release, “Solarenergie” and “Windenergie an Land” — Solar/wind capacity continued expanding. Installed capacity is not delivered energy, dispatchable power or a guaranteed spread",
      "url": "https://www.bundesnetzagentur.de/SharedDocs/Pressemitteilungen/DE/2026/20260108_EEG.html"
    },
    "SRC-DE-15": {
      "title": "Bundestag, 30 June 2011 decisions, “Atomausstieg” paragraph; economy ministry, 13 April 2023 announcement, opening/statutory completion date; BNetzA/SMARD, 20 July 2023 retrospective, “Abschaltung der verbliebenen Kernkraftwerke” — Decision, later extension and completion are different events. Advance announcement supplies the exact date; retrospective confirms completion. Neither isolates a price/spread effect",
      "url": "https://www.bundestag.de/webarchiv/textarchiv/2011/34915890_kw26_angenommen_abgelehnt-205788"
    },
    "SRC-DE-16": {
      "title": "TenneT/TransnetBW, 5 February 2014 SuedLink announcement, opening timetable paragraph; TransnetBW, 29 September 2026 update, opening paragraph — Comparing dated targets establishes delay, not completed operation in 2028 or a single political cause. No route geometry/flow quantity imported",
      "url": "https://www.transnetbw.de/de/newsroom/pressemitteilungen/suedlink-wichtigstes-netzausbauprojekt-der-energiewende-ist-startbereit"
    },
    "SRC-DE-17": {
      "title": "ENTSO-E, Detailed Data Descriptions v2r5, 12 December 2016, printed p. 39 “Day-Ahead Prices”, Art. 12.1.d; area-code analysis v2.1, 20 October 2020, p. 16 Germany / p. 28 Luxembourg — Day-ahead prices by bidding zone/market time unit, currency/MWh; DE-LU EIC `10Y1001A1001A82H`, distinct from the German national area. Not a licence",
      "url": "https://www.entsoe.eu/fileadmin/user_upload/_library/resources/Transparency/02_MoP%20Ref02%20-%20DDD_V2R5.pdf"
    },
    "SRC-DE-18": {
      "title": "EPEX SPOT, 30 September 2025 go-live notice; BNetzA, BK6-25-212 decision, 28 October 2025, footnote 7 — EPEX endpoint returned 403; regulator's footnote independently confirms delivery-date transition and cites it",
      "url": "https://www.epexspot.com/en/news/15-minute-products-live-epex-spot-day-ahead-markets"
    },
    "SRC-DE-19": {
      "title": "ENTSO-E, List of Data Available for Free Re-use, p. 1 licence scope and pp. 2–3 item list; same list on Transparency Platform — CC-BY 4.0 covers enumerated items; day-ahead prices (12.1.d) are absent. Adjacent items do not extend permission to prices or the derived band",
      "url": "https://transparencyplatform.zendesk.com/hc/article_attachments/40921869379729"
    },
    "REPO-DE-LIVE": {
      "title": "This platform's live German briefing, design grid and Revenue results",
      "url": "/markets/germany#revenue"
    }
  },
  "claims": {
    "CL-DE-01": {
      "sources": [
        "SRC-DE-01",
        "SRC-DE-02",
        "SRC-DE-03",
        "SRC-DE-04"
      ]
    },
    "CL-DE-02A": {
      "sources": [
        "SRC-DE-06",
        "SRC-DE-07",
        "SRC-DE-08"
      ]
    },
    "CL-DE-02B": {
      "sources": [
        "SRC-DE-09",
        "SRC-DE-10"
      ]
    },
    "CL-DE-03": {
      "sources": [
        "SRC-DE-05"
      ]
    },
    "CL-DE-04": {
      "sources": [
        "SRC-DE-11",
        "SRC-DE-12"
      ]
    },
    "CL-DE-05": {
      "sources": [
        "SRC-DE-13",
        "SRC-DE-14",
        "SRC-DE-12",
        "SRC-DE-15"
      ]
    },
    "CL-DE-06": {
      "sources": [
        "SRC-DE-15"
      ]
    },
    "CL-DE-07": {
      "sources": [
        "SRC-DE-16"
      ]
    },
    "CL-DE-08": {
      "sources": [
        "SRC-DE-06",
        "SRC-DE-07",
        "SRC-DE-08"
      ]
    },
    "CL-DE-09": {
      "sources": [
        "REPO-DE-LIVE"
      ]
    },
    "CL-DE-10": {
      "sources": [
        "REPO-DE-LIVE"
      ]
    },
    "GAP-DE-PRICES": {
      "sources": [
        "SRC-DE-17",
        "SRC-DE-18",
        "SRC-DE-19"
      ]
    }
  },
  "vocabulary": [
    [
      "Germany",
      "德国"
    ],
    [
      "Infrastructure fund",
      "基础设施基金"
    ],
    [
      "Grid, history and full research context",
      "电网、历史与完整研究背景"
    ],
    [
      "Previous / Next",
      "上一节／下一节"
    ],
    [
      "Open evidence / Close evidence",
      "查看证据／关闭证据"
    ],
    [
      "Source / Checked / Effective / Target",
      "来源／核查日期／生效日期／目标日期"
    ],
    [
      "Event and source / Why it matters",
      "事件与来源／投资含义"
    ],
    [
      "Historical event / Official plan / Scenario",
      "历史事件／官方计划／情景"
    ],
    [
      "Checked today: {researchDate}",
      "核查截至：{researchDate}"
    ],
    [
      "Strong evidence. / Fair evidence. / Thin evidence.",
      "证据充分。／证据尚可。／证据单薄。"
    ],
    [
      "What would change it:",
      "会改变判断的证据："
    ],
    [
      "Example / Schematic / Model assumption",
      "示例／示意图／模型假设"
    ],
    [
      "DE-LU day-ahead · {observedRange} · {observedInterval}",
      "德卢日前价格·{observedRange}·{observedInterval}"
    ],
    [
      "Local delivery date · Europe/Berlin",
      "当地交付日期·柏林时区"
    ],
    [
      "Daily spread index / Lower-to-upper quartile band",
      "每日价差指数／下四分位至上四分位区间"
    ],
    [
      "Hindsight price opportunity, before costs",
      "事后可见的价格机会，未扣成本"
    ],
    [
      "Annual model fee; separate scale",
      "年度模型租赁费；使用独立纵轴"
    ],
    [
      "Model fee · {annualFeeLabel} · {securedYears} years",
      "模型租赁费·{annualFeeLabel}·{securedYears}年"
    ],
    [
      "No complete observation for this day",
      "当日没有完整观察数据"
    ],
    [
      "Observed series awaiting publication clearance; showing an Example",
      "观察序列待确认发布权限；当前展示示例"
    ],
    [
      "Loading evidence / Could not load; retry",
      "正在载入证据／未能载入，重试"
    ],
    [
      "Financial value unavailable",
      "财务数值暂缺"
    ],
    [
      "You can read the full story without motion",
      "无需动画也可阅读完整内容"
    ]
  ],
  "opening": {
    "id": "de-00",
    "chapter": "opening",
    "scene": "thumbnail",
    "title": [
      "The call",
      "投资结论"
    ],
    "question": [
      "What is the call, and what should I do next?",
      "投资结论是什么，下一步做什么？"
    ],
    "copy": [
      "Start with a contracted project. The story explains the market behind the fee.",
      "先找合同已落实的项目，再看这笔租赁费背后的市场。"
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
        "查看投资方案"
      ]
    ],
    "labels": {},
    "extra": {
      "controlText": [
        "Start the story · Go to the investment case",
        "开始阅读 · 查看投资方案"
      ]
    },
    "claims": [
      "CL-DE-10"
    ]
  },
  "chapters": [
    {
      "id": "origins",
      "title": [
        "Origins",
        "市场起点"
      ],
      "shots": [
        {
          "id": "de-01",
          "chapter": "origins",
          "scene": "liquid-market",
          "title": [
            "A market to trade",
            "有市场可交易"
          ],
          "question": [
            "What makes this a merchant opportunity?",
            "这里为什么有市场化交易机会？"
          ],
          "copy": [
            "Germany has a deeply traded power benchmark. A battery can sell flexibility into that market; its revenue still depends on the price and its access.",
            "德国拥有交易活跃的电力基准市场。电池可以向市场出售灵活性，收入仍取决于成交价格和市场准入。"
          ],
          "meaning": [
            "Liquidity offers a route to sell flexibility and attracts competition; it is no project-specific revenue guarantee.",
            "流动性为出售灵活性提供渠道，也会吸引竞争；它并不保证某个项目的收入。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "reviewed evidence on market depth and the project's trading access.",
              "经审核的市场深度证据，以及项目的交易准入条件。"
            ]
          },
          "controls": [
            [
              "Power trading",
              "电力交易"
            ],
            [
              "Battery access",
              "电池准入"
            ]
          ],
          "labels": {},
          "caption": [
            "Schematic",
            "示意图"
          ],
          "extra": {
            "controlText": [
              "Power trading · Battery access",
              "电力交易 · 电池准入"
            ]
          },
          "claims": [
            "CL-DE-03"
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
          "id": "de-02",
          "chapter": "choices",
          "scene": "market-history",
          "title": [
            "Prices carried the signal",
            "价格传递信号"
          ],
          "question": [
            "Why does the battery start with market revenue?",
            "为什么电池先靠市场收入成立？"
          ],
          "copy": [
            "The starting design was competition and energy prices. Markets opened in {openingYear}; the ministry later chose price-led reform in {policyYear}. Today's capacity law needs a separate eligibility test.",
            "市场起点是竞争和电能价格。德国于{openingYear}开放市场，经济部随后于{policyYear}选择以价格信号为核心的改革。如今的容量法仍须单独核查项目资格。"
          ],
          "meaning": [
            "The reference design earns energy/reserve margins unless a separate contract or qualifying capacity route secures income.",
            "除非有独立合同或符合资格的容量机制锁定收入，否则参考设计依靠电能量和备用交易利润。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a new eligible capacity route or a review that changes the historical reading.",
              "出现项目可参与的容量机制，或审核后调整对这段历史的理解。"
            ]
          },
          "controls": [
            [
              "Market opening",
              "市场开放"
            ],
            [
              "Price-led reform",
              "价格机制改革"
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
          "labels": {},
          "extra": {
            "controlText": [
              "Market opening · Price-led reform · expand Event and source or Why it matters",
              "市场开放 · 价格机制改革 · 展开事件与来源或投资含义"
            ]
          },
          "claims": [
            "CL-DE-04",
            "CL-DE-02A"
          ]
        },
        {
          "id": "de-03",
          "chapter": "choices",
          "scene": "renewable-history",
          "title": [
            "Support changed the supply pattern",
            "支持政策改变供给形态"
          ],
          "question": [
            "Why does the time of production matter?",
            "为什么发电时间越来越重要？"
          ],
          "copy": [
            "Wind and solar changed when power arrives. Feed-in support began in {supportDate}; expansion continued in {buildYear}. Storage can move energy between periods.",
            "风电与光伏改变了电力到达市场的时间。上网支持机制于{supportDate}启动，装机扩张持续至{buildYear}。储能可以把电量移到另一个时段。"
          ],
          "meaning": [
            "Variable supply creates flexibility demand; the earned margin remains a price and capture question.",
            "波动的供给产生灵活性需求；赚取多少利润，仍取决于价格及其捕获情况。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "updated build observations and review of the link from production timing to trading opportunity.",
              "更新的装机观察，以及对发电时序如何形成交易机会的审核。"
            ]
          },
          "controls": [
            [
              "Earlier fleet",
              "较早机组结构"
            ],
            [
              "With wind and solar",
              "加入风电与光伏"
            ]
          ],
          "labels": {},
          "caption": [
            "Production changes with weather",
            "发电随天气变化"
          ],
          "extra": {
            "controlText": [
              "Earlier fleet · With wind and solar",
              "较早机组结构 · 加入风电与光伏"
            ]
          },
          "claims": [
            "CL-DE-05"
          ]
        },
        {
          "id": "de-04",
          "chapter": "choices",
          "scene": "fleet-history",
          "title": [
            "The fleet changed",
            "发电结构改变了"
          ],
          "question": [
            "What did the nuclear exit change for this story?",
            "核电退出在这段故事中改变了什么？"
          ],
          "copy": [
            "A changed fleet needs other resources to balance supply. Parliament accelerated the nuclear exit in {nuclearDecision}; the final shutdown came in {nuclearCompletion}.",
            "发电结构改变后，需要其他资源维持供需平衡。议会于{nuclearDecision}决定加快退出核电，最终停运发生在{nuclearCompletion}。"
          ],
          "meaning": [
            "The history explains a changed system; current prices and project economics must carry the battery investment case.",
            "这段历史解释了系统的变化；电池投资方案仍须由当前价格和项目经济性来支撑。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a reviewed causal study that isolates the effect on the battery's relevant price window.",
              "经审核、能够识别核电退出对电池相关价格窗口影响的因果研究。"
            ]
          },
          "controls": [
            [
              "Decision",
              "政策决定"
            ],
            [
              "Completion",
              "完成停运"
            ]
          ],
          "labels": {
            "all": [
              "Decision · Completed · Other generation, imports and flexibility",
              "政策决定 · 已完成 · 其他发电、进口与灵活性资源"
            ]
          },
          "extra": {
            "controlText": [
              "Decision · Completion",
              "政策决定 · 完成停运"
            ]
          },
          "claims": [
            "CL-DE-06"
          ]
        }
      ]
    },
    {
      "id": "tensions",
      "title": [
        "Today's tensions",
        "当前矛盾"
      ],
      "shots": [
        {
          "id": "de-05",
          "chapter": "tensions",
          "scene": "congestion-cost",
          "title": [
            "Congestion is a cost boundary",
            "拥塞体现为成本约束"
          ],
          "question": [
            "Does relieving a bottleneck pay this battery?",
            "缓解电网瓶颈会给这座电池带来收入吗？"
          ],
          "copy": [
            "For this play, congestion is a connection and cost issue. Grid boosters recover costs as regulated network assets. SuedLink's original {lineOriginalTarget} target is now {lineCurrentTarget}.",
            "在该方案中，拥塞体现为并网限制和成本。电网增强型储能按受监管电网资产回收成本。SuedLink原定的{lineOriginalTarget}投运目标，现为{lineCurrentTarget}。"
          ],
          "meaning": [
            "Social/system value does not establish a bankable merchant revenue right.",
            "对社会或电力系统有价值，并不等于拥有可融资的市场化收入权利。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a separately awarded service contract or a change in network-cost rules, verified for the project.",
              "项目取得经核实的独立服务合同，或适用于项目的电网成本规则改变。"
            ]
          },
          "controls": [
            [
              "Physical constraint",
              "物理瓶颈"
            ],
            [
              "Who bears costs",
              "谁承担成本"
            ]
          ],
          "labels": {
            "all": [
              "Connection constraint · Network costs",
              "并网限制 · 电网成本"
            ]
          },
          "caption": [
            "Redispatch compensation restores economic position; it is no recurring profit line in this play.",
            "再调度补偿用于恢复运营方的经济状况，不构成该方案可预期的经常性利润。"
          ],
          "extra": {
            "controlText": [
              "Physical constraint · Who bears costs",
              "物理瓶颈 · 谁承担成本"
            ]
          },
          "claims": [
            "CL-DE-01",
            "CL-DE-07"
          ]
        },
        {
          "id": "de-06",
          "chapter": "tensions",
          "scene": "trading-window",
          "title": [
            "The trading window moves",
            "交易窗口会变化"
          ],
          "question": [
            "How can the same battery face different margins?",
            "同一座电池为什么会面对不同价差？"
          ],
          "copy": [
            "The merchant opportunity is the gap between buying and selling periods. Weather, demand, fuel and other flexibility move that gap; a sunny period alone does not determine the return.",
            "市场化机会来自买电与卖电时段之间的价差。天气、需求、燃料和其他灵活性资源都会改变价差；仅凭阳光充足的时段，不能判断投资回报。"
          ],
          "meaning": [
            "Merchant retains both price upside and compression risk; an observed gross spread is not distributable cash.",
            "市场化运营保留价格上行收益，也承担价差收窄风险；观察到的毛价差并非可分配现金。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a licensed, complete DE-LU series and review of the price-opportunity explanation.",
              "具备使用许可且完整的德卢价格序列，以及对价差机会解释的审核。"
            ]
          },
          "controls": [
            [
              "Sunny",
              "晴朗"
            ],
            [
              "Windy",
              "多风"
            ],
            [
              "Tighter supply",
              "供给偏紧"
            ]
          ],
          "labels": {
            "all": [
              "Example",
              "示例"
            ]
          },
          "caption": [
            "Price opportunity; realised margin depends on operation and costs.",
            "这是价格机会，实际利润取决于运行和成本。"
          ],
          "extra": {
            "controlText": [
              "Sunny · Windy · Tighter supply",
              "晴朗 · 多风 · 供给偏紧"
            ]
          },
          "claims": [
            "CL-DE-05",
            "GAP-DE-PRICES"
          ]
        },
        {
          "id": "de-07",
          "chapter": "tensions",
          "scene": "capacity-route",
          "title": [
            "A future capacity route needs eligibility",
            "未来容量路径先看资格"
          ],
          "question": [
            "Could capacity policy change the play?",
            "容量政策能否改变投资方案？"
          ],
          "copy": [
            "Current long-duration procurement excludes this standalone {playDuration}-hour design. The law took effect on {capacityEffective}. A later eligible award could change the route.",
            "当前长时容量采购不接受这一独立{playDuration}小时设计。相关法律于{capacityEffective}生效。今后若取得符合条件的中标资格，投资路径可能改变。"
          ],
          "meaning": [
            "This design still relies on merchant or toll income; capacity income needs eligibility, an award and fulfilled payment conditions.",
            "这一设计仍依靠市场化或租赁收入；容量收入须先满足资格要求、取得中标，并达到付款条件。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "published rules admitting this design and a project-specific award with obligations and payment terms.",
              "公布允许该设计参与的规则，且项目取得载明义务和付款条款的中标文件。"
            ]
          },
          "controls": [
            [
              "Current eligibility",
              "当前资格"
            ],
            [
              "Future scenario",
              "未来情景"
            ]
          ],
          "labels": {
            "all": [
              "Scenario: qualification and award required",
              "情景：须符合资格并中标"
            ]
          },
          "extra": {
            "controlText": [
              "Current eligibility · Future scenario",
              "当前资格 · 未来情景"
            ]
          },
          "claims": [
            "CL-DE-02A",
            "CL-DE-08"
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
          "id": "de-08",
          "chapter": "battery",
          "scene": "duration",
          "title": [
            "Buy the hours that add value",
            "购买能增加价值的时长"
          ],
          "question": [
            "Why the selected duration rather than a longer battery?",
            "为什么选这个时长，而不做得更长？"
          ],
          "copy": [
            "The current merchant design grid favours {preferredDuration} hours over {longerDuration}. Extra energy can earn more, but its added earnings do not justify its added cost in this model.",
            "当前市场化设计矩阵更看好{preferredDuration}小时，而非{longerDuration}小时。增加电量可以增加收入，但在本模型中，新增收益不足以覆盖新增成本。"
          ],
          "meaning": [
            "The duration is an economic choice under current assumptions, not a technical rule that a longer battery cannot earn.",
            "时长是在当前假设下的经济选择，并不存在更长的电池无法赚取收入这样的技术规则。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "different duration costs or revenue capture that changes the existing grid's preferred cell.",
              "时长成本或收入捕获能力改变，使现有矩阵的最优单元变化。"
            ]
          },
          "controls": [
            [
              "{preferredDuration} h merchant",
              "{preferredDuration}小时市场化"
            ],
            [
              "{longerDuration} h merchant",
              "{longerDuration}小时市场化"
            ]
          ],
          "labels": {
            "all": [
              "Model value: {merchantValue}",
              "模型价值：{merchantValue}"
            ]
          },
          "extra": {
            "controlText": [
              "{preferredDuration} h merchant · {longerDuration} h merchant",
              "{preferredDuration}小时市场化 · {longerDuration}小时市场化"
            ]
          },
          "claims": [
            "CL-DE-09"
          ]
        }
      ]
    },
    {
      "id": "payment",
      "title": [
        "Who pays",
        "谁来付款"
      ],
      "shots": [
        {
          "id": "de-09",
          "chapter": "payment",
          "scene": "spread-toll",
          "title": [
            "Merchant or toll?",
            "市场化还是租赁？ （signature chart / 核心图表）"
          ],
          "question": [
            "Why accept a lower reference return for a toll?",
            "为什么接受回报较低的租赁参考方案？"
          ],
          "copy": [
            "The toll buys contractual revenue during its term. Merchant keeps the changing trading margin. The published toll reference earns less; the fund asks for a signed contract before pricing.",
            "租赁在合同期内换取约定收入，市场化运营则保留波动的交易利润。已发布的租赁参考方案回报更低；基金在定价前要求合同落实。"
          ],
          "meaning": [
            "A toll transfers price exposure on agreed terms.",
            "租赁按约定条款转移价格风险。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "owner permission from EPEX SPOT, or SMARD releasing wholesale prices under {priceReuseLicence} once the HEDWIG review ends; verified toll terms and review of the comparison's units and entry stages.",
              "取得EPEX SPOT的数据所有者许可，或在HEDWIG审查结束后由SMARD以{priceReuseLicence}发布批发电价；并核实租赁条款、审核比较的单位与进入阶段。"
            ]
          },
          "controls": [
            [
              "Merchant",
              "市场化"
            ],
            [
              "Toll",
              "租赁"
            ],
            [
              "How measured",
              "如何计算"
            ]
          ],
          "labels": {
            "all": [
              "Daily spread index · EUR/MWh · {spreadChartLabels}; Reference annual toll fee · USD/MW/year · {annualFeeLabel}",
              "每日价差指数·欧元／MWh · {spreadChartLabels}；参考年度租赁费·美元／MW／年 · {annualFeeLabel}"
            ]
          },
          "caption": [
            "Example: changing margin and fixed fee",
            "示例：波动利润与固定租赁费"
          ],
          "extra": {
            "controlText": [
              "Merchant · Toll · How measured. Toggle changes emphasis only; both unit labels remain visible",
              "市场化 · 租赁 · 如何计算。切换仅改变强调内容；两个单位标签始终可见"
            ]
          },
          "claims": [
            "CL-DE-10",
            "GAP-DE-PRICES"
          ]
        },
        {
          "id": "de-10",
          "chapter": "payment",
          "scene": "toll-term",
          "title": [
            "Certainty has a term",
            "确定性有期限"
          ],
          "question": [
            "What remains exposed after signing a toll?",
            "签下租赁合同后，哪些风险仍然存在？"
          ],
          "copy": [
            "The reference fee lasts {securedYears} years, then the model returns to merchant. Check who dispatches, who pays charging and network costs, and what reduces the fee.",
            "参考租赁费锁定{securedYears}年，随后模型回到市场化收入。要核查调度权归谁、充电和电网成本由谁承担，以及哪些情形会扣减租赁费。"
          ],
          "meaning": [
            "Certainty is limited by enforceability, counterparty, performance and tenor. A shorter actual toll exposes more of the holding period to merchant conditions.",
            "确定性受到合同可执行性、对手方、履约和期限的限制。实际租赁期较短，会使持有期内更多时间暴露于市场化条件。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "an executed contract showing tenor, security, deductions and costs different from the reference.",
              "已签合同中的期限、担保、扣款和成本分担与参考假设不同。"
            ]
          },
          "controls": [
            [
              "During the term",
              "合同期内"
            ],
            [
              "After expiry",
              "到期之后"
            ],
            [
              "Contract checks",
              "合同核查"
            ]
          ],
          "labels": {
            "all": [
              "Contractual fee · {contractExpiryLabel} · Merchant assumption · Counterparty · availability · deductions · dispatch rights · cost allocation",
              "约定租赁费 · {contractExpiryLabel} · 市场化假设 · 对手方·可用率·扣款·调度权·成本分担"
            ]
          },
          "extra": {
            "controlText": [
              "During the term · After expiry · Contract checks",
              "合同期内 · 到期之后 · 合同核查"
            ]
          },
          "claims": [
            "CL-DE-10"
          ]
        }
      ]
    },
    {
      "id": "investment",
      "title": [
        "The investment",
        "投资落点"
      ],
      "shots": [
        {
          "id": "de-11",
          "chapter": "investment",
          "scene": "network-fees",
          "title": [
            "Price the network cost",
            "先明确电网成本"
          ],
          "question": [
            "What is still open in the grid-fee draft?",
            "电网费草案还有哪些未定事项？"
          ],
          "copy": [
            "Price the project's network exposure before buying. The draft dated {gridFeeDraft} would charge standalone storage for agreed connection capacity. The final rate and transition treatment still need checking.",
            "收购前，先明确项目的电网成本敞口。{gridFeeDraft}的草案拟按约定并网容量向独立储能收费。最终费率和过渡安排仍须核查。"
          ],
          "meaning": [
            "A new annual cost can weaken merchant value or contract economics depending on cost allocation. Transition protection must be evidenced on the actual project.",
            "新增年度成本可能削弱市场化价值或合同经济性，影响取决于成本分担。实际项目的过渡保护安排必须有证据支持。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the final AgNes decision and written project-specific charging and transition treatment.",
              "AgNes最终决定，以及项目收费和过渡安排的书面确认。"
            ]
          },
          "controls": [
            [
              "Draft charge",
              "草案收费"
            ],
            [
              "Transition checks",
              "过渡安排核查"
            ]
          ],
          "labels": {
            "all": [
              "Agreed connection capacity · Final decision pending · Connection terms · investment decision · exemption evidence · dynamic charges · contract allocation",
              "约定并网容量 · 待最终决定 · 并网条款·投资决定·豁免证据·动态收费·合同分担"
            ]
          },
          "extra": {
            "controlText": [
              "Draft charge · Transition checks",
              "草案收费 · 过渡安排核查"
            ]
          },
          "claims": [
            "CL-DE-02B"
          ]
        },
        {
          "id": "de-12",
          "chapter": "investment",
          "scene": "handoff",
          "title": [
            "Carry the decision into the case",
            "把判断带入投资方案"
          ],
          "question": [
            "What would weaken the call, and where do I check it?",
            "什么会削弱判断，该到哪里核查？"
          ],
          "copy": [
            "Keep the live call: {call}. Advance a contracted case only after pricing network costs, testing tighter spreads and checking the actual toll term. Continue into the investment case.",
            "沿用当前结论：{call}。推进已落实合同的项目之前，要明确电网成本、检验价差收窄的影响，并核实实际租赁期限。接着查看投资方案。"
          ],
          "meaning": [
            "Fees, lower captured margins or less contract coverage can remove the reason to accept this reference valuation.",
            "费用、实际捕获利润下降或合同保障减少，都可能使接受这一参考估值的理由不再成立。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a different live call, final network costs, narrower captured spreads or an executed toll with different protection.",
              "当前投资结论改变、电网成本落定、实际可捕获价差收窄，或已签租赁提供不同程度的保障。"
            ]
          },
          "controls": [
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
            ],
            [
              "Back to the play",
              "返回方案卡"
            ]
          ],
          "labels": {
            "all": [
              "Grid fees · Spread compression · Shorter toll",
              "电网费 · 价差收窄 · 租赁期限缩短"
            ]
          },
          "extra": {
            "controlText": [
              "Links to Bankable case · Revenue · Execution · Downside. Back to the play",
              "链接到可融资方案 · 收益拆解 · 执行步骤 · 下行风险。返回方案卡"
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
          },
          "claims": [
            "CL-DE-02B",
            "CL-DE-09",
            "CL-DE-10"
          ]
        }
      ]
    }
  ]
};
