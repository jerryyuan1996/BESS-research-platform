/* Original research values, shared with data.js. No evaluated copy.
   Extracted verbatim from 247ce950c5c0db42fbe6125c7adb44eef6c8f552:src/markets/fi/data.js. */

export const HISTORY_DATA={asOf:'2026-10-30',
dataDate:'2026 obligation period; FCR yearly market for delivery year 2026',
modelVersion:'fi-2.1-fingrid-fees',
timeline:[
    { y: '2022–2023', t: ['Adequacy solved by nuclear', '核电解决充裕度'],
      p: ['Olkiluoto 3 entered service and the strategic reserve has held nothing since July 2022.', 'Olkiluoto 3投运，战略备用自2022年7月起未持有任何容量。'],
      i: ['Finland pays for flexibility, not for firm capacity.', '芬兰为灵活性付费，而非为确定性容量付费。'] },
    { y: '2023', t: ['The reserve boom', '备用收入高峰'],
      p: ['FCR-N reserved at about €47/MW,h; a one-hour battery earned about €645k/MW a year at the September 2023 peak of Clean Horizon’s index.', 'FCR-N预留价约47欧元/MW,h；Clean Horizon指数显示2023年9月高峰时1小时储能年收入约64.5万欧元/MW。'],
      i: ['The returns that drew 30,000 MW of connection requests.', '正是这一回报吸引了30,000MW的并网申请。'] },
    { y: '2024–2025', t: ['Cannibalisation', '同质化竞争'],
      p: ['FCR-N fell from €46/MW,h in 2024 to €19 by June 2025 as batteries filled it; wind passed 9,400 MW; the price record reached −500 €/MWh. The market went to fifteen minutes in stages — the aFRR energy market in June 2024, the mFRR energy market on 4 March 2025, the imbalance price on 19 March, day-ahead on 1 October — and Finland joined PICASSO, the European aFRR energy platform, on 26 March 2025.', 'FCR-N由2024年的46欧元/MW,h降至2025年6月的19欧元；风电装机超过9,400MW；价格记录触及−500欧元/MWh。市场分阶段转为15分钟 — 2024年6月aFRR能量市场、2025年3月4日mFRR能量市场、3月19日不平衡电价、10月1日日前市场 — 芬兰于2025年3月26日加入欧洲aFRR能量平台PICASSO。'],
      i: ['Revenue moves from reserves to trading.', '收入来源由备用转向交易。'] },
    { y: '2026', t: ['Saturation, and the deals continue', '饱和，但交易仍在继续'],
      p: ['FCR-N’s annual auction cleared at zero; connected storage passed 1,050 MW in February against about 795 MW of fast-reserve need; Clean Horizon’s two-hour index stood at about €78k/MW a year in August. Foresight, Nala and Prime Capital bought projects anyway.', 'FCR-N年度拍卖以零出清；2月已并网储能超过1,050MW，而快速备用需求约795MW；8月Clean Horizon两小时指数约为每MW每年7.8万欧元。Foresight、Nala与Prime Capital依然收购了项目。'],
      i: ['Buyers are pricing trading and floors, not reserves.', '买方定价依据的是交易与保底，而非备用。'] },
    /* ADDED 2026-10-30, from Fingrid's releases of 2 and 8 September 2026. */
    { y: '2027', t: ['Reserves go hourly; MARI slips', '备用转为小时级；MARI推迟'],
      p: ['Fingrid buys no FCR in a yearly market for 2027: the yearly annexes expire on 31 December 2026 and FCR is bought hour by hour, with hourly volumes expected to rise significantly. The Nordic move to MARI, the European mFRR energy platform, slipped from Q1 2027 to most likely September–October 2027.', 'Fingrid 2027年不再通过年度市场采购FCR：年度协议于2026年12月31日到期，FCR改为逐小时采购，预计小时级容量将大幅增加。北欧接入欧洲mFRR能量平台MARI的时间由2027年第一季度推迟至最可能的2027年9–10月。'],
      i: ['The one fixed-price reserve market the reserve line is read from closes before a 2028 battery runs.', '备用收入所依据的唯一固定价格备用市场，将在2028年投运的储能运行前关闭。'] },
    { y: '2029', t: ['Southern connections reopen', '南部并网重新开放'],
      p: ['Fingrid’s restriction on new storage connections in southern Finland runs until the Hikiä–Toivila reinforcement completes.', 'Fingrid对芬兰南部新增储能并网的限制持续至Hikiä–Toivila加强工程完工。'],
      i: ['Until then, a southern connection is the scarce asset.', '在此之前，南部并网容量是稀缺资产。'] },
  ]};


