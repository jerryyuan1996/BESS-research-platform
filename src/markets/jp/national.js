/* ---------------------------------------------------------------------------
   Japan — national market architecture.

   Stored ONCE. Tokyo, Kyushu and Hokkaido share one national rulebook; the
   Capacity Market, LTDA and Balancing Market rules must never be duplicated into
   three regional code paths. Regional facts live in regions.js.

   Rule vintages are effective-dated because several are moving: EPRX rules
   effective 1 Jul 2026, and the FY2026 LTDA is in consultation, not final.
   --------------------------------------------------------------------------- */

export const JP_NATIONAL = {
  asOf: '2026-07-28',
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
      tenor: ['Weekly / daily procurement', '周度/日度采购'],
      obligation: ['Availability, telemetry, response performance', '可用性、遥测与响应性能'],
      areaSpecific: true,
      rule: ['EPRX trading rules effective 1 Jul 2026', 'EPRX交易规则，2026年7月1日生效'],
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
      rule: ['FY2026 solicitation in consultation 21 Jul – 3 Aug 2026', 'FY2026募集文件征询期：2026年7月21日–8月3日'],
    },
  ],

  /* Balancing products. National definitions, area-specific outcomes. */
  balancingProducts: [
    { n: ['Primary (FCR)', '一次调整力'], jp: '一次調整力', resp: ['≤10 s', '≤10秒'], dur: ['≥5 min', '≥5分钟'] },
    { n: ['Secondary 1 (S-1)', '二次调整力①'], jp: '二次調整力①', resp: ['≤5 min', '≤5分钟'], dur: ['≥30 min', '≥30分钟'] },
    { n: ['Secondary 2 (S-2)', '二次调整力②'], jp: '二次調整力②', resp: ['≤5 min', '≤5分钟'], dur: ['≥30 min', '≥30分钟'] },
    { n: ['Tertiary 1 (T-1)', '三次调整力①'], jp: '三次調整力①', resp: ['≤15 min', '≤15分钟'], dur: ['≥3 h', '≥3小时'] },
    { n: ['Tertiary 2 (T-2)', '三次调整力②'], jp: '三次調整力②', resp: ['≤45 min', '≤45分钟'], dur: ['≥3 h', '≥3小时'] },
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
    ltdaConsultation: ['FY2026 LTDA solicitation documents under public consultation 21 Jul – 3 Aug 2026 — draft, not final policy.',
                       'FY2026长期脱碳电源拍卖募集文件于2026年7月21日至8月3日公开征询 — 属草案，非最终政策。'],
    eprxVintage: ['EPRX trading rules and guide effective 1 July 2026 are the current balancing-market rule snapshot.',
                  'EPRX交易规则及指引自2026年7月1日生效，为当前调整力市场规则快照。'],
  },
};

export default JP_NATIONAL;
