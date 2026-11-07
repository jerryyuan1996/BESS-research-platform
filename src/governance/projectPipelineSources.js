/* ---------------------------------------------------------------------------
   WHERE EACH MARKET'S PROJECT PIPELINE COMES FROM.

   Two kinds of project go on the market maps: storage, and the large renewables
   that shape the price a battery captures. They do not share a source, and no
   single source covers every market — so this file names one per market and says
   how far it has been checked.

   `status` is the honest part:

     verified   the endpoint was checked and the fields below were seen in it
     candidate  the publisher and dataset are identified, the fields are NOT yet
                confirmed — do not build against this until it is checked
     none       no public source of adequate quality was found. The market maps
                render no pipeline layer at all, and the map says so.

   A `none` is a finding, not a gap to be filled with something worse. OSM was
   measured on 2026-08-08 and returns 173 mapped batteries in Germany against
   ONE in Romania; a map drawn from it would report that Romania has no storage
   rather than that nobody has mapped it. Publishing an empty layer is honest.
   Publishing a misleadingly sparse one is not.

   Nothing here feeds the economics. These are map and pipeline-section layers.
   --------------------------------------------------------------------------- */

/** Fields the platform wants for a storage project, in priority order. */
export const STORAGE_FIELDS = [
  'name', 'powerMW', 'energyMWh', 'operator', 'lat', 'lon', 'status', 'cod',
];

/* Statuses the platform renders. Anything a source calls "proposed",
   "application" or "queued" is deliberately NOT carried: an interconnection
   queue is not a pipeline, and most of it never gets built. */
export const RENDERED_STATUS = ['operating', 'construction'];

const CC_BY = 'CC BY 4.0';
const US_GOV = 'US Government work — public domain';
const DL_DE_BY = 'Data Licence Germany – attribution – v2.0 (DL-DE-BY-2.0)';

