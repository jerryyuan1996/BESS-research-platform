/* ---------------------------------------------------------------------------
   Japan — congestion registers, one per area.

   Japan is the only market on this platform where the three allocation points
   have genuinely different congestion, which is the premise the three-region
   split was built on. The comparison engine already finds the areas nearly
   identical — Capacity Market area prices within 0.9%, and an LTDA award that is
   national by construction — so if anything separates Tokyo from Kyushu from
   Hokkaido, it has to be here.

   It is. And the direction is the opposite of the intuition:

     Kyushu     the highest curtailment in the country, 5.9% forecast for FY2025,
                and a ¥441.2bn interconnector already commissioned to relieve it
     Hokkaido   the most persistent curtailment in the modelling, weak export
                capability, and a 2 GW / 800 km HVDC link in development
     Tokyo      curtailment ARRIVED in March 2026 — the last area in Japan to see
                it, and therefore the only one where the constraint is growing
                rather than being relieved

   Read that as an investment sequence rather than a ranking. Kyushu and Hokkaido
   have large constraints with named, funded relief on an 11-13.5 year build.
   Tokyo has a small constraint with no relief project, because until March 2026
   it had no constraint to relieve. Whether that is the beginning of a trend or a
   single tight spring is the whole question, and one month of data does not
   answer it.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  occto: 'https://www.occto.or.jp/en/',
  masterplan: 'https://www.occto.or.jp/en/information_disclosure/master_plan/',
};

const gateNote = [
  'OCCTO publishes output-control rates and the interconnection master plan; it does not publish what a battery earns from either. The register reports the control regime and the relief projects, not a modelled revenue — gate G14.',
  'OCCTO公布出力控制率及互联主干规划，但不公布储能由此获得的收入。本登记表仅呈现控制机制与缓解工程，不对收入建模 — 研究缺口G14。',
];

/* The output-control regime is national, so the capture text is written once. */
const outputControl = (extra) => ({
  mechanism: CAPTURE.OUTPUT_CONTROL,
  text: extra,
});

