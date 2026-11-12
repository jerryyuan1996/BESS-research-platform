/* RO: Release 4 explanations, restating the existing public research.
   Basis: ro-01 to ro-07 and ro-09 to ro-12; no foreign-calibrated reserve curve is presented as local evidence.
   Sources belong to this market's public-content pool; no model values are held here.
   Scenario charge levels are schematic states, not dispatch or investment outputs. */
const sequence0 = {
  "id": "ro-shift",
  "family": "shifting",
  "title": [
    "Solar surplus to evening trading",
    "光伏富余到傍晚交易"
  ],
  "home": [
    "system",
    "storage"
  ],
  "gates": [
    [
      "Registered",
      "已注册"
    ],
    [
      "Trade accepted",
      "交易获接受"
    ],
    [
      "Energy delivered",
      "电量已交付"
    ]
  ],
  "base": {
    "network": "open",
    "time": "dusk",
    "solar": "off"
  },
  "steps": [
    {
      "id": "surplus",
      "asks": "system",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "flow": "idle",
        "soc": 0.2
      },
      "title": [
        "Solar changes the cheap hours",
        "光伏改变低价时段"
      ],
      "text": [
        "Rapid solar construction brings more midday supply. After sunset, hydro, gas and imports meet demand without that solar output.",
        "光伏快速建设带来更多午间供给。日落后，水电、燃气与进口电力在没有光伏出力的情况下满足需求。"
      ],
      "sources": [
        "SRC-RO-01"
      ]
    },
    {
      "id": "charge",
      "asks": "response",
      "view": "storage",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "flow": "charge",
        "soc": 0.5
      },
      "title": [
        "Buy during the cheaper period",
        "在较便宜的时段买入"
      ],
      "text": [
        "The battery buys midday energy to sell in the evening. The day-ahead auction brings buyers and sellers together; it does not guarantee a profitable spread.",
        "电池买入午间电量，在傍晚出售。日前拍卖撮合买卖双方，但不保证盈利价差。"
      ],
      "sources": [
        "SRC-RO-01",
        "SRC-RO-08"
      ]
    },
    {
      "id": "sell",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "flow": "discharge",
        "soc": 0.7,
        "qualified": true,
        "awarded": true,
        "delivers": true
      },
      "title": [
        "Energy buyers pay the sale",
        "电量买方为售电付款"
      ],
      "text": [
        "The buyer pays for traded energy. This is market revenue, separate from a construction grant or an independently negotiated optimiser floor.",
        "买方为成交电量付款。这是市场收入，与建设补贴或另行协商的优化商保底不同。"
      ],
      "sources": [
        "SRC-RO-08",
        "SRC-RO-03",
        "SRC-RO-07"
      ]
    },
    {
      "id": "competition",
      "asks": "limit",
      "view": "system",
      "state": {
        "flow": "discharge",
        "fleet": "crowded",
        "soc": 0.5
      },
      "title": [
        "More batteries trade the same hours",
        "更多电池交易同一时段"
      ],
      "text": [
        "As more batteries buy the cheaper hours and sell the dearer ones, they can narrow the gap. The published fleet outlook is not a guaranteed revenue path.",
        "更多电池在低价时段买入、高价时段卖出，可能压缩价差。已发布的储能规模展望不是保证的收入路径。"
      ],
      "sources": [
        "SRC-RO-01"
      ]
    }
  ]
};

