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

/* Markets shown on the globe.

   A LIST rather than a map keyed by country, because Australia now carries two
   of them. Western Australia is drawn from its own ABS state outline and the
   NEM takes the rest of the country — which is what the two markets actually
   are, so the map says it without a caption. `countryId` binds a market to a
   Natural Earth country polygon; WA has none because its shape is separate. */
const COVERED = [
  { id:'wa', countryId:null, flagCode:'au',
    name:['Western Australia — WEM', '西澳 — WEM'],
    route:'/markets/western-australia', point:[121, -31] },
  { id:'nem', countryId:36, flagCode:'au',
    name:['Australia — National Electricity Market', '澳大利亚 — 国家电力市场'],
    route:'/markets/nem', point:[149, -33] },
  { id:'gb', countryId:826, flagCode:'gb',
    name:['Great Britain', '英国'], route:'/markets/great-britain', point:[-2, 54] },
  { id:'ie', countryId:372, flagCode:'ie',
    name:['Ireland', '爱尔兰'], route:'/markets/ireland', point:[-8, 53] },
  { id:'de', countryId:276, flagCode:'de',
    name:['Germany', '德国'], route:'/markets/germany', point:[10.4, 51.2] },
  { id:'it', countryId:380, flagCode:'it',
    name:['Italy', '意大利'], route:'/markets/italy', point:[12.5, 42.6] },
  { id:'ro', countryId:642, flagCode:'ro',
    name:['Romania', '罗马尼亚'], route:'/markets/romania', point:[25, 46] },
  { id:'pl', countryId:616, flagCode:'pl',
    name:['Poland', '波兰'], route:'/markets/poland', point:[19, 52] },
  { id:'jp', countryId:392, flagCode:'jp',
    name:['Japan', '日本'], route:'/markets/japan-tokyo', point:[138, 37] },
];

const COVERED_BY_COUNTRY = new Map(
  COVERED.filter(m => m.countryId != null).map(m => [m.countryId, m]));

const MARKET_LINKS = [
  ['au', ['WA', '西澳'], '/markets/western-australia'],
  ['au', ['NEM', 'NEM'], '/markets/nem'],
  ['gb', ['GB', '英国'], '/markets/great-britain'],
  ['ie', ['IE', '爱尔兰'], '/markets/ireland'],
  ['de', ['DE', '德国'], '/markets/germany'],
  ['it', ['IT', '意大利'], '/markets/italy'],
  ['ro', ['RO', '罗马尼亚'], '/markets/romania'],
  ['pl', ['PL', '波兰'], '/markets/poland'],
  ['jp', ['Tokyo', '东京'], '/markets/japan-tokyo'],
  ['jp', ['Kyushu', '九州'], '/markets/japan-kyushu'],
  ['jp', ['Hokkaido', '北海道'], '/markets/japan-hokkaido'],
];

function marketLink([flagCode, label, route]){
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

  /* Activation is resolved from the pressed node rather than from a `click`
     listener on it.

     Rotating the globe needs setPointerCapture on the <svg>, and an active
     pointer capture retargets the subsequent pointerup — and therefore the
     synthesised click — to the capture element. A click listener bound to a
     country path is consequently never called: the event is dispatched at the
     <svg>. Recording what was pressed and opening it on pointerup, provided the
     pointer did not travel far enough to count as a drag, is equivalent for a
     mouse and unaffected by capture. Keyboard activation is unaffected and stays
     on the focusable node. */
  const routeByNode = new Map();
  const openRoute = (route) => {
    navigate(route);
    window.scrollTo(0, 0);
  };
  /** Registers a node as a link, with keyboard activation. */
  const bindRoute = (node, route) => {
    routeByNode.set(node, route);
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        openRoute(route);
      }
    });
  };
  /** The route of the nearest bound ancestor — markers press their child circle. */
  const routeAt = (target) => {
    for (let el = target; el && el !== svg; el = el.parentNode){
      if (routeByNode.has(el)) return routeByNode.get(el);
    }
    return null;
  };

  const countryShapes = countries.map(country => {
    const countryId = Number(country.id);
    const covered = COVERED_BY_COUNTRY.get(countryId);
    const node = S('path', {
      class:'globe-country' + (covered ? ' covered' : ''),
      tabindex:covered ? '0' : '-1',
      role:covered ? 'link' : 'presentation',
    });
    if (covered){
      node.append(S('title'));
      node.querySelector('title').textContent = L(covered.name);
      bindRoute(node, covered.route);
    }
    countryLayer.append(node);
    return [country, node];
  });

  /* WA is drawn over the Australian polygon rather than instead of it. The
     country underneath routes to the NEM and the state on top routes to the WEM,
     which is the same division the two markets have in reality. */
  const waMarket = COVERED.find(m => m.id === 'wa');
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
  bindRoute(waShape, waMarket.route);
  countryLayer.append(waShape);

  const markers = COVERED.map(market => {
    const group = S('g', { class:'globe-marker', role:'link', tabindex:'0' });
    /* Ireland is under ten screen pixels wide at the default zoom, so the marker
       carries an invisible hit area larger than anything drawn. */
    const hit = S('circle', { r:'14', class:'globe-marker-hit' });
    const pulse = S('circle', { r:'9', class:'globe-marker-pulse' });
    const dot = S('circle', { r:'4', class:'globe-marker-dot' });
    const title = S('title');
    title.textContent = L(market.name);
    group.append(hit, pulse, dot, title);
    bindRoute(group, market.route);
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
  let pressedRoute = null;
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
    pressedRoute = routeAt(event.target);
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
    const route = pressedRoute;
    pressedRoute = null;
    setTimeout(() => { dragMoved = false; }, 0);
    return route;
  };
  svg.addEventListener('pointerup', event => {
    const route = finishDrag(event);
    // A press that rotated the globe is a drag, not a selection.
    if (route && !dragMoved) openRoute(route);
  });
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
