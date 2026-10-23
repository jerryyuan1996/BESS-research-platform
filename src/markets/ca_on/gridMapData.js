/* ---------------------------------------------------------------------------
   Ontario — interactive grid map.

   A THEMATIC MAP of the storage this market has contracted, not a network map.
   Markers are town or county centroids standing for each project — the closest
   town IESO's results table names, or the county an owner names — not
   substation positions. IESO's own map draws the IESO-controlled grid at
   115, 230 and 500 kV, over 30,000 km of line; none of it is drawn here.

   The three periods follow the market's own turning points: a uniform price
   before Market Renewal, locational prices and the first big batteries now,
   and the eight-hour LT2 fleet arriving from 2030.
   --------------------------------------------------------------------------- */
import { registerGridMap } from '../gridMapRegistry.js';
import boundary from './on-boundary.json' with { type: 'json' };

const URL = {
  results: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/capacity/LT2c-1-20260702-Public-Result-Table-With-Individual-Prices.pdf',
  neoen: 'https://neoen.com/en/news/2026/neoen-awarded-long-term-contract-for-new-200-mw-8-hour-battery-in-ontario-canada/',
  nrstor: 'https://nrstor.com/2026/08/11/nrstor-battery-storage-project-in-norfolk-county/',
  oneida: 'https://northlandpower.com/northland-power-announces-commercial-operations-at-oneida-energy-storage-project-canadas-largest-battery-storage-facility-delivered-ahead-of-schedule-and-below-budget/',
  opg: 'https://www.opg.com/news-resources/newsroom/release/opg-reports-2026-second-quarter-financial-results/',
  zonal: 'https://reports-public.ieso.ca/public/DAHourlyZonal/',
  iesoMap: 'https://www.ieso.ca/ontarioenergymap/',
  ne: 'https://github.com/nvkelso/natural-earth-vector',
};

const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1,
  label: true, ...extra,
});

