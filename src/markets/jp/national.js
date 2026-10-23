/* ---------------------------------------------------------------------------
   Japan — national market architecture.

   Stored ONCE. Tokyo, Kyushu and Hokkaido share one national rulebook; the
   Capacity Market, LTDA and Balancing Market rules must never be duplicated into
   three regional code paths. Regional facts live in regions.js.

   Rule vintages are effective-dated because several are moving: EPRX rules
   effective 1 Jul 2026, and LTDA Round 3 results are final as of 13 May 2026.
   --------------------------------------------------------------------------- */

export const JP_NATIONAL = {
  asOf: '2026-08-04',
  timezone: 'JST',
  currency: 'JPY',

  /* The four monetization channels. `areaSpecific` marks where the value is set
     per area rather than nationally — this is the whole reason three regional
     lenses exist. */
  stack: [
    {
      n: ['JEPX Day-Ahead (spot)', 'JEPX日前市场（スポット市場）'],
      pay: ['Energy, per 30-minute block at the Area Price', '电能量，按30分钟时段的区域价格结算'],
      tenor: ['Continuous', '持续'],
      obligation: ['None beyond delivery', '除交付外无其他义务'],
      areaSpecific: true,
      rule: ['JEPX market rules, current', 'JEPX市场规则，现行'],
    },
    {
      n: ['JEPX Intraday (time-ahead)', 'JEPX日内市场（時間前市場）'],
      pay: ['Energy, continuous trading to gate closure', '电能量，连续交易至闸门关闭'],
      tenor: ['Continuous', '持续'],
      obligation: ['Imbalance exposure', '偏差敞口'],
      areaSpecific: true,
      rule: ['JEPX market rules, current', 'JEPX市场规则，现行'],
    },
    {
      n: ['EPRX Balancing Market', 'EPRX需给调整市场'],
      pay: ['Capability (ΔkW) and energy (ΔkWh) by product', '按品种的容量(ΔkW)与电量(ΔkWh)付费'],
      tenor: ['Day-ahead, in 30-minute units, for all five products since 14 Mar 2026 delivery (primary to tertiary-1 were week-ahead in three-hour blocks)', '自2026年3月14日实需给起，五个品种均在前一日以30分钟为单位交易（一次至三次①此前为前一周、以3小时为单位）'],
      obligation: ['Availability, telemetry, response performance', '可用性、遥测与响应性能'],
      areaSpecific: true,
      rule: ['EPRX trading rules effective 1 Jul 2026. ΔkW cap on primary, secondary-1 and the composite product: ¥19.51 → ¥15.00 per ΔkW per 30 min from 14 Mar 2026, → ¥10.00 from 1 Sep 2026; secondary-2 and tertiary-1 ¥7.21; tertiary-2 uncapped. Primary and secondary-1 procured at 1σ, was 3σ', 'EPRX交易规则，2026年7月1日生效。一次、二次①及复合品种的ΔkW上限价格：自2026年3月14日由每ΔkW·30分钟¥19.51降至¥15.00，自2026年9月1日降至¥10.00；二次②与三次①为¥7.21；三次②不设上限。一次与二次①的募集量由3σ削减至1σ'],
    },
    {
      n: ['OCCTO Capacity Market — Main Auction', 'OCCTO容量市场 — 主拍卖（メインオークション）'],
      pay: ['Area clearing price × Expected Capacity', '区域出清价 × 期待容量'],
      tenor: ['One delivery year per auction', '每次拍卖对应一个实需年度'],
      obligation: ['Availability in the delivery year; penalties for shortfall', '实需年度可用性义务；不足则罚'],
      areaSpecific: true,
      rule: ['Delivery year 2029 result is the current reference', '以2029实需年度结果为当前基准'],
    },
    {
      n: ['Long-Term Decarbonization Power Source Auction (LTDA)', '长期脱碳电源拍卖（長期脱炭素電源オークション）'],
      pay: ['Fixed long-term capacity payment, net of other-market revenue sharing', '固定长期容量付费，扣除其他市场收入分享'],
      tenor: ['Long-term award (auction-vintage specific)', '长期中标（按拍卖年份而定）'],
      obligation: ['Delivery, plus return of a share of other-market revenue', '交付义务，并返还部分其他市场收入'],
      areaSpecific: false,
      rule: ['Round 3 final: 6h receives partial credit, 8h+ full credit; 30% single-country sourcing cap. Round 4 (bids Jan–Feb 2027): lithium-ion capped at 400 MW with certified-cell projects awarded first', '第三轮最终规则：6小时获部分信用，8小时以上获全额信用；单一国家采购上限30%。第四轮（2027年1–2月投标）：锂离子上限40万kW，使用认定电芯的项目优先中标'],
    },
  ],

  /* Balancing products. National definitions, area-specific outcomes. */
  balancingProducts: [
    { n: ['Primary (FCR)', '一次调整力'], jp: '一次調整力', resp: ['≤10 s online / ≤30 s offline', 'online≤10秒 / offline≤30秒'], dur: ['≥5 min online', 'online≥5分钟'] },
    { n: ['Secondary 1 (S-1)', '二次调整力①'], jp: '二次調整力①', resp: ['≤5 min', '≤5分钟'], dur: ['≥30 min', '≥30分钟'] },
    { n: ['Secondary 2 (S-2)', '二次调整力②'], jp: '二次調整力②', resp: ['≤5 min', '≤5分钟'], dur: ['≥30 min', '≥30分钟'] },
    { n: ['Tertiary 1 (T-1)', '三次调整力①'], jp: '三次調整力①', resp: ['≤15 min', '≤15分钟'], dur: ['≥30 min', '≥30分钟'] },
    { n: ['Tertiary 2 (T-2)', '三次调整力②'], jp: '三次調整力②', resp: ['≤60 min', '≤60分钟'], dur: ['≥30 min', '≥30分钟'] },
  ],

  /* Capacity Market — delivery year 2029 main-auction result by area.
     Source: OCCTO 2029 materials. These are the anchor numbers for the whole
     Japan build; everything else regional is derived or seed. */
  capacity2029: {
    deliveryYear: '2029',
    areas: [
      { id: 'hokkaido', n: ['Hokkaido', '北海道'], priceJPYkW: 14972, contractedKW: 5461594 },
      { id: 'tokyo',    n: ['Tokyo', '东京'],       priceJPYkW: 15111, contractedKW: 52376601 },
      { id: 'kyushu',   n: ['Kyushu', '九州'],      priceJPYkW: 15112, contractedKW: 18363521 },
    ],
    note: [
      'The three area prices sit in a narrow band — Hokkaido is about 0.9% below Kyushu. Regional differentiation therefore has to come from wholesale capture, curtailment, balancing saturation, grid access and execution, not from the headline capacity price.',
      '三个区域价格处于窄带之内 — 北海道约低于九州0.9%。因此区域差异必须来自现货捕获、弃电、调整力饱和、并网条件与执行能力，而非容量价格本身。',
    ],
  },

  /* Revenue classification. This is what the global engine consumes; getting it
     wrong is what would overstate Japan. */
  revenueClasses: [
    { k: 'secured', n: ['Secured contracted', '已锁定合同'],
      d: ['An executed award or contract covering the modelled year. A Capacity Market main-auction payment is secured for its delivery year only.',
          '覆盖所建模年度的已执行中标或合同。容量市场主拍卖付费仅对其实需年度构成锁定。'] },
    { k: 'renewal', n: ['Auction-renewal', '拍卖续约'],
      d: ['Future auction clearings assumed but not won. Modelled as market risk and discounted at the market yield, never at the contracted yield.',
          '假设但尚未中标的未来拍卖出清。按市场风险建模并以市场折现率折现，绝不按合同折现率处理。'] },
    { k: 'merchant', n: ['Merchant + services', '市场化+系统服务'],
      d: ['JEPX energy plus incremental balancing value, net of the optimiser fee.',
          'JEPX电能量加调整力增量价值，已扣除优化商费用。'] },
  ],

  policy: {
    ltdaRound3: ['LTDA Round 3 results published 13 May 2026 — final for the reviewed vintage; 6h is partly de-rated, 8h+ receives full credit and sourcing is capped. Round 4 (FY2026) outline published 2 September 2026: bids 27 January–3 February 2027; lithium-ion capped at 400 MW, with cells from makers certified under the Economic Security Promotion Act awarded first; non-lithium batteries capped at 400 MW under a 30% per-country cell limit; six continuous hours minimum; battery bid ceiling ¥70,675–74,417/kW/yr by area.',
                 'LTDA第三轮结果于2026年5月13日公布 — 对本次复核年份为最终结果；6小时部分折减、8小时以上全额信用并设采购来源上限。第四轮（2026财年）募集要纲已于2026年9月2日公布：投标期为2027年1月27日至2月3日；锂离子电池上限40万kW，使用经《经济安全保障推进法》认定厂商电芯者优先中标；非锂电池上限40万kW，并适用单一国家电芯30%限制；最低连续6小时；蓄电池投标上限按区域为每kW每年¥70,675–74,417。'],
    eprxVintage: ['EPRX trading rules and guide effective 1 July 2026 are the current balancing-market rule snapshot.',
                  'EPRX交易规则及指引自2026年7月1日生效，为当前调整力市场规则快照。'],
  },
};

export default JP_NATIONAL;
