/* ---------------------------------------------------------------------------
   Finland — congestion register.

   THE WHOLE LOCATIONAL SIGNAL IS IN THE CONNECTION QUEUE, because there is
   nowhere else for it to be. Finland is a single bidding zone: one price for the
   entire country, from Helsinki to the Arctic Circle. So no amount of internal
   congestion reaches the wholesale price a battery trades, and a Finnish battery
   cannot do what an Italian one does — sit on the expensive side of a boundary
   and be paid for it. There is no boundary.

   What congestion does instead is decide whether the project may exist.

   In southern Finland, where the load is, Fingrid has restricted new grid energy
   storage connections until 2029, when the Hikiä–Toivila reinforcement
   completes. The restriction previously ran to early 2027 and was EXTENDED —
   which is the fact a developer should read first, because it says the queue is
   growing faster than the wires. Against it: more than 30,000 MW of storage
   connection requests, about 1,800 MW already contracted, and several thousand
   megawatts still available in Ostrobothnia and the north.

   That combination is unusual enough to state plainly:

     1. LOCATION IS COMMERCIALLY NEUTRAL AND PHYSICALLY DECISIVE. One price area
        means siting north or south changes no revenue line in the model. It
        changes whether there is a project at all.

     2. THE CONSTRAINT HAS NO PRICE. Nothing is auctioned, nothing is
        compensated. Romania charges for congestion, Italy pays for it, the NEM
        does neither but the asset still runs. Finland's answer is that the asset
        is not connected — see CAPTURE.CONNECTION_MORATORIUM.

     3. SCARCITY SITS WITH THE INCUMBENT. The 1,800 MW already contracted holds
        something the next 30,000 MW of requests cannot obtain in the south until
        2029. In a market where connected storage already exceeds the
        fast-reserve obligation, a closed door is the strongest thing protecting
        the price.

   Cut P1 is the internal bottleneck behind all of it: the north–south transfer
   limit separating a wind-heavy north and west from a consumption-heavy south.
   Fingrid publishes the flow and the planned capacity in each direction weekly,
   and the reinforcement programme adds roughly 1,500 MW of north-to-south
   capacity — explicitly so that Finland can REMAIN a single price area. That is
   the sentence to keep: the single price zone is a policy outcome being paid
   for, not a permanent feature of the system.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  storageRestriction: 'https://www.fingrid.fi/en/news/news/2025/fingrid-secures-transmission-capacity-for-growth-in-electricity-consumption-and-new-industrial-investments--restrictions-on-new-energy-storage-facility-connections-continued-in-southern-finland/',
  cutP1: 'https://www.fingrid.fi/en/electricity-market-information/history-data-from-cut-p1/',
  grid: 'https://www.fingrid.fi/en/grid/development/power-transmission-grid-of-fingrid/',
};

export const FI_CONGESTION = {
  marketId: 'fi',
  summary: [
    'One bidding zone, so congestion never reaches the price a battery trades. It reaches the connection queue instead: new grid storage connections in southern Finland are restricted until 2029, against more than 30 GW of requests and about 1.8 GW contracted, while capacity remains available in Ostrobothnia and the north.',
    '全国为单一报价区，因此拥塞不会传导至储能交易的电价，而是体现在并网排队上：芬兰南部新增电网侧储能并网受限至2029年，而并网申请超过30GW、已签约约1.8GW；与此同时，博滕区及北部仍有可用并网容量。',
  ],
  gateNote: [
    'The restriction and the request volume are Fingrid statements; the split of requests between north and south is not published, so the register reports the national totals and the qualitative regional availability rather than a zonal ratio — gate FI-5.',
    '并网限制与申请规模均引自Fingrid公告；南北申请量的分布未予公布，故本登记表仅呈现全国合计数据与区域可用性的定性描述，而非分区比值 — 研究缺口FI-5。',
  ],

  zones: [
    {
      id: 'fi-south-moratorium',
      /* No bearsOn. A connection moratorium does not sit inside a priced
         assumption — it decides whether the project is underwritten at all, and
         attaching it to a revenue line would imply it modifies one. */
      name: ['Southern Finland — storage connection restriction', '芬兰南部 — 储能并网限制'],
      shape: 'zone',
      coord: [24.94, 60.60],
      direction: 'import',
      intensity: 1.0,
      metrics: [
        { label: ['Restriction', '限制措施'],
          value: ['New grid energy storage connections restricted until 2029', '新增电网侧储能并网受限至2029年'],
          period: ['2025–2029', '2025–2029年'] },
        { label: ['Requests against contracted', '申请量与已签约量'],
          value: ['Over 30,000 MW requested; about 1,800 MW contracted', '申请量超过30,000MW；已签约约1,800MW'],
          period: ['2025', '2025年'] },
        { label: ['Previous end date', '此前截止时间'],
          value: ['Early 2027 — extended, not met', '2027年初 — 已延期，未如期解除'],
          period: ['2024', '2024年'] },
      ],
      capture: {
        mechanism: CAPTURE.CONNECTION_MORATORIUM,
        text: [
          'There is nothing to capture. Fingrid is not pricing this congestion or paying anyone to relieve it — it is declining to connect, and the only available response is to site elsewhere. For an incumbent with a contracted connection that is the most valuable sentence in this register.',
          '此处无可获取的收益。Fingrid既未对该拥塞定价，也未向任何方支付缓解费用 — 而是拒绝新增并网，唯一可行的应对是另择场址。对已持有签约并网容量的在运方而言，这是本登记表中最具价值的一句话。',
        ],
      },
      relief: {
        project: ['Hikiä–Toivila main grid reinforcement', 'Hikiä–Toivila主网加强工程'],
        operator: 'Fingrid',
        scope: ['A 400 kV reinforcement of the north–south corridor, on which the restriction end date depends',
                '南北走廊的400kV加强工程，并网限制的解除时点取决于该工程'],
        expected: 2029,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'Treat a contracted southern connection as the scarce asset and diligence it as one — the date has already moved once, from early 2027 to 2029, and it moved because demand grew rather than because the works slipped. In the north and Ostrobothnia connection capacity is available today, and because Finland is a single price area, siting there costs nothing in modelled revenue. The trade is between a connection you can get now and a reserve market whose depth is the open question.',
        '应将已签约的南部并网容量视为稀缺资产并据此开展尽调 — 该期限已由2027年初推迟至2029年，且推迟原因是需求增长而非工程延误。北部与博滕区当前仍有并网容量可用，且由于芬兰为单一报价区，在该区域选址不会造成模型收入损失。真正的权衡在于：现在即可获得的并网容量，与深度尚待验证的备用市场之间。',
      ],
      source: 'Fingrid — restrictions on new energy storage facility connections in southern Finland',
      sourceUrl: URL.storageRestriction,
    },

    {
      id: 'fi-cut-p1',
      name: ['Cut P1 — the north–south transfer limit', '断面P1 — 南北输电限制'],
      shape: 'zone',
      coord: [25.60, 63.40],
      direction: 'export',
      intensity: 0.75,
      metrics: [
        { label: ['What it separates', '分隔区域'],
          value: ['Wind-heavy north and west from consumption-heavy south', '风电密集的北部与西部，同消费密集的南部'],
          period: ['2026', '2026年'] },
        { label: ['Reinforcement', '加强规模'],
          value: ['About 1,500 MW of additional north-to-south capacity', '新增由北向南输电能力约1,500MW'],
          period: ['to 2029', '至2029年'] },
        { label: ['Publication', '数据发布'],
          value: ['Flow and planned capacity both directions, weekly', '潮流与两方向计划输电能力，每周发布'],
          period: ['continuous', '持续'] },
      ],
      capture: {
        mechanism: CAPTURE.UNCOMPENSATED,
        text: [
          'Nothing pays a battery to relieve Cut P1, because the single price zone already absorbs it implicitly — the constraint is managed by redispatch and by building wire, not by a locational market. Its relevance to a battery is indirect and structural: it is why the south cannot take more connections.',
          '没有任何机制向储能支付缓解断面P1的费用，因为单一报价区本身已隐含吸收了该约束 — 该约束通过再调度与线路建设管理，而非通过分区市场。其对储能的影响是间接且结构性的：它正是南部无法接纳更多并网容量的原因。',
        ],
      },
      relief: {
        project: ['North–south transmission reinforcement programme', '南北输电加强计划'],
        operator: 'Fingrid',
        scope: ['Roughly 1,500 MW of additional transfer capacity, undertaken explicitly so that Finland can remain a single price area',
                '新增约1,500MW输电能力，其明确目的是使芬兰得以维持单一报价区'],
        expected: 2029,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'The number to watch is not the flow but the policy it protects. Fingrid states the reinforcement is undertaken so Finland can REMAIN one price area — which is an admission that it might not, and a Finnish battery merchant case is built on there being no locational basis risk. A split zone would change the thesis of every project in the country, in both directions.',
        '值得关注的并非潮流数值，而是其所维护的政策。Fingrid明确表示该加强工程的目的是使芬兰得以"维持"单一报价区 — 这本身即承认了分区的可能性，而芬兰储能项目的市场化收入逻辑正建立在不存在地域基差风险之上。一旦分区，全国所有项目的投资逻辑都将改变，且方向各异。',
      ],
      source: 'Fingrid — Cut P1 history data and main grid development',
      sourceUrl: URL.cutP1,
    },
  ],
};

export default FI_CONGESTION;
