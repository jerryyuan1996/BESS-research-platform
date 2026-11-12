/* IT: Release 4 explanations, restating the existing public research.
   Basis: it-01 to it-11; contract vintages and the existing investment call stay unchanged.
   Sources belong to this market's public-content pool; no model values are held here.
   Scenario charge levels are schematic states, not dispatch or investment outputs. */
import { contracted } from './contracted.js';

const sequence0 = {
  "id": "it-zones",
  "family": "network",
  "title": [
    "Southern supply, northern demand",
    "南部供给，北部负荷"
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
        "network": "open",
        "flow": "idle",
        "soc": 0.2
      },
      "title": [
        "Supply and demand sit in different places",
        "供给与需求分布不同"
      ],
      "text": [
        "Much new renewable generation and many battery connection requests are in the south and on the islands, while much demand is in the north.",
        "大量新增风光电源与储能并网申请位于南部和岛屿，大量负荷则在北部。"
      ],
      "sources": [
        "SRC-IT-21"
      ]
    },
    {
      "id": "corridor",
      "asks": "constraint",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "network": "constrained",
        "flow": "idle",
        "soc": 0.2
      },
      "title": [
        "A full corridor separates zone prices",
        "通道满载使区域价格分离"
      ],
      "text": [
        "Southern midday output can exceed what the corridors north can carry. The day-ahead market clears zonal prices within the transfer limits.",
        "南部午间出力可能超过北送通道的输送能力。日前市场在输电限额内按区域出清价格。"
      ],
      "sources": [
        "SRC-IT-06",
        "SRC-IT-21"
      ]
    },
    {
      "id": "store",
      "asks": "response",
      "view": "storage",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "network": "constrained",
        "flow": "charge",
        "soc": 0.5
      },
      "title": [
        "Store energy where the connection permits",
        "在连接允许的范围内储能"
      ],
      "text": [
        "Storage moves energy between periods, but the battery’s location decides which zone price it trades. Planned links are not operating transfer capacity.",
        "储能跨时段转移电量，但电池位置决定其交易哪个区域的价格。规划中的联络线并非已投运输电能力。"
      ],
      "sources": [
        "SRC-IT-06",
        "SRC-IT-21",
        "SRC-IT-22"
      ]
    },
    {
      "id": "value",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "flow": "discharge",
        "network": "constrained",
        "soc": 0.7,
        "qualified": true,
        "awarded": true,
        "delivers": true
      },
      "title": [
        "The zone must support the trading margin",
        "所在区域须支撑交易利润"
      ],
      "text": [
        "Zone prices and competing batteries affect the merchant remainder. A capacity award does not lock the price of all energy traded by the asset.",
        "区域价格与电池竞争影响剩余市场化收入。容量中标不会锁定资产全部交易电量的价格。"
      ],
      "sources": [
        "SRC-IT-06",
        "SRC-IT-07",
        "SRC-IT-21"
      ]
    }
  ]
};

const contract0 = contracted({
  "id": "it-capacity",
  "home": [
    "mechanism"
  ],
  "title": [
    "Capacity credit and a reliability obligation",
    "容量信用与可靠性义务"
  ],
  "gates": [
    [
      "Capacity accredited",
      "容量获认可"
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
        "Plant available",
        "电站可用"
      ],
      "title": [
        "Plant available",
        "电站可用"
      ],
      "text": [
        "Terna procures capacity ahead of the delivery period to be available when the system is tight. Being built does not itself win the award.",
        "Terna提前采购交付期内系统紧张时须可用的容量。建成电站本身不等于中标。"
      ],
      "sources": [
        "SRC-IT-12"
      ]
    },
    "accreditation": {
      "name": [
        "Power that counts",
        "获计入的功率"
      ],
      "title": [
        "Power that counts",
        "获计入的功率"
      ],
      "text": [
        "Only credited power earns the capacity premium. Storage credit depends on the applicable auction vintage and, for the new-storage rules described in the research, the zone.",
        "只有计入功率获得容量溢价。储能计入比例取决于适用拍卖批次；研究所述新增储能规则还按区域区分。"
      ],
      "sources": [
        "SRC-IT-07",
        "SRC-IT-08"
      ]
    },
    "award": {
      "name": [
        "The actual contract",
        "实际合同"
      ],
      "title": [
        "The actual contract",
        "实际合同"
      ],
      "text": [
        "Check the asset’s awarded price, factor and delivery obligations. An old auction illustration is not the current terms available to a new entrant.",
        "须核查资产实际中标价格、系数与交付义务。旧拍卖示例不是新进入者当前可获得的条款。"
      ],
      "sources": [
        "SRC-IT-10",
        "SRC-IT-11"
      ]
    },
    "obligation": {
      "name": [
        "Available when needed",
        "需要时保持可用"
      ],
      "title": [
        "Available when needed",
        "需要时保持可用"
      ],
      "text": [
        "The contract buys availability in tight moments. It does not transfer the time-shifting right in the same way as MACSE.",
        "合同采购紧张时段的可用性，并不像MACSE那样转移相应时移交易权。"
      ],
      "sources": [
        "SRC-IT-07",
        "SRC-IT-15"
      ]
    },
    "performance": {
      "name": [
        "Perform and repay above the strike",
        "履约，并返还执行价以上差额"
      ],
      "title": [
        "Perform and repay above the strike",
        "履约，并返还执行价以上差额"
      ],
      "text": [
        "The winner must meet its obligation and pays back the difference when market prices exceed the strike. The trading margin retains risk.",
        "中标者须履行义务，并在市场价格高于执行价时返还差额。交易利润仍承担风险。"
      ],
      "sources": [
        "SRC-IT-07",
        "SRC-IT-12"
      ]
    },
    "settlement": {
      "name": [
        "A premium for credited power",
        "为计入功率支付溢价"
      ],
      "title": [
        "A premium for credited power",
        "为计入功率支付溢价"
      ],
      "text": [
        "Terna pays the premium for credited power under the contract. When it expires, the capacity line must be won again rather than assumed to continue.",
        "Terna按合同为计入功率支付溢价。合同到期后，容量收入须重新竞得，不能假定自动延续。"
      ],
      "sources": [
        "SRC-IT-07",
        "SRC-IT-12"
      ]
    }
  }
});

