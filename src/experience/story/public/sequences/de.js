/* DE: Release 4 explanations, restating the existing public research.
   Basis: de-01 to de-11; the current capacity-ineligible reference remains ineligible.
   Sources belong to this market's public-content pool; no model values are held here.
   Scenario charge levels are schematic states, not dispatch or investment outputs. */
const sequence0 = {
  "id": "de-shift",
  "family": "shifting",
  "title": [
    "A trading window, not a fixed spread",
    "交易窗口，而非固定价差"
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
      "id": "supply",
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
        "Wind and solar change when power arrives",
        "风光改变电力到达的时段"
      ],
      "text": [
        "Renewable expansion changes the supply pattern. Storage can move energy between periods, but renewable output alone does not establish the trading margin.",
        "可再生能源扩张改变供给形态。储能可以跨时段转移电量，但仅凭风光出力不能确立交易利润。"
      ],
      "sources": [
        "SRC-DE-13",
        "SRC-DE-14"
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
        "soc": 0.4
      },
      "title": [
        "Buy energy in the cheaper period",
        "在较便宜时段买电"
      ],
      "text": [
        "A battery buys energy to sell in another period. The opportunity is the difference between those buying and selling prices, subject to market and connection access.",
        "电池买入电量，以便在另一个时段出售。机会来自买卖价格之差，同时受市场和并网准入约束。"
      ],
      "sources": [
        "SRC-DE-05",
        "SRC-DE-17"
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
        "The market pays the traded price",
        "市场按成交价格付款"
      ],
      "text": [
        "Trading produces a changing market margin, not an agreed annual fee. Weather, demand, fuel and competing flexibility all affect that margin.",
        "交易产生波动的市场利润，而非约定年费。天气、需求、燃料与其他灵活性资源都会影响利润。"
      ],
      "sources": [
        "SRC-DE-12",
        "SRC-DE-14",
        "SRC-DE-17"
      ]
    },
    {
      "id": "limit",
      "asks": "limit",
      "view": "system",
      "state": {
        "delivers": false,
        "flow": "idle",
        "fleet": "crowded",
        "soc": 0.4
      },
      "title": [
        "A sunny day does not determine the return",
        "阳光充足的一天不能决定回报"
      ],
      "text": [
        "The trading window moves. Added energy capacity also costs capital, so a wider possible dispatch window does not by itself justify a longer battery.",
        "交易窗口会变化。增加电量容量还需投入资本，因此更宽的潜在调度窗口本身不能证明应配置更长时长。"
      ],
      "sources": [
        "SRC-DE-05",
        "SRC-DE-12"
      ]
    }
  ]
};

const sequence1 = {
  "id": "de-network",
  "family": "network",
  "title": [
    "Congestion is a boundary, not a premium",
    "拥塞是约束，不是溢价"
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
      "id": "bottleneck",
      "asks": "constraint",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "network": "constrained",
        "flow": "idle",
        "soc": 0.5
      },
      "title": [
        "The network cannot carry every desired flow",
        "电网不能承载全部期望潮流"
      ],
      "text": [
        "When generation and demand lie on different sides of a bottleneck, operators need redispatch. A national trading price does not remove that physical constraint.",
        "发电与负荷位于瓶颈两侧时，运营商需要再调度。全国交易电价不会消除这一物理约束。"
      ],
      "sources": [
        "SRC-DE-01",
        "SRC-DE-02"
      ]
    },
    {
      "id": "connection",
      "asks": "response",
      "view": "storage",
      "state": {
        "delivers": false,
        "network": "constrained",
        "flow": "idle",
        "breaker": "open",
        "soc": 0.5
      },
      "title": [
        "A battery still needs its own connection",
        "电池仍需自身并网条件"
      ],
      "text": [
        "For the published merchant route, congestion is a connection and cost issue. The plant cannot charge or discharge through an unavailable connection.",
        "对已发布的市场化路径而言，拥塞体现为并网与成本问题。连接不可用时，电站不能经其充放电。"
      ],
      "sources": [
        "SRC-DE-01",
        "SRC-DE-03"
      ]
    },
    {
      "id": "compensation",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "delivers": false,
        "network": "constrained",
        "flow": "idle",
        "qualified": false,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "Redispatch compensation is not a trading bonus",
        "再调度补偿不是交易奖金"
      ],
      "text": [
        "Redispatch compensation restores the affected asset’s economic position. It is not a generic congestion premium paid to every merchant battery.",
        "再调度补偿用于恢复受影响资产的经济状况，并非向所有市场化电池支付的通用拥塞溢价。"
      ],
      "sources": [
        "SRC-DE-03"
      ]
    },
    {
      "id": "regulated",
      "asks": "value",
      "view": "system",
      "state": {
        "delivers": false,
        "network": "constrained",
        "flow": "idle",
        "soc": 0.5
      },
      "title": [
        "A grid booster has a different role",
        "电网增强型储能承担不同角色"
      ],
      "text": [
        "Grid boosters recover approved costs as regulated network assets. Their regulated cost recovery cannot be added to an ordinary merchant battery’s trading margin.",
        "电网增强型储能作为受监管电网资产回收获批成本。其受监管成本回收不能叠加到普通市场化电池的交易利润上。"
      ],
      "sources": [
        "SRC-DE-03",
        "SRC-DE-04"
      ]
    },
    {
      "id": "cost",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "delivers": false,
        "network": "constrained",
        "flow": "idle",
        "qualified": false,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "Price the actual network terms",
        "明确实际电网条款"
      ],
      "text": [
        "The published research describes the connection-capacity charge as a draft. The final rate and transition treatment must be checked before pricing the project.",
        "已发布研究将按并网容量收费列为草案。项目定价前，须核查最终费率及过渡安排。"
      ],
      "sources": [
        "SRC-DE-09",
        "SRC-DE-10"
      ]
    }
  ]
};

