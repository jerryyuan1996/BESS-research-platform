// Official electricity statistics, manually researched 2026-11-13.
// TWh values and source locators retain the stated vintage and scope.
export const ELECTRICITY_OVERVIEW = {
  "checkedOn": "2026-11-13",
  "unit": "TWh",
  "referencePeriod": "2024 / explicitly labelled fiscal years",
  "countries": [
    {
      "id": "it",
      "name": [
        "Italy",
        "意大利"
      ],
      "markets": [
        "it"
      ],
      "period": "2024",
      "scope": [
        "National",
        "全国"
      ],
      "generation": {
        "total": 271.007173,
        "mix": {
          "coal": 3.948434,
          "gas": 118.553746,
          "nuclear": 0,
          "hydro": 53.1308,
          "wind": 22.321895,
          "solar": 35.993103,
          "otherRenewables": 22.9116,
          "other": 14.147595
        },
        "mixTotal": 271.007173,
        "basis": [
          "Gross generation; other includes storage output and miscellaneous fuels",
          "毛发电量；其他项包含储能放电及其他燃料"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 283.993909,
        "mix": {
          "industry": 106.632852,
          "households": 65.822157,
          "services": 95.76563800000001,
          "transport": 8.981826,
          "agriculture": 6.685211,
          "other": 0.106224
        },
        "mixTotal": 283.993909,
        "basis": [
          "Final electricity consumption, excluding energy-industry use and network losses",
          "终端用电；不含能源行业自用和网损"
        ]
      },
      "netImports": 50.999601000000006,
      "sources": [
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=IT&time=2024&nrg_bal=GEP&unit=GWH",
          "locator": "GEP, unit=GWH, fuel categories"
        },
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=IT&time=2024&siec=E7000&unit=GWH",
          "locator": "siec=E7000, FC_E and sectors, unit=GWH"
        },
        {
          "name": "Eurostat",
          "title": "nrg_cb_e",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_e?lang=EN&geo=IT&time=2024&unit=GWH",
          "locator": "ID, IMP, EXP, unit=GWH"
        }
      ],
      "calculation": [
        "GWh ÷ 1,000 = TWh. Generation and demand shares each use their own stated total. Net imports = imports − exports.",
        "GWh ÷ 1,000 = TWh。发电与用电占比分别以所注明总量为分母；净进口 = 进口 − 出口。"
      ]
    },
    {
      "id": "de",
      "name": [
        "Germany",
        "德国"
      ],
      "markets": [
        "de"
      ],
      "period": "2024",
      "scope": [
        "National",
        "全国"
      ],
      "generation": {
        "total": 514.009,
        "mix": {
          "coal": 106.333,
          "gas": 90.487,
          "nuclear": 0,
          "hydro": 23.825,
          "wind": 138.914,
          "solar": 75.379,
          "otherRenewables": 51.299,
          "other": 27.772
        },
        "mixTotal": 514.009,
        "basis": [
          "Gross generation; other includes storage output and miscellaneous fuels",
          "毛发电量；其他项包含储能放电及其他燃料"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 471.794,
        "mix": {
          "industry": 196.583,
          "households": 132.438,
          "services": 120.771,
          "transport": 17.488,
          "agriculture": 4.514,
          "other": 0
        },
        "mixTotal": 471.794,
        "basis": [
          "Final electricity consumption, excluding energy-industry use and network losses",
          "终端用电；不含能源行业自用和网损"
        ]
      },
      "netImports": 26.269,
      "sources": [
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=DE&time=2024&nrg_bal=GEP&unit=GWH",
          "locator": "GEP, unit=GWH, fuel categories"
        },
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=DE&time=2024&siec=E7000&unit=GWH",
          "locator": "siec=E7000, FC_E and sectors, unit=GWH"
        },
        {
          "name": "Eurostat",
          "title": "nrg_cb_e",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_e?lang=EN&geo=DE&time=2024&unit=GWH",
          "locator": "ID, IMP, EXP, unit=GWH"
        }
      ],
      "calculation": [
        "GWh ÷ 1,000 = TWh. Generation and demand shares each use their own stated total. Net imports = imports − exports.",
        "GWh ÷ 1,000 = TWh。发电与用电占比分别以所注明总量为分母；净进口 = 进口 − 出口。"
      ]
    },
    {
      "id": "es",
      "name": [
        "Spain",
        "西班牙"
      ],
      "markets": [
        "es"
      ],
      "period": "2024",
      "scope": [
        "National",
        "全国"
      ],
      "generation": {
        "total": 287.91475799999995,
        "mix": {
          "coal": 2.581517,
          "gas": 52.329097,
          "nuclear": 54.53238,
          "hydro": 34.414726,
          "wind": 62.089787,
          "solar": 58.29247,
          "otherRenewables": 6.173986,
          "other": 17.500795
        },
        "mixTotal": 287.91475799999995,
        "basis": [
          "Gross generation; other includes storage output and miscellaneous fuels",
          "毛发电量；其他项包含储能放电及其他燃料"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 229.96437,
        "mix": {
          "industry": 68.201448,
          "households": 75.158037,
          "services": 76.076255,
          "transport": 4.692386000000001,
          "agriculture": 5.436147,
          "other": 0.400097
        },
        "mixTotal": 229.96437,
        "basis": [
          "Final electricity consumption, excluding energy-industry use and network losses",
          "终端用电；不含能源行业自用和网损"
        ]
      },
      "netImports": -10.226994000000001,
      "sources": [
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=ES&time=2024&nrg_bal=GEP&unit=GWH",
          "locator": "GEP, unit=GWH, fuel categories"
        },
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=ES&time=2024&siec=E7000&unit=GWH",
          "locator": "siec=E7000, FC_E and sectors, unit=GWH"
        },
        {
          "name": "Eurostat",
          "title": "nrg_cb_e",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_e?lang=EN&geo=ES&time=2024&unit=GWH",
          "locator": "ID, IMP, EXP, unit=GWH"
        }
      ],
      "calculation": [
        "GWh ÷ 1,000 = TWh. Generation and demand shares each use their own stated total. Net imports = imports − exports.",
        "GWh ÷ 1,000 = TWh。发电与用电占比分别以所注明总量为分母；净进口 = 进口 − 出口。"
      ]
    },
    {
      "id": "uk",
      "name": [
        "United Kingdom",
        "英国"
      ],
      "markets": [
        "gb"
      ],
      "period": "2024",
      "scope": [
        "United Kingdom incl. Northern Ireland · context for Great Britain",
        "英国含北爱尔兰 · 大不列颠市场的国家背景"
      ],
      "generation": {
        "total": 286.0275332,
        "mix": {
          "coal": 2.0400816,
          "gas": 87.4093044,
          "nuclear": 40.5878448,
          "hydro": 5.731,
          "wind": 83.6177165,
          "solar": 14.992,
          "otherRenewables": 40.1440106,
          "other": 11.5055754
        },
        "mixTotal": 286.0275332,
        "basis": [
          "Gross generation; other includes storage output and miscellaneous fuels",
          "毛发电量；其他项包含储能放电及其他燃料"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 270.96208909999996,
        "mix": {
          "industry": 78.2727597,
          "households": 93.7215123,
          "services": 82.02103530000001,
          "transport": 12.9466492,
          "agriculture": 4.0001327,
          "other": 0
        },
        "mixTotal": 270.96208909999996,
        "basis": [
          "Final electricity consumption, excluding energy-industry use and network losses",
          "终端用电；不含能源行业自用和网损"
        ]
      },
      "netImports": 33.4078202,
      "sources": [
        {
          "name": "Department for Energy Security and Net Zero",
          "title": "DUKES 5.6, 2026 edition",
          "url": "https://assets.publishing.service.gov.uk/media/6a6a3616862aaf18d9c629eb/DUKES_5.6.xlsx",
          "locator": "Sheet 5.6 · AE69:AE85"
        },
        {
          "name": "Department for Energy Security and Net Zero",
          "title": "DUKES 5.1, 2026 edition",
          "url": "https://assets.publishing.service.gov.uk/media/6a6a35d80ddb7e4831c629ef/DUKES_5.1.xlsx",
          "locator": "Sheet 5.1 · AB6:AB55"
        },
        {
          "name": "Department for Energy Security and Net Zero",
          "title": "Department for Energy Security and Net Zero",
          "url": "https://www.gov.uk/government/statistics/electricity-chapter-5-digest-of-united-kingdom-energy-statistics-dukes",
          "locator": ""
        }
      ],
      "calculation": [
        "GWh ÷ 1,000 = TWh. Generation and demand shares each use their own stated total. Net imports = imports − exports.",
        "GWh ÷ 1,000 = TWh。发电与用电占比分别以所注明总量为分母；净进口 = 进口 − 出口。"
      ]
    },
    {
      "id": "ie",
      "name": [
        "Ireland",
        "爱尔兰"
      ],
      "markets": [
        "ie"
      ],
      "period": "2024",
      "scope": [
        "Republic of Ireland · excludes Northern Ireland",
        "爱尔兰共和国 · 不含北爱尔兰"
      ],
      "generation": {
        "total": 31.492653999999998,
        "mix": {
          "coal": 0.632611,
          "gas": 15.095854,
          "nuclear": 0,
          "hydro": 0.766112,
          "wind": 11.649561,
          "solar": 1.093092,
          "otherRenewables": 1.003398,
          "other": 1.252026
        },
        "mixTotal": 31.492653999999998,
        "basis": [
          "Gross generation; other includes storage output and miscellaneous fuels",
          "毛发电量；其他项包含储能放电及其他燃料"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 32.857858,
        "mix": {
          "industry": 6.932918,
          "households": 8.370999,
          "services": 16.634083,
          "transport": 0.42811099999999996,
          "agriculture": 0.491747,
          "other": 0
        },
        "mixTotal": 32.857858,
        "basis": [
          "Final electricity consumption, excluding energy-industry use and network losses",
          "终端用电；不含能源行业自用和网损"
        ]
      },
      "netImports": 5.060847,
      "sources": [
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=IE&time=2024&nrg_bal=GEP&unit=GWH",
          "locator": "GEP, unit=GWH, fuel categories"
        },
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=IE&time=2024&siec=E7000&unit=GWH",
          "locator": "siec=E7000, FC_E and sectors, unit=GWH"
        },
        {
          "name": "Eurostat",
          "title": "nrg_cb_e",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_e?lang=EN&geo=IE&time=2024&unit=GWH",
          "locator": "ID, IMP, EXP, unit=GWH"
        }
      ],
      "calculation": [
        "GWh ÷ 1,000 = TWh. Generation and demand shares each use their own stated total. Net imports = imports − exports.",
        "GWh ÷ 1,000 = TWh。发电与用电占比分别以所注明总量为分母；净进口 = 进口 − 出口。"
      ]
    },
    {
      "id": "fi",
      "name": [
        "Finland",
        "芬兰"
      ],
      "markets": [
        "fi"
      ],
      "period": "2024",
      "scope": [
        "National",
        "全国"
      ],
      "generation": {
        "total": 83.152987,
        "mix": {
          "coal": 0.83,
          "gas": 0.782,
          "nuclear": 32.599,
          "hydro": 14.299241,
          "wind": 21.046257,
          "solar": 0.939941,
          "otherRenewables": 10.387817,
          "other": 2.268731
        },
        "mixTotal": 83.152987,
        "basis": [
          "Gross generation; other includes storage output and miscellaneous fuels",
          "毛发电量；其他项包含储能放电及其他燃料"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 76.311,
        "mix": {
          "industry": 33.528,
          "households": 22.035,
          "services": 17.684,
          "transport": 1.466,
          "agriculture": 1.598,
          "other": 0
        },
        "mixTotal": 76.311,
        "basis": [
          "Final electricity consumption, excluding energy-industry use and network losses",
          "终端用电；不含能源行业自用和网损"
        ]
      },
      "netImports": 3.181,
      "sources": [
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=FI&time=2024&nrg_bal=GEP&unit=GWH",
          "locator": "GEP, unit=GWH, fuel categories"
        },
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=FI&time=2024&siec=E7000&unit=GWH",
          "locator": "siec=E7000, FC_E and sectors, unit=GWH"
        },
        {
          "name": "Eurostat",
          "title": "nrg_cb_e",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_e?lang=EN&geo=FI&time=2024&unit=GWH",
          "locator": "ID, IMP, EXP, unit=GWH"
        }
      ],
      "calculation": [
        "GWh ÷ 1,000 = TWh. Generation and demand shares each use their own stated total. Net imports = imports − exports.",
        "GWh ÷ 1,000 = TWh。发电与用电占比分别以所注明总量为分母；净进口 = 进口 − 出口。"
      ]
    },
    {
      "id": "pl",
      "name": [
        "Poland",
        "波兰"
      ],
      "markets": [
        "pl"
      ],
      "period": "2024",
      "scope": [
        "National",
        "全国"
      ],
      "generation": {
        "total": 172.45280799999998,
        "mix": {
          "coal": 93.49608,
          "gas": 20.456963,
          "nuclear": 0,
          "hydro": 2.114529,
          "wind": 24.945223,
          "solar": 17.66276,
          "otherRenewables": 7.951648,
          "other": 5.825605
        },
        "mixTotal": 172.45280799999998,
        "basis": [
          "Gross generation; other includes storage output and miscellaneous fuels",
          "毛发电量；其他项包含储能放电及其他燃料"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 140.931104,
        "mix": {
          "industry": 53.352316,
          "households": 32.523655,
          "services": 49.355886,
          "transport": 3.93915,
          "agriculture": 1.760097,
          "other": 0
        },
        "mixTotal": 140.931104,
        "basis": [
          "Final electricity consumption, excluding energy-industry use and network losses",
          "终端用电；不含能源行业自用和网损"
        ]
      },
      "netImports": 1.9653539999999994,
      "sources": [
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=PL&time=2024&nrg_bal=GEP&unit=GWH",
          "locator": "GEP, unit=GWH, fuel categories"
        },
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=PL&time=2024&siec=E7000&unit=GWH",
          "locator": "siec=E7000, FC_E and sectors, unit=GWH"
        },
        {
          "name": "Eurostat",
          "title": "nrg_cb_e",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_e?lang=EN&geo=PL&time=2024&unit=GWH",
          "locator": "ID, IMP, EXP, unit=GWH"
        }
      ],
      "calculation": [
        "GWh ÷ 1,000 = TWh. Generation and demand shares each use their own stated total. Net imports = imports − exports.",
        "GWh ÷ 1,000 = TWh。发电与用电占比分别以所注明总量为分母；净进口 = 进口 − 出口。"
      ]
    },
    {
      "id": "ro",
      "name": [
        "Romania",
        "罗马尼亚"
      ],
      "markets": [
        "ro"
      ],
      "period": "2024",
      "scope": [
        "National",
        "全国"
      ],
      "generation": {
        "total": 53.376025,
        "mix": {
          "coal": 7.959655,
          "gas": 9.154497,
          "nuclear": 10.911981,
          "hydro": 14.192604,
          "wind": 6.35028,
          "solar": 3.422688,
          "otherRenewables": 0.476487,
          "other": 0.907833
        },
        "mixTotal": 53.376025,
        "basis": [
          "Gross generation; other includes storage output and miscellaneous fuels",
          "毛发电量；其他项包含储能放电及其他燃料"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 42.969967,
        "mix": {
          "industry": 17.070291,
          "households": 13.907328,
          "services": 10.294406,
          "transport": 1.156512,
          "agriculture": 0.54143,
          "other": 0
        },
        "mixTotal": 42.969967,
        "basis": [
          "Final electricity consumption, excluding energy-industry use and network losses",
          "终端用电；不含能源行业自用和网损"
        ]
      },
      "netImports": 2.9575110000000002,
      "sources": [
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=RO&time=2024&nrg_bal=GEP&unit=GWH",
          "locator": "GEP, unit=GWH, fuel categories"
        },
        {
          "name": "Eurostat",
          "title": "nrg_bal_c",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?lang=EN&geo=RO&time=2024&siec=E7000&unit=GWH",
          "locator": "siec=E7000, FC_E and sectors, unit=GWH"
        },
        {
          "name": "Eurostat",
          "title": "nrg_cb_e",
          "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_cb_e?lang=EN&geo=RO&time=2024&unit=GWH",
          "locator": "ID, IMP, EXP, unit=GWH"
        }
      ],
      "calculation": [
        "GWh ÷ 1,000 = TWh. Generation and demand shares each use their own stated total. Net imports = imports − exports.",
        "GWh ÷ 1,000 = TWh。发电与用电占比分别以所注明总量为分母；净进口 = 进口 − 出口。"
      ]
    },
    {
      "id": "au",
      "name": [
        "Australia",
        "澳大利亚"
      ],
      "markets": [
        "wa",
        "nem"
      ],
      "period": "FY2024–25",
      "scope": [
        "Australia incl. off-grid · context for NEM and WA",
        "澳大利亚全国含离网 · NEM 与西澳的国家背景"
      ],
      "generation": {
        "total": 282.478,
        "mix": {
          "coal": 123.777,
          "gas": 47.952,
          "hydro": 14.078,
          "wind": 35.554,
          "solar": 53.355,
          "otherRenewables": 3.227,
          "other": 4.535
        },
        "mixTotal": 282.478,
        "basis": [
          "All domestic generation including industrial self-generation, rooftop solar, off-grid generation and power-station own-use.",
          "全国发电量，包含工商业自发电、屋顶光伏、离网发电及电站自用电。"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 245.75,
        "mix": {
          "industry": 92.77777777777777,
          "households": 74.16666666666667,
          "services": 64.16666666666667,
          "transport": 8.055555555555555,
          "agriculture": 2.5,
          "other": 4.166666666666667
        },
        "mixTotal": 245.833333333,
        "basis": [
          "Final electricity consumption; electricity used in energy transformation is excluded. Sector data are rounded to whole PJ, summing to 885 PJ versus the 884.7 PJ headline; chart shares use the component sum.",
          "终端用电量，剔除能源转换环节用电。 行业用电量按整数 PJ 发布，合计 885 PJ；总量为 884.7 PJ。结构图按行业合计计算占比。"
        ]
      },
      "sources": [
        {
          "name": "Department of Climate Change, Energy, the Environment and Water",
          "title": "Australian Energy Update 2026",
          "url": "https://www.energy.gov.au/sites/default/files/Australian_Energy_Statistics_2026_Energy_Update_Report.pdf",
          "locator": "Table 13, printed page 29 / PDF page 36"
        },
        {
          "name": "Department of Climate Change, Energy, the Environment and Water",
          "title": "Australian Energy Flows 2024–25",
          "url": "https://www.energy.gov.au/sites/default/files/2026-09/Australian%20Energy%20Flows%202024-25.pdf",
          "locator": ""
        },
        {
          "name": "Department of Climate Change, Energy, the Environment and Water",
          "title": "Australian Energy Update 2026 publication",
          "url": "https://www.energy.gov.au/publications/australian-energy-update-2026",
          "locator": ""
        }
      ],
      "calculation": [
        "Components sum to 282.478 TWh. Fossil = coal + gas + oil. Renewables = solar + wind + hydro + bioenergy. Sector percentages = each rounded electricity component / 885 PJ. Headline 884.7 PJ / 3.6 = 245.75 TWh.",
        "发电 GWh ÷ 1,000；用电 PJ ÷ 3.6。行业占比按舍入后合计 885 PJ 计算。"
      ]
    },
    {
      "id": "jp",
      "name": [
        "Japan",
        "日本"
      ],
      "markets": [
        "jp_tokyo",
        "jp_kyushu",
        "jp_hokkaido"
      ],
      "period": "FY2024",
      "scope": [
        "Japan · national context for three regions",
        "日本全国 · 三个区域市场的国家背景"
      ],
      "generation": {
        "total": 991.1,
        "mix": {
          "coal": 278.5,
          "gas": 319.4,
          "nuclear": 93.5,
          "hydro": 73.5,
          "wind": 11.7,
          "solar": 98.1,
          "otherRenewables": 45.3,
          "other": 71.1
        },
        "mixTotal": 991.1,
        "basis": [
          "Domestic electricity generation; hydro excludes generation from pumped water.",
          "国内发电量；水电不包含利用抽水水量产生的抽蓄发电。"
        ],
        "kind": "gross"
      },
      "demand": {
        "total": 880.8,
        "mix": {
          "industry": 307.7,
          "households": 252.1,
          "services": 293.1,
          "transport": 16.5,
          "other": 11.4
        },
        "mixTotal": 880.8,
        "basis": [
          "Final electricity consumption, excluding conversion own-use and transmission/distribution losses.",
          "终端用电量，不含能源转换自用电及输配电损失。"
        ],
        "sectorLabels": {
          "industry": [
            "Manufacturing",
            "制造业"
          ],
          "services": [
            "Services and other",
            "服务业等"
          ],
          "other": [
            "Other business",
            "其他生产经营部门"
          ]
        }
      },
      "sources": [
        {
          "name": "Agency for Natural Resources and Energy",
          "title": "FY2024 Energy Supply and Demand Report (final)",
          "url": "https://www.enecho.meti.go.jp/statistics/total_energy/pdf/honbun2024fykaku.pdf",
          "locator": "Table 35, printed page 28"
        },
        {
          "name": "Ministry of Economy, Trade and Industry",
          "title": "FY2024 Energy Supply and Demand Report (Revised Report)",
          "url": "https://www.meti.go.jp/english/press/2026/0414_001.html",
          "locator": ""
        }
      ],
      "calculation": [
        "Components sum to 991.1 TWh. Renewable = hydro + solar + wind + geothermal + biomass. Fossil = coal + gas + oil/other. 612.2 business + 252.1 residential + 16.5 transport = 880.8 final consumption. 880.8 + 52.9 + 47.0 + 1.1 = 981.8 broader demand.",
        "亿 kWh ÷ 10 = TWh；其他生产经营 = 612.2 − 307.7 − 293.1。"
      ]
    },
    {
      "id": "us",
      "name": [
        "United States",
        "美国"
      ],
      "markets": [
        "caiso",
        "pjm",
        "ercot"
      ],
      "period": "2024",
      "scope": [
        "United States · national context for three regional markets",
        "美国全国 · 对应三个区域市场的国家背景"
      ],
      "generation": {
        "total": 4392.552,
        "mix": {
          "coal": 652.156,
          "gas": 1869.902,
          "nuclear": 781.865,
          "hydro": 242.896,
          "wind": 451.904,
          "solar": 303.752,
          "otherRenewables": 61.829,
          "other": 34.1
        },
        "mixTotal": 4398.404,
        "kind": "net",
        "basis": [
          "Net incl. small solar; mix excludes net pumped-storage use (5.852 TWh)",
          "净发电含小型光伏；构成图剔除抽蓄净耗电（5.852 TWh）"
        ]
      },
      "demand": {
        "total": 4181.364528,
        "mix": {
          "industry": 1034.58419,
          "households": 1482.873586,
          "services": 1450.941216,
          "transport": 6.98284,
          "directUse": 205.982696
        },
        "mixTotal": 4181.364528,
        "basis": [
          "Retail sectors plus direct use shown separately; no allocation of direct use to sectors",
          "零售行业用电，加单列的直接自用；未将直接自用分配至各行业"
        ]
      },
      "netImports": 13.817,
      "sources": [
        {
          "name": "U.S. Energy Information Administration",
          "title": "Electric Power Annual table 3.1.A, net generation by energy source, 2024 row",
          "url": "https://www.eia.gov/electricity/annual/html/epa_03_01_a.html",
          "locator": ""
        },
        {
          "name": "U.S. Energy Information Administration",
          "title": "Electric Power Annual table 3.1.B, renewable generation, 2024 row",
          "url": "https://www.eia.gov/electricity/annual/html/epa_03_01_b.html",
          "locator": ""
        },
        {
          "name": "U.S. Energy Information Administration",
          "title": "Electric Power Annual table 2.2, sales and direct use, 2024 row",
          "url": "https://www.eia.gov/electricity/annual/html/epa_02_02.html",
          "locator": ""
        },
        {
          "name": "U.S. Energy Information Administration",
          "title": "Electric Power Annual table 1.3, supply and disposition, 2024 row",
          "url": "https://www.eia.gov/electricity/annual/html/epa_01_03.html",
          "locator": ""
        }
      ],
      "calculation": [
        "EIA thousand MWh / 1000 = TWh. 4308.634 + 83.918 = 4392.552 TWh; positive source components sum 4398.404 TWh; minus 5.852 TWh net pumped-storage = 4392.552 TWh. Source-chart percentages may use 4398.404 only if explicitly labelled excluding net pumped-storage. Do not silently force components to the net total. MWh / 1000000 = TWh. Retail sector sum = 3975.381832; retail + 135.040521 direct use + 70.942175 solar direct use = 4181.364528 TWh.",
        "发电来源合计减抽蓄净耗电 = 净发电；零售各行业加直接自用 = 终端用电。"
      ]
    },
    {
      "id": "ca",
      "name": [
        "Canada",
        "加拿大"
      ],
      "markets": [
        "ca_on"
      ],
      "period": "2024",
      "scope": [
        "Canada · national context for Ontario",
        "加拿大全国 · 安大略市场的国家背景"
      ],
      "generation": {
        "total": 621.61045,
        "mix": {
          "nuclear": 80.745292,
          "hydro": 343.181844,
          "wind": 47.021179,
          "solar": 7.725832,
          "combustibles": 142.559483,
          "other": 0.37682
        },
        "mixTotal": 621.61045,
        "kind": "gross",
        "basis": [
          "Gross generation, all producer classes, Annual Electricity Supply and Disposition Survey. Combustible fuels include biomass and cannot be labelled fossil fuels. Uses revised 2024 data released October 2026, not the original 622.2 TWh preliminary press figure.",
          "总发电量，覆盖所有发电主体，来自年度电力供需调查。可燃燃料包含生物质，不可标为化石燃料。采用2026年10月发布的2024年修订值，而非初步新闻稿的622.2 TWh。"
        ]
      },
      "demand": {
        "total": 548.8956,
        "mix": {
          "industry": 198.7189,
          "households": 179.5725,
          "services": 150.2384,
          "transport": 9.5568,
          "agriculture": 10.8091
        },
        "mixTotal": 548.8957,
        "basis": [
          "Energy use, final demand from the national energy balance. Both primary and secondary electricity disposition are reported under the primary-electricity column. Excludes producer consumption; distinct from retail sales and domestic availability. Latest 2024 revisions released November 10, 2026.",
          "全国能源平衡表的最终电力消费。一次及二次电力的消费统一记在一次电力栏。排除生产者自用；与零售售电、境内可用电量不同。采用2026年11月10日发布的2024年修订值。"
        ]
      },
      "netImports": -12.627249,
      "sources": [
        {
          "name": "Statistics Canada",
          "title": "Table 25-10-0020-01, Canada, 2024, all producer classes",
          "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2510002001",
          "locator": "",
          "releasedOn": "2026-10-16"
        },
        {
          "name": "Statistics Canada",
          "title": "Annual Electricity Supply and Disposition Survey 2024, gross generation and own-use definitions",
          "url": "https://www.statcan.gc.ca/en/statistical-programs/instrument/2194_Q2_V14",
          "locator": ""
        },
        {
          "name": "Statistics Canada",
          "title": "Table 25-10-0021-01, Canada, 2024, electricity quantity",
          "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2510002101",
          "locator": "",
          "releasedOn": "2026-10-16"
        },
        {
          "name": "Statistics Canada",
          "title": "Table 25-10-0030-01, Canada, 2024, electricity final demand",
          "url": "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2510003001",
          "locator": "",
          "releasedOn": "2026-11-10"
        },
        {
          "name": "Statistics Canada",
          "title": "Energy Supply and Demand explanatory information, primary/secondary electricity and final demand",
          "url": "https://www150.statcan.gc.ca/n1/pub/57-003-x/57-003-x2026001-eng.htm",
          "locator": "",
          "releasedOn": "2026-11-10"
        }
      ],
      "calculation": [
        "MWh / 1000000 = TWh. Six positive components sum exactly 621.610450 TWh. Wind + solar = 54.747011 TWh. GWh / 1000 = TWh. Sector components sum 548.8957 TWh vs published total 548.8956, a 0.0001 TWh independent-rounding difference. Services may be grouped as 136.2210 + 14.0174 = 150.2384 TWh.",
        "发电来源之和 = 毛发电量；行业合计与总量有 0.0001 TWh 独立舍入差。"
      ]
    },
    {
      "id": "sa",
      "name": [
        "Saudi Arabia",
        "沙特阿拉伯"
      ],
      "markets": [
        "sa"
      ],
      "period": "2024",
      "scope": [
        "Saudi Arabia · national connected system",
        "沙特阿拉伯 · 全国联网系统"
      ],
      "gridSent": {
        "total": 402.62849949441,
        "basis": [
          "Electricity delivered from generating plants to transmission or distribution networks; not national gross generation.",
          "发电厂送入输配电网的电量，口径不同于全国总发电量。"
        ]
      },
      "demand": {
        "total": 340.43,
        "mix": {
          "industry": 63.446,
          "households": 161.207,
          "services": 96.34100000000001,
          "other": 19.436
        },
        "mixTotal": 340.43,
        "basis": [
          "Electricity sales to final customers in the connected system; excludes internal loads and electricity transmitted within the transmission network.",
          "联网系统面向终端用户的售电量，不含内部负荷及输电网内部传输电量。"
        ],
        "sectorLabels": {
          "other": [
            "Other users incl. agriculture and desalination",
            "其他用户（含农业、海水淡化等）"
          ]
        }
      },
      "sources": [
        {
          "name": "General Authority for Statistics",
          "title": "Electrical Energy Statistics 2024 tables",
          "url": "https://www.stats.gov.sa/documents/d/guest/electricity-statistics-2024-en",
          "locator": "Sheet 6 C20 and Sheet 8 C9:G9"
        },
        {
          "name": "General Authority for Statistics",
          "title": "Electrical Energy Statistics 2024",
          "url": "https://www.stats.gov.sa/documents/20117/2435281/Electrical%2BEnergy%2BStatistics%2B2024%2BEN.pdf/fe9d3d6f-809b-cdb9-7559-3f2a21f4e415?t=1765087585713",
          "locator": ""
        },
        {
          "name": "General Authority for Statistics",
          "title": "Methodology and Quality Report for Electrical Energy Statistics 2024",
          "url": "https://www.stats.gov.sa/en/w/methodology-and-quality-report-for-electrical-energy-statistics-2024",
          "locator": ""
        }
      ],
      "calculation": [
        "GWh / 1000 = TWh 161207 + 58821 + 37520 + 63446 + 19436 = 340430 GWh.",
        "GWh ÷ 1,000 = TWh。行业用电之和 = 340.430 TWh；供电量与毛发电量分开记录。"
      ]
    }
  ],
  "italy": {
    "year": 2024,
    "generation": 270.9631,
    "netGeneration": 263.2293,
    "storageInput": 2.315,
    "domesticForUse": 260.9143,
    "demand": 311.9139,
    "consumption": 292.7125,
    "netImports": 50.9996,
    "losses": 19.2014,
    "generationMix": {
      "coal": 3.9484,
      "gas": 118.5537,
      "nuclear": 0,
      "hydro": 53.1308,
      "wind": 22.3219,
      "solar": 35.9931,
      "otherRenewables": 22.9117,
      "other": 14.1035
    },
    "demandMix": {
      "industry": 124.8236,
      "services": 95.7744,
      "households": 65.4293,
      "agriculture": 6.6852
    },
    "regions": [
      {
        "id": "north",
        "name": [
          "North",
          "北部"
        ],
        "consumption": 168.3554,
        "industry": 81.5944,
        "wind": 0.4495,
        "solar": 15.0929
      },
      {
        "id": "centre",
        "name": [
          "Centre",
          "中部"
        ],
        "consumption": 51.6337,
        "industry": 17.576,
        "wind": 0.4129,
        "solar": 6.8759
      },
      {
        "id": "south",
        "name": [
          "South & islands",
          "南部及岛屿"
        ],
        "consumption": 72.7234,
        "industry": 25.6531,
        "wind": 21.4595,
        "solar": 14.0243
      }
    ],
    "sources": [
      {
        "name": "Terna",
        "title": "2024 electricity generation / Produzione",
        "url": "https://download.terna.it/terna/05_PRODUZIONE_8de2cfee270553c.pdf",
        "locator": "Tables 25, 31, 34–35; PDF pp. 4, 15, 22–23"
      },
      {
        "name": "Terna",
        "title": "2024 electricity consumption / Consumi",
        "url": "https://download.terna.it/terna/06_CONSUMI_8de38d06c930a94.pdf",
        "locator": "Tables 36, 39; PDF pp. 4, 11"
      },
      {
        "name": "Terna",
        "title": "2024 regional electricity balances",
        "url": "https://download.terna.it/terna/08_TAVOLE_elettricita_nelle_regioni_8de5cddcf9e8f90.pdf",
        "locator": "Italy, tables 1–2; PDF pp. 4–5"
      }
    ],
    "calculation": [
      "Net generation 263.2293 − storage inputs 2.3150 + net imports 50.9996 = system demand 311.9139 TWh; less losses 19.2014 = consumption 292.7125. Regional shares use national totals. Generation other = gross minus named categories; includes pumped-storage output.",
      "净发电 263.2293 − 储能用电 2.3150 + 净进口 50.9996 = 系统需求 311.9139 TWh；减网损 19.2014 = 用电量 292.7125。区域占比使用全国总量；其他发电为差额，包含抽蓄放电。"
    ]
  },
  "methodology": [
    "Country contexts for all 18 platform markets. National generation and final-use definitions remain source-specific; fiscal periods are explicit. A missing source series is omitted, never zero-filled. No investment-model inputs or ETL observations are changed.",
    "覆盖平台全部 18 个市场的国家背景。发电及终端用电保留各来源口径，财年明确标注；未取得的序列不填零。投资模型与既有 ETL 观测不变。"
  ]
};