/** @type {Record<string, object>} */
export const PIPELINE_SOURCES = {
  de: {
    status: 'verified',
    storage: {
      id: 'de-mastr',
      owner: 'Bundesnetzagentur',
      title: 'Marktstammdatenregister (MaStR)',
      url: 'https://www.marktstammdatenregister.de/MaStR',
      licence: DL_DE_BY,
      cadence: 'continuous, registration-driven',
      fields: ['name', 'powerMW', 'energyMWh', 'operator', 'lat', 'lon', 'status', 'cod'],
      note: [
        'The statutory register of every German generation and storage unit, carrying location, capacity, commissioning date and operator. The most complete storage source on the platform by some distance, and the only one that is a legal filing rather than a survey.',
        '德国全部发电与储能单元的法定登记册，载有位置、容量、投运日期与运营方。为本平台迄今最完整的储能数据源，且是唯一以法定申报而非调查为基础的来源。',
      ],
    },
  },

  pjm: US_EIA('PJM'), ercot: US_EIA('ERCOT'), caiso: US_EIA('CAISO'),

  nem: AEMO_GI('NEM'), wa: AEMO_GI('WEM'),

  gb: {
    status: 'verified',
    storage: {
      id: 'gb-neso-tec',
      owner: 'NESO',
      title: 'Transmission Entry Capacity (TEC) Register',
      url: 'https://www.neso.energy/data-portal',
      licence: 'NESO Open Data Licence',
      cadence: 'monthly',
      /* Already connected — see etl/sources/neso-tec-register.mjs, which filters
         Plant Type "Energy Storage System" and carries capacity, project status,
         connection gate and effective-from date. */
      fields: ['name', 'powerMW', 'operator', 'status', 'cod'],
      missing: ['energyMWh', 'lat', 'lon'],
      note: [
        'Already wired into the ETL. The register carries no duration and no MWh, and the existing connector deliberately synthesises neither — so GB storage plots as power only until a second source supplies energy. Coordinates must come from the connection point, not from the register.',
        '已接入ETL。该登记册不含时长与MWh，现有连接器刻意不作合成 — 因此在第二数据源提供能量数据前，英国储能仅以功率呈现。坐标须取自并网点而非登记册本身。',
      ],
    },
  },

  /* Ireland is carried on OpenStreetMap, which is unusual and needs its reason
     stated. EirGrid's own "Connected and Contracted Generators" lists were
     checked on 2026-08-09 and are PDFs that do not identify storage separately
     or carry coordinates — unusable. OSM, measured the same day and clipped to
     the Irish boundary, returns 26 battery plants totalling 1,039 MW against the
     roughly 1 GW ESB Networks reports as available on the network. That is
     effectively the whole fleet, with an operator on 25 of 26 and a name on 24.
     Coverage was MEASURED, not assumed — which is the only reason OSM is
     acceptable here and not in Italy, Poland or Japan. */
  ie: OSM_STORAGE({
    plants: 26, mappedMW: 1039, namedCount: 24, withEnergy: 14,
    reference: 'ESB Networks reports over 1 GW of storage available on the Irish network',
    note: [
      'OpenStreetMap, clipped to the Irish boundary. 26 plants totalling 1,039 MW against the roughly 1 GW ESB Networks reports as available — effectively complete, with an operator on 25 of 26 and an energy rating on 14. EirGrid publishes its connected and contracted lists as PDFs that neither flag storage nor carry coordinates, so OSM is the better source here despite being a volunteer one.',
      '取自OpenStreetMap并按爱尔兰边界裁剪。26座电站合计1,039MW，而ESB Networks报告电网可用储能约1GW — 覆盖基本完整，其中25座有运营方、14座有能量容量。EirGrid的已并网及已签约清单以PDF发布，既未单列储能亦无坐标，因此此处OSM虽为志愿者数据仍属更优来源。',
    ],
  }),

  /* ---- measured and rejected -------------------------------------------- */

  it: NO_SOURCE([
    'Terna publishes MACSE awards by zone — Centre-South, South and Calabria, Sicily, Sardinia — not by project, so the contracted pipeline carries no coordinates. OpenStreetMap, clipped to Italy on 2026-08-09, returns 11 plants totalling 543 MW with only 8 named, against a fleet that MACSE alone is adding 1,491 MW to. Neither source can carry the map.',
    'Terna按分区公布MACSE中标结果 — 中南部、南部与卡拉布里亚、西西里、撒丁 — 而非按项目，因此合同化管线不含坐标。2026年8月9日按意大利边界裁剪的OpenStreetMap仅返回11座电站合计543MW、其中8座有名称，而仅MACSE一项就将新增1,491MW。两者均不足以支撑地图。',
  ]),

  pl: NO_SOURCE([
    'URE publishes capacity-auction results as unit lists without coordinates. OpenStreetMap, clipped to Poland on 2026-08-09, returns 4 plants — and the unclipped bounding box returned 13, of which nine were German assets in Brandenburg. Four mapped projects cannot represent a market carrying a capacity-market storage pipeline.',
    'URE以机组清单形式公布容量拍卖结果，不含坐标。2026年8月9日按波兰边界裁剪的OpenStreetMap仅返回4座电站 — 未裁剪的外接矩形返回13座，其中9座实为勃兰登堡的德国资产。4个已标注项目无法代表一个拥有容量市场储能管线的市场。',
  ]),

  jp_tokyo: NO_SOURCE(JAPAN_REASON()),
  jp_kyushu: NO_SOURCE(JAPAN_REASON()),
  jp_hokkaido: NO_SOURCE(JAPAN_REASON()),

  ro: NO_SOURCE([
    'No public project-level storage register was found for Romania. OpenStreetMap returned a single mapped battery for the whole country on 2026-08-08, which is a mapping artefact and not a market fact — Romania is the market this platform ranks first on merchant returns. The map renders no storage layer here rather than one that implies an empty market.',
    '未找到罗马尼亚公开的项目级储能登记册。2026年8月8日OpenStreetMap全国仅返回一处已标注储能设施，此为测绘覆盖不足所致而非市场事实 — 罗马尼亚恰是本平台市场化回报排名第一的市场。因此该市场不渲染储能图层，以免呈现"市场空白"的误导。',
  ]),
  fi: NO_SOURCE([
    'Fingrid publishes storage capacity as an aggregate series, not a project-level register — so even with the licence resolved there is nothing project-level to plot. The series is Creative Commons Attribution and republishable; what gate FI-2 covers is provisioning the API key and implementing attribution, which would give the aggregate, not coordinates. Project-level knowledge of the Finnish fleet is developer announcements, a pipeline of intentions rather than a register. The map renders no storage layer rather than one built from press releases.',
    'Fingrid公布的是储能容量的汇总序列，而非项目级登记册 — 因此即便许可问题解决，也不存在可供绘制的项目级数据。该序列采用知识共享署名许可，可以转载；研究缺口FI-2所涵盖的是申请API密钥与落实署名要求，而这只能获得汇总值而非坐标。目前对芬兰储能机组的项目级了解来自开发商公告，属意向性管线而非登记册。因此该市场不渲染储能图层，而非依据新闻稿构建图层。',
  ]),
  ca_on: NO_SOURCE([
    'IESO publishes each procurement\'s winners with the closest town, municipality and zone, not coordinates, and no project-level storage register with locations was found. The Ontario map plots the five sourced plants at town and county centroids on its own thematic layer instead; a storage layer built from those would claim a precision the sources do not give.',
    'IESO公布的各轮采购中标结果仅含最近城镇、市镇与区域，不含坐标；亦未找到含位置的项目级储能登记册。安大略地图以城镇及县中心坐标在其主题图层上标注五座有来源的电站；据此构建储能图层将宣称来源所不具备的精度。',
  ]),
  /* Spain and Saudi Arabia, registered 2026-10-29. */
  es: NO_SOURCE([
    'MITECO publishes storage approvals and IDAE the PINALM awards by project name and municipality, not coordinates, and REE counts installed batteries as a national total (96 MW at the end of 2025). No project-level register with locations was found. The Spanish map plots the sourced reference points on its own thematic layer instead.',
    'MITECO公布储能审批、IDAE公布PINALM资助结果，均仅含项目名称与市镇，不含坐标；REE仅公布全国已装电池总量（2025年底96MW）。未找到含位置的项目级登记册。西班牙地图在其主题图层上标注有来源的参照点。',
  ]),
  sa: NO_SOURCE([
    'SPPC announces each storage site by name and region (Group 1: Al Muwayh, Haden, Al Kahfah, Al Khushaybi; Group 2: six sites), not by coordinates, and no project-level register was found. The Saudi map plots the ten sites at the towns they are named after on its own thematic layer; a storage layer built from those would claim a precision the sources do not give.',
    'SPPC按名称与地区公布各储能场址（第一组：Al Muwayh、Haden、Al Kahfah、Al Khushaybi；第二组六个场址），不含坐标，亦未找到项目级登记册。沙特地图在其主题图层上以场址同名城镇标注十个场址；据此构建储能图层将宣称来源所不具备的精度。',
  ]),
};

