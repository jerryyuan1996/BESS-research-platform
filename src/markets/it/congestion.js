/* ---------------------------------------------------------------------------
   Italy — congestion register.

   Italy is the market where congestion is not a footnote to the investment case;
   it IS the investment case. Terna did not merely publish a constraint map — it
   built a procurement mechanism shaped like one.

   MACSE IS THE CONGESTION INSTRUMENT. Terna set the first auction's requirement
   at ZERO GWh for the North and Centre-North and put the whole 10 GWh in Centro
   Sud, Sud e Calabria, Sicilia and Sardegna. The second auction, scheduled for
   24 November 2026 at 16 GWh, tilts further south again — South and Calabria's
   ceiling rises from 7 to 11.5 GWh and Sicily's floor doubles to 1 GWh. A
   northern Italian battery has no MACSE route at all, and that is a locational
   decision by the TSO rather than a market outcome.

   That makes Italy the mirror image of Germany and Great Britain. Both of those
   rejected zonal pricing in 2025, so their congestion never becomes a price a
   battery can trade. Italy keeps zonal pricing AND runs a zonal procurement on
   top of it — the clearest published locational signal on this platform.

   THE PRICE OF THAT SIGNAL IS OBSERVABLE. Sicily cleared MACSE at €15,846 per
   MWh per year against €12,146 in Sud e Calabria — a 30% premium for the same
   product on the other side of a constraint. That spread is the cleanest proxy
   this platform has for what a specific constraint is worth.

   THE RELIEF IS FUNDED AND DATED. Terna's 2025–2034 Development Plan commits
   more than €23bn, and the named submarine projects — Tyrrhenian Link, Adriatic
   Link, SA.CO.I.3 and ELMED — carry commissioning years between 2028 and 2030.
   The Sicilian premium a battery is siting for today has a published end date.
   --------------------------------------------------------------------------- */
/* Two capture mechanisms were added to the governed vocabulary for this market,
   because neither existed before it. LOCATIONAL_PROCUREMENT is MACSE: an auction
   the operator can WIN, priced by zone — the mirror image of Romania's connection
   auction, which is the same instrument shape with the money running the other
   way. ZONAL_PRICE is the plain fact that Italy settles by zone, so a constraint
   reaches the wholesale price without any instruction, market or contract in
   between. Great Britain and Germany each voted in 2025 not to have that. */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  macse: 'https://www.terna.it/en/media/press-releases/detail/completed-first-macse-auction',
  plan: 'https://www.terna.it/en/electric-system/grid/national-electricity-transmission-grid-development-plan',
  tyrrhenian: 'https://www.terna.it/en/projects/public-engagement/tyrrhenian-link',
  adriatic: 'https://www.terna.it/en/projects/public-engagement/adriatic-link',
  elmed: 'https://www.terna.it/en/projects/public-engagement/elmed',
};