const points = [
  point('oneida', ['Oneida — Haldimand County', 'Oneida — Haldimand县'], [-79.95, 42.93], 'generation',
    ['Operating storage, 4 h', '在运储能，4小时'], ['current', 'future'],
    ['250 MW / 1,000 MWh, in commercial operation since May 2025 on a 20-year IESO capacity contract; final cost about C$700m.',
     '250MW/1,000MWh，2025年5月起商业运行，签有IESO二十年容量合同；最终成本约7亿加元。'],
    ['The cost observation the capex seed is rebuilt from: C$2.8m/MW at four hours on 2023 battery prices, about C$2.43m/MW at eight hours on today\'s.',
     '资本开支种子值的重构依据：按2023年电池价格四小时每MW 280万加元，按当前价格八小时约每MW 243万加元。'],
    'Northland Power — Oneida commercial operations', URL.oneida,
    { operatingCapacity: ['250 MW / 1,000 MWh', '250MW/1,000MWh'] }),

  point('napanee', ['Napanee — Phase 1 and Phase 2', 'Napanee — 一期与二期'], [-76.77, 44.18], 'generation',
    ['Operating 4 h; contracted 8 h', '在运4小时；已签约8小时'], ['current', 'future'],
    ['Phase 1, up to 250 MW for four hours, entered service in April 2026 within its approved budget. Phase 2, 300 MW for up to eight hours, won LT2 window 1 at C$527.20/MW-Business Day — the lowest price — at the same generating-station site.',
     '一期最高250MW、四小时，于2026年4月在核定预算内投运。二期300MW、最长八小时，以每MW工作日527.20加元（最低价）中标LT2窗口1，位于同一电厂场址。'],
    ['A brownfield site in the zone with the widest spreads among the winners. That combination is what the cheapest bid looks like.',
     '位于中标项目中价差最宽区域的棕地场址。这一组合正是最低报价的成因。'],
    'OPG — 2026 second-quarter results', URL.opg,
    { operatingCapacity: ['Phase 1: up to 250 MW, 4 h', '一期：最高250MW，4小时'],
      plannedCapacity: ['Phase 2: 300 MW, up to 8 h, from 2029–30', '二期：300MW，最长8小时，2029–30年起'] }),

  point('eagle-lake', ['Eagle Lake Power Reserve — near Dryden', 'Eagle Lake储能 — Dryden附近'], [-92.97, 49.78], 'generation',
    ['Contracted storage, 8 h', '已签约储能，8小时'], ['future'],
    ['200 MW / 1,600 MWh about 15 km west of Dryden, 190 MW contracted at C$580.50; Neoen and Eagle Lake First Nation 50/50; in service 2030.',
     '200MW/1,600MWh，位于Dryden以西约15公里，签约190MW、价格580.50加元；Neoen与Eagle Lake原住民各占50%；2030年投运。'],
    ['The Northwest zone traded a spread 9.7% below the province over 2026\'s window. The capacity payment is unaffected; about 3% of total revenue is.',
     '2026年观测窗口内西北区交易价差比全省低9.7%。容量付款不受影响；约3%的总收入受影响。'],
    'Neoen — Eagle Lake award', URL.neoen,
    { plannedCapacity: ['200 MW / 1,600 MWh (190 MW contracted)', '200MW/1,600MWh（签约190MW）'] }),

  point('simcoe', ['Simcoe Battery Project — Norfolk County', 'Simcoe储能项目 — Norfolk县'], [-80.30, 42.84], 'generation',
    ['Contracted storage, 8 h', '已签约储能，8小时'], ['future'],
    ['150 MW / 1,200 MWh at C$614.47 — the highest window-1 price; Six Nations Group and the Mississaugas of the Credit hold 50%, with Aecon, Sitka Power and NRStor.',
     '150MW/1,200MWh，价格614.47加元 — 窗口1最高价；Six Nations Group与Mississaugas of the Credit持股50%，另有Aecon、Sitka Power与NRStor。'],
    ['Four of Oneida\'s owners — NRStor, Aecon, Six Nations and the Mississaugas of the Credit — own this one too, in the neighbouring county: the people behind the observed cost are building the next eight-hour plant.',
     'Oneida的四家业主 — NRStor、Aecon、Six Nations与Mississaugas of the Credit — 同样持有该项目，位于相邻县：观测成本背后的团队正在建设下一个八小时电站。'],
    'NRStor — Simcoe Battery Project', URL.nrstor,
    { plannedCapacity: ['150 MW / 1,200 MWh', '150MW/1,200MWh'] }),

  point('ozp', ['Ontario Zonal Price — the trading reference', '安大略分区电价 — 交易参照'], [-79.38, 43.65], 'node',
    ['Price reference', '价格参照'], ['current', 'future'],
    ['Day-ahead since 1 May 2025. Over 24 July – 23 October 2026 the daily eight-hour spread averaged C$325.63/MW; the nine zones ran from C$294 to C$339.',
     '自2025年5月1日起为日前价格。2026年7月24日至10月23日，每日八小时价差平均为每MW 325.63加元；九个分区介于294至339加元之间。'],
    ['The merchant seed is built on this price: C$74.8k/MW a year before fees, about a third of an eight-hour battery\'s revenue.',
     '市场化收入种子值基于此价格：每MW每年7.48万加元（扣费前），约占八小时储能收入的三分之一。'],
    'IESO — Day-Ahead Hourly Virtual Zonal Energy Price', URL.zonal),
];

