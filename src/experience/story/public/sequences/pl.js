/* PL: Release 4 explanations, restating the existing public research.
   Basis: pl-01 to pl-12; grant cohorts, award factors and model assumptions remain unchanged.
   Sources belong to this market's public-content pool; no model values are held here.
   Scenario charge levels are schematic states, not dispatch or investment outputs. */
import { contracted } from './contracted.js';

const sequence0 = {
  "id": "pl-trading",
  "family": "shifting",
  "title": [
    "Trading remains after the award",
    "中标之外仍需交易"
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
      "id": "need",
      "asks": "system",
      "view": "system",
      "state": {
        "delivers": false,
        "flow": "idle",
        "soc": 0.3
      },
      "title": [
        "An ageing fleet creates an adequacy question",
        "老化机组带来充裕性问题"
      ],
      "text": [
        "Poland’s power system was built around coal. The capacity mechanism was introduced to retain enough available capacity as older units faced closure.",
        "波兰电力系统围绕煤电建成。随着老机组面临退出，容量机制用于维持足够可用容量。"
      ],
      "sources": [
        "SRC-PL-02"
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
        "Trading buys low-priced energy",
        "交易买入低价电量"
      ],
      "text": [
        "A battery charges when market prices are low and sells when they are higher. A grant can reduce build cost without changing that operating task.",
        "电池在市场低价时充电、高价时出售。补贴可以降低建设成本，却不改变这一运营任务。"
      ],
      "sources": [
        "SRC-PL-16",
        "SRC-PL-19"
      ]
    },
    {
      "id": "sale",
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
        "The trade earns market revenue",
        "交易赚取市场收入"
      ],
      "text": [
        "Capacity and grant cohorts both earn additional revenue by trading. Construction support is not a recurring payment for each discharge.",
        "容量合同批次与补贴批次均通过交易获得其他收入。建设资助不是每次放电都能获得的持续付款。"
      ],
      "sources": [
        "SRC-PL-01",
        "SRC-PL-17",
        "SRC-PL-19"
      ]
    },
    {
      "id": "competition",
      "asks": "limit",
      "view": "system",
      "state": {
        "flow": "discharge",
        "fleet": "crowded",
        "soc": 0.4
      },
      "title": [
        "Both cohorts compete for the spread",
        "两个批次共同竞争价差"
      ],
      "text": [
        "More batteries arriving can squeeze trading margins. An earlier award or a grant does not remove the remaining merchant exposure.",
        "更多电池投运可能压缩交易利润。早期中标或补贴不会消除剩余市场风险。"
      ],
      "sources": [
        "SRC-PL-16",
        "SRC-PL-17",
        "SRC-PL-21"
      ]
    }
  ]
};

const sequence1 = {
  "id": "pl-rights",
  "family": "network",
  "title": [
    "Rights come with tests and deadlines",
    "权利附带测试与期限"
  ],
  "home": [
    "system"
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
      "id": "connection",
      "asks": "constraint",
      "view": "system",
      "state": {
        "flow": "idle",
        "breaker": "open",
        "network": "constrained",
        "qualified": false,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "A contract cannot replace a connection",
        "合同不能替代并网"
      ],
      "text": [
        "Connection is a separate constraint for both capacity and grant-backed projects. The research records frequent connection refusals.",
        "并网是容量与补贴项目都需单独面对的约束。研究记录了常见的并网拒绝情况。"
      ],
      "sources": [
        "SRC-PL-16"
      ]
    },
    {
      "id": "delivery",
      "asks": "response",
      "view": "storage",
      "state": {
        "flow": "idle",
        "breaker": "closed",
        "qualified": true,
        "awarded": true,
        "delivers": false,
        "soc": 0.8
      },
      "title": [
        "An awarded new unit must pass its test",
        "中标新机组须通过测试"
      ],
      "text": [
        "A capacity agreement starts paying only after the delivery test. Missing the applicable milestone can cause a new unit’s agreement to lapse.",
        "容量协议只有通过交付测试后才开始付款。未达到适用里程碑可能导致新机组协议终止。"
      ],
      "sources": [
        "SRC-PL-15"
      ]
    },
    {
      "id": "grant",
      "asks": "value",
      "view": "storage",
      "state": {
        "flow": "idle",
        "qualified": true,
        "awarded": false,
        "soc": 0.8
      },
      "title": [
        "A grant has different conditions",
        "补贴具有不同条件"
      ],
      "text": [
        "A grant reimburses eligible costs, can be cut for late completion and can require repayment if its conditions are broken. A ranked application is not the same as a signed agreement.",
        "补贴报销合格成本，延迟完工可能被扣减，违反条件可能须返还。申请排名不等于已签协议。"
      ],
      "sources": [
        "SRC-PL-17",
        "SRC-PL-18",
        "SRC-PL-19",
        "SRC-PL-21"
      ]
    },
    {
      "id": "separate",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "flow": "idle",
        "qualified": true,
        "awarded": false,
        "soc": 0.8
      },
      "title": [
        "Do not add the support twice",
        "不能重复叠加支持"
      ],
      "text": [
        "Where a project also holds a capacity agreement, the law deducts grant aid from the capacity payment. A closed grant cohort cannot be applied to an unawarded new project.",
        "项目若同时持有容量协议，法律规定从容量付款中扣减补贴。已关闭的补贴批次不能套用于未获资助的新项目。"
      ],
      "sources": [
        "SRC-PL-01",
        "SRC-PL-17",
        "SRC-PL-19"
      ]
    }
  ]
};

