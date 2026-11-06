/* Original research values, shared with data.js. No evaluated copy.
   Extracted verbatim from 247ce950c5c0db42fbe6125c7adb44eef6c8f552:src/markets/es/data.js. */

export const HISTORY_DATA={asOf:'2026-10-29',
dataDate:'OMIE day-ahead prices 1 Jan 2023 – 29 Oct 2026; Order TED/966/2026',
modelVersion:'es-1.0-omie-merchant',
timeline:[
    { y: '2023', t: ['Spreads before batteries', '储能出现前的价差'],
      p: ['Mean day-ahead price €87/MWh; a four-hour battery would have earned €76.5k/MW on it. Spain\'s storage was pumped hydro, 3.3 GW; batteries were negligible (28 MW as late as April 2025).', '日前均价€87/MWh；四小时储能可得每MW 7.65万欧元。西班牙的储能以3.3GW抽水蓄能为主，电池可忽略不计（直至2025年4月仅28MW）。'],
      i: ['A solar market with almost no storage.', '几乎没有储能的光伏市场。'] },
    { y: '2025', t: ['Solar troughs and the blackout', '光伏低谷与大停电'],
      p: ['April and May averaged €27 and €17/MWh as midday solar flooded the market; the 28 April blackout sent balancing costs to a record. The four-hour value rose 45% to €111.3k/MW while the mean price fell. PINALM awarded €818m for 2.2 GW / 9.4 GWh on 30 December.', '4月与5月日前均价分别为€27与€17/MWh，午间光伏充斥市场；4月28日大停电使平衡服务成本创历史新高。四小时价值上升45%至每MW 11.13万欧元，而均价下降。12月30日PINALM以8.18亿欧元资助2.2GW/9.4GWh。'],
      i: ['Spreads widen as prices fall.', '电价下跌而价差扩大。'] },
    { y: '2026', t: ['A capacity market and an autumn spike', '容量市场与秋季价格飙升'],
      p: ['The Commission approved a capacity mechanism on 29 May; Order TED/966/2026 created it on 15 September. Batteries reached 193 MW in April. From August, prices rose to €118–162/MWh and the four-hour value to about €700/MW a day.', '欧盟委员会于5月29日批准容量机制；9月15日TED/966/2026号令正式设立。4月电池达193MW。自8月起电价升至€118–162/MWh，四小时价值约每MW每日€700。'],
      i: ['The upside arrives before the build does.', '上行空间先于建设到来。'] },
    { y: '2027–29', t: ['The first auctions and the grant fleet', '首批拍卖与受资助机组'],
      p: ['The first capacity auction is expected in Q1 2027; PINALM projects must be built by the end of 2029. On the fleet path the four-hour value is 7% lower by 2028 and 13% by 2030.', '首次容量拍卖预计于2027年一季度举行；PINALM项目须于2029年底前建成。按机组路径，四小时价值到2028年下降7%，到2030年下降13%。'],
      i: ['The entry point: a 2028 COD.', '进入点：2028年投运。'] },
  ]};


