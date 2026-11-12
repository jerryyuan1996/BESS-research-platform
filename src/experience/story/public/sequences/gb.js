/* GB: Release 4 explanations, restating the existing public research.
   Basis: gb-01, gb-04 to gb-07, gb-09 and gb-10; no toll quote is republished.
   Sources belong to this market's public-content pool; no model values are held here.
   Scenario charge levels are schematic states, not dispatch or investment outputs. */
import { contracted } from './contracted.js';

const sequence0 = {
  "id": "gb-response",
  "family": "frequency",
  "title": [
    "Fast response is bought, not owed",
    "快速响应须采购，并非自动享有"
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
      "id": "frequency",
      "asks": "system",
      "view": "system",
      "state": {
        "flow": "idle",
        "signal": "frequency",
        "soc": 0.6
      },
      "title": [
        "Britain keeps its own frequency",
        "英国维持自身频率"
      ],
      "text": [
        "Direct-current links trade power with neighbouring systems without sharing their frequency. Britain must cover most of the response to a large unit trip within its own system.",
        "直流联络线与邻近系统交易电力，但不共享频率。大型机组跳闸后，英国须主要依靠本系统提供响应。"
      ],
      "sources": [
        "SRC-GB-01",
        "SRC-GB-02"
      ]
    },
    {
      "id": "headroom",
      "asks": "response",
      "view": "storage",
      "state": {
        "flow": "discharge",
        "signal": "frequency",
        "headroom": true,
        "soc": 0.6
      },
      "title": [
        "Reserve the power before offering it",
        "先预留功率，再提供服务"
      ],
      "text": [
        "Power and stored energy offered for response cannot also be promised in full to balancing or trading. The same battery serves these markets.",
        "为响应预留的功率和电量，不能再全额承诺给平衡或交易。这些市场共用同一座电池。"
      ],
      "sources": [
        "SRC-GB-10",
        "SRC-GB-21"
      ]
    },
    {
      "id": "auction",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "flow": "idle",
        "headroom": true,
        "qualified": true,
        "awarded": false,
        "delivers": true,
        "soc": 0.6
      },
      "title": [
        "Qualification is not an accepted bid",
        "取得资格不等于报价获接受"
      ],
      "text": [
        "NESO procures response in short auctions. A capable battery needs an accepted offer and must meet that service’s obligations; capability alone is not an award.",
        "NESO通过短期拍卖采购响应。电池除了具备能力，还须报价获接受并履行该服务义务；技术能力本身不等于中标。"
      ],
      "sources": [
        "SRC-GB-09",
        "SRC-GB-10"
      ]
    },
    {
      "id": "delivery",
      "asks": "value",
      "view": "mechanism",
      "state": {
        "flow": "discharge",
        "signal": "frequency",
        "qualified": true,
        "awarded": true,
        "delivers": true,
        "headroom": true,
        "soc": 0.5
      },
      "title": [
        "The payment buys the specified response",
        "付款购买约定的响应"
      ],
      "text": [
        "The auction pays for response held ready under its terms. That clearing price is not the owner’s captured earnings, and it is not the price of energy traded.",
        "拍卖按条款为待命响应付费。该出清价不是业主实际收益，也不是交易电量的价格。"
      ],
      "sources": [
        "SRC-GB-11",
        "SRC-GB-12",
        "SRC-GB-13"
      ]
    },
    {
      "id": "competition",
      "asks": "limit",
      "view": "system",
      "state": {
        "flow": "idle",
        "fleet": "crowded",
        "soc": 0.5
      },
      "title": [
        "More offers compete for the requirement",
        "更多报价争夺同一需求"
      ],
      "text": [
        "NESO attributes earlier price falls to more participants and offered volume. Requirements and clearing prices can change; an opening service price is not a lasting revenue floor.",
        "NESO将此前价格下降归因于参与者和报价量增加。采购需求和出清价格都会变化；服务推出时的价格不构成长期收入保底。"
      ],
      "sources": [
        "SRC-GB-11",
        "SRC-GB-12"
      ]
    }
  ]
};