export const JP_CONGESTION = {
  tokyo: {
    marketId: 'jp_tokyo',
    summary: [
      'The last area in Japan to see curtailment, and the only one where the constraint is growing rather than being relieved: output control reached the Tokyo area in March 2026. There is no relief project because until then there was nothing to relieve.',
      '日本最后出现限发的区域，也是唯一约束仍在扩大而非缓解的区域：出力控制已于2026年3月延伸至东京区域。此前无需缓解，故亦无相应工程。',
    ],
    gateNote,
    zones: [
      {
        id: 'jp-tokyo-first-curtailment',
        bearsOn: 'merchGross',
        name: ['First Tokyo-area output control', '东京区域首次出力控制'],
        shape: 'zone',
        coord: [139.95, 36.05],
        direction: 'export',
        intensity: 0.35,
        metrics: [
          { label: ['Curtailment status', '限发状态'],
            value: ['Reached the Tokyo area for the first time', '首次波及东京区域'],
            period: ['March 2026', '2026年3月'] },
          { label: ['National spread', '全国扩散进程'],
            value: ['Kyushu only to FY2021, then seven areas from FY2022, Chubu and Hokuriku FY2023, Tokyo 2026',
                    '2021财年前仅九州，2022财年起扩至七个区域，2023财年中部及北陆，2026年东京'],
            period: ['FY2021–2026', '2021–2026财年'] },
        ],
        capture: outputControl([
          'A first occurrence is a data point, not a trend, and it is the wrong basis for a fifteen-year charging assumption. What it does establish is that the Tokyo area is no longer structurally exempt — which removes the main reason to pay a premium for being inside TEPCO territory.',
          '首次发生属单一数据点而非趋势，不宜作为十五年充电假设的依据。但它确实表明东京区域已不再具有结构性豁免 — 这也消除了为身处东京电力辖区而支付溢价的主要理由。',
        ]),
        relief: {
          project: ['None published', '尚无公开工程'],
          operator: 'OCCTO / TEPCO Power Grid',
          scope: ['No area-specific relief project, because Tokyo-area curtailment is new',
                  '因东京区域限发系新出现现象，尚无针对该区域的缓解工程'],
          expected: null,
          status: RELIEF_STATUS.PROPOSED,
        },
        investor: [
          'This is the single most decision-relevant grid fact in the Japan build, and it cuts against the Tokyo thesis rather than for it. The platform already says being inside TEPCO territory is not an underwriting argument; curtailment arriving in March 2026 is the evidence for that sentence. Underwrite Tokyo-area price capture and connection quality, and treat the first curtailment month as a reason to re-check both.',
          '这是日本模型中对决策最具影响的电网事实，且其指向不利于而非有利于东京投资逻辑。本平台已指出，身处东京电力辖区本身不构成承销理由；2026年3月出现的限发正是该判断的证据。承销依据应为东京区域价格兑现与并网质量，并应将首个限发月份视为重新核查二者的理由。',
        ],
        source: 'OCCTO output-control reporting, March 2026',
        sourceUrl: URL.occto,
      },
    ],
  },

  kyushu: {
    marketId: 'jp_kyushu',
    summary: [
      'The highest curtailment rate in Japan — 5.9% forecast for FY2025 — and the only Japanese constraint with a costed, nationally-directed interconnector already assigned to it. The relief is real but slow: an 11 to 13.5 year build.',
      '日本限发率最高的区域 — 2025财年预测为5.9% — 也是唯一已由国家指定并完成造价评估的互联工程所对应的约束。缓解措施确实存在但进程缓慢：建设期为11至13.5年。',
    ],
    gateNote,
    zones: [
      {
        id: 'jp-kyushu-solar-surplus',
        bearsOn: 'merchGross',
        name: ['Kyushu solar surplus and export limit', '九州光伏盈余与送出限制'],
        shape: 'zone',
        coord: [130.75, 32.75],
        direction: 'export',
        intensity: 1.0,
        metrics: [
          { label: ['Forecast output-control rate', '预测出力控制率'],
            value: ['5.9% — highest of any area', '5.9% — 各区域最高'], period: ['FY2025', '2025财年'] },
          { label: ['Next highest areas', '其次区域'],
            value: ['Shikoku 3.8%, Tohoku 3.0%, Chugoku 1.5%', '四国3.8%、东北3.0%、中国1.5%'],
            period: ['FY2025', '2025财年'] },
        ],
        capture: outputControl([
          'Curtailment concentrated in daylight hours on a peninsula with limited export capability is the most predictable charging window in the Japanese set. It is also the one a six-hour asset — the duration the LTDA now requires — is well shaped to absorb.',
          '在送出能力有限的半岛上、集中于日间时段的限发，是日本各区域中最可预测的充电窗口，也最适合长期脱碳拍卖所要求的六小时资产吸纳。',
        ]),
        relief: {
          project: ['Chugoku–Kyushu interconnection', '中国—九州联络线'],
          operator: 'OCCTO, at national government request',
          scope: ['¥441.2bn, scalable to 2 GW, 11–13.5 year construction period; initiated 2024 in response to Kyushu curtailment',
                  '造价4,412亿日元，可扩展至2GW，建设期11–13.5年；2024年为应对九州限发问题启动'],
          expected: 2037,
          status: RELIEF_STATUS.APPROVED,
        },
        investor: [
          'An 11 to 13.5 year build started in 2024 does not relieve anything inside a fifteen-year investment window — which makes Kyushu the rare case where a named, funded relief project is not a reason to discount the constraint. Note the direction of the modelling though: high-renewables scenarios show southern Kyushu curtailment falling sharply, so the relief may partly arrive through the market rather than through the wire.',
          '2024年启动、建设期11至13.5年的工程，在十五年投资窗口内无法缓解任何约束 — 这使九州成为少见的情形：具名且已获资金的缓解工程并不构成折减该约束的理由。但需注意模型方向：高比例新能源情景显示九州南部限发将大幅下降，因此缓解可能部分通过市场而非电网实现。',
        ],
        source: 'OCCTO FY2025 output-control outlook; OCCTO interconnection master plan',
        sourceUrl: URL.masterplan,
      },
    ],
  },

  hokkaido: {
    marketId: 'jp_hokkaido',
    summary: [
      'The most persistent curtailment in OCCTO\'s own modelling — northern Hokkaido stays curtailed under both the base and high-renewables scenarios — against a 2 GW, 800 km HVDC link that has been in formal development planning since 2022.',
      '在OCCTO自身模型中限发最为持续的区域 — 北海道北部在基准与高比例新能源两种情景下均持续受限 — 与之对应的是一条自2022年起进入正式开发规划的2GW、800公里高压直流线路。',
    ],
    gateNote,
    zones: [
      {
        id: 'jp-hokkaido-export',
        bearsOn: 'merchGross',
        name: ['Northern Hokkaido export constraint', '北海道北部送出约束'],
        shape: 'zone',
        coord: [142.40, 44.20],
        direction: 'export',
        intensity: 0.9,
        metrics: [
          { label: ['Modelled persistence', '模型持续性'],
            value: ['Curtailment remains concentrated in northern Hokkaido under both base and high-renewables scenarios',
                    '在基准与高比例新能源两种情景下，限发均集中于北海道北部'],
            period: ['OCCTO scenarios', 'OCCTO情景'] },
        ],
        capture: outputControl([
          'The most durable curtailment window in Japan by the operator\'s own modelling — it survives the scenario in which everything else is relieved. That durability is the asset here, more than the depth.',
          '按运营商自身模型，这是日本最持久的限发窗口 — 即使在其他约束均获缓解的情景下仍然存在。此处的价值在于其持久性，而非限发深度。',
        ]),
        relief: {
          project: ['Hokkaido–Honshu HVDC, Japan Sea route', '北海道—本州高压直流，日本海路线'],
          operator: 'OCCTO / designated business operators',
          scope: ['2 GW, 800 km undersea HVDC within the 4 GW Japan Sea corridor; formal development planning from July 2022, basic requirements approved April 2024',
                  '4GW日本海走廊内的2GW、800公里海底高压直流；2022年7月进入正式开发规划，2024年4月基本要件获批'],
          expected: 2039,
          status: RELIEF_STATUS.APPROVED,
        },
        investor: [
          'Hokkaido is the Japanese area where the constraint outlasts the investment window with the highest confidence, because it is OCCTO\'s own high-renewables scenario saying so rather than a developer\'s. Set against that: it is also the area with the weakest local demand, so the same isolation that preserves the constraint limits what the discharge side is worth.',
          '在日本各区域中，北海道的约束延续超出投资窗口的确定性最高 — 因为这一判断出自OCCTO自身的高比例新能源情景，而非开发商。但另一方面：该区域本地负荷最弱，维持约束的同一孤立性也限制了放电侧的价值。',
        ],
        source: 'OCCTO interconnection master plan and scenario modelling',
        sourceUrl: URL.masterplan,
      },
    ],
  },
};

export default JP_CONGESTION;
