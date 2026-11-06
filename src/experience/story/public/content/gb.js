/* Public edition: editorial review pending. Original approvals unchanged. */
export default {
  "marketId": "gb",
  "legacyVersion": "2026-11-01",
  "script": "docs/immersive-experience-plan/great-britain-storyboard.md",
  "extracts": {
    "history": [],
    "system": [
      {
        "shotId": "gb-01",
        "question": [
          "Why does Britain buy so much fast response?",
          "英国为什么需要采购大量快速响应？"
        ],
        "text": [
          "Great Britain runs its own frequency. Its links to the island of Ireland, Norway and the continent are direct-current cables: they trade power but do not share the grid's frequency. When a large unit trips, Britain must cover most of the response within its own system.",
          "英国电网独立维持自身频率。它与爱尔兰岛、挪威和欧洲大陆的连接都是直流海缆：可以交易电力，但不共享电网频率。大型机组跳闸时，英国须主要依靠本系统内的资源提供响应。"
        ],
        "claimIds": [
          "CL-GB-03"
        ],
        "sourceIds": [
          "SRC-GB-01",
          "SRC-GB-02"
        ]
      }
    ],
    "mechanism": [
      {
        "shotId": "gb-10",
        "question": [
          "Who pays a British battery, and what is fixed?",
          "谁向英国电池付钱？哪些收入是固定的？"
        ],
        "text": [
          "NESO procures response in short auctions. Balancing actions and imbalance settle through Elexon; trading earns a price spread. Suppliers fund the Capacity Market through the Electricity Settlements Company for the agreement’s term. Each payment has its own obligations and units.",
          "NESO通过短期拍卖采购响应。平衡操作与不平衡电量通过Elexon结算；交易赚取价差。容量市场由售电商出资，经电力结算公司在协议期内付款。每项付款有各自的履约义务和计量单位。"
        ],
        "claimIds": [
          "CL-GB-15",
          "CL-GB-17",
          "CL-GB-18"
        ],
        "sourceIds": [
          "SRC-GB-10",
          "SRC-GB-21",
          "SRC-GB-20",
          "SRC-GB-15",
          "SRC-GB-17"
        ]
      },
      {
        "shotId": "gb-09",
        "question": [
          "Can one battery earn every service at once?",
          "一座电池能同时赚取所有服务的收入吗？"
        ],
        "text": [
          "No. The same MW and stored energy can be held for response, offered into balancing or traded ahead, but never promised twice. The capacity agreement sits alongside them, with a duty to deliver when the system is stressed. Under a toll, the offtaker decides how the battery is used.",
          "不能。同一组MW和储存电量，可用于待命响应、在平衡机制中报价或提前交易，但绝不能重复承诺。容量协议与这些用途并存，但在系统紧张时必须履约。在租赁期内，由承租方决定电池如何使用。"
        ],
        "claimIds": [
          "CL-GB-15",
          "CL-GB-16"
        ],
        "sourceIds": [
          "SRC-GB-10",
          "SRC-GB-21",
          "REPO-GB-LIVE",
          "REPO-GB-01"
        ]
      }
    ]
  },
  "basis": [
    {
      "shotId": "gb-02",
      "claimIds": [
        "CL-GB-04"
      ],
      "sourceIds": [
        "SRC-GB-03",
        "SRC-GB-04"
      ]
    },
    {
      "shotId": "gb-10",
      "claimIds": [
        "CL-GB-15",
        "CL-GB-17",
        "CL-GB-18"
      ],
      "sourceIds": [
        "SRC-GB-10",
        "SRC-GB-21",
        "SRC-GB-20",
        "SRC-GB-15",
        "SRC-GB-17"
      ]
    }
  ],
  "timeline": [
    [
      "2001",
      "NETA replaces the Pool",
      "NETA取代电力库"
    ],
    [
      "2005",
      "BETTA covers Great Britain",
      "BETTA覆盖大不列颠"
    ]
  ],
  "sourceIdsByChapter": {
    "history": [
      "SRC-GB-03",
      "SRC-GB-04",
      "SRC-GB-10",
      "SRC-GB-21",
      "SRC-GB-20",
      "SRC-GB-15",
      "SRC-GB-17"
    ],
    "system": [
      "SRC-GB-01",
      "SRC-GB-02"
    ],
    "mechanism": [
      "SRC-GB-10",
      "SRC-GB-21",
      "SRC-GB-20",
      "SRC-GB-15",
      "SRC-GB-17",
      "REPO-GB-LIVE",
      "REPO-GB-01"
    ]
  },
  "payment": [
    "Trading, NESO response procurement, balancing settlement and Capacity Market agreements pay for different actions. A private toll can transfer dispatch rights for a fee during its term; the market itself does not grant that fee to every battery.",
    "交易、NESO响应采购、平衡结算和容量市场协议，为不同动作付费。私人租赁合同可在期限内以费用交换调度权；市场并不向所有电池授予这笔租赁费。"
  ],
  "constraint": [
    "Separate frequency / connection access",
    "独立频率／并网准入"
  ],
  "payer": [
    "Response · balancing · capacity",
    "响应 · 平衡 · 容量"
  ],
  "sources": {
    "SRC-GB-01": {
      "title": "NESO · GB Synchronous Area operational methodology (SOGL) and supporting document",
      "url": "https://www.neso.energy/document/299176/download",
      "checkedOn": "2026-10-31",
      "locator": "Scope: GB as its own synchronous area; standard frequency range"
    },
    "SRC-GB-02": {
      "title": "NESO · National Electricity Transmission System Performance Report",
      "url": "https://www.neso.energy/document/267701/download",
      "checkedOn": "2026-10-31",
      "locator": "Interconnector list (HVDC links)"
    },
    "SRC-GB-03": {
      "title": "Ofgem · NETA: a review of the first three months (Aug 2001); NETA factsheet (Feb 2002)",
      "url": "https://www.ofgem.gov.uk/sites/default/files/docs/2001/08/a-review-of-the-first-three-months-31-08_0.pdf",
      "checkedOn": "2026-10-31",
      "locator": "Factsheet: NETA \"introduced in England and Wales on Tuesday 27 March 2001\""
    },
    "SRC-GB-04": {
      "title": "Ofgem · What is BETTA? (Apr 2002); Energy Act 2004 explanatory notes; HMRC VFUP3300",
      "url": "https://www.ofgem.gov.uk/sites/default/files/docs/2002/04/1105-factsheet0702_15april_0.pdf",
      "checkedOn": "2026-10-31",
      "locator": "BETTA user guide (Feb 2005): go-live \"anticipated to be 1 April 2005\", https://www.ofgem.gov.uk/sites/default/files/docs/2005/02/9549-2605.pdf; Ofgem July 2005 consultation: NETA \"extended GB wide under BETTA in April 2005\", https://www.ofgem.gov.uk/sites/default/files/docs/2005/07/11190-17805.pdf"
    },
    "SRC-GB-05": {
      "title": "National Grid · Enhanced Frequency Response Market Information Report (26 Aug 2016)",
      "url": "https://www.nationalgrid.com/sites/default/files/documents/EFR%20Market%20Information%20Report%20v1%20(1)_1.pdf",
      "checkedOn": "2026-10-31",
      "locator": "Moved original; quantitative results withheld — GAP-GB-EFR"
    },
    "SRC-GB-06": {
      "title": "National Grid · Enhanced Frequency Response 2016 (presentation)",
      "url": "https://www.nationalgrid.com/sites/default/files/documents/8589937157-06_EFR.pdf",
      "checkedOn": "2026-10-31",
      "locator": "Moved original; quantitative results withheld — GAP-GB-EFR"
    },
    "SRC-GB-07": {
      "title": "National Grid · EFR Invitation to Tender v2.2",
      "url": "https://www.nationalgrid.com/sites/default/files/documents/Enhanced%20Frequency%20Response%20ITT%20v2_2%20compare.pdf",
      "checkedOn": "2026-10-31",
      "locator": "NESO copy: https://www.neso.energy/document/101541/download. §3.4: contracts of up to four years; 50 MW cap per applicant (§3.4, §7.17); results due 26 Aug 2016"
    },
    "SRC-GB-08": {
      "title": "NESO · \"National Grid ESO debuts Dynamic Containment frequency response service\"; ESO Annual Report 2020",
      "url": "https://www.neso.energy/news/national-grid-eso-debuts-dynamic-containment-frequency-response-service",
      "checkedOn": "2026-10-31",
      "locator": "News dated 30 Sep 2020: goes live in the control room at 11pm; first round accepted two battery units for 90 MW; tenders seven days a week"
    },
    "SRC-GB-09": {
      "title": "Ofgem · DR and DM Article 18 decision letters (Mar 2022); decision on DR, DM and DC terms (Feb 2023); NESO Dynamic Services page; ESO news on DM",
      "url": "https://www.ofgem.gov.uk/sites/default/files/2022-03/DR%20Art18%20decision%20letter.pdf",
      "checkedOn": "2026-10-31",
      "locator": "DC high launched October 2021 (Ofgem 2023); DM added 21 Apr 2022 (ESO news). First cleared deliveries in SRC-GB-12: DC high 4 Nov 2021, DR 9 Apr 2022, DM 7 May 2022 (CF-GB-05)"
    },
    "SRC-GB-10": {
      "title": "NESO · Enduring Auction Capability platform (news); May 2024 Balancing Costs technical report",
      "url": "https://www.neso.energy/news/enduring-auction-capability-platform-new-and-improved-platform-procuring-frequency-response-services",
      "checkedOn": "2026-10-31",
      "locator": "News dated 24 Nov 2023: bids for several services at once; first EAC round, average clearing price 35% below the previous seven days, cleared volume stable. May 2024 report: \"In November 2023 the procurement of DC, DM and DR was moved to the Enduring Auction Capability (EAC) platform\""
    },
    "SRC-GB-11": {
      "title": "NESO · Balancing Cost Winter Report (May 2024); Monthly Balancing Cost Reports, July and August 2026",
      "url": "https://www.neso.energy/document/318696/download",
      "checkedOn": "2026-10-31",
      "locator": "Falls attributed to more participants, requirement certainty and auction design; 2026 moves to liquidity and offered volume against a firm requirement"
    },
    "SRC-GB-12": {
      "title": "NESO data portal · Dynamic Containment, Regulation and Moderation auction results",
      "url": "https://www.neso.energy/data-portal/dynamic-containment-data",
      "checkedOn": "2026-10-31",
      "locator": "Rights: NESO Open Data Licence; \"This dataset will no longer be updated\". CKAN package `dynamic-containment-data` (api.neso.energy): DC masterdata 2020–21 (fields incl. Volume Accepted, Availability Fee, Technology Type); results summary 2021–2023 (Service, EFA Date, Cleared Volume, Clearing Price); results by unit 2021–2023 (incl. Technology Type); linear and block orders"
    },
    "SRC-GB-13": {
      "title": "NESO data portal · EAC auction results",
      "url": "https://www.neso.energy/data-portal/eac-auction-results",
      "checkedOn": "2026-10-31",
      "locator": "Rights: NESO Open Data Licence; daily update. CKAN package `eac-auction-results`: Response-Reserve results summary (auctionProduct, deliveryStart, clearedVolume, clearingPrice), current year plus FY2023, FY2024 and FY2025 archives; results by unit (incl. technologyType); sell orders (quantity, executedQuantity)"
    },
    "SRC-GB-14": {
      "title": "NESO · NESO Open Licence",
      "url": "https://www.neso.energy/data-portal/neso-open-licence",
      "checkedOn": "2026-10-31",
      "locator": "Licence v1.0, \"based on version 3.0 of the Open Government Licence\"; free to \"exploit the Information commercially and non-commercially\"; attribution \"Supported by National Energy SO Open Data\"; applies dataset by dataset"
    },
    "SRC-GB-15": {
      "title": "NESO · \"First stages of Open Balancing Platform go live\"; \"The start of the balancing mechanism revolution\"; RIIO-2 BP2 2023-24 incentives report",
      "url": "https://www.neso.energy/news/first-stages-open-balancing-platform-go-live",
      "checkedOn": "2026-10-31",
      "locator": "News dated 13 Dec 2023: first stage goes live \"this week\" for bulk dispatch of battery storage and small units. Incentives report: Release 1 in December 2023; average daily volume instructed for batteries up 220% after early fixes"
    },
    "SRC-GB-16": {
      "title": "NESO · Skip rates page and methodology guide",
      "url": "https://www.neso.energy/industry-information/balancing-services/skip-rates",
      "checkedOn": "2026-10-31",
      "locator": "Two skip-rate datasets; by-technology reporting since June 2025"
    },
    "SRC-GB-17": {
      "title": "Elexon · Licence to use BMRS open data; BMRS API terms",
      "url": "https://www.elexon.co.uk/bsc/data/balancing-mechanism-reporting-agent/copyright-licence-bmrs-data/",
      "checkedOn": "2026-10-31",
      "locator": "Licence page: free to \"exploit the BMRS Data, including commercially\", with attribution; API terms separate; conflicting general copyright page (CF-GB-08)"
    },
    "SRC-GB-18": {
      "title": "DECC via GOV.UK · \"First Capacity Market auction guarantees security of supply at low cost\"; T-4 2014 provisional results",
      "url": "https://www.gov.uk/government/news/first-capacity-market-auction-guarantees-security-of-supply-at-low-cost",
      "checkedOn": "2026-10-31",
      "locator": "\"The T-4 Capacity Auction for delivery in 2018 concluded on 18th December 2014\""
    },
    "SRC-GB-19": {
      "title": "DESNZ · Capacity Market Rules, informal consolidation July 2026, Schedule 3B; Capacity Market (Amendment) Rules 2018",
      "url": "https://assets.publishing.service.gov.uk/media/6a68894dcc35a9471da4c18f/capacity-market-rules-consolidation-2026.pdf",
      "checkedOn": "2026-10-31",
      "locator": "2026 consolidation opened: Schedule 3B, methodology for determining de-rating; rule 2.3.5B (EFC under Schedule 3B). 2018 amendment not reopened; the Dec 2017 National Grid assessment not located (CF-GB-09)"
    },
    "SRC-GB-20": {
      "title": "NESO and DESNZ · T-4 2029/30 results and auction monitor report; Capacity Market Register",
      "url": "https://www.neso.energy/news/delivering-reliability-gb-consumers-capacity-market-action",
      "checkedOn": "2026-10-31",
      "locator": "NESO news: concluded 11 Mar 2026 at £27.10/kW/year, against £60–65 in the previous three T-4s; 40.1 GW for 2029/30. Monitor report confirms the price. Register holds agreements and a de-rating CSV. Table 3 of the T-4 2029/30 guidelines per REPO-GB-01 (not reopened)"
    },
    "SRC-GB-21": {
      "title": "EMR Settlement and legislation.gov.uk · Capacity Market scheme page; G15 supplier payments; Electricity Capacity (Supplier Payment etc.) Regulations 2014",
      "url": "https://www.emrsettlement.co.uk/schemes/capacity-market/",
      "checkedOn": "2026-10-31",
      "locator": "Suppliers pay the Capacity Market Supplier Charge; the Electricity Settlements Company pays providers; stress-event penalties"
    },
    "SRC-GB-22": {
      "title": "DESNZ · REMA summer update 2025",
      "url": "https://www.gov.uk/government/publications/review-of-electricity-market-arrangements-rema-summer-update-2025/review-of-electricity-market-arrangements-rema-summer-update-2025-accessible-webpage",
      "checkedOn": "2026-10-31",
      "locator": "10 Jul 2025: \"retain a single national GB-wide wholesale market\"; \"We have therefore decided not to implement zonal pricing\""
    },
    "SRC-GB-23": {
      "title": "Ofgem · TMO4+ summary decision; Gate 2 Criteria Methodology decision (OFG1164); extension decision",
      "url": "https://www.ofgem.gov.uk/sites/default/files/2025-04/Summary-Decision-Document-TMO4-package.pdf",
      "checkedOn": "2026-10-31",
      "locator": "Summary decision, publication date 15 Apr 2025; extension decision: implementation on 10 Jun 2025. Gate 2 wording (confirmed date, point, queue position) from the methodology decision, not reopened"
    },
    "SRC-GB-24": {
      "title": "DESNZ and Ofgem · Open letter, \"Connections Reform: delivery update and battery capacity\" (Apr 2026)",
      "url": "https://www.gov.uk/government/publications/connections-reform-delivery-update-and-battery-capacity/open-letter-from-desnz-and-ofgem-on-connections-reform-delivery",
      "checkedOn": "2026-10-31",
      "locator": "Letter dated 16 Apr 2026: \"14.8 GW above the top of the Action Plan battery capacity range for 2030 and 61.7 GW above the projected battery system need in 2035\"; NESO's consultation raises disapplying protections 3a/3b so only batteries with a revenue support scheme qualify in the next window"
    },
    "SRC-GB-25": {
      "title": "Ofgem and NESO · CMP470 Oversubscribed Technologies Commitment Fee: urgency decision, workgroup report, minded-to consultation (17 Sep 2026), press release",
      "url": "https://www.ofgem.gov.uk/sites/default/files/2026-09/CMP470-Minded-to-Consultation.pdf",
      "checkedOn": "2026-10-31",
      "locator": "Minded-to consultation, response deadline 1 Oct 2026; press release 17 Sep 2026: about 90 GW of batteries operational or in the reformed queue (83 GW prioritised plus 7 GW operating) against about 29 GW needed by 2035. Decision awaited (CF-GB-10)"
    },
    "SRC-GB-26": {
      "title": "DESNZ · Clean Power 2030 Action Plan main report (Dec 2024); Clean Flexibility Roadmap (Jul 2025)",
      "url": "https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-main-report",
      "checkedOn": "2026-10-31",
      "locator": "\"23-27 GW\" of batteries by 2030 (opened); separate long-duration category"
    },
    "SRC-GB-27": {
      "title": "NESO · \"NESO to launch new Quick Reserve service\"; Slow Reserve page",
      "url": "https://www.neso.energy/news/neso-launch-new-quick-reserve-service",
      "checkedOn": "2026-10-31",
      "locator": "Quick Reserve launch on 3 Dec 2024 (opened); Slow Reserve go-live notice, intended 31 Mar 2026 (not opened)"
    }
  },
  "sourceIds": [
    "SRC-GB-01",
    "SRC-GB-02",
    "SRC-GB-10",
    "SRC-GB-21",
    "SRC-GB-20",
    "SRC-GB-15",
    "SRC-GB-17",
    "REPO-GB-LIVE",
    "REPO-GB-01",
    "SRC-GB-03",
    "SRC-GB-04"
  ],
  "legacyScope": {
    "playRef": "gb-toll-4h",
    "call": "opportunistic",
    "hours": 4,
    "lens": "infraFund",
    "stage": "operating",
    "route": "toll",
    "on": "2026-11-01",
    "commit": "26a678b8bf0c01e8b04c3b9553b2e877c68497bb"
  }
};
