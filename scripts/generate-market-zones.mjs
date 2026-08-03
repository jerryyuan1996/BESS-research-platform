/* ---------------------------------------------------------------------------
   Market zone geometry — the pricing and control areas each market is divided
   into, as drawn polygons.

       npm run refresh:market-zones

   Four markets have a real zonal structure worth drawing:

     NEM      5 pricing regions, which ARE the state boundaries. Exact.
     Japan    9 areas, which ARE prefecture groups. Exact.
     Italy    7 bidding zones, which follow region boundaries with two known
              exceptions this script encodes. Near-exact.
     Germany  4 TSO control areas, which do NOT follow state boundaries. The
              polygons here are state groupings and are therefore APPROXIMATE.

   That last case is the reason every zone carries an `approximate` flag through
   to the map, where it is drawn with a dashed edge and says so in the panel. A
   control area boundary runs along transmission ownership, not administrative
   geography — Hamburg and parts of several states sit differently in reality.
   Anyone reading a German zone edge off this map as a settlement boundary would
   be reading it wrong, so the map says so rather than relying on this comment.

   Sources are open-licensed and are recorded with the output:
     Eurostat GISCO NUTS 2024 (Germany NUTS1, Italy NUTS2) — © EuroGeographics
     Natural Earth admin-1 via natural-earth-vector (Australian states)
     Japan prefectures — already vendored for the Japan maps

   The output is committed. Re-run only to pick up a new NUTS vintage.
   --------------------------------------------------------------------------- */
import { writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const GISCO_L1 = 'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2024_4326_LEVL_1.geojson';
const GISCO_L2 = 'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2024_4326_LEVL_2.geojson';
/* Natural Earth ships admin-1 at two resolutions and they are not
   interchangeable here: the 50m file carries subdivisions for only nine large
   countries — enough for the Australian states — while Japan's prefectures
   appear only in the 10m file. The 10m file is 40 MB, which is acceptable for a
   generator that runs by hand and commits its output, but its geometry has to be
   decimated hard before it goes near the bundle. */
const NE_ADMIN1_50M = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson';
const NE_ADMIN1_10M = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson';

const round = (n, dp = 3) => Number(n.toFixed(dp));

/* Zones are read at national scale behind markers and routes, so a 2-decimal
   grid — roughly a kilometre — is already finer than anything drawn on top.
   Consecutive duplicates after rounding are dropped, and rings that collapse to
   a sliver are removed entirely: at this scale they are offshore rocks. */
const decimate = (ring, dp) => {
  const seen = [];
  for (const [x, y] of ring){
    const p = [round(x, dp), round(y, dp)];
    const last = seen[seen.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) seen.push(p);
  }
  if (seen.length < 4) return null;
  const xs = seen.map(p => p[0]); const ys = seen.map(p => p[1]);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  if (span < 0.08) return null;
  if (seen[0][0] !== seen[seen.length - 1][0] || seen[0][1] !== seen[seen.length - 1][1]) seen.push(seen[0]);
  return seen;
};

const cleanPolygon = (rings, dp) => {
  const out = rings.map(r => decimate(r, dp)).filter(Boolean);
  return out.length ? out : null;
};

const roundGeom = (g, dp = 3) => {
  if (g.type === 'Polygon'){
    const p = cleanPolygon(g.coordinates, dp);
    return p ? { ...g, coordinates: p } : null;
  }
  if (g.type === 'MultiPolygon'){
    const ps = g.coordinates.map(p => cleanPolygon(p, dp)).filter(Boolean);
    return ps.length ? { ...g, coordinates: ps } : null;
  }
  return g;
};

/** Merge several features into one MultiPolygon. No dissolving: interior edges
 *  are retained but are invisible under a single fill, which is enough for a
 *  zone overlay and avoids depending on a geometry library. */
function combine(features, dp = 2){
  const polys = [];
  for (const f of features){
    const g = f.geometry;
    if (!g) continue;
    if (g.type === 'Polygon') polys.push(g.coordinates);
    else if (g.type === 'MultiPolygon') polys.push(...g.coordinates);
  }
  return roundGeom({ type: 'MultiPolygon', coordinates: polys }, dp)
    || { type: 'MultiPolygon', coordinates: [] };
}

async function getJSON(url){
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/* The 10m admin-1 file is 40 MB and the raw.githubusercontent stream resets
   often enough that a plain fetch is not a reliable step in a generator. Point
   NE_ADMIN1_10M_FILE at a local copy to skip the download:

     curl -L -o ne10.json <url> && NE_ADMIN1_10M_FILE=ne10.json npm run refresh:market-zones
*/
async function getLarge(url, envVar){
  const local = process.env[envVar];
  if (local){
    console.log(`  reading ${envVar}=${local}`);
    return JSON.parse(await readFile(local, 'utf8'));
  }
  for (let attempt = 1; attempt <= 3; attempt++){
    try { return await getJSON(url); }
    catch (err){
      console.log(`  attempt ${attempt} failed: ${err.message}`);
      if (attempt === 3) throw err;
    }
  }
}

// ---- Germany: four TSO control areas, approximated by federal state ---------
const DE_ZONES = [
  { id:'de-50hertz', name:['50Hertz','50Hertz'], operator:'50Hertz Transmission',
    states:['DE3','DE4','DE8','DED','DEE','DEG'],
    note:['Eastern Germany and Hamburg. Carries the highest wind share of the four and the most redispatch volume.','德国东部及汉堡。四个控制区中风电占比最高、再调度量最大。'] },
  { id:'de-tennet', name:['TenneT DE','TenneT德国'], operator:'TenneT TSO',
    states:['DE6','DE9','DE7','DE2'],
    note:['The north-to-south spine: Lower Saxony and Schleswig-Holstein wind through to Bavarian load.','由北至南的主干：自下萨克森与石勒苏益格—荷尔斯泰因的风电通往巴伐利亚负荷。'] },
  { id:'de-amprion', name:['Amprion','Amprion'], operator:'Amprion',
    states:['DEA','DEB','DEC'],
    note:['The western industrial corridor, including the Rhine-Ruhr load centre.','西部工业走廊，含莱茵—鲁尔负荷中心。'] },
  { id:'de-transnetbw', name:['TransnetBW','TransnetBW'], operator:'TransnetBW',
    states:['DE1'],
    note:['Baden-Württemberg, the southern load pocket left short by the nuclear closures.','巴登—符腾堡，核电关停后供应偏紧的南部负荷区。'] },
];

// ---- Italy: seven bidding zones, by NUTS2 region ---------------------------
const IT_ZONES = [
  { id:'it-nord', name:['NORD','北部区'], regions:['ITC1','ITC2','ITC3','ITC4','ITH1','ITH2','ITH3','ITH4','ITH5'],
    note:['The industrial north and the deepest demand. Usually the highest-priced zone and the destination for southern generation.','工业化的北部及最深的需求。通常为价格最高的区域，也是南部电源的送达地。'] },
  { id:'it-cnor', name:['CNOR — Centre-North','中北区'], regions:['ITI1','ITI2','ITI3'],
    note:['Tuscany, Umbria and Marche, between the northern load and the southern resource.','托斯卡纳、翁布里亚与马尔凯，位于北部负荷与南部资源之间。'] },
  { id:'it-csud', name:['CSUD — Centre-South','中南区'], regions:['ITI4','ITF1','ITF2'],
    note:['Lazio, Abruzzo and Molise; the Adriatic Link lands in this zone.','拉齐奥、阿布鲁佐与莫利塞；亚得里亚海互联线在此落点。'] },
  { id:'it-sud', name:['SUD — South','南部区'], regions:['ITF3','ITF4','ITF5'],
    note:['Campania, Apulia and Basilicata. High renewable output against thin local load — the export constraint starts here.','坎帕尼亚、普利亚与巴斯利卡塔。可再生出力高而本地负荷薄弱 — 送出约束由此开始。'] },
  { id:'it-cala', name:['CALA — Calabria','卡拉布里亚区'], regions:['ITF6'],
    note:['Split out as its own zone in 2021 precisely because its constraint behaviour differs from SUD.','2021年单独划出为独立区域，正因其约束特性与南部区不同。'] },
  { id:'it-sici', name:['SICI — Sicily','西西里区'], regions:['ITG1'],
    note:['Island zone; the Tyrrhenian Link and ELMED both change its price stack.','岛屿区域；第勒尼安互联与ELMED均将改变其价格结构。'] },
  { id:'it-sard', name:['SARD — Sardinia','撒丁区'], regions:['ITG2'],
    note:['Island zone at the western branch of the Tyrrhenian Link.','岛屿区域，位于第勒尼安互联西段。'] },
];

// ---- NEM: five pricing regions, which are state boundaries -----------------
const NEM_ZONES = [
  { id:'nem-qld1', name:['QLD1 — Queensland','昆士兰'], states:['Queensland'],
    note:['The longest thermal transfer path in the NEM and the most actionable ISP projects.','NEM中最长的热稳定输送通道，可行动ISP项目最多。'] },
  { id:'nem-nsw1', name:['NSW1 — New South Wales','新南威尔士'], states:['New South Wales','Australian Capital Territory'],
    note:['Includes the ACT for settlement. Carries the retiring coal fleet and most of the committed REZ build.','结算上包含首都领地。承载退役煤电机组及大部分已承诺REZ建设。'] },
  { id:'nem-vic1', name:['VIC1 — Victoria','维多利亚'], states:['Victoria'],
    note:['Where VNI West, Marinus and the offshore wind transmission all land.','VNI West、Marinus及海上风电输电工程的共同落点。'] },
  { id:'nem-sa1', name:['SA1 — South Australia','南澳大利亚'], states:['South Australia'],
    note:['The highest renewable share in the NEM, and the region whose relief project was deferred to the 2040s.','NEM中可再生占比最高的区域，其缓解项目已推迟至2040年代。'] },
  { id:'nem-tas1', name:['TAS1 — Tasmania','塔斯马尼亚'], states:['Tasmania'],
    note:['Hydro-dominated and connected by one link until Marinus Stage 1.','以水电为主，在Marinus一期之前仅有一条联络线。'] },
];

// ---- Japan: nine areas, by prefecture --------------------------------------
const JP_AREAS = [
  { id:'jp-hokkaido', name:['Hokkaido','北海道'], prefs:['Hokkaido'],
    note:['Islanded but for one HVDC link; the highest curtailment and the thinnest local load.','除一条高压直流联络线外为孤立系统；限电率最高、本地负荷最薄。'] },
  { id:'jp-tohoku', name:['Tohoku','東北'], prefs:['Aomori','Iwate','Miyagi','Akita','Yamagata','Fukushima','Niigata'],
    note:['The northern wind resource, exporting south into Tokyo across a constrained interface.','北部风电资源区，经受约束的联络断面向南送入东京。'] },
  { id:'jp-tokyo', name:['Tokyo','東京'], prefs:['Ibaraki','Tochigi','Gunma','Saitama','Chiba','Tokyo','Kanagawa','Yamanashi','Shizuoka'],
    note:['The deepest demand in Japan and the destination for Tohoku and Chubu transfer.','日本需求最深的区域，也是东北与中部电力的送达地。'] },
  { id:'jp-chubu', name:['Chubu','中部'], prefs:['Nagano','Gifu','Aichi','Mie'],
    note:['Industrial load sitting on the 50–60 Hz frequency boundary.','工业负荷区，位于50—60赫兹频率分界处。'] },
  { id:'jp-hokuriku', name:['Hokuriku','北陸'], prefs:['Toyama','Ishikawa','Fukui'],
    note:['Small area on the Sea of Japan coast, inside the 60 Hz system.','日本海沿岸的小型区域，属60赫兹系统。'] },
  { id:'jp-kansai', name:['Kansai','関西'], prefs:['Shiga','Kyoto','Osaka','Hyogo','Nara','Wakayama'],
    note:['The second demand centre, and the nuclear restart region.','第二大需求中心，也是核电重启区域。'] },
  { id:'jp-chugoku', name:['Chugoku','中国'], prefs:['Tottori','Shimane','Okayama','Hiroshima','Yamaguchi'],
    note:['Transit area between Kansai and Kyushu.','关西与九州之间的过渡区域。'] },
  { id:'jp-shikoku', name:['Shikoku','四国'], prefs:['Tokushima','Kagawa','Ehime','Kochi'],
    note:['The smallest of the nine areas, connected by HVDC to Honshu.','九个区域中最小的一个，经高压直流与本州相连。'] },
  { id:'jp-kyushu', name:['Kyushu','九州'], prefs:['Fukuoka','Saga','Nagasaki','Kumamoto','Oita','Miyazaki','Kagoshima'],
    note:['The highest solar penetration in Japan and the origin of output-control curtailment.','日本光伏渗透率最高的区域，也是出力控制限电的起源地。'] },
];

const out = (zones, meta) => ({ ...meta, zones });

async function main(){
  console.log('fetching GISCO NUTS1 …');
  const l1 = await getJSON(GISCO_L1);
  const deStates = l1.features.filter(f => f.properties.CNTR_CODE === 'DE');
  console.log('  German states:', deStates.length);

  console.log('fetching GISCO NUTS2 …');
  const l2 = await getJSON(GISCO_L2);
  const itRegions = l2.features.filter(f => f.properties.CNTR_CODE === 'IT');
  console.log('  Italian regions:', itRegions.length);

  console.log('fetching Natural Earth admin-1 50m …');
  const ne50 = await getJSON(NE_ADMIN1_50M);
  const auStates = ne50.features.filter(f => f.properties.admin === 'Australia');
  console.log('  Australian states:', auStates.length);

  console.log('fetching Natural Earth admin-1 10m (40 MB, Japan prefectures) …');
  const ne10 = await getLarge(NE_ADMIN1_10M, 'NE_ADMIN1_10M_FILE');
  const jpPrefs = ne10.features.filter(f => f.properties.admin === 'Japan');
  console.log('  Japanese prefectures:', jpPrefs.length);

  // Germany — approximate, state groupings
  const de = DE_ZONES.map(z => ({
    id: z.id, name: z.name, operator: z.operator, note: z.note, approximate: true,
    geometry: combine(deStates.filter(f => z.states.includes(f.properties.NUTS_ID))),
  }));
  de.forEach(z => { if (!z.geometry.coordinates.length) throw new Error(`empty zone ${z.id}`); });

  // Italy — near-exact, region groupings
  const it = IT_ZONES.map(z => ({
    id: z.id, name: z.name, operator: 'Terna', note: z.note, approximate: true,
    geometry: combine(itRegions.filter(f => z.regions.includes(f.properties.NUTS_ID))),
  }));
  it.forEach(z => { if (!z.geometry.coordinates.length) throw new Error(`empty zone ${z.id}`); });

  // NEM — exact, states are the regions
  const nem = NEM_ZONES.map(z => ({
    id: z.id, name: z.name, operator: 'AEMO', note: z.note, approximate: false,
    geometry: combine(auStates.filter(f => z.states.includes(f.properties.name))),
  }));
  nem.forEach(z => { if (!z.geometry.coordinates.length) throw new Error(`empty zone ${z.id}`); });

  // Japan — exact, the nine areas are prefecture groups
  /* Natural Earth romanises with macrons — Ōita, Hyōgo, Kōchi — so the area
     lists above are matched against a de-accented form rather than being written
     twice. */
  const jpName = (f) => (f.properties.name_en || f.properties.name || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+(Prefecture|Ken|To|Fu|Do)$/i, '').trim();
  const jpZones = JP_AREAS.map(z => ({
    id: z.id, name: z.name, operator: 'OCCTO area', note: z.note, approximate: false,
    geometry: combine(jpPrefs.filter(f => z.prefs.includes(jpName(f)))),
  }));
  for (const z of jpZones){
    if (!z.geometry.coordinates.length) throw new Error(`empty zone ${z.id}`);
  }

  const writes = [
    ['src/markets/de/de-zones.json', out(de, {
      market:'de', title:'German TSO control areas',
      source:'Eurostat GISCO NUTS 2024 level 1', sourceUrl:'https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics',
      attribution:'© EuroGeographics for the administrative boundaries',
      accuracy:'approximate — control-area boundaries follow transmission ownership, not federal state lines' })],
    ['src/markets/it/it-zones.json', out(it, {
      market:'it', title:'Italian bidding zones',
      source:'Eurostat GISCO NUTS 2024 level 2', sourceUrl:'https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics',
      attribution:'© EuroGeographics for the administrative boundaries',
      accuracy:'approximate — zone borders follow region boundaries with local exceptions' })],
    ['src/markets/nem/nem-zones.json', out(nem, {
      market:'nem', title:'NEM pricing regions',
      source:'Natural Earth admin-1 states and provinces', sourceUrl:'https://www.naturalearthdata.com/downloads/50m-cultural-vectors/',
      attribution:'Natural Earth, public domain',
      accuracy:'exact — NEM regions are state boundaries, with the ACT settled inside NSW1' })],
    ['src/markets/jp/jp-zones.json', out(jpZones, {
      market:'jp', title:'Japanese area boundaries',
      source:'Natural Earth admin-1 states and provinces (10m)', sourceUrl:'https://www.naturalearthdata.com/downloads/10m-cultural-vectors/',
      attribution:'Natural Earth, public domain',
      accuracy:'exact — the nine areas are prefecture groups' })],
  ];

  for (const [rel, payload] of writes){
    await writeFile(resolve(ROOT, rel), JSON.stringify(payload) + '\n');
    console.log('wrote', rel, payload.zones.length, 'zones');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