const sequence1 = {
  "id": "gb-access",
  "family": "network",
  "title": [
    "Connection first, trading second",
    "先取得并网条件，再参与交易"
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
      "id": "queue",
      "asks": "constraint",
      "view": "system",
      "state": {
        "delivers": false,
        "flow": "idle",
        "breaker": "open",
        "network": "open",
        "qualified": false,
        "soc": 0.5
      },
      "title": [
        "A queue position is not an operating connection",
        "排队位置不是已投运的连接"
      ],
      "text": [
        "Connection reform reorders projects. Those meeting the approved readiness and strategic-alignment criteria receive a confirmed date and connection point.",
        "并网改革重新排序项目。满足获批的就绪程度和战略匹配标准后，项目才获得确定的并网日期与接入点。"
      ],
      "sources": [
        "SRC-GB-23"
      ]
    },
    {
      "id": "connect",
      "asks": "response",
      "view": "storage",
      "state": {
        "delivers": false,
        "flow": "charge",
        "breaker": "closed",
        "network": "open",
        "qualified": true,
        "soc": 0.5
      },
      "title": [
        "An operating connection opens the physical route",
        "投运的连接打通物理通道"
      ],
      "text": [
        "An operating battery already holds its connection. New construction still depends on the connection conditions and delivery timetable attached to its project.",
        "在运电池已持有并网条件。新建项目仍取决于自身获准的接入条件与交付时间表。"
      ],
      "sources": [
        "SRC-GB-23",
        "SRC-GB-24"
      ]
    },
    {
      "id": "dispatch",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "flow": "discharge",
        "signal": "dispatch",
        "qualified": true,
        "awarded": true,
        "delivers": true,
        "soc": 0.6
      },
      "title": [
        "Dispatch access is not the owner’s margin",
        "调度准入不是业主利润"
      ],
      "text": [
        "The Open Balancing Platform lets the control room instruct batteries in the Balancing Mechanism. Elexon settlement and the asset’s payment terms determine what follows that instruction.",
        "开放平衡平台使调度室可在平衡机制中向电池发出指令。Elexon结算及资产付款条款决定指令之后如何收付款。"
      ],
      "sources": [
        "SRC-GB-15",
        "SRC-GB-17"
      ]
    },
    {
      "id": "limits",
      "asks": "limit",
      "view": "system",
      "state": {
        "delivers": false,
        "breaker": "open",
        "flow": "idle",
        "network": "open",
        "fleet": "crowded",
        "soc": 0.5
      },
      "title": [
        "A national price does not remove connection limits",
        "全国统一电价不会消除并网限制"
      ],
      "text": [
        "Britain keeps a national price, but connection access remains project-specific. The published research treats the proposed extra commitment fee as pending, not an enacted cost.",
        "英国维持全国统一电价，但接入条件仍须逐项目核实。已发布研究把拟议的额外承诺费视作待定事项，而非已生效成本。"
      ],
      "sources": [
        "SRC-GB-22",
        "SRC-GB-23",
        "SRC-GB-25"
      ]
    }
  ]
};

const contract0 = contracted({
  "id": "gb-capacity",
  "home": [
    "mechanism"
  ],
  "title": [
    "A capacity agreement carries a duty",
    "容量协议附带履约义务"
  ],
  "gates": [
    [
      "Capacity qualified",
      "容量资格获批"
    ],
    [
      "Agreement awarded",
      "协议已授予"
    ],
    [
      "Duty met",
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
        "Available plant",
        "可用电站"
      ],
      "title": [
        "Available plant",
        "可用电站"
      ],
      "text": [
        "A battery may be ready to discharge without holding a capacity agreement. Owning equipment does not establish that contracted payment.",
        "电池可以具备放电能力，却未持有容量协议。拥有设备本身不能确立合同付款。"
      ],
      "sources": [
        "SRC-GB-18",
        "SRC-GB-21"
      ]
    },
    "accreditation": {
      "name": [
        "Credited, not nameplate",
        "计入容量，不是铭牌容量"
      ],
      "title": [
        "Credited, not nameplate",
        "计入容量，不是铭牌容量"
      ],
      "text": [
        "Storage capacity credit depends on how long the battery can keep discharging. The auction counts credited power rather than all of the nameplate power.",
        "储能容量信用取决于电池能持续放电多久。拍卖计入的是获认可的功率，而非全部铭牌功率。"
      ],
      "sources": [
        "SRC-GB-19"
      ]
    },
    "award": {
      "name": [
        "An asset’s own award",
        "资产自身的中标协议"
      ],
      "title": [
        "An asset’s own award",
        "资产自身的中标协议"
      ],
      "text": [
        "An actual capacity award fixes a payment line for its agreement term. A published auction result is not an agreement held by every battery.",
        "实际容量中标在协议期内锁定一项付款。公开拍卖结果并不等于每座电池都持有协议。"
      ],
      "sources": [
        "SRC-GB-20",
        "SRC-GB-21"
      ]
    },
    "obligation": {
      "name": [
        "Ready when the system is stressed",
        "系统紧张时保持可用"
      ],
      "title": [
        "Ready when the system is stressed",
        "系统紧张时保持可用"
      ],
      "text": [
        "The capacity agreement carries a duty to deliver when the system is stressed. Trading and response commitments must leave the battery able to meet that duty.",
        "容量协议要求在系统紧张时履约。交易与响应承诺必须确保电池仍能履行这一义务。"
      ],
      "sources": [
        "SRC-GB-19",
        "SRC-GB-21"
      ]
    },
    "performance": {
      "name": [
        "Meet the agreement’s obligations",
        "履行协议义务"
      ],
      "title": [
        "Meet the agreement’s obligations",
        "履行协议义务"
      ],
      "text": [
        "The physical battery must meet the obligations of its agreement. Do not treat the capacity payment as a second sale of energy already promised elsewhere.",
        "实际电池须履行协议义务。容量付款不能被理解为再次出售已经承诺给其他用途的电量。"
      ],
      "sources": [
        "SRC-GB-19",
        "SRC-GB-21"
      ]
    },
    "settlement": {
      "name": [
        "Suppliers fund the payment",
        "售电商承担付款资金"
      ],
      "title": [
        "Suppliers fund the payment",
        "售电商承担付款资金"
      ],
      "text": [
        "Suppliers fund the Capacity Market through the Electricity Settlements Company for the agreement’s term. Its obligations and units differ from response and energy settlement.",
        "售电商通过电力结算公司在协议期内为容量市场出资。其履约义务与计量单位不同于响应及电能结算。"
      ],
      "sources": [
        "SRC-GB-21"
      ]
    }
  }
});

export const SEQUENCES = [sequence0, sequence1, contract0];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
