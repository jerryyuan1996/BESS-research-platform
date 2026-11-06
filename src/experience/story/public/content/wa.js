/* Public edition: editorial review pending. Original approvals unchanged. */
export default {
  "marketId": "wa",
  "legacyVersion": "2026-10-30",
  "script": "docs/immersive-experience-plan/western-australia-storyboard.md",
  "extracts": {
    "history": [
      {
        "shotId": "wa-03",
        "question": [
          "Why does WA pay batteries for capacity when the NEM does not?",
          "为什么西澳为电池的容量付费，而全国电力市场不付？"
        ],
        "text": [
          "When the WEM opened in 2006, Western Australia chose to pay for capacity as well as energy. An island cannot import in a shortage, so it buys its reliability years ahead. The NEM chose an energy-only market, with no payment for capacity.",
          "2006年西澳电力批发市场（WEM）开市时，西澳选择在电能量之外同时为容量付费。孤岛电网缺电时无法从外部输入，只能提前数年买下可靠性。全国电力市场则选择了单一电能量市场，不为容量付费。"
        ],
        "claimIds": [
          "CL-WA-06",
          "CL-WA-09",
          "CL-WA-08",
          "CL-WA-03",
          "CL-WA-07"
        ],
        "sourceIds": [
          "SRC-WA-11",
          "SRC-WA-10",
          "SRC-NEM-02",
          "SRC-WA-12",
          "SRC-WA-15",
          "SRC-WA-03",
          "SRC-WA-08",
          "SRC-WA-09"
        ]
      }
    ],
    "system": [
      {
        "shotId": "wa-01",
        "question": [
          "Which system is this, and what is unusual about it?",
          "这是哪个电力系统？它有什么特别之处？"
        ],
        "text": [
          "Perth's grid is an island. The South West Interconnected System has no link to any other grid, so all of its backup has to be built inside it.",
          "珀斯所在的电网是一座孤岛。西南互联系统（SWIS）与任何其他电网都没有联络，所有备用容量都只能在系统内部自建。"
        ],
        "claimIds": [
          "CL-WA-01",
          "CL-WA-05"
        ],
        "sourceIds": [
          "SRC-WA-01",
          "SRC-WA-16",
          "SRC-NE-01",
          "SRC-NEM-01",
          "SRC-WA-10",
          "SRC-WA-12"
        ]
      },
      {
        "shotId": "wa-02",
        "question": [
          "What was the network built to do?",
          "这张电网当初是为什么而建的？"
        ],
        "text": [
          "The grid was built for big plants sending power one way. Rooftop solar now pushes power back from the edges of the network.",
          "这张电网原本为大型电厂单向送电而建。如今，屋顶光伏从电网末端反向送电。"
        ],
        "claimIds": [
          "CL-WA-02",
          "CL-WA-08"
        ],
        "sourceIds": [
          "SRC-WA-02",
          "SRC-WA-15"
        ]
      }
    ],
    "mechanism": [
      {
        "shotId": "wa-04",
        "question": [
          "If I own a capable battery, am I paid for capacity?",
          "拥有一台性能达标的电池，就能拿到容量收入吗？"
        ],
        "text": [
          "Not yet. Capacity is paid only after AEMO certifies the battery and assigns it Capacity Credits for a capacity year, under the market rules that began on 1 October 2023.",
          "还不能。只有在AEMO完成认证、并为某一容量年度分配容量信用之后，电池才能获得容量收入；适用的是2023年10月1日起实施的市场规则。"
        ],
        "claimIds": [
          "CL-WA-03",
          "CL-WA-10"
        ],
        "sourceIds": [
          "SRC-WA-03",
          "SRC-WA-09"
        ]
      }
    ]
  },
  "basis": [],
  "timeline": [
    [
      "2006",
      "Energy and capacity market opens",
      "电能量与容量市场运行"
    ],
    [
      "2023-10-01",
      "Reformed market rules begin",
      "改革后的市场规则实施"
    ]
  ],
  "sourceIdsByChapter": {
    "history": [
      "SRC-WA-11",
      "SRC-WA-10",
      "SRC-NEM-02",
      "SRC-WA-12",
      "SRC-WA-15",
      "SRC-WA-03",
      "SRC-WA-08",
      "SRC-WA-09"
    ],
    "system": [
      "SRC-WA-01",
      "SRC-WA-16",
      "SRC-NE-01",
      "SRC-NEM-01",
      "SRC-WA-10",
      "SRC-WA-12",
      "SRC-WA-02",
      "SRC-WA-15"
    ],
    "mechanism": [
      "SRC-WA-03",
      "SRC-WA-09"
    ]
  },
  "payment": [
    "AEMO allocates Capacity Credits after certification. Capacity availability, energy and system services are different obligations; an annual capacity price is not a fixed long-term tariff.",
    "AEMO在认证后分配容量信用。容量可用性、电能量和系统服务对应不同义务；年度容量价格不是长期固定电价。"
  ],
  "constraint": [
    "Solar at midday / evening reliability",
    "午间光伏／晚间可靠性"
  ],
  "payer": [
    "Capacity Credits → availability payment",
    "容量信用 → 可用性付费"
  ],
  "sources": {
    "SRC-WA-01": {
      "title": "AEMO, Wholesale Electricity Market (WEM)",
      "url": "https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem"
    },
    "SRC-WA-02": {
      "title": "AEMO, Operating electricity grids with rooftop solar installations (fact sheet, 2024), pp. 1-3",
      "url": "https://www.aemo.com.au/-/media/files/learn/fact-sheets/2024/fact-sheet-operating-electricity-grids-with-rooftop-solar-installations.pdf"
    },
    "SRC-WA-03": {
      "title": "AEMO, Major reform implemented to WA electricity market (media release)",
      "url": "https://www.aemo.com.au/newsroom/media-release/major-reform-implemented-to-wa-electricity-market-to-enable-the-energy-transition"
    },
    "SRC-WA-05": {
      "title": "AEMO, Certification of Reserve Capacity",
      "url": "https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/certification-of-reserve-capacity"
    },
    "SRC-WA-06": {
      "title": "AEMO, Essential System Services",
      "url": "https://aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/system-operations/essential-system-services"
    },
    "SRC-WA-08": {
      "title": "AEMO, 2026 Wholesale Electricity Market Electricity Statement of Opportunities, §4.1 and Tables 24-28, pp. 74-81",
      "url": "https://www.aemo.com.au/-/media/files/electricity/wem/planning_and_forecasting/esoo/2026/2026-wem-electricity-statement-of-opportunities.pdf"
    },
    "SRC-WA-09": {
      "title": "Government of Western Australia, Electricity System and Market Rules (1 October 2026), cl. 4.11.3, 4.29.1 and Chapter 11",
      "url": "https://www.wa.gov.au/system/files/2026-09/electricity_system_and_market_rules_-_1_october_2026.pdf"
    },
    "SRC-WA-10": {
      "title": "Electricity Market Review Steering Committee, Electricity Market Review Options Paper (December 2014), §2.2 and §2.5",
      "url": "https://www.parliament.wa.gov.au/publications/tabledpapers.nsf/displaypaper/3912753a03050f0631a7781848257e120028dc9e/$file/2753.pdf"
    },
    "SRC-WA-11": {
      "title": "AEMO, About the Wholesale Electricity Market (WEM)",
      "url": "https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/about-the-wholesale-electricity-market-wa-wem"
    },
    "SRC-WA-12": {
      "title": "AEMO, The Wholesale Electricity Market (fact sheet)",
      "url": "https://aemo.com.au/-/media/files/learn/fact-sheets/2025/wem-fact-sheet.pdf"
    },
    "SRC-WA-13": {
      "title": "AEMO WEM data: Operational Demand and Withdrawal; Estimated DPV",
      "url": "https://data.wa.aemo.com.au/public/public-data/datafiles/"
    },
    "SRC-WA-14": {
      "title": "AEMO WEM data: Reserve Capacity Prices and Capacity Credits, 2028-29",
      "url": "https://data.wa.aemo.com.au/public/public-data/datafiles/reserve-capacity-prices/"
    },
    "SRC-WA-15": {
      "title": "Government of Western Australia, State-owned coal power stations to be retired by 2030 (14 June 2022)",
      "url": "https://www.wa.gov.au/government/media-statements/McGowan-Labor-Government/State-owned-coal-power-stations-to-be-retired-by-2030-20220614"
    },
    "SRC-WA-16": {
      "title": "Energy Policy WA, Electricity Industry (updated 26 June 2025): the SWIS extends to Kalbarri, Albany and Kalgoorlie",
      "url": "https://www.wa.gov.au/organisation/energy-policy-wa/electricity-industry"
    },
    "SRC-NE-01": {
      "title": "Natural Earth, 1:50m coastline (public domain), through the world-atlas package",
      "url": "https://www.naturalearthdata.com/"
    },
    "SRC-NEM-01": {
      "title": "AEMC, National Electricity Market",
      "url": "https://www.aemc.gov.au/energy-system/electricity/electricity-system/NEM"
    },
    "SRC-NEM-02": {
      "title": "AEMC Reliability Panel, 2026 Reliability Standard and Settings Review, draft report, App. A.2.1",
      "url": "https://www.aemc.gov.au/sites/default/files/2025-11/2026%20RSSR%20-%20Draft%20Report%20-%20Clean%20%282%29.pdf"
    }
  },
  "sourceIds": [
    "SRC-WA-11",
    "SRC-WA-10",
    "SRC-NEM-02",
    "SRC-WA-12",
    "SRC-WA-15",
    "SRC-WA-03",
    "SRC-WA-08",
    "SRC-WA-09",
    "SRC-WA-01",
    "SRC-WA-16",
    "SRC-NE-01",
    "SRC-NEM-01",
    "SRC-WA-02"
  ],
  "legacyScope": {
    "playRef": "wa-cap-8h",
    "hours": 8,
    "call": "opportunistic",
    "on": "2026-10-30"
  }
};
