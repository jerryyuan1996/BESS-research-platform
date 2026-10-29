import fs from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoMercator, geoAlbersUsa, geoPath } from 'd3-geo';
const require=createRequire(import.meta.url);
const world=JSON.parse(fs.readFileSync(require.resolve('world-atlas/countries-110m.json'),'utf8'));
const countries=feature(world,world.objects.countries).features;
const ids={australia:36,germany:276,britain:826,ireland:372,romania:642,poland:616,japan:392,usa:840,finland:246,italy:380,canada:124,spain:724,saudi:682};
fs.mkdirSync('public/country-maps',{recursive:true});
for(const [name,id]of Object.entries(ids)){
  const country=countries.find(f=>Number(f.id)===id);
  const projection=(name==='usa'?geoAlbersUsa():geoMercator()).fitExtent([[8,8],[292,292]],country);
  const path=geoPath(projection).digits(1)(country);
  fs.writeFileSync('public/country-maps/'+name+'.svg',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><path fill="#a1bdaa" d="'+path+'"/></svg>\n');
}
console.log('Generated '+Object.keys(ids).length+' country outlines from world-atlas / Natural Earth.');
