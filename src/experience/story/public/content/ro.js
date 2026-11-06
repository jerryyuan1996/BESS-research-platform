/* Public edition: editorial review pending. Original approvals unchanged. */
export default {
  "marketId": "ro",
  "legacyVersion": "2026-11-02",
  "script": "docs/immersive-experience-plan/romania-storyboard.md",
  "extracts": {
    "history": [
      {
        "shotId": "ro-02",
        "question": [
          "Why does a Romanian battery start from a traded price?",
          "为什么罗马尼亚电池的收入从可交易的价格出发？"
        ],
        "text": [
          "Since 30 June 2005, Romania's exchange has run a day-ahead auction in which buyers and sellers both bid. In November 2014 it was coupled with the Czech, Slovak and Hungarian markets, and in 2021 with the European day-ahead coupling, including the border with Bulgaria. Coupled markets share one price until the interconnector between them is full.",
          "自2005年6月30日起，罗马尼亚电力交易所开始运行买卖双方共同报价的日前竞价市场。2014年11月，该市场与捷克、斯洛伐克和匈牙利市场耦合；2021年又并入欧洲日前耦合，其中包括与保加利亚的边境。相互耦合的市场共享同一价格，直到彼此之间的联络线满载为止。"
        ],
        "claimIds": [
          "CL-RO-03"
        ],
        "sourceIds": [
          "SRC-RO-08",
          "SRC-RO-09",
          "SRC-RO-10",
          "SRC-RO-11"
        ]
      }
    ],
    "system": [
      {
        "shotId": "ro-01",
        "question": [
          "What kind of market does a Romanian battery sell into?",
          "罗马尼亚的电池在什么样的市场中出售电力？"
        ],
        "text": [
          "Romania's power comes mostly from hydro, nuclear, gas and lignite, with wind and solar a fast-growing share. The whole country is one price zone, coupled with its neighbours' day-ahead markets. Nobody pays for capacity, so a battery earns only what it trades.",
          "罗马尼亚的电力主要来自水电、核电、天然气和褐煤，风电和光伏的占比正快速上升。全国是一个价区，与邻国的日前市场相耦合。这里没有人为容量付费，电池只能靠交易获得收入。"
        ],
        "claimIds": [
          "CL-RO-03",
          "CL-RO-04"
        ],
        "sourceIds": [
          "SRC-RO-08",
          "SRC-RO-09",
          "SRC-RO-10",
          "SRC-RO-11",
          "REPO-RO-MODEL"
        ]
      },
      {
        "shotId": "ro-04",
        "question": [
          "Why is the gap between cheap and dear hours so wide?",
          "便宜时段与高价时段之间的差距为何这么大？"
        ],
        "text": [
          "Solar is being built fast, on rooftops and in large parks, so midday power is cheap. After sunset the solar is gone while demand stays high, so the evening price is set by the scarcer, dearer supply that is left: hydro, gas and imports. A battery buys at midday and sells in the evening.",
          "屋顶光伏和大型光伏电站都在快速建设，因此中午的电价低廉。日落后光伏出力消失，需求却依然很高，傍晚电价便由剩余的、更稀缺也更昂贵的供给决定：水电、天然气和进口电力。电池在中午买电，在傍晚卖电。"
        ],
        "claimIds": [
          "CL-RO-11"
        ],
        "sourceIds": [
          "SRC-RO-01"
        ]
      },
      {
        "shotId": "ro-05",
        "question": [
          "How can neighbouring batteries affect Romania?",
          "邻国电池如何影响罗马尼亚？"
        ],
        "text": [
          "Coupled markets can transmit part of a neighbouring battery fleet’s effect through cross-border trade. The interconnector limits that effect when it is constrained. This story has not established how often the border binds or how large the price effect is.",
          "耦合市场可以通过跨境交易传递邻国电池的部分影响。联络线拥塞时，传递会受到限制。本故事尚未证实边境有多频繁受到约束，也未证实对价格的影响有多大。"
        ],
        "claimIds": [
          "CL-RO-09",
          "CL-RO-10"
        ],
        "sourceIds": [
          "SRC-RO-15",
          "REPO-RO-MODEL"
        ]
      }
    ],
    "mechanism": []
  },
  "basis": [],
  "timeline": [
    [
      "2005-06-30",
      "Two-sided day-ahead auction",
      "双边日前竞价"
    ],
    [
      "2014-11",
      "Four-market coupling",
      "四国市场耦合"
    ],
    [
      "2021",
      "European day-ahead coupling",
      "欧洲日前耦合"
    ]
  ],
  "sourceIdsByChapter": {
    "history": [
      "SRC-RO-08",
      "SRC-RO-09",
      "SRC-RO-10",
      "SRC-RO-11"
    ],
    "system": [
      "SRC-RO-08",
      "SRC-RO-09",
      "SRC-RO-10",
      "SRC-RO-11",
      "REPO-RO-MODEL",
      "SRC-RO-01",
      "SRC-RO-15"
    ],
    "mechanism": []
  },
  "payment": [
    "Trading and balancing pay market revenues. A private optimiser floor, if executed, is a different promise: inspect the payment, duration, fee, availability test and counterparty. Local reserve results are needed before treating a curve calibrated elsewhere as Romanian evidence.",
    "交易和平衡服务产生市场收入。已签署的私人优化商保底是另一种承诺：须核对付款、期限、费用、可用率测试和对手方。将境外标定曲线视为罗马尼亚证据之前，需要本地备用采购结果。"
  ],
  "constraint": [
    "Solar surplus / coupled border limits",
    "光伏富余／耦合边境限制"
  ],
  "payer": [
    "Energy spread / balancing awards",
    "电能量价差／平衡中标"
  ],
  "sources": {
    "SRC-RO-01": {
      "title": "Sistemul Electroenergetic Național depășește borna de 2.500 MW de noi capacități de producție și stocare conectate la rețea în 2026",
      "url": "https://web.transelectrica.ro/noutati/noutati/734_2026.08.20_19-51-16.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "PDF",
        "pdfPage": [
          1,
          2
        ],
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "p. 1 final paragraph; p. 2 paragraph beginning „Până la sfârșitul anului 2026”"
      },
      "reuse": {
        "status": "public-link-only",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Sursa: Transelectrica, 20 august 2026",
        "constraints": "The release and the checked site material state no reusable-data permission. The link and a qualitative treatment may proceed; the numbers wait for a recorded basis."
      }
    },
    "SRC-RO-03": {
      "title": "Ghidul solicitantului — instalații de stocare autonome, Fondul pentru Modernizare",
      "url": "https://startupcafe.ro/wp-content/uploads/2026/08/Ghidul_solicitantului_instalatii_stocare_autonama_FM.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "PDF",
        "pdfPage": [
          4,
          10,
          33
        ],
        "printedPage": [
          4,
          10,
          33
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "p. 4 opening PNIESC paragraph; p. 10 final paragraph before §1.2; p. 33 §3.1.2"
      },
      "reuse": {
        "status": "copy-pending-comparison",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Sursa: Ministerul Energiei, ghidul solicitantului, Ordinul 915/14.08.2026",
        "constraints": "A third-party copy is not the ministry or Gazette text. Compare the applicable annex, establish version and reuse, and do not ship the copy."
      }
    },
    "SRC-RO-04": {
      "title": "Stand-alone battery storage call page and the notice of an amended call",
      "url": "https://energie.gov.ro/lansare-apel-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-stand-alone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din-fondul-pentru-modernizare-p/",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "call page",
        "pdfPage": null,
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": null
      },
      "reuse": {
        "status": "link-only",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": null,
        "constraints": "Access failure is not evidence of non-publication. No ranking, list or outcome was opened, and none is asserted."
      }
    },
    "SRC-RO-05": {
      "title": "MF 2026-1 RO 0-006 — Supporting investments in stand-alone battery storage installations",
      "url": "https://www.modernisationfund.eu/wp-content/uploads/2026/07/MF-2026-1-RO-0-006-%E2%80%93-Supporting-investments-in-the-development-of-stand-alone-battery-storage-installations-of-electricity.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "PDF",
        "pdfPage": [
          1,
          2,
          3
        ],
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "priority-investment confirmation"
      },
      "reuse": {
        "status": "link-only",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Source: European Investment Bank / Modernisation Fund",
        "constraints": "A programme confirmation names no selected battery and is not an award."
      }
    },
    "SRC-RO-06": {
      "title": "Joint press release: ETS revenues invested in cleaner energy systems in 11 EU countries",
      "url": "https://www.modernisationfund.eu/joint-press-release-e2-5-billion-of-eu-ets-revenues-invested-in-cleaner-energy-systems-in-11-eu-countries/",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "web release",
        "pdfPage": null,
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "opening paragraphs and investment list"
      },
      "reuse": {
        "status": "link-only",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Source: European Commission",
        "constraints": "Money to a state programme is not a beneficiary list and not receipt by a battery owner."
      }
    },
    "SRC-RO-07": {
      "title": "IP/26/524 — Commission approves a Romanian State aid scheme for electricity storage (SA.121308)",
      "url": "https://ec.europa.eu/commission/presscorner/detail/en/ip_26_524",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "press release",
        "pdfPage": null,
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "approval decision and scheme description"
      },
      "reuse": {
        "status": "link-only",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Source: European Commission, 6 March 2026",
        "constraints": "Approval of a scheme is not an award under it."
      }
    },
    "SRC-RO-08": {
      "title": "Annual report 2005",
      "url": "https://ns1.opcom.ro/uploads/doc/rapoarte/Companie/RA_2005_RO.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "PDF",
        "pdfPage": [
          4,
          19
        ],
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "day-ahead market launch, two-sided bidding"
      },
      "reuse": {
        "status": "historical-fact",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Sursa: OPCOM, raport anual 2005",
        "constraints": "Event date and description only; no copied table, chart or report graphic."
      }
    },
    "SRC-RO-09": {
      "title": "4M Market Coupling launched with success",
      "url": "https://epexspot.com/en/news/4m-market-coupling-launched-success",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "web notice",
        "pdfPage": null,
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "launch announcement and success notice"
      },
      "reuse": {
        "status": "historical-fact",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Source: EPEX SPOT",
        "constraints": "Month precision is retained on the page; no price or volume is drawn from this notice."
      }
    },
    "SRC-RO-10": {
      "title": "Interim Coupling project: go-live confirmed for 17 June 2021",
      "url": "https://www.opcom.ro/uploads/doc/Comunicate/Communication%20note%2015.06.2021.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "PDF",
        "pdfPage": 1,
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "go-live date and first delivery"
      },
      "reuse": {
        "status": "historical-fact",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Sursa: OPCOM, 15 iunie 2021",
        "constraints": "Event date only; no price series is drawn from this document."
      }
    },
    "SRC-RO-11": {
      "title": "Closing the loop — inclusion of the Bulgarian-Romanian border into the Single Day-Ahead Coupling",
      "url": "https://nordpoolgroup.com/en/message-center-container/newsroom/exchange-message-list/2021/q4/27-october-2021-closing-the-loop--inclusion-of-the-bulgarian-romanian-border--into-the-single-day-ahead-coupling-sdac",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "web notice",
        "pdfPage": null,
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "effective date, first delivery, joint price and flow calculation"
      },
      "reuse": {
        "status": "historical-fact",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Source: Nord Pool / SDAC",
        "constraints": "No measured flow or capacity figure is taken from this notice."
      }
    },
    "SRC-RO-12": {
      "title": "ANRE elimină dublarea tarifelor pentru energia electrică stocată și reintrodusă în rețea",
      "url": "https://anre.ro/comunicat-de-presa-anre-elimina-dublarea-tarifelor-pentru-energia-electrica-stocata-si-reintrodusa-in-retea/",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "press release",
        "pdfPage": null,
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "scope of the exemption and what still pays"
      },
      "reuse": {
        "status": "historical-fact",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Sursa: ANRE, 8 iulie 2025",
        "constraints": "Event date and the exemption boundary only. The order number and its in-force date are reported, not opened, and are not printed as facts here."
      }
    },
    "SRC-RO-15": {
      "title": "Statistical yearbook 2025, installed-capacity table",
      "url": "https://www.eso.bg/fileObj.php?oid=5908",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "PDF",
        "pdfPage": 3,
        "printedPage": null,
        "table": "installed-capacity table",
        "row": "ОСЕЕ*",
        "column": "MW",
        "clause": "battery definition in the table footnote"
      },
      "reuse": {
        "status": "no-basis-located",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": null,
        "attribution": "Източник: ЕСО ЕАД, статистически годишник 2025",
        "constraints": "No affirmative reuse basis was found in the yearbook or the checked site material. A Romanian licence does not transfer to a Bulgarian source."
      }
    },
    "SRC-RO-13a": {
      "title": "Order 53/2024 on the allocation of connection capacity",
      "url": "https://licitatii.transelectrica.ro/pages/legislatie/1780468203_Ordinul_ANRE_nr._53_din_2024.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "PDF",
        "pdfPage": 6,
        "printedPage": 7,
        "table": null,
        "row": null,
        "column": null,
        "clause": "Annex 1, Art. 1(a)–(c), Art. 2(2), Art. 3(2)(e)"
      },
      "reuse": {
        "status": "limited-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": null,
        "basisLocator": "Annex 1, Art. 1(a)–(c), Art. 2(2), Art. 3(2)(e)",
        "attribution": "Sursa: ANRE, Ordinul nr. 53/2024",
        "constraints": "A legal threshold and allocation lag restated as fact with their clause. No reproduction of the order, its annexes, tables or diagrams. Recorded under ro-build-evidence.md §8; the analyst confirms the basis at G-2."
      }
    },
    "SRC-RO-13b": {
      "title": "Order 79/2025 publishing the 2026 auction session timetable",
      "url": "https://licitatii.transelectrica.ro/pages/legislatie/1780468203_Ordinul_ANRE_nr._79_din_2025.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "PDF",
        "pdfPage": 2,
        "printedPage": 14,
        "table": null,
        "row": null,
        "column": null,
        "clause": "Art. II(f)"
      },
      "reuse": {
        "status": "limited-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": null,
        "basisLocator": "Art. II(f)",
        "attribution": "Sursa: ANRE, Ordinul nr. 79/2025",
        "constraints": "A scheduled rule date restated as fact. It does not establish that an auction ran. No reproduction of the order or its tables."
      }
    }
  },
  "sourceIds": [
    "SRC-RO-08",
    "SRC-RO-09",
    "SRC-RO-10",
    "SRC-RO-11",
    "REPO-RO-MODEL",
    "SRC-RO-01",
    "SRC-RO-15"
  ],
  "legacyScope": {
    "playRef": "ro-mer-2h",
    "hours": 2,
    "call": "opportunistic",
    "on": "2026-11-02",
    "commit": "7e00c1a"
  }
};