const sourceCatalog = [
  { id: 'ca-on-map-results', owner: 'IESO', title: 'LT2(c-1) RFP final results with individual prices', url: URL.results, format: 'PDF', cadence: 'Per window', licence: 'IESO terms permit reuse', automation: 'C', checkedAt: '2026-10-23' },
  { id: 'ca-on-map-zonal', owner: 'IESO', title: 'Day-Ahead Hourly Virtual Zonal Energy Price report', url: URL.zonal, format: 'XML', cadence: 'Daily', licence: 'IESO terms permit reuse', automation: 'A', checkedAt: '2026-10-23' },
  { id: 'ca-on-map-ieso', owner: 'IESO', title: 'Ontario\'s Electricity System (map)', url: URL.iesoMap, format: 'HTML', cadence: 'As revised', licence: 'IESO terms permit reuse', automation: 'C', checkedAt: '2026-10-23' },
  { id: 'ca-on-map-oneida', owner: 'Northland Power', title: 'Oneida Energy Storage — commercial operations', url: URL.oneida, format: 'HTML', cadence: 'One-off', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-10-23' },
  { id: 'ca-on-map-opg', owner: 'OPG', title: '2026 second-quarter results — Napanee BESS', url: URL.opg, format: 'HTML', cadence: 'Quarterly', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-10-23' },
  { id: 'ca-on-map-neoen', owner: 'Neoen', title: 'Eagle Lake Power Reserve award', url: URL.neoen, format: 'HTML', cadence: 'One-off', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-10-23' },
  { id: 'ca-on-map-nrstor', owner: 'NRStor', title: 'Simcoe Battery Project', url: URL.nrstor, format: 'HTML', cadence: 'One-off', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-10-23' },
  { id: 'ca-on-map-boundary', owner: 'Natural Earth', title: 'Admin-1 states and provinces, 50m', url: URL.ne, format: 'GeoJSON', cadence: 'Periodic', licence: 'Public domain (Natural Earth)', automation: 'B', checkedAt: '2026-10-23' },
];

export const CA_ON_GRID_MAP = {
  id: 'ca_on-grid-map',
  ariaLabel: ['Interactive Ontario storage map', '安大略储能交互地图'],
  title: ['Ontario storage by period', '安大略不同时期储能布局'],
  defaultPeriod: 'current',
  defaultSelectedId: 'napanee',
  boundary,
  boundarySource: {
    label: ['Natural Earth 50m admin-1', 'Natural Earth 50m一级行政区'],
    url: URL.ne,
  },
  periodOrder: ['past', 'current', 'future'],
  periods: {
    past: {
      label: ['Past · 2024', '过去 · 2024'],
      kicker: ['One price for the province', '全省单一电价'],
      thesis: ['Before Market Renewal the real-time HOEP was one uniform price, and the eight-hour spread a battery could trade was C$70k/MW over 2024.',
               '电力市场改革前，实时HOEP为全省统一价格，2024年储能可交易的八小时价差为每MW 7.0万加元。'],
      implication: ['Location changed nothing about trading, and capacity came through bilateral IESO contracts.',
                    '区位不影响交易，容量通过IESO双边合同获取。'],
    },
    current: {
      label: ['Current · 2026', '当前 · 2026'],
      kicker: ['Locational prices and the first big batteries', '节点电价与首批大型储能'],
      thesis: ['A day-ahead market with locational prices since May 2025, two 250 MW four-hour plants operating, and LT2 window 1 awarded to three eight-hour batteries.',
               '自2025年5月起实行含节点电价的日前市场，两座250MW四小时电站在运，LT2窗口1授予三个八小时储能项目。'],
      implication: ['Spreads widened by about half on the same months of 2024, and location now moves trading by about a tenth.',
                    '与2024年同期相比价差扩大约一半，区位目前对交易收入的影响约为十分之一。'],
    },
    future: {
      label: ['Contracted · 2030–32', '已签约 · 2030–32'],
      kicker: ['The eight-hour fleet', '八小时储能机组'],
      thesis: ['640 MW of eight-hour storage from window 1 by 2030, and window 2 drafted for 2032.',
               '窗口1的640MW八小时储能将于2030年前投运，窗口2草案的投运日为2032年。'],
      implication: ['More eight-hour batteries flatten the evening peak they trade, so the merchant line is the part to watch, not the contract.',
                    '更多八小时储能将压平其所交易的晚高峰，因此应关注的是市场化收入，而非合同。'],
    },
  },
  layers: {
    node: { label: ['Prices and mechanisms', '价格与机制'] },
    generation: { label: ['Storage', '储能'] },
    load: { label: ['Demand centres', '负荷中心'] },
    route: { label: ['Network paths', '网络路径'] },
    plan: { label: ['Planned build', '规划建设'] },
  },
  points,
  routes: [],
  sourceCatalog,
  scope: [
    'A THEMATIC MAP of contracted storage, not a network map. Markers are town and county centroids, not substation positions, and show no spare capacity, queue position or investable connection. IESO\'s grid of 115, 230 and 500 kV lines is not drawn. The outline is the Province of Ontario, which is also the IESO\'s market.',
    '这是一张已签约储能的主题地图，而非电网结构图。标记为城镇及县的中心坐标，并非变电站位置，且不显示可用容量、队列位置或可投资并网权利。IESO的115、230与500kV电网未予绘制。底图轮廓为安大略省，亦即IESO的市场范围。',
  ],
};

registerGridMap(CA_ON_GRID_MAP, 'ca_on');

export default CA_ON_GRID_MAP;
