/* ---------------------------------------------------------------------------
   WHAT COUNTS AS A TRANSMISSION LINE, PER MARKET.

   There is no global definition of "high voltage", and a single global threshold
   is wrong in both directions. Cut at 220 kV and Great Britain loses its entire
   Scottish transmission network and Western Australia's SWIS renders almost
   empty — 122 line segments for a market this platform underwrites. Cut at
   110 kV and PJM returns tens of thousands of segments, most of them
   sub-transmission, and the map stops being readable.

   So each market declares its own threshold, and each declaration cites the
   system operator that sets it. `bulkKV` is the backbone a reader should see
   first; `detailKV` is the operator's full transmission definition, revealed on
   zoom. Where the two are equal the operator draws no such distinction.

   AUTHORITY: methodology. These are readings of published operator definitions,
   not observations, and no feed proposes against them.
   --------------------------------------------------------------------------- */

/**
 * @typedef {object} VoltageDefinition
 * @property {number} bulkKV      backbone layer, shown at market zoom
 * @property {number} detailKV    full transmission definition, shown on zoom-in
 * @property {string} operator    the body whose definition this is
 * @property {string[]} levels    the nominal levels the operator names
 * @property {string} url         where the definition is published
 * @property {[string,string]} basis  bilingual note on why the cut sits here
 */

