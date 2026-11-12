/* California: sunset energy, deliverability and bilateral RA, compatible services.
   Evidence: existing story shots caiso-01–03/05/07/09–11 and public payment text.
   Content only. Every step restates the existing public research, with its
   original source pool. No investment model or approval record is changed.
   Scenario energy levels are schematic, never a simulated dispatch. */

import { contracted } from './contracted.js';

const sunset = {
  "id": "caiso-sunset",
  "home": [
    "system"
  ],
  "family": "shifting",
  "title": [
    "From midday solar to the net-load peak",
    "从午间光伏到净负荷高峰"
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
        "Solar carries the middle of the day",
        "光伏撑起午间"
      ],
      "text": [
        "California’s solar output serves much of the middle of the day. The demand left for other resources falls while solar is producing.",
        "加州的光伏承担午间大量需求。光伏出力时，留给其他资源供应的需求下降。"
      ],
      "sources": [
        "SRC-CAISO-04"
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
        "soc": 0.7
      },
      "title": [
        "Batteries move energy into the evening",
        "电池将电能转移至傍晚"
      ],
      "text": [
        "Batteries charge on midday solar and discharge into the evening. Charging energy is part of the requirement, not an unlimited free input.",
        "电池在午间光伏出力时充电，并向傍晚放电。充电电量是必须满足的条件，而非无限免费的投入。"
      ],
      "sources": [
        "SRC-CAISO-11",
        "SRC-CAISO-09"
      ]
    },
    {
      "id": "sunset",
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
        "Solar fades before demand does",
        "光伏先于需求退场"
      ],
      "text": [
        "Homes and offices still draw power after solar fades. Net load, demand minus wind and solar, rises into the early evening.",
        "光伏回落后，住户与办公楼仍在用电。净负荷，即需求减去风电与光伏，在傍晚早些时候上升。"
      ],
      "sources": [
        "SRC-CAISO-04",
        "SRC-CAISO-05"
      ]
    },
    {
      "id": "discharge",
      "asks": "value",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.5
      },
      "title": [
        "Stored energy covers the ramp",
        "储存电量覆盖爬坡"
      ],
      "text": [
        "The battery discharges when net load is high. Its duration and remaining charge determine how long that contribution can last.",
        "电池在净负荷高时放电。其时长与剩余电量决定这种贡献能持续多久。"
      ],
      "sources": [
        "SRC-CAISO-11",
        "SRC-CAISO-07"
      ]
    },
    {
      "id": "limits",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.3,
        "headroom": true
      },
      "title": [
        "Trading must fit around the RA obligation",
        "交易须与RA义务相容"
      ],
      "text": [
        "A battery that has sold Resource Adequacy must offer that capacity into the market. Energy trading and regulation use only compatible remaining capability, not a second copy of the asset.",
        "出售资源充足性（RA）的电池，须将该容量报入市场。电能量交易与调频只能使用相容的剩余能力，而不是另一份相同资产。"
      ],
      "sources": [
        "SRC-CAISO-11",
        "SRC-CAISO-09"
      ]
    }
  ]
};