const contract0 = contracted({
  "id": "pl-capacity",
  "home": [
    "mechanism"
  ],
  "title": [
    "Capacity value belongs to the award vintage",
    "容量价值属于具体中标批次"
  ],
  "gates": [
    [
      "Capacity certified",
      "容量已认证"
    ],
    [
      "Agreement held",
      "持有协议"
    ],
    [
      "Delivery test met",
      "交付测试通过"
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
        "Capacity that can be there",
        "届时能够可用的容量"
      ],
      "title": [
        "Capacity that can be there",
        "届时能够可用的容量"
      ],
      "text": [
        "PSE runs auctions for capacity availability. Being physically ready does not mean the battery already holds an agreement.",
        "PSE组织容量可用性拍卖。实际具备能力不等于电池已经持有协议。"
      ],
      "sources": [
        "SRC-PL-01",
        "SRC-PL-02"
      ]
    },
    "accreditation": {
      "name": [
        "Sustained power is certified",
        "持续功率获得认证"
      ],
      "title": [
        "Sustained power is certified",
        "持续功率获得认证"
      ],
      "text": [
        "The battery is certified for power it can hold through the required continuous period. The auction’s correction factor is separate from nameplate power.",
        "电池按规定连续时段内可维持的功率认证。拍卖修正系数与铭牌功率不是同一概念。"
      ],
      "sources": [
        "SRC-PL-12",
        "SRC-PL-15"
      ]
    },
    "award": {
      "name": [
        "Keep the actual auction terms",
        "保留实际拍卖条款"
      ],
      "title": [
        "Keep the actual auction terms",
        "保留实际拍卖条款"
      ],
      "text": [
        "Earlier battery awards and later awards have different correction factors. Read the project’s own agreement rather than transfer an earlier factor to it.",
        "早期与后续电池中标采用不同修正系数。须读取项目自身协议，不能把早期系数直接移用。"
      ],
      "sources": [
        "SRC-PL-08",
        "SRC-PL-11",
        "SRC-PL-12",
        "SRC-PL-26"
      ]
    },
    "obligation": {
      "name": [
        "Rights carry a delivery duty",
        "权利附带交付义务"
      ],
      "title": [
        "Rights carry a delivery duty",
        "权利附带交付义务"
      ],
      "text": [
        "The agreement pays for availability and penalises failure to deliver. Its delivery tests and milestones remain binding after the award.",
        "协议为可用性付费，未履约则受罚。中标后仍须遵守交付测试与里程碑。"
      ],
      "sources": [
        "SRC-PL-01",
        "SRC-PL-15"
      ]
    },
    "performance": {
      "name": [
        "Pass before payment begins",
        "通过测试后才开始付款"
      ],
      "title": [
        "Pass before payment begins",
        "通过测试后才开始付款"
      ],
      "text": [
        "The battery must pass the delivery test before capacity payments begin. A missed new-unit milestone can end the agreement rather than merely delay cash.",
        "电池须通过交付测试后才开始收取容量付款。新机组错过里程碑可能使协议终止，而不只是推迟收款。"
      ],
      "sources": [
        "SRC-PL-15"
      ]
    },
    "settlement": {
      "name": [
        "Users fund the agreement’s term",
        "用户为协议期内付款出资"
      ],
      "title": [
        "Users fund the agreement’s term",
        "用户为协议期内付款出资"
      ],
      "text": [
        "Capacity agreements are funded through a charge on electricity users. The research does not assume a successor long-term framework for an unawarded new battery.",
        "容量协议由向电力用户收取的容量费出资。研究不会为尚未中标的新电池假定接续长期机制。"
      ],
      "sources": [
        "SRC-PL-01",
        "SRC-PL-03"
      ]
    }
  }
});

export const SEQUENCES = [sequence0, sequence1, contract0];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
