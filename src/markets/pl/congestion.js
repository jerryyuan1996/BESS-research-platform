/* ---------------------------------------------------------------------------
   Poland — congestion register.

   Poland has the fastest-growing curtailment problem in the set and the worst
   compensation for it, and those two facts point in opposite investment
   directions.

   THE VOLUME IS COMPOUNDING. Non-market RES curtailment was 731 GWh across the
   whole of 2024. By September 2025 it had already reached 1,131 GWh. April 2025
   alone saw more than 25 days of non-market redispatch orders and 223 GWh of
   solar curtailed — a single month at roughly a third of the previous full year.

   THE COMPENSATION IS BELOW COST. Curtailed generators receive roughly
   PLN 200-250/MWh, while reported actual losses including operating costs run
   PLN 400-600/MWh. A battery is not compensated at all for congestion; it is
   simply exposed to the same negative and near-zero prices that the curtailment
   creates. That is the opportunity — Polish congestion reaches a battery as
   CHEAP CHARGING rather than as a payment — and it is why the Polish case is a
   spread case rather than a constraint-payment case.

   THE DIRECTION IS STRUCTURAL. Generation is moving to the Baltic coast while
   industrial demand stays in the south. PSE's TGDP 2025-2034 answers that with
   an internal north-south HVDC link and roughly 4,700 km of new 400 kV circuits
   by 2034 — the alternative, PSE says explicitly, being significant and costly
   constraints. A 2034 horizon is the longest relief runway on this platform,
   which is the single strongest argument for the Polish congestion thesis.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  tgdp: 'https://raport.pse.pl/en/economic-and-market-impact/development-of-the-transmission-system',
  ure: 'https://www.ure.gov.pl/en/',
};

export const PL_CONGESTION = {
  marketId: 'pl',
  summary: [
    'Curtailment is compounding — 731 GWh in all of 2024, 1,131 GWh by September 2025 — and compensation sits below the generator\'s actual loss. Congestion reaches a battery as cheap charging rather than as a payment, and PSE\'s relief plan runs to 2034, the longest runway in the set.',
    '限发量正在加速累积 — 2024年全年731GWh，至2025年9月已达1,131GWh — 且补偿低于发电商实际损失。拥塞以低价充电而非补偿的形式传导至储能，而PSE的缓解计划延续至2034年，是本样本中最长的缓冲期。',
  ],
  gateNote: [
    'Curtailed volumes and compensation rates are published; the price a battery actually charges at during redispatch is not. The register reports the volume and the mechanism, not a modelled spread — gate G14.',
    '限发电量与补偿标准均有公开数据，但储能在再调度期间实际的充电价格并无公开信息。本登记表仅呈现电量与机制，不对价差建模 — 研究缺口G14。',
  ],

  zones: [
    {
      id: 'pl-north-south',
      bearsOn: 'merchGross',
      name: ['North–south transfer corridor', '南北输送走廊'],
      shape: 'interface',
      coords: [[16.90, 54.20], [18.30, 52.60], [19.05, 50.70]],
      direction: 'export',
      intensity: 1.0,
      metrics: [
        { label: ['Non-market RES curtailment', '非市场化新能源限发量'],
          value: ['1,131 GWh by September', '截至9月为1,131GWh'], period: ['2025', '2025年'] },
        { label: ['Prior full year', '上一完整年度'],
          value: ['731 GWh', '731GWh'], period: ['2024', '2024年'] },
      ],
      capture: {
        mechanism: CAPTURE.REGULATED_COMPENSATION,
        text: [
          'Curtailed generators receive PLN 200–250/MWh against reported losses of PLN 400–600/MWh. A battery receives nothing directly — it earns by charging into the depressed prices the redispatch creates, which makes this a wholesale spread position rather than a compensation claim.',
          '被限发的发电商获得每MWh 200–250兹罗提补偿，而据报实际损失为每MWh 400–600兹罗提。储能不直接获得补偿 — 其收益来自在再调度所压低的价格下充电，因此这属于批发价差头寸，而非补偿请求权。',
        ],
      },
      relief: {
        project: ['Internal HVDC link, TGDP 2025–2034', '国内高压直流线路，2025–2034年输电网发展计划'],
        operator: 'PSE',
        scope: ['HVDC between the northern and southern areas, alongside roughly 4,700 km of new 400 kV circuits by 2034',
                '连接北部与南部区域的高压直流线路，并配套至2034年新增约4,700公里400千伏回路'],
        expected: 2034,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'The longest relief runway on the platform, and PSE states the alternative to the HVDC is significant and costly constraints — which is the operator confirming the constraint persists until the link lands. But "proposed" is doing real work in that sentence: a 2034 corridor is a chain of consents, procurements and outages, and the platform already treats a corridor as a chain of projects rather than one date.',
        '本平台中最长的缓冲期，且PSE明确表示高压直流线路的替代方案是显著且高成本的约束 — 这相当于运营商确认约束将持续至该线路建成。但“提议中”一词在此并非虚设：2034年的走廊工程是一连串许可、采购与停电计划，本平台亦一贯将走廊视为一串项目而非单一日期。',
      ],
      source: 'PSE Transmission Grid Development Plan 2025–2034',
      sourceUrl: URL.tgdp,
    },

    {
      id: 'pl-solar-redispatch',
      bearsOn: 'merchGross',
      name: ['Midday solar redispatch', '午间光伏再调度'],
      shape: 'zone',
      coord: [21.00, 51.80],
      direction: 'export',
      intensity: 0.85,
      metrics: [
        { label: ['Solar curtailed in a single month', '单月光伏限发量'],
          value: ['223 GWh', '223GWh'], period: ['April 2025', '2025年4月'] },
        { label: ['Non-market redispatch days that month', '当月非市场化再调度天数'],
          value: ['more than 25', '超过25天'], period: ['April 2025', '2025年4月'] },
      ],
      capture: {
        mechanism: CAPTURE.REGULATED_COMPENSATION,
        text: [
          'A daily, seasonal and highly predictable charging window — redispatch on more than 25 days of a single month is close to a standing midday event, which is the shape a two- to four-hour battery is built for.',
          '这是一个每日、季节性且高度可预测的充电窗口 — 单月超过25天的再调度已接近常态化的午间事件，正契合2至4小时储能的设计场景。',
        ],
      },
      relief: {
        project: ['400 kV reinforcement programme, TGDP 2025–2034', '400千伏增容计划，2025–2034年输电网发展计划'],
        operator: 'PSE',
        scope: ['Roughly 4,700 km of new 400 kV circuits plus 1,050 Mvar of synchronous compensation',
                '新增约4,700公里400千伏回路，并配套1,050Mvar同步调相容量'],
        expected: 2034,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'This is the Polish congestion case in its most usable form: a repeating, dated, published event rather than a statistical average. It is also the case most exposed to the platform\'s own merchant assumption — Poland\'s merchant seed does not separate congestion-driven charging from ordinary spread, so a reader treating the two as additive is counting the same hours twice.',
        '这是波兰拥塞逻辑最可用的形态：一个重复出现、有明确日期、公开可查的事件，而非统计平均值。它同时也是最受本平台自身市场化假设影响的部分 — 波兰的市场化收入种子值并未将拥塞驱动的充电与常规价差分开，因此若将二者相加，等于对同一批小时数重复计算。',
      ],
      source: 'PSE redispatch reporting; URE compensation rules',
      sourceUrl: URL.ure,
    },
  ],
};

export default PL_CONGESTION;