const sequence1 = {
  "id": "ro-border",
  "family": "network",
  "title": [
    "A coupled price has a border limit",
    "耦合价格受边境限额约束"
  ],
  "home": [
    "system"
  ],
  "gates": [
    [
      "Registered",
      "已注册"
    ],
    [
      "Trade accepted",
      "交易获接受"
    ],
    [
      "Energy delivered",
      "电量已交付"
    ]
  ],
  "base": {
    "network": "open",
    "time": "dusk",
    "solar": "off"
  },
  "steps": [
    {
      "id": "coupling",
      "asks": "system",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "flow": "idle",
        "network": "open",
        "soc": 0.4
      },
      "title": [
        "The price zone trades with its neighbours",
        "价区与邻国交易"
      ],
      "text": [
        "Romania participates in European day-ahead coupling. Cross-border trading can transmit changes in neighbouring supply and demand.",
        "罗马尼亚参与欧洲日前市场耦合。跨境交易可以传递邻国供需变化。"
      ],
      "sources": [
        "SRC-RO-09",
        "SRC-RO-10",
        "SRC-RO-11"
      ]
    },
    {
      "id": "limit",
      "asks": "constraint",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "flow": "idle",
        "network": "constrained",
        "soc": 0.4
      },
      "title": [
        "A full link limits that transmission",
        "联络线满载限制传递"
      ],
      "text": [
        "When the interconnector is constrained, additional cheap power cannot move freely across it. Coupling does not remove the transfer limit.",
        "联络线受约束时，更多低价电力不能自由通过。市场耦合不会消除输电限额。"
      ],
      "sources": [
        "SRC-RO-10",
        "SRC-RO-11"
      ]
    },
    {
      "id": "local",
      "asks": "response",
      "view": "storage",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "flow": "charge",
        "network": "constrained",
        "soc": 0.6
      },
      "title": [
        "The battery acts through its own connection",
        "电池经自身并网点动作"
      ],
      "text": [
        "Storage trades the price available in its market, using its permitted connection. Neighbouring storage can affect that market through trade, but not without a network boundary.",
        "储能通过获准的并网条件，交易自身市场价格。邻国储能可以通过交易产生影响，但仍受电网边界限制。"
      ],
      "sources": [
        "SRC-RO-10",
        "SRC-RO-11",
        "SRC-RO-13a"
      ]
    },
    {
      "id": "evidence",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "delivers": false,
        "flow": "idle",
        "network": "constrained",
        "soc": 0.6,
        "qualified": true,
        "awarded": false
      },
      "title": [
        "The size of the effect still needs evidence",
        "影响大小仍须证据"
      ],
      "text": [
        "The published research has not established how often the border binds or how large its price effect is. A schematic constraint is not a measured trading opportunity.",
        "已发布研究尚未确定边境受约束的频率或价格影响大小。示意约束不等于测量出的交易机会。"
      ],
      "sources": [
        "SRC-RO-10",
        "SRC-RO-11",
        "SRC-RO-15"
      ]
    }
  ]
};

const sequence2 = {
  "id": "ro-access",
  "family": "network",
  "title": [
    "Access and a grant are not operating revenue",
    "接入与补贴不是运营收入"
  ],
  "home": [
    "mechanism"
  ],
  "gates": [
    [
      "Registered",
      "已注册"
    ],
    [
      "Trade accepted",
      "交易获接受"
    ],
    [
      "Energy delivered",
      "电量已交付"
    ]
  ],
  "base": {
    "network": "open",
    "time": "dusk",
    "solar": "off"
  },
  "steps": [
    {
      "id": "auction",
      "asks": "constraint",
      "view": "system",
      "state": {
        "delivers": false,
        "flow": "idle",
        "breaker": "open",
        "qualified": false,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "Connection capacity has its own allocation",
        "并网容量有独立分配程序"
      ],
      "text": [
        "The published connection rules allocate qualifying large connections through an auction with guarantees. A connection request is not permission to operate.",
        "已发布的并网规则对符合门槛的大型接入通过拍卖分配，并要求保函。提交并网申请不等于获准运行。"
      ],
      "sources": [
        "SRC-RO-13a",
        "SRC-RO-13b"
      ]
    },
    {
      "id": "physical",
      "asks": "response",
      "view": "storage",
      "state": {
        "delivers": false,
        "flow": "charge",
        "breaker": "closed",
        "qualified": true,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "Access opens the physical route",
        "接入打通物理通道"
      ],
      "text": [
        "Removing double network charging on stored and reinjected energy changes costs. It does not create a payment for the battery’s service.",
        "取消对储存后回送电量重复收取电网费，改变的是成本，不会为电池服务创造付款。"
      ],
      "sources": [
        "SRC-RO-12"
      ]
    },
    {
      "id": "grant",
      "asks": "value",
      "view": "storage",
      "state": {
        "delivers": false,
        "flow": "idle",
        "qualified": true,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "A construction grant pays eligible build costs",
        "建设补贴支付合格建设成本"
      ],
      "text": [
        "The storage aid scheme supports construction, not recurring operating revenue. The call timetable and outcome remain unverified in the published research.",
        "储能资助计划支持建设，而非持续运营收入。已发布研究仍未核实申报时间表及结果。"
      ],
      "sources": [
        "SRC-RO-03",
        "SRC-RO-04",
        "SRC-RO-07"
      ]
    },
    {
      "id": "payment",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "delivers": false,
        "flow": "idle",
        "qualified": true,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "An operating payment needs its own basis",
        "运营付款需要自身依据"
      ],
      "text": [
        "An energy trade needs an accepted transaction and delivery. Neither a connection award nor construction aid establishes a private optimiser floor or reserve earnings.",
        "电能交易需要成交与交付。并网中标或建设资助都不能确立私人优化商保底或备用收入。"
      ],
      "sources": [
        "SRC-RO-08",
        "SRC-RO-13a",
        "SRC-RO-07"
      ]
    }
  ]
};

export const SEQUENCES = [sequence0, sequence1, sequence2];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
