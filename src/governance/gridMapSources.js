const AUTOMATION_GRADES = new Set(['A', 'B', 'C']);
const REQUIRED_MAP_FIELDS = [
  'id', 'ariaLabel', 'title', 'boundary', 'boundarySource', 'periodOrder',
  'periods', 'layers', 'points', 'routes', 'sourceCatalog', 'scope',
];
const REQUIRED_SOURCE_FIELDS = [
  'id', 'owner', 'title', 'url', 'format', 'cadence', 'licence',
  'automation', 'checkedAt',
];

const isHttps = value => typeof value === 'string' && value.startsWith('https://');
const bilingual = value => Array.isArray(value) && value.length === 2
  && value.every(part => typeof part === 'string' && part.trim().length > 0);
const flattenPeriodFacts = item => Object.values(item.factsByPeriod || {});
const hasFieldSomewhere = (item, field) => Boolean(
  item[field] || flattenPeriodFacts(item).some(period => period?.[field]),
);
const hasCompanies = item => Boolean(
  item.companies?.length
  || Object.values(item.companiesByPeriod || {}).some(companies => companies?.length),
);
const validCoord = coord => Array.isArray(coord) && coord.length === 2
  && Number.isFinite(coord[0]) && Number.isFinite(coord[1])
  && coord[0] >= -180 && coord[0] <= 180 && coord[1] >= -90 && coord[1] <= 90;

