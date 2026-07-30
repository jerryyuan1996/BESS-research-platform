import world from 'world-atlas/countries-110m.json';
import westernAustralia from '../markets/wa/wa-state-boundary.json' with { type:'json' };
import { feature } from 'topojson-client';
import {
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
} from 'd3-geo';

import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { navigate } from '../app/router.js';
import { S } from '../charts/chartUtils.js';

const COVERED = new Map([
  [36, {
    name:['Western Australia', '西澳'],
    route:'/markets/western-australia',
    point:[121, -31],
    flag:'\u{1F1E6}\u{1F1FA}',
  }],
  [826, {
    name:['Great Britain', '英国'],
    route:'/markets/great-britain',
    point:[-2, 54],
    flag:'\u{1F1EC}\u{1F1E7}',
  }],
  [372, {
    name:['Ireland', '爱尔兰'],
    route:'/markets/ireland',
    point:[-8, 53],
    flag:'\u{1F1EE}\u{1F1EA}',
  }],
  [642, {
    name:['Romania', '罗马尼亚'],
    route:'/markets/romania',
    point:[25, 46],
    flag:'\u{1F1F7}\u{1F1F4}',
  }],
  [616, {
    name:['Poland', '波兰'],
    route:'/markets/poland',
    point:[19, 52],
    flag:'\u{1F1F5}\u{1F1F1}',
  }],
  [392, {
    name:['Japan', '日本'],
    route:'/markets/japan-tokyo',
    point:[138, 37],
    flag:'\u{1F1EF}\u{1F1F5}',
  }],
]);

const MARKET_LINKS = [
  ['\u{1F1E6}\u{1F1FA}', ['WA', '西澳'], '/markets/western-australia'],
  ['\u{1F1EC}\u{1F1E7}', ['GB', '英国'], '/markets/great-britain'],
  ['\u{1F1EE}\u{1F1EA}', ['IE', '爱尔兰'], '/markets/ireland'],
  ['\u{1F1F7}\u{1F1F4}', ['RO', '罗马尼亚'], '/markets/romania'],
  ['\u{1F1F5}\u{1F1F1}', ['PL', '波兰'], '/markets/poland'],
  ['\u{1F1EF}\u{1F1F5}', ['Tokyo', '东京'], '/markets/japan-tokyo'],
  ['\u{1F1EF}\u{1F1F5}', ['Kyushu', '九州'], '/markets/japan-kyushu'],
  ['\u{1F1EF}\u{1F1F5}', ['Hokkaido', '北海道'], '/markets/japan-hokkaido'],
];

function marketLink([_flag, label, route]){
  const flagCode = route.includes('western-australia') ? 'au'
    : route.includes('great-britain') ? 'gb'
    : route.includes('ireland') ? 'ie' : route.includes('romania') ? 'ro' : route.includes('poland') ? 'pl' : 'jp';
  return h('a', {
    class:'globe-market-link',
    href:route,
    onclick:(event) => {
      event.preventDefault();
      navigate(route);
      window.scrollTo(0, 0);
    },
  }, h('span', { class:`fi fi-${flagCode}`, 'aria-hidden':'true' }), L(label));
}

