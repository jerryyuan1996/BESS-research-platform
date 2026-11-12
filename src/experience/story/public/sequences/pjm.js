/* PJM: annual capacity, winter duration and emergency performance.
   Evidence: existing story shots pjm-02–05/07/09–10; no backstop award assumed.
   Content only. Every step restates the existing public research, with its
   original source pool. No investment model or approval record is changed.
   Scenario energy levels are schematic, never a simulated dispatch. */

import { contracted } from './contracted.js';

const capacity = contracted({
  "id": "pjm-capacity",
  "home": [
    "mechanism"
  ],
  "title": [
    "One auction, one delivery year",
    "一次拍卖，一个交付年度"
  ],
  "gates": [
    [
      "Accredited",
      "已核定容量"
    ],
    [
      "Auction cleared",
      "已在拍卖出清"
    ],
    [
      "Obligation met",
      "已履行义务"
    ]
  ],
  "base": {
    "network": "open",
    "time": "night",
    "solar": "off"
  },
  "stages": {
    "availability": {
      "name": [
        "Available plant",
        "可用电站"
      ],
      "title": [
        "Physical power is only the starting point",
        "物理功率只是起点"
      ],
      "text": [
        "PJM buys reliability ahead of delivery. A working battery must still qualify and clear the auction before it holds a capacity revenue commitment.",
        "PJM提前采购可靠性。一台能运行的电池仍须取得资格并在拍卖中出清，才拥有容量收入承诺。"
      ],
      "sources": [
        "SRC-PJM-17",
        "SRC-PJM-05"
      ]
    },
    "accreditation": {
      "name": [
        "Accredited capacity",
        "核定容量"
      ],
      "title": [
        "Nameplate power is not all counted",
        "铭牌功率并非全部计入"
      ],
      "text": [
        "Accreditation measures the battery’s contribution in the hours of greatest risk. Duration matters: longer batteries receive more credit than shorter ones.",
        "容量核定衡量电池在风险最高时段的贡献。时长很重要：长时电池获得的信用高于短时电池。"
      ],
      "sources": [
        "SRC-PJM-06",
        "SRC-PJM-12"
      ]
    },
    "award": {
      "name": [
        "Cleared auction",
        "拍卖出清"
      ],
      "title": [
        "The auction secures a delivery year",
        "拍卖锁定一个交付年度"
      ],
      "text": [
        "Each Base Residual Auction buys capacity for a single delivery year. A price in an auction report is not an award held by an individual project.",
        "每次基础剩余容量拍卖采购一个交付年度的容量。拍卖报告中的价格，不等于某个项目已经持有中标资格。"
      ],
      "sources": [
        "SRC-PJM-17",
        "SRC-PJM-05"
      ]
    },
    "obligation": {
      "name": [
        "Emergency performance duty",
        "紧急履约义务"
      ],
      "title": [
        "A cleared resource promises to perform",
        "出清资源承诺履约"
      ],
      "text": [
        "Capacity Performance ties the award to delivery when the grid is in trouble. Holding an award does not remove the need to keep the plant ready.",
        "容量履约规则把中标与电网紧急状态下的交付联系起来。持有中标资格，并不免除保持电站就绪的责任。"
      ],
      "sources": [
        "SRC-PJM-21"
      ]
    },
    "performance": {
      "name": [
        "Emergency delivery",
        "紧急交付"
      ],
      "title": [
        "The battery must deliver when called",
        "电池须在调用时交付"
      ],
      "text": [
        "Power, stored energy and availability must support emergency delivery. A resource that falls short during an emergency faces a charge.",
        "功率、储存电量及可用性须共同支撑紧急交付。紧急状态下未足额履约的资源面临罚款。"
      ],
      "sources": [
        "SRC-PJM-21"
      ]
    },
    "settlement": {
      "name": [
        "Capacity settlement",
        "容量结算"
      ],
      "title": [
        "Suppliers pay through PJM",
        "售电主体通过PJM付费"
      ],
      "text": [
        "Electricity suppliers pay through PJM through the delivery year for cleared capacity, subject to its obligations. The next delivery year must clear again; today’s price does not fix the renewal price.",
        "售电主体通过PJM，在交付年度内为出清容量付费，资源须履行相应义务。下一交付年度必须重新出清；今天的价格不锁定续期价格。"
      ],
      "sources": [
        "SRC-PJM-26",
        "SRC-PJM-17",
        "SRC-PJM-05"
      ]
    }
  }
});

