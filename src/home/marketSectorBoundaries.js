import california from '../markets/caiso/ca-boundary.json' with { type:'json' };
import texas from '../markets/ercot/tx-boundary.json' with { type:'json' };
import japan from '../markets/jp/jp-zones.json' with { type:'json' };

const pjmFootprint = {
  type:'Feature',
  properties:{ name:'PJM Interconnection', approximate:true },
  geometry:{
    type:'Polygon',
    coordinates:[[
      [-89.2, 42.6],
      [-87.4, 41.5],
      [-84.8, 41.7],
      [-82.5, 42.2],
      [-79.0, 42.5],
      [-74.0, 41.2],
      [-74.6, 39.0],
      [-75.8, 37.0],
      [-79.7, 36.5],
      [-82.8, 38.0],
      [-85.4, 38.7],
      [-89.2, 40.4],
      [-89.2, 42.6],
    ]],
  },
};

const feature = collection => collection.features[0];

const US_SECTORS = [
  {
    id:'caiso',
    group:'us',
    name:['United States — CAISO', '美国 — CAISO'],
    route:'/markets/caiso',
    feature:feature(california),
  },
  {
    id:'ercot',
    group:'us',
    name:['United States — ERCOT', '美国 — ERCOT'],
    route:'/markets/ercot',
    feature:feature(texas),
  },
  {
    id:'pjm',
    group:'us',
    name:['United States — PJM Interconnection', '美国 — PJM互联电网'],
    route:'/markets/pjm',
    feature:pjmFootprint,
  },
];

const JAPAN_ROUTES = {
  'jp-tokyo':'/markets/japan-tokyo',
  'jp-kyushu':'/markets/japan-kyushu',
  'jp-hokkaido':'/markets/japan-hokkaido',
};

const JAPAN_SECTORS = japan.zones
  .filter(zone => JAPAN_ROUTES[zone.id])
  .map(zone => ({
    id:zone.id.replace('jp-', 'jp_'),
    group:'jp',
    name:['Japan — ' + zone.name[0], '日本 — ' + zone.name[1]],
    route:JAPAN_ROUTES[zone.id],
    feature:{
      type:'Feature',
      properties:{ name:zone.name[0], operator:zone.operator },
      geometry:zone.geometry,
    },
  }));

export const MARKET_SECTORS = [...US_SECTORS, ...JAPAN_SECTORS];
