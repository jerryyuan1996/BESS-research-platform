/* ---------------------------------------------------------------------------
   Spain — congestion register.

   One price zone for the peninsula, so internal congestion never reaches the
   day-ahead price a battery trades; it reaches the connection queue instead.
   Storage that exports applies for access and connection like a generator,
   posting a guarantee of €40/kW that is returned at operation, and capacity
   at saturated nodes is allocated by tender rather than first come, first
   served. Location is commercially neutral in the model and decisive for
   whether a project exists, which is Finland's pattern.

   REE's nodal access-capacity maps are not yet read into this file (gate
   ES-7), so the register reports the mechanism and not a node list.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  guarantee: 'https://ficheiros-web.xunta.gal/cei/enerxia/guia-garantias-redes-enerxia-electrica-cas.pdf',
  omie: 'https://www.omie.es/es/file-download?parents=marginalpdbc&filename=marginalpdbc_20251231.1',
};

export const ES_CONGESTION = {
  marketId: 'es',
  summary: [
    'One price zone for the peninsula, so congestion does not reach the price a battery trades. It reaches the connection queue: an access application posts €40/kW, and saturated nodes are allocated by tender. Which nodes have capacity is in REE\'s access maps, not yet read here.',
    '半岛为单一价格区，因此拥塞不会传导至储能交易的电价，而是体现在并网排队上：接入申请须缴每kW €40担保，饱和节点通过招标分配。哪些节点仍有容量见REE接入容量图，尚未纳入本登记表。',
  ],
  gateNote: [
    'The node list is not read (gate ES-7). The guarantee is from Galicia\'s official guide to the national rule and stays at "verify" until the consolidated royal decree is read.',
    '节点清单尚未读取（研究缺口ES-7）。担保金额取自加利西亚官方对全国规则的指引，在核阅合并版皇家法令前保持"待核实"。',
  ],

  zones: [
    {
      id: 'es-access-queue',
      /* No bearsOn: an access queue decides whether a project exists, and does
         not modify a priced line. */
      name: ['Peninsular Spain — the access queue', '西班牙半岛 — 接入排队'],
      shape: 'zone',
      coord: [-3.70, 40.20],
      direction: 'import',
      intensity: 0.8,
      metrics: [
        { label: ['Guarantee to apply', '申请担保'],
          value: ['€40/kW installed, returned at operation — €2m for 50 MW', '每kW装机€40，投运后退还 — 50MW为200万欧元'],
          period: ['2026', '2026年'] },
        { label: ['Price zones', '价格区'],
          value: ['One (with Portugal in most hours)', '一个（多数时段与葡萄牙同价）'],
          period: ['2026', '2026年'] },
      ],
      capture: {
        mechanism: CAPTURE.ACCESS_AUCTION,
        text: [
          'Congestion is charged to the developer at the connection stage — a guarantee at risk, and a tender where a node is saturated — rather than paid to the operator afterwards.',
          '拥塞在并网阶段由开发商承担 — 担保面临风险，节点饱和时须参与招标 — 而非事后向运营方付费。',
        ],
      },
      relief: {
        project: ['Transmission planning 2025–2030', '2025–2030年输电规划'],
        operator: 'MITECO / REE',
        scope: ['The national transmission plan sets where new access capacity appears; it is not read into this register (gate ES-7).', '全国输电规划决定新增接入容量的位置；尚未纳入本登记表（研究缺口ES-7）。'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'A connection right at a node with capacity is the scarce asset, as in Finland: siting changes no revenue line in the model because Spain has one price, and it decides whether the project exists. An awarded PINALM project with access already granted is the cleanest entry.',
        '与芬兰相同，在有容量节点的并网权才是稀缺资产：西班牙为单一价格，选址不改变模型中的任何收入项，却决定项目能否存在。已获接入许可的PINALM受资助项目是最干净的进入方式。',
      ],
      source: 'Xunta de Galicia — guide to grid access and connection guarantees',
      sourceUrl: URL.guarantee,
    },
  ],
};

export default ES_CONGESTION;