export function validateGridMapData(map){
  const errors = [];
  const fail = message => errors.push(`${map?.id || 'unknown-map'}: ${message}`);
  if (!map || typeof map !== 'object') return ['unknown-map: map data is missing'];

  for (const field of REQUIRED_MAP_FIELDS){
    if (map[field] == null) fail(`missing ${field}`);
  }
  if (!bilingual(map.ariaLabel)) fail('ariaLabel must be bilingual');
  if (!bilingual(map.title)) fail('title must be bilingual');
  if (!bilingual(map.scope)) fail('scope must be bilingual');
  if (!isHttps(map.boundarySource?.url)) fail('boundarySource must be a public HTTPS URL');
  if (!bilingual(map.boundarySource?.label)) fail('boundarySource label must be bilingual');
  if (!['Feature', 'FeatureCollection'].includes(map.boundary?.type)) fail('boundary must be GeoJSON');

  const periods = new Set(map.periodOrder || []);
  if (!periods.size) fail('periodOrder cannot be empty');
  for (const period of periods){
    if (!map.periods?.[period]) fail(`period ${period} has no definition`);
  }
  if (!periods.has(map.defaultPeriod)) fail('defaultPeriod must appear in periodOrder');

  const sources = map.sourceCatalog || [];
  const sourceIds = new Set();
  for (const source of sources){
    for (const field of REQUIRED_SOURCE_FIELDS){
      if (source[field] == null || source[field] === '') fail(`source ${source.id || '?'} missing ${field}`);
    }
    if (sourceIds.has(source.id)) fail(`duplicate source id ${source.id}`);
    sourceIds.add(source.id);
    if (!isHttps(source.url)) fail(`source ${source.id} is not HTTPS`);
    if (!AUTOMATION_GRADES.has(source.automation)) fail(`source ${source.id} has invalid automation grade`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt || '')) fail(`source ${source.id} checkedAt is invalid`);
  }
  if (sources.length < 3) fail('sourceCatalog must contain at least three durable public sources');

  const features = [...(map.points || []), ...(map.routes || [])];
  const catalogUrls = new Set(sources.map(source => source.url));
  const featureIds = new Set();
  for (const item of features){
    if (!item.id) fail('feature missing id');
    if (featureIds.has(item.id)) fail(`duplicate feature id ${item.id}`);
    featureIds.add(item.id);
    if (!bilingual(item.name)) fail(`${item.id} name must be bilingual`);
    if (!bilingual(item.note)) fail(`${item.id} note must be bilingual`);
    if (!bilingual(item.investor)) fail(`${item.id} investor implication must be bilingual`);
    if (!isHttps(item.sourceUrl)) fail(`${item.id} sourceUrl must be public HTTPS`);
    if (isHttps(item.sourceUrl) && !catalogUrls.has(item.sourceUrl)){
      fail(`${item.id} sourceUrl is missing from sourceCatalog`);
    }
    if (!item.source) fail(`${item.id} source label is missing`);
    if (!item.periods?.length || item.periods.some(period => !periods.has(period))){
      fail(`${item.id} has an invalid period`);
    }
    /* `layer` is presentation — which toggle a feature sits behind — while
       `kind` stays the physical asset type the rules below validate. Only the
       planned-build layer is allowed to override, because it is the one layer
       that is a projection of the market's network-plan register rather than a
       different sort of asset. */
    if (item.layer != null && item.layer !== 'plan'){
      fail(`${item.id} has an invalid layer; only 'plan' may override kind`);
    }
    if (item.layer === 'plan'){
      /* A map feature drawn from the register must carry the register's own
         status class and its bilingual label, so the two cannot drift into
         saying different things about the same project. A null planYear is
         allowed and means the plan names the project without publishing a date;
         a missing class is not. */
      if (!item.planClass) fail(`${item.id} is on the plan layer and needs planClass`);
      if (!bilingual(item.planClassLabel)) fail(`${item.id} needs a bilingual planClassLabel`);
      if (!bilingual(item.planStatus)) fail(`${item.id} needs a bilingual planStatus`);
      if (!('planYear' in item)) fail(`${item.id} needs planYear (null where the plan publishes no date)`);
      if (item.planYear != null && !Number.isInteger(item.planYear)){
        fail(`${item.id} planYear must be an integer or null`);
      }
      if (!item.periods.includes('future')) fail(`${item.id} is planned build and must appear in the future period`);
    }
  }

  for (const point of map.points || []){
    if (!validCoord(point.coord)) fail(`${point.id} has invalid coordinates`);
    if (!['node', 'generation', 'load'].includes(point.kind)) fail(`${point.id} has invalid point kind`);
    if (point.kind === 'generation'
      && !hasFieldSomewhere(point, 'operatingCapacity')
      && !hasFieldSomewhere(point, 'plannedCapacity')){
      fail(`${point.id} needs operating or planned capacity evidence`);
    }
    if (point.kind === 'load' && !hasCompanies(point)) fail(`${point.id} needs named demand anchors`);
    if (point.kind === 'load' && !hasFieldSomewhere(point, 'demandScale')){
      fail(`${point.id} needs demand-scale evidence`);
    }
  }

  for (const route of map.routes || []){
    if (route.kind !== 'route') fail(`${route.id} must have route kind`);
    if (!Array.isArray(route.coords) || route.coords.length < 2 || route.coords.some(coord => !validCoord(coord))){
      fail(`${route.id} has invalid route coordinates`);
    }
    if (!route.endpoints) fail(`${route.id} needs named endpoints`);
    if (!hasFieldSomewhere(route, 'operatingCapacity')
      && !hasFieldSomewhere(route, 'plannedCapacity')){
      fail(`${route.id} needs operating or planned transfer evidence`);
    }
  }

  if (map.defaultSelectedId && !featureIds.has(map.defaultSelectedId)){
    fail('defaultSelectedId does not resolve to a feature');
  }
  return errors;
}

export function validateGridMapCollection(maps){
  const errors = [];
  const ids = new Set();
  for (const map of maps){
    if (ids.has(map.id)) errors.push(`${map.id}: duplicate map id`);
    ids.add(map.id);
    errors.push(...validateGridMapData(map));
  }
  return errors;
}

export function gridMapSources(maps){
  return maps.flatMap(map => map.sourceCatalog.map(source => ({ marketMapId:map.id, ...source })));
}
