import { geoMercator, geoPath } from 'd3-geo';
import { clusterProjects, clusterLabel } from '../projects/clusters.js';
import { energyMWh } from '../projects/schema.js';
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import {
  CAPTURE_LABEL, CAPTURE_FLOW, CAPTURE_FLOW_LABEL, RELIEF_STATUS_LABEL, reliefRunway,
} from '../governance/congestion.js';

/* The year relief runways are measured from. The register publishes commissioning
   years, not durations, so the reference has to be stated somewhere rather than
   read off a clock — a map that silently re-dated itself every January would
   change published figures with no diff. */
export const RUNWAY_FROM = 2026;

const W = 760;
const H = 650;

/** Zoom bounds. 1 is the fitted extent; 8 is where clustering stops merging. */
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

/* Zoom at which the sub-backbone voltage class is worth its bytes. Below this a
   reader is looking at a country and the 132 kV network is a grey blanket over
   it; above it they are looking at a region and it is the answer. */
const DETAIL_ZOOM = 2;

function svgEl(tag, attrs = {}){
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}

function appendText(node, value){
  node.append(document.createTextNode(value));
  return node;
}

function signedRingArea(ring){
  let area = 0;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1){
    area += (ring[previous][0] * ring[index][1]) - (ring[index][0] * ring[previous][1]);
  }
  return area / 2;
}

function normalizeRing(ring, clockwise){
  const isClockwise = signedRingArea(ring) < 0;
  return isClockwise === clockwise ? ring : [...ring].reverse();
}

function normalizePolygon(polygon){
  return polygon.map((ring, index) => normalizeRing(ring, index === 0));
}

function normalizeGeometry(geometry){
  if (!geometry) return geometry;
  if (geometry.type === 'Polygon') return { ...geometry, coordinates:normalizePolygon(geometry.coordinates) };
  if (geometry.type === 'MultiPolygon') return { ...geometry, coordinates:geometry.coordinates.map(normalizePolygon) };
  return geometry;
}

function normalizeFeature(feature){
  return { ...feature, geometry:normalizeGeometry(feature.geometry) };
}

function normalizeBoundary(boundary){
  if (boundary.type === 'FeatureCollection'){
    return { ...boundary, features:boundary.features.map(normalizeFeature) };
  }
  return normalizeFeature(boundary);
}
function boundsFeature(bounds){
  const [[west, south], [east, north]] = bounds;
  return {
    type:'Feature',
    properties:{},
    geometry:{
      type:'Polygon',
      coordinates:[[[west, south], [west, north], [east, north], [east, south], [west, south]]],
    },
  };
}


function boundaryLabel(data, feature){
  const keys = Array.isArray(data.boundaryLabelProperty)
    ? data.boundaryLabelProperty
    : [data.boundaryLabelProperty];
  const label = keys.filter(Boolean).map(key => feature.properties?.[key]).find(Boolean) || null;
  if (!label) return null;
  return !data.boundaryLabelValues || data.boundaryLabelValues.includes(label) ? label : null;
}

function kindLabel(data, kind){
  return L(data.layers[kind]?.label || kind);
}

