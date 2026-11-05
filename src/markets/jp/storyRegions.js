/* Exact regional copy from the signed storyboard; no model or supplier text. */
export const REGIONAL_SENTENCES = {
  "jp_tokyo": [
    "In Tokyo, what is left after the clawback is price capture in the largest demand area and the quality of a connection others queue for.",
    "在东京，扣除上缴后剩下的，是全国最大负荷区的价格兑现能力，以及他人仍在排队等待的并网条件。"
  ],
  "jp_kyushu": [
    "In Kyushu, it is whether the battery can charge in curtailed hours and how much room remains to export.",
    "在九州，关键在于电池能否在弃电时段充电，以及外送还剩多少空间。"
  ],
  "jp_hokkaido": [
    "In Hokkaido, it is headroom to charge, limits on charging at connection, and the link to Honshu.",
    "在北海道，关键在于充电裕度、并网时附带的充电限制，以及与本州的联络线。"
  ]
};
export const REGIONAL_SHOTS = {
  "tokyo": {
    "jp-tokyo-07": {
      "id": "jp-tokyo-07",
      "chapter": "tensions",
      "scene": "jp-tokyo-07",
      "question": [
        "What makes Tokyo different?",
        "东京有什么不同？"
      ],
      "copy": [
        "Tokyo is Japan's largest demand area, on the eastern frequency, joined to the west through converters that are being expanded by {converterYear}. The supply crunches of {earthquakeYear} and {supplyCrunchYear} both hit this area. Getting a new battery connected is the bottleneck: since {studyCapDate}, one applicant may have only {studyCap} connection studies open at a time.",
        "东京是日本最大的负荷区，位于东部频率区，经由变频站与西部相连，变频站正在扩容，预计于{converterYear}完成。{earthquakeYear}年和{supplyCrunchYear}年的两次供电紧张都冲击了这一区域。新电池并网是瓶颈：自{studyCapDate}起，每个申请人同时只能进行{studyCap}项并网研究。"
      ],
      "meaning": [
        "An operating Tokyo battery already holds a connection that new entrants queue for. Its edge after the clawback is where it sits, not a larger award.",
        "已投运的东京电池已经拥有新进入者仍在排队等待的并网条件。扣除上缴后，它的优势在于所处的位置，而不是更高的中标价格。"
      ],
      "controls": [
        [
          "Today",
          "当前"
        ],
        [
          "After the converter expansion",
          "变频站扩容后"
        ],
        [
          "Connection queue",
          "并网排队"
        ]
      ],
      "labels": {
        "area": [
          "Tokyo area",
          "东京区域"
        ],
        "converters": [
          "Converters to the west",
          "通往西部的变频站"
        ],
        "planned": [
          "Planned (dashed)",
          "规划中（虚线）"
        ],
        "studies": [
          "Connection studies per applicant",
          "每个申请人的并网研究数"
        ]
      },
      "claims": [
        "CL-JP-29",
        "CL-JP-02",
        "CL-JP-24"
      ],
      "marker": {
        "level": "fair",
        "change": [
          "a Tokyo area-price capture backtest, and OCCTO's current converter rating reopened at its source.",
          "东京区域价格兑现的回测，以及在原始出处重新核实的OCCTO变频站现行额定容量。"
        ]
      }
    },
    "jp-tokyo-10": {
      "id": "jp-tokyo-10",
      "chapter": "battery",
      "scene": "jp-tokyo-10",
      "question": [
        "What does a Tokyo battery do inside the award?",
        "东京电池在中标合同之内做什么？"
      ],
      "copy": [
        "Inside the award, a Tokyo battery still trades. It charges when the area price is low, discharges into the evening peak, and can offer balancing services. It keeps only a small share of that margin. Tokyo's network company publishes its connection deposit and payment terms for batteries, so a buyer can check what the holder has paid and still owes.",
        "在中标合同之内，东京电池仍可交易：在区域电价低时充电，在晚高峰放电，并可提供调节服务。但它只能留下这部分利润中很小的一份。东京的电网公司公开了电池并网的保证金和付款条款，买方可以核查持有人已付和尚欠的款项。"
      ],
      "meaning": [
        "Better price capture moves the return only a little after the clawback. Connection terms already settled are part of what a buyer pays for.",
        "扣除上缴后，更好的价格兑现对回报的影响很小。已经落定的并网条件，是买方所付价格的一部分。"
      ],
      "controls": [
        [
          "Weekday (Example)",
          "工作日（示例）"
        ],
        [
          "Holiday (Example)",
          "节假日（示例）"
        ]
      ],
      "labels": {
        "charge": [
          "Charge",
          "充电"
        ],
        "discharge": [
          "Discharge",
          "放电"
        ],
        "balancing": [
          "Balancing",
          "调节服务"
        ],
        "returned": [
          "Returned",
          "上缴"
        ],
        "kept": [
          "Kept",
          "留存"
        ],
        "connection": [
          "Connection terms settled",
          "并网条款已落定"
        ]
      },
      "claims": [
        "CL-JP-08",
        "CL-JP-24",
        "CL-JP-25"
      ],
      "marker": {
        "level": "fair",
        "change": [
          "a Tokyo area-price capture backtest and the holder's connection contract.",
          "东京区域价格兑现的回测，以及持有人的并网合同。"
        ]
      }
    },
    "jp-tokyo-13": {
      "id": "jp-tokyo-13",
      "chapter": "investment",
      "scene": "jp-tokyo-13",
      "question": [
        "What could weaken the Tokyo call, and where do I check it?",
        "什么会削弱东京的判断？在哪里核查？"
      ],
      "copy": [
        "A seller asking more than the purchase ceiling. {nextRound} results that let new builds clear at a fund's yields. Fade faster than the holder declared. More converter and interconnector capacity narrowing Tokyo's price premium. Connection terms still owed that the price did not allow for.",
        "卖方要价高于收购上限；{nextRound}结果显示新建项目可按基金收益率出清；衰减快于持有人的申报；变频站和联络线扩容收窄东京的价格溢价；收购价格未考虑到的尚欠并网款项。"
      ],
      "meaning": [
        "Each item is checked on the market page: price in the Bankable case, trading in Revenue, connection in Execution, and the rest in Downside.",
        "每一项都可在市场页面核查：价格见“可融资方案”，交易见“收益拆解”，并网见“执行步骤”，其余见“下行风险”。"
      ],
      "controls": [
        [
          "Bankable case",
          "可融资方案"
        ],
        [
          "Revenue",
          "收益拆解"
        ],
        [
          "Execution",
          "执行步骤"
        ],
        [
          "Downside",
          "下行风险"
        ]
      ],
      "labels": {},
      "claims": [
        "CL-JP-09",
        "CL-JP-14",
        "CL-JP-25",
        "CL-JP-02",
        "CL-JP-24"
      ],
      "marker": {
        "level": "fair",
        "change": [
          "the {nextRound} results and an observed sale of a Tokyo award holder.",
          "{nextRound}结果，以及东京中标资产的实际成交。"
        ]
      },
      "links": [
        {
          "label": [
            "Bankable case",
            "可融资方案"
          ],
          "href": "/markets/japan-tokyo#bankable"
        },
        {
          "label": [
            "Revenue",
            "收益拆解"
          ],
          "href": "/markets/japan-tokyo#revenue"
        },
        {
          "label": [
            "Execution",
            "执行步骤"
          ],
          "href": "/markets/japan-tokyo#execution"
        },
        {
          "label": [
            "Downside",
            "下行风险"
          ],
          "href": "/markets/japan-tokyo#downside"
        }
      ],
      "extra": {
        "exits": [
          {
            "label": [
              "Bankable case",
              "可融资方案"
            ],
            "href": "/markets/japan-tokyo#bankable",
            "anchor": "bankable"
          },
          {
            "label": [
              "Revenue",
              "收益拆解"
            ],
            "href": "/markets/japan-tokyo#revenue",
            "anchor": "revenue"
          },
          {
            "label": [
              "Execution",
              "执行步骤"
            ],
            "href": "/markets/japan-tokyo#execution",
            "anchor": "execution"
          },
          {
            "label": [
              "Downside",
              "下行风险"
            ],
            "href": "/markets/japan-tokyo#downside",
            "anchor": "downside"
          }
        ]
      }
    }
  },
  "kyushu": {
    "jp-kyushu-07": {
      "id": "jp-kyushu-07",
      "chapter": "tensions",
      "scene": "jp-kyushu-07",
      "question": [
        "What makes Kyushu different?",
        "九州有什么不同？"
      ],
      "copy": [
        "Solar spread fast across Kyushu after the feed-in tariff began in {fitDate}. By {suspensionDate} the utility had paused its replies to new connection applications on the mainland, and on {firstCurtailmentDate} it curtailed renewable output there for the first time. Surplus leaves for Honshu through one interconnection; a transfer-trip system in service since {transferTripDate} lets more of it out.",
        "{fitDate}固定电价制度实施后，光伏在九州迅速普及。到{suspensionDate}，电力公司已暂停答复本土新的并网申请；{firstCurtailmentDate}，九州本土首次对新能源实施出力控制。富余电力只能经由一条联络线送往本州；自{transferTripDate}起投运的转送遮断系统，让更多电力得以送出。"
      ],
      "meaning": [
        "Curtailment shows the system has power to spare at noon. It is not free energy for a battery, and every gain in export shrinks it.",
        "弃电说明系统在中午有富余电力。但这并不是电池的免费能量，外送能力每提高一分，弃电就减少一分。"
      ],
      "controls": [
        [
          "Feed-in tariff",
          "固定电价制度"
        ],
        [
          "Applications paused",
          "暂停受理答复"
        ],
        [
          "First curtailment",
          "首次弃电"
        ],
        [
          "Since the transfer-trip system",
          "转送遮断系统投运后"
        ]
      ],
      "labels": {
        "surplus": [
          "Solar surplus",
          "光伏富余"
        ],
        "curtailed": [
          "Curtailed",
          "被弃电"
        ],
        "link": [
          "Interconnection to Honshu",
          "通往本州的联络线"
        ],
        "transfer": [
          "Transfer-trip system",
          "转送遮断系统"
        ]
      },
      "claims": [
        "CL-JP-19",
        "CL-JP-20"
      ],
      "marker": {
        "level": "strong",
        "change": [
          "OCCTO's record of curtailment after the transfer-trip system, compared with the years before it.",
          "转送遮断系统投运后OCCTO的弃电记录，与此前年份的对比。"
        ]
      }
    },
    "jp-kyushu-10": {
      "id": "jp-kyushu-10",
      "chapter": "battery",
      "scene": "jp-kyushu-10",
      "question": [
        "What does a Kyushu battery do inside the award?",
        "九州电池在中标合同之内做什么？"
      ],
      "copy": [
        "A Kyushu battery can charge while solar is being curtailed, if its connection lets it draw power then, and sell when the evening price returns. The award takes back most of that margin, so cheap charging adds little to the holder's return. What matters more is that the battery can always charge enough to hold the floor.",
        "九州电池可以在光伏被弃电时充电，前提是其并网条件允许在这些时段取电，然后在晚间电价回升时售电。中标合同会收回这部分利润的大半，因此廉价充电对持有人回报的提升有限。更重要的是，电池始终能充入足够的电量以守住最低时长。"
      ],
      "meaning": [
        "Charging access in surplus hours protects performance under the award. It is not a source of large extra profit.",
        "在富余时段的充电权利，保障的是中标合同下的履约，而不是大额额外利润的来源。"
      ],
      "controls": [
        [
          "Charging allowed",
          "允许充电"
        ],
        [
          "Charging restricted",
          "充电受限"
        ]
      ],
      "labels": {
        "curtailed": [
          "Curtailed solar",
          "被弃电的光伏"
        ],
        "charging": [
          "Charging",
          "充电"
        ],
        "evening": [
          "Evening discharge",
          "晚间放电"
        ],
        "returned": [
          "Returned",
          "上缴"
        ],
        "kept": [
          "Kept",
          "留存"
        ],
        "monthlyDays": [
          "Output-control days by month (observed)",
          "按月出力控制天数（实测）"
        ]
      },
      "claims": [
        "CL-JP-19",
        "CL-JP-20",
        "CL-JP-08"
      ],
      "marker": {
        "level": "fair",
        "change": [
          "Kyushu's daily curtailment record matched to charging windows, and the holder's charging terms.",
          "与充电时段匹配的九州每日弃电记录，以及持有人的充电条款。"
        ]
      }
    },
    "jp-kyushu-13": {
      "id": "jp-kyushu-13",
      "chapter": "investment",
      "scene": "jp-kyushu-13",
      "question": [
        "What could weaken the Kyushu call, and where do I check it?",
        "什么会削弱九州的判断？在哪里核查？"
      ],
      "copy": [
        "A seller asking more than the purchase ceiling. {nextRound} results that let new builds clear at a fund's yields. Fade faster than the holder declared. More export capacity and more batteries chasing the same noon hours, so curtailment shrinks. Charging terms that do not allow the battery to draw power when surplus occurs.",
        "卖方要价高于收购上限；{nextRound}结果显示新建项目可按基金收益率出清；衰减快于持有人的申报；外送能力提高、争抢同一午间时段的电池增多，弃电随之减少；充电条款不允许电池在富余时段取电。"
      ],
      "meaning": [
        "Each item is checked on the market page: price in the Bankable case, trading in Revenue, connection in Execution, and the rest in Downside.",
        "每一项都可在市场页面核查：价格见“可融资方案”，交易见“收益拆解”，并网见“执行步骤”，其余见“下行风险”。"
      ],
      "controls": [
        [
          "Bankable case",
          "可融资方案"
        ],
        [
          "Revenue",
          "收益拆解"
        ],
        [
          "Execution",
          "执行步骤"
        ],
        [
          "Downside",
          "下行风险"
        ]
      ],
      "labels": {},
      "claims": [
        "CL-JP-09",
        "CL-JP-14",
        "CL-JP-25",
        "CL-JP-19",
        "CL-JP-20"
      ],
      "marker": {
        "level": "fair",
        "change": [
          "the {nextRound} results and an observed sale of a Kyushu award holder.",
          "{nextRound}结果，以及九州中标资产的实际成交。"
        ]
      },
      "links": [
        {
          "label": [
            "Bankable case",
            "可融资方案"
          ],
          "href": "/markets/japan-kyushu#bankable"
        },
        {
          "label": [
            "Revenue",
            "收益拆解"
          ],
          "href": "/markets/japan-kyushu#revenue"
        },
        {
          "label": [
            "Execution",
            "执行步骤"
          ],
          "href": "/markets/japan-kyushu#execution"
        },
        {
          "label": [
            "Downside",
            "下行风险"
          ],
          "href": "/markets/japan-kyushu#downside"
        }
      ],
      "extra": {
        "exits": [
          {
            "label": [
              "Bankable case",
              "可融资方案"
            ],
            "href": "/markets/japan-kyushu#bankable",
            "anchor": "bankable"
          },
          {
            "label": [
              "Revenue",
              "收益拆解"
            ],
            "href": "/markets/japan-kyushu#revenue",
            "anchor": "revenue"
          },
          {
            "label": [
              "Execution",
              "执行步骤"
            ],
            "href": "/markets/japan-kyushu#execution",
            "anchor": "execution"
          },
          {
            "label": [
              "Downside",
              "下行风险"
            ],
            "href": "/markets/japan-kyushu#downside",
            "anchor": "downside"
          }
        ]
      }
    }
  },
  "hokkaido": {
    "jp-hokkaido-07": {
      "id": "jp-hokkaido-07",
      "chapter": "tensions",
      "scene": "jp-hokkaido-07",
      "question": [
        "What makes Hokkaido different?",
        "北海道有什么不同？"
      ],
      "copy": [
        "Hokkaido is a small system with strong wind, joined to Honshu by direct-current links under the strait. On {blackoutDate} an earthquake set off a blackout of the whole area, a first for Japan. A new link followed in {newKitahonYear}, and more capacity is being added by {linkYear}. A battery that wants to connect early must accept a device that limits its charging, on {chargingControlSystems} listed parts of the network.",
        "北海道是一个风资源丰富的小型电力系统，通过海峡下的直流联络线与本州相连。{blackoutDate}，一场地震引发全区域大停电，在日本尚属首次。此后于{newKitahonYear}年新增一条联络线，{linkYear}前还将继续扩容。希望提前并网的电池，在{chargingControlSystems}个指定电网系统中必须接受限制其充电的装置。"
      ],
      "meaning": [
        "Room to charge and to export is the scarce input here. A holder whose connection limits charging may struggle to hold the award's floor.",
        "在这里，充电和外送的空间是稀缺资源。并网条件限制充电的持有人，可能难以守住中标合同的最低时长。"
      ],
      "controls": [
        [
          "{blackoutMonth}",
          "{blackoutMonth}"
        ],
        [
          "After the new link",
          "新联络线投运后"
        ],
        [
          "Charging-control connections",
          "充电控制并网"
        ]
      ],
      "labels": {
        "links": [
          "Links to Honshu",
          "通往本州的联络线"
        ],
        "planned": [
          "Planned (dashed)",
          "规划中（虚线）"
        ],
        "controlled": [
          "Charging-control connection (schematic)",
          "充电控制并网（示意）"
        ],
        "blackout": [
          "Whole-area blackout",
          "全区域停电"
        ]
      },
      "claims": [
        "CL-JP-21",
        "CL-JP-22",
        "CL-JP-23"
      ],
      "marker": {
        "level": "fair",
        "change": [
          "HEPCO Network's charging-control terms, and the commissioning of the link expansion.",
          "北海道电力网络的充电控制条款，以及联络线扩容的投运情况。"
        ]
      }
    },
    "jp-hokkaido-10": {
      "id": "jp-hokkaido-10",
      "chapter": "battery",
      "scene": "jp-hokkaido-10",
      "question": [
        "What does a Hokkaido battery do inside the award?",
        "北海道电池在中标合同之内做什么？"
      ],
      "copy": [
        "A Hokkaido battery connected early may have its charging limited by the network until reinforcement is built. OCCTO treats such limits, like fade, as risks the declared capacity must already allow for, so a holder that declared too much faces penalties every year. The link to Honshu is being expanded, which eases export over time.",
        "提前并网的北海道电池，在电网加固完成之前，其充电可能受到电网限制。OCCTO将这类限制与衰减一样，视为申报容量必须事先考虑的风险，因此申报过高的持有人每年都会面临处罚。通往本州的联络线正在扩容，外送压力会随时间缓解。"
      ],
      "meaning": [
        "Before buying a Hokkaido holder, check its charging limits against the hours the award requires. This is the highest connection risk of the three areas.",
        "收购北海道的中标资产之前，先核对其充电限制与中标合同要求的时长。这是三个区域中并网风险最高的。"
      ],
      "controls": [
        [
          "Firm connection",
          "常规并网"
        ],
        [
          "Charging-control connection",
          "充电控制并网"
        ]
      ],
      "labels": {
        "firm": [
          "Firm charging hours",
          "可确定的充电时段"
        ],
        "restricted": [
          "Hours the network may restrict (Example)",
          "电网可能限制的时段（示例）"
        ],
        "floor": [
          "Floor",
          "最低时长"
        ],
        "link": [
          "Link expansion (dashed)",
          "联络线扩容（虚线）"
        ]
      },
      "claims": [
        "CL-JP-07",
        "CL-JP-21",
        "CL-JP-22"
      ],
      "marker": {
        "level": "fair",
        "change": [
          "HEPCO Network's charging-control conditions and the holder's declared capacity.",
          "北海道电力网络的充电控制条件，以及持有人的申报容量。"
        ]
      }
    },
    "jp-hokkaido-13": {
      "id": "jp-hokkaido-13",
      "chapter": "investment",
      "scene": "jp-hokkaido-13",
      "question": [
        "What could weaken the Hokkaido call, and where do I check it?",
        "什么会削弱北海道的判断？在哪里核查？"
      ],
      "copy": [
        "A seller asking more than the purchase ceiling. {nextRound} results that let new builds clear at a fund's yields. Fade faster than the holder declared. Charging limits that outlast commissioning and cut into the hours the award requires. A delay to the reinforcement, or a second project competing for the same headroom.",
        "卖方要价高于收购上限；{nextRound}结果显示新建项目可按基金收益率出清；衰减快于持有人的申报；充电限制在投运后仍然存在，并侵蚀中标合同要求的时长；电网加固推迟，或另一个项目争夺同一份裕度。"
      ],
      "meaning": [
        "Each item is checked on the market page: price in the Bankable case, trading in Revenue, connection in Execution, and the rest in Downside.",
        "每一项都可在市场页面核查：价格见“可融资方案”，交易见“收益拆解”，并网见“执行步骤”，其余见“下行风险”。"
      ],
      "controls": [
        [
          "Bankable case",
          "可融资方案"
        ],
        [
          "Revenue",
          "收益拆解"
        ],
        [
          "Execution",
          "执行步骤"
        ],
        [
          "Downside",
          "下行风险"
        ]
      ],
      "labels": {},
      "claims": [
        "CL-JP-09",
        "CL-JP-14",
        "CL-JP-25",
        "CL-JP-07",
        "CL-JP-21",
        "CL-JP-22"
      ],
      "marker": {
        "level": "fair",
        "change": [
          "HEPCO Network's charging-control conditions and an observed sale of a Hokkaido award holder.",
          "北海道电力网络的充电控制条件，以及北海道中标资产的实际成交。"
        ]
      },
      "links": [
        {
          "label": [
            "Bankable case",
            "可融资方案"
          ],
          "href": "/markets/japan-hokkaido#bankable"
        },
        {
          "label": [
            "Revenue",
            "收益拆解"
          ],
          "href": "/markets/japan-hokkaido#revenue"
        },
        {
          "label": [
            "Execution",
            "执行步骤"
          ],
          "href": "/markets/japan-hokkaido#execution"
        },
        {
          "label": [
            "Downside",
            "下行风险"
          ],
          "href": "/markets/japan-hokkaido#downside"
        }
      ],
      "extra": {
        "exits": [
          {
            "label": [
              "Bankable case",
              "可融资方案"
            ],
            "href": "/markets/japan-hokkaido#bankable",
            "anchor": "bankable"
          },
          {
            "label": [
              "Revenue",
              "收益拆解"
            ],
            "href": "/markets/japan-hokkaido#revenue",
            "anchor": "revenue"
          },
          {
            "label": [
              "Execution",
              "执行步骤"
            ],
            "href": "/markets/japan-hokkaido#execution",
            "anchor": "execution"
          },
          {
            "label": [
              "Downside",
              "下行风险"
            ],
            "href": "/markets/japan-hokkaido#downside",
            "anchor": "downside"
          }
        ]
      }
    }
  }
};