const duration = {
  "id": "pjm-duration",
  "home": [
    "storage"
  ],
  "family": "shifting",
  "title": [
    "Power must last through the risk hours",
    "功率必须持续覆盖风险时段"
  ],
  "gates": [
    [
      "Accredited",
      "已核定容量"
    ],
    [
      "Auction cleared",
      "已在拍卖出清"
    ],
    [
      "Obligation met",
      "已履行义务"
    ]
  ],
  "base": {
    "network": "open"
  },
  "steps": [
    {
      "id": "risk",
      "asks": "system",
      "view": "system",
      "state": {
        "time": "night",
        "solar": "off",
        "flow": "idle",
        "soc": 0.8
      },
      "title": [
        "Winter changes the reliability question",
        "冬季改变可靠性问题"
      ],
      "text": [
        "PJM’s research identifies winter emergencies that can last beyond one evening. A battery’s contribution depends on how long its energy can cover those risk hours.",
        "PJM的研究指出，冬季紧急状态可能持续超过一个傍晚。电池的贡献取决于其电量能够覆盖这些风险时段多久。"
      ],
      "sources": [
        "SRC-PJM-11"
      ]
    },
    {
      "id": "output",
      "asks": "response",
      "view": "storage",
      "state": {
        "time": "night",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.6
      },
      "title": [
        "Discharge spends a finite store",
        "放电消耗有限的储存电量"
      ],
      "text": [
        "The battery can deliver power only while usable energy remains. More power on the nameplate does not make its stored energy last longer.",
        "电池只有在仍有可用电量时才能输出功率。更高的铭牌功率，并不会使储存电量持续更久。"
      ],
      "sources": [
        "SRC-PJM-11",
        "SRC-PJM-12"
      ]
    },
    {
      "id": "recharge",
      "asks": "constraint",
      "view": "storage",
      "state": {
        "time": "night",
        "solar": "off",
        "flow": "idle",
        "soc": 0.1
      },
      "title": [
        "Another cold hour may leave no recharge window",
        "下一个寒冷时段可能没有再充电窗口"
      ],
      "text": [
        "A battery that empties on the first cold evening cannot count on recharging if demand stays high overnight. Energy limits therefore affect the capacity it can reliably supply.",
        "若需求整夜居高不下，首个寒冷傍晚就放空的电池不能指望顺利再充电。因此，电量限制影响其能够可靠提供的容量。"
      ],
      "sources": [
        "SRC-PJM-11"
      ]
    },
    {
      "id": "credit",
      "asks": "value",
      "view": "mechanism",
      "state": {
        "time": "night",
        "solar": "off",
        "flow": "idle",
        "soc": 0.3
      },
      "title": [
        "Accreditation counts the contribution",
        "容量核定计入实际贡献"
      ],
      "text": [
        "PJM applies class ratings rather than counting all storage nameplate power. The existing ratings give different credit to different durations.",
        "PJM使用类别核定系数，而非将储能铭牌功率全部计入。现有核定系数给予不同时长不同的信用。"
      ],
      "sources": [
        "SRC-PJM-06",
        "SRC-PJM-07"
      ]
    },
    {
      "id": "renewal",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "time": "night",
        "solar": "off",
        "flow": "idle",
        "soc": 0.3,
        "fleet": "crowded"
      },
      "title": [
        "Later credits are not a guarantee",
        "后续信用不是保证"
      ],
      "text": [
        "PJM’s indicative ratings show storage credit declining, especially for shorter batteries. Those projections are not a guaranteed future accreditation or a locked revenue stream.",
        "PJM的指示性核定系数显示储能信用下降，短时电池尤其明显。这些预测既不是保证的未来核定结果，也不是锁定收入。"
      ],
      "sources": [
        "SRC-PJM-11",
        "SRC-PJM-12"
      ]
    }
  ]
};

const emergency = {
  "id": "pjm-emergency",
  "home": [
    "system"
  ],
  "family": "network",
  "title": [
    "A reliability need is not an investment award",
    "可靠性需求不等于投资中标"
  ],
  "gates": [
    [
      "Accredited",
      "已核定容量"
    ],
    [
      "Auction cleared",
      "已在拍卖出清"
    ],
    [
      "Emergency performance",
      "紧急履约"
    ]
  ],
  "base": {
    "network": "open"
  },
  "steps": [
    {
      "id": "demand",
      "asks": "system",
      "view": "system",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "soc": 0.8
      },
      "title": [
        "Demand can outrun new supply",
        "需求可能快于新增供给"
      ],
      "text": [
        "The existing PJM research describes growing demand and new supply arriving more slowly. A regional need for capacity is not the same as a completed, accredited project.",
        "现有PJM研究描述了需求增长与新增供给到位较慢的情况。区域需要容量，不等于项目已经建成并取得容量核定。"
      ],
      "sources": [
        "SRC-PJM-24",
        "SRC-PJM-25",
        "SRC-PJM-17"
      ]
    },
    {
      "id": "ready",
      "asks": "response",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "idle",
        "soc": 0.8,
        "qualified": false,
        "awarded": false
      },
      "title": [
        "A new battery still needs a route to market",
        "新电池仍需取得市场准入"
      ],
      "text": [
        "Joining the interconnection process is a development step, not a capacity award. The plant must become capable of delivery and pass the capacity process.",
        "进入并网流程只是开发步骤，并非容量中标。电站须具备交付能力，并完成容量程序。"
      ],
      "sources": [
        "SRC-PJM-25",
        "SRC-PJM-17"
      ]
    },
    {
      "id": "called",
      "asks": "constraint",
      "view": "storage",
      "state": {
        "time": "night",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.4,
        "signal": "dispatch"
      },
      "title": [
        "Emergency conditions test the promise",
        "紧急状态检验承诺"
      ],
      "text": [
        "Winter Storm Elliott tested Capacity Performance across the system. A cleared resource has to deliver during emergencies, not merely be installed.",
        "Elliott冬季风暴在全系统检验了容量履约规则。出清资源必须在紧急状态下交付，而非仅仅完成安装。"
      ],
      "sources": [
        "SRC-PJM-21"
      ]
    },
    {
      "id": "charge",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "time": "night",
        "solar": "off",
        "flow": "idle",
        "soc": 0.1,
        "delivers": false
      },
      "title": [
        "Failure can produce a charge",
        "未履约可能产生罚款"
      ],
      "text": [
        "Falling short during an emergency can trigger a Capacity Performance charge. The auction price cannot be read without the delivery obligation beside it.",
        "紧急状态下未足额履约，可能触发容量履约罚款。阅读拍卖价格时，必须同时阅读相应交付义务。"
      ],
      "sources": [
        "SRC-PJM-21"
      ]
    }
  ]
};

export const SEQUENCES = [capacity, duration, emergency];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