function JAPAN_REASON(){
  return [
    'OpenStreetMap, clipped to the three Japanese areas on 2026-08-09, returns one battery plant of 50 MW in Kyushu and none at all in Tokyo or Hokkaido, against a market whose long-term decarbonisation auctions have awarded storage in gigawatts. OCCTO publishes LTDA awards but not project coordinates. Nothing here can be plotted honestly.',
    '2026年8月9日按日本三区域边界裁剪的OpenStreetMap，仅在九州返回一座50MW储能电站，东京与北海道均为零；而该市场的长期脱碳拍卖已授予吉瓦级储能。OCCTO公布LTDA中标结果但不含项目坐标。此处无任何可如实绘制的数据。',
  ];
}

/* EIA-860M is one dataset covering all three US markets, so it is written once.
   Prime mover code "BA" is battery storage; the monthly file carries operating
   status and planned operation month. Current releases also carry MWh and
   coordinates. The annual supplement retains its own year and exact ID join. */
function US_EIA(market){
  return {
    status: 'verified',
    storage: {
      id: 'us-eia-860m',
      owner: 'U.S. Energy Information Administration',
      title: 'Form EIA-860M — Preliminary Monthly Electric Generator Inventory',
      url: 'https://www.eia.gov/electricity/data/eia860m/',
      licence: US_GOV,
      cadence: 'monthly',
      fields: ['name', 'powerMW', 'energyMWh', 'operator', 'lat', 'lon', 'status', 'cod'],
      joins: { coordinateFallback: 'EIA-860 annual Plant, preserving exact/name-state confidence', annualStorage: 'EIA-860 storage, exact Plant Code + Generator ID only' },
      filter: { market, primeMover: 'BA', positiveGeneratorMW: true },
      note: [
        'Current monthly files report nameplate MW/MWh, status, operation month and coordinates. Annual storage MWh and maximum charge/discharge MW are separate dated evidence, joined only by exact generator identity. EIA warns monthly inventories may be revised and are not capacity commitments.',
        '当前月表申报铭牌MW/MWh、状态、投运月份与坐标。年度储能MWh及最大充放电MW为单独注明年份的证据，仅按精确机组身份关联。EIA提示月度清单可能修订，不构成容量承诺。',
      ],
    },
  };
}

