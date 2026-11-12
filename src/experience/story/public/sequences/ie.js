/* IE: Release 4 explanations, restating the existing public research.
   Basis: ie-01 to ie-11; historic services and current candidate economics are not revised.
   Sources belong to this market's public-content pool; no model values are held here.
   Scenario charge levels are schematic states, not dispatch or investment outputs. */
import { contracted } from './contracted.js';

const sequence0 = {
  "id": "ie-response",
  "family": "frequency",
  "title": [
    "Island frequency and changing service terms",
    "岛屿频率与变化的服务条款"
  ],
  "home": [
    "system",
    "storage"
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
      "id": "island",
      "asks": "system",
      "view": "system",
      "state": {
        "flow": "idle",
        "signal": "frequency",
        "soc": 0.6
      },
      "title": [
        "Trade links do not share frequency",
        "交易联络线不共享频率"
      ],
      "text": [
        "Ireland and Northern Ireland operate one island system. Direct-current links to Britain trade power but do not share frequency, so the island must catch a large loss itself.",
        "爱尔兰与北爱尔兰运行同一个岛屿系统。通往英国的直流联络线交易电力却不共享频率，大型电源损失须由岛上系统自行稳住。"
      ],
      "sources": [
        "SRC-IE-01",
        "SRC-IE-03",
        "SRC-IE-19"
      ]
    },
    {
      "id": "response",
      "asks": "response",
      "view": "storage",
      "state": {
        "flow": "discharge",
        "signal": "frequency",
        "headroom": true,
        "soc": 0.6
      },
      "title": [
        "Fast power supports more wind",
        "快速功率支撑更多风电"
      ],
      "text": [
        "Allowing more non-synchronous generation required fast reserve and stability services. A battery can change power quickly but shares its energy with other commitments.",
        "允许更多非同步电源运行，需要快速备用与稳定服务。电池可以迅速改变功率，但其电量也须供其他承诺使用。"
      ],
      "sources": [
        "SRC-IE-03",
        "SRC-IE-04"
      ]
    },
    {
      "id": "terms",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "flow": "idle",
        "qualified": true,
        "awarded": false,
        "headroom": true,
        "soc": 0.6
      },
      "title": [
        "Historic tariffs are not a new award",
        "历史费率不是新的中标协议"
      ],
      "text": [
        "The research distinguishes historic fixed contracts and regulated tariffs from future competitive procurement. A new entrant cannot treat a past service tariff as secured future revenue.",
        "研究区分历史固定合同、监管费率与未来竞争性采购。新进入者不能把过去的服务费率当作未来锁定收入。"
      ],
      "sources": [
        "SRC-IE-05",
        "SRC-IE-07",
        "SRC-IE-08"
      ]
    },
    {
      "id": "transition",
      "asks": "limit",
      "view": "system",
      "state": {
        "flow": "idle",
        "fleet": "crowded",
        "soc": 0.6
      },
      "title": [
        "Check the transition, not just the service",
        "不仅看服务，也要核查过渡安排"
      ],
      "text": [
        "The tariff extension is limited and the new auction’s start remains unconfirmed in the published research. Competitive procurement changes the payment route; technical ability does not fix its price.",
        "已发布研究指出，费率延期有限，新拍卖启动时间仍未确认。竞争性采购改变付款路径；技术能力不能锁定价格。"
      ],
      "sources": [
        "SRC-IE-07",
        "SRC-IE-08",
        "SRC-IE-24"
      ]
    }
  ]
};

const sequence1 = {
  "id": "ie-headroom",
  "family": "shifting",
  "title": [
    "Fast response and the evening share one battery",
    "快速响应与晚高峰共用一座电池"
  ],
  "home": [
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
      "id": "energy",
      "asks": "system",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "flow": "idle",
        "soc": 0.3
      },
      "title": [
        "The evening needs stored energy",
        "晚高峰需要储存电量"
      ],
      "text": [
        "Fast response and sustained evening delivery are different tasks. The evening needs enough stored energy, not merely the ability to change power quickly.",
        "快速响应与傍晚持续交付是不同任务。晚高峰需要足够储存电量，而不只是迅速改变功率的能力。"
      ],
      "sources": [
        "SRC-IE-03",
        "SRC-IE-16"
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
        "Charge before the delivery obligation",
        "在交付义务到来前充电"
      ],
      "text": [
        "The battery needs to be charged and available when prices spike. A capacity obligation does not supply the charging energy for it.",
        "电价飙升时，电池须充满并保持可用。容量义务不会替电池提供充电电量。"
      ],
      "sources": [
        "SRC-IE-16"
      ]
    },
    {
      "id": "reserved",
      "asks": "constraint",
      "view": "storage",
      "state": {
        "flow": "discharge",
        "headroom": true,
        "signal": "frequency",
        "soc": 0.7
      },
      "title": [
        "Do not promise the power twice",
        "不能重复承诺同一功率"
      ],
      "text": [
        "Power held for response and power offered for energy share the same equipment. Compatible commitments must preserve the ability to meet the capacity duty.",
        "响应预留功率与电能报价共用设备。各项承诺必须兼容，保留履行容量义务的能力。"
      ],
      "sources": [
        "SRC-IE-03",
        "SRC-IE-16"
      ]
    },
    {
      "id": "sale",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "flow": "discharge",
        "soc": 0.5,
        "qualified": true,
        "awarded": true,
        "delivers": true
      },
      "title": [
        "Energy is sold separately",
        "电量单独出售"
      ],
      "text": [
        "Wholesale trading earns market revenue; the capacity contract pays for availability and carries its own repayment obligation. New batteries and interconnection can compete for the evening.",
        "批发交易获得市场收入；容量合同为可用性付费，并附带自身返还义务。新增电池与互联线路可能争夺晚高峰。"
      ],
      "sources": [
        "SRC-IE-16",
        "SRC-IE-19",
        "SRC-IE-20"
      ]
    }
  ]
};

