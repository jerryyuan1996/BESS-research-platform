/* ---------------------------------------------------------------------------
   Italy — MACSE storage awards, by market zone.

   Italy is the one market on this platform whose storage layer is ZONAL rather
   than project-level, and the reason is what Terna publishes. The first MACSE
   auction (30 September 2025) awarded 14 projects for delivery in 2028, and
   Terna reports them as a national total with clearing prices per zone. It does
   not publish which project sits where, and no project coordinates exist in the
   public results.

   So the map draws one cluster per zone, positioned at a schematic zone label
   point, and the honest consequence is stated in the data rather than hidden:
   `capacityPublished: false` on every zone. A reader sees four zones, the national
   total, and the clearing price that separates them — which is the information
   that exists — and never a per-zone megawatt figure that Terna has not stated.

   OpenStreetMap was measured for Italy on 2026-08-09 and rejected: 11 plants
   totalling 543 MW against a fleet MACSE alone is adding 1,491 MW to. It is not
   used here, and mixing it in would produce a layer that is neither a complete
   OSM fleet nor the MACSE award.
   --------------------------------------------------------------------------- */

export const MACSE_AUCTION = {
  id: 'it-macse-2025',
  name: ['MACSE auction 1 — awarded storage', 'MACSE首轮拍卖 — 中标储能'],
  auctionDate: '2025-09-30',
  deliveryYear: 2028,
  contractYears: 15,

  /* National totals, as republished by Terna after ACL SPV 2 Srl / Enel withdrew
     the smallest project (32 MWh, South and Calabria). */
  projects: 14,
  powerMW: 1491.392,
  energyMWh: 9968,
  averageDurationHours: 6.6,

  source: {
    owner: 'Terna',
    title: 'Terna completes first MACSE auction — 10 GWh of storage capacity awarded',
    url: 'https://www.terna.it/en/media/press-releases/detail/completed-first-macse-auction',
    licence: 'Terna press release — attribution',
    checkedAt: '2026-08-09',
  },
};

/* Zone label points, NOT centroids of a published geometry. Terna's zonal
   boundaries are a market construct rather than a shape this platform holds, so
   each marker is placed on the zone it names and declared schematic. */
export const MACSE_ZONES = [
  {
    id: 'centre-south',
    name: ['Centre-South', '中南部'],
    coord: [14.0, 41.6],
    clearingPriceEurPerMWhYear: 14566,
  },
  {
    id: 'south-calabria',
    name: ['South and Calabria', '南部与卡拉布里亚'],
    coord: [16.6, 40.4],
    clearingPriceEurPerMWhYear: 12146,
  },
  {
    id: 'sicily',
    name: ['Sicily', '西西里'],
    coord: [14.1, 37.6],
    clearingPriceEurPerMWhYear: 15846,
  },
  {
    id: 'sardinia',
    name: ['Sardinia', '撒丁'],
    coord: [9.1, 40.1],
    clearingPriceEurPerMWhYear: 15029,
  },
].map(zone => ({
  ...zone,
  schematicPosition: true,
  /* The single most important field here. Terna published the clearing price per
     zone and the volume only nationally, so nothing may render a per-zone MW or
     MWh — including a cluster label, which is otherwise defined by its sum. */
  capacityPublished: false,
}));

export const WEIGHTED_AVERAGE_CLEARING_PRICE = 12959;   // €/MWh-year, national

/**
 * The zonal layer, in the shape the map's cluster renderer consumes.
 *
 * Deliberately NOT canonical project records: these are not projects. Giving
 * them a `capacityMW` the map could sum would let a zone marker claim a number
 * Terna has not published, which is the one thing this module exists to prevent.
 */
export function macseZoneMarkers(){
  return MACSE_ZONES.map(zone => ({
    kind: 'zone-cluster',
    zoneId: zone.id,
    name: zone.name,
    coord: zone.coord,
    schematic: true,
    capacityPublished: false,
    clearingPriceEurPerMWhYear: zone.clearingPriceEurPerMWhYear,
    label: [
      `${zone.name[0]} · €${zone.clearingPriceEurPerMWhYear.toLocaleString('en-US')}/MWh-yr`,
      `${zone.name[1]} · €${zone.clearingPriceEurPerMWhYear.toLocaleString('en-US')}/MWh·年`,
    ],
  }));
}

/** The caption the map and the pipeline section share. */
export const MACSE_CAPTION = [
  `MACSE auction 1, awarded 30 September 2025 for 2028 delivery: ${MACSE_AUCTION.projects} projects, `
  + `${Math.round(MACSE_AUCTION.powerMW).toLocaleString('en-US')} MW / `
  + `${MACSE_AUCTION.energyMWh.toLocaleString('en-US')} MWh on 15-year contracts, averaging `
  + `${MACSE_AUCTION.averageDurationHours} hours. Terna publishes the volume nationally and the `
  + 'clearing price by zone, so no per-zone capacity is shown — the zone markers carry price, not size.',
  `MACSE首轮拍卖于2025年9月30日中标、2028年交付：${MACSE_AUCTION.projects}个项目，`
  + `${Math.round(MACSE_AUCTION.powerMW).toLocaleString('en-US')} MW / `
  + `${MACSE_AUCTION.energyMWh.toLocaleString('en-US')} MWh，15年合同，平均时长`
  + `${MACSE_AUCTION.averageDurationHours}小时。Terna按全国口径公布容量、按分区公布出清价格，`
  + '因此不展示分区容量 — 分区标记承载价格而非规模。',
];
