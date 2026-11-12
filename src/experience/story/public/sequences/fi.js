/* FI: Release 4 explanations, restating the existing public research.
   Basis: fi-01 to fi-12; product qualification and the private floor remain separate.
   Sources belong to this market's public-content pool; no model values are held here.
   Scenario charge levels are schematic states, not dispatch or investment outputs. */
import { contracted } from './contracted.js';

const sequence0 = {
  "id": "fi-response",
  "family": "frequency",
  "title": [
    "Shared frequency, distinct reserve jobs",
    "共享频率，不同备用任务"
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
      "id": "system",
      "asks": "system",
      "view": "system",
      "state": {
        "flow": "idle",
        "signal": "frequency",
        "soc": 0.5
      },
      "title": [
        "Finland shares the Nordic frequency",
        "芬兰共享北欧频率"
      ],
      "text": [
        "Finland shares frequency with Sweden, Norway and eastern Denmark. A divergence between supply and demand calls for response across that synchronous system.",
        "芬兰与瑞典、挪威和丹麦东部共享频率。供需偏离时，这一同步系统需要响应。"
      ],
      "sources": [
        "SRC-FI-28",
        "SRC-FI-29"
      ]
    },
    {
      "id": "up",
      "asks": "response",
      "view": "storage",
      "state": {
        "flow": "discharge",
        "signal": "frequency",
        "headroom": true,
        "soc": 0.6
      },
      "title": [
        "Stored energy supports upward response",
        "已存电量支撑向上响应"
      ],
      "text": [
        "Discharging or reducing charging can help an upward response. Stored energy limits how long the battery can continue.",
        "放电或减少充电可帮助上调。已存电量限制电池能持续多久。"
      ],
      "sources": [
        "SRC-FI-08",
        "SRC-FI-11",
        "SRC-FI-14",
        "SRC-FI-17"
      ]
    },
    {
      "id": "down",
      "asks": "constraint",
      "view": "storage",
      "state": {
        "flow": "charge",
        "signal": "frequency",
        "headroom": true,
        "soc": 0.4
      },
      "title": [
        "Downward response needs room to charge",
        "向下响应需要可充空间"
      ],
      "text": [
        "Charging or reducing discharge can help downward response. Empty energy capacity and usable headroom are different from the battery’s nameplate power.",
        "充电或减少放电可帮助下调。剩余电量空间与可用功率余量不同于铭牌功率。"
      ],
      "sources": [
        "SRC-FI-11",
        "SRC-FI-14",
        "SRC-FI-17"
      ]
    },
    {
      "id": "products",
      "asks": "payer",
      "view": "mechanism",
      "state": {
        "flow": "idle",
        "headroom": true,
        "qualified": true,
        "awarded": true,
        "delivers": true,
        "soc": 0.5
      },
      "title": [
        "Each product buys its own response",
        "各品种购买自身要求的响应"
      ],
      "text": [
        "FFR arrests a rapid fall; FCR contains frequency deviations; aFRR and mFRR restore balance. Fingrid pays accepted capability under the relevant product’s obligations, not simply for owning a fast battery.",
        "FFR抑制快速下跌，FCR遏制频率偏差，aFRR与mFRR恢复平衡。Fingrid按相应品种义务为获接受能力付费，而非仅因拥有快速电池就付费。"
      ],
      "sources": [
        "SRC-FI-01",
        "SRC-FI-06",
        "SRC-FI-09",
        "SRC-FI-12",
        "SRC-FI-15"
      ]
    }
  ]
};

const sequence1 = {
  "id": "fi-competition",
  "family": "frequency",
  "title": [
    "Connected supply is not awarded reserve",
    "并网供给不是已中标备用"
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
      "id": "fleet",
      "asks": "system",
      "view": "system",
      "state": {
        "flow": "idle",
        "fleet": "crowded",
        "soc": 0.5
      },
      "title": [
        "More storage is potential competition",
        "更多储能代表潜在竞争"
      ],
      "text": [
        "The connected storage fleet has grown beyond the scale of the fast-reserve products described in the research. Connected power is potential supply, not a count of qualified bids.",
        "并网储能规模已超过研究所述快速备用品种规模。并网功率是潜在供给，不是合格报价数量。"
      ],
      "sources": [
        "SRC-FI-01",
        "SRC-FI-04",
        "SRC-FI-05"
      ]
    },
    {
      "id": "qualification",
      "asks": "constraint",
      "view": "storage",
      "state": {
        "flow": "idle",
        "qualified": false,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "Connection is only the physical route",
        "并网只是物理通道"
      ],
      "text": [
        "Reserve participation also requires current product approval, agreements and communications. Shared power and energy cannot be promised twice.",
        "参与备用还需现行品种批准、协议与通信。同一份功率和电量不能重复承诺。"
      ],
      "sources": [
        "SRC-FI-07",
        "SRC-FI-10",
        "SRC-FI-13",
        "SRC-FI-16"
      ]
    },
    {
      "id": "bidding",
      "asks": "value",
      "view": "mechanism",
      "state": {
        "flow": "idle",
        "qualified": true,
        "awarded": false,
        "soc": 0.5
      },
      "title": [
        "Hourly procurement offers a bidding route",
        "小时采购提供报价渠道"
      ],
      "text": [
        "Fingrid announced a shift to hourly domestic FCR procurement in 2027. A bidding opportunity is not an accepted award or a long-term floor.",
        "Fingrid宣布2027年国内FCR转向小时采购。报价机会不是实际中标，也不是长期保底。"
      ],
      "sources": [
        "SRC-FI-23"
      ]
    },
    {
      "id": "earnings",
      "asks": "limit",
      "view": "mechanism",
      "state": {
        "flow": "idle",
        "qualified": true,
        "awarded": true,
        "delivers": true,
        "soc": 0.5
      },
      "title": [
        "Auction prices do not reveal net earnings",
        "拍卖价格不能揭示净收益"
      ],
      "text": [
        "Earnings depend on what the battery wins and delivers, activation and costs. No annual purchase is not the same as a zero-price award, and a private optimiser floor remains a separate contract.",
        "收益取决于实际中标、履约、调用与成本。年度未采购不等于零价中标，私人优化商保底仍是另一份合同。"
      ],
      "sources": [
        "SRC-FI-10",
        "SRC-FI-22",
        "SRC-FI-32"
      ]
    }
  ]
};