/** @type {Record<string, VoltageDefinition>} */
export const TRANSMISSION_VOLTAGE = {
  gb: {
    bulkKV: 275, detailKV: 132,
    operator: 'NESO / National Grid Electricity Transmission, SP Transmission, SSEN Transmission',
    levels: ['400 kV', '275 kV', '132 kV (Scotland)'],
    url: 'https://www.neso.energy/',
    basis: [
      'In England and Wales transmission is 400 kV and 275 kV and 132 kV is distribution; in the two Scottish transmission licence areas 132 kV IS transmission. The detail threshold is therefore 132 kV — cutting at 275 kV would erase the Scottish network, which is where the constrained storage pipeline actually sits.',
      '在英格兰与威尔士，输电网为400kV与275kV，132kV属配电；而在苏格兰两个输电牌照区，132kV即为输电网。因此细节阈值取132kV — 若按275kV截取将抹去苏格兰电网，而受阻储能管线恰恰集中于此。',
    ],
  },
  ie: {
    bulkKV: 220, detailKV: 110,
    operator: 'EirGrid',
    levels: ['400 kV', '220 kV', '110 kV'],
    url: 'https://www.eirgrid.ie/grid/transmission-policies-and-standards',
    basis: [
      'EirGrid operates the transmission system at 400 kV, 220 kV and 110 kV; ESB Networks takes over at 38 kV and below. 110 kV is transmission in Ireland, not sub-transmission, and most Irish battery connections are made at it.',
      'EirGrid以400kV、220kV及110kV运营输电系统，ESB Networks自38kV及以下接管。在爱尔兰110kV属输电而非次输电，且多数储能并网即在该电压等级。',
    ],
  },
  de: {
    bulkKV: 380, detailKV: 220,
    operator: '50Hertz, Amprion, TenneT DE, TransnetBW',
    levels: ['380 kV', '220 kV'],
    url: 'https://www.smard.de/page/en/wiki-article/5884/214026',
    basis: [
      'The German Übertragungsnetz is 380 kV and 220 kV. 110 kV is Hochspannung and belongs to the distribution operators, so it is outside the transmission definition however large the connected asset.',
      '德国输电网为380kV与220kV。110kV属高压配电、归配电网运营商所有，因此无论所接资产规模多大均不在输电定义之内。',
    ],
  },
  it: {
    bulkKV: 380, detailKV: 132,
    /* Italy is the one market whose RTN is large enough that a single file is
       not a sensible delivery unit — 15,079 line segments at 132 kV. The bands
       below are Terna's own voltage classes, and the ingestion pipeline emits
       one file per band so the backbone can load at national zoom and the
       132–150 kV detail only when a reader asks for it. Splitting the DELIVERY
       does not narrow the DEFINITION: `detailKV` is still 132 and every segment
       Terna operates is still ingested. */
    bands: [380, 220, 132],
    operator: 'Terna',
    levels: ['380 kV', '220 kV', '150 kV', '132 kV'],
    url: 'https://www.terna.it/en/about-us/business/italian-national-grid',
    basis: [
      'Terna operates the Rete di Trasmissione Nazionale from 380 kV down to 132 kV, so the RTN itself reaches lower than most European transmission definitions. 380/220 kV is altissima tensione; 150/132 kV is alta tensione and still Terna’s.',
      'Terna运营的国家输电网（RTN）自380kV下至132kV，其覆盖电压低于多数欧洲输电定义。380/220kV为超高压，150/132kV为高压且同属Terna。',
    ],
  },
  ro: {
    bulkKV: 400, detailKV: 220,
    operator: 'Transelectrica',
    levels: ['750 kV', '400 kV', '220 kV'],
    url: 'https://www.transelectrica.ro/',
    basis: [
      'Transelectrica operates 750 kV, 400 kV and 220 kV. The single 750 kV line is largely out of service and the 110 kV network sits with the distribution operators, so 220 kV is the floor of the transmission definition.',
      'Transelectrica运营750kV、400kV与220kV。唯一的750kV线路基本停运，110kV网络归配电运营商，因此220kV为输电定义下限。',
    ],
  },
  pl: {
    bulkKV: 400, detailKV: 220,
    operator: 'PSE',
    levels: ['400 kV', '220 kV'],
    url: 'https://www.pse.pl/home',
    basis: [
      'PSE owns and operates the extra-high-voltage network as 220 kV and 400 kV lines. 110 kV is the distribution operators’, so the transmission definition has a hard floor at 220 kV with no sub-transmission tier beneath it.',
      'PSE拥有并运营的超高压电网为220kV与400kV线路。110kV归配电运营商所有，因此输电定义在220kV处有明确下限，其下不存在次输电层级。',
    ],
  },
  fi: {
    bulkKV: 400, detailKV: 110,
    operator: 'Fingrid',
    levels: ['400 kV', '220 kV', '110 kV'],
    url: 'https://www.fingrid.fi/en/grid/development/power-transmission-grid-of-fingrid/',
    basis: [
      'Fingrid defines the main grid as the 400 kV, 220 kV and 110 kV high-voltage lines and substations in meshed operation — about 14,900 km of line and 138 substations, of which 5,400 km is 400 kV. Finland is one of the few systems where 110 kV is unambiguously transmission rather than distribution, because the operator says so and operates it.',
      'Fingrid将主网定义为处于网状运行的400kV、220kV与110kV高压线路及变电站 — 约14,900公里线路、138座变电站，其中400kV线路5,400公里。芬兰是少数几个110kV明确属于输电而非配电的系统之一，因为运营商如此定义并如此运营。',
    ],
  },
  jp_tokyo: JAPAN(),
  jp_kyushu: JAPAN(),
  jp_hokkaido: JAPAN(),
  wa: {
    bulkKV: 330, detailKV: 132,
    operator: 'Western Power (SWIS)',
    levels: ['330 kV', '220 kV', '132 kV', '66 kV'],
    url: 'https://www.westernpower.com.au/resources-education/our-network-the-grid/',
    basis: [
      'Western Power classes 330 kV, 220 kV and 132 kV as transmission on the SWIS, with 66 kV below it. A 220 kV cut returns roughly a hundred segments for the whole network and would not describe the system this platform underwrites.',
      '西澳电网公司将SWIS的330kV、220kV与132kV划为输电，其下为66kV。若按220kV截取，全网仅约一百段线路，无法描述本平台所承销的系统。',
    ],
  },
  nem: {
    bulkKV: 330, detailKV: 132,
    operator: 'AEMO and the NEM transmission network service providers',
    levels: ['500 kV', '330 kV', '275 kV', '220 kV', '132 kV', '110 kV'],
    url: 'https://aemo.com.au/en/energy-systems/electricity/national-electricity-market-nem/data-nem/network-data',
    basis: [
      'The NEM backbone runs at 500, 330, 275 and 220 kV depending on the state, and 132/110 kV is transmission in Tasmania and parts of South Australia. One national threshold cannot be right for both ends, so the bulk layer takes the backbone and the detail layer reaches the state networks.',
      'NEM主干电压随各州为500、330、275与220kV，而在塔斯马尼亚及南澳部分地区132/110kV即属输电。单一全国阈值无法兼顾两端，故主干层取骨干电压、细节层延伸至各州电网。',
    ],
  },
  pjm: {
    bulkKV: 345, detailKV: 230,
    operator: 'PJM Interconnection, under the NERC Bulk Electric System definition',
    levels: ['765 kV', '500 kV', '345 kV', '230 kV', '138 kV', '115 kV'],
    url: 'https://www.pjm.com/planning',
    basis: [
      'NERC defines the Bulk Electric System at 100 kV and above, which inside PJM returns tens of thousands of segments and is unreadable as a map. The detail layer therefore takes 230 kV — the lowest level PJM plans its bulk network at — and the BES floor is deliberately not drawn.',
      'NERC将大电力系统定义为100kV及以上，在PJM范围内将返回数万段线路、无法成图。因此细节层取230kV — 即PJM进行主干网规划的最低电压 — 并刻意不绘制BES下限。',
    ],
  },
  ercot: {
    bulkKV: 345, detailKV: 138,
    operator: 'ERCOT',
    levels: ['765 kV', '345 kV', '230 kV', '161 kV', '138 kV'],
    url: 'https://www.ercot.com/gridinfo/transmission',
    basis: [
      'ERCOT names 765, 500 and 345 kV as extra-high voltage and 230, 161 and 138 kV as high voltage, which is an unusually explicit two-tier definition and maps directly onto the bulk and detail layers here.',
      'ERCOT将765、500与345kV定为超高压，将230、161与138kV定为高压。该两级定义异常明确，可直接对应本处的主干层与细节层。',
    ],
  },
  caiso: {
    bulkKV: 500, detailKV: 230,
    operator: 'CAISO, under the NERC Bulk Electric System definition',
    levels: ['500 kV', '230 kV', '115 kV'],
    url: 'https://www.caiso.com/planning/Pages/TransmissionPlanning/Default.aspx',
    basis: [
      'The CAISO controlled grid is predominantly 500 kV and 230 kV, with 115 kV largely in the participating transmission owners’ networks. 230 kV is where California interconnects utility-scale storage, so the detail layer stops there.',
      'CAISO受控电网以500kV与230kV为主，115kV大多位于参与输电所有者的网络中。加州公用事业级储能并网多在230kV，故细节层止于该电压。',
    ],
  },
  /* Added 2026-10-23 with Ontario's registration (docs/ontario-registration-plan.md). */
  ca_on: {
    bulkKV: 230, detailKV: 115,
    operator: 'IESO (the IESO-controlled grid)',
    levels: ['500 kV', '230 kV', '115 kV'],
    url: 'https://www.ieso.ca/ontarioenergymap/',
    basis: [
      'IESO describes the high-voltage IESO-controlled grid as 115 kV, 230 kV and 500 kV lines, over 30,000 km in all. The detail layer stops at 115 kV, IESO\'s own floor; the bulk layer takes 230 kV on the Irish precedent of a bulk tier beneath a 400 kV one, and draws 500 kV inside it.',
      'IESO将其控制的高压电网描述为115kV、230kV与500kV线路，总长逾30,000公里。细节层止于IESO自身的下限115kV；主干层参照爱尔兰（400kV之下设主干层）的先例取230kV，500kV包含其中。',
    ],
  },
  /* Added 2026-10-29 with Spain's and Saudi Arabia's registrations
     (docs/spain-registration-plan.md, docs/saudi-registration-plan.md). */
  es: {
    bulkKV: 400, detailKV: 220,
    operator: 'Red Eléctrica (REE)',
    levels: ['400 kV', '220 kV'],
    url: 'https://www.ree.es/en/press-release-type/transmission',
    basis: [
      'Red Eléctrica owns and operates the transmission grid: about 22,000 km at 400 kV and 20,200 km at 220 kV at the end of 2023, with under 3,000 km at 132 kV, mostly in the islands. The bulk layer is 400 kV and the detail layer stops at 220 kV, the Irish precedent.',
      '输电网由Red Eléctrica拥有并运营：截至2023年底，400kV线路约22,000公里、220kV约20,200公里，132kV不足3,000公里且多在岛屿。主干层取400kV，细节层止于220kV，参照爱尔兰先例。',
    ],
  },
  sa: {
    bulkKV: 380, detailKV: 132,
    operator: 'National Grid SA (Saudi Electricity Company)',
    levels: ['380 kV', '230 kV', '132 kV'],
    url: 'https://reglobal.org/transmission-ties-saudi-arabias-regional-connections/',
    basis: [
      'The national transmission network ran to about 93,000 circuit-km from 132 kV to 380 kV in 2022, of which 49,600 at 230 and 380 kV. 380 kV is the backbone. The detail layer stops at 132 kV; the 110/115 kV split is not yet read from National Grid SA (gate SA-7).',
      '2022年全国输电网132kV至380kV约93,000回路公里，其中230与380kV为49,600。380kV为主干网。细节层止于132kV；110/115kV的划分尚未取自国家电网公司（研究缺口SA-7）。',
    ],
  },
};

