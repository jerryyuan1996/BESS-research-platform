/* Western Australia: solar, credited availability and essential services.
   Evidence: existing story shots wa-01/02/04–11 and public payment text.
   Content only. Every step restates the existing public research, with its
   original source pool. No investment model or approval record is changed.
   Scenario energy levels are schematic, never a simulated dispatch. */

import { contracted } from './contracted.js';

const solar = {
  "id": "wa-solar",
  "home": [
    "system"
  ],
  "family": "shifting",
  "title": [
    "Rooftop solar to the evening window",
    "从屋顶光伏到傍晚义务时段"
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
      "id": "island",
      "asks": "system",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "flow": "idle",
        "soc": 0.3
      },
      "title": [
        "Backup must be inside the island",
        "备用必须建在孤岛之内"
      ],
      "text": [
        "The South West Interconnected System has no link to another grid. When supply is short, it cannot import its backup.",
        "西南互联系统与其他电网没有联络。供应不足时，无法从外部输入备用。"
      ],
      "sources": [
        "SRC-WA-01",
        "SRC-WA-16"
      ]
    },
    {
      "id": "midday",
      "asks": "constraint",
      "view": "system",
      "state": {
        "delivers": false,
        "time": "day",
        "solar": "on",
        "flow": "idle",
        "soc": 0.3
      },
      "title": [
        "Rooftops change the direction of power",
        "屋顶光伏改变电力流向"
      ],
      "text": [
        "The grid was built for large plants sending power outwards. Rooftop solar now sends power back from its edges, reducing midday demand on the grid.",
        "电网原为大型电厂向外送电而建。屋顶光伏如今从末端反向送电，降低电网的午间需求。"
      ],
      "sources": [
        "SRC-WA-02"
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
        "Charge while solar is abundant",
        "光伏充裕时充电"
      ],
      "text": [
        "Midday is a charging opportunity, not a right to free energy. Charging cost and access depend on the price and the battery’s connection.",
        "午间是充电机会，不代表有权免费取电。充电成本与能否充电，取决于电价及电池的并网条件。"
      ],
      "sources": [
        "SRC-WA-02",
        "SRC-WA-13"
      ]
    },
    {
      "id": "evening",
      "asks": "value",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.5
      },
      "title": [
        "The evening lasts beyond sunset",
        "傍晚需求延续至日落之后"
      ],
      "text": [
        "Demand stays high after sunset. The battery needs enough usable energy to hold its credited output across the capacity obligation window.",
        "日落之后需求仍然很高。电池需要足够的可用电量，才能在容量义务时段内持续维持获信用的出力。"
      ],
      "sources": [
        "SRC-WA-08",
        "SRC-WA-09"
      ]
    },
    {
      "id": "separate",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "soc": 0.4
      },
      "title": [
        "Energy and capacity pay for different things",
        "电能量与容量为不同事项付费"
      ],
      "text": [
        "Dispatched energy is paid through the energy market. Capacity Credits pay for availability across the required window; neither line gives the battery permission to promise the same capability twice.",
        "已调度电量通过电能量市场结算。容量信用为规定时段内的可用性付费；两条收入都不允许电池重复承诺同一份能力。"
      ],
      "sources": [
        "SRC-WA-09",
        "SRC-WA-12"
      ]
    }
  ]
};

