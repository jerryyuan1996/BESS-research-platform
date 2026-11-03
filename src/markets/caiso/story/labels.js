/* Storyboard label and historical-node tables; approved 2014/2015 timing correction. */
export const LABELS = {
  "caiso-01": [
    [
      "CAISO area (approximate)",
      "CAISO覆盖范围（近似）"
    ],
    [
      "Retailer",
      "售电主体"
    ],
    [
      "Capacity contract",
      "容量合同"
    ],
    [
      "No central auction",
      "无集中拍卖"
    ]
  ],
  "caiso-02": [
    [
      "Demand",
      "需求"
    ],
    [
      "Wind and solar",
      "风电与光伏"
    ],
    [
      "Net load: demand minus wind and solar",
      "净负荷：需求减去风电和光伏"
    ],
    [
      "Tightest hours",
      "最紧张的时段"
    ]
  ],
  "caiso-04": [
    [
      "Net peak",
      "净负荷峰值"
    ],
    [
      "Rotating outages",
      "轮流停电"
    ],
    [
      "Battery fleet, CAISO balancing area",
      "电池机组（CAISO平衡区）"
    ]
  ],
  "caiso-05": [
    [
      "Net load, median summer weekday",
      "净负荷（夏季工作日中位值）"
    ],
    [
      "Battery output",
      "电池出力"
    ],
    [
      "Charging",
      "充电"
    ],
    [
      "Example: the {qcBasisHours} hours a battery is credited for",
      "示例：电池获得信用的{qcBasisHours}个小时"
    ],
    [
      "MW",
      "MW"
    ],
    [
      "Pacific time",
      "太平洋时间"
    ]
  ],
  "caiso-06": [
    [
      "RA capacity shown",
      "申报的RA容量"
    ],
    [
      "Demand plus reserve",
      "需求加备用"
    ],
    [
      "Margin",
      "裕度"
    ],
    [
      "Benchmark for RA trades, by delivery year",
      "RA交易基准价格（按交付年份）"
    ]
  ],
  "caiso-07": [
    [
      "Worst day of the month",
      "当月最严峻日"
    ],
    [
      "Hours shown",
      "申报时段"
    ],
    [
      "Energy to charge",
      "充电所需电量"
    ],
    [
      "Foldback (Example)",
      "出力回落（示例）"
    ],
    [
      "From 2027",
      "2027年起"
    ],
    [
      "Outage record from 2028",
      "2028年起计入停运记录"
    ]
  ],
  "caiso-08": [
    [
      "Stored energy, in hours at full power",
      "储存电能（满功率小时数）"
    ],
    [
      "Hours RA counts",
      "RA计入的小时数"
    ],
    [
      "Credited power",
      "计入信用的功率"
    ],
    [
      "Full credit",
      "全额信用"
    ],
    [
      "Below full credit",
      "低于全额信用"
    ],
    [
      "Same credit, more hours",
      "信用不变、可覆盖时段更多"
    ],
    [
      "Example: {examplePower} MW battery",
      "示例：{examplePower}MW电池"
    ]
  ],
  "caiso-10": [
    [
      "Paid",
      "计价"
    ],
    [
      "Obligation",
      "义务"
    ],
    [
      "Evidence",
      "证据"
    ]
  ],
  "caiso-11": [
    [
      "Headroom left",
      "剩余余量"
    ],
    [
      "Conflict",
      "冲突"
    ],
    [
      "Project constraints: unknown",
      "项目约束：未知"
    ]
  ],
  "caiso-12": [
    [
      "The return shown is for building it new",
      "所示回报为新建项目情景"
    ],
    [
      "Most the fund can pay for an operating asset",
      "基金收购在运资产的最高价格"
    ]
  ]
};
export const HISTORY_TEXT = [
  {
    "id": "H-CAISO-01",
    "title": [
      "Retailers must hold capacity",
      "售电主体持有容量"
    ],
    "fields": {
      "Constraint": [
        "After the {crisisPeriod} crisis, no rule made retailers hold capacity ahead of time.",
        "{crisisPeriod}年危机之后，并没有规则要求售电主体提前持有容量。"
      ],
      "Choice": [
        "Each retailer must contract its own capacity, with a reserve margin, and most of its summer needs a year ahead.",
        "每一家售电主体都须自行签约落实容量并留有备用裕度，夏季所需的大部分须提前一年落实。"
      ],
      "What remains": [
        "Year-ahead and month-ahead RA showings.",
        "年度和月度RA容量申报。"
      ],
      "Effect today": [
        "A battery's capacity income comes from a contract with a retailer.",
        "电池的容量收入来自与售电主体签订的合同。"
      ]
    }
  },
  {
    "id": "H-CAISO-02",
    "title": [
      "Storage ordered, and counted at four hours",
      "储能采购与四小时规则"
    ],
    "fields": {
      "Constraint": [
        "A grid adding solar needed flexible capacity.",
        "光伏不断增加的电网需要灵活容量。"
      ],
      "Choice": [
        "The CPUC set the large utilities a storage target in 2013. Under its {qcDecisionYear} decision, effective for the {qcEffectiveYear} RA year, a battery is credited at the output it can hold for {qcBasisHours} hours without a break.",
        "CPUC于2013年为几家大型公用事业公司设定储能采购目标。根据其于{qcDecisionYear}年作出、从{qcEffectiveYear}年RA年度起生效的决定，电池按其能够不间断持续{qcBasisHours}小时的出力获得容量信用。"
      ],
      "What remains": [
        "The {qcBasisHours}-hour rule, still in force.",
        "{qcBasisHours}小时规则，至今有效。"
      ],
      "Effect today": [
        "The fleet is built around {qcBasisHours} hours.",
        "整个机组群以{qcBasisHours}小时为中心建设。"
      ]
    }
  },
  {
    "id": "H-CAISO-03",
    "title": [
      "The evening runs short",
      "傍晚短缺"
    ],
    "fields": {
      "Constraint": [
        "Planning targets had not kept pace with the early evening; rotating outages followed on {outageDates} 2020.",
        "规划目标未能跟上傍晚时段的需要；2020年{outageDates}随之实施了轮流停电。"
      ],
      "Choice": [
        "In June 2021 the CPUC ordered new capacity, on contracts of at least {mtrMinTerm} years.",
        "2021年6月，CPUC下令采购新增容量，合同期至少{mtrMinTerm}年。"
      ],
      "What remains": [
        "Long contracts on the plants that order brought.",
        "该命令所带来电站签下的长期合同。"
      ],
      "Effect today": [
        "Operating batteries from that wave can come with long RA contracts.",
        "这一轮建成的在运电池可能附带长期RA合同。"
      ]
    }
  },
  {
    "id": "H-CAISO-04",
    "title": [
      "Slice of day",
      "分时段"
    ],
    "fields": {
      "Constraint": [
        "One peak hour no longer described the risk.",
        "单一峰值小时已不足以描述风险。"
      ],
      "Choice": [
        "Show capacity for every hour of each month's worst day, with spare energy to charge the batteries: adopted in 2022, binding from 2025.",
        "按每月“最严峻日”的每一个小时申报容量，并留足为电池充电的富余电量：2022年通过，2025年起执行。"
      ],
      "What remains": [
        "The {sodHours}-hour showing.",
        "{sodHours}小时申报。"
      ],
      "Effect today": [
        "A battery counts only in the hours it can really cover.",
        "电池只在它真正能覆盖的时段计入。"
      ]
    }
  },
  {
    "id": "H-CAISO-05",
    "title": [
      "Foldback and outage records",
      "出力回落与停运记录"
    ],
    "fields": {
      "Constraint": [
        "Batteries lose power as they near empty, so the old count could include power they cannot hold.",
        "电池接近放空时出力下降，旧的计量方式可能把电池无法维持的那部分功率也计算在内。"
      ],
      "Choice": [
        "From 2027, count only the power a battery holds for {qcBasisHours} hours without that fall; from 2028, judge each unit on its outage record.",
        "自2027年起，只计算电池在不出现这种回落的情况下可持续{qcBasisHours}小时的出力；自2028年起，再按每台机组的停运记录核定。"
      ],
      "What remains": [
        "Adopted rules; their effects from 2027 are drawn dashed.",
        "规则已经通过；其2027年起的影响以虚线表示。"
      ],
      "Effect today": [
        "The MW an operating battery can sell may fall in 2027, by an amount not yet published.",
        "在运电池可出售的MW可能在2027年下降，降幅尚未公布。"
      ]
    }
  },
  {
    "id": "H-CAISO-06",
    "title": [
      "The next step is eight hours",
      "长时储能"
    ],
    "fields": {
      "Constraint": [
        "Four-hour storage already serves much of the evening.",
        "{qcBasisHours}小时储能已承担傍晚的很大一部分需求。"
      ],
      "Choice": [
        "From 2027, storage that can run {ldesThreshold} hours or more at full power may count across the whole day.",
        "自2027年起，能以满功率持续运行{ldesThreshold}小时及以上的储能，可在全天各时段计入。"
      ],
      "What remains": [
        "Adopted, not yet in effect: drawn dashed.",
        "已经通过、尚未生效：以虚线表示。"
      ],
      "Effect today": [
        "Storage meant to cover more of the day must be built long; this play is not.",
        "想覆盖一天中更多时段的储能必须建得更长；本方案并不走这条路。"
      ]
    }
  }
];