const contract0 = contracted({
  "id": "ie-capacity",
  "home": [
    "mechanism"
  ],
  "title": [
    "A reliability option, not free upside",
    "可靠性期权，而非无条件上行收益"
  ],
  "gates": [
    [
      "Capacity qualified",
      "容量资格获批"
    ],
    [
      "Award held",
      "持有中标协议"
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
  "stages": {
    "availability": {
      "name": [
        "Firm power for tight periods",
        "紧张时段的可靠功率"
      ],
      "title": [
        "Firm power for tight periods",
        "紧张时段的可靠功率"
      ],
      "text": [
        "The capacity auction buys firm power before it is needed. A physically available battery still needs qualification and an actual award.",
        "容量拍卖在需要之前采购可靠功率。实际可用的电池仍须取得资格并实际中标。"
      ],
      "sources": [
        "SRC-IE-14",
        "SRC-IE-22"
      ]
    },
    "accreditation": {
      "name": [
        "Credit follows the auction pack",
        "容量信用取决于拍卖文件"
      ],
      "title": [
        "Credit follows the auction pack",
        "容量信用取决于拍卖文件"
      ],
      "text": [
        "The credited share of storage power differs by the applicable auction terms. Nameplate power alone does not establish the payment.",
        "储能功率计入比例取决于适用拍卖条款。仅有铭牌功率不能确定付款。"
      ],
      "sources": [
        "SRC-IE-14",
        "SRC-IE-22"
      ]
    },
    "award": {
      "name": [
        "Keep the award vintage",
        "保留中标批次"
      ],
      "title": [
        "Keep the award vintage",
        "保留中标批次"
      ],
      "text": [
        "An earlier award keeps that auction’s credit. Check what the project actually holds rather than apply an earlier result to an unawarded battery.",
        "早先中标沿用该轮拍卖的容量信用。应核实项目实际持有什么，不能把早期结果套给未中标电池。"
      ],
      "sources": [
        "SRC-IE-12",
        "SRC-IE-21"
      ]
    },
    "obligation": {
      "name": [
        "Be available when prices spike",
        "价格飙升时保持可用"
      ],
      "title": [
        "Be available when prices spike",
        "价格飙升时保持可用"
      ],
      "text": [
        "The winner sells a reliability option. It must be charged and available because prices above the strike create a difference-payment obligation.",
        "中标者出售可靠性期权。由于执行价以上会产生差额返还义务，电池须充满并保持可用。"
      ],
      "sources": [
        "SRC-IE-16"
      ]
    },
    "performance": {
      "name": [
        "Meet the option obligation",
        "履行期权义务"
      ],
      "title": [
        "Meet the option obligation",
        "履行期权义务"
      ],
      "text": [
        "The difference above the strike is repaid on credited power. Selling energy is separate from receiving the capacity payment.",
        "执行价以上的差额须按计入功率返还。出售电量与收取容量付款分别结算。"
      ],
      "sources": [
        "SRC-IE-16"
      ]
    },
    "settlement": {
      "name": [
        "Suppliers fund availability",
        "售电商为可用性出资"
      ],
      "title": [
        "Suppliers fund availability",
        "售电商为可用性出资"
      ],
      "text": [
        "Suppliers fund capacity through the market operator. The asset’s agreement and delivery date matter; a redesign under consultation is not an executed replacement contract.",
        "售电商通过市场运营商为容量出资。资产自身协议与交付日期至关重要；征询意见中的改革不等于已签替代合同。"
      ],
      "sources": [
        "SRC-IE-16",
        "SRC-IE-17"
      ]
    }
  }
});

export const SEQUENCES = [sequence0, sequence1, contract0];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