/* The three Japanese allocation points share one grid definition because they
   share one national voltage standard — the same reason their capacity-market
   area prices sit within 0.9% of each other. Written once and returned per
   market so no entry can drift away from the other two. */
function JAPAN(){
  return {
    bulkKV: 500, detailKV: 154,
    operator: 'OCCTO and the general transmission and distribution utilities',
    levels: ['500 kV', '275 kV', '187 kV', '154 kV', '66/77 kV'],
    url: 'https://www.occto.or.jp/en/',
    basis: [
      'Japan runs a 500 kV trunk system with 275/187 kV sub-transmission beneath it and 154 kV below that; 66/77 kV is the distribution tier. The detail cut at 154 kV keeps TEPCO’s 500/275/154 kV network whole without pulling in the 66 kV layer.',
      '日本以500kV为主干系统，其下为275/187kV次输电，再下为154kV；66/77kV属配电层级。细节阈值取154kV可完整保留东京电力500/275/154kV网络，同时不引入66kV层。',
    ],
  };
}

/** The definition for a market, or null where none is declared. */
export function voltageFor(marketId){
  return TRANSMISSION_VOLTAGE[marketId] || null;
}

/**
 * Voltage bands a market's network is delivered in, highest first.
 *
 * Delivery, not definition. A market that declares no `bands` gets two — the
 * backbone and everything else down to its floor — which is how every market
 * behaved before Italy needed three. Splitting exists so a large network can be
 * loaded progressively; it never changes which segments are ingested.
 */
export function bandsFor(marketId){
  const definition = TRANSMISSION_VOLTAGE[marketId];
  if (!definition) return [];
  const edges = definition.bands
    || [definition.bulkKV, definition.detailKV].filter((v, i, a) => a.indexOf(v) === i);

  return edges.map((minKV, index) => ({
    minKV,
    // Open-topped for the highest band; each lower band stops below the one above.
    maxKV: index === 0 ? Infinity : edges[index - 1],
    /* Every band except the lowest is backbone and loads with the map. For
       Italy that is 380 kV and 220 kV together, which is the network a reader
       opening the page is looking for; the 132–150 kV class is the bulk of the
       payload and none of the first read, so it waits for a zoom or an explicit
       request. A two-band market resolves to bulk-loads, detail-waits, which is
       how every market behaved before. */
    backbone: index < edges.length - 1,
  }));
}

/** Every market that declares a transmission definition. */
export const VOLTAGE_MARKET_IDS = Object.keys(TRANSMISSION_VOLTAGE);
