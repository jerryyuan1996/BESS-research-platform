/* ---------------------------------------------------------------------------
   Ontario — congestion register.

   Since Market Renewal went live on 1 May 2025 the IESO settles storage at
   locational prices, so congestion reaches the price a battery trades: the
   same mechanism as Italy's zones, at finer grain. The size of it is measured
   here from IESO's own day-ahead virtual zonal prices over 24 July – 23
   October 2026 — the daily sum of the eight highest hours less the eight
   lowest, by zone, against the Ontario Zonal Price (C$325.63/MW-day):

     East (Napanee)          C$337.70   +3.7%
     Southwest (Simcoe)      C$324.21   −0.4%
     Northwest (Eagle Lake)  C$294.01   −9.7%
     all nine zones          C$294–339

   So location moves the trading line by about ten percent either way, and it
   does not touch the contract line at all — the capacity payment is the same
   wherever the battery sits. That is the opposite of PJM, where site decides
   the arbitrage, and it is why the merchant seed carries no access haircut.

   What the register does not yet carry is the connection side: IESO's window 2
   Preliminary Connection Guidance (15 October 2026) says where new capacity can
   connect, and it has not been read into this file (gate ON-5).
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  zonal: 'https://reports-public.ieso.ca/public/DAHourlyZonal/',
  guidance: 'https://www.ieso.ca/-/media/Files/IESO/Document-Library/long-term-rfp/LT2-Window-2-Guidance-20261015.pdf',
};

const MARKET_RENEWAL = {
  project: ['Market Renewal — day-ahead market and locational prices', '电力市场改革 — 日前市场与节点电价'],
  operator: 'IESO',
  scope: ['Not a wire: since 1 May 2025 storage is settled at locational prices, so the constraint is priced to the battery rather than relieved for it.',
          '并非电网工程：自2025年5月1日起储能按节点电价结算，约束由此向储能定价，而非为其缓解。'],
  expected: 2025,
  status: RELIEF_STATUS.OPERATIONAL,
};

export const CA_ON_CONGESTION = {
  marketId: 'ca_on',
  summary: [
    'Locational prices since May 2025 put congestion into the trading line: over 90 days of 2026 the eight-hour spread ran from 9.7% below the provincial price in the Northwest to 3.7% above it in the East. The capacity contract pays the same everywhere, so location moves about a third of revenue by about a tenth.',
    '自2025年5月起实行节点电价，拥塞因此进入交易收入：2026年90天内，八小时价差在西北区低于全省电价9.7%，在东部区高出3.7%。容量合同在各地支付相同，因此区位对约三分之一的收入产生约十分之一的影响。',
  ],
  gateNote: [
    'Zone figures are IESO virtual-zone averages, not nodes; a site settles at its own node. Where new capacity can connect is in IESO\'s window 2 connection guidance, not yet read — gate ON-5.',
    '分区数据为IESO虚拟区均值而非节点值；场址按自身节点结算。新增容量可接入的位置见IESO窗口2并网指引，尚未纳入 — 研究缺口ON-5。',
  ],

  zones: [
    {
      id: 'ca-on-northwest',
      bearsOn: 'merchGross',
      name: ['Northwest — the thinnest spread', '西北区 — 价差最薄'],
      shape: 'zone',
      coord: [-92.84, 49.78],
      direction: 'export',
      intensity: 0.7,
      metrics: [
        { label: ['Eight-hour spread against the province', '八小时价差与全省对比'],
          value: ['C$294.01 vs C$325.63 per MW-day — 9.7% lower', '每MW每日294.01加元对325.63加元 — 低9.7%'],
          period: ['24 Jul – 23 Oct 2026', '2026年7月24日至10月23日'] },
        { label: ['Mean day-ahead price', '日前平均电价'],
          value: ['C$54.14/MWh vs C$56.55', '54.14加元/MWh对56.55加元'],
          period: ['24 Jul – 23 Oct 2026', '2026年7月24日至10月23日'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'The battery is settled at its own node, so a northwestern site trades a narrower spread. Nothing compensates for it; the contract payment is unaffected.',
          '储能按所在节点结算，因此西北场址的交易价差较窄。对此无任何补偿；合同付款不受影响。',
        ],
      },
      relief: MARKET_RENEWAL,
      investor: [
        'Eagle Lake, near Dryden, is the window-1 project here and bid the middle price, C$580.50. A tenth less trading on a third of revenue is about 3% of the total — enough to show in a bid, not enough to rule a site out.',
        'Eagle Lake（Dryden附近）是窗口1在此区的项目，中标价居中，为580.50加元。三分之一收入中减少十分之一的交易收入，约占总收入的3% — 足以体现在报价中，但不足以否决场址。',
      ],
      source: 'IESO — Day-Ahead Hourly Virtual Zonal Energy Price report',
      sourceUrl: URL.zonal,
    },
    {
      id: 'ca-on-east',
      bearsOn: 'merchGross',
      name: ['East — the widest spread among the winners', '东部区 — 中标项目中价差最宽'],
      shape: 'zone',
      coord: [-76.95, 44.25],
      direction: 'import',
      intensity: 0.4,
      metrics: [
        { label: ['Eight-hour spread against the province', '八小时价差与全省对比'],
          value: ['C$337.70 vs C$325.63 per MW-day — 3.7% higher', '每MW每日337.70加元对325.63加元 — 高3.7%'],
          period: ['24 Jul – 23 Oct 2026', '2026年7月24日至10月23日'] },
        { label: ['Window-1 project', '窗口1项目'],
          value: ['Napanee BESS Phase 2, 300 MW, C$527.20 — the lowest price', 'Napanee二期，300MW，527.20加元 — 最低价'],
          period: ['July 2026', '2026年7月'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'The East and Ottawa zones carry the widest spreads in the province, and the battery keeps them at its node.',
          '东部与渥太华区价差为全省最宽，储能在所在节点获取这一价差。',
        ],
      },
      relief: MARKET_RENEWAL,
      investor: [
        'The lowest bid came from the zone with the best trading and an existing site: Napanee Phase 2 sits beside Phase 1 at OPG\'s generating station. Brownfield connection and a wider spread together are what a low capacity price looks like.',
        '最低报价来自交易条件最好且有现成场址的区域：Napanee二期紧邻OPG电厂内的一期。棕地并网加更宽的价差，正是低容量报价的成因。',
      ],
      source: 'IESO — Day-Ahead Hourly Virtual Zonal Energy Price report',
      sourceUrl: URL.zonal,
    },
  ],
};

export default CA_ON_CONGESTION;
