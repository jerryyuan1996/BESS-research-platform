/* Public edition: editorial review pending. Original approvals unchanged. */
export default {
  "marketId": "it",
  "legacyVersion": "2026-11-01",
  "script": "docs/immersive-experience-plan/italy-storyboard.md",
  "extracts": {
    "history": [],
    "system": [
      {
        "shotId": "it-04",
        "question": [
          "Where is the tension today?",
          "今天的矛盾在哪里？"
        ],
        "text": [
          "Most new solar and wind, and most battery connection requests, sit in the south and on the islands; much of the demand is in the north. At midday the southern zones can make more power than the corridors north can carry, so their prices fall. Terna plans new links; until they run, zone prices keep diverging.",
          "新增光伏、风电以及大部分储能并网申请集中在南部和岛屿，而大量用电需求在北部。午间，南部区域的发电可能超出北送通道的输送能力，当地价格随之走低。Terna规划了新的输电工程；在其投运之前，各区域价格仍会分化。"
        ],
        "claimIds": [
          "CL-IT-09"
        ],
        "sourceIds": [
          "SRC-IT-21"
        ]
      }
    ],
    "mechanism": []
  },
  "basis": [
    {
      "shotId": "it-01",
      "claimIds": [
        "CL-IT-04"
      ],
      "sourceIds": [
        "SRC-IT-05",
        "SRC-IT-06"
      ]
    },
    {
      "shotId": "it-03",
      "claimIds": [
        "CL-IT-03",
        "CL-IT-07"
      ],
      "sourceIds": [
        "SRC-IT-14",
        "SRC-IT-16",
        "SRC-IT-13",
        "SRC-IT-15"
      ]
    },
    {
      "shotId": "it-08",
      "claimIds": [
        "CL-IT-05",
        "CL-IT-06",
        "CL-IT-07",
        "CL-IT-08"
      ],
      "sourceIds": [
        "SRC-IT-07",
        "SRC-IT-09",
        "SRC-IT-12",
        "SRC-IT-11",
        "SRC-IT-13",
        "SRC-IT-14",
        "SRC-IT-15",
        "SRC-IT-16"
      ]
    }
  ],
  "timeline": [
    [
      "2021",
      "Central storage procurement decree",
      "集中储能采购法令"
    ]
  ],
  "sourceIdsByChapter": {
    "history": [
      "SRC-IT-05",
      "SRC-IT-06",
      "SRC-IT-14",
      "SRC-IT-16",
      "SRC-IT-13",
      "SRC-IT-15",
      "SRC-IT-07",
      "SRC-IT-09",
      "SRC-IT-12",
      "SRC-IT-11"
    ],
    "system": [
      "SRC-IT-21"
    ],
    "mechanism": [
      "SRC-IT-05",
      "SRC-IT-06",
      "SRC-IT-14",
      "SRC-IT-16",
      "SRC-IT-13",
      "SRC-IT-15",
      "SRC-IT-07",
      "SRC-IT-09",
      "SRC-IT-12",
      "SRC-IT-11"
    ]
  },
  "payment": [
    "The capacity market pays per credited unit of power; MACSE procures stored energy and transfers the time-shifting use of that contracted energy. A contract’s unit, control rights and vintage must be kept together. A legacy illustration is not a current new-entry ranking.",
    "容量市场按计入功率付费；MACSE采购储存电量，并转移该签约电量的时移使用权。合同的计量单位、控制权和批次须一并核对。旧批次示例不能当作当前新进入者的排名。"
  ],
  "constraint": [
    "South / islands → northern demand",
    "南部／岛屿 → 北部负荷"
  ],
  "payer": [
    "Capacity MW / MACSE MWh",
    "容量MW／MACSE MWh"
  ],
  "sources": {
    "SRC-IT-05": {
      "title": "ARERA · Deliberazione 103/2019/R/eel, 19 Mar 2019",
      "url": "https://www.arera.it/allegati/docs/19/103-19.pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://www.arera.it/allegati/docs/19/103-19.pdf, Delibera points 1–2"
    },
    "SRC-IT-06": {
      "title": "GME · MGP results by zone",
      "url": "https://www.mercatoelettrico.org/en/",
      "checkedOn": "2026-10-31",
      "locator": "https://www.mercatoelettrico.org/en/ (repository record `gme`)"
    },
    "SRC-IT-07": {
      "title": "MASE · Decree 259 of 6 Aug 2026, capacity-market rules for delivery 2028",
      "url": "https://www.mase.gov.it/portale/mercato-elettrico",
      "checkedOn": "2026-10-31",
      "locator": "https://www.mase.gov.it/portale/mercato-elettrico (listed); summarised in SRC-IT-09, \"Considerato, in aggiunta\""
    },
    "SRC-IT-08": {
      "title": "MASE · Decree 327 of 16 Oct 2026 approving DTF 2 and Annex 4 for delivery 2028",
      "url": "https://www.mase.gov.it/portale/documents/d/guest/dm_327_16-10-2026-pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://www.mase.gov.it/portale/documents/d/guest/dm_327_16-10-2026-pdf (Art. 1); Annex 4: https://www.mase.gov.it/portale/documents/d/guest/all_4_dtf_2-pdf, §8.3 and Table 11, p. 33"
    },
    "SRC-IT-09": {
      "title": "ARERA · Deliberazione 370/2026/R/eel, 14 Oct 2026",
      "url": "https://www.arera.it/fileadmin/allegati/docs/26/370-2026-R-eel.pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://www.arera.it/fileadmin/allegati/docs/26/370-2026-R-eel.pdf, pp. 9–11 and Delibera point 1"
    },
    "SRC-IT-10": {
      "title": "Terna · Delivery-2028 auction notice",
      "url": "https://www.terna.it/it/sistema-elettrico/mercato-capacita",
      "checkedOn": "2026-10-31",
      "locator": "Expected under https://www.terna.it/it/sistema-elettrico/mercato-capacita"
    },
    "SRC-IT-11": {
      "title": "Terna · Rendiconto degli esiti, Asta Madre 2027",
      "url": "https://download.terna.it/terna/Rendiconto-Esiti-Asta-Madre_2027_8dd97982c75d724.pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://download.terna.it/terna/Rendiconto-Esiti-Asta-Madre_2027_8dd97982c75d724.pdf, Executive Summary p. 3 and \"Capacità Nuova Assegnata\" p. 8"
    },
    "SRC-IT-12": {
      "title": "Terna · Capacity-market discipline (decree of 28 Jun 2019) and first auctions, delivery 2022 and 2023",
      "url": "https://download.terna.it/terna/2019_12_06_Rendiconto%20EsitiAsta%202022_PUBBLICATO_8d7c06cc9f8470b.pdf",
      "checkedOn": "2026-10-31",
      "locator": "Results report: https://download.terna.it/terna/2019_12_06_Rendiconto%20EsitiAsta%202022_PUBBLICATO_8d7c06cc9f8470b.pdf"
    },
    "SRC-IT-13": {
      "title": "Legislative Decree 210/2021, Art. 18",
      "url": "https://www.normattiva.it/",
      "checkedOn": "2026-10-31",
      "locator": "https://www.normattiva.it/ (decreto legislativo 8 novembre 2021, n. 210)"
    },
    "SRC-IT-14": {
      "title": "ARERA · Deliberazione 247/2023/R/eel, 6 Jun 2023, and Annex A (updated)",
      "url": "https://www.arera.it/fileadmin/allegati/docs/23/247-23-reel-allegato-a-aggiornato.pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://www.arera.it/fileadmin/allegati/docs/23/247-23-reel-allegato-a-aggiornato.pdf, Arts. 6.3, 6.6, 11–13"
    },
    "SRC-IT-15": {
      "title": "MASE · Decree 346 of 10 Oct 2024 approving the MACSE rules",
      "url": "https://mase.gov.it/sites/default/files/Archivio_Energia/Archivio_Normativa/dm_346_10.10.2024.pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://mase.gov.it/sites/default/files/Archivio_Energia/Archivio_Normativa/dm_346_10.10.2024.pdf (repository record `dm346`)"
    },
    "SRC-IT-16": {
      "title": "Terna · \"Terna completes first MACSE auction: 10 GWh of energy storage capacity awarded\"",
      "url": "https://www.terna.it/en/media/press-releases/detail/completed-first-macse-auction",
      "checkedOn": "2026-10-31",
      "locator": "https://www.terna.it/en/media/press-releases/detail/completed-first-macse-auction"
    },
    "SRC-IT-17": {
      "title": "ARERA · Deliberazione 362/2025/R/eel, 30 Jul 2025",
      "url": "https://arera.it/atti-e-provvedimenti/dettaglio/25/362-25",
      "checkedOn": "2026-10-31",
      "locator": "https://arera.it/atti-e-provvedimenti/dettaglio/25/362-25"
    },
    "SRC-IT-18": {
      "title": "ARERA · Consultation 283/2026/R/eel, 30 Jul 2026",
      "url": "https://www.arera.it/fileadmin/allegati/docs/26/283-2026-R-eel.pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://www.arera.it/fileadmin/allegati/docs/26/283-2026-R-eel.pdf (repository record `arera283`)"
    },
    "SRC-IT-19": {
      "title": "ARERA · Deliberazione 332/2026/R/eel, 24 Sep 2026",
      "url": "https://www.arera.it/fileadmin/allegati/docs/26/332-2026-R-eel.pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://www.arera.it/fileadmin/allegati/docs/26/332-2026-R-eel.pdf, pp. 4–5 and Delibera point 1"
    },
    "SRC-IT-20": {
      "title": "MASE · Decree of 27 Mar 2026 (MACSE rules for the second battery auction) and Decree 162 of 20 May 2026 (16 GWh requirement for 2029)",
      "url": "https://www.mase.gov.it/portale/mercato-elettrico",
      "checkedOn": "2026-10-31",
      "locator": "https://www.mase.gov.it/portale/mercato-elettrico (listing); both recited in SRC-IT-19, p. 4"
    },
    "SRC-IT-21": {
      "title": "Terna · Development Plan 2025, public-consultation presentation (hosted by ARERA)",
      "url": "https://www.arera.it/fileadmin/allegati/operatori/pds/25/Presentazione_della_consultazione_pubblica_sul_Piano_di_sviluppo_2025.pdf",
      "checkedOn": "2026-10-31",
      "locator": "https://www.arera.it/fileadmin/allegati/operatori/pds/25/Presentazione_della_consultazione_pubblica_sul_Piano_di_sviluppo_2025.pdf, slide \"Richieste di Connessione: FER\""
    },
    "SRC-IT-22": {
      "title": "Terna · Tyrrhenian Link and Adriatic Link project pages",
      "url": "https://github.com/jerryyuan1996/BESS-research-platform",
      "checkedOn": "2026-10-31",
      "locator": "Repository records `tyrrhenian`, `adriatic`"
    }
  },
  "sourceIds": [
    "SRC-IT-21",
    "SRC-IT-05",
    "SRC-IT-06",
    "SRC-IT-14",
    "SRC-IT-16",
    "SRC-IT-13",
    "SRC-IT-15",
    "SRC-IT-07",
    "SRC-IT-09",
    "SRC-IT-12",
    "SRC-IT-11"
  ],
  "legacyScope": {
    "playRef": "it-cap-4h",
    "hours": 4,
    "call": "enter-now",
    "lens": "infraFund",
    "on": "2026-11-01",
    "commit": "7effd37"
  }
};