/* AEMO collects Generation Information from participants and publishes existing,
   committed and proposed capacity with developer-estimated commissioning dates.
   One dataset, two markets — the NEM and the WEM are published separately but on
   the same instrument. */
function AEMO_GI(market){
  return {
    status: 'verified',
    storage: {
      id: 'au-aemo-generation-information',
      owner: 'AEMO',
      title: 'Generation Information — ' + market,
      url: 'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/nem-forecasting-and-planning/forecasting-and-planning-data/generation-information',
      licence: 'AEMO terms of use — attribution',
      cadence: 'quarterly',
      fields: ['name', 'powerMW', 'energyMWh', 'operator', 'status', 'cod'],
      joins: { coordinates: 'AEMO NEM registration and exemption list, on DUID' },
      note: [
        'Existing, committed and proposed capacity with a developer-estimated commissioning date. "Committed" is the status worth plotting: AEMO applies published commitment criteria to it, so it is a filtered pipeline rather than a queue. Proposed capacity exceeds 18.6 GW and is not rendered.',
        '包含现有、已承诺与拟建容量，并附开发商预估投运日期。"已承诺"是值得绘制的状态：AEMO对其适用公开的承诺标准，因此属经筛选的管线而非排队清单。拟建容量超过18.6GW，不予渲染。',
      ],
    },
  };
}

/* OpenStreetMap as a storage source, admissible ONLY where its coverage has been
   measured against a published fleet total and found effectively complete.
   `coverage` records that measurement so the claim can be re-checked rather than
   trusted — OSM improves and degrades market by market, and a source that was
   complete in August 2026 may not be next year. */
function OSM_STORAGE({ plants, mappedMW, namedCount, withEnergy, reference, note }){
  return {
    status: 'verified',
    storage: {
      id: 'osm-storage',
      owner: 'OpenStreetMap contributors',
      title: 'OpenStreetMap power=plant + plant:source=battery, via Overpass',
      url: 'https://www.openstreetmap.org/copyright',
      licence: 'ODbL 1.0 — attribution and share-alike',
      cadence: 'continuous, volunteer-maintained',
      fields: ['name', 'powerMW', 'energyMWh', 'operator', 'lat', 'lon', 'status'],
      missing: ['cod'],
      coverage: { measuredOn: '2026-08-09', plants, mappedMW, namedCount, withEnergy, reference },
      note,
    },
  };
}

function NO_SOURCE(note){
  return { status: 'none', storage: null, note };
}

/** The pipeline source declaration for a market, or null where none exists. */
export function pipelineSourceFor(marketId){
  return PIPELINE_SOURCES[marketId] || null;
}

/** Markets whose storage layer may actually be built today. */
export const VERIFIED_STORAGE_MARKETS =
  Object.keys(PIPELINE_SOURCES).filter(id => PIPELINE_SOURCES[id].status === 'verified');

/** Markets that will render no storage layer, with the reason available. */
export const NO_STORAGE_SOURCE_MARKETS =
  Object.keys(PIPELINE_SOURCES).filter(id => PIPELINE_SOURCES[id].status === 'none');
