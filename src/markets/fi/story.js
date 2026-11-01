/* Finland: the complete bilingual script signed off at G-1 on 31 October 2026.
   Plain content only; numeric values resolve through storyBindings.js.
   Source: docs/immersive-experience-plan/finland-storyboard.md, v1.2.
   Preserve both languages when the analyst approves any later wording. */
export const story = {
  "storySchemaVersion": 1,
  "contentVersion": "2026-10-31",
  "marketId": "fi",
  "systemBoundary": [
    "Finland · Nordic synchronous area",
    "芬兰 · 北欧同步区"
  ],
  "supportedLocales": [
    "en",
    "zh"
  ],
  "playRef": "fi-toll-2h",
  "reviewedAgainst": {
    "playRef": "fi-toll-2h",
    "hours": 2,
    "call": "opportunistic",
    "on": "2026-10-31",
    "commit": "edcb39ca0d69397f3683dffc9af5ffb49473c98c"
  },
  "tokens": [
    "call",
    "playName",
    "cardFigures",
    "nextAction",
    "playEvidence",
    "playDuration",
    "durationGrid",
    "securedShare",
    "securedTenor",
    "historyNode",
    "productTerms",
    "visionHorizon",
    "ol3RegularDate",
    "ol3Output",
    "ol3NetStep",
    "connectedDate",
    "connectedMW",
    "fastObligationMW",
    "annualDeliveryYear",
    "priceCoverage",
    "priceFetchedAt",
    "fcrHourlyYear",
    "billSubmissionMonth",
    "sourceCheckedDate",
    "plantName",
    "productActivation",
    "productSupport",
    "productDirection",
    "productApproval"
  ],
  "sources": {
    "SRC-FI-01": {
      "title": "Fingrid Power system reserves",
      "url": "https://www.fingrid.fi/en/electricity-market/reserves/power-system-reserves/",
      "locator": "headings “Purposes of different reserve products”, “Activation and control direction”, “Reserve obligations”, the national 2026 obligation table, and the separate 2019–2025 average procurement / 2026–2036 forecast tables; checked 31 October 2026",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-02": {
      "title": "Fingrid Electricity system vision 2040, 2025 vision attachment",
      "url": "https://www.fingrid.fi/en/grid/development/electricity-system-vision-2040/",
      "locator": "",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-03": {
      "title": "Fingrid Open Data",
      "url": "https://data.fingrid.fi/",
      "locator": "",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-04": {
      "title": "Fingrid, The combined capacity of electricity storages in Finland now exceeds 1,000 MW",
      "url": "https://www.fingrid.fi/en/news/news/2026/the-combined-capacity-of-electricity-storages-in-finland-now-exceeds-1000-mw/",
      "locator": "24 February 2026, 14:36, opening and paragraph beginning “Fingrid has started collecting data”",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-05": {
      "title": "Fingrid, dataset 424: Total installed battery energy storage system capacity",
      "url": "https://data.fingrid.fi/en/datasets/424",
      "locator": "description, “Dataset” and “Additional information” blocks",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-06": {
      "title": "Fingrid, FFR product page",
      "url": "https://www.fingrid.fi/en/electricity-market/reserves/reserve-products/fast-frequency-reserve-ffr/",
      "locator": "opening, “Technical requirements”, activation table and “Procurement”",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-07": {
      "title": "Fingrid, FFR provider terms",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/en/electricity-market/reserves/terms-and-conditions-for-providers-of-fast-frequency-reserves-30.9.2026.pdf",
      "locator": "effective 30 September 2026, §§3–5, 7–9.2, PDF pp. 4–10",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-08": {
      "title": "Fingrid, FFR technical requirements",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/fi/sahkomarkkinat/reservit/the-technical-requirements-and-the-prequalification-process-of-fast-frequency-reserve-ffr-1.9.2025.pdf",
      "locator": "effective 1 September 2025, §3, Tables 3.1–3.2 and recovery paragraph, PDF pp. 5–7",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-09": {
      "title": "Fingrid, FCR product page",
      "url": "https://www.fingrid.fi/en/electricity-market/reserves/reserve-products/frequency-containment-reserves-fcr-products/",
      "locator": "opening, technical table and annual/hourly comparison",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-10": {
      "title": "Fingrid, FCR provider terms",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/en/electricity-market/reserves/terms-and-conditions-for-providers-of-frequency-containment-reserves-30.9.2026.pdf",
      "locator": "effective 30 September 2026, §§4–5, 7–8, 10, 11.2–11.4, PDF pp. 6–17",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-11": {
      "title": "Fingrid, FCR technical requirements and prequalification",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/en/electricity-market/reserves/the-technical-requirements-and-the-prequalification-process-of-frequency-containment-reserves-fcr-1.9.2025.pdf",
      "locator": "effective 1 September 2025, Nordic technical annex §3.5, Table 10, printed pp. 38–40 / PDF pp. 40–42; product response tests in §3",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-12": {
      "title": "Fingrid, aFRR product page",
      "url": "https://www.fingrid.fi/en/electricity-market/reserves/reserve-products/automatic-frequency-restoration-reserve-afrr",
      "locator": "opening / procurement paragraphs and attachments",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-13": {
      "title": "Fingrid, aFRR provider terms",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/en/electricity-market/reserves/terms-and-conditions-for-providers-of-automatic-frequency-restoration-reserve-30.9.2026.pdf",
      "locator": "30 September 2026, §§2, 4–5, 7–8 and 11.1–11.2, PDF pp. 5–6, 7–14, 18–21",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-14": {
      "title": "Fingrid, aFRR technical appendix",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/en/electricity-market/reserves/attachment-2-technical-requirements-and-prequalification-process-of-afrr-valid-from-13.2.2026.pdf",
      "locator": "valid from 13 February 2026, linked as Attachment 2 on SRC-FI-12",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-15": {
      "title": "Fingrid, mFRR product page",
      "url": "https://www.fingrid.fi/en/electricity-market/reserves/reserve-products/balancing-energy-and-balancing-capacity-markets-mfrr/",
      "locator": "opening, “Pricing” and attachments",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-16": {
      "title": "Fingrid, mFRR provider terms",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/en/electricity-market/reserves/terms-and-conditions-for-providers-of-manual-frequency-restoration-reserve-30.9.2026.pdf",
      "locator": "30 September 2026, §§2, 5, 7.3.1–7.3.2, 8 and 12.1–12.2, PDF pp. 4–7, 10, 13–17, 28–32",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-17": {
      "title": "Fingrid, mFRR technical / prequalification appendix",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/fi/sahkomarkkinat/saatosahko/liite-2-manuaalisen-taajuuden-palautusreservin_20231120_en-id-422319.pdf",
      "locator": "20 November 2023, §2.1, PDF p. 3",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-18": {
      "title": "TVO, Regular electricity production has started at Olkiluoto 3 EPR",
      "url": "https://www.tvo.fi/en/index/news/pressreleasesstockexchangereleases/2023/regularelectricityproductionhasstartedatolkiluoto3epr.html",
      "locator": "16 April 2023, opening and output paragraph",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-19": {
      "title": "Fingrid, Preparations for connecting OL3",
      "url": "https://www.fingrid.fi/en/news/news/2017/fingrid-prepares-for-the-connection-of-olkiluoto-3-to-the-national-grid/",
      "locator": "16 June 2017, paragraphs 2–5",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-20": {
      "title": "Fingrid, OL3 connected to the main grid",
      "url": "https://www.fingrid.fi/en/news/news/2022/olkiluoto-3-nuclear-power-plant-connected-to-the-main-grid-without-any-problems/",
      "locator": "March 2022, final fact box",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-21": {
      "title": "TVO, Energy Authority decision on OL3 grid protection",
      "url": "https://www.tvo.fi/en/index/news/pressreleasesstockexchangereleases/2024/4724050.html",
      "locator": "12 January 2024, “On grid protection”",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-22": {
      "title": "Fingrid, Procurement from yearly market 2026",
      "url": "https://www.fingrid.fi/en/news/news/2025/procurement-of-frequency-containment-reserves-from-yearly-market-2026/",
      "locator": "3 November 2025, procurement bullets, price bullets and comparison paragraphs",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-23": {
      "title": "Fingrid, FCR procurement focused on hourly market in 2027",
      "url": "https://www.fingrid.fi/en/news/news/2026/the-procurement-of-frequency-containment-reserves-will-be-focused-to-the-hourly-market-in-2027",
      "locator": "8 September 2026, paragraphs 1 and 4–5",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-24": {
      "title": "Ministry of Economic Affairs and Employment, Priority procedure consultation notice",
      "url": "https://valtioneuvosto.fi/-/1410877/sahkoverkkoon-liittamisen-etusijamenettely-lausuntokierrokselle?languageId=en_US",
      "locator": "18 September 2026, paragraphs on scope, groups, commencement and existing requests",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-25": {
      "title": "Same ministry, Legislative drafting to continue after consultation",
      "url": "https://valtioneuvosto.fi/en/-/1410877/more-than-200-views-received-on-priority-procedure-for-electricity-network-connections-legislative-drafting-to-continue",
      "locator": "23 October 2026, 16:36, opening and paragraph ending “December 2026”",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-26": {
      "title": "Parliament library, Sähköverkkoon liittymisen priorisointi",
      "url": "https://www.eduskunta.fi/fi/lakihankkeiden-tietopaketit/sahkoverkkoon-liittymisen-priorisointi",
      "locator": "FI, updated 23 October 2026, “Johdanto”, “Valmistelu ennen eduskuntakäsittelyä”, “Käsittely eduskunnassa”",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-27": {
      "title": "Ministry consultation, Draft amendment and consultation record",
      "url": "https://www.lausuntopalvelu.fi/FI/Proposal/ShowAllProposalAnswers?proposalId=a9038003-f60c-4a49-8236-31a1f2914975",
      "locator": "FI, VN/24069/2026, “Lausuntopyynnön taustatiedot”, “Tausta”, “Liitteet” and “Aikataulu”",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-28": {
      "title": "Fingrid, Part of the Nordic power system",
      "url": "https://www.fingrid.fi/en/grid/development/part-of-the-nordic-power-system/",
      "locator": "opening, AC/DC explanation and SOA paragraph; ENTSO-E, [System Operations Reports](https://www.entsoe.eu/publications/system-operations-reports/), heading “Nordic System Operation Agreement”",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-29": {
      "title": "Fingrid, Main grid development plan 2015–2025",
      "url": "https://www.fingrid.fi/globalassets/dokumentit/en/grid-projects/engl_fingrid_kantaverkon_kehittamissuunnitelma-2015---2025.pdf",
      "locator": "2015 edition, chapter 3 historical background, printed p. 19, paragraph before Figure 4",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-30": {
      "title": "Nord Pool Spot, Annual review 2003",
      "url": "https://www.nordpoolgroup.com/globalassets/download-center/annual-report/annual-review_nord-pool-spot_2003.pdf",
      "locator": "printed p. 4, “A brief history”, entries 1998–1999",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-31": {
      "title": "Fingrid, Procurement from annual market 2024",
      "url": "https://www.fingrid.fi/en/news/news/2023/procurement-of-frequency-containment-reserves-from-annual-market-2024/",
      "locator": "1 November 2023, Background footnote 1; datasets 315/316 and 276 below",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-32": {
      "title": "Fingrid Open Data, each named [dataset below](#fi-series-register), “Dataset” / licence blocks; API instructions",
      "url": "https://data.fingrid.fi/en/instructions",
      "locator": "",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-33": {
      "title": "Fingrid / Finextra, period November 2025–October 2026",
      "url": "https://www.fingrid.fi/en/grid/peak-load-capacity/yearly-periods/period-112025---102026/",
      "locator": " and [November 2026–October 2027](https://www.fingrid.fi/en/grid/peak-load-capacity/yearly-periods/period-112026-102027/), each opening decision paragraph and Energy Authority link",
      "checkedOn": "2026-10-31"
    },
    "SRC-FI-34": {
      "title": "Finnish legislation, Act 117/2011 on peak-load reserves",
      "url": "https://www.finlex.fi/fi/lainsaadanto/2011/117",
      "locator": "official Finlex title; SRC-FI-33's statutory description",
      "checkedOn": "2026-10-31"
    },
    "REPO-FI-15": {
      "title": "REPO-FI-15",
      "url": "/markets/finland#bankable",
      "locator": "Current briefing row, selected play and investment summary",
      "checkedOn": "2026-10-31"
    }
  },
  "claims": {
    "CL-FI-01": {
      "sources": [
        "SRC-FI-01",
        "SRC-FI-06",
        "SRC-FI-07",
        "SRC-FI-08",
        "SRC-FI-09",
        "SRC-FI-10",
        "SRC-FI-11",
        "SRC-FI-12",
        "SRC-FI-13",
        "SRC-FI-14",
        "SRC-FI-15",
        "SRC-FI-16",
        "SRC-FI-17"
      ]
    },
    "CL-FI-02": {
      "sources": [
        "SRC-FI-01",
        "SRC-FI-04",
        "SRC-FI-05",
        "SRC-FI-32"
      ]
    },
    "CL-FI-03": {
      "sources": [
        "SRC-FI-18",
        "SRC-FI-19",
        "SRC-FI-20",
        "SRC-FI-21"
      ]
    },
    "CL-FI-04": {
      "sources": [
        "SRC-FI-23"
      ]
    },
    "CL-FI-05": {
      "sources": [
        "SRC-FI-24",
        "SRC-FI-25",
        "SRC-FI-26",
        "SRC-FI-27"
      ]
    },
    "CL-FI-06": {
      "sources": [
        "SRC-FI-28",
        "SRC-FI-29",
        "SRC-FI-30"
      ]
    },
    "CL-FI-07": {
      "sources": [
        "SRC-FI-07",
        "SRC-FI-10",
        "SRC-FI-13",
        "SRC-FI-16",
        "SRC-FI-22",
        "SRC-FI-32"
      ]
    },
    "CL-FI-08": {
      "sources": [
        "SRC-FI-33",
        "SRC-FI-34"
      ]
    },
    "CL-FI-09": {
      "sources": [
        "REPO-FI-15",
        "SRC-FI-11"
      ]
    },
    "CL-FI-10": {
      "sources": [
        "SRC-FI-02"
      ]
    }
  },
  "opening": {
    "id": "fi-00",
    "chapter": "opening",
    "scene": "fi-thumbnail",
    "question": [
      "What is the call here, and what must be secured?",
      "这里的投资判断是什么，必须先锁定什么？"
    ],
    "copy": [
      "{call} · {playName} · {cardFigures} · {nextAction}. Trading carries this case. The modelled floor secures part of revenue for {securedTenor} years, with merchant exposure after expiry unless a new contract is signed. Follow the story from shared frequency to the contract.",
      "{call} · {playName} · {cardFigures} · {nextAction}。这项投资靠交易支撑。模型保底锁定部分收入，期限为{securedTenor}年；到期后若未签新合同，则承担市场风险。沿着故事，从共享频率看到合同。"
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
    "claims": [
      "CL-FI-09"
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
          "id": "fi-01",
          "chapter": "origins",
          "scene": "fi-nordic-map",
          "question": [
            "Whose frequency does Finland share?",
            "芬兰与谁共享电网频率？"
          ],
          "copy": [
            "Finland shares frequency with Sweden, Norway and eastern Denmark. When supply and demand diverge, the shared system needs a fast response. Trading across a border is a separate relationship.",
            "芬兰与瑞典、挪威和丹麦东部共享频率。供需失衡时，这个同步系统需要快速响应；跨境电力交易则是另一层关系。"
          ],
          "meaning": [
            "Shared Nordic frequency sets the reserve task; trading and a negotiated floor carry this play.",
            "北欧共享频率带来备用任务；本方案由交易和协商保底支撑。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the analyst's review of the system boundary, or revised Nordic sharing rules.",
              "分析师复核系统边界，或北欧分担规则调整。"
            ]
          },
          "controls": [
            [
              "Shared frequency",
              "共享频率"
            ],
            [
              "Trading links",
              "交易联系"
            ]
          ],
          "claims": [
            "CL-FI-06"
          ],
          "labels": {
            "ac": [
              "Connected by AC",
              "交流连接"
            ],
            "dc": [
              "Power transfer by DC",
              "直流输电"
            ],
            "finland": [
              "Finland",
              "芬兰"
            ],
            "sweden": [
              "Sweden",
              "瑞典"
            ],
            "norway": [
              "Norway",
              "挪威"
            ],
            "easternDenmark": [
              "Eastern Denmark",
              "丹麦东部"
            ],
            "boundary": [
              "Nordic synchronous area",
              "北欧同步区"
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
          "id": "fi-02",
          "chapter": "choices",
          "scene": "fi-products",
          "question": [
            "Why are there several reserve products?",
            "为什么备用要分成不同品种？"
          ],
          "copy": [
            "The job determines the product. FFR arrests a fast fall when inertia is low; FCR contains frequency deviations; aFRR and mFRR restore balance and free the faster services for the next event.",
            "先有任务，才有品种。惯量低时，FFR抑制频率快速下跌；FCR遏制频率偏差；aFRR和mFRR恢复平衡，让更快的备用重新待命。"
          ],
          "meaning": [
            "This play earns reserve income only where the battery meets the product's requirements.",
            "本方案只有在电池满足相应品种要求时，才能获得备用收入。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "reviewed effective technical terms and resolution of the qualification-document gaps.",
              "核对现行技术条款，并解决资格文件中的缺口。"
            ]
          },
          "controls": [
            [
              "FFR",
              "FFR"
            ],
            [
              "FCR-N",
              "FCR-N"
            ],
            [
              "FCR-D ↑",
              "FCR-D ↑"
            ],
            [
              "FCR-D ↓",
              "FCR-D ↓"
            ],
            [
              "aFRR",
              "aFRR"
            ],
            [
              "mFRR",
              "mFRR"
            ],
            [
              "Purpose",
              "任务"
            ],
            [
              "Requirements",
              "要求"
            ]
          ],
          "claims": [
            "CL-FI-01"
          ],
          "labels": {
            "activation": [
              "Activation",
              "响应时间"
            ],
            "support": [
              "Support duration",
              "持续支撑"
            ],
            "direction": [
              "Direction",
              "调节方向"
            ],
            "approval": [
              "Approval",
              "资格审批"
            ]
          }
        },
        {
          "id": "fi-03",
          "chapter": "choices",
          "scene": "fi-history",
          "question": [
            "Which choices led to today's crowded response market?",
            "哪些历史选择形成了今天拥挤的响应市场？"
          ],
          "copy": [
            "Shared operation came first, power trading followed, and reserve products became more specific. Batteries entered a market that already bought response by the hour. A vision for future growth is a different kind of evidence.",
            "先有联合运行，再有电力交易，随后备用品种不断细分。电池进入时，这个市场已经按小时采购响应能力。未来增长愿景属于另一类证据。"
          ],
          "meaning": [
            "The same market access that suits this battery also lets competing supply enter.",
            "适合本方案电池的市场准入条件，也让竞争供给得以进入。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "review of the historical causal links; future quantities require the underlying scenario tables.",
              "复核历史因果关系；未来数量还须核对原始情景表。"
            ]
          },
          "controls": [
            [
              "History",
              "历史"
            ],
            [
              "Future plans",
              "未来计划"
            ],
            [
              "Open source",
              "查看来源"
            ]
          ],
          "claims": [
            "CL-FI-04",
            "CL-FI-06",
            "CL-FI-10"
          ],
          "labels": {
            "observed": [
              "Observed event",
              "已发生事件"
            ],
            "plan": [
              "Announced plan",
              "已公布计划"
            ],
            "scenario": [
              "Scenario",
              "情景"
            ]
          },
          "caption": [
            "Alternative paths, not committed construction.",
            "这是发展情景，并非已承诺的建设。"
          ],
          "extra": {
            "historyNodes": [
              {
                "id": "H-FI-01",
                "title": [
                  "{historyNode}: Finnish–Swedish connection opens",
                  "{historyNode}：芬瑞电网连接投运"
                ]
              },
              {
                "id": "H-FI-02",
                "title": [
                  "{historyNode}: Finland joins Elspot; intraday trading follows",
                  "{historyNode}：芬兰加入Elspot，随后开展日内交易"
                ]
              },
              {
                "id": "H-FI-03",
                "title": [
                  "{historyNode}: hourly FCR records, FFR introduction, then FCR-D down procurement",
                  "{historyNode}：可查小时FCR记录，随后引入FFR及FCR-D下调采购"
                ]
              },
              {
                "id": "H-FI-04",
                "title": [
                  "{historyNode}: {plantName} regular production begins",
                  "{historyNode}：{plantName}开始常规发电"
                ]
              },
              {
                "id": "H-FI-05",
                "title": [
                  "{historyNode}: connected storage already exceeds the fast-product scale",
                  "{historyNode}：并网储能已超过快速备用品种规模"
                ]
              },
              {
                "id": "H-FI-06",
                "title": [
                  "{historyNode}: Fingrid announces the hourly procurement shift",
                  "{historyNode}：Fingrid公布转向小时采购的决定"
                ]
              }
            ],
            "vision": [
              "Vision origin: {historyNode}; horizon: {visionHorizon}. Possible paths, not assets built",
              "愿景起点：{historyNode}；目标年份：{visionHorizon}。可能的发展路径，并非已建资产"
            ],
            "futureMarker": {
              "level": "thin",
              "change": [
                "review of the historical causal links; future quantities require the underlying scenario tables.",
                "复核历史因果关系；未来数量还须核对原始情景表。"
              ]
            }
          }
        },
        {
          "id": "fi-04",
          "chapter": "choices",
          "scene": "fi-protected-loss",
          "question": [
            "What changed when {plantName} entered regular operation?",
            "{plantName}开始常规发电后，系统面临什么变化？"
          ],
          "copy": [
            "{plantName} began regular production on {ol3RegularDate}. A large unit can disappear suddenly, so its connection required special protection and reserve preparations. The protection reduces the net loss the grid must cover.",
            "{plantName}于{ol3RegularDate}开始常规发电。大型机组可能突然停机，因此接入时需要专门保护和备用准备；保护措施会降低电网实际需要承受的净缺口。"
          ],
          "meaning": [
            "The reserve task gives this battery a market to compete in; it still needs trading and a negotiated floor.",
            "备用任务为本方案的电池提供了竞争市场；投资仍需交易和协商保底支撑。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a reviewed, comparable reserve series quantifying the increment attributable to {plantName}.",
              "经复核、口径可比的备用序列，量化{plantName}带来的新增需求。"
            ]
          },
          "controls": [
            [
              "Unit trips",
              "机组停机"
            ],
            [
              "Show protection",
              "显示保护措施"
            ]
          ],
          "claims": [
            "CL-FI-03"
          ],
          "labels": {
            "output": [
              "Unit output: {ol3Output}",
              "机组出力：{ol3Output}"
            ],
            "netStep": [
              "Protected net step: {ol3NetStep}",
              "保护后净缺口：{ol3NetStep}"
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
          "id": "fi-05",
          "chapter": "tensions",
          "scene": "fi-need",
          "question": [
            "Is fast-reserve need growing as fast as potential supply?",
            "快速备用需求，增长得和潜在供给一样快吗？"
          ],
          "copy": [
            "Storage was already above Finland's gross fast-reserve scale by {connectedDate}. The chart marks that observation; the exact crossing date is unknown. Connected power is potential supply, not qualified bids.",
            "到{connectedDate}，储能装机已超过芬兰各快速备用品种的合计规模。图中标的是观测时点，准确越过日期尚不清楚。并网功率是潜在供给，并非合格报价量。"
          ],
          "meaning": [
            "Trading and a negotiated floor carry this play because the fast-reserve market is small relative to connected storage.",
            "快速备用市场相对并网储能规模较小，因此本方案由交易和协商保底支撑。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "comparable earlier connected-capacity observations and reviewed product-level available supply.",
              "更早且口径可比的并网容量观测，以及经复核的各品种可用供给。"
            ]
          },
          "controls": [
            [
              "Current scale",
              "当前规模"
            ],
            [
              "Procurement history",
              "采购历史"
            ],
            [
              "Show definitions",
              "查看口径"
            ]
          ],
          "claims": [
            "CL-FI-02"
          ],
          "labels": {
            "connected": [
              "Connected estimate",
              "并网容量估计"
            ],
            "technical": [
              "Technical capacity in network model",
              "网模技术容量"
            ],
            "obligations": [
              "Fast product obligations",
              "快速备用品种义务量"
            ]
          },
          "caption": [
            "Already above by {connectedDate}; exact crossing date unknown",
            "截至{connectedDate}已超过；准确越过日期未知"
          ]
        },
        {
          "id": "fi-06",
          "chapter": "tensions",
          "scene": "fi-prices",
          "question": [
            "Does a reserve price tell me what a battery earns?",
            "备用价格能直接告诉我电池赚多少吗？"
          ],
          "copy": [
            "Fingrid bought less from the yearly route at lower prices, and bought no FCR-N there for {annualDeliveryYear}. That is no purchase, not a zero-price award. Hourly capacity prices show the auction; earnings depend on what the battery wins and delivers.",
            "在{annualDeliveryYear}交付期，Fingrid年度采购量和价格下降，并未通过年度市场采购FCR-N。这是没有采购，并非零价中标。小时容量价格反映拍卖结果；电池收入取决于实际中标与履约。"
          ],
          "meaning": [
            "The reserve line depends on accepted and delivered MW; trading and the floor carry the wider case.",
            "备用收入取决于获接受且履约的MW；整体投资逻辑则由交易和保底支撑。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "reviewed bids, delivered MW, activation and net-cost evidence for the proposed asset.",
              "核验拟投项目的报价、履约MW、调用及净成本证据。"
            ]
          },
          "controls": [
            [
              "Inspect capacity prices",
              "查看容量价格"
            ],
            [
              "Choose product",
              "选择品种"
            ],
            [
              "Coverage and source",
              "覆盖期与来源"
            ]
          ],
          "claims": [
            "CL-FI-07"
          ],
          "labels": {
            "price": [
              "Capacity price",
              "容量价格"
            ],
            "unit": [
              "EUR/MW/h",
              "欧元/MW/小时"
            ],
            "auction": [
              "Auction price",
              "拍卖价格"
            ],
            "capture": [
              "Captured earnings require dispatch and cost evidence",
              "实际收益还须有调度与成本证据"
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
          "id": "fi-07",
          "chapter": "battery",
          "scene": "fi-headroom",
          "question": [
            "What does the battery change physically?",
            "电池在物理上改变了什么？"
          ],
          "copy": [
            "The battery changes its power quickly. Discharging or reducing charging can help an upward response; charging or reducing discharge can help downward. Its stored energy and empty space limit how long that response lasts.",
            "电池可以迅速改变功率。放电或减少充电可帮助上调，充电或减少放电可帮助下调。已存电量与剩余可充空间，决定响应能持续多久。"
          ],
          "meaning": [
            "Usable energy and headroom determine how much response this play can deliver.",
            "可用电量和功率余量决定本方案能够提供多少响应。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "tested usable energy, control performance and connection limits for the asset.",
              "项目可用电量、控制性能及并网限制的测试结果。"
            ]
          },
          "controls": [
            [
              "Respond upward",
              "向上响应"
            ],
            [
              "Respond downward",
              "向下响应"
            ],
            [
              "Reset example",
              "重置示例"
            ]
          ],
          "claims": [
            "CL-FI-01"
          ],
          "labels": {
            "energy": [
              "Energy available",
              "可放电量"
            ],
            "space": [
              "Space to charge",
              "可充空间"
            ],
            "headroom": [
              "Power headroom",
              "功率余量"
            ],
            "example": [
              "Example",
              "示例"
            ]
          }
        },
        {
          "id": "fi-08",
          "chapter": "battery",
          "scene": "fi-duration",
          "question": [
            "Why is this play {playDuration} hours?",
            "为什么这条投资路线选择{playDuration}小时？"
          ],
          "copy": [
            "The current play uses {playDuration} hours. Trading carries its revenue, while reserves reward qualified response capability. The model prefers this design on its present cost and revenue assumptions; product rules still require enough usable energy and headroom.",
            "当前路线采用{playDuration}小时。交易支撑收入，备用则奖励符合要求的响应能力。在现有成本与收入假设下，模型优选这一设计；产品规则仍要求足够的可用电量和功率余量。"
          ],
          "meaning": [
            "The play's {playDuration}-hour design balances trading value and reserve capability against capital cost.",
            "本方案采用{playDuration}小时设计，权衡交易价值、备用能力与资本成本。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a changed duration result, trading capture, usable-energy specification or qualification requirement.",
              "时长测算、交易收益实现、可用电量规格或资格要求发生变化。"
            ]
          },
          "controls": [
            [
              "Current play",
              "当前路线"
            ],
            [
              "Longer teaching battery",
              "更长时长示例"
            ],
            [
              "Open duration evidence",
              "查看时长依据"
            ]
          ],
          "claims": [
            "CL-FI-09"
          ],
          "labels": {
            "energy": [
              "More energy",
              "更多电量"
            ],
            "capital": [
              "More capital",
              "更多资本投入"
            ],
            "use": [
              "Value depends on use",
              "价值取决于用途"
            ]
          },
          "extra": {
            "exits": [
              {
                "anchor": "bankable",
                "label": [
                  "Open duration evidence",
                  "查看时长依据"
                ]
              }
            ]
          }
        },
        {
          "id": "fi-09",
          "chapter": "battery",
          "scene": "fi-qualification",
          "question": [
            "Does a connected battery have a right to reserve income?",
            "电池并网后，就有权获得备用收入吗？"
          ],
          "copy": [
            "Connection opens the physical route. Reserve participation still needs the current product approval, agreements, communications and an accepted bid. Shared power and energy cannot be promised twice.",
            "并网打通的是物理通道。参与备用市场仍须完成现行品种审批、签订协议、建立通信，并获得报价接受。同一份功率和电量不能重复承诺。"
          ],
          "meaning": [
            "The play needs qualified, compatible commitments before reserve revenue can support the case.",
            "备用收入要支撑本方案，须先具备相应资格，并确保各项承诺彼此兼容。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "current approval, communications tests and compatible dispatch obligations for the project.",
              "项目现行资格批准、通信测试及彼此兼容的调度义务得到核实。"
            ]
          },
          "controls": [
            [
              "Requirements",
              "参与要求"
            ],
            [
              "Show a conflict",
              "显示冲突示例"
            ]
          ],
          "claims": [
            "CL-FI-01"
          ],
          "labels": {
            "committed": [
              "Headroom already committed",
              "余量已被占用"
            ],
            "unknown": [
              "Project feasibility unknown",
              "项目可行性尚未核实"
            ]
          },
          "extra": {
            "steps": [
              [
                "Connection",
                "并网接入"
              ],
              [
                "Approval",
                "资格审批"
              ],
              [
                "accepted bid",
                "报价接受"
              ],
              [
                "delivery obligation",
                "履约义务"
              ],
              [
                "settled",
                "结算"
              ]
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
          "id": "fi-10",
          "chapter": "payment",
          "scene": "fi-payment",
          "question": [
            "Who pays for what?",
            "谁为何种服务付钱？"
          ],
          "copy": [
            "Fingrid pays for accepted reserve capability held ready. Activation energy is settled under the relevant product's rules; trading earns a separate market margin. A reserve-capacity award is a delivery obligation, not a long-term revenue floor.",
            "Fingrid为获接受并保持待命的备用能力付费。调用电量按相应品种规则结算，交易另赚市场价差。备用容量中标带来履约义务，并不等于长期收入保底。"
          ],
          "meaning": [
            "The modelled floor secures part of revenue for {securedTenor} years, followed by merchant exposure.",
            "模型保底在{securedTenor}年内锁定部分收入，此后承担市场风险。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "verified settlement and owner-payment terms, deductions and permitted market rights.",
              "结算、业主收款、扣款及获准市场权利等条款得到核实。"
            ]
          },
          "controls": [
            [
              "Capacity",
              "容量"
            ],
            [
              "Activation energy",
              "调用电量"
            ],
            [
              "Trading",
              "电力交易"
            ]
          ],
          "claims": [
            "CL-FI-07",
            "CL-FI-08"
          ],
          "labels": {
            "capacityUnit": [
              "EUR/MW/h",
              "容量欧元/MW/小时"
            ],
            "energyUnit": [
              "EUR/MWh",
              "电量欧元/MWh"
            ],
            "fcrEnergy": [
              "FCR-N: energy settlement",
              "FCR-N：调用电量另行结算"
            ],
            "noEnergyFee": [
              "FCR-D / FFR: no separate energy-market fee shown",
              "FCR-D / FFR：此处不列独立电量市场报酬"
            ],
            "restoreEnergy": [
              "aFRR / mFRR: energy settlement",
              "aFRR / mFRR：调用电量另行结算"
            ]
          },
          "extra": {
            "actors": [
              [
                "owner",
                "业主"
              ],
              [
                "BSP",
                "BSP"
              ],
              [
                "Fingrid",
                "Fingrid"
              ]
            ]
          }
        },
        {
          "id": "fi-11",
          "chapter": "payment",
          "scene": "fi-floor",
          "question": [
            "What is actually secured, and until when?",
            "究竟锁定了什么，锁定到什么时候？"
          ],
          "copy": [
            "The optimiser floor is the secured part of this modelled route: {securedShare} of first-year revenue for {securedTenor} years. The model keeps revenue above the floor. After the floor expires, revenue reverts to merchant exposure unless a replacement contract is signed.",
            "这条模型路线的锁定部分来自优化商保底：首年收入的{securedShare}，期限为{securedTenor}年。模型保留高于保底的收入；保底到期后，若未签新合同，收入恢复市场风险敞口。"
          ],
          "meaning": [
            "The floor's value depends on the counterparty and terms the owner can enforce.",
            "保底的价值取决于对手方，以及业主能够执行的合同条款。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "a signed, enforceable floor with reviewed counterparty, deductions, termination and expiry terms.",
              "取得已签署且可执行的保底合同，并核验对手方、扣款、终止与到期条款。"
            ]
          },
          "controls": [
            [
              "During the floor",
              "保底期内"
            ],
            [
              "After expiry",
              "到期以后"
            ],
            [
              "Contract evidence",
              "合同证据"
            ]
          ],
          "claims": [
            "CL-FI-09"
          ],
          "labels": {
            "floor": [
              "Modelled floor",
              "模型保底"
            ],
            "upside": [
              "Market upside",
              "市场超额收入"
            ],
            "merchant": [
              "Merchant after expiry",
              "到期后承担市场风险"
            ],
            "unverified": [
              "Project contract not verified",
              "项目合同尚未核验"
            ]
          },
          "extra": {
            "exits": [
              {
                "anchor": "bankable",
                "label": [
                  "Contract evidence",
                  "合同证据"
                ]
              }
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
          "id": "fi-12",
          "chapter": "investment",
          "scene": "fi-overview",
          "question": [
            "What would make this play less attractive?",
            "什么变化会让这条投资路线失去吸引力？"
          ],
          "copy": [
            "More competing storage, lower reserve prices or a weaker floor can erode the case. Domestic FCR procurement moves to hourly auctions in {fcrHourlyYear}; later yearly-market policy is undecided. The ministry now expects the grid-priority proposal in {billSubmissionMonth}. Check the signed floor and connection before pricing. Then {nextAction}.",
            "更多储能竞争、更低备用价格或更弱保底，都可能侵蚀投资逻辑。{fcrHourlyYear}年，芬兰国内FCR转为小时采购；此后年度市场是否继续尚未决定。主管部门目前预计于{billSubmissionMonth}提交并网优先顺序提案。定价前，先核验已签保底与并网条件。随后显示{nextAction}。"
          ],
          "meaning": [
            "The entry price must work with the signed floor, connection conditions and downside.",
            "进入价格须与已签保底、并网条件及下行情景相匹配。"
          ],
          "marker": {
            "level": "fair",
            "change": [
              "the enacted priority rules, updated qualified supply and prices, or the project's signed floor and downside.",
              "正式生效的并网优先规则、更新后的合格供给与价格，或项目已签保底与下行情景。"
            ]
          },
          "controls": [
            [
              "More storage",
              "更多储能"
            ],
            [
              "Lower clearing prices",
              "出清价格下降"
            ],
            [
              "Procurement and connection rules",
              "采购与并网规则"
            ],
            [
              "Floor expiry",
              "保底到期"
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
            "CL-FI-02",
            "CL-FI-04",
            "CL-FI-05",
            "CL-FI-07",
            "CL-FI-09"
          ],
          "extra": {
            "factors": [
              {
                "id": "storage",
                "affects": [
                  "More available competitors can reduce the value of the marginal reserve bid",
                  "更多可用竞争者，可能压低边际备用报价的价值"
                ]
              },
              {
                "id": "price",
                "affects": [
                  "A lower clearing price reduces capacity receipts only for the MW actually accepted and maintained",
                  "出清价格下降会减少实际获接受且履约的容量收入"
                ]
              },
              {
                "id": "rules",
                "affects": [
                  "More hourly procurement changes bidding exposure; proposed connection priorities can alter access and timing",
                  "更多小时采购会改变报价风险；拟议并网优先顺序可能影响接入与时间"
                ]
              },
              {
                "id": "expiry",
                "affects": [
                  "After the agreed floor term, a new contract is a new negotiation",
                  "约定保底到期后，新合同需要重新谈判"
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
    "Common navigation": [
      "Previous; Next; Chapters; Open evidence; Close evidence; Back to market",
      "上一节；下一节；章节；查看证据；关闭证据；返回市场"
    ],
    "Evidence drawer": [
      "Source; Locator; Checked on {sourceCheckedDate}; Definition",
      "来源；具体位置；核查时间：{sourceCheckedDate}；统计口径"
    ],
    "Marker line": [
      "What would change it:",
      "会改变判断的证据："
    ],
    "Non-price source date label": [
      "Source date: {historyNode}",
      "来源事件日期：{historyNode}"
    ],
    "Diagram / history legend": [
      "Schematic; Observed event; Announced plan; Scenario; Example",
      "示意；已发生事件；已公布计划；情景；示例"
    ],
    "Nordic map": [
      "Finland; Sweden; Norway; Eastern Denmark; Nordic synchronous area",
      "芬兰；瑞典；挪威；丹麦东部；北欧同步区"
    ],
    "H-FI-01": [
      "{historyNode}: Finnish–Swedish connection opens",
      "{historyNode}：芬瑞电网连接投运"
    ],
    "H-FI-02": [
      "{historyNode}: Finland joins Elspot; intraday trading follows",
      "{historyNode}：芬兰加入Elspot，随后开展日内交易"
    ],
    "H-FI-03": [
      "{historyNode}: hourly FCR records, FFR introduction, then FCR-D down procurement",
      "{historyNode}：可查小时FCR记录，随后引入FFR及FCR-D下调采购"
    ],
    "H-FI-04": [
      "{historyNode}: {plantName} regular production begins",
      "{historyNode}：{plantName}开始常规发电"
    ],
    "H-FI-05": [
      "{historyNode}: connected storage already exceeds the fast-product scale",
      "{historyNode}：并网储能已超过快速备用品种规模"
    ],
    "H-FI-06": [
      "{historyNode}: Fingrid announces the hourly procurement shift",
      "{historyNode}：Fingrid公布转向小时采购的决定"
    ],
    "Future vision": [
      "Vision origin: {historyNode}; horizon: {visionHorizon}. Possible paths, not assets built",
      "愿景起点：{historyNode}；目标年份：{visionHorizon}。可能的发展路径，并非已建资产"
    ],
    "Signature chart axis / definition": [
      "Date; Power · MW; Gross product commitments, not simultaneous battery output",
      "日期；功率 · MW；各品种承诺量合计，并非电池同时出力"
    ],
    "Signature chart history mode": [
      "Average procured capacity; annual obligation is a different measure",
      "平均采购容量；与年度义务量口径不同"
    ],
    "Signature chart storage definition": [
      "Network-model capacity includes some units approaching operation; it differs from the all-size connected estimate",
      "网模容量含部分即将运行的设备，与包含小型系统的并网估计不同"
    ],
    "Battery / station": [
      "Battery modules; Inverter; Transformer; Controls; Safety systems; Connection; Usable energy; Charge; Discharge",
      "电池模块；逆变器；变压器；控制系统；安全系统；并网接入；可用电量；充电；放电"
    ],
    "Price evidence accessible summary": [
      "{productTerms} capacity price, EUR/MW/h; coverage {priceCoverage}. Auction observations, not captured earnings",
      "{productTerms}容量价格，欧元/MW/小时；覆盖期{priceCoverage}。这是拍卖观测，不是已实现收益"
    ],
    "More-storage factor": [
      "More available competitors can reduce the value of the marginal reserve bid",
      "更多可用竞争者，可能压低边际备用报价的价值"
    ],
    "Price factor": [
      "A lower clearing price reduces capacity receipts only for the MW actually accepted and maintained",
      "出清价格下降会减少实际获接受且履约的容量收入"
    ],
    "Rule factor": [
      "More hourly procurement changes bidding exposure; proposed connection priorities can alter access and timing",
      "更多小时采购会改变报价风险；拟议并网优先顺序可能影响接入与时间"
    ],
    "Expiry factor": [
      "After the agreed floor term, a new contract is a new negotiation",
      "约定保底到期后，新合同需要重新谈判"
    ],
    "Loading / retry": [
      "Loading source data…; Could not load data; Retry; Quantitative history not yet available",
      "正在载入来源数据…；数据未能载入；重试；量化历史暂不可用"
    ],
    "Missing financial binding": [
      "Current case unavailable; review the market case",
      "当前情景暂不可用；请查看市场方案"
    ],
    "Reduced motion / text alternative": [
      "Read the explanation; the selected state is shown without animation",
      "阅读文字说明；当前选择直接显示，无需动画"
    ],
    "Fingrid attribution": [
      "Source: Fingrid open data (CC BY 4.0)",
      "来源：Fingrid 开放数据（CC BY 4.0）"
    ]
  }
};