const credits = contracted({
  "id": "wa-credits",
  "home": [
    "mechanism"
  ],
  "title": [
    "A Capacity Credit is not a fixed tariff",
    "容量信用不是固定电价"
  ],
  "gates": [
    [
      "Certified",
      "已认证"
    ],
    [
      "Credits assigned",
      "已分配信用"
    ],
    [
      "Available as required",
      "按要求可用"
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
        "Physical capability",
        "物理能力"
      ],
      "title": [
        "A capable battery comes first",
        "先有具备能力的电池"
      ],
      "text": [
        "Equipment and a grid connection make an operating asset. Capability alone does not earn Capacity Credits.",
        "设备与并网连接构成可运行的资产。仅有物理能力，并不能获得容量信用。"
      ],
      "sources": [
        "SRC-WA-05",
        "SRC-WA-09"
      ]
    },
    "accreditation": {
      "name": [
        "AEMO certification",
        "AEMO认证"
      ],
      "title": [
        "AEMO checks sustained output",
        "AEMO核定持续出力"
      ],
      "text": [
        "AEMO certifies the power the battery can sustain across the required window. A battery that cannot sustain its full power is credited as a smaller one.",
        "AEMO核定电池在规定时段内可持续提供的功率。不能持续维持满功率的电池，只能按较小规模计入信用。"
      ],
      "sources": [
        "SRC-WA-05",
        "SRC-WA-08",
        "SRC-WA-09"
      ]
    },
    "award": {
      "name": [
        "Capacity Credits assigned",
        "容量信用分配"
      ],
      "title": [
        "Certification must become assigned credits",
        "认证须落实为已分配信用"
      ],
      "text": [
        "The battery needs Capacity Credits assigned for a capacity year. Certification and credit assignment are distinct steps.",
        "电池需要获得某一容量年度的容量信用分配。认证与分配信用是两个不同步骤。"
      ],
      "sources": [
        "SRC-WA-03",
        "SRC-WA-09"
      ]
    },
    "obligation": {
      "name": [
        "Availability window",
        "可用性时段"
      ],
      "title": [
        "Credits bring an availability obligation",
        "信用附带可用性义务"
      ],
      "text": [
        "The credited battery must remain available across its required evening window. Trading and system services must fit around that obligation.",
        "获信用的电池须在规定的傍晚时段保持可用。交易与系统服务必须与该义务相容。"
      ],
      "sources": [
        "SRC-WA-08",
        "SRC-WA-09"
      ]
    },
    "performance": {
      "name": [
        "Availability and delivery",
        "可用性与交付"
      ],
      "title": [
        "Stored energy has to support the promise",
        "储存电量必须支撑承诺"
      ],
      "text": [
        "Usable energy and plant availability determine whether the battery can honour its credited power. AEMO measures capacity again as the battery ages.",
        "可用电量及电站可用性决定电池能否履行获信用功率的承诺。电池老化后，AEMO会重新核定容量。"
      ],
      "sources": [
        "SRC-WA-05",
        "SRC-WA-09"
      ]
    },
    "settlement": {
      "name": [
        "Annual capacity payment",
        "年度容量付费"
      ],
      "title": [
        "The price resets each year",
        "价格每年重设"
      ],
      "text": [
        "A credited battery is paid for availability, under the capacity rules. The capacity price is set each year and can fall when capacity is in surplus; a credit is not a long-term fixed-price contract.",
        "获信用的电池按容量规则因可用性获得付费。容量价格每年确定，容量过剩时可能下降；容量信用不是长期固定价格合同。"
      ],
      "sources": [
        "SRC-WA-09",
        "SRC-WA-14"
      ]
    }
  }
});

const services = {
  "id": "wa-services",
  "home": [
    "storage"
  ],
  "family": "frequency",
  "title": [
    "Fast response uses the remaining headroom",
    "快速响应使用剩余裕度"
  ],
  "gates": [
    [
      "Accredited",
      "已获资质"
    ],
    [
      "Enabled",
      "已启用"
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
      "id": "disturbance",
      "asks": "system",
      "view": "system",
      "state": {
        "signal": "frequency",
        "flow": "idle",
        "soc": 0.6
      },
      "title": [
        "A disturbance needs fast response",
        "扰动需要快速响应"
      ],
      "text": [
        "An isolated system needs resources that can respond to a disturbance as well as cover the evening. Essential System Services are separate from moving energy across the day.",
        "孤岛系统既需要覆盖傍晚需求，也需要能响应扰动的资源。基本系统服务与跨时段转移电能是不同业务。"
      ],
      "sources": [
        "SRC-WA-01",
        "SRC-WA-06"
      ]
    },
    {
      "id": "respond",
      "asks": "response",
      "view": "storage",
      "state": {
        "signal": "frequency",
        "flow": "discharge",
        "headroom": true,
        "soc": 0.6
      },
      "title": [
        "The battery holds power ready",
        "电池预留功率待命"
      ],
      "text": [
        "Fast response needs reserved power and enough stored energy to respond when called. That headroom cannot simultaneously be promised as energy.",
        "快速响应需要预留功率，并保留足够电量以在调用时响应。这份裕度不能同时承诺为电能量。"
      ],
      "sources": [
        "SRC-WA-06",
        "SRC-WA-09"
      ]
    },
    {
      "id": "conditions",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "signal": "frequency",
        "flow": "discharge",
        "headroom": true,
        "soc": 0.5
      },
      "title": [
        "Accreditation and enablement precede payment",
        "取得资质并被启用后才有付款路径"
      ],
      "text": [
        "The service route requires accreditation and enablement, with readiness and response governed by the product’s terms. Merely being able to respond is not an award.",
        "系统服务路径要求取得资质并被启用，待命与响应须遵守产品条款。仅仅能够响应，不等于已被选中提供服务。"
      ],
      "sources": [
        "SRC-WA-06",
        "SRC-WA-09"
      ]
    },
    {
      "id": "priority",
      "asks": "limit",
      "view": "storage",
      "state": {
        "time": "dusk",
        "solar": "off",
        "flow": "discharge",
        "headroom": true,
        "soc": 0.3
      },
      "title": [
        "The evening obligation still has to fit",
        "仍须满足傍晚义务"
      ],
      "text": [
        "Capacity availability, energy and system services are different obligations on the same plant. Only compatible use of the remaining power and energy can be stacked.",
        "容量可用性、电能量及系统服务，是同一电站承担的不同义务。只有对剩余功率与电量的兼容使用，才能叠加。"
      ],
      "sources": [
        "SRC-WA-06",
        "SRC-WA-09"
      ]
    }
  ]
};

export const SEQUENCES = [solar, credits, services];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