const contract1 = contracted({
  "id": "it-macse",
  "home": [
    "mechanism"
  ],
  "title": [
    "MACSE buys the time-shifting right",
    "MACSE购买时移使用权"
  ],
  "gates": [
    [
      "Eligible storage",
      "合资格储能"
    ],
    [
      "MACSE award",
      "MACSE中标"
    ],
    [
      "Contract performed",
      "合同已履行"
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
        "Energy that can be stored",
        "可储存的电量"
      ],
      "title": [
        "Energy that can be stored",
        "可储存的电量"
      ],
      "text": [
        "MACSE procures storage energy rather than the capacity market’s credited power. The unit purchased is different.",
        "MACSE采购储存电量，而不是容量市场的计入功率。所购买的单位不同。"
      ],
      "sources": [
        "SRC-IT-13",
        "SRC-IT-14"
      ]
    },
    "accreditation": {
      "name": [
        "Meet the auction’s terms",
        "满足拍卖条款"
      ],
      "title": [
        "Meet the auction’s terms",
        "满足拍卖条款"
      ],
      "text": [
        "The storage project must meet the rules of its own MACSE auction. A different area or delivery vintage is not interchangeable evidence.",
        "储能项目须满足其参加的MACSE拍卖规则。不同区域或交付批次的证据不能混用。"
      ],
      "sources": [
        "SRC-IT-15",
        "SRC-IT-20"
      ]
    },
    "award": {
      "name": [
        "Win the storage contract",
        "赢得储能合同"
      ],
      "title": [
        "Win the storage contract",
        "赢得储能合同"
      ],
      "text": [
        "An awarded MACSE contract establishes a fixed premium for its contracted storage energy. An application alone establishes no such payment.",
        "获授的MACSE合同为签约储存电量确立固定溢价。仅提交申请不能确立这笔付款。"
      ],
      "sources": [
        "SRC-IT-15",
        "SRC-IT-16"
      ]
    },
    "obligation": {
      "name": [
        "Transfer the time-shifting use",
        "转移时移使用权"
      ],
      "title": [
        "Transfer the time-shifting use",
        "转移时移使用权"
      ],
      "text": [
        "The time-shifting use of the contracted energy passes to Terna, which offers it to the market. The owner cannot sell the same right again as unrestricted merchant upside.",
        "签约电量的时移使用权交给Terna，由其向市场提供。业主不能把同一权利再次作为不受约束的市场化收益出售。"
      ],
      "sources": [
        "SRC-IT-14",
        "SRC-IT-15"
      ]
    },
    "performance": {
      "name": [
        "Deliver the contracted service",
        "交付合同服务"
      ],
      "title": [
        "Deliver the contracted service",
        "交付合同服务"
      ],
      "text": [
        "The plant must deliver under the agreement. Authorisation or construction delays that miss the delivery period put that contract at risk.",
        "电站须按协议交付。许可或建设延误若错过交付期，将危及合同。"
      ],
      "sources": [
        "SRC-IT-15",
        "SRC-IT-20"
      ]
    },
    "settlement": {
      "name": [
        "Different payment, different rights",
        "不同付款，不同权利"
      ],
      "title": [
        "Different payment, different rights",
        "不同付款，不同权利"
      ],
      "text": [
        "Terna pays for contracted storage energy, not the capacity market’s credited power. Keep units, control rights and auction vintage together when comparing the routes.",
        "Terna为签约储存电量付费，而非容量市场的计入功率。比较路径时，须同时核对单位、控制权与拍卖批次。"
      ],
      "sources": [
        "SRC-IT-14",
        "SRC-IT-15",
        "SRC-IT-20"
      ]
    }
  }
});

export const SEQUENCES = [sequence0, contract0, contract1];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
