/* ERCOT: energy shifting, reserve headroom and conditional scarcity.
   Evidence: existing story shots ercot-05–08/10 and public payment text.
   No operator capacity series, executed toll or capacity payment is implied.
   Content only. Every step restates the existing public research, with its
   original source pool. No investment model or approval record is changed.
   Scenario energy levels are schematic, never a simulated dispatch. */

const shift = {
  "id": "ercot-shift",
  "home": [
    "system"
  ],
  "family": "shifting",
  "title": [
    "Solar, ramps and the nodal price",
    "光伏、爬坡与节点电价"
  ],
  "gates": [
    [
      "Registered",
      "已注册"
    ],
    [
      "Dispatched",
      "已调度"
    ],
    [
      "Delivered",
      "已交付"
    ]
  ],
  "base": {
    "network": "open"
  },
  "steps": [
    {
      "id": "solar",
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
        "Solar changes the trading day",
        "光伏改变交易日"
      ],
      "text": [
        "Solar output is concentrated in the middle of the day. Batteries can move energy from those hours into the evening ramp.",
        "光伏出力集中在午间。电池可以将这些时段的电能转移至傍晚爬坡时段。"
      ],
      "sources": [
        "SRC-ERCOT-01"
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
        "soc": 0.6
      },
      "title": [
        "Charging buys energy for later",
        "充电是为之后买入电量"
      ],
      "text": [
        "A battery charges before it can sell stored energy. Its charge and discharge decisions use the same power and energy capability that reserve offers would need.",
        "电池先充电，才能出售储存的电量。充放电决策占用的功率与电量，也正是备用报价所需的能力。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "ramp",
      "asks": "value",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.5
      },
      "title": [
        "Discharge into the ramp",
        "在爬坡时段放电"
      ],
      "text": [
        "As solar fades, the battery can discharge into the evening ramp. The price spread is a market outcome, not a promised margin.",
        "光伏回落时，电池可向傍晚爬坡时段放电。价差是市场结果，而非承诺的利润。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "settled",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.4
      },
      "title": [
        "Energy settles at the node",
        "电能量按节点结算"
      ],
      "text": [
        "ERCOT settles delivered energy at the nodal price. This is payment for energy, not a capacity fee for owning the battery.",
        "ERCOT按节点电价结算交付的电能量。这是电能量付款，而不是因拥有电池而获得的容量费。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "competition",
      "asks": "limit",
      "view": "system",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.4,
        "fleet": "crowded"
      },
      "title": [
        "Other batteries pursue the same hours",
        "其他电池也在争取相同时段"
      ],
      "text": [
        "Each additional battery competes for the same trading spreads and reserves. Growth in the fleet does not guarantee growth in revenue per battery.",
        "每一台新增电池都在争夺相同的交易价差与备用。电池规模增长，并不保证每台电池收入增长。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    }
  ]
};

const reserves = {
  "id": "ercot-reserves",
  "home": [
    "storage"
  ],
  "family": "frequency",
  "title": [
    "Reserve is power with energy behind it",
    "备用是有电量支撑的功率"
  ],
  "gates": [
    [
      "Qualified",
      "已具资格"
    ],
    [
      "Reserve awarded",
      "已获备用中标"
    ],
    [
      "Ready and responsive",
      "待命并响应"
    ]
  ],
  "base": {
    "network": "open"
  },
  "steps": [
    {
      "id": "need",
      "asks": "system",
      "view": "system",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "signal": "frequency",
        "soc": 0.7
      },
      "title": [
        "The system also buys readiness",
        "系统也采购待命能力"
      ],
      "text": [
        "Energy and ancillary services buy different actions. ERCOT buys reserves so resources can respond when the system needs them.",
        "电能量与辅助服务采购不同动作。ERCOT采购备用，使资源能在系统需要时响应。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "hold",
      "asks": "response",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "headroom": true,
        "soc": 0.7
      },
      "title": [
        "Keep energy behind the offer",
        "为报价预留电量"
      ],
      "text": [
        "Upward reserve products require energy behind the offer. A battery cannot sell the same power as energy and hold it fully in reserve at the same time.",
        "上调备用产品要求为报价保留电量。电池不能一边将同一份功率作为电能量出售，一边又将其全部作为备用待命。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "award",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "headroom": true,
        "soc": 0.7,
        "awarded": false
      },
      "title": [
        "Ability alone is not a reserve award",
        "仅有能力不等于备用中标"
      ],
      "text": [
        "The reserve must be awarded before there is a settlement route for it. The battery then keeps the required capability ready and responds when deployed.",
        "备用须先中标，才有对应的结算路径。之后电池须保持所要求的能力待命，并在被调用时响应。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "response",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "headroom": true,
        "signal": "frequency",
        "soc": 0.5
      },
      "title": [
        "Load-serving entities bear the reserve cost",
        "售电主体承担备用成本"
      ],
      "text": [
        "ERCOT purchases reserves and load-serving entities bear their cost. Payment is for the awarded reserve obligation, not the energy price multiplied by reserved power.",
        "ERCOT采购备用，由售电主体承担成本。付费对应已中标的备用义务，而不是把电能量价格乘以备用功率。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "crowding",
      "asks": "limit",
      "view": "system",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "headroom": true,
        "soc": 0.5,
        "fleet": "crowded"
      },
      "title": [
        "A fast service can fill quickly",
        "快速服务也会迅速饱和"
      ],
      "text": [
        "The market monitor reports reserve prices falling as batteries entered. A published reserve price is not the revenue an individual battery captured.",
        "市场监测机构报告，随着电池进入，备用价格下跌。公布的备用价格不等于某台电池实际取得的收入。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    }
  ]
};

const scarcity = {
  "id": "ercot-scarcity",
  "home": [
    "mechanism"
  ],
  "family": "shifting",
  "title": [
    "Scarcity is not a capacity contract",
    "稀缺不等于容量合同"
  ],
  "gates": [
    [
      "Registered",
      "已注册"
    ],
    [
      "Dispatched",
      "已调度"
    ],
    [
      "Delivered",
      "已交付"
    ]
  ],
  "base": {
    "network": "open"
  },
  "steps": [
    {
      "id": "ample",
      "asks": "system",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "flow": "idle",
        "soc": 0.8
      },
      "title": [
        "Ample reserves limit scarcity pricing",
        "充裕备用限制稀缺定价"
      ],
      "text": [
        "More solar and batteries can leave reserves ample. The existing market research records much less scarcity pricing in a year with abundant reserves.",
        "更多光伏与电池可能使备用充裕。现有市场研究记录，在备用充裕的年份，稀缺定价明显减少。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "tight",
      "asks": "constraint",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "soc": 0.8
      },
      "title": [
        "A tight period is a different scenario",
        "偏紧时段是另一种情景"
      ],
      "text": [
        "Example: a tight period can produce higher scarcity prices. Its arrival and duration are uncertain; the picture is not a forecast of a future shortage.",
        "示例：偏紧时段可能产生更高的稀缺电价。其发生时间与持续时长不确定；图示不是对未来短缺的预测。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "deliver",
      "asks": "response",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.4,
        "signal": "dispatch"
      },
      "title": [
        "The battery needs energy when scarcity arrives",
        "稀缺到来时电池须有电可用"
      ],
      "text": [
        "The battery can sell delivered energy and awarded reserves, within its usable energy and power limits. A high market price alone does not prove that a particular asset captured it.",
        "电池可在可用电量与功率限制内，出售已交付电能量及已中标备用。仅有高市场价格，并不能证明某项资产实际取得了该价格。"
      ],
      "sources": [
        "SRC-ERCOT-01"
      ]
    },
    {
      "id": "no-capacity",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "delivers": false,
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "soc": 0.4,
        "awarded": false
      },
      "title": [
        "No separate capacity payment",
        "没有独立容量付款"
      ],
      "text": [
        "Without energy dispatch or a reserve award, merely standing ready earns no separate capacity payment in ERCOT. Scarcity revenue varies with system conditions and competition; it is not a fixed revenue commitment.",
        "没有电能量调度或备用中标，仅仅待命不会在ERCOT获得独立容量付款。稀缺收入随系统条件和竞争变化，并非固定收入承诺。"
      ],
      "sources": [
        "SRC-ERCOT-01",
        "SRC-ERCOT-08"
      ]
    }
  ]
};

export const SEQUENCES = [shift, reserves, scarcity];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