export const IT_CONGESTION = {
  marketId: 'it',
  summary: [
    'The clearest published locational signal on the platform. Terna set the first MACSE auction requirement at zero for the North and Centre-North and put all 10 GWh in the south and the islands, so a northern battery has no award route at all. Sicily cleared 30% above Sud e Calabria for the same product — a directly observable price for one constraint.',
    '本平台上最清晰的公开区位信号。Terna将首次MACSE拍卖在北部与中北部的需求设为零，将全部10GWh配置于南部与岛屿地区，因此北部储能完全没有中标路径。西西里同一产品的出清价高出南部及卡拉布里亚30% — 这是对单一约束可直接观测的定价。',
  ],
  gateNote: [
    'Terna publishes MACSE zonal requirements, clearing prices and the Development Plan; it does not publish 2025 curtailment volumes in GWh or the north–south transfer limit in MW. The zonal MACSE spread is used as a proxy for constraint value, not as a measurement of it — gate G14.',
    'Terna公布MACSE分区需求、出清价格及发展规划，但不公布2025年以GWh计的限电量或以MW计的南北输送限额。MACSE分区价差被用作约束价值的代理指标，而非其实测值 — 研究缺口G14。',
  ],

  zones: [
    {
      id: 'it-sicily',
      bearsOn: 'ltda.payment',
      name: ['Sicily — separate bidding zone', '西西里 — 独立报价区'],
      shape: 'zone',
      coord: [13.70, 37.99],
      direction: 'export',
      intensity: 1.0,
      metrics: [
        { label: ['MACSE clearing price', 'MACSE出清价格'],
          value: ['€15,846/MWh/yr — highest of any zone, ~30% above Sud e Calabria',
                  '每MWh每年€15,846 — 各区域最高，较南部及卡拉布里亚高约30%'],
          period: ['first auction, September 2025', '首次拍卖，2025年9月'] },
        { label: ['MSD up-regulation price', '辅助服务市场上调电价'],
          value: ['≈€320/MWh, against ≈€250 in Centre-South', '约€320/MWh，中南部约为€250'],
          period: ['Jan–May 2025', '2025年1–5月'] },
      ],
      capture: {
        mechanism: CAPTURE.LOCATIONAL_PROCUREMENT,
        text: [
          'Uniquely on this platform, the constraint is priced in an auction the operator can WIN rather than one it must pay to enter. Sicily\'s 30% MACSE premium over the southern mainland is the TSO paying more for storage where the network needs it more — a locational signal that Germany and Great Britain both chose not to create.',
          '在本平台中独一无二：该约束的定价体现在运营方可以中标的拍卖之中，而非其必须付费进入的拍卖。西西里MACSE价格较南部大陆高出30%，是电网运营商在其更需要储能之处支付更高价格 — 而德国与英国均选择不建立此类区位信号。',
        ],
      },
      relief: {
        project: ['Tyrrhenian Link — East branch', '第勒尼安互联 — 东段'],
        operator: 'Terna',
        scope: ['Part of a 1,000 MW, 970 km, €3.7bn double 500 kV HVDC submarine scheme connecting Sicily to Campania and to Sardinia; under construction since January 2025',
                '属1,000MW、970公里、37亿欧元的双回500千伏海底高压直流工程，连接西西里与坎帕尼亚及撒丁岛；自2025年1月起施工'],
        expected: 2028,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'The Sicilian premium is real, published and dated. A MACSE award won in Sicily runs fifteen years from 2028; the Tyrrhenian Link East branch commissions in the same year. That is not a coincidence a developer should ignore — Terna is procuring storage to bridge a constraint it is simultaneously building out of existence, and the second auction in November 2026 doubles Sicily\'s floor to 1 GWh even so. Underwrite the award, not the premium: the contract is fifteen years and the scarcity behind it may not be.',
        '西西里的溢价真实存在、已公开且有明确期限。在西西里中标的MACSE合同自2028年起为期十五年；第勒尼安互联东段亦于同年投运。这一巧合不应被开发商忽视 — Terna正在采购储能以弥合一项其同时正在通过工程消除的约束，而2026年11月的第二次拍卖仍将西西里的下限翻倍至1GWh。承销依据应为中标合同而非溢价：合同期为十五年，而其背后的稀缺性未必如此。',
      ],
      source: 'Terna MACSE auction results, September 2025; Terna Tyrrhenian Link',
      sourceUrl: URL.tyrrhenian,
    },

    {
      id: 'it-north-south',
      bearsOn: 'merchGross',
      name: ['North–south backbone', '南北骨干输电通道'],
      shape: 'interface',
      coords: [[14.13, 42.35], [13.50, 42.40], [11.50, 44.20]],
      direction: 'export',
      intensity: 0.9,
      metrics: [
        { label: ['MACSE requirement set for the North and Centre-North', 'MACSE为北部与中北部设定的需求'],
          value: ['0 GWh of 10 GWh', '10GWh中的0GWh'], period: ['first auction, 2025', '首次拍卖，2025年'] },
        { label: ['Wholesale spread, North against South mainland', '批发价差，北部对南部大陆'],
          value: ['€98,000 against €123,000/MW/yr, 4h basis', '每MW每年€98,000对€123,000，4小时口径'],
          period: ['Modo forecast, July 2026', 'Modo预测，2026年7月'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'Renewable generation is concentrated in the south and demand in the industrial north, and Terna\'s answer was to buy storage where the generation is rather than where the load is. For a northern developer the consequence is stark: no MACSE route exists, so the only contracted option is the capacity market or a bilateral toll.',
          '新能源发电集中于南部，而需求集中于北部工业区，Terna的应对是在发电侧而非负荷侧采购储能。对北部开发商而言后果十分明确：不存在MACSE路径，唯一的合同化选项是容量市场或双边租赁。',
        ],
      },
      relief: {
        project: ['Terna Development Plan 2025–2034', 'Terna 2025–2034年发展规划'],
        operator: 'Terna',
        scope: ['More than €23bn over ten years, of which €16.6bn across 2024–2028; approved and in execution',
                '十年投资超过230亿欧元，其中2024–2028年为166亿欧元；已获批准并在执行中'],
        expected: 2034,
        status: RELIEF_STATUS.APPROVED,
      },
      investor: [
        'The zonal wholesale spread understates the difference between north and south, because it excludes both MSD and the MACSE route the north cannot access. Read the €98,000 and €123,000 as the floor of a gap rather than its measure. That said, a programme date of 2034 is the weakest form of relief evidence on this platform — it is a decade of capital expenditure rather than a commissioning year, and only the named submarine projects below carry dates worth underwriting to.',
        '分区批发价差低估了南北差异，因为它既不含辅助服务市场收入，也不含北部无法进入的MACSE路径。应将€98,000与€123,000视为该差距的下限而非其实际值。不过，2034年这样的计划期限是本平台上证据力最弱的缓解依据 — 它代表的是十年资本开支而非投运年份，只有下方具名的海底工程才具备值得承销的日期。',
      ],
      source: 'Terna MACSE zonal requirements; Modo Energy July 2026 Italy forecast; Terna Development Plan 2025–2034',
      sourceUrl: URL.plan,
    },

    {
      id: 'it-sardinia',
      bearsOn: 'services',
      name: ['Sardinia — island system', '撒丁岛 — 孤岛系统'],
      shape: 'zone',
      coord: [9.25, 39.18],
      direction: 'both',
      intensity: 0.8,
      metrics: [
        { label: ['Share of the national BESS fleet on one island', '单一岛屿占全国储能装机比例'],
          value: ['≈800 MW of Italy\'s 1.9 GW operational', '意大利1.9GW已投运装机中约800MW'],
          period: ['end 2025', '2025年底'] },
        { label: ['Balancing share of BESS revenue', '平衡服务占储能收入比例'],
          value: ['≈20%, against ≈10% on the southern mainland and near zero in the North',
                  '约20%，南部大陆约10%，北部接近零'],
          period: ['Modo forecast', 'Modo预测'] },
      ],
      capture: {
        mechanism: CAPTURE.BALANCING,
        text: [
          'The one Italian zone where MSD does most of the work: balancing is roughly twice the share of revenue it carries on the southern mainland, which is what a small load on a weakly connected island produces. Sardinia also cleared MACSE at €15,029/MWh/yr, second only to Sicily.',
          '这是意大利唯一一个辅助服务市场承担主要作用的区域：平衡服务收入占比约为南部大陆的两倍，这正是弱联网岛屿上小规模负荷所导致的结果。撒丁岛MACSE出清价为每MWh每年€15,029，仅次于西西里。',
        ],
      },
      relief: {
        project: ['Tyrrhenian Link West branch and SA.CO.I.3', '第勒尼安互联西段与SA.CO.I.3'],
        operator: 'Terna',
        scope: ['The West branch of the €3.7bn 1,000 MW Tyrrhenian scheme, plus SA.CO.I.3 at 400 MW renewing the Sardinia–Corsica–Tuscany link; land-based construction started',
                '37亿欧元、1,000MW第勒尼安工程的西段，以及400MW的SA.CO.I.3工程，更新撒丁岛—科西嘉—托斯卡纳联络线；陆上工程已开工'],
        expected: 2028,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'Sardinia holds close to half the national battery fleet on a fraction of the national load, which is the constraint stated as a build-out rather than as a number. That concentration is also the risk: the MSD depth a Sardinian case depends on is being competed for by the assets already there, and two interconnectors land in 2028. This is the Italian zone where the platform would most want a published curtailment series and does not have one.',
        '撒丁岛以占全国一小部分的负荷承载了接近半数的全国储能装机，这是以建设规模而非数字形式呈现的约束。这种集中同时构成风险：撒丁岛投资逻辑所依赖的辅助服务市场深度，正被已在当地的资产所争夺，且两条互联线将于2028年投运。这是本平台最希望获得公开限电数据序列、却未能取得的意大利区域。',
      ],
      source: 'Modo Energy Italy Buildout Report 2026; Terna Tyrrhenian Link and SA.CO.I.3',
      sourceUrl: URL.tyrrhenian,
    },

    {
      id: 'it-adriatic',
      bearsOn: 'merchGross',
      name: ['Adriatic corridor — Marche to Abruzzo', '亚得里亚海走廊 — 马尔凯至阿布鲁佐'],
      shape: 'interface',
      coords: [[13.02, 43.84], [13.60, 43.10], [14.13, 42.35]],
      direction: 'export',
      intensity: 0.6,
      metrics: [
        { label: ['Relief scheme cable contract', '缓解工程电缆合同'],
          value: ['≈€630m awarded for submarine cable supply and installation',
                  '海底电缆供应与敷设合同金额约6.3亿欧元'],
          period: ['contracted', '已签约'] },
        { label: ['Renewables share of national demand', '新能源占全国需求比例'],
          value: ['41%, down from 42%', '41%，低于此前的42%'], period: ['2025', '2025年'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'A corridor constraint on the eastern spine, relieved by a project already under contract. Its investment relevance is mainly as a date: it is the second of the four submarine schemes to land and it sits inside a fifteen-year MACSE term beginning in 2028.',
          '东部主干线上的走廊约束，将由一项已签约工程予以缓解。其投资意义主要在于时间节点：它是四项海底工程中第二个投运的，且落在自2028年起的十五年MACSE合同期之内。',
        ],
      },
      relief: {
        project: ['Adriatic Link', '亚得里亚海互联'],
        operator: 'Terna',
        scope: ['1,000 MW HVDC over 250 km, of which 210 km submarine, Fano in Marche to the Cepagatti area in Abruzzo; cable laying to conclude in the first half of 2028',
                '1,000MW高压直流，全长250公里，其中海底段210公里，自马尔凯大区法诺至阿布鲁佐大区切帕加蒂地区；电缆敷设将于2028年上半年完成'],
        expected: 2029,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'Included because it dates the eastern corridor, not because it is the largest constraint. The broader point it illustrates is the one that separates Italy from every other market here: four named submarine projects with commissioning years between 2028 and 2030 mean an Italian congestion case has a genuinely measurable runway, rather than the open-ended "programme" dates that weaken the German and NEM registers.',
        '将其列入是为了明确东部走廊的时间节点，而非因其为最大约束。它所体现的更广泛意义，正是意大利区别于本平台其他所有市场之处：四项具名海底工程的投运年份介于2028至2030年之间，意味着意大利的拥塞投资逻辑具有真正可衡量的窗口期，而非削弱德国与NEM登记表的那种无明确期限的"计划"日期。',
      ],
      source: 'Prysmian Adriatic Link cable contract; Terna Development Plan 2025–2034',
      sourceUrl: URL.adriatic,
    },
  ],
};

export default IT_CONGESTION;
