/* Public edition: editorial review pending. Original approvals unchanged. */
export default {
  "marketId": "de",
  "legacyVersion": "2026-10-31",
  "script": "docs/immersive-experience-plan/germany-storyboard.md",
  "extracts": {
    "history": [],
    "system": [
      {
        "shotId": "de-01",
        "question": [
          "What makes this a merchant opportunity?",
          "这里为什么有市场化交易机会？"
        ],
        "text": [
          "Germany has a deeply traded power benchmark. A battery can sell flexibility into that market; its revenue still depends on the price and its access.",
          "德国拥有交易活跃的电力基准市场。电池可以向市场出售灵活性，收入仍取决于成交价格和市场准入。"
        ],
        "claimIds": [
          "CL-DE-03"
        ],
        "sourceIds": [
          "SRC-DE-05"
        ]
      },
      {
        "shotId": "de-06",
        "question": [
          "How can the same battery face different margins?",
          "同一座电池为什么会面对不同价差？"
        ],
        "text": [
          "The merchant opportunity is the gap between buying and selling periods. Weather, demand, fuel and other flexibility move that gap; a sunny period alone does not determine the return.",
          "市场化机会来自买电与卖电时段之间的价差。天气、需求、燃料和其他灵活性资源都会改变价差；仅凭阳光充足的时段，不能判断投资回报。"
        ],
        "claimIds": [
          "CL-DE-05",
          "GAP-DE-PRICES"
        ],
        "sourceIds": [
          "SRC-DE-13",
          "SRC-DE-14",
          "SRC-DE-12",
          "SRC-DE-15",
          "SRC-DE-17",
          "SRC-DE-18",
          "SRC-DE-19"
        ]
      }
    ],
    "mechanism": []
  },
  "basis": [
    {
      "shotId": "de-02",
      "claimIds": [
        "CL-DE-04",
        "CL-DE-02A"
      ],
      "sourceIds": [
        "SRC-DE-11",
        "SRC-DE-12",
        "SRC-DE-06",
        "SRC-DE-07",
        "SRC-DE-08"
      ]
    },
    {
      "shotId": "de-03",
      "claimIds": [
        "CL-DE-05"
      ],
      "sourceIds": [
        "SRC-DE-13",
        "SRC-DE-14",
        "SRC-DE-12",
        "SRC-DE-15"
      ]
    },
    {
      "shotId": "de-06",
      "claimIds": [
        "CL-DE-05",
        "GAP-DE-PRICES"
      ],
      "sourceIds": [
        "SRC-DE-13",
        "SRC-DE-14",
        "SRC-DE-12",
        "SRC-DE-15",
        "SRC-DE-17",
        "SRC-DE-18",
        "SRC-DE-19"
      ]
    }
  ],
  "timeline": [
    [
      "1998",
      "Market opens to competition",
      "市场向竞争开放"
    ],
    [
      "2015",
      "Price-led reform choice",
      "选择价格驱动改革"
    ]
  ],
  "sourceIdsByChapter": {
    "history": [
      "SRC-DE-11",
      "SRC-DE-12",
      "SRC-DE-06",
      "SRC-DE-07",
      "SRC-DE-08",
      "SRC-DE-13",
      "SRC-DE-14",
      "SRC-DE-15",
      "SRC-DE-17",
      "SRC-DE-18",
      "SRC-DE-19"
    ],
    "system": [
      "SRC-DE-05",
      "SRC-DE-13",
      "SRC-DE-14",
      "SRC-DE-12",
      "SRC-DE-15",
      "SRC-DE-17",
      "SRC-DE-18",
      "SRC-DE-19"
    ],
    "mechanism": [
      "SRC-DE-11",
      "SRC-DE-12",
      "SRC-DE-06",
      "SRC-DE-07",
      "SRC-DE-08",
      "SRC-DE-13",
      "SRC-DE-14",
      "SRC-DE-15",
      "SRC-DE-17",
      "SRC-DE-18",
      "SRC-DE-19"
    ]
  },
  "payment": [
    "The public market pays trading and qualified balancing activity. A toll exchanges dispatch rights for contractual revenue during its term. Check charging costs, network costs, availability deductions and the merchant exposure after expiry. Capacity-procurement eligibility must be tested separately.",
    "公共市场为交易和合格平衡服务付费。租赁以调度权交换合同期内约定收入。须核对充电成本、电网成本、可用率扣款以及到期后的市场风险。容量采购资格须单独检验。"
  ],
  "constraint": [
    "Renewable timing / network access",
    "风光出力时段／电网准入"
  ],
  "payer": [
    "Captured spread / qualified balancing",
    "可捕获价差／合格平衡服务"
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
    }
  },
  "sourceIds": [
    "SRC-DE-05",
    "SRC-DE-13",
    "SRC-DE-14",
    "SRC-DE-12",
    "SRC-DE-15",
    "SRC-DE-17",
    "SRC-DE-18",
    "SRC-DE-19",
    "SRC-DE-11",
    "SRC-DE-06",
    "SRC-DE-07",
    "SRC-DE-08"
  ],
  "legacyScope": {
    "playRef": "de-toll-4h",
    "hours": 4,
    "call": "opportunistic",
    "on": "2026-10-31"
  }
};