const sequence2 = {
  "id": "de-capacity-eligibility",
  "family": "network",
  "title": [
    "A capacity law is not a capacity award",
    "容量法律不等于容量中标"
  ],
  "home": [
    "mechanism"
  ],
  "gates": [
    [
      "Product qualified",
      "品种资格获批"
    ],
    [
      "Bid accepted",
      "报价获接受"
    ],
    [
      "Obligation met",
      "义务已履行"
    ]
  ],
  "base": {
    "network": "open",
    "time": "dusk",
    "solar": "off"
  },
  "steps": [
    {
      "id": "plant",
      "asks": "response",
      "view": "storage",
      "state": {
        "flow": "idle",
        "soc": 0.8,
        "qualified": false,
        "awarded": false
      },
      "title": [
        "A battery can work and still be ineligible",
        "电池可运行，仍可能不合资格"
      ],
      "text": [
        "A physically available battery must separately satisfy the requirements of the procurement it seeks to enter.",
        "实际可用的电池仍须单独满足拟参与采购的资格要求。"
      ],
      "sources": [
        "SRC-DE-06"
      ]
    },
    {
      "id": "test",
      "asks": "constraint",
      "view": "storage",
      "state": {
        "flow": "idle",
        "soc": 0.8,
        "qualified": false,
        "awarded": false
      },
      "title": [
        "Long-duration requirements are specific",
        "长时要求具有具体条件"
      ],
      "text": [
        "Current long-duration procurement excludes the standalone design in the published reference case. More general storage capability does not waive that delivery test.",
        "当前长时采购不接受已发布参考方案中的独立储能设计。一般储能能力不能豁免该交付测试。"
      ],
      "sources": [
        "SRC-DE-06"
      ]
    },
    {
      "id": "award",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "flow": "idle",
        "soc": 0.8,
        "qualified": false,
        "awarded": false
      },
      "title": [
        "A law does not pay an unawarded project",
        "法律不向未中标项目付款"
      ],
      "text": [
        "Remuneration requires an eligible, obligated provider. An auction announcement or future procurement round is not secured cash for the current asset.",
        "付款需要合资格且承担义务的供应方。拍卖公告或未来采购轮次不是当前资产的锁定现金收入。"
      ],
      "sources": [
        "SRC-DE-06",
        "SRC-DE-07"
      ]
    },
    {
      "id": "route",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "flow": "idle",
        "soc": 0.8,
        "qualified": false,
        "awarded": false
      },
      "title": [
        "Keep the routes separate",
        "保持路径区分"
      ],
      "text": [
        "A later eligible award could change the route. Until then, trading and any separately executed private toll must be assessed on their own terms.",
        "今后取得合资格中标可能改变路径。在此之前，交易及另行签署的私人租赁必须按各自条款评估。"
      ],
      "sources": [
        "SRC-DE-06",
        "SRC-DE-08"
      ]
    }
  ]
};

export const SEQUENCES = [sequence0, sequence1, sequence2];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
