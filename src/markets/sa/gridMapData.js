/* ---------------------------------------------------------------------------
   Saudi Arabia — interactive grid map.

   A THEMATIC MAP of what SPPC has procured. SPPC names each site and its
   region, not its coordinates, and the site towns were not located from a
   source, so each marker stands at its REGION'S CAPITAL and carries the
   region's sites — never a site position. National Grid SA's 380 kV backbone
   is not drawn.
   --------------------------------------------------------------------------- */
import { registerGridMap } from '../gridMapRegistry.js';
import boundary from './sa-boundary.json' with { type: 'json' };

const URL = {
  group1: 'https://www.pv-magazine.com/2026/08/25/saudi-arabia-awards-1-16-billion-for-8-gwh-of-battery-storage/',
  group2: 'https://www.ess-news.com/2026/07/03/saudi-arabia-qualifies-27-companies-for-second-bess-tender/',
  acwa: 'https://www.zawya.com/en/sponsored-content/saudi-energy-acwa-sign-contracts-for-3-bess-projects-in-saudi-arabia-465213',
  engie: 'https://www.saudigulfprojects.com/2026/08/engie-and-haji-abdullah-alireza-sign-agreement-for-500-mw-al-khushaybi-battery-storage-project-in-saudi-arabia/',
  grid: 'https://reglobal.org/transmission-ties-saudi-arabias-regional-connections/',
  ne: 'https://github.com/topojson/world-atlas',
};

const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1,
  label: true, ...extra,
});

const points = [
  point('makkah', ['Makkah province — five sites', '麦加省 — 五个场址'], [39.83, 21.42], 'generation',
    ['Contracted and tendered storage, 4 h', '已签约与招标中储能，4小时'], ['current', 'future'],
    ['Group 1: Al Muwayh and Haden, 500 MW / 2,000 MWh each, to Saudi Energy, ACWA Power and Al Sharif. Group 2: Al-Leeth, Khulais and Ashyrah, 500 MW each. Marker at Makkah, not at the sites.',
     '第一组：Al Muwayh与Haden，各500MW/2,000MWh，归Saudi Energy、ACWA Power与Al Sharif。第二组：Al-Leeth、Khulais与Ashyrah，各500MW。标记位于麦加市，并非场址位置。'],
    ['Half of SPPC\'s procured storage sits in the western province, where the load of Jeddah and Makkah is.',
     'SPPC所采购储能的一半位于西部省份，即吉达与麦加的负荷所在。'],
    'Zawya — Saudi Energy, ACWA sign contracts for 3 BESS projects', URL.acwa,
    { plannedCapacity: ['2.5 GW / 10 GWh across five sites', '五个场址共2.5GW/10GWh'] }),

  point('qassim', ['Qassim province — two sites', '卡西姆省 — 两个场址'], [43.97, 26.33], 'generation',
    ['Contracted and tendered storage, 4 h', '已签约与招标中储能，4小时'], ['current', 'future'],
    ['Group 1: Al Khushaybi, 500 MW / 2,000 MWh, to ENGIE and Haji Abdullah Alireza, about US$220m. Group 2: Samha, 500 MW. Marker at Buraydah, not at the sites.',
     '第一组：Al Khushaybi，500MW/2,000MWh，归ENGIE与Haji Abdullah Alireza，约2.2亿美元。第二组：Samha，500MW。标记位于布赖代，并非场址位置。'],
    ['The one Group 1 site with a foreign lead, beside a Saudi partner: the entry route a first-timer would follow.',
     '第一组中唯一由外资牵头（与沙特伙伴合作）的场址：首次进入者可循的路径。'],
    'Saudi Gulf Projects — ENGIE and Haji Abdullah Alireza, Al Khushaybi', URL.engie,
    { plannedCapacity: ['1 GW / 4 GWh across two sites', '两个场址共1GW/4GWh'] }),

  point('hail', ['Hail province — one site', '哈伊勒省 — 一个场址'], [41.69, 27.52], 'generation',
    ['Contracted storage, 4 h', '已签约储能，4小时'], ['current', 'future'],
    ['Group 1: Al Kahfah, 500 MW / 2,000 MWh, to Saudi Energy, ACWA Power and Al Sharif. Marker at Hail, not at the site.',
     '第一组：Al Kahfah，500MW/2,000MWh，归Saudi Energy、ACWA Power与Al Sharif。标记位于哈伊勒市，并非场址位置。'],
    ['A northern site in the Group 1 package; its fee, like the others\', is unpublished.',
     '第一组中的北部场址；与其他场址一样，付费未公布。'],
    'pv magazine — Saudi Arabia awards $1.16 billion for 8 GWh', URL.group1,
    { plannedCapacity: ['500 MW / 2,000 MWh', '500MW/2,000MWh'] }),

  point('madinah', ['Madinah province — one site', '麦地那省 — 一个场址'], [39.61, 24.47], 'generation',
    ['Tendered storage, 4 h', '招标中储能，4小时'], ['future'],
    ['Group 2: Al-Henakiyah, 500 MW for four hours; bids due 12 November 2026. Marker at Madinah, not at the site.',
     '第二组：Al-Henakiyah，500MW、四小时；2026年11月12日截标。标记位于麦地那市，并非场址位置。'],
    ['Open to the 27 prequalified bidders.', '向27家通过资格预审的投标人开放。'],
    'ESS News — 27 prequalified for Group 2', URL.group2,
    { plannedCapacity: ['500 MW / 2,000 MWh', '500MW/2,000MWh'] }),

  point('eastern', ['Eastern Province — one site', '东部省 — 一个场址'], [50.10, 26.43], 'generation',
    ['Tendered storage, 4 h', '招标中储能，4小时'], ['future'],
    ['Group 2: Sadawi, 500 MW for four hours. Marker at Dammam, not at the site.',
     '第二组：Sadawi，500MW、四小时。标记位于达曼，并非场址位置。'],
    ['The only SPPC storage site procured so far in the east.', 'SPPC迄今在东部采购的唯一储能场址。'],
    'ESS News — 27 prequalified for Group 2', URL.group2,
    { plannedCapacity: ['500 MW / 2,000 MWh', '500MW/2,000MWh'] }),
];