export function renderGeographicGridMap(parent, dataIn){
  let data = dataIn;
  /* Constraints are a fifth layer, added only where the market has a congestion
     register. They are given `kind:'constraint'` here rather than in the register
     so the register stays a statement about the market, not about this map. */
  const constraints = (data.constraints || []).map(zone => ({ ...zone, kind:'constraint' }));

  /* Pricing and control areas — the market's own zonal structure, drawn under
     everything else. A zone is not an asset and never enters the point or route
     validation; it is the settlement geography those assets sit inside, which is
     why a battery's node matters at all. Markets with a single bidding zone
     declare none and the layer does not appear. */
  const zones = (data.zoneSet?.zones || []).map(z => ({ ...z, kind:'zone' }));

  /* A feature's `layer` defaults to its `kind`. The two are separate because the
     governance validator constrains `kind` to the four physical asset types, and
     the planned-build layer is not a fifth asset type — it is the same nodes and
     routes, drawn from the market's network-plan register instead of from the
     operating network. Declaring `layer:'plan'` moves a feature onto that toggle
     without lying about what it physically is. */
  const layerOf = (feature) => feature.layer || feature.kind;

  const state = {
    period: data.defaultPeriod || (data.periodOrder.includes('current') ? 'current' : data.periodOrder[0]),
    layers: { zone:true, node:true, generation:true, load:true, route:true, plan:true, constraint:true,
      /* Projects default ON where a market has them — they are the subject of
         the platform. Markets with no verified source have none and the toggle
         does not appear. */
      project:true },
    selectedId: data.defaultSelectedId || null,
  };

  const hasPlanLayer = [...(data.points || []), ...(data.routes || [])].some(f => layerOf(f) === 'plan');

  const mapId = data.id || 'electricity-map';
  const titleId = `${mapId}-title`;
  const descriptionId = `${mapId}-description`;
  const root = h('section', {
    class:'geo-grid-map' + (data.compact ? ' compact' : ''),
    'aria-label':L(data.ariaLabel || ['Interactive electricity system map','交互式电力系统地图']),
  });
  const controlRow = h('div', { class:'geo-map-controls' });
  const periodGroup = h('div', { class:'geo-period-group', role:'group', 'aria-label':L(['Choose system period','选择系统时期']) });
  const layerGroup = h('fieldset', { class:'geo-layer-group' }, h('legend', {}, L(['Layers','图层'])));
  const detailToggleHost = h('div', { class:'geo-detail-toggle-host' });
  const context = h('div', { class:'geo-map-context' });
  const mapShell = h('div', { class:'geo-map-shell' });
  const mapPane = h('div', { class:'geo-map-pane' });
  const detail = h('aside', { class:'geo-map-detail', 'aria-live':'polite' });
  const locationSelect = h('select', { class:'inp geo-location-select', 'aria-label':L(['Inspect a visible location','查看可见地点']) });
  const svg = svgEl('svg', {
    viewBox:`0 0 ${W} ${H}`,
    role:'img',
    'aria-labelledby':`${titleId} ${descriptionId}`,
    preserveAspectRatio:'xMidYMid meet',
  });

  svg.append(
    appendText(svgEl('title', { id:titleId }), L(data.title || ['Electricity system structure by period','不同时期电力系统结构'])),
    appendText(svgEl('desc', { id:descriptionId }), L(data.scope)),
  );

  const normalizedBoundary = normalizeBoundary(data.boundary);
  const projectionBoundary = data.viewBounds ? boundsFeature(data.viewBounds) : normalizedBoundary;
  const projection = geoMercator().fitExtent([[36, 25], [W - 68, H - 28]], projectionBoundary);
  const path = geoPath(projection);
  const baseLayer = svgEl('g', { class:'geo-base-layer' });
  const regionLabelLayer = svgEl('g', { class:'geo-region-label-layer', 'aria-hidden':'true' });
  /* Under the network layers on purpose: a constraint is the background a node
     sits in, and drawing it on top would bury the assets it constrains. */
  /* Zones sit directly on the base map, beneath even the constraint shading:
     they are the ground everything else is drawn on. */
  const zoneLayer = svgEl('g', { class:'geo-zone-layer' });
  const zoneLabelLayer = svgEl('g', { class:'geo-zone-label-layer', 'aria-hidden':'true' });
  const constraintLayer = svgEl('g', { class:'geo-constraint-layer' });
  const routeLayer = svgEl('g', { class:'geo-route-layer' });
  const pointLayer = svgEl('g', { class:'geo-point-layer' });
  const labelLayer = svgEl('g', { class:'geo-label-layer' });
  /* Transmission network and project pipeline, both added in the 2026-08 round.
     They sit above the base map and below the market's own assets: a battery is
     the subject of this platform and must never be buried under a grid line. */
  const transmissionLayer = svgEl('g', { class:'geo-transmission-layer' });
  const projectLayer = svgEl('g', { class:'geo-project-layer' });

  /* Everything geographic goes inside a viewport group that carries the pan and
     zoom transform, so zooming is one attribute write rather than a
     re-projection of every feature. Markers inside it counter-scale by 1/zoom
     around their own position, which keeps a battery the same size on screen at
     every zoom while its POSITION still moves with the map. */
  const viewport = svgEl('g', { class:'geo-viewport' });
  viewport.append(baseLayer, zoneLayer, regionLabelLayer, constraintLayer,
    transmissionLayer, routeLayer, projectLayer, pointLayer, zoneLabelLayer, labelLayer);
  svg.append(viewport);

  /* Only the grid tab is interactive. The overview renders the same component
     with `compact:true` and must stay exactly as it was — a small orientation
     map that a reader glances at, not one they navigate. */
  const interactive = !data.compact;
  const view = { zoom:1, x:0, y:0 };
  const applyView = () => {
    viewport.setAttribute('transform', `translate(${view.x} ${view.y}) scale(${view.zoom})`);
    svg.setAttribute('data-zoom', view.zoom.toFixed(2));
  };

  const boundaryFeatures = normalizedBoundary.type === 'FeatureCollection' ? normalizedBoundary.features : [normalizedBoundary];
  for (const feature of boundaryFeatures){
    baseLayer.append(svgEl('path', { class:'geo-country', d:path(feature) }));
    const label = boundaryLabel(data, feature);
    const [x, y] = path.centroid(feature);
    if (label && Number.isFinite(x) && Number.isFinite(y)){
      regionLabelLayer.append(appendText(svgEl('text', {
        class:'geo-region-label',
        x,
        y,
        'text-anchor':'middle',
      }), label));
    }
  }

  const legend = h('div', { class:'geo-map-legend', 'aria-label':L(['Map symbol legend','地图符号图例']) },
    zones.length ? h('span', {}, h('i', { class:'geo-symbol zone' }), L(['Market zone','市场区域'])) : null,
    h('span', {}, h('i', { class:'geo-symbol node' }), L(['Node','节点'])),
    h('span', {}, h('i', { class:'geo-symbol generation' }), L(['Generation','发电'])),
    h('span', {}, h('i', { class:'geo-symbol load' }), L(['Demand','负荷'])),
    h('span', {}, h('i', { class:'geo-symbol route' }), L(['Network path','网络路径'])),
    hasPlanLayer
      ? h('span', {}, h('i', { class:'geo-symbol plan' }), L(['Planned build','规划建设']))
      : null,
    constraints.length
      ? h('span', {}, h('i', { class:'geo-symbol constraint' }), L(['Constraint','约束']))
      : null,
  );
  mapPane.append(svg, legend);

  function visiblePoints(){
    return data.points.filter(p => p.periods.includes(state.period) && state.layers[layerOf(p)]);
  }

  function visibleRoutes(){
    return data.routes.filter(r => r.periods.includes(state.period) && state.layers[layerOf(r)]);
  }

  /* A constraint shows on the period it binds in and on every earlier one; it
     disappears from the period after its relief project commissions. That is the
     whole point of the layer — the map is where the expiry date becomes visible
     rather than a footnote. */
  function visibleConstraints(){
    if (!state.layers.constraint) return [];
    return constraints.filter(zone => {
      if (state.period === 'past') return false;
      if (state.period !== 'future') return true;
      const year = zone.relief?.expected;
      return !Number.isFinite(year) || year > 2035;
    });
  }

  function visibleZones(){
    return state.layers.zone ? zones : [];
  }

  function visibleFeatures(){
    return [...visibleZones(), ...visibleConstraints(), ...visiblePoints(), ...visibleRoutes()];
  }

  function selectedFeature(){
    const all = visibleFeatures();
    return all.find(x => x.id === state.selectedId) || all[0] || null;
  }

  /* ---- selection under an active pointer capture --------------------------

     Panning needs setPointerCapture on the <svg>, and an active capture
     retargets the subsequent pointerup — and therefore the synthesised click —
     to the capture element. A click listener bound to a marker is consequently
     never called: the event is dispatched at the <svg>.

     So what was pressed is recorded on pointerdown and opened on pointerup,
     provided the pointer did not travel far enough to count as a drag. The
     per-node click listener is kept as well, because the overview map registers
     no pointer handlers at all and its clicks are ordinary.

     This is the same failure, and the same fix, as src/home/marketGlobe.js. It
     was reintroduced here when the grid map gained pan and zoom. */
  const selectableByNode = new WeakMap();

  /** Registers a node as selectable, by both routes. */
  const bindSelectable = (node, id) => {
    selectableByNode.set(node, id);
    node.addEventListener('click', () => setSelected(id));
  };

  /** The id of the nearest selectable ancestor — a marker's child circle presses it. */
  const selectableAt = (target) => {
    for (let el = target; el && el !== svg; el = el.parentNode){
      if (selectableByNode.has(el)) return selectableByNode.get(el);
    }
    return null;
  };

  function setSelected(id){
    state.selectedId = id;
    update();
  }

  for (const key of data.periodOrder){
    const button = h('button', {
      type:'button',
      class:'btn geo-period-btn',
      'data-period':key,
      onclick:() => { state.period = key; update(); },
    }, L(data.periods[key].label));
    periodGroup.append(button);
  }

  /* The constraint toggle is appended by the renderer rather than declared in
     each market's map data: the layer exists exactly when a congestion register
     does, so making six data files repeat that would only let them disagree. */
  const layerEntries = [
    /* Zones lead the list because they are the ground, not an overlay. Like the
       constraint toggle, it appears exactly when the market has one. */
    ...(zones.length ? [['zone', { label:data.zoneSet?.label || ['Market zones','市场区域'] }]] : []),
    ...Object.entries(data.layers),
    /* Same rule as constraints: the planned-build toggle exists exactly when the
       market's map carries features drawn from its network-plan register, so
       nine data files are not asked to repeat — and disagree about — that fact. */
    ...(hasPlanLayer && !data.layers.plan ? [['plan', { label:['Planned build','规划建设'] }]] : []),
    ...(constraints.length ? [['constraint', { label:['Constraints','约束'] }]] : []),
  ];
  for (const [key, layer] of layerEntries){
    const input = h('input', {
      type:'checkbox',
      checked:'',
      onchange:(event) => { state.layers[key] = event.target.checked; update(); },
    });
    layerGroup.append(h('label', { class:`geo-layer-toggle ${key}` }, input, h('span', { 'aria-hidden':'true' }), L(layer.label)));
  }

  /* Zones are drawn once and never change with the period: a bidding zone is not
     a project. Each gets its name at the polygon centroid, which is where a
     reader looks for it and is stable enough at national scale. */
  function renderZones(){
    zoneLayer.replaceChildren();
    zoneLabelLayer.replaceChildren();
    for (const zone of visibleZones()){
      const d = path(zone.geometry);
      if (!d) continue;
      const selected = zone.id === state.selectedId;
      const shape = svgEl('path', {
        class:`geo-zone ${zone.approximate ? 'approximate' : ''} ${selected ? 'selected' : ''}`,
        d,
        'data-id':zone.id,
      });
      shape.append(appendText(svgEl('title'), `${L(zone.name)}${zone.approximate ? ' — ' + L(['approximate boundary','边界为近似值']) : ''}`));
      bindSelectable(shape, zone.id);
      zoneLayer.append(shape);

      const [cx, cy] = path.centroid(zone.geometry);
      if (Number.isFinite(cx) && Number.isFinite(cy)){
        zoneLabelLayer.append(appendText(svgEl('text', {
          class:'geo-zone-label',
          x:cx, y:cy, 'text-anchor':'middle',
        }), L(zone.name)));
      }
    }
  }

  function renderConstraints(){
    constraintLayer.replaceChildren();
    for (const zone of visibleConstraints()){
      const selected = zone.id === state.selectedId;
      const runway = reliefRunway(zone, RUNWAY_FROM);
      const cls = `geo-constraint ${zone.shape} ${selected ? 'selected' : ''}`
        + (runway == null ? ' open-ended' : '');
      let node;
      if (zone.shape === 'interface'){
        node = svgEl('path', { class:cls, d:path({ type:'LineString', coordinates:zone.coords }) });
      } else {
        const projected = projection(zone.coord);
        if (!projected) continue;
        /* Radius carries intensity, which is an analyst ranking rather than a
           measurement — so it sizes the marker and never appears as a number. */
        const r = 16 + 20 * (zone.intensity ?? 0.5);
        node = svgEl('circle', { class:cls, cx:projected[0], cy:projected[1], r });
      }
      node.append(appendText(svgEl('title'),
        `${L(zone.name)} — ${runway == null
          ? L(['no published relief date','无公开缓解日期'])
          : L(['relief ','缓解于']) + zone.relief.expected}`));
      bindSelectable(node, zone.id);
      constraintLayer.append(node);
    }
  }

  function renderRoutes(){
    routeLayer.replaceChildren();
    for (const route of visibleRoutes()){
      const line = { type:'LineString', coordinates:route.coords };
      const isPlan = layerOf(route) === 'plan';
      const routePath = svgEl('path', {
        class:`geo-route ${route.periods.includes('future') && !route.periods.includes('current') ? 'future' : ''} ${isPlan ? 'plan ' + (route.planClass || '') : ''} ${route.id === state.selectedId ? 'selected' : ''}`,
        d:path(line),
        'data-id':route.id,
      });
      routePath.append(appendText(svgEl('title'), isPlan
        ? `${L(route.name)} — ${L(route.planStatus || route.note)}`
        : `${L(route.name)} — ${L(route.note)}`));
      bindSelectable(routePath, route.id);
      routeLayer.append(routePath);
    }
  }

  /* Standing place labels are placed after every marker is drawn, by trying a
     ring of candidate offsets around each point and taking the first that does
     not collide with a label already placed. Hand-tuning an anchor per point
     across nine maps would be both tedious and brittle — the collisions move
     whenever a point is added — so the map resolves them itself and a data
     author only supplies `labelAnchor` / `labelBelow` when they want a specific
     side tried first.

     Priority is demand centres, then nodes, then generation: where two features
     share a locality, the one that orients the reader keeps its label and the
     other loses it rather than overprinting. Falls back to the plain default if
     the browser cannot measure text — a hidden tab reports zero-width boxes,
     and a silently unlabelled map would be worse than an imperfect one. */
  const LABEL_PRIORITY = { load:0, node:1, generation:2 };

  function placeLabels(pending){
    const placed = [];
    const hits = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    const order = [...pending].sort((a, b) =>
      (LABEL_PRIORITY[a.item.kind] ?? 3) - (LABEL_PRIORITY[b.item.kind] ?? 3));

    for (const { item, x, y } of order){
      const preferred = [];
      if (item.labelAnchor || item.labelBelow){
        preferred.push([item.labelAnchor || 'start', !!item.labelBelow]);
      }
      const candidates = [...preferred,
        ['start', false], ['end', false], ['start', true], ['end', true],
        ['middle', false], ['middle', true]];

      const text = appendText(svgEl('text', { class:`geo-point-label ${item.kind}` }), L(item.name));
      labelLayer.append(text);

      let box = null;
      let measurable = true;
      for (const [anchor, below] of candidates){
        const dx = anchor === 'end' ? -9 : anchor === 'middle' ? 0 : 9;
        const dy = below ? 14 : -9;
        text.setAttribute('x', x + dx);
        text.setAttribute('y', y + dy);
        text.setAttribute('text-anchor', anchor);
        let bb = null;
        try { bb = text.getBBox(); } catch { /* detached or hidden */ }
        if (!bb || !bb.width){ measurable = false; break; }
        const candidate = { x:bb.x, y:bb.y, w:bb.width, h:bb.height };
        if (!placed.some(p => hits(candidate, p))){ box = candidate; break; }
      }
      if (box) placed.push(box);
      else if (measurable) text.remove();   // every side was taken
    }
  }

  /* ---- transmission network ------------------------------------------------
     Drawn once: the geometry does not change with period or selection, and a
     market's grid can run to thousands of segments. Voltage bands are styled in
     CSS from `data-band`, and the bulk band is the only one visible until the
     reader zooms past the bulk/detail threshold the market declared. */
  /* ---- transmission delivery ----------------------------------------------

     Loaded on demand and in voltage bands, never imported.

     Italy is why. Terna's RTN runs to 132 kV and comes back as 15,079 segments —
     4.4 MB as one file, which an earlier version of this pipeline responded to
     by deleting. It is now split into the bands Terna itself uses: 380 kV and
     220 kV load with the map because that is the network a reader is looking
     for, and the 132–150 kV class waits for a zoom or an explicit request
     because it is two thirds of the payload and none of the first read.

     Every band is real data. None of it is omitted; the delivery is staged. */
  const bandState = { loaded: new Set(), manifest: null, detailRequested: false };

  const shouldLoad = (band) =>
    band.backbone || bandState.detailRequested || view.zoom >= DETAIL_ZOOM;

  function loadTransmission(){
    if (!interactive) return;
    if (bandState.manifest) return void loadPendingBands();
    if (!data.transmissionManifest) return;

    fetch(data.transmissionManifest)
      .then(response => (response.ok ? response.json() : null))
      .then(manifest => {
        if (!manifest?.bands?.length) return;
        bandState.manifest = manifest;
        if (!data.transmission){
          data = { ...data, transmission:{ ...manifest, lines:[], substations:[] } };
        }
        renderDetailToggle();
        loadPendingBands();
      })
      /* A missing grid layer is a degraded map, not a broken one. The rest of
         the page is unaffected, so this must not throw into the console and
         make a reader think the dashboard failed. */
      .catch(() => {});
  }

  function loadPendingBands(){
    for (const band of bandState.manifest.bands){
      if (bandState.loaded.has(band.band) || !shouldLoad(band)) continue;
      bandState.loaded.add(band.band);          // claim it before awaiting

      /* A band may arrive in parts: Italy's 132–219 kV class is 11,266 segments
         and does not fit one file however hard it is simplified, so it ships as
         two and is concatenated here. */
      Promise.all((band.urls || []).map(url =>
        fetch(url).then(r => (r.ok ? r.json() : null)).catch(() => null)))
        .then(parts => {
          const good = parts.filter(Boolean);
          if (!good.length){ bandState.loaded.delete(band.band); return; }
          data = { ...data, transmission:{
            ...data.transmission,
            lines:[...data.transmission.lines, ...good.flatMap(p => p.lines || [])],
            substations:[...data.transmission.substations, ...good.flatMap(p => p.substations || [])],
          } };
          renderTransmission();
        });
    }
  }

  function renderTransmission(){
    const network = data.transmission;
    if (!network || !interactive) return;
    transmissionLayer.replaceChildren();

    /* Where the backbone ends. With three bands — Italy's 380 / 220 / 132–150 —
       the backbone runs down to 220 kV, not to `bulkKV`, so the styling floor
       comes from the manifest rather than from the single bulk threshold that
       was correct when every market had exactly two bands. */
    const backboneFloor = bandState.manifest
      ? Math.min(...bandState.manifest.bands.filter(b => b.backbone).map(b => b.minKV))
      : network.bulkKV;
    for (const line of network.lines || []){
      const d = line.path.map((p, i) => `${i ? 'L' : 'M'}${projection(p)?.[0]} ${projection(p)?.[1]}`).join(' ');
      if (d.includes('undefined')) continue;
      transmissionLayer.append(svgEl('path', {
        class:'geo-transmission-line' + (line.underground ? ' underground' : ''),
        'data-band':line.kv >= backboneFloor ? 'bulk' : 'detail',
        d,
      }));
    }
    for (const s of network.substations || []){
      const p = projection(s.coord);
      if (!p) continue;
      transmissionLayer.append(svgEl('rect', {
        class:'geo-substation',
        'data-band':s.kv >= backboneFloor ? 'bulk' : 'detail',
        x:p[0] - 2.6, y:p[1] - 2.6, width:5.2, height:5.2,
      }));
    }
  }

  /* ---- project pipeline ----------------------------------------------------
     Re-clustered on every zoom change, because whether two batteries overlap is
     a question about pixels and the answer changes as the reader zooms. */
  function renderProjects(){
    projectLayer.replaceChildren();
    /* The overview map stays the orientation map it has always been. Projects,
       clusters and the transmission network are detail, and detail belongs on
       the grid tab where a reader can zoom into it. */
    if (!interactive || !state.layers.project) return;

    /* Screen position: the viewport transform has not been applied to these
       coordinates yet, so the clusterer sees the same pixels the reader will. */
    const toScreen = (p) => {
      const xy = projection([p.lon, p.lat]);
      return xy ? [xy[0] * view.zoom + view.x, xy[1] * view.zoom + view.y] : null;
    };

    for (const marker of clusterProjects(data.projects || [], toScreen, { zoom:view.zoom })){
      // Back out of screen space: the layer is inside the transformed viewport.
      const cx = (marker.x - view.x) / view.zoom;
      const cy = (marker.y - view.y) / view.zoom;
      const g = svgEl('g', {
        class:`geo-project ${marker.stage}` + (marker.kind === 'cluster' ? ' cluster' : ''),
        transform:`translate(${cx} ${cy}) scale(${1 / view.zoom})`,
      });

      if (marker.kind === 'cluster'){
        g.append(svgEl('circle', { class:'geo-project-shape', r:11 }));
        g.append(appendText(svgEl('text', { class:'geo-project-count', y:3.5 }), String(marker.count)));
        g.append(appendText(svgEl('title'), L(clusterLabel(marker))));
      } else {
        const p = marker.project;
        const energy = energyMWh(p);
        g.append(svgEl('circle', { class:'geo-project-shape', r:5.5 }));
        g.append(appendText(svgEl('title'),
          `${p.name} — ${Math.round(p.capacityMW)} MW`
          + (energy != null ? ` / ${Math.round(energy)} MWh` : L([' · energy not published', ' · 未公布能量容量']))
          + (p.operator ? ` — ${p.operator}` : '')));
      }
      projectLayer.append(g);
    }

    /* Italy only: Terna publishes MACSE volume nationally and price by zone, so
       these markers carry a price and deliberately no capacity. They are drawn
       through the same layer but never through the clusterer, which sums. */
    for (const zone of data.zoneClusters || []){
      const p = projection(zone.coord);
      if (!p) continue;
      const g = svgEl('g', {
        class:'geo-project zone-cluster',
        transform:`translate(${p[0]} ${p[1]}) scale(${1 / view.zoom})`,
      });
      g.append(svgEl('circle', { class:'geo-project-shape', r:10 }));
      g.append(appendText(svgEl('title'), L(zone.label)));
      g.append(appendText(svgEl('text', { class:'geo-project-zone-label', y:-15 }), L(zone.name)));
      projectLayer.append(g);
    }
  }

  function renderPoints(){
    pointLayer.replaceChildren();
    labelLayer.replaceChildren();
    const pendingLabels = [];
    for (const item of visiblePoints()){
      const projected = projection(item.coord);
      if (!projected) continue;
      const [x, y] = projected;
      const selected = item.id === state.selectedId;
      const group = svgEl('g', {
        class:`geo-marker ${item.kind} ${layerOf(item) === 'plan' ? 'plan ' + (item.planClass || '') : ''} ${selected ? 'selected' : ''}`,
        // Counter-scaled so the marker keeps its drawn size as the map zooms.
        transform:`translate(${x} ${y}) scale(${1 / view.zoom})`,
        'data-id':item.id,
      });
      const title = appendText(svgEl('title'), `${L(item.name)} — ${L(item.subtype)}`);
      group.append(title);
      const scale = item.size || 1;
      if (item.kind === 'node'){
        group.append(
          svgEl('circle', { class:'marker-halo', r:10 * scale }),
          svgEl('circle', { class:'marker-shape', r:5.2 * scale }),
        );
      } else if (item.kind === 'generation'){
        group.append(svgEl('path', {
          class:'marker-shape',
          d:`M 0 ${-7*scale} L ${6.5*scale} ${5.5*scale} L ${-6.5*scale} ${5.5*scale} Z`,
        }));
      } else {
        group.append(svgEl('rect', {
          class:'marker-shape',
          x:-5.5*scale, y:-5.5*scale, width:11*scale, height:11*scale, rx:2,
        }));
      }
      bindSelectable(group, item.id);
      pointLayer.append(group);

      if (item.label && !selected) pendingLabels.push({ item, x, y });

      if (selected){
        labelLayer.append(appendText(svgEl('text', {
          class:'geo-selected-label',
          x:x + 10,
          y:y - 12,
        }), L(item.name)));
      }
    }
    placeLabels(pendingLabels);
  }

  function renderContext(){
    const period = data.periods[state.period];
    context.replaceChildren(
      h('div', { class:'geo-context-kicker' }, L(period.kicker)),
      h('b', {}, L(period.thesis)),
      h('p', {}, L(period.implication)),
    );
  }

  function renderSelector(){
    locationSelect.replaceChildren(h('option', { value:'' }, L(['Inspect a location or path…','查看地点或路径…'])));
    for (const item of visibleFeatures()){
      const label = item.kind === 'constraint' ? L(['Constraint','约束'])
        : item.kind === 'zone' ? L(['Zone','区域'])
        : layerOf(item) === 'plan' ? L(['Planned build','规划建设'])
        : kindLabel(data, item.kind);
      const option = h('option', { value:item.id }, `${label} · ${L(item.name)}`);
      if (item.id === state.selectedId) option.selected = true;
      locationSelect.append(option);
    }
  }
  locationSelect.addEventListener('change', event => {
    if (event.target.value) setSelected(event.target.value);
  });

  /* A constraint answers different questions from a node, so it gets its own
     panel rather than being squeezed into the asset fact list: what is measured,
     how a battery is paid for it, what ends it, and when. */
  function renderConstraintDetail(zone){
    const runway = reliefRunway(zone, RUNWAY_FROM);
    const flow = CAPTURE_FLOW[zone.capture.mechanism];

    const metrics = h('dl', { class:'geo-detail-facts' });
    for (const m of zone.metrics){
      metrics.append(h('div', {},
        h('dt', {}, L(m.label)),
        h('dd', {}, L(m.value), h('span', { class:'geo-metric-period' }, ' · ' + L(m.period)))));
    }

    detail.replaceChildren(
      h('div', { class:'geo-detail-eyebrow constraint' }, L(['Constraint','约束'])),
      h('h4', {}, L(zone.name)),
      h('div', { class:'geo-detail-type' },
        L(zone.direction === 'export' ? ['Export constrained','送出受限']
          : zone.direction === 'import' ? ['Import constrained','受入受限']
          : ['Both directions','双向受限'])),
      metrics,
      h('div', { class:'geo-detail-section capture' },
        h('span', {}, L(['How a battery is paid','储能如何获得回报']),
          h('i', { class:'geo-capture-tag ' + flow }, L(CAPTURE_LABEL[zone.capture.mechanism]))),
        h('p', {}, L(zone.capture.text)),
        flow === 'pays' ? null
          : h('p', { class:'geo-capture-warn' }, L(flow === 'charges'
            ? ['This mechanism charges the developer rather than paying the operator.',
               '该机制向开发商收费，而非向运营方付费。']
            : ['Nobody is paid for relieving this constraint. Value exists only in charging into the prices it creates.',
               '缓解该约束无人获得报酬。其价值仅存在于在该约束所形成的低价时段充电。']))),
      h('div', { class:'geo-detail-section relief' },
        h('span', {}, L(['What ends it','约束何时终止']),
          h('i', { class:'geo-relief-tag' }, L(RELIEF_STATUS_LABEL[zone.relief.status]))),
        h('p', {}, h('b', {}, L(zone.relief.project)), ' — ', L(zone.relief.scope)),
        h('p', { class:'geo-runway' }, runway == null
          ? L(['No published commissioning year — the constraint has no committed end date.',
               '无公开投运年份 — 该约束尚无确定的终止日期。'])
          : L(['Relief expected ','预计缓解于']) + zone.relief.expected
            + L([` · ${runway} year${runway === 1 ? '' : 's'} of runway from ${RUNWAY_FROM}`,
                 `年 · 自${RUNWAY_FROM}年起剩余${runway}年`]))),
      h('div', { class:'geo-detail-section investor' },
        h('span', {}, L(['Investor implication','投资者影响'])),
        h('p', {}, L(zone.investor))),
      h('a', { class:'geo-source-link', href:zone.sourceUrl, target:'_blank', rel:'noopener' },
        `${L(['Source','来源'])}: ${zone.source} ↗`),
    );
  }

  /* A zone panel has to do one thing the others do not: say how much to trust
     its own outline. Where the drawn boundary is a stand-in — Germany's control
     areas are grouped federal states, because control-area borders follow
     transmission ownership — the panel says so in the same breath as the name,
     rather than leaving it to a legend the reader may not reach. */
  function renderZoneDetail(zone){
    const meta = data.zoneSet || {};
    detail.replaceChildren(
      h('div', { class:'geo-detail-eyebrow zone' }, L(['Market zone','市场区域'])),
      h('h4', {}, L(zone.name)),
      zone.operator ? h('div', { class:'geo-detail-type' }, zone.operator) : null,
      zone.approximate
        ? h('div', { class:'geo-zone-caveat' }, L([
            'Indicative outline. This zone is drawn from administrative boundaries because its real border follows transmission ownership, not geography — read it as which zone, never as exactly where the edge runs.',
            '示意性轮廓。该区域以行政边界绘制，因其真实边界依输电资产归属划分而非地理划分 — 应据此判断属于哪个区域，而不可据此判断边界的确切位置。',
          ]))
        : null,
      zone.note
        ? h('div', { class:'geo-detail-section' },
            h('span', {}, L(['Why it matters','为何重要'])),
            h('p', {}, L(zone.note)))
        : null,
      meta.sourceUrl
        ? h('a', { class:'geo-source-link', href:meta.sourceUrl, target:'_blank', rel:'noopener' },
            `${L(['Source','来源'])}: ${meta.source} ↗`)
        : null,
    );
  }

  function renderDetail(){
    const item = selectedFeature();
    if (!item){
      detail.replaceChildren(h('p', { class:'geo-empty' }, L(['Turn on a layer to inspect its locations.','打开图层以查看地点。'])));
      return;
    }
    if (item.kind === 'constraint'){
      renderConstraintDetail(item);
      return;
    }
    if (item.kind === 'zone'){
      renderZoneDetail(item);
      return;
    }
    const feature = { ...item, ...(item.factsByPeriod?.[state.period] || {}) };
    const companies = item.companiesByPeriod?.[state.period] || item.companies || [];
    const factRows = [
      /* Plan features carry their register class and target year so the map and
         the grid-tab register cannot say different things about the same
         project. The class label travels with the feature rather than being
         looked up here, which keeps this component ignorant of nine different
         status vocabularies. */
      [L(['Plan status','规划状态']), feature.planClassLabel],
      [L(['Target year','目标年份']), feature.planYear ? [String(feature.planYear), String(feature.planYear)] : null],
      [L(['Owner / operator','所有者 / 运营方']), feature.owner],
      [L(['Connected nodes','连接节点']), feature.endpoints],
      [L(['Operating / current','运营 / 当前']), feature.operatingCapacity],
      [L(['Planned / future','规划 / 未来']), feature.plannedCapacity],
      [L(['Demand-scale evidence','负荷规模证据']), feature.demandScale],
      [L(['Status','状态']), feature.status],
      [L(['Evidence basis','证据口径']), feature.capacityBasis],
    ].filter(([, value]) => value);
    const facts = h('dl', { class:'geo-detail-facts' });
    for (const [label, value] of factRows){
      facts.append(h('div', {}, h('dt', {}, label), h('dd', {}, L(value))));
    }
    const organisations = companies.length
      ? h('div', { class:'geo-detail-section organisations' },
          h('span', {}, L(['Named organisations · illustrative','具名机构 · 示例'])),
          h('div', { class:'geo-company-list' }, ...companies.map(company => h('i', {}, company))),
          h('p', { class:'geo-company-caveat' }, L([
            'Disclosed operators or regional anchors—not a customer, queue or connection-commitment list.',
            '为公开运营方或区域锚定机构，并非客户、队列或并网承诺清单。',
          ])),
        )
      : null;
    const detailChildren = [
      h('div', { class:'geo-detail-eyebrow' }, layerOf(item) === 'plan'
        ? L(['Planned build','规划建设'])
        : kindLabel(data, item.kind)),
      h('h4', {}, L(item.name)),
      item.subtype ? h('div', { class:'geo-detail-type' }, L(item.subtype)) : null,
      factRows.length ? facts : null,
      organisations,
      h('div', { class:'geo-detail-section' }, h('span', {}, L(['What is changing','变化内容'])), h('p', {}, L(item.note))),
      h('div', { class:'geo-detail-section investor' }, h('span', {}, L(['Investor implication','投资者影响'])), h('p', {}, L(item.investor))),
      h('a', { class:'geo-source-link', href:item.sourceUrl, target:'_blank', rel:'noopener' }, `${L(['Source','来源'])}: ${L(item.source)} ↗`),
    ];
    detail.replaceChildren(...detailChildren.filter(Boolean));
  }

  function update(){
    const allowed = visibleFeatures();
    if (!allowed.some(x => x.id === state.selectedId)) state.selectedId = allowed[0]?.id || null;
    periodGroup.querySelectorAll('button').forEach(button => {
      const active = button.dataset.period === state.period;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderContext();
    renderZones();
    renderConstraints();
    renderRoutes();
    renderPoints();
    renderProjects();
    renderSelector();
    renderDetail();
  }

  /* Pan and zoom. Only the geometry and the marker counter-scale change, so a
     zoom step re-runs the two renderers whose output is pixel-dependent rather
     than the whole map. */
  function setView(next){
    view.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next.zoom ?? view.zoom));
    view.x = next.x ?? view.x;
    view.y = next.y ?? view.y;
    /* At the fitted extent there is nothing to pan to, so the map snaps back
       rather than letting a reader drag the country off the canvas. */
    if (view.zoom === MIN_ZOOM){ view.x = 0; view.y = 0; }
    applyView();
    renderPoints();
    renderProjects();
    /* Zooming past DETAIL_ZOOM is a request for the detail band, so the fetch is
       driven by the same gesture rather than by a separate control the reader
       has to find. */
    if (bandState.manifest) loadPendingBands();
  }

  /* An explicit way in, for a reader who wants the full network without zooming
     — and the honest place to say how big it is before they ask for it. */
  function renderDetailToggle(){
    const detailBands = (bandState.manifest?.bands || []).filter(b => !b.backbone);
    if (!detailBands.length || detailToggleHost.childElementCount) return;

    const mb = detailBands.reduce((total, b) => total + b.bytes, 0) / 1e6;
    const floor = Math.min(...detailBands.map(b => b.minKV));
    const top = Math.max(...detailBands.map(b => (b.maxKV || b.minKV) - 1));

    const input = h('input', { type:'checkbox' });
    input.addEventListener('change', () => {
      bandState.detailRequested = input.checked;
      if (input.checked) loadPendingBands();
      /* Unticking hides rather than unloads: the bytes are already spent, and
         re-fetching them because a reader changed their mind twice is worse than
         keeping them. */
      svg.classList.toggle('detail-suppressed', !input.checked && view.zoom < DETAIL_ZOOM);
    });

    detailToggleHost.append(h('label', { class:'geo-detail-toggle' },
      input,
      h('span', {}, L([
        `Detailed grid — ${floor}–${top} kV (${mb.toFixed(1)} MB)`,
        `详细电网 — ${floor}–${top} kV（${mb.toFixed(1)} MB）`,
      ]))));
  }

  /** Zoom about a fixed point, so the place under the cursor stays under it. */
  function zoomAbout(factor, px, py){
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.zoom * factor));
    const k = next / view.zoom;
    setView({ zoom:next, x:px - (px - view.x) * k, y:py - (py - view.y) * k });
  }

  const svgPoint = (event) => {
    const rect = svg.getBoundingClientRect();
    return [
      (event.clientX - rect.left) / rect.width * W,
      (event.clientY - rect.top) / rect.height * H,
    ];
  };

  if (interactive){
    const zoomOut = h('button', { class:'btn geo-zoom-btn', type:'button',
      'aria-label':L(['Zoom out','缩小地图']) }, '−');
    const zoomIn = h('button', { class:'btn geo-zoom-btn', type:'button',
      'aria-label':L(['Zoom in','放大地图']) }, '+');
    const reset = h('button', { class:'btn geo-zoom-btn', type:'button',
      'aria-label':L(['Reset view','重置视图']) }, '⤾');
    zoomOut.addEventListener('click', () => zoomAbout(1 / 1.4, W / 2, H / 2));
    zoomIn.addEventListener('click', () => zoomAbout(1.4, W / 2, H / 2));
    reset.addEventListener('click', () => setView({ zoom:1, x:0, y:0 }));
    controlRow.append(h('div', { class:'geo-zoom-controls', role:'group',
      'aria-label':L(['Map zoom','地图缩放']) }, zoomOut, zoomIn, reset));

    svg.addEventListener('wheel', (event) => {
      event.preventDefault();
      const [px, py] = svgPoint(event);
      zoomAbout(Math.exp(-event.deltaY * 0.0015), px, py);
    }, { passive:false });

    /* Drag to pan. A press that moved is a pan and must not also select the
       marker underneath — the same rule the home globe uses. */
    let dragging = false; let moved = false; let from = null; let origin = null;
    let pressed = null;
    svg.addEventListener('pointerdown', (event) => {
      dragging = true; moved = false;
      /* Recorded BEFORE the capture, because after it the pointerup and click
         both arrive at the <svg> and the original target is gone. */
      pressed = selectableAt(event.target);
      from = [event.clientX, event.clientY];
      origin = [view.x, view.y];
      /* Capture is what makes panning survive the pointer leaving the svg, but
         it throws if the pointer is already gone — and an exception here would
         abort the rest of the handler and leave the map stuck in `panning`.
         Panning still works without it while the pointer stays inside. */
      try { svg.setPointerCapture(event.pointerId); } catch { /* not capturable */ }
      svg.classList.add('panning');
    });
    svg.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const rect = svg.getBoundingClientRect();
      const dx = (event.clientX - from[0]) / rect.width * W;
      const dy = (event.clientY - from[1]) / rect.height * H;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      setView({ x:origin[0] + dx, y:origin[1] + dy });
    });
    const endDrag = (event) => {
      dragging = false;
      svg.classList.remove('panning');
      if (svg.hasPointerCapture?.(event.pointerId)) svg.releasePointerCapture(event.pointerId);
      const wasPressed = pressed;
      pressed = null;
      setTimeout(() => { moved = false; }, 0);
      return wasPressed;
    };
    svg.addEventListener('pointerup', (event) => {
      const target = endDrag(event);
      // A press that panned the map is a pan, not a selection.
      if (target && !moved) setSelected(target);
    });
    /* A cancelled pointer selects nothing: the gesture did not finish, and the
       browser cancels on things like a system gesture taking over. */
    svg.addEventListener('pointercancel', endDrag);
    svg.addEventListener('click', (event) => { if (moved) event.stopPropagation(); }, true);
  }

  renderTransmission();
  loadTransmission();
  applyView();

  controlRow.append(periodGroup, layerGroup, detailToggleHost);
  mapShell.append(mapPane, detail);
  root.append(
    controlRow,
    context,
    h('div', { class:'geo-map-toolbar' }, h('label', {}, L(['Location / asset','地点 / 资产']), locationSelect)),
    mapShell,
    h('div', { class:'geo-map-scope' },
      h('b', {}, L(['Diligence boundary: ','尽调边界：'])),
      L(data.scope),
      ' ',
      h('a', { href:data.boundarySource.url, target:'_blank', rel:'noopener' }, L(data.boundarySource.label)),
      '. ',
      h('span', { class:'geo-source-health' },
        `${L(['Public-source register','公开来源登记'])}: ${data.sourceCatalog?.length || 0} · `,
        L(['A structured · B downloadable · C public document/manual extraction',
          'A级结构化 · B级可下载 · C级公开文件/人工提取'])),
    ),
  );
  parent.append(root);
  update();
}
