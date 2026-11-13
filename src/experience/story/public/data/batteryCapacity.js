// Public primary-source storage context. Dates, units and scenario boundaries are deliberate.
export const BATTERY_CAPACITY = {
  "checkedOn": "2026-11-13",
  "countryCount": 13,
  "marketCount": 18,
  "rows": [
    {
      "id": "it",
      "country": "it",
      "name": [
        "Italy",
        "意大利"
      ],
      "scope": [
        "Standalone · gross power",
        "独立储能 · 毛功率"
      ],
      "note": [
        "Standalone stock excludes co-located systems. The 2030 non-distributed storage scenario is 61.1 GWh (40.0 utility + 10.0 MACSE + 11.1 capacity market); it excludes existing pumped hydro but is not verified battery-only, so it is not paired with this battery context.",
        "独立储能不含附属于发电设施的系统。2030 非分布式储能情景为 61.1 GWh（40.0 电网级 + 10.0 MACSE + 11.1 容量市场），虽剔除已有抽蓄，但未确认全部为电池，因此不直接配对。"
      ],
      "current": {
        "date": "2024-12-31",
        "kind": "observed",
        "gw": 1.0555
      },
      "sources": [
        {
          "title": "Terna · Impianti di Generazione 2024",
          "url": "https://download.terna.it/terna/03_IMPIANTI%20DI%20GENERAZIONE_8ddfc50c3f3e879.pdf",
          "locator": "Table 8, printed p3; definition of gross/net efficient power p4"
        },
        {
          "title": "Terna · Documento di Descrizione degli Scenari 2026",
          "url": "https://download.terna.it/terna/Documento_Descrizione_Scenari_2026_8df2616cc49b332.pdf",
          "locator": "Table 41, PDF p120 / printed p119; section 7.2.2 printed pp43-45"
        }
      ]
    },
    {
      "id": "de",
      "country": "de",
      "name": [
        "Germany",
        "德国"
      ],
      "scope": [
        "Large batteries >999 kW",
        "大型电池 >999 kW"
      ],
      "caption": [
        "Large-battery proxy; industrial own-use may remain. 2030 MMS assumption (2026 edition).",
        "以大型电池为口径，可能含工业自用；2030 为 2026 版 MMS 情景假设。"
      ],
      "note": [
        "Current gross power and usable energy; home batteries excluded. The large-size threshold does not prove all facilities are front of meter. The 2030 scenario separately states 14 GW / 27 GWh; its energy definition is not reconciled with current usable energy, so only power is paired.",
        "现状为毛功率及可用容量，不含户用；规模门槛不能保证全部为表前项目。2030 情景分别给出 14 GW／27 GWh，容量定义未与现状可用容量统一，故只配对功率。"
      ],
      "current": {
        "date": "2025-10-15",
        "kind": "observed",
        "gw": 2.4,
        "gwh": 3.2,
        "approximate": true
      },
      "sources": [
        {
          "title": "Bundesnetzagentur · Speicher",
          "url": "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/Speicher/start.html",
          "locator": "Current inventory paragraph; status15 October2025"
        },
        {
          "title": "Umweltbundesamt · Projektionsdaten2026 assumptions, third editionJune2026",
          "url": "https://www.umweltbundesamt.de/system/files/medien/11850/publikationen/2026-06/P26_ZSA_3.Auflage.pdf",
          "locator": "Section3.12.2; Table14, PDF p45 / printed p45; Table15 is a different metric"
        }
      ],
      "outlook": {
        "date": "2030",
        "kind": "scenario",
        "gw": 14
      },
      "comparable": [
        "gw"
      ]
    },
    {
      "id": "uk",
      "country": "uk",
      "name": [
        "Great Britain",
        "英国 GB"
      ],
      "scope": [
        "Great Britain · batteries",
        "大不列颠 · 电池"
      ],
      "caption": [
        "Clean Power 2030 delivery range; excludes Northern Ireland.",
        "Clean Power 2030 政策交付区间；不含北爱尔兰。"
      ],
      "note": [
        "Same source table: current 4.55 GW and policy range 23–27 GW; long-duration storage is separate. The range is a target, not an unconditional forecast.",
        "同一来源表列出现状 4.55 GW、政策区间 23–27 GW；长时储能单列。该区间是目标，不是无条件预测。"
      ],
      "current": {
        "date": "2024-Q4",
        "kind": "observed",
        "gw": 4.55
      },
      "sources": [
        {
          "title": "DESNZ · Clean Power2030 Action Plan connections reform annex",
          "url": "https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-connections-reform-annex",
          "locator": "Table1: Batteries, Current installed capacity(2024); updated15 April2025"
        }
      ],
      "outlook": {
        "date": "2030",
        "kind": "target",
        "gw": [
          23,
          27
        ]
      },
      "comparable": [
        "gw"
      ]
    },
    {
      "id": "ie",
      "country": "ie",
      "name": [
        "Ireland",
        "爱尔兰"
      ],
      "scope": [
        "Republic · grid-exporting batteries",
        "爱尔兰共和国 · 并网电池"
      ],
      "caption": [
        "2030 network-planning scenario, July 2023 vintage; excludes Northern Ireland.",
        "2030 电网规划情景，版本为 2023 年 7 月；不含北爱尔兰。"
      ],
      "note": [
        "Current power is maximum export capacity, not DC cell nameplate; grid export ≥0.2 MW, own-use household/business systems excluded. SEAI 2025: 837.1 MW / 1,202.91 MWh. The 2030 battery assumption is 3,225 MW; pumped hydro is separate.",
        "现状功率是最大并网输出能力，不是电芯直流铭牌；并网输出至少 0.2 MW，剔除家庭及企业自用系统。SEAI 2025 年为 837.1 MW／1,202.91 MWh；2030 电池假设为 3,225 MW，抽蓄单列。"
      ],
      "current": {
        "date": "2025-12-31",
        "kind": "observed",
        "gw": 0.8371,
        "gwh": 1.20291
      },
      "sources": [
        {
          "title": "SEAI · Energy in Ireland2026 Part3",
          "url": "https://www.seai.ie/sites/default/files/publications/Energy-in-Ireland-2026-Part-3.pdf",
          "locator": "Tables3.9/3.10 printed pp35–36,2025 column"
        },
        {
          "title": "EirGrid · Shaping Our Electricity Future Roadmap v1.1",
          "url": "https://cms.eirgrid.ie/sites/default/files/publications/Shaping-Our-Electricity-Future-Roadmap_Version-1.1_07.23.pdf",
          "locator": "Section6.3.8, Table14 printed p91 / PDF p91; Table15 duration bands"
        }
      ],
      "outlook": {
        "date": "2030",
        "kind": "scenario",
        "gw": 3.225
      },
      "comparable": [
        "gw"
      ]
    },
    {
      "id": "ro",
      "country": "ro",
      "name": [
        "Romania",
        "罗马尼亚"
      ],
      "scope": [
        "Licensed system batteries",
        "电力系统持证电池"
      ],
      "caption": [
        "Operating licences → NECP policy target; target meter-side boundary is not stated.",
        "持运营许可装机 → NECP 政策目标；目标未明确表前／表后边界。"
      ],
      "note": [
        "Current is the 1 February 2025 operating-licence inventory, not year-end 2024. The 2030 target explicitly gives 1,200 MW / 2,400 MWh, with pumped hydro separate. Current available energy and future target energy are not assumed identical definitions; only power is paired.",
        "现状为 2025 年 2 月 1 日运营许可清单，不能记作 2024 年末。2030 目标明确为 1,200 MW／2,400 MWh，抽蓄另列。现状可用容量与未来目标容量未假定同义，故只配对功率。"
      ],
      "current": {
        "date": "2025-02-01",
        "kind": "observed",
        "gw": 0.1372,
        "gwh": 0.269
      },
      "sources": [
        {
          "title": "Transelectrica · Annual report2024",
          "url": "https://www.transelectrica.ro/documents/10179/19114374/Raport%2BAnual%2B2024%2BTranselectrica_Modificare%2BAGA_RO.pdf/11ba6ab7-90df-4e43-ba57-c347d318c59c",
          "locator": "Integration of battery storage into SEN; PDF p105 / printed p99; explicit1 February2025 date"
        },
        {
          "title": "Transelectrica · National adequacy study2027,2030,2035",
          "url": "https://www.transelectrica.ro/documents/10179/22561337/Raport%2BPublic%2B-%2BStudiu%2Bde%2BAdecvanta%2BSEN%2B2027%2B2030%2B2035.pdf/fb9116f1-0bb6-46fa-9738-96cbca6f4534",
          "locator": "Section3.2.8, printed p60 / PDF p60; explicit quotation of the NECP battery target"
        }
      ],
      "outlook": {
        "date": "2030",
        "kind": "target",
        "gw": 1.2
      },
      "comparable": [
        "gw"
      ]
    },
    {
      "id": "es",
      "country": "es",
      "name": [
        "Spain",
        "西班牙"
      ],
      "scope": [
        "National system batteries",
        "全国电力系统电池"
      ],
      "note": [
        "End-2025 battery stock is 96 MW. Spain’s 22.5 GW 2030 storage objective spans multiple technologies and is not a battery-only forecast; it is excluded from the paired battery chart.",
        "2025 年末电池为 96 MW；西班牙 2030 年 22.5 GW 储能目标包含多种技术，不是纯电池预测，因此不进入配对图。"
      ],
      "current": {
        "date": "2025-12-31",
        "kind": "observed",
        "gw": 0.096,
        "approximate": true
      },
      "sources": [
        {
          "title": "Red Electrica · Installed storage capacity2025",
          "url": "https://www.sistemaelectrico-ree.es/es/informe-del-sistema-electrico/almacenamiento/potencia-instalada-de-almacenamiento",
          "locator": "Year-end2025 storage paragraph"
        },
        {
          "title": "Spanish government · Royal Decree997/2025",
          "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2025-22434",
          "locator": "Preamble describing PNIEC2023–2030 storage objective"
        }
      ]
    },
    {
      "id": "jp",
      "country": "jp",
      "name": [
        "Japan",
        "日本"
      ],
      "scope": [
        "National grid batteries",
        "全国系统用电池"
      ],
      "current": {
        "date": "2025-09-30",
        "kind": "observed",
        "gw": 0.5,
        "approximate": true
      },
      "outlook": {
        "date": "2030",
        "kind": "outlook",
        "gw": [
          4.7,
          7.933333333333334
        ],
        "gwh": [
          14.1,
          23.8
        ]
      },
      "comparable": [
        "gw"
      ],
      "caption": [
        "GW derived at the source’s 3h duration; outlook dated November 2023.",
        "GW 按来源 3 小时假设推算；展望版本为 2023 年 11 月。"
      ],
      "note": [
        "Current 50 × 10,000 kW = 0.50 GW is grid-connected, not an audited COD list. Outlook 14.1–23.8 GWh ÷ the published 3h assumption = 4.70–7.933 GW. The outlook models connection conversion (10%/20%, then 70%); it is neither an award nor an updated 2026 forecast.",
        "现状 50 万 kW＝0.50 GW 为已并网，不是经审计的投运清单。展望 14.1–23.8 GWh ÷ 来源明确的 3 小时假设＝4.70–7.933 GW，基于接入转化率 10%／20% 及后续 70% 的情景，既非中标量，也不是 2026 年更新预测。"
      ],
      "sources": [
        {
          "title": "Ministry of Economy Trade and Industry / Agency for Natural Resources and Energy · Distributed energy working group materials: grid battery connection status",
          "url": "https://www.meti.go.jp/shingikai/enecho/denryoku_gas/jisedai_kiban/distributed_energy_wg/pdf/001_03_00.pdf",
          "locator": "PDF page 70"
        },
        {
          "title": "Ministry of Economy Trade and Industry / Agency for Natural Resources and Energy · Basic Policy Subcommittee materials, reference outlook for grid batteries",
          "url": "https://www.enecho.meti.go.jp/committee/council/basic_policy_subcommittee/2024/067/067_010.pdf",
          "locator": "PDF page 77"
        }
      ]
    },
    {
      "id": "au-nem",
      "country": "au",
      "name": [
        "Australia · NEM",
        "澳洲 · NEM"
      ],
      "scope": [
        "NEM only · excludes WA/NT",
        "仅 NEM · 不含西澳及北领地"
      ],
      "current": {
        "date": ["Early 2026", "2026 年初"],
        "kind": "observed",
        "gw": 4,
        "gwh": 10,
        "approximate": true
      },
      "outlook": {
        "date": "2030",
        "kind": "scenario",
        "gw": 32.5
      },
      "comparable": [
        "gw"
      ],
      "caption": [
        "2026 ISP Step Change optimal development path; batteries incl. hybrids.",
        "2026 ISP Step Change 最优发展路径；包括混合项目电池。"
      ],
      "note": [
        "The same ISP reports approximately 4 GW / 10 GWh in operation in early 2026 and 32.5 GW battery need in 2030 (Table 6). Independent January register: 4,024.61 MW AC / 1,000 = 4.02461 GW, Battery Storage + In Service only, excluding commissioning. The rounded ISP series is used consistently here. Neither series is a national Australian total.",
        "同一版 ISP 报告 2026 年初约 4 GW／10 GWh 已投运及 2030 年电池需求 32.5 GW（表 6）。1 月登记表独立汇总为 4,024.61 MW AC ÷ 1,000＝4.02461 GW，仅计 Battery Storage + In Service，剔除调试。图中统一采用 ISP 取整口径，均不是澳洲全国总量。"
      ],
      "sources": [
        {
          "title": "Australian Energy Market Operator · 2026 Integrated System Plan",
          "url": "https://www.aemo.com.au/-/media/files/major-publications/isp/2026/2026-integrated-system-plan-isp.pdf?rev=f2f142d0a8d740a986f186da17bb8a9d&sc_lang=en",
          "locator": "Printed pages 36 and 79, Table 6"
        },
        {
          "title": "Australian Energy Market Operator · NEM Generation Information January 2026",
          "url": "https://www.aemo.com.au/-/media/files/electricity/nem/planning_and_forecasting/generation_information/2026/nem-generation-information-jan-2026.xlsx?rev=66d8f10c76c24d8688cdb7a2302dd7d2&sc_lang=en"
        }
      ]
    },
    {
      "id": "au-wem",
      "country": "au",
      "name": [
        "Australia · WEM",
        "澳洲 · WEM"
      ],
      "scope": [
        "WEM / SWIS only",
        "仅 WEM／西南互联系统"
      ],
      "current": {
        "date": "FY2025–26",
        "kind": "observed",
        "gw": 1.4,
        "approximate": true
      },
      "note": [
        "AEMO annual-report installed grid-scale stock, with no separate commissioning split beside the figure. WEM excludes parts of Western Australia. Reliability capacity in the ESOO is not interchangeable with rated battery power.",
        "AEMO 年报披露的电网级已安装规模，数字旁未再区分调试状态。WEM 不覆盖全部西澳；ESOO 可靠性容量不能替代电池额定装机。"
      ],
      "sources": [
        {
          "title": "Australian Energy Market Operator · FY26 Annual Report",
          "url": "https://www.aemo.com.au/-/media/files/about_aemo/annual-report/2026/fy26-annual-report.pdf?hash=82B0D323B5CA3EEF686C95EB367FA9F0&rev=3d969bab2886454ea231378a85c84b8b&sc_lang=en",
          "locator": "WA electricity and gas segment discussion, printed page 59; financial performance overview, printed page 42"
        }
      ]
    },
    {
      "id": "sa",
      "country": "sa",
      "name": [
        "Saudi Arabia",
        "沙特阿拉伯"
      ],
      "scope": [
        "National grid-connected batteries",
        "全国已并网电池"
      ],
      "current": {
        "date": "2025-12-15",
        "kind": "observed",
        "gwh": 8
      },
      "outlook": {
        "date": "2030",
        "kind": "target",
        "gwh": 48
      },
      "comparable": [
        "gwh"
      ],
      "note": [
        "Official grid-connected energy is 8 GWh; the 2030 battery policy target is 48 GWh. The additional 30 GWh under development is not current stock. No GW conversion without an official duration.",
        "官方已并网容量为 8 GWh，2030 电池政策目标为 48 GWh；另外披露的开发中 30 GWh 不计现状。没有官方时长，不换算为 GW。"
      ],
      "sources": [
        {
          "title": "Saudi Press Agency reporting Ministry of Energy statement · 13th Saudi Smart Grid Conference opening, ministry address",
          "url": "https://www.spa.gov.sa/en/N2466792"
        },
        {
          "title": "Saudi Press Agency reporting Ministry of Energy statement · Minister of Energy Inaugurates Saudi Smart Grid Conference",
          "url": "https://www.spa.gov.sa/en/N2228611"
        }
      ]
    },
    {
      "id": "us",
      "country": "us",
      "name": [
        "United States",
        "美国"
      ],
      "scope": [
        "Utility-scale · nameplate power",
        "电网级 · 铭牌功率"
      ],
      "current": {
        "date": "2026-06",
        "kind": "observed",
        "gw": 52,
        "approximate": true
      },
      "note": [
        "EIA preliminary inventory reports nearly 52 GW at June 2026: 43.6 GW at end-2025 plus 8.3 GW added in the first half. This observed inventory is not paired with AEO net-summer diurnal storage, whose hybrid allocation differs.",
        "EIA 初步清单报告 2026 年 6 月接近 52 GW：2025 年末 43.6 GW 加上半年新增 8.3 GW。现状清单不与 AEO 净夏季日内储能情景直接配对，后者对混合项目的归类不同。"
      ],
      "sources": [
        {
          "title": "EIA · Battery storage capacity, 7 August 2026",
          "url": "https://www.eia.gov/TodayinEnergy/detail.php?id=67925",
          "locator": "Opening paragraph: June 2026 operational nameplate capacity"
        }
      ]
    },
    {
      "id": "us-energy",
      "country": "us",
      "name": [
        "United States",
        "美国"
      ],
      "scope": [
        "Power-supply sector batteries",
        "电力供应部门电池"
      ],
      "current": {
        "date": "2024-12-31",
        "kind": "observed",
        "gwh": 73.9027
      },
      "note": [
        "Final EIA-860 inventory: Batteries + OP + Electric Utility / IPP Non-CHP / IPP CHP; 728 units. 73,902.7 MWh / 1,000 = 73.9027 GWh. Facility reporting threshold ≥1 MW. This energy vintage is 2024, not the 2026 power observation.",
        "EIA-860 最终清单筛选 Batteries + OP + 电力企业及独立电源三个部门，共 728 条。73,902.7 MWh ÷ 1,000＝73.9027 GWh，设施申报门槛至少 1 MW。这是 2024 年容量，不与 2026 年功率视作同一期。"
      ],
      "sources": [
        {
          "title": "EIA · 2024 final generator inventory",
          "url": "https://www.eia.gov/electricity/data/eia860/archive/xls/eia8602024.zip",
          "locator": "3_4_Energy_Storage_Y2024.xlsx, Operable, header row 2. M=nameplate MW; N=summer MW; R=energy MWh; T=maximum discharge MW."
        }
      ]
    },
    {
      "id": "us-model",
      "country": "us",
      "name": [
        "US · AEO 2026",
        "美国 · AEO 2026"
      ],
      "scope": [
        "Net summer diurnal-storage capacity",
        "日内储能 · 净夏季容量"
      ],
      "current": {
        "date": "2025",
        "kind": "model",
        "gw": 43.67630767822266
      },
      "outlook": {
        "date": "2030",
        "kind": "scenario",
        "gw": 88.03060913085938
      },
      "comparable": [
        "gw"
      ],
      "caption": [
        "Counterfactual Baseline; some hybrid batteries are classified under solar.",
        "Counterfactual Baseline；部分混合项目电池归入光伏。"
      ],
      "note": [
        "This is the same AEO row in both years, not all-battery observed stock. EIA does not call this baseline the most likely case. Pumped hydro is separate; some solar-hybrid battery capacity sits within solar.",
        "两个年份均取同一 AEO 行，不是全电池实际装机；EIA 未将该基线称为最可能情景。抽蓄单列，部分光储电池归入光伏。"
      ],
      "sources": [
        {
          "title": "EIA · AEO 2026, Table 9",
          "url": "https://www.eia.gov/outlooks/aeo/excel/aeotab9.xlsx",
          "locator": "Sheet cb2026.d021826b; row 20 EGC000:ba_DiurnalStorage; year header row 10."
        },
        {
          "title": "EIA · AEO model definitions",
          "url": "https://www.eia.gov/outlooks/aeo/narrative/"
        }
      ]
    },
    {
      "id": "ca",
      "country": "ca",
      "name": [
        "Canada",
        "加拿大"
      ],
      "scope": [
        "Grid-connected project inventory ≥1 MW",
        "并网项目清单 ≥1 MW"
      ],
      "current": {
        "date": "2024-12-31",
        "kind": "observed",
        "gw": 0.3764
      },
      "caption": [
        "Inventory does not identify meter side; separate from model projections.",
        "清单未区分表前／表后；与模型预测单列。"
      ],
      "note": [
        "Filter BESS + Installed + commercial-operation year ≤2024; sum 376.4 MW / 1,000 = 0.3764 GW. Exclude 174 MW pumped hydro, 1.75 MW compressed air and 15.4 MW commissioned in 2025. Not a strict FTM inventory.",
        "筛选 BESS + Installed + 投运年份不晚于 2024：376.4 MW ÷ 1,000＝0.3764 GW。剔除 174 MW 抽蓄、1.75 MW 压缩空气及 2025 年投运的 15.4 MW。该清单不是严格表前统计。"
      ],
      "sources": [
        {
          "title": "CER · Canada energy storage project tracker",
          "url": "https://www.cer-rec.gc.ca/en/data-analysis/energy-markets/market-snapshots/2025/xlsx/canada-energy-storage-projects.xlsx",
          "locator": "Storage Project Tracker; B=power MW, C=energy MWh, H=status, I=province, M=technology, N=operation year."
        }
      ]
    },
    {
      "id": "ca-model",
      "country": "ca",
      "name": [
        "Canada · EF2026",
        "加拿大 · EF2026"
      ],
      "scope": [
        "National battery model series",
        "全国电池模型序列"
      ],
      "current": {
        "date": "2023",
        "kind": "model",
        "gw": 0.41736
      },
      "outlook": {
        "date": "2030",
        "kind": "scenario",
        "gw": 4.46983
      },
      "comparable": [
        "gw"
      ],
      "caption": [
        "Current Measures scenario; history ends in 2023.",
        "Current Measures 情景；历史数据截至 2023 年。"
      ],
      "note": [
        "The same model Battery Storage / Canada series: 417.36 MW in 2023 and 4,469.83 MW in 2030, divided by 1,000. Electricity values after 2023 are projections. The four 2030 scenarios span 4.46983–4.831192 GW. The model does not specify FTM/BTM or minimum unit size; do not splice it to the project inventory.",
        "同一模型 Battery Storage／Canada 序列：2023 年 417.36 MW、2030 年 4,469.83 MW，各除以 1,000。2023 年后的电力数据均为预测；四种 2030 情景范围 4.46983–4.831192 GW。模型未明确表前／表后或最小规模，不能与项目清单拼接。"
      ],
      "sources": [
        {
          "title": "CER · Energy Future 2026",
          "url": "https://www.cer-rec.gc.ca/open/energy/energyfutures2026/electricity-capacity-2026.csv",
          "locator": "Filter Variable=Battery Storage, Type=Primary Fuel, Region=Canada, Year=2030, Scenario as listed."
        },
        {
          "title": "CER · Historical-data definitions",
          "url": "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/2026/results/"
        }
      ]
    }
  ],
  "review": [
    {
      "id": "it",
      "name": [
        "Italy",
        "意大利"
      ],
      "sources": [
        {
          "title": "Terna · Impianti di Generazione 2024",
          "url": "https://download.terna.it/terna/03_IMPIANTI%20DI%20GENERAZIONE_8ddfc50c3f3e879.pdf",
          "locator": "Table 8, printed p3; definition of gross/net efficient power p4"
        },
        {
          "title": "Terna · Documento di Descrizione degli Scenari 2026",
          "url": "https://download.terna.it/terna/Documento_Descrizione_Scenari_2026_8df2616cc49b332.pdf",
          "locator": "Table 41, PDF p120 / printed p119; section 7.2.2 printed pp43-45"
        }
      ],
      "note": [
        "Standalone stock excludes co-located systems. The 2030 non-distributed storage scenario is 61.1 GWh (40.0 utility + 10.0 MACSE + 11.1 capacity market); it excludes existing pumped hydro but is not verified battery-only, so it is not paired with this battery context.",
        "独立储能不含附属于发电设施的系统。2030 非分布式储能情景为 61.1 GWh（40.0 电网级 + 10.0 MACSE + 11.1 容量市场），虽剔除已有抽蓄，但未确认全部为电池，因此不直接配对。"
      ]
    },
    {
      "id": "de",
      "name": [
        "Germany",
        "德国"
      ],
      "sources": [
        {
          "title": "Bundesnetzagentur · Speicher",
          "url": "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/Speicher/start.html",
          "locator": "Current inventory paragraph; status15 October2025"
        },
        {
          "title": "Umweltbundesamt · Projektionsdaten2026 assumptions, third editionJune2026",
          "url": "https://www.umweltbundesamt.de/system/files/medien/11850/publikationen/2026-06/P26_ZSA_3.Auflage.pdf",
          "locator": "Section3.12.2; Table14, PDF p45 / printed p45; Table15 is a different metric"
        }
      ],
      "note": [
        "Current gross power and usable energy; home batteries excluded. The large-size threshold does not prove all facilities are front of meter. The 2030 scenario separately states 14 GW / 27 GWh; its energy definition is not reconciled with current usable energy, so only power is paired.",
        "现状为毛功率及可用容量，不含户用；规模门槛不能保证全部为表前项目。2030 情景分别给出 14 GW／27 GWh，容量定义未与现状可用容量统一，故只配对功率。"
      ]
    },
    {
      "id": "uk",
      "name": [
        "Great Britain",
        "英国 GB"
      ],
      "sources": [
        {
          "title": "DESNZ · Clean Power2030 Action Plan connections reform annex",
          "url": "https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-connections-reform-annex",
          "locator": "Table1: Batteries, Current installed capacity(2024); updated15 April2025"
        },
        {
          "title": "DESNZ · Clean Power2030 Action Plan connections reform annex",
          "url": "https://www.gov.uk/government/publications/clean-power-2030-action-plan/clean-power-2030-action-plan-a-new-era-of-clean-electricity-connections-reform-annex",
          "locator": "Table1: Batteries, DESNZ2030 Clean Power Capacity Range"
        }
      ],
      "note": [
        "Same source table: current 4.55 GW and policy range 23–27 GW; long-duration storage is separate. The range is a target, not an unconditional forecast.",
        "同一来源表列出现状 4.55 GW、政策区间 23–27 GW；长时储能单列。该区间是目标，不是无条件预测。"
      ]
    },
    {
      "id": "ie",
      "name": [
        "Ireland",
        "爱尔兰"
      ],
      "sources": [
        {
          "title": "SEAI · Energy in Ireland2026 Part3",
          "url": "https://www.seai.ie/sites/default/files/publications/Energy-in-Ireland-2026-Part-3.pdf",
          "locator": "Tables3.9/3.10 printed pp35–36,2025 column"
        },
        {
          "title": "EirGrid · Shaping Our Electricity Future Roadmap v1.1",
          "url": "https://cms.eirgrid.ie/sites/default/files/publications/Shaping-Our-Electricity-Future-Roadmap_Version-1.1_07.23.pdf",
          "locator": "Section6.3.8, Table14 printed p91 / PDF p91; Table15 duration bands"
        }
      ],
      "note": [
        "Current power is maximum export capacity, not DC cell nameplate; grid export ≥0.2 MW, own-use household/business systems excluded. SEAI 2025: 837.1 MW / 1,202.91 MWh. The 2030 battery assumption is 3,225 MW; pumped hydro is separate.",
        "现状功率是最大并网输出能力，不是电芯直流铭牌；并网输出至少 0.2 MW，剔除家庭及企业自用系统。SEAI 2025 年为 837.1 MW／1,202.91 MWh；2030 电池假设为 3,225 MW，抽蓄单列。"
      ]
    },
    {
      "id": "fi",
      "name": [
        "Finland",
        "芬兰"
      ],
      "sources": [
        {
          "title": "Fingrid · Electricity production and consumption outlook Q3 2026",
          "url": "https://www.fingrid.fi/globalassets/dokumentit/fi/kantaverkko/kantaverkon-kehittaminen/best-estimate-q3-2026/fingrid-kehitysnakymat-q3-2026.pdf",
          "locator": "Printed p13, storage development outlook and Figure7"
        },
        {
          "title": "Fingrid · Total installed battery energy storage system capacity(MW), dataset424",
          "url": "https://data.fingrid.fi/en/datasets/424",
          "locator": "Dataset description and displayed example observation; available from11 March2026"
        }
      ],
      "note": [
        "Fingrid’s 2030 scenarios include small batteries; dataset 424 also includes assets expected to start within roughly a month. Neither establishes a strict operational grid-scale pair.",
        "Fingrid 的 2030 情景包含小型电池；数据集 424 又包含预计约一个月内投运项目，因此不作为严格的已投运电网级电池配对。"
      ]
    },
    {
      "id": "pl",
      "name": [
        "Poland",
        "波兰"
      ],
      "sources": [
        {
          "title": "URE · Annual report2025",
          "url": "https://bip.ure.gov.pl/download/3/20723/SprawozdaniezdzialalnosciPrezesaUREw2025r.pdf",
          "locator": "Section2, printed p81 / PDF p83"
        },
        {
          "title": "Polish government · NECP Annex2 WEM scenario",
          "url": "https://www.gov.pl/attachment/7401b009-2a25-49db-8883-1f3226e3f3d4",
          "locator": "Table3.14, printed p72"
        }
      ],
      "note": [
        "URE’s registered-storage total includes pumped hydro; the NECP scenario uses net achievable power. Neither is silently substituted for operating battery nameplate capacity.",
        "URE 储能注册合计包含抽蓄；NECP 情景采用净可达功率，均不替代已投运电池铭牌容量。"
      ]
    },
    {
      "id": "ro",
      "name": [
        "Romania",
        "罗马尼亚"
      ],
      "sources": [
        {
          "title": "Transelectrica · Annual report2024",
          "url": "https://www.transelectrica.ro/documents/10179/19114374/Raport%2BAnual%2B2024%2BTranselectrica_Modificare%2BAGA_RO.pdf/11ba6ab7-90df-4e43-ba57-c347d318c59c",
          "locator": "Integration of battery storage into SEN; PDF p105 / printed p99; explicit1 February2025 date"
        },
        {
          "title": "Transelectrica · National adequacy study2027,2030,2035",
          "url": "https://www.transelectrica.ro/documents/10179/22561337/Raport%2BPublic%2B-%2BStudiu%2Bde%2BAdecvanta%2BSEN%2B2027%2B2030%2B2035.pdf/fb9116f1-0bb6-46fa-9738-96cbca6f4534",
          "locator": "Section3.2.8, printed p60 / PDF p60; explicit quotation of the NECP battery target"
        },
        {
          "title": "Transelectrica · National adequacy study2027,2030,2035",
          "url": "https://www.transelectrica.ro/documents/10179/22561337/Raport%2BPublic%2B-%2BStudiu%2Bde%2BAdecvanta%2BSEN%2B2027%2B2030%2B2035.pdf/fb9116f1-0bb6-46fa-9738-96cbca6f4534",
          "locator": "Tables3.16–3.17, printed p60"
        }
      ],
      "note": [
        "Current is the 1 February 2025 operating-licence inventory, not year-end 2024. The 2030 target explicitly gives 1,200 MW / 2,400 MWh, with pumped hydro separate. Current available energy and future target energy are not assumed identical definitions; only power is paired.",
        "现状为 2025 年 2 月 1 日运营许可清单，不能记作 2024 年末。2030 目标明确为 1,200 MW／2,400 MWh，抽蓄另列。现状可用容量与未来目标容量未假定同义，故只配对功率。"
      ]
    },
    {
      "id": "es",
      "name": [
        "Spain",
        "西班牙"
      ],
      "sources": [
        {
          "title": "Red Electrica · Installed storage capacity2025",
          "url": "https://www.sistemaelectrico-ree.es/es/informe-del-sistema-electrico/almacenamiento/potencia-instalada-de-almacenamiento",
          "locator": "Year-end2025 storage paragraph"
        },
        {
          "title": "Spanish government · Royal Decree997/2025",
          "url": "https://www.boe.es/buscar/act.php?id=BOE-A-2025-22434",
          "locator": "Preamble describing PNIEC2023–2030 storage objective"
        }
      ],
      "note": [
        "End-2025 battery stock is 96 MW. Spain’s 22.5 GW 2030 storage objective spans multiple technologies and is not a battery-only forecast; it is excluded from the paired battery chart.",
        "2025 年末电池为 96 MW；西班牙 2030 年 22.5 GW 储能目标包含多种技术，不是纯电池预测，因此不进入配对图。"
      ]
    },
    {
      "id": "jp",
      "name": [
        "Japan",
        "日本"
      ],
      "note": [
        "Current 50 × 10,000 kW = 0.50 GW is grid-connected, not an audited COD list. Outlook 14.1–23.8 GWh ÷ the published 3h assumption = 4.70–7.933 GW. The outlook models connection conversion (10%/20%, then 70%); it is neither an award nor an updated 2026 forecast.",
        "现状 50 万 kW＝0.50 GW 为已并网，不是经审计的投运清单。展望 14.1–23.8 GWh ÷ 来源明确的 3 小时假设＝4.70–7.933 GW，基于接入转化率 10%／20% 及后续 70% 的情景，既非中标量，也不是 2026 年更新预测。"
      ],
      "sources": [
        {
          "title": "Ministry of Economy Trade and Industry / Agency for Natural Resources and Energy · Distributed energy working group materials: grid battery connection status",
          "url": "https://www.meti.go.jp/shingikai/enecho/denryoku_gas/jisedai_kiban/distributed_energy_wg/pdf/001_03_00.pdf",
          "locator": "PDF page 70"
        },
        {
          "title": "Ministry of Economy Trade and Industry / Agency for Natural Resources and Energy · Basic Policy Subcommittee materials, reference outlook for grid batteries",
          "url": "https://www.enecho.meti.go.jp/committee/council/basic_policy_subcommittee/2024/067/067_010.pdf",
          "locator": "PDF page 77"
        }
      ]
    },
    {
      "id": "au",
      "name": [
        "Australia",
        "澳大利亚"
      ],
      "note": [
        "The same ISP reports approximately 4 GW / 10 GWh in operation in early 2026 and 32.5 GW battery need in 2030 (Table 6). Independent January register: 4,024.61 MW AC / 1,000 = 4.02461 GW, Battery Storage + In Service only, excluding commissioning. The rounded ISP series is used consistently here. Neither series is a national Australian total.",
        "同一版 ISP 报告 2026 年初约 4 GW／10 GWh 已投运及 2030 年电池需求 32.5 GW（表 6）。1 月登记表独立汇总为 4,024.61 MW AC ÷ 1,000＝4.02461 GW，仅计 Battery Storage + In Service，剔除调试。图中统一采用 ISP 取整口径，均不是澳洲全国总量。"
      ],
      "sources": [
        {
          "title": "Australian Energy Market Operator · 2026 Integrated System Plan",
          "url": "https://www.aemo.com.au/-/media/files/major-publications/isp/2026/2026-integrated-system-plan-isp.pdf?rev=f2f142d0a8d740a986f186da17bb8a9d&sc_lang=en",
          "locator": "Printed pages 36 and 79, Table 6"
        },
        {
          "title": "Australian Energy Market Operator · NEM Generation Information January 2026",
          "url": "https://www.aemo.com.au/-/media/files/electricity/nem/planning_and_forecasting/generation_information/2026/nem-generation-information-jan-2026.xlsx?rev=66d8f10c76c24d8688cdb7a2302dd7d2&sc_lang=en"
        },
        {
          "title": "Australian Energy Market Operator · FY26 Annual Report",
          "url": "https://www.aemo.com.au/-/media/files/about_aemo/annual-report/2026/fy26-annual-report.pdf?hash=82B0D323B5CA3EEF686C95EB367FA9F0&rev=3d969bab2886454ea231378a85c84b8b&sc_lang=en",
          "locator": "WA electricity and gas segment discussion, printed page 59; financial performance overview, printed page 42"
        }
      ]
    },
    {
      "id": "sa",
      "name": [
        "Saudi Arabia",
        "沙特阿拉伯"
      ],
      "note": [
        "Official grid-connected energy is 8 GWh; the 2030 battery policy target is 48 GWh. The additional 30 GWh under development is not current stock. No GW conversion without an official duration.",
        "官方已并网容量为 8 GWh，2030 电池政策目标为 48 GWh；另外披露的开发中 30 GWh 不计现状。没有官方时长，不换算为 GW。"
      ],
      "sources": [
        {
          "title": "Saudi Press Agency reporting Ministry of Energy statement · 13th Saudi Smart Grid Conference opening, ministry address",
          "url": "https://www.spa.gov.sa/en/N2466792"
        },
        {
          "title": "Saudi Press Agency reporting Ministry of Energy statement · Minister of Energy Inaugurates Saudi Smart Grid Conference",
          "url": "https://www.spa.gov.sa/en/N2228611"
        }
      ]
    },
    {
      "id": "us",
      "name": [
        "United States",
        "美国"
      ],
      "note": [
        "EIA preliminary inventory reports nearly 52 GW at June 2026: 43.6 GW at end-2025 plus 8.3 GW added in the first half. This observed inventory is not paired with AEO net-summer diurnal storage, whose hybrid allocation differs.",
        "EIA 初步清单报告 2026 年 6 月接近 52 GW：2025 年末 43.6 GW 加上半年新增 8.3 GW。现状清单不与 AEO 净夏季日内储能情景直接配对，后者对混合项目的归类不同。"
      ],
      "sources": [
        {
          "title": "EIA · Battery storage capacity, 7 August 2026",
          "url": "https://www.eia.gov/TodayinEnergy/detail.php?id=67925",
          "locator": "Opening paragraph: June 2026 operational nameplate capacity"
        },
        {
          "title": "EIA · 2024 final generator inventory",
          "url": "https://www.eia.gov/electricity/data/eia860/archive/xls/eia8602024.zip",
          "locator": "3_4_Energy_Storage_Y2024.xlsx, Operable, header row 2. M=nameplate MW; N=summer MW; R=energy MWh; T=maximum discharge MW."
        },
        {
          "title": "EIA · AEO 2026, Table 9",
          "url": "https://www.eia.gov/outlooks/aeo/excel/aeotab9.xlsx",
          "locator": "Sheet cb2026.d021826b; row 20 EGC000:ba_DiurnalStorage; year header row 10."
        },
        {
          "title": "EIA · AEO model definitions",
          "url": "https://www.eia.gov/outlooks/aeo/narrative/"
        }
      ]
    },
    {
      "id": "ca",
      "name": [
        "Canada",
        "加拿大"
      ],
      "note": [
        "Filter BESS + Installed + commercial-operation year ≤2024; sum 376.4 MW / 1,000 = 0.3764 GW. Exclude 174 MW pumped hydro, 1.75 MW compressed air and 15.4 MW commissioned in 2025. Not a strict FTM inventory.",
        "筛选 BESS + Installed + 投运年份不晚于 2024：376.4 MW ÷ 1,000＝0.3764 GW。剔除 174 MW 抽蓄、1.75 MW 压缩空气及 2025 年投运的 15.4 MW。该清单不是严格表前统计。"
      ],
      "sources": [
        {
          "title": "CER · Canada energy storage project tracker",
          "url": "https://www.cer-rec.gc.ca/en/data-analysis/energy-markets/market-snapshots/2025/xlsx/canada-energy-storage-projects.xlsx",
          "locator": "Storage Project Tracker; B=power MW, C=energy MWh, H=status, I=province, M=technology, N=operation year."
        },
        {
          "title": "CER · Energy Future 2026",
          "url": "https://www.cer-rec.gc.ca/open/energy/energyfutures2026/electricity-capacity-2026.csv",
          "locator": "Filter Variable=Battery Storage, Type=Primary Fuel, Region=Canada, Year=2030, Scenario as listed."
        },
        {
          "title": "CER · Historical-data definitions",
          "url": "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/2026/results/"
        }
      ]
    }
  ]
};
