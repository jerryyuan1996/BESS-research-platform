/* Public edition: editorial review pending. Original approvals unchanged. */
export default {
  "marketId": "pl",
  "legacyVersion": "2026-11-01",
  "script": "docs/immersive-experience-plan/poland-storyboard.md",
  "extracts": {
    "history": [],
    "system": [],
    "mechanism": []
  },
  "basis": [
    {
      "shotId": "pl-01",
      "claimIds": [
        "CL-PL-04",
        "CL-PL-05"
      ],
      "sourceIds": [
        "SRC-PL-02"
      ]
    },
    {
      "shotId": "pl-02",
      "claimIds": [
        "CL-PL-03"
      ],
      "sourceIds": [
        "SRC-PL-01",
        "SRC-PL-02"
      ]
    },
    {
      "shotId": "pl-03",
      "claimIds": [
        "CL-PL-06",
        "CL-PL-08",
        "CL-PL-17"
      ],
      "sourceIds": [
        "SRC-PL-10",
        "SRC-PL-11",
        "SRC-PL-12",
        "SRC-PL-16",
        "SRC-PL-07",
        "SRC-PL-15"
      ]
    },
    {
      "shotId": "pl-10",
      "claimIds": [
        "CL-PL-03",
        "CL-PL-13",
        "CL-PL-14"
      ],
      "sourceIds": [
        "SRC-PL-01",
        "SRC-PL-02",
        "SRC-PL-19",
        "SRC-PL-20",
        "SRC-PL-17",
        "SRC-PL-18",
        "SRC-PL-21"
      ]
    }
  ],
  "timeline": [
    [
      "2015",
      "Industrial supply restrictions",
      "工业供电受限"
    ],
    [
      "2017",
      "Capacity market established",
      "建立容量市场"
    ]
  ],
  "sourceIdsByChapter": {
    "history": [
      "SRC-PL-02",
      "SRC-PL-01",
      "SRC-PL-10",
      "SRC-PL-11",
      "SRC-PL-12",
      "SRC-PL-16",
      "SRC-PL-07",
      "SRC-PL-15",
      "SRC-PL-19",
      "SRC-PL-20",
      "SRC-PL-17",
      "SRC-PL-18",
      "SRC-PL-21"
    ],
    "system": [
      "SRC-PL-02",
      "SRC-PL-01",
      "SRC-PL-10",
      "SRC-PL-11",
      "SRC-PL-12",
      "SRC-PL-16",
      "SRC-PL-07",
      "SRC-PL-15",
      "SRC-PL-19",
      "SRC-PL-20",
      "SRC-PL-17",
      "SRC-PL-18",
      "SRC-PL-21"
    ],
    "mechanism": [
      "SRC-PL-02",
      "SRC-PL-01",
      "SRC-PL-10",
      "SRC-PL-11",
      "SRC-PL-12",
      "SRC-PL-16",
      "SRC-PL-07",
      "SRC-PL-15",
      "SRC-PL-19",
      "SRC-PL-20",
      "SRC-PL-17",
      "SRC-PL-18",
      "SRC-PL-21"
    ]
  },
  "payment": [
    "A capacity agreement pays for availability and carries delivery penalties. A construction grant reimburses eligible build costs; it is not recurring operating revenue. Trading remains separate. Earlier capacity factors and a closed grant cohort cannot be applied to an unawarded new project.",
    "容量协议为可用性付费，并附带未履约罚则。建设补贴报销合格建设成本，不是持续运营收入。电力交易另行计算。早期容量系数和已关闭的补贴批次，不能套用到尚未中标的新项目。"
  ],
  "constraint": [
    "Ageing coal fleet / award vintage",
    "老化煤电／中标批次"
  ],
  "payer": [
    "Capacity ≠ construction grant",
    "容量付费 ≠ 建设补贴"
  ],
  "sources": {
    "SRC-PL-01": {
      "title": "Ustawa z dnia 8 grudnia 2017 r. o rynku mocy (Capacity Market Act), consolidated text",
      "url": "https://eli.gov.pl/api/acts/DU/2026/1400/text/T/D20261400L.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "Dz.U. 2026 poz. 1400, consolidated text",
        "printedPage": [
          3,
          17,
          19,
          27,
          37
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "art. 2(1)(1), (3a); art. 25(4)(1)-(5); art. 29(3)(7), 29(4); art. 46(1)(2); art. 61(3)"
      },
      "reuse": {
        "status": "official-act-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: Dziennik Ustaw; URE",
        "constraints": "A normative act is outside copyright under art. 4. Facts are restated with their article; the act itself is not reproduced or hosted."
      }
    },
    "SRC-PL-02": {
      "title": "Decision C(2018) 601 final, State aid SA.46100 (2017/N), Planned Polish capacity mechanism",
      "url": "https://ec.europa.eu/competition/state_aid/cases/272253/272253_1977790_162_2.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "Commission decision, PDF",
        "printedPage": [
          2
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "recital (6), p. 2: the 2015 supply limits; recitals (43), (49)-(50), (109)-(110)"
      },
      "reuse": {
        "status": "official-document-attribution",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Source: European Commission, C(2018) 601 final",
        "constraints": "Restated with attribution; no table or figure is copied. The event date is the Commission’s record, the causal reading stays interpretation."
      }
    },
    "SRC-PL-03": {
      "title": "Decision (EU) 2026/341 granting Poland a derogation under art. 22(4)(b) of Regulation (EU) 2019/943",
      "url": "https://data.europa.eu/eli/dec/2026/341/oj",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "OJ L, Decision (EU) 2026/341",
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "art. 3 and recital (73): the one-year supplementary auctions and their end date"
      },
      "reuse": {
        "status": "official-document-attribution",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Source: European Commission, Decision (EU) 2026/341",
        "constraints": "The 2028 end date belongs to the supplementary product. No terminal date for the quarterly additional auctions is taken from this decision."
      }
    },
    "SRC-PL-05": {
      "title": "Final results of the main auctions for 2021-2025 delivery (Informacje nr 99/2018, 103/2018, 10/2019, 106/2019, 2/2021)",
      "url": "https://www.ure.gov.pl/pl/energia-elektryczna/rynek-mocy/informcjepure",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "five URE notices, index page",
        "printedPage": [
          13,
          10,
          9,
          9,
          6
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "point (c) of each notice; p. 1 supplies delivery year, auction date, notice number and notice date"
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: URE, informacje o ostatecznych wynikach aukcji",
        "constraints": "Official documents, restated with their notice number and point. No notice table or PDF is republished; no participant name is copied."
      }
    },
    "SRC-PL-06": {
      "title": "Informacja nr 2/2022, final results of the main auction for 2026 delivery",
      "url": "https://www.ure.gov.pl/download/9/12529/Ostatecznewynikiaukcjiglownejnarokdostaw2026.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "URE notice 2/2022, PDF",
        "printedPage": [
          12
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "point (c)"
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: URE, informacja nr 2/2022",
        "constraints": "Restated with its notice number and point; no table or notice is republished."
      }
    },
    "SRC-PL-07": {
      "title": "Informacje nr 2/2023 and nr 2/2024, final results of the main auctions for 2027 and 2028 delivery",
      "url": "https://www.ure.gov.pl/download/9/13461/20230109INFOPUREwynikiaukcjiglownejnarokdostaw2027.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "two URE notices, PDFs",
        "printedPage": [
          9,
          13
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "point (c) of each notice; the 2028 unit list for the term cross-check"
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: URE, informacje nr 2/2023 i 2/2024",
        "constraints": "Restated with notice number and point. The unit list is used only as a count and a term cross-check, never copied."
      }
    },
    "SRC-PL-08": {
      "title": "Informacja nr 02/2025, final results of the main auction for 2029 delivery",
      "url": "https://www.ure.gov.pl/download/9/15112/Ostateczneogloszeniewynikowaukcjiglownejna2029.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "URE notice 02/2025, PDF",
        "printedPage": [
          18
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "point (c)"
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: URE, informacja nr 02/2025",
        "constraints": "Restated with its notice number and point; nothing is republished."
      }
    },
    "SRC-PL-09": {
      "title": "Informacja nr 44/2025, final results of the catch-up auction for 2029 delivery",
      "url": "https://www.ure.gov.pl/download/9/15656/Ogloszenieostatecznychwynikowaukcjidogrywkowejna2029.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "URE notice 44/2025, PDF",
        "printedPage": [
          5
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "point (c)"
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: URE, informacja nr 44/2025",
        "constraints": "A separate product at the same delivery year; restated with its own notice number, never merged with the main auction."
      }
    },
    "SRC-PL-10": {
      "title": "Auction-parameter regulations for 2021-2027 delivery (battery factor)",
      "url": "https://eli.gov.pl/api/acts/DU/2022/1690/text/O/D20221690.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "five Dziennik Ustaw regulations",
        "printedPage": [
          3,
          2,
          2,
          2,
          2
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "chapter 1 factor list: the 2018 regulation’s battery row is item 8, contrary to the register’s generic \"same item\"; later regulations item 9"
      },
      "reuse": {
        "status": "official-act-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: Dziennik Ustaw",
        "constraints": "Normative acts outside copyright. Each factor is restated with its Dz.U. number and item; no annex is reproduced."
      }
    },
    "SRC-PL-11": {
      "title": "Auction-parameter regulations for 2028, 2029 and the 2029 catch-up auction (battery factor)",
      "url": "https://api.sejm.gov.pl/eli/acts/DU/2024/1154/text.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "three Dziennik Ustaw regulations",
        "printedPage": [
          2,
          2,
          2
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "chapter 1 item 9; the catch-up regulation’s § 9 item 9"
      },
      "reuse": {
        "status": "official-act-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: Dziennik Ustaw",
        "constraints": "Normative acts outside copyright. The 2029 main auction and the catch-up auction keep separate factors and separate items."
      }
    },
    "SRC-PL-12": {
      "title": "Auction-parameter regulation for 2030 delivery and the additional auctions for 2027",
      "url": "https://api.sejm.gov.pl/eli/acts/DU/2025/1066/text.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "Dz.U. 2025 poz. 1066",
        "printedPage": [
          2
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "§ 10 item 9: 13.39 %, pumped storage grouped with batteries"
      },
      "reuse": {
        "status": "official-act-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: Dziennik Ustaw",
        "constraints": "This row groups pumped storage with batteries; the factor is restated as decided, not as a battery-only observation."
      }
    },
    "SRC-PL-15": {
      "title": "Regulamin Rynku Mocy (capacity market rules), update card RRM/Z/16/2026",
      "url": "https://www.pse.pl/documents/20182/51490/RRM_Z_16_2026.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "RRM, PDF",
        "printedPage": [
          35,
          43
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "pkt 6.3.2.5 and 7.4.2.1(8)"
      },
      "reuse": {
        "status": "limited-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": null,
        "basisLocator": "pkt 7.4.2.1(8), p. 43",
        "attribution": "Źródło: PSE, Regulamin Rynku Mocy",
        "constraints": "Link only: the rule is restated as fact with its clause and the rules PDF is neither copied nor hosted. The version is the one the URE approval of 9 September made effective on 1 November; the PDF’s earlier preparation date is not its effective date. PSE site terms remain unchecked, which is why this stays link-only."
      }
    },
    "SRC-PL-16": {
      "title": "Magazynowanie energii elektrycznej - Raport 2024",
      "url": "https://www.ure.gov.pl/download/9/14751/Raportmagazynyenergii.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "URE storage report 2024, PDF",
        "printedPage": [
          6,
          7
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "Figure 1, electrochemical-storage series by delivery year (p. 6); first paragraph (p. 7): 33 units and 1,734 MW from the 2023 auction"
      },
      "reuse": {
        "status": "official-material-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: URE, Raport 2024 - magazynowanie energii elektrycznej",
        "constraints": "B-PL-RIGHTS closed at G-2 on 3 November 2026: official material on the art. 4 basis, with the analyst recording this source-by-source disposition. Extracted facts and an original drawing only; no report image, figure or table is republished."
      }
    },
    "SRC-PL-17": {
      "title": "Programme page for electricity storage with the 8 December 2025 results notice and the 12 December 2025 update",
      "url": "https://www.gov.pl/web/funduszmodernizacyjny/magazyny-energii-elektrycznej-i-zwiazana-z-nimi-infrastruktura-dla-poprawy-stabilnosci-polskiej-sieci-elektroenergetycznej2",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "programme page, HTML",
        "printedPage": null,
        "table": null,
        "row": null,
        "column": null,
        "clause": "headings 08.12.2025 and 12.12.2025 and the updated-list link"
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: NFOŚiGW, Fundusz Modernizacyjny",
        "constraints": "Dates only. The file’s internal preparation date is not its publication date, and a list place is not a commitment."
      }
    },
    "SRC-PL-18": {
      "title": "Ranking lists, original and updated",
      "url": "https://www.gov.pl/attachment/20702c51-561a-418d-898e-e84139263bfb",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "updated ranking list, PDF",
        "printedPage": [
          1,
          9
        ],
        "table": "numbered ranking rows 1-181",
        "row": "rows with Forma dofinansowania = Dotacja and a positive recommended amount",
        "column": "Rekomendowane dofinansowanie (zł); Koszt całkowity (zł)",
        "clause": null
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: NFOŚiGW, lista rankingowa",
        "constraints": "Counts and sums computed from the rows; no recipient name, project name or contract identifier is copied."
      }
    },
    "SRC-PL-19": {
      "title": "Regulation on NFOŚiGW state aid for electricity storage",
      "url": "https://api.sejm.gov.pl/eli/acts/DU/2025/280/text.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "Dz.U. 2025 poz. 280",
        "printedPage": [
          2,
          3
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "§ 6(1)-(3); § 7(2); § 9(2); § 13"
      },
      "reuse": {
        "status": "official-act-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: Dziennik Ustaw",
        "constraints": "The delay bands are statutory and carry a force-majeure qualification; they are not a straight-line monthly cut."
      }
    },
    "SRC-PL-21": {
      "title": "Signed agreements, storage-programme table",
      "url": "https://www.gov.pl/web/funduszmodernizacyjny/zawarte-umowy",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "signed-agreements page, HTML",
        "printedPage": null,
        "table": "storage programme, rows with Forma dofinansowania = Dotacja",
        "row": null,
        "column": null,
        "clause": null
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: NFOŚiGW, zawarte umowy",
        "constraints": "A count of distinct grant-agreement rows, excluding the nine loan rows and later programmes’ tables. No recipient name or contract identifier is retained."
      }
    },
    "SRC-PL-26": {
      "title": "Informacja nr 1/2026, final results of the main auction for 2030 delivery",
      "url": "https://www.ure.gov.pl/download/9/15928/InformacjaPrezesaUrzeduRegulacjiEnergetykiNr12026.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "URE notice 1/2026, PDF",
        "printedPage": [
          12
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "point (c)"
      },
      "reuse": {
        "status": "official-document-factual-summary",
        "permitsNumericPublication": true,
        "basisUrl": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
        "basisLocator": "Copyright Act art. 4, printed/PDF p. 3 (SRC-PL-24)",
        "attribution": "Źródło: URE, informacja nr 1/2026",
        "constraints": "The last scheduled main auction. Restated with its notice number and point; the unit list is not used to infer a technology split."
      }
    },
    "SRC-PL-24": {
      "title": "Ustawa o prawie autorskim i prawach pokrewnych (Copyright Act), consolidated text",
      "url": "https://api.sejm.gov.pl/eli/acts/DU/2025/24/text.pdf",
      "checkedOn": "2026-11-02",
      "locator": {
        "document": "Dz.U. 2025 poz. 24",
        "printedPage": [
          3
        ],
        "table": null,
        "row": null,
        "column": null,
        "clause": "art. 4"
      },
      "reuse": {
        "status": "legal-basis",
        "permitsNumericPublication": false,
        "basisUrl": null,
        "basisLocator": "art. 4",
        "attribution": null,
        "constraints": "The basis other sources cite for reuse; it publishes no figure of its own."
      }
    }
  },
  "sourceIds": [
    "SRC-PL-02",
    "SRC-PL-01",
    "SRC-PL-10",
    "SRC-PL-11",
    "SRC-PL-12",
    "SRC-PL-16",
    "SRC-PL-07",
    "SRC-PL-15",
    "SRC-PL-19",
    "SRC-PL-20",
    "SRC-PL-17",
    "SRC-PL-18",
    "SRC-PL-21"
  ],
  "legacyScope": {
    "playRef": "pl-grant-4h",
    "hours": 4,
    "call": "opportunistic",
    "on": "2026-11-01",
    "commit": "474766e",
    "lens": "infraFund"
  }
};