const contract0 = contracted({
  "id": "fi-reserve-award",
  "home": [
    "mechanism"
  ],
  "title": [
    "A reserve award creates an obligation",
    "备用中标带来义务"
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
  "stages": {
    "availability": {
      "name": [
        "Physically ready",
        "物理上就绪"
      ],
      "title": [
        "Physically ready",
        "物理上就绪"
      ],
      "text": [
        "A connected battery can respond quickly, but connection alone gives no right to reserve income.",
        "已并网电池可以快速响应，但仅有并网条件不产生备用收入权利。"
      ],
      "sources": [
        "SRC-FI-07",
        "SRC-FI-10"
      ]
    },
    "accreditation": {
      "name": [
        "Product approval and communications",
        "品种批准与通信"
      ],
      "title": [
        "Product approval and communications",
        "品种批准与通信"
      ],
      "text": [
        "The specific product requires approval, agreements and tested communications. Enough energy and headroom must remain available.",
        "具体品种要求批准、协议与经过测试的通信，还须保留足够电量与功率余量。"
      ],
      "sources": [
        "SRC-FI-08",
        "SRC-FI-11",
        "SRC-FI-14",
        "SRC-FI-17"
      ]
    },
    "award": {
      "name": [
        "An accepted reserve bid",
        "获接受的备用报价"
      ],
      "title": [
        "An accepted reserve bid",
        "获接受的备用报价"
      ],
      "text": [
        "Fingrid buys accepted reserve capability. A qualified offer that is not accepted is not a paid capacity award.",
        "Fingrid采购获接受的备用能力。合格但未获接受的报价，不是付费容量中标。"
      ],
      "sources": [
        "SRC-FI-07",
        "SRC-FI-10",
        "SRC-FI-13",
        "SRC-FI-16"
      ]
    },
    "obligation": {
      "name": [
        "Keep the accepted capability ready",
        "保持获接受能力待命"
      ],
      "title": [
        "Keep the accepted capability ready",
        "保持获接受能力待命"
      ],
      "text": [
        "The award obliges the provider to maintain the accepted capability under its product rules. Other trading commitments cannot consume the same reserved headroom.",
        "中标要求供应方按品种规则维持获接受能力。其他交易承诺不能占用同一份已预留余量。"
      ],
      "sources": [
        "SRC-FI-10",
        "SRC-FI-13",
        "SRC-FI-16"
      ]
    },
    "performance": {
      "name": [
        "Respond under the product rules",
        "按品种规则响应"
      ],
      "title": [
        "Respond under the product rules",
        "按品种规则响应"
      ],
      "text": [
        "The battery must deliver the required response and preserve the energy needed for its obligation. Activation energy follows the relevant settlement rules.",
        "电池须交付所需响应，并保留履约所需电量。调用电量遵循相应结算规则。"
      ],
      "sources": [
        "SRC-FI-07",
        "SRC-FI-10",
        "SRC-FI-13",
        "SRC-FI-16"
      ]
    },
    "settlement": {
      "name": [
        "Capacity and energy settle separately",
        "容量与电量分别结算"
      ],
      "title": [
        "Capacity and energy settle separately",
        "容量与电量分别结算"
      ],
      "text": [
        "Fingrid pays accepted capability held ready. Activation energy and trading are separate; the reserve award is not a long-term revenue floor.",
        "Fingrid为获接受且保持待命的能力付费。调用电量与交易另行核算；备用中标不是长期收入保底。"
      ],
      "sources": [
        "SRC-FI-07",
        "SRC-FI-10",
        "SRC-FI-13",
        "SRC-FI-16"
      ]
    }
  }
});

export const SEQUENCES = [sequence0, sequence1, contract0];
export default { sequences: SEQUENCES, for: () => SEQUENCES };