const ra = contracted({
  "id": "caiso-ra",
  "home": [
    "mechanism"
  ],
  "title": [
    "Deliverability and an RA contract",
    "可交付性与RA合同"
  ],
  "gates": [
    [
      "Qualifying and deliverable",
      "合格且可交付"
    ],
    [
      "RA contract signed",
      "已签RA合同"
    ],
    [
      "Obligations met",
      "已履行义务"
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
        "Connected battery",
        "已并网电池"
      ],
      "title": [
        "A connection alone is not enough",
        "仅有并网连接还不够"
      ],
      "text": [
        "Equipment and a grid connection make the plant. They do not by themselves give it Resource Adequacy value.",
        "设备与并网连接构成电站，但两者本身并不能赋予电站资源充足性价值。"
      ],
      "sources": [
        "SRC-CAISO-07",
        "SRC-CAISO-17"
      ]
    },
    "accreditation": {
      "name": [
        "Deliverable qualifying capacity",
        "可交付的合格容量"
      ],
      "title": [
        "The right must reach the capacity market",
        "资格须能进入容量市场"
      ],
      "text": [
        "For capacity to count toward RA delivery, the battery needs qualifying capacity and the required CAISO deliverability status. A connection alone does not establish that qualification.",
        "容量要计入RA交付，电池须具备合格容量及要求的CAISO可交付性资格。仅有并网连接不等于取得该资格。"
      ],
      "sources": [
        "SRC-CAISO-07",
        "SRC-CAISO-17"
      ]
    },
    "award": {
      "name": [
        "Retailer contract",
        "售电主体合同"
      ],
      "title": [
        "A retailer signs the revenue commitment",
        "售电主体签署收入承诺"
      ],
      "text": [
        "California procures RA through bilateral contracts, not a central capacity auction. A qualified battery still needs an RA contract with a retailer.",
        "加州通过双边合同而非集中容量拍卖采购RA。具备资格的电池仍需与售电主体签订RA合同。"
      ],
      "sources": [
        "SRC-CAISO-01",
        "SRC-CAISO-02",
        "SRC-CAISO-03"
      ]
    },
    "obligation": {
      "name": [
        "Market offer and recharge",
        "市场报价与再充电"
      ],
      "title": [
        "The sold capacity must be offered",
        "已售容量须报入市场"
      ],
      "text": [
        "Sold RA capacity must be offered into CAISO’s market. The buyer must also show spare energy to recharge the battery under the hourly framework.",
        "已售RA容量须报入CAISO市场。买方还须按逐小时框架申报为电池再充电所需的富余电量。"
      ],
      "sources": [
        "SRC-CAISO-09",
        "SRC-CAISO-11"
      ]
    },
    "performance": {
      "name": [
        "Sustained available output",
        "持续可用出力"
      ],
      "title": [
        "The battery must sustain what is counted",
        "电池须维持所计入的出力"
      ],
      "text": [
        "Qualifying capacity depends on sustained output, not just nameplate power. The published refinements address output foldback and outage performance.",
        "合格容量取决于持续出力，而非仅看铭牌功率。已公布的规则完善涉及出力回落与停运表现。"
      ],
      "sources": [
        "SRC-CAISO-07",
        "SRC-CAISO-10"
      ]
    },
    "settlement": {
      "name": [
        "RA contract settlement",
        "RA合同结算"
      ],
      "title": [
        "The retailer pays under the contract",
        "售电主体按合同付费"
      ],
      "text": [
        "The retailer pays for qualifying capacity under the RA contract and its obligations. Contract expiry requires renewal; a published benchmark is not the price of a signed project contract.",
        "售电主体按RA合同及相应义务，为合格容量付费。合同到期须续签；公布的价格基准不等于某项已签项目合同的价格。"
      ],
      "sources": [
        "SRC-CAISO-11",
        "SRC-CAISO-15",
        "SRC-CAISO-16"
      ]
    }
  }
});

const headroom = {
  "id": "caiso-headroom",
  "home": [
    "storage"
  ],
  "family": "frequency",
  "title": [
    "One battery, compatible obligations",
    "一台电池，相容的义务"
  ],
  "gates": [
    [
      "Qualified",
      "已具资格"
    ],
    [
      "Service awarded",
      "服务已中标"
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
      "id": "obligation",
      "asks": "system",
      "view": "system",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "soc": 0.8
      },
      "title": [
        "RA starts with the required hours",
        "RA从规定时段开始"
      ],
      "text": [
        "The hourly Resource Adequacy framework requires retailers to show capacity for the relevant hours and enough spare energy to charge storage.",
        "逐小时资源充足性框架要求售电主体申报相关时段的容量，以及足够为储能充电的富余电量。"
      ],
      "sources": [
        "SRC-CAISO-09"
      ]
    },
    {
      "id": "reserve",
      "asks": "response",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "headroom": true,
        "soc": 0.8,
        "signal": "frequency"
      },
      "title": [
        "Regulation uses power headroom",
        "调频使用功率裕度"
      ],
      "text": [
        "Regulation and energy trading use the capability left around the battery’s RA commitments. The same power cannot be counted in full for every use.",
        "调频与电能量交易使用电池RA承诺之外的剩余能力。同一份功率不能在每项用途下都按满额计入。"
      ],
      "sources": [
        "SRC-CAISO-11",
        "SRC-CAISO-09"
      ]
    },
    {
      "id": "energy",
      "asks": "constraint",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "headroom": true,
        "soc": 0.3
      },
      "title": [
        "Energy limits survive a service award",
        "服务中标不会消除电量限制"
      ],
      "text": [
        "The battery still has to sustain the output its obligations require. Spending energy on one activity can limit what remains for the next.",
        "电池仍须维持义务要求的出力。在一项活动中消耗电量，会限制下一项活动可用的电量。"
      ],
      "sources": [
        "SRC-CAISO-07",
        "SRC-CAISO-09",
        "SRC-CAISO-11"
      ]
    },
    {
      "id": "crowded",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "headroom": true,
        "soc": 0.3,
        "fleet": "crowded"
      },
      "title": [
        "Regulation is already crowded",
        "调频已十分拥挤"
      ],
      "text": [
        "Batteries already supply most of the regulation CAISO buys. Regulation is a separate market activity, not an unlimited supplement to contracted RA revenue.",
        "电池已提供CAISO采购的大部分调频服务。调频是独立市场业务，而不是合同RA收入之外无限可加的补充。"
      ],
      "sources": [
        "SRC-CAISO-11"
      ]
    }
  ]
};

export const SEQUENCES = [sunset, ra, headroom];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
