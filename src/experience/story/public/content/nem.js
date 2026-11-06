/* Public edition: editorial review pending. Original approvals unchanged. */
export default {
  "marketId": "nem",
  "legacyVersion": "2026-11-05",
  "script": "docs/immersive-experience-plan/nem-storyboard.md",
  "extracts": {
    "history": [
      {
        "shotId": "nem-02",
        "question": [
          "Why is a NEM battery not paid for capacity, when a WA battery is?",
          "为什么NEM的电池拿不到容量收入，而西澳的电池可以？"
        ],
        "text": [
          "Because the NEM chose to pay only for energy. When it opened in December 1998, generators were paid for the electricity they sent out and nothing for standing ready. Western Australia chose the opposite in 2006. In December 2025 a review of the NEM's market settings recommended keeping the energy-only spot market at its core.",
          "因为NEM选择只为电能量付费。1998年12月开市时，发电方只按送出的电量获得收入，随时待命不付费。西澳则在2006年作出了相反的选择。2025年12月，一项针对NEM市场机制的评估建议继续以单一电能量现货市场为核心。"
        ],
        "claimIds": [
          "CL-NEM-03",
          "CL-WA-06",
          "CL-NEM-04",
          "CL-NEM-05",
          "CL-NEM-08",
          "CL-NEM-17"
        ],
        "sourceIds": [
          "SRC-NEM-02",
          "SRC-NEM-14",
          "SRC-NEM-15",
          "SRC-WA-11",
          "SRC-WA-10",
          "REPO-NEM-LIVE",
          "SRC-NEM-18",
          "SRC-NEM-16",
          "SRC-NEM-17",
          "SRC-NEM-09",
          "SRC-NEM-10",
          "SRC-NEM-11"
        ]
      }
    ],
    "system": [
      {
        "shotId": "nem-01",
        "question": [
          "Which market is this, and how is it different from WA's?",
          "这是哪个市场？它与西澳市场有何不同？"
        ],
        "text": [
          "The NEM is one of the world's longest interconnected power systems, running down the east coast from Queensland to South Australia and across to Tasmania. Each of its regions has its own spot price, set every five minutes, and the regions trade through links of limited size. Western Australia's grid, on the other side of the continent, is not connected to it.",
          "NEM是世界上最长的互联电力系统之一，沿东海岸从昆士兰一路延伸至南澳大利亚，并跨海连接塔斯马尼亚。每个价区都有自己的现货价格，每五分钟出清一次；各价区之间通过容量有限的联络线互相交易。位于大陆另一侧的西澳电网与之并不相连。"
        ],
        "claimIds": [
          "CL-NEM-02",
          "CL-WA-05"
        ],
        "sourceIds": [
          "SRC-NEM-03",
          "SRC-NEM-04",
          "SRC-NEM-01",
          "SRC-WA-10"
        ]
      }
    ],
    "mechanism": []
  },
  "basis": [],
  "timeline": [
    [
      "1998-12",
      "Energy-only NEM opens",
      "电能量核心的NEM运行"
    ],
    [
      "2021",
      "Five-minute settlement begins",
      "五分钟结算实施"
    ],
    [
      "2023",
      "CIS pilot",
      "CIS试点"
    ]
  ],
  "sourceIdsByChapter": {
    "history": [
      "SRC-NEM-02",
      "SRC-NEM-14",
      "SRC-NEM-15",
      "SRC-WA-11",
      "SRC-WA-10",
      "REPO-NEM-LIVE",
      "SRC-NEM-18",
      "SRC-NEM-16",
      "SRC-NEM-17",
      "SRC-NEM-09",
      "SRC-NEM-10",
      "SRC-NEM-11"
    ],
    "system": [
      "SRC-NEM-03",
      "SRC-NEM-04",
      "SRC-NEM-01",
      "SRC-WA-10"
    ],
    "mechanism": []
  },
  "payment": [
    "Energy trading earns the regional spot price and FCAS pays qualified services. A CIS or other underwriting award is a separate agreement: its floor, ceiling, payment cap, start and expiry must be read from the contract. An application is not an award.",
    "电能量交易按区域现货价格结算，FCAS为合格服务付费。CIS或其他收入支持中标是独立协议：收入下限、上限、支付限额、起始与到期条件须从合同核对。申请不等于中标。"
  ],
  "constraint": [
    "Regional links limit shared prices",
    "区域联络线限制价格联通"
  ],
  "payer": [
    "Energy + FCAS / separate award",
    "电能量＋FCAS／独立中标合同"
  ],
  "sources": {
    "SRC-NEM-01": {
      "title": "AEMC, National Electricity Market",
      "url": "https://www.aemc.gov.au/energy-system/electricity/electricity-system/NEM",
      "checkedOn": "2026-10-30"
    },
    "SRC-NEM-02": {
      "title": "AEMC Reliability Panel, 2026 Reliability Standard and Settings Review, draft report",
      "url": "https://www.aemc.gov.au/sites/default/files/2025-11/2026%20RSSR%20-%20Draft%20Report%20-%20Clean%20%282%29.pdf",
      "checkedOn": "2026-10-30"
    },
    "SRC-NEM-03": {
      "title": "AEMO, About the National Electricity Market (NEM)",
      "url": "https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/about-the-national-electricity-market-nem",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-04": {
      "title": "AEMO, National Electricity Market fact sheet",
      "url": "https://www.aemo.com.au/-/media/files/electricity/nem/national-electricity-market-fact-sheet.pdf?rev=aa2c6b7c33a84370b50f4f8ebfe404b2",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-05": {
      "title": "AEMO, Quarterly Energy Dynamics Q3 2026",
      "url": "https://www.aemo.com.au/-/media/files/major-publications/qed/2026/qed-q3-2026.pdf?rev=921852e545444c2aa215f847859bc8e0&sc_lang=en&hash=03B291B360CA7AD9F7443A500E440D70",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-06": {
      "title": "AEMO, Quarterly Energy Dynamics Q3 2026 workbook",
      "url": "https://www.aemo.com.au/-/media/files/major-publications/qed/2026/qed-q3-2026-databook.xlsx?rev=a80a4d7ae2d24cbca1ae96884516e7a0&sc_lang=en&hash=3F6C86FB81AEBFF9349174EA1E9A3E8A",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-07": {
      "title": "AEMO, Quarterly Energy Dynamics Q2 2026",
      "url": "https://www.aemo.com.au/-/media/files/major-publications/qed/2026/qed-q2-2026.pdf?rev=5cfa9aa6b7b6490ab22a13de588f9a66&sc_lang=en",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-08": {
      "title": "AusEnergy Services Limited, CIS Tender 10 – NEM Dispatchable Capacity: Tender Guidelines",
      "url": "https://asl.org.au/-/media/services/files/cis/cis-t10-nem/260623-cis-tender-10-nem-dispatchable-capacity-tender-guidelines.pdf?rev=9a4dbc9fb60c4f7e9bef2f03f11c515c&sc_lang=en",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-09": {
      "title": "AusEnergy Services Limited, CIS Tender 10 – NEM Dispatchable Capacity",
      "url": "https://asl.org.au/tenders/cis-tender-10-nem-dispatchable",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-10": {
      "title": "DCCEEW, Capacity Investment Scheme",
      "url": "https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-11": {
      "title": "DCCEEW, Closed CIS tenders",
      "url": "https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/closed-cis-tenders",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-12": {
      "title": "DCCEEW, Progress on CIS Projects and Tenders",
      "url": "https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/progress-projects-tenders",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-13": {
      "title": "DCCEEW, Capacity Investment Scheme Agreements Project Register",
      "url": "https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme/projects-register",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-14": {
      "title": "NEM Review expert panel, NEM wholesale market settings review: final report",
      "url": "https://www.energy.gov.au/sites/default/files/2025-12/national-electricity-market-wholesale-market-settings-review-final-report.pdf",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-15": {
      "title": "DCCEEW, NEM wholesale market settings review",
      "url": "https://www.dcceew.gov.au/energy/markets/nem-wms-review",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-16": {
      "title": "AEMC, Five Minute Settlement",
      "url": "https://www.aemc.gov.au/rule-changes/five-minute-settlement",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-17": {
      "title": "AEMC, Integrating energy storage systems into the NEM",
      "url": "https://www.aemc.gov.au/rule-changes/integrating-energy-storage-systems-nem",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-18": {
      "title": "AEMO, Black System South Australia 28 September 2016 – Final Report",
      "url": "https://www.aemo.com.au/-/media/Files/Electricity/NEM/Market_Notices_and_Events/Power_System_Incident_Reports/2017/Integrated-Final-Report-SA-Black-System-28-September-2016.pdf",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-19": {
      "title": "AEMO, Loss factors and regional boundaries",
      "url": "https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/market-operations/loss-factors-and-regional-boundaries",
      "checkedOn": "2026-11-05"
    },
    "SRC-NEM-20": {
      "title": "AEMO, Quarterly Energy Dynamics Q4 2019",
      "url": "https://www.aemo.com.au/-/media/files/major-publications/qed/2019/qed-q4-2019.pdf",
      "checkedOn": "2026-11-05"
    },
    "SRC-WA-09": {
      "title": "Government of Western Australia, Electricity System and Market Rules, consolidated to 1 October 2026",
      "url": "https://www.wa.gov.au/system/files/2026-09/electricity_system_and_market_rules_-_1_october_2026.pdf",
      "checkedOn": "2026-10-30"
    },
    "SRC-NE-01": {
      "title": "Natural Earth, 1:50m admin-1 states and provinces (public domain)",
      "url": "https://www.naturalearthdata.com/",
      "checkedOn": "2026-11-05"
    },
    "SRC-WA-11": {
      "title": "AEMO, About the Wholesale Electricity Market (WEM)",
      "url": "https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/about-the-wholesale-electricity-market-wa-wem",
      "checkedOn": "2026-10-30"
    },
    "SRC-WA-10": {
      "title": "Government of Western Australia, Electricity Market Review Options Paper, December 2014",
      "url": "https://www.parliament.wa.gov.au/publications/tabledpapers.nsf/displaypaper/3912753a03050f0631a7781848257e120028dc9e/$file/2753.pdf",
      "checkedOn": "2026-10-30"
    }
  },
  "sourceIds": [
    "SRC-NEM-02",
    "SRC-NEM-14",
    "SRC-NEM-15",
    "SRC-WA-11",
    "SRC-WA-10",
    "REPO-NEM-LIVE",
    "SRC-NEM-18",
    "SRC-NEM-16",
    "SRC-NEM-17",
    "SRC-NEM-09",
    "SRC-NEM-10",
    "SRC-NEM-11",
    "SRC-NEM-03",
    "SRC-NEM-04",
    "SRC-NEM-01"
  ],
  "legacyScope": {
    "playRef": "nem-ltda-4h",
    "hours": 4,
    "call": "opportunistic",
    "on": "2026-11-05"
  }
};