function d3Winding(feature){
  const geometry = feature?.geometry;
  if (!geometry || (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')) return feature;
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return {
    ...feature,
    geometry:{
      ...geometry,
      coordinates:(geometry.type === 'Polygon' ? polygons[0].map(ring => [...ring].reverse())
        : polygons.map(polygon => polygon.map(ring => [...ring].reverse()))),
    },
  };
}

export function renderMarketGlobe(){
  const card = h('section', { class:'card market-globe-card' },
    h('div', { class:'market-globe-head' },
      h('div', {},
        h('h3', {}, L(['Markets on the globe', '全球市场分布'])),
        h('div', { class:'cap' }, L([
          'Drag to rotate; scroll or use +/− to zoom. Select a highlighted market to open its dashboard.',
          '拖动旋转；滚轮或使用 +/− 缩放；点击高亮市场进入对应看板。',
        ]))),
      h('span', { class:'globe-live', 'aria-label':L(['Interactive', '可交互']) }, L(['Interactive', '可交互']))));

  const zoomOut = h('button', { class:'btn globe-zoom-btn', type:'button', 'aria-label':L(['Zoom out', '缩小地球仪']) }, '−');
  const zoomIn = h('button', { class:'btn globe-zoom-btn', type:'button', 'aria-label':L(['Zoom in', '放大地球仪']) }, '+');
  const globeHeader = card.querySelector('.market-globe-head');
  globeHeader.append(h('div', { class:'globe-actions' },
    globeHeader.querySelector('.globe-live'),
    h('div', { class:'globe-zoom-controls', role:'group', 'aria-label':L(['Globe zoom', '地球仪缩放']) }, zoomOut, zoomIn)));

  const viewport = 420;
  const initialScale = 192;
  const svg = S('svg', {
    class:'market-globe',
    viewBox:`0 0 ${viewport} ${viewport}`,
    role:'img',
    'aria-label':L([
      'Interactive globe highlighting dashboard markets',
      '高亮看板覆盖市场的可交互地球仪',
    ]),
  });
  const projection = geoOrthographic()
    .translate([viewport / 2, viewport / 2])
    .scale(initialScale)
    .clipAngle(90)
    .precision(0.5)
    .rotate([-65, -22, 0]);
  const path = geoPath(projection);
  const countries = feature(world, world.objects.countries).features;

  const sphere = S('path', { class:'globe-sphere' });
  const graticule = S('path', { class:'globe-graticule' });
  const countryLayer = S('g', { class:'globe-countries' });
  const markerLayer = S('g', { class:'globe-markers' });
  svg.append(sphere, graticule, countryLayer, markerLayer);

  const countryShapes = countries.map(country => {
    const countryId = Number(country.id);
    const isAustralia = countryId === 36;
    const covered = isAustralia ? null : COVERED.get(countryId);
    const node = S('path', {
      class:'globe-country' + (covered ? ' covered' : '') + (isAustralia ? ' australia-context' : ''),
      tabindex:covered ? '0' : '-1',
      role:covered ? 'link' : 'presentation',
    });
    if (covered){
      node.append(S('title'));
      node.querySelector('title').textContent = L(covered.name);
      const open = () => {
        if (dragMoved) return;
        navigate(covered.route);
        window.scrollTo(0, 0);
      };
      node.addEventListener('click', open);
      node.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') open();
      });
    }
    countryLayer.append(node);
    return [country, node];
  });

  const waMarket = COVERED.get(36);
  // ABS publishes RFC 7946 ring winding; d3-geo uses the opposite spherical winding.
  const waBoundary = d3Winding(westernAustralia.features[0]);
  const waShape = S('path', {
    class:'globe-wa',
    tabindex:'0',
    role:'link',
    'aria-label':L(['Western Australia dashboard market', '西澳看板市场']),
  });
  const waTitle = S('title');
  waTitle.textContent = L(waMarket.name);
  waShape.append(waTitle);
  const openWesternAustralia = () => {
    if (dragMoved) return;
    navigate(waMarket.route);
    window.scrollTo(0, 0);
  };
  waShape.addEventListener('click', openWesternAustralia);
  waShape.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') openWesternAustralia();
  });
  countryLayer.append(waShape);

  const markers = [...COVERED.values()].map(market => {
    const group = S('g', { class:'globe-marker', role:'link', tabindex:'0' });
    const pulse = S('circle', { r:'9', class:'globe-marker-pulse' });
    const dot = S('circle', { r:'4', class:'globe-marker-dot' });
    const title = S('title');
    title.textContent = L(market.name);
    group.append(pulse, dot, title);
    const open = () => {
      if (dragMoved) return;
      navigate(market.route);
      window.scrollTo(0, 0);
    };
    group.addEventListener('click', open);
    group.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') open();
    });
    markerLayer.append(group);
    return [market, group];
  });

  const render = () => {
    sphere.setAttribute('d', path({ type:'Sphere' }));
    graticule.setAttribute('d', path(geoGraticule10()));
    countryShapes.forEach(([country, node]) => node.setAttribute('d', path(country) || ''));
    waShape.setAttribute('d', path(waBoundary) || '');
    svg.setAttribute('data-zoom-scale', String(Math.round(projection.scale())));
    const rotation = projection.rotate();
    const centre = [-rotation[0], -rotation[1]];
    markers.forEach(([market, node]) => {
      const visible = geoDistance(market.point, centre) < Math.PI / 2;
      const point = projection(market.point);
      node.setAttribute('transform', point ? `translate(${point[0]},${point[1]})` : '');
      node.style.display = visible ? '' : 'none';
    });
  };

  let dragging = false;
  let dragMoved = false;
  let startPoint = null;
  let startRotation = null;
  const setScale = value => {
    projection.scale(Math.max(150, Math.min(340, value)));
    render();
  };
  zoomOut.addEventListener('click', () => setScale(projection.scale() / 1.2));
  zoomIn.addEventListener('click', () => setScale(projection.scale() * 1.2));
  svg.addEventListener('wheel', event => {
    event.preventDefault();
    const factor = Math.exp(-event.deltaY * 0.0012);
    setScale(projection.scale() * factor);
  }, { passive:false });

  svg.addEventListener('pointerdown', event => {
    dragging = true;
    dragMoved = false;
    startPoint = [event.clientX, event.clientY];
    startRotation = projection.rotate();
    svg.setPointerCapture(event.pointerId);
    svg.classList.add('dragging');
  });
  svg.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - startPoint[0];
    const dy = event.clientY - startPoint[1];
    if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved = true;
    projection.rotate([
      startRotation[0] + dx * 0.38,
      Math.max(-75, Math.min(75, startRotation[1] - dy * 0.38)),
      0,
    ]);
    render();
  });
  const finishDrag = event => {
    dragging = false;
    svg.classList.remove('dragging');
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    setTimeout(() => { dragMoved = false; }, 0);
  };
  svg.addEventListener('pointerup', finishDrag);
  svg.addEventListener('pointercancel', finishDrag);

  render();
  card.append(h('div', { class:'market-globe-wrap' }, svg));
  card.append(h('div', { class:'globe-market-links' }, MARKET_LINKS.map(marketLink)));
  card.append(h('div', { class:'cap globe-source' }, L([
    'Country boundaries: Natural Earth via world-atlas. Western Australia boundary: ABS ASGS 2021.',
    '国界数据：Natural Earth / world-atlas；西澳边界来自 ABS ASGS 2021。',
  ])));
  return card;
}
