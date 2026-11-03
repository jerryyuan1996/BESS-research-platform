/* Approved bilingual storyboard tables; caiso-03 timing amendment approved 3 November 2026.
   caiso-05 comparison withheld under GAP-CAISO-DAY. Opening map omitted by analyst approval. */
export const story = {
  "storySchemaVersion": 1,
  "contentVersion": "2026-11-03",
  "marketId": "caiso",
  "systemBoundary": [
    "CAISO balancing area",
    "CAISO平衡区"
  ],
  "supportedLocales": [
    "en",
    "zh"
  ],
  "playRef": "caiso-cap-4h",
  "reviewedAgainst": {
    "playRef": "caiso-cap-4h",
    "hours": 4,
    "call": "opportunistic",
    "lens": "infraFund",
    "on": "2026-11-02",
    "commit": "474766e07ff78a20a57e0a999a3da05c0a62dbf3"
  },
  "tokens": [
    "call",
    "play",
    "cardFigures",
    "nextAction",
    "qcBasisHours",
    "crisisPeriod",
    "qcDecisionYear",
    "qcEffectiveYear",
    "playDuration",
    "outageDates",
    "mtrNqc",
    "mtrMinTerm",
    "fleet2020",
    "fleetDec2024",
    "fleetLatest",
    "bestDuration",
    "buildLine",
    "shortHours",
    "longHours",
    "entryRoute",
    "securedShare",
    "securedTenor",
    "holdReturn",
    "targetReturn",
    "operatingTarget",
    "operatingPriceCeiling",
    "buildCapex"
  ],
  "sources": {
    "SRC-CAISO-01": {
      "title": "CPUC, D.04-10-035, Interim Opinion Regarding Resource Adequacy, R.04-04-003; §2.1 \"The RAR Framework\"",
      "url": "https://docs.cpuc.ca.gov/published/Final_decision/41416.htm",
      "locator": "CPUC, [D.04-10-035, Interim Opinion Regarding Resource Adequacy, R.04-04-003](https://docs.cpuc.ca.gov/published/Final_decision/41416.htm); [§2.1 \"The RAR Framework\"](https://docs.cpuc.ca.gov/published/Final_decision/41416-01.htm)",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-02": {
      "title": "CPUC, D.06-04-040, §1 \"Compliance With Section 380\"",
      "url": "https://docs.cpuc.ca.gov/published/Final_decision/55661-02.htm",
      "locator": "CPUC, [D.06-04-040, §1 \"Compliance With Section 380\"](https://docs.cpuc.ca.gov/published/Final_decision/55661-02.htm)",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-03": {
      "title": "CPUC, Resource Adequacy Homepage",
      "url": "https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-power-procurement/resource-adequacy-homepage",
      "locator": "CPUC, [Resource Adequacy Homepage](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-power-procurement/resource-adequacy-homepage)",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-04": {
      "title": "CAISO, *What the duck curve tells us about managing a green grid*, Fast Facts, CommPR/2016, p. 1",
      "url": "https://www.caiso.com/Documents/FlexibleResourcesHelpRenewables_FastFacts.pdf",
      "locator": "CAISO, [*What the duck curve tells us about managing a green grid*, Fast Facts, CommPR/2016](https://www.caiso.com/Documents/FlexibleResourcesHelpRenewables_FastFacts.pdf), p. 1",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-05": {
      "title": "CAISO, CPUC and CEC, *Final Root Cause Analysis: Mid-August 2020 Extreme Heat Wave*, Executive Summary, p. 4",
      "url": "https://www.caiso.com/Documents/Final-Root-Cause-Analysis-Mid-August-2020-Extreme-Heat-Wave.pdf",
      "locator": "CAISO, CPUC and CEC, [*Final Root Cause Analysis: Mid-August 2020 Extreme Heat Wave*](https://www.caiso.com/Documents/Final-Root-Cause-Analysis-Mid-August-2020-Extreme-Heat-Wave.pdf), Executive Summary, p. 4",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-06": {
      "title": "CPUC, D.13-10-040, R.10-12-007, Summary, p. 2",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M079/K533/79533378.PDF",
      "locator": "CPUC, [D.13-10-040, R.10-12-007](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M079/K533/79533378.PDF), Summary, p. 2",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-07": {
      "title": "CPUC, D.14-06-050, Appendix B, §13.1, p. B-9",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M097/K619/97619935.PDF",
      "locator": "CPUC, [D.14-06-050](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M097/K619/97619935.PDF), Appendix B, §13.1, p. B-9",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-08": {
      "title": "CPUC, D.21-06-035, Decision Requiring Procurement to Address Mid-Term Reliability (2023-2026), R.20-05-003, Summary p. 2; p. 70",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M389/K603/389603637.PDF",
      "locator": "CPUC, [D.21-06-035, Decision Requiring Procurement to Address Mid-Term Reliability (2023-2026), R.20-05-003](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M389/K603/389603637.PDF), Summary p. 2; p. 70",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-09": {
      "title": "CPUC, D.22-06-050, Appendix A, \"24-Hour Slice Framework\", R.21-10-002, sections A and B.2",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M488/K540/488540634.PDF",
      "locator": "CPUC, [D.22-06-050, Appendix A, \"24-Hour Slice Framework\", R.21-10-002](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M488/K540/488540634.PDF), sections A and B.2",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-10": {
      "title": "CPUC, D.26-07-008, Decision Adopting Local Capacity Obligations for 2027-2029, Flexible Capacity Obligations for 2027, and Program Refinements, R.25-10-003: §4.4.1 pp. 19–21; §4.4.1.3 pp. 26–28; §4.4.3.3 pp. 48–51; §4.6.3 pp. 84–86; p. 177; Ordering Paragraph 6, p. 197. Fact sheet, pp. 1–2",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M610/K575/610575803.PDF",
      "locator": "CPUC, [D.26-07-008, Decision Adopting Local Capacity Obligations for 2027-2029, Flexible Capacity Obligations for 2027, and Program Refinements, R.25-10-003](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M610/K575/610575803.PDF): §4.4.1 pp. 19–21; §4.4.1.3 pp. 26–28; §4.4.3.3 pp. 48–51; §4.6.3 pp. 84–86; p. 177; Ordering Paragraph 6, p. 197. [Fact sheet](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/resource-adequacy-homepage/oga-fact-sheet-on-track-1-final-decision-v2.pdf), pp. 1–2",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-11": {
      "title": "CAISO Department of Market Monitoring, *2024 Special Report on Battery Storage*: key findings p. 4; §2.10.1 pp. 28–29",
      "url": "https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf",
      "locator": "CAISO Department of Market Monitoring, [*2024 Special Report on Battery Storage*](https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf): key findings p. 4; §2.10.1 pp. 28–29",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-12": {
      "title": "CAISO Department of Market Monitoring, *2025 Annual Report on Market Issues and Performance*: pp. 2–3, 13–14, 23, 82 and 316 (Table 16.7)",
      "url": "https://www.caiso.com/documents/2025-annual-report-on-market-issues-and-performance.pdf",
      "locator": "CAISO Department of Market Monitoring, [*2025 Annual Report on Market Issues and Performance*](https://www.caiso.com/documents/2025-annual-report-on-market-issues-and-performance.pdf): pp. 2–3, 13–14, 23, 82 and 316 (Table 16.7)",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-13": {
      "title": "CAISO, *2026 Summer Loads and Resources Assessment*, Executive Summary p. 1; §1.1",
      "url": "https://www.caiso.com/documents/2026-summer-loads-and-resources-assessment.pdf",
      "locator": "CAISO, [*2026 Summer Loads and Resources Assessment*](https://www.caiso.com/documents/2026-summer-loads-and-resources-assessment.pdf), Executive Summary p. 1; §1.1",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-14": {
      "title": "California Energy Commission, news release, 4 May 2026",
      "url": "https://www.energy.ca.gov/news/2026-05/california-energy-leaders-report-progress-grid-reliability-ahead-summer-2026",
      "locator": "California Energy Commission, [news release, 4 May 2026](https://www.energy.ca.gov/news/2026-05/california-energy-leaders-report-progress-grid-reliability-ahead-summer-2026)",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-15": {
      "title": "CPUC Energy Division, *Market Price Benchmark Calculations 2026*, Tables 1 and 2, p. 1; RA Adder method, pp. 2–3",
      "url": "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/community-choice-aggregation-and-direct-access/2026-market-price-benchmarks.pdf",
      "locator": "CPUC Energy Division, [*Market Price Benchmark Calculations 2026*](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/community-choice-aggregation-and-direct-access/2026-market-price-benchmarks.pdf), Tables 1 and 2, p. 1; RA Adder method, pp. 2–3",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-16": {
      "title": "CPUC Energy Division, *2023 Resource Adequacy Report*, executive summary p. 4; §4.1, Table 7 (p. 26) and Figure 4",
      "url": "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/resource-adequacy-homepage/2023-ra-reportv3.pdf",
      "locator": "CPUC Energy Division, [*2023 Resource Adequacy Report*](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/resource-adequacy-homepage/2023-ra-reportv3.pdf), executive summary p. 4; §4.1, Table 7 (p. 26) and Figure 4",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-17": {
      "title": "CAISO Tariff, Appendix KK, Resource Interconnection Standards, §8.9",
      "url": "https://www.caiso.com/documents/appendix-kk-resource-interconnection-standards-as-of-jun-25-2025.pdf",
      "locator": "CAISO Tariff, [Appendix KK, Resource Interconnection Standards](https://www.caiso.com/documents/appendix-kk-resource-interconnection-standards-as-of-jun-25-2025.pdf), §8.9",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-18": {
      "title": "CAISO, Today's Outlook history: daily `netdemand.csv` and `fuelsource.csv`, e.g. `/outlook/history/20250715/netdemand.csv`",
      "url": "https://www.caiso.com/outlook/history/20250715/netdemand.csv",
      "locator": "CAISO, Today's Outlook history: daily `netdemand.csv` and `fuelsource.csv`, e.g. [`/outlook/history/20250715/netdemand.csv`](https://www.caiso.com/outlook/history/20250715/netdemand.csv)",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-19": {
      "title": "CAISO, Privacy Notice and Terms of Use, \"Restrictions on Use of Materials\" and \"API Terms of Use\"",
      "url": "https://www.caiso.com/privacy-terms-of-use",
      "locator": "CAISO, [Privacy Notice and Terms of Use](https://www.caiso.com/privacy-terms-of-use), \"Restrictions on Use of Materials\" and \"API Terms of Use\"",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-20": {
      "title": "U.S. EIA, Form EIA-930 six-month balance files, CAISO rows: `EIA930_BALANCE_2025_Jul_Dec.csv` and the 2020 file. Also EIA-860M, the monthly generator inventory, through REPO-CAISO-DG2",
      "url": "https://www.eia.gov/electricity/gridmonitor/sixMonthFiles/EIA930_BALANCE_2025_Jul_Dec.csv",
      "locator": "U.S. EIA, Form EIA-930 six-month balance files, CAISO rows: [`EIA930_BALANCE_2025_Jul_Dec.csv`](https://www.eia.gov/electricity/gridmonitor/sixMonthFiles/EIA930_BALANCE_2025_Jul_Dec.csv) and the 2020 file. Also EIA-860M, the monthly generator inventory, through REPO-CAISO-DG2",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-21": {
      "title": "U.S. EIA, Copyrights and Reuse",
      "url": "https://www.eia.gov/about/copyrights_reuse.php",
      "locator": "U.S. EIA, [Copyrights and Reuse](https://www.eia.gov/about/copyrights_reuse.php)",
      "checkedOn": "2026-10-31"
    },
    "SRC-CAISO-22": {
      "title": "A utility's 2027 ERRA Fall Update testimony, A.26-05-007, p. 12",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/SupDoc/A2605007/9872/623865860.pdf",
      "locator": "A utility's 2027 ERRA Fall Update testimony, [A.26-05-007](https://docs.cpuc.ca.gov/PublishedDocs/SupDoc/A2605007/9872/623865860.pdf), p. 12",
      "checkedOn": "2026-10-31"
    },
    "REPO-CAISO-LIVE": {
      "title": "Reviewed live market fields",
      "url": "https://github.com/jerryyuan1996/BESS-research-platform/blob/main/view/markets/caiso.json",
      "locator": "Selected infraFund row; live result bindings",
      "checkedOn": "2026-11-02"
    }
  },
  "claims": {
    "CL-CAISO-SHOT-00": {
      "sources": [
        "REPO-CAISO-LIVE"
      ]
    },
    "CL-CAISO-SHOT-01": {
      "sources": [
        "SRC-CAISO-01",
        "SRC-CAISO-02",
        "SRC-CAISO-03",
        "SRC-CAISO-12"
      ]
    },
    "CL-CAISO-SHOT-02": {
      "sources": [
        "SRC-CAISO-04",
        "SRC-CAISO-05"
      ]
    },
    "CL-CAISO-SHOT-03": {
      "sources": [
        "SRC-CAISO-07",
        "SRC-CAISO-11",
        "SRC-CAISO-10",
        "SRC-CAISO-06"
      ]
    },
    "CL-CAISO-SHOT-04": {
      "sources": [
        "SRC-CAISO-05",
        "SRC-CAISO-08",
        "SRC-CAISO-11"
      ]
    },
    "CL-CAISO-SHOT-05": {
      "sources": [
        "SRC-CAISO-11",
        "SRC-CAISO-12",
        "SRC-CAISO-18",
        "SRC-CAISO-19"
      ]
    },
    "CL-CAISO-SHOT-06": {
      "sources": [
        "SRC-CAISO-12",
        "SRC-CAISO-13",
        "SRC-CAISO-14",
        "SRC-CAISO-15",
        "SRC-CAISO-16"
      ]
    },
    "CL-CAISO-SHOT-07": {
      "sources": [
        "SRC-CAISO-09",
        "SRC-CAISO-11",
        "SRC-CAISO-10",
        "SRC-CAISO-22"
      ]
    },
    "CL-CAISO-SHOT-08": {
      "sources": [
        "REPO-CAISO-LIVE"
      ]
    },
    "CL-CAISO-SHOT-09": {
      "sources": [
        "SRC-CAISO-07",
        "SRC-CAISO-17"
      ]
    },
    "CL-CAISO-SHOT-10": {
      "sources": [
        "SRC-CAISO-08",
        "SRC-CAISO-11",
        "SRC-CAISO-12"
      ]
    },
    "CL-CAISO-SHOT-11": {
      "sources": [
        "SRC-CAISO-11",
        "SRC-CAISO-09"
      ]
    },
    "CL-CAISO-SHOT-12": {
      "sources": [
        "REPO-CAISO-LIVE"
      ]
    },
    "CL-CAISO-SHOT-13": {
      "sources": [
        "REPO-CAISO-LIVE"
      ]
    }
  },
  "opening": {
    "id": "caiso-00",
    "chapter": "opening",
    "scene": "caiso-00",
    "question": [
      "What is the call here, and why should I read on?",
      "这里的投资判断是什么？为什么值得读下去？"
    ],
    "copy": [
      "The existing play card: {call}, {play}, {cardFigures}, {nextAction}. Beneath it: \"Why: a capacity rule that counts {qcBasisHours} hours, an evening that solar created, and a battery fleet that now carries a large part of it.\"",
      "沿用现有投资方案卡：{call}、{play}、{cardFigures}、{nextAction}。卡片下方一行：“原因在于：一条按{qcBasisHours}小时计量容量的规则、一个由光伏造就的傍晚，以及如今已承担其中很大一部分的电池机组。”"
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
      "CL-CAISO-SHOT-00"
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
          "id": "caiso-01",
          "chapter": "origins",
          "scene": "caiso-01",
          "question": [
            "How does California pay for reliability?",
            "加州如何为可靠性付费？"
          ],
          "copy": [
            "By contract, not by auction. After the {crisisPeriod} electricity crisis, the CPUC required every electricity retailer it regulates to secure its own capacity ahead of time. The legislature confirmed the rule in 2005, and the first system requirements took effect on 1 June 2006.",
            "靠合同，而不是靠拍卖。{crisisPeriod}年电力危机之后，加州公用事业委员会（CPUC）要求其监管的每一家售电主体提前自行落实所需容量。州议会于2005年以立法确认这一规则，首批系统容量要求于2006年6月1日生效。"
          ],
          "meaning": [
            "There is no clearing price: a battery's capacity income is whatever its contract with a retailer says.",
            "这里没有统一的出清价格：电池的容量收入取决于它与售电主体签订的合同。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a CPUC decision that replaces retailer-by-retailer contracting with a central capacity auction.",
              "CPUC作出决定，以集中容量拍卖取代各售电主体分别签约。"
            ]
          },
          "controls": [
            [
              "Before 2006",
              "2006年之前"
            ],
            [
              "From 2006",
              "2006年起"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-01"
          ]
        },
        {
          "id": "caiso-02",
          "chapter": "origins",
          "scene": "caiso-02",
          "question": [
            "When is California's grid hardest to run?",
            "加州电网什么时候最难运行？"
          ],
          "copy": [
            "After sunset. Solar carries the middle of the day, then fades while homes and offices still draw power. What the rest of the system must serve, demand minus wind and solar, peaks in the early evening. CAISO calls the shape the duck curve.",
            "在日落之后。光伏撑起白天，但在住户和办公楼仍在用电时逐渐退场。其余电源需要承担的负荷——即需求减去风电和光伏——在傍晚早些时候达到峰值。CAISO把这条曲线称为“鸭子曲线”。"
          ],
          "meaning": [
            "The value of capacity moved to the evening: the hours a battery can fill with midday solar.",
            "容量的价值转移到了傍晚，而这正是电池可以用午间光伏电量来填补的时段。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a CAISO assessment showing the tightest hours moving back into the afternoon.",
              "CAISO的评估显示最紧张的时段重新回到午后。"
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
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-02"
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
          "id": "caiso-03",
          "chapter": "choices",
          "scene": "caiso-03",
          "question": [
            "Why are California's batteries {qcBasisHours} hours long?",
            "为什么加州的电池是{qcBasisHours}小时的？"
          ],
          "copy": [
            "Because that is what RA counts. Under the CPUC’s {qcDecisionYear} decision, effective for the {qcEffectiveYear} RA year, a battery is credited at the output it can hold for {qcBasisHours} hours without a break. A shorter battery is counted as a smaller one; a longer one gets no extra credit. Utilities were already under orders to buy storage, so the fleet was built to the rule.",
            "因为资源充裕度（RA）就是这样计量的。根据CPUC于{qcDecisionYear}年作出、从{qcEffectiveYear}年RA年度起生效的决定，电池按其能够不间断持续{qcBasisHours}小时的出力获得容量信用。时长较短的电池只能按一台更小的电池计算，时长更长的电池也拿不到额外信用。当时公用事业公司已被要求采购储能，于是整个机组群就按这条规则来建设。"
          ],
          "meaning": [
            "The rule sets this play's {playDuration} hours: the market rewards meeting it, not beating it.",
            "这条规则决定了本方案的{playDuration}小时时长：市场奖励的是达到这一标准，而不是超越它。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a CPUC decision changing the {qcBasisHours}-hour basis of storage credit, which the current RA proceeding has left open.",
              "CPUC作出改变储能信用{qcBasisHours}小时基准的决定——当前的RA程序仍把这一问题留待处理。"
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
            "CL-CAISO-SHOT-03"
          ]
        },
        {
          "id": "caiso-04",
          "chapter": "choices",
          "scene": "caiso-04",
          "question": [
            "What turned {qcBasisHours}-hour batteries from a pilot into a fleet?",
            "是什么让{qcBasisHours}小时电池从试点变成了规模化的机组群？"
          ],
          "copy": [
            "The evening of August 2020. The rotating outages of {outageDates} came after the afternoon peak, during the net peak, and the state's review found that planning had not kept pace with the early evening. In 2021 the CPUC ordered {mtrNqc} MW of new capacity on contracts of at least {mtrMinTerm} years. The battery fleet grew from about {fleet2020} MW in 2020 to about {fleetDec2024} MW by the end of 2024.",
            "是2020年8月的那个傍晚。{outageDates}的轮流停电发生在午后用电高峰之后、净负荷峰值期间；州政府的复盘认定，规划未能跟上傍晚时段的需要。2021年，CPUC下令采购{mtrNqc}MW新增容量，合同期至少{mtrMinTerm}年。电池机组规模从2020年的约{fleet2020}MW，增长到2024年底的约{fleetDec2024}MW。"
          ],
          "meaning": [
            "Batteries built in that wave can carry long RA contracts: the kind of asset this play buys.",
            "这一轮建成的电池可能附带长期RA合同，而这正是本方案要收购的资产类型。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a CPUC count of the 2021 order's procurement by technology.",
              "CPUC按技术类型统计的2021年采购命令落实情况。"
            ]
          },
          "controls": [
            [
              "August 2020",
              "2020年8月"
            ],
            [
              "After the orders",
              "采购命令之后"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-04"
          ]
        }
      ]
    },
    {
      "id": "tensions",
      "title": [
        "Today’s tensions",
        "当下的矛盾"
      ],
      "shots": [
        {
          "id": "caiso-05",
          "chapter": "tensions",
          "scene": "caiso-05",
          "question": [
            "Who carries California's evening now?",
            "如今由谁来分担加州的傍晚？"
          ],
          "copy": [
            "More and more, batteries. They charge on midday solar and discharge into the evening, when net load is highest, and now supply a significant share of it; by the end of 2025 the CAISO area had over {fleetLatest} MW of them.",
            "越来越多地由电池分担。电池在中午用光伏电量充电，在净负荷最高的傍晚放电，如今已提供其中相当大的一部分；截至2025年底，CAISO区域的电池规模已超过{fleetLatest}MW。"
          ],
          "meaning": [
            "The evening that made {qcBasisHours}-hour batteries valuable is now shared by a large fleet of them, so each new one competes for the same hours.",
            "让{qcBasisHours}小时电池变得有价值的傍晚，如今已由一大批电池共同分担，因此每一台新电池都在争夺同样的时段。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a registered hourly series from CAISO, showing the median summer day for each year.",
              "完成登记的CAISO小时数据序列，逐年展示夏季中位日。"
            ]
          },
          "controls": [
            [
              "Summer 2020",
              "2020年夏季"
            ],
            [
              "Summer 2025",
              "2025年夏季"
            ],
            [
              "Show the {qcBasisHours} hours RA counts",
              "显示RA计入的{qcBasisHours}个小时"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-05"
          ]
        },
        {
          "id": "caiso-06",
          "chapter": "tensions",
          "scene": "caiso-06",
          "question": [
            "Is California still short of evening capacity?",
            "加州傍晚的容量还短缺吗？"
          ],
          "copy": [
            "The platform reads {qcBasisHours}-hour RA as largely met at system level: the 2025 peak was covered, scarcity shifted towards spring, and the 2026 summer assessment showed a surplus above the reliability standard. This is an interpretation of those observations, not a CPUC finding that every location or month has enough capacity.",
            "平台判断，全系统层面的{qcBasisHours}小时RA需求已大体满足：2025年峰值获得覆盖，紧张时段向春季转移，2026年夏季评估也显示高于可靠性标准的容量盈余。这是对上述事实的解释，并非CPUC认定每个地点、每个月份都已容量充足。"
          ],
          "meaning": [
            "An operating asset’s deliverability, contract and purchase price decide the case even where the system has surplus capacity.",
            "即使全系统容量有盈余，在运资产的可交付能力、合同和买入价格仍决定投资是否成立。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "RA contract prices for 2027 to 2029 deliveries rising again in the CPUC's data.",
              "CPUC数据显示2027至2029年交付的RA合同价格重新上涨。"
            ]
          },
          "controls": [
            [
              "Summer evening",
              "夏季傍晚"
            ],
            [
              "Spring evening",
              "春季傍晚"
            ],
            [
              "Local constraints",
              "本地约束"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-06"
          ]
        },
        {
          "id": "caiso-07",
          "chapter": "tensions",
          "scene": "caiso-07",
          "question": [
            "What do the new counting rules change?",
            "新的计量规则改变了什么？"
          ],
          "copy": [
            "Two things. Since 2025, retailers must show capacity for every hour of each month's worst day, plus spare energy to charge their batteries, so a battery counts only in the hours it can really cover. From 2027, a battery is credited only for the power it can hold for {qcBasisHours} hours before its output folds back as it nears empty; from 2028, each unit is also judged on its outage record.",
            "有两点。自2025年起，售电主体须为每月“最严峻日”的每一个小时申报容量，并留足为电池充电的富余电量，因此电池只在它真正能覆盖的时段计入。自2027年起，电池只能按其在接近放空、出力回落之前可持续{qcBasisHours}小时的功率获得信用；自2028年起，每台机组还要按其停运记录核定。"
          ],
          "meaning": [
            "The same battery may sell fewer MW of RA from 2027, by an amount not yet known. That is why the play waits.",
            "同一台电池自2027年起可出售的RA容量可能减少，减少多少尚不可知。这正是本方案选择等待的原因。"
          ],
          "marker": {
            "level": "strong",
            "change": [
              "a CPUC decision that delays or reverses the 2027 change.",
              "CPUC作出推迟或撤销2027年变更的决定。"
            ]
          },
          "controls": [
            [
              "Before 2025",
              "2025年之前"
            ],
            [
              "Slice of day (2025)",
              "分时段（2025年）"
            ],
            [
              "Foldback (2027)",
              "出力回落（2027年）"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-07"
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
          "id": "caiso-08",
          "chapter": "battery",
          "scene": "caiso-08",
          "question": [
            "Why does this play build exactly {qcBasisHours} hours?",
            "为什么本方案恰好建设{qcBasisHours}小时？"
          ],
          "copy": [
            "Below {qcBasisHours} hours, RA counts the battery as a smaller one. Above {qcBasisHours}, RA credits the same power, and the platform's model pays nothing more for the extra hours. On the platform's design test, {bestDuration} hours is the best design here: {buildLine}",
            "低于{qcBasisHours}小时，RA只按一台更小的电池计算；高于{qcBasisHours}小时，RA计入的功率不变，本平台的模型也不为额外的小时付费。按本平台的设计测试，{bestDuration}小时是这里的最佳设计：{buildLine}"
          ],
          "meaning": [
            "{qcBasisHours} hours earns the full RA credit, and even that does not clear the platform's yields at build cost.",
            "{qcBasisHours}小时即可获得全额RA信用；即便如此，按建设成本测算仍达不到本平台的收益率要求。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "buyers paying more for hours beyond {qcBasisHours} under slice of day, or a battery price that moves the design grid's best duration.",
              "在分时段机制下，买方愿为{qcBasisHours}小时以上的时长额外付费，或电池价格变化使设计表中的最优时长改变。"
            ]
          },
          "controls": [
            [
              "{shortHours} hours (Example)",
              "{shortHours}小时（示例）"
            ],
            [
              "{playDuration} hours",
              "{playDuration}小时"
            ],
            [
              "{longHours} hours (Example)",
              "{longHours}小时（示例）"
            ],
            [
              "New",
              "新电池"
            ],
            [
              "After foldback (Example)",
              "出力回落后（示例）"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-08"
          ]
        },
        {
          "id": "caiso-09",
          "chapter": "battery",
          "scene": "caiso-09",
          "question": [
            "What sits behind the word \"battery\" here?",
            "在这里，“电池”二字背后是什么？"
          ],
          "copy": [
            "Equipment, and two documents that matter more. Battery modules, power conversion, a transformer, controls and the grid connection make the plant. Its RA value rests on a deliverability status from CAISO, allocated through its cluster studies, and on an RA contract with a retailer. Without deliverability, a battery cannot sell RA.",
            "设备之外，还有两份更要紧的文件。电池模组、功率变换系统、变压器、控制系统和并网连接构成电站本身；它的RA价值则取决于CAISO通过集群研究分配的可交付性资格，以及与售电主体签订的RA合同。没有可交付性资格，电池就无法出售RA。"
          ],
          "meaning": [
            "An operating asset already holds both, which a new build must still win; this play enters as an {entryRoute} asset.",
            "在运资产已经持有这两样东西，而新建项目仍须争取；本方案以{entryRoute}的形式进入。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the asset's entry in CAISO's qualifying capacity list and its deliverability status, mapped to these parts.",
              "在CAISO净合格容量清单中查到该资产的记录及其可交付性状态，并与各部件逐一对应。"
            ]
          },
          "controls": [
            [
              "Equipment",
              "设备"
            ],
            [
              "Rights and obligations",
              "权利与义务"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-09"
          ]
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
          "id": "caiso-10",
          "chapter": "payment",
          "scene": "caiso-10",
          "question": [
            "Who pays this battery, and for what?",
            "谁为这台电池付费？为什么付费？"
          ],
          "copy": [
            "A retailer pays first, under an RA contract: a monthly price for each kilowatt of qualifying capacity, with a duty to offer that capacity into CAISO's market. In the platform's model that contract is {securedShare} of revenue, counted as secured for {securedTenor} years and unsecured after. Trading energy makes up most of the rest; regulation is small and crowded.",
            "首先付费的是售电主体，依据RA合同：按每千瓦合格容量每月付费，电池则有义务把这部分容量报入CAISO市场。在本平台模型中，这份合同占收入的{securedShare}，前{securedTenor}年计为锁定收入，此后计为非锁定收入。其余收入大部分来自电能量交易；调频服务规模小且竞争拥挤。"
          ],
          "meaning": [
            "The RA contract carries this play; a model assumption is not a signed contract, so the asset's own contract decides the case.",
            "支撑本方案的是RA合同；模型假设并不等于已签合同，因此决定投资逻辑的是资产自身的合同。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the asset's executed RA contract, with its price, MW, term and counterparty.",
              "资产已签署的RA合同及其价格、MW、期限和交易对手。"
            ]
          },
          "controls": [
            [
              "Resource adequacy",
              "资源充裕度"
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
            "CL-CAISO-SHOT-10"
          ]
        },
        {
          "id": "caiso-11",
          "chapter": "payment",
          "scene": "caiso-11",
          "question": [
            "Can the battery sell RA, trade and provide services, all at full size?",
            "电池能否同时以满额出售RA、参与交易并提供辅助服务？"
          ],
          "copy": [
            "No. The MW it sells as RA must be offered into the market, and its buyer must show spare energy to recharge it. Trading and regulation use what is left, and batteries already supply most of the regulation CAISO buys.",
            "不能。作为RA出售的那部分MW必须报入市场，买方还须申报足以为其充电的富余电量。交易和调频只能使用剩余部分，而CAISO采购的调频服务大部分已由电池提供。"
          ],
          "meaning": [
            "Only compatible revenue belongs in the cash flow, which is how the model treats it.",
            "只有彼此兼容的收入才能计入现金流，模型正是这样处理的。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a calculation record behind the teaching board's values.",
              "教学示意板数值的计算记录。"
            ]
          },
          "controls": [
            [
              "RA in the evening",
              "傍晚RA"
            ],
            [
              "Charging at midday",
              "中午充电"
            ],
            [
              "Trading",
              "交易"
            ],
            [
              "Regulation",
              "调频"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-11"
          ]
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
          "id": "caiso-12",
          "chapter": "investment",
          "scene": "caiso-12",
          "question": [
            "Why buy an operating battery rather than build one?",
            "为什么收购在运电池，而不是新建？"
          ],
          "copy": [
            "Because at build cost the numbers do not clear. A new {qcBasisHours}-hour project returns {holdReturn}, below the fund's target of {targetReturn}. An operating asset that already holds deliverability and an RA contract meets the fund's operating target of {operatingTarget} only if bought for no more than {operatingPriceCeiling}, against {buildCapex} to build new. The fund waits until the foldback cut shows how many MW that asset can still sell, then prices it.",
            "因为按建设成本测算，数字达不到要求。新建一个{qcBasisHours}小时项目的回报为{holdReturn}，低于基金{targetReturn}的目标。已持有可交付性资格和RA合同的在运资产，只有在买入价不高于{operatingPriceCeiling}时，才能达到基金{operatingTarget}的在运资产目标回报；相比之下，新建成本为{buildCapex}。基金会等到出力回落下调落地、看清该资产还能出售多少MW之后，再为它定价。"
          ],
          "meaning": [
            "The price paid sets the return: below the ceiling the asset clears the target; above it, it does not.",
            "买入价格决定回报：低于这一上限，资产可以达到目标回报；高于上限则不能。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the asset's qualifying capacity after the 2027 cut, priced in the model.",
              "资产在2027年下调后的合格容量，并已计入模型定价。"
            ]
          },
          "controls": [
            [
              "Build new",
              "新建"
            ],
            [
              "Buy operating",
              "收购在运资产"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-12"
          ]
        },
        {
          "id": "caiso-13",
          "chapter": "investment",
          "scene": "caiso-13",
          "question": [
            "What would make this play less attractive?",
            "什么会削弱这个方案？"
          ],
          "copy": [
            "Fewer MW to sell, a lower price for them, and paying too much. The foldback cut and, from 2028, accreditation on outage records can lower the MW an asset sells; more storage can keep RA prices soft; the contract ends and must be signed again; and the purchase price can take the margin. Next: {nextAction}",
            "可出售的MW减少、这些MW的价格下降，以及买贵了。出力回落下调以及2028年起按停运记录核定容量，可能减少资产可出售的MW；更多储能可能让RA价格持续疲软；合同到期后需要重新签订；收购价格则可能吃掉利润空间。下一步：{nextAction}"
          ],
          "meaning": [
            "Watch the 2027 qualifying capacity and the RA price, then the price paid.",
            "要盯住的是2027年的合格容量和RA价格，其次是买入价格。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the published 2027 qualifying capacity values and the CPUC's next RA price benchmark.",
              "公布的2027年合格容量数值，以及CPUC下一期RA价格基准。"
            ]
          },
          "controls": [
            [
              "Fewer MW",
              "MW减少"
            ],
            [
              "Softer RA price",
              "RA价格走软"
            ],
            [
              "Contract expiry",
              "合同到期"
            ],
            [
              "Price paid",
              "买入价格"
            ]
          ],
          "claims": [
            "CL-CAISO-SHOT-13"
          ]
        }
      ]
    }
  ]
};
