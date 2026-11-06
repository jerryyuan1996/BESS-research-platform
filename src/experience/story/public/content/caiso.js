/* Public edition: editorial review pending. Original approvals unchanged. */
export default {
  "marketId": "caiso",
  "legacyVersion": "2026-11-03",
  "script": "docs/immersive-experience-plan/caiso-storyboard.md",
  "extracts": {
    "history": [],
    "system": [
      {
        "shotId": "caiso-02",
        "question": [
          "When is California's grid hardest to run?",
          "加州电网什么时候最难运行？"
        ],
        "text": [
          "After sunset. Solar carries the middle of the day, then fades while homes and offices still draw power. What the rest of the system must serve, demand minus wind and solar, peaks in the early evening. CAISO calls the shape the duck curve.",
          "在日落之后。光伏撑起白天，但在住户和办公楼仍在用电时逐渐退场。其余电源需要承担的负荷——即需求减去风电和光伏——在傍晚早些时候达到峰值。CAISO把这条曲线称为“鸭子曲线”。"
        ],
        "claimIds": [
          "CL-CAISO-SHOT-02"
        ],
        "sourceIds": [
          "SRC-CAISO-04",
          "SRC-CAISO-05"
        ]
      }
    ],
    "mechanism": [
      {
        "shotId": "caiso-09",
        "question": [
          "What sits behind the word \"battery\" here?",
          "在这里，“电池”二字背后是什么？"
        ],
        "text": [
          "Equipment, and two documents that matter more. Battery modules, power conversion, a transformer, controls and the grid connection make the plant. Its RA value rests on a deliverability status from CAISO, allocated through its cluster studies, and on an RA contract with a retailer. Without deliverability, a battery cannot sell RA.",
          "设备之外，还有两份更要紧的文件。电池模组、功率变换系统、变压器、控制系统和并网连接构成电站本身；它的RA价值则取决于CAISO通过集群研究分配的可交付性资格，以及与售电主体签订的RA合同。没有可交付性资格，电池就无法出售RA。"
        ],
        "claimIds": [
          "CL-CAISO-SHOT-09"
        ],
        "sourceIds": [
          "SRC-CAISO-07",
          "SRC-CAISO-17"
        ]
      },
      {
        "shotId": "caiso-11",
        "question": [
          "Can the battery sell RA, trade and provide services, all at full size?",
          "电池能否同时以满额出售RA、参与交易并提供辅助服务？"
        ],
        "text": [
          "No. The MW it sells as RA must be offered into the market, and its buyer must show spare energy to recharge it. Trading and regulation use what is left, and batteries already supply most of the regulation CAISO buys.",
          "不能。作为RA出售的那部分MW必须报入市场，买方还须申报足以为其充电的富余电量。交易和调频只能使用剩余部分，而CAISO采购的调频服务大部分已由电池提供。"
        ],
        "claimIds": [
          "CL-CAISO-SHOT-11"
        ],
        "sourceIds": [
          "SRC-CAISO-11",
          "SRC-CAISO-09"
        ]
      }
    ]
  },
  "basis": [],
  "timeline": [
    [
      "2006-06-01",
      "System Resource Adequacy requirements",
      "系统资源充足性要求"
    ],
    [
      "2013-10-17",
      "Storage procurement order",
      "储能采购决定"
    ]
  ],
  "sourceIdsByChapter": {
    "history": [],
    "system": [
      "SRC-CAISO-04",
      "SRC-CAISO-05"
    ],
    "mechanism": [
      "SRC-CAISO-07",
      "SRC-CAISO-17",
      "SRC-CAISO-11",
      "SRC-CAISO-09"
    ]
  },
  "payment": [
    "Resource Adequacy is a bilateral obligation backed by deliverability and a retailer contract. The grid connection alone is insufficient. Sold RA capacity must satisfy market-offer and recharge requirements; trading can use only compatible remaining capability.",
    "资源充足性是以可交付性及售电主体合同为基础的双边义务，仅有并网连接不足以取得收入。已出售的RA容量须满足市场报价及再充电要求；交易只能使用与之兼容的剩余能力。"
  ],
  "constraint": [
    "Solar midday / sunset net-load peak",
    "午间光伏／日落净负荷高峰"
  ],
  "payer": [
    "Deliverability + RA contract",
    "可交付性＋RA合同"
  ],
  "sources": {
    "SRC-CAISO-01": {
      "title": "CPUC, D.04-10-035, Interim Opinion Regarding Resource Adequacy, R.04-04-003; §2.1 \"The RAR Framework\"",
      "url": "https://docs.cpuc.ca.gov/published/Final_decision/41416.htm",
      "checkedOn": "2026-10-31",
      "locator": "CPUC, [D.04-10-035, Interim Opinion Regarding Resource Adequacy, R.04-04-003](https://docs.cpuc.ca.gov/published/Final_decision/41416.htm); [§2.1 \"The RAR Framework\"](https://docs.cpuc.ca.gov/published/Final_decision/41416-01.htm)"
    },
    "SRC-CAISO-02": {
      "title": "CPUC, D.06-04-040, §1 \"Compliance With Section 380\"",
      "url": "https://docs.cpuc.ca.gov/published/Final_decision/55661-02.htm",
      "checkedOn": "2026-10-31",
      "locator": "CPUC, [D.06-04-040, §1 \"Compliance With Section 380\"](https://docs.cpuc.ca.gov/published/Final_decision/55661-02.htm)"
    },
    "SRC-CAISO-03": {
      "title": "CPUC, Resource Adequacy Homepage",
      "url": "https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-power-procurement/resource-adequacy-homepage",
      "checkedOn": "2026-10-31",
      "locator": "CPUC, [Resource Adequacy Homepage](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-power-procurement/resource-adequacy-homepage)"
    },
    "SRC-CAISO-04": {
      "title": "CAISO, *What the duck curve tells us about managing a green grid*, Fast Facts, CommPR/2016, p. 1",
      "url": "https://www.caiso.com/Documents/FlexibleResourcesHelpRenewables_FastFacts.pdf",
      "checkedOn": "2026-10-31",
      "locator": "CAISO, [*What the duck curve tells us about managing a green grid*, Fast Facts, CommPR/2016](https://www.caiso.com/Documents/FlexibleResourcesHelpRenewables_FastFacts.pdf), p. 1"
    },
    "SRC-CAISO-05": {
      "title": "CAISO, CPUC and CEC, *Final Root Cause Analysis: Mid-August 2020 Extreme Heat Wave*, Executive Summary, p. 4",
      "url": "https://www.caiso.com/Documents/Final-Root-Cause-Analysis-Mid-August-2020-Extreme-Heat-Wave.pdf",
      "checkedOn": "2026-10-31",
      "locator": "CAISO, CPUC and CEC, [*Final Root Cause Analysis: Mid-August 2020 Extreme Heat Wave*](https://www.caiso.com/Documents/Final-Root-Cause-Analysis-Mid-August-2020-Extreme-Heat-Wave.pdf), Executive Summary, p. 4"
    },
    "SRC-CAISO-06": {
      "title": "CPUC, D.13-10-040, R.10-12-007, Summary, p. 2",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M079/K533/79533378.PDF",
      "checkedOn": "2026-10-31",
      "locator": "CPUC, [D.13-10-040, R.10-12-007](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M079/K533/79533378.PDF), Summary, p. 2"
    },
    "SRC-CAISO-07": {
      "title": "CPUC, D.14-06-050, Appendix B, §13.1, p. B-9",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M097/K619/97619935.PDF",
      "checkedOn": "2026-10-31",
      "locator": "CPUC, [D.14-06-050](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M097/K619/97619935.PDF), Appendix B, §13.1, p. B-9"
    },
    "SRC-CAISO-08": {
      "title": "CPUC, D.21-06-035, Decision Requiring Procurement to Address Mid-Term Reliability (2023-2026), R.20-05-003, Summary p. 2; p. 70",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M389/K603/389603637.PDF",
      "checkedOn": "2026-10-31",
      "locator": "CPUC, [D.21-06-035, Decision Requiring Procurement to Address Mid-Term Reliability (2023-2026), R.20-05-003](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M389/K603/389603637.PDF), Summary p. 2; p. 70"
    },
    "SRC-CAISO-09": {
      "title": "CPUC, D.22-06-050, Appendix A, \"24-Hour Slice Framework\", R.21-10-002, sections A and B.2",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M488/K540/488540634.PDF",
      "checkedOn": "2026-10-31",
      "locator": "CPUC, [D.22-06-050, Appendix A, \"24-Hour Slice Framework\", R.21-10-002](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M488/K540/488540634.PDF), sections A and B.2"
    },
    "SRC-CAISO-10": {
      "title": "CPUC, D.26-07-008, Decision Adopting Local Capacity Obligations for 2027-2029, Flexible Capacity Obligations for 2027, and Program Refinements, R.25-10-003: §4.4.1 pp. 19–21; §4.4.1.3 pp. 26–28; §4.4.3.3 pp. 48–51; §4.6.3 pp. 84–86; p. 177; Ordering Paragraph 6, p. 197. Fact sheet, pp. 1–2",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M610/K575/610575803.PDF",
      "checkedOn": "2026-10-31",
      "locator": "CPUC, [D.26-07-008, Decision Adopting Local Capacity Obligations for 2027-2029, Flexible Capacity Obligations for 2027, and Program Refinements, R.25-10-003](https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M610/K575/610575803.PDF): §4.4.1 pp. 19–21; §4.4.1.3 pp. 26–28; §4.4.3.3 pp. 48–51; §4.6.3 pp. 84–86; p. 177; Ordering Paragraph 6, p. 197. [Fact sheet](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/resource-adequacy-homepage/oga-fact-sheet-on-track-1-final-decision-v2.pdf), pp. 1–2"
    },
    "SRC-CAISO-11": {
      "title": "CAISO Department of Market Monitoring, *2024 Special Report on Battery Storage*: key findings p. 4; §2.10.1 pp. 28–29",
      "url": "https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf",
      "checkedOn": "2026-10-31",
      "locator": "CAISO Department of Market Monitoring, [*2024 Special Report on Battery Storage*](https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf): key findings p. 4; §2.10.1 pp. 28–29"
    },
    "SRC-CAISO-12": {
      "title": "CAISO Department of Market Monitoring, *2025 Annual Report on Market Issues and Performance*: pp. 2–3, 13–14, 23, 82 and 316 (Table 16.7)",
      "url": "https://www.caiso.com/documents/2025-annual-report-on-market-issues-and-performance.pdf",
      "checkedOn": "2026-10-31",
      "locator": "CAISO Department of Market Monitoring, [*2025 Annual Report on Market Issues and Performance*](https://www.caiso.com/documents/2025-annual-report-on-market-issues-and-performance.pdf): pp. 2–3, 13–14, 23, 82 and 316 (Table 16.7)"
    },
    "SRC-CAISO-13": {
      "title": "CAISO, *2026 Summer Loads and Resources Assessment*, Executive Summary p. 1; §1.1",
      "url": "https://www.caiso.com/documents/2026-summer-loads-and-resources-assessment.pdf",
      "checkedOn": "2026-10-31",
      "locator": "CAISO, [*2026 Summer Loads and Resources Assessment*](https://www.caiso.com/documents/2026-summer-loads-and-resources-assessment.pdf), Executive Summary p. 1; §1.1"
    },
    "SRC-CAISO-14": {
      "title": "California Energy Commission, news release, 4 May 2026",
      "url": "https://www.energy.ca.gov/news/2026-05/california-energy-leaders-report-progress-grid-reliability-ahead-summer-2026",
      "checkedOn": "2026-10-31",
      "locator": "California Energy Commission, [news release, 4 May 2026](https://www.energy.ca.gov/news/2026-05/california-energy-leaders-report-progress-grid-reliability-ahead-summer-2026)"
    },
    "SRC-CAISO-15": {
      "title": "CPUC Energy Division, *Market Price Benchmark Calculations 2026*, Tables 1 and 2, p. 1; RA Adder method, pp. 2–3",
      "url": "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/community-choice-aggregation-and-direct-access/2026-market-price-benchmarks.pdf",
      "checkedOn": "2026-10-31",
      "locator": "CPUC Energy Division, [*Market Price Benchmark Calculations 2026*](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/community-choice-aggregation-and-direct-access/2026-market-price-benchmarks.pdf), Tables 1 and 2, p. 1; RA Adder method, pp. 2–3"
    },
    "SRC-CAISO-16": {
      "title": "CPUC Energy Division, *2023 Resource Adequacy Report*, executive summary p. 4; §4.1, Table 7 (p. 26) and Figure 4",
      "url": "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/resource-adequacy-homepage/2023-ra-reportv3.pdf",
      "checkedOn": "2026-10-31",
      "locator": "CPUC Energy Division, [*2023 Resource Adequacy Report*](https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/energy-division/documents/resource-adequacy-homepage/2023-ra-reportv3.pdf), executive summary p. 4; §4.1, Table 7 (p. 26) and Figure 4"
    },
    "SRC-CAISO-17": {
      "title": "CAISO Tariff, Appendix KK, Resource Interconnection Standards, §8.9",
      "url": "https://www.caiso.com/documents/appendix-kk-resource-interconnection-standards-as-of-jun-25-2025.pdf",
      "checkedOn": "2026-10-31",
      "locator": "CAISO Tariff, [Appendix KK, Resource Interconnection Standards](https://www.caiso.com/documents/appendix-kk-resource-interconnection-standards-as-of-jun-25-2025.pdf), §8.9"
    },
    "SRC-CAISO-18": {
      "title": "CAISO, Today's Outlook history: daily `netdemand.csv` and `fuelsource.csv`, e.g. `/outlook/history/20250715/netdemand.csv`",
      "url": "https://www.caiso.com/outlook/history/20250715/netdemand.csv",
      "checkedOn": "2026-10-31",
      "locator": "CAISO, Today's Outlook history: daily `netdemand.csv` and `fuelsource.csv`, e.g. [`/outlook/history/20250715/netdemand.csv`](https://www.caiso.com/outlook/history/20250715/netdemand.csv)"
    },
    "SRC-CAISO-19": {
      "title": "CAISO, Privacy Notice and Terms of Use, \"Restrictions on Use of Materials\" and \"API Terms of Use\"",
      "url": "https://www.caiso.com/privacy-terms-of-use",
      "checkedOn": "2026-10-31",
      "locator": "CAISO, [Privacy Notice and Terms of Use](https://www.caiso.com/privacy-terms-of-use), \"Restrictions on Use of Materials\" and \"API Terms of Use\""
    },
    "SRC-CAISO-20": {
      "title": "U.S. EIA, Form EIA-930 six-month balance files, CAISO rows: `EIA930_BALANCE_2025_Jul_Dec.csv` and the 2020 file. Also EIA-860M, the monthly generator inventory, through REPO-CAISO-DG2",
      "url": "https://www.eia.gov/electricity/gridmonitor/sixMonthFiles/EIA930_BALANCE_2025_Jul_Dec.csv",
      "checkedOn": "2026-10-31",
      "locator": "U.S. EIA, Form EIA-930 six-month balance files, CAISO rows: [`EIA930_BALANCE_2025_Jul_Dec.csv`](https://www.eia.gov/electricity/gridmonitor/sixMonthFiles/EIA930_BALANCE_2025_Jul_Dec.csv) and the 2020 file. Also EIA-860M, the monthly generator inventory, through REPO-CAISO-DG2"
    },
    "SRC-CAISO-21": {
      "title": "U.S. EIA, Copyrights and Reuse",
      "url": "https://www.eia.gov/about/copyrights_reuse.php",
      "checkedOn": "2026-10-31",
      "locator": "U.S. EIA, [Copyrights and Reuse](https://www.eia.gov/about/copyrights_reuse.php)"
    },
    "SRC-CAISO-22": {
      "title": "A utility's 2027 ERRA Fall Update testimony, A.26-05-007, p. 12",
      "url": "https://docs.cpuc.ca.gov/PublishedDocs/SupDoc/A2605007/9872/623865860.pdf",
      "checkedOn": "2026-10-31",
      "locator": "A utility's 2027 ERRA Fall Update testimony, [A.26-05-007](https://docs.cpuc.ca.gov/PublishedDocs/SupDoc/A2605007/9872/623865860.pdf), p. 12"
    }
  },
  "sourceIds": [
    "SRC-CAISO-04",
    "SRC-CAISO-05",
    "SRC-CAISO-07",
    "SRC-CAISO-17",
    "SRC-CAISO-11",
    "SRC-CAISO-09"
  ],
  "legacyScope": {
    "playRef": "caiso-cap-4h",
    "hours": 4,
    "call": "opportunistic",
    "lens": "infraFund",
    "on": "2026-11-02",
    "commit": "474766e07ff78a20a57e0a999a3da05c0a62dbf3"
  }
};