const sourceCatalog = [
  { id: 'sa-map-group1', owner: 'pv magazine', title: 'Saudi Arabia awards $1.16 billion for 8 GWh of battery storage', url: URL.group1, format: 'HTML', cadence: 'One-off', licence: 'Private use (publisher terms)', automation: 'C', checkedAt: '2026-10-29' },
  { id: 'sa-map-group2', owner: 'ESS News', title: 'Saudi Arabia qualifies 27 companies for second BESS tender', url: URL.group2, format: 'HTML', cadence: 'One-off', licence: 'Private use (publisher terms)', automation: 'C', checkedAt: '2026-10-29' },
  { id: 'sa-map-acwa', owner: 'Zawya', title: 'Saudi Energy, ACWA sign contracts for 3 BESS projects', url: URL.acwa, format: 'HTML', cadence: 'One-off', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-10-29' },
  { id: 'sa-map-engie', owner: 'Saudi Gulf Projects', title: 'ENGIE and Haji Abdullah Alireza — Al Khushaybi', url: URL.engie, format: 'HTML', cadence: 'One-off', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-10-29' },
  { id: 'sa-map-grid', owner: 'REGlobal', title: 'Transmission ties: Saudi Arabia\'s regional connections', url: URL.grid, format: 'HTML', cadence: 'One-off', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-10-29' },
  { id: 'sa-map-boundary', owner: 'Natural Earth via world-atlas', title: 'Countries, 110m', url: URL.ne, format: 'TopoJSON', cadence: 'Periodic', licence: 'Public domain (Natural Earth)', automation: 'B', checkedAt: '2026-10-29' },
];

export const SA_GRID_MAP = {
  id: 'sa-grid-map',
  ariaLabel: ['Interactive Saudi storage map', '沙特储能交互地图'],
  title: ['SPPC storage by province', 'SPPC储能按省分布'],
  defaultPeriod: 'current',
  defaultSelectedId: 'makkah',
  boundary,
  boundarySource: {
    label: ['Natural Earth 110m via world-atlas', 'Natural Earth 110m（world-atlas）'],
    url: URL.ne,
  },
  periodOrder: ['current', 'future'],
  periods: {
    current: {
      label: ['Signed · 2026', '已签约 · 2026'],
      kicker: ['Group 1: 2 GW / 8 GWh', '第一组：2GW/8GWh'],
      thesis: ['Four 500 MW sites on fifteen-year Storage Services Agreements, signed in August 2026 for SAR 4.35bn.',
               '四个500MW场址签订十五年储能服务协议，于2026年8月签署，投资43.5亿里亚尔。'],
      implication: ['The structure is proven; the fee is unpublished.', '结构已验证；付费未公布。'],
    },
    future: {
      label: ['Tendering · 2026–27', '招标中 · 2026–27'],
      kicker: ['Group 2: 3 GW / 12 GWh', '第二组：3GW/12GWh'],
      thesis: ['Six more 500 MW sites, bids due 12 November 2026, against a national target of 48 GWh by 2030.',
               '另外六个500MW场址，2026年11月12日截标，对应2030年全国48GWh目标。'],
      implication: ['The likeliest place a fee is published.', '最可能公布付费之处。'],
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
    'A THEMATIC MAP of SPPC\'s procured storage. Each marker stands at a regional capital and carries that region\'s sites; none is a site, substation or connection position. National Grid SA\'s network is not drawn.',
    '这是SPPC已采购储能的主题地图。每个标记位于省会城市并代表该省场址，均非场址、变电站或并网位置。沙特国家电网公司的电网未予绘制。',
  ],
};

registerGridMap(SA_GRID_MAP, 'sa');

export default SA_GRID_MAP;
