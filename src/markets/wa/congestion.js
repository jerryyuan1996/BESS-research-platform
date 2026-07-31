/* ---------------------------------------------------------------------------
   Western Australia — congestion register.

   WA is the market where congestion is not settled in energy at all. It is
   settled in ACCREDITATION.

   Network Access Quantities cap what a facility may export and cannot be
   exceeded. Existing "foundation" generators hold priority, and new entrants
   take the remaining headroom. So a constrained WA facility does not receive a
   constraint payment and does not charge into a depressed price — it is assigned
   fewer Capacity Credits, and the loss appears in the Reserve Capacity Mechanism
   rather than in the energy market. That is a different instrument from every
   other market on this platform, and it is why the comparison interface carries
   `naqFactor` on the market revenue leg rather than on the capacity payment.

   The relief is the most concrete on the platform. Clean Energy Link — East
   connects a new terminal east of Collie to the existing Shotts and Muja
   terminals and is expected operational by the end of 2029; Clean Energy Link —
   North began construction in July 2026. Both sit under the $1.4bn Clean Energy
   Fund announced in the 2026-27 State Budget. And the timing is not incidental:
   Collie Power Station retires in 2027 and Muja D around 2029, so the link is
   sized to move renewable energy through the corridor those closures vacate.

   The 2026 WEM ESOO is the counterweight. AEMO warns supply shortages could bite
   in summer and winter from 2031 if new projects and the transmission
   augmentation required to connect them are delayed — which is the operator
   saying the congestion relief and the capacity adequacy are the same schedule.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  cleanEnergyLink: 'https://www.westernpower.com.au/resources-education/our-network-the-grid/future-of-the-grid/clean-energy-link-program/',
  esoo: 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning',
};

export const WA_CONGESTION = {
  marketId: 'wa',
  summary: [
    'The only market in the set where congestion is settled in capacity accreditation rather than in energy: Network Access Quantities cap export, foundation generators hold priority, and the loss appears as fewer Capacity Credits. Clean Energy Link — East is expected operational by the end of 2029.',
    '本样本中唯一以容量认定而非电量结算拥塞的市场：网络接入量限制送出，既有基础发电机组享有优先权，损失体现为容量信用减少。清洁能源联络线—东段预计2029年底投运。',
  ],
  gateNote: [
    'AEMO publishes the access framework and the ESOO outlook; it does not publish per-facility constraint or curtailment data for the SWIS. The size of the access-priority haircut remains an analyst assumption — the platform holds it at 10% under gate G8.',
    'AEMO公布接入框架及ESOO展望，但不公布SWIS各设施的约束或限发数据。接入优先权折损的幅度仍属分析师假设 — 本平台在研究缺口G8下将其设为10%。',
  ],

  zones: [
    {
      id: 'wa-naq-access',
      bearsOn: 'naqFactor',
      name: ['Network Access Quantity headroom', '网络接入量裕度'],
      shape: 'zone',
      coord: [116.20, -32.10],
      direction: 'export',
      intensity: 0.8,
      metrics: [
        { label: ['Access priority', '接入优先级'],
          value: ['Foundation generators hold priority; new entrants take the remaining headroom',
                  '基础发电机组享有优先权，新进入者只能取得剩余裕度'],
          period: ['current', '当前'] },
        { label: ['Platform assumption for the haircut', '本平台折损假设'],
          value: ['10% of energy revenue', '电量收入的10%'], period: ['analyst assumption — gate G8', '分析师假设 — 研究缺口G8'] },
      ],
      capture: {
        mechanism: CAPTURE.CAPACITY_ACCREDITATION,
        text: [
          'There is nothing to capture in the energy market: constraint does not produce a payment or a depressed price a battery can charge into. It produces a lower Capacity Credit assignment. The way to be paid for congestion in WA is to hold access, not to sit next to a constraint.',
          '在电量市场中无从捕获：约束既不产生补偿，也不形成储能可用于充电的低价。它导致容量信用获配减少。在西澳获取拥塞回报的方式是持有接入权，而非邻近约束点。',
        ],
      },
      relief: {
        project: ['Clean Energy Link — East', '清洁能源联络线 — 东段'],
        operator: 'Western Power / WA State Government',
        scope: ['New terminal east of Collie connected to the existing Shotts and Muja terminals by two new high-voltage lines, under the $1.4bn Clean Energy Fund; Clean Energy Link — North began construction July 2026',
                '在科利以东新建终端站，通过两条新建高压线路接入既有Shotts及Muja终端站，纳入14亿澳元清洁能源基金；清洁能源联络线—北段已于2026年7月开工'],
        expected: 2029,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'The fixed-price election makes this the WA decision rather than a WA detail: taking the ten-year fixed Reserve Capacity Price sacrifices transmission access priority, so the election and the access haircut are the same choice priced twice. Clean Energy Link — East lands in 2029, inside the election term for a 2027–28 COD, which means the haircut a project accepts at financial close may be relieved before the election expires. That is upside the platform does not currently model.',
        '固定价格选择权使该问题成为西澳的核心决策而非细节：接受十年固定备用容量价格意味着放弃输电接入优先权，因此该选择权与接入折损实为同一决定的双重定价。清洁能源联络线—东段将于2029年投运，处于2027–28年投运项目的选择权期限之内，这意味着项目在融资完成时所接受的折损，可能在选择权到期前即已缓解。本平台目前未对该上行空间建模。',
      ],
      source: 'Western Power Clean Energy Link Program; WA 2026-27 State Budget',
      sourceUrl: URL.cleanEnergyLink,
    },

    {
      id: 'wa-collie-corridor',
      bearsOn: 'naqFactor',
      name: ['Collie corridor and coal retirement', '科利走廊与煤电退役'],
      shape: 'interface',
      coords: [[116.15, -33.36], [116.05, -33.10], [115.90, -32.60]],
      direction: 'both',
      intensity: 0.75,
      metrics: [
        { label: ['Corridor vacated by retirements', '退役腾出的走廊容量'],
          value: ['Collie Power Station 2027, Muja D ~2029', '科利电站2027年，Muja D约2029年'],
          period: ['scheduled', '已排定'] },
        { label: ['New generation and storage expected', '预计新增发电及储能'],
          value: ['more than 1,000 MW progressively delivered', '超过1,000MW分阶段交付'],
          period: ['by 2030-31', '至2030–31年'] },
      ],
      capture: {
        mechanism: CAPTURE.CAPACITY_ACCREDITATION,
        text: [
          'A retiring coal station frees network capability at a known node on a known date. That is the clearest siting signal in the SWIS, and it is the reason Clean Energy Link — East terminates at Shotts and Muja rather than anywhere else.',
          '退役煤电机组将在已知节点、已知日期释放网络能力。这是SWIS中最明确的选址信号，也是清洁能源联络线—东段以Shotts及Muja为终点的原因。',
        ],
      },
      relief: {
        project: ['Clean Energy Link — East', '清洁能源联络线 — 东段'],
        operator: 'Western Power',
        scope: ['Two new high-voltage lines into the Shotts and Muja terminals; expected operational end of 2029',
                '两条新建高压线路接入Shotts及Muja终端站；预计2029年底投运'],
        expected: 2029,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'Read the retirement dates and the link date together, not separately. AEMO\'s 2026 WEM ESOO warns shortages could bite in summer and winter from 2031 if new projects and the transmission to connect them are late — so the same delay that would extend a congestion opportunity is the delay that tightens the Reserve Capacity Mechanism. In WA those two are not independent bets; they are one schedule read from either end.',
        '退役日期与联络线投运日期应结合解读，而非分别看待。AEMO的2026年WEM ESOO警告，若新项目及配套输电工程延期，2031年起夏冬两季可能出现供应紧张 — 因此延长拥塞机会的同一延误，也正是收紧备用容量机制的延误。在西澳，二者并非独立押注，而是同一时间表的两端。',
      ],
      source: 'Western Power Clean Energy Link Program; AEMO 2026 WEM ESOO',
      sourceUrl: URL.esoo,
    },
  ],
};

export default WA_CONGESTION;
