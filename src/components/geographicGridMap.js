import { geoMercator, geoPath } from 'd3-geo';
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

export function renderGeographicGridMap(parent, data){
  /* Constraints are a fifth layer, added only where the market has a congestion
     register. They are given `kind:'constraint'` here rather than in the register
     so the register stays a statement about the market, not about this map. */
  const constraints = (data.constraints || []).map(zone => ({ ...zone, kind:'constraint' }));

  /* A feature's `layer` defaults to its `kind`. The two are separate because the
     governance validator constrains `kind` to the four physical asset types, and
     the planned-build layer is not a fifth asset type — it is the same nodes and
     routes, drawn from the market's network-plan register instead of from the
     operating network. Declaring `layer:'plan'` moves a feature onto that toggle
     without lying about what it physically is. */
  const layerOf = (feature) => feature.layer || feature.kind;

  const state = {
    period: data.defaultPeriod || (data.periodOrder.includes('current') ? 'current' : data.periodOrder[0]),
    layers: { node:true, generation:true, load:true, route:true, plan:true, constraint:true },
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
  const constraintLayer = svgEl('g', { class:'geo-constraint-layer' });
  const routeLayer = svgEl('g', { class:'geo-route-layer' });
  const pointLayer = svgEl('g', { class:'geo-point-layer' });
  const labelLayer = svgEl('g', { class:'geo-label-layer' });
  svg.append(baseLayer, regionLabelLayer, constraintLayer, routeLayer, pointLayer, labelLayer);

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

  function visibleFeatures(){
    return [...visibleConstraints(), ...visiblePoints(), ...visibleRoutes()];
  }

  function selectedFeature(){
    const all = visibleFeatures();
    return all.find(x => x.id === state.selectedId) || all[0] || null;
  }

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
      node.addEventListener('click', () => setSelected(zone.id));
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
      routePath.addEventListener('click', () => setSelected(route.id));
      routeLayer.append(routePath);
    }
  }

  function renderPoints(){
    pointLayer.replaceChildren();
    labelLayer.replaceChildren();
    for (const item of visiblePoints()){
      const projected = projection(item.coord);
      if (!projected) continue;
      const [x, y] = projected;
      const selected = item.id === state.selectedId;
      const group = svgEl('g', {
        class:`geo-marker ${item.kind} ${layerOf(item) === 'plan' ? 'plan ' + (item.planClass || '') : ''} ${selected ? 'selected' : ''}`,
        transform:`translate(${x} ${y})`,
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
      group.addEventListener('click', () => setSelected(item.id));
      pointLayer.append(group);

      if (selected){
        labelLayer.append(appendText(svgEl('text', {
          class:'geo-selected-label',
          x:x + 10,
          y:y - 12,
        }), L(item.name)));
      }
    }
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
      const label = item.kind === 'constraint' ? L(['Constraint','约束']) : kindLabel(data, item.kind);
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
    renderConstraints();
    renderRoutes();
    renderPoints();
    renderSelector();
    renderDetail();
  }

  controlRow.append(periodGroup, layerGroup);
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
